---
translation_locale: es
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: bing-translator-llm

outline: [2, 3]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Parámetros de configuración {#configuration-parameters}

[[toc]]

## A nivel raíz {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

ID de cadena que debe incluirse en cada transacción. Se utiliza para prevenir ataques de repetición.

Un ataque de repetición es un intento de enviar una transacción válida a una red diferente de aquella para la que estaba destinada. Debido a que el `chain` es parte de la carga útil de la transacción firmada, una transacción firmada para una cadena es rechazada por los nodos de la red que usan otro ID de cadena.

<param-table type=string env=CHAIN />

::: code-group

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

Clave pública del par de red. Los pares de red validador de consenso deben usar claves BLS-Normales.

<param-table type="public-key" env="PUBLIC_KEY" />

::: code-group

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

Clave privada del par de red. Debe coincidir con `public_key`; los pares de red validadores de consenso deben usar claves BLS-Normales.

<param-table type="private-key" env="PRIVATE_KEY" />

::: code-group

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

Lista de pares de red de confianza predefinidos.

Los validadores de consenso deben usar BLS-Claves normales de pares de red. Para cada validador, también proporcione una que coincida [`trusted_peers_pop`](#param-trusted-peers-pop) entrada.

<param-table env="TRUSTED_PEERS">
<template #type>

Array de cadenas de pares de red. Use `PUBLIC_KEY@ADDRESS` cuando se conoce la dirección P2P; también se acepta `PUBLIC_KEY` sin formato y permite que la dirección del par de la red se descubra a partir del gossip.

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers = [
    "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
    "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338",
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS='[
  "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
  "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338"
]'
```

:::

### `trusted_peers_pop` {#param-trusted-peers-pop}

BLS entradas de prueba de posesión para pares de red confiables del validador.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

Array de objetos con los campos `public_key` y `pop_hex`

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers_pop = [
  { public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2", pop_hex = "8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08" },
  { public_key = "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77", pop_hex = "a14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913" },
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS_POP='[
  {"public_key":"ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2","pop_hex":"0x8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08"},
  {"public_key":"ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77","pop_hex":"0xa14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913"}
]'
```

:::

## génesis de la blockchain {#genesis}

### `genesis.file` {#param-genesis-file}

Ruta del archivo al bloque génesis de la blockchain firmado generado por `kagami genesis sign`. Los perfiles generados comúnmente escriben esto como un archivo Norito `.nrt`.

<param-table type="file-path" env="GENESIS" />

::: code-group

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

Clave pública del par de claves génesis de la blockchain.

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: code-group

```toml [Config File]
[genesis]
public_key = "ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

```shell [Environment]
GENESIS_PUBLIC_KEY="ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

:::

## Red {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Dirección para comunicación p2p con fines de consenso (sumeragi) y sincronización de bloques (block_sync).

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: code-group

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

Dirección entre pares (externa, tal como la ven otros pares de la red).

Será difundido a los pares conectados de la red para que puedan difundirlo a otros pares de la red.

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: code-group

```toml [Config File]
[network]
public_address = "0.0.0.0:5000"
```

```shell [Environment]
P2P_PUBLIC_ADDRESS=0.0.0.0:5000
```

:::

### `network.block_gossip_size` {#param-network-block-gossip-size}

La cantidad de bloques que se pueden enviar en un solo mensaje de sincronización.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

El intervalo de tiempo entre las solicitudes a pares de la red para el bloque más reciente.

Chismear con más frecuencia acorta el tiempo para sincronizar, pero puede sobrecargar la red.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Número máximo de transacciones en un mensaje de lote de chismes.

Un tamaño más pequeño conduce a un tiempo más largo para sincronizarse, pero es útil si tienes una alta pérdida de paquetes.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Período de chismes sobre transacciones pendientes entre pares de la red.

Chismear con más frecuencia acorta el tiempo para sincronizar, pero puede sobrecargar la red.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Duración de tiempo después de la cual la conexión con el par de red se termina si el par de red está inactivo.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Dirección a la que el servidor Torii debe escuchar y a la que el/los cliente(s) realizan sus solicitudes.

<param-table type=socket-addr env=API_ADDRESS />

::: code-group

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

El número máximo de bytes en un cuerpo de solicitud sin procesar aceptado por el [Torii API puntos finales](/es/reference/torii-endpoints.md).

Este límite se utiliza para prevenir ataques DOS.

<param-table>
<template #type>

Número (de bytes)

</template>
<template #default-value>

`64_000_000` (64 millones de bytes)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

El tiempo que una consulta puede permanecer en la tienda si no se accede a ella.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

El límite superior del número de consultas en vivo.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

El límite superior del número de consultas activas para un solo usuario.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Registrador {#logger}

### `logger.level` {#param-logger-level}

Verbosidad general de registro (ver [`logger.filter`](#param-logger-filter) para configuración refinada).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Cadena, valores posibles:

- `TRACE`: Todos los eventos, incluidas las operaciones de bajo nivel.
- `DEBUG`: Mensajes a nivel de depuración, útiles para diagnósticos.
- `INFO`: Mensajes informativos generales.
- `WARN`: Advertencias que indican posibles problemas.
- `ERROR`: Errores que interrumpen la función normal pero permiten continuar con la operación.

Elija el nivel que mejor se adapte a su caso de uso. Consulte [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) para obtener detalles adicionales sobre cómo usar diferentes niveles de registro.

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip actualización del tiempo de ejecución del software

Este parámetro puede actualizarse en la configuración del entorno de ejecución mediante los endpoints de operador de la API Torii.

:::

### `logger.filter` {#param-logger-filter}

Filtros de registro refinados además de [`logger.level`](#param-logger-level). Permite personalizar la verbosidad del registro por destino.

<param-table type=string env=LOG_FILTER>
<template #type>

Cadena, consiste en una o más directivas separadas por comas. Cada directiva puede tener un nivel máximo de verbosidad correspondiente que habilita (por ejemplo, selecciona) los intervalos y eventos que coinciden. Iroha considera que los niveles menos exclusivos (como `trace` o `info`) son más verbosos que los niveles más exclusivos (como `error` o `warn`).

A un alto nivel, la sintaxis de las directivas consiste en varias partes:

```
target[span{field=value}]=level
```

Para más detalles, vea [`tracing-subscriber` documentación](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: code-group

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info Composición con [`logger.level`](#param-logger-level)

`logger.filter` trabaja junto con [`logger.level`](#param-logger-level) y ninguno sobrescribe al otro.

Por ejemplo, si `logger.level` se establece en `INFO` y `logger.filter` se establece en `iroha_core=debug`, el conjunto de filtros resultante será `info,iroha_core=debug` (es decir, `info` para todos los módulos, `debug` para `iroha_core`).

:::

::: tip actualización del tiempo de ejecución del software

Este parámetro puede actualizarse en la configuración del entorno de ejecución mediante los endpoints de operador de la API Torii.

:::

### `logger.format` {#param-logger-format}

Formato de registros.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Cadena, valores posibles:

- `full`: El formateador predeterminado. Este emite registros de una sola línea, legibles por humanos, para cada evento que ocurre, con el contexto del span actual mostrado antes de la representación formateada del evento.
- `compact`: Una variante del formateador predeterminado, optimizada para longitudes de línea cortas. Los campos del contexto de span actual se agregan a los campos del evento formateado, y los nombres de los spans no se muestran; el nivel de verbosidad se abrevia a un solo carácter.
- `pretty`: Emite registros excesivamente bonitos y en múltiples líneas, optimizados para la legibilidad humana. Esto está destinado principalmente a ser usado en el desarrollo local y depuración, o para aplicaciones de línea de comandos, donde el análisis automatizado y el almacenamiento compacto de registros tienen menos prioridad que la legibilidad y el atractivo visual.
- `json`: Genera registros JSON delimitados por saltos de línea. Esto está destinado para uso en producción con sistemas donde los registros estructurados son consumidos como JSON por herramientas de análisis y visualización. La salida JSON no está optimizada para la legibilidad humana.

Para más detalles y ejemplos de resultados, vea [`tracing-subscriber` documentación](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura es el motor de almacenamiento persistente de Iroha (japonés para almacén).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Como máximo, se almacenarán en la memoria los últimos N bloques.

Los bloques más antiguos se eliminarán de la memoria y se cargarán desde el disco si se necesitan.

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: code-group

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Kura modo de inicialización. `strict` es el modo normal y predeterminado: valida el historial canónico, los artefactos de recuperación, los índices auxiliares y la contabilidad de almacenamiento antes de que el nodo se active.

`fast` es un modo de servicio degradado de emergencia para restaurar la visibilidad operativa cuando una auditoría completa de inicio representaría un riesgo de interrupción. Requiere almacenamiento previamente inicializado por `strict` y una generación de vista de datos en un punto temporal actual que contenga exactamente cinco artefactos: `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito` y `snapshot.merkle.json`. Una firma de operador separada por dominio enlaza el valor de digest criptográfico de la carga útil anunciada y el manifiesto técnico limitado; el manifiesto técnico vincula la longitud de la carga útil, la identidad de la cadena/red, la altura/hash del terminal, el hash criptográfico de la política SCCP y la presencia de la línea de origen. Fast rechaza la línea de bootstrap y requiere el mismo marcador/límite de cuenta/punta exacto de durable Kura. Los nodos de primera versión aceptan exactamente esos cinco artefactos y rechazan cualquier otro conjunto de cantidad de artefactos o nombres de archivo.

Inventarios rápidos esos cinco nombres y vincula metadatos con la carga útil y los archivos Merkle, pero no lee, realiza hash criptográfico, analiza ni decodifica su contenido. Construye un Mundo/Nexus mínimo a partir del manifiesto técnico firmado, asigna el prefijo de hash criptográfico exacto Kura solo de lectura y deja sin abrir la vista de datos puntual del Mundo, el arreglo de hash de bloques, el historial de transacciones, los índices derivados y los diarios de recuperación duraderos. Merkle, auditorías de vistas de datos puntuales canónicas y semánticas, conciliación histórica de bloques/finalidad/SCCP, recuperación de altura activa Sumeragi, fusión y consultas de diarios, manifiesto de carril de ejecución/fuentes de cumplimiento, archivos respaldados por Kura-SoraFS, contabilidad de almacenamiento recursiva, y los conciliadores de servicio opcionales siguen aplazados. La admisión de transacciones locales, las propuestas, la votación, las escrituras canónicas y los productores auxiliares permanecen deshabilitados. Kura rechaza por sí mismo el inicio del escritor y las mutaciones duraderas; la cadena de procesamiento y las colas de persistencia de FASTPQ rechazan el trabajo inmediatamente en lugar de retenerlo o codificarlo. Kura lea APIs también desactivar el comportamiento de reparación y sincronización de durabilidad: los registros auxiliares temporales no se promueven, los artefactos de carril de ejecución faltantes no se publican y las barreras de progreso no se sincronizan con fsync. Sumeragi y el intercambio de información de transacciones no se inician. Torii expone solo operaciones de salud, actividad, disponibilidad, pares de red y configuración; API-versión, estado, métricas y todas las rutas ordinarias de estado/historial permanecen no disponibles. La disponibilidad permanece no disponible hasta el reinicio estricto.

Use `fast` solo para un incidente. Una vez que el servicio esté estable, detenga el nodo, restaure `strict` y reinicie para que todas las verificaciones diferidas y reconstrucciones de índices se ejecuten antes de que se reanude la producción. El modo rápido no requiere el registro de fusión diferida y no crea, repara, trunca ni importa el almacenamiento canónico; los sufijos no publicados y las etapas auxiliares de recuperación pendientes se ignoran sin ser leídos ni modificados, y luego se dejan para la recuperación estricta. El linaje de la vista de datos de punto en el tiempo solo con hash importada sigue sin estar disponible. Una vista de datos de punto en el tiempo actual que falta o es inválida falla inmediatamente; Fast nunca recurre a una reconstrucción de reproducción histórica o de mundo vacío.

<param-table default-value=strict>
<template #type>

Cadena, valores posibles:

- `strict`: validación completa y producción normal
- `fast`: inicio de emergencia limitado con producción en cuarentena hasta un reinicio estricto

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Especifica el directorio[^paths] donde se almacenan los bloques.

Véase también: [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: code-group

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

Bandera para habilitar la impresión de nuevos bloques en la consola.

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: code-group

```toml [Config File]
[kura.debug]
output_new_blocks = true
```

```shell [Environment]
KURA_DEBUG_OUTPUT_NEW_BLOCKS=true
```

:::

## Cola {#queue}

### `queue.capacity` {#param-queue-capacity}

El límite superior del número de transacciones que esperan en la cola.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

El límite superior del número de transacciones que esperan en la cola para un solo usuario.

Use esta opción para aplicar limitación.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

La transacción se cancelará después de este tiempo si todavía está en la cola.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Interruptor solo para depuración para ejercitar las rutas de manejo de soft-fork Sumeragi. Déjelo desactivado fuera de pruebas controladas; cambiarlo en una red de producción en funcionamiento puede hacer que los pares de la red no estén de acuerdo sobre el comportamiento del consenso.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus Acuerdo Privado Atómico {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` regula el camino separado de `AtomicPrivateSettlementV1`. Está deshabilitado por defecto. Configurar `enabled = true` también requiere un `activation_height`; la admisión aún falla en cerrado a menos que la capacidad en la cadena, el período de notificación, el perfil de prueba fija y la gobernanza de pool/auditoría estén activos.

Los límites principales son `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records` y `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` debe ser un subconjunto estrictamente creciente de las clases de relleno V1. `permitted_policy_versions` solo acepta V1.

`max_capsule_bytes` mide los Norito bytes canónicos del `PrivateSettlementAuditCapsuleV1` completo, incluyendo AAD, valor de nonce criptográfico, texto cifrado, marco de vector, y cada fila envuelta por auditor DEK; no es un límite solo de texto cifrado. Cada clase de relleno habilitada debe adaptarse al contenedor de datos de cápsula completa conservadora para al menos `default_min_auditor_approvals` auditores. Esa configuración de aprobación también es un límite regulado: Torii rechaza una política recién admitida con un valor `min_approvals` más bajo y rechaza cualquier cápsula real que supere el límite de bytes canónico.

Estas configuraciones no tienen omisión de activación de variables de entorno de producción. Vea [Ejecutar Liquidación Atómica Privada entre Espacios de Datos](/es/get-started/atomic-private-settlement) para el ejemplo completo de configuración y los requisitos operativos. La ruta no está calificada para producción hasta que se superen los puntos de control de liberación externa documentados.

## vista de datos en un momento específico {#snapshot}

Este módulo es responsable de leer y escribir vistas de datos en un punto en el tiempo del [Vista del Estado Mundial](/es/blockchain/world#world-state-view-wsv).

Las vistas de datos en un momento dado almacenan un punto de control serializado de la Vista del Estado Mundial para que un par de la red pueda reiniciar sin reproducir cada bloque desde Kura. Kura sigue siendo el historial de bloques duradero y la fuente de verdad para la reproducción; las vistas de datos en un momento dado son una vía de aceleración. Al iniciar, Iroha verifica los metadatos de la vista de datos en un punto en el tiempo contra la cadena configurada y los bloques almacenados antes de decidir si cargar una vista de datos en un punto en el tiempo o recurrir a la reproducción.

::: tip Borrar vistas de datos de un instante en el tiempo

En caso de que algo esté mal con el sistema de vistas de datos en un punto en el tiempo, y quieres empezar desde una página en blanco (en términos de vistas de datos de un momento específico), podrías eliminar el directorio especificado por [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

El modo en que funciona el sistema de vista de datos puntual.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Cadena, valores posibles:

- `read_write`: Iroha crea vistas de datos en un punto en el tiempo con un período especificado por [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Al iniciar, Iroha lee una vista de datos de un momento específico existente (si la hay) y verifica que esté actualizada con el almacenamiento de bloques.
- `readonly`: Similar a `read_write` pero Iroha no crea ninguna instantánea.
- `disabled`: Iroha no crea nuevas vistas de datos en un punto en el tiempo ni lee una existente al iniciar.

</template>
</param-table>

::: code-group

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

Frecuencia de instantáneas.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Directorio donde almacenar instantáneas.

Véase también: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: code-group

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## Telemetría {#telemetry}

La telemetría exporta diagnósticos de pares de red a un colector de telemetría externo. Configure tanto `telemetry.name` como `telemetry.url` cuando un par de red deba informar a un colector; omita la sección cuando no se use la telemetría.

`name` y `url` deben emparejarse.

Toda la sección `telemetry` es opcional.

### `telemetry.name` {#param-telemetry-name}

El nombre del nodo que se mostrará en la telemetría.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

El WebSocket URL del colector de telemetría.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

El período mínimo de tiempo que se debe esperar antes de reconectarse.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

El exponente máximo de 2 que se utiliza para aumentar el retraso entre reconexiones.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

La ruta de archivo para escribir dev-telemetry

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
