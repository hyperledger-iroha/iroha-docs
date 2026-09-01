---
translation_locale: pt
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Trechos de Código {#code-snippets}

Os trechos gerados mantêm os exemplos vinculados ao código, configuração e esquemas da revisão Iroha que os produziu.

## Atualizando Iroha Artefatos {#refreshing-iroha-artifacts}

Trechos derivados de Iroha são verificados para que compilações comuns do site não precisem de acesso à rede ou de um repositório irmão. Atualize-os explicitamente:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

O fluxo de trabalho `etc/refresh-iroha.ts` verificado verifica o checkout de origem limpo contra `provenance/iroha.json`, regenera `/src/snippets` e a visualização de dados de ponto no tempo Torii OpenAPI, e atualiza os hashes criptográficos SHA-256. Revise o conteúdo e as alterações de proveniência juntos. A instalação normal de dependências e as compilações VitePress consomem os arquivos validados sem buscar um branch mutável.

## Incluindo Trechos {#including-snippets}

Use o [VitePress sintaxe de trecho de código](https://vitepress.dev/guide/markdown#import-code-snippets) para incluir a origem gerada ou local:

```md
<<< @/snippets/client.template.toml
```

Uma região de código nomeada pode ser incluída adicionando seu nome de região:

```md
<<< @/example_code/lorem.rs#ipsum
```

Mantenha os exemplos manuscritos pequenos. Prefira artefatos de origem atualizados para interfaces públicas, modelos de configuração, esquemas gerados e saída de comandos.
