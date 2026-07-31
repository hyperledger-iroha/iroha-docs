---
translation_locale: fr
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 1f316d6a823b23e821d80fe8773df7469358b0e01057f9b76b113cafe4818f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# La libération est prête {#release-readiness}

Avant de promouvoir une application ou un changement de réseau Iroha, prouver le comportement dans le moindre environnement susceptible d'exposer le risque pertinent, puis passer délibérément à travers les réseaux de test partagés et les portes de production.

## Porte de réseau local {#localnet-gate}

- Lancer un réseau local jetable avec la même piste Iroha et le nombre de validateurs pratiques le plus proche.
- Exécutez des tests d'unité pour les constructeurs de transactions, l'analyse des requêtes, la gestion du rejet et le chargement de configuration.
- Exercez les plus petits chemins de lecture et d'écriture réussis à travers la même forme SDK ou CLI que l'application utilisera plus tard.
- Capture des hashes de transaction attendus, des statuts, des événements et des lectures d'état dans les objets de test.

Voir [Le lancement de Iroha 3](/fr/get-started/launch-iroha.md) et [SDK Les tutoriels ](/fr/guide/tutorials/).

## Porte de réseau partagé {#shared-testnet-gate}

- Utilisez Taira ou un autre réseau de test partagé pour le comportement, les frais, le financement du compte, la latence et les répétitions opérationnelles des terminaux.
- Keep live testnet écrit opt-in de sorte que les essais ordinaires ne dépendent pas de la disponibilité du réseau ou dépensent des fonds testnet.
- Vérifiez le financement du signataire, les métadonnées des actifs des frais, les autorisations de l'autorité et l'état attendu avant de soumettre chaque transaction d'essai en direct.
- Attendez un état terminal, puis vérifiez l'état résultant avec une requête en lecture seulement.

Voir [Construire sur SORA 3: Taira et Minamoto ](/fr/get-started/sora-nexus-dataspaces.md).

## Réseau principal ou porte de production {#mainnet-or-production-gate}

- Utilisez des signatures de production séparées, du financement, des domaines et des chemins de configuration.
- Confirmer SDK, CLI, de l'entreprise, et la compatibilité du réseau avec les [Matrice de compatibilité](/fr/reference/compatibility-matrix.md).
- Autorisations d'examen, parrainage des frais, limites de tarifs, surveillance, statut de sauvegarde et critères de retour avant la fenêtre de sortie.
- Exiger une transaction écrite ou un plan de migration pour les états à fort impact.

## Retour en arrière et récupération {#rollback-and-recovery}

- Définir les changements qui peuvent être inversés par déploiement de code, qui nécessitent une transaction en chaîne et qui ne peuvent pas être annulés directement.
- Pour les modifications apportées aux données en chaîne, préparer des scripts de compensation ou de migration avant la première rédaction de la production.
- Pour les changements de réseau, gardez le fichier binaire précédent, le paquet de configuration, la génèse signée et le répertoire opérationnel disponibles pendant la sortie.
- Définir un point de décision pour annuler le déploiement sur la base de signaux objectifs tels que le taux de rejet, la croissance des files d'attente, la latence ou la santé des pairs.

## Liste de contrôle finale {#final-checklist}

- La configuration est spécifique à l'environnement et ne contient pas de secrets destinés aux tests uniquement.
- Le comportement de réessayer une transaction est idempotent ou explicitement limité.
- L'application peut faire la distinction entre le rejet, l'expiration, les délais et les défaillances de disponibilité des terminaux.
- La surveillance couvre le débit, la latence, la profondeur des files d'attente, les rejetes, les changements de vue et les événements commerciaux pertinents.
- Les opérateurs disposent de livres d'exécution pour les modes d'échec attendus.
- L'examen de la sécurité a porté sur le contrôle des clés, les autorisations, l'exposition au réseau et l'autorité d'automatisation.
