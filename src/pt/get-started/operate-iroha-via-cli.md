---
translation_locale: pt
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 40714a6cd124d4b0342b0f6ecf321f286e714c0e236afd6fd7834c0cf0ad1165
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Operar Iroha 3 via CLI {#operate-iroha-3-via-cli}

O binário `iroha` é o cliente de linha de comando do Iroha 3. Use-o para consultar o estado do livro-razão, enviar transações e inspecionar endpoints de operação.

## 1. Pré-requisitos {#_1-prerequisites}

A partir de uma cópia de trabalho do Iroha na revisão de código-fonte documentada, gere e inicie uma rede local de quatro pares:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
./localnet/start.sh
```

Os exemplos abaixo usam a configuração de cliente gerada por ela, `./localnet/client.toml`.

## 2. Configuração Básica CLI {#_2-basic-cli-setup}

Mostre a ajuda de nível superior:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

O CLI está organizado nesses grupos de comando de nível superior:

- `account` para leituras e mutações de conta
- `explorer` para feeds do explorador com filtros compartilhados e paginação
- `tx` para status de transação e auxiliares de transação
- `ledger` para leituras e gravações on-ledger
- `trigger` para leituras, escritas e execução de gatilhos
- `ops` para diagnósticos do operador
- `app` para o aplicativo API ajudantes
- `contract` para chamadas de contratos, consultas e depuração local; implante com `kagami contract deploy` ou `musubi deploy`
- `tools` para diagnóstico e utilitários de desenvolvedor
- `dataspace` para planejar, aplicar e inspecionar uma definição de espaço de dados
- `taira` para diagnósticos do Taira e integração de contas
- `offline` para codificadores offline, relatórios e diagnósticos
- `soracloud` para os auxiliares da plataforma de aplicativos Soracloud
- `sccp` para leituras, transferências e provas do SORA Cross-Chain Protocol

Todo comando que envia uma transação exige um pagador de taxas explícito, como `--fee-payer authority`; a CLI fornece a cotação exata da taxa antes de assinar.

Use `--output-format text` para saída de operador legível por humanos e `--machine` para modo de automação estrita.

## 3. Experimente a Testnet Pública Taira {#_3-try-the-public-taira-testnet}

Você pode tentar verificações apenas de leitura Taira antes de executar um par de rede local ou criar um signatário criptográfico. Esses comandos usam rotas públicas Torii JSON e não gastam XOR da testnet.

Verifique o status Taira:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Liste os domínios visíveis para um leitor não autenticado:

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

Crie `taira.client.toml` somente quando estiver pronto para testar comandos assinados. Consulte [Conectar-se aos espaços de dados do SORA Nexus](/pt/get-started/sora-nexus-dataspaces.md) para conhecer a configuração, o faucet e o fluxo do teste básico. Não execute comandos de escrita no Taira até que a conta tenha sido financiada com o ativo de taxas do faucet.

Para qualquer exemplo da CLI do Taira que pague taxas, financie o signatário com o fluxo preparado do faucet em [Obter XOR de testnet no Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) e depois confira o saldo:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Se uma rota do faucet retornar `502`, aguarde e tente novamente. Isso é um problema de disponibilidade da testnet pública, não um sinal para gerar novamente as chaves da conta.

Depois que o saldo estiver visível, envie operações de escrita com `--fee-payer authority`. A CLI fornece a cotação exata da taxa, no ativo de taxas do Taira, antes de assinar:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. Comandos básicos do livro-razão da blockchain {#_4-basic-ledger-commands}

Liste todos os domínios:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

A criação de domínio comum usa o planejador de alias declarativo; o comando `ledger domain` não possui subcomando `register`. Prepare uma intenção `AliasSetupPlanRequestV1` sem segredo para `docs.universal` com seu SDK ou serviço de integração, depois planeje e aplique:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

A intenção fixa o ID do espaço de dados, a conta canônica do proprietário, o prazo de locação e a condição de proteção da cotação atual. O planejador verifica o estado da rede em operação e retorna o plano atômico exato `EnsureAlias` a enviar. Não copie manualmente valores de proteção de outra rede.

Envie uma transação ping simples:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

Leia um bloco recente ou inscreva-se em eventos de bloco:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Comandos do Operador {#_5-operator-commands}

Os comandos de operação do consenso exigem uma chave de execução incluída na lista de permissões. Mantenha-a fora de `client.toml` e forneça o caminho absoluto do arquivo acessível somente ao proprietário:

```bash
# The generated localnet writes its allow-listed operator key here.
: "${OPERATOR_KEY_FILE:=$PWD/localnet/runtime/operator-signer.key}"

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

Faixas de consenso confirmadas e status das instâncias deste nó:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
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
- [Endpoints do Torii](/pt/reference/torii-endpoints.md)
- [Trabalhando com binários Iroha](/pt/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

Para imprimir uma cópia completa da ajuda em Markdown a partir do checkout do código-fonte, execute:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
