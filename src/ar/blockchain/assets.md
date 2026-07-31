---
translation_locale: ar
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الأصول {#assets}

(إنجليزية) Iroha الأصول هي رصيد رقمي يحتفظ به الحساب.
نقاط التوازن إلى `AssetDefinition`, والعريف يصف كيف
يمكن تسمية هذا الأصول، والعملة، وعرضها، وتقسيمها.

## تعريف الأصول {#asset-definition}

(إنجليزية) `AssetDefinition` يحتوي على:

- `id`: عنوان تعريف الأصول القنوني
- `name`: اسم عرض يمكن قراءته من قبل الإنسان
- `description`: وصف اختياري يمكن قراءته من قبل الإنسان
- `alias`: الاسماء الخيارية في `<name>#<domain>.<dataspace>` أو
  `<name>#<dataspace>` الشكل
- `spec`: الدقة الرقمية والقيود على الموازين
- `mintable`: سياسة التخفيف
- `logo`: اختياري `SoraFS` URI
- `metadata`: البيانات الأساسية القيمة المفتاحية
- `balance_scope_policy`: ما إذا كانت الرصيدات عالمية أو
  مقيد في مساحة البيانات
- `owned_by`: الحساب الذي سجل أو يملك التعريف
- `total_quantity`: الكمية الإجمالية الصادرة
- `confidential_policy`: سياسة عمليات الأصول المحمية

تعريف الأصول IDs هي عناوين غير واضحة القنونية. عندما تعريف
بنيت من نطاق واسم، Iroha يمكن أن تحتفظ بهذا النطاق/اسم
التنبؤ UX و استفسارات، ولكن النموذج النص القنوني هو
العنوان

## ميزان الأصول {#asset-balance}

(إنجليزية) `Asset` يحتوي على:

- `id`: (أ) `AssetId`, التي تجمع بين تعريف الأصول، حساب الحامل،
  ومدى التوازن الاختياري
- `value`: (أ) `Numeric` التوازن

الحساب القائم على الاحتفاظ به كانونيكي وبدون نطاق.
المشاريع تحت نطاق مؤهل لمجال البيانات، على سبيل المثال
`payments.universal`.

## إمكانية التخزين {#mintability}

تعريفات الأصول تدعم هذه أنماط الوصول:

| الوضع         | المعنى                                                           |
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` | إمدادات مرنة، ويمكن أن يتم تصنيع الأصول وتحرقها مراراً وتكراراً    |
| `Once`       | رمز إمدادات ثابتة، يمكن صياغته مرة واحدة ثم حرقها        |
| `Not`        | علامة إمدادات ثابتة يمكن حرقها ولكن لا يتم صياغتها مرة أخرى.       |
| `Limited(n)` | يُسمح بالتصوير لعدد محدود من العمليات الإضافية. |

الاستخدام `Infinitely` للأصول العادية المطوية و `Once` أو `Limited(n)` لـ
أصول التوريد الثابت أو المحدود. لا تستخدم `Not` في البداية
السياسة ما لم يتم تحديد إمدادات الأصول بالفعل.

## نطاق التوازن {#balance-scope}

(الـ) `balance_scope_policy` يسيطر على كيفية وضع الميزانات:

- `Global`: علبة رصيد واحدة لكل حساب وتعريف الأصول
- `DataspaceRestricted`: يتم تقسيم الرصيدات حسب سياق مساحة البيانات

تُعد الرصيدات المحدودة بمجال البيانات مفيدة عندما يكون نفس تعريف الأصول
تستخدم عبر العديد Nexus يجب أن تبقى الميزانات معزولة.

## جربها Taira {#try-it-on-taira}

هذه المكالمات القراءة فقط تظهر تعريفات الأصول الحقيقية على الجمهور Taira شبكة اختبار:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

العثور على التيار Taira XOR تعريف أصول الرسوم:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

ابحث عن تعريفات تحمل البيانات المعدنية:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

جميع الأمثلة الثلاثة هي القراءة. Taira, استخدام a
الحساب المتمول من النوافذ والدفق المحافظ في
[التواصل SORA Nexus البيانات](/ar/get-started/sora-nexus-dataspaces.md).

مقابل دفع الرسوم Taira نموذج الأصول، إنقاذ مساعدة المياه من
[احصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
كما `taira_faucet_claim.py`, ثم استدعاء أصل الصنبور أولا واستخدامه
أصول الغاز المعاملة:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

ثم تشمل `--metadata ./taira.tx-metadata.json` على `ledger asset mint`,
`ledger asset burn`, و `ledger asset transfer` أوامر.

## التعليمات {#instructions}

يمكن تسجيل الأصول، وقطعها، وحرقها، ونقلها Iroha
تعليمات خاصة:

- [`Register` و `Unregister`](/ar/blockchain/instructions.md#un-register)
- [`Mint` و `Burn`](/ar/blockchain/instructions.md#mint-burn)
- [`Transfer`](/ar/blockchain/instructions.md#transfer)
- [`SetKeyValue` و `RemoveKeyValue`](/ar/blockchain/instructions.md#setkeyvalue-removekeyvalue)

انظر أيضاً:

- [CLI الدليل](/ar/get-started/operate-iroha-via-cli.md)
- [Rust التعليمات](/ar/guide/tutorials/rust.md)
- [Python التعليمات](/ar/guide/tutorials/python.md)
- [JavaScript/TypeScript التعليمات](/ar/guide/tutorials/javascript.md)
- [نموذج البيانات](/ar/blockchain/data-model.md)
- [NFTs](/ar/blockchain/nfts.md)
