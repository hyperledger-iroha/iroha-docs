---
translation_locale: es
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Consultar el estado del libro mayor de blockchain {#query-ledger-state}

## Resultado {#outcome}

Lea y proyecte los recursos Taira JSON, luego use consultas de colección de Torii desde el CLI y el SDK de Rust con filtros, ordenamiento, proyección del lado del servidor, límites de página y continuación opaca con `next_cursor`. También mantendrá los listados fuera de las consultas tipadas firmadas, que no los filtran, ordenan ni proyectan.

## Requisitos previos {#prerequisites}

- `curl`, `jq`, Node.js 24, y el actual `iroha` CLI.
- Acceso de solo lectura Taira.
- Para los ejemplos del CLI, una configuración de cliente para Taira o una red local generada.
- Para el ejemplo Rust, un proyecto fijado a la misma revisión de origen Iroha que la red objetivo.

## Pasos {#steps}

### 1. Hoja a través de un recurso público Taira {#_1-page-through-a-public-taira-resource}

Las rutas de recursos son útiles para paneles y verificaciones rápidas. Solicita JSON, enlaza cada página y proyecta solo los campos que la aplicación necesita después de revisar la respuesta.

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

Esta superficie HTTP pagina con `limit` y un `next_cursor` opaco; devuélvalo sin cambios como `cursor` hasta que sea `null`. `total` solo aparece cuando solicita `include_total=true`, lo que cuesta un recorrido completo.

### 2. Filtrar una colección con el CLI {#_2-filter-a-collection-with-the-cli}

El CLI envía el filtro, la proyección y el tamaño de página al endpoint de la colección e imprime una página, `{items, next_cursor}`. Añada `--all` para seguir `next_cursor` hasta que sea `null`.

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

El filtrado ocurre antes de la paginación. Cada colección acepta solo sus propios campos; un campo desconocido devuelve `invalid_filter` en lugar de no coincidir con nada.

### 3. Ordenar por una clave de metadatos estable {#_3-sort-by-a-stable-metadata-key}

Las claves de ordenación de colección aceptan campos declarados y `metadata.<key>`; anteponga `-` a una clave para el orden descendente. Las filas sin la clave se ordenan primero en orden ascendente y los empates siguen la identidad de la fila, por lo que se debe usar una clave que esté poblada de manera consistente en toda la colección.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` es una proyección del lado del servidor: `--select id,metadata` devuelve solo esos campos, y un campo desconocido devuelve `invalid_select`. Las consultas tipadas firmadas siempre devuelven elementos completos, así que proyecte sus resultados del lado del cliente con `jq` o JavaScript como se indicó anteriormente.

### 4. Dejar que el iterador Rust siga cursores opacos {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` establece el tamaño de página. El iterador devuelto por `list` solicita la página siguiente con el `next_cursor` del servidor solo después de consumir la página actual, y `take` delimita el resultado lógico. Aquí `client` es un `iroha::blocking::Client`.

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

Un `next_cursor` es una posición opaca de conjunto de claves vinculada a su colección, ruta, filtro y ordenación. Nunca lo analice ni lo sintetice, y no lo reutilice con un filtro u ordenación diferentes; Torii lo rechaza con `invalid_cursor`. Las filas insertadas o eliminadas entre páginas nunca hacen que una página posterior repita u omita filas no relacionadas.

## Verificar {#verify}

El filtro de dominio exacto debería devolver solo `universal.universal`. Verifique el resultado en lugar de contar únicamente una salida exitosa CLI:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

Para las consultas de aplicaciones con paginación, también pruebe que los IDs no se repitan entre páginas, que nunca se exceda el límite lógico solicitado y que un cursor rechazado reinicie desde un punto de control documentado.

## Solución de problemas {#troubleshooting}

- Una consulta singular no acepta parámetros de filtro, orden, paginación o recuperación iterables. Use la consulta de lista correspondiente cuando se necesiten esos controles.
- `limit` es el tamaño de página, no el resultado total: como mínimo 1 y como máximo el `torii.app_api_max_list_limit` del nodo (500 por defecto); el valor predeterminado de Torii es 100. Siga `next_cursor`, `--all` o el iterador del SDK para leer más.
- `invalid_cursor` significa que el cursor está mal formado o pertenece a otra colección, ruta, filtro u ordenación. Reinicie la consulta; no intente reparar el valor opaco.
- Un filtro selectivo puede devolver una página corta o vacía con un `next_cursor` no nulo. Siga recorriéndolo hasta que sea `null`.
- `--filter` y el parámetro HTTP `filter` usan la gramática de texto de Torii, como `id = "universal.universal"` o `exists(metadata.tier)`. Un objeto de predicado JSON no es texto de filtro y falla como un `filter` no válido.
- Las consultas amplias y sin límites aumentan el trabajo de los pares de la red y la memoria del cliente. Establezca un límite lógico y un tamaño de página apropiados para el consumidor.
- El `/v1/query` firmado no es la API de listados. Admite consultas singulares y unos pocos inicios iterables sin filtrar, y rechaza otras, como `FindDomains` o `FindAssetDefinitions`, con `signed_query_shape_not_admitted`. Los endpoints de colección, los comandos `list` del CLI y los lectores de colecciones del SDK comparten una misma gramática de filtro, ordenación y cursor.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Contrato de consultas de colección de Torii en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [Lecturas de colecciones y el iterador de cursor de Rust en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [Admisión de consultas firmadas en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [Consultas](/es/blockchain/queries.md)
- [Referencia de consulta](/es/reference/queries.md)
- [JavaScript y TypeScript](/es/guide/tutorials/javascript.md)
