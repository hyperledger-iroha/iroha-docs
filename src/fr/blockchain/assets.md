---
translation_locale: fr
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les actifs {#assets}

Une Iroha L'actif est un solde numérique détenu par un compte.
l'équilibre des points à un `AssetDefinition`, et la définition décrit comment
l'actif peut être nommé, coulé, affiché et partagé.

## Définition des actifs {#asset-definition}

Une `AssetDefinition` contient:

- `id`: l'adresse de définition canonique des actifs
- `name`: un nom d'affichage lisible par l'homme
- `description`: description facultative lisible par l'homme
- `alias`: des alias facultatifs dans `<name>#<domain>.<dataspace>` ou
  `<name>#<dataspace>` forme
- `spec`: précision numérique et contraintes pour les équilibres
- `mintable`: la politique de rentabilité
- `logo`: optionnel `SoraFS` URI
- `metadata`: métadonnées de valeur clé arbitraire
- `balance_scope_policy`: si les soldes sont globaux ou
  Restrictions d'espace de données
- `owned_by`: le compte qui a enregistré ou possède la définition
- `total_quantity`: quantité totale émise
- `confidential_policy`: politique en matière d'opérations d'actifs protégés

Définition des actifs IDs sont des adresses canoniques opaques.
construit à partir d'un domaine et d'un nom, Iroha peut conserver ce nom de domaine
projection pour UX et les requêtes, mais la forme texte canonique est le généré
l'adresse.

## Balance des actifs {#asset-balance}

Une `Asset` contient:

- `id`: une `AssetId`, qui combine la définition de l'actif, le compte du titulaire,
  et la portée de l'équilibre facultatif
- `value`: à la `Numeric` équilibre

Le compte du titulaire est canonique et sans domaine.
projeté dans un domaine qualifié par espace de données, par exemple
`payments.universal`.

## Résistant à l'usure {#mintability}

Les définitions d'actifs prennent en charge ces modes de mintabilité:

| Mode de fonctionnement         | La signification                                                           |
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` | L'actif peut être fabriqué et brûlé à plusieurs reprises.    |
| `Once`       | Il peut être coulé une fois puis brûlé.        |
| `Not`        | Un jeton d'approvisionnement fixe qui peut être brûlé, mais ne pas encore coulé.       |
| `Limited(n)` | La mouture est autorisée pour un nombre limité d'opérations supplémentaires. |

Utilisation `Infinitely` pour les actifs élastiques normaux et `Once` ou `Limited(n)` pour
les actifs à approvisionnement fixe ou limité. `Not` en tant qu'initiative
politique à moins que l'offre d'actifs ne soit déjà établie.

## Éventail de la balance {#balance-scope}

Les `balance_scope_policy` contrôle la façon dont les balances sont placées dans un seau:

- `Global`: un seau de solde par compte et définition d'actif
- `DataspaceRestricted`: Les équilibres sont partagés selon le contexte du espace de données

Les soldes restreints par espace de données sont utiles lorsque la même définition d'actif est
utilisés à travers plusieurs Nexus les espaces de données, mais les équilibres doivent rester isolés.

## Essayez-le . Taira {#try-it-on-taira}

Ces appels à lecture seule montrent des définitions d' actifs réelles sur le public Taira réseau de test:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Trouver le courant Taira XOR définition des actifs de redevances:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Recherchez les définitions qui contiennent des métadonnées:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Les trois exemples sont lisibles. Taira, utiliser un
compte financé par les robinets et le flux de
[Connectez-vous SORA Nexus Les bases de données](/fr/get-started/sora-nexus-dataspaces.md).

Pour une redevance Taira exemple d'actif, économiser l'aide au robinet
[Prenez le testnet XOR sur le Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
comme `taira_faucet_claim.py`, puis prétendre d'abord à l'actif du robinet et utiliser comme
actif gazier de transaction:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Puis inclure `--metadata ./taira.tx-metadata.json` sur le `ledger asset mint`,
`ledger asset burn`, et `ledger asset transfer` Les commandes.

## Instructions {#instructions}

Les actifs peuvent être inscrits, coulés, brûlés et transférés avec Iroha
Instructions spéciales:

- [`Register` et `Unregister`](/fr/blockchain/instructions.md#un-register)
- [`Mint` et `Burn`](/fr/blockchain/instructions.md#mint-burn)
- [`Transfer`](/fr/blockchain/instructions.md#transfer)
- [`SetKeyValue` et `RemoveKeyValue`](/fr/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Voir aussi:

- [CLI guide](/fr/get-started/operate-iroha-via-cli.md)
- [Rust tutoriel](/fr/guide/tutorials/rust.md)
- [Python tutoriel](/fr/guide/tutorials/python.md)
- [JavaScript/TypeScript tutoriel](/fr/guide/tutorials/javascript.md)
- [Modèle de données](/fr/blockchain/data-model.md)
- [NFTs](/fr/blockchain/nfts.md)
