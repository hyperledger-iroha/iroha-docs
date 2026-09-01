---
translation_locale: pt
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Contas e Apelidos {#accounts-and-aliases}

## Resultado {#outcome}

Trabalhe com segurança com IDs de conta canônicos sem domínio I105 e aliases legíveis por humanos vinculados separadamente, como `treasury@payments.universal`. Você irá inspecionar contas Taira, derivar seu próprio ID canônico e resolver aliases sem confundir o contexto de roteamento com a identidade.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Python 3.11 ou posterior, e o atual `iroha` CLI.
- Um `taira.client.toml` de [Conectar-se a Taira](./connect-to-taira.md) ao inspecionar sua própria conta.
- Uma conta fornecida através do serviço de financiamento da testnet Taira ou pelo caminho de integração governado da rede antes de esperar que uma leitura específica da conta tenha sucesso.

## Passos {#steps}

### 1. Inspecionar contas canônicas em Taira {#_1-inspect-canonical-accounts-on-taira}

A lista de contas públicas sempre retorna IDs canônicos I105. Um alias primário é opcional e é relatado separadamente.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Um ID de `.id` é válido para campos de conta restritos. Não adicione um domínio a ele. Um alias de `.primary_alias` é uma chave de busca voltada para o usuário, não outra identidade canônica.

### 2. Derive e normalize seu ID Taira I105 {#_2-derive-and-normalize-your-taira-i105-id}

Leia apenas a chave pública da configuração local. A mesma chave pública é codificada de maneira diferente para diferentes perfis de rede pública, então selecione `taira` explicitamente.

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

O valor normalizado deve ser idêntico a `TAIRA_ACCOUNT_ID`. A configuração `[account].domain` no arquivo TOML pode ser `wonderland.universal`, mas esse valor afeta apenas o roteamento e o contexto de alias.

### 3. Leia a conta e seus ativos {#_3-read-the-account-and-its-assets}

Após a conta ser provisionada, consulte-a diretamente e liste uma página de ativos limitada. URL codifique o valor I105 antes de usá-lo em um caminho.

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

### 4. Pesquise os apelidos vinculados à conta {#_4-look-up-aliases-bound-to-the-account}

O resolvedor reverso aceita um ID de conta canônica exato. Linhas de espaço de dados público podem ser lidas sem cabeçalhos de assinatura de solicitação; espaços de dados restritos exigem uma solicitação assinada autorizada.

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

`total: 0` é válido: uma conta não precisa de um alias. Quando uma ligação existe, resolva seu alias totalmente qualificado exato e compare o ID da conta retornado:

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

::: warning Limite de permissão

O serviço de financiamento da testnet Taira pode fornecer fundos para sua conta reivindicante, mas isso não concede autorização geral para registro de contas ou gerenciamento de alias. Registrar outra conta requer `CanRegisterAccount` sob o validador ativo. Aliases de conta normalmente também exigem um contrato ativo SNS e as permissões de alias apropriadas. Use o planejador de onboarding/alias regulamentado ou ensaie o registro contra a rede local gerada.

:::

Em uma rede local, uma vez que uma etapa segura de provisionamento de assinante tenha exportado um novo `NEW_ACCOUNT_ID` canônico, a superfície de registro é:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Gere e armazene a chave privada correspondente fora da documentação ou do repositório da aplicação. Registrar uma ID cuja chave de controlador foi descartada cria uma conta inutilizável.

## Verificar {#verify}

Prove que a chave pública de configuração, a codificação I105 e a vinculação de alias convergem todas para um único ID de conta canônico:

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

Armazene IDs de conta canônicos. Use IDs canônicos para assinaturas, permissões e instruções de transação. Resolva um alias na fronteira do aplicativo. Mantenha o ID de conta canônico usado para a operação.

## Solução de problemas {#troubleshooting}

- Um erro de análise ou de prefixo geralmente significa que um endereço foi codificado para um perfil de rede diferente. Normalize com `--profile taira` e rejeite incompatibilidades.
- Uma conta `404` após um serviço de financiamento de testnet `202` pode ter atraso de propagação. Verifique a conta ou o ativo financiado antes de enviar uma escrita.
- `total: 0` do resolvedor reverso significa que nenhum alias visível está vinculado; não é uma falha de pesquisa de conta.
- `401` ou `403` de uma rota de alias indica um espaço de dados restrito ou permissão de resolução exata insuficiente. Não use busca por prefixo ampla como alternativa.
- Um valor `name@domain.dataspace` legível não é aceito em todos os lugares onde um ID canônico I105 é necessário. Resolva-o primeiro.
- Se o registro da conta local for bem-sucedido, mas Taira o rejeitar, a diferença é a autorização. Obtenha `CanRegisterAccount`; não altere o ID da conta para contornar a validação.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Implementação de endereço de conta canônica no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [Testes de conta e alias Torii no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Contas](/pt/blockchain/accounts.md)
- [Aliases de modelo de dados](/pt/blockchain/data-model.md#aliases)
- [Convenções de nomenclatura](/pt/reference/naming.md)
- [Tokens de permissão](/pt/reference/permissions.md)
