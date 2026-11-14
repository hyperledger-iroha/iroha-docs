---
translation_locale: my
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 40714a6cd124d4b0342b0f6ecf321f286e714c0e236afd6fd7834c0cf0ad1165
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# လည်ပတ်မှု Iroha 3 မှတဆင့် CLI {#operate-iroha-3-via-cli}

`iroha` binary သည် Iroha 3 အတွက် command-line client ဖြစ်သည်။ လယ်ဂျာ အခြေအနေကို ရှာဖွေဖတ်ရှုရန်၊ transaction များ တင်သွင်းရန်နှင့် အော်ပရေတာ endpoint များ စစ်ဆေးရန် သုံးပါ။

## (၁) ကြိုတင်လိုအပ်ချက်များ {#_1-prerequisites}

ဖော်ပြထားသော ရင်းမြစ်ကုဒ် revision ရှိ Iroha checkout မှ peer လေးခုပါသော localnet ကို ဖန်တီးပြီး စတင်ပါ:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
./localnet/start.sh
```

အောက်ပါ ဥပမာများသည် ၎င်းမှ ထုတ်ပေးထားသော client ပြင်ဆင်သတ်မှတ်မှုဖြစ်သည့် `./localnet/client.toml` ကို အသုံးပြုသည်။

## (၂) အခြေခံ CLI Setup {#_2-basic-cli-setup}

အဆင့်မြင့် အကူအညီကို ပြပေးပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI ကို အောက်ပါ အဆင့်မြင့် အမိန့်အုပ်စုများအဖြစ် စုစည်းထားသည်-

- အကောင့် ဖတ်ရှုမှုနှင့် ပြောင်းလဲမှုများအတွက် `account`
- မျှဝေထားသော စစ်ထုတ်မှုနှင့် စာမျက်နှာခွဲမှုပါ explorer ဒေတာစီးကြောင်းများအတွက် `explorer`
- transaction အခြေအနေနှင့် အကူလုပ်ဆောင်ချက်များအတွက် `tx`
- `ledger` အတွက် blockchain ledger ကိုဖတ်ပြီးရေးသား
- trigger ဖတ်ရှုမှု၊ ရေးသားမှုနှင့် လုပ်ဆောင်မှုအတွက် `trigger`
- `ops` လုပ်ငန်းရှင်များအတွက် ရောဂါစစ်ဆေးခြင်း
- `app` app API အကူအညီများအတွက်
- စာချုပ်ခေါ်ယူမှု၊ ဖတ်ရှုမြင်ကွင်းနှင့် ဒေသတွင်း အမှားရှာမှုအတွက် `contract`၊ ဖြန့်ချိတပ်ဆင်ရန် `kagami contract deploy` သို့မဟုတ် `musubi deploy` ကို သုံးပါ
- `tools` ရောဂါစစ်ဆေးရေးနှင့် ဖွံ့ဖြိုးရေး လုပ်ငန်းများအတွက်
- data space သတ်မှတ်ချက်ကို စီစဉ်၊ အသုံးချ၊ စစ်ဆေးရန် `dataspace`
- Taira စစ်ဆေးရေးနှင့် အကောင့်စတင်ပြင်ဆင်မှုအတွက် `taira`
- အော့ဖ်လိုင်း ကုဒ်သွင်းကိရိယာများ၊ အစီရင်ခံစာများနှင့် စစ်ဆေးရေးအတွက် `offline`
- Soracloud အက်ပ် platform အကူလုပ်ဆောင်ချက်များအတွက် `soracloud`
- SORA Cross-Chain Protocol ၏ ဖတ်ရှုမှုများ၊ လွှဲပြောင်းမှုများနှင့် သက်သေများအတွက် `sccp`

Transaction တင်သွင်းသော command တိုင်းတွင် `--fee-payer authority` ကဲ့သို့ အခကြေးငွေပေးသူကို တိတိကျကျ သတ်မှတ်ရသည်။ CLI သည် လက်မှတ်မထိုးမီ အခကြေးငွေအတိအကျကို တွက်ချက်ဖော်ပြသည်။

`--output-format text` ကို လူသားဖတ်လို့ရတဲ့ အော်ပရေတာထုတ်လုပ်မှုအတွက် အသုံးပြုပြီး `--machine` ကို တင်းကျပ်တဲ့ အလိုအလျောက်ဖြစ်စဉ်အတွက် အသုံးပြုပါ။

## (၃) ပြည်သူ့စစ်ဆေးရေးကွန်ရက် Taira {#_3-try-the-public-taira-testnet}

ဒေသတွင်းကွန်ရက် peer ကိုမောင်းနှင်ခင် (သို့) cryptographic signer ကိုဖန်တီးမီ ဖတ်ခြင်းသာဖြစ်သော Taira စစ်ဆေးမှုကို စမ်းကြည့်နိုင်သည်။ ဤအမိန့်များသည် အများပြည်သူ Torii JSON လမ်းကြောင်းများကိုအသုံးပြုပြီး testnet XOR ကိုမသုံးပါ။

Taira အခြေအနေကို စစ်ဆေးပါ။

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

အထောက်အထား မစစ်ရသေးသော ဖတ်ရှုသူတစ်ဦး မြင်နိုင်သော domain များကို စာရင်းပြုပါ:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

အရင်းအမြစ်ဆိုင်ရာ အဓိပ္ပါယ်ဖွင့်ဆိုချက် အနည်းငယ်နှင့် ၎င်းတို့၏ လက်ရှိ ရောင်းအားကို ဖော်ပြပါ-

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

လက်ရှိ `iroha` binary ရှိလျှင် Taira ပြဿနာရှာဖွေစစ်ဆေးရေး အကူပရိုဂရမ်ကို လုပ်ဆောင်ပါ။

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

လက်မှတ်ထိုးထားသော command များကို စမ်းသပ်ရန် အသင့်ဖြစ်မှသာ `taira.client.toml` ကို ဖန်တီးပါ။ ပြင်ဆင်သတ်မှတ်မှု၊ faucet နှင့် အခြေခံစမ်းသပ်မှု လုပ်ငန်းစဉ်ကို [SORA Nexus ၏ data space များနှင့် ချိတ်ဆက်ခြင်း](/my/get-started/sora-nexus-dataspaces.md) တွင် ကြည့်ပါ။ အကောင့်ကို faucet မှ အခကြေးငွေသုံး ပိုင်ဆိုင်မှုဖြင့် ငွေမဖြည့်မချင်း Taira သို့ ရေးသားသော command များ မလုပ်ဆောင်ပါနှင့်။

အခကြေးငွေပေးရသော Taira ၏ CLI နမူနာတိုင်းအတွက် [Taira တွင် Testnet XOR ရယူခြင်း](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ရှိ ကြိုတင်ပြင်ဆင်သည့် faucet လုပ်ငန်းစဉ်ဖြင့် လက်မှတ်ထိုးသူကို ငွေဖြည့်ပြီး လက်ကျန်ကို စစ်ဆေးပါ:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Faucet လမ်းကြောင်းက `502` ပြန်ပေးပါက စောင့်ပြီး ပြန်ကြိုးစားပါ။ ၎င်းသည် အများသုံး testnet ရရှိနိုင်မှု ပြဿနာဖြစ်ပြီး အကောင့်ကီးများ ပြန်ထုတ်လုပ်ရန် အချက်ပြခြင်း မဟုတ်ပါ။

လက်ကျန်ကို မြင်ရပြီးနောက် ရေးသားမှုများကို `--fee-payer authority` ဖြင့် တင်သွင်းပါ။ CLI သည် လက်မှတ်မထိုးမီ Taira ၏ အခကြေးငွေသုံး ပိုင်ဆိုင်မှုဖြင့် အခကြေးငွေအတိအကျကို တွက်ချက်ဖော်ပြသည်:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## Basic blockchain ledger Commands များ {#_4-basic-ledger-commands}

ဒိုမင်အားလုံးကို စာရင်းပေးပါ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

သာမန်ဒိုမင်ဖန်တီးမှုမှာ Declarative alias Planner ကိုသုံးပါတယ်။ `ledger domain` command မှာ `register` subcommand မရှိပါဘူး။ `docs.universal` အတွက် လျှို့ဝှက်မဲ့ `AliasSetupPlanRequestV1` ရည်ရွယ်ချက်တစ်ခု ပြင်ဆင်ပြီး သင့်ရဲ့ SDK (သို့) Onboarding ဝန်ဆောင်မှုကို သုံးပြီး စီစဉ်ပြီး အသုံးချလိုက်ပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

ရည်ရွယ်ချက်သည် data space ID၊ စံပိုင်ရှင်အကောင့်၊ ငှားရမ်းသက်တမ်းနှင့် လက်ရှိ quote စစ်ဆေးချက်ကို သတ်မှတ်ချည်နှောင်သည်။ အစီအစဉ်ရေးဆွဲသူသည် လက်ရှိအခြေအနေကို စစ်ဆေးပြီး တင်သွင်းရမည့် ခွဲမရသော `EnsureAlias` အစီအစဉ်အတိအကျကို ပြန်ပေးသည်။ အခြားကွန်ရက်မှ စစ်ဆေးကာကွယ်မှုတန်ဖိုးများကို လက်ဖြင့် မကူးယူပါနှင့်။

ရိုးရှင်းတဲ့ ping ငွေပေးချေမှု ပေးပို့ပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

မကြာသေးခင်က ဘလော့ကို ဖတ်ရှုရန် (သို့) ဘလော့အစီအစဉ်များကို လက်မှတ်ထိုးရန်:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## (၅) Operator Command များ {#_5-operator-commands}

Consensus အော်ပရေတာ command များတွင် ခွင့်ပြုစာရင်းဝင် လုပ်ဆောင်ချိန်ကီး လိုအပ်သည်။ ၎င်းကို `client.toml` ထဲ မထည့်ဘဲ ပိုင်ရှင်သာ ဝင်ရောက်နိုင်သော ဖိုင်၏ လမ်းကြောင်းအပြည့်အစုံဖြင့် ပေးပါ:

```bash
# The generated localnet writes its allow-listed operator key here.
: "${OPERATOR_KEY_FILE:=$PWD/localnet/runtime/operator-signer.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

အမိန့်မပေးတဲ့ စာတန်း၊ ဆော့ဖ်ဝဲ စီမံခန့်ခွဲမှု အလုပ်ဖြစ်စဉ်၊ ရွေးကောက်ပွဲနဲ့ အကောင်အထည်ဖော်ရေး လမ်းကြောင်း စိစစ်ချက်:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

Commit လုပ်ပြီးသော consensus lane များနှင့် ဤနိုဒ်၏ instance အခြေအနေ:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

ကွင်းဆက်အလိုက် သဘောတူညီမှု ပမာဏများ-

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## ၆။ နောက်ဘယ်ကိုသွားရမလဲ {#_6-where-to-go-next}

- [SDK သင်တန်းများ](/my/guide/tutorials/)
- [Torii ၏ endpoint များ](/my/reference/torii-endpoints.md)
- [Iroha ဘိုင်နရီများနှင့် အလုပ်လုပ်ခြင်း](/my/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

မူရင်း checkout မှ Markdown အကူအညီ snapshot အပြည့်အစုံကို ဖော်ပြရန် အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
