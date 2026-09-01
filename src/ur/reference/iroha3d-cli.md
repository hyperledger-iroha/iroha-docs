---
translation_locale: ur
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: nllb-200-ct2
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

آپریٹر کو استعمال سے پہلے کینیکل Taira پروفائل پیش کرنا ہوگا. رجسٹرڈ ٹیمپلیٹ میں مثال کی ترتیبات ہیں۔ آپریٹر کو ہر مثال کی ترتیب کو تبدیل کرنا ضروری ہے. Taira کے مقابلے میں ٹیسٹ کرتے وقت عام Nexus یا پیداوار SoraFS ترتیبات کا استعمال نہ کریں.

## `--config` {#arg-config}

- قسم: فائل کا راستہ
- عرفان: `-c`

[پیئر ترتیب ](/ur/reference/peer-config/index.md) تک کا راستہ۔

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- قسم: فائل کا راستہ

رضامندی کی توثیق کے لئے استعمال شدہ اختیاری پیدائش کا مینی فیسٹ JSON۔

## `--check-config` {#arg-check-config}

حل شدہ ترتیب اور دستیاب جینیس مواد کی توثیق کریں، پھر نیٹ ورک ساکٹ کو پابند کرنے کے بغیر باہر نکلیں۔

## کاگیموشا کوالیفائیشن سیل {#kagemusha-qualification-seals}

فائل کے راستے کے ان اختیارات کو `--check-config` کی ضرورت ہوتی ہے اور کینونیکل سیل لکھنے سے پہلے مکمل Kagemusha قابلیت انجام دیتے ہیں:

- `--write-kagemusha-catalog-qualification-seal <PATH>` کیٹلاگ کو اہل بناتا ہے۔
- `--write-kagemusha-validator-qualification-seal <PATH>` مقامی توثیق کنندہ کو تشکیل شدہ دستخط شدہ ترقیاتی تحفظات کے خلاف اہل بناتا ہے۔

مہر کے دو اختیارات ایک دوسرے سے متصادم ہیں.

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

سورا Nexus پروفائل کو فعال کریں۔ اس پروفائل میں SoraFS ، SoraNet ہینڈ شٹ، اور کثیر لین اتفاق رائے ترتیب دیا جاتا ہے. ہمیشہ اس پرچم کے ساتھ Taira لانچر کو استعمال کریں.

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

اوپر دیے گئے اختیارات کے خلاصے کی موجودہ `iroha3d` آرگومنٹ تعریفوں سے تصدیق کی جاتی ہے۔ ریپوزٹری میں محفوظ کردہ تیار شدہ مدد کا اسنیپ شاٹ جان بوجھ کر اس وقت تک نہیں دکھایا جاتا جب تک اس کی اصل کی حیثیت زیرِ التوا ہے۔ اپنے سورس چیک آؤٹ کے لیے درست مدد دیکھنے کے لیے چلائیں:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
