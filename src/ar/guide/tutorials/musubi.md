---
translation_locale: ar
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama حزم {#musubi-kotodama-packages}

Musubi هو مدير الحزم في الإصدار الأول للحزم المصدرة ل Kotodama. إنه يحل الرسم البياني الدقيق للاعتماد على السلسلة، ويحقق SoraFS . أرشيف المصدر، يقوم بتجميع واختبار مساحة العمل المختارة، وبناء أرشيف CAR القنوني، ونشر إصدارات لا تتغير من خلال Iroha.

استخدم Musubi عندما تحتاج إلى:

- نشر مكتبات وظيفة Kotodama قابلة لإعادة الاستخدام.
- ضع الرسم البياني الانتقالي الدقيق في `Musubi.lock`
- إعادة تشكيل مصدر الاعتماد من الالتزامات المكتملة SoraFS
- بناء واختبار حزمة واحدة أو مساحة عمل متعددة الحزم
- تفتيش، ونشر، سحب، الحفاظ على، أو مستعارة حزم من خلال السجل على سلسلة

## أسماء الحزمة {#package-names}

تحديدات الحزم القنونية تستخدم:

```text
namespace/package
```

إضافة تعريفات الإصدار الدقيقة نسخة:

```text
namespace/package@version
```

لا توجد قائمة `@` قبل مساحة الأسماء. المساحة الاسمية هي إما جذور مساحة البيانات مثل `universal` أو مساحة بيانات مؤهلة للمجال مثل `dex.universal`. يربط دفتر التسجيل مساحة أسماء هيكلية إلى مساحة للبيانات المنزلية المستقرة واحدة قبل أن يتم المطالبة بالحزمة .

## المعلن وملف القفل {#manifest-and-lockfile}

تستخدم الحزمة مخطط الإصدار الأول `Musubi.toml` المغلق. يجب أن يعلن المخطط عن إصدار `manifest-version = 1` و Kotodama `"1"` ، وإصدار IVM ABI `1` ؛ لا توجد طريقة بديلة في المخطط أو ABI.

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

يمكن أن تستخدم الإصدارات الدقيقة، أو متطلبات الحرص أو التدفق، والبطاقات البرية مثل `1.*` ، ومجموعات مقارنة منفصلة عن المقاطع مثل `>=1.0.0,<2.0.0`. مفتاح جدول الاعتماد هو مستعار الاستيراد المحلي الأولي؛ و`package` هو دائما اختيار السجل القنوني.

`Musubi.lock` يربط الرسم البياني بالشكل الدقيق المستمد من الجينيز `NetworkId` وإصدار مفاجئ للتسجيل النهائي. يسجل جذور مساحة العمل المختارة وعقدات الإفراج غير المتغيرة، بما في ذلك الإفراج، المصدر، واجهة، أرشيف، ABI، والالتزامات الدقيقة حافة الاعتماد. تسمح بالإصدارات المتوازية عندما يتطلبها الرسم البياني المحل.

## تشكيل Taira SoraFS التقاط {#configure-taira-sorafs-fetching}

Taira هي شبكة اختبار عامة لهذا التدفق العمل. تبدأ من تكوين عميل Taira مع هوية السلسلة والشبكة المسجلة، ثم أضف الارتباطات الموثقة التي تحدد مزودها أدناه. يجب أن تبقى مادة توقيع الحساب ومفاتيح مشغل المزود في ملفات وقت التشغيل التي يستخدمها المالك فقط.

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

اكتشف مزودي Taira المعتمدين من الجذر العام للشبكة الاختبارية:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

توفر كتالوج المزود هويات المزود والنقاط النهائية الإعلانية. احصل على إذن المشغل المتطابق من المزود المختار. يستخدم وقت التشغيل هذه المفتاح لطلب رموز التدفق المحدودة؛ فإن الرموز ليست حجج CLI أو محتوى ملف القفل.

لا تستخدم Taira خطة التحقق URL كما `url`. المحققون المسجلين مدمجون SoraFS التخزين معطل. `https://taira-validator-{1,2,3,4}.sora.org` النقاط النهائية تقبل تسجيل اللوحة، في حين أن قراءات الأرشيف تستخدم الجهاز المعتمد المحدد HTTPS الأصل.

## تدفق العمل المحلي {#local-workflow}

من جذور مساحة العمل Iroha المتقدمة ، قم بإنشاء أو إدخال دليل الحزم وتشغيل Musubi من خلال Cargo:

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

`fetch` يصلح الرسم البياني النهائي للسجل ، التحديثات `Musubi.lock` عندما يسمح بذلك ، ويملأ التخزين المحلي الذي لا يتغير من الموثق SoraFS المواقع `check`, `build`, `test`, و `package` يقومون بنفس التحقق من الرسم البياني والكاش قبل العمل الخاص بهم.

استخدام `--locked` لرفض أي تغيير في ملف القفل. استخدم `--offline` فقط عندما يكون مؤشر السجل وجميع الأرشيفات المطلوبة مخزنًا مسبقًا. `--frozen` يجمع بين هذين القيودين. فشل التخزين الخارجي؛ Musubi لا يكتب أبدا ملف قفل غير حل.

يتم ربط مصادر الاعتماد عن طريق إعادة كتابة الدعوات المؤهلة مثل `math::add()` إلى أسماء داخلية تحديدية Kotodama. يتم رفض دعوة الاعتماد إلى وظيفة غير المصدرة. تعرض المكتبات المستوردة للوظائف؛ لا تزال أهداف المحلية `[[contract]]` و `[[test]]` أهداف حزمة صريحة.

## التحقق من الكاشة وإصلاحها {#cache-verification-and-repair}

أوامر التخزين العامة تعمل على أرشيفات غير قابلة للتغيير والتي تلتزم بالتسجيل:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` الحجر الصحي يفسد الأولاد الموثوقين ويقوم بإعادة إرسال أرشيفات دقيقة عندما تسمح به دليل مزود نهائي. Musubi يرفض طفرة حية غير فارغة. استخدم `--dry-run` للتفتيش على المرشحين السري.

## التعبئة والنشر {#packaging-and-publishing}

تحقق من مجموعة الملفات الإيجابية النظيفة قبل كتابة أرشيف، ثم بناء الحزمة القنونية:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` يكتب `target/package/<namespace>-<name>-<version>.car`. (الـ) CAR يربط منشور الحزمة القانونية ، ومنشور الإفراج عن التعبيرات ، وقفل التحقق الدقيق ، شجرة المصدر ، وتحليل الواجهة ، و SoraFS الالتزام بالأرشيف. لا توجد `pack`, `--car-out`, `--sorafs-manifest-out`, أو `--source-plan-out` الأوامر في الإصدار الأول CLI.

المنشور هو تدفق عمل شبكة موقّع، يمكن إعادة تشغيله. يجب أن يحتوي `client.toml` المختارة على روابط الإنتاج `[musubi.publication]` وكذلك الحساب وتكوين الشبكة Taira.

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

الاستخدام `--detach` للعودة بعد أن تكون مذكرة العملية وحدود دخول البذور دائمة. استمر في عملية دائمة مع `publish --resume <operation-id> --config client.toml`. الأضيق `--recover <operation-id>` طريق فقط إعادة تشكيل سيارات جانبية لا يمكن تغييرها المفقودة لمجلة قبل الدخول `--dry-run` أو إعادة تحميل عامة العامة؛ تشغيل `package --list` و `package` لرحلة سابقة محلية

## أسئلة السجل ودورة الحياة {#registry-queries-and-lifecycle}

البحث والتحقق من السجل النهائي مع نفس تكوين العميل Taira:

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

يمنع Yanking إصدارًا لا يتغير من قرارات جديدة بينما تظل القفلات الدقيقة الحالية قابلة للتكرار. اقرأ مراجعة yank الحالية أولاً ، ثم قم بإرسال طفرة مقارنة وتعيين:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

استخدم `unyank` مع نفس الحزمة، والإصدار، وتحديث قراءة حديثة لتحويل هذه الحالة. والإذنات للموقع الأرشيفي. الأسماء الخفيفة العالمية لها تسجيل أسعار خاصة بها، وتاريخ إعادة التوجه، ومراجعات مقارنة وتعيين؛ فهي ليست اختصارات ملكية الحزمة.

## Iroha السطحات {#iroha-surfaces}

يستخدم Musubi تعليمات وإستفسارات الإصدار الأول V1:

|السطح|الغرض|
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |ربط مساحة أسماء بمساحة البيانات المنزلية الثابتة|
|`RegisterMusubiArchiveV1` |سجل التزامات أرشيف المصدر الموثوقة غير المتغيرة. |
|`AddMusubiArchiveLocationV1` |إضافة أو تجديد موقع أرشيف SoraFS أثبت. |
|`PublishMusubiReleaseV1` |المطالبة أو تحديث حزمة ونشر إصدار واحد غير قابل للتغيير. |
|`SetMusubiReleaseYankV1` |مقارنة وتعيين حالة السحب من الإفراج الدقيق.|
|`InviteMusubiPackageMaintainerV1` |بدء تدفق دعوة الدورات الحزمة الصريحة. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |تسجيل أو إعادة استهداف مستعار عالمي يحكم.|
|`AssertMusubiReleaseDigestV1` |تأكد من هضم الإفراج المحدد.|
|`FindMusubiExactPackageV1` |اقرأ حزمة واحدة دقيقة ومراجعاتها.|
|`FindMusubiExactReleaseV1` |اقرأ صورة واحدة دقيقة|
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |الحل أو القائمة المرشحين للإفراج النهائي. |
|`FindMusubiArchiveLocationsV1` |اقرأ مواقع الأرشيف المكتملة المدعومة من مقدم الخدمة. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |اقرأ الهدف الاسمي الحالي أو تاريخه غير المتغير.|

Torii يكشف عن عائلة طريق التطبيق في `/v1/musubi/`. MCP الأدوات تستخدم التيار `iroha.musubi.queries.` و `iroha.musubi.instructions.*` أسماء. [Torii النقاط النهائية](/ar/reference/torii-endpoints.md) و [إشارة استفسار](/ar/reference/queries.md) للشكل الأوسع API خريطة.
