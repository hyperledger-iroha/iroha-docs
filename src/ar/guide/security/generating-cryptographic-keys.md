---
translation_locale: ar
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# توليد المفاتيح المشفرة {#generating-cryptographic-keys}

استخدم `kagami keys` لتوليد المواد الرئيسية للعميل والقرابة والمؤكّد لـ Iroha 3.

## استخدام أساسي {#basic-usage}

من الصندوق المصدر Iroha:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

إنتاج JSON عادة ما يكون أسهل النسخة إلى TOML أو التلقائي:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

تقوم القيادة بطبع مفتاح عام ومفتاح خاص معروض. تعامل المفتاح الخاص كمواد سرية؛ لا تعتمد على مفاتيح الإنتاج التي تم إنشاؤها.

## الخوارزميات {#algorithms}

الخوارزميات الشائعة هي:

- `ed25519` لحسابات العملاء، هويات البث، ومعظم شبكات التطوير.
- `secp256k1` عندما تحتاج إلى هوية حساب secp256k1 .
- `bls_normal` لمفاتيح توافق المحققين عندما تمكن الإعداد من دعم BLS.

تحقق من الخوارزميات الدقيقة التي يدعمها البناء الخاص بك مع:

```bash
cargo run --bin kagami -- keys --help
```

## مفاتيح التنمية المحددة {#deterministic-development-keys}

للاستكشافات القابلة للتكاثر، قم بإعطاء بذرة:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

البذور هي مادة مفتاحية خاصة استخدمها فقط للتطوير المحلي والاختبارات.

## BLS دليل على امتلاكها {#bls-proofs-of-possession}

الـ NPOS و Nexus الملفات الشخصية للمؤكد تتطلب BLS مفاتيح المصادقة و PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

يتضمن JSON `pop_hex` عندما يتم استخدام `--pop`. استخدم هذه القيمة مع الطوبولوجيا التي تم إنشاؤها أو إدخالات `trusted_peers_pop` المطلوبة من قبل الملف الشخصي.

## تنسيقات الخروج {#output-formats}

استخدم الخروج الافتراضي لتحقق المحطة، `--json` للأتمتة، و `--compact` عندما يحتاج كتابة أخرى إلى قيم ذات اتجاه خط بسيط:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

للحصول على المساعدة الكاملة Kagami:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
