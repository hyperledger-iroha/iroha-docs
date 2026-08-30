---
translation_locale: my
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 429535e5bb4ad1d3110f29a5b3896c0d3ce39264dbd357fa932fcc2a5f48d0f1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# အကောင့်များနှင့် အမည်မဖော်လိုသူများ {#accounts-and-aliases}

## ရလဒ် {#outcome}

Domainless canonical နဲ့ လုံခြုံစွာ အလုပ်လုပ်ပါ။ I105 အကောင့် IDs ပြီးတော့ လူသားတွေ ဖတ်လို့ရတဲ့ အမည်မဖော်လိုတဲ့ သီးခြား ချိတ်ဆက်ထားတဲ့ `treasury@payments.universal`. သင်က စစ်ဆေးမယ်။ Taira သင့်ရဲ့ကိုယ်ပိုင် Canonical ကိုရယူ ID, Routing context ကို Identity နဲ့ မရှုပ်ထွေးဘဲ aliases တွေကို ဖြေရှင်းပေးပါ။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Python 3.11 သို့မဟုတ်နောက်ဆုံး၊ current `iroha` CLI။
- [ကနေ `taira.client.toml` သင့်ကိုယ်ပိုင်စာရင်းကို စစ်ဆေးတဲ့အခါ Taira ](./connect-to-taira.md) သို့ ဆက်သွယ်ပါ။
- Taira faucet (သို့) ကွန်ရက်ရဲ့ စည်းကမ်းထားတဲ့ Onboarding Path မှတစ်ဆင့် ရင်းနှီးမြှုပ်နှံထားသော အကောင့်တစ်ခုမှာ အကောင့်ဆိုင်ရာ ဖတ်ရှုမှု အောင်မြင်လိမ့်မယ်လို့ မျှော်လင့်မထားခင်မှာပါ။

## ခြေလှမ်း {#steps}

### (၁) Taira တွင် တရားဝင်စာရင်းများကို စစ်ဆေးပါ။ {#_1-inspect-canonical-accounts-on-taira}

ပြည်သူ့စာရင်းစာရင်းမှာ အမြဲတမ်း Canonical I105 IDs ကိုပြန်ပို့တယ်။ အဓိက အမည်မဖော်လိုဘဲ သီးခြားတင်ပြပါတယ်။

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

ID ကနေ `.id` သည်တင်းကျပ်သောစာရင်းကွင်းများအတွက်အတည်ပြုသည်။ ၎င်းသို့ဒိုမင်တစ်ခု မထည့်ပါနဲ့။ `.primary_alias` မှအမည်မဖော်လိုသည်မှာအသုံးပြုသူမျက်နှာလိုက်ရှာဖွေရေးခလုတ်ဖြစ်ပြီး အခြားသမရိုးကျကိုယ်စားလှယ်မဟုတ်ပါ။

### (၂) သင့် Taira I105 ID ကို ရယူပြီး ပုံမှန်ပြုပြင်ပါ။ {#_2-derive-and-normalize-your-taira-i105-id}

Local Configuration မှ Public Key ကိုသာဖတ်ပါ။ တူညီသော public key ကို public network profile အမျိုးမျိုးအတွက် မတူညီစွာ encoded လုပ်ထားပြီး `taira` ကို တိကျစွာရွေးပါ။

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

### (၄) အကောင့်နဲ့ ချိတ်ဆက်ထားတဲ့ အမည်မဖော်လိုသူတွေကို ရှာပါ။ {#_4-look-up-aliases-bound-to-the-account}

Reverse Resolver သည် တိကျသော Canonical Account ID တစ်ခုကိုလက်ခံသည်။ အများပြည်သူ Dataspace အတန်းများကို request-signature ခေါင်းစဉ်များမပါဘဲဖတ်ရှုနိုင်ပါသည်။ ကန့်သတ်ထားသော Database များတွင် Authorized Signed request ကိုလိုအပ်သည်.

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

`total: 0` သည်အတည်ရှိသည်: အကောင့်တစ်ခုအတွက် အမည်မဖော်လိုပါ။ ချုပ်ကိုင်မှုတစ်ခုရှိပါက ၎င်း၏ တိကျသော အရည်အသွေးပြည့်စုံတဲ့ အမည်မဖေါ်ထုတ်ပြီး ပြန်လည်ပေးပို့ထားသည့် အကောင့်ကို နှိုင်းယှဉ်ကြည့်ပါ ID

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

Taira faucet က တောင်းဆိုသူရဲ့ အကောင့်ကို ထောက်ပံ့နိုင်ပေမဲ့ ဒါကတော့ ယေဘုယျ အကောင့်မှတ်ပုံတင်ခွင့် (သို့) အမည်မဖော်လိုတဲ့ စီမံခန့်ခွဲမှု အာဏာကို မပေးပါဘူး။ အခြား အကောင့်တစ်ခုကို မှတ်ပုံတင်ဖို့ လုပ်ဆောင်နေတဲ့ validator အောက်မှာ `CanRegisterAccount` ကို လိုအပ်ပါတယ်။ Account aliases များအတွက်လည်း active SNS lease နှင့် သင့်လျော်သော alias ခွင့်ပြုချက်များလိုအပ်သည်။ စည်းကမ်းထားသည့် onboarding/alias planner ကိုအသုံးပြုပါ (သို့မဟုတ်) ဖန်တီးထားတဲ့ ဒေသတွင်းကွန်ရက်ကိုစစ်ဆေးရင်း မှတ်ပုံတင်ပါ။

