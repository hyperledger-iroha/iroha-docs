---
translation_locale: ar
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# البناء على SORA 3: Taira و Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 هو مسار النشر العام المواجه للتطبيق المبني على Iroha 3 و SORA Nexus. قم بالبناء والتدريب على Taira أولاً، ثم انقل نفس شكل العميل إلى Minamoto فقط عندما يكون لديك مفاتيح رئيسية منفصلة للشبكة الرئيسية، و XOR حقيقية للرسوم، والموافقة على الإنتاج.

يُوضح هذا الدليل كيفية تكوين عميل Iroha لشبكات SORA العامة 3:

- Taira الشبكة التجريبية في `https://taira.sora.org`
- Minamoto الشبكة الرئيسية على `https://minamoto.sora.org`

استخدم Taira للاختبارات التكاملية، وقنابل الاختبار المموّلة من الشبكة التجريبية، وتجارب النشر. استخدم Minamoto فقط للنشاط الجاهز للإنتاج على الشبكة الرئيسية. كلا الشبكتين تفرضان رسومًا بـ XOR:

- Taira يستخدم شبكة الاختبار XOR من خدمة تمويل شبكة الاختبار العامة.
- Minamoto يستخدم XOR الحقيقي. لا توجد خدمة تمويل تجريبية Minamoto.

## مسار البناء {#builder-path}

|خطوة| Taira الشبكة التجريبية| Minamoto الشبكة الرئيسية |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|ابدأ في قراءة حالة الشبكة|استعلام `/status` بدون مفاتيح|استعلام `/status` بدون مفاتيح|
|اختر فضاء البيانات|استخدم `universal` العام ما لم يكن تطبيقك بحاجة إلى مسار تنفيذ مُدار|استخدم نفس مساحة البيانات فقط بعد الموافقة على الشبكة الرئيسية|
|الحصول على أصل الرسوم|استخدم خدمة تمويل شبكة الاختبار العامة Taira|استلام XOR من حساب Minamoto ممول أو تدفق خزينة معتمد|
| عمليات كتابة اختبارية | استخدم XOR اختباريًا ممولًا من خدمة التمويل | لا تستخدم أدوات الاختبار؛ فعمليات الكتابة تنفق XOR حقيقيًا |
|روّج|احتفظ بمنطق إعادة المحاولة والمراقبة ومعالجة الموقّع التشفيري|استخدم مفاتيح وتمويلات وعناصر تحكم إصدار منفصلة|

التدفق العملي هو:

1. قم ببناء العميل ضد Taira واستخدم مساحة البيانات العامة `universal`.
2. أضف موقع توقيع تشفير وقم بتمويله بخدمة تمويل شبكة الاختبار Taira.
3. اختبر منطق تطبيقك ضد Taira حتى تصبح الإخفاقات مملة وملحوظة.
4. إنشاء موقع تشفير منفصل Minamoto، وتمويله بـ XOR حقيقي، ونقل العمليات المثبتة فقط إلى الشبكة الرئيسية.

## تابع مع كتاب الطبخ {#continue-with-the-cookbook}

استخدم هذا الدليل لاختيار شبكة، وتكوين موقع تشفير، وتمويل الرسوم. ثم تابع مع الوصفة التي تتطابق مع سلوك التطبيق الذي تريد بناءه:

|هدف|وصفة|
| --- | --- |
|تحقق من Taira وقم بإعداد عميل| [الاتصال بـ Taira](/ar/cookbook/connect-to-taira.md) |
|أرسل كتابة أولى وتحقق من نتيجتها| [إرسال والتحقق من المعاملات](/ar/cookbook/submit-and-verify-transactions.md) |
|تسجيل، إصدار، وتحريك القيمة| [الأصول القابلة للاستبدال](/ar/cookbook/fungible-assets.md) |
|قراءة حالة التطبيق المفلترة| [استعلام حالة دفتر الحسابات في البلوكشين](/ar/cookbook/query-ledger-state.md) |
|التفاعل مع التغييرات النهائية| [أحداث البث](/ar/cookbook/stream-events.md) |

