# Hablá Salta para Android

App Android que lleva la web de Hablá Salta adentro, de modo que abre sin internet. Usa el micrófono y la voz del teléfono.

## Generar el APK

1. Abrir **Android Studio** → *File > Open* → elegir la carpeta `android` (esta carpeta, no la de arriba).
2. Esperar a que termine "Gradle sync" (la primera vez baja cosas, tarda unos minutos).
3. Menú *Build > Build App Bundle(s) / APK(s) > Build APK(s)*.
4. Cuando termine, tocar **locate**: el archivo queda en `app/build/outputs/apk/debug/app-debug.apk`.

Para publicarlo o compartirlo "en serio": *Build > Generate Signed App Bundle / APK* → APK → crear una clave nueva (¡guardala, sin ella no se puede actualizar la app!).

## Número de versión

En la esquina inferior derecha de la web y de la app se ve la versión, por ejemplo `v57`.
Sube sola: cada vez que se sube un cambio a GitHub, un proceso cuenta los cambios y escribe el número en `version.js`. No hay que tocar nada.
La última versión del APK está siempre en la pestaña **Releases** del repositorio (`HablaSalta.apk`).

## Actualizar la app

La web se copia sola dentro de la app en cada compilación. Si cambiás `index.html`, `script.js` o `styles.css`, volvé a generar el APK y subí `versionCode` en `app/build.gradle.kts`.
