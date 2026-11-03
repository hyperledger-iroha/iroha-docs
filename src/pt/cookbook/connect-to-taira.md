---
translation_locale: pt
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Conectar-se a Taira {#connect-to-taira}

## Resultado {#outcome}

Confirme que Taira está acessível, derive o ID da conta canônica I105 a partir de uma configuração de cliente local, financie o signatário criptográfico com XOR da testnet e envie uma transação canária com taxa cotada. Esta receita nunca envia uma escrita para Minamoto.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Python 3.11 ou posterior, e os binários atuais `iroha` e `kagami`.
- Um `taira.client.toml` criado com a cadeia Taira, o `network_id` exato, ponto de extremidade API, perfil de conta e uma chave dedicada de testnet. Siga [Criar uma Configuração de Cliente Taira](/pt/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) e mantenha o arquivo fora do controle de versão.
- Um diretório de trabalho gravável para o diário do serviço de financiamento da testnet: `iroha taira account faucet prepare` cria `./taira-faucet` com permissões privadas e se recusa a substituir um diretório existente.

## Passos {#steps}

### 1. Separe a vivacidade da prontidão {#_1-separate-liveness-from-readiness}

`/livez`, `/health` e `/readyz` são verificações em texto simples; `/status` retorna JSON. Um nó em execução pode legitimamente retornar `503` de `/readyz` quando a admissão de consenso ou outro subsistema necessário está indisponível.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Use `/livez` apenas para decidir se o processo responde. Use `/readyz` para admissão de tráfego. Seu `503` é um envelope de erro `service_unavailable` sem detalhes do bloqueador, então execute os diagnósticos abaixo antes de tratá-lo como uma interrupção.

### 2. Execute os diagnósticos públicos {#_2-run-the-public-diagnostics}

Esta verificação é somente leitura e não carrega a configuração do signatário criptográfico:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Não continue a escrever quando o médico relatar uma falha difícil DNS, TLS, em cadeia ou API no endpoint. Uma fila pública saturada é transitória; espere e tente novamente com uma política limitada.

### 3. Derive o ID da conta Taira sem imprimir um segredo {#_3-derive-the-taira-account-id-without-printing-a-secret}

Leia apenas a chave pública da configuração, depois codifique-a com o perfil Taira I105. O ID da conta não carrega domínio; `[account].profile` seleciona apenas seu prefixo de rede.

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

A política do serviço de financiamento da testnet indica a definição atual do ativo de taxa. Mantenha seu ID Base58 em vez de copiar um ID de outra rede ou de uma execução antiga. A política é composta de dados de descoberta não assinados, então a automação deve fixar o emissor, a definição de ativo e a quantidade que espera em vez de confiar em cada resposta.

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` resolve a prova de trabalho e salva a transação assinada exata; `submit` a envia uma vez e retorna depois que ela é aplicada. Se `submit` relatar `Pending` ou exceder o tempo limite, execute `taira account faucet resume` com a mesma configuração e o mesmo diário em vez de preparar outra reivindicação. Depois verifique o saldo por no máximo um minuto.

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

Use `--fee-payer authority` para cada gravação na Taira. A seleção está vinculada à assinatura, e o CLI cota a taxa exata, no ativo de taxa da Taira, antes de assinar.

## Verificar {#verify}

Envie uma instrução de log, mantenha o registro do resultado do protocolo JSON e aguarde a finalização Aplicada. Omitir `--no-wait` também faz com que a submissão inicial aguarde confirmação; a leitura explícita do status prova o estado final do pipeline de processamento.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

O comando final só tem sucesso depois que o status global exato informa a finalidade `Applied` resolvida no estado. Mantenha o hash criptográfico como evidência de teste; nunca armazene a chave privada ou a configuração completa do cliente junto com ele.

## Solução de problemas {#troubleshooting}

- `/livez`, `/health` e `/readyz` retornam `406` quando solicitados apenas por JSON, porque respondem em `text/plain`. Envie os cabeçalhos `Accept` mostrados acima.
- `/readyz` pode retornar `503` com um envelope de erro `service_unavailable`, mesmo enquanto `/livez` e `/status` funcionam. Aguarde a prontidão ou execute `iroha taira doctor`; regenerar as chaves não alterará a prontidão do nó.
- Um `502` ou tempo limite do dispensador durante `submit` deixa o resultado da reivindicação desconhecido: execute `taira account faucet resume` com a mesma configuração e o mesmo diário em vez de preparar outra reivindicação. Uma âncora de prova de trabalho obsoleta faz `prepare` falhar; prepare novamente em um novo diretório de diário.
- Um erro de prefixo I105 significa que a chave pública foi codificada com o perfil errado. Execute `iroha tools address convert --profile taira` novamente.
- A rejeição de uma cotação de taxa geralmente indica que a conta com autoridade não tem fundos ou que o `network_id` configurado não é o da Taira. A ausência de `--fee-payer`, ou uma chave de taxa como `gas_asset_id` em `--metadata`, falha localmente antes da cotação.
- O registro, a emissão ou o gerenciamento de namespace ainda podem ser rejeitados após o sucesso deste canário. Essas operações requerem permissões de tempo de execução de software separadas; ensaie-as na rede local gerada quando o acesso Taira não tiver sido concedido.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Diagnósticos do CLI Taira e origem canário](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) e [comandos do serviço de financiamento da testnet](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs) no commit fixado
- [Seleção explícita de taxa e fonte de envio CLI no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Taira guia de serviço de conta e financiamento em testnet](/pt/get-started/sora-nexus-dataspaces.md)
- [Configuração do cliente](/pt/guide/configure/client-configuration.md)
- [Transações](/pt/blockchain/transactions.md)
