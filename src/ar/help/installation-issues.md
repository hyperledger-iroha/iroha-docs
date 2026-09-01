---
translation_locale: ar
translation_source: /help/installation-issues.md
translation_source_hash: 1a2519123edc5224e720e23ef3e2bc2a7b4dba38ef87af49216c31c054c85a2a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# استكشاف مشكلات التثبيت {#troubleshooting-installation-issues}

يقدم هذا القسم نصائح لحل المشكلات المتعلقة بتثبيت Iroha 3. إذا كانت المشكلة التي تواجهها غير مذكورة هنا، فاتصل بنا عبر [تليغرام](https://t.me/hyperledgeriroha).

## فحوصات سريعة {#quick-checks}

تأتي معظم حالات فشل التثبيت من أحد الأماكن الأربعة:

- سلسلة أدوات Rust أقدم من النسخة المثبتة بواسطة مساحة العمل العليا
- `cargo` أو `rustc` يحلان لمُثبّت مختلف عن `rustup`
- أدوات بناء النظام مفقودة مثل مترجم C، `pkg-config`، أو CMake
- المقتطفات المولدة القديمة أو الآثار المحلية للبناء بعد تغيير مراجعات المصدر

من نسخة العمل من كود المصدر Iroha، ابدأ بـ:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

إذا فشل `cargo metadata`، قم بإصلاح مجموعة الأدوات المحلية قبل تشغيل `pnpm refresh:iroha --source /path/to/iroha`، لأن التحديث يمكن أن يستدعي Kagami لتوليد مخطط نموذج البيانات الحالي.

## استكشاف أخطاء سلسلة الأدوات Rust وإصلاحها {#troubleshooting-rust-toolchain}

أحيانًا، لا تسير الأمور كما هو مخطط لها. خاصة إذا كان لديك `rust` على نظامك منذ فترة، لكنك لم تقم بالترقية. يمكن أن تحدث مشكلة مماثلة في Python: لدى XKCD مثال مشهور لما قد يبدو عليه ذلك:

<div class="flex justify-center">

![Python كوميك استكشاف مشاكل البيئة](/img/install-troubles.png)

</div>

### تحقق من نسخة Rust {#check-rust-version}

من أجل الحفاظ على سلامتك عقليًا وسلامتنا، تأكد من أن لديك النسخة الصحيحة من `cargo` متوافقة مع النسخة الصحيحة من `rustc`. يعلن مكان العمل الحالي للأعلى عن `rust-version = "1.92"` ويثبت قناة أدوات البناء في `rust-toolchain.toml`. لعرض الإصدارات، نفذ

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

ثم

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

إذا كان لديك إصدارات أعلى، فأنت بخير. إذا كان لديك إصدارات أقل، يمكنك تشغيل الأمر التالي لتحديثه:

```bash
$ rustup toolchain update stable
```

### تحقق من موقع التثبيت {#check-installation-location}

إذا حصلت على أرقام إصدارات أقل وقمت بتحديث سلسلة الأدوات ولم ينجح ذلك... دعنا نقول فقط إنها مشكلة شائعة، لكنها لا تملك حلاً شائعاً.

أولاً، يجب أن تحدد مكان تثبيت النسخة التي تريد استخدامها:

```bash
$ rustup which rustc
$ rustup which cargo
```

تكون تثبيتات المستخدم لأدوات السلاسل عادة في `~/.rustup/toolchains/stable-*/bin/`. إذا كان هذا هو الحال، يجب أن تتمكن من التشغيل

```bash
$ rustup toolchain update stable
```

ويجب أن يحل ذلك مشاكلك.

### تحقق من النسخة الافتراضية Rust {#check-the-default-rust-version}

خيار آخر هو أن لديك مجموعة أدوات `stable` المحدثة، لكنها ليست مضبوطة كافتراضية. نفّذ:

```bash
$ rustup default stable
```

تثبيت نسخة `nightly` أو ضبط نسخة محددة من Rust دون إلغاء ضبطها لاحقًا يمكن أن يسبب هذه المشكلة.

### تحقق مما إذا كانت هناك إصدارات أخرى من Rust {#check-if-there-are-other-rust-versions}

بالاستمرار في حفرة الأرانب لمشاكل الاستكشاف، قد يكون لدينا اختصارات الشل:

```bash
$ type rustc
$ type cargo
```

إذا أشارت هذه إلى مواقع أخرى غير التي رأيتها عند تشغيل `rustup which *`، فحينئذ لديك مشكلة. لاحظ أن إضافة الأسماء المستعارة مثل هذه ليست كافية:

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

يمكن للمنطق الداخلي أن يتعطل بغض النظر عن كيفية ترتيب اختصارات الصدفة الخاصة بك.

الحل الأبسط سيكون إزالة الإصدارات التي لا تستخدمها.

من الأسهل قول ذلك من فعله، مع ذلك، لأنه يتطلب تتبع جميع إصدارات rustup المثبتة والمتاحة لديك. عادةً، هناك اثنان فقط: إصدار مدير حزم النظام والإصدار الذي تم تثبيته في الموقع القياسي في مجلد المنزل الخاص بك عندما قمت بتشغيل الأمر في بداية هذا الدليل. بالنسبة للأول، راجع دليل توزيعتك (لينكس)، (`apt remove rust`). بالنسبة للأخير، شغِّل:

```bash
$ rustup toolchain list
```

ثم، لكل `<toolchain>` (بدون الأقواس الزاوية بالطبع):

```bash
$ rustup remove <toolchain>
```

بعد إزالة سلاسل الأدوات، يجب أن تُبلغ هذه الأمر عن خطأ 'الأمر غير موجود':

```bash
$ cargo --help
```

هذا الخطأ يؤكد أنه لا توجد أي سلسلة أدوات Rust نشطة مثبتة. ثم قم بتشغيل:

```bash
$ rustup toolchain install stable
```

## استكشاف أخطاء سلسلة الأدوات Python وإصلاحها {#troubleshooting-python-toolchain}

عندما تقوم بتثبيت حزمة Python Wheel باستخدام pip خلال [Python إعداد العميل](/ar/guide/tutorials/python.md)، قد تواجه خطأ مثل: "iroha_python-*.whl ليست حزمة Wheel مدعومة على هذا النظام".

هذا الخطأ يعني أن pip قديم، لذلك تحتاج إلى تحديثه. أولاً وقبل كل شيء، يُوصى بالتحقق من OS الخاص بك للحصول على التحديثات وإجراء ترقية للنظام.

إذا لم ينجح هذا، يمكنك محاولة تحديث `pip` لدليل المستخدم الخاص بك.

`python -m pip install --upgrade pip`

تأكد من أن `pip` مثبت في دليل المنزل الخاص بك. للقيام بذلك، قم بتشغيل `whereis pip` وتحقق مما إذا كان `/home/username/.local/bin/pip` من بين المسارات. إذا لم يكن كذلك، قم بتحديث متغير `PATH` في الصدفة الخاصة بك.

إذا استمرت المشكلة، يرجى [اتصل بنا](/ar/help/) والإبلاغ عن النتائج.

```
python --version
python3 --version
pip --version
pip3 --version
```
