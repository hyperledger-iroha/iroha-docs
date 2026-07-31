---
translation_locale: my
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# လည်ပတ်မှု Iroha 3 မှတဆင့် CLI {#operate-iroha-3-via-cli}

`iroha` ဘိုင်နရီသည် Iroha 3 အတွက် အမိန့်တန်းက Client ဖြစ်ပါသည်။ ၎င်းကို Ledger အခြေအနေကို မေးမြန်းရန်၊ ငွေကြေးလုပ်ငန်းများတင်သွင်းရန်နှင့် Operator အဆုံးအဖြတ်များကို စစ်ဆေးရန်အသုံးပြုပါ။

## (၁) ကြိုတင်လိုအပ်ချက်များ {#_1-prerequisites}

ဒေသတွင်းကွန်ရက်ကို အစပြုပါ။

- [လွှတ်တင်ခြင်း Iroha 3](./launch-iroha.md)

အောက်ပါဥပမာများသည် [Launch Iroha 3](./launch-iroha.md) တွင်ဖန်တီးသော localnet မှထုတ်လုပ်သော client ဖွဲ့စည်းမှုကို ယူဆသည်-

```bash
./localnet/client.toml
```

## (၂) အခြေခံ CLI Setup {#_2-basic-cli-setup}

အဆင့်မြင့် အကူအညီကို ပြပေးပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI ကို အောက်ပါ အဆင့်မြင့် အမိန့်အုပ်စုများအဖြစ် စုစည်းထားသည်-

- `account` ငွေစာရင်းကို ဦးတည်သော ဖြတ်လမ်းများ
- `tx` ငွေပေးချေမှုအဆင့် အကူအညီများအတွက်
- `ledger` for on-ledger readers and writes
- `ops` လုပ်ငန်းရှင်များအတွက် ရောဂါစစ်ဆေးခြင်း
- `app` app API အကူအညီများအတွက်
- `contract` လက်မှတ်ထိုးခြင်းနှင့် ဖိတ်ကြားချက်များအတွက်
- `tools` ရောဂါစစ်ဆေးရေးနှင့် ဖွံ့ဖြိုးရေး လုပ်ငန်းများအတွက်
- `taira` အတွက် Taira နှင့် Nexus- ဦးတည်တဲ့ အလုပ်ဖြစ်စဉ်များ

`ledger` အုပ်စုမှာ `ledger transaction` လို ဒိုမင်စpecified transaction assistants တွေလည်း ပါဝင်ပါတယ်။

`--output-format text` ကို လူသားဖတ်လို့ရတဲ့ အော်ပရေတာထုတ်လုပ်မှုအတွက် အသုံးပြုပြီး `--machine` ကို တင်းကျပ်တဲ့ အလိုအလျောက်ဖြစ်စဉ်အတွက် အသုံးပြုပါ။

## (၃) ပြည်သူ့စစ်ဆေးရေးကွန်ရက် Taira {#_3-try-the-public-taira-testnet}

ဒေသခံ peer ကိုမဖွင့်ခင် (သို့) လက်မှတ်ရေးထိုးသူကိုမဖန်တီးမီ ဖတ်နိုင်သောသာ Taira စစ်ဆေးမှုကို စမ်းကြည့်နိုင်ပါတယ်။ ဤအမိန့်များသည် အများပြည်သူ Torii JSON လမ်းကြောင်းများကိုအသုံးပြုပြီး testnet XOR ကိုမသုံးပါ။

