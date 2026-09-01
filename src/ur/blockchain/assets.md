---
translation_locale: ur
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# اثاثہ جات {#assets}

Iroha اثاثہ ایک اکاؤنٹ کے زیر انتظام عددی بیلنس ہے۔ ہر ٹھوس بیلنس `AssetDefinition` کی طرف اشارہ کرتا ہے ، اور تعریف بیان کرتی ہے کہ اس اثاثے کا نام کس طرح رکھا جاسکتا ہے ، پیسایا جاسکتا ہے، ظاہر کیا جاسکتا ہے اور تقسیم کیا جا سکتا ہے۔

## اثاثہ کی تعریف {#asset-definition}

ایک `AssetDefinition` میں شامل ہیں:

- `id`: کینیکل اثاثہ کی تعریف کا پتہ
- `name`: انسان کے پڑھنے کے قابل ڈسپلے کا نام
- `description`: اختیاری طور پر انسانی پڑھنے کے قابل تفصیل
- `alias`: `<name>#<domain>.<dataspace>` یا `<name>#<dataspace>` فارم میں اختیاری عرفی نام
- `spec`: رقم کی درستگی اور بیلنس کے لئے پابندیاں
- `mintable`: منتاگیت کی پالیسی
- `logo`: اختیاری `SoraFS` URI
- `metadata`: تعمیری کلیدی قدر میٹا ڈیٹا۔
- `balance_scope_policy`: کیا بیلنس عالمی یا ڈیٹا اسپیس محدود ہیں؟
- `owned_by`: وہ اکاؤنٹ جس نے اس تعریف کو رجسٹر کیا یا اس کا مالک ہے۔
- `total_quantity`: جاری کردہ کل مقدار
- `confidential_policy`: حفاظتی اثاثوں کے آپریشنز کی پالیسی

اثاثہ کی تعریف IDs کینیکل غیر شفاف پتوں ہیں۔ جب کسی ڈومین اور نام سے ایک تعریف بنائی جاتی ہے تو ، Iroha اس ڈومین / نام پروجیکشن کو UX اور استفسارات کے ل keep رکھ سکتا ہے ، لیکن کینیکل ٹیکسٹ فارم پیدا کردہ پتہ ہے۔

## اثاثہ جات کا بیلنس {#asset-balance}

ایک `Asset` میں شامل ہیں:

- `id`: ایک `AssetId`، جس میں اثاثہ کی تعریف، ہولڈر اکاؤنٹ اور اختیاری بیلنس کے دائرہ کار کو یکجا کیا جاتا ہے۔
- `value`: ایک `Numeric` بیلنس

ہولڈر اکاؤنٹ کینونیکل اور ڈومینلیس ہے۔ اثاثہ کی تعریف کو ڈیٹا اسپیس کے اہل ڈومین کے تحت پیش کیا جاسکتا ہے ، مثال کے طور پر `payments.universal`۔

## مائنٹیبلٹی {#mintability}

اثاثوں کی تعریفیں ان منتاbility طریقوں کی حمایت کرتے ہیں:

|موڈ|معنی |
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |لچکدار سپلائی۔ اثاثہ بار بار جھاڑنا اور جلا دیا جا سکتا ہے۔ |
|`Once` |فکسڈ سپلائی ٹوکن۔ اسے ایک بار مائنٹ کیا جاسکتا ہے اور پھر جلا دیا جاسکتا ہے۔ |
|`Not` |فکسڈ سپلائی ٹوکن جو جلایا جا سکتا ہے لیکن دوبارہ minted نہیں کر سکتے. |
|`Limited(n)` |اس پالیسی کے تحت محدود تعداد میں اضافی آپریشنز میں نئے اثاثوں کی اکائیوں کو جاری کیا جا سکتا ہے۔ |

عام لچکدار اثاثوں کے لیے `Infinitely` اور فکسڈ سپلائی یا محدود سپلائی والے اثاثوں کیلئے `Once` یا `Limited(n)` کا استعمال کریں۔ جب تک کہ اثاثہ کی فراہمی پہلے ہی قائم نہ ہو، `Not` کو ابتدائی پالیسی کے طور پر استعمال نہ کریں۔

## بیلنس کا دائرہ کار {#balance-scope}

`balance_scope_policy` کنٹرول کرتا ہے کہ کس طرح بیلنسوں کو بلٹ کیا جاتا ہے:

- `Global`: ہر اکاؤنٹ اور اثاثہ کی تعریف کے مطابق ایک بیلنس بالٹ
- `DataspaceRestricted`: ڈیٹا اسپیس کے سیاق و سباق کے لحاظ سے بیلنس تقسیم کیے گئے ہیں۔

ڈیٹا اسپیس محدود بیلنس مفید ہیں جب ایک ہی اثاثہ کی تعریف متعدد Nexus ڈیٹا اسپیس پر استعمال کی جاتی ہے لیکن بیلنس الگ تھلگ رہنا ضروری ہے۔

## Taira پر آزمائیں {#try-it-on-taira}

یہ صرف پڑھنے کے لئے کالز عوامی Taira ٹیسٹ نیٹ پر حقیقی اثاثوں کی تعریفیں دکھاتے ہیں:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

موجودہ Taira XOR فیس اثاثہ کی تعریف تلاش کریں:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

ایسی تعریفیں تلاش کریں جن میں میٹا ڈیٹا شامل ہو:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

تینوں مثالیں پڑھنے کے قابل ہیں۔ Taira پر اثاثے بنانے ، جلانے یا منتقل کرنے کے لئے ، فوسیٹ سے فنڈ شدہ اکاؤنٹ اور [ میں محفوظ فلو کا استعمال کریں SORA Nexus ڈیٹا بیس](/ur/get-started/sora-nexus-dataspaces.md) سے رابطہ کریں.

فیس ادا کرنے کے لئے Taira اثاثہ مثال کے طور پر، فوسیٹ کی مدد سے بچانے [ٹیسٹ نیٹ حاصل کریں XOR پر Taira](/ur/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) کے طور `taira_faucet_claim.py`, پھر سب سے پہلے فوسیٹ اثاثہ کا دعوی کریں اور اسے لین دین گیس اثاثہ کے طور پر استعمال کریں:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

اس کے بعد `ledger asset mint`، `ledger asset burn` اور `ledger asset transfer` کمانڈ پر `--metadata ./taira.tx-metadata.json` شامل کریں.

## ہدایات {#instructions}

اثاثوں کو Iroha خصوصی ہدایات کے ساتھ رجسٹر کیا جا سکتا ہے، مائنڈ، جلایا اور منتقل کیا جاسکتا ہے:

- [`Register` اور `Unregister`](/ur/blockchain/instructions.md#un-register)
- [`Mint` اور `Burn`](/ur/blockchain/instructions.md#mint-burn)
- [`Transfer`](/ur/blockchain/instructions.md#transfer)
- [`SetKeyValue` اور `RemoveKeyValue`](/ur/blockchain/instructions.md#setkeyvalue-removekeyvalue)

یہ بھی ملاحظہ کریں:

- [CLI گائیڈ](/ur/get-started/operate-iroha-via-cli.md)
- [Rust ٹیوٹوریل](/ur/guide/tutorials/rust.md)
- [Python ٹیوٹوریل](/ur/guide/tutorials/python.md)
- [JavaScript/TypeScript ٹیوٹوریل ](/ur/guide/tutorials/javascript.md)
- [ڈیٹا ماڈل](/ur/blockchain/data-model.md)
- [NFTs](/ur/blockchain/nfts.md)
