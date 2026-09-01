---
translation_locale: es
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 7839268b8c1f6700b0c26652e3308fa4e8acef4717d8527c609b6f30fb8c84ab
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Despliegue de red {#network-deployment}

Trate una red Iroha como un sistema coordinado. Los validadores deben ponerse de acuerdo sobre el génesis de la blockchain, la topología, los nodos confiables de la red y la configuración relevante para el consenso antes de que la red pueda iniciar y continuar finalizando bloques.

## Separación del entorno {#environment-separation}

- Mantenga paquetes de configuración separados para desarrollo local, testnet compartido, staging y producción.
- Genere claves nuevas para cada entorno no desechable. No reutilice material de clave localnet o Taira en producción.
- Mantenga la configuración del par de red, la configuración del cliente, el génesis de blockchain firmado, los scripts y las notas de implementación juntos como un artefacto de versión liberada.
- Almacene las claves privadas fuera de los repositorios y plantillas de implementación.

Ver [Claves para el Despliegue de la Red](/es/guide/configure/keys-for-network-deployment.md).

## génesis y topología de blockchain {#genesis-and-topology}

- Haga que cada validador use la misma transacción génesis de blockchain firmada, el conjunto de pares de red confiables, la topología y las Pruebas de Posesión del validador cuando el perfil lo requiera.
- Use al menos cuatro validadores para un despliegue mínimamente tolerante a fallos bizantinos.
- Separe los validadores de los observadores en la planificación de capacidad. Los observadores no votan, no proponen ni recopilan, pero aún así consumen almacenamiento, sincronización de bloques y ancho de banda de red.
- Trata los cambios de génesis, ejecutor y topología de la blockchain como migraciones coordinadas en lugar de ediciones de un solo nodo.

Vea [génesis de la blockchain](/es/reference/genesis.md), [Gestión de pares de red](/es/guide/configure/peer-management.md) y [Rendimiento y Métricas](/es/guide/advanced/metrics.md#node-count-and-quorum).

## Torii y Acceso a la Red {#torii-and-network-access}

- Coloque Torii detrás de un proxy inverso o un cortafuegos cuando esté expuesto fuera del host o de la red privada.
- Termina TLS y aplica autenticación básica, limitación de velocidad y controles de tamaño de solicitud en el borde cuando el despliegue los requiera.
- Publique solo los endpoints API necesarios para el entorno. Las rutas de operador y telemetría deben ser más restringidas que las rutas públicas de solo lectura.
- Vincule las direcciones del oyente a interfaces locales del host cuando los pares de la red no deban aceptar tráfico remoto directamente.

Vea [Torii API puntos finales](/es/reference/torii-endpoints.md) y [Redes Privadas Virtuales](/es/guide/security/vpn.md).

## Consenso y Capacidad {#consensus-and-capacity}

- Mida el despliegue antes de ajustar los temporizadores de consenso. Los tiempos de espera más bajos pueden reducir la latencia solo mientras las capas de red, almacenamiento y ejecución se mantengan al día.
- Observe la dirección de la cola, no solo muestras cortas del rendimiento. Una cola que crece durante una carga constante significa que la red está sobrecargada.
- Registre los parámetros efectivos Sumeragi, el perfil de telemetría, el recuento de validadores, la red RTT, la forma de la carga de trabajo y los detalles del hardware para cada referencia.
- Cambie un límite de cola limitada o de recuperación de carga útil a la vez, y conserve la evidencia de latencia, tráfico, memoria y contrapresión antes y después.

Ver [Rendimiento y Métricas](/es/guide/advanced/metrics.md).

## Gestión de hardware sin sistema operativo y de procesos {#bare-metal-and-process-management}

- Mantenga separados el `config.toml`, la clave privada, el directorio de almacenamiento y los puertos de cada par de la red.
- Use administradores de procesos como systemd con reinicio explícito, registro y políticas de recursos.
- Conserve los comandos generados README y de inicio de los paquetes localnet Kagami al traducir una topología de prueba a hosts gestionados.

Ver [Ejecutando Iroha en hardware físico](/es/guide/advanced/running-iroha-on-bare-metal.md).
