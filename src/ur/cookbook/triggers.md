---
translation_locale: ur
translation_source: /cookbook/triggers.md
translation_source_hash: 946309958fe4e23a7454206b1eb4557f8e853171ce4e04d5373cb36f46b13970
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# ٹرگرز {#triggers}

## نتیجہ {#outcome}

Taira پر ایک محدود بائی کال ٹرگر رجسٹر کریں، اسے ایک بار انجام دیں، قابل اطلاق فائنلٹی کا انتظار کریں، اور اس کی کامیابی سے تکمیل کی تصدیق کریں.

## لازمی شرائط {#prerequisites}

- [Taira سے رابطہ کریں](./connect-to-taira.md) سے ایک فنڈ شدہ دستخط کنندہ، `taira.client.toml` اور `TAIRA_ACCOUNT_ID`۔ تحریری کارروائیاں `--fee-payer authority` استعمال کرتی ہیں؛ CLI دستخط سے پہلے Taira کے فیس اثاثے میں عین فیس کی کوٹیشن دیتا ہے۔
- Taira اجازت `TAIRA_ACCOUNT_ID` کے لئے ایک ٹرگر رجسٹر کرنے اور اس سے پیدا ہونے والے ٹرگر کو انجام دینے کے لئے۔ متعلقہ ٹوکنز `CanRegisterTrigger` کی طرف سے `authority` اور `CanExecuteTrigger` کی طرف سے`trigger` کی طرف سے scopeed ہیں.
- اگر یہ اجازتیں دستیاب نہیں ہیں تو، ایک پیدا کردہ مقامی نیٹ ورک اور اس کے ایڈمنسٹریٹر کلائنٹ کا استعمال کریں. ٹرگر اتھارٹی کو بھی ہدایات کی طرف سے مطلوبہ تمام اجازتوں کی ضرورت ہوتی ہے کہ ٹرگر انجام دے گا.

```bash
CONFIG=./taira.client.toml
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## قدم {#steps}

### 1۔ ایک ہدایات پر مبنی ٹرگر رجسٹر کریں۔ {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` وہ JSON ہدایات کی صف قبول کرتا ہے جو `--emit-instructions` پرنٹ کرتا ہے۔ `tx ping` ایک `Log` ہدایت جاری کرتا ہے، جو اس مثال کو دوسرے لیجر آبجیکٹ کی اجازتوں کے بجائے ٹرگر اختیارات پر مرکوز رکھتی ہے۔

```bash
iroha --config "$CONFIG" --emit-instructions \
  tx ping --log-level INFO --msg 'cookbook trigger executed' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

ٹرگر زیادہ سے زیادہ تین بار چل سکتا ہے۔ اس کی بیان کردہ اتھارٹی ، نہ کہ کال کرنے والا جو واقعتا اسے انجام دیتا ہے ، کارروائی کے اندر ہدایات کو اختیار دیتا ہے۔

### 2۔ عمل درآمد سے پہلے declaration کا معائنہ کریں {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

ایک اور فیس خرچ کرنے سے پہلے I105 اتھارٹی، عملدرآمد فلٹر، باقی تکرار، اور `executable` میں موجود واحد انکوڈ شدہ ہدایت کی تصدیق کریں۔

### 3۔ دونوں پرتوں کو انجام دیں اور انتظار کریں۔ {#_3-execute-and-wait-for-both-layers}

عملدرآمد کی لین دین اور ٹرگر کارروائی میں واضح ثبوت موجود ہیں۔ `--wait` لاگو شدہ لین دین کے اختتامی ہونے کا انتظار کرتا ہے۔ `--trace` بھی رن ٹائم تکمیل تشخیص کی اطلاع دیتا ہے۔

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust کلائنٹ وہی دو ٹائپ کردہ ہدایات بناتے ہیں۔ یہاں `authority` ایک `AccountId` ہے، اور `client` ایک `iroha::blocking::Client` ہے جو اسی اکاؤنٹ کے طور پر دستخط کرتا ہے؛ `submit` Applied حتمیت کا انتظار کرتا ہے:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned())],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
)?;
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit(ExecuteTrigger::new(trigger_id), fee)?;
```

## تصدیق کریں {#verify}

مکمل ہونے کے لئے کمائی شدہ بلاک کی تاریخ کو اسکین کریں اور تخفیف شدہ تکرار گنتی کا معائنہ کریں:

```bash
iroha --config "$CONFIG" trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

کم از کم ایک completion کو کامیابی رپورٹ کرنا ضروری ہے۔ Trigger کو دو executions باقی رکھتے ہوئے active رہنا چاہیے۔ کامیاب trigger completion کے بغیر صرف کامیاب submission کافی verification نہیں ہے۔

## خرابی کا سراغ لگانا {#troubleshooting}

- رجسٹریشن کو مسترد کرنے کا مطلب یہ ہے کہ دستخط کنندہ کے پاس اعلان کردہ اتھارٹی کے لئے `CanRegisterTrigger` کی کمی ہے۔ عملدرآمد کے لئے علیحدہ حد تک `CanExecuteTrigger` ٹوکن کی ضرورت ہوتی ہے.
- ایک ٹرانزیکشن قابل اطلاق تک پہنچ سکتی ہے جبکہ ٹرگر کارروائی ناکامی کی اطلاع دیتی ہے۔ تکمیل کا نتیجہ اور غلطی پڑھیں؛ پھر ہر سرایت کردہ ہدایات کے لئے ٹرگر اتھارٹی کی اجازتوں کو چیک کریں۔
- `Trigger with id … not found` کا مطلب یہ ہوسکتا ہے کہ رجسٹریشن ٹرانزیکشن کو مسترد کردیا گیا تھا یا عمل درآمد کے لئے ایک مختلف Torii / چین ترتیب استعمال کی گئی تھی۔
- جب تکرار صفر تک پہنچ جاتی ہے تو، مزید تکرار کرنا ایک اور اعزازی تحریر ہے۔ اس ہدایت کو خاموشی سے غیر معینہ ٹگر پر تبدیل نہ کریں.
- صفائی کے لئے، `trigger unregister --id "$TRIGGER_ID"` اس ٹرگر کے علاوہ واضح فیس کا انتخاب کرنے کے لئے `CanUnregisterTrigger` کی ضرورت ہے.

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [بائی کال ٹرگر انٹیگریشن ٹیسٹ پر پنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/triggers/by_call_trigger.rs)
- [پنڈ commit پر واقعہ اور ٹرگر انضمام ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events_and_triggers.rs)
- [ٹرگر کی ہدایات پر عملدرآمد pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [ٹرگرز](/ur/blockchain/triggers.md)
- [ٹرگر کی مثالیں](/ur/blockchain/trigger-examples.md)
- [واقعات](./stream-events.md)
