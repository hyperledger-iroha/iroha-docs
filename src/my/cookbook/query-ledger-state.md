---
translation_locale: my
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# မေးမြန်းချက် blockchain ledger ပြည်နယ် {#query-ledger-state}

## ရလဒ် {#outcome}

Taira JSON ရင်းမြစ်များကို ဖတ်၍ လိုအပ်သော အကွက်များကို ရွေးထုတ်ပါ။ ထို့နောက် စစ်ထုတ်မှု၊ ရလဒ်စာမျက်နှာ ခွဲခြားမှု၊ စီခြင်း၊ တစ်ကြိမ်လျှင် ယူမည့် အရွယ်အစားနှင့် ရှေ့သို့သာ ဆက်ဖတ်နိုင်သော ကာဆာတို့ပါသည့် Iroha အမျိုးအစား သတ်မှတ်ထားသော ဒေတာတောင်းဆိုချက်များကို သုံးပါ။ ဆာဗာသည် လွှဲပို့ထားသည့် `--select` တန်ဖိုးစုကို အကဲဖြတ်မပြီးမီ ရွေးချယ်ကိရိယာ၏ အကွက်ထုတ်ယူမှုကို အားမကိုးပါနှင့်။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Node.js 24 နှင့် လျှပ်စစ် current `iroha` CLI တို့ကို တင်ပြထားသည်။
- ဖတ်လို့သာရတဲ့ Taira ဝင်ခွင့်။
- လက်မှတ်ထိုးထားသော အမျိုးအစားသတ်မှတ် ဒေတာတောင်းဆိုမှု နမူနာများအတွက် Taira သို့မဟုတ် ဖန်တီးထားသော စက်တွင်းကွန်ရက်၏ ကလိုင်းယင့်သတ်မှတ်ချက်ဖိုင်။
- Rust နမူနာမှာ ပရိုဂျက်တစ်ခုဟာ ရည်မှန်းချက်ကွန်ရက်နဲ့အတူတူ Iroha အရင်းအမြစ် ပြင်ဆင်မှုကို ချိတ်ဆက်ထားတာပါ။

## ခြေလှမ်း {#steps}

### (၁) အများပြည်သူ Taira အရင်းအမြစ်တစ်ခုမှ စာမျက်နှာတစ်မျက်နှာ {#_1-page-through-a-public-taira-resource}

Resource routes တွေဟာ dashboard နဲ့ smoke checks အတွက် အသုံးဝင်ပါတယ်။ JSON ကို မေးကြည့်ပါ၊ စာမျက်နှာတိုင်းကို ချိတ်ဆက်ပြီး တုံ့ပြန်မှုကို စစ်ဆေးပြီးတဲ့နောက်မှာ application က လိုအပ်တဲ့ field တွေပဲ project လုပ်ပါ။

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id:asc' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'offset=0' \
  --data-urlencode 'count_mode=exact' \
  | jq '{total, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const limit = 5
const seen = new Set()

for (let offset = 0; ; offset += limit) {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id:asc',
    limit: String(limit),
    offset: String(offset),
    count_mode: 'exact',
  })

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok)
    throw new Error(`Taira returned HTTP ${response.status}`)

  const page = await response.json()
  for (const domain of page.items) {
    if (seen.has(domain.id)) throw new Error(`duplicate ${domain.id}`)
    seen.add(domain.id)
    console.log(domain.id)
  }
  if (page.items.length < limit || seen.size >= page.total) break
}
```

:::

ဒီ HTTP မျက်နှာပြင်မှာ `limit` နဲ့ `offset` တို့ကို သုံးပါတယ်။ လမ်းကြောင်းက စျေးသက်သာတဲ့ ရေတွက်မှု mode ကိုသုံးတဲ့အခါ လွဲချော်ထားတဲ့ (သို့) နယ်နိမိတ်သတ်မှတ်ထားတဲ့ `total` ကို ပုံမှန်အတိုင်း ပြုလုပ်ပါ။

### (၂) CLI စာမေးပွဲကို စစ်ဆေးပြီး အစုလိုက်ဖြည့်ပါ။ {#_2-filter-and-batch-a-typed-cli-query}

CLI သည် ရိုက်နှိပ်နိုင်သော iterable query ကို serialize လုပ်ပြီး server ဆက်တိုက် cursors များကို အတွင်းပိုင်းတွင်လိုက်နာသည်။ ဤနေရာတွင် ယုတ္တိတန်သောရလဒ်သည်တစ်တန်းတည်းဖြင့်သာ ကန့်သတ်ထားပြီး `--fetch-size 1` သည်ပြန်လည်ခရီးစဉ်တစ်ခုလျှင်ရရှိသည့် အမြင့်ဆုံး batch ကိုထိန်းချုပ်သည်။

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

စာမျက်နှာရှာဖွေခြင်းမတိုင်မီ Filtering ဖြစ်ပေါ်သည်။ query-specific typeed predicate များကိုအသုံးပြုပါ။ အကောင့်တစ်ခု သို့မဟုတ် အရင်းအမြစ်အတွက် predicate ကို domain တစ်ခုအတွက် ဘေးကင်းစွာ ပြန်လည်သုံးလို့ မရပါ။

### 3. တည်ငြိမ်သော Metadata ကီးဖြင့် စီပါ {#_3-sort-by-a-stable-metadata-key}

အမျိုးအစားသတ်မှတ် ဒေတာတောင်းဆိုချက်သည် မက်တာဒေတာသော့တစ်ခု၏ တန်ဖိုးကို အဘိဓာန်အစီအစဉ်ဖြင့် စီသည်။ ထိုသော့မရှိသော မှတ်တမ်းများကို လည်ပတ်ချိန်စနစ်က သတ်မှတ်ထားသည့် အစီအစဉ်အတိုင်း ထည့်သွင်းသည်။ စုစည်းမှုတစ်ခုလုံးတွင် တန်ဖိုးထည့်သွင်းထားသည့် သော့ကို သုံးပါ။

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger account list all \
  --verbose \
  --sort-by-metadata-key key \
  --order asc \
  --limit 10 \
  --offset 0 \
  --fetch-size 2 \
  | jq '[.[] | {id, metadata}]'
```

