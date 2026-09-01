---
translation_locale: fr
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

Un Iroha NFT est un objet de registre blockchain unique avec un seul propriétaire. Utilisez NFTs lorsqu'un enregistrement a besoin de sa propre identité, de ses métadonnées, de ses événements de cycle de vie et de sa sémantique de transfert de propriété, mais n'a pas besoin d'un solde numérique.

Contrairement à un [atout](/fr/blockchain/assets.md) numérique, un NFT n'a pas de précision, de politique d'émission d'actifs, ni de quantités par compte. Le NFT existe en tant qu'objet enregistré unique, et la propriété est suivie directement sur cet objet.

## Structure {#structure}

Un `Nft` enregistré contient :

- `id` : un `NftId`
- `content` : métadonnées qui décrivent le NFT
- `owned_by` : le compte qui possède le NFT

Le champ `content` est une carte `Metadata`. Gardez-le compact : stockez-y des champs descriptifs, des références stables, des hachages cryptographiques, URIs ou des chemins SoraFS. Stockez les gros documents, les médias ou l'état de l'application à forte rotation hors chaîne et ne conservez qu'une référence vérifiable sur le NFT.

## Essayez-le sur Taira {#try-it-on-taira}

Vérifiez si le testnet public Taira contient actuellement NFT enregistrements :

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

Vérifiez le document en direct OpenAPI pour les itinéraires NFT exposés par le nœud :

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Un tableau vide `items` est une réponse valide sur un testnet public. Cela signifie qu'il n'y a pas de NFTs dans la page actuelle, et non que les instructions NFT sont indisponibles.

## NFT Identifiants {#nft-ids}

`NftId` utilise cette forme de texte :

```text
name$domain
name$domain.dataspace
```

Par exemple, `badge$docs.universal` identifie le `badge` NFT dans le domaine `docs.universal`. Si l'espace de données est omis, l'analyseur actuel utilise l'espace de données `universal`, donc `badge$docs` se résout en `badge$docs.universal`.

Utilisez des noms stables pour les identifiants NFT. L'identifiant est l'identité de l'objet utilisée par les instructions, les requêtes, les permissions, les filtres d'événements et les références d'application.

## Cycle de vie {#lifecycle}

NFT les opérations du cycle de vie utilisent Iroha Opérations d'instruction :

- [`Register`](/fr/blockchain/instructions.md#un-register) crée le NFT avec initial `content`.
- [`Unregister`](/fr/blockchain/instructions.md#un-register) supprime le NFT.
- [`Transfer`](/fr/blockchain/instructions.md#transfer) changements `owned_by`.
- [`SetKeyValue` et `RemoveKeyValue`](/fr/blockchain/instructions.md#setkeyvalue-removekeyvalue) mettre à jour NFT métadonnées.

## Essayez-le localement {#try-it-locally}

Ces exemples supposent que vous avez lancé un réseau local et que vous disposez de la configuration client générée à partir du [guide de la CLI](/fr/get-started/operate-iroha-via-cli.md) :

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Le localnet généré configure déjà `wonderland.universal` et son bail SNS. Pour utiliser un domaine différent, créez-le d'abord avec le flux de travail déclaratif `app alias setup plan` et `app alias setup apply` décrit dans [Domaines](/fr/blockchain/domains.md#registration).

Enregistrez un NFT. L'enregistrement lit le contenu initial JSON depuis l'entrée standard :

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

Inspectez directement le NFT puis énumérez tous les NFTs avec des entrées complètes :

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Ajoutez une clé de métadonnées et lisez de nouveau le NFT :

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Supprimez la clé des métadonnées :

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Transférez éventuellement le NFT. Utilisez `ledger nft get` pour lire le propriétaire actuel à partir de `owned_by`, et utilisez `ledger account list all` pour trouver un ID de compte de destination.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Supprimez l'exemple NFT après le tutoriel. Si vous l'avez transféré, soit transférez-le de nouveau, soit soumettez la commande de désenregistrement avec la configuration du compte du propriétaire actuel.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Requêtes et événements {#queries-and-events}

Utiliser [`FindNfts`](/fr/reference/queries.md#assets-nfts-and-rwas) lister NFTs et [`FindNftsByAccountId`](/fr/reference/queries.md#assets-nfts-and-rwas) lister NFTs appartenant à un compte.

NFT l'enregistrement, la suppression, le transfert et les mises à jour des métadonnées émettent des événements de données NFT. Utilisez le filtre d'événements de données `Nft` lors de l'abonnement aux modifications du registre blockchain ou lors de la création de déclencheurs qui réagissent aux événements du cycle de vie NFT.

## Autorisations {#permissions}

La surface d'autorisation par défaut inclut des jetons spécifiques à NFT :

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Les contrôles d'autorisation sont appliqués par le validateur d'exécution logicielle actif, de sorte qu'un réseau peut personnaliser l'autorisation en mettant à niveau l'exécuteur. Voir [Jetons de permission](/fr/reference/permissions.md) pour la liste actuelle des jetons par défaut.

## Choisir NFTs {#choosing-nfts}

Utilisez un NFT pour les enregistrements où l'unicité et la propriété sont importantes :

- certificats, badges, licences et attestations
- dossiers d'adhésion ou d'accès
- enregistrements d'applications liés à l'identité ou appartenant à un compte
- références à des médias hors chaîne, des documents ou des manifestes techniques

Utilisez un actif numérique pour les soldes fongibles, et utilisez simplement [métadonnées](/fr/blockchain/metadata.md) lorsque les données ne sont qu’un attribut compact d’un objet existant du registre de la blockchain.

Voir aussi :

- [Actifs](/fr/blockchain/assets.md)
- [Métadonnées](/fr/blockchain/metadata.md)
- [Instructions](/fr/blockchain/instructions.md)
- [Requêtes](/fr/blockchain/queries.md)
