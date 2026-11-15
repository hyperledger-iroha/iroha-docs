---
translation_locale: es
translation_source: /blockchain/fastpq.md
translation_source_hash: 98c258ab99bcc7d7d51b69ddd26e39b19ef4eb14d53001825f3737144d68f0e5
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ es la ruta de prueba STARK de Iroha para efectos de ejecución seleccionados. No reemplaza la ejecución normal de transacciones ni el consenso. Las transacciones siguen pasando por ISI, IVM y Sumeragi como de costumbre; FastPQ prueba después los efectos compatibles a partir del registro de origen que capturó la ejecución del bloque.

La integración actual del host tiene dos caminos principales:

- efectos sobre activos numéricos de bloques finalizados, probados por el carril del probador del nodo
- sobres de prueba AXT de SORA Nexus cuyo `fastpq_binding` contiene una vinculación de FastPQ

## Ruta del testigo de transferencia {#transfer-witness-path}

Las transferencias numéricas transparentes crean una transcripción de transferencia estructurada cuando la instrucción altera los saldos. La transcripción registra:

- la cuenta de origen, la cuenta de destino, la definición del activo y el monto
- saldos del remitente y del receptor antes y después de la transferencia
- el hash criptográfico del punto de entrada de la transacción utilizado como el hash criptográfico del lote
- un resumen de autoridad derivado de la cuenta que envía la transacción
- un resumen Poseidon para transcripciones de delta único
- testigos de actualización del árbol de Merkle disperso para los saldos del remitente y del receptor

Las transferencias por lotes usan una transcripción con múltiples deltas. En ese caso, el resumen Poseidon de delta único está ausente.

La ejecución del bloque agrupa las transcripciones según la llamada de ejecución que las emitió y las conserva junto con el registro de origen FastPQ del bloque. En un enunciado de transferencia AXT, cada delta de transferencia se convierte en dos filas de transición:

| Fila | Clave | Valor previo | Valor posterior |
| --------------- | --------------------------------------------------------------------- | ----------------------- | ---------------------- |
| Débito del remitente | `FastpqBalanceKeyV1` para la definición del activo y la cuenta de origen | saldo del remitente antes | saldo del remitente después |
| Crédito del receptor | `FastpqBalanceKeyV1` para la definición del activo y la cuenta de destino | saldo del receptor antes | saldo del receptor después |

Cada clave es la trama Norito canónica de `FastpqBalanceKeyV1`, construida por `transfer_balance_key` a partir de la definición de activo tipada y la cuenta sin dominio. Los alias de cuenta y las formas de visualización nunca son material de clave.

## Efectos de ejecución {#execution-effects}

El carril del probador prueba enunciados completos de efectos de ejecución. Cada enunciado cubre todos los efectos de cantidad de una entrada de ejecución, en orden de ejecución:

| Efecto | Valores actualizados | Regla |
| -------- | ------------------------------ | ------------------------------------------------------------------- |
| Transferencia | saldo de origen y de destino | el monto se mueve entre dos saldos de un mismo activo |
| Emisión | saldo y oferta | ambos aumentan en el mismo monto distinto de cero |
| Quema | saldo y oferta | ambos disminuyen en el mismo monto |
| Retirada | oferta y ciclo de vida | la oferta permanece en cero y la presencia del activo cambia de uno a cero |

La oferta nunca cae por debajo de un saldo. Cada clave consta del dominio `iroha:fastpq:execution-quantity-key:v1`, un byte NUL y la codificación Norito de una clave `FastpqExecutionQuantityKeyV1` de saldo, de oferta o de ciclo de vida. Las concesiones de roles, las revocaciones de roles y otras operaciones no se prueban.

Los valores de los enunciados de efectos de ejecución y de transferencia AXT son unidades enteras no negativas exactas en la escala decimal del activo (`FastpqQuantityUnits`), por lo que no están limitados a `u64`. La construcción del enunciado rechaza una discrepancia de escala, una diferencia negativa y cualquier incoherencia aritmética o de ordenación; nunca corrige un valor público.

## Entradas públicas {#public-inputs}

Cada enunciado FastPQ incluye entradas públicas que vinculan la prueba al bloque y al contexto de ejecución:

