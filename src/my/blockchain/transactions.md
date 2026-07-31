---
translation_locale: my
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ငွေပေးချေမှု {#transactions}

A ကို **ငွေပေးချေမှု** ဒါက blockchain မှာ အလုပ်တွေလုပ်ဖို့ လက်မှတ်ထိုးထားတဲ့ တောင်းဆိုချက်ပါ။
အကောင်အထည်ဖော်နိုင်သော အသုံးဝင်ဝန်ပိုးသည်
[ညွှန်ကြားချက်များ](./instructions.md), စာချုပ်ခေါ်ဆိုမှု IVM bytecode သို့မဟုတ်
သက်သေပြ IVM သေဒဏ်ချမှတ်ခြင်း။ [စမတ် ကွန်ထရက်များ](./smart-contracts.md) လက်ရှိအတွက်
စာချုပ် အကောင်အထည်ဖော်မှု ပုံစံ။

ငွေပေးချေမှုတွေဟာ အခြေအနေကို ပြောင်းလဲစေတဲ့ (သို့) လုပ်ဆောင်နိုင်တဲ့ အလုပ်တွေ လုပ်တယ်။ ဖတ်ဖို့ပဲ စစ်ဆေးတာပါ။
လက်မှတ်ရေးထိုးထားတဲ့ မေးမြန်းချက်တွေနဲ့ အများပြည်သူ ဖတ်ရှုတဲ့ အဆုံးသတ်မှတ်တိုင်တွေကို သုံးပြီး ငွေပေးချေမှု မပြုလုပ်ပါဘူး။

ချုပ်ဆိုထားသော ဘလော့ထဲသို့ ဝင်ရောက်လာသည့် ငွေပေးချေမှုသည် ၎င်း၏ အကောင်အထည်ဖော်ခြင်းနှင့်အတူ သိုလှောင်ထားသည်။
အပြီးသတ်မှု ငြင်းပယ်ခြင်းအပါအဝင် ရလဒ်။
လက်ခံခြင်း (သို့) အတည်မပြုသော စာဝှက်တစ်ခု သို့မဟုတ် တန်းတန်းက ငြင်းပယ်ထားသည့် ငွေပေးချေမှုတစ်ခုလို၊
ဘလော့ကထဲမှာ သိမ်းထားတာမဟုတ်ဘူး။

ပုဂ္ဂိုလ်ရေးကို ထိန်းသိမ်းတဲ့ ပိုင်ဆိုင်မှု လှုပ်ရှားမှုအတွက် ကြည့်ပါ။
[အမည်မသိ ငွေပေးချေမှု](./anonymous-transactions.md). အမည်မသိ
ငွေလဲလှယ်နှုန်းသမိုင်း
အများပြည်သူစာရင်းမှ စာရင်းအင်းတိုးတက်မှုအစား သုည အသိသုတသက်သေများ။

ရွေးချယ်ထားတဲ့ ပွင့်လင်းမြင်သာတဲ့ အကောင်အထည်ဖော်မှု သက်ရောက်မှုအပေါ် သက်သေခံ အထောက်အထားများအတွက် ကြည့်ပါ။
[FastPQ](./fastpq.md). FastPQ ပုံမှန်အတိုင်း အသေခံတွေကို စားသုံးတယ်။
ငွေလဲလှယ်မှု အကောင်အထည်ဖော်ခြင်းနှင့်ထောက်ပံ့မှုအတွက် deterministic proof batches များကို တည်ဆောက်သည်
ပြည်နယ် ကူးပြောင်းမှု။

## ဒါကို စမ်းကြည့်ပါ။ Taira {#try-it-on-taira}

မကြာသေးခင်က အများပြည်သူကို စစ်ဆေးဖို့ Explorer လမ်းကြောင်းတွေကို သုံးပါ။ Taira ဘလော့များနှင့် ငွေကြေးပူးပေါင်းမှု
လက်မှတ်ထိုးစာရင်းမရှိသော အခြေအနေများ

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

သင့် app က အရင်က တင်ခဲ့တဲ့ ငွေပေးချေမှုတစ်ခုကို လိုက်နာဖို့ `hash` ကနေ
စူးစမ်းလေ့လာသူ လမ်းကြောင်းကို မှတ်တမ်းတင်ပြီး စစ်ဆေးပါ။

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

စာရွက်စာတမ်းကို တင်ပြဖို့ လက်မှတ်ထိုးထားတဲ့ Norito
အဝတ္အစား၊ မှန်ကန်တဲ့ သံကြိုး ID, အခွန် metadata နှင့် faucet မှထောက်ပံ့ Taira အကောင့်။

အခွန်ပေးတဲ့ နမူနာများအတွက် Taira, ရေနွေးကြိုးကူညီရေးမှ ကယ်တင်
[Testnet ကို ရယူပါ။ XOR အပေါ် Taira](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
အတိုင်း `taira_faucet_claim.py`, ဒီနောက် လက်မှတ်ရေးထိုးသူကို အများပြည်သူရေတံခါးမှတစ်ဆင့် ငွေကြေးထောက်ပံ့
ပထမက-

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

ရေနံရေချိုးခန်း ပဟေဠိ (သို့) လျှောက်လွှာလမ်းကြောင်း ပြန်လာရင် `502`, ကြိုပြီး ထပ်ကြိုးစားပါ
ငွေပေးချေမှုကိုယ်တိုင်ကို debugging လုပ်နေတာပါ။

အဲဒီနောက်မှာ Taira ငွေပေးချေမှု တင်သွင်းရာတွင် အခွန်လက်မှတ် metadata:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Offline ငွေကြေးရေးလုပ်ငန်းများ {#offline-transactions}

Iroha Offline transaction workflows နှစ်ခုရှိပါတယ်

- **Offline လက်မှတ်ထိုးခြင်း** လက်မှတ်ရေးထိုးနေစဉ်မှာ ပုံမှန်လက်မှတ်ရေးထိုးထားတဲ့ ငွေပေးချေမှုတစ်ခု ဖန်တီးတယ်။
  အွန်လိုင်းမှာ ဖိတ်ကြားထားတဲ့အချိန်အထိ ငွေပေးချေမှုကို မပြုလုပ်ပါဘူး။
  လက်မှတ်ထိုးထားတဲ့ စာအိတ်ကို ဖောက်သည်က Torii, အဲဒါကြောင့်မို့လို့ ၎င်းဟာ
  မှန်ကန်တဲ့ သံကြိုး ID, အာဏာ၊ ခွင့်ပြုချက်တွေ၊ အခွန်တွေနဲ့ ငွေပေးချေမှု သက်တမ်းပါ။
- **Kagemusha အွန်လိုင်း ငွေကြေး** အွန်လိုင်းမှာရှိစဉ်မှာ ငွေကြေးအိတ်ကို ထိပ်ဆုံးထည့်ပြီး ထောက်ပံ့ပေးတယ်။
  လက်ခံရရှိသူက ကမ်းလှမ်းတဲ့ Wallet to Wallet လက်ဆင့်ကမ်းမှု နှစ်ခုစလုံးမှာ
  Offline လုပ်ပြီး လက်ခံသူ ပြန်လာတဲ့အခါ ရလာတဲ့ note state ကို redeems
  အွန်လိုင်းမှာပေါ့။

Torii Kagemusha ရဲ့ သက်တမ်းကာလတစ်ခုလုံးကို `/v1/offline/*`:

| နည်းစနစ်နှင့် အဆုံးသတ်မှတ်ချက် | ရည်ရွယ်ချက် |
| --- | --- |
| `GET /v1/offline/readiness` | Kagemusha အသင့်ရှိမှုကို အကဲဖြတ်ပါ။ `asset_definition_id` |
| `POST /v1/offline/receiver-lineage` | လက်မှတ်ရေးထိုးထားသော လက်ခံသူ၏ တောင်းဆိုချက်အတွက် သက်သေခံလက်မှတ်တင်သွင်းမှုဆိုင်ရာ တက်ကြွသည့် မှတ်ပုံတင်အမျိုးအစားကို ဖြေရှင်းခြင်း |
| `POST /v1/offline/top-up` | လက်မှတ်ရေးထိုးထားတဲ့ အွန်လိုင်းမှ အွန်လိုင္းအထိ ထပ်မံဖြည့်စွက်မှု တင်ပြပါ |
| `POST /v1/offline/redeem` | လက်မှတ်ထိုးထားတဲ့ Offline ပြန်လည်ဖြည့်စွက်မှု တင်ပြပါ |
| `GET /v1/offline/operations/{operation_id}` | ထပ်မံဖြည့်စွက်ခြင်း (သို့) ပြန်လည်ဖြေရှင်းခြင်း၏ တရားဝင်အခြေအနေကို ဖတ်ရှုပါ။ |

Offline operation ကို မတည်ဆောက်ခင် အရင်းအမြစ်အတွက် အသင့်ရှိမှုကို စစ်ဆေးပါ။

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

အသင့်ရှိခြင်းသည် ပိုက်ဆံအိတ်ကို တက်ကြွသော တံတားနှင့် ချည်နှောင်ထားသည်။ ABI 21 နှင့် စစ်ဆေးထားသည် V4
အနုပညာစု. မျိုးရိုးစဉ်, top-up, နှင့်ပြန်လည်ဖြေရှင်းမှုတောင်းဆိုချက်များသုံး
`application/x-norito` မှတ်တမ်းများ၊ ပြန်လည်ဖြည့်ဆည်းခြင်းနှင့် ပြန်လည်ဝယ်ယူမှု `202 Accepted`
a နဲ့ `Location` operation resource ကို ညွှန်ပြတဲ့ ခေါင်းစဉ်၊ embedded
သုညမဟုတ်တဲ့ လုပ်ဆောင်ချက် ID idempotency key ကို ပေးပါတယ်။

ပုံမှန် စီးဆင်းမှုက-

1. အသင့်ရှိမှုကို မေးမြန်းပြီး ရပ်လိုက်ပါ `ready` မှားတယ် ဒါမှမဟုတ် တားဆီးတာတစ်ခုခု သုံးတယ်။
2. ရိုက်နှိပ်ထားသော စာလုံးကို အသုံးပြုပါ။ Swift ဒါမှမဟုတ် JVM Canonical top-up Archive ကို တည်ဆောက်ဖို့ Wallet
   ပေးပို့ပြီး input note status နဲ့ operation နှစ်ခုစလုံးကို ထိန်းထားတယ်။ ID မတိုင်မီ
   လုပ်ငန်းစဉ်က နောက်ဆုံး ချိတ်ဆက်မှု အခြေအနေကို ရောက်ရှိလာပါတယ်။
3. လိုအပ်တဲ့အခါ လက်ခံသူ မှတ်ပုံတင် မျိုးရိုးစဉ်ကို ဖြေရှင်း၊ တည်ဆောက်ပြီး
   peer handover တစ်ခုစီကို ဒေသတွင်းမှာ စစ်ဆေးပြီး ကုဒ်သွင်းထားတဲ့ မှတ်စုအခြေအနေကို ဆက်ထားပါ။
   လွှဲပြောင်းမှုကို အသိအမှတ်ပြုမပေးခင်
4. လက်ခံသူက အွန်လိုင်းမှာရှိတဲ့အခါ Canonical Redemption Archive ကို တည်ဆောက်ပါ။
   ဒါကို တင်ပြပြီး နောက်ဆုံးအထိ လုပ်ဆောင်မှု အရင်းအမြစ်ကို စစ်ဆေးတယ်။

note state မရောက်ခင်အထိ စာရင်းအင်းက အတိုက်အခံ Offline လွှဲပြောင်းမှုကို သတိမထားနိုင်ပါ။
အွန်လိုင်း သက်တမ်း စက်ဝန်းအတွင်း ပြန်လည်ပေးသွင်းခြင်း။ Wallet နှင့် operator မူဝါဒ
ထို့ကြောင့် တန်ဖိုးသတ်မှတ်ချက်များ၊ သက်တမ်းကုန်ဆုံးခြင်း၊ လက်ခံထုတ်ပြန်သူများ၊ ရေရှည် တည်တံ့သော ဒေသဆိုင်ရာ
သိုလှောင်ရေး၊ ပြန်လည်သင့်မြတ်ရေး ပြတင်းပေါက်များ။

ဒီမှာ ဥပမာတစ်ခုရှိပါတယ် `Grant`
ဒီလုပ်ငန်းစဉ်မှာ Mouse က Alice ကို သတ်မှတ်ထားတဲ့
ကဏ္ဍ (`role_id`) စစ်ဆေးပါ။
[အပြည့်အစုံ ဥပမာ](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
