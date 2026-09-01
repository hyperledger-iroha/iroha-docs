---
translation_locale: fr
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Meilleures pratiques {#best-practices}

Cette section rassemble des conseils orientés vers la production pour les applications et réseaux Iroha. Elle est organisée en fonction de la décision que vous devez prendre, et non pas en fonction de la fonctionnalité qui se trouve à la mettre en œuvre.

Utilisez-le comme liste de contrôle avant une répétition sur testnet partagé, un lancement en production ou une sortie importante pour un client.

## Catégories {#categories}

|Catégorie|Concentrer|
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Développement d'applications](./application-development.md) |Configuration du client, soumission de transactions, nouvelles tentatives, événements, requêtes et développement assisté par agent|
| [Modélisation des données](./data-modeling.md)                     |Domaines, comptes, actifs, NFTs, métadonnées, données hors chaîne, et conventions de nommage|
| [Déploiement du réseau](./network-deployment.md)           |genèse de la blockchain, topologie, clés des pairs du réseau, exposition Torii, paramètres de consensus et séparation des environnements|
| [Opérations](./operations.md)                           |Observabilité, procédures opérationnelles, sauvegardes, gestion des changements, vérifications de capacité et gestion des incidents|
| [Sécurité et accès](./security-and-access.md)         |Gestion des secrets, autorisations, comptes techniques, accès réseau et pistes d'audit|
| [Préparation à la sortie](./release-readiness.md)             |Localnet, Taira, Minamoto, vérifications de compatibilité, mesures de sécurité du réseau en direct et planification du retour en arrière|

## Règles transversales {#cross-cutting-rules}

- Gardez séparées la configuration de développement local, celle du testnet partagé et celle de production.
- Considérez la genèse de la blockchain, la topologie des pairs du réseau, la politique de l'exécuteur et le matériel clé comme des artefacts de déploiement contrôlés.
- Modélisez intentionnellement l'état durable du grand livre blockchain. N'utilisez pas les métadonnées comme un dépotoir pour des données volumineuses, privées ou à fort renouvellement.
- Soumettez des transactions via des flux de travail idempotents capables de gérer le rejet, l'expiration, les tentatives de nouvelle soumission et le statut différé.
- Préférez des autorisations limitées, des comptes techniques dédiés et des guides opérationnels explicites plutôt qu'un accès administrateur étendu.
- Prouvez le comportement sur un réseau local jetable d'abord, puis répétez sur Taira ou un autre testnet partagé avant toute opération sur le mainnet.

## Références associées {#related-references}

- [Configuration et gestion](/fr/guide/configure/overview.md)
- [Sécurité](/fr/guide/security/)
- [Performance et mesures](/fr/guide/advanced/metrics.md)
- [Matrice de compatibilité](/fr/reference/compatibility-matrix.md)
- [Torii API points de terminaison](/fr/reference/torii-endpoints.md)
- [Jetons de permission](/fr/reference/permissions.md)
