---
translation_locale: ar
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# التكوين {#genesis}

يحدد Genesis حالة السلسلة الأولية. المصدر المحرر هو JSON manifesto، و Iroha 3 العقدة تستهلك ملف المعاملات الموقّع Norito.

::: details إشارة التكوين الافتراضية

<<< @/snippets/genesis.json

:::

## الملفات {#files}

يرسل مخزن الأعلى التيار إشعار افتراضي إلى `defaults/genesis.json`. تقوم الشبكات التي تم إنشاؤها بواسطة Kagami بكتابة إشعار خاص بها وتوقيع المعاملات الخاصة بها في دليل الخروج:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

يقوم `README.md` الذي تم إنشاؤه في هذا السجل بتسجيل الملفات الدقيقة وأوامر التشغيل للملف الشخصي المحدد.

## تكوين الأقران {#peer-configuration}

أقرانهم يشيرون إلى المعاملة التي تم توقيعها في `[genesis]` في `config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

جميع الأقران في الشبكة يجب أن يوافقوا على معاملة التأليف الموقعة ومفتاح الجينس العام.

## توقيع التكوين {#signing-genesis}

إذا قمت بتحرير المخطط يدويًا، قم بالتحقق منه وتوقيعه قبل البدء في عمل الأقران:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

لـ (NPoS) أو Nexus الملفات الشخصية، وتشمل الترتيبات BLS إثباتات الملكية التي تتطلبها الملف الشخصي الذي تم إنشاؤه. Kagami `localnet`, `wizard`, وأوامر توليد الملفات الشخصية تتعامل مع هذه التفاصيل تلقائياً.

## إعادة كتابة التكوين {#recommitting-genesis}

يرتكب الزميل الجنيس فقط عندما يكون مخزنها فارغًا. لاختبار جنيس جديد في شبكة محلية قابلة للتخلص ، إيقاف الأقران ، وإزالة دليل الحالة التي تم إنشاؤها ، والبدء من الجنيس الجديد الموقع. لا تستبدل الجنيس على الشبكة العاملة ما لم يتم تنسيق كل مرجع الهجرة نفسها.
