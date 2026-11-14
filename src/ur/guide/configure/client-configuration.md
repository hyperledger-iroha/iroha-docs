---
translation_locale: ur
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# کلائنٹ کی ترتیب {#client-configuration}

Iroha CLI اور SDK کلائنٹ TOML ترتیب کا استعمال کرتے ہیں۔ ذخیرہ موجودہ ڈیفالٹ کو `defaults/client.toml` پر بھیجتا ہے۔ پیدا ہونے والے مقامی نیٹ ورک بھی اپنی آؤٹ پٹ ڈائرکٹری میں ایک مماثل `client.toml` لکھتے ہیں.

::: details کلائنٹ ترتیب ٹیمپلیٹ

<<< @/snippets/client.template.toml

:::

## بنیادی فیلڈز {#core-fields}

کلائنٹ کی ترتیب میں کم از کم چین، اس کی نیٹ ورک شناخت، Torii اینڈ پوائنٹ، اکاؤنٹ کا نیٹ ورک سیاق اور دستخطی کلید متعین ہوتے ہیں:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` اس سلسلے کو منتخب کرتا ہے جس میں پیش کردہ ٹرانزیکشنز شامل ہیں۔
- `network_id` جینیسس سے اخذ کردہ نیٹ ورک شناخت ہے، جس سے ہر دستخط شدہ درخواست بندھی ہوتی ہے۔ `network_id` یا `network_id_file` میں سے عین ایک ترتیب دیں؛ نوڈ یہ قدر `GET /v1/accounts/capabilities` پر فراہم کرتا ہے۔
- `torii_url` پیئر پر پوائنٹس Torii HTTP API.
- `[account].chain_discriminant` نیٹ ورک کے I105 اکاؤنٹ سابقے کو منتخب کرتا ہے۔ عوامی نیٹ ورکس اس کے بجائے `[account].profile = "taira"` یا `"minamoto"` استعمال کر سکتے ہیں۔ ان دونوں میں سے ایک لازم ہے، اور خود کینونیکل `AccountId` ڈومین سے آزاد ہے۔
- `[account].public_key` اور `[account].private_key` لین دین پر دستخط کرتے ہیں؛ `private_key_file`، `private_key` کی جگہ لے سکتا ہے۔

اکاؤنٹ پہلے ہی on-chain موجود ہونا چاہیے۔ ڈیفالٹ مقامی نیٹ ورک میں bundled genesis manifest یہ کام کرتا ہے۔

::: info کیس کی حساسیت

Iroha نام کینونیکل تجزیہ کے بعد کیس حساس ہیں۔ مثال کے طور پر ، `wonderland.universal` ، `Wonderland.universal` ، اور `looking_glass.universal` الگ الگ ڈومین لٹریلز ہیں.

:::

## بنیادی تصدیق {#basic-authentication}

اختیاری `[basic_auth]` سیکشن کلائنٹ کی درخواستوں میں ایک HTTP `Authorization` ہیڈر شامل کرتا ہے۔ Iroha نیٹ ورک نوڈ ان اسناد کو براہ راست تشریح نہیں کرتے ہیں۔ جب Torii Nginx جیسے ریورس پراکسی کے پیچھے ہوتا ہے تو ان کا استعمال کریں۔

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## لین دین کی ترتیبات {#transaction-settings}

لین دین کا رویہ `[transaction]` سیکشن کے ساتھ ترتیب دیا گیا ہے:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` ٹرانزیکشن کی زندگی ملی سیکنڈ میں ہے۔
- `status_timeout_ms` کنٹرول کرتا ہے کہ کسٹمر ٹرانزیکشن کی حیثیت کے لئے کتنا انتظار کر رہا ہے۔
- `nonce = true` کلائنٹ سے ایک nonce شامل کرنے کے لئے پوچھتا ہے تاکہ بار بار ٹرانزیکشنز مختلف hashes پیدا کرتے ہیں.

## قطار کی ترتیبات کو مربوط کریں {#connect-queue-settings}

`iroha` CLI مقامی قطار کی حالت کے لیے اختیاری `[connect]` حصہ بھی پڑھتا ہے۔ دوبارہ قابلِ استعمال SDK ترتیب اسے قبول نہیں کرتی:

```toml
[connect]
queue_root = "./queue"
```

اسے اس وقت استعمال کریں جب عمل کو کلائنٹ کی جانب قطار کا پائیدار ذخیرہ درکار ہو۔ `connect.queue_root` کی بنیادی قدر `~/.iroha/connect` ہے، اور نسبتی راستہ کلائنٹ TOML فائل والی ڈائریکٹری سے حل ہوتا ہے۔

## ترتیب پیدا کرنا {#generating-configurations}

disposable مقامی نیٹ ورکس کے لئے، Kagami ترجیح دیتے ہیں کیونکہ یہ میچنگ Iroha 3 configs لکھتا ہے، ابتداء، اسکرپٹس، اور ایک README:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

CLI کے ساتھ پیدا ہونے والی `./localnet/client.toml` کا استعمال کریں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
