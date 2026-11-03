---
translation_locale: my
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: de608ef52ad3a999c0e253e6683e454f8f66f399a690dce4c2185c79d02334cd
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# ငွေပေးချေမှုများကို တင်ပြခြင်း၊ စစ်ဆေးခြင်း {#submit-and-verify-transactions}

## ရလဒ် {#outcome}

Taira ငွေပေးချေမှုကို ကြိုတင်စစ်ဆေးပါ၊ အခွန်စျေးနှုန်း ခန့်မှန်းချက်ကို အတိအကျလက်ခံ၊ လက်မှတ်ရေးထိုးပြီး တင်ပြပါ Applied Finality ကိုစောင့်ကြည့်ပါ၊ ပြီးဆုံးသွားတဲ့ ငွေပေးချေးကို cryptographic hash ဖြင့် စစ်ဆေးပါ။

## လိုအပ်ချက်များ {#prerequisites}

- [Taira သို့ ချိတ်ဆက်ပါ](./connect-to-taira.md) က ထုတ်ပေးသော ငွေထည့်ထားသည့် `taira.client.toml`၊ `taira-faucet-policy.json` နှင့် `TAIRA_ACCOUNT_ID`။ ရေးသွင်းမှုများသည် `--fee-payer authority` ကို အသုံးပြုပြီး CLI သည် လက်မှတ်မထိုးမီ Taira ၏ အခွန်အရင်းအမြစ်ဖြင့် တိကျသော အခွန်ကို ခန့်မှန်းတွက်ချက်ပြသသည်။
- current `iroha` CLI နှင့် `jq`
- တစ်ကြိမ်သုံးနိုင်တဲ့ Taira cryptographic signer တစ်ခုပါ။ ၎င်းရဲ့ key ကို (သို့) ဒီ command တွေကို Minamoto မှာ ပြန်မသုံးပါနဲ့။

## ခြေလှမ်း {#steps}

### (၁) API အဆုံးသတ်မှတ်ချက်၊ ခွင့်ပြုမှု မူလငွေနှင့် အခွန်စာရင်းကို ကြိုတင်စစ်ဆေးပါ။ {#_1-preflight-the-endpoint-authority-and-fee-balance}

ပထမဦးစွာ queue snapshot ကို ဖတ်ပြီးနောက် authority ၏ အခွန်လက်ကျန်ကို မြင်နိုင်ကြောင်း သက်သေပြပါ။ ချိတ်ဆက်ခြင်းလမ်းညွှန်က သိမ်းဆည်းထားသော faucet မူဝါဒမှ Base58 အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက် ID ကို ဖတ်ပါ။

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet-policy.json)"

iroha --config ./taira.client.toml account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

အကောင့် (သို့) အခွန်စာရင်းကလွဲရင် ရပ်ပါ။ ခွင့်ပြုချက်ရသူဦးစီးဌာနမှ ပေးချေနိုင်ခြင်းမရှိတဲ့အခါ သက်ဆိုင်ရာ ညွှန်ကြားချက်တစ်ခုက အခွန်လက်မှတ်ကို မလွှဲပြောင်းနိုင်ပါ။

### (၂) ကိုးကား၊ လက်မှတ်ရေးထိုးပြီး တစ်ကြိမ် တင်ပြပါ။ {#_2-quote-sign-and-submit-once}

CLI သည် အခွန်စျေးနှုန်းခန့်မှန်းချက်အတွက် လက်မှတ်မထိုးသေးတဲ့ အသုံးဝင်ဝန်ဆောင်မှု အတိအကျကိုပို့ပေးပြီး လက်မှတ်ရေးထိုးထားသော ငွေပေးချေမှုရည်ရွယ်ချက်ကို ငွေလဲလှယ်မှုထဲ ချိတ်ဆက်၊ လက်မှတ်ရေးဆွဲပြီး တင်သွင်းသည်။ JSON mode က ငွေလဲလှေခြင်းရဲ့ cryptographic hash, လက်မှတ်ရေးသားထားတဲ့ ငွေလဲလှလှယ်မှုနှင့် လက်ခံ quote ကို အတူတကွပြန်လည်ပို့ပေးတယ်။

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

