---
translation_locale: ar
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# تكوين العميل {#client-configuration}

يستخدم العملاء Iroha و CLI و SDK تكوين TOML. تقوم المستودعات بشحن الافتراضي الحالي في `defaults/client.toml`؛ كما تقوم الشبكات المحلية المولدة أيضًا بكتابة `client.toml` المطابق في دليل الإخراج الخاص بها.

::: details قالب إعدادات العميل

<<< @/snippets/client.template.toml

:::

## الحقول الأساسية {#core-fields}

يحدد إعداد العميل، كحد أدنى، السلسلة وهوية شبكتها ونقطة نهاية Torii وسياق شبكة الحساب ومفتاح التوقيع:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` يحدد السلسلة التي تنتمي إليها المعاملات المقدمة.
- `network_id` هو هوية الشبكة المشتقة من التكوين الأولي التي يرتبط بها كل طلب موقّع. اضبط واحدًا بالضبط من `network_id` أو `network_id_file`؛ وتعلن العقدة القيمة عند `GET /v1/accounts/capabilities`.
- `torii_url` يشير إلى نظيره في الشبكة Torii HTTP API.
- يحدد `[account].chain_discriminant` بادئة حسابات I105 للشبكة. يمكن للشبكات العامة استخدام `[account].profile = "taira"` أو `"minamoto"` بدلًا منه. يلزم أحد الخيارين، ولا يتضمن معرّف الحساب المعياري `AccountId` نفسه نطاقًا.
- `[account].public_key` و `[account].private_key` يوقعان المعاملات؛ يمكن لـ `private_key_file` استبدال `private_key`.

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

تقرأ CLI الخاصة بـ`iroha` أيضًا قسمًا اختياريًا `[connect]` لحالة الطابور المحلي. لا يقبل إعداد SDK القابل لإعادة الاستخدام هذا القسم:

```toml
[connect]
queue_root = "./queue"
```

استخدم هذا عندما يتطلب سير العمل تخزينًا دائمًا لطابور جانب العميل. القيمة الافتراضية لـ`connect.queue_root` هي `~/.iroha/connect`، ويُحل المسار النسبي انطلاقًا من الدليل الذي يحتوي ملف TOML الخاص بالعميل.

## توليد التكوينات {#generating-configurations}

لشبكات محلية قابلة للاستخدام مرة واحدة، يفضل استخدام Kagami لأنه يكتب تكوينات Iroha 3 المطابقة، منشأ البلوكشين، السكربتات، و README:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

استخدم `./localnet/client.toml` الذي تم إنشاؤه مع CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
