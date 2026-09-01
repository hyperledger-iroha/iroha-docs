---
translation_locale: es
translation_source: /reference/norito.md
translation_source_hash: b3b7c03bc0df3f7fa3df7e44b0ec8d755d615f9edca66bbcfe5613c33c8afbfe
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Norito {#norito}

Norito es la capa de serialización canónica de Iroha. Es el formato de bytes utilizado cuando los pares de red, SDKs, las herramientas CLI, Torii, Kura y los artefactos generados necesitan coincidir exactamente en la misma carga útil.

Use Norito cuando los datos son parte del consenso, la firma, el hash, la persistencia o la interoperabilidad cruzada SDK. Use JSON cuando un endpoint API ofrece explícitamente una proyección legible por humanos para operadores, paneles o depuración rápida.

## Dónde aparece Norito {#where-norito-appears}

|Superficie|Cómo se utiliza Norito|
| --- | --- |
|Transacciones y consultas|Los pagos de transacciones firmadas y consultas enviadas a través de Torii se codifican como Norito.|
|génesis de la blockchain| `kagami genesis sign` produce un bloque `.nrt` firmado que los pares de la red cargan al iniciar.|
|respuestas escritas Torii| API los endpoints que soportan respuestas binarias tipadas usan `Accept: application/x-norito`. |
| SDKs |Los clientes Rust, Python, JavaScript, Kotlin/Java, Swift y Android usan constructores o enlaces Norito en lugar de bytes ensamblados a mano.|
|Almacenamiento Kura|Las cargas de bloques, los anexos de recuperación, las listas y los marcadores de confirmación se almacenan en tramas Norito.|
|manifiestos técnicos| Nexus, disponibilidad de datos, SoraFS, transmisión y manifiestos técnicos orientados a aplicaciones usan Norito cuando el manifiesto técnico debe ser firmado o hashed.|
| Transmisión | Norito Streaming utiliza manifiestos de Norito, encabezados de segmento, tramas de control y vectores de prueba de conformidad. |

Norito no es un lenguaje de contratos inteligentes. Es el contenedor de datos determinista y el códec que transporta transacciones, llamadas a contratos, manifiestos técnicos y cargas útiles tipadas API.

## Modelo de carga útil {#payload-model}

Cada carga útil de Norito en tránsito o en disco está enmarcada por un encabezado seguido de los bytes codificados de la carga útil. Las cargas útiles sin encabezado, o desnudas, se reservan para hash internos, pruebas de rendimiento y APIs auxiliares que envuelven inmediatamente el resultado con un encabezado antes de transportarlo.

|Campo de encabezado|Tamaño|Propósito|
| --- | ---: | --- |
|Magia|4 bytes| ASCII `NRT0`, se utiliza para rechazar datos no Norito de manera temprana. |
|Mayor|1 byte|Formato de versión principal. Las cargas útiles actuales usan `0`.|
|Menor|1 byte|Decodificar pista para v1. El valor actual es `0x00`. Las banderas describen la disposición.|
|Esquema de hash criptográfico|16 bytes|Identidad de tipo utilizada por decodificadores tipados para rechazar cargas útiles inesperadas.|
|Compresión|1 byte| `0 = None`, `1 = Zstd`. Los valores desconocidos son rechazados. |
|Longitud de la carga|8 bytes|Longitud de la carga útil sin comprimir en formato little-endian `u64`. |
| CRC64 |8 bytes| CRC64-XZ suma de verificación de la carga útil descomprimida. |
|Banderas|1 byte|Banderas de diseño para longitudes compactas, secuencias empaquetadas y estructuras empaquetadas.|

El encabezado tiene 40 bytes. Los decodificadores validan la magia, la versión, la máscara de banderas soportadas, la longitud de la carga útil, la suma de verificación y el hash criptográfico del esquema antes de reconstruir el valor tipado.

## Banderas de diseño {#layout-flags}

Norito almacena las opciones de diseño en el byte final del encabezado. Los asistentes predeterminados v1 emiten `COMPACT_LEN` (`0x02`) para prefijos de longitud por valor compactos. Los prefijos de longitud de ancho fijo explícito permanecen legibles cuando los llamadores codifican con `flags = 0x00`.

|Bandera|Hex|Estado|Efecto|
| --- | ---: | --- | --- |
| `PACKED_SEQ` | `0x01` |Admitido|Codifica colecciones de tamaño variable con una tabla de desplazamiento más un bloque de datos contiguo.|
| `COMPACT_LEN` | `0x02` |predeterminada|Utiliza varints sin signo canónicos para prefijos de longitud por valor.|
| `PACKED_STRUCT` | `0x04` |Admitido|Codifica estructuras generadas por derive como cargas útiles de campos empaquetados.|
| `VARINT_OFFSETS` | `0x08` |reservada|Rechazado en v1; los desplazamientos de la secuencia empaqueta son de ancho fijo `u64`.|
| `COMPACT_SEQ_LEN` | `0x10` |reservada|Rechazado en v1; los encabezados de longitud de secuencia de nivel superior tienen ancho fijo `u64`.|
| `FIELD_BITSET` | `0x20` |Respaldado con requisitos|Agrega un conjunto de bits para estructuras empaquetadas de modo que solo los campos que requieren tamaños explícitos lleven prefijos de tamaño. Requiere `PACKED_STRUCT` y `COMPACT_LEN`.|

Las banderas son explícitas. Los decodificadores no infieren la disposición a partir de la forma de la carga, la versión menor o las heurísticas. Las combinaciones desconocidas o inválidas son rechazadas para que todos los pares de la red interpreten una carga de la misma manera.

## Reglas de codificación {#encoding-rules}

Norito utiliza diseños deterministas para las formas de datos comunes que aparecen en el modelo de datos Iroha:

- Las cadenas son `[len][utf8-bytes]`; `len` sigue a `COMPACT_LEN` cuando está habilitado.
- Cuando se establece `COMPACT_LEN`, una longitud por valor utiliza un varint compacto.
- Cuando `COMPACT_LEN` está ausente, una longitud por valor es un `u64` de 8 bytes en orden little-endian.
- Los encabezados de longitud de secuencia son de 8 bytes en little-endian `u64` en v1.
- `Vec<u8>` está codificado como `[len_u64][raw-bytes]` en lugar de una longitud por byte.
- Las secuencias empaquetadas usan desplazamientos `(len + 1)` monótonos `u64` seguidos de las cargas útiles de los elementos concatenados.
- Los mapas codifican los recuentos de entradas con `u64` fijo y usan un orden de clave determinista. Las entradas `HashMap` se ordenan por clave antes de codificar; `BTreeMap` usa su orden natural.
- `BigInt` utiliza bytes en complemento a dos de little-endian con una longitud de byte de `u32` y un límite de 512 bits.
- `Numeric` se codifica como `(mantissa, scale)`, donde la mantisa almacena el valor entero y la escala almacena el número de dígitos fraccionarios.

Estas reglas son importantes para las firmas y los hashes criptográficos. Dos SDKs que construyan la misma transacción lógica deben producir los mismos bytes canónicos.

## Esquema de hashing criptográfico {#schema-hashes}

Los payloads tipados Norito llevan un hash criptográfico de esquema de 16 bytes en el encabezado. El hash criptográfico predeterminado se deriva del nombre de tipo completamente calificado. Las compilaciones que habilitan el hash de esquema estructural derivan el hash criptográfico del esquema canónico en su lugar.

Los decodificadores tipados rechazan las incompatibilidades de esquema. Esto protege a los clientes de decodificar accidentalmente un cuadro Norito válido como el tipo incorrecto y es el modo de falla habitual cuando un paquete de artefactos de prueba SDK se desvía del modelo de datos del nodo.

## Compresión y Aceleración {#compression-and-acceleration}

Norito soporta compresión explícita y adaptativa sin cambiar la carga útil lógica:

|Función|Propósito|
| --- | --- |
| `to_bytes` |Codifica un encabezado seguido de una carga útil sin comprimir.|
| `to_compressed_bytes` |Codificar con Zstd y registrar la etiqueta de compresión en el encabezado.|
| `to_bytes_auto` |Aplica heurísticas deterministas para decidir si la compresión vale la pena.|
|CRC64 aceleración|Usa CRC64-XZ portátil en todas partes, con CLMUL en x86_64 o PMULL en aarch64 cuando esté disponible.|
|GPU CRC64 y compresión|Los ayudantes opcionales de Metal o CUDA pueden acelerar cargas útiles grandes y luego volver a los caminos de CPU.|

La aceleración de hardware nunca cambia el contenido decodificado. Los aceleradores CRC y JSON deben coincidir con la salida portátil bit a bit. Los bytes del marco Zstd pueden diferir entre los codificadores CPU y GPU, pero la carga útil decodificada y los metadatos del encabezado Norito permanecen deterministas para la validación.

## JSON Soporte {#json-support}

Norito incluye una pila nativa JSON para endpoints API y herramientas que necesitan JSON sin salir del sistema de tipos Norito.

|JSON característica|Caso de uso|
| --- | --- |
| `norito::json::{to_json, from_json}` |Codificación/decodificación tipada determinista JSON.|
|Bonitos y ayudantes de escritor| CLI salida, artefactos de prueba y transmisión `std::io` integración. |
|DOM valores|Manipulación programática a través del modelo de valores JSON de Norito.|
|Escribió rápido JSON|Decodificación/codificación basada en cinta estructural para rutas calientes DTO.|
|Lector sin copia|Escaneo de tokens que toma prestadas cadenas de la entrada cuando es posible.|
|Aceleradores de etapa 1|Opcional AVX2, NEON, Metal, o CUDA indexación estructural con retorno a escalar.|

El código Iroha debería preferir los auxiliares `norito::json` para cargas útiles tipadas API. Agregar `serde_json` simple a las rutas de producción arriesga divergir del esquema y del comportamiento de manejo de campos esperado por los extractores SDKs y Torii.

## Derivar soporte {#derive-support}

Los tipos de datos Rust generalmente usan macros derive en lugar de código de códec manual. La capa derive puede generar códecs binarios Norito, esquemas y ayudantes JSON.

Los atributos comunes de campo son:

|Atributo|Efecto|
| --- | --- |
| `#[norito(rename = "other")]` |Utiliza un nombre serializado estable para el esquema y la compatibilidad JSON.|
| `#[norito(skip)]` |El codificador omite el campo. El decodificador suministra su valor `Default`.|
| `#[norito(default)]` |Usa `Default` cuando una carga útil decodificada no contiene el campo.|
| `#[norito(skip_serializing_if = "...")]` |Omite campos de JSON cuando el predicado coincide, mientras conserva los valores predeterminados de decodificación determinista.|

Los derivados también exponen pistas de longitud codificada y cálculos de longitud exacta cuando es posible. Los codificadores utilizan esas pistas para reservar buffers y evitar copias adicionales.

## paquete de software Familias de Funciones {#crate-feature-families}

Al construir enlaces Iroha o SDK desde el código fuente, las funciones de Norito permiten seleccionar qué ayudantes y aceleradores están disponibles:

|Familia de características|Lo que permite|
| --- | --- |
| `derive` |Macros procedimentales reexportadas para binario, esquema y derives JSON.|
| `compression` |Soporte de Zstd para cargas útiles con encabezado enmarcado.|
| `packed-seq` |Diseños de colecciones empaquetadas usando tablas de desplazamiento.|
| `packed-struct` |Diseños de estructuras generadas derivadas empaquetadas.|
| `compact-len` |Prefijos de longitud por valor de Varint.|
| `columnar` | Norito Bloques de columnas, AoS/NCB códecs de fila adaptativos y vistas prestadas para rutas con alta frecuencia de escaneo; incluidos en el conjunto de funciones predeterminado `node-codec`. |
| `strict-safe` |Convierte los errores de decodificación en rutas fallibles en errores estructurados.|
| `simd-accel` |CPU aceleración cuando esté disponible, con sustitución determinista.|
| `json` |Analizador nativo JSON, escritor, DOM, derivados tipados y rutas rápidas.|
| `json-std-io` |Ayudantes de lector y escritor en capas sobre la pila JSON.|
| `metal-stage1`, `cuda-stage1` |Opcional GPU JSON backends de índice estructural.|
| `metal-stage2` |Clasificación opcional de metadatos Metal para la cinta estructural JSON.|
| `metal-crc64`, `cuda-crc64` |Opcionales GPU CRC64 ayudantes para cargas útiles grandes.|
| `gpu-compression` |Aceleración opcional de Metal o CUDA Zstd para cargas útiles grandes.|
| `stage1-validate` |Depuración de validación que compara los índices estructurales acelerados JSON con la salida escalar.|

La disponibilidad de funciones puede diferir entre SDKs y los perfiles de lanzamiento. El formato de intercambio sigue estando regido por el encabezado y el esquema, no por las banderas de compilación locales.

## Torii y Norito RPC {#torii-and-norito-rpc}

Torii expone JSON para muchas rutas de operador, pero las rutas binarias tipadas usan Norito. El tipo de medio para los cuerpos actuales tipados Norito HTTP es `application/x-norito`.

Use estos encabezados cuando un endpoint API acepte o devuelva Norito tipados:

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

Cuando un endpoint API admite ambas representaciones, los clientes pueden enviar una lista de preferencias explícita:

```http
Accept: application/x-norito, application/json
```

Los fallos de decodificación se presentan como errores tipados Torii y se cuentan mediante telemetría. Las razones comunes incluyen magia inválida, versión no soportada, bandera de función no soportada, error de suma de verificación, UTF-8 mal formado, etiqueta de enumeración inválida y discrepancia de esquema.

Norito RPC se selecciona a través de la configuración de transporte. Los paneles de control del operador deben rastrear la latencia de las solicitudes, fallos, conexiones activas, bytes de respuesta y `torii_norito_decode_failures_total` por separado del tráfico de JSON.

## Norito Transmisión {#norito-streaming}

Norito La transmisión extiende el mismo enfoque determinista a los medios y superficies de transporte en tiempo real. Sus piezas clave son:

|Función de transmisión|Propósito|
| --- | --- |
|manifiestos técnicos|Declarar compromisos de segmento, rutas de privacidad, capacidades, perfil de códec, conjunto de cifrado y metadatos de clave de contenido.|
|Encabezados de segmento|Vincular número de segmento, duración, recuento de fragmentos, sincronización, modo de entropía, resumen de audio y raíces de Merkle.|
|Compromisos por bloques|Permita que los espectadores y repetidores verifiquen los fragmentos de la carga útil contra el manifiesto técnico antes de servirlos o decodificarlos.|
|Marcos de control|Llevar anuncios de manifiesto técnico, retroalimentación, actualizaciones clave y negociación de capacidades.|
| HPKE actualizaciones de clave |Girar secretos de transporte usando el conjunto negociado y contadores que aumentan monótonamente.|
|Negociación de capacidades|Interseca las funciones compatibles, los límites de datagramas, la cadencia de retroalimentación y los requisitos de privacidad.|
| FEC y comentarios |Utiliza informes deterministas del receptor y decisiones de paridad para rutas en tiempo real con pérdidas.|
|Vectores de conformidad|Los artefactos de prueba entre idiomas demuestran que SDKs decodifica los mismos manifiestos técnicos, segmentos y flujos de entropía.|

Los códecs específicos para streaming y los perfiles de entropía están separados del formato central de transacción/consulta Norito, pero sus manifiestos técnicos y datos de control aún usan Norito, por lo que el enrutamiento, la facturación, la repetición y la evidencia de auditoría siguen siendo reproducibles.

## Guía Operativa {#operational-guidance}

- Prefiere los constructores SDK y los enlaces generados sobre los bytes Norito hechos a mano.
- Trata la descoordinación del esquema como un problema de versión o artefacto de prueba, no como un fallo transitorio de la red.
- Archivar `.nrt`, `.norito` y los artefactos de manifiesto técnico en el paquete de lanzamiento o incidente que los produjo.
- Use Norito como la fuente de verdad para datos firmados, con hash o persistidos. Use proyecciones JSON para tableros y revisión manual.
- Al agregar un nuevo endpoint tipeado Torii API, documente si acepta JSON, Norito o ambos, y exponga los tipos de contenido soportados en `/openapi.json`.
- Antes de habilitar un acelerador, ejecute pruebas de paridad contra la salida escalar. Si un acelerador falla, utilice la alternativa escalar determinista. La semántica de la carga útil debe permanecer sin cambios.

## Páginas relacionadas {#related-pages}

- [Torii API puntos finales](/es/reference/torii-endpoints.md)
- [referencia de génesis de blockchain](/es/reference/genesis.md)
- [Esquema del modelo de datos](/es/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK](/es/guide/tutorials/javascript.md)
- [Python SDK](/es/guide/tutorials/python.md)
- [Swift y iOS SDK](/es/guide/tutorials/swift.md)

## Referencias ascendentes {#upstream-references}

- [Norito especificación de formato](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/norito.md)
- [Norito crate README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/norito/README.md)
