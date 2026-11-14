---
translation_locale: ar
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 98c351372551b08bda4911f52bfb3cc70c53b6125d8045c17abb205b27960f6d
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# التطوير على SORA Nexus باستخدام Taira وMinamoto {#build-on-sora-3-taira-and-minamoto}

تعمل SORA Nexus على Iroha 3. طوّر تطبيقك واختبره أولاً على Taira. لا تنقل إعدادات العميل نفسها إلى Minamoto إلا بعد أن تحصل على مفاتيح مستقلة للشبكة الرئيسية، ورصيد حقيقي من XOR لدفع الرسوم، وموافقة على التشغيل في بيئة الإنتاج.

يوضح هذا الدليل كيفية إعداد عميل Iroha للعمل على الشبكتين العامتين لمنصة SORA Nexus.

- Taira الشبكة التجريبية في `https://taira.sora.org`
- Minamoto الشبكة الرئيسية على `https://minamoto.sora.org`

استخدم Taira للاختبارات التكاملية، وقنابل الاختبار المموّلة من الشبكة التجريبية، وتجارب النشر. استخدم Minamoto فقط للنشاط الجاهز للإنتاج على الشبكة الرئيسية. كلا الشبكتين تفرضان رسومًا بـ XOR:

- Taira يستخدم شبكة الاختبار XOR من خدمة تمويل شبكة الاختبار العامة.
- Minamoto يستخدم XOR الحقيقي. لا توجد خدمة تمويل تجريبية Minamoto.

## مسار البناء {#builder-path}

|خطوة| Taira الشبكة التجريبية| Minamoto الشبكة الرئيسية |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|ابدأ في قراءة حالة الشبكة|استعلام `/status` بدون مفاتيح| تحقّق أولاً من عنوان الخدمة وشهادة TLS |
|اختر فضاء البيانات|استخدم `universal` العام ما لم يكن تطبيقك بحاجة إلى مسار تنفيذ مُدار|استخدم نفس مساحة البيانات فقط بعد الموافقة على الشبكة الرئيسية|
|الحصول على أصل الرسوم|استخدم خدمة تمويل شبكة الاختبار العامة Taira|استلام XOR من حساب Minamoto ممول أو تدفق خزينة معتمد|
| عمليات كتابة اختبارية | استخدم XOR اختباريًا ممولًا من خدمة التمويل | لا تستخدم أدوات الاختبار؛ فعمليات الكتابة تنفق XOR حقيقيًا |
|روّج|احتفظ بمنطق إعادة المحاولة والمراقبة ومعالجة الموقّع التشفيري|استخدم مفاتيح وتمويلات وعناصر تحكم إصدار منفصلة|

التدفق العملي هو:

1. طوّر العميل باستخدام Taira ومساحة البيانات العامة `universal`.
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

في SORA Nexus، يحدد كتالوج مساحات البيانات مساحات البيانات. ويحدد كتالوج مسارات التنفيذ المسارات بصورة منفصلة: يشير كل مسار إلى مساحة بيانات واحدة، ويمكن أن تحتوي مساحة البيانات على عدة مسارات. لا ينشئ العميل مساحة بيانات عامة جديدة بمجرد تغيير `client.toml`. يؤدي إعداد العميل وظيفتين:

1. يوجّه العميل إلى نقطة نهاية Torii الصحيحة
2. يختار سياق الشبكة ومفتاح التوقيع لحسابه المعياري

يكون `AccountId` دائمًا معياريًا ولا يتضمن نطاقًا، ولا يحتوي `client.toml` على إعداد للنطاق: يحدد `[account].profile` فقط بادئة I105 للشبكة. ينتمي سياق النطاق إلى الأسماء المستعارة والكائنات المملوكة للنطاق. ابدأ بمساحة البيانات العامة `universal` لمعظم التطبيقات. يستخدم سياق النطاق الصيغة `domain.dataspace`، مثل:

```text
wonderland.universal
```

