---
translation_locale: ar
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# النطاقات {#domains}

النطاقات مساحات أسماء مسماة ومسجلة في `World`. في نموذج بيانات Iroha 3 الحالي، يُؤهّل النطاق بمساحة البيانات التي ينتمي إليها، ولذلك يكون المعرّف المعياري كما يلي:

```text
domain.dataspace
```

مثلًا، يحدد `payments.universal` نطاق `payments` داخل مساحة البيانات `universal`.

## هيكل {#structure}

يحتوي `Domain` المسجل على:

- `id`: `DomainId` المؤهَّل بمساحة البيانات
- `logo`: `SoraFS` URI اختياري لشعار النطاق
- `metadata`: بيانات وصفية عشوائية على شكل مفتاح-قيمة
- `owned_by`: الحساب الذي يملك النطاق، عادةً الحساب الذي سجله

حِمل البوتستراب المستخدم لتجسيد النطاق هو `NewDomain`. يحمل `id` و `logo` الاختياري و `metadata` الأولي. بيئة تنفيذ البرامج تملأ `owned_by` من جهة التفويض. العملاء العاديون لا يرسلون هذا الحِمل مباشرة.

## التسجيل {#registration}

إنشاء النطاق العادي يستخدم تدفق إعداد الاسم المستعار التصريحي. هذا يحافظ على عقد الإيجار SNS، وإمكانات المالك، وحماية التحقق من رسوم السعر، وصف النطاق في معاملة ذرية واحدة `EnsureAlias`. `Register::Domain` يظل سطحًا للنشوء/التمهيد، و `ledger domain` الأمر ليس لديه `register` أمر فرعي.

أنشئ نية `AliasSetupPlanRequestV1` خالية من الأسرار مع SDK أو خدمة الإعداد، ثم اجعل CLI يخطط لها مقابل الحالة الحية ويقدّم هذا الخطة بالضبط:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

تحدد النية `payments.universal` والمعرّف الرقمي لمساحة بياناته والمالك بمعرّف I105 المعياري ومدة الحصول على الإيجار وشرط التحقق من السياسة الحالية وتسعير الدفع. نقطة نهاية المخطط هي `POST /v1/aliases/setup/plan`؛ وترتبط الخطة التي يعيدها بالسلسلة وجهة التفويض والحالة والموعد النهائي. تظل إزالة النطاق تتم باستخدام [`Unregister`](/ar/blockchain/instructions.md#un-register).

إنشاء أو إزالة نطاق يتطلب إذن إدارة النطاق المناسب بموجب مدقق بيئة تنفيذ البرامج النشطة. يمكن تحديث بيانات وصف المجال مع [`SetKeyValue` و `RemoveKeyValue`](/ar/blockchain/instructions.md#setkeyvalue-removekeyvalue) عندما يكون للجهة المخوَّلة إذن لتعديل هذا النطاق.

## شغّل سير العمل هذا على Taira {#try-it-on-taira}

قُم بإدراج النطاقات المرئية حالياً على شبكة الاختبار العامة Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

اربط إدخالات كتالوج مسارات التنفيذ العامة بالأسماء المستعارة لمساحات البيانات:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

استخدم الأمر الأول عندما يحتاج التطبيق إلى التحقق مما إذا كان النطاق موجودًا. استخدم كتالوج مسارات التنفيذ لفحص مسارات التنفيذ المرتبطة بمساحة البيانات، بما في ذلك رؤية كل مسار تنفيذ سواء كانت عامة أو مقيدة وحالة مزامنته بالنسبة إلى مسار التنفيذ الأساسي.

إعداد النطاق عملية كتابة تدفع رسومًا. قبل تجربتها على Taira، موّل الموقّع باتباع تدفق خدمة التمويل التجريبي ذي مرحلة الإعداد في [الحصول على XOR التجريبي على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)، ثم طبّق الخطة مع تحديد دافع الرسوم صراحة. تعرض CLI الرسوم الدقيقة قبل التوقيع:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

ابنِ نيةً لاسم نطاق فريد على تشغيلات الشبكة الاختبارية المتكررة، واستخدم سياسة Taira الحالية وحارس التحقق من سعر الرسوم لأصل الرسوم. لا تُعد استخدام خطة أُنتجت للشبكة المحلية أو Minamoto.

## العلاقة بالكيانات الأخرى {#relationship-to-other-entities}

تجمع النطاقات كائنات دفتر الأستاذ الموزع وتوفر مساحة أسماء للبيانات الخاصة بالنطاق. تستخدم تعريفات الأصول معرفات مؤهلة بالنطاقات، ويمكن للاستفسارات سرد النطاقات أو ابحث عن الكائنات المقيّدة بنطاق. الحسابات نفسها ليس لها نطاق في نموذج البيانات الحالي، لكن الحسابات يمكن أن تملك نطاقات وتمتلك أصولاً تُعرف تعريفاتها ضمن النطاقات.

انظر أيضًا:

- [العالم](/ar/blockchain/world.md)
- [الأصول](/ar/blockchain/assets.md)
- [البيانات الوصفية](/ar/blockchain/metadata.md)
- [قواعد التسمية](/ar/reference/naming.md)
