---
translation_locale: am
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ስማርት ውል ይገንቡ እና ያሰማሩ {#build-and-deploy-a-smart-contract}

## ውጤት {#outcome}

የ Kotodama V1 ውል ይፈትሹ እና ያጠናቅሩ፣ ይፋዊ የመግቢያ ነጥቡን በአገር ውስጥ ያስፈጽሙ፣ የተረጋገጠውን IVM አርቲፋክት ያሰማሩ፣ የተዘረጋውን የመግቢያ ነጥብ አስመስለው እና በግብይቱ ፊርማ መለያ የተከፈለውን ግልጽ የክፍያ ዋጋ ግምት ያስገቡ።

## ቅድመ ሁኔታዎች {#prerequisites}

- በፕሮቶኮል ማጠናቀቂያ `0010c5a70039eac101a4846499ba9ceaf43eb65c`፣ Rust እና ጭነት ላይ የ Iroha ምንጭ-ኮድ የሚሰራ ቅጂ።
- የአሁኑ `iroha` CLI እና በገንዘብ የተደገፈ Taira ደንበኛ ከ[ከ Taira ጋር ይገናኙ](./connect-to-taira.md)።
- በ `IROHA_CONFIG` እና `IROHA_PRIVATE_KEY_FILE` ውስጥ ያሉ ፍፁም መንገዶች። የቁልፍ ፋይሉ በባለቤትነት የተያዘ፣ ነጠላ-አገናኝ መደበኛ ፋይል ከሞድ `0600` ጋር መሆን አለበት። የማሰማራት አጋዥው ሆን ብሎ ምንም የመስመር ውስጥ የግል-ቁልፍ ክርክር የለውም።
- Taira የኦፕሬተር ማጽደቅ. የኮንትራት ኮድ ምዝገባ `CanRegisterSmartContractCode` ያስፈልገዋል፣ እና የተጠበቁ ማሰማራቶች የአስተዳደር ባለቤትነት እና ድንጋጌን ሊጠይቁ ይችላሉ። Taira ያንን መዳረሻ ካልሰጠ፣ የብሎክቼይን ጀነሲስ ፈቃዱን በሚሰጥ በተፈጠረ የአካባቢ አውታረ መረብ ላይ ማሰማራቱን ያከናውኑ።

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

### 1. የታወቀ-ጥሩ Kotodama V1 ውል ይቅዱ {#_1-copy-a-known-good-kotodama-v1-contract}

በተሰካው Iroha ቼክ መውጫ ውስጥ ይስሩ እና የአቀናባሪውን ቱፕል-መመለሻ ናሙና ይቅዱ ስለዚህ ምንጩ እና የመሳሪያ ሰንሰለቱ በተመሳሳይ ፕሮቶኮል ማጠናቀቂያ ላይ ይቆያሉ።

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

ሙሉው ምንጭ ትንሽ ነው እና የአሁኑን `seiyaku`/`kotoage` አገባብ ይጠቀማል -

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

Kotodama Iroha ቨርቹዋል ማሽን እና የአሁኑን ABI ያነጣጠረ ነው። WASM ወይም EVM ምንጭ ቋንቋ አይደለም።.

### 2. አርቲፋክቱን ይፈትሹ፣ ይገንቡ እና ያረጋግጡ {#_2-check-build-and-verify-the-artifact}

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

የመጀመሪያው ግንባታ አርቲፋክቶቹን እና የተረጋገጡ ተጓዳኝ ፋይሎችን ያትማል። ሁለተኛው በንባብ-ብቻ `--verify` ሁነታ ይሰራል እና ማንኛውም ነባር ውፅዓት ከአሁኑ ምንጭ ጋር በትክክል የማይዛመድ ከሆነ አይሳካም። የ`.to` ፋይሉን እና ቴክኒካል ማኒፌስታውን እንደ አንድ ይያዙት የተገመገመ የግንባታ ውጤት።

### 3. ባይት ኮዱን በአገር ውስጥ ያሂዱ {#_3-run-the-bytecode-locally}

`compute` ይፋዊ `kotoage` የመግቢያ ነጥብ ነው።. ለግብይት ሳያስገቡ ወይም ሳይከፍሉ በአካባቢያዊ የሙከራ አብነቶች ላይ በሚፈጽመው በ`debug-call` ያሂዱት።

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama ኢንቲጀሮች እንደ JSON ሕብረቁምፊዎች ይተረጎማሉ፣ ስለዚህ የተገለፀው ቱፕል `["3", "5"]` ነው።

### 4. በአገሬው ተወላጅ ረዳት በኩል ያሰማሩ {#_4-deploy-through-the-native-helper}

ረዳቱ የባይት ኮድ ቁርጥራጮችን ይሰቅላል፣ የተፈረመውን ቴክኒካል ማኒፌስት ይመዘግባል እና አንድ `CommitContractDeployment` ክዋኔ ያቀርባል። እያንዳንዱን ግብይት ክፍያ ይጠቅሳል እና የተመረጠውን ከፋይ ወይም የግብይት ማስፈጸሚያ ወጪ ገደብ የሚቀይር የክፍያ ዋጋ ግምት ውድቅ ያደርጋል።

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

ባዶው `charge_limits` ጥያቄ የተቀዳ የንብረት መለያ አይደለም ረዳቱ ከመፈረሙ በፊት ትክክለኛውን የቀጥታ የክፍያ ዋጋ ግምት ይቀበላል። የተመለሰውን የክፍያ ንብረት አሁን ካለው የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ምላሽ ጋር ያወዳድሩ። የኮንትራት ጥሪዎች የክፍያ ምርጫን የሚቀበሉት በተተየበው የቀጥታ የክፍያ ዋጋ ግምት ብቻ ነው። `gas_asset_id` የግብይት ሜታዳታ የመጀመሪያ ልቀት ውል አካል አይደለም።.

### 5. የተሰማራውን የመግቢያ ነጥብ ማስመሰል እና ጥሪ {#_5-simulate-and-call-the-deployed-entrypoint}

ማስመሰል ይፋዊ የመግቢያ ነጥቡን በ Torii ላይ ያለ ማስገባት ያካሂዳል። የሚከተለው ቴክኒካል ጥሪ ግብይት ነው እና ስለዚህ የፍቃድ ዋና ክፍያ ከፋይን በግልፅ ይመርጣል። ሁለቱም ትዕዛዞች የ1,500,000 የግብይት ማስፈጸሚያ ወጪ ገደብን ያስራሉ።

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

## አረጋግጥ {#verify}

ተለዋጭ ስሙን ይፍቱ፣ የተመለሰውን ኮድ ምስጠራ ሃሽ በመጠቀም በሰንሰለት ላይ ያለውን ቴክኒካል ማኒፌስት ያምጡ እና ተመሳሳዩን የህዝብ መግቢያ ነጥብ በአንድ ፕሮቶኮል-መደበኛ አድራሻ አስመስለው -

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

ማሰማራት የሚጠናቀቀው ተለዋጭ ስሙ ወደ ተመለሰው አድራሻ ሲፈታ ብቻ ነው፣ ቴክኒካል ማኒፌስት በተመሳሳይ ኮድ ምስጠራ ሃሽ፣ አካባቢያዊ እና Torii ማስመሰያዎች ይመለሳሉ `["3", "5"]`፣ እና የቀረበው ቴክኒካል ጥሪ `Applied` ሲደርስ ብቻ ነው።

## መላ ፍለጋ {#troubleshooting}

- `CanRegisterSmartContractCode` ውድቀቶች የ Taira ኦፕሬተር ስጦታ ወይም በlocalnet ላይ የጀነሲስ/ቡት ማሰሪያ ለውጥ ያስፈልጋቸዋል።. መደበኛ መለያ ይህን ፍቃድ ለራሱ ሊሰጥ አይችልም።
- አስተዳደር ወይም የተጠበቀ-ሌይን አለመቀበል ማለት ማሰማራቱ በዚያ አውታረ መረብ የሚፈለገውን ትክክለኛ የማጽደቅ ባህሪ ያስፈልገዋል ማለት ነው። የማጽደቅ ዝርዝሩን ማስተባበር; የመለያ መታወቂያዎችን አይፈጠሩ።
- ቴክኒካል ማኒፌስት ወይም ABI አለመመጣጠን ማለት የባይት ኮድ፣ ቴክኒካል ማኒፌስት እና የኖድ ሶፍትዌር ማስፈጸሚያ አካባቢ አንድ አይነት አርቲፋክት አይገልጹም ማለት ነው። በተሰካው የምንጭ-ኮድ ክለሳ በ`--verify` እንደገና ይገንቡ።
- `fee quote changed ... gas bound` ማለት የተጠየቀው የተተየበ ዓላማ እና የቀጥታ የክፍያ ዋጋ ግምት አይስማሙም ማለት ነው።. የተፈረመ ግብይት ከመቀየር ይልቅ እንደገና ቅድመ-በረራ.
- የማሰማራት አጋዥው አውታረ መረብ ከማስገባቱ በፊት የመስመር ውስጥ ቁልፎችን፣ የሚፈቀዱ የቁልፍ-ፋይል ሁነታዎችን፣ ሲምሊንኮችን እና የተገናኙ ፋይሎችን ማባዛት ውድቅ ያደርጋል።
- የእይታ ብቻ የመግቢያ ነጥብ ስህተት ማለት `compute` በተሳሳተ የትዕዛዝ ቤተሰብ በኩል ተላልፏል። ይህ ናሙና `kotoage` ያውጃል፣ ስለዚህ የቴክኒክ ጥሪ ማስመሰልን ወይም ማስረከብን ይጠቀሙ።
- የኮንትራት ጥሪዎች አዎንታዊና ዓይነቱ የተገለጸ የ gas ገደብ ይፈልጋሉ። የመጀመሪያ ልቀት ጥሪ ኮንትራት ከፍተኛ-ደረጃ gas ወይም የክፍያ-ንብረት ሜታዳታን ይከለክላል።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [Kotodama V1 በተሰካው የምንጭ-ኮድ ክለሳ ላይ የትእዛዝ ትግበራ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የቱፕል-መመለሻ ምንጭ ናሙና](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [ቤተኛ ማሰማራት ረዳት በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የኮንትራት ውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [ብልጥ ኮንትራቶች](/am/blockchain/smart-contracts.md)
- [CLI ማጣቀሻ](/am/get-started/operate-iroha-via-cli.md)
