---
translation_locale: es
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Operaciones {#operations}

La preparación operativa significa que la red puede ser observada, modificada, respaldada y recuperada sin depender del acceso improvisado a los hosts validador.

## Observabilidad {#observability}

- Habilite perfiles de telemetría de forma intencionada. Use `extended` cuando se necesite `/metrics` y `full` durante las pruebas que requieran rutas detalladas de operadores Sumeragi.
- Tablero de control: rendimiento aceptado, rendimiento rechazado, latencia de confirmación, profundidad de la cola, saturación de la cola, cambios de vista, mensajes de consenso descartados y presión de almacenamiento.
- Mantenga las instantáneas de estado, las capturas de métricas, los registros y la configuración de despliegue en el mismo conjunto de artefactos del incidente o prueba de rendimiento.
- Alerta sobre el crecimiento sostenido de la cola, picos inesperados de rechazo, altura de bloque detenida, cambios frecuentes de vista y cambios en la salud de los pares de la red.

Ver [Rendimiento y Métricas](/es/guide/advanced/metrics.md).

## Libros de procedimientos {#runbooks}

- Escriba runbooks para el reinicio de pares de red, degradación Torii, compromiso de claves, errores de permisos, agotamiento de patrocinadores de tarifas, colas atascadas y síntomas de partición de red.
- Incluya verificaciones de solo lectura exactas antes de las operaciones de escritura, especialmente para el registro de pares de red, la concesión de permisos y los cambios de parámetros.
- Mantenga los contactos de emergencia y las reglas de escalamiento fuera del repositorio de documentos si incluyen datos operativos privados.
- Revisa los manuales de procedimientos después de cada incidente, ensayo o actualización importante.

Ver [Seguridad Operativa](/es/guide/security/operational-security.md).

## Copias de seguridad y recuperación {#backups-and-recovery}

- Respaldar el almacenamiento de los pares de red según el punto de recuperación requerido por la implementación. Validar las restauraciones en hosts que no sean de producción.
- Mantenga recuperables el génesis firmado, los metadatos de versión, la configuración de los pares y los registros de custodia de claves, incluso si un host validador no está disponible.
- Documente si un procedimiento de recuperación se reconstruye desde el génesis de la blockchain, se restaura desde una vista de datos en un punto en el tiempo o reemplaza un nodo de red fallido con una nueva identidad.
- Nunca pruebe los procedimientos de restauración por primera vez durante un incidente de producción.

## Gestión del cambio {#change-management}

- Trate los cambios de configuración en la cadena como transacciones que requieren revisión, lecturas preliminares, autorización y verificación posterior al cambio.
- Desplegar actualizaciones binarias de pares de la red con un plan de compatibilidad y un punto de decisión para revertir.
- Evite cambiar la topología de los pares de la red, el tiempo de consenso y la carga de trabajo de la aplicación en la misma ventana de mantenimiento a menos que el plan de migración lo requiera.
- Registra los hashes criptográficos de las transacciones y las alturas de bloque para los cambios operativos.

Vea [Recarga en caliente](/es/guide/advanced/hot-reload.md) y [Matriz de compatibilidad](/es/reference/compatibility-matrix.md).

## Revisiones de capacidad {#capacity-reviews}

- Vuelva a ejecutar las comprobaciones de carga cuando cambien el número de validadores, el hardware, la ubicación en la red, la combinación de cargas de trabajo o los parámetros de consenso.
- Mida el calentamiento, el estado estable y la carga máxima esperada en lugar de depender de una muestra de rendimiento óptimo a corto plazo.
- Compare el rendimiento aceptado con el rendimiento comprometido y la profundidad de la cola. Si lo enviado TPS supera lo comprometido TPS y las colas crecen, la red ha superado su límite operativo sostenible.
