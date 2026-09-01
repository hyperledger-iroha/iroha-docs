---
translation_locale: ar
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# رسوم الراعي لمساحة بيانات خاصة {#sponsor-fees-for-a-private-dataspace}

تتيح رعاية الرسوم للمستخدمين تقديم معاملات مساحة البيانات الخاصة دون امتلاك XOR. لا يزال المستخدم يوقع على المعاملة. تشير بيانات تعريف المعاملة إلى حساب الراعي، ويقوم بيئة تنفيذ البرنامج بخصم رصيد XOR للراعي مقابل رسوم الشبكة.

يحتوي التكامل على ثلاثة أجزاء متحركة:

1. العقدة تسمح برعاية الرسوم
2. حساب الراعي موجود ولديه XOR
3. لكل مستخدم `CanUseFeeSponsor` لذلك الراعي

بعد ذلك، كل معاملة لمستخدم مُموَّل تحتاج فقط إلى هذه البيانات الوصفية:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

تُظهر هذه الصفحة نمطين شائعين:

- المستخدم المجاني يكتب: الراعي يدفع XOR والمستخدم لا يدفع شيئًا.
- رسوم الرموز المحلية: يدفع المستخدم للراعي برمز التطبيق، ويدفع الراعي للشبكة بـ XOR.

استخدم Taira أو شبكة اختبار خاصة أولاً. المساحة البيانات الخاصة الجديدة هي تغيير في المشغل والحكم؛ ولا يتم إنشاؤها بواسطة تكوين العميل.

## قيم المثال {#example-values}

الأوامر أدناه تستخدم هذه العناصر النائبة:

```bash
export DATASPACE="team"
export USER="<USER_ACCOUNT_I105>"
export SPONSOR="<SPONSOR_ACCOUNT_I105>"
export TREASURY="<TREASURY_ACCOUNT_I105>"
export XOR_ASSET="xor#universal"
export BILLING_DOMAIN="billing.team"
export LOCAL_FEE_ASSET="usage#billing.team"
export LOCAL_FEE_ASSET_ID="<LOCAL_FEE_ASSET_DEFINITION_BASE58>"
export USER_ALIAS="alice@team"
export PHONE_POLICY="phone#team"
export EMAIL_POLICY="email#team"
export POLICY_OWNER="<IDENTIFIER_POLICY_OWNER_ACCOUNT_I105>"
```

استخدم معرفات حسابات I105 وفقًا للبروتوكول القياسي ما لم يكن نشرُك يحتوي على أسماء مستعارة نشطة لنفس الحسابات.

## 1. إعداد مساحة البيانات {#_1-prepare-the-dataspace}

ابدأ من كتالوج مساحة البيانات الخاصة والعمل على التوجيه الموصوف في [الاتصال بمساحات البيانات SORA Nexus](/ar/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). يبدو الجزء الموجه للمشغل هكذا:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "team-private"
description = "Private team lane"
dataspace = "team"
visibility = "private"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "team"
id = 42
description = "Private team dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "team"
[nexus.routing_policy.rules.matcher]
account_prefix = "team."
description = "Route team domains to the private dataspace"
```

قبل الانتقال إلى معاملات المستخدم، تحقق من أن:

- يظهر مسار التنفيذ الخاص في استجابة العقدة `/status`
- يتم قبول حسابات المستخدمين عبر عملية الإعداد الخاصة بك
- حساب الراعي موجود
- أصل الرسوم XOR وحساب امتصاص الرسوم صالحان على الشبكة

## 2. تسجيل الأصول في فضاء البيانات {#_2-register-assets-in-the-dataspace}

سجِّل تعريفات الأصول التي سيحتفظ بها المستخدمون داخل مساحة البيانات الخاصة قبل أن تربطها بمنطق التطبيق. بالنسبة لنموذج رسوم الرمز المميز المحلي، يستخدم الدليل `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

