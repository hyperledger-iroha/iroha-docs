---
translation_locale: ur
translation_source: /reference/torii-endpoints.md
translation_source_hash: 9bec41b1b419e252fdcff8328e7950a294bdad3ac40112a5a7f2ce451d19e9cb
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Torii اختتام پوائنٹس {#torii-endpoints}

Torii ہے HTTP, SSE, اور WebSocket گیٹ وے Iroha 3. یہ دونوں لیجر کی طرف رخ کرتا ہے APIs اور آپریٹر کے اختتام پوائنٹس.

موجودہ پروٹوکول کے قواعد یہ ہیں:

- کینونیکل بائنری فارمیٹ Norito ہے
- بہت سے اختتامی پوائنٹس بھی JSON کی حمایت کرتے ہیں جب آپ `Accept: application/json` بھیجتے ہیں۔
- میٹرکس پر Prometheus فارمیٹ میں اشارہ کیا جاتا ہے

فارمیٹ کی تفصیلات کے لئے، مواد مذاکرات، ترتیب پرچم، شیما ہیشز، اور Norito RPC رہنمائی، دیکھیں [Norito حوالہ](/ur/reference/norito.md).

## مشترکہ اختتامی نکات {#common-endpoints}

|اختتامی نقطہ |شکل |مقصد |
| --- | --- | --- |
|`POST /transaction` |Norito |دستخط شدہ ٹرانزیکشن جمع کروائیں |
|`POST /query` |Norito |دستخط شدہ استفسار درج کریں |
|`GET /events` |WebSocket |تقریبات کے سلسلے میں سبسکرائب کریں |
|`GET /block/stream` |WebSocket |سلسلہ بندی شدہ بلاکس |
|`GET /peers` |JSON |Torii کے ذریعہ بے نقاب ہونے والے ہم مرتبہ کی فہرست |
|`GET /health` |JSON |ہلکے وزن کی زندگی کا اختتام |
|`GET /api_version` |JSON |ڈیفالٹ API ورژن |
|`GET /status` |JSON |آپریٹرز کے لیے اعلیٰ سطح کی حیثیت کا خلاصہ |
|`GET /metrics` |Prometeus |Prometheus سکریپ اختتام نقطہ |
|`GET /schema` |JSON |ڈیٹا ماڈل شیما اسنیپ شاٹ نوڈ کی طرف سے خدمت |
|`GET /openapi` یا `GET /openapi.json` |JSON |فعال Torii HTTP راستوں کے لیے دستاویز OpenAPI |
|`GET /v1/parameters` |JSON |نوڈ پیرامیٹر کی فوری شاٹ |
|`GET /v1/node/capabilities` |JSON |نوڈ کی صلاحیت اور ڈیٹا ماڈل میٹا ڈیٹا |
|`GET /v1/api/versions` |JSON |Torii API ورژن کی حمایت |
|`GET /v1/events/sse` |SSE |طویل مدتی گاہکوں کے لئے ایونٹ سٹریم |
|`GET /v1/time/now` |JSON |نوڈ دیوار کی گھڑی سنیپ شاٹ |
|`GET /v1/time/status` |JSON |وقت کی ہم آہنگی کی حیثیت |

`/openapi` ایک چلانے والے نوڈ کے لئے مستند اختتامی پوائنٹ کی فہرست ہے. تعمیر کی خصوصیات اور رن ٹائم ترتیب، تو پیدا کلائنٹس براہ راست ترجیح دینا چاہئے OpenAPI دستاویزی طور پر نقل شدہ روٹ لسٹ پر دستاویز۔ [Torii API کنسول](/ur/reference/torii-api-console.md) اس زندہ دستاویز کو لوڈ کرنے کے لئے، ٹیسٹ JSON راستے، کاپی curl درخواستیں، اور موجودہ شیما سے کلائنٹ کوڈ پیدا.

## Taira راستوں کو براہ راست آزمائیں {#try-live-taira-routes}

عوامی Taira ٹیسٹ نیٹ ورک ایک ہی Torii JSON سطح کو بے نقاب کرتا ہے جو ایپلی کیشن کلائنٹس صرف پڑھنے کے لئے کھوج کے ل use استعمال کرتے ہیں۔ ان کمانڈز میں کلیدوں کی ضرورت نہیں ہے۔

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

کوشش کریں وسائل موجودہ دنیا کی حالت کے خلاف پڑھتا ہے:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

اگر ایک عوامی ٹیسٹ نیٹ روٹ `502` واپس کرتا ہے، اوقات سے باہر جاتا ہے، یا بھرپور قطار کی اطلاع دیتا ہے تو، اسے اختتام نقطہ دستیابی کے مسئلے کے طور پر علاج کریں اور بعد میں اپنے کلائنٹ کوڈ کو ڈیبگ کرنے سے پہلے دوبارہ کوشش کریں.

## اتفاق رائے اور رن ٹائم اختتام پوائنٹس {#consensus-and-runtime-endpoints}

|اختتامی نقطہ |شکل |مقصد |
| --- | --- | --- |
|`GET /v1/sumeragi/commit-certificates` |JSON |تازہ ترین کمیٹی سرٹیفکیٹ خلاصے |
|`GET /v1/sumeragi/validator-sets` |JSON |توثیق کنندہ سیٹ تاریخ |
|`GET /v1/sumeragi/validator-sets/{height}` |JSON |ایک بلاک کی اونچائی پر درست کرنے والا مقرر |
|`GET /v1/sumeragi/status` |Norito یا JSON |اتفاق رائے کی صورت حال کا تفصیلی snapshot |
|`GET /v1/sumeragi/status/sse` |SSE |مسلسل اتفاق رائے کی حیثیت کا سلسلہ |
|`GET /v1/sumeragi/leader` |JSON |موجودہ لیڈر معلومات |
|`GET /v1/sumeragi/qc` |Norito یا JSON |تازہ ترین کوروم سرٹیفکیٹ کا خلاصہ |
|`GET /v1/sumeragi/checkpoints` |JSON |اتفاق رائے چیک پوائنٹ کا خلاصہ |
|`GET /v1/sumeragi/consensus-keys` |JSON |فعال اتفاق رائے کی کلیدیں |
|`GET /v1/sumeragi/bls_keys` |JSON |فعال BLS اتفاق رائے کی کلیدیں |
|`GET /v1/sumeragi/phases` |JSON |تازہ ترین فی مرحلے تاخیر نمونہ |
|`GET /v1/sumeragi/rbc` |JSON |RBC سیشن اور ٹرانسمیٹ میٹرکس |
|`GET /v1/sumeragi/rbc/sessions` |JSON |فعال RBC سیشن سنیپ شاٹ |
|`GET /v1/sumeragi/pacemaker` |JSON |پیسی میکر کی حیثیت |
|`GET /v1/sumeragi/params` |JSON |موجودہ آن لائن چین Sumeragi پیرامیٹرز |
|`GET /v1/sumeragi/collectors` |JSON |Deterministic collector plan snapshot |
|`GET /v1/sumeragi/key-lifecycle` |JSON |اتفاق رائے کلیدی زندگی کے دوران کی حیثیت |
|`GET /v1/sumeragi/telemetry` |JSON |اتفاق رائے ٹیلی میٹری سنیپ شاٹ |
|`GET /v1/sumeragi/evidence` |JSON |ثبوت ریکارڈ، اختیاری طور پر استفسار تار کی طرف سے فلٹر |
|`GET /v1/sumeragi/evidence/count` |JSON |ثبوت ریکارڈ گنتی |
|`POST /v1/sumeragi/evidence/submit` |JSON |اتفاق رائے کا ثبوت پیش کریں |
|`GET /v1/sumeragi/commit_qc/{hash}` |Norito یا JSON |بلاک ہیش کے لئے QC ریکارڈ پر عمل درآمد کریں |
|`GET /v1/runtime/abi/active` |JSON |فعال رن ٹائم ABI ڈیسکرپٹر |
|`GET /v1/runtime/abi/hash` |JSON |فعال رن ٹائم ABI ہیش |
|`GET /v1/runtime/metrics` |JSON |رن ٹائم میٹرکس سنیپ شاٹ |
|`GET /v1/runtime/upgrades` |JSON |رن ٹائم اپ گریڈ کی فہرست |
|`POST /v1/runtime/upgrades/propose` |JSON |ایک رن ٹائم اپ گریڈ کی تجویز |
|`POST /v1/runtime/upgrades/activate/{id}` |JSON |رن ٹائم اپ گریڈ کی تجویز کو فعال کریں |
|`POST /v1/runtime/upgrades/cancel/{id}` |JSON |رن ٹائم اپ گریڈ کی تجویز کو منسوخ کریں |

## ایپ اور SORA روٹ کنبے {#app-and-sora-route-families}

جب Torii ایپ کا سامنا کرنے والی خصوصیت سیٹ کے ساتھ بنایا جاتا ہے تو ، اس سے دریافت کنندگان ، SORA خدمات ، پل بہاؤ ، ثبوت اور اسٹوریج کے لئے اضافی JSON خاندانوں کو بے نقاب کیا جاتا ہے۔ یہ تمام خاندان ہر نیٹ ورک پروفائل پر فعال نہیں ہیں۔

|روٹ خاندان |مقصد |
| --- | --- |
|`/v1/accounts/*` ، `/v1/domains/*`، `/v1/assets/*` |JSON پڑھتا ہے، پوچھ گچھ کے مددگار، آن بورڈنگ کے مددگار، اور پورٹ فولیو یا ہولڈر کے خیالات |
|`/v1/nfts/*` ، `/v1/rwas/*`، `/v1/confidential/*` |NFT ، حقیقی دنیا کے اثاثے، اور خفیہ اثاثوں کے خیالات |
|`/v1/aliases/*` ، `/v1/assets/aliases/*`، `/v1/sns/*`، `/v1/identifiers/*`|نام، عرفان اور شناخت کنندہ قرارداد |
|`/v1/explorer/*` |ایکسپلورر پر مبنی اکاؤنٹ ، اثاثہ ، بلاک ، ٹرانزیکشن ، ہدایات ، میٹرکس ، اور سٹریم ویوز |
|`/v1/transactions/*` ، `/v1/pipeline/*`، `/v1/iso20022/*` |ٹرانزیکشن کی تاریخ، پائپ لائن کی بحالی یا حیثیت، اور ISO 20022 معاون |
|`/v1/contracts/*` |معاہدے کا کوڈ، تعینات، بنڈل، کال، ویو، ایونٹ، سرگرمی، رول اپ، اور ریاستی راستے |
|`/v1/multisig/*`، `/v1/controls/*` |Multisig تجاویز، منظوری اور منتقلی کے کنٹرول میں معاون |
|`/v1/bridge/*` ، `/v1/ledger/*`، `/v1/proofs/*` |فائنلٹی، اسٹیٹ پروف، بلاک پروف، ثبوت برقرار رکھنے، اور ثبوت کے سوالات کے راستے |
|`/v1/da/*` |اعداد و شمار کی دستیابی کا استعمال، دستاویزات، ثبوت کی پالیسیاں، وعدے اور پِن ارادے |
|`/v1/zk/*` |ZK جڑیں، ثبوت کی تصدیق، IVM ثابت کرنا، ووٹوں کی گنتی، تصدیق کی چابیاں، ثبوت کے ریکارڈ اور منسلکات |
|`/v1/gov/*`، `/v1/ministry/*` |گورننس کی تجاویز، ووٹ، کونسل ریاست، محفوظ ناموں کی جگہیں، ایجنڈے کی تجاویزات، قانون سازی اور حتمی شکل |
|`/v1/nexus/*`، `/v1/sccp/*` |Nexus لین، ڈیٹا اسپیس، اور کراس چین پروف ہیلپرز |
|`/v1/musubi/*` |Musubi پیکج رجسٹر پڑھتا ہے اور ہدایات کی تعمیر |
|`/v1/subscriptions/*` |رکنیت کے منصوبے، رکنیت کی زندگی سائیکل، استعمال اور معاونین کا چارج |
|`/v1/sorafs/*` ، `/sorafs/*`، `/.well-known/sorafs/*` |SoraFS فراہم کنندہ کا پتہ لگانا، صلاحیت کی تصدیق، پننگ، اسٹوریج لینے اور عوامی مواد کی خدمت کرنا |
|`/v1/soracloud/*` ، `/v1/soradns/*`، `/soradns/*`، `/api/*`|SoraCloud سروس لائف سائیکل، نجی کمپیوٹر / ماڈل فلو، عوامی دریافت اور میزبان ایپ روٹنگ |
|`/v1/connect/*`، `/v1/vpn/*` |Iroha کنیکٹ سیشن، WebSocket ٹرانسپورٹ، VPN سیشن، پروفائلز، اور رسیدیں |
|`/v1/app-api/*` ، `/v1/api/*`، `/v1/content/*` |App API پابندیاں اور بنڈل/CID کی حمایت یافتہ مواد روٹنگ |
|`/v1/operator/*`، `/v1/mcp` |آپریٹر کی تصدیق اور مقامی MCP JSON-RPC پل |
|`/v1/offline/*` ، `/v1/repo/*`، `/v1/space-directory/*`، `/v1/ram-lfe/*`|آف لائن تیاری، ذخیرہ معاہدوں، ڈیٹا اسپیس منشور، اور [RAM-LFE معاونین ](/ur/blockchain/ram-lfe.md#torii-routes) |
|`/v1/kaigi/*` ، `/v1/webhooks/*`، `/v1/notify/*`، `/v1/telemetry/*`|تعاون، ویب ہوک، پش نوٹیفکیشن، اور لائیو ٹیلی میٹری انضمام |

## ISO 20022 برج {#iso-20022-bridge}

Torii جب ایپ کے سامنے API اور پل رن ٹائم کو فعال کیا جاتا ہے تو ISO 20022 پل کو `/v1/iso20022/*` کے تحت بے نقاب کرتا ہے۔ پل کا مقصد اس حد تک محدود ہوتا ہے: یہ ایک عام مقصد ISO 20022 کلیئرنگ گیٹ وے نہیں ہے، لیکن منتخب کردہ ادائیگی کے پیغامات کو دستخط شدہ Iroha ٹرانسفر میں تبدیل کرنے اور ان کی لیجر کی حیثیت کا سراغ لگانے کے لئے ایک معاون ذیلی سیٹ ہے۔

### Torii ISO 20022 اختتامی نکات {#torii-iso-20022-endpoints}

|طریقہ کار اور اختتامی نقطہ |مقصد |
| --- | --- |
|`POST /v1/iso20022/pacs008` |ایک FI-to-FI کسٹمر کریڈٹ ٹرانسفر جمع کروائیں اور ملحقہ Iroha اثاثے کی منتقلی کو تیار کریں |
|`POST /v1/iso20022/pacs009` |FI سے FI کریڈٹ ٹرانسفر پیش کریں جو PvP یا سیکیورٹیز سے متعلق نقد فنڈنگ کے لئے استعمال کیا گیا ہے |
|`POST /v1/iso20022/pacs002` |ادائیگی کی حیثیت سے رپورٹ پیش کریں |
|`POST /v1/iso20022/pacs004` |ادائیگی کی واپسی جمع کروائیں |
|`POST /v1/iso20022/camt056` |ادائیگی کی منسوخی کی درخواست جمع کروائیں |
|`POST /v1/iso20022/sese023` |سیکیورٹیز کے تصفیہ کی ہدایات جمع کروائیں |
|`POST /v1/iso20022/sese024` |سیکیورٹیز کے تصفیہ کی حیثیت کا پیغام پیش کریں |
|`POST /v1/iso20022/sese025` |سیکیورٹیز کے تصفیہ کی تصدیق جمع کروائیں |
|`POST /v1/iso20022/colr012` |ضامن کی تبدیلی کا پیغام بھیجیں |
|`GET /v1/iso20022/messages/{msg_id}` |ایک پیغام کے لئے کینونیکل پل ریکارڈ پڑھیں |
|`GET /v1/iso20022/audit/messages` |ٹرانسمیشن کے لئے واضح پیغام آڈٹ منشور پڑھیں |
|`GET /v1/iso20022/messages/{msg_id}/pacs002` |موجودہ ادائیگی کی حیثیت کو `pacs.002` XML کے طور پر پیش کریں۔ |
|`GET /v1/iso20022/messages/{msg_id}/pacs004` |موجودہ ادائیگی کی واپسی کو `pacs.004` XML کے طور پر پیش کریں۔ |
|`GET /v1/iso20022/messages/{msg_id}/camt029` |موجودہ منسوخی کی قرارداد کو `camt.029` XML کے طور پر پیش کریں |
|`GET /v1/iso20022/messages/{msg_id}/sese024` |موجودہ تصفیہ کی حیثیت کو `sese.024` XML کے طور پر تبدیل کریں۔ |
|`GET /v1/iso20022/messages/{msg_id}/sese025` |موجودہ تصفیہ کی تصدیق کو `sese.025` XML کے طور پر پیش کریں۔ |

`pacs.008` دستاویزات میں پیغام ID، بین الاقوامی بینک تصفیہ رقم، کرنسی، تصفیہ کی تاریخ، قرض دہندہ اور قرض دہندہ IBANs، اور قرض دہندگان اور کریڈٹروں BICs شامل ہونا چاہئے. جب ریفرنس ڈیٹا ترتیب دیا جاتا ہے تو ، پل پیپ لائن میں داخل ہونے سے پہلے BIC ، IBAN اور ISO 4217 کرنسی کراسواکس کی بھی جانچ پڑتال کرتا ہے۔

`pacs.009` دستاویزات میں کاروباری پیغام ID، پیغام کی تعریف ID، تخلیق کا وقت، بین الاقوامی بینک تصفیہ رقم، کرنسی، تصفیہ کی تاریخ شامل ہونی چاہئے، ہدایات دینے والا اور ہدایت یافتہ ایجنٹ BICs ، اور قرض دہندہ اور کریڈٹر IBANs۔ اگر پیغام میں `Purp` شامل ہے تو، پل فی الحال صرف سیکیورٹیز کے مقصد سے فنڈنگ قبول کرتا ہے: `Purp=SECU`.

انگریزی میں `pacs.008` اور `pacs.009` جمع کرانے کے اختتامی پوائنٹس قبول XML ISO لفافے یا پل ٹیسٹ میں استعمال شدہ فلیٹ فیلڈ فارمیٹ۔ اختیاری `SplmtryData` کھیتوں ہدف کو pin کر سکتے ہیں Iroha لیجر، ماخذ اور ہدف اکاؤنٹ IDs یا پتے، اور اثاثے کی تعریف ID. جواب یہ ہے `202 Accepted` کے ساتھ `message_id`, `transaction_hash`, `status`, `pacs002_code`, اور حل شدہ لیجر / اکاؤنٹ / اثاثہ کے تناظر.

### اضافی تجزیہ کار اور نقشہ سازی کی حمایت {#additional-parser-and-mapping-support}

IVM ISO ہیلپر بھی لفافے کی توثیق ، آبادکاری کا نقشہ سازی ، یا بہاؤ میں مصالحہ کے ل the مندرجہ ذیل پیغام خاندانوں کو درست کرتا ہے اور ان کی حقیقت بناتا ہے۔ ان کے پاس اسٹینڈ لوڈ Torii روٹس نہیں ہیں۔

|پیغام خاندان |موجودہ حمایت |
| --- | --- |
|`head.001` |ISO لفافوں کے لیے بزنس ایپلی کیشن ہیڈر کی توثیق، بشمول `BizMsgIdr` ، `MsgDefIdr`، تخلیق کا وقت، اور اختیاری بھیجنے والے/رسیور BIC فیلڈز |
|`pacs.007` ، `pacs.028`، `pacs.029` |ادائیگی کی واپسی، حیثیت کی درخواست اور تحقیقات کا حل/حالات تجزیہ |
|`pain.001`، `pain.002` |کلائنٹ کی ادائیگی کا آغاز اور ادائیگی کی حیثیت کی رپورٹ کی توثیق |
|`camt.052` ، `camt.053`، `camt.054` |اکاؤنٹ کی رپورٹ، بیان اور اطلاع کی توثیق |

## Kaigi سیشن {#kaigi-sessions}

Kaigi SORA Nexus پر ادا شدہ ، ریئل ٹائم آڈیو / ویڈیو رومز فراہم کرتا ہے۔ جب کسی ایپلی کیشن کو لیجر بیکڈ سیشن تخلیق کرنے ، لسٹری میں تبدیلیوں ، ریلے مانیٹس ، خفیہ کردہ سگنلنگ اور استعمال کی پیمائش کی ضرورت ہو تو اسے استعمال کریں اس کے بجائے تمام کانفرنسنگ ریاست کو آف چین رکھیں گے۔

لیجر کی طرف متوجہ زندگی سائیکل ہے:

- `CreateKaigi`: ایک ڈومین کے تحت کال بنائیں اور اس کی پالیسی، شیڈول، میٹا ڈیٹا، اور اختیاری ریلے منسٹرکٹ کو اسٹور کریں۔
- `JoinKaigi` اور `LeaveKaigi`: کال لسٹ کو اپ ڈیٹ کریں۔ پرائیویٹ موڈ میں ، شرکاء براہ راست شرکت کنندہ اکاؤنٹ IDs کو بے نقاب کرنے کے بجائے عہدوں ، منسوخی اور لسٹری ثبوت استعمال کرتے ہیں۔
- `RecordKaigiUsage`: پیمائش کی مدت اور گیس کل شامل کریں.
- `EndKaigi`: سیشن بند کریں اور آخری ٹائم اسٹیمپ ریکارڈ کریں۔

Torii ریلے ٹیلی میٹری کو ظاہر کرتا ہے `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, اور `/v1/kaigi/relays/events` جب ایپ API اور ٹیلی میٹری خصوصیات فعال ہیں. سیشن کی حالت Kaigi ڈومین واقعات جیسے `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated`, اور `KaigiUsageSummary`.

### CLI دھواں ٹیسٹ {#cli-smoke-test}

`iroha kaigi` CLI کے ساتھ شروع کریں جب آپ یہ تصدیق کرنا چاہتے ہیں کہ ایک Torii اختتامی پوائنٹ Kaigi ٹرانزیکشنز کو منسلک کرنے سے پہلے UI قبول کرتا ہے. فوری اسٹارٹ کمانڈ فعال Torii اختتامی نقطہ کے خلاف ایک عارضی کمرہ بناتا ہے اور کال شناخت کنندہ ، جوائن کمانڈ ، اور SoraNet spool اشارہ کے ساتھ خلاصہ پرنٹ کرتا ہے۔

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

اسکرپٹ کے بہاؤ کے لئے، کمرے کی زندگی سائیکل کو واضح طور پر منظم کریں:

```bash
iroha kaigi create \
  --domain streaming \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha kaigi join --domain streaming --call-name daily --participant <i105-account-id>
iroha kaigi leave --domain streaming --call-name daily --participant <i105-account-id>

iroha kaigi record-usage \
  --domain streaming \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha kaigi end --domain streaming --call-name daily
```

`--room-policy public` کا استعمال ان کمروں کے لئے کریں جن پر ریلے بغیر ناظرین کے ٹکٹوں کے بے نقاب ہوسکتے ہیں ، یا `--room-policy authenticated` جب باہر نکلنے کے لئے ناظرین کی توثیق کی ضرورت ہو۔ `--privacy-mode zk-roster-v1` کا استعمال صرف بعد میں کریں۔ نیٹ ورک میں Kaigi لسٹ اور استعمال کی تصدیق کرنے والی چابیاں تشکیل دی گئی ہیں۔ دوسری صورت میں deterministic verification کے دوران joins، leaves، and private use records fail.

### JavaScript ڈیمو کے ساتھ ٹیسٹنگ {#testing-with-the-javascript-demo}

استعمال کریں [soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) ڈیسک ٹاپ ڈیمو کے لئے ایک اختتام سے آخر پرس ٹیسٹ. ڈیمو ایک الیکٹران اور Vue درخواست ہے جو براہ راست بات چیت کرتا ہے Torii مقامی کے ذریعے `@iroha/iroha-js` پابند اور ایک شامل ہے `/kaigi` براؤزر کے مقامی ون ٹو ون میڈیا کا راستہ۔

Iroha سورس ریپوزٹری سے [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) کے ساتھ ڈیمو کا استعمال کریں۔ ڈیمو پنز SDK سے `file:../iroha/javascript/iroha_js` تک ہیں ، لہذا دونوں چیک آؤٹ کو اس بہن بھائی ترتیب میں رکھیں:

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

Node.js 20 یا اس سے نیا اور ایک Rust ٹولچین استعمال کریں تاکہ مقامی `iroha_js_host` ماڈیول تشکیل دے سکے۔ اس کے ماخذ کو تبدیل کرنے کے بعد بہن بھائی Iroha چیک آؤٹ میں SDK کی تعمیر نو کریں۔ صاف پیکج ترتیب میں کارگو ورک اسپیس شامل نہیں ہے جس کی ضرورت ہے `npm run build:native`.

ایک کنٹرول ٹیسٹ کے لئے، Kaigi قابل Torii اختتامی نقطہ پر ڈیمو اشارہ کریں:

1. ایک شروع کریں Iroha نوڈ کے ساتھ SORA/Kaigi ایپ کا رخ APIs فعال، یا ایک عوامی اختتامی نقطہ استعمال کرتا ہے جو Kaigi آپ کی ضرورت سطحوں.
2. `/health` کے ساتھ بنیادی رسائی کی جانچ پڑتال کریں، پھر `/openapi` یا `/openapi.json` کے ساتھ براہ راست راستے کی سطح چیک کریں۔ کچھ تعیناتیوں میں `/v1/health` کو بھی بے نقاب کیا جاتا ہے، لیکن `/health` پورٹیبل زندگی کی جانچ ہے۔
3. TAIRA کے لئے، براہ راست اجلاس کی کوشش کرنے سے پہلے ریلے ٹیلی میٹری روٹس کو چیک کریں:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

ان چیکوں سے یہ ثابت ہوتا ہے کہ Torii اور Kaigi ریلے ٹیلی میٹری تک رسائی حاصل ہے۔ وہ ایک اجلاس نہیں بناتے ہیں۔ `CreateKaigi` اور `JoinKaigi` کو ابھی بھی فنڈ والیٹ اور دستخط شدہ لین دین کی پیش کش کی ضرورت ہوتی ہے۔
4. ڈیمو کھولیں، ترتیبات پر جائیں، Torii URL سیٹ کریں، اور ایپ کو سلسلہ ID اور نیٹ ورک پریفیکس کو اختتام نقطہ سے لوڈ کرنے دیں.
5. ڈیمو میں دو مقامی بٹوے بنائیں یا بحال کریں۔ الگ الگ ایپ ونڈوز ، پروفائلز ، یا مشینیں استعمال کریں تاکہ میزبان اور مہمان کے پاس الگ الگ بٹوے کی حالت ہو۔

Kaigi UI کا تجربہ کرنے کے لئے:

1. میزبان ونڈو میں، Kaigi کھولیں، اجلاس شروع کریں کا انتخاب کریں، ایک عنوان مقرر کریں، اور منتخب کریں نجی دعوت نامہ یا شفاف دعوت نامہ.
2. منتخب کریں کیمرے اور مائکروفون کو آن کریں تاکہ WebRTC میں مقامی میڈیا ہو.
3. منتخب کریں میٹنگ لنک بنائیں۔ ایک لائیو بٹوے `CreateKaigi` جمع کراتا ہے۔ پھر ایپ میں `iroha://kaigi/join?call=...&secret=...` دعوت نامہ اور `#/kaigi?...` فال بیک روٹ دکھایا جاتا ہے۔
4. میزبان کی کھڑکی کو کھلا رکھیں اور دعوت نامہ مہمان کے ساتھ شیئر کریں۔
5. مہمان ونڈو میں ، دعوت نامہ کھولیں یا اسے شامل ہونے کی میٹنگ میں چسپاں کریں ، مقامی میڈیا کو آن کریں ، اور شامل ہونے والی میٹنگ کا انتخاب کریں۔ ایک لائیو بٹوے Torii سے خفیہ کردہ میزبان کی پیش کش حاصل کرتا ہے اور خفیہ جواب کے ساتھ `JoinKaigi` جمع کراتا ہے۔
6. میزبان کو Kaigi کال سگنل اسٹریمنگ یا سروے کرکے پہلے جواب کو خودکار طور پر لاگو کرنا چاہئے۔ دونوں ونڈوز میں منسلک میڈیا اور اپ ڈیٹ کردہ کنکشن کی تفصیلات دکھائی دینی چاہئیں۔
7. میزبان سے سیشن ختم کریں، یا CLI `iroha kaigi end` ایک ہی کال کے لئے کمانڈ ID.

نجی Kaigi کی ضروریات کو محفوظ کیا گیا ہے XOR نجی انٹریپوائنٹ فیس ادا کرنے کے لئے. اگر ڈیمو رپورٹ کرتا ہے کہ نجی Kaigi کی ضرورت ہے XOR ، ایپ میں خود بچانے کا اشارہ استعمال کریں اور دوبارہ کوشش کریں تخلیق یا عمل میں شامل ہوں. اگر ثبوت کی پیداوار ، نجی فنڈنگ ، یا براہ راست سگنلنگ دستیاب نہیں ہے تو ، ڈیمو شفاف / دستی بہاؤ میں واپس گر سکتا ہے۔ اس صورت میں ، ایڈوانسڈ سگنلنگ کھولیں ، خام پیش کش یا جواب پیکج کو کاپی کریں اور اسے دوسری ونڈو میں پیسٹ کریں۔

ڈیمو ریپو میں خودکار چیک کے لیے، درج ذیل کو چلائیں۔

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

توجہ مرکوز Vitest سویٹس Kaigi میٹنگ لنک تخلیق ، کمپیکٹ دعوت لوڈنگ ، نجی بنائیں / جوائن / اینڈ برج کالز ، سیلف شیلڈ پرامپٹ ، دستی فال بیک ، اور جواب سروے کا احاطہ کرتی ہیں۔ UI دھواں ٹیسٹ میں ڈیسک ٹاپ اور موبائل سائز کے نظارے پورٹ پر `/kaigi` راستہ شامل ہے۔ دو بٹوے کے درمیان لائیو میڈیا کو ابھی بھی ایک دستی دو ونڈو ٹیسٹ کی ضرورت ہے کیونکہ براؤزر کیمرہ / مائکروفون کی اجازت اور ہم مرتبہ میڈیا سٹریم ماحول مخصوص ہیں ۔

نمونہ انٹیگریشن کوڈ کے لئے، دیکھیں [ایک JavaScript App](/ur/guide/tutorials/kaigi.md) میں شامل Kaigi.

## حالت اور میٹرکس {#status-and-metrics}

اسٹیٹس اور میٹرکس کے اختتامی پوائنٹس ڈیش بورڈ میں سب سے پہلے چیزوں کو وائرنگ:

- `/status` اعلی سطح کے ہم مرتبہ، بلاک، قطار اور اتفاق رائے کے میدانوں کو بے نقاب کرتا ہے.
- `/metrics` Prometheus کاؤنٹرز، پیمائش اور histograms کو بے نقاب کرتا ہے

Nexus کے قابل نوڈس پر ، اسٹیٹس آؤٹ پٹ میں لین اور ڈیٹا اسپیس سے آگاہ سیکشن بھی شامل ہیں۔ جب `nexus.enabled = false` ، ان سیکشنوں کو چھوڑ دیا جاتا ہے۔

## JSON بمقابلہ Norito {#json-vs-norito}

کئی آپریٹر اختتامی پوائنٹس ڈیفالٹ کے طور پر Norito واپس کرتے ہیں۔ جب اختتامی نقطہ JSON کی حمایت کرتا ہے تو، بھیجیں:

```http
Accept: application/json
```

یہ خاص طور پر مفید ہے:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

جب ایک اختتامی نقطہ Norito براہ راست ٹائپ کیا جاتا ہے یا واپس کرتا ہے تو، `application/x-norito` کو مواد کی قسم کے طور پر یا ترجیحی `Accept` قدر کے طور پر استعمال کریں. نقل و حمل کی تفصیلات کے لئے [Norito](/ur/reference/norito.md#torii-and-norito-rpc) دیکھیں.

## ٹیلی میٹری پروفائلز {#telemetry-profiles}

اختتامی نقاط کی مرئیت نوڈ کی `telemetry.profile` ترتیب پر منحصر ہے۔ موجودہ کنفیگریشن پروفائل کی پانچ سطحیں فراہم کرتی ہے:

|پروفائل |`/status` |`/metrics` |ڈویلپرز کے راستے |
| --- | --- | --- | --- |
|`disabled` |نہیں |نہیں |نہیں |
|`operator` |ہاں |نہیں |نہیں |
|`extended` |ہاں |ہاں |نہیں |
|`developer` |ہاں |نہیں |ہاں |
|`full` |ہاں |ہاں |ہاں |

## CLI شارٹ کٹس {#cli-shortcuts}

`iroha` CLI پہلے ہی ان میں سے بہت سے اختتامی پوائنٹس کو احاطہ کرتا ہے:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## اوور اسٹریم ریفرنسز {#upstream-references}

- [README API اور مشاہدہ کرنے کی صلاحیت کا جائزہ](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 پل کی تنصیب](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [کارکردگی اور میٹرکس](/ur/guide/advanced/metrics.md)
