---
translation_locale: fr
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les jetons d'accès {#permission-tokens}

Cette page répertorie les types de jetons d'autorisation par défaut exposés par le courant
Iroha Modèle de données d'exécuteur. Pour le guide conceptuel des rôles et autorisations,
voir [Autorisations](/fr/blockchain/permissions.md).

Les contrôles d'autorisation sont exécutés par le validateur d'exécution actif.
les noms ci-dessous décrivent la surface de politique standard, mais un réseau peut personnaliser
la validation du temps d'exécution par mise à niveau de l'exécuteur.

## Les jetons par défaut {#default-tokens}

| Token d'autorisation | Catégorie | L'opération |
| --- | --- | --- |
| `CanManagePeers` | Peer | Inscrivez-vous, retirez-vous ou gérez vos pairs. |
| `CanManageLaneRelayEmergency` | Peer | Gérer les commandes de relais d'urgence. |
| `CanRegisterDomain` | Domaine | Enregistrer un domaine. |
| `CanUnregisterDomain` | Domaine | Déloignez un domaine. |
| `CanModifyDomainMetadata` | Domaine | Modifiez les métadonnées du domaine. |
| `CanRegisterAccount` | Compte | Enregistrer un compte. |
| `CanUnregisterAccount` | Compte | Déloculez un compte. |
| `CanModifyAccountMetadata` | Compte | Modifiez les métadonnées du compte. |
| `CanUnregisterAssetDefinition` | Définition des actifs | Déloyer une définition d'actif. |
| `CanModifyAssetDefinitionMetadata` | Définition des actifs | Modifier les métadonnées de la définition d'actif. |
| `CanMintAssetWithDefinition` | Les actifs | Les actifs de la Monnaie pour une définition spécifique. |
| `CanBurnAssetWithDefinition` | Les actifs | Brûler des actifs pour une définition spécifique. |
| `CanTransferAssetWithDefinition` | Les actifs | Transfert d'actifs pour une définition spécifique. |
| `CanMintAsset` | Les actifs | Faire une balance d'actifs spécifique. |
| `CanBurnAsset` | Les actifs | Brûler un solde d'actifs spécifique. |
| `CanTransferAsset` | Les actifs | Transférer un solde d'actifs spécifique. |
| `CanRegisterNft` | NFT | Enregistrer une NFT. |
| `CanUnregisterNft` | NFT | Délocation de l'inscription NFT. |
| `CanTransferNft` | NFT | Transférer une NFT. |
| `CanModifyNftMetadata` | NFT | Modifier NFT les métadonnées. |
| `CanSetParameters` | Paramètres | Définir les paramètres de configuration en chaîne. |
| `CanManageRoles` | Les rôles | Enregistrer, retirer, accorder ou révoquer des rôles. |
| `CanRegisterTrigger` | Le déclencheur | Enregistrez une gâchette. |
| `CanExecuteTrigger` | Le déclencheur | Exécutez un déclencheur. |
| `CanUnregisterTrigger` | Le déclencheur | Déregistrez la détente. |
| `CanModifyTrigger` | Le déclencheur | Modifiez la configuration du déclencheur. |
| `CanModifyTriggerMetadata` | Le déclencheur | Modifiez les métadonnées du déclencheur. |
| `CanUpgradeExecutor` | L'exécuteur | Mettez à jour l'exécuteur d'exécution. |
| `CanRegisterSmartContractCode` | Contrats intelligents | Enregistrer le code de contrat intelligent. |
| `CanUseFeeSponsor` | Nexus | Charge Nexus les frais versés sur un compte sponsor spécifié. |

## Propriété {#ownership}

Les jetons d'autorisation sensibles au propriétaire doivent faire référence à l'objet canonique IDs utilisés
Par exemple, les autorisations de compte se réfèrent à
compte sans domaine IDs, les autorisations de domaine se réfèrent à `domain.dataspace` domaine
IDs, et les autorisations d'actif se réfèrent à la définition ou à l'actif canoniques IDs.

Lorsqu'une transaction échoue avec une erreur d'autorisation, vérifiez les deux parties:

- le compte signant la transaction est le compte canonique attendu
- le jeton ou rôle d'autorisation a été accordé pour l'objet exact ID utilisés dans le
  instruction
