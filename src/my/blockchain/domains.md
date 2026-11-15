---
translation_locale: my
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# ဒိုမင်များ {#domains}

Domain များသည် `World` တွင် မှတ်ပုံတင်ထားသော အမည်ရှိ namespace များဖြစ်သည်။ လက်ရှိ Iroha 3 ဒေတာမော်ဒယ်တွင် domain ၏ အမည်အပြည့်အစုံကို ၎င်း၏ မိခင် data space ဖြင့် သတ်မှတ်သောကြောင့် စံ identifier သည်:

```text
domain.dataspace
```

ဥပမာ `payments.universal` သည် `universal` data space အတွင်းရှိ `payments` domain ကို အမည်ပေးထားသည်။

## ဖွဲ့စည်းပုံ {#structure}

မှတ်ပုံတင်ထားသော `Domain` တွင်:

- `id`: data space ဖြင့် အမည်အပြည့်အစုံ သတ်မှတ်ထားသော `DomainId`
- `logo`: ဒိုမင်လောဂိုအတွက် ရွေးချယ်စရာ `SoraFS` URI။
- `metadata`: key value ကို အလိုလို metadata လုပ်ပါ။
- `owned_by`: domain ကိုပိုင်ဆိုင်သူစာရင်း၊ ပုံမှန်အားဖြင့် domain ကိုမှတ်ပုံတင်သူစာရင်း

Domain တစ်ခုကို ရုပ်လုံးဖေါ်ဖို့ အသုံးပြုတဲ့ bootstrap payload ကတော့ `NewDomain`. ၎င်းဟာ `id`, ရွေးချယ်မှု `logo`, အစောပိုင်း `metadata`. ဆော့ဖ်ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင်က ဖြည့်စွက် `owned_by` သာမန်ဖောက်သည်တွေက ဒီအသုံးဝင်ဝန်ဆောင်မှုကို တိုက်ရိုက်တင်ပို့တာမဟုတ်ဘူး။

## မှတ်ပုံတင်ခြင်း {#registration}

ပုံမှန် domain ဖန်တီးမှုသည် လိုချင်သောရလဒ်ကို ကြေညာသတ်မှတ်သည့် alias တည်ဆောက်မှု လုပ်ငန်းစဉ်ကို သုံးသည်။ ဤနည်းဖြင့် SNS အငှားခွင့်၊ ပိုင်ရှင်၏ လုပ်ပိုင်ခွင့်များ၊ quote အကာအကွယ်နှင့် domain မှတ်တမ်းတို့ကို ခွဲခြားမရသော `EnsureAlias` transaction တစ်ခုတည်းတွင် ထိန်းသိမ်းထားသည်။ `Register::Domain` သည် genesis သို့မဟုတ် ကနဦးတည်ဆောက်မှုအတွက်သာ ကျန်ရှိပြီး `ledger domain` command တွင် `register` command ခွဲ မရှိပါ။

SDK (သို့) Onboarding ဝန်ဆောင်မှုတစ်ခုနဲ့ လျှို့ဝှက်ချက်မဲ့ `AliasSetupPlanRequestV1` ရည်ရွယ်ချက်ကို ဖန်တီးပြီး CLI အစီအစဉ်ကို live state နဲ့ ဆန့်ကျင်ပြီး တိကျတဲ့ အစီအစဉ်ကို တင်ပြပါ။

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

ရည်ရွယ်ချက်တွင် `payments.universal`၊ ၎င်း၏ ကိန်းဂဏန်း data space၊ စံ I105 ပိုင်ရှင်၊ ငှားရမ်းခွင့်ရယူမည့် သက်တမ်းနှင့် လက်ရှိ မူဝါဒ/ငွေပေးချေမှု quote စစ်ဆေးချက်တို့ကို သတ်မှတ်သည်။ အစီအစဉ်ရေးဆွဲသည့် endpoint သည် `POST /v1/aliases/setup/plan` ဖြစ်ပြီး ပြန်ပေးသော အစီအစဉ်ကို ချိန်း၊ authority၊ အခြေအနေနှင့် နောက်ဆုံးသတ်မှတ်အချိန်တို့နှင့် ချည်နှောင်ထားသည်။ Domain ဖယ်ရှားခြင်းတွင် [`Unregister`](/my/blockchain/instructions.md#un-register) ကို ဆက်လက်အသုံးပြုသည်။

Domain တစ်ခုကို ဖန်တီးခြင်း သို့မဟုတ် ဖယ်ရှားခြင်းအတွက် လက်ရှိ runtime ၏ စစ်ဆေးသူ အရ သင့်လျော်သော domain စီမံခန့်ခွဲမှု ခွင့်ပြုချက် လိုအပ်သည်။ Authority အကောင့်တွင် ထို domain ကို ပြင်ဆင်ခွင့်ရှိလျှင် domain metadata ကို [`SetKeyValue` နှင့် `RemoveKeyValue`](/my/blockchain/instructions.md#setkeyvalue-removekeyvalue) ဖြင့် ပြင်ဆင်နိုင်သည်။

## Taira တွင် ဤအလုပ်ခွင်ကို run လုပ်ပါ။ {#try-it-on-taira}

အများပြည်သူ Taira testnet မှာ လက်ရှိ မြင်ရတဲ့ domain တွေကို စာရင်းပေးပါ။

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

အများသုံး lane ကတ်တလောက်ကို data space alias များနှင့် ပြန်လည်ချိတ်ဆက်ဖော်ပြပါ:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

အက်ပ်က domain ရှိမရှိ စစ်ဆေးလိုသည့်အခါ ပထမ command ကို သုံးပါ။ Data space နှင့် ဆက်စပ်သော lane များ၊ lane တစ်ခုစီ၏ အများပြည်သူ သို့မဟုတ် ကန့်သတ်ထားသော မြင်နိုင်မှုနှင့် ပင်မ lane နှင့် နှိုင်းယှဉ်သော ထပ်တူပြုမှု အခြေအနေတို့ကို စစ်ဆေးရန် lane ကတ်တလောက်ကို သုံးပါ။

Domain ပြင်ဆင်တည်ဆောက်ခြင်းသည် အခကြေးငွေပေးရသော ရေးသားမှုဖြစ်သည်။ Taira တွင် မစမ်းသပ်မီ [Taira တွင် Testnet XOR ရယူခြင်း](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ရှိ ကြိုတင်ပြင်ဆင်သည့် faucet လုပ်ငန်းစဉ်ဖြင့် လက်မှတ်ထိုးသူကို ငွေဖြည့်ပြီး အခကြေးငွေပေးသူကို တိတိကျကျ သတ်မှတ်ကာ အစီအစဉ်ကို အကောင်အထည်ဖော်ပါ။ CLI သည် လက်မှတ်မထိုးမီ အခကြေးငွေအတိအကျကို တွက်ချက်ဖော်ပြသည်:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
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
