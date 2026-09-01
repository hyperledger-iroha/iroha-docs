---
translation_locale: am
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ክስተቶች {#events}

የተተየቡ የክስተት ማሳወቂያዎች የሚለቀቁት በብሎክቼይን ውስጥ አንዳንድ ነገሮች ሲከሰቱ ለምሳሌ አዲስ መለያ ሲፈጠር ወይም ብሎክ ሲጠናቀቅ። የተለያዩ አይነት ክስተቶች አሉ -

- የሶፍትዌር ሂደት የስራ ፍሰት ክስተቶች
- የውሂብ ክስተቶች
- በጊዜ ላይ የተመሰረተ የክስተት ማሳወቂያዎች
- የማስፈጸሚያ ክስተቶችን ቀስቅሴ

## የሶፍትዌር ሂደት የስራ ፍሰት ክስተቶች {#pipeline-events}

የሶፍትዌር ማቀነባበሪያ የስራ ፍሰት ክስተቶች የሚለቀቁት ግብይቶች ሲቀርቡ፣ ሲፈጸሙ ወይም በብሎክ ሲጠናቀቁ ነው። የሶፍትዌር ማቀነባበሪያ የስራ ፍሰት ክስተት የሚከተለውን መረጃ ይዟል ክስተቱን ያስከተለው አካል አይነት (ግብይት ወይም ብሎክ)፣ ምስጠራው ሃሽ እና ሁኔታ። ሁኔታው `Validating` (ማረጋገጫው በሂደት ላይ)፣ `Rejected` ወይም `Committed` ሊሆን ይችላል። አንድ አካል ውድቅ ከተደረገ, ውድቅ የተደረገበት ምክንያት ቀርቧል.

### ይህንን የስራ ፍሰት በ Taira ላይ ያሂዱ {#try-it-on-taira}

የህዝብ ሶፍትዌር ማቀነባበሪያ የስራ ፍሰት ክስተት ዥረት መጫኑን ያረጋግጡ -

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

ዥረት ክፍት ሳያደርጉ መመርመር ለሚችሉት የጊዜ ዳታ እይታ፣ የቅርብ ጊዜ የአሳሽ ግብይቶችን ያንብቡ -

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

የቀጥታ ክስተቶች ሲፈልጉ የ SSE መንገዱን በተርሚናል ውስጥ ይክፈቱ -

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

ዥረቱ ክፍት በሚሆንበት ጊዜ ምንም ግብይቶች ካልቀረቡ፣ መንገዱ ጤናማ ቢሆንም ትዕዛዙ ጸጥ ማለት ይችላል።

## የውሂብ ክስተቶች {#data-events}

የውሂብ ክስተቶች የሚለቀቁት ከብሎክቼይን መዝገብ ውሂብ ጋር የተያያዘ ለውጥ ሲኖር እንደ የአውታረ መረብ እኩዮች፣ ጎራዎች፣ መለያዎች፣ ንብረቶች፣ የንብረት ፍቺዎች፣ NFTs፣ ቀስቅሴዎች፣ ሚናዎች፣ በሰንሰለት ላይ ውቅር፣ አስፈፃሚ ሁኔታ፣ ማረጋገጫዎች፣ ሚስጥራዊ ንብረቶች፣ ድልድዮች ወይም SORA/Nexus -ተኮር ነገሮች። እንደነዚህ ዓይነቶቹ ክስተቶች በ [የውሂብ ክስተት ማጣሪያዎች](./filters.md#data-event-filters) ውስጥ ጥቅም ላይ ይውላሉ.

## በጊዜ ላይ የተመሰረተ የክስተት ማሳወቂያዎች {#time-events}

በጊዜ ላይ የተመሰረቱ የክስተት ማሳወቂያዎች የሚለቀቁት የአለም ሁኔታ እይታ ለማስተናገድ ዝግጁ ሲሆን [የጊዜ ቀስቅሴዎች](./triggers.md#time-triggers)።

## የማስፈጸሚያ ክስተቶችን ቀስቅሴ {#trigger-execution-events}

ቀስቅሴ የማስፈጸሚያ ክስተቶች የሚለቀቁት በሚሆንበት ጊዜ ነው። [`ExecuteTrigger`](./instructions.md#executetrigger) መመሪያው ተፈጽሟል። ቀስቅሴ እርምጃ ካለቀ በኋላ ቀስቅሴ ማጠናቀቂያ ክስተቶች ይለቀቃሉ።
