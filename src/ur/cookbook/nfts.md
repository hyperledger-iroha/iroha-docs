---
translation_locale: ur
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# NFTs {#nfts}

## نتیجہ {#outcome}

Taira کی NFT state کا معائنہ کریں، پھر generated local network پر ایک منفرد NFT کو register، update اور transfer کریں اور اس پر استفسار کریں۔ workflow مکمل qualified `name$domain.dataspace` NFT ID اور canonical I105 owner IDs استعمال کرتا ہے۔

## لازمی شرائط {#prerequisites}

- `curl`, `jq`, Python 3.11 یا اس سے زیادہ، اور موجودہ `iroha` CLI.
- Taira تک رسائی صرف پڑھنے کے لئے۔
- تحریری کارروائیوں کے لیے، [Iroha لانچ کریں](/ur/get-started/launch-iroha.md) کی طرح `kagami localnet generate --peers 4 --out-dir ./localnet` سے بنایا گیا مقامی نیٹ ورک، جس میں `./localnet/client.toml` اور `http://127.0.0.1:8080` پر Torii ہو، نیز ایک NFT ڈومین جس کا مالک اس کا دستخط کنندہ ہو (مرحلہ 2 دیکھیں)۔

## قدم {#steps}

### 1۔ عوامی Taira مجموعہ کا معائنہ {#_1-inspect-the-public-taira-collection}

ایک خالی صفحہ کامیابی سے پڑھا جاتا ہے: اس کا مطلب یہ ہے کہ مطلوبہ صفحے میں کوئی نظر نہیں آتا NFTs۔

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs منفرد ریکارڈ ہیں، عددی بیلنس نہیں۔ ان کے پاس ایک ID، ایک مالک اور مواد کا ایک کمپیکٹ نقشہ ہوتا ہے، جسے Torii مجموعے کی قطاریں `metadata` کے طور پر اور `ledger nft get` `content` کے طور پر واپس کرتا ہے۔

### مقامی مالک کو تیار کریں IDs {#_2-prepare-local-owner-ids}

تحریری مثال کو ایسے ڈومین کی ضرورت ہے جس کا مالک دستخط کرنے والا اکاؤنٹ ہو، یا اس کے لیے `CanRegisterNft` کی عطا کردہ اجازت ہو۔ پیدا کردہ لوکل نیٹ اپنے کلائنٹ کے لیے کوئی ایپلیکیشن ڈومین رجسٹر نہیں کرتا، اور خام ڈومین رجسٹریشن جینیسس کے لیے مخصوص ہے، اس لیے `NFT_DOMAIN` کو ایسے `name.dataspace` ڈومین پر سیٹ کریں جسے آپ کا دستخط کنندہ کنٹرول کرتا ہو۔ تشکیل شدہ اتھارٹی کو اس کی نجی کلید ظاہر کیے بغیر اخذ کریں، پھر منتقلی کی منزل کے طور پر ایک اور رجسٹرڈ اکاؤنٹ منتخب کریں۔

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

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

`$` جداکار NFT ٹیکسٹ فارم سے تعلق رکھتا ہے۔ ID میں مکمل `name.dataspace` ڈومین برقرار رکھیں۔

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

Taira پر ہر تحریری عمل `--fee-payer authority` استعمال کرتا ہے؛ CLI دستخط سے پہلے Taira کے فیس اثاثے میں عین فیس کی کوٹیشن دیتا ہے۔ رجسٹریشن، منتقلی، اخراج اور میٹا ڈیٹا کی تازہ کاریوں کو فعال رن ٹائم جانچتا ہے (پہلے سے طے شدہ اجازت کی سطح میں `CanRegisterNft`، `CanTransferNft`، `CanUnregisterNft` اور `CanModifyNftMetadata`)۔ ایسا ڈومین استعمال کریں جس کا مالک آپ کا اکاؤنٹ ہو، یا جس کے لیے اس کے پاس یہ عطا کردہ اجازتیں ہوں۔

:::

