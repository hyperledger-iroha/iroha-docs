---
translation_locale: ur
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# لین دین جمع کروائیں اور ان کی تصدیق کریں۔ {#submit-and-verify-transactions}

## نتیجہ {#outcome}

Taira ٹرانزیکشن کو پہلے سے طے کریں، ایک عین مطابق فیس کی قیمت قبول کریں، اس پر دستخط کریں اور اسے جمع کروائیں، لاگو حتمی ہونے کا انتظار کریں، اور پابند ٹرانزیکشن کو ہیش کے ذریعے تصدیق کریں۔

## لازمی شرائط {#prerequisites}

- [کے ذریعہ تیار کردہ فنڈ شدہ `taira.client.toml` ، `taira.tx-metadata.json`، اور `TAIRA_ACCOUNT_ID` Taira](./connect-to-taira.md) سے منسلک۔
- موجودہ `iroha` CLI اور `jq`.
- ایک ڈسپوزایبل Taira دستخط۔ اس کی کلید کا دوبارہ استعمال نہ کریں یا Minamoto پر یہ کمانڈ لکھیں۔

## قدم {#steps}

### 1۔ اختتامی نقطہ نظر، اختیار اور فیس کے بیلنس کی پیش گوئی کریں۔ {#_1-preflight-the-endpoint-authority-and-fee-balance}

قطار کا سنیپ شاٹ پہلے پڑھیں ، پھر ثابت کریں کہ اتھارٹی کی فیس بیلنس نظر آتی ہے۔ کنکشن ہدایت کے ذریعہ پیدا کردہ میٹا ڈیٹا سے Base58 اثاثہ تعریف ID پڑھیں۔

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

اکاؤنٹ یا فیس بیلنس غائب ہے تو روک دیں۔ ایک درست ہدایات فیس داخلہ پاس نہیں کر سکتے جب اس کی اتھارٹی ادائیگی نہیں کرسکتی ہے۔

### 2۔ ایک بار حوالہ دیں، دستخط کریں اور ارسال کریں۔ {#_2-quote-sign-and-submit-once}

CLI فیس کوٹیشن کے لئے عین مطابق غیر دستخط شدہ پے لوڈ بھیجتا ہے ، قبول شدہ ادائیگی کا ارادہ لین دین میں منسلک کرتا ہے ، دستخط کرتا ہے اور جمع کراتا ہے۔ JSON موڈ ٹرانزیکشن ہیش ، دستخط شدہ لین دین اور قبول کردہ قیمت کو ایک ساتھ واپس دیتا ہے۔

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

اس نسخے میں `--no-wait` کا استعمال نہ کریں. کمانڈ کامیاب رسید لکھنے سے پہلے تصدیق کے منتظر ہے۔

### 3۔ ٹرمینل پائپ لائن کی حالت کا انتظار {#_3-wait-for-terminal-pipeline-state}

HTTP قبولیت یا قطار میں داخل ہونے سے کامیابی کا نتیجہ نکالنے کے بجائے ٹائپڈ اسٹیٹس ہیلپر استعمال کریں۔ `--wait` کے ساتھ ، محفوظ روٹنگ دائرہ کار خود بخود منتخب کیا جاتا ہے اور ڈیفالٹ ہدف قابل اطلاق حتمی ہے۔

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` اور `Expired` حتمی ناکامیاں ہیں، دوبارہ کوشش کے قابل کامیابی کی حالتیں نہیں۔ ٹرانزیکشن کو تبدیل یا دوبارہ بنانے سے پہلے ان کی وجہ درج کریں۔

### ذخیرہ شدہ ٹرانزیکشن پڑھیں {#_4-read-the-stored-transaction}

پائپ لائن کی حیثیت اس بات کا جواب دیتی ہے کہ آیا پروسیسنگ ختم ہوگئی ہے۔ ایک ٹرانزیکشن استفسار میں تصدیق ہوتی ہے کہ منظور شدہ ٹرانزیکشن اسی ہیش کے تحت محفوظ ہے۔

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

ایکسپلورر ایک دوسری، صرف پڑھنے کی مشاہدہ سطح ہے. یہ پائپ لائن کے حتمی ہونے سے تھوڑی دیر پیچھے رہ سکتا ہے.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

state-changing instruction کے لیے، آخر میں تبدیل کیے گئے object پر استفسار کریں۔ [میٹا ڈیٹا](./metadata.md)، [فنگبل اثاثے](./fungible-assets.md) اور [NFTs](./nfts.md) کی recipes میں یہ post-state reads شامل ہیں۔

## تصدیق کریں {#verify}

چیک کریں کہ تینوں ریکارڈ ایک ہی ہاش پر اتفاق کرتے ہیں اور کہ دریافت کنندہ اب کوئی زیر التواء حالت کی اطلاع نہیں دیتا ہے:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

جمع کرانے کی رسید اور حتمی حیثیت کو آزمائشی ثبوت کے طور پر رکھیں۔ ان میں عوامی ٹرانزیکشن کا مواد ہوتا ہے، دستخط کی کلید نہیں۔

## خرابی کا سراغ لگانا {#troubleshooting}

- HTTP `202` یا قطار کی حیثیت صرف داخلہ ثابت کرتی ہے۔ درخواست، مسترد، ختم ہونے یا محدود ٹائم آؤٹ تک ٹائپ کردہ حالت کا سروے جاری رکھیں.
- اگر ایک ہیش واپس کرنے کے بعد جمع کرانے کا وقت ختم ہوجاتا ہے تو ، کسی اور ٹرانزیکشن کی تعمیر سے پہلے اس ہیش کو استفسار کریں۔ اندھا دوبارہ جمع کروانا ایک نیا حوالہ دیا گیا اور دستخط شدہ پے لوڈ پیدا کرتا ہے۔
- دستخط سے پہلے فیس کی پیشکش کو مسترد کیا جا سکتا ہے۔ چیک کریں `--fee-payer authority` ، `gas_asset_id`، اتھارٹی کے بیلنس اور نیٹ ورک چین ID.
- `Rejected` عام طور پر instruction validation، permissions، fees یا پرانی state کی نشاندہی کرتا ہے۔ یہ ناکام execution کا committed ثبوت ہے اور اسے transport retry کے طور پر دوبارہ درجہ بند نہیں کرنا چاہیے۔
- ایک کھوج `404` فوری طور پر Applied کے بعد انڈیکسنگ تاخیر کر سکتے ہیں. دوبارہ پڑھنے کی کوشش کریں؛ ٹرانزیکشن کو دوبارہ پیش نہ کریں.
- اگر privileged ہدایات پیدا localnet پر کام کرتا ہے لیکن Taira اسے مسترد، درست Taira اجازت یا منظم ناموں کی جگہ تفویض حاصل کریں. مقامی نتیجہ عوامی نیٹ ورک اتھارٹی نہیں دیتا.

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [ٹرانزیکشن جمع کرانے اور مقررہ کمیٹی پر فیس کوٹ کے نفاذ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [ٹرانزیکشن کی تصدیق کے ٹیسٹ پر پابند commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [لین دین](/ur/blockchain/transactions.md)
- [CLI گائیڈ](/ur/get-started/operate-iroha-via-cli.md)
- [Torii اختتام پوائنٹس](/ur/reference/torii-endpoints.md)
