---
translation_locale: fr
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les actifs

Une Iroha L'actif est un solde numérique détenu par un compte.
l'équilibre des points à un `AssetDefinition`, et la définition décrit comment
l'actif peut être nommé, imprimé, affiché et partagé.

## Définition des actifs

Une `AssetDefinition` contient:

- `id`: l'adresse de définition canonique des actifs
- `name`: un nom d'affichage lisible par l'homme
- `description`: description facultative lisible par l'homme
- `alias`: alias facultatif dans `<name>#<domain>.<dataspace>` ou
  `<name>#<dataspace>` forme
- `spec`: précision numérique et contraintes pour les équilibres
- `mintable`: la politique de mobilité
- `logo`: facultatif `SoraFS` URI
- `metadata`: métadonnées de valeur clé arbitraire
- `balance_scope_policy`: si les soldes sont globaux ou
  Restrictions de l'espace de données
- `owned_by`: le compte qui a enregistré ou possède la définition
- `total_quantity`: quantité totale émise
- `confidential_policy`: politique pour les opérations d'actifs protégés

Les identifiants de définition d'actifs sont des adresses opaques canoniques.
construit à partir d'un domaine et d'un nom, Iroha peut conserver ce nom de domaine
la projection pour UX et les requêtes, mais la forme de texte canonique est la générée
l'adresse.

## Balance des actifs

Une `Asset` contient:

- `id`une: `AssetId`, qui combine la définition d'actif, le compte du titulaire,
  et la portée de l'équilibre facultatif
- `value`A: `Numeric` équilibre

Le compte du titulaire est canonique et sans domaine.
projeté dans un domaine qualifié par espace de données, par exemple
`payments.universal`- Je ne sais pas .

## Résistant à l'usure

Les définitions d'actifs prennent en charge ces modes de mintabilité:

| Mode de fonctionnement         | La signification                                                           |
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` | L'actif peut être fabriqué et brûlé à plusieurs reprises.    |
| `Once`       | Il peut être coulé une fois puis brûlé.        |
| `Not`        | Un jeton d'approvisionnement fixe qui peut être brûlé, mais qui ne peut pas être coulé.       |
| `Limited(n)` | La mouture est autorisée pour un nombre limité d'opérations supplémentaires. |

Utilisation `Infinitely` pour les actifs élastiques normaux et `Once` ou `Limited(n)` pour
les actifs à approvisionnement fixe ou à approvisionnement limité. `Not` en tant qu'initiative
politique à moins que l'offre d'actifs ne soit déjà établie.

## Éventail de la balance

Les `balance_scope_policy` contrôle la façon dont les balances sont placées dans un seau:

- `Global`: un seau de solde par compte et définition d'actif
- `DataspaceRestricted`: les équilibres sont divisés par contexte de l'espace de données

Les soldes restreints par espace de données sont utiles lorsque la même définition d'actif est
Il est utilisé dans plusieurs espaces de données Nexus, mais les équilibres doivent rester isolés.

## Essayez sur Taira.

Ces appels à lecture seule montrent des définitions d'actifs réelles sur le réseau de test public Taira:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Trouvez la définition actuelle de l'actif Taira XOR:

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

Pour fabriquer, brûler ou transférer des actifs sur Taira, utilisez un
compte financé par les robinets et le flux de
[Connectez-vous SORA Les espaces de données Nexus](/get-started/sora-nexus-dataspaces.md)- Je ne sais pas .

Pour un exemple d'actif Taira payant, économisez l'aide au robinet
[Obtenez le testnet XOR sur Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
comme `taira_faucet_claim.py`, puis revendiquer d'abord l' actif du robinet et l' utiliser comme
actif de gaz de transaction:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Puis inclure `--metadata ./taira.tx-metadata.json` sur le `ledger asset mint`Il y en a .
`ledger asset burn`, et `ledger asset transfer` Les commandes.

## Instructions

Les actifs peuvent être enregistrés, cousés, brûlés et transférés avec Iroha
Instructions spéciales:

- [`Register` et `Unregister`](/blockchain/instructions.md#un-register)
- [`Mint` et `Burn`](/blockchain/instructions.md#mint-burn)
- [`Transfer`](/blockchain/instructions.md#transfer)
- [`SetKeyValue` et `RemoveKeyValue`](/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Voir aussi:

- [Guide des CLI](/get-started/operate-iroha-via-cli.md)
- [Tutoriel sur la rouille](/guide/tutorials/rust.md)
- [Tutoriel Python](/guide/tutorials/python.md)
- [Le tutoriel JavaScript/TypeScript](/guide/tutorials/javascript.md)
- [Modèle de données](/blockchain/data-model.md)
- [NFTs](/blockchain/nfts.md)
