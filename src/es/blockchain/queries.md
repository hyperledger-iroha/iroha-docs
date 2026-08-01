---
translation_locale: es
translation_source: /blockchain/queries.md
translation_source_hash: 234c831c97bb93996e6cf51505921ff509e233408cf2faf6a9b23641e5642040
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# Las consultas {#queries}

Los suscriptores de eventos y filtros pueden seguir los cambios en el estado de la cadena de bloques. Utilice una consulta cuando necesite una vista directa del estado actual.

Las consultas son pequeños objetos similares a instrucciones. Envía uno a un Iroha para recibir detalles de su visión actual del estado del mundo.

Una red puede exponer otra información. La información querible sobre los estados mundiales es el único tipo garantizado de estar disponible en cada red Iroha.

Por cada despliegue de Iroha, podría haber otra información disponible. Por ejemplo, la disponibilidad de datos de telemetría depende de los administradores de red. Es totalmente su decisión si quieren asignar o no. poder de procesamiento para rastrear el trabajo en lugar de utilizarlo para realizar el trabajo real. Por el contrario, siempre se requieren algunas funciones, por ejemplo, tener acceso al saldo de su cuenta.

Los resultados de las consultas pueden ser clasificados [](#sorting), [paginated](#pagination) y [filtered](#filters) al mismo tiempo. La filtración puede realizarse en base a una variedad de principios, desde dominios específicos (máscaras individuales IP para filtros de direcciones) hasta métodos de subfiles como `begins_with` combinados utilizando operaciones lógicas.

## Pruébalo en Taira {#try-it-on-taira}

Taira expone a los asistentes de consultas sólo para lectura sobre JSON para recursos comunes. Utilicelos para practicar la paginado y el manejo de respuestas antes de cablear una SDK:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

Para el diagnóstico de aplicaciones, mantenga estos controles de humo separados de las pruebas de transacciones firmadas. Un fallo en la consulta solo para lectura suele indicar la disponibilidad del punto final, la accesibilidad de la red o la compatibilidad de ruta antes de señalar la configuración del signatario.

## Crear una consulta {#create-a-query}

Utilice los constructores de consultas tipografadas del SDK o CLI. Por ejemplo, el modelo de datos actual expone `FindAccounts` para las cuentas de cotización:

```rust
let query = FindAccounts;
```

Aquí hay un ejemplo de una consulta que encuentra los activos de Alice:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## Paginación {#pagination}

Para consultas singulares y pequeñas consultas iterables, puede usar `client.request` para enviar una consulta y obtener el resultado en un solo paso.

Sin embargo, las consultas generales iterables como `FindAccounts`, `FindAssets` o `FindBlocks` pueden devolver grandes conjuntos de resultados.

Para construir un `Pagination`, es necesario llamar a `client.request_with_pagination(query, pagination)`, donde el `pagination` está construido de la siguiente manera:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Los filtros {#filters}

Cuando crea una consulta, puede utilizar un filtro para devolver sólo los resultados que coinciden con el filtro especificado.

Los filtros son específicos para las consultas. Por ejemplo, las consultas de cuentas se pueden restringir por identidad de cuenta o metadatos, mientras que las consultas sobre activos se pueden reducir por activo uso de los constructores de consultas tipografadas SDK cuando sea posible para que el tipo de filtro coincida con el tipo de salida de la consulta.

## Clasificación {#sorting}

Iroha puede ordenar los elementos con [Metadatos](/es/blockchain/metadata.md) lexicográficamente si usted proporciona una clave para ordenar durante la construcción de la consulta. Un caso de uso típico es que las cuentas tengan un `registered-on` Introducción de metadatos que, cuando se clasifica, le permite ver el historial de registro de la cuenta.

La clasificación sólo se aplica a las entidades que tienen [ metadatos](/es/blockchain/metadata.md), ya que la clave de metadatos se utiliza para ordenar los resultados de la consulta.

Puede combinar la clasificación con pagination y filtros. Tenga en cuenta que la clasificación es una característica opcional, la mayoría de consultas con pagination no lo necesitarán.

## Referencia {#reference}

Consulte la lista de consultas existentes [ ](/es/reference/queries.md) para obtener información detallada sobre ellas.
