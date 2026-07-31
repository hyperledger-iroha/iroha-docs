---
translation_locale: ar
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` يبدأ Iroha 3 ديمون أقرانه

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- **النوع:** مسار الملفات
- **اسم مستعار:** `-c`

الطريق إلى [التكوين](/ar/reference/peer-config/index.md) الملف.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- **النوع:** مسار الملفات

الطريق الاختياري إلى دليل التكوين JSON الملف. استخدم هذا عندما تنشر
يؤكّد البدء ضد إشارة تم إنشاؤها من قبل Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

يُمكّن من تتبع سجلات قراءة التكوين والتحليل. قد يكون مفيدًا لحل المشاكل في التكوين.

- **النوع:** العلم
- **ENV:** `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- **النوع:** (بوليان) `--terminal-colors=false` أو
  `--terminal-colors=true`
- **افتراضي:** دعم محطة الكشف الذاتي
- **ENV:** `TERMINAL_COLORS`

ما إذا كان لتمكين ANSI-المخرجات الملونة أم لا

بطبيعة الحال، Iroha يحدد ما إذا كانت المحطة تدعم الخروج الملون
أو لا.

لتعطيل الألوان صراحة:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- **النوع:** السلاسل

قم بإلغاء لغة النظام المستخدمة لإرسال رسائل الديمون.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- **النوع:** العلم

تمكين سورا Nexus ملف الميزة SoraFS, الموقع SoraNet ضغط اليد، و
تدفقات توافق متعددة المسارات.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- **النوع:** `auto`, `cpu`, أو `gpu`

إعادة التأثير FASTPQ أسلوب تنفيذ الإشارة.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- **النوع:** `auto`, `cpu`, أو `gpu`

إعادة التأثير FASTPQ وضع خط أنابيب (بوسيدون)

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- **النوع:** السلاسل

إعادة التأثير FASTPQ علامة طبقة الجهاز التليميتر.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- **النوع:** السلاسل

إعادة التأثير FASTPQ علامة عائلة رقائق التلفاز.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- **النوع:** السلاسل

إعادة التأثير FASTPQ التيلومترية GPU-علامة نوعية.

```shell
irohad --fastpq-gpu-kind integrated
```
