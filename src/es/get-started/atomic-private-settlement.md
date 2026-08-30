---
translation_locale: es
translation_source: /get-started/atomic-private-settlement.md
translation_source_hash: 18b5e9c80bfa5542b996548fd07603a311099f76a4443cf143cd959991f80dc3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ejecutar la configuración del espacio de datos transversal privado atómico {#run-atomic-private-cross-dataspace-settlement}

`AtomicPrivateSettlementV1` coordina una pierna de liquidación confidencial en cada uno de los 2 a 255 espacios de datos SORA Nexus y finaliza cada pierna en una transacción de estado global. Un paquete rechazado, expirado o abortado no aplica ninguna pierna. Nativo transparente AMX DvP/PvP sigue siendo un camino de protocolo separado.

::: warning Estado de liberación Esta función está regida, desactivada por defecto,
No habilitarlo para el valor real CBDC hasta que las puertas de publicación funcionales, privacidad, fallas, rendimiento, construcción reproducible, revisión criptográfica independiente y artefacto hayan pasado por la liberación exacta. :::

## Lo que oculta el protocolo {#what-the-protocol-hides}

Cada pierna utiliza una prueba de notas privadas fija de dos entradas, tres salidas. Los validadores del comité verifican la prueba y una transición opaca; no reciben las partes de texto en blanco, el activo, la cantidad, el memorándum o el resultado comercial. Un auditor local autorizado descifre la cápsula de auditoría empolvada, verifica ese contenido y firma una aprobación separada para el propósito.

El transportista público y el recibo revelarán deliberadamente:

- los identificadores de red y paquete
- rutas del espacio de datos de los participantes y el número de participantes
- horario y altura de caducidad
- Identificadores de pool opacos estables, raíces, anuladores, compromisos y ranuras fijas de texto cifrado
- las autoridades del comité y la disponibilidad exacta de 3 de 4, los certificados Prepare y Commit
- el patrocinador, la cuota de red pública y el estado del terminal

Se trata de la confidencialidad del contenido, no el anonimato del flujo de tráfico. El tiempo, el número de participantes, la identidad del espacio de datos y la actividad del grupo estable siguen siendo públicos. Un espacio de datos que alberga sólo un CBDC también puede hacer que el activo sea infrecuible desde la ruta aunque no se publique ningún identificador literal de activos.

## Requisitos de despliegue {#deployment-requirements}

Antes de la activación, los operadores necesitan todas las siguientes características:

1. exactamente cuatro validadores para cada espacio de datos participante, con claves de consenso y pruebas de posesión distintas BLS
2. obligatorio Sumeragi DA/RBC habilitado para cada altura.
3. un grupo de liquidación confidencial gobernado y la raíz inicial en cada espacio de datos
4. una capacidad activa de nota privada V1 y el perfil separado de prueba de liquidación.
5. al menos un local `PrivateSettlementAuditPolicyV1` regulado, incluidas las claves de firma y cifrado híbrido del auditor distintas, una época clave, validez de altura y umbral de aprobación.
6. suficiente almacenamiento privado en el vagón lateral para el período de retención configurado
7. una cuenta patrocinadora neutral capaz de presentar la compañía aérea pública final

Un auditor también puede operar un validador, pero debe usar claves de consenso, firma del auditor y cifrado del auditor separadas. Mantenga las claves de descifrado retiradas para el período de retención regulador, o regir y volver a envolver la cápsula de prueba antes de retirarlas.

La autoridad de cuatro validadores está anclada en el estado, no suministrada por el cliente. En el manifiesto `authority_context_height`, cada validador resuelve la lista exacta ordenada del carril/espacio de datos y la encarnación activa del carril desde el estado de consenso, requiere que la altura resuelta coincida y verifica las cuatro claves BLS y pruebas de posesión.

## Configurar la admisión {#configure-admission}

Todo el comportamiento de producción proviene de la configuración del nodo. Las variables ambientales no pueden activar esta ruta. El predeterminado enviado es `enabled = false`; dejar la función desactivada no requiere ninguna configuración específica para la solución.

Una vez que la gobernanza haya registrado la capacidad requerida y haya elegido una altura de activación con un aviso adecuado, configure cada nodo relevante de manera consistente:

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

El ejemplo utiliza los límites de envío V1, no una recomendación de rendimiento. el hardware previsto antes de elegir los límites operativos. Las tres temporadas de fase deben encajar dentro de `max_expiry_blocks`, y la retención del vehículo lateral debe ser al menos esa ventana de vencimiento.

`max_capsule_bytes` limita la codificación canónica Norito de todo el `PrivateSettlementAuditCapsuleV1`: AAD, nonce, texto cifrado, enmarcado vectorial, identidades del auditor y cada fila envuelta- DEK. No es un límite sólo para el texto cifrada. Cada clase de relleno configurada debe ajustarse al envelope completo conservador para al menos `default_min_auditor_approvals` auditores. Torii también rechaza una política recientemente admitida cuya `min_approvals` está por debajo de ese piso regulado, y rechaza cualquier cápsula real cuya codificación canónica completa es demasiado grande.

`max_carrier_bytes` limita la transacción canónica completa firmada por el patrocinador, no solo el paquete certificado. El recuento incluye el marco de instrucciones registradas, la autoridad de transacción y los metadatos, la intención de la tarifa y la firma. Los límites ordinarios de las transacciones de red todavía se aplican como un límite superior independiente.

La activación no se cierra a menos que la capacidad regulada esté activa, su estado y sus alturas de activación cumplan con el período de notificación, el perfil de prueba compilado coincida V1, y los registros de auditoría en cadena estén actualizados.

## Flujo de trabajo de liquidación {#settlement-workflow}

El cliente construye pruebas y cápsulas cifradas localmente. Los testigos secretos deben permanecer en la billetera nativa o en el trabajador nativo; no los series en registros de aplicaciones, objetos Python, solicitudes HTTP o registros duraderos de coordinación.

Los datos autenticados por cápsula y por auditor DEK incluyen la digestión exacta del comité anclado en el estado y `authority_context_height`, así como la red, ruta/encarnación, paquete, pierna, política, época clave y compromiso de texto claro. Una llave envuelta no puede ser trasladada a una lista o contexto de autoridad histórica diferente.

Para cada pierna canónica, el coordinador entonces realiza esta secuencia:

1. Cargar el material provisional cifrado a los cuatro validadores y obtener un certificado de disponibilidad canónico exacto de 3 de 4.
2. Haga que un auditor autorizado recoja y descifrute su cápsula, recalcule los compromisos públicos, aplique las políticas locales y presente una aprobación.
3. Request Prepare votos de los cuatro validadores. Cada validador verifica de manera independiente y en forma duradera el delta antes de la votación. Persiste el certificado canónico 3-de-4 Prepare en cada responder en etapas.
4. Después de que cada pierna tenga un certificado Prepare, construye la barrera completa Prepare inmutable. Solicite y persista certificados canónicos de Commit 3 de 4. Si el coordinador se reinicia, consulte a los nodos participantes por sus certificados Prepare y Commit almacenados localmente de forma duradera, seleccione un certificado canónico equivalente al cuórum y vuelva a distribuirlo antes de continuar; nunca reconstruya un certificado a partir de una caché local no autenticada.
5. Tenga la firma del patrocinador manifiesto y envíe exactamente una aerolínea global. La aerolínea contiene una instrucción `FinalizeAtomicPrivateSettlementV1` y el paquete certificado completo exacto. Coordinador y prevuelo WSV miden la instrucción completa de finalización en caja, incluido el marco de instrucciones registrado. Torii y la obligación del operador principal de un solo disparo `max_carrier_bytes` sobre la transacción canónica firmada por el patrocinador exacta, incluida la autoridad, los metadatos, la intención de pago y la firma. Torii rechaza a un transportista antes del contexto de su autoridad, en o después de la última altura de entrada que podría llegar a la finalidad al vencimiento o más allá del período de vencimiento regulado.
6. Consultar el estado del paquete público y la recepción hasta su finalización global. Tratar el estado local del sidecar como provisional hasta que concilie ese registro global inmutable de terminal.

El cliente Rust expone este flujo a través de métodos que incluyen `certify_and_upload_private_settlement_legs_v1`, `prepare_private_settlement_bundle_v1`, `commit_private_settlement_bundle_v1` y `submit_private_settlement_bundle_v1`. La coordinación segura frente a reinicios utiliza `recover_or_prepare_private_settlement_bundle_v1` y `recover_or_commit_private_settlement_bundle_v1`. Las llamadas del comité y auditor requieren credenciales explícitas para el rol; no reutilizan el signatario ordinario de la cuenta.

## Rotar una política de auditoría con seguridad {#rotate-an-auditor-policy-safely}

Utilice la instrucción de privacidad-gobernanza autorizada `RotatePrivateSettlementPoolPolicyV1`. Debe nombrar el digesto de gobernanza actual exacto, mantener la misma ruta, pool y compromiso con activos vinculantes, avanzar en la revisión de la gobernanza por uno, utilizar una época clave estrictamente más nueva y diferentes políticas / digestos de gobierno, Se conservan la frontera de la piscina, las raíces, los anuladores, las salidas, los conjuntos de reproducción y los recibos finalizados. No incluya un recibo que toque esa misma ruta/pista a la altura de activación de la rotación; la instrucción rechaza ese límite.

La proyección del fondo público mantiene el linaje completo de revisión de las políticas sustituido. Por lo tanto, un recibo finalizado antes de la rotación permanece válido después del reinicio, y reproducir ese recibo exacto sigue siendo impotente. El linaje no autoriza el trabajo inacabado: cualquier paquete de política antigua que cruza la frontera de activación no se cierra antes de que cambie el estado global. Mantenga todas las claves de descifrado antiguas necesarias para abrir las cápsulas almacenadas, o completar una cápsula controlada y probada para volver a envolverla antes de destruirla.

## Familia de rutas Torii {#torii-route-family}

Estas rutas utilizan objetos de solicitud y respuesta canónicos Norito. Las respuestas autenticadas y restringidas utilizan el comportamiento caché privado `no-store`.

|Operación |Método y camino |El director .|
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
|Cargar la pierna |`POST /v1/nexus/private-settlements/legs` |firma de la cuenta canónica |
|Cuota de disponibilidad |`POST /v1/nexus/private-settlements/legs/availability-shares` |firma de la cuenta canónica |
|Prepárate para votar .|`POST /v1/nexus/private-settlements/phases/prepare-votes` |firma de la cuenta canónica |
|Comprometerse a votar |`POST /v1/nexus/private-settlements/phases/commit-votes` |firma de la cuenta canónica |
|Fase persistente QC |`POST /v1/nexus/private-settlements/phases/certificates` |firma de la cuenta canónica |
| Recuperar QCs de fase | `GET /v1/nexus/private-settlements/legs/{payload_digest}/phase-certificates` | patrocinador manifiesto |
|El estado de las piernas |`GET /v1/nexus/private-settlements/legs/{payload_digest}/status` |firma de la cuenta canónica |
|Prueba del comité |`GET /v1/nexus/private-settlements/legs/{payload_digest}/committee-proof` |Validador exacto de la lista |
|Cápsula de auditoría |`GET /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule` |auditor gobernado |
|La aprobación del auditor |`POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-approvals` |auditor gobernado |
|Envía el paquete |`POST /v1/nexus/private-settlements/bundles` |patrocinador manifiesto |
|Estado del paquete |`GET /v1/nexus/private-settlements/bundles/{bundle_id}` |público |
|Recibo o cancelación |`GET /v1/nexus/private-settlements/bundles/{bundle_id}/receipt` |público |

El estado público y el recibo APIs exponen únicamente los campos públicos documentados. En particular, el estado ordinario de la pierna no revela el número de aprobaciones o el umbral del auditor regulado. Lecturas restringidas colapsar intencionalmente desaparecido, no autorizado y el material expirado de retención dentro de la misma clase de respuesta no disponible.

## Incumplimiento y recuperación {#failure-and-recovery}

Las aprobaciones de los auditores faltantes o obsoletas, menos de tres votos validadores, raíces o épocas equivocadas, anuladores duplicados, pruebas o cápsulas sustituidas, orden no canónico, paquetes vencidos y términos de reembolso incompatibles fallan antes de la mutación global. Los certificados de compromiso nunca mutan el estado privado.

Los validadores sincronizan los sidecars, los deltas en escena y los certificados de fase antes de reconocerlos. Al reiniciar reconstruyen las reservas a partir de registros duraderos canónicos, luego reconcilian recibos globales inmutables, marcadores de interrupción o vencimiento. El reconciliador supervisado también realiza la poda de retención terminal a la altura autorizada observada sincrónicamente, incluso cuando no haya un candidato terminal para la reconciliación. Sólo un registro de terminal global autorizado libera cerraduras escenificadas. Reproduzir un recibo final idéntico es impotente; una reproducción conflictiva falla deterministicamente.

La identidad de reserva incluye la ruta completa. Las cabezas del grupo utilizan `(route, pool_id, epoch, root)`, los anuladores usan `(route, pool_id, nullifier)`, y las salidas utilizan `(route, pool_id, commitment)`. Los valores opacos iguales en otra ruta son independientes; una colisión de ruta exacta se mantiene bloqueada durante el reinicio.

Las alertas operativas deben utilizar solo campos opacos de paquete, ruta, fase, digestación, altura y clase de razón. Nunca coloque cápsulas descifradas, identificadores de cuentas o activos, cantidades, memorandos, datos de visualización, testigos de prueba o cargas útiles del analizador en registros, eventos, etiquetas de métricas o intervalos de seguimiento.

## Clasificación antes del valor real {#qualification-before-real-value}

Para la construcción exacta y la configuración que desea implementar, archivar evidencia que cubra:

- Prueba de adversidad, cápsula, póliza, rotación de llaves, reembolso y casos de repetición
- Procesos reales de cuatro validadores para las bases de datos 2, 3, 4, 8 y 16, incluidos los reinicios del validador y el coordinador, pérdida autenticada de 5%, 10% y 20% de mensajes, particiones de fase, recuperación y problemas con límites de persistencia.
- análisis de filtraciones canarias y diferenciales a través de Torii, P2P, bloques, Kura, instantáneas, consultas, eventos, registros y telemetría.
- al menos cinco calentamientos y treinta paquetes medidos por número de participantes en la red real, con p50, p95, p99, intervalos de confianza, recursos, tráfico, tamaño de prueba y recibo, y transparente AMX como control.
- Pruebas estrictas en el espacio de trabajo, comprobaciones de fibra y formato, semillas aleatorias, remojo, edificaciones reproducibles, SBOMs, y hashes de artefactos firmados.
- Las dos capas formales: las comprobaciones de simetría del recuento de 3/255 patas y la configuración exacta de expiración/repetición de N=3, con presupuestos de fallas independientes por comité, indicado por un comité de cuatro validadores N=2, centrado en el validador más una falla completa limitada
- Revisión independiente de la relación de prueba, los selectores de ranuras simuladas, las vinculaciones entre activos y cápsulas, la relación de reembolso, la criptografía y la máquina de estado del espacio de datos cruzado.

Publicar la evidencia en bruto y desinfectada, el modelo de amenaza, el argumento del protocolo, las limitaciones, el compromiso ID, la descripción de hardware e informes de auditoría en un artefacto inmutable respaldado por DOI. Las pruebas de repositorio por sí solas no convierten la característica en un sistema de liquidación calificado para la producción CBDC.

Cada prueba de error en bruto y muestra de latencia deben vincular el compromiso completo de liberación, la SHA-256 de una descripción estructurada de hardware fijado y la SHA-256 de su configuración exacta del número de participantes. Archivar un manifiesto de configuración canónica que cubra N=2,3,4,8,16; cada entrada debe hacer referencia a los bytes de configuración retenidos y afirmar exactamente cuatro validadores por espacio de datos, un quórum de 3 de 4, y firmar obligatoriamente RS16 DA/RBC. El verificador de lanzamiento rechaza los resúmenes producidos en una configuración de red diferente, o un perfil de hardware. Cada línea de pérdida, corte de fase y persistencia-crash individual también debe nombrar referencias de registro exactas JSONL no reutilizables a nivel mundial dentro de SHA-256-. artefactos del controlador autenticado y de la captura de atomicidad. El verificador de liberación resuelve dichos digestos y requiere que las filas coincidan con la identidad de ejecución, el índice y los parámetros de ensayo, el resultado de reconocimiento o recuperación del controlador, el recuento continuo de verificación; Las comparaciones p95/p99 de liberación posterior también rechazan una línea base firmada cuyos requisitos de hardware, configuración o medición difieren del candidato. El verificador final regenera todos los percentiles reportados, MADs, y los intervalos de confianza deterministas a partir de las muestras crudas archivadas en lugar de confiar en un resumen independiente del índice de referencia. También recarga el manifiesto canario y revisa de forma independiente cada superficie de privacidad archivada, por lo que un informe no puede suprimir un golpe secreto plantado después de volver a vincular la digestión del archivo. El archivo también debe incluir un manifiesto de par diferencial canónico que une las rutas exactas de archivos izquierdo y derecho, tipos, longitudes de byte y SHA-256 digestos para cada superficie de privacidad requerida. Sus raíces declaradas deben contener exactamente el inventario de archivo emparejado. El verificador final requiere de forma independiente tamaños iguales y recalcula formas públicas JSON, por lo que no se puede ocultar una fuga estructural del mismo tamaño o un archivo diferencial sin pareja mediante la reescritura del informe de fugas.
