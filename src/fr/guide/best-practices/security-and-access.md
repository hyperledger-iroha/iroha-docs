---
translation_locale: fr
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Sécurité et accès {#security-and-access}

La pratique de sécurité dans Iroha devrait être basée sur une autorité étroite, la détention contrôlée des clés, l'exposition explicite au réseau et les changements vérifiables.

## Prise en charge de la clé {#key-custody}

- Générer des clés de production avec entropie de niveau de production et stocker des clés privées à l'extérieur des dépôts, émettre des traceurs, des invites, des journaux de chat et CI sortie.
- Utilisez un matériel clé séparé pour les clients, les pairs, la signature de la génèse, les validateurs, les sponsors des frais et les comptes techniques.
- Retournez les touches selon un processus écrit et répétez la récupération avant un incident en direct.
- Utiliser un stockage supporté par le matériel ou le système d'exploitation pour des clés de signature à haute valeur lorsque le risque de déploiement le justifie.

Voir [Génération de clés cryptographiques](/fr/guide/security/generating-cryptographic-keys.md) et [Rétention de clés Cryptographiques ](/fr/guide/security/storing-cryptographic-keys.md).

## Autorisations {#permissions}

- Accordez le plus petit jeton ou rôle d'autorisation qui soutient le flux de travail.
- Préférer des comptes techniques dédiés pour les services, les déclencheurs, les agents et l'automatisation. Évitez d'exécuter une automatisation à long terme via un compte d'opérateur personnel
- Les autorisations d'examen pour la gestion par les pairs, la mutation des métadonnées, le montage, la combustion, l'enregistrement du déclencheur, les modifications de l'exécuteur et la gouvernance SORA/Nexus avant le lancement de la production.
- Revoquer les autorisations temporaires après la fenêtre d'entretien ou la migration qui les a exigées.

Voir [Permissions](/fr/blockchain/permissions.md) et [Pouches d'autorisation ](/fr/reference/permissions.md).

## L'exposition au réseau {#network-exposure}

- Restreindre les itinéraires de peer-to-peer, Torii, de télémétrie et d'opérateur en fonction de l'environnement.
- Utilisez VPNs, des pare-feu, des proxies inversées, la terminaison de TLS et les limites de taux lorsque cela est approprié pour le déploiement.
- Gardez les identifiants d'auteur de base, les jetons proxy et les en-têtes renvoyés hors config engagés.
- Teste que les clients non autorisés ne peuvent pas atteindre des itinéraires restreints.

Voir [Réseaux privés virtuels](/fr/guide/security/vpn.md) et [ Torii Les points de fin ](/fr/reference/torii-endpoints.md).

## La surveillance de la fraude et des abus {#fraud-and-abuse-monitoring}

- Surveiller les événements du registre et les signaux opérationnels pour le mouvement inattendu des actifs, l'octroi d'autorisations, les modifications de déclencheurs, les changements par rapport aux autres et les transactions rejetées répétées.
- Préserver les preuves avec des hashes de transaction, des hauteurs de bloc, des enregistrements d'événements, des journaux et des instantanés d'état.
- Alertes de route à la sécurité, aux opérations et aux propriétaires d'entreprises responsables des actifs ou des flux de travail touchés.

Voir [La surveillance de la fraude ](/fr/guide/security/fraud-monitoring.md).

## Garde de l'agent et des machines d'automatisation {#agent-and-automation-guardrails}

- Commencez l'automatisation avec des autorisations de lecture uniquement et ajoutez l'autorité d'écriture seulement après avoir examiné le flux de travail.
- Exiger une approbation humaine explicite pour les mutations du réseau en direct, sauf si l'automatisation est un service de production déployé délibérément.
- N'exposez pas les clés privées aux demandes d'agent. Utilisez un code local qui charge des secrets de variables environnementales, chaînes-clés, signatures matérielles ou fichiers de configuration ignorés.
- Les décisions d'automatisation des journaux de manière à soutenir les audits sans fuite de matériel secret.
