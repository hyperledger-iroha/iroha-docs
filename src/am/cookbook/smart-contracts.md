---
translation_locale: am
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# ስማርት ውል ይገንቡ እና ያሰማሩ {#build-and-deploy-a-smart-contract}

## ውጤት {#outcome}

የ Kotodama V1 ውል ይፈትሹ እና ያጠናቅሩ፣ ይፋዊ የእይታ ተግባሩን በአገር ውስጥ ያሂዱ፣ የተረጋገጠውን IVM አርቲፋክት በግልጽ በተመረጡና በፈቃድ ባለቤቱ በሚከፈሉ ክፍያዎች ያሰማሩ፣ እና የተሰማራውን የእይታ ተግባር በ Torii በኩል ያንብቡ።

## ቅድመ ሁኔታዎች {#prerequisites}

- በፕሮቶኮል ማጠናቀቂያ `c8c872461e92f04325c350cdd952f4276e96f9dc`፣ Rust እና ጭነት ላይ የ Iroha ምንጭ-ኮድ የሚሰራ ቅጂ።
- የአሁኑ `iroha` CLI እና `musubi` (በሚሰራው የምንጭ-ኮድ ቅጂ ውስጥ እንደ `cargo run -p musubi --` የሚሄድ)፣ እንዲሁም በገንዘብ የተደገፈ Taira ደንበኛ ከ[ከ Taira ጋር ይገናኙ](./connect-to-taira.md)።
- በ`IROHA_CONFIG` ውስጥ ፍፁም መንገድ። የ Musubi የአውታረ መረብ ትስስር የዚህን የደንበኛ ፋይል ማጣቀሻ ያከማቻል እና ማሰማራቱን በዚያ ፋይል የመለያ ቁልፍ ይፈርማል።
- የተለዋጭ ስም ስልጣን። አስፈፃሚው ለትክክለኛው የውል ተለዋጭ ስም ወይም ለወላጅ ወሰኑ `CanManageAccountAlias` ይፈልጋል፦ ለ`name::domain.dataspace` ባለቤት የሆነው ጎራ፣ ወይም ለ`name::dataspace` የውሂብ ቦታው። የተመዘገቡ መለያዎች የተለየ የኮድ ምዝገባ ፈቃድ አያስፈልጋቸውም፣ እና የተጠበቁ የስም ቦታዎች የአውታረ መረቡን የአስተዳደር የስራ ሂደትም ይጠይቃሉ። ምሳሌዎቹ `cookbook_tuple::universal` ይጠቀማሉ፤ በ Taira ላይ በባለቤትነት በያዙት ጎራ ውስጥ ባለ ተለዋጭ ስም ይተኩት፣ ወይም ጀነሲሱ የተለዋጭ ስም ወሰኑን በሚሰጥ የመነጨ የአካባቢ አውታረ መረብ ላይ ያሰማሩ።

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## እርምጃዎች {#steps}

### 1. የታወቀ-ጥሩ Kotodama V1 ውል ይቅዱ {#_1-copy-a-known-good-kotodama-v1-contract}

በተሰካው Iroha ቼክ መውጫ ውስጥ ይስሩ እና የአቀናባሪውን ቱፕል-መመለሻ ናሙና ይቅዱ ስለዚህ ምንጩ እና የመሳሪያ ሰንሰለቱ በተመሳሳይ ፕሮቶኮል ማጠናቀቂያ ላይ ይቆያሉ።

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

ሙሉው ምንጭ ትንሽ ነው፤ አንድ የግል ረዳት `fn` እና ማንኛውንም ጠሪ በግልጽ የሚፈቅድ አንድ ይፋዊ ተነባቢ-ብቻ `view fn` ይዟል፦

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

Kotodama Iroha ቨርቹዋል ማሽን እና የአሁኑን ABI ያነጣጠረ ነው። WASM ወይም EVM ምንጭ ቋንቋ አይደለም።.

### 2. አርቲፋክቱን ይፈትሹ፣ ይገንቡ እና ያረጋግጡ {#_2-check-build-and-verify-the-artifact}

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

የመጀመሪያው ግንባታ አርቲፋክቶቹን እና የተረጋገጡ ተጓዳኝ ፋይሎችን ያትማል። ሁለተኛው በንባብ-ብቻ `--verify` ሁነታ ይሰራል እና ማንኛውም ነባር ውፅዓት ከአሁኑ ምንጭ ጋር በትክክል የማይዛመድ ከሆነ አይሳካም። የ`.to` ፋይሉን እና ቴክኒካል ማኒፌስታውን እንደ አንድ ይያዙት የተገመገመ የግንባታ ውጤት።

