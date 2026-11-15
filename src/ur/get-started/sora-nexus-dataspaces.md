---
translation_locale: ur
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 96ca67b9bbf9d743de2f640e09487176f62a8a31052e4f1e15e15a771e985c48
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Taira اور Minamoto کے ساتھ SORA Nexus پر ایپلیکیشن تیار کرنا {#build-on-sora-3-taira-and-minamoto}

SORA Nexus کی بنیاد Iroha 3 ہے۔ اپنی ایپلیکیشن پہلے Taira پر تیار کریں اور آزمائیں۔ یہی کلائنٹ ترتیب Minamoto پر تبھی منتقل کریں جب آپ کے پاس مین نیٹ کے لیے الگ کلیدیں، فیس کے لیے حقیقی XOR اور عملی استعمال کی منظوری ہو۔

یہ رہنما SORA Nexus کے دونوں عوامی نیٹ ورکس کے لیے Iroha کلائنٹ کی ترتیب کا طریقہ بتاتا ہے۔

- Taira ٹیسٹ نیٹ at `https://taira.sora.org`
- Minamoto مین نیٹ پر `https://minamoto.sora.org`

استعمال Taira انٹیگریشن ٹیسٹ، فوسیٹ سے فنڈ شدہ لکھنے کے کینری اور تعیناتی کی rehearsals کے لئے. استعمال Minamoto صرف پیداوار کے لئے تیار مین نیٹ ورک کی سرگرمیوں کے لیے۔ دونوں نیٹ ورکس میں XOR:

- Taira عوامی فوسیٹ سے ٹیسٹ نیٹ ورک XOR استعمال کرتا ہے۔
- Minamoto حقیقی XOR کا استعمال کرتا ہے۔ کوئی Minamoto فوسیٹ نہیں ہے۔

## تعمیر کار کا راستہ {#builder-path}

|مرحلہ |Taira ٹیسٹ نیٹ |Minamoto مین نیٹ |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|نیٹ ورک کی حالت پڑھنا شروع کریں |کلیدوں کے بغیر `/status` کا استفسار کریں | پہلے سروس کے پتے اور اس کے TLS سرٹیفکیٹ کی تصدیق کریں |
| ڈیٹا اسپیس منتخب کریں | عوامی `universal` استعمال کریں، جب تک آپ کی ایپ کو اپنی زیرِ حکمرانی ڈیٹا اسپیس کی ضرورت نہ ہو | یہی ڈیٹا اسپیس صرف مین نیٹ کی منظوری کے بعد استعمال کریں |
|فیس کا اثاثہ حاصل کریں |عوامی Taira faucet استعمال کریں |فنڈ شدہ Minamoto اکاؤنٹ یا منظور شدہ خزانے کے بہاؤ سے XOR حاصل کریں |
|تحریری کارروائیوں کی جانچ کریں |فوسیٹ سے حاصل کردہ ٹیسٹ XOR استعمال کریں |ٹیسٹ ٹولنگ استعمال نہ کریں؛ تحریری کارروائیوں میں حقیقی XOR خرچ ہوتا ہے |
|پروڈکشن میں منتقل کریں |دوبارہ کوشش کی منطق، نگرانی اور دستخط کنندہ کے انتظام کی مشق کریں |الگ کلیدیں، فنڈنگ اور ریلیز کنٹرول استعمال کریں |

عملی بہاؤ یہ ہے:

1. کلائنٹ Taira کے لیے بنائیں اور عوامی `universal` ڈیٹا اسپیس استعمال کریں۔
2. ایک دستخط شامل کریں اور اسے Taira فوسیٹ کے ساتھ فنڈ دیں۔
3. Taira کے خلاف آپ کی ایپ منطق کا استعمال کریں جب تک کہ ناکامی بورنگ اور مشاہدہ نہیں ہوتی۔
4. ایک علیحدہ Minamoto دستخط کنندہ بنائیں، اسے اصلی XOR کے ساتھ فنڈ کریں، اور صرف وہی ثابت شدہ آپریشنز کو مین نیٹ پر منتقل کریں۔

## کھانا پکانے کی کتاب کے ساتھ جاری رکھیں {#continue-with-the-cookbook}

اس گائیڈ کا استعمال نیٹ ورک کا انتخاب کرنے ، دستخط کرنے والے کو ترتیب دینے اور فنڈز کی فیسوں کے لئے کریں۔ پھر اس ہدایت نامے کے ساتھ آگے بڑھیں جو درخواست کے رویے سے ملتا ہے جسے آپ بنانا چاہتے ہیں:

|مقصد |نسخہ|
| --- | --- |
|Taira چیک کریں اور ایک کلائنٹ ترتیب دیں | [Taira](/ur/cookbook/connect-to-taira.md) سے رابطہ کریں|
|پہلے ایک تحریر بھیجیں اور اس کے نتائج کی تصدیق کریں | [ٹرانزیکشنز جمع کروائیں اور تصدیق کریں ](/ur/cookbook/submit-and-verify-transactions.md) |
|رجسٹر، مینٹ، اور منتقل قیمت | [فنگبل اثاثہ جات](/ur/cookbook/fungible-assets.md) |
|فلٹر شدہ درخواست کی حالت پڑھیں۔ | [لیجر کی حالت سے استفسار کریں](/ur/cookbook/query-ledger-state.md) |
|متفقہ تبدیلیوں پر رد عمل ظاہر کرنا | [سٹریم واقعات](/ur/cookbook/stream-events.md) |

باورچی خانے کی کتاب ہر کام کے بہاؤ کو توجہ مرکوز کرتی ہے اور جب اسے Taira فنڈنگ یا SORA Nexus نیٹ ورک کے تناظر کی ضرورت ہوتی ہے تو یہاں واپس لنکس دیتی ہے۔

## ۱۔ سمجھیں کہ آپ کیا کر رہے ہیں {#_1-understand-what-you-are-setting-up}

SORA Nexus میں ڈیٹا اسپیس کیٹلاگ ڈیٹا اسپیسز متعین کرتا ہے۔ لین کیٹلاگ الگ سے لینز متعین کرتا ہے: ہر لین ایک ڈیٹا اسپیس کا حوالہ دیتی ہے، اور ایک ڈیٹا اسپیس میں متعدد لینز ہو سکتی ہیں۔ کلائنٹ صرف `client.toml` بدل کر نئی عوامی ڈیٹا اسپیس نہیں بناتا۔ کلائنٹ کی ترتیب دو کام کرتی ہے:

1. کلائنٹ کو دائیں Torii اختتامی نقطہ نظر پر اشارہ کرتا ہے
2. اپنے کینونیکل اکاؤنٹ کے لیے نیٹ ورک سیاق اور دستخطی کلید منتخب کرتی ہے

`AccountId` ہمیشہ کینونیکل اور ڈومین سے آزاد ہوتا ہے، اور `client.toml` میں ڈومین کی ترتیب نہیں ہے: `[account].profile` صرف نیٹ ورک کا I105 سابقہ منتخب کرتا ہے۔ ڈومین کا سیاق عرفی ناموں اور ڈومین کی ملکیت والی اشیا سے متعلق ہے۔ اکثر ایپلیکیشنز کے لیے عوامی `universal` ڈیٹا اسپیس سے شروع کریں۔ ڈومین سیاق `domain.dataspace` کی صورت استعمال کرتا ہے، مثلاً:

```text
wonderland.universal
```

اگر آپ کو ادارے کی نئی ڈیٹا اسپیس درکار ہو تو عام کلائنٹ اکاؤنٹ سے رجسٹر کرنے کی کوشش کے بجائے کیٹلاگ اور روٹنگ کی تجویز تیار کریں۔ نیچے [نئی ڈیٹا اسپیس فراہم کریں](#_8-provision-a-new-dataspace) دیکھیں۔

## پبلک Torii اختتامی نقطہ چیک کریں۔ {#_2-check-the-public-torii-endpoint}

`curl` اور `jq` کے ذریعے Taira ٹیسٹ نیٹ کی حالت دیکھیں۔ اس جانچ کے لیے نہ کلیدیں درکار ہیں نہ مقامی نوڈ۔

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

نوڈ کی فراہم کردہ ڈیٹا اسپیس اور لین کا منظر جانچیں:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Minamoto استعمال کرنے سے پہلے آپریٹر سے مین نیٹ سروس کے پتے کی تصدیق کریں اور دیکھیں کہ TLS سرٹیفکیٹ میزبان کے نام سے مطابقت رکھتا ہے۔

## ایجنٹوں کے لیے Taira MCP {#taira-mcp-for-agents}

Taira ایجنٹ کے رن ٹائمز کے لئے Torii - مقامی ماڈل کنٹینسٹ پروٹوکول (MCP) پل کو بھی بے نقاب کرتا ہے۔ اسے استعمال کریں جب کسی ایجنٹ کو براہ راست ٹیسٹ نیٹ کی پڑھنے ، اسکرپٹ تشخیص ، یا پہلے اپنی مرضی کے مطابق Torii کلائنٹ بنانے کے بغیر سختی سے جائزہ لینے والے لکھنے کے rehearsals کی ضرورت ہو.

|ترتیب |قیمت |
| --- | --- |
|MCP اختتامی نقطہ |`https://taira.sora.org/v1/mcp` |
|نیٹ ورک کی جڑ |`https://taira.sora.org` |
|مطلوبہ استعمال |Taira ٹیسٹنیٹ پڑھتا ہے اور فوسیٹ کی طرف سے فنڈ لکھنے کے rehearsals |
|پیداوار کا مساوی |اس اندراج کو Minamoto پر اشارہ نہ کریں جب تک کہ مرکزی نیٹ ورک MCP کے اختتام پوائنٹ اور ریلیز کنٹرول واضح طور پر منظور نہ ہوں |

برج صرف حالت محفوظ نہ رکھنے والی JSON-RPC `POST` درخواستیں قبول کرتا ہے۔ دستخطی مواد شامل کرنے سے پہلے اس کا دریافت میٹاڈیٹا جانچیں:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
```

ایجنٹ کے رن ٹائم میں URL کو صارف کی مقامی MCP سروس کے طور پر ترتیب دیں۔ ایجنٹ کی MCP ترتیب، API ٹوکن، آگے بھیجے گئے تصدیقی ہیڈر، اور `authority` یا `private_key` کی قدریں اس دستاویزی مخزن یا ایپلیکیشن کے مخزن میں کمٹ نہ کریں۔

ایجنٹ فوری قواعد جو Taira کے ساتھ اچھی طرح کام کرتے ہیں:

- ان کو کال کرنے سے پہلے MCP سرور سے ٹولز دریافت کریں؛ اگر سرور `listChanged` رپورٹ کرتا ہے تو دوبارہ تلاش کریں۔
- خام `torii.*` ٹولز پر کوریٹڈ `iroha.*` ٹولز کو ترجیح دیں۔
- صرف پڑھنا شروع کریں: لکھنے کی تجویز پیش کرنے سے پہلے حیثیت ، اکاؤنٹس ، اثاثوں ، عرفات ، بلاکس ، گورننس اسٹیٹ ، اور ٹرانزیکشن اسٹیٹ کا معائنہ کریں۔
- لائیو ٹیسٹ نیٹ کی تبدیلیوں سے پہلے انسانی ہدایات کی ضرورت ہے۔ پہلے سے دستخط شدہ ٹرانزیکشن لفافوں کے لئے ، `iroha.transactions.submit_and_wait` کا استعمال کریں تاکہ ایجنٹ صرف جمع کروانے کے بجائے نتیجہ کا انتظار کرے۔
- ایجنٹ کے ردعمل میں ٹرانزیکشن ہیشز، حتمی حیثیت اور سرور کی توثیق کی غلطیوں کا خلاصہ کریں۔

### ایجنٹوں کے ساتھ ترقیاتی کام کا بہاؤ {#development-workflow-with-agents}

Iroha کلائنٹس، ٹرانزیکشن تیار کرنے والے ٹولز، تشخیصی اسکرپٹس اور ٹیسٹ نیٹ کی عملی ہدایات پر کام کرنے کے لیے ایجنٹوں سے مدد لیں۔ ایجنٹ کے اختیارات محدود رکھیں: وہ کوڈ دیکھ سکتا ہے، Taira کی موجودہ حالت پڑھ سکتا ہے، تبدیلیاں تجویز کر سکتا ہے اور مقامی ٹیسٹ چلا سکتا ہے۔ کسی انسان کی جانب سے عین اسی کارروائی کی منظوری ملنے تک وہ فعال نیٹ ورک میں تبدیلی نہ کرے۔

ایک عملی کام کا بہاؤ یہ ہے:

1. ایجنٹ سے متعلقہ دستاویزات، SDK کوڈ، CLI کمانڈ، یا MCP ٹول اسکیم کا معائنہ کرنے کے لئے پوچھیں اس سے پہلے کہ وہ کوڈ لکھے.
2. ایجنٹ کو سب سے پہلے سب سے چھوٹا کلائنٹ راستہ لکھنے دیں: حیثیت کی جانچ پڑتال، اکاؤنٹ تلاش، عرفی قرارداد، یا بیلنس تلاش.
3. Taira کے خلاف صرف پڑھنے والے کالز کام کرنے کے بعد ہی لین دین کی تعمیر کا کوڈ شامل کریں۔
4. لائیو نیٹ ورک کے ٹیسٹ کو opt-in رکھیں، مثال کے طور پر `TAIRA_LIVE=1` کے پیچھے، تاکہ ایک عام یونٹ ٹیسٹ رن کبھی بھی ٹیسٹ نیٹ فنڈز خرچ نہیں کرتا یا نیٹ ورک کی دستیابی پر منحصر ہوتا ہے.
5. ایجنٹ کو کسی بھی ٹرانزیکشن جمع کروانے سے پہلے نیٹ ورک روٹ، چین، اتھارٹی اکاؤنٹ، ہدایات کا خلاصہ، فیس اثاثہ، اور متوقع حالت کی تبدیلی کی اطلاع دینا ضروری ہے.
6. تیار کردہ کوڈ کو CI یا مرکزی نیٹ ورک کے طریقۂ کار میں شامل کرنے سے پہلے اس میں رازوں کے انتظام، دوبارہ کوشش کے رویے، ایک ہی عمل دہرانے پر نتیجہ نہ بدلنے کی خاصیت، اور مسترد ہونے کی صورت میں رویے کا جائزہ لیں۔

ترقی کے لیے مفید صرف پڑھنے والے MCP tools میں account asset lookup، alias resolution، block lookup، transaction lookup، transaction lists اور pipeline status checks شامل ہیں۔ کسی بھی signed payload کو بھیجنے سے پہلے اعتماد حاصل کرنے کے لیے انہیں استعمال کریں۔

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### ایجنٹوں کے ذریعے لین دین کا ورک فلو {#transaction-workflow-through-agents}

MCP پل ایک دستخط شدہ Iroha ٹرانزیکشن جمع کروا سکتا ہے ، لیکن یہ معمول کے لین دین کی ضروریات کو ختم نہیں کرتا ہے۔ ایک لین دین کو ابھی بھی صحیح اتھارٹی ، اجازت ، فیس فنڈنگ ، چین ID ، میٹا ڈیٹا اور دستخط کی ضرورت ہوتی ہے۔

خام کے لئے Iroha ٹرانزیکشنز، تعمیر اور ایک کے ساتھ ٹرانزیکشن envelope دستخط SDK یا CLI سب سے پہلے، پھر ایجنٹ کو صرف canonical دستخط شدہ ٹرانزیکشن بائٹس کوڈ کے طور پر دیں `body_base64`. ایجنٹ کو لفافہ جمع کروا سکتے ہیں `iroha.transactions.submit_and_wait`, یا جمع کروائیں `iroha.transactions.submit` اور سروے `iroha.transactions.wait`.

نجی کلیدیں ایجنٹ کے پرامپٹ میں نہ چسپاں کریں۔ ٹرانزیکشن بنانے کے لیے ایجنٹ کو ایسا مقامی کوڈ استعمال کرنے کی ہدایت دیں جو راز صارف کے رن ٹائم ماحول، کی چین، ہارڈویئر دستخط کنندہ یا ورژن کنٹرول سے خارج ٹیسٹ نیٹ کی ترتیباتی فائل سے لوڈ کرتا ہو۔ ایجنٹ کو کلید سے متعلق مواد کبھی Markdown، آزمائشی ڈیٹا، لاگز یا کمٹس میں نہیں لکھنا چاہیے۔

ٹرانزیکشن جمع کروانے سے پہلے، ایجنٹ کو ایک مختصر ٹرانزیکشن پلان تیار کرنے کے لئے کہیں:

- `network`: Taira ٹیسٹ نیٹ ورک جڑ اور سلسلہ ID۔
- `authority`: اکاؤنٹ جس پر دستخط کیے جائیں اور فیس ادا کی جائیں
- `instructions`: رجسٹر، مینٹ، برن، ٹرانسفر، میٹا ڈیٹا، اجازت یا معاہدہ کال کا خلاصہ۔
- `fee asset`: اثاثہ جو Taira سے چارج کیا جائے گا
- `preflight reads`: اکاؤنٹ، اثاثہ بیلنس، اجازت نامے، عرفی یا بلاک چیک پہلے ہی کئے گئے۔
- `expected result`: اسٹیٹ جو تصدیق کے بعد نظر آنا چاہئے
- `idempotency`: ایک ہی request کو retry کرنے پر کیا ہوتا ہے؟

جمع کرانے کے بعد ، ایجنٹ کو ٹرمینل کی حیثیت کا انتظار کرنے دیں ، پھر پڑھنے کے استفسار سے حالت کی تبدیلی کی تصدیق کریں۔ ایک مفید تکمیل رپورٹ میں شامل ہیں:

- ٹرانزیکشن ہیش
- ٹرمینل کی حیثیت جیسے `Committed` ، `Applied`، `Rejected`، یا `Expired`
- جب دستیاب ہو تو بلاک یا ایکسپلورر کی تفصیلات
- جانچ پڑتال کے نتائج
- رد کرنے کا پیغام اور کیا ناکامی اجازتوں ، فیسوں ، توثیق ، پرانی حالت ، یا اختتامی نقطہ کی دستیابی کی طرح نظر آتی ہے

مثال کے طور پر محفوظ فوری:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

جب دستخط شدہ لفافہ پہلے ہی تیار کیا گیا ہو:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP کو عوامی ٹیسٹ نیٹ ورک کنٹرول سطح کے طور پر علاج کریں۔ Taira چابیاں ، ٹیسٹ نیٹ XOR ، فوسیٹ اکاؤنٹس ، اور کینری دستخطات ایک بار میں استعمال کیے جاتے ہیں اور انہیں Minamoto چابیاں اور پیداوار ریلیز ورک فلو سے الگ رکھنا چاہئے۔

## کھلونے کی مثالیں جنہیں آپ اب آزما سکتے ہیں {#toy-examples-you-can-try-now}

یہ مثالیں اکاؤنٹ کی کلیدوں کے بغیر Taira سے صرف ڈیٹا پڑھتی ہیں۔

Taira کی ہر لین کو اس کی ڈیٹا اسپیس اور مرئیت کے ساتھ فہرست میں دیکھیں:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | select(.visibility == "public")
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

ڈیش بورڈ، بوٹ، یا تعیناتی چیک کے لئے ایک چھوٹا سا Node.js حیثیت کی تحقیقات بنائیں:

```bash
node --input-type=module <<'EOF'
const response = await fetch('https://taira.sora.org/status', {
  headers: { Accept: 'application/json' },
});
if (!response.ok) throw new Error(`Taira HTTP ${response.status}`);
const status = await response.json();
const publicLanes = status.teu_lane_commit
  .filter((lane) => lane.visibility === 'public')
  .map((lane) => `${lane.alias}@${lane.dataspace_alias}:${lane.block_height}`)
  .join(', ');
console.log(`Taira: ${status.blocks} blocks, ${status.queue_size} queued, public lanes ${publicLanes}`);
EOF
```

لکھنے کے لئے پہلا کھیل Taira فوسیٹ کا دعوی ہونا چاہئے۔ اس میں ٹیسٹ نیٹ XOR استعمال ہوتا ہے اور اسے کبھی بھی Minamoto پر اشارہ نہیں کیا جانا چاہئے۔

## ایک Taira کلائنٹ ترتیب بنائیں۔ {#_3-create-a-taira-client-config}

اگر آپ کے پاس پہلے سے کلیدی جوڑا نہیں ہے تو ایک کلیدی جوڑا بنائیں:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

`taira.client.toml` بنائیں:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

اوپری سطح کا `chain`، Taira کے لین دین کا عین چین ID ہے، اور `network_id` نیٹ ورک کی عین شناخت ہے جس سے ہر دستخط بندھا ہوتا ہے۔ `network_id` یا `network_id_file` میں سے عین ایک ترتیب دیں۔ `[account].profile = "taira"` آزادانہ طور پر Taira کا I105 چین امتیاز منتخب کرتا ہے۔ چین ID اکاؤنٹ کا پروفائل منتخب نہیں کرتا۔

صرف پڑھنے کے لئے چیک کریں:

```bash
iroha --config ./taira.client.toml ledger domain list --limit 5
```

لکھنے کے ٹیسٹ سے پہلے عوامی Taira تشخیص کریں:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

فیس ادا کرنے والی تحریری کارروائیوں سے پہلے Taira اکاؤنٹ فوسیٹ سے فنڈ کریں۔ پیشگی تیاری والا فوسیٹ عمل [Taira پر ٹیسٹ نیٹ XOR حاصل کریں](#_4-get-testnet-xor-on-taira) میں ہے۔

اکاؤنٹ فنڈ ہونے کے بعد دستخط شدہ لاگ ہدایت اختیاری تحریری بنیادی جانچ ہے۔ ہر بھیجا گیا لین دین اپنا فیس ادا کنندہ متعین کرتا ہے، اور CLI دستخط سے پہلے درست فیس معلوم کرتا ہے:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

کمانڈ تصدیق کا انتظار کرتی ہے۔ Taira عوامی ٹیسٹ نیٹ ہے، اس لیے قطار بھرنے سے ping ناکام ہو سکتا ہے خواہ فوسیٹ خود کام کر رہا ہو۔ اگر `taira doctor` بھری قطار بتائے یا ping، `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` دے تو اسے کلائنٹ کی ترتیب کا مسئلہ سمجھنے سے پہلے انتظار کریں اور دوبارہ کوشش کریں۔

بغیر نگرانی کی بنیادی جانچوں کے لیے ping کو محدود دوبارہ کوشش والے لوپ میں رکھیں:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

اگر `iroha taira doctor` سخت ناکامی دکھاتا ہے تو دوبارہ کوشش کرنا بند کردیں۔ قطار کی سیر اور فیس داخل کرنے سے انکار عوامی ٹیسٹ نیٹ ورک کے عارضی حالات ہیں؛ DNS ، TLS ، یا `status = "fail"` تشخیص نہیں ہیں۔

## ایک SORA Nexus اکاؤنٹ بنائیں ID {#generate-a-sora-nexus-account-id}

SORA Nexus اکاؤنٹ ID، اکاؤنٹ کی عوامی کلید اور ہدف نیٹ ورک کے سابقے سے اخذ کردہ کینونیکل I105 پتہ ہے۔ ایک ہی عوامی کلید Taira اور Minamoto میں الگ IDs بناتی ہے، اور صنعتی صارفین کو Minamoto کے لیے الگ کلیدی جوڑا بنانا چاہیے۔

ایڈ25519 کلید جو اکاؤنٹ کو کنٹرول کرے گا پیدا یا لوڈ کریں:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

عوامی کلید کو ایک Taira اکاؤنٹ ID میں تبدیل کریں:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

ایک Minamoto عوامی کلید کو مین نیٹ پریفیکس کے ساتھ تبدیل کریں۔

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

جہاں SORA Nexus API یا CLI کمانڈ کینونیکل اکاؤنٹ ID مانگے، مثلاً بیلنس کوئریز، سخت اکاؤنٹ فیلڈز یا عرفی ناموں کی وابستگیوں میں، حاصل شدہ اکاؤنٹ ID استعمال کریں۔ متعلقہ نجی کلید اپنی کلائنٹ ترتیب میں رکھیں اور `[account].profile = "taira"` یا `[account].profile = "minamoto"` سے وہی عوامی نیٹ ورک منتخب کریں۔

ID پیدا کرنے سے خود میں فنڈ آن لائن اکاؤنٹ نہیں بنتا ہے۔ Taira پر ، فوسیٹ ٹیسٹ نیٹ لکھنے کے لئے اکاؤنٹ تشکیل دے سکتا ہے اور اسے فنڈ کرسکتا ہے۔ Minamoto پر ، ایک منظور شدہ مین نیٹ بورڈنگ یا خزانہ کے بہاؤ کا استعمال کریں۔

### کلیدی ذخیرہ اور بیک اپ {#key-storage-and-backup}

اکاؤنٹ ID اور عوامی کلید کا اشتراک کیا جا سکتا ہے۔ مماثل نجی کلید ، پاسفرز ، بیج اور بازیافت کے مواد کو خفیہ سمجھا جانا چاہئے۔

SORA Nexus اکاؤنٹس کے لئے ان طریقوں کا استعمال کریں:

- نجی کلیدیں رمز شدہ پاس ورڈ مینیجر، ہارڈویئر سے محفوظ کلیدی ذخیرے یا مخصوص دستخطی خدمت میں محفوظ کریں۔ کلیدوں کو ماخذ کوڈ کے نسخہ کنٹرول میں درج نہ کریں، اور پیداواری کلیدیں شیل کی تاریخ، لاگز، گفتگو، ٹکٹوں یا غیر رمز شدہ احتیاطی نقول میں نہ چھوڑیں۔
- ہر خفیہ خانے یا پروڈکشن دستخط کے لئے ایک منفرد ہائی اینٹروپی پاس ورڈ استعمال کریں۔ پاس ورڈ مینیجر یا تقسیم شدہ اسٹوریج کے عمل میں پاس ورڈز کو ذخیرہ کریں ، نہ کہ خفیہ کردہ نجی کلید کے ساتھ ایک ہی فائل یا بیک اپ بنڈل۔
- Taira اور Minamoto چابیاں الگ رکھیں۔ Taira چابیاں ایک بار استعمال ہونے والے ٹیسٹ نیٹ مواد کے طور پر اور Minamoto چابیاں پیداوار فنڈز اتھارٹی کے طور پر سنبھالیں۔
- نجی کلید ، عوامی کلید ، اکاؤنٹ ID ، اکاؤنٹ پروفائل ، اور کسی بھی اکاؤنٹ کی بازیابی یا دستخط کرنے والے کو بحال کرنے کے لئے درکار اسٹوری نوٹس کا بیک اپ کریں۔ نیٹ ورک کے تناظر کے بغیر ایک نجی کلید بازیافت کے دوران غلط استعمال کرنا آسان ہے۔
- پیداوار کے دستخط کاروں کے لئے کم از کم ایک خفیہ کردہ آف لائن بیک اپ اور ایک جغرافیائی طور پر الگ الگ خفیہ شدہ بیک اپ رکھیں۔ بیک اپ پر منحصر ہونے سے پہلے صرف پڑھنے والے چھوٹے آپریشن کے ساتھ بازیابی کا تجربہ کریں۔
- اگر نجی کلید، پاس ورڈ، بیک اپ میڈیا یا دستخط کرنے والے میزبان کو بے نقاب کیا گیا ہو تو دستخط کنندہ کو rotate کریں یا بدل دیں.

مزید تفصیلات کے لئے، دیکھیں [ اسٹوریج کریپٹوگرافک چابیاں ](/ur/guide/security/storing-cryptographic-keys.md) اور [ پاس ورڈ سیکیورٹی ](/ur/guide/security/password-security.md).

## ٹیسٹ نیٹ XOR کو Taira پر حاصل کریں۔ {#_4-get-testnet-xor-on-taira}

CLI کے پیشگی تیاری والے فوسیٹ عمل سے ٹیسٹ نیٹ XOR طلب کریں۔ فوسیٹ `taira.client.toml` کے اکاؤنٹ کو فنڈ کرتا ہے اور اگر وہ پہلے موجود نہ ہو تو اسے رجسٹر بھی کرتا ہے۔ عمل یہ ہے:

1. فوسیٹ کی عوامی پالیسی پڑھیں: فوسیٹ کا اختیار، فیس کا اثاثہ اور رقم۔
2. دعویٰ تیار کریں۔ CLI پروف آف ورک حل کرتا ہے، Torii کے تیار اور دستخط کردہ عین لین دین کی تصدیق کرتا ہے، اور اسے بھیجے بغیر نجی جرنل ڈائریکٹری میں محفوظ کرتا ہے۔
3. محفوظ لین دین صرف ایک بار بھیجیں۔
4. فیس ادا کرنے والی تحریری کارروائیوں سے پہلے اثاثے کا بیلنس نظر آنے کا انتظار کریں۔

پالیسی پڑھیں:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

جواب اس طرح کا ہے:

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

پالیسی غیر دستخط شدہ دریافت کا ڈیٹا ہے۔ خودکاری کو ہر جواب پر اعتماد کے بجائے متوقع اختیار، اثاثے کی تعریف اور رقم مقرر کرنی چاہیے۔ `prepare` ایسا تیار لین دین مسترد کرتا ہے جو آپ کی دی ہوئی قدروں سے مختلف ہو۔

دعویٰ تیار کریں اور بھیجیں:

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` جرنل ڈائریکٹری نجی طور پر بناتا ہے اور موجودہ ڈائریکٹری کی جگہ لینے سے انکار کرتا ہے، اس لیے ہر دعوے کے لیے نئی ڈائریکٹری استعمال کریں۔ فوسیٹ عوامی ٹیسٹ نیٹ خدمت ہے۔ اگر `submit`، `Pending` بتائے، ٹائم آؤٹ ہو یا `502` ملے تو نیا دعویٰ تیار کرنے کے بجائے اسی ترتیب اور جرنل کے ساتھ `taira account faucet resume` چلائیں۔ پرانا پروف آف ورک اینکر `prepare` ناکام کرتا ہے؛ نئی جرنل ڈائریکٹری میں دوبارہ تیاری کریں۔

پھر اپنی فیس ادا کرنے والی ٹرانزیکشنز جمع کروانے سے پہلے فنڈ شدہ اثاثے کے لئے سروے کریں:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

اگر دعویٰ لاگو ہو گیا ہو مگر اثاثہ ابھی نظر نہ آئے تو تحریری کارروائیوں سے پہلے انتظار کریں اور پڑھنے کی کارروائی دہرائیں۔

فوسیٹ صرف Taira ٹیسٹ نیٹ فنڈز کے لئے ہے۔ XOR ٹسٹ نیٹ ، فوسیٹ اکاؤنٹس ، یا Taira کینری دستخطوں کا استعمال نہ کریں Minamoto بہاؤ میں۔

## ایک Minamoto کلائنٹ ترتیب بنائیں. {#_5-create-a-minamoto-client-config}

Minamoto استعمال کرنے سے پہلے آپریٹر سے مین نیٹ سروس کے پتے کی تصدیق کریں اور دیکھیں کہ TLS سرٹیفکیٹ میزبان کے نام سے مطابقت رکھتا ہے۔

Minamoto کے لئے علیحدہ کلیدی جوڑی کا استعمال کریں۔ مین نیٹ ورک کے لیے Taira کیلیوں کو دوبارہ استعمال نہ کریں.

`minamoto.client.toml` بنائیں:

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

اوپری سطح کا `chain` موجودہ SORA Nexus مین نیٹ کا چین ID ہے، اور `network_id`، Minamoto کی عین نیٹ ورک شناخت ہے؛ پہلی دستخط شدہ کارروائی سے پہلے اسے صلاحیتوں کے راستے سے پڑھیں۔ `[account].profile = "minamoto"`، Minamoto کا I105 چین امتیاز منتخب کرتا ہے؛ اینڈ پوائنٹ کا ہوسٹ نام اور چین ID اسے خودبخود منتخب نہیں کرتے۔

ایک Minamoto عوامی کلید کو اس کے کینیکل I105 اکاؤنٹ ID میں تبدیل کریں جس میں مین نیٹ پریفیکس شامل ہو:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

اکاؤنٹ کو مین نیٹ ورک آن بورڈنگ یا گورننس فلو کے ذریعے ذخیرہ کرنے اور فنڈ دینے تک صرف پڑھنے کی طرف سے چیک کریں:

```bash
iroha --config ./minamoto.client.toml ledger domain list --limit 5
```

Taira کی فوسیٹ یا بنیادی تحریری جانچ کی کمانڈز Minamoto کے خلاف نہ چلائیں۔

## XOR کے ساتھ ایک Minamoto اکاؤنٹ کو فنڈ کریں۔ {#_6-fund-a-minamoto-account-with-xor}

Minamoto فیسوں کو پیداوار XOR کے ساتھ ادا کیا جاتا ہے، اور Minamoto میں کوئی عوامی فوسیٹ نہیں ہے. ایک منظور شدہ مین نیٹ بورڈنگ یا خزانہ کی منتقلی کے ذریعے تشکیل کردہ اکاؤنٹ کو فنڈ کریں، یا موجودہ مالی اعانت یافتہ Minamoto اکاؤنٹ سے XOR وصول کریں۔

تحریر جمع کروانے سے پہلے صرف پڑھنے والے چیک کے ساتھ کینونیکل اکاؤنٹ ID اور فنڈنگ کی تصدیق کریں۔ Minamoto XOR کو پروڈکشن فنڈز کے طور پر علاج کریں: سب سے پہلے Taira پر ایک ہی آپریشن کا تجربہ کریں ، پیداوار کی چابیاں الگ رکھیں ، اور فرض نہ کریں کہ مین نیٹ ٹرانزیکشن ری سیٹ کیا جاسکتا ہے.

Taira XOR Minamoto فیس ادا نہیں کر سکتا۔ ٹیسٹ نیٹ بیلنس اور نلوں کے دعوے Minamoto پر منتقل نہیں ہوتے ہیں۔

## 7. موجودہ ڈیٹا اسپیس کے اندر کام کریں {#_7-work-inside-an-existing-dataspace}

ڈیٹا اسپیس کے اندر موجود لیجر اشیا کے لیے مکمل طور پر متعین ڈومین نام استعمال کریں۔ مثلاً عوامی ڈیٹا اسپیس میں منصوبے کے ڈومین کو یہ صورت استعمال کرنی چاہیے:

```text
apps.universal
```

جب آپ کے اکاؤنٹ میں مطلوبہ اجازتیں ہوں تو ، ڈومین کے لئے خفیہ مفت `AliasSetupPlanRequestV1` ارادہ بنائیں اور اعلاناتی منصوبہ ساز کا استعمال کریں:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto کے لیے مین نیٹ کی الگ درخواست اور منصوبہ تیار کر کے منظور کریں۔ ہر منصوبہ اپنی زنجیر، مجاز اکاؤنٹ، لیجر کی موجودہ حالت کے حوالے اور آخری وقت سے منسلک ہوتا ہے، اس لیے Taira کا منصوبہ مین نیٹ پر منتقل یا دوبارہ نافذ نہیں کیا جا سکتا:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

اکاؤنٹ کے عرفی نام بھی ڈیٹا اسپیس کا یہی لاحقہ استعمال کرتے ہیں:

```text
alice@apps.universal
alice@universal
```

سخت اکاؤنٹ فیلڈز اب بھی کینونیکل I105 اکاؤنٹ IDs کا استعمال کرتے ہیں۔ عرفی ناموں کو انسانی پڑھنے کے قابل پابندیاں سمجھیں جو کینونیکل اکاؤنٹ IDs پر حل ہوجاتی ہیں۔

## 8. نئی ڈیٹا اسپیس فراہم کریں {#_8-provision-a-new-dataspace}

نئی ڈیٹا اسپیس آپریٹر اور گورننس کی تبدیلی ہے۔ عوامی Torii اینڈ پوائنٹ ترتیب شدہ ڈیٹا اسپیسز کو ٹریفک بھیج سکتا ہے، مگر نامعلوم ڈیٹا اسپیس عرفی نام مسترد کرتا ہے۔

تبدیلی تیار کرنے سے پہلے، موجودہ لائیو کیٹلاگ پر قبضہ کریں:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

ایک آپریٹر اکاؤنٹ کے لئے، لین مینی فیسٹ موقف بھی چیک کریں:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

نئے عرفی نام کو اس وقت تک فعال استعمال میں نہ لائیں جب تک لین ID، ڈیٹا اسپیس ID، ویلیڈیٹر مجموعہ، خرابی برداشت، مانیفیسٹ، روٹنگ قواعد اور عملی ذمہ دار کا مشترکہ جائزہ نہ ہو جائے۔ مطلوبہ اجازتوں والا عام صارف اکاؤنٹ عرفی نام کے منصوبہ ساز سے موجودہ ڈیٹا اسپیس کے اندر ڈومین اور اس کی SNS لیز حاصل کر سکتا ہے؛ وہ محفوظ طور پر نئی عوامی ڈیٹا اسپیس نہیں بڑھا سکتا۔

نجی یا ادارے کی ڈیٹا اسپیس کے لیے کیٹلاگ کی تبدیلی میں یہ چیزیں تیار کریں:

- ڈیٹا اسپیس کا منفرد عرفی نام اور عددی `id`
- ایک مماثل لین اندراج یا ایک موجودہ لین تفویض
- ڈیٹا اسپیس کی `fault_tolerance`
- ان ہدایات یا اکاؤنٹس کے دائرہ کار کے لئے روٹنگ قواعد جو وہاں اترنے چاہئیں
- اگر ڈیٹا اسپیس UAID صلاحیتیں فراہم کرتی ہو تو اسپیس ڈائریکٹری مانیفیسٹ یا مساوی اجرا کے شواہد
- ویلیڈیٹر، تعمیل، تصفیہ اور نگرانی کی پالیسی کے لئے گورننس کی منظوری

ایک جائزہ لینے کے قابل ترتیب ٹکڑا اس طرح لگتا ہے:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments data space"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
instruction = "transfer::asset"
description = "Route asset transfers to the payments data space"
```

آپریٹر کی قبولیت میں درج ذیل دروازے شامل ہوں گے:

- `iroha3d --sora --config <config.toml> --check-config` حل شدہ نوڈ ترتیب کو منتقل کرتا ہے
- جنریٹڈ یا نظرثانی شدہ دستاویز کو ہیش اور دستخطوں کے ساتھ محفوظ کیا جاتا ہے۔
- کسی بھی Minamoto پروموشن سے پہلے دھواں کے ٹیسٹ Taira پر گزرنا
- تبدیلی کے بعد `/status` کیٹلاگ مطلوبہ لین اور ڈیٹا اسپیس دکھائے
- `iroha app nexus lane-report --summary` مطلوبہ دستاویزات کی کمی کے بارے میں اطلاع نہیں دیتا

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

اسی ڈیٹا اسپیس کو Minamoto میں صرف Taira کی تنصیب، بنیادی جانچوں، نگرانی اور گورننس کے شواہد مکمل ہونے کے بعد منتقل کریں۔

## متعلقہ صفحات {#related-pages}

- [Iroha 3](/ur/get-started/install-iroha.md) انسٹال کریں
- [Iroha 3 کے ذریعے CLI](/ur/get-started/operate-iroha-via-cli.md) پر کام کریں
- [نجی ڈیٹا اسپیس کی فیس اسپانسر کریں](/ur/get-started/private-dataspace-fee-sponsor.md)
- [Torii اختتام پوائنٹس](/ur/reference/torii-endpoints.md)
- [پیدائش کا حوالہ](/ur/reference/genesis.md)
