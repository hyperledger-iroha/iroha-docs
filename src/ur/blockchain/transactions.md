---
translation_locale: ur
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# لین دین {#transactions}

ٹرانزیکشن بلاکچین پر کام انجام دینے کے لئے ایک دستخط شدہ درخواست ہے۔ قابل عمل پے لوڈ [ ہدایات ](./instructions.md) ، ایک معاہدہ کال ، IVM بائٹ کوڈ ، یا ایک ثابت ہوا IVM عملدرآمد کا حکم ہوسکتا ہے. موجودہ معاہدے کے نفاذ کے ماڈل کے لئے [ذہین معاہدوں](./smart-contracts.md) دیکھیں.

ٹرانزیکشنز ریاست کو تبدیل کرنے یا قابل عمل کام انجام دیتے ہیں۔ صرف پڑھنے کی جانچ پڑتال دستخط شدہ استفسارات یا عوامی پڑھنے کے اختتام پوائنٹس کا استعمال کرتی ہے اور کوئی ٹرانزیکشن نہیں بناتی۔

ایک پابند بلاک میں داخل ہونے والی ٹرانزیکشن کو اس کے عملدرآمد کے نتیجے کے ساتھ ذخیرہ کیا جاتا ہے، جس میں عملدرآمد سے انکار بھی شامل ہے۔ بلاک ایڈمنسٹریشن سے پہلے مسترد کی جانے والی درخواستیں، جیسے کہ غلط لفافہ یا قطار سے مسترد شدہ لین دین، کسی بلاک میں محفوظ نہیں کیے جاتے ہیں۔

پرائیویسی کو برقرار رکھنے والے اثاثوں کی نقل و حرکت کے لئے ، [گمنام لین دین](./anonymous-transactions.md) دیکھیں۔ گمنام ٹرانزیکشنز عوامی اکاؤنٹ سے اکاؤنٹ بیلنس میں تبدیلیوں کے بجائے شیلڈ اثاثہ نوٹ ، مصروفیات ، باطل کرنے والے اور صفر علم کے ثبوت استعمال کریں۔

منتخب شفاف عمل درآمد کے اثرات پر ثبوت ثبوت کے لئے، [FastPQ](./fastpq.md) دیکھیں. FastPQ معمول ٹرانزیکشن عملدرآمد کے بعد عملدرآمد گواہوں کو استعمال کرتا ہے اور معاون ریاستی منتقلی کے لئے تعیناتی ثبوت بیچوں کی تعمیر کرتا ہے.

## Taira پر آزمائیں {#try-it-on-taira}

سائننگ اکاؤنٹ کے بغیر حالیہ عوامی Taira بلاکس اور لین دین کی حیثیت کا معائنہ کرنے کے لئے تلاش کرنے والے راستوں کا استعمال کریں:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

کسی ٹرانزیکشن کی پیروی کرنے کے لئے جو آپ کی ایپ نے پہلے جمع کروائی ہے، اس فہرست سے `hash` کاپی کریں اور ایکسپلورر تفصیلات روٹ چیک کریں:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

یہ ابھی تک صرف پڑھنے کے لئے ہے۔ ٹرانزیکشن جمع کروانے کے لئے ایک دستخط شدہ Norito لفافہ ، صحیح سلسلہ ID ، فیس میٹا ڈیٹا اور فوسیٹ سے فنڈ شدہ Taira اکاؤنٹ کی ضرورت ہوتی ہے۔

فیس ادا کرنے والے مثالوں کے لئے Taira, سے فوسیٹ کے مددگار کو بچانے [ٹیسٹ نیٹ حاصل کریں XOR پر Taira](/ur/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) کے طور `taira_faucet_claim.py`, پھر دستخط کنندہ کو سب سے پہلے عوامی فوسیٹ کے ذریعے فنڈ دیں:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

اگر فوسیٹ پازل یا دعوے کا راستہ `502` واپس آتا ہے تو، ٹرانزیکشن خود کو ڈیبگ کرنے سے پہلے انتظار کریں اور دوبارہ کوشش کریں.

اس کے بعد ٹرانزیکشن جمع کروانے پر Taira فیس اثاثہ میٹا ڈیٹا شامل کریں:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## آف لائن ٹرانزیکشنز {#offline-transactions}

Iroha کے پاس دو آف لائن لین دین ورک فلوز ہیں:

