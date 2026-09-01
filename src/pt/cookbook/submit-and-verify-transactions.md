---
translation_locale: pt
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Enviar e Verificar Transações {#submit-and-verify-transactions}

## Resultado {#outcome}

Pré-verifique uma transação Taira, aceite uma estimativa de preço de taxa exata, assine e envie-a, aguarde a finalização aplicada e verifique a transação confirmada pelo hash criptográfico.

## Pré-requisitos {#prerequisites}

- Um `taira.client.toml` financiado, `taira.tx-metadata.json` e `TAIRA_ACCOUNT_ID` produzido por [Conectar-se a Taira](./connect-to-taira.md).
- O atual `iroha` CLI e `jq`.
- Um signatário criptográfico descartável Taira. Não reutilize sua chave ou estes comandos de gravação em Minamoto.

## Passos {#steps}

### 1. Verifique previamente o endpoint API, o principal de autorização e o saldo de taxas {#_1-preflight-the-endpoint-authority-and-fee-balance}

Leia primeiro a visualização de dados do ponto no tempo da fila, depois comprove que o saldo de taxas do principal de autorização está visível. Leia o ID de definição de ativo Base58 a partir dos metadados gerados pela receita de conexão.

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

Pare se a conta ou o saldo da taxa estiver ausente. Uma instrução válida não pode passar pela admissão de taxa quando seu principal de autorização não puder pagar.

### 2. Cotar, assinar e enviar uma vez {#_2-quote-sign-and-submit-once}

O CLI envia o payload não assinado exato para uma estimativa de preço da taxa, vincula a intenção de pagamento aceita na transação, assina e envia. O modo JSON retorna o hash criptográfico da transação, a transação assinada e a cotação aceita juntos.

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

Não use `--no-wait` nesta receita. O comando aguarda confirmação antes de escrever um registro de resultado de protocolo bem-sucedido.

### 3. Aguarde o estado terminal do pipeline {#_3-wait-for-terminal-pipeline-state}

Use o assistente de status digitado em vez de inferir o sucesso a partir da aceitação ou admissão na fila de HTTP. Com `--wait`, o escopo de roteamento seguro é selecionado automaticamente e o alvo padrão é a finalização aplicada.

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

`Rejected` e `Expired` são falhas terminais, não estados de sucesso que podem ser tentados novamente. Registre o motivo antes de alterar ou reconstruir a transação.

### 4. Leia a transação armazenada {#_4-read-the-stored-transaction}

O status do pipeline de processamento responde se o processamento foi concluído. Uma consulta de transação verifica se a transação admitida está armazenada sob o mesmo hash criptográfico.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

O explorador é uma segunda superfície de observação somente leitura. Ele pode ficar brevemente atrás da finalização do pipeline.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Para uma instrução que muda o estado, termine com uma consulta ao objeto que foi modificado. As receitas [Metadados](./metadata.md), [Ativos fungíveis](./fungible-assets.md) e [NFTs](./nfts.md) incluem essas leituras pós-estado.

## Verificar {#verify}

Verifique se todos os três registros concordam com o mesmo hash criptográfico e se o explorador não relata mais um estado pendente:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Mantenha o registro do resultado do protocolo de envio e o status final como evidência de teste. Eles contêm material de transação público, não a chave de assinatura.

## Solução de problemas {#troubleshooting}

- HTTP `202` ou um status em fila prova apenas a admissão. Continue consultando o status digitado até Aplicado, Rejeitado, Expirado ou até o tempo limite definido.
- Se o envio expirar após retornar um hash criptográfico, consulte esse hash criptográfico antes de construir outra transação. O reenviamento cego cria um novo payload cotado e assinado.
- Uma estimativa de preço da taxa pode ser rejeitada antes da assinatura. Verifique `--fee-payer authority`, `gas_asset_id`, o saldo do principal de autorização e o ID da cadeia da rede.
- `Rejected` geralmente indica validação de instrução, permissões, taxas ou estado obsoleto. É uma evidência comprovada de uma execução falha e não deve ser reclassificada como uma nova tentativa de transporte.
- Um explorador `404` imediatamente após Aplicado pode estar com atraso de indexação. Tente ler novamente; não reenvie a transação.
- Se uma instrução privilegiada funcionar em uma localnet gerada, mas Taira a rejeitar, obtenha a permissão exata Taira ou a atribuição de namespace governado. O resultado local não concede principal de autorização da rede pública.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Envio de transação e implementação de cotação de taxa no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Implementação e testes de confirmação de transação no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [Transações](/pt/blockchain/transactions.md)
- [CLI guia](/pt/get-started/operate-iroha-via-cli.md)
- [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md)
