---
translation_locale: es
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Operaciones {#operations}

La disponibilidad operativa significa que la red puede ser observada, cambiada, respaldada y recuperada sin depender del acceso improvisado a los hosts de validadores.

## Observabilidad {#observability}

- Habilitar intencionalmente los perfiles de telemetría. Utilice `extended` cuando sea necesario `/metrics` y `full` durante las pruebas que requieran rutas detalladas del operador Sumeragi.
- El panel aceptó el rendimiento, rechazó el rendimiento. Comprometió la latencia, profundidad de cola, saturación de cola, cambios de visualización, dejó caer los mensajes de consenso y presión de almacenamiento.
- Mantenga instantáneas de estado, rastros de métricas, registros y configuración de implementación en el mismo conjunto de incidentes o artefactos de referencia.
- Alerta sobre el crecimiento sostenido de las colas, picos inesperados de rechazo, estancamiento de la altura del bloque, cambio en la visión y cambios en la salud de los compañeros.

Véase [Performance and Metrics](/es/guide/advanced/metrics.md).

## Libros de ejecución {#runbooks}

- Escriba libretas de ejecución para reiniciar por pares, degradación Torii, compromiso de claves, errores de permisos, agotamiento del patrocinador de tarifas, colas atascadas y síntomas de partición de red.
- Incluya controles exactos de sólo lectura antes de las operaciones de escritura, especialmente para el registro entre pares, concesiones de permisos y cambios en parámetros.
- Mantener los contactos de emergencia y las reglas de escalada fuera del repositorio de documentos si incluyen datos operativos privados.
- Revise los libros de carreras después de cada incidente, ensayo o actualización importante.

Véase [Seguridad operativa ](/es/guide/security/operational-security.md).

## Las copias de seguridad y la recuperación {#backups-and-recovery}

- Backup de almacenamiento según el punto de recuperación requerido por la implementación. Valida las restauraciones en hosts no producidos.
- Mantenga genesis firmada, libere metadatos, configuración de pares y registros de custodia de claves recuperables incluso si un host validador no está disponible.
- Documentar si un procedimiento de recuperación se reconstruye a partir de la genesis, se restaura desde una instantánea o reemplaza a un compañero fallido con una nueva identidad.
- Nunca se realicen ensayos de restauración por primera vez durante un incidente productivo.

## Gestión del cambio {#change-management}

- Trate los cambios de configuración en la cadena como transacciones que requieren revisión, lecturas previas al vuelo, autorización y verificación posterior a los cambios.
- Implementar actualizaciones binarias de pares con un plan de compatibilidad y un punto de decisión de retroceso.
- Evite cambiar la topología de pares, el tiempo de consenso y la carga de trabajo de las aplicaciones en la misma ventana de mantenimiento a menos que el plan de migración lo requiera.
- Registrar los hashes de la transacción y las alturas del bloque para cambios operativos.

Véase [Recarga de calor](/es/guide/advanced/hot-reload.md) y [ Matriz de compatibilidad ](/es/reference/compatibility-matrix.md).

## Revisiones de la capacidad {#capacity-reviews}

- Verificación de carga se vuelve a ejecutar cuando el recuento de validadores, el hardware, la colocación de la red, la mezcla de carga de trabajo o los parámetros de consenso cambian.
- Medir el calentamiento, el estado de estabilidad y la carga máxima esperada en lugar de confiar en una muestra corta de rendimiento del mejor caso.
- Comparar el rendimiento aceptado con el rendimiento comprometido y la profundidad de las colas. Si los TPS enviados superan los TPS comprometidos y las colas crecen, la red ha pasado su alcance sostenible.
