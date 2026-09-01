---
translation_locale: ur
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Iroha NFT ایک منفرد لیجر آبجیکٹ ہے جس میں ایک ہی مالک ہے۔ جب ریکارڈ کو اپنی شناخت ، میٹا ڈیٹا ، لائف سائیکل کے واقعات اور ملکیت کی منتقلی سیمینٹکس کی ضرورت ہو تو NFTs کا استعمال کریں ، لیکن عددی بیلنس کی ضرورت نہیں۔

عددی [ اثاثہ](/ur/blockchain/assets.md) کے برعکس ، NFT میں درستگی ، منتاbility ، یا فی اکاؤنٹ کی مقدار نہیں ہے۔ NFT ایک رجسٹرڈ آبجیکٹ کے طور پر موجود ہے ، اور ملکیت براہ راست اس آبجیکٹ پر ٹریک کی جاتی ہے۔

## ڈھانچہ {#structure}

ایک رجسٹرڈ `Nft` میں شامل ہیں:

- `id`: ایک `NftId`
- `content`: میٹا ڈیٹا جو کہ NFT کی وضاحت کرتا ہے۔
- `owned_by`: اکاؤنٹ جس میں NFT کا مالک ہے

`content` فیلڈ ایک `Metadata` نقشہ ہے۔ اسے کمپیکٹ رکھیں: وہاں وضاحتی فیلڈز ، مستحکم حوالہ جات ، ہیشز ، URIs ، یا SoraFS راستے ذخیرہ کریں۔ بڑی دستاویزات ، میڈیا ، یا ہائی کھرن ایپلی کیشن اسٹیٹ آف چین کو اسٹور کریں اور صرف ایک قابل تصدیق ریفرنس کو NFT پر رکھیں۔

## Taira پر آزمائیں {#try-it-on-taira}

چیک کریں کہ کیا عوامی Taira ٹیسٹ نیٹ ورک کے پاس فی الحال NFT ریکارڈ موجود ہیں:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

NFT راستوں کے لئے لائیو OpenAPI دستاویز چیک کریں جو نوڈ کی طرف سے بے نقاب ہیں:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

ایک خالی `items` صف عوامی ٹیسٹ نیٹ ورک پر ایک درست جواب ہے۔ اس کا مطلب یہ نہیں ہے کہ موجودہ صفحے میں کوئی NFTs موجود نہیں ہے ، نہ ہی کہ NFT ہدایات دستیاب نہیں ہیں۔

## NFT IDs {#nft-ids}

`NftId` اس متن فارم کا استعمال کرتا ہے:

```text
name$domain
name$domain.dataspace
```

مثال کے طور پر، `badge$docs.universal` `badge` میں NFT کی نشاندہی کرتا ہے `docs.universal` ڈومین. اگر ڈیٹا اسپیس کو خارج کر دیا جاتا ہے تو، موجودہ تجزیہ کار `universal` ڈیٹا اسپیس کا استعمال کرتا ہے، لہذا `badge$docs` `badge$docs.universal` تک حل ہوتا ہے.

NFT کے لئے مستحکم ناموں کا استعمال کریں IDs. ID ہدایات ، استفسارات ، اجازت ، واقعہ فلٹرز اور ایپلی کیشن ریفرنسز میں استعمال ہونے والی اعتراض کی شناخت ہے۔

## لائف سائیکل {#lifecycle}

NFT لائف سائیکل آپریشنز کا استعمال Iroha خصوصی ہدایات:

