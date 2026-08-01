---
translation_locale: my
translation_source: /cookbook/metadata.md
translation_source_hash: 07b065b28eca44939a92b40a81a47b57178de4539abb0daf51913969e34eced7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# မီတာဒေတာ {#metadata}

## ရလဒ် {#outcome}

Taira တွင် metadata ကိုဖတ်ရှု၊ ငွေပေးချေမှုနှုန်းကို ရှင်းလင်းစွာဆောင်ရွက်သည့်ငွေပေးချေခြင်းဖြင့် အကောင့်တစ်ခု၏ metadata တန်ဖိုးကိုသတ်မှတ်၍ စစ်ဆေးပြီး တန်ဖိုးကို ထပ်မံဖယ်ရှားပါ။ သင်သည်စာအုပ်-အရာဝတ္ထု metadata များကို transaction fee metadata မှ သီးခြားထားမည်။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Python 3.11 သို့မဟုတ်နောက်ဆုံး၊ current `iroha` CLI။
- ငွေကြေးထောက်ပံ့မှု `taira.client.toml` နှင့် `taira.tx-metadata.json` မှ [ချိတ်ဆက် Taira](./connect-to-taira.md).
- Target Account ရဲ့ metadata တွေကို Authority လုပ်ပေးပါ။ ဥပမာက configured authority ကို ပစ်မှတ်ထားတယ်။ အခြား account တစ်ခုမှာ တိကျတဲ့ ခွင့်ပြုချက် လိုအပ်ပါတယ်။

## ခြေလှမ်း {#steps}

### (၁) လက်မှတ်ထိုးသူမရှိဘဲ metadata ကိုဖတ်ပါ။ {#_1-read-metadata-without-a-signer}

metadata သည် `Name` မှ JSON အထိ စစ်ဆေးထားသော မြေပုံတစ်ခုဖြစ်သည်။ အလွတ်မြေပုံများနှင့် empty filtered output များသည် valid ရလဒ်များဖြစ်ပါသည်။

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

အသေးစား သရုပ်ဖော်ရေး (သို့) ညွှန်းကိန်းတင်တဲ့ ကွင်းများအတွက် metadata ကိုသုံးပါ။ ကြီးမားတဲ့ အသုံးဝင် ဝန်ဆောင်မှုများကို စာရင်းထဲထည့်ပြီး URI သို့မဟုတ် SoraFS ရည်ညွှန်းချက်တစ်ခု သိုလှောင်ပါ။

### (၂) ရည်မှန်းချက်စာရင်းကို ထုတ်ယူပါ။ {#_2-derive-the-target-account}

Taira config ထဲက public key ကိုသာ ဖတ်ပြီး canonical domainless I105 form သို့ ပြောင်းပါ။

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

JSON ကို Standard input ကနေဖတ်ပြီး Account ရဲ့ `cookbook_profile` တန်ဖိုးဖြစ်လာတယ်။ ဒီအစား `--metadata ./taira.tx-metadata.json` သည် ငွေပေးချေမှုအဖုံးကို အခွန်နယ်ပယ်တွေကို ချိတ်ဆက်ပါတယ်။ မြေပုံနှစ်ခုမှာ ရည်မှန်းချက်နဲ့ရည်ရွယ်ချက် မတူပါဘူး။

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI သည် အခွန်ကို အဆိုပြုခြင်း၊ လက်မှတ်ထိုးခြင်း၊ တင်ပြခြင်းနှင့် ကြိုတင်စောင့်ဆိုင်းခြင်းများကို အလိုအလျောက် ထည့်သွင်းသည်။ နောက်လုပ်ဆောင်ချက်သည် ဤတန်ဖိုးအပေါ် မူတည်သည့်အခါ `--no-wait` ကို မထည့်ပါ။

::: warning ခွင့်ပြုချက် ကန့်သတ်ချက်

Active Validator က Object တစ်ခုစီကို ဘယ်သူပြောင်းနိုင်မလဲဆိုတာ ဆုံးဖြတ်တယ်။ အခြား Account ကို update လုပ်ဖို့ ပုံမှန်လိုအပ်ပါတယ်။ `CanModifyAccountMetadata`; နယ်ပယ်များ၊ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ NFTs, ပြီးတော့ trigger တွေမှာ သူတို့ရဲ့ target-specific metadata ခွင့်ပြုချက်တွေရှိတယ်ဆိုရင် Taira လိုအပ်တဲ့ ခွင့်ပြုချက် မပေးခဲ့ဘူးဆိုရင် Account command ကို Run လုပ်ပါ `./localnet/client.toml`, ဖန်တီးထားတဲ့ localnet အာဏာပိုင်ရဲ့ Canonical ကို အစားထိုးပါ။ I105 ID, နောက်ပြီး Taira Fees metadata file ကို မှတ်တမ်းတင်ပါ။ ဒေသတွင်း fee-payer ရွေးချယ်မှုကို ရှင်းလင်းစွာ သိမ်းထားပါ။

