---
translation_locale: my
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# မေးမြန်းချက် blockchain ledger ပြည်နယ် {#query-ledger-state}

## ရလဒ် {#outcome}

Taira JSON အရင်းအမြစ်များကို ဖတ်ပြီး project လုပ်ပါ၊ ထို့နောက် CLI နှင့် Rust SDK မှ Torii collection query များကို filter များ၊ sorting၊ server ဘက်ခြမ်း projection၊ စာမျက်နှာ ကန့်သတ်ချက်များနှင့် opaque `next_cursor` ဆက်လက်ဖတ်ရှုမှုတို့ဖြင့် အသုံးပြုပါ။ သင်သည် စာရင်းပြုစုခြင်းကို လက်မှတ်ထိုးထားသော typed query များဖြင့် မပြုလုပ်ဘဲ ထားရှိမည်ဖြစ်ပြီး အကြောင်းမှာ ယင်း query များသည် စာရင်းများကို filter၊ sort သို့မဟုတ် project မလုပ်သောကြောင့် ဖြစ်သည်။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Node.js 24 နှင့် လျှပ်စစ် current `iroha` CLI တို့ကို တင်ပြထားသည်။
- ဖတ်လို့သာရတဲ့ Taira ဝင်ခွင့်။
- CLI ဥပမာများအတွက် Taira သို့မဟုတ် ဖန်တီးထားသော ဒေသတွင်းကွန်ရက်တစ်ခုအတွက် client ၏ config တစ်ခု။
- Rust နမူနာမှာ ပရိုဂျက်တစ်ခုဟာ ရည်မှန်းချက်ကွန်ရက်နဲ့အတူတူ Iroha အရင်းအမြစ် ပြင်ဆင်မှုကို ချိတ်ဆက်ထားတာပါ။

## ခြေလှမ်း {#steps}

### (၁) အများပြည်သူ Taira အရင်းအမြစ်တစ်ခုမှ စာမျက်နှာတစ်မျက်နှာ {#_1-page-through-a-public-taira-resource}

Resource routes တွေဟာ dashboard နဲ့ smoke checks အတွက် အသုံးဝင်ပါတယ်။ JSON ကို မေးကြည့်ပါ၊ စာမျက်နှာတိုင်းကို ချိတ်ဆက်ပြီး တုံ့ပြန်မှုကို စစ်ဆေးပြီးတဲ့နောက်မှာ application က လိုအပ်တဲ့ field တွေပဲ project လုပ်ပါ။

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'include_total=true' \
  | jq '{total, next_cursor, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const seen = new Set()
let cursor = null

