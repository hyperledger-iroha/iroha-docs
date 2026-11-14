---
translation_locale: es
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ es la ruta de prueba STARK de Iroha para los efectos de ejecución seleccionados. No reemplaza la ejecución normal de transacciones ni el consenso. Las transacciones aún ejecuta ISI, IVM y Sumeragi como de costumbre; FastPQ consume el testigo de ejecución determinista y convierte los efectos soportados en lotes de pruebas.

La integración actual del host tiene dos caminos principales:

- transferencias de activos numéricos transparentes registradas durante la ejecución del bloque
- sobres de prueba AXT de SORA Nexus cuyo `fastpq_binding` contiene una vinculación de FastPQ

## Ruta de transferencia de testigos {#transfer-witness-path}

Las transferencias numéricas transparentes crean una transcripción de transferencia estructurada cuando la instrucción altera los saldos. La transcripción registra:

- la cuenta de origen, la cuenta de destino, la definición del activo y el monto
- saldos del remitente y del receptor antes y después de la transferencia
- el hash criptográfico del punto de entrada de la transacción utilizado como el hash criptográfico del lote
- un valor de resumen criptográfico principal de autorización derivado de la cuenta que envía
- un resumen Poseidon para transcripciones de delta único

Las transferencias por lotes usan una transcripción con múltiples deltas. En ese caso, el valor del digestio criptográfico Poseidon de un solo delta está ausente.

En la finalización del bloque, Iroha agrupa estas transcripciones por el hash criptográfico del punto de entrada. El testigo de ejecución luego lleva tanto los paquetes originales de transcripciones como los lotes de transición FastPQ preparados para el demostrador.

Cada delta de transferencia se convierte en dos filas de transición:

|Fila|Forma de llave|Pre-valor| Posvalor |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Débito del remitente| `asset/<asset-definition>/<source-account>`      |saldo del remitente antes| saldo del remitente después de |
|Crédito del receptor| `asset/<asset-definition>/<destination-account>` |saldo del receptor antes|saldo del receptor después|

Los valores numéricos se normalizan en unidades testigo enteras. Un valor se rechaza para el procesamiento por lotes FastPQ si no puede representarse como un `u64` no negativo en la escala decimal seleccionada.

## Entradas públicas {#public-inputs}

Cada lote de transición FastPQ lleva entradas públicas que vinculan la prueba al bloque y al contexto de ejecución:

|entrada|Significado|
| ------------- | --------------------------------------------------------------- |
| `dsid`        |Identificador de espacio de datos codificado como bytes en orden little-endian|
| `slot`        |Tiempo de creación del bloque convertido a nanosegundos|
| `old_root`    |Raíz del estado principal derivada del testigo de ejecución|
| `new_root`    |Raíz del estado posterior derivada del testigo de ejecución|
| `perm_root`   |Compromiso Poseidon sobre permisos de roles activos|
| `tx_set_hash` |hash criptográfico sobre la transacción ordenada y el punto de entrada activado por tiempo hashes criptográficos|

El anfitrión utiliza el único conjunto de parámetros de la primera versión, `fastpq-state-transition-stark-v1`, para estos lotes.

## Protocolo de prueba {#proof-protocol}

Los artefactos canónicos de transferencia son pruebas DEEP enmascaradas sobre el campo Goldilocks con una extensión de grado 4. Su relación exacta, su transcripción y su geometría de consultas se definen en el [contrato fijado del protocolo DEEP de FastPQ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md).

## Lo Que Verifica el Verificador {#what-the-prover-checks}

Antes de construir la traza, el verificador FastPQ normaliza el orden del lote en forma canónica por clave de transición, rango de operación y orden de inserción. Las filas de transferencia también requieren metadatos de transcripción. Un lote con filas de transferencia pero sin transcripciones de transferencia es inválido.

Para las transcripciones de transferencia, las verificaciones por parte del proveedor incluyen:

- el saldo del remitente no debe desbordarse
- `sender_after` debe ser igual a `sender_before - amount`
- `receiver_after` debe ser igual a `receiver_before + amount`
- La transcripción debe cubrir cada fila de transferencia en el lote
- cuando exista, el resumen Poseidon de delta único debe coincidir con la preimagen de la transcripción
- las pruebas de Merkle dispersas proporcionadas deben decodificarse como versión 1; los caminos faltantes se rellenan con pruebas sintéticas deterministas

La traza contiene columnas de selector para filas de transferencia, emisión, quema, concesión de roles, revocación de roles, configuración de metadatos y consulta de permisos. Las filas de operaciones numéricas también llevan deltas con signo, deltas acumulativos por activo y contadores de suministro.

## Carril de ejecución del verificador {#prover-lane}

`iroha3d` inicia la línea de ejecución del probador FastPQ al arrancar si se puede inicializar el backend del probador. La línea de ejecución es una tarea en segundo plano con una cola limitada. Después de que un bloque produce un testigo de ejecución, la ruta de confirmación envía un trabajo de demostrador que contiene el hash criptográfico del bloque, la altura, la vista y el testigo.

Si la línea de ejecución no está funcionando o la cola está llena, el trabajo se omite y el procesamiento normal del bloque continúa. Esto significa que la línea de ejecución del probador en segundo plano no es una puerta de admisión de transacciones ni de consenso. Es una vía de producción de pruebas sobre un estado que ya ha sido ejecutado.

