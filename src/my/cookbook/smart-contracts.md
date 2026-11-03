---
translation_locale: my
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# စမတ်ကျတဲ့ စာချုပ်တစ်ခု တည်ဆောက်ပြီး အသုံးချပါ။ {#build-and-deploy-a-smart-contract}

## ရလဒ် {#outcome}

Kotodama V1 စာချုပ်တစ်ခုကို စစ်ဆေးပြီး compile လုပ်ကာ ၎င်း၏ အများသုံး view ကို ဒေသတွင်း၌ လုပ်ဆောင်ပါ၊ စစ်ဆေးအတည်ပြုထားသော IVM artifact ကို authority က ပေးဆောင်သည့် အခွန်ကို ရှင်းလင်းစွာ ရွေးချယ်၍ ဖြန့်ချိပါ၊ ထို့နောက် ဖြန့်ချိထားသော view ကို Torii မှတစ်ဆင့် ဖတ်ပါ။

## လိုအပ်ချက်များ {#prerequisites}

- Iroha အရင်းအမြစ်ကုဒ်အလုပ်လုပ်စာရွက်စာတမ်းကို protocol finalisation `c8c872461e92f04325c350cdd952f4276e96f9dc`, Rust နှင့် Cargo တွင်။
- လက်ရှိ `iroha` CLI နှင့် `musubi` (checkout ထဲတွင် `cargo run -p musubi --` အဖြစ် လုပ်ဆောင်သည်) အပြင် [Taira သို့ ချိတ်ဆက်ပါ](./connect-to-taira.md) မှ ငွေထည့်ထားသော Taira client တစ်ခု။
- `IROHA_CONFIG` တွင် absolute path တစ်ခု။ Musubi ၏ network binding သည် ဤ client ဖိုင်ကို ရည်ညွှန်းချက်အဖြစ် သိမ်းဆည်းပြီး ၎င်း၏ အကောင့်သော့ဖြင့် ဖြန့်ချိမှုကို လက်မှတ်ထိုးသည်။
- alias ဆိုင်ရာ ခွင့်အာဏာ။ executor သည် တိကျသော contract alias သို့မဟုတ် ၎င်း၏ မိခင် scope အတွက် `CanManageAccountAlias` ကို လိုအပ်သည်- `name::domain.dataspace` အတွက် ပိုင်ရှင်ဒိုမင်၊ သို့မဟုတ် `name::dataspace` အတွက် ဒေတာနေရာ။ မှတ်ပုံတင်ထားသော အကောင့်များသည် သီးခြား ကုဒ်မှတ်ပုံတင်ခွင့်ပြုချက် မလိုအပ်ဘဲ ကာကွယ်ထားသော namespace များသည် ကွန်ရက်၏ governance လုပ်ငန်းစဉ်ကိုလည်း လိုအပ်သည်။ ဥပမာများသည် `cookbook_tuple::universal` ကို အသုံးပြုသည်။ Taira တွင် ၎င်းကို သင်ပိုင်ဆိုင်သော ဒိုမင်ရှိ alias တစ်ခုဖြင့် အစားထိုးပါ၊ သို့မဟုတ် genesis က alias scope ကို ခွင့်ပြုချက်ပေးအပ်ထားသော ဖန်တီးထားသည့် ဒေသတွင်းကွန်ရက်တစ်ခုပေါ်တွင် ဖြန့်ချိပါ။

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## ခြေလှမ်း {#steps}

### (၁) သိထားသောကောင်းမွန်သော Kotodama V1 စာချုပ်ကို ကူးယူခြင်း {#_1-copy-a-known-good-kotodama-v1-contract}

ပိတ်ထားတဲ့ Iroha checkout ထဲမှာ အလုပ်လုပ်ပြီး compiler ရဲ့ tuple-return နမူနာကို copy လုပ်ပါ၊ source နဲ့ toolchain တွေဟာ တူညီတဲ့ protocol finalisation မှာ ရှိနေအောင်ပါ။

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

