---
translation_locale: es
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 62d6f434e5af4213420c456ee27ebdc260c8b0e9f7a85bc3ba955ee9c79a058d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android y Java {#kotlin-android-and-java}

El Kotlin SDK es la pila de cliente predeterminada para las aplicaciones JVM y Android. Vive bajo `kotlin/` en el repositorio Iroha y se divide por plataforma, por lo que el código portátil no adquiere dependencias de Android .

## Los módulos {#modules}

|Artefacto .|Tipo |Usar |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |Pure Kotlin/JVM Norito, modelo de datos, criptografía, transacción, Torii y código de protocolo |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android almacenamiento de claves, telemetría de dispositivos e integraciones con clientes respaldadas por JNI |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android Transporte y integración de billeteras fuera de línea basado en `client-android` |

Los artefactos aún no han sido publicados en Maven Central. Construir y publicarlos localmente desde la revisión de fuente fijada Iroha:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Luego seleccione sólo el artefacto que necesita su aplicación:

```kotlin
repositories {
    mavenLocal()
}

dependencies {
    implementation("org.hyperledger.iroha.sdk:core-jvm:0.1.0")
    // Android client features:
    // implementation("org.hyperledger.iroha.sdk:client-android:0.1.0")
    // Android offline-wallet features:
    // implementation("org.hyperledger.iroha.sdk:offline-wallet-android:0.1.0")
}
```

`core-jvm` no contiene dependencias de Android. Mantenga el código de cliente y almacenamiento clave de Android en `client-android`, y utilice `offline-wallet-android` solo para cartera fuera de línea y flujos JNI de Android.

## Kotlin y compatibilidad con Java {#kotlin-and-java-compatibility}

El público API es Kotlin-en primer lugar y proporciona Java interop donde JVM los llamadores lo necesitan. los cambios equivalentes se reflejan en la correspondiente `java/` Implementación. Android las integraciones deben comenzar con la Kotlin Los artefactos de arriba.

Todo el mundo Kotlin módulos de aplicación JDK 8 API compatibilidad en el momento de compilar con `-Xjdk-release=8`, Aunque la cadena de herramientas de construcción en sí misma utiliza JDK 21. No se use JDK 9+ APIs en el SDK El código.

## Construye y prueba {#build-and-test}

Ejecutar las pruebas portátiles JVM:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Construir los artefactos de Android:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Cobertura actual {#current-coverage}

El Kotlin SDK incluye:

- Norito codificación y decodificación
- el manejo de la cuenta canónica y las direcciones de activos
- Construcción de transacciones, firma y sobres fuera de línea
- Los clientes de Torii HTTP, WebSocket y SSE
- Modelos de multisignatura, suscripción, SoraFS, Nexus y Connect
- Android Integraciones de teclado y telemetría del dispositivo
- Android fuera de línea QR, cercano y NFC transporte

Consulte el [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md) para los comandos de construcción específicos del módulo APIs y exactos.
