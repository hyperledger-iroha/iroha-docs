---
translation_locale: ar
translation_source: /reference/binaries.md
translation_source_hash: 1bf3f4697e44b3c8ef571eb9e5c0e301a1acbf76aa1c0666b3cd86e108bba6bf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# العمل مع الثنائيات Iroha {#working-with-iroha-binaries}

تدور سير عمل مشغل Iroha 3 حول أربعة ثنائيات أساسية:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) لتشغيل خادم نظير الشبكة
- `iroha3d_taira` لمشغّل مصدّق Taira للبروتوكول الموحّد الفردي
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) لـ CLI وأوامر المشغل
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) للمفاتيح، ونشأة البلوكشين، والشبكات المحلية، والملفات الشخصية

## البناء من المصدر {#build-from-source}

من جذر مساحة العمل العليا:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

ثم تتوفر الملفات التنفيذية للإصدار في `target/release/`.

لفحص واجهة الأوامر:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## تشغيل مباشرة من المستودع {#run-directly-from-the-repository}

إذا كنت لا تريد تثبيت أي شيء على مستوى النظام، استخدم `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker صورة {#docker-image}

اتبع دليل [إطلاق Iroha 3](/ar/get-started/launch-iroha.md) لبناء أربع عقد تحقق وتشغيلها في Docker باستخدام ملفات تنفيذية من المراجعة نفسها.

## أي النسخ الثنائية يجب أن أستخدم؟ {#which-binary-should-i-use}

- استخدم `iroha3d` عندما تبدأ أو تشغّل أقران الشبكة خارج إصدار المحقق العام Taira.
- استخدم `iroha3d_taira --sora` فقط لنشر مدقق واحد لبروتوكول قياسي Taira؛ فهو يفرض سلسلة Taira والتخزين وملف توقيع وقت التشغيل.
- استخدم `iroha` عندما تحتاج إلى استعلام دفتر الأستاذ الخاص بالبلوكتشين، أو تقديم المعاملات، أو فحص نقاط نهاية المشغل API.
- استخدم `kagami` عندما تحتاج إلى مفاتيح أو بيانات genesis أو حزم ملفات التعريف أو أصول الشبكة المحلية.
