---
translation_locale: es
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Los desencadenantes {#triggers}

Los desencadenantes unen un filtro de eventos a una acción ejecutable. Cuando un evento coincide con el filtro del activador, Iroha evalúa la acción del activador como parte de la ejecución del bloque.

## La estructura {#structure}

Un `Trigger` registrado contiene:

- `id`: un envase de `TriggerId` con un embalaje de `Name`
- `action`: el ejecutable, la autoridad, el filtro, la política de repetición, la política del retiro y los metadatos.

La acción incluye:

- `executable`: `Instructions`, `ContractCall`, `Ivm`, o `IvmProved`
- `repeats`: `Indefinitely` o `Exactly(n)`
- `authority`: la cuenta que invoque el ejecutable
- `filter`: un `EventFilterBox`
- `retry_policy`: comportamiento de retoma opcional para los desencadenantes del tiempo programado
- `metadata`: metadatos del desencadenante arbitrarios

## Los filtros de eventos {#event-filters}

Las condiciones de activación utilizan el mismo modelo de filtro de eventos que las suscripciones. El filtro de evento de nivel superior puede coincidir con:

- acontecimientos de la tubería
- eventos de datos
- acontecimientos del tiempo
- desencadenar eventos de ejecución
- desencadenar los eventos de finalización

Preferimos el filtro más estrecho que coincida con el flujo de trabajo. Los filtros amplios son útiles para el diagnóstico, pero aumentan el trabajo durante la ejecución del bloque.

Véase [Filtros](/es/blockchain/filters.md) para las familias de filtros actuales.

## El tiempo desencadena {#time-triggers}

Los desencadenantes de tiempo utilizan un filtro de eventos de tiempo. Cuando la vista del estado mundial alcanza una condición de tiempo correspondiente, Iroha ejecuta la acción de desencadenante bajo la autoridad del desencadenador.

## La repetición {#repetition}

`Repeats::Indefinitely` mantiene un gatillo activo hasta que no esté registrado.

`Repeats::Exactly(n)` permite al gatillo disparar un número fijo de veces. Cuando el recuento se agota, registre un nuevo gatillo si se requiere el mismo comportamiento de nuevo.

## Autoridad y permisos {#authority-and-permissions}

La autoridad de activación es la cuenta utilizada para invocar el ejecutable. Utilice una cuenta técnica dedicada para los activadores de larga duración para que los permisos requeridos sean explícitos y aislados de la cuenta personal de un operador.

La autoridad necesita los permisos requeridos por las instrucciones ejecutables o la llamada de contrato.La cuenta que registra el gatillo también necesita permiso para registrar gatillos bajo el validador activo del tiempo de ejecución.

## Política de retraso {#retry-policy}

Los desencadenantes de tiempo pueden optar por una política de retoma. Una política de retama establece:

- `max_retries`: cuántos intentos de retiro se permiten después de un disparo inicial fallido.
- `retry_after_ms`: cuánto tiempo espera Iroha antes de que un nuevo ensayo sea elegible

Cuando el presupuesto para volver a intentarlo se agota, el gatillo no está registrado.

## Las consultas {#queries}

Utilice las consultas actuales del gatillo para inspeccionar el estado del gatillo:

- [`FindTriggers`](/es/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/es/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/es/reference/queries.md#triggers-contracts-transactions-and-blocks)

Véase también:

- [Ejemplo de desencadenante del evento](/es/blockchain/trigger-examples.md)
- [Eventos ](/es/blockchain/events.md)
- [Las instrucciones ](/es/blockchain/instructions.md)
- [Las autorizaciones ](/es/blockchain/permissions.md)
