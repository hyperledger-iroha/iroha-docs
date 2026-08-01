---
translation_locale: pt
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Snippets de código {#code-snippets}

Os fragmentos gerados mantêm exemplos ligados ao código, configuração e esquemas da revisão Iroha que os produziram.

## Artifactos refrescantes Iroha {#refreshing-iroha-artifacts}

Os fragmentos derivados de Iroha são verificados para que as edificações comuns do site não necessitem de acesso à rede ou um repositório irmão.

```bash
pnpm refresh:iroha --source /path/to/iroha
```

O check-in [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) fluxo de trabalho verifica o checkout da fonte limpa em relação ao `provenance/iroha.json`, Regeneração `/src/snippets` e o Torii OpenAPI Instantánea e atualizações SHA-256 hashes. Revisar o conteúdo e as mudanças de proveniência juntos. VitePress construções consomem os arquivos registrados sem obter um ramo mutável.

## Incluindo Snippets {#including-snippets}

Use a sintaxe [VitePress código-snippet](https://vitepress.dev/guide/markdown#import-code-snippets) para incluir fonte gerada ou local:

```md
<<< @/snippets/client.template.toml
```

Uma região de código com nome pode ser incluída adicionando o seu nome de região:

```md
<<< @/example_code/lorem.rs#ipsum
```

Mantenha os exemplos escritos à mão pequenos. Prefira artefatos de fonte atualizados para interfaces públicas, modelos de configuração, esquemas gerados e saída de comando.
