---
translation_locale: ar
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# النطاقات {#domains}

النطاقات هي مساحات أسماء مسماة مسجلة في `World`. في نموذج البيانات الحالي Iroha 3 يتم تأهيل النطاق بواسطة مساحة البيانات الأصلية له، لذا فإن معرف البروتوكول القياسي الوحيد هو:

```text
domain.dataspace
```

على سبيل المثال، `payments.universal` يسمي المجال `payments` داخل مساحة البيانات `universal`.

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

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

النوايا تحدد `payments.universal`, مساحتها الرقمية، بروتوكول واحد-القياسي I105 المالك، مدة استحواذ الإيجار، وصاحب السياسة الحالية/حارس التحقق من سعر الرسوم-الدفع. المخطط API نقطة النهاية هي `POST /v1/aliases/setup/plan`; الخطة المرجعة مرتبطة بالسلسلة، تفويض المعاملة الهوية، حالة دفتر سلسلة الكتل، والموعد النهائي. لا يزال استخدام إزالة النطاق [`Unregister`](/ar/blockchain/instructions.md#un-register).

إنشاء أو إزالة نطاق يتطلب إذن إدارة النطاق المناسب بموجب مدقق بيئة تنفيذ البرامج النشطة. يمكن تحديث بيانات وصف المجال مع [`SetKeyValue` و `RemoveKeyValue`](/ar/blockchain/instructions.md#setkeyvalue-removekeyvalue) عندما يكون للجهة المخوَّلة إذن لتعديل هذا النطاق.

## شغّل سير العمل هذا على Taira {#try-it-on-taira}

قُم بإدراج النطاقات المرئية حالياً على شبكة الاختبار العامة Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

قم بتوصيل فهرس ممر الإعدام العام مرة أخرى بأسماء المستعارة لمساحة البيانات:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

استخدم الأمر الأول عندما يحتاج التطبيق للتحقق مما إذا كان النطاق موجودًا. استخدم كتالوج مسار التنفيذ عندما تحتاج إلى التأكد مما إذا كانت مساحة البيانات عامة أو مقيدة أو متأخرة عن مسار التنفيذ الرئيسي.

إعداد النطاق عملية كتابة تتطلب دفع رسوم. قبل تجربتها على Taira، احفظ أداة خدمة تمويل الاختبار من [الحصول على XOR لشبكة Taira التجريبية](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) باسم `taira_faucet_claim.py`، وموّل الموقّع عبر خدمة التمويل العامة، ثم أرفق بيانات تعريف الرسوم:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
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
