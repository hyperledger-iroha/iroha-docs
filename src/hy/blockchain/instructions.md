---
translation_locale: hy
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Iroha Հատուկ հրահանգներ {#iroha-special-instructions}

Երբ մենք խոսում էինք [ինչպես Iroha գործում է](/hy/blockchain/iroha-explained), մենք ասացինք, որ Iroha Հատուկ հրահանգները միակ միջոցն են համաշխարհային պետության փոփոխման համար: Ինչպիսի՞ հատուկ հրահանգներ ունենք: Եթե կարդացել եք այս ձեռնարկի լեզվական ուղեցույցները, Դուք արդեն տեսել եք մի քանի հրահանգներ. `Register<Account>` եւ `Mint<Numeric>`.

Iroha հատուկ հրահանգների ամբողջական ցանկը հետեւյալն է.

|Ուսուցում |Նկարագրություն |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Գրանցում/բացառություն](#un-register) |Տվեք ID blockchain- ի նոր միավորին: |
| [Mint/Burn](#mint-burn) |Մինետ / այրում թվային ակտիվներ կամ կրկնումների առաջացման համար: |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Բլոկչեյնի օբյեկտային մետադատա թարմացրեք: |
| [SetParameter](#setparameter) |Սահմանեք լայն շղթայով պարամետր: |
| [Grant/Revoke](#grant-revoke) |Տվեք կամ հանեք թույլտվությունները եւ դերերը: |
| [Տրանսֆեր](#transfer) |Տրանսֆերային սեփականություն կամ ակտիվի արժեք: |
| [Բնային պահպանումների եւ ակտիվների կոճակները](#native-escrow-and-asset-locks) |Փակեք թվային ակտիվները արձանագրության պահեստում: |
| [Ատոմային մասնավոր հաշվարկ](#atomic-private-settlement) | Կառավարում է գաղտնի pool-երը և ատոմային փաթեթները։ |
| [ExecuteTrigger](#executetrigger) |Գործադրեք գործարկիչները: |
| [Լոգ/Մշակութային/Աջատում](#other-instructions) |Գրեք, երկարացրեք կամ բարելավեք վազման ժամանակի վարքագիծը: |

Եկեք սկսենք Iroha հատուկ հրահանգների ամփոփմամբ, թե ինչ օբյեկտներ կարող են կանչվել յուրաքանչյուր հրահանգի համար եւ ինչ հրահանգներ կան յուրաքանչյուր օբյակի համար:

## Ամփոփում {#summary}

Յուրաքանչյուր հրահանգի համար կա այն օբյեկտների ցանկ, որոնց վրա այս հրահանգը կարող է գործարկվել: Օրինակ, փոխանցման տարբերակները ընդգրկում են սեփականատերական գրքի առարկաները եւ թվային ակտիվները, մինչդեռ մինթինգն ընդգրկում է թվային ակտիվներ եւ առաջացնում կրկնությունները:

Որոշ հրահանգներ պահանջում են նշանակման վայրը նշել: Օրինակ, եթե դուք փոխանցում եք ակտիվները, միշտ պետք է նշեք, թե որ հաշիվի վրա եք դրանք փոխանցում: Մյուս կողմից, երբ ինչ-որ բան գրանցում եք, ձեզ հարկավոր է միայն այն օբյեկտը, որը ցանկանում եք գրանցել:

|Ուսուցում |Նյութեր |Կայքում |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |սովորական տիրույթների, տվյալների տարածքի եւ հաշիվների կարգավորումը|                      |
| [Գրանցում/բացառություն](#un-register) |հաշիվներ, ակտիվների սահմանումներ, NFTs, դերակատարություններ, առաջադրանքներ, զուգընկերներ; տիրույթի հեռացում |                      |
| [Mint/Burn](#mint-burn) |թվային ակտիվներ, կրկնումները |հաշիվներ կամ գործարկիչներ |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |այն օբյեկտները, որոնք ունեն [մետադատա](./metadata.md). տիրույթներ, հաշիվներ, ակտիվների սահմանումներ, NFTs, RWAs, գործարկիչներ |                      |
| [SetParameter](#setparameter) |շղթայի պարամետրեր |                      |
| [Grant/Revoke](#grant-revoke) | [դեր, թույլտվությունների տոքեր](/hy/blockchain/permissions.md) |հաշիվներ կամ դերակատարություններ |
| [Տրանսֆեր](#transfer) |տիրույթներ, ակտիվների սահմանումներ, թվային ակտիվներ, NFTs |հաշվետվություններ|
| [Բնային պահպանումների եւ ակտիվների կոճակները](#native-escrow-and-asset-locks) |թվային ակտիվների պահպանումներ, ակտիվների փակումներ, անանուն պահպանումի պարտավորություններ |գնորդներ, նպատակակետեր կամ վեճի բաժանումներ |
| [Ատոմային մասնավոր հաշվարկ](#atomic-private-settlement) | երթուղուն կապված գաղտնի pool-եր, քաղաքականության ռոտացիաներ, վերջնականացված փաթեթներ և չեղարկման նշաններ | |
| [ExecuteTrigger](#executetrigger) |գործարկիչներ |                      |
| [Լոգ/Մշակութային/Աջատում](#other-instructions) |օրագրեր, կատարողին հատուկ օգտակար բեռներ, կատարողի թարմացումներ |                      |

ISI-ի դիտարկման եւս մեկ տարբերակ կա, ըստ գրասենյակային օբյեկտի, որը նրանք դիպչում են.

|Նպատակ |հրահանգներ |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Հաշիվ |գրանցել/բացառել հաշիվներ, ստանալ ակտիվներ, թարմացնել հաշիվի մետադատները, տրամադրել/վերականգնել թույլտվությունները եւ դերը |
|Դոմեյն |ապահովել տիրույթի կարգավորումը, չեղարկել տիրույթները, փոխանցել տիրապետման սեփականությունը, թարմացնել տիրույթի մետադատաները |
|Աշունների սահմանումը|գրանցման/հեղափոխման սահմանումները, տիրապետության փոխանցումը, մետադատաների թարմացումը |
|Գույք |Թվային քանակություն, տրանսֆերային քանակությունը |
|Հավաքագրություն|բացել, ընդունել, նշել ուղարկված վճարումը, ազատ արձակել, չեղյալ հայտարարել, վեճ լուծել, հանել կամ լրանալ բնիկ պահապանության գրառումները |
|NFT |գրանցում/բացառություն NFTs, տիրապետության փոխանցում, մետադատա թարմացում |
|RWA |գրանցել խմբաքանակները, փոխանցել քանակությունը, պահել/բեռնել, սառեցնել/ազանգել, փոխհատուցել, միավորել, թարմացնել մետադատաները եւ վերահսկողությունները |
|Աջակցող |գրանցել/լքել գրանցումը, մինետի / այրման սթրիկատոր կրկնությունները, գործարկել սթրիկը, թարմացնել սթրիքատոր մետադատները |
|Աշխարհը |գրանցել/բացառել զուգընկերներ եւ դերակատարություններ, սահմանել պարամետրեր, կատարելագործել կատարողին |

## CLI Օրինակներ {#cli-examples}

Այս էջի օրինակները ենթադրում են, որ դուք գործարկում եք հրամաններ վերածնային Iroha աշխատանքային տարածքից նախնական տեղական հաճախորդի կարգավորման դեմ.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Եթե դուք տեղադրել է `iroha` բինար, օգտագործեք `iroha --config ./defaults/client.toml` փոխարենը. Փոխանակել ստորեւ տեղակալները արժեքներով ձեր ցանցից:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

When targeting the public Taira testnet, use a Taira client configuration. Before running fee-paying examples, save the faucet helper from [Get Testnet XOR on Taira](/hy/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) as `taira_faucet_claim.py`, and then claim testnet XOR from the faucete:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Գազի գազով ֆինանսավորվող ակտիվը տեսանելի դարձնելուց հետո անհրաժեշտ գազային ակտիվների մետադատածները միացրեք գործարքները գրելու համար.

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` տիրույթների ստեղծման եւ դրանց SNS վարձակալության համար սովորական առաջին թողարկման ուղին է: Այն հայտարարաբար կապում է տվյալների ճշգրիտ տարածքը, սեփականատերը, վարձակալման ժամկետը եւ գծագրային պահապանը, այնուհետեւ ստեղծել կամ վերանորոգել բոլոր պահանջվող վիճակը ատոմիկորեն: Օգտագործեք վավերացված `POST /v1/aliases/setup/plan` վերջային կետը կամ համապատասխանող CLI աշխատանքային հոսքը.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

Նպատակը եւ ծրագիրը գաղտնի են, բայց կիրառեք քայլային նշաններ եւ ուղարկեք սովորական գործարք կազմված հաշիվի հետ: Ծրագիրը կապված է իր շղթայով, լիազորությամբ, կենդանի վիճակի կապակցությամբ եւ ժամկետով: Երբեք մի օգտագործեք այն մեկ այլ ցանցում.

## (Un) գրանցում {#un-register}

Գրանցումը եւ չգրանցումը օգտագործվում են ID ցուցակ տալու համար բլոկչեյնի վրա գտնվող նոր կազմակերպությանը:

Ամեն ինչ, որ կարող է գրանցվել, ինչպես `Registrable` եւ `Identifiable`, բայց ոչ թե ամեն ինչ, որ `Identifiable` է `Registrable`: Շատ բաները գրանցվում են ուղղակիորեն, սակայն որոշ դեպքերում բլոկչեյնի ներկայացումը զգալիորեն ավելի շատ տվյալներ ունի: Անվտանգության եւ կատարողական պատճառների համար մենք օգտագործում ենք տվյալների նման կառույցների կառուցիչներ (օրինակ, `NewAccount`), իսկ զուգընկերային գրանցումը ունի սեփականության ապացույցի հատուկ հրահանգ: Որպես կանոն, ամեն ինչ, որը կարող է գրանցվել, կարող է նաեւ չկառուցված լինել, բայց դա ոչ մի խիստ եւ արագ կանոն չէ.

Դուք կարող եք գրանցել հաշիվներ, ակտիվների սահմանումներ, NFTs, զուգընկերներ, դերակատարություններ եւ գործարկիչներ: Դոմեյնային կարգավորումը օգտագործում է `EnsureAlias`; հումքի բեռը `Register::Domain` պահվում է genesis/bootstrap- ի համար: Զուգընկերների գրանցումը օգտագործում է`RegisterPeerWithPop`, որը պարունակում է զուգընկերի բանալին սեփականության ապացույց: Ստուգեք մեր [ անվանման կոնվենցիաները](/hy/reference/naming.md) ՝ պարզելու համար կազմակերպությունների անունների նկատմամբ սահմանված սահմանափակումները:

RWA խմբաքանակները ստեղծվում են հատուկ `RegisterRwa` հրահանգի միջոցով: Ներկայիս կոդը չի բացահայտում `UnregisterRwa` հրահանգը. օգտագործեք `RedeemRwa` ներկայացված քանակությունը հանելու համար:

::: info

Նշենք, որ կախված այն բանից, թե ինչպես եք որոշում տեղադրել ձեր [ծննդային բլոկը](/hy/guide/configure/genesis.md) `genesis.json`- ում (հատկապես ՝ արդյոք ներառել եք թույլտվության տոքերների գրանցումը), հաշիվի գրանցման գործընթացը կարող է շատ տարբեր լինել: Ընդհանուր առմամբ, մենք կարող ենք ամփոփել այն այսպես.

- Հանրային բլոկչեյնում յուրաքանչյուրը կարող է գրանցել հաշիվ:
- Անձնական բլոկչեյնում կարող է լինել հաշիվների գրանցման յուրահատուկ գործընթաց: Տիպիկ մասնավոր բլոկշեյնում, այսինքն ՝ առանց հաշիվների արձանագրման որեւէ յուրահատակ գործընթացի, դուք պետք է հաշիվ ունենաք մեկ այլ հաշիվ գրանցելու համար:

Մենք մանրամասն քննարկում ենք այս տարբերությունները, երբ մենք [համեմատել մասնավոր եւ հանրային բլոկչեյներ](/hy/guide/configure/modes.md).

:::

::: info

Ներկայումս զուգընկերների գրանցումը միակ միջոցն է ցանցին ավելացնելու համար այն զուգընկերը, որոնք չեն եղել սկզբնական վստահելի զուգընթացների մասը:

:::

Օգտագործեք լեզվական հատուկ ուղեցույց ՝ բլոկչեյն օբյեկտների գրանցման համար.

|Լեզու |Գլխավոր |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |Օգտագործեք [Iroha CLI](/hy/get-started/operate-iroha-via-cli.md) տիրույթներ ստեղծելու եւ հաշիվների եւ ակտիվների գրանցման համար: |
|Rust |Օգտագործեք [Rust դասընթացը](/hy/guide/tutorials/rust.md). |
|Kotlin/Java |Օգտագործեք [Kotlin/Java ձեռնարկը](/hy/guide/tutorials/kotlin-java.md). |
|Python |Օգտագործեք [Python դասընթացը](/hy/guide/tutorials/python.md). |
|JavaScript/TypeScript |Օգտագործեք [JavaScript/TypeScript ձեռնարկը ](/hy/guide/tutorials/javascript.md): |

Պլանավորել եւ կիրառել սովորական տիրույթի կարգավորումը, այնուհետեւ վերագրեք տիրույթը, երբ այն այլեւս անհրաժեշտ չէ.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

Գրանցման եւ չեղարկման հաշիվներ

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Գրանցման եւ չեղարկման ակտիվների սահմանումները.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

Գրանցվել եւ չգրանցվել NFTs: NFT գրանցումը կարդում է իր բովանդակությունը JSON ստանդարտ մուտքի միջոցով.

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Գրանցման եւ չեղարկման դեր:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Register եւ unregister triggers. Trigger գրանցման կարիք կա՛մ կազմված IVM բայթ կոդը, կա՛մ սերիալացված հրահանգների ցուցակ: Այս օրինակում կառուցվում է `Log` հրահանգի հետ CLI եւ խողովակներ այն դեպի trigger գրանցման:.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

Գրանցել եւ չեղարկել զուգընկերները: Ստեղծեք BLS բանալին եւ PoP ՝ `kagami`, եթե դուք դեռ չունեք դրանք.

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Մինտ/Բուրն {#mint-burn}

Մինթինգը եւ այրումը կարող են վերաբերել թվային ակտիվներին եւ առաջացնում են սահմանափակ կրկնությունների քանակով: Որոշ ակտիվներ կարող են հայտարարվել որպես ոչ-մինտացվող, ինչը նշանակում է, որ դրանք կարող են մինետվել միայն մեկ անգամ գրանցումից հետո:

Աշունները հաշվարկվում են հատուկ հաշիվ, սովորաբար այն հաշիվը, որը առաջին հերթին գրանցել է ակտիվը: Գույքի քանակությունը ոչ բացասական է, այնպես որ դուք երբեք չեք կարող ունենալ `$-1.0` ակտիվի կամ այրել բացասական գումար եւ ստանալ mint.

Օգտագործեք լեզվական հատուկ ուղեցույց ՝ Mint blockchain ակտիվների համար.

- [CLI](/hy/get-started/operate-iroha-via-cli.md)
- [Rust](/hy/guide/tutorials/rust.md)
- [Kotlin/Java](/hy/guide/tutorials/kotlin-java.md)
- [Python](/hy/guide/tutorials/python.md)
- [JavaScript/TypeScript](/hy/guide/tutorials/javascript.md)

Ահա այրվող ակտիվների օրինակներ.

- [CLI](/hy/get-started/operate-iroha-via-cli.md)
- [Rust](/hy/guide/tutorials/rust.md)

Մինետային եւ այրվող թվային ակտիվներ

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

Մինետի եւ այրման սխալի կրկնությունները.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Փոխանցում {#transfer}

Փոխանցումները փոխանցում են սեփականությունը կամ արժեքը հաշիվների միջեւ: Գնավոր փոխանցման տարբերակները ընդգրկում են դոմեյներ, ակտիվների սահմանումներ, թվային ակտիվներ եւ NFTs: RWA քանակության շարժումը օգտագործում է հատուկ `TransferRwa` եւ `ForceTransferRwa` հրահանգները, որոնք նկարագրված են [Real-World Assets](/hy/blockchain/rwas.md).

Այս նպատակով պետք է տրվի հաշվետվություն [ակտիվների փոխանցման թույլտվություն](/hy/reference/permissions.md). Նշենք, թե ինչպես կարող են փոխանցվել ակտիվները [CLI](/hy/get-started/operate-iroha-via-cli.md) կամ [Rust](/hy/guide/tutorials/rust.md).

Թվային ակտիվների փոխանցում.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Տեղափոխման տիրույթը, ակտիվի սահմանումը եւ NFT սեփականությունը.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Բնակչական գրավի եւ ակտիվների փակիչներ {#native-escrow-and-asset-locks}

Native escrow հրահանգները հաշիվային ակտիվների կողպեքը պահվում են գլխավոր գրքի կառավարվող արձանագրության պահպանման մեջ: Նրանք օգտագործվում են շուկայական ոճի կարգավորման, ընդհանուր ակտիվների կողոպուտների եւ անանուն պաշտպանված հոսքերի համար:

Շուկայի պահպանակների օգտագործումը `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, եւ `ResolveEscrowDispute`. Գնացական ակտիվների փակման օգտագործումը `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, եւ `ExpireAssetLock`. Anonymous escrow արտացոլում է շուկայական կյանքի ցիկլը `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, եւ `ResolveAnonymousEscrowDispute`.

Այս ISIs-ները ներկայումս չունեն առաջին դասի CLI հրամաններ: Օգտագործեք տիպված SDK կառուցապատողներ կամ շարականացված հրահանգների օգնական բեռներ, եւ տեսեք [Native Asset Escrow](/hy/blockchain/escrow.md) ՝ կյանքի ցիկլի մանրամասների, թույլտվությունների, հարցումների, իրադարձությունների եւ Rust օրինակների համար.

## Ատոմային մասնավոր հաշվարկ {#atomic-private-settlement}

Կառավարման ենթակա ատոմային մասնավոր հաշվարկի հրահանգները տարանջատված են թափանցիկ Native AMX-ից։ `ActivatePrivateSettlementPoolV1`-ը խմբագրված կառավարման պրոյեկցիայից և կանոնական սկզբնաղբյուրի պարտավորություններից ճշգրիտ երթուղու համար ստեղծում է մեկ գաղտնի `pool`։ `FinalizeAtomicPrivateSettlementV1`-ը ատոմային կերպով կիրառում է բոլոր մասնակից կոմիտեների կողմից վավերացված ամբողջական փաթեթը։ `AbortAtomicPrivateSettlementV1`-ը հրապարակում է միայն հովանավորի կողմից թույլատրված հանրային վերջնական նշանը։

`RotatePrivateSettlementPoolPolicyV1`-ը կարող է կատարել միայն գաղտնիության կառավարումը։ Հրահանգը պահանջում է գործող կառավարման ճշգրիտ digest-ը, պահպանում է երթուղին, `pool`-ը, ակտիվի կապակցման պարտավորությունը, վիճակի սահմանը, replay set-երը և վերջնականացված անդորրագրերը, հանրային revision-ը մեծացնում է մեկով և օգտագործում աուդիտորի բանալիի ավելի նոր epoch։ Ռոտացիան ակտիվանում է ներառման բարձրության վրա, և նույն բարձրության վրա նույն երթուղու ու `pool`-ի անդորրագիրը չի կարող վերջնականացվել։ Հանրային revision-ների շղթան ռոտացիայից առաջ վերջնականացված անդորրագրերը վերագործարկումից հետո էլ վավեր է պահում, իսկ դրանց ճշգրիտ կրկնությունը idempotent է։ Հին քաղաքականությամբ ընթացիկ փաթեթները վիճակը փոխելուց առաջ fail closed են լինում։ Օպերատորները պետք է պահեն հին ապակոդավորման բանալիները կամ բանալիները ոչնչացնելուց առաջ կառավարվող կերպով վերափաթեթավորեն capsule-ները և փորձարկեն արդյունքը։

Այս ուղին լռելյայն անջատված է և արտադրական օգտագործման համար որակավորված չէ։ Կազմաձևման, լիազորությունների, աուդիտի, վերականգնման և թողարկման պահանջների համար տես [ատոմային մասնավոր հաշվարկ տվյալների տարածքների միջև](/get-started/atomic-private-settlement)։

## Գրանտ/Վերահսկում {#grant-revoke}

Հատկացման եւ վերացման հրահանգները օգտագործվում են հաշիվի [ թույլտվությունների եւ դերի համար ](permissions.md):

`Grant` օգտագործվում է օգտվողին մշտապես տրամադրելու կամ՛ մեկ թույլտվություն, կամ՛ մի խումբ թույլտվություններ ("ռոլ") ։ տրված դերերը եւ թույլտվությունները կարող են հեռացվել միայն `Revoke` հրահանգի միջոցով: Այդպիսով, այս հրահանգները պետք է օգտագործվեն զգույշորեն:

Հաշվետու դերակատարություն տրամադրել եւ վերացնել:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Grant եւ revocate թույլտվությունների տոքեր. թույլտվության հրամանները ընթերցում են թույլտվություն օբյեկտը ստանդարտ մուտքի:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Դասերի համար թույլտվություններ տրամադրել եւ վերացնել.

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Այս հրահանգները թարմացնում են օբյեկտ [մետադատա](/hy/blockchain/metadata.md): Օգտագործեք `SetKeyValue` ՝ մետադատայի մուտք գործելու կամ փոխարինելու համար, եւ `RemoveKeyValue` ՝ մեկը ջնջելու համար:

Metadata `set` հրամանները կարդում են JSON արժեքը ստանդարտ մուտքի միջոցով.

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Նույն ձեւը հասանելի է հաշվետվությունների, ակտիվների սահմանումների, NFTs, RWAs եւ գործարկիչների համար.

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` փոխում է ակտիվ տվյալների մոդելի եւ կատարողի կողմից բացահայտված ողջ շղթայի պարամետրերը:

Սահմանեք պարամետր' ստանդարտ մուտքի ժամանակ անցնելով մեկ պարամետրային JSON օբյեկտ.

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Այս հրահանգը օգտագործվում է [ գործարկիչների](./triggers.md) կատարման համար:

CLI-ը կարող է գրանցել գործարկիչները եւ ուղղակիորեն բաժանորդագրվել գործարկման իրադարձություններին: Այն չի տրամադրում տիպված `execute trigger` հրաման, ուստի պետք է ուղարկի ձեռագիր `ExecuteTrigger` հրահանգ. Սերիալացված `InstructionBox` ստեղծում է SDK կամ կատարող գործիքով եւ արդյունաբերված JSON շարքը անցնում `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Այլ հրահանգներ {#other-instructions}

Iroha բացատրում է նաեւ վարման ժամանակի եւ կատարողի ինտեգրման համար ավելի ցածր մակարդակի հրահանգները.

- `Log`: իրականացման ընթացքում արձանագրություն թողարկեք
- `CustomInstruction`: իրականացնողին հատուկ JSON օգտակար բեռներ տեղափոխել:
- `Upgrade`: ակտիվացրեք կատարողի թարմացումը

Պինգի օգնականին `Log` հրահանգ ուղարկեք.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Ներկայացրեք անհատական կատարողի հրահանգ ՝ որպես սերիալացված `InstructionBox`: Օգտակար բեռի ձեւը հատուկ է կատարողի համար, այնպես որ առաջադրեք հրահանգը համապատասխանող SDK կամ կատարողի գործիքային սարքավորմամբ.

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Բարձրացրեք կատարողը կազմված IVM բայթքոդային ֆայլից.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
