---
translation_locale: my
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဒိုမင်များ {#domains}

Domain တွေကို `World` မှာ မှတ်ပုံတင်ထားတဲ့ Name Spaces လို့ခေါ်ပါတယ်။ လက်ရှိ Iroha 3 ဒေတာမော်ဒယ်မှာ domain တစ်ခုဟာ ၎င်းရဲ့ မူလ dataspace ကနေ သတ်မှတ်ထားတာပါ။ ဒီတော့ Canonical ID ကိုတော့:

```text
domain.dataspace
```

ဥပမာ `payments.universal` သည် `payments` ဒေတာနေရာအတွင်းရှိ `universal` နယ်ပယ်ကို အမည်ပေးသည်။

## ဖွဲ့စည်းပုံ {#structure}

မှတ်ပုံတင်ထားသော `Domain` တွင်:

- `id`: ဒေတာနေရာအတွက် အရည်အချင်းပြည့်မီသော `DomainId`
- `logo`: ဒိုမင်လောဂိုအတွက် ရွေးချယ်စရာ `SoraFS` URI။
- `metadata`: key value ကို အလိုလို metadata လုပ်ပါ။
- `owned_by`: domain ကိုပိုင်ဆိုင်သူစာရင်း၊ ပုံမှန်အားဖြင့် domain ကိုမှတ်ပုံတင်သူစာရင်း

Domain တစ်ခုကို ရုပ်လုံးဖေါ်ဖို့ အသုံးပြုတဲ့ bootstrap payload ကတော့ `NewDomain`. ၎င်းဟာ `id`, ရွေးချယ်မှု `logo`, အစောပိုင်း `metadata`. Runtime က ဖြည့်ဆည်းတယ်။ `owned_by` သာမန်ဖောက်သည်တွေဟာ ဒီ အသုံးဝင်ဝန်ပိုးကို တိုက်ရိုက် မတင်ကြဘူး။

## မှတ်ပုံတင်ခြင်း {#registration}

သာမန်ဒိုမင်ဖန်တီးခြင်းသည်ကြေညာချက် alias setup flow ကိုအသုံးပြုသည်။ ဤသည်မှာ SNS ငှားရမ်းစာချုပ်၊ ပိုင်ရှင်စွမ်းဆောင်ရည်များ၊ အဆိုပြုချက်စောင့်ရှောက်မှုနှင့် ဒိုမင်တန်းကို အက်တမ် `EnsureAlias` ငွေလဲလှယ်မှုတစ်ခုတွင် ထိန်းသိမ်းထားသည်။ `Register::Domain` သည်ဗီဇ / bootstrap မျက်နှာပြင်တစ်ခုဖြစ်နေဆဲဖြစ်ပြီး `ledger domain` အမိန့်မှာ `register` လက်အောက်အမိန့်မရှိပါ။

SDK (သို့) Onboarding ဝန်ဆောင်မှုတစ်ခုနဲ့ လျှို့ဝှက်ချက်မဲ့ `AliasSetupPlanRequestV1` ရည်ရွယ်ချက်ကို ဖန်တီးပြီး CLI အစီအစဉ်ကို live state နဲ့ ဆန့်ကျင်ပြီး တိကျတဲ့ အစီအစဉ်ကို တင်ပြပါ။

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

အဆိုပါရည်ရွယ်ချက်သည် `payments.universal` ၊ ၎င်း၏ကိန်းဂဏန်းဒေတာနေရာ၊ တရားဝင် I105 ပိုင်ရှင်၊ ငှားရမ်းဝယ်ယူမှုသက်တမ်းနှင့်လက်ရှိမူဝါဒ / ငွေပေးချေမှု quote guard ကိုသတ်မှတ်သည်။ စီမံခန့်ခွဲသူအဆုံးမှတ်သည် `POST /v1/aliases/setup/plan` ဖြစ်သည်။ ၎င်း၏ပြန်လည်ပေးသွင်းသောစီမံကိန်းသည်ကွင်း၊ အာဏာ၊ ပြည်နယ်နှင့် နောက်ဆုံးရက်များဖြင့် ချိတ်ဆက်ထားပါသည်။ Domain Removal သည် [`Unregister`](/my/blockchain/instructions.md#un-register) ကို အသုံးပြုနေဆဲဖြစ်သည်။

Domain တစ်ခုကို ဖန်တီးရန် သို့မဟုတ် ဖယ်ရှားရန်အတွက် Active Runtime Validator အောက်တွင် domain-management ခွင့်ပြုချက် လိုအပ်ပါသည်။ Domain metadata များကို [`SetKeyValue` နှင့် `RemoveKeyValue`](/my/blockchain/instructions.md#setkeyvalue-removekeyvalue) ဖြင့် update လုပ်နိုင်သည်။

## Taira မှာ စမ်းကြည့်ပါ။ {#try-it-on-taira}

အများပြည်သူ Taira testnet မှာ လက်ရှိ မြင်ရတဲ့ domain တွေကို စာရင်းပေးပါ။

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

ပြည်သူ့လမ်းကြောင်းစာရင်းကို ဒေတာနေရာ အမည်မဖော်လိုရာသို့ ပြန်ညွှန်းပါ။

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

App တစ်ခုက domain ရှိမရှိ စစ်ဆေးဖို့ ပထမအမိန့်ကို အသုံးပြုပါ။ ဒေတာနေရာတစ်ခုဟာ အများပြည်သူ၊ ကန့်သတ်ထားတယ်၊ (သို့) core lane နောက်ကျနေလားဆိုတာ အတည်ပြုဖို့လိုတဲ့အခါ Lane Catalog ကိုသုံးပါ။

Domain setup က fee ပေးတဲ့ စာရေးခြင်းပါ။ Taira, ရေနံရေချိုးစက်မှ ကယ်တင် [Testnet ကို ရယူပါ။ XOR အပေါ် Taira](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) သို့ဖြစ်သည် `taira_faucet_claim.py`, လက်မှတ်ရေးထိုးသူကို အများပြည်သူ ရေပိုက်ကနေ ငွေကြေးထောက်ပံ့ပေးပြီး အခွန်မီတာဒေတာတွေကို ချိတ်ဆက်ပေးပါ-

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

ထပ်တလဲလဲ testnet run တွေမှာ ထူးခြားတဲ့ domain name တစ်ခုအတွက် ရည်ရွယ်ချက်ကို တည်ဆောက်ပြီး Taira ရဲ့ လက်ရှိ မူဝါဒနဲ့ fee-asset quote guard ကို အသုံးပြုပါ။ localnet သို့မဟုတ် Minamoto အတွက် ထုတ်လုပ်ထားတဲ့ အစီအစဉ်ကို ပြန်မသုံးပါနဲ့။

## အခြားအဖွဲ့အစည်းများနှင့် ဆက်ဆံရေး {#relationship-to-other-entities}

Domain တွေကို အုပ်စုအုပ်ချုပ်ပြီး domain-scoped data တွေအတွက် နာမည်နေရာတစ်ခုပေးပါတယ်။ Asset အဓိပ္ပါယ်ဖွင့်ဆိုချက်တွေက domain-qualified identifiers ကိုသုံးပြီး queries တွေက domain တွေစာရင်းတင်နိုင်သလို domain တစ်ခုကို scoped လုပ်ထားတဲ့ object တွေလည်းရှာနိုင်ပါတယ်။ အကောင့်တွေဟာ လက်ရှိ ဒေတာပုံစံမှာ နယ်ပယ်မဲ့ဖြစ်ပေမဲ့ အကောင့်တွေက နယ်ပယ်တွေပိုင်နိုင်ပြီး အဓိပ္ပါယ်ဖွင့်ဆိုချက်တွေက နယ်မြေအောက်မှာ နေထိုင်တဲ့ အရင်းအမြစ်တွေကို သိမ်းဆည်းနိုင်တယ်။

အောက်ပါအတိုင်းလည်း ကြည့်ပါ။

- [ကမ္ဘာကြီး](/my/blockchain/world.md)
- [အရင်းအမြစ်များ](/my/blockchain/assets.md)
- [metadata](/my/blockchain/metadata.md)
- [အမည်ပေးခြင်း စည်းမျဉ်းများ ](/my/reference/naming.md)
