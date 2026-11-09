---
translation_locale: my
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ငွေကြေးအထောက်အပံ့များ {#fungible-assets}

## ရလဒ် {#outcome}

Taira အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်များကို တိုက်ရိုက်စစ်ဆေးပြီး ထုတ်လုပ်သော ဒေသတွင်းကွန်ရက်တစ်ခုတွင် မှတ်ပုံတင်၊ ထုတ်လွှင့်ခြင်း၊ လွှဲပြောင်းခြင်း၊ ဖျက်ဆီးခြင်းနှင့် ငွေကြေးပမာဏ စစ်ဆေးမှု စီးဆင်းမှုကို ပြီးစီးစေရန်။ အဆိုပါချက်ပြနည်းမှာ Single Protocol-Standard unprefixed Base58 Asset Definition IDs များ၊ Domain-qualified aliases များ၊ domainless I105 Account ID များနှင့် explicit fee payment များကို အသုံးပြုသည်။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Python ၃.၁၁ သို့မဟုတ် နောက်ပိုင်း၊ Node.js (၂၄) ၊ current `iroha` CLI.
- ဖတ်လို့သာရတဲ့ Taira ဝင်ခွင့်။
- write walkthrough အတွက် ဒေသတွင်းကွန်ရက်တစ်ခုမှ ဖန်တီးထားသော [လွှတ်တင်ခြင်း Iroha](/my/get-started/launch-iroha.md), နှင့်အတူ `./localnet/client.toml` နှင့် Torii အပေါ် `http://127.0.0.1:8080`.

## ခြေလှမ်း {#steps}

### 1. Taira အဓိပ္ပါယ်ဖွင့်ဆိုချက်များကို cryptographic signer မပါဘဲ စစ်ဆေးပါ။ {#_1-inspect-taira-definitions-without-a-signer}

အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်များတွင် ပွင့်လင်းမြင်သာမှုမရှိသော Base58 ID၊ ပြသနာအမည်၊ အရင်းအမြတ်ထုတ်လွှင့်ခြင်း မူဝါဒမူဝါဒ၊ ကိန်းဂဏန်းကျယ်ပြန့်မှု၊ ရွေးချယ်စရာ alias များ၊ ပိုင်ရှင်များနှင့် စုစုပေါင်းအရေအတွက်တို့ ပါဝင်သည်။ တိကျသည့်စာရင်းတွင် ၎င်း၏ပိုင်ရှင်စာရင်းနှင့် ရွေးချယ်စရာ ဒေတာနေရာကဏ္ဍကဏ္ဍလည်းပါဝင်သည်။

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

JavaScript ပုံစံကို `node taira-assets.mjs` ဖြင့် လုပ်ဆောင်ပါ။ အများသုံး ပိုင်ဆိုင်မှု ID များသည် Base58 တန်ဖိုးသက်သက် ဖြစ်သည်။ `cookbook_credit#wonderland.universal` ကဲ့သို့ ဖတ်ရှုရလွယ်သော တန်ဖိုးသည် ထို ID များထဲမှ တစ်ခုသို့ ဖြေရှင်းပေးသော alias ဖြစ်သည်။

### (၂) ဒေသဆိုင်ရာ ခွင့်ပြုချက် အရေအတွက်နှင့် ရည်ရွယ်ချက် ပြင်ဆင်ပါ။ {#_2-prepare-the-local-authority-and-destination}

ဖန်တီးထားသည့် သတ်မှတ်ချက်ဖိုင်ရှိ အများသုံးသော့မှ စက်တွင်း လုပ်ပိုင်ခွင့်ရှိသူ၏ အမှတ်အသားကို တွက်ယူပြီး မှတ်ပုံတင်ပြီးသား အခြားအကောင့်တစ်ခုကို လက်ခံသူအဖြစ် ရွေးပါ။ ကိုယ်ပိုင်သော့ကို ဖော်ပြမည်မဟုတ်ပါ။

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### (၃) ကိန်းဂဏန်းဆိုင်ရာ အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကို မှတ်ပုံတင်ပါ။ {#_3-register-a-numeric-definition}

ဤဒေသတွင်းသာ ID သည်အတည်ပြုသည့် Base58 အရင်းအမြစ်အဓိပ္ပာယ်ဖွင့်ဆိုချက်လိပ်စာတစ်ခုဖြစ်သည်။ အခြားအမည်သည်လူဖတ်နိုင်သော `domain.dataspace` ခန့်မှန်းချက်ကိုပေးသည်။ Scale `2` ကဖွဲကိန်းနှစ်ခုကိုခွင့်ပြုသည်။ `--mint-once` ကိုပယ်ဖျက်ခြင်းအားဖြင့် default `Infinitely` မူဝါဒကိုထိန်းသိမ်းထားပါသည်။

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

Taira မှာ ဒီ ID ကို ပြန်မသုံးပါနဲ့။ အများပြည်သူ blockchain ကွန်ရက် မှတ်ပုံတင်က ပရိုတိုကော စံတစ်ခုတည်းသော ID အသစ်တစ်ခု၊ သင့်အက်ပလီကေးရှင်းအတွက် သတ်မှတ်ထားတဲ့ Domain / alias တစ်ခု၊ အခွန်ထောက်ပံ့မှု၊ ဆော့ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင်ရဲ့ အရင်းအမြစ် မှတ်ပုံတင် ခွင့်ပြုချက် လိုအပ်တယ်။

### (၄) ထုတ်ပေးခြင်း၊ လွှဲပြောင်းခြင်းနှင့် ဖျက်ဆီးခြင်း {#_4-mint-transfer-and-burn}

ရေးသားမှု command အားလုံးက authority အကောင့်ကို အခကြေးငွေပေးသူအဖြစ် အတိအကျ ရွေးသည်။ CLI သည် လက်မှတ်မထိုးမီ transaction အတိအကျ၏ အခကြေးငွေ quote ကို ရယူပြီး မူလအတိုင်းဆိုလျှင် ရလဒ်ကို စောင့်သည်။

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

ဖျက်ဆီးပြီးနောက် source balance `64.50` ၊ destination balance `25.50` နဲ့ total quantity `90.00` ကိုမျှော်လင့်ပါ။

::: warning ခွင့်ပြုချက် ကန့်သတ်ချက်

Taira တွင် faucet-derived `taira.tx-metadata.json` ကိုထည့်ပြီး စာရေးတိုင်းအတွက် `--fee-payer authority` ကိုအသုံးပြုပါ။ မှတ်ပုံတင်ခြင်းနှင့်ထုတ်ပေးခြင်းသည် တက်ကြွသော validator ၏ ခွင့်ပြုချက်များကိုလိုအပ်သည်။ လွှဲပြောင်းခြင်းနှင့်ဖျက်သိမ်းခြင်းသည် အရင်းအမြစ်လက်ကျန်ထက်က ခွင့်ပြုမှုဦးရေကိုလိုအပ်သည်။ testnet မှထောက်ပံ့ထားသောစာရင်းသည် အလိုအလျောက် ထုတ်ပေးသူမဟုတ်ပါ။

:::

## စစ်ဆေးပါ {#verify}

ဒီ post-state မေးမြန်းချက်တွေဟာ အောင်မြင်မှု သတ်မှတ်ချက်ပါ၊ တင်ပြရေး ပရိုတိုကောရဲ့ ရလဒ် မှတ်တမ်းတစ်ခုတည်းက မဟုတ်ဘူး။

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

အဆိုပြုချက်များတွင် ကိန်းဂဏန်းတန်ဖိုးများကို fixed-point decimals များအဖြစ် နှိုင်းယှဉ်သင့်ပြီး binary floating-point values များမဟုတ်ဘဲ definition ID နှင့် account ကို စစ်ဆေးသင့်ပါသည်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `#` ပါသော ID သည် alias သို့မဟုတ် တိကျသော လက်ကျန် literal ဖြစ်ပြီး စံပိုင်ဆိုင်မှုသတ်မှတ်ချက် ID မဟုတ်ပါ။ `--definition` နှင့် Base58 တန်ဖိုးသက်သက်ကို သုံးပါ၊ သို့မဟုတ် `--definition-alias` ဖြင့် ချိတ်ဆက်ထားသော alias ကို ပေးပါ။
- `Scale` အမှားတွေက အဓိပ္ပါယ်ဖွင့်ဆိုချက်က ခွင့်ပြုတာထက် အရေအတွက်တစ်ခုမှာ နံပါတ်ပိုင်းအရေအတွက် ပိုများတယ်လို့ ဆိုလိုတာပါ။
- `Mintability` ပယ်ချခြင်းဆိုသည်မှာ `Once`၊ `Not` သို့မဟုတ် `Limited(n)` မူဝါဒများ ထုတ်လွှင့်မှု ကုန်ဆုံးသွားပြီ (သို့မဟုတ်) ခွင့်ပြုထားခြင်းမရှိပါ။ သမိုင်းကို ပြန်မရေးပါနဲ့။ အဓိပ္ပါယ်သတ်မှတ်ချက် မေးမြန်းချက်ဖြင့်ပြန်ပို့သော မူဝါဒကိုအသုံးပြုပါ။
- အဆင့် (၂) မှာ မှတ်ပုံတင်မှတ်တိုင်စာရင်းကို ကြံစည်ရွေးချယ်ခြင်း။ အရင်းအမြစ်ဝင်ငွေက `ExplicitOnly` ဆိုပါက၊ ခွင့်ပြုထားသော စာရင်းမှတစ်ဆင့် ရည်မှန်းချက်လက်ကျန်ကို စီမံခန့်ခွဲပါ။ CLI အမည်တူစောင့်သည် အကောင့် သို့မဟုတ် ငွေစာရင်းကို မှတ်ပုံတင်ခြင်းမရှိဘဲ အခြားညွှန်ကြားချက်တစ်ခု ထပ်ဖြည့်ခြင်းအစား abort လုပ်သည်။
- ပုံမှန် သင်ကြားမှု အောင်မြင်မှု မတိုင်မီမှာ အခွန်ကို ငြင်းပယ်ခံရမှာပါ။ ငွေပေးချေသူကို ရွေးချယ်ပါ၊ ကွန်ရက်ရဲ့ အခွန်အရင်းအမြစ် metadata ကိုသုံးပြီး ၎င်းရဲ့စာရင်းကို စစ်ဆေးပါ။
- ယခင်စမ်းသပ်မှုမှ သတ်မှတ်ထားသော စက်တွင်းပိုင်ဆိုင်မှု အဓိပ္ပာယ်ဖွင့်ဆိုချက် ရှိနေပါက စက်တွင်းကွန်ရက်အသစ်ကို ဖန်တီးစတင်ပါ သို့မဟုတ် ရှိပြီးသား အခြေအနေမှ ဆက်လုပ်ပါ။ Base58 ID နေရာတွင် ပုံစံမမှန်သည့် ကျပန်းစာသားကို မထည့်ပါနှင့်။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [သတ်မှတ်ထားသော ရင်းမြစ်ဗားရှင်းရှိ ပိုင်ဆိုင်မှုသက်တမ်းတစ်လျှောက် ပေါင်းစပ်စမ်းသပ်ချက်များ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ်ကို ပြန်လည်သုံးသပ်မှုမှာ ရင်းနှီးမြှုပ်နှံမှု တည်ဆောက်ပုံဥပမာများ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [ပိုက်ဆံများ](/my/blockchain/assets.md)
- [ညွှန်ကြားချက်](/my/blockchain/instructions.md)
- [ခွင့်ပြုချက် လက်မှတ်များ](/my/reference/permissions.md)
- [JavaScript နှင့် TypeScript](/my/guide/tutorials/javascript.md)
