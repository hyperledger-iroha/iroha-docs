---
translation_locale: pt
translation_source: /blockchain/queries.md
translation_source_hash: 234c831c97bb93996e6cf51505921ff509e233408cf2faf6a9b23641e5642040
translation_status: machine-validated
translation_engine: bing-translator-llm
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# Consultas {#queries}

Assinantes de eventos e filtros podem acompanhar mudanças no estado da blockchain. Use uma consulta quando precisar de uma visão direta do estado atual.

Consultas são pequenos objetos semelhantes a instruções. Envie uma a um par da rede Iroha para receber detalhes de sua visão atual do estado do mundo.

Uma rede pode expor outras informações. Informações do estado mundial consultáveis são o único tipo garantido de estar disponível em toda rede Iroha.

Para cada implantação de Iroha, pode haver outras informações disponíveis. Por exemplo, a disponibilidade de dados de telemetria depende dos administradores da rede. É inteiramente decisão deles se querem ou não alocar poder de processamento para acompanhar o trabalho em vez de usá-lo para realizar o trabalho real. Em contraste, algumas funções são sempre necessárias, por exemplo, ter acesso ao saldo da sua conta.

Os resultados das consultas podem ser [ordenado](#sorting), [paginado](#pagination) e [filtrado](#filters) do lado do par, tudo de uma vez. A ordenação é feita lexicograficamente nas chaves de metadados. A filtragem pode ser feita com base em uma variedade de princípios, desde específicos do domínio (máscaras de filtro de endereço individual IP) até métodos de subcadeia como `begins_with` combinados usando operações lógicas.

## Experimente em Taira {#try-it-on-taira}

Taira expõe auxiliares de consulta somente leitura sobre JSON para recursos comuns. Use-os para praticar paginação e manipulação de respostas antes de conectar um SDK:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

Para diagnósticos de aplicativos, mantenha essas verificações básicas separadas dos testes de transações assinadas. Uma falha em uma consulta somente leitura geralmente indica disponibilidade do endpoint API, alcance da rede ou compatibilidade de rota antes de indicar configuração do signatário criptográfico.

## Criar uma consulta {#create-a-query}

Use construtores de consultas tipadas de SDK ou CLI. Por exemplo, o modelo de dados atual expõe `FindAccounts` para listar contas:

```rust
let query = FindAccounts;
```

Aqui está um exemplo de uma consulta que encontra os ativos de Alice:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## Paginação {#pagination}

Para consultas singulares e consultas iteráveis pequenas, você pode usar `client.request` para enviar uma consulta e obter o resultado de uma vez.

No entanto, consultas iteráveis amplas, como `FindAccounts`, `FindAssets` ou `FindBlocks`, podem retornar conjuntos de resultados grandes. Use paginação para reduzir a carga no par de rede e no cliente.

Para construir um `Pagination`, você precisa chamar `client.request_with_pagination(query, pagination)`, onde o `pagination` é construído da seguinte forma:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Filtros {#filters}

Quando você cria uma consulta, pode usar um filtro para retornar apenas os resultados que correspondem ao filtro especificado.

Os filtros são específicos para cada consulta. Por exemplo, consultas de conta podem ser restritas por identidade da conta ou metadados, enquanto consultas de ativos podem ser restritas por ativo definição, conta do titular ou projeção de domínio. Use os construtores de consulta tipados do SDK sempre que possível para que o tipo de filtro corresponda ao tipo de saída da consulta.

## Classificação {#sorting}

Iroha pode classificar itens com [metadados](/pt/blockchain/metadata.md) lexicograficamente se você fornecer uma chave para classificar durante a construção da consulta. Um caso de uso típico é que contas tenham uma entrada de metadados `registered-on`, que, quando classificada, permite visualizar o histórico de registro da conta.

A ordenação se aplica apenas às entidades que têm [metadados](/pt/blockchain/metadata.md), já que a chave de metadados é usada para ordenar os resultados da consulta.

Você pode combinar ordenação com paginação e filtros. Note que a ordenação é um recurso opcional, a maioria das consultas com paginação não irá precisar dela.

## Referência {#reference}

Verifique o [lista de consultas existentes](/pt/reference/queries.md) para obter informações detalhadas sobre eles.
