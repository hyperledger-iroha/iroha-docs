---
translation_locale: ar
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# مرجع بدء سلسلة الكتل {#genesis-reference}

في سير العمل الحالي Iroha 3، يصف بيان تقني `genesis.json` أولى المعاملات والمعايير التي سيتم تطبيقها عند بدء الشبكة.

الأثر الموقع الموزع على نظراء الشبكة هو ملف `.nrt` مشفر بـ Norito تم إنتاجه بواسطة `kagami genesis sign`.

## الحقول الرئيسية {#main-fields}

يمكن لوثيقة البداية التقنية للبلوكشين أن تحدد:

- `chain` لمعرف السلسلة
- `executor` لمسار بايت كود ترقية منفذ اختياري
- `ivm_dir` للمكتبات IVM المستخدمة بواسطة المشغلات والترقيات
- `consensus_mode` للوضع الأولي المعلن عنه بواسطة البيان الفني
- `transactions` لتحديثات المعلمات المطلوبة، التعليمات، المشغلات، والطوبولوجيا
- `crypto` لعرض بيانات التشفير الأولية في نقطة زمنية محددة

داخل `transactions`، تربط مدخلات الطوبولوجيا معرفات أقران الشبكة و PoPs معًا:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## إنشاء بيان تقني {#generate-a-manifest}

استخدم Kagami لإنشاء قالب:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

بالنسبة لمساحة البيانات العامة SORA Nexus، `npos` هو وضع الإجماع المتوقع. قد تستخدم منشآت Iroha 3 الأخرى وضع الإذن أو NPoS اعتمادًا على الملف الشخصي المستهدف.

## وقع البيان الفني {#sign-the-manifest}

بعد تحرير والتحقق من JSON، قم بتوقيعه ليصبح كتلة `.nrt` قابلة للنشر:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` يقرأ مفتاح البداية العام للبلوكشين من البيان الفني ويستخدم المفتاح الخاص من ملف عادي ذو ارتباط واحد مملوك للمالك لإنتاج الكتلة الموقعة القابلة للنشر. يجب أن يحتوي الملف على مفتاح خاص واحد بصيغة multihash الكانونية متبوعًا بسطر جديد؛ Kagami يرفض الروابط الرمزية والأنماط غير `0600`. لا يتم قبول المفاتيح الخاصة الخام في سطر الأوامر. النتيجة هي الملف الذي يجب أن يشير إليه أقران الشبكة من خلال إعداداتهم.

## تكوين `iroha3d` {#configure-iroha3d}

وجّه الخدمة الخفية إلى كتلة الجينيسيس الموقعة في البلوكشين:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## أدوات ذات صلة {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

للتنفيذ الخاص بالمولّد وتفاصيل الأوامر، انظر [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
