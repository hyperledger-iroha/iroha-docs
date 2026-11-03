---
translation_locale: my
translation_source: /cookbook/metadata.md
translation_source_hash: 88298912f083d79a9fdfe5e8d0a89d49acb97d814d3871db0c874cb40db5342b
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# မီတာဒေတာ {#metadata}

## ရလဒ် {#outcome}

Taira တွင် metadata ကို ဖတ်ရှုပြီး အခွန်ကို ရှင်းလင်းစွာ ပေးဆောင်သော transaction တစ်ခုဖြင့် အကောင့် metadata တန်ဖိုးတစ်ခုကို သတ်မှတ်၍ စစ်ဆေးကာ ထိုတန်ဖိုးကို ပြန်လည်ဖယ်ရှားပါ။ သင်သည် ledger object metadata ကို transaction metadata နှင့် သီးခြားထားရှိမည်ဖြစ်သည်။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Python 3.11 သို့မဟုတ်နောက်ဆုံး၊ current `iroha` CLI။
- [Taira သို့ ချိတ်ဆက်ပါ](./connect-to-taira.md) မှ ငွေထည့်ထားသော `taira.client.toml`။
- target account ရဲ့ metadata တွေထက် authorization principal ကို ပစ်မှတ်ထားတာပါ။ ဥပမာက configured authorization principle ကိုပဲ ပစ်မှတ် ထားတယ်။ အခြားအကောင့်တစ်ခုမှာ တိကျတဲ့ ခွင့်ပြုချက် လိုအပ်ပါတယ်။

## ခြေလှမ်း {#steps}

### (၁) လျှို့ဝှက်လက်မှတ်မတပ်ဘဲ metadata ကိုဖတ်ပါ။ {#_1-read-metadata-without-a-signer}

