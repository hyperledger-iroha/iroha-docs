---
translation_locale: es
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Consultas {#queries}

Iroha las consultas leen el estado del libro mayor de la blockchain sin modificarlo. El modelo de datos actual expone dos formas generales de consulta:

- consultas singulares, que devuelven un objeto o un valor
- consultas iterables, que devuelven un flujo o una colección y se pueden combinar con filtrado, ordenación, proyección y paginación cuando el tipo de consulta lo admite

Utilice los constructores tipeados SDK o el CLI en lugar de construir contenedores de datos de consulta a mano. Los nombres a continuación son los tipos de consulta actuales expuestos por `iroha_data_model::query`.

## tiempo de ejecución del software y configuración {#runtime-and-configuration}

|Consulta|Propósito|
| --- | --- |
| `FindAbiVersion` |Devuelve la versión del ejecutor ABI.|
| `FindExecutorDataModel` |Devuelve la descripción del modelo de datos del ejecutor.|
| `FindParameters` |Devolver los parámetros de configuración del ejecutor en la cadena.|

## Cuentas y permisos {#accounts-and-permissions}

|Consulta|Propósito|
| --- | --- |
| `FindAccountById` |Encontrar una cuenta por ID de cuenta canónico.|
| `FindAccountByAlias` |Resolver un alias de cuenta a una cuenta.|
| `FindAccounts` |Listar cuentas registradas.|
| `FindAccountIds` |Lista de ID de cuentas registradas.|
| `FindAccountsWithAsset` |Listado de cuentas que poseen una definición de activo dada.|
| `FindAliasesByAccountId` |Listar alias vinculados a una cuenta.|
| `FindAccountRecoveryPolicyByAlias` |Encuentra la política de recuperación de un alias.|
| `FindAccountRecoveryRequestByAlias` |Encuentra la solicitud de recuperación de un alias.|
| `FindRoles` |Enumera los roles.|
| `FindRoleIds` |Listar ID de roles.|
| `FindRolesByAccountId` |Listado de roles otorgados a una cuenta.|
| `FindPermissionsByAccountId` |Enumerar los permisos otorgados a una cuenta.|

## Dominios y pares de red {#domains-and-peers}

|Consulta|Propósito|
| --- | --- |
| `FindDomainById` |Encuentra un dominio por `DomainId`.|
| `FindDomains` |Listar dominios registrados.|
| `FindDomainsByAccountId` |Enumera los dominios propiedad de una cuenta.|
| `FindDomainEndorsements` |Listar registros de respaldo de dominio.|
| `FindDomainEndorsementPolicy` |Devuelva la política de respaldo del dominio.|
| `FindDomainCommittee` |Devolver el comité de dominio.|
| `FindPeers` |Enumere los pares de red confiables conocidos por el libro mayor de la blockchain.|

## Activos, NFTs, y RWAs {#assets-nfts-and-rwas}

|Consulta|Propósito|
| --- | --- |
| `FindAssets` |Listar saldos de activos.|
| `FindAssetsDefinitions` |Listar definiciones de activos.|
| `FindAssetsByAccountId` |Enumere los activos que posee una cuenta.|
| `FindAssetById` |Encuentre un saldo de activo por `AssetId`.|
| `FindAssetDefinitionById` |Busca una definición de activo por ID.|
| `FindNfts` | Lista NFTs. |
| `FindNftsByAccountId` | Lista NFTs propiedad de una cuenta. |
| `FindRwas` |Listar lotes de activos del mundo real registrados.|

## Depósito en garantía y registros de prueba {#escrow-and-proof-records}

Las consultas de depósito en garantía inspeccionan los registros creados por [depósito en garantía de activo nativo ISIs](/es/blockchain/escrow.md), incluyendo depósitos en garantía del mercado, bloqueos de activos genéricos y registros de depósito en garantía anónimos.

|Consulta|Propósito|
| --- | --- |
| `FindAssetEscrows` |Listar registros de fideicomiso de activos.|
| `FindAssetEscrowById` |Encuentra un depósito en garantía de un activo por ID.|
| `FindAssetEscrowsBySeller` |Listado de depósitos en garantía de activos por vendedor.|
| `FindAssetEscrowsByBuyer` |Listado de depósitos en garantía de activos por comprador.|
| `FindAssetEscrowsByStatus` |Listado de depósitos en garantía de activos por estado.|
| `FindAnonymousAssetEscrows` |Listar registros de fideicomiso de activos anónimos.|
| `FindAnonymousAssetEscrowById` |Encuentra un depósito de activos anónimo por ID.|
|`FindAnonymousAssetEscrowsBySeller`|Listar depósitos en garantía anónimos por vendedor.|
| `FindAnonymousAssetEscrowsByBuyer` |Listado de depósitos en garantía anónimos por comprador.|
| `FindAnonymousAssetEscrowsByStatus` |Listado de depósitos en garantía anónimos por estado.|
| `FindProofRecordById` |Busca un registro de prueba por ID.|
| `FindProofRecords` |Listar registros de prueba.|
| `FindProofRecordsByBackend` |Listar registros de prueba para un backend de prueba.|
| `FindProofRecordsByStatus` |Listar registros de prueba por estado.|

## Nexus, Disponibilidad de Datos y Paquetes {#nexus-data-availability-and-packages}

|Consulta|Propósito|
| --- | --- |
| `FindRepoAgreements` |Enumerar los acuerdos de repositorio almacenados en la cadena.|
| `FindTwitterBindingByHash` |Resolver una vinculación de Twitter mediante hash criptográfico.|
| `FindDaPinIntentByTicket` |Encuentra una intención de pin de disponibilidad de datos por ticket.|
| `FindDaPinIntentByManifest` |Encuentra una intención de pin por referencia del manifiesto técnico.|
| `FindDaPinIntentByAlias` |Buscar un pin por alias.|
| `FindDaPinIntentByLaneEpochSequence` |Encuentra una intención de pin por carril de ejecución, época y secuencia.|
| `FindLaneRelayEnvelopeByRef` |Encuentra un contenedor de datos de relevo de carril verificado.|
| `FindSorafsProviderOwner` |Resuelve el propietario de un proveedor SoraFS.|
| `FindDataspaceNameOwnerById` |Resolver un propietario de nombre de espacio de datos.|
| `FindMusubiExactPackageV1` |Lea un registro de paquete exacto y sus revisiones actuales.|
| `FindMusubiExactReleaseV1` |Leer una instantánea de lanzamiento exacta.|
| `FindMusubiProviderBundleAttestationV1` |Lea la certificación del paquete de archivo de un proveedor.|
| `FindMusubiResolverIndexV1` |Pagine el índice del resolvedor finalizado.|
| `FindMusubiVersionsV1` |Versiones finalizadas de página para un paquete.|
| `FindMusubiMaintainersV1` |Página de mantenedores aceptados e invitaciones pendientes.|
| `FindMusubiArchiveLocationsV1` |Página finalizada SoraFS ubicaciones para un archivo.|
| `FindMusubiArchiveRetentionV1` |Archivar registros de retención de páginas.|
| `FindMusubiAliasV1` |Lea el objetivo actual y la revisión de un alias global.|
| `FindMusubiAliasHistoryV1` |Pagine el historial de retargeting inmutable de un alias global.|
| `FindMusubiOrderedPrefixV1` |Paquetes de páginas bajo un prefijo estructural ordenado.|

## Disparadores, Contratos, Transacciones y Bloques {#triggers-contracts-transactions-and-blocks}

|Consulta|Propósito|
| --- | --- |
| `FindActiveTriggerIds` |Lista de ID de disparadores activos.|
| `FindTriggers` |Enumera los desencadenantes.|
| `FindTriggerById` |Encuentra un disparador por ID.|
| `FindContractManifestByCodeHash` |Encuentra un manifiesto técnico de contrato inteligente mediante el hash criptográfico del código.|
| `FindTransactions` |Listar transacciones confirmadas.|
| `FindBlocks` |Enumera los bloques.|
| `FindBlockHeaders` |Listar los encabezados de bloque.|

## Filtrado y paginación {#filtering-and-pagination}

Las consultas iterables pueden exponer soporte de predicado y selector. Use filtros tipados específicos de la consulta del SDK para que la entrada del filtro coincida con el tipo de salida de la consulta. Para conjuntos de resultados grandes, use parámetros de consulta como cursor y límite en lugar de obtener todas las filas de una vez.
