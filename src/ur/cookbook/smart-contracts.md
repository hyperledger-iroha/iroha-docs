---
translation_locale: ur
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ایک ذہین معاہدہ بنائیں اور اس پر عمل درآمد کریں {#build-and-deploy-a-smart-contract}

## نتیجہ {#outcome}

ایک Kotodama V1 معاہدے کی جانچ پڑتال اور مرتب کریں، مقامی طور پر اس کے عوامی داخلے پوائنٹ کو انجام دیں، تصدیق شدہ IVM آرٹیفیکٹ کو تعینات کریں، تعینات کردہ داخلہ پوائنٹ کی نقالی کریں، اور اسے واضح طور پر فیس کوٹ شدہ مجاز اکاؤنٹس کی طرف سے ادا کردہ فیس کے ساتھ جمع کروائیں.

## لازمی شرائط {#prerequisites}

- Iroha ذریعہ چیک آؤٹ `0010c5a70039eac101a4846499ba9ceaf43eb65c`، Rust، اور کارگو پر کمیٹی.
- موجودہ `iroha` CLI اور ایک فنڈ Taira کلائنٹ سے [سے رابطہ کریں Taira](./connect-to-taira.md).
- `IROHA_CONFIG` اور `IROHA_PRIVATE_KEY_FILE` میں مطلق راستے۔ کلیدی فائل کو مالک کے زیر انتظام ، ایک لنک کی باقاعدہ فائل ہونا ضروری ہے جس میں موڈ `0600` ہے۔ تعیناتی مددگار جان بوجھ کر کوئی ان لائن نجی کلید دلیل نہیں رکھتا ہے۔
- Taira آپریٹر کی منظوری۔ معاہدے کے کوڈ کی رجسٹریشن کے لئے `CanRegisterSmartContractCode` کی ضرورت ہوتی ہے ، اور محفوظ تعیناتی کے لئے گورننس تفویض اور قانون سازی کی ضرورت ہوسکتی ہے۔ اگر Taira نے اس رسائی کی اجازت نہیں دی ہے تو ، ایک تخلیق شدہ مقامی نیٹ ورک پر تعینات کریں جس کی ابتدا اجازت دیتا ہے۔

```bash
TORII_URL=https://taira.sora.org
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
IROHA_PRIVATE_KEY_FILE=/absolute/path/to/taira-private-key.txt
test -n "$TAIRA_ACCOUNT_ID"
test -f "$IROHA_PRIVATE_KEY_FILE"

CHAIN_ID="$({
  python3 - "$IROHA_CONFIG" <<'PY'
import sys
import tomllib

with open(sys.argv[1], "rb") as config_file:
    print(tomllib.load(config_file)["chain"])
PY
})"
```

## قدم {#steps}

### ایک معروف Kotodama V1 معاہدے کی کاپی۔ {#_1-copy-a-known-good-kotodama-v1-contract}

منسلک Iroha چیک آؤٹ کے اندر کام کریں اور مرتب کنندہ کا ٹوپل ریٹرن نمونہ کاپی کریں تاکہ ماخذ اور ٹولچین ایک ہی کمیٹ پر رہیں.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

مکمل ذریعہ چھوٹا ہے اور موجودہ `seiyaku`/`kotoage` ترکیب کا استعمال کرتا ہے:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    kotoage fn compute() -> (int, int) authorize("Entry") {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama Iroha ورچوئل مشین اور اس کے موجودہ ABI کو نشانہ بناتا ہے۔ یہ ایک WASM یا EVM سورس زبان نہیں ہے۔

### 2۔ آرٹی فیکٹس کی جانچ پڑتال، تعمیر اور تصدیق {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p ivm --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

پہلا بلڈ آرٹیفیکٹ اور تصدیق شدہ معاون ریکارڈز شائع کرتا ہے۔ دوسرا صرف پڑھنے کے `--verify` موڈ میں چلتا ہے اور ناکام ہوجاتا ہے اگر کوئی موجودہ آؤٹ پٹ موجودہ ماخذ سے بالکل مماثل نہیں ہوتا ہے۔ `.to` فائل اور اس کی مینی فیسٹ کو ایک جائزہ لینے والے بلڈ آؤٹ پٹس کے طور پر علاج کریں۔

### بائٹ کوڈ کو مقامی طور پر چلائیں {#_3-run-the-bytecode-locally}

`compute` ایک عوامی `kotoage` انٹری پوائنٹ ہے۔ اسے `debug-call` کے ساتھ چلائیں ، جو کسی لین دین کی پیش کش یا ادائیگی کیے بغیر مقامی آزمائشی ڈیٹا کے خلاف کام کرتا ہے۔

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama انٹیجرز کو JSON سٹرنگ کے طور پر پیش کیا جاتا ہے، لہذا ڈکوڈ ٹوپل `["3", "5"]` ہے۔

### 4۔ مقامی معاون کے ذریعے تعینات کریں۔ {#_4-deploy-through-the-native-helper}

مددگار بائٹ کوڈ کے ٹکڑے اپ لوڈ کرتا ہے ، دستخط شدہ مینی فیسٹ رجسٹر کرتا ہے ، اور ایک `CommitContractDeployment` آپریشن پیش کرتا ہے۔ یہ ہر ٹرانزیکشن کی فیس کوٹیشن دیتا ہے اور کسی ایسے کوٹیشن سے انکار کرتا ہے جو منتخب کردہ ادائیگی کنندہ یا گیس بانڈ کو تبدیل کرے۔

```bash
printf '%s\n' \
  '{"payer":"authority","value":{"charge_limits":[],"gas_limit":1500000}}' \
  > ./build/fee-payment.json

cargo run -p iroha_cli --bin ivm_contract_deploy -- \
  --torii-url "$TORII_URL" \
  --chain-id "$CHAIN_ID" \
  --authority "$TAIRA_ACCOUNT_ID" \
  --private-key-file "$IROHA_PRIVATE_KEY_FILE" \
  --code-file ./build/tuple_return_demo.to \
  --contract-alias cookbook_tuple::universal \
  --fee-payment-json ./build/fee-payment.json \
  --out-dir ./build/deployment \
  > ./build/deployment.json

jq '{contract_address, code_hash_hex, final, fee_quotes}' \
  ./build/deployment.json
```

خالی `charge_limits` درخواست ایک کاپی شدہ اثاثہ شناخت نہیں ہے: مددگار دستخط کرنے سے پہلے عین مطابق لائیو کوٹیشن قبول کرتا ہے۔ واپسی چارج اثاثے کے ساتھ موازنہ کریں موجودہ فوسیٹ کا جواب۔ معاہدہ کالز صرف ٹائپ کردہ براہ راست کوٹیشن کے ذریعے فیس انتخاب قبول کرتی ہیں۔ `gas_asset_id` لین دین میٹا ڈیٹا پہلی ریلیز کے معاہدے کا حصہ نہیں ہے.

### 5۔ تعینات انٹری پوائنٹ کی نقالی کریں اور کال کریں۔ {#_5-simulate-and-call-the-deployed-entrypoint}

تخروپن Torii پر عوامی داخلے پوائنٹ کو جمع کرانے کے بغیر چلاتا ہے۔ مندرجہ ذیل کال ایک لین دین ہے اور اس وجہ سے اتھارٹی فیس ادا کرنے والا صریح طور پر منتخب کرتا ہے۔ دونوں امجاز اکاؤنٹسات 1,500,000 گیس کی حد کو پابند کرتے ہیں۔

```bash
iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-simulation.json

iroha --config "$IROHA_CONFIG" \
  --machine \
  --fee-payer authority \
  contract call \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  --wait \
  --timeout-ms 60000 \
  > ./build/deployed-call.json

jq -e '.terminal_kind == "Applied"' ./build/deployed-call.json
```

## تصدیق کریں {#verify}

عرفی کو حل کریں ، واپس آنے والے کوڈ ہیش کے ذریعہ آن لائن مینی فیسٹ حاصل کریں ، اور ایک ہی عوامی داخلہ پوائنٹ کو کینونیکل ایڈریس کے ذریعہ نقالی بنائیں:

```bash
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/deployment.json; })"
CONTRACT_ADDRESS="$({ jq -er '.contract_address' ./build/deployment.json; })"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-simulation.json
```

تعینات صرف اس وقت مکمل ہوتا ہے جب مستعار واپس آنے والے ایڈریس پر حل ہوجاتا ہے ، منیفیس ایک ہی کوڈ ہیش ، مقامی اور Torii تخروپن کی واپسی `["3", "5"]` کے تحت پڑھنے کے قابل ہو جاتا ہے ، اور جمع کردہ کال `Applied` تک پہنچ جاتی ہے۔

## خرابی کا سراغ لگانا {#troubleshooting}

- `CanRegisterSmartContractCode` ناکامیوں کے لئے Taira آپریٹر کی تفویض یا مقامی نیٹ ورک پر جینیس / بوٹسٹریپ تبدیلی کی ضرورت ہوتی ہے۔ ایک عام اکاؤنٹ اس حقیقت کے بعد خود کو یہ اجازت نہیں دے سکتا۔
- گورننس یا محفوظ لین کی تردید کا مطلب یہ ہے کہ تعیناتی کو اس نیٹ ورک کے ذریعہ مطلوبہ عین مطابق منظوری دینے والے تفویض کی ضرورت ہے۔ منظوری دینے والوں کی فہرست کو مربوط کریں؛ اکاؤنٹ IDs ایجاد نہ کریں۔
- ایک manifest یا ABI عدم مطابقت کا مطلب ہے کہ بائٹ کوڈ ، manifest اور node runtime ایک ہی artifact کی وضاحت نہیں کرتے ہیں۔ `--verify` کے ساتھ pinned commit پر تعمیر کریں.
- `fee quote changed ... gas bound` کا مطلب ہے کہ مطلوبہ ٹائپ کردہ ارادے اور براہ راست کوٹ متفق نہیں ہیں۔ ایک دستخط شدہ لین دین میں ترمیم کرنے کے بجائے دوبارہ پیش رفت کریں.
- تعیناتی مددگار ان لائن چابیاں ، اجازت دینے والے کلیدی فائل طریقوں ، symlinks کو مسترد کرتا ہے ، اور نیٹ ورک میں جمع کرنے سے پہلے منسلک فائلوں کو ضرب دیتا ہے۔
- صرف نقطہ نظر کے اندراج کی غلطی کا مطلب ہے کہ `compute` غلط کمانڈ فیملی سے روٹ کیا گیا تھا۔ یہ نمونہ `kotoage` کا اعلان کرتا ہے۔ لہذا کال سمیلیشن یا جمع کرانے کا استعمال کریں۔
- معاہدے کے کالز کو مثبت ٹائپ شدہ گیس کی حد کی ضرورت ہوتی ہے۔ پہلی ریلیز کال کا معاہدہ اعلی سطح کے گیس یا فیس اثاثہ میٹا ڈیٹا کو مسترد کرتا ہے۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [Kotodama V1 کمانڈ پر عملدرآمد پنڈل کمیٹ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [ٹپل ریٹرن ماخذ کا نمونہ پنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko) پر
- [پنڈل کمیٹ پر مقامی تعیناتی معاون](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [کنٹریکٹ انٹیگریشن ٹیسٹ پر پنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [ذہین معاہدے](/ur/blockchain/smart-contracts.md)
- [CLI حوالہ](/ur/get-started/operate-iroha-via-cli.md)
