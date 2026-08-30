---
translation_locale: ar
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
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
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

ويتم كتابة الثنائيات الناتجة على `target/debug/` أو `target/release/`.

## التحقق من الأدوات المثبتة {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

الأربعة الثنائية التي تستخدمها عادة هي:

- `iroha3d` لـ ديمون أقرانه القياسي
- `iroha3d_taira` لمطلق المصادقة القنوني Taira
- `iroha` للوصول إلى CLI و Torii ومواقع نهاية المشغل
- `kagami` للمفاتيح، ومخططات التكوين، وملفات المواقع المحلية

## 5 . الاختيارية Localnet و Docker Path {#_5-optional-localnet-and-docker-path}

يتم إنشاء تدفق localnet الحالي المدعوم من المصدر بواسطة Kagami. يكتب إعدادات الأقران ، وأشياء التكوين الجينيزي ، وإعدادات العميل ، ونصوص المساعد ، وملف Compose الاختياري الذي يطابق الرمز المحقق:

- `kagami localnet` للمخطوطات المحلية الأصلية
- `kagami docker` لـ Docker Compose تم إنشاؤه من دليل محلي للشبكة

استمر في [إطلاق Iroha 3](/ar/get-started/launch-iroha.md).
