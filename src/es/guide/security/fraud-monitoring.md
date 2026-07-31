---
translation_locale: es
translation_source: /guide/security/fraud-monitoring.md
translation_source_hash: 4739a0bfe80f14545a51c804abbe6a2dfa5497d546192f76096f938a0af70184
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Monitoreo de fraudes {#fraud-monitoring}

El monitoreo de fraudes para una implementación Iroha es un control operativo construido en torno a eventos del libro mayor, consultas, permisos y contexto de aplicación. Iroha registra lo que se presentó, aceptó, rechazó y cometió. Su sistema de monitoreo decide qué patrones son sospechosos para su proceso empresarial y envía esos casos a los revisores o controles automatizados de respuesta.

Tratar el monitoreo de fraudes como un servicio separado en lugar de una lógica integrada en un validador. El servicio debe suscribirse a la actividad del libro mayor, enriquecerlo con un contexto de riesgo fuera de la cadena, persistir en pruebas y enviar transacciones de respuesta solo a través de cuentas que tengan permisos explícitos.

## Modelo de seguimiento {#monitoring-model}

Una línea de seguimiento útil tiene cuatro etapas:

1. Recopilar las señales del libro mayor y del operador de los flujos, consultas y métricas de eventos Torii.
2. Enriquecer los eventos con un contexto fuera de la cadena, como el estado del cliente, las listas de contrapartes, los identificadores de sesiones de solicitud, los límites esperados y el caso IDs.
3. Detectar el comportamiento sospechoso con reglas deterministas, colas de revisores o puntuación de riesgo.
4. Responda al alertar a los operadores, detener los flujos de trabajo del lado de las aplicaciones, revocar permisos innecesarios o enviar transacciones compensatorias cuando su proceso de gobernanza lo permita.

Mantenga las decisiones de política fuera del consenso a menos que cada validador debe reproducir la misma decisión. La validación en el tiempo de ejecución debe hacer cumplir los permisos y la validez de las transacciones.

## Las señales que se recogen {#signals-to-collect}

Comience con suscripciones estrechas y agregue flujos más amplios sólo para la investigación:

|La señal .|Fuente |Usar |
| --- | --- | --- |
|Estado de la transacción |Eventos en el oleoducto |Detectar rechazos repetidos, intentos fallidos de autorización y patrones inusuales de presentación |
|Ciclo de vida de la cuenta y metadatos |Eventos de datos y consultas de cuentas |Detecta nuevas cuentas, cambios de alias, actualizaciones de identidad y modificaciones inesperadas de metadatos |
|Saldos de activos y transferencias |Eventos de datos de activos y consultas de activos |Detectar movimientos de alto valor, ventilación rápida, drenaje de equilibrio y contrapartes inusuales |
|Roles y permisos |Encuestas de roles y permisos, eventos de datos de roles |Detectar la escalada de privilegios, las subvenciones de emergencia y el acceso obsoleto de alto riesgo |
|Cambios de desencadenante y contrato |Eventos de desencadenante, contrato y ejecutor |Detectar nuevas automatizaciones, cambios en las vías de ejecución y actividad sospechosa de actualización |
|Configuración y cambios de pares |Configuración y eventos de pares |Detectar cambios en la gobernanza que afecten a la validación, red o visibilidad del operador |
|Salud del operador |Las rutas de estado `/metrics` y Sumeragi |Separar el comportamiento del usuario sospechoso de la sobrecarga de los nodos, presión en la cola o fallos de red |

Utilización [filtros de eventos](/es/blockchain/filters.md) evitar el procesamiento de toda la secuencia de eventos cuando una regla sólo requiere cambios en cuentas, activos, roles o configuración. Para la reconciliación periódica, combine el flujo con paginado [consultas](/es/blockchain/queries.md) para que el monitor pueda recuperarse después del tiempo de inactividad.

## Reglas de detección {#detection-rules}

Las familias de reglas comunes incluyen:

|La familia de reglas |Condición de ejemplo |Respuesta típica |
| --- | --- | --- |
|Velocidad |Una cuenta transfiere más de la cantidad o el recuento esperados en una corta ventana |Los revisores de alertas y las retiradas en el lado de la aplicación para esa cuenta se pausan |
|Se extiende .|Los fondos pasan de una cuenta a muchas cuentas recientemente vistas |Requerir la aprobación manual antes de permitir transferencias adicionales |
|Desarrollo del equilibrio |Una gran parte del saldo de una cuenta se deja poco después de un cambio de clave, alias o metadatos |Escalado de la posible adquisición de cuentas |
|La escalada de privilegios |Se otorga un permiso o función de alto riesgo fuera de una ventana de cambio |Alerta a los operadores y revisa la operación de subvención |
|El rechazo se estalla |Un firmante o un cliente produce transacciones rechazadas repetidas |Verificar el abuso de credenciales, los errores de integración o la investigación |
|Cambios en la automatización |Un desencadenante, un contrato o un objeto relacionado con el ejecutor cambia inesperadamente |Pausa en los flujos de trabajo dependientes hasta que se revise el cambio |
|Cambios sensibles al gobierno |Los cambios en el estado de pares, configuración o tiempo de ejecución ocurren sin un boleto aprobado |Comparar con los registros de gobierno y el proceso de incidentes |

Las reglas deben ser explícitas acerca de las pruebas que requieren, el período de tiempo que evalúan, la acción que toman y la persona o el sistema que puede cerrar el caso. Los umbrales que dependen del riesgo del cliente, tipo de activo o jurisdicción pertenecen a la configuración de su servicio de monitoreo, no en los scripts ad hoc.

## Controles de respuesta {#response-controls}

Diseñar acciones de respuesta antes de activar las alertas. Un caso de fraude de gran gravedad debe tener un camino documentado desde la detección hasta la contención:

- notificar a los titulares de seguridad, operaciones y empresas responsables del dominio o la definición de activos afectados
- preservar el cursor de eventos, hash de bloqueo, hash de transacción, autoridad, carga útil y instantánea de consulta utilizada por la regla de detección
- Pausa las acciones del lado de la aplicación que están fuera del libro mayor, como los flujos de trabajo de pago, retiro, firma, puente o liquidación.
- revocar funciones o permisos que ya no estén justificados por el plan de respuesta a incidentes.
- presentar las operaciones de seguimiento del libro mayor sólo cuando la política de gobernanza activa y el modelo de permisos lo permitan
- girar las teclas cuando la evidencia sugiere un compromiso de los firmantes

Evitar dar al servicio de monitoreo un acceso de escritura amplio y utilizar una cuenta técnica dedicada con el conjunto más pequeño de permisos requeridos para las acciones de respuesta que se le permite realizar. La aprobación humana debe seguir siendo parte de cualquier flujo de trabajo que pueda mover activos, cambiar permisos o alterar la configuración orientada al validador.

## Pruebas y retención {#evidence-and-retention}

Almacenar la evidencia de monitoreo en un sistema exclusivo del apéndice que esté separado del directorio de datos del validador.

- nombre del flujo de eventos y el cursor
- altura del bloque o hash de bloque cuando esté disponible
- hash y autoridad de la transacción
- Cuenta, dominio, activo, función, desencadenante o configuración afectada ID
- carga útil del evento en bruto o un hash canónico de ella
- instantáneas de la consulta utilizadas para enriquecer la alerta
- nombre de la regla, versión, umbral, puntaje y decisión del revisor

No almacenar notas de investigación sensibles como metadatos del libro mayor público a menos que la política de gobernanza de datos de la red lo permita explícitamente. Si necesita vincular un caso fuera de cadena al estado en cadena, prefiera un identificador de caso, una certificación firmada o un compromiso hash que no exponga detalles privados.

## Lista de verificación de la implementación {#implementation-checklist}

- Habilitar el perfil de telemetría necesario para las rutas `/metrics` y del operador.
- Suscríbete a los flujos de eventos Torii con filtros estrechos para los objetos que monitoreas.
- Persiste los cursores de eventos para que el monitor pueda reanudarse sin interrupciones.
- Conciliar los flujos con las consultas en páginas de un horario regular.
- Mantener los umbrales de riesgo y permitir listas en configuración controlada por versión.
- Las normas de alerta de prueba contra los bloques históricos antes de permitir acciones automatizadas.
- Utilice cuentas técnicas dedicadas para las acciones de respuesta.
- Revisar el papel y las concesiones de permisos en un calendario recurrente.
- Incluir alertas de monitoreo del fraude en el proceso de respuesta a incidentes.

## Páginas relacionadas {#related-pages}

- [Eventos ](/es/blockchain/events.md)
- [Los filtros ](/es/blockchain/filters.md)
- [Las consultas ](/es/blockchain/queries.md)
- [Las autorizaciones ](/es/blockchain/permissions.md)
- [Desempeño y métricas ](/es/guide/advanced/metrics.md)
- [Puntos finales Torii](/es/reference/torii-endpoints.md)
- [Seguridad operativa ](/es/guide/security/operational-security.md)
