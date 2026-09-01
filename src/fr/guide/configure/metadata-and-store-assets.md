---
translation_locale: fr
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Choix de stockage des métadonnées et du registre blockchain {#metadata-and-ledger-storage-choices}

Le modèle de données Iroha 3 n'a pas de type d'actif `Store` séparé pour les données arbitraires de type clé-valeur. Utilisez les options de stockage suivantes.

## Métadonnées {#metadata}

Utilisez [métadonnées](/fr/blockchain/metadata.md) pour les petits champs JSON qui appartiennent à un objet du registre de la blockchain :

- afficher les noms et les étiquettes
- identifiants d'intégration
- petits drapeaux de politique
- hachages cryptographiques, URIs, CIDs, ou SoraFS chemins qui pointent vers des charges utiles plus larges

Les métadonnées font partie de l'état mondial et sont renvoyées avec l'objet qui les possède. Gardez les clés stables, les valeurs compactes et les autorisations explicites. Ne stockez pas directement de grands documents, journaux ou l'état d'application à forte rotation dans les métadonnées.

## Actifs numériques et NFTs {#numeric-assets-and-nfts}

Utilisez [actifs](/fr/blockchain/assets.md) et [NFTs](/fr/blockchain/nfts.md) lorsque l'état a une valeur :

- actifs numériques pour les soldes fongibles
- NFTs pour les enregistrements possédés de manière unique
- [RWAs](/fr/blockchain/rwas.md) et d'autres objets spécifiques au domaine lorsque le modèle de données actif les expose

Les actifs et NFTs ont leurs propres identifiants, événements du cycle de vie, comportements de transfert et vérifications de permissions. Ils sont meilleurs que les métadonnées lorsque la propriété, la rareté ou l'historique des transferts est importante.

## Données hors chaîne {#off-chain-data}

Utilisez un stockage hors chaîne pour les charges utiles volumineuses ou modifiables. Ne stockez qu'une référence stable sur la chaîne, telle que :

- un hachage cryptographique de contenu
- un URI
- un chemin SoraFS ou une référence de manifeste technique
- un engagement compact utilisé par une preuve d'application

Cela permet de garder le WSV petit tout en permettant aux applications de vérifier que la charge utile hors chaîne correspond à la référence sur chaîne.

## Choisir un emplacement {#choosing-a-location}

Utilisez ce principe général :

- S'il s'agit d'un attribut compact d'un objet de registre blockchain, utilisez des métadonnées.
- S'il a une valeur ou est transférable, modélisez-le comme un actif, NFT, ou un objet spécifique au domaine.
- S'il est volumineux, à fort renouvellement ou privé à l'application, stockez-le en dehors du WSV et mettez une référence vérifiable sur la chaîne.

Pour les autorisations de métadonnées, voir [Jetons de permission](/fr/reference/permissions.md).
