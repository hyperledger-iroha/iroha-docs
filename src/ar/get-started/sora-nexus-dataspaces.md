---
translation_locale: ar
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# بناء على SORA 3: Taira و Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 هو مسار التنفيذ العام المواجهة للتطبيق الذي تم بناؤه على Iroha 3 و SORA Nexus. البناء والتدريب على Taira أولاً ، ثم نقل نفس شكل العميل إلى Minamoto فقط عندما يكون لديك مفاتيح رئيسية منفصلة ، حقيقية XOR مقابل الرسوم، وموافقة الإنتاج.

يظهر هذا التعليم كيفية تكوين عميل Iroha للشبكات العامة SORA 3:

- Taira شبكة اختبار في `https://taira.sora.org`
- Minamoto التواصل الرئيسي في `https://minamoto.sora.org`

استخدم Taira لإجراء اختبارات التكامل، وكناير الكتابة الممولة من النوافذ، وتدريبات الانتشار. استخدم Minamoto فقط لنشاط شبكة أساسية جاهزة للإنتاج. تتقاضى الشبكات الثانية رسوم في XOR:

- تستخدم Taira شبكة اختبارية XOR من النوافذ العامة.
- Minamoto تستخدم حقيقية XOR. لا توجد أنبوب Minamoto.

## طريق البناء {#builder-path}

|خطوة |Taira شبكة اختبار |Minamoto الرئيسية |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|أبدأ قراءة حالة الشبكة |استفسار `/status` بدون مفاتيح |استفسار `/status` بدون مفاتيح |
|اختر مساحة بيانات |استخدم العام `universal` إلا إذا كان تطبيقك يحتاج إلى ممارسة تحكم |استخدم نفس مساحة البيانات فقط بعد موافقة الشبكة الرئيسية |
|احصل على أصول الرسوم|استخدم الصنبور العام Taira |استلام XOR من حساب تمويل Minamoto أو تدفق الخزانة المعتمد |
|الاختبار يكتب |استخدام الاختبار الممول من النوافذ XOR |لا تستخدم أدوات الاختبار؛ الكتابة تنفق الحقيقي XOR |
|الترويج |حافظ على تجربة منطقية، ومراقبة، وتعامل الموقعين |استخدام مفاتيح منفصلة، وتمويل، والتحكم في الإفراج |

التدفق العملي هو:

1. بناء العميل ضد Taira واستخدام مساحة بيانات العامة `universal`.
2. إضافة توقيع وتوفيرها مع Taira الصنبور.
3. تمارس منطق التطبيق الخاص بك ضد Taira حتى تكون الفشل مملة وملاحظة.
4. إنشاء مؤشر منفصل Minamoto ، وتمويله بـ XOR الحقيقي ، ونقل فقط نفس العمليات المثبتة إلى mainnet.

## ١ - تفهم ما تحدده {#_1-understand-what-you-are-setting-up}

في SORA Nexus ، يعد مساحة بيانات جزءًا من طرق الشبكة وكتالوج التوجيه. لا يقوم العميل بإنشاء مساحة جديدة لمعلومات عامة فقط عن طريق تغيير `client.toml`. تقوم إعداد العميل بشيءين:

1. يشير العميل إلى النقطة النهائية اليمنى Torii
2. يختار سياق توجيه النطاق ومساحة البيانات لحسابه القنوني

`AccountId` هو دائمًا تقليدي وبدون نطاق. يوفر قيمة `[account].domain` في `client.toml` سياق التوجيه والاستعار ؛ لا تصبح جزءًا من هوية الحساب. بالنسبة لمعظم التطبيقات ، تبدأ مع مساحة بيانات عامة `universal`. يستخدم سياق النطاق نموذج `domain.dataspace`. على سبيل المثال:

```text
wonderland.universal
```