metadata သည် `Name` မှ JSON အထိ စစ်ဆေးထားသော မြေပုံတစ်ခုဖြစ်သည်။ အလွတ်မြေပုံများနှင့် empty filtered output များသည် valid ရလဒ်များဖြစ်ပါသည်။

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[]
    | select((.metadata // {} | length) > 0)
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

အသေးစား သရုပ်ဖော်ရေး (သို့) ညွှန်းကိန်းတင်တဲ့ ကွင်းများအတွက် metadata ကိုအသုံးပြုပါ။ ကြီးမားသော အသုံးဝင်မှုများကို blockchain ledger အပြင်မှာထည့်ပြီး URI သို့မဟုတ် SoraFS ရည်ညွှန်းချက်အဖြစ် cryptographic digest value ကို သိမ်းဆည်းပါ။

### (၂) ရည်မှန်းချက်စာရင်းကို ထုတ်ယူပါ။ {#_2-derive-the-target-account}

Taira config ထဲက public key ကိုသာဖတ်ပြီး single protocol standard domainless I105 form သို့ပြောင်းပါ။

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
```

### (၃) JSON တန်ဖိုးကို သတ်မှတ်ပါ။ {#_3-set-one-json-value}

standard input မှ ဖတ်ယူသော JSON သည် အကောင့်၏ `cookbook_profile` တန်ဖိုး ဖြစ်လာသည်။ `--metadata <file>` ဖြင့် ပူးတွဲထည့်သွင်းသော transaction metadata သည် transaction envelope ပေါ်ရှိ သီးခြား map တစ်ခုဖြစ်ပြီး အခွန်ကို ဘယ်သောအခါမျှ မရွေးချယ်ပါ။ `--fee-payer` နှင့် CLI ၏ တိကျသော အခွန်စျေးနှုန်းခန့်မှန်းချက်တို့ကသာ ရွေးချယ်ပြီး client သည် `gas_asset_id`၊ `gas_limit` သို့မဟုတ် `fee_sponsor` key များ ပါဝင်သော transaction metadata ကို ငြင်းပယ်သည်။

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI သည် လက်မှတ်မထိုးမီ Taira ၏ အခွန်အရင်းအမြစ်ဖြင့် တိကျသော အခွန်ကို ခန့်မှန်းတွက်ချက်ပြသပြီးနောက် တင်သွင်းကာ ပြန်မလာမီ Applied finality ကို စောင့်ဆိုင်းသည်။

::: warning ခွင့်ပြုချက် ကန့်သတ်ချက်

အသက်ဝင်နေသော executor သည် object တစ်ခုစီကို မည်သူ ပြောင်းလဲနိုင်သည်ကို ဆုံးဖြတ်သည်။ အခြားအကောင့်တစ်ခုကို ပြင်ဆင်ရန် ပုံမှန်အားဖြင့် `CanModifyAccountMetadata` လိုအပ်သည်။ ဒိုမင်များ၊ အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ၊ NFTs နှင့် trigger များတွင် ၎င်းတို့၏ ကိုယ်ပိုင် ပစ်မှတ်အလိုက် metadata ခွင့်ပြုချက်များ ရှိသည်။ Taira က လိုအပ်သော authority ကို ခွင့်ပြုချက်ပေးအပ်မထားပါက တူညီသော အကောင့် command များကို `./localnet/client.toml` ဖြင့် လုပ်ဆောင်ပြီး ဖန်တီးထားသော localnet authority ၏ canonical I105 ID ကို အစားထိုးပါ။ ဒေသတွင်း အခွန်ပေးဆောင်သူကို ရှင်းလင်းစွာ ရွေးချယ်ထားမှုကို ဆက်ထိန်းထားပါ။

:::

### (၄) သော့ကို ဖယ်ရှားပါ။ {#_4-remove-the-key}

နောက်ဆုံးသတ်မှတ်ထားတဲ့ တန်ဖိုးကို အရင်ဖတ်ပြီး နောက်မှာ သီးခြား ဖယ်ရှားမှု ငွေပေးချေမှုကို ပေးသွင်းပါ။

```bash
iroha --config ./taira.client.toml --machine account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python လျှောက်လွှာများအတွက် ကိုက်ညီသော ရိုက်နှိပ်ထားသည့် ဆောက်လုပ်သူများသည် `Instruction.set_account_key_value` နှင့် `Instruction.remove_account_key_value` ဖြစ်ပြီး ၎င်းတို့အား ငွေပေးချေမှု မီတာဒေတာနှင့်အတူ တင်ပြ၍ [Python သင်ခန်းစာ](/my/guide/tutorials/python.md#shared-setup) မှ စောင့်ဆိုင်းရေး အကူအညီ ပေးပို့ပါ။

## စစ်ဆေးပါ {#verify}

သတ်မှတ်ထားတဲ့ ငွေပေးချေမှုအပြီးမှာ `meta get` က `version: 1` နဲ့ အရာဝတ္ထုကို ပြန်ပို့ရပါမယ်။ ဖယ်ရှားပြီးနောက် တိုက်ရိုက်ရှာဖွေမှုက တန်ဖိုးတစ်ခုကို ပြန်မပို့ရတော့ပါဘူး။

```bash
iroha --config ./taira.client.toml --machine account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

သီးခြားစာရင်းဖတ်ခြင်းက ပျောက်နေတဲ့ metadata key ကိုကွန်ရက် (သို့) account ပျက်ကွက်မှုမှ ခြားနားစေပါတယ်။ ထုတ်လုပ်ရေးကုဒ်ကလည်း JSON တန်ဖိုးတစ်ခုလုံးကို သတ်မှတ်ပြီးနောက် စစ်ဆေးသင့်တယ်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- Standard input မှာ valid JSON value တစ်ခု ပါဝင်ဖို့လိုပါတယ်။ string တွေမှာ JSON ကိုးကားချက်တွေလိုအပ်ပြီး အရာဝတ္ထုတွေနဲ့ arrays တွေဟာ ကောင်းမွန်စွာဖွဲ့စည်းထားဖို့လိုတယ်။
- metadata key များသည် `Name` တန်ဖိုးများဖြစ်ပြီး parsing လုပ်ပြီးနောက် case-sensitive ဖြစ်ပါသည်။ schema အပြောင်းအလဲတိုင်းအတွက် versioned keys ကိုဖန်တီးခြင်းအစား တည်ငြိမ်သော key ဝေါဟာရကို ထိန်းသိမ်းပါ။
- `--metadata` သည် transaction metadata ဖြစ်သည်။ ၎င်းသည် blockchain ledger object metadata ကိုမသတ်မှတ်ပါ။ နောက်တစ်ခုအတွက် entity ၏ `meta set` subcommand ကိုအသုံးပြုပါ။
- အောင်မြင်စွာတင်သွင်းပြီးနောက် စာဖတ်မှုဟောင်းတစ်ခုက ပျံ့နှံ့ခြင်း နှောင့်နှေးစေနိုင်ပါတယ်။ Applied finality ကိုစောင့်ပြီး ပြန်လည်တင်မပေးခင် မေးခွန်းကို ထပ်မံစမ်းသပ်ပါ။
- ခွင့်ပြုချက် ပယ်ချခြင်းသည် ရည်မှန်းထားသော အရာဝတ္ထုနှင့် ခွင့်ပြုမှု အဓိက နယ်နိမိတ်ကို ဖော်ထုတ်သည်။ ဒေသတွင်းတွင် ထပ်မံသင်ခန်းစာလုပ်ပါ (သို့) တိကျသောအမှတ်တံဆိပ်တောင်းဆိုပါ; ဝင်ရောက်ထိန်းချုပ်ခြင်းကိုရှောင်ရှားရန် ပုဂ္ဂလိကလျှောက်လွှာဒေတာများကို အများပြည်သူ metadata ကွင်းထဲကို မပြောင်းပါနဲ့။
- ပုဂ္ဂလိက သော့တွေ၊ ကြမ်းတမ်းတဲ့ ကိုယ်ရေးကိုယ်တာ အထောက်အထားတွေ၊ ဝင်ရောက်မှု အမှတ်တံဆိပ်တွေ (သို့) စာရွက်စာတမ်းကြီးတွေကို metadata ထဲမှာ ဘယ်တော့မှ သိမ်းမထားပါနဲ့။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ပိတ်ထားသော source code revision တွင် metadata query ပေါင်းစပ်မှု စမ်းသပ်မှုများ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/queries/metadata.rs)
- [Python SDK ရင်းမြစ်ကုဒ် ပြင်ဆင်မှုအတွက် ငွေကြေးပံ့ပိုးရေးလုပ်ငန်းရှင်များ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/README.md)
- [မီတာဒေတာ](/my/blockchain/metadata.md)
- [Metadata နှင့် blockchain ledger ကို သိုလှောင်ရန် ရွေးချယ်မှုများ](/my/guide/configure/metadata-and-store-assets.md)
- [ညွှန်ကြားချက် ကိုးကားချက်](/my/reference/instructions.md)
- [ခွင့်ပြုချက် လက်မှတ်များ](/my/reference/permissions.md)
