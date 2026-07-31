---
translation_locale: fr
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 312f9cb3c6fd937b3e7c30ea27d1876ea7901cfa79eced352611db99bbca4a70
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Déploiement du réseau {#network-deployment}

Traiter une Iroha Les validateurs doivent se mettre d'accord sur la
génèse, topologie, pairs de confiance et configuration liée au consensus
avant que le réseau puisse commencer et continuer à finaliser les blocs.

## Séparation environnementale {#environment-separation}

- Maintenir des paquets de configuration distincts pour le développement local, un réseau test partagé,
  La mise en scène et la production.
- Générer de nouvelles clés pour chaque environnement non jetable.
  réseau local ou Taira matériau clé dans la production.
- Garder la configuration par les pairs, la configuration du client, la génèse signée, les scripts et le déploiement
  les notes sont regroupées comme un artefact de libération versionné.
- Conserver les clés privées en dehors des référentiels et des modèles de déploiement.

Vous voyez ?
[Les clés du déploiement des réseaux](/fr/guide/configure/keys-for-network-deployment.md).

## Genèse et topologie {#genesis-and-topology}

- Faites en sorte que chaque validateur utilise la même transaction de génèse signée, confiance
  Ensemble de pairs, topologie et validateur
  Il les exige.
- Utilisez au moins quatre validateurs pour une tolérance minimale aux défauts byzantins
  déploiement.
- Les observateurs ne sont pas responsables de l'évolution des capacités
  Ils votent, proposent ou collectent, mais ils consomment toujours du stockage, de la synchronisation des blocs,
  et la bande passante du réseau.
- Traiter les changements de génèse, d'exécution et de topologie comme des migrations coordonnées
  plutôt que des éditions uniques.

Vous voyez ? [Genèse](/fr/reference/genesis.md),
[Gestion par les pairs](/fr/guide/configure/peer-management.md), et
[Performance et métriques](/fr/guide/advanced/metrics.md#node-count-and-quorum).

## Torii et l'accès au réseau {#torii-and-network-access}

- Je vous en prie. Torii derrière un proxy inverse ou un pare-feu lorsqu'il est exposé à l'extérieur
  le réseau hôte ou privé.
- Fin de l'année TLS et appliquer l'authentification de base, la limitation des tarifs, et
  les commandes de taille requise au bord lorsque le déploiement en a besoin.
- Publier uniquement les points d'extrémité nécessaires à l'environnement.
  Les itinéraires de télémétrie devraient être plus restreints que les itinéraires publics réservés à la lecture.
- Lier les adresses de l'auditeur à des interfaces hôte-locales lorsque les pairs ne devraient pas
  accepter directement la circulation à distance.

Vous voyez ? [Torii Les points de fin](/fr/reference/torii-endpoints.md) et
[Réseaux privés virtuels](/fr/guide/security/vpn.md).

## Consensus et capacité {#consensus-and-capacity}

- Mesurer le déploiement avant d'ajuster les timers de consensus.
  réduire la latence seulement pendant que les couches de réseau, de stockage et d'exécution sont en phase.
- Attention à la direction des files d'attente, pas seulement de courtes échantillons de débit.
  croît pendant une charge constante, ce qui signifie que le réseau est surchargé.
- Enregistrement effectif Sumeragi paramètres, profil de télémétrie, nombre de validateurs,
  réseau RTT, la forme de la charge de travail et les détails matériels pour chaque référence.
- Augmenter le nombre de collecteurs uniquement après avoir comparé la latence, le trafic et
  les signaux de contre-pression.

Vous voyez ? [Performance et métriques](/fr/guide/advanced/metrics.md).

## Gestion des métaux et des procédés {#bare-metal-and-process-management}

- Gardez les pairs. `config.toml`, clé privée, répertoire de stockage et ports
  séparés.
- Utilisez des gestionnaires de processus tels que systemd avec redémarrage explicite, enregistrement et
  les politiques en matière de ressources.
- Réserve générée README et commencer les commandes de Kagami les paquets de réseau local
  lors de la traduction d'une topologie de test vers des hôtes gérés.

Vous voyez ?
[Randonnée Iroha sur le métal nu](/fr/guide/advanced/running-iroha-on-bare-metal.md).
