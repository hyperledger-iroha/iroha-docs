---
translation_locale: am
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: ca76923f5ae35b96c52a6a4c23c5d9e69549d1ca91d6d1507e7b9a1aee1f1676
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# መጠይቅ መዝገብ ግዛት {#query-ledger-state}

## ውጤቱ {#outcome}

Taira JSON ምንጮችን ያንብቡ እና ፕሮጀክት ያድርጉ ፣ ከዚያ በተለጣፊዎች ፣ በሎጂካዊ ገጽ አሰጣጥ ፣ በመደርደሪያ ፣ በማምጣት መጠኖች እና ወደፊት ብቻ ካርሰር ቀጣይነት ጋር የታየውን Iroha መጠይቆች ይጠቀሙ። እንዲሁም አገልጋዩ የተላለፈውን `--select` ቱፕል ከመገምገሙ በፊት በምርጫ መርሃግብር ላይ መተማመንን ያስወግዳሉ።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`, `jq`, Node.js 24 እና የአሁኑ `iroha` CLI.
- Taira የንባብ-ብቻ መዳረሻ።
- ለተፈረሙ የተጻፉ ጥያቄዎች ምሳሌዎች ለ Taira ወይም ለተፈጠረው አካባቢያዊ አውታረመረብ የደንበኛ ውቅር።
- በ Rust ምሳሌ ላይ አንድ ፕሮጀክት ከዒላማው አውታረመረብ ጋር በተመሳሳይ Iroha ምንጭ ማሻሻያ ላይ ተጣብቋል.

## እርምጃዎች {#steps}

### 1. የሕዝብ Taira ሀብት በኩል ገጽ {#_1-page-through-a-public-taira-resource}

የሀብት መስመሮች ለዳሽቦርዶች እና ለጭስ ማረጋገጫ ጠቃሚ ናቸው. JSON ን ይጠይቁ ፣ እያንዳንዱን ገጽ ያገናኙ እና መልሱን ካረጋገጡ በኋላ መተግበሪያው የሚፈልገውን መስክ ብቻ ያንፀባርቁ ።

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

ይህ HTTP ወለል `limit` እና `offset` ይጠቀማል። መንገዱ ርካሽ የቁጥር ሁነታ ሲጠቀም የተሰወረውን ወይም የተገደበውን `total` እንደ መደበኛ ያዙ።

### 2. የተጻፈውን CLI መጠይቅ ማጣራት እና በቡድን ማስገባት {#_2-filter-and-batch-a-typed-cli-query}

CLI የተጻፈውን ተደጋጋሚ መጠይቅ በዝርዝር ያዘጋጃል እና የአገልጋዩን ቀጣይነት ካርሰሮችን ውስጣዊ በሆነ መንገድ ይከተላል ። እዚህ ላይ ምክንያታዊው ውጤት በአንድ ረድፍ ብቻ የተገደበ ሲሆን `--fetch-size 1` በአንድ ዙር ጉዞ የሚገኘውን ከፍተኛውን ጭነት ይቆጣጠራል።

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

ማጣሪያ ከገጽ አሰጣጥ በፊት ይከሰታል ። ለጥያቄው የተወሰኑ የተጻፉ ቅድመ ሁኔታዎችን ይጠቀሙ ፣ ለአንድ መለያ ወይም ንብረቶች አንድ ቅድመ ሁኔታ ደህንነቱ በተጠበቀ ሁኔታ እንደገና ጥቅም ላይ ሊውል አይችልም ።

### 3. በተረጋጋ ሜታዳታ ቁልፍ ይደረጋል {#_3-sort-by-a-stable-metadata-key}

የተጻፈ መጠይቅ ቅደም ተከተል በአንድ ሜታዳታ ቁልፍ ላይ ሌክሲኮግራፊክ ነው ። ያንን ቁልፍ የሌላቸው ዕቃዎች የአሂደቱን ጊዜ የተወሰነ ቅደም ተከተልን ይከተላሉ ፣ ስለሆነም በመሰብሰቢያው ውስጥ በቋሚነት የተሞላ ቁልፍን ይጠቀሙ።

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

ተመዝግቦ የተቀመጠው CLI `--select` JSON ን ይመረምራል እና የመምረጫውን ቱፕል ያስተላልፋል ፣ ግን የአሁኑ ቀላል ክብደት ጥያቄ DSL ያንን መምረጫ በሰርቨሩ ላይ አይገመግምም። ገና በዙሪያው የፕሮጀክሽን ውል አይገነቡትም። የተጻፈውን SDK ፕሮጄክሽን የሚጠቀሙት የዒላማው ሩጫ ጊዜ ከተደገፈ በኋላ ብቻ ነው ወይም ከላይ እንደተጠቀሰው በ `jq` ወይም JavaScript በተረጋገጠ ውጤት የደንበኛ ጎን ይተረጎማሉ.

### 4. የ Rust ተለዋዋጭ ግልጽ ያልሆኑ መርማሪዎችን ይከተሉ {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` የሎጂካዊ ውጤት ስብስብ ይገድባል. `FetchSize` እያንዳንዱን የአገልጋይ ክምችት ይቆጣጠራል. የተመለሰው ተለዋዋጭ በአገልጋዩ የሚመነጨውን ካርሰር በመጠቀም ቀጣይነት ጥያቄዎችን በንጹህ ሁኔታ ይላካል.

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

