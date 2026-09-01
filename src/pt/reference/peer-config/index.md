---
translation_locale: pt
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Configurando Iroha {#configuring-iroha}

A configuração local dos pares de rede é definida em arquivos TOML. Ela difere da configuração na cadeia, alterada por instruções [`SetParameter`](/pt/blockchain/instructions.md#setparameter). O comportamento de produção deve estar representado em um arquivo de configuração ou em um parâmetro na cadeia; variáveis de ambiente não funcionam como sinalizadores de recursos.

Usar [`--config`](../iroha3d-cli#arg-config) CLI argumento para especificar o caminho para o arquivo de configuração.

## Modelo {#template}

Para uma descrição detalhada de cada parâmetro, por favor consulte a referência [Parâmetros](./params.md).

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Compondo arquivos de configuração {#composing-configuration-files}

Os arquivos de configuração TOML possuem um campo adicional `extends`, apontando para outros arquivos TOML. Pode ser um único caminho ou múltiplos caminhos:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha irá ler recursivamente todos os arquivos especificados em `extends` e compô-los em camadas, onde os arquivos posteriores sobrescrevem os anteriores em nível de parâmetro. Por exemplo, ao ler `config.toml`:

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

A configuração resultante será `chain` de `a.toml`, `max_content_len` de `b.toml` e `torii.address` de `config.toml` (substitui `b.toml`).

## Solução de problemas {#troubleshooting}

Passar [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI flag para ver um traço de como a configuração é lida e analisada.
