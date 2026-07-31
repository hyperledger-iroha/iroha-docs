---
translation_locale: fr
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les questions {#queries}

Iroha Les requêtes lisent l'état du registre sans le modifier.
dévoile deux formes de requête larges:

- **requêtes singulières**, qui renvoient un objet ou une valeur
- **requêtes récurrentes**, qui renvoient un courant ou une collection et peuvent être combinés
  avec filtrage, tri, projection et pagination où le type de requête
  le soutient

Utilisation SDK les constructeurs de type ou le CLI au lieu de construire des enveloppes de requêtes par
Les noms ci-dessous sont les types de requêtes actuels exposés par
`iroha_data_model::query`.

## Temps d'exécution et configuration {#runtime-and-configuration}

| Résumé | Le but |
| --- | --- |
| `FindAbiVersion` | Retournez l'exécuteur ABI La version. |
| `FindExecutorDataModel` | Retourner la description du modèle de données exécutant. |
| `FindParameters` | Retourner les paramètres de configuration de l'exécuteur en chaîne. |

## Comptes et autorisations {#accounts-and-permissions}

| Résumé | Le but |
| --- | --- |
| `FindAccountById` | Trouver un compte par compte canonique ID. |
| `FindAccountByAlias` | Résolvez un compte sous le pseudonyme de compte. |
| `FindAccounts` | Liste des comptes enregistrés. |
| `FindAccountIds` | Liste du compte enregistré IDs. |
| `FindAccountsWithAsset` | Liste des comptes détenant une définition d'actif donnée. |
| `FindAliasesByAccountId` | Liste des pseudonymes liés à un compte. |
| `FindAccountRecoveryPolicyByAlias` | Trouvez la politique de récupération pour un alias. |
| `FindAccountRecoveryRequestByAlias` | Trouvez la demande de récupération pour un alias. |
| `FindRoles` | Une liste de rôles. |
| `FindRoleIds` | Rôle de liste IDs. |
| `FindRolesByAccountId` | Liste des rôles accordés à un compte. |
| `FindPermissionsByAccountId` | Liste des autorisations accordées à un compte. |

## Domaines et pairs {#domains-and-peers}

| Résumé | Le but |
| --- | --- |
| `FindDomainById` | Trouver un domaine par `DomainId`. |
| `FindDomains` | Liste des domaines enregistrés. |
| `FindDomainsByAccountId` | Liste des domaines appartenant à un compte. |
| `FindDomainEndorsements` | Faites une liste des dossiers d'approbation du domaine. |
| `FindDomainEndorsementPolicy` | Retournez la politique d'approbation du domaine. |
| `FindDomainCommittee` | Retournez le comité de domaine. |
| `FindPeers` | Faites une liste de collègues de confiance connus dans le registre. |

## Les actifs, NFTs, et RWAs {#assets-nfts-and-rwas}

| Résumé | Le but |
| --- | --- |
| `FindAssets` | Liste des soldes d'actifs. |
| `FindAssetsDefinitions` | Liste des définitions d'actifs. |
| `FindAssetsByAccountId` | Liste des actifs détenus par un compte. |
| `FindAssetById` | Trouver un solde d'actif par `AssetId`. |
| `FindAssetDefinitionById` | Trouver une définition d'actif par ID. |
| `FindNfts` | Liste NFTs. |
| `FindNftsByAccountId` | Liste NFTs détenu par un compte. |
| `FindRwas` | Liste enregistrée de biens réels. |

## Réservations et justificatifs {#escrow-and-proof-records}

Les requêtes de dépôt d'argent vérifient les enregistrements créés par
[garantie des actifs natifs ISIs](/fr/blockchain/escrow.md), y compris le marché
Les garanties, les verrouillages d'actifs génériques et les dossiers de garantie anonymes.

| Résumé | Le but |
| --- | --- |
| `FindAssetEscrows` | Faites une liste des dossiers de dépôt d'actifs. |
| `FindAssetEscrowById` | Trouvez un escrow d' actifs par ID. |
| `FindAssetEscrowsBySeller` | Liste des garanties par vendeur. |
| `FindAssetEscrowsByBuyer` | Liste des garanties par acheteur. |
| `FindAssetEscrowsByStatus` | Liste des garanties d'actifs par statut. |
| `FindAnonymousAssetEscrows` | Faites une liste des enregistrements de dépôt d'actifs. |
| `FindAnonymousAssetEscrowById` | Trouvez un dépositaire anonyme d' actifs par ID. |
| `FindAnonymousAssetEscrowsBySeller` | Liste des garanties anonymes par vendeur. |
| `FindAnonymousAssetEscrowsByBuyer` | Liste des déposants anonymes par acheteur. |
| `FindAnonymousAssetEscrowsByStatus` | Liste des dépositaires anonymes par statut. |
| `FindProofRecordById` | Trouvez un enregistrement de preuve par ID. |
| `FindProofRecords` | Faites la liste des preuves. |
| `FindProofRecordsByBackend` | Listez les dossiers de preuve pour un backend de preuve. |
| `FindProofRecordsByStatus` | Listez les dossiers de preuve par état. |

## Nexus, Disponibilité des données et packages {#nexus-data-availability-and-packages}

| Résumé | Le but |
| --- | --- |
| `FindRepoAgreements` | Liste des accords de référentiel stockés en chaîne. |
| `FindTwitterBindingByHash` | Résolvez une liaison Twitter par hash. |
| `FindDaPinIntentByTicket` | Trouvez une intention de pin de disponibilité des données par billet. |
| `FindDaPinIntentByManifest` | Trouvez l'intention de la broche par référence manifeste. |
| `FindDaPinIntentByAlias` | Trouvez une intention de pin par alias. |
| `FindDaPinIntentByLaneEpochSequence` | Trouvez l'intention de la broche par voie, époque et séquence. |
| `FindLaneRelayEnvelopeByRef` | Trouvez une enveloppe vérifiée. |
| `FindSorafsProviderOwner` | Résoudre le propriétaire d'une SoraFS fournisseur. |
| `FindDataspaceNameOwnerById` | Résolvez un propriétaire de nom d'espace de données. |
| `FindMusubiReleaseByRef` | Trouvez une Musubi libération par référence. |
| `FindMusubiPackageVersions` | Liste des versions pour un Musubi le colis. |
| `FindMusubiPackageReleases` | Liste des émissions pour un Musubi le colis. |
| `FindMusubiShortAliasByName` | Résoudre un Musubi Des prénoms courts. |

## Les déclencheurs, les contrats, les transactions et les blocs {#triggers-contracts-transactions-and-blocks}

| Résumé | Le but |
| --- | --- |
| `FindActiveTriggerIds` | Liste du déclencheur actif IDs. |
| `FindTriggers` | Liste des déclencheurs. |
| `FindTriggerById` | Trouvez un déclencheur par ID. |
| `FindContractManifestByCodeHash` | Trouvez un manifeste de contrat intelligent par code hash. |
| `FindTransactions` | Liste des transactions engagées. |
| `FindBlocks` | Des blocs de liste. |
| `FindBlockHeaders` | Liste des en-têtes de bloc. |

## Filtrage et page d'accueil {#filtering-and-pagination}

Les requêtes itérables peuvent exposer la prise en charge des prédicateurs et des sélecteurs.
filtres de type à partir du SDK Donc l'entrée du filtre correspond au type de sortie de la requête.
Pour les grands ensembles de résultats, utilisez plutôt des paramètres de requête tels que curseur et limite
de chercher chaque rangée à la fois.
