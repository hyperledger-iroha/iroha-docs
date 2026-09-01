---
translation_locale: es
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Mundo {#world}

`World` es la entidad global que contiene otras entidades. El `World` consiste en:

- Iroha [parámetros de configuración](/es/guide/configure/client-configuration.md)
- pares de red registrados
- dominios registrados
- registrado [desencadenantes](/es/blockchain/triggers.md)
- registrado [roles](/es/blockchain/permissions.md#permission-groups-roles)
- registrado [definiciones de token de permiso](/es/blockchain/permissions.md#permission-tokens)
- tokens de permiso para todas las cuentas
- [la cadena de validadores de tiempo de ejecución de software](/es/blockchain/permissions.md#runtime-validators)

Cuando los dominios, los pares de la red o los roles se registran o se cancelan, el `World` es el objetivo del (des)registro [instrucción](/es/blockchain/instructions.md).

## Vista del Estado Mundial (WSV) {#world-state-view-wsv}

La Vista del Estado Mundial es la representación en memoria del estado actual de la blockchain. Incluye los `World`, los hashes criptográficos de bloques comprometidos, los índices de transacciones y los pares de la red elegidos para la época actual. Las cargas útiles de bloque completo se sirven desde Kura en lugar de duplicarse como datos WSV mutables.

El WSV es el estado que las consultas leen y que las ejecuciones de bloque modifican. No es la fuente de verdad duradera por sí mismo. La historia duradera se almacena en [Kura](#kura-storage). y el WSV puede reconstruirse a partir de bloques Kura o cargarse desde una vista de datos en un punto específico en el tiempo y luego ponerse al día reproduciendo bloques Kura más recientes.

### Qué WSV Pistas {#what-the-wsv-tracks}

El WSV es más amplio que el objeto `World`. En la práctica, contiene:

- el `World`: parámetros, pares de red, dominios, cuentas, activos, NFTs, roles, permisos, disparadores, datos del ejecutor y otros objetos de modelo de datos registrados
- hashes criptográficos de bloques comprometidos y la última altura comprometida
- índices de transacción a bloque utilizados por consultas y registros de resultados del protocolo
- la topología de los commits actual y anterior utilizada por consenso
- índices en memoria derivados de bloques comprometidos, tales como compromisos de disponibilidad de datos, cursores de registro de resultados del protocolo, intenciones de fijación y marcadores de proyección de consultas
- vistas de datos en un punto en el tiempo de la configuración de ejecución de software necesarias para la ejecución determinista de bloques, tales como criptografía, gobernanza, canal de procesamiento, contenido, liquidación y configuraciones Nexus

Normalmente, las consultas reciben un `StateView` de solo lectura sobre estas estructuras. Una vista es una vista de datos consistente en un momento específico para la ejecución de consultas; no permite la mutación directa del WSV.

### Cómo cambia el WSV {#how-the-wsv-changes}

Los cambios WSV se preparan antes de ser confirmados. La ejecución de bloques crea una superposición de estado con alcance de bloque, y cada transacción aceptada aplica sus instrucciones en un superposición con alcance de transacción. Los disparadores de datos invocados por esas transacciones se ejecutan en el mismo contexto de bloque. Los disparadores temporales se evalúan después de los efectos de la transacción para el bloque.

Después de que el consenso confirma un bloque, el nodo de la red primero pone en cola el bloque confirmado en Kura. Si este paso de poner en cola falla, el WSV no avanza y el ciclo de consenso vuelve a intentar o vuelve a poner en cola la carga del bloque. Cuando el bloque es aceptado en la cola de Kura, Iroha aplica los efectos del bloque posterior a la ejecución, actualiza los índices derivados y confirma los cambios en WSV en preparación bajo un bloqueo de vista del estado. Esto impide que los lectores observen un bloque parcialmente confirmado.

La regla crítica de consenso es que los pares de la red deben alcanzar el mismo WSV a partir de los mismos bloques comprometidos. Las ediciones locales directas en los datos de WSV omiten las instrucciones y harán que los pares de la red no coincidan durante la validación o la repetición.

### Inicio y Repetir {#startup-and-replay}

Al iniciar, Iroha inicializa primero Kura y aprende la altura del bloque almacenada. Luego intenta cargar una instantánea del estado. Si no hay una vista de datos en un punto en el tiempo disponible, o si una vista de datos en un punto en el tiempo es rechazada como recuperable, Iroha crea un estado inicial y reproduce los bloques comprometidos de Kura. Si una vista de datos en un momento específico es válida pero está detrás de Kura, solo se reproduce el rango de altura faltante.

Replay valida cada bloque almacenado, reconstruye la lista de confirmaciones para esa altura, aplica los efectos del bloque al WSV y confirma el estado resultante. Esto significa que Kura es la ruta de recuperación para el WSV, mientras que las vistas de datos en un momento determinado son una optimización que evita reproducir toda la cadena.

## Kura Almacenamiento {#kura-storage}

Kura es el almacenamiento persistente de bloques de Iroha. Almacena bloques firmados y metadatos de recuperación. No almacena una segunda copia mutable de WSV.

Kura el almacenamiento está enraizado en [`kura.store_dir`](/es/reference/peer-config/params.md#param-kura-store-dir). Dentro de esa raíz, los datos de los bloques se dividen por carril de ejecución o segmento. Los archivos principales de un segmento son:

|Camino|Propósito|
| --- | --- |
| `blocks/<segment>/blocks.data` |Cargas útiles de bloques firmados enmarcadas contiguas Norito.|
| `blocks/<segment>/blocks.index` |Entradas de tamaño fijo `(start, length)` que asignan la altura del bloque a bytes en `blocks.data`.|
| `blocks/<segment>/blocks.hashes` |Bloquear hashes criptográficos por altura para una búsqueda rápida y la validación al inicio.|
| `blocks/<segment>/blocks.count.norito` |Marcador de compromiso duradero que registra cuántas entradas del índice de bloques son seguras para usar.|
| `blocks/<segment>/da_blocks/` |Los contenidos de los bloques desalojados se mantienen fuera `blocks.data` cuando la aplicación del presupuesto de disco mueve cuerpos antiguos fuera del archivo caliente.|
| `blocks/<segment>/pipeline/sidecars.norito` y `sidecars.index` |registros auxiliares de recuperación de la canalización de procesamiento indexados por la altura del bloque.|
| `blocks/<segment>/pipeline/roster_sidecars.norito` y `roster_sidecars.index` |Registros auxiliares recientes del listado de commits utilizados por la sincronización y reproducción de bloques.|
| `merge_ledger/<segment>.log` |Entradas del libro mayor de fusión alineadas con los bloques comprometidos.|
| `commit-rosters.norito` |Certificados de compromiso retenidos y puntos de control del validador para bloques recientes.|

Kura mantiene un vector compacto en memoria para la cadena: cada altura tiene el hash criptográfico del bloque y, opcionalmente, el cuerpo del bloque. El bloque génesis de la blockchain sigue en caché, y el más reciente [`kura.blocks_in_memory`](/es/reference/peer-config/params.md#param-kura-blocks-in-memory) los bloques no génesis mantienen sus cuerpos en la memoria. Los cuerpos de los bloques más antiguos se eliminan de la memoria y se vuelven a cargar desde Kura archivos cuando sea necesario.

Durante la inicialización, el modo `strict` valida los bloques almacenados de las cargas de bloques y reescribe el archivo de hash criptográfico si es necesario. El modo `fast` comienza desde almacenado Metadatos de hash/índice y vuelve a la inicialización estricta si esos metadatos son inconsistentes. Si Kura detecta una cola corrupta, poda el almacenamiento hasta el último bloque validado.

Kura escribe nuevos bloques a través de un escritor en segundo plano. El escritor añade las cargas útiles de los bloques, los hashes criptográficos y las entradas del índice, luego avanza el marcador de conteo duradero de acuerdo con la política de fsync configurada. Cuando la aplicación del presupuesto de disco está activa, Kura puede purgar segmentos desmantelados o expulsar cuerpos de bloques antiguos a `da_blocks/` mientras mantiene los hashes criptográficos y las entradas de índice disponibles para validación y búsqueda.
