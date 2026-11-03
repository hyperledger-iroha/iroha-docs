---
translation_locale: hy
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# NFTs {#nfts}

## Արդյունքը {#outcome}

Վերլուծություն Taira NFT Պետք է գրանցել, թարմացնել, փոխանցել եւ հարցում կատարել եզակի NFT Աշխատանքային հոսքը օգտագործվում է լիարժեք որակավորված `name$domain.dataspace` NFT ID եւ կանոնական I105 սեփականատեր IDs.

## Նախադրյալներ {#prerequisites}

- `curl`, `jq`, Python 3.11 կամ ավելի ուշ եւ հոսքը `iroha` CLI:
- Կարդալ միայն Taira մուտք:
- Գրառումների համար՝ տեղական ցանց `kagami localnet generate --peers 4 --out-dir ./localnet` հրամանով, ինչպես [Iroha-ի գործարկում](/hy/get-started/launch-iroha.md) էջում, `./localnet/client.toml`-ով և Torii-ով `http://127.0.0.1:8080` հասցեում, ինչպես նաև NFT դոմեն, որը պատկանում է դրա ստորագրողին (տե՛ս քայլ 2)։

## Քայլեր {#steps}

### 1. Ստուգել հանրային հավաքածուն Taira {#_1-inspect-the-public-taira-collection}

Թթու էջը հաջող ընթերցում է. դա նշանակում է, որ խնդրված էջում ոչ մի տեսանելի NFTs չկա:

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs-ը եզակի գրառումներ են, ոչ թե թվային մնացորդներ։ Դրանք ունեն ID, մեկ սեփականատեր և բովանդակության կոմպակտ քարտեզ, որը Torii-ի հավաքածուի տողերը վերադարձնում են որպես `metadata`, իսկ `ledger nft get`-ը՝ որպես `content`։

### 2. Պատրաստեք տեղական սեփականատիրոջը IDs {#_2-prepare-local-owner-ids}

Գրառման օրինակին անհրաժեշտ է դոմեն, որը պատկանում է ստորագրող հաշվին, կամ դրա համար `CanRegisterNft` թույլտվության շնորհում։ Ստեղծված տեղական ցանցն իր հաճախորդի համար հավելվածի դոմեն չի գրանցում, իսկ դոմենի ուղղակի գրանցումը վերապահված է ծագման բլոկին, ուստի `NFT_DOMAIN`-ին վերագրեք `name.dataspace` դոմեն, որը կառավարում է ձեր ստորագրողը։ Ստացեք կազմաձևված լիազոր հաշիվը՝ առանց դրա մասնավոր բանալին բացահայտելու, ապա որպես փոխանցման նպատակակետ ընտրեք մեկ այլ գրանցված հաշիվ։

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

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

`$` բաժանիչը NFT-ի տեքստային ձևի մաս է։ ID-ում պահպանեք ամբողջական `name.dataspace` դոմենը։

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

Taira-ում յուրաքանչյուր գրառում օգտագործում է `--fee-payer authority`; CLI-ն ստորագրելուց առաջ ստանում է ճշգրիտ վճարային առաջարկ Taira-ի վճարային ակտիվով։ Գրանցումը, փոխանցումը, հեռացումը և մետատվյալների թարմացումները ստուգվում են ակտիվ կատարման միջավայրի կողմից (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` և `CanModifyNftMetadata` լռելյայն թույլտվությունների մակերեսում)։ Օգտագործեք դոմեն, որը պատկանում է ձեր հաշվին, կամ դոմեն, որի համար այն ունի այս թույլտվությունները։

:::

Պայմանագրային սեփականության աշխատանքային հոսքերի համար Kotodama բացատրում է տիպված NFT հյուրընկալող զանգերը: Ստորեւ բերվում է ճշգրիտ կենսաշրջանի թեստային տվյալները, որը կազմվել եւ գործարկվել է փաթեթավորված IVM փաստաթղթերի թեստով:

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
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

CLI-ն տպում է հենց NFT-ի գրառումը։ Հեղինակավոր ինվարիանտներն են `id`-ն, `owned_by`-ն և `content`-ը։

## Խնդիրների լուծում {#troubleshooting}

- `name$domain` կարող է որոշ պարսերներում նախանշյալ կերպով մուտք գործել համընդհանուր տվյալների տարածքը, բայց խոհանոցային գիրքն ու ծրագիրը IDs պետք է օգտագործեն բացասական ձեւը `name$domain.dataspace`:
- Նույն NFT ID-ի կրկնակի գրանցումը մերժվում է: Օգտագործեք նոր տեղական ցանց կամ ընտրեք կայուն նոր ID ՝ տարբեր արձանագրության համար.
- Մետադատա մուտքը պետք է լինի վավեր JSON ստանդարտ մուտքի ժամանակ: Շեկլ շղթան, որը չի մեջբերում JSON, մետադատայի արժեք չէ:
- Ընթացիկ սեփականատիրոջից տարբեր հաշվի կողմից ստորագրված փոխանցման համար անհրաժեշտ է տիրապետել NFT-ի դոմենին կամ ունենալ ճշգրիտ `CanTransferNft` թույլտվության շնորհում; `--from`-ը փոխելը չի փոխում ստորագրողին։
- Փոխանցումը փոխում է միայն `owned_by`-ը։ Մետատվյալների թարմացումները և գրանցումից հանելը մնում են դոմենի սեփականատիրոջ կամ այն հաշվի իրավասության ներքո, որն այդ NFT-ի համար ունի `CanModifyNftMetadata` կամ `CanUnregisterNft`; նոր սեփականատերը կարող է այն հետագայում փոխանցել այլ հաշվի։
- Taira-ը կարող է վերադարձնել դատարկ հավաքածու NFT: Մի վերաբերվեք `items: []`-ին որպես ապացույց, որ NFT հրահանգները հասանելի չեն.

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [NFT ինտեգրման փորձարկումները փակված commit-ի վրա](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT հյուրընկալող զանգի փորձարկումները փակված commit վրա ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Ճշգրիտ Kotodama NFT կյանքի շրջանի թեստային տվյալները փակված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko):
- [Kotodama-ի փաստաթղթերի օրինակների թեստերը ամրագրված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/hy/blockchain/nfts.md)
- [Մետադատա](/hy/blockchain/metadata.md)
- [հրահանգներ](/hy/blockchain/instructions.md)
- [Թույլտվության տոքեր](/hy/reference/permissions.md)
