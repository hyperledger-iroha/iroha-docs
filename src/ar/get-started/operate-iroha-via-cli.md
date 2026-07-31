---
translation_locale: ar
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# التشغيل Iroha 3 عبر CLI {#operate-iroha-3-via-cli}

(الـ) `iroha` ثنائي هو عميل خط الأوامر ل Iroha 3. استخدمها للإستفسار
بيانات الكتيب العام، تقديم المعاملات، وتفتيش نقاط نهاية المشغل.

## 1 - الشروط المسبقة {#_1-prerequisites}

أبدأ بشبكة محلية أولاً:

- [إطلاق Iroha 3](./launch-iroha.md)

المثال أدناه يفترض تشكيل العميل الذي تم إنشاؤه من الشبكة المحلية
التي تم إنشاؤها في [إطلاق Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2 . الأساسية CLI الإعداد {#_2-basic-cli-setup}

أظهروا المساعدة من المستوى الأعلى:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

(الـ) CLI يتم تنظيمها في مجموعات القيادة العليا:

- `account` للوجهات المختصرة الموجهة نحو الحساب
- `tx` للمساعدين على مستوى المعاملات
- `ledger` للقراءة والكتابة
- `ops` للتشخيص للمشغل
- `app` للتطبيق API المساعدين
- `contract` لتنفيذ العقود والدعوات
- `tools` للمرافق التشخيصية والمطورة
- `taira` لـ Taira و Nexus-تدفقات العمل المستهدفة

(الـ) `ledger` يحتوي المجموعة أيضا على مساعدي المعاملات الخاصة بالمنطقة مثل
`ledger transaction`.

الاستخدام `--output-format text` لإنتاج المستخدم القراءة من قبل الإنسان و `--machine`
لنظام التلقائية الصارم.

## 3 - حاولي أن تظهر للجمهور Taira شبكة اختبار {#_3-try-the-public-taira-testnet}

يمكنك تجربة القراءة فقط Taira التحقق قبل تشغيل نظير محلي أو إنشاء
هذه الأوامر تستخدم العامة Torii JSON الطرق ولا تنفق شبكة اختبار
XOR.

تحقق Taira الصحة:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

إدراج المناطق العامة في `universal` مساحة البيانات:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

قم بإدراج بعض تعريفات الأصول وعرضها الحالي:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

إذا كان لديك التيار `iroha` ثنائي، تشغيل Taira مساعد التشخيص:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

الإبداع `taira.client.toml` فقط عندما تكون مستعدًا لاختبار الأوامر الموقعة
انظروا [التواصل SORA Nexus البيانات](/ar/get-started/sora-nexus-dataspaces.md)
لا تتمكنوا من كتابة أوامر ضد
Taira حتى يتم تمويل الحساب من خلال أصول رسوم المياه.

مقابل أي رسوم Taira CLI على سبيل المثال، إنقاذ مساعدة الصنبور من
[احصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
كما `taira_faucet_claim.py`, ثم تستحق الشبكة XOR أولاً:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

إذا عادت لغز المياه أو مسار المطالبة `502`, انتظروا و حاولوا مرة أخرى
مشكلة توافر شبكة اختبار عامة، وليس إشارة لتجديد مفاتيح الحساب.

بعد أن يكون الرصيد مرئيًا ، ضمنت بيانات الأصول الرسومية إلى كتابة:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4 . الأوامر الأساسية {#_4-basic-ledger-commands}

قم بإدراج جميع الأسماء:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

إنشاء النطاقات العادية يستخدم مخطط الاسم الإعلاني؛ `ledger
domain` القيادة لا `register` -أعدّوا سرية سريّة
`AliasSetupPlanRequestV1` نية `docs.universal` مع زوجك SDK أو
خدمة الإدخال، ثم تخطيط وتطبيقها:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

الـ (Intent pins) يُمْكِنُ أَنْ يُسْتَقْبِلَ مساحة البيانات ID, حساب المالك القنوني، مدة الإيجار،
المخطط يؤكد الحالة الفعلية ويرجع الدقة
الذرة `EnsureAlias` خطة لتقديم. لا نسخ يدويا القيم الحراسية من شخص آخر
الشبكة

أرسل صفقة بنغ بسيطة:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

اقرأ الحلقة الأخيرة أو الاشتراك في أحداث الحظر:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5 - أوامر المشغل {#_5-operator-commands}

حالة الإجماع:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

صورة سريعة للتخفيف لكل مرحلة:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

التوافر، الجمع، RBC التخلف، و VRF صورة سريعة:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

معايير الإجماع على السلسلة:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. إلى أين نذهب بعد ذلك؟ {#_6-where-to-go-next}

- [SDK التعليمات](/ar/guide/tutorials/)
- [Torii النقاط النهائية](/ar/reference/torii-endpoints.md)
- [العمل مع Iroha الثنائيات](/ar/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

لإعادة إصدار صورة لمساعدة Markdown كاملة من التحقق المصدر، قم بتشغيل:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
