---
translation_locale: es
translation_source: /blockchain/consensus.md
translation_source_hash: a4c59672f20f0a3363fdd098852a7e0e8159fa082e88825d6346731733ecdcb0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import { withBase } from 'vitepress'
</script>

# Consenso {#consensus}

Las transacciones entran en una cola antes de que Sumeragi las proponga en un bloque. Los validadores validan y ejecutan la propuesta de forma independiente, luego firman solo la transición del estado que pueden reproducir. Un bloque se compromete después de que el quórum de validador requerido esté de acuerdo con ese resultado y la carga útil correspondiente esté disponible.

Todas las redes Iroha 3 utilizan las vías de disponibilidad de datos y difusión fiables. Son requisitos de consenso, no características opcionales de implementación.

## Sumeragi {#sumeragi}

Sumeragi es el motor de consenso tolerante a las fallas bizantinas de Iroha. Toma transacciones desde la cola, hace que los pares del validador acuerden sobre el mismo bloque ordenado y finaliza ese bloque solo después de que suficientes validadores hayan reproducido el mismo resultado y firmado el certificado de compromiso.

<img :src="withBase('/sumeragi-round-dataflow.svg')" alt="Sumeragi proposal-to-commit data flow" />

### Proyecto de propuesta y compromiso {#proposal-and-commit-path}

Sumeragi corre el libro mayor hacia adelante una altura de bloques a la vez. En cada altura, un validador actúa como proponente para la vista actual. El proponente elimina las transacciones elegibles de la cola, construye un bloque candidato y anuncia la propuesta al conjunto activo de validadores.

El mismo Sumeragi se utiliza tanto en las implementaciones de prueba de participación autorizada como nominada (NPoS):

1. Un validador propone un bloqueo de las transacciones en cola.
2. Los validadores validan la propuesta ejecutando las transacciones contra el mismo Estado mundial.
3. Los validadores intercambian votos y certificados de quórum por la altura y la vista actuales.
4. Una vez que se alcanza el quórum del comité, los compañeros cometen el bloqueo y actualizan su estado mundial.

Los validadores solo firman datos que pueden reproducir localmente. Antes de votar, un validador verifica si la propuesta pertenece a la cadena, altura y vista esperadas; si las firmas de transacción y los límites son válidos; si el enrutamiento del carril y la validación del ejecutor son deterministas; Si el resultado local difiere, el validador rechaza la propuesta en lugar de votar a favor.

Los votos son pequeños mensajes de consenso firmados que se refieren al bloque propuesto, la altura, la vista y la identidad del validador. El certificado es la prueba duradera de que suficientes validadores han observado el mismo resultado para un mismo bloque.

### Quórum, recolectores y observadores {#quorum-collectors-and-observers}

El recuento de validadores de votación `n` define el presupuesto de fallas bizantinas. Para las redes con al menos cuatro validadores, el presupuesto es `f = floor((n - 1) / 3)` y el quórum de comisión es `2f + 1`. Para uno o tres validadores, se requieren todos los validadores para comprometerse, lo cual es útil para el desarrollo pero no tiene un tiempo práctico fuera de línea.

Los coleccionistas son una optimización de fanout. En lugar de que cada validador envíe todos los votos a cada otro validador, Sumeragi puede seleccionar uno o más coleccionists para una altura. Las configuraciones efectivas del colector se exponen a través de `GET /v1/sumeragi/collectors`; la instantánea `ops sumeragi telemetry` del CLI informa el recuento actual de los colectores.

Los pares de observadores pueden sincronizar bloques comprometidos, pero no proponen, votan, recogen votos o cuentan para el quórum del comité. ¿ Qué ? Usar observadores cuando una implementación necesita capacidad local de consulta, indexación, monitoreo, O la replicación de bloques regionales sin aumentar el número de validadores del voto.

### Vea cambios y recuperación {#view-changes-and-recovery}

Una vista es el intento de Sumeragi de finalizar una altura con un proponente en particular y un plan cronológico. Si la propuesta, carga útil, votación o compromiso de progreso quedan estancados, el marcapasos puede mover la altura a una vista posterior. Cambia la forma en que los validadores tratan de terminar la altura no comprometida, llevando adelante el quórum más alto conocido o comprometer pruebas para que los compañeros no finalicen bloques contradictorios.

