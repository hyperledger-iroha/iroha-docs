---
translation_locale: am
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ቀስቅሴዎች {#triggers}

ቀስቅሴዎች የክስተት ማጣሪያን ሊተገበር ከሚችል እርምጃ ጋር ያያይዛሉ። አንድ ክስተት ከቀስቅሴው ማጣሪያ ጋር ሲዛመድ፣ Iroha ቀስቅሴውን እርምጃ እንደ የብሎክ አፈፃፀም አካል ይገመግማል።

## መዋቅር {#structure}

የተመዘገበ `Trigger` የሚከተሉትን ያጠቃልላል -

- `id` ሀ `TriggerId` `Name`
- `action` አስፈፃሚው፣ የፍቃድ ዋና፣ ማጣሪያ፣ የመድገም ፖሊሲ፣ የድጋሚ ሙከራ ፖሊሲ እና ሜታዳታ

ድርጊቱ የሚከተሉትን ያጠቃልላል

- `executable` `Instructions`፣ `ContractCall`፣ `Ivm`፣ ወይም `IvmProved`
- `repeats` `Indefinitely` ወይም `Exactly(n)`
- `authority` የ A ሽከርካሪው የ A ሽከርካሪው
- `filter` አንድ `EventFilterBox`
- `retry_policy` ለታቀደው የጊዜ ቀስቅሴዎች አማራጭ የድጋሚ ሙከራ ባህሪ
- `metadata` የዘፈቀደ ቀስቅሴ ሜታዳታ

## የክስተት ማጣሪያዎች {#event-filters}

ቀስቅሴ ሁኔታዎች እንደ ምዝገባዎች ተመሳሳይ የክስተት-ማጣሪያ ሞዴል ይጠቀማሉ። የከፍተኛ-ደረጃ ክስተት ማጣሪያ -

- የሶፍትዌር ሂደት የስራ ፍሰት ክስተቶች
- የውሂብ ክስተቶች
- በጊዜ ላይ የተመሰረተ የክስተት ማሳወቂያዎች
- የማስፈጸሚያ ክስተቶችን ቀስቅሴ
- ቀስቅሴ የማጠናቀቂያ ክስተቶች

ከስራ ሂደቱ ጋር የሚዛመደውን በጣም ጠባብ ማጣሪያ ይምረጡ። ሰፊ ማጣሪያዎች ለምርመራ ጠቃሚ ናቸው, ነገር ግን በብሎክ አፈፃፀም ወቅት ስራን ይጨምራሉ.

ለአሁኑ የማጣሪያ ቤተሰቦች [ማጣሪያዎች](/am/blockchain/filters.md) ይመልከቱ።

## የጊዜ ቀስቅሴዎች {#time-triggers}

የጊዜ ቀስቅሴዎች የጊዜ ክስተት ማጣሪያ ይጠቀማሉ። የአለም ሁኔታ እይታ ተዛማጅ የጊዜ ሁኔታ ላይ ሲደርስ፣ Iroha ቀስቅሴውን እርምጃ በመቀስቀሻ የፈቃድ ባለቤት ስር ያስፈጽማል። የጊዜ ቀስቅሴዎች ከዚህ በታች የተገለጸውን የድጋሚ ሙከራ ፖሊሲን ሊጠቀሙ የሚችሉ ቀስቅሴዎች አይነት ናቸው።

## መደጋገም {#repetition}

`Repeats::Indefinitely` ቀስቅሴው እስኪመዘገብ ድረስ ንቁ ያደርገዋል።

`Repeats::Exactly(n)` ቀስቅሴው የተወሰነ ቁጥር እንዲያቃጥል ያስችለዋል። ቆጠራው ሲያልቅ ተመሳሳይ ባህሪ እንደገና ካስፈለገ አዲስ ቀስቅሴ ይመዝገቡ።

## ፈቃድ ዋና እና ፈቃዶች {#authority-and-permissions}

የቀስቅሴው የፈቃድ ባለቤት ፈጻሚውን ለመጥራት የሚጠቀመው መለያ ነው። የሚፈለጉት ፈቃዶች ግልጽ እንዲሆኑ እና ከኦፕሬተሩ የግል መለያ እንዲለዩ፣ ለረጅም ጊዜ ለሚኖሩ ቀስቅሴዎች የተለየ ቴክኒካዊ መለያ ይጠቀሙ።

የፍቃድ ርዕሰ መምህሩ ሊተገበር በሚችል መመሪያ ወይም በኮንትራት ቴክኒካል ጥሪ የሚፈለጉትን ፈቃዶች ይፈልጋል። ቀስቅሴውን የሚመዘግብ መለያ በነቃ የሶፍትዌር ማስፈጸሚያ አካባቢ አረጋጋጭ ስር ቀስቅሴዎችን ለመመዝገብ ፈቃድ ያስፈልገዋል።

## የዳግም ሞክር ፖሊሲ {#retry-policy}

የጊዜ ቀስቅሴዎች ወደ ድጋሚ ሙከራ ፖሊሲ መርጠው ሊገቡ ይችላሉ። የድጋሚ ሙከራ ፖሊሲ ያዘጋጃል -

- `max_retries` ከመጀመሪያው ያልተሳካ ተኩስ በኋላ ስንት የድጋሚ ሙከራ ሙከራዎች ይፈቀዳሉ
- `retry_after_ms` እንደገና መሞከር ብቁ ከመሆኑ በፊት Iroha ምን ያህል ጊዜ ይጠብቃል

የድጋሚ ሙከራ በጀቱ ሲያልቅ ቀስቅሴው ያልተመዘገበ ነው።

## መጠይቆች {#queries}

ቀስቅሴ ሁኔታን ለመመርመር የአሁኑን ቀስቅሴ መጠይቆች ይጠቀሙ -

- [`FindTriggers`](/am/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/am/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/am/reference/queries.md#triggers-contracts-transactions-and-blocks)

በተጨማሪ አንብበው

- [የክስተት ቀስቅሴ ምሳሌ](/am/blockchain/trigger-examples.md)
- [ክስተቶች](/am/blockchain/events.md)
- [መመሪያዎች](/am/blockchain/instructions.md)
- [ፈቃዶች](/am/blockchain/permissions.md)
