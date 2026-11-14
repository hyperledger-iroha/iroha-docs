---
translation_locale: hy
translation_source: /blockchain/nfts.md
translation_source_hash: 216f59f1cebd73001dab75dcf235306082fb1c0759437f65ce34ec9e1ed51d4f
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# NFTs {#nfts}

Iroha NFT-ը եզակի գրասենյակային օբյեկտ է, որը ունի մեկ սեփականատեր: Օգտագործեք NFTs, երբ արձանագրությունը պահանջում է իր ինքնությունը, մեթադատները, կյանքի շրջանի իրադարձությունները եւ տիրապետության փոխանցման սեմանտիկան, բայց չի պահանջում թվային մնացորդ:

Ի տարբերություն թվային [ ակտիվի](/hy/blockchain/assets.md), NFT-ը չունի ճշգրտություն, mintability կամ հաշվեկվարկային քանակություններ: NFT-ը գոյություն ունի որպես մեկ գրանցված օբյեկտ, եւ սեփականությունը հետեւում է անմիջապես այդ օբյեկտին:

## Կազմակերպություն {#structure}

Գրանցված `Nft` պարունակում է:

- `id`: մի `NftId`
- `content`: մետադատա, որը նկարագրում է NFT
- `owned_by`: հաշիվը, որը պատկանում է NFT:

`content` դաշտը `Metadata` քարտեզ է: Պահպանեք այն համապարփակ. այնտեղ պահեք նկարագրական դաշտերը, կայուն հղումները, շիշները, URIs կամ SoraFS ուղիները: Խանրի՛ք մեծ փաստաթղթեր, լրատվամիջոցներ կամ բարձր քրոնային հավելվածների վիճակը անջատված եւ պահեք միայն ստուգելի հղում NFT:

## Փորձեք այն Taira {#try-it-on-taira}

Ստուգեք, թե արդյոք հանրային Taira փորձարկման ցանցում ներկայումս NFT գրանցումներ կան.

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

Փորձեք OpenAPI կենդանի փաստաթուղթը NFT երթուղիների համար, որոնք բաց են թողնում հանգույցը.

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Չոր `items` շարքը հանրային փորձարկման ցանցում վավեր պատասխան է: Դա նշանակում է, որ ընթացիկ էջում չկա NFTs, ոչ թե այն, որ NFT հրահանգները հասանելի չեն.

## NFT IDs {#nft-ids}

`NftId` օգտագործում է հետեւյալ տեքստային ձեւը.

```text
name$domain
name$domain.dataspace
```

Օրինակ՝ `badge$docs.universal`-ը նույնացնում է `docs.universal` տիրույթի `badge` NFT-ն։ Եթե տվյալների տարածքը բաց է թողնված, ընթացիկ վերլուծիչն օգտագործում է `universal` տվյալների տարածքը, ուստի `badge$docs`-ը լուծվում է որպես `badge$docs.universal`։

Օգտագործեք կայուն անուններ NFT IDs. ID-ը օբյեկտային նույնականությունն է, որն օգտագործվում է հրահանգների, հարցումների, թույլտվությունների, իրադարձությունների ֆիլտրերի եւ հավելվածի հղումների համար:

## Կյանքի ցիկլ {#lifecycle}

NFT կյանքի շրջանակի գործողությունների օգտագործումը Iroha Հատուկ հրահանգներ.

