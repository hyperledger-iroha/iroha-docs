---
translation_locale: fr
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les déclencheurs {#triggers}

Les déclencheurs lient un filtre d'événement à une action exécutable. Lorsqu'un événement correspond au filtre du déclencheur, Iroha évalue l'action de déclenchement dans le cadre de l'exécution du bloc.

## La structure {#structure}

Un `Trigger` enregistré contient:

- `id`: un `TriggerId` enveloppant une `Name`
- `action`: l'exécutable, l'autorité, le filtre, la politique de répétition, la politique des retries et les métadonnées.

L'action comprend les éléments suivants:

- `executable`: `Instructions`, `ContractCall`, `Ivm` ou `IvmProved`
- `repeats`: `Indefinitely` ou `Exactly(n)`
- `authority`: le compte qui fait appel à l'exécutable
- `filter`: une `EventFilterBox`
- `retry_policy`: comportement de réessayer facultatif pour les déclencheurs horaires programmés
- `metadata`: métadonnées de déclencheur arbitraire

## Filtres d'événements {#event-filters}

Les conditions de déclenchement utilisent le même modèle d'événements-filtre que les abonnements.

- événements du pipeline
- événements de données
- événements dans le temps
- déclenche des événements d'exécution
- déclenche des événements de finalisation

Les filtres larges sont utiles pour le diagnostic, mais ils augmentent le travail lors de l'exécution du bloc.

Voir [Filtres ](/fr/blockchain/filters.md) pour les familles de filtres actuelles.

## Les déclencheurs du temps {#time-triggers}

Les déclencheurs horaires utilisent un filtre d'événements horaires. Lorsque la vue de l'état du monde atteint une condition de temps correspondante, Iroha exécute l'action déclenchante sous l'autorité de déclenchement. Les déclenchants horaires sont le type de déclencheur qui peut utiliser la politique de retrait décrite ci-dessous.

## Répétition {#repetition}

`Repeats::Indefinitely` maintient un déclencheur actif jusqu'à ce qu'il ne soit pas enregistré.

`Repeats::Exactly(n)` permet au déclencheur de tirer un nombre fixe de fois. Lorsque le compte est épuisé, enregistrer un nouveau déclencheurs si le même comportement est nécessaire à nouveau.

## Autorités et autorisations {#authority-and-permissions}

L'autorité de déclenchement est le compte utilisé pour invoquer l'exécutable.Utilisez un compte technique dédié pour les déclencheurs à long terme afin que les autorisations requises soient explicites et isolées du compte personnel d'un opérateur.

L'autorité a besoin des autorisations requises par les instructions exécutables ou l'appel de contrat.Le compte qui enregistre le déclencheur a également besoin d'une autorisation pour enregistrer les déclencheurs sous le validateur active du temps de fonctionnement.

## Politique de retrait {#retry-policy}

Les déclencheurs de temps peuvent opter pour une politique de réessayer.

- `max_retries`: le nombre de tentatives de reprise autorisées après un tir initialement raté
- `retry_after_ms`: combien de temps Iroha attend une nouvelle tentative avant d'être admissible?

Lorsque le budget de la nouvelle tentative est épuisé, le déclencheur n'est pas enregistré.

## Questions posées {#queries}

Utilisez les requêtes de déclenchement actuelles pour vérifier l' état du déclencheur:

- [`FindTriggers`](/fr/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/fr/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/fr/reference/queries.md#triggers-contracts-transactions-and-blocks)

Voir aussi:

- [Exemple de déclencheur d'événement](/fr/blockchain/trigger-examples.md)
- [Les événements](/fr/blockchain/events.md)
- [Instructions ](/fr/blockchain/instructions.md)
- [Autorisations ](/fr/blockchain/permissions.md)
