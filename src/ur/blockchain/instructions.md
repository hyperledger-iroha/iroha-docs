---
translation_locale: ur
translation_source: /blockchain/instructions.md
translation_source_hash: adc3eff9758dd73e9114e78eaa18ddf6271db3bc4042611e1ed6ed1aac226246
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha خصوصی ہدایات {#iroha-special-instructions}

جب ہم نے [کے بارے میں بات کی کہ Iroha کیسے کام کرتا ہے ](/ur/blockchain/iroha-explained)، ہم نے کہا کہ Iroha خصوصی ہدایات دنیا کی حالت کو تبدیل کرنے کا واحد طریقہ ہیں. تو، ہمارے پاس کس قسم کی خصوصی ہدایات ہیں؟ اگر آپ نے اس ٹیوٹوریل میں زبان کے مخصوص رہنماؤں کو پڑھا ہے، تو آپ نے پہلے ہی کچھ ہدایات دیکھی ہیں: `Register<Account>` اور `Mint<Numeric>`.

یہاں Iroha خصوصی ہدایات کی مکمل فہرست ہے:

|تعلیم |تفصیلات |
| --------------------------------------------------------- | ------------------------------------------------ |
| [رجسٹریشن/غیر رجسٹریشن](#un-register) |بلاکچین پر ایک نئی ادارے کو ID دیں. |
| [مائنٹ/برن](#mint-burn) |مائنٹ / برن عددی اثاثے یا ٹرگر تکرار۔ |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |بلاکچین اعتراض میٹا ڈیٹا کو اپ ڈیٹ کریں. |
| [SetParameter](#setparameter) |ایک سلسلہ وسیع پیرامیٹر مقرر کریں. |
| [Grant/Revoke](#grant-revoke) |اجازت اور کردار دیں یا ہٹا دیں۔ |
| [منتقلی](#transfer) |ملکیت یا اثاثہ کی قیمت منتقل کرنا۔ |
| [مقامی گرو اور اثاثوں کے تالے](#native-escrow-and-asset-locks) |پروٹوکول کی دیکھ بھال میں عددی اثاثوں کو بند کریں. |
| [ExecuteTrigger](#executetrigger) |ٹرگرز کو انجام دیں۔ |
| [لاگ / کسٹم / اپ گریڈ](#other-instructions) |رجسٹر، توسیع، یا رن ٹائم رویے کو اپ گریڈ. |

آئیے Iroha خصوصی ہدایات کا خلاصہ کرتے ہیں۔ ہر ہدایات کے لئے کون سے اشیاء طلب کی جاسکتی ہیں اور ہر اعتراض کے لئے کون سی ہدایات دستیاب ہیں۔

## خلاصہ {#summary}

ہر ہدایت کے لئے ، ان اشیاء کی ایک فہرست موجود ہے جن پر یہ ہدایات چلائی جاسکتی ہیں۔ مثال کے طور پر ، ٹرانسفر ویرینٹس ملکیت والے لیجر آبجیکٹ اور عددی اثاثوں کو ڈھکتے ہیں ، جبکہ مائنٹنگ عددی اثاوں کو ڈھکتا ہے اور تکرار کا سبب بنتا ہے۔

کچھ ہدایات میں منزل کی وضاحت کرنے کی ضرورت ہوتی ہے۔ مثال کے طور پر ، اگر آپ اثاثے منتقل کرتے ہیں تو ، آپ کو ہمیشہ یہ بتانا ہوگا کہ آپ انہیں کس اکاؤنٹ پر منتقل کررہے ہیں۔ دوسری طرف ، جب آپ کسی چیز کو رجسٹر کر رہے ہیں تو ، صرف اس چیز کی ضرورت ہے جسے آپ رجسٹر کرنا چاہتے ہیں۔

|تعلیم |اشیاء |منزل |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |عام ڈومین، ڈیٹا اسپیس کے نام اور اکاؤنٹ کے نام کی ترتیب |                      |
| [رجسٹریشن/غیر رجسٹریشن](#un-register) |اکاؤنٹس، اثاثوں کی تعریفیں، NFTs، کردار، ٹرگرز، ہم مرتبہ؛ ڈومین ہٹانا |                      |
| [مائنٹ/برن](#mint-burn) |عددی اثاثے، ٹرگر تکرار |اکاؤنٹس یا ٹرگر |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |[میٹا ڈیٹا](./metadata.md) رکھنے والے اشیاء: ڈومینز، اکاؤنٹس، اثاثوں کی تعریفیں، NFTs ، RWAs، ٹرگر |                      |
| [SetParameter](#setparameter) |سلسلہ پیرامیٹرز |                      |
| [Grant/Revoke](#grant-revoke) | [کردار، اجازت کے ٹوکن](/ur/blockchain/permissions.md) |اکاؤنٹس یا کردار |
| [منتقلی](#transfer) |ڈومینز، اثاثوں کی تعریفیں، عددی اثاثے، NFTs |اکاؤنٹس |
| [مقامی گرو اور اثاثوں کے تالے](#native-escrow-and-asset-locks) |اعداد و شمار کے اثاثوں کی ضمانتیں ، اثاثوں کو بند کرنا ، گمنام اثاثہ جات کی ذمہ داریاں |خریدار، منزل یا تنازعہ تقسیم |
| [ExecuteTrigger](#executetrigger) |ٹرگرز |                      |
| [لاگ / کسٹم / اپ گریڈ](#other-instructions) |نوشتہ جات، عملدرآمد کے لئے مخصوص مفید بوجھ ، عملدرآمد کو اپ گریڈ کرنا |                      |

ISI کو دیکھنے کا ایک اور طریقہ بھی ہے، جس میں وہ لیجر آبجیکٹ چھوتے ہیں:

|ہدف |ہدایات |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|اکاؤنٹ |رجسٹر / غیر رجسٹر اکاؤنٹس ، وصولی کے اثاثے ، اکاؤنٹ میٹا ڈیٹا کو اپ ڈیٹ کرنا ، اجازت دینے یا منسوخ کرنے کی اجازت اور کردار |
|ڈومین |ڈومین سیٹ اپ کو یقینی بنائیں، ڈومینز کو رجسٹر نہ کریں، ڈومینی مالکان کی منتقلی کریں، ڈیمین میٹا ڈیٹا کو اپ ڈیٹ کریں |
|اثاثہ جات کی تعریف |رجسٹر/غیر رجسٹر کی تعریفیں، منتقلی کا حق ملکیت، میٹا ڈیٹا اپ ڈیٹ |
|اثاثہ |مائنٹ / برن عددی مقدار، منتقلی عددی مقدار |
|کریڈٹ |کھولیں، قبول کریں، بھیجنے والے ادائیگی کو نشان زد کریں، جاری کریں، منسوخ کریں، تنازعہ کریں، حل کریں، نکالیں، یا مقامی حراست کے ریکارڈ ختم کریں۔|
|NFT |رجسٹر/غیر رجسٹر NFTs، منتقلی کی ملکیت، تازہ ترین میٹا ڈیٹا |
|RWA |کھیپوں کی رجسٹریشن، منتقلی کی مقدار، برقرار رکھنے/فریجنگ، منجمد/غیر منجمد، واپسی، ضم، میٹا ڈیٹا کو اپ ڈیٹ اور کنٹرولز |
|ٹرگر |رجسٹر/ڈیرجسٹریشن، مینٹ/برن ٹرگر تکرار، ایگزیکٹ ٹرگر، تازہ کاری ٹرگر میٹا ڈیٹا |
|دنیا |register/unregister peers and roles، مقرر پیرامیٹرز، عملدرآمد کو اپ گریڈ کریں |

## CLI مثالیں {#cli-examples}

اس صفحے میں مثالیں فرض کرتے ہیں کہ آپ مقامی کلائنٹ کی ڈیفالٹ ترتیب کے خلاف اپ اسٹریم Iroha ورک اسپیس سے کمانڈ چل رہے ہیں:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

اگر آپ نے `iroha` بائنری انسٹال کی ہے تو ، اس کے بجائے `iroha --config ./defaults/client.toml` کا استعمال کریں۔ اپنے نیٹ ورک سے اقدار کے ساتھ نیچے دیئے گئے پلیس ہولڈرز کو تبدیل کریں:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

جب عوام کو نشانہ بنایا جائے Taira ٹیسٹ نیٹ، استعمال کریں ایک Taira کلائنٹ کی ترتیب. فیس ادا کرنے والے مثالوں کو چلانے سے پہلے ، نل کے مددگار کو [ٹیسٹ نیٹ حاصل کریں XOR پر Taira](/ur/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) کے طور `taira_faucet_claim.py`, پھر دعویٰ ٹیسٹ نیٹ XOR نل سے:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

نل سے فنڈ شدہ اثاثہ نظر آنے کے بعد ، لین دین کو لکھنے کے لئے ضروری گیس اثاثے میٹا ڈیٹا منسلک کریں:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` ڈومینز اور ان کے SNS لیزنگ کی تخلیق کے لئے عام پہلی ریلیز کا راستہ ہے۔ یہ اعلاناتی طور پر عین مطابق ڈیٹا اسپیس ، مالک ، لیزنگ ٹرم ، اور کوٹ گارڈ کو پابند کرتا ہے ، پھر تمام مطلوبہ ریاست کو ایٹمی طور پر تشکیل دیتا ہے یا مرمت کرتا ہے۔ تصدیق شدہ `POST /v1/aliases/setup/plan` اختتامی نقطہ یا مماثل CLI ورک فلو کا استعمال کریں:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

ارادے اور منصوبہ راز سے پاک ہیں ، لیکن قدم کے نشانات لاگو کریں اور ترتیب شدہ اکاؤنٹ کے ساتھ ایک عام لین دین جمع کروائیں۔ ایک منصوبہ اس کے سلسلہ ، اتھارٹی ، زندہ ریاست لنگر ، اور آخری تاریخ پر پابند ہے۔ کسی دوسرے نیٹ ورک پر دوبارہ استعمال نہ کریں۔

## (Un) رجسٹریشن {#un-register}

رجسٹریشن اور غیر رجسٹریشن ان ہدایات ہیں جو بلاکچین پر ایک نئی ادارے کو ID دینے کے لئے استعمال کی جاتی ہیں۔

سب کچھ جو رجسٹرڈ کیا جا سکتا ہے وہ `Registrable` اور `Identifiable` دونوں ہیں، لیکن ہر چیز جو `Identifiable` ہے وہ `Registrable` نہیں ہے۔ زیادہ تر چیزوں کو براہ راست رجسٹر کیا جاتا ہے، لیکن بعض معاملات میں بلاکچین میں نمائندگی کافی زیادہ ڈیٹا رکھتا ہے. سیکیورٹی اور کارکردگی کی وجوہات کی بناء پر ، ہم اس طرح کے ڈیٹا ڈھانچے (مثال کے طور پر `NewAccount`) کے لئے بلڈرز کا استعمال کرتے ہیں ، اور ہم مرتبہ رجسٹریشن میں ملکیت کا ثبوت دینے کے لئے ایک مخصوص ہدایات موجود ہیں۔ عام طور پر ، جو بھی رجسٹر کیا جاسکتا ہے وہ غیر رجسٹرڈ بھی ہوسکتا ہے ، لیکن یہ کوئی سخت اور تیز قاعدہ نہیں ہے۔

آپ اکاؤنٹس ، اثاثوں کی تعریفیں ، NFTs ، ہم مرتبہ ، کردار اور ٹرگرز کو رجسٹر کرسکتے ہیں۔ ڈومین سیٹ اپ `EnsureAlias` کا استعمال کرتا ہے۔ خام `Register::Domain` پے لوڈ جینس / بوٹ اسٹریپ کے لئے محفوظ ہے۔ ہم مرتبہ رجسٹریشن `RegisterPeerWithPop` کا استعمال کرتی ہے ، جس میں ہم مرتبہ کلید کے مالک ہونے کا ثبوت ہوتا ہے۔ اداروں کے ناموں پر عائد پابندیوں کے بارے میں جاننے کے لئے ہمارے [ نامی کنونشنز](/ur/reference/naming.md) چیک کریں.

RWA کے ٹکڑے مخصوص `RegisterRwa` ہدایات کے ذریعے بنائے جاتے ہیں۔ موجودہ کوڈ میں ایک `UnregisterRwa` ہدایات کی نشاندہی نہیں کی جاتی ہے۔ نمائندگی شدہ مقدار کو ریٹائر کرنے کے لئے `RedeemRwa` کا استعمال کریں۔

::: info

نوٹ کریں کہ آپ [جینیس بلاک](/ur/guide/configure/genesis.md) کو `genesis.json` میں کیسے ترتیب دینے کا فیصلہ کرتے ہیں اس پر منحصر ہے (خاص طور پر ، چاہے آپ اجازت ٹوکن کی رجسٹریشن شامل کریں یا نہیں) ، اکاؤنٹ کی رجسٹری کے لئے عمل بہت مختلف ہوسکتا ہے۔ عام طور پر ، ہم اسے اس طرح خلاصہ کرسکتے ہیں:

- عوامی بلاکچین میں، کسی کو بھی ایک اکاؤنٹ رجسٹر کرنے کے قابل ہونا چاہئے.
- ایک نجی بلاکچین میں، اکاؤنٹس کو رجسٹر کرنے کے لئے ایک منفرد عمل ہوسکتا ہے. عام نجی بلاک چین میں، یعنی اکاؤنٹس کی رجسٹریشن کے لئے کسی بھی منفرد عمل کے بغیر، آپ کو ایک اکاؤنٹ کی ضرورت ہوتی ہے تاکہ دوسرا اکاؤنٹ درج کیا جاسکے.

ہم ان اختلافات پر بہت تفصیل سے تبادلہ خیال کرتے ہیں جب ہم [ نجی اور سرکاری بلاکچینوں کا موازنہ کرتے ہیں ](/ur/guide/configure/modes.md).

:::

::: info

ایک ہم مرتبہ کو رجسٹر کرنا فی الحال نیٹ ورک میں ہم مرتبہ شامل کرنے کا واحد طریقہ ہے جو اصل قابل اعتماد ہم مرتبہ کے حصے کا حصہ نہیں تھا۔

:::

بلاکچین اشیاء کو رجسٹر کرنے کے لئے زبان کی مخصوص ہدایت نامہ استعمال کریں:

|زبان |گائیڈ|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |[Iroha CLI](/ur/get-started/operate-iroha-via-cli.md) ڈومینز قائم کرنے اور اکاؤنٹس اور اثاثوں کو رجسٹر کرنے کے لئے استعمال کریں۔ |
|Rust |[Rust ٹیوٹوریل استعمال کریں ](/ur/guide/tutorials/rust.md). |
|Kotlin/جاوا |[Kotlin / جاوا ٹیوٹوریل](/ur/guide/tutorials/kotlin-java.md) کا استعمال کریں۔ |
|Python |[Python ٹیوٹوریل استعمال کریں ](/ur/guide/tutorials/python.md). |
|JavaScript/TypeScript |[JavaScript/TypeScript ٹیوٹوریل کا استعمال کریں ](/ur/guide/tutorials/javascript.md). |

عام ڈومین سیٹ اپ کی منصوبہ بندی اور اطلاق کریں، پھر جب اس کی ضرورت نہ ہو تو ڈومین کو رجسٹر نہ کریں:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

رجسٹرڈ اور غیر رجسٹر شدہ اکاؤنٹس:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

رجسٹر اور غیر رجسٹرڈ اثاثہ کی تعریفیں:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

رجسٹر اور غیر رجسٹر NFTs۔ NFT رجسٹریشن اس کا مواد JSON معیاری ان پٹ سے پڑھتا ہے:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

رجسٹرڈ اور غیر رجسٹر شدہ کردار:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

رجسٹر اور غیر رجسٹر ٹرگرز. IVM بائٹکوڈ یا ترتیب شدہ ہدایات کی فہرست۔ یہ مثال ایک `Log` ہدایت کے ساتھ CLI اور اسے ٹرگر رجسٹریشن میں پائپ کرتا ہے:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

رجسٹر اور غیر رجسٹر ہم مرتبہ. اگر آپ کے پاس پہلے سے ہی نہیں ہیں تو BLS کلید اور PoP کے ساتھ `kagami` پیدا کریں:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## مائنٹ/برن {#mint-burn}

مائننگ اور جلانے سے عددی اثاثوں کا حوالہ دیا جاسکتا ہے اور محدود تعداد میں تکرار کے ساتھ ٹرگرز۔ کچھ اثاثے غیر منقولہ قرار دے سکتے ہیں ، جس کا مطلب یہ ہے کہ وہ رجسٹریشن کے بعد صرف ایک بار مائنڈ ہوسکتے ہیں۔

اثاثوں کو ایک مخصوص اکاؤنٹ پر منٹایا جاتا ہے ، عام طور پر وہ جو پہلے ہی اثاثہ رجسٹر کرتا ہے۔ اثاثے کی مقدار منفی نہیں ہوتی ہے ، لہذا آپ کبھی بھی `$-1.0` اثاثہ نہیں لے سکتے ہیں یا منفی رقم جلا سکتے ہیں اور منٹ حاصل کرسکتے ہیں۔

منٹ بلاکچین اثاثوں کے لئے زبان کی مخصوص رہنمائی کا استعمال کریں:

- [CLI](/ur/get-started/operate-iroha-via-cli.md)
- [Rust](/ur/guide/tutorials/rust.md)
- [Kotlin/Java](/ur/guide/tutorials/kotlin-java.md)
- [Python](/ur/guide/tutorials/python.md)
- [JavaScript/TypeScript](/ur/guide/tutorials/javascript.md)

جلانے والے اثاثوں کی مثالیں یہ ہیں:

- [CLI](/ur/get-started/operate-iroha-via-cli.md)
- [Rust](/ur/guide/tutorials/rust.md)

مائنٹ اور برن عددی اثاثے:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

مینٹ اور جلنے کے ٹرگر کی تکرار:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## منتقلی {#transfer}

ٹرانسفر اکاؤنٹس کے مابین ملکیت یا قدر کو منتقل کرتے ہیں۔ عام منتقلی کی مختلف حالتوں میں ڈومینز ، اثاثوں کی تعریفیں ، عددی اثاثے اور NFTs شامل ہوتے ہیں۔ RWA مقدار کی نقل و حرکت `TransferRwa` اور `ForceTransferRwa` میں بیان کردہ مخصوص ہدایات کا استعمال کرتی ہے۔ [ ریئل ورلڈ اثاثہ ](/ur/blockchain/rwas.md).

ایسا کرنے کے لئے، ایک اکاؤنٹ کو اثاثوں کی منتقلی کے لئے [ اجازت دینا ضروری ہے ](/ur/reference/permissions.md). [CLI](/ur/get-started/operate-iroha-via-cli.md) یا [Rust](/ur/guide/tutorials/rust.md) کے ساتھ اثاثے منتقل کرنے کا طریقہ پر ایک مثال دیکھئے.

عددی اثاثوں کی منتقلی:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

منتقلی کا ڈومین، اثاثہ کی تعریف اور NFT ملکیت:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## مقامی کریڈٹ اور اثاثوں کے تالے {#native-escrow-and-asset-locks}

مقامی ایسکرو ہدایات لیجر کے زیر انتظام پروٹوکول کی دیکھ بھال میں عددی اثاثوں کو مقفل کرتی ہیں۔ وہ مارکیٹ اسٹائل تصفیہ ، عام اثاثوں کے مقفل اور گمنام شیلڈڈ ایسکرو بہاؤ کے لئے استعمال ہوتے ہیں۔

مارکیٹ پلیس ایسرو کا استعمال `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, اور `ResolveEscrowDispute`. عام اثاثہ بندش کا استعمال `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, اور `ExpireAssetLock`. Anonymous escrow مارکیٹ لائف سائیکل کی عکاسی کرتا ہے `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, اور `ResolveAnonymousEscrowDispute`.

ان ISIs میں فی الحال فرسٹ کلاس CLI کمانڈز نہیں ہیں۔ ٹائپ شدہ SDK بلڈرز یا سیریل انسٹرکشن پے لوڈز کا استعمال کریں ، اور زندگی کے سائیکل کی تفصیلات ، اجازتیں ، سوالات ، واقعات ، اور Rust مثالوں کے لئے [Native Asset Escrow](/ur/blockchain/escrow.md) کو دیکھیں.

## گرانٹ / منسوخی {#grant-revoke}

اکاؤنٹ [ اجازت نامے اور کردار کے لئے گرانٹ اور منسوخی کی ہدایات استعمال کی جاتی ہیں ](permissions.md).

`Grant` کا استعمال کسی صارف کو مستقل طور پر یا تو ایک واحد اجازت دینے کے لئے کیا جاتا ہے ، یا اجازتوں کا ایک گروپ (ایک "رول")۔ دیئے گئے کردار اور اجازتیں صرف `Revoke` ہدایات کے ذریعہ ہٹائی جاسکتی ہیں۔ اس طرح ، ان ہدایات کو احتیاط سے استعمال کرنا چاہئے۔

ایک اکاؤنٹ پر کردار دینے اور واپس لینے:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

اجازت دینے اور منسوخ کرنے کے ٹوکن. اجازت کمانڈ معیاری ان پٹ سے ایک اجازت آبجیکٹ پڑھتے ہیں:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

کسی کردار کی اجازت دیں اور منسوخ کریں:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

یہ ہدایات آبجیکٹ [میٹا ڈیٹا](/ur/blockchain/metadata.md) کو اپ ڈیٹ کرتی ہیں۔ ایک میٹا ڈیٹا اندراج داخل کرنے یا تبدیل کرنے کے لئے `SetKeyValue` کا استعمال کریں اور ایک حذف کرنے کے لیے `RemoveKeyValue`۔

میٹا ڈیٹا `set` کمانڈ معیاری ان پٹ سے JSON قدر پڑھتے ہیں:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

اکاؤنٹس، اثاثوں کی تعریفیں، NFTs، RWAs کے لئے ایک ہی پیٹرن دستیاب ہے، اور ٹرگرز:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` فعال ڈیٹا ماڈل اور عملدرآمد کنندہ کی طرف سے سامنے آنے والے پورے سلسلے کے پیرامیٹرز کو تبدیل کرتا ہے.

معیاری ان پٹ پر ایک واحد پیرامیٹر JSON آبجیکٹ کو منتقل کرکے ایک پیرامیٹر مقرر کریں:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

یہ ہدایات [ ٹرگرز](./triggers.md) کو انجام دینے کے لئے استعمال کی جاتی ہیں۔

CLI ٹرگرز کو رجسٹر کر سکتا ہے اور براہ راست ٹرگر عملدرآمد کے واقعات پر سبسکرائب کرسکتا ہے۔ اس میں ٹائپ کردہ `execute trigger` کمانڈ فراہم نہیں کیا جاتا ہے ، لہذا ایک دستی `ExecuteTrigger` ہدایات پیش کرنے کے لئے ، ایک SDK یا ایک ایگزیکٹر ٹول کے ساتھ ایک serialized `InstructionBox` پیدا کریں اور `ledger transaction stdin` کی طرف سے نتیجہ خیز JSON صف منتقل:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## دیگر ہدایات {#other-instructions}

Iroha رن ٹائم اور ایگزیکٹر انٹیگریشن کے لئے بھی نچلے سطح کی ہدایات کو ظاہر کرتا ہے:

- `Log`: عملدرآمد کے دوران ایک نوشتہ درج کریں
- `CustomInstruction`: کارروائی کرنے والے کے لئے مخصوص JSON مفید بوجھ لے جانا
- `Upgrade`: ایک ایگزیکٹر اپ گریڈ کو چالو کریں

پنگ ہیلپر کے ساتھ ایک `Log` ہدایات جمع کروائیں:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

ایک کسٹم ایگزیکٹر ہدایات کو سیریل `InstructionBox` کے طور پر جمع کروائیں۔ پے لوڈ کی شکل ایگزیکیٹر مخصوص ہے ، لہذا مشابہت والے SDK یا ایگزیکٹر ٹولنگ کے ساتھ ہدایت پیدا کریں:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

ایک مرتب شدہ IVM بائٹ کوڈ فائل سے عملدرآمد کنندہ کو اپ گریڈ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
