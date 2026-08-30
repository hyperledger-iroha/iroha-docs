---
translation_locale: pt
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 01907ea433e711cb0b1aa327d46c44744aad0a7571a65430dddd7a8aed3df373
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Submitir e verificar as transações {#submit-and-verify-transactions}

## Resultados {#outcome}

Preencher uma transação Taira, aceitar uma cotação exata de taxa, assiná-la e enviá-la, esperar a finalidade aplicada e verificar a transação comprometida por hash.

## Pré-requisitos {#prerequisites}

- Um `taira.client.toml`, `taira.tx-metadata.json` e `TAIRA_ACCOUNT_ID` financiados produzidos por [Conectar-se a Taira](./connect-to-taira.md).
- A corrente `iroha` CLI e `jq`.
- Uma assinatura descartável Taira. Não reutilize a sua chave ou estes comandos para escrever em Minamoto.

## Passos {#steps}

### 1. Prefire o ponto final, a autoridade e o saldo das taxas {#_1-preflight-the-endpoint-authority-and-fee-balance}

Leia primeiro o snapshot da fila, e depois comprova que o saldo das taxas da autoridade é visível. ID a partir dos metadados gerados pela receita de ligação.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Uma instrução válida não pode passar a admissão de taxas quando a sua autoridade não pode pagar.

### 2. Citar, assinar e submeter uma vez {#_2-quote-sign-and-submit-once}

A Comissão CLI Envia a carga útil exata sem assinatura para uma cotação de taxa, vincula a intenção de pagamento aceita à transacção, assina e envia. JSON modo retorna o hash da transação, a transação assinada e a cotação aceita juntas.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

Não use `--no-wait` nesta receita. O comando espera a confirmação antes de escrever um recibo bem sucedido.

### 3. Esperar o estado do gasoduto terminal {#_3-wait-for-terminal-pipeline-state}

Use o assistente de status digitalizado em vez de inferir sucesso da aceitação ou admissão na fila HTTP. Com `--wait`, o escopo de roteamento seguro é selecionado automaticamente e o objetivo padrão é finalidade aplicada.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` e `Expired` são falhas terminais, não estados de sucesso retraiíveis. Registre a sua razão antes de alterar ou reconstruir a transação.

### 4. Ler a transacção armazenada. {#_4-read-the-stored-transaction}

O status do pipeline responde se o processamento foi concluído. Uma consulta de transação verifica que a transação admitida é armazenada sob o mesmo hash.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

O explorador é uma segunda superfície de observação apenas para leitura, que pode ficar um pouco atrás da finalidade do oleoduto.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Para uma instrução de alteração de estado, termine com uma consulta do objeto que foi mutado. [Metadados](./metadata.md), [Ativos funcionais](./fungible-assets.md), e [NFTs](./nfts.md) As receitas incluem as leituras pós-estado.

## Verificar {#verify}

Verifique se todos os três registos concordam no mesmo hash e que o explorador não mais relata um estado pendente:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Mantenha o recibo da submissão e o status final como prova de ensaio. Eles contêm material público de transacção, não a chave de assinatura.

## Resolução de problemas {#troubleshooting}

- HTTP `202` ou um status em fila só provam admissão. Continuar a pesquisa do status tipado até aplicado, rejeitado, expirado ou o tempo limite.
- Se o tempo de submissão terminar depois de retornar um hash, consulta esse hash antes de criar outra transação. A reenvio cego cria uma nova carga útil com citações e assinaturas.
- Uma cotação pode ser rejeitada antes de assinar. `--fee-payer authority`, `gas_asset_id`, O equilíbrio da autoridade e a cadeia de redes ID.
- `Rejected` geralmente indica a validação de instruções, permissões, taxas ou estado obsoleto. É prova comprometida de uma execução falhada e não deve ser reclassificada como uma nova tentativa de transporte.
- Um explorador `404` imediatamente após o aplicado pode estar indexando lag. Repete a leitura; não re-submeter a transação.
- Se uma instrução privilegiada funciona em uma rede local gerada, mas Taira a rejeita, obtenha a permissão exata Taira ou atribuição de espaço de nome governado. O resultado local não concede autoridade para rede pública.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Submissão de transações e implementação da taxa no compromisso fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Testes de confirmação de transações no compromisso fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [Transações ](/pt/blockchain/transactions.md)
- [Guia CLI](/pt/get-started/operate-iroha-via-cli.md)
- [Pontos finais Torii](/pt/reference/torii-endpoints.md)
