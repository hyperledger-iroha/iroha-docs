---
translation_locale: es
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` es el daemon de par de red estándar Iroha 3. El paquete Cargo se llama `irohad`, así que invoque el binario desde una copia de trabajo del código fuente con:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Para la testnet pública Taira, la imagen de lanzamiento utiliza `iroha3d_taira`. Acepta el mismo CLI pero además impone el perfil canónico Taira de cadena, validador, almacenamiento y firmante de tiempo de ejecución. Valida una configuración Taira sin abrir las credenciales de tiempo de ejecución del software de esta manera:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Use el formulario operado por el operador del perfil canónico Taira; la plantilla registrada aún contiene marcadores de posición de implementación. No sustituya los ajustes genéricos Nexus o de producción SoraFS al probar contra Taira.

## `--config` {#arg-config}

- Tipo: ruta de archivo
- Alias: `-c`

Ruta al [configuración de par de red](/es/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Tipo: ruta de archivo

Manifiesto técnico opcional del génesis de la blockchain JSON utilizado para la validación del consenso.

## `--check-config` {#arg-check-config}

Valide la configuración resuelta y el material génesis de blockchain disponible, luego salga sin vincular los sockets de red.

## Sellos de calificación de Kagemusha {#kagemusha-qualification-seals}

Estas opciones de ruta de archivo requieren `--check-config` y realizan la calificación completa de Kagemusha antes de escribir un sello canónico:

- `--write-kagemusha-catalog-qualification-seal <PATH>` califica el catálogo.
- `--write-kagemusha-validator-qualification-seal <PATH>` califica al validador local en relación con la reserva de promoción firmada configurada.

Las dos opciones de sello entran en conflicto entre sí.

## `--trace-config` {#arg-trace-config}

- Tipo: bandera
- Entorno: `TRACE_CONFIG`

Habilitar registros de seguimiento mientras se leen y analizan las capas de configuración.

## `--config-blake3` {#arg-config-blake3}

- Tipo: valor de resumen criptográfico hexadecimal de 64 dígitos BLAKE3
- Requiere: `--config`

Requerir que los bytes del archivo de configuración coincidan con el valor de resumen criptográfico proporcionado. Un archivo con integridad vinculada debe estar aplanado; no puede contener `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- Tipo: Booleano, pasado como `--terminal-colors=true` o `--terminal-colors=false`
- Predeterminado: detección de capacidades del terminal
- Entorno: `TERMINAL_COLORS`

Controlar la salida de color ANSI.

## `--language` {#arg-language}

- Tipo: cadena

Anular el idioma del sistema usado para los mensajes del demonio.

## `--sora` {#arg-sora}

- Tipo: bandera
- Entorno: `IROHA_SORA_PROFILE`

Habilite el perfil Sora Nexus utilizado por SoraFS, el apretón de manos SoraNet y el consenso de múltiples carriles. El lanzador Taira siempre se invoca con esta bandera.

## FastPQ anula {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` y `--fastpq-poseidon-mode <MODE>` aceptan solo `cpu` o `gpu`. Las opciones restantes anulan las etiquetas de telemetría:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

Por ejemplo:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## Ayuda generada {#generated-help}

El resumen de opciones anterior se verifica contra las definiciones de argumentos actuales `iroha3d`. La vista de datos de ayuda generada y registrada en el sistema no se muestra intencionalmente mientras su estado de procedencia esté pendiente. Para inspeccionar la ayuda exacta para su verificación, ejecute:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
