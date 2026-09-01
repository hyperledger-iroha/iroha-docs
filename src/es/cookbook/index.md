---
translation_locale: es
translation_source: /cookbook/index.md
translation_source_hash: 58f5247ece30d3755c38d4d24ae4553a35e0d0437476092d568a1be5c8a2ed28
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3 Manual de Aplicaciones {#iroha-3-application-cookbook}

Construir contra Iroha 3 con recetas pequeñas y verificables que comienzan en el Taira red de prueba y mantener Minamoto solo lectura en la red principal. Cada receta indica si es una lectura pública, una escritura de cuenta financiada normal, o una operación con acceso restringido por permisos. Los comandos usan el actual I105 IDs de cuenta, selección explícita de tarifas y el comportamiento registrado en Iroha comprometer [`0010c5a70039eac101a4846499ba9ceaf43eb65c`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c).

Comienza con [Conectar a Taira](./connect-to-taira.md). Esto crea la configuración del cliente y los metadatos de tarifas que se reutilizan en las recetas de línea de comandos. Nunca copies un ID de activo de tarifa de esta documentación: derivarlo de la respuesta del servicio de financiación de testnet actual Taira.

## Niveles de acceso {#access-levels}

- Público: no se requiere un firmante criptográfico ni permiso de red.
- Listo para escribir: utiliza una cuenta de prueba financiada Taira, un pagador de tarifas explícito y el activo de tarifas actual devuelto por el servicio de financiamiento de testnet.
- Se requiere permiso — Taira debe otorgar al software nombrado permiso de ejecución o al espacio de nombres gobernado. Utilice una red local generada cuando ese permiso no esté disponible; el éxito local no confiere el principal de autorización Taira.

Ninguna receta de libro de cocina envía una escritura a Minamoto.

## Iniciar y enviar {#start-and-submit}

|Receta|Taira acceso|Con qué terminas|
| --------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| [Conectar a Taira](./connect-to-taira.md)                             |Listo para escribir|Un firmante criptográfico financiado I105, activo de tarifa en vivo y transacción canaria aplicada|
| [Enviar y verificar transacciones](./submit-and-verify-transactions.md) |Listo para escribir|Una transacción con cotización, el resultado terminal de la canalización y un recibo almacenado|

## estado del libro mayor blockchain {#ledger-state}

|Receta| Taira acceso|Con qué terminas|
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| [Cuentas y alias](./accounts-and-aliases.md) |Permiso requerido|Una cuenta I105 más un alias legible por humanos resolvible|
| [Activos fungibles](./fungible-assets.md)           |Permiso requerido|Una definición registrada, saldo emitido y transferencia verificada|
| [NFTs](./nfts.md)                                 |Permiso requerido|Un NFT registrado, transferencia de propiedad y consulta posterior al estado|
| [Metadatos](./metadata.md)                         |Listo para escribir para objetos propios; se requiere permiso de lo contrario|Una escritura de metadatos seguida de una lectura exacta|
| [Consultar el estado del libro mayor de blockchain](./query-ledger-state.md)     |Público para estado público|Resultados paginados y filtrados sin escritura|

## Acceso y automatización {#access-and-automation}

|Receta| Taira acceso        |Con qué terminas|
| --------------------------------------------------- | ------------------- | -------------------------------------------------------------- |
| [Permisos y roles](./permissions-and-roles.md) |Permiso requerido|Un permiso con alcance recogido en un rol reutilizable|
| [Transmitir eventos](./stream-events.md)                 |pública|Un consumidor SSE que se reconecta y se reconcilia después de una desconexión|
| [Desencadenantes](./triggers.md)                           |Permiso requerido|Un desencadenador por llamada, registro de resultado del protocolo de ejecución y evento de finalización|
| [Multisig](./multisig.md)                           |Listo para escribir|Una cuenta multisig ponderada y una propuesta aprobada por quórum|

## Patrones de aplicación {#application-patterns}

|Receta| Taira acceso|Con qué terminas|
| --------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Contratos inteligentes](./smart-contracts.md) |Permiso requerido|Verificado el bytecode Kotodama, los artefactos de despliegue y una llamada al contrato|
| [Wallet Connect](./wallet-connect.md)   | Listo para escribir cuando Connect esté habilitado|Una transferencia de activos aprobada por la billetera y un hash criptográfico de transacción conciliada|
| [Depósito en garantía nativo](./native-escrow.md)     |Listo para escribir para los propietarios de activos; la resolución de disputas requiere permiso|Un bloqueo nativo o depósito en garantía del mercado con estado final consultado|

## Superficies de ejemplo verificadas {#verified-example-surfaces}

Las marcas a continuación describen ejemplos ejecutables en cada receta, no cada SDK que pueda acceder a la función.

|Receta| HTTP / curl | CLI | Rust | JavaScript | Python | Kotodama |
| --------------------- | :---------: | :-: | :--: | :--------: | :----: | :------: |
|Conectar a Taira|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Enviar y verificar|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Cuentas y alias|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Activos fungibles|      ✓      |  ✓  |  —   |     ✓      |   —    |    —     |
| NFTs                  |      ✓      |  ✓  |  —   |     —      |   —    |    ✓     |
|Metadatos|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Consultar el estado del libro mayor de la blockchain|      ✓      |  ✓  |  ✓   |     ✓      |   —    |    —     |
|Permisos y roles|      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Eventos de transmisión|      ✓      |  —  |  —   |     ✓      |   —    |    —     |
|Desencadenantes|      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Multisig|      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Contratos inteligentes|      —      |  ✓  |  —   |     —      |   —    |    ✓     |
|Conectar Billetera|      ✓      |  —  |  ✓   |     ✓      |   —    |    —     |
|Fideicomiso nativo|      —      |  —  |  ✓   |     ✓      |   ✓    |    ✓     |

Cada receta se vincula con la arquitectura de producción, operaciones, SDK y la guía de API. La receta en sí muestra un camino exitoso. También incluye las verificaciones necesarias para demostrar el resultado.