do {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id',
    limit: '5',
    ...(cursor ? { cursor } : {}),
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
  cursor = page.next_cursor
} while (cursor)
```

:::

ဤ HTTP မျက်နှာပြင်သည် `limit` နှင့် opaque `next_cursor` ဖြင့် စာမျက်နှာခွဲသည်။ ၎င်းကို `null` ဖြစ်သည်အထိ မပြောင်းလဲဘဲ `cursor` အဖြစ် ပြန်ပို့ပါ။ `total` သည် သင် `include_total=true` ကို တောင်းဆိုမှသာ ပေါ်လာပြီး ၎င်းအတွက် full scan တစ်ခု ကုန်ကျသည်။

### (၂) CLI ဖြင့် collection တစ်ခုကို filter လုပ်ပါ {#_2-filter-a-collection-with-the-cli}

CLI သည် filter၊ projection နှင့် စာမျက်နှာအရွယ်အစားကို collection endpoint သို့ ပေးပို့ပြီး စာမျက်နှာတစ်ခု `{items, next_cursor}` ကို ထုတ်ပြသည်။ `next_cursor` ကို `null` ဖြစ်သည်အထိ ဆက်လိုက်ရန် `--all` ကို ထည့်ပါ။

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

Filtering သည် စာမျက်နှာခွဲခြင်းမတိုင်မီ ဖြစ်ပေါ်သည်။ collection တစ်ခုစီသည် ၎င်း၏ ကိုယ်ပိုင် field များကိုသာ လက်ခံသည်။ မသိသော field တစ်ခုသည် ဘာနှင့်မျှ မကိုက်ညီခြင်းအစား `invalid_filter` ကို ပြန်ပေးသည်။

### (၃) တည်ငြိမ်တဲ့ metadata key နဲ့ sort လုပ်ပါ။ {#_3-sort-by-a-stable-metadata-key}

collection ၏ စီရန် key များသည် ကြေညာထားသော field များနှင့် `metadata.<key>` ကို လက်ခံသည်။ ကြီးစဉ်ငယ်လိုက်စီရန် key ၏ ရှေ့တွင် `-` ကို ထည့်ပါ။ key မပါသော row များသည် ငယ်စဉ်ကြီးလိုက် အစီအစဉ်တွင် အရင်ဆုံးနေရာယူပြီး တူညီနေသည့် row များသည် row ၏ အထောက်အထားအတိုင်း စီသောကြောင့် collection တစ်ခုလုံးတွင် တသမတ်တည်း ဖြည့်သွင်းထားသော key ကို အသုံးပြုပါ။

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` သည် server ဘက်ခြမ်း projection ဖြစ်သည်- `--select id,metadata` သည် ထို field များကိုသာ ပြန်ပေးပြီး မသိသော field တစ်ခုသည် `invalid_select` ကို ပြန်ပေးသည်။ လက်မှတ်ထိုးထားသော typed query များသည် item အပြည့်အစုံကို အမြဲ ပြန်ပေးသောကြောင့် ၎င်းတို့၏ ရလဒ်များကို အထက်ပါအတိုင်း `jq` သို့မဟုတ် JavaScript ဖြင့် client ဘက်ခြမ်းတွင် project လုပ်ပါ။

