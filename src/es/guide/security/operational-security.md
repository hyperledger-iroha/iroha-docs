---
translation_locale: es
translation_source: /guide/security/operational-security.md
translation_source_hash: 042673aca63962b4b3f91e59c29bc5030ada7d63f082991899951301cb1f6887
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Seguridad Operativa {#operational-security}

La seguridad operacional protege a las personas, anfitriones, credenciales y procedimientos alrededor de un despliegue de Iroha. El libro mayor de blockchain registra los cambios de estado aceptados. Los operadores deben asegurar por separado sus estaciones de trabajo, claves de firma y proceso de respuesta a incidentes.

Utilice los controles a continuación como una referencia de implementación. Ajústelos al valor en riesgo y a los requisitos de su organización.

## Establecer una línea base operativa {#establish-an-operational-baseline}

- Mantenga un inventario de los hosts de validadores, identidades de pares de red, principales de autorización de cuentas, dispositivos de firma, puntos finales públicos API y personas responsables.
- Utilice credenciales separadas para desarrollo, prueba y producción. Asigne cada firmante criptográfico, token portador y clave privada a un entorno.
- Mantenga la automatización de configuración y despliegue en un control de versiones revisable. Inyecte secretos en tiempo de ejecución del software desde un almacén de secretos aprobado o un dispositivo de firma.
- Registre los hashes criptográficos o firmas esperadas de los artefactos de la versión. Verifíquelos antes del despliegue. Limite quién puede reemplazar binarios, material génesis de blockchain, configuración o definiciones de servicio.
- Aplica el principio de menor privilegio a las cuentas del sistema operativo, permisos Iroha y administración de red. Otorga a cada rol únicamente los permisos que necesita para su trabajo.
- Pruebe los procedimientos de respaldo, restauración, reemplazo de claves y recuperación entre pares antes del lanzamiento en producción.

Revise [Principios de seguridad](./security-principles.md) y [Preparación para el Lanzamiento](../best-practices/release-readiness.md) al definir la línea base.

## Proteger llaves y firmantes criptográficos {#protect-keys-and-signers}

- Mantenga las claves privadas, el material de semilla, los tokens portador, los encabezados de autorización y los secretos de recuperación fuera del control de versiones, los rastreadores de incidencias, las transcripciones de chat, las capturas de pantalla y la documentación pública.
- Utilice firmas respaldadas por hardware o aisladas para los principales de autorización de alto valor. Mantenga el material clave en bruto fuera de los navegadores y de los procesos de aplicaciones de propósito general cuando un cliente pueda delegar la firma.
- Utilice principios de autorización separados para transacciones rutinarias, gobernanza, implementación y recuperación.
- Encripta el almacenamiento secreto y sus copias de seguridad. Aplica los mismos controles de acceso a una copia de seguridad de la clave privada que a la clave activa.
- Mantenga un procedimiento probado de reemplazo o revocación. Reemplace una clave cuando la política lo requiera o cuando se sospeche exposición.
- Requerir una revisión independiente para cambios en la membresía de validadores, roles privilegiados o activos de alto valor.

Consulte [Generando Claves Criptográficas](./generating-cryptographic-keys.md) y [Almacenamiento de Claves Criptográficas](./storing-cryptographic-keys.md) para obtener orientación específica de la clave.

## Endurecer nodos y acceso de operador {#harden-nodes-and-operator-access}

- Ejecute nodos y herramientas de operador en sistemas actualmente compatibles con el proveedor y parcheados. Desactive los servicios innecesarios.
- Otorgue a los operadores nombrados acceso administrativo solo a través de canales auditados y encriptados.
- Coloca las interfaces no públicas en una red privada o [VPN](./vpn.md).
- Expone solo las rutas de Torii, monitoreo y aplicación requeridas por la implementación.
- Protege cada acceso público con límites de velocidad y seguridad en el transporte apropiados para el entorno.
- Proteja los archivos de configuración y las credenciales del servicio con permisos de archivo restrictivos. Mantenga los secretos fuera de las líneas de comando, los listados de procesos y el historial del shell.
- Separe las funciones de validador, cliente, monitoreo y respaldo cuando el modelo de riesgo requiera control independiente.
- Sincronice la hora desde fuentes confiables. Conserve suficientes registros del sistema, del servicio y de la red para la investigación.

## Navegador Seguro y Flujos de Trabajo Administrativos {#secure-browser-and-admin-workflows}

Para un operador que utiliza una interfaz web:

- Use un navegador totalmente actualizado y con soporte del proveedor en una estación de trabajo gestionada.
- Use un perfil de operador dedicado o un dispositivo con solo las extensiones necesarias.
- Verifique el origen y el certificado antes de aprobar una solicitud.
- Trata los dominios que se parecen, los redireccionamientos inesperados y las solicitudes de material clave en bruto como incidentes.
- Bloquear sitios y extensiones no relacionados de la sesión activa del operador.
- Utilice sesiones de corta duración. Requiera reautenticación para acciones privilegiadas.
- Mostrar detalles de la transacción al firmante criptográfico. El operador debe poder verificar el principal de autorización, la red, las instrucciones, los activos y las tarifas antes de la aprobación.

El aislamiento del navegador reduce la exposición. Los operadores aún deben revisar las transacciones y usar firmas seguras.

## Monitorear y Responder {#monitor-and-respond}

Monitoree estas señales:

- validador y cambios en la membresía de pares de la red
- fallos de autorización repetidos o instrucciones privilegiadas inusuales
- cambios inesperados de software, configuración o ruta
- fallos de firma, consulta y transacción fuera de la línea base normal
- agotamiento de recursos, consenso detenido o pérdida de pares de red esperados
- cambios de activos, permisos y cuentas que coincidan con las reglas de fraude

Envía alertas a un canal independiente del host afectado. Conserva los registros relevantes, las vistas de datos de configuración en un momento determinado, los eventos del libro mayor de blockchain y los hash criptográficos de las transacciones con marcas de tiempo. Consulta [Monitoreo de fraudes](./fraud-monitoring.md) y [Rendimiento y Métricas](../advanced/metrics.md).

## Plan de Recuperación {#recovery-plan}

Prepare el plan de recuperación antes del lanzamiento de producción. El plan de recuperación debe identificar:

- quién puede declarar y coordinar un incidente
- cómo contactar a los validadores, operadores de infraestructura, propietarios de aplicaciones y usuarios afectados
- qué principios de autorización pueden revocar permisos, reemplazar claves o cambiar la membresía de pares de red
- donde se almacenan binarios confiables, configuraciones, registros de génesis de la blockchain, copias de seguridad e inventarios de claves
- cómo validar la red y las aplicaciones dependientes después de la recuperación

Cuando ocurre un incidente:

1. Aísle el host, credencial, ruta o principal de autorización afectado. Preserve la evidencia.
2. Conservar los registros y las referencias del libro mayor de la blockchain. Registrar cada acción de recuperación.
3. Revocar o reemplazar credenciales y permisos expuestos a través del proceso de gobernanza aprobado.
4. Restaurar el software y la configuración a partir de artefactos verificados.
5. Confirme la pertenencia de los pares de la red, la salud del consenso, las rutas públicas, la monitorización y las lecturas de la aplicación. Reanude las escrituras solo después de que estas verificaciones se hayan completado.
6. Documenta la causa raíz. Actualiza los controles, la automatización y los ejercicios.

::: warning

Siga los procedimientos preaprobados para acciones irreversibles en el libro mayor de blockchain. Requiera las aprobaciones correspondientes al principal de autorización y los activos afectados.

:::
