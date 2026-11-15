---
translation_locale: my
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: e500328ac93578b9af21b6ef3d01e13e051b1d9a0f6050293e65650da66fbbbb
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5+reviewed-supplemental-naming-link
---
# အကောင့်များနှင့် Alias များ {#accounts-and-aliases}

## ရလဒ် {#outcome}

Domain မပါသော စံ I105 အကောင့် ID များနှင့် သီးခြားချည်နှောင်ထားသော `treasury@payments.universal` ကဲ့သို့ လူဖတ်လွယ် alias များကို ဘေးကင်းစွာ အသုံးပြုပါ။ Taira အကောင့်များကို စစ်ဆေးခြင်း၊ မိမိ၏ စံ ID ကို ဆင်းသက်တွက်ချက်ခြင်းနှင့် လမ်းကြောင်းရွေးချယ်မှု context ကို အထောက်အထားနှင့် မရောထွေးဘဲ alias များ ဖြေရှင်းခြင်းတို့ကို လုပ်ဆောင်မည်။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Python 3.11 သို့မဟုတ်နောက်ဆုံး၊ current `iroha` CLI။
- သင့်ကိုယ်ပိုင်စာရင်းကို စစ်ဆေးတဲ့အခါ `taira.client.toml` မှ [Taira သို့ ချိတ်ဆက်ပါ။](./connect-to-taira.md) ကို။
- Taira testnet ဘဏ္ဍာရေး ဝန်ဆောင်မှု (သို့) ကွန်ရက်ရဲ့ စည်းကမ်းထားတဲ့ Onboarding Path မှတစ်ဆင့် အကောင်အထည်ဖော်ထားပြီး Account Specific Reading အောင်မြင်မယ်လို့ မျှော်လင့်မထားသေးတဲ့ စာရင်းတစ်ခုပါ။

## ခြေလှမ်း {#steps}

### (၁) Taira တွင် Single Protocol Standard Account များကို စစ်ဆေးပါ။ {#_1-inspect-canonical-accounts-on-taira}

အများသုံး အကောင့်စာရင်းသည် canonical I105 ID များကို အမြဲ ပြန်ပေးသည်။ primary alias သည် ရွေးချယ်နိုင်သော အရာဖြစ်သည်။ ၎င်းကို ကြည့်ရန် `aliases` field ကို တောင်းဆိုပါ။

```bash
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/accounts \
  --data-urlencode 'limit=5' \
  --data-urlencode 'select=id,aliases' \
  | jq -r '.items[]
    | [.id, (first(.aliases[]? | select(.is_primary) | .alias) // "-")]
    | @tsv'
```

`.id` မှ ရသော ID သည် တိကျသော အကောင့်အမျိုးအစား လိုအပ်သည့် field များတွင် မှန်ကန်စွာ သုံးနိုင်သည်။ ၎င်းနောက်တွင် domain မထည့်ပါနှင့်။ `.aliases[].alias` မှ alias သည် အသုံးပြုသူအတွက် ရှာဖွေရေးကီးဖြစ်ပြီး အခြားစံအထောက်အထားတစ်ခု မဟုတ်ပါ။

### (၂) သင့်ရဲ့ Taira I105 ID ကို ရယူပြီး ပုံမှန်ပြုပြင်ပါ။ {#_2-derive-and-normalize-your-taira-i105-id}

ဒေသတွင်း ဖွဲ့စည်းမှုမှ အများသုံး သော့ကိုသာ ဖတ်ပါ။ တူညီသော အများသုံး သုတ်ချက်သည် အများသုံး blockchain ကွန်ရက် ပရိုဖိုင်အမျိုးမျိုးအတွက် မတူကွဲပြားစွာ ကုဒ်သွင်းထားသည်။ ထို့ကြောင့် `taira` ကို ရှင်းလင်းစွာရွေးချယ်ပါ။

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

normalize လုပ်ထားသော တန်ဖိုးသည် `TAIRA_ACCOUNT_ID` နှင့် တူညီသင့်သည်။ `[account].profile` သတ်မှတ်ချက်သည် I105 network prefix ကိုသာ ရွေးချယ်သည်။ ဒိုမင်များသည် alias များနှင့်သာ သက်ဆိုင်ပြီး အကောင့် ID နှင့် ဘယ်သောအခါမျှ မသက်ဆိုင်ပါ။

