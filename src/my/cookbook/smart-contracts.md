---
translation_locale: my
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# စမတ်ကျတဲ့ စာချုပ်တစ်ခု တည်ဆောက်ပြီး အသုံးချပါ။ {#build-and-deploy-a-smart-contract}

## ရလဒ် {#outcome}

Kotodama V1 စာချုပ်ကို စစ်ဆေးပြီး စုစည်းခြင်း၊ ၎င်း၏ အများပြည်သူဝင်ရောက်မှုမှတ်တိုင်ကို ဒေသတွင်းတွင် အကောင်အထည်ဖော်ခြင်း၊ စစ်ဆေးထားသော IVM လက်ရာပစ္စည်းကို ဖြန့်ချိခြင်း၊ ဖြန့်ဖြူးထားသည့်ဝင်ရောက်မှု မှတ်တိုင်ကို တုပခြင်းနှင့် ငွေပေးချေမှုကို လက်မှတ်ထိုးသည့်စာရင်းမှ ပေးဆပ်သည့် အခွန်စျေးနှုန်း ခန့်မှန်းချက်တစ်ခုဖြင့် ရှင်းလင်းစွာတင်ပြခြင်း။

## လိုအပ်ချက်များ {#prerequisites}

- Iroha အရင်းအမြစ်ကုဒ်အလုပ်လုပ်စာရွက်စာတမ်းကို protocol finalisation `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust နှင့် Cargo တွင်။
- လက်ရှိ `iroha` CLI နှင့် Taira မှ ရင်းနှီးမြှုပ်နှံထားသော ဖောက်သည် [Taira သို့ ချိတ်ဆက်ပါ။](./connect-to-taira.md) ကို ပေါင်းစပ်ပါ။
- `IROHA_CONFIG` နှင့် `IROHA_PRIVATE_KEY_FILE` တို့တွင် Absolute paths များဖြစ်သည်။ key file သည်ပိုင်ရှင်ထိန်းသိမ်းထားသော, single-link ပုံမှန်ဖိုင်တစ်ခုဖြစ်ရမည်ဖြစ်ပြီး mode `0600` ရှိရမည်။ deploy helper ကရည်ရွယ်ချက်ရှိပြီး inline private key argument ကိုမပါရှိပါ။
- Taira operator approval. Contract code registration requires `CanRegisterSmartContractCode`, and protected deployments may require governance attribution and enactment. Taira က ဒီအခွင့်အလမ်းကိုမပေးခဲ့ဘူးဆိုရင်, blockchain genesis က ခွင့်ပြုချက် ပေးတဲ့ ဖန်တီးထားတဲ့ ဒေသတွင်းကွန်ရက်တစ်ခုမှာ deployment လုပ်ပါ။

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

ပိတ်ထားတဲ့ Iroha checkout ထဲမှာ အလုပ်လုပ်ပြီး compiler ရဲ့ tuple-return နမူနာကို copy လုပ်ပါ၊ source နဲ့ toolchain တွေဟာ တူညီတဲ့ protocol finalisation မှာ ရှိနေအောင်ပါ။

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

ပထမ build သည် artefact နှင့် authenticated sidecars ကိုထုတ်ဝေသည်။ ဒုတိယသည် read-only `--verify` mode တွင်အလုပ်လုပ်ပြီးရှိဆဲထွက်ပေါက်တစ်ခုခုကလက်ရှိအရင်းအမြစ်နှင့်အတိအကျမညီပါက ကျရှုံးသည်။ `.to` ဖိုင်နှင့် ၎င်း၏နည်းပညာ manifest ကိုပြန်လည်သုံးသပ်ထားသော build output တစ်ခုအဖြစ်ပြုပြင်ပါ။

### (၃) ဘိုင်တာကုဒ်ကို ဒေသတွင်းမှာ Run လုပ်ပါ။ {#_3-run-the-bytecode-locally}

`compute` သည် အများပိုင် `kotoage` ဝင်ပေါက်မှတ်ဖြစ်သည်။ `debug-call` ကိုသုံးပြီး လည်ပတ်ပါ၊ ၎င်းသည် ငွေပေးချေမှုကို မတင်သွင်းခြင်း သို့မဟုတ် ပေးဆပ်ခြင်းမရှိဘဲ ဒေသတွင်း စမ်းသပ်မှုလက်ရာများအား လုပ်ဆောင်သည်။

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

အကူအညီပေးသူက bytecode chunks ကို upload လုပ်ပြီး လက်မှတ်ရေးထိုးထားတဲ့ Technical Manifesto ကို မှတ်ပုံတင်ကာ `CommitContractDeployment` လုပ်ဆောင်ချက် တစ်ခုကို တင်သွင်းတယ်။ ငွေကြေးချေမှုတစ်ခုစီကို အခွန် quote ပေးပြီး ရွေးချယ်ထားသော ပေးသွင်းသူ (သို့) ငွေကြေးဆောင်ရွက်မှု ကုန်ကျစရိတ်ဘောင်ကို ပြောင်းလဲစေတဲ့ quote ကို ငြင်းပယ်ပါတယ်။

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

အလွတ် `charge_limits` အကူအညီတောင်းဆိုမှုသည် ကူးယူထားသော အရင်းအမြစ်အမှတ်တံဆိပ်မဟုတ်ပါ။ လက်မှတ်မထိုးမီ အကူအညီပေးသူက တိကျတဲ့ တိုက်ရိုက် quote ကိုလက်ခံသည်။ ပြန်လာသော အခွန်လက်ဝယ်ကို လက်ရှိ testnet ငွေကြေးထောက်ပံ့မှု ဝန်ဆောင်မှု တုံ့ပြန်မှုနဲ့ နှိုင်းယှဉ်ပါ။ စာချုပ်ဖောက်သည်များတွင် တင်သွင်းထားသော တိုက်ရိုက် quote ဖြင့်သာ အခွန်ရွေးချယ်မှုကို လက်ခံကြသည်။ `gas_asset_id` Transaction metadata တွေဟာ ပထမအကြိမ် ထုတ်လွှင့်တဲ့ စာချုပ်ရဲ့ အစိတ်အပိုင်းမဟုတ်ဘူး။

### (၅) တပ်ဆင်ထားသော ဝင်ရောက်မှတ်တိုင်ကို တုပပြီး ခေါ်ယူခြင်း {#_5-simulate-and-call-the-deployed-entrypoint}

Simulation သည် Torii တွင် အများပြည်သူဝင်ရောက်မှုမှတ်တိုင်ကို တင်သွင်းခြင်းမရှိဘဲ လုပ်ဆောင်သည်။ အောက်ပါနည်းပညာခေါ်ဆိုချက်သည် ငွေပေးချေမှုတစ်ခုဖြစ်ပြီး ထို့ကြောင့် ခွင့်ပြုချက် မူလခ ပေးဆောင်သူကို တိတိကျကျရွေးချယ်သည်။ အမိန့်နှစ်ခုစလုံးက ငွေပေးချေးမှု အကုန်အကျ ၁,၅၀၀,၀၀၀ ကိုသတ်မှတ်ထားသည်။

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

alias ကိုဖြေရှင်း၊ ပြန်လာသော code cryptographic hash ဖြင့် on-chain technical manifest ကိုယူပြီး single protocol standard address မှတစ်ဆင့်တူညီသော အများပြည်သူဝင်ရောက်မှတ်ကို simulate လုပ်ပါ။

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

Deployment သည် ပြန်လည်ပို့သောလိပ်စာသို့အမည်မဖော်လိုသည့်အခါသာ ပြီးပြည့်စုံသည်၊ Technical Manifesto ကို cryptographic hash, local နှင့် Torii simulation return `["3", "5"]` အောက်တွင်ဖတ်နိုင်ပြီး တင်သွင်းထားသော technical invocation သည် `Applied` သို့ရောက်ရှိသည်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `CanRegisterSmartContractCode` ကျရှုံးမှုအတွက် Taira operator grant သို့မဟုတ် localnet တွင် genesis/bootstrap ကိုပြောင်းလဲရန်လိုအပ်သည်။ သာမန်အကောင့်တစ်ခုသည်ဤခွင့်ပြုချက်ကိုဖြစ်ရပ်ပြီးနောက်မှာ ကိုယ်တိုင်မပေးနိုင်ပါ။
- Governance (သို့) Protected-lane rejection ဆိုသည်မှာ ဖြန့်ချိမှုအတွက် ကွန်ရက်က တောင်းဆိုသည့် အတိအကျ ခွင့်ပြုချက် သတ်မှတ်ချက် လိုအပ်ခြင်းဖြစ်သည်။ ခွင့်ပြုသူစာရင်းကို ညှိနှိုင်းပါ၊ အကောင့် ID ကို မဖန်တီးပါ။
- Technical manifest (သို့) ABI မလိုက်ဖက်မှုဆိုသည်မှာ bytecode၊ technical manifest နှင့် node software အကောင်အထည်ဖော်ရေးပတ်ဝန်းကျင်သည်တူညီသောပစ္စည်းကိုဖော်ပြခြင်းမဟုတ်ပါ။ `--verify` ဖြင့်ပိတ်ထားသော source-code revision တွင်ပြန်လည်တည်ဆောက်ပါ။
- `fee quote changed ... gas bound` ဆိုသည်မှာ requested typed intent နှင့် live quote ကွဲပြားမှုပါ။ လက်မှတ်ရေးထိုးထားသော ငွေပေးချေမှုကို ပြင်ဆင်ခြင်းထက် ပြန်လည် ကြိုတင်ပြင်ဆင်ပါ။
- deploy helper သည် inline key များ၊ ခွင့်ပြုချက်ရှိသော key-file mode များ၊ symlinks များနှင့်ဆက်စပ်သော file များကို network တင်မပေးမီမှာ ပယ်ချသည်။
- View Point Entry Point အမှားတစ်ခုဆိုတာက `compute` ကို မှားယွင်းတဲ့ Command Family ကနေ Routed လုပ်ထားတာပါ။ ဒီနမူနာမှာ `kotoage` ကို ကြေညာထားတယ်၊ ဒီတော့ နည်းပညာ invocation simulation (သို့) submission ကို အသုံးပြုပါ။
- Contract invocations တွေအတွက် positive typeed transaction execution cost limit လိုပါတယ်။ ပထမဆုံးထုတ်ပြန်တဲ့ technical invocation contract မှာ ထိပ်ဆုံးအဆင့် transaction executions cost (သို့) fee-asset metadata တွေကို ပယ်ချတယ်။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [Kotodama V1 command implementation at the pinned source code revision (ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှု)](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [ရင်းမြစ်ကုဒ် ပြင်ဆင်ချက်တွင် ပြန်လည်ဖြည့်ဆည်းမှု မူရင်းနမူနာကို](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [ပိတ်ထားတဲ့ source code ကို ပြန်လည်ပြင်ဆင်ခြင်းမှာ native deployment assistant](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်ချက်မှာ စာချုပ်ပေါင်းစပ်မှု စမ်းသပ်မှုတွေ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [စမတ်စာချုပ်များ](/my/blockchain/smart-contracts.md)
- [CLI ကိုးကားချက်](/my/get-started/operate-iroha-via-cli.md)
