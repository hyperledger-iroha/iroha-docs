---
translation_locale: ar
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# تكوين العميل {#client-configuration}

يستخدم العملاء Iroha و CLI و SDK تكوين TOML. تقوم المستودعات بشحن الافتراضي الحالي في `defaults/client.toml`؛ كما تقوم الشبكات المحلية المولدة أيضًا بكتابة `client.toml` المطابق في دليل الإخراج الخاص بها.

::: details قالب إعدادات العميل

<<< @/snippets/client.template.toml

:::

## الحقول الأساسية {#core-fields}

على الأقل، تحدد تهيئة العميل السلسلة، ونقطة النهاية Torii API، وحساب التوقيع:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` يحدد السلسلة التي تنتمي إليها المعاملات المقدمة.
- `torii_url` يشير إلى نظيره في الشبكة Torii HTTP API.
- `[account].domain` يُستخدم بواسطة اختصارات CLI وترميز محدد العنوان؛ المعيار البروتوكولي الوحيد `AccountId` نفسه بلا نطاق.
- `[account].public_key` و `[account].private_key` يوقّعان المعاملات.

يجب أن يكون الحساب موجودًا مسبقًا على السلسلة. وفي الشبكة المحلية الافتراضية، يتولى بيان genesis المضمّن ذلك.

::: info حساسية حالة الأحرف

أسماء Iroha حساسة لحالة الأحرف بعد التحليل المعياري للبروتوكول الفردي. على سبيل المثال، `wonderland.universal`، `Wonderland.universal`، و `looking_glass.universal` هي ثوابت نطاق متميزة.

:::

## المصادقة الأساسية {#basic-authentication}

يضيف القسم الاختياري `[basic_auth]` رأس HTTP `Authorization` لطلبات العميل. لا يقوم نظراء الشبكة Iroha بتفسير هذه الاعتماديات مباشرة؛ استخدمها عندما يكون Torii خلف وكيل عكسي مثل Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## إعدادات المعاملة {#transaction-settings}

يتم تكوين سلوك المعاملة باستخدام القسم `[transaction]`:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` هو عمر المعاملة بالمللي ثانية.
- `status_timeout_ms` يتحكم في المدة التي ينتظرها العميل لمعرفة حالة المعاملة.
- `nonce = true` يطلب من العميل تضمين قيمة أعداد عشوائية مشفرة بحيث تنتج المعاملات المتكررة تجزئات مشفرة مختلفة.

## إعدادات قائمة الانتظار للاتصال {#connect-queue-settings}

يمكن للعملاء الحاليين Iroha أيضًا استخدام القسم الاختياري `[connect]` لحالة قائمة الانتظار المحلية:

```toml
[connect]
queue_root = "./queue"
```

استخدم هذا عندما يحتاج سير العمل إلى تخزين قائمة انتظار على جانب العميل بشكل دائم.

## توليد التكوينات {#generating-configurations}

لشبكات محلية قابلة للاستخدام مرة واحدة، يفضل استخدام Kagami لأنه يكتب تكوينات Iroha 3 المطابقة، منشأ البلوكشين، السكربتات، و README:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

استخدم `./localnet/client.toml` الذي تم إنشاؤه مع CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
