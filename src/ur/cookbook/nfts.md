---
translation_locale: ur
translation_source: /cookbook/nfts.md
translation_source_hash: 5eb6a349b815afbac9717f7b44c499adc78b1280625388656015ff4b133b9085
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## نتیجہ {#outcome}

معائنہ Taira NFT اسٹیٹ، پھر رجسٹر، اپ ڈیٹ، منتقلی، اور ایک منفرد سوال NFT تخلیق کردہ مقامی نیٹ ورک پر کام کے بہاؤ کو مکمل طور پر اہل `name$domain.dataspace` NFT ID اور کینونیکل I105 مالک IDs.

## لازمی شرائط {#prerequisites}

- `curl`, `jq`, Python 3.11 یا اس سے زیادہ، اور موجودہ `iroha` CLI.
- Taira تک رسائی صرف پڑھنے کے لئے۔
- لکھنے کے لئے، [کے ذریعہ پیدا کردہ مقامی نیٹ ورک لانچ کریں Iroha](/ur/get-started/launch-iroha.md)، `./localnet/client.toml` اور Torii پر `http://127.0.0.1:8080`.

## قدم {#steps}

### 1۔ عوامی Taira مجموعہ کا معائنہ {#_1-inspect-the-public-taira-collection}

ایک خالی صفحہ کامیابی سے پڑھا جاتا ہے: اس کا مطلب یہ ہے کہ مطلوبہ صفحے میں کوئی نظر نہیں آتا NFTs۔

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs منفرد ریکارڈ ہیں، عددی توازن نہیں. ان کے پاس ایک ID ہے، ایک مالک، اور ایک کمپیکٹ `content` میٹا ڈیٹا نقشہ.

### مقامی مالک کو تیار کریں IDs {#_2-prepare-local-owner-ids}

لکھنے کی مثال میں چیک ان `wonderland.universal` ڈومین کا استعمال کیا جاتا ہے۔ اس کی نجی کلید کو بے نقاب کیے بغیر تشکیل شدہ اتھارٹی سے نکالا جائے ، پھر منتقلی کی منزل کے طور پر ایک اور رجسٹرڈ اکاؤنٹ منتخب کریں۔

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

`$` جداکار NFT ٹیکسٹ فارم سے تعلق رکھتا ہے۔ مکمل `wonderland.universal` ڈومین اور ڈیٹا اسپیس ضمیمہ کو برقرار رکھنا۔

### 3۔ ابتدائی مواد کے ساتھ NFT رجسٹر کریں۔ {#_3-register-the-nft-with-initial-content}

CLI سٹینڈرڈ ان پٹ سے ابتدائی JSON اعتراض کو پڑھتا ہے۔ موجودہ اتھارٹی مالک بن جاتی ہے۔

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### مواد کا نقشہ اپ ڈیٹ کریں {#_4-update-the-content-map}

