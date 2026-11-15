---
translation_locale: ar
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 40714a6cd124d4b0342b0f6ecf321f286e714c0e236afd6fd7834c0cf0ad1165
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# شغّل Iroha 3 عبر CLI {#operate-iroha-3-via-cli}

الملف التنفيذي `iroha` هو عميل سطر الأوامر لـIroha 3. استخدمه للاستعلام عن حالة دفتر السجل وإرسال المعاملات وفحص نقاط نهاية المشغّل.

## 1. المتطلبات الأساسية {#_1-prerequisites}

من نسخة مستخرجة من مستودع Iroha عند مراجعة المصدر الموثقة، أنشئ شبكة محلية من أربعة أقران وشغّلها:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
./localnet/start.sh
```

تستخدم الأمثلة أدناه تكوين العميل المولَّد الخاص بها، `./localnet/client.toml`.

## 2. الإعداد الأساسي CLI {#_2-basic-cli-setup}

عرض المساعدة على المستوى الأعلى:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

يتم تنظيم CLI في مجموعات القيادة العليا التالية:

- `account` لقراءة الحسابات وتعديلها
- `explorer` لتدفقات المستكشف مع مرشحات وترقيم صفحات مشتركين
- `tx` لحالة المعاملات وأدواتها المساعدة
- `ledger` للقراءة والكتابة على دفتر السجل الخاص بالبلوكتشين
- `trigger` لقراءة المشغّلات وكتابتها وتنفيذها
- `ops` لتشخيصات المشغل
- `app` لمساعدي التطبيق API
- `contract` لاستدعاءات العقود واستعلاماتها وتصحيحها محليًا؛ انشر باستخدام `kagami contract deploy` أو `musubi deploy`
- `tools` للتشخيص وأدوات المطور
- `dataspace` لتخطيط تعريف مساحة بيانات وتطبيقه وفحصه
- `taira` لتشخيصات Taira وإعداد الحساب
- `offline` لأدوات الترميز والتقارير والتشخيصات دون اتصال
- `soracloud` لمساعدي منصة تطبيق Soracloud
- `sccp` لقراءات بروتوكول SORA Cross-Chain Protocol وتحويلاته وإثباتاته

يتطلب كل أمر يرسل معاملة تحديد دافع الرسوم صراحة، مثل `--fee-payer authority`؛ وتعرض CLI الرسوم الدقيقة قبل التوقيع.

استخدم `--output-format text` لمخرجات المشغل القابلة للقراءة البشرية و`--machine` لوضع الأتمتة الصارم.

## 3. جرب شبكة الاختبار العامة Taira {#_3-try-the-public-taira-testnet}

يمكنك تجربة فحوص Taira فقط للقراءة قبل تشغيل نظير الشبكة المحلي أو إنشاء موقّع تشفير. تستخدم هذه الأوامر مسارات Torii JSON العامة ولا تنفق XOR من شبكة الاختبار.

تحقق من حالة Taira:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

اعرض النطاقات المرئية لقارئ غير مصادَق عليه:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

اذكر بعض تعريفات الأصول وإمداداتها الحالية:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

إذا كان لديك النسخة الثنائية الحالية `iroha`، فقم بتشغيل مساعد التشخيص Taira:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

أنشئ `taira.client.toml` فقط عندما تكون مستعدًا لاختبار الأوامر الموقّعة. راجع [الاتصال بمساحات بيانات SORA Nexus](/ar/get-started/sora-nexus-dataspaces.md) للإعداد وخدمة التمويل التجريبي وتدفق اختبار التشغيل الأساسي. لا تشغّل أوامر الكتابة على Taira حتى يُموّل الحساب بأصل الرسوم من خدمة التمويل التجريبي.

لكل مثال CLI على Taira يدفع رسومًا، موّل الموقّع باتباع تدفق خدمة التمويل التجريبي ذي مرحلة الإعداد في [الحصول على XOR التجريبي على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)، ثم تحقق من الرصيد:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

إذا أعاد مسار خدمة تمويل الشبكة التجريبية `502`، انتظر وحاول مرة أخرى. هذه مشكلة في توفر الشبكة التجريبية العامة، وليست إشارة لإعادة إنشاء مفاتيح الحساب.

بعد ظهور الرصيد، أرسل عمليات الكتابة مع `--fee-payer authority`. تعرض CLI الرسوم الدقيقة بعملة رسوم Taira قبل التوقيع:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## ٤. أوامر دفتر الأستاذ الأساسي للبلوكتشين {#_4-basic-ledger-commands}

قم بسرد جميع النطاقات:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

يستخدم إنشاء النطاق العادي مخطط الاسم المستعار الإعلاني؛ لا يحتوي الأمر `ledger domain` على الأمر الفرعي `register`. حضّر نية `AliasSetupPlanRequestV1` خالية من الأسرار لـ `docs.universal` باستخدام SDK أو خدمة الإعداد الخاصة بك، ثم خطط وطبقها:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

تثبّت النية معرّف مساحة البيانات وحساب المالك المعياري ومدة الإيجار وشرط التحقق من التسعير الحالي. يتحقق المخطط من حالة الشبكة العاملة ويعيد خطة `EnsureAlias` الذرية الدقيقة لإرسالها. لا تنسخ قيم شروط التحقق يدويًا من شبكة أخرى.

أرسل معاملة تنبيه بسيطة:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

اقرأ كتلة حديثة أو اشترك في أحداث الكتل:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## ٥. أوامر المشغل {#_5-operator-commands}

تتطلب أوامر مشغّل الإجماع مفتاح تشغيل مدرجًا في قائمة السماح. أبقه خارج `client.toml` ومرّر المسار المطلق لملفه المتاح للمالك وحده:

```bash
# The generated localnet writes its allow-listed operator key here.
: "${OPERATOR_KEY_FILE:=$PWD/localnet/runtime/operator-signer.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

قائمة انتظار غير موثوقة، سير عمل معالجة البرمجيات، الانتخابات، وتشخيص مسارات التنفيذ:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

مسارات الإجماع المثبتة وحالة مثيلاتها على هذه العقدة:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

معلمات الإجماع على السلسلة:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## ٦. إلى أين تذهب بعد ذلك {#_6-where-to-go-next}

- [SDK دروس](/ar/guide/tutorials/)
- [نقاط نهاية Torii](/ar/reference/torii-endpoints.md)
- [العمل مع ثنائيات Iroha](/ar/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

لطباعة نسخة كاملة من المساعدة بتنسيق Markdown من نسخة العمل المصدرية، شغّل:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
