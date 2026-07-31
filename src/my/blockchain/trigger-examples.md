---
translation_locale: my
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဖြစ်ရပ် trigger နမူနာ {#event-trigger-example}

ဒီဥပမာမှာ Canonic Domainless Account ကို အသုံးပြုပါတယ်။ IDs စီမံကိန်းအရင်းအမြစ်
အနက်ကောက်ချက်များ Iroha 3 ဒေတာပုံစံ။

ကွန်ရက်တစ်ခုမှာ

- Alice ရဲ့ Key က ထိန်းချုပ်ထားတဲ့ Canonical Account တစ်ခုပါ။
- Mad Hatter ရဲ့ သော့က ထိန်းချုပ်တဲ့ တရားဝင်စာရင်းပါ။
- အရင်းအမြစ် သတ်မှတ်ချက် `tea` အောက် `wonderland.universal`
- အကောင့်တိုင်းမှာရှိတဲ့ အရင်းအမြစ်စာရင်း

ရည်ရွယ်ချက်က Alice ရဲ့ လက်ဖက်ရည် ဟန်ချက်ညီမှုကို စောင့်ကြည့်တဲ့ trigger တစ်ခုကို မှတ်တမ်းတင်ဖို့ပါ။
Mad Hatter အကောင့်မှ ငွေလွှဲပြောင်းမှုကို တင်ပြသည်
ထုတ်လွှင့်လိုက်ပါတယ်။

## (၁) စာရင်းများနှင့် အရင်းအမြစ်များကို ပြင်ဆင်ခြင်း {#_1-prepare-accounts-and-assets}

ပူးပေါင်းဆောင်ရွက်နေသောစာရင်းများနှင့် အရင်းအမြစ် သတ်မှတ်ချက်များကို ပထမဦးဆုံး မှတ်ပုံတင်ပါ။
လက်ရှိ Iroha, အကောင့် IDs Account controller တွေဆီက လာတယ်
ဒိုမင်များ အသုံးပြုခြင်း `domain.dataspace` ပုံစံ:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

Asset Definition မှာ Canonical opaque address ရှိတုန်းပါ။
မှတ်ပုံတင်ပြီးတဲ့နောက်မှာ အမည်ပေးထားပြီး trigger လုပ်ဆောင်မှုထဲမှာ သုံးပါ။

## (၂) trigger authority ကို ရွေးချယ်ပါ။ {#_2-choose-the-trigger-authority}

ဖြစ်နိုင်ရင် trigger ရဲ့ နည်းပညာ အကောင့်ကို သီးသန့် အကောင့်တစ်ခုမှာ သတ်မှတ်ပါ။
trigger အတွက် ခွင့်ပြုချက်တွေက ဘာတွေလိုအပ်လဲဆိုတာ သီးသန့်စာရင်းက ရှင်းလင်းစေပါတယ်။
အပြီးသတ်ခြင်းနှင့် operator ၏ ကိုယ်ပိုင်လက်မှတ်နှင့် trigger ကိုဆက်စပ်ခြင်းကို ရှောင်ရှားသည်
သော့ပါ။

နည်းပညာစာရင်းက ရှိပြီးသား ဖြစ်ဖို့လိုပြီး
ထရီဂါ executable ထဲက ညွှန်ကြားချက်တွေ။

## (၃) အပြီးသတ်နိုင်တာကို သတ်မှတ်ပါ။ {#_3-define-the-executable}

executable က event မှာ trigger က ပေးတဲ့ ညွှန်ကြားချက် အစဉ်ပါ။
Filter Matches တွေကို ပြပေးပါ

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

သုံးပါ SDK နောက်ဆုံး ငွေပေးချေမှုအတွက် လက်ရှိ ရိုက်နှိပ်ထားသော ဆောက်လုပ်ရေးသမားများ။
စာသားအဟောင်းကို hard-coding IDs trigger code ထဲမှာ; parse သို့မဟုတ် query canonical IDs
အကောင်အထည်ဖော်နိုင်တဲ့ ကိရိယာကို မဆောက်ခင်မှာပါ။

## 4. ဖြစ်ရပ် filter ကို သတ်မှတ်ပါ {#_4-define-the-event-filter}

သင် ဂရုစိုက်တဲ့ အရာဝတ္ထုကို အဖြစ်အပျက်တွေကို ကျဉ်းမြောင်းစေတဲ့ ဒေတာဖြစ်ရပ် စစ်ဆေးမှုကို သုံးပါ။

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

Filters တွေကို လက်တွေ့ကျသလို တိကျအောင် ထိန်းထားပါ။ `AcceptAll` filter ကို အသုံးဝင်ပါတယ်။
Debugging လုပ်နေပေမဲ့ match event တစ်ခုချင်းစီက trigger ကုန်ကျစရိတ်ကို ပေးဆပ်ပေးတယ်။
အကဲဖြတ်ခြင်း။

## (၅) trigger ကို မှတ်ပုံတင်ပါ။ {#_5-register-the-trigger}

Trigger ကို:

- ခိုလှုံခန်း `TriggerId`
- လုပ်ဆောင်နိုင်သော ညွှန်ကြားချက် အစဉ်
- `Repeats::Indefinitely` ဒါမှမဟုတ် `Repeats::Exactly(n)`
- နည်းပညာစာရင်း
- ဖြစ်ရပ် စစ်ဆေးမှု
- ရွေးချယ်စရာ metadata

Trigger မှတ်ပုံတင်ခြင်းသည် သာမန်လုပ်ငန်းတစ်ခုဖြစ်သည်
account က trigger တွေကို မှတ်ပုံတင်ဖို့ ခွင့်ပြုချက် လိုအပ်ပါတယ်။
trigger executable အတွက် လိုအပ်တဲ့ ခွင့်ပြုချက်များ။

## အမိန့်ချမှတ်ချက် {#execution-order}

Block တစ်ခုကို လုပ်ဆောင်တဲ့အခါမှာ

1. ပုံမှန် ငွေပေးချေမှု ညွှန်ကြားချက်တွေကို အရင်လုပ်ပါ။
2. ဒီညွှန်ကြားချက်တွေကနေ ထုတ်တဲ့ ဒေတာဖြစ်ရပ်တွေကို စုစည်းပါတယ်။
3. ဒီဖြစ်ရပ်တွေနဲ့ ဆင်တူတဲ့ စစ်ဆေးချက်ရှိတဲ့ trigger တွေကို အစီအစဉ်ချထားတယ်။
4. trigger-produced effects တွေကို block execution pipeline ထဲမှာ handle လုပ်ပေးတယ်
   ကန့်သတ်ချက်မရှိတဲ့ recursive trigger execution ကိုခွင့်ပြုပါတယ်။

တော့ trigger သုံးရင် `Repeats::Exactly(n)`, စာရင်းသွင်းတဲ့အခါ trigger အသစ်တစ်ခု မှတ်ပုံတင်ပါ။
အားကုန်သွားပြီး အလားတူ ပြုမူမှု ထပ်မံလိုအပ်ပါတယ်။
