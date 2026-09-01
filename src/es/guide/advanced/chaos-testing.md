---
translation_locale: es
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: 5ceee448217a42e4f8bbae9595486b79019e7a880dfd0f2c71bf580409d0e4b9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Pruebas de Caos con Izanami {#chaos-testing-with-izanami}

Izanami es el orquestador de la red de caos del espacio de trabajo de Iroha de origen. Inicia un clúster desechable de Iroha en local, envía una carga de trabajo configurable e inyecta fallos en los pares de red seleccionados para que los operadores puedan comprobar si la red sigue avanzando ante fallos controlados.

Usa Izanami para comprobaciones de resiliencia en la preproducción, reproducción de regresiones y ajuste de consenso. No lo apuntes a una red de producción: la herramienta está diseñada poseer los pares de la red que inicia, incluyendo reinicios de pares de la red, borrados de almacenamiento, particiones temporales de pares confiables y presión local de CPU o del disco.

## Requisitos previos {#prerequisites}

Ejecuta Izanami desde el [Iroha repositorio de origen](https://github.com/hyperledger-iroha/iroha), no desde este repositorio de documentación:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

El binario debe estar explícitamente permitido para crear y manipular pares de red conectados. Pase `--allow-net` para cada ejecución que no sea TUI, o habilite `allow_net` en el TUI.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

Para una configuración de ejecución interactiva:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami persiste la configuración de TUI y CLI bajo el directorio de configuración del usuario. El archivo de primera versión tiene un byte de diseño V1 explícito; la configuración de pre-lanzamiento o sin versión se rechaza y debe ser recreada en lugar de migrada. Revise los ajustes mostrados antes de reutilizar un perfil actual.

## Ejecución inicial {#baseline-run}

Comience con una línea base reproducible antes de agregar fallos graves:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --target-blocks 100 \
  --progress-interval 15s \
  --progress-timeout 120s \
  --latency-p95-threshold 2s \
  --tps 15 \
  --max-inflight 32 \
  --submitters 1 \
  --seed 42
```

Esta ejecución tiene éxito solo si el clúster alcanza el objetivo de bloques solicitado, continúa progresando dentro del tiempo de espera y se mantiene por debajo del umbral opcional del intervalo de bloques p95.

Registra el comando, la semilla, el commit Iroha, la cantidad de pares de la red, la cantidad de pares defectuosos, el perfil de carga de trabajo, el objetivo TPS y el umbral de latencia con los registros. Sin estos valores, otro operador no puede reproducir el mismo patrón de falla.

## Perfiles de carga de trabajo {#workload-profiles}

Izanami tiene dos perfiles de carga de trabajo:

|Perfil|Úsalo para|Notas|
| -------- | -------------------------------------------------- | -------------------------------------- |
| `stable` |Largas sesiones de prueba y verificaciones de rendimiento reproducibles|Favorece recetas seguras de ejecución|
|`chaos`|Cobertura de rutas de fallo|Incluye recetas intencionalmente inválidas|

Usa primero el perfil estable:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

Cambia al perfil de caos cuando ya se comprende la línea base:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

Las recetas de despliegue de contratos están deshabilitadas en ejecuciones estables a menos que se permita explícitamente:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

Use `--nexus` cuando la ejecución deba usar los valores predeterminados incrustados SORA Nexus del espacio de trabajo ascendente.

## Controles de fallas {#fault-controls}

Cuando `--faulty` es mayor que cero, al menos un escenario de falla debe estar habilitado. Los conmutadores de falla están habilitados por defecto, y los indicadores booleanos se pueden deshabilitar con `=false`.

|Falla| CLI bandera                                   |Qué ejercicios|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|Bloquearse y reiniciar| `--fault-enable-crash-restart`             |pérdida y recuperación del proceso de par en la red|
|Borrar almacenamiento y reiniciar| `--fault-enable-wipe-storage`              |Recuperación de estado local perdido|
|Spam de transacción inválida| `--fault-enable-spam-invalid-transactions` |Rutas de admisión y rechazo|
|Latencia de la red| `--fault-enable-network-latency`           |Chismes lentos y mensajes de consenso retrasados|
|Partición de red| `--fault-enable-network-partition`         |Aislamiento temporal de pares de confianza|
| CPU estrés               | `--fault-enable-cpu-stress`                |Validación local y presión de programación|
|Saturación del disco| `--fault-enable-disk-saturation`           |Presión de almacenamiento local|

Para una ejecución solo de partición de red:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --fault-window-start 60s \
  --fault-window-end 180s \
  --tps 15 \
  --submitters 1 \
  --max-inflight 32 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --seed 42
```

Utilice `--fault-window-start` y `--fault-window-end` para mantener un período de estado estable controlado antes y después de la falla inyectada. Esto hace que sea más fácil distinguir el ruido de arranque del efecto de la falla.

## Formas de escenario {#scenario-shapes}

El catálogo ascendente Izanami asigna formas comunes de fallo de comunicación en blockchain a perfiles CLI. Puedes modelarlos con las mismas banderas:

|Escenario|Forma típica|
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|Carga dirigida| `--faulty 0`, alto `--tps`, un remitente, alto `--max-inflight`|
|Fallo transitorio|Habilitar el reinicio/fallo solo dentro de una ventana de falla limitada|
|Detención y recuperación|Utilice una gran población de pares defectuosos con caída/reinicio|
|Aislamiento del líder|Usa exactamente un par de red defectuoso con solo el fallo de partición de red; Izanami sigue la telemetría del líder Sumeragi|

Mantenga una variable fija a la vez. Si cambia el recuento de pares de la red, el perfil de carga de trabajo, la ventana de fallos y TPS en la misma ejecución, el resultado es difícil de interpretar.

## Qué ver {#what-to-watch}

Durante la ejecución, observe las mismas señales utilizadas para la validación del rendimiento:

- progreso de la altura de bloque en cada nodo de red en ejecución
- transacciones enviadas, aceptadas, rechazadas y con tiempo agotado
- profundidad de la cola, saturación de la cola y retropresión del endpoint API
- ver cambios, rutas de recuperación, bloques faltantes y certificados de quórum faltantes
- respaldo de disponibilidad firmado RS16, sesiones pendientes y tráfico de consenso retrasado
- CPU, saturación de memoria, disco y red en el host que ejecuta los pares de red

Para el análisis de latencia de validación, habilite los registros de depuración del bucle principal:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

Cada bloque debería emitir `block validation timings` con `stateless_ms`, `execution_ms` y `total_ms`. Compare esos tiempos con los intervalos de bloque p95, los contadores de cambio de vista y la presión de la cola antes de cambiar los temporizadores de consenso.

## Interpretando resultados {#interpreting-results}

Considera una ejecución como saludable cuando todos los pares de red seleccionados continúan comprometiendo bloques, la acumulación de tareas pendientes no crece sin límite y los fallos dejan de causar nueva actividad de recuperación después de que finaliza la ventana configurada.

Considera una carrera como un fracaso cuando:

- el progreso del bloqueo se detiene durante más de `--progress-timeout`
- las alturas de los pares de la red divergen y no se reconvergen
- La latencia p95 supera `--latency-p95-threshold`
- las colas crecen durante el resto de la ejecución después de que se cierra una ventana de fallos
- las transacciones rechazadas o agotadas no están explicadas por la carga de trabajo seleccionada
- reinicio del par de red, borrado de almacenamiento o recuperación de partición requiere limpieza manual

Después de un fallo, vuelva a ejecutar con la misma semilla y un tipo de fallo menos. Esto mantiene el trabajo y el tiempo reproducibles mientras se reduce la superficie de fallo.

## Páginas relacionadas {#related-pages}

- [Rendimiento y Métricas](./metrics.md)
- [Ejecutando Iroha en hardware físico](./running-iroha-on-bare-metal.md)
- [Torii API puntos finales](../../reference/torii-endpoints.md)
