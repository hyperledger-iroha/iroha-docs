---
translation_locale: fr
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Modélisation des données {#data-modeling}

Les données du registre devraient être basées sur la propriété, le comportement de transfert,
les limites d'autorisation, et des motifs de requête. Choisissez le plus petit sur la chaîne
une représentation capable de soutenir la vérifiabilité et l'exécution déterministe.

## Domaines et comptes {#domains-and-accounts}

- Utilisez des domaines pour représenter les frontières administratives et politiques.
  Les noms de domaine sont stables car ils apparaissent dans les identifiants de compte et d'actifs.
- Évitez de surcharger un seul compte avec des responsabilités non liées.
  comptes distincts pour les utilisateurs, services, déclencheurs, opérateurs et frais
  Les sponsors.
- Utilisez les identifiants de compte et de domaine canoniques dans la configuration et les tests. Iroha
  Les noms sont sensibles aux cas après analyse canonique.
- Garder les identités d'essai et de production visiblement distinctes en termes de noms, de domaines,
  et les voies des fichiers de configuration.

Vous voyez ? [Domaines](/fr/blockchain/domains.md), [Comptes](/fr/blockchain/accounts.md),
et [Nommage](/fr/reference/naming.md).

## Les actifs et NFTs {#assets-and-nfts}

- Utiliser des actifs numériques pour les soldes fungibles et les quantités transférables.
- Utilisation NFTs ou des objets spécifiques à un domaine pour les enregistrements de propriété unique.
- Évitez d'encoder l'état portant valeur uniquement dans les métadonnées. NFTs
  fournir des événements de cycle de vie, la sémantique de transfert et les contrôles d'autorisation qui
  Les métadonnées ne le sont pas.
- Définir la précision, la politique d'approvisionnement, la responsabilité de l'émetteur et le burn/mint
  autorité avant d'exposer un actif à des demandes.

Vous voyez ? [Les actifs](/fr/blockchain/assets.md), [NFTs](/fr/blockchain/nfts.md), et
[RWAs](/fr/blockchain/rwas.md).

## Les métadonnées {#metadata}

- Utilisez des métadonnées pour les attributs compacts d'objets de registre, tels que les étiquettes,
  intégration IDs, les drapeaux de police, les hashes, URIs, ou adressés au contenu
  les références.
- Gardez les clés de métadonnées stables et documentées.
  Les clients dépendent d'eux crée un problème de migration.
- Ne stockez pas de grands documents, journaux, données privées d'utilisateurs ou de haute fréquence
  l'état d'application directement dans les métadonnées.
- Lorsque les métadonnées pointent vers des données hors chaîne, stocker une référence vérifiable telle que
  en tant que hash de contenu, URI, SoraFS chemin, référence manifeste ou compact
  l'engagement.

Vous voyez ?
[Les options de stockage des métadonnées et du registre](/fr/guide/configure/metadata-and-store-assets.md)
et [Les métadonnées](/fr/blockchain/metadata.md).

## Autorisations par modèle {#permissions-by-model}

- Les rôles de conception autour des opérations commerciales, pas autour de la mise en œuvre
  Un rôle nommé d'après un emploi ou un service est plus facile à vérifier que
  un rôle qui porte le nom d'une grande capacité technique.
- Les jetons d'autorisation de portée pour le plus petit objet qui satisfait à la
  le flux de travail.
- Autorisations de traitement pour la mouture, le brûlage, la gestion par les pairs, l'exécuteur
  changements, gestion des déclencheurs et mutation de métadonnées à fort impact
  les autorisations.
- Ajouter des procédures explicites de révocation et de rotation pour les opérations temporaires
  les autorisations.

Vous voyez ? [Autorisations](/fr/blockchain/permissions.md) et
[Les jetons d'accès](/fr/reference/permissions.md).

## Forme de requête {#query-shape}

- Choisissez des identifiants et des clés de métadonnées qui prennent en charge les requêtes que vous avez
  l'application sera nécessaire le plus souvent.
- Paginez les ensembles de résultats larges et évitez les interfaces utilisateur qui nécessitent
  des analyses non limitées de l'ensemble du registre pour les actions normales.
- Garder des indices hors chaîne reconstructibles à partir de données et d'événements du registre
  chaque fois qu'ils sont utilisés pour un comportement d'application critique.
