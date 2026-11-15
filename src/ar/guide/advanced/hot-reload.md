---
translation_locale: ar
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 6edc0185196ab8e77ef8552723e05bf37cca1a088da86e2a43d441d58e779c11
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# إعادة التحميل الساخن Iroha في حاوية Docker {#hot-reload-iroha-in-a-docker-container}

استخدم إعادة التحميل الفوري للتنقيح المحلي فقط. اتبع دليل [إطلاق Iroha 3](/ar/get-started/launch-iroha.md) لبناء أربع عقد تحقق وتشغيلها في Docker باستخدام ملفات تنفيذية من المراجعة نفسها.

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

استخدم `docker ps` للعثور على الحاوية. تحقّق من مسار البرنامج الخدمي داخل الصورة قبل استبداله.

## إعادة الالتزام ببداية البلوكشين في شبكة قابلة للاستخدام مرة واحدة {#recommit-genesis-in-a-disposable-network}

يتطلب إنشاء كتلة تأسيس جديدة أن تكون مساحة تخزين العقدة فارغة. لإعادة تشغيل الشبكة نفسها، استخدم `python3 poc.py down` ثم `python3 poc.py up`. احتفظ بالدليل `state/` مع وحدات تخزين Docker الأربع الخاصة بالشبكة.

## استخدام التكوين المخصص {#use-custom-configuration}

تكوين نظير الشبكة الحالي هو TOML. يكتب Kagami ملف `peerN.toml` واحدًا لكل مدقق يتضمن `genesis.signed.nrt` و`genesis.public_key` و`genesis.expected_hash`؛ ويقوم ملف Compose الناتج عن `kagami docker` بتركيبها داخل الحاوية. أعد توليده بدلًا من نسخ الملفات يدويًا، ثم أعد تشغيل نظير الشبكة. احتفظ بالملفات المولَّدة معًا؛ فمزج الملفات من تشغيلات Kagami مختلفة يمكن أن يؤدي إلى فشل في إلغاء التسلسل أو فشل في التوافق.
