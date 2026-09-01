---
translation_locale: es
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Seguridad y Acceso {#security-and-access}

La práctica de seguridad en Iroha debe basarse en el principio de autorización restringida, custodia controlada de llaves, exposición explícita de la red y cambios auditables.

## Custodia de llaves {#key-custody}

- Genera claves de producción con entropía de nivel de producción y almacena las claves privadas fuera de repositorios, rastreadores de incidencias, indicaciones, registros de chat y la salida de CI.
- Utilice material de clave separado para clientes, pares de red, firma del génesis de la blockchain, validadores, patrocinadores de tarifas y cuentas técnicas.
- Gire las llaves de acuerdo con un proceso escrito y ensaye la recuperación antes de un incidente en vivo.
- Utilice almacenamiento respaldado por hardware o por el sistema operativo para claves de firma de alto valor cuando el riesgo de implementación lo justifique.

Vea [Generando Claves Criptográficas](/es/guide/security/generating-cryptographic-keys.md) y [Almacenamiento de Claves Criptográficas](/es/guide/security/storing-cryptographic-keys.md).

## Permisos {#permissions}

- Concede el token de permiso o rol más pequeño que soporte el flujo de trabajo.
- Prefiera cuentas técnicas dedicadas para servicios, disparadores, agentes y automatización. Evite ejecutar automatizaciones de larga duración a través de una cuenta de operador personal.
- Revise los permisos para la gestión de pares de red, la mutación de metadatos, la emisión, la quema, el registro de desencadenantes, los cambios de ejecutor y la gobernanza de SORA/Nexus antes del lanzamiento en producción.
- Revocar los permisos temporales después de la ventana de mantenimiento o la migración que los requirió.

Vea [Permisos](/es/blockchain/permissions.md) y [Tokens de permiso](/es/reference/permissions.md).

## Exposición de red {#network-exposure}

- Restringa las rutas peer-to-peer, Torii, de telemetría y de operador según el entorno. El acceso público de lectura no implica acceso público de escritura o de operador.
- Utilice VPNs, cortafuegos, proxies inversos, terminación de TLS y límites de velocidad donde sea apropiado para la implementación.
- Mantenga las credenciales de autenticación básica, los tokens de proxy y los encabezados reenviados fuera de la configuración comprometida.
- Prueba que los clientes no autorizados no puedan acceder a rutas restringidas.

Vea [Redes Privadas Virtuales](/es/guide/security/vpn.md) y [Torii API puntos finales](/es/reference/torii-endpoints.md).

## Monitoreo de Fraude y Abuso {#fraud-and-abuse-monitoring}

- Monitorear los eventos del libro mayor de blockchain y las señales operacionales para movimientos inesperados de activos, concesión de permisos, cambios de activadores, cambios en los pares de la red y transacciones rechazadas repetidamente.
- Preserve la evidencia con hashes criptográficos de transacciones, alturas de bloque, registros de eventos, registros y capturas de estado.
- Dirija las alertas a la seguridad, operaciones y a los propietarios comerciales responsables de los activos o flujos de trabajo afectados.

Ver [Monitoreo de fraudes](/es/guide/security/fraud-monitoring.md).

## Directrices de Agente y Automatización {#agent-and-automation-guardrails}

- Inicia la automatización con permisos de solo lectura y agrega el principal de autorización de escritura solo después de que se revise el flujo de trabajo.
- Requerir la aprobación explícita de un humano para las mutaciones en la red en vivo, a menos que la automatización sea un servicio de producción desplegado deliberadamente.
- No exponga claves privadas a los avisos de agentes. Use código local que cargue secretos desde variables de entorno, llaveros, firmadores criptográficos de hardware o archivos de configuración ignorados.
- Registra las decisiones de automatización de manera que respalden las auditorías sin filtrar material secreto.
