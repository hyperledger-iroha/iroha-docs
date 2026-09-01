---
translation_locale: es
translation_source: /get-started/atomic-private-settlement.md
translation_source_hash: d4c2c1a4e29e0352ac20be5320f79a2686527d55a19d65a6154aedcd63fa447e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ejecutar Liquidación Atómica Privada entre Espacios de Datos {#run-atomic-private-cross-dataspace-settlement}

`AtomicPrivateSettlementV1` coordina una parte de transferencia de acuerdo confidencial en cada uno de 2 a 255 SORA Nexus espacios de datos y finaliza cada tramo en un estado global transacción. Un paquete rechazado, caducado o abortado no aplica ninguna parte. Transparent Native AMX DvP/PvP sigue siendo una ruta de protocolo separada.

::: warning Estado de lanzamiento
Esta función está sujeta a gobernanza, está deshabilitada de forma predeterminada y todavía no está calificada para producción. No la habilite para valor real de CBDC hasta que se hayan superado, para la versión exacta, todos los criterios publicados de funcionalidad, privacidad, tolerancia a fallos, rendimiento, compilaciones reproducibles, revisión criptográfica independiente y publicación de artefactos.
:::

## Lo que oculta el protocolo {#what-the-protocol-hides}

Cada tramo utiliza una prueba de nota privada fija de dos entradas y tres salidas. Los validadores del comité verifican la prueba y una transición de estado opaca; no reciben las partes en texto claro, el activo, la cantidad, el memo ni el resultado comercial. Un auditor local autorizado descifra la cápsula de auditoría con relleno, verifica esos contenidos y firma una aprobación separada por propósito. La política predeterminada acepta una aprobación del conjunto de auditores gobernados.

La transacción portadora pública y el recibo revelan deliberadamente:

- los identificadores de red y de paquete
- rutas del espacio de datos de participantes y recuento de participantes
- temporización y alturas de vencimiento
- identificadores estables de conjuntos opacos, raíces, anuladores, compromisos y espacios de texto cifrado fijos
- principios de autorización del comité y disponibilidad exacta de 3 de 4, certificados de Preparar y Comprometer
- patrocinador, tarifa de red pública y estado del terminal

Esto es confidencialidad del contenido, no anonimato del flujo de tráfico. El tiempo, el número de participantes, la identidad del espacio de datos y la actividad de la reserva estable permanecen públicos. Un espacio de datos que aloje solo un CBDC también puede hacer que el activo sea deducible a partir de la ruta, aunque no se publique un identificador literal del activo.

## Requisitos de implementación {#deployment-requirements}

Antes de la activación, los operadores necesitan todo lo siguiente:

1. exactamente cuatro validadores por cada espacio de datos participante, con claves de consenso BLS distintas y pruebas de posesión
2. obligatorio Sumeragi DA/RBC habilitado para cada altura
3. un conjunto de acuerdos confidenciales gobernado y raíz inicial en cada espacio de datos
4. una capacidad de nota privada V1 activa y el perfil de prueba de liquidación separado
5. al menos un `PrivateSettlementAuditPolicyV1` local gobernado, incluyendo firma de auditor distinta y claves de cifrado híbrido, una época de clave, validez de altura y un umbral de aprobación
6. suficiente almacenamiento auxiliar privado de registros para el período de retención configurado
7. una cuenta patrocinadora neutral capaz de enviar la transacción portadora pública final

Un auditor también puede operar un validador, pero debe usar claves separadas de consenso, de firma del auditor y de cifrado del auditor. Conserve las claves de descifrado fuera de servicio durante el período de retención regulatorio, o gestione y pruebe el reempaquetado de cápsulas antes de retirarlas de servicio.

La autoridad de cuatro validadores está anclada en el estado; no la aporta el cliente. En el `authority_context_height` del manifiesto, cada validador obtiene del estado de consenso la lista ordenada exacta de vías y espacios de datos, así como la encarnación activa de la vía; exige que la altura obtenida coincida y verifica las cuatro claves BLS y sus pruebas de posesión. La carga, la preparación y la admisión del recibo final usan esa misma autoridad histórica.

## Configurar admisión {#configure-admission}

Todo el comportamiento de producción proviene de la configuración del nodo. Las variables de entorno no pueden activar esta ruta. El valor predeterminado enviado es `enabled = false`; dejar la función desactivada no requiere configuración específica de la liquidación.

Después de que la gobernanza haya registrado la capacidad requerida y elegido una altura de activación con aviso adecuado, configure cada nodo relevante de manera consistente:

```toml
[nexus.atomic_private_settlement]
enabled = true
activation_height = 500000
minimum_activation_notice_blocks = 7200
proof_profile_version = 1
max_participants = 255
max_expiry_blocks = 7200
audit_timeout_blocks = 1200
prepare_timeout_blocks = 1200
commit_timeout_blocks = 1200
capsule_padding_classes_bytes = [4096, 16384, 65536, 262144]
max_proof_bytes = 8388608
max_capsule_bytes = 1048576
max_carrier_bytes = 4194304
sidecar_retention_blocks = 1000000
sidecar_max_records = 256
sidecar_max_total_bytes = 3221225472
default_min_auditor_approvals = 1
permitted_policy_versions = [1]
```

El ejemplo utiliza los límites enviados V1, no una recomendación de rendimiento. Mida el almacenamiento, la prueba, la cápsula, la transacción portadora y los contenedores de datos de latencia en el hardware previsto antes de elegir los límites operacionales. Los tiempos de espera de tres fases deben encajar dentro de `max_expiry_blocks`, y la retención de registros auxiliares debe ser al menos ese período de expiración.

`max_capsule_bytes` limita la codificación canónica Norito de todo el `PrivateSettlementAuditCapsuleV1`: AAD, valor nonce criptográfico, texto cifrado, marco de vector, identidades de auditor y cada fila envuelta-DEK. No es un límite solo de texto cifrado. Cada clase de relleno configurada debe ajustarse al contenedor de datos de cápsula completa conservadora para al menos `default_min_auditor_approvals` auditores. Torii también rechaza una política recién admitida cuya `min_approvals` está por debajo del nivel mínimo establecido, y rechaza cualquier cápsula real cuya codificación canónica completa sea demasiado grande.

`max_carrier_bytes` limita la transacción canónica completa firmada por el patrocinador, no solo el paquete certificado. El recuento incluye el enmarcado de instrucción registrado, autorización de transacción, principal y metadatos, intención de tarifa y firma. Los límites de transacción ordinarios de la red todavía se aplican como un límite superior independiente.

La activación falla cerrada a menos que la capacidad gobernada esté activa, su estado y alturas de activación cumplan con el período de aviso, el perfil de prueba compilado coincida con V1, y los registros de pool y auditoría en la cadena estén actualizados. Habilitar solo la bandera de configuración no es suficiente.

## Flujo de trabajo de liquidación {#settlement-workflow}

El cliente construye pruebas y cápsulas cifradas localmente. Los testigos secretos deben permanecer en la cartera nativa o en el trabajador nativo; no los serialice en los registros de la aplicación, objetos Python, solicitudes HTTP o registros de coordinación duraderos.

Los datos autenticados envueltos por cápsula y por auditor DEK incluyen el valor del resumen criptográfico del comité anclado al estado exacto y `authority_context_height`, así como la red, ruta/incarnación, paquete, tramo, política, época clave y compromiso en texto plano. Una clave envuelta no puede trasladarse a un contexto de lista o de principal de autorización histórica diferente.

Para cada tramo canónico, el coordinador luego realiza esta secuencia:

1. Sube el material encriptado provisional a los cuatro validadores y obtén un certificado de disponibilidad canónica exacto de 3 de 4.
2. Haga que un auditor autorizado obtenga y descifre su cápsula, recalcule las vinculaciones públicas, aplique la política local y envíe una aprobación.
3. Solicitar Preparar votos de los cuatro validadores. Cada validador verifica de manera independiente y registra de forma duradera el delta antes de votar. Persistir el certificado canónico de Preparación 3-de-4 en cada respondedor registrado.
4. Después de que cada tramo tenga un certificado Prepare, construya la barrera completa Prepare inmutable. Solicite y almacene los certificados Commit canónicos 3-de-4. Si el coordinador se reinicia, consulte a los nodos participantes por sus certificados Prepare y Commit localmente duraderos. seleccione un certificado canónico equivalente a un quórum y redistribúyalo antes de continuar; nunca reconstruya un certificado a partir de una caché local no autenticada.
5. Haga que el patrocinador del manifiesto técnico firme y envíe exactamente una transacción portadora global. La transacción portadora contiene una instrucción `FinalizeAtomicPrivateSettlementV1` y el paquete certificado completo exacto. El coordinador y WSV miden previamente la instrucción de finalización de tipo completamente borrado, incluyendo el enmarcado de instrucción registrado. Torii y la vinculación central de la transacción portadora de un solo uso imponen `max_carrier_bytes` sobre la transacción exacta firmada por el patrocinador canónico. incluyendo el principal de autorización, metadatos, intención de tarifa y firma. Torii rechaza una transacción portadora antes de su contexto de principal de autorización, en o después de la última altura de ingreso que podría alcanzar la finalidad por vencimiento, o más allá del período de vencimiento gobernado.
6. Consulta el estado del paquete público y el registro de resultado del protocolo hasta la finalidad global. Trata el estado del registro auxiliar local como provisional hasta que se reconcilie con ese registro terminal global inmutable.

El cliente Rust expone este flujo a través de métodos que incluyen `certify_and_upload_private_settlement_legs_v1`, `prepare_private_settlement_bundle_v1`, `commit_private_settlement_bundle_v1` y `submit_private_settlement_bundle_v1`. La coordinación segura contra reinicios utiliza `recover_or_prepare_private_settlement_bundle_v1` y `recover_or_commit_private_settlement_bundle_v1`. Las llamadas del comité y del auditor requieren credenciales de rol explícitas; no reutilizan el firmante criptográfico de la cuenta ordinaria.

## Rotar una política de auditor de manera segura {#rotate-an-auditor-policy-safely}

Use la instrucción autorizada de gobernanza de privacidad `RotatePrivateSettlementPoolPolicyV1`. Debe nombrar el valor exacto del digest criptográfico de gobernanza actual, mantener la misma ruta, grupo y compromiso de vinculación de activos, avanzar la revisión de gobernanza en uno, usar una época de clave estrictamente más nueva y diferentes resúmenes criptográficos de política/gobernanza, y activar en el bloque que contiene la rotación. La frontera del grupo, raíces, anuladores, salidas, conjuntos de reproducción, y se conservan los registros de resultados de protocolo finalizados. No incluya un registro de resultado de protocolo que toque esa misma ruta/pool a la altura de activación de la rotación; la instrucción rechaza ese límite.

La proyección del conjunto público conserva toda la línea de revisiones de políticas reemplazadas. Por lo tanto, un registro de resultado de protocolo finalizado antes de la rotación sigue siendo válido después del reinicio, y reproducir exactamente ese registro de resultado de protocolo sigue siendo idempotente. La línea de descendencia no autoriza trabajo incompleto: cualquier paquete de política antigua que cruce el límite de activación falla cerrado antes de que los cambios en el estado global ocurran. Mantenga todas las claves de descifrado antiguas necesarias para abrir cápsulas almacenadas, o complete un reempaquetado de cápsula gobernado y probado antes de destruirlo.

## Torii familia de rutas {#torii-route-family}

Estas rutas utilizan objetos de solicitud y respuesta canónicos Norito. Las respuestas autenticadas y restringidas utilizan el comportamiento de caché privado `no-store`.

|Operación|Método y ruta|Principal|
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
|Cargar tramo| `POST /v1/nexus/private-settlements/legs`                                  |firma de cuenta canónica|
|Participación de disponibilidad| `POST /v1/nexus/private-settlements/legs/availability-shares`              |firma de cuenta canónica|
|Preparar voto| `POST /v1/nexus/private-settlements/phases/prepare-votes`                  |firma de cuenta canónica|
|Confirmar voto| `POST /v1/nexus/private-settlements/phases/commit-votes`                   |firma de cuenta canónica|
|Fase de persistencia QC| `POST /v1/nexus/private-settlements/phases/certificates`                   |firma de cuenta canónica|
|Fase de recuperación QCs| `GET /v1/nexus/private-settlements/legs/{payload_digest}/phase-certificates` |patrocinador del manifiesto técnico|
|Estado del tramo| `GET /v1/nexus/private-settlements/legs/{payload_digest}/status`           |firma de cuenta canónica|
|Prueba del comité| `GET /v1/nexus/private-settlements/legs/{payload_digest}/committee-proof`  |validador de lista exacta|
|Cápsula de auditoría| `GET /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule`    |auditor gobernado|
|Aprobación del auditor| `POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-approvals` |auditor gobernado|
|Enviar final/abortar| `POST /v1/nexus/private-settlements/bundles`                               |patrocinador técnico del manifiesto|
|Estado del paquete| `GET /v1/nexus/private-settlements/bundles/{bundle_id}`                    |pública|
|registro de resultado del protocolo o abortar| `GET /v1/nexus/private-settlements/bundles/{bundle_id}/receipt`            |pública|

Las APIs públicas de estado y recibos exponen únicamente los campos públicos documentados. En particular, el estado ordinario de un tramo no revela el número de aprobaciones ni el umbral de auditores gobernado. Las lecturas restringidas hacen indistinguibles el material ausente, no autorizado y con retención vencida, devolviendo la misma clase de respuesta no disponible. La ruta de envío acepta exactamente una instrucción directa de finalización o aborto firmada por el patrocinador. Su respuesta `202` contiene únicamente el ID del paquete, la altura de admisión observada y el hash de la transacción portadora; no afirma que un aborto en cola ya sea definitivo. Los SDKs exigen que ambos identificadores sean literales JSON `Hash` de Norito, canónicos y con suma de comprobación, y que la altura sea un entero sin signo exacto de 64 bits; los campos ausentes, adicionales, con tipo incorrecto, no canónicos, con suma inválida, negativos, cero negativo, fraccionarios o desbordados hacen que la operación falle de forma cerrada. Use el estado o el recibo del paquete como estado terminal autoritativo. El código de estado también es exacto: esta ruta de admisión de la transacción portadora exige `202`, mientras que todas las demás respuestas correctas de liquidación privada V1 exigen `200`. Los clientes rechazan otros códigos correctos `2xx` como desviación del contrato sin reproducir el cuerpo inesperado en sus errores. Solo exponen un código de rechazo del servidor cuando coincide con `[A-Za-z0-9_.:-]{1,128}` y descartan las causas del análisis o la validación de la respuesta, evitando que el contenido del cuerpo o los nombres de campos JSON elegidos por un atacante reaparezcan en registros que incluyan causas.

## Fracaso y recuperación {#failure-and-recovery}

Aprobaciones de auditor ausentes o caducadas, menos de tres votos de validadores, raíces o épocas incorrectas, anulación de duplicados, pruebas o cápsulas sustituidas, orden de patas no canónico, paquetes caducados y términos de reembolso que no coinciden, todos fallan antes de la mutación global. Los certificados de compromiso nunca mutan el estado privado.

Los validadores sincronizan con fs los registros auxiliares, los deltas en etapas y los certificados de fase antes de reconocerlos. Al reiniciarse, reconstruyen las reservas a partir de los registros duraderos canónicos, luego reconcilian los registros inmutables de resultados del protocolo global, los marcadores de aborto o la expiración. El reconciliador supervisado también ejecuta la poda de retención terminal en la altura autorizada observada de manera sincronizada incluso cuando no hay un candidato terminal para conciliar. y falla cerrándose ante un error de poda. Solo un registro terminal global autorizado libera los bloqueos en espera. Reproducir un registro de resultado de protocolo finalizado idéntico es idempotente; una reproducción conflictiva falla de manera determinista.

La identidad de la reserva incluye la ruta completa. Las cabezas de grupo usan `(route, pool_id, epoch, root)`, los anulación usan `(route, pool_id, nullifier)`, y las salidas usan `(route, pool_id, commitment)`. Los valores opacos iguales en otra ruta son independientes; una colisión de ruta exacta permanece bloqueada tras el reinicio.

Las alertas operativas deben usar solo los campos de paquete opaco, ruta, fase, valor de resumen criptográfico, altura y clase de razón. Nunca coloque cápsulas descifradas, identificadores de cuenta o activos, cantidades, memorandos, datos de vista, testigos de prueba o cargas útiles del analizador en registros, eventos, etiquetas de métricas o trazas de seguimiento.

## Calificación antes del valor real {#qualification-before-real-value}

Para la compilación y configuración exacta que pretende implementar, archive evidencia que cubra:

- prueba adversarial, cápsula, política, rotación de claves, reembolso y casos de repetición
- procesos reales de cuatro validadores para 2, 3, 4, 8 y 16 espacios de datos, incluyendo reinicios de validadores y coordinadores, pérdida de mensajes autenticados del 5%, 10% y 20%, particiones de fase, recuperación y fallos en los límites de persistencia
- análisis de fugas diferencial y canario a través de Torii, P2P, bloques, Kura, vistas de datos en un momento específico, consultas, eventos, registros y telemetría
- al menos cinco calentamientos y treinta paquetes medidos por cada participante de la red real, con p50, p95, p99, intervalos de confianza, recursos, tráfico, pruebas y tamaños de registro de resultados del protocolo, y AMX transparente como el control
- pruebas estrictas del espacio de trabajo, verificaciones de lint y formato, semillas aleatorias, soak, compilaciones reproducibles, SBOMs, y hashes criptográficos de artefactos firmados
- ambas capas formales: las verificaciones de simetría de conteo de patas 3/255 y el comité exacto de cuatro validadoras indexadas N=2 centradas en validadoras más el fallo completamente limitado, N=3 fallo primario en papel, N=4 limpio y N=3 configuraciones de expiración/reproducción, con presupuestos de fallo independientes por comité
- revisión independiente de la relación de prueba, selectores de ranura ficticios, vinculaciones de activos y cápsulas, relación de reembolso, criptografía y máquina de estados de espacio de datos cruzado

Publique la evidencia cruda y depurada, el modelo de amenazas, el argumento del protocolo, las limitaciones, el ID de commit, la descripción del hardware y los informes de auditoría en un artefacto inmutable respaldado por DOI. Las pruebas del repositorio por sí solas no convierten la característica en un sistema de liquidación CBDC calificado para producción.

Desde la limpieza final Iroha del registro de salida, genere el inventario de la fuente de la versión y selle en una raíz de paquete preexistente fuera de ese registro de salida:

```sh
python3 scripts/private_settlement_source_evidence.py \
  --repository-root . \
  --bundle-root /absolute/path/to/release-bundle
```

El productor falla en archivos preparados, no preparados, no rastreados o no fusionados y en cualquier cambio de fuente durante la captura. Conserva el objeto de commit en bruto, el inventario de árbol Git canónico, la lista exacta de rutas binarias, el sello de fuente determinista y `Cargo.lock`; incluya toda declaración de artefactos de su resultado JSON en el manifiesto técnico de la versión final. No renuncia al verificador final del paquete DOI ni a ninguna puerta de lanzamiento externa.

El sello de origen es portátil y falla cerrado: el productor y el verificador final resuelven todo el gráfico de enlaces simbólicos archivados, por lo que un enlace que aparece en la raíz pero se escapa a través de otro enlace, un ciclo, `.git` recorrido o un destino al estilo Windows es rechazado antes de que se creen los enlaces. Los informes estructurados de origen y de puerta se analizan únicamente a partir de archivos estables limitados cuyo valor de resumen criptográfico y longitud coinciden con el manifiesto técnico de la versión, y cada tipo de carga útil de origen debe ocurrir exactamente una vez.

Cada muestra de error bruto en ejecución y de latencia debe vincular el commit completo de la versión, el SHA-256 de una descripción de hardware anclada estructurada, y el SHA-256 de su configuración de conteo exacto de participantes. Archivar un manifiesto técnico de configuración canónica cubriendo N=2,3,4,8,16; cada entrada debe hacer referencia a los bytes de configuración retenidos y afirmar exactamente cuatro validadores por espacio de datos, un quórum de 3 de 4, y RS16 DA/RBC firmados obligatoriamente. El verificador de versiones rechaza los resúmenes producidos en una compilación, perfil de hardware o configuración de red diferente. Cada pérdida individual, corte de fase y fila de caída de persistencia debe además nombrar referencias exactas de registros JSONL globalmente no reutilizables dentro de SHA-256-límite. artefactos de controlador autenticado y captura de atomicidad. El verificador de la versión resuelve esos resúmenes criptográficos y requiere que las filas coincidan con la identidad de ejecución, el índice de prueba y los parámetros, el reconocimiento del controlador o el resultado de recuperación, el recuento de verificación continua, y cero observaciones de visibilidad y gastabilidad parciales. Las comparaciones p95/p99 de versiones posteriores también rechazan una línea base firmada cuyo hardware, configuraciones o requisitos de medición difieran del candidato. El verificador final regenera todos los percentiles reportados, MADs, y los intervalos de confianza determinísticos a partir de las muestras crudas archivadas en lugar de confiar en un resumen de referencia separado. También recarga el manifiesto técnico canario y vuelve a escanear de forma independiente cada superficie de privacidad archivada, por lo que un informe no puede suprimir un hallazgo secreto plantado después de volver a enlazar los resúmenes criptográficos de archivos. Cada ejecución solo para secretos debe conservar su pcap de retorno no filtrado solo para el propietario, stderr de tcpdump sin procesar y estadísticas sin pérdidas, manifiesto técnico de puerto canónico, archivo comprimido de origen restringido y observaciones de atomicidad de todos los pares. El verificador final vuelve a ejecutar la división de paquetes vinculados al puerto, las proyecciones de origen y las verificaciones de atomicidad de línea base a terminal a partir de esos bytes archivados en lugar de confiar en los resúmenes publicados.

El archivo también debe incluir los manifiestos técnicos canónicos emparejados de conteo de tráfico y de pares diferenciales que vinculen las rutas de archivo izquierda y derecha exactas, los tipos, las longitudes en bytes y los resúmenes criptográficos SHA-256 para cada superficie de privacidad requerida. Sus raíces declaradas deben contener exactamente el inventario de archivo emparejado. El verificador requiere tamaños de archivos completos iguales y JSON formas públicas para superficies ordinarias. La captura de bucle invertido que lleva entropía y el archivo comprimido de fuente restringida son excepciones de tamaño explícitas; en su lugar, compara el tipo de enlace de los paquetes y las longitudes por paquete, las identidades de fuente restringida y las longitudes de fila de forma fija. Cada solicitud/respuesta Torii, paquete público/restringido P2P, bloque, consulta, evento, registro y recuento de tráfico de telemetría también debe coincidir. Un cambio en la forma del paquete, una fuga estructural del mismo tamaño, una reclamación de procedencia falsa, o un archivo no emparejado no puede ser ocultado reescribiendo el informe de filtración y sus hashes criptográficos.
