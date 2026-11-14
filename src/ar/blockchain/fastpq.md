---
translation_locale: ar
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ هو مسار إثبات STARK الخاص بـ Iroha للتأثيرات التنفيذية المختارة. لا يُعد بديلاً عن تنفيذ المعاملات العادي أو الإجماع. المعاملات لا تزال قم بتشغيل ISI، IVM، و Sumeragi كالمعتاد؛ يستهلك FastPQ شاهد التنفيذ الحتمي ويحوّل التأثيرات المدعومة إلى دفعات إثبات.

يحتوي تكامل المضيف الحالي على مسارين رئيسيين:

- تحويلات الأصول الرقمية الشفافة التي تم تسجيلها أثناء تنفيذ الكتلة
- أغلفة إثبات AXT في SORA Nexus التي يحمل حقلها `fastpq_binding` ارتباطًا بـFastPQ

## مسار نقل الشاهد {#transfer-witness-path}

التحويلات الرقمية الشفافة تنشئ نسخة منقولة منظمة عندما تقوم التعليمات بتغيير الأرصدة. تقوم النسخة بتسجيل:

- حساب المصدر، حساب الوجهة، تعريف الأصل، والمبلغ
- أرصدة المرسل والمستقبل قبل وبعد التحويل
- الهاش التشفيري لنقطة دخول المعاملة المستخدم كهاش تشفيري للدفعة
- قيمة ملخص تشفير رئيسية للتفويض مشتقة من الحساب المقدم
- قيمة ملخص تشفير بوسيدون للنصوص المفردة دلتا

تستخدم التحويلات الدُفعيّة نصًا واحدًا مع عدة دلتا. في هذه الحالة، تكون قيمة ملخّص التشفير بوسيدون ذات الدلتا الواحدة غير موجودة.

عند إنهاء الكتلة، يقوم Iroha بتجميع هذه النصوص حسب تجزئة التشفير لنقطة الدخول. ثم يحمل شاهد التنفيذ كلاً من حزم النصوص الأصلية ودفعات الانتقال FastPQ المُعدة للمُثبت.

كل دلتا تحويل تصبح صفين انتقاليين:

|صف|شكل المفتاح|القيمة المسبقة|القيمة بعد|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|خصم المرسل| `asset/<asset-definition>/<source-account>`      |رصيد المرسل قبل|رصيد المرسل بعد|
|رصيد المستلم| `asset/<asset-definition>/<destination-account>` |رصيد المستلم قبل|رصيد المستلم بعد|

يتم تطبيع القيم الرقمية إلى وحدات شاهد صحيحة. يتم رفض القيمة لأجل التجميع FastPQ إذا لم يكن بالإمكان تمثيلها كـ `u64` غير سالبة عند المقياس العشري المحدد.

## المدخلات العامة {#public-inputs}

كل دفعة انتقال FastPQ تحمل مدخلات عامة تربط الدليل بالكتلة وسياق التنفيذ:

| إدخال |المعنى|
| ------------- | --------------------------------------------------------------- |
| `dsid` | معرّف مساحة البيانات مرمّزًا في بايتات بترتيب الأقل أهمية أولًا |
| `slot`        |تم تحويل وقت إنشاء الكتلة إلى نانoseconds|
|`old_root`|الجذر الحالة الأصلية المستمدة من شاهد التنفيذ|
|`new_root`|الجذر بعد الحالة مشتق من شاهد التنفيذ|
|`perm_root`|قيمة الالتزام التشفيري لبوسيدون على أذونات الدور النشط|
| `tx_set_hash` |تجزئة مشفرة على المعاملات المصنفة ونقطة الدخول المشغلة بالوقت، التجزئات المشفرة|

يستخدم المضيف مجموعة المعلمات الوحيدة في الإصدار الأول، `fastpq-state-transition-stark-v1`، لهذه الدفعات.

## بروتوكول الإثبات {#proof-protocol}

عناصر التحويل القياسية هي إثباتات DEEP مقنّعة على حقل غولديلوكس مع امتداد من الدرجة 4. تُعرَّف علاقتها الدقيقة ونصّ تبادلها وهندسة استعلاماتها في [عقد بروتوكول FastPQ DEEP](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md) المثبّت.

## ما يتحقق منه المُثبِت {#what-the-prover-checks}

