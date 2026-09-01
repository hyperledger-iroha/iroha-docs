---
translation_locale: my
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# လည်ပတ်မှု Iroha 3 မှတဆင့် CLI {#operate-iroha-3-via-cli}

`iroha` ဘိုင်နရီသည် Iroha 3 အတွက် command-line client ဖြစ်သည်။ ၎င်းကို blockchain ledger ၏အခြေအနေကိုမေးမြန်းရန်၊ ငွေလဲလှယ်မှုတင်သွင်းရန်နှင့် operator API အဆုံးမှတ်များကိုစစ်ဆေးရန်အသုံးပြုပါ။

## (၁) ကြိုတင်လိုအပ်ချက်များ {#_1-prerequisites}

ဒေသတွင်းကွန်ရက်ကို အစပြုပါ။

- [လွှတ်တင်ခြင်း Iroha 3](./launch-iroha.md)

အောက်ပါဥပမာများသည် [လွှတ်တင်ခြင်း Iroha 3](./launch-iroha.md) တွင် ဖန်တီးထားသော localnet မှထုတ်လုပ်သည့် client ဖွဲ့စည်းမှုကို ယူဆသည်-

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
- `ledger` အတွက် blockchain ledger ကိုဖတ်ပြီးရေးသား
- `ops` လုပ်ငန်းရှင်များအတွက် ရောဂါစစ်ဆေးခြင်း
- `app` app API အကူအညီများအတွက်
- `contract` စာချုပ်တင်သွင်းခြင်းနှင့် နည်းပညာဖောက်သည်များအတွက်
- `tools` ရောဂါစစ်ဆေးရေးနှင့် ဖွံ့ဖြိုးရေး လုပ်ငန်းများအတွက်
- `taira` အတွက် Taira နှင့် Nexus- ဦးတည်တဲ့ အလုပ်ဖြစ်စဉ်များ

`ledger` အုပ်စုမှာ `ledger transaction` လို ဒိုမင်စpecified transaction assistants တွေလည်း ပါဝင်ပါတယ်။

`--output-format text` ကို လူသားဖတ်လို့ရတဲ့ အော်ပရေတာထုတ်လုပ်မှုအတွက် အသုံးပြုပြီး `--machine` ကို တင်းကျပ်တဲ့ အလိုအလျောက်ဖြစ်စဉ်အတွက် အသုံးပြုပါ။

## (၃) ပြည်သူ့စစ်ဆေးရေးကွန်ရက် Taira {#_3-try-the-public-taira-testnet}

ဒေသတွင်းကွန်ရက် peer ကိုမောင်းနှင်ခင် (သို့) cryptographic signer ကိုဖန်တီးမီ ဖတ်ခြင်းသာဖြစ်သော Taira စစ်ဆေးမှုကို စမ်းကြည့်နိုင်သည်။ ဤအမိန့်များသည် အများပြည်သူ Torii JSON လမ်းကြောင်းများကိုအသုံးပြုပြီး testnet XOR ကိုမသုံးပါ။

Taira အခြေအနေကို စစ်ဆေးပါ။

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
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

`taira.client.toml` ကို လက်မှတ်ရေးထိုးထားသော အမိန့်များကို စစ်ဆေးရန် အဆင်သင့်ဖြစ်ပါကသာ ဖန်တီးပါ။ config, testnet funding service နှင့် canary flow များအတွက် [SORA Nexus ဒေတာနေရာများနှင့် ချိတ်ဆက်ခြင်း](/my/get-started/sora-nexus-dataspaces.md) ကိုကြည့်ပါ။ testnet funding service fee asset ဖြင့် အကုန်မဆောင်ရွက်ခင်အထိ Taira ကိုတိုက်ရိုက် write commands ကို မပြေးပါနဲ့။

အခွန်ပေးခြင်းအတွက် Taira CLI ဥပမာ, testnet ဘဏ္ဍာရေးဝန်ဆောင်မှုကူညီသူကို Save [Testnet ကို ရယူပါ။ XOR အပေါ် Taira](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) သို့ဖြစ်သည် `taira_faucet_claim.py`, ထို့နောက် claim testnet XOR ပထမက-

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

testnet ဘဏ္ဍာရေး ဝန်ဆောင်မှု ပဟေဠိ (သို့) လျှောက်လွှာလမ်းကြောင်း `502` ပြန်လာရင် စောင့်ပြီး ထပ်မံကြိုးစားပါ။ ဒါက အများပြည်သူအတွက် testnet ရရှိနိုင်မှု ပြဿနာတစ်ခုဖြစ်ပြီး အကောင့်ကလီးတွေကို ပြန်လည်ဖန်တီးဖို့ အချက်ပြချက်မဟုတ်ပါဘူး။

ငွေကြေးစာရင်းကို မြင်နိုင်ပြီးနောက် အခွန်လက်မှတ် metadata ကို attach လုပ်ပြီး ရေးသားပါ-

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## Basic blockchain ledger Commands များ {#_4-basic-ledger-commands}

ဒိုမင်အားလုံးကို စာရင်းပေးပါ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

သာမန်ဒိုမင်ဖန်တီးမှုမှာ Declarative alias Planner ကိုသုံးပါတယ်။ `ledger domain` command မှာ `register` subcommand မရှိပါဘူး။ `docs.universal` အတွက် လျှို့ဝှက်မဲ့ `AliasSetupPlanRequestV1` ရည်ရွယ်ချက်တစ်ခု ပြင်ဆင်ပြီး သင့်ရဲ့ SDK (သို့) Onboarding ဝန်ဆောင်မှုကို သုံးပြီး စီစဉ်ပြီး အသုံးချလိုက်ပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Intent pin က data space ID ၊ single protocol-standard owner account၊ lease term နဲ့ current fee-price validation guard ကို ပစ်မှတ်ထားတယ်။ Planner က live state ကို စစ်ဆေးပြီး တင်ပြဖို့ တိကျတဲ့ atomic `EnsureAlias` plan ကိုပြန်ပေးပါတယ်။ အခြားကွန်ရက်တစ်ခုကနေ guard value တွေကို လက်နဲ့မကူးယူပါနဲ့။

ရိုးရှင်းတဲ့ ping ငွေပေးချေမှု ပေးပို့ပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

မကြာသေးခင်က ဘလော့ကို ဖတ်ရှုရန် (သို့) ဘလော့အစီအစဉ်များကို လက်မှတ်ထိုးရန်:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## (၅) Operator Command များ {#_5-operator-commands}

Consensus Operator commands များတွင် allow-listed software execution environment key ကိုလိုအပ်သည်။ `client.toml` မှထွက်၍ ပိုင်ရှင်များအတွက်သာ ဖိုင်ကို ရှင်းလင်းစွာပေးပို့ပါ။

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

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

အမြင့်ဆုံးနှင့် ပိတ်ထားသော သဘောတူညီချက် အချိုးအမှတ် လက်မှတ်များ:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
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
- [Torii API အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md)
- [Iroha ဘိုင်နရီများနှင့် အလုပ်လုပ်ခြင်း](/my/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

အရင်းအမြစ်ကုဒ် အလုပ်လက်မှတ်မှ Markdown အကူအညီအပြည့်အဝ Point-in-time ဒေတာမြင်ကွင်းကို ပြန်လည်ဖန်တီးရန် run:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
