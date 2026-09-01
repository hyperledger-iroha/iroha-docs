---
translation_locale: es
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Filtros {#filters}

Los filtros estrechan los flujos de eventos y las condiciones de activación. El filtro de eventos de nivel superior actual es `EventFilterBox`, que puede coincidir con estas familias de eventos:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

Utilice el filtro más estrecho que coincida con el flujo de trabajo. Los filtros amplios como `DataEventFilter::Any` son útiles para diagnósticos, pero hacen que cada evento pague el costo de la coincidencia del disparador o del suscriptor.

## Filtros de eventos de datos {#data-event-filters}

`DataEventFilter` coincide con los eventos de datos del libro mayor de blockchain. Sus variantes actuales incluyen:

|Variante|Familia de eventos|
| --- | --- |
| `Any` |Cualquier evento de datos|
| `Peer` |eventos del ciclo de vida de los pares de red|
| `Domain` |Ciclo de vida del dominio y eventos de metadatos|
| `Account` |Ciclo de vida de la cuenta, metadatos, alias y eventos de identidad|
| `Asset` |Eventos de balance de activos y metadatos|
| `AssetDefinition` |Ciclo de vida de la definición de activos, política y eventos de metadatos|
| `Nft` | NFT eventos de ciclo de vida y metadatos |
| `Rwa` |Eventos del ciclo de vida de activos del mundo real|
| `Trigger` |Activar eventos de ciclo de vida y metadatos|
| `Role` |Eventos del ciclo de vida del rol|
| `Configuration` |Eventos de configuración en cadena|
| `Executor` |eventos del ejecutor de tiempo de ejecución de software|
| `Proof` |Eventos del ciclo de vida de verificación de pruebas|
| `Confidential` |Eventos de activos confidenciales|
| `VerifyingKey` |Eventos del registro de clave de verificación|
| `RuntimeUpgrade` |eventos de actualización del tiempo de ejecución del software|
| `Soradns` |Resolver eventos de gobernanza de directorio|
| `Sorafs` |SoraFS eventos de cumplimiento de la pasarela|
| `SpaceDirectory` |Eventos del ciclo de vida del manifiesto técnico del Directorio Espacial|
| `Escrow` |Eventos del ciclo de vida de fideicomisos de activos nativos transparentes|
| `Offline` |Eventos de liquidación fuera de línea|
| `Oracle` |Eventos de alimentación de Oracle|
| `Social` |Eventos de incentivo viral|
| `Bridge` |Eventos de bridge|
| `Governance` |Eventos de gobernanza cuando la funcionalidad de gobernanza está habilitada|

La mayoría de los filtros concretos también permiten un coincidente de ID opcional y una máscara de conjunto de eventos. Por ejemplo, un filtro de activos puede coincidir con un activo o con una clase de eventos de activos, mientras que un filtro de disparadores puede coincidir con un ID de disparador y un conjunto de eventos de disparador.

## Filtros del canal de procesamiento {#pipeline-filters}

Los filtros de la canalización de procesamiento coinciden con eventos de procesamiento como bloque, transacción, fusión y testigo. Úselos para suscripciones operativas, paneles de procesamiento de bloques y disparadores que reaccionan al estado de la canalización de procesamiento en lugar de a los objetos de datos del libro mayor de la blockchain.

## Filtros de activación {#trigger-filters}

Los disparadores almacenan su condición como un `EventFilterBox`. Una acción de disparador también almacena:

- un ejecutable
- una política de repetición
- una cuenta principal de autorización
- una política de reintento opcional activada por tiempo
- metadatos

El principal de autorización del disparador debe tener los permisos requeridos por el ejecutable. Prefiera cuentas técnicas dedicadas para disparadores de larga duración.

## Filtros de consulta {#query-filters}

Los filtros de consulta son independientes de los filtros de eventos. Las consultas iterables pueden exponer soporte para predicados y selectores. Utilice filtros tipados específicos de la consulta del SDK para que la entrada del filtro coincida con el tipo de salida de la consulta.

Véase también:

- [Eventos](/es/blockchain/events.md)
- [Custodia de Activos Nativos](/es/blockchain/escrow.md#queries-and-events)
- [Desencadenantes](/es/blockchain/triggers.md)
- [Consultas](/es/blockchain/queries.md)
- [Referencia de consulta](/es/reference/queries.md)
