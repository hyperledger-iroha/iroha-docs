---
translation_locale: ur
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ایک Docker کنٹینر میں گرم ری لوڈ Iroha {#hot-reload-iroha-in-a-docker-container}

ہاٹ ری لوڈ صرف مقامی ڈیبگنگ کے لیے استعمال کریں۔ ایک ہی نظرثانی سے بنی بائنری فائلوں کے ساتھ Docker میں چار توثیقی نوڈ بنانے اور چلانے کے لیے [لانچ Iroha 3](/ur/get-started/launch-iroha.md) کی ہدایات پر عمل کریں۔

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

کنٹینر تلاش کرنے کے لیے `docker ps` استعمال کریں۔ ڈیمن کو تبدیل کرنے سے پہلے امیج میں اس کا راستہ دیکھیں۔

## ایک ڈسپوزایبل نیٹ ورک میں جینیس کو دوبارہ شروع کریں {#recommit-genesis-in-a-disposable-network}

نئے جینیسس بلاک کے لیے نوڈ کا ذخیرہ خالی ہونا چاہیے۔ اسی نیٹ ورک کو دوبارہ شروع کرنے کے لیے پہلے `python3 poc.py down` اور پھر `python3 poc.py up` چلائیں۔ `state/` کو اس کے چاروں Docker والیومز کے ساتھ محفوظ رکھیں۔

## اپنی مرضی کے مطابق ترتیب کا استعمال کریں {#use-custom-configuration}

موجودہ پیر کنفگریشن TOML ہے۔ تیار کردہ `config.toml`، ‏`genesis.signed.nrt` اور متعلقہ کلیدی فائلوں کو امیج کے متوقع کنٹینر راستوں میں ماؤنٹ یا نقل کریں، پھر پیر دوبارہ شروع کریں۔ تیار کردہ فائلوں کو ساتھ رکھیں؛ مختلف Kagami رنز کی فائلیں ملانے سے deserialization یا اتفاقِ رائے ناکام ہو سکتا ہے۔
