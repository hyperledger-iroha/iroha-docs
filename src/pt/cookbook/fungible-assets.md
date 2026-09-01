---
translation_locale: pt
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ativos Fungíveis {#fungible-assets}

## Resultado {#outcome}

Inspecione definições de ativos ao vivo Taira e complete um fluxo de registro, emissão, transferência, queima e verificação de saldo em uma rede local gerada. A receita utiliza IDs de definição de ativos Base58 canônicos sem prefixo, aliases qualificados por domínio, IDs de conta I105 sem domínio, e pagamento de taxa explícita.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Python 3.11 ou posterior, Node.js 24, e o atual `iroha` CLI.
- Acesso somente leitura Taira.
- Para o walkthrough de escrita, uma rede local gerada a partir de [Iniciar Iroha](/pt/get-started/launch-iroha.md), com `./localnet/client.toml` e Torii em `http://127.0.0.1:8080`.

## Passos {#steps}

### 1. Inspecionar definições Taira sem um signatário criptográfico {#_1-inspect-taira-definitions-without-a-signer}

As definições de ativos possuem um ID Base58 opaco, nome de exibição, política de emissão de ativos, escala numérica, alias opcional, proprietário e quantidade total. O saldo concreto também inclui sua conta titular e escopo opcional de espaço de dados.

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

Execute o formulário JavaScript com `node taira-assets.mjs`. IDs de ativos públicos são valores Base58 puros; um valor legível como `cookbook_credit#wonderland.universal` é um alias que se resolve em um desses IDs.

### 2. Prepare o principal de autorização local e o destino {#_2-prepare-the-local-authority-and-destination}

Derive o princípio de autorização local a partir da chave pública na configuração gerada e escolha outra conta registrada como destinatário. Nenhuma chave privada é impressa.

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

Este ID apenas local é um endereço válido de definição de ativo em Base58 sem prefixo. O alias fornece a projeção legível por humanos `domain.dataspace`. A escala `2` permite dois dígitos fracionários; omitir `--mint-once` mantém a política padrão `Infinitely`.

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

Não reutilize esse ID na Taira. O registro na rede pública exige um novo ID canônico, um domínio ou alias atribuído ao aplicativo, financiamento da taxa e permissão para registrar ativos no ambiente de execução.

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

Após a queima, espere o saldo da origem `64.50`, o saldo do destino `25.50` e a quantidade total `90.00`.

::: warning Limite de permissão

Em Taira, anexe o `taira.tx-metadata.json` derivado da torneira e use `--fee-payer authority` para cada gravação. Registro e emissão requerem as permissões do validador ativo; transferência e queima requerem o principal de autorização sobre o saldo de origem. Uma conta financiada pela testnet não é automaticamente um emissor.

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
- O Passo 2 escolhe deliberadamente uma conta de destino registrada. Se a admissão do ativo for `ExplicitOnly`, forneça o saldo de destino por meio de um autorizado fluxo antes da transferência. O guarda com nome semelhante CLI não registra uma conta ou saldo; ele aborta em vez de adicionar outra instrução.
- Uma rejeição de taxa ocorre antes do sucesso normal da instrução. Selecione o pagador, use os metadados do ativo de taxa da rede e verifique seu saldo.
- Se a definição local fixa já existir a partir de uma execução anterior, inicie uma localnet gerada recém ou continue com seu estado existente. Nunca substitua uma sequência aleatória malformada pelo ID Base58.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Testes de integração do ciclo de vida do ativo no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust exemplos de construção de ativos no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Ativos](/pt/blockchain/assets.md)
- [Instruções](/pt/blockchain/instructions.md)
- [Tokens de permissão](/pt/reference/permissions.md)
- [JavaScript e TypeScript](/pt/guide/tutorials/javascript.md)
