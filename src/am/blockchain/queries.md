---
translation_locale: am
translation_source: /blockchain/queries.md
translation_source_hash: 234c831c97bb93996e6cf51505921ff509e233408cf2faf6a9b23641e5642040
translation_status: machine-validated
translation_engine: bing-translator-llm
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# መጠይቆች {#queries}

የክስተት ተመዝጋቢዎች እና ማጣሪያዎች በብሎክቼይን ሁኔታ ውስጥ ለውጦችን መከታተል ይችላሉ። ስለአሁኑ ሁኔታ ቀጥተኛ እይታ ሲፈልጉ መጠይቅ ይጠቀሙ።

መጠይቆች ትናንሽ መመሪያ የሚመስሉ ነገሮች ናቸው። አሁን ካለው የአለም ሁኔታ እይታ ዝርዝሮችን ለመቀበል አንዱን ወደ Iroha የአውታረ መረብ አቻ ይላኩ።

አውታረ መረብ ሌላ መረጃ ሊያጋልጥ ይችላል። ሊጠየቅ የሚችል የአለም-ሁኔታ መረጃ በእያንዳንዱ Iroha አውታረ መረብ ላይ እንደሚገኝ ዋስትና ያለው ብቸኛው ዓይነት ነው።

ለእያንዳንዱ Iroha ማሰማራት ሌላ የሚገኝ መረጃ ሊኖር ይችላል። ለምሳሌ, የቴሌሜትሪ ውሂብ መገኘት በአውታረ መረብ አስተዳዳሪዎች ላይ የተመሰረተ ነው. ትክክለኛውን ስራ ለመስራት ከመጠቀም ይልቅ ስራውን ለመከታተል የማቀነባበሪያ ሃይል መመደብ ይፈልጉ እንደሆነ ሙሉ በሙሉ ውሳኔያቸው ነው። በአንጻሩ፣ አንዳንድ ተግባራት ሁል ጊዜ ያስፈልጋሉ፣ ለምሳሌ የመለያዎን ቀሪ ሂሳብ ማግኘት።

የመጠይቆች ውጤቶች በአንድ ጊዜ [ደርድሯል](#sorting)፣ [ገጾች](#pagination) እና [ተጣርቷል](#filters) የአቻ ጎን ሊሆኑ ይችላሉ። መደርደር የሚከናወነው በሜታዳታ ቁልፎች ላይ በመዝገበ ቃላት ነው። ማጣራት ሊከናወን ይችላል በተለያዩ መርሆች፣ ከጎራ-ተኮር (የግለሰብ IP አድራሻ ማጣሪያ ጭምብሎች) እስከ ንዑስ-ሕብረቁምፊ ዘዴዎች እንደ `begins_with` አመክንዮአዊ ስራዎችን በመጠቀም ተጣምረዋል።

## ይህንን የስራ ፍሰት በ Taira ላይ ያሂዱ {#try-it-on-taira}

Taira ለጋራ ሀብቶች በ JSON ላይ ተነባቢ-ብቻ የመጠይቅ ረዳቶችን ያጋልጣል። SDK ን ከማገናኘትዎ በፊት ገጽ ማውጣትን እና የምላሽ አያያዝን ለመለማመድ ይጠቀሙባቸው -

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

ለመተግበሪያ ምርመራዎች፣ እነዚህን የጭስ ፍተሻዎች ከተፈረሙ የግብይት ሙከራዎች ይለያዩ። የተነባበ-ብቻ የመጠይቅ አለመሳካት ብዙውን ጊዜ የምስጠራ ፈራሚ ማዋቀር ላይ ችግር ከመጠቆሙ በፊት API የመጨረሻ ነጥብ መገኘትን፣ የአውታረ መረብ ተደራሽነትን ወይም የመንገድ ተኳሃኝነት ጉዳዮችን ያሳያል።

## መጠይቅ ይፍጠሩ {#create-a-query}

የተተየቡ መጠይቅ ገንቢዎችን ከ SDK ወይንም CLI ይጠቀሙ። ለምሳሌ፣ የአሁኑ የውሂብ ሞዴል መለያዎችን ለመዘርዘር `FindAccounts` ያጋልጣል -

```rust
let query = FindAccounts;
```

የ Alice ንብረቶችን የሚያገኝ የመጠይቅ ምሳሌ እነሆ -

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## ከፋዮች {#pagination}

ለነጠላ መጠይቆች እና ለትንሽ ሊደጋገሙ የሚችሉ መጠይቆች፣ መጠይቅ ለማስገባት እና ውጤቱን በአንድ ጊዜ ለማግኘት `client.request`ን መጠቀም ይችላሉ።

ነገር ግን፣ እንደ `FindAccounts`፣ `FindAssets` ወይም `FindBlocks` ያሉ ሰፊ ተደጋጋሚ መጠይቆች ትልቅ የውጤት ስብስቦችን ሊመልሱ ይችላሉ። በአውታረ መረቡ አቻ እና ደንበኛ ላይ ያለውን ጭነት ለመቀነስ ገጽ ማድረግን ይጠቀሙ።

`Pagination` ለመገንባት `client.request_with_pagination(query, pagination)` መጥራት አለቦት፣ `pagination` እንደሚከተለው የተገነባበት።

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## ማጣሪያዎች {#filters}

እርስዎ መጠይቅ በሚፈጥሩ ጊዜ ማጣሪያን መጠቀም ይችላሉ ከ ተጠቀሰው ማጣሪያ ጋር የሚዛመዱትን ውጤቶች ብቻ ለመመለስ

ማጣሪያዎች ለጥያቄው የተለዩ ናቸው። ለምሳሌ፣ የመለያ መጠይቆች በመለያ መታወቂያ ወይም ሜታዳታ ሊጠበቡ ይችላሉ፣ የንብረት መጠይቆች ግን በንብረት ሊጠበቡ ይችላሉ። ፍቺ፣ ያዥ መለያ ወይም የጎራ ትንበያ። የማጣሪያው አይነት ከመጠይቅ ውፅዓት አይነት ጋር እንዲዛመድ በተቻለ መጠን የ SDK የተተየበ መጠይቅ ገንቢዎችን ይጠቀሙ።

## መደርደር {#sorting}

Iroha ጥያቄው በሚገነባበት ጊዜ ለመደርደር ቁልፍ ካቀረቡ ንጥሎችን በ[ሜታዳታ](/am/blockchain/metadata.md) መዝገበ ቃላት መደርደር ይችላል። የተለመደው የአጠቃቀም ጉዳይ መለያዎች `registered-on` ሜታዳታ ግቤት እንዲኖራቸው ነው፣ ይህም ሲደረደር የመለያ ምዝገባ ታሪክን እንዲመለከቱ ያስችልዎታል።

መለያ የሚመለከተው [ሜታዳታ](/am/blockchain/metadata.md) ላላቸው አካላት ብቻ ነው፣ ምክንያቱም ሜታዳታ ቁልፍ የመጠይቅ ውጤቶችን ለመደርደር ጥቅም ላይ ይውላል።

መደርደርን ከገጽ እና ማጣሪያዎች ጋር ማጣመር ይችላሉ። መደርደር አማራጭ ባህሪ መሆኑን ልብ ይበሉ; አብዛኛዎቹ መጠይቆች ከገጽ ጋር አያስፈልጋቸውም።

## ማጣቀሻ {#reference}

ስለእነሱ ዝርዝር መረጃ ለማግኘት [የነባር መጠይቆች ዝርዝር](/am/reference/queries.md) ን ይመልከቱ።
