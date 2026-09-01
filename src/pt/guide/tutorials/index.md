---
translation_locale: pt
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# SDK Tutoriais {#sdk-tutorials}

Estas páginas resumem os pontos de entrada do cliente Iroha 3 enviados a partir do espaço de trabalho principal, incluindo nomes de pacotes canônicos, caminhos de instalação e pontos de partida mínimos.

## Ordem Recomendada {#recommended-order}

1. [Instalar Iroha 3](/pt/get-started/install-iroha.md)
2. [Iniciar Iroha 3](/pt/get-started/launch-iroha.md)
3. Escolha um SDK:
   - [Rust](/pt/guide/tutorials/rust.md)
   - [Python](/pt/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/pt/guide/tutorials/javascript.md)
   - [Kotlin, Android e Java](/pt/guide/tutorials/kotlin-java.md)
   - [Swift e iOS](/pt/guide/tutorials/swift.md)
4. Revise o [aplicativos de exemplo](/pt/guide/tutorials/sample-apps.md) quando quiser uma referência completa do aplicativo cliente.
5. Use [Incorporar Kaigi](/pt/guide/tutorials/kaigi.md) quando quiser adicionar reuniões de áudio/vídeo com suporte a carteira no seu próprio aplicativo.
6. Use [Musubi pacotes](/pt/guide/tutorials/musubi.md) quando precisar de bibliotecas de origem Kotodama reutilizáveis com dependências de registro on-chain fixadas.

## Amostras {#samples}

O espaço de trabalho upstream contém JavaScript receitas e projetos de amostra Swift/iOS. Para Android, comece com os módulos Kotlin SDK e seus testes.

- [Visão geral dos aplicativos de exemplo](/pt/guide/tutorials/sample-apps.md)
- [Incorpore Kaigi em um aplicativo JavaScript](/pt/guide/tutorials/kaigi.md)

## Fonte da Verdade {#source-of-truth}

Todas as páginas SDK aqui são derivadas do espaço de trabalho upstream atual:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Espelho em Java da superfície Android do primeiro Kotlin)
- `IrohaSwift`
- `crates/musubi`

Em caso de dúvida, prefira o README e os metadados do pacote nesses diretórios; eles descrevem a revisão da fonte que você está construindo.
