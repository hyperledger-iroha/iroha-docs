---
translation_locale: es
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 312f9cb3c6fd937b3e7c30ea27d1876ea7901cfa79eced352611db99bbca4a70
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Despliegue de la red {#network-deployment}

Tratar una red Iroha como un sistema coordinado. Los validadores deben acordar sobre la génesis, topología, pares de confianza y configuración relevante para el consenso antes de que la red pueda comenzar y seguir completando los bloques.

## Separación del medio ambiente {#environment-separation}

- Mantener paquetes de configuración separados para el desarrollo local, la red de pruebas compartida, la puesta en escena y la producción.
- Generar llaves nuevas para todos los entornos no desechables. No reutilice el localnet o el material clave Taira en la producción.
- Mantenga la configuración de pares, la configuración del cliente, la genesis firmada, los scripts y las notas de implementación juntos como un artefacto de liberación versionado.
- Almacenar las claves privadas fuera de los repositorios y plantillas de implementación.

Véase [Las claves para el despliegue de la red ](/es/guide/configure/keys-for-network-deployment.md).

## Génesis y topología {#genesis-and-topology}

- Haga que cada validador utilice la misma transacción de génesis firmada, conjunto de pares confiables, topología y validador Pruebas de posesión cuando el perfil las requiera.
- Utilizar al menos cuatro validadores para un despliegue mínimo de tolerancia a fallos bizantinos.
- Los validadores separados de los observadores en la planificación de las capacidades. Los observadores no votan, proponen o recogen, pero todavía consumen almacenamiento, sincronización de bloqueo y ancho de banda de la red.
- Tratar los cambios de génesis, ejecutor y topología como migraciones coordinadas en lugar de ediciones individuales.

Ver [Génesis](/es/reference/genesis.md), [Gestión entre pares](/es/guide/configure/peer-management.md) y [Performance and Metrics ](/es/guide/advanced/metrics.md#node-count-and-quorum).

## Torii y el acceso a la red {#torii-and-network-access}

- Coloque Torii detrás de un proxy o firewall inverso cuando esté expuesto fuera de la red host o privada.
- Terminar TLS y aplicar controles básicos de autenticación, limitación de tasa y tamaño de solicitud en el borde cuando la implementación los requiera.
- Publicar sólo los puntos finales necesarios para el medio ambiente. Las rutas del operador y de la telemetría deben ser más restringidas que las rutas públicas de lectura única.
- Enlace las direcciones del oyente a interfaces locales del host cuando los compañeros no deben aceptar el tráfico remoto directamente.

Véase [Torii Puntos finales](/es/reference/torii-endpoints.md) y [Redes privadas virtuales ](/es/guide/security/vpn.md).

## El consenso y la capacidad {#consensus-and-capacity}

- Mide la implementación antes de ajustar los tiempos de consenso. Los tiempos más bajos pueden reducir la latencia solo mientras las capas de red, almacenamiento y ejecución se mantienen al día.
- Observe la dirección de las colas, no sólo muestras cortas de rendimiento. Una cola que crece durante una carga constante significa que la red está sobrecargada.
- Registrar los parámetros efectivos Sumeragi, el perfil de telemetría, el número de validadores, la red RTT, la forma de la carga de trabajo y los detalles del hardware para cada referencia.
- Aumentar la fanout del colector solo después de comparar las señales de latencia, tráfico y contrapresión.

Véase [Performance and Metrics](/es/guide/advanced/metrics.md).

## Gestión de metales y procesos desnudos {#bare-metal-and-process-management}

- Mantenga separados los `config.toml`, la clave privada, el directorio de almacenamiento y los puertos de cada pares.
- Utilizar administradores de procesos como systemd con políticas explícitas de reinicio, registro y recursos.
- Conservar los comandos generados README y iniciar desde los paquetes de localnet Kagami cuando se traduce una topología de prueba a hosts administrados.

Véase [Running Iroha en Metales desnudos ](/es/guide/advanced/running-iroha-on-bare-metal.md).
