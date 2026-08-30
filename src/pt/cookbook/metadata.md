---
translation_locale: pt
translation_source: /cookbook/metadata.md
translation_source_hash: 238595124cd0a1b71900020d650fb208f844e051d2db4427801fe6405ff591c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Metadados {#metadata}

## Resultados {#outcome}

Leia os metadados em Taira, define e verifique o valor dos metadados de uma conta com uma transacção explicitamente de pagamento de taxas, e remover novamente o valor. Você manterá os metadados dos objetos do livro separados dos metadados das taxas de transacção.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Python 3.11 ou mais tarde, e a corrente `iroha` CLI.
- Um `taira.client.toml` e `taira.tx-metadata.json` financiados a partir de [Conecte-se ao Taira](./connect-to-taira.md).
- Autoridade sobre os metadados da conta de destino. O exemplo visa a própria autoridade configurada; outra conta requer uma permissão exata.

## Passos {#steps}

### 1. Ler metadados sem um assinante {#_1-read-metadata-without-a-signer}

Metadados é um mapa verificado `Name` para JSON. mapas vazios e saída filtrada vazia são resultados válidos.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

Utilize metadados para pequenos campos de descrição ou indexação. Coloque as grandes cargas úteis fora do livro e armazene um digest, URI, ou SoraFS referência em vez.

### 2. Derivar a conta-alvo {#_2-derive-the-target-account}

Leia apenas a chave pública da configuração Taira e converta-a no formulário canônico sem domínio I105.

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
```

### 3. Estabelecer um valor JSON {#_3-set-one-json-value}

O JSON lido a partir da entrada padrão torna-se o valor `cookbook_profile` da conta. Por outro lado, `--metadata ./taira.tx-metadata.json` anexa campos de taxas ao envelope da transação. Os dois mapas têm objetivos e finalidades diferentes.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

O CLI cita a taxa, sinaliza, apresenta e espera por padrão. Não adicione `--no-wait` quando a próxima operação depender desse valor.

::: warning Limite de autorização

O validador ativo decide quem pode mutar cada objeto. Atualizar outra conta normalmente requer `CanModifyAccountMetadata`; domínios, definições de ativos, NFTs, e os gatilhos têm suas próprias permissões de metadados específicos para o alvo. Se Taira não tiver concedido a autoridade requerida, executar os mesmos comandos da conta com `./localnet/client.toml`, substituir o canônico da autoridade local de rede gerada I105 ID, e omitir o arquivo de metadados das taxas Taira.

:::

### 4. Remover a chave {#_4-remove-the-key}

Primeiro, leia o valor comprometido e, em seguida, apresente uma transação de remoção separada.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Para as aplicações Python, os construtores correspondentes são `Instruction.set_account_key_value` e `Instruction.remove_account_key_value`; entregue-os com os metadados da transação e assistente de espera do tutorial [Python ](/pt/guide/tutorials/python.md#shared-setup).

## Verificar {#verify}

Após a transacção definida, `meta get` deve devolver o objeto com `version: 1`. Após a remoção, uma pesquisa direta não deve mais retornar um valor:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

A leitura da conta separada distingue uma chave de metadados faltante de uma falha na rede ou na conta. O código de produção deve também verificar o valor inteiro JSON após a sua configuração.

## Resolução de problemas {#troubleshooting}

- A entrada padrão deve conter um valor válido JSON. As cordas precisam de citações JSON; objetos e matrizes devem estar bem formados.
- As chaves de metadados são valores `Name` e são sensíveis ao caso após a análise. Mantenha um vocabulário de chaves estável em vez de criar chaves versionadas para cada mudança de esquema.
- `--metadata` é metadados de transacção; não define metadados do objeto do livro-razão. `meta set` Subcomandante para este último.
- Uma apresentação bem sucedida seguida de uma leitura antiga pode ser um atraso na propagação. Espere a finalidade Aplicada e tente novamente a consulta antes de reenviar.
- Uma rejeição de permissão identifica o objeto-alvo e a fronteira da autoridade. Repetir localmente ou solicitar o token exato; não mover os dados privados do aplicativo para um campo de metadados público para evitar o controle de acesso.
- Nunca armazenar chaves privadas, identificadores pessoais brutos, tokens de acesso ou documentos grandes em metadados.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Testes de integração de consultas de metadados no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Construtores de transações Python SDK no compromisso fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Metadados ](/pt/blockchain/metadata.md)
- [Metadados e opções de armazenamento de contabilidade ](/pt/guide/configure/metadata-and-store-assets.md)
- [Referência de instruções ](/pt/reference/instructions.md)
- [Tokens de permissão ](/pt/reference/permissions.md)
