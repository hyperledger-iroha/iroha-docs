---
translation_locale: pt
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 6b50c995afaf9f46df6fdaab31add40b106cfa12fdaa31dabbb74448486f87f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ativos Fungíveis {#fungible-assets}

## Resultados {#outcome}

Inspecção ao vivo Taira definições de activos e completar um registo, moeda, transferência, queima e verificação do saldo A receita usa uma definição de ativo base58 canônica sem prefixo IDs, Alias de domínio, sem domínio I105 Conta IDs, e pagamento explícito de taxas.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Python 3.11 ou mais tarde, Node.js 24 e a corrente `iroha` CLI.
- Acesso somente de leitura Taira.
- Para o write-through, uma rede local gerada a partir de [Lançamento Iroha](/pt/get-started/launch-iroha.md), com `./localnet/client.toml` e Torii em `http://127.0.0.1:8080`.

## Passos {#steps}

### 1. Inspeccionar as definições Taira sem assinante {#_1-inspect-taira-definitions-without-a-signer}

As definições de activos contêm uma Base58 ID opaca, nome de exibição. Políticas de contabilidade, escala numérica, alias opcionais, proprietário e quantidade total. O saldo concreto inclui também a conta do titular e o escopo opcional do espaço de dados.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

Execute o formulário JavaScript com `node taira-assets.mjs`. Os ativos públicos IDs são valores base58 vazios; um valor legível, como `cookbook_credit#wonderland.universal` é um alias que se resolve para um desses IDs.

### 2. Preparar a autoridade local e o destino {#_2-prepare-the-local-authority-and-destination}

Derivar a autoridade local da chave pública na configuração gerada e escolher uma outra conta registada como destinatário.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. Registrar uma definição numérica {#_3-register-a-numeric-definition}

Este local-só ID é um endereço válido de definição de ativo Base58 sem prefixo. O alias fornece a projeção humana legível `domain.dataspace`. Escala `2` permite dois dígitos fracionários; omitindo `--mint-once` mantém a política padrão `Infinitely`.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

Não reutilize esse ID em Taira. O registo na rede pública requer um novo canônico ID, um domínio/alias atribuído ao seu pedido, financiamento de taxas e permissão de registo de ativos do runtime.

### 4. Moinho, transferência e queimação {#_4-mint-transfer-and-burn}

Todos os comandos de escrita selecionam explicitamente a autoridade como pagador de taxas. O CLI cita a transação exata antes da assinatura e espera por defeito.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

Após a queima, espera-se o saldo da fonte `64.50`, o saldo do destino `25.50` e a quantidade total `90.00`.

::: warning Limite de autorização

Em Taira, anexe o `taira.tx-metadata.json` derivado da torneira e use `--fee-payer authority` para cada escrita. O registro e a moagem exigem as permissões do validador ativo; transferência e queima exigem autoridade sobre o saldo da fonte. Uma conta financiada pela torneira não é automaticamente um emissor.

:::

## Verificar {#verify}

Leia ambos os saldos concretos e depois a definição. Estas consultas pós-estado são o critério de sucesso; um recibo de apresentação por si só não é.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

As afirmações de aplicação devem comparar os valores numéricos como decimais de ponto fixo, e não como valores binários de ponto flutuante, verificando a definição ID bem como a conta.

## Resolução de problemas {#troubleshooting}

- Um ID contendo `#` é um alias ou saldo de concreto literal, e não uma definição canônica de ativo ID. Use o valor Base58 com `--definition` ou passe um alias vinculado com `--definition-alias`.
- Os erros `Scale` significam que uma quantidade tem mais dígitos fracionários do que o permitido pela definição.
- Rejeição `Mintability` significa que a política de `Once`, `Not` ou `Limited(n)` extinguiu ou proibiu a moagem. Não reescreva o histórico; use a política devolvida pela consulta de definição.
- O passo 2 escolhe deliberadamente uma conta de destino registada.Se a admissão de activos for `ExplicitOnly`, provisionar o saldo de destino através de um O guardado com o mesmo nome CLI não registra uma conta ou um saldo; abortar em vez de adicionar outra instrução.
- Uma rejeição de taxa ocorre antes do sucesso normal da instrução. Selecione o pagador, use os metadados do ativo de taxa da rede e verifique seu saldo.
- Se a definição local fixa já existe de uma execução anterior, inicie uma rede local recém-gerada ou continue com o seu estado existente. Nunca substituir uma cadeia aleatória mal formada pela Base58 ID.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Testes de integração do ciclo de vida dos ativos no commit fixado ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/asset.rs)
- [Rust exemplos de construção de ativos no compromisso fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/examples/tutorial.rs)
- [Ativos](/pt/blockchain/assets.md)
- [Instruções ](/pt/blockchain/instructions.md)
- [Tokens de permissão ](/pt/reference/permissions.md)
- [JavaScript e TypeScript](/pt/guide/tutorials/javascript.md)
