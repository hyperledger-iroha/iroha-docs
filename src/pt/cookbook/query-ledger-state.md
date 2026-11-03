---
translation_locale: pt
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Consultar o estado do livro-razão da blockchain {#query-ledger-state}

## Resultado {#outcome}

Leia e projete os recursos Taira JSON, depois use consultas de coleção do Torii a partir do CLI e do SDK Rust com filtros, ordenação, projeção no lado do servidor, limites de página e continuação opaca com `next_cursor`. Você também manterá as listagens fora das consultas tipadas assinadas, que não as filtram, ordenam nem projetam.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Node.js 24, e o atual `iroha` CLI.
- Acesso somente leitura Taira.
- Para os exemplos do CLI, uma configuração de cliente para Taira ou uma rede local gerada.
- Para o exemplo Rust, um projeto fixado na mesma revisão de origem Iroha que a rede de destino.

## Passos {#steps}

### 1. Folhear um recurso público Taira {#_1-page-through-a-public-taira-resource}

Rotas de recursos são úteis para dashboards e verificações básicas. Solicite JSON, vincule a cada página e projete apenas os campos que a aplicação precisa após verificar a resposta.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'include_total=true' \
  | jq '{total, next_cursor, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const seen = new Set()
let cursor = null

do {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id',
    limit: '5',
    ...(cursor ? { cursor } : {}),
  })

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok)
    throw new Error(`Taira returned HTTP ${response.status}`)

  const page = await response.json()
  for (const domain of page.items) {
    if (seen.has(domain.id)) throw new Error(`duplicate ${domain.id}`)
    seen.add(domain.id)
    console.log(domain.id)
  }
  cursor = page.next_cursor
} while (cursor)
```

:::

Esta superfície HTTP pagina com `limit` e um `next_cursor` opaco; envie-o de volta sem alterações como `cursor` até que seja `null`. `total` só aparece quando você solicita `include_total=true`, o que custa uma varredura completa.

### 2. Filtrar uma coleção com o CLI {#_2-filter-a-collection-with-the-cli}

O CLI envia o filtro, a projeção e o tamanho da página para o endpoint da coleção e imprime uma página, `{items, next_cursor}`. Adicione `--all` para seguir `next_cursor` até que seja `null`.

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

A filtragem acontece antes da paginação. Cada coleção aceita apenas seus próprios campos; um campo desconhecido retorna `invalid_filter` em vez de não corresponder a nada.

### 3. Classificar por uma chave de metadados estável {#_3-sort-by-a-stable-metadata-key}

As chaves de ordenação de coleção aceitam campos declarados e `metadata.<key>`; prefixe uma chave com `-` para ordem decrescente. Linhas sem a chave vêm primeiro na ordem crescente e os empates seguem a identidade da linha, portanto use uma chave populada de forma consistente em toda a coleção.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` é uma projeção no lado do servidor: `--select id,metadata` retorna apenas esses campos, e um campo desconhecido retorna `invalid_select`. Consultas tipadas assinadas sempre retornam itens inteiros, portanto projete seus resultados no lado do cliente com `jq` ou JavaScript como acima.

### 4. Permitir que o iterador Rust siga cursores opacos {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` define o tamanho da página. O iterador retornado por `list` solicita a próxima página com o `next_cursor` do servidor somente depois que a página atual é consumida, e `take` delimita o resultado lógico. Aqui `client` é um `iroha::blocking::Client`.

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

Um `next_cursor` é uma posição opaca de conjunto de chaves vinculada à sua coleção, caminho, filtro e ordenação. Nunca o analise nem o sintetize, e não o reutilize com um filtro ou ordenação diferentes; o Torii rejeita isso com `invalid_cursor`. Linhas inseridas ou removidas entre páginas nunca fazem uma página posterior repetir ou pular linhas não relacionadas.

## Verificar {#verify}

O filtro de domínio exato deve retornar apenas `universal.universal`. Verifique o resultado em vez de contar apenas uma saída bem-sucedida CLI:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

Para consultas de aplicativo paginadas, também teste se os IDs não se repetem entre as páginas, se o limite lógico solicitado nunca é excedido e se um cursor rejeitado reinicia a partir de um ponto de verificação documentado.

## Solução de problemas {#troubleshooting}

- Uma consulta singular não aceita parâmetros iteráveis de filtro, ordenação, paginação ou busca. Use a consulta de lista correspondente quando esses controles forem necessários.
- `limit` é o tamanho da página, não o resultado total: no mínimo 1 e no máximo o `torii.app_api_max_list_limit` do nó (padrão 500); o padrão do Torii é 100. Siga `next_cursor`, `--all` ou o iterador do SDK para ler mais.
- `invalid_cursor` significa que o cursor está malformado ou pertence a outra coleção, caminho, filtro ou ordenação. Reinicie a consulta; não tente reparar o valor opaco.
- Um filtro seletivo pode retornar uma página curta ou vazia com um `next_cursor` não nulo. Continue seguindo-o até que seja `null`.
- `--filter` e o parâmetro HTTP `filter` usam a gramática de texto do Torii, como `id = "universal.universal"` ou `exists(metadata.tier)`. Um objeto de predicado JSON não é texto de filtro e falha como um `filter` inválido.
- Consultas amplas e ilimitadas aumentam o trabalho dos pares na rede e a memória do cliente. Defina um limite lógico e um tamanho de página apropriados para o consumidor.
- O `/v1/query` assinado não é a API de listagem. Ele admite consultas singulares e alguns inícios iteráveis sem filtro, e recusa outras, como `FindDomains` ou `FindAssetDefinitions`, com `signed_query_shape_not_admitted`. Endpoints de coleção, comandos `list` do CLI e leitores de coleção do SDK compartilham uma única gramática de filtro, ordenação e cursor.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Contrato de consultas de coleção do Torii no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [Leituras de coleção e iterador de cursor do Rust no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [Admissão de consultas assinadas no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [Consultas](/pt/blockchain/queries.md)
- [Referência de consulta](/pt/reference/queries.md)
- [JavaScript e TypeScript](/pt/guide/tutorials/javascript.md)
