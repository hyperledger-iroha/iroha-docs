---
translation_locale: ur
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SORA 3 پر تعمیر کریں: Taira اور Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 اے پی پی کی طرف متوجہ عوامی تعیناتی ٹریک ہے Iroha 3 اور SORA Nexus. تعمیر کریں اور پر عمل کریں Taira سب سے پہلے، پھر ایک ہی کلائنٹ کی شکل منتقل کرنے کے لئے Minamoto صرف جب آپ کے پاس علیحدہ اہم نیٹ ورک کی چابیاں ہیں، حقیقی XOR فیسوں اور پیداوار کی منظوری کے لیے۔

اس ٹیوٹوریل میں دکھایا گیا ہے کہ کس طرح عوامی SORA نیٹ ورک کے لئے ایک Iroha کلائنٹ کو ترتیب دیں:

- Taira ٹیسٹ نیٹ at `https://taira.sora.org`
- Minamoto مین نیٹ پر `https://minamoto.sora.org`

استعمال Taira انٹیگریشن ٹیسٹ، نل سے فنڈ شدہ لکھنے کے کینری اور تعیناتی کی rehearsals کے لئے. استعمال Minamoto صرف پیداوار کے لئے تیار مین نیٹ ورک کی سرگرمیوں کے لیے۔ دونوں نیٹ ورکس میں XOR:

- Taira عوامی نل سے ٹیسٹ نیٹ ورک XOR استعمال کرتا ہے۔
- Minamoto حقیقی XOR کا استعمال کرتا ہے۔ کوئی Minamoto نل نہیں ہے۔

## تعمیر کار کا راستہ {#builder-path}

|قدم |Taira ٹیسٹ نیٹ |Minamoto مینٹ |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|نیٹ ورک کی حالت پڑھنا شروع کریں |سوالات `/status` بغیر چابیاں |سوالات `/status` بغیر چابیاں |
|ڈیٹا اسپیس منتخب کریں |عوامی استعمال کریں `universal` جب تک کہ آپ کی ایپ کو ایک منظم لین کی ضرورت نہ ہو |صرف مین نیٹ کی منظوری کے بعد ایک ہی ڈیٹا اسپیس کا استعمال کریں |
|فیس اثاثہ حاصل کریں |عوامی Taira نل کا استعمال کریں |XOR وصول کریں ایک فنڈ شدہ Minamoto اکاؤنٹ یا منظور شدہ خزانہ کے بہاؤ سے |
|ٹیسٹ لکھتا ہے |نل سے مالی اعانت حاصل کرنے والی جانچ کا استعمال کریں XOR |ٹیسٹ ٹولنگ کا استعمال نہ کریں؛ لکھتا ہے حقیقی خرچ XOR |
|فروغ دینا |منطق، نگرانی اور دستخط ہینڈلنگ کو دوبارہ کوشش کریں |الگ الگ چابیاں، فنڈنگ اور ریلیز کنٹرول استعمال کریں |

عملی بہاؤ یہ ہے:

1. کلائنٹ کو Taira کے خلاف بنائیں اور عوامی `universal` ڈیٹا اسپیس استعمال کریں۔
2. ایک دستخط شامل کریں اور اسے Taira نل کے ساتھ فنڈ دیں۔
3. Taira کے خلاف آپ کی ایپ منطق کا استعمال کریں جب تک کہ ناکامی بورنگ اور مشاہدہ نہیں ہوتی۔
4. ایک علیحدہ Minamoto دستخط کنندہ بنائیں، اسے اصلی XOR کے ساتھ فنڈ کریں، اور صرف وہی ثابت شدہ آپریشنز کو مین نیٹ پر منتقل کریں۔

## ۱۔ سمجھیں کہ آپ کیا کر رہے ہیں {#_1-understand-what-you-are-setting-up}

SORA Nexus میں ، ڈیٹا اسپیس نیٹ ورک لین اور روٹنگ کیٹلاگ کا حصہ ہے۔ ایک کلائنٹ صرف `client.toml` کو تبدیل کرکے نیا عوامی ڈیٹا اسپیس نہیں بناتا ہے۔ کلائنٹ سیٹ اپ دو چیزیں کرتا ہے: -

1. کلائنٹ کو دائیں Torii اختتامی نقطہ نظر پر اشارہ کرتا ہے
2. اپنے کینونیکل اکاؤنٹ کے لئے ڈومین اور ڈیٹا اسپیس روٹنگ سیاق و سباق کا انتخاب کرتا ہے۔

