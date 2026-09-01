---
translation_locale: fr
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 7839268b8c1f6700b0c26652e3308fa4e8acef4717d8527c609b6f30fb8c84ab
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Déploiement du réseau {#network-deployment}

Traitez un réseau Iroha comme un système coordonné. Les validateurs doivent s'accorder sur la genèse de la blockchain, la topologie, les pairs de réseau de confiance et la configuration pertinente pour le consensus avant que le réseau puisse démarrer et continuer à finaliser les blocs.

## Séparation de l'environnement {#environment-separation}

- Maintenez des ensembles de configuration séparés pour le développement local, le testnet partagé, la mise en scène et la production.
- Générez de nouvelles clés pour chaque environnement non jetable. Ne réutilisez pas le matériel de clé localnet ou Taira en production.
- Conservez la configuration des pairs réseau, la configuration du client, le genesis de la blockchain signé, les scripts et les notes de déploiement ensemble en tant qu'artéfact de version.
- Stockez les clés privées en dehors des dépôts et des modèles de déploiement.

Voir [Clés pour le déploiement réseau](/fr/guide/configure/keys-for-network-deployment.md).

## genèse et topologie de la blockchain {#genesis-and-topology}

- Faites en sorte que chaque validateur utilise la même transaction de genèse de blockchain signée, le même ensemble de pairs de réseau de confiance, la même topologie et les mêmes preuves de possession du validateur lorsque le profil les exige.
- Utilisez au moins quatre validateurs pour un déploiement tolérant aux pannes byzantines minimal.
- Séparez les validateurs des observateurs dans la planification de la capacité. Les observateurs ne votent pas, ne proposent pas et ne collectent pas, mais ils consomment néanmoins du stockage, la synchronisation des blocs et la bande passante réseau.
- Traitez les changements de genèse, d’exécuteur et de topologie comme des migrations coordonnées, non comme des modifications propres à un seul pair.

Voir [genèse de la blockchain](/fr/reference/genesis.md), [Gestion des pairs réseau](/fr/guide/configure/peer-management.md), et [Performance et mesures](/fr/guide/advanced/metrics.md#node-count-and-quorum).

## Torii et Accès au Réseau {#torii-and-network-access}

- Placez Torii derrière un proxy inverse ou un pare-feu lorsqu'il est exposé en dehors de l'hôte ou du réseau privé.
- Terminez TLS et appliquez l'authentification de base, la limitation du débit et les contrôles de taille des requêtes à la périphérie lorsque le déploiement l'exige.
- Publiez uniquement les points de terminaison API nécessaires à l'environnement. Les routes opérateur et télémétrie devraient être plus restreintes que les routes publiques en lecture seule.
- Lier les adresses des écouteurs aux interfaces locales de l'hôte lorsque les pairs du réseau ne doivent pas accepter directement le trafic distant.

Voir [Torii API points de terminaison](/fr/reference/torii-endpoints.md) et [Réseaux Privés Virtuels](/fr/guide/security/vpn.md).

## Consensus et Capacité {#consensus-and-capacity}

- Mesurez le déploiement avant d'ajuster les minuteries de consensus. Des délais d'attente plus courts peuvent réduire la latence seulement si les couches réseau, de stockage et d'exécution suivent.
- Surveillez la direction de la file d'attente, pas seulement de courts échantillons de débit. Une file d'attente qui augmente pendant une charge constante signifie que le réseau est surchargé.
- Enregistrez les paramètres effectifs Sumeragi, le profil de télémétrie, le nombre de validateurs, le réseau RTT, la forme de la charge de travail et les détails du matériel pour chaque benchmark.
- Changez une limite de file d'attente bornée ou de récupération de charge utile à la fois, et conservez les preuves de latence, de trafic, de mémoire et de contre-pression avant et après.

Voir [Performance et mesures](/fr/guide/advanced/metrics.md).

## Gestion du matériel nu et des processus {#bare-metal-and-process-management}

- Gardez séparés le `config.toml`, la clé privée, le répertoire de stockage et les ports de chaque pair du réseau.
- Utilisez des gestionnaires de processus tels que systemd avec des politiques explicites de redémarrage, de journalisation et de ressources.
- Conserver les commandes générées README et de démarrage provenant des bundles localnet Kagami lors de la traduction d'une topologie de test vers des hôtes gérés.

Voir [Exécution de Iroha sur du matériel nu](/fr/guide/advanced/running-iroha-on-bare-metal.md).
