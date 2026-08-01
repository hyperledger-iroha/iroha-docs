---
translation_locale: es
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Seguridad y acceso {#security-and-access}

La práctica de seguridad en Iroha debe basarse en una autoridad limitada, la custodia controlada de claves, la exposición explícita a la red y los cambios auditibles.

## La custodia de la clave {#key-custody}

- Generar llaves de producción con entropía de grado de producción y almacenar las llaves privadas fuera de los repositorios, emitir rastreadores, instrucciones, registros de chat, y salida CI.
- Utilice material clave separado para clientes, pares, firmas de génesis, validadores, patrocinadores de tarifas y cuentas técnicas.
- Gira las teclas de acuerdo con un proceso escrito y ensaya la recuperación antes de un incidente en vivo.
- Utilice almacenamiento respaldado por hardware o sistema operativo para claves de firma de alto valor cuando el riesgo de implementación lo justifique.

Véase [Generación de claves criptográficas](/es/guide/security/generating-cryptographic-keys.md) y [ almacenamiento de claves cryptográficas ](/es/guide/security/storing-cryptographic-keys.md).

## Las autorizaciones {#permissions}

- Concede el más pequeño token de permiso o papel que soporte el flujo de trabajo.
- Prefiere cuentas técnicas dedicadas para servicios, activadores, agentes y automatización. Evita ejecutar la automatización de larga duración a través de una cuenta personal del operador.
- Los permisos de revisión para la gestión entre pares, la mutación de metadatos, la acuñación, la quema, el registro del desencadenante, los cambios en el ejecutor y la gobernanza SORA/Nexus antes del lanzamiento de la producción.
- Revocar los permisos temporales después de la ventana de mantenimiento o de la migración que los exigió.

Véase [Permisos](/es/blockchain/permissions.md) y [Tokens de permiso ](/es/reference/permissions.md).

## Exposición a la red {#network-exposure}

- Restringir las rutas de peer-to-peer, Torii, telemetría y operador según el entorno. El acceso público a la lectura no implica el acceso público a escribir o al operador.
- Utilizar VPNs, firewalls, proxies invertidos, terminación TLS y límites de velocidad cuando sea apropiado para el despliegue.
- Mantenga las credenciales de autor básicas, tokens de proxy y encabezados reenviados fuera de config.
- Prueba de que los clientes no autorizados no puedan llegar a rutas restringidas.

Véase [Redes privadas virtuales](/es/guide/security/vpn.md) y [ Torii Puntos finales](/es/reference/torii-endpoints.md).

## Monitoreo del fraude y el abuso {#fraud-and-abuse-monitoring}

- Monitorear los eventos del libro mayor y las señales operativas para movimientos inesperados de activos, concesiones de permisos, cambios en el desencadenante, cambios de pares y transacciones repetidas rechazadas.
- Preserva evidencia con hashes de transacciones, alturas de bloques, registros de eventos, registros y instantáneos de estado.
- Alertas de ruta a los titulares de seguridad, operaciones y empresas responsables de los activos o flujos de trabajo afectados.

Véase [Monitorización de fraudes ](/es/guide/security/fraud-monitoring.md).

## Rellas de vigilancia para agentes y automatización {#agent-and-automation-guardrails}

- Inicie la automatización con permisos de sólo lectura y añade autoridad de escritura solo después de revisar el flujo de trabajo.
- Requerir una aprobación humana explícita para las mutaciones de la red en vivo, a menos que la automatización sea un servicio de producción desplegado deliberadamente.
- No exponga las claves privadas a las instrucciones de los agentes. Utilice código local que cargue secretos de variables ambientales, cadenas clave, firmas de hardware o archivos de configuración ignorados.
- Las decisiones de automatización del registro de una manera que apoye las auditorías sin filtración de material secreto.
