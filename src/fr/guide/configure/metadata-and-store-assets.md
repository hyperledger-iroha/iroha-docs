---
translation_locale: fr
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les options de stockage des métadonnées et du registre {#metadata-and-ledger-storage-choices}

Le modèle de données Iroha 3 ne dispose pas d'un type d'actif distinct `Store` pour les données arbitraires sur la valeur de clé.

## Les métadonnées {#metadata}

Utilisez les métadonnées [](/fr/blockchain/metadata.md) pour de petits champs JSON appartenant à un objet de registre:

- afficher des noms et des étiquettes
- l'intégration IDs
- petits drapeaux politiques
- les haches, URIs, CIDs ou SoraFS qui pointent vers des charges utiles plus grandes;

Les métadonnées font partie de l'état du monde et sont renvoyées avec l'objet qui les possède. Gardez les clés stables, les valeurs compactes et les autorisations explicites. Ne stockez pas directement dans les métadonnées de grands documents, journaux ou un état d'application à haut rendement.

## Actifs numériques et NFTs {#numeric-assets-and-nfts}

Utiliser les actifs [](/fr/blockchain/assets.md) et [NFTs](/fr/blockchain/nfts.md) lorsque l'état est de valeur:

- actifs numériques pour les soldes fungibles
- NFTs pour les dossiers de propriété unique
- [RWAs](/fr/blockchain/rwas.md) et autres objets spécifiques à un domaine lorsque le modèle de données actif les expose.

Les actifs et NFTs ont leurs propres IDs, événements de cycle de vie, comportement de transfert et contrôles d'autorisation. Ils sont meilleurs que les métadonnées lorsque la propriété, la rareté ou l'historique des transferts sont importants.

## Données hors chaîne {#off-chain-data}

Utilisez le stockage hors chaîne pour les charges utiles importantes ou changeables.

- un hash de contenu
- un URI
- un chemin ou une référence manifeste SoraFS
- un engagement compact utilisé par une preuve de demande

Cela permet de maintenir le WSV petit tout en permettant aux applications de vérifier que la charge utile hors chaîne correspond à la référence sur la chaîne.

## Le choix d'un lieu {#choosing-a-location}

Utilisez cette règle générale:

- Si il s'agit d'un attribut compact d'un objet de registre, utilisez les métadonnées.
- Si elle est porteuse de valeur ou transférable, modélisez-la comme un actif, NFT, ou un objet spécifique au domaine.
- S'il s'agit d'un appareil de grande taille, à fort débit ou destiné aux applications privées, il doit être stocké en dehors du WSV et placé sur la chaîne avec une référence vérifiable.

Pour les autorisations en matière de métadonnées, voir [Permission Tokens ](/fr/reference/permissions.md).
