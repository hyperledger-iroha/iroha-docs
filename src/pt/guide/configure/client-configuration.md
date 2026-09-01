---
translation_locale: pt
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Configuração do Cliente {#client-configuration}

Os clientes Iroha CLI e SDK usam a configuração TOML. O repositório fornece a configuração padrão atual em `defaults/client.toml`; redes locais geradas também escrevem um `client.toml` correspondente em seu diretório de saída.

::: details Modelo de configuração do cliente

<<< @/snippets/client.template.toml

:::

## Campos Principais {#core-fields}

No mínimo, uma configuração de cliente identifica a cadeia, o endpoint Torii API e a conta de assinatura:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` seleciona a cadeia à qual as transações enviadas pertencem.
- `torii_url` aponta para o par de rede Torii HTTP API.
- `[account].domain` é usado por atalhos e codificação de seletor de endereço do CLI; o `AccountId` canônico em si não tem domínio.
- `[account].public_key` e `[account].private_key` assinam transações.

A conta já deve existir na blockchain. Para a rede local padrão, isso é gerenciado pelo manifesto técnico de gênese da blockchain incluído.

::: info Diferenciação entre maiúsculas e minúsculas

Iroha os nomes são sensíveis a maiúsculas e minúsculas após a análise canônica. Por exemplo, `wonderland.universal`, `Wonderland.universal` e `looking_glass.universal` são literais de domínio distintos.

:::

## Autenticação Básica {#basic-authentication}

A seção opcional `[basic_auth]` adiciona um cabeçalho HTTP `Authorization` às solicitações do cliente. Os pares de rede Iroha não interpretam essas credenciais diretamente; use-as quando Torii estiver atrás de um proxy reverso, como o Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Configurações de Transação {#transaction-settings}

O comportamento da transação é configurado com a seção `[transaction]`:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` é o tempo de vida da transação em milissegundos.
- `status_timeout_ms` controla quanto tempo o cliente espera pelo status da transação.
- `nonce = true` solicita ao cliente que inclua um nonce para que transações repetidas produzam hashes diferentes.

## Conectar Configurações da Fila {#connect-queue-settings}

Clientes atuais Iroha também podem usar a seção opcional `[connect]` para o estado da fila local:

```toml
[connect]
queue_root = "./queue"
```

Use isto quando um fluxo de trabalho precisar de armazenamento de fila do lado do cliente durável.

## Gerando Configurações {#generating-configurations}

Para redes locais descartáveis, prefira Kagami porque ele grava as configurações correspondentes Iroha 3, o gênesis da blockchain, scripts e um README:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Use o `./localnet/client.toml` gerado com o CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
