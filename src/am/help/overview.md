---
translation_locale: am
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ችግሮችን መፍታት {#troubleshooting}

ይህ ክፍል ከ Iroha ጋር በሚሰሩበት ጊዜ ችግሮች ካጋጠሙዎት ለመርዳት የታሰበ ነው። አንድ ነገር ከተሳሳተ እባክዎን [ በመጀመሪያ የቁልፎቹን ](#check-the-keys) ይፈትሹ። ያ የማይረዳ ከሆነ ለእያንዳንዱ ደረጃ የችግር መፍታት መመሪያዎችን ይመልከቱ:

- [የመጫኛ ችግሮች](./installation-issues.md)
- [የግንባታ ችግሮች](./configuration-issues.md)
- [የማሰማራት ችግሮች](./deployment-issues.md)
- [የመዋሃድ ጉዳዮች](./integration-issues.md)

ያጋጠማችሁት ችግር እዚህ ካልተገለጸ በ [ቴሌግራም ](https://t.me/hyperledgeriroha) በኩል እኛን ያነጋግሩን.

## ቁልፎቹን አረጋግጡ {#check-the-keys}

አብዛኛዎቹ ችግሮች የሚከሰቱት በማይመሳሰሉ ቁልፎች ምክንያት ነው። ለዚህም ነው የሚከተለውን ደንብ እንዲከተሉ እንመክራለን፦ አንድ ነገር ቢያምር መጀመሪያ ቁልፎቹን ይፈትሹ።

አንድ ፈጣን ማብራሪያ ይኸውልህ፦ የእኩዮቹ ቁልፎች ከሚታመኑ እኩዮቻቸው ጋር በማይመሳሰሉበት ጊዜ የሚፈጠሩትን የስህተት መልዕክቶች መለየት አይቻልም ምክንያቱም የዕድሜዎቹን የህዝብ ቁልፍ ያሳያል ። እንደዚሁም ፣ በአከባቢ ተለዋዋጮች በኩል የተገለጹ ቁልፎች ያሉት የሄልም ገበታዎች ወይም የኩበርኔትስ ልውውጦች ካሉዎት ከፍ ባለ ደረጃ ውድቀቶችን ከመመርመርዎ በፊት የተቀየሱትን [`public_key`](/am/reference/peer-config/params.md#param-public-key) ፣ [`private_key`](/am/reference/peer-config/params.md#param-private-key) እና [`trusted_peers`](/am/reference/peer-config/params.md#param-trusted-peers) እሴቶች ያወዳድሩ ።

ጥርጣሬ ካለበት [ አዲስ የቁልፍ ጥንድ ](/am/guide/security/generating-cryptographic-keys.md) ያመነጩ።
