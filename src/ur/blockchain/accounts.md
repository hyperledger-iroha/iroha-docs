---
translation_locale: ur
translation_source: /blockchain/accounts.md
translation_source_hash: adc98cbf1fcadae4415d03dcc262eb03f8c95b429527e403d230934ae2f3243c
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# اکاؤنٹس {#accounts}

اکاؤنٹ ایک بااختیار شناخت ہے جو لین دین پر دستخط کر سکتی ہے اور لیجر کی حالت کی مالک ہو سکتی ہے۔ موجودہ Iroha 3 ڈیٹا ماڈل میں `AccountId` کینونیکل اور ڈومین سے آزاد ہے: یہ اکاؤنٹ کے کنٹرولر سے اخذ ہوتا ہے اور [I105](/ur/reference/i105.md) کی کینونیکل صورت میں انکوڈ کیا جاتا ہے۔ انسانوں کے لیے قابلِ مطالعہ ڈومین اور ڈیٹا اسپیس کا سیاق الگ اکاؤنٹ عرفی ناموں کی وابستگیوں میں رکھا جاتا ہے۔

## ڈھانچہ {#structure}

ایک رجسٹرڈ `Account` میں شامل ہیں:

- `id`: کینونیکل `AccountId`
- `metadata`: تعمیری اکاؤنٹ میٹا ڈیٹا
- `label`: ایک اختیاری مستحکم عرف
- `uaid`: ایک اختیاری یونیورسل اکاؤنٹ ID جو SORA Nexus کے عمل میں استعمال ہوتا ہے
- `opaque_ids`: اکاؤنٹ کے UAID سے منسلک غیر شفاف شناخت کنندہ

اکاؤنٹ بنانے کے لئے استعمال ہونے والے لین دین کا payload `NewAccount` ہے۔ اس میں شناختی ، میٹا ڈیٹا ، لیبل ، UAID ، اور غیر شفاف ID فیلڈز شامل ہیں جو رجسٹرڈ اکاؤنٹ کے ذریعہ استعمال ہوتے ہیں۔

