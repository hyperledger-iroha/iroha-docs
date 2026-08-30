---
translation_locale: ar
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# رسوم الرعاية عن مساحة بيانات الخاصة {#sponsor-fees-for-a-private-dataspace}

الرعاية الرسومية تسمح للمستخدمين بإرسال معاملات في مساحة البيانات الخاصة دون الحفاظ على XOR. لا يزال المستخدم يوقع على المعاملة. توضع البيانات الأساسية للمعاملة في حساب الراعي، ويدفع وقت التشغيل رصيد الراعي XOR مقابل رسوم الشبكة.

التكامل يحتوي على ثلاثة أجزاء متحركة:

1. العقد يسمح برعاية الرسوم
2. الحساب الراعي موجود ولديه XOR
3. لكل مستخدم `CanUseFeeSponsor` لهذا الراعي

بعد ذلك، كل معاملة مستخدم برعاية تحتاج فقط إلى هذه البيانات المعدنية:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

هذه الصفحة تظهر نمطين شائعين:

- المستخدم الحر يكتب: الراعي يدفع XOR والمستخدم لا يدفع أي شيء.
- رسوم الرمز المحلي: يدفع المستخدم الراعي في رمز التطبيق، ويدفع الراعي الشبكة في XOR.

استخدم Taira أو شبكة اختبار خاصة أولاً. مساحة بيانات خاصة جديدة هي تغيير في المشغل والحوكمة؛ لا يتم إنشاؤها حسب تشكيل العميل.

## القيم المثالية {#example-values}

الأوامر أدناه تستخدم هذه المواقع:

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

استخدم حساب I105 الكنسي IDs إلا إذا كان لدى نشاطك أسماء مستعار لحساب نشط لنفس الحسابات.

## 1 إعداد مساحة البيانات {#_1-prepare-the-dataspace}

البدء من كتالوج مساحة البيانات الخاصة وعمليات التوجيه الموصوفة في [الربط إلى SORA Nexus مساحات البيانات](/ar/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). يبدو قطعة تتعامل مع المشغل على هذا الشكل:

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

- يظهر الممر الخاص في رد `/status` العقد
- يتم قبول حسابات المستخدمين من خلال تدفق الجهاز الخاص بك
- وجود حساب الراعي
- أصول الرسوم XOR وحساب غسل الرسوم صالحة على الشبكة.

## سجل الأصول في مساحة البيانات {#_2-register-assets-in-the-dataspace}

