---
translation_locale: fr
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Opérations {#operations}

La disponibilité opérationnelle signifie que le réseau peut être observé, modifié, sauvegardé et récupéré sans compter sur l'accès improvisé aux hôtes validateurs.

## Observabilité {#observability}

- Activer intentionnellement les profils de télémétrie. Utilisez `extended` lorsque `/metrics` est nécessaire et `full` pendant les essais qui nécessitent des itinéraires détaillés pour l'opérateur Sumeragi.
- Le tableau de bord a accepté le débit, rejeté le déficit, la latence d'engagement, la profondeur de file d'attente, la saturation des files d'attention, les modifications de visualisation, les messages de consensus abandonnés et la pression de stockage.
- Conserver des instantanés d'état, des extraits de métriques, des journaux et la configuration du déploiement dans le même ensemble d'incidents ou d'artefacts de référence.
- Alerte sur la croissance soutenue des files d'attente, les pics de rejet inattendus, l'altitude du bloc bloqué, le changement de point de vue et les changements de santé des pairs.

Voir [Performance et métriques](/fr/guide/advanced/metrics.md).

## Livres d'exécution {#runbooks}

- Écrivez des feuilles de route pour le redémarrage par les pairs, la dégradation Torii, le compromis clé, les erreurs d'autorisation, l'épuisement du sponsor des frais, les files d'attente coincées et les symptômes de partition réseau.
- Incluez des vérifications exactes en lecture seule avant les opérations d'écriture, en particulier pour l'enregistrement par les pairs, les autorisations et les changements de paramètres.
- Gardez les contacts d'urgence et les règles d'escalade en dehors des dossiers repo s'ils incluent des données opérationnelles privées.
- Révisez les livres de course après chaque incident, répétition ou mise à niveau majeure.

Voir [Sécurité opérationnelle ](/fr/guide/security/operational-security.md).

## Les sauvegardes et la récupération {#backups-and-recovery}

- Réservez le stockage par pairs en fonction du point de récupération requis pour le déploiement. Valider les restaurations sur les hôtes non en production.
- Garder la génèse signée, libérer des métadonnées, configurer les pairs et récupérer les enregistrements de garde des clés même si un hôte validateur n'est pas disponible.
- Documenter si une procédure de récupération se reconstruit à partir de la génèse, se rétablit à partir d'un instantané ou remplace un concurrent échoué par une nouvelle identité.
- Ne jamais tester des procédures de restauration pour la première fois lors d'un incident de production.

## Gestion des changements {#change-management}

- Traiter les changements de configuration sur la chaîne comme des transactions qui nécessitent une révision, des lectures avant vol, une autorisation et une vérification après changement.
- Mettre en œuvre des mises à niveau binaires par pairs avec un plan de compatibilité et un point de décision de retrait.
- Évitez de changer la topologie des pairs, le calendrier consensuel et la charge de travail de l'application dans la même fenêtre d'entretien à moins que le plan de migration ne l'exige.
- Enregistrer les hachages de transaction et la hauteur des blocs pour les modifications opérationnelles.

Voir [Réchargement à chaud](/fr/guide/advanced/hot-reload.md) et [ Matrice de compatibilité ](/fr/reference/compatibility-matrix.md).

## Révision des capacités {#capacity-reviews}

- Réinitialiser les contrôles de charge lorsque le nombre de validateurs, le matériel, le placement du réseau, le mélange de charges de travail ou les paramètres de consensus changent.
- Mesurer le réchauffement, l'état de stabilité et la charge maximale attendue au lieu de s'appuyer sur un échantillon de débit court du meilleur cas.
- Comparer le débit accepté avec le débit engagé et la profondeur de file d'attente. Si le TPS soumis dépasse le TPS engagé et que les files d'attention augmentent, le réseau a dépassé son enveloppe durable.
