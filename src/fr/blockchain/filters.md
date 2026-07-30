---
translation_locale: fr
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Filtres

Filtre les courants d'événements et déclenche les conditions.
le filtre de l'événement est `EventFilterBox`, qui peut correspondre à ces familles d'événements:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

Utilisez le filtre le plus étroit qui correspond au flux de travail.
`DataEventFilter::Any` sont utiles pour le diagnostic, mais ils font chaque événement
payer le coût du déclenchement ou du match des abonnés.

## Filtres d'événements de données

`DataEventFilter` correspond aux événements de données du registre.

| Variante | Famille d'événements |
| --- | --- |
| `Any` | Tout événement de données |
| `Peer` | Événements du cycle de vie des pairs |
| `Domain` | Les événements du cycle de vie du domaine et des métadonnées |
| `Account` | Cycle de vie du compte, métadonnées, alias et événements d'identité |
| `Asset` | Les événements liés au solde des actifs et aux métadonnées |
| `AssetDefinition` | Définition d'actifs cycle de vie, politique et événements de métadonnées |
| `Nft` | Les événements du cycle de vie et des métadonnées de NFT |
| `Rwa` | Événements du cycle de vie des actifs réels |
| `Trigger` | Événements de cycle de vie et de métadonnées de déclencheurs |
| `Role` | Événements du cycle de vie du rôle |
| `Configuration` | Événements de configuration en chaîne |
| `Executor` | Événements d'exécution de l'exécution |
| `Proof` | Événements du cycle de vie de la vérification de la preuve |
| `Confidential` | Événements confidentiels relatifs aux actifs |
| `VerifyingKey` | Événements de registre des clés de vérification |
| `RuntimeUpgrade` | Evénements de mise à niveau de l'exécution |
| `Soradns` | Résolver les événements de gouvernance du répertoire |
| `Sorafs` | Événements de conformité de passerelle SoraFS |
| `SpaceDirectory` | Répertoire spatiale manifestes des événements du cycle de vie |
| `Escrow` | Événements du cycle de vie des actifs natifs en dépôt de garantie transparents |
| `Offline` | Evénements de règlement hors ligne |
| `Oracle` | Événements de flux Oracle |
| `Social` | Evénements d'incitation virale |
| `Bridge` | Les événements de pont |
| `Governance` | Evénements de gouvernance lorsque la fonction de gouvernance est activée |

La plupart des filtres de béton permettent également un matcher d'identification optionnel et un masque d'événements.
Par exemple, un filtre d'actifs peut correspondre à un actif ou à une classe d'événements d'actifs,
tandis qu'un filtre de déclencheur peut correspondre à un identifiant de déclencheur et à un ensemble d'événements de déclencheur.

## Filtres de tuyaux

Les filtres de pipeline correspondent à des événements de traitement tels que blocage, transaction, fusion,
Utilisez-les pour les abonnements opérationnels, le traitement par bloc
des tableaux de bord et des déclencheurs qui réagissent à l'état du pipeline plutôt qu'aux données du registre
les objets.

## Filtres de déclenchement

Les déclencheurs stockent leur état comme un `EventFilterBox`Une action déclenchante aussi
les magasins:

- un exécutable
- une politique de répétition
- compte de l'autorité
- une politique facultative de réessayer le déclencheur temporel
- métadonnées

L'autorité de déclenchement doit disposer des autorisations requises par l'exécutable.
Je préfère des comptes techniques dédiés pour les déclencheurs de longue durée.

## Filtres de requête

Les filtres de requêtes sont séparés des filtres d'événements.
prise en charge de prédicate et de sélecteur. Utilisez des filtres typés spécifiques à la requête du SDK
Donc l'entrée du filtre correspond au type de sortie de la requête.

Voir aussi:

- [Les événements](/blockchain/events.md)
- [Réservation des actifs natifs](/blockchain/escrow.md#queries-and-events)
- [Les déclencheurs](/blockchain/triggers.md)
- [Les questions](/blockchain/queries.md)
- [Références à la requête](/reference/queries.md)
