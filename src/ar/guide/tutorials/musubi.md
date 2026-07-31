---
translation_locale: ar
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama الحزم {#musubi-kotodama-packages}

Musubi هو مدير الحزمة لحزم مصدر Kotodama. يمنح المطورين سير عمل يشبه Cargo لمشاركة وظائف Kotodama قابلة للتكوين مع الحفاظ على هوية الحزمة مرتبطة بمساحات أسماء SORA و Iroha بدلاً من جدول الأسماء العالمي الأول الذي جاء.

استخدم Musubi عندما تحتاج إلى:

- نشر مكتبات المصدر Kotodama قابلة لإعادة الاستخدام
- تعتمدات مصدر انتقالية دقيقة في `Musubi.lock`
- إعادة تشكيل مصدر الاعتماد على التزامات أرشيف SoraFS المحققة.
- ربط مساحة أسماء الحزمات إلى مستعار عقد dapp في نفس مساحة الأسماء
- تفتيش، ونشر، سحب، أو مستعار الحزم من خلال السجل على سلسلة

## أسماء الحزمة {#package-names}

استخدام هويات الحزمة القانونية:

```text
namespace/package
```

استخدام إشارات الإصدار الدقيق:

```text
namespace/package@version
```

لا توجد خطوة `@` قبل مساحة الأسماء. يتم احتفاظ منفصل `@` للإصدار الإضافية.

يطابق قطاع مساحة الأسماء الإضافات المستخدمة من قبل Kotodama مستعار عقد dapp:

|هوية الحزمة|شكل اسم العقد المرتبط |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

يحتوي الفراغات الاسمية إما على شكل `<dataspace>` أو `<domain>.<dataspace>`. عندما يكون لدى الحزمة رابط dapp ، فإن Musubi يتحقق من أن كل مستعار عقد مرتبط يستخدم نفس ضريبة مساحة الأسماء التي تستخدمها حزمة.

## المظاهر {#manifest}

يبدأ الحزمة بـ `Musubi.toml`:

```toml
[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"

[exports]
functions = ["quote"]

[dapp]
namespace = "dex.universal"
contracts = ["router::dex.universal"]
```

قد تستخدم الاعتمادات الإصدارات الدقيقة، ومتطلبات الرعاية، و متطلبات التيلد، والبطاقات البرية مثل `1.*`، أو القوائم المقارنة مثل `>=1.0.0,<2.0.0`.

يقوم `Musubi.lock` بتسجيل الرسم البياني الانتقالي المختار من سجل السلسلة. تخزن كل عقد مقفل حزمة قائمة لها، والمتطلبات المختارة، و SoraFS التضخم المظاهر، وتحديد الأرشيف المصدر، وعدد البايتات، وعدد الملفات، وظائف الصادرة، خطة أرشيف المصدر المحددة، وألقاب الاعتماد. يتم حل أسماء مستعار قصيرة قبل دخول ملف القفل.

## تدفق العمل المحلي {#local-workflow}

من جذور مساحة العمل Iroha المتقدمة، قم بتشغيل Musubi عبر Cargo:

```bash
cargo run -p musubi -- init --namespace dex.universal --name swap-core --dapp
cargo run -p musubi -- add std.universal/math --version '^1.0.0' --alias math
cargo run -p musubi -- install --config client.toml
cargo run -p musubi -- build src/lib.ko --manifest-out target/lib.contract.json
cargo run -p musubi -- pack \
  --car-out source.car \
  --sorafs-manifest-out manifest.norito \
  --source-plan-out source-plan.norito
```

استخدم `install --offline` لكتابة ملف قفل غير مصحوب للتبعيات الإصدارات الدقيقة دون استفسار عقدة. استخدم `install --locked` في CI لرفض ملف قفال مسن.

`build` ربط مصادر الاعتماد المتخزنة بإعادة كتابة الدعوات مثل: `math::add()` إلى الداخلية المحددة Kotodama أسماء الوظائف. يرفض الدعوات إلى الوظائفة التي لم تصدرها الاعتماد. Musubi المكتبات v1 هي وظائف فقط: مصادر الاعتماد التي تحتوي على إعلانات الدولة، المحفزات، كوتوبا كتلة، ثابتة، أو يتم رفض عناصر عقد أخرى غير وظيفية.

## إحضار المصدر Archives {#fetching-source-archives}

Musubi يمكن أن تجلب مصادر الاعتماد المفقودة أثناء الحل أو في وقت لاحق من خلال الأوامر الفرعية التخفيرية:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

تستخدم عمليات نقل البوابة الحية واحدة أو أكثر من مواصفات مزود بوابة SoraFS:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

ملفات الحمولة المفيدة للمزود ومزودي البوابة يستثني بعضها البعض لعملية إحضار واحدة. إذا كان هناك أكثر من حزمة مقفلة واحدة مفقودة، قم بتغطية كل مزود بوابة مع `package=<dependency-alias>` ، `package=<namespace/package@version>`، `package=<namespace/package>`، أو `manifest=<64-hex SoraFS manifest digest>`.

البوابة `base-url` و `privacy-url` يجب أن تستخدم القيم `https://` افتراضيًا. بوابات الاختبار المحلية يمكن استخدامها `http://localhost`, `http://127.0.0.1`, أو `http://[::1]` فقط مع `--gateway-allow-insecure-localhost`. رموز التدفق هي إثباتات وقت التشغيل ولا يتم كتابتها في `Musubi.lock`.

## النشر {#publishing}

`pack` الحسابات المحددة BLAKE3-256 الأرشيف المصدر hash بالإضافة إلى البايت المصدر والملف حسابات. عندما `--car-out`, `--sorafs-manifest-out`, أو `--source-plan-out` يتم توفيرها، فإنه يبني أيضا SoraFS CAR الحمولة المفيدة، SoraFS واضحة، و Musubi خطة أرشيف المصدر من نفس مجموعة ملفات المصدر.

استخدم الجفاف قبل النشر:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

بدون `--dry-run`, `publish` يكتب القطع الأثرية الافتراضية تحت `.musubi/dist/<namespace>/<name>/<version>/`, يتم تحميل المنشور والحمولة المفيدة بشكل اختياري عبر Torii- نعم . SoraFS نقطة نهاية لخزين التخزين مع `--upload`, يسجل الناتج SoraFS اللوحة، وتقديم `PublishMusubiRelease` من خلال التشغيل Iroha العميل.

يجب أن تشمل الإصدارات المنشورة:

- أرشيف مصدر قائدي غير فارغ
- خطة أرشيف مصدر تحديدية
- وظيفة Kotodama واحدة على الأقل صادرة
- سجلات الاعتماد التي لا تحدد الإفراجات المقطوعة
- وصلة dapp، إذا كانت موجودة، تتطابق أسماء العقد مع مساحة أسماء الحزمة.

## أسئلة السجل ودورة الحياة {#registry-queries-and-lifecycle}

بحث وتفتيش السجل مع:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

يختبئ يانكينج الإفراج من قرار جديد، ولكن يبقي الملفات القائمة قابلة للتكرار:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi يتجنب استغلال الاسم العالمي عن طريق جعل `namespace/package` اسم الحزمة القنوني. يجب أن يكون نشر في مساحة الأسماء مصرح به من قبل نفس نموذج الملكية أو الإذن المفوض الذي يستخدم لهذا المساحة الاسمية dapp Kotodama. الألقاب القصيرة العالمية المنظمة منفصلة عن ملكية الحزمة: `SetMusubiShortAlias` تتطلب إذن `CanSetMusubiShortAlias`، ويجب أن يكون لدى الحزمة المستهدفة بالفعل إطلاق نشط واحد على الأقل.

## Iroha السطحات {#iroha-surfaces}

تستخدم Musubi تعليمات و استفسارات من الدرجة الأولى Iroha:

|السطح|الغرض|
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |نشر إصدار حزمة لا تتغير. |
|`YankMusubiRelease` |علامة الإفراج الحالي كسحب.|
|`SetMusubiShortAlias` |ربط مستعار عالمي مختصراً لتحديد الهوية. |
|`AssertMusubiReleaseExists` |يتطلب وجود نسخة حزمة ملموسة. |
|`FindMusubiReleaseByRef` |احضر الإفراج عن طريق إشارة حزمة دقيقة|
|`FindMusubiPackageVersions` |إدراج إصدارات لتحديد الهوية. |
|`FindMusubiPackageReleases` |قم بإدراج ملخصات الإفصاحات لتحديد الهوية. |
|`SearchMusubiPackages` |ابحث عن ملخصات الحزم حسب مساحة الأسماء والنص. |
|`FindMusubiShortAliasByName` |حل اسم مستعار قصير.|

Torii يُفضح Musubi HTTP عائلة الطريق تحت `/v1/musubi/`. المواجهة للعميل MCP الأدوات تعرضت ك `iroha.musubi.` أسماء مستعار. [Torii النقاط النهائية](/ar/reference/torii-endpoints.md) و [إشارة استفسار](/ar/reference/queries.md) للشكل الأوسع API خريطة.