### (၄) Rust iterator ကို opaque cursors တွေကို လိုက်ပါအောင်လုပ်ပါ။ {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` သည် စာမျက်နှာအရွယ်အစားကို သတ်မှတ်သည်။ `list` က ပြန်ပေးသော iterator သည် လက်ရှိစာမျက်နှာကို အသုံးပြုပြီးမှသာ server ၏ `next_cursor` ဖြင့် နောက်စာမျက်နှာကို တောင်းဆိုပြီး `take` သည် logical ရလဒ်ကို ကန့်သတ်သည်။ ဤနေရာတွင် `client` သည် `iroha::blocking::Client` ဖြစ်သည်။

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` သည် ၎င်း၏ collection၊ path၊ filter နှင့် sort တို့နှင့် ချိတ်ဆက်ထားသော opaque keyset နေရာတစ်ခု ဖြစ်သည်။ ၎င်းကို ဘယ်သောအခါမျှ parse မလုပ်ပါနှင့်၊ ကိုယ်တိုင် မဖန်တီးပါနှင့်၊ မတူညီသော filter သို့မဟုတ် sort ဖြင့်လည်း ပြန်မသုံးပါနှင့်- Torii သည် ၎င်းကို `invalid_cursor` ဖြင့် ငြင်းပယ်သည်။ စာမျက်နှာများကြားတွင် ထည့်သွင်းခြင်း သို့မဟုတ် ဖယ်ရှားခြင်းခံရသော row များကြောင့် နောက်စာမျက်နှာတွင် မသက်ဆိုင်သော row များကို ထပ်မံပြသခြင်း သို့မဟုတ် ကျော်သွားခြင်း ဘယ်သောအခါမျှ မဖြစ်ပါ။

## စစ်ဆေးပါ {#verify}

အတိအကျ domain filter က `universal.universal` ကိုသာ ပြန်ပို့သင့်ပါတယ်။ အောင်မြင်တဲ့ CLI ထွက်ပေါက်ကိုပဲ ရေတွက်တာထက် ရလဒ်ကို စစ်ဆေးပါ။

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

စာမျက်နှာခွဲထားသော application query များအတွက် ID များသည် စာမျက်နှာများအကြား ထပ်မနေကြောင်း၊ တောင်းဆိုထားသော logical ကန့်သတ်ချက်ကို ဘယ်သောအခါမျှ မကျော်လွန်ကြောင်းနှင့် ငြင်းပယ်ခံရသော cursor သည် မှတ်တမ်းတင်ထားသော checkpoint မှ ပြန်လည်စတင်ကြောင်းကိုလည်း စမ်းသပ်ပါ။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- singular query သည် iterable filter, sorting, pagination သို့မဟုတ် fetch parameters ကိုလက်မခံပါ။ ထိုထိန်းချုပ်ချက်များလိုအပ်ပါက သက်ဆိုင်ရာစာရင်းမေးမြန်းမှုကိုအသုံးပြုပါ။
- `limit` သည် စုစုပေါင်းရလဒ် မဟုတ်ဘဲ စာမျက်နှာအရွယ်အစား ဖြစ်သည်- အနည်းဆုံး 1 နှင့် အများဆုံး node ၏ `torii.app_api_max_list_limit` (မူလတန်ဖိုး 500) အထိ ဖြစ်သည်။ Torii ၏ မူလတန်ဖိုးမှာ 100 ဖြစ်သည်။ ထပ်မံဖတ်ရှုရန် `next_cursor`၊ `--all` သို့မဟုတ် SDK iterator ကို လိုက်ပါ။
- `invalid_cursor` ဆိုသည်မှာ cursor ပုံစံမမှန်ခြင်း သို့မဟုတ် အခြား collection၊ path၊ filter သို့မဟုတ် sort နှင့် သက်ဆိုင်ခြင်းကို ဆိုလိုသည်။ query ကို ပြန်စတင်ပါ။ opaque တန်ဖိုးကို ပြင်ဆင်ရန် မကြိုးစားပါနှင့်။
- ရွေးချယ်မှုတင်းကျပ်သော filter တစ်ခုသည် null မဟုတ်သော `next_cursor` ပါရှိသည့် တိုတောင်းသော သို့မဟုတ် ဗလာစာမျက်နှာကို ပြန်ပေးနိုင်သည်။ ၎င်းသည် `null` ဖြစ်သည်အထိ ဆက်လိုက်ပါ။
- `--filter` နှင့် HTTP `filter` parameter တို့သည် `id = "universal.universal"` သို့မဟုတ် `exists(metadata.tier)` ကဲ့သို့ Torii ၏ စာသားသဒ္ဒါကို လက်ခံသည်။ JSON predicate object သည် filter စာသား မဟုတ်သောကြောင့် မမှန်ကန်သော `filter` အဖြစ် မအောင်မြင်ပါ။
- ကျယ်ပြန့်ပြီး အကန့်အသတ်မဲ့သော query များသည် peer ၏ အလုပ်နှင့် client ၏ memory ကို တိုးစေသည်။ အသုံးပြုသူနှင့် သင့်လျော်သော logical ကန့်သတ်ချက်နှင့် စာမျက်နှာအရွယ်အစားကို သတ်မှတ်ပါ။
- လက်မှတ်ထိုးထားသော `/v1/query` သည် စာရင်းပြုစုရေး API မဟုတ်ပါ။ ၎င်းသည် singular query များနှင့် filter မပါသော iterable စတင်မှုအနည်းငယ်ကို လက်ခံပြီး `FindDomains` သို့မဟုတ် `FindAssetDefinitions` ကဲ့သို့သော အခြား query များကို `signed_query_shape_not_admitted` ဖြင့် ငြင်းပယ်သည်။ collection endpoint များ၊ CLI `list` command များနှင့် SDK collection reader များသည် filter၊ sort နှင့် cursor သဒ္ဒါ တစ်ခုတည်းကို မျှဝေအသုံးပြုသည်။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ပုံသေသတ်မှတ်ထားသော commit ရှိ Torii collection query သတ်မှတ်ချက်](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [ပုံသေသတ်မှတ်ထားသော commit ရှိ Rust collection ဖတ်ရှုမှုများနှင့် cursor iterator](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [ပုံသေသတ်မှတ်ထားသော commit ရှိ လက်မှတ်ထိုးထားသော query ဝင်ခွင့်](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [မေးခွန်းများ](/my/blockchain/queries.md)
- [မေးမြန်းချက် အကိုးအကား](/my/reference/queries.md)
- [JavaScript နှင့် TypeScript](/my/guide/tutorials/javascript.md)
