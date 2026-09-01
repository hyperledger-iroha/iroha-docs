---
translation_locale: my
translation_source: /blockchain/queries.md
translation_source_hash: 234c831c97bb93996e6cf51505921ff509e233408cf2faf6a9b23641e5642040
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# မေးခွန်းများ {#queries}

Event subscribers နဲ့ filters တွေက blockchain state ထဲမှာ ဖြစ်ပေါ်နေတဲ့ ပြောင်းလဲမှုတွေကို ခြေရာခံနိုင်ပါတယ်။ လက်ရှိအခြေအနေကို တိုက်ရိုက်ကြည့်ဖို့ လိုအပ်တဲ့အခါ query ကို အသုံးပြုပါ။

မေးမြန်းချက်တွေဟာ ညွှန်ကြားချက်တွေလို အရာဝတ္ထုလေးတွေပါ။ လက်ရှိကမ္ဘာအခြေအနေအမြင်ရဲ့ အသေးစိတ်အချက်အလက်ကိုရယူဖို့ Iroha ကွန်ရက်တူညီသူဆီ တစ်လုံးပို့လိုက်ပါ။

ကွန်ရက်တစ်ခုက အခြားသတင်းအချက်အလက်တွေကို ဖေါ်ပြနိုင်သည်။ ရှာဖွေလို့ရတဲ့ ကမ္ဘာ့နိုင်ငံဆိုင်ရာ သတင်းအချက်အလက်တွေဟာ Iroha ကွန်ရက်တိုင်းမှာ ရရှိနိုင်ခြေ အာမခံထားတဲ့ တစ်ခုတည်းသော အမျိုးအစားပါ။

Iroha ကို ဖြန့်ချိမှုတစ်ခုစီအတွက် အခြားသတင်းအချက်အလက်များရှိနိုင်သည်။ ဥပမာ၊ တယ်လီမက်ထရီဒေတာတွေရရှိမှုဟာ ကွန်ရက် အုပ်ချုပ်ရေးမှူးများအပေါ် မူတည်ပါတယ်။ တကယ်အလုပ်လုပ်ဖို့ သုံးမယ့်အစား အလုပ်ကို ခြေရာခံဖို့ စီမံခန့်ခွဲမှုစွမ်းအားဖြည့်ဆည်းပေးချင်၊မလုပ်ချင်တာ သူတို့ ဆုံးဖြတ်ချက်တစ်ခုလုံးပါ။ ဆန့်ကျင်ဘက်အနေနဲ့ တစ်ချို့လုပ်ဆောင်ချက်တွေဟာ အမြဲတမ်းလိုအပ်တယ်၊ ဥပမာ သင့်အကောင့်ရဲ့ ငွေကြေးစာရင်းဆီ ဝင်ခွင့်ရှိခြင်း။

