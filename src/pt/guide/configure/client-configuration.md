---
translation_locale: pt
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Configuração do Cliente {#client-configuration}

Os clientes Iroha CLI e SDK usam a configuração TOML. O repositório fornece a configuração padrão atual em `defaults/client.toml`; redes locais geradas também escrevem um `client.toml` correspondente em seu diretório de saída.

::: details Modelo de configuração do cliente

<<< @/snippets/client.template.toml

:::

## Campos Principais {#core-fields}

No mínimo, uma configuração de cliente identifica a cadeia, sua identidade de rede, o endpoint de serviço Torii, o contexto de rede da conta e a chave de assinatura:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` seleciona a cadeia à qual as transações enviadas pertencem.
- `network_id` é a identidade da rede derivada da gênese, à qual toda solicitação assinada se vincula. Configure exatamente um dos campos `network_id` ou `network_id_file`; um nó anuncia o valor em `GET /v1/accounts/capabilities`.
- `torii_url` aponta para o par de rede Torii HTTP API.
- `[account].chain_discriminant` seleciona o prefixo I105 das contas da rede. Nas redes públicas, pode-se usar `[account].profile = "taira"` ou `"minamoto"` em seu lugar. É obrigatório definir um desses dois campos, e o próprio `AccountId` canônico não contém domínio.
- `[account].public_key` e `[account].private_key` assinam transações; `private_key_file` pode substituir `private_key`.

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

A CLI `iroha` também lê uma seção opcional `[connect]` para o estado da fila local. A configuração reutilizável do SDK não aceita essa seção:

```toml
[connect]
queue_root = "./queue"
```

Use essa opção quando o fluxo de trabalho precisar de armazenamento durável de fila no cliente. O valor padrão de `connect.queue_root` é `~/.iroha/connect`, e caminhos relativos são resolvidos a partir do diretório que contém o arquivo TOML do cliente.

## Gerando Configurações {#generating-configurations}

Para redes locais descartáveis, prefira Kagami porque ele grava as configurações correspondentes Iroha 3, o gênesis da blockchain, scripts e um README:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Use o `./localnet/client.toml` gerado com o CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