معاہدے کی ملکیت والے ورک فلوز کے لیے Kotodama ٹائپ شدہ NFT میزبان کالز فراہم کرتا ہے۔ ذیل میں لائف سائیکل کا وہ عین آزمائشی ڈیٹا ہے جسے مقررہ IVM دستاویزی ٹیسٹ کمپائل کر کے چلاتا ہے:

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
    }
}
```

دونوں مقررہ I105 قدریں اپ اسٹریم پروجیکٹ کا آزمائشی ڈیٹا ہیں؛ آزمائشی نظام عمل درآمد سے پہلے منزل کو رجسٹر کرتا ہے۔ یہ CLI رہنما میں موجود `CURRENT_OWNER` اور `NEW_OWNER` نہیں ہیں۔ ایپلیکیشن کنٹریکٹ کے لیے اس کے اصل کینونیکل اکاؤنٹس فراہم کریں، پھر اسے [اسمارٹ کنٹریکٹس](./smart-contracts.md) کے ذریعے کمپائل کریں، جانچیں، تعینات کریں اور کال کریں۔ غیر جائزہ شدہ bytecode کو Taira پر جمع نہ کریں؛ یاد رکھیں کہ کنٹریکٹ پر عمل درآمد اب بھی runtime authorization سے گزرتا ہے۔

## تصدیق کریں {#verify}

NFT کو براہ راست پڑھیں اور دعویٰ کریں کہ اس کا مالک بدل گیا ہے جبکہ اس کا مواد منسلک رہا:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

CLI خود NFT ریکارڈ پرنٹ کرتا ہے۔ مستند غیر متغیرات `id`، `owned_by` اور `content` ہیں۔

## خرابی کا سراغ لگانا {#troubleshooting}

- `name$domain` کچھ پارسرز میں یونیورسل ڈیٹا اسپیس پر ڈیفالٹ طور پر استعمال کیا جا سکتا ہے، لیکن کک بک اور ایپلی کیشن IDs کو واضح طور پر `name$domain.dataspace` فارم کا استعمال کرنا چاہئے.
- ایک ہی NFT ID کی بار بار رجسٹریشن مسترد کردی جاتی ہے۔ الگ الگ ریکارڈ کے لئے تازہ لوکل نیٹ ورک کا استعمال کریں یا مستحکم نیا ID منتخب کریں۔
- میٹا ڈیٹا ان پٹ کو معیاری ان پٹ پر درست JSON ہونا ضروری ہے۔ JSON کوٹیشن کے بغیر ایک شیل سٹرنگ میٹا ڈیٹا کی قیمت نہیں ہے۔
- موجودہ مالک کے علاوہ کسی اور اکاؤنٹ کی طرف سے دستخط شدہ منتقلی کے لیے NFT کے ڈومین کی ملکیت یا عین `CanTransferNft` کی عطا کردہ اجازت درکار ہوتی ہے؛ `--from` میں تبدیلی کرنے سے دستخط کنندہ تبدیل نہیں ہوتا۔
- منتقلی صرف `owned_by` کو تبدیل کرتی ہے۔ میٹا ڈیٹا کی تازہ کاریاں اور غیر رجسٹریشن ڈومین کے مالک یا اس NFT کے لیے `CanModifyNftMetadata` یا `CanUnregisterNft` رکھنے والے اکاؤنٹ کے پاس رہتی ہیں؛ نیا مالک اسے آگے منتقل کر سکتا ہے۔
- Taira ایک خالی NFT مجموعہ واپس کر سکتے ہیں. `items: []` کو ثبوت کے طور پر نہ سمجھیں کہ NFT ہدایات دستیاب نہیں ہیں۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [NFT پنڈ commit پر انٹیگریشن ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT پنڈ commit پر میزبان کال ٹیسٹ ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [مقررہ commit پر Kotodama NFT لائف سائیکل کا عین آزمائشی ڈیٹا](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [مقررہ commit پر Kotodama دستاویزی مثالوں کے ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/ur/blockchain/nfts.md)
- [میٹا ڈیٹا](/ur/blockchain/metadata.md)
- [ہدایات](/ur/blockchain/instructions.md)
- [اجازت کے ٹوکن](/ur/reference/permissions.md)
