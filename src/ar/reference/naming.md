---
translation_locale: ar
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# اتفاقيات التسمية {#naming-conventions}

عند تسمية الحسابات أو النطاقات أو الأصول، يجب أن تضع في اعتبارك الاتفاقيات التالية المستخدمة في Iroha:

1. هناك عدد من الفواصل المحجوزة التي تُستخدم لأنواع محددة من البُنى:

   - `@` محجوز لأسماء الحسابات المستعارة وأشكال الحساب/المفتاح العام المحددة
   - `#` محجوز لأسماء مستعارة لتعريف الأصول والقيم الحرفية لرصيد الأصول
   - `::` مخصص لأسماء العقود المستعارة
   - `.` مخصص لتأهيل النطاق ومساحة البيانات
   - `$` مخصص لمعرفات NFT مثل `name$domain.dataspace`

2. يجب أن يكون الاسم غير فارغ، وبصيغة NFC في يونيكود، وألا يتجاوز طوله 255 بايت بترميز UTF-8، وأن يكون خاليًا من المسافات البيضاء وأحرف التحكم وأحرف التحكم في الاتجاه الثنائي.

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
