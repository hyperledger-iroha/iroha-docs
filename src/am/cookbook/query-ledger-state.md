---
translation_locale: am
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# መጠይቅ blockchain መዝገብ ሁኔታ {#query-ledger-state}

## ውጤት {#outcome}

Taira JSON ግብዓቶችን ያንብቡ እና ያዘጋጁ፣ ከዚያ የ Torii ስብስብ መጠይቆችን ከ CLI እና ከ Rust SDK በማጣሪያዎች፣ በመደርደር፣ በአገልጋይ በኩል በሚደረግ የመስክ ምርጫ (projection)፣ በገጽ ገደቦች እና ግልጽ ባልሆነ የ`next_cursor` ቀጣይነት ይጠቀሙ። እንዲሁም ዝርዝሮችን ለማግኘት ዓይነታቸው የተገለጸ የተፈረሙ መጠይቆችን አይጠቀሙም፤ እነዚያ መጠይቆች ዝርዝሮችን አያጣሩም፣ አይደረድሩም ወይም መስኮቻቸውን አይመርጡም።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`፣ `jq`፣ Node.js 24፣ እና የአሁኑ `iroha` CLI።
- ተነባቢ ብቻ Taira መዳረሻ።
- ለ CLI ምሳሌዎች፣ የደንበኛ ውቅር ለ Taira ወይም ለመነጨ የአካባቢ አውታረ መረብ።
- ለ Rust ምሳሌ፣ ከዒላማው አውታረ መረብ ጋር በተመሳሳዩ Iroha ምንጭ ክለሳ ላይ የተሰካ ፕሮጀክት።

## እርምጃዎች {#steps}

### 1. ገጽ በይፋዊ Taira ምንጭ በኩል {#_1-page-through-a-public-taira-resource}

የመርጃ መንገዶች ለዳሽቦርዶች እና ለጭስ ፍተሻዎች ጠቃሚ ናቸው። JSON ን ይጠይቁ፣ እያንዳንዱን ገጽ ያስሩ እና ምላሹን ካረጋገጡ በኋላ አፕሊኬሽኑ የሚፈልጓቸውን መስኮች ብቻ ያዘጋጁ።

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

ይህ HTTP ወለል በ`limit` እና ግልጽ ባልሆነ `next_cursor` ገጽ በገጽ ይመልሳል፤ `null` እስኪሆን ድረስ ሳይቀይሩት እንደ `cursor` መልሰው ይላኩት። `total` የሚታየው `include_total=true` ሲጠይቁ ብቻ ነው፣ ይህም ሙሉ ቅኝት ይጠይቃል።

### 2. ስብስብን በ CLI ያጣሩ {#_2-filter-a-collection-with-the-cli}

CLI ማጣሪያውን፣ የመስክ ምርጫውን (projection) እና የገጽ መጠኑን ወደ ስብስቡ API የመጨረሻ ነጥብ ይልካል እና አንድ ገጽ፣ `{items, next_cursor}`፣ ያትማል። `next_cursor` `null` እስኪሆን ድረስ ለመከተል `--all` ያክሉ።

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

ማጣራት የሚከናወነው ገጽ በገጽ ከመከፋፈሉ በፊት ነው። እያንዳንዱ ስብስብ የራሱን መስኮች ብቻ ይቀበላል፤ ያልታወቀ መስክ ምንም ከማያዛምድ ውጤት ይልቅ `invalid_filter` ይመልሳል።

### 3. በተረጋጋ ሜታዳታ ቁልፍ ደርድር {#_3-sort-by-a-stable-metadata-key}

የስብስብ የመደርደር ቁልፎች የተገለጹ መስኮችን እና `metadata.<key>`ን ይቀበላሉ፤ ለቁልቁል (descending) ቅደም ተከተል ቁልፉን በ`-` ቅድመ ቅጥያ ያድርጉ። ቁልፉ የሌላቸው ረድፎች በሽቅብ (ascending) ቅደም ተከተል መጀመሪያ ይደረደራሉ፣ እኩል የሆኑ ረድፎችም የረድፍ ማንነትን ይከተላሉ፤ ስለዚህ በስብስቡ ውስጥ በቋሚነት የሚሞላ ቁልፍ ይጠቀሙ።

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` በአገልጋይ በኩል የሚደረግ የመስክ ምርጫ (projection) ነው፦ `--select id,metadata` እነዚያን መስኮች ብቻ ይመልሳል፣ ያልታወቀ መስክ ደግሞ `invalid_select` ይመልሳል። ዓይነታቸው የተገለጸ የተፈረሙ መጠይቆች ሁልጊዜ ሙሉ እቃዎችን ይመልሳሉ፣ ስለዚህ ውጤቶቻቸውን ከላይ እንደተገለጸው በ`jq` ወይም JavaScript በደንበኛ በኩል ያዘጋጁ።

