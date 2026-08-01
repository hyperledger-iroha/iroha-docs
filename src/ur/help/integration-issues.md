---
translation_locale: ur
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# انضمام کے مسائل کو حل کرنا {#troubleshooting-integration-issues}

اس سیکشن میں Iroha 3 انضمام کے لئے خرابیوں سے نمٹنے کے نکات پیش کیے گئے ہیں۔ اگر آپ کا مسئلہ یہاں بیان نہیں کیا گیا ہے تو ، ہم سے رابطہ کریں [ٹیلیگرام](https://t.me/hyperledgeriroha).

## کلائنٹ رابطہ قائم نہیں کر سکتے {#client-cannot-connect}

چیک کریں کہ کلائنٹ کی ترتیب پیئر کے Torii ایڈریس کی طرف اشارہ کرتی ہے:

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI چیک کے لئے، واضح طور پر ایک ہی فائل کو منتقل کریں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

اگر ہم مرتبہ Docker یا Kubernetes میں چلتا ہے، تو میزبان یا سروس ایڈریس کا استعمال کریں جو کلائنٹ کے عمل سے قابل رسائی ہے۔ ایک کنٹینر کے اندر `127.0.0.1` میزبان مشین نہیں ہے.

عوامی Taira ٹیسٹ کے لئے، ایک غیر دستخط شدہ اختتامی نقطہ نظر کی تحقیقات سے شروع کریں:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

اگر یہ کمانڈ `502` ، TLS، DNS، یا ٹائم آؤٹ کی غلطیوں کے ساتھ ناکام ہوجاتے ہیں تو، اکاؤنٹ چابیاں یا لین دین کے مفید بوجھ کو ڈیبگ کرنے سے پہلے نیٹ ورک کی دستیابی کو درست کریں یا عوامی ٹیسٹ نیٹ کے اختتامی نقطہ کا انتظار کریں۔

## ٹرانزیکشنز کو مسترد کیا جاتا ہے {#transactions-are-rejected}

زیادہ تر ٹرانزیکشن کی ناکامیوں کا سبب شناخت یا اجازت نامے کے عدم مماثلت ہے:

- کلائنٹ ترتیب میں اکاؤنٹ کی عوامی کلید دستخط کے لئے استعمال ہونے والی نجی کلید سے مطابقت نہیں رکھتی
- اکاؤنٹ پیدائش میں یا کسی سابقہ ٹرانزیکشن کے ذریعہ رجسٹرڈ نہیں ہے
- اکاؤنٹ میں اجازت ٹوکن یا رول نہیں ہے جو رن ٹائم کی توثیق کرنے والے کی ضرورت ہے۔
- ایک ڈومین ID کو اپنی ڈیٹا اسپیس کی اہلیت سے محروم ہے، جیسے `domain.dataspace`

`--output-format text` کا استعمال کریں جبکہ ڈیبگنگ CLI کمانڈ تاکہ غلطیوں کو پڑھنے میں آسان ہو:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## سوالات خالی نتائج لوٹاتے ہیں {#queries-return-empty-results}

خالی استفسار کے نتائج کا مطلب یہ نہیں ہے کہ استفسار ہمیشہ ناکام رہا ہے۔ چیک کریں:

- اس لین دین کا ارتکاب کیا گیا تھا جس سے اعتراض پیدا ہونا چاہئے۔
- مطلوبہ ڈومین، اثاثہ کی تعریف یا اکاؤنٹ ID کینونیکل ہے
- صفحہ بندی یا فلٹرز متوقع صف کو خارج نہیں کرتے ہیں
- کلائنٹ کو مطلوبہ نیٹ ورک سے منسلک کیا گیا ہے، اور کوئی دوسرا لوکل نیٹ ورک نہیں

ڈومین چیک کے لئے، سب سے زیادہ وسیع استفسار سے شروع کریں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## ایونٹ یا بلاک سٹریم ابتدائی طور پر رک جاتے ہیں {#event-or-block-streams-stop-early}

بلاک اور ایونٹ سٹریم کی مثالیں Torii اسٹریمنگ اختتامی پوائنٹس پر انحصار کرتی ہیں۔ تصدیق کریں کہ ہم مرتبہ اب بھی چل رہا ہے ، پھر ٹائم آؤٹ کے ساتھ ٹیسٹ کریں:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP انضمام کے لئے، اپنے اختتامی نقطہ راستوں کو موجودہ [Torii اختتامی پوائنٹ حوالہ سے موازنہ کریں](/ur/reference/torii-endpoints.md).