`uaid` کینونیکل `AccountId` کی تکمیل کرتا ہے، اس کی جگہ نہیں لیتا۔ اسے اس وقت استعمال کریں جب SORA Nexus کی خدمات کو مختلف ڈیٹا اسپیسز میں صارف یا ادارے کا مستقل شناختی حوالہ، رازداری محفوظ رکھنے والا اندراج، یا خدمت کی صلاحیت تلاش کرنے کی ضرورت ہو۔ رن ٹائم UAID اور اکاؤنٹ کا ایک بہ ایک اشاریہ رکھتا ہے، غیر شفاف شناخت کنندگان کو UAID کے ذریعے منسلک کرنا لازم کرتا ہے، اور مکرر یا متصادم غیر شفاف شناخت کنندگان مسترد کرتا ہے۔ SORA Nexus کی خدماتی تہہ کے عمل کے لیے [FHE اور UAID](/ur/blockchain/sora-nexus-services.md#fhe-and-uaid) دیکھیں۔

## اکاؤنٹ کنٹرولرز {#account-controllers}

کنٹرولر بیان کرتا ہے کہ اکاؤنٹ کس طرح کارروائیوں کی اجازت دیتا ہے۔ ڈیفالٹ کلائنٹ فلو ایک Ed25519 کلیدی جوڑی کا استعمال کرتا ہے ، لیکن ڈیٹا ماڈل بھی زیادہ بھرپور کنٹرولرز جیسے ملٹی دستخط پالیسی کنٹرولر کی حمایت کرتا ہے۔

کلائنٹ کی ترتیب دستخط کرنے والی اتھارٹی کو پیئر ترتیب سے الگ اسٹور کرتی ہے:

```toml
[account]
profile = "taira"
public_key = "ed0120..."
private_key_file = "/absolute/path/to/private.key"
```

موجودہ کلیدی فارمیٹس کے لئے [کلائنٹ ترتیب ](/ur/guide/configure/client-configuration.md) اور [کیج جنریشن ](/ur/guide/security/generating-cryptographic-keys.md) دیکھیں.

## Taira پر آزمائیں {#try-it-on-taira}

چند صحیفوں کی فہرست بنائیں IDs عوام سے Taira ٹیسٹ نیٹ:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

اکاؤنٹ اثاثوں کا معائنہ کرنے کے لئے، پہلی کال سے ایک اکاؤنٹ ID کو کاپی کریں اور اسے راستے میں ڈالنے سے پہلے URL کوڈ کریں۔ یہ Python ٹکڑا پہلے درج کردہ اکاؤنٹ کے لئے ایسا کرتا ہے:

```bash
python3 - <<'PY'
import json
import urllib.parse
import urllib.request

root = "https://taira.sora.org"
accounts = json.load(urllib.request.urlopen(f"{root}/v1/accounts?limit=1"))["items"]
account_id = accounts[0]["id"]
encoded = urllib.parse.quote(account_id, safe="")
assets = json.load(
    urllib.request.urlopen(f"{root}/v1/accounts/{encoded}/assets?limit=5")
)

print(json.dumps({"account_id": account_id, "assets": assets["items"]}, indent=2))
PY
```

یہ عوامی پڑھنے کی کارروائیاں ہیں۔ اکاؤنٹ بنانا یا تبدیل کرنا ایک دستخط شدہ لین دین ہے اور اس کے لیے [SORA Nexus ڈیٹا اسپیسز سے اتصال](/ur/get-started/sora-nexus-dataspaces.md) میں بیان کردہ، فوسیٹ سے فنڈ شدہ Taira سیٹ اپ درکار ہے۔

## رجسٹریشن اور اجازت {#registration-and-permissions}

اکاؤنٹس عام [`Register` اور `Unregister`](/ur/blockchain/instructions.md#un-register) ہدایات کے ساتھ رجسٹرڈ اور غیر رجسٹر شدہ ہیں۔ فعال رن ٹائم کی توثیق کرنے والا فیصلہ کرتا ہے کہ کون اکاؤنٹ تشکیل دے سکتا ہے اور کن اجازت ٹوکن یا کرداروں کی ضرورت ہے۔

رجسٹریشن کے بعد، ایک اکاؤنٹ:

- لین دین پر دستخط کریں
- ملکیت کے اثاثے
- اپنے ڈومینز
- رولز اور اجازت ٹوکن وصول کریں
- ذخیرہ شدہ میٹا ڈیٹا
- متعلقہ خصوصیات فعال ہونے پر عرفی نام، کلید کی تبدیلی، بازیابی اور SORA Nexus کی شناخت کے عمل میں حصہ لینا

## شناخت کے مسائل کو حل کرنا {#troubleshooting-identity-issues}

اگر کسی ٹرانزیکشن کو غیر متوقع طور پر مسترد کیا جائے تو، چیک کریں کہ:

- کلائنٹ عوامی کلید دستخط کرنے کے لئے استعمال ہونے والی نجی کلید سے ملتی ہے
- اکاؤنٹ ابتداء میں یا ایک پابند ٹرانزیکشن کے ذریعے رجسٹرڈ کیا گیا تھا
- مجاز اکاؤنٹس کے پاس ہدایات کی ضرورت کی اجازت ہے
- سخت اکاؤنٹس فیلڈز کینیکل I105 اکاؤنٹ ID کا استعمال کرتے ہیں، جبکہ پڑھنے کے قابل نام ایک فعال اکاؤنٹ-alias بائنڈنگ کے ذریعے حل کیے جاتے ہیں۔

یہ بھی ملاحظہ کریں:

- [اجازت نامے](/ur/blockchain/permissions.md)
- [میٹا ڈیٹا](/ur/blockchain/metadata.md)
- [کلائنٹ کی ترتیب](/ur/guide/configure/client-configuration.md)
- [SORA Nexus ڈیٹا اسپیسز](/ur/get-started/sora-nexus-dataspaces.md)
