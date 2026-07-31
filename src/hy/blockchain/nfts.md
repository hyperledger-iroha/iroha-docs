---
translation_locale: hy
translation_source: /blockchain/nfts.md
translation_source_hash: 335eacd30c5964659baeeae8ac937805f1d4d786dd42a36e5164bbe75ef7e360
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Iroha NFT-ը եզակի գրասենյակային օբյեկտ է, որը ունի մեկ սեփականատեր: Օգտագործեք NFTs, երբ արձանագրությունը պահանջում է իր ինքնությունը, մեթադատները, կյանքի շրջանի իրադարձությունները եւ տիրապետության փոխանցման սեմանտիկան, բայց չի պահանջում թվային հավասարակշռություն:

Ի տարբերություն թվային [ ակտիվի](/hy/blockchain/assets.md), NFT-ը չունի ճշգրտություն, mintability կամ հաշվեկվարկային քանակություններ: NFT-ը գոյություն ունի որպես մեկ գրանցված օբյեկտ, եւ սեփականությունը հետեւում է անմիջապես այդ օբյექტին:

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

Օրինակ, `badge$docs.universal` բացահայտում է `badge` NFT `docs.universal` տիրույթում: Եթե տվյալների տարածքը բացակայում է, ընթացիկ զննարկիչը օգտագործում է `universal` տվյալների տարածությունը, այնպես որ `badge$docs` լուծվում է որպես `badge$docs.universal`.

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
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Ստեղծված տեղական ցանցը արդեն ստեղծում է `wonderland.universal` եւ իր SNS վարձակալության պայմանագիրը: Օգտագործելու համար այլ տիրույթ, նախ ստեղծեք այն հայտարարագրային `app alias setup plan` եւ `app alias setup apply` աշխատանքային հոսքի միջոցով, որոնք նկարագրվում են [Տիրույթներում](/hy/blockchain/domains.md#registration):

Գրանցել NFT: Գրանցումը կարդում է սկզբնական բովանդակությունը JSON ստանդարտ մուտքից.

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

Պարզապես ստուգեք NFT եւ այնուհետեւ ամբողջական գրառումներով բոլոր NFTs ցուցակները:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Մետադատա բանալին ավելացրեք եւ կրկին կարդացեք NFT:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Հեռացրեք մետադատա բանալին.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Ընտրական կերպով փոխանցել NFT. Օգտագործել `ledger nft get` կարդալ ներկայիս սեփականատերը `owned_by`, եւ օգտագործումը `ledger account list all` նպատակային հաշիվ գտնելու համար ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Մաքրեք, երբ ավարտել եք: Եթե դուք փոխանցեցիք NFT, գործարկեք այս հրամանը ներկայիս սեփականատիրոջ հաշիվի կարգավորմամբ կամ փոխանցեք NFT-ը առաջինը.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Հարցեր եւ իրադարձություններ {#queries-and-events}

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

Օգտագործեք թվային ակտիվ ֆունգիբալ հավասարակշռման համար եւ օգտագործեք պարզ [ մետադատա](/hy/blockchain/metadata.md), երբ տվյալները միայն առկա գրքի օբյեկտի համապարփակ հատկանիշ են:

Նայեք նաեւ.

- [Գործիքներ](/hy/blockchain/assets.md)
- [Մետադատա](/hy/blockchain/metadata.md)
- [հրահանգներ](/hy/blockchain/instructions.md)
- [Հարցեր](/hy/blockchain/queries.md)
