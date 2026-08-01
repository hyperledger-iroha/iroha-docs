---
translation_locale: es
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 984957526424a4e0ec9f29a6da1bb64699245bb135e8157bbe684bc3d87de4cc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Preparación para la liberación {#release-readiness}

Antes de promover una aplicación Iroha o un cambio en la red, compruebe el comportamiento en el entorno más pequeño que pueda exponer el riesgo relevante, y luego se mueva deliberadamente a través de las redes de prueba compartidas y las puertas de producción.

## Puerta de red local {#localnet-gate}

- Lanzar una red local desechable con la misma pista Iroha y el recuento de validadores prácticos más cercano.
- Ejecutar pruebas unitarias para constructores de transacciones, análisis de consultas, manejo de rechazo y carga de configuración.
- Exercir las pistas de lectura y escritura más pequeñas con éxito a través de la misma forma SDK o CLI que la aplicación usará posteriormente.
- Captura hashes de transacciones esperadas, estados, eventos y lecturas de estado en los artefactos de prueba.

Véase [Lanzamiento Iroha 3](/es/get-started/launch-iroha.md) y [SDK Tutoriales ](/es/guide/tutorials/).

## Puerta de prueba compartida {#shared-testnet-gate}

- Utilice Taira u otra red de prueba compartida para el comportamiento del punto final, las tarifas, la financiación de la cuenta, la latencia y los ensayos operacionales.
- Mantener en vivo testnet escribe opt-in para que las pruebas ordinarias no dependen de la disponibilidad de la red o el gasto de fondos de testnet.
- Verifique la financiación de los firmantes, los metadatos de activos de las tarifas, los permisos de la autoridad y el estado esperado antes de enviar cada transacción de prueba.
- Esperar un estado terminal, luego verificar el estado resultante con una consulta de sólo lectura.

Véase [Construir en SORA 3: Taira y Minamoto ](/es/get-started/sora-nexus-dataspaces.md).

## Puerta principal o puerta de producción {#mainnet-or-production-gate}

- Utilice firmas de producción separadas, fondos, dominios y caminos de configuración. No promueva las claves de la red de prueba o los supuestos del grifo.
- Confirmar el cruce requerido SDK los escenarios con el [Matriz de compatibilidad](/es/reference/compatibility-matrix.md). Separadamente pin y comprobar el exacto CLI, binario de pares, configuración y liberación de red utilizados por el despliegue.
- Los permisos de revisión, el patrocinio por honorarios, los límites de tarifas, la supervisión, el estado de copia de seguridad y los criterios de retroceso antes de la ventana de lanzamiento.
- Requerir una transacción por escrito o un plan de migración para los escritos de alto impacto.

## El retroceso y la recuperación {#rollback-and-recovery}

- Definir qué cambios pueden revertirse mediante la implementación de código, que requieren una transacción en cadena y que no se pueden deshacer directamente.
- Para los cambios de datos en la cadena, prepare transacciones compensatorias o guiones de migración antes de escribir la primera producción.
- Para los cambios de red, mantenga disponible el binario anterior, el paquete de configuración, la genesis firmada y la libreta operativa durante el lanzamiento.
- Establezca un punto de decisión para abortar el despliegue basado en señales objetivas como tasa de rechazo, crecimiento de filas, latencia o salud entre pares.

## Lista de control final {#final-checklist}

- La configuración es específica del entorno y no contiene secretos de prueba solamente.
- El comportamiento de retomar la transacción es idempotente o está explícitamente limitado.
- La aplicación puede distinguir el rechazo, la expiración, el plazo y los fallos de disponibilidad del punto final.
- El seguimiento cubre el rendimiento, la latencia, la profundidad de las colas, los rechazos, los cambios de visualización y los eventos comerciales relevantes.
- Los operadores tienen libretas de ejecución para los modos de falla esperados.
- La revisión de seguridad abarcó la custodia de las claves, los permisos, la exposición a la red y la autoridad de automatización.
