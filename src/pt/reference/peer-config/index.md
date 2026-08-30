---
translation_locale: pt
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuração Iroha {#configuring-iroha}

A configuração local de peer é definida em arquivos TOML. Isto é diferente da configuração na cadeia alterada através das instruções [`SetParameter`](/pt/blockchain/instructions.md#setparameter). O comportamento de produção deve ser representado em um arquivo de configuração ou em um parâmetro na cadeia; as variáveis ambientais não são portões de características .

Use o argumento [`--config`](../iroha3d-cli#arg-config) CLI para especificar o caminho do arquivo de configuração.

## Modelo {#template}

Para obter uma descrição detalhada de cada parâmetro, consulte a referência [Parâmetros ](./params.md).

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Compostação de arquivos de configuração {#composing-configuration-files}

Os arquivos de configuração TOML possuem um campo adicional `extends`, apontando para outros arquivos TOML (s). Pode ser um único caminho ou vários caminhos:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

O Iroha irá ler recursivamente todos os ficheiros especificados no `extends` e compor-os em camadas, onde estas últimas sobreescrevem as anteriores a um nível de parâmetro. Por exemplo, se a leitura do `config.toml`:

::: code-group

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

A configuração resultante será: `chain` de `a.toml`, `max_content_len` de `b.toml`, e `torii.address` de `config.toml` (overwrites) `b.toml`).

## Resolução de problemas {#troubleshooting}

Passe a bandeira [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI para ver um rastro da forma como a configuração é lida e analisada.
