---
translation_locale: fr
translation_source: /guide/configure/modes.md
translation_source_hash: 141e640a596b419627c21dd4b22690f6ef97efe6ad2fc21ea5f806d0e262227f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Chaînes de blocs publiques et privées {#public-and-private-blockchains}

Iroha peut être exécuté dans une variété de configurations. En tant qu'administrateur de votre propre réseau, vous décidez quel exécuteur et la politique d'autorisation déterminent si une transaction est acceptée.

Les profils communs sont les réseaux privés autorisés et les réseaux publics plus ouverts.

Ci-dessous, nous présentons les principales différences entre ces deux cas d'utilisation.

## Autorisations {#permissions}

Dans une blockchain publique, la plupart des comptes ont le même ensemble d'autorisations. Dans une blockchain privée, la majorité des comptes sont supposés ne pas être en mesure de faire quoi que ce soit en dehors de l'autorité qui leur a été accordée à moins qu'une autorisation spécifique ne soit explicitement accordée.

::: informations

Pour plus de détails, consultez la section [ dédiée aux autorisations ](/fr/blockchain/permissions.md).

:::

## Les pairs {#peers}

Dans une blockchain publique, l'admission de pairs fait partie de la politique de chaîne. Pour une blockchain privée, les déploiements fixent généralement le groupe de confiance dans la configuration et la génèse.

::: informations

Pour plus de détails, consultez [ gestion par les pairs ](peer-management.md).

:::

## Comptes d'enregistrement {#registering-accounts}

En fonction de la façon dont vous décidez d'établir votre [le bloc de la génèse (`genesis.json`)](genesis.md), Le processus d'enregistrement d'un compte peut se dérouler de deux manières.

L'exécuteur sélectionné définit quelles vérifications d'autorisation s'appliquent. Vous pouvez accorder les jetons de permission par défaut [ ](/fr/blockchain/permissions.md) dans la génèse pour façonner un réseau privé, géré par l'administrateur ou un réseau plus ouvert. Une fois que ces autorisations sont activées, le processus d'enregistrement des comptes est différent.

En ce qui concerne l'enregistrement de comptes, la blockchain publique et privée présentent les différences suivantes:

- Donc, en théorie, tout ce dont vous avez besoin est d'un client approprié, un moyen de générer une clé privée pour un algorithme pris en charge et une politique d'autorisation qui accepte l'inscription.

- Dans une blockchain privée, vous pouvez avoir n'importe quel processus pour créer un compte: il peut s'agir que les instructions d'enregistrement doivent être soumises par un compte spécifique ou par un contrat intelligent qui demande d'autres détails. Il se peut que dans une blockchain privée, l'enregistrement de nouveaux comptes ne soit possible qu'à des dates spécifiques ou limité par un jeton non mintable (finit).

- Dans une blockchain privée typique, c'est-à-dire une blockchain sans aucun processus unique pour enregistrer des comptes, vous avez besoin d'un compte pour enregistrer un autre compte.

Les validateurs d'autorisation par défaut couvrent le cas d'utilisation typique de blockchain privée.

::: informations

Les modes public et privé sont des profils de politique plutôt que des binaires de nœuds distincts.

:::

Pour plus de détails sur les instructions `Register<Account>`, consultez la section relative aux instructions [](/fr/blockchain/instructions.md#un-register).

[^1]: `Register<Account>` crée l'état du registre pour un canonique, sans domaine `AccountId`; le routage de domaine et les aliases sont gérés séparément.