:::

ဒေသတွင်းကွန်ရက်တစ်ခုမှာ လုံခြုံတဲ့ လက်မှတ်ရေးထိုးပေးခြင်း အဆင့်တစ်ခုကနေ Canonical `NEW_ACCOUNT_ID` အသစ်ကို တင်ပို့ပြီးတာနဲ့ မှတ်ပုံတင်မျက်နှာပြင်က:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

ကိုက်ညီတဲ့ ပုဂ္ဂလိက သော့ကို စာရွက်စာတမ်း (သို့) အက်ပလီကေးရှင်း မှတ်ပုံတင်အပြင်မှာ ဖန်တီးပြီး သိုလှောင်ပါ။ ID ကို မှတ်ပုံတင်ခြင်းအားဖြင့် Controller Key ပစ်ချထားသည်မှာ အသုံးပြုလို့မရသော Account တစ်ခုကို ဖန်တီးပေးသည်။

## စစ်ဆေးပါ {#verify}

အများသုံး သော့ကို ထိန်းချုပ်ထားတာကို သက်သေပြပါ။ I105 encoding နဲ့ alias တွေကို ပေါင်းစပ်ပြီး တစ်ခုတည်းသော canonical account ကို ချိတ်ဆက်ပေးတယ်။ ID:

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

IDs ကို သိမ်းဆည်းပါ။ လက်မှတ်၊ ခွင့်ပြုချက်များနှင့် ငွေပေးချေမှု ညွှန်ကြားချက်များအတွက် canonical IDs ကို အသုံးပြုပါ။ application နယ်နိမိတ်တွင် alias တစ်ခုကို ဖြေရှင်းပါ။ လုပ်ဆောင်ချက်အတွက်အသုံးပြုသော canonical account ID ကို ထိန်းသိမ်းပါ။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- Parse (သို့) prefix အမှားဆိုတာက ပုံမှန်အားဖြင့် အခြားကွန်ရက်ပရိုဖိုင်တစ်ခုအတွက်လိပ်စာကို ကုဒ်သွင်းထားတာကို ဆိုလိုတာပါ။ `--profile taira` နဲ့ ပုံမှန်ဖြစ်အောင်လုပ်ပြီး မညီမျှမှုကို ပယ်ချပါ။
- `202` faucet နောက်က အကောင့်တစ်ခု `404` က ပျံ့နှံ့မှု နှောင့်နှေးမှုဖြစ်နိုင်တယ်။ စာရင်းကို (သို့) ငွေကြေးထောက်ပံ့တဲ့ အရင်းအမြစ်ကို စာရိုက်ပို့မပေးခင် စစ်ဆေးပါ။
- `total: 0` Reverse Resolver ကနေ မြင်နိုင်တဲ့ alias ကို ချိတ်ဆက်မထားဘူးလို့ ဆိုလိုတာပါ။ ဒါက အကောင့်ရှာဖွေမှု ပျက်ကွက်ခြင်းမဟုတ်ဘူး။
- `401` သို့မဟုတ် `403` မှ အမည်မဖော်လိုသော လမ်းကြောင်းက ကန့်သတ်ထားသော ဒေတာနေရာသို့မဟုတ် မလုံလောက်သော တိကျတဲ့ အဖြေရှာခွင့်ကို ညွှန်ပြသည်။ ကျယ်ပြန့်တဲ့ ကြိုတင်စာရင်းရှာဖွေမှုကို နောက်ပြန်လမ်းအဖြစ်မသုံးပါ။
- စာဖတ်လို့ရတဲ့ `name@domain.dataspace` တန်ဖိုးကို Canonical I105 ID လိုတဲ့ နေရာတိုင်းမှာ လက်မခံဘူး။ ဒါကို အရင်ဆုံး ဖြေရှင်းပါ။
- ဒေသတွင်းအကောင့်မှတ်ပုံတင်မှု အောင်မြင်ပေမဲ့ Taira က ငြင်းပယ်ရင် ခြားနားချက်က ခွင့်ပြုချက်ပါ။ `CanRegisterAccount` ကိုရယူပါ၊ validation ကို ရှောင်ရှားဖို့ ID အကောင့်ကို မပြောင်းပါနဲ့။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ချိတ်ဆက်ထားသော commit ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs) တွင် Canonical account address အကောင်အထည်ဖော်ခြင်း
- [အကောင့်နှင့် အမည်မဖော်လိုသူ Torii ချိတ်ဆက်ထားသော commit တွင် စမ်းသပ်မှုများ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [ငွေစာရင်းများ](/my/blockchain/accounts.md)
- [ဒေတာပုံစံ အမည်အမည်များ ](/my/blockchain/data-model.md#aliases)
- [အမည်ပေးခြင်းဆိုင်ရာ ညီလာခံများ](/my/reference/naming.md)
- [ခွင့်ပြုချက် လက်မှတ်များ ](/my/reference/permissions.md)