Taira ကျန်းမာရေးကို စစ်ဆေးပါ။

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` ဒေတာဇုန်မှာ အများသုံးဒိုမီနာတွေကို စာရင်းပေးပါ။

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

အရင်းအမြစ်ဆိုင်ရာ အဓိပ္ပါယ်ဖွင့်ဆိုချက် အနည်းငယ်နှင့် ၎င်းတို့၏ လက်ရှိ ရောင်းအားကို ဖော်ပြပါ-

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

လက်ရှိ `iroha` ဘိုင်နရီ ရှိရင် Taira ရောဂါရှာဖွေရေး အကူကို run လုပ်ပါ။

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

ဖန်တီးခြင်း `taira.client.toml` လက်မှတ်ထိုးထားတဲ့ အမိန့်တွေကို စမ်းသပ်ဖို့ အဆင်သင့်ဖြစ်တဲ့အခါမှာပဲပေါ့။ [ချိတ်ဆက် SORA Nexus ဒေတာနေရာများ](/my/get-started/sora-nexus-dataspaces.md) Config, faucet, and canary flow အတွက်။ Taira အကောင့်ကို faucet fee အရင်းအမြစ်နဲ့ ငွေကြေးထောက်ပံ့မပေးခင်အထိပါ။

အခွန်ပေးခြင်းအတွက် Taira CLI ဥပမာ Faucet Helper ကို Save လုပ်ပါ။ [Testnet ကို ရယူပါ။ XOR အပေါ် Taira](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) သို့ဖြစ်သည် `taira_faucet_claim.py`, ထို့နောက် claim testnet XOR ပထမက-

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Faucet puzzle (သို့) claim route က `502` ပြန်လာရင် စောင့်ပြီး ထပ်ကြိုးစားပါ။ ဒါက အများပြည်သူ testnet အရင်းအမြစ်ပြဿနာပါ၊ အကောင့်ကလီးတွေကို ပြန်လည်ဖန်တီးဖို့ အချက်ပြမှုမဟုတ်ဘူး။

ငွေကြေးစာရင်းကို မြင်နိုင်ပြီးနောက် အခွန်လက်မှတ် metadata ကို attach လုပ်ပြီး ရေးသားပါ-

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. အခြေခံ Ledger Commands များ {#_4-basic-ledger-commands}

ဒိုမင်အားလုံးကို စာရင်းပေးပါ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

သာမန်ဒိုမင်ဖန်တီးမှုမှာ Declarative alias Planner ကိုအသုံးပြုသည်။ `ledger domain` command မှာ `register` subcommand မရှိပါ။ `docs.universal` အတွက် လျှို့ဝှက်မဲ့ `AliasSetupPlanRequestV1` ရည်ရွယ်ချက်ကို သင့်ရဲ့ SDK (သို့) Onboarding ဝန်ဆောင်မှုဖြင့်ပြင်ဆင်ပြီး စီစဉ်ပြီး အသုံးချလိုက်ပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Intent pin က data space ID ၊ canonical owner account၊ lease term နဲ့ current quote guard ကို ပစ်မှတ်ထားတယ်။ planner က live state ကို စစ်ဆေးပြီး တင်ပြဖို့ တိကျတဲ့ atomic plan `EnsureAlias` ကိုပြန်ပေးပါတယ်။ အခြားကွန်ရက်တစ်ခုကနေ guard value တွေကို လက်နဲ့မကူးပါနဲ့။

ရိုးရှင်းတဲ့ ping ငွေပေးချေမှု ပေးပို့ပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

မကြာသေးခင်က ဘလော့ကို ဖတ်ရှုရန် (သို့) ဘလော့အစီအစဉ်များကို လက်မှတ်ထိုးရန်:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## (၅) Operator Commands များ {#_5-operator-commands}

သဘောတူညီချက်အခြေအနေ

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

တစ်ဆင့်ချင်း latency snapshot ကို:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

ရရှိနိုင်မှု၊ ကောက်ယူသူ၊ RBC နောက်ကျောပုံများနှင့် VRF snapshot:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

ကွင်းဆက်အလိုက် သဘောတူညီမှု ပမာဏများ-

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## ၆။ နောက်ဘယ်ကိုသွားရမလဲ {#_6-where-to-go-next}

- [SDK သင်ကြားချက်များ](/my/guide/tutorials/)
- [Torii အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md)
- [Iroha ဘိုင်နရီများ](/my/reference/binaries.md) နှင့် အလုပ်လုပ်ခြင်း၊
- [CLI README ](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

Source checkout ကနေ Full Markdown အကူအညီ snapshot ကို ပြန်လည်ဖန်တီးရန် Run:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