source အပြည့်အစုံသည် သေးငယ်သည်- private helper `fn` တစ်ခုနှင့် ခေါ်ဆိုသူတိုင်းကို ရှင်းလင်းစွာ ခွင့်ပြုသော အများသုံး read-only `view fn` တစ်ခု:

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

Kotodama ရည်မှန်းချက်များ Iroha Virtual Machine နှင့် ၎င်း၏ လက်ရှိ ABI. အဲဒါဟာ WASM ဒါမှမဟုတ် EVM အရင်းအမြစ်ဘာသာစကား။

### (၂) လက်ရာပစ္စည်းကို စစ်ဆေး၊ ဆောက်လုပ်ပြီး စစ်ဆေးခြင်း {#_2-check-build-and-verify-the-artifact}

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

ပထမ build သည် artefact နှင့် authenticated sidecars ကိုထုတ်ဝေသည်။ ဒုတိယသည် read-only `--verify` mode တွင်အလုပ်လုပ်ပြီးရှိဆဲထွက်ပေါက်တစ်ခုခုကလက်ရှိအရင်းအမြစ်နှင့်အတိအကျမညီပါက ကျရှုံးသည်။ `.to` ဖိုင်နှင့် ၎င်း၏နည်းပညာ manifest ကိုပြန်လည်သုံးသပ်ထားသော build output တစ်ခုအဖြစ်ပြုပြင်ပါ။

### (၃) ဘိုင်တာကုဒ်ကို ဒေသတွင်းမှာ Run လုပ်ပါ။ {#_3-run-the-bytecode-locally}

`compute` သည် အများသုံး read-only `view fn` ဖြစ်သည်။ ၎င်းကို `debug-view` ဖြင့် လုပ်ဆောင်ပါ။ ၎င်းသည် compile လုပ်ထားသော bytecode ကို ရွေးချယ်နိုင်သော စမ်းသပ်ဒေတာများနှင့် ဒေသတွင်း၌ လုပ်ဆောင်ပြီး transaction ကို တင်သွင်းခြင်း သို့မဟုတ် ပေးချေခြင်း မပြုပါ။

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama integers တွေကို JSON string တွေအဖြစ် render လုပ်ထားလို့ decoded tuple က `["3", "5"]` ဖြစ်တယ်။

### (၄) စစ်ဆေးအတည်ပြုထားသော artifact ကို Musubi ဖြင့် ဖြန့်ချိပါ {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` သည် စာချုပ်များကို စစ်ဆေးခြင်း၊ view လုပ်ခြင်းနှင့် debug လုပ်ခြင်းတို့ ပြုလုပ်သော်လည်း ၎င်းတို့ကို ဖြန့်ချိခြင်း မပြုသောကြောင့် Taira ဖြန့်ချိမှုများကို Musubi မှတစ်ဆင့် လုပ်ဆောင်သည်။ ၎င်း၏ ဖြန့်ချိရေးဝန်ဆောင်မှုသည် bytecode အပိုင်းများကို upload လုပ်ပြီး စစ်ဆေးအတည်ပြုထားသော manifest ကို မှတ်ပုံတင်ကာ `CommitContractDeployment` လုပ်ဆောင်ချက်တစ်ခုကို တင်သွင်းသည်။ ၎င်းသည် transaction တိုင်းအတွက် အခွန်ကို ခန့်မှန်းတွက်ချက်ပြီး ရွေးချယ်ထားသော ပေးဆောင်သူ၊ sponsor revision သို့မဟုတ် gas ကန့်သတ်ချက်ကို ပြောင်းလဲစေသည့် ခန့်မှန်းချက်ကို ငြင်းပယ်ကာ lock လုပ်ထားသော package တည်ဆောက်မှုက ၎င်း၏ ကုဒ်နှင့် ABI hash များကို ပြန်လည်ထုတ်လုပ်ပြီးမှသာ ကြိုတင်တည်ဆောက်ထားသော artifact ကို ဖြန့်ချိသည်။ Kagami စီမံခန့်ခွဲသော ဒေသတွင်းကွန်ရက်တစ်ခုတွင်မူ `kagami contract deploy` သည် `./build/tuple_return_demo.to` ကို `--alias cookbook_tuple::universal --json` ဖြင့် ဖြန့်ချိသည်။ ၎င်း၏ receipt သည် `.receipt` အောက်တွင် ရှိပြီး `kagami context show` သည် `IROHA_CONFIG` အဖြစ် အသုံးပြုရမည့် client ပြင်ဆင်သတ်မှတ်ချက်ကို ထုတ်ပြသည်။

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

