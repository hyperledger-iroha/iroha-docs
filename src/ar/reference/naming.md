---
translation_locale: ar
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# اتفاقيات التسمية {#naming-conventions}

عند تسمية الحسابات أو النطاقات أو الأصول، يجب أن تضع في اعتبارك الاتفاقيات التالية المستخدمة في Iroha:

1. هناك عدد من الفواصل المحجوزة التي تُستخدم لأنواع محددة من البُنى:

   - `@` محجوز لأسماء الحسابات المستعارة وأشكال الحساب/المفتاح العام المحددة
   - `#` محجوز لأسماء مستعارة لتعريف الأصول والقيم الحرفية لرصيد الأصول
   - `::` مخصص لأسماء العقود المستعارة
   - `.` مخصص لتأهيل النطاق ومساحة البيانات
   - `$` مخصص للأشكال النصية ذات نطاق الزناد
   - `%` مخصص للأشكال النصية ذات نطاق المصادق

2. الحد الأقصى لعدد الأحرف (بما في ذلك الأحرف UTF-8) التي يمكن أن يحتويها الاسم يقتصر على عاملين: `[0, u32::MAX]` والمساحة المخصصة المتوفرة في المكدس حاليا.

## جرّبه على Taira {#try-it-on-taira}

تحويل اسم مستعار لأصل عام إلى معرف تعريف الأصل القياسي:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

قارن ذلك مع قائمة تعريف الأصول:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

يفصل الحرف `#` الاسم المستعار للأصل عن سياق المجال. احتفظ به خارج الأسماء العادية إلا إذا كنت تنوي كتابة اسم مستعار للأصل أو قيمة رصيد الأصل حرفيًا.
