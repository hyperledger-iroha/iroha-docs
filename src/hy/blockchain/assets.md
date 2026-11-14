---
translation_locale: hy
translation_source: /blockchain/assets.md
translation_source_hash: 4d0a3f54a0c70d08d11160b9ec66d6538aa2c49c7771a13e4a070b61a9cb3e4b
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Ակտիվներ {#assets}

Iroha ակտիվը հաշիվի կողմից պահվող թվային մնացորդ է: Յուրաքանչյուր կոնկրետ հավասարակչություն ցույց է տալիս `AssetDefinition`, եւ սահմանումը նկարագրում է, թե ինչպես կարող է այդ ակտիվը անվանել, գծել, ցուցադրել եւ բաժանել:

## Ակտիվի սահմանում {#asset-definition}

`AssetDefinition` պարունակում է:

- `id`: ակտիվի անվանական սահմանման հասցեն
- `name`: մարդու կողմից ընթերցելի ցուցադրման անվանում
- `description`: մարդու համար ընթերցելի ընտրական նկարագրություն
- `alias`: նախընտրական կեղծանուններ՝ `<name>#<domain>.<dataspace>` կամ `<name>#<dataspace>` ձեւով
- `spec`: թվային ճշգրտություն եւ մնացորդի սահմանափակումներ
- `mintable`: ներմուծելիության քաղաքականությունը
- `logo`: նախընտրական `SoraFS` URI
- `metadata`: առանցքային արժեքի կամայական մետադատա
- `balance_scope_policy`՝ մնացորդները համընդհանո՞ւր են, թե՞ սահմանափակված են տվյալների տարածքով
- `owned_by`: այն հաշիվը, որը գրանցել է սահմանումը կամ ունի այն
- `total_quantity`: թողարկված ընդհանուր քանակություն
- `confidential_policy`: պաշտպանված ակտիվների գործողությունների քաղաքականություն

Ակտիվների սահմանումների նույնացուցիչները (IDs) կանոնական հասցեներ են, որոնց ներքին կառուցվածքը մեկնաբանելու կարիք չկա։ Եթե սահմանումը կազմված է տիրույթից և անունից, Iroha-ն կարող է պահպանել այդ տեսքը՝ օգտատիրոջ աշխատանքի (UX) և հարցումների համար։ Կանոնական տեքստային ներկայացումը գեներացված հասցեն է։

## Ակտիվի մնացորդ {#asset-balance}

`Asset` պարունակում է:

- `id`: `AssetId`, որը համատեղում է ակտիվի սահմանումը, պահապանների հաշիվը եւ ընտրանքային բալանդի շրջանակը
- `value`: `Numeric` մնացորդ

Տիրապետող հաշիվը կանոնական է և տիրույթ չի պարունակում։ Ակտիվի սահմանումը կարող է ներկայացվել տվյալների տարածքով ամբողջությամբ որոշված տիրույթի ներքո, օրինակ՝ `payments.universal`։

## Պարպասման հնարավորությունը {#mintability}

Ակտիվի սահմանումը թույլ է տալիս ընտրել լրացուցիչ միավորների թողարկման հետևյալ ռեժիմներից մեկը։

|Մոդը |Նշում |
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` | Ակտիվի շրջանառվող քանակը փոփոխական է․ նոր միավորներ կարելի է բազմիցս թողարկել, իսկ շրջանառվողները՝ այրել։ |
|`Once` |Հաստատված մատակարարման նշան. Այն կարող է մեկ անգամ փորվել եւ հետո այրվել: |
|`Not` |Փոփոխական մատակարարման նշան, որը կարող է այրվել, բայց չի կրկնվում: |
|`Limited(n)` |Քաղաքականությունը թույլ է տալիս ակտիվի նոր միավորներ թողարկել սահմանափակ թվով լրացուցիչ գործողություններով: |

Օգտագործեք `Infinitely` սովորական էլաստիկ ակտիվների համար եւ `Once` կամ `Limited(n)` ֆիքսված մատակարարման կամ սահմանափակ մատակարարության ակտիվների համար: Մի օգտագործեք `Not` որպես նախնական քաղաքականություն, եթե ակտիվի մատակարարումը արդեն հաստատված չէ:

## Բալանսի շրջանակը {#balance-scope}

`balance_scope_policy` -ը վերահսկում է, թե ինչպես են բալանսերը պահվում:

- `Global`: հաշվառման եւ ակտիվների սահմանման համար մեկ մնացորդի տուփ
- `DataspaceRestricted`՝ մնացորդները բաժանվում են ըստ տվյալների տարածքի համատեքստի

Տվյալների տարածքով սահմանափակված մնացորդներն օգտակար են, երբ նույն ակտիվի սահմանումն օգտագործվում է մի քանի SORA Nexus տվյալների տարածքներում, բայց մնացորդները պետք է մնան մեկուսացված։

## Փորձեք այն Taira {#try-it-on-taira}

Այս միայն ընթերցված զանգերը ցույց են տալիս իրական ակտիվների սահմանումները հանրային Taira թեստային ցանցում.

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Գտեք ընթացիկ Taira XOR վճարային ակտիվի սահմանումը.

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Փնտրեք սահմանումներ, որոնք պարունակում են մետադատա:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Բոլոր երեք օրինակներն ընթերցման գործողություններ են։ Taira-ում ակտիվներ թողարկելու, այրելու կամ փոխանցելու համար օգտագործեք փորձնական միջոցների տրամադրման ծառայությամբ ֆինանսավորված հաշիվ և [Միանալ SORA Nexus տվյալների տարածքներին](/hy/get-started/sora-nexus-dataspaces.md) բաժնի պաշտպանական ստուգումներով հոսքը։

Taira-ում վճարովի ակտիվի օրինակի համար նախ ֆինանսավորեք ստորագրող հաշիվը [Ստանալ փորձնական XOR Taira-ում](/hy/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) բաժնի նախապես պատրաստվող միջոցների ստացման հոսքով։ Ապա `ledger asset mint`, `ledger asset burn` և `ledger asset transfer` հրամաններին փոխանցեք `--fee-payer authority`․ CLI-ն ստորագրելուց առաջ հաշվարկում և ցույց է տալիս ճշգրիտ վճարը՝ Taira-ի վճարային ակտիվով։

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "<ASSET_DEFINITION_BASE58>" \
  --account "<TAIRA_I105_ACCOUNT_ID>" \
  --to "<RECIPIENT_I105_ACCOUNT_ID>" \
  --quantity 1
```

## Ուղարկումներ {#instructions}

Ակտիվները կարելի է գրանցել, թողարկել, այրել և փոխանցել Iroha-ի հատուկ հրահանգներով։

- [`Register` եւ `Unregister`](/hy/blockchain/instructions.md#un-register)
- [`Mint` եւ `Burn`](/hy/blockchain/instructions.md#mint-burn)
- [`Transfer`](/hy/blockchain/instructions.md#transfer)
- [`SetKeyValue` եւ `RemoveKeyValue`](/hy/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Նայեք նաեւ.

- [CLI ուղեցույց](/hy/get-started/operate-iroha-via-cli.md)
- [Rust դասընթաց](/hy/guide/tutorials/rust.md)
- [Python դասընթաց](/hy/guide/tutorials/python.md)
- [JavaScript/TypeScript դասընթաց](/hy/guide/tutorials/javascript.md)
- [Տվյալների մոդել](/hy/blockchain/data-model.md)
- [NFTs](/hy/blockchain/nfts.md)
