---
translation_locale: ar
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# إعادة التحميل الساخن Iroha في Docker الحاوية {#hot-reload-iroha-in-a-docker-container}

استخدم إعادة التحميل الساخن فقط للتحليل المحلي.
إعادة بناء الصورة أو إعادة تشغيل الصورة التي تم إنشاؤها Docker Compose كومة من
طازجة Kagami حزمة.

## استبدال ثنائي الأقران {#replace-the-peer-binary}

قم ببناء ثنائي ديمون متوافق مع لينكس من مساحة العمل المتقدمة:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

نسخها في حاوية نظير تعمل، ثم إعادة تشغيل تلك الحاوية:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

الاستخدام `docker ps` لتأكيد اسم الحاوية. في كومة المولدة
المحتويات تعريفها: `./localnet/docker-compose.yml`.

## إعادة تشغيل جينيسس في شبكة قابلة للتصرف {#recommit-genesis-in-a-disposable-network}

يرتكب زميل التكوين فقط عندما يكون مخزنها فارغ. Docker
الشبكة، توقف الكمية، إزالة الحالة التي تم إنشاؤها، وتجديد أو استبدال
وبدأ من جديد:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

لا تحل محل التكوين على شبكة يجب الحفاظ على حالةها

## استخدم الإعدادات المخصصة {#use-custom-configuration}

تكوين الأقران الحالي هو TOML. إرباط أو نسخ النسخة المولدة
`config.toml`, `genesis.signed.nrt`, وملفات المفاتيح ذات الصلة في الحاوية
المسارات المتوقعة من قبل الصورة، ثم إعادة تشغيل الزملاء.
معًا؛ خلط الملفات من مختلف Kagami يمكن أن تؤدي الركوب إلى التخريب أو
فشل الإجماع
