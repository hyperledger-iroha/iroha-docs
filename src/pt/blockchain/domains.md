---
translation_locale: pt
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Domínios {#domains}

Domínios são espaços de nomes registrados no `World`. No modelo de dados atual do Iroha 3, um domínio é qualificado pelo espaço de dados ao qual pertence, portanto o identificador canônico é:

```text
domain.dataspace
```

Por exemplo, `payments.universal` nomeia o domínio `payments` dentro do espaço de dados `universal`.

## Estrutura {#structure}

Um `Domain` registrado contém:

- `id`: o `DomainId` qualificado pelo espaço de dados
- `logo`: um `SoraFS` URI opcional para um logotipo de domínio
- `metadata`: metadados de chave-valor arbitrários
- `owned_by`: a conta que possui o domínio, normalmente a conta que o registrou

O payload de inicialização usado para materializar um domínio é `NewDomain`. Ele carrega o `id`, o `logo` opcional e o `metadata` inicial. O tempo de execução do software preenche `owned_by` a partir do principal de autorização. Clientes comuns não enviam este payload diretamente.

## Registro {#registration}

A criação de domínio comum utiliza o fluxo declarativo de configuração de alias. Isso mantém o arrendamento SNS, as capacidades do proprietário, o proteção da cotação e a linha do domínio em uma única transação atômica `EnsureAlias`. `Register::Domain` permanece uma superfície de gênese/bootstrap, e o comando `ledger domain` não possui subcomando `register`.

Crie uma intenção `AliasSetupPlanRequestV1` sem segredo com um serviço SDK ou de integração, depois faça com que o CLI a planeje contra o estado ativo e envie exatamente esse plano:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

A intenção identifica `payments.universal`, seu espaço de dados numérico, seu proprietário em formato I105 canônico, o prazo de aquisição da concessão e a condição de proteção da cotação atual de política/pagamento. O endpoint do planejador é `POST /v1/aliases/setup/plan`; o plano retornado está vinculado à cadeia, à autoridade, ao estado e ao prazo. A remoção de domínio ainda usa [`Unregister`](/pt/blockchain/instructions.md#un-register).

Criar ou remover um domínio requer a gestão de domínio apropriada permissão sob o validador de tempo de execução de software ativo. Os metadados do domínio podem ser atualizados com [`SetKeyValue` e `RemoveKeyValue`](/pt/blockchain/instructions.md#setkeyvalue-removekeyvalue) quando o titular da autorização tem permissão para modificar esse domínio.

## Experimente em Taira {#try-it-on-taira}

Liste os domínios atualmente visíveis na testnet pública Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Relacione o catálogo público de faixas de execução aos aliases dos espaços de dados:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Use o primeiro comando quando um aplicativo precisar verificar se um domínio existe. Use o catálogo de faixas de execução para inspecionar as faixas de execução associadas a um espaço de dados, incluindo a visibilidade pública ou restrita de cada faixa de execução e seu status de sincronização em relação à faixa de execução principal.

A configuração de domínio é uma operação de escrita que exige pagamento de taxa. Antes de testá-la em Taira, financie a conta signatária por meio do fluxo preparado do faucet em [Obter XOR de testnet em Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) e aplique o plano com um pagador de taxas explícito. A CLI informa a cotação exata da taxa antes da assinatura:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Construa a intenção para um nome de domínio único em execuções repetidas na testnet, e use a política atual e o protetor de cotação do ativo de taxa de Taira. Não reutilize um plano produzido para a localnet ou Minamoto.

## Relação com outras entidades {#relationship-to-other-entities}

Os domínios agrupam objetos do livro-razão da blockchain e fornecem um namespace para dados com escopo de domínio. As definições de ativos usam identificadores qualificados por domínio, e consultas podem listar domínios ou encontrar objetos com escopo em um domínio. As contas em si não têm domínio no modelo de dados atual, mas as contas podem possuir domínios e manter ativos cujas definições estão sob domínios.

Veja também:

- [Mundo](/pt/blockchain/world.md)
- [Ativos](/pt/blockchain/assets.md)
- [Metadados](/pt/blockchain/metadata.md)
- [Regras de nomenclatura](/pt/reference/naming.md)