[အမျိုးအစားခွဲ](#sorting), [စာမျက်နှာများ](#pagination) နှင့် [စစ်ဆေးထားသည်](#filters) တို့ကို တပြိုင်နက်တည်းမေးမြန်းနိုင်သည်။ metadata key များတွင် lexicographically sorting ပြုလုပ်ပါသည်။ Filtering လုပ်နိုင်သည်။ နယ်ပယ်သတ်မှတ်ချက်များ (ပုဂ္ဂိုလ်တစ်ဦးချင်း IP address filter mask များ) မှ `begins_with` ကဲ့သို့သော substring method များအတွက် logical operations ကိုသုံးပြီး ပေါင်းစပ်ထားသည်အထိ။

## Taira တွင် ဤအလုပ်ခွင်ကို run လုပ်ပါ။ {#try-it-on-taira}

Taira သည် အများသုံးအရင်းအမြစ်များအတွက် JSON ကိုသာ ဖတ်နိုင်သော မေးမြန်းမှုကူညီသူများကို ဖော်ပြပေးသည်။ SDK ကို ကြိုးသွင်းခြင်းမတိုင်မီ စာမျက်နှာပြုပြင်ခြင်းနှင့် တုံ့ပြန်မှု စီမံခန့်ခွဲမှုကို လေ့ကျင့်ရန်အသုံးပြုပါ:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

App ရောဂါရှာဖွေရေးအတွက် ဒီမီးခိုးစစ်ဆေးမှုကို လက်မှတ်ထိုးထားတဲ့ ငွေချေးမှုစမ်းသပ်ချက်တွေနဲ့ သီးခြားထားပါ။ ဖတ်ခြင်းသာရှိတဲ့ မေးမြန်းမှု ပျက်ကွက်မှုက API အဆုံးသတ်မှတ်ချက်ရရှိနိုင်မှု၊ ကွန်ရက်ရောက်ရှိနိုင်မှု (သို့) လမ်းကြောင်းလိုက်ဖက်မှု ကို ညွှန်ပြရာမှာ ပရိုဂရမ်လက်မှတ်ထိုးသူကို ချိတ်ဆက်မပေးခင် ညွှန်ကြားလေ့ရှိပါတယ်။

## မေးမြန်းမှု ဖန်တီးခြင်း {#create-a-query}

SDK (သို့) CLI မှ typeed query builders ကိုအသုံးပြုပါ။ ဥပမာ၊ လက်ရှိဒေတာပုံစံက စာရင်းတင်စာရင်းအတွက် `FindAccounts` ကို ဖော်ပြပါတယ်။

```rust
let query = FindAccounts;
```

Alice ရဲ့ အရင်းအမြစ်တွေကို ရှာဖွေတဲ့ မေးမြန်းမှုတစ်ခုရဲ့ ဥပမာက အောက်ပါအတိုင်းပါ။

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## စာမျက်နှာရှာဖွေခြင်း {#pagination}

တစ်ပုဒ်တည်းသော မေးမြန်းချက်များနှင့် အသေးစား အပြန်အလှန်မေးမြန်းနိုင်သည့် မေးမြန်းမှုများအတွက် `client.request` ကို အသုံးပြု၍ မေးမြန်းချက်ကို တင်ပြပြီး ရလဒ်ကို တစ်ကြိမ်တည်းရယူနိုင်သည်။

သို့သော်လည်း `FindAccounts`, `FindAssets` သို့မဟုတ် `FindBlocks` ကဲ့သို့သော ကျယ်ပြန့်သော အပြန်အလှန်မေးမြန်းနိုင်သည့် မေးမြန်းချက်များသည် ကြီးမားသော ရလဒ်စုများကို ပြန်လည်ပေးပို့နိုင်သည်။ ကွန်ရက် peer နှင့် client များတွင် ဝန်ထမ်းမှုလျှော့ချရန် pagination ကိုအသုံးပြုပါ။

`Pagination` ကို တည်ဆောက်ရန်အတွက် `client.request_with_pagination(query, pagination)` ကို ခေါ်ယူရန် လိုအပ်ပြီး `pagination` ကို အောက်ပါအတိုင်း တည်ဆောက်ထားသည်။

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Filters များ {#filters}

မေးမြန်းချက်တစ်ခု ဖန်တီးတဲ့အခါ သတ်မှတ်ထားတဲ့ စစ် filter နဲ့ ကိုက်ညီတဲ့ ရလဒ်တွေကိုပဲ ပြန်ပို့ဖို့ filter တစ်ခုကို အသုံးပြုနိုင်ပါတယ်။

Filters တွေဟာ query-specific ဖြစ်ပါတယ် ဥပမာ Account queries တွေကို account identity (သို့) metadata တွေနဲ့ ကျဉ်းမြောင်းနိုင်ပြီး Asset queries ကို asset နဲ့ ကျဉ်းမြုပ်စေနိုင်ပါတယ်။ Definition, holder account, or domain projection. SDK ရဲ့ typeed query builders တွေကို အသုံးပြုပြီး filter အမျိုးအစားက query output အမျိုးအစားနဲ့ ကိုက်ညီစေဖို့ ဖြစ်နိုင်ခြေရှိပါ။

## အမျိုးအစားခွဲခြင်း {#sorting}

Iroha သည် စာမေးပွဲတည်ဆောက်ရာတွင် sort လုပ်ရန် key ကိုပေးပါက [metadata များ](/my/blockchain/metadata.md) နှင့်အတူ lexicographically items များကို sort လုပ်နိုင်သည်။ သာမန်အသုံးပြုမှုဖြစ်ရပ်တစ်ခုမှာ အကောင့်များအတွက် `registered-on` metadata entry ရှိသည်၊ ဤသို့ sorted ဖြစ်သောအခါ, အကောင့်မှတ်ပုံတင်သမိုင်းကိုကြည့်ရှုခွင့်ပြုသည်။

Sorting က [metadata များ](/my/blockchain/metadata.md) ရှိတဲ့ entities တွေကိုသာ သက်ရောက်ပါတယ်၊ query ရလဒ်တွေကို sort လုပ်ဖို့ metadata key ကို သုံးလို့ပါ။

Pagination နဲ့ Filter တွေကို ပေါင်းစပ်လို့ရပါတယ်။ Pagination ပါတဲ့ Query အများစုမှာ မလိုတော့ဘူး ဆိုတာကို သတိထားပါ။

## ရည်ညွှန်းချက် {#reference}

[ရှိနေတဲ့ မေးမြန်းချက်စာရင်း](/my/reference/queries.md) ကို စစ်ဆေးပြီး သူတို့အကြောင်း အသေးစိတ်သိရှိလိုပါသေးတယ်။
