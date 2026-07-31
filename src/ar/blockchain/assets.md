---
translation_locale: ar
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الأصول {#assets}

أصل Iroha هو رصيد عددي يحتفظ به حساب. يشير كل رصيد ملموس إلى `AssetDefinition` ، ويتصف التعريف كيف يمكن تسمية هذا الأصول، وتصنيفها، وعرضها، وقسمها.

## تعريف الأصول {#asset-definition}

يحتوي `AssetDefinition` على:

- `id`: عنوان تعريف الأصول القنونية
- `name`: اسم عرض يمكن القراءة من قبل الإنسان
- `description`: وصف افتراضي يمكن قراءته من قبل الإنسان
- `alias`: مستعار اختياري في نموذج `<name>#<domain>.<dataspace>` أو `<name>#<dataspace>`
- `spec`: الدقة الرقمية والقيود المتعلقة بالموازنة
- `mintable`: سياسة الامتناع
- `logo`: اختياري `SoraFS` URI
- `metadata`: بيانات أساسية تعسفية.
- `balance_scope_policy`: ما إذا كانت الرصيدات عالمية أم محدودة بمجال البيانات.
- `owned_by`: الحساب الذي سجل أو يملك التعريف.
- `total_quantity`: إجمالي الكمية المصدرة
- `confidential_policy`: سياسة عمليات الأصول المحمية

تعريف الأصول IDs هي عناوين غير شفافة قائمة. عندما يتم بناء تعريف من نطاق واسم ، يمكن ل Iroha حفظ هذا النطاق / توقيع الاسم ل UX والاستفسارات ، ولكن شكل النص القائم هو العنوان المولود.

## ميزان الأصول {#asset-balance}

يحتوي `Asset` على:

- `id`: مؤشر `AssetId`، يجمع بين تعريف الأصول وحساب حاملها ونطاق الميزانية الاختيارية
- `value`: رصيد في `Numeric`

الحساب المحتفظ به كانونيكي ودون نطاق. يمكن أن يتم عرض تعريف الأصول تحت نطاق مؤهل لمجال البيانات، على سبيل المثال `payments.universal`.

## إمكانية التخزين {#mintability}

تعريفات الأصول تدعم هذه أنظمة الوصول إلى الخدمة:

|الوضع|المعنى|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |إمدادات مرنة، ويمكن تصنيع الأصول وحرقها مراراً وتكراراً. |
|`Once` |إشارة الإمدادات الثابتة، يمكن صياغتها مرة واحدة ثم حرقها|
|`Not` |علامة إمدادات ثابتة يمكن حرقها ولكن لا يتم صياغتها مرة أخرى.|
|`Limited(n)` |يُسمح بالتصوير في عدد محدود من العمليات الإضافية. |

استخدم `Infinitely` للأصول المرنة العادية و `Once` أو `Limited(n)` لأصول التوريد الثابت أو المحدود. لا تستخدم `Not` كسياسة أولية إلا إذا تم تأسيس إمدادات الأصول بالفعل.

## نطاق التوازن {#balance-scope}

يسيطر `balance_scope_policy` على كيفية وضع الميزانات:

- `Global`: علبة رصيد واحدة لكل حساب وتعريف الأصول
- `DataspaceRestricted`: يتم تقسيم الرصيدات حسب سياق مساحة البيانات

تُعد الرصيدات المحدودة لمجال البيانات مفيدة عندما يتم استخدام نفس تعريف الأصول عبر مكاتب بيانات متعددة Nexus ولكن يجب أن تبقى الرصادات معزولة.

## جربوا ذلك على Taira {#try-it-on-taira}

تظهر هذه المكالمات التي يتم قراءتها فقط تعريفات أصول حقيقية على شبكة اختبار Taira العامة:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

العثور على تعريف أصول الرسوم الحالية Taira XOR

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

ابحث عن التعريفات التي تحمل البيانات المعدنية:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

جميع الأمثلة الثلاثة هي القراءة. لقطع، حرق أو نقل الأصول على Taira, استخدام حساب تمويله من النوافذ والدفق المحافظ في [التواصل مع SORA Nexus مساحات البيانات](/ar/get-started/sora-nexus-dataspaces.md).

لمثال الأصول المدفوعة الرسوم Taira، حفظ مساعدة الصنبور من [حصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ك `taira_faucet_claim.py` ، ثم المطالبة بأصول الصنبور أولاً واستخدامه كأصول غاز المعاملة:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

ثم قم بإدراج `--metadata ./taira.tx-metadata.json` في الأوامر `ledger asset mint`، `ledger asset burn`، و `ledger asset transfer`.

## التعليمات {#instructions}

يمكن تسجيل الأصول وتصنيعها وحرقها ونقلها باستخدام Iroha التعليمات الخاصة:

- [`Register` و`Unregister` ](/ar/blockchain/instructions.md#un-register)
- [`Mint` و`Burn` ](/ar/blockchain/instructions.md#mint-burn)
- [`Transfer`](/ar/blockchain/instructions.md#transfer)
- [`SetKeyValue` و`RemoveKeyValue` ](/ar/blockchain/instructions.md#setkeyvalue-removekeyvalue)

انظر أيضاً:

- [دليل CLI](/ar/get-started/operate-iroha-via-cli.md)
- [Rust التعليمية](/ar/guide/tutorials/rust.md)
- [Python التعليمية](/ar/guide/tutorials/python.md)
- [JavaScript/TypeScript دراسة التعليمية ](/ar/guide/tutorials/javascript.md)
- [نموذج البيانات](/ar/blockchain/data-model.md)
- [NFTs](/ar/blockchain/nfts.md)