يحافظ كتاب الطهي على تركيز كل سير عمل ويربط العودة إلى هنا عند الحاجة إلى تمويل Taira أو سياق الشبكة SORA Nexus.

## 1. افهم ما الذي تقوم بإعداده {#_1-understand-what-you-are-setting-up}

في SORA Nexus، يُعد فضاء البيانات جزءًا من مسار تنفيذ الشبكة وفهرس التوجيه. لا يقوم العميل بإنشاء فضاء بيانات عام جديد بمجرد تغيير `client.toml`. يقوم إعداد العميل بعمل شيئين:

1. يوجه العميل إلى نقطة النهاية الصحيحة Torii API
2. يختار سياق توجيه المجال وفضاء البيانات لحسابه الموحد وفقًا لمعيار البروتوكول

`AccountId` دائمًا بروتوكول واحد فقط وخالٍ من النطاق. قيمة `[account].domain` في `client.toml` توفر سياق التوجيه والاسم المستعار؛ ولا تصبح جزءًا من هوية الحساب. بالنسبة لمعظم التطبيقات، ابدأ بمساحة البيانات العامة `universal`. يستخدم سياق النطاق شكل `domain.dataspace`، على سبيل المثال:

```text
wonderland.universal
```

إذا كنت بحاجة إلى مساحة بيانات تنظيمية جديدة، فقم بإعداد كتالوج واقتراح توجيه بدلاً من محاولة تسجيلها من حساب عميل عادي. انظر [توفير فضاء بيانات جديد](#_8-provision-a-new-dataspace) أدناه.

## 2. تحقق من نقطة النهاية العامة Torii API {#_2-check-the-public-torii-endpoint}

تحقق من أن نقطة النهاية المستهدفة API تعمل قبل تكوين موقع التوقيع التشفيري.

لـ Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

لـ Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

افحص مساحة البيانات وعرض مسار التنفيذ التي يكشفها العقدة:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

استخدم نفس الأمر مع `https://minamoto.sora.org/status` للشبكة الرئيسية.

## Taira MCP للوكلاء {#taira-mcp-for-agents}

Taira يكشف أيضًا عن جسر بروتوكول سياق النموذج الأصلي لـ Torii (MCP) لبيئات تنفيذ برنامج الوكيل. استخدمه عندما يحتاج الوكيل إلى قراءة شبكات اختبار مباشرة، أو تشخيصات مبرمجة، أو بروفة كتابة تمت مراجعتها بدقة دون بناء عميل مخصص لـ Torii أولاً.

|إعداد|قيمة|
| --- | --- |
| MCP API نقطة النهاية | `https://taira.sora.org/v1/mcp` |
|جذر الشبكة| `https://taira.sora.org` |
|الاستخدام المقصود|Taira قراءات الشبكة التجريبية وبروفات الكتابة الممولة من الشبكة التجريبية|
|ما يعادل الإنتاج|لا توجه هذا الإدخال إلى Minamoto ما لم يتم الموافقة صراحةً على نقطة نهاية MCP API على الشبكة الرئيسية وعناصر التحكم في الإصدار|

تحقق من بيانات تعريف الجسر قبل إضافة مواد التوقيع:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

قم بتكوين URL كخادم MCP محلي للمستخدم في بيئة تنفيذ برنامج الوكيل. لا تخزن في نظام التحكم بالمصدر إعدادات MCP الخاصة بالوكيل، أو رموز API، أو رؤوس المصادقة المحوّلة، أو قيم `authority`، أو `private_key` في مستودع المستندات هذا أو في مستودع التطبيق.

قواعد موجه الوكيل التي تعمل بشكل جيد مع Taira:

- اكتشف الأدوات من خادم MCP قبل استدعائها؛ أعد الاكتشاف إذا أبلغ الخادم عن `listChanged`.
- فضل الأدوات المختارة `iroha.*` على الأدوات الخام `torii.*`.
- ابدأ بالوضع للقراءة فقط: تحقق من الحالة، الحسابات، الأصول، الأسماء المستعارة، الكتل، حالة الحوكمة، وحالة المعاملات قبل اقتراح عمليات الكتابة.
- يتطلب وجود تعليمات بشرية صريحة قبل إجراء التغييرات على شبكة الاختبار الحية. بالنسبة لحاويات بيانات المعاملات الموقعة مسبقًا، استخدم `iroha.transactions.submit_and_wait` حتى ينتظر الوكيل النتيجة بدلاً من الاكتفاء بالإرسال.
- تلخيص تجزئات التشفير للمعاملة، الحالة النهائية، وأخطاء التحقق من الخادم في استجابة الوكيل.

### سير عمل التطوير مع الوكلاء {#development-workflow-with-agents}

استخدم الوكلاء كمساعدين للتطوير لعملاء Iroha، لبناة المعاملات، لبرامج التشخيص، ولدلائل التشغيل على testnet. حافظ على ضيق صلاحيات تفويض الوكيل: يمكنه فحص الكود، وقراءة حالة Taira، واقتراح التغييرات، وتشغيل الاختبارات المحلية، لكنه لا يجب أن يغير الشبكة الحية حتى يوافق الإنسان على العملية الدقيقة.

سير عمل عملي هو:

1. اطلب من الوكيل فحص المستندات ذات الصلة، رمز SDK، الأمر CLI، أو مخطط الأداة MCP قبل أن يكتب الشيفرة.
2. اجعل الوكيل يكتب أصغر مسار للعميل أولاً: فحص الحالة، البحث في الحساب، حل الأسماء المستعارة، أو البحث عن الرصيد.
3. أضف كود بناء المعاملات فقط بعد أن تعمل الطلبات للقراءة فقط API مقابل Taira.
4. احتفظ باختبارات الشبكة الحية اختيارية، على سبيل المثال خلف `TAIRA_LIVE=1`، بحيث لا تنفق عملية تشغيل اختبار الوحدة العادية أموال شبكة الاختبار أو تعتمد على توفر الشبكة.
5. يتعين على الوكيل الإبلاغ عن جذر الشبكة، السلسلة، حساب المبدأ التفويض، ملخص التعليمات، أصل الرسوم، والتغير المتوقع في الحالة قبل تقديم أي معاملة.
6. راجع الكود الذي تم إنشاؤه للتعامل مع الأسرار، وسلوك إعادة المحاولة، وعدم التأثير المتكرر، والتعامل مع الرفض قبل رفعه إلى CI أو سير العمل على الشبكة الرئيسية.

تشمل أدوات MCP القابلة للقراءة فقط والمفيدة للتطوير عمليات البحث عن أصول الحساب، وحل الأسماء المستعارة، والبحث عن الكتل، والبحث عن المعاملات، وقوائم المعاملات، وفحوصات حالة سير عمل معالجة البرمجيات. استخدم هذه لبناء الثقة قبل تقديم أي حمولة موقعة.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### سير العمل في المعاملات من خلال الوكلاء {#transaction-workflow-through-agents}

يمكن لجسر MCP تقديم معاملة Iroha موقعة، لكنه لا يلغي متطلبات المعاملة العادية. لا تزال المعاملة تحتاج إلى السلطة الصحيحة للمخول، الأذونات، تمويل الرسوم، معرف السلسلة، البيانات الوصفية، والتوقيع.

بالنسبة للمعاملات الخام Iroha، قم بإنشاء وتوقيع حاوية بيانات المعاملة باستخدام SDK أو CLI أولاً، ثم أعطِ الوكيل فقط الفردي بروتوكول-المعيار معاملات موقعة بالبايتات مشفرة كـ `body_base64`. يمكن للوكيل إرسال حاوية البيانات باستخدام `iroha.transactions.submit_and_wait`، أو الإرسال باستخدام `iroha.transactions.submit` والاستطلاع باستخدام `iroha.transactions.wait`.

لا تلصق المفاتيح الخاصة في مطالبة الوكيل. إذا احتاج الوكيل إلى إنشاء معاملة، فوجّهه إلى شفرة محلية تحمّل الأسرار من بيئة تشغيل برنامج المستخدم، أو سلسلة المفاتيح، أو موقّع تشفيري عتادي، أو ملف إعداد testnet متجاهَل. يجب ألا يكتب الوكيل مادة المفتاح مطلقًا في Markdown أو ملفات الاختبار أو السجلات أو عمليات الإيداع في نظام التحكم بالمصدر.

قبل تقديم المعاملة، اجعل الوكيل يقوم بوضع خطة معاملة قصيرة:

- `network`: Taira الشبكة التجريبية الجذر ومعرف السلسلة
- `authority`: الحساب الذي يوقع ويدفع الرسوم
- `instructions`: تسجيل، إصدار، إتلاف، نقل، بيانات وصفية، إذن، أو ملخص استدعاء تقني للعقد
- `fee asset`: الأصل الذي سيتم فرضه على Taira
- `preflight reads`: الحساب، رصيد الأصول، الأذونات، الاسم المستعار، أو فحوصات الحظر قد تم تنفيذها بالفعل
- `expected result`: الحالة التي يجب أن تكون مرئية بعد التأكيد
- `idempotency`: ماذا يحدث إذا تم إعادة محاولة نفس الطلب

بعد الإرسال، اجعل الوكيل ينتظر حالة نهائية، ثم تحقق من تغيير الحالة باستخدام استعلام قراءة. تقرير إكمال مفيد يشمل:

- تجزئة تشفيرية للمعاملة
- حالة المحطة مثل `Committed`، `Applied`، `Rejected`، أو `Expired`
- الكتلة أو تفاصيل المستكشف عند توفرها
- نتائج قراءة التحقق
- رسالة الرفض وما إذا كان الفشل يبدو وكأنه متعلق بالأذونات، الرسوم، التحقق، الحالة القديمة، أو توفر نقطة النهاية API

مثال على موجه محمي:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

عندما يكون حاوية البيانات الموقعة جاهزة بالفعل:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

عامل Taira MCP كواجهة تحكم لشبكة اختبار عامة. مفاتيح Taira، XOR الخاصة بشبكة الاختبار، حسابات خدمة تمويل شبكة الاختبار، وموقّعو التشفير التجريبي قابلة للتصرف ويجب أن تظل منفصلة عن مفاتيح Minamoto وسير عمل الإصدارات الإنتاجية.

## أمثلة توضيحية يمكنك تجربتها الآن {#toy-examples-you-can-try-now}

هذه الأمثلة للقراءة فقط ما لم يُذكر خلاف ذلك. تعمل قبل أن تقوم بتوليد المفاتيح وهي آمنة للتشغيل على كل من الشبكات العامة.

قارن بين صحة testnet Taira و mainnet Minamoto:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

سرد مسارات تنفيذ فضاء البيانات العامة المعروضة بواسطة Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

قم بتشغيل نفس الأمر ضد Minamoto عندما تحتاج إلى عرض الشبكة الرئيسية:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

بناء مسبار حالة صغير Node.js للوحة التحكم أو الروبوت أو فحص النشر:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
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

ينبغي أن يكون أول مثال مبسط لعملية كتابة مطالبة بتمويل من خدمة Taira. فهو يستخدم XOR الخاص بالشبكة التجريبية، ويجب ألا يوجّه مطلقًا إلى Minamoto.

## 3. إنشاء إعدادات عميل Taira {#_3-create-a-taira-client-config}

قم بإنشاء زوج مفاتيح إذا لم يكن لديك واحد بالفعل:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
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

المستوى الأعلى `chain` هو بالضبط معرف سلسلة المعاملات Taira. إعداد `[account].profile = "taira"` يختار بشكل مستقل مميز سلسلة Taira I105. معرف السلسلة لا يختار ملف تعريف الحساب.

قم بإجراء فحص للقراءة فقط:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

قم بتشغيل التشخيصات العامة Taira قبل كتابة الاختبارات:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

موّل حساب Taira من خلال خدمة تمويل الشبكة التجريبية قبل أن تقوم بعمليات الكتابة التي تتطلب رسوماً. تدفق خدمة التمويل المباشر للشبكة التجريبية موجود في [احصل على Testnet XOR على Taira](#_4-get-testnet-xor-on-taira).

بعد قبول طلب خدمة تمويل الشبكة التجريبية وتمويل الحساب، يمكن اعتبار Taira الكاناري اختبار كتابة خفيف اختياري:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

يقدّم الكناري رسالة تحقق موقعة، وينتظر التأكيد، ويكتب إعدادات المفتاح التشفيري لبيئة تنفيذ البرمجيات عند توفير `--write-config`. يعد Taira شبكة اختبار عامة، لذا يمكن أن يؤدي تشبع الطابور إلى فشل إشارة الإشارة الموقعة حتى عندما تعمل خدمة تمويل شبكة الاختبار نفسها. إذا أبلغ `taira doctor` عن طابور مشبع أو أعاد المراقب `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`، فانتظر وحاول مرة أخرى قبل التعامل معه كخطأ في تكوين العميل.

للاختبارات الأولية غير المراقبة، قم بلف الكناري في حلقة إعادة محاولة محدودة:

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

توقف عن إعادة المحاولة إذا أظهر `iroha taira doctor` أخطاء صعبة. تشبع الطابور ورفض قبول الرسوم هي حالات مؤقتة على الشبكة العامة التجريبية؛ أما تشخيصات DNS و TLS و`status = "fail"` فهي ليست كذلك.

## إنشاء معرف حساب SORA Nexus {#generate-a-sora-nexus-account-id}

معرّف حساب SORA Nexus هو عنوان واحد بمعيار البروتوكول I105 مشتق من المفتاح العام للحساب وبادئة الشبكة المستهدفة. إنه ليس قيمة `[account].domain` في العميل TOML. نفس المفتاح العمومي يُشفر إلى معرفات مختلفة على Taira و Minamoto، ويجب على مستخدمي الإنتاج إنشاء زوج مفاتيح منفصل لـ Minamoto.

قم بإنشاء أو تحميل زوج مفاتيح Ed25519 الذي سيتحكم بالحساب:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

حوّل المفتاح العام إلى معرف حساب Taira:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

حوّل مفتاح عام Minamoto مع بادئة الشبكة الرئيسية:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

استخدم معرف الحساب الناتج أينما طلبت أي من الأوامر Nexus أو API أو CLI معرف حساب قياسي واحد للبروتوكول، على سبيل المثال خدمة تمويل اختبار الشبكة Taira `account_id`، استعلامات الرصيد، حقول الحساب الصارمة، أو ربط الأسماء المستعارة. احتفظ بالمفتاح الخاص المطابق في إعدادات العميل الخاصة بك، واختر نفس الشبكة العامة مع `[account].profile = "taira"` أو `[account].profile = "minamoto"`.

إن توليد المعرف بحد ذاته لا ينشئ حسابًا ممولًا على السلسلة. على Taira، يمكن لخدمة تمويل الشبكة التجريبية إنشاء الحساب وتمويله من أجل الكتابات على الشبكة التجريبية. على Minamoto، استخدم تدفق الانضمام أو الخزينة المعتمد على الشبكة الرئيسية.

### تخزين النسخ الاحتياطي والمفتاح {#key-storage-and-backup}

يمكن مشاركة معرف الحساب والمفتاح العام. يجب التعامل مع المفتاح الخاص المطابق، وعبارة المرور، والبذرة، ومواد الاسترداد على أنها سرية.

استخدم هذه الممارسات لحسابات SORA Nexus:

- قم بتخزين المفاتيح الخاصة في مدير كلمات مرور مشفر، أو مخزن مفاتيح مدعوم بالأجهزة، أو خدمة توقيع مخصصة. لا تقم بوضع مفاتيح إتمام البروتوكول في نظام التحكم بالمصدر أو ترك مفاتيح الإنتاج في سجل الأوامر أو السجلات أو الدردشة أو التذاكر أو النسخ الاحتياطية غير المشفرة.
- استخدم عبارة مرور فريدة عالية التعقيد لكل خزنة أو موقّع تشفيرات للإنتاج. احفظ عبارات المرور في مدير كلمات المرور أو عملية الحيازة المنقسمة، وليس في نفس الملف أو حزمة النسخ الاحتياطي مع المفتاح الخاص المشفر.
- احتفظ بمفاتيح Taira و Minamoto منفصلة. اعتبر مفاتيح Taira مواد اختبارية قابلة للاستخدام مرة واحدة ومفاتيح Minamoto كمفتاح تفويض الأموال الإنتاجية.
- قم بعمل نسخة احتياطية من المفتاح الخاص، المفتاح العام، معرف الحساب، ملف تعريف الحساب، وأي ملاحظات لاستعادة الحساب أو الحفظ اللازمة لاستعادة الموقّع التشفيري. المفتاح الخاص بدون سياق الشبكة من السهل إساءة استخدامه أثناء الاستعادة.
- احتفظ بنسخة احتياطية مشفرة واحدة على الأقل غير متصلة بالإنترنت ونسخة احتياطية مشفرة واحدة في موقع جغرافي منفصل لموقّعي التشفير في الإنتاج. اختبر الاستعادة بعملية صغيرة للقراءة فقط قبل الاعتماد على النسخة الاحتياطية.
- دوّر الموقّع أو استبدله إذا كان من المحتمل أن يكون المفتاح الخاص أو عبارة المرور أو وسيط النسخ الاحتياطي أو مضيف التوقيع قد انكشف.

لمزيد من التفاصيل، راجع [تخزين المفاتيح التشفيرية](/ar/guide/security/storing-cryptographic-keys.md) و [أمن كلمة المرور](/ar/guide/security/password-security.md).

## ٤. الحصول على Testnet XOR على Taira {#_4-get-testnet-xor-on-taira}

استخدم خدمة تمويل شبكة الاختبار العامة مباشرة. التدفق هو:

1. إنشاء أو تحميل موقع تشفير وحساب معرف الحساب الواحد حسب معيار البروتوكول Taira.
2. احصل على لغز خدمة تمويل الشبكة التجريبية الحالية.
3. حل اللغز إذا كان `difficulty_bits` أكبر من `0`.
4. قدّم طلب خدمة تمويل الشبكة التجريبية.
5. انتظر حتى يصبح رصيد الحساب أو الأصل مرئيًا قبل إرسال الكتابات التي تتطلب دفع رسوم.

حوّل المفتاح العام إلى معرف الحساب Taira I105 المتوقع من خدمة تمويل الشبكة الاختبارية:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

احضر اللغز:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

خدمة تمويل الشبكة التجريبية هي خدمة شبكة تجريبية عامة. إذا أعاد نقطة النهاية للغز أو المطالبة API `502`، أو نفاد الوقت، أو خطأ على مستوى البوابة، فانتظر وحاول مرة أخرى قبل تغيير مفاتيحك أو إعدادات العميل.

الاستجابة لها هذا الشكل:

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

عندما يكون `difficulty_bits` `0`، قم بإرسال معرف الحساب فقط:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

عندما يكون `difficulty_bits` أكبر من `0`، قم بحل اللغز وضمّن ارتفاع المِرساة بالإضافة إلى قيمة الرقم العشوائي التشفيري:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }' \
  | tee ./taira-faucet-response.json \
  | jq .
```

خوارزمية اللغز هي:

1. ابنِ التحدي كـ SHA-256 على:
   - بايتات `iroha:accounts:faucet:pow:v2`
   - معرّف حساب UTF-8
   - `anchor_height` بالشكل الكبير النهاية `u64`
   - `anchor_block_hash_hex` تم فك ترميزه كبايتات
   - `challenge_salt_hex` مفكك كبيانات بايت، عند وجوده
2. جرّب قيم nonce التشفيرية `u64` المشفرة كقيم بترتيب كبير الحجم 8 بايت.
3. لكل قيمة رقمية مشفرة مميزة، شغّل scrypt مع:
   - كلمة المرور: قيمة التشفير ذات الثمانية بايت nonce
   - الملح: التحدي ذي 32 بايت
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - طول الإخراج: 32 بايت
4. قيمة الرقم العشوائي التشفيري الفائز هي أول قيمة هضم تشفيرية تحتوي على الأقل على `difficulty_bits` بت صفري في البداية.

تتضمن استجابة خدمة تمويل شبكة الاختبار الأصل الممول وهاش التشفير للمعاملة المعلقة:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "<TAIRA_FEE_ASSET_DEFINITION_ID>",
  "asset_id": "...",
  "amount": "<FUNDED_AMOUNT>",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

يتم إرجاع الاستجابة حاليًا مع HTTP `202 Accepted`. ويتم تمويل `asset_definition_id` الخاص به حاليًا بأصل الرسوم Taira الممول من قبل خدمة تمويل الشبكة التجريبية العامة؛ استخلصه من الاستجابة بدلاً من نسخ معرف مثال. لقد قبلت خدمة تمويل شبكة الاختبار الطلب عندما تعيد `tx_hash_hex` و `status: "QUEUED"`.

ثم قم بالاستطلاع عن الأصل الممول قبل تقديم معاملاتك الخاصة التي تدفع رسوماً:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

إذا تم قبول طلب خدمة تمويل الشبكة الاختبارية ولكن الحساب أو الأصل غير مرئي بعد، فإن المعاملة لا تزال قيد معالجة قائمة الانتظار العامة للشبكة الاختبارية. انتظر وأعد محاولة القراءة قبل إرسال الكتابات.

لإجراء فحص مباشر جاهز للتشغيل API، احفظ هذا كـ `taira_faucet_claim.py` ومرّر معرف حساب Taira I105:

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

puzzle_request = urllib.request.Request(
    f"{root}/v1/accounts/faucet/puzzle",
    headers={"Accept": "application/json"},
)

with urllib.request.urlopen(puzzle_request) as res:
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
    headers={"Accept": "application/json", "content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

خدمة التمويل مخصّصة لأموال شبكة Taira التجريبية فقط. لا تستخدم XOR التجريبي أو حسابات خدمة التمويل أو موقّعي اختبار Taira في تدفقات Minamoto.

## 5. إنشاء إعدادات عميل Minamoto {#_5-create-a-minamoto-client-config}

استخدم زوج مفاتيح منفصل لـ Minamoto. لا تعيد استخدام مفاتيح Taira للشبكة الرئيسية.

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

المستوى الأعلى `chain` هو معرف سلسلة الشبكة الرئيسية الحالي Nexus. يختار `[account].profile = "minamoto"` مميز سلسلة Minamoto I105؛ نقطة النهاية API واسم المضيف ومعرّف السلسلة لا يختارانه ضمنيًا.

حوّل مفتاح عام Minamoto إلى معرف حساب I105 القياسي لبروتوكول واحد مع بادئة الشبكة الرئيسية:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

قم بتشغيل فحوصات جانب القراءة فقط حتى يتم تجهيز الحساب وتمويله من خلال الانضمام إلى الشبكة الرئيسية أو تدفق الحوكمة:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

لا تشغّل خدمة تمويل شبكة الاختبار Taira أو مساعد الكتابة-الإنذار ضد Minamoto.

## ٦. تمويل حساب Minamoto بمبلغ XOR {#_6-fund-a-minamoto-account-with-xor}

يتم دفع الرسوم Minamoto بالإنتاج XOR، و Minamoto ليس لديه خدمة تمويل شبكة اختبار عامة. قم بتمويل الحساب المُكوَّن من خلال الانضمام إلى الشبكة الرئيسية المعتمد أو تحويل من الخزينة، أو استلم XOR من حساب Minamoto موجود وممول.

تحقق من معرف الحساب القياسي للبروتوكول الفردي والتمويل من خلال فحوصات للقراءة فقط قبل تقديم كتابة. اعتبر Minamoto XOR أموالاً إنتاجية: قم بتدريب نفس العملية على Taira أولاً، احتفظ بمفاتيح إنتاج منفصلة، ولا تفترض أنه يمكن إعادة تعيين معاملة الشبكة الرئيسية.

Taira XOR لا يمكنه دفع رسوم Minamoto. أرصدة شبكة الاختبار ومطالبات خدمة تمويل شبكة الاختبار لا تنتقل إلى Minamoto.

## 7. العمل داخل مساحة بيانات موجودة {#_7-work-inside-an-existing-dataspace}

استخدم أسماء النطاقات المؤهلة بالكامل لأغراض دفتر السجلات الخاصة بالبلوك تشين التي تعيش داخل مساحة البيانات. على سبيل المثال، يجب أن يستخدم نطاق المشروع في مساحة البيانات العامة:

```text
apps.universal
```

بعد أن يحصل حسابك على الأذونات المطلوبة، قم بإنشاء نية `AliasSetupPlanRequestV1` خالية من الأسرار للنطاق واستخدم المخطط الإعلاني:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

بالنسبة لـ Minamoto، قم بإنشاء واعتماد نية وخطة رئيسية منفصلة للشبكة الرئيسية. الخطط مرتبطة بسلسلتها، والمفوض الرئيسي، والمرتكز على الحالة الحية، والموعد النهائي، لذا لا يمكن ترقية أو إعادة تشغيل خطة Taira:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

تستخدم الأسماء المستعارة للحساب نفس لاحقة مساحة البيانات:

```text
alice@apps.universal
alice@universal
```

تظل حقول الحساب الصارمة تستخدم معرّفات حساب I105 المعيارية. تعامل مع الأسماء المستعارة بوصفها روابط مقروءة للبشر تُحل إلى معرّفات الحساب المعيارية.

## 8. توفير مساحة بيانات جديدة {#_8-provision-a-new-dataspace}

مساحة البيانات الجديدة هي تغيير في المشغّل والحوكمة. يمكن لنقطة النهاية العامة Torii API توجيه الحركة إلى مساحات البيانات المُكوّنة، لكنها سترفض الأسماء المستعارة لمساحات البيانات غير المعروفة.

قبل إعداد أي تغيير، قم بالتقاط الكتالوج الحالي المباشر:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

لحساب المشغل، تحقق أيضًا من وضع السجل الفني لمسار التنفيذ:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

لا تقم بالترويج لاسم مستعار جديد ما لم تتم مراجعة معرف مسار التنفيذ، ومعرف مساحة البيانات، ومجموعة المحققين، والتسامح مع الأخطاء، والبيان الفني، وقواعد التوجيه، ومالك العمليات معًا. يمكن لحساب مستخدم عادي يملك الأذونات المطلوبة الحصول على نطاق وتأجيره SNS داخل مساحة بيانات موجودة من خلال مخطط الأسماء المستعار؛ ولا يمكنه إضافة مساحة بيانات عامة جديدة بأمان.

للمساحة الخاصة أو المساحة التنظيمية للبيانات، قم بإعداد تغيير في الكتالوج مع:

- اسم مستعار فريد لمساحة البيانات ورقم `id`
- إدخال مسار تنفيذ مطابق أو تعيين مسار تنفيذ موجود
- فضاء البيانات `fault_tolerance`
- قواعد التوجيه للتعليمات أو نطاقات الحساب التي يجب أن تصل إلى هناك
- مستند فني لدليل الفضاء أو دليل تقني مكافئ أو دليل إطلاق، عندما يكشف فضاء البيانات عن قدرات UAID
- الموافقة على الحوكمة للمصادق، والامتثال، وتسوية المعاملات المالية، وسياسة المراقبة

يبدو جزء الإعدادات القابل للمراجعة هكذا:

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

- `iroha3d --sora --config <config.toml> --trace-config` يمرر تكوين العقدة المحلولة
- يتم أرشفة البيان الفني المولَّد أو المراجع مع تجزئات وتواقيع تشفيرية
- اختبارات الدخان تجتاز على Taira قبل أي ترقية لـ Minamoto
- يعرض الكتالوج بعد التغيير `/status` مسار التنفيذ المقصود ومساحة البيانات
- `iroha app nexus lane-report --summary` لا يبلغ عن فقدان المستندات الفنية المطلوبة

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

قم بترقية نفس مساحة البيانات إلى Minamoto فقط بعد اكتمال نشر Taira، واختبارات الدخان، والمراقبة، وأدلة الحوكمة.

## صفحات ذات صلة {#related-pages}

- [تثبيت Iroha 3](/ar/get-started/install-iroha.md)
- [شغّل Iroha 3 عبر CLI](/ar/get-started/operate-iroha-via-cli.md)
- [رسوم الراعي لمساحة بيانات خاصة](/ar/get-started/private-dataspace-fee-sponsor.md)
- [Torii API نقاط النهاية](/ar/reference/torii-endpoints.md)
- [مرجع بدء البلوكشين](/ar/reference/genesis.md)