أولًا، أعدّ النطاق وإيجار SNS اللذين يملكان مساحة أسماء الأصل. أنشئ طلب نية `AliasSetupPlanRequestV1` خاليًا من الأسرار لـ `$BILLING_DOMAIN`، متضمنًا معرّف مساحة البيانات الرقمي `team`، والمالك بالصيغة المعيارية، ومدة الإيجار، وقيد عرض السعر الحالي:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

ثم قم بتسجيل تعريف الأصل. معرف تعريف الأصل على مستوى الشبكة لبروتوكول واحد قياسي `--id` هو. الاسم المستعار هو ما يجب على المطورين والمستخدمين النهائيين استخدامه في كود مساحة البيانات:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

إصدار أو نقل الرمز المحلي إلى المستخدم أثناء الانضمام:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

تحقق من رصيد المستخدم:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

استخدم نفس النمط لأصول التطبيقات في مساحة البيانات. سجّل تعريف أصل واحد لكل رمز، ومنح كل واحد منها اسم مستعار لمساحة البيانات، وارجع إلى الاسم المستعار من كود SDK بدلاً من ترميز تعريفات الأصول القياسية للبروتوكول بشكل ثابت.

## 3. تسجيل أسماء المستخدمين المستعارة {#_3-register-user-aliases}

الحسابات لا تزال معرفات حسابات قياسية لبروتوكول واحد I105. الأسماء التي يراها المستخدم هي ألقاب الحساب، ويجب أن تكون الألقاب أسماء غير حساسة مثل `alice@team` أو `alice@members.team`. لا تستخدم أرقام الهواتف أو عناوين البريد الإلكتروني كأسماء مستعارة. هذه تنتمي إلى تدفق المعرفات الخاصة في القسم التالي.

إعداد الاسم المستعار يستخدم نفس المخطط الإعلاني مثل إعداد المجال. يجب أن يقوم SDK أو خدمة الإعداد بإنشاء نية `AliasSetupPlanRequestV1` خالية من الأسرار بحيث يستهدف إدخال الاسم المستعار للحساب `$USER`، يختار الدور الأساسي، يثبت معرف فضاء البيانات الرقمي، ويحمل وصاية التحقق من رسوم الإيجار-السعر الحالية. ثم قم بتخطيطه وتطبيقه كمعاملة ذرية واحدة:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

إذا لم يكن على المستخدم دفع XOR، استخدم خدمة الانضمام المعتمدة التي تدرك الكفيل لبناء وتقديم معاملة الإعداد. لا تقم بتقسيم استحواذ الإيجار وربط الاسم المستعار إلى معاملات تطبيق مستقلة.

بعد ربط الاسم المستعار، تحقق منه من CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

لإنشاء حساب جديد، يفضل استخدام خدمة الانضمام التي تبني `NewAccount` مع `uaid` مستقر وإذا لزم الأمر، `label` ابتدائي. الأمر البسيط `ledger account register --id` يقوم فقط بتسجيل معرف الحساب الواحد وفق معيار البروتوكول.

## 4. سجل الهاتف والبريد الإلكتروني بشكل خاص مع FHE {#_4-register-phone-and-email-privately-with-fhe}

استخدم أرقام الهواتف وعناوين البريد الإلكتروني كمطالبات بمُعرفات خاصة، وليس كأسماء مستعارة عامة. تدفق FHE-المدعوم يبقي المعرفات الخام خارج أسماء الحسابات المستعارة وبيانات المعاملات وحالة العالم:

1. يقوم المشغل بتسجيل [RAM-LFE/FHE سياسة البرنامج](/ar/blockchain/ram-lfe.md) للهاتف والبريد الإلكتروني
2. يقوم المشغل بتسجيل سياسات المعرف النشط مثل `phone#team` و `email#team`
3. تقوم المحفظة بتطبيع الهاتف أو البريد الإلكتروني محليًا
4. ترسل المحفظة القيمة المشفرة إلى المحلّل
5. يُرجع المحلّل `IdentifierResolutionReceipt`
6. يقوم المستخدم بتقديم `ClaimIdentifier` مع سجل نتيجة البروتوكول
7. تخزّن السلسلة معرّفًا معتمًا وهاش الإيصال، لا قيمة الهاتف أو البريد الإلكتروني الخام

