---
translation_locale: fr
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 984957526424a4e0ec9f29a6da1bb64699245bb135e8157bbe684bc3d87de4cc
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Préparation à la mise en production {#release-readiness}

Avant de promouvoir une application ou un changement de réseau Iroha, prouvez le comportement dans l'environnement le plus petit pouvant exposer le risque pertinent, puis passez délibérément par les étapes du testnet partagé et de la production.

## Passerelle Localnet {#localnet-gate}

- Lancer un réseau local jetable avec la même piste Iroha et le nombre de validateurs praticable le plus proche.
- Exécutez des tests unitaires pour les constructeurs de transactions, l'analyse des requêtes, la gestion des rejets et le chargement de la configuration.
- Exercez les plus petits chemins de lecture et d'écriture réussis à travers la même forme SDK ou CLI que l'application utilisera plus tard.
- Capturer les hachages cryptographiques des transactions attendues, les statuts, les événements et les lectures d'état dans les artefacts de test.

Voir [Lancer Iroha 3](/fr/get-started/launch-iroha.md) et [SDK Tutoriels](/fr/guide/tutorials/).

## Passerelle Testnet Partagée {#shared-testnet-gate}

- Utilisez Taira ou un autre testnet partagé pour le comportement du point de terminaison API, les frais, le financement des comptes, la latence et les répétitions opérationnelles.
- Gardez les écritures sur le testnet en direct optionnelles afin que les tests ordinaires ne dépendent pas de la disponibilité du réseau ou ne dépensent des fonds du testnet.
- Vérifiez le financement du signataire cryptographique, les métadonnées de l'actif de frais, les autorisations du principal d'autorisation et l'état attendu avant de soumettre chaque transaction de test en direct.
- Attendez un état terminal, puis vérifiez l'état résultant avec une requête en lecture seule.

Voir [Construire sur SORA 3 : Taira et Minamoto](/fr/get-started/sora-nexus-dataspaces.md).

## Réseau principal ou passerelle de production {#mainnet-or-production-gate}

- Séparez en production les signataires, fonds, domaines et chemins de configuration. Ne réutilisez ni les clés de test ni les hypothèses relatives au distributeur.
- Confirmez les scénarios inter-SDK requis avec le [Matrice de compatibilité](/fr/reference/compatibility-matrix.md). Épinglez séparément et testez le CLI exact, le binaire du pair réseau, la configuration et la version réseau utilisés par le déploiement.
- Vérifiez les autorisations, le parrainage des frais, les limites de débit, la surveillance, l'état des sauvegardes et les critères de rétablissement avant la fenêtre de publication.
- Exiger un plan écrit de transaction ou de migration pour les écritures à fort impact.

## Restauration et récupération {#rollback-and-recovery}

- Définissez quels changements peuvent être annulés par le déploiement de code, lesquels nécessitent une transaction en chaîne, et lesquels ne peuvent pas être annulés directement.
- Pour les modifications de données sur la chaîne, préparez des transactions compensatoires ou des scripts de migration avant la première écriture en production.
- Pour les changements de réseau, gardez l'ancien binaire, le bundle de configuration, le bloc genesis de la blockchain signé et le manuel opérationnel disponibles pendant la mise en production.
- Définissez un point de décision pour interrompre le déploiement en fonction de signaux objectifs tels que le taux de rejet, la croissance de la file d'attente, la latence ou l'état de santé des pairs réseau.

## Liste de contrôle finale {#final-checklist}

- La configuration est spécifique à l'environnement et ne contient pas de secrets réservés aux tests.
- Le comportement de réessai des transactions est idempotent ou explicitement limité.
- L'application peut distinguer le rejet, l'expiration, le délai d'attente et les échecs de disponibilité du point de terminaison API.
- La surveillance couvre le débit, la latence, la profondeur de la file d'attente, les rejets, les changements de vue et les événements commerciaux pertinents.
- Les opérateurs ont des guides d'exploitation pour les modes de défaillance prévus.
- La revue de sécurité a couvert la garde des clés, les permissions, l'exposition du réseau et le principe d'autorisation de l'automatisation.