`--no-wait` ကို ဒီအချက်ပြနည်းမှာ မသုံးပါနဲ့။ ပရိုတိုကော အောင်မြင်တဲ့ ရလဒ် မှတ်တမ်းကို ရေးမတင်ခင်မှာ အမိန့်ဟာ အတည်ပြုမှုကို စောင့်နေတာပါ။

### (၃) terminal software processing workflow status ကို စောင့်ပါ။ {#_3-wait-for-terminal-pipeline-state}

HTTP လက်ခံခြင်း သို့မဟုတ် queue ဝင်ခွင့်ရခြင်းမှ အောင်မြင်မှုကို ကောက်ချက်ချမည့်အစား typed status helper ကို အသုံးပြုပါ။ `--wait` ဖြင့် CLI သည် တိကျသော global status ကို poll လုပ်ပြီး state အရ ဖြေရှင်းပြီးသော `Applied` finality တွင်သာ အောင်မြင်သည်။

```bash
iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` နှင့် `Expired` တို့သည် terminal failure များဖြစ်ပြီး ပြန်လည်စစ်ဆေးနိုင်သော အောင်မြင်မှုအခြေအနေမဟုတ်ပါ။ ငွေကြေးပူးပေါင်းမှုကို ပြောင်းလဲခြင်း သို့မဟုတ် ပြန်လည်တည်ဆောက်ခြင်းမပြုမီ ၎င်းတို့၏ အကြောင်းရင်းကို မှတ်တမ်းတင်ပါ။

### (၄) သိုလှောင်ထားသော ငွေပေးချေမှုကို ဖတ်ရှုပါ။ {#_4-read-the-stored-transaction}

စီမံခန့်ခွဲမှု ပြီးဆုံးပြီလား ဆိုတာကို software processing workflow status က ဖြေပါတယ်။ Transaction query မှာ လက်ခံထားတဲ့ transaction ကို cryptographic hash တစ်ခုတည်းအောက်မှာ သိမ်းထားတယ်ဆိုတာကို စစ်ဆေးတယ်။

```bash
iroha --config ./taira.client.toml \
  --machine \
  tx get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Explorer ဟာ ဖတ်လို့သာရတဲ့ ဒုတိယ လေ့လာမှု မျက်နှာပြင်တစ်ခုဖြစ်ပြီး ဆော့ဝဲ စီမံခန့်ခွဲရေး အလုပ်အသွားအလာ အပြီးသတ်ချက်မှာ ခဏလောက် နောက်ကျနေနိုင်ပါတယ်။

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

အခြေအနေပြောင်းတဲ့ ညွှန်ကြားချက်အတွက် အပြောင်းအလဲဖြစ်ခဲ့တဲ့ အရာဝတ္ထုကို မေးမြန်းပြီး ပြီးအောင်လုပ်ပါ။ နိုင်ငံတကာ [မီတာဒေတာ](./metadata.md), [ငွေကြေးအထောက်အပံ့များ](./fungible-assets.md), နှင့် [NFTs](./nfts.md) ချက်ပြုတ်ချက်တွေမှာ ပြည်နယ်အပြီး ဖတ်စာတွေ ပါဝင်ပါတယ်။

## စစ်ဆေးပါ {#verify}

မှတ်တမ်းသုံးခုစလုံးသည် တူညီသော hash တွင် သဘောတူကြောင်းနှင့် explorer က `Rejected` မဟုတ်ဘဲ `Committed` ကို ဖော်ပြကြောင်း စစ်ဆေးပါ:

```bash
jq -e --arg hash "$TAIRA_TX_HASH" \
  '.hash == $hash and .terminal_kind == "Applied"' taira-final-status.json

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '(.hash | ascii_downcase | ltrimstr("hash:") | split("#")[0]) == $hash
      and .status == "Committed"'
