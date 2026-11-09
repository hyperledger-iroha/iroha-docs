---
translation_locale: my
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# မီတာဒေတာ {#metadata}

## ရလဒ် {#outcome}

Taira တွင် metadata ကိုဖတ်ရှု၊ ငွေကြေးပေးချေမှု Transaction တစ်ခုဖြင့် အကောင့်တစ်ခု၏ metadata တန်ဖိုးကိုသတ်မှတ်ပြီး စစ်ဆေးပြီး တန်ဖိုးကို ထပ်မံဖယ်ရှားပါ။ သင်သည် blockchain ledger object metadata များကို transaction fee metadata တို့မှ သီးခြားထားလိမ့်မည်။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Python 3.11 သို့မဟုတ်နောက်ဆုံး၊ current `iroha` CLI။
- ငွေကြေးထောက်ပံ့မှု `taira.client.toml` နှင့် `taira.tx-metadata.json` မှ [ချိတ်ဆက် Taira](./connect-to-taira.md).
- target account ရဲ့ metadata တွေထက် authorization principal ကို ပစ်မှတ်ထားတာပါ။ ဥပမာက configured authorization principle ကိုပဲ ပစ်မှတ် ထားတယ်။ အခြားအကောင့်တစ်ခုမှာ တိကျတဲ့ ခွင့်ပြုချက် လိုအပ်ပါတယ်။

## ခြေလှမ်း {#steps}

### (၁) လျှို့ဝှက်လက်မှတ်မတပ်ဘဲ metadata ကိုဖတ်ပါ။ {#_1-read-metadata-without-a-signer}

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

အသေးစား သရုပ်ဖော်ရေး (သို့) ညွှန်းကိန်းတင်တဲ့ ကွင်းများအတွက် metadata ကိုအသုံးပြုပါ။ ကြီးမားသော အသုံးဝင်မှုများကို blockchain ledger အပြင်မှာထည့်ပြီး URI သို့မဟုတ် SoraFS ရည်ညွှန်းချက်အဖြစ် cryptographic digest value ကို သိမ်းဆည်းပါ။

### (၂) ရည်မှန်းချက်စာရင်းကို ထုတ်ယူပါ။ {#_2-derive-the-target-account}

Taira ပြင်ဆင်သတ်မှတ်မှုမှ အများသုံးကီးကိုသာ ဖတ်ပြီး domain မပါသော စံ I105 ပုံစံသို့ ပြောင်းပါ။

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

JSON ကို Standard input ကနေ ဖတ်ပြီး Account ရဲ့ `cookbook_profile` တန်ဖိုး ဖြစ်လာပါတယ်။ ဒီအစား `--metadata ./taira.tx-metadata.json` ဟာ ငွေကြေးဒေတာ ကွန်တိန်နာကို အခွန်နယ်ပယ်တွေကို ချိတ်ဆက်ပေးတယ်။ မြေပုံနှစ်ခုမှာ မတူညီတဲ့ ရည်မှန်းချက်တွေနဲ့ ရည်ရွယ်ချက်တွေ ရှိပါတယ်။

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

အရာဝတ္ထုတစ်ခုစီကို မည်သူပြောင်းလဲနိုင်သည်ကို လက်ရှိ အတည်ပြုသူက ဆုံးဖြတ်သည်။ အခြားအကောင့်တစ်ခုကို ပြင်ဆင်ရန် ပုံမှန်အားဖြင့် `CanModifyAccountMetadata` လိုသည်။ ဒိုမိန်း၊ ပိုင်ဆိုင်မှုသတ်မှတ်ချက်၊ NFTs နှင့် အလိုအလျောက် လုပ်ဆောင်ချက်တို့တွင် သက်ဆိုင်ရာပစ်မှတ်အလိုက် မက်တာဒေတာ ခွင့်ပြုချက်များရှိသည်။ Taira က လိုအပ်သည့် လုပ်ပိုင်ခွင့်ကို မပေးထားပါက `./localnet/client.toml` ဖြင့် တူညီသော အကောင့်အမိန့်များကို လုပ်ဆောင်ပါ။ စက်တွင်းကွန်ရက်အတွက် ဖန်တီးထားသော လုပ်ပိုင်ခွင့်ရှိသူ၏ စံ I105 ID ကို အစားထိုး၍ Taira အခကြေးငွေဆိုင်ရာ မက်တာဒေတာဖိုင်ကို ချန်ထားပါ။ စက်တွင်း အခကြေးငွေပေးသူကို အတိအကျ ရွေးချယ်ထားမှုကို ဆက်ထားပါ။

:::

### (၄) သော့ကို ဖယ်ရှားပါ။ {#_4-remove-the-key}

