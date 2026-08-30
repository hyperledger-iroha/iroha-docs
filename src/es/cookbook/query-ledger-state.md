---
translation_locale: es
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: ca76923f5ae35b96c52a6a4c23c5d9e69549d1ca91d6d1507e7b9a1aee1f1676
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Encuesta del estado de los registros {#query-ledger-state}

## El resultado {#outcome}

Leer y proyectar los recursos Taira JSON, luego utilizar las consultas tipografadas Iroha con filtros, paginación lógica, clasificación, tamaños de búsqueda y continuación del cursor solo hacia adelante. También evitará confiar en la proyección del selector antes que el servidor evalúe el tuple `--select` reenviado.

## Los requisitos previos {#prerequisites}

- `curl`, `jq`, Node.js 24 y la corriente `iroha` CLI.
- Acceso de sólo lectura Taira.
- En el caso de los ejemplos de consultas firmadas, una configuración del cliente para Taira o una red local creada.
- Para el ejemplo Rust, un proyecto fijado a la misma revisión de fuente Iroha que la red objetivo.

## Los pasos {#steps}

### Una página a través de un recurso público Taira {#_1-page-through-a-public-taira-resource}

Las rutas de recursos son útiles para los paneles de control y controles de humo. Pida JSON, enlace cada página, y proyecta solo los campos que la aplicación necesita después de verificar la respuesta.

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

Esta superficie HTTP utiliza `limit` y `offset`. Tratar como normal un `total` omitido o limitado cuando la ruta usa un modo de conteo más barato.

### Filtrar y lotar una consulta CLI typada {#_2-filter-and-batch-a-typed-cli-query}

El CLI serializa una consulta iterable mecanografiada y sigue los cursores de continuación del servidor internamente. Aquí el resultado lógico se limita a una fila, mientras que `--fetch-size 1` controla el lote máximo obtenido por ida y vuelta.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

El filtro ocurre antes de la paginado. Utilice predicados tipados específicos para una consulta; un predicado para una cuenta o activo no puede ser reutilizado de forma segura para un dominio.

### 3. clasificar por una clave de metadatos estable {#_3-sort-by-a-stable-metadata-key}

La clasificación de la consulta tipográfica es lexicográfica sobre una clave de metadatos. Los elementos sin esa clave siguen el orden definido del tiempo de ejecución, por lo que use una clave poblada consistentemente en toda la colección.

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

El CLI registrado analiza `--select` JSON y reenvía el tuple del selector, pero la consulta ligera actual DSL no evalúa ese selector en el servidor. Utilice una proyección SDK mecanografiada solo después de que el tiempo de ejecución objetivo la respalde, o proyecte el lado del cliente del resultado validado con `jq` o JavaScript como se indica anteriormente.

### Deja que el iterador Rust siga los cursores opacos. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` limita el conjunto de resultados lógicos. `FetchSize` controla cada lote del servidor. El iterador devuelto envía transparentemente solicitudes de continuación utilizando el cursor generado por el servidor.

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

Un `ForwardCursor` está vinculado a la autoridad, es local en el proceso y solo se utiliza para avanzar. Nunca lo analice, lo sintetice, lo comparta entre las autoridades o lo persista como un token portátil de currículum en todas las instancias de Torii. Si expira, reinicie la consulta original con un punto de control deliberado a nivel de aplicación.

## Verificar {#verify}

El filtro exacto del dominio debe devolver sólo `wonderland.universal`. Verifique el resultado en lugar de contar una salida exitosa CLI solo:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Para las consultas de aplicaciones en páginas, también compruebe que IDs no se repite a través de páginas, nunca se excede el límite lógico solicitado y se vuelve a intentar después de un cursor expirado reiniciar desde un punto de control documentado.

## Solución de problemas {#troubleshooting}

- Una consulta singular no acepta filtros iterables, clasificación, paginado o parámetros de búsqueda. Utilice la consulta de lista correspondiente cuando sean necesarios esos controles.
- `fetch_size` es un indicio de lote no cero, no el límite total del resultado. El valor predeterminado actual es `100`, y el tiempo de ejecución rechaza valores por encima de su máximo.
- Un cursor desconocido, expirado o extraño no es intencionalmente reutilizable. Reinicie la consulta; no intente reparar el valor opaco.
- La clasificación de metadatos no es la clasificación general de campos. Si cada elemento no lleva la clave seleccionada, documente el orden de llaves faltantes o elija otra estrategia.
- El CLI analiza y reenvía `--select`, pero el servidor actual no evalúa el tuple selector ligero. Aplique proyección del lado cliente a menos que se verifique el soporte del selector del lado del servidor para el tiempo de ejecución implementado.
- Las consultas amplias y ilimitadas aumentan el trabajo de los pares, la memoria del cliente y el riesgo de vida útil del cursor.
- Los parámetros de recursos públicos JSON y los parámetres firmados para la consulta tipada se relacionan, pero no son formatos intercambiables. Prefiere el SDK o CLI para envelopes de consulta tipadas.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración de paginado respaldadas por el cursor en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [El comportamiento del creador de consultas y el selector en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Parámetros de consulta y modelo del cursor en el comit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [Las consultas ](/es/blockchain/queries.md)
- [Referencia de la consulta ](/es/reference/queries.md)
- [JavaScript y TypeScript ](/es/guide/tutorials/javascript.md)
