---
translation_locale: es
translation_source: /blockchain/consensus.md
translation_source_hash: fdc9a35ac2e43acda076104063b5a364feb5060a70473b51cf016b8adb1306d3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Consenso {#consensus}

Las transacciones entran en una cola antes de que Sumeragi las proponga en un bloque. Los validadores verifican y ejecutan independientemente la propuesta, luego firman solo la transición de estado que pueden reproducir. Un bloque se confirma después de que el quórum de validadores requerido esté de acuerdo con ese resultado y esté disponible la carga útil correspondiente.

Todas las redes Iroha 3 utilizan manifiestos técnicos de disponibilidad de datos RS16 firmados y fragmentos, además de recuperación por un organismo certificado. La disponibilidad de datos es un requisito de consenso, no una característica opcional de implementación.

## Sumeragi {#sumeragi}

Sumeragi es el motor de consenso tolerante a fallos bizantinos de Iroha. Toma transacciones de la cola, hace que los pares de la red de validadores estén de acuerdo en el mismo bloque ordenado, y finaliza ese bloque solo después de que suficientes validadores hayan reproducido el mismo resultado y firmado el certificado de compromiso del consenso.

### Ruta de propuesta y confirmación {#proposal-and-commit-path}

Sumeragi avanza el libro mayor de la blockchain un bloque de altura a la vez. En cada altura, un validador actúa como proponente para la vista actual. El proponente extrae transacciones elegibles de la cola, construye un bloque candidato y anuncia la propuesta al conjunto de validadores activos.

La misma canalización de procesamiento Sumeragi se utiliza tanto en implementaciones con permisos como en Proof-of-Stake Nominado (NPoS):

1. Un validador propone un bloque a partir de transacciones en cola.
2. Los validadores validan la propuesta ejecutando las transacciones contra el mismo estado mundial.
3. Los validadores intercambian votos y certificados de quórum de consenso para la altura y vista actuales.
4. Una vez que se alcanza el quórum de confirmación, los pares de la red confirman el bloque y actualizan su estado mundial.

Los validadores firman solo los datos que pueden reproducir localmente. Antes de votar, un validador verifica que la propuesta pertenezca a la cadena, altura y vista esperadas; que las firmas de las transacciones y los límites cumplan con las reglas del protocolo; que el enrutamiento de la línea de ejecución y la validación del ejecutor sean deterministas; y que la ejecución de la carga útil produce la transición de estado esperada. Si el resultado local difiere, el validador rechaza la propuesta en lugar de votar a favor de ella.

Los votos son pequeños mensajes de consenso firmados. Se refieren al bloque propuesto, la altura, la vista y la identidad del validador. Las firmas verificadas forman certificados de quórum de consenso de preparación y compromiso. Un certificado de compromiso de consenso es la prueba duradera de que suficientes validadores observaron el mismo resultado para el mismo bloque. Cada validador envía sus votos de Preparar y Comprometer al comité completo; cualquier validador puede agregar los votos iguales requeridos y difundir el certificado resultante.

### Quórum y observadores {#quorum-and-observers}

El protocolo de primera versión admite solo un comité de votación exacto `3f + 1`, de 4 a 31 validadores. Por lo tanto, los tamaños válidos son 4, 7, 10, y así sucesivamente, hasta 31. Para `n = 3f + 1`, el presupuesto de fallos bizantino es `f` y el quórum de commit es `2f + 1`. La generación del génesis de la blockchain y la validación de inicio rechazan cualquier otra geometría del comité.

Los nodos observadores de la red pueden sincronizar bloques comprometidos, pero no proponen, no votan ni cuentan para el quórum de compromiso. Use observadores cuando una implementación necesite capacidad de consulta local, indexación, monitoreo o replicación de bloques regional sin aumentar el número de validadores votantes.

### Ver cambios y recuperación {#view-changes-and-recovery}

Una vista es el intento de Sumeragi de finalizar una altura con un proponente y una planificación determinados. Si se bloquea el avance de la propuesta, la carga, la votación o la confirmación, el marcapasos del consenso puede trasladar la altura a una vista posterior. Un cambio de vista no reescribe un bloque confirmado: cambia la forma en que los validadores intentan completar la altura pendiente y conserva el quórum o la prueba de confirmación más altos conocidos para evitar bloques contradictorios.

La recuperación de la carga útil es independiente de la decisión de finalización. Un par de la red podría recibir un certificado de compromiso de quórum o consenso antes de tener la carga útil completa del bloque. En ese caso, el par de la red solicita fragmentos de carga útil firmados RS16 o un cuerpo certificado, verifica los bytes recuperados contra los hashes criptográficos anunciados, y solo entonces aplica el bloque al estado mundial y Kura.

### Modos de consenso {#consensus-modes}

El modo seleccionado determina cómo se forma y funciona el conjunto de validadores. Se declara mediante [`consensus_mode`](/es/reference/genesis.md) en el génesis firmado y queda fijado en el contexto de cada altura. La configuración local `[sumeragi]` solo elige el rol del nodo y los límites finitos de bloques, cola, entorno de ejecución, almacenamiento y política de claves; no puede sustituir el modo ni la cadencia de bloques. Todos los validadores necesitan el mismo génesis firmado, la misma topología, los mismos datos de pares de confianza y los mismos parámetros efectivos de Sumeragi.

|Modo|Mejor ajuste|Conjunto de validadores|Enfoque operativo|
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
|Con permiso|Redes privadas, de consorcio y gestionadas por operadores|Los validadores proceden de la topología de pares de confianza acordada para el despliegue|Mantenga iguales en todos los validadores el génesis firmado, los pares de confianza, las claves de los pares y los parámetros de Sumeragi|
|NPoS|Redes públicas u orientadas a Nexus donde la validación sigue las políticas de nominación y participación|El perfil NPoS selecciona los validadores, normalmente por épocas, y exige claves BLS y pruebas de posesión|Mantenga sincronizadas en toda la red las instantáneas de participación, las entradas firmadas de época y elección, las PoPs de validadores y la cadencia inmutable de bloques|

::: tip Modo con permiso

Utilice el modo con permisos cuando la lista de validadores sea una elección operativa explícita. Este es el punto de partida habitual para las redes Iroha autoalojadas porque los cambios en la membresía son acciones deliberadas de gobernanza o del administrador. La regla operativa importante es que cada validador debe operar con la misma visión del génesis de la blockchain, pares de red confiables, Pruebas de Posesión BLS, y parámetros Sumeragi. Un único nodo de la red con una topología diferente o un génesis de blockchain firmado puede impedir que la red se comprometa.

:::

::: tip modo NPoS

Use el modo NPoS cuando el perfil de implementación espera que la participación de los validadores sea impulsada por la nominación y el estado de participación. Las implementaciones públicas SORA Nexus usan NPoS, y sus perfiles generados incluyen las identidades de los validadores BLS, Pruebas de Posesión, configuraciones de época, y los parámetros NPoS Sumeragi necesarios al iniciar. Los cambios de época pueden reemplazar el conjunto de validadores activos en alturas definidas, por lo que los operadores necesitan supervisar tanto la salud del consenso como el estado de participación o nominación que alimenta la siguiente lista.

:::

## Consenso multinivel {#multilane-consensus}

El camino de consenso multinivel de Iroha se implementa a través de la vía de ejecución Nexus y la configuración del espacio de datos. No inicia una instancia de consenso separada para cada vía de ejecución. Sumeragi todavía finaliza un flujo de bloques ordenados; las líneas de ejecución describen cómo se enrutan, programan, contabilizan y almacenan las transacciones dentro de ese flujo.

La configuración de tiempo de ejecución del software construye tres partes del estado de la línea de ejecución:

- `nexus.lane_catalog`: los carriles de ejecución configurados, cada uno con un `LaneId` numérico, alias, espacio de datos, visibilidad, perfil de almacenamiento, esquema de prueba y metadatos.
- `nexus.dataspace_catalog`: los espacios de datos configurados, cada uno con un `DataSpaceId` numérico y un valor de tolerancia a fallos utilizado para el dimensionamiento del comité de retransmisión.
- `nexus.routing_policy`: el par predeterminado de carril/espacio de datos y las reglas de enrutamiento ordenadas que pueden coincidir con cuentas o rutas de instrucciones.

Cuando una transacción entra en la cola, el enrutador de carril de ejecución la resuelve a un `RoutingDecision { lane_id, dataspace_id }`. En el modo de un solo carril, esto es siempre el carril de ejecución `0` y el espacio de datos universal. En el modo Nexus, el router configurado aplica reglas con alcance de espacio de datos, enrutamiento de liquidación, reglas de cuenta, reglas de enrutamiento explícitas y, finalmente, la ruta predeterminada. La vía de ejecución resuelta y el espacio de datos deben existir en sus catálogos, y la vía de ejecución debe estar vinculada al espacio de datos resuelto; de lo contrario, la transacción es rechazada antes de ser encolada.

La cola mantiene esta decisión de enrutamiento con el hash criptográfico de la transacción para que las etapas posteriores no tengan que inferirlo nuevamente. La construcción de la propuesta luego utiliza los metadatos del carril de ejecución de dos maneras:

- Intercala transacciones por carril de ejecución para que un carril de ejecución no domine el bloque solo porque sus transacciones fueron encoladas primero.
- Se aplican límites por unidad de ejecución de transacciones por carril (TEU). Las transacciones que excederían la capacidad configurada de un carril de ejecución se posponen y se reencolan, excepto que la primera transacción con sobrepeso para un carril de ejecución puede ser admitida para evitar un bloqueos vivos.

Durante la preparación del candidato, Sumeragi agrega la carga útil propuesta por carril de ejecución y espacio de datos, y deriva las identidades de disponibilidad de datos locales del carril. Los totales registrados incluyen el conteo de transacciones, fragmentos, bytes de carga útil y TEU. Después del commit, esos totales se convierten en la vía de ejecución y en los puntos de compromiso del espacio de datos en vistas de datos en tiempo puntual expuestas a través de diagnósticos autenticados Sumeragi. Si un bloque contiene registros de resultados del protocolo de liquidación de carriles de ejecución, el procesamiento del bloque también crea compromisos de liquidación de carriles de ejecución y datos de retransmisión contenedores que enlazan el encabezado del bloque, el certificado de compromiso de consenso, el hash criptográfico de compromiso de disponibilidad de datos, la prueba de liquidación y el tamaño de la carga útil del canal de ejecución.

## Disponibilidad de datos y recuperación de carga útil {#data-availability-and-payload-recovery}

Sumeragi v2 lleva la disponibilidad global de la carga útil a través de mensajes firmados RS16 `PayloadManifest` y `PayloadChunk`. El líder envía el manifiesto técnico firmado al comité completo y distribuye inicialmente los fragmentos determinísticos al Conjunto A. Un validador puede Preparar-voto solo después de reconstruir el cuerpo canónico, validar el manifiesto técnico y los hashes criptográficos de los fragmentos, almacenando el cuerpo de manera duradera, y completando la validación determinista. Si el camino rápido se detiene, la recuperación expande la entrega de bloques al Conjunto B. La recuperación de cuerpo certificado y la sincronización de bloques proporcionan la ruta de recuperación acotada cuando un par de la red aprende la finalización antes de recibir el cuerpo.

La ejecución multinivel además deriva un hash criptográfico determinista de propiedad de la carga útil y un hash criptográfico de instancia RBC local de carril para cada sujeto de carril de ejecución. Esas identidades vinculan las propuestas y certificados de la vía de ejecución con la transacción global del operador; no son una sesión de consenso global separada. Un bloque solo se finaliza cuando el par de la red tiene un certificado de compromiso de consenso válido y la carga útil correspondiente localmente.

Utilice las superficies de operador autenticadas en lugar de un endpoint RBC API separado:

- `iroha --operator-private-key-file <path> --output-format text ops sumeragi status` informa la altura, vista, fase, certificados y estado de vivacidad autorizados.
- `iroha --operator-private-key-file <path> --output-format text ops sumeragi diagnostics` muestra diagnósticos no vinculantes de la cola, el canal de procesamiento, NPoS, las vías de ejecución y los espacios de datos, incluida la propiedad de la carga útil de cada vía.
- Señales de Prometheus como `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total` y `sumeragi_da_gate_satisfied_total` separan la recuperación de cuerpos faltantes, las puertas de disponibilidad de datos y el manejo de mensajes; ver [Rendimiento y métricas](/es/guide/advanced/metrics.md).

Kura utiliza la configuración de carril de ejecución derivada para el diseño del almacenamiento. Cada carril de ejecución recibe nombres de almacenamiento deterministas como `blocks/lane_000_core` y `merge_ledger/lane_000_core_merge.log`; los cambios en el ciclo de vida del carril de ejecución pueden aprovisionar, desmantelar o renombrar esos segmentos sin cambiar el orden global de bloques.
