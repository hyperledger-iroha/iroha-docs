---
translation_locale: ar
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# التثبيت Iroha 3 {#install-iroha-3}

تغطي هذه الصفحة تدفق العمل الحالي للتثبيت لسلسلة الأدوات Iroha 3 والمجموعات الثنائية التي تستخدم مساحة عمل `hyperledger-iroha/iroha` المتجهة نحو الأعلى.

## 1 . الشروط المسبقة {#_1-prerequisites}

قم بتثبيت هذه أولاً:

- [rustup](https://www.rust-lang.org/tools/install)، بحيث يتم تثبيت سلسلة الأدوات `rust-toolchain.toml` المثبتة (`1.93.1`) تلقائياً
- `git`
- اختياريًا، Docker و Docker Compose لبدء سريع متعدد الأقران المحلي.

## إستنساخ مساحة العمل {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3- بناء مساحة العمل {#_3-build-the-workspace}

بناء كل شيء:

```bash
cargo build --workspace
```

بالنسبة لبناء أصغر تركز على المشغل ، قم بتجميع الثنائيات الرئيسية فقط:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

ويتم كتابة الثنائيات الناتجة على `target/debug/` أو `target/release/`.

## التحقق من الأدوات المثبتة {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

الثلاثة ثنائيات التي تستخدمها عادة هي:

- `irohad` لـ (دايمون) الأقران
- `iroha` للوصول إلى CLI و Torii ومواقع نهاية المشغل
- `kagami` للمفاتيح، ومخططات التكوين، وملفات المواقع المحلية

## 5 - الاختياري Localnet و Docker Path {#_5-optional-localnet-and-docker-path}

يتم إنشاء تدفق localnet الحالي المدعوم من المصدر بواسطة Kagami. يكتب إعدادات الأقران ، وأشياء التكوين الجينيزي ، وإعدادات العميل ، ونصوص المساعد ، وملف Compose الاختياري الذي يطابق الرمز المحقق:

- `kagami localnet` للمخطوطات المحلية الأصلية
- `kagami docker` لـ Docker Compose تم إنشاؤه من دليل محلي للشبكة

استمر في [إطلاق Iroha 3](/ar/get-started/launch-iroha.md).
