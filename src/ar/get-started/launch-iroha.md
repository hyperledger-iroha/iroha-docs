---
translation_locale: ar
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# إطلاق Iroha 3 {#launch-iroha-3}

هذه الصفحة تسير عبر تدفق الشبكة المحلية الحالية Iroha 3 باستخدام
أصول مساحة العمل الافتراضية من مستودع الصعود.

## 1. إنشاء شبكة محلية متعددة الأقران {#_1-generate-a-local-multi-peer-network}

إنشاء شبكة محلية من أربعة أشرطة من التيار Kagami الرمز:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

المجلد الخارجي يحتوي على تكوينات أقرانه متطابقة، `genesis.json`,
`genesis.signed.nrt`, `client.toml`, والنصوص المساعدة.

لاختبار الدخان المحلي الأصلي، ابدأ الأقران المولودين مباشرة:

```bash
./localnet/start.sh
```

لإجراء تشغيل حاوية، إنشاء Compose من نفس دليل localnet:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

تعرض كومة النشطات المتخلفة:

- الزملاء P2P الموانئ `1337` إلى `1340`
- Torii HTTP الموانئ `8080` إلى `8083`
- إعداد العميل جاهز في `./localnet/client.toml`

## التحقق من أن الشبكة تعمل {#_2-verify-that-the-network-is-up}

تحقق من النقطة النهائية للحالة على الزميل الأول:

```bash
curl http://127.0.0.1:8080/status
```

التحققات الصحية الافتراضية تستخدم أيضاً:

```bash
curl http://127.0.0.1:8080/status/blocks
```

يمكنك أن تشير على الفور CLI في إعداد العميل المجمّع:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus الملف الشخصي {#_3-nexus-profile}

المخزن أيضاً يرسل SORA Nexus-ملف تشكيل موجه تحت
`defaults/nexus/`.

لإدارة زميل محلي مع Nexus الملف:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

الاستخدام `defaults/nexus/client.toml` لـ CLI الوصول إلى هذا الملف الشخصي.

## 4 - توقف الشبكة المحلية {#_4-stop-the-local-network}

للشبكة المحلية التي تم إنشاؤها بشكل محلي:

```bash
./localnet/stop.sh
```

بالنسبة لمجموعة Compose التي تم توليها:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

بعد تشغيل الشبكة، استمر
[التشغيل Iroha 3 عبر CLI](/ar/get-started/operate-iroha-via-cli.md).
