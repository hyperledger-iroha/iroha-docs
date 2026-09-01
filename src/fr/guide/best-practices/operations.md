---
translation_locale: fr
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Opérations {#operations}

La préparation opérationnelle signifie que le réseau peut être observé, modifié, sauvegardé et récupéré sans dépendre d'un accès improvisé aux hôtes de validation.

## Observabilité {#observability}

- Activez intentionnellement les profils de télémétrie. Utilisez `extended` lorsque `/metrics` est nécessaire et `full` pendant les tests qui nécessitent des itinéraires détaillés d'opérateurs Sumeragi.
- Tableau de bord débit accepté, débit rejeté, latence de validation, profondeur de la file d'attente, saturation de la file d'attente, modifications de vue, messages de consensus abandonnés et pression de stockage.
- Conservez les vues de données de statut à un instant donné, les collectes de métriques, les journaux et la configuration de déploiement dans le même ensemble d’artefacts d’incident ou de test de référence.
- Alerte sur la croissance soutenue de la file d'attente, les pics de rejet inattendus, le blocage de la hauteur des blocs, le changement fréquent de vue et les modifications de l'état de santé des pairs du réseau.

Voir [Performance et mesures](/fr/guide/advanced/metrics.md).

## Manuels d'exécution {#runbooks}

- Rédigez des runbooks pour le redémarrage des pairs du réseau, la dégradation Torii, la compromission de clé, les erreurs de permission, l'épuisement du sponsor de frais, les files d'attente bloquées et les symptômes de partition du réseau.
- Inclure des vérifications en lecture seule exactes avant les opérations d'écriture, en particulier pour l'enregistrement des pairs réseau, l'octroi des permissions et les modifications de paramètres.
- Conservez les contacts d'urgence et les règles d'escalade en dehors du dépôt de documents s'ils incluent des données opérationnelles privées.
- Révisez les guides d'exploitation après chaque incident, répétition ou mise à niveau majeure.

Voir [Sécurité opérationnelle](/fr/guide/security/operational-security.md).

## Sauvegardes et restauration {#backups-and-recovery}

- Sauvegardez le stockage des pairs réseau conformément au point de récupération requis par le déploiement. Validez les restaurations sur des hôtes non productifs.
- Conservez la genèse signée, les métadonnées de version, la configuration des pairs et les registres de garde des clés de façon récupérable, même si un hôte validateur est indisponible.
- Documentez si une procédure de récupération reconstruit depuis la genèse de la blockchain, restaure à partir d'une vue des données à un moment donné, ou remplace un pair réseau défaillant par une nouvelle identité.
- Ne testez jamais les procédures de restauration pour la première fois lors d'un incident de production.

## Gestion du changement {#change-management}

- Traitez les modifications de configuration on-chain comme des transactions nécessitant une révision, des lectures préalables, une autorisation et une vérification après modification.
- Déployez les mises à jour binaires des pairs du réseau avec un plan de compatibilité et un point de décision de retour en arrière.
- Évitez de modifier la topologie des pairs du réseau, le calendrier du consensus et la charge de travail de l'application dans la même fenêtre de maintenance, sauf si le plan de migration l'exige.
- Consignez les hachages de transactions et les hauteurs de blocs des changements opérationnels.

Voir [Rechargement à chaud](/fr/guide/advanced/hot-reload.md) et [Matrice de compatibilité](/fr/reference/compatibility-matrix.md).

## Examens de capacité {#capacity-reviews}

- Relancer les vérifications de charge lorsque le nombre de validateurs, le matériel, le placement du réseau, le mélange de charges de travail ou les paramètres de consensus changent.
- Mesurez l'échauffement, l'état stable et la charge maximale attendue plutôt que de vous fier à un échantillon de débit optimal à court terme.
- Comparez le débit accepté avec le débit engagé et la profondeur de la file d'attente. Si le soumis TPS dépasse l'engagé TPS et que les files d'attente augmentent, le réseau a dépassé sa limite de fonctionnement durable.
