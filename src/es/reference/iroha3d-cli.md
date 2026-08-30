---
translation_locale: es
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` es el daemon de pares estándar Iroha 3. El paquete Cargo se llama `irohad`, por lo que invoque el binario desde un checkout fuente con:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Para la red de prueba pública Taira, la imagen de liberación utiliza `iroha3d_taira`. El mismo CLI es aceptado. También impone la cadena canónica Taira, el conjunto de validadores, las configuraciones de almacenamiento y las claves de firma de tiempo de ejecución. Valida una configuración Taira sin abrir las credenciales de tiempo de ejecución, como se indica a continuación:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

El operador deberá renderizar el perfil canónico Taira antes de su utilización. La plantilla registrada tiene configuraciones de ejemplos. El operador deberá sustituir cada ajuste de ejemplo. No utilice la configuración genérica Nexus o de producción SoraFS en el ensayo con respecto a Taira.

## `--config` {#arg-config}

- Tipo: camino del archivo
- Alias: `-c`

Camino a la configuración de pares [ ](/es/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Tipo: camino del archivo

Manifiesto de génesis opcional JSON utilizado para la validación por consenso.

## `--check-config` {#arg-check-config}

Valida la configuración resuelta y el material genético disponible, luego salga sin conexiones de red vinculadas.

## Sellos de calificación Kagemusha {#kagemusha-qualification-seals}

Estas opciones de archivo-camino requieren `--check-config` y realizar la calificación completa Kagemusha antes de escribir un sello canónico:

- El `--write-kagemusha-catalog-qualification-seal <PATH>` califica el catálogo.
- `--write-kagemusha-validator-qualification-seal <PATH>` califica al validador local para la reserva de promoción firmada configurada.

Las dos opciones de sello están en conflicto entre sí.

## `--trace-config` {#arg-trace-config}

- Tipo de bandera
- Medio ambiente: `TRACE_CONFIG`

Habilitar los registros de rastreo mientras se leen y analizan las capas de configuración.

## `--config-blake3` {#arg-config-blake3}

- Tipo: Digestión hexadecimal de 64 dígitos BLAKE3
- Requisitos: `--config`

Requerir que los bytes del archivo de configuración coincidan con el digesto suministrado. Un archivo vinculado a la integridad debe ser aplanado; no puede contener `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- Tipo: Booleano, aprobado como `--terminal-colors=true` o `--terminal-colors=false`
- Default: detección de la capacidad del terminal
- Medio ambiente: `TERMINAL_COLORS`

Control de la salida de color ANSI.

## `--language` {#arg-language}

- Tipo: cuerda

Anula el lenguaje del sistema utilizado para los mensajes de los demonios.

## `--sora` {#arg-sora}

- Tipo de bandera
- Medio ambiente: `IROHA_SORA_PROFILE`

Habilitar el perfil de Sora Nexus. Este perfil configura SoraFS, el apretón de manos SoraNet y el consenso multilánico. Siempre invoque el lanzador Taira con esta bandera.

## FastPQ sobrepasados {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` y `--fastpq-poseidon-mode <MODE>` aceptan sólo `cpu` o `gpu`. Las opciones restantes anulan las etiquetas de telemetría:

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

La salida completa a continuación se genera a partir de la fijación Iroha del código fuente.

<<< @/snippets/iroha3d-help.md
