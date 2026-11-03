---
translation_locale: ur
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# ایک ذہین معاہدہ بنائیں اور اس پر عمل درآمد کریں {#build-and-deploy-a-smart-contract}

## نتیجہ {#outcome}

ایک Kotodama V1 معاہدے کی جانچ پڑتال اور مرتب کریں، مقامی طور پر اس کا عوامی ویو چلائیں، تصدیق شدہ IVM آرٹیفیکٹ کو صریح طور پر منتخب کردہ اور اتھارٹی کی ادا کردہ فیسوں کے ساتھ تعینات کریں، اور Torii کے ذریعے تعینات شدہ ویو پڑھیں۔

## لازمی شرائط {#prerequisites}

- Iroha ذریعہ چیک آؤٹ `c8c872461e92f04325c350cdd952f4276e96f9dc`، Rust، اور کارگو پر کمیٹی.
- موجودہ `iroha` CLI اور `musubi` (چیک آؤٹ میں `cargo run -p musubi --` کے طور پر چلائیں)، نیز [Taira سے رابطہ کریں](./connect-to-taira.md) سے حاصل کردہ فنڈ شدہ Taira کلائنٹ۔
- `IROHA_CONFIG` میں ایک مطلق راستہ۔ Musubi کی نیٹ ورک بائنڈنگ اس کلائنٹ فائل کا حوالہ محفوظ کرتی ہے اور اس کی اکاؤنٹ کلید سے تعیناتی پر دستخط کرتی ہے۔
- عرفی نام کی اتھارٹی۔ عملدرآمد کنندہ معاہدے کے عین عرفی نام یا اس کے بالائی دائرہ کار کے لیے `CanManageAccountAlias` کا تقاضا کرتا ہے: `name::domain.dataspace` کے لیے مالک ڈومین، یا `name::dataspace` کے لیے ڈیٹا اسپیس۔ رجسٹرڈ اکاؤنٹس کو کوڈ رجسٹریشن کی الگ اجازت کی ضرورت نہیں ہوتی، اور محفوظ نیم اسپیسز کے لیے نیٹ ورک کا گورننس ورک فلو بھی درکار ہوتا ہے۔ مثالیں `cookbook_tuple::universal` استعمال کرتی ہیں؛ Taira پر اسے اپنی ملکیت والے ڈومین کے کسی عرفی نام سے بدلیں، یا ایسے پیدا کردہ مقامی نیٹ ورک پر تعینات کریں جس کا جینیسس عرفی نام کا دائرہ کار عطا کرتا ہو۔

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## قدم {#steps}

### ایک معروف Kotodama V1 معاہدے کی کاپی۔ {#_1-copy-a-known-good-kotodama-v1-contract}

منسلک Iroha چیک آؤٹ کے اندر کام کریں اور مرتب کنندہ کا ٹوپل ریٹرن نمونہ کاپی کریں تاکہ ماخذ اور ٹولچین ایک ہی کمیٹ پر رہیں.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

