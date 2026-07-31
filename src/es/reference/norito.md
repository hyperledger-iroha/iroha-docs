---
translation_locale: es
translation_source: /reference/norito.md
translation_source_hash: ff258251887109f6cb28241235caea8e1b6a69df10df60cb7b2e7c2507004b4e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Norito {#norito}

Norito es Iroha es la capa de serialización canónica. Es el formato de byte utilizado cuando pares, SDKs, CLI herramientas, Torii, Kura, y los artefactos generados tienen que acordar exactamente la misma carga útil.

Utilización Norito Cuando los datos forman parte del consenso, la firma, el hashing, la persistencia o la cruz-SDK Interoperabilidad: uso JSON cuando un punto final ofrece explícitamente una proyección legible para los operadores, paneles de control o depuración rápida.

## En el que aparece Norito {#where-norito-appears}

|Superficie .|Cómo se utiliza Norito |
| --- | --- |
|Transacciones y consultas |Las cargas útiles de las transacciones firmadas y las consultas presentadas a través de Torii se codifican como Norito.|
|Génesis |`kagami genesis sign` produce un bloque firmado `.nrt` que comparte la carga al inicio. |
|Torii las respuestas tipografadas |Los puntos finales que admiten respuestas binarias de tipografía utilizan `Accept: application/x-norito`. |
|SDKs | Rust, Python, JavaScript, Kotlin/Java, Swift, y Android los clientes utilizan Norito constructores o enlaces en lugar de bytes montados a mano. |
|almacenamiento Kura |Las cargas útiles de bloqueo, los sidecars de recuperación, las listas y los marcadores de compromiso se almacenan como datos enmarcados con Norito. |
|Manifestos |Nexus, disponibilidad de datos, SoraFS, transmisión y manifiestos orientados a aplicaciones utilizan Norito cuando el manifiesto debe ser firmado o hashed. |
|En streaming .|Norito La transmisión utiliza manifiestos Norito, encabezados de segmentos, marcos de control y accesorios de conformidad. |

Norito no es un lenguaje de contratos inteligentes. Es el envelope determinista y el codec que lleva las transacciones, llamadas contractuales, manifiesta y escribe cargas útiles API.

## Modelo de carga útil {#payload-model}

Cada carga útil en cable o en disco Norito está enmarcada por un encabezado seguido de los bytes de carga útil codificados. Las cargas útiles sin encabezado, o desnudas, se reservan para el hashing interno, los puntos de referencia y el ayudante APIs que envuelven inmediatamente el resultado en una cabecera antes del transporte.

|Campo de encabezado |Tamaño .|Propósito |
| --- | ---: | --- |
|La magia .|4 bytes |ASCII `NRT0`, utilizado para rechazar anticipadamente los datos no relacionados con Norito. |
|Mayor .|1 byte |Formatar la versión principal. las cargas útiles actuales utilizan `0`. |
|Menores .|1 byte |Indicación de decodificación fija v1. Las cargas útiles actuales utilizan `0x00`; las opciones de diseño están en banderas. |
|El esquema hash |16 bytes |Identidad de tipo utilizada por los decodificadores de tipografía para rechazar cargas útiles inesperadas |
|Compresión |1 byte |`0 = None`, `1 = Zstd`. Los valores desconocidos se rechazan. |
|longitud de la carga útil |8 bytes |longitud de carga útil no comprimida como pequeña endianas `u64`. |
|CRC64 |8 bytes |CRC64-XZ suma de comprobación de la carga útil sin comprimir. |
|Banderas .|1 byte |Las banderas de diseño para longitudes compactas, secuencias envasadas y estructos envasados. |

El encabezado es de 40 bytes. Los decodificadores validan la magia, la versión, la máscara de bandera compatible, la longitud de carga útil, la suma de comprobación y el hash del esquema antes de reconstruir el valor mecanografiado.

## Banderas de diseño {#layout-flags}

Norito almacena las opciones de diseño en el byte final del encabezado. Los asistentes v1 predeterminados emiten `COMPACT_LEN` (`0x02`) para prefijos de longitud por valor compactos. Los prefijos explícitos de longitud de ancho fijo permanecen legibles cuando los llamantes codifican con `flags = 0x00`.

|Bandera .|Hex |El estado |El efecto |
| --- | ---: | --- | --- |
|`PACKED_SEQ` |`0x01` |Apoyados |Codifica las colecciones de tamaño variable con una tabla offset más un bloque de datos contiguo. |
|`COMPACT_LEN` |`0x02` |Por defecto .|Utiliza barantes no firmados canónicos para los prefijos de longitud por valor. |
|`PACKED_STRUCT` |`0x04` |Apoyados |Los códigos generados por las estructuras derivadas son cargas útiles de campo envasadas. |
|`VARINT_OFFSETS` |`0x08` |Reservado .|Rechazado en v1; las compensaciones de secuencias empaquetadas son de anchura fija `u64`. |
|`COMPACT_SEQ_LEN` |`0x10` |Reservado .|Rechazado en v1; los encabezados de longitud de secuencia de nivel superior son de ancho fijo `u64`. |
|`FIELD_BITSET` |`0x20` |Apoyados con requisitos |Añade un conjunto de bits para estructuras empaquetadas, por lo que sólo los campos que necesitan tamaños explícitos tienen prefijos de tamaño. Requiere `PACKED_STRUCT` y `COMPACT_LEN`. |

Las banderas son explícitas. Los decodificadores no deducen el diseño de la forma de la carga útil, la versión menor o las heurísticas. Se rechazan combinaciones desconocidas o inválidas para que todos los pares interpreten una carga útil de la misma manera.

## Reglas de codificación {#encoding-rules}

Norito utiliza diseños determinísticos para las formas de datos comunes que aparecen en el modelo de datos Iroha:

- Las cuerdas son `[len][utf8-bytes]`; `len` sigue a `COMPACT_LEN` cuando esté activada.
- Las longitudes por valor utilizan variantes compactas cuando se establece `COMPACT_LEN`, de lo contrario, fija el pequeño endio de 8 bytes `u64`.
- Los encabezados de longitud de secuencia se fijan en un pequeño endio `u64` de 8 bytes en v1.
- `Vec<u8>` está codificado como `[len_u64][raw-bytes]` en vez de una longitud por byte.
- Las secuencias envasadas utilizan compensaciones monótonas `(len + 1)` `u64` seguidas de las cargas útiles del elemento concatenado.
- Los mapas codifican los recuentos de entradas con fijo `u64` y usan el orden determinístico de la clave. Las entradas `HashMap` se clasifican por llave antes de codificar; `BTreeMap` utiliza su orden natural.
- `BigInt` utiliza pequeños bytes de complemento de dos enedianos con una longitud de byte `u32` y un límite de 512 bits.
- `Numeric` se codifica como `(mantissa, scale)`, donde la mantissa almacena el valor del número entero y la escala almacena el número de dígitos fraccionarios.

Estas reglas importan para las firmas y hashes. Dos SDKs que construyen la misma transacción lógica deben producir los mismos bytes canónicos.

## Esquema de Hashes {#schema-hashes}

Las cargas útiles de tipo Norito llevan un hash de esquema de 16 bytes en el encabezado. El hash predeterminado se deriva del nombre de tipo totalmente calificado. Los constructos que permiten el hash de esquemas estructurales derivan el hash del esquema canónico en su lugar.

Los decodificadores de tipo rechazan las incompatibilidades del esquema. Esto protege a los clientes de descodificar accidentalmente un marco válido Norito como el tipo incorrecto y es el modo de falla habitual cuando un paquete de fijación SDK se deriva del modelo de datos del nodo.

## Compresión y aceleración {#compression-and-acceleration}

Norito admite compresión explícita y adaptativa sin cambiar la carga útil lógica:

|Características |Propósito |
| --- | --- |
|`to_bytes` |Encode una carga útil no comprimida en el encabezado. |
|`to_compressed_bytes` |Encode con Zstd y graba la etiqueta de compresión en el encabezado. |
|`to_bytes_auto` |Aplicar heurísticas deterministas para decidir si la compresión vale la pena. |
|Aceleración CRC64 |Utiliza portable CRC64-XZ en todas partes, con CLMUL en x86_64 o PMULL en aarch64, cuando esté disponible. |
|GPU CRC64 y compresión|El metal opcional o los auxiliares CUDA pueden acelerar las grandes cargas útiles, y luego volver a caer en los caminos CPU. |

La aceleración del hardware nunca cambia el contenido decodificado. Los aceleradores CRC y JSON deben coincidir con los bits por bits de salida portátiles. Los bytes de marco Zstd pueden diferir entre los codificadores CPU y GPU, pero la carga útil decodificada y los metadatos de encabezado Norito siguen siendo deterministas para la validación.

## JSON Apoyo {#json-support}

Norito incluye una pila nativa JSON para puntos finales y herramientas que necesitan JSON sin salir del sistema de tipo Norito.

|La función JSON |Caso de uso |
| --- | --- |
|`norito::json::{to_json, from_json}` |Codificación/decodificación determinística de JSON. |
|Hermosas y ayudantes de escritores |CLI de salida, accesorios y la integración de transmisión `std::io`. |
|Los valores de DOM |La manipulación programática mediante el modelo de valor JSON de Norito. |
|Tipo rápido JSON |Decodificación/código basado en cintas estructurales para los caminos calientes DTO. |
|Lector de copia cero |El escaneo de tokens que toma prestadas las cadenas de la entrada cuando sea posible. |
|Aceleradores de etapa 1 |Indicación estructural opcional AVX2, NEON, Metal o CUDA con retroceso escalar. |

Iroha el código debe preferirse `norito::json` auxiliares para la tipografía API Cargas útiles. Adición de playa `serde_json` a las vías de producción los riesgos que divergen del esquema y el comportamiento de manejo en el campo esperados por SDKs y Torii los extractores.

## Apoyo derivado {#derive-support}

Los tipos de datos Rust generalmente utilizan macros derivados en lugar de código codec manual. La capa derivada puede generar códecs binarios Norito, esquemas y ayudantes JSON.

Los atributos de campo comunes son:

|El atributo |El efecto |
| --- | --- |
|`#[norito(rename = "other")]` |Utiliza un nombre serializado estable para el esquema y la compatibilidad JSON. |
|`#[norito(skip)]` |Omite el campo y lo llena de `Default` mientras se decodifica. |
|`#[norito(default)]` |Utiliza `Default` cuando una carga útil descifrada no lleva el campo. |
|`#[norito(skip_serializing_if = "...")]` |Elimina campos de JSON cuando el predicado coincide, mientras se conservan los valores predeterminados de decodificación. |

Los derivados también exponen sugerencias de longitud codificadas y cálculos de longitud exacta cuando sea posible.

## Familias de la caja {#crate-feature-families}

Cuando se construyan enlaces Iroha o SDK desde la fuente, las características de Norito seleccionan qué auxiliares y aceleradores están disponibles:

|Familias de características |¿ Qué permite ?|
| --- | --- |
|`derive` |Las macros de procedimiento reexportados para derivados binarios, esquemas y JSON. |
|`compression` |Zstd soporte para las cargas útiles con encabezado. |
|`packed-seq` |Disposiciones de la colección empaquetadas con tablas de compensación. |
|`packed-struct` |Los diseños de estructuras generados por derivados empaquetados.|
|`compact-len` |Varint prefijos de longitud por valor. |
|`columnar` |Bloques de columna Norito, códec de filas adaptativos AoS/NCB y vistas prestadas para caminos pesados en la exploración; incluidos en el conjunto predeterminado de características `node-codec`. |
|`strict-safe` |Convierte los pánicos de decodificación en caminos fallidos en errores estructurados. |
|`simd-accel` |CPU aceleración cuando esté disponible, con retroceso determinista. |
|`json` |Parser nativo JSON, escritor, DOM, derivaciones de tipografía y vías rápidas. |
|`json-std-io` |Auxiliadores de lectores y escritores en capas sobre la pila JSON. |
|`metal-stage1`, `cuda-stage1` |Los retrocesos de índice estructural GPU JSON son opcionales. |
|`metal-stage2` |Clasificación de metadatos metálicos opcionales para la cinta estructural JSON. |
|`metal-crc64`, `cuda-crc64` |Auxiliares opcionales GPU CRC64 para las grandes cargas útiles. |
|`gpu-compression` |Aceleración opcional de metal o CUDA Zstd para grandes cargas útiles. |
|`stage1-validate` |Validación de defecto que compara los índices estructurales JSON acelerados con la salida escalar. |

La disponibilidad de características puede diferir entre SDKs y perfiles de lanzamiento. El formato del cable sigue siendo regido por el encabezado y esquema, no por las banderas locales de construcción.

## Torii y Norito RPC {#torii-and-norito-rpc}

Torii expone JSON para muchas rutas de operador, pero las rutas binarias tipografizadas utilizan Norito. El tipo de medio para los cuerpos de corriente tipografizados Norito HTTP es `application/x-norito`.

Utilice estos encabezados cuando un punto final acepte o devuelva el tipo Norito:

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

Cuando un punto final admite ambas representaciones, los clientes pueden enviar una lista de preferencias explícita:

```http
Accept: application/x-norito, application/json
```

Las fallas de decodificación aparecen como errores de tipografía Torii y se cuentan por telemetría. Las razones comunes incluyen magia inválida, versión no soportada, bandera de características no soportadas, falta de coincidencia en la cantidad de checksum, error de formato UTF-8, etiqueta enum invalida y falta de coincisión en el esquema.

Norito RPC el transporte se selecciona a través de la configuración del transporte. los paneles de control del operador deben realizar un seguimiento de la latencia de las solicitudes, fallos conexiones activas, bytes de respuesta y `torii_norito_decode_failures_total` separadamente de JSON El tráfico.

## Norito Transmisiones en directo {#norito-streaming}

Norito La transmisión extiende el mismo enfoque determinista a los medios y las superficies de transporte en tiempo real.

|Función de transmisión |Propósito |
| --- | --- |
|Manifestos |Declarar los compromisos del segmento, las rutas de privacidad, las capacidades, el perfil del codec, la suite de cifrado y los metadatos clave del contenido. |
|Cabezas de segmentos |Enlace el número del segmento, duración, recuento de piezas, tiempo, modo entropía, resumen de audio y raíces Merkle. |
|Compromisos por piezas |Deje que los espectadores y relés verifiquen las piezas de carga útil contra el manifiesto antes de servir o decodificar. |
|Cuadrados de control |Llevar anuncios manifiestos, retroalimentación, actualizaciones clave y negociación de capacidad. |
|HPKE actualizaciones clave |Gira los secretos de transporte utilizando la suite negociada y contadores crecientes monotonicamente. |
|Negociación de la capacidad |Intercepta bits de características compatibles, límites de datagramas, cadencia de retroalimentación y requisitos de privacidad. |
|FEC y retroalimentación |Utiliza informes deterministas de receptores y decisiones de paridad para las vías en tiempo real de pérdida. |
|Vectores de conformidad |Los dispositivos interlinguísticos demuestran que SDKs decodifican los mismos manifestos, segmentos y flujos de entropía. |

Los códecs y perfiles de entropía específicos para la transmisión están separados del formato central Norito de transacción/ consulta, pero sus manifiestos y datos de control siguen utilizando Norito por lo que el enrutamiento, la facturación, la reproducción y las pruebas de auditoría permanecen reproducibles.

## Orientación de las operaciones {#operational-guidance}

- Se prefieren los constructores SDK y los enlaces generados a los bytes Norito hechos a mano.
- Trate la falta de coincidencia del esquema como un problema de versión o fijación, no como una falla transitoria de red.
- Mantenga `.nrt`, `.norito`, y manifieste los artefactos con el paquete de liberación o incidente que los produjo.
- Utilice las proyecciones JSON para los paneles de control y la inspección manual, pero mantenga Norito como fuente de verdad para los datos firmados, hashed o persistentes.
- Cuando se añada un nuevo punto final Torii de tipo, documentar si acepta JSON, Norito o ambos, y exponer los tipos de contenido soportados en `/openapi`.
- Al habilitar los aceleradores, ejecuta pruebas de paridad con la salida escalar antes del despliegue.

## Páginas relacionadas {#related-pages}

- [Puntos finales Torii](/es/reference/torii-endpoints.md)
- [Referencia de Génesis](/es/reference/genesis.md)
- [Esquema de modelo de datos ](/es/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK ](/es/guide/tutorials/javascript.md)
- [Python SDK ](/es/guide/tutorials/python.md)
- [Swift y iOS SDK](/es/guide/tutorials/swift.md)

## Referencias de aguas arriba {#upstream-references}

- [Especificación del formato Norito](https://github.com/hyperledger-iroha/iroha/blob/main/norito.md)
- [Cisterna Norito README ](https://github.com/hyperledger-iroha/iroha/blob/main/crates/norito/README.md)
