---
translation_locale: he
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ביטויים, תנאי, לוגיקה {#expressions-conditionals-logic}

כולם. [Iroha הוראות מיוחדות](./instructions.md) הם פועלים על ביטויים. `EvaluatesTo`, אתה יכול לציין את השם של החשבון ישירות, אבל גם את החשבון. ID אתה יכול לבדוק אם חשבון רשום ב-blockchain גם כן.

באמצעות ביטויים שמבצעים `EvaluatesTo<bool>`, אתה יכול להגדיר לוגיקה תנאי ולפעול פעולות מתוחכמות יותר על שרשרת. לדוגמה, אתה יכול להגיש הוראה `Mint` רק אם חשבון מסוים נרשם.

זכור שאתה יכול לשלב את זה עם שאלות, וככזה אתה יכול לתכנן את blockchain לעשות כמה דברים מדהימים. זה מה שאנחנו מכנים חוזים חכמים, המאפיין המגדיר של השימוש המתקדם בטכנולוגיה blockchain.
