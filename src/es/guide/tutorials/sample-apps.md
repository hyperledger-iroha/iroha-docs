---
translation_locale: es
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: 4979ab2c52eba4040d7f003f3da73dbc333fa7e047b0259816d0d34f97377749
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Muestras y recetas {#samples-and-recipes}

El repositorio de origen Iroha contiene SDK recetas y conjuntos de pruebas que rastrean la misma revisión que el nodo.

## JavaScript Recetas {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes) contiene ejemplos enfocados para la agrupación determinista de transacciones, Nexus transferencias de aplicaciones, NFT y iteración de cuentas, ISO flujos de puente, y Torii transmisión. Cada receta documenta si funciona sin conexión o necesita estar en vivo Torii API punto final.

## Swift y iOS {#swift-and-ios}

Use `IrohaSwift/Tests/IrohaSwiftTests` para ejemplos verificados con el actual Swift SDK. Vea [Swift y iOS](/es/guide/tutorials/swift.md) para la configuración del paquete y del puente.

## Android {#android}

Para el nuevo trabajo Android, use los módulos Kotlin-first `core-jvm`, `client-android` y `offline-wallet-android` descritos en [Kotlin, Android, y Java](/es/guide/tutorials/kotlin-java.md). El Kotlin SDK es el punto de partida canónico para los consumidores de Android.
