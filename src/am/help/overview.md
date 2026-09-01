---
translation_locale: am
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# መላ ፍለጋ {#troubleshooting}

ይህ ክፍል ከ Iroha ጋር በሚሰሩበት ጊዜ ችግሮች ካጋጠሙዎት ለመርዳት የታሰበ ነው። የሆነ ችግር ከተፈጠረ፣ እባክዎን መጀመሪያ [ቁልፎቹን ያረጋግጡ](#check-the-keys)። ያ ካልረዳ፣ ለእያንዳንዱ የመላ መፈለጊያ መመሪያዎችን ያረጋግጡ -

- [የመጫን ችግሮች](./installation-issues.md)
- [የማዋቀር ጉዳዮች](./configuration-issues.md)
- [የማሰማራት ጉዳዮች](./deployment-issues.md)
- [የውህደት ጉዳዮች](./integration-issues.md)

እያጋጠመዎት ያለው ችግር እዚህ ካልተገለጸ፣ በ[ቴሌግራም](https://t.me/hyperledgeriroha) በኩል ያግኙን።

## ቁልፎቹን ይፈትሹ {#check-the-keys}

አብዛኛዎቹ ጉዳዮች የሚነሱት በማይመሳሰሉ ቁልፎች ምክንያት ነው። ይህንን ህግ እንዲከተሉ የምንመክረው ለዚህ ነው የሆነ ችግር ከተፈጠረ መጀመሪያ ቁልፎቹን ያረጋግጡ።

ፈጣን ማብራሪያ ይኸውና የአውታረ መረብ እኩዮች ቁልፎች በማይሆኑበት ጊዜ የሚነሱትን የስህተት መልዕክቶች መለየት አይቻልም የአውታረ መረብ እኩዮችን የህዝብ ቁልፍ ስለሚያጋልጥ በታመኑ የአውታረ መረብ እኩዮች ድርድር ውስጥ ያሉትን ቁልፎች ያዛምዱ። እንደዚያው፣ በአካባቢ ተለዋዋጮች ከተገለጹ ቁልፎች ጋር የሄልም ገበታዎች ወይም የኩበርኔትስ ማሰማራት ካሉዎት፣ የተዋቀሩትን ያወዳድሩ [`public_key`](/am/reference/peer-config/params.md#param-public-key), [`private_key`](/am/reference/peer-config/params.md#param-private-key), እና [`trusted_peers`](/am/reference/peer-config/params.md#param-trusted-peers) የከፍተኛ ደረጃ ውድቀቶችን ከመመርመርዎ በፊት እሴቶች።

ጥርጣሬ ካለ [አዲስ ጥንድ ቁልፎችን ይፍጠሩ](/am/guide/security/generating-cryptographic-keys.md).