إذا كنت بحاجة إلى مساحة بيانات مؤسسية جديدة، قم بإعداد كتالوج واقتراح توجيه بدلاً من محاولة تسجيلها من حساب عميل عادي. انظر [ توفير مساحة معلومات جديدة ](#_8-provision-a-new-dataspace) أدناه .

## التحقق من النقطة النهائية العامة Torii {#_2-check-the-public-torii-endpoint}

التحقق من أن نقطة النهاية المستهدفة تعمل قبل تشكيل توقيع.

لـ Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

لـ Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

تفتيش مساحة البيانات ومشاهدة المسار التي كشفها العقد:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

استخدم نفس الأوامر مع `https://minamoto.sora.org/status` للشبكة الرئيسية.

## Taira MCP للوكلاء {#taira-mcp-for-agents}

Taira يعرض أيضًا بروتوكول سياق النموذج الأصلي Torii (MCP) للوقتات التشغيل للعملاء. استخدمه عندما يحتاج العميل إلى قراءة شبكة اختبارية حية أو تشخيص مكتوب ، أو تدريبات الكتابة المراجعة عن كثب دون بناء عميل مخصص Torii أولاً.

|الإعداد|القيمة |
| --- | --- |
|MCP نقطة نهاية |`https://taira.sora.org/v1/mcp` |
|جذور الشبكة |`https://taira.sora.org` |
|الاستخدام المقصود |Taira قراءة الشبكة الاختبارية وتدريبات الكتابة التي تمولها الصنبور |
|ما يعادل الإنتاج |لا تشير هذه الوثيقة إلى Minamoto إلا إذا تمت الموافقة صراحة على نقطة نهاية شبكة الأساسية MCP ومراقبة الإفراج |

تحقق من بيانات الجسر قبل إضافة مواد التوقيع:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

تشكيل URL كمستخدم محلي MCP الخادم في وقت تشغيل الوكيل. لا تعيين الوكيل MCP التجميع، API الرموز، والرؤوس المقدمة للمؤلفين `authority`, أو `private_key` القيم في هذا البيانات repo أو التطبيق repo.

القواعد المتعلقة بالوكيل التي تعمل بشكل جيد مع Taira:

- اكتشاف الأدوات من خادم MCP قبل الاتصال بهم؛ إعادة اكتشاف إذا كان الخادم يشير إلى `listChanged`.
- تفضل أدوات `iroha.` المنتظمة على الأدوات الخام `torii.`.
- البدء في القراءة فقط: تحقق من حالة الحسابات والأصول وألقاب الأسماء والكتل وحالة الحكم وحالة المعاملات قبل اقتراح الكتابة.
- تطلب تعليمات بشرية صريحة قبل طفرات شبكة الاختبار الحية. في غلافات المعاملة الموقعة مسبقاً، استخدم `iroha.transactions.submit_and_wait` حتى ينتظر الوكيل النتيجة بدلاً من تقديمها فقط.
- قم بإخلاصة الهاشات المعاملة والحالة النهائية وأخطاء تأكيد الخادم في رد الوكيل.

### تدفق عمل التطوير مع الوكلاء {#development-workflow-with-agents}

استخدم الوكلاء كمساعدين في تطوير عملاء Iroha ومبني المعاملات والمنشورات التشخيصية وكتب تشغيل شبكة الاختبار. الحفاظ على سلطة الوكيل ضيقة: يمكنه فحص الرمز، وقراءة حالة Taira، واقتراح تغييرات، وإجراء اختبارات محلية، لكنه لا ينبغي أن يتغير شبكة حية حتى يوافق الإنسان على العملية الدقيقة.

سير العمل العملي هو:

1. اطلب من الوكيل لفحص الوثائق ذات الصلة، SDK رمز، CLI أمر، أو MCP نظام أداة قبل أن يكتب الرمز.
2. اجعل الوكيل يكتب أصغر مسار العميل أولاً: التحقق من الحالة، البحث عن الحسابات، تحديد الاسم الأدنى، أو البحث عن الميزانية.
3. إضافة رمز بناء المعاملات فقط بعد أن تعمل مكالمات القراءة فقط ضد Taira.
4. الحفاظ على اختبارات الشبكة المباشرة الاختيار، على سبيل المثال خلف `TAIRA_LIVE=1`، بحيث لا تنفق عملية اختبار الوحدة العادية أموال شبكة الاختبار أو تعتمد على توفر الشبكة.
5. تطلب من الوكيل الإبلاغ عن جذور الشبكة والسلسلة وحساب السلطة وموجز التعليمات وأصول الرسوم والتغيير المتوقع في الحالة قبل تقديم أي معاملة.
6. مراجعة الكود الذي تم إنشاؤه للتعامل السري، والسلوك الإعادة التجربة، والقدرة على التعامل مع الرفض، قبل تعزيزه إلى CI أو سير العمل الرئيسي.

تشمل الأدوات المفيدة التي يتم قراءتها فقط MCP للتطوير البحث عن أصول الحساب ، وتحديد الاسم ، والبحث عن الكتل ، وبحث المعاملات ، وقوائم المعاملات ومراقبة حالة خط الأنابيب. استخدم هذه لتكوين الثقة قبل إرسال أي حمولة مفيدة موقعة.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### تدفق عمل المعاملات من خلال الوكلاء {#transaction-workflow-through-agents}

يمكن للجسر MCP تقديم معاملة موقعة Iroha ، ولكنه لا يزيل متطلبات المعاملة العادية. لا تزال المعاملة بحاجة إلى سلطة صحيحة والإذن، وتمويل الرسوم، سلسلة ID، البيانات المعدنية، والتوقيع .

للمواد الخام Iroha المعاملات، وتكوين وتوقيع ملف المعاملة مع SDK أو CLI أولاً، ثم إعطاء الوكيل فقط البايتات المعاملة الموقعة القنوني مشفرة `body_base64`. الوكيل يمكن أن يقدم الملف مع `iroha.transactions.submit_and_wait`, أو تقديم مع `iroha.transactions.submit` و استطلاع مع `iroha.transactions.wait`.

لا تضع المفاتيح الخاصة في طلب الوكيل. إذا كان الوكيل يحتاج إلى بناء معاملة، اشيرها إلى الرمز المحلي الذي يقوم بتحميل أسرار من بيئة وقت تشغيل المستخدم، سلسلة المفاتيح، توقيع الأجهزة، أو تم تجاهل ملف تشكيل testnet. يجب على العميل أن لا يكتب المواد الرئيسية في (ماركداون) أو الإصلاحات أو السجلات أو التزامات.

قبل تقديم المعاملة، اجعل الوكيل يصدر خطة قصيرة للمعاملة:

- `network`: Taira جذور وشبكة شبكات الاختبار ID
- `authority`: الحساب الذي يدفع الرسوم ويدفعها
- `instructions`: التسجيل، النقود، الحرق، التحويل، البيانات المعدنية، الإذن، أو ملخص دعوة العقد
- `fee asset`: الأصول التي سيتم تحصيلها على Taira
- `preflight reads`: عمليات التحقق من الحساب أو رصيد الأصول والإذن أو الاسم الخاطئ أو المجموعة التي أجريت بالفعل
- `expected result`: الحالة التي يجب أن تكون مرئية بعد التأكيد.
- `idempotency`: ماذا سيحدث إذا تم إعادة النظر في نفس الطلب؟

بعد إرسالها ، اجعل الوكيل ينتظر حالة المحطة ، ثم تحقق من تغيير الحالة باستخدام استفسار القراءة. يتضمن تقرير الانتهاء المفيد:

- هاشة المعاملات
- حالة المحطة مثل `Committed`، `Applied`، `Rejected`، أو `Expired`.
- تفاصيل الكتلة أو المستكشفين عندما تكون متاحة
- نتائج قراءة التحقق
- رسالة الرفض وما إذا كان الفشل يشبه الإذن أو الرسوم أو التحقق من المصادقة أو الحالة القديمة أو توافر نقطة النهاية.

نموذج حراسة سريعة:

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

العلاج Taira MCP كسيطرة عامة للشبكة الاختبارية. Taira المفاتيح، شبكة اختبار XOR, حسابات الصنبور والوقيع القناري يمكن استخدامها و يجب أن تبقى منفصلة عن Minamoto المفاتيح وتدفقات عمل الإفراج عن الإنتاج.

## أمثلة من الألعاب التي يمكنك تجربتها الآن {#toy-examples-you-can-try-now}

هذه الأمثلة قراءة فقط ما لم يتم الإشارة إليها. أنها تعمل قبل توليد المفاتيح و هي آمنة في التشغيل ضد كل من شبكات العامة.

مقارنة صحة شبكة الاختبار Taira و Minamoto الرئيسية:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

إدراج مسارات مساحة البيانات العامة المعروضة من قبل Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

قم بتشغيل نفس الأوامر ضد Minamoto عندما تحتاج إلى عرض الشبكة الرئيسية:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

قم بإنشاء قناة حالة صغيرة Node.js لمكتب التحكم أو الروبوتات ، أو التحقق من النشر:

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

يجب أن تكون أول لعبة من جانب الكتابة مصطلح Taira. تستخدم شبكة اختبارية XOR ولا ينبغي أبداً توجيهها إلى Minamoto.

## 3. إنشاء إعداد العميل Taira {#_3-create-a-taira-client-config}

إنشاء زوج مفاتيح إذا لم يكن لديك بالفعل:

```bash
kagami keys --algorithm ed25519 --json
```

إنشاء `taira.client.toml`:

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

المستوى الأعلى `chain` هو سلسلة المعاملات الدقيقة Taira ID. يختار إعداد `[account].profile = "taira"` بشكل مستقل متمييز لسلسلة Taira I105. لا تختار سلسلة ID ملف حساب.

قم بفحص القراءة فقط:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

إجراء تشخيصات عامة Taira قبل اختبارات الكتابة:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

تمويل حساب Taira من خلال الصنبور قبل تشغيل الرسوم المدفوعة. التدفق المباشر للصنبور هو في [Get Testnet XOR على Taira](#_4-get-testnet-xor-on-taira).

بعد أن يتم قبول طلب الصنبور وتمويل الحساب، فإن Taira القناري هو اختبار دخان الكتابة الاختياري:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

يقوم القناري بإرسال إشارة موقعة، وينتظر التأكيد، ويكتب تكوين مؤشر وقت تشغيل عندما يتم توفير `--write-config`. Taira هو شبكة اختبار عامة، لذلك يمكن أن يؤدي اكتئاب الصف إلى فشل الإشارة الموقعة حتى عندما يعمل المصباح نفسه. إذا أبلغ `taira doctor` عن صف مشبع أو يعود القناري `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` ، انتظر وتحاول مرة أخرى قبل التعامل معها كخطأ في تكوين العميل.

لإجراء اختبارات الدخان غير المراقبة، لف القناري في حلقة إعادة التجربة المحدودة:

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

توقف التجربة مرة أخرى إذا أظهرت `iroha taira doctor` فشلات صعبة. تعبئة الصف ورفض قبول الرسوم هي ظروف عابرة في شبكة الاختبار العامة؛ لا توجد تشخيصات DNS، TLS، أو `status = "fail"`.

## إنشاء حساب SORA Nexus ID {#generate-a-sora-nexus-account-id}

حساب SORA Nexus ID هو عنوان قائد I105 مشتق من مفتاح الحساب العام وقائمة الشبكة المستهدفة، وليس قيمة `[account].domain` في العميل TOML. نفس المفاتيح العامة ترمز إلى IDs مختلفة على Taira و Minamoto، ويجب على مستخدمي الإنتاج إنشاء زوج مفتاح منفصل ل Minamoto.

توليد أو تحميل زوج المفاتيح Ed25519 التي سوف تسيطر على الحساب:

```bash
kagami keys --algorithm ed25519 --json
```

تحويل المفتاح العام إلى حساب Taira ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

تحويل المفتاح العام Minamoto مع مقدمة الشبكة الرئيسية:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

استخدم الحساب الناتج ID في كل مكان يطلب الأمر Nexus API أو CLI حسابًا تقليديًا ID ، على سبيل المثال الصنبور Taira `account_id` ، استفسارات التوازن ، وحقول الحساب الصارمة ، أو ملزمات الأسماء. الحفاظ على المقابلة مفتاح خاص في إعداد العميل الخاص بك، واختيار نفس الشبكة العامة مع `[account].profile = "taira"` أو `[account].profile = "minamoto"`.

إن توليد ID لا يخلق بذاته حسابًا مدفوعًا في السلسلة. على Taira ، يمكن للمصنع إنشاء وتمويل الحساب للكتب التجريبية. على Minamoto ، استخدم إدخال الجهاز الرئيسي المعتمد أو تدفق الخزانة.

### تخزين المفاتيح والنسخ الاحتياطي {#key-storage-and-backup}

يمكن مشاركة الحساب ID والمفتاح العام. يجب التعامل مع المفتاح الخاص المتطابق والكلمة المرورية والبذور ومادة الاسترداد سراً.

استخدم هذه الممارسات في حسابات SORA Nexus:

- تخزين المفاتيح الخاصة في مدير كلمات المرور المشفرة أو متجر المفاتيح المدعوم من الأجهزة أو خدمة التوقيع المخصصة. لا تلتزم بمفاتيح التحكم في المصدر أو ترك مفاتيح الإنتاج في تاريخ القشرة أو السجلات أو الدردشة أو التذاكر أو النسخ الخفيفة غير المشفرة.
- استخدم كلمة مرور فريدة عالية الاندروبي لكل قبو أو توقيع إنتاج. تخزين الكلمات المرور في مدير كلمات المرور أو عملية الحفاظ على القسم، وليس في نفس الملف أو حزمة النسخ الاحتياطية مع مفتاح خاص مشفر.
- أبقيه Taira و Minamoto المفاتيح منفصلة. Taira المفاتيح كمواد الاختبار القابلة للتخلص منها و Minamoto المفاتيح كسلطة أموال الإنتاج.
- قم بتحميل المفتاح الخاص والمفتاح العام وملف حساب ID ، وملف تعويض الحساب، وأي ملاحظات استعادة الحساب أو احتفاظها اللازمة لاستعادة الوقيع. من السهل سوء استخدام مفتاح خاص دون سياق الشبكة أثناء الاسترداد.
- الحفاظ على نسخة احتياطية غير متصلة مشفرة واحدة على الأقل ونسخة احتراطي مشفرة منفصلة جغرافيا للتوقيعات الإنتاجية. اختبار الاسترداد مع عملية قراءة صغيرة فقط قبل اعتماد النسخة الاحتياطية.
- تدوير أو استبدال مؤشر إذا كان المفتاح الخاص ، وعبارة مرورية ، وسائل النسخ الاحتياطية ، أو مضيف التوقيع قد تعرضت.

لمزيد من التفاصيل، انظر [خزين المفاتيح المشفرة ](/ar/guide/security/storing-cryptographic-keys.md) و[أمن الكلمات المرور ](/ar/guide/security/password-security.md).

## 4، احصل على شبكة اختبار XOR على Taira {#_4-get-testnet-xor-on-taira}

استخدم الصنبور العام مباشرة التدفق هو:

1. إنشاء أو تحميل مؤلف وتحساب حساب Taira القنوني له ID.
2. أحضر اللغز الحالي
3. تحل اللغز إذا كان `difficulty_bits` أكبر من `0`.
4. قم بإرسال طلب المياه
5. انتظر حتى يصبح حسابك أو رصيد الأصول مرئيًا قبل إرسال رسائل دفع الرسوم.

تحويل المفتاح العام إلى حساب Taira I105 ID المتوقع من النوافذ:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

أحضر اللغز:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

إن النوافذ هي خدمة شبكة اختبار عامة. إذا عادت اللغز أو نقطة نهاية المطاف للمطالبة `502` ، وقتاً طويلاً، أو خطأ آخر على مستوى البوابة، انتظر وتحاول مرة أخرى قبل تغيير مفتاحك أو إعداد العميل.

الإجابة لها هذا الشكل:

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

إذا كان `difficulty_bits` هو `0`، فقم بإرسال حساب ID فقط:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

عندما يكون `difficulty_bits` أكبر من `0`، قم بحل اللغز وإدراج ارتفاع المرسوم بالإضافة إلى nonce:

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

1. بناء التحدي على SHA-256 أكثر من:
   - البايتات من `iroha:accounts:faucet:pow:v2`
   - حساب UTF-8 ID
   - `anchor_height` مثل الكبيرة في `u64`
   - `anchor_block_hash_hex` تم تشفيرها بأبحاث
   - `challenge_salt_hex` تم تشفيرها بأبحاث، عند وجودها
2. جرب `u64` nonces مرمومة كمقيمات 8 بايت الكبيرة.
3. لكل إشارة، قم بتشغيل النسخ المكتوبة مع:
   - كلمة المرور: 8 بايت nonce
   - الملح: تحدي 32 بايت
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - طول الخروج: 32 بايت
4. النسخة الفائزة هي أول هضم مع `difficulty_bits` على الأقل تساوي الصفر.

يتضمن استجابة النوافذ الأصول الممولة وتحليل المعاملات المتسللة:

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

يتم استرداد الإجابة حاليًا ب HTTP `202 Accepted`. تعريف الأصول ID أعلاه هو أصول الرسوم Taira التي تمولها الصنبور العام. وقد قبلت الصنبور الطلب عند إعادة `tx_hash_hex` و `status: "QUEUED"`.

ثم استطلاع الأصول الممولة قبل تقديم معاملات دفع الرسوم الخاصة بك:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

إذا تم قبول مطالبة الصنبور ولكن الحساب أو الأصول ليست مرئية بعد، فإن المعاملة لا تزال خلف معالجة طابور الشبكة الاختبارية العامة. انتظر وتجربة القراءة مرة أخرى قبل إرسال الكتب.

للحصول على التحقق المباشر API جاهز للتشغيل، قم بحفظ هذا باسم `taira_faucet_claim.py` وإرسال حساب Taira I105 ID:

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

لا تستخدم الصنبور فقط لتمويل شبكة الاختبار Taira في تدفقات XOR، أو حسابات الصنبور، أو توقيعات القناري Taira في Minamoto.

## 5. إنشاء إعداد العميل Minamoto {#_5-create-a-minamoto-client-config}

استخدم زوج مفتاح منفصل ل Minamoto. لا تستعيد استخدام مفاتيح Taira للشبكة الرئيسية.

إنشاء `minamoto.client.toml`:

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

المستوى العلوي `chain` هو سلسلة الشبكة الرئيسية الحالية Nexus ID. يختار `[account].profile = "minamoto"` تمييز السلسلة Minamoto I105؛ لا يتم اختيارها ضمنياً باسم المضيف والسلسلة في النقطة النهائية ID.

تحويل المفتاح العام Minamoto إلى حساب I105 القنوني ID مع مقدمة الشبكة الرئيسية:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

إجراء عمليات التحقق من جانب القراءة فقط حتى يتم توفير الحساب وتمويله من خلال تدفق الوصول إلى الشبكة الرئيسية أو حكمها:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

لا تشغيل الصنبور Taira أو مساعدة الكتابة ضد Minamoto.

## 6 - تمويل حساب Minamoto مع XOR {#_6-fund-a-minamoto-account-with-xor}

يتم دفع رسوم Minamoto مع الإنتاج XOR، و Minamoto لا تمتلك مصدر عام. تمويل الحساب المكوّن من خلال إدخال الشبكة الرئيسية المعتمدة أو تحويل الخزانة، أو تلقي XOR من حساب موجود تمويلاً Minamoto.

التحقق من الحساب الكنسي ID والتمويل مع الشيكات القراءة فقط قبل تقديم كتابة. تعامل Minamoto XOR كموارد الإنتاج: تجربة العملية نفسها في Taira أولاً، حافظ على مفاتيح الإنتاج منفصلة، ولا افترض أن عملية شبكة الأساسية يمكن إعادة تعديلها.

Taira XOR لا يمكنه دفع رسوم Minamoto. لا يتم تحويل رصيدات شبكة الاختبار ومطالب المصنع إلى Minamoto.

## 7 - العمل داخل مساحة بيانات موجودة {#_7-work-inside-an-existing-dataspace}

استخدم أسماء النطاقات المؤهلة بالكامل للكائنات التي تعيش داخل مساحة البيانات. على سبيل المثال ، يجب أن تستخدم نطاق مشروع في مساحة بيانات عامة:

```text
apps.universal
```

بعد أن يحصل حسابك على الإذنات المطلوبة، قم بإنشاء نية خالية من السر `AliasSetupPlanRequestV1` للمجال واستخدام الخطة الإعلانية:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

بالنسبة إلى Minamoto ، قم بتوليد وموافقة على نية خطة وشبكة أساسية منفصلة. التخطيطات ملزمة بالسلسلة والسلطة ورابط الحالة الفعلية والموعد النهائي، وبالتالي لا يمكن تعزيز خطة Taira أو إعادة تشغيلها:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

أسماء مستعار الحسابات تستخدم نفس إثر مساحة بيانات:

```text
alice@apps.universal
alice@universal
```

لا يزال حقل الحسابات الصارمة تستخدم حساب I105 الكنسي IDs. تعامل الأسماء الخفيفة باعتبارها روابط قابلة للقراءة من قبل الإنسان تحل إلى حساب IDs.

## 8 - توفير مساحة بيانات جديدة {#_8-provision-a-new-dataspace}

مساحة بيانات جديدة هي تغيير في المشغل والحوكمة. يمكن للنقطة النهائية العامة Torii توجيه حركة المرور إلى مساحات البيانات المكوّنة، ولكنها سترفض أسماء مستعار لمساحة البيانات غير معروفة.

قبل إعداد تغيير، التقاط الكتالوج الحالي على الهواء الطلق:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

بالنسبة لحساب المشغل، تحقق أيضًا من موقف إشارة المسار:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

لا تعزيز اسم مستعار جديد إلا إذا تم مراجعة مسار ID ومجال البيانات ID ومجموعة المحققين والتسامح مع الأخطاء والإشارة وقواعد التوجيه والمالك التشغيلي معاً. يمكن لحساب المستخدم العادي مع الإذن المطلوبة الحصول على نطاق وتأجيره SNS داخل مساحة بيانات موجودة من خلال مخطط الاسم المستعار؛ فإنه لا يمكن إضافة مساحة البيانات العامة الجديدة بأمان.

بالنسبة لمجال البيانات الخاص أو التنظيمي، قم بإعداد تغيير في الكتالوج مع:

- الاسم الفريد لمجال البيانات والرقمي `id`
- إدخال مسار متطابق أو تفويض مسار موجود
- مساحة البيانات `fault_tolerance`
- قواعد توجيه التعليمات أو نطاق الحسابات التي يجب أن تصل إلى هناك
- مذكرة دليل الفضاء أو أدلة تثبيت مساوية، عندما يكشف مساحة البيانات عن قدرات UAID
- الموافقة على الحوكمة لسياسة التحقق من المصادقة والامتثال والتسوية والمراقبة.

جزء من إعداد يمكن مراجعته يشبه هذا:

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

- `irohad --sora --config <config.toml> --trace-config` يمر على تشكيل العقدة المحلولة
- يتم أرشيف المخطط الذي تم إنشاؤه أو مراجعته باستخدام الهاشات والتوقيعات.
- اختبارات الدخان تمر على Taira قبل أي ترقية Minamoto
- الكتالوج `/status` بعد التغيير يظهر المسار المقصود ومساحة البيانات.
- `iroha app nexus lane-report --summary` لا يبلغ عن فقدان المخططات المطلوبة

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

تعزيز مساحة البيانات نفسها إلى Minamoto فقط بعد اكتمال نشر Taira، واختبارات الدخان، المراقبة، والدليل على الحوكمة.

## الصفحات المتعلقة {#related-pages}

- [التثبيت Iroha 3](/ar/get-started/install-iroha.md)
- [تشغيل Iroha 3 عبر CLI ](/ar/get-started/operate-iroha-via-cli.md)
- [رسوم الرعاية عن مساحة بيانات خاصة ](/ar/get-started/private-dataspace-fee-sponsor.md)
- [نقاط نهاية Torii](/ar/reference/torii-endpoints.md)
- [الإشارة إلى Genesis](/ar/reference/genesis.md)
