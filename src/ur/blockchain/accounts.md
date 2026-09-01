---
translation_locale: ur
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# اکاؤنٹس {#accounts}

ایک اکاؤنٹ ایک ایسی اتھارٹی ہے جو لین دین پر دستخط کرسکتی ہے اور اپنی لیجر کی حیثیت رکھتی ہے۔ موجودہ Iroha 3 ڈیٹا ماڈل میں ، `AccountId` کینیکل اور ڈومینلیس ہے: یہ اکاؤنٹ کنٹرولر سے اخذ کیا جاتا ہے اور کینیکل طور پر [I105](/ur/reference/i105.md) کے طور پر کوڈ ہوتا ہے۔ انسانی پڑھنے کے قابل ڈومین اور ڈیٹا اسپیس کا تناظر علیحدہ اکاؤنٹ عرفی پابندیاں سے تعلق رکھتا ہے۔

## ڈھانچہ {#structure}

ایک رجسٹرڈ `Account` میں شامل ہیں:

- `id`: کینونیکل `AccountId`
- `metadata`: تعمیری اکاؤنٹ میٹا ڈیٹا
- `label`: ایک اختیاری مستحکم عرف
- `uaid`: ایک اختیاری یونیورسل اکاؤنٹ ID جو Nexus کے بہاؤ میں استعمال ہوتا ہے۔
- `opaque_ids`: اکاؤنٹ کے UAID سے منسلک غیر شفاف شناخت کنندہ

اکاؤنٹ بنانے کے لئے استعمال ہونے والے لین دین کا payload `NewAccount` ہے۔ اس میں شناختی ، میٹا ڈیٹا ، لیبل ، UAID ، اور غیر شفاف ID فیلڈز شامل ہیں جو رجسٹرڈ اکاؤنٹ کے ذریعہ استعمال ہوتے ہیں۔

`uaid` کینیکل `AccountId` کی تکمیل کرتا ہے۔ یہ اس کی جگہ نہیں لیتا ہے۔ جب Nexus خدمات کو ڈیٹا اسپیس ، رازداری کو برقرار رکھنے والے اندراج ، یا سروس کی صلاحیت تلاش میں مستحکم صارف یا تنظیم کے انتظام کی ضرورت ہو تو اسے استعمال کریں۔ رن ٹائم ایک سے ایک UAID کے اکاؤنٹ انڈیکس کو برقرار رکھتا ہے ، اس کی ضرورت ہوتی ہے کہ غیر شفاف شناخت کنندگان کو UAID کے ذریعہ منسلک کیا جائے ، اور ڈپلیکیٹ یا ٹکرانے والے غیر شفاف شناخت کنندہ کو مسترد کرتا ہے۔ [FHE اور UAID](/ur/blockchain/sora-nexus-services.md#fhe-and-uaid) کے لئے ملاحظہ کریں Nexus سروس پرت بہاؤ۔

## اکاؤنٹ کنٹرولرز {#account-controllers}

کنٹرولر بیان کرتا ہے کہ اکاؤنٹ کس طرح کارروائیوں کی اجازت دیتا ہے۔ ڈیفالٹ کلائنٹ فلو ایک Ed25519 کلیدی جوڑی کا استعمال کرتا ہے ، لیکن ڈیٹا ماڈل بھی زیادہ بھرپور کنٹرولرز جیسے ملٹی دستخط پالیسی کنٹرولر کی حمایت کرتا ہے۔

کلائنٹ کی ترتیب دستخط کرنے والی اتھارٹی کو پیئر ترتیب سے الگ اسٹور کرتی ہے:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
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

یہ عوامی پڑھنے ہیں۔ اکاؤنٹ بنانا یا اپ ڈیٹ کرنا ایک دستخط شدہ لین دین ہے اور Taira سیٹ اپ کی ضرورت ہوتی ہے جو [ میں بیان کیا گیا ہے۔ SORA Nexus ڈیٹا بیسوں سے رابطہ کریں](/ur/get-started/sora-nexus-dataspaces.md).

## رجسٹریشن اور اجازت {#registration-and-permissions}

اکاؤنٹس عام [`Register` اور `Unregister`](/ur/blockchain/instructions.md#un-register) ہدایات کے ساتھ رجسٹرڈ اور غیر رجسٹر شدہ ہیں۔ فعال رن ٹائم کی توثیق کرنے والا فیصلہ کرتا ہے کہ کون اکاؤنٹ تشکیل دے سکتا ہے اور کن اجازت ٹوکن یا کرداروں کی ضرورت ہے۔

رجسٹریشن کے بعد، ایک اکاؤنٹ:

- لین دین پر دستخط کریں
- ملکیت کے اثاثے
- اپنے ڈومینز
- رولز اور اجازت ٹوکن وصول کریں
- ذخیرہ شدہ میٹا ڈیٹا
- جب یہ خصوصیات فعال ہوں تو alias، rekey، recovery، اور Nexus شناخت کے بہاؤ میں حصہ لیں

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
- [SORA Nexus ڈیٹا بیسز](/ur/get-started/sora-nexus-dataspaces.md)
