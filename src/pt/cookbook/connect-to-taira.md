---
translation_locale: pt
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: a7347a7e8ea055fd5bab9a34b6124ea19ef6f355f9beef9e9488794d9c6e3202
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Conectar-se a Taira {#connect-to-taira}

## Resultados {#outcome}

Confirmar que Taira é acessível, derivar a conta canônica I105 ID de uma configuração local do cliente, financiar o signatário com testnet XOR e enviar uma transação canária cotada por taxa. Esta receita nunca envia um escrito para Minamoto.

## Pré-requisitos {#prerequisites}

- Os binários `iroha` e `kagami` atuais são `curl`, `jq`, Python 3.11 ou posterior.
- A. `taira.client.toml` criado com o Taira Chain, endpoint, perfil da conta e uma chave testnet dedicada. [Criar um Taira Configuração do cliente](/pt/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) E mantenha o ficheiro fora do controlo da fonte.
- O pronto-a- execução `taira_faucet_claim.py` de [Get Testnet XOR em Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), guardado ao lado da configuração do cliente.

## Passos {#steps}

### 1. Separar a capacidade de vida da preparação {#_1-separate-liveness-from-readiness}

`/livez` é uma sonda de vida útil de processo de texto simples. `/status`, `/health` e `/readyz` retornar JSON. Um nó em execução pode legitimamente retornar `503` das sondas de prontidão quando um subsistema requerido está bloqueado.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Use `/livez` apenas para decidir se o processo responde. Use `/readyz` para a admissão de trânsito e inspecione os detalhes do bloqueador JSON antes de tratar um `503` como uma interrupção.

### 2. Realizar o diagnóstico público {#_2-run-the-public-diagnostics}

Esta verificação é de somente leitura e não carrega a configuração do assinante:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Não continue a escrever quando o médico relata uma falha dura DNS, TLS, cadeia ou ponto final. Uma fila pública saturada é transitória; espere e tente novamente com um limite de política.

### 3. Derivar a conta Taira ID sem imprimir um segredo {#_3-derive-the-taira-account-id-without-printing-a-secret}

Leia apenas a chave pública da configuração, em seguida, codifique-a com o perfil Taira I105. O valor `[account].domain` fornece contexto de roteamento; não faz parte da conta ID.

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

A saída é um endereço canônico I105 sem domínio. Nomes como `wallet@payments.universal` são pseudônimos e devem ser resolvidos antes de serem usados em campos de conta rigorosos.

### 4. Reclamar o ativo de taxa corrente Taira {#_4-claim-the-current-taira-fee-asset}

A resposta da torneira é a fonte de verdade para a definição do ativo de taxa. Mantenha a Base58 ID devolvida em vez de copiar uma ID de outra rede ou de um antigo run.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Pesquisar o saldo durante, no máximo, um minuto. A torneira pode retornar `202 Accepted` antes da transacção de financiamento ser visível.

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

`gas_asset_id` são metadados de transacção. A seleção explícita `--fee-payer authority` é vinculada à assinatura, e a CLI obtém uma cotação exata antes de assinar.

## Verificar {#verify}

Enviar uma instrução de registro, manter o recibo JSON e esperar a finalidade aplicada. A omissão `--no-wait` também faz com que a submissão inicial espere para confirmação; a leitura explícita do status prova o estado final do pipeline.

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

O comando final só é efetuado após a transação atingir o estado de terminal padrão `Applied`. Mantenha o hash na evidência do teste; nunca armazenar a chave privada ou a configuração completa do cliente com ele.

## Resolução de problemas {#troubleshooting}

- O `/livez` retorna `406` quando solicitado o JSON, porque esse ponto final é `text/plain`. Enviar `Accept: text/plain` como mostrado acima.
- `/health` ou `/readyz` podem retornar `503` com um bloqueador de leitura automática, mesmo enquanto `/livez` e `/status` funcionam. Fixar ou esperar por esse bloqueador; as chaves regeneradoras não alterarão a prontidão do nó.
- Uma torneira `502`, um timeout ou ancoramento antiquado de prova de trabalho são uma falha do serviço público.
- Um erro de prefixo I105 significa que a chave pública foi codificada com o perfil errado. Re-executar `iroha tools address convert --profile taira`.
- Uma rejeição da taxa geralmente significa que a autoridade não foi financiada, os metadados do ativo de taxa são obsoletos ou que nenhum pagador explícito de taxa foi selecionado.
- O registro, a minagem ou o gerenciamento do espaço de nomes ainda podem ser rejeitados após esse canário ter sucesso. Essas operações requerem permissões de execução separadas; ensina-as na rede local gerada quando: Taira O acesso não foi concedido.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Taira CLI de diagnóstico e fonte canária no comitamento fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/taira.rs)
- [Seleção explícita da taxa e fonte de apresentação CLI no compromisso fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Taira Guia de conta e torneira](/pt/get-started/sora-nexus-dataspaces.md)
- [Configuração do cliente](/pt/guide/configure/client-configuration.md)
- [Transações ](/pt/blockchain/transactions.md)