|entrada|Significado|
| ------------- | ------------------------------------------------------------------------------------ |
| `dsid` | Identificador del espacio de datos: su valor `u64` en orden little-endian, seguido de ocho bytes cero |
| `slot` | Hora de creación del bloque en nanosegundos, con precisión de milisegundos |
| `old_root` | Raíz del árbol de Merkle disperso de las claves afectadas antes del enunciado |
| `new_root` | Raíz del árbol de Merkle disperso de las claves afectadas después del enunciado |
| `perm_root` | Compromiso con la tabla de permisos de roles del estado de ejecución |
| `tx_set_hash` | Compromiso con las transacciones del bloque en formato de transmisión, en el orden del bloque |

`old_root` y `new_root` cubren solo las claves que afecta el enunciado. No son la raíz persistida del estado mundial.

`perm_root` es el `Hash` de 32 bytes de Iroha calculado sobre el dominio `fastpq:v1:permission-table:blake2b-256`, el número de entradas como `u64` en little-endian y las entradas ordenadas. Cada entrada consta del hash de un ID de rol, el hash de uno de sus permisos y la época de ese permiso como `u64` en little-endian. Una tabla vacía se compromete con 32 bytes cero. Esto es solo contexto de roles y permisos; no prueba la pertenencia de cuentas ni la autorización.

`tx_set_hash` es el `Hash` de Iroha calculado sobre el dominio `iroha:axt:ordered-transaction-wire-set:v1`, un byte NUL, el número de transacciones y, para cada transacción en el orden del bloque, su longitud en formato de transmisión y todos sus bytes en ese formato. El número y las longitudes son valores `u64` en little-endian. Las transacciones no se ordenan ni se deduplican, y las firmas permanecen en la preimagen.

El `Hash` de Iroha es Blake2b-256 con el bit menos significativo del último byte puesto a uno. Un enunciado también incluye un hash de ordenación y todas sus filas canónicas y hechos de origen; la prueba los vincula todos.

## Protocolo de prueba {#proof-protocol}

Los artefactos canónicos de FastPQ son pruebas DEEP enmascaradas sobre el campo Goldilocks con una extensión de grado 4. Su relación exacta, su transcripción y su geometría de consultas se definen en el [contrato fijado del protocolo DEEP de FastPQ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md).

Los llamadores eligen un enunciado ordinario o AXT y los límites de recursos. No eligen circuitos, claves de verificación, número de consultas ni detalles internos de la transcripción. La ruta ordinaria es `offline_compact::prove_quantity_ordinary_artifact`; la ruta AXT es `offline_compact::prove_quantity_axt_artifact`, que `prove_axt_bound_batch` envuelve para lotes vinculados. La API transparente de `Prover`, `Proof` y `verify` de reproducción solo existe en el código de pruebas y en las compilaciones `dev-tools`.

## Lo que verifica la prueba {#what-the-proof-checks}

Antes de cualquier trabajo privado, el productor prepara el enunciado público. Comprueba las cuentas, los montos, los valores, los recuentos de ocurrencias, el orden estable de las claves y la asignación de claves, y rechaza un enunciado cuyos hechos públicos no concuerden. Después, la relación sellada prueba las dos actualizaciones completas del árbol de Merkle disperso de 32 niveles de una ocurrencia de efecto o de transferencia por segmento. Los límites predeterminados permiten como máximo dos segmentos por artefacto.

Cada traza tiene 65,536 filas. El productor compromete 301 columnas privadas y el verificador reconstruye 41 columnas públicas de forma independiente. Entropía criptográfica nueva enmascara las columnas de la traza, el cociente y un polinomio de composición comprometido de forma independiente. La división del cociente debe ser exacta. El productor verifica su propio artefacto antes de devolverlo.

Los valores del enunciado público no se ocultan. Que una operación esté presente en el formato de transmisión no la admite: solo los efectos enumerados arriba tienen relaciones, y los enunciados AXT solo admiten transferencias con testigo.

## Carril del probador {#prover-lane}

`iroha3d` inicia un trabajador del probador FastPQ durante el arranque del nodo, antes de que Torii acepte envíos, salvo que Kura se inicie con `init_mode = "fast"`. El trabajador inicializa su backend en segundo plano, por lo que el arranque continúa si la inicialización falla; en ese caso, el carril queda deshabilitado.

