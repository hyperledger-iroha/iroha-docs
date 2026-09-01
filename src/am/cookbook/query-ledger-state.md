---
translation_locale: am
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# መጠይቅ blockchain መዝገብ ሁኔታ {#query-ledger-state}

## ውጤት {#outcome}

Taira JSON ግብዓቶችን ያንብቡ እና ያዘጋጁ፣ ከዚያ የተተየቡ Iroha መጠይቆችን በማጣሪያዎች፣ አመክንዮአዊ ገጽ ማድረግ፣ መደርደር፣ መጠኖችን ማምጣት እና ወደፊት-ብቻ ጠቋሚ ቀጣይነት ይጠቀሙ። እንዲሁም አገልጋዩ የተላለፈውን `--select` tuple ከመገምገሙ በፊት በመራጭ ትንበያ ላይ ከመታመን ይቆጠባሉ።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`፣ `jq`፣ Node.js 24፣ እና የአሁኑ `iroha` CLI።
- ተነባቢ ብቻ Taira መዳረሻ።
- ለተፈረሙ የተተየቡ መጠይቅ ምሳሌዎች፣ የደንበኛ ውቅር ለ Taira ወይም የመነጨ የአካባቢ አውታረ መረብ።
- ለ Rust ምሳሌ፣ ከዒላማው አውታረ መረብ ጋር በተመሳሳዩ Iroha ምንጭ ክለሳ ላይ የተሰካ ፕሮጀክት።

## እርምጃዎች {#steps}

### 1. ገጽ በይፋዊ Taira ምንጭ በኩል {#_1-page-through-a-public-taira-resource}

የመርጃ መንገዶች ለዳሽቦርዶች እና ለጭስ ፍተሻዎች ጠቃሚ ናቸው። JSON ን ይጠይቁ፣ እያንዳንዱን ገጽ ያስሩ እና ምላሹን ካረጋገጡ በኋላ አፕሊኬሽኑ የሚፈልጓቸውን መስኮች ብቻ ያዘጋጁ።

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

ይህ HTTP ወለል `limit` እና `offset` ይጠቀማል። መንገዱ ርካሽ የመቁጠር ሁነታን ሲጠቀም የተተወውን ወይም የታሰረውን `total` እንደተለመደው ይያዙ።

### 2. የተተየበ CLI መጠይቅን ያጣሩ እና ያጣሩ {#_2-filter-and-batch-a-typed-cli-query}

CLI የተተየበ ተደጋጋሚ መጠይቅን ተከታታይ ያደርገዋል እና የአገልጋይ ቀጣይ ጠቋሚዎችን ከውስጥ ይከተላል። እዚህ አመክንዮአዊ ውጤቱ በአንድ ረድፍ ብቻ የተገደበ ሲሆን `--fetch-size 1` በአንድ ዙር ጉዞ የሚመጣውን ከፍተኛውን ባች ይቆጣጠራል።

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

ማጣራት የሚከሰተው ከገጽ ከመውጣቱ በፊት ነው። በጥያቄ ላይ የተመሰረቱ የተተየቡ ትንበያዎችን ይጠቀሙ; ለመለያ ወይም ለንብረት ቅድመ ሁኔታ ለጎራ ደህንነቱ በተጠበቀ ሁኔታ እንደገና ጥቅም ላይ ሊውል አይችልም።

### 3. በተረጋጋ ሜታዳታ ቁልፍ ደርድር {#_3-sort-by-a-stable-metadata-key}

የተተየበ የመጠይቅ መደርደር በአንድ ሜታዳታ ቁልፍ ላይ የተመሰረተ መዝገበ ቃላት ነው። ያ ቁልፍ የሌላቸው እቃዎች በሶፍትዌር ማስፈጸሚያ አካባቢ የተገለጸውን ቅደም ተከተል ይከተላሉ፣ ስለዚህ በክምችቱ ውስጥ በቋሚነት የሚሞላ ቁልፍ ይጠቀሙ።

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

ተመዝግቦ የገባው CLI `--select` JSON ይተነትናል እና የመራጩን ቱፕል ያስተላልፋል፣ ነገር ግን አሁን ያለው ቀላል ክብደት ያለው መጠይቅ DSL ያንን መራጭ በአገልጋዩ ላይ አይገመግምም። በዙሪያው የትንበያ ውል ገና አይገነቡ። የተተየበ SDK ትንበያ ይጠቀሙ የታለመው የሶፍትዌር ማስፈጸሚያ አካባቢ ከሚደግፈው በኋላ ብቻ ወይም የተረጋገጠውን ውጤት ከላይ እንደተገለፀው በ `jq` ወይም JavaScript ያዘጋጁ።

### 4. Rust ተደጋጋሚው ግልጽ ያልሆኑ ጠቋሚዎችን ይከተል {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` የአመክንዮአዊ ውጤት ስብስብ ገደቦችን ያዘጋጃል።. `FetchSize` እያንዳንዱን የአገልጋይ ስብስብ ያስተዳድራል።. የተመለሰው ተደጋጋሚው በአገልጋይ የመነጨውን ጠቋሚ በመጠቀም ቀጣይ ጥያቄዎችን በግልፅ ይልካል።.

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

