---
translation_locale: pt
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Resolução de problemas de integração {#troubleshooting-integration-issues}

Esta seção oferece dicas de solução de problemas para a integração Iroha 3. Se o problema que você está experimentando não for descrito aqui, entre em contato conosco através do [Telegram](https://t.me/hyperledgeriroha).

## O cliente não pode ligar {#client-cannot-connect}

Verificar se a configuração do cliente aponta para o endereço Torii do peer:

```toml
torii_url = "http://127.0.0.1:8080/"
```

Para os controlos CLI, passe o mesmo ficheiro explicitamente:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Se o companheiro entrar Docker ou Kubernetes, utilize o endereço de hospedagem ou serviço que é acessível a partir do processo cliente. `127.0.0.1` dentro de um recipiente não é a máquina hospedeira.

Para os testes públicos Taira, inicie-se com uma sonda de ponto final não assinada:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Se estes comandos falharem com `502`, TLS, DNS ou erros de tempo limite, fixar a acessibilidade da rede ou esperar o endpoint do testnet público antes de depurar as chaves de conta ou as cargas úteis das transações.

## As operações são rejeitadas. {#transactions-are-rejected}

A maioria das falhas de transacção são causadas por uma incompatibilidade de identidade ou autorização:

- A chave pública da conta na configuração do cliente não corresponde à chave privada utilizada para assinatura.
- A conta não é registada em gênese ou por uma transação anterior
- A conta não possui o token de permissão ou o papel exigido pelo validador de tempo de execução
- um domínio ID não tem a sua qualificação de espaço de dados, como `domain.dataspace`

Use `--output-format text` ao depurar os comandos de CLI para que os erros sejam mais fáceis de ler:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## As consultas retornam resultados vazios {#queries-return-empty-results}

Resultados de consulta vazios nem sempre significam que a consulta falhou. Verifique:

- A transação que deveria criar o objeto foi cometida
- O domínio, definição de ativo ou conta ID solicitado é canônico.
- Paginação ou filtros não excluem a linha esperada
- O cliente está ligado à rede prevista, e não a outra localnet

Para verificações de domínio, comece com a consulta mais ampla:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Os fluxos de eventos ou bloqueios param cedo . {#event-or-block-streams-stop-early}

Os exemplos de blocos e fluxos de eventos dependem dos endpoints de streaming Torii. Verifique se o peer ainda está em execução, depois teste com um timeout:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

Para as integrações HTTP, compare os seus caminhos de ponto final com a referência de ponto final atual [Torii](/pt/reference/torii-endpoints.md).
