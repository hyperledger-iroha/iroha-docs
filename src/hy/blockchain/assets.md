---
translation_locale: hy
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Գործիքներ {#assets}

Iroha ակտիվը հաշիվի կողմից պահվող թվային հավասարակշռություն է: Յուրաքանչյուր կոնկրետ հավասարակչություն ցույց է տալիս `AssetDefinition`, եւ սահմանումը նկարագրում է, թե ինչպես կարող է այդ ակտիվը անվանել, գծել, ցուցադրել եւ բաժանել:

## Աշունների սահմանումը {#asset-definition}

`AssetDefinition` պարունակում է:

- `id`: ակտիվի անվանական սահմանման հասցեն
- `name`: մարդու կողմից ընթերցելի ցուցադրման անվանում
- `description`: մարդու համար ընթերցելի ընտրական նկարագրություն
- `alias`: նախընտրական կեղծանուններ՝ `<name>#<domain>.<dataspace>` կամ `<name>#<dataspace>` ձեւով
- `spec`: թվային ճշգրտություն եւ հավասարակշռության սահմանափակումներ
- `mintable`: ներմուծելիության քաղաքականությունը
- `logo`: նախընտրական `SoraFS` URI
- `metadata`: առանցքային արժեքի կամայական մետադատա
- `balance_scope_policy`: արդյոք հավասարակշռությունը համընդհանուր է, թե՞ սահմանափակված տվյալների տարածքով:
- `owned_by`: այն հաշիվը, որը գրանցել է սահմանումը կամ ունի այն
- `total_quantity`: թողարկված ընդհանուր քանակություն
- `confidential_policy`: պաշտպանված ակտիվների գործողությունների քաղաքականություն

Աշունների սահմանումը IDs կանոնական անբացատրելի հասցեներ են: Երբ սահմանում է կառուցվում տիրույթից եւ անունից, Iroha կարող է պահել այդ տիրույթի / անվանումի նախագիծը UX եւ հարցումների համար, բայց կանոնական տեքստային ձեւը ստեղծված հասցեն է:

## Գործիքների հավասարակշռությունը {#asset-balance}

`Asset` պարունակում է:

- `id`: `AssetId`, որը համատեղում է ակտիվի սահմանումը, պահապանների հաշիվը եւ ընտրանքային բալանդի շրջանակը
- `value`: `Numeric` հավասարակշռություն

Հաշվի տիրակալը կանոնիկ է եւ չունի դոմեյն: Աշունների սահմանումը կարող է կանխատեսվել տվյալների տարածքի համար նախատեսված դոմեյնի ներքո, օրինակ `payments.universal`.

## Պարպասման հնարավորությունը {#mintability}

Աշունների սահմանումները աջակցում են այս mintability ռեժիմներին.

|Մոդը |Նշում |
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |Էլաստիկ մատակարարում. Աշունը կարող է բազմիցս փորվել եւ այրվել: |
|`Once` |Հաստատված մատակարարման նշան. Այն կարող է մեկ անգամ փորվել եւ հետո այրվել: |
|`Not` |Փոփոխական մատակարարման նշան, որը կարող է այրվել, բայց չի կրկնվում: |
|`Limited(n)` |Մինտինգը թույլատրվում է սահմանափակ թվով լրացուցիչ գործողությունների համար: |

Օգտագործեք `Infinitely` սովորական էլաստիկ ակտիվների համար եւ `Once` կամ `Limited(n)` ֆիքսված մատակարարման կամ սահմանափակ մատակարարության ակտիվների համար: Մի օգտագործեք `Not` որպես նախնական քաղաքականություն, եթե ակտիվի մատակարարումը արդեն հաստատված չէ:

## Բալանսի շրջանակը {#balance-scope}

`balance_scope_policy` -ը վերահսկում է, թե ինչպես են բալանսերը պահվում:

- `Global`: հաշվառման եւ ակտիվների սահմանման համար մեկ հավասարակշռության տուփ
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

Հաշվարկ վճարող Taira ակտիվի օրինակում պահեք ջրհեղեղի օգնականը [Get Testnet XOR on Taira](/hy/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) որպես `taira_faucet_claim.py`, ապա նախ պահանջեք ջրահեղրի ակտիվը եւ օգտագործեք այն որպես գործարքի գազային ակտիվ.

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Այնուհետեւ ներառեք `--metadata ./taira.tx-metadata.json` ՝ `ledger asset mint`, `ledger asset burn` եւ `ledger asset transfer` հրամաններում:

## Ուղարկումներ {#instructions}

Գործիքները կարող են գրանցվել, թանկացվել, այրվել եւ փոխանցվել Iroha հատուկ հրահանգներով.

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