El trabajador sondea el estado finalizado del nodo y el almacenamiento de Kura. Para cada bloque finalizado obtiene el origen autenticado, reproduciendo la ejecución nativa cuando el origen no está almacenado, y prueba los enunciados completos del bloque uno a uno con la ruta ordinaria. Tras un reinicio, reconstruye el prefijo autenticado a partir del génesis firmado fijado. Guarda cada artefacto en el almacén FastPQ acotado de Kura. Un artefacto almacenado es solo un anuncio: antes de continuar, el productor autentica el origen y vuelve a verificar el artefacto.

La producción de pruebas es local del nodo. No es una puerta de admisión de transacciones ni de consenso: la ejecución, la confirmación y la finalidad no esperan a una prueba. Un fallo reintentable deja el trabajo para un intento posterior, y se ejecuta un único productor por proceso.

## Verificación {#verification}

Un verificador comprueba un artefacto frente a expectativas que deriva de su propio enunciado autenticado, nunca del artefacto que se comprueba. La verificación decodifica cada segmento una sola vez dentro de unos límites, evalúa la AIR una vez en el punto fuera del dominio, autentica cada fila abierta, hoja del cociente y fibra FRI, así como el terminal FRI completo, frente a las raíces comprometidas, y realiza como máximo 385 comprobaciones de plegado. No construye ningún testigo privado, traza ni extensión de bajo grado completa.

El éxito establece la coherencia con las expectativas del llamador. No otorga autoridad de ejecución, finalidad del origen, admisión de reproducción ni autorización de gasto AXT.

Límites predeterminados de `offline_compact::VerificationLimits`, que también usa la ruta ordinaria:

| Límite |predeterminada|
| ------------------------------- | ------------: |
| Segmentos por artefacto | 2 |
| Bytes de transmisión del artefacto | 1 MiB |
| Trama de la prueba hija | 500,084 bytes |
| Bytes del enunciado en todos los segmentos | 512 KiB |
| Consultas por segmento | 77 |
| Consultas en todos los segmentos | 154 |

El carril del nodo limita además los bytes de transmisión del artefacto a `zk.fastpq.proof_sidecar_max_bytes` y al límite de objetos FastPQ de Kura. Antes de la decodificación, un blob de prueba AXT puede contener como máximo 2 MiB, y su carga útil FastPQ incorporada, como máximo 1 MiB.

## Sobres de prueba AXT de SORA Nexus {#sora-nexus-axt-proof-envelopes}

Los sobres de prueba AXT de SORA Nexus pueden incorporar un `AxtFastpqBinding`. La validación de bloques de los sobres AXT, las comprobaciones de sobres AXT del anfitrión de la IVM y `RegisterVerifiedFeeSponsorVaultAllocation` exigen el `fastpq_binding` del sobre, lo contrastan con la declaración esperada e invocan el verificador de FastPQ sobre el sobre y su prueba incorporada. Una vinculación ausente o una verificación fallida rechaza la operación.

El verificador solo acepta declaraciones de transferencia con testigo, `tx_predicate` y `value_conservation`. Los tipos de declaración `authorization` y `compliance` son portadores opacos de efectos sin relación de transferencia, y la verificación los rechaza. La validación de bloques también rechaza los sobres que contienen gastos remotos, y el anfitrión de la IVM rechaza la admisión independiente de `AXT_VERIFY_DS_PROOF`. Ambos siguen sin estar disponibles hasta que puedan autenticarse las raíces de origen finalizadas, el conjunto de transacciones y la autorización del emisor.

### Vinculación AXT {#axt-binding}

Para los sobres AXT de SORA Nexus, `AxtFastpqBinding` se normaliza de forma canónica antes de generar la prueba y de verificarla:

