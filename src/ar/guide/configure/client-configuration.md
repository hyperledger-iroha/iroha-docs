---
translation_locale: ar
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# تكوين العميل {#client-configuration}

Iroha CLI و SDK العملاء يستخدمون TOML التكوين. المخبأ يرسل
التشغيل الراهن في `defaults/client.toml`; إنشاء الشبكات المحلية أيضا كتابة
التطابق `client.toml` في دليل الإخراجات

::: details نموذج تشكيل العميل

<<< @/snippets/client.template.toml

:::

## الحقول الأساسية {#core-fields}

على الأقل، تشكيل العميل يحدد السلسلة Torii نقطة النهاية، و
حساب التوقيع:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` يختار السلسلة التي تنتمي إليها المعاملات المقدمة.
- `torii_url` النقاط في الزملاء Torii HTTP API.
- `[account].domain` يستخدمها CLI الإختصارات وتشفير اختيار العناوين
  القوانين `AccountId` نفسها لا توجد مجال لها
- `[account].public_key` و `[account].private_key` التوقيع على المعاملات.

يجب أن يكون الحساب موجودًا بالفعل على السلسلة. بالنسبة للشبكة المحلية الافتراضية هذا هو
يتم التعامل معها بواسطة دليل التكوين المجمع.

::: info حساسية الحالة

Iroha الأسماء حساسة للحالة بعد التحليل القنوني.
`wonderland.universal`, `Wonderland.universal`, و
`looking_glass.universal` هي أساسيات مختلفة.

:::

## التصديق الأساسي {#basic-authentication}

الاختياري `[basic_auth]` القسم يضيف: HTTP `Authorization` الرأس إلى
طلبات العميل Iroha الأقران لا يفسرون هذه الإثباتات مباشرة؛ استخدام
عندما Torii هو وراء وكيل عكس مثل Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## إعدادات المعاملة {#transaction-settings}

سلوك المعاملات يتم تشكيلها مع `[transaction]` القسم:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` هو عمر المعاملة في ملايين الثانية.
- `status_timeout_ms` يسيطر على مدى انتظار العميل للمعاملة
  الوضع
- `nonce = true` يطلب من العميل إدراج عقد غير متكرر
  تُنتج حشيش مختلف.

## ربط إعدادات الصف {#connect-queue-settings}

الحالي Iroha يمكن للعملاء أيضا استخدام الخيار الاختياري `[connect]` القسم المحلي
حالة الصف:

```toml
[connect]
queue_root = "./queue"
```

استخدم هذا عندما يحتاج سير العمل إلى تخزين طويل الأمد على جانب العميل.

## إنشاء التكوينات {#generating-configurations}

للشبكات المحلية القابلة للتخلص منها، تفضل Kagami لأنه يكتب مطابقة Iroha
3 التجمعات، الجينيزة، النصوص، و README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

استخدم المعلومات التي تم إنتاجها `./localnet/client.toml` مع CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
