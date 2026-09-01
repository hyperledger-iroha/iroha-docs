---
translation_locale: fr
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Modélisation des données {#data-modeling}

Les données du grand livre blockchain doivent être modélisées autour de la propriété, du comportement de transfert, des limites de permission et des modèles de requête. Choisissez la représentation sur chaîne la plus petite qui peut supporter l’auditabilité et l’exécution déterministe.

## Domaines et comptes {#domains-and-accounts}

- Utilisez des domaines pour représenter les limites administratives et les politiques. Gardez les noms de domaine stables car ils apparaissent dans les identifiants de compte et d’actif.
- Évitez de surcharger un seul compte avec des responsabilités non liées. Utilisez des comptes séparés pour les utilisateurs, les services, les déclencheurs, les opérateurs et les sponsors de frais.
- Utilisez des identifiants de compte et de domaine canoniques dans la configuration et les tests. Les noms Iroha sont sensibles à la casse après l'analyse canonique.
- Maintenez les identités de test et de production visiblement distinctes dans les noms, les domaines et les chemins des fichiers de configuration.

Voir [Domaines](/fr/blockchain/domains.md), [Comptes](/fr/blockchain/accounts.md), et [Nommer](/fr/reference/naming.md).

## Actifs et NFTs {#assets-and-nfts}

- Utilisez des actifs numériques pour les soldes fongibles et les quantités transférables.
- Utilisez NFTs ou des objets spécifiques au domaine pour les enregistrements détenus de manière unique.
- Évitez d'encoder un état porteur de valeur uniquement dans les métadonnées. Les actifs et NFTs fournissent des événements de cycle de vie, des sémantiques de transfert et des vérifications de permissions que les métadonnées ne fournissent pas.
- Définir la précision, la politique d'approvisionnement, la responsabilité de l'émetteur et le principe d'autorisation de brûlage/mint avant d'exposer un actif aux applications.

Voir [Actifs](/fr/blockchain/assets.md), [NFTs](/fr/blockchain/nfts.md), et [RWAs](/fr/blockchain/rwas.md).

## Métadonnées {#metadata}

- Utilisez les métadonnées pour les attributs compacts des objets du registre : libellés, identifiants d’intégration, indicateurs de politique, hachages, URIs ou références adressées par contenu.
- Gardez les clés de métadonnées stables et documentées. Changer les noms des clés après que les clients en dépendent crée un problème de migration.
- Ne stockez pas directement dans les métadonnées de gros documents, des journaux, des données utilisateur privées ou l'état d'une application à fort taux de changement.
- Lorsque les métadonnées pointent vers des données hors chaîne, stockez une référence vérifiable telle qu'un hachage cryptographique de contenu, le chemin URI, SoraFS, une référence de manifeste technique ou un engagement compact.

Voir [Choix de stockage des métadonnées et du registre blockchain](/fr/guide/configure/metadata-and-store-assets.md) et [Métadonnées](/fr/blockchain/metadata.md).

## Autorisations par modèle {#permissions-by-model}

- Concevez les rôles autour des opérations commerciales, et non autour des commodités d'implémentation. Un rôle nommé d'après un emploi ou un service est plus facile à auditer qu'un rôle nommé d'après une capacité technique large.
- Limitez les jetons d'autorisation au plus petit objet qui satisfait le flux de travail.
- Considérez les autorisations pour l'émission, la destruction, la gestion des pairs réseau, les modifications d'exécuteur, la gestion des déclencheurs et la mutation des métadonnées comme des autorisations à fort impact.
- Ajouter des procédures explicites de révocation et de rotation pour les autorisations temporaires.

Voir [Autorisations](/fr/blockchain/permissions.md) et [Jetons de permission](/fr/reference/permissions.md).

## Forme de requête {#query-shape}

- Choisissez des identifiants et des clés de métadonnées qui soutiennent les requêtes dont votre application aura le plus souvent besoin.
- Paginez les ensembles de résultats larges et évitez les interfaces utilisateur qui nécessitent des analyses non restreintes de l'ensemble du grand livre pour les actions normales.
- Conservez les index hors chaîne reconstructibles à partir des données et événements du grand livre blockchain chaque fois qu'ils sont utilisés pour un comportement d'application critique.
