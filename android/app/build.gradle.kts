plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "ar.hablasalta.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "ar.hablasalta.app"
        minSdk = 24
        targetSdk = 35
        // El número de versión sale de version.js (el mismo que se ve en la esquina de la app).
        // GitHub lo pasa solo en cada compilación; si compilás a mano se lee de ese archivo.
        val webVersion = rootProject.projectDir.parentFile.resolve("version.js")
            .takeIf { it.exists() }
            ?.let { Regex("\"(\\d+)\"").find(it.readText())?.groupValues?.get(1)?.toIntOrNull() }
        versionCode = (project.findProperty("appVersionCode") as String?)?.toIntOrNull() ?: webVersion ?: 2
        versionName = (project.findProperty("appVersionName") as String?) ?: webVersion?.toString() ?: "1.1"
    }

    // Misma firma en todas las compilaciones, así cada APK nuevo se instala encima del anterior
    signingConfigs {
        getByName("debug") {
            storeFile = file("debug.keystore")
            storePassword = "android"
            keyAlias = "androiddebugkey"
            keyPassword = "android"
        }
    }

    // No frenar la versión final por avisos de estilo del código
    lint {
        checkReleaseBuilds = false
        abortOnError = false
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            isDebuggable = false
            // La firma de la versión final la pone el asistente de Android Studio con tu clave
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.12.1")
    // Traducción y detección de idioma sin internet (se descarga un paquete por idioma)
    implementation("com.google.mlkit:translate:17.0.3")
    implementation("com.google.mlkit:language-id:17.0.6")
}

// Copia la web (index.html, script.js, styles.css, etc.) de la carpeta de arriba
// dentro de la app en cada compilación. Así la app siempre lleva la última versión.
abstract class CopyWebTask : DefaultTask() {
    @get:InputFiles
    abstract val webFiles: ConfigurableFileCollection

    @get:OutputDirectory
    abstract val outputDir: DirectoryProperty

    @TaskAction
    fun copy() {
        val out = outputDir.get().asFile.resolve("www")
        out.deleteRecursively()
        out.mkdirs()
        webFiles.forEach { it.copyTo(out.resolve(it.name), overwrite = true) }
    }
}

val copyWeb = tasks.register<CopyWebTask>("copyWeb") {
    webFiles.from(fileTree(rootProject.projectDir.parentFile) {
        include("index.html", "*.js", "*.css", "*.jpg", "*.png", "manifest.json")
    })
}

androidComponents {
    onVariants { variant ->
        variant.sources.assets?.addGeneratedSourceDirectory(copyWeb, CopyWebTask::outputDir)
    }
}
