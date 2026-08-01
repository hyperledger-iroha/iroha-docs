---
translation_locale: my
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 6b50c995afaf9f46df6fdaab31add40b106cfa12fdaa31dabbb74448486f87f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ငွေကြေးအထောက်အပံ့များ {#fungible-assets}

## ရလဒ် {#outcome}

Taira အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်များကို တိုက်ရိုက်စစ်ဆေးပြီး ထုတ်လုပ်သော ဒေသတွင်းကွန်ရက်တစ်ခုတွင် မှတ်ပုံတင်၊ ငွေကြေးထုတ်လုပ်မှု၊ လွှဲပြောင်းခြင်း၊ လောင်ကျွမ်းခြင်းနှင့် ဟန်ချက်စာရင်း စစ်ဆေးမှု စီးဆင်းမှုကို ပြီးစီးစေပါ။ recipe မှာ Canonical unprefixed Base58 asset-definition IDs၊ domain-qualified aliases, domainless I105 account IDs နဲ့ explicit fee payment တွေကို သုံးပါတယ်။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Python ၃.၁၁ သို့မဟုတ် နောက်ပိုင်း၊ Node.js (၂၄) ၊ current `iroha` CLI.
- ဖတ်လို့သာရတဲ့ Taira ဝင်ခွင့်။
- write walkthrough အတွက် ဒေသတွင်းကွန်ရက်တစ်ခုမှ ဖန်တီးထားသော [လွှတ်တင်ခြင်း Iroha](/my/get-started/launch-iroha.md), နှင့်အတူ `./localnet/client.toml` နှင့် Torii အပေါ် `http://127.0.0.1:8080`.

## ခြေလှမ်း {#steps}

### Taira အဓိပ္ပါယ်ဖွင့်ဆိုချက်များကို လက်မှတ်ထိုးသူမရှိဘဲ စစ်ဆေးပါ။ {#_1-inspect-taira-definitions-without-a-signer}

အရင်းအမြစ်အဓိပ္ပာယ်ဖွင့်ဆိုချက်များမှာ ပွင့်လင်းမြင်သာမှုမရှိသော Base58 ID ၊ ပြသနာမည်၊ mintability မူဝါဒ၊ ကိန်းဂဏန်းအရွယ်အစား၊ ရွေးချယ်စရာ alias များ၊ ပိုင်ရှင်များနှင့် စုစုပေါင်းအရေအတွက်ပါရှိသည်။ တိကျတဲ့ငွေကြေး balance တွင် ၎င်း၏ပိုင်ရှင်စာရင်းနှင့်ရွေးချယ်စရာ ဒေတာနေရာအကန့်အသတ်လည်းပါဝင်သည်။

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

Run ကို JavaScript ပုံစံ `node taira-assets.mjs`. အများပြည်သူ အရင်းအမြစ် IDs Base58 တန်ဖိုးတွေပဲရှိပါသေးတယ်။ ဖတ်လို့ရတဲ့တန်ဖိုးတစ်ခုက `cookbook_credit#wonderland.universal` အမည်မဖော်လိုသူက အဲဒီထဲက တစ်ခုကို IDs.

### (၂) ဒေသဆိုင်ရာ အာဏာပိုင်များနှင့် ခရီးစဉ်နေရာများကို ပြင်ဆင်ရန် {#_2-prepare-the-local-authority-and-destination}

Local authority ကို generated config ထဲက public key ကနေ ထုတ်ယူပြီး receiver အဖြစ် အခြားမှတ်ပုံတင်ထားတဲ့ account တစ်ခုကို ရွေးပါ။ private key မနှိပ်ပါဘူး။

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

အဆိုပါ ဒေသတွင်းသာ ID သည်အတည်ပြုသော Base58 အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်လိပ်စာတစ်ခုဖြစ်သည်။ အမည်မဖော်လိုသူသည်လူဖတ်နိုင်သော `domain.dataspace` စီမံကိန်းကိုဖြည့်ဆည်းပေးသည်။ စကေး `2` သည်ပိုင်းခြားကိန်းနှစ်ခုကိုခွင့်ပြုသည်။ `--mint-once` ကိုလွဲချော်ခြင်းအားဖြင့် default `Infinitely` မူဝါဒကိုထိန်းသိမ်းထားသည်။

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

ID ကို Taira မှာ ပြန်မသုံးပါနဲ့။ အများပြည်သူကွန်ရက်မှာ မှတ်ပုံတင်ရန်အတွက် အသစ်သော Canonical ID၊ သင့်လျှောက်လွှာအတွက်သတ်မှတ်ထားသည့် Domain/alias, အခကြေးထောက်ပံ့မှုနှင့် Runtime ၏ Asset-registration ခွင့်ပြုချက်လိုအပ်သည်။

### (၄) သံပုရာသီး၊ ရွှေ့ပြောင်းခြင်းနှင့် မီးရှို့ခြင်း {#_4-mint-transfer-and-burn}

All write commands select the authority as fee payer explicitly. CLI က လက်မှတ်မထိုးခင် တိကျတဲ့ ငွေပေးချေမှုကို ကိုးကားပြီး အလိုအလျောက် စောင့်ဆိုင်းပါတယ်။

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

မီးလောင်ပြီးနောက် အရင်းအမြစ်စာရင်း `64.50`, ရည်ရွယ်ချက်စာရင်း `25.50` နှင့် စုစုပေါင်းပမာဏ `90.00` ကိုမျှော်လင့်ပါ။

::: warning ခွင့်ပြုချက် ကန့်သတ်ချက်

Taira တွင် faucet-derived `taira.tx-metadata.json` ကို ချိတ်ဆက်ပြီး ရေးသားမှုတိုင်းအတွက် `--fee-payer authority` ကို အသုံးပြုပါ။ မှတ်ပုံတင်ခြင်းနှင့် ပုံနှိပ်ခြင်းသည် တက်ကြွသော validator ၏ ခွင့်ပြုချက်များကိုလိုအပ်သည်။ လွှဲပြောင်းခြင်းနှင့် မီးရှို့ခြင်းသည် အရင်းအမြစ်လက်ကျန်အပေါ်အာဏာကိုလိုအပ်သည်။ faucet မှ ရံပုံငွေရရှိသည့်စာရင်းသည် အလိုအလျောက်ထုတ်ပြန်သူမဟုတ်ပါ။

:::

## စစ်ဆေးပါ {#verify}

ဒီ post-state inquiries တွေဟာ အောင်မြင်မှု သတ်မှတ်ချက်ပါ၊ တင်ပြချက် လက်မှတ်တစ်ခုတည်းက မဟုတ်ဘူး။

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

အဆိုပြုချက်များတွင် ကိန်းဂဏန်းတန်ဖိုးများကို fixed-point decimals များအဖြစ် နှိုင်းယှဉ်သင့်ပြီး binary floating-point values များမဟုတ်ဘဲ ID သတ်မှတ်ချက်နှင့်စာရင်းကို စစ်ဆေးရပါမည်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- အန် ID ပါဝင်သော `#` အမည်မဖော်လိုသူ (သို့) ဘိလပ်မြေချေမှုန်းစာရင်းမဟုတ်ဘဲ တရားဝင်အရင်းအမြစ်သတ်မှတ်ချက်တစ်ခုဖြစ်သည် ID. Base58 တန်ဖိုးကို အသုံးပြုပါ `--definition`, (သို့) ချိတ်ဆက်ထားသော alias ကို `--definition-alias`.
- `Scale` အမှားတွေက အဓိပ္ပါယ်ဖွင့်ဆိုချက်က ခွင့်ပြုတာထက် အရေအတွက်တစ်ခုမှာ နံပါတ်ပိုင်းအရေအတွက် ပိုများတယ်လို့ ဆိုလိုတာပါ။
- `Mintability` ပယ်ချခြင်းဆိုသည်မှာ `Once`၊ `Not` သို့မဟုတ် `Limited(n)` မူဝါဒများက ထွင်းလုပ်ခြင်းကို ကုန်ဆုံးစေခဲ့သည် (သို့မဟုတ်) ခွင့်ပြုခြင်းမရှိပါ။ သမိုင်းကို ပြန်မရေးပါနဲ့။ အဓိပ္ပါယ်သတ်မှတ်ချက် မေးမြန်းမှုဖြင့်ပြန်ပို့သော မူဝါဒကိုအသုံးပြုပါ။
- အဆင့် (၂) မှာ မှတ်ပုံတင်မှတ်တိုင်စာရင်းကို ကြံစည်ရွေးချယ်ခြင်း။ အရင်းအမြစ်ဝင်ငွေက `ExplicitOnly` ဆိုပါက၊ ခွင့်ပြုထားသော စာရင်းမှတစ်ဆင့် ရည်မှန်းချက်လက်ကျန်ကို စီမံခန့်ခွဲပါ။ CLI အမည်တူစောင့်သည် အကောင့် သို့မဟုတ် ငွေစာရင်းကို မှတ်ပုံတင်ခြင်းမရှိဘဲ အခြားညွှန်ကြားချက်တစ်ခု ထပ်ဖြည့်ခြင်းအစား abort လုပ်သည်။
- ပုံမှန် သင်ကြားမှု အောင်မြင်မှု မတိုင်မီမှာ အခွန်ကို ငြင်းပယ်ခံရမှာပါ။ ငွေပေးချေသူကို ရွေးချယ်ပါ၊ ကွန်ရက်ရဲ့ အခွန်အရင်းအမြစ် metadata ကိုသုံးပြီး ၎င်းရဲ့စာရင်းကို စစ်ဆေးပါ။
- Fixed local definition ကို အရင် run တစ်ခုကတည်းက ရှိပြီးသားဆိုရင်, အသစ်ဖန်တီးထားတဲ့ localnet ကိုစတင်လိုက်ပါ (သို့) တည်ဆဲအခြေအနေကို ဆက်လုပ်ပါ။ Base58 ID အတွက် မှားယွင်းသော ကျပန်း string ကို ဘယ်တော့မှ အစားထိုးမထားပါနဲ့.

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ချိတ်ဆက်ထားသော commit ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/asset.rs) တွင် asset lifecycle integration စမ်းသပ်မှုများ
- [Rust ချိတ်ဆက်ထားသော commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/examples/tutorial.rs) တွင် အရင်းအမြစ်တည်ဆောက်ခြင်းဥပမာများ
- [အရင်းအမြစ်များ](/my/blockchain/assets.md)
- [ညွှန်ကြားချက်များ ](/my/blockchain/instructions.md)
- [ခွင့်ပြုချက် လက်မှတ်များ ](/my/reference/permissions.md)
- [JavaScript နှင့် TypeScript](/my/guide/tutorials/javascript.md)
