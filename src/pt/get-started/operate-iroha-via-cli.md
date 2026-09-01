---
translation_locale: pt
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Operar Iroha 3 via CLI {#operate-iroha-3-via-cli}

O binário `iroha` é o cliente de linha de comando para Iroha 3. Use-o para consultar o estado do livro-razão da blockchain, enviar transações e inspecionar os endpoints do operador API.

## 1. Pré-requisitos {#_1-prerequisites}

Inicie uma rede local primeiro:

- [Iniciar Iroha 3](./launch-iroha.md)

Os exemplos abaixo assumem a configuração de cliente gerada a partir da localnet criada em [Iniciar Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. Configuração Básica CLI {#_2-basic-cli-setup}

Mostre a ajuda de nível superior:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

O CLI está organizado nesses grupos de comando de nível superior:

- `account` para atalhos orientados à conta
- `tx` para auxiliares em nível de transação
- `ledger` para leituras e gravações on-ledger
- `ops` para diagnósticos do operador
- `app` para o aplicativo API ajudantes
- `contract` para implantação de contrato e chamadas
- `tools` para diagnóstico e utilitários de desenvolvedor
- `taira` para Taira e fluxos de trabalho orientados a Nexus

O grupo `ledger` também contém auxiliares de transação específicos do domínio, como `ledger transaction`.

Use `--output-format text` para saída de operador legível por humanos e `--machine` para modo de automação estrita.

## 3. Experimente a Testnet Pública Taira {#_3-try-the-public-taira-testnet}

Você pode tentar verificações apenas de leitura Taira antes de executar um par de rede local ou criar um signatário criptográfico. Esses comandos usam rotas públicas Torii JSON e não gastam XOR da testnet.

Verifique o status Taira:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Liste os domínios públicos no espaço de dados `universal`:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Liste algumas definições de ativos e seu fornecimento atual:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Se você tiver o binário atual `iroha`, execute o assistente de diagnóstico Taira:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Crie `taira.client.toml` somente quando estiver pronto para testar comandos assinados. Consulte [Conectar-se aos Dataspaces SORA Nexus](/pt/get-started/sora-nexus-dataspaces.md) para a configuração, serviço de financiamento testnet e fluxo canário. Não execute comandos de escrita em Taira até que a conta esteja financiada com o ativo de taxa do serviço de financiamento testnet.

Para qualquer exemplo da CLI Taira sujeito a taxa, salve o auxiliar de [Obter XOR de teste na Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py` e solicite primeiro o XOR de teste:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Se a rota de desafio ou solicitação do dispensador retornar `502`, aguarde e tente novamente. É um problema de disponibilidade da rede de testes pública, não um motivo para regenerar as chaves da conta.

Após o saldo estar visível, anexe os metadados do ativo de taxa às gravações:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Comandos básicos do livro-razão da blockchain {#_4-basic-ledger-commands}

Liste todos os domínios:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

A criação de domínio comum usa o planejador de alias declarativo; o comando `ledger domain` não possui subcomando `register`. Prepare uma intenção `AliasSetupPlanRequestV1` sem segredo para `docs.universal` com seu SDK ou serviço de integração, depois planeje e aplique:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

A intenção fixa o ID do espaço de dados, a conta do proprietário canônico, o prazo do contrato e a cota de proteção atual. O planejador verifica o estado ao vivo e retorna o plano atômico exato `EnsureAlias` para submissão. Não copie manualmente os valores de proteção de outra rede.

Envie uma transação ping simples:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Leia um bloco recente ou inscreva-se em eventos de bloco:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Comandos do Operador {#_5-operator-commands}

Os comandos do operador de consenso exigem uma chave autorizada do ambiente de execução. Não a inclua em `client.toml`; informe explicitamente o arquivo exclusivo do proprietário:

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

Diagnósticos não vinculantes da fila, do pipeline, da eleição e das vias de execução:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

Certificados de quórum de consenso mais alto e bloqueado:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
```

Parâmetros de consenso on-chain:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. Para Onde Ir a Seguir {#_6-where-to-go-next}

- [SDK tutoriais](/pt/guide/tutorials/)
- [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md)
- [Trabalhando com binários Iroha](/pt/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

Para regenerar um instantâneo completo da ajuda em Markdown a partir da cópia local do código-fonte, execute:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
