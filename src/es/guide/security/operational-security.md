---
translation_locale: es
translation_source: /guide/security/operational-security.md
translation_source_hash: 042673aca63962b4b3f91e59c29bc5030ada7d63f082991899951301cb1f6887
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Seguridad operativa {#operational-security}

La seguridad operativa protege a las personas, anfitriones, credenciales y procedimientos en torno a un despliegue de Iroha Los registros del libro mayor aceptaron cambios de estado. Los operadores deben asegurar por separado sus estaciones de trabajo, las claves de firma y el proceso de respuesta a incidentes.

Utilice los controles a continuación como una línea de base para el despliegue. Ajustadlos al valor en riesgo y a las necesidades de su organización.

## Establecer una línea de base operativa {#establish-an-operational-baseline}

- Mantener un inventario de hosts de validadores, identidades de pares, autoridades de cuentas, dispositivos de firma, puntos finales públicos y personas responsables.
- Utilice credenciales separadas para el desarrollo, la prueba y la producción. Asigna a cada firmante, token portador y llave privada en un entorno.
- Mantenga la configuración y automatización de despliegue en control de versión revisable. Inyecta secretos a tiempo de ejecución desde una tienda secreta o dispositivo de firma aprobado.
- Registrar los hashes o firmas esperados de los artefactos de liberación. Verificarlos antes del despliegue. Limitar quién puede reemplazar binarios, material genético, configuración o definiciones de servicio.
- Aplicar el menor privilegio a las cuentas del sistema operativo, los permisos Iroha y la administración de red. Conceda a cada papel sólo la autoridad que su trabajo necesita.
- Pruebe los procedimientos de copia de seguridad, restauración, sustitución de claves y recuperación de pares antes del lanzamiento a producción.

Revisar [Principios de seguridad](./security-principles.md) y [Preparación para la liberación](../best-practices/release-readiness.md) al definir el límite de referencia.

## Proteja las llaves y sus firmas {#protect-keys-and-signers}

- Mantenga las claves privadas, el material de la semilla, los tokens del portador, los encabezados de autorización y los secretos de recuperación fuera del control de la fuente, los rastreadores de emisión, las transcripciones de chat, capturas de pantalla y documentación pública.
- Utilizar firmas de hardware o aisladas para autoridades de alto valor. Mantenga la materia prima clave fuera de los navegadores y los procesos de aplicación de propósito general cuando un cliente puede delegar firmas.
- Utilice autoridades separadas para las transacciones de rutina, la gobernanza, el despliegue y la recuperación.
- Encripta el almacenamiento secreto y sus copias de seguridad. Aplica los mismos controles de acceso a una copia de seguridad de llave privada que la clave en vivo.
- Mantener un procedimiento de sustitución o revocación probado. Sustituir una llave cuando la política lo requiera o cuando se sospecha que está expuesta.
- Requerir una revisión independiente de los cambios en la membresía del validador, roles privilegiados o activos de alto valor.

Véase [Generación de claves criptográficas](./generating-cryptographic-keys.md) y [ almacenamiento de claves cryptográficas ](./storing-cryptographic-keys.md) para obtener una guía específica de las claves.

## Los nodos de Harden y el acceso del operador {#harden-nodes-and-operator-access}

- Ejecutar nodos y herramientas de operador en los sistemas actualmente soportados por el proveedor. Deshabilitar servicios innecesarios.
- Dar acceso administrativo a los operadores designados sólo a través de canales auditados y cifrados.
- Coloque interfaces no públicas en una red privada o [VPN](./vpn.md).
- Exponer únicamente las rutas Torii, el seguimiento y la aplicación requeridas por la implementación.
- Proteger todos los accesos públicos con límites de tarifas y seguridad del transporte adecuados para el medio ambiente.
- Protege los archivos de configuración y las credenciales de servicio con permisos restringidos de archivos. Mantenga secretos fuera de las líneas de comando, listas de procesos e historial de shell.
- Funciones separadas de validador, cliente, monitoreo y respaldo cuando el modelo de riesgo requiera un control independiente.
- Sincronizar el tiempo de fuentes confiables, conservar suficientes registros del sistema, servicio y red para la investigación.

## Flujos de trabajo de navegador y administrador seguros {#secure-browser-and-admin-workflows}

Para un operador que utilice una interfaz web:

- Utilizar un navegador totalmente actualizado y actualmente soportado por el proveedor en una estación de trabajo gestionada.
- Utilice un perfil o dispositivo dedicado al operador con sólo las extensiones requeridas.
- Verificar el origen y el certificado antes de aprobar la solicitud.
- Tratar los dominios similares, redirecciones inesperadas y solicitudes de material básico clave como incidentes.
- Bloquear los sitios y extensiones no relacionados de la sesión del operador activo.
- Utilizar sesiones de corta duración. Requerir una nueva autenticación para acciones privilegiadas.
- Muestre los detalles de la transacción al firmante. El operador debe poder verificar la autoridad, la red, las instrucciones, los activos y las tarifas antes de aprobarla.

El aislamiento del navegador reduce la exposición. Los operadores aún deben revisar las transacciones y usar firmas seguras.

## Monitorear y responder {#monitor-and-respond}

Monitorear estas señales:

- cambios en la membresía de los validadores y pares
- repetidas fallas en la autorización o instrucciones privilegiadas inusuales
- Cambios inesperados en el software, la configuración o la ruta
- fallas de firma, consulta y transacción fuera de la línea de base normal
- agotamiento de los recursos, un consenso estancado o la pérdida de compañeros esperados.
- Cambios de activos, permisos y cuentas que coincidan con las reglas de fraude

Enviar alertas a un canal independiente del anfitrión afectado. Preservar registros relevantes, instantáneas de configuración, eventos en el libro mayor y hashes de transacciones con sellos de tiempo. Ver [Monitoreo de fraudes](./fraud-monitoring.md) y [Performance and Metrics](../advanced/metrics.md).

## Plan de recuperación {#recovery-plan}

Preparar el plan de recuperación antes del lanzamiento de la producción.

- que puede declarar y coordinar un incidente.
- Cómo contactar a los validadores, operadores de infraestructuras, propietarios de aplicaciones y usuarios afectados.
- cuáles autoridades pueden revocar permisos, reemplazar claves o cambiar la membresía de pares
- donde se almacenan binarios de confianza, configuración, registros genéticos, copias de seguridad e inventarios clave.
- Cómo validar la red y las aplicaciones dependientes después de la recuperación

Cuando ocurre un incidente:

1. Aísle el host, la credencial, la ruta o la autoridad afectados. Preserve las pruebas.
2. Conservar registros y referencias del libro mayor, registrar todas las acciones de recuperación.
3. Revocar o sustituir las credenciales y permisos expuestos mediante el proceso de gobernanza aprobado.
4. Restaurar el software y la configuración de los artefactos verificados.
5. Confirme la membresía de los pares, el estado del consenso, las rutas públicas, la supervisión y las lecturas de las aplicaciones. Reanude las operaciones de escritura solo después de que estas comprobaciones se superen.
6. Documentar la causa raíz. actualizar los controles, automatización y ejercicios.

::: warning

Seguir los procedimientos previamente revisados para las acciones irreversibles del libro mayor y solicitar las aprobaciones apropiadas a la autoridad afectada y a los activos.

:::
