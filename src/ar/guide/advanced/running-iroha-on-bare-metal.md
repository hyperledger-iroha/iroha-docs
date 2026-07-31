---
translation_locale: ar
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الجري Iroha على المعادن العارية {#running-iroha-on-bare-metal}

استخدم هذا التدفق العمل عندما تريد تشغيل أقرانه مباشرة على مضيف بدلا من
من خلال Docker Compose. شجرة المصدر الحالية توفر Kagami المولدات التي
كتابة جنيس متطابقة، إعدادات الأقران، إعداد العميل، وخطوط البدء / الإيقاف.

## 1 - بناء الثنائيات {#_1-build-the-binaries}

من التيار الصاعد Iroha مساحة العمل:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

هذا ينتج:

- `target/release/irohad` لـ " ديمون "
- `target/release/iroha` لـ CLI
- `target/release/kagami` للفتاح والتكوين وتوليد الشبكات المحلية

## 2- إنشاء شبكة محلية {#_2-generate-a-local-network}

إنشاء أربعة أشرطة Iroha 3 شبكة محلية:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

المجلد الخارجي يحتوي على الناتج `genesis.json`,
`genesis.signed.nrt`, الزملاء `config.toml` الملفات `client.toml`, النصوص المساعدة
ومتولى `README.md` مع الأوامر الدقيقة لهذه الحزمة

## 3 . ابدأ أقرانه {#_3-start-peers}

لإنشاء شبكة محلية قابلة للتخلص من الجهاز، استخدم النص المولود:

```bash
./localnet/start.sh
```

إذا كنت بحاجة إلى توصيل كل نظير في مدير العمليات مثل systemd, استخدم
أمر الإطلاق المسجل في `./localnet/README.md` لكل أقرانه، احتفظ بكل
أقرانهم `config.toml`, المفتاح الخاص، دليل التخزين، والموانئ منفصلة.

## 4 - تشغيل الشبكة {#_4-operate-the-network}

استخدم إعداد العميل الذي تم إنشاؤه

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

إيقاف الشبكة المحلية التي تم إنشاؤها مع:

```bash
./localnet/stop.sh
```

## 5. ملاحظات الإنتاج {#_5-production-notes}

- إنتاج مفاتيح خاصة جديدة للإنتاج وتخزينها خارج
  مخزن
- اجعل كل أقر يتفقون على نفس المعاملة الموقعة
  أقرانهم الموثوقين والمؤكد PoPs.
- إرتباط مخاطب المستمع إلى واجهات المحلية مضيفة فقط عندما يجب على الزملاء
  لا يمكن الوصول إليها من آلات أخرى.
- استخدم بروكسية عكسية أو جدار حماية Torii التعرض، الأساسية TLS, ومعدل
  القيود.
- تعامل التغييرات في الجينس أو توبولوجيات الإجماع كالهجرة المنسقة، لا
  تعديلات ملفات فردية.

للتنمية المحلية المكونة من الحاويات، استخدام [إطلاق Iroha 3](../../get-started/launch-iroha.md)
Docker Compose سير العمل
