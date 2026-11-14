---
translation_locale: ur
translation_source: /blockchain/events.md
translation_source_hash: 2777cbe4e72a50c4790e50b59c3e695feb5814314cc9afccdfd994f6409c195e
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# واقعات {#events}

واقعات جاری کیے جاتے ہیں جب بلاکچین کے اندر کچھ چیزیں ہوتی ہیں ، مثال کے طور پر نیا اکاؤنٹ بنایا جاتا ہے یا بلاک کیا جاتا ہے۔ مختلف قسم کے واقعات ہوتے ہیں:

- پائپ لائن کے واقعات
- ڈیٹا کے واقعات
- وقت کے واقعات
- عملدرآمد کے واقعات کو متحرک کریں

## پائپ لائن کے واقعات {#pipeline-events}

پائپ لائن کے واقعات اس وقت خارج ہوتے ہیں جب لین دین اور بلاکس پائپ لائن سے گزرتے ہیں۔ لین دین کا واقعہ لین دین کا ہیش، بلاک کی اونچائی، لین اور ڈیٹا اسپیس کی شناختیں، اور ایک حالت رکھتا ہے: `Queued`، `Expired`، `Approved`، یا مسترد ہونے کی وجہ کے ساتھ `Rejected`۔ بلاک کا واقعہ بلاک ہیڈر اور ایک حالت رکھتا ہے: `Created`، `Approved`، وجہ کے ساتھ `Rejected`، `Committed`، یا `Applied`۔

### Taira پر آزمائیں {#try-it-on-taira}

چیک کریں کہ عوامی پائپ لائن ایونٹ سٹریم نصب ہے:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

ایک فوری شاٹ کے لئے آپ کو ایک سلسلہ کھولنے کے بغیر چیک کر سکتے ہیں، حالیہ explorer لین دین پڑھیں:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?limit=5' \
  | jq '{next_cursor, txs: [.items[] | {hash, block, status, executable}]}'
```

جب آپ کو براہ راست واقعات کی ضرورت ہو تو ٹرمینل میں SSE روٹ کھولیں:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

اگر ایونٹ اسٹریم کھلی ہونے کے دوران کوئی ٹرانزیکشن پیش نہیں کی جاتی تو راستہ درست ہونے کے باوجود کمانڈ خاموش رہ سکتی ہے۔

## ڈیٹا واقعات {#data-events}

ڈیٹا کے واقعات اس وقت جاری ہوتے ہیں جب لیجر کے ڈیٹا سے متعلق کوئی تبدیلی ہو، مثلاً پیئرز، ڈومینز، اکاؤنٹس، اثاثے، اثاثوں کی تعریفیں، NFTs، ٹرگرز، کردار، آن چین ترتیب، ایگزیکیوٹر کی حالت، ثبوت، خفیہ اثاثے، بریجز یا SORA Nexus سے مخصوص آبجیکٹس میں۔ اس قسم کے واقعات [ڈیٹا ایونٹ فلٹرز](./filters.md#data-event-filters) میں استعمال ہوتے ہیں۔

## وقت کے واقعات {#time-events}

وقت کے واقعات کو اس وقت جاری کیا جاتا ہے جب دنیا کی حالت کا نظارہ [ ٹائم ٹرگرز ](./triggers.md#time-triggers) کو سنبھالنے کے لئے تیار ہوتا ہے۔

## ٹرگر عمل درآمد کے واقعات {#trigger-execution-events}

ٹرگر عملدرآمد کے واقعات جاری کیے جاتے ہیں جب [`ExecuteTrigger`](./instructions.md#executetrigger) ہدایات پر عمل درآمد کیا جاتا ہے۔ ٹرگر تکمیل کے واقعات جاری کئے جاتے ہیں جب ایک ٹرگر کارروائی ختم ہوجاتی ہے۔
