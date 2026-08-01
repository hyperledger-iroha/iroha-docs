---
translation_locale: es
translation_source: /guide/advanced/metrics.md
translation_source_hash: 5772bf7175b693fbbed54b59304859a33c2e19fef0c402141b6f4ad4cfd6714f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# El rendimiento y las métricas {#performance-and-metrics}

El rendimiento de Iroha depende de la carga de trabajo, la topología del validador, las condiciones de red y los ajustes de consenso. Por lo tanto, un único número TPS solo es útil cuando se une a una ejecución de referencia con una configuración fija.

Para la planificación de las capacidades, el rendimiento debe considerarse como un marco operativo:

- la red acepta el tipo de transacción solicitado
- Comprometerse a permanecer en la latencia dentro del presupuesto objetivo
- Las colas de transacciones permanecen limitadas
- El consenso no depende de cambios repetidos en la vista o vías de recuperación

Utilice esta página para estimar si una implementación se encuentra en un estado de alto, medio o bajo rendimiento para un número de nodos dado, el umbral de latencia de la red y el objetivo TPS.

## Qué medir {#what-to-measure}

Comienza con las superficies del operador expuestas por Torii:

```bash
export TORII=http://127.0.0.1:8180

curl -s -H 'Accept: application/json' "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

Se puede probar el mismo patrón de sólo lectura contra público Taira:

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/status" \
  | jq '{healthy: .health.healthy, peers, samples_used, rtt_count: .rtt.count}'

curl -fsS "$TAIRA/metrics" \
  | grep -E '^(block_height|queue_size|sumeragi_tx_queue_depth|txs|view_changes)' \
  | head -n 20
```

Las métricas públicas Taira son útiles para aprender los nombres de las señales. No las utilice como números de capacidad de producción para su propio despliegue.

Los mismos instantáneos de consenso están disponibles a través del CLI:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

La visibilidad de la telemetría depende del perfil configurado. Utilice `extended` cuando necesite `/metrics`, y utilice `full` durante las pruebas de prueba cuando también necesita las rutas detalladas del operador Sumeragi.

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## Las bandas de rendimiento {#performance-bands}

Utilizar estas bandas para una carrera observada en el rendimiento de destino `Y` TPS y el presupuesto de latencia `L` en milisegundos. Realice la carga de trabajo lo suficiente como para incluir el calentamiento, estado estable y al menos un período de máxima carga esperada.

|La banda .|Condiciones |El significado .|
| --- | --- | --- |
|Muy alto .|El rendimiento aceptado está en o por encima de `Y`, la latencia de compromiso p95 está por debajo de `0.8 * L`, las colas permanecen por debajo del 10% de la capacidad y los contadores de cambio de vista/recuperación son planos |El despliegue dispone de espacio para la carga de trabajo solicitada |
|Medio |El rendimiento aceptado está cerca de `Y`, la latencia de envío p95 es inferior a `L`, las colas son estables por debajo del 50% de la capacidad y los cambios en la vista son raros. |El despliegue funciona, pero hay una tolerancia limitada a las explosiones |
|Bajo .|El rendimiento aceptado está por debajo de `Y`, la latencia de compromiso p95 excede `L`, las colas crecen durante la ejecución o los contadores de cambio de vista/retrasonación aumentan continuamente.|La carga de trabajo solicitada excede al menos un cuello de botella |

La regla clave es la dirección de la cola. Si el TPS presentado es mayor que el TPS comprometido y la cola continúa creciendo, el despliegue se sobrecarga incluso si las muestras cortas parecen saludables.

## Número de nodos y quórum {#node-count-and-quorum}

Más validadores mejoran la tolerancia a fallos, pero aumentan los costes de coordinación, firma y red. Sumeragi la ejecución:

- el número de validadores `n` deriva del presupuesto de fallas `f = floor((n - 1) / 3)`;
- para `n >= 4`, el quórum de comisión es `2f + 1`
- Para `n <= 3`, se requieren todos los validadores para el compromiso.
- Los pares de observadores sincronizan los bloques pero no votan, proponen o recogen

