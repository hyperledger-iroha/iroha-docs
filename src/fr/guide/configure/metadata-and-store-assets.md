---
translation_locale: fr
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les options de stockage des métadonnées et du registre {#metadata-and-ledger-storage-choices}

Les Iroha 3 le modèle de données n'a pas de séparation `Store` type d'actif pour arbitraire
Utilisez les options de stockage suivantes.

## Les métadonnées {#metadata}

Utilisation [métadonnées](/fr/blockchain/metadata.md) pour les petits JSON champs qui appartiennent
à un objet de registre:

- afficher les noms et étiquettes
- intégration IDs
- petits drapeaux politiques
- les haches, URIs, CIDs, ou SoraFS les chemins qui pointent vers des charges utiles plus importantes

Les métadonnées font partie de l'état mondial et sont retournées avec l'objet qui possède
Gardez les clés stables, les valeurs compactes et les autorisations explicites.
stocker des documents, des journaux ou l'état d'application à haute fréquence directement dans
les métadonnées.

## Les actifs numériques et NFTs {#numeric-assets-and-nfts}

Utilisation [actifs](/fr/blockchain/assets.md) et [NFTs](/fr/blockchain/nfts.md) lorsque
l'État est rentable:

- actifs numériques pour les soldes fungibles
- NFTs pour les registres détenus uniquement
- [RWAs](/fr/blockchain/rwas.md) et d'autres objets spécifiques au domaine lorsque le
  le modèle de données active les expose

Les actifs et NFTs avoir leur propre IDs, événements du cycle de vie, comportement de transfert,
Ils sont meilleurs que les métadonnées lorsqu'on possède des données.
Il s'agit d'un problème de pénurie ou d'histoire des transferts.

## Données hors chaîne {#off-chain-data}

Utilisez un stockage hors chaîne pour les charges utiles importantes ou changeables.
référence en chaîne, comme:

- un hash de contenu
- à la URI
- à la SoraFS chemin ou référence manifeste
- un engagement compact utilisé par une preuve de demande

Cela maintient le WSV Il s'agit d'une proposition de directive relative à l'application des droits de douane.
la charge utile hors chaîne correspond à la référence sur la chaîne.

## Le choix d'un lieu {#choosing-a-location}

Utilisez cette règle générale:

- Si c'est un attribut compact d'un objet de registre, utilisez les métadonnées.
- S'il est porteux de valeur ou transférable, modélisez-le comme un actif. NFT, ou
  objet spécifique au domaine.
- S'il est grand, de grande charge ou privé d'application, conservez-le à l'extérieur du
  WSV et mettre une référence vérifiable sur la chaîne.

Pour les autorisations de métadonnées, voir
[Les jetons d'accès](/fr/reference/permissions.md).
