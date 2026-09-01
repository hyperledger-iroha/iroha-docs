---
translation_locale: es
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Mejores prácticas {#best-practices}

Esta sección recopila orientación orientada a la producción para aplicaciones y redes Iroha. Está organizada según la decisión que necesita tomar, no por la característica que resulta implementar.

Úsalo como una lista de verificación antes de un ensayo en una testnet compartida, un lanzamiento en producción o una gran liberación para un cliente.

## Categorías {#categories}

|Categoría|Enfoque|
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Desarrollo de Aplicaciones](./application-development.md) |Configuración del cliente, envío de transacciones, reintentos, eventos, consultas y desarrollo asistido por agentes|
| [Modelado de datos](./data-modeling.md)                     |Dominios, cuentas, activos, NFTs, metadatos, datos fuera de la cadena y convenciones de nombres|
| [Despliegue de red](./network-deployment.md)           | génesis de blockchain, topología, claves de pares de la red, exposición Torii, configuraciones de consenso y separación de entornos |
| [Operaciones](./operations.md)                           |Observabilidad, manuales de operación, copias de seguridad, gestión de cambios, comprobaciones de capacidad y manejo de incidentes|
| [Seguridad y Acceso](./security-and-access.md)         |Manejo de secretos, permisos, cuentas técnicas, acceso a la red y registros de auditoría|
| [Preparación para el Lanzamiento](./release-readiness.md)             |Localnet, Taira, Minamoto, comprobaciones de compatibilidad, salvaguardas de red en vivo y planificación de reversión|

## Reglas transversales {#cross-cutting-rules}

- Mantenga separadas la configuración de desarrollo local, la testnet compartida y la producción.
- Trata la génesis de la blockchain, la topología de pares de la red, la política del ejecutor y el material clave como artefactos de despliegue controlados.
- Modela intencionalmente el estado del libro mayor de la blockchain de manera duradera. No uses los metadatos como un vertedero para datos grandes, privados o de alta rotación.
- Envíe transacciones a través de flujos de trabajo idempotentes que puedan manejar rechazos, expiración, reintentos y estado diferido.
- Prefiera permisos restringidos, cuentas técnicas dedicadas y libros de operaciones explícitos en lugar de acceso amplio de administrador.
- Prueba el comportamiento en una red local desechable primero, luego ensaya en Taira u otra testnet compartida antes de cualquier operación en la mainnet.

## Referencias relacionadas {#related-references}

- [Configuración y Gestión](/es/guide/configure/overview.md)
- [Seguridad](/es/guide/security/)
- [Rendimiento y Métricas](/es/guide/advanced/metrics.md)
- [Matriz de compatibilidad](/es/reference/compatibility-matrix.md)
- [Torii API puntos finales](/es/reference/torii-endpoints.md)
- [Tokens de Permiso](/es/reference/permissions.md)
