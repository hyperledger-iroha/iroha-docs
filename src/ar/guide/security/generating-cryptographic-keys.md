---
translation_locale: ar
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# إنتاج مفاتيح تشفير {#generating-cryptographic-keys}

الاستخدام `kagami keys` لتوليد المواد الرئيسية للعميل والقرابة والمؤكدة
Iroha 3.

## الاستخدام الأساسي {#basic-usage}

من Iroha التسجيل المصدر:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON النتائج عادة ما تكون أسهل نسخها إلى TOML أو التلقائية:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

القيادة تطبع مفتاح عام ومفتاح خاص
المفتاح كمواد سرية؛ لا تتعهد بمفاتيح الإنتاج التي تم إنشاؤها.

## الخوارزميات {#algorithms}

الخوارزميات الشائعة هي:

- `ed25519` لحسابات العملاء، الهويات التدفقية، ومعظم التطوير
  الشبكات
- `secp256k1` عندما تحتاج إلى هوية حساب Secp256K1.
- `bls_normal` لمفاتيح توافق المحقق عندما تمكن الإنشاء BLS دعم

تحقق من الخوارزميات الدقيقة التي تدعمها البناء الخاص بك مع:

```bash
cargo run --bin kagami -- keys --help
```

## مفاتيح التنمية التحديدية {#deterministic-development-keys}

بالنسبة للأثاث القابلة للتكاثر، قم بإعطاء بذرة:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

البذور هي مادة مفتاحية خاصة، استخدمها فقط للتطوير المحلي والاختبارات.

## BLS أدلة على امتلاكها {#bls-proofs-of-possession}

(NPOS) و Nexus الملفات الشخصية للمؤكد تتطلب BLS مفاتيح المصادقة و PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

(الـ) JSON يتضمن `pop_hex` عندما `--pop` تستخدم هذه القيمة مع
أساسية أو `trusted_peers_pop` الإدخالات المطلوبة من قبل الشخصية.

## تنسيقات الخروج {#output-formats}

استخدم الخروج الافتراضي للتفتيش في المحطة، `--json` للأتمتة، و
`--compact` عندما يحتاج كتابة أخرى إلى قيم واضحة ذات اتجاه خطي:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

للإنتاج الكامل Kagami المساعدة:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
