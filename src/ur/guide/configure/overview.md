---
translation_locale: ur
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ترتیب اور انتظام {#configuration-and-management}

Iroha ترتیب میں دو مستند پرتیں ہیں:

- مقامی نیٹ ورک نوڈ اور کلائنٹ ترتیب، TOML فائلوں میں ذخیرہ کیا جاتا ہے اور عمل شروع ہونے پر پڑھا جاتا ہے
- [`SetParameter`](/ur/blockchain/instructions.md#setparameter) کے ذریعے ہونے والی ٹرانزیکشنز کے ذریعہ تبدیل کردہ آن لائن ترتیب۔

نوڈ کی شناخت ، پتوں ، لاگنگ ، اسٹوریج اور کلائنٹ دستخط کرنے والی چابیاں کے لئے مقامی ترتیب کا استعمال کریں۔ نیٹ ورک کی طرف سے متفق ہونے والے اقدار کے لئے آن چین ترتیب کا استعمال کریں اور تعیناتی طور پر دوبارہ ادا کیا جانا چاہئے۔

پیداوار کا رویہ ان ترتیب کی تہوں سے آنا چاہئے۔ مقامی ٹولنگ کو ٹیسٹ ان پٹ فراہم کرنے کے لئے ماحولیاتی متغیرات آسان ہوسکتے ہیں ، لیکن وہ پیداوار کی خصوصیت کے دروازے نہیں ہیں اور مصروف عمل ترتیب کی جگہ نہیں لیتے ہیں۔

بنیادی ترتیب میں داخلہ پوائنٹس ہیں:

- [ابتداء](/ur/guide/configure/genesis.md)
- [کلائنٹ کی ترتیب](/ur/guide/configure/client-configuration.md)
- [نیٹ ورک کی تعیناتی کے لئے کلیدیں ](/ur/guide/configure/keys-for-network-deployment.md)
- [ننگے دھات پر چل رہا ہے](/ur/guide/advanced/running-iroha-on-bare-metal.md)
- [پیئر ترتیب کا حوالہ](/ur/reference/peer-config/index.md)
