---
translation_locale: es
translation_source: /guide/advanced/metrics.md
translation_source_hash: fc62efbb6100308bb7a929e18c9c8b6860372abd6d0009616ea63d7c77b6b1eb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Rendimiento y Métricas {#performance-and-metrics}

El rendimiento de Iroha depende de la carga de trabajo, la topología del validador, las condiciones de la red y la configuración del consenso. Por lo tanto, un solo número de TPS solo es útil cuando está asociado a una prueba de referencia con una configuración fija.

Para la planificación de la capacidad, trate el rendimiento como un contenedor de datos operativos:

- la red acepta la tasa de transacción solicitada
- la latencia de commit se mantiene dentro del presupuesto objetivo
- las colas de transacciones permanecen acotadas
- el consenso no depende de cambios de opinión repetidos ni de caminos de recuperación

Utilice esta página para estimar si un despliegue se encuentra en un estado de alto, medio o bajo rendimiento para un número determinado de nodos, umbral de latencia de red y objetivo TPS.

## Qué medir {#what-to-measure}

Comience con la vista de datos de punto en el tiempo del nodo público y el raspado de Prometheus, luego use el CLI para el estado de consenso autenticado por el operador. La clave del operador debe ser autorizada por el nodo objetivo y se carga únicamente en tiempo de ejecución del software:

```bash
export TORII=http://127.0.0.1:8180
export OPERATOR_KEY_FILE=./secrets/operator.key

curl -s -H 'Accept: application/json' "$TORII/status" | jq .
curl -s "$TORII/metrics" > metrics.prom

iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi status
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi qc
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

Public Taira es útil para aprender la forma de las instantáneas de nodos anónimos. Sus diagnósticos de operador no están disponibles intencionalmente sin una clave de operador Taira:

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/now" \
  | jq '{now_ms, offset_ms}'
```

No utilices las observaciones de la red de prueba pública como cifras de capacidad de producción para tu propio despliegue.

La visibilidad de la telemetría depende del perfil configurado. `operator` habilita el estado y las instantáneas de diagnóstico. `extended` agrega `/metrics` y tiempos costosos, mientras `developer` agrega vistas de datos de desarrollador en un momento determinado como líder, QC, parámetros y evidencia sin habilitar `/metrics`. Use `full` cuando una ejecución necesite ambos conjuntos. `telemetry_profile` es el único interruptor de telemetría de primera versión.

```toml
telemetry_profile = "full"
```

## Bandas de rendimiento {#performance-bands}

Utilice estas bandas para una ejecución observada con el rendimiento objetivo `Y` TPS y un presupuesto de latencia de `L` milisegundos. Ejecute la carga de trabajo el tiempo suficiente para incluir la fase de calentamiento, el estado estable y al menos un período de carga máxima esperada.

|Banda|Condiciones|Significado|
| --- | --- | --- |
|alta|El rendimiento aceptado está en o por encima de `Y`, la latencia de compromiso p95 está por debajo de `0.8 * L`, las colas permanecen por debajo del 10% de la capacidad, y los contadores de cambio de vista/recuperación se mantienen constantes|El despliegue tiene margen para la carga de trabajo solicitada|
|media|El rendimiento aceptado está cerca de `Y`, la latencia de commit p95 está por debajo de `L`, las colas son estables por debajo del 50% de la capacidad, y los cambios de vista son raros|El despliegue funciona, pero hay una tolerancia limitada a ráfagas|
|baja| El rendimiento aceptado está por debajo de `Y`, la latencia de compromiso p95 supera `L`, las colas crecen durante la ejecución, o los contadores de cambio de vista/retroceso aumentan continuamente |La carga de trabajo solicitada excede al menos un cuello de botella|

La regla clave es la dirección de la cola. Si el TPS enviado es mayor que el TPS comprometido y la cola sigue creciendo, la implementación está sobrecargada incluso si las muestras cortas parecen estar saludables.

## Conteo de Nodos y Quórum {#node-count-and-quorum}

Más validadores mejoran la tolerancia a fallos pero aumentan los costos de coordinación, firma y difusión en la red. El protocolo Sumeragi de primera versión requiere:

- un comité de votación exacto `n = 3f + 1`
- `4 <= n <= 31`, por lo que los tamaños válidos son 4, 7, 10, y así sucesivamente
- un quórum de compromiso de `2f + 1`
- los pares de la red de observadores sincronizan bloques pero no votan, proponen ni recopilan

|Validadores|Presupuesto de fallos|Quórum de la comisión|Nota de capacidad|
| --- | --- | --- | --- |
| 4 | 1 | 3 |Mínimo común para tolerancia a un fallo|
| 7 | 2 | 5 |Más resistente, con más votos y tráfico de propagación|
| 10 | 3 | 7 |Mayor costo de coordinación; la red y la configuración de ingreso importan más|
| 31 | 10 | 21 |Comité de primera liberación máximo; coordinación de referencia y costo de firma cuidadosamente|

la generación génesis de blockchain y la validación de inicio rechazan tamaños de comité no conformes; no evalúes una topología que la versión no pueda admitir.

Al evaluar "nodos X", separa los validadores con derecho a voto de los observadores. Añadir observadores generalmente cuesta menos que añadir validadores, pero los observadores aún consumen difusión de bloques, sincronización de bloques, disco y ancho de banda de red.

## Factores que influyen en el rendimiento {#factors-that-influence-performance}

### Forma de la carga de trabajo {#workload-shape}

El mismo TPS puede ser barato o caro dependiendo de lo que haga cada transacción. Registro:

- número de instrucciones por transacción
- conteo de firmas y algoritmos de firma
- tamaño del byte de la transacción y tamaño de la carga útil descomprimida
- relación lectura/escritura
- tamaño de metadatos y operaciones de activos
- contrato inteligente, activador, y costo de ejecución de IVM
- carga de consulta ejecutándose contra los mismos pares de red

Las pequeñas transacciones de transferencia no son un sustituto de las cargas de trabajo con muchos contratos o con muchos metadatos.

### Cadencia de Consenso {#consensus-cadence}

La vista de datos en un momento determinado del parámetro efectivo Sumeragi contiene la cadencia de bloque inmutable firmada y el límite de deriva del reloj:

- `block_cadence_ms`
- `max_clock_drift_ms`

Inspecciónalos con:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

`block_cadence_ms` se compromete mediante el génesis de blockchain firmado y se congela al iniciar; no es un control de ajuste en vivo. Compare redes con diferentes entradas de génesis de blockchain firmado solo como escenarios de referencia separados. Una vez que aparecen cambios en la vista, recuperaciones de carga faltante o retropresión, una cadencia más corta generalmente hace que la sobrecarga sea más visible en lugar de aumentar el rendimiento sostenible.

### Candidatos y Límites de Ingreso {#candidate-and-ingress-bounds}

Los límites locales del nodo Sumeragi determinan cuánto trabajo de candidato y recuperación puede retener un validador:

- `sumeragi.block.max_transactions`
- `sumeragi.block.max_payload_bytes`
- `sumeragi.block.proposal_queue_scan_multiplier`
- `sumeragi.queues.commands`
- `sumeragi.queues.bodies` y `sumeragi.queues.body_bytes`
- `sumeragi.queues.body_source_bytes`, `sumeragi.queues.chunks` y `sumeragi.queues.ready_bodies`

Los límites demasiado pequeños crean presión sobre la cola o la recuperación de la carga útil; los límites demasiado grandes aumentan la memoria retenida y la cantidad de trabajo disponible para una red abusiva pares. Compare la vista de datos de diagnóstico en un momento específico con la memoria del proceso, el manejo de mensajes y las métricas de cuerpo faltante antes de cambiar un límite a la vez:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
```

### Condiciones de la red {#network-conditions}

El desempeño del consenso es sensible a:

- RTT entre validadores
- jitters y pérdida de paquetes
- ancho de banda para cargas útiles de bloques y fragmentos firmados RS16
- enlaces asimétricos entre regiones
- NAT, firewall o comportamiento de retransmisión que retrasa la conectividad entre pares de la red

Como regla de planificación, establezca el presupuesto de latencia lo suficientemente alto como para cubrir varios viajes de ida y vuelta del validador, además del tiempo de ejecución y de confirmación en disco. Si la red p95 RTT ya está cerca de la latencia de confirmación p95 deseada, el objetivo no es realista.

### Colas y Límites de Admisión {#queues-and-admission-limits}

La configuración de admisión y de cola define cuánta presión de ráfaga puede absorber un par de red:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.max_retained_bytes`
- `queue.transaction_time_to_live_ms`
- límites de la transacción génesis de blockchain como máximas firmas, instrucciones, bytes y bytes descomprimidos
- límites de cola p2p y límites de ingreso por consenso

Una alta capacidad de cola puede ocultar la sobrecarga por un tiempo, pero no aumenta el rendimiento sostenible. Una cola estable es saludable; una cola en crecimiento es un atraso.

### Hardware y Almacenamiento {#hardware-and-storage}

Mide cada validador, no solo el líder:

- CPU saturación durante la validación, verificación de firma y ejecución
- presión de memoria por colas, vistas de datos en un momento específico y búferes de recuperación de carga útil
- latencia de escritura en disco para almacenamiento en bloques y vistas de datos en un momento determinado
- saturación de transmisión/recepción de red
- configuraciones opcionales de aceleración de hardware cuando son utilizadas por la carga de trabajo

El validador votante más lento puede determinar la latencia final de la red.

## Señales de Prometeo {#prometheus-signals}

Los nombres de las métricas provienen del catálogo de telemetría registrado. La disponibilidad de las series y el muestreo todavía dependen de las características de la compilación y de `telemetry_profile`, así que inspecciona `/metrics` en el nodo de destino antes de crear un panel.

Las señales comunes incluyen:

|Señal|Ejemplos de Prometheus|Qué ver|
| --- | --- | --- |
|Rendimiento aceptado| `sum(rate(txs{type="accepted"}[5m]))` |Debe cumplir o superar el objetivo TPS en estado estable|
|Rechazos| `sum(rate(txs{type="rejected"}[5m]))` |Debería poder explicarse mediante el plan de pruebas|
|Latencia de confirmación| `histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |Comparar p95/p99 con el presupuesto de latencia|
|Profundidad de la cola| `queue_size`, `sumeragi_tx_queue_depth` |Debe mantenerse limitado durante la carga máxima|
|Saturación de la cola| `sumeragi_tx_queue_saturated` |Valores no nulos sostenidos significan sobrecarga|
|Ver cambios| `view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` |Valores crecientes indican problemas de temporización, topología, carga útil o red|
|Mensajes perdidos| `dropped_messages`, `sumeragi_consensus_message_handling_total` |Las caídas durante la carga generalmente explican los picos de latencia|
|Carga útil y recuperación de DA| `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total`, `sumeragi_da_gate_satisfied_total` |Las solicitudes persistentes, la edad creciente o los portones DA repetidos indican problemas de adquisición del cuerpo o del fragmento|
|Quórum de comité| `sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |Las firmas contadas deberían alcanzar el quórum requerido rápidamente|

Cuando una métrica existe solo en `/v1/sumeragi/status`, capture la vista de datos en un momento determinado JSON en los mismos artefactos de ejecución que el scrape de Prometheus.

## Flujo de trabajo de estimación {#estimation-workflow}

1. Define el escenario:
   - conteo de validadores y conteo de observadores
   - modo de consenso
   - objetivo TPS
   - presupuestos de latencia de compromiso p95 y p99
   - mezcla de transacciones
   - red esperada RTT, jitter y ancho de banda
2. Registre la configuración efectiva:

   ```bash
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi status \
     > artifacts/sumeragi-status.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi diagnostics \
     > artifacts/sumeragi-diagnostics.json
   ```

3. Ejecute la carga de trabajo en el objetivo TPS.
4. Capture el estado y las métricas al inicio, en el medio y al final de la ejecución.
5. Clasifica la ejecución con la tabla de bandas de rendimiento.
6. Si la banda es Media o Baja, cambie un factor a la vez y repita.

## Plantilla de Informe de Referencia {#benchmark-report-template}

Publica los números de rendimiento solo con suficiente contexto para reproducirlos:

- commit de Iroha, versión y marcas de funcionalidad
- recuentos de validadores y observadores
- modo de consenso, cadencia de bloques firmados y diseño DA
- comité exacto `3f + 1`, quórum y lista de observadores
- `sumeragi.block`, `sumeragi.queues`, `sumeragi.limits`, límites de entrada de red y de la cola de transacciones
- perfil de telemetría
- hardware, almacenamiento y detalles de OS
- red RTT, jitter, pérdida y suposiciones de ancho de banda
- mezcla de transacciones y tamaños de carga
- ofrecido TPS y duración de ejecución
- aceptado/rechazado TPS
- latencia de commit p50/p95/p99
- profundidad de cola y saturación
- ver cambios, mensajes perdidos, recuperaciones de bloques faltantes y contadores de DA-gate
- CPU, utilización de memoria, disco y red por validador

Sin estos detalles, un número TPS debe considerarse anecdótico.

## Páginas relacionadas {#related-pages}

- [Pruebas de caos con Izanami](./chaos-testing.md)
- [Torii API puntos finales](../../reference/torii-endpoints.md)
- [Operar Iroha 3 a través de CLI](../../get-started/operate-iroha-via-cli.md)
- [referencia de configuración de par de red](../../reference/peer-config/params.md)
