---
translation_locale: my
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဒိုမင်များ {#domains}

Domain တွေကို `World` မှာ မှတ်ပုံတင်ထားတဲ့ Name Spaces လို့ခေါ်ပါတယ်။ လက်ရှိ Iroha 3 ဒေတာမော်ဒယ်မှာ domain တစ်ခုဟာ ၎င်းရဲ့ မူလ data space ကနေ သတ်မှတ်ထားတာပါ။ ဒီတော့ Single Protocol Standard Identifier ကတော့:

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

Domain တစ်ခုကို ရုပ်လုံးဖေါ်ဖို့ အသုံးပြုတဲ့ bootstrap payload ကတော့ `NewDomain`. ၎င်းဟာ `id`, ရွေးချယ်မှု `logo`, အစောပိုင်း `metadata`. ဆော့ဖ်ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင်က ဖြည့်စွက် `owned_by` သာမန်ဖောက်သည်တွေက ဒီအသုံးဝင်ဝန်ဆောင်မှုကို တိုက်ရိုက်တင်ပို့တာမဟုတ်ဘူး။

## မှတ်ပုံတင်ခြင်း {#registration}

သာမန်ဒိုမင်ဖန်တီးမှုသည် ကြေညာချက် alias setup flow ကိုအသုံးပြုသည်။ ဤသည်မှာ SNS ငှားရမ်းစာချုပ်၊ ပိုင်ရှင်စွမ်းဆောင်ရည်များ၊ အခွန်စျေးအတည်ပြုစောင့်ရှောက်ရေးနှင့် ဒိုမင်တန်းကို အက်တမ် `EnsureAlias` ငွေပေးချေမှုတစ်ခုတည်းတွင် ထိန်းသိမ်းထားပါသည်။ `Register::Domain` သည် genesis/bootstrap မျက်နှာပြင်တစ်ခုဖြစ်နေဆဲဖြစ်ပြီး `ledger domain` command တွင် `register` subcommand မရှိပါ။

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

ရည်ရွယ်ချက်ကို ဖော်ထုတ် `payments.universal`, ၎င်းရဲ့ ကိန်းဂဏန်း ဒေတာနေရာ၊ Single Protocol Standard I105 ပိုင်ရှင်၊ ငှားရမ်းဝယ်ယူမှု သက်တမ်းနှင့် လက်ရှိ မူဝါဒ/ပေးချေမှုခများ-စျေးနှုန်း အတည်ပြုစောင့်ရှောက်သူ။ စီမံကိန်းဆွဲသူ API အဆုံးသတ်မှတ်ချက်က `POST /v1/aliases/setup/plan`; ပြန်ပို့တဲ့ အစီအစဉ်က ချုပ်ဆက်၊ ငွေပေးချေမှု ခွင့်ပြုချက်နဲ့ ချည်နှောင်နေတာပါ။ အမည်၊ blockchain ledger အခြေအနေနဲ့ နောက်ဆုံးရက်။ Domain ကိုဖယ်ရှားခြင်းသည် [`Unregister`](/my/blockchain/instructions.md#un-register).

Domain တစ်ခုကို ဖန်တီးရန် (သို့) ဖယ်ရှားရန်အတွက် Active software execution environment validator ကို အသုံးပြုပြီး Domain metadata တွေကို update လုပ်နိုင်ပါတယ်။ [`SetKeyValue` နှင့် `RemoveKeyValue`](/my/blockchain/instructions.md#setkeyvalue-removekeyvalue) ခွင့်ပြုချက်ပေးသူက ဒီဒိုမင်ကို ပြင်ဆင်ဖို့ ခွင့်ပြုချက်ကိုရတဲ့အခါမှာ

## Taira တွင် ဤအလုပ်ခွင်ကို run လုပ်ပါ။ {#try-it-on-taira}

အများပြည်သူ Taira testnet မှာ လက်ရှိ မြင်ရတဲ့ domain တွေကို စာရင်းပေးပါ။

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

အများပြည်သူ အကောင်အထည်ဖော်မှုလမ်းကြောင်းစာရင်းကို ဒေတာနေရာ အမည်မဲ့များသို့ ပြန်ညွှန်းပါ:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

App တစ်ခုမှာ domain ရှိမရှိ စစ်ဆေးဖို့ ပထမအမိန့်ကို အသုံးပြုပါ။ ဒေတာနေရာတစ်ခုဟာ အများပြည်သူ၊ ကန့်သတ်ထားတယ်၊ ဒါမှမဟုတ် core execution lane နောက်ကျနေလားဆိုတာ အတည်ပြုဖို့ အကောင်အထည်ဖော်လမ်းကြောင်းစာရင်းကို သုံးပါ။

Taira မှာမကြိုးစားခင် testnet ဘဏ္ဍာရေး ဝန်ဆောင်မှု အကူအညီကို [Testnet XOR ကို Taira သို့ခေါ်ယူပါ။](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) မှ `taira_faucet_claim.py` အဖြစ် သိမ်းဆည်းပြီး အများပြည်သူ testnet ဘဏ်ငွေပေးချေမှု ဝန်ဆောင်မှုမှတစ်ဆင့် cryptographic လက်မှတ်ထိုးမှုကို ဘဏ္ဍာပြုပြီး အခွန်ဒေတာများကို ချိတ်ဆက်ပါ:

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

ထပ်တလဲလဲ testnet run တွေမှာ ထူးခြားတဲ့ domain name တစ်ခုအတွက် ရည်ရွယ်ချက်ကို တည်ဆောက်ပြီး Taira ရဲ့ လက်ရှိ မူဝါဒနဲ့ fee-asset fee-price validation guard ကို အသုံးပြုပါ။ localnet သို့မဟုတ် Minamoto အတွက်ထုတ်လုပ်ထားတဲ့ အစီအစဉ်ကို ပြန်မသုံးပါ။

## အခြားအဖွဲ့အစည်းများနှင့် ဆက်ဆံရေး {#relationship-to-other-entities}

Domain များသည် blockchain ledger အရာဝတ္ထုများကိုစုစည်းပြီး domain-scoped ဒေတာများအတွက် နာမည်နေရာကိုပေးသည်။ Asset အဓိပ္ပါယ်ဖွင့်ဆိုချက်များသည် domain-qualified identifiers ကိုအသုံးပြုပြီး မေးမြန်းမှုများသည် domain များသို့မဟုတ် Account တွေဟာ လက်ရှိ Data Model မှာ domainless ဖြစ်ပေမဲ့ account တွေက domain တွေကို ပိုင်ဆိုင်နိုင်ပြီး Domain တွေအောက်မှာ အဓိပ္ပါယ်ဖွင့်ဆိုချက်တွေ ရှိတဲ့ Assets တွေကို သိမ်းထားနိုင်ပါတယ်။

အောက်ပါအတိုင်းလည်း ကြည့်ပါ။

- [ကမ္ဘာကြီး](/my/blockchain/world.md)
- [ပိုက်ဆံများ](/my/blockchain/assets.md)
- [မီတာဒေတာ](/my/blockchain/metadata.md)
- [အမည်ပေးခြင်းဆိုင်ရာ စည်းမျဉ်းများ](/my/reference/naming.md)
