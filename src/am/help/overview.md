---
translation_locale: am
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ችግር መፍታት {#troubleshooting}

ይህ ክፍል በሥራ ላይ እያሉ ችግሮች ቢያጋጥሙዎት ለመርዳት የታሰበ ነው
Iroha. የሆነ ነገር ቢከሰት እባክህ [ቁልፎቹን ይመልከቱ](#check-the-keys)
መጀመሪያ. ይህ አይረዳም ከሆነ, ለ ችግሮችን መፍታት መመሪያዎችን ይመልከቱ
በእያንዳንዱ ደረጃ:

- [የመጫን ችግሮች](./installation-issues.md)
- [የመዋቅር ችግሮች](./configuration-issues.md)
- [የማሰማራት ጉዳዮች](./deployment-issues.md)
- [የውህደት ጉዳዮች](./integration-issues.md)

የሚያጋጥማችሁት ችግር እዚህ ላይ ካልተገለጸ፣
[ቴሌግራም](https://t.me/hyperledgeriroha).

## ቁልፎቹን ይመልከቱ {#check-the-keys}

አብዛኛዎቹ ችግሮች የሚከሰቱት በማይመሳሰሉ ቁልፎች ምክንያት ነው።
ይህንን ደንብ ለመከተል: **የሆነ ነገር ቢከሽፍ፣ ቁልፎቹን አረጋግጥ
በመጀመሪያ**.

እዚህ ላይ አንድ ፈጣን ማብራሪያ ነው: ስህተት ለመለየት አይቻልም
የእኩዮች ቁልፎች በ array ውስጥ ያሉትን ቁልፎች በማይዛመዱበት ጊዜ የሚነሱ መልዕክቶች
ምክንያቱም የእኩዮቹን የህዝብ ቁልፍ ያሳያል።
በከባቢ አየር የተገለጹ ቁልፎች ያሉት የሄልም ካርታዎች ወይም ኩበርኔትስ ልውውጥ አላቸው
ተለዋዋጮች, የተዋቀሩትን ማወዳደር
[`public_key`](/am/reference/peer-config/params.md#param-public-key),
[`private_key`](/am/reference/peer-config/params.md#param-private-key), እና
[`trusted_peers`](/am/reference/peer-config/params.md#param-trusted-peers)
ከፍ ያለ ደረጃ ያላቸውን ውድቀቶች ከመመርመርዎ በፊት እሴቶች።

በጥርጣሬ ውስጥ ከሆነ [አዲስ የቁልፍ ጥንድ ማመንጨት](/am/guide/security/generating-cryptographic-keys.md).