إعداد سياسة جانب المشغل هو SDK أو مهمة خدمة. قم ببناء وتقديم أزواج التعليمات هذه لكل نوع معرف:

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "$POLICY_OWNER",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "$PHONE_POLICY",
  owner = "$POLICY_OWNER",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "$PHONE_POLICY")
```

كررها للبريد الإلكتروني مع:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

أثناء عملية الانضمام، يجب على المحفظة أو الخلفية أن تقوم بالتطبيع محليًا:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

بعد إنشاء ملف بيانات التعريف للراعي في الخطوة 8، قدم تعليمات مطالبة موقعة من المستخدم مع تلك البيانات:

```text
ClaimIdentifier(
  account = "$USER",
  receipt = IdentifierResolutionReceipt {
    payload: {
      policy_id: "$PHONE_POLICY",
      opaque_id: "<OPAQUE_ACCOUNT_ID>",
      uaid: "<USER_UAID>",
      account_id: "$USER",
      ...
    },
    attestation: "<RESOLVER_SIGNATURE_OR_PROOF>"
  }
)
```

الـ CLI الحالي لا يكشف عن أوامر مكتوبة لهذه التعليمات الخاصة بالهوية. قم بإنشاء قيم `InstructionBox` متسلسلة باستخدام SDK وقدمها من خلال `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

احتفظ بهذه الحواجز التوجيهية في خدمة الإلحاق بالمستخدمين:

- أسماء الحساب المستعارة هي مجرد معرفات يمكن للإنسان قراءتها
- القيم الخام للهاتف والبريد الإلكتروني لا تظهر أبدًا في الألقاب أو بيانات التعريف أو السجلات أو محتويات المعاملات
- الحساب لديه `uaid` قبل أن يطالب بمعرّفات خاصة
- سجلات نتائج البروتوكول مرتبطة بـ `policy_id`، `opaque_id`، `uaid`، `account_id`، وانتهاء الصلاحية
- مفاتيح المحللات وقيم الالتزام التشفيري للبرنامج المخفي يتم التحكم فيها بواسطة الحوكمة

## 5. تمكين الرعاية على العقدة {#_5-enable-sponsorship-on-the-node}

رعاية الرسوم هي سياسة للعقدة/وقت التشغيل. قم بتمكينها في تكوين الرسوم Nexus:

```toml
[nexus.fees]
fee_asset_id = "xor#universal"
fee_sink_account_id = "<FEE_SINK_ACCOUNT_I105_OR_ALIAS>"
base_fee = "0"
per_byte_fee = "0"
per_instruction_fee = "0.001"
per_gas_unit_fee = "0.00005"
sponsorship_enabled = true
sponsor_max_fee = "0"
```

`fee_asset_id` هو أصل رسوم الشبكة. بالنسبة لـ SORA Nexus هذا هو XOR. استخدم الاسم المستعار النشط XOR أو معرف تعريف الأصل الوحيد بمعيار البروتوكول XOR المعروض بواسطة شبكتك.

`sponsor_max_fee = "0"` يعني أنه لا يوجد حد للرعاية لكل معاملة. للإنتاج، قم بتعيين حد غير صفري بعد أن تعرف الحجم الطبيعي وملف تكلفة تنفيذ المعاملات لمساحات البيانات الخاصة بك.

أعد تشغيل هذا التكوين أو مرره عبر عملية المشغل العادية الخاصة بك.

## 6. إنشاء الجهة الراعية وتمويلها {#_6-create-and-fund-the-sponsor}

قم بإنشاء زوج مفاتيح للراعي إذا لزم الأمر:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

