---
translation_locale: es
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Desarrollo de las aplicaciones {#application-development}

Las aplicaciones Iroha deben hacer explícito el comportamiento de las transacciones, mantener contenido el estado de la firma y utilizar consultas y eventos de una manera que sea fácil de observar en producción.

## Configuración del cliente {#client-setup}

- Almacenar la configuración del cliente fuera del código fuente de la aplicación. Cargar la cadena ID, Torii URL, la cuenta de firma y las configuraciones de transacciones desde la configuración específica del entorno.
- Mantenga los archivos `client.toml` separados para las redes localnet, Taira, Minamoto y privadas.
- Establecer las vidas de transacción y los tiempos de estado deliberadamente. Una vida muy corta puede expirar bajo nerviosismo normal de la red, mientras que una muy larga puede hacer que las presentaciones duplicadas sean más difíciles de razonar sobre.
- Utilizar `nonce = true` sólo cuando las transacciones repetidas deben tener hashes distintos. Para operaciones empresariales idempotentes, almacenar y reutilizar una solicitud de aplicación ID para que se puedan rastrear los retos.

Vea [Configuración del cliente](/es/guide/configure/client-configuration.md) para los campos actuales TOML.

## Las transacciones {#transactions}

- Construir las transacciones a partir de instrucciones tipografadas SDK, siempre que sea posible, en lugar de JSON crudo o cargas útiles montadas con cuerdas.
- Preflight importante escribe con consultas de sólo lectura: existencia de la cuenta, saldos de activos, estado de permiso, disponibilidad de activos de tarifa y estado del objeto objetivo.
- Registrar el hash de la transacción, cuenta de autoridad, resumen de instrucciones y cambio de estado esperado antes de enviar.
- Tratar `Rejected`, `Expired`, y los resultados del plazo son diferentes. Un plazo significa que el cliente no observó un estado final; no demuestra que la red haya ignorado la transacción.
- Después de una escritura exitosa, verifique el estado resultante con un punto de control de consulta o evento que coincida con la operación del negocio.

Para la mecánica de las transacciones, véase [Las transacciones ](/es/blockchain/transactions.md).

## Las preguntas y los acontecimientos {#queries-and-events}

- Utilice consultas para los flujos de estado y eventos actuales para las notificaciones de cambios. Evite reemplazar el manejo de eventos con consultas amplias repetidas.
- Paginar consultas generales iterables como las listas de cuentas, activos y bloques.
- Los filtros amplios son útiles para el diagnóstico, pero pueden agregar una ejecución innecesaria y un procesamiento del lado cliente.
- Mantenga los controles de humo solo para lectura separados de las pruebas de transacciones firmadas para que la disponibilidad del punto final sea más fácil de diagnosticar.

Véase [Preguntas](/es/blockchain/queries.md), [Eventos](/es/blockchain/events.md) y [Filtros ](/es/blockchain/filters.md).

## Desarrollo asistido por agentes {#agent-assisted-development}

- Deje que los agentes inspeccionen documentos, código SDK, y estado de red sólo para lectura antes de pedirles que escriban código de transacción.
- Mantenga las pruebas de red en vivo opt-in detrás de una bandera del entorno como `TAIRA_LIVE=1`.
- No pongan claves privadas, material de recuperación de cuentas, tokens API o encabezados de autores reenviados en las instrucciones.
- Requerir un plan de transacción antes de que cualquier agente envíe una transacción en vivo de testnet. El plan debe nombrar la red, la autoridad, las instrucciones, el activo de tarifas, las lecturas previas al vuelo, el resultado esperado y el comportamiento de nuevo intento.

Para el flujo de trabajo Taira MCP véase [Construir en SORA 3: Taira y Minamoto](/es/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK Higiene {#sdk-hygiene}

- Pin SDK y versiones binarias juntas utilizando la matriz de compatibilidad [ ](/es/reference/compatibility-matrix.md).
- Mantenga el código del cliente generado, fragmentos y ejemplos sincronizados con la revisión de espacio de trabajo en alta corriente fijada.
- Agregue pruebas de unidad para el código de construcción de transacciones y pruebas de integración para las rutas de lectura y escritura más pequeñas de las que dependa su aplicación.
