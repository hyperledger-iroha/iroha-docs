---
translation_locale: ar
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama الحزم {#musubi-kotodama-packages}

Musubi هو مدير الحزمة Kotodama حزم المصدر.
المطورين تدفق عمل مثل Cargo لمشاركة Kotodama الوظائف
مع الحفاظ على هوية حزمة مرتبطة SORA و Iroha مساحات الأسماء بدلاً من
جدول أسماء أول من جاء العالمي.

الاستخدام Musubi عندما تحتاج:

- نشر قابلة لإعادة الاستخدام Kotodama المكتبات المصدرة
- تحديد معتمدات المصدر الانتقالية الدقيقة في `Musubi.lock`
- إعادة تشكيل مصدر الاعتماد من المحقق SoraFS التزامات الأرشيف
- ربط مساحة أسماء الحزمة إلى مستعار عقد dapp في نفس
  مساحة الأسماء
- تفتيش، ونشر، سحب، أو مستعار الحزم من خلال السجل على سلسلة

## أسماء الحزم {#package-names}

استخدام هويات الحزمة القنونية:

```text
namespace/package
```

استخدام إشارات الإصدار الدقيق:

```text
namespace/package@version
```

لا يوجد دليل `@` قبل مساحة الأسماء `@` المفصل محجوز
للفصل الإصداري.

يطابق قطاع المساحة الاسمية الإضافات المستخدمة من قبل Kotodama عقد Dapp
الأسماء الخفيفة:

| هوية الحزمة                | شكل مستعار العقد المرتبط |
| ------------------------- | ---------------------------- |
| `universal/math`          | `router::universal`          |
| `dex.universal/swap-core` | `router::dex.universal`      |

أما المساحات الاسمية `<dataspace>` أو `<domain>.<dataspace>` أشكال
الحزمة لديها رابط Dapp Musubi التحقق من أن كل العقد المرتبط
يستخدم نفس الإثر في مساحة الأسماء مثل الحزمة.

## المظاهر {#manifest}

الحزمة تبدأ `Musubi.toml`:

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

يمكن أن تستخدم الاعتمادات نسخة دقيقة، متطلبات الحذر، التيلد
المتطلبات، البطاقات البرية مثل `1.*`, أو قوائم مقارنة مثل
`>=1.0.0,<2.0.0`.

`Musubi.lock` تسجل الرسم البياني الانتقالي المحدد من سلسلة الإنترنت
كل عقد مقفل يحتفظ بحزمة القنوية المحددة
المطلب، SoraFS المخططات، أرشيف المصدر الهاش، عدد البايتات، ملف
الحساب، الوظائف المصدرة، خطة أرشيف مصدر تحديدية،
الاسم الأزياء القصيرة يتم حلها قبل دخول
ملف قفل

## تدفق العمل المحلي {#local-workflow}

من التيار الصاعد Iroha أصل مساحة العمل، تشغيل Musubi عبر الشحن:

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

الاستخدام `install --offline` للكتابة ملف قفل غير حل للنسخة الدقيقة
الاعتمادات دون استفسار عقدة. `install --locked` في CI إلى
رفض قفل قديم.

`build` روابط مصادر الاعتماد المحفوظة في الاحتياطي بإعادة كتابة المكالمات مثل
`math::add()` إلى الداخلية Kotodama أسماء الوظائف.
الدعوات إلى الوظائف التي لم تصدرها الاعتماد. Musubi المكتبات v1
هي وظيفة فقط: مصادر الاعتماد التي تحتوي على إعلانات الدولة،
محفزات، كتلة كوتوبا، ثابتات، أو عناصر عقدية أخرى غير تعمل
يتم رفضها.

## احضار المصدر Archives {#fetching-source-archives}

Musubi يمكن أن تجلب مصادر الاعتماد المفقودة أثناء الحل أو لاحقا
من خلال أوامر الفرعية المتخزنة:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

التقاط البوابة المباشرة تستخدم واحدة أو أكثر SoraFS مواصفات مزود البوابة:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

ملفات الحمولة المفيدة للمزود ومزودي البوابة يستثني بعضها البعض
عمليات الإحضار. إذا كان أكثر من حزمة واحدة مقفلة مفقودة،
مزود البوابة مع `package=<dependency-alias>`,
`package=<namespace/package@version>`, `package=<namespace/package>`, أو
`manifest=<64-hex SoraFS manifest digest>`.

البوابة `base-url` و `privacy-url` يجب استخدام القيم `https://` بطبيعة الحال.
بوابات الاختبار المحلية يمكن استخدامها `http://localhost`, `http://127.0.0.1`, أو
`http://[::1]` فقط مع `--gateway-allow-insecure-localhost`. التيار
الوهام هي إثباتات وقت التشغيل ولا يتم كتابتها في `Musubi.lock`.

## النشر {#publishing}

`pack` يحسب التحديد BLAKE3-256 الأرشيف المصدر hash +
البايت المصدر ومعايير الملفات `--car-out`, `--sorafs-manifest-out`, أو
`--source-plan-out` يتم توفير، فإنه يبني أيضا SoraFS
CAR الحمولة المفيدة، SoraFS المعلن، Musubi خطة أرشيف المصدر من نفس
مجموعة ملفات المصدر

استخدم الجرعة الجافة قبل النشر:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

بدون `--dry-run`, `publish` يكتب القطع الأثرية الافتراضية تحت
`.musubi/dist/<namespace>/<name>/<version>/`, يرفع إختياري
المظهر والحمولة المفيدة عبر Torii- نعم . SoraFS نقطة نهاية لخزين التخزين مع
`--upload`, يسجل الناتج SoraFS الـ "بين" و "سليم"
`PublishMusubiRelease` من خلال التشغيل Iroha العميل.

يجب أن تتضمن الإصدارات المنشورة:

- أرشيف مصدر قائدي غير فارغ
- خطة أرشيف مصدر محددة
- واحدة على الأقل صادرة Kotodama الوظيفة
- سجلات الاعتماد التي لا تحدد الإفراجات المقطوعة
- وصلة Dapp، إذا كانت موجودة، تتطابق أسماء العقد مع الحزمة
  مساحة الأسماء

## استفسارات السجل ودورة الحياة {#registry-queries-and-lifecycle}

ابحث و تحقق من السجل مع:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

يختبئ يانكينج إطلاق من قرار جديد، ولكن يبقي الملفات القائمة مقفلة
قابلة للتكرار:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi يتجنب الإسم العالمي من خلال جعل `namespace/package` الموقع
اسم الحزمة القنوني. يجب أن يكون نشر في مساحة الأسماء مصرح به من قبل
نفس نموذج الملكية أو الترخيص المفوض الذي تم استخدامه لهذا Kotodama
مساحة أسماء dapp. الألقاب القصيرة العالمية المنتظمة منفصلة عن الحزمة
الملكية: `SetMusubiShortAlias` يتطلب `CanSetMusubiShortAlias`
و يجب أن يكون في الحزمة المستهدفة بالفعل على الأقل شخص واحد نشط
إطلاق سراح

## Iroha السطح {#iroha-surfaces}

Musubi استخدامات من الدرجة الأولى Iroha التعليمات والسؤال:

| سطح الأرض                      | الغرض                                            |
| ---------------------------- | -------------------------------------------------- |
| `PublishMusubiRelease`       | نشر إصدار حزمة لا تتغير              |
| `YankMusubiRelease`          | قم بتسجيل الإفراج الحالي                |
| `SetMusubiShortAlias`        | ربط مستعار عالمي مختصراً بتعرف الحزمة |
| `AssertMusubiReleaseExists`  | يتطلب وجود نسخة حزمة ملموسة.       |
| `FindMusubiReleaseByRef`     | أحضر إفراجًا حسب الإشارة الدقيقة للحزمة        |
| `FindMusubiPackageVersions`  | إصدارات قائمة لتحديد هوية الحزمة                    |
| `FindMusubiPackageReleases`  | إدراج ملخصات الإفصاحات لتحديد هوية الحزمة           |
| `SearchMusubiPackages`       | ابحث عن ملخصات الحزم حسب مساحة الأسماء والنص.    |
| `FindMusubiShortAliasByName` | حل اسم مستعار قصير                     |

Torii يُكشف Musubi HTTP عائلة الطريق تحت `/v1/musubi/*`.
يواجه الوكيل MCP يتم عرض الأدوات على `iroha.musubi.*` أسماء مستعار.
[Torii النقاط النهائية](/ar/reference/torii-endpoints.md) و
[إشارة استفسار](/ar/reference/queries.md) للشكل الأوسع API خريطة