حوّل المفتاح العام إلى صيغة الحساب لشبكتك:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

سجّل حساب الراعي من خلال عملية الانضمام الخاصة بك:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

موّل الراعي بمبلغ XOR من الخزانة أو حساب المطالبة أو أي حساب ممول آخر:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

لتمارين Taira، احفظ مساعد خدمة تمويل الشبكة التجريبية من [احصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) باسم `taira_faucet_claim.py`، ثم موّل الراعي باستخدام خدمة تمويل الشبكة التجريبية العامة بدلاً من تحويل الخزانة:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

تحقق من رصيد الراعي XOR:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. منح المستخدم حق الوصول إلى الراعي {#_7-grant-a-user-access-to-the-sponsor}

يجب على الراعي منح كل مستخدم إذنًا لفرض الرسوم عليه. الإذن هو ما يمنع المستخدمين من تسمية حسابات الراعي بشكل عشوائي.

قم بتشغيل هذا كحساب الراعي، أو كحساب تشغيلي مسموح به بواسطة سياسة بيئة تنفيذ البرنامج الخاصة بك:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission grant --id "$USER"
```

بالنسبة لخدمات الانضمام، اجعل هذا خطوة طبيعية لتوفير الحساب وسجل:

- حساب المستخدم
- حساب الراعي
- فضاء البيانات أو التطبيق
- تذكرة الموافقة أو قرار الحوكمة

لفحص صلاحيات المستخدم:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. إرفاق بيانات تعريف الراعي {#_8-attach-sponsor-metadata}

أنشئ ملف بيانات وصفية قابل لإعادة الاستخدام:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

أي كتابة يتم تقديمها مع هذه البيانات الوصفية تُحمّل على الكفيل:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

بالنسبة لـ SDKs، قم بإرفاق نفس كائن بيانات المعاملة بالمعاملة الموقعة. يقوم المستخدم بتوقيع المعاملة بمفتاح المستخدم. لا يقوم الراعي بتوقيع كل معاملة للمستخدم لأن منح `CanUseFeeSponsor` السابق هو التفويض.

## النمط 1: المستخدمون لا يدفعون أي رسوم {#pattern-1-users-pay-no-fees}

استخدم هذا عندما يقوم التطبيق أو المشغل بتحمل جميع رسوم الشبكة.

قائمة التحقق للمطور:

1. حافظ على حمولة المعاملة العادية للمستخدم بدون تغيير.
2. أضف بيانات تعريف المعاملة باستخدام `fee_sponsor`.
3. سجّل باسم المستخدم.
4. قدّم من خلال طريق مساحة البيانات الخاصة.

لا يحتاج حساب المستخدم إلى رصيد XOR. يجب على حساب الراعي الاحتفاظ بما يكفي من XOR لتغطية رسوم Nexus المكونة.

## النمط 2: المستخدمون يدفعون برمز محلي {#pattern-2-users-pay-a-local-token}

استخدم هذا عندما لا يجب على المستخدمين الاحتفاظ بـ XOR، ولكن لا يزال الفضاء البياني يحتاج إلى رسوم تطبيق داخلية أو إنفاق رصيد أو رمز حصة.

في هذا النمط، الرمز المحلي هو دفعة تطبيق. إنه ليس أصل رسوم الشبكة. لا يزال الكفيل يدفع رسوم الشبكة بـ XOR.

على سبيل المثال، استخدم رمزًا محليًا في مساحة البيانات الخاصة:

```text
usage#billing.team
```

قم بتمويل المستخدمين بمبلغ `usage#billing.team` أثناء عملية الانضمام، تجديد الاشتراك، أو تخصيص الحصة. ثم اجعل عملية المستخدم معاملة ذرية:

1. نقل الرموز المحلية من المستخدم إلى الكفيل
2. تنفيذ عملية التطبيق المطلوبة
3. تضمين بيانات التعريف `fee_sponsor` حتى يدفع الراعي XOR

اختبار الدخان البسيط CLI هو مجرد تحويل رمز محلي برعاية XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

بالنسبة لتطبيق حقيقي، لا تقدم دفعة الرموز المحلية كمعاملة منفصلة بأفضل جهد. قم ببناء معاملة موقعة واحدة تحتوي على كل من الدفعة والتعليمات التجارية، أو اكشف عن نقطة دخول للعقد تقوم بجمع الرمز المحلي قبل تنفيذ العملية التجارية.

احتفظ بسياسة التحويل في تطبيقك أو عقدك:

- ما هي العملية التي تكلف كم وحدة توكن محلية
- كيف يتم ربط تدفق الرموز المحلية بعمليات إعادة شحن الراعي XOR
- ماذا يحدث عندما يكون رصيد المستخدم منخفضًا جدًا
- ماذا يحدث عندما يكون رصيد الراعي XOR منخفضًا جدًا

::: warning

لا تستخدم `gas_asset_id` لنمط "رسم التوكن المحلي" إلا إذا كنت تريد أن يتم فرض رسوم على الراعي أيضًا في أصل تكلفة تنفيذ المعاملة هذا. في تنفيذ البرنامج الحالي البيئة، `fee_sponsor` تجعل الراعي أيضًا هو الدافع لخصومات أصول خط أنابيب الغاز المكوَّنة. بالنسبة لرسوم مستخدمي الرمز المحلي، اجمع الرمز صراحةً من خلال تحويل أو قاعدة العقد.

:::

## فشل تصحيح المعاملات الممولة {#debug-failed-sponsored-transactions}

عادةً ما تشير أسباب الرفض الشائعة إلى خطوة إعداد مفقودة:

|نص الخطأ|ماذا يجب التحقق منه|
| --- | --- |
| `fee sponsorship is disabled` |لا يزال `nexus.fees.sponsorship_enabled` `false` على العقدة.|
| `fee sponsor is not authorized` |المستخدم ليس لديه `CanUseFeeSponsor` لهذا الكفيل.|
| `fee asset ... is missing` |الراعي لا يمتلك أصل الرسوم XOR المكون.|
| `fee balance ... is insufficient` |قم بزيادة رصيد الراعي XOR.|
| `fee exceeds sponsor_max_fee` |رفع `sponsor_max_fee` أو تقليل حجم المعاملة/الغاز.|
| `invalid nexus fee asset id` |قم بإصلاح `nexus.fees.fee_asset_id` أو اسم مستعار للأصل XOR.|

عند تصحيح النمط 2، تحقق من كلا الرصيدين:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"

iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

## تشغيل الراعي {#operate-the-sponsor}

عامل الراعي كحساب خزانة:

- احتفظ بمفاتيح الراعي منفصلة لشبكة الاختبار، والمرحلة التجريبية، والشبكة الرئيسية
- تنبيه قبل أن يصل رصيد الراعي XOR إلى الحد الأدنى للقبول
- تعيين حد `sponsor_max_fee` غير صفري بمجرد تحديد خصائص الحركة
- تحديد معدل الكتابات المدعومة في تطبيقك أو البوابة
- إلغاء `CanUseFeeSponsor` عندما يغادر المستخدمون فضاء البيانات
- مصالحة تجزئات المعاملات المشفرة للمستخدم، والمدفوعات بالرمز المحلي، وخصومات الراعي XOR

إلغاء كفالة مستخدم:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission revoke --id "$USER"
```

## صفحات ذات صلة {#related-pages}

- [الاتصال بمساحات البيانات SORA Nexus](/ar/get-started/sora-nexus-dataspaces.md)
- [شغّل Iroha 3 عبر CLI](/ar/get-started/operate-iroha-via-cli.md)
- [الأصول](/ar/blockchain/assets.md)
- [الأذونات](/ar/blockchain/permissions.md)
- [رموز الإذن](/ar/reference/permissions.md)
