---
translation_locale: my
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# ငွေကြေးအထောက်အပံ့များ {#fungible-assets}

## ရလဒ် {#outcome}

လက်ရှိလည်ပတ်နေသော Taira ၏ အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်များကို စစ်ဆေးပြီး ဖန်တီးထားသော ဒေသတွင်းကွန်ရက်တစ်ခုပေါ်တွင် ထုတ်ပေးခြင်း၊ လွှဲပြောင်းခြင်း၊ ဖျက်ဆီးခြင်းနှင့် လက်ကျန်အတည်ပြုခြင်း လုပ်ငန်းစဉ်ကို ပြီးဆုံးအောင် လုပ်ဆောင်ပါ။ ဤလမ်းညွှန်သည် ရှေ့ဆက်မပါသော canonical Base58 အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက် ID များ၊ ဒိုမင်မပါသော I105 အကောင့် ID များနှင့် ရှင်းလင်းစွာ သတ်မှတ်ထားသော အခွန်ပေးချေမှုကို အသုံးပြုသည်။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`၊ `jq`၊ Python 3.11 သို့မဟုတ် နောက်ပိုင်းဗားရှင်း၊ Node.js 24 နှင့် လက်ရှိ `iroha` နှင့် `kagami` CLIs တို့။
- ဖတ်လို့သာရတဲ့ Taira ဝင်ခွင့်။
- စာရင်းရေးသွင်းခြင်း လမ်းညွှန်အတွက် [လွှတ်တင်ခြင်း Iroha](/my/get-started/launch-iroha.md) တွင်ကဲ့သို့ `kagami localnet generate --peers 4 --out-dir ./localnet` ကို `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa` ထပ်ထည့်၍ ဖန်တီးထားသော ဒေသတွင်းကွန်ရက်တစ်ခု လိုအပ်သည်။ ၎င်းသည် `./localnet/client.toml` နှင့် `http://127.0.0.1:8080` ပေါ်ရှိ Torii ကို ပံ့ပိုးပေးသည်။

## ခြေလှမ်း {#steps}

### 1. Taira အဓိပ္ပါယ်ဖွင့်ဆိုချက်များကို cryptographic signer မပါဘဲ စစ်ဆေးပါ။ {#_1-inspect-taira-definitions-without-a-signer}

အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်များတွင် ပွင့်လင်းမြင်သာမှုမရှိသော Base58 ID၊ ပြသမည့်အမည်၊ ထုတ်ပေးနိုင်မှုမူဝါဒ၊ ကိန်းဂဏန်း scale၊ ရွေးချယ်နိုင်သော alias၊ ပိုင်ရှင်၊ ရွေးချယ်နိုင်သော ပိုင်ရှင်ဒိုမင် သို့မဟုတ် ဒေတာနေရာ၊ လက်ကျန်မူဝါဒနှင့် စုစုပေါင်းပမာဏတို့ ပါဝင်သည်။ တိကျသော လက်ကျန်တွင် ၎င်းကို ကိုင်ဆောင်ထားသည့် အကောင့်နှင့် ရွေးချယ်နိုင်သော ဒေတာနေရာ နယ်ပယ်လည်း ပါဝင်သည်။

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
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

JavaScript ပုံစံကို `node taira-assets.mjs` ဖြင့် run လုပ်ပါ။ အများပြည်သူအရင်းအမြစ် ID များသည် Base58 တန်ဖိုးများသာရှိပြီး `cookbook_credit#wonderland.universal` ကဲ့သို့သော ဖတ်ရှုနိုင်သည့်တန်ဖိုးတစ်ခုသည် ထို ID တစ်ခုအတွက်အမည်မဖော်လိုပါ ။

### (၂) ဒေသဆိုင်ရာ ခွင့်ပြုချက် အရေအတွက်နှင့် ရည်ရွယ်ချက် ပြင်ဆင်ပါ။ {#_2-prepare-the-local-authority-and-destination}

ဖန်တီးထားသော config ထဲရှိ အများသုံးသော့မှ ဒေသတွင်း authority ကို ထုတ်ယူပြီးနောက် လက်ခံသူအကောင့်အသစ်အတွက် သော့တွဲတစ်စုံကို ဖန်တီး၍ ၎င်းအကောင့်ကို မှတ်ပုံတင်ပါ။ ပုဂ္ဂလိကသော့ကို ထုတ်ပြခြင်း မရှိပါ။

