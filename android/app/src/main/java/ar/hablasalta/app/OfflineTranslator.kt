package ar.hablasalta.app

import com.google.mlkit.common.model.DownloadConditions
import com.google.mlkit.common.model.RemoteModelManager
import com.google.mlkit.nl.languageid.LanguageIdentification
import com.google.mlkit.nl.translate.TranslateLanguage
import com.google.mlkit.nl.translate.TranslateRemoteModel
import com.google.mlkit.nl.translate.Translation
import com.google.mlkit.nl.translate.Translator
import com.google.mlkit.nl.translate.TranslatorOptions

/**
 * Traductor que funciona sin internet usando ML Kit.
 * Cada idioma necesita descargarse una vez (unos 30 MB). El inglés se usa como
 * puente automáticamente para pares como español ↔ coreano.
 */
class OfflineTranslator {

    private val translators = HashMap<String, Translator>()
    private val modelManager = RemoteModelManager.getInstance()
    private val langId by lazy { LanguageIdentification.getClient() }

    /** Código de ML Kit para una etiqueta como "es", "zh" o "en-US"; null si no se puede traducir offline. */
    private fun code(tag: String): String? =
        TranslateLanguage.fromLanguageTag(tag.substringBefore('-').lowercase())

    private fun translatorFor(src: String, tgt: String): Translator =
        translators.getOrPut("$src>$tgt") {
            Translation.getClient(
                TranslatorOptions.Builder()
                    .setSourceLanguage(src)
                    .setTargetLanguage(tgt)
                    .build()
            )
        }

    fun translate(text: String, from: String, to: String, onOk: (String) -> Unit, onErr: (String) -> Unit) {
        val src = code(from)
        val tgt = code(to)
        if (src == null || tgt == null) { onErr("unsupported"); return }
        if (src == tgt) { onOk(text); return }
        val translator = translatorFor(src, tgt)
        // Sin conexión solo funciona si los paquetes ya están descargados
        translator.downloadModelIfNeeded(DownloadConditions.Builder().build())
            .addOnSuccessListener {
                translator.translate(text)
                    .addOnSuccessListener { onOk(it) }
                    .addOnFailureListener { onErr("error: ${it.message}") }
            }
            .addOnFailureListener { onErr("model-missing") }
    }

    /** Descarga los paquetes de varios idiomas (separados por coma). Termina cuando todos están. */
    fun download(langs: List<String>, onOk: (String) -> Unit, onErr: (String) -> Unit) {
        val codes = langs.map { code(it) ?: run { onErr("unsupported:$it"); return } }.distinct()
        if (codes.isEmpty()) { onOk("0"); return }
        var pending = codes.size
        var failed = false
        codes.forEach { c ->
            val model = TranslateRemoteModel.Builder(c).build()
            modelManager.download(model, DownloadConditions.Builder().build())
                .addOnSuccessListener {
                    pending--
                    if (pending == 0 && !failed) onOk(codes.size.toString())
                }
                .addOnFailureListener {
                    if (!failed) { failed = true; onErr("download-failed") }
                }
        }
    }

    /** Devuelve los idiomas (de la lista) que ya están descargados, separados por coma. */
    fun downloaded(langs: List<String>, onResult: (String) -> Unit) {
        val pairs = langs.mapNotNull { l -> code(l)?.let { l to it } }
        if (pairs.isEmpty()) { onResult(""); return }
        val ready = ArrayList<String>()
        var pending = pairs.size
        pairs.forEach { (tag, c) ->
            modelManager.isModelDownloaded(TranslateRemoteModel.Builder(c).build())
                .addOnSuccessListener { if (it) ready.add(tag) }
                .addOnCompleteListener {
                    pending--
                    if (pending == 0) onResult(ready.joinToString(","))
                }
        }
    }

    fun delete(langs: List<String>, onDone: () -> Unit) {
        val codes = langs.mapNotNull { code(it) }.distinct()
        if (codes.isEmpty()) { onDone(); return }
        var pending = codes.size
        codes.forEach { c ->
            modelManager.deleteDownloadedModel(TranslateRemoteModel.Builder(c).build())
                .addOnCompleteListener { pending--; if (pending == 0) onDone() }
        }
    }

    /** Detecta el idioma de un texto, también sin internet. Devuelve "und" si no puede. */
    fun detect(text: String, onResult: (String) -> Unit) {
        langId.identifyLanguage(text)
            .addOnSuccessListener { onResult(it) }
            .addOnFailureListener { onResult("und") }
    }

    fun close() {
        translators.values.forEach { it.close() }
        translators.clear()
        langId.close()
    }
}
