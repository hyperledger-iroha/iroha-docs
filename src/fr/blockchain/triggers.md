---
translation_locale: fr
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Déclencheurs {#triggers}

Les déclencheurs lient un filtre d'événement à une action exécutable. Lorsqu'un événement correspond au filtre du déclencheur, Iroha évalue l'action du déclencheur dans le cadre de l'exécution du bloc.

## Structure {#structure}

Un `Trigger` enregistré contient :

- `id` : un `TriggerId` encapsulant un `Name`
- `action` : l’exécutable, le principal d’autorisation, le filtre, la politique de répétition, la politique de réessai et les métadonnées

L'action contient :

- `executable` : `Instructions`, `ContractCall`, `Ivm` ou `IvmProved`
- `repeats` : `Indefinitely` ou `Exactly(n)`
- `authority` : le compte qui invoque l’exécutable
- `filter` : un `EventFilterBox`
- `retry_policy` : comportement de nouvelle tentative facultatif pour les déclencheurs à heure programmée
- `metadata` : métadonnées de déclenchement arbitraires

## Filtres d'événements {#event-filters}

Les conditions de déclenchement utilisent le même modèle de filtrage d'événements que les abonnements. Le filtre d'événements de niveau supérieur peut correspondre à :

- traitement des événements de la chaîne de traitement
- événements de données
- événements temporels
- déclencher des événements d'exécution
- déclencher des événements de complétion

Privilégiez le filtre le plus étroit qui correspond au flux de travail. Les filtres larges sont utiles pour le diagnostic, mais ils augmentent le travail pendant l'exécution du bloc.

Voir [Filtres](/fr/blockchain/filters.md) pour les familles de filtres actuelles.

## Déclencheurs temporels {#time-triggers}

Les déclencheurs temporels utilisent un filtre d'événement temporel. Lorsque la vue de l'état du monde atteint une condition temporelle correspondante, Iroha exécute l'action de déclenchement sous le principal d'autorisation du déclencheur. Les déclencheurs temporels sont le type de déclencheur qui peut utiliser la politique de réessai décrite ci-dessous.

## Répétition {#repetition}

`Repeats::Indefinitely` maintient un déclencheur actif jusqu'à ce qu'il soit désenregistré.

`Repeats::Exactly(n)` permet au déclencheur de se déclencher un nombre fixe de fois. Lorsque le compteur est épuisé, enregistrez un nouveau déclencheur si le même comportement est de nouveau nécessaire.

## autorisations principales et permissions {#authority-and-permissions}

Le principal d'autorisation de déclenchement est le compte utilisé pour appeler l'exécutable. Utilisez un compte technique dédié pour les déclencheurs de longue durée afin que les autorisations requises soient explicites et isolées du compte personnel d'un opérateur.

Le principal d'autorisation a besoin des autorisations requises par les instructions exécutables ou l'appel de contrat. Le compte enregistrant le déclencheur a également besoin de l'autorisation pour enregistrer des déclencheurs sous le validateur d'exécution logicielle actif.

## Politique de réessai {#retry-policy}

Les déclencheurs temporels peuvent opter pour une stratégie de nouvelle tentative. Une stratégie de nouvelle tentative définit :

- `max_retries` : combien de tentatives de nouvelle exécution sont autorisées après un échec initial
- `retry_after_ms` : combien de temps Iroha attend avant qu'une nouvelle tentative devienne éligible

Lorsque le budget de nouvelle tentative est épuisé, le déclencheur est désenregistré.

## Requêtes {#queries}

Utilisez les requêtes de déclenchement actuelles pour inspecter l'état du déclencheur :

- [`FindTriggers`](/fr/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/fr/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/fr/reference/queries.md#triggers-contracts-transactions-and-blocks)

Voir aussi :

- [Exemple de déclencheur d'événement](/fr/blockchain/trigger-examples.md)
- [Événements](/fr/blockchain/events.md)
- [Instructions](/fr/blockchain/instructions.md)
- [Autorisations](/fr/blockchain/permissions.md)
