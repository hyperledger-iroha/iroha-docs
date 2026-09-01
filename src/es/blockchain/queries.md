---
translation_locale: es
translation_source: /blockchain/queries.md
translation_source_hash: 234c831c97bb93996e6cf51505921ff509e233408cf2faf6a9b23641e5642040
translation_status: machine-validated
translation_engine: bing-translator-llm
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# Consultas {#queries}

Los suscriptores de eventos y los filtros pueden seguir los cambios en el estado de la blockchain. Use una consulta cuando necesite una vista directa del estado actual.

Las consultas son pequeños objetos similares a instrucciones. Envía una a un par de red Iroha para recibir detalles de su vista actual del estado del mundo.

Una red puede exponer otra información. La información del estado mundial consultable es el único tipo que se garantiza que esté disponible en cada red Iroha.

Para cada despliegue de Iroha, podría haber otra información disponible. Por ejemplo, la disponibilidad de datos de telemetría depende de los administradores de la red. Es completamente su decisión si quieren o no asignar potencia de procesamiento para rastrear el trabajo en lugar de usarla para realizar el trabajo real. En contraste, algunas funciones siempre son necesarias, por ejemplo, tener acceso a su saldo de cuenta.

Los resultados de las consultas pueden ser [ordenado](#sorting), [paginado](#pagination) y [filtrado](#filters) del lado del par, todo a la vez. La ordenación se realiza lexicográficamente en las claves de los metadatos. Se puede hacer filtrado sobre una variedad de principios, desde específicos de dominio (máscaras de filtro de dirección individual IP) hasta métodos de subcadenas como `begins_with` combinados usando operaciones lógicas.

## Pruébalo en Taira {#try-it-on-taira}

Taira expone ayudantes de consulta de solo lectura sobre JSON para recursos comunes. Úsalos para practicar la paginación y el manejo de respuestas antes de conectar un SDK:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

Para el diagnóstico de aplicaciones, mantenga estas verificaciones básicas separadas de las pruebas de transacciones firmadas. Un fallo en una consulta de solo lectura generalmente apunta a la disponibilidad del endpoint API, a la accesibilidad de la red o a la compatibilidad de rutas antes de apuntar a la configuración del firmante criptográfico.

## Crear una consulta {#create-a-query}

Utilice generadores de consultas tipadas de SDK o CLI. Por ejemplo, el modelo de datos actual expone `FindAccounts` para listar cuentas:

```rust
let query = FindAccounts;
```

Aquí hay un ejemplo de una consulta que encuentra los activos de Alice:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## Paginación {#pagination}

Para consultas singulares y consultas pequeñas iterables, puedes usar `client.request` para enviar una consulta y obtener el resultado de una sola vez.

Sin embargo, las consultas iterables amplias como `FindAccounts`, `FindAssets` o `FindBlocks` pueden devolver conjuntos de resultados grandes. Utilice la paginación para reducir la carga en el par de la red y en el cliente.

Para construir un `Pagination`, necesitas llamar a `client.request_with_pagination(query, pagination)`, donde el `pagination` se construye de la siguiente manera:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Filtros {#filters}

Cuando creas una consulta, puedes usar un filtro para devolver únicamente los resultados que coincidan con el filtro especificado.

Los filtros son específicos de la consulta. Por ejemplo, las consultas de cuentas se pueden restringir por identidad de la cuenta o metadatos, mientras que las consultas de activos se pueden restringir por activo definición, cuenta del titular o proyección de dominio. Utilice los generadores de consultas tipadas de SDK siempre que sea posible para que el tipo de filtro coincida con el tipo de salida de la consulta.

## Clasificación {#sorting}

Iroha puede ordenar elementos con [metadatos](/es/blockchain/metadata.md) lexicográficamente si proporciona una clave para ordenar durante la construcción de la consulta. Un caso de uso típico es que las cuentas tengan una entrada de metadatos `registered-on`, que, al ordenarse, permite ver el historial de registro de la cuenta.

La ordenación solo se aplica a las entidades que tienen [metadatos](/es/blockchain/metadata.md), ya que la clave de metadatos se utiliza para ordenar los resultados de la consulta.

Puedes combinar el ordenamiento con la paginación y los filtros. Ten en cuenta que el ordenamiento es una función opcional, la mayoría de las consultas con paginación no lo necesitarán.

## Referencia {#reference}

Consulta el [lista de consultas existentes](/es/reference/queries.md) para obtener información detallada sobre ellos.
