---
translation_locale: es
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: 5ceee448217a42e4f8bbae9595486b79019e7a880dfd0f2c71bf580409d0e4b9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Pruebas de caos con Izanami {#chaos-testing-with-izanami}

Izanami es el orquestador de chaosnet en el espacio de trabajo upstream Iroha. Inicia un grupo local desechable Iroha, presenta una carga de trabajo configurable e inyecta fallas en pares seleccionados para que los operadores puedan comprobar si la red sigue progresando bajo falla controlada.

Usar Izanami para comprobar la resistencia preproductiva, reproducción de regresión y sintonización del consenso. No lo apunte a una red de producción: la herramienta está diseñada para poseer los pares que inicia, incluyendo reinicios de pares, toallitas de almacenamiento, particiones temporales de confianza de pares y presión local CPU o disco.

## Los requisitos previos {#prerequisites}

ejecutar Izanami desde el repositorio fuente [Iroha ](https://github.com/hyperledger-iroha/iroha), no desde este repositorio de documentos:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

El binario debe tener el permiso explícito de crear y manipular pares en red. Pasar `--allow-net` para cada ejecución que no sea TUI, o habilitar `allow_net` en el TUI.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

Para una configuración de ejecución interactiva:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami persiste las configuraciones TUI y CLI en el directorio de configuración del usuario. El archivo de la primera versión tiene un byte de diseño explícito V1; se rechazan las configuraciones pre-lanzadas o no versionadas de otra manera y deben recrearse en lugar de migrarse. Revise las configuraciones que se muestran antes de volver a utilizar un perfil actual.

## Ejecutar la línea de base {#baseline-run}

Comience con una línea de base reproducible antes de añadir fallas graves:

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

Esta ejecución sólo tiene éxito si el grupo alcanza la meta de bloque solicitada, sigue progresando dentro del tiempo límite y se mantiene por debajo del umbral opcional de intervalo de bloques p95.

Registra el comando, la semilla, Iroha commit, el conteo de pares, el conteos de pares defectuosos, el perfil de carga de trabajo, el objetivo TPS y el umbral de latencia con los registros. Sin estos valores, otro operador no puede reproducir el mismo patrón de falla.

## Perfiles de carga de trabajo {#workload-profiles}

Izanami tiene dos perfiles de carga de trabajo:

|Profiles |Utilizarlo para|Las notas |
| -------- | -------------------------------------------------- | -------------------------------------- |
|`stable` |Largas carreras de remojo y verificaciones de rendimiento reproducibles |Prefiere recetas seguras para la ejecución |
|`chaos` |Cobertura de vías de fracaso |Incluye recetas intencionalmente inválidas |

Utilice el perfil estable primero:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

Cambiar al perfil de caos cuando ya se entiende la línea de base:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

Las recetas para el despliegue de contratos se desactivarán en ciclos estables a menos que se permita explícitamente:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

Utilizar `--nexus` cuando la ejecución debe utilizar los valores predeterminados incrustados SORA Nexus del espacio de trabajo upstream.

## Controles de fallas {#fault-controls}

¿Cuándo? `--faulty` si es mayor que cero, se debe habilitar al menos un escenario de falla. El error cambia por defecto a activado, y las banderas booleanas se pueden deshabilitar con `=false`.

|Culpa |Bandera CLI |¿ Qué ejerce ?|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|Crash y reinicio .|`--fault-enable-crash-restart` |Pérdida y recuperación del proceso entre pares |
|Eliminar el almacenamiento y reiniciar |`--fault-enable-wipe-storage` |Recuperación del estado local desaparecido |
|Spam de transacciones inválidas |`--fault-enable-spam-invalid-transactions` |Recursos de admisión y rechazo |
|Latencia de la red |`--fault-enable-network-latency` |Los chismes lentos y los mensajes de consenso retrasados .|
|Partición de red |`--fault-enable-network-partition` |El aislamiento temporal entre pares de confianza |
|CPU tensión |`--fault-enable-cpu-stress` |Presión de validación y programación local |
|Saturación del disco |`--fault-enable-disk-saturation` |Presión local de almacenamiento |

Para una ejecución solo en partición de red:

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

Utilice `--fault-window-start` y `--fault-window-end` para mantener un período de estado estacionario controlado antes y después del fallo inyectado. Esto facilita la distinción entre el ruido de inicio y el efecto de la falla.

## Las formas del escenario {#scenario-shapes}

El catálogo Izanami upstream mapea las formas comunes de fallas en la comunicación blockchain a los perfiles CLI. Puedes modelarlas con las mismas banderas:

|Escenario |Forma típica |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|Carga dirigida |`--faulty 0`, alto `--tps`, uno de los remitentes, elevado `--max-inflight` |
|Fallo transitorio |Habilitar el bloqueo/reinicio sólo dentro de una ventana de falla limitada |
|Detenerse y recuperarse|Usar una gran población de pares defectuosos con choque/reinicio |
|El aislamiento de los líderes |Utilice exactamente un peer defectuoso con sólo la falla de partición de red; Izanami sigue Sumeragi líder telemetría |

Mantenga una variable fija a la vez. Si cambia el número de pares, perfil de carga de trabajo, ventana de fallas y TPS en la misma ejecución, el resultado es difícil de interpretar.

## Lo que hay que ver {#what-to-watch}

Durante la carrera, observe las mismas señales utilizadas para la validación del rendimiento:

- progreso en la altura de los bloques a través de todos los pares corrientes
- transacciones presentadas, aceptadas, rechazadas y transcurridas por tiempo
- profundidad de la cola, saturación de la cola y retropresión en el punto final
- cambios de visualización, vías de recuperación, bloques faltantes y certificados de quórum faltantes
- el registro de disponibilidad RS16 firmado, las sesiones pendientes y el tráfico de consenso atrasado
- CPU, memoria, disco y saturación de la red en el host ejecutando los pares

Para el análisis de la latencia de validación, habilite los registros de depuración del circuito principal:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

Cada bloque debe emitir `block validation timings` con `stateless_ms`, `execution_ms` y `total_ms`. Compara esos tiempos con los intervalos de bloques p95, contadores de cambio de vista y presión en la cola antes de cambiar los temporizadores de consenso.

## Interpretación de los resultados {#interpreting-results}

Tratar una carrera como saludable cuando todos los pares seleccionados continúen cometiendo bloques, el backlog no crece sin límite y las fallas dejan de causar nueva actividad de recuperación después de que finalice la ventana configurada.

Tratar una carrera como un fracaso cuando:

- los puestos de progreso del bloque más largos que `--progress-timeout`
- Las alturas de los pares divergen y no se reconvergen.
- la latencia de p95 excede `--latency-p95-threshold`
- Las colas crecen durante el resto de la carrera después de que una ventana de falla se cierra
- las transacciones rechazadas o transcurridas por tiempo no se explican por la carga de trabajo seleccionada
- Reinicio de pares, limpieza de almacenamiento o recuperación de particiones requiere una limpieza manual.

Después de un fallo, vuelva a ejecutar con la misma semilla y un tipo de falla menos. Esto mantiene la carga de trabajo y el tiempo reproducibles mientras que estrecha la superficie del fallo.

## Páginas relacionadas {#related-pages}

- [Desempeño y métricas ](./metrics.md)
- [Funcionando Iroha en el metal desnudo](./running-iroha-on-bare-metal.md)
- [Puntos finales Torii](../../reference/torii-endpoints.md)
