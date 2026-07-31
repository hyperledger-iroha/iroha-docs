---
translation_locale: ur
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# اسمبلیوں کا نام {#naming-conventions}

جب آپ اکاؤنٹس، ڈومینز یا اثاثوں کا نام دیتے ہیں تو، آپ کو Iroha میں استعمال ہونے والے مندرجہ ذیل کنونشنوں کو ذہن میں رکھنا ہوگا:

1. مخصوص قسم کے تعمیرات کے لئے استعمال ہونے والے کئی مخصوص علیحدہ الگ کرنے والے ہیں:

   - `@` اکاؤنٹ کے ناموں اور اسکیمڈ اکاؤنٹ / پبلک کلیدی فارموں کے لئے محفوظ ہے۔
   - `#` اثاثہ کی تعریف کے ناموں اور اثاثہ بیلنس لٹریلز کے لئے محفوظ ہے
   - `::` معاہدے کے مستعار ناموں کے لئے محفوظ ہے
   - `.` ڈومین اور ڈیٹا اسپیس کے لئے مخصوص ہے
   - `$` ٹرگر اسکینڈل ٹیکسٹ فارم کے لئے محفوظ ہے
   - `%` توثیق کرنے والے دائرہ کار کے متن فارموں کے لئے محفوظ ہے

2. ایک نام میں حروف کی زیادہ سے زیادہ تعداد (بشمول UTF-8 حروف) دو عوامل کے ذریعہ محدود ہے: `[0, u32::MAX]` اور فی الحال مختص کردہ اسٹیک جگہ.

## Taira پر آزمائیں {#try-it-on-taira}

ایک عوامی اثاثہ کا عرفی نام اس کی کینونیکل اثاثہ تعریف میں حل کریں ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

اس کا موازنہ اثاثہ تعریف کی فہرست کے ساتھ کریں:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#` کردار ایک اثاثہ عرفی کو ڈومین کے تناظر سے الگ کرتا ہے۔ اسے سادہ ناموں سے دور رکھیں جب تک کہ آپ جان بوجھ کر کسی اثاثہ کا عرفی یا اثاثہ بیلنس لفظی طور پر نہیں لکھ رہے ہوں۔
