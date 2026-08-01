---
translation_locale: ar
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# التشغيل Iroha 3 عبر CLI {#operate-iroha-3-via-cli}

ثنائي `iroha` هو عميل خط الأوامر ل Iroha 3. استخدمه لاستعراض حالة دفتر التسجيل، وإرسال المعاملات، ومراقبة نقاط نهاية المشغل.

## 1 . الشروط المسبقة {#_1-prerequisites}

أطلق شبكة محلية أولاً:

- [الإطلاق Iroha 3](./launch-iroha.md)

تفترض الأمثلة أدناه تشكيل العميل الذي تم إنشاؤه من الشبكة المحلية التي تم إنشائه في [إطلاق Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## الإعداد الأساسي CLI {#_2-basic-cli-setup}

أظهروا المساعدة من المستوى الأعلى:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

يتم تنظيم CLI إلى مجموعات القيادة العليا:

- `account` للوجهات المختصرة الموجهة نحو الحساب
- `tx` للمساعدين على مستوى المعاملات
- `ledger` للقراءة والكتابة على الكتيب
- `ops` لتشخيص المشغلين
- `app` للمساعدين في التطبيق API
- `contract` لتنفيذ العقود والمكالمات
- `tools` للمشروعات التشخيصية والمطورة
- `taira` لعمليات العمل الموجهة إلى Taira و Nexus

يحتوي المجموعة `ledger` أيضا على مساعدي المعاملات الخاصة بالمنطقة مثل `ledger transaction`.

استخدام `--output-format text` لإنتاج المشغل القراءة من قبل الإنسان و `--machine` لنظام الأتمتة الصارم.

## جرب شبكة الاختبار العامة Taira {#_3-try-the-public-taira-testnet}

يمكنك تجربة التحققات Taira القراءة فقط قبل تشغيل نظير محلي أو إنشاء مؤشر. تستخدم هذه الأوامر طرق عامة Torii JSON ولا تنفق شبكة اختبار XOR.

التحقق من صحة Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

إدراج النطاقات العامة في مساحة البيانات `universal`:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

إدراج بعض تعريفات الأصول وعرضها الحالي:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

إذا كان لديك `iroha` الثنائي الحالي، تشغيل مساعدة التشخيص Taira:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

قم بإنشاء `taira.client.toml` فقط عندما تكون مستعدًا لاختبار الأوامر الموقعة. انظر [ربط إلى SORA Nexus مخزونات البيانات](/ar/get-started/sora-nexus-dataspaces.md) للحصول على التشغيل والفخار والتدفق القناري. لا تشغيل أوامر الكتابة ضد Taira حتى يتم تمويل الحساب من خلال أصل رسوم الصمام.

بالنسبة لأي مثال مدفوع الرسوم Taira CLI، قم بحفظ مساعدة الصنبورة من [حصل على شبكة اختبارية XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) باسم `taira_faucet_claim.py` ، ثم اطلب أولاً شبكة اختباراتية XOR:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

إذا عادت لغز النوافذ أو مسار المطالبة `502` ، انتظر وتحاول مرة أخرى. هذه مشكلة توافر شبكة اختبار عامة، وليس إشارة لتجديد مفاتيح الحساب.

بعد أن يكون الرصيد مرئيًا ، ضمنت بيانات الأصول الرسومية إلى كتابة:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4 . الأوامر الأساسية لـ Ledger {#_4-basic-ledger-commands}

إدراج جميع النطاقات:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

إنشاء النطاقات العادية يستخدم مخطط مستعار إعلاني؛ لا توجد في `ledger domain` الأوامر الفرعية `register`. قم بإعداد نية خالية من السرية `AliasSetupPlanRequestV1` ل `docs.universal` مع خدمة SDK أو الإدخال ، ثم خطط وتطبيقها:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

الرغبة تعقب مساحة البيانات ID، الحساب القنوني المالك، مدة الإيجار، وحماية الاقتباسات الحالية. المخطط يتحقق من الحالة الفعلية ويرجع الخطة الذرية الدقيقة `EnsureAlias` لتسليمها. لا تنسخ أرقام الحراسة من شبكة أخرى.

أرسل صفقة بنغ بسيطة:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

قراءة حلقة حديثة أو الاشتراك في أحداث الحظر:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5 - أوامر المشغل {#_5-operator-commands}

حالة الإجماع:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

لقطة تأخير لكل مرحلة:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

المتاحة، الجمع، RBC مخزون الخلفي، والتصوير الفوري VRF:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

معايير الإجماع على السلسلة:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. إلى أين نذهب بعد ذلك؟ {#_6-where-to-go-next}

- [SDK تعليمات](/ar/guide/tutorials/)
- [نقاط نهاية Torii](/ar/reference/torii-endpoints.md)
- [العمل مع ثنائيات Iroha](/ar/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

لإعادة إصدار صورة لمساعدة Markdown الكاملة من التسجيل المصدر، قم بتشغيل:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
