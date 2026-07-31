---
translation_locale: ar
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# إصلاح مشكلات الإرسال {#troubleshooting-deployment-issues}

يقدم هذا القسم نصائح لحل المشاكل لتنفيذ Iroha 3. إذا لم يتم وصف المشكلة التي تواجهها هنا، اتصل بنا عبر [Telegram](https://t.me/hyperledgeriroha).

## البدء مع الأثاث التي تم إنشاؤها {#start-with-generated-artifacts}

بالنسبة للتنفيذ المحلي والاختباري، تفضل الأثرية التي تم إنشاؤها بواسطة Kagami بدلاً من الملفات ذات الصلة المكتوبة يدوياً:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

يحتوي المجلد الذي تم إنشاؤه على إعدادات الأقران، ومادة التكوين، ونصوص البدء، و README لخط بناء Iroha 3.

## لا تبدأ الزملاء {#peer-does-not-start}

تحقق من هذه العناصر أولاً:

- `irohad --config <path>` نقاط في ملف الزملاء الخاص بهم TOML.
- `public_key` و `private_key` في تكوين الأقران ينتمون إلى نفس زوج المفاتيح.
- `genesis.public_key` يطابق المفتاح الذي استخدم لتوقيع معاملة الجينز.
- استخدام BLS - المفاتيح العادية، و `trusted_peers_pop` يحتوي على إدخالات دليل على حيازة للمفتاح المحلي والأقران الموثوقين.
- الموانئ Torii و P2P ليست مرتبطة بالفعل بعملية أخرى.
- سجل المتاجر Kura ينتمي إلى نفس السلسلة ولم يتم نسخها من ملف شبكة مختلف.

استخدم تعقب الإعدادات عندما يقرأ الديمون أكثر من طبقة واحدة TOML:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker و تكوين {#docker-and-compose}

توليد التركيب من النتائج الحالية Kagami للشبكة المحلية بحيث تتطابق حجج خط الأوامر وملفات التكوين مع رمز الخروج:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

إذا بدأ تنفيذ التجميع ثم توقف، تحقق من سجلات الديمون ل:

- غير ملائمة `chain`
- أحد الأقران يستخدمون معاملة أو إشارة مختلفة
- العناوين P2P المعلنة التي تعمل فقط داخل شبكة الحاويات
- إعادة استخدام الكمية المحلية بعد إعادة التكوين

عند اختبار جينيزة جديدة، إزالة المكونات القديمة Kura قبل إعادة تشغيل كومة. الحفاظ على تخزين الكتل القديمة مع جينيسة جديدة سوف تجعل الرد فشل.

## كوبرنيتس {#kubernetes}

بالنسبة لـ "كوبرنيتس"، تعامل كل مؤكد كبنية تحتية مملوكة للدولة:

- إعطاء كل نظير مفتاح هوية مستقرة ومعدل ثابت مستمر
- الكشف عن عناوين P2P التي يمكن أن يحلّها الأقران الآخرون من داخل المجموعة
- وضع ملفات الإعداد والتكوين كإعداد لا يمكن تغييره لتنفيذ
- تنفيذ جميع التغييرات الجينسية أو الطوبولوجية عمداً ، وليس كتحديث تلقائي لخريطة الإعداد

إذا تم إعادة تشغيل القنبلة مراراً وتكراراً، قم بمقارنة الإعدادات المقدمة في القنبلة مع المتوقع [`peer.template.toml`](/ar/reference/peer-config/index.md#template) ومراجعة ما إذا كان النظير يعيد تشغيل البيانات القديمة Kura.

## ملف سورا {#sora-profile}

Iroha 3 التنفيذات التي تستخدم Nexus، SoraFS، أو تدفقات متعددة المسارات يجب أن تبدأ الديمون مع تمكين ملف Sora:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

استخدم نفس الملف الشخصي باستمرار عبر المؤكدين في نفس الشبكة.
