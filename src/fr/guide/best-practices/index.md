---
translation_locale: fr
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les meilleures pratiques {#best-practices}

Cette section recueille des lignes directrices orientées vers la production pour les applications et les réseaux Iroha.

Utilisez-le comme une liste de contrôle avant une répétition partagée du testnet, un lancement de production ou une sortie majeure pour le client.

## Les catégories {#categories}

|Catégorie |Concentrez-vous .|
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Développement des applications ](./application-development.md) |Configuration du client, soumission de transaction, répétitions, événements, requêtes et développement assisté par l'agent |
| [Modélisation des données ](./data-modeling.md) |Domaines, comptes, actifs, NFTs, métadonnées, données hors chaîne et conventions de dénomination |
| [Déploiement du réseau ](./network-deployment.md) |Genèse, topologie, clés de pair, exposition Torii, réglages de consensus et séparation environnementale |
| [Les opérations](./operations.md) |Observabilité, annuaires d'exécution, sauvegardes, gestion des changements, contrôle de la capacité et traitement des incidents |
| [Sécurité et accès ](./security-and-access.md) |Traitement secret, permissions, comptes techniques, accès au réseau et pistes d'audit |
| [Prêt à être libéré ](./release-readiness.md) |Localnet, Taira, Minamoto, vérification de la compatibilité, garanties du réseau en direct et planification du retour |

## Règles en matière de coupe croisée {#cross-cutting-rules}

- Garder le développement local, le réseau de test partagé et la configuration de production séparés.
- Traiter la génèse, la topologie des pairs, la politique de l'exécuteur et le matériel clé comme des artefacts de déploiement contrôlés.
- Ne pas utiliser les métadonnées comme point de dumping pour des données volumineuses, privées ou à fort rendement.
- Soumettez des transactions à travers des flux de travail idempotent qui peuvent gérer le rejet, l'expiration, les renouvellements et l'état retardé.
- Préférer les autorisations étroites, les comptes techniques dédiés et les annuaires d'exploitation explicites à un large accès de l'administrateur.
- Prouver d'abord le comportement sur un réseau local jetable, puis répéter sur Taira ou sur un autre réseau de test partagé avant toute opération du réseau principal.

## Références connexes {#related-references}

- [Configuration et gestion ](/fr/guide/configure/overview.md)
- [La sécurité ](/fr/guide/security/)
- [Performance et métriques](/fr/guide/advanced/metrics.md)
- [Matrice de compatibilité ](/fr/reference/compatibility-matrix.md)
- [Torii Points d'arrêt](/fr/reference/torii-endpoints.md)
- [Des jetons d'autorisation ](/fr/reference/permissions.md)
