---
translation_locale: ar
translation_source: /help/installation-issues.md
translation_source_hash: 5dc09ae199ec2ec268dba53af9ebf43927a5e0254c5bb2e0fb908e0624b66661
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# إصلاح مشكلات التثبيت {#troubleshooting-installation-issues}

يقدم هذا القسم نصائح لحل المشاكل للتثبيت Iroha 3. إذا لم يتم وصف المشكلة التي تواجهها هنا، اتصل بنا عبر [Telegram](https://t.me/hyperledgeriroha).

## التحققات السريعة {#quick-checks}

معظم أخطاء التثبيت تأتي من واحدة من أربع أماكن:

- سلسلة أدوات Rust قديمة من النسخة المثبتة في مساحة العمل الصعودية
- `cargo` أو `rustc` ينفذ في منشأة مختلفة عن `rustup`
- أدوات بناء النظام المفقودة مثل محفز C، `pkg-config` ، أو CMake
- المقطوعات التي تم إنشاؤها مسبقة أو القطع الأثرية المحلية بعد تغيير إصدارات المصدر.

من الصندوق المصدر Iroha، تبدأ ب:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

إذا فشل `cargo metadata` ، قم بإصلاح سلسلة الأدوات المحلية قبل تشغيل `pnpm refresh:iroha --source /path/to/iroha` ، لأن التحديث يمكن أن يستدعو Kagami لتوليد مخطط نموذج البيانات الحالي. .

## حل المشاكل Rust سلسلة الأدوات {#troubleshooting-rust-toolchain}

في بعض الأحيان ، لا تسير الأمور كما تم التخطيط لها. خاصة إذا كان لديك `rust` على نظامك منذ فترة وجيزة ، ولكن لم تقوم بتحديثه. يمكن أن تحدث مشكلة مماثلة في Python: XKCD لديه مثال مشهور على كيف قد يبدو ذلك:

<div class="flex justify-center">

![Python حل المشاكل البيئية القومي](/img/install-troubles.png)

</div>

### التحقق من نسخة Rust {#check-rust-version}

في مصلحة الحفاظ على صحتك وعقلنا، تأكد من أن لديك النسخة الصحيحة من `cargo` مع نسخة صحيحة من `rustc`. يعلن مساحة العمل السابقة الحالية `rust-version = "1.92"` ويضبط قناة سلسلة الأدوات في `rust-toolchain.toml`. لإظهار الإصدارات، قم

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

و بعدها

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

إذا كان لديك إصدارات أعلى، أنت بخير. إذا كان لديك نسخة أقل، يمكنك تشغيل الأمر التالي لتحديثه:

```bash
$ rustup toolchain update stable
```

### التحقق من موقع التركيب {#check-installation-location}

إذا حصلت على أرقام الإصدارات المنخفضة وتحديث سلسلة الأدوات ولم تنجح دعونا نقول انها مشكلة شائعة، ولكن ليس لديها حل شائع.

أولاً، يجب عليك تحديد مكان تثبيت النسخة التي تريد استخدامها:

```bash
$ rustup which rustc
$ rustup which cargo
```

تثبيتات المستخدم لسلسلة الأدوات عادة في `~/.rustup/toolchains/stable-*/bin/`. إذا كان هذا هو الحال، يجب أن تكون قادرة على تشغيل

```bash
$ rustup toolchain update stable
```

وهذا يجب أن يحل مشاكلك.

### تحقق من النسخة الافتراضية Rust {#check-the-default-rust-version}

خيار آخر هو أن يكون لديك سلسلة الأدوات `stable` المحدثة ، ولكنها ليست محددة باعتبارها افتراضية. تشغيل:

```bash
$ rustup default stable
```

هذا يمكن أن يحدث إذا قمت بتثبيت نسخة `nightly` ، أو تعيين نسخة محددة Rust، ولكن نسيت إلغائها.

### تحقق من وجود إصدارات أخرى Rust {#check-if-there-are-other-rust-versions}

استمرار حل المشاكل في حفرة الأرانب، يمكننا أن يكون لدينا أسماء مستعار:

```bash
$ type rustc
$ type cargo
```

إذا كانت هذه تشير إلى مواقع أخرى غير تلك التي رأيتها عند تشغيل `rustup which *` ، فأنت لديك مشكلة. لاحظ أن إضافة أسماء مستعار مثل هذه لا تكفي:

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

المنطق الداخلي لا يزال يمكن أن يتحطم بغض النظر عن كيفية ترتيب أسماك القبو الخاص بك.

أسهل حل هو إزالة الإصدارات التي لا تستخدمها.

ومع ذلك، فمن الأسهل قولها من القيام به، لأنه يتضمن تتبع جميع إصدارات rustup المثبتة والمتاحة لك. عادةً ما تكون هناك اثنان فقط: نسخة مدير حزمة النظام والتي تم تثبيتها في الموقع القياسي في مجلد منزلك عندما قمت بتشغيل الأوامر في بداية هذا التعليم. للواحدة، راجع دليل توزيع (لينكس) الخاص بك، (`apt remove rust`). للآخر، تشغي:

```bash
$ rustup toolchain list
```

ومن ثم، لكل `<toolchain>` (بدون العلامات الزاوية بالطبع):

```bash
$ rustup remove <toolchain>
```

بعد ذلك، تأكد من أن

```bash
$ cargo --help
```

يؤدي إلى خطأ لا يتم العثور عليه، أي أنه ليس لديك سلسلة أدوات Rust نشطة مثبتة. ثم قم بتشغيل:

```bash
$ rustup toolchain install stable
```

## حل المشاكل Python سلسلة الأدوات {#troubleshooting-python-toolchain}

عند تثبيت حزمة عجلة Python باستخدام pip أثناء إعداد العميل [Python ](/ar/guide/tutorials/python.md)، قد تواجه خطأ مثل: "iroha_python-*.whl ليست عجلة مدعومة على هذه المنصة".

هذا الخطأ يعني أن pip قديمة، لذلك تحتاج إلى تحديثه. أولاً، يوصى بالتحقق من OS الخاص بك للحصول على تحديثات وإجراء ترقية نظام.

إذا لم ينجح هذا، يمكنك محاولة تحديث `pip` لمجلة المستخدم الخاص بك.

`python -m pip install --upgrade pip`

تأكد من أن `pip` قد تم تثبيته في دليل منزلك. للقيام بذلك، قم بتشغيل `whereis pip` وتحقق ما إذا كان `/home/username/.local/bin/pip` بين المسارات. وإذا لم يكن كذلك، قم بتحديث متغير `PATH` لشجرةك.

إذا استمرت المسألة، من فضلك [اتصل بنا](/ar/help/) وأبلغ عن النتائج.

```
python --version
python3 --version
pip --version
pip3 --version
```
