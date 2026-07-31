---
translation_locale: ur
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ایک Docker کنٹینر میں گرم ری لوڈ Iroha {#hot-reload-iroha-in-a-docker-container}

صرف مقامی ڈیبگنگ کے لئے گرم ری لوڈ کا استعمال کریں۔ عام مقامی ترقی کے ل the ، تصویر کی تعمیر نو یا نئے Kagami بنڈل سے پیدا کردہ Docker Compose اسٹیک کو دوبارہ شروع کرنا ترجیح دیں۔

## ہم مرتبہ بائنری کو تبدیل کریں {#replace-the-peer-binary}

اپ اسٹریم ورک اسپیس سے لینکس کے ساتھ ہم آہنگ ڈیمون بائنری بنائیں:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

اسے ایک چلنے والے ہم مرتبہ کنٹینر میں کاپی کریں، پھر اس کنٹینئر کو دوبارہ شروع کریں:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

کنٹینر کے نام کی تصدیق کرنے کے لئے `docker ps` کا استعمال کریں۔ پیدا ہونے والے اسٹیک میں ہم مرتبہ کنٹینرز کو `./localnet/docker-compose.yml` سے بیان کیا گیا ہے.

## ایک ڈسپوزایبل نیٹ ورک میں جینیس کو دوبارہ شروع کریں {#recommit-genesis-in-a-disposable-network}

ایک ہم مرتبہ صرف اس وقت پیدائش کرتا ہے جب اس کا اسٹوریج خالی ہو۔ ایک disposable Docker نیٹ ورک کے ل the ، اسٹیک کو روکیں ، پیدا شدہ حالت کو ہٹا دیں ، دستخط شدہ پیدائش بنڈل کی بحالی یا تبدیلی کریں ، اور دوبارہ شروع کریں۔

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

کسی ایسے نیٹ ورک پر پیدائش کی جگہ نہ لیں جس کی حالت کو برقرار رکھنا ضروری ہو۔

## اپنی مرضی کے مطابق ترتیب کا استعمال کریں {#use-custom-configuration}

موجودہ پیئر ترتیب TOML ہے۔ پیدا کردہ `config.toml` ، `genesis.signed.nrt`، اور متعلقہ کلیدی فائلوں کو تصویر کے ذریعہ متوقع کنٹینر راستے میں باندھیں یا کاپی کریں ، پھر پیئر کو دوبارہ شروع کریں۔ پیدا کردہ فائلوں کو ایک ساتھ رکھیں؛ مختلف Kagami رن سے فائلوں کو ملا کر deserialization یا اتفاق رائے کی ناکامی کا سبب بن سکتی ہے.
