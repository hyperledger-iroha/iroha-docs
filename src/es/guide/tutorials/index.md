---
translation_locale: es
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# SDK Tutoriales {#sdk-tutorials}

Estas páginas resumen los puntos de entrada del cliente Iroha 3 enviados desde el espacio de trabajo principal, incluidos los nombres canónicos de los paquetes, las rutas de instalación y los puntos de inicio mínimos.

## Orden recomendado {#recommended-order}

1. [Instalar Iroha 3](/es/get-started/install-iroha.md)
2. [Lanzar Iroha 3](/es/get-started/launch-iroha.md)
3. Elige un SDK:
   - [Rust](/es/guide/tutorials/rust.md)
   - [Python](/es/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/es/guide/tutorials/javascript.md)
   - [Kotlin, Android, y Java](/es/guide/tutorials/kotlin-java.md)
   - [Swift y iOS](/es/guide/tutorials/swift.md)
4. Consulta el [aplicaciones de ejemplo](/es/guide/tutorials/sample-apps.md) cuando quieras una referencia completa de la aplicación cliente.
5. Usa [Incrustar Kaigi](/es/guide/tutorials/kaigi.md) cuando quieras agregar reuniones de audio/video respaldadas por billetera a tu propia aplicación.
6. Use [Musubi paquetes](/es/guide/tutorials/musubi.md) cuando necesite bibliotecas de origen Kotodama reutilizables con dependencias de registro en cadena fijadas.

## Muestras {#samples}

El espacio de trabajo ascendente contiene recetas JavaScript y proyectos de muestra Swift/iOS. Para Android, comienza con los módulos Kotlin SDK y sus pruebas.

- [Resumen de aplicaciones de ejemplo](/es/guide/tutorials/sample-apps.md)
- [Incrustar Kaigi en una aplicación JavaScript](/es/guide/tutorials/kaigi.md)

## Fuente de la verdad {#source-of-truth}

Todas las páginas SDK aquí provienen del espacio de trabajo corriente ascendente:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Espejo Java de la superficie Android inicial de Kotlin)
- `IrohaSwift`
- `crates/musubi`

En caso de duda, prefiera el README y los metadatos del paquete en esos directorios; describen la revisión de la fuente que está construyendo.
