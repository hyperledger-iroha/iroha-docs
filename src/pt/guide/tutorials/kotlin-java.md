---
translation_locale: pt
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 804ef15b3d5ecdfae9fd559d3f312772571938ed9872f4adbd251baa3471e4e2
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Kotlin, Android e Java {#kotlin-android-and-java}

O Kotlin SDK é a pilha de cliente padrão para aplicações JVM e Android. Ele fica em `kotlin/` no repositório Iroha e é dividido por plataforma para que o código portátil não adquira dependências Android.

## Módulos {#modules}

|Artefato|Tipo| Usar |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |Pure Kotlin/JVM Norito, modelo de dados, cripto, transação, Torii e código de protocolo|
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android keystore, telemetria do dispositivo e integrações de cliente suportadas por JNI |
| `org.hyperledger.iroha.sdk:kagemusha-wallet-android` | AAR | Android transportes de carteira offline e integração construídos em `client-android` |

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
    // implementation("org.hyperledger.iroha.sdk:kagemusha-wallet-android:0.1.0")
}
```

`core-jvm` não contém dependências de Android. Mantenha o código do cliente e do keystore de Android em `client-android`, e use `kagemusha-wallet-android` apenas para fluxos offline-wallet e JNI de Android.

## Kotlin e Compatibilidade com Java {#kotlin-and-java-compatibility}

A API pública é voltada principalmente para Kotlin e é a implementação canônica para chamadores Java; os testes de consumidores com código-fonte Java em `core-jvm` a exercitam diretamente. A árvore `java/` contém implementações duplicadas que estão sendo retiradas e incorporadas aos módulos Kotlin. Novas integrações Android devem começar com os artefatos Kotlin acima.

Todos os módulos Kotlin aplicam a compatibilidade JDK 8 API em tempo de compilação com `-Xjdk-release=8`, mesmo que a cadeia de ferramentas de compilação use JDK 21. Não use JDK 9+ APIs no código SDK.

## Construir e Testar {#build-and-test}

Execute os testes JVM com a biblioteca `connect_norito_bridge` compilada a partir do mesmo código-fonte em `IROHA_NATIVE_LIBRARY_PATH` e `kotlin-fixture-gen` em `IROHA_KOTLIN_FIXTURE_GEN_BIN`, conforme descrito no README do SDK Kotlin; sem eles, os testes que dependem do código nativo falham:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Construa os artefatos Android:

```bash
./gradlew :client-android:assembleRelease \
  :kagemusha-wallet-android:assembleRelease --quiet
```

## Cobertura Atual {#current-coverage}

O Kotlin SDK inclui:

- Norito codificação e decodificação
- manuseio de contas canônicas e endereços de ativos
- construção de transação, assinatura e contêineres de dados offline
- Clientes Torii, HTTP, WebSocket e SSE
- multassinatura, assinatura, SoraFS, SORA Nexus e modelos Connect
- Android integrações de keystore e telemetria de dispositivo
- Android offline QR, Próximo, e NFC transportes

Veja o [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/kotlin/README.md) para APIs específico do módulo e comandos exatos de compilação.
