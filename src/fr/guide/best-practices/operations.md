---
translation_locale: fr
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Opérations {#operations}

La préparation au fonctionnement signifie que le réseau peut être observé, modifié,
sauvegardé et récupéré sans s'appuyer sur un accès improvisé au validateur
les hôtes.

## Observabilité {#observability}

- Activer intentionnellement les profils de télémétrie. `extended` lorsque `/metrics`
  est nécessaire et `full` lors des essais qui nécessitent des détails Sumeragi
  les itinéraires des opérateurs.
- Tableau de bord accepté, débit rejeté, latence engagée, file d'attente
  profondeur, saturation des files d'attente, changements de vue, messages de consensus abandonnés, et
  la pression de stockage.
- Conserver des instantanés de l'état, des rayures de métriques, des journaux et du déploiement
  configuration dans le même ensemble d'incidents ou d'articles de référence.
- Alerte de croissance soutenue des files d'attente, pics inattendus de rejet, blocage
  les changements de hauteur, de vision et de santé des pairs.

Vous voyez ? [Performance et métriques](/fr/guide/advanced/metrics.md).

## Les livres de conduite {#runbooks}

- Écrivez des livres de course pour le redémarrage par les pairs, Torii dégradation, compromis essentiel,
  erreurs d'autorisation, épuisement des frais de sponsor, files d'attente coincées et réseau
  Les symptômes de la partition.
- Inclure des vérifications exactes en lecture seule avant les opérations d'écriture, en particulier pour
  enregistrement par les pairs, accords de permis et changements de paramètres.
- Garder les contacts d'urgence et les règles d'escalade en dehors des dossiers de repo si
  Ils comprennent des données opérationnelles privées.
- Revoir les livres de course après chaque incident, répétition ou mise à niveau majeure.

Vous voyez ? [Sécurité opérationnelle](/fr/guide/security/operational-security.md).

## Des sauvegardes et une récupération {#backups-and-recovery}

- Réservation par pairs en fonction du point de récupération requis par le
  Valider les restaurations sur des hôtes non en production.
- Gardez la génèse signée, libérez des métadonnées, configurez les pairs et gardez les clés
  les enregistrements récupérables même si un hôte de validation n'est pas disponible.
- Documentation du fait qu'une procédure de récupération se rétablit à partir de la génèse, restaure
  d'un instant, ou remplace un paire échoué par une nouvelle identité.
- Ne jamais tester les procédures de restauration pour la première fois pendant une production
  Un incident.

## Gestion des changements {#change-management}

- Traiter les changements de configuration sur la chaîne comme des transactions qui nécessitent une révision,
  les lectures de pré-vol, l'autorisation et la vérification post-changement.
- Déployer des mises à niveau binaires par pairs avec un plan de compatibilité et un retour en arrière
  point de décision.
- Évitez de modifier la topologie des pairs, le calendrier du consensus et la charge de travail de l'application
  dans la même fenêtre d'entretien, sauf si le plan de migration l'exige.
- Enregistrer les hachages de transaction et les hauteurs de bloc pour des modifications opérationnelles.

Vous voyez ? [Remplacement à chaud](/fr/guide/advanced/hot-reload.md) et
[Matrice de compatibilité](/fr/reference/compatibility-matrix.md).

## Révision des capacités {#capacity-reviews}

- Re-exécuter des contrôles de charge lorsque le validateur est compté, du matériel, du placement du réseau,
  le mélange de charge de travail ou la modification des paramètres de consensus.
- Mesurer le réchauffement, l'état stable et la charge maximale attendue plutôt que de compter sur
  sur un échantillon court de débit, dans le meilleur des cas.
- Comparer le débit accepté avec le débit engagé et la profondeur des files d'attente.
  soumission TPS dépasse les engagements TPS et les files d'attente augmentent, le réseau est passé
  son enveloppe durable.
