---
translation_locale: fr
translation_source: /cookbook/index.md
translation_source_hash: 58f5247ece30d3755c38d4d24ae4553a35e0d0437476092d568a1be5c8a2ed28
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3 Livre de recettes de l'application {#iroha-3-application-cookbook}

Construire contre Iroha 3 avec de petites recettes vérifiables qui commencent sur le Taira réseau de test et conserver Minamoto lecture seule du réseau principal. Chaque recette indique si elle est une lecture publique, une écriture de compte financé normale, ou une opération avec autorisation restreinte. Les commandes utilisent le courant I105 identifiants de compte, sélection explicite des frais et le comportement vérifié lors de l'enregistrement Iroha commettre [`0010c5a70039eac101a4846499ba9ceaf43eb65c`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c).

Commencez avec [Connectez-vous à Taira](./connect-to-taira.md). Il crée la configuration client et les métadonnées de frais réutilisées par les recettes en ligne de commande. Ne copiez jamais un ID d'actif de frais depuis cette documentation : dérivez-le à partir de la réponse du service de financement du testnet Taira actuel.

## Niveaux d'accès {#access-levels}

- Public — aucun signataire cryptographique ni permission réseau n'est requis.
- Prêt à écrire — utilisez un compte de test financé Taira, un payeur de frais explicite et l’actif de frais actuel retourné par le service de financement du testnet.
- Permission requise — Taira doit accorder à l'exécution du logiciel nommé la permission ou l'espace de noms gouverné. Utilisez un réseau local généré lorsque cette autorisation n'est pas disponible ; le succès local ne confère pas le principal d'autorisation Taira.

Aucune recette de livre de cuisine n'envoie d'écriture à Minamoto.

## Commencer et soumettre {#start-and-submit}

|Recette|Taira accès|Avec quoi vous terminez|
| --------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| [Connectez-vous à Taira](./connect-to-taira.md)                             |Prêt à écrire|Un signataire cryptographique financé I105, un actif de frais en direct, et une transaction canari appliquée|
| [Soumettre et vérifier les transactions](./submit-and-verify-transactions.md) |Prêt à écrire|Une transaction avec devis, le résultat terminal du pipeline et un reçu stocké|

## état du grand livre blockchain {#ledger-state}

|Recette| Taira accès|Avec quoi vous finissez|
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| [Comptes et pseudonymes](./accounts-and-aliases.md) |Permission requise|Un compte I105 plus un alias lisible par l'homme résoluble|
| [Actifs fongibles](./fungible-assets.md)           |Permission requise|Une définition enregistrée, un solde émis et un transfert vérifié|
| [NFTs](./nfts.md)                                 |Permission requise|Un NFT enregistré, propriété transférée, et requête après état|
| [Métadonnées](./metadata.md)                         |Prêt à écrire pour les objets possédés ; permission requise autrement|Une écriture de métadonnées suivie d'une lecture exacte|
| [Interroger l'état du grand livre blockchain](./query-ledger-state.md)     |Public pour l'état public|Résultats paginés et filtrés sans écriture|

## Accès et automatisation {#access-and-automation}

|Recette| Taira accéder        |Avec quoi vous terminez|
| --------------------------------------------------- | ------------------- | -------------------------------------------------------------- |
| [Autorisations et rôles](./permissions-and-roles.md) |Autorisation requise|Une autorisation ciblée collectée dans un rôle réutilisable|
| [Événements de streaming](./stream-events.md)                 |publique|Un consommateur SSE se reconnectant qui se réconcilie après une déconnexion|
| [Déclencheurs](./triggers.md)                           |Autorisation requise|Un déclencheur par appel, enregistrement du résultat du protocole d'exécution, et événement de complétion|
| [Multisig](./multisig.md)                           |Prêt à écrire|Un compte multisignature pondéré et une proposition approuvée par le quorum|

## Modèles d'application {#application-patterns}

|Recette| Taira accès|Avec quoi vous terminez|
| --------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Contrats intelligents](./smart-contracts.md) |Permission requise|Vérifié le bytecode Kotodama, les artefacts de déploiement et un appel de contrat|
| [Wallet Connect](./wallet-connect.md)   |Prêt à écrire lorsque Connect est activé|Un transfert d'actifs approuvé par le portefeuille et un hachage cryptographique de transaction rapproché|
| [Escrow natif](./native-escrow.md)     |Prêt à l'emploi pour les propriétaires d'actifs ; la résolution des différends nécessite une autorisation|Un verrouillage natif ou séquestre de marché avec état final interrogé|

## Exemples de surfaces vérifiées {#verified-example-surfaces}

Les marques ci-dessous décrivent des exemples exécutables dans chaque recette, et non chaque SDK pouvant accéder à la fonctionnalité.

|Recette| HTTP / curl | CLI | Rust | JavaScript | Python | Kotodama |
| --------------------- | :---------: | :-: | :--: | :--------: | :----: | :------: |
|Se connecter à Taira|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Soumettre et vérifier|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Comptes et alias|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Actifs fongibles|      ✓      |  ✓  |  —   |     ✓      |   —    |    —     |
| NFTs                  |      ✓      |  ✓  |  —   |     —      |   —    |    ✓     |
|Métadonnées|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Interroger l'état du registre blockchain|      ✓      |  ✓  |  ✓   |     ✓      |   —    |    —     |
|Autorisations et rôles|      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Diffuser des événements|      ✓      |  —  |  —   |     ✓      |   —    |    —     |
|Déclencheurs|      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Multisig|      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Contrats intelligents|      —      |  ✓  |  —   |     —      |   —    |    ✓     |
|Connexion portefeuille|      ✓      |  —  |  ✓   |     ✓      |   —    |    —     |
|Séquestre natif|      —      |  —  |  ✓   |     ✓      |   ✓    |    ✓     |

Chaque recette est reliée à l'architecture de production, aux opérations, aux directives SDK et API. La recette elle-même montre un chemin réussi. Elle inclut également les vérifications nécessaires pour prouver le résultat.
