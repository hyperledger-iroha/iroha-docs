---
translation_locale: ar
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: bing-translator-llm
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

تكوين نظير الشبكة الحالي هو TOML. قم بتركيب الربط أو نسخ الملفات المولدة `config.toml`، `genesis.signed.nrt`، والملفات المفتاحية ذات الصلة إلى مسارات الحاوية المتوقعة بواسطة الصورة، ثم أعد تشغيل نظير الشبكة. احتفظ بالملفات المولَّدة معًا؛ فمزج الملفات من تشغيلات مختلفة Kagami يمكن أن يؤدي إلى فشل في إلغاء التسلسل أو فشل في التوافق.
