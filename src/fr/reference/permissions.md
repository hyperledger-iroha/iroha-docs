---
translation_locale: fr
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les jetons d'autorisation {#permission-tokens}

Cette page répertorie les types de jetons d'autorisation par défaut exposés par le modèle de données actuel Iroha. Pour un guide conceptuel des rôles et autorisations, voir [Permissions](/fr/blockchain/permissions.md).

Les contrôles d'autorisation sont effectués par le validateur actif de l'exécution. Les noms des types de jetons ci-dessous décrivent la surface de politique standard, mais un réseau peut personnaliser la validation du temps d'exécution en mettant à jour le l'exécuteur.

## Des jetons par défaut {#default-tokens}

|Symbole d' autorisation|Catégorie |Opération |
| --- | --- | --- |
|`CanManagePeers` |Peer |Enregistrer, désinscrire ou gérer autrement les pairs. |
|`CanManageLaneRelayEmergency` |Peer |Gérer les commandes d'urgence du relais. |
|`CanRegisterDomain` |Domaine |Enregistrer un domaine.|
|`CanUnregisterDomain` |Domaine |Ne pas enregistrer un domaine. |
|`CanModifyDomainMetadata` |Domaine |Modifiez les métadonnées du domaine. |
|`CanRegisterAccount` |Compte |Enregistrez un compte.|
|`CanUnregisterAccount` |Compte |Ne pas enregistrer un compte.|
|`CanModifyAccountMetadata` |Compte |Modifiez les métadonnées du compte. |
|`CanUnregisterAssetDefinition` |Définition des actifs |Déloyer une définition d'actif. |
|`CanModifyAssetDefinitionMetadata` |Définition des actifs |Modifier les métadonnées de la définition des actifs. |
|`CanMintAssetWithDefinition` |Les actifs |Actifs de la Monnaie pour une définition spécifique. |
|`CanBurnAssetWithDefinition` |Les actifs |Brûlure d'actifs pour une définition spécifique. |
|`CanTransferAssetWithDefinition` |Les actifs |Transfert d'actifs pour une définition spécifique. |
|`CanMintAsset` |Les actifs |Une balance d'actifs spécifique. |
|`CanBurnAsset` |Les actifs |Brûler un solde d'actifs spécifique. |
|`CanTransferAsset` |Les actifs |Transférer un solde d'actifs spécifique. |
|`CanRegisterNft` |NFT |Enregistrer un NFT. |
|`CanUnregisterNft` |NFT |Délocation d'enregistrement de NFT. |
|`CanTransferNft` |NFT |Transférer un NFT. |
|`CanModifyNftMetadata` |NFT |Modifier les métadonnées de NFT. |
|`CanSetParameters` |Paramètres |Définir les paramètres de configuration sur la chaîne. |
|`CanManageRoles` |Les rôles |Enregistrer, annuler, accorder ou révoquer des rôles. |
|`CanRegisterTrigger` |Le déclencheur|Enregistrez une détente. |
|`CanExecuteTrigger` |Le déclencheur|Exécutez un déclencheur.|
|`CanUnregisterTrigger` |Le déclencheur|Déregistrez une détente.|
|`CanModifyTrigger` |Le déclencheur|Modifiez la configuration du déclencheur. |
|`CanModifyTriggerMetadata` |Le déclencheur|Modifiez les métadonnées du déclencheur. |
|`CanUpgradeExecutor` |Exécuteur |Mettez à niveau l'exécuteur d'exécution. |
|`CanRegisterSmartContractCode` |Un contrat intelligent .|Inscrivez le code du contrat intelligent. |
|`CanUseFeeSponsor` |Nexus |Charger des frais de Nexus à un compte sponsor spécifié. |

## Propriété {#ownership}

Les jetons d'autorisation sensibles au propriétaire doivent faire référence à l'objet canonique IDs utilisés par le modèle de données actuel. Par exemple, les autorisations de compte se réfèrent à un compte sans domaine canonique IDs, les autorisations de domaine se réfèrent à `domain.dataspace` domaine IDs, et les autorisations d'actif se réfèrent à la définition ou à l'actif canoniques. IDs.

Lorsque la transaction échoue avec une erreur d'autorisation, vérifiez les deux parties:

- le compte signant la transaction est le compte canonique attendu
- le jeton d'autorisation ou le rôle a été accordé pour l'objet exact ID utilisé dans l'instruction
