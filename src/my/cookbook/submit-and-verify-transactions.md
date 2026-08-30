---
translation_locale: my
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 01907ea433e711cb0b1aa327d46c44744aad0a7571a65430dddd7a8aed3df373
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ငွေပေးချေမှုများကို တင်ပြခြင်း၊ စစ်ဆေးခြင်း {#submit-and-verify-transactions}

## ရလဒ် {#outcome}

Taira ငွေပေးချေမှုကို ကြိုတင်စစ်ဆေးပါ၊ အခွန်ကို တိကျစွာ သတ်မှတ်ပြီး လက်မှတ်ရေးထိုးပြီး တင်ပြပါ Applied finality ကို စောင့်ကြည့်ပါ။ ပြီးရင် committed transaction ကို hash ဖြင့် စစ်ဆေးပါ။

## လိုအပ်ချက်များ {#prerequisites}

- ငွေကြေးထောက်ပံ့မှု `taira.client.toml`, `taira.tx-metadata.json`, နှင့် `TAIRA_ACCOUNT_ID` ထုတ်ကုန်များ [ချိတ်ဆက် Taira](./connect-to-taira.md).
- current `iroha` CLI နှင့် `jq`
- တစ်ကြိမ်သုံး Taira လက်မှတ်ရေးထိုးသူ။ ၎င်းရဲ့ သော့ကို (သို့) Minamoto မှာ ဒီအမိန့်တွေကို မရေးပါနဲ့။

## ခြေလှမ်း {#steps}

### (၁) အဆုံးသတ်မှတ်ချက်၊ ခွင့်ပြုချက်နှင့် အခွန်စာရင်းကို ကြိုတင်ရှာဖွေပါ။ {#_1-preflight-the-endpoint-authority-and-fee-balance}

ပထမအနေနဲ့ queue snapshot ကိုဖတ်ပြီး အာဏာပိုင်ရဲ့ fee balance ကို မြင်နိုင်တာကို သက်သေပြပါ။ Base58 asset-definition ID ကို connection recipe ကနေ ထုတ်လုပ်တဲ့ metadata မှ ဖတ်ပါ။

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

အကောင့် (သို့) အခွန်လက်ကျန်မရှိပါက ရပ်ပါ။ သက်ဝင်တဲ့ ညွှန်ကြားချက်တစ်ခုဟာ ၎င်းရဲ့အာဏာပိုင်က ငွေမပေးနိုင်တဲ့အခါ အခကြေးအမှတ်သွင်းမှုကို မကျော်လွှားနိုင်ပါဘူး။

### (၂) ကိုးကား၊ လက်မှတ်ရေးထိုးပြီး တစ်ကြိမ် တင်ပြပါ။ {#_2-quote-sign-and-submit-once}

CLI သည် အခွန်တင်သွင်းမှုအတွက် လက်မှတ်မထိုးသေးတဲ့ အသုံးဝင်ဝန်ဆောင်မှုကို အတိအကျပို့ပေးပြီး လက်ခံထားသော ငွေပေးချေမှုရည်ရွယ်ချက်ကို ငွေပေးချေးမှုထဲ ချိတ်ဆက်၊ လက်မှတ်ရေးထိုးကာ တင်ပြပါတယ်။ JSON mode က ငွေပေးချီးမှု hash, လက်မှတ်ထိုးထားတဲ့ ငွေပေးချိမှုနှင့် လက်ခံထားရသည့် quote တို့ကို အတူတကွပြန်လည်ပို့တယ်။

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

`--no-wait` ကို ဒီအချက်ပြုတ်မှာ မသုံးပါနဲ့။ အမိန့်က အောင်မြင်တဲ့ လက်မှတ်မရေးခင် အတည်ပြုမှုကို စောင့်နေတာပါ။

### 3. terminal pipeline status ကို စောင့်ကြည့်ပါ။ {#_3-wait-for-terminal-pipeline-state}

HTTP လက်ခံခြင်း (သို့) အတန်းဝင်ခြင်းမှ အောင်မြင်မှုချမှတ်ခြင်းအစား Typed Status Helper ကိုအသုံးပြုပါ။ `--wait` ဖြင့် Safe Routing Scope ကို အလိုအလျောက်ရွေးချယ်ပြီး Default Target သည် Applied Finality ဖြစ်သည်။

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` နှင့် `Expired` တို့သည် terminal failure များဖြစ်ပြီး ပြန်လည်စစ်ဆေးနိုင်သော အောင်မြင်မှုအခြေအနေမဟုတ်ပါ။ ငွေကြေးပူးပေါင်းမှုကို ပြောင်းလဲခြင်း သို့မဟုတ် ပြန်လည်တည်ဆောက်ခြင်းမပြုမီ ၎င်းတို့၏ အကြောင်းရင်းကို မှတ်တမ်းတင်ပါ။

### (၄) သိုလှောင်ထားသော ငွေပေးချေမှုကို ဖတ်ရှုပါ။ {#_4-read-the-stored-transaction}

Pipeline Status က Processing ပြီးသွားပြီလားလို့ ဖြေပါတယ်။ Transaction query မှာ admitted transaction ကို hash တစ်ခုတည်းအောက်မှာ သိမ်းထားတယ်ဆိုတာကို စစ်ဆေးတယ်။

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

စူးစမ်းလေ့လာသူဟာ ဖတ်လို့သာရတဲ့ ဒုတိယ လေ့လာရေး မျက်နှာပြင်ပါ၊ ၎င်းဟာ ပိုက်လိုင်းရဲ့ အဆုံးသတ်ကို ခဏလောက် နောက်ကျနေနိုင်ပါတယ်။

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

အခြေအနေပြောင်းတဲ့ ညွှန်ကြားချက်အတွက် အပြောင်းအလဲဖြစ်ခဲ့တဲ့ အရာဝတ္ထုကို မေးမြန်းပြီး ပြီးအောင်လုပ်ပါ။ နိုင်ငံတကာ [မီတာဒေတာ](./metadata.md), [ငွေကြေးအထောက်အပံ့များ](./fungible-assets.md), နှင့် [NFTs](./nfts.md) ချက်ပြုတ်ချက်တွေမှာ ပြည်နယ်အပြီး ဖတ်စာတွေ ပါဝင်ပါတယ်။

## စစ်ဆေးပါ {#verify}

မှတ်တမ်းသုံးခုစလုံးဟာ hash တစ်ခုတည်းကို သဘောတူပြီး စူးစမ်းသူက စောင့်ဆိုင်းနေတဲ့ အခြေအနေကို မတင်ပြတော့ဘူးဆိုတာ စစ်ဆေးပါ။

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

တင်ပြချက်လက်မှတ်နဲ့ နောက်ဆုံးအခြေအနေကို စမ်းသပ်မှု အထောက်အထားအဖြစ် သိမ်းထားပါ။ ၎င်းတို့မှာ လက်မှတ်ရေးထိုးတဲ့ သော့မဟုတ်ဘဲ အများပိုင် ငွေပေးချေမှု အချက်အလက်တွေ ပါပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- HTTP `202` သို့မဟုတ် တန်းစီထားသော အခြေအနေသည် လက်ခံမှုသာသက်သေပြုသည်။ Applied, Rejected, Expired သို့မဟုတ် သတ်မှတ်ထားတဲ့ အချိန်ကာလအထိ ရိုက်ထည့်ထားသော အခြေအနေကို မဲဆွယ်မှုကို ဆက်လုပ်ပါ။
- hash ကိုပြန်ပို့ပြီးနောက် တင်သွင်းမှု အချိန်ကုန်သွားပါက နောက်ထပ် ငွေပေးချေမှု မလုပ်ခင် အဲဒီ hash ကို မေးမြန်းပါ။ မျက်မမြင် ပြန်တင်ခြင်းအားဖြင့် စာရင်းသွင်းထားပြီး လက်မှတ်ထိုးထားတဲ့ အသုံးဝင်ဝန်ဆောင်မှု အသစ်တစ်ခု ဖန်တီးပါတယ်။
- လက်မှတ်မထိုးခင် အခွန်တင်ဒါကို ပယ်ချနိုင်သည်။ `--fee-payer authority`, `gas_asset_id`၊ အာဏာပိုင်ရဲ့ ငွေကြေးစာရင်းနှင့် ကွန်ရက်ကွင်းဆက် ID ကို စစ်ဆေးပါ။
- `Rejected` ဟာ ပုံမှန်အားဖြင့် ညွှန်ကြားချက် အတည်ပြုမှု၊ ခွင့်ပြုချက်တွေ၊ အခွန်များ (သို့မဟုတ်) သက်တမ်းမပြည့်မီတဲ့ အခြေအနေကို ဖော်ပြပါတယ်။ ဒါဟာ ကျရှုံးခဲ့တဲ့ အကောင်အထည်ဖော်မှုရဲ့ အထောက်အထားတစ်ခုဖြစ်ပြီး သယ်ယူပို့ဆောင်မှု ထပ်မံကြိုးပမ်းမှုအဖြစ် ပြန်လည်ခွဲခြားသင့်တာ မဟုတ်ပါဘူး။
- Applied နောက်ပိုင်းတွင် explorer `404` သည် indexing lag လုပ်နိုင်သည်။ ပြန်လည်ဖတ်ရန်ကြိုးစားပါ၊ ငွေပေးချေမှုကို ထပ်မံမတင်ပါနဲ့။
- အခွင့်ထူးခံ ညွှန်ကြားချက်တစ်ခုက ဖန်တီးထားတဲ့ localnet ပေါ်မှာ အလုပ်လုပ်ပေမဲ့ Taira က ငြင်းပယ်ရင် တိကျတဲ့ Taira ခွင့်ပြုချက် (သို့) အုပ်ချုပ်တဲ့ နာမ်ဇိုင်း assignment ကိုရယူပါ။ ဒေသဆိုင်ရာ ရလဒ်က အများပိုင် ကွန်ရက်အာဏာကို မပေးဘူး။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [စာချုပ်တင်သွင်းခြင်းနှင့် သတ်မှတ်ထားသော ကန့်သတ်ချက်တွင် အခွန်ချိန်းကို အကောင်အထည်ဖော်ခြင်း ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Transaction confirmation tests at the pinned commit ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs) (ပိတ်ထားသော commit တွင် ငွေပေးချေမှု အတည်ပြုမှု စမ်းသပ်မှုများ)
- [ငွေလဲလှယ်မှု](/my/blockchain/transactions.md)
- [CLI လမ်းညွှန်](/my/get-started/operate-iroha-via-cli.md)
- [Torii အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md)
