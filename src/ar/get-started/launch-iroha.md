---
translation_locale: ar
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# إطلاق Iroha 3 {#launch-iroha-3}

تستعرض هذه الصفحة تدفق الشبكة المحلية الحالي لـ Iroha 3 باستخدام أصول مساحة العمل الافتراضية من المستودع العلوي.

## ١. إنشاء شبكة محلية متعددة الأقران {#_1-generate-a-local-multi-peer-network}

إنشاء شبكة محلية من أربعة أقران من الشيفرة الحالية Kagami:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

يحتوي دليل الإخراج على تكوينات أقران الشبكة المطابقة، `genesis.json`، `genesis.signed.nrt`، `client.toml`، وسيناريوهات مساعدة.

لاختبار دخان محلي أصلي، ابدأ نظراء الشبكة المولدة مباشرة:

```bash
./localnet/start.sh
```

لتشغيل مع الحاويات، قم بإنشاء ملف Compose من نفس دليل localnet:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

النسخة الافتراضية المولدة من الستاك تكشف عن:

- الند للشبكة P2P المنافذ `1337` إلى `1340`
- Torii HTTP يربط `8080` بـ `8083`
- تكوين عميل جاهز عند `./localnet/client.toml`

## 2. تحقق من أن الشبكة تعمل {#_2-verify-that-the-network-is-up}

تحقق من حالة نقطة النهاية API على النظير الشبكي الأول:

```bash
curl http://127.0.0.1:8080/status
```

تستخدم فحوصات الصحة الافتراضية أيضًا:

```bash
curl http://127.0.0.1:8080/status/blocks
```

يمكنك توجيه CLI فورًا نحو تكوين العميل المرفق:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus الملف الشخصي {#_3-nexus-profile}

يقوم المستودع أيضًا بشحن ملف تكوين موجه نحو SORA Nexus تحت `defaults/nexus/`.

لتشغيل نظير شبكة محلي باستخدام ملف التعريف Nexus:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

استخدم `defaults/nexus/client.toml` للوصول إلى ذلك الملف الشخصي CLI.

## 4. أوقف الشبكة المحلية {#_4-stop-the-local-network}

لشبكة محلية تم إنشاؤها محليًا:

```bash
./localnet/stop.sh
```

للحزمة المُنشأة من Compose:

```bash
docker compose -f ./docker-compose.yml down
```

بعد تشغيل الشبكة، تابع مع [شغّل Iroha 3 عبر CLI](/ar/get-started/operate-iroha-via-cli.md).
