---
translation_locale: ar
translation_source: /help/deployment-issues.md
translation_source_hash: c220e127bc8081c9b457dfd67101aa44fb80d79c461cc7a7eda99584d74a8f19
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# استكشاف مشكلات النشر وإصلاحها {#troubleshooting-deployment-issues}

يقدم هذا القسم نصائح لحل المشكلات المتعلقة بنشر Iroha 3. إذا لم يتم وصف المشكلة التي تواجهها هنا، فاتصل بنا عبر [تليغرام](https://t.me/hyperledgeriroha).

## ابدأ بالقطع المولدة {#start-with-generated-artifacts}

للنشر المحلي والاختباري، يُفضل استخدام القطع البرمجية المولَّدة بواسطة Kagami بدلاً من ملفات نظراء الشبكة المكتوبة يدويًا:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

يحتوي الدليل المُنشأ على تكوينات الأقران الشبكيين ومواد التأسيس للبلوكتشين وبرامج البدء و README لخط البناء Iroha 3.

## ند الشبكة لا يبدأ {#peer-does-not-start}

تحقق من هذه العناصر أولاً:

- `iroha3d --config <path>` يشير إلى ملف TOML الخاص بنظير الشبكة.
- `public_key` و `private_key` في إعدادات نظير الشبكة ينتميان إلى زوج المفاتيح نفسه.
- `genesis.public_key` يطابق المفتاح المستخدم لتوقيع معاملة البداية في البلوكشين.
- تستخدم هويات أقران شبكة المدقق المفاتيح BLS-Normal، وتحتوي `trusted_peers_pop` على إدخالات إثبات الملكية للمفتاح المحلي والأقران الموثوقين في الشبكة.
- المنافذ لـ Torii و P2P ليست مرتبطة بالفعل بعملية أخرى.
- دليل متجر Kura ينتمي إلى نفس السلسلة ولم يتم نسخه من ملف تعريف شبكة مختلف.

استخدم تتبع الإعدادات عندما يقرأ الشيطان أكثر من طبقة TOML:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker وتأليف {#docker-and-compose}

قم بإنشاء Compose من ناتج localnet الحالي Kagami بحيث تتطابق وسائط سطر الأوامر وملفات التكوين مع الكود الذي تم التحقق منه:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

إذا بدأت عملية نشر مكون ثم توقفت، فافحص سجلات الخادم لهذه الأسباب:

- غير متطابق `chain`
- زميل شبكة واحد يستخدم معاملة البداية الخاصة بسلسلة كتل مختلفة أو بيان تقني
- العناوين المعلَن عنها P2P التي تعمل فقط داخل شبكة الحاوية
- إعادة استخدام الحجم المحلي بعد إعادة توليد أصل سلسلة الكتل

عند اختبار بلوكشين جديدة من البداية، يجب إزالة وحدات Kura القديمة قبل إعادة تشغيل النظام. الاحتفاظ بتخزين الكتل القديم مع بلوكشين جديدة سيؤدي إلى فشل إعادة التشغيل.

## كوبرنتيس {#kubernetes}

بالنسبة لـ Kubernetes، اعتبر كل مُحقق كبنية تحتية ذات حالة:

- امنح كل نظير في الشبكة مفتاح هوية ثابت وحجم تخزين دائم ثابت
- كشف عناوين P2P التي يمكن لنظراء الشبكة الآخرين حلها من داخل العنقود
- قم بتركيب ملفات تكوين العقدة وملفات البلوكتشين الأصلية كملفات تكوين ثابتة للنشر
- نشر جميع تغييرات البلوكشين في الأصل أو الطوبولوجيا بشكل متعمد، وليس كإعادة تحديث تلقائية لخريطة التكوين

إذا أعيد تشغيل البود بشكل متكرر، قارن التكوين المعروض في البود مع المتوقع [`peer.template.toml`](/ar/reference/peer-config/index.md#template) وتحقق مما إذا كان نظير الشبكة يعيد تشغيل القديم Kura بيانات.

## ملف سوارا {#sora-profile}

ينبغي لعمليات النشر الخاصة أو المحلية Iroha 3 التي تستخدم Nexus، SoraFS، أو التدفقات متعددة المسارات أن تبدأ الخادم القياسي مع تمكين ملف تعريف Sora:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

استخدم نفس الملف الشخصي بشكل متسق عبر المصادقين في نفس الشبكة.

يستخدم المدققون العامون Taira المشغل المخصص، الذي يفرض سلسلة Taira الدقيقة، والقائمة، والتخزين المدمج المعطل-SoraFS، وملف تعريف موقع التشغيل. تحقق من صحة تكوين Taira المعروض قبل تشغيله:

```bash
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

لا تبدأ منشورًا عامًا Taira المحقق العام `iroha3d`; رَأَى الـ [`iroha3d` CLI مرجع](/ar/reference/iroha3d-cli.md) للاتباع الملف الشخصي المفروض.