```bash
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

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### (၃) client ပိုင်ဆိုင်သော ကိန်းဂဏန်းဆိုင်ရာ အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကို အသုံးပြုပါ {#_3-use-a-client-owned-numeric-definition}

genesis ပြင်ပတွင် အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကို လက်မှတ်ထိုးသူ ပိုင်ဆိုင်သော ပိုင်ရှင်ဒိုမင် (`--domain`) အောက်တွင် မှတ်ပုံတင်ရပြီး ဖန်တီးထားသော localnet ၏ client သည် မည်သည့်ဒိုမင်ကိုမျှ မပိုင်ဆိုင်ပါ။ `--asset-definition-id` ဖြင့် ဖန်တီးထားသော localnet တွင် ဤအဓိပ္ပါယ်ဖွင့်ဆိုချက် ရှိပြီးသားဖြစ်သည်။ genesis က ၎င်းကို ကန့်သတ်မထားသော scale ဖြင့် မှတ်ပုံတင်ခဲ့ပြီး client ကို ပိုင်ရှင်အဖြစ် သတ်မှတ်ကာ client ထံသို့ ယူနစ် 1,000,000,000 ကို ထုတ်ပေးခဲ့သည်။

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Taira တွင် ထို ID ကို ပြန်မသုံးပါနှင့်။ အများသုံးကွန်ရက်တွင် မှတ်ပုံတင်ရန် canonical ID အသစ်တစ်ခု၊ သင့်အကောင့်က ပိုင်ဆိုင်သော ပိုင်ရှင်ဒိုမင်တစ်ခု (`ledger asset definition register` သို့ `--domain` အဖြစ် ပေးပို့သည်)၊ မည်သည့် alias အတွက်မဆို `CanManageAssetDefinitionAlias` ခွင့်ပြုချက်ပေးအပ်ထားမှုနှင့် အခွန်အတွက် ငွေကြေးထောက်ပံ့မှု လိုအပ်သည်။

### (၄) ထုတ်ပေးခြင်း၊ လွှဲပြောင်းခြင်းနှင့် ဖျက်ဆီးခြင်း {#_4-mint-transfer-and-burn}

All write commands select the authorization principal as fee payer explicitly. CLI သည် လက်မှတ်ထိုးရန်မတိုင်မီတိကျသော ငွေပေးချေမှုကို ကိုးကားပြီး အလိုအလျောက် စောင့်ဆိုင်းသည်။

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

ဖျက်ဆီးပြီးနောက် source balance `1000000064.50` ၊ destination balance `25.50` နဲ့ total quantity `1000000090.00` ကိုမျှော်လင့်ပါ။

::: warning ခွင့်ပြုချက် ကန့်သတ်ချက်

Taira တွင် ရေးသွင်းမှုတိုင်းအတွက် `--fee-payer authority` ကို အသုံးပြုပါ။ CLI သည် လက်မှတ်မထိုးမီ Taira ၏ အခွန်အရင်းအမြစ်ဖြင့် တိကျသော အခွန်ကို ခန့်မှန်းတွက်ချက်ပြသသည်။ မှတ်ပုံတင်ရန် အဓိပ္ပါယ်ဖွင့်ဆိုချက်၏ `--domain` ကို ပိုင်ဆိုင်ရန် လိုအပ်ပြီး alias အတွက် `CanManageAssetDefinitionAlias` လည်း လိုအပ်သည်။ ထုတ်ပေးရန် အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကို ပိုင်ဆိုင်ခြင်း သို့မဟုတ် `CanMintAssetWithDefinition` သို့မဟုတ် `CanMintAssetToAccount` ကို ကိုင်ဆောင်ထားခြင်း လိုအပ်သည်။ လွှဲပြောင်းခြင်းနှင့် ဖျက်ဆီးခြင်းအတွက် ပေးပို့သည့် လက်ကျန်အပေါ် အခွင့်အာဏာ လိုအပ်သည်။ faucet မှ ငွေထည့်ထားသော အကောင့်သည် အလိုအလျောက် ထုတ်ပေးသူ မဖြစ်ပါ။

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

- `#` ကိုပါဝင်သော ID သည် ပရိုတိုကုတ်စံညွှန်းအရ အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုမှု ID တစ်ခုမဟုတ်ဘဲ အမည်မဖော်လိုသူ (သို့) ဘိလပ်မြေညီမျှခြင်း စာလုံးတစ်လုံးဖြစ်သည်။ Base58 တန်ဖိုးကို `--definition` ဖြင့်သုံးပြီး (သို့) ချိတ်ဆက်ထားသည့် alias ကို `--definition-alias` ဖြင့် ဖြတ်သန်းပါ။
- `Scale` အမှားတွေက အဓိပ္ပါယ်ဖွင့်ဆိုချက်က ခွင့်ပြုတာထက် အရေအတွက်တစ်ခုမှာ နံပါတ်ပိုင်းအရေအတွက် ပိုများတယ်လို့ ဆိုလိုတာပါ။
- `Mintability` ပယ်ချခြင်းဆိုသည်မှာ `Once`၊ `Not` သို့မဟုတ် `Limited(n)` မူဝါဒများ ထုတ်လွှင့်မှု ကုန်ဆုံးသွားပြီ (သို့မဟုတ်) ခွင့်ပြုထားခြင်းမရှိပါ။ သမိုင်းကို ပြန်မရေးပါနဲ့။ အဓိပ္ပါယ်သတ်မှတ်ချက် မေးမြန်းချက်ဖြင့်ပြန်ပို့သော မူဝါဒကိုအသုံးပြုပါ။
- အဆင့် (၂) သည် ဦးတည်ရာအကောင့်ကို တိတိကျကျ မှတ်ပုံတင်သောကြောင့် အကောင့်လက်ခံမှုမူဝါဒသည် `ExplicitOnly` ဖြစ်သည့်အခါတွင်လည်း လွှဲပြောင်းမှု အလုပ်လုပ်သည်။ အမည်ဆင်တူသော CLI guard သည် အကောင့် သို့မဟုတ် လက်ကျန်ကို မှတ်ပုံတင်ခြင်းမရှိဘဲ အခြားညွှန်ကြားချက်တစ်ခု ထပ်ဖြည့်ခြင်းအစား abort လုပ်သည်။
- အခွန်ငြင်းပယ်မှုသည် ပုံမှန်ညွှန်ကြားချက် အောင်မြင်မှုမတိုင်မီ ဖြစ်ပေါ်သည်။ ငွေပေးချေသူကို ရွေးချယ်ပါ၊ CLI ၏ အခွန်စျေးနှုန်းခန့်မှန်းချက်ရှိ အခွန်အရင်းအမြစ်နှင့် အမြင့်ဆုံးပမာဏကို စစ်ဆေးပြီး ထိုလက်ကျန်ကို အတည်ပြုပါ။
- တူညီသော localnet ပေါ်တွင် ပြန်လည်လုပ်ဆောင်ပါက ယခင်လက်ကျန်များမှ စတင်ပြီး `kagami keys` သည် ရှိပြီးသား `./cookbook-recipient` ကို ငြင်းပယ်သည်။ အသစ်ဖန်တီးထားသော localnet ကို စတင်ပြီး ထိုဖိုင်တွဲကို ဖယ်ရှားပါ၊ သို့မဟုတ် အကြွင်းမဲ့တန်ဖိုးများအစား လက်ကျန်ပြောင်းလဲမှုများကို နှိုင်းယှဉ်ပါ။ Base58 ID အတွက် မှားယွင်းသော ကျပန်း string ကို ဘယ်တော့မှ အစားထိုးမထားပါနှင့်။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [Asset lifecycle integration tests at the pinned source-code revision (ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှု)](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ်ကို ပြန်လည်သုံးသပ်မှုမှာ ရင်းနှီးမြှုပ်နှံမှု တည်ဆောက်ပုံဥပမာများ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [ပိုက်ဆံများ](/my/blockchain/assets.md)
- [ညွှန်ကြားချက်](/my/blockchain/instructions.md)
- [ခွင့်ပြုချက် လက်မှတ်များ](/my/reference/permissions.md)
- [JavaScript နှင့် TypeScript](/my/guide/tutorials/javascript.md)