binding သည် `--fee-payer authority` ကို အသုံးပြုပြီး Musubi သည် လက်မှတ်မထိုးမီ Taira ၏ အခွန်အရင်းအမြစ်ဖြင့် တိကျသော အခွန်ကို ခန့်မှန်းတွက်ချက်ပြသသည်။ ပြန်လာသော charge asset ကို လက်ရှိ faucet မူဝါဒက ထုတ်ပြန်ထားသည့် asset နှင့် နှိုင်းယှဉ်ပါ။ စာချုပ်ခေါ်ဆိုမှုများသည် type သတ်မှတ်ထားသော live အခွန်စျေးနှုန်းခန့်မှန်းချက်မှတစ်ဆင့်သာ အခွန်ရွေးချယ်မှုကို လက်ခံသည်။ `gas_asset_id` transaction metadata သည် ပထမထုတ်ဝေမှု၏ စာချုပ်သတ်မှတ်ချက်တွင် မပါဝင်ပါ။

### (၅) ဖြန့်ချိထားသော view ကို ဖတ်ပါ {#_5-read-the-deployed-view}

`contract view` သည် ဖတ်ရန်သာဖြစ်သော entrypoint ကို transaction သို့မဟုတ် အခွန်မပါဘဲ Torii ပေါ်တွင် လုပ်ဆောင်သည်။ view တွင် transaction ပုံစံ မရှိပါ- Torii သည် ၎င်း၏ call route များပေါ်ရှိ view selector ကို ငြင်းပယ်သည်။

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## စစ်ဆေးပါ {#verify}

alias ကို ဖြေရှင်းပါ၊ ဖြန့်ချိထားသော view အတွက် Torii က ဖော်ပြသော ကုဒ် hash ဖြင့် on-chain manifest ကို ရယူပါ၊ ထို့နောက် တူညီသော view ကို canonical လိပ်စာဖြင့် လုပ်ဆောင်ပါ:

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

