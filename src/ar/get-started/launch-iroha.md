---
translation_locale: ar
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# إطلاق Iroha 3 {#launch-iroha-3}

هذه الصفحة تمر عبر التدفق الحالي للشبكة المحلية ل Iroha 3 باستخدام أصول مساحة العمل الافتراضية من مستودع الأعلى.

## 1. إنشاء شبكة محلية متعددة الأقران {#_1-generate-a-local-multi-peer-network}

إنشاء شبكة محلية من أربعة أجنحة من الرمز الحالي Kagami:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

يحتوي المجلد الخارجي على تكوينات الأقران المتطابقة، `genesis.json` ، `genesis.signed.nrt` ، `client.toml` ، والكلمات المساعدة.

لإجراء اختبار دخان محلي، ابدأ الأقران المولودين مباشرةً:

```bash
./localnet/start.sh
```

لإجراء تشغيل حاوية ، قم بتوليد Compose من نفس دليل localnet:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

الكمبيوتر الذي تم إنشاؤه افتراضيًا يعرض:

- الموانئ المتساوية P2P `1337` إلى `1340`
- Torii HTTP الموانئ `8080` إلى `8083`
- إعدادات العميل جاهزة عند `./localnet/client.toml`

## التحقق من أن الشبكة تعمل {#_2-verify-that-the-network-is-up}

تحقق من النقطة النهائية للحالة على الزميل الأول:

```bash
curl http://127.0.0.1:8080/status
```

التفتيشات الصحية الافتراضية تستخدم أيضاً:

```bash
curl http://127.0.0.1:8080/status/blocks
```

يمكنك توجيه CLI على الفور إلى تكوين العميل المجمّع:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus الملف الشخصي {#_3-nexus-profile}

يقوم المخبز أيضًا بإرسال ملف تعيين SORA Nexus الموجه إلى `defaults/nexus/`.

لإدارة نظير محلي مع ملف Nexus:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

استخدام `defaults/nexus/client.toml` للوصول إلى CLI لهذا الملف الشخصي.

## 4- إيقاف الشبكة المحلية {#_4-stop-the-local-network}

للشبكة المحلية التي تم إنشاؤها محلياً:

```bash
./localnet/stop.sh
```

بالنسبة لمجموعة Compose المتولدة:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

بعد تشغيل الشبكة، استمر في [تشغيل Iroha 3 عبر CLI](/ar/get-started/operate-iroha-via-cli.md).