سجل تعريفات الأصول التي سيحتفظ بها المستخدمون داخل مساحة البيانات الخاصة قبل أن تقوم بتوصيلها إلى منطق التطبيق. بالنسبة لنمط رسوم العملات المحلية ، يستخدم الدليل `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

أولاً قم بتعيين النطاق وتأجير SNS التي تمتلك مساحة أسماء الأصول. قم بإنشاء نية خالية من السرية `AliasSetupPlanRequestV1` لـ `$BILLING_DOMAIN` ، بما في ذلك مساحة بيانات `team` العددية ID ، والمالك القنوني ، وشروط الإيجار ، وحارس الاقتباس الحالي:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

ثم سجل تعريف الأصول. القنوني `--id` هو تعريف الأصل على مستوى الشبكة ID. الاسم التلقائي هو ما يجب على المطورين والمستخدمين النهائيين استخدامه في رمز مساحة البيانات:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

النقود أو نقل الوهم المحلي إلى المستخدم أثناء الإدخال:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

تحقق من توازن المستخدم:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

استخدم نفس النمط لأصول التطبيقات في مساحة البيانات. سجل تعريف واحد للأصول لكل رمز، وقدم لجميعها اسم مستعار لمجال البيانات، واستشهد بالاسم المستعار من رمز SDK بدلاً من تعريف الأصول الصلبة القنوية IDs.

## 3- تسجيل أسماء مستخدمين {#_3-register-user-aliases}

الحسابات لا تزال قائمة I105 الحساب IDs. الأسماء التي تواجه المستخدمين هي أسماء مستعار للحسابات، وينبغي أن تكون الاسم المستعار مساومة غير حساسة مثل `alice@team` أو `alice@members.team`. لا تستخدم أرقام الهاتف أو عناوين البريد الإلكتروني باعتبارها أسماء مستعار. تلك تنتمي إلى تدفق المعرف الخاص في القسم التالي.

تعتمد إعدادات الألقاب على نفس المخطط الإعلاني مثل إعدادات النطاقات SDK أو إنشاء خدمة الإدخال الخفية من السر `AliasSetupPlanRequestV1` النية التي تستهدف الدخول في حساباتها `$USER`, يختار الدور الأساسي ، ويقود مساحة البيانات الرقمية ID, ثم تخطيط وتطبيقها كعاملة ذرية واحدة

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

إذا كان المستخدم لا ينبغي أن يدفع XOR ، استخدم خدمة الإدخال المعتمدة على علم الراعي لإنشاء وتقديم معاملة التثبيت. لا تقسيم استحواذ الإيجار والتعريفات القائمة في معاملات تطبيق مستقلة.

بعد أن يتم ربط الاسم الخاطئ، تحقق منه من CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

لإنشاء حساب جديد، تفضل خدمة تشغيل تقوم ببناء `NewAccount` مع مستقر `uaid` وإذا لزم الأمر، ابتدائي `label`. تُسجل الأوامر البسيطة `ledger account register --id` فقط الحساب القنوني ID.

## 4. تسجيل الهاتف والبريد الإلكتروني بشكل خاص مع FHE {#_4-register-phone-and-email-privately-with-fhe}

استخدم أرقام الهاتف وعناوين البريد الإلكتروني كادعاءات تحديد شخصية خاصة، وليس أسماء مستعار عامة. يحافظ التدفق المدعوم من FHE على المعرفات الخام خارج الأسماء المستعار للحسابات وبيانات المعاملات، وحالة العالم:

1. يقوم المشغل بتسجيل سياسة برنامج [RAM-LFE/FHE ](/ar/blockchain/ram-lfe.md) للهاتف والبريد الإلكتروني.
2. يقوم المشغل بتسجيل سياسات التعرف النشط مثل `phone#team` و `email#team`
3. المحفظة تطبيق الهاتف أو البريد الإلكتروني محلياً
4. يقوم المحفظة بإرسال القيمة المشفرة إلى المصلح
5. يعيد الحل `IdentifierResolutionReceipt`
6. يقوم المستخدم بإرسال `ClaimIdentifier` مع إيصال.
7. تخزين السلسلة تحديدًا غير مرئيًا والحسابات، وليس قيمة الهاتف الخام أو البريد الإلكتروني.

إن إعداد السياسة من جانب المشغل هو مهمة SDK أو خدمة. قم ببناء وتقديم أزواج التعليمات هذه لكل نوع معرف:

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

أكرر ذلك على البريد الإلكتروني مع:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

أثناء الإدخال، يجب أن يتعايش المحفظة أو الخلفية على المستوى المحلي:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

بعد أن يتم إنشاء ملف البيانات الأساسية الراعي في الخطوة 8 ، قم بإرسال تعليمات للمطالبة الموقعة من قبل المستخدم مع تلك البيانات:

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

