---
translation_locale: es
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: f2411fec1cc35b1bf7795a7ab5a0eb7a8eb6b60b4799ebf3db47208b902f87e6
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kotlin, Android, y Java {#kotlin-android-and-java}

El Kotlin SDK es la pila de cliente predeterminada para aplicaciones JVM y Android. Se encuentra bajo `kotlin/` en el repositorio Iroha y está dividido por plataforma para que el código portátil no adquiera dependencias Android.

## Módulos {#modules}

|Artefacto|Tipo|Usar|
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |Puro Kotlin/JVM Norito, modelo de datos, criptografía, transacción, Torii y código de protocolo|
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android almacén de claves, telemetría del dispositivo y integraciones de cliente respaldadas por JNI |
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android transporte de billetera fuera de línea e integración construida sobre `client-android` |

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
    // implementation("org.hyperledger.iroha.sdk:offline-wallet-android:0.1.0")
}
```

`core-jvm` no contiene dependencias de Android. Mantenga el código del cliente y del almacén de claves Android en `client-android`, y use `offline-wallet-android` solo para flujos Android de billetera offline y JNI.

## Kotlin y compatibilidad con Java {#kotlin-and-java-compatibility}

El público API es Kotlin-primero y proporciona interoperabilidad con Java donde los llamadores JVM lo necesitan. Los cambios equivalentes se reflejan en la implementación correspondiente de `java/`. Las nuevas integraciones de Android deberían comenzar con los artefactos Kotlin mencionados arriba.

Todos los módulos Kotlin aplican la compatibilidad JDK 8 API en tiempo de compilación con `-Xjdk-release=8`, aunque la propia cadena de herramientas de compilación use JDK 21. No use JDK 9+ APIs en código SDK.

## Construir y Probar {#build-and-test}

Ejecute las pruebas portátiles JVM:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Construye los artefactos Android:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Cobertura Actual {#current-coverage}

El Kotlin SDK incluye:

- Norito codificación y decodificación
- manejo canónico de cuentas y direcciones de activos
- construcción de transacciones, firma y contenedores de datos fuera de línea
- Clientes Torii HTTP, WebSocket y SSE
- multifirma, suscripción, SoraFS, Nexus y modelos Connect
- Android integraciones de almacenamiento de claves y telemetría de dispositivos
- Android fuera de línea QR, Cercano, y NFC transportes

Consulte el [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md) para APIs específicos del módulo y comandos exactos de compilación.
