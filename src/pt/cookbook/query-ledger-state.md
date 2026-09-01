---
translation_locale: pt
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Consultar o estado do livro-razão da blockchain {#query-ledger-state}

## Resultado {#outcome}

Leia e projete os recursos Taira JSON, depois use consultas digitadas Iroha com filtros, paginação lógica, ordenação, tamanhos de busca e continuação de cursor apenas para frente. Você também evitará depender da projeção de seletor antes que o servidor avalie o tuplo encaminhado `--select`.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Node.js 24, e o atual `iroha` CLI.
- Acesso somente leitura Taira.
- Para exemplos de consultas digitadas assinadas, uma configuração de cliente para Taira ou uma rede local gerada.
- Para o exemplo Rust, um projeto fixado na mesma revisão de origem Iroha que a rede de destino.

## Passos {#steps}

### 1. Folhear um recurso público Taira {#_1-page-through-a-public-taira-resource}

Rotas de recursos são úteis para dashboards e verificações básicas. Solicite JSON, vincule a cada página e projete apenas os campos que a aplicação precisa após verificar a resposta.

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

Esta superfície HTTP usa `limit` e `offset`. Trate um `total` omitido ou limitado como normal quando a rota usa um modo de contagem mais barato.

### 2. Filtrar e agrupar uma consulta digitada CLI {#_2-filter-and-batch-a-typed-cli-query}

O CLI serializa uma consulta iterável tipada e segue internamente os cursores de continuação do servidor. Aqui, o resultado lógico é limitado a uma linha, enquanto `--fetch-size 1` controla o lote máximo buscado por viagem de ida e volta.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

A filtragem acontece antes da paginação. Use predicados tipados específicos da consulta; um predicado para uma conta ou ativo não pode ser reutilizado com segurança para um domínio.

### 3. Classificar por uma chave de metadados estável {#_3-sort-by-a-stable-metadata-key}

A ordenação de consultas digitadas é lexicográfica sobre uma chave de metadados. Itens sem essa chave seguem a ordenação definida pelo tempo de execução do software, portanto use uma chave populada de forma consistente em toda a coleção.

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

O CLI registrado analisa `--select` JSON e encaminha o tupla seletor, mas a consulta leve atual DSL não avalia esse seletor no servidor. Não construa um contrato de projeção em torno dele ainda. Use uma projeção digitada SDK somente depois que o tempo de execução do software alvo a suportar, ou projete o resultado validado no lado do cliente com `jq` ou JavaScript como acima.

### 4. Permitir que o iterador Rust siga cursores opacos {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` delimita o conjunto de resultados lógica. `FetchSize` controla cada lote de servidor. O iterador retornado envia de forma transparente solicitações de continuação usando o cursor gerado pelo servidor.

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

Um `ForwardCursor` é vinculado à autoridade, local ao processo e somente para frente. Nunca o analise, sintetize, compartilhe entre indivíduos de autorização ou persista como um token de currículo portátil entre instâncias Torii. Se expirar, reinicie a consulta original com um ponto de verificação deliberado no nível da aplicação.

## Verificar {#verify}

O filtro de domínio exato deve retornar apenas `wonderland.universal`. Verifique o resultado em vez de contar apenas uma saída bem-sucedida CLI:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Para consultas de aplicativo paginadas, também teste se os IDs não se repetem entre as páginas, o limite lógico solicitado nunca é excedido e a tentativa após um cursor expirado reinicia a partir de um ponto de verificação documentado.

## Solução de problemas {#troubleshooting}

- Uma consulta singular não aceita parâmetros iteráveis de filtro, ordenação, paginação ou busca. Use a consulta de lista correspondente quando esses controles forem necessários.
- `fetch_size` é uma sugestão de lote diferente de zero, não o limite total de resultados. O padrão atual é `100`, e o tempo de execução do software rejeita valores acima do seu máximo.
- Um cursor desconhecido, expirado ou estrangeiro não é intencionalmente reutilizável. Reinicie a consulta; não tente reparar o valor opaco.
- A ordenação por metadados não é uma ordenação geral de campos. Se cada item não contiver a chave selecionada, documente a ordem das chaves ausentes ou escolha outra estratégia.
- A CLI analisa e encaminha `--select`, mas o servidor atual não avalia a tupla leve de seletores. Aplique a projeção no cliente, a menos que o suporte a seletores no servidor tenha sido verificado no ambiente de execução implantado.
- Consultas amplas e ilimitadas aumentam o trabalho dos pares na rede, a memória do cliente e o risco de tempo de vida do cursor. Defina um limite lógico e um tamanho de busca apropriado para o consumidor.
- Parâmetros de recurso público JSON e parâmetros de consulta digitada assinados são formatos de serialização relacionados, mas não intercambiáveis. Prefira SDK ou CLI para contêineres de dados de consulta digitada.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Testes de integração de paginação baseada em cursor no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Comportamento do construtor de consultas e do seletor no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Parâmetros de consulta e modelo de cursor no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [Consultas](/pt/blockchain/queries.md)
- [Referência de consulta](/pt/reference/queries.md)
- [JavaScript e TypeScript](/pt/guide/tutorials/javascript.md)
