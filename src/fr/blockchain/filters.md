---
translation_locale: fr
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Filtres {#filters}

Filtre les courants d'événements étroits et conditions de déclenchement.
le filtre de l'événement est `EventFilterBox`, qui peuvent correspondre à ces familles d'événements:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

Utilisez le filtre le plus étroit qui correspond au flux de travail.
`DataEventFilter::Any` sont utiles pour le diagnostic, mais ils font chaque événement
payer le coût du déclencheur ou de l'abonnement correspondant.

## Filtres d'événements de données {#data-event-filters}

`DataEventFilter` correspond aux événements de données du registre.

| Variante | Famille d'événements |
| --- | --- |
| `Any` | Tout événement de données |
| `Peer` | Événements du cycle de vie des pairs |
| `Domain` | Les événements du cycle de vie et des métadonnées du domaine |
| `Account` | Cycle de vie du compte, métadonnées, alias et événements d'identité |
| `Asset` | Les événements liés au solde des actifs et aux métadonnées |
| `AssetDefinition` | Définition d'actifs cycle de vie, politique et événements de métadonnées |
| `Nft` | NFT événements du cycle de vie et des métadonnées |
| `Rwa` | Événements du cycle de vie des actifs dans le monde réel |
| `Trigger` | Les événements de cycle de vie et de métadonnées des déclencheurs |
| `Role` | Événements du cycle de vie des rôles |
| `Configuration` | Événements de configuration en chaîne |
| `Executor` | Événements d'exécution de l'exécution |
| `Proof` | Événements du cycle de vie de la vérification des preuves |
| `Confidential` | Événements confidentiels relatifs aux actifs |
| `VerifyingKey` | Événements de registre des clés de vérification |
| `RuntimeUpgrade` | Événements de mise à niveau en cours d'exécution |
| `Soradns` | Résolver les événements de gouvernance du répertoire |
| `Sorafs` | SoraFS événements de conformité à la passerelle |
| `SpaceDirectory` | Répertoire spatiale manifestes des événements du cycle de vie |
| `Escrow` | Événements du cycle de vie des ententes fiduciaires natives transparents |
| `Offline` | Evénements de règlement hors ligne |
| `Oracle` | Événements de flux Oracle |
| `Social` | Evénements d'incitation virale |
| `Bridge` | Les événements de pont |
| `Governance` | Evénements de gouvernance lorsque la fonctionnalité de gouvernation est activée |

La plupart des filtres en béton permettent également une option ID Un match et un masque d'événement.
Par exemple, un filtre d'actif peut correspondre à un actif ou à une classe d'événements d'actifs,
tandis qu'un filtre de déclencheur peut correspondre à un déclencheurs ID et un ensemble d'événements déclencheurs.

## Filtres de tuyaux {#pipeline-filters}

Les filtres de pipeline correspondent à des événements de traitement tels que blocage, transaction, fusion,
Utilisez-les pour les abonnements opérationnels, le traitement par bloc
des tableaux de bord et des déclencheurs qui réagissent à l'état du pipeline plutôt que aux données du registre
les objets.

## Filtres de déclenchement {#trigger-filters}

Les déclencheurs stockent leur état comme un `EventFilterBox`. Une action déclenchante aussi
les magasins:

- un exécutable
- une politique de répétition
- compte de l'autorité
- une politique facultative de retrait des déclencheurs temporels
- métadonnées

L'autorité de déclenchement doit disposer des autorisations requises par l'exécutable.
Je préfère des comptes techniques dédiés pour les déclencheurs de longue durée.

## Filtres de requête {#query-filters}

Les filtres de requêtes sont séparés des filtres d'événements.
Prise en charge des prédicates et sélecteurs. SDK
Donc l'entrée du filtre correspond au type de sortie de la requête.

Voir aussi:

- [Les événements](/fr/blockchain/events.md)
- [Réservation des actifs natifs](/fr/blockchain/escrow.md#queries-and-events)
- [Les déclencheurs](/fr/blockchain/triggers.md)
- [Les questions](/fr/blockchain/queries.md)
- [Références à la requête](/fr/reference/queries.md)
