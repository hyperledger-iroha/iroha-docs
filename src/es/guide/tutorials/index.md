---
translation_locale: es
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK Los tutoriales {#sdk-tutorials}

Estas páginas resumen los puntos de entrada del cliente Iroha 3 enviados desde el espacio principal de trabajo, incluidos los nombres canónicos de paquetes, las vías de instalación y los mínimos puntos de partida.

## Orden recomendada {#recommended-order}

1. [Instalar Iroha 3](/es/get-started/install-iroha.md)
2. [Lanzamiento Iroha 3](/es/get-started/launch-iroha.md)
3. Seleccione un SDK:
   - [Rust](/es/guide/tutorials/rust.md)
   - [Python](/es/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/es/guide/tutorials/javascript.md)
   - [Kotlin, Android y Java](/es/guide/tutorials/kotlin-java.md)
   - [Swift y iOS](/es/guide/tutorials/swift.md)
4. Revise la muestra de aplicaciones [ ](/es/guide/tutorials/sample-apps.md) cuando desee una referencia completa de la aplicación del cliente.
5. Utilice [Embed Kaigi](/es/guide/tutorials/kaigi.md) cuando desee agregar reuniones de audio/video respaldadas por cartera a su propia aplicación.
6. Utilice los paquetes [Musubi](/es/guide/tutorials/musubi.md) cuando necesite bibliotecas fuentes reutilizables Kotodama con dependencias de registro en cadena fijadas.

## Muestras {#samples}

El espacio de trabajo ascendente contiene recetas JavaScript y proyectos de muestra Swift/iOS. Para Android, comience con los módulos Kotlin SDK y sus pruebas.

- [Muestras de aplicaciones en general](/es/guide/tutorials/sample-apps.md)
- [Embedado Kaigi en una aplicación JavaScript ](/es/guide/tutorials/kaigi.md)

## Fuente de la verdad {#source-of-truth}

Todas las páginas SDK aquí se derivan del actual espacio de trabajo ascendente:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Espejo de Java del Kotlin-Primero Android superficie)
- `IrohaSwift`
- `crates/musubi`

En caso de dudas, prefiera los metadatos README y paquetes en esos directorios; describen la revisión de origen que está construyendo.
