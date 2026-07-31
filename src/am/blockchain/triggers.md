---
translation_locale: am
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ተነሳሽነት {#triggers}

አስነሳሾች አንድ ክስተት ማጣሪያ ወደ ሊፈፀም የሚችል እርምጃ ይያዛሉ.
የመነሻውን ማጣሪያ፣ Iroha የብሎክ አካል ሆኖ የማስነሳት እርምጃን ይገመግማል
አሰቃየት

## መዋቅር {#structure}

የተመዘገበ `Trigger` የሚከተሉትን ይ containsል:

- `id`: ሀ `TriggerId` አንድ ማሸጊያ `Name`
- `action`: ተጨባጭነት፣ ሥልጣን፣ ማጣሪያ፣ የመደጋገም ፖሊሲ፣ ዳግም ሙከራ ፖሊሲ፣
  እና ሜታዳታ

እርምጃው የሚከተሉትን ያካትታል፦

- `executable`: `Instructions`, `ContractCall`, `Ivm`, ወይም `IvmProved`
- `repeats`: `Indefinitely` ወይም `Exactly(n)`
- `authority`: የሂደቱን ማስፈጸሚያ የሚጠራው መለያ
- `filter`: አንድ `EventFilterBox`
- `retry_policy`: ለተዘረዘሩት የጊዜ ማነቃቂያዎች አማራጭ ዳግም ሙከራ ባህሪ
- `metadata`: የትርፍ ጊዜ ማሳለፊያ ሜታዳታ

## ክስተት ማጣሪያዎች {#event-filters}

የማነቃቂያ ሁኔታዎች እንደ ምዝገባዎች ተመሳሳይ ክስተት-ፋይልተር ሞዴል ይጠቀማሉ.
የከፍተኛ ደረጃ ክስተት ማጣሪያ የሚከተሉትን ሊዛመድ ይችላል-

- የፓይፕ መስመር ክስተቶች
- የመረጃ ክስተቶች
- የጊዜ ክስተቶች
- ማስነሳት አፈፃፀም ክስተቶች
- የማጠናቀቂያ ክስተቶችን ያስነሳል

ከሥራ ፍሰት ጋር የሚስማማውን በጣም ጠባብ ማጣሪያ ይመርጣሉ። ሰፋፊ ማጣሪያዎች ጠቃሚ ናቸው
ለምርመራ ግን በብሎክ አፈፃፀም ወቅት ሥራን ይጨምራሉ።

ተመልከት [ማጣሪያዎች](/am/blockchain/filters.md) አሁን ላሉት ማጣሪያ ቤተሰቦች።

## የጊዜ መንስኤዎች {#time-triggers}

የጊዜ ማስነቃቂያዎች የጊዜ ክስተት ማጣሪያ ይጠቀማሉ። የዓለም ሁኔታ እይታ
የጊዜ ሁኔታ ማመሳሰል፣ Iroha ከታርጋሩ በታች ያለውን የማስነሳት እርምጃ ይፈጽማል
የጊዜ ማነሳሻዎች እንደገና ለመሞከር ፖሊሲን መጠቀም የሚችል የማነሳሻ አይነት ናቸው
ከዚህ በታች ተገልጿል።

## ተደጋጋሚ {#repetition}

`Repeats::Indefinitely` ማስነሻው ያልተመዘገበ እስኪሆን ድረስ ተንቀሳቃሽ ያደርገዋል።

`Repeats::Exactly(n)` ተነሳሽነት በተወሰነ ቁጥር እንዲነዳ ያስችለዋል።
የቁጥጥር ሂደቱ ተጠናቅቋል ፣ ተመሳሳይ ባህሪ አስፈላጊ ከሆነ አዲስ ማስነሻ ይመዝገቡ
እንደገና.

## ባለሥልጣን እና ፈቃድ {#authority-and-permissions}

የማስነሳት ሥልጣን የተፈፃሚውን ለመጥቀስ ጥቅም ላይ የዋለው መለያ ነው።
ለረጅም ጊዜ የሚቆዩ አስነሳሾች የተወሰነ ቴክኒካዊ ሂሳብ ስለዚህ የሚያስፈልጉ ፈቃዶች
በግልጽ እና ከኦፕሬተሩ የግል መለያ የተለዩ ናቸው።

ባለሥልጣኑ በፈጻሚ መመሪያዎች ውስጥ የሚጠየቁትን ፈቃድ ይፈልጋል ወይም
የኮንትራት ጥሪ: ማስነሻውን የሚመዘግብ አካውንት ደግሞ ፈቃድ ይፈልጋል
በሥራ ላይ በሚገኘው የስራ ሰዓት ማረጋገጫ መሣሪያ ውስጥ ያሉትን ማስነሻዎች መመዝገብ።

## ዳግም ሙከራ ፖሊሲ {#retry-policy}

የጊዜ ማስነሳት እንደገና ለመሞከር ፖሊሲ ሊመርጡ ይችላሉ.

- `max_retries`: ከመጀመሪያው የተሳካ ሙከራ በኋላ ስንት እንደገና ሙከራዎች ይፈቀዳሉ
  የመተኮስ
- `retry_after_ms`: ምን ያህል ጊዜ Iroha ዳግም ሙከራ ከመደረጉ በፊት ይጠብቃል

እንደገና ለመሞከር የሚወጣው በጀት ሲጠናቀቅ ማስነሻው አልተመዘገበም።

## ጥያቄዎች {#queries}

የአሁኑን የማስነሻ ጥያቄዎችን በመጠቀም የማስነሰር ሁኔታውን ይፈትሹ:

- [`FindTriggers`](/am/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/am/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/am/reference/queries.md#triggers-contracts-transactions-and-blocks)

በተጨማሪም ተመልከት:

- [ክስተት ማስነሳት ምሳሌ](/am/blockchain/trigger-examples.md)
- [ክስተቶች](/am/blockchain/events.md)
- [መመሪያ](/am/blockchain/instructions.md)
- [ፍቃዶች](/am/blockchain/permissions.md)
