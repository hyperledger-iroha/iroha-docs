---
translation_locale: ar
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# رسوم الرعاية الخاصة بمجال البيانات الخاص {#sponsor-fees-for-a-private-dataspace}

الرعاية الرسومية تسمح للمستخدمين بإرسال معاملات في مساحة البيانات الخاصة دون
المزارع XOR. لا يزال المستخدم يوقع على المعاملة
النقاط في حساب الراعي، ومدة التشغيل مدفوعات الراعي XOR التوازن
مقابل رسوم الشبكة

التكامل يحتوي على ثلاثة أجزاء متحركة:

1. العقد يسمح برعاية الرسوم
2. حساب الراعي موجود و قد XOR
3. كل مستخدم لديه `CanUseFeeSponsor` لهذا الراعي

بعد ذلك، كل معاملة مستخدم برعاية تحتاج فقط إلى هذه البيانات المعدنية:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

هذه الصفحة تظهر نمطين شائعين:

- **يكتب المستخدم المجاني**: الراعي يدفع XOR و لا يدفع المستخدم شيئاً
- **الرسوم المحلية**: يدفع المستخدم الراعي في رمز التطبيق،
  الراعي يدفع الشبكة في XOR.

الاستخدام Taira أو شبكة اختبار خاصة أولاً.
تغيير المشغل والحوكمة؛ لا يتم إنشاؤه حسب تشكيل العميل.

## القيم المثالية {#example-values}

الأوامر التالية تستخدم هذه المواقع:

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

استخدم القوانين I105 الحساب IDs ما لم يكن لدى نشاطك حساب نشط
أسماء مستعار لنفس الحسابات.

## 1 إعداد مساحة البيانات {#_1-prepare-the-dataspace}

البدء من الكتالوج الخاص بمجال البيانات والعمل التوجيهي الموصوف في
[التواصل مع SORA Nexus البيانات](/ar/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace).
جزء يواجه المشغل يبدو هكذا:

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

- الشارع الخاص يظهر في العقدة `/status` الرد
- يتم قبول حسابات المستخدمين من خلال تدفقك الخاص
- وجود حساب الراعي
- الموقع XOR أصول الرسوم وحساب غسل الرسوم صالحون على الشبكة

## سجل الأصول في مساحة البيانات {#_2-register-assets-in-the-dataspace}

