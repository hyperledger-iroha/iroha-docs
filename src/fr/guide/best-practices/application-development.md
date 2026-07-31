---
translation_locale: fr
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Développement des applications {#application-development}

Iroha les applications doivent rendre explicite le comportement des transactions, continuer à signer
l'état contenu, et utiliser des requêtes et des événements de manière à
observe dans la production.

## Configuration du client {#client-setup}

- Conserver la configuration du client en dehors du code source de l'application.
  chaîne ID, Torii URL, compte de signature, et les paramètres des transactions à partir
  configuration environnementale spécifique.
- Restez `client.toml` des fichiers séparés pour localnet, Taira, Minamoto, et
  Un signataire de réseau test copié ne devrait jamais devenir un réseau principal
  Le signataire.
- Définir délibérément les durées de vie des transactions et les temps d'arrêt du statut.
  la durée de vie peut expirer sous tension réseau normale, alors qu'une très longue
  les réponses peuvent rendre plus difficiles à raisonner.
- Utilisation `nonce = true` uniquement lorsque les transactions répétées doivent avoir des caractéristiques distinctes
  Pour des opérations commerciales non-propriétaires, stocker et réutiliser un
  demande de candidature ID les retentissements sont donc traçables.

Vous voyez ? [Configuration du client](/fr/guide/configure/client-configuration.md) pour
le courant TOML les champs.

## Transactions {#transactions}

- Construire des transactions à partir de SDK les instructions, le cas échéant au lieu de
  à l'origine JSON ou des charges utiles assemblées à cordes.
- Preflight important écrit avec des requêtes de lecture seulement: existence du compte,
  les soldes d'actifs, l'état des autorisations, la disponibilité des actifs de redevances et le cible
  état de l'objet.
- Enregistrer le hash de la transaction, le compte d'autorité, le résumé des instructions et
  changement d'état attendu avant le dépôt.
- Le traitement `Rejected`, `Expired`, et les résultats de la pause sont différents.
  signifie que le client n'a pas observé un statut final; il ne prouve pas que
  Le réseau a ignoré la transaction.
- Après une écriture réussie, vérifiez l'état résultant avec une requête ou
  point de contrôle d'événement correspondant à l'exploitation des activités.

Pour la mécanique des transactions, voir [Transactions](/fr/blockchain/transactions.md).

## Questions et événements {#queries-and-events}

- Utilisez des requêtes pour les flux d'état et d'événements actuels pour les notifications de changement.
  Évitez de remplacer le traitement des événements par des questions générales répétées.
- Paginer des requêtes récurrentes larges telles que le compte, l'actif et le bloc
  les listes.
- Pour les abonnements et déclencheurs, on préfère des filtres étroits.
  utile pour le diagnostic mais peut ajouter une exécution inutile et côté client
  le traitement.
- Gardez les contrôles de fumée à lecture seule séparés des tests de transaction signés
  la disponibilité des points d'extrémité est plus facile à diagnostiquer.

Vous voyez ? [Les questions](/fr/blockchain/queries.md), [Les événements](/fr/blockchain/events.md), et
[Filtres](/fr/blockchain/filters.md).

## Développement assisté par l'agent {#agent-assisted-development}

- Laissez les agents inspecter les médecins, SDK code, et l'état de réseau uniquement lu avant
  leur demander d'écrire le code de transaction.
- Garder des tests en direct sur le réseau, opt-in derrière un drapeau d'environnement tel que
  `TAIRA_LIVE=1`.
- Ne pas coller les clés privées, le matériel de récupération des comptes, API des jetons, ou
  Les titres d'auteurs ont été transférés dans les instructions.
- Exiger un plan de transaction avant que tout agent ne soumette un testnet live
  Le plan devrait nommer le réseau, l'autorité, les instructions,
  les résultats attendus et le comportement des essais de reprise.

Pour le Taira MCP flux de travail voir
[On s'en remet SORA 3: Taira et Minamoto](/fr/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK L'hygiène {#sdk-hygiene}

- Pignons SDK et des versions binaires ensemble en utilisant le
  [Matrice de compatibilité](/fr/reference/compatibility-matrix.md).
- Gardez le code client généré, les extraits et les exemples synchronisés avec le
  révision de l'espace de travail en amont.
- Ajouter des tests unitaires pour le code de construction des transactions et des tests d'intégration pour
  les plus petits chemins de lecture et d'écriture dont dépend votre demande.
