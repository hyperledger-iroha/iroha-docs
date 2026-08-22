---
translation_locale: ur
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# کے ساتھ کام کرنا Iroha بائنریز {#working-with-iroha-binaries}

دی Iroha 3 آپریٹر ورک فلو تین بنیادی بائنریز کے گرد گھومتا ہے:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) ہم مرتبہ ڈیمون چلانے کے لیے
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) کے لیے CLI اور آپریٹر کے احکامات
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) چابیاں، پیدائش، لوکل نیٹ، اور پروفائلز کے لیے

## ماخذ سے بنائیں {#build-from-source}

اپ اسٹریم ورک اسپیس جڑ سے:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

ریلیز بائنریز پھر دستیاب ہیں۔ `target/release/`.

کمانڈ کی سطح کا معائنہ کرنے کے لیے:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## ریپوزٹری سے براہ راست چلائیں۔ {#run-directly-from-the-repository}

اگر آپ عالمی سطح پر کچھ بھی انسٹال نہیں کرنا چاہتے تو استعمال کریں۔ `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker تصویر {#docker-image}

اپ اسٹریم ورک اسپیس استعمال کرتا ہے۔ `kagami localnet` اور `kagami docker` پیدا کرنے کے لئے
Docker Compose فائلیں جو چیک آؤٹ کوڈ سے ملتی ہیں۔دی `hyperledger/iroha:dev`
تصویر کو ان فائلوں کے ساتھ استعمال کیا جا سکتا ہے۔

چلائیں CLI ایک کنٹینر میں:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

دوڑو Kagami ایک کنٹینر میں:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

ہم مرتبہ اسٹارٹ اپ کے لیے، پہلے لوکل نیٹ اور کمپوز فائل بنائیں:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## مجھے کون سا بائنری استعمال کرنا چاہئے؟ {#which-binary-should-i-use}

- استعمال کریں۔ `irohad` جب آپ ساتھیوں کو شروع کر رہے ہوں یا کام کر رہے ہوں۔
- استعمال کریں۔ `iroha` جب آپ کو لیجر سے استفسار کرنے، لین دین جمع کرانے، یا آپریٹر کے اختتامی مقامات کا معائنہ کرنے کی ضرورت ہو۔
- استعمال کریں۔ `kagami` جب آپ کو چابیاں، جینیسس مینی فیسٹ، پروفائل بنڈلز، یا لوکل نیٹ اثاثوں کی ضرورت ہو۔

## Kagemusha ریلیز کی اشاعت اور رول آؤٹ {#kagemusha-release-publication-and-rollout}

کاگیموشا V4 اشاعت اور ایکٹیویشن الگ الگ محفوظ حدود سے تجاوز کرتے ہیں:

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` ہے
  صرف macOS، صرف روٹ پبلشر۔یہ پن کی تصدیق کرتا ہے۔ Kagami بائنری اور
  عین مطابق سولہ فائل امیدوار، غیر حاضر کو شائع کرتا ہے۔
  `promotion-record-v4.norito` متبادل کے بغیر، اور صرف کامیابی کی اطلاع دیتا ہے۔
  درست سترہ فائل کو فروغ دینے کے بعد ریلیز کی تصدیق ہوتی ہے۔
- `iroha offline kagemusha rollout-v4 create-expectations` دستخط کی تصدیق کرتا ہے۔
  ریزرویشن، چار حکم دیا توثیق اہلیت مہریں، عین مطابق
  پہلے سے مجاز ٹرانزیکشن وائر، اور اس سے پہلے قابل اعتماد حتمی اینکر
  تبدیلی کے بغیر دستخط شدہ توقعات کی اشاعت۔
- `iroha offline kagemusha rollout-v4 submit` واضح کی ضرورت ہے
  `--write-authorized` رضامندییہ مستقل طور پر جرائد کرتا ہے اور درست کی دوبارہ تصدیق کرتا ہے۔
  نیٹ ورک لکھنے یا دوبارہ کوشش کرنے سے پہلے کی توقعات۔ایک `Applied` حیثیت نہیں ہے
  کافی: کمانڈ کمٹڈ بلاک، فائنل جانشین کی بھی تصدیق کرتی ہے۔
  سلسلہ، اور مکمل اجازت دینے والے لین دین کے تار۔
- `iroha offline kagemusha rollout-v4 finalize-receipt` وہی ثبوت سے مربوط
  شواہد صرف اس وقت جمع کرتا ہے جب عین جمع آوری جرنل کی دوبارہ توثیق ہو جائے، آزاد
  رسید جاری کنندہ سے اس پر دستخط کرتا ہے، اور معیاری رسید کو بدلے بغیر شائع کرتا ہے۔

چیک ان کاگیموشا پروڈکشن ریڈینس ورک فلو صرف تصدیق کے لیے ہے۔
یہ تصدیق شدہ پبلشر کو کال نہیں کرتا ہے، تصدیق کنندہ کی اہلیت کو شائع کرتا ہے۔
مہر لگائیں، ایکٹیویشن جمع کروائیں، یا حتمی رسید بنائیں۔ایک کامیاب ورک فلو
چلائیں اس لیے نہ تو پروموشن ثابت ہوتا ہے اور نہ ہی لائیو رول آؤٹ۔

یہ احکامات مقامی قدیم ہیں، زندہ ثبوت کے متبادل نہیں ہیں۔اے
حقیقی جسمانی ایپ اٹیسٹ کے بغیر پروڈکشن رول آؤٹ بلاک رہتا ہے۔
امیدواروں کے نمونے، چاروں محفوظ میزبان مہریں، رن ٹائم گورننس اور
دستخط کرنے والے ان پٹس، لائیو فور ویلیڈیٹر جمع کرانے اور حتمی ثبوت، اور
کیننیکل مؤثر ترتیب پروجیکشن.نجی چابیاں رکھیں،
تصدیقی مواد، اور پروموشن مخصوص شناخت کنندگان محفوظ ہیں۔
رن ٹائم تحویل؛ان کو ماخذ کے زیر کنٹرول دستاویزات میں کاپی نہ کریں۔
آپریٹر ٹکٹ.
