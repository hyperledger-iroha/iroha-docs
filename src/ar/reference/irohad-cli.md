---
translation_locale: ar
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` يبدأ ديمون زميل Iroha 3.

```shell
irohad --config path/to/config.toml
```

## `--config`  {#arg-config}

- نوع: مسار الملفات
- الاسم الخارجي: `-c`

مسار إلى ملف تشكيل [ ](/ar/reference/peer-config/index.md).

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- نوع: مسار الملفات

مسار اختياري لملف منشور التكوين JSON. استخدم هذا عندما يؤكد النشر بدء العمل ضد منشور تم إنشاؤه بواسطة Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

تمكين سجلات تتبع قراءة التكوين وتحليل. قد يكون مفيدًا لحل المشاكل في التكوين.

- النوع: العلم
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- النوع: البوليان، إما `--terminal-colors=false` أو `--terminal-colors=true`
- افتراضية: دعم محطة الكشف الذاتي.
- ENV: `TERMINAL_COLORS`

ما إذا كان يتم تمكين خروج ملون ANSI أم لا.

بطبيعة الحال، يحدد Iroha ما إذا كانت المحطة تدعم الخروج الملون أم لا.

لتعطيل الألوان صراحة:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- النوع: الخيوط

قم بإلغاء لغة النظام المستخدمة لإرسال رسائل الشيطان.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- النوع: العلم

تمكين ملف ميزة Sora Nexus لـ SoraFS ، و SoraNet ضغط اليد، وتدفقات الإجماع متعددة المسارات.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- النموذج: `auto` ، `cpu`، أو `gpu`

قم بإغلاق وضع تنفيذ FASTPQ

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- النموذج: `auto` ، `cpu`، أو `gpu`

إغلاق FASTPQ وضع خطوط أنابيب بوسيدون.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- النوع: الخيوط

إعادة تعريف علامة FASTPQ على فئة الأجهزة التلفازية.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- النوع: الخيوط

قم بإلغاء التسمية FASTPQ للأشعة العائلية للتلفاز.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- النوع: الخيوط

تكرار علامة FASTPQ التلفزيونية GPU.

```shell
irohad --fastpq-gpu-kind integrated
```