```

တင်ပြမှု ပရိုတိုကောရဲ့ ရလဒ် မှတ်တမ်းနဲ့ နောက်ဆုံးအခြေအနေကို စမ်းသပ်မှု အထောက်အထားအဖြစ် သိမ်းထားပါ။ ၎င်းတို့မှာ လက်မှတ်ရေးထိုးတဲ့ သော့မဟုတ်ဘဲ အများပိုင် ငွေပေးချေမှု ပစ္စည်းတွေ ပါပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- HTTP `202` သို့မဟုတ် တန်းစီထားသော အခြေအနေသည် လက်ခံမှုသာသက်သေပြုသည်။ Applied, Rejected, Expired သို့မဟုတ် သတ်မှတ်ထားတဲ့ အချိန်ကာလအထိ ရိုက်ထည့်ထားသော အခြေအနေကို မဲဆွယ်မှုကို ဆက်လုပ်ပါ။
- စာဝှက် hash ကိုပြန်ပို့ပြီးနောက် တင်သွင်းမှု အချိန်ကုန်သွားပါက နောက်ထပ် ငွေချေးမှု တည်ဆောက်မတိုင်ခင် အဲဒီစာဝှက် hashကို မေးမြန်းပါ။ မျက်မမြင် ပြန်တင်ခြင်းအားဖြင့် ကိုးကားထားပြီး လက်မှတ်ထိုးထားတဲ့ အသုံးဝင်ဝန်ဆောင်မှု အသစ်တစ်ခု ဖန်တီးပါတယ်။
- အခွန်စျေးနှုန်းခန့်မှန်းချက်ကို လက်မှတ်မထိုးမီ ငြင်းပယ်ခံရနိုင်သည်။ `--fee-payer authority`၊ authority ၏ လက်ကျန်၊ ပြင်ဆင်သတ်မှတ်ထားသော `chain` နှင့် `network_id` တို့ကို စစ်ဆေးပြီး `--metadata` တွင် `gas_asset_id` ကဲ့သို့သော အခွန် key မပါဝင်ကြောင်းကိုလည်း စစ်ဆေးပါ။
- `Rejected` သည် ပုံမှန်အားဖြင့် ညွှန်ကြားချက် အတည်ပြုမှု၊ ခွင့်ပြုချက်များ၊ အခွန်များ (သို့) သက်တမ်းမပြည့်မီသော အခြေအနေကို ဖော်ပြသည်။ ၎င်းသည် ကျရှုံးခဲ့သည့် အကောင်အထည်ဖော်မှု၏ နောက်ဆုံးသတ်မှတ်ထားသောအသက်သေဖြစ်ပြီး သယ်ယူပို့ဆောင်မှု ထပ်မံကြိုးပမ်းခြင်းအဖြစ် ပြန်လည်ခွဲခြားရန် မလိုပါ။
- Applied နောက်ပိုင်းတွင် explorer `404` သည် indexing lag လုပ်နိုင်သည်။ ပြန်လည်ဖတ်ရန်ကြိုးစားပါ၊ ငွေပေးချေမှုကို ထပ်မံမတင်ပါနဲ့။
- အခွင့်ထူးခံ ညွှန်ကြားချက်တစ်ခုက generated localnet တွင်အလုပ်လုပ်ပေမဲ့ Taira က ငြင်းပယ်ရင် တိကျတဲ့ Taira ခွင့်ပြုချက် (သို့) အုပ်ချုပ်သော နာမ်ဇိုင်း assignment ကိုရရှိပါ။ ဒေသတွင်းရလဒ်သည် အများပိုင် blockchain ကွန်ရက် ခွင့်ပြုမှု မူဝါဒကိုမပေးဘူး။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ်ကို ပြန်လည်ပြင်ဆင်ခြင်းတွင် ငွေပေးချေမှု တင်သွင်းခြင်းနှင့် အခွန်တင်နှုန်း အကောင်အထည်ဖော်ခြင်း၊](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Transaction confirmation အကောင်အထည်ဖော်ခြင်းနှင့် test များကို pinned source-code revision တွင်ပြုလုပ်ခြင်း](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/client.rs)
- [ငွေပေးချေမှု](/my/blockchain/transactions.md)
- [CLI လမ်းညွှန်](/my/get-started/operate-iroha-via-cli.md)
- [Torii API အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md)
