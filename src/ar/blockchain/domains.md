---
translation_locale: ar
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# المجالات {#domains}

يتم تسمية النطاقات بأماكن الأسماء المسجلة في `World`. في نموذج البيانات الحالي Iroha 3، يتم تصنيف نطاق من خلال مساحة البيانات الأم ، لذلك هو المعرف القنوني:

```text
domain.dataspace
```

على سبيل المثال، `payments.universal` تسمى النطاق `payments` داخل مساحة البيانات `universal`.

## الهيكل {#structure}

`Domain` المسجلة تحتوي على:

- `id`: مساحة البيانات المؤهلة `DomainId`
- `logo`: اختياري `SoraFS` URI لرمز النطاق.
- `metadata`: بيانات أساسية تعسفية.
- `owned_by`: الحساب الذي يمتلك النطاق، عادةً الحساب الذي سجل هذا النطاق

الحمل المفيد للشروع الذي يستخدم لتحقيق النطاق هو `NewDomain`. يحمل `id` ، اختياريًا `logo` ، والابتدائية `metadata`. يتم ملء وقت التشغيل `owned_by` من السلطة. العملاء العاديون لا يقومون بتقديم هذا الحمولة المفيدة مباشرة.

## التسجيل {#registration}

يستخدم إنشاء النطاقات العادية تدفق إعداد الاسم الإعلاني. هذا يحافظ على عقد الإيجار SNS ، وقدرات المالك ، وحماية الاقتباسات ، وصف النطاق في معاملة واحدة ذرية `EnsureAlias`. يبقى `Register::Domain` سطح جينيس / تشغيل، و`ledger domain` الأوامر لا تحتوي على `register` الفرعية .

قم بإنشاء نية `AliasSetupPlanRequestV1` خالية من السرية مع خدمة SDK أو إدخالها ، ثم جعلها تخطيط CLI ضد الحالة الحية وتقديم هذه الخطة الدقيقة:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

يحدد النية `payments.universal` ، ومساحة البيانات الرقمية لها، والمالك القنوني I105، وشروط استحواذ الإيجار، وحارس السياسة الحالية / مدفوعات الدفع. نقطة نهاية المخطط هي `POST /v1/aliases/setup/plan`؛ خطتها المستردة مقيدة بالسلسلة والسلطة والدولة والموعد النهائي. لا يزال إزالة النطاق تستخدم [`Unregister`](/ar/blockchain/instructions.md#un-register).

إنشاء أو إزالة نطاق يتطلب الإذن المناسب لإدارة النطاق تحت مؤكدة التشغيل النشطة. يمكن تحديث بيانات المجال مع [`SetKeyValue` و `RemoveKeyValue`](/ar/blockchain/instructions.md#setkeyvalue-removekeyvalue) عندما يكون لدى السلطة إذن لتعديل هذا النطاق .

## جربوا ذلك على Taira {#try-it-on-taira}

إدراج المناطق الواضحة حاليا على شبكة اختبار Taira العامة:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

خريطة كتالوج الشارع العام مرة أخرى إلى مستعار مساحة البيانات:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

استخدم الأوامر الأولى عندما يحتاج التطبيق إلى التحقق من وجود نطاق. استخدم قائمة المسارات عندما تحتاج إلى تأكيد ما إذا كان مساحة البيانات عامة أو مقيدة أو تتخلف عن المسار الأساسي.

إعداد النطاق هو كتابة مدفوعة الرسوم. قبل تجربتها على Taira، حفظ مساعدة المياه من [حصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ك `taira_faucet_claim.py` ، وتمويل الموقّع من خلال المياه العامة، ورابط بيانات metadata رسوم:

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

قم ببناء نية اسم النطاق الفريد على تشغيل شبكات الاختبار المتكررة، واستخدام سياسة Taira الحالية وحماية اقتباسات الأصول الرسومية. لا تستخدم مرة أخرى خطة تم إنشاؤها لـ localnet أو Minamoto.

## العلاقات مع الكيانات الأخرى {#relationship-to-other-entities}

مجموعة النطاقات الكبرى العناصر وتوفير مساحة أسماء للبيانات التي تمتد على نطاق النطاق. تعريفات الأصول تستخدم المعرفات المؤهلة للنطاقات، والمسائل يمكن أن تدرج المناطق أو البحث الكائنات المحددة إلى نطاق النطاق. الحسابات نفسها بلا نطاق في نموذج البيانات الحالية، ولكن يمكن للحسابات امتلاك النطاقات والاحتفاظ بالأصول التي تعريفاتها تعيش تحت النطاقين.

انظر أيضاً:

- [العالم](/ar/blockchain/world.md)
- [الأصول](/ar/blockchain/assets.md)
- [البيانات الأساسية](/ar/blockchain/metadata.md)
- [قواعد الإسم ](/ar/reference/naming.md)
