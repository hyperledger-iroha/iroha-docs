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

ምንም እንኳን ስለ blockchain ሁኔታ አብዛኛው መረጃ
ቀደም ሲል እንዳሳየነው, አንድ ክስተት ተመዝጋቢ እና ማጣሪያ በመጠቀም
ክስተቶችን ወደ የሚስቡ ሰዎች ያጥቡ ፣ አንዳንድ ጊዜ እርስዎ ማድረግ ያስፈልግዎታል
ይበልጥ ቀጥተኛ አቀራረብ ይኑርህ። _ጥያቄዎች_.

መጠይቆች አነስተኛ መመሪያ-እንደ ነገሮች ናቸው, አንድ ላይ ሲላኩ Iroha
እኩዮቼ፣ አሁን ባለው የዓለም ሁኔታ ላይ ካለው አመለካከት ጋር በተያያዘ ዝርዝር መረጃዎችን በመስጠት መልስ ለመስጠት ሞክሩ።

ይህ የግድ ብቸኛው መረጃ አይደለም
አውታረ መረቡ ግን ይህ ብቻ ነው _የተረጋገጠ_ ወደ
በሁሉም አውታረመረቦች ላይ ተደራሽ መሆን።

ለእያንዳንዱ የ Iroha, ሌሎች መረጃዎች ሊኖሩ ይችላሉ።
ለምሳሌ የቴሌሜትሪ መረጃዎች ተደራሽነት በኔትወርኩ ላይ የተመሠረተ ነው
አስተዳዳሪዎች፣ ይህን ለማድረግ ፈቃደኞች መሆን አለመሆናቸው ሙሉ በሙሉ የእነሱ ውሳኔ ነው።
ሥራውን ለመከታተል ከመጠቀም ይልቅ የማቀነባበሪያ ኃይል ይመድቡ
በተቃራኒው አንዳንድ ተግባራት ሁልጊዜ ያስፈልጋሉ ፣ ለምሳሌ
የሂሳብዎን ሂሳብ ለመድረስ።

የጥያቄዎች ውጤቶች [የተደረገባቸው](#sorting), [ገጽታ ያለው](#pagination)
እና [የተጣራ](#filters) ሁሉም በአንድ ጊዜ እኩዮች.
በሜታዳታ ቁልፎች ላይ ሊክሲኮግራፊክ.
መርሆዎች, ጎራ-ተኮር (የግለሰብ IP የአድራሻ ማጣሪያ ጭምብሎች) ወደ
እንደ substring ዘዴዎች `begins_with` ምክንያታዊ አሠራሮችን በመጠቀም የተዋሃዱ ናቸው.

## ሞክር Taira {#try-it-on-taira}

Taira የሚነበቡትን ብቻ የሚጠይቁ ረዳቶችን ያሳያል JSON ለጋራ ሀብቶች ይጠቀሙባቸው።
አንድ ገመድ ከመጫን በፊት ገጽ እና ምላሽ አያያዝ ለመለማመድ SDK:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

ለአፕሊኬሽኖች ምርመራ እነዚህን የጭስ ቁጥሮች ከተፈረሙ ግብይቶች ለየብቻ ይያዙ
ሙከራዎች. አንብብ ብቻ ጥያቄ አለመሳካቱ አብዛኛውን ጊዜ ወደ መጨረሻ ነጥብ ተደራሽነት ይጠቁማል,
የአውታረ መረብ ተደራሽነት ወይም ወደ ፊርማ ማዋቀር ከመጠቆምዎ በፊት የመንገድ ተኳሃኝነት።

## መጠይቅ ይፍጠሩ {#create-a-query}

ከታየ ጥያቄ ገንቢዎች ይጠቀሙ SDK ወይም CLI. ለምሳሌ የአሁኑ መረጃ
ሞዴል የተጋለጡ `FindAccounts` ለዝርዝሮች መለያዎች:

```rust
let query = FindAccounts;
```

የአሊስ ንብረቶችን የሚያገኝ ጥያቄ አንድ ምሳሌ ይኸውልህ፦

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## ገጾች {#pagination}

ነጠላ መጠይቆች እና አነስተኛ ተደጋጋሚ መጠይቆችን ለማግኘት, መጠቀም ይችላሉ `client.request`
ጥያቄን ማስገባትና ውጤቱን በአንድ ጊዜ ማግኘት።

ይሁን እንጂ እንደ `FindAccounts`, `FindAssets`, ወይም
`FindBlocks` ትልቅ ውጤት ስብስቦች መመለስ ይችላሉ.
የባልደረባና ደንበኛ።

አንድ ለመገንባት `Pagination`, አንተ መደወል ይኖርብናል
`client.request_with_pagination(query, pagination)`, የት `pagination`
እንደሚከተለው ነው የተገነባው።

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## ማጣሪያዎች {#filters}

አንድ ጥያቄ ሲፈጥሩ, ብቻ ውጤቶችን ለመመለስ ማጣሪያ መጠቀም ይችላሉ
ከተጠቀሰው ማጣሪያ ጋር የሚዛመዱ ናቸው።

ማጣሪያዎች ለጥያቄዎች የተወሰኑ ናቸው። ለምሳሌ ፣ የሂሳብ መጠይቆች
የሂሳብ ማንነት ወይም ሜታዳታ፣ የአክሲዮን መጠይቆች በዋጋ ሊቀንሱ ይችላሉ
ትርጉም, ባለቤት መለያ ወይም የጎራ ፕሮጀክት. SDK የተጻፈ ጥያቄ ነው
በተቻለ መጠን ማጣሪያው አይነት በጥያቄው የውጤት ዓይነት ጋር የሚስማማ እንዲሆን ገንቢዎች።

## መደርደሪያ {#sorting}

Iroha እቃዎችን በ [ሜታዳታ](/am/blockchain/metadata.md)
በግንባታው ወቅት ለመለየት ቁልፍ ካቀረቡ
አንድ የተለመደ አጠቃቀም ሁኔታ ሂሳቦች `registered-on`
ሜታዳታ ማስገቢያ፣ ከተደራጀ በኋላ ሂሳቡን ለመመልከት ያስችልዎታል
የምዝገባ ታሪክ።

ማጣሪያው የሚተገበርባቸው አካላት ብቻ ናቸው
[ሜታዳታ](/am/blockchain/metadata.md), የሜታዳታ ቁልፍ ጥቅም ላይ የሚውለው
የጥያቄ ውጤቶችን ይ sortል።

ማጣሪያውን ከገጾች እና ከማጣሪያዎች ጋር ማዋሃድ ይችላሉ.
ይህ አማራጭ ባህሪ ነው፤ አብዛኛዎቹ የፓጅኔሽን ጥያቄዎች አያስፈልጋቸውም።

## ማጣቀሻ {#reference}

ይመልከቱ [አሁን ያሉ ጥያቄዎች ዝርዝር](/am/reference/queries.md) ስለእነሱ ዝርዝር መረጃ ለማግኘት።