میٹا ڈیٹا اقدار JSON ہیں۔ ایک کلید داخل کرنا یا اس ایک اندراج کو تبدیل کرنا؛ یہ پورے NFT ریکارڈ کی جگہ نہیں لیتا ہے۔

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5۔ ملکیت کی منتقلی {#_5-transfer-ownership}

دونوں کینیکل I105 اکاؤنٹ IDs فراہم کریں۔ ایک عرفی کو حل کیا جانا چاہئے اس سے پہلے کہ اسے `--from` یا `--to` کے طور پر استعمال کیا جائے۔

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning اجازت کی حد

پر Taira, ہر لکھنے کی بھی ضرورت ہے `--metadata ./taira.tx-metadata.json` رجسٹریشن، منتقلی، ہٹانے اور میٹا ڈیٹا اپ ڈیٹس کو فعال رن ٹائم کے ذریعہ چیک کیا جاتا ہے (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft`, اور `CanModifyNftMetadata` پہلے سے طے شدہ اجازت کی سطح میں). اپنی درخواست کو تفویض کردہ ڈومین کا استعمال کریں یا لوکل نیٹ پر اس کے ذریعے چلیں۔

:::

معاہدے کی ملکیت کے ورک فلوز کے لئے ، Kotodama ٹائپ کردہ NFT میزبان کالز کو بے نقاب کرتا ہے۔ مندرجہ ذیل ہے عین مطابق لائف سائیکل فکسچر مرتب اور پنڈڈ IVM دستاویزات ٹیسٹ کے ذریعہ انجام دیا گیا ہے:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

I105 کی دو مقررہ اقدار بہاؤ سے اوپر ٹیسٹ فکسچر ہیں؛ ہینس عملدرآمد سے پہلے منزل کو رجسٹر کرتا ہے۔ وہ `CURRENT_OWNER` اور `NEW_OWNER` سے نہیں ہیں CLI چلنے کے ذریعے. درخواست کے معاہدے کے ل its ، اس کے اصل کینونیکل اکاؤنٹس فراہم کریں ، پھر اسے مرتب کریں ، ٹیسٹ کریں ، تعینات کریں اور اسے [ہوشیار معاہدوں ](./smart-contracts.md) کے ذریعہ کال کریں۔ غیر نظر ثانی شدہ بائٹ کوڈ کو Taira میں پیش نہ کریں ، اور یاد رکھیں کہ معاہدہ کی کارکردگی ابھی بھی رن ٹائم اجازت سے گزرتی ہے۔

## تصدیق کریں {#verify}

NFT کو براہ راست پڑھیں اور دعویٰ کریں کہ اس کا مالک بدل گیا ہے جبکہ اس کا مواد منسلک رہا:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

اگر CLI ایک آؤٹ پٹ لفافے میں ریکارڈ لپیٹتا ہے، جانچ پڑتال JSON ایک بار اور اس دعوے کو شامل کردہ NFT اعتراض. مستند غیر متغیرات ہیں `id`, `owned_by`, اور `content`.

## خرابی کا سراغ لگانا {#troubleshooting}

- `name$domain` کچھ پارسرز میں یونیورسل ڈیٹا اسپیس پر ڈیفالٹ طور پر استعمال کیا جا سکتا ہے، لیکن کک بک اور ایپلی کیشن IDs کو واضح طور پر `name$domain.dataspace` فارم کا استعمال کرنا چاہئے.
- ایک ہی NFT ID کی بار بار رجسٹریشن مسترد کردی جاتی ہے۔ الگ الگ ریکارڈ کے لئے تازہ لوکل نیٹ ورک کا استعمال کریں یا مستحکم نیا ID منتخب کریں۔
- میٹا ڈیٹا ان پٹ کو معیاری ان پٹ پر درست JSON ہونا ضروری ہے۔ JSON کوٹیشن کے بغیر ایک شیل سٹرنگ میٹا ڈیٹا کی قیمت نہیں ہے۔
- موجودہ مالک کے علاوہ کسی اور اکاؤنٹ کی طرف سے دستخط شدہ منتقلی کو درست اجازت کی ضرورت ہوتی ہے۔ `--from` میں تبدیلی کرنے سے دستخط کنندہ تبدیل نہیں ہوتا۔
- منتقلی کے بعد ، اصل کلائنٹ کو NFT کو تبدیل یا غیر رجسٹر کرنے کی اجازت نہیں دی جاسکتی ہے۔ نئے مالک کا دستخط کنندہ یا ایک مجاز کنٹرولر استعمال کریں۔
- Taira ایک خالی NFT مجموعہ واپس کر سکتے ہیں. `items: []` کو ثبوت کے طور پر نہ سمجھیں کہ NFT ہدایات دستیاب نہیں ہیں۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [NFT پنڈ commit پر انٹیگریشن ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT پنڈ commit پر میزبان کال ٹیسٹ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [عین مطابق Kotodama NFT پنڈ commit پر زندگی سائیکل فکسچر](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/ur/blockchain/nfts.md)
- [میٹا ڈیٹا](/ur/blockchain/metadata.md)
- [ہدایات](/ur/blockchain/instructions.md)
- [اجازت کے ٹوکن](/ur/reference/permissions.md)
