---
translation_locale: pt
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Metadados {#metadata}

## Resultado {#outcome}

Leia os metadados em Taira, defina e verifique um valor de metadado de conta com uma transação que paga taxa explicitamente, e remova o valor novamente. Você manterá os metadados do objeto de ledger separados dos metadados da taxa de transação.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Python 3.11 ou posterior, e o atual `iroha` CLI.
- Um financiado `taira.client.toml` e `taira.tx-metadata.json` de [Conectar-se a Taira](./connect-to-taira.md).
- principal de autorização sobre os metadados da conta alvo. O exemplo tem como alvo o próprio principal de autorização configurado; outra conta requer uma permissão exata.

## Passos {#steps}

### 1. Ler metadados sem um signatário criptográfico {#_1-read-metadata-without-a-signer}

Metadados são um mapa verificado de `Name` para JSON. Mapas vazios e saída filtrada vazia são resultados válidos.

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

Use metadados para pequenos campos descritivos ou de indexação. Coloque cargas grandes fora do registro e armazene um valor de resumo criptográfico, URI, ou referência SoraFS em vez disso.

### 2. Derivar a conta alvo {#_2-derive-the-target-account}

Leia apenas a chave pública da configuração Taira e converta-a para o formato canônico sem domínio I105.

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

### 3. Defina um valor JSON {#_3-set-one-json-value}

O JSON lido da entrada padrão torna-se o valor `cookbook_profile` da conta. Por outro lado, `--metadata ./taira.tx-metadata.json` anexa campos de taxa ao contêiner de dados da transação. Os dois mapas têm alvos e propósitos diferentes.

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

O CLI cotiza a taxa, assina, envia e espera por padrão. Não adicione `--no-wait` quando a próxima operação depender deste valor.

::: warning Limite de permissão

O validador ativo decide quem pode modificar cada objeto. Atualizar outra conta normalmente requer `CanModifyAccountMetadata`; domínios, definições de ativos, NFTs e gatilhos têm suas próprias permissões de metadados específicas do alvo. Se Taira não tiver concedido o principal de autorização necessário, execute os mesmos comandos de conta com `./localnet/client.toml`, substitua o ID canônico I105 do principal de autorização local gerado e omita o arquivo de metadados de taxa Taira. Mantenha a seleção explícita do pagador de taxa local.

:::

### 4. Remova a chave {#_4-remove-the-key}

Primeiro leia o valor comprometido, depois envie uma transação de remoção separada.

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

Para aplicações Python, os construtores tipados correspondentes são `Instruction.set_account_key_value` e `Instruction.remove_account_key_value`; envie-os com os metadados da transação e o assistente de espera do [tutorial de Python](/pt/guide/tutorials/python.md#shared-setup).

## Verificar {#verify}

Após a transação definida, `meta get` deve retornar o objeto com `version: 1`. Após a remoção, uma pesquisa direta não deve mais retornar um valor:

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

A conta separada lida distingue uma chave de metadados ausente de uma falha de rede ou de conta. O código de produção também deve verificar todo o valor JSON após configurá-lo.

## Solução de problemas {#troubleshooting}

- A entrada padrão deve conter um valor válido JSON. Strings precisam de aspas JSON; objetos e arrays devem estar bem formados.
- As chaves de metadados são valores `Name` e diferenciam maiúsculas de minúsculas após a análise. Mantenha um vocabulário de chaves estável em vez de criar chaves versionadas para cada alteração de esquema.
- `--metadata` é metadado de transação; ele não define metadados de objeto do livro-razão. Use o subcomando `meta set` da entidade para isso.
- Uma submissão bem-sucedida seguida por uma leitura antiga pode ser atraso de propagação. Aguarde a finalização aplicada e tente a consulta novamente antes de reenviar.
- Uma rejeição de permissão identifica o objeto alvo e o limite do principal de autorização. Ensaye localmente ou solicite o token exato; não mova dados de aplicativos privados para um campo de metadados público para evitar o controle de acesso.
- Nunca armazene chaves privadas, identificadores pessoais brutos, tokens de acesso ou documentos grandes em metadados.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Testes de integração de consulta de metadata no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK construtores de transações no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Metadados](/pt/blockchain/metadata.md)
- [Metadados e opções de armazenamento em blockchain](/pt/guide/configure/metadata-and-store-assets.md)
- [Referência de instrução](/pt/reference/instructions.md)
- [Tokens de permissão](/pt/reference/permissions.md)
