---
translation_locale: ar
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# تكوين العميل {#client-configuration}

Iroha CLI و SDK العملاء يستخدمون TOML التكوين. المستودع يرسل الوضع الافتراضي الحالي إلى `defaults/client.toml`; الشبكات المحلية التي تم إنشاؤها أيضا كتابة مطابقة `client.toml` في دليل الإخراجات الخاصة بهم.

::: details نموذج تشكيل العميل

<<< @/snippets/client.template.toml

:::

## الحقول الأساسية {#core-fields}

على الأقل، تشكيل العميل يحدد السلسلة، Torii نقطة نهاية، والحساب التوقيعي:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- يختار `chain` السلسلة التي تنتمي إليها المعاملات المقدمة.
- `torii_url` نقاط في الزميل Torii HTTP API.
- `[account].domain` يستخدمها اختصارات CLI وتشفير اختيار العناوين؛ القنوية `AccountId` نفسها بلا مجال.
- `[account].public_key` و `[account].private_key` توقيع المعاملات.

يجب أن يكون الحساب موجودًا بالفعل على السلسلة. بالنسبة للشبكة المحلية الافتراضية يتم التعامل مع هذا من خلال بيان التكوين المجمّع.

::: info حساسية الحالة

أسماء Iroha حساسة للحالة بعد التحليل القنوني. على سبيل المثال، `wonderland.universal` ، `Wonderland.universal` ، و `looking_glass.universal` هي حرفيات نطاق مختلفة.

:::

## التصديق الأساسي {#basic-authentication}

الاختياري `[basic_auth]` القسم يضيف: HTTP `Authorization` عنوان طلبات العميل. Iroha الأقران لا يفسرون هذه الإثباتات مباشرة؛ استخدموها عندما Torii وراء الوكيل العكسي مثل Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## إعدادات المعاملة {#transaction-settings}

يتم تشكيل سلوك المعاملات مع قسم `[transaction]`:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` هو عمر المعاملة في الميلي ثانية.
- `status_timeout_ms` يسيطر على مدى انتظار العميل لحالة المعاملة.
- `nonce = true` يطلب من العميل إدراج عبارة غير متكررة حتى تنتج المعاملات المختلفة.

## ربط إعدادات الصف {#connect-queue-settings}

يمكن لعملاء Iroha الحاليين أيضا استخدام القسم الاختياري `[connect]` لحالة الصف المحلي:

```toml
[connect]
queue_root = "./queue"
```

استخدم هذا عندما تحتاج سير العمل إلى تخزين طويل الأمد على جانب العميل.

## توليد الإعدادات {#generating-configurations}

بالنسبة للشبكات المحلية القابلة للتفريغ، تفضل Kagami لأنه يكتب مطابقة Iroha 3 التكوينات، الجنيس، النصوص، و README: .

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

استخدم `./localnet/client.toml` المولد مع CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
