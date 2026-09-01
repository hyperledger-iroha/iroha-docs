---
translation_locale: fr
translation_source: /guide/configure/modes.md
translation_source_hash: 3f6c2d84c7b6d325d76fb1b1a3ec0efb75381521f7fc69e7924a96532679bc61
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Blockchains publiques et privées {#public-and-private-blockchains}

Iroha peut fonctionner dans une variété de configurations. En tant qu'administrateur de votre propre réseau, vous décidez quel exécuteur et quelle politique de permissions déterminent si une transaction est acceptée.

Les profils courants sont les réseaux privés avec autorisation et les réseaux publics plus ouverts. Les deux sont configurés via l'état de genèse de la blockchain et la politique d'exécution, et non via des binaires de nœud séparés.

Ci-dessous, nous présentons les principales différences entre ces deux cas d'utilisation.

## Autorisations {#permissions}

Dans une blockchain publique, la plupart des comptes ont le même ensemble d'autorisations. Dans une blockchain privée, chaque compte ne reçoit que ses autorisations explicites.

::: info

Référez-vous au [section dédiée aux autorisations](/fr/blockchain/permissions.md) pour plus de détails.

:::

## pairs du réseau {#peers}

Dans une blockchain publique, l'admission des pairs du réseau fait partie de la politique de la chaîne. Pour une blockchain privée, les déploiements fixent généralement l'ensemble des pairs de réseau de confiance dans la configuration et la genèse de la blockchain.

::: info

Référez-vous à [gestion des pairs réseau](peer-management.md) pour plus de détails.

:::

## Enregistrement des comptes {#registering-accounts}

Selon la façon dont vous décidez de configurer votre [bloc de genèse de la blockchain (`genesis.json`)](genesis.md), Le processus d'inscription à un compte peut se dérouler de deux manières. Pour comprendre pourquoi, parlons d'abord de l'autorisation.

L’exécuteur sélectionné définit quelles vérifications de permission s’appliquent. Vous pouvez accorder le [jetons de permission](/fr/blockchain/permissions.md) par défaut dans la genèse de la blockchain pour créer un réseau privé géré par un administrateur ou un réseau plus ouvert. Une fois ces permissions actives, le processus d’enregistrement des comptes est différent.

Les politiques d'enregistrement publiques et privées diffèrent généralement :

- Une politique d'enregistrement public accepte les inscriptions de compte de tout utilisateur éligible[^1]. L'utilisateur a besoin d'un client approprié, d'une clé privée pour un algorithme pris en charge, et d'une demande d'enregistrement acceptée par la politique.

- Une politique d'enregistrement privé peut autoriser un compte ou un contrat intelligent à soumettre des enregistrements. Une politique personnalisée peut limiter l'enregistrement à une fenêtre temporelle. Elle peut également exiger que le soumissionnaire dépense un jeton dont l'offre est fixe car aucun principal d'autorisation n'a la permission d'en émettre davantage.

- Avec le modèle de réseau privé par défaut, un compte existant soumet l'enregistrement pour chaque nouveau compte.

Les validateurs de permissions par défaut couvrent le cas d'utilisation typique des blockchains privées.

::: info

Les modes public et privé sont des choix de politique pour l'exécuteur et la genèse de la blockchain. Les deux utilisent le même binaire de nœud. Passez en revue les autorisations de l'exécuteur et de la genèse de la blockchain sélectionnés avant de lancer un réseau ouvert.

:::

Reportez-vous à la section sur [instructions](/fr/blockchain/instructions.md#un-register) pour plus de détails sur les instructions `Register<Account>`.

[^1]: `Register<Account>` crée l'état du grand livre blockchain pour un `AccountId` canonique et sans domaine ; le routage de domaine et les alias sont gérés séparément.
