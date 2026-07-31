---
translation_locale: pt
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Transações {#transactions}

Uma transação é uma solicitação assinada para executar um trabalho no blockchain. A carga útil executável pode ser uma sequência ordenada de instruções [ ](./instructions.md), uma chamada de contrato, código de byte IVM ou uma execução comprovada IVM . Ver [Contratos inteligentes](./smart-contracts.md) para o atual modelo de execução do contrato.

As transações executam um trabalho de mudança de estado ou executável. A inspeção apenas para leitura usa consultas assinadas ou pontos finais públicos de leitura e não cria uma transação.

Uma transacção admitida num bloco comprometido é armazenada com o resultado da sua execução, incluindo uma rejeição de execução. Solicitações rejeitadas antes da admissão em bloco, como um envelope inválido ou uma transação rejeitada pela fila; Não são armazenadas num bloco.

Para o movimento de ativos que preservam a privacidade, veja [Transações Anônimas](./anonymous-transactions.md). As transações anônimas usam notas de ativos protegidas, compromissos, anuladores e provas de conhecimento zero em vez das mudanças do saldo da conta pública.

Para evidências de prova sobre efeitos selecionados de execução transparentes, ver [FastPQ](./fastpq.md). FastPQ consome testemunhas de execução após a execução normal da transação e constrói lotes de provas deterministas para transições de estado suportadas.

## Tente em Taira {#try-it-on-taira}

Usar as rotas exploradoras para inspecionar blocos públicos Taira recentes e estatutos de transações sem uma conta de assinatura:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Para acompanhar uma transação que o seu aplicativo enviou anteriormente, copie a `hash` da lista e inspecione a rota detalhada do explorador:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

A submissão de uma transação requer um envelope assinado Norito, cadeia correta ID, metadados de taxas e uma conta financiada pela torneira Taira.

Para os exemplos de pagamento de taxas em Taira, salve o auxiliar da torneira a partir de [Obter Testnet XOR na Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, e depois financiar o assinante através da torneira pública primeiro:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Se o quebra-cabeça da torneira ou a rota de reclamação retornar `502`, espere e tente novamente antes de depurar a transação em si.

Em seguida, anexar os metadados do ativo de taxa Taira ao apresentar a transação:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Transações Offline {#offline-transactions}

O Iroha possui dois fluxos de trabalho de transações offline:

- A assinatura offline cria uma transação assinada normal enquanto o dispositivo de assinatura está desconectado. A transação não é processada até que um cliente on-line envie o envelope assinado para Torii, então ele ainda precisa da cadeia correta ID, autoridade, permissões, taxas e vida útil da transação.
- O cash offline Kagemusha encaixa uma carteira enquanto ela está online, suporta transferências de carteira para carteira iniciadas pelo destinatário enquanto ambas as carteiras estão offline e resgata o estado da nota resultante quando o destinatário retorna on-line.

O Torii expõe o ciclo de vida completo da Kagemusha no `/v1/offline/*`:

|Método e ponto final |Propósito |
| --- | --- |
|`GET /v1/offline/readiness` |Avaliação da prontidão de Kagemusha para um `asset_definition_id` |
|`POST /v1/offline/receiver-lineage` |Resolver a linhagem de registo ativo com prova para um pedido assinado do destinatário |
|`POST /v1/offline/top-up` |Submeter uma operação de reabastecimento online para offline assinada |
|`POST /v1/offline/redeem` |Submeter uma operação de resgate offline assinada |
|`GET /v1/offline/operations/{operation_id}` |Leia o estatuto canônico de um reabastecimento ou resgate |

Verificar a prontidão do ativo antes da construção de uma operação offline:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

A prontidão liga a carteira à ponte ativa ABI 21 e autenticado V4 A linhagem, complemento e solicitações de resgate usam `application/x-norito` Arquivos: recarga e reembolso. `202 Accepted` com um `Location` cabeçalho que aponta para o recurso de operação; a operação embutida não zero ID fornece a chave de independência.

O fluxo típico é:

1. Inquérito de prontidão e parada se `ready` for falso ou se for aplicado qualquer bloqueador.
2. Utilize uma carteira Swift ou JVM digitalizada para criar o arquivo complementar canônico, enviá-lo e reter tanto o estado da nota de entrada quanto a operação ID até que a operação atinja um estado final da cadeia.
3. Resolver a linhagem de registro do receptor quando necessário, construir e verificar cada transferência de pares localmente e persistir no estado da nota criptografada antes de reconhecer a transferência.
4. Quando o destinatário estiver on-line, construa o arquivo canônico de redenção, envie-o e pesquise seu recurso operacional até a finalidade.

O livro-razão não pode observar uma transferência offline conflitante até que o estado da nota retorne através do ciclo de vida online. A política de carteira e operador deve, portanto, impor limites de valor, expiração, emissores aceites, armazenamento local duradouro e janelas de reconciliação.

Aqui está um exemplo de criação de uma nova transação com a instrução `Grant`. Nesta transação, Mouse concede à Alice o papel especificado (`role_id`). Verifique [o exemplo completo ](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
