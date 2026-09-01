---
translation_locale: ur
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ایک Docker کنٹینر میں گرم ری لوڈ Iroha {#hot-reload-iroha-in-a-docker-container}

hot reload صرف مقامی debugging کے لیے استعمال کریں۔ عام مقامی development میں image دوبارہ build کرنے یا تازہ Kagami bundle سے بنے Docker Compose stack کو restart کرنے کو ترجیح دیں۔

## نیٹ ورک نوڈ بائنری کو تبدیل کریں {#replace-the-peer-binary}

اپ اسٹریم ورک اسپیس سے لینکس کے ساتھ ہم آہنگ ڈیمون بائنری بنائیں:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

اسے ایک چلنے والے نیٹ ورک نوڈ کنٹینر میں کاپی کریں، پھر اس کنٹینئر کو دوبارہ شروع کریں:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

کنٹینر کے نام کی تصدیق کرنے کے لئے `docker ps` کا استعمال کریں۔ پیدا ہونے والے اسٹیک میں نیٹ ورک نوڈ کنٹینرز کو `./docker-compose.yml` سے بیان کیا گیا ہے.

## ایک ڈسپوزایبل نیٹ ورک میں جینیس کو دوبارہ شروع کریں {#recommit-genesis-in-a-disposable-network}

ایک peer صرف اس وقت genesis commit کرتا ہے جب اس کا storage خالی ہو۔ disposable Docker network کے لیے stack روکیں، بنائی گئی state ہٹائیں، signed genesis bundle دوبارہ بنائیں یا بدلیں، اور پھر آغاز کریں:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

کسی ایسے نیٹ ورک پر پیدائش کی جگہ نہ لیں جس کی حالت کو برقرار رکھنا ضروری ہو۔

## اپنی مرضی کے مطابق ترتیب کا استعمال کریں {#use-custom-configuration}

موجودہ پیر کنفگریشن TOML ہے۔ تیار کردہ `config.toml`، ‏`genesis.signed.nrt` اور متعلقہ کلیدی فائلوں کو امیج کے متوقع کنٹینر راستوں میں ماؤنٹ یا نقل کریں، پھر پیر دوبارہ شروع کریں۔ تیار کردہ فائلوں کو ساتھ رکھیں؛ مختلف Kagami رنز کی فائلیں ملانے سے deserialization یا اتفاقِ رائے ناکام ہو سکتا ہے۔
