---
translation_locale: he
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ביטויים, תנאים, לוגיקה {#expressions-conditionals-logic}

כולם. [Iroha הוראות מיוחדות](./instructions.md) לפעול על ביטויים.
לכל ביטוי יש `EvaluatesTo`, אשר משמשת בהוראה
בעוד שתוכלו לציין את שם החשבון ישירות,
ציין גם את החשבון ID באמצעות כמה מתמטיקה או ניתוח של חוטים.
אפשר לבדוק אם חשבון רשום גם בבלוק-כיין.

באמצעות ביטויים שמבצעים `EvaluatesTo<bool>`, אתה יכול להגדיר
לגיון תנאי ולפעול פעולות מתוחכמות יותר על שרשרת.
לדוגמה, אתה יכול להגיש `Mint` הוראות רק אם חשבון ספציפי הוא
רשום.

זכור שאתה יכול לשלב את זה עם שאלות, וככזה אתה יכול לתכנת
blockchain לעשות דברים מדהימים. זה מה שאנחנו מכנים _חכם
חוזים_, המאפיין המגדיר של השימוש המתקדם בבלוקצ'ין
טכנולוגיה.
