---
translation_locale: fr
translation_source: /guide/configure/modes.md
translation_source_hash: 3f6c2d84c7b6d325d76fb1b1a3ec0efb75381521f7fc69e7924a96532679bc61
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Chaînes de blocs publiques et privées {#public-and-private-blockchains}

Iroha peut être exécuté dans une variété de configurations. En tant qu'administrateur de votre propre réseau, vous décidez quel exécuteur et la politique d'autorisation déterminent si une transaction est acceptée.

Les profils communs sont les réseaux privés autorisés et les réseaux publics plus ouverts. Les deux sont configurés par l'état de génèse et la politique d'exécuteur, pas par des binaires de nœuds séparés.

Ci-dessous, nous présentons les principales différences entre ces deux cas d'utilisation.

## Autorisations {#permissions}

Dans une blockchain publique, la plupart des comptes ont le même ensemble de permissions. Dans une blockchain privée, chaque compte ne reçoit que ses autorisations explicites.

::: info

Pour plus de détails, consultez la section consacrée à [ sur les autorisations ](/fr/blockchain/permissions.md).

:::

## Les pairs {#peers}

Dans une blockchain publique, l'admission de pairs fait partie de la politique de chaîne. Pour une blockchain privée, les déploiements fixent généralement le groupe de confiance dans la configuration et la génèse.

::: info

Pour plus de détails, consultez [ gestion par les pairs ](peer-management.md).

:::

## Comptes d'enregistrement {#registering-accounts}

Selon la façon dont vous décidez de configurer votre bloc génétique [ (`genesis.json`) ](genesis.md), le processus d'enregistrement d'un compte peut se dérouler de deux façons. Pour comprendre pourquoi, parlons d'abord des permissions.

L'exécuteur sélectionné définit quelles vérifications d'autorisation s'appliquent. Vous pouvez accorder les jetons de permission par défaut [ ](/fr/blockchain/permissions.md) dans la génèse pour façonner un réseau privé, géré par l'administrateur ou un réseau plus ouvert. Une fois que ces autorisations sont activées, le processus d'enregistrement des comptes est différent.

Les politiques d'enregistrement publiques et privées diffèrent généralement:

- Une politique d'enregistrement public accepte les enregistrements de compte de tout utilisateur admissible [^1]. L'utilisateur a besoin d'un client approprié, d'une clé privée pour un algorithme pris en charge et d'une demande d'inscription acceptée par la politique.

- Une politique d'enregistrement privé peut autoriser un compte ou un contrat intelligent à soumettre des enregistrements. Une politique personnalisée peut limiter l'enregistrement à une fenêtre de temps. Il peut également exiger que le soumissionnaire dépense un jeton dont l'offre est fixe car aucune autorité n'a l'autorisation de faire plus.

- Avec le modèle par défaut du réseau privé, un compte existant soumet l'enregistrement de chaque nouveau compte.

Les validateurs d'autorisation par défaut couvrent le cas d'utilisation typique de blockchain privée.

::: info

Les modes publics et privés sont des choix d'exécution et de politique génétique. Les deux utilisent le même nœud binaire. Examinez les autorisations d'exécution et de génèse sélectionnées avant d'exécuter un réseau ouvert.

:::

Pour plus de détails sur les instructions `Register<Account>`, consultez la section relative aux instructions [](/fr/blockchain/instructions.md#un-register).

[^1]: `Register<Account>` crée l'état du registre pour un canonique, sans domaine `AccountId`; le routage de domaine et les aliases sont gérés séparément.
