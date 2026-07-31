---
translation_locale: am
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ማነቃቂያዎች {#triggers}

አስነሳሾች አንድ ክስተት ማጣሪያ ወደ ሊፈፀም የሚችል እርምጃ ይያዛሉ. አንድ ክስተት ከ አስነሳሽነት ማጣሪያ ጋር ሲመሳሰል, Iroha የብሎክ አፈፃፀም አካል ሆኖ አስነሳሽነትን የሚገመግመው እርምጃ ነው.

## መዋቅር {#structure}

የተመዘገበ `Trigger` የሚከተሉትን ያካትታል፦

- `id`: አንድ `TriggerId` ማሸጊያ የሆነ `Name`
- `action`: ሊፈፀም የሚችል, ሥልጣን, ማጣሪያ, ተደጋጋሚነት ፖሊሲ, ዳግም ሙከራ ፖሊሲ እና ሜታዳታ

እርምጃው የሚከተሉትን ያካትታል፦

- `executable`: `Instructions`፣ `ContractCall`፣ `Ivm`፣ ወይም `IvmProved`
- `repeats`: `Indefinitely` ወይም `Exactly(n)`
- `authority`: ማስፈጸሚያውን የሚጠራው አካውንት
- `filter`: አንድ `EventFilterBox`
- `retry_policy`: ለተዘረዘሩ የጊዜ ማነቃቂያዎች አማራጭ ዳግም ሙከራ ባህሪ
- `metadata`: የትርፍ ጊዜ ማሳለፊያ ሜታዳታ

## ክስተት ማጣሪያዎች {#event-filters}

የማስነሳት ሁኔታዎች ከደንበኝነት ተመዝጋቢዎች ጋር ተመሳሳይ ክስተት-ፋይልተር ሞዴል ይጠቀማሉ። የከፍተኛ ደረጃ ክስተት ማጣሪያ ሊዛመድ ይችላል:

- የቧንቧ መስመር ክስተቶች
- የመረጃ ክስተቶች
- የጊዜ ክስተቶች
- የማስነሳት አፈፃፀም ክስተቶች
- ማጠናቀቂያ ክስተቶችን ያስነሳል

ለሥራ ፍሰት የሚስማማውን በጣም ጠባብ ማጣሪያ ይመርጣሉ። ሰፋፊ ማጣሪያዎች ለምርመራ ጠቃሚ ናቸው ፣ ግን በብሎክ አፈፃፀም ወቅት ሥራን ያሻሽላሉ ።

የአሁኑን የማጣሪያ ቤተሰቦች [ፊልተሮች ](/am/blockchain/filters.md) ይመልከቱ።

## የጊዜ መንስኤዎች {#time-triggers}

የጊዜ ማስነቃቂያዎች የጊዜ ክስተት ማጣሪያን ይጠቀማሉ። የዓለም ሁኔታ እይታ የሚዛመደበት የጊዜ ሁኔታ ሲደርስ Iroha በሚያስነሳው ሥልጣን ስር የማስነቃቂያ እርምጃውን ያካሂዳል ። የጊዜ አስነሳሾች ከዚህ በታች የተገለጸውን ዳግም ሙከራ ፖሊሲ መጠቀም የሚችል የማስነቀቂያ አይነት ናቸው ።

## ተደጋጋሚ {#repetition}

`Repeats::Indefinitely` አስነዋሪው ያልተመዘገበ እስከሚሆንበት ጊዜ ድረስ ንቁ ሆኖ ይቆያል።

`Repeats::Exactly(n)` አስነዋሪው የተወሰነ ቁጥር ጊዜ እንዲተኩስ ያስችለዋል. መቁጠሪያው ሲጠናቀቅ, ተመሳሳይ ባህሪ እንደገና አስፈላጊ ከሆነ አዲስ አስነዋቂ መመዝገብ.

## ባለስልጣን እና ፍቃዶች {#authority-and-permissions}

ለረጅም ጊዜ የሚቆዩ ተነሳሾች የተወሰነ ቴክኒካዊ መለያ ይጠቀሙ ስለዚህ የሚያስፈልጉ ፈቃዶች በግልጽ እና ከኦፕሬተሩ የግል መለያ የተለዩ ናቸው.

ባለሥልጣኑ ሊፈፀሙ የሚችሉ መመሪያዎችን ወይም የኮንትራት ጥሪን የሚጠይቁ ፈቃዶችን ይፈልጋል። ማስነሻውን የሚመዘግብ አካውንት እንዲሁ ንቁ በሆነው ሩጫ ጊዜ ማረጋገጫ ስር ማስነሻዎችን ለመመዝገብ ፈቃድ ይፈልጋል ።

## ዳግም ሙከራ ፖሊሲ {#retry-policy}

የጊዜ ማስነቃቂያዎች እንደገና ለመሞከር ፖሊሲ ሊመርጡ ይችላሉ ።

- `max_retries`: ከመጀመሪያው የተሳካ ጥይት በኋላ ስንት ዳግም ሙከራዎች ይፈቀዳሉ
- `retry_after_ms`: Iroha እንደገና ለመሞከር ብቁ ከመሆኑ በፊት ምን ያህል ጊዜ ይጠብቃል?

እንደገና ለመሞከር የሚወጣው በጀት ሲጠናቀቅ ማስነሻው አልተመዘገበም።

## ጥያቄዎች {#queries}

የአሁኑን የማስነሳ ጥያቄዎችን በመጠቀም የማስነሳ ሁኔታን ለመፈተሽ:

- [`FindTriggers`](/am/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/am/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/am/reference/queries.md#triggers-contracts-transactions-and-blocks)

በተጨማሪም ተመልከት።

- [ክስተት ማስነሳት ምሳሌ ](/am/blockchain/trigger-examples.md)
- [ክስተቶች](/am/blockchain/events.md)
- [መመሪያዎች](/am/blockchain/instructions.md)
- [ፍቃዶች](/am/blockchain/permissions.md)
