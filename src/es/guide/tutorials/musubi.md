---
translation_locale: es
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama Envases {#musubi-kotodama-packages}

Musubi es el gestor de paquetes de primera edición para los paquetes fuentes Kotodama. Resulta un gráfico exacto de dependencia en la cadena, autentica SoraFS archivos de origen, compila y prueba el espacio de trabajo seleccionado, construye archivos canónicos CAR y publica versiones inmutables a través de Iroha.

Utilice Musubi cuando sea necesario:

- Publicar bibliotecas de funciones reutilizables Kotodama
- pin un gráfico transitivo exacto en `Musubi.lock`
- reconstruir la fuente de dependencia a partir de los compromisos de archivo SoraFS finalizados
- Construir y probar un paquete o un espacio de trabajo multipaquetado
- inspeccionar, publicar, extraer, mantener o alias de paquetes a través del registro en cadena

## Nombres de paquetes {#package-names}

Los selectores de paquetes canónicos utilizan:

```text
namespace/package
```

Los identificadores de liberación exactos agregan una versión:

```text
namespace/package@version
```

No hay una dirección `@` antes de un espacio de nombres. Un espacio de nombres es ya sea una raíz del espacio de datos como el `universal` o un espacio de datos calificado por dominio como el `dex.universal`. El libro mayor une ese espacio de nombres estructural a un espacio de información doméstico estable antes de que se pueda reclamar un paquete.

## Manifiesto y archivo de bloqueo {#manifest-and-lockfile}

Un paquete utiliza la primera edición cerrada `Musubi.toml` El manifiesto debe declarar `manifest-version = 1`, Kotodama Edición `"1"`, y IVM ABI la versión `1`; no hay un manifiesto alternativo, o ABI el modo.

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

Las dependencias pueden utilizar versiones exactas, requisitos de cuidado o tilde, wildcards como `1.*`, y conjuntos de comparador separados por vírgenes como `>=1.0.0,<2.0.0`. La clave de la tabla de dependencias es el alias de importación parental-local; `package` es siempre el selector del registro canónica.

`Musubi.lock` une el gráfico a la genesis exacta derivada de `NetworkId` y una instantánea del registro finalizado. Registra las raíces seleccionadas del espacio de trabajo y los nodos de liberación inmutables, incluidos los compromisos de liberación, fuente, interfaz, archivo, ABI y límite exacto de dependencia. Las versiones paralelas se permiten cuando el gráfico resuelto las requiere.

## Configuración de Taira SoraFS Recogiendo {#configure-taira-sorafs-fetching}

Taira es la red de prueba pública para este flujo de trabajo. Comience a partir de una configuración del cliente Taira con la cadena y identidad de red registradas, luego añada los vínculos de búsqueda autenticados específicos del proveedor a continuación. El material de firma de la cuenta y las claves del operador del proveedor deberán permanecer en los archivos de tiempo de ejecución exclusivos para el propietario.

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

Descubra los proveedores admitidos de Taira a partir de la raíz pública de testnet:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

El catálogo del proveedor suministra las identidades del proveedor y los puntos finales anunciados. Obtenga la autorización del operador correspondiente del proveedor elegido. El tiempo de ejecución utiliza esa clave para solicitar tokens de flujo limitados; los tokens no son argumentos CLI ni contenido de archivo de bloqueo.

No utilice una Taira pin del validador URL como `url`. Los validadores registrados han incorporado: SoraFS el almacenamiento ha sido desactivado. `https://taira-validator-{1,2,3,4}.sora.org` los puntos finales aceptan el registro de pin, mientras que las lecturas de archivo utilizan la opción del proveedor admitido seleccionado HTTPS de origen.

## Flujo de trabajo local {#local-workflow}

A partir de la raíz del espacio de trabajo Iroha upstream, cree o ingrese el directorio de paquetes y ejecute Musubi a través de Cargo:

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch` resuelve el gráfico de registro finalizado, actualizaciones `Musubi.lock` cuando sea permitido, y llena el caché local inmutable de autenticado SoraFS las ubicaciones. `check`, `build`, `test`, y `package` realizar las mismas comprobaciones de gráficos y caché antes de su propio trabajo.

Use `--locked` para rechazar cualquier cambio en el archivo de bloqueo. Utilice `--offline` solo cuando tanto el índice de registro como todos los archivos requeridos ya estén almacenados en caché. `--frozen` combina esas dos restricciones. Una caché fuera de línea falla; Musubi nunca escribe un archivo de bloques no resuelto.

Las fuentes de dependencia se vinculan reescribiendo llamadas calificadas como `math::add()` a nombres internos deterministas Kotodama. Una llamada de dependencia a una función no exportada es rechazada. las bibliotecas importadas exponen funciones; los objetivos locales `[[contract]]` y `[[test]]` siguen siendo objetivos explícitos del paquete.

## Verificación de caché y reparación {#cache-verification-and-repair}

Los comandos de caché público funcionan en archivos inmutables y comprometidos con el registro:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` las cuarentenas corrompen a descendientes de confianza y revitaliza los archivos exactos cuando la evidencia del proveedor finalizada lo permite. Musubi rechaza una mutación de poda viva no vacía. Utilice `--dry-run` para inspeccionar a los candidatos clasificados.

## Envasado y publicación {#packaging-and-publishing}

Inspectar el conjunto de archivos positivos limpios antes de escribir un archivo, luego construir el paquete canónico:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` escribe `target/package/<namespace>-<name>-<version>.car`. El Consejo CAR se une al manifiesto de paquete canónico, al manifieste de liberación semántica, a la cerradura exacta de verificación, al árbol fuente, al digesto de interfaz y SoraFS No hay compromisos de archivo. `pack`, `--car-out`, `--sorafs-manifest-out`, o `--source-plan-out` los comandos en la primera versión CLI.

La publicación es un flujo de trabajo de red firmado y reanudable. El `client.toml` seleccionado debe contener los vínculos de producción `[musubi.publication]`, así como la configuración de cuenta y de red Taira.

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Utilice `--detach` para regresar después de que el diario de operación y el límite de entrada de la semilla sean duraderos. Continúe una operación duradera con `publish --resume <operation-id> --config client.toml`. El camino más estrecho `--recover <operation-id>` sólo se reconstruye No hay ninguna publicación `--dry-run` o descarga pública genérica fallback; ejecuta `package --list` y `package` para el vuelo local previo.

## Preguntas de registro y ciclo de vida {#registry-queries-and-lifecycle}

Buscar e inspeccionar el registro final con la misma configuración de cliente Taira:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

Yanking excluye una liberación inmutable de las nuevas resoluciones mientras que las cerraduras exactas existentes siguen siendo reproducibles. Lea primero la revisión de yank actual, y luego envíe una mutación para comparar y establecer:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

Use `unyank` con el mismo paquete, versión y revisión de lectura reciente para revertir ese estado. Los roles de propiedad y mantenimiento del paquete controlan los permisos de publicación, extracción, metadatos y ubicación de archivos. Los alias globales tienen su propio registro a precios, historial de retargeting, y revisiones de comparación y fijación; no son atajos a la propiedad del paquete.

## Iroha Superficies {#iroha-surfaces}

Musubi utiliza instrucciones y consultas de la primera edición V1:

|Superficie .|Propósito |
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |Enlazar un espacio de nombres con su espacio de datos estable en casa.|
|`RegisterMusubiArchiveV1` |Registrar un compromiso de archivo fuente autenticado inmutable. |
|`AddMusubiArchiveLocationV1` |Añadir o renovar una ubicación de archivo comprobada SoraFS. |
|`PublishMusubiReleaseV1` |Reclamar o actualizar un paquete y publicar una versión inmutable. |
|`SetMusubiReleaseYankV1` |Comparar y establecer el estado tirado de una liberación exacta.|
|`InviteMusubiPackageMaintainerV1` |Iniciar el flujo explícito de invitación al papel del paquete. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |Registro o retargeting un alias global gobernado. |
|`AssertMusubiReleaseDigestV1` |Afirmar la digestión exacta de liberación inmutable.|
|`FindMusubiExactPackageV1` |Lea un paquete exacto y sus revisiones. |
|`FindMusubiExactReleaseV1` |Lea una instantánea exacta de liberación. |
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Resolver o hacer una lista de candidatos a liberación finalizados. |
|`FindMusubiArchiveLocationsV1` |Lea las ubicaciones de archivos finalizadas respaldadas por el proveedor. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |Lea el alias actual del objetivo o su historia inmutable. |

Torii expone la familia de rutas de aplicaciones en `/v1/musubi/`. MCP las herramientas utilizan la corriente `iroha.musubi.queries.` y `iroha.musubi.instructions.*` Los nombres. [Torii puntos finales](/es/reference/torii-endpoints.md) y el [referencia de la consulta](/es/reference/queries.md) para el más amplio API El mapa.
