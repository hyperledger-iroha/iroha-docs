---
translation_locale: es
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama Envases {#musubi-kotodama-packages}

Musubi es el administrador de paquetes para los paquetes fuentes Kotodama. Ofrece a los desarrolladores un flujo de trabajo similar a Cargo para compartir funciones composibles Kotodama manteniendo la identidad del paquete vinculada a los espacios de nombres SORA y Iroha en lugar de una tabla global de nombres de primer paso.

Utilice Musubi cuando sea necesario:

- Publicar bibliotecas fuentes reutilizables Kotodama
- en `Musubi.lock` las dependencias exactas de la fuente transitiva.
- Reconstruir la fuente de dependencia a partir de los compromisos verificados de archivo SoraFS
- conectar un espacio de nombres del paquete a los alias de contrato dapp en el mismo espacio de nombres
- inspeccionar, publicar, extraer o alias de paquetes a través del registro en cadena

## Nombres de paquetes {#package-names}

Utilización de los identificadores de paquetes canónicos:

```text
namespace/package
```

El uso de referencias exactas de liberación:

```text
namespace/package@version
```

No hay un líder `@` antes de un espacio de nombres. `@` el separador está reservado para el sufijo de versión.

El segmento del espacio de nombres coincide con el sufijo utilizado por los alias de contrato Kotodama dapp:

|Identificación del paquete |Forma del alias de contrato relacionado |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

Los espacios de nombres tienen el formulario `<dataspace>` o `<domain>.<dataspace>`. Cuando un paquete tiene un enlace dapp, Musubi comprueba que cada alias de contrato vinculado utiliza el mismo sufijo del espacio de nombres como el paquete.

## Manifiesto {#manifest}

El paquete comienza con `Musubi.toml`:

```toml
[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"

[exports]
functions = ["quote"]

[dapp]
namespace = "dex.universal"
contracts = ["router::dex.universal"]
```

Las dependencias pueden utilizar versiones exactas, requisitos de cuidado, requisitos de inclinación, tarjetas salvajes como `1.*`, o listas de comparación como `>=1.0.0,<2.0.0`.

`Musubi.lock` registra el gráfico transitivo seleccionado del registro en cadena. Cada nodo bloqueado almacena su paquete canónico ref, requisito seleccionado, SoraFS digesto de manifiesto, hash de archivo fuente, recuento de bytes, recuento del archivo, funciones exportadas, plan determinístico de archivo de origen y alias de dependencia. Los alias cortos se resuelven antes de entrar en el archivo de bloqueo.

## Flujo de trabajo local {#local-workflow}

A partir de la raíz del espacio de trabajo Iroha en alta corriente, ejecute Musubi a través de Cargo:

```bash
cargo run -p musubi -- init --namespace dex.universal --name swap-core --dapp
cargo run -p musubi -- add std.universal/math --version '^1.0.0' --alias math
cargo run -p musubi -- install --config client.toml
cargo run -p musubi -- build src/lib.ko --manifest-out target/lib.contract.json
cargo run -p musubi -- pack \
  --car-out source.car \
  --sorafs-manifest-out manifest.norito \
  --source-plan-out source-plan.norito
```

Utilice `install --offline` para escribir un archivo de bloqueo no resuelto para dependencias de versión exacta sin consultar un nodo. Utilice `install --locked` en CI para rechazar un archivo anticuado de bloqueo.

`build` vincula las fuentes de dependencias almacenadas en caché mediante la reescritura de llamadas como `math::add()` a nombres de funciones internas deterministas Kotodama. Rechaza las llamadas a funciones que la dependencia no exportó. Las bibliotecas Musubi v1 son solo funcionales: las fuentes de dependencia que contienen declaraciones de estado, desencadenantes, bloques de kotoba, constantes u otros elementos de contrato no funcionales se rechazan.

## La fuente de los archivos {#fetching-source-archives}

Musubi puede buscar fuentes de dependencia faltantes mientras resuelve o más tarde a través de los subcomandos del caché:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

Las recogidas en vivo de las puertas de entrada utilizan una o más especificaciones del proveedor de puertas de acceso SoraFS:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

Los archivos de carga útil del proveedor y los proveedores de puertas de acceso se excluyen mutuamente para una operación de recogida. Si faltan más de un paquete bloqueado, califique a cada proveedor de puertos de acceso con `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` o `manifest=<64-hex SoraFS manifest digest>`.

Puerta de entrada `base-url` y `privacy-url` los valores deben utilizarse `https://` por defecto. las pasarelas de prueba locales pueden utilizar `http://localhost`, `http://127.0.0.1`, o `http://[::1]` sólo con `--gateway-allow-insecure-localhost`. Los tokens de flujo son credenciales de tiempo de ejecución y no están escritos en `Musubi.lock`.

## Publicación {#publishing}

`pack` computa la determinación BLAKE3-256 archivo de origen hash más el byte fuente y los archivos cuentan. Cuando `--car-out`, `--sorafs-manifest-out`, o `--source-plan-out` se suministra, también construye la determinación SoraFS CAR carga útil, SoraFS manifiesto, y Musubi Plan de archivo fuente desde el mismo conjunto de archivos fuente.

Utilice una prueba en seco antes de publicar:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

Sin `--dry-run`, `publish` escribe los artefactos por defecto en `.musubi/dist/<namespace>/<name>/<version>/`, opcionalmente carga el manifiesto y la carga útil a través de Torii- ¿ Qué ? SoraFS punto final del pin de almacenamiento con `--upload`, registra los datos generados SoraFS el pin, y presenta `PublishMusubiRelease` a través de la configuración Iroha El cliente.

Las publicaciones publicadas deberán incluir:

- un archivo de fuente canónica no vacío
- un plan de archivo de fuentes determinista
- Por lo menos una función Kotodama exportada
- Registros de dependencia que no seleccionan las emisiones tiradas
- un enlace dapp, cuando esté presente, cuyos alias contractuales coincidan con el espacio de nombres del paquete

## Preguntas de registro y ciclo de vida {#registry-queries-and-lifecycle}

Buscar y inspeccionar el registro con:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Yanking esconde una liberación de nueva resolución, pero mantiene los ficheros de bloqueo existentes reproducibles:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi evita el name squatting global al hacer que `namespace/package` sea el nombre canónico del paquete. La publicación en un espacio de nombres debe estar autorizada por el mismo modelo de propiedad o permiso delegado utilizado para ese espacio de nombres dapp Kotodama . Los alias cortos globales seleccionados están separados de la propiedad del paquete: `SetMusubiShortAlias` requiere el permiso `CanSetMusubiShortAlias`, y el paquete objetivo debe tener ya al menos una liberación activa.

## Iroha Superficies {#iroha-surfaces}

Musubi utiliza las instrucciones y consultas de primera clase Iroha:

|Superficie .|Propósito |
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |Publicar una versión de paquete inmutable. |
|`YankMusubiRelease` |Marca una liberación existente como tirada. |
|`SetMusubiShortAlias` |Enlazar un alias global curado a una identificación de paquete. |
|`AssertMusubiReleaseExists` |Requerir una versión concreta del paquete para existir. |
|`FindMusubiReleaseByRef` |Traiga una liberación por referencia exacta del paquete. |
|`FindMusubiPackageVersions` |Lista de versiones para una identificación del paquete. |
|`FindMusubiPackageReleases` |Enumera resúmenes de las publicaciones para una identificación del paquete. |
|`SearchMusubiPackages` |Buscar resúmenes de paquetes por espacio de nombres y texto. |
|`FindMusubiShortAliasByName` |Resolver un alias corto seleccionado.|

Torii expone el Musubi HTTP familia de rutas en el `/v1/musubi/`. Frente al agente MCP las herramientas se exponen como `iroha.musubi.` Los alias. [Torii puntos finales](/es/reference/torii-endpoints.md) y [referencia de la consulta](/es/reference/queries.md) para el más amplio API El mapa.
