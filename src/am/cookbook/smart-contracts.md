---
translation_locale: am
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 67778f9fc4f2b6fa0288f5921402cf5509515aae678e98b8192e103dfe284db3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ስማርት ኮንትራት መገንባትና ተግባራዊ ማድረግ {#build-and-deploy-a-smart-contract}

## ውጤቱ {#outcome}

የ Kotodama V1 ውል ይፈትሹ እና ያጠናቅቁ ፣ በአካባቢው የህዝብ መግቢያ ቦታውን ያካሂዱ ፣ የተረጋገጠውን IVM አርቴፎክትን ያሰማሩ ፣ የተተገበረውን የመግቢያ ነጥብ ያንፀባርቁ እና በግልጽ ከተጠቀሰው ባለሥልጣን ክፍያ ጋር ያቅርቡት ።

## ቅድመ ሁኔታዎች {#prerequisites}

- የ Iroha ምንጭ ማረጋገጫ በ `0010c5a70039eac101a4846499ba9ceaf43eb65c` ፣ Rust እና በ Cargo.
- የአሁኑ `iroha` CLI እና የገንዘብ ድጋፍ የተደረገለት Taira ደንበኛ ከ [ ወደ Taira](./connect-to-taira.md) ይገናኙ።
- በ `IROHA_CONFIG` እና `IROHA_PRIVATE_KEY_FILE` ውስጥ ፍጹም መንገዶች. ቁልፍ ፋይሉ ባለቤት የሚይዝ, ሁነታ ጋር ነጠላ አገናኝ መደበኛ ፋይል መሆን አለበት `0600`; የማሰማራት ረዳት ሆን ተብሎ ምንም ውስጣዊ የግል-ቁልፍ ክርክር የለውም.
- Taira ኦፕሬተር ማጽደቅ። የውል ኮድ ምዝገባ `CanRegisterSmartContractCode` ይጠይቃል ፣ እና የተጠበቁ ልውውጦች የአስተዳደር መመዘኛ እና ህግ ማውጣት ሊጠይቁ ይችላሉ ። Taira ያንን መዳረሻ ካላቀረበ ልውውጡን በጄኔሬተሩ ፈቃድ በሚሰጥበት አካባቢያዊ አውታረመረብ ላይ ያድርጉ።

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

## እርምጃዎች {#steps}

### 1. የታወቀ-ጥሩ Kotodama V1 ውል ቅጅ {#_1-copy-a-known-good-kotodama-v1-contract}

የተጣራ Iroha ቼክ ውስጡ ላይ ይሰራሉ እና የቅጂ አምራች የቱፕል-መልሶ ናሙና ቅጅ ስለዚህ ምንጭ እና የመሳሪያ ሰንሰለት በተመሳሳይ ተደራሽነት ላይ ይቆያሉ.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

የተሟላው ምንጭ አነስተኛ ሲሆን የአሁኑን `seiyaku`/`kotoage` አገባብ ይጠቀማል-

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

Kotodama ግቦች Iroha ምናባዊ ማሽን እና የአሁኑ ABI. ይህ አይደለም WASM ወይም EVM የመነሻ ቋንቋ።

### 2. ጥንታዊውን ዕቃ መመርመር፣ መገንባት እና ማረጋገጥ {#_2-check-build-and-verify-the-artifact}

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

የመጀመሪያው ግንባታ ቅርጸ-ቁምፊውን እና የተረጋገጡ የጎን ተሽከርካሪዎችን ያወጣል ሁለተኛው በንባብ ብቻ `--verify` ሁነታ ይሠራል እናም ማንኛውም ነባር ውፅዓት አሁን ካለው ምንጭ ጋር በትክክል የማይጣጣም ከሆነ አይሳካም ። የ `.to` ፋይልን እና ማኒፌሱን እንደ አንድ የተመለከቱት የግንባታ ውፅዓት ይያዙ።

### 3. ባይት ኮዱን በአካባቢው አሂድ። {#_3-run-the-bytecode-locally}

`compute` የህዝብ መግቢያ ነጥብ `kotoage` ነው ። በ `debug-call` ይሂዱ ፣ ይህም ያለ ግብይት ሳያቀርብ ወይም ክፍያ ሳይከፍል በአካባቢያዊ ማያ ገጾች ላይ ይሠራል።

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama ሙሉ ቁጥሮች እንደ JSON ገመዶች ይቀርባሉ, ስለዚህ የተገለጸው ቱፕል `["3", "5"]` ነው.

### 4. በአገሬው ተወላጅ ረዳት አማካኝነት ማሰማራት {#_4-deploy-through-the-native-helper}

ረዳቱ የባይትኮድ ቁርጥራጮችን ይጫናል ፣ የተፈረመውን ማኒፌስት ይመዘግባል እና አንድ `CommitContractDeployment` ክወና ያቀርባል ። እያንዳንዱን ግብይት ክፍያ የሚጠይቅ ሲሆን የተመረጠውን ተመላሽ ወይም ጋዝ ቦንድ የሚቀይር ዋጋ ውድቅ ያደርጋል።

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

ባዶው `charge_limits` ጥያቄ የተገለጸ የንብረት መታወቂያ አይደለም: ረዳቱ ከመፈረምዎ በፊት ትክክለኛውን የቀጥታ ዋጋ ይቀበላል. የአሁኑ የውሃ ቧንቧ ምላሽ: የውል ጥሪዎች ክፍያ ምርጫን የሚቀበሉት በተጻፈው የቀጥታ ዋጋ አቅርቦት ብቻ ነው; `gas_asset_id` ግብይት ሜታዳታ የመጀመሪያ-ልቀት ውል አካል አይደለም.

### 5. የተሰማራውን የመግቢያ ነጥብ ማስመሰል እና ጥሪ ማድረግ። {#_5-simulate-and-call-the-deployed-entrypoint}

ሲሙሌሽን የህዝብ መግቢያ ነጥብ በ Torii ላይ ያለ ማስገባት ያካሂዳል ። የሚከተለው ጥሪ ግብይት ነው እናም ስለሆነም ባለሥልጣን ክፍያ የሚከፍለውን በግልጽ ይመርጣል ። ሁለቱም ትዕዛዞች የ 1,500,000 ጋዝ ገደብን ይያዛሉ ።

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

## ያረጋግጡ {#verify}

ስያሜውን መፍታት፣ በሰንሰለት ላይ የሚገኘውን ማኒፌስት በተመለሰው ኮድ ሃሽ በመፈለግ እና ተመሳሳይ የህዝብ መግቢያ ነጥብ በካኖኒካል አድራሻ በማስመሰል

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

ልውውጥ የተጠናቀቀው ቅጽል ስም ወደ ተመላሽ አድራሻ ሲፈታ ብቻ ነው ፣ ማኒፌስት በተመሳሳይ ኮድ ሃሽ ፣ አካባቢያዊ እና Torii ማስመሰያዎች መመለስ `["3", "5"]` ስር ሊነበብ የሚችል ሲሆን የቀረበው ጥሪም `Applied` ላይ ደርሷል ።

## ችግሮችን መፍታት {#troubleshooting}

- `CanRegisterSmartContractCode` ውድቀቶች የ Taira ኦፕሬተር ድጎማ ወይም በ localnet ላይ የመነሻ / bootstrap ለውጥ ይጠይቃሉ። አንድ መደበኛ መለያ ይህንን ፈቃድ ከሁኔታው በኋላ በራሱ መስጠት አይችልም ።
- አስተዳደር ወይም የተጠበቁ መስመሮች ውድቀት ማለት ልውውጥ በዚያ አውታረ መረብ የሚፈለገውን ትክክለኛ ማረጋገጫ መመዘኛ ይፈልጋል ። የማረጋገጫ ዝርዝሩን ማስተባበር; ሂሳብ IDs አይፈጥሩ.
- አንድ manifest ወይም ABI አለመመሳሰል ማለት ባይትኮድ, manifest እና ኖት ሩጫ ጊዜ ተመሳሳይ ንጥረ ነገር አይገልጹም ማለት ነው. በ `--verify` የተጣበቀውን commit ላይ እንደገና ይገንቡ ።
- `fee quote changed ... gas bound` ማለት የተጠየቀው የታተመ ዓላማ እና የቀጥታ ዋጋ ስምምነት አለመግባባት ማለት ነው.
- የማሰማራት ረዳቱ የመስመር ላይ ቁልፎችን ፣ የመፍቀድ ቁልፍ-ፋይል ሁነቶችን ፣ symlinks እና የተገናኙ ፋይሎችን ከመቅረባቸው በፊት በማባዛት ይቀበላል ።
- አንድ እይታ ብቻ የመግቢያ ነጥብ ስህተት ማለት `compute` የተሳሳተ ትዕዛዝ ቤተሰብ በኩል አቅጣጫ ነበር. ይህ ናሙና ይገልጻል `kotoage`, ስለዚህ ጥሪ ማስመሰያ ወይም ማቅረቢያ መጠቀም.
- የኮንትራት ጥሪዎች አዎንታዊ የተጻፈ ጋዝ ገደብ ይጠይቃሉ. የመጀመሪያው ልቀት ጥሪ ውል ከፍተኛ ደረጃ ጋዝ ወይም ክፍያ-አክሲዮን ሜታዳታ ውድቅ ያደርጋል.

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [Kotodama V1 ትዕዛዝ ትግበራ በፒን የተደረገ ኮሚቴ ላይ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [በፒን የተደረገባቸው commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko) ላይ የቱፕል-ሪተርን ምንጭ ናሙና
- [የተጣራ ተልእኮ ላይ ተወላጅ የማሰማራት ረዳት ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [በኮንትራት ውህደት ሙከራዎች በተጣራ ተሳትፎ ላይ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [ስማርት ኮንትራቶች](/am/blockchain/smart-contracts.md)
- [CLI ማጣቀሻ](/am/get-started/operate-iroha-via-cli.md)
