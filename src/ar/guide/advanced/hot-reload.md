---
translation_locale: ar
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# إعادة التحميل الساخن Iroha في حاوية Docker {#hot-reload-iroha-in-a-docker-container}

استخدم إعادة التحميل السريع فقط لأغراض التصحيح المحلي. بالنسبة للتطوير المحلي العادي، يفضل إعادة بناء الصورة أو إعادة تشغيل المكدس Docker Compose الناتج من حزمة Kagami جديدة.

## استبدل النظير الشبكي الثنائي {#replace-the-peer-binary}

بناء ملف ثنائي للشيطان متوافق مع لينكس من مساحة العمل الأصلية:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

انسخه في حاوية نظير الشبكة العاملة، ثم أعد تشغيل تلك الحاوية:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

استخدم `docker ps` لتأكيد اسم الحاوية. في التكديس الناتج، يتم تعريف حاويات نظراء الشبكة بواسطة `./docker-compose.yml`.

## إعادة الالتزام ببداية البلوكشين في شبكة قابلة للاستخدام مرة واحدة {#recommit-genesis-in-a-disposable-network}

يقوم نظير الشبكة بإنشاء أصل البلوكشين فقط عندما يكون التخزين الخاص به فارغًا. بالنسبة لشبكة Docker القابلة للاستخدام لمرة واحدة، أوقف المجموعة، أزل الحالة المولدة، أعد إنشاء أو استبدل حزمة أصل البلوكشين الموقعة، وابدأ مرة أخرى:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

لا تقم باستبدال أصل سلسلة الكتل على شبكة يجب الحفاظ على حالتها.

## استخدام التكوين المخصص {#use-custom-configuration}

تكوين نظير الشبكة الحالي هو TOML. قم بتركيب الربط أو نسخ الملفات المولدة `config.toml`، `genesis.signed.nrt`، والملفات المفتاحية ذات الصلة إلى مسارات الحاوية المتوقعة بواسطة الصورة، ثم أعد تشغيل نظير الشبكة. احتفظ بالملفات المولَّدة معًا؛ فمزج الملفات من تشغيلات مختلفة Kagami يمكن أن يؤدي إلى فشل في إلغاء التسلسل أو فشل في التوافق.