- [`Register`](/hy/blockchain/instructions.md#un-register) ստեղծում է NFT նախնական `content`:
- [`Unregister`](/hy/blockchain/instructions.md#un-register) հեռացնում է NFT:
- [`Transfer`](/hy/blockchain/instructions.md#transfer) փոփոխություններ `owned_by`.
- [`SetKeyValue` եւ `RemoveKeyValue`](/hy/blockchain/instructions.md#setkeyvalue-removekeyvalue) թարմացումներ NFT մետադատա:

## Փորձեք տեղական {#try-it-locally}

Այս օրինակները ենթադրում են, որ դուք գործարկել եք տեղական ցանց եւ ունեք ստեղծված հաճախորդի կարգավորումը [CLI ուղեցույցից](/hy/get-started/operate-iroha-via-cli.md):

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN='<OWNED_DOMAIN>.universal'
export NFT_ID="badge_intro\$$NFT_DOMAIN"
```

Ստեղծված տեղային ցանցն իր հաճախորդի համար հավելվածի տիրույթ չի գրանցում։ `NFT_DOMAIN`-ը սահմանեք որպես տիրույթ, որը պատկանում է ստորագրող հաշվին, կամ որի համար այն ունի `CanRegisterNft` իրավունք։ Այն ստեղծելու համար օգտագործեք [Տիրույթներ](/hy/blockchain/domains.md#registration) բաժնում նկարագրված դեկլարատիվ `app alias setup plan` և `app alias setup apply` հոսքը։

Գրանցել NFT: Գրանցումը կարդում է սկզբնական բովանդակությունը JSON ստանդարտ մուտքից.

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft register --id "$NFT_ID"
```

Պարզապես ստուգեք NFT եւ այնուհետեւ ամբողջական գրառումներով բոլոր NFTs ցուցակները:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list --all
```

Մետադատա բանալին ավելացրեք եւ կրկին կարդացեք NFT:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Հեռացրեք մետադատա բանալին.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Ըստ ցանկության փոխանցեք NFT-ն։ Ընթացիկ սեփականատիրոջը `owned_by`-ից կարդալու համար օգտագործեք `ledger nft get`, իսկ ստացող հաշվի ID-ն գտնելու համար՝ `account list --all`։

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  account list --all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Հեռացրեք NFT օրինակը անցնելուց հետո: Եթե այն փոխանցել եք, կամ վերափոխեք այն կամ ներկայիս սեփականատիրոջ հաշիվի կարգավորմամբ ուղարկեք չկանխատեսելու հրամանը.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft unregister --id "$NFT_ID"
```

## Հարցումներ եւ իրադարձություններ {#queries-and-events}

Օգտագործեք [`FindNfts`](/hy/reference/queries.md#assets-nfts-and-rwas), որպեսզի ցուցակում ներկայացնեք NFTs եւ [`FindNftsByAccountId`](/hy/reference/queries.md#assets-nfts-and-rwas), որպեսզի ցուցակագրեք հաշիվի սեփականությամբ գտնվող NFTs:

NFT գրանցման, ջնջման, փոխանցման եւ մետադատա տվյալների թարմացումները արտանետում են NFT տվյալների իրադարձություններ: Օգտագործեք `Nft` տվյալների իրադրության ֆիլտրը, երբ բաժանորդագրվում եք ledger- ի փոփոխություններին կամ կառուցում եք գործարկիչներ, որոնք արձագանքում են NFT կյանքի շրջանի իրադարձությունների վրա:

## թույլտվություններ {#permissions}

Սովորական թույլտվության մակերեսը ներառում է NFT-ի հատուկ տոքեր.

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Թույլտվությունների ստուգումները իրականացվում են ակտիվ վավերացնողի կողմից, այնպես որ ցանցը կարող է կատարելագործողին թարմացնելով թույլտվությունը հարմարեցնել: Նայեք [Թույլտվության տոքերները](/hy/reference/permissions.md) ՝ ներկայիս նախնական տոքերների ցուցակի համար:

## Ընտրում NFTs {#choosing-nfts}

Օգտագործեք NFT տվյալների համար, որտեղ առանձնահատկությունն ու սեփականությունը կարեւոր են.

- վկայականներ, նշաններ, արտոնագրեր եւ վավերացություններ
- անդամակցության կամ մուտքի գրառումներ
- Անձնագրային կամ հաշիվի սեփականությամբ գրանցված դիմումների գրառումներ
- արտահոսքային լրատվամիջոցների, փաստաթղթերի կամ մանիֆեստների հղումներ

Օգտագործեք թվային ակտիվ ֆունգիբալ մնացորդների համար եւ օգտագործեք պարզ [ մետադատա](/hy/blockchain/metadata.md), երբ տվյալները միայն առկա գրքի օբյեկտի համապարփակ հատկանիշ են:

Նայեք նաեւ.

- [Ակտիվներ](/hy/blockchain/assets.md)
- [Մետադատա](/hy/blockchain/metadata.md)
- [հրահանգներ](/hy/blockchain/instructions.md)
- [Հարցումներ](/hy/blockchain/queries.md)
