---
translation_locale: fr
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Un Iroha NFT est un objet de registre unique avec un propriétaire. Utilisez NFTs lorsqu'un enregistrement a besoin de sa propre identité, de métadonnées, d'événements du cycle de vie et de la sémantique de transfert de propriété, mais n'a pas besoin d'un équilibre numérique.

Contrairement à un actif numérique [](/fr/blockchain/assets.md), un NFT n'a pas de précision, de mintabilité ou de quantités par compte. Le NFT existe comme un seul objet enregistré et la propriété est suivie directement sur cet objet.

## La structure {#structure}

Un `Nft` enregistré contient:

- `id`: une `NftId`
- `content`: métadonnées qui décrivent le NFT
- `owned_by`: le compte qui détient le NFT

Le champ `content` est une carte `Metadata`. Gardez-le compact: stockez les champs descriptifs, les références stables, les hachages, les chemins URIs ou SoraFS là-bas. Stoquez les grands documents, médias ou l'état de l'application à haute fréquence hors chaîne et gardez uniquement une référence vérifiable sur le NFT.

## Essayez le sur Taira {#try-it-on-taira}

Vérifiez que le réseau de test public Taira possède actuellement des enregistrements NFT:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

Vérifiez le document OpenAPI en direct pour les itinéraires NFT exposés par le nœud:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Un tableau `items` vide est une réponse valide sur un réseau de test public. Cela signifie qu'il n'y a pas de NFTs dans la page en cours, pas que les instructions NFT ne soient pas disponibles.

## NFT IDs {#nft-ids}

`NftId` utilise le formulaire suivant:

```text
name$domain
name$domain.dataspace
```

Par exemple, `badge$docs.universal` désigne les `badge` NFT dans le `docs.universal` Si l'espace de données est omis, l'analyseur actuel utilise le `universal` l'espace de données, donc `badge$docs` décide de `badge$docs.universal`.

Utilisez des noms stables pour NFT IDs. L'identité d'objet utilisée par les instructions, les requêtes, les autorisations, les filtres d'événements et les références d'application est le ID.

## Cycle de vie {#lifecycle}

NFT utilisation des opérations du cycle de vie Iroha Instructions particulières:

- [`Register`](/fr/blockchain/instructions.md#un-register) crée le NFT avec l'original `content`.
- [`Unregister`](/fr/blockchain/instructions.md#un-register) élimine le NFT.
- [Les modifications de `Transfer`](/fr/blockchain/instructions.md#transfer) à `owned_by`.
- [La mise à jour des métadonnées `SetKeyValue` et `RemoveKeyValue`](/fr/blockchain/instructions.md#setkeyvalue-removekeyvalue) NFT

## Essayez de le faire localement {#try-it-locally}

Ces exemples supposent que vous avez lancé un réseau local et que la configuration du client a été générée à partir du guide [CLI ](/fr/get-started/operate-iroha-via-cli.md):

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Le localnet généré définit déjà `wonderland.universal` et son bail SNS. Pour utiliser un domaine différent, créez-le d'abord avec le flux de travail déclaratif `app alias setup plan` et `app alias setup apply` décrit dans [Domains](/fr/blockchain/domains.md#registration).

Enregistrer un NFT. L'enregistrement lit le contenu initial JSON à partir de l'entrée standard:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

Inspecter directement le NFT puis répertorier tous les NFTs avec des entrées complètes:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Ajoutez une clé de métadonnées et lisez à nouveau le NFT:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Supprimer la clé de métadonnées:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Transfert optionnellement le NFT. Utilisez `ledger nft get` pour lire le propriétaire actuel de `owned_by`, et utilisez `ledger account list all` pour trouver un compte de destination ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Retirez l'exemple NFT après le passage. Si vous l'avez transféré, transférez-le de nouveau ou soumettez la commande non enregistrée avec la configuration du compte actuel du propriétaire.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Des questions et des événements {#queries-and-events}

Utilisez [`FindNfts`](/fr/reference/queries.md#assets-nfts-and-rwas) pour répertorier NFTs et [`FindNftsByAccountId`](/fr/reference/queries.md#assets-nfts-and-rwas) pour répertorian NFTs détenus par un compte.

NFT Les mises à jour de l'enregistrement, de la suppression, du transfert et des métadonnées émettent NFT les événements de données. `Nft` Filtre d'événements de données lors de l'abonnement à des modifications du registre ou à des déclencheurs de construction qui réagissent NFT événements du cycle de vie.

## Autorisations {#permissions}

La surface d'autorisation par défaut comprend les jetons spécifiques à NFT:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Les contrôles d'autorisation sont exécutés par le validateur de temps d'exécution actif, afin qu'un réseau puisse personnaliser l'autonomisation en mettant à jour l'exécuteur. Voir [Permission Tokens](/fr/reference/permissions.md) pour la liste actuelle des jetons par défaut.

## Le choix de NFTs {#choosing-nfts}

Utiliser un NFT pour les enregistrements où l'unicité et la propriété sont importantes:

- certificats, badges, licences et attestations
- enregistrements d'adhésion ou d'accès
- enregistrements des demandes liés à l'identité ou détenus par le compte
- des références à des médias, documents ou manifestes hors chaîne

Utilisez un actif numérique pour les soldes fungibles, et utilisez des métadonnées [ simples ](/fr/blockchain/metadata.md) lorsque les données ne sont qu'un attribut compact d'un objet de registre existant.

Voir aussi:

- [Les actifs ](/fr/blockchain/assets.md)
- [Metadonnées ](/fr/blockchain/metadata.md)
- [Instructions ](/fr/blockchain/instructions.md)
- [Les questions ](/fr/blockchain/queries.md)
