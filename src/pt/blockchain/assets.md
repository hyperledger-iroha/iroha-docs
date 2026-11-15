---
translation_locale: pt
translation_source: /blockchain/assets.md
translation_source_hash: f5f0eb99e76287db695cc21b8580fd2a9b4dc2a989237c1a1d3d7333c14561ce
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Ativos {#assets}

Um ativo Iroha é um saldo numérico mantido por uma conta. Cada saldo concreto aponta para um `AssetDefinition`, e a definição descreve como esse ativo pode ser nomeado, emitido, exibido e particionado.

## Definição de Ativo {#asset-definition}

Um `AssetDefinition` contém:

- `id`: o endereço de definição de ativo canônico
- `name`: um nome de exibição legível para humanos
- `description`: descrição opcional legível por humanos
- `alias`: alias opcional na forma `<name>#<domain>.<dataspace>` ou `<name>#<dataspace>`
- `spec`: precisão numérica e restrições para saldos
- `mintable`: a política de emissão de ativos
- `logo`: opcional `SoraFS` URI
- `metadata`: metadados de chave-valor arbitrários
- `balance_scope_policy`: se os saldos são globais ou restritos ao espaço de dados
- `owning_domain`: o domínio proprietário de uma definição pertencente a um domínio; ausente nas definições registradas diretamente em um espaço de dados
- `owned_by`: a conta que registrou ou possui a definição
- `total_quantity`: quantidade total emitida
- `confidential_policy`: política para operações com ativos protegidos

IDs de definição de ativos são endereços opacos canônicos. Quando uma definição é construída a partir de um domínio e um nome, Iroha pode manter essa projeção domínio/nome para UX e consultas, mas a forma textual canônica é o endereço gerado.

## Saldo do Ativo {#asset-balance}

Um `Asset` contém:

- `id`: um `AssetId`, que combina a definição do ativo, a conta do titular e o escopo opcional do saldo do ativo
- `value`: um saldo `Quantity`

A conta do titular é canônica e sem domínio. A definição do ativo pode ser projetada sob um domínio qualificado por espaço de dados, por exemplo `payments.universal`.

## Política de emissão de ativos {#mintability}

As definições de ativos suportam estes modos de política de emissão de ativos:

|Modo         |Significado|
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` |Oferta elástica. O ativo pode ser emitido e queimado repetidamente.|
| `Once`       |Token de suprimento fixo. Pode ser emitido uma vez e depois queimado.|
| `Not`        |Token de oferta fixa que pode ser queimado, mas não pode ser emitido novamente.|
| `Limited(n)` |A política permite que novas unidades de ativos sejam emitidas em um número limitado de operações adicionais.|

Use `Infinitely` para ativos elásticos normais e `Once` ou `Limited(n)` para ativos de oferta fixa ou limitada. Não use `Not` como política inicial, a menos que a oferta do ativo já esteja estabelecida.

## Escopo do saldo de ativos {#balance-scope}

O `balance_scope_policy` controla como os saldos são repartidos:

- `Global`: uma partição de saldo por conta e definição de ativo
- `DataspaceRestricted`: os saldos são particionados por contexto de espaço de dados

Saldos restritos por espaço de dados são úteis quando a mesma definição de ativo é usada em vários espaços de dados do SORA Nexus, mas os saldos devem permanecer isolados.

## Experimente em Taira {#try-it-on-taira}

Essas chamadas somente leitura mostram definições de ativos reais na testnet pública Taira:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Encontre a definição atual do ativo de taxa Taira XOR:

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

Os três exemplos são leituras. Para emitir, queimar ou transferir ativos em Taira, use uma conta financiada pelo faucet e o fluxo protegido em [Desenvolver na SORA Nexus com Taira e Minamoto](/pt/get-started/sora-nexus-dataspaces.md).

Para um exemplo de ativo com pagamento de taxas em Taira, primeiro financie a conta signatária por meio do fluxo preparado do faucet em [Obter XOR de testnet em Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira). Em seguida, passe `--fee-payer authority` nos comandos `ledger asset mint`, `ledger asset burn` e `ledger asset transfer`; a CLI informa a cotação exata da taxa, no ativo de taxas de Taira, antes de assinar:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "<ASSET_DEFINITION_BASE58>" \
  --account "<TAIRA_I105_ACCOUNT_ID>" \
  --to "<RECIPIENT_I105_ACCOUNT_ID>" \
  --quantity 1
```

## Instruções {#instructions}

Os ativos podem ser registrados, emitidos, queimados e transferidos com as operações de instrução Iroha:

- [`Register` e `Unregister`](/pt/blockchain/instructions.md#un-register)
- [`Mint` e `Burn`](/pt/blockchain/instructions.md#mint-burn)
- [`Transfer`](/pt/blockchain/instructions.md#transfer)
- [`SetKeyValue` e `RemoveKeyValue`](/pt/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Veja também:

- [CLI guia](/pt/get-started/operate-iroha-via-cli.md)
- [Tutorial de Rust](/pt/guide/tutorials/rust.md)
- [tutorial de Python](/pt/guide/tutorials/python.md)
- [Tutorial de JavaScript/TypeScript](/pt/guide/tutorials/javascript.md)
- [Modelo de dados](/pt/blockchain/data-model.md)
- [NFTs](/pt/blockchain/nfts.md)
