---
translation_locale: ur
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# خرابی کا سراغ لگانا {#troubleshooting}

اس سیکشن کا مقصد مدد کرنا ہے اگر آپ کے ساتھ کام کرتے وقت مسائل کا سامنا کرنا پڑتا ہے Iroha. اگر کچھ غلط ہو جاتا ہے، براہ مہربانی [چابیاں چیک کریں](#check-the-keys) سب سے پہلے. اگر یہ مدد نہیں کرتا تو، ہر مرحلے کے لئے خرابی حل ہدایات چیک کریں:

- [تنصیب کے مسائل](./installation-issues.md)
- [ترتیب کے مسائل](./configuration-issues.md)
- [تعیناتی کے مسائل](./deployment-issues.md)
- [انضمام کے مسائل](./integration-issues.md)

اگر آپ کا مسئلہ یہاں بیان نہیں کیا گیا ہے، تو [ٹیلیگرام ](https://t.me/hyperledgeriroha) کے ذریعے ہم سے رابطہ کریں۔

## چابیاں چیک کریں {#check-the-keys}

زیادہ تر مسائل بے مثال چابیاں کے نتیجے میں پیدا ہوتے ہیں۔ یہی وجہ ہے کہ ہم تجویز کرتے ہیں کہ آپ اس اصول پر عمل کریں: اگر کچھ غلط ہو جائے تو پہلے چابیاں چیک کریں۔

یہاں ایک فوری وضاحت ہے: جب نیٹ ورک نوڈ کی چابیاں قابل اعتماد نیٹ ورک نوڈ کے صف میں موجود چابیاں سے مطابقت نہیں رکھتی ہیں تو پیدا ہونے والے غلطی کے پیغامات کو فرق کرنا ممکن نہیں ہے کیونکہ اس سے نیٹ ورک نوڈ کی عوامی چابی سامنے آجائے گی۔ اس طرح ، اگر آپ کے پاس ہیلم چارٹس یا کوبرنیٹس تعینات ہیں جو ماحول کے متغیرات کے ذریعہ بیان کردہ چابیاں ہیں تو ، اعلی سطح کی ناکامیوں کی تحقیقات سے پہلے ترتیب شدہ [`public_key`](/ur/reference/peer-config/params.md#param-public-key)، [`private_key`](/ur/reference/peer-config/params.md#param-private-key) ، اور [`trusted_peers`](/ur/reference/peer-config/params.md#param-trusted-peers) اقدار کا موازنہ کریں۔

اگر شک ہو تو، [ایک نئی جوڑی کی چابیاں پیدا کریں ](/ur/guide/security/generating-cryptographic-keys.md).
