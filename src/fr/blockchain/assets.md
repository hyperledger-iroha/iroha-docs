---
translation_locale: fr
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les actifs {#assets}

Un actif Iroha est un solde numérique détenu par un compte. Tout solde concret indique un `AssetDefinition`, et la définition décrit comment cet actif peut être nommé, coulé, affiché et divisé.

## Définition de l'actif {#asset-definition}

Un `AssetDefinition` contient les éléments suivants:

- `id`: l'adresse de définition canonique des actifs
- `name`: un nom d'affichage lisible par l'homme
- `description`: une description facultative lisible par l'homme
- `alias`: alias facultatifs dans le formulaire `<name>#<domain>.<dataspace>` ou `<name>#<dataspace>`
- `spec`: précision numérique et contraintes pour les équilibres
- `mintable`: la politique de pérennité
- `logo`: optionnel `SoraFS` URI
- `metadata`: métadonnées de valeur clé arbitraire
- `balance_scope_policy`: si les soldes sont globaux ou limités par l'espace de données
- `owned_by`: le compte qui a enregistré ou détient la définition
- `total_quantity`: quantité totale émise
- `confidential_policy`: politique relative aux opérations d'actifs protégés

La définition d'actifs IDs sont des adresses opaques canoniques. Lorsqu'une définition est construite à partir d'un domaine et d'un nom, Iroha peut conserver cette projection de domaine/nom pour UX et les requêtes, mais le formulaire texte canonique est l'adresse générée.

## Le solde des actifs {#asset-balance}

Un `Asset` contient les éléments suivants:

- `id`: un `AssetId` qui combine la définition de l'actif, le compte du titulaire et le champ d'application du solde optionnel
- `value`: un solde de `Numeric`

Le compte détenteur est canonique et sans domaine. La définition de l'actif peut être projetée sous un domaine qualifié par espace de données, par exemple `payments.universal`.

## Résistant à l'usure {#mintability}

Les définitions d'actifs prennent en charge ces modes de mintabilité:

|Mode |Le sens .|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |L'actif peut être fabriqué et brûlé à plusieurs reprises. |
|`Once` |Le jeton d'approvisionnement fixe peut être coulé une fois et brûlé.|
|`Not` |Une marque d'approvisionnement fixe qui peut être brûlée mais pas coulée de nouveau.|
|`Limited(n)` |La politique permet l'émission de nouvelles unités d'actifs dans le cadre d'un nombre limité d'opérations supplémentaires |

Utilisation `Infinitely` pour les actifs élastiques normaux et `Once` ou `Limited(n)` pour les actifs à approvisionnement fixe ou limité. Ne pas utiliser `Not` en tant que politique initiale, sauf si l'offre d'actifs est déjà établie.

## La portée de l'équilibre {#balance-scope}

Le `balance_scope_policy` contrôle la façon dont les soldes sont mis en place:

- `Global`: un seau de solde par compte et définition d'actif
- `DataspaceRestricted`: les soldes sont répartis en fonction du contexte de l'espace de données

Les soldes limités par espace de données sont utiles lorsque la même définition d'actif est utilisée sur plusieurs Nexus bases de données, mais les soldes doivent rester isolés.

## Essayez le sur Taira {#try-it-on-taira}

Ces appels en lecture seulement montrent des définitions réelles d'actifs sur le testnet public Taira:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Découvrez la définition actuelle de l'actif des frais Taira XOR:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Recherchez des définitions qui contiennent des métadonnées:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Les trois exemples sont lisibles. Pour imprimer, brûler ou transférer des actifs sur Taira, utilisez un compte financé par les robinets et le flux protégé dans [Connectez-vous aux bases de données SORA Nexus](/fr/get-started/sora-nexus-dataspaces.md).

Pour un exemple d'actif Taira payant des frais, enregistrez l'aide au robinet à partir de [ Obtenez Testnet XOR sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) comme `taira_faucet_claim.py`, puis revendiquez d'abord l'actif du robinet et utilisez-le en tant qu'actif gaseur de transaction:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Ensuite, inclure `--metadata ./taira.tx-metadata.json` sur les commandes `ledger asset mint`, `ledger asset burn` et `ledger asset transfer`.

## Instructions {#instructions}

Les actifs peuvent être inscrits, coulés, brûlés et transférés selon les instructions spéciales Iroha:

- [`Register` et `Unregister`](/fr/blockchain/instructions.md#un-register)
- [`Mint` et `Burn`](/fr/blockchain/instructions.md#mint-burn)
- [`Transfer`](/fr/blockchain/instructions.md#transfer)
- [`SetKeyValue` et `RemoveKeyValue`](/fr/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Voir aussi:

- [Guide CLI](/fr/get-started/operate-iroha-via-cli.md)
- [Rust tutoriel](/fr/guide/tutorials/rust.md)
- [Python tutoriel](/fr/guide/tutorials/python.md)
- [JavaScript/TypeScript tutoriel ](/fr/guide/tutorials/javascript.md)
- [Modèle de données](/fr/blockchain/data-model.md)
- [NFTs](/fr/blockchain/nfts.md)
