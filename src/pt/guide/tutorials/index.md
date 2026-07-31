---
translation_locale: pt
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK Tutoriais {#sdk-tutorials}

Essas páginas resumem os pontos de entrada do cliente Iroha 3 enviados a partir do espaço principal de trabalho, incluindo nomes canônicos dos pacotes, caminhos de instalação e mínimos pontos de partida.

## Ordem recomendada {#recommended-order}

1. [Instalação Iroha 3](/pt/get-started/install-iroha.md)
2. [Lançamento Iroha 3](/pt/get-started/launch-iroha.md)
3. Escolher um SDK:
   - [Rust](/pt/guide/tutorials/rust.md)
   - [Python](/pt/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/pt/guide/tutorials/javascript.md)
   - [Kotlin, Android e Java](/pt/guide/tutorials/kotlin-java.md)
   - [Swift e iOS](/pt/guide/tutorials/swift.md)
4. Revise o [ exemplo de aplicativos ](/pt/guide/tutorials/sample-apps.md) quando deseja uma referência completa do aplicativo cliente.
5. Use [Embed Kaigi](/pt/guide/tutorials/kaigi.md) quando quiser adicionar reuniões de áudio/vídeo suportadas por carteira ao seu próprio app.
6. Use os pacotes [Musubi](/pt/guide/tutorials/musubi.md) quando você precisar de bibliotecas de fontes reutilizáveis Kotodama com dependências de registro em cadeia.

## amostras {#samples}

O espaço de trabalho upstream contém receitas JavaScript e projetos de amostragem Swift/iOS. Para Android, comece com os módulos Kotlin SDK e seus testes.

- [Análise geral das aplicações de amostra](/pt/guide/tutorials/sample-apps.md)
- [Incorporado Kaigi em um aplicativo JavaScript ](/pt/guide/tutorials/kaigi.md)

## Fonte da Verdade {#source-of-truth}

Todas as páginas SDK aqui são derivadas do espaço de trabalho upstream atual:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (O espelho Java do Kotlin- Primeiro. Android superfície)
- `IrohaSwift`
- `crates/musubi`

Quando em dúvida, prefira os metadados README e pacotes nesses diretórios; eles descrevem a revisão da fonte que você está construindo.
