---
translation_locale: fr
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 312f9cb3c6fd937b3e7c30ea27d1876ea7901cfa79eced352611db99bbca4a70
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Déploiement du réseau {#network-deployment}

Traiter un réseau Iroha comme un système coordonné. Les validateurs doivent se mettre d'accord sur la génèse, la topologie, les pairs de confiance et la configuration pertinente au consensus avant que le réseau puisse commencer et continuer à finaliser des blocs.

## Séparation de l'environnement {#environment-separation}

- Maintenir des paquets de configuration distincts pour le développement local, le testnet partagé, la mise en scène et la production.
- Générer de nouvelles clés pour chaque environnement non jetable. Ne réutilisez pas le localnet ou Taira dans la production.
- Gardez la configuration des pairs, la configuration du client, la génèse signée, les scripts et les notes de déploiement ensemble comme un artefact de libération versionné.
- Conserver les clés privées en dehors des dépôts et des modèles de déploiement.

Voir [Les clés pour le déploiement du réseau ](/fr/guide/configure/keys-for-network-deployment.md).

## Genèse et topologie {#genesis-and-topology}

- Faites en sorte que chaque validateur utilise la même transaction de génèse signée, un ensemble de pairs fiables, une topologie et des preuves de possession du validateur lorsque le profil les exige.
- Utilisez au moins quatre validateurs pour un déploiement minimum de tolérance à la faute byzantine.
- Séparer les validateurs des observateurs dans la planification des capacités. Les observateurs ne votent pas, ne proposent pas ou ne collectent pas, mais ils consomment toujours le stockage, la synchronisation de blocs et la bande passante réseau.
- Traiter les changements de génèse, d'exécuteur et de topologie comme des migrations coordonnées plutôt que des modifications uniques.

Voir [Genèse](/fr/reference/genesis.md), [ Gestion des pairs](/fr/guide/configure/peer-management.md) et [ Performance and Metrics ](/fr/guide/advanced/metrics.md#node-count-and-quorum).

## Torii et l'accès au réseau {#torii-and-network-access}

- Mettre Torii derrière un proxy inverse ou un pare-feu lorsqu'il est exposé à l'extérieur du réseau hôte ou privé.
- Terminer TLS et appliquer les contrôles d'authentification de base, de limitation des taux et de taille requise à l'extrémité lorsque le déploiement en exige.
- Les itinéraires d'opérateur et de télémétrie devraient être plus restreints que les itinéraires publics réservés à la lecture seule.
- Lier les adresses de l'auditeur aux interfaces locales de l'hôte lorsque les pairs ne devraient pas accepter le trafic à distance directement.

Voir [Torii Endpoints](/fr/reference/torii-endpoints.md) et [ Réseaux privés virtuels ](/fr/guide/security/vpn.md).

## Consensus et capacité {#consensus-and-capacity}

- Mesurer le déploiement avant d'ajuster les timers de consensus. Des délais plus faibles ne peuvent réduire la latence que pendant que les couches réseau, stockage et exécution sont en phase.
- Regardez la direction de la file d'attente, pas seulement les échantillons courts de débit. Une file d'attente croissante pendant la charge constante signifie que le réseau est surchargé.
- Enregistrer les paramètres Sumeragi effectifs, le profil de télémétrie, le nombre de validateurs, le réseau RTT, la forme de la charge de travail et les détails matériels pour chaque référence.
- Augmentez la résistance du collecteur uniquement après avoir comparé les signaux de latence, de trafic et de contrainte.

Voir [Performance et métriques](/fr/guide/advanced/metrics.md).

## Gestion des métaux et des procédés {#bare-metal-and-process-management}

- Gardez séparément les `config.toml`, la clé privée, le répertoire de stockage et les ports de chacun.
- Utilisez des gestionnaires de processus tels que systemd avec des politiques explicites de redémarrage, d'enregistrement et de ressources.
- Préserver les commandes générées README et démarrer des paquets de localnet Kagami lors de la traduction d'une topologie de test vers des hôtes gérés.

Voir [Running Iroha sur le métal nu](/fr/guide/advanced/running-iroha-on-bare-metal.md).
