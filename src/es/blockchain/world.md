---
translation_locale: es
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# El mundo {#world}

`World` es la entidad global que contiene otras entidades. La `World` consta de:

- Iroha [parámetros de configuración](/es/guide/configure/client-configuration.md)
- parejas registradas
- dominios registrados
- los activadores registrados [](/es/blockchain/triggers.md)
- los papeles registrados [](/es/blockchain/permissions.md#permission-groups-roles)
- registrado [las definiciones de los tokens de permiso](/es/blockchain/permissions.md#permission-tokens)
- Tokens de permiso para todas las cuentas
- [la cadena de validadores de tiempo de ejecución ](/es/blockchain/permissions.md#runtime-validators)

Cuando los dominios, pares o roles están registrados o no, el `World` es el objetivo de la instrucción [ (no) registrada ](/es/blockchain/instructions.md).

## Visión del estado mundial (WSV) {#world-state-view-wsv}

World State View es la representación en memoria del estado actual de la cadena de bloques. Incluye los `World`, hashes de bloques comprometidos, índices de transacciones y pares elegidos para la época actual. Las cargas útiles de bloques completos se sirven desde Kura en lugar de duplicarse como datos mutables WSV.

El Consejo WSV Es el estado en que las consultas se leen y la ejecución de bloque mutan. No es la fuente duradera de verdad por sí misma. El historial duradero se almacena en [Kura](#kura-storage), y el WSV puede ser reconstruido desde Kura bloqueo o cargado de una instantánea del estado y luego atrapado por reproducción más reciente Kura Los bloques.

### ¿Qué traza el WSV {#what-the-wsv-tracks}

El WSV es más amplio que el objeto `World`, y en la práctica contiene:

- el `World`: parámetros, pares, dominios, cuentas, activos, NFTs, roles, permisos, desencadenantes, datos del ejecutor y otros objetos de modelo de datos registrados
- los hashes de bloques comprometidos y la última altura comprometida
- índices de transacción a bloqueo utilizados en las consultas y recibos
- la topología de compromisos actual y anterior utilizada por consenso
- Indices de memoria derivados de bloques comprometidos, como compromisos de disponibilidad de datos, cursores de recepción, intenciones de pin y marcadores de proyección de consulta.
- instantáneas de configuración del tiempo de ejecución necesarias para la ejecución determinista de bloques, como criptografía, gobernanza, pipeline, contenido, liquidación y configuraciones Nexus

Las consultas normalmente reciben una sola lectura `StateView` sobre estas estructuras. Una vista es un instantáneo consistente para la ejecución de las consultas; no permite una mutación directa del WSV.

### Cómo cambia el WSV {#how-the-wsv-changes}

Los cambios WSV se escenifican antes de que sean cometidos. La ejecución de bloques crea una superposición de estado con escala de bloques, y cada transacción aceptada aplica sus instrucciones en un superposición con escala de transacción. Los desencadenantes de tiempo se evalúan después de los efectos de la transacción en el bloque.

Después de que el consenso comite un bloque, el peer primero encuentra el bloque comprometido en Kura. Si este paso de encuentro falla, el WSV no se avanza y el bucle de consenso vuelve a intentar o recorre la carga útil del bloque. Cuando el bloque es aceptado en la cola de Kura, Iroha aplica los efectos del bloque post-execución, actualiza los índices derivados y compromete los cambios escalonados WSV bajo un bloqueo de vista de estado. Esto evita que los lectores observen un bloque parcialmente comprometido.

La regla crítica del consenso es que los pares deben llegar al mismo WSV desde los mismos bloques comprometidos. Las modificaciones locales directas a las instrucciones de bypass de datos WSV y harán que los pares no estén de acuerdo durante la validación o reproducción.

### Inicio y repetición {#startup-and-replay}

Al iniciar, Iroha inicializa primero Kura y aprende la altura del bloque almacenado. Luego intenta cargar una instantánea de estado. Si no hay instantánea disponible o si se rechaza una instantáneo como recuperable, Iroha crea un estado inicial y reemplaza los bloques comprometidos desde Kura. Si una instantánea es válida pero está detrás de Kura, solo se reproducirá el rango de altura que falta.

Replay valida cada bloque almacenado, reconstruye la lista de compromisos para esa altura, aplica los efectos del bloque al WSV y compromete el estado resultante. Esto significa que Kura es el camino de recuperación para el WSV, mientras que las instantáneas son una optimización que evita repetición de toda la cadena.

## Kura Almacenamiento {#kura-storage}

Kura es el almacenamiento persistente de bloques de Iroha. Almacena bloques firmados y metadatos de recuperación. No almacena una segunda copia mutable del WSV.

El almacenamiento de Kura está enraizado en [`kura.store_dir`](/es/reference/peer-config/params.md#param-kura-store-dir). Dentro de esa raíz, los datos del bloque se dividen por carril o segmento. Los archivos principales para un segmento son:

|Camino .|El propósito .|
| --- | --- |
|`blocks/<segment>/blocks.data` |Cargas útiles de bloques firmados con un marco Norito contiguo. |
|`blocks/<segment>/blocks.index` |Las entradas de tamaño fijo `(start, length)` que indican la altura del bloque de mapa en bytes en `blocks.data`. |
|`blocks/<segment>/blocks.hashes` |Bloquear hashes por altura para una búsqueda rápida y validación de inicio. |
|`blocks/<segment>/blocks.count.norito` |Un marcador de compromiso duradero que registra cuántas entradas del índice de bloques son seguras de usar. |
|`blocks/<segment>/da_blocks/` |Cargas útiles de bloque eliminadas que se mantienen fuera de `blocks.data` cuando la aplicación del presupuesto del disco saca cuerpos viejos del archivo caliente. |
|`blocks/<segment>/pipeline/sidecars.norito` y `sidecars.index` |Los coches de recuperación del oleoducto se clasifican según la altura del bloque.|
|`blocks/<segment>/pipeline/roster_sidecars.norito` y `roster_sidecars.index` |Recientes carros laterales de commit-roster usados para la sincronización y repetición de bloques. |
|`merge_ledger/<segment>.log` |Las entradas del registro de fusiones alineadas con los bloques comprometidos. |
|`commit-rosters.norito` |Se mantienen certificados de compromiso y puntos de control de validador para bloques recientes. |

Kura mantiene un vector compacto en la memoria para la cadena: cada altura tiene el hash del bloque y, opcionalmente, el cuerpo del bloque. El bloque de génesis permanece guardado en caché, y los bloques no genéticos más recientes [ `kura.blocks_in_memory`](/es/reference/peer-config/params.md#param-kura-blocks-in-memory) mantienen sus cuerpos en la memoria. Los cuerpos de los bloques más antiguos se eliminan de la memoria y se recargan de archivos Kura cuando sea necesario.

Durante la inicialización, el modo `strict` valida los bloques almacenados de las cargas útiles del bloque y reescribe el archivo hash si es necesario. El modo `fast` comienza a partir de metadatos hash / índice almacenados y vuelve a una inicialización estricta si esos metadatos son inconsistentes. Si Kura detecta una cola corrompida, el almacenamiento se prolonga hasta el último bloque validado.

Kura escribe nuevos bloques a través de un escritor de fondo. El escritor añade cargas útiles de bloque, hashes y entradas de índice, luego avanza el marcador de recuento duradero de acuerdo con la política de fsync configurada. Cuando la aplicación del presupuesto de disco esté activa, Kura puede purgar los segmentos retirados o desalojar a los cuerpos de bloques más antiguos en `da_blocks/` mientras mantiene los hashes y las entradas de índice disponibles para su validación y búsqueda. .
