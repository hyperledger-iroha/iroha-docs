---
translation_locale: ar
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: google-translate
---

# سفر التكوين {#genesis}

يحدد سفر التكوين حالة السلسلة الأولية.المصدر القابل للتحرير هو أ JSON يظهر،
و Iroha 3 العقدة تستهلك موقعة Norito ملف الصفقة.

::: details بيان التكوين الافتراضي

<<< @/snippets/genesis.json

:::

## ملفات {#files}

يقوم مستودع المنبع بشحن بيان افتراضي في `defaults/genesis.json`.
Kagami تقوم الشبكات التي تم إنشاؤها بكتابة البيان الخاص بها والمعاملة الموقعة فيها
دليل الإخراج:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

المتولدة `README.md` في هذا الدليل يسجل الملفات الدقيقة ويبدأ
أوامر لملف التعريف المحدد.

## تكوين الأقران {#peer-configuration}

يشير الزملاء إلى معاملة التكوين الموقعة في `[genesis]` قسم من
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

يجب أن يتفق جميع الأقران في الشبكة على معاملة التكوين الموقعة و
نشأة المفتاح العام.

## توقيع سفر التكوين {#signing-genesis}

إذا قمت بتحرير البيان يدويًا، فقم بالتحقق من صحته وتوقيعه قبل بدء النظراء:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` يجب أن يكون وضعًا مملوكًا للمالك-`0600`, رابط واحد
ملف عادي يحتوي على مفتاح خاص متعدد التجزئة ونهائي
السطر الجديد. Kagami يرفض الروابط الرمزية ولا يقبل أبدًا نشأة خام خاصة
المفتاح في سطر الأوامر.

بالنسبة لـ NPoS أو Nexus التشكيلات الجانبية، بما في ذلك طوبولوجيا و BLS إثباتات الحيازة
المطلوبة من قبل الملف الشخصي الذي تم إنشاؤه. Kagami `localnet`, `wizard`, والملف الشخصي
تتعامل أوامر الإنشاء مع هذه التفاصيل تلقائيًا.

## إعادة ارتكاب سفر التكوين {#recommitting-genesis}

لا يرتكب النظير عملية التكوين إلا عندما يكون مخزنه فارغًا.لاختبار نشأة جديدة في
شبكة محلية يمكن التخلص منها، وإيقاف الأقران، وإزالة دليل الحالة الذي تم إنشاؤه،
والبدء من التكوين الموقع الجديد.لا تحل محل سفر التكوين على التوالي
الشبكة ما لم يكن كل مدقق يقوم بتنسيق نفس عملية الترحيل.
