---
translation_locale: am
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ክስተቶች {#events}

ክስተቶች በብሎክቼን ውስጥ የተወሰኑ ነገሮች በሚከሰቱበት ጊዜ ይለቀቃሉ ፣ ለምሳሌ አዲስ መለያ ሲፈጠር ወይም ብሎክ ሲገባ። የተለያዩ ዓይነቶች ክስተቶች አሉ-

- የቧንቧ መስመር ክስተቶች
- የመረጃ ክስተቶች
- የጊዜ ክስተቶች
- የማስነሳት አፈፃፀም ክስተቶች

## የቧንቧ መስመር ክስተቶች {#pipeline-events}

የፓይፕላይን ክስተቶች የሚለቀቁት ግብይቶች ሲቀርቡ ፣ በሚፈፀሙበት ወይም በብሎክ ላይ በተሰማሩበት ጊዜ ነው። አንድ የፓይፐላይን ክስተት የሚከተሉትን መረጃዎች ይ containsል- አንድ ክስተት (ግብይት ወይም ብሎክ) ያስከተለውን አካል ዓይነት ፣ ሃሽ እና ሁኔታ። ሁኔታው `Validating` (በሂደት ላይ ያለው ማረጋገጫ) ፣ `Rejected` ወይም `Committed` ሊሆን ይችላል። አንድ አካል ተቀባይነት ካላገኘ ለጥያቄው ምክንያት ይሰጣል ።

### Taira ላይ ይሞክሩት {#try-it-on-taira}

የህዝብ ቧንቧ ክስተት ዥረት ተጭኗል መሆኑን ያረጋግጡ:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

አንድ ዥረት ክፍት ሳያደርጉ ለመመርመር የሚችሉት ቅጽበታዊ ገጽ እይታ ለማግኘት የቅርብ ጊዜውን የአስፕሎረር ግብይቶች ያንብቡ:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

የቀጥታ ዝግጅቶችን በሚፈልጉበት ጊዜ በቴርሚናል ውስጥ SSE መንገድ ይክፈቱ:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

ፍሰቱ ክፍት በሚሆንበት ጊዜ ምንም ግብይቶች ካልተቀረቡ፣ መንገዱ ጤናማ ቢሆንም ትዕዛዙ ዝም ሊል ይችላል።

## የውሂብ ክስተቶች {#data-events}

የውሂብ ክስተቶች እንደ እኩዮች ፣ ጎራዎች ፣ መለያዎች ፣ ንብረቶች ፣ የንብረት ትርጉሞች ፣ NFTs ፣ አስነሳሾች ፣ ሚናዎች ፣ በሰንሰለት ላይ ውቅር ፣ የአፈፃፀም ሁኔታ ፣ ማስረጃዎች ፣ ምስጢራዊ ሀብቶች ፣ ድልድዮች ወይም SORA/Nexus-ተኮር ዕቃዎች የመሳሰሉ ዋና መረጃዎች ጋር የተዛመዱ ለውጦች ሲከሰቱ ይለወጣሉ። እነዚህ ዓይነቶች ክስተቶች በ [ የውሂብ ክስተት ማጣሪያዎች ውስጥ ጥቅም ላይ ይውላሉ ](./filters.md#data-event-filters).

## የጊዜ ክስተቶች {#time-events}

የጊዜ ክስተቶች የዓለም ሁኔታ እይታ [ ጊዜ መንስኤዎችን ](./triggers.md#time-triggers) ለማስተናገድ ዝግጁ በሚሆንበት ጊዜ ይለቀቃሉ ።

## አስነሳሽነት ማስፈጸሚያ ክስተቶች {#trigger-execution-events}

የ [`ExecuteTrigger`](./instructions.md#executetrigger) መመሪያ ሲፈፀም የማስነቃቂያ አፈፃፀም ክስተቶች ይለቀቃሉ ። የመነቃቂያ እርምጃ ከተጠናቀቀ በኋላ የሚለቀቁ ክስተቶች ናቸው።
