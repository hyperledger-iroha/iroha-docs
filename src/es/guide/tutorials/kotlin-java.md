---
translation_locale: es
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 804ef15b3d5ecdfae9fd559d3f312772571938ed9872f4adbd251baa3471e4e2
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Kotlin, Android, y Java {#kotlin-android-and-java}

El Kotlin SDK es la pila de cliente predeterminada para aplicaciones JVM y Android. Se encuentra bajo `kotlin/` en el repositorio Iroha y está dividido por plataforma para que el código portátil no adquiera dependencias Android.

## Módulos {#modules}

|Artefacto|Tipo|Usar|
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |Puro Kotlin/JVM Norito, modelo de datos, criptografía, transacción, Torii y código de protocolo|
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android almacén de claves, telemetría del dispositivo y integraciones de cliente respaldadas por JNI |
| `org.hyperledger.iroha.sdk:kagemusha-wallet-android` | AAR | Android transporte de billetera fuera de línea e integración construida sobre `client-android` |

Los artefactos aún no se han publicado en Maven Central. Compílalos y publícalos localmente desde la revisión de fuente fijada Iroha:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Luego selecciona solo el artefacto que tu aplicación necesita:

```kotlin
repositories {
    mavenLocal()
}

dependencies {
    implementation("org.hyperledger.iroha.sdk:core-jvm:0.1.0")
    // Android client features:
    // implementation("org.hyperledger.iroha.sdk:client-android:0.1.0")
    // Android offline-wallet features:
    // implementation("org.hyperledger.iroha.sdk:kagemusha-wallet-android:0.1.0")
}
```

`core-jvm` no contiene dependencias de Android. Mantenga el código del cliente y del almacén de claves Android en `client-android`, y use `kagemusha-wallet-android` solo para flujos Android de billetera offline y JNI.

## Kotlin y compatibilidad con Java {#kotlin-and-java-compatibility}

La API pública está orientada principalmente a Kotlin y es la implementación canónica para los llamadores de Java; las pruebas de consumidores con código fuente Java en `core-jvm` la ejercitan directamente. El árbol `java/` contiene implementaciones duplicadas que se están retirando e incorporando a los módulos de Kotlin. Las nuevas integraciones de Android deberían comenzar con los artefactos Kotlin mencionados arriba.

Todos los módulos Kotlin aplican la compatibilidad JDK 8 API en tiempo de compilación con `-Xjdk-release=8`, aunque la propia cadena de herramientas de compilación use JDK 21. No use JDK 9+ APIs en código SDK.

## Construir y Probar {#build-and-test}

Ejecute las pruebas de JVM con la biblioteca `connect_norito_bridge` compilada desde el mismo código fuente en `IROHA_NATIVE_LIBRARY_PATH` y `kotlin-fixture-gen` en `IROHA_KOTLIN_FIXTURE_GEN_BIN`, como se describe en el README del SDK de Kotlin; sin ellas, las pruebas que dependen del código nativo fallan:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Construye los artefactos Android:

```bash
./gradlew :client-android:assembleRelease \
  :kagemusha-wallet-android:assembleRelease --quiet
```

## Cobertura Actual {#current-coverage}

El Kotlin SDK incluye:

- Norito codificación y decodificación
- manejo canónico de cuentas y direcciones de activos
- construcción de transacciones, firma y contenedores de datos fuera de línea
- Clientes Torii HTTP, WebSocket y SSE
- multifirma, suscripción, SoraFS, SORA Nexus y modelos Connect
- Android integraciones de almacenamiento de claves y telemetría de dispositivos
- Android fuera de línea QR, Cercano, y NFC transportes

Consulte el [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/kotlin/README.md) para APIs específicos del módulo y comandos exactos de compilación.
