---
translation_locale: ar
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

(الـ) Rust التنفيذ يعيش في مساحة العمل الرئيسية ويظل أكثر
طريقة العمل مع Iroha 3 قاعدة الشفرة

## ما تحصل عليه {#what-you-get}

المخبز المستمر يضع حاليا:

- الموقع `iroha` Rust صندوق العملاء
- الموقع `iroha` CLI كعميل مرجعية كاملة
- النموذج المشترك للبيانات، والعملة المشفرة، Norito الصناديق المستخدمة من قبل SDK الطبقة

## نقطة البدء الموصى بها {#recommended-starting-point}

عن الحالة الحالية للمشروع، ابدأ بالمرجع CLI و
مساحة العمل نفسها:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

تشغيل العميل المرجعي مع إعداد العميل الافتراضي المسجل:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## حاولي Taira القراءة فقط {#try-taira-read-only}

من نفس مكان العمل التحقق، جرب الجمهور Taira مساعد التشخيص:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

للتحقق من مستوى المسار، استخدام Torii- نعم . JSON API مباشرة:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

بعد إنشاء `taira.client.toml`, نفس الثنائي يمكن أن تشغيل الموقع القناري
أوامر ضد Taira. أبقوا هذه منفصلة عن اختبارات الوحدة العادية لأن
يتطلبون حسابًا تمويلاً من النوافذ وتوافر شبكة اختبار حية.

## باستخدام Rust صندوق العملاء {#using-the-rust-client-crate}

أغلق Iroha إصدار Git المستخدم من قبل شبكتك:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

إذا كنت بحاجة إلى الأمثلة الأكثر اكتمالاً Rust تستخدم السطحات في
الممارسة، التفتيش:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

بالنسبة لأجليات عمل الاحتفاظ التي يتم إدارتها في دفتر التسجيل، انظر
[الاحتفاظ بالأصول الأصلية](/ar/blockchain/escrow.md#rust-sdk). (الـ) Rust نموذج البيانات
في الوقت الحالي لديها التغطية الأكثر اكتمالاً للشروط الاحتفاظ بها في السوق،
مقفلات الأصول، الاحتفاظ بالمحتفظة المجهولة، والسؤال، والأحداث.

يمكنك إعادة تشكيل محلية CLI صورة مفاجئة مع:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## ملاحظات {#notes}

- (الـ) CLI في الوقت الحالي يوفر تغطية أفضل من وثائق الصندوق المستقلة.
- بالنسبة لتدفقات نمط المشغل، CLI الوثائق هي المصدر الأكثر حداثة.
