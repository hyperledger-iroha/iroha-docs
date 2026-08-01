---
translation_locale: pt
translation_source: /blockchain/queries.md
translation_source_hash: 234c831c97bb93996e6cf51505921ff509e233408cf2faf6a9b23641e5642040
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# Questões {#queries}

Os assinantes de eventos e os filtros podem acompanhar as mudanças no estado da blockchain. Use uma consulta quando precisar de uma visão direta do estado atual.

As consultas são pequenos objetos semelhantes a instruções. Envie um para um Iroha colega para receber detalhes da sua visão atual do estado do mundo.

Uma rede pode expor outras informações. Informações queráveis sobre estados mundiais são o único tipo garantido de estar disponível em todas as redes Iroha.

Para cada implantação de Iroha, podem existir outras informações disponíveis, por exemplo, a disponibilidade dos dados telemétricos depende dos administradores da rede. É inteiramente a decisão deles se querem ou não alocar poder de processamento para rastrear o trabalho em vez de usá-lo para fazer o trabalho real.

Os resultados das consultas podem ser classificados [](#sorting), [paginated](#pagination) e [filtered](#filters) peer-side ao mesmo tempo. A filtragem pode ser feita com base em uma variedade de princípios, desde domínios específicos (máscaras individuais de filtro de endereço IP até métodos de substring como `begins_with` combinados usando operações lógicas.

## Tente em Taira {#try-it-on-taira}

Taira expõe os auxiliares de consulta somente leitura sobre JSON para recursos comuns. Utilize-os para praticar a paginação e o tratamento das respostas antes de ligar um SDK:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

Para o diagnóstico de aplicativos, mantenha esses controles de fumaça separados dos testes de transação assinados. Uma falha da consulta apenas para leitura geralmente aponta para a disponibilidade do endpoint, acessibilidade à rede ou compatibilidade de rota antes de apontar para a configuração do signatário.

## Criar uma consulta {#create-a-query}

Usar construtores de consultas digitadas a partir do SDK ou CLI. Por exemplo, o modelo de dados atual expõe `FindAccounts` para contas listadas:

```rust
let query = FindAccounts;
```

Aqui está um exemplo de uma consulta que encontra os bens de Alice:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## Paginação {#pagination}

Para consultas singulares e pequenas consultas iteráveis, você pode usar `client.request` para enviar uma consulta e obter o resultado em um só momento.

No entanto, consultas iteráveis amplas como `FindAccounts`, `FindAssets` ou `FindBlocks` podem retornar grandes conjuntos de resultados. Use pagination para reduzir a carga no peer e cliente.

Para construir um `Pagination`, é necessário ligar para `client.request_with_pagination(query, pagination)`, onde o `pagination` é construído do seguinte modo:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Filtros {#filters}

Ao criar uma consulta, você pode usar um filtro para retornar apenas os resultados que correspondem ao filtro especificado.

Os filtros são específicos da consulta. Por exemplo, as consultas de contas podem ser reduzidas por identidade de conta ou metadados, enquanto que as consultas dos ativos podem ser reduzidos por ativo definição, conta do titular ou projeção de domínio. Use os construtores de consultas digitais do SDK quando possível para que o tipo de filtro coincida com o tipo de saída da consulta.

## Classificação {#sorting}

Iroha pode classificar os itens com [Metadados](/pt/blockchain/metadata.md) Lexicográficamente, se fornecer uma chave para classificar durante a construção da consulta. Um caso típico de utilização é que as contas tenham um `registered-on` Entrada de metadados, que, quando ordenada, permite ver o histórico de registro da conta.

A classificação só se aplica a entidades que possuem metadados [](/pt/blockchain/metadata.md), já que a chave de metadados é utilizada para classificar os resultados da consulta.

Você pode combinar classificação com paginação e filtros. Observe que a classificação é uma característica opcional, a maioria das consultas com pagination não precisará dele.

## Referência {#reference}

Verifique a lista de consultas existentes [ ](/pt/reference/queries.md) para obter informações detalhadas sobre elas.
