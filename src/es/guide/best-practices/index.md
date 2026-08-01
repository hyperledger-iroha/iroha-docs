---
translation_locale: es
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Las mejores prácticas {#best-practices}

En esta sección se recopilan las orientaciones orientadas a la producción para aplicaciones y redes Iroha. Está organizado por la decisión que necesitas tomar, no por el rasgo que sucede para implementarlo.

Utilice como una lista de verificación antes de un ensayo compartido de la red de pruebas, un lanzamiento de producción o un gran lanzamiento del cliente.

## Categorías {#categories}

|Categoría |Concentración .|
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Desarrollo de las aplicaciones ](./application-development.md) |Configuración del cliente, presentación de transacciones, retensos, eventos, consultas y desarrollo asistido por el agente |
| [Modelado de datos ](./data-modeling.md) |Dominio, cuentas, activos, NFTs, metadatos, datos fuera de la cadena y convenciones de nombramiento |
| [Despliegue de la red ](./network-deployment.md) |Génesis, topología, claves de pares, exposición a Torii, configuraciones de consenso y separación del medio ambiente |
| [Operaciones ](./operations.md) |Observabilidad, libretas de ejecución, copias de seguridad, gestión de cambios, verificaciones de capacidad y manejo de incidentes |
| [Seguridad y acceso ](./security-and-access.md) |Tratamiento secreto, permisos, cuentas técnicas, acceso a la red y vías de auditoría |
| [Preparación para la liberación](./release-readiness.md) |Localnet, Taira, Minamoto, comprobaciones de compatibilidad, salvaguardias de la red en vivo y planificación del retroceso |

## Reglas de corte cruzado {#cross-cutting-rules}

- Mantenga el desarrollo local, la red de prueba compartida y la configuración de producción separados.
- Tratar la génesis, la topología de pares, la política del ejecutor y el material clave como artefactos de despliegue controlados.
- Modelo de estado del libro mayor duradero intencionalmente. No utilice los metadatos como un vertedero para datos grandes, privados o de gran rendimiento.
- Envíe transacciones a través de flujos de trabajo idempotentes que pueden manejar el rechazo, la expiración, los retos y el estado de retraso.
- Prefiere permisos estrechos, cuentas técnicas dedicadas y libretas de ejecución operativas explícitas sobre el acceso del administrador amplio.
- Prueba el comportamiento en una red local desechable primero, luego enséña en Taira u otra red de prueba compartida antes de cualquier operación de la red principal.

## Referencias relacionadas {#related-references}

- [Configuración y gestión ](/es/guide/configure/overview.md)
- [Seguridad ](/es/guide/security/)
- [Desempeño y métricas ](/es/guide/advanced/metrics.md)
- [Matriz de compatibilidad ](/es/reference/compatibility-matrix.md)
- [Torii Puntos finales](/es/reference/torii-endpoints.md)
- [Los tokens de autorización ](/es/reference/permissions.md)
