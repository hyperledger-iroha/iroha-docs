---
translation_locale: ar
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# إعادة التحميل الساخن Iroha في حاوية Docker {#hot-reload-iroha-in-a-docker-container}

استخدم إعادة التحميل الساخن فقط للتشغيل المحلي. لتنمية محلية طبيعية، تفضل إعادة بناء الصورة أو إعادة تشغيل كومة Docker Compose التي تم إنشاؤها من حزمة جديدة Kagami.

## استبدال ثنائي الأقران {#replace-the-peer-binary}

قم بإنشاء ثنائي ديمون متوافق مع لينكس من مساحة العمل المتقدمة:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

نسخها في حاوية مسابقة تعمل، ثم إعادة تشغيل تلك الحاوية:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

استخدم `docker ps` للتأكيد على اسم الحاوية. في كومة الناتجة، يتم تعريف الحاويات المتساوية بواسطة `./docker-compose.yml`.

## إعادة تشغيل جينيسيس في شبكة قابلة للتفريض {#recommit-genesis-in-a-disposable-network}

يقوم الزميل بالتكوين فقط عندما يكون مخزنه فارغًا. بالنسبة لشبكة قابلة للتخلص من Docker ، أوقف السطح ، وإزالة الحالة التي تم إنشاؤها ، وتجديد أو استبدال حزمة التكوين الموقعة ، وابدأ من جديد:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

لا تحل محل التكوين في شبكة يجب الحفاظ على حالةها.

## استخدم الإعدادات المخصصة {#use-custom-configuration}

التكوين الزميل الحالي هو TOML. ربط أو نسخ الملفات الرئيسية التي تم إنشاؤها `config.toml` ، `genesis.signed.nrt` ، والمفاتيح ذات الصلة في مسارات المحمول المتوقعة من قبل الصورة ، ثم إعادة تشغيل الزميل. الحفاظ على الملفات التي تم إنشاؤها معًا ؛ يمكن أن يؤدي مزيج الملفات من مختلف تشغيلات Kagami إلى تفكيك أو فشل الإجماع.