|Validadores |Presupuesto defectuoso |Compromete el quórum.|Nota de capacidad |
| --- | --- | --- | --- |
|1 a 3 |0 práctico fuera de línea|todos los validadores |Útil para el desarrollo y las pequeñas pruebas; cualquier validador faltante puede detener los compromisos. |
| 4 | 1 | 3 |Mínimo común para la tolerancia de una sola falla |
| 7 | 2 | 5 |Más resiliente, con más tráfico de votos y propagación |
| 10 | 3 | 7 |Más alto coste de coordinación; más importancia para el ajuste de redes y colectores |

Al evaluar "nodos X", separar los validadores de votación de los observadores. Añadir observadores generalmente cuesta menos que agregar validadores, pero los observadors todavía consumen chisme de bloque, sincronización de bloqueo, disco y ancho de banda de red.

## Los factores que influyen en el rendimiento {#factors-that-influence-performance}

### Forma de carga de trabajo {#workload-shape}

La misma TPS puede ser barata o costosa dependiendo de lo que haga cada transacción.

- número de instrucciones por transacción
- El número de firmas y los algoritmos de firma
- tamaño del byte de transacción y tamaño de la carga útil descomprimida
- Ratio de lectura/escritura
- tamaño de los metadatos y operaciones de activos
- los contratos inteligentes, el desencadenante y el coste de ejecución IVM
- carga de consulta que se ejecuta contra los mismos pares

Las pequeñas transacciones de transferencia no son un sustituto para las cargas de trabajo pesadas en los contratos o metadatos.

### Tiempo de consenso {#consensus-timing}

El tiempo Sumeragi se controla por los parámetros eficaces Sumeragi:

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- Tiempos de fase NPoS cuando se habilita el modo NPoS

Inspeccionarlos con:

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

Los objetivos de tiempo más bajos pueden mejorar la latencia solo mientras las capas de red, almacenamiento y ejecución puedan mantenerse al día. Una vez que se ven los cambios, aparecen retiros de carga útil faltantes o se produce una presión retroactiva, reducir los tiempos suele empeorar el rendimiento.

### Colector Fanout {#collector-fanout}

Las configuraciones del colector afectan la rapidez con que convergen los votos de compromiso:

- `sumeragi.collectors.k` controla cuántos coleccionistas reúnen los votos por altura
- `sumeragi.collectors.redundant_send_r` controla la votación adicional después de una hora local
- `sumeragi.collectors.parallel_topology_fanout` añade la topología fanout junto a los coleccionistas

El aumento de la capacidad puede reducir la latencia en redes más grandes o menos fiables, pero también aumenta el tráfico. Comparar la disponibilidad agregada y la telemetría del colector con las métricas de latencia y retropresión antes de cambiar estos valores:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### Condiciones de la red {#network-conditions}

El rendimiento del consenso es sensible a:

- RTT entre los validadores
- nerviosismo y pérdida de paquetes
- ancho de banda para las cargas útiles en bloques y los fragmentos RBC
- Enlaces asimétricos entre regiones
- NAT, firewall o comportamiento de retransmisión que retrasa la conectividad entre pares.

Como regla de planificación, establezca el presupuesto de latencia lo suficientemente alto como para cubrir varios viajes de ida y vuelta del validador más tiempo de ejecución y compromiso de disco. Si la red p95 RTT ya está cerca de la latencia de compromiso p95 deseada, el objetivo no es realista.

### Cuentas y límites de admisión {#queues-and-admission-limits}

Las configuraciones de admisión y cola definen la cantidad de presión que puede absorber un compañero:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- límites de transacción genesis tales como firmas máximas, instrucciones, bytes y bytes descompresos
- Los límites de fila p2p y los límites de entrada por consenso

La alta capacidad de cola puede ocultar la sobrecarga por un tiempo, pero no aumenta el rendimiento sostenible. Una fila estable es saludable; una fila creciente es un retraso.

### El hardware y el almacenamiento {#hardware-and-storage}

Medir a todos los validadores, no sólo al líder:

