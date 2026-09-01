---
translation_locale: fr
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Développement d'applications {#application-development}

Les applications Iroha devraient rendre le comportement des transactions explicite, garder l'état de la signature contenu, et utiliser les requêtes et les événements de manière à ce qu'ils soient faciles à observer en production.

## Configuration du client {#client-setup}

- Stockez la configuration du client en dehors du code source de l'application. Chargez l'ID de la chaîne, Torii URL, le compte de signature et les paramètres de transaction à partir de la configuration spécifique à l'environnement.
- Conservez les fichiers `client.toml` séparés pour le réseau local, Taira, Minamoto et les réseaux privés. Un signataire cryptographique de testnet copié ne doit jamais devenir un signataire cryptographique de mainnet.
- Définissez délibérément la durée de vie des transactions et les délais d'expiration des statuts. Une durée de vie très courte peut expirer en cas de variations normales du réseau, tandis qu'une durée très longue peut rendre les soumissions en double plus difficiles à gérer.
- Utilisez `nonce = true` uniquement lorsque les transactions répétées doivent avoir des hachages cryptographiques distincts. Pour les opérations commerciales idempotentes, enregistrez et réutilisez un identifiant de demande d'application afin que les réessais soient traçables.

Voir [Configuration du client](/fr/guide/configure/client-configuration.md) pour les champs actuels TOML.

## Transactions {#transactions}

- Construisez des transactions à partir d'instructions typées SDK lorsque cela est possible, plutôt qu'à partir de charges utiles brutes JSON ou assemblées en chaîne de caractères.
- Les écritures importantes en prévalidation avec des requêtes en lecture seule : existence du compte, soldes des actifs, état des permissions, disponibilité des actifs pour les frais et état de l'objet cible.
- Enregistrez le hachage cryptographique de la transaction, le compte principal d'autorisation, le résumé de l'instruction et le changement d'état attendu avant de soumettre.
- Traitez `Rejected`, `Expired` et les résultats de délai d'attente différemment. Un délai d'attente signifie que le client n'a pas observé de statut final ; cela ne prouve pas que le réseau a ignoré la transaction.
- Après une écriture réussie, vérifiez l'état résultant avec une requête ou un point de contrôle d'événement qui correspond à l'opération commerciale.

Pour la mécanique des transactions, voir [Transactions](/fr/blockchain/transactions.md).

## Requêtes et événements {#queries-and-events}

- Utilisez des requêtes pour l'état actuel et des flux d'événements pour les notifications de changement. Évitez de remplacer la gestion des événements par des requêtes larges répétées.
- Paginer des requêtes itérables larges telles que les listes de comptes, d'actifs et de blocs.
- Privilégiez les filtres étroits pour les abonnements et les déclencheurs. Les filtres larges sont utiles pour le diagnostic mais peuvent ajouter une exécution et un traitement côté client inutiles.
- Gardez les vérifications de fumée en lecture seule séparées des tests de transaction signés afin qu'il soit plus facile de diagnostiquer la disponibilité du point de terminaison API.

Voir [Requêtes](/fr/blockchain/queries.md), [Événements](/fr/blockchain/events.md), et [Filtres](/fr/blockchain/filters.md).

## Développement assisté par agent {#agent-assisted-development}

- Laissez les agents inspecter les documents, le code SDK et l'état du réseau en lecture seule avant de leur demander d'écrire du code de transaction.
- Maintenez les tests en réseau en direct sur option derrière un indicateur d'environnement tel que `TAIRA_LIVE=1`.
- Ne collez pas de clés privées, de matériel de récupération de compte, de jetons API ou d'en-têtes d'authentification transférés dans les invites.
- Exiger un plan de transaction avant qu'un agent ne soumette une transaction sur le testnet en direct. Le plan doit indiquer le réseau, le principal d'autorisation, les instructions, l'actif de frais, les lectures préalables, le résultat attendu et le comportement en cas de nouvelle tentative.

Pour le flux de travail Taira MCP, voir [Construire sur SORA 3 : Taira et Minamoto](/fr/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK Hygiène {#sdk-hygiene}

- Épingler les versions SDK et binaires ensemble en utilisant le [Matrice de compatibilité](/fr/reference/compatibility-matrix.md).
- Maintenez le code client généré, les extraits et les exemples synchronisés avec la révision du workspace en amont épinglée.
- Ajoutez des tests unitaires pour le code de création de transactions et des tests d'intégration pour les plus petits chemins de lecture et d'écriture dont votre application dépend.
