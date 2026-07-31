---
translation_locale: ar
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# تسمية الاجتماعات {#naming-conventions}

عندما تقوم بتسمية الحسابات أو النطاقات أو الأصول، يجب أن تأخذ في الاعتبار الاتفاقيات التالية المستخدمة في Iroha:

1. هناك عدد من منفصلات المخصصة التي تستخدم لنوع معين من البناء:

   - `@` يحتوي على أسماء مستعار للحسابات وأشكال الحساب المحددة/المفتاح العام
   - `#` يتم احتجازها لـ أسماء مستعار تعريف الأصول و حرفيات رصيد الأصول.
   - `::` يحتوي على أسماء مستعار في العقود
   - `.` يحتوي على مؤهلات النطاق ومجال البيانات
   - `$` محجوزة للشكلات النصية التي تمكن من استغلالها
   - `%` مخصصة للأنماط النصية التي يتم تصحيحها.

2. الحد الأقصى للكلمات (بما في ذلك الكلمات UTF-8) التي يمكن أن تمتلكها الاسم يحد من قبل عاملين: `[0, u32::MAX]` والمساحة المخصصة حالياً.

## جربها على Taira {#try-it-on-taira}

الحل من اسم الأصول العامة في تعريف الأصول القنوني ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

مقارنة ذلك مع قائمة تعريف الأصول:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

حرف `#` يفصل مستعار الأصول عن سياق النطاق. أبقيه بعيداً عن الأسماء البسيطة ما لم تكن تكتب عمداً مستعار أصول أو ميزان الأصول حرفيًا .
