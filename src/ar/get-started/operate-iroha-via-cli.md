---
translation_locale: ar
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# شغّل Iroha 3 عبر CLI {#operate-iroha-3-via-cli}

الملف الثنائي `iroha` هو عميل سطر الأوامر لـ Iroha 3. استخدمه للاستعلام عن حالة دفتر الأستاذ البلوكي، تقديم المعاملات، وفحص نقاط نهاية المشغل API.

## 1. المتطلبات الأساسية {#_1-prerequisites}

ابدأ شبكة محلية أولاً:

- [إطلاق Iroha 3](./launch-iroha.md)

تفترض الأمثلة أدناه تكوين العميل المولد من الشبكة المحلية التي تم إنشاؤها في [إطلاق Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. الإعداد الأساسي CLI {#_2-basic-cli-setup}

عرض المساعدة على المستوى الأعلى:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

يتم تنظيم CLI في مجموعات القيادة العليا التالية:

- `account` للاختصارات الموجهة للحساب
- `tx` لمساعدي مستوى المعاملات
- `ledger` للقراءة والكتابة على دفتر السجل الخاص بالبلوكتشين
- `ops` لتشخيصات المشغل
- `app` لمساعدي التطبيق API
- `contract` لنشر العقد والاستدعاءات التقنية
- `tools` للتشخيص وأدوات المطور
- `taira` لـ Taira و Nexus-الموجهة نحو سير العمل

تحتوي مجموعة `ledger` أيضًا على مساعدي معاملات محددين بالنطاق مثل `ledger transaction`.

استخدم `--output-format text` لمخرجات المشغل القابلة للقراءة البشرية و`--machine` لوضع الأتمتة الصارم.

## 3. جرب شبكة الاختبار العامة Taira {#_3-try-the-public-taira-testnet}

يمكنك تجربة فحوص Taira فقط للقراءة قبل تشغيل نظير الشبكة المحلي أو إنشاء موقّع تشفير. تستخدم هذه الأوامر مسارات Torii JSON العامة ولا تنفق XOR من شبكة الاختبار.

تحقق من حالة Taira:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

قائمة النطاقات العامة في فضاء البيانات `universal`:

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

قم بإنشاء `taira.client.toml` فقط عندما تكون جاهزًا لاختبار الأوامر الموقعة. انظر [الاتصال بمساحات البيانات SORA Nexus](/ar/get-started/sora-nexus-dataspaces.md) للإعداد، وخدمة تمويل الشبكة التجريبية، وتدفق الكناري. لا تقم بتشغيل أوامر الكتابة على Taira حتى يتم تمويل الحساب بأصل رسوم خدمة تمويل الشبكة التجريبية.

لأي مثال يدفع الرسوم Taira CLI، احفظ مساعد خدمة تمويل الشبكة التجريبية من [احصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) باسم `taira_faucet_claim.py`، ثم اطلب XOR الشبكة التجريبية أولاً:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

إذا عاد مسار خدمة تمويل الشبكة التجريبية أو الطلب بـ `502`، انتظر وحاول مرة أخرى. هذه مشكلة في توفر الشبكة التجريبية العامة، وليست إشارة لإعادة توليد مفاتيح الحساب.

بعد أن يصبح الرصيد مرئيًا، قم بإرفاق بيانات تعريف أصل الرسوم إلى الكتابات:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## ٤. أوامر دفتر الأستاذ الأساسي للبلوكتشين {#_4-basic-ledger-commands}

قم بسرد جميع النطاقات:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

يستخدم إنشاء النطاق العادي مخطط الاسم المستعار الإعلاني؛ لا يحتوي الأمر `ledger domain` على الأمر الفرعي `register`. حضّر نية `AliasSetupPlanRequestV1` خالية من الأسرار لـ `docs.universal` باستخدام SDK أو خدمة الإعداد الخاصة بك، ثم خطط وطبقها:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

النوايا تحدد معرف مساحة البيانات، حساب المالك الموحد لبروتوكول واحد، مدة الإيجار، وحارس التحقق من السعر الحالي للرسوم. يقوم المخطط بالتحقق من الحالة الحية ويعيد الخطة الذرية الدقيقة `EnsureAlias` للتقديم. لا تقم بنسخ قيم الحارس من شبكة أخرى يدوياً.

أرسل معاملة تنبيه بسيطة:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

اقرأ كتلة حديثة أو اشترك في أحداث الكتل:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## ٥. أوامر المشغل {#_5-operator-commands}

أوامر مشغّل الإجماع تتطلب مفتاح بيئة تنفيذ البرمجيات المدرجة في القائمة المسموح بها. احتفظ به خارج `client.toml` ومرّر الملف الخاص بالمالك فقط صراحةً:

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

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

شهادات النصاب الأعلى والمقفلة للاتفاقية:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
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
- [Torii API نقاط النهاية](/ar/reference/torii-endpoints.md)
- [العمل مع ثنائيات Iroha](/ar/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

لإعادة إنشاء لقطة كاملة لمساعدة Markdown من نسخة المصدر، نفّذ:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