قبل بناء التتبع، يقوم المبرهن FastPQ بتوحيد ترتيب الدفعة حسب مفتاح الانتقال، ورتبة العملية، وترتيب الإدراج. تتطلب الصفوف المحوّلة أيضًا بيانات تعريف النص. الدفعة التي تحتوي على صفوف محوّلة ولكن بدون نصوص تحويل تعتبر غير صالحة.

بالنسبة لنقل السجلات الأكاديمية، تشمل الفحوصات من جانب المزود:

- يجب ألا ينخفض رصيد المرسل
- `sender_after` يجب أن يساوي `sender_before - amount`
- `receiver_after` يجب أن يساوي `receiver_before + amount`
- يجب أن يغطي السجل كل صف تحويل في المجموعة
- يجب أن تتطابق قيمة ملخص التشفير بوسيدون دلتا واحدة، عند وجودها، مع صورة مسبقة للنص
- يجب أن يتم فك تشفير الإثباتات الشجرية النادرة المزودة كالإصدار 1؛ المسارات المفقودة يتم ملؤها بإثباتات تركيبية حتمية

يحتوي التتبع على أعمدة محدد للاختيار للصفوف المتعلقة بالنقل، الإصدار، الحذف، منح الدور، سحب الدور، تعيين البيانات الوصفية، والبحث عن الأذونات. كما تحمل الصفوف العمليات الرقمية فروقًا معنونة، فروقًا جارية لكل أصل، وعدادات العرض.

## مسار تنفيذ المثبت {#prover-lane}

`iroha3d` يبدأ مسار تنفيذ FastPQ لمثبت البراهين عند بدء التشغيل إذا كان من الممكن تهيئة واجهة مثبت البراهين الخلفية. مسار التنفيذ هو مهمة تعمل في الخلفية مع قائمة انتظار محدودة. بعد أن ينتج الكتلة شهادة تنفيذ، يقوم مسار إنهاء الإجماع بتقديم مهمة مثبِّت تحتوي على التجزئة التشفيرية للكتلة والارتفاع والرؤية والشهادة.

إذا لم يكن مسار التنفيذ قيد التشغيل أو كانت قائمة الانتظار ممتلئة، يتم تخطي المهمة ويستمر معالجة الكتل العادية. هذا يعني أن مسار تنفيذ المثبت في الخلفية ليس بوابة قبول المعاملات أو الإجماع. إنه مسار إنتاج الإثبات على الحالة التي تم تنفيذها بالفعل.

مسار التنفيذ ينشئ محققًا باستخدام:

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

كلا الإعدادين الافتراضي هو `cpu`. اختيار `gpu` هو طلب صريح بالإغلاق عند الفشل: إذا لم يتم تجميع دعم GPU أو كان GPU المطلوب غير موجود يفشل في الفحص المسبق، تبقى مسار تنفيذ المثبت معطلاً. الإصدار الأول لا يحتوي على قيمة `auto` ولا يتحول من الوضع المطلوب GPU إلى CPU.

## التحقق {#verification}

FastPQ تحقق الإثبات يعيد بناء قيمة الالتزام التشفيري لمجموعة واحدة وفقًا لمعيار البروتوكول ويعيد تشغيل المخطط العام. يقوم المحقق بالتحقق من البروتوكول الإصدار، إصدار مجموعة المعلمات، حدود الإعادة، قيمة الالتزام التشفيري للتتبع، المدخلات العامة، فتحات شجرة ميركل المأخوذة عينياً، فتحات AIR، وسلسلة استعلام FRI.

تشمل حدود إعادة التشغيل الافتراضية:

|حد|افتراضي|
| ------------------ | ------: |
|صفوف الانتقال|     256 |
|حجم دفعة الحمولة|256 KiB|
| FRI طبقات |      16 |
|استفسار عن الوظائف الشاغرة|     128 |

## أغلفة إثبات AXT في SORA Nexus {#sora-nexus-axt-proof-envelopes}

يمكن لأغلفة إثبات AXT في SORA Nexus تضمين `AxtFastpqBinding`. يتطلب التحقق من الكتل لأغلفة AXT، وفحوص مضيف IVM لأغلفة AXT، و`RegisterVerifiedFeeSponsorVaultAllocation` وجود الحقل `fastpq_binding` في الغلاف، ويتحقق كل منها منه مقابل المطالبة المتوقعة، ويستدعي متحقق FastPQ على الغلاف والإثبات المضمّن فيه. يؤدي غياب الارتباط أو فشل التحقق إلى رفض العملية.

