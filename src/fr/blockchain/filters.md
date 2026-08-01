---
translation_locale: fr
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les filtres {#filters}

Filtre les courants d'événements étroits et conditions de déclenchement. Le filtre d'évènements actuel au plus haut niveau est `EventFilterBox`, qui peut correspondre à ces familles d'évents:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

Utilisez le filtre le plus étroit qui corresponde au flux de travail. Les filtres larges tels que `DataEventFilter::Any` sont utiles pour le diagnostic, mais ils font payer chaque événement le coût du déclenchement ou de l'adaptation des abonnés.

## Filtres d'événements de données {#data-event-filters}

`DataEventFilter` correspond à des événements de données du registre.

|Variante |Famille d' événements |
| --- | --- |
|`Any` |Tout événement de données |
|`Peer` |Les événements de cycle de vie des pairs |
|`Domain` |Cycle de vie du domaine et événements de métadonnées |
|`Account` |Cycle de vie des comptes, métadonnées, alias et événements d'identité |
|`Asset` |Événements de solde des actifs et métadonnées |
|`AssetDefinition` |Définition d'actifs cycle de vie, politique et événements de métadonnées |
|`Nft` |NFT événements du cycle de vie et des métadonnées |
|`Rwa` |Evénements du cycle de vie des actifs dans le monde réel |
|`Trigger` |Événements de cycle de vie et de métadonnées déclencheurs |
|`Role` |Les événements du cycle de vie des rôles |
|`Configuration` |Les événements de configuration en chaîne |
|`Executor` |Événements d' exécuteur de temps d' exécution |
|`Proof` |Événements du cycle de vie de la vérification des preuves |
|`Confidential` |Les événements d' actifs confidentiels |
|`VerifyingKey` |Événements du registre de vérification des clés |
|`RuntimeUpgrade` |Evénements de mise à niveau du temps d' exécution |
|`Soradns` |Résoudre les événements de gouvernance du répertoire |
|`Sorafs` |SoraFS événements de conformité à la passerelle |
|`SpaceDirectory` |Le répertoire spatial manifeste les événements du cycle de vie |
|`Escrow` |Événements transparents du cycle de vie d' un actif natif en garantie |
|`Offline` |Les événements de règlement hors ligne |
|`Oracle` |Événements de flux Oracle |
|`Social` |Evénements d' incitation virale |
|`Bridge` |Les événements du pont |
|`Governance` |Événements de gouvernance lorsque la fonctionnalité de gouvernation est activée |

La plupart des filtres en béton permettent également un matcher ID optionnel et un masque de jeu d'événements. Par exemple, un filtre d'actif peut correspondre à un actif ou à une classe d'évènements d'actifs, tandis qu'un filtre déclencheur peut correspondre au déclenchement ID et à un ensemble d'éventuels déclencheurs.

## Filtres de tuyauterie {#pipeline-filters}

Les filtres de pipeline correspondent aux événements de traitement tels que les blocs, les transactions, les fusions et les événements témoins. Utilisez-les pour les abonnements opérationnels, les tableaux de bord de traitement des blocs et les déclencheurs qui réagissent à l'état du pipeline plutôt qu'aux objets de données du registre.

## Filtres de déclenchement {#trigger-filters}

Les déclencheurs stockent leur état comme un `EventFilterBox`.

- un exécutable
- une politique de répétition
- compte de l'autorité
- une politique facultative de retrait des déclencheurs temporels
- métadonnées

L'autorité de déclenchement doit disposer des autorisations requises par l'exécutable et préférer les comptes techniques dédiés aux déclencheurs à long terme.

## Filtres de requête {#query-filters}

Les filtres de requêtes sont distincts des filtres d'événements. Les requêtes itérables peuvent exposer le support du prédicateur et du sélecteur. Utilisez des filtres typés spécifiques à la requête à partir du SDK afin que l'entrée du filtre correspond au type de sortie de la requête.

Voir aussi:

- [Les événements](/fr/blockchain/events.md)
- [Réservation d'actifs natifs ](/fr/blockchain/escrow.md#queries-and-events)
- [Les déclencheurs ](/fr/blockchain/triggers.md)
- [Les questions ](/fr/blockchain/queries.md)
- [Référence à la requête ](/fr/reference/queries.md)
