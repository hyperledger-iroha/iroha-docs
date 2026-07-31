---
translation_locale: fr
translation_source: /guide/security/fraud-monitoring.md
translation_source_hash: 4739a0bfe80f14545a51c804abbe6a2dfa5497d546192f76096f938a0af70184
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Surveillance de la fraude {#fraud-monitoring}

Surveillance de la fraude pour un Iroha déploiement est un contrôle opérationnel construit autour des événements du registre, des requêtes, des autorisations et du contexte de l'application. Iroha Votre système de surveillance détermine quels modèles sont suspects. votre processus d'affaires et envoie ces cas aux auditeurs ou aux contrôles automatisés de réponse.

Traiter la surveillance des fraudes comme un service distinct plutôt que comme une logique intégrée dans un validateur. Le service devrait s'abonner à l'activité du registre, l'enrichir d'un contexte de risque hors chaîne, maintenir les preuves et soumettre des transactions de réponse uniquement par le biais de comptes qui ont des autorisations explicites.

## Modèle de surveillance {#monitoring-model}

Un pipeline de surveillance utile se compose de quatre étapes:

1. Rassembler les signaux du registre et de l'opérateur provenant des flux d'événements, des requêtes et des métriques Torii.
2. Enrichir les événements avec un contexte hors chaîne tel que l'état des clients, les listes de contreparties, les identifiants de session d'application, les limites attendues et le cas IDs.
3. Détecter les comportements suspects avec des règles déterministes, des files d'attention ou un score de risque.
4. Répondez en alertant les opérateurs, en suspendant les flux de travail côté application, en révoquant les autorisations inutiles ou en soumettant des transactions compensatrices lorsque votre processus de gouvernance le permet.

Gardez les décisions de politique hors consensus à moins que chaque validateur n'ait à reproduire la même décision. La validation en temps d'exécution devrait faire respecter les autorisations et la validité des transactions.

## Les signaux à collecter {#signals-to-collect}

Commencez par les abonnements restreints et ajoutez des flux plus larges uniquement pour l'enquête:

|Le signal .|La source |Utilisation |
| --- | --- | --- |
|Statut de l' opération |Les événements du pipeline |Détecter les rejets répétés, les tentatives d'autorisation ratées et les schémas de soumission inhabituels |
|Cycle de vie du compte et métadonnées |Événements de données et requêtes de comptes |Détecter de nouveaux comptes, des changements d'alias, des mises à jour d'identité et des modifications imprévues de métadonnées |
|Salles d' actifs et transferts |Les événements de données sur les actifs et les requêtes d' actifs |Détecter des mouvements de haute valeur, une ventilation rapide, des drains d'équilibre et des contreparties inhabituelles |
|Roles et autorisations |Les requêtes de rôle et d'autorisation, les événements relatifs aux données de rôle |Détecter l'escalade des privilèges, les subventions d'urgence et un accès périmé à haut risque |
|Modification du déclencheur et des contrats |Événements de déclenchement, de contrat et d'exécution |Détecter une nouvelle automatisation, des itinéraires d'exécution modifiés et des activités de mise à niveau suspectes |
|La configuration et les changements de pairs |Configuration et événements par les pairs |Détecter les changements de gouvernance qui affectent la validation, le réseautage ou la visibilité des opérateurs |
|Santé des opérateurs |Les routes de statut `/metrics` et Sumeragi |Séparer le comportement suspect de l'utilisateur de la surcharge des nœuds, de la pression de la file d'attente ou des défaillances réseau |

Utilisez [filtres d'événements](/fr/blockchain/filters.md) pour éviter de traiter l'ensemble du flux d'évènements lorsqu'une règle ne nécessite que des comptes, des actifs, des rôles ou des modifications de configuration. Pour la réconciliation périodique, combinez le flux avec des requêtes paginées [ ](/fr/blockchain/queries.md) afin que le moniteur puisse se récupérer après une période d'arrêt.

## Règles de détection {#detection-rules}

Les familles de règles communes comprennent:

|La famille des règles |Condition d' exemple |Réponse typique |
| --- | --- | --- |
|La vitesse |Un compte transfère plus que le montant attendu ou compté en une courte période |Les auditeurs d' alerte et la pause des retraits du côté de l' application pour ce compte |
|Le déploiement|Les fonds passent d' un seul compte à de nombreux nouveaux comptes |Requérir une approbation manuelle avant d' autoriser des transferts supplémentaires |
|L' écoulement de l' équilibre|Une grande partie du solde d'un compte disparaît peu après un changement de clé, d'alias ou de métadonnées |L' escalade de la prise en charge des comptes |
|L' escalade des privilèges |Une autorisation ou un rôle à risque élevé est accordé en dehors d' une fenêtre de changement |Alerter les opérateurs et examiner l' opération de subvention |
|Le rejet éclate |Un signataire ou un client produit des transactions refusées à plusieurs reprises |Vérifiez les abus d'identité, les erreurs d'intégration ou l'enquête |
|Modification de l' automatisation |Un déclencheur, un contrat ou un objet lié à l'exécution change de manière inattendue |Arrêter les flux de travail dépendants jusqu' à ce que le changement soit examiné |
|Un changement sensible à la gouvernance |Les changements de pair, de configuration ou d'état d'exécution se produisent sans un billet approuvé |Comparer avec les antécédents de gouvernance et le processus d' incident |

Les règles doivent être explicites concernant les preuves qu'elles exigent, la période d'évaluation qu'elles effectuent, les mesures qu'elles prennent et la personne ou le système qui peut clore l'affaire. Les seuils qui dépendent du risque des clients, du type d'actif ou de la juridiction appartiennent à la configuration de votre service de surveillance et non aux scripts ad hoc.

## Contrôles de réponse {#response-controls}

Concevoir des mesures d'intervention avant l'activation des alertes.Un cas de fraude à haute gravité devrait avoir un parcours documenté de la détection au confinement:

- notifier la sécurité, les opérations et les propriétaires d'entreprise responsables de la définition du domaine ou des actifs affectés;
- préserver le curseur d'événement, le hash de blocage, le hash des transactions, l'autorité, la charge utile et les instantanés de requête utilisés par la règle de détection.
- Arrêter les actions du côté de l'application qui sont en dehors du registre, telles que les flux de travail de paiement, de retrait, de signature, de pont ou de règlement.
- révoquer des rôles ou autorisations qui ne sont plus justifiés par le plan d'intervention en cas d'incident
- ne soumettent des transactions de suivi dans le registre que si la politique de gouvernance active et le modèle d'autorisation les autorisent
- tourner les clés lorsque la preuve suggère un compromis entre le signataire

Évitez de donner au service de surveillance un large accès à l'écriture.Utilisez un compte technique dédié avec le plus petit ensemble d'autorisations requises pour les actions de réponse qu'il est autorisé à effectuer. L'approbation humaine doit faire partie de tout flux de travail pouvant déplacer des actifs, modifier les autorisations ou modifier la configuration en fonction du validateur.

## Les preuves et la conservation {#evidence-and-retention}

Les données de surveillance doivent être stockées dans un système unique à l'annexe, séparé du répertoire des données du validateur.

- Nom du flux d'événements et curseur
- hauteur de bloc ou hachage de bloc lorsqu'il est disponible
- hash de transaction et autorité
- compte affecté, domaine, actif, rôle, déclencheur ou configuration ID
- une charge utile d'événement brut ou un hash canonique de celle-ci
- les instantanés de requête utilisées pour enrichir l'alerte
- Nom de la règle, version, seuil, score et décision du réviseur

Ne stockez pas les notes d'enquête sensibles en tant que métadonnées du registre public, sauf si la politique de gouvernance des données du réseau le permet explicitement. Si vous avez besoin de lier un cas hors chaîne à l'état sur chaîne, préférez un identifiant de cas, une attestation signée ou un engagement hash qui n'expose pas les détails privés

## Liste de contrôle de la mise en œuvre {#implementation-checklist}

- Activer le profil télémétrique nécessaire pour `/metrics` et les itinéraires de l'opérateur.
- Abonnez-vous à Torii flux d'événements avec des filtres étroits pour les objets que vous surveillez.
- Persistez les curseurs d'événements afin que le moniteur puisse reprendre sans lacunes.
- Concilier les flux avec des requêtes paginées sur un calendrier régulier.
- Garder des seuils de risque et permettre les listes dans une configuration contrôlée par version.
- Règles d'alerte de test contre les blocs historiques avant l'activation des actions automatisées.
- Utiliser des comptes techniques dédiés pour les actions d'intervention.
- Rôle de révision et accords d'autorisation selon un calendrier récurrent.
- Inclure des alertes de surveillance de la fraude dans le processus d'intervention en cas d'incident.

## Pages connexes {#related-pages}

- [Les événements](/fr/blockchain/events.md)
- [Filtres ](/fr/blockchain/filters.md)
- [Les questions ](/fr/blockchain/queries.md)
- [Autorisations ](/fr/blockchain/permissions.md)
- [Performance et métriques](/fr/guide/advanced/metrics.md)
- [points d'extrémité Torii](/fr/reference/torii-endpoints.md)
- [Sécurité opérationnelle ](/fr/guide/security/operational-security.md)
