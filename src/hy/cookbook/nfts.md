---
translation_locale: hy
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## Արդյունքը {#outcome}

Վերլուծություն Taira NFT Պետք է գրանցել, թարմացնել, փոխանցել եւ հարցում կատարել եզակի NFT Աշխատանքային հոսքը օգտագործվում է լիարժեք որակավորված `name$domain.dataspace` NFT ID եւ կանոնական I105 սեփականատեր IDs.

## Նախադրյալներ {#prerequisites}

- `curl`, `jq`, Python 3.11 կամ ավելի ուշ եւ հոսքը `iroha` CLI:
- Կարդալ միայն Taira մուտք:
- Գրքերի համար, ստեղծված տեղական ցանցից [Ծրահարկում Iroha](/hy/get-started/launch-iroha.md), հետ `./localnet/client.toml` եւ Torii բ) `http://127.0.0.1:8080`.

## Քայլեր {#steps}

### 1. Ստուգել հանրային հավաքածուն Taira {#_1-inspect-the-public-taira-collection}

Թթու էջը հաջող ընթերցում է. դա նշանակում է, որ խնդրված էջում ոչ մի տեսանելի NFTs չկա:

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs-ը եզակի արձանագրություններ են, այլ ոչ թե թվային մնացորդ: Նրանք ունեն ID, մեկ սեփականատեր եւ համապարփակ `content` մետադատա քարտեզ:

### 2. Պատրաստեք տեղական սեփականատիրոջը IDs {#_2-prepare-local-owner-ids}

Գրելու օրինակում օգտագործվում է մուտքագրված `wonderland.universal` տիրույթը: Տեղեկացրեք կոնֆիգուրացված լիազոր հաշիվը ՝ առանց դրա մասնավոր բանալին բացահայտելու, ապա ընտրեք այլ գրանցված հաշիվ որպես փոխանցման նպատակակետ:

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

`$` բաժանորդը պատկանում է NFT տեքստային ձեւին: Պահպանեք ամբողջական `wonderland.universal` դոմեյն եւ տվյալների տարածքի հաջորդականությունը:

### 3. Գրանցել NFT սկիզբական բովանդակությամբ {#_3-register-the-nft-with-initial-content}

CLI կարդում է սկզբնական JSON օբյեկտը ստանդարտ մուտքից: Ներկայիս լիազոր հաշիվը դառնում է սեփականատերը:

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Թարմացրեք բովանդակության քարտեզը {#_4-update-the-content-map}

Մետադատային արժեքները JSON են: Կոճակի տեղադրումը ներառում է կամ փոխարինում է այդ մեկ մուտքը, այն չի փոխարինում ամբողջ NFT գրառմանը:

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Տրանսֆերային սեփականություն {#_5-transfer-ownership}

Պատվիրեք երկու կանոնիկ I105 հաշիվը IDs: Անանունը պետք է լուծվի, նախքան այն օգտագործելը որպես `--from` կամ `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Թույլատրելիության սահման

Taira-ում յուրաքանչյուր գրառման համար անհրաժեշտ է նաեւ `--metadata ./taira.tx-metadata.json` եւ բացարձակ վճարային վճարող: Գրանցումը, փոխանցումը, հեռացումը եւ մետադատայի թարմացումները ստուգվում են ակտիվ վազման ժամանակով (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` եւ `CanModifyNftMetadata` նախնական թույլտվությունների մակերեւույթում): Օգտագործեք ձեր ծրագրի համար նշանակված դոմեյն կամ պահեք այս քայլը localnet- ում.

:::

Պայմանագրային սեփականության աշխատանքային հոսքերի համար Kotodama բացատրում է տիպված NFT հյուրընկալող զանգերը: Ստորեւ բերվում է ճշգրիտ կենսաշրջանի թեստային տվյալները, որը կազմվել եւ գործարկվել է փաթեթավորված IVM փաստաթղթերի թեստով:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

Երկու ֆիքսված I105 արժեքները վերին նախագծի թեստային տվյալներն են, իսկ թեստային միջավայրը կատարումից առաջ գրանցում է նպատակային հաշիվը։ Դրանք CLI ուղեցույցի `CURRENT_OWNER` և `NEW_OWNER` արժեքները չեն։ Հավելվածի պայմանագրի համար տրամադրեք դրա իրական կանոնական հաշիվները, ապա [Խելացի պայմանագրերի](./smart-contracts.md) միջոցով կոմպիլացրեք, փորձարկեք, տեղակայեք և կանչեք այն։ Չստուգված բայթկոդ մի ուղարկեք Taira-ին. պայմանագրի կատարումը դեռ անցնում է գործարկման ժամանակի թույլտվություն։

## Փորձարկել {#verify}

Կարդացեք NFT ուղիղ եւ հաստատեք, որ դրա սեփականատերը փոխվել է այն ժամանակ, երբ դրա բովանդակությունը մնացել է միացված:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Եթե CLI-ը ձայնագրությունը փակում է արտադրանքի փաթեթով, մեկ անգամ ստուգեք JSON-ն եւ կիրառեք պնդումը պարունակվող NFT օբյեկտի վրա: Վավերական անկանխատեսելիները են `id`, `owned_by` եւ `content`.

## Խնդիրների լուծում {#troubleshooting}

- `name$domain` կարող է որոշ պարսերներում նախանշյալ կերպով մուտք գործել համընդհանուր տվյալների տարածքը, բայց խոհանոցային գիրքն ու ծրագիրը IDs պետք է օգտագործեն բացասական ձեւը `name$domain.dataspace`:
- Նույն NFT ID-ի կրկնակի գրանցումը մերժվում է: Օգտագործեք նոր տեղական ցանց կամ ընտրեք կայուն նոր ID ՝ տարբեր արձանագրության համար.
- Մետադատա մուտքը պետք է լինի վավեր JSON ստանդարտ մուտքի ժամանակ: Շեկլ շղթան, որը չի մեջբերում JSON, մետադատայի արժեք չէ:
- Հաշվեի այլ սեփականատիրոջ կողմից ստորագրված փոխանցման համար անհրաժեշտ է ճշգրիտ թույլտվություն. `--from`-ի փոփոխությունը չի փոխում ստորագրողի:
- Փոխանցումից հետո օրիգինալ հաճախորդին չի կարող այլեւս թույլատրվել մուտացիա կատարել կամ չեղարկել NFT: Օգտագործեք նոր սեփականատիրոջ ստորագրողը կամ լիազորված վերահսկող:
- Taira-ը կարող է վերադարձնել դատարկ հավաքածու NFT: Մի վերաբերվեք `items: []`-ին որպես ապացույց, որ NFT հրահանգները հասանելի չեն.

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [NFT ինտեգրման փորձարկումները փակված commit-ի վրա](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT հյուրընկալող զանգի փորձարկումները փակված commit վրա ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Ճշգրիտ Kotodama NFT կյանքի շրջանի թեստային տվյալները փակված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko):
- [NFTs](/hy/blockchain/nfts.md)
- [Մետադատա](/hy/blockchain/metadata.md)
- [հրահանգներ](/hy/blockchain/instructions.md)
- [Թույլտվության տոքեր](/hy/reference/permissions.md)
