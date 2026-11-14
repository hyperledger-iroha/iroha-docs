---
translation_locale: pt
translation_source: /blockchain/transactions.md
translation_source_hash: 91c06ab61c7f8ec96554bc89b31b2f281bb3a7d7edd484defe61dcde5a3fb710
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

Isto ainda é somente leitura. Enviar uma transação requer um envelope Norito assinado, os IDs corretos da cadeia e da rede, um pagador de taxas explícito e uma conta Taira financiada pelo faucet.

Para exemplos com pagamento de taxas em Taira, financie a conta signatária por meio do fluxo preparado do faucet em [Obter XOR de testnet em Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) e verifique o saldo do ativo de taxas:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Se uma rota do faucet retornar `502`, aguarde e tente novamente antes de depurar a própria transação.

Em seguida, selecione o pagador da taxa ao enviar a transação. Com `--fee-payer authority`, a conta que assina paga, e o CLI informa a taxa exata no ativo de taxa de Taira antes de assinar:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "faucet-funded taira transaction"
```

## Transações Offline {#offline-transactions}

Iroha possui dois fluxos de trabalho de transações offline:

- A assinatura offline cria uma transação assinada normal enquanto o dispositivo de assinatura está desconectado. A transação não é processada até que um cliente online envie o contêiner de dados assinado para Torii, portanto, ainda precisa do ID correto da cadeia, do principal de autorização, das permissões e das taxas, e tempo de vida da transação.
- **Dinheiro offline Kagemusha** carrega valor em uma carteira cadastrada com proteção por hardware enquanto ela está online, permite pagamentos entre carteiras quando ambas estão offline e descarrega o valor restante para uma conta no registro quando a carteira volta a ficar online.

Torii expõe uma única rota Kagemusha, `POST /v1/kagemusha/enrollment`. Ela aceita frames de cadastro `application/x-norito` autenticados pela conta e retorna respostas privadas que não devem ser armazenadas em cache. O lado do registro nesse ciclo de vida usa transações assinadas comuns que contêm uma instrução `KagemushaWalletLedgerV1`:

|Ação|Propósito|
| --- | --- |
| `Activate` | Ativar uma carteira cadastrada; a verificação nativa de bootstrap é obrigatória |
| `IssueLoad` | Debitar o pagador e registrar a próxima Load da carteira de forma atômica |
| `Unload` | Pagar uma solicitação Unload completa à conta vinculada, no máximo uma vez |
| `ClaimFee` | Pagar uma solicitação de taxa completa ao beneficiário fixado |
| `Abandon` | Abandonar uma inscrição não utilizada |

O fluxo típico é:

1. Cadastre a carteira por meio de `/v1/kagemusha/enrollment` usando uma carteira Swift ou Android com interface tipada e, em seguida, ative-a.
2. Envie uma transação `IssueLoad`. A execução verifica o ordinal esperado da próxima Load e o ID de solicitação diferente de zero, de modo que uma nova tentativa desatualizada ou alterada falha. Se a resposta se perder, leia o recibo da Load original em vez de assinar outra Load.
3. Troque e verifique pagamentos entre carteiras localmente enquanto estiverem offline e persista o estado da carteira antes de confirmar cada transferência.
4. Quando a carteira voltar a ficar online, envie sua solicitação Unload e aguarde a finalização definitiva.

O livro-razão da blockchain não pode observar uma transferência offline conflitante até que o estado da nota retorne através do ciclo de vida online. Portanto, a política da carteira e do operador deve impor limites de valor, validade, emissores aceitos, armazenamento local durável e janelas de reconciliação.

Aqui está um exemplo de criação de uma nova transação com a instrução `Grant`. Nesta transação, Mouse está concedendo a Alice a função especificada (`role_id`). Verifique [o exemplo completo](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