:::

### (၄) သော့ကို ဖယ်ရှားပါ။ {#_4-remove-the-key}

ကတိပြုထားတဲ့ တန်ဖိုးကို အရင်ဖတ်ပြီး နောက် သီးခြား ဖယ်ရှားမှု ငွေပေးချေမှုကို တင်သွင်းပါ။

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python လျှောက်လွှာများအတွက် ကိုက်ညီသော typeed constructors များမှာ `Instruction.set_account_key_value` နှင့် `Instruction.remove_account_key_value` ဖြစ်ပါသည်၊ ၎င်းတို့ကို transaction metadata နဲ့အတူ တင်ပြပြီး [Python tutorial ](/my/guide/tutorials/python.md#shared-setup) မှ စောင့်ဆိုင်းသူကို ပေးပို့ပါ။

## စစ်ဆေးပါ {#verify}

သတ်မှတ်ထားတဲ့ ငွေပေးချေမှုအပြီးမှာ `meta get` က `version: 1` နဲ့ အရာဝတ္ထုကို ပြန်ပို့ရပါမယ်။ ဖယ်ရှားပြီးနောက် တိုက်ရိုက်ရှာဖွေမှုက တန်ဖိုးတစ်ခုကို ပြန်မပို့ရတော့ပါဘူး။

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
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
- `--metadata` သည် ငွေပေးချေမှု မီတာဒေတာဖြစ်သည်၊ ၎င်းတွင် စာရင်းအင်းအရာဝတ္ထု မီတာ ဒေတာကို သတ်မှတ်ခြင်းမရှိပေ။ နောက်တစ်ခုအတွက် အဖွဲ့အစည်း၏ `meta set` အစိတ်အပိုင်း command ကို အသုံးပြုပါ။
- အောင်မြင်စွာတင်သွင်းပြီးနောက် စာဖတ်မှုဟောင်းတစ်ခုက ပျံ့နှံ့ခြင်း နှောင့်နှေးစေနိုင်ပါတယ်။ Applied finality ကိုစောင့်ပြီး ပြန်လည်တင်မပေးခင် မေးခွန်းကို ထပ်မံစမ်းသပ်ပါ။
- ခွင့်ပြုချက် ပယ်ချခြင်းသည် ရည်မှန်းထားသော အရာဝတ္ထုနှင့် အာဏာနယ်နိမိတ်ကို ဖော်ထုတ်သည်။ ဒေသတွင်းတွင် ထပ်မံသင်ယူပါ (သို့) တိကျသောအမှတ်တံဆိပ်တောင်းဆိုပါ; ဝင်ရောက်မှုထိန်းချုပ်မှုကို ရှောင်ရှားရန် ပုဂ္ဂလိကလျှောက်လွှာဒေတာများကို အများပြည်သူ metadata ကွင်းထဲကို မပြောင်းပါနဲ့။
- ပုဂ္ဂလိက သော့တွေ၊ ကြမ်းတမ်းတဲ့ ကိုယ်ရေးကိုယ်တာ အထောက်အထားတွေ၊ ဝင်ရောက်မှု အမှတ်တံဆိပ်တွေ (သို့) စာရွက်စာတမ်းကြီးတွေကို metadata ထဲမှာ ဘယ်တော့မှ သိမ်းမထားပါ။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ချိတ်ဆက်ထားသော commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/queries/metadata.rs) တွင် metadata query ပေါင်းစပ်မှု စမ်းသပ်မှုများ
- [Python SDK ငွေပေးချေမှု တည်ဆောက်သူများ ပိတ်ပင်ထားသော ကန့်သတ်ချက်](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/README.md)
- [metadata](/my/blockchain/metadata.md)
- [metadata နှင့် ledger storage ရွေးချယ်မှုများ ](/my/guide/configure/metadata-and-store-assets.md)
- [ညွှန်ကြားချက် ကိုးကားချက် ](/my/reference/instructions.md)
- [ခွင့်ပြုချက် လက်မှတ်များ ](/my/reference/permissions.md)
