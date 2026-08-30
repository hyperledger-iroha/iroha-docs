---
translation_locale: pt
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 62d6f434e5af4213420c456ee27ebdc260c8b0e9f7a85bc3ba955ee9c79a058d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android e Java {#kotlin-android-and-java}

O Kotlin SDK é a pilha de cliente padrão para as aplicações JVM e Android. Ele vive sob `kotlin/` no repositório Iroha e é dividido por plataforma, de modo que o código portátil não adquire dependências de Android.

## Módulos {#modules}

|Artefacto|Tipo .|Utilização |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |Pure Kotlin/JVM Norito, modelo de dados, criptografia, transação, Torii e código de protocolo |
|`org.hyperledger.iroha.sdk:client-android` |AAR | Android armazenamento de chaves, telemetria do dispositivo e JNI- integrações de clientes apoiadas |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android Transporte e integração de carteiras offline baseadas em `client-android` |

Os artefatos ainda não foram publicados no Maven Central. Construí-los e publicá-los localmente a partir da revisão de fonte fichada Iroha:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Em seguida, selecione apenas o artefato de que a sua aplicação necessita:

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

`core-jvm` não contém dependências de Android. Mantenha o código do cliente e armazenamento-chave Android em `client-android`, e use `offline-wallet-android` apenas para carteira offline e fluxos JNI de Android

## Kotlin e Compatibilidade com o Java {#kotlin-and-java-compatibility}

O público API é Kotlin- primeiro e fornece interop de Java onde JVM As mudanças equivalentes são refletidas nos correspondentes `java/` Implementação. Android As integrações devem começar com a Kotlin Os artefatos acima.

Todos . Kotlin módulos de aplicação JDK 8 API Compatibilidade no momento da compilação com `-Xjdk-release=8`, Embora a própria cadeia de ferramentas de construção use JDK 21. Não use JDK 9+ APIs em SDK Código.

## Construir e testar {#build-and-test}

Realizar os testes portáteis JVM:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Construir os artefatos Android:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Cobertura atual {#current-coverage}

O Kotlin SDK inclui:

- Norito codificação e decodificação
- Gestão de contas canônicas e endereços de activos
- Construção de transações, assinatura e envelopes offline
- Clientes Torii HTTP, WebSocket e SSE
- Modelos de assinatura múltipla, assinatura, SoraFS, Nexus e Connect
- Android Integrações de teclado e telemetria do dispositivo
- Transporte Android desconectado QR, Próximo e NFC

Consulte o [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md) para os comandos de construção específicos do módulo APIs e exatos.
