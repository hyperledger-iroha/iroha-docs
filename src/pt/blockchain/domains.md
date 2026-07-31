---
translation_locale: pt
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Domínios {#domains}

Os domínios são nomeados espaços de nomes registados no `World`. No atual modelo de dados Iroha 3 um domínio é qualificado pelo seu espaço de dados-mãe, por isso o identificador canônico é:

```text
domain.dataspace
```

Por exemplo, `payments.universal` nomeia o domínio `payments` dentro do espaço de dados `universal`.

## Estrutura {#structure}

Um `Domain` registado contém:

- `id`: o espaço de dados qualificado `DomainId`
- `logo`: um `SoraFS` opcional para um logotipo de domínio URI
- `metadata`: metadados arbitrários de valor-chave
- `owned_by`: a conta de propriedade do domínio, normalmente a conta que o registrou

A carga útil do bootstrap usada para materializar um domínio é `NewDomain`. Ele carrega a `id`, opcional `logo` e inicial `metadata`. O tempo de execução preenche `owned_by` da autoridade.

## Registro {#registration}

A criação de domínios ordinários utiliza o fluxo de configuração do alias declarativo. SNS contrato de arrendamento, capacidades do proprietário, guarda de citação e linha de domínio em um atômico `EnsureAlias` Transacção. `Register::Domain` permanece uma superfície de gênesis/bootstrap, e o `ledger domain` O comando não tem `register` Subcomandante.

Crie uma intenção `AliasSetupPlanRequestV1` livre de segredos com um SDK ou serviço de embarque, depois faça com que o CLI planeje contra o estado ao vivo e apresente esse plano exato:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

A intenção identifica `payments.universal`, seu espaço de dados numérico, proprietário canônico I105, prazo de aquisição do arrendamento e guarda da cotação atual de política / pagamento. O ponto final do planejador é `POST /v1/aliases/setup/plan`; o plano devolvido é vinculado a cadeia, autoridade, estado e prazo. A remoção de domínio ainda usa [`Unregister`](/pt/blockchain/instructions.md#un-register).

A criação ou remoção de um domínio requer a permissão apropriada de gerenciamento de domínio sob o validador ativo de tempo de execução. Os metadados do domínio podem ser atualizados com [`SetKeyValue` e `RemoveKeyValue`](/pt/blockchain/instructions.md#setkeyvalue-removekeyvalue) quando a autoridade tiver permissão para modificar esse domínio.

## Tente em Taira {#try-it-on-taira}

Listar os domínios atualmente visíveis na rede de teste pública Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Mapear o catálogo de faixa pública de volta para os alias do espaço de dados:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Use o primeiro comando quando um aplicativo precisa verificar se existe um domínio. Use o catálogo de faixas quando você precisa confirmar se um espaço de dados é público, restringido ou está atrasado para trás da faixa principal.

A configuração de domínio é uma escrita paga. Antes de tentá-lo em Taira, salve o auxiliar da torneira a partir de [Consiga Testnet XOR na Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, financie o assinante através da torneira pública e anexe os metadados das taxas:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Construa a intenção de um nome de domínio único em testes repetidos da rede, e use a política atual Taira e o guardador de cotizações dos ativos. Não reutilize um plano produzido para localnet ou Minamoto.

## Relações com outras entidades {#relationship-to-other-entities}

As definições de ativos usam identificadores qualificados por domínio e as consultas podem listar domínios ou encontrar objetos com alcance para um domínio. As contas em si são sem domínio no modelo de dados atual, mas as contas podem possuir domínios e manter ativos cujas definições vivem sob os domínios.

Veja também:

- [Mundo](/pt/blockchain/world.md)
- [Ativos](/pt/blockchain/assets.md)
- [Metadados ](/pt/blockchain/metadata.md)
- [Regras de nomeação](/pt/reference/naming.md)