سجل تعريفات الأصول التي سيحتفظ بها المستخدمون داخل القطاع الخاص
مساحة البيانات قبل أن تقوم بتوصيلها إلى منطق التطبيق. مقابل رسوم الشعار المحلي
النمط، استخدامات التعليمية `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

أولاً إعداد النطاق و SNS الإيجار الذي يمتلك مساحة أسماء الأصول.
لا يخفى عليه `AliasSetupPlanRequestV1` نية `$BILLING_DOMAIN`, بما في ذلك
الرقمية `team` مساحة البيانات ID, المالك القديس، مدة الإيجار، والقيمة الحالية
الحارس:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

ثم سجل تعريف الأصول `--id` هو مستوى الشبكة
تعريف الأصول ID. الاسم الخاطئ هو ما يجب على المطورين والمستخدمين النهائيين استخدامه في
رمز مساحة البيانات:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

النقش أو نقل الرمز المحلي إلى المستخدم أثناء الإدخال:

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

استخدم نفس النمط لأصول التطبيقات في مساحة البيانات. سجل واحد
تعريف الأصول لكل رمز، إعطاء كل واحد مستعار مساحة البيانات، وإشارة إلى
اسم مستعار من SDK رمز بدلاً من تعريف الأصول الصلبة القنونية IDs.

## 3- تسجيل أسماء مستخدم {#_3-register-user-aliases}

الحسابات لا تزال قائمة I105 الحساب IDs. أسماء المستخدمين هي حسابات
الأسماء غير الحساسة مثل: `alice@team` أو
`alice@members.team`. لا تستخدم أرقام الهاتف أو عناوين البريد الإلكتروني كاسم مستعار.
هذه تنتمي إلى التدفق المعرفي الخاص في القسم التالي

تعتمد إعدادات الاسم الألياس على نفس المخطط الإعلاني مثل إعدادات النطاق. SDK أو
الخدمة الإلتحاق تخلق خفية السر `AliasSetupPlanRequestV1` الذي نيته
أهداف الدخول في الحسابات `$USER`, يختار الدور الأساسي ، ويقوم بتحديد الرقم
مساحة البيانات ID, و يحمل حارس اقتراح الإيجار الحالي ثم تخطيط وتطبيقه
كمعاملة نووية واحدة:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

إذا لم يدفع المستخدم XOR, استخدم الإنشاءات المعتمدة على علم الراعي
خدمة لبناء وتقديم معاملة الإعداد. لا تقسيم العقد
عمليات الاستحواذ والعرف التلقائي المرتبطة بعمليات التطبيق المستقلة.

بعد أن يتم ربط الاسم الخاطئ، التحقق منه من CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

لإنشاء حساب جديد، تفضل خدمة الإدخال التي تقوم ببناء
`NewAccount` مع مستقر `uaid` وإذا لزم الأمر، `label`. (الـ)
بسيطة `ledger account register --id` القيادة تسجل فقط القوانين
الحساب ID.

## 4. تسجيل الهاتف والبريد الإلكتروني بشكل خاص مع FHE {#_4-register-phone-and-email-privately-with-fhe}

استخدم أرقام الهاتف وعناوين البريد الإلكتروني كطلبات تحديد شخصية خاصة، وليس عامة
الاسم الأخر FHE- تدفق المدعوم يحافظ على المعرفات الخام دون أسماء مستعار للحساب،
بيانات المعاملة، وحالة العالم:

1. يقوم المشغل بتسجيل
   [RAM-LFE/FHE سياسة البرنامج](/ar/blockchain/ram-lfe.md) للهاتف والبريد الإلكتروني
2. يقوم المشغل بتسجيل سياسات التعرف النشط مثل: `phone#team` و
   `email#team`
3. المحفظة تطبيق الهاتف أو البريد الإلكتروني محليا
4. المحفظة ترسل القيمة المشفرة إلى الحل
5. القرار يعيد `IdentifierResolutionReceipt`
6. يقدم المستخدم `ClaimIdentifier` مع الإيصالات
7. تخزين السلسلة هاشاً غير مرئيّة للتعرف والإيصالات، وليس الهاتف الخام أو
   قيمة البريد الإلكتروني

سياسة جانب المشغل هي SDK أو مهمة خدمة.
أزواج التعليمات هذه لكل نوع من العلامات التعرفية:

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

أكرر ذلك في البريد الإلكتروني مع:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

أثناء الإدخال، يجب أن يتعايش المحفظة أو الخلفية محلياً:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

بعد أن يتم إنشاء ملف البيانات المتعددية الراعي في الخطوة 8 ، قم بإرسال رسالة تم توقيعها من قبل المستخدم
تعليمات الطلب مع هذه البيانات المعدنية:

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

