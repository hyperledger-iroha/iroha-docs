---
translation_locale: ur
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# کلائنٹ کی ترتیب {#client-configuration}

Iroha CLI اور SDK کلائنٹ TOML ترتیب کا استعمال کرتے ہیں۔ ذخیرہ موجودہ ڈیفالٹ کو `defaults/client.toml` پر بھیجتا ہے۔ پیدا ہونے والے مقامی نیٹ ورک بھی اپنی آؤٹ پٹ ڈائرکٹری میں ایک مماثل `client.toml` لکھتے ہیں.

::: details کلائنٹ ترتیب ٹیمپلیٹ

<<< @/snippets/client.template.toml

:::

## بنیادی فیلڈز {#core-fields}

کم از کم، ایک کلائنٹ ترتیب سلسلہ، Torii اختتامی نقطہ اور دستخط اکاؤنٹ کی شناخت کرتا ہے:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` اس سلسلے کو منتخب کرتا ہے جس میں پیش کردہ ٹرانزیکشنز شامل ہیں۔
- `torii_url` پیئر پر پوائنٹس Torii HTTP API.
- `[account].domain` کو CLI شارٹ کٹس اور ایڈریس سلیکٹر کوڈنگ کے ذریعہ استعمال کیا جاتا ہے۔ کینونیکل `AccountId` خود ڈومین لیس ہے۔
- `[account].public_key` اور `[account].private_key` ٹرانزیکشنز پر دستخط کریں۔

اکاؤنٹ پہلے ہی آن لائن ہونا ضروری ہے۔ ڈیفالٹ لوکل نیٹ ورک کے ل this یہ بنڈل جینس مینفیس کی طرف سے سنبھالا جاتا ہے۔

::: info کیس کی حساسیت

Iroha نام کینونیکل تجزیہ کے بعد کیس حساس ہیں۔ مثال کے طور پر ، `wonderland.universal` ، `Wonderland.universal` ، اور `looking_glass.universal` الگ الگ ڈومین لٹریلز ہیں.

:::

## بنیادی تصدیق {#basic-authentication}

اختیاری `[basic_auth]` سیکشن کلائنٹ کی درخواستوں میں ایک HTTP `Authorization` ہیڈر شامل کرتا ہے۔ Iroha ہم مرتبہ ان اسناد کو براہ راست تشریح نہیں کرتے ہیں۔ جب Torii Nginx جیسے ریورس پراکسی کے پیچھے ہوتا ہے تو ان کا استعمال کریں۔

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

موجودہ Iroha کلائنٹس مقامی قطار کی حالت کے لئے اختیاری `[connect]` سیکشن کا بھی استعمال کرسکتے ہیں:

```toml
[connect]
queue_root = "./queue"
```

جب کام کے بہاؤ کو کلائنٹ کی طرف سے پائیدار قطار اسٹوریج کی ضرورت ہو تو اس کا استعمال کریں.

## ترتیب پیدا کرنا {#generating-configurations}

disposable مقامی نیٹ ورکس کے لئے، Kagami ترجیح دیتے ہیں کیونکہ یہ میچنگ Iroha 3 configs لکھتا ہے، ابتداء، اسکرپٹس، اور ایک README:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

CLI کے ساتھ پیدا ہونے والی `./localnet/client.toml` کا استعمال کریں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
