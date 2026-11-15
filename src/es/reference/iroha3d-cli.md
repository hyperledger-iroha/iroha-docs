---
translation_locale: es
translation_source: /reference/iroha3d-cli.md
translation_source_hash: 846370e45fe0e0d605016d6722b1d50c39981f954c7d9040b87fc385eb12ac68
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

Utilice la versión del perfil canónico de Taira preparada por el operador; la plantilla incluida en el repositorio aún contiene marcadores de posición del despliegue. No la sustituya por la configuración genérica de SORA Nexus o la de producción de SoraFS al realizar pruebas en Taira.

## `--config` {#arg-config}

- Tipo: ruta de archivo
- Alias: `-c`

Ruta al [configuración de par de red](/es/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Tipo: ruta de archivo

Manifiesto técnico opcional del génesis de la blockchain JSON utilizado para la validación del consenso.

## `--check-config` {#arg-check-config}

Valide la configuración resuelta y el material génesis de blockchain disponible, luego salga sin vincular los sockets de red.

## `--json` {#arg-json}

- **Tipo:** indicador
- **Requiere:** `--check-config`

Imprime los valores de compatibilidad de esta compilación y configuración como un único objeto JSON de Norito, en lugar de la línea `Ready` o `Pending`.

## `--check-storage` {#arg-check-storage}

- **Tipo:** indicador
- **En conflicto con:** `--check-config`

Inspecciona en modo de solo lectura el almacén Kura y la instantánea más reciente del nodo detenido con los decodificadores de esta compilación, imprime el resultado como un único objeto JSON de Norito y termina con un código distinto de cero si falla. La comprobación toma el bloqueo de la raíz del almacén Kura, por lo que rechaza un almacén que pertenezca a un nodo en ejecución. Nunca modifica el almacén ni abre secretos exclusivos de la ejecución.

## `--check-replay` {#arg-check-replay}

- **Tipo:** indicador
- **En conflicto con:** `--check-config`, `--check-storage`

Reejecuta una copia del almacén del nodo detenido con esta compilación e imprime el resultado como un único objeto JSON de Norito. El comando copia los bloques a un directorio temporal, restaura allí la instantánea más reciente o vuelve a ejecutar el génesis firmado y reejecuta todos los bloques posteriores. Termina con un código distinto de cero si un bloque no reproduce su resultado certificado o falta el cuerpo de un bloque necesario; nunca escribe en el almacén ni abre secretos exclusivos de la ejecución.

## `--require-genesis-inrou-deployment-authority` {#arg-require-genesis-inrou-deployment-authority}

- **Tipo:** ID de cuenta
- **Requiere:** `--check-config`

Durante la validación sin conexión, exige que esta cuenta registrada conserve la autoridad de despliegue de SoraCloud después de ejecutar el génesis firmado exacto.

## `--sumeragi-assert-fresh-key` {#arg-sumeragi-assert-fresh-key}

- **Tipo:** indicador

Afirma, solo para este arranque, que las claves de consenso del nodo nunca han firmado para esta cadena. Sumeragi conserva un registro de seguridad por clave y no firma nada sin él hasta tener pruebas de que el registro no se ha perdido. Proporcione este indicador una sola vez, en el primer arranque de una clave nueva, y nunca después de una pérdida de datos.

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

Habilita el perfil de SORA Nexus utilizado por SoraFS, la negociación de SoraNet y el consenso de múltiples carriles. El lanzador de Taira siempre se invoca con este indicador.

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

El resumen anterior de opciones sigue las definiciones de argumentos de `iroha3d` en el commit fijado de Iroha. Para consultar la ayuda exacta de su copia del código, ejecute:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