El carril de ejecución construye un verificador con:

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Ambas configuraciones predeterminan a `cpu`. Seleccionar `gpu` es una solicitud explícita de cierre por fallo: si el soporte de GPU no está compilado o se solicita un backend GPU falla la verificación previa, la línea de ejecución del demostrador permanece deshabilitada. La primera versión no tiene valor `auto` y no retrocede de un modo GPU solicitado a CPU.

## Verificación {#verification}

FastPQ La verificación de la prueba reconstruye el compromiso de lote canónico y reproduce la transcripción pública. El verificador comprueba la versión del protocolo, la versión del conjunto de parámetros, los límites de repetición, el compromiso de trazas, las entradas públicas, las aperturas Merkle muestreadas, AIR aperturas, y la cadena de consultas FRI.

Los límites de repetición predeterminados incluyen:

| Límite |predeterminada|
| ------------------ | ------: |
|Filas de transición|     256 |
|Tamaño de la carga por lote| 256 KiB |
| FRI capas         |      16 |
|Consultas abiertas|     128 |

## Sobres de prueba AXT de SORA Nexus {#sora-nexus-axt-proof-envelopes}

Los sobres de prueba AXT de SORA Nexus pueden incorporar un `AxtFastpqBinding`. La validación de bloques de los sobres AXT, las comprobaciones de sobres AXT del anfitrión de la IVM y `RegisterVerifiedFeeSponsorVaultAllocation` exigen el `fastpq_binding` del sobre, lo contrastan con la declaración esperada e invocan el verificador de FastPQ sobre el sobre y su prueba incorporada. Una vinculación ausente o una verificación fallida rechaza la operación.

### AXT Matemáticas Vinculantes {#axt-binding-math}

Para los sobres AXT de SORA Nexus, `AxtFastpqBinding` se normaliza de forma canónica antes de volver a verificar la prueba. Se rechazan los valores vacíos de `parameter`, `verifier_id` o `verifier_version`; el ID del verificador debe ser `fastpq` y la versión `v1`, y los flujos AXT mantenidos usan `fastpq-state-transition-stark-v1`. Al tipo de declaración se le eliminan los espacios de los extremos y se lo convierte a minúsculas.

Los AXT FastPQ insumos públicos son hashes criptográficos de bytes deterministas:

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

AXT las claves de transición son:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

La reclamación `authorization` inserta una fila de concesión de rol:

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

y una fila de metadatos que vincula la política de autorización. La declaración `compliance` inserta dos filas de metadatos: una para la política y otra para los espacios de datos de destino.

Para `tx_predicate` y `value_conservation`, se utiliza una cantidad de efecto explícita cuando la vinculación contiene una cantidad positiva de origen o destino. De lo contrario, el código deriva una cantidad determinista limitada:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Luego se utilizan las mismas ecuaciones de transferencia:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Los identificadores de cuenta del remitente y del receptor sintéticos se generan a partir de semillas clave:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

El hash criptográfico del lote de transferencia es:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

El valor del resumen criptográfico del manifiesto técnico del lote AXT es SHA-256 sobre la codificación Norito de la vinculación canónica:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Conjuntos de parámetros {#parameter-sets}

La primera versión tiene exactamente un conjunto de parámetros canónico, `fastpq-state-transition-stark-v1`. Apunta a una seguridad de 128 bits sobre el campo Goldilocks con una extensión de grado 4 (`X^4 - 7`) y usa un tamaño de traza `2^16`, un tamaño de LDE `2^19`, aridad FRI 2, factor de expansión 8, como máximo 17 reducciones y 136 consultas.

## Configuración {#configuration}

La configuración FastPQ está anidada bajo `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

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
```

Las mismas etiquetas de ejecución y telemetría pueden ser sobrescritas desde `iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

También se admiten variables de entorno para los campos de configuración. Las variables específicas de FastPQ incluyen:

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`

## Métricas {#metrics}

Cuando la telemetría está habilitada, FastPQ exporta métricas para la selección de backend y el comportamiento en tiempo de ejecución del software Metal:

|métrica|Significado|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Modo de ejecución solicitado y resuelto por las etiquetas del backend y del dispositivo|
|`fastpq_poseidon_pipeline_total`|Ruta solicitada y resuelta del canal Poseidon|
| `fastpq_metal_queue_depth`        |Límite de cola de metal, recuento máximo en curso, recuento de envío y ventana de muestreo|
| `fastpq_metal_queue_ratio`        |Cola de metal ocupada y ratios de superposición|
| `fastpq_zero_fill_duration_ms`    |Duración de llenado con ceros en el host para ejecuciones de Metal|
| `fastpq_zero_fill_bandwidth_gbps` |Ancho de banda derivado con relleno de ceros|

Para la evaluación general del rendimiento, utilice estos con las señales de consenso y de cola listadas en [Rendimiento y Métricas](/es/guide/advanced/metrics.md).

## Referencia relacionada {#related-reference}

- [Esquema del Modelo de Datos](/es/reference/data-model-schema.md) para la vista de datos de tipo nodo-autoritativo en un momento determinado
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ opciones](/es/reference/iroha3d-cli.md#fastpq-overrides)
