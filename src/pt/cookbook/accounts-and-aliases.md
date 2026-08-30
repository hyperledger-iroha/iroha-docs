---
translation_locale: pt
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 429535e5bb4ad1d3110f29a5b3896c0d3ce39264dbd357fa932fcc2a5f48d0f1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Contas e pseudónimos {#accounts-and-aliases}

## Resultados {#outcome}

Trabalhar com segurança com canônico sem domínio I105 Conta IDs e alias legíveis ao homem ligados separadamente, tais como: `treasury@payments.universal`. Você vai inspecionar Taira contas, derivar o seu próprio canônico ID, e resolver alias sem confundir o contexto de roteamento com a identidade.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Python 3.11 ou mais tarde, e a corrente `iroha` CLI.
- A `taira.client.toml` de [Conectar-se a Taira](./connect-to-taira.md) ao inspecionar a sua própria conta.
- Uma conta fornecida através da torneira Taira ou do caminho de incorporação regulado da rede antes de esperar que uma leitura específica da conta seja bem sucedida.

## Passos {#steps}

### 1. Inspeção das contas canônicas de Taira {#_1-inspect-canonical-accounts-on-taira}

A lista de contas públicas sempre apresenta canônica I105 IDs. Um alias primário é opcional e deve ser comunicado separadamente.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Um ID de `.id` é válido para campos estritos da conta. Não adicione um domínio a ele. Um alias de `.primary_alias` é uma chave de pesquisa orientada ao usuário, não outra identidade canônica.

### 2. Derivar e normalizar o seu Taira I105 ID {#_2-derive-and-normalize-your-taira-i105-id}

Leia apenas a chave pública da configuração local. A mesma chave pública é codificada de forma diferente para diferentes perfis de rede pública, então selecione explicitamente `taira`.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

O valor normalizado deve ser idêntico ao `TAIRA_ACCOUNT_ID`. A configuração `[account].domain` no arquivo TOML pode ser `wonderland.universal`, mas esse valor afeta apenas o contexto de roteamento e alias.

### 3. Ler a conta e os seus activos {#_3-read-the-account-and-its-assets}

Após a provisão da conta, consulta-a diretamente e enumera uma página de ativo limitado. URL - codifique o valor I105 antes de usá-lo em um caminho.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4. Procure alias ligados à conta {#_4-look-up-aliases-bound-to-the-account}

O resolutor inverso aceita uma conta canônica exata ID. As linhas do espaço de dados público podem ser lidas sem cabeçalhos de assinatura de solicitação; os espaços de dados restritos exigem um pedido autorizado assinado.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` é válido: uma conta não precisa de um alias. Quando existir um alias vinculativo, resolver o seu alias exato totalmente qualificado e comparar a conta devolvida ID:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning Limite de autorização

A Comissão Taira A rubrica pode fornecer a sua conta do requerente, mas isso não concede o Autoridade de registo da conta ou autoridade de gestão do pseudônimo. `CanRegisterAccount` Os pseudónimos de conta normalmente exigem também um SNS Licença de arrendamento e as licenças de alias adequadas. ou ensaio de registo contra a rede local gerada.

:::

Em uma rede local, uma vez que um passo de fornecimento seguro de assinantes tenha exportado uma nova canónica `NEW_ACCOUNT_ID`, a superfície de registo é:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Gerar e armazenar a chave privada correspondente fora do repositório de documentação ou aplicativos. Registrar uma ID cuja chave controladora foi descartada cria uma conta inutilizável.

## Verificar {#verify}

Demonstrar que a chave pública de configuração, a codificação I105 e os alias vinculativos convergem em uma conta canônica ID:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

Mantenha a conta canônica IDs. Utilize a canónica IDs para assinaturas, permissões e instruções de transação. Resolva um alias na fronteira do aplicativo. Conserve a conta canónica ID usada para a operação.

## Resolução de problemas {#troubleshooting}

- Um erro de análise ou prefixo geralmente significa que um endereço foi codificado para um perfil de rede diferente. Normalize com `--profile taira` e rejeite as desativadas.
- Uma conta `404` após uma torneira `202` pode ser o atraso de propagação. Pesquise a conta ou o ativo financiado antes de enviar uma carta.
- `total: 0` do resolvedor inverso significa que não há alias visíveis ligados; não é uma falha de pesquisa da conta.
- `401` ou `403` de uma rota alias indica um espaço de dados restrito ou permissão insuficiente para resolução exata. Não use a pesquisa de prefixos largos como retrocesso.
- Um valor legível `name@domain.dataspace` não é aceito em todos os lugares onde se requer um canônico I105 ID. Resolva-o primeiro.
- Se o registro local da conta tiver sucesso mas Taira rejeita, a diferença é a autorização. Obter `CanRegisterAccount`; não alterar a conta ID para contornar a validação.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Implementação do endereço da conta canônica no compromisso fixado ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [Testes de conta e alias Torii no compromisso fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Contas ](/pt/blockchain/accounts.md)
- [Anônimos de modelo de dados](/pt/blockchain/data-model.md#aliases)
- [Convenções de denominação](/pt/reference/naming.md)
- [Tokens de permissão ](/pt/reference/permissions.md)
