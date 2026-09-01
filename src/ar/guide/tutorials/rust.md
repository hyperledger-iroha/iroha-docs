---
translation_locale: ar
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Rust {#rust}

تنفيذ Rust يعيش في مساحة العمل الرئيسية ويظل الطريقة الأكثر مباشرة للعمل مع قاعدة كود Iroha 3.

## ما ستحصل عليه {#what-you-get}

المستودع الأصلي يعرض حاليًا:

- حزمة برامج العميل `iroha` Rust
- الـ `iroha` CLI كأكمل عميل مرجعي
- نموذج بيانات مشترك، التشفير، وحزم البرمجيات Norito المستخدمة من قبل طبقة SDK

## نقطة البداية الموصى بها {#recommended-starting-point}

لحالة المشروع الحالية، ابدأ بالمرجع CLI وبيئة العمل نفسها:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

شغّل العميل المرجعي باستخدام تكوين العميل الافتراضي المُسجَّل:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## حاول Taira للقراءة فقط {#try-taira-read-only}

من نفس مساحة العمل، جرب مساعد التشخيصات العامة Taira:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

للتحقق على مستوى الطريق، استخدم Torii JSON API مباشرة:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

بعد إنشاء `taira.client.toml`، يمكن للملف الثنائي نفسه تشغيل أوامر كاناري موقعة ضد Taira. احتفظ بهذه منفصلة عن اختبارات الوحدة العادية لأنها تتطلب حسابًا ممولًا بشبكة تجريبية وتوافر شبكة تجريبية حية.

## استخدام حزمة برامج العميل Rust {#using-the-rust-client-crate}

تثبيت نسخة Git Iroha المستخدمة في شبكتك:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

إذا كنت بحاجة إلى أكثر الأمثلة اكتمالًا حول كيفية استخدام أسطح Rust في الممارسة العملية، تفقد:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

لعمليات سير العمل الخاصة بالضمان المُدار بواسطة دفتر الأستاذ، انظر [ضمان الأصل المحلي](/ar/blockchain/escrow.md#rust-sdk). يحتوي نموذج البيانات Rust حاليًا على أكثر تغطية نوعية كاملة لسوق الضمان، الأقفال العامة للأصول، الضمان المجهول، الاستفسارات، والأحداث.

يمكنك إعادة توليد عرض بيانات نقطة الوقت المحلي CLI للمساعدة باستخدام:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## ملاحظات {#notes}

- يوفر CLI حاليًا تغطية أفضل من مستندات حزمة البرامج المستقلة.
- بالنسبة لتدفقات نمط المشغل، فإن وثائق CLI هي المصدر الأحدث.
