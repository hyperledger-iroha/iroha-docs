---
translation_locale: fr
translation_source: /guide/security/fraud-monitoring.md
translation_source_hash: 4739a0bfe80f14545a51c804abbe6a2dfa5497d546192f76096f938a0af70184
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Surveillance des fraudes {#fraud-monitoring}

Surveillance de la fraude pour un Iroha le déploiement est un contrôle opérationnel construit autour
événements, requêtes, autorisations et contexte de l'application. Iroha enregistrent ce qui
votre système de surveillance décide
quels modèles sont suspects pour votre processus d'affaires et les itinéraires de ces cas
aux réviseurs ou aux contrôles de réponse automatisés.

Traiter la surveillance des fraudes comme un service distinct plutôt que comme une logique intégrée dans une
Le service devrait s'abonner à l'activité du registre, enrichir le
le contexte de risque hors chaîne, la persistance des preuves et la soumission des transactions en réponse uniquement
à travers des comptes qui ont des autorisations explicites.

## Modèle de surveillance {#monitoring-model}

Un pipeline de surveillance utile comporte quatre étapes:

1. **Réservation** les signaux du registre et de l'opérateur Torii les flux d'événements, les requêtes,
   et les métriques.
2. **Enrichir** des événements ayant un contexte hors chaîne tel que le statut du client,
   les listes de contreparties, les identifiants des sessions d'application, les limites attendues et
   cas IDs.
3. **Détecter** comportement suspect avec des règles déterministes, des files d'attente de réviseurs ou
   le score de risque.
4. **Répondez** en alertant les opérateurs, en suspendant les flux de travail du côté des applications;
   révocation d'autorisations inutiles ou soumission de transactions compensatoires
   lorsque votre processus de gouvernance le permet.

Garder les décisions politiques hors consensus, à moins que chaque validateur
La validation de l'exécution devrait faire respecter les autorisations et la transaction
La surveillance de la fraude devrait expliquer le risque, préserver les preuves et aider à
Les opérateurs agissent rapidement.

## Les signaux à collecter {#signals-to-collect}

Commencez par des abonnements étroits et ajoutez des flux plus larges uniquement pour l'enquête:

| Signal | Sources | Utilisation |
| --- | --- | --- |
| Statut de l'opération | Les événements sur les pipelines | Détecter les refus répétés, les tentatives d'autorisation ratées et les schémas de soumission inhabituels |
| Cycle de vie du compte et métadonnées | Événements de données et requêtes de comptes | Détecter de nouveaux comptes, des changements d'alias, des mises à jour d'identité et des modifications inattendues de métadonnées |
| Salles d'actifs et transferts | Evénements de données sur les actifs et requêtes d'actifs | Détecter des mouvements de haute valeur, une ventilation rapide, des écoulements d'équilibre et des contreparties inhabituelles |
| Roles et autorisations | Rôle et requêtes d'autorisation, événements de données de rôle | Détecter l'escalade des privilèges, les subventions d'urgence et l'accès à haut risque obsolète |
| Modification du déclencheur et des contrats | Événements déclencheurs, contrats et exécuteurs | Détecter de nouvelles automatisations, des itinéraires d'exécution modifiés et des activités de mise à niveau suspectes |
| Configuration et changements de pairs | Configuration et événements partagés | Détecter les changements de gouvernance qui affectent la validation, le réseautage ou la visibilité des opérateurs |
| Santé des opérateurs | `/metrics` et Sumeragi itinéraires de statut | Séparer le comportement suspect de l'utilisateur de la surcharge des nœuds, de la pression des files d'attente ou des défaillances réseau |

Utilisation [Filtres d'événements](/fr/blockchain/filters.md) pour éviter de traiter l'ensemble de l'événement
flux lorsqu'une règle ne nécessite que des modifications de comptes, d'actifs, de rôles ou de configuration.
Pour la réconciliation périodique, combiner le flux avec paginé
[les questions](/fr/blockchain/queries.md) pour que le moniteur puisse se rétablir après l'arrêt.

## Règles de détection {#detection-rules}

Les familles de règles communes comprennent:

| Famille de règles | Condition d'exemple | Réponse typique |
| --- | --- | --- |
| Vélocité | Un compte transfère plus que le montant attendu ou le nombre dans un court laps de temps | Réviseurs d'alerte et retrait de pause du côté de l'application pour ce compte |
| Le déploiement | Les fonds passent d'un compte à plusieurs nouveaux comptes. | Exiger une approbation manuelle avant d'autoriser des transferts supplémentaires |
| Écoulement de l'équilibre | Une grande partie du solde d'un compte disparaît peu après un changement de clé, alias ou métadonnées | Encourager la prise de contrôle des comptes |
| L'escalade des privilèges | Une autorisation ou un rôle à haut risque est accordé en dehors d'une fenêtre de changement | Alerter les opérateurs et examiner l'opération de subvention |
| Réjection éclatante | Un signataire ou un client produit des transactions refusées à plusieurs reprises | Vérifiez l'abus de vos informations, les erreurs d'intégration ou la vérification |
| Modification de l'automatisation | Un déclencheur, un contrat ou un objet lié à l'exécution change de façon inattendue | Arrêter les flux de travail dépendants jusqu'à ce que le changement soit examiné |
| Changement sensible à la gouvernance | Les changements de niveau, de configuration ou d'état d'exécution se produisent sans un billet approuvé | Comparer avec le dossier de gouvernance et le processus d'incident |

Les règles devraient être explicites sur les éléments de preuve qu'elles exigent, le délai dans lequel elles
évaluer, l'action qu'ils prennent et la personne ou le système qui peut fermer
cas. seuils qui dépendent du risque des clients, du type d'actif ou de la juridiction
appartiennent à votre configuration de service de surveillance, pas aux scripts ad hoc.

## Contrôles de réponse {#response-controls}

Conception des mesures d'intervention avant l'activation des alertes.
doit avoir un parcours documenté de la détection à la confination:

- notifier les propriétaires de sécurité, d'exploitation et d'entreprises responsables des
  définition du domaine ou de l'actif affecté
- préserver le curseur d'événement, bloc hash, transaction hash, autorité, charge utile,
  et des instantanés de requête utilisées par la règle de détection
- la pause des actions du côté de l'application qui sont en dehors du registre, telles que le paiement;
  les flux de travail relatifs au retrait, à la signature, au pont ou au règlement
- révoquer les rôles ou autorisations qui ne sont plus justifiés par l'incident
  plan de réponse
- ne soumettent des transactions de suivi dans le registre que lorsque la politique de gouvernance active
  et le modèle d'autorisation leur permet
- tourner les clés lorsque la preuve suggère un compromis entre le signataire

Évitez de donner au service de surveillance un large accès à l'écriture.
compte technique avec le plus petit ensemble d'autorisations requis pour la réponse
L'approbation humaine devrait rester une partie intégrante de toute
flux de travail qui peut déplacer des actifs, modifier les autorisations ou modifier le facteur de validation
la configuration.

## Les preuves et la conservation {#evidence-and-retention}

Les données de surveillance sont stockées dans un système séparé du
répertoire de données du validateur. chaque alerte doit inclure:

- Nom du flux d'événements et curseur
- hauteur de bloc ou hash de bloc lorsque disponible
- hash de transaction et autorité
- compte, domaine, actif, rôle, déclencheur ou configuration affectés ID
- charge utile d'événement brut ou un hash canonique de celle-ci
- des instantanés de requête utilisées pour enrichir l'alerte
- nom de la règle, version, seuil, score et décision du réviseur

Ne conservez pas les notes d'enquête sensibles comme métadonnées de registre public, sauf si le
La politique de gouvernance des données du réseau le permet explicitement.
cas hors chaîne à l'état en chaîne, préférer un identifiant de cas, attestation signée;
ou un engagement hash qui n'expose pas de détails privés.

## Liste de contrôle de la mise en œuvre {#implementation-checklist}

- Activer le profil de télémétrie nécessaire pour `/metrics` et les itinéraires des opérateurs.
- Souscrivez-vous Torii flux d'événements avec des filtres étroits pour les objets que vous
  le moniteur.
- Persistez les curseurs d'événements afin que le moniteur puisse reprendre sans lacunes.
- Concilier les flux avec des requêtes paginées sur un calendrier régulier.
- Garder des seuils de risque et permettre les listes dans la configuration contrôlée par version.
- Règles d'alerte de test contre les blocs historiques avant de permettre des actions automatisées.
- Utiliser des comptes techniques dédiés pour les actions de réponse.
- Rôle de révision et accords d'autorisation sur un calendrier récurrent.
- Inclure des alertes de surveillance des fraudes dans le processus d'intervention en cas d'incident.

## Pages connexes {#related-pages}

- [Les événements](/fr/blockchain/events.md)
- [Filtres](/fr/blockchain/filters.md)
- [Les questions](/fr/blockchain/queries.md)
- [Autorisations](/fr/blockchain/permissions.md)
- [Performance et métriques](/fr/guide/advanced/metrics.md)
- [Torii points de fin](/fr/reference/torii-endpoints.md)
- [Sécurité opérationnelle](/fr/guide/security/operational-security.md)
