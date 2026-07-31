---
translation_locale: am
translation_source: /blockchain/queries.md
translation_source_hash: 0a32b75b78d5bcde0d2b84b58d440b18e545559dfd9772dd6508ad41e972bf6e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# ጥያቄዎች {#queries}

ምንም እንኳን ስለ blockchain ሁኔታ ብዙ መረጃዎችን ማግኘት የሚቻል ቢሆንም, ቀደም ሲል እንዳሳየነው, ክስተት ተመዝጋቢ እና ማጣሪያ በመጠቀም ክስተቶች ስፋት ወደ ፍላጎት ሰዎች ለማቃለል, አንዳንድ ጊዜ ይበልጥ ቀጥተኛ አቀራረብ መውሰድ ይኖርብናል. ጥያቄዎችን ያስገቡ.

ጥያቄዎች ለ Iroha እኩዮች ሲላኩ ከወቅታዊው የዓለም ሁኔታ አመለካከት ጋር በተያያዘ በዝርዝር መልስ የሚሰጡ አነስተኛ መመሪያ መሰል ዕቃዎች ናቸው ።

ይህ በአውታረ መረቡ ላይ የሚገኝ ብቸኛው ዓይነት መረጃ አይደለም, ነገር ግን በሁሉም አውታረ መረቦች ላይ ሊደረስበት የሚችል ዋስትና የተሰጠው ብቸኛው አይነት ነው.

ለእያንዳንዱ Iroha አተገባበር ሌሎች መረጃዎች ሊገኙ ይችላሉ። ለምሳሌ የቴሌሜትሪ መረጃዎች ተደራሽነት የአውታረ መረብ አስተዳዳሪዎች ላይ የተመሠረተ ነው ። ሥራውን ለመከታተል ከመጠቀም ይልቅ የማቀነባበሪያ ኃይልን መመደብ አለመፈለጋቸው ሙሉ በሙሉ የእነሱ ውሳኔ ነው። በተቃራኒው አንዳንድ ተግባራት ሁል ጊዜም ያስፈልጋሉ ፣ ለምሳሌ የሂሳብዎን ቀሪ ሂሳብ ማግኘት ።

የጥያቄዎች ውጤቶች በአንድ ጊዜ [](#sorting) ፣ [ገጾች ](#pagination) እና [ በባልደረባው በኩል ](#filters) መደርደሪያ ሊሆኑ ይችላሉ ። ማረም በሜታዳታ ቁልፎች ላይ ሌክሲኮግራፊካዊ ነው ። ማጣራት በተለያዩ መርሆዎች ላይ ሊከናወን ይችላል ፣ ከጎራ-ተኮር (የግለሰብ IP አድራሻ ማጣሪያ ጭምብል) እስከ `begins_with` ያሉ ንዑስ ገመድ ዘዴዎች በሎጂካዊ ሥራዎች በመጠቀም የተዋሃዱ።

## Taira ላይ ይሞክሩት {#try-it-on-taira}

Taira ለጋራ ሀብቶች የንባብ-ብቻ መጠይቅ ረዳቶችን በ JSON ላይ ያጋልጣል ። አንድን SDK ከመጫኑ በፊት የገጽታ እና ምላሽ አያያዝን ለመለማመድ ይጠቀሙባቸው

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

ለአፕሊኬሽኖች ምርመራ እነዚህ የጭስ ቁጥሮች ከተፈረሙ የትራንስክሽን ሙከራዎች ተለይተው እንዲቆዩ ያድርጉ። ለማንበብ ብቻ የሚደረግ ጥያቄ ብዙውን ጊዜ ወደ ፊርማ ማዋቀር ከማሳየቱ በፊት ወደ መጨረሻ ነጥብ ተገኝነት ፣ ወደ አውታረመረብ ተደራሽነት ወይም የመንገድ ተኳሃኝነትን ይጠቁማል ።

## መጠይቅ ይፍጠሩ {#create-a-query}

ከ SDK ወይም CLI የተጻፉ የጥያቄ ገንቢዎችን ይጠቀሙ። ለምሳሌ ፣ የአሁኑ የውሂብ ሞዴል `FindAccounts` ን ለዝርዝር መለያዎች ያጋልጣል

```rust
let query = FindAccounts;
```

የአሊስ ንብረቶችን የሚያገኝ ጥያቄ ምሳሌ ይኸውልህ፦

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## ገጾች {#pagination}

ነጠላ መጠይቆች እና አነስተኛ ሊደጋገሙ የሚችሉ መጠይቆችን ለማግኘት, አንድ ጥያቄ ለመላክ `client.request` መጠቀም ይችላሉ እና በአንድ ጊዜ ውጤት ማግኘት.

ሆኖም እንደ `FindAccounts`, `FindAssets`, ወይም `FindBlocks` ያሉ ሰፊ ተደጋጋሚ መጠይቆች ትልቅ የውጤት ስብስቦችን ሊመልሱ ይችላሉ ። በባልደረባው እና በደንበኛው ላይ ጭነት ለመቀነስ ገጽን ይጠቀሙ።

አንድ `Pagination` ለመገንባት, እርስዎ `client.request_with_pagination(query, pagination)` መደወል ይኖርብዎታል, የት `pagination` እንደሚከተለው የተገነባ ነው:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## ማጣሪያዎች {#filters}

ጥያቄ ሲፈጥሩ ከተጠቀሰው ማጣሪያ ጋር የሚዛመዱ ውጤቶችን ብቻ ለመመለስ ማጣሪያ መጠቀም ይችላሉ ።

ማጣሪያዎች ለጥያቄዎች የተወሰኑ ናቸው። ለምሳሌ ፣ የመለያ መጠይቆች በመለያ ማንነት ወይም ሜታዳታ ሊቀንሱ ይችላሉ ፣ የንብረት መጠይቆቹ ደግሞ በንብረት ትርጉም ፣ በአስተናጋጅ መለያ ወይም በጎራ ትንበያ ሊቀንሱ ይችላሉ። የ SDK የታይፕ መጠይቅ ገንቢዎችን በተቻለ መጠን ይጠቀሙ, ስለዚህ የማጣሪያ አይነት የጥያቄ ውፅዓት ዓይነት ጋር ይዛመዳል.

## መደርደሪያ {#sorting}

Iroha ጋር ንጥሎችን ማ sortት ይችላሉ [ሜታዳታ](/am/blockchain/metadata.md) ጥያቄውን በሚያቀርቡበት ጊዜ ለመለየት ቁልፍ ካቀረቡ በ lexicographically. አንድ የተለመደ አጠቃቀም ሁኔታ መለያዎች አንድ `registered-on` ሜታዳታ ማስገቢያ፣ ከተደራጀ በኋላ የሂሳብ ምዝገባ ታሪክን ለማየት ያስችልዎታል።

የሜታዳታ ቁልፍ የጥያቄ ውጤቶችን ለማ sortት ጥቅም ላይ ስለዋለው [ ሜታዳታ ](/am/blockchain/metadata.md) ላላቸው አካላት ብቻ ነው የሚመለከተው ።

ማጣሪያ ከገጾች እና ማጣሪያዎች ጋር ማዋሃድ ይችላሉ. ማጣሪያ አማራጭ ባህሪ መሆኑን ልብ ይበሉ, ገጾች ጋር አብዛኞቹ ጥያቄዎች አያስፈልጋቸውም ይሆናል.

## ማጣቀሻ {#reference}

ስለእነሱ ዝርዝር መረጃ ለማግኘት [የአሁኑ ጥያቄዎችን ዝርዝር ](/am/reference/queries.md) ይመልከቱ።