لا تعرض CLI الحالية للأوامر المختارة لهذه التعليمات الهوية. قم بتوليد قيم `InstructionBox` المتسلسلة مع SDK وإرسالها من خلال `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

أبقوا هذه الحواجز في خدمة الإدخال

- أسماء مستعار للحسابات هي أدوات يمكن قراءتها من قبل الإنسان فقط
- قيم الهاتف الخام والبريد الإلكتروني لا تظهر أبدًا في أسماء مستعار أو البيانات الأساسية أو السجلات أو حمولات المعاملات
- يحصل الحساب على `uaid` قبل أن يطالب بالتحديدات الخاصة
- الإيصالات تلتزم `policy_id` ، `opaque_id`، `uaid`، `account_id`، وتنتهي.
- مفاتيح الحل والتزامات البرنامج الخفية يتم التحكم بها من قبل الحوكمة .

## 5- تمكين الرعاية على العقدة {#_5-enable-sponsorship-on-the-node}

الرعاية الرسومية هي سياسة العقد / وقت التشغيل. تمكينها في إعداد الرسوم Nexus:

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

`fee_asset_id` هو قيمة رسوم الشبكة. SORA Nexus هذا هو XOR. استخدم النشط XOR الاسم الأدنى أو القنوني XOR تعريف الأصول ID من خلال شبكتك.

`sponsor_max_fee = "0"` يعني أنه لا يوجد حد للراعي لكل معاملة. لإنتاج، قم بتحديد حد غير صفر بعد أن تعرف الحجم الطبيعي وملف الغاز لمعاملاتك في مجال البيانات.

إعادة تشغيل هذا التشغيل من خلال عملية المشغل العادية.

## 6 - إنشاء وتمويل الراعي {#_6-create-and-fund-the-sponsor}

إنتاج زوج مفتاح الراعي إذا لزم الأمر:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

تحويل المفتاح العام إلى تنسيق الحساب لشبكتك:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

سجل الحساب الراعي من خلال تدفقك الخاص:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

تمويل الراعي مع XOR من خزينة، حساب مطالبة، أو حساب آخر مدفوع بالمال:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

ل: Taira التدريبات، إنقاذ مساعدة المياه من [احصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) كما `taira_faucet_claim.py`, ثم تمويل الراعي مع النوافذ العامة بدلا من تحويل الخزانة:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

تحقق من رصيد الراعي في XOR:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7 - منح المستخدم إمكانية الوصول إلى الرعاية {#_7-grant-a-user-access-to-the-sponsor}

يجب على الراعي منح كل مستخدم إذن لفرض رسوم عليه. هذه المنحة هي ما يمنع المستخدمين من تسمية حسابات الرعي التعسفي.

قم بتشغيل هذا كحساب الراعي، أو كحساب تشغيلي يسمح به سياسة التشغيل الخاصة بك:

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

## 8 - إرفاق البيانات الأساسية من الراعي {#_8-attach-sponsor-metadata}

إنشاء ملف البيانات المعدلة لإعادة الاستخدام:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

أي رسالة تم تقديمها مع هذه البيانات المعدنية تتقاضى من الراعي:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

بالنسبة إلى SDKs، ضيف نفس موضوع البيانات المعدنية للمعاملة إلى المعاملة التي تم توقيعها. يقوم المستخدم بتوقيع المعاملة بمفتاح المستخدم. لا يوقع الراعي على كل معاملة مستخدم لأن المنحة السابقة `CanUseFeeSponsor` هي المصرح بها.

## النمط الأول: المستخدمين يدفعون بدون رسوم {#pattern-1-users-pay-no-fees}

استخدم هذا عند امتصاص التطبيق أو المشغل جميع رسوم الشبكة.

قائمة التحقق من المطور:

1. الحفاظ على حمولة المعاملات العادية للمستخدم دون تغيير.
2. إضافة بيانات المعاملة المعدنية مع `fee_sponsor`.
3. وقع على عنوان المستخدم
4. قم بإرسالها من خلال طريق مساحة البيانات الخاصة.

لا يحتاج حساب المستخدم إلى رصيد XOR. يجب أن يحتفظ الحساب الراعي بما فيه الكفاية من XOR لتغطية الرسوم التي يتم تشكيلها Nexus.

## النمط الثاني: المستخدمين يدفعون رمزا محلياً {#pattern-2-users-pay-a-local-token}

استخدم هذا عندما لا ينبغي للمستخدمين أن يحملوا XOR ، ولكن مساحة البيانات لا تزال تريد رسوم تطبيق داخلية أو نفقات الائتمان أو رموز حصة.

في هذا النمط، فإن الرمز المحلي هو دفع التطبيق. إنه ليس أصول رسوم الشبكة. لا يزال الراعي يدفع رسوم شبكة في XOR .

على سبيل المثال، استخدم رمز محلي في مساحة البيانات الخاصة:

```text
usage#billing.team
```

تمويل المستخدمين مع `usage#billing.team` أثناء التسجيل، وتجديد الاشتراك، أو تخصيص الحصص. ثم جعل معاملة المستخدم الذرية:

