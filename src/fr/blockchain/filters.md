---
translation_locale: fr
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Filtres {#filters}

Les filtres restreignent les flux d'événements et déclenchent des conditions. Le filtre d'événements de niveau supérieur actuel est `EventFilterBox`, qui peut correspondre à ces familles d'événements :

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

Utilisez le filtre le plus étroit qui correspond au flux de travail. Les filtres larges tels que `DataEventFilter::Any` sont utiles pour le diagnostic, mais ils font que chaque événement paie le coût du déclenchement ou de l'appariement des abonnés.

## Filtres d'événements de données {#data-event-filters}

`DataEventFilter` correspond aux événements de données du registre blockchain. Ses variantes actuelles incluent :

|Variante|Famille d'événements|
| --- | --- |
| `Any` |Tout événement de données|
| `Peer` |événements du cycle de vie des pairs réseau|
| `Domain` |Cycle de vie du domaine et événements de métadonnées|
| `Account` |Cycle de vie du compte, métadonnées, alias et événements d'identité|
| `Asset` |Événements de solde d'actifs et de métadonnées|
| `AssetDefinition` |Cycle de vie de la définition des actifs, politique et événements de métadonnées|
| `Nft` | NFT événements de cycle de vie et de métadonnées |
| `Rwa` |Événements du cycle de vie des actifs réels|
| `Trigger` |Déclencher les événements de cycle de vie et de métadonnées|
| `Role` |Événements du cycle de vie des rôles|
| `Configuration` |Événements de configuration sur la chaîne|
| `Executor` |événements d'exécution du logiciel|
| `Proof` |Événements du cycle de vie de la vérification des preuves|
| `Confidential` |Événements d'actifs confidentiels|
| `VerifyingKey` |Événements du registre de clés de vérification|
| `RuntimeUpgrade` |événements de mise à niveau de l’environnement d’exécution|
| `Soradns` |Résoudre les événements de gouvernance du répertoire|
| `Sorafs` |SoraFS événements de conformité de la passerelle|
| `SpaceDirectory` |Événements du cycle de vie du manifeste technique du répertoire spatial|
| `Escrow` |Événements du cycle de vie de l'entiercement d'actifs natifs transparents|
| `Offline` |Événements de règlement hors ligne|
| `Oracle` |Événements de flux Oracle|
| `Social` |Événements d'incitation virale|
| `Bridge` |Événements de bridge|
| `Governance` |Événements de gouvernance lorsque la fonctionnalité de gouvernance est activée|

La plupart des filtres concrets permettent également un identifiant de correspondance optionnel et un masque de jeu d'événements. Par exemple, un filtre d'actif peut correspondre à un actif ou à une classe d'événements d'actifs, tandis qu'un filtre de déclencheur peut correspondre à un identifiant de déclencheur et à un ensemble d'événements de déclencheur.

## filtre du pipeline de traitement {#pipeline-filters}

Les filtres de la chaîne de traitement correspondent à des événements de traitement tels que les blocs, les transactions, les fusions et les événements de témoins. Utilisez-les pour les abonnements opérationnels, les tableaux de bord de traitement des blocs et les déclencheurs qui réagissent à l'état de la chaîne de traitement plutôt qu'aux objets de données du registre de la blockchain.

## Déclencheurs de filtres {#trigger-filters}

Les déclencheurs stockent leur condition sous forme de `EventFilterBox`. Une action de déclenchement stocke également :

- un exécutable
- une politique de répétition
- un compte principal d'autorisation
- une politique de nouvelle tentative déclenchée par le temps optionnelle
- métadonnées

Le principal d'autorisation du déclencheur doit avoir les autorisations requises par l'exécutable. Privilégiez les comptes techniques dédiés pour les déclencheurs à longue durée de vie.

## Filtres de requête {#query-filters}

Les filtres de requête sont séparés des filtres d'événement. Les requêtes itérables peuvent exposer le support des prédicats et des sélecteurs. Utilisez des filtres typés spécifiques à la requête du SDK afin que l'entrée du filtre corresponde au type de sortie de la requête.

Voir aussi :

- [Événements](/fr/blockchain/events.md)
- [Compte séquestre d'actifs natifs](/fr/blockchain/escrow.md#queries-and-events)
- [Déclencheurs](/fr/blockchain/triggers.md)
- [Requêtes](/fr/blockchain/queries.md)
- [Référence de requête](/fr/reference/queries.md)