- [`Register`](/ur/blockchain/instructions.md#un-register) ابتدائی `content` کے ساتھ NFT پیدا کرتا ہے.
- [`Unregister`](/ur/blockchain/instructions.md#un-register) NFT کو ہٹاتا ہے.
- [`Transfer`](/ur/blockchain/instructions.md#transfer) تبدیلیاں `owned_by`.
- [`SetKeyValue` اور `RemoveKeyValue`](/ur/blockchain/instructions.md#setkeyvalue-removekeyvalue) اپ ڈیٹ NFT میٹا ڈیٹا.

## مقامی طور پر کوشش کریں {#try-it-locally}

یہ مثالیں فرض کرتی ہیں کہ آپ نے مقامی نیٹ ورک لانچ کیا ہے اور [CLI گائیڈ ](/ur/get-started/operate-iroha-via-cli.md) سے کلائنٹ ترتیب تیار کی گئی ہے:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

پیدا ہونے والے لوکل نیٹ ورک پہلے ہی `wonderland.universal` اور اس کا SNS لیزنگ معاہدہ مرتب کرتا ہے۔ ایک مختلف ڈومین استعمال کرنے کے لئے ، اسے سب سے پہلے `app alias setup plan` اور `app alias setup apply` کام کے بہاؤ کے ساتھ بنائیں جو [ڈومینز](/ur/blockchain/domains.md#registration) میں بیان کیا گیا ہے.

ایک NFT رجسٹر کریں۔ رجسٹریشن معیاری ان پٹ سے ابتدائی مواد JSON پڑھتا ہے:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

NFT کا براہ راست معائنہ کریں اور پھر مکمل اندراجات کے ساتھ تمام NFTs کی فہرست بنائیں:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

ایک میٹا ڈیٹا کلید شامل کریں اور NFT کو دوبارہ پڑھیں:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

میٹا ڈیٹا کلید کو ہٹائیں:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

اختیاری طور پر منتقلی NFT. استعمال `ledger nft get` سے موجودہ مالک کو پڑھنے کے لئے `owned_by`, اور استعمال `ledger account list all` منزل کا اکاؤنٹ تلاش کرنے کے لئے ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

walkthrough کے بعد مثال NFT کو ہٹا دیں۔ اگر آپ نے اسے منتقل کیا ہے تو ، یا تو اسے واپس منتقل کریں یا موجودہ مالک کے اکاؤنٹ کی ترتیب کے ساتھ غیر رجسٹر کمانڈ بھیجیں۔

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## استفسارات اور واقعات {#queries-and-events}

[`FindNfts`](/ur/reference/queries.md#assets-nfts-and-rwas) کا استعمال کرتے ہوئے ایک اکاؤنٹ کی ملکیت والے NFTs اور [`FindNftsByAccountId`](/ur/reference/queries.md#assets-nfts-and-rwas) کو درج کرنے کے لئے NFTs کا استعمال کریں.

NFT رجسٹریشن ، حذف ، منتقلی اور میٹا ڈیٹا اپ ڈیٹس NFT کے اعداد و شمار کے واقعات کو خارج کرتی ہیں۔ `Nft` ڈیٹا ایونٹ فلٹر کا استعمال کرتے ہوئے لیجر کی تبدیلیوں یا عمارت ٹرگرز کو سبسکرائب کرتے وقت جو NFT لائف سائیکل کے واقعات پر رد عمل ظاہر کرتے ہیں۔

## اجازت نامے {#permissions}

ڈیفالٹ اجازت کی سطح میں NFT کے مخصوص ٹوکن شامل ہیں:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

اجازت کی جانچ پڑتال فعال رن ٹائم توثیق کنندہ کے ذریعہ نافذ کی جاتی ہے ، لہذا نیٹ ورک ایگزیکٹر کو اپ گریڈ کرکے اجازت کو اپنی مرضی کے مطابق بنا سکتا ہے۔ موجودہ ڈیفالٹ ٹوکن لسٹ کے لئے [اجازت ٹوکن](/ur/reference/permissions.md) دیکھیں.

## NFTs کا انتخاب {#choosing-nfts}

ریکارڈوں کے لیے NFT کا استعمال کریں جہاں انفرادیت اور ملکیت کی اہمیت ہے:

- سرٹیفکیٹ، بیجز، لائسنس اور تصدیق نامے
- رکنیت یا رسائی کے ریکارڈ
- شناختی طور پر پابند یا اکاؤنٹ کے مالک درخواست ریکارڈ
- غیر منسلک میڈیا، دستاویزات یا دستاویزات کے حوالہ جات

فنجیبل بیلنس کے لئے عددی اثاثہ استعمال کریں، اور سادہ [میٹا ڈیٹا](/ur/blockchain/metadata.md) کا استعمال کریں جب اعداد و شمار صرف ایک موجودہ لیجر آبجیکٹ کی ایک کمپیکٹ صفات ہیں.

یہ بھی ملاحظہ کریں:

- [اثاثہ جات](/ur/blockchain/assets.md)
- [میٹا ڈیٹا](/ur/blockchain/metadata.md)
- [ہدایات](/ur/blockchain/instructions.md)
- [استفسارات](/ur/blockchain/queries.md)
