---
translation_locale: my
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# အဖြစ်အပျက် trigger နမူနာ {#event-trigger-example}

ဤဥပမာသည် Iroha 3 ဒေတာမော်ဒယ်တွင် single protocol-standard domainless account ID များနှင့် projected asset definitions များကို အသုံးပြုသည်။

ကွန်ရက်တစ်ခုမှာ:

- Alice ခလုတ်ဖြင့် ထိန်းချုပ်သော Single Protocol Standard Account တစ်ခု
- Mad Hatter ခလုတ်ဖြင့် ထိန်းချုပ်သော Single Protocol Standard Account တစ်ခု
- `wonderland.universal` အောက်တွင် `tea` အဖြစ်ခန့်မှန်းထားသော အရင်းအမြစ်အနက်ကောက်ချက်
- အကောင့်တစ်ခုစီမှာရှိတဲ့ အရင်းအမြစ်စာရင်း

ရည်ရွယ်ချက်က Alice ရဲ့ လက်ဖက်စာရင်းကို စောင့်ကြည့်ပြီး ကိုက်ညီတဲ့ ဒေတာဖြစ်ရပ် ထုတ်လွှင့်တဲ့အခါ Mad Hatter အကောင့်ကနေ ငွေလွှဲပြောင်းမှုကို တင်ပြတဲ့ trigger ကို မှတ်ပုံတင်ဖို့ပါ။

## (၁) စာရင်းများနှင့် အရင်းအမြစ်များကို ပြင်ဆင်ခြင်း {#_1-prepare-accounts-and-assets}

ပူးပေါင်းဆောင်ရွက်မှုစာရင်းများနှင့် အရင်းအမြစ် သတ်မှတ်ချက်များကို ပထမဆုံး မှတ်ပုံတင်ပါ။ လက်ရှိ Iroha မှာ အကောင့် ID တွေက အကောင့်ထိန်းချုပ်သူတွေကနေ လာပြီး စီစဉ်ထားတဲ့ ဒိုမင်တွေမှာတော့ `domain.dataspace` ပုံစံကို သုံးပါတယ်။

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်မှာ ပရိုတိုကောစံညွှန်းတစ်ခုတည်းသော မရှင်းလင်းတဲ့လိပ်စာရှိဆဲပါ။ မှတ်ပုံတင်ပြီးနောက် ဒီလိပ်စာကို သိမ်းဆည်း (သို့) မေးမြန်းပြီး trigger လုပ်ဆောင်မှုတွင် အသုံးပြုပါ။

## (၂) trigger authorization principal ကို ရွေးချယ်ပါ။ {#_2-choose-the-trigger-authority}

trigger ၏ နည်းပညာအကောင့်ကို တတ်နိုင်သလောက် ရည်စူးထားသော အကောင့်တစ်ခုသို့ သတ်မှတ်ပါ။ ရည်စူးထားတဲ့ အကောင့်သည် trigger ကိုလုပ်ဆောင်ရန်လိုအပ်သည့် ခွင့်ပြုချက်များကို ရှင်းလင်းစေပြီး trigger ကို operator ၏ကိုယ်ပိုင် လက်မှတ်ရေးထိုးမှု သော့နှင့် ချိတ်ဆက်ခြင်းကိုရှောင်ရှားသည်။

Technical account က ရှိပြီးသား ဖြစ်ဖို့လိုပြီး ညွှန်ကြားချက်တွေကို trigger executable ထဲမှာ တင်ဖို့ ခွင့်ပြုချက်ရှိဖို့လိုပါတယ်။

## (၃) အကောင်အထည်ဖော်လို့ရတဲ့ ကိရိယာကို သတ်မှတ်ပါ။ {#_3-define-the-executable}

event filter ကိုက်ညီတဲ့အခါ trigger ကပို့တဲ့ ညွှန်ကြားချက်အစဉ်ကို executable လို့ခေါ်ပါတယ်။ ဒီဥပမာမှာ transfer တစ်ခုပါဝင်ပါတယ်:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

