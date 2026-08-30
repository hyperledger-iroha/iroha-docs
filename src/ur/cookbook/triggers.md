---
translation_locale: ur
translation_source: /cookbook/triggers.md
translation_source_hash: 6c8f436b5a41cf41c0ac37aeed6b6cd8c73009cfcca2fe7f5642cef1ad115e6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ٹرگرز {#triggers}

## نتیجہ {#outcome}

Taira پر ایک محدود بائی کال ٹرگر رجسٹر کریں، اسے ایک بار انجام دیں، قابل اطلاق فائنلٹی کا انتظار کریں، اور اس کی کامیابی سے تکمیل کی تصدیق کریں.

## لازمی شرائط {#prerequisites}

- ایک فنڈ دستخط، `taira.client.toml`, `taira.tx-metadata.json`, اور `TAIRA_ACCOUNT_ID` سے [سے رابطہ کریں Taira](./connect-to-taira.md).
- Taira اجازت `TAIRA_ACCOUNT_ID` کے لئے ایک ٹرگر رجسٹر کرنے اور اس سے پیدا ہونے والے ٹرگر کو انجام دینے کے لئے۔ متعلقہ ٹوکنز `CanRegisterTrigger` کی طرف سے `authority` اور `CanExecuteTrigger` کی طرف سے`trigger` کی طرف سے scopeed ہیں.
- اگر یہ امداد دستیاب نہیں ہیں تو، ایک پیدا کردہ مقامی نیٹ ورک اور اس کے ایڈمنسٹریٹر کلائنٹ کا استعمال کریں. ٹرگر اتھارٹی کو بھی ہدایات کی طرف سے مطلوبہ تمام اجازتوں کی ضرورت ہوتی ہے کہ ٹرگر انجام دے گا.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## قدم {#steps}

### 1۔ ایک ہدایات پر مبنی ٹرگر رجسٹر کریں۔ {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` ہدایات کی ایک JSON صف کو قبول کرتا ہے۔ A `Log` ہدایت اس مثال کو دوسرے لیجر آبجیکٹ کی اجازتوں کے بجائے ٹرگر اختیارات پر مرکوز رکھتی ہے.

```bash
printf '%s\n' \
  '[{"Log":{"level":"INFO","message":"cookbook trigger executed"}}]' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

ٹرگر زیادہ سے زیادہ تین بار چل سکتا ہے۔ اس کی بیان کردہ اتھارٹی ، نہ کہ کال کرنے والا جو واقعتا اسے انجام دیتا ہے ، کارروائی کے اندر ہدایات کو اختیار دیتا ہے۔

### 2۔ پھانسی سے پہلے بیان کی جانچ پڑتال کریں {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

ایک اور فیس خرچ کرنے سے پہلے I105 اتھارٹی، عملدرآمد فلٹر، باقی تکرار، اور واحد `Log` ہدایات کی تصدیق کریں.

### 3۔ دونوں پرتوں کو انجام دیں اور انتظار کریں۔ {#_3-execute-and-wait-for-both-layers}

عملدرآمد کی لین دین اور ٹرگر کارروائی میں واضح ثبوت موجود ہیں۔ `--wait` لاگو شدہ لین دین کے اختتامی ہونے کا انتظار کرتا ہے۔ `--trace` بھی رن ٹائم تکمیل تشخیص کی اطلاع دیتا ہے۔

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust کلائنٹ ایک ہی دو ٹائپ کردہ ہدایات بناتے ہیں۔ یہاں `authority` اس اکاؤنٹ کے طور پر ایک `AccountId` اور `client` نشان ہے:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned()).into()],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
);
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit_blocking(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit_blocking(ExecuteTrigger::new(trigger_id), fee)?;
```

## تصدیق کریں {#verify}

مکمل ہونے کے لئے کمائی شدہ بلاک کی تاریخ کو اسکین کریں اور تخفیف شدہ تکرار گنتی کا معائنہ کریں:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

کم از کم ایک تکمیل کامیابی کی اطلاع دینا ضروری ہے۔ ٹرگر کو دو عمل کے ساتھ فعال رہنا چاہئے۔ ٹرگر کی کامیاب تکمیل کے بغیر ایک کامیاب گذارش ناکافی تصدیق نہیں ہے.

## خرابی کا سراغ لگانا {#troubleshooting}

- رجسٹریشن کو مسترد کرنے کا مطلب یہ ہے کہ دستخط کنندہ کے پاس اعلان کردہ اتھارٹی کے لئے `CanRegisterTrigger` کی کمی ہے۔ عملدرآمد کے لئے علیحدہ حد تک `CanExecuteTrigger` ٹوکن کی ضرورت ہوتی ہے.
- ایک ٹرانزیکشن قابل اطلاق تک پہنچ سکتی ہے جبکہ ٹرگر کارروائی ناکامی کی اطلاع دیتی ہے۔ تکمیل کا نتیجہ اور غلطی پڑھیں؛ پھر ہر سرایت کردہ ہدایات کے لئے ٹرگر اتھارٹی کی اجازتوں کو چیک کریں۔
- `trigger not found` کا مطلب یہ ہوسکتا ہے کہ رجسٹریشن ٹرانزیکشن کو مسترد کردیا گیا تھا یا عمل درآمد کے لئے ایک مختلف Torii / چین ترتیب استعمال کی گئی تھی۔
- جب تکرار صفر تک پہنچ جاتی ہے تو، مزید تکرار کرنا ایک اور اعزازی تحریر ہے۔ اس ہدایت کو خاموشی سے غیر معینہ ٹگر پر تبدیل نہ کریں.
- صفائی کے لئے، `ledger trigger unregister --id "$TRIGGER_ID"` اس ٹرگر کے علاوہ واضح فیس کا انتخاب کرنے کے لئے `CanUnregisterTrigger` کی ضرورت ہے.

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [بائی کال ٹرگر انٹیگریشن ٹیسٹ پر پنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [پنڈ commit پر واقعہ اور ٹرگر انضمام ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [ٹرگر کی ہدایات پر عملدرآمد pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [ٹرگرز](/ur/blockchain/triggers.md)
- [ٹرگر کی مثالیں](/ur/blockchain/trigger-examples.md)
- [واقعات](./stream-events.md)
