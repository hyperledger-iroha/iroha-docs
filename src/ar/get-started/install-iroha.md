---
translation_locale: ar
translation_source: /get-started/install-iroha.md
translation_source_hash: b2ba22db6a25e3b67cf18dc6959f95f57bd861b232b1d4a9d881bbe3cdf7844a
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# تثبيت Iroha 3 {#install-iroha-3}

تغطي هذه الصفحة سير عمل التثبيت الحالي لأدوات وسلاسل البرمجيات Iroha 3 والملفات الثنائية باستخدام مساحة العمل العليا `hyperledger-iroha/iroha`.

للتثبيت مباشرة على المضيف، اتبع تعليمات Rust أدناه. ولتشغيل أربع عُقَد تحقق باستخدام Docker، ابدأ بدليل [تشغيل Iroha 3](/ar/get-started/launch-iroha.md).

## 1. المتطلبات الأساسية {#_1-prerequisites}

قم بتثبيت هذه أولاً:

- [rustup](https://www.rust-lang.org/tools/install)، لذلك يتم تثبيت سلسلة أدوات `rust-toolchain.toml` المثبتة (`1.99.1`) تلقائيًا
- `git`
- اختياريًا، Docker و Docker Compose لبدء التشغيل السريع متعدد الأقران المحلي

## 2. استنساخ مساحة العمل {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. بناء مساحة العمل {#_3-build-the-workspace}

ابنِ كل شيء:

```bash
cargo build --workspace
```

لبناء مخصص لمشغل أصغر، قم بترجمة الملفات التنفيذية الرئيسية فقط:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

يتم كتابة الملفات الثنائية الناتجة إلى `target/debug/` أو `target/release/`.

## 4. التحقق من الأدوات المثبتة {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

الثنائيات الأربعة التي ستستخدمها عادة هي:

- `iroha3d` لخادم ند للشبكة القياسية
- `iroha3d_taira` لمشغّل مصدّق Taira للبروتوكول الموحّد الفردي
- `iroha` للوصول إلى Torii وواجهات تشغيل API لـ CLI
- `kagami` للمفاتيح، وبيانات نشأة البلوكتشين التقنية، وملفات تعريف الشبكة المحلية

## 5. الشبكة المحلية الاختيارية والمسار Docker {#_5-optional-localnet-and-docker-path}

يتم إنشاء تدفق localnet المدعوم بالمصدر الحالي بواسطة Kagami. يقوم بكتابة إعدادات نظراء الشبكة وقطع بداية البلوكشين وإعدادات العميل والبرمجيات المساعدة وملف Compose اختياري يتطابق مع الكود الذي تم التحقق منه:

- `kagami localnet up` لشبكة محلية مُدارة يبدأها Kagami ويشرف عليها
- `kagami localnet generate` لتوليد نصوص تشغيل محلية أصلية للأقران
- `kagami docker` لـ Docker Compose تم إنشاؤه من دليل localnet

واصل مع [إطلاق Iroha 3](/ar/get-started/launch-iroha.md).
