---
translation_locale: hy
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Կառուցեք եւ գործադրեք խելացի պայմանագիր {#build-and-deploy-a-smart-contract}

## Արդյունքը {#outcome}

Ստուգեք և կոմպիլյացրեք Kotodama V1 պայմանագիր, տեղականորեն գործարկեք դրա հանրային view ֆունկցիան, տեղակայեք ստուգված IVM արտեֆակտը՝ բացահայտորեն ընտրված, լիազոր հաշվի կողմից վճարվող վճարներով, և կարդացեք տեղակայված view-ը Torii-ի միջոցով։

## Նախադրյալներ {#prerequisites}

- Iroha աղբյուրի ստուգումը commit-ում `c8c872461e92f04325c350cdd952f4276e96f9dc`, Rust եւ Cargo հասցեներում:
- Ընթացիկ `iroha` CLI-ն և `musubi`-ն (աշխատանքային պատճենում գործարկեք որպես `cargo run -p musubi --`), ինչպես նաև ֆինանսավորված Taira հաճախորդ՝ [Միացում Taira-ին](./connect-to-taira.md) էջից։
- Բացարձակ ուղի `IROHA_CONFIG`-ում։ Musubi-ի ցանցային կապակցումը պահում է հղում այս հաճախորդի ֆայլին և տեղակայումը ստորագրում է դրա հաշվի բանալիով։
- Կեղծանվան լիազորություն։ Կատարողը պահանջում է `CanManageAccountAlias` պայմանագրի ճշգրիտ կեղծանվան կամ դրա ծնող շրջանակի համար: սեփականատեր դոմենը՝ `name::domain.dataspace`-ի դեպքում, կամ տվյալների տարածքը՝ `name::dataspace`-ի դեպքում։ Գրանցված հաշիվներին կոդի գրանցման առանձին թույլտվություն պետք չէ, իսկ պաշտպանված անվանատարածքները պահանջում են նաև ցանցի կառավարման աշխատանքային հոսքը։ Օրինակներն օգտագործում են `cookbook_tuple::universal`; Taira-ում այն փոխարինեք ձեզ պատկանող դոմենի կեղծանունով, կամ տեղակայեք ստեղծված տեղական ցանցում, որի ծագման բլոկը շնորհում է կեղծանվան շրջանակը։

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## Քայլեր {#steps}

### 1. Հայտնի լավ Kotodama V1 պայմանագրի պատճենը {#_1-copy-a-known-good-kotodama-v1-contract}

Աշխատեք փաթեթավորված Iroha ստուգման մեջ եւ կրկնօրինակեք կոմպիլերի տուփլ-վերադարձ նմուշը, որպեսզի աղբյուրն ու գործիքների շղթան մնան նույն commit-ի վրա:

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Ամբողջական աղբյուրը փոքր է: մեկ մասնավոր օգնական `fn` և մեկ հանրային, միայն ընթերցման `view fn`, որը բացահայտորեն թույլատրում է ցանկացած կանչողի:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    view fn compute() authorize(anyone) -> (int, int) {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama ուղղված է Iroha Վիրտուալ մեքենային եւ դրա ընթացիկ ABI լեզվին: Այն ոչ թե WASM կամ EVM աղբյուրի լեզու է:

### 2. Փորձարկել, կառուցել եւ ստուգել արվեստի գործարանը {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p kotodama_toolchain --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

Առաջին շինարարությունը հրապարակում է արվեստի գործիքն ու վավերացված օժանդակ գրառումները: Երկրորդը գործում է միայն ընթերցման `--verify` ռեժիմով եւ ձախողվում է, եթե գոյություն ունեցող արտադրանքը ճիշտ չի համապատասխանում ընթացիկ աղբյուրին: Բարեւեք `.to` ֆայլը եւ դրա մանիֆեսը որպես վերանայված շինարարության արտադրանք:

### 3. Բայթ կոդը տեղականորեն գործարկեք {#_3-run-the-bytecode-locally}

`compute`-ը հանրային, միայն ընթերցման `view fn` է։ Գործարկեք այն `debug-view`-ով, որը կոմպիլյացված բայթկոդը տեղականորեն կատարում է ընտրովի թեստային տվյալների վրա՝ առանց գործարք ներկայացնելու կամ դրա համար վճարելու։

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama ամբողջականները ներկայացվում են որպես JSON շղթաներ, այնպես որ կոդավորված տուպլը կազմում է `["3", "5"]`.

### 4. Տեղակայեք ստուգված արտեֆակտը Musubi-ով {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract`-ը ստուգում է պայմանագրերը, գործարկում դրանց view ֆունկցիաները և վրիպազերծում դրանք, բայց չի տեղակայում, ուստի Taira-ում տեղակայումներն իրականացվում են Musubi-ի միջոցով։ Դրա տեղակայման ծառայությունը վերբեռնում է բայթկոդի հատվածները, գրանցում ստուգված մանիֆեստը և ներկայացնում մեկ `CommitContractDeployment` գործողություն։ Այն յուրաքանչյուր գործարքի համար ստանում է վճարային առաջարկ, մերժում է այն առաջարկը, որը փոխում է ընտրված վճարողին, հովանավորի տարբերակը կամ գազի սահմանը, և նախապես կառուցված արտեֆակտը տեղակայում է միայն այն բանից հետո, երբ ամրագրված կախվածություններով փաթեթի կառուցումը վերարտադրում է դրա կոդի և ABI-ի հեշերը։ Kagami-ով կառավարվող տեղական ցանցում դրա փոխարեն `kagami contract deploy`-ը տեղակայում է `./build/tuple_return_demo.to`-ն `--alias cookbook_tuple::universal --json`-ով; դրա անդորրագիրը գտնվում է `.receipt`-ում, իսկ `kagami context show`-ը տպում է հաճախորդի կազմաձևումը, որը պետք է օգտագործել որպես `IROHA_CONFIG`։

```bash
cat > ./contracts/Musubi.toml <<'TOML'
manifest-version = 1

[package]
namespace = "local"
name = "cookbook-tuple"
version = "0.1.0"
edition = "1"
abi-version = 1

[[contract]]
name = "tuple_return_demo"
path = "tuple_return_demo.ko"
TOML

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml check

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml \
  network configure taira \
  --config "$IROHA_CONFIG" \
  --fee-payer authority \
  --contract tuple_return_demo \
  --alias cookbook_tuple::universal

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml --format json \
  deploy --network taira \
  --contract tuple_return_demo \
  --artifact ./build/tuple_return_demo.to \
  --artifact-manifest ./build/tuple_return_demo.manifest.json \
  > ./build/deployment.json

jq '.data.receipt | {contract_address, code_hash, stored_artifact_matches}' \
  ./build/deployment.json
```

Կապակցումն օգտագործում է `--fee-payer authority`; Musubi-ն ստորագրելուց առաջ ստանում է ճշգրիտ վճարային առաջարկ Taira-ի վճարային ակտիվով։ Վերադարձված գանձման ակտիվը համեմատեք այն ակտիվի հետ, որը հրապարակում է faucet-ի ընթացիկ քաղաքականությունը։ Պայմանագրի կանչերը վճարի ընտրությունն ընդունում են միայն տիպավորված ընթացիկ առաջարկի միջոցով; `gas_asset_id` գործարքի մետատվյալները առաջին թողարկման պայմանագրի մաս չեն։

### 5. Կարդացեք տեղակայված view-ը {#_5-read-the-deployed-view}

`contract view`-ը Torii-ում կատարում է միայն ընթերցման մուտքի կետը՝ առանց գործարքի կամ վճարի։ View-ն գործարքային ձև չունի: Torii-ն իր կանչի երթուղիներում մերժում է view-ի ընտրիչը։

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## Փորձարկել {#verify}

Լուծեք կեղծանունը, ստացեք շղթայի վրա գտնվող մանիֆեստը այն կոդի հեշով, որը Torii-ն հաղորդում է տեղակայված view-ի համար, և գործարկեք նույն view-ը կանոնիկ հասցեով:

```bash
CONTRACT_ADDRESS="$({
  jq -er '.data.receipt.contract_address' ./build/deployment.json
})"
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/local-view.json; })"
DEPLOYED_CODE_HASH="$({
  jq -er '.code_hash_hex' ./build/deployed-view.json
})"
test "$DEPLOYED_CODE_HASH" = "$CODE_HASH"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --dataspace-id 0 \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-view.json
```

Տեղակայումն ավարտված է միայն այն ժամանակ, երբ տեղակայման անդորրագիրը պահված արտեֆակտը նշում է որպես ստուգված, կեղծանունը լուծվում է վերադարձված հասցեով, մանիֆեստը կարդացվում է նույն կոդի հեշով, և տեղական ու Torii-ի view-երը վերադարձնում են `["3", "5"]`։

## Խնդիրների լուծում {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias` սխալը կամ կատարողի `authority is not permitted to manage contract alias` սխալը նշանակում է, որ հաշիվը չի կարող կապել այդ կեղծանունը։ Օգտագործեք ձեզ պատկանող դոմենի կեղծանուն, կամ այդ շրջանակի սեփականատիրոջից ստացեք կեղծանվան ճշգրիտ թույլտվությունը կամ դրա դոմենի կամ տվյալների տարածքի թույլտվությունը; տեղական ցանցում այն շնորհեք ծագման բլոկում։
- Պաշտպանված անվանատարածքի մերժումը նշանակում է, որ կեղծանվան անվանատարածքը գտնվում է կառավարման ներքո։ Հաստատողների հաշիվների ID-ների թվարկումը հաստատման ապացույց չէ; այդ անվանատարածքի համար օգտագործեք ցանցի կառավարման աշխատանքային հոսքը (`iroha app gov deploy propose`) կամ ընտրեք դրանից դուրս գտնվող կեղծանուն։
- Մանիֆեստի կամ ABI-ի անհամապատասխանությունը նշանակում է, որ բայթկոդը, մանիֆեստը և հանգույցի կատարման միջավայրը չեն նկարագրում նույն արտեֆակտը։ Վերակառուցեք ամրագրված commit-ից, ապա կառուցումը կրկին գործարկեք `--verify`-ով։
- `fee quote changed ... gas bound` նշանակում է պահանջված տիպված մտադրության եւ կենդանի առաջարկի անհամաձայնություն: Վերադարձ նախընտրում, այլ ոչ թե ստորագրված գործարքի փոփոխությունը:
- Ընդհատված տեղակայումն իր ստորագրված պլանը պահում է մատյանում։ Նոր պլան ստորագրելու փոխարեն վերականգնեք այն `musubi deploy --resume <JOURNAL>`-ով։
- `is read-only and cannot be invoked as a transaction` կամ `is not a kotoage or lifecycle entrypoint` սխալը նշանակում է, որ `compute`-ն ուղարկվել է կանչի հրամանի։ Այս նմուշը հայտարարում է `view fn`, ուստի տեղականորեն օգտագործեք `debug-view`, իսկ Torii-ում՝ `view`։
- Պայմանագրային զանգերը պահանջում են դրական տիպված գազի սահմանափակություն: Առաջին թողարկման զանգերի պայմանագիրը մերժում է բարձր մակարդակի գազի կամ վճարային ակտիվների մետադատա:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Kotodama V1 հրամանի իրականացումը ամրագրված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [Տուփլե-վերադարձ աղբյուրի նմուշը փակված կոմիտում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Musubi-ի տեղակայման հրամանը](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) և [պայմանագրերի տեղակայման բնիկ ծառայությունը](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs) ամրագրված commit-ում
- [Պայմանագրային ինտեգրման փորձարկումները փակված commit վրա ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [Խելացի պայմանագրեր](/hy/blockchain/smart-contracts.md)
- [CLI հղում](/hy/get-started/operate-iroha-via-cli.md)
