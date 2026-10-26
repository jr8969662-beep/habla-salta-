package ar.hablasalta.app

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.view.ViewGroup
import android.webkit.GeolocationPermissions
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.Toast
import androidx.webkit.ServiceWorkerClientCompat
import androidx.webkit.ServiceWorkerControllerCompat
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewFeature
import org.json.JSONObject
import java.util.Locale

class MainActivity : Activity() {

    companion object {
        // La web se sirve desde los assets con una dirección https "falsa",
        // así funcionan el service worker, el caché y la ubicación.
        private const val HOST = "appassets.androidplatform.net"
        private const val START_URL = "https://$HOST/assets/www/index.html"
        private const val REQ_MIC = 1
        private const val REQ_LOCATION = 2
    }

    private lateinit var webView: WebView
    private lateinit var assetLoader: WebViewAssetLoader

    private var speechRecognizer: SpeechRecognizer? = null
    private var pendingListenLang: String? = null

    private var tts: TextToSpeech? = null
    private var ttsReady = false
    private var pendingSpeak: Pair<String, String>? = null

    private var geoOrigin: String? = null
    private var geoCallback: GeolocationPermissions.Callback? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        assetLoader = WebViewAssetLoader.Builder()
            .setDomain(HOST)
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView = WebView(this)
        val root = FrameLayout(this)
        root.addView(webView, FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        // Android 15+ dibuja la app debajo de las barras del sistema: se compensa con márgenes
        if (Build.VERSION.SDK_INT >= 35) {
            root.setOnApplyWindowInsetsListener { v, insets ->
                val bars = insets.getInsets(android.view.WindowInsets.Type.systemBars()
                        or android.view.WindowInsets.Type.ime())
                v.setPadding(bars.left, bars.top, bars.right, bars.bottom)
                insets
            }
        }
        setContentView(root)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            setGeolocationEnabled(true)
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_DEFAULT
            allowFileAccess = false
            allowContentAccess = false
        }

