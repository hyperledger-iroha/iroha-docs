---
translation_locale: ur
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# کوڈ کا ٹکڑا {#code-snippets}

جنریٹڈ ٹکڑے ٹکڑے کو Iroha ترمیم سے مثالیں جو ان کو پیدا کرنے والے کوڈ، ترتیب اور اسکیموں سے منسلک رکھی جاتی ہیں.

## تازہ کاری کرنے والے Iroha آثار قدیمہ {#refreshing-iroha-artifacts}

Iroha سے اخذ کردہ ٹکڑے ٹکڑے کو اس طرح چیک کیا جاتا ہے کہ عام سائٹ کی تعمیر میں نیٹ ورک تک رسائی یا ایک بہن بھائی ذخیرہ کی ضرورت نہیں ہوتی ہے۔ انہیں صریح طور پر تازہ کاری کریں:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

داخل ہونے والے [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) کام کا بہاؤ صاف ذریعہ چیک آؤٹ کے مقابلے میں تصدیق کرتا ہے `provenance/iroha.json`, دوبارہ پیدا ہوتا ہے `/src/snippets` اور Torii OpenAPI اسنیپ شاٹ، اور اپ ڈیٹس SHA-256 hashes. مواد اور اصل کی تبدیلیوں کو ایک ساتھ چیک کریں. عام انحصار تنصیب اور VitePress تعمیرات کو تبدیل کرنے والی شاخ کے بغیر چیک ان فائلوں کا استعمال کرتے ہیں.

## اسنیپٹس سمیت {#including-snippets}

تخلیق شدہ یا مقامی ماخذ کو شامل کرنے کے لئے [VitePress کوڈ-سنیپٹ ترکیب ](https://vitepress.dev/guide/markdown#import-code-snippets) استعمال کریں:

```md
<<< @/snippets/client.template.toml
```

ایک نامزد کوڈ علاقہ اس کے علاقے کا نام شامل کر کے شامل کیا جا سکتا ہے:

```md
<<< @/example_code/lorem.rs#ipsum
```

ہاتھ سے لکھے ہوئے مثالوں کو چھوٹا رکھیں۔ عوامی انٹرفیس ، ترتیب ٹیمپلیٹس ، تیار کردہ اسکیمز اور کمانڈ آؤٹ پٹ کے لئے تازہ کاری شدہ ماخذ آرٹیفیکٹس کو ترجیح دیں۔
