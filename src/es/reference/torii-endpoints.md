---
translation_locale: es
translation_source: /reference/torii-endpoints.md
translation_source_hash: f04e5e78329996d70926c4fd5dc034d41605d0a82fffd6460f67b252269480d9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Torii API puntos finales {#torii-endpoints}

Torii es la puerta de enlace HTTP, SSE y WebSocket para Iroha 3. Sirve tanto a los endpoints APIs orientados al libro mayor como a los endpoints API del operador.

Las reglas actuales del protocolo son:

- el formato binario canónico es Norito
- muchos puntos finales API también admiten JSON cuando envías `Accept: application/json`
- las métricas se exponen en formato Prometheus

Para detalles del formato, negociación de contenido, indicadores de diseño, hashes criptográficos del esquema y la guía Norito RPC, consulte el [Norito referencia](/es/reference/norito.md).

## Puntos finales comunes API {#common-endpoints}

| API punto final                         |Formato|Propósito|
| -------------------------------- | -------------- | ---------------------------------------------------------------- |
| `POST /v1/pipeline/transactions` | Norito         |Enviar una transacción firmada|
| `POST /v1/query`                 | Norito         |Enviar una consulta firmada|
| `GET /v1/events/ws`              | WebSocket      |Suscribirse a flujos de eventos|
| `GET /v1/events/sse`             | SSE            |Suscribirse a flujos de eventos en SSE|
| `GET /v1/blocks/stream`          | WebSocket      |Transmitir bloques comprometidos|
| `GET /v1/peers`                  | JSON           |lista de pares de red expuesta por Torii|
| `GET /livez`                     |Texto|Solo vitalidad del proceso; no implica preparación del protocolo|
| `GET /readyz`                    | JSON           |Completa la preparación del nodo, incluyendo las verificaciones obligatorias de efectivo fuera de línea|
| `GET /health`                    | JSON           |Sonda de preparación con la misma invariante de efectivo fuera de línea|
| `GET /v1/api/version`            |Texto|Versión actual del encabezado de bloque|
| `GET /status`                    | Norito o JSON |Estado de diagnóstico de alto nivel; solicitud JSON explícitamente|
| `GET /metrics`                   |Prometeo|Punto de enlace de recopilación de Prometheus API|
| `GET /v1/schema`                 | JSON           |Vista de datos puntuales del esquema del modelo de datos servida por el nodo cuando está habilitada|
| `GET /openapi.json`              | JSON           | OpenAPI documento para las Torii HTTP rutas activas                |
| `GET /v1/parameters`             |JSON           |Vista de datos de parámetro de nodo en un punto en el tiempo|
| `GET /v1/node/capabilities`      | JSON           |Capacidad del nodo y metadatos del modelo de datos|
| `GET /v1/time/now`               | JSON           |Vista de datos de punto en el tiempo del reloj de pared del nodo|
| `GET /v1/time/status`            | JSON           |Estado de sincronización de tiempo|

Para una solicitud SSE, anuncie la transmisión nativa más una alternativa escrita:

```http
Accept: text/event-stream, application/json
```

Torii primero negocia una representación JSON o Norito en la capa de solicitud, luego valida la respuesta nativa `text/event-stream`. Enviar solo `text/event-stream` por lo tanto se rechaza con `406`; el [receta de eventos en streaming](/es/cookbook/stream-events.md) utiliza el encabezado completo.

`/openapi.json` es el contrato generado para las rutas representadas en el esquema, no un inventario completo de sondeo operativo. El documento actual omite `/livez` y `/readyz`, y su descripción de `/health` puede retrasar al manejador de disponibilidad. Genera clientes de ruta a partir del documento en vivo, pero valida la vigencia y la disponibilidad directamente contra el nodo en ejecución y los controladores fijados. La superficie exacta todavía depende de la compilación funciones y configuración de ejecución del software. Use el [Torii API consola](/es/reference/torii-api-console.md) para cargar ese documento en vivo, probar rutas JSON, copiar solicitudes curl y generar código cliente a partir del esquema actual.

Cada operación respaldada por catálogo OpenAPI incluye un objeto `x-iroha-route-auth`. Las herramientas respaldadas por catálogo MCP exponen el mismo contrato que `_meta["iroha/routeAuth"]`. Ambas proyecciones llevan `schemaVersion`, `stableRouteId`, `authentication` y `admission`. Trate la versión `1` como un contrato exacto: rechace un `schemaVersion` no compatible en lugar de adivinar cómo deberían interpretarse sus etiquetas de autenticación o admisión. Los metadatos de la ruta describen el límite de la solicitud; no reemplazan las credenciales requeridas por ese límite.

## Probar rutas en vivo Taira {#try-live-taira-routes}

La testnet pública Taira expone la misma superficie Torii JSON que los clientes de la aplicación utilizan para la exploración de solo lectura. Estos comandos no requieren claves:

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

Prueba lecturas de recursos contra el estado actual del mundo:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Si una ruta de testnet pública devuelve `502`, se agota el tiempo de espera o informa de una cola saturada, trátela como un problema de disponibilidad del endpoint API y vuelva a intentarlo más tarde antes de depurar el código de su cliente.

## Puntos finales de consenso y tiempo de ejecución de software API {#consensus-and-runtime-endpoints}

Cada ruta Sumeragi a continuación requiere la firma de solicitud del operador. Las rutas de estado, diagnóstico, flujo, líder, clave, QC y parámetro también requieren una compilación con telemetría activada.

| API endpoint                                  |Formato|Propósito|
| ----------------------------------------- | -------------- | ------------------------------------------------------- |
| `GET /v1/sumeragi/status`                 | Norito o JSON |Estado de consenso autorizado por el reductor|
| `GET /v1/sumeragi/diagnostics`            | JSON           |Diagnósticos de canal de ejecución, cola y pipeline de procesamiento no autoritativos|
| `GET /v1/sumeragi/status/sse`             | SSE            |Flujo continuo de estado de consenso autoritario|
| `GET /v1/sumeragi/leader`                 | JSON           |Información del líder actual|
| `GET /v1/sumeragi/qc`                     | Norito o JSON | Vistas de datos en el punto en el tiempo del certificado de quórum más alto y bloqueado |
| `GET /v1/sumeragi/consensus-keys`         | JSON           |Claves de consenso activas|
| `GET /v1/sumeragi/bls-keys`               | JSON           | Claves de consenso activas BLS |
| `GET /v1/sumeragi/params`                 | JSON           |Parámetros actuales en cadena Sumeragi|
| `GET /v1/sumeragi/evidence`               | JSON           |Registros de evidencia, opcionalmente filtrados por cadena de consulta|
| `GET /v1/sumeragi/evidence/count`         | JSON           |Conteo de registros de evidencia|
| `GET /v1/runtime/abi/active`              | JSON           |Descriptor de tiempo de ejecución de software activo ABI|
| `GET /v1/runtime/abi/hash`                | JSON           |Tiempo de ejecución de software activo ABI hash criptográfico|
| `GET /v1/runtime/metrics`                 | JSON           |vista de datos de métricas de tiempo de ejecución de software en un momento específico|
| `GET /v1/runtime/upgrades`                | JSON           |lista de actualizaciones de tiempo de ejecución de software|
| `POST /v1/runtime/upgrades/propose`       | JSON           |Proponer una actualización del tiempo de ejecución del software|
| `POST /v1/runtime/upgrades/activate/{id}` | JSON           |Activar una propuesta de actualización del tiempo de ejecución del software|
| `POST /v1/runtime/upgrades/cancel/{id}`   | JSON           |Cancelar una actualización propuesta del tiempo de ejecución del software|

## Aplicación y Familias de Rutas SORA {#app-and-sora-route-families}

Cuando Torii se construye con el conjunto de funciones orientadas a la aplicación, expone familias adicionales de JSON para exploradores, servicios SORA, flujos de puente, pruebas y almacenamiento. No todas estas familias están habilitadas en cada perfil de red.

`/openapi.json` describe las rutas registradas en el catálogo de la aplicación generada-API; es autoritativo para las entradas que contiene, no para cada ruta montada por el proceso. En particular, las rutas locales públicas SoraFS CID y bien conocidas se montan fuera de ese documento generado y deben ser examinadas directamente.

|Familia de rutas|Propósito|
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*`                         | JSON lecturas, asistentes de consultas, asistentes de incorporación y vistas de portafolio o titular|
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*`                          |NFT, vistas de activos del mundo real y activos confidenciales|
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` |Resolución de nombre, alias e identificador|
| `/v1/explorer/*`                                                          |Vistas de cuenta, activo, bloque, transacción, instrucción, métrica y flujo orientadas al explorador|
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*`                  |Historial de transacciones, recuperación o estado del flujo de procesamiento, y ayudantes ISO 20022|
| `/v1/contracts/*`                                                         |Código de contrato, desplegar, empaquetar, llamar, ver, evento, actividad, rollup y rutas de estado|
| `/v1/multisig/*`, `/v1/controls/*`                                        |Propuestas multisig, aprobaciones y ayudas de control de transferencias|
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*`                            |Finalidad, prueba de estado, prueba de bloque, retención de prueba y rutas de consulta de prueba|
| `/v1/da/*`                                                                |Ingesta de disponibilidad de datos, manifiestos técnicos, políticas de prueba, compromisos e intenciones de fijación|
| `/v1/zk/*`                                                                | ZK raíces, verificación de pruebas, IVM demostración, conteo de votos, claves de verificación, registros de pruebas y archivos adjuntos |
| `/v1/gov/*`, `/v1/ministry/*`                                             |Propuestas de gobernanza, votaciones, estado del consejo, espacios de nombres protegidos, propuestas de agenda, promulgación y finalización|
| `/v1/nexus/*`, `/v1/sccp/*`                                               | Nexus carril de ejecución, espacio de datos y auxiliares de prueba entre cadenas|
| `/v1/musubi/*`                                                            |Musubi lecturas del registro de paquetes y constructores de instrucciones|
| `/v1/subscriptions/*`                                                     |Planes de suscripción, ciclo de vida de la suscripción, uso y asistentes de cobro|
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*`                      | SoraFS descubrimiento de proveedores, pruebas de capacidad, fijación, recuperación de almacenamiento y servicio de contenido público|
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*`                | SoraCloud ciclo de vida del servicio, flujos privados de cálculo/modelo, descubrimiento público y enrutamiento de aplicaciones alojadas|
| `/v1/connect/*`, `/v1/vpn/*`                                              |Iroha Conectar sesiones, WebSocket transporte, VPN sesiones, perfiles y registros de resultados de protocolo|
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*`                             |Vinculaciones de la aplicación API y enrutamiento de contenido respaldado por bundle/CID|
| `/v1/operator/*`, `/v1/mcp`                                               |Autenticación del operador y puente nativo MCP JSON-RPC|
| `/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*`   |Preparación sin conexión, acuerdos de repositorio, manifiestos técnicos del espacio de datos y [RAM-LFE ayudantes](/es/blockchain/ram-lfe.md#torii-routes)|
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*`        |Colaboración, webhook, notificación push e integraciones de telemetría en vivo|

## Autenticación de cuenta, visibilidad y cursores del explorador {#account-authentication-visibility-and-explorer-cursors}

### Protocolo de Solicitud de Cuenta de la Aplicación {#app-account-request-protocol}

Las rutas orientadas a la aplicación aceptan ya sea ningún encabezado de autenticación, una prueba directa de clave única o un testigo multisig. Cada encabezado de autenticación debe aparecer como máximo una vez.

Para una prueba directa, envía los cuatro encabezados juntos:

- `X-Iroha-Account`: la dirección de cuenta hexadecimal en minúsculas canónica exacta `0x` o un alias de cuenta canónica activo ASCII. I105 el texto no es seguro como valor de campo HTTP; use la ortografía hexadecimal canónica para esa cuenta.
- `X-Iroha-Signature`: la carga útil de firma en base64 con relleno estricto.
- `X-Iroha-Timestamp-Ms`: un sello de tiempo Unix decimal sin signo canónico en milisegundos, dentro de la ventana de desviación configurada.
- `X-Iroha-Nonce`: 1 a 256 bytes imprimibles ASCII (`0x21` hasta `0x7e`), únicos dentro de la ventana de repetición.

El controlador de tecla única registrado firma estos bytes exactos:

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

La construcción de consultas canónicas analiza la consulta en bruto como `application/x-www-form-urlencoded` (`+` significa espacio), decodifica por porcentaje sus pares, los ordena por `(key, value)` y los codifica en formulario nuevamente. El protocolo admite como máximo 64 pares decodificados y 64 KiB de texto de consulta en bruto. Haga un hash criptográfico de los bytes del cuerpo exactamente como se transmitieron. No inserte un separador entre el ID de red fijo de 32 bytes y el método en mayúsculas.

El verificador V1 también limita el token del método a 32 bytes, la ruta de solicitud codificada en porcentaje a 64 KiB, y una identidad de cuenta directa a 36 KiB antes de analizar. Los alias de cuenta tienen el límite estructural más estricto de tres segmentos de nombre más sus separadores. Exceder un límite provoca un fallo de autenticación antes de la verificación de la firma o la asignación del tamaño de origen.

Un controlador multisig debe enviar en su lugar `X-Iroha-Witness` como Norito canónico en base64 relleno estricto y omitir `X-Iroha-Signature`, `X-Iroha-Timestamp-Ms` y `X-Iroha-Nonce`. `X-Iroha-Account` es opcional en esta forma; cuando esté presente, debe ser igual al testigo `subject_account`. El `CanonicalRequestWitnessV1` contiene `schema_version`, `subject_account`, `timestamp_ms`, `nonce`, un Iroha `Hash` de los bytes de solicitud de la red exacta a través del valor del resumen criptográfico del cuerpo pero sin campos de frescura, y como máximo 64 firmas de miembros. Cada miembro firma la codificación canónica Norito de esa misma carga útil sin el arreglo de firmas. Los miembros verificados deben cumplir con la política multisig actual de la cuenta. El testigo codificado está limitado a 1 MiB.

No proporcionar encabezados de autenticación selecciona el acceso anónimo. Proporcionar cualquier prueba parcial, mezclada, repetida, malformada, obsoleta o reproducida falla en la autenticación; nunca vuelve a la visibilidad anónima.

### Protocolo de Solicitud del Operador {#operator-request-protocol}

Las rutas marcadas como autenticadas por el operador requieren los cuatro encabezados singleton:

- `x-iroha-operator-public-key`: la clave pública multihash Iroha canónica.
- `x-iroha-operator-timestamp-ms`: la marca de tiempo Unix decimal canónica sin signo en milisegundos.
- `x-iroha-operator-nonce`: 1 a 256 bytes imprimibles ASCII, únicos para esa clave dentro de la ventana de reproducción.
- `x-iroha-operator-signature`: la carga útil de firma en base64 con relleno estricto.

Los valores del encabezado no deben contener espacios en blanco alrededor. Los signos de clave del operador:

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

Las reglas para la ruta, la consulta, el cuerpo, la marca de tiempo y el valor nonce criptográfico son las mismas reglas canónicas utilizadas por el protocolo de la aplicación. La clave también debe ser admitida por `[torii.operator_signatures]`: inclúyala en `allowed_public_keys`, o habilite explícitamente `allow_node_key` al usar la clave del nodo. La saturación de la caché de repetición falla cerrada con `503 Service Unavailable`.

La firma exacta de la solicitud es siempre obligatoria. Cuando `[torii.operator_auth].enabled = true`, cada ruta de operador ordinario también requiere un `x-iroha-operator-session` válido; cuando `require_mtls = true`, además requiere `x-forwarded-client-cert` de un ingreso confiable. Ningún factor reemplaza la firma de la solicitud.

WebAuthn la inscripción y el inicio de sesión usan estos cuatro JSON API endpoints:

|Método y endpoint API|Propósito|
| --------------------------------------------- | ---------------------------------------- |
| `POST /v1/operator/auth/registration/options` |Comenzar la inscripción de credenciales WebAuthn|
| `POST /v1/operator/auth/registration/verify`  |Verificar y guardar la credencial|
| `POST /v1/operator/auth/login/options`        |Iniciar autenticación WebAuthn|
| `POST /v1/operator/auth/login/verify`         |Verifique la afirmación y emita una sesión|

Configure `torii.operator_auth.tokens` con valores de arranque dedicados. Antes de que exista cualquier credencial, envíe uno como `x-iroha-operator-token` para iniciar el primer registro. Ese token nunca autoriza una ruta de operador ordinaria, y los valores del receptor `x-api-token` nunca se reutilizan para este flujo. Una vez que existe una credencial, inscribir otra credencial requiere una sesión autenticada. La verificación de inicio de sesión devuelve el token de sesión para enviarlo junto con cada nueva firma de solicitud del operador exacto de la red. Las credenciales persisten bajo `<torii.data_dir>/operator_auth/operator_webauthn.json`.

ISO 20022 rutas aplican dos verificaciones independientes. La solicitud primero debe pasar esta lista de operadores permitidos y el protocolo de firma; el manejador ISO luego requiere que la misma clave ocupe el rol exacto de participante o auditor descrito a continuación.

### Visibilidad del libro mayor de blockchain y cursores del explorador {#ledger-visibility-and-explorer-cursors}

Las lecturas del libro mayor de blockchain dirigidas a la aplicación utilizan el límite opcional de cuenta de la aplicación mencionado arriba. Una solicitud no firmada recibe solo los espacios de datos configurados como públicos. Una solicitud firmada válida agrega espacios de datos vinculados al UAID actual del llamador, cada espacio de datos restringido nombrado por un permiso exacto `CanReadRestrictedDataspace { dataspace }`, o todas las rutas cuando la cuenta tiene `CanReadAllLedgerData`.

Utilice la ruta que coincida con el principal de autorización del llamante:

|Método y endpoint API|Autenticación y visibilidad|
| ------------------------------------- | --------------------------------------------------------------- |
| `POST /v1/transactions/visible/query` |Firma de cuenta canónica; aplica la visibilidad del llamador|
| `POST /v1/transactions/query`         |Firma de solicitud del operador; permite la vista global del operador|
| `GET /v1/triggers/completed`          |Firma de solicitud del operador; lee los registros de finalización locales del nodo|

El mismo objeto de visibilidad filtra cuenta, dominio, definición de activo, activo, NFT, RWA, titular y lecturas del Explorador. Un objeto ausente y un objeto que está fuera de las rutas visibles del llamante son intencionalmente indistinguibles. El historial de transacciones comprometidas e instrucciones se muestra solo cuando cada tramo de ruta registrado para la transacción es visible. Una transacción de espacio de datos mixto es por lo tanto, oculto cuando incluso un tramo del participante está fuera del alcance del llamador; el contexto de enrutamiento faltante, obsoleto o malformado es visible solo para un lector global.

Las seis colecciones Explorer respaldadas por el mundo usan cursores de conjuntos de claves canónicas base64url opacas. El límite de página predeterminado es 25, el máximo es 100, y una página inspecciona como máximo 512 claves candidatas. Cada cursor está vinculado a su colección, filtros, clave última canónica y al valor de resumen criptográfico del conjunto de rutas visibles del llamador, por lo que no puede reproducirse en otra consulta ni después de que cambie la visibilidad del llamador.

Los cursores de historial de bloque, transacción, última transacción, instrucción y última instrucción además fijan la altura de la vista de datos del punto en el tiempo comprometido y el hash criptográfico del bloque. Las respuestas exponen `pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor` y `pagination.has_more`. Un cursor para otra ruta o conjunto de filtros, un valor de resumen criptográfico de visibilidad cambiado, o una vista de datos en un momento determinado que el nodo ya no puede validar falla de manera cerrada. La exploración del historial permanece dentro del permiso de admisión de consultas de Torii mientras el trabajador bloqueante se ejecuta.

Los flujos de Explorer WebSocket emiten resúmenes filtrados y recalculan la visibilidad a medida que cambian los permisos del libro mayor de la blockchain. La ruta nativa `GET /v1/blocks/stream` es diferente: emite bloques completos firmados, requiere `CanReadAllLedgerData` durante el intercambio de saludos y se cierra si ese permiso se revoca más tarde. No utilice el flujo nativo para un explorador limitado al espacio de datos.

## ISO Puente 20022 {#iso-20022-bridge}

Torii expone el puente ISO 20022 bajo `/v1/iso20022/*` cuando la API orientada a la aplicación y el tiempo de ejecución del software del puente están activados. El puente está intencionalmente limitado: no es una pasarela de compensación ISO 20022 de propósito general, sino un subconjunto compatible para convertir mensajes de pago seleccionados en transferencias Iroha firmadas y para rastrear su estado en el libro mayor de la blockchain.

Configure un `torii.iso_bridge.store_dir` local duradero antes de aceptar cualquier envío. El campo de configuración es opcional solo para que un nodo pueda iniciarse en modo de solo lectura o de uso diagnóstico: Cada envío autenticado ISO requiere el directorio y devuelve `503 Service Unavailable` que se puede reintentar cuando la persistencia está ausente o falla una escritura de replay-tombstone o rich-record.

### Torii ISO 20022 API puntos finales {#torii-iso-20022-endpoints}

|Método y endpoint API|Propósito|
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `POST /v1/iso20022/pacs008`                  |Envíe una transferencia de crédito al cliente de FI a FI y genere la transferencia de activo coincidente de Iroha|
| `POST /v1/iso20022/pacs009`                  |Enviar una transferencia de crédito de FI a FI utilizada para PvP o financiación en efectivo relacionada con valores|
| `POST /v1/iso20022/pacs002`                  |Envíe un informe de estado de pagos propiedad de la contraparte; la liquidación requiere evidencia de transacciones comprometidas|
| `POST /v1/iso20022/pacs004`                  |Enviar una devolución de pago propiedad de la contraparte|
| `POST /v1/iso20022/camt056`                  |Enviar una solicitud de cancelación de pago propiedad del originador|
| `POST /v1/iso20022/sese023`                  |Enviar una instrucción de liquidación de valores|
| `POST /v1/iso20022/sese024`                  |Enviar un mensaje de estado de liquidación de valores propiedad de la contraparte|
| `POST /v1/iso20022/sese025`                  |Enviar una confirmación de liquidación de valores propiedad de la contraparte|
| `POST /v1/iso20022/colr012`                  |Enviar un mensaje de sustitución de garantía|
|`GET /v1/iso20022/messages/{msg_id}`|Lea el registro de puente canónico para un mensaje|
|`GET /v1/iso20022/audit/messages`            |Lea el manifiesto técnico de auditoría de mensajes a prueba de manipulaciones|
| `GET /v1/iso20022/messages/{msg_id}/pacs002` |Representar el estado de pago actual como `pacs.002` XML|
| `GET /v1/iso20022/messages/{msg_id}/pacs004` |Representar la devolución de pago actual como `pacs.004` XML|
| `GET /v1/iso20022/messages/{msg_id}/camt029` |Representar la resolución de cancelación actual como `camt.029` XML|
| `GET /v1/iso20022/messages/{msg_id}/sese024` |Representar el estado actual de la liquidación como `sese.024` XML|
| `GET /v1/iso20022/messages/{msg_id}/sese025` |Representar la confirmación de liquidación actual como `sese.025` XML|

Las presentaciones `pacs.008` deben proporcionar el ID del mensaje, el monto de liquidación interbancaria, la moneda, la fecha de liquidación, el deudor y el acreedor IBANs, y el deudor y el acreedor BICs. Cuando se configuran los datos de referencia, el puente también verifica los cruces de moneda 4217 BIC, IBAN y ISO antes de que la transacción generada ingrese al flujo de procesamiento.

`pacs.009` las presentaciones deben proporcionar el ID del mensaje de negocio, el ID de definición del mensaje, la hora de creación, el monto de la liquidación interbancaria, la moneda, la fecha de liquidación, agente que instruye y agente instruido BICs, y deudor y acreedor IBANs. Si el mensaje incluye `Purp`, el puente actualmente solo acepta financiamiento con fines de valores: `Purp=SECU`.

Los puntos finales de envío `pacs.008` y `pacs.009` API aceptan contenedores de datos XML ISO o el formato de campo plano utilizado por las pruebas del puente. Los campos opcionales `SplmtryData` pueden fijar el libro mayor de la cadena de bloques de destino Iroha, los ID o direcciones de las cuentas de origen y destino, y el ID de definición del activo. La respuesta es `202 Accepted` con `message_id`, `transaction_hash`, `status`, `pacs002_code`, y el contexto resuelto del libro mayor/cuenta/activo.

### Autorización del Participante y Propiedad del Ciclo de Vida {#participant-authorization-and-lifecycle-ownership}

Cada puente habilitado tiene un catálogo de participantes. Cada entrada de participante tiene un ID de participante único, una o más claves públicas de operador, uno o más identificadores financieros, un conjunto de perfiles permitidos y los roles `originator`, `counterparty`, o ambos. Las claves de operador y los identificadores financieros no pueden pertenecer a más de un participante. Configure `audit_admin_keys` por separado; una clave de administrador de auditoría no puede ser también una clave de mutación de participante.

Todas las rutas ISO requieren una nueva firma del operador. Para una presentación inicial `pacs.008`, `pacs.009`, `sese.023` o `colr.012`, el operador autenticado debe pertenecer al participante identificado por la identidad financiera `From` del encabezado de la aplicación. La identidad `To` debe resolverse en un participante configurado con el rol `counterparty`, y el perfil seleccionado debe estar permitido para ambas partes. El registro de admisión durable registra el originador, la contraparte, el participante que admite y la clave del operador, así como el perfil original y la política de firma incrustada.

La autorización del ciclo de vida se deriva de ese registro inmutable en lugar de de los valores seleccionados por el llamante:

|Mensaje de ciclo de vida|Participante requerido|
| ---------------------------------------------- | -------------------------------------------------- |
| `pacs.002`, `pacs.004`, `sese.024`, `sese.025` |Contraparte original con el rol `counterparty`|
| `camt.056`                                     |Originador original con el rol `originator`|

El perfil original y la política de firma permanecen fijados durante todo el ciclo de vida, por lo que un llamador no puede seleccionar un perfil más débil para una actualización. Un código `pacs.002` que representa la liquidación (`ACSC`, `ACCP`, `SETT` o `SETTLED`) cambia el registro original a liquidado solo cuando Torii ha presentado evidencia de la transacción.

Cualquiera de las partes originales puede leer su registro de mensajes y los documentos de salida generados. El endpoint de auditoría API devuelve únicamente los registros en los que el participante autenticado es el originador o la contraparte. Un administrador de auditoría configurado por separado recibe una vista de auditoría global de solo lectura y no puede enviar ni cambiar mensajes. Los participantes desconocidos y los identificadores de mensajes no relacionados no se revelan.

### Identidad de Reproducción Duradera y Documentos de Buzón Firmados {#durable-replay-identity-and-signed-outbox-documents}

Los marcadores de eliminación duradera de reproducción son el límite estricto de admisión. Torii aborta el inicio por un marcador de eliminación duradera ilegible, sobredimensionado, malformado, mal nombrado, en conflicto o explícitamente incompatible. También se aborta por un registro rico con una versión de esquema explícitamente incompatible, un participante, perfil o política de firma ausente en la configuración actual, o un marcador de eliminación duradera en vivo faltante o que no coincide.

Otros daños en registros ricos se manejan de manera diferente: archivos ilegibles o de gran tamaño, JSON inválidos, registros de esquema actual inválidos, nombres de archivo no canónicos y identidades de reproducción en conflicto se registran o se omiten. Un índice de auditoría de la versión actual ilegible o inválido se regenera a partir de los registros conservados; solo una versión de índice de auditoría explícitamente incompatible aborta el inicio. Monitoree los registros de inicio y reconcilie el manifiesto técnico de auditoría regenerado en lugar de asumir que cada archivo de registro rico corrupto impide que el nodo funcione.

Cada registro rico retenido mantiene la procedencia inmutable del participante. Un marcador de eliminación duradero separado conserva el ID del mensaje, el hash criptográfico de la carga útil, el ID del mensaje de negocio y UETR para la deduplicación completa TTL incluso después de que los detalles del registro rico sean eliminados.

Torii persiste en la admisión de repetición antes de firmar o procesar un mensaje de ciclo de vida. Nunca expulsa una identidad de repetición que no haya expirado. Si la capacidad configurada está completamente ocupado por registros protegidos o identidades de reproducción no vencidas, las presentaciones reciben `503 Service Unavailable` reintentable sin mutar el ciclo de vida o el estado contable.

Cada documento generado de `pacs.002`, `pacs.004`, `camt.029`, `sese.024` o `sese.025` se devuelve como `application/xml` con estos encabezados de respuesta:

|Encabezado|Significado|
| ------------------------------ | ----------------------------------------------------- |
| `X-Iroha-Iso-Signature-Domain` |Siempre `iroha.iso20022.outbound.v2`|
| `X-Iroha-Iso-Signer`           |Clave pública canónica para el firmante criptográfico del puente configurado|
| `X-Iroha-Iso-Signature`        |Firma Base64 sobre los XML bytes separados por dominio|

Verifique la firma sobre la secuencia de bytes UTF-8 `iroha.iso20022.outbound.v2`, un byte cero y el cuerpo de respuesta exacto. No reformatee ni normalice XML antes de la verificación.

### Soporte adicional para el analizador y mapeo {#additional-parser-and-mapping-support}

El asistente IVM ISO también valida y materializa las siguientes familias de mensajes para la validación de contenedores de datos, el mapeo de liquidaciones o la conciliación posterior. No tienen rutas Torii independientes.

|Mensaje a la familia|Soporte actual|
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `head.001`                         |Validación del encabezado de la aplicación empresarial para contenedores de datos ISO, incluidos `BizMsgIdr`, `MsgDefIdr`, tiempo de creación y campos opcionales de remitente/receptor BIC|
| `pacs.007`, `pacs.028`, `pacs.029` |Reversión de pago, solicitud de estado y resolución de investigación / análisis de estado|
| `pain.001`, `pain.002`             |Inicio de pago por parte del cliente y validación del informe de estado de pago|
| `camt.052`, `camt.053`, `camt.054` |Validación de informe de cuenta, estado y notificación|

## Kaigi Sesiones {#kaigi-sessions}

Kaigi ofrece salas de audio/video en tiempo real de pago en SORA Nexus. Úselo cuando una aplicación necesite la creación de sesiones respaldadas por un libro mayor, cambios en la lista de participantes, transmisión de manifiestos técnicos, señalización encriptada y medición de uso en lugar de mantener todo el estado de la conferencia fuera de la cadena.

El ciclo de vida orientado al libro mayor es:

- `CreateKaigi`: crear una llamada bajo un dominio y almacenar su política, calendario, metadatos y manifiesto técnico opcional de retransmisión.
- `JoinKaigi`: actualizar la lista de llamadas. En el modo `zk-roster-v1`, la vista pública de llamadas muestra los conteos de compromisos y anuladores en lugar de los ID de cuenta de los participantes.
- `LeaveKaigi`: eliminar a un participante de una llamada transparente. La salida en modo privado es fuera de la cadena en el protocolo de la primera versión.
- `RecordKaigiUsage`: agregar la duración medida y los totales del costo de ejecución de la transacción.
- `EndKaigi`: cierra la sesión y registra la marca de tiempo final.

Torii expone las siguientes lecturas orientadas a la aplicación:

|Ruta|Autenticación|Propósito|
| ----------------------------------- | --------------------------------------- | ------------------------------------------ |
|`/v1/kaigi/calls/{call_id}`|pública|registro de llamada actual|
| `/v1/kaigi/calls/{call_id}/signals` |solicitud de cuenta de red exacta canónica|metadatos de señalización comprometidos paginados|
| `/v1/kaigi/calls/{call_id}/events`  |solicitud de cuenta de red exacta canónica|flujo de ciclo de vida de llamada|
| `/v1/kaigi/relays`                  |solicitud de operador en lista blanca|resumen del relevo|
| `/v1/kaigi/relays/{relay_id}`       |solicitud de operador en lista blanca|el registro y detalles de salud de un relé|
| `/v1/kaigi/relays/health`           |solicitud de operador en lista blanca|salud agregada del relé|
| `/v1/kaigi/relays/events`           |solicitud de cuenta de red exacta canónica|registro de retransmisión y flujo de eventos de salud|

La aplicación API debe estar habilitada. El resumen del relé y las rutas de salud son superficies de operador aunque sean de solo lectura; una solicitud no firmada `curl` es no es una sonda de disponibilidad válida. El estado de la sesión también se refleja a través de eventos de dominio Kaigi como `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated` y `KaigiUsageSummary`.

### CLI Prueba de Humo {#cli-smoke-test}

Comience con el `iroha app kaigi` CLI cuando quiera verificar que un Torii API endpoint acepta transacciones Kaigi antes de conectar un UI. El comando de inicio rápido crea una sala en el endpoint API configurado e imprime su identificador de llamada y metadatos de unión:

```bash
iroha app kaigi quickstart \
  --domain kaigi.universal \
  --summary-out kaigi-summary.json
```

Para los flujos con guion, gestione el ciclo de vida de la sala de manera explícita:

```bash
iroha app kaigi create \
  --domain kaigi.universal \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha app kaigi join \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi leave \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi record-usage \
  --domain kaigi.universal \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha app kaigi end --domain kaigi.universal --call-name daily
```

Use `--room-policy public` para habitaciones que los repetidores pueden exponer sin entradas de espectadores, o `--room-policy authenticated` cuando las salidas deben requerir autenticación del espectador. Use `--privacy-mode zk-roster-v1` solo después de que la red tiene el personal Kaigi y las claves de verificación de uso configuradas; de lo contrario, las uniones, salidas y registros de uso privados fallan durante la verificación determinista.

### JavaScript Integración {#javascript-integration}

El actual [Iroha JavaScript demostración](https://github.com/soramitsu/iroha-demo-javascript) implementa un perfil de reunión uno a uno transparente y autenticado. No expone el protocolo `zk-roster-v1` flujo de prueba. Su renderizador crea WebRTC ofertas y respuestas, mientras que un puente privilegiado utiliza el local [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) proceder al pago para cotizar, firmar, enviar y esperar la finalización Kaigi transacciones.

Consulte [Incrustar Kaigi en una aplicación JavaScript](/es/guide/tutorials/kaigi.md) para la autenticación exacta de la ruta, el formato de invitación, el límite del puente y los comandos de prueba de demostración actuales.

## Estado y Métricas {#status-and-metrics}

Los endpoints de estado y métricas API son lo primero que se debe conectar a los tableros:

- `/status` expone los campos de nivel superior de red, par, bloque, cola y consenso
- `/metrics` expone contadores, medidores e histogramas de Prometheus

En los nodos habilitados con Nexus, la salida de estado también incluye secciones conscientes del carril de ejecución y del espacio de datos. Cuando `nexus.enabled = false`, esas secciones se omiten.

## JSON frente a Norito {#json-vs-norito}

Varios endpoints del operador API devuelven Norito por defecto. Cuando el endpoint API admite JSON, envíe:

```http
Accept: application/json
```

Esto es especialmente útil para:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`

Cuando un endpoint API acepta o devuelve directamente Norito tipados, use `application/x-norito` como el tipo de contenido o el valor preferido de `Accept`. Consulte [Norito](/es/reference/norito.md#torii-and-norito-rpc) para los detalles del transporte.

## Perfiles de telemetría {#telemetry-profiles}

API la visibilidad del endpoint depende de la configuración `telemetry.profile` del nodo. La configuración actual expone cinco niveles de perfil:

|Perfil| `/status` | `/metrics` |Rutas de desarrollador|
| ----------- | --------- | ---------- | ---------------- |
|`disabled`|no|no|no|
|`operator`|sí|no|no|
| `extended`  |sí|sí|no|
| `developer` |sí|no|sí|
| `full`      |sí|sí|sí|

## CLI Atajos {#cli-shortcuts}

El `iroha` CLI ya envuelve muchos de estos puntos finales API:

```bash
export IROHA_OPERATOR_KEY_FILE=/run/secrets/iroha/operator.key

iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  ops sumeragi params
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi evidence count
```

## Referencias ascendentes {#upstream-references}

- [README API y descripción general de la observabilidad](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO Implementación del puente 20022](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [Rendimiento y métricas](/es/guide/advanced/metrics.md)
