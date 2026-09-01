---
translation_locale: es
translation_source: /guide/security/fraud-monitoring.md
translation_source_hash: 4739a0bfe80f14545a51c804abbe6a2dfa5497d546192f76096f938a0af70184
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Monitoreo de fraudes {#fraud-monitoring}

La monitorización de fraudes para un despliegue Iroha es un control operativo construido en torno a eventos del libro mayor de blockchain, consultas, permisos y contexto de la aplicación. Iroha registra lo que fue enviado, aceptado, rechazado y confirmado. Su sistema de monitoreo decide qué patrones son sospechosos para su proceso empresarial y dirige esos casos a revisores o controles de respuesta automatizados.

Trate la supervisión de fraudes como un servicio separado en lugar de como lógica integrada en un validador. El servicio debe suscribirse a la actividad del libro mayor de blockchain, enriquecerla con contexto de riesgo fuera de la cadena, almacenar evidencia y enviar transacciones de respuesta solo a través de cuentas que tengan permisos explícitos.

## Modelo de Monitoreo {#monitoring-model}

Un útil flujo de procesamiento de monitoreo tiene cuatro etapas:

1. Recopilar registros de la cadena de bloques y señales del operador de los flujos de eventos, consultas y métricas de Torii.
2. Enriquezca los eventos con contexto fuera de la cadena, como el estado del cliente, listas de contrapartes, identificadores de sesión de la aplicación, límites esperados e identificadores de casos.
3. Detecta comportamiento sospechoso con reglas deterministas, colas de revisores o puntuación de riesgo.
4. Responda alertando a los operadores, pausando los flujos de trabajo del lado de la aplicación, revocando permisos innecesarios o enviando transacciones compensatorias cuando su proceso de gobernanza lo permita.

Mantenga las decisiones de política fuera del consenso a menos que cada validador deba reproducir la misma decisión. La validación en tiempo de ejecución del software debe hacer cumplir los permisos y la validez de las transacciones. La supervisión de fraude debe explicar el riesgo, preservar evidencia y ayudar a los operadores a actuar rápidamente.

## Señales para recopilar {#signals-to-collect}

Comience con suscripciones estrechas y agregue flujos más amplios solo para investigación:

|Señal|Fuente|Usar|
| --- | --- | --- |
|Estado de la transacción|eventos del canal de procesamiento|Detectar rechazos repetidos, intentos de autorización fallidos y patrones de envío inusuales|
|Ciclo de vida de la cuenta y metadatos|Eventos de datos y consultas de cuenta|Detectar nuevas cuentas, cambios de alias, actualizaciones de identidad y ediciones inesperadas de metadatos|
|Saldos y transferencias de activos|Eventos de datos de activos y consultas de activos|Detectar movimientos de alto valor, expansión rápida, drenajes de saldo y contrapartes inusuales|
|Roles y permisos|Consultas de roles y permisos, eventos de datos de roles|Detectar la escalada de privilegios, concesiones de emergencia y accesos de alto riesgo obsoletos|
|Activar y cambios de contrato|Eventos de disparador, contrato y ejecutor|Detectar nueva automatización, cambios en las rutas de ejecución y actividad sospechosa de actualización|
|Cambios en la configuración y en los pares de red|Configuración y eventos de pares de red|Detectar cambios de gobernanza que afecten la validación, la red o la visibilidad del operador|
|Salud del operador|rutas de estado `/metrics` y Sumeragi|Separar el comportamiento sospechoso del usuario de la sobrecarga del nodo, la presión de la cola o las fallas de la red|

Use [filtros de eventos](/es/blockchain/filters.md) para evitar procesar todo el flujo de eventos cuando una regla solo necesita cuentas, activos, roles o cambios de configuración. Para la reconciliación periódica, combine el flujo con [consultas](/es/blockchain/queries.md) paginado para que el monitor pueda recuperarse después de una interrupción.

## Reglas de detección {#detection-rules}

Las familias de reglas comunes incluyen:

|Familia de reglas|Condición de ejemplo|Respuesta típica|
| --- | --- | --- |
|Velocidad|Una cuenta transfiere más de la cantidad o número esperado en un período corto|Alerta a los revisores y pausa los retiros del lado de la aplicación para esa cuenta|
|Ramificación|Los fondos se mueven de una cuenta a muchas cuentas recién vistas|Requerir aprobación manual antes de permitir transferencias adicionales|
|Drenaje de saldo|Una gran parte del saldo de una cuenta se retira poco después de un cambio de clave, alias o metadatos|Escalar como posible toma de control de cuenta|
|Escalada de privilegios|Se concede un permiso o rol de alto riesgo fuera de una ventana de cambios|Alertar a los operadores y revisar la transacción de la subvención|
|Explosión de rechazo|Un firmante criptográfico o cliente produce transacciones rechazadas repetidamente|Verificar abuso de credenciales, errores de integración o sondeos|
|Cambio de automatización|Un disparador, contrato u objeto relacionado con un ejecutor cambia inesperadamente|Pausar los flujos de trabajo dependientes hasta que se revise el cambio|
|Cambio sensible a la gobernanza|Cambios en el par de red, la configuración o el estado de ejecución del software ocurren sin un ticket aprobado|Comparar con el historial de gobernanza y el proceso de incidentes|

Las reglas deberían ser explícitas sobre la evidencia que requieren, la ventana de tiempo que evalúan, la acción que toman y la persona o sistema que puede cerrar el caso. Los umbrales que dependen del riesgo del cliente, del tipo de activo o de la jurisdicción pertenecen a la configuración de su servicio de monitoreo, no a scripts ad hoc.

## Controles de respuesta {#response-controls}

Diseñe acciones de respuesta antes de habilitar alertas. Un caso de fraude de alta gravedad debe tener un camino documentado desde la detección hasta la contención:

- notificar a los responsables de seguridad, operaciones y propietarios del negocio del dominio o definición de activo afectado
- conserve el cursor de eventos, el hash del bloque, el hash de la transacción, la autoridad, la carga útil y la instantánea de consulta que utilizó la regla de detección
- pausar las acciones del lado de la aplicación que están fuera del registro de la cadena de bloques, como los flujos de trabajo de pago, retiro, firma, puente o liquidación
- revocar roles o permisos que ya no estén justificados por el plan de respuesta a incidentes
- enviar transacciones de libro mayor de blockchain de seguimiento solo cuando la política de gobernanza activa y el modelo de permisos lo permitan
- rota las claves cuando la evidencia sugiera compromiso del firmante criptográfico

Evite dar al servicio de monitoreo un acceso de escritura amplio. Utilice una cuenta técnica dedicada con el conjunto más pequeño de permisos necesarios para las acciones de respuesta. Está permitido realizarlo. La aprobación humana debe seguir siendo parte de cualquier flujo de trabajo que pueda mover activos, cambiar permisos o alterar la configuración visible para los validadores.

## Evidencia y Retención {#evidence-and-retention}

Almacene la evidencia de monitoreo en un sistema de solo anexado que esté separado del directorio de datos del validador. Cada alerta debe incluir:

- nombre de la secuencia de eventos y cursor
- altura del bloque o hash criptográfico del bloque cuando esté disponible
- hash criptográfico de la transacción y principal de autorización
- cuenta, dominio, activo, rol, disparador o ID de configuración afectado
- carga útil de evento en bruto o un hash criptográfico canónico de la misma
- consultar vistas de datos en un punto en el tiempo utilizadas para enriquecer la alerta
- nombre de la regla, versión, umbral, puntuación y decisión del revisor

No almacene notas de investigación sensibles como metadatos del libro mayor público de la blockchain a menos que la política de gobernanza de datos de la red lo permita explícitamente. Si necesita vincular un caso fuera de la cadena con el estado en la cadena, preferiblemente un identificador de caso, una certificación firmada o un compromiso de hash criptográfico que no exponga detalles privados.

## Lista de verificación de implementación {#implementation-checklist}

- Habilite el perfil de telemetría necesario para `/metrics` y las rutas del operador.
- Suscríbete a los flujos de eventos Torii con filtros estrechos para los objetos que monitoreas.
- Persistir los cursores de eventos para que el monitor pueda reanudar sin interrupciones.
- Conciliar flujos con consultas paginadas en un horario regular.
- Mantenga los umbrales de riesgo y las listas permitidas en la configuración controlada por versiones.
- Prueba las reglas de alerta contra bloques históricos antes de habilitar acciones automáticas.
- Use cuentas técnicas dedicadas para acciones de respuesta.
- Revisar los roles y las concesiones de permisos en un horario recurrente.
- Incluya alertas de monitoreo de fraude en el proceso de respuesta a incidentes.

## Páginas relacionadas {#related-pages}

- [Eventos](/es/blockchain/events.md)
- [Filtros](/es/blockchain/filters.md)
- [Consultas](/es/blockchain/queries.md)
- [Permisos](/es/blockchain/permissions.md)
- [Rendimiento y Métricas](/es/guide/advanced/metrics.md)
- [Torii API puntos finales](/es/reference/torii-endpoints.md)
- [Seguridad Operativa](/es/guide/security/operational-security.md)
