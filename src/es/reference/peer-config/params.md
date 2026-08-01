---
translation_locale: es
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Parámetros de configuración {#configuration-parameters}

En la actualidad, el número de personas

## Nivel de raíz {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

Cadena ID que debe ser incluida en cada transacción.

Un ataque de repetición es un intento de enviar una transacción válida a una red diferente a la que estaba destinada. Debido a que el `chain` forma parte de la carga útil de transacciones firmadas, una transacción firmada para una cadena es rechazada por pares que utilizan otra cadena ID.

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

Clave pública del par. Los pares de validadores de consenso deben utilizar las claves BLS-Normal.

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

Clave privada del peer. Debe coincidir con `public_key`; los pares validadores de consenso deben utilizar las claves normales BLS.

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

Lista de compañeros de confianza predefinidos.

Los validadores de consenso deben usar las claves BLS-Normal Peer. Para cada validador, también proporcione una entrada correspondiente [`trusted_peers_pop`](#param-trusted-peers-pop).

<param-table env="TRUSTED_PEERS">
<template #type>

Array of peer strings. Utilice `PUBLIC_KEY@ADDRESS` cuando se conozca la dirección P2P; también se acepta el `PUBLIC_KEY` desnudo y permite descubrir la dirección de los pares a partir del chisme.

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

BLS entradas de prueba de posesión para los compañeros de confianza del validador.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

Arrays de objetos con campos `public_key` y `pop_hex`

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

## Génesis {#genesis}

### `genesis.file` {#param-genesis-file}

Camino de archivo a la carga útil del bloque genesis firmado generada por `kagami genesis sign`. Los perfiles generados comúnmente escriben esto como un archivo Norito `.nrt`.

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

La clave pública del par de llaves genéticas.

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

## La red {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Dirección para la comunicación p2p con fines de consenso (sumeragi) y sincronización de bloques (bloque_sync).

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

Dirección peer-to-peer (externa, según lo visto por otros pares).

Serán chismeados a compañeros conectados para que puedan chimearlo a otros compañeros.

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

El intervalo de tiempo entre las solicitudes a los pares por el bloque más reciente.

El chisme más frecuente acorta el tiempo de sincronización, pero puede sobrecargar a la red.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Número máximo de transacciones en un mensaje de chismes.

El tamaño más pequeño lleva a un tiempo más largo para sincronizarse, pero es útil si tiene una alta pérdida de paquetes.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Periodo de chismes en espera de una transacción entre compañeros.

El chisme más frecuente acorta el tiempo de sincronización, pero puede sobrecargar a la red.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Duración del tiempo después del cual se interrumpe la conexión con el compañero si el compañero está inactivo.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Dirección a la que el servidor Torii debe escuchar y a la que los clientes pueden hacer sus solicitudes.

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

El número máximo de bytes en un cuerpo de solicitud bruto aceptado por los puntos finales [Torii ](/es/reference/torii-endpoints.md).

Este límite se utiliza para prevenir los ataques DOS.

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

El tiempo en que una consulta puede permanecer en la tienda si no se accede.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

El límite superior de la cantidad de consultas en vivo.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

El límite superior del número de consultas en vivo para un solo usuario.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## El madero {#logger}

### `logger.level` {#param-logger-level}

Verbosidad general de registro (véase [ `logger.filter`](#param-logger-filter) para la configuración refinada).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Cuerdas, valores posibles:

- `TRACE`: Todos los eventos, incluidas las operaciones de bajo nivel.
- `DEBUG`: Mensajes de nivel de defecto, útiles para el diagnóstico.
- `INFO`: Mensajes de información generales.
- `WARN`: Advertencias que indican posibles problemas.
- `ERROR`: Errores que interrumpan la función normal pero permiten una operación continua.

Seleccione el nivel que más se adapte a su caso de uso. Consulte [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) para obtener detalles adicionales sobre cómo utilizar diferentes niveles de registro.

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

::: tip Actualización del tiempo de ejecución

Este parámetro está sujeto a la actualización de la configuración del tiempo de ejecución a través de los puntos finales del operador Torii.

:::

### `logger.filter` {#param-logger-filter}

Filtros de registro refinados además de [`logger.level`](#param-logger-level). Permite personalizar la verbosidad del registro por objetivo.

<param-table type=string env=LOG_FILTER>
<template #type>

La cadena consiste en una o más directivas separadas por vírgulas, cada directiva puede tener un nivel máximo de verbosidad correspondiente que permita (por ejemplo, selecciona para) intervalos y eventos que coincidan. El Iroha considera que los niveles menos exclusivos (como el `trace` o el `info`) son más verbales que los niveles más exclusivos (cómo el `error` o el `warn`).

En un nivel elevado, la sintaxis de las directivas se compone de varias partes:

```
target[span{field=value}]=level
```

Para obtener más detalles, véase la documentación [`tracing-subscriber` ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info Compatibilidad con [`logger.level`](#param-logger-level)

`logger.filter` trabaja junto con [`logger.level`](#param-logger-level) y ninguno de ellos superpone al otro.

Por ejemplo, si `logger.level` está configurado en `INFO` y `logger.filter` es configurado en`iroha_core=debug`, el conjunto de filtros resultante será `info,iroha_core=debug` (es decir, `info` para todos los módulos, `debug` para `iroha_core`.

:::

::: tip Actualización del tiempo de ejecución

Este parámetro está sujeto a la actualización de la configuración del tiempo de ejecución a través de los puntos finales del operador Torii.

:::

### `logger.format` {#param-logger-format}

El formato de registro.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Cuerdas, valores posibles:

- `full`: El formatador predeterminado. Esto emite registros legibles por humanos de una sola línea para cada evento que ocurra, con el contexto actual del período mostrado antes de la representación formateada del evento.
- `compact`: Una variante del formatador predeterminado, optimizada para longitudes de líneas cortas. Se adjuntan campos del contexto de extensión actual a los campos del evento formateado y no se muestran nombres de extensión; el nivel de verbosidad se abrevia a un solo carácter.
- `pretty`: Emite registros excesivamente bonitos, de varias líneas, optimizados para la legibilidad humana. Esto está destinado principalmente a ser utilizado en el desarrollo local y depuración, o para aplicaciones de línea de comandos Cuando el análisis automatizado y el almacenamiento compacto de los registros sean menos prioritarios que la legibilidad y el atractivo visual.
- `json`: Produce registros de nueva línea delimitados JSON. Esto está destinado a ser utilizado en producción con sistemas donde los registros estructurados se consumen como JSON mediante herramientas de análisis y visualización. La salida JSON no está optimizada para su legibilidad humana.

Para obtener más detalles y resultados de la muestra, véase la documentación [`tracing-subscriber` ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura es el motor de almacenamiento persistente de Iroha (en japonés para almacén).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

El máximo de N últimos bloques se almacenarán en la memoria.

Los bloques más antiguos se dejarán caer de la memoria y se cargarán del disco si son necesarios.

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

Modo de inicialización Kura

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

Cuerdas, valores posibles:

- `strict`: validación estricta de todos los bloques
- `fast`: Iniciación rápida con solo controles básicos

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Especifica el directorio [^paths] donde se almacenan los bloques.

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

Bandera para permitir la impresión de nuevos bloques en consola.

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

## Cuadra {#queue}

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

Utilice esta opción para aplicar el estrollo.

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

El interruptor de depuración solo para ejercer las rutas de manejo de horquilla suave Sumeragi. Deja esto desactivado fuera de las pruebas controladas; cambiarlo en una red de producción en funcionamiento puede hacer que los pares no estén de acuerdo sobre el comportamiento de consenso.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Imagen instantánea {#snapshot}

Este módulo es responsable de leer y escribir instantáneas del [World State View](/es/blockchain/world#world-state-view-wsv).

Las instantáneas almacenan un punto de control serializado de la vista del estado mundial para que un compañero pueda reiniciar sin reproducir cada bloque desde Kura. Kura sigue siendo el historial duradero del bloque y la fuente de verdad para la repetición; las instantáneas son una ruta de aceleración. Al iniciar, Iroha comprueba los metadatos de instantáneas con la cadena configurada y los bloques almacenados antes de decidir si cargar una instantánea o volver a reproducir.

::: tip Esborrar las instantáneas

En caso de que algo no esté bien con el sistema de instantáneas, y quieras comenzar desde una página en blanco (en términos de instantáneos), podrías eliminar el directorio especificado por [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

El modo en el que funciona el sistema Snapshot.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Cuerdas, valores posibles:

- `read_write`: Iroha crea instantáneas con un período especificado por [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Al iniciar, Iroha lee una instantánea existente (si la hay) y verifica que está actualizada con el almacenamiento de bloques.
- `readonly`: Similar a `read_write` pero Iroha no crea ninguna instantánea.
- `disabled`: Iroha no crea nuevas instantáneas ni lee una existente en el inicio.

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

La frecuencia de las instantáneas.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Directorio donde guardar las instantáneas.

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

Telemetría exporta el diagnóstico de pares a un colector externo de telemetría. Configurar tanto `telemetry.name` como `telemetry.url` cuando un peer debe informar al colector; omitir la sección cuando no se utiliza la telemetría .

`name` y `url` deben ser emparejados.

Todas las secciones `telemetry` son opcionales.

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

El período mínimo de tiempo para esperar antes de reconectar.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

El exponente máximo de 2 que se utiliza para aumentar el retraso entre las reconexiones.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

El camino del archivo para escribir la telemetría de desarrollo a

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
