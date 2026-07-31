---
translation_locale: ur
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# لانچنگ Iroha 3 {#launch-iroha-3}

یہ صفحہ Iroha 3 کے لئے موجودہ مقامی نیٹ ورک فلو کو اپ اسٹریم ریپوزٹری سے پہلے سے طے شدہ کام کی جگہ اثاثوں کا استعمال کرتے ہوئے چلتا ہے۔

## 1۔ ایک مقامی کثیر ہم مرتبہ نیٹ ورک بنائیں {#_1-generate-a-local-multi-peer-network}

موجودہ Kagami کوڈ سے چار پیر لوکل نیٹ پیدا کریں:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

آؤٹ پٹ ڈائرکٹری میں مماثل ہم مرتبہ ترتیب، `genesis.json`، `genesis.signed.nrt`، `client.toml`، اور مددگار اسکرپٹس شامل ہیں.

مقامی دھواں کے ٹیسٹ کے لئے، براہ راست پیدا کردہ ہم مرتبہ شروع کریں:

```bash
./localnet/start.sh
```

ایک کنٹینر چلانے کے لئے، اسی مقامی نیٹ ورک ڈائرکٹری سے تخلیق کریں:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

ڈیفالٹ کے طور پر پیدا کردہ اسٹیک:

- ہم مرتبہ P2P بندرگاہوں `1337` سے `1340`
- Torii HTTP بندرگاہوں `8080` سے `8083`
- `./localnet/client.toml` پر ایک تیار کلائنٹ ترتیب

## 2۔ تصدیق کریں کہ نیٹ ورک فعال ہے یا نہیں۔ {#_2-verify-that-the-network-is-up}

پہلے ہم مرتبہ پر اسٹیٹس اختتامی نقطہ چیک کریں:

```bash
curl http://127.0.0.1:8080/status
```

ڈیفالٹ صحت کی جانچ میں بھی استعمال کیا جاتا ہے:

```bash
curl http://127.0.0.1:8080/status/blocks
```

آپ فوری طور پر CLI کی طرف اشارہ کر سکتے ہیں bundled کلائنٹ ترتیب:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Nexus پروفائل {#_3-nexus-profile}

ذخیرہ بھی SORA Nexus پر مبنی ترتیب پروفائل کو `defaults/nexus/` کے تحت بھیجتا ہے.

Nexus پروفائل کے ساتھ ایک مقامی ہم مرتبہ چلانے کے لئے:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

اس پروفائل تک CLI رسائی کے لیے `defaults/nexus/client.toml` کا استعمال کریں۔

## 4۔ مقامی نیٹ ورک کو بند کر دیں {#_4-stop-the-local-network}

مقامی طور پر پیدا ہونے والے لوکل نیٹ ورک کے لئے:

```bash
./localnet/stop.sh
```

پیدا کردہ کمپوز اسٹیک کے لئے:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

نیٹ ورک چلانے کے بعد، [Operate Iroha 3 via CLI](/ur/get-started/operate-iroha-via-cli.md) کے ذریعے جاری رکھیں.
