---
translation_locale: my
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# အကောင့်များနှင့် Alias များ {#accounts-and-aliases}

## ရလဒ် {#outcome}

Domainless Single Protocol-Standard I105 အကောင့် ID များနှင့် သီးခြား ချိတ်ဆက်ထားသော လူသားဖတ်လို့ရတဲ့ aliases များ၊ ဥပမာ `treasury@payments.universal` နှင့်အတူ လုံခြုံစွာ အလုပ်လုပ်ပါ။ သင်သည် Taira အကောင့်များကို စစ်ဆေးနိုင်ပြီး ကိုယ်ပိုင် single protocol-Standard ID ကို ရယူနိုင်ကာ Routing အခြေအနေကို Identity နဲ့ မရှုပ်ထွေးဘဲ aliases တွေကို ဖြေရှင်းနိုင်သည်။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Python 3.11 သို့မဟုတ်နောက်ဆုံး၊ current `iroha` CLI။
- သင့်ကိုယ်ပိုင်စာရင်းကို စစ်ဆေးတဲ့အခါ `taira.client.toml` မှ [Taira သို့ ချိတ်ဆက်ပါ။](./connect-to-taira.md) ကို။
- Taira testnet ဘဏ္ဍာရေး ဝန်ဆောင်မှု (သို့) ကွန်ရက်ရဲ့ စည်းကမ်းထားတဲ့ Onboarding Path မှတစ်ဆင့် အကောင်အထည်ဖော်ထားပြီး Account Specific Reading အောင်မြင်မယ်လို့ မျှော်လင့်မထားသေးတဲ့ စာရင်းတစ်ခုပါ။

## ခြေလှမ်း {#steps}

### (၁) Taira တွင် Single Protocol Standard Account များကို စစ်ဆေးပါ။ {#_1-inspect-canonical-accounts-on-taira}

အများသုံးအကောင့်စာရင်းမှာ အမြဲတမ်း Single Protocol-Standard I105 ID တွေကို ပြန်ပို့တယ်။ အဓိက အခြားအမည်လိုဘဲ သီးခြားပြန်ကြားပေးပါတယ်။

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

`.id` မှ ID သည်ကြမ်းတမ်းသောစာရင်းကွင်းများအတွက်အတည်ပြုသည်။ domain ကိုမထည့်ပါနဲ့။ `.primary_alias` မှ alias သည်အသုံးပြုသူမျက်နှာစာရှာဖွေရေး key ဖြစ်သည်၊ အခြား single protocol-standard identity တစ်ခုမဟုတ်ပါ။

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

ပုံမှန်တန်ဖိုးသည် `TAIRA_ACCOUNT_ID` နှင့်တူသင့်သည်။ TOML ဖိုင်တွင်ရှိသော `[account].domain` သတ်မှတ်ချက်သည် `wonderland.universal` ဖြစ်နိုင်သော်လည်း ထိုတန်ဖိုးသည် လမ်းညွှန်ခြင်းနှင့် alias အခြေအနေကိုသာ သက်ရောက်သည်။

### (၃) ငွေစာရင်းနှင့် ငွေကြေးကို ဖတ်ရှုပါ။ {#_3-read-the-account-and-its-assets}

Account ကို provision လုပ်ပြီးနောက် တိုက်ရိုက် query လုပ်ပြီး bounded asset page တစ်ခုကို list လုပ်ပါ။ URL - path တစ်ခုမှာ အသုံးပြုမည့် I105 တန်ဖိုးကို encode လုပ်ပါ။

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
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

Taira testnet ငွေကြေးထောက်ပံ့မှု ဝန်ဆောင်မှုသည် လျှောက်ထားသူ၏ အကောင့်ကို ထောက်ပံ့နိုင်သော်လည်း ယင်းက ယေဘုယျ အကောင့်မှတ်ပုံတင်ခြင်း သို့မဟုတ် အခြားအမည် စီမံခန့်ခွဲမှု ခွင့်ပြုချက် မူလစာရင်းကို မပေးပါ။ အခြား အကောင့်တစ်ခုကို မှတ်ပုံတင်ရန်အတွက် တက်ကြွသည့် validator တွင် `CanRegisterAccount` ကိုလိုအပ်သည်။ Account aliases များအတွက်လည်း active SNS lease နှင့် သင့်လျော်သော alias ခွင့်ပြုချက်များလိုအပ်သည်။ စည်းကမ်းထားသည့် onboarding/alias planner ကိုအသုံးပြုပါ (သို့မဟုတ်) ဖန်တီးထားတဲ့ ဒေသတွင်းကွန်ရက်ကိုစစ်ဆေးရင်း မှတ်ပုံတင်ပါ။

:::

ဒေသတွင်းကွန်ရက်တစ်ခုတွင် လုံခြုံသော cryptographic signing-key provisioning step တစ်ခုသည် Single Protocol-standard `NEW_ACCOUNT_ID` အသစ်ကို တင်ပို့ပြီးနောက်မှာ မှတ်ပုံတင်မျက်နှာပြင်သည်:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
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

- [ချိတ်ဆက်ထားသော source code revision တွင် single protocol standard account address အကောင်အထည်ဖော်ခြင်း](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှုမှာ Account နဲ့ alias Torii စမ်းသပ်မှုတွေ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [အကောင့်များ](/my/blockchain/accounts.md)
- [ဒေတာမော်ဒယ်အမည်များ](/my/blockchain/data-model.md#aliases)
- [နာမည်ပေးသော ညီလာခံများ](/my/reference/naming.md)
- [ခွင့်ပြုချက် လက်မှတ်များ](/my/reference/permissions.md)
