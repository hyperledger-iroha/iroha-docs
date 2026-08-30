---
translation_locale: my
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 67778f9fc4f2b6fa0288f5921402cf5509515aae678e98b8192e103dfe284db3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# စမတ်ကျတဲ့ စာချုပ်တစ်ခု တည်ဆောက်ပြီး အသုံးချပါ။ {#build-and-deploy-a-smart-contract}

## ရလဒ် {#outcome}

Kotodama V1 စာချုပ်ကို စစ်ဆေးပြီး စုစည်းခြင်း၊ ၎င်း၏ အများပြည်သူဝင်ရောက်မှတ်တိုင်ကို ဒေသတွင်းတွင် အကောင်အထည်ဖော်ခြင်း၊ စစ်ဆေးထားသော IVM လက်ရာပစ္စည်းကို ဖြန့်ချိခြင်း၊ ဖြန့်ဖြူးထားသည့် ဝင်ရောက်မှတ်တိုင်အား တုပခြင်းနှင့် အာဏာပိုင်များက ရှင်းလင်းစွာ ဖော်ပြထားသော အခွန်ဖြင့် ပေးသွင်းခြင်း။

## လိုအပ်ချက်များ {#prerequisites}

- Iroha source checkout at commit `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust နှင့် Cargo တို့တွင် ပေးပို့ခြင်း။
- လက်ရှိ `iroha` CLI နောက်ပြီး ငွေကြေးထောက်ပံ့မှု Taira ဖောက်သည်မှ [ချိတ်ဆက် Taira](./connect-to-taira.md).
- `IROHA_CONFIG` နှင့် `IROHA_PRIVATE_KEY_FILE` တို့တွင် Absolute paths များဖြစ်သည်။ key file သည်ပိုင်ရှင်ထိန်းသိမ်းထားသော, single-link ပုံမှန်ဖိုင်တစ်ခုဖြစ်ရမည်ဖြစ်ပြီး mode `0600` ရှိရမည်။ deploy helper ကရည်ရွယ်ချက်ရှိပြီး inline private key argument ကိုမပါရှိပါ။
- Taira operator approval. Contract code registration requires `CanRegisterSmartContractCode`, and protected deployments may require governance attribution and enactment. Taira သည်ဤဝင်ရောက်ခွင့်ကိုမပေးပါက, ၎င်း၏ဗီဇက ခွင့်ပြုချက်ပေးသည့် ထုတ်လုပ်သော ဒေသတွင်းကွန်ရက်တစ်ခုတွင် deployment လုပ်ပါ။

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

## ခြေလှမ်း {#steps}

### (၁) သိထားသောကောင်းမွန်သော Kotodama V1 စာချုပ်ကို ကူးယူခြင်း {#_1-copy-a-known-good-kotodama-v1-contract}

ပိတ်ထားတဲ့ Iroha checkout ထဲမှာ အလုပ်လုပ်ပြီး compiler ရဲ့ tuple-return နမူနာကို copy လုပ်ပါ၊ source နဲ့ toolchain တွေက အတူတူ commit ဖြစ်နေစေဖို့ပါ။

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

အရင်းအမြစ်တစ်ခုလုံးက သေးငယ်ပြီး လက်ရှိ `seiyaku`/`kotoage` ဝါကျကို အသုံးပြုပါတယ်။

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

Kotodama ရည်မှန်းချက်များ Iroha Virtual Machine နှင့် ၎င်း၏ လက်ရှိ ABI. အဲဒါဟာ WASM ဒါမှမဟုတ် EVM အရင်းအမြစ်ဘာသာစကား။

### (၂) လက်ရာပစ္စည်းကို စစ်ဆေး၊ ဆောက်လုပ်ပြီး စစ်ဆေးခြင်း {#_2-check-build-and-verify-the-artifact}

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

ပထမ build သည် artefact နှင့် authenticated sidecars ကိုထုတ်ဝေသည်။ ဒုတိယသည် read-only `--verify` mode တွင်အလုပ်လုပ်ပြီးရှိဆဲထွက်ပေါက်တစ်ခုခုသည်လက်ရှိအရင်းအမြစ်နှင့်အတိအကျမညီပါက ကျရှုံးသည်။ `.to` ဖိုင်နှင့် ၎င်း၏ manifesto ကိုပြန်လည်စစ်ဆေးသော build output တစ်ခုအဖြစ်ပြုပြင်ပါ။

### (၃) ဘိုင်တာကုဒ်ကို ဒေသတွင်းမှာ Run လုပ်ပါ။ {#_3-run-the-bytecode-locally}

`compute` သည် အများပြည်သူ `kotoage` ဝင်ပေါက်မှတ်ဖြစ်သည်။ `debug-call` ဖြင့် လည်ပတ်ပါ၊ ငွေပေးချေမှုကို မတင်သွင်းခြင်း သို့မဟုတ် ပေးဆပ်ခြင်းမရှိဘဲ ဒေသတွင်း fixtures များနှင့်ပက်သက်၍ လုပ်ဆောင်သည်။

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama integers တွေကို JSON string တွေအဖြစ် render လုပ်ထားလို့ decoded tuple က `["3", "5"]` ဖြစ်တယ်။

### (၄) တိုင်းရင်းသား အကူအညီပေးသူမှတဆင့် ဖြန့်ချိခြင်း {#_4-deploy-through-the-native-helper}

အကူအညီပေးသူက bytecode chunks များကို upload လုပ်ပြီး လက်မှတ်ရေးထိုးထားသော manifest ကို မှတ်ပုံတင်ကာ `CommitContractDeployment` လုပ်ဆောင်ချက်တစ်ခု တင်သွင်းသည်။ ၎င်းသည် ငွေလွှဲပြောင်းမှုတိုင်းအား fee-quotes ပြုလုပ်ပြီး ရွေးချယ်ထားတဲ့ ပေးသွင်းသူ သို့မဟုတ် ဓာတ်ငွေ့ဘောင်ကို ပြောင်းလဲစေတဲ့ quote ကို ငြင်းပယ်တယ်။

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

empty `charge_limits` request သည် coped asset identifier မဟုတ်ပေ။ အကူအညီပေးသူသည် လက်မှတ်မထိုးမီတွင် တိကျသော live quote ကိုလက်ခံသည်။ ပြန်လာသော charge asset နှင့် လက်ရှိ faucet တုံ့ပြန်မှု။ စာချုပ်ခေါ်ဆိုမှုက ရိုက်နှိပ်ထားတဲ့ live quote မှတစ်ဆင့်သာ အခွန်ရွေးချယ်မှုကိုလက်ခံတယ်။ `gas_asset_id` ငွေလဲလှယ်မှု metadata ဟာ ပထမဆုံးထုတ်ဝေစာချုပ်ရဲ့ အစိတ်အပိုင်းမဟုတ်ဘူး။

### (၅) စေလွှတ်ထားသောဝင်ပေါက်ကို တုပပြီးခေါ်ယူပါ။ {#_5-simulate-and-call-the-deployed-entrypoint}

Simulation သည် Torii တွင် အများပြည်သူဝင်ရောက်မှုမှတ်တိုင်ကို တင်သွင်းခြင်းမရှိဘဲ လုပ်ဆောင်သည်။ အောက်ပါခေါ်ဆိုမှုက ငွေပေးချေမှုတစ်ခုဖြစ်ပြီး ထို့ကြောင့် အာဏာပိုင်ခ ပေးဆောင်သူကို တိကျစွာရွေးချယ်သည်။ အမိန့်နှစ်ခုစလုံးသည် ဓာတ်ငွေ့အကန့်အသတ် 1,500,000 ကို ချုပ်နှောင်သည်။

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

## စစ်ဆေးပါ {#verify}

alias ကိုဖြေရှင်းပါ၊ ပြန်လာသော code hash ဖြင့် on-chain manifest ကိုယူပြီး Canonical address မှတစ်ဆင့်တူညီတဲ့ အများပြည်သူဝင်ရောက်မှုမှတ်ကို simulate လုပ်ပါ။

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

Deployment သည် ပြန်လည်ပို့သောလိပ်စာသို့ alias ကိုဖြေရှင်းတဲ့အခါသာ ပြီးပြည့်စုံသွားသည်၊ manifest ကို Code hash, Local နှင့် Torii Simulation Return `["3", "5"]` အောက်တွင် ဖတ်နိုင်ပြီး ပေးပို့ထားသည့်ခေါ်ဆိုမှုသည် `Applied` သို့ရောက်ရှိသည်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `CanRegisterSmartContractCode` ကျရှုံးမှုအတွက် Taira operator grant သို့မဟုတ် localnet တွင် genesis/bootstrap ကိုပြောင်းလဲရန်လိုအပ်သည်။ သာမန်အကောင့်တစ်ခုသည် ဤခွင့်ပြုချက်ကို အမှန်တရားနောက်တွင် မိမိဘာသာမပေးနိုင်ပါ။
- စီမံခန့်ခွဲမှု (သို့မဟုတ် Protected-lane rejection) ဆိုသည်မှာ ဖြန့်ချိမှုအတွက် ကွန်ရက်က တောင်းဆိုသည့် အတိအကျ ခွင့်ပြုချက် သတ်မှတ်ချက် လိုအပ်ခြင်းဖြစ်သည်။ ခွင့်ပြုသူစာရင်းကို ညှိနှိုင်းပါ။ အကောင့် IDs ကို မဖန်တီးပါ။
- manifest (သို့) ABI ကွဲပြားမှုဆိုသည်မှာ bytecode, manifest နှင့် node runtime တို့က တူညီသော artefact ကိုဖော်ပြခြင်းမဟုတ်ပါ။ `--verify` ဖြင့် pinned commit တွင်ပြန်လည်တည်ဆောက်ပါ။
- `fee quote changed ... gas bound` ဆိုသည်မှာ requested typed intent နှင့် live quote ကွဲပြားမှုပါ။ လက်မှတ်ရေးထိုးထားသော ငွေပေးချေမှုကို ပြင်ဆင်ခြင်းထက် ပြန်လည် ကြိုတင်ပြင်ဆင်ပါ။
- deploy helper သည် inline key များ၊ ခွင့်ပြုချက်ရှိသော key-file mode များ၊ symlinks များနှင့်ဆက်စပ်သော file များကို network တင်မပေးမီမှာ ပယ်ချသည်။
- View Only Entry Point Error ဆိုသည်မှာ `compute` ကို မှားယွင်းသော Command Family မှတစ်ဆင့် လမ်းညွှန်ပေးခဲ့ခြင်းဖြစ်သည်။ ဤနမူနာတွင် `kotoage` ကို ကြေညာထားသည်၊ ထို့ကြောင့် Call Simulation သို့မဟုတ် Submission ကို အသုံးပြုပါ။
- စာချုပ်ခေါ်ဆိုမှုတွေမှာ အပြုသဘော ရိုက်နှိပ်ထားတဲ့ ဓာတ်ငွေ့ ကန့်သတ်ချက်တစ်ခု လိုအပ်ပါတယ်။ ပထမဆုံးထုတ်ပြန်တဲ့ ဖုန်းခေါ်ဆိုမှုစာချုပ်မှာ ထိပ်တန်းအဆင့် ဓာတ်ငွေ့ (သို့) ကုန်ကျစရိတ်အရင်းအမြစ် metadata ကို ပယ်ချတယ်။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [Kotodama V1 command implementation at the pinned commit ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [ချိတ်ဆက်ထားသော commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko) တွင် tuple-return source sample ကို
- [ချိတ်ဆက်ထားသော commit တွင် Native deployment assistant ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [စာချုပ်ပေါင်းစပ်မှု စမ်းသပ်ချက်များ ချိတ်ဆက်ထားသော commit ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [ဉာဏ်ရည်မြင့် စာချုပ်များ](/my/blockchain/smart-contracts.md)
- [CLI ကိုးကားချက်](/my/get-started/operate-iroha-via-cli.md)