### 4. Rust ተደጋጋሚው ግልጽ ያልሆኑ ጠቋሚዎችን ይከተል {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` የገጽ መጠኑን ያዘጋጃል። በ`list` የሚመለሰው ተደጋጋሚ (iterator) የአሁኑ ገጽ ሙሉ በሙሉ ከተነበበ በኋላ ብቻ የሚቀጥለውን ገጽ በአገልጋዩ `next_cursor` ይጠይቃል፣ `take` ደግሞ አመክንዮአዊ ውጤቱን ይገድባል። እዚህ `client` `iroha::blocking::Client` ነው።

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` ከስብስቡ፣ ከመንገዱ፣ ከማጣሪያው እና ከመደርደሩ ጋር የታሰረ ግልጽ ያልሆነ የቁልፍ ስብስብ (keyset) አቀማመጥ ነው። በጭራሽ አይተንትኑት ወይም በራስዎ አይፍጠሩት፣ እና በተለየ ማጣሪያ ወይም መደርደር እንደገና አይጠቀሙበት፤ Torii ያንን በ`invalid_cursor` ውድቅ ያደርጋል። በገጾች መካከል የገቡ ወይም የተወገዱ ረድፎች በኋላ ያለ ገጽ ተዛማጅ ያልሆኑ ረድፎችን እንዲደግም ወይም እንዲዘል በጭራሽ አያደርጉም።

## አረጋግጥ {#verify}

ትክክለኛው የጎራ ማጣሪያ `universal.universal` ብቻ መመለስ አለበት። የተሳካ CLI መውጫን ብቻውን ከመቁጠር ይልቅ ውጤቱን ያረጋግጡ

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

ለገጽ አፕሊኬሽን መጠይቆች፣ እንዲሁም መታወቂያዎች በገጾች ላይ እንደማይደገሙ፣ የተጠየቀው አመክንዮአዊ ገደብ በጭራሽ እንደማያልፍ እና ውድቅ የተደረገ ጠቋሚ በሰነድ ከተመዘገበ የፍተሻ ነጥብ እንደገና እንደሚጀምር ይሞክሩ።

## መላ ፍለጋ {#troubleshooting}

- ነጠላ መጠይቅ ሊደጋገም የሚችል ማጣሪያ፣ መደርደር፣ ገጽ አወጣጥ ወይም መለኪያዎችን አምጡ አይቀበልም። እነዚያ መቆጣጠሪያዎች በሚያስፈልጉበት ጊዜ ተጓዳኝ የዝርዝር መጠይቁን ይጠቀሙ።
- `limit` የገጽ መጠኑ ነው እንጂ አጠቃላይ ውጤቱ አይደለም፦ ቢያንስ 1 እና ቢበዛ የኖዱ `torii.app_api_max_list_limit` (ነባሪው 500)፤ የ Torii ነባሪ 100 ነው። ተጨማሪ ለማንበብ `next_cursor`ን፣ `--all`ን ወይም የ SDK ተደጋጋሚውን (iterator) ይከተሉ።
- `invalid_cursor` ማለት ጠቋሚው የተበላሸ ነው ወይም ከተለየ ስብስብ፣ መንገድ፣ ማጣሪያ ወይም መደርደር የመጣ ነው ማለት ነው። ጥያቄውን እንደገና ያስጀምሩ፤ ግልጽ ያልሆነውን እሴት ለመጠገን አይሞክሩ።
- ጥቂት ረድፎችን ብቻ የሚያዛምድ ማጣሪያ `null` ያልሆነ `next_cursor` ያለው አጭር ወይም ባዶ ገጽ ሊመልስ ይችላል። `null` እስኪሆን ድረስ መከተሉን ይቀጥሉ።
- `--filter` እና የ HTTP `filter` መለኪያ የ Torii የጽሑፍ ሰዋሰውን ይቀበላሉ፣ ለምሳሌ `id = "universal.universal"` ወይም `exists(metadata.tier)`። የ JSON ቅድመ ሁኔታ ነገር (predicate object) የማጣሪያ ጽሑፍ አይደለም እና ልክ ያልሆነ `filter` ሆኖ አይሳካም።
- ሰፊ ያልተገደቡ መጠይቆች የአውታረ መረብ አቻ ስራን እና የደንበኛ ማህደረ ትውስታን ይጨምራሉ። ለተጠቃሚው ተስማሚ የሆነ አመክንዮአዊ ገደብ እና የገጽ መጠን ያዘጋጁ።
- የተፈረመው `/v1/query` የዝርዝር API አይደለም። ነጠላ መጠይቆችን እና ጥቂት ያልተጣሩ ሊደጋገሙ የሚችሉ የመጠይቅ መነሻዎችን ይቀበላል፣ ሌሎችን ደግሞ፣ ለምሳሌ `FindDomains` ወይም `FindAssetDefinitions`ን፣ በ`signed_query_shape_not_admitted` ውድቅ ያደርጋል። የስብስብ API የመጨረሻ ነጥቦች፣ የ CLI `list` ትዕዛዞች እና የ SDK ስብስብ አንባቢዎች አንድ አይነት የማጣሪያ፣ የመደርደር እና የጠቋሚ ሰዋሰው ይጋራሉ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የ Torii ስብስብ መጠይቅ ውል](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የ Rust ስብስብ ንባቦች እና የጠቋሚ ተደጋጋሚ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የተፈረሙ መጠይቆች ተቀባይነት](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [መጠይቆች](/am/blockchain/queries.md)
- [የመጠይቅ ማጣቀሻ](/am/reference/queries.md)
- [JavaScript እና TypeScript](/am/guide/tutorials/javascript.md)
