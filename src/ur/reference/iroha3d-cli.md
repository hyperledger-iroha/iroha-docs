---
translation_locale: ur
translation_source: /reference/iroha3d-cli.md
translation_source_hash: 846370e45fe0e0d605016d6722b1d50c39981f954c7d9040b87fc385eb12ac68
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` معیاری Iroha 3 پیئر ڈییمون ہے۔ کارگو پیکج کا نام ہے `irohad`، لہذا بائنری کو ماخذ چیک آؤٹ سے کال کریں جس میں:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

عوامی Taira ٹیسٹ نیٹ کے لیے ریلیز امیج میں `iroha3d_taira` استعمال ہوتا ہے۔ یہ وہی CLI قبول کرتا ہے اور کینونیکل Taira چین، توثیق کنندہ سیٹ، اسٹوریج ترتیبات اور رن ٹائم دستخطی کلیدیں بھی نافذ کرتا ہے۔ رن ٹائم اسناد کھولے بغیر Taira ترتیب کی توثیق کریں:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

کینونیکل Taira پروفائل کی وہ صورت استعمال کریں جس میں آپریٹر نے اصل قدریں بھر دی ہوں؛ ریپوزٹری کے ٹیمپلیٹ میں اب بھی تنصیب کی عارضی قدریں ہیں۔ Taira کی جانچ کرتے وقت عمومی SORA Nexus یا صنعتی SoraFS ترتیبات اس کی جگہ نہ رکھیں۔

## `--config` {#arg-config}

- قسم: فائل کا راستہ
- عرفان: `-c`

[پیئر ترتیب ](/ur/reference/peer-config/index.md) تک کا راستہ۔

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- قسم: فائل کا راستہ

رضامندی کی توثیق کے لئے استعمال شدہ اختیاری پیدائش کا مینی فیسٹ JSON۔

## `--check-config` {#arg-check-config}

حل شدہ ترتیب اور دستیاب جینیس مواد کی توثیق کریں، پھر نیٹ ورک ساکٹ کو پابند کرنے کے بغیر باہر نکلیں۔

## `--json` {#arg-json}

- **قسم:** فلیگ
- **درکار:** `--check-config`

`Ready` یا `Pending` سطر کے بجائے اس بلڈ اور ترتیب کی مطابقت والی قدریں ایک Norito JSON آبجیکٹ میں پرنٹ کریں۔

## `--check-storage` {#arg-check-storage}

- **قسم:** فلیگ
- **اس کے ساتھ متصادم:** `--check-config`

رکے ہوئے نوڈ کے Kura ذخیرے اور تازہ ترین اسنیپ شاٹ کو اس بلڈ کے ڈیکوڈرز سے صرف پڑھنے کے انداز میں جانچیں، نتیجہ ایک Norito JSON آبجیکٹ میں پرنٹ کریں، اور ناکامی پر غیر صفر کوڈ سے ختم ہوں۔ جانچ Kura ذخیرے کے روٹ کا لاک لیتی ہے، اس لیے چلتے نوڈ کی ملکیت والا ذخیرہ مسترد کرتی ہے۔ یہ کبھی ذخیرہ نہیں بدلتی اور صرف رن ٹائم کے لیے مخصوص راز نہیں کھولتی۔

## `--check-replay` {#arg-check-replay}

- **قسم:** فلیگ
- **اس کے ساتھ متصادم:** `--check-config`، `--check-storage`

اس بلڈ سے رکے ہوئے نوڈ کے ذخیرے کی نقل دوبارہ چلائیں اور نتیجہ ایک Norito JSON آبجیکٹ میں پرنٹ کریں۔ کمانڈ بلاکس عارضی ڈائریکٹری میں نقل کرتی ہے، وہاں تازہ ترین اسنیپ شاٹ بحال کرتی یا دستخط شدہ جینیسس دوبارہ چلاتی ہے، پھر ہر بعد والا بلاک دوبارہ چلاتی ہے۔ اگر کوئی بلاک اپنا تصدیق شدہ نتیجہ پیدا نہ کرے یا ضروری بلاک باڈی غائب ہو تو یہ غیر صفر کوڈ سے ختم ہوتی ہے؛ یہ کبھی اصل ذخیرے میں نہیں لکھتی اور صرف رن ٹائم کے راز نہیں کھولتی۔

## `--require-genesis-inrou-deployment-authority` {#arg-require-genesis-inrou-deployment-authority}

- **قسم:** اکاؤنٹ ID
- **درکار:** `--check-config`

آف لائن جانچ کے دوران لازم کریں کہ عین دستخط شدہ جینیسس کے اجرا کے بعد یہ رجسٹر شدہ اکاؤنٹ SoraCloud کی تنصیب کا اختیار برقرار رکھے۔

## `--sumeragi-assert-fresh-key` {#arg-sumeragi-assert-fresh-key}

- **قسم:** فلیگ

صرف اس آغاز پر یہ تصدیق کریں کہ نوڈ کی اتفاقِ رائے والی کلیدوں نے کبھی اس چین کے لیے دستخط نہیں کیے۔ Sumeragi ہر کلید کا حفاظتی ریکارڈ رکھتا ہے؛ اس کے بغیر اس وقت تک کچھ دستخط نہیں کرتا جب تک اسے ثبوت نہ مل جائے کہ ریکارڈ ضائع نہیں ہوا۔ یہ فلیگ نئی کلید کے پہلے آغاز پر صرف ایک بار دیں، اور ڈیٹا ضائع ہونے کے بعد کبھی نہ دیں۔

## `--trace-config` {#arg-trace-config}

- ٹائپ: پرچم
- ماحول: `TRACE_CONFIG`

ترتیب کی تہوں کو پڑھا اور تجزیہ کیا جاتا ہے جب ٹریس لاگ فعال کریں.

## `--config-blake3` {#arg-config-blake3}

- قسم: 64 ہندسوں کا ہیکساڈیسیمل BLAKE3 ڈائجسٹ
- ضروریات: `--config`

ترتیب فائل بائٹس کو فراہم کردہ ڈائجسٹ سے ملنے کی ضرورت ہے۔ ایک سالمیت کے پابند فائل کو فلیٹ کرنا ضروری ہے؛ اس میں `extends` نہیں ہوسکتا ہے۔

## `--terminal-colors` {#arg-terminal-colors}

- ٹائپ: بولین، `--terminal-colors=true` یا `--terminal-colors=false` کے طور پر منظور شدہ
- ڈیفالٹ: ٹرمینل کی صلاحیت کا پتہ لگانا
- ماحول: `TERMINAL_COLORS`

کنٹرول ANSI رنگ کے آؤٹ پٹ.

## `--language` {#arg-language}

- ٹائپ: تار

ڈییمون پیغامات کے لئے استعمال کردہ سسٹم کی زبان کو نظر انداز کریں.

## `--sora` {#arg-sora}

- ٹائپ: پرچم
- ماحول: `IROHA_SORA_PROFILE`

SoraFS، SoraNet ہینڈ شیک اور متعدد لینز کے اتفاقِ رائے کے لیے SORA Nexus پروفائل فعال کریں۔ Taira لانچر ہمیشہ اس فلیگ کے ساتھ چلایا جاتا ہے۔

## FastPQ اوور رائیڈز {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` اور `--fastpq-poseidon-mode <MODE>` صرف `cpu` یا `gpu` کو قبول کرتے ہیں۔ باقی اختیارات ٹیلی میٹری لیبلز کو ختم کرتے ہیں:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

مثلاً:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## پیدا ہونے والی مدد {#generated-help}

اوپر اختیارات کا خلاصہ مقررہ Iroha کمیٹ میں `iroha3d` کے آرگومنٹ تعاریف کے مطابق ہے۔ اپنی ورکنگ کاپی کی درست مدد دیکھنے کے لیے چلائیں:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
