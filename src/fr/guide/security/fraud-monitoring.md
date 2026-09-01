---
translation_locale: fr
translation_source: /guide/security/fraud-monitoring.md
translation_source_hash: 4739a0bfe80f14545a51c804abbe6a2dfa5497d546192f76096f938a0af70184
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Surveillance de la fraude {#fraud-monitoring}

La surveillance de la fraude pour un déploiement Iroha est un contrôle opérationnel construit autour des événements du registre blockchain, des requêtes, des permissions et du contexte de l'application. Iroha enregistre ce qui a été soumis, accepté, rejeté et validé. Votre système de surveillance décide quels modèles sont suspects pour votre processus métier et dirige ces cas vers des réviseurs ou des contrôles automatiques de réponse.

Traitez la surveillance de la fraude comme un service séparé plutôt que comme une logique intégrée dans un validateur. Le service doit s'abonner à l'activité du grand livre blockchain, l'enrichir avec un contexte de risque hors chaîne, conserver les preuves et soumettre des transactions de réponse uniquement via des comptes disposant de permissions explicites.

## Modèle de surveillance {#monitoring-model}

Un pipeline de traitement de surveillance utile comporte quatre étapes :

1. Collecter les signaux du registre et des opérateurs à partir des flux d’événements, des requêtes et des métriques de Torii.
2. Enrichissez les événements avec des contextes hors chaîne tels que le statut du client, les listes de contreparties, les identifiants de session d'application, les limites prévues et les identifiants de cas.
3. Détectez les comportements suspects avec des règles déterministes, des files d'attente pour les réviseurs ou un score de risque.
4. Répondez en alertant les opérateurs, en suspendant les flux de travail côté application, en révoquant les permissions inutiles ou en soumettant des transactions compensatoires lorsque votre processus de gouvernance le permet.

Maintenez les décisions de politique en dehors du consensus sauf si chaque validateur doit rejouer la même décision. La validation à l'exécution du logiciel doit faire respecter les autorisations et la validité des transactions. La surveillance des fraudes doit expliquer le risque, préserver les preuves et aider les opérateurs à agir rapidement.

## Signaux à Collecter {#signals-to-collect}

Commencez par des abonnements restreints et ajoutez des flux plus larges uniquement pour l'enquête :

|Signal|Source|Utiliser|
| --- | --- | --- |
|Statut de la transaction|traitement des événements du pipeline|Détecter les rejets répétés, les tentatives d'autorisation échouées et les schémas de soumission inhabituels|
|Cycle de vie du compte et métadonnées|Événements de données et requêtes de compte|Détecter les nouveaux comptes, les changements d'alias, les mises à jour d'identité et les modifications inattendues des métadonnées|
|Soldes et transferts d'actifs|Événements de données d'actifs et requêtes d'actifs|Détecter les mouvements de grande valeur, la diffusion rapide, les vidages de solde et les contreparties inhabituelles|
|Rôles et autorisations|Requêtes sur les rôles et permissions, événements de données de rôle|Détecter l'escalade de privilèges, les autorisations d'urgence et les accès à haut risque obsolètes|
|Déclencheur et modifications de contrat|Événements de déclenchement, de contrat et d'exécuteur|Détecter les nouvelles automatisations, les chemins d'exécution modifiés et les activités de mise à niveau suspectes|
|Configuration et modifications des pairs réseau|Configuration et événements de pair réseau|Détecter les changements de gouvernance qui affectent la validation, le réseautage ou la visibilité des opérateurs|
|Santé de l'opérateur| `/metrics` et Sumeragi itinéraires de statut |Séparer le comportement suspect des utilisateurs de la surcharge des nœuds, de la pression des files d'attente ou des défaillances réseau|

Utilisez [filtres d'événements](/fr/blockchain/filters.md) pour éviter de traiter l'ensemble du flux d'événements lorsqu'une règle n'a besoin que des comptes, des actifs, des rôles ou des modifications de configuration. Pour le rapprochement périodique, combinez le flux avec [requêtes](/fr/blockchain/queries.md) paginé afin que le moniteur puisse se rétablir après une panne.

## Règles de détection {#detection-rules}

Les familles de règles courantes incluent :

|Famille de règles|Condition exemple|Réponse typique|
| --- | --- | --- |
|Vélocité|Un compte effectue des transferts supérieurs au montant ou au nombre attendu dans une courte période|Alerter les examinateurs et suspendre les retraits côté application pour ce compte|
|Répartition|Les fonds passent d'un compte à plusieurs comptes nouvellement vus|Exiger une approbation manuelle avant d'autoriser des transferts supplémentaires|
|Vidange de solde|Une grande partie du solde d'un compte part peu de temps après un changement de clé, d'alias ou de métadonnées|Escaladez comme possible prise de contrôle de compte|
|Escalade de privilèges|Une autorisation ou un rôle à haut risque est accordé en dehors d'une fenêtre de changement|Alerter les opérateurs et examiner la transaction de subvention|
|Explosion de rejet|Un signataire ou client cryptographique produit des transactions rejetées à plusieurs reprises|Vérifiez les abus d'identifiants, les erreurs d'intégration ou les sondages|
|Changement d'automatisation|Un objet lié à un déclencheur, un contrat ou un exécuteur change de manière inattendue|Suspendre les flux de travail dépendants jusqu'à ce que le changement soit examiné|
|Changement sensible à la gouvernance|des modifications du pair réseau, de la configuration ou de l'état d'exécution du logiciel se produisent sans un ticket approuvé|Comparer par rapport au registre de gouvernance et au processus d'incident|

Les règles devraient être explicites sur les preuves qu'elles exigent, la période qu'elles évaluent, l'action qu'elles entreprennent et la personne ou le système qui peut clore. le cas. Les seuils qui dépendent du risque client, du type d'actif ou de la juridiction appartiennent à la configuration de votre service de surveillance, pas à des scripts ad hoc.

## Contrôles de réponse {#response-controls}

Concevez des actions de réponse avant d'activer les alertes. Un cas de fraude à haute gravité doit avoir un chemin documenté de la détection à la containment :

- notifier la sécurité, les opérations et les propriétaires d'entreprise responsables du domaine ou de la définition d'actif affecté
- conservez le curseur d’événement, le hachage du bloc, le hachage de la transaction, l’autorité, la charge utile et l’instantané de requête utilisés par la règle de détection
- mettre en pause les actions côté application qui sont en dehors du registre de la blockchain, telles que le paiement, le retrait, la signature, le pont ou les flux de travail de règlement
- révoquer les rôles ou les autorisations qui ne sont plus justifiés par le plan de réponse aux incidents
- soumettre des transactions de registre blockchain de suivi uniquement lorsque la politique de gouvernance active et le modèle d'autorisation les permettent
- faire pivoter les clés lorsque les preuves suggèrent une compromission du signataire cryptographique

Évitez de donner au service de surveillance un accès en écriture étendu. Utilisez un compte technique dédié avec l'ensemble le plus restreint de permissions nécessaires pour les actions de réponse. Il est permis d'exécuter. L'approbation humaine doit rester une partie de tout flux de travail pouvant déplacer des actifs, modifier des autorisations ou changer la configuration visible par le validateur.

## Preuves et rétention {#evidence-and-retention}

Stockez les preuves de surveillance dans un système en mode ajout uniquement, distinct du répertoire de données du validateur. Chaque alerte doit inclure :

- nom du flux d'événements et curseur
- hauteur de bloc ou hachage cryptographique du bloc lorsque disponible
- hachage cryptographique de transaction et principal d'autorisation
- compte, domaine, actif, rôle, déclencheur ou ID de configuration affecté
- charge utile de l'événement brut ou un hachage cryptographique canonique de celui-ci
- interroger des vues de données point-in-time utilisées pour enrichir l'alerte
- nom de la règle, version, seuil, score et décision du réviseur

Ne stockez pas de notes d'enquête sensibles en tant que métadonnées de registre public de la blockchain, sauf si la politique de gouvernance des données du réseau le permet explicitement. Si vous devez lier un cas hors chaîne à un état sur chaîne, privilégier un identifiant de cas, une attestation signée ou un engagement par hachage cryptographique qui ne divulgue pas de détails privés.

## Liste de contrôle de mise en œuvre {#implementation-checklist}

- Activez le profil de télémétrie nécessaire pour `/metrics` et les itinéraires de l'opérateur.
- Abonnez-vous aux flux d'événements Torii avec des filtres étroits pour les objets que vous surveillez.
- Conservez les curseurs d'événements afin que le moniteur puisse reprendre sans interruption.
- Réconcilier les flux avec des requêtes paginées selon un calendrier régulier.
- Conservez les seuils de risque et les listes autorisées dans une configuration contrôlée par version.
- Testez les règles d'alerte sur des blocs historiques avant d'activer les actions automatisées.
- Utilisez des comptes techniques dédiés pour les actions de réponse.
- Examinez les rôles et les attributions de permissions selon un calendrier récurrent.
- Inclure les alertes de surveillance de la fraude dans le processus de réponse aux incidents.

## Pages liées {#related-pages}

- [Événements](/fr/blockchain/events.md)
- [Filtres](/fr/blockchain/filters.md)
- [Requêtes](/fr/blockchain/queries.md)
- [Autorisations](/fr/blockchain/permissions.md)
- [Performance et mesures](/fr/guide/advanced/metrics.md)
- [Torii API points de terminaison](/fr/reference/torii-endpoints.md)
- [Sécurité opérationnelle](/fr/guide/security/operational-security.md)
