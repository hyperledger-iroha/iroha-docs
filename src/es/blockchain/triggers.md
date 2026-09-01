---
translation_locale: es
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Desencadenantes {#triggers}

Los activadores vinculan un filtro de eventos a una acción ejecutable. Cuando un evento coincide con el filtro del activador, Iroha evalúa la acción del activador como parte de la ejecución del bloque.

## Estructura {#structure}

Un `Trigger` registrado contiene:

- `id`: un `TriggerId` que encapsula un `Name`
- `action`: el ejecutable, principal de autorización, filtro, política de repetición, política de reintento y metadatos

La acción contiene:

- `executable`: `Instructions`, `ContractCall`, `Ivm` o `IvmProved`
- `repeats`: `Indefinitely` o `Exactly(n)`
- `authority`: la cuenta que invoca el ejecutable
- `filter`: un `EventFilterBox`
- `retry_policy`: comportamiento opcional de reintento para activadores de tiempo programado
- `metadata`: metadatos de activación arbitrarios

## Filtros de eventos {#event-filters}

Las condiciones del disparador utilizan el mismo modelo de filtro de eventos que las suscripciones. El filtro de eventos de nivel superior puede coincidir con:

- eventos de la canalización de procesamiento
- eventos de datos
- eventos de tiempo
- desencadenar eventos de ejecución
- activar eventos de finalización

Prefiere el filtro más estrecho que coincida con el flujo de trabajo. Los filtros amplios son útiles para diagnósticos, pero aumentan el trabajo durante la ejecución del bloque.

Vea [Filtros](/es/blockchain/filters.md) para las familias de filtros actuales.

## Disparadores de tiempo {#time-triggers}

Los disparadores de tiempo utilizan un filtro de evento temporal. Cuando la vista del estado del mundo alcanza una condición de tiempo coincidente, Iroha ejecuta la acción del disparador bajo el principal de autorización del disparador. Los disparadores de tiempo son el tipo de disparador que puede usar la política de reintento descrita a continuación.

## Repetición {#repetition}

`Repeats::Indefinitely` mantiene un desencadenador activo hasta que se desregistre.

`Repeats::Exactly(n)` permite que el disparador se active un número fijo de veces. Cuando se agote el conteo, registre un nuevo disparador si se necesita el mismo comportamiento nuevamente.

## autorización principal y permisos {#authority-and-permissions}

El principio de autorización del disparador es la cuenta utilizada para invocar el ejecutable. Utilice una cuenta técnica dedicada para disparadores de larga duración de modo que los permisos requeridos sean explícitos y estén aislados de la cuenta personal de un operario.

El principal de autorización necesita los permisos requeridos por las instrucciones ejecutables o la llamada al contrato. La cuenta que registra el disparador también necesita permiso para registrar disparadores bajo el validador de tiempo de ejecución de software activo.

## Política de reintento {#retry-policy}

Los desencadenadores de tiempo pueden optar por una política de reintento. Una política de reintento establece:

- `max_retries`: cuántos intentos de reintento están permitidos después de un disparo inicial fallido
- `retry_after_ms`: cuánto tiempo espera Iroha antes de que un reintento sea elegible

Cuando se agota el presupuesto de reintentos, el disparador se da de baja.

## Consultas {#queries}

Utilice las consultas de activación actuales para inspeccionar el estado del activador:

- [`FindTriggers`](/es/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/es/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/es/reference/queries.md#triggers-contracts-transactions-and-blocks)

Véase también:

- [Ejemplo de activador de evento](/es/blockchain/trigger-examples.md)
- [Eventos](/es/blockchain/events.md)
- [Instrucciones](/es/blockchain/instructions.md)
- [Permisos](/es/blockchain/permissions.md)
