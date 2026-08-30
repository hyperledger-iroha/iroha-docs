---
translation_locale: pt
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 0a0a0735015dee015da76d5a9f5d174f8ae8b2ad67ff8924d9596850a33fc1c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Operação Iroha 3 através de CLI {#operate-iroha-3-via-cli}

O binário `iroha` é o cliente de linha de comando para Iroha 3. Use-o para consultar o estado do livro maior, enviar transações e inspecionar os endpoints do operador.

## 1. Pré-requisitos {#_1-prerequisites}

Iniciar uma rede local primeiro:

- [Lançamento Iroha 3](./launch-iroha.md)

Os exemplos abaixo assumem a configuração do cliente gerada a partir da rede local criada no [Lunch Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. Configuração básica CLI {#_2-basic-cli-setup}

Mostre a ajuda de alto nível:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

O CLI é organizado em estes grupos de comando de nível superior:

- `account` para atalhos orientados para conta
- `tx` para auxiliares de nível de transação
- `ledger` para leitura e escrita no livro de conta
- `ops` para o diagnóstico do operador
- `app` para os auxiliares da aplicação API
- `contract` para a implantação de contratos e convocações
- `tools` para serviços de diagnóstico e de desenvolvimento
- `taira` para os fluxos de trabalho orientados para Taira e Nexus

O grupo `ledger` também contém auxiliadores de transações específicos de domínios, tais como `ledger transaction`.

Usar `--output-format text` para a saída do operador legível ao ser humano e `--machine` para o modo de automação rigorosa.

## 3. Experimente a rede de teste pública Taira {#_3-try-the-public-taira-testnet}

Você pode experimentar verificações Taira somente de leitura antes de executar um peer local ou criar um assinante. Estes comandos usam rotas públicas Torii JSON e não gastam testnet XOR.

Verificar o estado do Taira:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Lista de domínios públicos no espaço de dados `universal`:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Listar algumas definições de activos e a sua oferta atual:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Se tiver o binário corrente `iroha`, executar o auxiliar de diagnóstico Taira:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Crie `taira.client.toml` apenas quando estiver pronto para testar comandos assinados. Veja [Conecte-se a SORA Nexus Dataspaces](/pt/get-started/sora-nexus-dataspaces.md) para a configuração, torneira e fluxo canário. Não execute comandos de escrita contra Taira até que a conta seja financiada com o ativo da taxa de torneira.

Para qualquer exemplo de pagamento de taxa Taira CLI, salve o auxiliar da torneira a partir de [Obter Testnet XOR em Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, e depois reivindicar testnet XOR primeiro:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Se o quebra-cabeça da torneira ou a rota de reclamação retornar `502`, espere e tente novamente. Isso é um problema de disponibilidade pública da rede de teste, não um sinal para regenerar as chaves da conta.

Após o saldo ser visível, anexar os metadados do ativo de taxas para escrever:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Comandos básicos do Ledger {#_4-basic-ledger-commands}

Lista de todos os domínios:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

A criação comum de domínios utiliza o alias declarativo de planeador; `ledger domain` O comando não tem `register` Preparem um segredo livre. `AliasSetupPlanRequestV1` a intenção de `docs.universal` com o seu SDK ou serviço de embarque, depois planejar e aplicá-lo:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

A intenção pin o espaço de dados ID, conta canônica do proprietário, prazo de arrendamento e citação atual. O planejador verifica o estado ao vivo e retorna o plano atômico exato `EnsureAlias` para enviar. Não copie manualmente os valores de proteção de outra rede.

Enviar uma simples transação de ping:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Leia um bloco recente ou inscreva-se em eventos de bloqueio:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Comandos do operador {#_5-operator-commands}

Estatuto do consenso:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

Impressão de latência por fase:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

Disponibilidade, coletor, backlog RBC e snapshot VRF:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

Parâmetros de consenso na cadeia:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. Para onde ir em seguida {#_6-where-to-go-next}

- [Tutoriais SDK](/pt/guide/tutorials/)
- [Pontos finais Torii](/pt/reference/torii-endpoints.md)
- [Trabalhar com binários Iroha](/pt/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

Para regenerar uma instantânea completa de ajuda do Markdown da caixa de fonte, executar:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
