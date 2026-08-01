---
translation_locale: es
translation_source: /guide/security/security-principles.md
translation_source_hash: 20139011c663a0bca6f9e486ef81f698370c34f8f02319317805b0d1dfb049c7
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Principios de seguridad {#security-principles}

Un libro mayor Iroha verifica las instrucciones firmadas y aplica permisos. No asegura llaves privadas, hosts, aplicaciones, estaciones de trabajo del operador o procedimientos de gobernanza. La implementación debe proteger esos sistemas.

Utilizar estos principios al diseñar y operar una red Iroha.

## Trate a la autoridad como una frontera de seguridad {#treat-authority-as-a-security-boundary}

- Una persona o un proceso que controla una clave privada puede actuar con la autoridad asignada a esa llave.
- Dar a cada entorno y función operativa una autoridad separada.
- Mantenga las claves de producción y las llaves de recuperación separadas de las credenciales de desarrollo y prueba rutinarias.
- Registre quién posee cada autoridad, dónde se custodia su firmante y cómo puede sustituirse o revocarse.

Véase [Criptografía de clave pública](./public-key-cryptography.md) y [Almacenamiento de claves criptográficas](./storing-cryptographic-keys.md).

## Aplique el menor privilegio {#apply-least-privilege}

- Solo otorgue los permisos Iroha, el acceso al host y el acceso a la red necesarios para un papel.
- Separar la firma de transacciones rutinarias de las autoridades de gobierno, despliegue y recuperación.
- Requerir la aprobación independiente de los cambios que puedan afectar a la membresía del validador, permisos privilegiados o activos de alto valor.
- Revisar el acceso después de los cambios de rol y eliminar el acceso que ya no es necesario.

## Utilice capas de protección {#use-layers-of-protection}

- Proteja los firmantes, las aplicaciones, los sistemas operativos, las redes y el acceso físico. No dependa de un único control.
- Exponer únicamente las rutas Torii, peer, monitoring y aplicación requeridas por el despliegue.
- Utilizar canales autenticados y cifrados para el acceso administrativo y los datos sensibles.
- Mantenga los sistemas actualizados con parches y deshabilite los servicios que la implementación no utiliza.
- Mantenga los secretos fuera del control de código fuente, las líneas de comandos, los registros, los tiques, el chat y la documentación pública.

## Hacer que las implementaciones sean revisables {#make-deployments-reviewable}

- Mantenga una configuración no secreta y la automatización de despliegue en el control de versión.
- Revise los cambios en los binarios, la configuración, el material de génesis, la membresía de validadores, los permisos y las rutas públicas.
- Verifique los artefactos de liberación antes del despliegue. Grabe las versiones aprobadas y hashes.
- Prueba la combinación binaria y de configuración exacta que se ejecutará en producción.
- Conserve el comportamiento determinista de la red. La aceleración por hardware no debe cambiar los resultados visibles para los pares.

## Monitorear y preservar las pruebas {#monitor-and-preserve-evidence}

- Monitorear la salud de los compañeros, el progreso del consenso, cambios en permisos, instrucciones privilegiadas, fallos de autenticación y cambios inesperados en configuración.
- Envíe las alertas importantes a un sistema que no dependa del host afectado.
- Preservar registros relevantes, referencias del libro mayor, instantáneas de configuración y hashes de transacciones con sellos de tiempo fiables.
- Tratar los datos de seguimiento que faltan como un problema operativo que requiere investigación.

## Prepárate para la recuperación antes de lanzar {#prepare-recovery-before-launch}

- Definir quién puede declarar un incidente y quien puede aprobar las acciones de recuperación.
- Pruebe los procedimientos de copia de seguridad, restauración, sustitución de claves, revocación de permisos y recuperación de pares.
- Mantenga disponibles durante un incidente los artefactos de versión confiables, la configuración, los registros de génesis y los inventarios.
- Restaure primero las lecturas y la monitorización. Reanude las escrituras solo después de que la red recuperada y las aplicaciones dependientes superen sus comprobaciones.
- Revisa cada incidente y actualiza los controles, automatización y ejercicios.

::: warning

Las acciones del libro mayor pueden ser irreversibles. Utilice los procedimientos previamente revisados y las aprobaciones requeridas antes de enviar una transacción de recuperación o gobernanza.

:::

Sigue con [Seguridad operativa](./operational-security.md) y [Preparación para la liberación ](../best-practices/release-readiness.md).