አንድ `ForwardCursor` ባለስልጣን የተገደበ, ሂደት አካባቢያዊ እና ወደፊት ብቻ ነው. በጭራሽ አይመረምርም, አያዋህዱትም, በባለሥልጣናት መካከል አያጋሩትም, ወይም በ Torii አጋጣሚዎች ውስጥ እንደ ተንቀሳቃሽ የቀጥታ ስርጭት ምልክት ይቀጥሉ. ከተጠናቀቀ, የመጀመሪያውን መጠይቅ በጥንቃቄ በመተግበሪያ ደረጃ ማረጋገጫ ነጥብ እንደገና ያስጀምሩ.

## ያረጋግጡ {#verify}

ትክክለኛው የጎራ ማጣሪያ ብቻ `wonderland.universal` መመለስ አለበት. ውጤቱን ብቻውን ስኬታማ የሆነ CLI መውጫ ከመቁጠር ይልቅ ያረጋግጡ:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

ለገጾች የተለጠፉ የመተግበሪያ መጠይቆች IDs በገጾች ላይ እንዳይደጋገም ፣ የሚጠየቀው አመክንዮአዊ ገደብ በጭራሽ እንደማይበልጥ እና ከተጠናቀቀ ካርሰር በኋላ እንደገና መሞከር ከታሰበው የፍተሻ ነጥብ እንደገና እንደሚጀመር እንዲሁ ይፈትሹ ።

## ችግሮችን መፍታት {#troubleshooting}

- አንድ ነጠላ መጠይቅ ሊደጋገሙ የሚችሉ ማጣሪያዎችን ፣ መደርደሪያዎችን ፣ ገጾችን ወይም የመውሰድ መለኪያዎችን አይቀበልም ። እነዚህ መቆጣጠሪያዎች አስፈላጊ በሚሆኑበት ጊዜ ተጓዳኝ የሆነውን የዝርዝር መጠይቅ ይጠቀሙ።
- `fetch_size` የጠቅላላው ውጤት ገደብ ሳይሆን ዜሮ ያልሆነ የምርት ጥቆማ ነው። የአሁኑ ነባሪ `100` ነው ፣ እና ሩጫው ጊዜ ከከፍተኛው በላይ የሆኑ እሴቶች ውድቅ ያደርጋል ።
- የማይታወቅ, ጊዜው ያለፈበት ወይም የውጭ ካርሰር ሆን ተብሎ እንደገና ጥቅም ላይ ሊውል አይችልም. መጠይቁን ዳግም ያስጀምሩ; ግልጽ ያልሆነውን ዋጋ ለመጠገን አይሞክሩ.
- ሜታዳታ ማ sorting አጠቃላይ የመስክ ማ sorting አይደለም. እያንዳንዱ ንጥል የተመረጠውን ቁልፍ ካልያዘ, የጎደለውን ቁልፍ ቅደም ተከተል ሰነድ ወይም ሌላ ስልት ይምረጡ.
- CLI `--select` ን ይመረምራል እና ያስተላልፋል ፣ ግን የአሁኑ አገልጋይ ቀላል ክብደት ያለው የመምረጫ ቱፕልን አይገመግምም። ለተተገበረው የስራ ሰዓት የአገልጋይ ጎን የመምረጫ ድጋፍ ካልተረጋገጠ በስተቀር የደንበኛው ጎን ፕሮጄክሽን ተግባራዊ ያድርጉ ።
- ሰፋ ያለ ያልተገደበ መጠይቆች የእኩዮችን ሥራ፣ የደንበኛ ማህደረ ትውስታ እና የአሳታፊውን ዕድሜ አደጋ ይጨምራሉ። ለሸማቹ ተስማሚ የሆነ አመክንዮአዊ ገደብ እና የመጫኛ መጠን ያዘጋጁ ።
- የህዝብ JSON ሀብት መለኪያዎች እና የተፈረሙ የታተሙ መጠይቅ መለኪያቶች ተዛማጅ ናቸው ነገር ግን ተለዋዋጭ ገመድ ቅርጸቶች አይደሉም ። ለታተሙ የጥያቄ ፖስታዎች SDK ወይም CLI ይመረጣሉ ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በ ‹Pinned commit› ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs) ላይ በካርሰር የተደገፈ የፓጅኔሽን ውህደት ሙከራዎች
- [ጠይቅ ገንቢ እና ተመራጭ ባህሪ በ ተጣብቋል commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [የጥያቄ መለኪያዎች እና የኮርሰር ሞዴል በፒን የተቀመጠበት commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [ጥያቄዎች](/am/blockchain/queries.md)
- [መጠይቅ ማጣቀሻ ](/am/reference/queries.md)
- [JavaScript እና TypeScript ](/am/guide/tutorials/javascript.md)
