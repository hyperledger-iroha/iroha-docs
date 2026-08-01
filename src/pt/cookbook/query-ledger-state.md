---
translation_locale: pt
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: a81f6cc04befb0b92a0a01c2cb3c1ecbbc631ce1f2a923cb046241c295db7806
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Query Ledger Estado {#query-ledger-state}

## Resultados {#outcome}

Leia e projetar recursos Taira JSON, em seguida, use consultas Iroha digitadas com filtros, paginação lógica, classificação, tamanhos de trazer e continuação do cursor apenas para a frente. Você também evitará depender da projeção do selector antes que o servidor avalie o tuple `--select` encaminhado.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Node.js 24 e a corrente `iroha` CLI.
- Acesso somente de leitura Taira.
- Para os exemplos assinados de consultas digitadas, uma configuração do cliente para Taira ou uma rede local gerada.
- Para o exemplo Rust, um projeto ligado à mesma revisão de fonte Iroha que a rede-alvo.

## Passos {#steps}

### 1. Página através de um recurso público Taira {#_1-page-through-a-public-taira-resource}

As rotas de recursos são úteis para painéis e verificações de fumaça. Peça JSON, vincula cada página, e projetar apenas os campos que o aplicativo precisa após verificar a resposta.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id:asc' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'offset=0' \
  --data-urlencode 'count_mode=exact' \
  | jq '{total, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const limit = 5
const seen = new Set()

for (let offset = 0; ; offset += limit) {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id:asc',
    limit: String(limit),
    offset: String(offset),
    count_mode: 'exact',
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
  if (page.items.length < limit || seen.size >= page.total) break
}
```

:::

Esta superfície HTTP utiliza o `limit` e o `offset`. Tratar um `total` omitido ou limitado como normal quando a rota usa um modo de contagem mais barato.

### Filtrar e lotar uma consulta CLI digitada {#_2-filter-and-batch-a-typed-cli-query}

O CLI serializa uma consulta iterável digitada e segue os cursores de continuação do servidor internamente. Aqui, o resultado lógico é limitado a uma linha, enquanto `--fetch-size 1` controla o lote máximo obtido por viagem de ida e volta.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Filtragem ocorre antes da paginação. Use prédicatos tipados específicos de consulta; um prédicado para uma conta ou ativo não pode ser reutilizado com segurança para um domínio.

### 3. Classificar por uma chave de metadados estável {#_3-sort-by-a-stable-metadata-key}

A classificação de consulta tipográfica é lexicográfica sobre uma chave de metadados. Itens sem essa chave seguem a ordem definida do tempo de execução, então use uma chave povoada consistentemente em toda a coleção.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger account list all \
  --verbose \
  --sort-by-metadata-key key \
  --order asc \
  --limit 10 \
  --offset 0 \
  --fetch-size 2 \
  | jq '[.[] | {id, metadata}]'
```

O check-in CLI Parses `--select` JSON e encaminha o selector tuple, mas a consulta atual leve DSL não avalia esse selector no servidor. Não construa um contrato de projeção em torno dele ainda. Use um tipo SDK projeção somente após o tempo de execução alvo suportá-la, ou projetar o lado do cliente do resultado validado com: `jq` ou JavaScript Como acima.

### 4. Deixe o iterador Rust seguir os cursores opacos {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` limita o conjunto de resultados lógicos. `FetchSize` controla cada lote do servidor. O iterador retornado envia transparentemente solicitações de continuação usando o cursor gerado pelo servidor.

```rust
use std::num::NonZeroU64;

use iroha::data_model::{
    prelude::FindAssetsDefinitions,
    query::{
        builder::QueryBuilderExt as _,
        parameters::{FetchSize, Pagination},
    },
};

let definitions = client
    .query(FindAssetsDefinitions::new())
    .with_pagination(Pagination::new(NonZeroU64::new(25), 0))
    .with_fetch_size(FetchSize::new(NonZeroU64::new(5)))
    .execute_all()?;

for definition in definitions {
    println!("{} {}", definition.id(), definition.name());
}
```

Um `ForwardCursor` é vinculado à autoridade, local de processo e somente prospectivo. Nunca o analise, sintetize, compartilhe entre as autoridades ou persista como um token portátil de currículo em todas as instâncias do Torii. Se expirar, reinicie a consulta original com um ponto de verificação deliberado no nível de aplicação.

## Verificar {#verify}

O filtro de domínio exato deve retornar apenas `wonderland.universal`. Verifique o resultado em vez de contar uma saída CLI bem sucedida sozinha:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Para consultas de aplicativos em páginas, verifique também se IDs não se repete entre as páginas, o limite lógico solicitado nunca é excedido e se retoma a tentativa após um cursor expirado a partir de um ponto de controle documentado.

## Resolução de problemas {#troubleshooting}

- Uma consulta singular não aceita filtros iteráveis, classificação, pagination ou parâmetros de tração. Use a consulta da lista correspondente quando esses controles são necessários.
- `fetch_size` é uma indicação de lote não zero, e não o limite total do resultado. O padrão atual é `100`, e o runtime rejeita valores acima de seu máximo.
- Um cursor desconhecido, expirado ou estranho não é intencionalmente reutilizável. Reinicie a consulta; não tente reparar o valor opaco.
- A classificação de metadados não é uma classificação geral do campo. Se cada item não tiver a chave selecionada, documentar a ordem da chave faltante ou escolher outra estratégia.
- O CLI paralisa e encaminha `--select`, mas o servidor atual não avalia o tuple selector leve. Aplique a projeção do lado cliente, a menos que o suporte ao selector do lado do servidor seja verificado para o tempo de execução implementado.
- As consultas amplas e ilimitadas aumentam o trabalho entre pares, a memória do cliente e o risco de vida útil do cursor.
- Os parâmetros de recursos públicos JSON e os parâmetres assinados da consulta digitalizada são relacionados, mas não são formatos intercâmbios. Prefere-se o SDK ou CLI para envelopes de consulta digitalizadas.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Testes de integração de pagination com back-up do cursor no commit fixado ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/pagination.rs)
- [Comportamento do criador de consultas e selector no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Parâmetros de consulta e modelo do cursor no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/query/parameters.rs)
- [Questões](/pt/blockchain/queries.md)
- [Referência à consulta](/pt/reference/queries.md)
- [JavaScript e TypeScript](/pt/guide/tutorials/javascript.md)
