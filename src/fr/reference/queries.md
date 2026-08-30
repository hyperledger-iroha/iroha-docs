---
translation_locale: fr
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Questions posées {#queries}

Les requêtes Iroha lisent l'état du registre sans le modifier. Le modèle de données actuel expose deux formes générales de requête:

- les requêtes singulières, qui renvoient un objet ou une valeur
- requêtes itératives, qui renvoient un flux ou une collection et peuvent être combinées avec le filtrage, le tri, la projection et la pagination où le type de requête le prend en charge

Utilisation SDK des constructeurs de type ou les CLI Les noms ci-dessous sont les types de requêtes actuels exposés par `iroha_data_model::query`.

## Temps d'exécution et configuration {#runtime-and-configuration}

|Une question .|Objectif |
| --- | --- |
|`FindAbiVersion` |Retourner la version de l'exécuteur ABI. |
|`FindExecutorDataModel` |Retourner la description du modèle de données d'exécuteur. |
|`FindParameters` |Retourner les paramètres de configuration de l'exécuteur en chaîne. |

## Comptes et autorisations {#accounts-and-permissions}

|Une question .|Objectif |
| --- | --- |
|`FindAccountById` |Trouver un compte par compte canonique ID. |
|`FindAccountByAlias` |Résolvez un compte sous le pseudonyme de compte. |
|`FindAccounts` |Liste des comptes enregistrés. |
|`FindAccountIds` |Liste du compte enregistré IDs. |
|`FindAccountsWithAsset` |Liste des comptes qui contiennent une définition d'actif donnée. |
|`FindAliasesByAccountId` |Liste des pseudonymes liés à un compte. |
|`FindAccountRecoveryPolicyByAlias` |Trouvez la police de récupération pour un alias. |
|`FindAccountRecoveryRequestByAlias` |Trouvez la demande de récupération pour un alias. |
|`FindRoles` |Liste des rôles. |
|`FindRoleIds` |Le rôle de la liste IDs. |
|`FindRolesByAccountId` |Liste des rôles attribués à un compte. |
|`FindPermissionsByAccountId` |Liste des autorisations accordées à un compte. |

## Domaines et pairs {#domains-and-peers}

|Une question .|Objectif |
| --- | --- |
|`FindDomainById` |Trouver un domaine par `DomainId`. |
|`FindDomains` |Liste des domaines enregistrés. |
|`FindDomainsByAccountId` |Liste des domaines appartenant à un compte. |
|`FindDomainEndorsements` |Liste des enregistrements d'approbation du domaine. |
|`FindDomainEndorsementPolicy` |Retournez la politique d'approbation du domaine. |
|`FindDomainCommittee` |Retournez le comité de domaine.|
|`FindPeers` |Liste des pairs de confiance connus dans le registre. |

## Les actifs, NFTs et RWAs {#assets-nfts-and-rwas}

|Une question .|Objectif |
| --- | --- |
|`FindAssets` |Liste des soldes d'actifs |
|`FindAssetsDefinitions` |Liste des définitions d'actifs. |
|`FindAssetsByAccountId` |Liste des actifs détenus par un compte. |
|`FindAssetById` |Trouver un solde d'actif par `AssetId`. |
|`FindAssetDefinitionById` |Trouver une définition de l'actif par ID. |
|`FindNfts` |Liste NFTs. |
|`FindNftsByAccountId` |Liste NFTs détenue par un compte. |
|`FindRwas` |Liste des actifs enregistrés dans le monde réel. |

## Enregistreurs de dépôt et de preuve {#escrow-and-proof-records}

Les requêtes d'escroquerie examinent les registres créés par [native asset escrow ISIs](/fr/blockchain/escrow.md), y compris les enregistrements de marché en escroquerie, les verrouillages génériques des actifs et les enregistrements anonymes en escrow.

|Une question .|Objectif |
| --- | --- |
|`FindAssetEscrows` |Liste des dossiers de dépôt d'actifs.|
|`FindAssetEscrowById` |Trouvez un escrow d'actifs à ID. |
|`FindAssetEscrowsBySeller` |Liste des garanties d'actifs par vendeur. |
|`FindAssetEscrowsByBuyer` |Liste des garanties d'actifs par acheteur. |
|`FindAssetEscrowsByStatus` |Liste des garanties d'actif par statut. |
|`FindAnonymousAssetEscrows` |Faites une liste d'enregistrements anonymes des actifs. |
|`FindAnonymousAssetEscrowById` |Trouvez une garantie anonyme d'actifs par ID. |
|`FindAnonymousAssetEscrowsBySeller` |Liste des garanties anonymes par vendeur. |
|`FindAnonymousAssetEscrowsByBuyer` |Liste des garanties anonymes par acheteur. |
|`FindAnonymousAssetEscrowsByStatus` |Liste des déposants anonymes par statut. |
|`FindProofRecordById` |Trouvez un enregistrement de preuve par ID. |
|`FindProofRecords` |Faites la liste des preuves. |
|`FindProofRecordsByBackend` |Liste des dossiers de preuve pour un arrière-plan de preuve. |
|`FindProofRecordsByStatus` |Listez les documents de preuve par état. |

## Nexus, Disponibilité des données et emballages {#nexus-data-availability-and-packages}

|Une question .|Objectif |
| --- | --- |
|`FindRepoAgreements` |Liste des accords de référentiel stockés en chaîne. |
|`FindTwitterBindingByHash` |Résolvez un lien Twitter par hash. |
|`FindDaPinIntentByTicket` |Trouvez l'intention du pin de disponibilité des données par billet. |
|`FindDaPinIntentByManifest` |Trouvez l'intention de la broche par référence manifeste. |
|`FindDaPinIntentByAlias` |Trouvez l'intention de pin par alias.|
|`FindDaPinIntentByLaneEpochSequence` |Trouvez l'intention d'une broche par voie, époque et séquence. |
|`FindLaneRelayEnvelopeByRef` |Trouvez une enveloppe vérifiée pour le relais.|
|`FindSorafsProviderOwner` |Résoudre le propriétaire d'un fournisseur SoraFS. |
|`FindDataspaceNameOwnerById` |Résolvez un propriétaire de l'espace de données. |
|`FindMusubiExactPackageV1` |Lisez un enregistrement de l'emballage exact et ses révisions actuelles. |
|`FindMusubiExactReleaseV1` |Lisez une photo de sortie exacte. |
|`FindMusubiProviderBundleAttestationV1` |Lisez l'attestation d'un ensemble d'archives d'un fournisseur. |
|`FindMusubiResolverIndexV1` |Faites une page sur l'indice de résolution définie. |
|`FindMusubiVersionsV1` |Page des versions finalisées pour un paquet. |
|`FindMusubiMaintainersV1` |Page a accepté les entretiens et les invitations en attente. |
|`FindMusubiArchiveLocationsV1` |Page finalisé SoraFS les emplacements d'un seul archive. |
|`FindMusubiArchiveRetentionV1` |Page des dossiers de conservation d'archives. |
|`FindMusubiAliasV1` |Lisez l'objectif et la révision actuels d'un alias mondial. |
|`FindMusubiAliasHistoryV1` |Page l'historique de retarget immutable d'un alias mondial. |
|`FindMusubiOrderedPrefixV1` |Les paquets de page sous un préfixe structurel ordonné. |

## Les déclencheurs, les contrats, les transactions et les blocs {#triggers-contracts-transactions-and-blocks}

|Une question .|Objectif |
| --- | --- |
|`FindActiveTriggerIds` |Liste du déclencheur actif IDs. |
|`FindTriggers` |Liste des déclencheurs. |
|`FindTriggerById` |Trouvez un déclencheur à ID. |
|`FindContractManifestByCodeHash` |Trouver un manifeste de contrat intelligent par code hash. |
|`FindTransactions` |Liste des transactions engagées. |
|`FindBlocks` |Les blocs de liste.|
|`FindBlockHeaders` |Liste des en-têtes de bloc. |

## Le filtrage et la pagination {#filtering-and-pagination}

Les requêtes itérables peuvent exposer le support du prédicateur et du sélecteur. Utilisez des filtres typés spécifiques à la requête de la SDK afin que l'entrée du filtre correspond au type de sortie de la requête. Pour les grands ensembles de résultats, utilisez des paramètres de requête tels que le curseur et la limite au lieu de récupérer chaque rangée en même temps.
