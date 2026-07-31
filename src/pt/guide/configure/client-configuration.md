---
translation_locale: pt
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuração do cliente {#client-configuration}

Iroha CLI e SDK Clientes utilizam TOML Configuração. O repositório envia o atual padrão em `defaults/client.toml`; gerado redes locais também escrever uma correspondência `client.toml` para o seu diretório de saída.

::: details Modelo de configuração do cliente

<<< @/snippets/client.template.toml

:::

## Campos do núcleo {#core-fields}

Uma configuração de cliente identifica, no mínimo, a cadeia, o ponto final Torii e a conta de assinatura:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- O `chain` seleciona a cadeia à qual pertencem as transações apresentadas.
- `torii_url` pontos no ponto de comparação Torii HTTP API.
- O `[account].domain` é utilizado por atalhos CLI e codificação do selector de endereço; o canônico `AccountId` em si é sem domínio.
- As transações de assinatura `[account].public_key` e `[account].private_key`.

A conta deve já existir na cadeia. Para a rede local padrão, isso é tratado pelo manifesto de gênese em conjunto.

::: info Sensibilidade do caso

Os nomes Iroha são sensíveis ao caso após a análise canônica. Por exemplo, `wonderland.universal`, `Wonderland.universal` e `looking_glass.universal` são dominios literários distintos.

:::

## A autenticação básica {#basic-authentication}

A seção opcional `[basic_auth]` adiciona um cabeçalho HTTP `Authorization` às solicitações do cliente. Os pares Iroha não interpretam essas credenciais diretamente; use-as quando Torii está por trás de um proxy inverso, como o Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Configuração de transações {#transaction-settings}

O comportamento da transação é configurado com a secção `[transaction]`:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` é a duração da transacção em milissegundos.
- `status_timeout_ms` controla o tempo de espera do cliente pelo status da transacção.
- `nonce = true` pede ao cliente que inclua um não para que as transações repetidas produzam hashes diferentes.

## Conectar as configurações de fila {#connect-queue-settings}

Os clientes atuais Iroha podem também usar a seção opcional `[connect]` para o estado local da fila:

```toml
[connect]
queue_root = "./queue"
```

Use isto quando um fluxo de trabalho precisa de armazenamento duradouro na fila do lado do cliente.

## Geração de configurações {#generating-configurations}

Para redes locais descartáveis, preferir: Kagami Porque ele escreve coincidência Iroha 3 Configuras, gênese, scripts e um README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Utilize o `./localnet/client.toml` gerado com o CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
