---
translation_locale: fr
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les meilleures pratiques {#best-practices}

Cette section recueille des lignes directrices orientées vers la production pour Iroha Applications
Il est organisé par la décision que vous devez prendre, et non par le
fonctionnalité qui arrive à l'implémenter.

Utilisez-le comme liste de contrôle avant une répétition testnet partagée, une production
ou une libération de client majeur.

## Catégories {#categories}

| Catégorie                                                | Concentrez-vous                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Développement des applications](./application-development.md) | Configuration du client, soumission de transaction, répétitions, événements, requêtes et développement assisté par l'agent |
| [Modélisation des données](./data-modeling.md)                     | Domaines, comptes, actifs NFTs, les métadonnées, les données hors chaîne et les conventions de dénomination                      |
| [Déploiement du réseau](./network-deployment.md)           | Genèse, topologie, clés de pair, Torii exposition, réglages de consensus et séparation environnementale           |
| [Opérations](./operations.md)                           | Observabilité, annuaires d'exécution, sauvegardes, gestion des changements, contrôle de la capacité et traitement des incidents            |
| [Sécurité et accès](./security-and-access.md)         | Traitement secret, autorisations, comptes techniques, accès au réseau et pistes d'audit                     |
| [La préparation à la libération](./release-readiness.md)             | réseau local, Taira, Minamoto, contrôles de compatibilité, garanties du réseau en direct et planification du retour        |

## Règles de coupe croisée {#cross-cutting-rules}

- Maintenir le développement local, le testnet partagé et la configuration de production
  séparés.
- Traitez la génèse, la topologie des pairs, la politique de l'exécuteur et le matériel clé comme
  des artefacts de déploiement contrôlés.
- Modèle de l'état du registre durable intentionnellement.
  un point de dumping pour les données importantes, privées ou à fort débit.
- Soumettre des transactions par le biais de flux de travail idempotent qui peuvent gérer
  Le rejet, l'expiration, les nouvelles tentatives et le retard.
- Préférer des autorisations étroites, des comptes techniques dédiés et explicites
  les annuaires opérationnels sur un large accès à l'administrateur.
- Prouvez d'abord le comportement sur un réseau local jetable, puis répétez sur
  Taira ou un autre réseau de test partagé avant toute opération du réseau principal.

## Références connexes {#related-references}

- [Configuration et gestion](/fr/guide/configure/overview.md)
- [Sécurité](/fr/guide/security/)
- [Performance et métriques](/fr/guide/advanced/metrics.md)
- [Matrice de compatibilité](/fr/reference/compatibility-matrix.md)
- [Torii Les points de fin](/fr/reference/torii-endpoints.md)
- [Les jetons d'accès](/fr/reference/permissions.md)