### (၃) ငွေစာရင်းနှင့် ငွေကြေးကို ဖတ်ရှုပါ။ {#_3-read-the-account-and-its-assets}

Account ကို provision လုပ်ပြီးနောက် တိုက်ရိုက် query လုပ်ပြီး bounded asset page တစ်ခုကို list လုပ်ပါ။ URL - path တစ်ခုမှာ အသုံးပြုမည့် I105 တန်ဖိုးကို encode လုပ်ပါ။

```bash
iroha --config ./taira.client.toml account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10&include_total=true" \
  | jq '{total, items}'
```

### 4. အကောင့်နှင့် ချိတ်ထားသော Alias များကို ရှာဖွေပါ {#_4-look-up-aliases-bound-to-the-account}

Reverse Resolver သည် ပရိုတိုကောတစ်ခုတည်းသော စံစံညွှန်းစာရင်း ID ကိုလက်ခံသည်။ အများပြည်သူ ဒေတာစေးတန်းများကို request-signature ခေါင်းစဉ်များမပါဘဲဖတ်ရှုနိုင်ပါသည်။ ကန့်သတ်ထားသောဒေတာစေးများသည် ခွင့်ပြုချက်ဖြင့် လက်မှတ်ထိုးထားသောတောင်းဆိုမှုလိုအပ်သည်။

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` သည် မှန်ကန်သောရလဒ်ဖြစ်သည်။ အကောင့်တစ်ခုတွင် alias မရှိလည်း ရသည်။ ချိတ်ဆက်မှုရှိပါက ၎င်း၏ အပြည့်အစုံသတ်မှတ်ထားသော alias အတိအကျကို ဖြေရှင်းရှာဖွေပြီး ပြန်ရလာသော အကောင့် ID ကို နှိုင်းယှဉ်ပါ -

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning ခွင့်ပြုချက် ကန့်သတ်ချက်

Taira faucet သည် ၎င်း၏ တောင်းဆိုသူအကောင့်ကို ပြင်ဆင်ပေးနိုင်သော်လည်း ၎င်းသည် ယေဘုယျ အကောင့်မှတ်ပုံတင်ခြင်း သို့မဟုတ် alias စီမံခန့်ခွဲမှုဆိုင်ရာ authority ကို ခွင့်ပြုချက်ပေးအပ်ခြင်း မဟုတ်ပါ။ အခြားအကောင့်တစ်ခုကို မှတ်ပုံတင်ရန် အသက်ဝင်နေသော executor အောက်တွင် `CanRegisterAccount` လိုအပ်သည်။ အကောင့် alias များအတွက် ပုံမှန်အားဖြင့် အသက်ဝင်နေသော SNS lease နှင့် သင့်လျော်သော alias ခွင့်ပြုချက်များလည်း လိုအပ်သည်။ governance ဖြင့် ထိန်းချုပ်ထားသော onboarding/alias planner ကို အသုံးပြုပါ၊ သို့မဟုတ် ဖန်တီးထားသော ဒေသတွင်းကွန်ရက်ပေါ်တွင် မှတ်ပုံတင်ခြင်းကို အစမ်းလေ့ကျင့်ပါ။

:::

ဒေသတွင်း ကွန်ရက်တွင် လုံခြုံသော လက်မှတ်ထိုးသူ ပြင်ဆင်ပေးသည့် အဆင့်က စံ `NEW_ACCOUNT_ID` အသစ်ကို ထုတ်ပေးပြီးလျှင် အောက်ပါအတိုင်း မှတ်ပုံတင်နိုင်သည်။

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml account get \
  --id "$NEW_ACCOUNT_ID"
```

ကိုက်ညီသော ကိုယ်ပိုင်ကီးကို ထုတ်လုပ်၍ စာတမ်း သို့မဟုတ် အက်ပ် repository အပြင်တွင် သိမ်းပါ။ ထိန်းချုပ်သူကီးကို စွန့်ပစ်ပြီးသော ID ကို မှတ်ပုံတင်ခြင်းက အသုံးမပြုနိုင်သော အကောင့်ကို ဖန်တီးမိစေသည်။

## စစ်ဆေးပါ {#verify}

