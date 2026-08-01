---
translation_locale: hy
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 4fe9b19fc4d13cfc71d9b9558fe7cdb1d14bd88c2d20f4d23c66313ba3ddd4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Կառուցեք եւ գործադրեք խելացի պայմանագիր {#build-and-deploy-a-smart-contract}

## Արդյունքը {#outcome}

Փորձեք եւ կազմեք Kotodama V1 պայմանագիր, իրականացրեք դրա հանրային մուտքի կետը տեղում, տեղադրեք ստուգված IVM արվեստի գործարքը, սիմուլավորեք տեղադրված մուտքի կետն ու ներկայացրեք այն հստակ նշված մարմինների կողմից վճարվող վճարով:

## Նախադրյալներ {#prerequisites}

- Iroha աղբյուրի ստուգումը հանձնարարված `bc7114ed1c7f265a156d2100ff09e851cc95702c`, Rust եւ Cargo հասցեներում:
- Ներկայիս `iroha` CLI գումարած ֆինանսավորվող Taira հաճախորդը, որը [ կապվում է Taira ](./connect-to-taira.md):
- Բացարձակ ուղիներ `IROHA_CONFIG` եւ `IROHA_PRIVATE_KEY_FILE`: Գլխավոր ֆայլը պետք է լինի սեփականատիրոջ կողմից պահվող, մեկ հղումով կանոնավոր ֆայլ ՝ ռեժիմով `0600`; տեղակայման օգնականն նպատակահարմարորեն չունի ներքին գաղտնի բանալինային փաստարկ։
- Taira օպերատորի հավանություն: Պայմանագրի կոդի գրանցումը պահանջում է `CanRegisterSmartContractCode`, եւ պաշտպանված տեղակայումները կարող են պահանջել կառավարման հատկանիշներ եւ օրենսդրություն: Եթե Taira-ը չի տվել այդ մուտքը, կատարեք տեղակայումը ստեղծված տեղական ցանցում, որի ծագումն թույլտվություն է տալիս:

```bash
TORII_URL=https://taira.sora.org
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
IROHA_PRIVATE_KEY_FILE=/absolute/path/to/taira-private-key.txt
test -n "$TAIRA_ACCOUNT_ID"
test -f "$IROHA_PRIVATE_KEY_FILE"

CHAIN_ID="$({
  python3 - "$IROHA_CONFIG" <<'PY'
import sys
import tomllib

with open(sys.argv[1], "rb") as config_file:
    print(tomllib.load(config_file)["chain"])
PY
})"
```

## Քայլեր {#steps}

### 1. Հայտնի լավ Kotodama V1 պայմանագրի պատճենը {#_1-copy-a-known-good-kotodama-v1-contract}

Աշխատեք փաթեթավորված Iroha ստուգման մեջ եւ կրկնօրինակեք կոմպիլերի տուփլ-վերադարձ նմուշը, որպեսզի աղբյուրն ու գործիքների շղթան մնան նույն հանձնառության վրա:

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Ամբողջական աղբյուրը փոքր է եւ օգտագործում է ընթացիկ `seiyaku`/`kotoage` կոդավորումը.

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    kotoage fn compute() -> (int, int) authorize("Entry") {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama ուղղված է Iroha Վիրտուալ մեքենային եւ դրա ընթացիկ ABI լեզվին: Այն ոչ թե WASM կամ EVM աղբյուրի լեզու է:

### 2. Փորձարկել, կառուցել եւ ստուգել արվեստի գործարանը {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p ivm --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

Առաջին շինարարությունը հրապարակում է արվեստի գործիքն ու վավերացված կողային մեքենաները: Երկրորդը գործում է միայն ընթերցման `--verify` ռեժիմով եւ ձախողվում է, եթե գոյություն ունեցող արտադրանքը ճիշտ չի համապատասխանում ընթացիկ աղբյուրին: Բարեւեք `.to` ֆայլը եւ դրա մանիֆեսը որպես վերանայված շինարարության արտադրանք:

### 3. Բայթ կոդը տեղականորեն գործարկեք {#_3-run-the-bytecode-locally}

`compute` հանդիսանում է հանրային `kotoage` մուտքի կետ: Գործարկեք այն `debug-call`-ով, որը կատարվում է տեղական ֆիքսիչների դեմ ՝ առանց փոխանցման կամ վճարման համար:

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama ամբողջականները ներկայացվում են որպես JSON շղթաներ, այնպես որ կոդավորված տուպլը կազմում է `["3", "5"]`.

### 4. Բնակչական օգնականի միջոցով տեղադրեք {#_4-deploy-through-the-native-helper}

Օգնողը բեռնում է բայթքոդի կտորներ, գրանցում է ստորագրված մանիֆեսը եւ ներկայացնում մեկ `CommitContractDeployment` գործողություն: Այն վճարովի մեջբերում է յուրաքանչյուր գործարքը եւ մերժում է առաջարկը, որը փոխում է ընտրված վճարողին կամ գազային կապը:

```bash
printf '%s\n' \
  '{"payer":"authority","value":{"charge_limits":[],"gas_limit":1500000}}' \
  > ./build/fee-payment.json

cargo run -p iroha_cli --bin ivm_contract_deploy -- \
  --torii-url "$TORII_URL" \
  --chain-id "$CHAIN_ID" \
  --authority "$TAIRA_ACCOUNT_ID" \
  --private-key-file "$IROHA_PRIVATE_KEY_FILE" \
  --code-file ./build/tuple_return_demo.to \
  --contract-alias cookbook_tuple::universal \
  --fee-payment-json ./build/fee-payment.json \
  --out-dir ./build/deployment \
  > ./build/deployment.json

jq '{contract_address, code_hash_hex, final, fee_quotes}' \
  ./build/deployment.json
```

Հ रिक्त `charge_limits` խնդրանքը կրկնօրինակված ակտիվի նույնականացնող չէ. օգնականը ստորագրելուց առաջ ընդունում է ճշգրիտ կենդանի առաջարկը: Համեմատեք վերադարձած վճարային ակտիվը ներկայիս գազայի պատասխանի հետ: Պայմանավորվող զանգերին մի մի միցրեք ժառանգական `gas_asset_id` մետադատաներ:

### 5. Սիմուլացնել եւ զանգահարել տեղակայված մուտքի կետին {#_5-simulate-and-call-the-deployed-entrypoint}

Սիմուլյացիան գործարկում է հանրային մուտքի կետը Torii ՝ առանց ներկայացնելու: Հաջորդ զանգը գործարք է եւ, հետեւաբար, բացարձակապես ընտրում է իշխանության վճարման վճարողին: Երկու հրամանները կապում են գազի 1,500,000 սահմանը:

```bash
iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-simulation.json

iroha --config "$IROHA_CONFIG" \
  --machine \
  --fee-payer authority \
  contract call \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  --wait \
  --timeout-ms 60000 \
  > ./build/deployed-call.json

jq -e '.terminal_kind == "Applied"' ./build/deployed-call.json
```

## Փորձարկել {#verify}

Բացահայտեք կեղծանունը, բերեք շղթայի վրա գտնվող մանիֆեսը վերադարձված կոդի հաշշով եւ սիմուլիացրեք նույն հանրային մուտքի կետը կանոնիկ հասցեով.

```bash
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/deployment.json; })"
CONTRACT_ADDRESS="$({ jq -er '.contract_address' ./build/deployment.json; })"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-simulation.json
```

Տեղեկատվությունը կատարվում է միայն այն ժամանակ, երբ կեղծանունը լուծվում է վերադարձված հասցեին, մանիֆեսը ընթերցելի է նույն կոդի հաշսի ներքո, տեղական եւ Torii սիմուլյացիոն վերադարձ `["3", "5"]`, եւ ուղարկված զանգը հասնում է `Applied`:

## Խնդիրների լուծում {#troubleshooting}

- `CanRegisterSmartContractCode` ձախողումները պահանջում են Taira օպերատորի Grant կամ localnet- ում genesis/bootstrap փոփոխություն: Սովորական հաշիվը չի կարող ինքնուրույն տրամադրել այս թույլտվությունը փաստից հետո:
- Կառավարությունը կամ պաշտպանված գոտու մերժումը նշանակում է, որ տեղակայման համար անհրաժեշտ է տվյալ ցանցի կողմից պահանջվող հստակ հավանության հատկանիշը: Համակարգեք հավանության ցուցակը. Մի ստեղծեք հաշիվ IDs.
- Manifest կամ ABI անհամապատասխանությունը նշանակում է, որ բայթ կոդը, manifest- ը եւ հանգույցի գործնական ժամանակը չեն նկարագրում նույն արվեստագետին: Վերակառուցեք փակցված commit- ի հետ `--verify`։
- `fee quote changed ... gas bound` նշանակում է պահանջված տիպված մտադրության եւ կենդանի առաջարկի անհամաձայնություն: Վերադարձ նախընտրում, այլ ոչ թե ստորագրված գործարքի փոփոխությունը:
- Ներբեռնման օգնականը մերժում է ներշնչված բանալիները, թույլատրելի բանալիների ֆայլերի ռեժիմները, համառոտ հղումները եւ բազմապատկել կապված ֆայլերը մինչեւ ցանցի ներկայացումը:
- Միայն տեսողության մուտքային կետի սխալը նշանակում է, որ `compute` ուղղորդվել է սխալ հրամանատարների ընտանիքով: Այս նմուշը հայտարարում է `kotoage`, այնպես որ օգտագործեք զանգի սիմուլյացիա կամ ներկայացում.
- Պայմանագրային զանգերը պահանջում են դրական տիպված գազի սահմանափակում: Բարձր մակարդակի հին գազի կամ վճարային ակտիվների մետադատները մերժվում են.

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Kotodama V1 հրամանատարի իրականացումը փակված կոմիտեում](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/src/bin/koto.rs):
- [Տուփլե-վերադարձ աղբյուրի նմուշը փակված կոմիտում](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Տեղական տեղադրման օգնականը փակված հանձնաժողովում](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Պայմանագրային ինտեգրման փորձարկումները փակված պարտավորության վրա ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/contracts.rs)
- [Խելացի պայմանագրեր](/hy/blockchain/smart-contracts.md)
- [CLI հղում](/hy/get-started/operate-iroha-via-cli.md)
