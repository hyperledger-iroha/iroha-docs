---
translation_locale: ar
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الإشارة إلى سفر التكوين {#genesis-reference}

في سير العمل الحالي Iroha 3، يصف بيان `genesis.json` أول المعاملات والمعايير التي سيتم تطبيقها عند بدء الشبكة.

القطع الأثرية الموقعة التي تم توزيعها على أقرانها هي ملف Norito مرموز `.nrt` الناتج عن `kagami genesis sign`.

## الحقول الرئيسية {#main-fields}

ويمكن أن يحدد إشارة التكوين:

- `chain` للتعرف على السلسلة
- `executor` لمرحلة تطوير بايت كود تنفيذية اختيارية
- `ivm_dir` لمكتبات IVM المستخدمة من خلال محفزات وتحديثات
- `consensus_mode` للطريقة الابتدائية التي يتم الإعلان عنها في المذكرة
- `transactions` للتحديثات المرتبة للمعلمات والإرشادات والتحفيزات والتوبولوجيا
- `crypto` لقطة العملات الرقمية الأولى

داخل `transactions` ، إدخالات التوبولوجيات تتزامن مع هويات الأقران و PoPs معاً:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## إنشأ إشارة {#generate-a-manifest}

استخدم Kagami لتوليد نموذج:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

بالنسبة لمجال البيانات العام SORA Nexus، `npos` هو وضع الإجماع المتوقع. قد تستخدم تنفيذات Iroha 3 الأخرى المسموح بها أو NPoS اعتمادًا على ملف الهدف.

## التوقيع على الإعلان {#sign-the-manifest}

بعد تحرير وتصديق JSON، وقم بتوقيعه في كتلة `.nrt` قابلة للتنفيذ:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` يقرأ مفتاح الجينس العام من المخطط ويستخدم مفتاح خاص، البذور، والخوارزمية المقدمة لإنتاج الكتلة الموقعة القابلة للتنفيذ. النتيجة هي الملف الذي يجب أن يشير إليه الأقران من إعداداتهم.

## إعداد `irohad` {#configure-irohad}

اشير الـ (دايمون) إلى كتلة التكوين الموقع:

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

للحصول على تفاصيل تنفيذ المولد والإرشادات، انظر [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
