---
translation_locale: my
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဒိုမင်များ {#domains}

ဒိုမင်များသည် `World`. လက်ရှိမှာ Iroha
3 ဒေတာပုံစံ domain ကို ၎င်းရဲ့မိဘ dataspace ကသတ်မှတ်ထားသည်
မှတ်သားချက်က-

```text
domain.dataspace
```

ဥပမာ၊ `payments.universal` အမည်များ `payments` ဒေသတွင်း
`universal` ဒေတာနေရာ။

## ဖွဲ့စည်းပုံ {#structure}

မှတ်ပုံတင်ထားသော `Domain` အောက်ပါအတိုင်း ပါဝင်ပါတယ်။

- `id`: ဒေတာနေရာ အရည်အချင်းများ `DomainId`
- `logo`: ရွေးချယ်စရာ `SoraFS` URI Domain Logo အတွက်
- `metadata`: key-value metadata များ
- `owned_by`: Domain ကို ပိုင်ဆိုင်တဲ့ Account ကတော့ ပုံမှန်အားဖြင့်
  မှတ်ပုံတင်ထား

ဒိုမင်တစ်ခုကို ရုပ်လုံးဖေါ်ဖို့ အသုံးပြုတဲ့ bootstrap အသုံးဝင်ဝန်ပိုးက `NewDomain`. ဒါက သယ်ဆောင်ပါတယ်။
ကော်မတီ `id`, ရွေးချယ်စရာ `logo`, အစောပိုင်း `metadata`. Runtime က ဖြည့်ပေးတယ်။
`owned_by` သာမန်ဖောက်သည်တွေက ဒီ အသုံးဝင် ဝန်ဆောင်မှုကို မတင်ကြဘူး။
တိုက်ရိုက်ပါ။

## မှတ်ပုံတင်ခြင်း {#registration}

သာမန်ဒိုမင်ဖန်တီးမှုမှာ declarative alias setup flow ကိုသုံးပြီး
SNS ငှားရမ်းမှု, ပိုင်ရှင်စွမ်းဆောင်ရည်များ, ကိုးကားချက်စောင့်ရှောက်မှု, နှင့် domain row တစ်ခုတည်းသော အက်တမ်
`EnsureAlias` ငွေပေးချေမှု။ `Register::Domain` Genesis/bootstrap ဖြစ်နေဆဲပါ။
မျက်နှာပြင်နှင့် `ledger domain` အမိန့်မရှိ `register` အထက်မှူးချုပ်။

လျှို့ဝှက်ချက်မဲ့ ဖန်တီးပါ။ `AliasSetupPlanRequestV1` ရည်ရွယ်ချက် SDK (သို့) Onboarding
ဝန်ဆောင်မှုရှိရင် CLI ဒါကို live state နဲ့ ဆန့်ကျင်ပြီး တိကျတဲ့
အစီအစဉ်:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

ရည်ရွယ်ချက်ကို ဖော်ထုတ် `payments.universal`, ၎င်းရဲ့ ကိန်းဂဏန်း ဒေတာအကွာအဝေး၊ ကနောနိယ
I105 ပိုင်ရှင်၊ ငှားရမ်းဝယ်ယူမှု သက်တမ်းနဲ့ လက်ရှိ မူဝါဒ/ငွေပေးချေမှု ကော်တာ စောင့်ရှောက်သူ။
Planner ရဲ့ အဆုံးအဖြတ်က `POST /v1/aliases/setup/plan`; ၎င်းရဲ့ ပြန်ပို့တဲ့ အစီအစဉ်က
ကွင်းဆက်၊ အာဏာ၊ ပြည်နယ်နှင့် နောက်ဆုံးရက်များဖြင့် ချမှတ်ထားသည်
[`Unregister`](/my/blockchain/instructions.md#un-register).

Domain တစ်ခုကို ဖန်တီးခြင်း (သို့) ဖယ်ရှားခြင်းအတွက် သင့်တော်တဲ့ domain-management ကို လိုအပ်ပါတယ်။
Active runtime validator ထဲက ခွင့်ပြုချက်ပါ။ Domain metadata ကို
[`SetKeyValue` နှင့် `RemoveKeyValue`](/my/blockchain/instructions.md#setkeyvalue-removekeyvalue)
အာဏာပိုင်က ဒီဒိုမီယန်ကို ပြောင်းလဲဖို့ ခွင့်ပြုချက်ရှိတဲ့အခါမှာပါ။

## ဒါကို စမ်းကြည့်ပါ။ Taira {#try-it-on-taira}

အများပြည်သူအတွက် လက်ရှိ မြင်နိုင်သော ဒိုမီနိုင်းများကို စာရင်းပေးပါ။ Taira testnet:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

အများသုံးလမ်းကြောင်းစာရင်းကို ဒေတာနေရာ အမည်မဲ့များသို့ ပြန်လည်ချိတ်ဆက်ပါ။

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Domain ရှိမရှိ စစ်ဆေးဖို့ app တစ်ခုလိုအပ်တဲ့အခါ ပထမအမိန့်ကို အသုံးပြုပါ။
ဒေတာနေရာတစ်ခု အများပြည်သူရှိမရှိကို အတည်ပြုဖို့လိုတဲ့အခါ လမ်းကြောင်းစာရင်း၊
ကန့်သတ်ထားတယ်၊ (သို့) အဓိကလမ်းကြောင်းနောက်ကျနေတာပါ။

Domain setup က fee ပေးတဲ့ စာသားပါ။ Taira, Save ကို
ရေနံရေချိုးစက်
[Testnet ကို ရယူပါ။ XOR အပေါ် Taira](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
အတိုင်း `taira_faucet_claim.py`, လက်မှတ်ရေးထိုးသူကို အများပြည်သူသုံး ရေပိုက်ကနေ ငွေကြေးထောက်ပံ့ပေးပြီး
ပေးသွင်းမှု ကုန်ကျစရိတ် မီတာဒေတာကို ချိတ်ဆက်ပါ

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

ထပ်ခါထပ်ခါ testnet run တွေမှာ ထူးခြားတဲ့ domain name တစ်ခုအတွက် intent ကို တည်ဆောက်ပြီး
Taira လက်ရှိ မူဝါဒနဲ့ အခွန်အင်းအမြစ် ကော်မရှင်ကို စောင့်ရှောက်ပါ။ ထုတ်ထားတဲ့ အစီအစဉ်ကို ပြန်လည်သုံးမနေပါနဲ့။
localnet အတွက် သို့မဟုတ် Minamoto.

## အခြားအဖွဲ့အစည်းများနှင့် ဆက်ဆံရေး {#relationship-to-other-entities}

Domain တွေက အုပ်စုစာအုပ်အရာဝတ္ထုတွေဖြစ်ပြီး domain-scoped data တွေအတွက် နာမည်နေရာတစ်ခုပေးတယ်။
Asset Definitions များတွင် domain-qualified identifiers များကို အသုံးပြုပြီး query များတွင် list လုပ်နိုင်ပါသည်။
Domain တွေကို ရှာဖွေခြင်း (သို့) domain တစ်ခုအတွက် scoped objects ကိုရှာဖွေခြင်း
လက်ရှိ ဒေတာပုံစံမှာ domainless ရှိပေမဲ့ အကောင့်တွေက domain တွေကို ပိုင်ဆိုင်နိုင်ပြီး
ဒိုမင်တွေအောက်မှာ အဓိပ္ပါယ်ဖွင့်ဆိုချက်ရှိတဲ့ အရင်းအမြစ်တွေပါ။

အောက်ပါအတိုင်းလည်း ကြည့်ပါ။

- [ကမ္ဘာကြီး](/my/blockchain/world.md)
- [အရင်းအမြစ်များ](/my/blockchain/assets.md)
- [မီတာဒေတာ](/my/blockchain/metadata.md)
- [အမည်ပေးခြင်းဆိုင်ရာ စည်းမျဉ်းများ](/my/reference/naming.md)
