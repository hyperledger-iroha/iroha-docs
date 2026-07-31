---
translation_locale: am
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# አወቃቀር እና አስተዳደር {#configuration-and-management}

Iroha ውቅር ሁለት አምራች ደረጃዎች አሉት:

- **አካባቢያዊ የባልደረባ እና የደንበኛ ውቅር**, ውስጥ የተከማቹ TOML ፋይሎች እና ማንበብ
  የሂደት ማስጀመር
- **በሰንሰለት ላይ ያለው ውቅር**, በግብይቶች የተለወጡ
  [`SetParameter`](/am/blockchain/instructions.md#setparameter)

የአገናኝ ማንነት, አድራሻዎች, ምዝገባ, ማከማቻ እና
የደንበኛ ፊርማ ቁልፎች. መስማማት አለባቸው እሴቶች ላይ ሰንሰለት ላይ ውቅር ይጠቀሙ
በአውታረ መረብ እና በዴትሪሚኒስት መንገድ እንደገና ይጫወታል.

የምርት ባህሪ ከነዚህ ውቅር ንብርብሮች መምጣት አለበት.
የሙከራ ግብዓቶችን ለአካባቢያዊ መሳሪያዎች ለማቅረብ ተለዋዋጮች ምቹ ሊሆኑ ይችላሉ ፣ ግን
እነሱ የምርት ባህሪ በሮች አይደሉም እና የተሰማሩትን አይተኩም
ውቅር።

ዋናዎቹ የግንባታ መግቢያ ነጥቦች:

- [ዘፍጥረት](/am/guide/configure/genesis.md)
- [የደንበኛው ውቅር](/am/guide/configure/client-configuration.md)
- [የአውታረ መረብ ማሰማራት ቁልፎች](/am/guide/configure/keys-for-network-deployment.md)
- [በባዶ ብረት ላይ እየሮጠ](/am/guide/advanced/running-iroha-on-bare-metal.md)
- [የአቻ ውቅር ማጣቀሻ](/am/reference/peer-config/index.md)
