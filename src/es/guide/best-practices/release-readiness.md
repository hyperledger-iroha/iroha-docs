---
translation_locale: es
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 984957526424a4e0ec9f29a6da1bb64699245bb135e8157bbe684bc3d87de4cc
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Preparación para el Lanzamiento {#release-readiness}

Antes de promover una aplicación o cambio de red Iroha, demuestre el comportamiento en el entorno más pequeño que pueda exponer el riesgo relevante, luego avance a través de las puertas de testnet compartida y producción deliberadamente.

## Puerta de la red local {#localnet-gate}

- Inicie una red local desechable con el mismo rastreo Iroha y el recuento de validadores más cercano y práctico.
- Ejecuta pruebas unitarias para los generadores de transacciones, el análisis de consultas, el manejo de rechazos y la carga de configuración.
- Ejercita las rutas de lectura y escritura más pequeñas y exitosas a través de la misma forma SDK o CLI que la aplicación usará más adelante.
- Captura los hashes criptográficos de transacciones esperadas, los estados, los eventos y las lecturas de estado en los artefactos de prueba.

Vea [Lanzar Iroha 3](/es/get-started/launch-iroha.md) y [SDK Tutoriales](/es/guide/tutorials/).

## Puerta de Testnet Compartida {#shared-testnet-gate}

- Use Taira u otra testnet compartida para el comportamiento del endpoint API, tarifas, financiamiento de cuentas, latencia y ensayos operativos.
- Mantener la escritura en la testnet en vivo como opcional para que las ejecuciones de prueba ordinarias no dependan de la disponibilidad de la red ni gasten fondos de la testnet.
- Verifique la financiación del firmante criptográfico, los metadatos del activo de la tarifa, los permisos del principal de autorización y el estado esperado antes de enviar cada transacción de prueba en vivo.
- Espera un estado terminal, luego verifica el estado resultante con una consulta de solo lectura.

Ver [Construir sobre SORA 3: Taira y Minamoto](/es/get-started/sora-nexus-dataspaces.md).

## Red principal o puerta de producción {#mainnet-or-production-gate}

- Use firmantes, fondos, dominios y rutas de configuración distintos en producción. No reutilice claves de la red de pruebas ni presupuestos sobre su dispensador.
- Confirme los escenarios cruzados requeridos SDK con el [Matriz de compatibilidad](/es/reference/compatibility-matrix.md). Separe, fije y pruebe el exacto CLI, binario de par de red, configuración y versión de red utilizada por la implementación.
- Revise los permisos, el patrocinio de tarifas, los límites de tasa, la supervisión, el estado de las copias de seguridad y los criterios de reversión antes de la ventana de lanzamiento.
- Requerir un plan escrito de transacciones o migración para escrituras de alto impacto.

## Reversión y Recuperación {#rollback-and-recovery}

- Define qué cambios se pueden revertir mediante la implementación de código, cuáles requieren una transacción en la cadena y cuáles no se pueden deshacer directamente.
- Para los cambios de datos en la cadena, prepare transacciones compensatorias o scripts de migración antes de la primera escritura en producción.
- Para los cambios de red, mantenga disponible el binario anterior, el paquete de configuración, el genesis de blockchain firmado y el manual operativo durante la versión.
- Establezca un punto de decisión para abortar la implementación basado en señales objetivas como la tasa de rechazo, el crecimiento de la cola, la latencia o la salud de los pares de la red.

## Lista de verificación final {#final-checklist}

- La configuración es específica del entorno y no contiene secretos solo para pruebas.
- El comportamiento de reintento de la transacción es idempotente o explícitamente limitado.
- La aplicación puede distinguir entre rechazo, caducidad, tiempo de espera y fallos de disponibilidad del endpoint API.
- La supervisión abarca el rendimiento, la latencia, la profundidad de la cola, los rechazos, los cambios de vista y los eventos comerciales relevantes.
- Los operadores tienen manuales de procedimientos para los modos de falla esperados.
- La revisión de seguridad cubrió la custodia de claves, los permisos, la exposición de la red y el principio de autorización de automatización.
