---
translation_locale: am
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ውቅር እና አስተዳደር {#configuration-and-management}

Iroha ውቅር ሁለት ስልጣን ያላቸው ንብርብሮች አሉት -

- የአካባቢ አውታረ መረብ አቻ እና የደንበኛ ውቅር፣ በ TOML ፋይሎች ውስጥ ተከማችቶ በሂደቱ ጅምር ላይ ያንብቡ
- በሰንሰለት ላይ ውቅር፣ በግብይቶች የተቀየረ [`SetParameter`](/am/blockchain/instructions.md#setparameter)

ለኖድ ማንነት፣ አድራሻዎች፣ ምዝግብ ማስታወሻዎች፣ ማከማቻ እና የደንበኛ ፊርማ ቁልፎች የአካባቢ ውቅረትን ይጠቀሙ። በአውታረ መረቡ መስማማት እና በዲተርሚኒስቲክ ሁኔታ እንደገና መጫወት ለሚገባቸው እሴቶች በሰንሰለት ላይ ያለውን ውቅር ይጠቀሙ።

የምርት ባህሪ ከእነዚህ የውቅር ንብርብሮች መምጣት አለበት. የአካባቢ ተለዋዋጮች የሙከራ ግብዓቶችን ለአካባቢያዊ መሳሪያዎች ለማቅረብ ምቹ ሊሆኑ ይችላሉ፣ ነገር ግን የምርት ባህሪ በሮች አይደሉም እና የተጠናቀቀውን ውቅር አይተኩም።

ዋናዎቹ የማዋቀሪያ መግቢያ ነጥቦች የሚከተሉት ናቸው

- [blockchain ጀነሲስ](/am/guide/configure/genesis.md)
- [የደንበኛ ውቅር](/am/guide/configure/client-configuration.md)
- [ለአውታረ መረብ ማሰማራት ቁልፎች](/am/guide/configure/keys-for-network-deployment.md)
- [በባዶ ብረት ላይ መሮጥ](/am/guide/advanced/running-iroha-on-bare-metal.md)
- [የአውታረ መረብ አቻ ውቅር ማጣቀሻ](/am/reference/peer-config/index.md)