### 3. ባይት ኮዱን በአገር ውስጥ ያሂዱ {#_3-run-the-bytecode-locally}

`compute` ይፋዊ ተነባቢ-ብቻ `view fn` ነው። ግብይት ሳያስገቡ ወይም ለግብይት ሳይከፍሉ የተጠናቀረውን ባይት ኮድ በአማራጭ የሙከራ አብነቶች ላይ በአገር ውስጥ በሚያስፈጽመው በ`debug-view` ያሂዱት።

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama ኢንቲጀሮች እንደ JSON ሕብረቁምፊዎች ይተረጎማሉ፣ ስለዚህ የተገለፀው ቱፕል `["3", "5"]` ነው።

### 4. የተረጋገጠውን አርቲፋክት በ Musubi ያሰማሩ {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` ውሎችን ይፈትሻል፣ የእይታ ተግባሮቻቸውን ያሂዳል እና ስህተቶቻቸውን ያርማል፣ ነገር ግን አያሰማራቸውም፤ ስለዚህ የ Taira ማሰማራቶች በ Musubi በኩል ይከናወናሉ። የማሰማራት አገልግሎቱ የባይት ኮድ ቁርጥራጮቹን ይሰቅላል፣ የተረጋገጠውን ቴክኒካል ማኒፌስት ይመዘግባል እና አንድ `CommitContractDeployment` ክዋኔ ያቀርባል። ለእያንዳንዱ ግብይት የክፍያ ዋጋ ግምት ያወጣል፣ የተመረጠውን ከፋይ፣ የስፖንሰር ክለሳ ወይም የግብይት ማስፈጸሚያ ወጪ ገደብ የሚቀይር የክፍያ ዋጋ ግምት ውድቅ ያደርጋል፣ እና የተቆለፈው የጥቅል ግንባታ የአርቲፋክቱን የኮድ እና የ ABI ሃሾች እንደገና ካስገኘ በኋላ ብቻ አስቀድሞ የተገነባውን አርቲፋክት ያሰማራል። በ Kagami በሚተዳደር የአካባቢ አውታረ መረብ ላይ በምትኩ `kagami contract deploy` `./build/tuple_return_demo.to`ን በ`--alias cookbook_tuple::universal --json` ያሰማራል፤ ደረሰኙ በ`.receipt` ስር ይገኛል፣ እና `kagami context show` እንደ `IROHA_CONFIG` የሚያገለግለውን የደንበኛ ውቅር ያትማል።

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

ትስስሩ `--fee-payer authority` ይጠቀማል፤ Musubi ከመፈረሙ በፊት ትክክለኛውን ክፍያ በ Taira የክፍያ ንብረት የሚገልጽ የክፍያ ዋጋ ግምት ያቀርባል። የተመለሰውን የክፍያ ንብረት የአሁኑ የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ፖሊሲ ከሚያትመው ጋር ያወዳድሩ። የኮንትራት ጥሪዎች የክፍያ ምርጫን የሚቀበሉት ዓይነቱ በተገለጸው የቀጥታ የክፍያ ዋጋ ግምት በኩል ብቻ ነው፤ `gas_asset_id` የግብይት ሜታዳታ የመጀመሪያ ልቀት ውል አካል አይደለም።

### 5. የተሰማራውን የእይታ ተግባር ያንብቡ {#_5-read-the-deployed-view}

`contract view` ተነባቢ-ብቻ የሆነውን የመግቢያ ነጥብ ያለ ግብይት ወይም ክፍያ በ Torii ላይ ያስፈጽማል። የእይታ ተግባር የግብይት ቅጽ የለውም፦ Torii በቴክኒካል ጥሪ መንገዶቹ ላይ የሚቀርብን የእይታ ተግባር መራጭ ውድቅ ያደርጋል።

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## አረጋግጥ {#verify}

ተለዋጭ ስሙን ይፍቱ፣ Torii ለተሰማራው የእይታ ተግባር በሚያሳውቀው የኮድ ምስጠራ ሃሽ በሰንሰለት ላይ ያለውን ቴክኒካል ማኒፌስት ያምጡ፣ እና ተመሳሳዩን የእይታ ተግባር በአንድ ፕሮቶኮል-መደበኛ አድራሻ ያሂዱ፦

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

