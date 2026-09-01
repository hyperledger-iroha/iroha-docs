---
translation_locale: fr
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Requêtes {#queries}

Iroha interroge l'état du grand livre blockchain sans le modifier. Le modèle de données actuel expose deux grandes formes de requêtes :

- requêtes singulières, qui renvoient un objet ou une valeur
- requêtes itérables, qui renvoient un flux ou une collection et peuvent être combinées avec le filtrage, le tri, la projection et la pagination lorsque le type de requête le prend en charge

Utilisez les constructeurs typés SDK ou le CLI au lieu de construire manuellement des conteneurs de données de requête. Les noms ci-dessous sont les types de requête actuellement exposés par `iroha_data_model::query`.

## Exécution et configuration logicielle {#runtime-and-configuration}

|Requête|But|
| --- | --- |
| `FindAbiVersion` |Retourner la version de l'exécuteur ABI.|
| `FindExecutorDataModel` |Retournez la description du modèle de données de l'exécuteur.|
| `FindParameters` |Retourner les paramètres de configuration de l'exécuteur sur la chaîne.|

## Comptes et autorisations {#accounts-and-permissions}

|Requête|But|
| --- | --- |
| `FindAccountById` |Trouvez un compte par identifiant de compte canonique.|
| `FindAccountByAlias` |Résoudre un alias de compte en un compte.|
| `FindAccounts` |Lister les comptes enregistrés.|
| `FindAccountIds` |Lister les identifiants de compte enregistrés.|
| `FindAccountsWithAsset` |Lister les comptes qui détiennent une définition d'actif donnée.|
| `FindAliasesByAccountId` |Lister les alias associés à un compte.|
| `FindAccountRecoveryPolicyByAlias` |Trouvez la politique de récupération pour un alias.|
| `FindAccountRecoveryRequestByAlias` |Trouvez la demande de récupération pour un alias.|
| `FindRoles` |Lister les rôles.|
| `FindRoleIds` |Lister les identifiants de rôle.|
| `FindRolesByAccountId` |Lister les rôles attribués à un compte.|
| `FindPermissionsByAccountId` |Lister les permissions accordées à un compte.|

## Domaines et pairs réseau {#domains-and-peers}

|Requête|But|
| --- | --- |
| `FindDomainById` |Trouvez un domaine par `DomainId`.|
| `FindDomains` |Lister les domaines enregistrés.|
| `FindDomainsByAccountId` |Lister les domaines possédés par un compte.|
| `FindDomainEndorsements` |Lister les enregistrements d'approbation de domaine.|
| `FindDomainEndorsementPolicy` |Retournez la politique d'approbation de domaine.|
| `FindDomainCommittee` |Retournez le comité de domaine.|
| `FindPeers` |Lister les pairs réseau de confiance connus du registre blockchain.|

## Actifs, NFTs, et RWAs {#assets-nfts-and-rwas}

|Requête|But|
| --- | --- |
| `FindAssets` |Lister les soldes des actifs.|
| `FindAssetsDefinitions` |Lister les définitions d'actifs.|
| `FindAssetsByAccountId` |Lister les actifs détenus par un compte.|
| `FindAssetById` |Trouvez le solde d'un actif par `AssetId`.|
| `FindAssetDefinitionById` |Trouver une définition d’actif par ID.|
| `FindNfts` |Liste NFTs.|
| `FindNftsByAccountId` |Liste NFTs détenue par un compte.|
| `FindRwas` |Lister les lots d’actifs réels enregistrés.|

## Compte séquestre et dossiers de preuve {#escrow-and-proof-records}

Les requêtes d'entiercement inspectent les enregistrements créés par [séquestre d’actif natif ISIs](/fr/blockchain/escrow.md), y compris les séquestres de marché, les verrouillages d'actifs génériques et les enregistrements d'entiercement anonymes.

|Requête|But|
| --- | --- |
| `FindAssetEscrows` |Lister les registres d'entiercement des actifs.|
| `FindAssetEscrowById` |Trouver un séquestre d'actif par ID.|
| `FindAssetEscrowsBySeller` |Lister les séquestres d'actifs par vendeur.|
| `FindAssetEscrowsByBuyer` |Lister les séquestres d'actifs par acheteur.|
| `FindAssetEscrowsByStatus` |Lister les séquestres d'actifs par statut.|
| `FindAnonymousAssetEscrows` |Lister les dossiers d'entiercement d'actifs anonymes.|
| `FindAnonymousAssetEscrowById` |Trouvez un séquestre d'actif anonyme par ID.|
| `FindAnonymousAssetEscrowsBySeller` |Lister les séquestres anonymes par vendeur.|
| `FindAnonymousAssetEscrowsByBuyer` |Lister les séquestres anonymes par acheteur.|
| `FindAnonymousAssetEscrowsByStatus` |Lister les séquestres anonymes par statut.|
| `FindProofRecordById` |Trouver un enregistrement de preuve par ID.|
| `FindProofRecords` |Lister les dossiers de preuve.|
| `FindProofRecordsByBackend` |Lister les enregistrements de preuve pour un backend de preuve.|
| `FindProofRecordsByStatus` |Lister les dossiers de preuve par statut.|

## Nexus, Disponibilité des données et packages {#nexus-data-availability-and-packages}

|Requête|But|
| --- | --- |
| `FindRepoAgreements` |Lister les accords de dépôt stockés sur la chaîne.|
| `FindTwitterBindingByHash` |Résoudre une liaison Twitter par hachage cryptographique.|
| `FindDaPinIntentByTicket` |Trouvez une intention de broche de disponibilité des données par ticket.|
| `FindDaPinIntentByManifest` |Trouver une intention de pin par référence au manifeste technique.|
| `FindDaPinIntentByAlias` |Trouver une intention d'épingle par alias.|
| `FindDaPinIntentByLaneEpochSequence` |Trouvez une intention d'épingle par voie d'exécution, époque et séquence.|
| `FindLaneRelayEnvelopeByRef` |Trouvez un conteneur de données de relais de voie vérifié.|
| `FindSorafsProviderOwner` |Résoudre le propriétaire d'un fournisseur SoraFS.|
| `FindDataspaceNameOwnerById` |Résoudre un propriétaire de nom d'espace de données.|
| `FindMusubiExactPackageV1` |Lisez un enregistrement de package exact et ses révisions actuelles.|
| `FindMusubiExactReleaseV1` |Lire un instantané de version exact.|
| `FindMusubiProviderBundleAttestationV1` |Lisez l'attestation du lot d'archives d'un fournisseur.|
| `FindMusubiResolverIndexV1` |Parcourez l'index finalisé du résolveur.|
| `FindMusubiVersionsV1` |Pages des versions finalisées pour un paquet.|
| `FindMusubiMaintainersV1` |Page des mainteneurs acceptés et des invitations en attente.|
| `FindMusubiArchiveLocationsV1` |Page finalisée SoraFS des emplacements pour une archive.|
| `FindMusubiArchiveRetentionV1` |Page des dossiers de conservation des archives.|
| `FindMusubiAliasV1` |Lire la cible actuelle et la révision d'un alias global.|
| `FindMusubiAliasHistoryV1` |Pagez l'historique de retargeting immuable d'un alias global.|
| `FindMusubiOrderedPrefixV1` |Page des packages sous un préfixe structuré ordonné.|

## Déclencheurs, Contrats, Transactions et Blocs {#triggers-contracts-transactions-and-blocks}

|Requête|But|
| --- | --- |
| `FindActiveTriggerIds` |Lister les ID de déclencheurs actifs.|
| `FindTriggers` |Lister les déclencheurs.|
| `FindTriggerById` |Trouvez un déclencheur par ID.|
| `FindContractManifestByCodeHash` |Trouvez un manifeste technique de contrat intelligent par hachage cryptographique de code.|
| `FindTransactions` |Lister les transactions validées.|
| `FindBlocks` |Lister les blocs.|
| `FindBlockHeaders` |Lister les en-têtes de bloc.|

## Filtrage et pagination {#filtering-and-pagination}

Les requêtes itérables peuvent exposer le support des prédicats et des sélecteurs. Utilisez des filtres typés spécifiques à la requête à partir du SDK afin que l'entrée du filtre corresponde au type de sortie de la requête. Pour les grands ensembles de résultats, utilisez des paramètres de requête tels que cursor et limit au lieu de récupérer toutes les lignes à la fois.
