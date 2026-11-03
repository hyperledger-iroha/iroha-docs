---
translation_locale: pt
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Ativos Fungíveis {#fungible-assets}

## Resultado {#outcome}

Inspecione definições de ativos ao vivo da Taira e complete um fluxo de emissão, transferência, queima e verificação de saldo em uma rede local gerada. A receita utiliza IDs de definição de ativos Base58 canônicos sem prefixo, IDs de conta I105 sem domínio e pagamento explícito de taxas.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Python 3.11 ou posterior, Node.js 24, e os CLIs atuais `iroha` e `kagami`.
- Acesso somente leitura Taira.
- Para o passo a passo de escrita, uma rede local criada com `kagami localnet generate --peers 4 --out-dir ./localnet` como em [Iniciar Iroha](/pt/get-started/launch-iroha.md), acrescentando `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa`. Ela fornece `./localnet/client.toml` e Torii em `http://127.0.0.1:8080`.

## Passos {#steps}

### 1. Inspecionar definições Taira sem um signatário criptográfico {#_1-inspect-taira-definitions-without-a-signer}

As definições de ativos possuem um ID Base58 opaco, nome de exibição, política de emissão de ativos, escala numérica, alias opcional, proprietário, domínio ou espaço de dados proprietário opcional, política de saldo e quantidade total. O saldo concreto também inclui sua conta titular e escopo opcional de espaço de dados.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
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

Execute o formulário JavaScript com `node taira-assets.mjs`. IDs de ativos públicos são valores Base58 puros; um valor legível como `cookbook_credit#wonderland.universal` é um alias que se resolve em um desses IDs.

### 2. Prepare o principal de autorização local e o destino {#_2-prepare-the-local-authority-and-destination}

Derive o principal de autorização local a partir da chave pública na configuração gerada e, em seguida, crie um par de chaves para uma nova conta destinatária e registre-a. Nenhuma chave privada é impressa.

```bash
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

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. Usar uma definição numérica pertencente ao cliente {#_3-use-a-client-owned-numeric-definition}

Fora da gênese, uma definição é registrada sob um `--domain` proprietário que pertence ao signatário, e o cliente de uma rede local gerada não possui nenhum. A rede local gerada com `--asset-definition-id` já contém essa definição: a gênese a registrou com uma escala sem restrições, tornou o cliente seu proprietário e emitiu 1.000.000.000 unidades para o cliente.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Não reutilize esse ID na Taira. O registro na rede pública exige um novo ID canônico, um domínio proprietário que pertença à sua conta (passado a `ledger asset definition register` como `--domain`), uma concessão de `CanManageAssetDefinitionAlias` para qualquer alias e financiamento da taxa.

### 4. emitir, transferir e queimar {#_4-mint-transfer-and-burn}

Todos os comandos de escrita selecionam explicitamente o principal de autorização como pagador da taxa. O CLI cotiza a transação exata antes de assinar e espera por padrão.

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

Após a queima, espere o saldo da origem `1000000064.50`, o saldo do destino `25.50` e a quantidade total `1000000090.00`.

::: warning Limite de permissão

Na Taira, use `--fee-payer authority` para cada gravação; o CLI cota a taxa exata, no ativo de taxa da Taira, antes de assinar. O registro exige ser proprietário do `--domain` da definição, e um alias também precisa de `CanManageAssetDefinitionAlias`. A emissão exige ser proprietário da definição ou possuir `CanMintAssetWithDefinition` ou `CanMintAssetToAccount`; transferência e queima exigem autoridade sobre o saldo de origem. Uma conta financiada pelo serviço de financiamento da testnet não é automaticamente um emissor.

:::

## Verificar {#verify}

Leia ambos os saldos concretos e depois a definição. Essas consultas pós-estado são o critério de sucesso; um registro de resultado de protocolo de envio por si só não é.

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

As asserções do aplicativo devem comparar valores numéricos como decimais de ponto fixo, não como valores de ponto flutuante binário, e devem verificar o ID da definição, assim como a conta.

## Solução de problemas {#troubleshooting}

- Um ID contendo `#` é um alias ou literal de saldo concreto, não um ID de definição de ativo canônico. Use o valor Base58 puro com `--definition`, ou passe um alias vinculado com `--definition-alias`.
- Erros `Scale` significam que uma quantidade possui mais casas decimais do que a definição permite.
- `Mintability` rejeição significa que a política `Once`, `Not` ou `Limited(n)` esgotou ou proibiu a emissão. Não reescreva o histórico; use a política retornada pela consulta de definição.
- O Passo 2 registra explicitamente a conta de destino, para que a transferência também funcione quando a admissão de contas for `ExplicitOnly`. O guarda CLI de nome semelhante não registra uma conta ou saldo; ele aborta em vez de adicionar outra instrução.
- Uma rejeição de taxa ocorre antes do sucesso normal da instrução. Selecione o pagador, confira o ativo de taxa e o máximo na cotação de taxa do CLI e verifique esse saldo.
- Uma nova execução na mesma rede local parte dos saldos anteriores, e `kagami keys` recusa um `./cookbook-recipient` existente. Inicie uma nova rede local gerada e remova esse diretório, ou compare as variações de saldo em vez dos valores absolutos. Nunca use uma sequência aleatória malformada no lugar do ID Base58.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Testes de integração do ciclo de vida do ativo no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust exemplos de construção de ativos no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [Ativos](/pt/blockchain/assets.md)
- [Instruções](/pt/blockchain/instructions.md)
- [Tokens de permissão](/pt/reference/permissions.md)
- [JavaScript e TypeScript](/pt/guide/tutorials/javascript.md)
