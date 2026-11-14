---
translation_locale: ar
translation_source: /guide/configure/genesis.md
translation_source_hash: 91be089c82a76991e35a43e1541f9e069fdf70d3fb5de2492b985c06c78a2372
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta+reviewed-first-release-source-amendment
---
# الكتلة الأولى في سلسلة الكتل {#genesis}

يحدد أصل البلوكتشين الحالة الأولية للسلسلة. المصدر القابل للتحرير هو بيان فني JSON، ويستهلك العقدة Iroha 3 ملف معاملة موقع Norito.

::: details البيان الفني الأساسي لسلسلة الكتل الافتراضية

<<< @/snippets/genesis.json

:::

## ملفات {#files}

يوفر المستودع الأصلي قالب مصدر افتراضيًا في `defaults/genesis.template.json`. القالب غير مكتمل، ولا يمكن التحقق منه أو توقيعه أو استخدامه في عقدة حتى يحوّله `kagami genesis materialize` إلى بيان. تكتب الشبكات المولّدة بواسطة Kagami بيانها الخاص ومعاملتها الموقّعة في دليل الإخراج:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

يسجل `README.md` الذي تم إنشاؤه في ذلك الدليل الملفات الدقيقة وأوامر التشغيل للملف التعريفي المحدد.

## تكوين نظير الشبكة {#peer-configuration}

تشير الأقران إلى معاملة التكوين الأولي الموقّعة في قسم `[genesis]` من `config.toml`، وتثبّت تجزئتها المتوقعة في ملف منفصل:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

يجب أن تتفق جميع الأقران في الشبكة على معاملة التكوين الأولي الموقّعة ومفتاحها العام. يلزم ملف التجزئة المتوقعة عند البدء من جديد وعند إعادة التشغيل؛ ويكتبه `kagami genesis sign --expected-hash-out`.

## توقيع جينيسيس البلوكشين {#signing-genesis}

إذا قمت بتحرير بيان تقني يدويًا، تحقق منه ووقعه قبل بدء أقران الشبكة:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` يجب أن يكون ملفًا عاديًا برابط واحد مملوكًا للمالك `0600` يحتوي على مفتاح خاص متعدد التجزئة واحد وفقًا للبروتوكول وسطر جديد نهائي. Kagami يرفض الروابط الرمزية ولا يقبل أبدًا مفتاح الجيل الأول للبلوكتشين على سطر الأوامر.

لملفات NPoS أو SORA Nexus، ضمّن الطوبولوجيا وإثباتات حيازة مفاتيح BLS التي يتطلبها الملف المولّد. تتولى أوامر Kagami، وهي `localnet generate` و`wizard` و`sora-network generate`، هذه التفاصيل تلقائيًا.

## إعادة الالتزام ببلوكتشين البداية {#recommitting-genesis}

تبدأ الشبكة الجديدة من كتلة التكوين الموقعة الخاصة بها. لاختبار كتلة تكوين مختلفة في شبكة محلية مؤقتة، أوقف النظراء واحذف دليل الحالة الذي أنشؤوه، ثم ابدأ من كتلة التكوين الموقعة الجديدة. يجب ألا تستبدل شبكة قيد التشغيل كتلة التكوين أبدًا بوصف ذلك آلية للترقية. تتطلب تغييرات تعريفات البروتوكول انتقالات في الاختيار تعتمدها الحوكمة وتأهيلًا للتعريفات والالتزامات المختارة.