التيار CLI لا يعرض الأوامر المخطوطة لهذه الهوية
الإرشادات. توليد سلسلة `InstructionBox` القيم مع SDK و
تقديمها `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

أبقوا هذه الحواجز في خدمة الإدخال:

- أسماء مستعار للحسابات هي أدوات القراءة البشرية فقط
- قيم الهاتف الخام والبريد الإلكتروني لا تظهر أبداً في الأسماء الأدلة أو البيانات المعدنية أو السجلات، أو
  حمولة الصفقات
- الحساب لديه `uaid` قبل أن تطلب تعريفات خاصة
- الإيصالات تلتزم `policy_id`, `opaque_id`, `uaid`, `account_id`, والإنتهاء
- مفاتيح الحل والتزامات البرنامج الخفية يتم التحكم بها من خلال الحوكمة

## 5- تمكين الرعاية على العقدة {#_5-enable-sponsorship-on-the-node}

الرعاية الرسومية هي سياسة عقد / وقت تشغيله. Nexus إعداد الرسوم:

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

`fee_asset_id` هو قيمة رسوم الشبكة. SORA Nexus هذا هو XOR. استخدم
النشطة XOR الاسم الأدنى أو القنوني XOR تعريف الأصول ID كشفت شبكتك

`sponsor_max_fee = "0"` يعني أنه لا توجد حدّية لكل معاملة من الراعيين.
إنتاج، وضع حد غير صفر بعد أن تعرف الحجم الطبيعي وملف الغاز
من معاملات محيط البيانات الخاص بك.

إعادة تشغيل هذا التشغيل أو تدويرها من خلال عملية المشغل العادية.

## 6 - خلق و تمويل الراعي {#_6-create-and-fund-the-sponsor}

إنتاج زوج مفتاح الراعي إذا لزم الأمر:

```bash
kagami keys --algorithm ed25519 --json
```

تحويل المفتاح العام إلى تنسيق الحساب لشبكتك:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

سجل الحساب الراعي من خلال تدفقك الخاص

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

تمويل الراعي XOR من الخزانة، أو حساب مطالبات، أو آخر تمويل
الحساب:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

ل: Taira التدريبات، باستثناء مساعدة المياه من
[احصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
كما `taira_faucet_claim.py`, ثم تمويل الراعي مع الصنبور العام
بدلاً من تحويل الخزانة:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

تحقق من الراعي XOR التوازن:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7 - منح المستخدم إمكانية الوصول إلى الرعاية {#_7-grant-a-user-access-to-the-sponsor}

يجب على الراعي منح كل مستخدم إذن لفرض رسوم عليه.
ما يمنع المستخدمين من تسمية حسابات الراعي التعسفي.

أستخدم هذا كحساب الراعي، أو كحساب تشغيلي يسمح به
سياسة وقت التشغيل:

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

بالنسبة لخدمات الإدخال، اجعل هذا خطوة عادية لتوفير الحساب وتسجيل:

- حساب المستخدم
- حساب الراعي
- مساحة البيانات أو التطبيق
- تذكرة الموافقة أو قرار الحوكمة

للتفتيش على منح المستخدم:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8 - إرفاق البيانات المضمونة {#_8-attach-sponsor-metadata}

إنشاء ملف البيانات المعدلة لإعادة الاستخدام

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

كل كتابة تقدم بها هذه البيانات المعدنية تتقاضى على الراعي:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

ل: SDKs, إرفاق نفس كائن البيانات المعدنية للمعاملة إلى الموقع
المعاملة. المستخدم يوقع على المعاملة بمفتاح المستخدم
لا يوقع على كل معاملة مستخدم لأن السابق `CanUseFeeSponsor`
الموافقة هي المنحة.

## النمط الأول: المستخدمون يدفعون بدون رسوم {#pattern-1-users-pay-no-fees}

استخدم هذا عند استيعاب التطبيق أو المشغل جميع رسوم الشبكة.

قائمة التحقق من المطورين:

1. حافظ على حمولة المعاملات العادية للمستخدم دون تغيير.
2. إضافة بيانات المعاملة `fee_sponsor`.
3. وقع على اسم المستخدم
4. إرسالها من خلال طريق مساحة البيانات الخاصة.

لا يحتاج حساب المستخدم XOR الميزان، يجب أن يحافظ حساب الراعي على
كفاية XOR لتغطية المكونات Nexus الرسوم

## النمط الثاني: المستخدمون يدفعون رمزا محليا {#pattern-2-users-pay-a-local-token}

استخدم هذا عندما لا يجب على المستخدمين الاحتفاظ XOR, لكن مساحة البيانات لا تزال تريد
رسوم تطبيق داخلية أو نفقات الائتمان أو رموز حصة.

في هذا النمط، فإن الوهم المحلي هو دفع التطبيق.
أصول رسوم الشبكة. لا يزال الراعي يدفع رسوم شبكة في XOR.

على سبيل المثال، استخدم رمز محلي في مساحة البيانات الخاصة:

```text
usage#billing.team
```

مستخدمي الصندوق مع `usage#billing.team` أثناء الإدخال، وتجديد الاشتراك،
أو تخصيص الحصص. ثم جعل معاملة المستخدم الذرية:

