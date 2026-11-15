---
translation_locale: es
translation_source: /blockchain/consensus.md
translation_source_hash: ebdf564d607b96f7f186637044d80b2f1bb7c9fbe6080a061d27d02ec6f8cf62
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Consenso {#consensus}

Las transacciones entran en una cola antes de que Sumeragi las proponga en un bloque. Los validadores verifican y ejecutan independientemente la propuesta, luego firman solo la transición de estado que pueden reproducir. Un bloque se confirma después de que el quórum de validadores requerido esté de acuerdo con ese resultado y esté disponible la carga útil correspondiente.

Todas las redes Iroha 3 utilizan manifiestos técnicos de disponibilidad de datos RS16 firmados y fragmentos, además de recuperación por un organismo certificado. La disponibilidad de datos es un requisito de consenso, no una característica opcional de implementación.

## Sumeragi {#sumeragi}

Sumeragi es el motor de consenso tolerante a fallos bizantinos de Iroha. Toma transacciones de la cola, hace que los pares de la red de validadores estén de acuerdo en el mismo bloque ordenado, y finaliza ese bloque solo después de que suficientes validadores hayan reproducido el mismo resultado y firmado el certificado de compromiso del consenso.

### Ruta de propuesta y confirmación {#proposal-and-commit-path}

Sumeragi hace avanzar el libro mayor una altura de bloque cada vez. En cada altura, un validador actúa como proponente de la vista actual. El proponente extrae de la cola las transacciones aptas, construye un bloque candidato y anuncia la propuesta al conjunto activo de validadores. Las cadenas inactivas no producen bloques vacíos.

La misma canalización de procesamiento Sumeragi se utiliza tanto en implementaciones con permisos como en Proof-of-Stake Nominado (NPoS):

1. Un validador propone un bloque a partir de transacciones en cola.
2. Los validadores validan la propuesta ejecutando las transacciones contra el mismo estado mundial.
3. Los validadores intercambian votos y certificados de quórum de consenso para la altura y vista actuales.
4. Una vez que se alcanza el quórum de confirmación, los pares de la red confirman el bloque y actualizan su estado mundial.

Los validadores firman solo los datos que pueden reproducir localmente. Antes de votar, un validador verifica que la propuesta pertenezca a la cadena, altura y vista esperadas; que las firmas de las transacciones y los límites cumplan con las reglas del protocolo; que el enrutamiento de la línea de ejecución y la validación del ejecutor sean deterministas; y que la ejecución de la carga útil produce la transición de estado esperada. Si el resultado local difiere, el validador rechaza la propuesta en lugar de votar a favor de ella.

Los votos son pequeños mensajes de consenso firmados. Se refieren al bloque propuesto, la altura, la vista y la identidad del validador. Las firmas verificadas forman certificados de quórum de consenso de preparación y compromiso. Un certificado de compromiso de consenso es la prueba duradera de que suficientes validadores observaron el mismo resultado para el mismo bloque. Los validadores del conjunto A normalmente envían sus votos de Preparar y Comprometer a la cola proxy de la ronda, que agrega exactamente los votos iguales requeridos y difunde el certificado. Si un certificado se retrasa, los validadores del conjunto B también votan a la cola proxy; como último recurso, cada validador difunde su voto y cualquier validador puede agregar el certificado.

### Quórum y observadores {#quorum-and-observers}

El protocolo de la primera versión solo admite un comité de votación de exactamente `3f + 1` miembros, con entre 4 y 31 validadores. Por tanto, los tamaños válidos son 4, 7, 10, y así sucesivamente, hasta 31. Para `n = 3f + 1`, el número tolerado de fallos bizantinos es `f` y el quórum de confirmación es `2f + 1`. La generación del génesis y la validación al arrancar rechazan cualquier otra composición del comité. Cada PrepareQC, CommitQC y TimeoutCert contiene exactamente `q = n - f` votos de validadores con el mismo peso; se rechazan los superconjuntos de firmantes.

Los nodos observadores de la red pueden sincronizar bloques comprometidos, pero no proponen, no votan ni cuentan para el quórum de compromiso. Use observadores cuando una implementación necesite capacidad de consulta local, indexación, monitoreo o replicación de bloques regional sin aumentar el número de validadores votantes.

### Ver cambios y recuperación {#view-changes-and-recovery}

Una vista es el intento de Sumeragi de finalizar una altura con un proponente y una planificación determinados. Si se bloquea el avance de la propuesta, la carga, la votación o la confirmación, el marcapasos del consenso puede trasladar la altura a una vista posterior. Un cambio de vista no reescribe un bloque confirmado: cambia la forma en que los validadores intentan completar la altura pendiente y conserva el quórum o la prueba de confirmación más altos conocidos para evitar bloques contradictorios.

La recuperación de la carga útil es independiente de la decisión de finalización. Un par de la red podría recibir un certificado de compromiso de quórum o consenso antes de tener la carga útil completa del bloque. En ese caso, el par de la red solicita fragmentos de carga útil firmados RS16 o un cuerpo certificado, verifica los bytes recuperados contra los hashes criptográficos anunciados, y solo entonces aplica el bloque al estado mundial y Kura.

### Modos de consenso {#consensus-modes}

El modo seleccionado controla cómo se forma y opera el conjunto de validadores. Se declara en el génesis firmado mediante [`consensus_mode`](/es/reference/genesis.md) y queda fijado en el contexto de cada altura. La configuración local de `[sumeragi]` selecciona el rol del nodo, la custodia de la firma, las rutas de los registros de seguridad y los ajustes documentados de tiempos de espera y sincronización. Los límites de bloques y transacciones, el modo de consenso y la cadencia proceden del génesis firmado y del estado confirmado. Los validadores necesitan el mismo génesis firmado, la misma topología, los mismos datos de pares de confianza y los mismos parámetros efectivos de Sumeragi.

|Modo|Mejor ajuste|Conjunto de validadores|Enfoque operativo|
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
|Con permiso|Redes privadas, de consorcio y gestionadas por operadores|Los validadores proceden de la topología de pares de confianza acordada para el despliegue|Mantenga iguales en todos los validadores el génesis firmado, los pares de confianza, las claves de los pares y los parámetros de Sumeragi|
| NPoS | Redes públicas u orientadas a SORA Nexus donde la validación sigue la política de nominación y participación | El perfil NPoS selecciona los validadores, normalmente a lo largo de épocas, y exige claves BLS y pruebas de posesión | Mantenga alineadas en toda la red las instantáneas de participación, las entradas firmadas de época y elección, las PoPs de los validadores y la cadencia inmutable de bloques |

::: tip Modo con permiso

Utilice el modo con permisos cuando la lista de validadores sea una elección operativa explícita. Este es el punto de partida habitual para las redes Iroha autoalojadas porque los cambios en la membresía son acciones deliberadas de gobernanza o del administrador. La regla operativa importante es que cada validador debe operar con la misma visión del génesis de la blockchain, pares de red confiables, Pruebas de Posesión BLS, y parámetros Sumeragi. Un único nodo de la red con una topología diferente o un génesis de blockchain firmado puede impedir que la red se comprometa.

:::

::: tip modo NPoS

Use el modo NPoS cuando el perfil de implementación espera que la participación de los validadores sea impulsada por la nominación y el estado de participación. Las implementaciones públicas SORA Nexus usan NPoS, y sus perfiles generados incluyen las identidades de los validadores BLS, Pruebas de Posesión, configuraciones de época, y los parámetros NPoS Sumeragi necesarios al iniciar. Los cambios de época pueden reemplazar el conjunto de validadores activos en alturas definidas, por lo que los operadores necesitan supervisar tanto la salud del consenso como el estado de participación o nominación que alimenta la siguiente lista.

:::

## Consenso multinivel {#multilane-consensus}

Los espacios de datos definen entornos para los datos, la autoridad, las políticas y las aplicaciones. Sus carriles añaden capacidad de difusión y certificación. Los catálogos son independientes: `nexus.dataspace_catalog` define espacios de datos, y `nexus.lane_catalog` define carriles, cada uno de los cuales hace referencia a un espacio de datos. Varios carriles pueden compartir un mismo espacio de datos.

Para la ejecución pública global, la instancia global de Sumeragi secuencia el carril `0`. Cada otra encarnación activa de un carril ejecuta una instancia independiente del mismo núcleo de Sumeragi, con su comité y sus parámetros de consenso fijados. Su bloque certificado contiene un lote ordenado de transacciones cuya admisión se comprueba frente a un ancla global confirmada. La certificación de un carril no modifica el State global.

La cadena global fusiona los siguientes bloques certificados contiguos de cada carril. La ejecución del bloque global resultante aplica esas transacciones en orden canónico, y el CommitQC global da finalidad a esa ejecución. Por tanto, un certificado de carril por sí solo no basta para afirmar que una transacción haya modificado el State global. La identidad del carril, su encarnación, la vigencia del ancla, la custodia de la fuente y los límites contiguos de la fusión se siguen comprobando durante la recuperación y la ejecución.

La política `sumeragi_lane_policy` confirmada gobierna los carriles fijos, las rutas, los comités y el escalado automático. Un catálogo de configuración por sí solo no activa un carril de consenso. Los destinos concretos de un espacio de datos deben resolverse a un carril admitido que coincida; si una ruta privada no está disponible, se rechaza en vez de ejecutarla como trabajo universal. Los lotes completos del plano de control se enrutan por el carril `0` para que puedan avanzar las transiciones de catálogo y activación.

Una raíz de espacio de datos firmada de forma independiente constituye un límite de ejecución separado, con su propio State y su propia finalidad local. Registrar una entrada en el catálogo de espacios de datos no crea esa raíz. La atomicidad entre raíces utiliza el protocolo independiente AMX. La validación para uso monetario y para la red completa de esta vía sigue pendiente en el candidato fijado.

Consulte la [implementación de carriles](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/sumeragi/lanes/mod.rs), el [contrato de carriles](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi_lanes.md), el [contrato de espacios de datos independientes](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi.md) y el [estado de validación](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi_goals.md) de la revisión fijada.

## Disponibilidad de datos y recuperación de carga útil {#data-availability-and-payload-recovery}

Sumeragi V1 proporciona disponibilidad global de la carga útil mediante mensajes RS16 firmados `PayloadManifest` y `PayloadChunk`. El líder envía el manifiesto firmado y cada fila firmada a todos los demás miembros del comité y a los miembros que se incorporan al siguiente comité. Un validador solo puede votar en Prepare después de reconstruir el cuerpo canónico, validar el manifiesto y los hashes de los fragmentos, almacenar el cuerpo de forma duradera y completar la validación determinista. Un par al que le faltan filas las solicita con `PayloadRequest`. La recuperación de cuerpos certificados y la sincronización de bloques ofrecen una vía de recuperación acotada cuando un par conoce la finalidad antes de recibir el cuerpo.

Cada instancia de carril utiliza su propio contexto autenticado de disponibilidad y certificados. Las comprobaciones de fusión global vinculan su lote certificado y su carga útil original a la encarnación y al ancla esperadas. Un par solo aplica la finalidad global cuando dispone localmente de la carga útil global correspondiente y de un CommitQC válido.

Utilice las superficies de operador autenticadas en lugar de un endpoint RBC API separado:

- `iroha --operator-private-key-file <path> --output-format text ops sumeragi status` informa la altura, vista, fase, certificados y estado de vivacidad autorizados.
- `iroha --operator-private-key-file <path> --output-format text ops sumeragi diagnostics` muestra, de forma no autoritativa, la presión de la cola de transacciones, el estado de la elección NPoS y el estado de los manifiestos de gobernanza de carriles.
- Las series de Prometheus por instancia, como `sumeragi_fetch_requests_total` (`kind="body"` para cuerpos faltantes, `kind="sync"` para la puesta al día), `sumeragi_view_changes_total`, `sumeragi_round_stage` y `sumeragi_dropped_total`, llevan una etiqueta `lane` y separan la recuperación de cuerpos faltantes, los cambios de vista y los descartes de colas acotadas; ver [Rendimiento y métricas](/es/guide/advanced/metrics.md).

Los almacenes de bloques de los carriles conservan los lotes certificados y los registros de origen necesarios para la fusión y la recuperación. Su ciclo de vida sigue la encarnación confirmada del carril; el nombre de un directorio de almacenamiento no autoriza un nuevo carril ni una nueva raíz de ejecución.
