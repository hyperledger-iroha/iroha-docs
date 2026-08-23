---
translation_locale: es
translation_source: /cookbook/index.md
translation_source_hash: cdcfb3549506a65a7dbd1c37672893956a0252153a4075c82333804674aa07b6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 Manual de aplicaciones {#iroha-3-application-cookbook}

Construir contra Iroha 3 con recetas pequeñas y verificables que comienzan en el Taira red de prueba y mantenimiento Minamoto Cada receta indica si es una lectura pública, una escritura normal de la cuenta financiada, o una operación con acceso a permisos. I105 cuentas IDs, la selección explícita de las tarifas, y el comportamiento verificado en Iroha Compromiso [`bc7114ed1c7f265a156d2100ff09e851cc95702c`](https://github.com/hyperledger-iroha/iroha/tree/bc7114ed1c7f265a156d2100ff09e851cc95702c).

Comience con [Conecte a Taira](./connect-to-taira.md). Crea la configuración del cliente y los metadatos de tarifas reutilizados por las recetas de línea de comandos. Nunca copie un activo de tarifas ID de esta documentación: obtenga de la respuesta actual del grifo de corriente Taira.

## Nivel de acceso {#access-levels}

- Público  No se requiere autorización para firmar ni de red.
- En el caso de las cuentas de prueba Taira financiadas, se utilizará un pago explícito de la tasa y el activo de la tasa corriente devuelto por el grifo.
- Permiso requerido  Taira debe conceder el permiso de tiempo de ejecución nombrado o espacio de nombres gobernado. Utilice una red local generada cuando esa subvención no esté disponible; el éxito local no confiere autoridad a Taira.

Ninguna receta de un libro de cocina envía una carta a Minamoto.

## Inicio y envío {#start-and-submit}

|La receta |Taira acceso |Con lo que terminas .|
| --------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| [Conectarse a Taira](./connect-to-taira.md) |Listo para escribir .|Una firma I105 financiada, un activo de honorarios vivos y una transacción canaria aplicada |
| [Presentar y verificar las transacciones ](./submit-and-verify-transactions.md) |Listo para escribir .|Una transacción cotizada, el resultado de la tubería terminal y un recibo almacenado |

## Estado del libro mayor {#ledger-state}

|La receta |Taira acceso |Con lo que terminas .|
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| [Cuentas y alias ](./accounts-and-aliases.md) |Se requiere un permiso .|Una cuenta de I105 más un alias resuelvible legible por el hombre |
| [Activos funcionales ](./fungible-assets.md) |Se requiere un permiso .|Una definición registrada, un saldo acuñado y una transferencia verificada|
| [NFTs](./nfts.md) |Se requiere un permiso .|Una solicitud registrada NFT, la propiedad transferida y una consulta posterior al estado |
| [Metadatos](./metadata.md) |Listo de escritura para objetos de propiedad; permiso requerido en caso contrario |Un metadatos escrito seguido de una lectura exacta |
| [Estado del libro mayor de consulta](./query-ledger-state.md) |Público para estado público |Resultados en páginas y filtrados sin escribir |

## Acceso y automatización {#access-and-automation}

|La receta |Taira acceso |Con lo que terminas .|
| --------------------------------------------------- | ------------------- | -------------------------------------------------------------- |
| [Permisos y funciones ](./permissions-and-roles.md) |Se requiere un permiso .|Un permiso de alcance recogido en un papel reutilizable |
| [Eventos de transmisión](./stream-events.md) |Público |Un consumidor SSE que vuelve a conectarse y se reconcilia después de una desconexión|
| [Triggers ](./triggers.md) |Se requiere un permiso .|Un gatillo de llamada indirecta, recibo de ejecución y evento de finalización |
| [Multisig](./multisig.md) |Listo para escribir .|Una cuenta ponderada de varios signos y una propuesta aprobada por quórum |

## Modelos de aplicación {#application-patterns}

|La receta |Taira acceso |Con lo que terminas .|
| --------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Los contratos inteligentes](./smart-contracts.md) |Se requiere un permiso .|Verificado Kotodama código de byte, artefactos de despliegue y una llamada de contrato |
| [Cartera de conexión](./wallet-connect.md) |Listo para escribir cuando Connect esté habilitado |Una transferencia de activos aprobada por la cartera y un hash de transacción reconciliado |
| [Escrow nativo ](./native-escrow.md) |Preparada para los propietarios de activos; la resolución de disputas requiere el permiso |Una cerradura nativa o una fianza en el mercado con estado final deseado |

## Superficies de ejemplos verificadas {#verified-example-surfaces}

Las marcas a continuación describen ejemplos ejecutables en cada receta, no todas las SDK que pueden acceder a la función.

|La receta |HTTP / curl |CLI |Rust |JavaScript |Python |Kotodama |
| --------------------- | :---------: | :-: | :--: | :--------: | :----: | :------: |
|Conectar con Taira |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Presentar y verificar |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Cuentas y alias |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Activos funcionales |      ✓      |  ✓  |  —   |     ✓      |   —    |    —     |
|NFTs |      ✓      |  ✓  |  —   |     —      |   —    |    ✓     |
|Metadatos |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|El estado del libro mayor de consultas |      ✓      |  ✓  |  ✓   |     ✓      |   —    |    —     |
|Permisos y funciones |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Transmitir eventos |      ✓      |  —  |  —   |     ✓      |   —    |    —     |
|Estimadores .|      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Multisig |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Los contratos inteligentes |      —      |  ✓  |  —   |     —      |   —    |    ✓     |
|Cartera de conexión |      ✓      |  —  |  ✓   |     ✓      |   —    |    —     |
|Escrow nativo |      —      |  —  |  ✓   |     ✓      |   ✓    |    ✓     |

Cada receta se vincula a la arquitectura de producción, las operaciones, SDK y API orientación. La receta en sí muestra un camino de éxito. Incluye también los controles necesarios para demostrar el resultado.
