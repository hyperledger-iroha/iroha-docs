---
translation_locale: ar
translation_source: /help/installation-issues.md
translation_source_hash: 2f548e96f8a72ea83a8b39fabf7f3713ad7b8df0eac627ed2138cbd9d3f7ea36
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# إصلاح مشاكل التثبيت {#troubleshooting-installation-issues}

يقدم هذا القسم نصائح حل المشاكل Iroha 3 التثبيت
المشكلة التي تواجهها لا يوصف هنا
اتصل بنا عبر [تلغرام](https://t.me/hyperledgeriroha).

## التحققات السريعة {#quick-checks}

معظم أخطاء التثبيت تأتي من واحدة من أربع أماكن:

- (أ) Rust سلسلة الأدوات القديمة من الإصدار الذي تم إثباطه في مساحة العمل المباشرة
- `cargo` أو `rustc` الحل لتركيب مختلف عن `rustup`
- أدوات بناء النظام المفقودة مثل محفز C، `pkg-config`, أو CMake
- المقطوعات التي تم إنشاؤها بعد التغيير في المصدر
  الإصلاحات

من Iroha التحقق من المصدر، تبدأ ب:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

إذا `cargo metadata` فشل، إصلاح سلسلة الأدوات المحلية قبل تشغيلها
`pnpm refresh:iroha --source /path/to/iroha`, لأن التجديد يمكن أن يدعو
Kagami لتوليد مخطط نموذج البيانات الحالي.

## حل المشاكل Rust سلسلة الأدوات {#troubleshooting-rust-toolchain}

في بعض الأحيان، الأمور لا تسير كما خططت `rust` على
النظام منذ فترة، ولكن لم يتم تحديثه.
Python: XKCD لديه مثال مشهور على ما قد يبدو عليه:

<div class="flex justify-center">

![Python حل المشاكل البيئية](/img/install-troubles.png)

</div>

### تحقق Rust النسخة {#check-rust-version}

من أجل الحفاظ على صحتك وعقلنا، تأكد من أنك
لديهم النسخة الصحيحة `cargo` إزواجها مع النسخة الصحيحة من `rustc`.
يعلن مساحة العمل الحالية في الأعلى `rust-version = "1.92"` وأحزم
قناة سلسلة الأدوات في `rust-toolchain.toml`. لإظهار الإصدارات، تفعل

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

و بعدها

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

إذا كان لديك إصدارات أعلى، فأنت بخير.
يمكن تشغيل الأمر التالي لتحديثه:

```bash
$ rustup toolchain update stable
```

### تحقق من موقع التركيب {#check-installation-location}

إذا حصلت على أرقام النسخة أقل **و** قمت بتحديث سلسلة الأدوات و
لم تنجح... دعونا نقول انها مشكلة شائعة، ولكن ليس لديها
الحل المشترك

أولاً، يجب أن تحدد أين النسخة التي تريد استخدامها
المثبتة:

```bash
$ rustup which rustc
$ rustup which cargo
```

تثبيتات المستخدمين لسلسلة الأدوات هي _عادة_ في
`~/.rustup/toolchains/stable-*/bin/`. إذا كان هذا هو الحال، يجب أن تكون
قادر على الجري

```bash
$ rustup toolchain update stable
```

و هذا يجب أن يصلح مشاكلك

### تحقق من الافتراضي Rust النسخة {#check-the-default-rust-version}

خيار آخر هو أن يكون لديك `stable` سلسلة الأدوات، ولكن
لم يتم تعيينها كالتعيين.

```bash
$ rustup default stable
```

هذا يمكن أن يحدث إذا قمت بتثبيت `nightly` نسخة، أو تعيين
Rust نسخة، ولكن نسيت أن تفتحها.

### تحقق من وجود آخرين Rust الإصدارات {#check-if-there-are-other-rust-versions}

استمرار في حل المشاكل ثقب الأرانب، ويمكن أن يكون لدينا القذيفة
الأسماء الخفيفة:

```bash
$ type rustc
$ type cargo
```

إذا كانت هذه تشير إلى مواقع أخرى غير تلك التي رأيتها أثناء الجري
`rustup which *`, إذاً لديك مشكلة لاحظ أنه لا يكفي
فقط

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

لأن هناك منطق داخلي يمكن أن يكسر، بغض النظر عن كيفية
إعادة ترتيب أسماك القذيفة

أسهل الحل هو إزالة الإصدارات التي لا تستخدمها

إنه أسهل _قال_ أكثر من _قد تم_, ومع ذلك، بما أنه ينطوي على تتبع جميع
نسخ من rustup يتم تثبيتها وتوفيرها لك. عادة ما تكون هناك فقط
الثاني: إصدار مدير الحزم النظام والذي تم تثبيته في
الموقع القياسي في مجلد منزلك عندما قمت بتشغيل الأوامر
في بداية هذا التعليم. للمرة الأولى، استشارة (لينكس)
دليل التوزيع (`apt remove rust`(). للآخرين، إشغلي:

```bash
$ rustup toolchain list
```

ومن ثم، لكل `<toolchain>` (بغض النظر عن العوامل الزاوية بالطبع):

```bash
$ rustup remove <toolchain>
```

بعد ذلك، تأكد من أن

```bash
$ cargo --help
```

يؤدي إلى خطأ لا يتم العثور عليه ، أي أنه ليس لديك أي نشط Rust
سلسلة الأدوات مثبتة، ثم تشغيل:

```bash
$ rustup toolchain install stable
```

## حل المشاكل Python سلسلة الأدوات {#troubleshooting-python-toolchain}

عندما تقوم بتثبيت Python حزمة العجلات التي تستخدم قنبلة خلال [Python إعداد العميل](/ar/guide/tutorials/python.md), قد تواجه خطأ مثل:
"إيروها"_-البيطون*.whl ليس عجلة مدعومة على هذه المنصة".

هذا الخطأ يعني أن pip قديمة، لذلك تحتاج إلى تحديثه.
أولاً، يوصى بتحقق من OS لإجراء تحديثات وإجراء ترقية النظام.

إذا لم ينجح هذا، يمكنك محاولة تحديث `pip` لمجلة المستخدمين الخاصة بك.

`python -m pip install --upgrade pip`

تأكد من ذلك `pip` الذي يُثبت في دليل منزلك. `whereis pip` و التحقق من `/home/username/.local/bin/pip` إن لم يكن كذلك، قم بتحديث قذفك `PATH` المتغير

إذا استمرت المسألة، من فضلك [اتصل بنا](/ar/help/) وأبلغ عن النتائج

```
python --version
python3 --version
pip --version
pip3 --version
```
