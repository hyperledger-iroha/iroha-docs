---
translation_locale: ar
translation_source: /reference/torii-endpoints.md
translation_source_hash: c23170b2949bae9c9483ecbee6f0c09fea503904ae93934aef56537ddd13c42d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii نقاط النهاية {#torii-endpoints}

Torii هو HTTP, SSE, و WebSocket بوابة Iroha 3. إنه يخدم كلتا الحسابات APIs و نقاط النهاية للمشغلين

القواعد الحالية للبروتوكول هي:

- الصيغة الثنائية الكانونية هي Norito
- العديد من النقاط النهائية تدعم أيضا JSON عند إرسال `Accept: application/json`
- المقاييس المعروضة في شكل Prometheus

للحصول على تفاصيل في الشكل ومفاوضات المحتوى وأعلام التخطيط وشرائح المخطط والإرشادات Norito RPC، انظر إشارة [Norito ](/ar/reference/norito.md).

## النقاط النهائية المشتركة {#common-endpoints}

|النقطة النهائية|تنسيق |الغرض|
| --- | --- | --- |
|`POST /v1/pipeline/transactions` |Norito |تقديم معاملة موقعة |
|`POST /v1/query` |Norito |قم بإرسال استفسار موقّع |
|`GET /v1/events/ws` |WebSocket |اشترك في سلسلة الأحداث |
|`GET /v1/events/sse` |SSE |الاشتراك في تدفقات الأحداث عبر SSE |
|`GET /v1/blocks/stream` |WebSocket |تدفق الكتل الملتزمة |
|`GET /v1/peers` |JSON |قائمة الأقران المعرضة من قبل Torii |
|`GET /livez` |النص |إمكانية العمل على العملية فقط ، لا تعني استعداداً للبروتوكول |
|`GET /readyz` |JSON |الاستعداد الكامل للعقد، بما في ذلك عمليات التحقق الإلزامية من النقود خارج الاتصال |
|`GET /health` |JSON |قناة الاستعداد مع نفس النقود غير المتغيرة خارج الاتصال |
|`GET /v1/api/version` |النص |الإصدار الحالي لرأس الكتل |
|`GET /status` |Norito أو JSON |الوضع التشخيصي على مستوى عال؛ طلب صريح JSON |
|`GET /metrics` |بروميتيوس |نقطة نهاية " بروميتيهوس "|
|`GET /v1/schema` |JSON |صورة سريعة لنموذج البيانات التي يقدمها العقد عندما يتم تشغيلها |
|`GET /openapi` أو `GET /openapi.json` |JSON |وثيقة OpenAPI للطرق النشطة Torii HTTP |
|`GET /v1/parameters` |JSON |صورة مفاتيح العقدة|
|`GET /v1/node/capabilities` |JSON |قدرة العقد و بيانات البيانات النموذجية |
|`GET /v1/time/now` |JSON |صورة لنقطة الساعة الحائطية|
|`GET /v1/time/status` |JSON |حالة مزامنة الوقت |

بالنسبة لطلب SSE ، قم بالإعلان عن التيار الأصلي بالإضافة إلى إرجاع المخطط:

```http
Accept: text/event-stream, application/json
```

يتفاوض Torii أولاً على تمثيل JSON أو Norito في طبقة الطلب ، ثم يؤكد استجابة `text/event-stream` الأصلية. لذلك يتم رفض إرسال فقط `text/event-stream` مع `406` ؛ تستخدم وصفة [ أحداث التدفق](/ar/cookbook/stream-events.md) رأس كامل.

`/openapi` هو العقد الأساسي الذي تم إنشاؤه للطرق الممثلة في النظام، لا يوجد مخزون كامل للقنابل التشغيلية. الوثيقة الحالية تفرغ `/livez` و `/readyz`, و هي `/health` وصف يمكن أن تتأخر معالج الاستعداد. إنشاء عملاء الطريق من الوثيقة الحية، ولكن التحقق من الحيوية والإستعداد مباشرة ضد العقدة الجارية والمعاملين المحاصرين. السطح الدقيق لا يزال يعتمد على ميزات البناء وتكوين وقت التشغيل. [Torii API أجهزة التحكم](/ar/reference/torii-api-console.md) لتحميل الوثيقة الحية، اختبار JSON الطرق، النسخة curl الطلبات، وتوليد رمز العميل من النظام الحالي.

## جرب مسارات Taira مباشرة {#try-live-taira-routes}

تكتشف شبكة الاختبار العامة Taira نفس سطح Torii JSON الذي يستخدمه عملاء التطبيقات لاستكشاف القراءة فقط. هذه الأوامر لا تتطلب المفاتيح: .

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS -H 'Accept: application/json' \
  "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

جرب المصدر يقرأ ضد الحالة العالمية الحالية:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

إذا عادت مسار الشبكة الاختبارية العامة `502` ، وقتاً خارج، أو أبلغ عن صف مكتظ، فاعالجها كمسألة توافر النقاط النهائية ومحاولة أخرى في وقت لاحق قبل إصلاح رمز العميل الخاص بك.

## الإجماع والنقاط النهائية للعمل {#consensus-and-runtime-endpoints}

|النقطة النهائية|تنسيق |الغرض|
| --- | --- | --- |
|`GET /v1/sumeragi/commit-certificates` |JSON |ملخصات شهادات الالتزام الأخيرة |
|`GET /v1/sumeragi/validator-sets` |JSON |المحقق يحدد تاريخ |
|`GET /v1/sumeragi/validator-sets/{height}` |JSON |المحقق يُعيّن على ارتفاع الحجر|
|`GET /v1/sumeragi/status` |Norito أو JSON |صورة مفصلة عن حالة الإجماع|
|`GET /v1/sumeragi/status/sse` |SSE |تدفق حالة الإجماع المستمر |
|`GET /v1/sumeragi/leader` |JSON |المعلومات الحالية عن القائد |
|`GET /v1/sumeragi/qc` |Norito أو JSON |آخر ملخص لشهادة الحكم |
|`GET /v1/sumeragi/checkpoints` |JSON |خلاصة نقاط التفتيش المتفق عليها |
|`GET /v1/sumeragi/consensus-keys` |JSON |مفاتيح الإجماع النشطة |
|`GET /v1/sumeragi/bls_keys` |JSON |مفاتيح الإجماع النشطة BLS |
|`GET /v1/sumeragi/phases` |JSON |أحدث عينة تأخير لكل مرحلة |
|`GET /v1/sumeragi/rbc` |JSON |RBC مقاييس الجلسة والإنتاجية |
|`GET /v1/sumeragi/rbc/sessions` |JSON |صورة سريعة للجلسة النشطة RBC |
|`GET /v1/sumeragi/pacemaker` |JSON |وضع جهاز تحفيز القلب |
|`GET /v1/sumeragi/params` |JSON |المعايير الحالية على سلسلة Sumeragi |
|`GET /v1/sumeragi/collectors` |JSON |صورة لخطط المجموعة التحديدية |
|`GET /v1/sumeragi/key-lifecycle` |JSON |حالة دورة الحياة الرئيسية للاتفاق|
|`GET /v1/sumeragi/telemetry` |JSON |صور تلفزيونية إجماع |
|`GET /v1/sumeragi/evidence` |JSON |سجلات الأدلة، يتم تصفية اختياريًا بواسطة سلسلة استفسارات |
|`GET /v1/sumeragi/evidence/count` |JSON |عدد سجلات الأدلة|
|`POST /v1/sumeragi/evidence/submit` |JSON |تقديم دليل إجماع |
|`GET /v1/sumeragi/commit_qc/{hash}` |Norito أو JSON |إلتزام QC سجل للكتلة hash |
|`GET /v1/runtime/abi/active` |JSON |وصف وقت تشغيل نشط ABI |
|`GET /v1/runtime/abi/hash` |JSON |وقت تشغيل نشط ABI hash |
|`GET /v1/runtime/metrics` |JSON |صورة لمقاييس التشغيل |
|`GET /v1/runtime/upgrades` |JSON |قائمة تحديث الوقت التشغيلي |
|`POST /v1/runtime/upgrades/propose` |JSON |اقترح تحديث وقت التشغيل|
|`POST /v1/runtime/upgrades/activate/{id}` |JSON |تنشيط تحديث وقت التشغيل المقترح |
|`POST /v1/runtime/upgrades/cancel/{id}` |JSON |إلغاء تحديث وقت التشغيل المقترح |

## عائلة App و SORA Route {#app-and-sora-route-families}

عندما يتم بناء Torii مع مجموعة الميزات التي تواجه التطبيق ، فإنه يعرض أسرة إضافية JSON للمستكشفين ، وخدمات SORA ، وتدفقات الجسر ، والأدلة ، والتخزين. هذه العائلات ليست جميعها فعالة على كل ملف تعريف الشبكة.

|عائلة الطرق|الغرض|
| --- | --- |
|`/v1/accounts/` ، `/v1/domains/`، `/v1/assets/*` |JSON القراءة، المساعدين في الاستفسارات، مساعدين في الإدخال، ومشاهدة محفظة أو حاملها |
|`/v1/nfts/` ، `/v1/rwas/`، `/v1/confidential/*` |NFT ، الأصول في العالم الحقيقي، ومشاهدة الأصول السرية |
|`/v1/aliases/`، `/v1/assets/aliases/`، `/v1/sns/`، `/v1/identifiers/` |الاسم، الأسماء الخفيفة، وقرار المحدد |
|`/v1/explorer/*` |ملاحظات الحساب، الأصول، الكتلة، المعاملة، التعليمات والمقاييس، وتدفق المستخدمين المتجهة إلى المستكشف |
|`/v1/transactions/` ، `/v1/pipeline/`، `/v1/iso20022/*` |تاريخ المعاملات، استعادة خط الأنابيب أو وضعها، و ISO 20022 مساعدين |
|`/v1/contracts/*` |رمز العقد، النشر، الحزمة، المكالمة، الرؤية، الحدث، النشاط، التدفق، والطرق الدولة |
|`/v1/multisig/`، `/v1/controls/` |المقترحات المتعددة الأطراف والموافقات ومساعدون في مراقبة التحويلات |
|`/v1/bridge/` ، `/v1/ledger/`، `/v1/proofs/*` |النهائيّة، إثبات الحالة، إثباط الكتل، احتفاظ الأدلة، وطرق استفسار الأدلة|
|`/v1/da/*` |تناول إمكانية توافر البيانات، والإبلاغات، وسياسات الدليل، والالتزامات، ومقصودها. |
|`/v1/zk/*` |ZK الجذور، التحقق من الإثبات، إثبات IVM، احتساب الأصوات، مفاتيح التحقق، سجلات الأدلة، وروابط |
|`/v1/gov/`، `/v1/ministry/` |مقترحات الحكم والتصويت والدولة المجلس ومناطق الأسماء المحمية ومقترحات جدول الأعمال وتنفيذها وإنهاءها |
|`/v1/nexus/`، `/v1/sccp/` |Nexus الشارع، مساحة البيانات، والسلاسل المتقاطعة المساعدين الدليل |
|`/v1/musubi/*` |Musubi قراءة سجل الحزم ومصممي التعليمات |
|`/v1/subscriptions/*` |خطط الاشتراك ، دورة حياة الاشتراك، الاستخدام ، ومساعدات الشحن |
|`/v1/sorafs/` ، `/sorafs/`، `/.well-known/sorafs/*` |SoraFS اكتشاف مزود، إثباتات القدرة، التخزين، استلام المخزن، وتقديم المحتوى العام |
|`/v1/soracloud/`، `/v1/soradns/`، `/soradns/`، `/api/` |SoraCloud دورة حياة الخدمات، وتدفقات الحوسبة الخاصة / النموذج، والاكتشاف العام، وتوجيه التطبيقات المضيفة |
|`/v1/connect/`، `/v1/vpn/` |Iroha جلسات الاتصال ، WebSocket النقل، VPN جلسات ، الملفات الشخصية والإيصالات |
|`/v1/app-api/` ، `/v1/api/`، `/v1/content/*` |التطبيق API الارتباطات والحزمة/CID مدعومة توجيه المحتوى |
|`/v1/operator/*`، `/v1/mcp` |المصادقة على المشغل والجسر الأصلي MCP JSON-RPC |
|`/v1/offline/`، `/v1/repo/`، `/v1/space-directory/`، `/v1/ram-lfe/` |الاستعداد عبر الإنترنت، واتفاقات مخزن المعلومات، بيانات مجال البيانات، ومساعدين [RAM-LFE ](/ar/blockchain/ram-lfe.md#torii-routes) |
|`/v1/kaigi/`، `/v1/webhooks/`، `/v1/notify/`، `/v1/telemetry/` |التعاون، شبكة الويب، إشعارات الدفع، وتكاملات التلفاز المباشر |

## ISO 20022 جسر {#iso-20022-bridge}

Torii يعرض الجسر ISO 20022 تحت `/v1/iso20022/*` عندما يتم تشغيل التطبيق المتحرك API ومرحلة تشغيله للجسر. إنه ليس بوابة تصفية عامة ISO 20022، ولكن مجموعة فرعية مدعومة لتحويل رسائل الدفع المختارة إلى تحويلات Iroha موقعة وتتبع وضعها في دفتر التسجيل.

### Torii ISO 20022 نقاط النهاية {#torii-iso-20022-endpoints}

|الطريقة والنقطة النهائية|الغرض|
| --- | --- |
|`POST /v1/iso20022/pacs008` |تقديم تحويل ائتماني FI إلى FI العميل وبناء تحويل الأصول المتناسبة Iroha |
|`POST /v1/iso20022/pacs009` |تقديم تحويل ائتماني FI إلى FI يستخدم لتمويل PvP أو أموال نقدية مرتبطة بالأوراق المالية |
|`POST /v1/iso20022/pacs002` |تقدم تقريراً عن حالة الدفع|
|`POST /v1/iso20022/pacs004` |تقديم إقرار الدفع |
|`POST /v1/iso20022/camt056` |إرسال طلب إلغاء الدفع |
|`POST /v1/iso20022/sese023` |تقديم تعليمات تسوية الأوراق المالية |
|`POST /v1/iso20022/sese024` |إرسال رسالة عن حالة تسوية الأوراق المالية |
|`POST /v1/iso20022/sese025` |تقديم تأكيد على تسوية الأوراق المالية |
|`POST /v1/iso20022/colr012` |إرسال رسالة استبدال الضمان |
|`GET /v1/iso20022/messages/{msg_id}` |اقرأ سجل الجسر الكنسي لنقل رسالة واحدة|
|`GET /v1/iso20022/audit/messages` |اقرأ إشارة التحقيقات التي تُظهر التلاعب|
|`GET /v1/iso20022/messages/{msg_id}/pacs002` |إرجاع حالة الدفع الحالية إلى `pacs.002` XML |
|`GET /v1/iso20022/messages/{msg_id}/pacs004` |إرسال بيان الدفع الجاري `pacs.004` XML |
|`GET /v1/iso20022/messages/{msg_id}/camt029` |إرجاع قرار الإلغاء الحالي `camt.029` XML |
|`GET /v1/iso20022/messages/{msg_id}/sese024` |إرجاع حالة التسوية الحالية إلى `sese.024` XML |
|`GET /v1/iso20022/messages/{msg_id}/sese025` |إرسال تأكيد التسوية الحالية على `sese.025` XML |

يجب أن يقدم `pacs.008` الرسالة ID، ومبلغ التسوية بين البنوك، والعملة، وتاريخ التسوية، والمديون والمقترفين IBANs، والمدين والمقترفون BICs. عندما يتم تشكيل بيانات مرجعية، فإن الجسر يتحقق أيضًا من معابر العملة BIC، IBAN، و ISO 4217 قبل أن تدخل المعاملة التي تم توليها إلى خط الأنابيب.

`pacs.009` يجب أن توفر الرسائل التجارية ID, تعريف الرسالة ID, وقت الإنشاء، مبلغ التسوية بين البنوك، العملة، تاريخ التسوية، وكيل الأوامر والوكيل المكلف BICs, و المدين و الدائن . IBANs. إذا كانت الرسالة تشمل `Purp`, لا يقبل الجسر حالياً سوى تمويل للأوراق المالية: `Purp=SECU`.

(الـ) `pacs.008` و `pacs.009` نقطة النهاية للإرسال تقبل XML ISO الغلافات أو شكل الميدان المسطح المستخدم في اختبارات الجسر. `SplmtryData` الحقول يمكنها تحديد الهدف Iroha الحساب الرئيسي، والمصدر والهدف IDs أو عناوين، وتعريف الأصول ID. الإجابة هي `202 Accepted` مع `message_id`, `transaction_hash`, `status`, `pacs002_code`, والسياق المحدد للمسجلات الكبرى / الحساب / الأصول.

### دعم إضافي لتحليل الخرائط {#additional-parser-and-mapping-support}

يقوم مساعد IVM ISO أيضًا بتصديق وتحقيق الأسرة التالية من الرسائل للتحقق من الملفات أو خرائط الاستيطان أو المصالحة أسفل النهر. لا تحتوي على طرق مستقلة Torii.

|عائلة الرسائل |الدعم الحالي |
| --- | --- |
|`head.001` |التحقق من صداقة عنوان الطلبات التجارية لمغلفات ISO، بما في ذلك حقل `BizMsgIdr` ، `MsgDefIdr`، وقت الإنشاء، والمرسل/المستلم الاختياري BIC |
|`pacs.007` ، `pacs.028`، `pacs.029` |عكس المدفوعات، طلب الحالة، حل التحقيق / تحليل الحالة |
|`pain.001`، `pain.002` |بدء دفع العميل وتصديق تقرير حالة الدفع |
|`camt.052` ، `camt.053`، `camt.054` |تقرير الحساب، بيان، وصحيحة الإخطار |

## Kaigi جلسات {#kaigi-sessions}

يوفر Kaigi غرف صوتية / فيديو مدفوعة في الوقت الحقيقي على SORA Nexus. استخدمه عندما يحتاج تطبيق إلى إنشاء جلسات مدعومة بحساب كبير ، وتغييرات القائمة ، وإبلاغات الإرسال ، والإشارات المشفرة ، ومقياس الاستخدام بدلاً من الحفاظ على كل حالة المؤتمر خارج السلسلة.

دورة الحياة الموجهة إلى دفتر التسجيل هي:

- `CreateKaigi`: إنشاء مكالمة تحت نطاق وتخزين سياساتها، الجدول الزمني، البيانات الأساسية، وإعلان الإرسال الخياري.
- `JoinKaigi` و `LeaveKaigi`: تحديث قائمة الدعوات. في النظام الخاص، يستخدم المشاركون الالتزامات والإبطالات والدليلات على القائمة بدلاً من كشف حساب المشارك IDs مباشرة.
- `RecordKaigiUsage`: إضافة مدة المقياسات وإجمالي الغاز.
- `EndKaigi`: إنهاء الجلسة وتسجيل العلامة الزمنية النهائية.

Torii يعرّف تلميتر الترسلة تحت: `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, و `/v1/kaigi/relays/events` عندما تطبيق API و تمكين ميزات التليميترية. Kaigi الأحداث المجالية مثل `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated`, و `KaigiUsageSummary`.

### CLI اختبار الدخان {#cli-smoke-test}

تبدأ مع `iroha kaigi` CLI عندما تريد التحقق من أن نقطة نهاية Torii تقبل معاملات Kaigi قبل ربط UI. تخلق أمر البدء السريع غرفة مؤقتة ضد نقطة النهاية النشطة Torii وتطبخ ملخصًا مع معرف المكالمة ، وأوامر الانضمام ، و SoraNet إشارة مدرجة:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

للتدفقات المخطوطة، إدارة دورة حياة الغرفة صراحة:

```bash
iroha kaigi create \
  --domain streaming \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha kaigi join --domain streaming --call-name daily --participant <i105-account-id>
iroha kaigi leave --domain streaming --call-name daily --participant <i105-account-id>

iroha kaigi record-usage \
  --domain streaming \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha kaigi end --domain streaming --call-name daily
```

استخدم `--room-policy public` في الغرف التي قد تتعرض لها الروايات دون تذاكر المشاهد، أو `--room-policy authenticated` عندما يتطلب الخروج تصديق المشاهد. استخدم `--privacy-mode zk-roster-v1` فقط بعد الشبكة لديها Kaigi قائمة ومفاتيح التحقق من الاستخدام تكوين؛ وإلا ينضم، يترك، وسجلات الاستخدام الخاص يفشل أثناء التحقق المحددة.

### الاختبار باستخدام JavaScript Demo {#testing-with-the-javascript-demo}

استخدم [soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) ديمو سطح المكتب لاختبار محفظة نهاية إلى نهاية. التجربة هي تطبيق إلكترون و Vue الذي يتحدث مباشرة إلى Torii من خلال الربط المحلي `@iroha/iroha-js` ويشمل طريق `/kaigi` لوسائط متصفحية واحدة إلى واحد.

استخدم النموذج التجريبي مع [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) من مخزن المصدر Iroha. تقوم بنشر النموذجيات التجريبية من SDK إلى `file:../iroha/javascript/iroha_js`، لذلك حافظ على كلتا الصناديق في هذا التخطيط الأخوي:

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

استخدم Node.js 20 أو أحدث وسلسلة أدوات Rust بحيث يمكن لبناء الوحدة الأصلية `iroha_js_host`. أعيد بناء SDK في الصندوق الأخوة Iroha بعد تغيير مصدرها. لا يحتوي ترتيب الحزمة النظيفة على مساحة العمل Cargo المطلوبة من قبل `npm run build:native`.

بالنسبة للاختبار المسيطر عليه، اشير إلى نقطة نهاية Kaigi قادرة على Torii:

1. قم بتشغيل عقد Iroha مع تمكين تطبيق SORA/Kaigi المتجه إلى APIs ، أو استخدم نقطة نهاية عامة تعرض أسطح Kaigi التي تحتاجها.
2. تحقق من الوصول الأساسي مع `/health` ، ثم تحقق من سطح الطريق المباشر مع `/openapi` أو `/openapi.json`. بعض الانتشارات تعرض أيضًا ل `/v1/health` ، ولكن `/health` هو التحقق من السعة المحمولة.
3. بالنسبة ل TAIRA ، تحقق من طرق التلفاز الترسل قبل تجربة اجتماع مباشر:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

هذه التحققات تثبت أنه يمكن الوصول إلى Torii و Kaigi telemetry الإرسال. فإنها لا تخلق اجتماعا؛ `CreateKaigi` و `JoinKaigi` لا يزال يحتاجون إلى محفظة تمويلية وتسليم المعاملات الموقع.
4. افتح النموذج التجريبي، اذهب إلى الإعدادات، حدد Torii URL، ودع التطبيق يحمل سلسلة ID ومثلي الشبكة من نقطة النهاية.
5. قم بإنشاء أو استعادة محليين محليين في عرض التجربة. استخدم نوافذ تطبيقات منفصلة أو ملفات تعريفية أو أجهزة بحيث يكون لدى المضيف والضيف حالة محفظة منفصلة.

لاختبار Kaigi UI:

1. في نافذة المضيف، افتح Kaigi ، اختر بدء الاجتماع، حدد عنوانًا، واختيار دعوة خاصة أو دعوة شفافة.
2. اختر تشغيل الكاميرا والميكروفون حتى WebRTC لديها وسائل الإعلام المحلية.
3. حدد إنشاء رابط للاجتماع. يقوم محفظة حية بإرسال `CreateKaigi`؛ ثم يظهر التطبيق دعوة `iroha://kaigi/join?call=...&secret=...` وطريق عودته إلى `#/kaigi?...`.
4. أبق نافذة المضيف مفتوحة وشارك الدعوة مع الضيوف.
5. في نافذة الضيوف ، افتح الدعوة أو ضعه في اجتماع الانضمام ، قم بتشغيل وسائل الإعلام المحلية ، و حدد اجتماع الإنضمام. يحصل محفظة حية على عرض المضيف المشفر من Torii ويقدم `JoinKaigi` مع بيانات الجواب المشفرة.
6. يجب على المضيف تطبيق الإجابة الأولى تلقائيًا عن طريق البث أو استطلاع إشارات الدعوة Kaigi. يجب أن تظهر كل من النوافذ وسائل الإعلام المتصلة وتفاصيل الاتصال المحديثة.
7. إنهاء الجلسة من المضيف، أو استخدام CLI `iroha kaigi end` الأوامر لنفس الدعوة ID.

خاصة Kaigi الاحتياجات المحمية XOR لدفع رسوم نقطة الدخول الخاصة. إذا تم الإبلاغ Kaigi الاحتياجات المحمية XOR, استخدم طلب الحماية الذاتية داخل التطبيق ومحاولة عمل إنشاء أو الانضمام مرة أخرى. إذا لم يتم توفير إثباتات أو تمويل خاص أو إشارة مباشرة، يمكن أن يعود التجربة إلى تدفق شفاف / يدوي. في هذه الحالة، افتح الإشارات المتقدمة، ونسخ العرض الخام أو حزمة الإجابة، وألصقها في النافذة الأخرى

للتحقق الآلي في إعادة التثبيت ، قم بتشغيل:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

تغطي جناحات Vitest المركزة إنشاء روابط الاجتماع Kaigi ، وتحميل الدعوة الموحد ، ومكالمات الجسر الخاصة لإنشاء / الانضمام / النهاية ، وإشارات الحماية الذاتية ، والعودة اليدوية ، والاستطلاعات الإجابة. يتضمن اختبار التدخين UI مسار `/kaigi` على أجهزة الكمبيوتر المكتبية والمواقع المرئية بحجم الهاتف المحمول. وسائل الإعلام المباشرة بين محفظتين لا تزال بحاجة إلى اختبار يدوي من نافذة اثنتين لأن إذنات الكاميرا / الميكروفون المتصفح وتدفقات الوسائط ذات الصلة هي محددة للبيئة.

لمعرفة رمز دمج العينات، انظر [مشارك في Kaigi في تطبيق JavaScript ](/ar/guide/tutorials/kaigi.md).

## الحالة والمقاييس {#status-and-metrics}

النقاط النهائية للحالة والمقاييس هي أول شيء يتم توصيله إلى لوحات التحكم:

- `/status` يعرض حقل الأقران والبلوك والصف والموافقة على المستوى الأعلى.
- `/metrics` يعرّف عدادات Prometheus ومقياسات وهيستوجرامات

على العقد Nexus تمكين، وتشمل الخروج الحالة أيضًا أجزاء الممر والمساحة البيانية. عندما يتم حذف `nexus.enabled = false` ، يتم حذف هذه الأجزاء.

## JSON بمقارنة ب Norito {#json-vs-norito}

عدة نقاط نهائية للمشغلات تعيد Norito بشكل افتراضي. عندما تدعم النقطة النهائية JSON، أرسل:

```http
Accept: application/json
```

هذا مفيد بشكل خاص ل:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

عندما تقبل نقطة نهائية أو تعود بتصفية Norito مباشرة، استخدم `application/x-norito` كنوع المحتوى أو قيمة `Accept` المفضلة. انظر [Norito](/ar/reference/norito.md#torii-and-norito-rpc) لمعلومات النقل.

## ملفات تعريف الهواتف {#telemetry-profiles}

تعتمد مرئية النقطة النهائية على إعداد `telemetry.profile` للعقد. يظهر التكوين الحالي خمسة مستويات من الملفات الشخصية:

|الملف الشخصي |`/status` |`/metrics` |طرق المطورين |
| --- | --- | --- | --- |
|`disabled` |لا ..|لا ..|لا ..|
|`operator` |نعم .|لا ..|لا ..|
|`extended` |نعم .|نعم .|لا ..|
|`developer` |نعم .|لا ..|نعم .|
|`full` |نعم .|نعم .|نعم .|

## CLI اختصارات {#cli-shortcuts}

يحتوي `iroha` CLI بالفعل على العديد من هذه النقاط النهائية:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## الإشارات المتقدمة {#upstream-references}

- [README API ومحة عامة للملاحظة ](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 تنفيذ جسر](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [الأداء والمقاييس ](/ar/guide/advanced/metrics.md)