        webView.addJavascriptInterface(AndroidBridge(), "HablaAndroid")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? =
                assetLoader.shouldInterceptRequest(request.url)

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url
                if (url.host == HOST) return false
                // Teléfonos, Google Maps y otros enlaces: abrir con la app que corresponda
                openExternal(url)
                return true
            }
        }

        // El service worker (mapa sin internet) también tiene que leer los archivos de la app
        if (WebViewFeature.isFeatureSupported(WebViewFeature.SERVICE_WORKER_BASIC_USAGE)) {
            ServiceWorkerControllerCompat.getInstance().setServiceWorkerClient(
                object : ServiceWorkerClientCompat() {
                    override fun shouldInterceptRequest(request: WebResourceRequest): WebResourceResponse? =
                        assetLoader.shouldInterceptRequest(request.url)
                })
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onGeolocationPermissionsShowPrompt(
                origin: String, callback: GeolocationPermissions.Callback
            ) {
                if (hasPermission(Manifest.permission.ACCESS_FINE_LOCATION) ||
                    hasPermission(Manifest.permission.ACCESS_COARSE_LOCATION)) {
                    callback.invoke(origin, true, true)
                } else {
                    geoOrigin = origin
                    geoCallback = callback
                    requestPermissions(arrayOf(
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION), REQ_LOCATION)
                }
            }
        }

        tts = TextToSpeech(this) { status ->
            ttsReady = status == TextToSpeech.SUCCESS
            pendingSpeak?.let { (t, l) -> speakNow(t, l) }
            pendingSpeak = null
        }

        if (savedInstanceState != null) webView.restoreState(savedInstanceState)
        else webView.loadUrl(START_URL)
    }

    // ---------- Puente con la web ----------
    inner class AndroidBridge {
        @JavascriptInterface
        fun startListening(lang: String?) = runOnUiThread { startListeningNow(lang ?: "es-AR") }

        @JavascriptInterface
        fun stopListening() = runOnUiThread { speechRecognizer?.stopListening() }

        @JavascriptInterface
        fun speak(text: String?, lang: String?) = runOnUiThread {
            if (text.isNullOrBlank()) return@runOnUiThread
            if (ttsReady) speakNow(text, lang ?: "es-AR") else pendingSpeak = text to (lang ?: "es-AR")
        }

        @JavascriptInterface
        fun stopSpeaking() = runOnUiThread { tts?.stop() }
    }

    // ---------- Voz a texto ----------
    private fun startListeningNow(lang: String) {
        if (!hasPermission(Manifest.permission.RECORD_AUDIO)) {
            pendingListenLang = lang
            requestPermissions(arrayOf(Manifest.permission.RECORD_AUDIO), REQ_MIC)
            return
        }
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            Toast.makeText(this, "Este teléfono no tiene reconocimiento de voz (instalá la app de Google).",
                Toast.LENGTH_LONG).show()
            js("onError", "not-supported")
            return
        }
        speechRecognizer?.destroy()
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this).apply {
            setRecognitionListener(object : RecognitionListener {
                override fun onReadyForSpeech(params: Bundle?) = js("onStart")
                override fun onResults(results: Bundle?) {
                    val text = results
                        ?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        ?.firstOrNull().orEmpty()
                    if (text.isNotEmpty()) js("onResult", text) else js("onError", "no-speech")
                    js("onEnd")
                }
                override fun onError(error: Int) {
                    val code = when (error) {
                        SpeechRecognizer.ERROR_NO_MATCH,
                        SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "no-speech"
                        SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "not-allowed"
                        SpeechRecognizer.ERROR_NETWORK,
                        SpeechRecognizer.ERROR_NETWORK_TIMEOUT,
                        SpeechRecognizer.ERROR_SERVER -> "network"
                        else -> "error-$error"
                    }
                    js("onError", code)
                    js("onEnd")
                }
                override fun onBeginningOfSpeech() {}
                override fun onRmsChanged(rmsdB: Float) {}
                override fun onBufferReceived(buffer: ByteArray?) {}
                override fun onEndOfSpeech() {}
                override fun onPartialResults(partialResults: Bundle?) {}
                override fun onEvent(eventType: Int, params: Bundle?) {}
            })
        }
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, lang)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
        }
        speechRecognizer?.startListening(intent)
    }

    // ---------- Texto a voz ----------
    private fun speakNow(text: String, lang: String) {
        val engine = tts ?: return
        val result = engine.setLanguage(Locale.forLanguageTag(lang))
        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
            Toast.makeText(this, "Falta la voz de este idioma en el teléfono. " +
                "Se puede bajar en Ajustes > Texto a voz.", Toast.LENGTH_LONG).show()
        }
        engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, "habla")
    }

    // Llama a window.__androidSpeech.<fn>(arg) en la web
    private fun js(fn: String, arg: String? = null) {
        val a = if (arg == null) "" else JSONObject.quote(arg)
        webView.post {
            webView.evaluateJavascript(
                "window.__androidSpeech && window.__androidSpeech.$fn($a)", null)
        }
    }

    // ---------- Utilidades ----------
    private fun hasPermission(p: String) = checkSelfPermission(p) == PackageManager.PERMISSION_GRANTED

    private fun openExternal(uri: Uri) {
        try {
            startActivity(Intent(Intent.ACTION_VIEW, uri))
        } catch (e: ActivityNotFoundException) {
            Toast.makeText(this, "No hay una app para abrir este enlace.", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        val granted = grantResults.any { it == PackageManager.PERMISSION_GRANTED }
        when (requestCode) {
            REQ_MIC -> {
                val lang = pendingListenLang
                pendingListenLang = null
                if (granted && lang != null) startListeningNow(lang) else js("onError", "not-allowed")
            }
            REQ_LOCATION -> {
                geoCallback?.invoke(geoOrigin, granted, granted)
                geoCallback = null
                geoOrigin = null
            }
        }
    }

    @Deprecated("Botón atrás")
    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else @Suppress("DEPRECATION") super.onBackPressed()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onPause() {
        super.onPause()
        tts?.stop()
    }

    override fun onDestroy() {
        speechRecognizer?.destroy()
        tts?.shutdown()
        webView.destroy()
        super.onDestroy()
    }
}
