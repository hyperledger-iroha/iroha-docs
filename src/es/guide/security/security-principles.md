---
translation_locale: es
translation_source: /guide/security/security-principles.md
translation_source_hash: 20139011c663a0bca6f9e486ef81f698370c34f8f02319317805b0d1dfb049c7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Principios de seguridad {#security-principles}

Un libro mayor blockchain Iroha verifica las instrucciones firmadas y aplica permisos. No protege claves privadas, hosts, aplicaciones, estaciones de trabajo de operadores ni procedimientos de gobernanza. La implementación debe proteger esos sistemas.

Utilice estos principios al diseñar y operar una red Iroha.

## Tratar al principal de autorización como un límite de seguridad {#treat-authority-as-a-security-boundary}

- Una persona o proceso que controla una clave privada puede actuar con el principal de autorización asignado a esa clave.
- Asigne a cada entorno y rol operativo un principio de autorización separado.
- Mantenga las claves de producción y las claves de recuperación separadas de las credenciales de desarrollo y prueba rutinarias.
- Registre quién posee cada principal de autorización, dónde se encuentra su firmante criptográfico y cómo puede ser reemplazado o revocado.

Vea [Criptografía de clave pública](./public-key-cryptography.md) y [Almacenamiento de Claves Criptográficas](./storing-cryptographic-keys.md).

## Aplicar el mínimo privilegio {#apply-least-privilege}

- Conceda únicamente los permisos Iroha, el acceso al host y el acceso a la red necesarios para un rol.
- Separe la firma de transacciones rutinarias del principio de autorización de gobernanza, implementación y recuperación.
- Requerir aprobación independiente para los cambios que puedan afectar la membresía de validadores, los permisos privilegiados o los activos de alto valor.
- Revisa el acceso después de los cambios de rol y elimina el acceso que ya no sea necesario.

## Usar capas de protección {#use-layers-of-protection}

- Proteja los firmantes criptográficos, las aplicaciones, los sistemas operativos, las redes y el acceso físico. No dependa de un solo control.
- Exponga solo las rutas de Torii, pares de red, monitoreo y aplicaciones requeridas por la implementación.
- Use canales autenticados y cifrados para el acceso administrativo y los datos sensibles.
- Mantenga los sistemas actualizados y desactive los servicios que la implementación no utilice.
- Mantén los secretos fuera del control de versiones, las líneas de comando, los registros, los tickets, el chat y la documentación pública.

## Hacer revisables los despliegues {#make-deployments-reviewable}

- Mantenga la configuración no secreta y la automatización de despliegue en el control de versiones.
- Revisar los cambios en binarios, configuración, material de génesis de blockchain, membresía de validadores, permisos y rutas públicas.
- Verifique los artefactos de la versión antes del despliegue. Registre las versiones aprobadas y los hashes criptográficos.
- Prueba la combinación exacta de binario y configuración que se ejecutará en producción.
- Preserve el comportamiento determinista de la red. La aceleración de hardware no debe cambiar los resultados visibles para los pares.

## Monitorear y preservar evidencia {#monitor-and-preserve-evidence}

- Supervise la salud de los pares de la red, el progreso del consenso, los cambios de permisos, las instrucciones privilegiadas, los fallos de autenticación y los cambios de configuración inesperados.
- Envía alertas importantes a un sistema que no dependa del host afectado.
- Conserve los registros pertinentes, las referencias del libro mayor, las instantáneas de configuración y los hashes de las transacciones con marcas de tiempo fiables.
- Trate los datos de monitoreo faltantes como un problema operativo que requiere investigación.

## Preparar la recuperación antes del lanzamiento {#prepare-recovery-before-launch}

- Define quién puede declarar un incidente y quién puede aprobar las acciones de recuperación.
- Probar los procedimientos de respaldo, restauración, reemplazo de claves, revocación de permisos y recuperación de pares de red.
- Mantenga disponibles los artefactos de versiones confiables, la configuración, los registros de génesis de la cadena de bloques y los inventarios durante un incidente.
- Restablezca primero las lecturas y la monitorización. Reanude las escrituras solo después de que la red recuperada y las aplicaciones dependientes superen sus verificaciones.
- Revisar cada incidente y actualizar los controles, la automatización y los ejercicios.

::: warning

Las acciones en el libro mayor de blockchain pueden ser irreversibles. Use procedimientos previamente revisados y las aprobaciones requeridas antes de enviar una transacción de recuperación o de gobernanza.

:::

Continúe con [Seguridad Operativa](./operational-security.md) y [Preparación para el Lanzamiento](../best-practices/release-readiness.md).
