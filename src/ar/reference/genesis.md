---
translation_locale: ar
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# إشارة التكوين {#genesis-reference}

في الوقت الحالي Iroha 3 تدفق العمل، `genesis.json` ويعبر المشهد عن أول
المعاملات والمعايير التي سيتم تطبيقها عند بدء الشبكة.

القطع الأثرية الموقعة التي تم توزيعها على أقرانها هي Norito-مشفّر `.nrt` الملف
المنتجة من `kagami genesis sign`.

## الحقول الرئيسية {#main-fields}

ويمكن أن يحدد بيان الجينس:

- `chain` لتحديد السلسلة
- `executor` لمرحلة تطوير كود البايت إختياري
- `ivm_dir` لـ IVM المكتبات التي تستخدمها المحفزات والترقية
- `consensus_mode` للوضع الأولي الذي يعلن عنه المخطط
- `transactions` لتحديثات المعلمات المتسلسلة والإرشادات والمؤثرات والتوبولوجيا
- `crypto` للصورة الفورية الأولى من العملات المشفرة

داخل `transactions`, إدخالات التوبولوجيات أزواج هويات الأقران و PoPs معاً:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## إنشاء إشارة {#generate-a-manifest}

الاستخدام Kagami لإنشاء نموذج:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

للجمهور SORA Nexus مساحة البيانات `npos` هو وضع الإجماع المتوقع.
غيرها Iroha 3 يمكن أن تستخدم عمليات النشر المسموح بها أو NPoS اعتمادا على الهدف
الملف الشخصي

## وقع على الإشارة {#sign-the-manifest}

بعد تحرير وتصديق JSON, وقعها في نظام قابل للتنفيذ `.nrt` الكتلة:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` يقرأ المفتاح العام للشريحة من الم manifesto و استخدامات
المفتاح الخاص والبذور والخوارزمية التي تم توفيرها لإنتاج الموقع القابل للتنفيذ
النتيجة هي الملف الذي يجب على الأقران الإشارة إليه من إعداداتهم.

## الإعداد `irohad` {#configure-irohad}

اشير الديمون الى كتلة التكوين الموقعة:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## الأدوات ذات الصلة {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

للحصول على تفاصيل تنفيذ المولد والإرشادات، انظر
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
