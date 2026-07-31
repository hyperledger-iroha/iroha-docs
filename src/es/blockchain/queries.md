---
translation_locale: es
translation_source: /blockchain/queries.md
translation_source_hash: 0a32b75b78d5bcde0d2b84b58d440b18e545559dfd9772dd6508ad41e972bf6e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# Las consultas {#queries}

Aunque gran parte de la información sobre el estado de la cadena de bloques se puede obtener, como hemos mostrado antes, usando un suscriptor de eventos y un filtro para reducir el alcance de los eventos a aquellos de interés, a veces es necesario adoptar un enfoque más directo. Ingrese consultas.

Las preguntas son pequeños objetos similares a instrucciones que, cuando se envían a un compañero Iroha, provocan una respuesta con detalles de la visión actual del estado del mundo.

Este no es necesariamente el único tipo de información disponible en la red, pero es el único tipo que está garantizado para ser accesible en todas las redes.

Para cada despliegue de Iroha, podría haber otra información disponible, por ejemplo, la disponibilidad de datos telemétricos depende de los administradores de red. Es totalmente su decisión si quieren o no asignar la potencia de procesamiento para rastrear el trabajo en lugar de usarlo para hacer el trabajo real.

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

Los filtros son específicos para las consultas. Por ejemplo, las consultas de cuentas se pueden restringir por identidad de cuenta o metadatos, mientras que las consultas sobre activos se pueden reducir por definición de activo, cuenta del titular o proyección de dominio. Utilice los constructores de consultas tipografadas del SDK siempre que sea posible para que el tipo de filtro coincida con el tipo de salida de la consulta.

## Clasificación {#sorting}

Iroha puede ordenar los elementos con [Metadatos](/es/blockchain/metadata.md) lexicográficamente si usted proporciona una clave para ordenar durante la construcción de la consulta. Un caso de uso típico es que las cuentas tengan un `registered-on` Introducción de metadatos que, cuando se clasifica, le permite ver el historial de registro de la cuenta.

La clasificación sólo se aplica a las entidades que tienen [ metadatos](/es/blockchain/metadata.md), ya que la clave de metadatos se utiliza para ordenar los resultados de la consulta.

Puede combinar la clasificación con pagination y filtros. Tenga en cuenta que la clasificación es una característica opcional, la mayoría de consultas con pagination no lo necesitarán.

## Referencia {#reference}

Consulte la lista de consultas existentes [ ](/es/reference/queries.md) para obtener información detallada sobre ellas.
