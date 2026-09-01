---
translation_locale: ar
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# الأصول {#assets}

الأصل Iroha هو رصيد رقمي يحتفظ به حساب. كل رصيد ملموس يشير إلى `AssetDefinition`، وتعبر التعريفات عن كيفية تسمية هذا الأصل وإصداره وعرضه وتقسيمه.

## تعريف الأصل {#asset-definition}

يشمل `AssetDefinition`:

- `id`: عنوان تعريف الأصل الموحد وفق المعيار البروتوكولي
- `name`: اسم عرض يمكن للإنسان قراءته
- `description`: وصف اختياري قابل للقراءة من قبل الإنسان
- `alias`: الاسم المستعار الاختياري في شكل `<name>#<domain>.<dataspace>` أو `<name>#<dataspace>`
- `spec`: الدقة الرقمية والقيود على الأرصدة
- `mintable`: سياسة إصدار الأصول
- `logo`: اختياري `SoraFS` URI
- `metadata`: بيانات وصفية عشوائية على شكل مفتاح-قيمة
- `balance_scope_policy`: سواء كانت الأرصدة عامة أو مقيدة بمساحة البيانات
- `owned_by`: الحساب الذي سجل أو يملك التعريف
- `total_quantity`: إجمالي الكمية المُصدرة
- `confidential_policy`: سياسة عمليات الأصول المحمية

معرّفات تعريف الأصول هي عناوين غامضة ذات معيار بروتوكول واحد. عندما يتم إنشاء تعريف من نطاق واسم، يمكن لـ Iroha الاحتفاظ بإسقاط النطاق/الاسم ذلك من أجل UX والاستفسارات، لكن شكل النص الواحد المعياري للبروتوكول هو العنوان المُنشأ.

## رصيد الأصول {#asset-balance}

يشمل `Asset`:

- `id`: `AssetId`، الذي يجمع بين تعريف الأصل، وحساب الحامل، ونطاق رصيد الأصل الاختياري
- `value`: رصيد `Numeric`

حساب الحامل هو بروتوكول قياسي مفرد وخالي من النطاق. يمكن عرض تعريف الأصل تحت نطاق مؤهل بمساحة البيانات، على سبيل المثال `payments.universal`.

## سياسة إصدار الأصول {#mintability}

تدعم تعريفات الأصول أوضاع سياسات إصدار الأصول هذه:

|الوضع|المعنى|
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` |العرض المرن. يمكن إصدار الأصل وتدميره بشكل متكرر.|
| `Once`       |رمز ذو عرض ثابت. يمكن إصداره مرة واحدة ثم تدميره.|
| `Not`        |رمز ذو عرض ثابت يمكن تدميره ولكن لا يمكن إصداره مرة أخرى.|
| `Limited(n)` |تسمح السياسة بإصدار وحدات أصول جديدة في عدد محدود من العمليات الإضافية.|

استخدم `Infinitely` للأصول المرنة العادية و`Once` أو `Limited(n)` للأصول ذات العرض الثابت أو المحدود. لا تستخدم `Not` كسياسة أولية إلا إذا كان عرض الأصول محددًا مسبقًا.

## نطاق رصيد الأصول {#balance-scope}

الـ `balance_scope_policy` يتحكم في كيفية تقسيم الأرصدة:

- `Global`: قسم رصيد واحد لكل حساب وتحديد الأصل
- `DataspaceRestricted`: يتم تقسيم الأرصدة حسب سياق مساحة البيانات

الرصيد المحدود بمساحة البيانات مفيد عندما يتم استخدام تعريف الأصول نفسه عبر عدة مساحات بيانات Nexus ولكن يجب أن تظل الأرصدة معزولة.

## شغّل سير العمل هذا على Taira {#try-it-on-taira}

تُظهر هذه الطلبات للقراءة فقط API تعريفات الأصول الحقيقية على شبكة الاختبار العامة Taira:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

ابحث عن تعريف أصل رسوم Taira XOR الحالي:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

ابحث عن التعريفات التي تحتوي على بيانات وصفية:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

جميع الأمثلة الثلاثة هي للقراءة. لإصدار أو تدمير أو نقل الأصول على Taira، استخدم حسابًا ممولًا من الشبكة الاختبارية وتدفق محمي في [الاتصال بمساحات البيانات SORA Nexus](/ar/get-started/sora-nexus-dataspaces.md).

لمثال على أصل في Taira يتطلب دفع رسوم، احفظ أداة خدمة تمويل الاختبار من [الحصول على XOR لشبكة Taira التجريبية](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) باسم `taira_faucet_claim.py`، ثم اطلب أصل الاختبار أولًا واستخدمه أصلًا لرسوم تنفيذ المعاملة:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

ثم قم بتضمين `--metadata ./taira.tx-metadata.json` على أوامر `ledger asset mint` و `ledger asset burn` و `ledger asset transfer`.

## تعليمات {#instructions}

يمكن تسجيل الأصول وإصدارها وتدميرها ونقلها باستخدام عمليات تعليمات Iroha:

- [`Register` و `Unregister`](/ar/blockchain/instructions.md#un-register)
- [`Mint` و `Burn`](/ar/blockchain/instructions.md#mint-burn)
- [`Transfer`](/ar/blockchain/instructions.md#transfer)
- [`SetKeyValue` و `RemoveKeyValue`](/ar/blockchain/instructions.md#setkeyvalue-removekeyvalue)

انظر أيضًا:

- [CLI دليل](/ar/get-started/operate-iroha-via-cli.md)
- [Rust درس تعليمي](/ar/guide/tutorials/rust.md)
- [Python درس تعليمي](/ar/guide/tutorials/python.md)
- [دروس JavaScript/TypeScript](/ar/guide/tutorials/javascript.md)
- [نموذج البيانات](/ar/blockchain/data-model.md)
- [NFTs](/ar/blockchain/nfts.md)
