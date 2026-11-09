---
translation_locale: hy
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
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
- `balance_scope_policy`: արդյոք մնացորդը համընդհանուր է, թե՞ սահմանափակված տվյալների տարածքով:
- `owned_by`: այն հաշիվը, որը գրանցել է սահմանումը կամ ունի այն
- `total_quantity`: թողարկված ընդհանուր քանակություն
- `confidential_policy`: պաշտպանված ակտիվների գործողությունների քաղաքականություն

Ակտիվների սահմանումների նույնացուցիչները (IDs) կանոնական հասցեներ են, որոնց ներքին կառուցվածքը մեկնաբանելու կարիք չկա։ Եթե սահմանումը կազմված է տիրույթից և անունից, Iroha-ն կարող է պահպանել այդ տեսքը՝ օգտատիրոջ աշխատանքի (UX) և հարցումների համար։ Կանոնական տեքստային ներկայացումը գեներացված հասցեն է։

## Ակտիվի մնացորդ {#asset-balance}

`Asset` պարունակում է:

- `id`: `AssetId`, որը համատեղում է ակտիվի սահմանումը, պահապանների հաշիվը եւ ընտրանքային բալանդի շրջանակը
- `value`: `Numeric` մնացորդ

Տիրապետողի հաշիվը կանոնական է և կապված չէ տիրույթի հետ։ Ակտիվի սահմանումը կարող է ներկայացվել տվյալների տարածքը նշող տիրույթում, օրինակ՝ `payments.universal`։

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
- `DataspaceRestricted`: հաշվեկշիռները բաժանվում են տվյալների տարածքի համատեքստով

Տվյալների տարածքի սահմանափակ հաշվեկշիռները օգտակար են, երբ նույն ակտիվի սահմանումը օգտագործվում է մի քանի Nexus տվյալների տարածքներում, բայց հաշվեկշռները պետք է մնան մեկուսացված:

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

Բոլոր երեք օրինակները ընթերցվում են: Taira-ի ակտիվների մետաղադրույքի, այրելու կամ փոխանցելու համար օգտագործեք խողովակային ֆինանսավորվող հաշիվ եւ պահպանված հոսքը [ Կապակցվեք SORA Nexus տվյալների տիրույթներին](/hy/get-started/sora-nexus-dataspaces.md).

Հաշվարկ վճարող Taira ակտիվի օրինակում պահեք faucet օգնականը [Ստանալ թեստային ցանցի XOR Taira-ում](/hy/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) որպես `taira_faucet_claim.py`, ապա նախ պահանջեք ջրահեղրի ակտիվը եւ օգտագործեք այն որպես գործարքի գազային ակտիվ.

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Այնուհետեւ ներառեք `--metadata ./taira.tx-metadata.json` ՝ `ledger asset mint`, `ledger asset burn` եւ `ledger asset transfer` հրամաններում:

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
