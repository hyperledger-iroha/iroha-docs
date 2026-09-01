---
translation_locale: pt
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Transações {#transactions}

Uma transação é uma solicitação assinada para executar trabalho na blockchain. O payload executável pode ser uma sequência ordenada de [instruções](./instructions.md), uma chamada de contrato, bytecode IVM ou uma execução comprovada IVM. Veja [Contratos Inteligentes](./smart-contracts.md) para o modelo atual de execução de contratos.

As transações realizam trabalho executável ou que altera o estado. A inspeção apenas leitura usa consultas assinadas ou endpoints de leitura pública API e não cria uma transação.

Uma transação admitida em um bloco confirmado é armazenada com seu resultado de execução, incluindo uma rejeição de execução. Solicitações rejeitadas antes da admissão no bloco, como um contêiner de dados inválido ou uma transação recusada pela fila, não são armazenadas em um bloco.

Para movimentação de ativos preservando a privacidade, veja [Transações Anônimas](./anonymous-transactions.md). Transações anônimas usam notas de ativos protegidas, compromissos, nulificadores e provas de conhecimento zero em vez de alterações de saldo de conta para conta públicas.

Para evidências de prova sobre os efeitos de execução transparente selecionados, veja [FastPQ](./fastpq.md). FastPQ consome testemunhas de execução após a execução normal da transação e constrói lotes de prova determinísticos para transições de estado suportadas.

## Experimente em Taira {#try-it-on-taira}

Use as rotas do explorador para inspecionar blocos públicos recentes Taira e os status das transações sem uma conta de assinatura:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Para acompanhar uma transação que seu aplicativo enviou anteriormente, copie o `hash` da lista e inspecione a rota de detalhes no explorador:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Isso ainda é somente leitura. Enviar uma transação requer um contêiner de dados Norito assinado, ID de cadeia correto, metadados de taxa e uma conta Taira financiada na testnet.

Para exemplos sujeitos a taxas na Taira, salve o auxiliar de [Obter XOR de teste na Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py` e financie primeiro o signatário pelo dispensador público:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Se o desafio do dispensador ou a rota de solicitação retornar `502`, aguarde e tente novamente antes de depurar a própria transação.

Então anexe os metadados do ativo de taxa Taira ao enviar a transação:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Transações Offline {#offline-transactions}

Iroha possui dois fluxos de trabalho de transações offline:

- A assinatura offline cria uma transação assinada normal enquanto o dispositivo de assinatura está desconectado. A transação não é processada até que um cliente online envie o contêiner de dados assinado para Torii, portanto, ainda precisa do ID correto da cadeia, do principal de autorização, das permissões e das taxas, e tempo de vida da transação.
- O dinheiro offline do Kagemusha recarrega uma carteira enquanto ela está online, suporta transferências de carteira para carteira iniciadas pelo receptor enquanto ambas as carteiras estão offline, e resgata o estado da nota resultante quando o destinatário retorna online.

Torii expõe o ciclo de vida completo do Kagemusha sob `/v1/offline/*`:

|Método e endpoint API|Propósito|
| --- | --- |
| `GET /v1/offline/readiness` |Avaliar a prontidão de Kagemusha para um `asset_definition_id`|
| `POST /v1/offline/receiver-lineage` |Resolva a linhagem de registro ativo com prova para uma solicitação de receptor assinada|
| `POST /v1/offline/top-up` |Enviar uma operação de recarga online-para-offline assinada|
| `POST /v1/offline/redeem` |Enviar uma operação de resgate offline assinada|
| `GET /v1/offline/operations/{operation_id}` |Leia o status canônico de uma recarga ou resgate|

Verifique a prontidão do ativo antes de construir uma operação offline:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

A prontidão vincula a carteira à ponte ativa ABI 21 e ao conjunto de artefatos autenticados V4. As solicitações de linhagem, recarga e resgate utilizam arquivos tipados `application/x-norito`. Retorno de recarga e resgate `202 Accepted` com um cabeçalho `Location` apontando para o recurso de operação; o ID de operação não zero incorporado fornece a chave de idempotência.

O fluxo típico é:

1. Verifique a prontidão da consulta e pare se `ready` for falso ou se algum bloqueador se aplicar.
2. Use uma carteira digitada Swift ou JVM para construir o arquivo de recarga canônico, enviá-lo e reter tanto o estado da nota de entrada quanto o ID da operação até que a operação alcance um estado final da cadeia.
3. Resolva a linhagem de registro do receptor quando necessário, construa e verifique cada transferência de par de rede localmente e persista o estado da nota criptografada antes de confirmar a transferência.
4. Quando o destinatário estiver online, construa o arquivo canônico de resgate, envie-o e monitore seu recurso de operação até a finalização.

O livro-razão da blockchain não pode observar uma transferência offline conflitante até que o estado da nota retorne através do ciclo de vida online. Portanto, a política da carteira e do operador deve impor limites de valor, validade, emissores aceitos, armazenamento local durável e janelas de reconciliação.

Aqui está um exemplo de criação de uma nova transação com a instrução `Grant`. Nesta transação, Mouse está concedendo a Alice a função especificada (`role_id`). Verifique [o exemplo completo](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
