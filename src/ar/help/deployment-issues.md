---
translation_locale: ar
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# حل المشاكل في التنفيذ {#troubleshooting-deployment-issues}

يقدم هذا القسم نصائح حل المشاكل Iroha 3 إذا كانت المسألة
لا يوصف هنا ما تجري
اتصل بنا عبر [تلغرام](https://t.me/hyperledgeriroha).

## ابدأ بأشياء مصنوعة {#start-with-generated-artifacts}

بالنسبة للتنفيذ المحلي والاختبار، تفضل الأثرية التي تم إنشاؤها بواسطة Kagami بدلاً من ذلك
الملفات ذات الصلة المكتوبة يدوياً:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

المجلد الذي تم إنشاؤه يحتوي على تشكيلات الأقران، مواد التكوين، البداية
النصوص ، و README لـ Iroha 3 خط بناء.

## لا تبدأ الزملاء {#peer-does-not-start}

تحقق من هذه العناصر أولاً:

- `irohad --config <path>` النقاط في بلد الأقران TOML الملف.
- `public_key` و `private_key` في إعداد الأقران ينتمون إلى نفس المفتاح
  زوج.
- `genesis.public_key` يطابق المفتاح الذي استخدم لتوقيع معاملة التكوين.
- استخدام هويات الأقران المؤكد BLS-المفاتيح العادية، `trusted_peers_pop`
  يحتوي على إدخالات إثبات حيازة المفتاح المحلي وأقران موثوق بهم.
- الموانئ Torii و P2P لا تتعلق بالفعل بعملية أخرى.
- الموقع Kura سجل المتاجر ينتمي إلى نفس السلسلة ولم يتم نسخها من
  ملف شبكة مختلف.

استخدم تعقب الإعدادات عندما يقرأ الديمون أكثر من واحد TOML الطبقة:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker و"تأليف" {#docker-and-compose}

توليد التركيب من التيار Kagami إنتاج الشبكة المحلية لذلك خط الأوامر
الحجج وملفات التكوين تتطابق مع رمز الخروج:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

إذا بدأ تنفيذ التكوين ثم توقف، تحقق من سجلات الديمون ل:

- غير متطابقة `chain`
- أحد الأقران يستخدمون معاملة أو إشارة مختلفة
- الإعلانات P2P العناوين التي تعمل فقط داخل شبكة الحاويات
- إعادة استخدام الحجم المحلي بعد إعادة التكوين

عند اختبار جينيسة جديدة، إزالة القديمة Kura الكميات قبل إعادة التشغيل
الحفاظ على الكتل القديمة في التخزين مع جنيس جديد سيجعلها تفشل

## كوبرنيتس {#kubernetes}

بالنسبة لـ (كوبرنيتس) ، اعتبروا كل مؤكد على أنه بنية تحتية مملوكة للدولة:

- إعطاء كل نسبة أرقام هوية مستقرة ومعدل مستمر
- الكشف P2P العناوين التي يمكن أن يحل بها الأقران الآخرون من داخل الكluster
- وضع ملفات الإعداد والتكوين كإعداد لا يمكن تغييره لتنفيذ
- تنفيذ جميع التغييرات في الجينيز أو الطوبولوجيا عمداً ، وليس كإجراء تلقائي
  تحديث خريطة الإعداد

إذا بدأت القنبلة مراراً وتكراراً، قم بمقارنة الإعدادات المقدمة في القنبلة مع
المتوقع [`peer.template.toml`](/ar/reference/peer-config/index.md#template) و
تحقق ما إذا كان الزميل يعيد تشغيل القديم Kura البيانات

## ملف سورا {#sora-profile}

Iroha 3 التنفيذات التي تستخدم Nexus, SoraFS, أو يجب أن تبدأ تدفقات متعددة المسارات
الديمون مع ملف سورا تمكين:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

استخدم نفس الشخصية باستمرار عبر المحققين في نفس الشبكة.
