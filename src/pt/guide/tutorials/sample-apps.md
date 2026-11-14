---
translation_locale: pt
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: 0c4f2f3fc4efb9f883f597a3eea49c99431b711a0141eba70ac5a2524990dd73
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link
---
# Amostras e Receitas {#samples-and-recipes}

O repositório de origem Iroha contém SDK receitas e suítes de teste que rastreiam a mesma revisão que o nó.

## JavaScript Receitas {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes) contém exemplos focados para lotamento de transações determinísticas, SORA Nexus transferências de aplicativo, NFT e iteração de conta, ISO fluxos da ponte, e Torii transmissão. Cada receita documenta se ela funciona offline ou precisa de uma transmissão ao vivo Torii API ponto de extremidade.

## Swift e iOS {#swift-and-ios}

Use `IrohaSwift/Tests/IrohaSwiftTests` para exemplos verificados com o atual Swift SDK. Veja [Swift e iOS](/pt/guide/tutorials/swift.md) para configuração de pacote e ponte.

## Android {#android}

Para novos trabalhos Android, use os módulos Kotlin-primeiro `core-jvm`, `client-android` e `offline-wallet-android` descritos em [Kotlin, Android e Java](/pt/guide/tutorials/kotlin-java.md). O Kotlin SDK é o ponto de partida canônico para consumidores Android.
