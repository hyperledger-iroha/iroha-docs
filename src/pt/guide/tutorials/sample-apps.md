---
translation_locale: pt
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: 71258f4da9afcd94afce2fc2a53ce43540d8f67054ea789f0b2d105daba26006
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# amostras e receitas {#samples-and-recipes}

O repositório de fontes Iroha contém receitas e conjuntos de testes SDK que seguem a mesma revisão do nó.

## JavaScript Recetas {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes) Conta com exemplos focados de lotes de transações deterministas, Nexus Transferências de aplicações, NFT e a iteração da conta, ISO fluxos de ponte, e Torii Cada receita documenta se é executada offline ou precisa de um live Torii ponto final.

## Swift e iOS {#swift-and-ios}

Use `IrohaSwift/Tests/IrohaSwiftTests` para exemplos verificados em relação à corrente Swift SDK. Veja [Swift e iOS ](/pt/guide/tutorials/swift.md) para configuração do pacote e da ponte.

## Android {#android}

Para novos trabalhos Android utilize os módulos Kotlin-first `core-jvm`, `client-android` e `offline-wallet-android` descritos em [Kotlin, Android e Java](/pt/guide/tutorials/kotlin-java.md). O Kotlin SDK é o ponto de partida canônico para consumidores Android.