### AXT ربط الرياضيات {#axt-binding-math}

بالنسبة إلى أغلفة AXT في SORA Nexus، يُحوّل `AxtFastpqBinding` إلى الصيغة المعيارية قبل إعادة تشغيل الإثبات. تُرفض القيم الفارغة لـ`parameter` أو `verifier_id` أو `verifier_version`؛ ويجب أن يكون معرّف المتحقق `fastpq` والإصدار `v1`، وتستخدم تدفقات AXT المدعومة `fastpq-state-transition-stark-v1`. وتُحذف المسافات المحيطة بنوع المطالبة ويُحوّل إلى أحرف صغيرة.

مدخلات العامة AXT FastPQ هي تجزئات تشفيرية بايتية حتمية:

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

AXT مفاتيح الانتقال هي:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

تدْخِل مطالبة `authorization` صف منح الدور:

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

إضافة إلى صفّ من البيانات الوصفية يربط سياسة التفويض. تُدرج مطالبة `compliance` صفين من البيانات الوصفية: أحدهما للسياسة والآخر لمساحات البيانات المستهدفة.

بالنسبة لـ `tx_predicate` و `value_conservation`، يتم استخدام مقدار تأثير صريح عندما تحتوي الربط على مقدار أصل أو وجهة موجبة. وإلا يقوم الكود باشتقاق مقدار حتمي محدد:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

ثم تُستخدم نفس معادلات الانتقال:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

يتم توليد معرفات حسابات المرسل والمستقبل الاصطناعية من بذور المفاتيح:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

تجزئة التشفير لدفعة التحويل هي:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

قيمة هضم التشفير للكشف الفني للحزمة AXT هي SHA-256 على الترميز Norito لربط بروتوكول المعيار الفردي:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## مجموعات المعلمات {#parameter-sets}

يحتوي الإصدار الأول على مجموعة معلمات قياسية واحدة بالضبط، هي `fastpq-state-transition-stark-v1`. تستهدف أمانًا بمستوى 128 بت على حقل غولديلوكس مع امتداد من الدرجة 4 (`X^4 - 7`)، وتستخدم حجم أثر `2^16`، وحجم LDE يبلغ `2^19`، ودرجة تفرع FRI تساوي 2، ومعامل تضخيم 8، و17 عملية اختزال على الأكثر، و136 استعلامًا.

## تكوين {#configuration}

FastPQ التكوين مدمج ضمن `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false
```

يمكن تجاوز نفس تسميات التنفيذ والتليمتري من `iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

يتم دعم متغيرات البيئة أيضًا في حقول التكوين. وتشمل المتغيرات الخاصة بـ FastPQ ما يلي:

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`

## المقاييس {#metrics}

عند تمكين القياس عن بُعد، يقوم FastPQ بتصدير مقاييس لاختيار الخلفية وسلوك بيئة تنفيذ برنامج Metal:

|متري|المعنى|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |تم طلب وحل وضع التنفيذ بواسطة ملصقات الخلفية والجهاز|
|`fastpq_poseidon_pipeline_total`|مسار سير عمل معالجة برنامج بوسيدون المطلوب والمحلول|
| `fastpq_metal_queue_depth` | حد طابور Metal، والحد الأقصى للعمليات قيد التنفيذ، وعدد عمليات الإرسال، ونافذة أخذ العينات |
|`fastpq_metal_queue_ratio`        |نسبة اشغال وطوابير المعدن والتداخل|
|`fastpq_zero_fill_duration_ms`|مدة ملء الصفر للمضيف في تشغيلات Metal|
| `fastpq_zero_fill_bandwidth_gbps` |عرض النطاق المحصّل بالتعبئة بالصفر|

لتحليل الأداء العام، استخدم هذه مع إشارات الإجماع والطابور المذكورة في [الأداء والمؤشرات](/ar/guide/advanced/metrics.md).

## مرجع ذو صلة {#related-reference}

- [مخطط نموذج البيانات](/ar/reference/data-model-schema.md) لنوع عرض البيانات في لحظة معينة الصادر عن العقدة المصدرة للسلطة
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ خيارات](/ar/reference/iroha3d-cli.md#fastpq-overrides)