ဖြန့်ချိမှု receipt က သိမ်းဆည်းထားသော artifact ကို စစ်ဆေးအတည်ပြုပြီးဖြစ်ကြောင်း ဖော်ပြခြင်း၊ alias သည် ပြန်ပေးသော လိပ်စာသို့ ဖြေရှင်းခြင်း၊ manifest ကို တူညီသော ကုဒ် hash အောက်တွင် ဖတ်ရှုနိုင်ခြင်းနှင့် ဒေသတွင်း view နှင့် Torii view တို့က `["3", "5"]` ကို ပြန်ပေးခြင်းတို့ ဖြစ်မှသာ ဖြန့်ချိမှု ပြီးပြည့်စုံသည်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias` သို့မဟုတ် executor ၏ `authority is not permitted to manage contract alias` ဆိုသည်မှာ အကောင့်သည် ထို alias ကို bind လုပ်ခွင့်မရှိကြောင်း ဆိုလိုသည်။ သင်ပိုင်ဆိုင်သော ဒိုမင်ရှိ alias တစ်ခုကို အသုံးပြုပါ၊ သို့မဟုတ် ထို scope ၏ ပိုင်ရှင်ထံမှ တိကျသော alias ခွင့်ပြုချက်ပေးအပ်မှု သို့မဟုတ် ၎င်း၏ ဒိုမင် သို့မဟုတ် ဒေတာနေရာ ခွင့်ပြုချက်ပေးအပ်မှုကို ရယူပါ။ localnet တွင် ၎င်းကို genesis ၌ ခွင့်ပြုချက်ပေးအပ်ပါ။
- ကာကွယ်ထားသော namespace ငြင်းပယ်မှုဆိုသည်မှာ alias namespace ကို governance ဖြင့် ထိန်းချုပ်ထားကြောင်း ဆိုလိုသည်။ အတည်ပြုသူ အကောင့် ID များကို စာရင်းပြုစုခြင်းသည် အတည်ပြုချက် အထောက်အထား မဟုတ်ပါ။ ထို namespace အတွက် ကွန်ရက်၏ governance လုပ်ငန်းစဉ် (`iroha app gov deploy propose`) ကို အသုံးပြုပါ၊ သို့မဟုတ် ၎င်း၏ ပြင်ပရှိ alias တစ်ခုကို ရွေးချယ်ပါ။
- manifest သို့မဟုတ် ABI မကိုက်ညီမှုဆိုသည်မှာ bytecode၊ manifest နှင့် node ၏ runtime တို့သည် တူညီသော artifact ကို ဖော်ပြခြင်း မရှိကြောင်း ဆိုလိုသည်။ ပုံသေသတ်မှတ်ထားသော commit တွင် ပြန်လည်တည်ဆောက်ပြီးနောက် `--verify` ဖြင့် တည်ဆောက်မှုကို ပြန်လည်လုပ်ဆောင်ပါ။
- `fee quote changed ... gas bound` ဆိုသည်မှာ requested typed intent နှင့် live quote ကွဲပြားမှုပါ။ လက်မှတ်ရေးထိုးထားသော ငွေပေးချေမှုကို ပြင်ဆင်ခြင်းထက် ပြန်လည် ကြိုတင်ပြင်ဆင်ပါ။
- ကြားဖြတ်ရပ်တန့်သွားသော ဖြန့်ချိမှုသည် ၎င်း၏ လက်မှတ်ထိုးထားသော အစီအစဉ်ကို journal တစ်ခုတွင် သိမ်းဆည်းထားသည်။ အစီအစဉ်အသစ်ကို လက်မှတ်ထိုးမည့်အစား ၎င်းကို `musubi deploy --resume <JOURNAL>` ဖြင့် ပြန်လည်ရယူပါ။
- `is read-only and cannot be invoked as a transaction` သို့မဟုတ် `is not a kotoage or lifecycle entrypoint` ဆိုသည်မှာ `compute` ကို call command သို့ ပေးပို့ခဲ့ကြောင်း ဆိုလိုသည်။ ဤနမူနာသည် `view fn` ကို ကြေညာထားသောကြောင့် ဒေသတွင်း၌ `debug-view` ကိုလည်းကောင်း၊ Torii ပေါ်တွင် `view` ကိုလည်းကောင်း အသုံးပြုပါ။
- Contract invocations တွေအတွက် positive typeed transaction execution cost limit လိုပါတယ်။ ပထမဆုံးထုတ်ပြန်တဲ့ technical invocation contract မှာ ထိပ်ဆုံးအဆင့် transaction executions cost (သို့) fee-asset metadata တွေကို ပယ်ချတယ်။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ပုံသေသတ်မှတ်ထားသော commit ရှိ Kotodama V1 command အကောင်အထည်ဖော်မှု](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [ရင်းမြစ်ကုဒ် ပြင်ဆင်ချက်တွင် ပြန်လည်ဖြည့်ဆည်းမှု မူရင်းနမူနာကို](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- ပုံသေသတ်မှတ်ထားသော commit ရှိ [Musubi ၏ deploy command](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) နှင့် [native စာချုပ်ဖြန့်ချိရေး ဝန်ဆောင်မှု](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs)
- [ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်ချက်မှာ စာချုပ်ပေါင်းစပ်မှု စမ်းသပ်မှုတွေ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [စမတ်စာချုပ်များ](/my/blockchain/smart-contracts.md)
- [CLI ကိုးကားချက်](/my/get-started/operate-iroha-via-cli.md)