- a `parameter`, `source_dataspace`, `source_receipt_id` y `verified_effect_type` se les eliminan los espacios de los extremos y no deben quedar vacíos
- `source_tx_commitment`, `claim_digest`, `witness_commitment` y `policy_commitment` se convierten a minúsculas y deben ser codificaciones hexadecimales de 32 bytes
- `verifier_id` debe ser `fastpq` y `verifier_version` debe ser `v1`
- a `claim_type` se le eliminan los espacios de los extremos, se convierte a minúsculas y debe nombrar uno de los cuatro tipos de declaración anteriores
- `target_dsids` no debe estar vacío y debe estar en orden estrictamente ascendente
- `remote_spend_intent_commitments` debe estar en orden estrictamente ascendente y dentro del límite de la primera versión

La verificación exige la forma canónica exacta; no normaliza una vinculación en nombre del llamador.

La vinculación se adjunta a un lote que la ejecución del bloque ya capturó; no crea transiciones. El lote debe contener al menos una transición de estado y nombrar el conjunto de parámetros de la vinculación, `fastpq-state-transition-stark-v1`. Sus metadatos `entry_hash` deben ser iguales a `source_tx_commitment`, y su `dsid` público debe codificar el `source_dsid` de la vinculación. Una declaración de transferencia debe incluir al menos una transcripción de transferencia, y el hash del lote de cada transcripción debe ser igual a `source_tx_commitment`.

A continuación, la vinculación escribe en el lote metadatos ligados a la prueba: la vinculación canónica, sus cuatro resúmenes, `source_receipt_id`, `target_dsids`, `verified_effect_type`, un `corridor` no vacío, la raíz del manifiesto distinta de cero, el compromiso DA opcional, un monto comprometido opcional distinto de cero y el slot de expiración, donde cero significa que no expira. Por último, añade un sello sobre la vinculación y el lote sin el sello:

$$
\operatorname{seal} =
\operatorname{Hash}(
\texttt{fastpq:axt:batch-seal:v1}\|
E(\operatorname{binding})\|
E(\operatorname{batch})
)
$$

Aquí, $E$ es la codificación Norito canónica. Modificar el lote, la vinculación o un valor ligado a la prueba después de la vinculación hace que la verificación falle. El verificador también compara el espacio de datos, la raíz del manifiesto, el compromiso DA, el monto comprometido y la expiración del sobre con los valores ligados a la prueba.

Un sobre verificado informa sus `old_root`, `new_root` y `tx_set_hash` probados, y un resumen del enunciado. El resumen cubre el espacio de datos del sobre como `u64` en little-endian, su raíz del manifiesto, el compromiso DA cuando está presente, la vinculación y el enunciado:

$$
\operatorname{statement\_digest} =
\operatorname{Hash}(
\texttt{fastpq:axt:statement:v1}\|
\operatorname{le64}(\operatorname{dsid})\|
\operatorname{manifest\_root}\|
\operatorname{da\_commitment}\|
E(\operatorname{binding})\|
E(\operatorname{statement})
)
$$

