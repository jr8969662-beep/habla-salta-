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
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
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