إذا احتجت إلى مساحة بيانات مؤسسية جديدة، فأعد اقتراحًا للكتالوج والتوجيه بدلًا من محاولة تسجيلها من حساب عميل عادي. راجع [إنشاء مساحة بيانات جديدة](#_8-provision-a-new-data-space) أدناه.

## 2. فحص نقطة نهاية Torii العامة {#_2-check-the-public-torii-endpoint}

استعلم عن حالة شبكة Taira التجريبية باستخدام `curl` و`jq`. يمكنك إجراء هذا الفحص من دون مفاتيح أو عقدة محلية.

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

افحص عرض مساحات البيانات ومسارات التنفيذ الذي تتيحه العقدة:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

قبل استخدام Minamoto، تأكّد من عنوان خدمة الشبكة الرئيسية لدى المشغّل، وتحقّق من أن شهادة TLS تطابق اسم المضيف.

## Taira MCP للوكلاء {#taira-mcp-for-agents}

Taira يكشف أيضًا عن جسر بروتوكول سياق النموذج الأصلي لـ Torii (MCP) لبيئات تنفيذ برنامج الوكيل. استخدمه عندما يحتاج الوكيل إلى قراءة شبكات اختبار مباشرة، أو تشخيصات مبرمجة، أو بروفة كتابة تمت مراجعتها بدقة دون بناء عميل مخصص لـ Torii أولاً.

|إعداد|قيمة|
| --- | --- |
| نقطة نهاية MCP | `https://taira.sora.org/v1/mcp` |
|جذر الشبكة| `https://taira.sora.org` |
|الاستخدام المقصود|Taira قراءات الشبكة التجريبية وبروفات الكتابة الممولة من الشبكة التجريبية|
| المقابل الإنتاجي | لا توجّه هذا الإدخال إلى Minamoto إلا بعد الموافقة الصريحة على نقطة نهاية MCP للشبكة الرئيسية وضوابط الإصدار |

لا يقبل الجسر إلا طلبات JSON-RPC `POST` عديمة الحالة. افحص بيانات الاكتشاف الوصفية قبل إضافة مواد التوقيع:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
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
3. لا تضف كود بناء المعاملات إلا بعد نجاح الاستدعاءات المخصصة للقراءة فقط على Taira.
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
- رسالة الرفض وما إذا كان الفشل يبدو مرتبطًا بالأذونات أو الرسوم أو التحقق أو حالة قديمة أو إتاحة نقطة النهاية

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

تستعلم هذه الأمثلة عن بيانات Taira للقراءة فقط من دون استخدام مفاتيح الحساب.

اعرض مسارات التنفيذ لمساحات البيانات العامة التي يتيحها Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | select(.visibility == "public")
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

بناء مسبار حالة صغير Node.js للوحة التحكم أو الروبوت أو فحص النشر:

```bash
node --input-type=module <<'EOF'
const response = await fetch('https://taira.sora.org/status', {
  headers: { Accept: 'application/json' },
});
if (!response.ok) throw new Error(`Taira HTTP ${response.status}`);
const status = await response.json();
const publicLanes = status.teu_lane_commit
  .filter((lane) => lane.visibility === 'public')
  .map((lane) => `${lane.alias}@${lane.dataspace_alias}:${lane.block_height}`)
  .join(', ');
console.log(`Taira: ${status.blocks} blocks, ${status.queue_size} queued, public lanes ${publicLanes}`);
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
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

يمثل `chain` في المستوى الأعلى معرّف سلسلة معاملات Taira المحدد بدقة، ويمثل `network_id` هوية الشبكة الدقيقة التي يرتبط بها كل توقيع. اضبط واحدًا بالضبط من `network_id` أو `network_id_file`. يحدد `[account].profile = "taira"` مميّز سلسلة I105 الخاص بـTaira بصورة مستقلة. لا يحدد معرّف السلسلة ملف الحساب.

قم بإجراء فحص للقراءة فقط:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

قم بتشغيل التشخيصات العامة Taira قبل كتابة الاختبارات:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

موّل حساب Taira من خدمة التمويل التجريبي قبل تنفيذ كتابات تدفع رسومًا. يرد تدفق الخدمة ذو مرحلة الإعداد في [الحصول على XOR التجريبي على Taira](#_4-get-testnet-xor-on-taira).

بعد تمويل الحساب، يمكن استخدام تعليمة تسجيل موقّعة كاختبار كتابة أساسي اختياري. تحدد كل معاملة مرسلة دافع رسومها، وتعرض CLI الرسوم الدقيقة قبل التوقيع:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

ينتظر الأمر التأكيد. Taira شبكة تجريبية عامة، ولذلك قد يؤدي تشبع الطابور إلى فشل ping حتى عندما تعمل خدمة التمويل التجريبي نفسها. إذا أبلغ `taira doctor` عن تشبع الطابور أو أعاد ping الرمز `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`، فانتظر وأعد المحاولة قبل اعتبار ذلك خطأ في إعداد العميل.

لاختبارات التشغيل الأساسية دون إشراف، شغّل ping داخل حلقة محدودة لإعادة المحاولة:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

توقف عن إعادة المحاولة إذا أظهر `iroha taira doctor` أخطاء صعبة. تشبع الطابور ورفض قبول الرسوم هي حالات مؤقتة على الشبكة العامة التجريبية؛ أما تشخيصات DNS و TLS و`status = "fail"` فهي ليست كذلك.

## إنشاء معرف حساب SORA Nexus {#generate-a-sora-nexus-account-id}

معرّف حساب SORA Nexus هو عنوان I105 معياري مشتق من المفتاح العام للحساب وبادئة الشبكة المستهدفة. يُرمّز المفتاح العام نفسه إلى معرّفات مختلفة على Taira وMinamoto، وينبغي لمستخدمي الإنتاج توليد زوج مفاتيح منفصل لـMinamoto.

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

استخدم معرّف الحساب الناتج كلما طلبت API أو CLI في SORA Nexus معرّف حساب معياريًا، مثل استعلامات الأرصدة أو حقول الحسابات الصارمة أو روابط الأسماء المستعارة. احتفظ بالمفتاح الخاص المطابق في إعداد العميل، واختر الشبكة العامة نفسها باستخدام `[account].profile = "taira"` أو `[account].profile = "minamoto"`.

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

اطلب XOR التجريبية باستخدام تدفق خدمة التمويل التجريبي ذي مرحلة الإعداد في CLI. تموّل الخدمة الحساب المضبوط في `taira.client.toml` وتسجّله أولًا إذا لم يكن موجودًا. يتألف التدفق من:

1. اقرأ سياسة خدمة التمويل التجريبي العامة: جهة التفويض وأصل الرسوم والمبلغ.
2. أعدّ المطالبة. تحل CLI إثبات العمل، وتتحقق من المعاملة الدقيقة التي يعدّها Torii ويوقّعها، وتحفظها في دليل يوميات خاص دون إرسالها.
3. أرسل المعاملة المحفوظة مرة واحدة.
4. انتظر حتى يصبح رصيد الأصل مرئياً قبل إرسال عمليات الكتابة التي تتطلب دفع رسوم.

اقرأ السياسة:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

الاستجابة لها هذا الشكل:

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

السياسة هي بيانات اكتشاف غير موقعة. يجب على الأتمتة تثبيت صاحب الصلاحية وتعريف الأصل والمبلغ المتوقع بدلاً من الثقة في كل رد. `prepare` يرفض معاملة مُعدة تختلف عن القيم التي تمررها.

قم بإعداد وتقديم المطالبة:

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

ينشئ `prepare` دليل اليوميات بصورة خاصة ويرفض استبدال دليل موجود، لذا استخدم دليلًا جديدًا لكل مطالبة. خدمة التمويل التجريبي خدمة عامة للشبكة التجريبية. إذا أبلغ `submit` عن `Pending` أو انتهت مهلته أو تلقى `502`، فشغّل `taira account faucet resume` بالإعدادات واليوميات نفسيهما بدلًا من إعداد مطالبة أخرى. تجعل مرساة إثبات العمل القديمة `prepare` يفشل؛ وفي هذه الحالة أعد الإعداد في دليل يوميات جديد.

ثم قم بالاستطلاع عن الأصل الممول قبل تقديم معاملاتك الخاصة التي تدفع رسوماً:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

إذا تم تطبيق المطالبة ولكن الأصل غير مرئي بعد، انتظر وأعد محاولة القراءة قبل إرسال عمليات الكتابة.

خدمة التمويل مخصّصة لأموال شبكة Taira التجريبية فقط. لا تستخدم XOR التجريبي أو حسابات خدمة التمويل أو موقّعي اختبار Taira في تدفقات Minamoto.

## 5. إنشاء إعدادات عميل Minamoto {#_5-create-a-minamoto-client-config}

قبل استخدام Minamoto، تأكّد من عنوان خدمة الشبكة الرئيسية لدى المشغّل، وتحقّق من أن شهادة TLS تطابق اسم المضيف.

استخدم زوج مفاتيح منفصل لـ Minamoto. لا تعيد استخدام مفاتيح Taira للشبكة الرئيسية.

إنشاء `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

يمثل `chain` في المستوى الأعلى معرّف سلسلة شبكة SORA Nexus الرئيسية الحالي، ويمثل `network_id` هوية شبكة Minamoto الدقيقة؛ اقرأها من مسار القدرات قبل أول عملية موقّعة. يحدد `[account].profile = "minamoto"` مميّز سلسلة I105 الخاص بـMinamoto؛ ولا يحدده اسم مضيف نقطة النهاية أو معرّف السلسلة ضمنيًا.

حوّل مفتاح عام Minamoto إلى معرف حساب I105 القياسي لبروتوكول واحد مع بادئة الشبكة الرئيسية:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

قم بتشغيل فحوصات جانب القراءة فقط حتى يتم تجهيز الحساب وتمويله من خلال الانضمام إلى الشبكة الرئيسية أو تدفق الحوكمة:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

لا تشغّل أوامر خدمة التمويل التجريبي أو اختبارات التشغيل الأساسية الخاصة بـTaira على Minamoto.

## ٦. تمويل حساب Minamoto بمبلغ XOR {#_6-fund-a-minamoto-account-with-xor}

يتم دفع الرسوم Minamoto بالإنتاج XOR، و Minamoto ليس لديه خدمة تمويل شبكة اختبار عامة. قم بتمويل الحساب المُكوَّن من خلال الانضمام إلى الشبكة الرئيسية المعتمد أو تحويل من الخزينة، أو استلم XOR من حساب Minamoto موجود وممول.

تحقق من معرف الحساب القياسي للبروتوكول الفردي والتمويل من خلال فحوصات للقراءة فقط قبل تقديم كتابة. اعتبر Minamoto XOR أموالاً إنتاجية: قم بتدريب نفس العملية على Taira أولاً، احتفظ بمفاتيح إنتاج منفصلة، ولا تفترض أنه يمكن إعادة تعيين معاملة الشبكة الرئيسية.

Taira XOR لا يمكنه دفع رسوم Minamoto. أرصدة شبكة الاختبار ومطالبات خدمة تمويل شبكة الاختبار لا تنتقل إلى Minamoto.

## 7. العمل داخل مساحة بيانات موجودة {#_7-work-inside-an-existing-data-space}

استخدم أسماء نطاقات مؤهّلة بالكامل لكائنات دفتر السجل الموجودة داخل مساحة بيانات. مثلًا، ينبغي أن يستخدم نطاق مشروع في مساحة البيانات العامة ما يلي:

```text
apps.universal
```

بعد أن يحصل حسابك على الأذونات المطلوبة، قم بإنشاء نية `AliasSetupPlanRequestV1` خالية من الأسرار للنطاق واستخدم المخطط الإعلاني:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

بالنسبة لـ Minamoto، قم بإنشاء واعتماد نية وخطة رئيسية منفصلة للشبكة الرئيسية. الخطط مرتبطة بسلسلتها، والمفوض الرئيسي، والمرتكز على الحالة الحية، والموعد النهائي، لذا لا يمكن ترقية أو إعادة تشغيل خطة Taira:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

تستخدم الأسماء المستعارة للحساب نفس لاحقة مساحة البيانات:

```text
alice@apps.universal
alice@universal
```

تظل حقول الحساب الصارمة تستخدم معرّفات حساب I105 المعيارية. تعامل مع الأسماء المستعارة بوصفها روابط مقروءة للبشر تُحل إلى معرّفات الحساب المعيارية.

## 8. إنشاء مساحة بيانات جديدة {#_8-provision-a-new-data-space}

تتطلب مساحة بيانات جديدة تغييرًا من المشغّلين والحوكمة. يمكن لنقطة نهاية Torii العامة توجيه الحركة إلى مساحات البيانات المضبوطة، لكنها ترفض الأسماء المستعارة المجهولة لمساحات البيانات.

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

لا تعتمد اسمًا مستعارًا جديدًا قبل مراجعة معرّف مسار التنفيذ ومعرّف مساحة البيانات ومجموعة المدققين وتحمل الأعطال والبيان وقواعد التوجيه والمسؤول التشغيلي معًا. يمكن لحساب مستخدم عادي ذي الأذونات المطلوبة الحصول على نطاق وإيجاره SNS داخل مساحة بيانات قائمة عبر مخطط الأسماء المستعارة؛ لكنه لا يستطيع إضافة مساحة بيانات عامة جديدة بأمان.

لمساحة بيانات خاصة أو مؤسسية، أعد تغييرًا في الكتالوج يتضمن:

- اسمًا مستعارًا فريدًا لمساحة البيانات ومعرّفًا رقميًا `id`
- إدخال مسار تنفيذ مطابق أو تعيين مسار تنفيذ موجود
- قيمة `fault_tolerance` لمساحة البيانات
- قواعد التوجيه للتعليمات أو نطاقات الحساب التي يجب أن تصل إلى هناك
- بيانًا من دليل المساحات أو أدلة نشر مكافئة عندما تتيح مساحة البيانات قدرات UAID
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
instruction = "transfer::asset"
description = "Route asset transfers to the payments dataspace"
```

يجب أن تشمل قبول المشغل هذه البوابات:

- `iroha3d --sora --config <config.toml> --trace-config` يمرر تكوين العقدة المحلولة
- يتم أرشفة البيان الفني المولَّد أو المراجع مع تجزئات وتواقيع تشفيرية
- اختبارات الدخان تجتاز على Taira قبل أي ترقية لـ Minamoto
- أن يُظهر كتالوج `/status` بعد التغيير مسار التنفيذ ومساحة البيانات المقصودين
- `iroha app nexus lane-report --summary` لا يبلغ عن فقدان المستندات الفنية المطلوبة

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

لا تنقل مساحة البيانات نفسها إلى Minamoto إلا بعد اكتمال النشر على Taira واختبارات التشغيل الأساسية والمراقبة وأدلة الحوكمة.

## صفحات ذات صلة {#related-pages}

- [تثبيت Iroha 3](/ar/get-started/install-iroha.md)
- [شغّل Iroha 3 عبر CLI](/ar/get-started/operate-iroha-via-cli.md)
- [رعاية رسوم مساحة بيانات خاصة](/ar/get-started/private-dataspace-fee-sponsor.md)
- [نقاط نهاية Torii](/ar/reference/torii-endpoints.md)
- [مرجع بدء البلوكشين](/ar/reference/genesis.md)