La recuperación de carga útil está separada de la decisión de finalidad. Un peer puede recibir un quórum o certificado de compromiso antes de tener la carga útil completa del bloque. En ese caso, el peer utiliza una transmisión confiable (RBC) o sincronización de bloques para recuperar la carga útil, lo verifica contra los hashes anunciados. y sólo entonces se aplica el bloque al estado mundial y Kura.

### Modalidades de consenso {#consensus-modes}

El modo seleccionado controla cómo se forma y opera el conjunto de validadores. Se declara en génesis a través de [`consensus_mode`](/es/reference/genesis.md) y en configuración por pares a través de [`sumeragi.consensus_mode`. Trata como un estado de toda la red: los validadores necesitan el mismo genesis firmado, topología, datos confiables de pares y parámetros eficaces Sumeragi.

<img :src="withBase('/sumeragi-mode-dataflow.svg')" alt="Sumeragi consensus mode data flow" />

|El modo |El mejor ajuste .|Configuración de validador |Enfoque operativo |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
|Se lo permite .|Redes privadas, de consorcio y gestionadas por los operadores |Los validadores provienen de la topología confiable acordada por el despliegue |Mantenga todos los validadores en la misma genesis firmada, compañeros de confianza, claves de pares y parámetros Sumeragi |
|NPOS |Redes públicas o orientadas a Nexus en las que la validación se siga de la política de nominación y participación |Los validadores se seleccionan por el perfil de NPoS, generalmente a través de épocas, y requieren claves BLS más pruebas de posesión |Mantenga las instantáneas de la apuesta, los parámetros de época, el validador PoPs, y los tiempos de fase NPoS alineados en toda la red |

::: tip Modo permitido

Utilice el modo autorizado cuando la lista de validadores sea una opción operativa explícita. Este es el punto de partida habitual para los autoservicios. Iroha las redes porque los cambios de membresía son acciones deliberadas de gobierno o administradores. La regla operativa importante es que todos los validadores deben funcionar con la misma visión de la génesis, compañeros de confianza, BLS Pruebas de posesión, y Sumeragi Un único par con una topología diferente o un genesis firmado puede evitar que la red se comprometa.

:::

::: tip Modo de NPOS

Utilice el modo NPoS cuando el perfil de implementación espera que la participación del validador sea impulsada por la nominación y el estado de apuesta. Las implementaciones públicas SORA Nexus utilizan NPoS, y sus perfiles generados incluyen las identidades del validador BLS, Pruebas de posesión, configuraciones de época, y Sumeragi Parámetros de NPoS necesarios para la puesta en marcha. Los cambios de época pueden reemplazar el validador activo establecido a alturas definidas, por lo que los operadores deben monitorear tanto la salud del consenso como el estado de participación o nominación que alimenta a la lista siguiente.

:::

## Consenso multiláneo {#multilane-consensus}

El camino de consenso multilaneal de Iroha se implementa a través de la configuración de carril y espacio de datos Nexus. No inicia una instancia de consenso separada para cada carril. Sumeragi todavía finaliza un flujo de bloques ordenado; carriles describen cómo las transacciones se ruten, programan, contabilizan y almacenan dentro de ese flujo.

La configuración del tiempo de ejecución construye tres piezas de estado de carril:

- `lane_catalog`: los carriles configurados, cada uno con un nombre numérico `LaneId`, alias, espacio de datos, visibilidad, perfil de almacenamiento, esquema de prueba y metadatos.
- `dataspace_catalog`: los espacios de datos configurados, cada uno con una cifra `DataSpaceId` y un valor de tolerancia a fallas utilizado para el tamaño del comité de retransmisión.
- `routing_policy`: el par de carril/espacio de datos predeterminado y las reglas de enrutamiento ordenadas que pueden coincidir con las cuentas o los caminos de instrucción.

Cuando una transacción entra en la cola, el router de carril lo resuelve a un `RoutingDecision { lane_id, dataspace_id }`. En modo de carril único esto es siempre carril `0` y el espacio de datos universal. En el modo Nexus, el enrutador configurado aplica reglas a escala de espacio de datos, rotación de liquidación, reglas de cuenta, reglas explícitas de rotación y, finalmente, la ruta predeterminada. El carril resuelto y el espacio de datos deben existir en sus catálogos, y el carril debe estar ligado al espacio de datos resuelto; de lo contrario, la transacción se rechaza antes de que se coloque en fila.

La cola mantiene esta decisión de enrutamiento con el hash de la transacción para que las etapas posteriores no tengan que inferirlo nuevamente.

- Intercambia las transacciones por carril para que un carril no domine el bloque solo porque sus transacciones fueron colocadas en cola primero.
- Se aplican límites de unidad de ejecución de transacciones por carril (TEU). Las transacciones que superen la capacidad configurada de un carril se aplazan y requieren, excepto que se puede admitir la primera transacción con sobrepeso para un carril para evitar el bloqueo de vida.

Durante la transmisión confiable, Sumeragi agrega la carga útil propuesta por carril y espacio de datos. Los totales registrados incluyen el recuento de transacciones, trozos de transmisión, bytes de carga útil y TEU. Después del compromiso, esos totales se convierten en las instantáneas de compromiso de carril y espacio de datos expuestas a través del estado Sumeragi. Si un bloque contiene recibos de liquidación de carriles, el procesamiento de bloques también crea compromisos de liquidacion de carriles y sobres de relé que vinculan el encabezado del bloque, el certificado de compromiso, el hash de compromiso de disponibilidad de datos, la prueba de liquidacin y el tamaño de la carga útil del carril.

## Difusión confiable (RBC) {#reliable-broadcast-rbc}

La transmisión confiable (RBC) es la ruta de difusión y recuperación de la carga útil de Sumeragi. Ayuda a los validadores y observadores a obtener el cuerpo del bloque que pertenece a una propuesta o al certificado de compromiso, especialmente cuando se retrasa o se pierde un mensaje `BlockCreated`, actualización de sincronización de bloques o transferencia directa de carga útil.

RBC trabaja en el nivel de carga útil. El proponente anuncia una sesión RBC para un hash de altura de bloque, vista y carga útil, luego envía trozos de carga útil a través de la topología de commit. Los pares rastrean el recibo de las piezas, validan la carga útil recuperada con respecto al hash anunciado y intercambian señales `READY` y `DELIVER` una vez que suficientes validadores hayan observado la misma carga útil. Las sesiones están limitadas por TTL, pedazo, fanout, almacenamiento pendiente y límites de almacenamiento persistentes para que el tráfico de recuperación no pueda crecer sin límite.

RBC no es una decisión de consenso separada y no sustituye el certificado de compromiso. Un bloque todavía se finaliza solo cuando el par tiene un certificado de compromiso válido y la carga útil correspondiente localmente. RBC contribuye con pruebas obligatorias de disponibilidad y recuperación de la carga útil, mientras que el progreso del compromiso está impulsado por el certificado commit más la carga útil local. Si el certificado llega antes de la carga utile, el peer puede recuperar la carga útil a través de RBC o sincronización de bloque y luego comprometerse.

Operativamente, RBC es útil para el diagnóstico de los cuellos de botella en la falta de carga útil y en la disponibilidad de datos:

- `iroha --output-format text ops sumeragi telemetry` muestra los votos de disponibilidad agregados, el número actual de coleccionistas y las sesiones pendientes de RBC.
- `GET /v1/sumeragi/rbc` y `GET /v1/sumeragi/rbc/sessions` exponer datos detallados de sesiones agregadas y activas sobre Torii, incluido el progreso de las piezas, la preparación, el estado de entrega y el retraso del carril o espacio de datos; ver. [Torii puntos finales](/es/reference/torii-endpoints.md).
- Las señales Prometheus como `sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total`, y los indicadores de retraso por vía o espacio de datos RBC ayudan a separar la pérdida de red, la recuperación de fragmentos y la presión de almacenamiento; ver [Performance and metrics](/es/guide/advanced/metrics.md).

Kura utiliza la configuración de carril derivada para el diseño del almacenamiento. Cada carril recibe nombres deterministas de almacenamiento como `blocks/lane_000_core` y `merge_ledger/lane_000_core_merge.log`; los cambios en el ciclo de vida del carril pueden proporcionar, retirar o reetiquetar esos segmentos sin cambiar el orden global de bloques.
