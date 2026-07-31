---
translation_locale: fr
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les déclencheurs {#triggers}

Les déclencheurs lient un filtre d'événement à une action exécutable.
le filtre du déclencheur, Iroha évalue l'action déclenchante dans le cadre du bloc
l'exécution.

## La structure {#structure}

Un enregistré `Trigger` contient:

- `id`: à la `TriggerId` l'emballage d'une `Name`
- `action`: la politique d'exécution, l'autorité, le filtre, la politique de répétition, la politique des essais répétés;
  et métadonnées

L'action contient:

- `executable`: `Instructions`, `ContractCall`, `Ivm`, ou `IvmProved`
- `repeats`: `Indefinitely` ou `Exactly(n)`
- `authority`: le compte qui invoque l'exécutable
- `filter`: une `EventFilterBox`
- `retry_policy`: comportement de réessayer facultatif pour les déclencheurs horaires programmés
- `metadata`: métadonnées de déclencheurs arbitraires

## Filtres d'événements {#event-filters}

Les conditions de déclenchement utilisent le même modèle de filtrage d'événements que les abonnements.
le filtre d'événements de premier niveau peut correspondre à:

- événements du pipeline
- événements de données
- événements dans le temps
- déclencher des événements d'exécution
- déclenche des événements de finalisation

Préférer le filtre le plus étroit qui correspond au flux de travail.
pour le diagnostic, mais ils augmentent le travail pendant l'exécution de bloc.

Vous voyez ? [Filtres](/fr/blockchain/filters.md) pour les familles de filtres actuelles.

## Les déclencheurs du temps {#time-triggers}

Les déclencheurs de temps utilisent un filtre d'événements temporels.
condition de correspondance du temps, Iroha exécute l'action de déclenchement sous le déclencheur
Les déclencheurs de temps sont le type de déclencheur qui peut utiliser la politique de réessayer
décrits ci-dessous.

## Répétition {#repetition}

`Repeats::Indefinitely` maintient un déclencheur actif jusqu'à ce qu'il ne soit pas enregistré.

`Repeats::Exactly(n)` permet au déclencheur de tirer un nombre fixe de fois.
le compte est épuisé, enregistrer une nouvelle déclencheur si le même comportement est nécessaire
Je le répète.

## Autorités et autorisations {#authority-and-permissions}

L'autorité de déclenchement est le compte utilisé pour invoquer l'exécutable.
compte technique dédié pour les déclencheurs de longue durée afin que les autorisations requises soient
sont explicites et isolées du compte personnel d'un opérateur.

L'autorité a besoin des autorisations requises par les instructions exécutables ou
Le compte qui enregistre le déclencheur a également besoin d'une autorisation
enregistrer les déclencheurs sous le validateur d'exécution actif.

## Politique de retrait {#retry-policy}

Les déclencheurs de temps peuvent opter pour une politique de réessayer.

- `max_retries`: Combien de tentatives de réessayer sont autorisées après un échec initial
  le tir
- `retry_after_ms`: combien de temps Iroha attend avant qu'une nouvelle tentative ne soit admissible

Lorsque le budget de la nouvelle tentative est épuisé, le déclencheur est non enregistré.

## Les questions {#queries}

Utilisez les requêtes de déclenchement actuelles pour vérifier l' état du déclencheur:

- [`FindTriggers`](/fr/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/fr/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/fr/reference/queries.md#triggers-contracts-transactions-and-blocks)

Voir aussi:

- [Exemple de déclencheur d'événement](/fr/blockchain/trigger-examples.md)
- [Les événements](/fr/blockchain/events.md)
- [Instructions](/fr/blockchain/instructions.md)
- [Autorisations](/fr/blockchain/permissions.md)
