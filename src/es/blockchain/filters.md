---
translation_locale: es
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Los filtros {#filters}

Filtra los flujos de eventos y desencadena las condiciones. El filtro actual de eventos de nivel superior es `EventFilterBox`, que puede coincidir con estas familias de eventos:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

Utilice el filtro más estrecho que coincida con el flujo de trabajo. Los filtros amplios como `DataEventFilter::Any` son útiles para el diagnóstico, pero hacen que cada evento pague el costo del desencadenante o la correspondencia de los suscriptores.

## Filtros de eventos de datos {#data-event-filters}

`DataEventFilter` coincide con los eventos de datos del libro mayor. Sus variantes actuales incluyen:

|Variante |Familia de eventos |
| --- | --- |
|`Any` |Cualquier evento de datos |
|`Peer` |Eventos del ciclo de vida entre pares |
|`Domain` |Ciclo de vida del dominio y eventos de metadatos |
|`Account` |Ciclo de vida de la cuenta, metadatos, alias y eventos de identidad |
|`Asset` |Saldo de activos y eventos de metadatos |
|`AssetDefinition` |La definición de activos ciclo de vida, política y eventos de metadatos |
|`Nft` |NFT ciclos de vida y eventos de metadatos |
|`Rwa` |Eventos del ciclo de vida de activos en el mundo real |
|`Trigger` |Eventos de ciclo de vida y metadatos de desencadenante |
|`Role` |Eventos del ciclo de vida del papel |
|`Configuration` |Eventos de configuración en cadena |
|`Executor` |Eventos del ejecutor de tiempo de ejecución |
|`Proof` |Eventos en el ciclo de vida de la verificación de pruebas |
|`Confidential` |Eventos de activos confidenciales |
|`VerifyingKey` |Eventos de registro de claves de verificación |
|`RuntimeUpgrade` |Eventos de actualización del tiempo de ejecución |
|`Soradns` |Resolver los eventos de gobernanza del directorio |
|`Sorafs` |SoraFS Eventos de cumplimiento de la puerta de entrada |
|`SpaceDirectory` |Directorio espacial manifiesta los eventos del ciclo de vida |
|`Escrow` |Transparencia de los eventos del ciclo de vida de garantía de activos nativos |
|`Offline` |Eventos de liquidación fuera de línea |
|`Oracle` |Eventos de alimentación Oracle |
|`Social` |Eventos de incentivos virales |
|`Bridge` |Eventos de puentes |
|`Governance` |Eventos de gobernanza cuando se habilita la función de gobernanza |

La mayoría de los filtros de concreto también permiten una combinación opcional ID y una máscara de conjunto de eventos. Por ejemplo, un filtro de activos puede coincidir con un activo o una clase de eventos de activos, mientras que un filtro desencadenante puede corresponder a un desencadenador ID y un conjunto de eventos desencadenantes.

## Filtros de tuberías {#pipeline-filters}

Los filtros de tubería coinciden con eventos de procesamiento como bloques, transacciones, fusiones y eventos de testigos. Usarlos para suscripciones operativas, paneles de procesamiento de bloques, y los desencadenantes que reaccionan al estado de la tubería en lugar de objetos de datos del libro mayor.

## Filtros de activación {#trigger-filters}

Los disparadores almacenan su condición como un `EventFilterBox`.

- un ejecutable
- una política de repetición
- una cuenta de la autoridad
- una política opcional de retiro del tiempo
- Metadatos

La autoridad de activación debe tener los permisos requeridos por el ejecutable. Prefiere cuentas técnicas dedicadas para los activadores de larga duración.

## Filtros de consultas {#query-filters}

Los filtros de consultas están separados de los filtros de eventos. Las consultas iterables pueden exponer el predicado y el soporte del selector. Utilice filtros tipados específicos para la consulta desde SDK para que la entrada del filtro coincida con el tipo de salida de la consulta.

Véase también:

- [Eventos ](/es/blockchain/events.md)
- [Escrow de activos nativos ](/es/blockchain/escrow.md#queries-and-events)
- [Los desencadenantes ](/es/blockchain/triggers.md)
- [Las consultas ](/es/blockchain/queries.md)
- [Referencia de la consulta ](/es/reference/queries.md)