ማሰማራት የሚጠናቀቀው የማሰማራት ደረሰኙ የተከማቸውን አርቲፋክት እንደተረጋገጠ ሲያሳውቅ፣ ተለዋጭ ስሙ ወደ ተመለሰው አድራሻ ሲፈታ፣ ቴክኒካል ማኒፌስቱ በተመሳሳይ የኮድ ምስጠራ ሃሽ ስር ሊነበብ ሲችል፣ እና የአካባቢው እና የ Torii የእይታ ተግባራት `["3", "5"]` ሲመልሱ ብቻ ነው።

## መላ ፍለጋ {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias`፣ ወይም የአስፈፃሚው `authority is not permitted to manage contract alias`፣ ማለት መለያው ያንን ተለዋጭ ስም ማሰር አይችልም ማለት ነው። በባለቤትነት በያዙት ጎራ ውስጥ ያለ ተለዋጭ ስም ይጠቀሙ፣ ወይም ትክክለኛውን የተለዋጭ ስም የፈቃድ ስጦታ ወይም የጎራውን ወይም የውሂብ ቦታውን የፈቃድ ስጦታ ከዚያ ወሰን ባለቤት ያግኙ፤ በlocalnet ላይ በጀነሲስ ውስጥ ይስጡት።
- የተጠበቀ የስም ቦታ አለመቀበል ማለት የተለዋጭ ስሙ የስም ቦታ በአስተዳደር ቁጥጥር ስር ነው ማለት ነው። የአጽዳቂ መለያ መታወቂያዎችን መዘርዘር የማጽደቅ ማስረጃ አይደለም፤ ለዚያ የስም ቦታ የአውታረ መረቡን የአስተዳደር የስራ ሂደት (`iroha app gov deploy propose`) ይጠቀሙ፣ ወይም ከዚያ የስም ቦታ ውጭ ያለ ተለዋጭ ስም ይምረጡ።
- ቴክኒካል ማኒፌስት ወይም ABI አለመመጣጠን ማለት የባይት ኮድ፣ ቴክኒካል ማኒፌስት እና የኖድ ሶፍትዌር ማስፈጸሚያ አካባቢ አንድ አይነት አርቲፋክት አይገልጹም ማለት ነው። በተሰካው የምንጭ-ኮድ ክለሳ እንደገና ይገንቡ፣ ከዚያም ግንባታውን በ`--verify` እንደገና ያሂዱ።
- `fee quote changed ... gas bound` ማለት የተጠየቀው የተተየበ ዓላማ እና የቀጥታ የክፍያ ዋጋ ግምት አይስማሙም ማለት ነው።. የተፈረመ ግብይት ከመቀየር ይልቅ እንደገና ቅድመ-በረራ.
- የተቋረጠ ማሰማራት የተፈረመውን እቅዱን በሂደት መዝገብ (journal) ውስጥ ያስቀምጣል። አዲስ እቅድ ከመፈረም ይልቅ በ`musubi deploy --resume <JOURNAL>` መልሰው ያስቀጥሉት።
- `is read-only and cannot be invoked as a transaction` ወይም `is not a kotoage or lifecycle entrypoint` ማለት `compute` ወደ ቴክኒካል ጥሪ ትዕዛዝ ተልኳል ማለት ነው። ይህ ናሙና `view fn` ያውጃል፣ ስለዚህ በአገር ውስጥ `debug-view` እና በ Torii ላይ `view` ይጠቀሙ።
- የኮንትራት ጥሪዎች አዎንታዊና ዓይነቱ የተገለጸ የ gas ገደብ ይፈልጋሉ። የመጀመሪያ ልቀት ጥሪ ኮንትራት ከፍተኛ-ደረጃ gas ወይም የክፍያ-ንብረት ሜታዳታን ይከለክላል።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [Kotodama V1 በተሰካው የምንጭ-ኮድ ክለሳ ላይ የትእዛዝ ትግበራ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የቱፕል-መመለሻ ምንጭ ናሙና](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- በተሰካው የምንጭ-ኮድ ክለሳ ላይ ያሉት [የ Musubi የማሰማራት ትዕዛዝ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) እና [ቤተኛ የውል ማሰማራት አገልግሎት](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የኮንትራት ውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [ብልጥ ኮንትራቶች](/am/blockchain/smart-contracts.md)
- [CLI ማጣቀሻ](/am/get-started/operate-iroha-via-cli.md)
