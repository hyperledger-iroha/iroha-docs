---
translation_locale: fr
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 1f316d6a823b23e821d80fe8773df7469358b0e01057f9b76b113cafe4818f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# La préparation à la libération {#release-readiness}

Avant de promouvoir une Iroha modification de l'application ou du réseau, prouver le comportement
dans le plus petit environnement susceptible d'exposer le risque pertinent, puis se déplacer
au moyen de réseaux d'essais partagés et de portes de production.

## Porte de réseau local {#localnet-gate}

- Lancer un réseau local jetable avec le même Iroha la piste et le
  le nombre de validateurs pratiques le plus proche.
- Exécuter des tests unitaires pour les constructeurs de transactions, analyser les requêtes, rejeter
  la manutention et le chargement de configuration.
- Exercez le plus petit succès de lecture et d'écriture par les mêmes chemins
  SDK ou CLI la forme que l'application utilisera plus tard.
- Capture des hashes de transaction attendus, des statuts, des événements et des lectures d'état dans
  les artefacts d'essai.

Vous voyez ? [Lancement Iroha 3](/fr/get-started/launch-iroha.md) et
[SDK Les tutoriels](/fr/guide/tutorials/).

## Porte de réseau partagé {#shared-testnet-gate}

- Utilisation Taira ou un autre réseau de test partagé pour le comportement, les frais et le compte des points d'exécution
  Le financement, la latence et les répétitions opérationnelles.
- Restez en direct testnet écrit opt-in afin que les essais ordinaires ne dépendent pas de
  la disponibilité du réseau ou dépenser les fonds du testnet.
- Vérifiez le financement des signataires, les métadonnées des actifs de frais, les autorisations des autorités et
  l'état attendu avant de soumettre chaque transaction d'essai en direct.
- Attendez un état terminal, puis vérifiez l'état résultant avec une
  une requête de lecture uniquement.

Vous voyez ?
[On s'en remet SORA 3: Taira et Minamoto](/fr/get-started/sora-nexus-dataspaces.md).

## Réseau principal ou porte de production {#mainnet-or-production-gate}

- Utilisez des signatures de production, du financement, des domaines et des chemins de configuration séparés.
  Ne pas promouvoir les clés de réseau d'essai ou les hypothèses du robinet.
- Confirmer SDK, CLI, de l'entreprise, et la compatibilité du réseau avec les
  [Matrice de compatibilité](/fr/reference/compatibility-matrix.md).
- Autorisations d'examen, parrainage des frais, limites de tarifs, suivi, sauvegarde
  l'état et les critères de rétroaction avant la fenêtre de libération.
- Exiger une transaction écrite ou un plan de migration pour les documents à fort impact.

## Retour en arrière et récupération {#rollback-and-recovery}

- Définir les changements qui peuvent être inversés par déploiement de code, qui nécessitent une
  transaction en chaîne, et qui ne peut pas être annulée directement.
- Pour les changements de données en chaîne, préparer des transactions compensatrices ou des migrations
  les scénarios avant la première production.
- Pour les changements de réseau, conservez la version binaire précédente, le paquet de configuration, signé
  génèse, et un répertoire opérationnel disponible pendant la libération.
- Définir un point de décision pour annuler le déploiement en fonction des signaux objectifs
  tels que le taux de rejet, la croissance des files d'attente, la latence ou la santé des pairs.

## Liste de contrôle finale {#final-checklist}

- La configuration est spécifique à l'environnement et ne contient pas que des essais
  Des secrets.
- Le comportement de réessayer la transaction est idempotent ou explicitement limité.
- La demande peut faire la distinction entre rejet, expiration, délai et point final
  défaillances de disponibilité.
- La surveillance couvre le débit, la latence, la profondeur des files d'attente, les refus, la vue
  les changements et les événements commerciaux pertinents.
- Les opérateurs disposent d'un répertoire des modes de défaillance attendus.
- L'examen de sécurité couvrait la garde des clés, les autorisations, l'exposition au réseau et
  autorité de l'automatisation.