မှတ်ပုံတင်ခံရသူ CLI ပဲခူး `--select` JSON Selector tuple ကို forward လုပ်ပေးတယ် ဒါပေမဲ့ လက်ရှိ lightweight query ကတော့ DSL server က selector ကို evaluate မလုပ်ဘူး။ projection contract ကို build မလုပ်ပါနဲ့။ SDK ပရိုဂျက်ကို ရည်ရွယ်တဲ့ ဆော့ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင်က ထောက်ပံ့ပြီးနောက်မှသာ ထုတ်လွှင့်ခြင်း (သို့မဟုတ်) validated result client-side project ကို `jq` ဒါမှမဟုတ် JavaScript အထက်ပါအတိုင်းပါ။

### (၄) Rust iterator ကို opaque cursors တွေကို လိုက်ပါအောင်လုပ်ပါ။ {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` က ယုတ္တိရလဒ်အစု၏ အကန့်အသတ်ကို သတ်မှတ်ပြီး `FetchSize` က ဆာဗာမှ တစ်ကြိမ်လျှင် ပြန်ပို့မည့် အစုအရွယ်အစားကို ထိန်းချုပ်သည်။ ပြန်ရလာသော အဆင့်လိုက် ဖတ်ရှုကိရိယာသည် ဆာဗာက ဖန်တီးပေးသည့် ကာဆာဖြင့် ဆက်လက်ဖတ်ရန် တောင်းဆိုချက်များကို အလိုအလျောက် ပို့သည်။

```rust
use std::num::NonZeroU64;

use iroha::data_model::{
    prelude::FindAssetsDefinitions,
    query::{
        builder::QueryBuilderExt as _,
        parameters::{FetchSize, Pagination},
    },
};

let definitions = client
    .query(FindAssetsDefinitions::new())
    .with_pagination(Pagination::new(NonZeroU64::new(25), 0))
    .with_fetch_size(FetchSize::new(NonZeroU64::new(5)))
    .execute_all()?;

for definition in definitions {
    println!("{} {}", definition.id(), definition.name());
}
```

`ForwardCursor` သည် ခွင့်ပြုချက် ချည်နှောင်ထားသည်၊ လုပ်ငန်းစဉ်-ဒေသတွင်းဖြစ်ပြီး ရှေ့သို့သာဖြစ်ပါသည်။ ၎င်းကို ဘယ်တော့မှ မစစ်ဆေးခြင်း၊ ပေါင်းစပ်ခြင်း၊ ခွင့်ပြုမှု မူဝါဒများအကြား မျှဝေခြင်း သို့မဟုတ် Torii ဖြစ်ရပ်များတွင် သယ်ဆောင်နိုင်သော resume token အဖြစ် ဆက်လက်တည်ရှိစေခြင်း။ ကုန်ဆုံးပါကမူ မူလဒေတာရှာဖွေတောင်းဆိုချက်ကို ရည်ရွယ်ပြီး application အဆင့် စစ်ဆေးရေးမှတ်တိုင်တစ်ခုဖြင့် ပြန်လည်စတင်ပါ။

## စစ်ဆေးပါ {#verify}

