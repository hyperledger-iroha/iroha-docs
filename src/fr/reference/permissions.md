---
translation_locale: fr
translation_source: /reference/permissions.md
translation_source_hash: aedb5b658cde78dc7b169877c315cfb2ed860257dedb5b3b0bcfff8cc4f472a1
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Jetons de permission {#permission-tokens}

Cette page répertorie les types de jetons d'autorisation par défaut exposés par le modèle de données de l'exécuteur actuel Iroha. Pour le guide conceptuel des rôles et des permissions, voir [Autorisations](/fr/blockchain/permissions.md).

Les contrôles d'autorisation sont appliqués par le validateur d'exécution logicielle actif. Les noms de type de jeton ci-dessous décrivent la surface de politique standard, mais un réseau peut personnaliser la validation d'exécution logicielle en mettant à niveau l'exécuteur.

## Jetons par défaut {#default-tokens}

|Jeton d'autorisation|Catégorie|Opération|
| --- | --- | --- |
| `CanManagePeers` |pair réseau|Enregistrez, désenregistrez ou gérez autrement les pairs du réseau.|
| `CanRegisterDomain` |Domaine|Enregistrer un domaine.|
| `CanUnregisterDomain` |Domaine|Résilier l'enregistrement d'un domaine.|
| `CanModifyDomainMetadata` |Domaine|Modifier les métadonnées du domaine.|
| `CanRegisterAccount` |Compte|Créer un compte.|
| `CanUnregisterAccount` |Compte|Désenregistrer un compte.|
| `CanModifyAccountMetadata` |Compte|Modifier les métadonnées du compte.|
| `CanUnregisterAssetDefinition` |Définition de l'actif|Désenregistrer une définition d'actif.|
| `CanModifyAssetDefinitionMetadata` |Définition d'actif|Modifier les métadonnées de définition d'actif.|
| `CanMintAssetWithDefinition` |Actif|émission d'actifs pour une définition spécifique.|
| `CanBurnAssetWithDefinition` |Actif|Brûler des actifs pour une définition spécifique.|
| `CanTransferAssetWithDefinition` |Actif|Transférer des actifs pour une définition spécifique.|
| `CanMintAssetToAccount` |Actif| émettre un solde d’actif spécifique. |
| `CanBurnAsset` |Actif|Brûler un solde d'actif spécifique.|
| `CanTransferAsset` |Actif|Transférer un solde d'actif spécifique.|
| `CanRegisterNft` | NFT |Enregistrer un NFT.|
| `CanUnregisterNft` | NFT |Désenregistrer un NFT.|
| `CanTransferNft` | NFT |Transférer un NFT.|
| `CanModifyNftMetadata` | NFT |Modifier les métadonnées de NFT.|
| `CanSetParameters` |Paramètres|Définir les paramètres de configuration sur la chaîne.|
| `CanManageRoles` |Rôles|Enregistrer, désenregistrer, accorder ou révoquer des rôles.|
| `CanRegisterTrigger` |Déclencheur|Enregistrer un déclencheur.|
| `CanExecuteTrigger` |Déclencheur|Exécuter un déclencheur.|
| `CanUnregisterTrigger` |Déclencheur|Désenregistrer un déclencheur.|
| `CanModifyTrigger` |Déclencheur|Modifier la configuration du déclencheur.|
| `CanModifyTriggerMetadata` |Déclencheur|Modifier les métadonnées du déclencheur.|
| `CanUpgradeExecutor` |Exécuteur|Mettre à jour l'exécuteur d'exécution du logiciel.|
| `CanManageSmartContractCode` |Contrat intelligent|Supprimer les artefacts de code non référencés et déléguer les points d'entrée des contrats. Les comptes enregistrés peuvent créer des artefacts vérifiés sans cette permission.|
| `CanManageFeeSponsorProgram` | SORA Nexus | Administrer les programmes détenus par le compte sponsor précisément désigné. |
| `CanEnrollFeeSponsorProgram` | SORA Nexus | Gérer les bénéficiaires d’un programme sponsor précisément désigné. |

## Propriété {#ownership}

Les jetons d'autorisation sensibles au propriétaire doivent faire référence aux identifiants d'objet canoniques utilisés par le modèle de données actuel. Par exemple, les permissions de compte se réfèrent aux identifiants de compte sans domaine canoniques, les permissions de domaine se réfèrent aux identifiants de domaine `domain.dataspace`, et les autorisations d'actifs se réfèrent à la définition canonique des actifs ou aux identifiants des actifs.

Lorsqu'une transaction échoue avec une erreur d'autorisation, vérifiez les deux parties :

- le compte signant la transaction est le compte canonique attendu
- le jeton d'autorisation ou le rôle a été accordé pour l'ID d'objet exact utilisé dans l'instruction
