---
translation_locale: ar
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# بناء على SORA 3: Taira و Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 هو مسار التنفيذ العام الموجه نحو التطبيقات Iroha 3 و SORA
Nexus. بناء وتدريب على Taira أولاً، ثم تحريك نفس شكل العميل
إلى Minamoto فقط عندما يكون لديك مفاتيح منفصلة، حقيقية XOR الرسوم،
و موافقة الإنتاج

هذه الدروسة تظهر كيفية تشكيل Iroha العميل للجمهور SORA 3
الشبكات:

- Taira شبكة اختبار في `https://taira.sora.org`
- Minamoto ويتم `https://minamoto.sora.org`

الاستخدام Taira للاختبارات التكاملية، والفواكه الممولة من النوافذ، و
التدريبات على الانتشار Minamoto فقط للشبكة الرئيسية جاهزة الإنتاج
النشاط. كلتا الشبكات تتقاضى رسوم في XOR:

- Taira تستخدم شبكة اختبار XOR من النوافذ العامة
- Minamoto تستخدم حقيقية XOR. لا يوجد Minamoto المياه

## طريق البناء {#builder-path}

| خطوة                        | Taira شبكة اختبار                                                | Minamoto الـ (ماينيت)                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| ابدأ قراءة حالة الشبكة | السؤال `/status` بدون مفاتيح                                 | السؤال `/status` بدون مفاتيح                       |
| اختر مساحة بيانات            | الاستخدام العام `universal` إلا إذا كان تطبيقك يحتاج إلى مسار محكم | استخدم نفس مساحة البيانات فقط بعد موافقة الشبكة الرئيسية |
| احصل على أصول الرسوم               | استخدم الجمهور Taira الصنبور                                  | استلام XOR من مؤسسة تمويل Minamoto تدفقات الحساب أو الخزانة المعتمدة |
| الاختبار يكتب                 | استخدام اختبار تمويله من النوافذ XOR                                   | لا تستخدم أدوات الاختبار؛ الكتب تنفق حقيقية XOR     |
| الترويج                     | حاولي مجدداً التفكير والرصد والتعامل مع الموقعين            | استخدم مفاتيح منفصلة، وتمويل، والتحكم في الإفراج   |

التدفق العملي هو:

1. بناء العميل ضد Taira واستخدام الجمهور `universal` مساحة البيانات
2. أضف توقيعا و تمويله مع Taira المياه
3. ممارسة منطق التطبيق الخاص بك ضد Taira حتى تكون الفشل مملة
   قابل للملاحظة
4. إنشاء منفصل Minamoto الموقّع، تمويلها بـ "الواقع" XOR, وتحرك فقط
   نفس العمليات المثبتة للصناعة

## ١- تفهم ما تحدده {#_1-understand-what-you-are-setting-up}

في SORA Nexus, مساحة البيانات هي جزء من خط الشبكة وتسجيل التوجيه.
العميل لا يخلق مساحة بيانات عامة جديدة فقط عن طريق تغيير
`client.toml`. إعداد العميل يفعل شيءين:

1. يشير العميل إلى اليمين Torii نقطة النهاية
2. يختار سياق توجيه النطاق ومساحة البيانات لحسابه القنوني

`AccountId` هو دائما القنوني وبدون مجال `[account].domain` القيمة في
`client.toml` توفر الاتجاه والإشارة الجهالة السياق؛ فإنه لا يصبح جزء من
هوية الحساب. بالنسبة لمعظم التطبيقات، تبدأ مع الجمهور
`universal` مساحة البيانات. تستخدم سياق النطاق `domain.dataspace` النموذج،
مثال:

```text
wonderland.universal
```

