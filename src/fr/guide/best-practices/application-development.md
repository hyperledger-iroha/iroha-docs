---
translation_locale: fr
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Développement de l'application {#application-development}

Les applications Iroha devraient rendre explicite le comportement des transactions, conserver l'état de signature contenu et utiliser les requêtes et événements d'une manière qui soit facile à observer en production.

## Configuration du client {#client-setup}

- Conserver la configuration du client en dehors du code source de l'application. Charger la chaîne ID, Torii URL, le compte de signature et les paramètres de transaction à partir de la configuration spécifique à l'environnement.
- Je le garde. `client.toml` des fichiers séparés pour localnet, Taira, Minamoto, Une signature de testnet copiée ne devrait jamais devenir une signature de mainnet.
- Définir délibérément les durées de vie des transactions et les temps d'arrêt du statut. Une durée de vie très courte peut expirer sous le nerfage normal du réseau, tandis qu'une période très longue peut rendre les répétitions plus difficiles à raisonner sur.
- Utilisez `nonce = true` uniquement lorsque les transactions répétées doivent avoir des hachages distincts. Pour les opérations commerciales idempotentes, stocker et réutiliser une demande d'application ID afin que les retries soient traçables.

Voir [Configuration du client](/fr/guide/configure/client-configuration.md) pour les champs TOML en cours.

## Transactions {#transactions}

- Construire des transactions à partir d'instructions typées SDK si possible, au lieu de charges utiles brutes JSON ou assemblées par chaîne.
- Preflight important écrit avec des requêtes à lire uniquement: existence du compte, solde d'actifs, état de permission, disponibilité des actifs de frais et état de l'objet cible.
- Enregistrer le hash de la transaction, le compte d'autorité, le résumé des instructions et les changements d'état escomptés avant de soumettre.
- Traiter `Rejected`, `Expired`, et les résultats du délai sont différents. Un délai signifie que le client n'a pas observé un statut final; cela ne prouve pas que le réseau a ignoré la transaction.
- Après une rédaction réussie, vérifiez l'état résultant avec un point de contrôle de requête ou d'événement qui correspond à l'opération d'entreprise.

Pour les mécanismes de transaction, voir [Transactions ](/fr/blockchain/transactions.md).

## Des questions et des événements {#queries-and-events}

- Utilisez des requêtes pour les flux d'état et d'événements actuels pour les notifications de changement. Évitez de remplacer le traitement des événements par des requêtes larges répétées.
- Paginez des requêtes récurrentes larges telles que les listes de comptes, d'actifs et de blocs.
- Les filtres larges sont utiles pour le diagnostic, mais peuvent ajouter des exécutions inutiles et un traitement côté client.
- Gardez les contrôles de fumée à lecture seule séparés des tests de transaction signés afin que la disponibilité du point d'extrémité soit plus facile à diagnostiquer.

Voir [Questions](/fr/blockchain/queries.md), [Événements](/fr/blockchain/events.md) et [Filtres ](/fr/blockchain/filters.md).

## Développement assisté par l'agent {#agent-assisted-development}

- Laissez les agents inspecter les documents, le code SDK et l'état du réseau en lecture seule avant de leur demander d'écrire le code de transaction.
- Veillez à ce que les tests de réseau en direct permettent d'opter pour un indicateur d'environnement tel que `TAIRA_LIVE=1`.
- Ne pas coller les clés privées, le matériel de récupération des comptes, les jetons API ou les en-têtes d'auteurs transférés dans les instructions.
- Exiger un plan de transaction avant que n'importe quel agent ne soumette une transaction testnet en direct. Le plan doit nommer le réseau, l'autorité, les instructions, l'actif des frais, les lectures pré-vol, le résultat attendu et le comportement de réessay.

Pour le flux de travail Taira MCP voir [Construire sur SORA 3: Taira et Minamoto](/fr/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK L'hygiène {#sdk-hygiene}

- Pin SDK et les versions binaires ensemble à l'aide de la matrice de compatibilité [ ](/fr/reference/compatibility-matrix.md).
- Gardez le code client généré, les extraits et les exemples synchronisés avec la révision de l'espace de travail en amont fixée.
- Ajoutez des tests unitaires pour le code de construction de transactions et des tests d'intégration pour les plus petits chemins de lecture et d'écriture dont dépend votre application.
