---
translation_locale: ar
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# تسمية الحفلات {#naming-conventions}

عندما تقوم بإسم الحسابات أو النطاقات أو الأصول، يجب أن تتذكر
الاتفاقيات التالية المستخدمة في Iroha:

1. هناك عدد من المفصلات المحجوزة التي تستخدم ل
   أنواع المباني:

   - `@` يحتوي على أسماء مستعار للحسابات وأشكال الحساب المحددة/المفتاح العام
   - `#` يحتجز لـ أسماء مستعار تعريف الأصول و حرفيات رصيد الأصول
   - `::` مخصصة للاستعارات العقدية
   - `.` يحتوي على مؤهلات النطاق ومجال البيانات
   - `$` يحتوي على أشكال نصية ذات نطاق محفز
   - `%` يحتفظ به النماذج النصية التي تم تصحيحها

2. الحد الأقصى للكلمات (بما في ذلك UTF-8 الأحرف) الاسم يمكن أن
   يقتصر ذلك على عوامل: `[0, u32::MAX]` والحالي
   المساحة المخصصة للمخزن.

## جربها Taira {#try-it-on-taira}

حل مستعار الأصول العامة في تعريف الأصول القنوني ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

مقارنة ذلك بقائمة تعريف الأصول:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

(الـ) `#` الشخصية تفصل اسم الأصول عن سياق النطاق
من الأسماء العادية ما لم تكن تكتب عمداً اسم مستعار أو أصول
التوازن حرفياً