1. نقل الرموز المحلية من المستخدم إلى الراعي
2. تنفيذ عملية التطبيق المطلوبة
3. تشمل `fee_sponsor` البيانات المعدنية حتى يدفع الراعي XOR

الحد الأدنى CLI اختبار الدخان هو مجرد نقل الوهم المحلي برعاية من XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

بالنسبة للتطبيق الحقيقي، لا تقدم الدفع بالرمز المحلي على أنها منفصلة
صفقة أفضل جهد. بناء صفقة واحدة وقعت تحتوي على كل من
الدفع والتعليمات التجارية، أو كشف نقطة دخول العقد التي
يجمع الرمز المحلي قبل تطبيق العملية التجارية

احتفظ بسياسة التحويل في تطبيقك أو العقد:

- أي عملية تكلف كم وحدات رمزية محلية
- كيفية تدفق الخرائط المحلية للتكنولوجيا XOR إضافات
- ما الذي يحدث عندما يكون توازن المستخدم منخفض جدا
- ما الذي يحدث عندما الراعي XOR التوازن منخفض جداً

::: warning

لا تستخدم `gas_asset_id` لنمط "رسوم الوهم المحلي" ما لم ترغب
الراعي سيتم فرض رسوم على هذا الأصول الغازية أيضاً.
`fee_sponsor` يجعله الراعي أيضاً المدفوع للغاز المصمم
خصم الأصول. مقابل رسوم المستخدم المحلية، تحصيل الرمز صراحة مع
قاعدة التحويل أو العقد.

:::

## إصلاح المعاملات التي فشلت {#debug-failed-sponsored-transactions}

أسباب الرفض الشائعة تشير عادةً إلى خطوة إعداد واحدة مفقودة:

| نص الخطأ | ما الذي يجب التحقق منه |
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` ما زالت `false` على العقدة |
| `fee sponsor is not authorized` | لم يكن لدى المستخدم `CanUseFeeSponsor` لهذا الراعي |
| `fee asset ... is missing` | الراعي لا يحتفظ بـ XOR أصول الرسوم. |
| `fee balance ... is insufficient` | إضافة الرعاية XOR التوازن |
| `fee exceeds sponsor_max_fee` | أرفع `sponsor_max_fee` أو تقليل حجم المعاملة/غاز. |
| `invalid nexus fee asset id` | إصلاح `nexus.fees.fee_asset_id` أو XOR مستعار الأصول. |

عند إصلاح النمط 2 ، تحقق من كلا الموازين:

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

## إدارة الراعي {#operate-the-sponsor}

تعامل الراعي كحساب خزينة:

- الحفاظ على مفاتيح الراعي منفصلة للشبكة التجريبية، والتنظيم، والشبكة الرئيسية
- إشعار أمام الراعي XOR التوازن يصل إلى طابق القبول
- تعيين غير الصفر `sponsor_max_fee` السقف بعد أن يتم تحديد حركة المرور
- الرسوم المبرمة في طلبك أو البوابة
- الإلغاء `CanUseFeeSponsor` عندما يغادر المستخدمون مساحة البيانات
- تنسيق هاشات المعاملات المستخدمة، ودفع الوهم المحلي، والرعاة XOR
  الديبيت

إلغاء الرعاية للمستخدم:

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

## الصفحات ذات الصلة {#related-pages}

- [التواصل مع SORA Nexus البيانات](/ar/get-started/sora-nexus-dataspaces.md)
- [التشغيل Iroha 3 عبر CLI](/ar/get-started/operate-iroha-via-cli.md)
- [الأصول](/ar/blockchain/assets.md)
- [الإذن](/ar/blockchain/permissions.md)
- [رموز الإذن](/ar/reference/permissions.md)
