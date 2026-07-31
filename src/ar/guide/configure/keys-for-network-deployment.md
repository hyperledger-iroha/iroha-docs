---
translation_locale: ar
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# مفاتيح تنفيذ الشبكة {#keys-for-network-deployment}

كل شبكة تحتاج إلى مواد رئيسية متميزة للعملاء، الأقران، توقيع التكوين،
وبالنسبة لـ NPoS أو Nexus الملفات الشخصية BLS هويات المحقق

## أين تستخدم المفاتيح {#where-keys-are-used}

- يتم تخزين مفاتيح توقيع العميل `client.toml` تحت `[account]`.
- يتم تخزين مفاتيح هوية الأقران في كل أقران `config.toml` كما `public_key` و
  `private_key`.
- يستخدم اكتشاف الأقران مفتاح كل أقر في `trusted_peers`.
- BLS المحقق الاعتبار أن دليل الملكية يتم تخزينها في `trusted_peers_pop` لـ NPOS
  الملفات الشخصية
- التوقيع في سفر التكوين يستخدم `[genesis].public_key` في التأمين بين الأقران و
  يطابق المفتاح الخاص عند توقيع المذكرة.

لتنفيذ محلي أو اختباري Kagami تنشئ جميع هذه الملفات معاً:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

لشبكة أو ملف تعريف موجود، استخدم التدفق الموجّه:

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## توليد أزواج مفتاح فردية {#generate-individual-key-pairs}

الاستخدام `kagami keys` للمواد المفتاحية المستقلة:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

ل: BLS المواد المؤكدة، تشمل دليل على الامتلاك:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

الاستخدام `--seed` فقط للأجهزة التطوير المتكاملة.
النشر، وإنشاء مفاتيح جديدة وتخزين المفاتيح الخاصة خارج المستودع.

## التوافق بين الأقران {#peer-consistency}

يجب أن يتفق جميع المحققين على نفس المعاملة التأليفية،
المفاتيح العامة المتساوية، والمؤكدة PoPs. مفتاح واحد مفقود أو غير متطابق
يمنع الشبكة من البدء أو الوصول إلى توافق.

لتحقيق الحد الأدنى للتسامح مع الأخطاء البيزنطية، استخدم أربعة أقرانه على الأقل.
يجب أن يكون لدى الزملاء مفتاحهم الخاص ، ولكن كل تشكيل للزملاء يحتاج إلى نفس
مجموعة من الأقران الموثوقين

## حسابات العملاء {#client-accounts}

حساب العميل في `client.toml` يجب أن تكون موجودة بالفعل على السلسلة
المسجلة في مذكرة التكوين أو من خلال معاملة لاحقة.
التوقيع على الهوية كحساب تطبيق طويل الأمد؛ امتيازات التأليف
يطبق فقط خلال جولة التكوين، ويجب على العملاء الإنتاج استخدام
الحسابات والأدوار.
