---
translation_locale: ar
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# التكوين {#genesis}

جينيسيس يحدد الحالة الأساسية سلسلة. المصدر المحرر هو JSON المعلن
و Iroha 3 العقدة تستهلك علامة Norito ملف المعاملات.

::: details دليل التكوين الافتراضي

<<< @/snippets/genesis.json

:::

## الملفات {#files}

مخزن فوق التيار يرسل إشارة افتراضية `defaults/genesis.json`.
Kagami-الشبكات التي تم إنشاؤها تكتب صفقاتها المعلنة والموقعة الخاصة بها
دليل الخروج:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

الناتج `README.md` في هذا المجلة تسجيل الملفات الدقيقة والإطلاق
الأوامر الخاصة بالملف الشخصي المختار.

## تكوين الأقران {#peer-configuration}

أقرانهم يشيرون إلى معاملة التأليف الموقعة في `[genesis]` القسم
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

يجب أن يتفق جميع الأقران في الشبكة على المعاملة الموقعة
مفتاح عام

## توقيع التكوين {#signing-genesis}

إذا قمت بتحرير المخطط يدوياً، تأكدي وتوقعي عليه قبل البدء في عمل الأقران:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

لـ NPoS أو Nexus الملفات الشخصية، وتشمل التوضيحات BLS أدلة على امتلاكها
المطلوب من الشخصية التي تم إنشاؤها. Kagami `localnet`, `wizard`, و الملف الشخصي
أوامر الجيل تتعامل مع هذه التفاصيل تلقائياً.

## إعادة تشكيل التكوين {#recommitting-genesis}

يرتكب زميل التكوين فقط عندما يكون مخزنها فارغ.
شبكة محلية قابلة للتخلص منها، ووقف الأقران، وإزالة دليل الدولة الذي تم إنشاؤه
وبدء من التأليف الجديد الموقّع. لا تحل محل التأليf على مسار
الشبكة ما لم يتم تنسيق كل مؤكدة نفس الهجرة.
