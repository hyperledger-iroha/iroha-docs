---
translation_locale: ar
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

تنفيذ Rust يعيش في مساحة العمل الرئيسية ويظل الطريقة الأكثر مباشرة للعمل مع قاعدة الشفرات Iroha 3.

## ما تحصل عليه {#what-you-get}

المخزن الصعودي يعرض حالياً:

- صندوق العملاء `iroha` Rust
- `iroha` CLI كعميل مرجع أكثر اكتمالاً
- النموذج المشترك للبيانات والعملة المشفرة، وصناديق Norito التي تستخدمها طبقة SDK

## نقطة البداية الموصى بها {#recommended-starting-point}

عن الحالة الحالية للمشروع، ابدأ بالمرجع CLI ومساحة العمل نفسها:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

قم بتشغيل العميل المرجعي مع إعداد العميل الافتراضي المسجل في:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## جرب Taira القراءة فقط {#try-taira-read-only}

من نفس نقطة التحقق في مكان العمل، حاول مساعد تشخيص عام Taira:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

للتحقق من مستوى الطريق، استخدم Torii JSON API مباشرة:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

بعد إنشاء `taira.client.toml` ، يمكن لنفس النظام الثنائي تشغيل أوامر القناري الموقعة ضد Taira. ابق هذه منفصلة عن اختبارات الوحدة العادية لأنها تتطلب حسابًا تمولًا من الصمام وتوافر شبكة الاختبار الحية.

## استخدام صندوق العملاء Rust {#using-the-rust-client-crate}

قم بتثبيت إصلاح Iroha Git المستخدم من قبل شبكتك:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

إذا كنت بحاجة إلى الأمثلة الأكثر اكتمالاً على كيفية استخدام السطحات Rust في الممارسة العملية، تحقق من:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

بالنسبة لتدفقات عمل الاحتفاظ المدارة في دفتر التسجيل ، انظر [ احتفاظ الأصول الأصلية](/ar/blockchain/escrow.md#rust-sdk). نموذج البيانات Rust يحتوي حاليًا على تغطية نوعية أكثر اكتمالًا للتأمين في السوق ، وقفل الأصول العامة ، والاحتفاظ غير المعروفة ، والاستفسارات والأحداث.

يمكنك إعادة تشكيل صورة لمساعدة محلية CLI مع:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## ملاحظات {#notes}

- توفر CLI حالياً تغطية أفضل من وثائق الصندوق المستقلة.
- بالنسبة لتدفقات النمط، فإن وثائق CLI هي المصدر الأكثر حداثة.
