---
translation_locale: my
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# လုပ်ဆောင်မှု Iroha 3 အပြင် CLI {#operate-iroha-3-via-cli}

နိုင်ငံခြားရေး `iroha` binary က command line client ကို Iroha 3. မေးမြန်းဖို့ သုံးပါ။
စာရင်းအင်းစာရင်း၊ ငွေကြေးလွှဲပြောင်းမှုတင်သွင်းခြင်းနှင့် လုပ်ငန်းရှင်များ၏ နောက်ဆုံးအချက်များကို စစ်ဆေးခြင်း။

## (၁) လိုအပ်ချက်များ {#_1-prerequisites}

ဒေသတွင်းကွန်ရက်ကို အရင်စတင်ပါ။

- [လွှတ်တင်ခြင်း Iroha 3](./launch-iroha.md)

အောက်ပါဥပမာများမှာ localnet မှ client ဖွဲ့စည်းမှုကို ဖန်တီးထားကြောင်း ယူဆထားသည်
ဖန်တီးခဲ့သည် [လွှတ်တင်ခြင်း Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## (၂) အခြေခံ CLI တပ်ဆင်ခြင်း {#_2-basic-cli-setup}

အဆင့်မြင့် အကူအညီကို ပြပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

နိုင်ငံခြားရေး CLI အောက်ပါ အဆင့်မြင့် အမိန့်အုပ်စုများသို့ စုစည်းထားသည်-

- `account` ငွေစာရင်းကို ဦးတည်တဲ့ ဖြတ်လမ်းများအတွက်
- `tx` ငွေပေးချေမှုအဆင့် အကူအညီများအတွက်
- `ledger` စာရင်းအင်းစာအုပ်မှာ ဖတ်ပြီး ရေးတဲ့အတွက်
- `ops` လုပ်ငန်းရှင်ရဲ့ ရောဂါစစ်ဆေးမှုအတွက်
- `app` app အတွက် API အကူအညီပေးသူများ
- `contract` စာချုပ်များ ဖြန့်ချိခြင်းနှင့် ဖုန်းခေါ်ဆိုမှုများအတွက်
- `tools` ရောဂါရှာဖွေရေးနှင့် ဆောက်လုပ်ရေး အသုံးအဆောင်များအတွက်
- `taira` အတွက် Taira နှင့် Nexus- ဦးတည်တဲ့ အလုပ်ဖြစ်စဉ်များ

နိုင်ငံခြားရေး `ledger` အုပ်စုထဲမှာ domain-specific transaction helpers တွေလည်း ပါဝင်ပါတယ်။
`ledger transaction`.

အသုံးပြုခြင်း `--output-format text` လူနဲ့ ဖတ်လို့ရတဲ့ operator output နဲ့ `--machine`
တင်းကျပ်တဲ့ အလိုအလျောက်စနစ်အတွက်ပါ။

## (၃) လူထုကို စမ်းကြည့်ပါ။ Taira Testnet {#_3-try-the-public-taira-testnet}

စာဖတ်တာပဲ စမ်းကြည့်လို့ရတယ် Taira ဒေသတွင်း peer ကို မလုပ်ခင် (သို့)
ဒီပညတ်တွေက အများပြည်သူကို သုံးတယ်။ Torii JSON လမ်းကြောင်းများနှင့် testnet မသုံးပါ
XOR.

စစ်ဆေးပါ Taira ကျန်းမာရေး:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

ပြည်သူ့နေရာများကို စာရင်းပေးပါ `universal` ဒေတာနေရာ:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

အရင်းအမြစ်ဆိုင်ရာ အဓိပ္ပါယ်ဖွင့်ဆိုချက် အနည်းငယ်နှင့် ၎င်းတို့၏ လက်ရှိ ရောင်းအားကို ဖော်ပြပါ-

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

သင်ဟာ စီးမျောမှုရှိရင် `iroha` binary ကို run လုပ်ပါ Taira ရောဂါရှာဖွေရေး အကူ:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

ဖန်တီးခြင်း `taira.client.toml` လက်မှတ်ထိုးထားတဲ့ အမိန့်တွေကို စမ်းသပ်ဖို့ အဆင်သင့်ဖြစ်တဲ့အခါပဲပေါ့။
ကြည့်ပါ။ [ချိတ်ဆက် SORA Nexus ဒေတာနေရာများ](/my/get-started/sora-nexus-dataspaces.md)
Config, faucet, and canary flow အတွက်ပါ။
Taira ငွေကြေးငွေကို ရေပိုက်ခွန်အစီအစဉ်နဲ့ ဘဏ္ဍာငွေပေးချေခြင်း မပြုခင်အထိပါ။

အခွန်ပေးခြင်းအတွက် Taira CLI ဥပမာ၊ faucet အကူအညီကို
[Testnet ကို ရယူပါ။ XOR အပေါ် Taira](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
အတိုင်း `taira_faucet_claim.py`, ထို့နောက် claim testnet XOR ပထမက-

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

ရေနံရေချိုးခန်း ပဟေဠိ (သို့) လျှောက်လွှာလမ်းကြောင်း ပြန်လာရင် `502`, စောင့်ပြီး ထပ်ကြိုးစားပါ။
အများပြည်သူ testnet အသုံးပြုနိုင်မှု ပြဿနာ၊ အကောင့်ကီးတွေကို ပြန်လည်ဖန်တီးဖို့ အချက်ပြချက် မဟုတ်ပါ။

ငွေကြေးစာရင်းကို မြင်နိုင်ပြီးနောက် အခွန်လက်ဝယ် metadata ကို attach လုပ်ပါ။

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. အခြေခံ Ledger Commands များ {#_4-basic-ledger-commands}

ဒိုမင်အားလုံးကို စာရင်းပေးပါ

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

သာမန်ဒိုမင်ဖန်တီးခြင်းမှာ ကြေညာရေးအမည်မဲ့စီစဉ်သူကို အသုံးပြုတယ်။ `ledger
domain` အမိန့်မရှိ `register` လျှို့ဝှက်မဲ့ စစ်ဆင်ရေးကို ပြင်ဆင်ပါ။
`AliasSetupPlanRequestV1` ရည်ရွယ်ချက် `docs.universal` သင့်ရဲ့ SDK ဒါမှမဟုတ်
Onboarding ဝန်ဆောင်မှုကို စီစဉ်ပြီး သုံးပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

ရည်ရွယ်ချက်က ဒေတာနေရာကို ပိတ်ထားတယ်။ ID, တရားဝင်ပိုင်ရှင်စာရင်း၊ ငှားရမ်းမှုသက်တမ်းနဲ့
Planner က Live Status ကို စစ်ဆေးပြီး တိကျတဲ့
အက်တမ် `EnsureAlias` အခြားသူထံမှ စောင့်ရှောက်မှု တန်ဖိုးများကို လက်နဲ့မကူးယူပါနဲ့။
ကွန်ရက်။

ရိုးစင်းတဲ့ ping ငွေပေးချေမှု ပေးပို့ပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

မကြာသေးခင်က ဘလော့ကို ဖတ်ရှုရန် (သို့) ဘလော့ဖြစ်ရပ်များကို လက်မှတ်ထိုးရန်:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## (၅) Operator Command များ {#_5-operator-commands}

သဘောတူညီချက်အခြေအနေ

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

တစ်ဆင့်စီ latency snapshot:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

ရယူနိုင်စွမ်း၊ ကောက်ခံသူ၊ RBC နောက်ကျနေမှုတွေ၊ VRF snapshot:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

ချိတ်ဆက်ထားတဲ့ သဘောတူညီမှု ပမာဏများ

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## (၆) နောက်ဘယ်ကိုသွားရမလဲ {#_6-where-to-go-next}

- [SDK သင်ခန်းစာများ](/my/guide/tutorials/)
- [Torii အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md)
- [အလုပ်လုပ်ခြင်း Iroha ဘိုင်နရီများ](/my/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

Source checkout ကနေ Full Markdown အကူအညီ snapshot ကို ပြန်လည်ဖန်တီးရန် Run:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
