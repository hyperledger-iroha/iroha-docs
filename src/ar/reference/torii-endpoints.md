---
translation_locale: ar
translation_source: /reference/torii-endpoints.md
translation_source_hash: 6ee65d409642c79bea0f2c4ff0d8cd59b0ec0a29e115225045786d0816e8a6a7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii النقاط النهائية {#torii-endpoints}

Torii هو HTTP, SSE, و WebSocket بوابة Iroha 3. إنه يخدم كلتا
التوجه إلى الكتيب APIs و نقاط نهاية المشغل

قواعد البروتوكول الحالية هي:

- النموذج الثنائي القنوني هو **Norito**
- العديد من النقاط النهائية تدعم أيضا JSON عندما ترسل `Accept: application/json`
- يتم عرض المقاييس في شكل Prometheus

تفاصيل النموذج، وتفاوض المحتوى، وأعلام التخطيط، وشيكات المخطط، و
Norito RPC الإرشاد، انظر [Norito الإشارة](/ar/reference/norito.md).

## النقاط النهائية المشتركة {#common-endpoints}

| النقطة النهائية | تنسيق | الغرض |
| --- | --- | --- |
| `POST /transaction` | Norito | إرسال معاملة موقعة |
| `POST /query` | Norito | إرسال استفسار موقّع |
| `GET /events` | WebSocket | الاشتراك في تدفقات الأحداث |
| `GET /block/stream` | WebSocket | البلوكات الملتزمة بتدفق |
| `GET /peers` | JSON | قائمة الأقران التي كشفت عن Torii |
| `GET /health` | JSON | نقطة النهاية للطاقة الحية الخفيفة |
| `GET /api_version` | JSON | افتراضية API النسخة |
| `GET /status` | JSON | ملخص حالة المستوى العالي للمشغلين |
| `GET /metrics` | (بروميثيوس) | نقطة النهاية لـ Prometheus scrape |
| `GET /schema` | JSON | صورة سريعة لنموذج البيانات التي يقدمها العقدة |
| `GET /openapi` أو `GET /openapi.json` | JSON | OpenAPI الوثيقة للشخص النشط Torii HTTP الطرق |
| `GET /v1/parameters` | JSON | صورة لمعايير العقدة |
| `GET /v1/node/capabilities` | JSON | قدرة العقد و بيانات البيانات النموذجية |
| `GET /v1/api/versions` | JSON | دعم Torii API الإصدارات |
| `GET /v1/events/sse` | SSE | سلسلة الأحداث للعملاء الذين يعيشون طويلاً |
| `GET /v1/time/now` | JSON | صورة لنقطة الساعة الحائطية |
| `GET /v1/time/status` | JSON | حالة التزامن الوقت |

`/openapi` هو قائمة النقاط النهائية المعتمدة للعقدة التشغيلية.
السطح يعتمد على ميزات البناء وتكوين وقت التشغيل ، وبالتالي تم إنشاؤه
يجب على العملاء أن يفضلوا OpenAPI الوثيقة على قائمة الطرق المنسخة يدوياً.
استخدم [Torii API أجهزة التحكم](/ar/reference/torii-api-console.md) لتحميل ذلك على الهواء مباشرة
الوثيقة، الاختبار JSON الطرق، النسخة curl الطلبات، وتوليد رمز العميل من
النظام الحالي.

## جربوا الحياة Taira الطرق {#try-live-taira-routes}

الجمهور Taira شبكة الاختبار تعرض نفس Torii JSON سطح هذا التطبيق
العملاء يستخدمونها لاستكشاف القراءة فقط. هذه الأوامر لا تتطلب المفاتيح:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

جرب المصدر يقرأ ضد حالة العالم الحالية:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

إذا عاد مسار شبكة اختبار عامة `502`, أوقات خارج، أو تقارير
صف، معالجته كمسألة توافر نقطة النهاية ومحاولة مرة أخرى في وقت لاحق قبل
إزالة شفرة عميلك.

## الإجماع والنقاط النهائية في وقت التشغيل {#consensus-and-runtime-endpoints}

| النقطة النهائية | تنسيق | الغرض |
| --- | --- | --- |
| `GET /v1/sumeragi/commit-certificates` | JSON | ملخصات شهادات الالتزام الأخيرة |
| `GET /v1/sumeragi/validator-sets` | JSON | تاريخ تعيين المحقق |
| `GET /v1/sumeragi/validator-sets/{height}` | JSON | المحقق يحدد على ارتفاع كتلة |
| `GET /v1/sumeragi/status` | Norito أو JSON | صورة مفصلة عن حالة الإجماع |
| `GET /v1/sumeragi/status/sse` | SSE | تدفق حالة الإجماع المستمر |
| `GET /v1/sumeragi/leader` | JSON | المعلومات الحالية عن القائد |
| `GET /v1/sumeragi/qc` | Norito أو JSON | آخر ملخص لشهادة الحكم |
| `GET /v1/sumeragi/checkpoints` | JSON | ملخص نقطة التفتيش المتفق عليها |
| `GET /v1/sumeragi/consensus-keys` | JSON | مفاتيح الإجماع النشطة |
| `GET /v1/sumeragi/bls_keys` | JSON | النشطة BLS مفاتيح الإجماع |
| `GET /v1/sumeragi/phases` | JSON | أحدث عينة تأخر لكل مرحلة |
| `GET /v1/sumeragi/rbc` | JSON | RBC قياسات الجلسة والإنتشار |
| `GET /v1/sumeragi/rbc/sessions` | JSON | النشطة RBC صورة مفاجئة للجلسة |
| `GET /v1/sumeragi/pacemaker` | JSON | حالة جهاز تحديد ضربات القلب |
| `GET /v1/sumeragi/params` | JSON | الحالي على السلسلة Sumeragi المعايير |
| `GET /v1/sumeragi/collectors` | JSON | صورة سريعة لمخطط المجموعة التحديدية |
| `GET /v1/sumeragi/key-lifecycle` | JSON | حالة دورة الحياة الرئيسية للاتفاق |
| `GET /v1/sumeragi/telemetry` | JSON | صورة عن بعد للاتفاقية |
| `GET /v1/sumeragi/evidence` | JSON | سجلات الأدلة، يتم تصفية اختياريًا بواسطة سلسلة استفسارات |
| `GET /v1/sumeragi/evidence/count` | JSON | عدد سجلات الأدلة |
| `POST /v1/sumeragi/evidence/submit` | JSON | تقديم دليل على توافق |
| `GET /v1/sumeragi/commit_qc/{hash}` | Norito أو JSON | الالتزام QC سجل لـ "block hash" |
| `GET /v1/runtime/abi/active` | JSON | وقت تشغيل نشط ABI المصطلح |
| `GET /v1/runtime/abi/hash` | JSON | وقت تشغيل نشط ABI الحشيش |
| `GET /v1/runtime/metrics` | JSON | صورة لمقاييس التشغيل |
| `GET /v1/runtime/upgrades` | JSON | قائمة تحديث الوقت التشغيلي |
| `POST /v1/runtime/upgrades/propose` | JSON | اقترح تحديث وقت تشغيل |
| `POST /v1/runtime/upgrades/activate/{id}` | JSON | تنشيط تحديث وقت التشغيل المقترح |
| `POST /v1/runtime/upgrades/cancel/{id}` | JSON | إلغاء الترقية المقترحة للوقت التشغيلي |

## التطبيق و SORA عائلات الطريق {#app-and-sora-route-families}

عندما Torii يتم بناؤه مع مجموعة من الميزات التي تواجه التطبيق ، فإنه يعرض إضافية JSON
العائلات للمستكشفين SORA الخدمات، التدفقات الجسرية، الأدلة، والتخزين.
ليس كل العائلات تمكينة على كل ملف تعريف شبكة.

| عائلة الطرق | الغرض |
| --- | --- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*` | JSON القراءة، المساعدون في الاستفسار، مساعدة الإدخال، ومشاهدة محفظة أو حامل |
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*` | NFT, الأصول في العالم الحقيقي، ومشاهدة الأصول السرية |
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` | الاسم، الأسماء الخفيفة، وحل التعرف |
| `/v1/explorer/*` | ملاحظات الحساب والمصدرات والكتل والمعاملة والتعليمات والمقاييس وتدفقات المستخدمين |
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*` | تاريخ المعاملات، استرداد خط الأنابيب أو وضعها، و ISO 20022 مساعدين |
| `/v1/contracts/*` | رمز العقد، النشر، الحزمة، المكالمة، الرؤية، الحدث، النشاط، التدفق، والطرق الحكومية |
| `/v1/multisig/*`, `/v1/controls/*` | المقترحات والموافقات والمساعدين على التحكم في النقل |
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*` | النهائية، إثبات الحالة، إثباط الكتل، احتفاظ الأدلة، وسائط استفسار الأدلة |
| `/v1/da/*` | استهلاك إمكانية توفير البيانات، والإبلاغات، وسياسات الدليل، والتزامات، ومقصودها |
| `/v1/zk/*` | ZK الجذور، التحقق من الأدلة IVM إثبات، احتساب الأصوات، مفاتيح التحقق، سجلات الإثبات، والمرفقات |
| `/v1/gov/*`, `/v1/ministry/*` | مقترحات الحوكمة، أوراق التصويت، دولة المجلس، مساحات الأسماء المحمية، المقترحات على جدول الأعمال، التنفيذ، والتحقيق النهائي |
| `/v1/nexus/*`, `/v1/sccp/*` | Nexus مسار، مساحة البيانات، ومساعدون ضد السلسلة المتقاطعة |
| `/v1/musubi/*` | Musubi قراءة سجل الحزم ومبني التعليمات |
| `/v1/subscriptions/*` | خطط الاشتراك ، دورة حياة الاشتراك، الاستخدام ، ومساعدات التكلفة |
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*` | SoraFS اكتشاف المزودين، إثباتات القدرة، وضع الألواح والخزنة، وتقديم المحتوى العام |
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*` | SoraCloud دورة حياة الخدمات، وتدفقات الحوسبة الخاصة/النموذج، والاكتشاف العام، وتوجيه التطبيقات المضيفة |
| `/v1/connect/*`, `/v1/vpn/*` | Iroha جلسات الاتصال WebSocket النقل VPN الاجتماعات، الملفات الشخصية والإيصالات |
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*` | التطبيق API الالتزامات والحزمة/CID-توجيه المحتوى المدعوم |
| `/v1/operator/*`, `/v1/mcp` | تحديد مصادقة المشغل والشخصية الأصلية MCP JSON-RPC الجسر |
| `/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` | الاستعداد عبر الإنترنت، واتفاقات مخزن، بيانات مجال البيانات، و [RAM-LFE المساعدين](/ar/blockchain/ram-lfe.md#torii-routes) |
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*` | التعاون، شبكة الإنترنت، إشعارات الدفع، وتكاملات الهواتف المباشرة |

## ISO 20022 جسر {#iso-20022-bridge}

Torii يُكشف ISO 20022 جسر تحت `/v1/iso20022/*` عندما يتجه التطبيق
API و تمكين وقت تشغيل الجسر.
ليس له غرض عام ISO 20022 بوابة تصفية، ولكن مجموعة فرعية مدعومة ل
تحويل رسائل الدفع المختارة إلى توقيعات Iroha التحويلات والمتابعة
وضعهم في دفتر التسجيل.

### Torii ISO 20022 النقاط النهائية {#torii-iso-20022-endpoints}

| الطريقة والنقطة النهائية | الغرض |
| --- | --- |
| `POST /v1/iso20022/pacs008` | إرسال FI-إلى ...FI تحويل الائتمان للعملاء وبناء التطابق Iroha تحويل الأصول |
| `POST /v1/iso20022/pacs009` | إرسال FI-إلى ...FI تحويل الائتمان المستخدم PvP أو التمويل النقدي المتعلق بالأوراق المالية |
| `POST /v1/iso20022/pacs002` | تقديم تقرير حالة الدفع |
| `POST /v1/iso20022/pacs004` | تقديم إعلان الدفع |
| `POST /v1/iso20022/camt056` | تقديم طلب إلغاء الدفع |
| `POST /v1/iso20022/sese023` | تقديم تعليمات تسوية الأوراق المالية |
| `POST /v1/iso20022/sese024` | إرسال رسالة حالة تسوية الأوراق المالية |
| `POST /v1/iso20022/sese025` | تقديم تأكيد للتسوية بالأوراق المالية |
| `POST /v1/iso20022/colr012` | إرسال رسالة استبدال الضمان |
| `GET /v1/iso20022/messages/{msg_id}` | قراءة سجل الجسر القنوني لرسالة واحدة |
| `GET /v1/iso20022/audit/messages` | اقرأ إشعار المراجعة |
| `GET /v1/iso20022/messages/{msg_id}/pacs002` | إعطاء حالة الدفع الحالية `pacs.002` XML |
| `GET /v1/iso20022/messages/{msg_id}/pacs004` | إرسال بيان الدفع الجاري `pacs.004` XML |
| `GET /v1/iso20022/messages/{msg_id}/camt029` | إعطاء قرار الإلغاء الحالي `camt.029` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese024` | إعطاء حالة التسوية الحالية `sese.024` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese025` | إرسال تأكيد التسوية الحالية `sese.025` XML |

`pacs.008` يجب أن تقدم الرسالة ID, التسوية بين البنوك
المبلغ، العملة، تاريخ التسوية، الدائن والمدين IBANs, و المدين
الدائن BICs. عندما يتم تشكيل بيانات مرجعية، فإن الجسر يتحقق أيضا من
BIC, IBAN, و ISO 4217 عبور العملات قبل الصفقة التي تم إنشاؤها
يدخل خط الأنابيب

`pacs.009` يجب أن توفر الرسالة التجارية ID, تعريف الرسالة
ID, وقت إنشاء، مبلغ التسوية بين البنوك، العملة، تاريخ التسوية.
الوكيل الذي يقدم التعليمات BICs, و المدين والمدين IBANs. إذا كان
الرسالة تتضمن `Purp`, الجسر يقبل حالياً تمويل للأوراق المالية
فقط: `Purp=SECU`.

(الـ) `pacs.008` و `pacs.009` نقطة النهاية للإرسال تقبل XML ISO غلافات أو
شكل الحقل المسطح المستخدم في اختبارات الجسر. `SplmtryData` الحقول
يمكن أن يضع الهدف Iroha الحساب الرئيسي والمصدر والهدف IDs أو العناوين،
وتعريف الأصول ID. الإجابة هي `202 Accepted` مع `message_id`,
`transaction_hash`, `status`, `pacs002_code`, والحكم المقرر
سياق الكتيب/الحساب/الأصول.

### دعم إضافي لتحليل الخرائط {#additional-parser-and-mapping-support}

(الـ) IVM ISO المساعد أيضا يؤكد ويمثل الرسالة التالية
العائلات للتحقق من الملفات، ورسم خرائط المستوطنات، أو أسفل النهر
المصالحة، لا تمتلكها وحدها Torii الطرق

| عائلة الرسائل | الدعم الحالي |
| --- | --- |
| `head.001` | التحقق من صداقة عنوان طلبات الأعمال ISO المغلفات، بما في ذلك `BizMsgIdr`, `MsgDefIdr`, وقت الإنشاء، والمرسل/المستلم الاختياري BIC الحقول |
| `pacs.007`, `pacs.028`, `pacs.029` | عكس المدفوعات، طلب الحالة، وحل التحقيق/تحليل الحالة |
| `pain.001`, `pain.002` | البدء في دفع العميل وتصديق تقرير حالة الدفع |
| `camt.052`, `camt.053`, `camt.054` | تقرير الحساب، وإصدار البيانات، وتحقق من المصادقة على الإخطار |

## Kaigi الجلسات {#kaigi-sessions}

Kaigi توفر غرف صوتية/فيديو مدفوعة الأجر في الوقت الحقيقي SORA Nexus. استخدمه عندما
يتطلب التطبيق إنشاء جلسة مدعومة بحسابات الكتب، وتغيير القائمة، والترسل
المشاريع، الإشارات المشفرة، ومقياس الاستخدام بدلا من الحفاظ على كل
المؤتمرات خارج السلسلة

دورة الحياة التي تتعامل مع الكتب الرئيسية هي:

- `CreateKaigi`: إنشاء دعوة تحت النطاق وتخزين سياسةها،
  الموعد، البيانات المتعددة، وخطاب الإرسال الاختياري.
- `JoinKaigi` و `LeaveKaigi`: تحديث قائمة المكالمات في وضع خاص
  المشاركون يستخدمون الالتزامات والإبطالات و إثبات القائمة بدلاً من
  حساب المشاركين IDs مباشرةً
- `RecordKaigiUsage`: إضافة مدة القياس ومجموعات الغاز.
- `EndKaigi`: إغلاق الجلسة وتسجيل العلامة الزمنية النهائية

Torii يعرّف التلفزيون الرصيف تحت `/v1/kaigi/relays`,
`/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, و
`/v1/kaigi/relays/events` عندما تطبيق API و تمكين ميزات التلفاز
حالة الجلسة تعكس من خلال Kaigi أحداث المجال مثل
`KaigiRosterSummary`, `KaigiRelayManifestUpdated`,
`KaigiRelayHealthUpdated`, و `KaigiUsageSummary`.

### CLI اختبار الدخان {#cli-smoke-test}

ابدأ من `iroha kaigi` CLI عندما تريد التحقق من أن Torii نقطة النهاية
تقبل Kaigi المعاملات قبل ربط UI. أمر البدء السريع
يخلق غرفة مؤقتة ضد النشط Torii النقطة النهائية وتطبيق ملخص
مع معرف المكالمة، انضم إلى القيادة، و SoraNet إشارة لـ (سبول):

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

لتدفقات المخططات، إدارة دورة حياة الغرفة صراحة:

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

الاستخدام `--room-policy public` للأغراض التي قد تُعرض بها الروايات دون مشاهدة
التذاكر، أو `--room-policy authenticated` عندما يجب أن تتطلب المشاهد الخروج
التصديق. `--privacy-mode zk-roster-v1` فقط بعد أن تكون الشبكة
الموقع Kaigi المفاتيح التي تثبت القائمة واستخدامها مرتبة؛ وإلا يلتحق، يترك،
وتفشل سجلات الاستخدام الخاصة أثناء التحقق من التحديد.

### الاختبار مع JavaScript التجربة {#testing-with-the-javascript-demo}

استخدم
[سوراميتسو/إيروها-ديمو-جافاسكريبت](https://github.com/soramitsu/iroha-demo-javascript)
عرض سطح المكتب لتجربة محفظة نهاية إلى نهاية.
التطبيق الذي يتحدث مباشرة إلى Torii عبر المحلية `@iroha/iroha-js`
ملزمة وتشمل `/kaigi` الطريق لوسائط متصفح محلية واحدة إلى واحدة.

استخدم التجربة مع
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
من Iroha مخزن المصدر. SDK من خلال
`file:../iroha/javascript/iroha_js`, لذا إبق كلتا الصرافين في هذا الإخوة
التخطيط:

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

الاستخدام Node.js 20 أو أحدث و Rust سلسلة الأدوات حتى الأصلي `iroha_js_host`
يمكن أن يُبني الوحدة إعادة بناء SDK في الأخوة Iroha التسجيل بعد التغيير
مصدرها؛ تخطيط الحزمة النظيفة لا يحتوي على مساحة العمل الشحن
مطلوبة من `npm run build:native`.

للاختبار المتحكم، توجيه التجربة إلى Kaigi- قادرة Torii النقطة النهائية:

1. أبدأ Iroha العقدة مع SORA/Kaigi التطبيقات APIs تمكن، أو استخدام
   النقطة النهائية العامة التي تكشف Kaigi السطح الذي تحتاجه
2. تحقق من الوصول الأساسي مع `/health`, ثم تحقق من سطح المسار الحي
   مع `/openapi` أو `/openapi.json`. بعض عمليات التنفيذ تعرض أيضا
   `/v1/health`, لكن `/health` هو فحص الحياة المحمولة.
3. ل: TAIRA, التحقق من طرق تقنية الرصيف قبل تجربة اجتماع مباشر:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

   هذه التحققات تثبت أن Torii و Kaigi الوسائط التلفزيونية المتواصلة يمكن الوصول إليها
   لا تخلق اجتماعاً؛ `CreateKaigi` و `JoinKaigi` لا يزال يحتاج إلى تمويل
   المحافظيات وتقديم المعاملات الموقعة.
4. افتح التجربة، اذهب إلى **الإعدادات**, إعداد Torii URL, وترك التطبيق يحمل
   السلسلة ID ومرجع الشبكة من نقطة النهاية.
5. قم بإنشاء أو استعادة محليين محليين في التجربة. استخدم نوافذ تطبيق منفصلة،
   الملفات الشخصية، أو الآلات حتى مضيف والضيف لديهم حالة محفظة منفصلة.

لاختبار Kaigi UI:

1. في النافذة المضيفة، مفتوحة **Kaigi**, اختر **ابدأ الاجتماع**, وضع عنوان،
   و اختر **دعوة خاصة** أو **الدعوة الشفافة**.
2. إختيار **إشغلي الكاميرا والميكروفون** إذاً WebRTC لديه وسائل إعلام محلية
3. إختيار **إنشاء رابط اجتماع**. محفظة حية تقديم `CreateKaigi`; الموقع
   التطبيق بعد ذلك يظهر `iroha://kaigi/join?call=...&secret=...` دعوة و
   `#/kaigi?...` الطريق للعودة
4. أبق نافذة المضيف مفتوحة وشارك الدعوة مع الضيوف.
5. في نافذة الضيوف، افتح الدعوة أو ضعه **انضم إلى الاجتماع**, التحول
   على وسائل الإعلام المحلية، والتحديد **انضم إلى الاجتماع**. محفظة حية تجلب
   عرض المضيف المشفر من Torii و يقدم `JoinKaigi` مع تشفير
   الإجابة على البيانات المعدنية.
6. يجب على المضيف تطبيق الإجابة الأولى تلقائيًا عن طريق البث أو الاستطلاع Kaigi
   إشارات المكالمة. يجب أن تظهر كل من النوافذ الإعلام المتصلة وتحديث
   تفاصيل الاتصال.
7. إنهاء الجلسة من المضيف، أو استخدام CLI `iroha kaigi end` القيادة
   نفس المكالمة ID.

خاصة Kaigi احتياجات محمية XOR دفع رسوم الدخول الخاصة.
التقارير التجريبية Kaigi احتياجات محمية XOR, استخدم التطبيق
تحذير الذاتي وتجربة مرة أخرى لإنشاء أو الانضمام إلى العمل.
التمويل الخاص، أو الإشارة المباشرة غير متوفرة، يمكن أن تنخفض الاكتشاف إلى
التدفق الشفاف/اليدوي في هذه الحالة، مفتوح **الإشارات المتقدمة**, النسخة
عقد أو إجابة خامة، ورسمها في النافذة الأخرى.

للتحقق الآلي في إعادة التأمين التجريبي، قم بتشغيل:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

الغطاء المركزية Vitest Suites Kaigi إنشاء رابط اجتماع، دعوة صغيرة
التحميل، مكالمات الجسر الخاصة لإنشاء/الاندماج/انتهاء، إشارات الحماية الذاتية، دليل
والإجابة على الاستطلاعات. UI اختبار الدخان يشمل `/kaigi` الطريق
على سطح المكتب والحافلات المحمولة.
يحتاج إلى اختبار يدوي مع نافذة اثنتين لأن إذنات الكاميرا / الميكروفون المتصفح
وتتعلق وسائل الإعلام ذات الصلة بالبيئة.

للكود التكامل في العينة، انظر
[مدمج Kaigi في JavaScript التطبيق](/ar/guide/tutorials/kaigi.md).

## الحالة والمقاييس {#status-and-metrics}

النقاط النهائية للحالة والمقاييس هي أول شيء يتم توصيله إلى لوحة التحكم:

- `/status` يعرض حقل الأقران والحدود والصفوف والاتفاق على المستوى الأعلى
- `/metrics` يعرّف على عدادات (prometheus) ومقياسات (meters) و (histograms)

على Nexus-المعقدات تمكين، إنتاج الحالة يشمل أيضا الممر والمساحة البيانية واعية
القسمات. `nexus.enabled = false`, هذه القسمات تم حذفها.

## JSON بمقابل Norito {#json-vs-norito}

عدة نقطة نهاية للمشغلات تعود Norito افتراضيًا. عندما يدعم النقطة النهائية
JSON, إرسال:

```http
Accept: application/json
```

هذا مفيد بشكل خاص ل:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

عندما تقبل نقطة نهاية أو تعود Norito مباشرة، الاستخدام
`application/x-norito` كنوع المحتوى أو المفضل `Accept` القيمة.
[Norito](/ar/reference/norito.md#torii-and-norito-rpc) تفاصيل النقل

## الملفات الشخصية للتليميتر {#telemetry-profiles}

تعتمد مرئية النقطة النهائية على إعدادات التليومترية.
خمسة مستويات:

| الملف الشخصي | `/status` | `/metrics` | طرق المطورين |
| --- | --- | --- | --- |
| `disabled` | لا | لا | لا |
| `operator` | نعم | لا | لا |
| `extended` | نعم | نعم | لا |
| `developer` | نعم | لا | نعم |
| `full` | نعم | نعم | نعم |

## CLI الإختصارات {#cli-shortcuts}

(الـ) `iroha` CLI يحتوي بالفعل على العديد من هذه النقاط النهائية:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## الإشارات المتقدمة {#upstream-references}

- [README API وإطلالة الملاحظة](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 تنفيذ الجسر](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [الأداء والمقاييس](/ar/guide/advanced/metrics.md)
