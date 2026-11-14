---
translation_locale: ar
translation_source: /reference/genesis.md
translation_source_hash: dda17468f39573a1fcf43474351bd01c4fea38e8b603fd4d8b21780b273c8649
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# مرجع بدء سلسلة الكتل {#genesis-reference}

في سير العمل الحالي Iroha 3، يصف بيان تقني `genesis.json` أولى المعاملات والمعايير التي سيتم تطبيقها عند بدء الشبكة.

الأثر الموقع الموزع على نظراء الشبكة هو ملف `.nrt` مشفر بـ Norito تم إنتاجه بواسطة `kagami genesis sign`.

## الحقول الرئيسية {#main-fields}

يمكن لوثيقة البداية التقنية للبلوكشين أن تحدد:

- `chain` لمعرف السلسلة
- `chain_discriminant` لبادئة شبكة I105 المستخدمة في ترميز القيم الحرفية للحسابات داخل البيان
- `executor` لمسار بايت كود ترقية منفذ اختياري
- `ivm_dir` للمكتبات IVM المستخدمة بواسطة المشغلات والترقيات
- `consensus_mode` للوضع الأولي المعلن عنه بواسطة البيان الفني
- `wire_protocol_version` لإصدار بروتوكول نقل الإجماع في الإصدار الأول
- `consensus_fingerprint` للبصمة الاختيارية محددة النوع لمعلمات الإجماع، والتي تنص عليها بيانات JSON صراحةً
- `transactions` لتحديثات المعلمات المطلوبة، التعليمات، المشغلات، والطوبولوجيا
- `sumeragi_context` لمعاملات سياق ارتفاع Sumeragi الموقّعة
- `crypto_admission_policy` لخوارزميات التوقيع والتحكم المحددة التي تقبلها السلسلة والمذكورة في `allowed_algorithms`

داخل `transactions`، تربط مدخلات الطوبولوجيا معرفات أقران الشبكة و PoPs معًا:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## إنشاء بيان تقني {#generate-a-manifest}

استخدم Kagami لتوليد قالب. كرر `--allowed-signing` لكل خوارزمية مقبولة بالترتيب المعياري التصاعدي؛ ولا يضيف Kagami الخوارزميات التي لم تذكرها:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

لمساحة بيانات SORA Nexus العامة، يكون `npos` نمط الإجماع المتوقع. قد تستخدم عمليات نشر Iroha 3 الأخرى النمط المقيّد بالصلاحيات أو NPoS وفقًا لملف الإعداد المستهدف.

## وقع البيان الفني {#sign-the-manifest}

بعد تحرير والتحقق من JSON، قم بتوقيعه ليصبح كتلة `.nrt` قابلة للنشر:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

يشتق `kagami genesis sign` زوج مفاتيح التكوين الأولي من المفتاح الخاص الموجود في ملف عادي ذي ارتباط واحد يحتفظ به المالك، لإنتاج الكتلة الموقعة القابلة للنشر. مرّر `--expected-public-key` لاشتراط مطابقته للمفتاح العام المنشور للتكوين الأولي. يجب أن يحتوي الملف على مفتاح خاص واحد بصيغة multihash القياسية متبوعًا بسطر جديد؛ ويرفض Kagami الروابط الرمزية والأنماط غير `0600`. لا يتم قبول المفاتيح الخاصة الخام في سطر الأوامر. النتيجة هي الملف الذي يجب أن يشير إليه أقران الشبكة من خلال إعداداتهم.

## تكوين `iroha3d` {#configure-iroha3d}

وجّه خدمة الخلفية إلى كتلة التكوين الأولي الموقّعة وإلى الملف الذي يثبّت تجزئتها المتوقعة. يكتب `kagami genesis sign --expected-hash-out` هذا الملف، وتطلبه العقدة عند البدء من جديد وعند إعادة التشغيل:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## أدوات ذات صلة {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

للتنفيذ الخاص بالمولّد وتفاصيل الأوامر، انظر [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md).
