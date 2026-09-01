---
translation_locale: es
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Desarrollo de Aplicaciones {#application-development}

Las aplicaciones Iroha deben hacer que el comportamiento de las transacciones sea explícito, mantener el estado de firma contenido y usar consultas y eventos de maneras que sean fáciles de observar en producción.

## Configuración del cliente {#client-setup}

- Almacene la configuración del cliente fuera del código fuente de la aplicación. Cargue el ID de la cadena, Torii URL, la cuenta de firma y la configuración de transacciones desde la configuración específica del entorno.
- Mantenga los archivos `client.toml` separados para localnet, Taira, Minamoto y redes privadas. Un firmante criptográfico de testnet copiado nunca debe convertirse en un firmante criptográfico de mainnet.
- Establezca deliberadamente los tiempos de vida de las transacciones y los tiempos de espera de estado. Un tiempo de vida muy corto puede expirar bajo la interferencia normal de la red, mientras que un tiempo de vida muy largo puede hacer que sea más difícil razonar sobre envíos duplicados.
- Use `nonce = true` solo cuando las transacciones repetidas deban tener hashes criptográficos distintos. Para operaciones comerciales idempotentes, almacene y reutilice un ID de solicitud de aplicación para que los reintentos sean rastreables.

Vea [Configuración del cliente](/es/guide/configure/client-configuration.md) para los campos actuales de TOML.

## Transacciones {#transactions}

- Construya transacciones a partir de instrucciones tipeadas SDK cuando sea posible en lugar de cargas útiles JSON sin procesar o ensambladas como cadenas.
- Verificación previa importante escribe con consultas de solo lectura: existencia de cuenta, saldos de activos, estado de permisos, disponibilidad de activo para tarifas y estado del objeto objetivo.
- Registre el hash criptográfico de la transacción, la cuenta principal de autorización, el resumen de instrucción y el cambio de estado esperado antes de enviarlo.
- Trate los resultados `Rejected`, `Expired` y de tiempo de espera de manera diferente. Un tiempo de espera significa que el cliente no observó un estado final; no prueba que la red haya ignorado la transacción.
- Después de una escritura exitosa, verifique el estado resultante con una consulta o un punto de control de eventos que coincida con la operación comercial.

Para la mecánica de la transacción, consulte [Transacciones](/es/blockchain/transactions.md).

## Consultas y Eventos {#queries-and-events}

- Utilice consultas para el estado actual y flujos de eventos para las notificaciones de cambios. Evite reemplazar el manejo de eventos con consultas amplias repetidas.
- Paginación de consultas iterables amplias como listados de cuentas, activos y bloques.
- Prefiera filtros estrechos para suscripciones y disparadores. Los filtros amplios son útiles para diagnósticos, pero pueden añadir ejecución innecesaria y procesamiento del lado del cliente.
- Mantenga las verificaciones de humo solo de lectura separadas de las pruebas de transacciones firmadas para que la disponibilidad del endpoint API sea más fácil de diagnosticar.

Vea [Consultas](/es/blockchain/queries.md), [Eventos](/es/blockchain/events.md) y [Filtros](/es/blockchain/filters.md).

## Desarrollo Asistido por Agente {#agent-assisted-development}

- Permita que los agentes inspeccionen documentos, el código SDK y el estado de la red de solo lectura antes de pedirles que escriban código de transacción.
- Mantenga las pruebas en red en vivo como opcionales detrás de una bandera de entorno como `TAIRA_LIVE=1`.
- No pegues claves privadas, material de recuperación de cuentas, tokens API o encabezados de autenticación reenviados en los mensajes.
- Requerir un plan de transacción antes de que cualquier agente envíe una transacción en la red de prueba en vivo. El plan debe nombrar la red, el principal de autorización, las instrucciones, el activo de la tarifa, las lecturas previas, el resultado esperado y el comportamiento de reintento.

Para el flujo de trabajo Taira MCP, vea [Construir sobre SORA 3: Taira y Minamoto](/es/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK Higiene {#sdk-hygiene}

- Fije SDK y las versiones binarias juntas usando el [Matriz de compatibilidad](/es/reference/compatibility-matrix.md).
- Mantenga el código del cliente generado, los fragmentos y los ejemplos sincronizados con la revisión del espacio de trabajo ascendente fijada.
- Agrega pruebas unitarias para el código de construcción de transacciones y pruebas de integración para las rutas de lectura y escritura más pequeñas de las que depende tu aplicación.
