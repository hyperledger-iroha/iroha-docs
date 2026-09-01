---
translation_locale: ar
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Musubi Kotodama الحزم {#musubi-kotodama-packages}

Musubi هو مدير الحزم للإصدار الأول لحزم المصدر Kotodama. يقوم بحل رسم بياني للاعتمادية الدقيقة على السلسلة، ويصادق على مصدر SoraFS يؤرشف ويجمع ويختبر مساحة العمل المحددة، ويقوم ببناء أرشيفات بمواصفة بروتوكول واحدة CAR، وينشر الإصدارات الثابتة من خلال Iroha.

استخدم Musubi عندما تحتاج إلى:

- نشر مكتبات دوال Kotodama قابلة لإعادة الاستخدام
- تثبيت رسم بياني انتقالي دقيق في `Musubi.lock`
- إعادة بناء مصدر الاعتماد من قيم الالتزام التشفيري للأرشيف النهائي SoraFS
- بناء واختبار حزمة واحدة أو مساحة عمل متعددة الحزم
- تفقد، انشر، اسحب، حافظ، أو استخدم أسماء مستعارة للحزم من خلال السجل على السلسلة

## أسماء الحزم {#package-names}

يستخدم محددات حزمة معيار البروتوكول المفرد:

```text
namespace/package
```

تضيف معرفات الإصدار الدقيقة نسخة:

```text
namespace/package@version
```

لا يوجد `@` مقدم قبل مساحة الاسم. مساحة الاسم هي إما جذر مساحة البيانات مثل `universal` أو مساحة بيانات مؤهلة بالنطاق مثل `dex.universal`. يربط سجل البلوك تشين تلك مساحة الاسم الهيكلية بمساحة بيانات منزلية ثابتة قبل أن يمكن المطالبة بالحزمة.

## البيان الفني وملف القفل {#manifest-and-lockfile}

تستخدم الحزمة مخطط الإصدار الأول المغلق `Musubi.toml`. يجب أن يعلن البيان الفني عن `manifest-version = 1`، إصدار Kotodama `"1"`، ونسخة IVM ABI `1`; لا يوجد بيان فني بديل أو وضع ABI.

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

يمكن للاعتمادات استخدام إصدارات دقيقة، متطلبات القوس أو الموجة، الأحرف الجامحة مثل `1.*`، ومجموعات المقارنات المفصولة بفواصل مثل `>=1.0.0,<2.0.0`. مفتاح جدول الاعتماد هو الاسم المستعار للاستيراد المحلي الأبوي؛ `package` هو دائماً محدد سجل البروتوكول القياسي الفردي.

`Musubi.lock` يربط الرسم البياني بـ `NetworkId` المستمد مباشرة من الأصل ولقطة سجل نهائي. يسجل جذور مساحات العمل المختارة والعقد النهائية للإصدارات، بما في ذلك الإصدار، المصدر، الواجهة، الأرشيف، ABI، وقيم الالتزام التشفيري لحافة الاعتماد الدقيقة. يُسمح بالإصدارات المتوازية عندما تتطلب المخطط المحلّل ذلك.

## تكوين Taira SoraFS جلب {#configure-taira-sorafs-fetching}

Taira هو الشبكة الاختبارية العامة لهذا التدفق العملي. ابدأ من إعدادات عميل Taira مع السلسلة المتاحة حاليا وهوية الشبكة المستمدة من الأصل المثبتة حاليًا، ثم أضف الروابط المصادقة الخاصة بالمزود أدناه. يمكن أن يؤدي إعادة ضبط Taira إلى تغيير `NetworkId`؛ قم بتحديثه من ملف النشر الموقع بدلاً من استنتاجه من السلسلة المستقرة UUID. يجب أن تبقى مواد توقيع الحساب ومفاتيح مشغلي المزود في ملفات بيئة تنفيذ البرمجيات الخاصة بالمالك فقط.

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

اكتشف مقدمي Taira المعتمدين من جذر شبكة الاختبار العامة:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

يقدّم فهرس الموفر هويات الموفر ونقاط النهاية المعلَن عنها API. احصل على تفويض المشغل المطابق من الموفر المختار. يستخدم بيئة تنفيذ البرمجيات هذا المفتاح لطلب رموز التدفق المحدودة؛ الرموز ليست CLI وسائط أو محتوى ملف القفل.

لا تستخدم Taira رمز التحقق URL كـ `url`. المدققون المسجلون قد تم دمجهم SoraFS التخزين معطل. لهم `https://taira-validator-{1,2,3,4}.sora.org` API النقاط النهائية تقبل تسجيل الرقم السري، في حين أن قراءة الأرشيف تستخدم مزود الخدمة المقبول المختار HTTPS الأصل.

## سير العمل المحلي {#local-workflow}

من جذر مساحة العمل Iroha المصدرية، قم بإنشاء أو دخول دليل الحزمة وتشغيل Musubi عبر Cargo:

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch` يحل الرسم البياني للسجل النهائي، ويحدث `Musubi.lock` عند السماح، ويملأ ذاكرة التخزين المؤقت المحلية غير القابلة للتغيير من مواقع SoraFS المصادَق عليها. تقوم `check` و`build` و`test` و`package` بنفس عمليات التحقق من الرسم البياني وذاكرة التخزين المؤقت قبل بدء عملها الخاص.

استخدم `--locked` لرفض أي تغيير في ملف القفل. استخدم `--offline` فقط عندما يكون كل من فهرس التسجيل وكل أرشيف مطلوب مخزنًا مؤقتًا بالفعل. يجمع `--frozen` بين هذين الشرطين. يفشل الفشل في ذاكرة التخزين المؤقت أوفلاين؛ Musubi لا يكتب أبدًا ملف قفل غير محلول.

يتم ربط مصادر الاعتماد عن طريق إعادة كتابة الاستدعاءات الفنية المؤهلة مثل `math::add()` إلى أسماء داخلية حتمية Kotodama. تقنية الاعتماد تم رفض الاستدعاء لوظيفة غير مصدّرة. المكتبات المستوردة تكشف عن الوظائف؛ الأهداف المحلية `[[contract]]` و `[[test]]` تظل أهداف حزمة صريحة.

## التحقق من ذاكرة التخزين المؤقت وإصلاحها {#cache-verification-and-repair}

تعمل أوامر ذاكرة التخزين المؤقت العامة على الأرشيفات غير القابلة للتغيير والمنشورة في السجل:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` يحتجز السلالات الموثوقة الفاسدة ويسترجع الأرشيفات الدقيقة عند السماح بذلك بأدلة المزود النهائية. يتم تقليم البيانات عمداً بطريقة مغلقة عند الطفرات الحية غير الفارغة؛ استخدم `--dry-run` لفحص المرشحين المصنفين.

## التغليف والنشر {#packaging-and-publishing}

افحص مجموعة الملفات الإيجابية النظيفة قبل كتابة الأرشيف، ثم قم ببناء حزمة واحدة وفقًا لمعيار البروتوكول:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` يكتب `target/package/<namespace>-<name>-<version>.car`. يربط CAR حزمة المواصفات الفنية المعيارية للبروتوكول الفردي، والمواصفات الفنية لإصدار الدلالة، وقفل التحقق الدقيق، وشجرة المصدر، قيمة الهضم التشفيري للواجهة، وقيمة الالتزام التشفيري للأرشيف SoraFS. لا توجد أوامر منفصلة `pack`، `--car-out`، `--sorafs-manifest-out`، أو `--source-plan-out` في الإصدار الأول CLI.

النشر هو سير عمل شبكي موقع وقابل للاستئناف. يجب أن يحتوي `client.toml` المحدد على ربط `[musubi.publication]` المطلوب بالإضافة إلى الحساب وتكوين الشبكة Taira. حزّم عضو مساحة العمل واحدًا بالضبط:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

استخدم `--detach` للعودة بعد أن يكون سجل العملية والحدود الأولية للزراعة دائمة. واصل عملية دائمة باستخدام `publish --resume <operation-id> --config client.toml`. المسار الأضيق `--recover <operation-id>` يعيد البناء فقط سجلات مساعدة ثابتة مفقودة لمجلة قبل الدخول نقية. لا يوجد نشر `--dry-run` أو تحميل عام بديل عام؛ شغّل `package --list` و `package` للفحص المحلي قبل الإقلاع.

## استعلامات السجل ودورة الحياة {#registry-queries-and-lifecycle}

ابحث وتفقد السجل النهائي باستخدام نفس تكوين العميل Taira:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

السحب يستبعد إصدارًا ثابتًا من القرارات الجديدة بينما تظل الأقفال الدقيقة الموجودة قابلة للتكرار. اقرأ مراجعة السحب الحالية أولاً، ثم قدم تعديل المقارنة والتعيين:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

استخدم `unyank` مع نفس الحزمة والإصدار والمراجعة المقروءة حديثًا لعكس تلك الحالة. ملكية الحزمة وأدوار المسؤول عن الصيانة تتحكم في النشر والإلغاء والبيانات الوصفية، وأذونات موقع الأرشيف. للأسماء المستعارة العالمية تسجيلها المسعّر الخاص بها، وتاريخ إعادة الاستهداف، ومراجعات المقارنة والتعيين؛ فهي ليست اختصارات ملكية الحزمة.

## Iroha الأسطح {#iroha-surfaces}

Musubi يستخدم تعليمات واستفسارات V1 الإصدار الأول:

|سطح|الغرض|
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `RegisterMusubiNamespaceBindingV1`                   |اربط مساحة الأسماء بمساحة البيانات المستقرة الخاصة بها.|
|`RegisterMusubiArchiveV1`|سجل قيمة التزام تشفيرية لمصدر أرشيف مصادق غير قابل للتغيير.|
| `AddMusubiArchiveLocationV1`                         |أضف أو جدد موقع أرشيف SoraFS المثبت.|
| `PublishMusubiReleaseV1`                             |اطلب أو حدّث حزمة وانشر إصدارًا واحدًا غير قابل للتغيير.|
| `SetMusubiReleaseYankV1`                             |قارن وقم بتعيين حالة النسخة المسحوبة للإصدار الدقيق.|
| `InviteMusubiPackageMaintainerV1`                    |ابدأ تدفق دعوة دور الحزمة الصريحة.|
| `RegisterMusubiAliasV1` / `RetargetMusubiAliasV1`    |سجّل أو أعد استهداف اسم مستعار عام مُدار.|
|`AssertMusubiReleaseDigestV1`|أكد القيمة الدقيقة وغير القابلة للتغيير لهضم التشفير.|
| `FindMusubiExactPackageV1`                           |اقرأ حزمة واحدة بالضبط وتعديلاتاتها.|
| `FindMusubiExactReleaseV1`                           |اقرأ نسخة إصدار واحدة بالضبط.|
| `FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |حل أو سرد المرشحين النهائيين للإصدار.|
| `FindMusubiArchiveLocationsV1`                       |اقرأ مواقع الأرشيف المدعومة من المزود النهائية.|
| `FindMusubiAliasV1` / `FindMusubiAliasHistoryV1`     |اقرأ الهدف الحالي للاسم المستعار أو تاريخه الثابت.|

Torii يكشف عن عائلة مسار التطبيق تحت `/v1/musubi/*`. أدوات MCP تستخدم الأسماء الحالية `iroha.musubi.queries.*` و `iroha.musubi.instructions.*`. انظر إلى [Torii API نقاط النهاية](/ar/reference/torii-endpoints.md) و [مرجع الاستعلام](/ar/reference/queries.md) للخريطة الأوسع API.