- CPU saturación durante la validación, verificación de las firmas y ejecución
- la presión de memoria de las colas, instantáneas y sesiones activas RBC
- latencia de escritura del disco para almacenamiento de bloques y instantáneas
- saturación de transmisión/recepción de la red
- configuraciones opcionales de aceleración del hardware cuando se utilizan por la carga de trabajo

El validador de votación más lento puede determinar la latencia en la red.

## Las señales de Prometeo {#prometheus-signals}

Los nombres métricos pueden variar según el perfil de construcción y el conjunto de características. Inspeccionar `/metrics` en su nodo primero, luego construir paneles de control alrededor de las series disponibles.

Las señales comunes incluyen:

|La señal .|Ejemplos de Prometheus |Qué ver .|
| --- | --- | --- |
|Capacidad aceptada |`sum(rate(txs{type="accepted"}[5m]))` |Debería alcanzar o exceder el objetivo TPS en estado estable |
|Los rechazos |`sum(rate(txs{type="rejected"}[5m]))` |Debería ser explicable por el plan de prueba |
|Comprometerse con la latencia|`histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |Comparar p95/p99 con el presupuesto de latencia |
|La profundidad de la cola |`queue_size`, `sumeragi_tx_queue_depth` |Debería permanecer confinado durante el pico de carga .|
|Saturación de la cola |`sumeragi_tx_queue_saturated` |Varios valores no cero sostenidos significan sobrecarga |
|Ver los cambios |`view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` |Los valores en aumento indican el tiempo, la topología, la carga útil o problemas de red |
|Mensajes abandonados |`dropped_messages`, `sumeragi_consensus_message_handling_total` |Las caídas durante la carga por lo general explican picos de latencia |
|Presión RBC |`sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` |Puntos de presión no cero para los cuellos de botella en la recuperación o almacenamiento de carga útil |
|Compromete el quórum.|`sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |Las firmas contadas deben alcanzar el quórum requerido rápidamente |

Cuando una métrica sólo existe en `/v1/sumeragi/status`, captura la instantánea de JSON en el mismo ejecutar artefactos que el raspado Prometheus.

## Evaluación del flujo de trabajo {#estimation-workflow}

1. Definir el escenario:
   - el número de validadores y de observadores
   - modo de consenso
   - objetivo TPS
   - Presupuestos de compromiso p95 y p99 por latencia
   - mezcla de transacciones
   - red esperada RTT, jitter y ancho de banda
2. Registra la configuración efectiva:

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. Ejecutar la carga de trabajo en el objetivo TPS.
4. Captura el estado y las métricas en el comienzo, medio y final de la carrera.
5. Clasifique la carrera con la tabla de banda de rendimiento.
6. Si la banda es mediana o baja, cambie un factor a la vez y repita.

## Modelo de informe de referencia {#benchmark-report-template}

Publicar números de rendimiento sólo con el contexto suficiente para reproducirlos:

- Iroha bandera de compromiso, liberación y características
- cuenta del validador y el observador
- el modo de consenso y los parámetros Sumeragi
- colector `k`, envío redundante `r`, y topología fanout
- perfil de telemetría
- Detalles del hardware, almacenamiento y OS
- Asunciones de la red RTT, jitter, pérdida y ancho de banda
- la mezcla de transacciones y el tamaño de la carga útil
- ofrecido TPS y duración de la carrera
- aceptado/rechazado TPS
- P50/p95/p99 latencia de compromiso
- profundidad de la cola y saturación
- Visión de cambios, mensajes caídos, presión RBC y contadores de carga útil faltante
- CPU, memoria, disco y utilización de la red por validador

Sin estos detalles, un número TPS debe tratarse como anecdótico.

## Páginas relacionadas {#related-pages}

- [Pruebas de caos con Izanami ](./chaos-testing.md)
- [Puntos finales Torii](../../reference/torii-endpoints.md)
- [Operar en Iroha 3 a través de CLI ](../../get-started/operate-iroha-via-cli.md)
- [Referencia de configuración entre pares ](../../reference/peer-config/params.md)