إذا كنت بحاجة إلى مساحة بيانات تنظيمية جديدة، إعداد كتالوج وتوجيه
مقترح بدلاً من محاولة تسجيله من حساب عميل عادي
انظروا [توفير مساحة بيانات جديدة](#_8-provision-a-new-dataspace) أدناه

## 2- تحقق من الجمهور Torii النقطة النهائية {#_2-check-the-public-torii-endpoint}

تحقق من أن نقطة النهاية المستهدفة تعمل قبل تشكيل توقيع.

ل: Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

ل: Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

فحص مساحة البيانات ومشاهدة المسار التي كشفها العقد:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

استخدم نفس الأوامر `https://minamoto.sora.org/status` لـ (ماينيت)

## Taira MCP للوكلاء {#taira-mcp-for-agents}

Taira كما يعرض Torii البروتوكول السياقي النموذجي (MCP(جسر)
تستخدمها عندما يحتاج وكيل إلى قراءة الاختبار المباشر
التشخيص، أو مراجعة دقيقة من دراسات الكتابة دون بناء عادة
Torii العميل أولاً

| الإعداد | القيمة |
| --- | --- |
| MCP نقطة النهاية | `https://taira.sora.org/v1/mcp` |
| جذور الشبكة | `https://taira.sora.org` |
| الاستخدام المقصود | Taira قراءة شبكة الاختبار وتجربات الكتابة التي تمولها الصنبور |
| ما يعادل الإنتاج | لا تشير هذه الإدخال إلى Minamoto ما لم تكن شبكة رئيسية MCP يتم الموافقة صراحة على مراقبة النقطة النهائية والإفراج |

تحقق من بيانات الجسر قبل إضافة مواد التوقيع:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

تشكيل URL كمستخدم محلي MCP الخادم في وقت تشغيل الوكيل.
وكيل الالتزام MCP التجميع، API الرموز، ورؤوس المؤلفين المرسلة، `authority`, أو
`private_key` القيم في هذه الوثائق repo أو التطبيق repo.

الوكيل يطلب القواعد التي تعمل بشكل جيد مع Taira:

- اكتشاف الأدوات من MCP الخادم قبل الاتصال بهم؛ إعادة اكتشاف
  تقارير الخادم `listChanged`.
- تفضل المنتجات `iroha.*` الأدوات أكثر من الخام `torii.*` الأدوات
- بدء القراءة فقط: التفتيش الحالة، الحسابات، الأصول، الأسماء الخفيفة، الكتل
  حالة الحوكمة، وحالة المعاملة قبل اقتراح الكتابات.
- تتطلب تعليمات بشرية صريحة قبل طفرات شبكة الاختبار الحية
  ملفات المعاملة الموقعة مسبقا، استخدامها `iroha.transactions.submit_and_wait`
  لذا الوكيل ينتظر النتيجة بدلاً من التقدم فقط
- تلخيص الهاشات المعاملة والحالة النهائية وأخطاء التحقق من الخادم في
  رد العميل

### تدفق عمل التطوير مع الوكلاء {#development-workflow-with-agents}

استخدام الوكلاء كمساعدين في التنمية Iroha العملاء، مُبني المعاملات
النصوص التشخيصية، وكتب تشغيل شبكات الاختبار.
يمكنها فحص الرمز، القراءة Taira الدولة، واقترح تغييرات وإجراء اختبارات محلية
لكن لا يجب أن يتغير شبكة حية حتى يوافق الإنسان على
العملية

سير العمل العملي هو:

1. اطلب من العميل أن يفتش الأدوية ذات الصلة SDK الرمز، CLI القيادة أو MCP
   مخطط أداة قبل أن يكتب الرمز.
2. اجعل الوكيل يكتب أصغر مسار العميل أولاً: التحقق من الحالة، الحساب
   البحث، عرف القرار أو البحث عن التوازن.
3. إضافة رمز بناء المعاملات فقط بعد أن تعمل مكالمات القراءة فقط ضد
   Taira.
4. الحفاظ على اختبارات الشبكة المباشرة الاختيار، على سبيل المثال في الخلف `TAIRA_LIVE=1`, إذاً
   لا تنفق أجهزة الاختبار العادية أبداً أموال شبكة الاختبار أو تعتمد على الشبكة
   التوافر
5. تطلب من الوكيل الإبلاغ عن جذور الشبكة، سلسلة، حساب السلطة
   ملخص الإرشادات، وأصول الرسوم، والتغيير المتوقع في الحالة قبل تقديمها
   أي معاملة
6. مراجعة الكود الذي تم إنشاؤه للتعامل السري، والسلوك التجربة مرة أخرى، والفشل،
   التعامل مع الرفض قبل تعزيزه CI أو عمليات العمل المتواصلة.

مفيد للقراءة فقط MCP أدوات التطوير تشمل البحث عن الأصول الحسابية،
التعرف على حل المعاملات، البحث عن الكتل، بحث المعاملات ، قوائم المعاملات
التحقق من حالة خط الأنابيب. استخدم هذه لتكوين الثقة قبل تقديم أي
-حمولة مفيدة .

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### التدفقات العملية من خلال الوكلاء {#transaction-workflow-through-agents}

(الـ) MCP الجسر يمكن أن يقدم توقيع Iroha المعاملة، ولكنها لا تزيل
متطلبات المعاملة العادية.
السلطة، الإذن، تمويل الرسوم، سلسلة ID, البيانات المعدنية والوقيع

للمواد الخام Iroha المعاملات، وتكوين وتوقيع غلاف المعاملة مع
SDK أو CLI أولاً، ثم أعط الوكيل فقط المعاملة القنوني الموقعة
البايتات المشفورة ك `body_base64`. يمكن للعميل تقديم الملف مع
`iroha.transactions.submit_and_wait`, أو تقديم مع
`iroha.transactions.submit` و استطلاع مع `iroha.transactions.wait`.

لا تضع المفاتيح الخاصة في طلب الوكيل. إذا كان الوكيل بحاجة لبناء
المعاملة، توجيهها إلى الرمز المحلي الذي يحمل أسرار من وقت تشغيل المستخدم
البيئة، السلسلة المفتاحية، مؤشر الأجهزة، أو تجاهل ملف تشكيل شبكة الاختبار.
يجب أن لا يكتب الوكيل المواد الرئيسية في "ماركداون" أو الإصلاحات أو السجلات، أو
يلتزم.

قبل تقديم المعاملة، اجعل الوكيل يقوم بعمل قصير
خطة:

- `network`: Taira جذور وشبكة شبكات الاختبار ID
- `authority`: الحساب الذي يدفع الرسوم
- `instructions`: التسجيل، النقود، الحرق، النقل، البيانات المعدنية، الإذن، أو
  ملخص دعوة العقد
- `fee asset`: الأصول التي سيتم تحصيلها Taira
- `preflight reads`: الحساب، رصيد الأصول، الإذنات، الاسم الخارجي، أو الكتلة
  التحققات التي تمت بالفعل
- `expected result`: الحالة التي يجب أن تكون مرئية بعد التأكيد
- `idempotency`: ماذا سيحدث إذا تم إعادة محاولة نفس الطلب

بعد الإرسال، اجعل الوكيل ينتظر حالة نهاية، ثم التحقق
تغيير الحالة مع استفسار القراءة. يتضمن تقرير الانتهاء المفيد:

- هاشة المعاملات
- الوضع النهائي مثل `Committed`, `Applied`, `Rejected`, أو `Expired`
- تفاصيل الكتلة أو المستكشف عندما تكون متاحة
- نتائج قراءة التحقق
- رسالة الرفض وما إذا كان الفشل يبدو مثل الإذن، الرسوم،
  التحقق من المصادقة، أو الحالة القديمة، أو توافر نقطة النهاية

نموذج حراسة على الفور:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

عندما يتم إعداد المغلف الموقّع بالفعل:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

العلاج Taira MCP كمنطقة تحكمية عامة للشبكة الاختبارية. Taira المفاتيح، شبكة اختبار XOR,
حسابات الصنبور والوقيع القناري يمكن استخدامها و يجب أن تبقى منفصلة عن
Minamoto المفاتيح وتدفقات عمل الإفراج عن الإنتاج.

## أمثلة لعبة يمكنك تجربتها الآن {#toy-examples-you-can-try-now}

هذه الأمثلة هي القراءة فقط ما لم يذكر.
المفاتيح و هي آمنة للعمل ضد كل من الشبكات العامة.

مقارنة Taira شبكة اختبار و Minamoto الصحة الرئيسية:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

إدراج خطوط مساحة البيانات العامة المعروضة من Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

أداء نفس القيادة ضد Minamoto عندما تحتاج إلى عرض الشبكة الرئيسية:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

بناء صغير Node.js مسح حالة لوحة التحكم أو الروبوت أو النشر
التحقق:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
EOF
```

أول لعبة مكتبة يجب أن تكون Taira مصطلح النوافذ، يستخدم شبكة اختبار
XOR و لا ينبغي أبدا أن يُشير إلى Minamoto.

## 3. إعداد Taira إعداد العميل {#_3-create-a-taira-client-config}

إنشاء زوج مفاتيح إذا لم يكن لديك بالفعل:

```bash
kagami keys --algorithm ed25519 --json
```

الإبداع `taira.client.toml`:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

المستوى الأعلى `chain` هو بالضبط Taira سلسلة المعاملات ID. (الـ)
`[account].profile = "taira"` الإعداد يختار بشكل مستقل Taira I105
التمييز السلسلة. ID لا يختار ملف حساب.

اجري فحص للقراءة فقط:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

إدارة الجمهور Taira التشخيص قبل اختبارات الكتابة:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

تمويل Taira الحساب من خلال النوافذ قبل أن تشغيل رسائل دفع الرسوم.
التدفق المباشر للصنبور هو في
[احصل على Testnet XOR على Taira](#_4-get-testnet-xor-on-taira).

بعد أن يتم قبول طلب الصنبور وتمويل الحساب، Taira
القناري اختبار دخان كتابة اختياري:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

يقوم القناري بإرسال رسالة مؤكدة، ينتظر التأكيد، ويكتب
تشكيل مؤشر التشغيل عندما `--write-config` يتم توفيرها. Taira هو عام
شبكة اختبار، حتى تثبيت الصف يمكن أن تجعل النقش الموقع يفشل حتى عندما
المياه نفسها تعمل `taira doctor` يبلغ عن صف مشبع أو
عائدات القناريات `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, انتظروا وتجربوا مرة أخرى قبل
معالجته كخطأ في تكوين العميل.

لاختبارات الدخان غير المراقبة، لف القناري في حلقة محيطة لإعادة تجربته:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

توقف عن المحاولة مرة أخرى إذا `iroha taira doctor` يظهر الفشل القوي.
والرفض من قبول الرسوم هي شروط عابرة للشبكة الاختبارية العامة. DNS,
TLS, أو `status = "fail"` التشخيص ليس كذلك

## توليد a SORA Nexus الحساب ID {#generate-a-sora-nexus-account-id}

(أ) SORA Nexus الحساب ID هو القوانين I105 العنوان المستمد من
مفتاح الحساب العام والشبكة المستهدفة.
`[account].domain` القيمة في العميل TOML. نفس الرموز المفتاح العامة
مختلفة IDs على Taira و Minamoto, ويجب على مستخدمي الإنتاج توليد
زوج مفاتيح منفصل Minamoto.

قم بتوليد أو تحميل زوج المفاتيح Ed25519 الذي سيتحكم في الحساب:

```bash
kagami keys --algorithm ed25519 --json
```

تحويل المفتاح العام إلى Taira الحساب ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

تحويل a Minamoto المفتاح العام مع إشارة "مينيت":

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

استخدم الحساب الناتج ID في أي مكان Nexus API أو CLI القيادة تسأل عن
الحساب القنوني ID, مثلاً: Taira الصنبور `account_id`, التوازن
استفسارات، حقل الحسابات الصارمة، أو التزامات الاسم.
المفتاح الخاص في إعداد العميل الخاص بك، واختيار نفس الشبكة العامة مع
`[account].profile = "taira"` أو `[account].profile = "minamoto"`.

إنتاج ID لا يخلق في حد ذاته حساب مدفوع على السلسلة.
Taira, يمكن أن يخلق المياه ويمول حساب كتابات testnet.
Minamoto, استخدم تدفق الوصول إلى الشبكة الرئيسية المعتمدة أو تدفق الخزانة.

### تخزين المفاتيح والنسخ الاحتياطي {#key-storage-and-backup}

الحساب ID ويمكن مشاركة المفتاح العام
كلمة المرور، البذور، والمواد الاسترداد يجب أن تعاملها سرية.

استخدم هذه الممارسات SORA Nexus الحسابات:

- تخزين المفاتيح الخاصة في مدير كلمة مرور مشفرة، مدعومة بالجهاز
  متجر المفاتيح، أو خدمة التوقيع المخصصة. لا تعتمد المفاتيح على المصدر
  التحكم أو ترك مفاتيح الإنتاج في تاريخ القبو، السجلات، الدردشة، التذاكر،
  أو نسخ احتياطية غير مشفرة.
- استخدم كلمات مرور عالية الاندروبي الفريدة لكل قبو أو توقيع إنتاج.
  تخزين كلمات المرور في مدير كلمة المرور أو عملية الاحتفاظ بالتقسيم، وليس في
  نفس الملف أو حزمة النسخ الاحتياطية التي تم تشفير مفتاح خاص.
- أبقيه Taira و Minamoto المفاتيح منفصلة Taira المفاتيح القابلة للتخلص منها
  مادة شبكة الاختبار و Minamoto المفاتيح كسلطة صناديق الإنتاج
- احتفظ بالمفتاح الخاص والمفتاح العام الحساب ID, ملف حساب، وأي
  ملاحظات استرداد الحساب أو احتفاظها اللازمة لاستعادة الموقّع
  المفتاح بدون سياق الشبكة سهل سوء الاستخدام أثناء التعافي.
- الحفاظ على ما لا يقل عن واحد تشفير النسخة الاحتياطية خارج الاتصال و واحدة جغرافيا
  الاحتفاظ بالخلفية المشفرة للوقيعات الإنتاج.
  عمليات صغيرة القراءة فقط قبل ذلك اعتمادا على الدعم.
- تدوير أو استبدال مؤشر إذا كان المفتاح الخاص، كلمة المرور، وسائل النسخ الاحتياطية،
  أو قد يكون المضيف الموقّع معرضًا.

لمزيد من التفاصيل، انظر
[تخزين مفاتيح التشفير](/ar/guide/security/storing-cryptographic-keys.md)
و [أمن كلمة المرور](/ar/guide/security/password-security.md).

## 4. احصل على " تيسنت " XOR على Taira {#_4-get-testnet-xor-on-taira}

استخدم الصنبور العام مباشرة، التدفق هو:

1. توليد أو تحميل توقيع وتحساب القنوني Taira الحساب ID.
2. أحضر لغز المياه الحالي
3. حل اللغز إذا `difficulty_bits` هو أكبر من `0`.
4. أرسلي طلب النوافذ
5. انتظر حتى يصبح حسابك أو رصيد الأصول مرئيًا قبل الإرسال
   الرسوم المدفوعة.

تحويل مفتاح عام إلى Taira I105 الحساب ID المتوقعة من النوافذ:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

أحضر اللغز:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

النفايات هي خدمة شبكة اختبار عامة. إذا كانت اللغز أو المطالبة نقطة نهاية
العائدات `502`, وقت وقف، أو خطأ آخر على مستوى البوابة، الانتظار والحاول مرة أخرى
قبل تغيير مفاتيحك أو إعداد العميل

الرد لديه هذا الشكل:

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

عندما `difficulty_bits` هو `0`, تقديم الحساب فقط ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

عندما `difficulty_bits` هو أكبر من `0`, حل اللغز ويشمل
ارتفاع المرسومة زائد النس:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

خوارزمية اللغز هي:

1. بناء التحدي كما SHA-256 فوق:
   - البايتات `iroha:accounts:faucet:pow:v2`
   - الموقع UTF-8 الحساب ID
   - `anchor_height` كـ " الكبرى " `u64`
   - `anchor_block_hash_hex` تم تشفيرها بأعداد البايت
   - `challenge_salt_hex` يتم تشفيرها بايت ، عند وجودها
2. حاولي `u64` غير مُشفّر كقيم 8 بايتات كبيرة.
3. للكل من أشكال التسجيل، قم بتشغيل الكمبيوتر المكتوب مع:
   - كلمة المرور: 8-byte nonce
   - الملح: تحدي 32 بايت
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - طول الخروج: 32 بايت
4. الفائزة هي أول هضم مع `difficulty_bits`
   مما يؤدي إلى الصفر.

يتضمن استجابة النوافذ الأصول الممولة والمعاملات المتسلسلة:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "asset_id": "...",
  "amount": "25000",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

الرد في الوقت الحالي يعود مع HTTP `202 Accepted`. الأصول
التعريف ID أعلاه هو Taira أصول الرسوم التي تمولها المصنع العام.
لقد قبلت المياه الطلب عند عودته `tx_hash_hex` و
`status: "QUEUED"`.

ثم استطلاع الأصول الممولة قبل تقديم رسومك الخاصة
المعاملات:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

إذا تم قبول مطالبة الصنبور ولكن الحساب أو الأصول غير مرئية
ومع ذلك، فإن المعاملة لا تزال وراء معالجة الطوابير العامة
و حاول القراءة مرة أخرى قبل إرسال الرسائل.

لجهاز مباشر جاهز للتشغيل API تحقق، حفظ هذا ك `taira_faucet_claim.py`
و تمرير Taira I105 الحساب ID:

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

with urllib.request.urlopen(f"{root}/v1/accounts/faucet/puzzle") as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

المياه ليست سوى ل Taira أموال شبكة الاختبار لا تستخدم XOR, المياه
الحسابات، أو Taira التوقيعات القناري Minamoto تدفق.

## 5. إنشاء Minamoto إعداد العميل {#_5-create-a-minamoto-client-config}

استخدم زوج مفتاح منفصل Minamoto. لا تستخدم مرة أخرى Taira مفاتيح الشبكة الرئيسية

الإبداع `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

المستوى الأعلى `chain` هو التيار Nexus سلسلة الشبكة الرئيسية ID.
`[account].profile = "minamoto"` يختار Minamoto I105 السلسلة
التمييز؛ اسم المضيف وسلسلة النقطة النهائية ID لا تختارها بشكل ضمني

تحويل a Minamoto المفتاح العام في كتابه القنوني I105 الحساب ID مع
المقبلات الرئيسية:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

إجراء عمليات التحقق من جانب القراءة فقط حتى يتم توزيع الحساب وتمويله
من خلال تدفق إدخال الشبكة الرئيسية أو الحوكمة:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

لا تشغيل Taira المياه أو المساعدين في كتابة القناري ضد Minamoto.

## 6 - تمويل Minamoto الحساب مع XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto يتم دفع الرسوم مع الإنتاج XOR, و Minamoto لا يوجد مجتمع
المياه: تمويل الحساب الذي يتم تشكيله من خلال إدخال شبكة أساسية معتمدة
أو تحويل الخزانة، أو تلقي XOR من مدفوعات موجودة Minamoto
الحساب

التحقق من الحساب القنوني ID و التمويل بالتحققات القراءة فقط قبل
إرسال رسالة Minamoto XOR كموارد الإنتاج: التدريب على
نفس العملية Taira أولاً، حافظ على مفاتيح الإنتاج منفصلة، ولا
افترض أن معاملة الشبكة الرئيسية يمكن إعادة تعديلها.

Taira XOR لا يستطيع الدفع Minamoto الرسوم. توازنات شبكة الاختبار والطلبات على المياه
لا يتم نقلها إلى Minamoto.

## 7 - العمل داخل مساحة بيانات موجودة {#_7-work-inside-an-existing-dataspace}

استخدم أسماء النطاق المؤهلة بالكامل لأجسام الكتيبة التي تعيش داخل
مساحة البيانات. على سبيل المثال، يجب أن يكون نطاق المشروع في مساحة بيانات عامة
استخدام:

```text
apps.universal
```

بعد أن يحصل حسابك على الإذنات المطلوبة، قم بإنشاء
`AliasSetupPlanRequestV1` نية النطاق واستخدام المخطط الإعلاني:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

ل: Minamoto, إنشاء وموافقة على نية وخطط منفصلة للشبكة الرئيسية.
ويتم ربطها بالسلاسل والسلطة ورابط الحي الدولة، والموعد النهائي
Taira لا يمكن تعزيز الخطة أو إعادة تشغيلها:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

أسماء مستعار الحسابات تستخدم نفس الإثر لمجال البيانات:

```text
alice@apps.universal
alice@universal
```

الحسابات الصارمة لا تزال تستخدم القوانين I105 الحساب IDs. العلاج الأسماء الخفيفة
كالتزامات يمكن قراءتها من قبل الإنسان والتي تنتهي إلى حساب القنوني IDs.

## 8. توفير مساحة بيانات جديدة {#_8-provision-a-new-dataspace}

مساحة بيانات جديدة هي عامل وتغيير الحكم Torii
نقطة النهاية يمكن توجيه حركة المرور إلى مساحات البيانات التي تم تشكيلها ، ولكنها سترفض
مستعار مساحة البيانات غير معروفة

قبل إعداد تغيير، التقاط الكتالوج الحالي على قيد الحياة:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

بالنسبة لحساب المشغل، تحقق أيضًا من موقف دليل المسار:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

لا تعزيز اسم مستعار جديد إلا إذا كان الشارع ID, مساحة البيانات ID, مجموعة مؤكدة
التسامح مع الأخطاء، والإشارة، قواعد الاتجاه، والملك التشغيلي
المستخدم العادي مع الإذنات المطلوبة يمكن
الحصول على نطاق و SNS الإيجار داخل مساحة بيانات موجودة من خلال
الاسم المخطط؛ فإنه لا يمكن أن يضيف بأمان مساحة بيانات عامة جديدة.

بالنسبة لمجال البيانات الخاص أو التنظيمي، قم بإعداد تغيير في الكتالوج مع:

- مستعار لمجال البيانات الفريد والرقمي `id`
- إدخال مسار متطابق أو تفويض مسار موجود
- مساحة البيانات `fault_tolerance`
- قواعد توجيه التعليمات أو نطاق الحسابات التي يجب أن تنزل
  هناك
- مذكرة دليل الفضاء أو أدلة مساوية على التنفيذ، عندما
  تعرض مساحة البيانات UAID القدرات
- الموافقة على الحوكمة للتحقق من المصادقة والامتثال والتسوية والمراقبة
  السياسة

جزء من إعداد يمكن مراجعته يبدو هكذا:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

يجب أن تشمل قبول المشغل هذه البوابات:

- `irohad --sora --config <config.toml> --trace-config` يمر على
  تكوين العقدة المحلولة
- يتم أرشيف المخطط الذي تم إنشاؤه أو مراجعته باستخدام الهاشات والتوقيعات
- اختبارات الدخان تمر Taira قبل أي Minamoto الترويج
- بعد التغيير `/status` الكتالوج يظهر المسار المقصود ومساحة البيانات
- `iroha app nexus lane-report --summary` لا يبلغ عن فقدان مطلوب
  المخططات

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

تعزيز نفس مساحة البيانات إلى Minamoto فقط بعد Taira النشر،
اختبارات التدخين ومراقبة وأدلة الحوكمة كاملة

## الصفحات ذات الصلة {#related-pages}

- [التثبيت Iroha 3](/ar/get-started/install-iroha.md)
- [التشغيل Iroha 3 عبر CLI](/ar/get-started/operate-iroha-via-cli.md)
- [رسوم الرعاية لمجال البيانات الخاص](/ar/get-started/private-dataspace-fee-sponsor.md)
- [Torii النقاط النهائية](/ar/reference/torii-endpoints.md)
- [الإشارة إلى سفر التكوين](/ar/reference/genesis.md)