`AccountId` ہمیشہ کینونیکل اور ڈومینلیس ہے۔ `client.toml` میں `[account].domain` قدر روٹنگ اور عرفی سیاق و سباق فراہم کرتی ہے؛ یہ اکاؤنٹ کی شناخت کا حصہ نہیں بنتا ہے۔ زیادہ تر ایپلی کیشنز کے ل the ، عوامی `universal` ڈیٹا اسپیس سے شروع کریں۔ ڈومین سیاق و بہار `domain.dataspace` فارم استعمال کرتا ہے ، مثال کے طور پر:

```text
wonderland.universal
```

اگر آپ کو نئی تنظیمی ڈیٹا اسپیس کی ضرورت ہو تو ، کسی عام کلائنٹ اکاؤنٹ سے اس کی رجسٹریشن کرنے کی کوشش کرنے کے بجائے ایک کیٹلاگ اور روٹنگ تجویز تیار کریں۔ ذیل میں [ نیا ڈیٹا اسپیس فراہم کریں ](#_8-provision-a-new-dataspace) دیکھیں.

## پبلک Torii اختتامی نقطہ چیک کریں۔ {#_2-check-the-public-torii-endpoint}

دستخط کرنے سے پہلے چیک کریں کہ ہدف کے اختتامی نقطہ زندہ ہے.

Taira کے لئے:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Minamoto کے لئے:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

نوڈ کے ذریعہ ظاہر کردہ ڈیٹا اسپیس اور لین ویو کی جانچ پڑتال کریں:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

مین نیٹ کے لئے `https://minamoto.sora.org/status` کے ساتھ ایک ہی کمانڈ کا استعمال کریں۔

## ایجنٹوں کے لیے Taira MCP {#taira-mcp-for-agents}

Taira ایجنٹ کے رن ٹائمز کے لئے Torii - مقامی ماڈل کنٹینسٹ پروٹوکول (MCP) پل کو بھی بے نقاب کرتا ہے۔ اسے استعمال کریں جب کسی ایجنٹ کو براہ راست ٹیسٹ نیٹ کی پڑھنے ، اسکرپٹ تشخیص ، یا پہلے اپنی مرضی کے مطابق Torii کلائنٹ بنانے کے بغیر سختی سے جائزہ لینے والے لکھنے کے rehearsals کی ضرورت ہو.

|ترتیب |قیمت |
| --- | --- |
|MCP اختتامی نقطہ |`https://taira.sora.org/v1/mcp` |
|نیٹ ورک کی جڑ |`https://taira.sora.org` |
|مطلوبہ استعمال |Taira ٹیسٹنیٹ پڑھتا ہے اور نل کی طرف سے فنڈ لکھنے کے rehearsals |
|پیداوار کا مساوی |اس اندراج کو Minamoto پر اشارہ نہ کریں جب تک کہ مرکزی نیٹ ورک MCP کے اختتام پوائنٹ اور ریلیز کنٹرول واضح طور پر منظور نہ ہوں |

دستخط کے مواد کو شامل کرنے سے پہلے پل میٹا ڈیٹا چیک کریں:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

ایجنٹ رن ٹائم میں URL کو صارف مقامی MCP سرور کے طور پر ترتیب دیں۔ اس دستاویزات ریپو یا ایپلی کیشن ریپو میں ایجنٹ MCP تشکیل ، API ٹوکن ، آگے بڑھائے گئے مصنف ہیڈرز ، `authority` ، یا `private_key` اقدار کا پابند نہ کریں۔

ایجنٹ فوری قواعد جو Taira کے ساتھ اچھی طرح کام کرتے ہیں:

- ان کو کال کرنے سے پہلے MCP سرور سے ٹولز دریافت کریں؛ اگر سرور `listChanged` رپورٹ کرتا ہے تو دوبارہ تلاش کریں۔
- خام `torii.` ٹولز پر کوریٹڈ `iroha.` ٹولز کو ترجیح دیں۔
- صرف پڑھنا شروع کریں: لکھنے کی تجویز پیش کرنے سے پہلے حیثیت ، اکاؤنٹس ، اثاثوں ، عرفات ، بلاکس ، گورننس اسٹیٹ ، اور ٹرانزیکشن اسٹیٹ کا معائنہ کریں۔
- لائیو ٹیسٹ نیٹ کی تبدیلیوں سے پہلے انسانی ہدایات کی ضرورت ہے۔ پہلے سے دستخط شدہ ٹرانزیکشن لفافوں کے لئے ، `iroha.transactions.submit_and_wait` کا استعمال کریں تاکہ ایجنٹ صرف جمع کروانے کے بجائے نتیجہ کا انتظار کرے۔
- ایجنٹ کے ردعمل میں ٹرانزیکشن ہیشز، حتمی حیثیت اور سرور کی توثیق کی غلطیوں کا خلاصہ کریں۔

### ایجنٹوں کے ساتھ ترقیاتی کام کا بہاؤ {#development-workflow-with-agents}

Iroha کلائنٹس ، ٹرانزیکشن بلڈرز ، تشخیصی اسکرپٹ ، اور ٹیسٹ نیٹ رن بکس کے لئے ایجنٹوں کو ترقیاتی معاونین کے طور پر استعمال کریں۔ ایجنٹ کی اتھارٹی کو محدود رکھیں: یہ کوڈ کا معائنہ کر سکتا ہے، Taira ریاست پڑھ سکتا ہے، تبدیلیوں کی تجویز پیش کرسکتا ہے، اور مقامی ٹیسٹ چلا سکتا ہے، لیکن اس کو زندہ نیٹ ورک کو تبدیل نہیں کرنا چاہئے جب تک کہ انسان نے عین عمل کی منظوری نہ دی ہو۔

ایک عملی کام کا بہاؤ یہ ہے:

1. ایجنٹ سے متعلقہ دستاویزات، SDK کوڈ، CLI کمانڈ، یا MCP ٹول اسکیم کا معائنہ کرنے کے لئے پوچھیں اس سے پہلے کہ وہ کوڈ لکھے.
2. ایجنٹ کو سب سے پہلے سب سے چھوٹا کلائنٹ راستہ لکھنے دیں: حیثیت کی جانچ پڑتال، اکاؤنٹ تلاش، عرفی قرارداد، یا بیلنس تلاش.
3. Taira کے خلاف صرف پڑھنے والے کالز کام کرنے کے بعد ہی لین دین کی تعمیر کا کوڈ شامل کریں۔
4. لائیو نیٹ ورک کے ٹیسٹ کو opt-in رکھیں، مثال کے طور پر `TAIRA_LIVE=1` کے پیچھے، تاکہ ایک عام یونٹ ٹیسٹ رن کبھی بھی ٹیسٹ نیٹ فنڈز خرچ نہیں کرتا یا نیٹ ورک کی دستیابی پر منحصر ہوتا ہے.
5. ایجنٹ کو کسی بھی ٹرانزیکشن جمع کروانے سے پہلے نیٹ ورک روٹ، چین، اتھارٹی اکاؤنٹ، ہدایات کا خلاصہ، فیس اثاثہ، اور متوقع حالت کی تبدیلی کی اطلاع دینا ضروری ہے.
6. CI یا مین نیٹ ورک ورک فلوز میں فروغ دینے سے پہلے خفیہ ہینڈلنگ، دوبارہ کوشش کرنے کے رویے، بے قابویت اور رد عمل کے لئے پیدا کردہ کوڈ کا جائزہ لیں. .

ترقی کے لئے مفید صرف پڑھنے والے MCP ٹولز میں اکاؤنٹ اثاثوں کی تلاش ، عرفی حل ، بلاک سرچ ، لین دین کی تلاش ، لین دین فہرستیں اور پائپ لائن کی حیثیت چیک شامل ہیں۔ کسی بھی دستخط شدہ پائل لوڈ کو بھیجنے سے پہلے اعتماد پیدا کرنے کے ل use ان کا استعمال کریں۔

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### ایجنٹوں کے ذریعے لین دین کا ورک فلو {#transaction-workflow-through-agents}

MCP پل ایک دستخط شدہ Iroha ٹرانزیکشن جمع کروا سکتا ہے ، لیکن یہ معمول کے لین دین کی ضروریات کو ختم نہیں کرتا ہے۔ ایک لین دین کو ابھی بھی صحیح اتھارٹی ، اجازتوں ، فیس فنڈنگ ، سلسلہ ID ، میٹا ڈیٹا اور دستخط کی ضرورت ہے۔

خام Iroha ٹرانزیکشنز کے لئے، ٹرانزیکtion envelope کو پہلے SDK یا CLI کے ساتھ بنائیں اور اس پر دستخط کریں، پھر ایجنٹ کو صرف `body_base64` کے طور پر انکوڈ کردہ کینونیکل دستخط شدہ ٹرانزیکشنل بائٹس دیں. ایجنٹ `iroha.transactions.submit_and_wait` کے ساتھ لفافہ جمع کروا سکتا ہے، یا `iroha.transactions.submit` کے ساتھ جمع کروا سکتے ہیں اور `iroha.transactions.wait` کے ساتھ سروے کرسکتے ہیں۔

ایجنٹ پرامپٹ میں نجی چابیاں پیسٹ نہ کریں۔ اگر کسی ایجنٹ کو ٹرانزیکشن بنانے کی ضرورت ہو تو ، اسے مقامی کوڈ کی طرف اشارہ کریں جو صارف کے رن ٹائم ماحول ، کلیدی چین ، ہارڈ ویئر دستخط کرنے والے یا نظرانداز شدہ ٹیسٹ نیٹ کنفیگریشن فائل سے راز بھری ہوئی ہو۔ ایجنٹ کو کبھی بھی اہم مواد کو مارک ڈاؤن میں لکھنا نہیں چاہئے، فکسچر، logs، یا commits.

ٹرانزیکشن جمع کروانے سے پہلے، ایجنٹ کو ایک مختصر ٹرانزیکtion پلان تیار کرنے کے لئے کہیں:

- `network`: Taira ٹیسٹ نیٹ ورک جڑ اور سلسلہ ID
- `authority`: اکاؤنٹ جس پر دستخط کیے جائیں اور فیس ادا کی جائیں
- `instructions`: رجسٹر، مینٹ، برن، ٹرانسفر، میٹا ڈیٹا، اجازت یا معاہدہ کال کا خلاصہ۔
- `fee asset`: اثاثہ جو Taira سے چارج کیا جائے گا
- `preflight reads`: اکاؤنٹ، اثاثہ بیلنس، اجازت نامے، عرفی یا بلاک چیک پہلے ہی کئے گئے۔
- `expected result`: اسٹیٹ جو تصدیق کے بعد نظر آنا چاہئے
- `idempotency`: اگر ایک ہی درخواست کا دوبارہ جائزہ لیا جائے تو کیا ہوگا؟

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

Taira MCP کو عوامی ٹیسٹ نیٹ ورک کنٹرول سطح کے طور پر علاج کریں۔ Taira چابیاں ، ٹیسٹ نیٹ XOR ، نل اکاؤنٹس ، اور کینری دستخطات ایک بار میں استعمال کیے جاتے ہیں اور انہیں Minamoto چابیاں اور پیداوار ریلیز ورک فلو سے الگ رکھنا چاہئے۔

## کھلونے کی مثالیں جنہیں آپ اب آزما سکتے ہیں {#toy-examples-you-can-try-now}

یہ مثالیں صرف پڑھنے کے قابل ہیں جب تک کہ ذکر نہ کیا جائے۔ وہ آپ کی چابیاں پیدا کرنے سے پہلے کام کرتی ہیں۔ اور دونوں عوامی نیٹ ورکس پر چلنے میں محفوظ ہیں۔

Taira ٹیسٹ نیٹ اور Minamoto مین نیٹ کی صحت کا موازنہ کریں:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Taira کے ذریعہ پبلک ڈیٹا اسپیس لینز کی فہرست بنائیں:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Minamoto کے خلاف ایک ہی کمانڈ چلائیں جب آپ کو مین نیٹ ویو کی ضرورت ہو:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

ڈیش بورڈ، بوٹ، یا تعیناتی چیک کے لئے ایک چھوٹا سا Node.js حیثیت کی تحقیقات بنائیں:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
EOF
```

لکھنے کے لئے پہلا کھیل Taira نل کا دعوی ہونا چاہئے۔ اس میں ٹیسٹ نیٹ XOR استعمال ہوتا ہے اور اسے کبھی بھی Minamoto پر اشارہ نہیں کیا جانا چاہئے۔

## ایک Taira کلائنٹ ترتیب بنائیں۔ {#_3-create-a-taira-client-config}

اگر آپ کے پاس پہلے سے ہی کوئی ہے تو ایک کلیدی جوڑا پیدا کریں:

```bash
kagami keys --algorithm ed25519 --json
```

`taira.client.toml` بنائیں:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

سب سے اوپر کی سطح `chain` کیا یہ درست ہے Taira لین دین کا سلسلہ ID. انگریزی میں `[account].profile = "taira"` سیٹنگ آزادانہ طور پر منتخب کرتا ہے Taira I105 زنجیروں کا فرقہ. ID اکاؤنٹ پروفائل کا انتخاب نہیں کرتا۔

صرف پڑھنے کے لئے چیک کریں:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

لکھنے کے ٹیسٹ سے پہلے عوامی Taira تشخیص کریں:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Taira اکاؤنٹ کو آپ کی فیس ادا کرنے والی تحریریں چلانے سے پہلے نلکے کے ذریعے فنڈ کریں۔ نلکی کا براہ راست بہاؤ [Get Testnet XOR پر ہے Taira](#_4-get-testnet-xor-on-taira).

نل کے دعوے کو قبول کرنے اور اکاؤنٹ کی مالی اعانت حاصل کرنے کے بعد، Taira کینری ایک اختیاری تحریری دھواں ٹیسٹ ہے:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

کینری ایک دستخط شدہ پینگ جمع کراتا ہے ، تصدیق کا انتظار کرتا ہے ، اور جب `--write-config` فراہم کیا جاتا ہے تو رن ٹائم سائنگر ترتیب لکھتا ہے۔ Taira ایک عوامی ٹیسٹ نیٹ ورک ہے ، لہذا قطار کی سیر ہونے سے یہاں تک کہ نل خود کام کرتے وقت بھی دستخط شدہ پنگ ناکام ہوجاتا ہے۔ اگر `taira doctor` ایک بھرپور قطار کی اطلاع دیتا ہے یا کینری `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` لوٹاتا ہے، تو انتظار کریں اور اسے کلائنٹ ترتیب غلطی کے طور پر علاج کرنے سے پہلے دوبارہ کوشش کریں.

بے نگرانی دھواں ٹیسٹ کے لئے، کینری کو ایک محدود دوبارہ آزمائشی لوپ میں لفافہ کریں:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

اگر `iroha taira doctor` سخت ناکامی دکھاتا ہے تو دوبارہ کوشش کرنا بند کردیں۔ قطار کی سیر اور فیس داخل کرنے سے انکار عوامی ٹیسٹ نیٹ ورک کے عارضی حالات ہیں؛ DNS ، TLS ، یا `status = "fail"` تشخیص نہیں ہیں۔

## ایک SORA Nexus اکاؤنٹ بنائیں ID {#generate-a-sora-nexus-account-id}

SORA Nexus اکاؤنٹ ID اکاؤنٹ پبلک کلید اور ہدف نیٹ ورک پریفیکس سے اخذ کردہ ایک کینیکل I105 ایڈریس ہے۔ یہ کلائنٹ میں `[account].domain` قدر نہیں ہے TOML. ایک ہی عوامی کلید کو IDs پر مختلف Taira اور Minamoto کوڈ کرتا ہے، اور پیداوار صارفین کو Minamoto کے لئے علیحدہ کلیدی جوڑا پیدا کرنا چاہئے.

ایڈ25519 کلید جو اکاؤنٹ کو کنٹرول کرے گا پیدا یا لوڈ کریں:

```bash
kagami keys --algorithm ed25519 --json
```

عوامی کلید کو ایک Taira اکاؤنٹ ID میں تبدیل کریں:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

ایک Minamoto عوامی کلید کو مین نیٹ پریفیکس کے ساتھ تبدیل کریں۔

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

جب بھی Nexus API یا CLI کمانڈ کینیکل اکاؤنٹ ID کے لئے پوچھتا ہے تو اس سے حاصل ہونے والا اکاؤنٹ ID استعمال کریں، مثال کے طور پر Taira نل `account_id` ، بیلنس سوالات، سخت اکاؤنٹ فیلڈز، یا عرف پابندیاں۔ اپنے کلائنٹ کی ترتیب میں مماثل نجی کلید رکھیں، اور `[account].profile = "taira"` یا `[account].profile = "minamoto"` کے ساتھ ایک ہی عوامی نیٹ ورک کا انتخاب کریں۔

ID پیدا کرنے سے خود میں فنڈ آن لائن اکاؤنٹ نہیں بنتا ہے۔ Taira پر ، نل ٹیسٹ نیٹ لکھنے کے لئے اکاؤنٹ تشکیل دے سکتا ہے اور اسے فنڈ کرسکتا ہے۔ Minamoto پر ، ایک منظور شدہ مین نیٹ بورڈنگ یا خزانہ کے بہاؤ کا استعمال کریں۔

### کلیدی ذخیرہ اور بیک اپ {#key-storage-and-backup}

اکاؤنٹ ID اور عوامی کلید کا اشتراک کیا جا سکتا ہے۔ مماثل نجی کلید ، پاسفرز ، بیج اور بازیافت کے مواد کو خفیہ سمجھا جانا چاہئے۔

SORA Nexus اکاؤنٹس کے لئے ان طریقوں کا استعمال کریں:

- خفیہ چابیاں کو خفیہ کردہ پاس ورڈ مینیجر ، ہارڈ ویئر کی حمایت یافتہ کیسٹ اسٹور یا سرشار دستخط سروس میں ذخیرہ کریں۔ سورس کنٹرول کے ل keys چابیاں نہ کریں اور نہ ہی پروڈکشن چابیاں شیل ہسٹری ، لاگ ، چیٹ ، ٹکٹ ، یا غیر خفیہ شدہ بیک اپ میں رکھیں.
- ہر خفیہ خانے یا پروڈکشن دستخط کے لئے ایک منفرد ہائی اینٹروپی پاس ورڈ استعمال کریں۔ پاس ورڈ مینیجر یا تقسیم شدہ اسٹوریج کے عمل میں پاس ورڈز کو ذخیرہ کریں ، نہ کہ خفیہ کردہ نجی کلید کے ساتھ ایک ہی فائل یا بیک اپ بنڈل۔
- Taira اور Minamoto چابیاں الگ رکھیں۔ Taira چابیاں ایک بار استعمال ہونے والے ٹیسٹ نیٹ مواد کے طور پر اور Minamoto چابیاں پیداوار فنڈز اتھارٹی کے طور پر سنبھالیں۔
- نجی کلید ، عوامی کلید ، اکاؤنٹ ID ، اکاؤنٹ پروفائل ، اور کسی بھی اکاؤنٹ کی بازیابی یا دستخط کرنے والے کو بحال کرنے کے لئے درکار اسٹوری نوٹس کا بیک اپ کریں۔ نیٹ ورک کے تناظر کے بغیر ایک نجی کلید بازیافت کے دوران غلط استعمال کرنا آسان ہے۔
- پیداوار کے دستخط کاروں کے لئے کم از کم ایک خفیہ کردہ آف لائن بیک اپ اور ایک جغرافیائی طور پر الگ الگ خفیہ شدہ بیک اپ رکھیں۔ بیک اپ پر منحصر ہونے سے پہلے صرف پڑھنے والے چھوٹے آپریشن کے ساتھ بازیابی کا تجربہ کریں۔
- اگر نجی کلید، پاس ورڈ، بیک اپ میڈیا یا دستخط کرنے والے میزبان کو بے نقاب کیا گیا ہو تو دستخط کریں یا اس کی جگہ لیں.

مزید تفصیلات کے لئے، دیکھیں [ اسٹوریج کریپٹوگرافک چابیاں ](/ur/guide/security/storing-cryptographic-keys.md) اور [ پاس ورڈ سیکیورٹی ](/ur/guide/security/password-security.md).

## ٹیسٹ نیٹ XOR کو Taira پر حاصل کریں۔ {#_4-get-testnet-xor-on-taira}

براہ راست عوامی نل کا استعمال کریں. بہاؤ:

1. ایک دستخط کنندہ پیدا کریں یا لوڈ کریں اور اس کا کینونیکل Taira اکاؤنٹ ID حساب لگائیں۔
2. موجودہ نل پزل لے لو.
3. جب `difficulty_bits` `0` سے زیادہ ہو تو پزل کو حل کریں۔
4. نل کی درخواست جمع کروائیں۔
5. فیس ادا کرنے والی تحریریں بھیجنے سے پہلے اکاؤنٹ یا اثاثے کا توازن ظاہر ہونے کا انتظار کریں۔

ایک عوامی کلید کو Taira I105 اکاؤنٹ ID میں تبدیل کریں جس کی توقع نل سے ہوتی ہے:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

پازل لے لو:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

نل ایک عوامی ٹیسٹ نیٹ سروس ہے۔ اگر پہیلی یا دعویٰ اختتامی نقطہ `502` ، ٹائم آؤٹ ، یا گیٹ وے کی سطح کی کسی اور غلطی کو واپس کرتا ہے تو ، اپنی چابیاں یا کلائنٹ ترتیب تبدیل کرنے سے پہلے انتظار کریں اور دوبارہ کوشش کریں۔

جواب اس طرح کا ہے:

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

جب `difficulty_bits` `0` ہو تو، صرف اکاؤنٹ ID جمع کرو:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

جب `difficulty_bits` `0` سے زیادہ ہو تو، پہیلی کو حل کریں اور لنگر کی اونچائی کے علاوہ nonce شامل کریں:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

پہیلی الگورتھم ہے:

1. چیلنج کو SHA-256 کے طور پر تعمیر کریں:
   - `iroha:accounts:faucet:pow:v2` کے بائٹس
   - UTF-8 اکاؤنٹ ID
   - `anchor_height` کے طور پر big-endian `u64`
   - `anchor_block_hash_hex` بائٹس کے طور پر ڈیکوڈ
   - `challenge_salt_hex` جب موجود ہو تو بائٹس کے طور پر ڈیکوڈ کریں
2. `u64` nonces کوڈ big-endian 8 بائٹ اقدار کے طور پر کوشش کریں.
3. ہر نونس کے لئے، اسکرپٹ کے ساتھ چلائیں:
   - پاس ورڈ: 8 بائٹ نونس
   - نمک: 32 بائٹ چیلنج
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - آؤٹ پٹ لمبائی: 32 بائٹس
4. جیتنے والا نونس پہلا ڈائجسٹ ہے جس میں کم از کم `difficulty_bits` صفر بٹس سے آگے ہے۔

نل جواب میں فنڈ شدہ اثاثہ اور قطار ٹرانزیکشن ہیش شامل ہیں:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "asset_id": "...",
  "amount": "25000",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

فی الحال جواب HTTP `202 Accepted` کے ساتھ واپس کیا جاتا ہے۔ اوپر کی اثاثہ تعریف ID عوامی نل سے مالی اعانت حاصل کرنے والے Taira فیس اثاثہ ہے. نل نے درخواست کو قبول کرلیا ہے جب وہ `tx_hash_hex` اور `status: "QUEUED"` واپس کرتا ہے۔

پھر اپنی فیس ادا کرنے والی ٹرانزیکشنز جمع کروانے سے پہلے فنڈ شدہ اثاثے کے لئے سروے کریں:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

اگر نل کا دعوی قبول کیا گیا تھا لیکن اکاؤنٹ یا اثاثہ ابھی تک نظر نہیں آتا ہے تو ، ٹرانزیکشن اب بھی عوامی ٹیسٹ نیٹ ورک قطار پروسیسنگ کے پیچھے ہے۔ بھیجنے سے پہلے پڑھنے اور دوبارہ کوشش کریں۔

کام کرنے کے لئے تیار براہ راست API چیک کے ل this ، اس کو `taira_faucet_claim.py` کے طور پر محفوظ کریں اور Taira I105 اکاؤنٹ ID میں منتقل کریں۔:

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

with urllib.request.urlopen(f"{root}/v1/accounts/faucet/puzzle") as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

نل صرف Taira ٹیسٹ نیٹ فنڈز کے لئے ہے۔ XOR ٹسٹ نیٹ ، نل اکاؤنٹس ، یا Taira کینری دستخطوں کا استعمال نہ کریں Minamoto بہاؤ میں۔

## ایک Minamoto کلائنٹ ترتیب بنائیں. {#_5-create-a-minamoto-client-config}

Minamoto کے لئے علیحدہ کلیدی جوڑی کا استعمال کریں۔ مین نیٹ ورک کے لیے Taira کیلیوں کو دوبارہ استعمال نہ کریں.

`minamoto.client.toml` بنائیں:

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

سب سے اوپر کی سطح `chain` موجودہ ہے Nexus مین نیٹ چین ID. `[account].profile = "minamoto"` منتخب کرتا ہے Minamoto I105 سلسلہ امتیاز؛ اختتامی نقطہ میزبان نام اور سلسلہ ID اس کو ضمنی طور پر منتخب نہ کریں۔

ایک Minamoto عوامی کلید کو اس کے کینیکل I105 اکاؤنٹ ID میں تبدیل کریں جس میں مین نیٹ پریفیکس شامل ہو:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

اکاؤنٹ کو مین نیٹ ورک آن بورڈنگ یا گورننس فلو کے ذریعے ذخیرہ کرنے اور فنڈ دینے تک صرف پڑھنے کی طرف سے چیک کریں:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Taira نل یا لکھنے کی مدد کرنے والے کو Minamoto کے خلاف نہ چلائیں۔

## XOR کے ساتھ ایک Minamoto اکاؤنٹ کو فنڈ کریں۔ {#_6-fund-a-minamoto-account-with-xor}

Minamoto فیسوں کو پیداوار XOR کے ساتھ ادا کیا جاتا ہے، اور Minamoto میں کوئی عوامی نل نہیں ہے. ایک منظور شدہ مین نیٹ بورڈنگ یا خزانہ کی منتقلی کے ذریعے تشکیل کردہ اکاؤنٹ کو فنڈ کریں، یا موجودہ مالی اعانت یافتہ Minamoto اکاؤنٹ سے XOR وصول کریں۔

تحریر جمع کروانے سے پہلے صرف پڑھنے والے چیک کے ساتھ کینونیکل اکاؤنٹ ID اور فنڈنگ کی تصدیق کریں۔ Minamoto XOR کو پروڈکشن فنڈز کے طور پر علاج کریں: سب سے پہلے Taira پر ایک ہی آپریشن کا تجربہ کریں ، پیداوار کی چابیاں الگ رکھیں ، اور فرض نہ کریں کہ مین نیٹ ٹرانزیکشن ری سیٹ کیا جاسکتا ہے.

Taira XOR Minamoto فیس ادا نہیں کر سکتا۔ ٹیسٹ نیٹ بیلنس اور نلوں کے دعوے Minamoto پر منتقل نہیں ہوتے ہیں۔

## 7۔ ایک موجودہ ڈیٹا اسپیس میں کام کریں {#_7-work-inside-an-existing-dataspace}

ڈیٹا اسپیس کے اندر رہنے والے لیجر اشیاء کے لئے مکمل طور پر اہل ڈومین ناموں کا استعمال کریں۔ مثال کے طور پر ، عوامی ڈیٹا اسپیس میں پروجیکٹ ڈومین کو استعمال کرنا چاہئے:

```text
apps.universal
```

جب آپ کے اکاؤنٹ میں مطلوبہ اجازتیں ہوں تو ، ڈومین کے لئے خفیہ مفت `AliasSetupPlanRequestV1` ارادہ بنائیں اور اعلاناتی منصوبہ ساز کا استعمال کریں:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto کے لئے ، ایک علیحدہ مین نیٹٹ نیت اور منصوبہ تیار کریں اور اس کی منظوری دیں۔ منصوبے ان کے سلسلے ، اتھارٹی ، زندہ ریاست لنگر ، اور آخری تاریخ سے پابند ہیں ، لہذا Taira منصوبے کو فروغ یا دوبارہ نہیں دیا جاسکتا:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

اکاؤنٹ کے ناموں میں ڈیٹا اسپیس کا ایک ہی ضمیمہ استعمال کیا جاتا ہے:

```text
alice@apps.universal
alice@universal
```

سخت اکاؤنٹ فیلڈز اب بھی کینونیکل I105 اکاؤنٹ IDs کا استعمال کرتے ہیں۔ عرفی ناموں کو انسانی طور پر پڑھنے کے قابل پابندیاں سمجھیں جو کینونیکل اکاؤنٹ IDs میں حل ہوتی ہیں۔

## 8۔ نیا ڈیٹا اسپیس فراہم کرنا {#_8-provision-a-new-dataspace}

ایک نیا ڈیٹا اسپیس آپریٹر اور گورننس کی تبدیلی ہے۔ عوامی Torii اختتامی نقطہ ٹریفک کو تشکیل شدہ ڈیٹا اسپیس پر رائیٹ کرسکتا ہے ، لیکن یہ نامعلوم ڈیٹا اسپیس عرفی ناموں کو مسترد کرے گا۔

تبدیلی تیار کرنے سے پہلے، موجودہ لائیو کیٹلاگ پر قبضہ کریں:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

ایک آپریٹر اکاؤنٹ کے لئے، لین مینوفیسٹ موقف بھی چیک کریں:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

ایک نئے عرفی نام کو فروغ نہ دیں جب تک کہ لین ID ، ڈیٹا اسپیس ID ، تصدیق کنندہ سیٹ ، خرابی کی رواداری ، مانیٹر ، روٹنگ کے قواعد اور آپریشنل مالک کا مل کر جائزہ نہیں لیا گیا ہے۔ مطلوبہ اجازتوں کے ساتھ ایک عام صارف اکاؤنٹ موجودہ ڈیٹا اسپیس کے اندر ایک ڈومین حاصل کرسکتا ہے اور اس کا SNS کرایہ نامہ منصوبہ ساز کے ذریعے؛ یہ محفوظ طریقے سے نیا عوامی ڈیٹا اسپیس شامل نہیں کرسکتا ہے۔

ایک نجی یا تنظیمی ڈیٹا اسپیس کے لئے، مندرجہ ذیل کیٹلاگ تبدیلیاں تیار کریں:

- ایک منفرد ڈیٹا اسپیس عرفی اور عددی `id`
- ایک مماثل لین اندراج یا ایک موجودہ لین تفویض
- ڈیٹا اسپیس `fault_tolerance`
- ان ہدایات یا اکاؤنٹس کے دائرہ کار کے لئے روٹنگ قواعد جو وہاں اترنے چاہئیں
- ایک خلائی ڈائرکٹری مینفیس یا مساوی رول آؤٹ ثبوت، جب ڈیٹا اسپیس UAID کی صلاحیتوں کو بے نقاب کرتا ہے
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
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

آپریٹر کی قبولیت میں درج ذیل دروازے شامل ہوں گے:

- `irohad --sora --config <config.toml> --trace-config` حل شدہ نوڈ ترتیب کو منتقل کرتا ہے
- جنریٹڈ یا نظرثانی شدہ دستاویز کو ہیش اور دستخطوں کے ساتھ محفوظ کیا جاتا ہے۔
- کسی بھی Minamoto پروموشن سے پہلے دھواں کے ٹیسٹ Taira پر گزرنا
- تبدیلی کے بعد کیٹلاگ `/status` میں منصوبہ بندی شدہ لین اور ڈیٹا اسپیس دکھایا گیا ہے۔
- `iroha app nexus lane-report --summary` مطلوبہ دستاویزات کی کمی کے بارے میں اطلاع نہیں دیتا

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

ایک ہی ڈیٹا اسپیس کو Minamoto تک صرف اس کے بعد فروغ دینا کہ Taira کی تعیناتی ، دھواں ٹیسٹ ، نگرانی اور گورننس ثبوت مکمل ہوجائیں۔

## متعلقہ صفحات {#related-pages}

- [Iroha 3](/ur/get-started/install-iroha.md) انسٹال کریں
- [Iroha 3 کے ذریعے CLI](/ur/get-started/operate-iroha-via-cli.md) پر کام کریں
- [نجی ڈیٹا اسپیس کے لئے سپانسر فیس](/ur/get-started/private-dataspace-fee-sponsor.md)
- [Torii اختتام پوائنٹس](/ur/reference/torii-endpoints.md)
- [پیدائش کا حوالہ](/ur/reference/genesis.md)
