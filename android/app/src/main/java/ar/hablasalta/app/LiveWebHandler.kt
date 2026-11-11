package ar.hablasalta.app

import android.webkit.WebResourceResponse
import androidx.webkit.WebViewAssetLoader
import java.io.ByteArrayInputStream
import java.net.HttpURLConnection
import java.net.URL

/**
 * Sirve los archivos de la web (index.html, script.js, estilos...) desde la página publicada
 * en GitHub Pages cuando hay internet, así la app se actualiza sola sin generar otro APK.
 * Sin internet (o si algo falla) usa la copia que viene dentro del APK.
 * La dirección que ve la app es siempre la misma, por eso no se pierde lo descargado offline.
 */
class LiveWebHandler(
    private val bundled: WebViewAssetLoader.PathHandler,
    private val isOnline: () -> Boolean
) : WebViewAssetLoader.PathHandler {

    companion object {
        private const val LIVE_BASE = "https://jr8969662-beep.github.io/habla-salta-/"
        private val MIME = mapOf(
            "html" to "text/html", "js" to "application/javascript", "css" to "text/css",
            "json" to "application/json", "png" to "image/png", "jpg" to "image/jpeg",
            "jpeg" to "image/jpeg", "svg" to "image/svg+xml", "webp" to "image/webp"
        )
    }

    override fun handle(path: String): WebResourceResponse? {
        if (path.startsWith("www/") && isOnline()) {
            fetchLive(path.removePrefix("www/"))?.let { return it }
        }
        return bundled.handle(path)
    }

    private fun fetchLive(name: String): WebResourceResponse? {
        if (name.isEmpty() || name.contains("..")) return null
        var conn: HttpURLConnection? = null
        return try {
            conn = (URL(LIVE_BASE + name).openConnection() as HttpURLConnection).apply {
                connectTimeout = 4000
                readTimeout = 7000
                useCaches = false
                instanceFollowRedirects = true
                setRequestProperty("Cache-Control", "no-cache")
            }
            if (conn.responseCode != 200) return null
            val bytes = conn.inputStream.use { it.readBytes() }
            val ext = name.substringAfterLast('.', "").lowercase()
            val mime = MIME[ext] ?: return null
            val encoding = if (mime.startsWith("text/") || mime.contains("javascript") || mime.contains("json")) "utf-8" else null
            WebResourceResponse(mime, encoding, 200, "OK",
                mapOf("Cache-Control" to "no-cache"), ByteArrayInputStream(bytes))
        } catch (e: Exception) {
            null
        } finally {
            conn?.disconnect()
        }
    }
}
