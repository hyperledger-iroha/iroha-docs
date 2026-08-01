---
translation_locale: my
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ငွေပေးချေမှု {#transactions}

ငွေပေးချေမှုသည် blockchain တွင်အလုပ်ကိုလုပ်ဆောင်ရန် လက်မှတ်ထိုးထားသောတောင်းဆိုချက်တစ်ခုဖြစ်သည်။ လုပ်ဆောင်နိုင်သည့် အသုံးဝင်ဝန်ပိုးသည် [ ညွှန်ကြားချက်များ](./instructions.md)၊ စာချုပ်ခေါ်ဆိုမှု, IVM ဘိုင်တာကုဒ် သို့မဟုတ် သက်သေပြထားသော IVM အကောင်အထည်ဖော်ခြင်းတို့၏ အမိန့်ချိဆက်ဖြစ်နိုင်တယ်။ လက်ရှိလက်မှတ်အကောင်အထည်ဖော်မှုပုံစံအတွက် [Smart Contracts](./smart-contracts.md) ကိုကြည့်ပါ။

Transaction တွေဟာ state change (သို့) executable အလုပ်တွေ လုပ်ပါတယ်။ read-only inspection မှာ လက်မှတ်ထိုးထားတဲ့ queries (သို့) public reading endpoints တွေကို သုံးပြီး transaction ကို မဖန်တီးပါဘူး။

ကတိပြုထားတဲ့ ဘလော့ထဲတွင် လက်ခံထားရသည့် ငွေပေးချေမှုတစ်ခုသည် အပြီးသတ်မှု ရလဒ်နှင့်အတူ သိမ်းဆည်းထားခြင်းဖြစ်သည်၊ ယင်းအပါအဝင် အကောင်အထည်ဖော်မှု ငြင်းပယ်ခြင်းဖြစ်သည်။ ဘလော့ကို လက်ခံရန် မတိုင်မီ ငြင်းပယ်ခံရသော တောင်းဆိုချက်များ၊ ဥပမာ မတည်ငြိမ်သော ပုံးအုပ် သို့မဟုတ် တန်းတန်းက ငြင်းပယ်ထားသော ငွေပေးချေးမှုတို့ဟာ ဘလော့အတွင်းမှာ သိမ်းဆည်းခြင်းမဟုတ်ပါ။

ပုဂ္ဂလိကဘဝကို ထိန်းသိမ်းတဲ့ အရင်းအမြစ်လှုပ်ရှားမှုအတွက် [ Anonymous Transactions](./anonymous-transactions.md) ကိုကြည့်ပါ။ အမည်မဲ့ ငွေလဲလှယ်မှုတွေဟာ အများပြည်သူအခွန်ကနေ အကောင့်ဆီက ငွေကြေးပမာဏ ပြောင်းလဲမှုအစား ပိတ်ထားသောအရင်းအမြစ်မှတ်ပုံတင်၊ ကတိပြုချက်များ၊ ဖျက်သိမ်းသူများနှင့် သုညသိပ္ပံသက်သေသနများကို အသုံးပြုတယ်။

ရွေးချယ်ထားတဲ့ ပွင့်လင်းမြင်သာတဲ့ အကောင်အထည်ဖော်မှု သက်ရောက်မှုအပေါ် သက်သေခံသက်သေများအတွက် [FastPQ](./fastpq.md) ကိုကြည့်ပါ။ FastPQ သည် ပုံမှန် ငွေကြေးပူးပေါင်းဆောင်ရွက်မှုပြီးနောက် အကောင်အ ထည်ဖော်မှုသက်သေများကို စားသုံးပြီး ထောက်ခံ state transitions အတွက် deterministic proof batches များကို တည်ဆောက်တယ်။

## Taira မှာ စမ်းကြည့်ပါ။ {#try-it-on-taira}

လတ်တလော အများပြည်သူ Taira ဘလော့ခ်များနှင့် ငွေပေးချေမှုအခြေအနေများကို လက်မှတ်ရေးထိုးစာရင်းမပါဘဲ စစ်ဆေးရန် Explorer လမ်းကြောင်းများကို အသုံးပြုပါ။

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

သင့် app က အရင်က တင်ပြခဲ့တဲ့ ငွေပေးချေမှုကို လိုက်နာဖို့ စာရင်းထဲက `hash` ကို ကူးယူပြီး explorer ရဲ့ အသေးစိတ် လမ်းကြောင်းကို စစ်ဆေးပါ။

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

စာရွက်စာတမ်းတင်ရန်အတွက် လက်မှတ်ထိုးထားသော Norito envelope၊ မှန်ကန်သော ချိတ်ဆက်ချက် ID၊ အခွန် metadata နှင့် faucet မှ ရင်းနှီးမြှုပ်နှံသည့် Taira အကောင့်ကို လိုအပ်သည်။

Taira တွင် အခွန်ပေးသည့်ဥပမာများအတွက်၊ faucet helper ကို [ မှ သိမ်းထားပါ။ Taira](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) တွင် Testnet XOR ကို `taira_faucet_claim.py` အဖြစ်ရယူပြီး ပထမဦးဆုံးအားဖြင့် အများပြည်သူ faucet မှတစ်ဆင့် လက်မှတ်ထိုးသူကို ငွေကြေးထောက်ပံ့ပါ။

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Faucet puzzle (သို့) claim route က `502` ကိုပြန်လာရင် ငွေပေးချေမှုကိုကိုယ်၌ debugging မလုပ်ခင် စောင့်ပြီး ထပ်မံကြိုးစားပါ။

Taira အခွန်အရင်းအမြစ် မီတာဒေတာကို ငွေပေးချေမှု တင်ပြရာတွင် ချိတ်ဆက်ပါ

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Offline ငွေပေးချေမှု {#offline-transactions}

Iroha မှာ offline transaction workflows နှစ်ခုရှိပါတယ်-

- Offline လက်မှတ်ထိုးခြင်းသည် လက်မှတ်ထိုးရေးကိရိယာက ချိတ်ဆက်ထားစဉ် ပုံမှန်လက်မှတ်ထိုးသော ငွေပေးချေမှုတစ်ခု ဖန်တီးသည်။ အွန်လိုင်းဖောက်သည်က Torii သို့ လက်မှတ်ထိုးထားတဲ့ စာအိတ်ကို မတင်မီအထိ ငွေပေးချေးမှုကို ပြုလုပ်ခြင်းမရှိပေ။ ထို့ကြောင့် ၎င်းသည် မှန်ကန်သော ကွင်းဆက် ID ၊ အာဏာ၊ ခွင့်ပြုချက်များ၊ အခကြေးငွေများနှင့် ငွေလဲလှယ်မှုသက်တမ်းကို လိုအပ်ပါသေးသည်။
- Kagemusha Offline Cash သည် အွန်လိုင်းတွင်ရှိစဉ်မှာ ငွေကြေးအိတ်ကို ထိပ်ဆုံးထည့်သွင်းပေးသည်၊ လက်ခံရရှိသူကစတင်သည့် ငွေကြေးမှ ငွေကြေးသို့ လွှဲပြောင်းမှုများကို ပိတ်ပင်ထားပြီး ငွေကြေးနှစ်လုံး offline ရှိစဉ်တွင် ထောက်ပံ့ပေးပြီး လက်ခံရရှိသူများအွန်လိုင်းသို့ ပြန်လာသောအခါ ရလဒ်ဖြစ်သော မှတ်စုအခြေအနေကို redeems လုပ်သည်။

Torii က Kagemusha ရဲ့ သက်တမ်းတစ်လျှောက်လုံးကို `/v1/offline/*` အောက်မှာ ဖော်ပြပါတယ်။

|နည်းစနစ်နဲ့ အဆုံးသတ်ချက် |ရည်ရွယ်ချက်|
| --- | --- |
|`GET /v1/offline/readiness` |`asset_definition_id` အတွက် Kagemusha အသင့်ရှိမှုကို အကဲဖြတ်ပါ။ |
|`POST /v1/offline/receiver-lineage` |လက်မှတ်ရေးထိုးထားတဲ့ လက်ခံရရှိသူရဲ့ တောင်းဆိုချက်အတွက် သက်သေခံတဲ့ တက်ကြွတဲ့ မှတ်ပုံတင် အမျိုးအစားကို ဖြေရှင်းပါ။ |
|`POST /v1/offline/top-up` |လက်မှတ်ရေးထိုးထားသော အွန်လိုင်းမှ အွန်လိုင္းသို့ ထပ်မံဖြည့်စွက်မှု တင်ပြပါ |
|`POST /v1/offline/redeem` |လက်မှတ်ထိုးထားတဲ့ Offline ပြန်လည်ဖြည့်စွက်မှု တင်ပြပါ |
|`GET /v1/offline/operations/{operation_id}` |ထပ်မံဖြည့်စွက်ခြင်း (သို့) ပြန်လွှတ်ခြင်းရဲ့ တရားဝင်အခြေအနေကို ဖတ်ပါ။ |

Offline operation ကို မလုပ်ခင် အရင်းအမြစ်အတွက် အသင့်ရှိမှုကို စစ်ဆေးပါ။

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

အသင့်ရှိမှုသည် ပိုက်ဆံအိတ်ကို တက်ကြွသောတံတား ABI 21 နှင့် စစ်ဆေးထားသော V4 လက်ရာစုနှင့် ချည်နှောင်သည်။ မျိုးရိုးစဉ်၊ ထပ်မံဖြည့်စွက်ခြင်းနှင့် ပြန်လည်ဝယ်ယူရန်တောင်းဆိုချက်များတွင် `application/x-norito` မှတ်တမ်းများကို ရိုက်နှိပ်အသုံးပြုတယ်။ `Location` ခေါင်းစဉ်တစ်ခုရှိပြီး လုပ်ငန်းအရင်းအမြစ်ကို ညွှန်ပြခြင်းနှင့် ပြန်လည်ဖြည့်စွက်မှုပြန်ကြားချက် `202 Accepted`; ထည့်သွင်းထားတဲ့ သုညမဟုတ်သော လုပ်ငန်း ID သည် idempotency key ကိုပေးသည်။

ပုံမှန် စီးဆင်းမှုက-

1. `ready` မှားယွင်းတယ် (သို့) တားဆီးမှုတစ်ခုခုရှိရင် အသင့်ဖြစ်မှုကို မေးမြန်းပြီး ရပ်ပါ။
2. Swift (သို့) JVM wallet ကို type လုပ်ပြီး Canonical top-up archive ကို တည်ဆောက်၊ တင်ပြီး input note state နဲ့ operation ID နှစ်ခုစလုံးကို ထိန်းသိမ်းထားပါက operation က နောက်ဆုံး chain state ကိုရောက်တဲ့အထိပါ။
3. လိုအပ်ပါက လက်ခံသူ မှတ်ပုံတင် မျိုးရိုးစဉ်ကို ဖြေရှင်းရန်၊ တန်းတူပေးပို့မှုတစ်ခုစီကို ဒေသတွင်းတွင် တည်ဆောက်ပြီး စစ်ဆေးရန်နှင့် လွှဲပြောင်းမှုကို အသိအမှတ်ပြုမီ ကုဒ်သွင်းထားသော စာရွက်စာတမ်းအခြေအနေကို ဆက်လက်တည်ရှိပါ။
4. လက်ခံသူက အွန်လိုင်းမှာရှိတဲ့အခါ Canonical Redemption Archive ကိုတည်ဆောက်ပြီး တင်ပေးပြီး ၎င်းရဲ့ လုပ်ဆောင်မှု အရင်းအမြစ်ကို အဆုံးသတ်ဖို့ စစ်ဆေးပါ။

အွန်လိုင်းသက်တမ်းကာလအတွင်း မှတ်စုအခြေအနေပြန်မလာခင်အထိ စာရင်းအင်းမှာ ပဋိပက္ခမရှိတဲ့ Offline လွှဲပြောင်းမှုကို မမြင်နိုင်ပါ။ ဒါကြောင့် Wallet နှင့် Operator မူဝါဒက တန်ဖိုးသတ်မှတ်ချက်တွေ၊ သက်တမ်းကုန်ဆုံးမှု၊ လက်ခံထုတ်လွှင့်သူတွေ၊ ရေရှည် တည်တံ့တဲ့ ဒေသတွင်း သိုလှောင်မှုတွေနဲ့ ညှိနှိုင်းရေး ပြတင်းပေါက်တွေကို အကောင်အထည်ဖော်သင့်တာပါ။

ဒီမှာ ဥပမာတစ်ခုက ငွေလဲလှယ်မှု အသစ်တစ်ခုကို ဖန်တီးခြင်းပါ။ `Grant` ဒီလုပ်ငန်းစဉ်မှာ Mouse က Alice ကို သတ်မှတ်ထားတဲ့ အခန်းကဏ္ဍကို ပေးအပ်နေပါတယ် (`role_id`) စစ်ဆေးပါ။ [အပြည့်အစုံ ဥပမာ](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
