---
translation_locale: es
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Consultar el estado del libro mayor de blockchain {#query-ledger-state}

## Resultado {#outcome}

Lea y proyecte los recursos Taira JSON, luego use consultas tipeadas Iroha con filtros, paginación lógica, ordenamiento, tamaños de recuperación y continuación de cursor solo hacia adelante. También evitará depender de la proyección del selector antes de que el servidor evalúe la tupla `--select` reenviada.

## Requisitos previos {#prerequisites}

- `curl`, `jq`, Node.js 24, y el actual `iroha` CLI.
- Acceso de solo lectura Taira.
- Para ejemplos de consultas tipadas firmadas, una configuración de cliente para Taira o una red local generada.
- Para el ejemplo Rust, un proyecto fijado a la misma revisión de origen Iroha que la red objetivo.

## Pasos {#steps}

### 1. Hoja a través de un recurso público Taira {#_1-page-through-a-public-taira-resource}

Las rutas de recursos son útiles para paneles y verificaciones rápidas. Solicita JSON, enlaza cada página y proyecta solo los campos que la aplicación necesita después de revisar la respuesta.

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

Esta superficie HTTP utiliza `limit` y `offset`. Trate un `total` omitido o limitado como normal cuando la ruta utiliza un modo de conteo más barato.

### 2. Filtrar y agrupar una consulta tipeada CLI {#_2-filter-and-batch-a-typed-cli-query}

El CLI serializa una consulta iterable tipada y sigue internamente los cursores de continuación del servidor. Aquí, el resultado lógico se limita a una fila, mientras que `--fetch-size 1` controla el lote máximo obtenido por viaje de ida y vuelta.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

El filtrado ocurre antes de la paginación. Use predicados tipados específicos de la consulta; un predicado para una cuenta o activo no puede reutilizarse de manera segura para un dominio.

### 3. Ordenar por una clave de metadatos estable {#_3-sort-by-a-stable-metadata-key}

La ordenación de consultas escritas es lexicográfica sobre una clave de metadatos. Los elementos sin esa clave siguen el orden definido por el tiempo de ejecución del software, por lo que se debe usar una clave que esté poblada de manera consistente en toda la colección.

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

El CLI registrado analiza `--select` JSON y reenvía la tupla del selector, pero la consulta ligera actual DSL no evalúa ese selector en el servidor. No construyas aún un contrato de proyección alrededor de él. Utilice una proyección tipada SDK solo después de que el tiempo de ejecución del software de destino la admita, o proyecte el resultado validado del lado del cliente con `jq` o JavaScript como se indicó anteriormente.

### 4. Dejar que el iterador Rust siga cursores opacos {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` delimita el conjunto de resultados lógicos. `FetchSize` controla cada lote de servidores. El iterador devuelto envía de manera transparente solicitudes de continuación usando el cursor generado por el servidor.

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

Un `ForwardCursor` está ligado a la autoridad, es local del proceso y solo hacia adelante. Nunca lo analices, sintetices, compartas entre principales de autorización, ni lo guardes como un token de resumen portátil entre instancias de Torii. Si caduca, reinicia la consulta original con un punto de control deliberado a nivel de aplicación.

## Verificar {#verify}

El filtro de dominio exacto debería devolver solo `wonderland.universal`. Verifique el resultado en lugar de contar únicamente una salida exitosa CLI:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Para las consultas de aplicaciones con paginación, también pruebe que los IDs no se repitan entre páginas, que nunca se exceda el límite lógico solicitado y que al reintentar después de que un cursor haya expirado se reinicie desde un punto de control documentado.

## Solución de problemas {#troubleshooting}

- Una consulta singular no acepta parámetros de filtro, orden, paginación o recuperación iterables. Use la consulta de lista correspondiente cuando se necesiten esos controles.
- `fetch_size` es una sugerencia de lote diferente de cero, no el límite total de resultados. El valor predeterminado actual es `100`, y el tiempo de ejecución del software rechaza valores superiores a su máximo.
- Un cursor desconocido, caducado o extranjero no es reutilizable intencionalmente. Reinicie la consulta; no intente reparar el valor opaco.
- La clasificación por metadatos no es una clasificación general de campos. Si cada elemento no contiene la clave seleccionada, documente el orden de las claves faltantes o elija otra estrategia.
- El CLI analiza y reenvía `--select`, pero el servidor actual no evalúa la tupla de selector ligera. Applique la proyección del lado del cliente a menos que se verifique el soporte del selector del lado del servidor para el entorno de ejecución de software desplegado.
- Las consultas amplias y sin límites aumentan el trabajo de los pares de la red, la memoria del cliente y el riesgo de duración del cursor. Establezca un límite lógico y un tamaño de recuperación apropiado para el consumidor.
- Los parámetros de recursos públicos JSON y los parámetros de consulta tipada firmados están relacionados pero no son formatos de serialización intercambiables. Prefiera SDK o CLI para contenedores de datos de consulta tipada.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración de paginación con cursor en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Comportamiento del generador de consultas y del selector en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Parámetros de consulta y modelo de cursor en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [Consultas](/es/blockchain/queries.md)
- [Referencia de consulta](/es/reference/queries.md)
- [JavaScript y TypeScript](/es/guide/tutorials/javascript.md)
