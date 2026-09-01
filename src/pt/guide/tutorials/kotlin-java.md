---
translation_locale: pt
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: f2411fec1cc35b1bf7795a7ab5a0eb7a8eb6b60b4799ebf3db47208b902f87e6
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kotlin, Android e Java {#kotlin-android-and-java}

O Kotlin SDK é a pilha de cliente padrão para aplicações JVM e Android. Ele fica em `kotlin/` no repositório Iroha e é dividido por plataforma para que o código portátil não adquira dependências Android.

## Módulos {#modules}

|Artefato|Tipo| Usar |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |Pure Kotlin/JVM Norito, modelo de dados, cripto, transação, Torii e código de protocolo|
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android keystore, telemetria do dispositivo e integrações de cliente suportadas por JNI |
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android transportes de carteira offline e integração construídos em `client-android` |

Os artefatos ainda não foram publicados no Maven Central. Construa e publique-os localmente a partir da revisão de origem fixada Iroha:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Então selecione apenas o artefato que seu aplicativo precisa:

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

`core-jvm` não contém dependências de Android. Mantenha o código do cliente e do keystore de Android em `client-android`, e use `offline-wallet-android` apenas para fluxos offline-wallet e JNI de Android.

## Kotlin e Compatibilidade com Java {#kotlin-and-java-compatibility}

O público API é Kotlin-primeiro e fornece interoperabilidade Java onde os chamadores JVM precisam. Mudanças equivalentes são espelhadas na implementação correspondente de `java/`. Novas integrações Android devem começar com os artefatos Kotlin acima.

Todos os módulos Kotlin aplicam a compatibilidade JDK 8 API em tempo de compilação com `-Xjdk-release=8`, mesmo que a cadeia de ferramentas de compilação use JDK 21. Não use JDK 9+ APIs no código SDK.

## Construir e Testar {#build-and-test}

Execute os testes portáteis JVM:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Construa os artefatos Android:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Cobertura Atual {#current-coverage}

O Kotlin SDK inclui:

- Norito codificação e decodificação
- manuseio de contas canônicas e endereços de ativos
- construção de transação, assinatura e contêineres de dados offline
- Clientes Torii, HTTP, WebSocket e SSE
- multassinatura, assinatura, SoraFS, Nexus e modelos Connect
- Android integrações de keystore e telemetria de dispositivo
- Android offline QR, Próximo, e NFC transportes

Veja o [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md) para APIs específico do módulo e comandos exatos de compilação.
