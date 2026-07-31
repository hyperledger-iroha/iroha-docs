---
translation_locale: am
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# አወቃቀርና አስተዳደር {#configuration-and-management}

Iroha ውቅር ሁለት የማረጋገጫ ደረጃዎች አሉት:

- በ TOML ፋይሎች ውስጥ የተከማቸ እና ሂደት ሲጀምር የሚነበብ የአካባቢያዊ የእኩዮች እና የደንበኛ ውቅር
- በ [ `SetParameter`](/am/blockchain/instructions.md#setparameter) በኩል በሚደረጉ ግብይቶች የተለወጠ የሰንሰለት ውቅር።

የአገናኝ መታወቂያ, አድራሻዎች, ምዝገባ, ማከማቻ እና የደንበኛ ፊርማ ቁልፎች አካባቢያዊ ውቅር ይጠቀሙ. አውታረ መረቡ መስማማት እና በዴትሚኒስቲክ ዳግም መጫወት ያለባቸው እሴቶች ላይ ሰንሰለት ላይ ውቅር ይጠቀም.

የምርት ባህሪ ከእነዚህ የቅንብብር ንብርብሮች መምጣት አለበት ። የአካባቢ ተለዋዋጮች ለአካባቢያዊ መሳሪያዎች የሙከራ ግብዓቶችን ለማቅረብ ምቹ ሊሆኑ ይችላሉ ፣ ግን እነሱ የምርት ባህሪያት በሮች አይደሉም እና የተሰማሩትን ውቅር አይተኩም ።

ዋናዎቹ የመግቢያ ነጥቦች የሚከተሉት ናቸው:

- [ዘፍጥረት ](/am/guide/configure/genesis.md)
- [የደንበኛው ውቅር](/am/guide/configure/client-configuration.md)
- [የአውታረ መረብ ማሰማራት ቁልፎች ](/am/guide/configure/keys-for-network-deployment.md)
- [በባዶ ብረት ላይ የሚሰራ ](/am/guide/advanced/running-iroha-on-bare-metal.md)
- [የእኩዮች ውቅር ማጣቀሻ ](/am/reference/peer-config/index.md)
