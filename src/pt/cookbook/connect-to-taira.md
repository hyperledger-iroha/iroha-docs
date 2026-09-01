---
translation_locale: pt
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Conectar-se a Taira {#connect-to-taira}

## Resultado {#outcome}

Confirme que Taira está acessível, derive o ID da conta canônica I105 a partir de uma configuração de cliente local, financie o signatário criptográfico com XOR da testnet e envie uma transação canária com taxa cotada. Esta receita nunca envia uma escrita para Minamoto.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Python 3.11 ou posterior, e os binários atuais `iroha` e `kagami`.
- Um `taira.client.toml` criado com a cadeia Taira, ponto de extremidade API, perfil de conta e uma chave dedicada de testnet. Siga [Criar uma Configuração de Cliente Taira](/pt/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) e mantenha o arquivo fora do controle de versão.
- O `taira_faucet_claim.py` pronto para uso de [Obter Testnet XOR em Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), salvo ao lado da configuração do cliente.

## Passos {#steps}

### 1. Separe a vivacidade da prontidão {#_1-separate-liveness-from-readiness}

`/livez` é uma verificação de vivacidade de processo em texto simples. `/status`, `/health` e `/readyz` retornam JSON. Um nó em execução pode legitimamente retornar `503` das verificações de prontidão quando um subsistema necessário está bloqueado.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Use `/livez` apenas para decidir se o processo responde. Use `/readyz` para admissão de tráfego e inspecione seus detalhes do bloqueador JSON antes de tratar um `503` como uma interrupção.

### 2. Execute os diagnósticos públicos {#_2-run-the-public-diagnostics}

Esta verificação é somente leitura e não carrega a configuração do signatário criptográfico:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Não continue a escrever quando o médico relatar uma falha difícil DNS, TLS, em cadeia ou API no endpoint. Uma fila pública saturada é transitória; espere e tente novamente com uma política limitada.

### 3. Derive o ID da conta Taira sem imprimir um segredo {#_3-derive-the-taira-account-id-without-printing-a-secret}

Leia apenas a chave pública da configuração, depois codifique-a com o perfil Taira I105. O valor `[account].domain` fornece o contexto de roteamento; não é parte do ID da conta.

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
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

A saída é um endereço canônico sem domínio I105. Nomes como `wallet@payments.universal` são apelidos e devem ser resolvidos antes de serem usados em campos de conta estritos.

### 4. Reivindique o ativo de taxa atual Taira {#_4-claim-the-current-taira-fee-asset}

A resposta do serviço de financiamento da testnet é a fonte de verdade para a definição do ativo de taxa. Mantenha o ID Base58 retornado em vez de copiar um ID de outra rede ou de uma execução antiga.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Verifique o saldo por no máximo um minuto. O serviço de financiamento da testnet pode retornar `202 Accepted` antes que a transação de financiamento seja visível.

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

`gas_asset_id` é metadado da transação. A seleção explícita `--fee-payer authority` está vinculada à assinatura, e o CLI obtém uma estimativa exata do preço da taxa antes de assinar.

## Verificar {#verify}

Envie uma instrução de log, mantenha o registro do resultado do protocolo JSON e aguarde a finalização Aplicada. Omitir `--no-wait` também faz com que a submissão inicial aguarde confirmação; a leitura explícita do status prova o estado final do pipeline de processamento.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

O comando final só tem sucesso após a transação atingir o estado terminal padrão `Applied`. Mantenha o hash criptográfico como evidência de teste; nunca armazene a chave privada ou a configuração completa do cliente junto com ele.

## Solução de problemas {#troubleshooting}

- `/livez` retorna `406` quando solicitado por JSON porque aquele endpoint API está `text/plain`. Envie `Accept: text/plain` como mostrado acima.
- `/health` ou `/readyz` podem retornar `503` com um bloqueador legível por máquina, mesmo enquanto `/livez` e `/status` funcionam. Corrija ou espere por esse bloqueador; regenerar as chaves não alterará a prontidão do nó.
- Um erro `502` do dispensador, um tempo limite ou uma âncora de prova de trabalho obsoleta indicam falha do serviço público. Obtenha um novo desafio e tente novamente mais tarde.
- Um erro de prefixo I105 significa que a chave pública foi codificada com o perfil errado. Execute `iroha tools address convert --profile taira` novamente.
- A rejeição de uma cotação de taxa geralmente indica que a conta com autoridade não tem fundos, que os metadados do ativo de taxa estão obsoletos ou que nenhum pagador explícito foi selecionado.
- O registro, a emissão ou o gerenciamento de namespace ainda podem ser rejeitados após o sucesso deste canário. Essas operações requerem permissões de tempo de execução de software separadas; ensaie-as na rede local gerada quando o acesso Taira não tiver sido concedido.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Taira CLI diagnósticos e origem canário no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [Seleção explícita de taxa e fonte de envio CLI no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira guia de serviço de conta e financiamento em testnet](/pt/get-started/sora-nexus-dataspaces.md)
- [Configuração do cliente](/pt/guide/configure/client-configuration.md)
- [Transações](/pt/blockchain/transactions.md)
