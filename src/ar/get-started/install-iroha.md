---
translation_locale: ar
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# التثبيت Iroha 3 {#install-iroha-3}

هذه الصفحة تغطي سير العمل الحالي للتثبيت Iroha 3 سلسلة الأدوات
و الثنائيات التي تستخدم التيار الصاعد `hyperledger-iroha/iroha` مساحة العمل

## 1 - الشروط المسبقة {#_1-prerequisites}

قم بتثبيت هذه أولاً:

- [rustup](https://www.rust-lang.org/tools/install), لذا المثبت
  `rust-toolchain.toml` سلسلة الأدوات (`1.93.1`يتم تركيبها تلقائيًا
- `git`
- إختيارياً Docker و Docker Compose للشروع السريع المحلي متعدد الأقران

## 2- قم بتكرار مساحة العمل {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3- بناء مساحة العمل {#_3-build-the-workspace}

بناء كل شيء:

```bash
cargo build --workspace
```

بالنسبة لبناء صغير تركز على المشغل، قم بتجميع الثنائيات الرئيسية فقط:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

يتم كتابة الثنائيات الناتجة إلى `target/debug/` أو `target/release/`.

## 4. التحقق من الأدوات المثبتة {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

الثلاثة ثنائيات التي تستخدمها عادة هي:

- `irohad` لـ " ديمون "
- `iroha` لـ CLI الوصول إلى Torii ومواقع نهاية المشغل
- `kagami` للمفاتيح، ومخططات التكوين، وملفات المحلية

## 5 - الاختيار المحلي Docker الطريق {#_5-optional-localnet-and-docker-path}

يتم إنشاء تدفق الشبكة المحلية الحالية المدعومة من المصدر Kagami. يكتب "أقارب"
إعدادات، أدوات التكوين، إعداد العميل، نصوص المساعد، و اختياري
إعداد الملف الذي يطابق الرمز المسجل:

- `kagami localnet` للنصوص المحلية الأصلية
- `kagami docker` لـ Docker Compose تم إنشاؤه من دليل localnet

استمر في [إطلاق Iroha 3](/ar/get-started/launch-iroha.md).