ပြင်ဆင်သတ်မှတ်မှုထဲရှိ အများသုံးကီး၊ I105 encoding နှင့် alias ချိတ်ဆက်မှုအားလုံးက စံအကောင့် ID တစ်ခုတည်းသို့ ဦးတည်ကြောင်း သက်သေပြပါ -

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

Single protocol-standard account ID များကို သိမ်းဆည်းပါ။ လက်မှတ်၊ ခွင့်ပြုချက်များနှင့် ငွေကြေးဆိုင်ရာ ညွှန်ကြားချက်များအတွက် single protocol-standard ID များကို အသုံးပြုပါ။ application နယ်နိမိတ်တွင် alias ကို ဖြေရှင်းပါ။ လုပ်ဆောင်မှုအတွက်အသုံးပြုသည့် single protocol-standard account ID ကို ထိန်းသိမ်းပါ။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- Parse (သို့) prefix အမှားဆိုတာက ပုံမှန်အားဖြင့် အခြားကွန်ရက်ပရိုဖိုင်တစ်ခုအတွက်လိပ်စာကို ကုဒ်သွင်းထားတာကို ဆိုလိုတာပါ။ `--profile taira` နဲ့ ပုံမှန်ဖြစ်အောင်လုပ်ပြီး မညီမျှမှုကို ပယ်ချပါ။
- စာရင်း `404` ကို testnet ငွေကြေးထောက်ပံ့မှု ဝန်ဆောင်မှု `202` နောက်ပိုင်းမှာ ပျံ့နှံ့ခြင်း နှောင့်နှေးနိုင်သည်။ စာရင်း (သို့မဟုတ်) ထောက်ပံ့သော အရင်းအမြစ်ကို စာရင်းမပို့မီတွင် စစ်ဆေးပါ။
- `total: 0` Reverse Resolver ကနေ မြင်နိုင်တဲ့ alias ကို ချိတ်ဆက်မထားဘူးလို့ ဆိုလိုတာပါ။ ဒါက အကောင့်ရှာဖွေမှု ပျက်ကွက်ခြင်းမဟုတ်ဘူး။
- Alias လမ်းကြောင်းမှ `401` သို့မဟုတ် `403` ပြန်လာခြင်းသည် ကန့်သတ်ထားသော data space သို့မဟုတ် အတိအကျဖြေရှင်းရှာဖွေခွင့် မလုံလောက်ခြင်းကို ညွှန်သည်။ အစားထိုးနည်းအဖြစ် ကျယ်ပြန့်သော ရှေ့ဆက်အမည်ရှာဖွေမှုကို မသုံးပါနှင့်။
- စာဖတ်လို့ရတဲ့ `name@domain.dataspace` တန်ဖိုးကို ဘယ်နေရာမဆို လက်ခံမထားနိုင်ပါ။ တစ်ခုတည်းသော ပရိုတိုကောစံညွှန်း ID I105 ကို လိုအပ်ပါတယ်။ ဒါကို အရင်ဆုံး ဖြေရှင်းလိုက်ပါ။
- ဒေသတွင်းစာရင်းမှတ်ပုံတင်မှု အောင်မြင်ပေမဲ့ Taira က ငြင်းပယ်ရင် ခြားနားချက်က ခွင့်ပြုချက်ပါ။ `CanRegisterAccount` ကိုရယူပါ၊ အကောင့် ID ကို validation ကို ရှောင်ရှားဖို့ မပြောင်းပါနဲ့။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ချိတ်ဆက်ထားသော source code revision တွင် single protocol standard account address အကောင်အထည်ဖော်ခြင်း](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/account/address.rs)
- ပုံသေသတ်မှတ်ထားသော commit ရှိ [အကောင့် endpoint Torii smoke စမ်းသပ်မှုများ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/tests/accounts_endpoints.rs) နှင့် [alias route စမ်းသပ်မှုများ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/tests/lib_tests/part_2.rs)
- [အကောင့်များ](/my/blockchain/accounts.md)
- [ဒေတာမော်ဒယ်အမည်များ](/my/blockchain/data-model.md#aliases)
- [နာမည်ပေးသော ညီလာခံများ](/my/reference/naming.md)
- [ခွင့်ပြုချက် လက်မှတ်များ](/my/reference/permissions.md)
