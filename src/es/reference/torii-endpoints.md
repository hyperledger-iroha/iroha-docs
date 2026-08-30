---
translation_locale: es
translation_source: /reference/torii-endpoints.md
translation_source_hash: 995701cfca9594b88a0da73a5b582c75c5962449a9ccf150e65738d3656d4f02
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii Puntos finales {#torii-endpoints}

Torii es el HTTP, SSE, y WebSocket puerta de entrada para Iroha 3. Se sirve tanto para el libro mayor APIs y los puntos finales del operador.

Las reglas actuales del protocolo son:

- el formato binario canónico es Norito
- muchos puntos finales también admiten JSON cuando envías `Accept: application/json`
- Las métricas se exponen en formato Prometheus.

Para los detalles del formato, la negociación de contenido, las banderas de diseño, hashes de esquemas y Norito RPC orientación, véase el [Norito referencias](/es/reference/norito.md).

## Los puntos finales comunes {#common-endpoints}

|Punto final |El formato |El propósito .|
| --- | --- | --- |
|`POST /v1/pipeline/transactions` |Norito |Enviar una transacción firmada |
|`POST /v1/query` |Norito |Envía una consulta firmada |
|`GET /v1/events/ws` |WebSocket |Suscribirse a los flujos de eventos |
|`GET /v1/events/sse` |SSE |Suscribirse a las transmisiones de eventos en SSE |
|`GET /v1/blocks/stream` |WebSocket |Flujo de bloques comprometidos |
|`GET /v1/peers` |JSON |Lista de pares expuestos por Torii |
|`GET /livez` |El texto |Sólo en el proceso de vida; no implica la preparación del protocolo |
|`GET /readyz` |JSON |Preparación completa de los nodos, incluidas las comprobaciones obligatorias de efectivo fuera de línea |
|`GET /health` |JSON |La sonda de preparación con la misma invariante fuera de línea en efectivo |
|`GET /v1/api/version` |El texto |La versión actual del encabezado de bloques |
|`GET /status` |Norito o JSON |Estatus de diagnóstico de alto nivel; solicitud explícita JSON |
|`GET /metrics` |Prometeo |Prometheus el punto final de raspado |
|`GET /v1/schema` |JSON |Impresión instantánea de esquema del modelo de datos que sirve el nodo cuando está habilitado |
|`GET /openapi` o `GET /openapi.json` |JSON |Documento OpenAPI para las rutas activas de Torii HTTP |
|`GET /v1/parameters` |JSON |Impresión de parámetros del nodo |
|`GET /v1/node/capabilities` |JSON |Capacidad de nodos y metadatos del modelo de datos |
|`GET /v1/time/now` |JSON |Imágenes del reloj de la pared del nodo |
|`GET /v1/time/status` |JSON |Estado de sincronización del tiempo |

En el caso de una solicitud SSE, anunciar la corriente nativa más un fallback tipado:

```http
Accept: text/event-stream, application/json
```

Torii en primer lugar negocia una JSON o Norito la representación en la capa de solicitud, luego valida el nativo `text/event-stream` Envío de respuesta. `text/event-stream` por lo tanto, se rechaza con: `406`; el [receta de eventos en línea](/es/cookbook/stream-events.md) usa el encabezado completo.

`/openapi` es el contrato generado primario para las rutas representadas en el esquema, No hay un inventario completo de la sonda operativa. `/livez` y `/readyz`, y su `/health` Descripción puede retrasar el manipulador de preparación. Generar clientes de ruta desde el documento en vivo, pero validar la vitalidad y preparación directamente contra el nodo en funcionamiento y los manipuladores fijados. La superficie exacta sigue dependiendo de las características de construcción y la configuración del tiempo de ejecución. [Torii API la consola](/es/reference/torii-api-console.md) para cargar ese documento en vivo, prueba JSON rutas, copia curl solicitudes, y generar el código del cliente desde el esquema actual.

## Prueba las rutas en vivo Taira {#try-live-taira-routes}

La red de prueba pública Taira expone la misma superficie Torii JSON que los clientes de aplicaciones utilizan para exploración solo en lectura. Estas órdenes no requieren claves:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS -H 'Accept: application/json' \
  "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

Prueba el recurso se lee en contra del estado mundial actual:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Si una ruta de testnet pública devuelve `502`, tiempo fuera, o informa una cola saturada, trate como un problema de disponibilidad del punto final y vuelva a intentarlo más tarde antes de desactivar su código cliente.

## Consenso y puntos finales del tiempo de ejecución {#consensus-and-runtime-endpoints}

|Punto final |El formato |Propósito .|
| --- | --- | --- |
|`GET /v1/sumeragi/commit-certificates` |JSON |Resúmenes recientes de los certificados de compromiso |
|`GET /v1/sumeragi/validator-sets` |JSON |Configuración de historial del validador |
|`GET /v1/sumeragi/validator-sets/{height}` |JSON |El validador fijado a una altura de bloque |
|`GET /v1/sumeragi/status` |Norito o JSON |Una instantánea detallada del estado del consenso |
|`GET /v1/sumeragi/status/sse` |SSE |Flujo continuo de estado de consenso |
|`GET /v1/sumeragi/leader` |JSON |Información actual sobre los líderes |
|`GET /v1/sumeragi/qc` |Norito o JSON |Último resumen del certificado de quórum |
|`GET /v1/sumeragi/checkpoints` |JSON |Resumen de los puntos de control del consenso |
|`GET /v1/sumeragi/consensus-keys` |JSON |Claves de consenso activas |
|`GET /v1/sumeragi/bls_keys` |JSON |Las claves de consenso activas BLS |
|`GET /v1/sumeragi/phases` |JSON |Más reciente muestra de latencia por fase |
|`GET /v1/sumeragi/rbc` |JSON |RBC métricas de sesiones y de rendimiento |
|`GET /v1/sumeragi/rbc/sessions` |JSON |Una instantánea activa de la sesión RBC |
|`GET /v1/sumeragi/pacemaker` |JSON |Estatus del marcapasos |
|`GET /v1/sumeragi/params` |JSON |Parámetros de corriente en cadena Sumeragi |
|`GET /v1/sumeragi/collectors` |JSON |Una instantánea del plan de colección determinista |
|`GET /v1/sumeragi/key-lifecycle` |JSON |Consenso sobre el estado del ciclo de vida clave |
|`GET /v1/sumeragi/telemetry` |JSON |Una instantánea de telemetría del consenso |
|`GET /v1/sumeragi/evidence` |JSON |Registros de pruebas, filtrados opcionalmente por cadena de consulta |
|`GET /v1/sumeragi/evidence/count` |JSON |El recuento de los registros de pruebas .|
|`POST /v1/sumeragi/evidence/submit` |JSON |Presentar pruebas de consenso |
|`GET /v1/sumeragi/commit_qc/{hash}` |Norito o JSON |Comprometer QC registro para un hash de bloque |
|`GET /v1/runtime/abi/active` |JSON |Descriptor de tiempo de ejecución activo ABI |
|`GET /v1/runtime/abi/hash` |JSON |El tiempo de ejecución activo ABI hash |
|`GET /v1/runtime/metrics` |JSON |Impresión instantánea de las métricas del tiempo de ejecución |
|`GET /v1/runtime/upgrades` |JSON |Lista de actualización del tiempo de ejecución |
|`POST /v1/runtime/upgrades/propose` |JSON |Proponemos una actualización del tiempo de ejecución |
|`POST /v1/runtime/upgrades/activate/{id}` |JSON |Activar una actualización del tiempo de ejecución propuesta |
|`POST /v1/runtime/upgrades/cancel/{id}` |JSON |Cancelar una actualización del tiempo de ejecución propuesta |

## App y SORA Familias de ruta {#app-and-sora-route-families}

¿Cuándo? Torii está construido con el conjunto de características orientadas a la aplicación, expone adicional JSON familias para exploradores, SORA Los servicios, los flujos de puentes, las pruebas y el almacenamiento.

`/openapi` describe las rutas registradas en el catálogo de aplicaciones generado-API; es autorizada para las entradas que contiene, no para todas las rutas montadas En particular, las rutas públicas locales SoraFS CID y conocidas están montadas fuera de ese documento generado y deben ser examinadas directamente.

|La familia de rutas |El propósito .|
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|`/v1/accounts/`, `/v1/domains/`, `/v1/assets/*` |JSON lee, ayuda a hacer consultas, ayuda de incorporación y visiones de cartera o titular |
|`/v1/nfts/`, `/v1/rwas/`, `/v1/confidential/*` |NFT, activos del mundo real y puntos de vista confidenciales de los activos |
|`/v1/aliases/`, `/v1/assets/aliases/`, `/v1/sns/`, `/v1/identifiers/` |Nombre, alias y resolución del identificador |
|`/v1/explorer/*` |Cuentas orientadas al explorador, activos, bloques, transacciones, instrucciones, métricas y visualizaciones de flujo |
|`/v1/transactions/`, `/v1/pipeline/`, `/v1/iso20022/*` |Historia de las transacciones, recuperación o estado de la tubería y ISO 20022 auxiliares |
|`/v1/contracts/*` |Código de contrato, despliegue, paquete, llamada, vista, evento, actividad, movilización y rutas del estado |
|`/v1/multisig/`, `/v1/controls/` |Propuestas multisig, aprobaciones y ayudantes de control de transferencias |
|`/v1/bridge/`, `/v1/ledger/`, `/v1/proofs/*` |Finalidad, prueba de estado, prueba de bloqueo, retención de pruebas y rutas de consulta de pruebas |
|`/v1/da/*` |Ingesta de datos, manifiestos, políticas de prueba, compromisos e intenciones definitivas |
|`/v1/zk/*` |ZK raíces, verificación de pruebas, prueba de IVM, conteo de votos, claves de verificación, registros de pruebas y anexos |
|`/v1/gov/`, `/v1/ministry/` |Propuestas de gobierno, boletas de voto, estado del consejo, espacios de nombres protegidos, propuestas de orden del día, promulgación y finalización.|
|`/v1/nexus/`, `/v1/sccp/` |Nexus carril, espacio de datos y ayudantes de prueba de cadena cruzada |
|`/v1/musubi/*` |Musubi lectores del registro de paquetes y constructores de instrucciones |
|`/v1/subscriptions/*` |Planes de suscripción, ciclo de vida de suscripciones, uso y cobro de ayudantes |
|`/v1/sorafs/`, `/sorafs/`, `/.well-known/sorafs/*` |SoraFS descubrimiento del proveedor, pruebas de capacidad, fijación, recogidas de almacenamiento y servicio de contenido público |
|`/v1/soracloud/`, `/v1/soradns/`, `/soradns/`, `/api/` |SoraCloud ciclo de vida del servicio, flujos de computación privada / modelo, descubrimiento público y enrutamiento de aplicaciones alojadas |
|`/v1/connect/`, `/v1/vpn/` | Iroha Conectar sesiones, WebSocket el transporte, VPN sesiones, perfiles y recibos                                         |
|`/v1/app-api/`, `/v1/api/`, `/v1/content/*` |Aplicación API enlaces y paquetes/enrutamiento de contenido respaldado por CID |
|`/v1/operator/*`, `/v1/mcp` |Autenticación de operador y puente nativo MCP JSON-RPC |
|`/v1/offline/`, `/v1/repo/`, `/v1/space-directory/`, `/v1/ram-lfe/` |Preparación fuera de línea, acuerdos de repositorios, manifiestos del espacio de datos y asistentes [RAM-LFE ](/es/blockchain/ram-lfe.md#torii-routes) |
|`/v1/kaigi/`, `/v1/webhooks/`, `/v1/notify/`, `/v1/telemetry/` |Colaboración, webhook, notificación push e integraciones en vivo de telemetría |

## Autenticación de cuentas, visibilidad y cursores del explorador {#account-authentication-visibility-and-explorer-cursors}

### Protocolo de solicitud de cuenta en la aplicación {#app-account-request-protocol}

Las rutas orientadas a las aplicaciones no aceptan encabezados de autenticación, una prueba directa de llave única o un testigo multisig.

Para una prueba directa, envíe los cuatro encabezados juntos:

- `X-Iroha-Account`: la letra pequeña canónica exacta `0x` hex de dirección de cuenta o un alias activo de cuenta canónica ASCII. El texto I105 no es seguro como valor del campo HTTP; utilice la ortografía canónica en hex para esa cuenta.
- `X-Iroha-Signature`: la carga útil estricta de la firma de base 64.
- `X-Iroha-Timestamp-Ms`: un sello de tiempo decimal Unix canónico sin firmar en milisegundos, dentro de la ventana de sesgo configurada.
- `X-Iroha-Nonce`: de 1 a 256 bytes imprimibles ASCII (`0x21` hasta `0x7e`), únicos en la ventana de reproducción.

El controlador registrado de una sola llave firma estos bytes exactos:

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

La construcción de consultas canónicas analiza la consulta en bruto como `application/x-www-form-urlencoded` (`+` significa espacio), por ciento-decodifica sus pares, las clasifica según `(key, value)` y los codifica nuevamente en forma. El protocolo admite como máximo 64 pares decodificados y 64 KiB de texto de consulta crudo. Hash los bytes del cuerpo exactamente como se transmite. No inserte un separador entre la red fija de 32 bytes ID y el método mayúscula.

El verificador V1 también limita el token del método a 32 bytes, la ruta de solicitud codificada en porcentaje a 64 KiB, y una identidad de cuenta directa a 36 KiB antes de analizar. Los alias de las cuentas tienen el límite estructural más estricto de tres segmentos de nombres más sus separadores.

Un controlador multisig debe enviar en su lugar `X-Iroha-Witness` como el estricto padded-base64 canónica Norito y omitir `X-Iroha-Signature`, `X-Iroha-Timestamp-Ms`, y `X-Iroha-Nonce`. `X-Iroha-Account` es opcional en esta forma; cuando esté presente, deberá ser igual al testigo `subject_account`. El Consejo `CanonicalRequestWitnessV1` contiene `schema_version`, `subject_account`, `timestamp_ms`, `nonce`, una Iroha `Hash` de la demanda de red exacta bytes a través de la digestión del cuerpo pero sin En la actualidad, cada uno de los miembros firma el documento canónico. Norito codificación de la misma carga útil sin el conjunto de firmas. los miembros verificados El testigo codificado tiene un límite de 1 MiB.

No proporcionar encabezados de autenticación selecciona el acceso anónimo. Proporcionar pruebas parciales, mezcladas, repetidas, malformadas, obsoletas o reproducidas falla en la autenticación; nunca vuelve a ser visible de forma anónima.

### Protocolo de solicitud del operador {#operator-request-protocol}

Las rutas marcadas como autenticadas por el operador requieren los cuatro encabezados de un solo elemento:

- `x-iroha-operator-public-key`: la clave pública multihash canónica de Iroha.
- `x-iroha-operator-timestamp-ms`: el sello de tiempo Unix decimal canónico sin firmar en milisegundos.
- `x-iroha-operator-nonce`: de 1 a 256 bytes imprimibles ASCII, únicos para esa tecla en la ventana de reproducción.
- `x-iroha-operator-signature`: la carga útil estricta de la firma de base 64.

Los valores de encabezado no deben contener espacio blanco circundante.

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

La ruta, la consulta, el cuerpo, el timestamp y las reglas nonce son las mismas reglas canónicas utilizadas por el protocolo de aplicación. La clave también debe ser admitida por `[torii.operator_signatures]`: enumerarla en `allowed_public_keys`, o habilitar explícitamente `allow_node_key` cuando se utiliza la clave del nodo. Cuando la caché de repetición está saturada, Torii rechaza la solicitud con `503 Service Unavailable`. La autenticación opcional WebAuthn o del operador mTLS es un factor adicional y nunca reemplaza esta firma exacta de solicitud.

Las rutas ISO 20022 aplican dos controles independientes. La solicitud debe pasar primero este protocolo de autorización y firma del operador; el manipulador ISO luego requiere la misma clave para ocupar el rol exacto de participante o auditoría descrito a continuación.

### La visibilidad del libro mayor y los cursores del explorador {#ledger-visibility-and-explorer-cursors}

Las lecturas en el libro mayor de aplicaciones utilizan el límite opcional de la cuenta de aplicación anterior. Una solicitud sin firmar solo recibe los centros de datos configurados como públicos. espacios de datos vinculados a la corriente UAID del solicitante, cada espacio de datos restringido nombrado con un permiso exacto `CanReadRestrictedDataspace { dataspace }`, o todas las rutas cuando la cuenta tiene `CanReadAllLedgerData`.

El mismo objeto de visibilidad filtra la cuenta, dominio, definición de activo, activo, NFT, RWA, titular y explorador. Un objeto ausente y un objeto que está fuera de las rutas visibles del llamador son intencionalmente indistinguibles. El historial de transacciones y instrucciones comprometidas solo se muestra cuando cada etapa de ruta registrada para la transacción es visible. por lo tanto, oculta cuando incluso una pierna del participante está fuera del alcance de la persona que llama; el contexto de enrutamiento faltante, obsoleto o malformado es visible solo para un lector global.

Las seis colecciones de Explorer respaldadas por el mundo utilizan cursores opacos del conjunto de teclas base64url canónicos. El límite predeterminado de página es 25, el máximo es 100, y una página inspecciona un máximo de 512 claves candidatas. Cada cursor está ligado a su colección, filtros, última tecla canónica y la digesta de ruta visible del llamador, por lo que no se puede reproducir en otra consulta o después de que cambie la visibilidad del llamador.

Bloqueo, transacción, última operación, instrucciones y historial de las últimas instrucciones los cursores también pin la altura de instantánea comprometida y bloquear hash. Respuestas exponen `pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor`, y `pagination.has_more`. Torii Rechaza un cursor para otra ruta o conjunto de filtros, una digestión cambiada de la visibilidad; o una instantánea que el nodo ya no puede validar. La exploración del historial permanece dentro Torii El permiso de admisión de la consulta mientras el trabajador bloquea corre.

Los flujos Explorer WebSocket emiten resúmenes filtrados y recomputan la visibilidad a medida que cambian los permisos del libro mayor. La ruta nativa `GET /v1/blocks/stream` es diferente: emite completa bloques firmados, requiere `CanReadAllLedgerData` durante el apretón de manos, y cierra si ese permiso se revoca posteriormente. No utilice la corriente nativa para un explorador escaneado por espacio de datos.

## Puente ISO 20022 {#iso-20022-bridge}

Torii expone el puente ISO 20022 debajo de `/v1/iso20022/*` cuando se habilitan la aplicación orientada a API y el tiempo de ejecución del puente. El puente tiene un alcance intencional: no es un gateway de compensación general ISO 20022 sino un subconjunto soportado para convertir los mensajes de pago seleccionados en transferencias firmadas Iroha y para rastrear su estado en el libro mayor.

Configurar un local duradero `torii.iso_bridge.store_dir` antes de admitir cualquier envío. El campo de configuración es opcional sólo para que un nodo pueda comenzar para uso solo de lectura o diagnóstico: Cada presentación autenticada ISO requiere el directorio, y devuelve retrievable `503 Service Unavailable` cuando la persistencia está ausente o una piedra tumba de repetición o un registro rico no se escribe.

### Endpoints ISO 20022 de Torii {#torii-iso-20022-endpoints}

| Método y endpoint | Propósito |
| --- | --- |
| `POST /v1/iso20022/pacs008` | Enviar una transferencia de crédito de cliente FI a FI y construir la transferencia de activos Iroha correspondiente |
| `POST /v1/iso20022/pacs009` | Enviar una transferencia de crédito FI a FI usada para PvP o financiación en efectivo relacionada con valores |
|`POST /v1/iso20022/pacs002` |Presentar un informe sobre el estado de pago propiedad de la contraparte; las necesidades de liquidación: pruebas de transacciones comprometidas |
|`POST /v1/iso20022/pacs004` |Presentar una declaración de pago propiedad de la contraparte |
|`POST /v1/iso20022/camt056` |Enviar una solicitud de cancelación del pago propiedad del originador |
| `POST /v1/iso20022/sese023` | Enviar una instrucción de liquidación de valores |
|`POST /v1/iso20022/sese024` |Enviar un mensaje sobre el estado de la liquidación de valores propiedad de la contraparte |
|`POST /v1/iso20022/sese025` |Presentar una confirmación de liquidación de valores propiedad de la contraparte |
| `POST /v1/iso20022/colr012` | Enviar un mensaje de sustitución de garantías |
| `GET /v1/iso20022/messages/{msg_id}` | Leer el registro canónico del puente para un mensaje |
| `GET /v1/iso20022/audit/messages` | Leer el manifiesto de auditoría de mensajes a prueba de manipulaciones |
| `GET /v1/iso20022/messages/{msg_id}/pacs002` | Generar el estado de pago actual como XML `pacs.002` |
| `GET /v1/iso20022/messages/{msg_id}/pacs004` | Generar la devolución de pago actual como XML `pacs.004` |
| `GET /v1/iso20022/messages/{msg_id}/camt029` | Generar la resolución de cancelación actual como XML `camt.029` |
| `GET /v1/iso20022/messages/{msg_id}/sese024` | Generar el estado de liquidación actual como XML `sese.024` |
| `GET /v1/iso20022/messages/{msg_id}/sese025` | Generar la confirmación de liquidación actual como XML `sese.025` |

Los envíos `pacs.008` deben incluir el ID del mensaje, el importe de
liquidación interbancaria, la moneda, la fecha de liquidación, los IBANs del
deudor y del acreedor y sus BICs. Cuando se configuran datos de referencia, el
puente también comprueba las correspondencias de BIC, IBAN y moneda ISO 4217
antes de que la transacción generada entre en la canalización.

Los envíos `pacs.009` deben incluir el ID del mensaje empresarial, el ID de
definición del mensaje, la hora de creación, el importe de liquidación
interbancaria, la moneda, la fecha de liquidación, los BICs de los agentes
instructor e instruido, y los IBANs del deudor y del acreedor. Si el mensaje
incluye `Purp`, el puente solo admite financiación destinada a valores:
`Purp=SECU`.

Los endpoints de envío `pacs.008` y `pacs.009` aceptan sobres XML ISO o el
formato de campos planos usado por las pruebas del puente. Los campos opcionales
`SplmtryData` pueden fijar el libro mayor Iroha de destino, los IDs o direcciones
de las cuentas de origen y destino y el ID de la definición de activo. La
respuesta es `202 Accepted` e incluye `message_id`, `transaction_hash`,
`status`, `pacs002_code` y el contexto resuelto del libro mayor, las cuentas y
el activo.

### Autorización y propiedad del ciclo de vida de los participantes {#participant-authorization-and-lifecycle-ownership}

Cada puente habilitado tiene un catálogo de participantes. Cada entrada de participante tiene un participante único ID, una o más claves públicas del operador, uno o más identificadores financieros, un conjunto de perfiles permitidos y el `originator`, `counterparty`, o ambas funciones. Las claves del operador y los identificadores financieros no pueden pertenecer a más de un participante. Configurar `audit_admin_keys` por separado; una clave de auditoría-admin tampoco puede ser una clave de mutación de participante.

Todas las rutas ISO requieren una nueva firma del operador. Para una presentación inicial de `pacs.008`, `pacs.009`, `sese.023` o `colr.012`, el operador autenticado debe pertenecer al participante identificado por la identidad financiera en el encabezado de la solicitud `From` . La identidad `To` debe resolverse a un participante configurado con el papel de `counterparty` y el perfil seleccionado debe permitirse para ambas partes. Los registros de admisión duradera registrarán el autor, la contraparte, la clave del participante y del operador admitidos, así como el perfil original y la política de firma integrada.

La autorización del ciclo de vida se deriva de ese registro inmutable y no de los valores seleccionados por el solicitante:

|Mensaje del ciclo de vida|Participante requerido |
| ---------------------------------------------- | -------------------------------------------------- |
|`pacs.002`, `pacs.004`, `sese.024`, `sese.025` |Contralor original con el papel de `counterparty` |
|`camt.056` |Originario con el papel de `originator` |

La política original de perfil y firma se mantiene fijada para todo el año el ciclo de vida, por lo que un solicitante no puede seleccionar un perfil más débil para una actualización. `pacs.002` código que representa la liquidación (`ACSC`, `ACCP`, `SETT`, o `SETTLED`) cambia el registro original a liquidado sólo cuando: Torii ha cometido pruebas de transacción.

Cualquiera de las partes originales puede leer sus registros de mensajes y los documentos generados en la bandeja de salida. El punto final de auditoría solo devuelve registros en los que el participante autenticado sea el autor o contraparte. Un administrador de auditoría configurado por separado recibe una vista global de auditoría única en lectura y no puede enviar ni cambiar mensajes. Los participantes desconocidos y los identificadores de mensajes no relacionados no se revelarán.

### Identidad de reproducción duradera y documentos de caja de salida firmados {#durable-replay-identity-and-signed-outbox-documents}

Las lápidas de repetición son el límite estricto de admisión. Torii aborta la inicialización para una lápide ilegible, sobredimensionada, malformada, con un nombre equivocado, conflictiva o explícitamente incompatible. También se aborta para un registro rico con una versión de esquema explícitamente incompatible, un participante, perfil o política de firma ausente de la configuración actual, o una lápida en vivo que falta o no coincide.

Otros daños en los registros ricos se manejan de manera diferente: archivos ilegibles o de gran tamaño, archivos inválidos JSON, archivos de esquemas actuales inválidos, nombres de archivos no canónicos y identidades de reproducción contradictorias se registran o omiten. Un índice de auditoría de la versión actual no legible o inválido se regenera a partir de los registros retenidos; sólo una versión del índice de auditoria explícitamente incompatible aborta el inicio. Monitorear los registros de inicio y reconciliar el manifiesto de auditoría regenerado en lugar de suponer que cada archivo corrupto de archivos ricos impide que el nodo se entregue.

Cada registro rico conservado mantiene la procedencia del participante inmutable. Una lápida duradera separada guarda el mensaje ID, hash de carga útil, mensaje de negocio ID y UETR para la deduplicación completa TTL incluso después de que se podan los detalles del registro rico.

Torii persiste en la admisión de reproducción antes de firmar o procesar un mensaje del ciclo de vida. Nunca despeja una identidad de reproducción sin vencimiento. Si la capacidad configurada se encuentra enteramente ocupada por registros protegidos o identidades de reproducción no expiradas, las presentaciones reciben un `503 Service Unavailable` retrievable sin mutar el ciclo de vida ni el estado contable.

Cada documento generado `pacs.002`, `pacs.004`, `camt.029`, `sese.024` o `sese.025` se devuelve como `application/xml` con los siguientes encabezados de respuesta:

|Cabezas .|El significado .|
| ------------------------------ | ----------------------------------------------------- |
|`X-Iroha-Iso-Signature-Domain` |Siempre `iroha.iso20022.outbound.v2` |
|`X-Iroha-Iso-Signer` |Clave pública canónica para la firma de puente configurada |
|`X-Iroha-Iso-Signature` |Firma Base64 en los bytes XML separados por dominio |

Verifique la firma sobre la secuencia de bytes UTF-8 `iroha.iso20022.outbound.v2`, un byte cero y el cuerpo exacto de respuesta. No reformate ni normalice el XML antes de la verificación.

### Apoyo adicional para el análisis y cartografía {#additional-parser-and-mapping-support}

El asistente IVM ISO también valida y materializa las siguientes familias de mensajes para la validación del sobre, el mapeo de asentamiento o la reconciliación en aguas posteriores. No tienen rutas independientes Torii.

|La familia de mensajes |Apoyo actual |
| --- | --- |
|`head.001` |Validación del encabezado de las aplicaciones empresariales para los sobres ISO, incluidos los campos `BizMsgIdr`, `MsgDefIdr`, tiempo de creación y remitente/receptor opcionales BIC |
|`pacs.007`, `pacs.028`, `pacs.029` |Reversión de pagos, solicitud de estado y resolución/análisis del estado de la investigación |
|`pain.001`, `pain.002` |Iniciación del pago de los clientes y validación del informe sobre el estado del pago |
|`camt.052`, `camt.053`, `camt.054` |Reporte de cuenta, declaración y validación de la notificación |

## Kaigi Sesiones {#kaigi-sessions}

Kaigi proporciona salas de audio / video en tiempo real y pagadas en SORA Nexus. Utilice cuando una aplicación necesita la creación de sesiones respaldadas por un libro mayor, cambios de lista, manifiestos de relevo, señalización cifrada y medición de uso en lugar de mantener todo el estado de conferencia fuera de cadena.

El ciclo de vida en el libro mayor es:

- `CreateKaigi`: crear una llamada bajo un dominio y almacenar su política, programación, metadatos y manifiesto de retransmisión opcional.
- `JoinKaigi` y `LeaveKaigi`: actualización de la lista de llamadas. En modo privado, los participantes utilizan compromisos, anuladores y pruebas de lista en lugar de exponer directamente la cuenta del participante IDs.
- `RecordKaigiUsage`: añadir la duración medida y el total de gases.
- `EndKaigi`: cerrar la sesión y grabar el sello de tiempo final.

Torii expone la telemetría de relé en el `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, y `/v1/kaigi/relays/events` cuando la aplicación API El estado de la sesión se refleja a través del Kaigi eventos de dominio tales como `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated`, y `KaigiUsageSummary`.

### Prueba de humo CLI {#cli-smoke-test}

Comience con el `iroha kaigi` CLI cuando desee verificar que un punto final Torii acepta las transacciones Kaigi antes de conectar un UI. El comando de arranque rápido crea una habitación temporal en contra del punto final activo Torii e imprime un resumen con el identificador de llamada, el comando de unión y la pista de bobina SoraNet:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

Para flujos scripted, gestione el ciclo de vida de la habitación explícitamente:

```bash
iroha kaigi create \
  --domain streaming \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha kaigi join --domain streaming --call-name daily --participant <i105-account-id>
iroha kaigi leave --domain streaming --call-name daily --participant <i105-account-id>

iroha kaigi record-usage \
  --domain streaming \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha kaigi end --domain streaming --call-name daily
```

Utilización `--room-policy public` para habitaciones que puedan ser expuestas por los relés sin boletos de visualización, o `--room-policy authenticated` cuando las salidas deben requerir autenticación del espectador. `--privacy-mode zk-roster-v1` sólo después de que la red tiene el Kaigi claves de verificación de lista y uso configuradas; en caso contrario, juntas, hojas, y los registros privados de uso fallan durante la verificación determinística.

### Pruebas con el JavaScript Demo {#testing-with-the-javascript-demo}

Utiliza la demostración de escritorio [soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) para una prueba de billetera de extremo a extremo. La demostración es una aplicación Electron y Vue que habla directamente con Torii a través del enlace local `@iroha/iroha-js` e incluye una ruta `/kaigi` para medios nativos de un navegador uno a uno.

Utilice la demostración con [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) desde el repositorio fuente de Iroha. Los pines de demostración del SDK a través de `file:../iroha/javascript/iroha_js`, así que mantenga ambos cheques en este diseño hermano:

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

Utilice Node.js 20 o más recientes y una cadena de herramientas Rust para que el módulo nativo `iroha_js_host` pueda construir. Reconstruya el SDK en la caja hermana Iroha después de cambiar su fuente; el diseño del paquete limpio no contiene el espacio de trabajo Cargo necesario por `npm run build:native`.

Para un ensayo controlado, apunte la demostración a un punto final Kaigi capaz de Torii:

1. Inicie un nodo Iroha con la aplicación SORA/Kaigi orientada a APIs habilitada, o use un punto final público que exponga las superficies Kaigi que necesita.
2. Compruebe la accesibilidad básica con `/health`, luego compruebe la superficie de ruta en vivo con `/openapi` o `/openapi.json`. Algunos despliegues también exponen a `/v1/health`, pero `/health` es el control de vida portátil.
3. Para TAIRA, verifique las rutas de telemetría del relay antes de probar una reunión en vivo:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

Estos controles demuestran que la telemetría de retransmisión Torii y Kaigi es accesible. No crean una reunión; `CreateKaigi` y `JoinKaigi` todavía necesitan carteras financiadas y presentación firmada de transacciones.
4. Abrir la demostración, ir a Configuraciones, establecer el Torii URL, y dejar que la aplicación cargue la cadena ID y prefijo de red desde el punto final.
5. Crear o restaurar dos carteras locales en la demostración. Utilice ventanas de aplicaciones, perfiles o máquinas separadas para que el anfitrión y el invitado tengan estado de cartera separado.

Para probar el Kaigi UI:

1. En la ventana host, abra Kaigi, seleccione Inicio de reunión, establece un título y seleccione Invitación privada o Invitación transparente.
2. Seleccione encender la cámara y el micrófono para que WebRTC tenga medios locales.
3. Seleccione Crear enlace de reunión. Una billetera en vivo envía `CreateKaigi`; la aplicación muestra luego una invitación `iroha://kaigi/join?call=...&secret=...` y una ruta de retroceso `#/kaigi?...`.
4. Mantenga abierta la ventana del anfitrión y comparta la invitación con el invitado.
5. En la ventana de invitados, abra la invitación o pégalo en reunión de Join, activa los medios locales y seleccione Join meeting. Una billetera en vivo recoge la oferta del anfitrión cifrada desde Torii y envía `JoinKaigi` con metadatos de respuesta cifrados.
6. El anfitrión debe aplicar automáticamente la primera respuesta mediante transmisión o encuesta de señales de llamada Kaigi. Ambas ventanas deben mostrar medios conectados y detalles actualizados de conexión.
7. Terminar la sesión desde el anfitrión, o utilizar el comando CLI `iroha kaigi end` para la misma llamada ID.

Propiedad privada Kaigi Necesidades protegidas XOR Si la demostración informa que el Kaigi Necesidades protegidas XOR, Utilice el prompt de autoescrito en la aplicación y vuelva a intentar la acción crear o unirse. Si la generación de pruebas, la financiación privada o la señalización en vivo no están disponibles, la demostración puede volver a un flujo transparente / manual. En ese caso, abra la señalización avanzada, copia el paquete de ofertas o respuestas en bruto y pega en la otra ventana.

Para las comprobaciones automáticas en el repositorio demo, ejecuta:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

La cubierta de las suites Vitest enfocada Kaigi Creación de enlaces para reuniones, carga de invitaciones compactas, creación/junta/finalización privada Las llamadas de puente, las instrucciones de auto-escudo, fallbacks manuales y encuestas de respuesta. UI la prueba de humo incluye el `/kaigi` Los medios en vivo entre dos carteras todavía necesitan una prueba manual de dos ventanas porque el navegador Los permisos de cámara/micrófono y los flujos de medios entre pares son específicos del medio ambiente.

Para el código de integración de la muestra, véase [Embed Kaigi en una aplicación JavaScript ](/es/guide/tutorials/kaigi.md).

## Estatus y métricas {#status-and-metrics}

Los puntos finales del estado y las métricas son las primeras cosas que se incorporan a los paneles de control:

- `/status` expone los campos de pares, bloques, filas y consenso de nivel superior
- `/metrics` expone los contadores, medidores y histogramas Prometheus.

En los nodos habilitados para Nexus, la salida de estado también incluye las secciones de carril y conocimiento del espacio de datos. Cuando `nexus.enabled = false`, esas secciones se omiten.

## JSON frente a Norito {#json-vs-norito}

Varios puntos finales del operador devuelven Norito por defecto. Cuando el punto final soporte JSON, envíe:

```http
Accept: application/json
```

Esto es especialmente útil para:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

Cuando un punto final acepta o devuelve el tipo Norito directamente, uso `application/x-norito` como tipo de contenido o preferido `Accept` el valor. Véase [Norito](/es/reference/norito.md#torii-and-norito-rpc) para los detalles de transporte.

## Perfiles de telemetría {#telemetry-profiles}

La visibilidad del punto final depende de la configuración `telemetry.profile` del nodo. La configuración actual expone cinco niveles de perfil:

|Profiles |`/status` |`/metrics` |Rutas de desarrollo |
| --- | --- | --- | --- |
|`disabled` |No , no .|No , no .|No , no .|
|`operator` |¿ Qué es eso ?|No , no .|No , no .|
|`extended` |¿ Qué es eso ?|¿ Qué es eso ?|No , no .|
|`developer` |¿ Qué es eso ?|No , no .|¿ Qué es eso ?|
|`full` |¿ Qué es eso ?|¿ Qué es eso ?|¿ Qué es eso ?|

## CLI Acortajes {#cli-shortcuts}

El `iroha` CLI ya incluye muchos de estos puntos finales:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## Referencias de aguas arriba {#upstream-references}

- [README API y una descripción general de la observabilidad ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO Implementación del puente 20022](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [Desempleo y métricas ](/es/guide/advanced/metrics.md)