1. تحويل الرموز المحلية من المستخدم إلى الراعي
2. تنفيذ عملية التطبيق المطلوبة
3. يتضمن `fee_sponsor` البيانات الأساسية حتى يدفع الراعي XOR

اختبار الدخان الحد الأدنى CLI هو فقط نقل الرمز المحلي الذي يرعاه XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

بالنسبة للتطبيق الحقيقي، لا تقدم مدفوعة الرمز المحلي على أنها معاملة منفصلة من أفضل الجهود. قم ببناء معاملة واحدة موقعة تحتوي على كل من الدفع والتعليمات التجارية، أو كشف نقطة دخول العقد التي تجمع الرمز المحلى قبل تطبيق العملية التجارية.

ضع سياسة التحويل في تطبيقك أو العقد:

- أي عملية تكلف كم وحدات رمزية محلية
- كيفية تدفق الخرائط المحلية لتمويل إضافات XOR
- ما الذي يحدث عندما يكون توازن المستخدم منخفض جداً
- ماذا يحدث عندما يكون رصيد الراعي XOR منخفضًا للغاية

::: warning

لا تستخدم `gas_asset_id` لنمط "رسوم الرمز المحلي" ما لم ترغب في أن يتم فرض رسوم على الراعي أيضًا في هذا الأصول الغازية. في الوقت الحالي، يجعل `fee_sponsor` الراعي أيضا المدفوع للديبيتات الموضحة للأصول النابطة-غاز. مقابل الرسوم المستخدمة للبرمجة المحلية، قم بجمع البرمجة صراحة مع قاعدة نقل أو عقد.

:::

## إصلاح المعاملات الممولة الفاشلة {#debug-failed-sponsored-transactions}

أسباب الرفض الشائعة تشير عادة إلى خطوة واحدة في الإعداد المفقودة:

|نص الخطأ |ما الذي يجب التحقق منه|
| --- | --- |
|`fee sponsorship is disabled` |`nexus.fees.sponsorship_enabled` ما زال `false` على العقدة. |
|`fee sponsor is not authorized` |لا يملك المستخدم `CanUseFeeSponsor` لهذا الراعي. |
|`fee asset ... is missing` |لا يحمل الراعي أصول الرسوم المحددة XOR. |
|`fee balance ... is insufficient` | إضافة الرعاية XOR التوازن. |
|`fee exceeds sponsor_max_fee` |زيادة `sponsor_max_fee` أو تقليل حجم المعاملة / الغاز. |
|`invalid nexus fee asset id` |الإصلاح `nexus.fees.fee_asset_id` أو مستعار الأصول XOR. |

عند إصلاح النمط 2 ، تحقق من كلا التوازنين:

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

تعامل الراعي كحساب الخزانة:

- الحفاظ على مفاتيح الراعي المنفصلة للشبكة الاختبارية، والتنظيم، والشبكة الرئيسية
- تحذير قبل أن يصل رصيد الراعي XOR إلى مستوى القبول
- تحديد حد غير صفر `sponsor_max_fee` بمجرد تخصيص حركة المرور.
- الرسوم المدعومة في طلبك أو البوابة
- إلغاء `CanUseFeeSponsor` عند مغادرة المستخدمين مساحة البيانات
- إصلاح هاشات المعاملات المستخدمة ودفع الرموز المحلية وديبيتات الراعي XOR

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

## الصفحات المتعلقة {#related-pages}

- [التواصل مع SORA Nexus مساحات البيانات](/ar/get-started/sora-nexus-dataspaces.md)
- [تشغيل Iroha 3 عبر CLI ](/ar/get-started/operate-iroha-via-cli.md)
- [الأصول](/ar/blockchain/assets.md)
- [الإذن](/ar/blockchain/permissions.md)
- [رموز الإذن ](/ar/reference/permissions.md)
