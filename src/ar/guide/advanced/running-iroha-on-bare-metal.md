---
translation_locale: ar
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 886da937d92563cea49355fdccd411fc74d397fea28b521711e9089c8b047280
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# تشغيل Iroha على العتاد الصافي {#running-iroha-on-bare-metal}

استخدم هذا سير العمل عندما تريد تشغيل نظراء الشبكة مباشرة على المضيفين بدلاً من خلال Docker Compose. يوفر مصدر الشجرة الحالي مولدات Kagami التي تكتب إنشاء البلوكشين المطابق، تكوينات نظراء الشبكة، تكوين العميل، وسكريبتات التشغيل/الإيقاف.

## 1. بناء الملفات الثنائية {#_1-build-the-binaries}

من مساحة العمل العليا Iroha:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

هذا ينتج:

- `target/release/iroha3d` لخادم النظراء بالشبكة
- `target/release/iroha` لـ CLI
- `target/release/kagami` للمفتاح، وتكوين البلوكتشين، وتوليد الشبكة المحلية

## 2. توليد شبكة محلية {#_2-generate-a-local-network}

إنشاء شبكة محلية من أربعة أقران Iroha 3:

```bash
target/release/kagami localnet generate --peers 4 --out-dir ./localnet
```

يحتوي دليل الإخراج على الملفات المولدة `genesis.json` و`genesis.signed.nrt` و`genesis.expected_hash`، وملف `peerN.toml` واحد لكل مدقق، و`client.toml`، والبرنامجين النصيين `start.sh` و`stop.sh`، وملف `README.md` مولَّد يتضمن الأوامر الدقيقة لتلك الحزمة.

## 3. بدء أقران الشبكة {#_3-start-peers}

لشبكة محلية مولدة قابلة للتخلص، استخدم السكريبت المولد:

```bash
./localnet/start.sh
```

إذا كنت بحاجة إلى توصيل كل نظير شبكة بمدير عمليات مثل systemd، فاتبع الأمر الخاص بكل نظير في `./localnet/start.sh`: شغّل `iroha3d --config <bundle>/peerN.toml` من `<bundle>/state/peerN`، ومرّر `--sumeragi-assert-fresh-key` فقط عند أول تشغيل لذلك النظير. حافظ على فصل `peerN.toml` لكل نظير شبكة والمفتاح الخاص ودليل التخزين والمنافذ.

## 4. تشغيل الشبكة {#_4-operate-the-network}

استخدم إعدادات العميل المولدة:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list --all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

أوقف الشبكة المحلية المولدة باستخدام:

```bash
./localnet/stop.sh
```

## ٥. ملاحظات الإنتاج {#_5-production-notes}

- قم بإنشاء مفاتيح خاصة جديدة للإنتاج وقم بتخزينها خارج المستودع.
- اجعل كل نظير في الشبكة يوافق على نفس معاملة البداية الموقعة للبلوك تشين، والتوبولوجيا، والنظراء الموثوقين في الشبكة، والمصادق PoPs.
- قم بربط عناوين المستمع بالواجهات المحلية للمضيف فقط عندما لا ينبغي أن يكون من الممكن الوصول إلى نظير الشبكة من أجهزة أخرى.
- استخدم وكيل عكسي أو جدار حماية للتعامل مع تعرض Torii، والمصادقة الأساسية، و TLS، وتحديد معدل الطلبات.
- اعتبر تغييرات البلوكشين في الأصل أو طوبولوجيا التوافق على أنها هجرات منسقة، وليس تعديلات على ملفات لمستخدم واحد.

لتطوير التطبيقات المحلية باستخدام الحاويات، استخدم سير العمل [إطلاق Iroha 3](../../get-started/launch-iroha.md) Docker Compose.
