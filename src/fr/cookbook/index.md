---
translation_locale: fr
translation_source: /cookbook/index.md
translation_source_hash: aceef9f4e42462614a5cdf41a89f55e26e0399503a48d4b50c08359e7bd7532e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 Manuel de préparation des demandes {#iroha-3-application-cookbook}

Construisez contre Iroha 3 avec de petites recettes vérifiables qui commencent sur le testnet Taira et gardez Minamoto mainnet en lecture seule. Les commandes utilisent le compte actuel I105 IDs, la sélection explicite des frais et le comportement vérifié à Iroha engager [`0010c5a70039eac101a4846499ba9ceaf43eb65c`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c).

Commencez par [Connectez-vous à Taira](./connect-to-taira.md). Il crée la configuration du client et les métadonnées des frais réutilisées par les recettes de ligne de commande. Ne jamais copier un actif des frais ID à partir de cette documentation: tirez-le de la réponse actuelle au robinet Taira.

## Niveaux d'accès {#access-levels}

- Public  Aucune autorisation de signature ou réseau n'est requise.
- L'écriture prête  utilise un compte d'essai Taira financé, un payeur explicite de frais et l'actif de frais courants retourné par le robinet.
- Autorisation requise  Taira doit accorder l'autorisation d'exécution nommée ou l'espace de noms réglementé. Utiliser un réseau local généré lorsque cette subvention n'est pas disponible; le succès local ne confère pas l'autorité Taira.

Aucune recette d'un livre de cuisine n'envoie un message à Minamoto.

## Démarrer et soumettre {#start-and-submit}

|La recette |Taira accès |Ce que vous finirez avec |
| --------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| [Connectez-vous à Taira](./connect-to-taira.md) |Prêt à écrire .|Un souscripteur I105 financé, un actif en direct et une transaction canarienne appliquée |
| [Présentation et vérification des transactions ](./submit-and-verify-transactions.md) |Prêt à écrire .|Une transaction cotée, le résultat du pipeline terminal et un reçu stocké |

## L'état du registre {#ledger-state}

|La recette |Taira accès |Avec quoi vous finirez ?|
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| [Comptes et surnoms ](./accounts-and-aliases.md) |Autorisation requise |Un compte I105 plus un alias réalisable lisible par l' homme |
| [Les actifs fonciers ](./fungible-assets.md) |Autorisation requise |Une définition enregistrée, un solde montré et un transfert vérifié |
| [NFTs](./nfts.md) |Autorisation requise |Une demande enregistrée NFT, de propriété transférée et post-état |
| [Les données métadonnées ](./metadata.md) |Prêt à écrire pour les objets de propriété; autrement, une autorisation est requise |Une écriture de métadonnées suivie d' une lecture exacte |
| [L'état du registre de requête ](./query-ledger-state.md) |Public pour état public |Les résultats pages et filtrés sans écriture |

## Accès et automatisation {#access-and-automation}

|La recette |Taira accès |Avec quoi vous finirez ?|
| --------------------------------------------------- | ------------------- | -------------------------------------------------------------- |
| [Autorisations et rôles](./permissions-and-roles.md) |Autorisation requise |Une autorisation de portée collectée dans un rôle réutilisable |
| [Événements de flux ](./stream-events.md) |Le public |Un consommateur reconnectant SSE qui se réconcilie après une déconnexion |
| [Les déclencheurs ](./triggers.md) |Autorisation requise |Un déclencheur d'appel par défaut, le reçu de l'exécution et l'événement de finalisation |
| [Multisig](./multisig.md)                           |Prêt à écrire .|Un compte pondéré à plusieurs signes et une proposition approuvée par un quorum |

## Modèles d'application {#application-patterns}

|La recette |Taira accès |Avec quoi vous finirez ?|
| --------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Les contrats intelligents ](./smart-contracts.md) |Autorisation requise |Le code octal Kotodama vérifié, les objets de déploiement et un appel contractuel |
| [Connexion de portefeuille ](./wallet-connect.md) |Prêt à écrire lorsque Connect est activé |Un transfert d' actifs approuvé par le portefeuille et un hash de transaction reconcilié |
| [Réservation de fonds propres ](./native-escrow.md)|Prêt à écrire pour les propriétaires d' actifs; la résolution des litiges nécessite une autorisation |Une serrure native ou une caution de marché avec l' état final demandé |

## Surfaces d'exemple vérifiées {#verified-example-surfaces}

Les marques ci-dessous décrivent des exemples exécutables dans chaque recette, et non tous les SDK qui peuvent accéder à la fonctionnalité.

|La recette |HTTP / curl |CLI |Rust |JavaScript |Python |Kotodama |
| --------------------- | :---------: | :-: | :--: | :--------: | :----: | :------: |
|Connectez-vous à Taira |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Envoyer et vérifier |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Comptes et pseudonymes |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Les actifs fonciers |      ✓      |  ✓  |  —   |     ✓      |   —    |    —     |
|NFTs |      ✓      |  ✓  |  —   |     —      |   —    |    ✓     |
|Les métadonnées |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|L' état du registre de requête |      ✓      |  ✓  |  ✓   |     ✓      |   —    |    —     |
|Autorisations et rôles |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Diffusion d' événements |      ✓      |  —  |  —   |     ✓      |   —    |    —     |
|Les déclencheurs |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Multisig |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Contrats intelligents |      —      |  ✓  |  —   |     —      |   —    |    ✓     |
|Connectez le portefeuille |      ✓      |  —  |  ✓   |     ✓      |   —    |    —     |
|Réserve nationale |      —      |  —  |  ✓   |     ✓      |   ✓    |    ✓     |

Chaque recette renvoie à des lignes directrices sur l'architecture de production, les opérations et SDK et API. La recette elle-même montre un chemin de réussite. Il inclut également les contrôles nécessaires pour prouver le résultat.