A `ForwardCursor` በስልጣን የታሰረ፣ ሂደት-አካባቢያዊ እና ወደፊት-ብቻ ነው። በፍፁም አይተነትኑት፣ አያዋህዱት፣ በፍቃድ ርእሰ መምህራን መካከል አያካፍሉት፣ ወይም በ Torii አጋጣሚዎች ላይ እንደ ተንቀሳቃሽ ከቆመበት ቀጥል ቶከን አያቆዩት። ጊዜው ካለፈ፣ ሆን ተብሎ በመተግበሪያ ደረጃ የፍተሻ ነጥብ ዋናውን ጥያቄ እንደገና ያስጀምሩት።

## አረጋግጥ {#verify}

ትክክለኛው የጎራ ማጣሪያ `wonderland.universal` ብቻ መመለስ አለበት። የተሳካ CLI መውጫን ብቻውን ከመቁጠር ይልቅ ውጤቱን ያረጋግጡ

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

ለገጽ አፕሊኬሽን መጠይቆች፣ እንዲሁም መታወቂያዎች በገጾች ላይ እንደማይደገሙ፣ የተጠየቀው አመክንዮአዊ ገደብ በጭራሽ እንደማያልፍ እና ጊዜው ያለፈበት ጠቋሚ ከሰነድ የፍተሻ ነጥብ እንደገና ከጀመረ በኋላ እንደገና መሞከሩን ይሞክሩ።

## መላ ፍለጋ {#troubleshooting}

- ነጠላ መጠይቅ ሊደጋገም የሚችል ማጣሪያ፣ መደርደር፣ ገጽ አወጣጥ ወይም መለኪያዎችን አምጡ አይቀበልም። እነዚያ መቆጣጠሪያዎች በሚያስፈልጉበት ጊዜ ተጓዳኝ የዝርዝር መጠይቁን ይጠቀሙ።
- `fetch_size` ዜሮ ያልሆነ ባች ፍንጭ እንጂ አጠቃላይ የውጤት ገደብ አይደለም።. አሁን ያለው ነባሪ `100` ነው፣ እና የሶፍትዌር ማስፈጸሚያ አካባቢ ከከፍተኛው በላይ እሴቶችን ውድቅ ያደርጋል።
- ያልታወቀ፣ ጊዜው ያለፈበት ወይም የውጭ ጠቋሚ ሆን ተብሎ እንደገና ጥቅም ላይ ሊውል አይችልም። ጥያቄውን እንደገና ያስጀምሩ; ግልጽ ያልሆነውን እሴት ለመጠገን አይሞክሩ.
- ሜታዳታ መደርደር ከ አጠቃላይ የመስክ መደርደር ጋር ተመሳሳይ አይደለም። አንዳንድ እቃዎች የተመረጠው ቁልፍ ከሌላቸው ለጎደሉ ቁልፎች ቅደም ተከተል ይመዝግቡ ወይንም የተለየ ስትራቴጂ ይምረጡ
- CLI `--select`ን ይተነትናል እና ያስተላልፋል፣ ነገር ግን የአሁኑ አገልጋይ ቀላል ክብደት ያለውን መራጭ ቱፕል አይገመግምም። ለተዘረጋው የሶፍትዌር ማስፈጸሚያ አካባቢ የአገልጋይ-ጎን መራጭ ድጋፍ ካልተረጋገጠ በስተቀር የደንበኛ-ጎን ትንበያን ይተግብሩ።
- ሰፊ ያልተገደቡ መጠይቆች የአውታረ መረብ አቻ ስራን፣ የደንበኛ ማህደረ ትውስታን እና የጠቋሚ የህይወት ዘመን ስጋትን ይጨምራሉ። ለተጠቃሚው ተስማሚ የሆነ አመክንዮአዊ ገደብ እና የማምጣት መጠን ያዘጋጁ።
- ይፋዊ JSON የመርጃ መለኪያዎች እና የተፈረሙ የተተየቡ መጠይቅ መለኪያዎች ተዛማጅ ናቸው ነገር ግን ሊለዋወጡ የሚችሉ ተከታታይ ቅርጸቶች አይደሉም። ለተተየቡ የመጠይቅ ውሂብ መያዣዎች SDK ወይም CLI ን ይምረጡ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ በጠቋሚ የተደገፈ የገጽ እጥፍ ውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የመጠይቅ ገንቢ እና መራጭ ባህሪ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [የመጠይቅ መለኪያዎች እና ጠቋሚ ሞዴል በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [መጠይቆች](/am/blockchain/queries.md)
- [የመጠይቅ ማጣቀሻ](/am/reference/queries.md)
- [JavaScript እና TypeScript](/am/guide/tutorials/javascript.md)
