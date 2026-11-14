---
translation_locale: ar
translation_source: /blockchain/assets.md
translation_source_hash: 4d0a3f54a0c70d08d11160b9ec66d6538aa2c49c7771a13e4a070b61a9cb3e4b
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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
- `balance_scope_policy`: يحدد ما إذا كانت الأرصدة شاملة أو مقيّدة بمساحة بيانات
- `owned_by`: الحساب الذي سجل أو يملك التعريف
- `total_quantity`: إجمالي الكمية المُصدرة
- `confidential_policy`: سياسة عمليات الأصول المحمية

معرّفات تعريف الأصول هي عناوين غامضة ذات معيار بروتوكول واحد. عندما يتم إنشاء تعريف من نطاق واسم، يمكن لـ Iroha الاحتفاظ بإسقاط النطاق/الاسم ذلك من أجل UX والاستفسارات، لكن شكل النص الواحد المعياري للبروتوكول هو العنوان المُنشأ.

## رصيد الأصول {#asset-balance}

يشمل `Asset`:

- `id`: `AssetId`، الذي يجمع بين تعريف الأصل، وحساب الحامل، ونطاق رصيد الأصل الاختياري
- `value`: رصيد `Numeric`

حساب المالك معياري ولا يتضمن نطاقًا. ويمكن إظهار تعريف الأصل ضمن نطاق مؤهّل باسم مساحة البيانات، مثل `payments.universal`.

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

تفيد الأرصدة المقيّدة بمساحة بيانات عندما يُستخدم تعريف الأصل نفسه عبر عدة مساحات بيانات في SORA Nexus مع ضرورة بقاء الأرصدة معزولة.

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

الأمثلة الثلاثة كلها عمليات قراءة. لإصدار الأصول أو حرقها أو نقلها على Taira، استخدم حسابًا ممولًا من خدمة التمويل التجريبي والتدفق المحكوم بالتحققات في [الاتصال بمساحات بيانات SORA Nexus](/ar/get-started/sora-nexus-dataspaces.md).

لتجربة مثال أصول يدفع الرسوم على Taira، موّل الموقّع أولًا باتباع تدفق خدمة التمويل التجريبي ذي مرحلة الإعداد في [الحصول على XOR التجريبي على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira). ثم مرّر `--fee-payer authority` إلى أوامر `ledger asset mint` و`ledger asset burn` و`ledger asset transfer`؛ تعرض CLI الرسوم الدقيقة بعملة رسوم Taira قبل التوقيع:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "<ASSET_DEFINITION_BASE58>" \
  --account "<TAIRA_I105_ACCOUNT_ID>" \
  --to "<RECIPIENT_I105_ACCOUNT_ID>" \
  --quantity 1
```

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
