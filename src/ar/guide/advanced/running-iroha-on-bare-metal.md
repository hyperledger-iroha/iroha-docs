---
translation_locale: ar
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# تشغيل Iroha على المعدات العارية {#running-iroha-on-bare-metal}

استخدم هذه التدفقات العملية عندما ترغب في تشغيل الأقران مباشرة على المضيفين بدلاً من خلال Docker Compose. توفر شجرة المصدر الحالية Kagami مولدات تكتب جنيس متطابقة ، وتكوينات الأقران ، وتكوينا العملاء ، ونصائح البدء / الإيقاف.

## 1 - بناء الثنائيات {#_1-build-the-binaries}

من مساحة العمل Iroha المتقدمة:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

هذا ينتج:

- `target/release/iroha3d` لـ (دايمون) الأقران
- `target/release/iroha` لـ CLI
- `target/release/kagami` لتوليد المفاتيح والتكوين والشبكات المحلية

## إنشاء شبكة محلية {#_2-generate-a-local-network}

إنشاء شبكة محلية من أربعة أشرطة Iroha 3:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

يحتوي السجل الخارجي على ملفات `genesis.json` ، `genesis.signed.nrt`، وملفات `config.toml` ذات الصلة، `client.toml`، وسكريبتات المساعدة، و`README.md` التي تم إنشاؤها مع أوامر دقيقة لهذا الحزمة.

## 3- ابدأ أقرانهم {#_3-start-peers}

لإنشاء شبكة محلية قابلة للتخلص منها، استخدم النص المولود:

```bash
./localnet/start.sh
```

إذا كنت بحاجة إلى توصيل كل نظير في مدير العمليات مثل systemd، استخدم أمر الإطلاق المسجل في `./localnet/README.md` لكل نظير. حافظ على كل نظير `config.toml` ، المفتاح الخاص ، دليل التخزين ، والموانئ منفصلة .

## 4 - تشغيل الشبكة {#_4-operate-the-network}

استخدم إعداد العميل الذي تم إنتاجه:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

أوقف الشبكة المحلية التي تم إنشاؤها بواسطة:

```bash
./localnet/stop.sh
```

## 5 - ملاحظات الإنتاج {#_5-production-notes}

- إنتاج مفاتيح خاصة جديدة لإنتاجها وتخزينها خارج المستودع.
- اجعل كل أقرانه يوافقون على نفس المعاملة التواريخية الموقعة ، والترتيبات ، والأقران الموثوقين ، والمؤكد PoPs.
- إرتبط المستمع باللواح المحلية للمضيف فقط عندما لا يمكن الوصول إلى النظير من الآلات الأخرى.
- استخدم بروكسي معاكس أو جدار حماية لمواجهة Torii ، أساسي auth ، TLS ، وتقييد المعدل.
- التعامل مع التغييرات في الأصل أو توبولوجيات الإجماع على أنها هجرة منسقة، وليس تحرير ملف واحد.

للتطوير المحلي المتعدد الحاويات، استخدم تدفق العمل [إطلاق Iroha 3](../../get-started/launch-iroha.md) Docker Compose.