SDK ၏ လက်ရှိရိုက်ကူးထားသော builders များကို နောက်ဆုံး ငွေချေးမှု အသုံးဝင်ဝန်ဆောင်မှုအတွက်အသုံးပြုပါ။ trigger code တွင် hard-coding စာသား ID အဟောင်းများကိုရှောင်ရှားပါ; စီမံခန့်ခွဲနိုင်သော ID ကို တည်ဆောက်မတိုင်မီ single protocol-standard ID များကိုစစ်ဆေးခြင်း သို့မဟုတ် မေးမြန်းခြင်း။

## 4. အဖြစ်အပျက် filter ကို သတ်မှတ်ပါ။ {#_4-define-the-event-filter}

သင် ဂရုစိုက်တဲ့ အရာဝတ္ထုကို ဖြစ်ရပ်တွေကို ကျဉ်းမြောင်းစေတဲ့ ဒေတာဖြစ်စဉ် စစ်ဆေးမှုကို သုံးပါ။

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

`AcceptAll` Filter ကို Debug လုပ်ဖို့ အသုံးဝင်ပေမဲ့ လိုက်ဖက်တဲ့ ဖြစ်ရပ်တိုင်းက trigger evaluation ရဲ့ ကုန်ကျစရိတ်ကို ပေးပါတယ်။

## (၅) trigger ကို မှတ်ပုံတင်ပါ။ {#_5-register-the-trigger}

trigger ကို မှတ်ပုံတင်ပါ

- စခန်းတစ်ခု `TriggerId`
- အကောင်အထည်ဖော်နိုင်သော ညွှန်ကြားချက် အစဉ်
- `Repeats::Indefinitely` သို့မဟုတ် `Repeats::Exactly(n)`
- နည်းပညာစာရင်း
- အဖြစ်အပျက် စစ်ဆေးမှု
- ရွေးချယ်စရာ metadata

Trigger မှတ်ပုံတင်ခြင်းသည် ပုံမှန်ကုန်သွယ်မှုတစ်ခုဖြစ်သည်၊ ထို့ကြောင့် မှတ်ပုံတင်စာရင်းက trigger များကိုမှတ်ပုံတင်ရန် ခွင့်ပြုချက်လိုအပ်သည်။ နည်းပညာစာရင်းသည် trigger အကောင်အထည်ဖော်နိုင်သည့်အတွက် လိုအပ်သော ခွင့်ပြုချက်တွေလိုအပ်သည်။

## အမိန့်ချမှတ်ချက် {#execution-order}

Block တစ်ခုကို လုပ်ဆောင်တဲ့အခါ:

1. ပုံမှန် ငွေပေးချေမှု ညွှန်ကြားချက်တွေကို အရင်လုပ်ပါ။
2. အဲဒီ ညွှန်ကြားချက်တွေကနေ ထုတ်တဲ့ အချက်အလက်တွေကို စုစည်းပါတယ်။
3. ဒီဖြစ်ရပ်တွေနဲ့ ဆင်တူတဲ့ စစ်ဆေးချက်ရှိတဲ့ trigger တွေကို အစီအစဉ်ချထားပါတယ်။
4. trigger-produced effects တွေကို block execution software processing workflow မှာ ထိန်းချုပ်ထားပြီး Restricted recursive trigger execution ကို မပြုလုပ်ဘဲ ပြုပြင်ပေးပါတယ်။

trigger တစ်ခုမှာ `Repeats::Exactly(n)` ကိုသုံးတယ်ဆိုရင် count ပြီးသွားတဲ့အခါ trigger အသစ်တစ်ခုကို မှတ်တမ်းတင်ပြီး အလားတူ ပြုမူမှုကို ထပ်လုပ်ဖို့လိုပါတယ်။
