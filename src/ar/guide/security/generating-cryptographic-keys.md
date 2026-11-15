---
translation_locale: ar
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: bb1044edb9d34264e36848ee773d4d313bfbfd91b45da2eeb831f7ef8920e9b4
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# توليد المفاتيح التشفيرية {#generating-cryptographic-keys}

استخدم `kagami keys` لإنشاء مواد مفاتيح العميل، ونظير الشبكة، والمحقق لـ Iroha 3.

## الاستخدام الأساسي {#basic-usage}

من نسخة العمل للكود المصدري Iroha:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

يجب أن يكون الدليل الأب موجودًا بالفعل. ويجب ألا يكون الهدف موجودًا: يرفض Kagami حتى الدليل الموجود الفارغ. ينشئ الهدف بالأذونات `0700` مع فحوص نظام ملفات تقصر الوصول على المالك، ويرفض الروابط الرمزية. يكتب `kagami` الملفين `public.key` و`private.key` بالأذونات `0600` ولا يطبع مواد المفاتيح. وعند استخدام `--pop` يكتب `pop.hex` أيضًا.

`--out-dir` يفشل في الإغلاق على المنصات حيث لا يمكن لـ Kagami فرض قواعد نظام الملفات الخاصة فقط بالمالك. ملف المفتاح الخاص هو تصدير غير مشفر، وليس جهاز توقيع تشفير الإنتاج المادي أو غير القابل للتصدير. قم باستيراده إلى حدود الحفظ المعتمدة وأزل التصدير وفقًا لإجراءات النشر.

## الخوارزميات {#algorithms}

الخوارزميات الشائعة هي:

- `ed25519` لحسابات العملاء والهويات البثية.
- `secp256k1` عندما يحتاج حساب العميل إلى هوية secp256k1.
- `bls_normal` لكل عقدة أو نظير شبكة هوية توافقية.

تحقق من الخوارزميات الدقيقة المدعومة من بناء نظامك باستخدام:

```bash
cargo run --bin kagami -- keys --help
```

## مفاتيح التطوير الحتمية {#deterministic-development-keys}

للحصول على نتائج اختبار قابلة للإعادة، قم بتمرير قيمة أولية بطول 32 بايت مشفرة كـ 64 حرفًا سداسي عشريًا. يتم قبول بادئة اختيارية `0x`:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --out-dir ./fixture-client-key
```

البذرة هي مادة المفتاح الخاص. استخدم البذور الحتمية فقط للتطوير المحلي والاختبارات. احذف `--seed-hex` لتوليد مفتاح الإنتاج من عشوائية نظام التشغيل.

## BLS مفاتيح الإجماع وإثباتات الملكية {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 تستخدم هويات الإجماع للأقران على العقد والشبكة مفاتيح عادية من نوع BLS. قم بإنشاء مفتاح عادي من نوع BLS ودليل الملكية (PoP) باستخدام:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` صالح فقط مع `bls_normal`؛ ويضيف `pop.hex` إلى دليل الحفظ. يتطلب التكوين الأولي الموقّع PoP مطابقًا لكل مدقق مصوّت. في تكوين أقران الشبكة، أدرج PoP لكل مدقق في `trusted_peers_pop`: يُستبعد الأقران الموثوقون الذين لا يملكون PoP صالحًا من قائمة الإجماع، والخريطة الفارغة لا تنتج أي مدققين، لذا ترفض العقدة التي تُسقط خريطتها مدققي التكوين الأولي بدء التشغيل. شغّل عقدة للمزامنة فقط باستخدام `[sumeragi] role = "observer"`.

## مخرجات الحضانة {#custody-output}

`kagami keys` يتطلب `--out-dir` ولا يكتب مطلقًا مواد المفتاح الخاص إلى الإخراج القياسي. اقرأ `public.key` و `private.key` و `pop.hex` الاختياري من الدليل الذي تم إنشاؤه. يحتوي كل ملف على قيمة معيارية واحدة تليها سطر جديد، مما يجعل أتمتة الملفات المباشرة واضحة:

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

للحصول على المساعدة الكاملة للـ Kagami:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
