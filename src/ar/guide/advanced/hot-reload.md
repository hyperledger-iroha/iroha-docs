---
translation_locale: ar
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: d4fd88de377b9c88e0293ed07f307ad38c3f8b05ed898fd051c5bfb738d66681
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

لا تقم باستبدال أصل سلسلة الكتل على شبكة يجب الحفاظ على حالتها.

## استخدام التكوين المخصص {#use-custom-configuration}

تكوين نظير الشبكة الحالي هو TOML. قم بتركيب الربط أو نسخ الملفات المولدة `config.toml`، `genesis.signed.nrt`، والملفات المفتاحية ذات الصلة إلى مسارات الحاوية المتوقعة بواسطة الصورة، ثم أعد تشغيل نظير الشبكة. احتفظ بالملفات المولَّدة معًا؛ فمزج الملفات من تشغيلات مختلفة Kagami يمكن أن يؤدي إلى فشل في إلغاء التسلسل أو فشل في التوافق.
