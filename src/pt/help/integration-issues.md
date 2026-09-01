---
translation_locale: pt
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Solução de Problemas de Integração {#troubleshooting-integration-issues}

Esta seção oferece dicas de solução de problemas para a integração Iroha 3. Se o problema que você está enfrentando não estiver descrito aqui, entre em contato conosco via [Telegram](https://t.me/hyperledgeriroha).

## O cliente não consegue se conectar {#client-cannot-connect}

Verifique se a configuração do cliente aponta para o endereço Torii do par de rede:

```toml
torii_url = "http://127.0.0.1:8080/"
```

Para verificações CLI, passe o mesmo arquivo explicitamente:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Se o par de rede estiver executando em Docker ou Kubernetes, use o endereço do host ou do serviço que seja acessível a partir do processo cliente. `127.0.0.1` dentro de um contêiner não é a máquina host.

Para testes públicos Taira, comece com uma sonda de endpoint não assinada API:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Se esses comandos falharem com `502`, TLS, DNS ou erros de tempo limite, corrija a acessibilidade da rede ou aguarde o endpoint API da testnet pública antes de depurar chaves de conta ou cargas de transação.

## Transações são rejeitadas {#transactions-are-rejected}

A maioria das falhas de transação é causada por incompatibilidade de identidade ou autorização:

- a chave pública da conta na configuração do cliente não corresponde à chave privada usada para assinatura
- a conta não está registrada na gênese do blockchain ou por uma transação anterior
- a conta não possui o token de permissão ou a função exigida pelo validador de tempo de execução do software
- um ID de domínio está sem a qualificação do seu espaço de dados, como `domain.dataspace`

Use `--output-format text` ao depurar comandos CLI para que os erros sejam mais fáceis de ler:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Consultas retornam resultados vazios {#queries-return-empty-results}

Resultados de consulta vazios nem sempre significam que a consulta falhou. Verifique:

- a transação que deveria criar o objeto foi confirmada
- o domínio consultado, a definição do ativo ou o ID da conta é canônico
- a paginação ou os filtros não estão excluindo a linha esperada
- o cliente está conectado à rede pretendida, não a outra rede local

Para verificações de domínio, comece com a consulta mais ampla:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Fluxos de eventos ou blocos param cedo {#event-or-block-streams-stop-early}

Os exemplos de blocos e fluxo de eventos dependem dos endpoints de streaming da API Torii. Verifique se o par de rede ainda está em execução e depois teste com um tempo limite:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

Para integrações HTTP, compare os caminhos de endpoint API com o [Torii API referência de endpoint](/pt/reference/torii-endpoints.md) atual.
