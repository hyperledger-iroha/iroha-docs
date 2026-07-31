---
translation_locale: ar
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# المجال {#domains}

النطاقات هي أسماء المساحات المسجلة في `World`. في الوقت الحالي Iroha
3 نموذج البيانات نطاق مؤهل من خلال مساحة البيانات الأم، لذلك القنوني
المعرف هو:

```text
domain.dataspace
```

مثلاً، `payments.universal` الاسماء `payments` المجال داخل
`universal` مساحة البيانات

## الهيكل {#structure}

شركة مسجلة `Domain` يحتوي على:

- `id`: المجال البيانات المؤهل `DomainId`
- `logo`: اختياري `SoraFS` URI لرمز النطاق
- `metadata`: البيانات الأساسية القيمة المفتاحية
- `owned_by`: الحساب الذي يمتلك النطاق، عادةً الحساب الذي
  مسجلة

الحمولة المفيدة التي تستخدم لتحقيق النطاق هو `NewDomain`. إنه يحمل
الموقع `id`, اختياري `logo`, والبدء `metadata`. وقت التشغيل يملأ
`owned_by` العملاء العاديون لا يقدمون هذه الحملة المفيدة
مباشرة.

## التسجيل {#registration}

إنشاء النطاقات العادية يستخدم تدفق إعداد الإعلاني. هذا يحافظ على
SNS الإيجار، قدرات المالك، حراسة الاقتباسات، وسلسلة النطاق في واحدة الذرية
`EnsureAlias` المعاملة `Register::Domain` لا يزال جينيس / بوتستراب
السطح ، وال `ledger domain` القيادة لا `register` القائد الفرعي

إخلق سرية `AliasSetupPlanRequestV1` نية مع SDK أو إدخالها
الخدمة، ثم الحصول على CLI تخطيطها ضد الحالة الحية وتقديم تلك الدقة
خطة:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

النية تحدد `payments.universal`, مساحة البيانات الرقمية ، القنوني
I105 المالك، مدة استحواذ الإيجار، والسياسة الحالية/سعر الدفع.
نقطة نهاية المخطط هي `POST /v1/aliases/setup/plan`; خطته المرجعة هي
السلسلة والسلطة والدولة والموعد النهائي.
[`Unregister`](/ar/blockchain/instructions.md#un-register).

إنشاء أو إزالة نطاق يتطلب إدارة النطاق المناسبة
الإذن تحت مؤكدة التشغيل النشط. يمكن تحديث بيانات المجال
[`SetKeyValue` و `RemoveKeyValue`](/ar/blockchain/instructions.md#setkeyvalue-removekeyvalue)
عندما يكون لدى السلطة إذن لتغيير هذا النطاق.

## جربها Taira {#try-it-on-taira}

إدراج الأسماء التي تظهر حاليًا على الإنترنت Taira شبكة اختبار:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

خريطة الكتالوج العام إلى أسماء مستعار للمساحة البيانية:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

استخدم الأوامر الأولى عندما يحتاج تطبيق للتحقق من وجود نطاق.
كتالوج المسارات عندما تحتاج إلى تأكيد ما إذا كان مساحة البيانات عامة،
محدودة، أو تتخلف عن المسار الأساسي.

إعداد النطاق هو كتابة مدفوعة الرسوم قبل محاولة ذلك على Taira, إنقاذ
مساعدة النوافذ من
[احصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
كما `taira_faucet_claim.py`, تمويل الموقّع من خلال الصنبور العام، و
بيانات الأساسية الخاصة بالرسوم:

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

بناء نية اسم النطاق الفريد على تشغيل شبكة اختبار متكررة، واستخدام
Taira السياسة الحالية وحماية الأسهم الرسومية. لا تستخدم الخطة المنتجة مرة أخرى
للشبكة المحلية أو Minamoto.

## العلاقات مع الكيانات الأخرى {#relationship-to-other-entities}

المجالات مجموعة الكتب الرئيسية الأشياء وتوفير مساحة الأسماء للبيانات التي يتم توفير نطاق المجال.
تعريفات الأصول تستخدم المعرفات المؤهلة للمجال ، ويمكن أن تقوم الأسئلة بإدراج
الحسابات نفسها هي
بدون نطاق في نموذج البيانات الحالي ، ولكن يمكن للحسابات امتلاك النطاقات واحتفاظ بها
الأصول التي تعريفاتها تقع تحت المجال.

انظر أيضاً:

- [العالم](/ar/blockchain/world.md)
- [الأصول](/ar/blockchain/assets.md)
- [البيانات المتعددة](/ar/blockchain/metadata.md)
- [قواعد الإسم](/ar/reference/naming.md)