El valor del resumen criptográfico del manifiesto técnico del lote AXT es SHA-256 sobre la codificación Norito de la vinculación canónica:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Conjuntos de parámetros {#parameter-sets}

La primera versión tiene exactamente un conjunto de parámetros, `fastpq-state-transition-stark-v1`. Los lotes y las vinculaciones AXT lo nombran, y la generación de pruebas AXT rechaza cualquier otro nombre. El contrato del protocolo DEEP fija la geometría de los artefactos de la versión publicada:

| Elemento | Valor |
| -------------------------- | ----------------------------------------------------- |
| Campo | Goldilocks `p = 2^64 - 2^32 + 1`, extensión `u^4 - 7` |
| Filas de la traza | 65,536 |
| Filas de evaluación | 8,388,608 (factor de expansión 128) |
| Aridades de plegado FRI | `[16, 16, 8, 8, 4]` |
| Consultas | 77 posiciones distintas |
| Grinding | ninguno |
| Compromisos y transcripción | SHA3-256 y SHAKE256 |

La calificación para producción no está disponible. Las revisiones independientes de solidez, ocultación y Fiat-Shamir de esta construcción están pendientes, y el [registro fijado de preparación para producción](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_production_readiness.md) no hace ninguna afirmación de seguridad normalizada por trabajo.

## Configuración {#configuration}

La configuración FastPQ está anidada bajo `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"
proof_sidecar_queue_cap = 1024
proof_sidecar_max_retries = 16

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false

[zk.fastpq.producer]
poll_interval_ms = 1000
step_timeout_ms = 30000
max_native_steps = 16
max_source_entries = 65536
max_source_statements = 16384
```

Ambos modos solo aceptan `cpu` o `gpu` y su valor predeterminado es `cpu`. Establecer cualquiera de ellos en `gpu` hace que el cálculo de hashes de las pruebas requiera un dispositivo: Metal en macOS y CUDA en los demás sistemas. Si la compatibilidad con GPU no está compilada o el dispositivo no supera la verificación previa, el carril del probador permanece deshabilitado; nunca recurre a la CPU. El dispositivo ejecuta el cálculo masivo de hashes de las hojas de Merkle y de los nodos padre inferiores; la transcripción, el árbol superior ordenado y la aritmética de la traza permanecen en la CPU. Con `poseidon_mode = "gpu"`, el nodo también agrupa en lotes los resúmenes Poseidon de las transcripciones en la GPU cuando se supera una verificación previa independiente; de lo contrario, los calcula en la CPU.

`proof_sidecar_max_bytes` limita el artefacto codificado que el nodo persiste y verifica, y su valor predeterminado es la trama de prueba máxima del probador. La tabla `producer` acota cada intento de generación de pruebas: su intervalo de sondeo, su presupuesto de tiempo, los pasos de reproducción nativa (de 1 a 64) y las entradas y enunciados de origen admitidos antes de la asignación. `metal_queue_fanout` acepta de 1 a 4.

Los ajustes de modo y de etiquetas de telemetría también pueden sobrescribirse desde `iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

`iroha3d` ignora las variables de entorno cuando lee un archivo de configuración, así que establezca estos valores en TOML o con las opciones anteriores.

## Métricas {#metrics}

Cuando la telemetría está habilitada, FastPQ exporta métricas sobre la selección de backend, la persistencia de pruebas y el comportamiento en tiempo de ejecución de Metal:

|métrica|Significado|
| ----------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Modo de ejecución solicitado y resuelto por las etiquetas del backend y del dispositivo|
|`fastpq_poseidon_pipeline_total`|Ruta solicitada y resuelta del canal Poseidon|
| `fastpq_gpu_disable_total` | Eventos de desactivación del acelerador GPU por acelerador, motivo y etiquetas de dispositivo |
| `fastpq_gpu_parity_failure_total` | Fallos de paridad de GPU muestreados por acelerador, motivo y etiquetas de dispositivo |
| `fastpq_proof_sidecar_queue_depth` | Adjuntos sidecar de pruebas FastPQ en cola |
| `fastpq_proof_sidecar_events_total` | Eventos de persistencia del sidecar de pruebas por evento |
| `fastpq_metal_queue_depth`        |Límite de cola de Metal, recuento máximo en curso, recuento de envío y ventana de muestreo|
| `fastpq_metal_queue_ratio`        |Ratios de ocupación y de superposición de la cola de Metal|
| `fastpq_zero_fill_duration_ms`    |Duración de llenado con ceros en el host para ejecuciones de Metal|
| `fastpq_zero_fill_bandwidth_gbps` |Ancho de banda derivado con relleno de ceros|

Las métricas de modo, de GPU, de la cola de Metal y de relleno con ceros requieren el perfil de telemetría `extended` o `full` y no se exportan cuando Kura se inicia con `init_mode = "fast"`. Las métricas de la cola de Metal y de relleno con ceros también requieren una compilación `fastpq-gpu` en macOS.

Para la evaluación general del rendimiento, utilice estos con las señales de consenso y de cola listadas en [Rendimiento y Métricas](/es/guide/advanced/metrics.md).

## Referencia relacionada {#related-reference}

- [Esquema del Modelo de Datos](/es/reference/data-model-schema.md) para la instantánea de tipos autoritativa del nodo
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `FastpqPublicTransferStatementV1`
- `FastpqBalanceKeyV1`
- `FastpqExecutionQuantityKeyV1`
- `TransferTranscript`
- `AxtFastpqBinding`
- `AxtProofEnvelope`
- [Opciones FastPQ de `iroha3d`](/es/reference/iroha3d-cli.md#fastpq-overrides)
