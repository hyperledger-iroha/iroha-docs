---
translation_locale: my
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: a81f6cc04befb0b92a0a01c2cb3c1ecbbc631ce1f2a923cb046241c295db7806
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Query Ledger ပြည်နယ် {#query-ledger-state}

## ရလဒ် {#outcome}

Taira JSON အရင်းအမြစ်များကိုဖတ်ပြီး ပရိုဂျက်ပါ၊ ထို့နောက် filter များ၊ ယုတ္တိတန်သော pagination, sorting, fetch အရွယ်အစားများနှင့် forward-only cursor ဆက်လက်မှုရှိသည့် Iroha typeed queries ကိုအသုံးပြုပါ။ သင်သည် server သည် forwarded `--select` tuple ကို အကဲဖြတ်မပေးမီက selector projection ကို အားကိုးခြင်းမှလည်း ရှောင်ရှားနိုင်ပါသည်။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Node.js 24 နှင့် လျှပ်စစ် current `iroha` CLI တို့ကို တင်ပြထားသည်။
- ဖတ်လို့သာရတဲ့ Taira ဝင်ခွင့်။
- လက်မှတ်ရေးထိုးထားသော typeed query နမူနာများအတွက် Taira အတွက် client config သို့မဟုတ် generated local network ကို အသုံးပြုပါ။
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

CLI သည် ရိုက်နှိပ်နိုင်သော iterable query ကို serialize လုပ်ပြီး server ဆက်တိုက် cursors များကို အတွင်းပိုင်းတွင်လိုက်နာသည်။ ဤနေရာတွင် ယုတ္တိတန်သောရလဒ်သည်တစ်တန်းတည်းဖြင့်သာ ကန့်သတ်ထားပြီး `--fetch-size 1` သည်ပြန်လည်ခရီးစဉ်တစ်ခုလျှင်ရရှိသည့် အများဆုံး batch ကိုထိန်းချုပ်သည်။

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

စာမျက်နှာရှာဖွေခြင်းမတိုင်မီ Filtering ဖြစ်ပေါ်သည်။ query-specific typeed predicate များကိုအသုံးပြုပါ။ အကောင့်တစ်ခု သို့မဟုတ် အရင်းအမြစ်အတွက် predicate ကို domain တစ်ခုအတွက် ဘေးကင်းစွာ ပြန်လည်သုံးလို့မရပါ။

### (၃) တည်ငြိမ်တဲ့ metadata key နဲ့ sort လုပ်ပါ။ {#_3-sort-by-a-stable-metadata-key}

Typed query sorting သည် metadata key တစ်ခုပေါ် lexicographic ဖြစ်ပါသည်။ ထို key မရှိသော items များသည် runtime ၏သတ်မှတ်ထားသောအစီအစဉ်ကိုလိုက်နာကြသည်၊ ထို့ကြောင့် စုစည်းမှုတစ်ခုလုံးတွင်ဆက်မပြတ်ပြည့်စုံသော key ကိုအသုံးပြုပါ။

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

မှတ်ပုံတင်ခံရသူ CLI ပဲခူး `--select` JSON Selector tuple ကို forward လုပ်ပေးတယ် ဒါပေမဲ့ လက်ရှိ lightweight query ကတော့ DSL server က selector ကို evaluate မလုပ်ဘူး။ projection contract ကို build မလုပ်ပါနဲ့။ SDK ပရိုဂျက်ကို ရည်မှန်းချက် runtime ကိုထောက်ပံ့ပြီးနောက်မှသာ project သို့မဟုတ် validated ရလဒ် client-side နှင့် project `jq` ဒါမှမဟုတ် JavaScript အထက်ပါအတိုင်းပါ။

### (၄) Rust iterator ကို opaque cursors တွေကို လိုက်ပါအောင်လုပ်ပါ။ {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` သည် logical result set ကိုသတ်မှတ်သည်။ `FetchSize` သည် server batch တစ်ခုစီကိုထိန်းချုပ်သည်။ ပြန်လာသော iterator က server-generated cursor ကိုအသုံးပြုပြီး ဆက်လက်တောင်းဆိုချက်များကို ပွင့်လင်းမြင်သာစွာပို့ပေးသည်။

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

`ForwardCursor` သည်အာဏာပိုင်သတ်မှတ်ထားသော, လုပ်ငန်းစဉ်-ဒေသခံ, နှင့် ရှေ့သို့သာဖြစ်သည်. ၎င်းကို ဘယ်တော့မှစစ်ဆေးခြင်း၊ ပေါင်းစပ်ခြင်း၊ အာဏာပိုင်များအကြားမျှဝေခြင်း၊ သို့မဟုတ် Torii နမူနာများအတွင်းတွင် portable resume token အဖြစ်ဆက်ရှိနေခြင်းမရှိပါ။ သက်တမ်းကုန်ပါက မူလမေးခွန်းကိုရည်ရွယ်ချက်ရှိ application အဆင့် စစ်ဆေးရေးဂိတ်တစ်ခုဖြင့် restart လုပ်ပါ။

## စစ်ဆေးပါ {#verify}

အတိအကျ domain filter က `wonderland.universal` ကိုသာ ပြန်ပို့သင့်ပါတယ်။ အောင်မြင်တဲ့ CLI ထွက်ပေါက်ကိုပဲ ရေတွက်တာထက် ရလဒ်ကို စစ်ဆေးပါ။

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Pageed application query တွေအတွက် IDs ကို စာမျက်နှာတွေကြားမှာ ထပ်မလုပ်၊ တောင်းဆိုထားတဲ့ ယုတ္တိတန်တဲ့ အကန့်အသတ်ကို ဘယ်တော့မှ မကျော်နိုင်အောင် စစ်ဆေးပြီး သက်တမ်းကုန်သွားတဲ့ နှောင့်ယှက်ကိရိယာက မှတ်တမ်းတင်ထားတဲ့ စစ်ဆေးရေးဂိတ်တစ်ခုကနေ ပြန်လည်စတင်ဖို့လည်း စမ်းသပ်ပါ။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- singular query သည် iterable filter, sorting, pagination သို့မဟုတ် fetch parameters ကိုလက်မခံပါ။ ထိုထိန်းချုပ်ချက်များလိုအပ်ပါက သက်ဆိုင်ရာစာရင်းမေးမြန်းမှုကိုအသုံးပြုပါ။
- `fetch_size` သည် သုညမဟုတ်သော batch အညွှန်းတစ်ခုဖြစ်ပြီး စုစုပေါင်းရလဒ်ကန့်သတ်ချက်မဟုတ်ပါ။ လက်ရှိအဓိပ္ပာယ်ဖွင့်ဆိုချက်သည် `100` ဖြစ်ပြီး runtime က ၎င်း၏ အမြင့်ဆုံးထက်တန်ဖိုးများကို ပစ်ချသည်။
- အမည်မသိ၊ သက်တမ်းကုန်ဆုံးပြီးသား (သို့) နိုင်ငံခြားကော်ဆာကို ရည်ရွယ်ချက်အရ ပြန်လည်သုံးလို့မရပါ။ မေးမြန်းမှုကို ပြန်စတင်ပါ၊ ပွင့်လင်းမြင်သာမှုမရှိတဲ့ တန်ဖိုးကို ပြင်ဆင်ဖို့ မကြိုးစားပါ။
- metadata sorting က general field sorting မဟုတ်ပါ။ item တစ်ခုချင်းစီမှာ ရွေးချယ်ထားတဲ့ key မပါရင် missing-key order ကို မှတ်တမ်းတင်လိုက်ပါ။ (သို့) အခြားနည်းဗျူဟာတစ်ခုကို ရွေးပါ။
- CLI က `--select` ကို ခြေရာခံပြီး ရှေ့ဆက်ပေးပေမဲ့ လက်ရှိ ဆာဗာက လွယ်ကူတဲ့ ရွေးချယ်သူ tuple ကို အကဲဖြတ်ခြင်းမရှိပါ။ ဖြန့်ချိထားသော runtime အတွက် server-side selector support ကို စစ်ဆေးမထားရင် client-side projection ကိုအသုံးပြုပါ။
- ကျယ်ပြန့်တဲ့ အကန့်အသတ်မဲ့ မေးမြန်းမှုတွေက အဖော်အလုပ်၊ ဖောက်သည် မှတ်ဉာဏ်နဲ့ ညွှန်ပြသူ သက်တမ်းအန္တရာယ်ကို မြှင့်တင်ပေးတယ်။ သုံးစွဲသူအတွက် သင့်လျော်တဲ့ ယုတ္တိတန်တဲ့ ကန့်သတ်ချက်တစ်ခုနဲ့ ရယူမှု အရွယ်အစားတစ်ခုကို သတ်မှတ်ပါ။
- အများပြည်သူ JSON အရင်းအမြစ်ပမာဏများနှင့် လက်မှတ်ရေးထိုးထားသော typeed query parameters တို့သည် ဆက်စပ်သော်လည်း လဲလှယ်နိုင်သည့် wire formats များမဟုတ်ပါ။ typeed query envelopes အတွက် SDK သို့မဟုတ် CLI ကိုသာ ကြိုက်သည်။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [Cursor-backed pagination integration tests at the pinned commit ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/pagination.rs)
- [Query Builder နှင့် Selector အပြုအမူကို pinned commit တွင်](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Query parameters and cursor model at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/query/parameters.rs)
- [မေးမြန်းချက်များ ](/my/blockchain/queries.md)
- [မေးမြန်းချက် မှတ်တမ်း ](/my/reference/queries.md)
- [JavaScript နှင့် TypeScript](/my/guide/tutorials/javascript.md)
