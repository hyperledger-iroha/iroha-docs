---
translation_locale: my
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ငွေပေးချေမှု {#transactions}

ငွေပေးချေမှုသည် blockchain တွင်လုပ်ဆောင်ရန် လက်မှတ်ရေးထိုးထားသောတောင်းဆိုချက်တစ်ခုဖြစ်သည်။ လုပ်ဆောင်နိုင်သည့် အသုံးဝင်ဝန်ပိုးသည် [ညွှန်ကြားချက်](./instructions.md) ၏ အမိန့်ချိထားသောအတန်း၊ စာချုပ်နည်းပညာခေါ်ယူခြင်း, IVM ဘိုက်ကုတ် (သို့မဟုတ်) သက်သေပြထားသော IVM အကောင်အထည်ဖော်မှုဖြစ်နိုင်တယ်။ လက်ရှိစာချုပ် အကောင်အ ထည်ဖော်မှုပုံစံအတွက် [အသိဉာဏ်ရှိတဲ့ စာချုပ်များ](./smart-contracts.md) ကိုကြည့်ပါ။

Transaction တွေဟာ state change (သို့) executable အလုပ်တွေ လုပ်တယ်။ Read-only inspection မှာ လက်မှတ်ထိုးထားတဲ့ queries ဒါမှမဟုတ် public read API endpoints တွေကို သုံးပြီး transaction ကို မဖန်တီးပါဘူး။

နောက်ဆုံးသတ်မှတ်ထားတဲ့ ဘလော့ထဲတွင် လက်ခံထားရသည့် ငွေပေးချေမှုတစ်ခုသည် ၎င်း၏ အကောင်အထည်ဖော်မှု ရလဒ်နှင့်အတူ သိမ်းဆည်းထားခြင်းဖြစ်သည်။ ဘလော့ကိုလက်ခံရန် မတိုင်မီ ပယ်ချခံရသော တောင်းဆိုချက်များ၊ ဥပမာ မတည်ငြိမ်သော ဒေတာ ကွန်တိန်နာ သို့မဟုတ် အတန်းက ငြင်းပယ်ထားသော ငွေပေးချေးမှုများကို ဘလော့မှာ သိမ်းဆည်းခြင်းမရှိပါ။

ပုဂ္ဂလိကဘဝကို ထိန်းသိမ်းတဲ့ အရင်းအမြစ် လှုပ်ရှားမှုအတွက် [အမည်မသိ ငွေပေးချေမှု](./anonymous-transactions.md) ကိုကြည့်ပါ။ အမည်မဲ့ ငွေကြေးလုပ်ငန်းတွေမှာ အများပိုင်စာရင်းကနေ စာရင်းဆီက ဘားလန်အပြောင်းအစား ကာကွယ်ထားတဲ့ အရင်းအမြတ်မှတ်စုတွေ၊ cryptographic commitment တန်ဖိုးတွေ၊ nullifiers နဲ့ zero knowledge proof တွေ သုံးပါတယ်။

ရွေးချယ်ထားတဲ့ ပွင့်လင်းမြင်သာတဲ့ အကောင်အထည်ဖော်မှု သက်ရောက်မှုအပေါ် သက်သေခံသက်သေများအတွက် [FastPQ](./fastpq.md) ကိုကြည့်ပါ။ FastPQ သည် ပုံမှန် ငွေကြေးဆောင်ရွက်မှု အကောင်အ ထည်ဖော်ပြီးနောက် အကောင်အတာသက်သေများကို စားသုံးပြီး ထောက်ပံ့ state transitions များအတွက် deterministic proof batches တွေကို တည်ဆောက်တယ်။

## Taira တွင် ဤအလုပ်ခွင်ကို run လုပ်ပါ။ {#try-it-on-taira}

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

စာရွက်စာတမ်းတင်ရန်အတွက် လက်မှတ်ရေးထိုးထားသော Norito ဒေတာ ကွန်တိန်နာ၊ မှန်ကန်သော ကွင်းဆက် ID၊ အခွန်မီတာဒေတာများနှင့် testnet မှထောက်ပံ့သည့် Taira အကောင့်ကို လိုအပ်သည်။

Taira တွင် အခွန်ပေးသည့်ဥပမာများအတွက် testnet ငွေကြေးထောက်ပံ့ရေး ဝန်ဆောင်မှု အကူအညီကို [Testnet XOR ကို Taira သို့ခေါ်ယူပါ။](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) မှ `taira_faucet_claim.py` အဖြစ် သိမ်းထားပြီးနောက် အများပြည်သူ testnet ငွေချေးမှု ဝန်ဆောင်မှုမှတစ်ဆင့် cryptographic လက်မှတ်ထိုးမှုကို ပထမဦးဆုံး ထောက်ပံ့ရန်:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

testnet ငွေကြေးထောက်ပံ့မှု ဝန်ဆောင်မှု ပဟေဠိ (သို့) တောင်းဆိုချက် လမ်းကြောင်း `502` ကိုပြန်ပို့ပါက၊ ငွေပေးချေမှုကိုကိုယ်၌ debugging မလုပ်ခင် စောင့်ပြီး ထပ်မံစမ်းသပ်ပါ။

Taira အခွန်အရင်းအမြစ် မီတာဒေတာကို ငွေပေးချေမှု တင်ပြရာတွင် ချိတ်ဆက်ပါ

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Offline ငွေပေးချေမှု {#offline-transactions}

Iroha မှာ offline transaction workflows နှစ်ခုရှိပါတယ်-

- Offline လက်မှတ်ထိုးခြင်းသည် လက်မှတ်ထိုးရေးကိရိယာက ချိတ်ဆက်ထားစဉ် ပုံမှန်လက်မှတ်ထိုးတဲ့ ငွေပေးချေမှုတစ်ခု ဖန်တီးသည်။ လက်မှတ်ထိုးထားတဲ့ ဒေတာအိုးကို အွန်လိုင်းဖောက်သည် Torii သို့မပို့မီအထိ ငွေပေးချေးမှုကို ပြုလုပ်ခြင်းမရှိတော့ပါ။ ထို့ကြောင့် ၎င်းသည် မှန်ကန်သော ကွင်းဆက် ID၊ ခွင့်ပြုချက် အရင်းအမြစ်, ခွင့်ပြုချက်တွေ, စရိတ်များ လိုအပ်နေဆဲဖြစ်သည်။ ကုန်သွယ်မှုသက်တမ်းပါ။
- Kagemusha Offline Cash သည် အွန်လိုင်းတွင်ရှိစဉ်မှာ ငွေကြေးအိတ်ကို ထိပ်ဆုံးထည့်သွင်းပေးသည်၊ လက်ခံရရှိသူကစတင်သည့် ငွေကြေးမှ ငွေကြေးသို့ လွှဲပြောင်းမှုများကို ပိတ်ပင်ထားပြီး ငွေကြေးနှစ်လုံး offline ရှိစဉ်တွင် ထောက်ပံ့ပေးပြီး လက်ခံရရှိသူများအွန်လိုင်းသို့ ပြန်လာသောအခါ ရလဒ်ဖြစ်သော မှတ်စုအခြေအနေကို redeems လုပ်သည်။

Torii က Kagemusha ရဲ့ သက်တမ်းတစ်လျှောက်လုံးကို `/v1/offline/*` အောက်မှာ ဖော်ပြပါတယ်။

|Method နဲ့ API အဆုံးသတ်မှတ်ချက် |ရည်ရွယ်ချက်|
| --- | --- |
|`GET /v1/offline/readiness` |`asset_definition_id` အတွက် Kagemusha အသင့်ရှိမှုကို အကဲဖြတ်ပါ။ |
|`POST /v1/offline/receiver-lineage` |လက်မှတ်ရေးထိုးထားတဲ့ လက်ခံရရှိသူရဲ့ တောင်းဆိုချက်အတွက် သက်သေခံတဲ့ တက်ကြွတဲ့ မှတ်ပုံတင် အမျိုးအစားကို ဖြေရှင်းပါ။ |
|`POST /v1/offline/top-up` |လက်မှတ်ရေးထိုးထားသော အွန်လိုင်းမှ အွန်လိုင္းသို့ ထပ်မံဖြည့်စွက်မှု တင်ပြပါ |
|`POST /v1/offline/redeem` |လက်မှတ်ထိုးထားတဲ့ Offline ပြန်လည်ဖြည့်စွက်မှု တင်ပြပါ |
|`GET /v1/offline/operations/{operation_id}` |ထပ်မံဖြည့်စွက်ခြင်း (သို့) ပြန်လည်ဝယ်ယူခြင်းရဲ့ Single Protocol Standard Status ကို ဖတ်ပါ။ |

Offline operation ကို မလုပ်ခင် အရင်းအမြစ်အတွက် အသင့်ရှိမှုကို စစ်ဆေးပါ။

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

အသင့်ရှိမှုသည် ပိုက်ဆံအိတ်ကို တက်ကြွသောတံတား ABI 21 နှင့် စစ်ဆေးထားသော V4 လက်ရာစုနှင့် ချည်နှောင်သည်။ မျိုးရိုးစဉ်၊ ထပ်မံဖြည့်စွက်ခြင်းနှင့် ပြန်လည်ဝယ်ယူရန်တောင်းဆိုချက်များတွင် `application/x-norito` မှတ်တမ်းများကို ရိုက်နှိပ်အသုံးပြုတယ်။ Top-up နှင့် redeem return `202 Accepted` ကို လုပ်ဆောင်ချက် အရင်းအမြစ်ကို ညွှန်ပြသည့် `Location` ခေါင်းစဉ်နှင့်အတူ; embedded nonzero operation ID က idempotency key ကိုပေးသည်။

ပုံမှန် စီးဆင်းမှုက-

1. `ready` မှားယွင်းတယ် (သို့) တားဆီးမှုတစ်ခုခုရှိရင် အသင့်ဖြစ်မှုကို မေးမြန်းပြီး ရပ်ပါ။
2. Swift (သို့) JVM ကို ရိုက်နှိပ်ထားသော Wallet ကိုသုံးပြီး Single Protocol Standard Top-up Archive ကိုတည်ဆောက်ခြင်း၊ တင်သွင်းခြင်းနှင့် input note state နှင့် operation ID နှစ်ခုစလုံးကိုအဆုံးသတ်ချိတ်ဆက်အခြေအနေသို့ရောက်မချင်း သိမ်းဆည်းပါ။
3. လိုအပ်ပါက လက်ခံသူ မှတ်ပုံတင် မျိုးရိုးစဉ်ကို ဖြေရှင်းရန်၊ ကွန်ရက် peer-sharing တစ်ခုစီကို ဒေသတွင်းတွင် တည်ဆောက်ပြီး စစ်ဆေးရန်နှင့် လွှဲပြောင်းမှုကို အသိအမှတ်ပြုရန်မတိုင်မီ ကုဒ်သွင်းထားသော မှတ်စုအခြေအနေကို ဆက်လက်တည်ရှိပါ။
4. လက်ခံသူက အွန်လိုင်းမှာရှိတဲ့အခါ Single Protocol Standard Redemption Archive ကိုတည်ဆောက်ပြီး တင်ပေးပြီး ၎င်းရဲ့ လုပ်ငန်းအရင်းအမြစ်ကို နောက်ဆုံးအထိ စစ်ဆေးပါ။

အွန်လိုင်းသက်တမ်းကာလအတွင်း မှတ်စုအခြေအနေပြန်မလာခင်အထိ blockchain ledger သည်ပဋိပက္ခဖြစ်နေသော offline လွှဲပြောင်းမှုကို သတိပြုနိုင်ခြင်းမရှိပါ။ ထို့ကြောင့် Wallet နှင့် operator မူဝါဒသည်တန်ဖိုးသတ်မှတ်ချက်များ၊ သက်တမ်းကုန်ဆုံးခြင်း၊ လက်ခံထုတ်လွှင့်သူများ၊ ရေရှည် တည်တံ့သည့် ဒေသတွင်း သိုလှောင်မှုနှင့် ညှိနှိုင်းရေး ပြတင်းပေါက်များကို အကောင်အထည်ဖော်သင့်သည်။

`Grant` ညွှန်ကြားချက်ဖြင့် ငွေပေးချေမှု အသစ်တစ်ခု ဖန်တီးခြင်း၏ ဥပမာကို ဖော်ပြပါသည်- ဤလုပ်ငန်းစဉ်တွင် Mouse သည် Alice ကို သတ်မှတ်ထားသော အခန်းကဏ္ဍ (`role_id`) ကို ပေးအပ်နေသည်။ [အပြည့်အစုံ ဥပမာ](./permissions.md#register-a-new-role) ကို စစ်ဆေးပါ။

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
