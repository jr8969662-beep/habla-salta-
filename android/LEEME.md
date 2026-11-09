# Hablá Salta para Android

App Android que lleva la web de Hablá Salta adentro, de modo que abre sin internet. Usa el micrófono y la voz del teléfono.

## Generar el APK

1. Abrir **Android Studio** → *File > Open* → elegir la carpeta `android` (esta carpeta, no la de arriba).
2. Esperar a que termine "Gradle sync" (la primera vez baja cosas, tarda unos minutos).
3. Menú *Build > Build App Bundle(s) / APK(s) > Build APK(s)*.
4. Cuando termine, tocar **locate**: el archivo queda en `app/build/outputs/apk/debug/app-debug.apk`.

Para publicarlo o compartirlo "en serio": *Build > Generate Signed App Bundle / APK* → APK → crear una clave nueva (¡guardala, sin ella no se puede actualizar la app!).

## Número de versión

En la esquina inferior derecha de la app se ve la versión instalada, por ejemplo `v1.12 (12)`.
Sube sola: GitHub compila el APK en cada cambio y le pone `1.<número de compilación>`.
La última versión está siempre en la pestaña **Releases** del repositorio (`HablaSalta.apk`).
Si compilás a mano en Android Studio se usa el valor por defecto de `app/build.gradle.kts`.
En el navegador (sin la app) se muestra `web`.

## Actualizar la app

La web se copia sola dentro de la app en cada compilación. Si cambiás `index.html`, `script.js` o `styles.css`, volvé a generar el APK y subí `versionCode` en `app/build.gradle.kts`.
