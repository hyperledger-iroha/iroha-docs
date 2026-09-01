---
translation_locale: es
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Musubi Kotodama Paquetes {#musubi-kotodama-packages}

Musubi es el gestor de paquetes de primera versión para paquetes fuente Kotodama. Resuelve un gráfico de dependencias exacto en la cadena y autentica SoraFS archiva las fuentes, compila y prueba el espacio de trabajo seleccionado, construye archivos canónicos CAR y publica versiones inmutables a través de Iroha.

Usa Musubi cuando necesites:

- publicar bibliotecas de funciones Kotodama reutilizables
- fijar un gráfico transitivo exacto en `Musubi.lock`
- reconstruir la fuente de dependencias a partir de los compromisos archivados finalizados SoraFS
- construir y probar un paquete o un espacio de trabajo de varios paquetes
- inspeccionar, publicar, eliminar, mantener o alias de paquetes a través del registro en cadena

## Nombres de paquetes {#package-names}

Los selectores de paquetes canónicos utilizan:

```text
namespace/package
```

Los identificadores de lanzamiento exactos agregan una versión:

```text
namespace/package@version
```

No hay un `@` inicial antes de un espacio de nombres. Un espacio de nombres es o bien una raíz de espacio de datos como `universal` o un espacio de datos calificado por dominio como `dex.universal`. El libro mayor de la blockchain vincula ese espacio de nombres estructural a un espacio de datos de hogar estable antes de que se pueda reclamar un paquete.

## manifiesto técnico y archivo de bloqueo {#manifest-and-lockfile}

Un paquete utiliza el esquema cerrado de primera versión `Musubi.toml`. El manifiesto técnico debe declarar `manifest-version = 1`, Kotodama edición `"1"`, y IVM ABI versión `1`; no existe un manifiesto técnico alternativo ni modo ABI.

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

Las dependencias pueden usar versiones exactas, requisitos con caret o tilde, comodines como `1.*`, y conjuntos de comparadores separados por comas como `>=1.0.0,<2.0.0`. La clave de la tabla de dependencias es el alias de importación local del padre; `package` siempre es el selector de registro canónico.

`Musubi.lock` vincula el gráfico al `NetworkId` derivado de la génesis exacta y a una instantánea de registro finalizada. Registra las raíces de espacio de trabajo seleccionadas y los nodos de lanzamiento inmutables, incluyendo lanzamiento, fuente, interfaz, archivo, ABI y compromisos exactos de dependencia. Se permiten versiones paralelas cuando el gráfico resuelto las requiere.

## Configurar Taira SoraFS Recuperando {#configure-taira-sorafs-fetching}

Taira es la testnet pública para este flujo de trabajo. Comience desde una configuración de cliente Taira con la cadena registrada y la identidad de red derivada del génesis actualmente fijada, luego agregue las vinculaciones de búsqueda autenticadas específicas del proveedor a continuación. Un reinicio de Taira puede cambiar el `NetworkId`; actualícelo desde el perfil de implementación firmado en lugar de inferirlo de la cadena estable UUID. El material de firma de la cuenta y las claves del operador del proveedor deben permanecer en archivos de ejecución de software solo para el propietario.

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

Descubre los proveedores admitidos de Taira desde la raíz de la testnet pública:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

El catálogo de proveedores suministra identidades de proveedores y puntos finales API anunciados. Obtenga la autorización del operador correspondiente del proveedor elegido. El tiempo de ejecución del software utiliza esa clave para solicitar tokens de flujo acotado; los tokens no son argumentos CLI ni contenido de archivo de bloqueo.

No utilice un pin de validador Taira URL como `url`. Los validadores registrados tienen deshabilitado el almacenamiento SoraFS incorporado. Sus puntos de conexión `https://taira-validator-{1,2,3,4}.sora.org` API aceptan el registro de pins, mientras que las lecturas de archivo utilizan el origen HTTPS del proveedor admitido seleccionado.

## Flujo de trabajo local {#local-workflow}

Desde la raíz del espacio de trabajo Iroha aguas arriba, crea o entra en el directorio del paquete y ejecuta Musubi a través de Cargo:

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

`fetch` resuelve el gráfico del registro finalizado, actualiza `Musubi.lock` cuando se permite y llena la caché local inmutable desde las ubicaciones SoraFS autenticadas. `check`, `build`, `test` y `package` realizan las mismas verificaciones del gráfico y de la caché antes de su propio trabajo.

Usa `--locked` para rechazar cualquier cambio en el archivo de bloqueo. Usa `--offline` solo cuando tanto el índice del registro como todos los archivos necesarios ya estén en caché. `--frozen` combina esas dos restricciones. Un fallo de caché fuera de línea falla; Musubi nunca escribe un archivo de bloqueo irresuelto.

Las fuentes de dependencia están vinculadas mediante la reescritura de llamadas calificadas como `math::add()` a nombres internos deterministas Kotodama. Se rechaza una llamada de dependencia a una función no exportada. Las bibliotecas importadas exponen funciones; los objetivos locales `[[contract]]` y `[[test]]` permanecen como objetivos de paquete explícitos.

## Verificación y reparación de caché {#cache-verification-and-repair}

Los comandos de caché pública operan sobre archivos inmutables, comprometidos en el registro:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` pone en cuarentena a los descendientes confiables corruptos y vuelve a obtener los archivos exactos cuando la evidencia del proveedor finalizado lo permite. La poda está deliberadamente cerrada por fallos para la mutación no vacía en vivo; use `--dry-run` para inspeccionar los candidatos clasificados.

## Empaquetado y Publicación {#packaging-and-publishing}

Inspeccione el conjunto de archivos positivos limpios antes de escribir un archivo, luego construya el paquete canónico:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` escribe `target/package/<namespace>-<name>-<version>.car`. El CAR enlaza el manifiesto técnico del paquete canónico, el manifiesto técnico de la versión semántica, el bloqueo de verificación exacta, el árbol de fuentes, valor de resumen criptográfico de la interfaz y compromiso de archivo SoraFS. No existen comandos separados `pack`, `--car-out`, `--sorafs-manifest-out` o `--source-plan-out` en la primera versión CLI.

La publicación es un flujo de trabajo de red firmado y susceptible de reanudación. El `client.toml` seleccionado debe contener las vinculaciones requeridas de `[musubi.publication]`, así como la configuración de la cuenta y de la red de Taira. Empaquete exactamente un miembro del espacio de trabajo:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Usa `--detach` para regresar después de que el diario de operaciones y el límite de ingreso de semillas sean duraderos. Continúa una operación duradera con `publish --resume <operation-id> --config client.toml`. El camino más estrecho `--recover <operation-id>` solo reconstruye faltan registros auxiliares inmutables para un diario previo al ingreso impecable. No hay publicación `--dry-run` ni carga pública genérica de respaldo; ejecute `package --list` y `package` para la revisión previa local.

## Consultas de registro y ciclo de vida {#registry-queries-and-lifecycle}

Busque e inspeccione el registro finalizado con la misma configuración del cliente Taira:

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

El arrancado excluye una versión inmutable de nuevas resoluciones mientras los bloqueos exactos existentes siguen siendo reproducibles. Lea primero la revisión de arrancado actual y luego envíe una mutación de comparar y establecer:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

Use `unyank` con el mismo paquete, versión y revisión recién leída para revertir ese estado. La propiedad del paquete y los roles de mantenedor controlan la publicación, eliminación y metadatos, y permisos de ubicación de archivo. Los alias globales tienen su propio registro con precio, historial de reorientación y revisiones de comparar y establecer; no son accesos directos de propiedad de paquetes.

## Iroha Superficies {#iroha-surfaces}

Musubi utiliza las instrucciones y consultas de primera versión V1:

|Superficie|Propósito|
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `RegisterMusubiNamespaceBindingV1`                   |Vincule un espacio de nombres a su espacio de datos estable.|
| `RegisterMusubiArchiveV1`                            |Registrar un compromiso de archivo de fuente autenticada inmutable.|
| `AddMusubiArchiveLocationV1`                         |Agregar o renovar una ubicación de archivo SoraFS comprobada.|
| `PublishMusubiReleaseV1`                             | Reclama o actualiza un paquete y publica una versión inmutable. |
| `SetMusubiReleaseYankV1`                             |Comparar y establecer el estado retirado de una versión exacta.|
| `InviteMusubiPackageMaintainerV1`                    |Iniciar el flujo de invitación de rol de paquete explícito.|
| `RegisterMusubiAliasV1` / `RetargetMusubiAliasV1`    |Registrar o reenfocar un alias global gobernado.|
| `AssertMusubiReleaseDigestV1`                        |Afirmar el valor exacto inmutable del digest criptográfico de la versión.|
| `FindMusubiExactPackageV1`                           |Lea un paquete exacto y sus revisiones.|
| `FindMusubiExactReleaseV1`                           |Leer una instantánea de versión exacta.|
| `FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Resolver o listar candidatos de lanzamiento finalizados.|
| `FindMusubiArchiveLocationsV1`                       |Lea las ubicaciones de archivo respaldadas por el proveedor finalizadas.|
| `FindMusubiAliasV1` / `FindMusubiAliasHistoryV1`     | Lea el objetivo de alias actual o su historial inmutable.        |

Torii expone la familia de rutas de la aplicación bajo `/v1/musubi/*`. Las herramientas MCP usan los nombres actuales de `iroha.musubi.queries.*` y `iroha.musubi.instructions.*`. Consulte [Torii API puntos finales](/es/reference/torii-endpoints.md) y el [referencia de consulta](/es/reference/queries.md) para el mapa más amplio de API.
