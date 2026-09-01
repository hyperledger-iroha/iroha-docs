---
translation_locale: fr
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Sécurité et accès {#security-and-access}

La pratique de sécurité dans Iroha devrait être basée sur le principe d'autorisation restreinte, la garde contrôlée des clés, l'exposition explicite du réseau et les changements auditables.

## Garde des clés {#key-custody}

- Générez des clés de production avec une entropie de qualité production et stockez les clés privées en dehors des dépôts, des systèmes de suivi des problèmes, des invites, des journaux de discussion et de la sortie CI.
- Utilisez du matériel clé séparé pour les clients, les pairs du réseau, la signature de la genèse de la blockchain, les validateurs, les sponsors de frais et les comptes techniques.
- Faites tourner les clés selon un processus écrit et répétez la récupération avant un incident en direct.
- Utilisez un stockage basé sur le matériel ou sur le système d'exploitation pour les clés de signature à haute valeur lorsque le risque de déploiement le justifie.

Voir [Génération de clés cryptographiques](/fr/guide/security/generating-cryptographic-keys.md) et [Stockage des clés cryptographiques](/fr/guide/security/storing-cryptographic-keys.md).

## Autorisations {#permissions}

- Attribuez le jeton ou le rôle de permission le plus petit qui prend en charge le flux de travail.
- Privilégiez les comptes techniques dédiés pour les services, les déclencheurs, les agents et l'automatisation. Évitez d'exécuter des automatisations de longue durée via un compte opérateur personnel.
- Vérifiez les autorisations pour la gestion des pairs réseau, la modification des métadonnées, l'émission, la combustion, l'enregistrement des déclencheurs, les modifications de l'exécuteur et la gouvernance SORA/Nexus avant le lancement en production.
- Révoquez les permissions temporaires après la fenêtre de maintenance ou la migration qui les nécessitait.

Voir [Autorisations](/fr/blockchain/permissions.md) et [Jetons de permission](/fr/reference/permissions.md).

## Exposition réseau {#network-exposure}

- Restreignez les routes pair-à-pair, Torii, de télémétrie et d’opérateur en fonction de l’environnement. L’accès public en lecture n’implique ni accès public en écriture ni accès d’opérateur.
- Utilisez VPNs, des pare-feu, des proxies inverses, la terminaison TLS et des limites de débit là où c'est approprié pour le déploiement.
- Gardez les informations d'identification basic-auth, les jetons de proxy et les en-têtes transférés hors de la configuration validée.
- Tester que les clients non autorisés ne peuvent pas accéder aux routes restreintes.

Voir [Réseaux privés virtuels](/fr/guide/security/vpn.md) et [Torii API points de terminaison](/fr/reference/torii-endpoints.md).

## Surveillance de la fraude et des abus {#fraud-and-abuse-monitoring}

- Surveillez les événements du registre et les signaux opérationnels : mouvements d’actifs inattendus, attributions de permissions, changements de déclencheurs ou de pairs et rejets répétés de transactions.
- Préservez les preuves : hachages de transactions, hauteurs de blocs, événements, journaux et instantanés d’état.
- Alerte la sécurité, les opérations et les responsables commerciaux des actifs ou des flux de travail concernés.

Voir [Surveillance de la fraude](/fr/guide/security/fraud-monitoring.md).

## Garde-fous pour agents et automatisation {#agent-and-automation-guardrails}

- Commencez l'automatisation avec des permissions en lecture seule et ajoutez le principal d'autorisation en écriture uniquement après que le flux de travail a été révisé.
- Exiger une approbation humaine explicite pour les mutations sur le réseau en direct, sauf si l'automatisation est un service de production délibérément déployé.
- N’exposez pas de clés privées dans les invites des agents. Utilisez du code local qui charge les secrets depuis des variables d’environnement, des trousseaux, des dispositifs matériels de signature ou des fichiers de configuration ignorés.
- Enregistrez les décisions d'automatisation des journaux d'une manière qui soutient les audits sans divulguer de matériel secret.