- آف لائن دستخط ایک عام دستخط شدہ ٹرانزیکشن بناتا ہے جبکہ دستخط کرنے والا آلہ منقطع ہے۔ جب تک کہ آن لائن کلائنٹ Torii کو دستخط شدہ لفافہ پیش نہیں کرتا ، اس وقت تک یہ عمل پر عملدرآمد نہیں ہوتا ہے ، لہذا اسے ابھی بھی صحیح سلسلہ ID ، اتھارٹی ، اجازت نامے ، فیسوں اور لین دین کی زندگی کی ضرورت ہے۔
- کاگیموشا آف لائن نقد رقم آن لائن ہونے کے دوران ایک بٹوے کو ٹاپ کرتی ہے ، جب دونوں بٹوے آف لائن ہوں تو وصول کنندہ کی طرف سے شروع کردہ بٹوے سے بٹوے کی ترسیل کی حمایت کرتا ہے ، اور جب وصول کنندہ آن لائن واپس آجاتا ہے تو اس نتیجے میں نوٹ کی حالت کو تبدیل کر دیتا ہے۔

Torii `/v1/offline/*` کے تحت مکمل Kagemusha زندگی کا دورہ ظاہر کرتا ہے:

|طریقہ کار اور اختتامی نقطہ |مقصد |
| --- | --- |
|`GET /v1/offline/readiness` |ایک `asset_definition_id` کے لئے Kagemusha کی تیاری کا اندازہ کریں |
|`POST /v1/offline/receiver-lineage` |دستخط شدہ وصول کنندہ کی درخواست کے لئے ثبوت پر مبنی فعال رجسٹریشن نسب کو حل کریں |
|`POST /v1/offline/top-up` |ایک دستخط شدہ آن لائن سے آف لائن بھرتی آپریشن جمع کرو |
|`POST /v1/offline/redeem` |ایک دستخط شدہ آف لائن ریڈم آپریشن جمع کرو |
|`GET /v1/offline/operations/{operation_id}` |ایک اضافی یا ریفریجریشن کی کینیکل حیثیت پڑھیں |

آف لائن آپریشن بنانے سے پہلے اثاثہ کی تیاری چیک کریں:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

تیاری کی حالت wallet کو active bridge ABI 21 اور authenticated V4 artifact set سے باندھتی ہے۔ Lineage، top-up اور redemption requests، typed `application/x-norito` archives استعمال کرتی ہیں۔ Top-up اور redemption، operation resource کی طرف اشارہ کرنے والے `Location` header کے ساتھ `202 Accepted` لوٹاتے ہیں؛ embedded nonzero operation ID، idempotency key فراہم کرتا ہے۔

عام بہاؤ یہ ہے:

1. اگر `ready` غلط ہے یا کوئی بلاکٹر لاگو ہوتا ہے تو تیاری کی جانچ کریں اور روک دیں۔
2. Swift یا JVM ٹائپ کردہ بٹوے کا استعمال کینیکل ٹاپ اپ آرکائیو بنانے، اسے جمع کروانے اور ان پٹ نوٹ کی حالت اور آپریشن ID دونوں کو برقرار رکھنے کے لئے جب تک کہ آپریشن حتمی سلسلہ کی حالت تک نہ پہنچ جائے۔
3. جب ضرورت ہو تو وصول کنندہ رجسٹریشن نسب کو حل کریں، مقامی طور پر ہر نیٹ ورک نوڈ کی منتقلی کی تعمیر اور تصدیق کریں، اور منتقلی کو تسلیم کرنے سے پہلے خفیہ شدہ نوٹ کی حالت برقرار رکھیں.
4. جب وصول کنندہ آن لائن ہو، تو کینیکل ریڈیمنٹ آرکائیو بنائیں، اسے جمع کروائیں، اور اس کے آپریٹنگ وسائل کو حتمی طور پر سروے کریں.

لیجر اس وقت تک متضاد آف لائن منتقلی نہیں دیکھ سکتا جب تک نوٹ کی حالت آن لائن لائف سائیکل کے ذریعے واپس نہ آئے۔ اس لیے بٹوے اور آپریٹر پالیسی کو قدر کی حدود، میعاد، منظور شدہ جاری کنندگان، پائیدار مقامی اسٹوریج اور ری پلے ونڈوز نافذ کرنا چاہئیں۔

یہاں `Grant` ہدایات کے ساتھ ایک نیا لین دین بنانے کی ایک مثال ہے۔ اس لین دین میں ، Mouse، Alice کو مخصوص کردار (`role_id`) دے رہا ہے۔ مکمل مثال [ چیک کریں ](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
