---
translation_locale: pt
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ativos {#assets}

Um ativo Iroha é um saldo numérico detido por uma conta. Cada saldo concreto aponta para um `AssetDefinition`, e a definição descreve como esse ativo pode ser nomeado, cunhado, exibido e dividido.

## Definição de ativos {#asset-definition}

Um `AssetDefinition` contém:

- `id`: endereço de definição do ativo canônico
- `name`: um nome de exibição legível ao ser humano
- `description`: descrição facultativa legível ao ser humano.
- `alias`: alias opcionais no formulário `<name>#<domain>.<dataspace>` ou `<name>#<dataspace>`
- `spec`: precisão numérica e restrições para os saldos
- `mintable`: a política de mintabilidade
- `logo`: opcional `SoraFS` URI
- `metadata`: metadados arbitrários de valor-chave
- `balance_scope_policy`: se os saldos são globais ou limitados ao espaço de dados;
- `owned_by`: conta que registrou ou detém a definição
- `total_quantity`: quantidade total emitida
- `confidential_policy`: Política de operações em activos protegidos

Definição de ativos IDs são endereços opacos canônicos. Quando uma definição é construída a partir de um domínio e um nome, Iroha pode manter essa projeção de domínio / nome para UX e consultas, mas o formulário de texto canônico é o endereço gerado.

## Equilíbrio de activos {#asset-balance}

Um `Asset` contém:

- `id`: um `AssetId`, que combina a definição de ativo, a conta do detentor e o escopo de saldo opcional
- `value`: um saldo de `Numeric`

A conta do titular é canônica e sem domínio. A definição de ativo pode ser projetada sob um domínio qualificado para o espaço de dados, por exemplo `payments.universal`.

## Capacidade de conservação {#mintability}

As definições de ativos suportam estes modos de mintabilidade:

|Modo .|Que significa ?|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |O activo pode ser montado e queimado repetidamente. |
|`Once` |Um símbolo de oferta fixa, pode ser cunhado uma vez e depois queimado.|
|`Not` |Token de fornecimento fixo que pode ser queimado mas não coitado novamente. |
|`Limited(n)` |A política permite a emissão de novas unidades de activos num número limitado de operações adicionais. |

Utilize `Infinitely` para ativos elásticos normais e `Once` ou `Limited(n)` para activos de oferta fixa ou limitada. Não utilize `Not` como política inicial, a menos que o fornecimento de activos já seja estabelecido.

## O escopo do balanço {#balance-scope}

O `balance_scope_policy` controla a forma como os saldos são colocados em cubos:

- `Global`: um balde de saldo por conta e definição do ativo
- `DataspaceRestricted`: Os saldos são divididos por contexto do espaço de dados

Os saldos restritos ao espaço de dados são úteis quando a mesma definição de ativo é utilizada em múltiplos bancos de dados Nexus, mas os saldos devem permanecer isolados.

## Tente em Taira {#try-it-on-taira}

Estas chamadas de somente leitura mostram definições reais de ativos na rede de teste pública Taira:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Encontrar a definição atual do ativo de taxa Taira XOR:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Procure definições que contenham metadados:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Todos os três exemplos são leituras. Para coletar, queimar ou transferir ativos em Taira, use uma conta financiada por torneiras e o fluxo guardado em [Conectar-se aos bancos de dados SORA Nexus ](/pt/get-started/sora-nexus-dataspaces.md).

Para um exemplo de ativo Taira pago por taxa, salve o auxiliar da torneira a partir de [Obter Testnet XOR em Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, em seguida, reivindique primeiro o ativo da torneira e use-o como ativo do gás de transação:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Em seguida, inclua `--metadata ./taira.tx-metadata.json` nos comandos `ledger asset mint`, `ledger asset burn` e `ledger asset transfer`.

## Instruções {#instructions}

Os ativos podem ser registados, montados, queimados e transferidos com Iroha Instruções especiais:

- [`Register` e `Unregister`](/pt/blockchain/instructions.md#un-register)
- [`Mint` e `Burn`](/pt/blockchain/instructions.md#mint-burn)
- [`Transfer`](/pt/blockchain/instructions.md#transfer)
- [`SetKeyValue` e `RemoveKeyValue`](/pt/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Veja também:

- [Guia CLI](/pt/get-started/operate-iroha-via-cli.md)
- [Rust tutorial](/pt/guide/tutorials/rust.md)
- [Python tutorial](/pt/guide/tutorials/python.md)
- [JavaScript/TypeScript tutorial ](/pt/guide/tutorials/javascript.md)
- [Modelo de dados](/pt/blockchain/data-model.md)
- [NFTs](/pt/blockchain/nfts.md)