နောက်ဆုံးသတ်မှတ်ထားတဲ့ တန်ဖိုးကို အရင်ဖတ်ပြီး နောက်မှာ သီးခြား ဖယ်ရှားမှု ငွေပေးချေမှုကို ပေးသွင်းပါ။

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

Python လျှောက်လွှာများအတွက် ကိုက်ညီသော ရိုက်နှိပ်ထားသည့် ဆောက်လုပ်သူများသည် `Instruction.set_account_key_value` နှင့် `Instruction.remove_account_key_value` ဖြစ်ပြီး ၎င်းတို့အား ငွေပေးချေမှု မီတာဒေတာနှင့်အတူ တင်ပြ၍ [Python သင်ခန်းစာ](/my/guide/tutorials/python.md#shared-setup) မှ စောင့်ဆိုင်းရေး အကူအညီ ပေးပို့ပါ။

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

အကောင့်ကို သီးခြားဖတ်ခြင်းဖြင့် metadata ကီး မရှိခြင်းနှင့် ကွန်ရက် သို့မဟုတ် အကောင့်ပြဿနာကို ခွဲခြားနိုင်သည်။ Production ကုဒ်သည် တန်ဖိုးသတ်မှတ်ပြီးနောက် JSON တန်ဖိုးတစ်ခုလုံးကိုလည်း စစ်ဆေးသင့်သည်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- စံအဝင်ဒေတာတွင် မှန်ကန်သော JSON တန်ဖိုးတစ်ခု ပါရမည်။ စာသားများတွင် JSON quotation အမှတ်များ လိုအပ်ပြီး object နှင့် array များ၏ ဖွဲ့စည်းပုံ မှန်ကန်ရမည်။
- Metadata ကီးများသည် `Name` တန်ဖိုးများဖြစ်ပြီး parse လုပ်ပြီးနောက် အကြီးအသေး စာလုံးကွဲပြားမှုကို ခွဲခြားသည်။ Schema ပြောင်းတိုင်း ဗားရှင်းပါသော ကီးအသစ်ဖန်တီးမည့်အစား တည်ငြိမ်သော ကီးအမည်အစုကို ထိန်းသိမ်းပါ။
- `--metadata` သည် transaction metadata ဖြစ်သည်။ ၎င်းသည် blockchain ledger object metadata ကိုမသတ်မှတ်ပါ။ နောက်တစ်ခုအတွက် entity ၏ `meta set` subcommand ကိုအသုံးပြုပါ။
- တင်သွင်းမှုအောင်မြင်ပြီးနောက် ဖတ်ရလဒ်ဟောင်း ရနေခြင်းသည် ဖြန့်ဝေမှုကြန့်ကြာခြင်း ဖြစ်နိုင်သည်။ ပြန်မတင်သွင်းမီ Applied အပြီးသတ်အတည်ဖြစ်မှုကို စောင့်ပြီး query ကို ပြန်စမ်းပါ။
- ခွင့်ပြုချက် ပယ်ချခြင်းသည် ရည်မှန်းထားသော အရာဝတ္ထုနှင့် ခွင့်ပြုမှု အဓိက နယ်နိမိတ်ကို ဖော်ထုတ်သည်။ ဒေသတွင်းတွင် ထပ်မံသင်ခန်းစာလုပ်ပါ (သို့) တိကျသောအမှတ်တံဆိပ်တောင်းဆိုပါ; ဝင်ရောက်ထိန်းချုပ်ခြင်းကိုရှောင်ရှားရန် ပုဂ္ဂလိကလျှောက်လွှာဒေတာများကို အများပြည်သူ metadata ကွင်းထဲကို မပြောင်းပါနဲ့။
- ပုဂ္ဂလိက သော့တွေ၊ ကြမ်းတမ်းတဲ့ ကိုယ်ရေးကိုယ်တာ အထောက်အထားတွေ၊ ဝင်ရောက်မှု အမှတ်တံဆိပ်တွေ (သို့) စာရွက်စာတမ်းကြီးတွေကို metadata ထဲမှာ ဘယ်တော့မှ သိမ်းမထားပါနဲ့။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ပိတ်ထားသော source code revision တွင် metadata query ပေါင်းစပ်မှု စမ်းသပ်မှုများ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK ရင်းမြစ်ကုဒ် ပြင်ဆင်မှုအတွက် ငွေကြေးပံ့ပိုးရေးလုပ်ငန်းရှင်များ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [မီတာဒေတာ](/my/blockchain/metadata.md)
- [Metadata နှင့် blockchain ledger ကို သိုလှောင်ရန် ရွေးချယ်မှုများ](/my/guide/configure/metadata-and-store-assets.md)
- [ညွှန်ကြားချက် ကိုးကားချက်](/my/reference/instructions.md)
- [ခွင့်ပြုချက် လက်မှတ်များ](/my/reference/permissions.md)
