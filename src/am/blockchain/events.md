---
translation_locale: am
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ክስተቶች {#events}

ክስተቶች የሚለቀቁት በብሎክቼይን ውስጥ የተወሰኑ ነገሮች በሚከሰቱበት ጊዜ ለምሳሌ
አዲስ መለያ ይፈጠራል ወይም ብሎክ ይከፈላል.
ክስተቶች:

- የፓይፕ መስመር ክስተቶች
- የመረጃ ክስተቶች
- የጊዜ ክስተቶች
- ማስነሳት አፈፃፀም ክስተቶች

## የቧንቧ መስመር ክስተቶች {#pipeline-events}

የፓይፕላይን ክስተቶች የሚለቀቁት ግብይቶች ሲቀርቡ፣ ሲፈፀሙ ወይም
አንድ የፓይፕ መስመር ክስተት የሚከተሉትን መረጃዎች ይዟል:
አንድን ክስተት (ግብይት ወይም ብሎክ) ያስከተለው አካል ዓይነት፣ ሃሽ
እና ሁኔታ. `Validating` (የሂደት ያለው ማረጋገጫ)
`Rejected`, ወይም `Committed`. አንድ አካል ውድቅ ከሆነ, ምክንያት
ውድቅ ተደርጓል።

### ሞክር Taira {#try-it-on-taira}

የሕዝብ ቧንቧ ክስተት ፍሰት የተጫነ መሆኑን ያረጋግጡ:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

አንድ ጅረት ክፍት ሳይቆይ መመርመር የሚችሉበት ቅጽበታዊ ገጽ እይታ ለማግኘት, የቅርብ ጊዜውን አንብብ
የአሰሳ ሥራዎች:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

ክፍት SSE የቀጥታ ዝግጅቶችን በሚፈልጉበት ጊዜ በማርሚናል ውስጥ መንገድ:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

ዥረቱ ክፍት በሚሆንበት ጊዜ ምንም ግብይቶች ካልተቀበሉ ትዕዛዙ ሊቆይ ይችላል
ምንም እንኳን መንገዱ ጤናማ ቢሆንም እንኳ ዝም ብሎ ይጓዛል።

## የመረጃ ክስተቶች {#data-events}

የመረጃ ክስተቶች የሚለቀቁት ከመጽሐፉ መረጃ ጋር የተያያዙ ለውጦች ሲኖሩ ነው
እንደ እኩዮች ፣ ጎራዎች ፣ ሂሳቦች ፣ ሀብቶች ፣ የንብረት ትርጓሜዎች ፣ NFTs, ማነቃቂያዎች፣
ሚና፣ በሰንሰለት ላይ ያለው ውቅር፣ የአፈፃፀም ሁኔታ፣ ማስረጃዎች፣ ምስጢራዊ ሀብቶች፣
ድልድዮች፣ ወይም SORA/Nexus- የተወሰኑ ነገሮች።
[የመረጃ ክስተት ማጣሪያዎች](./filters.md#data-event-filters).

## የጊዜ ክስተቶች {#time-events}

የጊዜ ክስተቶች የሚተላለፉት የዓለም ሁኔታ አመለካከት ለመቋቋም ዝግጁ በሚሆንበት ጊዜ ነው
[የጊዜ ማስነሻዎች](./triggers.md#time-triggers).

## የማስነሳት አስፈፃሚ ክስተቶች {#trigger-execution-events}

የማነቃቂያ አፈፃፀም ክስተቶች ሲለቀቁ
[`ExecuteTrigger`](./instructions.md#executetrigger) መመሪያ ነው
ተነሳሽነት የተጠናቀቀው ክስተቶች ከተነሳሽነት እርምጃ በኋላ ይለቀቃሉ
ይጨርሳል.