အတိအကျ domain filter က `wonderland.universal` ကိုသာ ပြန်ပို့သင့်ပါတယ်။ အောင်မြင်တဲ့ CLI ထွက်ပေါက်ကိုပဲ ရေတွက်တာထက် ရလဒ်ကို စစ်ဆေးပါ။

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Pageed application query တွေအတွက် ID တွေဟာ စာမျက်နှာတွေကြားမှာ ထပ်မဖြစ်အောင် စစ်ဆေးပါ၊ တောင်းဆိုထားတဲ့ ယုတ္တိတန်တဲ့ အကန့်အသတ်ကို ဘယ်တော့မှ မကျော်နိုင်ဘူး၊ သက်တမ်းကုန်သွားပြီးနောက် ကောက်ဆာက မှတ်တမ်းတင်ထားတဲ့ စစ်ဆေးရေးမှတ်တိုင်ကနေ ပြန်လည်စလုပ်ပါ။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- singular query သည် iterable filter, sorting, pagination သို့မဟုတ် fetch parameters ကိုလက်မခံပါ။ ထိုထိန်းချုပ်ချက်များလိုအပ်ပါက သက်ဆိုင်ရာစာရင်းမေးမြန်းမှုကိုအသုံးပြုပါ။
- `fetch_size` သည် သုညမဟုတ်သော batch အညွှန်းကိန်းဖြစ်ပြီး စုစုပေါင်းရလဒ်ကန့်သတ်ချက်မဟုတ်ပါ။ လက်ရှိအဓိပ္ပာယ်ဖွင့်ဆိုချက်သည် `100` ဖြစ်ပြီး ဆော့ဝဲလုပ်ဆောင်မှု ပတ်ဝန်းကျင်က ၎င်း၏ အများဆုံးထက်တန်ဖိုးများကို ပစ်ပယ်သည်။
- အမည်မသိ၊ သက်တမ်းကုန်ဆုံးပြီးသား (သို့) နိုင်ငံခြားကော်ဆာကို ရည်ရွယ်ချက်အရ ပြန်လည်သုံးလို့မရပါ။ မေးမြန်းမှုကို ပြန်စတင်ပါ၊ ပွင့်လင်းမြင်သာမှုမရှိတဲ့ တန်ဖိုးကို ပြင်ဆင်ဖို့ မကြိုးစားပါ။
- မက်တာဒေတာအလိုက် စီခြင်းကို မည်သည့်အကွက်မဆို စီရန် အသုံးမပြုနိုင်ပါ။ ရွေးထားသည့်သော့ကို မှတ်တမ်းတိုင်းတွင် မတွေ့ရပါက သော့မရှိသော မှတ်တမ်းများ၏ အစီအစဉ်ကို ဖော်ပြပါ သို့မဟုတ် အခြားနည်းကို ရွေးပါ။
- CLI က `--select` ကို ခြေရာခံပြီး ရှေ့ဆက်ပေးပေမဲ့ လက်ရှိ ဆာဗာက လွယ်ကူတဲ့ ရွေးချယ်သူ tuple ကို အကဲဖြတ်မထားပါ။ ဖြန့်ဖြူးထားတဲ့ ဆော့ဖ်ဝဲလ် လုပ်ဆောင်မှု ပတ်ဝန်းကျင်အတွက် ဆာဗားဘက်ရွေးချယ်သူ ထောက်ပံ့မှုကို စစ်ဆေးခြင်းမရှိရင် ဖောက်သည်ဘက် ပရိုဂျက်ကို အသုံးချပါ။
- ကျယ်ပြန့်တဲ့ အကန့်အသတ်မဲ့ မေးမြန်းချက်တွေဟာ ကွန်ရက်မှာ လုပ်ဖော်ကိုင်ဖက်အလုပ်၊ ဖောက်သည် မှတ်ဉာဏ်နဲ့ ညွှန်ပြသူသက်တမ်း အန္တရာယ်ကို မြှင့်တင်ပေးပါတယ်။ သုံးစွဲသူအတွက် သင့်လျော်တဲ့ ယုတ္တိတန်တဲ့ ကန့်သတ်ချက်တစ်ခုနဲ့ ရယူမှုအရွယ်အစားတစ်ခုကို သတ်မှတ်ပါ။
- အများပြည်သူ JSON အရင်းအမြစ်ပမာဏများနှင့် လက်မှတ်ရေးထိုးထားသော typeed query parameters တို့သည် ဆက်စပ်သော်လည်း လဲလှယ်နိုင်သည့် serialization formats များမဟုတ်ပါ။ Typeed query data container များအတွက် SDK သို့မဟုတ် CLI ကိုသာ ကြိုက်သည်။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [သတ်မှတ်ထားသော ရင်းမြစ်ဗားရှင်းရှိ ကာဆာသုံး စာမျက်နှာခွဲ ပေါင်းစပ်စမ်းသပ်ချက်များ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Query Builder နှင့် Selector အပြုအမူများကို pinned source-code ပြင်ဆင်မှု](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [သတ်မှတ်ထားသော ရင်းမြစ်ဗားရှင်းရှိ ဒေတာတောင်းဆိုမှု သတ်မှတ်ချက်များနှင့် ကာဆာမော်ဒယ်](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [Query များ](/my/blockchain/queries.md)
- [မေးမြန်းချက် အကိုးအကား](/my/reference/queries.md)
- [JavaScript နှင့် TypeScript](/my/guide/tutorials/javascript.md)
