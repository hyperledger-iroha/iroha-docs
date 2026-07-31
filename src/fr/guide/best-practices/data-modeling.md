---
translation_locale: fr
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Modélisation des données {#data-modeling}

Les données du registre doivent être modélisées autour de la propriété, du comportement de transfert, des limites d'autorisation et des motifs de requête. Choisissez la plus petite représentation en chaîne qui puisse soutenir l'audit et l'exécution déterministe.

## Domaines et comptes {#domains-and-accounts}

- Utilisez des domaines pour représenter les limites administratives et politiques. Gardez les noms de domaine stables car ils apparaissent dans les identifiants de compte et d'actifs.
- Évitez de surcharger un seul compte avec des responsabilités non liées. Utilisez des comptes distincts pour les utilisateurs, les services, les déclencheurs, les opérateurs et les sponsors des frais.
- Utilisez les identifiants de compte et de domaine canoniques dans la configuration et les tests. Les noms Iroha sont sensibles aux cas après analyse canonique.
- Garder les identités de test et de production visiblement distinctes en termes de noms, de domaines et de chemins de fichiers de configuration.

Voir [Domains](/fr/blockchain/domains.md), [Comptes](/fr/blockchain/accounts.md) et [Nommage ](/fr/reference/naming.md).

## Actifs et NFTs {#assets-and-nfts}

- Utiliser des actifs numériques pour les soldes fungibles et les quantités transférables.
- Utiliser NFTs ou des objets spécifiques à un domaine pour les enregistrements de propriété unique.
- Évitez d'encoder l'état portant une valeur uniquement dans les métadonnées. Les actifs et NFTs fournissent des événements de cycle de vie, la sémantique de transfert et les contrôles d'autorisation que les métadonnes ne fournissent pas.
- Définir la précision, la politique d'approvisionnement, la responsabilité de l'émetteur et l'autorité de combustion avant d'exposer un actif à des applications.

Vous voyez ? [Les actifs](/fr/blockchain/assets.md), [NFTs](/fr/blockchain/nfts.md), et [RWAs](/fr/blockchain/rwas.md).

## Les métadonnées {#metadata}

- Utiliser des métadonnées pour les attributs compacts d'objets du registre, tels que les étiquettes, l'intégration IDs, les balises de politique, les hashes, URIs ou les références adressées au contenu.
- Gardez les clés de métadonnées stables et documentées. Le changement des noms de clés après que les clients en dépendent crée un problème de migration.
- Ne stockez pas directement dans les métadonnées de grands documents, journaux, données privées d'utilisateurs ou l'état des applications à haute fréquence.
- Lorsque les métadonnées pointent vers des données hors chaîne, stocker une référence vérifiable telle qu'un hash de contenu, URI, SoraFS chemin, référence manifeste ou engagement compact.

Voir [Metadata et choix de stockage du registre](/fr/guide/configure/metadata-and-store-assets.md) et [Metadata](/fr/blockchain/metadata.md).

## Autorisations par modèle {#permissions-by-model}

- Un rôle nommé d'après un emploi ou un service est plus facile à vérifier qu'un rôle désigné d'après une large capacité technique.
- Exploiter les jetons d'autorisation au plus petit objet qui satisfait le flux de travail.
- Traitez les autorisations pour le montage, la combustion, la gestion par les pairs, les modifications de l'exécuteur, la gestion des déclencheurs et la mutation de métadonnées comme des autorisations à fort impact.
- Ajouter des procédures explicites de révocation et de rotation pour les autorisations temporaires.

Voir [Permissions](/fr/blockchain/permissions.md) et [Pouches d'autorisation ](/fr/reference/permissions.md).

## La forme de la requête {#query-shape}

- Choisissez des identifiants et des clés de métadonnées qui prennent en charge les requêtes dont votre application aura le plus souvent besoin.
- Paginez les ensembles de résultats généraux et évitez les interfaces utilisateur qui nécessitent des analyses sans restriction à l'échelle du registre pour les actions normales.
- Garder les indices hors chaîne reconstructibles à partir de données et d'événements du registre chaque fois qu'ils sont utilisés pour un comportement critique des applications.
