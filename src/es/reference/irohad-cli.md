---
translation_locale: es
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` comienza un Iroha 3 daemon de pares.

```shell
irohad --config path/to/config.toml
```

## `--config`  {#arg-config}

- Tipo: Camino de archivos
- Alias: `-c`

Caminado hacia el archivo de configuración [ ](/es/reference/peer-config/index.md).

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Tipo: Camino de archivos

Recorrido opcional a un archivo de manifiesto de génesis JSON. Utilice esto cuando la implementación valida el inicio contra un manifiesto generado por Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Habilita los registros de seguimiento de lectura y análisis de configuración. Puede ser útil para la resolución de problemas de configuración .

- Tipo de bandera
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- Tipo: Boolean, ya sea `--terminal-colors=false` o `--terminal-colors=true`
- Por defecto: soporte de terminales de detección automática
- ENV: `TERMINAL_COLORS`

Si habilitar o no la salida de color ANSI.

Por defecto, Iroha determinará si el terminal admite o no la salida de color.

Para desactivar explícitamente los colores:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- Tipo: Cuerdas

Anula el lenguaje del sistema utilizado para los mensajes de los demonios.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- Tipo de bandera

Habilitar el Sora Nexus perfil de características para SoraFS, el SoraNet el apretón de manos, y los flujos de consenso de varios carriles.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- Tipo: `auto`, `cpu` o `gpu`

Superar el modo de ejecución del proveedor FASTPQ.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- Tipo: `auto`, `cpu` o `gpu`

Superar FASTPQ modo del oleoducto de Poseidón.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- Tipo: Cuerdas

Anulación de la etiqueta FASTPQ para la clase de dispositivos de telemetría.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- Tipo: Cuerdas

Anulación de la etiqueta de familia de chips de telemetría FASTPQ.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- Tipo: Cuerdas

Reemplazar la etiqueta del tipo FASTPQ de telemetría GPU.

```shell
irohad --fastpq-gpu-kind integrated
```
