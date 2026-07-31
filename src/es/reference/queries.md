---
translation_locale: es
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Las consultas {#queries}

Las consultas Iroha leen el estado del libro mayor sin modificarlo. El modelo de datos actual expone dos formas generales de consulta:

- consultas singulares, que devuelven un objeto o un valor
- consultas iterables, que devuelven un flujo o colección y pueden combinarse con filtración, clasificación, proyección y paginado donde el tipo de consulta lo admite.

Utilice los constructores de tipo SDK o el CLI en lugar de construir envelopes de consulta a mano. Los nombres a continuación son los tipos actuales de consultas expuestos por `iroha_data_model::query`.

## El tiempo de ejecución y la configuración {#runtime-and-configuration}

|Pregunta .|El propósito .|
| --- | --- |
|`FindAbiVersion` |Regresar la versión de ejecución ABI. |
|`FindExecutorDataModel` |Regrese la descripción del modelo de datos del ejecutor. |
|`FindParameters` |Retorno de los parámetros de configuración del ejecutor en cadena. |

## Cuentas y permisos {#accounts-and-permissions}

|Pregunta .|El propósito .|
| --- | --- |
|`FindAccountById` |Encontrar una cuenta por cuenta canónica ID. |
|`FindAccountByAlias` |Resolver una cuenta alias a una cuenta. |
|`FindAccounts` |Lista de cuentas registradas. |
|`FindAccountIds` |Lista de la cuenta registrada IDs. |
|`FindAccountsWithAsset` |Lista de cuentas que contienen una definición dada de activo. |
|`FindAliasesByAccountId` |Lista los alias vinculados a una cuenta. |
|`FindAccountRecoveryPolicyByAlias` |Encuentra la política de recuperación para un alias.|
|`FindAccountRecoveryRequestByAlias` |Encontrar la solicitud de recuperación para un alias. |
|`FindRoles` |Lista de papeles. |
|`FindRoleIds` |El papel de la lista IDs. |
|`FindRolesByAccountId` |Lista de funciones otorgadas a una cuenta. |
|`FindPermissionsByAccountId` |Lista de los permisos otorgados a una cuenta. |

## Dominio y pares {#domains-and-peers}

|Pregunta .|El propósito .|
| --- | --- |
|`FindDomainById` |Encuentra un dominio en `DomainId`. |
|`FindDomains` |Lista de los dominios registrados. |
|`FindDomainsByAccountId` |Lista de dominios propiedad de una cuenta. |
|`FindDomainEndorsements` |Lista los registros de aprobación del dominio. |
|`FindDomainEndorsementPolicy` |Vuelve a la política de aprobación del dominio.|
|`FindDomainCommittee` |Regresar el comité de dominio.|
|`FindPeers` |Lista de compañeros confiables conocidos en el libro mayor. |

## Activos, NFTs, y RWAs {#assets-nfts-and-rwas}

|Pregunta .|El propósito .|
| --- | --- |
|`FindAssets` |Lista de los saldos de activos. |
|`FindAssetsDefinitions` |Lista de las definiciones de activos. |
|`FindAssetsByAccountId` |Enumera los activos de una cuenta. |
|`FindAssetById` |Encuentra un saldo de activos por `AssetId`. |
|`FindAssetDefinitionById` |Encuentra una definición de activo en ID. |
|`FindNfts` |Lista NFTs. |
|`FindNftsByAccountId` |Lista NFTs de propiedad de una cuenta. |
|`FindRwas` |Lista de registros de activos reales. |

## Registros de garantía y pruebas {#escrow-and-proof-records}

Las consultas de garantía inspeccionan los registros creados por el [de garantía de activos nativos ISIs](/es/blockchain/escrow.md), incluidas las garantías de mercado, los bloqueos genéricos de activos y los registros anónimos de garantía.

|Pregunta .|El propósito .|
| --- | --- |
|`FindAssetEscrows` |Lista los registros de garantía de activos. |
|`FindAssetEscrowById` |Encuentra una fianza de activos en ID. |
|`FindAssetEscrowsBySeller` |Lista de los activos en custodia por vendedor. |
|`FindAssetEscrowsByBuyer` |Lista de los activos en garantía por comprador. |
|`FindAssetEscrowsByStatus` |Enumera las garantías de activos por estado. |
|`FindAnonymousAssetEscrows` |Enumera los registros anónimos de garantía de activos.|
|`FindAnonymousAssetEscrowById` |Encuentra una fianza anónima de activos en ID. |
|`FindAnonymousAssetEscrowsBySeller` |Lista de garantías anónimas por vendedor. |
|`FindAnonymousAssetEscrowsByBuyer` |Enumera las garantías anónimas por comprador. |
|`FindAnonymousAssetEscrowsByStatus` |Enumera a los escudos anónimos por estado. |
|`FindProofRecordById` |Encuentra un registro de prueba en ID. |
|`FindProofRecords` |Lista los registros de prueba. |
|`FindProofRecordsByBackend` |Lista los registros de prueba para un backend de prueba. |
|`FindProofRecordsByStatus` |Lista los registros de prueba por estado. |

## Nexus, Disponibilidad de los datos y paquetes {#nexus-data-availability-and-packages}

|Pregunta .|El propósito .|
| --- | --- |
|`FindRepoAgreements` |Lista de los acuerdos de repositorios almacenados en cadena. |
|`FindTwitterBindingByHash` |Resolver un vínculo de Twitter por hash. |
|`FindDaPinIntentByTicket` |Encuentra una intención de pin de disponibilidad de datos por boleto. |
|`FindDaPinIntentByManifest` |Encuentra la intención de un pin por referencia manifiesta. |
|`FindDaPinIntentByAlias` |Encuentra la intención de un pin por alias.|
|`FindDaPinIntentByLaneEpochSequence` |Encuentra una intención de pin por carril, época y secuencia. |
|`FindLaneRelayEnvelopeByRef` |Encuentra un envelope verificado del relé de carril.|
|`FindSorafsProviderOwner` |Resolver el propietario de un proveedor SoraFS. |
|`FindDataspaceNameOwnerById` |Resolver un propietario de nombre del espacio de datos. |
|`FindMusubiReleaseByRef` |Encontrar una liberación Musubi por referencia. |
|`FindMusubiPackageVersions` |Lista de las versiones para un paquete Musubi. |
|`FindMusubiPackageReleases` |Las publicaciones de la lista para un paquete Musubi. |
|`FindMusubiShortAliasByName` |Resolver un alias corto de Musubi. |

## Los desencadenantes, los contratos, las transacciones y los bloques {#triggers-contracts-transactions-and-blocks}

|Pregunta .|El propósito .|
| --- | --- |
|`FindActiveTriggerIds` |Enumera el gatillo activo IDs. |
|`FindTriggers` |Lista de desencadenantes.|
|`FindTriggerById` |Encuentra un gatillo en ID. |
|`FindContractManifestByCodeHash` |Encuentra un manifiesto de contrato inteligente con código hash.|
|`FindTransactions` |Lista de las transacciones comprometidas |
|`FindBlocks` |Bloques de lista.|
|`FindBlockHeaders` |Lista los encabezados del bloque. |

## Filtración y páginas {#filtering-and-pagination}

Las consultas iterables pueden exponer el soporte de predicado y selector. Utilice filtros tipados específicos de la consulta desde el SDK para que la entrada del filtro coincida con el tipo de salida de la consulta. Para grandes conjuntos de resultados, use parámetros de la consulta como cursor y límite en lugar de buscar cada fila a la vez.