مکمل ذریعہ چھوٹا ہے: ایک نجی مددگار `fn` اور ایک عوامی، صرف پڑھنے والا `view fn` جو صریح طور پر ہر کالر کو اجازت دیتا ہے:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    view fn compute() authorize(anyone) -> (int, int) {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama Iroha ورچوئل مشین اور اس کے موجودہ ABI کو نشانہ بناتا ہے۔ یہ ایک WASM یا EVM سورس زبان نہیں ہے۔

### 2۔ آرٹی فیکٹس کی جانچ پڑتال، تعمیر اور تصدیق {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p kotodama_toolchain --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

پہلا بلڈ آرٹیفیکٹ اور تصدیق شدہ معاون ریکارڈز شائع کرتا ہے۔ دوسرا صرف پڑھنے کے `--verify` موڈ میں چلتا ہے اور ناکام ہوجاتا ہے اگر کوئی موجودہ آؤٹ پٹ موجودہ ماخذ سے بالکل مماثل نہیں ہوتا ہے۔ `.to` فائل اور اس کی مینی فیسٹ کو ایک جائزہ لینے والے بلڈ آؤٹ پٹس کے طور پر علاج کریں۔

### بائٹ کوڈ کو مقامی طور پر چلائیں {#_3-run-the-bytecode-locally}

`compute` ایک عوامی، صرف پڑھنے والا `view fn` ہے۔ اسے `debug-view` کے ساتھ چلائیں، جو کسی لین دین کو جمع کرائے یا اس کی ادائیگی کیے بغیر مرتب شدہ بائٹ کوڈ کو مقامی طور پر اختیاری آزمائشی ڈیٹا کے خلاف چلاتا ہے۔

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama انٹیجرز کو JSON سٹرنگ کے طور پر پیش کیا جاتا ہے، لہذا ڈکوڈ ٹوپل `["3", "5"]` ہے۔

### 4۔ تصدیق شدہ آرٹیفیکٹ کو Musubi کے ساتھ تعینات کریں {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` معاہدوں کا معائنہ کرتا ہے، ان کے ویوز چلاتا ہے اور انہیں ڈیبگ کرتا ہے لیکن انہیں تعینات نہیں کرتا، اس لیے Taira پر تعیناتیاں Musubi کے ذریعے چلتی ہیں۔ اس کی تعیناتی سروس بائٹ کوڈ کے ٹکڑے اپ لوڈ کرتی ہے، تصدیق شدہ مینی فیسٹ رجسٹر کرتی ہے، اور ایک `CommitContractDeployment` آپریشن پیش کرتی ہے۔ یہ ہر ٹرانزیکشن کی کوٹیشن لیتی ہے، ایسی کوٹیشن مسترد کرتی ہے جو منتخب کردہ ادائیگی کنندہ، اسپانسر ریویژن یا گیس کی حد کو تبدیل کرے، اور پہلے سے تیار شدہ آرٹیفیکٹ کو صرف اس وقت تعینات کرتی ہے جب لاک شدہ پیکج بلڈ اس کے کوڈ اور ABI ہیشز کو دوبارہ پیدا کر دے۔ Kagami کے زیر انتظام مقامی نیٹ ورک پر اس کے بجائے `kagami contract deploy`، `--alias cookbook_tuple::universal --json` کے ساتھ `./build/tuple_return_demo.to` کو تعینات کرتا ہے؛ اس کی رسید `.receipt` کے تحت ہوتی ہے، اور `kagami context show` وہ کلائنٹ ترتیب پرنٹ کرتا ہے جسے `IROHA_CONFIG` کے طور پر استعمال کرنا ہے۔

```bash
cat > ./contracts/Musubi.toml <<'TOML'
manifest-version = 1

[package]
namespace = "local"
name = "cookbook-tuple"
version = "0.1.0"
edition = "1"
abi-version = 1

[[contract]]
name = "tuple_return_demo"
path = "tuple_return_demo.ko"
TOML

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml check

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml \
  network configure taira \
  --config "$IROHA_CONFIG" \
  --fee-payer authority \
  --contract tuple_return_demo \
  --alias cookbook_tuple::universal

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml --format json \
  deploy --network taira \
  --contract tuple_return_demo \
  --artifact ./build/tuple_return_demo.to \
  --artifact-manifest ./build/tuple_return_demo.manifest.json \
  > ./build/deployment.json

jq '.data.receipt | {contract_address, code_hash, stored_artifact_matches}' \
  ./build/deployment.json
```

بائنڈنگ `--fee-payer authority` استعمال کرتی ہے؛ Musubi دستخط سے پہلے Taira کے فیس اثاثے میں عین فیس کی کوٹیشن دیتا ہے۔ واپس آنے والے چارج اثاثے کا موازنہ اس اثاثے سے کریں جو موجودہ فوسیٹ پالیسی شائع کرتی ہے۔ معاہدہ کالز صرف مخصوص قسم والی براہ راست کوٹیشن کے ذریعے فیس انتخاب قبول کرتی ہیں؛ `gas_asset_id` لین دین میٹا ڈیٹا پہلی ریلیز کے معاہدے کا حصہ نہیں ہے۔

### 5۔ تعینات شدہ ویو پڑھیں {#_5-read-the-deployed-view}

`contract view` صرف پڑھنے والے انٹری پوائنٹ کو Torii پر کسی ٹرانزیکشن یا فیس کے بغیر چلاتا ہے۔ ویو کی کوئی ٹرانزیکشن شکل نہیں ہوتی: Torii اپنے کال روٹس پر ویو سلیکٹر کو مسترد کر دیتا ہے۔

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## تصدیق کریں {#verify}

عرفی کو حل کریں، تعینات شدہ ویو کے لیے Torii کی بتائی گئی کوڈ ہیش کے ذریعے آن چین مینی فیسٹ حاصل کریں، اور وہی ویو کینونیکل ایڈریس کے ذریعے چلائیں:

```bash
CONTRACT_ADDRESS="$({
  jq -er '.data.receipt.contract_address' ./build/deployment.json
})"
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/local-view.json; })"
DEPLOYED_CODE_HASH="$({
  jq -er '.code_hash_hex' ./build/deployed-view.json
})"
test "$DEPLOYED_CODE_HASH" = "$CODE_HASH"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --dataspace-id 0 \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-view.json
```

تعیناتی صرف اس وقت مکمل ہوتی ہے جب تعیناتی کی رسید محفوظ شدہ آرٹیفیکٹ کو تصدیق شدہ بتائے، عرفی نام واپس آنے والے ایڈریس پر حل ہو، مینی فیسٹ اسی کوڈ ہیش کے تحت پڑھنے کے قابل ہو، اور مقامی اور Torii ویوز `["3", "5"]` واپس کریں۔

## خرابی کا سراغ لگانا {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias`، یا عملدرآمد کنندہ کا `authority is not permitted to manage contract alias`، کا مطلب ہے کہ اکاؤنٹ اس عرفی نام کو منسلک نہیں کر سکتا۔ اپنی ملکیت والے ڈومین کا عرفی نام استعمال کریں، یا اس دائرہ کار کے مالک سے عین عرفی نام کی عطا کردہ اجازت یا اس کے ڈومین یا ڈیٹا اسپیس کی عطا کردہ اجازت حاصل کریں؛ لوکل نیٹ پر اسے جینیسس میں عطا کریں۔
- محفوظ نیم اسپیس کی بنا پر مسترد ہونے کا مطلب ہے کہ عرفی نام کی نیم اسپیس گورننس کے تحت ہے۔ منظوری دینے والوں کے اکاؤنٹ IDs کی فہرست دینا منظوری کا ثبوت نہیں ہے؛ اس نیم اسپیس کے لیے نیٹ ورک کا گورننس ورک فلو (`iroha app gov deploy propose`) استعمال کریں، یا اس سے باہر کوئی عرفی نام منتخب کریں۔
- مینی فیسٹ یا ABI کی عدم مطابقت کا مطلب ہے کہ بائٹ کوڈ، مینی فیسٹ اور نوڈ رن ٹائم ایک ہی آرٹیفیکٹ کی وضاحت نہیں کرتے۔ مقررہ commit پر دوبارہ تعمیر کریں، پھر `--verify` کے ساتھ بلڈ دوبارہ چلائیں۔
- `fee quote changed ... gas bound` کا مطلب ہے کہ مطلوبہ ٹائپ کردہ ارادے اور براہ راست کوٹ متفق نہیں ہیں۔ ایک دستخط شدہ لین دین میں ترمیم کرنے کے بجائے دوبارہ پیش رفت کریں.
- منقطع شدہ تعیناتی اپنا دستخط شدہ منصوبہ ایک جرنل میں محفوظ رکھتی ہے۔ نئے منصوبے پر دستخط کرنے کے بجائے اسے `musubi deploy --resume <JOURNAL>` کے ذریعے بحال کریں۔
- `is read-only and cannot be invoked as a transaction` یا `is not a kotoage or lifecycle entrypoint` کا مطلب ہے کہ `compute` کو کال کمانڈ پر بھیجا گیا تھا۔ یہ نمونہ `view fn` کا اعلان کرتا ہے، اس لیے مقامی طور پر `debug-view` اور Torii پر `view` استعمال کریں۔
- معاہدے کے کالز کو مثبت ٹائپ شدہ گیس کی حد کی ضرورت ہوتی ہے۔ پہلی ریلیز کال کا معاہدہ اعلی سطح کے گیس یا فیس اثاثہ میٹا ڈیٹا کو مسترد کرتا ہے۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [مقررہ commit پر Kotodama V1 کمانڈ کا نفاذ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [ٹپل ریٹرن ماخذ کا نمونہ پنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko) پر
- مقررہ commit پر [Musubi تعیناتی کمانڈ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) اور [مقامی معاہدہ تعیناتی سروس](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs)
- [کنٹریکٹ انٹیگریشن ٹیسٹ پر پنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [ذہین معاہدے](/ur/blockchain/smart-contracts.md)
- [CLI حوالہ](/ur/get-started/operate-iroha-via-cli.md)
