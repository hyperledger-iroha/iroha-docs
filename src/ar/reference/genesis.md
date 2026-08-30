---
translation_locale: ar
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# مرجع سفر التكوين {#genesis-reference}

في الحالي Iroha 3 سير العمل، أ `genesis.json` البيان يصف الأول
المعاملات والمعلمات التي سيتم تطبيقها عند بدء تشغيل الشبكة.

القطعة الأثرية الموقعة الموزعة على أقرانهم هي أ Norito-مشفر `.nrt` ملف
من إنتاج `kagami genesis sign`.

## الحقول الرئيسية {#main-fields}

يمكن لبيان التكوين أن يحدد:

- `chain` لمعرف السلسلة
- `executor` للحصول على مسار رمز بايت لترقية المنفذ الاختياري
- `ivm_dir` ل IVM المكتبات المستخدمة بواسطة المشغلات والترقيات
- `consensus_mode` للوضع الأولي المعلن عنه بواسطة البيان
- `transactions` لتحديثات المعلمات المطلوبة والتعليمات والمشغلات والطوبولوجيا
- `crypto` للحصول على لقطة التشفير الأولية

داخل `transactions`, تقوم إدخالات الطوبولوجيا بإقران معرفات الأقران و PoPs معاً:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## إنشاء بيان {#generate-a-manifest}

يستخدم Kagami لإنشاء قالب:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

للجمهور SORA Nexus مساحة البيانات, `npos` هو وضع الإجماع المتوقع.
آخر Iroha 3 قد تستخدم عمليات النشر إذنًا أو NPoS اعتمادًا على الهدف
حساب تعريفي.

## التوقيع على البيان {#sign-the-manifest}

بعد التحرير والتحقق من صحة JSON, قم بتسجيله في ملف قابل للنشر `.nrt` حاجز:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` يقرأ المفتاح العام للتكوين من البيان والاستخدامات
المفتاح الخاص من ملف عادي أحادي الارتباط يملكه المالك لإنتاج ملف
كتلة موقعة قابلة للنشر.يجب أن يحتوي الملف على مفتاح خاص أساسي واحد
تجزئة متعددة متبوعة بسطر جديد؛ Kagami يرفض الروابط الرمزية والأوضاع الأخرى
من `0600`. لا يتم قبول المفاتيح الخاصة الأولية في سطر الأوامر.النتيجة
هو الملف الذي يجب على الأقران الرجوع إليه من التكوين الخاص بهم.

## تكوين `iroha3d` {#configure-iroha3d}

قم بتوجيه البرنامج الخفي إلى كتلة التكوين الموقعة:

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

للحصول على تفاصيل تنفيذ المولد والأمر، راجع
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
