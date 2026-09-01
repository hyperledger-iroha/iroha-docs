---
translation_locale: ur
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# نجی ڈیٹا اسپیس کے لئے سپانسر فیس {#sponsor-fees-for-a-private-dataspace}

فیس سپانسرنگ صارفین کو XOR کے بغیر نجی ڈیٹا اسپیس ٹرانزیکشنز جمع کرانے کی اجازت دیتی ہے۔ صارف ابھی بھی ٹرانزیکشن پر دستخط کرتا ہے۔ ٹرانسمیشن میٹا ڈیٹا ایک اسپانسر اکاؤنٹ پر پوائنٹس دیتا ہے ، اور رن ٹائم نیٹ ورک فیس کے لئے اسپانسر کے XOR بیلنس کا ڈیبٹ کرتا ہے۔

انضمام میں تین متحرک حصے ہیں:

1. نوڈ فیس سپانسرشپ کی اجازت دیتا ہے
2. سپانسر اکاؤنٹ موجود ہے اور اس میں XOR ہے۔
3. ہر صارف کے پاس `CanUseFeeSponsor` اس سپانسر کے لئے ہے

اس کے بعد، ہر سپانسرڈ صارف ٹرانزیکشن صرف اس میٹا ڈیٹا کی ضرورت ہے:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

اس صفحے پر دو عام نمونہ دکھایا گیا ہے:

- مفت صارف لکھتا ہے: سپانسر XOR ادا کرتا ہے اور صارف کچھ بھی نہیں ادا کرتا ہے۔
- مقامی ٹوکن فیس: صارف سپانسر کو ایپ ٹوکن میں ادا کرتا ہے، اور اسپانسر نیٹ ورک کو XOR میں ادا کرتا ہے۔

پہلے Taira یا ایک نجی ٹیسٹ نیٹ ورک کا استعمال کریں۔ نیا نجی ڈیٹا اسپیس آپریٹر اور گورننس کی تبدیلی ہے؛ یہ کلائنٹ ترتیب کے ذریعہ نہیں بنایا جاتا ہے۔

## مثال کی اقدار {#example-values}

مندرجہ ذیل کمانڈوں میں ان جگہ ہولڈر کا استعمال کیا جاتا ہے:

```bash
export DATASPACE="team"
export USER="<USER_ACCOUNT_I105>"
export SPONSOR="<SPONSOR_ACCOUNT_I105>"
export TREASURY="<TREASURY_ACCOUNT_I105>"
export XOR_ASSET="xor#universal"
export BILLING_DOMAIN="billing.team"
export LOCAL_FEE_ASSET="usage#billing.team"
export LOCAL_FEE_ASSET_ID="<LOCAL_FEE_ASSET_DEFINITION_BASE58>"
export USER_ALIAS="alice@team"
export PHONE_POLICY="phone#team"
export EMAIL_POLICY="email#team"
export POLICY_OWNER="<IDENTIFIER_POLICY_OWNER_ACCOUNT_I105>"
```

کینونیکل I105 اکاؤنٹ IDs کا استعمال کریں جب تک کہ آپ کے تعیناتی میں ایک ہی اکاؤنٹس کے لئے فعال اکاؤنٹ عرفی نام نہ ہوں۔

## 1۔ ڈیٹا اسپیس تیار کریں۔ {#_1-prepare-the-dataspace}

[ میں بیان کردہ نجی ڈیٹا اسپیس کیٹلاگ اور روٹنگ کے کام سے شروع کریں SORA Nexus ڈیٹا اسپیسز ](/ur/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace) سے رابطہ کریں۔ ایک آپریٹر کا سامنا کرنے والا ٹکڑا اس طرح لگتا ہے:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "team-private"
description = "Private team lane"
dataspace = "team"
visibility = "private"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "team"
id = 42
description = "Private team dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "team"
[nexus.routing_policy.rules.matcher]
account_prefix = "team."
description = "Route team domains to the private dataspace"
```

صارف ٹرانزیکشنز پر جانے سے پہلے، چیک کریں کہ:

- نجی لین `/status` جواب میں ظاہر ہوتا ہے
- آپ کے نجی آن بورڈنگ فلو کی طرف سے صارف اکاؤنٹس کو قبول کیا جاتا ہے
- سپانسر اکاؤنٹ موجود ہے
- XOR فیس اثاثہ اور فیس ڈنک اکاؤنٹ نیٹ ورک پر درست ہیں

## ڈیٹا اسپیس میں اثاثوں کو رجسٹر کریں۔ {#_2-register-assets-in-the-dataspace}

درخواست کی منطق میں ان کو وائرنگ کرنے سے پہلے صارفین کو نجی ڈیٹا اسپیس کے اندر رکھنے والی اثاثہ تعریفیں درج کریں۔ مقامی ٹوکن فیس پیٹرن کے لئے ، ٹیوٹوریل `usage#billing.team` کا استعمال کرتا ہے:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

سب سے پہلے ڈومین اور SNS لیز پر قائم کریں جو اثاثہ ناموں کی جگہ کے مالک ہیں۔ `$BILLING_DOMAIN` کے لئے ایک خفیہ مفت `AliasSetupPlanRequestV1` ارادے بنائیں ، بشمول عددی `team` ڈیٹا اسپیس ID ، کینونیکل مالک ، لیز ٹرم ، اور موجودہ کوٹ گارڈ:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

اس کے بعد اثاثہ کی تعریف درج کریں۔ کینونیکل `--id` نیٹ ورک کی سطح پر اثاثے کی تعریف ہے ID. عرفی وہ ہے جو ڈویلپرز اور اختتامی صارفین کو ڈیٹا اسپیس کوڈ میں استعمال کرنا چاہئے:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

منٹ یا آن بورڈنگ کے دوران مقامی ٹوکن کو صارف کو منتقل کریں:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

صارف کی بیلنس چیک کریں:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

ڈیٹا اسپیس میں ایپلی کیشن اثاثوں کے لئے ایک ہی پیٹرن کا استعمال کریں۔ ٹوکن پر ایک اثاثہ تعریف درج کریں ، ہر ایک کو ڈیٹا اسپیس عرفیت دیں ، اور ہارڈ کوڈنگ کینیکل اثاثہ وضاحت IDs کے بجائے SDK کوڈ سے مستعار نام سے رجوع کریں.

## 3۔ صارف ناموں کو رجسٹر کریں۔ {#_3-register-user-aliases}

اکاؤنٹس اب بھی کینونیکل ہیں I105 اکاؤنٹ IDs. صارف کے سامنے نام اکاؤنٹس کا مستعار ہیں ، اور مستعار غیر حساس ہینڈل جیسے `alice@team` یا `alice@members.team` ہونا چاہئے۔ فون نمبرز یا ای میل پتوں کو مستعار کے طور پر استعمال نہ کریں۔ وہ اگلے حصے میں نجی شناخت کنندہ بہاؤ میں شامل ہیں۔

نام نہاد سیٹ اپ ڈومین سیٹ اپ کے طور پر ایک ہی اعلاناتی منصوبہ ساز کا استعمال کرتا ہے۔ SDK یا آن بورڈنگ سروس کو ایک خفیہ مفت `AliasSetupPlanRequestV1` نیت بنائیں جس کا اکاؤنٹ نام نہاد اندراج اہداف `$USER` ، بنیادی کردار منتخب کریں ، عددی ڈیٹا اسپیس ID کو پن کریں ، اور موجودہ لیز کوٹیشن کی گارڈ لے جائیں۔ اس کے بعد منصوبہ بندی کریں اور اسے ایک ایٹمی لین دین کے طور پر لاگو کریں:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

اگر صارف کو XOR ادا نہیں کرنا چاہئے تو ، انسٹالیشن ٹرانزیکشن کی تعمیر اور جمع کروانے کے لئے منظور شدہ سپانسر سے آگاہ آن بورڈنگ سروس کا استعمال کریں۔ لیز حصول اور عرفی پابند کو آزاد درخواست کے معاملات میں تقسیم نہ کریں.

CLI سے اس کا پتہ لگانے کے بعد، اس کی تصدیق کریں:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

نئے اکاؤنٹ بنانے کے لئے ، ایک آن بورڈنگ سروس کو ترجیح دیں جو `NewAccount` کو مستحکم `uaid` اور ، اگر ضرورت ہو تو ، ابتدائی `label` کے ساتھ بناتا ہے۔ سادہ `ledger account register --id` کمانڈ صرف کینونیکل اکاؤنٹ ID کو رجسٹر کرتا ہے۔

## FHE سے فون اور ای میل کو نجی طور پر رجسٹر کریں۔ {#_4-register-phone-and-email-privately-with-fhe}

فون نمبر اور ای میل ایڈریس کو پرائیویٹ شناختی دعوے کے طور پر استعمال کریں ، عوامی ناموں کے طور پر نہیں۔ FHE کی حمایت یافتہ بہاؤ اکاؤنٹ کے ناموں ، ٹرانزیکشن میٹا ڈیٹا اور عالمی حالت سے خام شناخت کنندگان کو دور رکھتا ہے۔:

1. آپریٹر ٹیلی فون اور ای میل کے لئے [RAM-LFE/FHE پروگرام کی پالیسی](/ur/blockchain/ram-lfe.md) رجسٹر کرتا ہے۔
2. آپریٹر فعال شناخت کی پالیسیوں کو رجسٹر کرتا ہے جیسے `phone#team` اور `email#team`
3. بٹوے نے مقامی طور پر فون یا ای میل کو معمول میں لایا
4. بٹوے کو خفیہ کردہ قدر ریزولور کو بھیجتا ہے۔
5. حل کرنے والا ایک `IdentifierResolutionReceipt` واپس کرتا ہے
6. صارف `ClaimIdentifier` کو رسید کے ساتھ جمع کراتا ہے۔
7. سلسلہ ایک غیر شفاف شناخت کنندہ اور رسید ہیش کو اسٹور کرتا ہے ، خام فون یا ای میل کی قیمت نہیں

آپریٹر کی طرف سے پالیسی سیٹ اپ ایک SDK یا سروس ٹاسک ہے. ہر شناخت کنندہ قسم کے لئے ان ہدایات کے جوڑے بنائیں اور جمع کروائیں:

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "$POLICY_OWNER",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "$PHONE_POLICY",
  owner = "$POLICY_OWNER",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "$PHONE_POLICY")
```

ای میل کے لئے اسے دوبارہ کریں:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

آن بورڈنگ کے دوران، بٹوے یا بیک اینڈ کو مقامی طور پر معمول بنانا چاہئے:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

مرحلہ 8 میں سپانسر میٹا ڈیٹا فائل تخلیق ہونے کے بعد ، اس میٹا ڈیٹا کے ساتھ صارف کی دستخط شدہ دعوے کی ہدایت پیش کریں:

```text
ClaimIdentifier(
  account = "$USER",
  receipt = IdentifierResolutionReceipt {
    payload: {
      policy_id: "$PHONE_POLICY",
      opaque_id: "<OPAQUE_ACCOUNT_ID>",
      uaid: "<USER_UAID>",
      account_id: "$USER",
      ...
    },
    attestation: "<RESOLVER_SIGNATURE_OR_PROOF>"
  }
)
```

موجودہ CLI ان شناخت کی ہدایات کے لئے ٹائپ کردہ کمانڈوں کو ظاہر نہیں کرتا ہے۔ SDK کے ساتھ ترتیب شدہ `InstructionBox` اقدار تیار کریں اور انہیں `ledger transaction stdin` کے ذریعے بھیجیں:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

ان محافظوں کو بورڈنگ سروس میں رکھیں:

- اکاؤنٹ کا نام صرف انسانوں کے پڑھنے کے قابل ہینڈلز ہیں
- خام فون اور ای میل کی اقدار کبھی بھی عرفات ، میٹا ڈیٹا ، نوشتہ جات یا لین دین کے استعمال میں نہیں دکھائی دیتی ہیں۔
- اکاؤنٹ میں `uaid` ہے اس سے پہلے کہ وہ نجی شناخت دہندگان کا دعوی کرے۔
- رسیدیں پابند `policy_id` ، `opaque_id`، `uaid`، `account_id`، اور ختم ہونے والی
- حل کرنے والے چابیاں اور پوشیدہ پروگرام کے وعدوں کو گورننس کی طرف سے کنٹرول کیا جاتا ہے

## نوڈ پر اسپانسرشپ کو فعال کریں۔ {#_5-enable-sponsorship-on-the-node}

فیس سپانسرشپ ایک نوڈ / رن ٹائم پالیسی ہے. Nexus فیس ترتیب میں اس کو فعال کریں:

```toml
[nexus.fees]
fee_asset_id = "xor#universal"
fee_sink_account_id = "<FEE_SINK_ACCOUNT_I105_OR_ALIAS>"
base_fee = "0"
per_byte_fee = "0"
per_instruction_fee = "0.001"
per_gas_unit_fee = "0.00005"
sponsorship_enabled = true
sponsor_max_fee = "0"
```

`fee_asset_id` نیٹ ورک فیس اثاثہ ہے۔ SORA Nexus کے لئے یہ XOR ہے۔ اپنے نیٹ ورک کی طرف سے بے نقاب ہونے والے فعال XOR عرفی یا کینیکل XOR اثاثہ تعریف ID کا استعمال کریں۔

`sponsor_max_fee = "0"` کا مطلب ہے کہ ہر ٹرانزیکشن کے لئے کوئی سپانسر کی حد نہیں ہے۔ پیداوار کے ل a ، جب آپ اپنے ڈیٹا اسپیس لین دین کے عام سائز اور گیس پروفائل کو جانتے ہو تو صفر سے باہر کی حد طے کریں۔

اپنے معمول کے آپریٹر کے عمل کے ذریعے اس ترتیب کو دوبارہ شروع یا رول کریں.

## 6۔ اسپانسر کی تشکیل اور مالی اعانت {#_6-create-and-fund-the-sponsor}

اگر ضرورت ہو تو سپانسر کی چابی کا جوڑا تیار کریں۔

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

عوامی کلید کو اپنے نیٹ ورک کے لئے اکاؤنٹ فارمیٹ میں تبدیل کریں:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

اپنے نجی آن بورڈنگ فلو کے ذریعے اسپانسر اکاؤنٹ رجسٹر کریں:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

XOR کے ساتھ سپانسر کو خزانہ، دعوے اکاؤنٹ یا کسی دوسرے مالی اعانت والے اکاؤنٹ سے فنڈ کریں:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

کے لئے Taira پریکٹس، فوسیٹ کے مددگار کو بچانے سے [ٹیسٹ نیٹ حاصل کریں XOR پر Taira](/ur/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) کے طور `taira_faucet_claim.py`, پھر ایک خزانہ کی منتقلی کے بجائے اسپانسر کو عوامی فوسیٹ سے فنڈ دیں:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

سپانسر کی XOR بیلنس چیک کریں:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7۔ صارف کو اسپانسر تک رسائی فراہم کریں۔ {#_7-grant-a-user-access-to-the-sponsor}

اسپانسر کو ہر صارف کو اپنے نام پر فیس عائد کرنے کی اجازت دینی ہوگی۔ یہی grant صارفین کو من مانے sponsor accounts کا نام دینے سے روکتی ہے۔

اس کو اسپانسر اکاؤنٹ کے طور پر چلائیں، یا آپ کی رن ٹائم پالیسی کی طرف سے اجازت دی گئی ایک آپریشنل اکاؤنٹ کے طور:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission grant --id "$USER"
```

آن بورڈنگ سروسز کے لئے، یہ ایک عام اکاؤنٹ کی فراہمی کا مرحلہ بنانا اور لاگ:

- صارف اکاؤنٹ
- سپانسر اکاؤنٹ
- ڈیٹا اسپیس یا درخواست
- منظوری کا ٹکٹ یا گورننس فیصلہ

صارف کی اجازتوں کا معائنہ کرنے کے لیے:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8۔ اسپانسر میٹا ڈیٹا منسلک کریں۔ {#_8-attach-sponsor-metadata}

ایک بار پھر استعمال میٹا ڈیٹا فائل بنائیں:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

اس میٹا ڈیٹا کے ساتھ پیش کردہ ہر تحریر سپانسر سے وصول کی جاتی ہے:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs کے لئے ، ایک ہی ٹرانزیکشن میٹا ڈیٹا آبجیکٹ کو دستخط شدہ لین دین سے منسلک کریں۔ صارف صارف کی کلید کے ساتھ لین دین پر دستخط کرتا ہے۔ سپانسر ہر صارف کے کاروبار پر دستخط نہیں کرتا کیونکہ سابقہ `CanUseFeeSponsor` تفویض کردہ اجازت ہے۔

## نمونہ ۱: صارفین مفت ادائیگی کرتے ہیں {#pattern-1-users-pay-no-fees}

اس کا استعمال جب ایپلی کیشن یا آپریٹر تمام نیٹ ورک فیسوں کو جذب کرے۔

ڈویلپر چیک لسٹ:

1. صارف کے عام ٹرانزیکشن بوجھ میں کوئی تبدیلی نہ کریں۔
2. `fee_sponsor` کے ساتھ ٹرانزیکشن میٹا ڈیٹا شامل کریں۔
3. صارف کے طور پر دستخط کریں.
4. نجی ڈیٹا اسپیس روٹ کے ذریعے جمع کروائیں.

صارف اکاؤنٹ کو XOR بیلنس کی ضرورت نہیں ہے۔ سپانسر اکاؤنٹ کو تشکیل شدہ Nexus فیسوں کو پورا کرنے کے لئے کافی مقدار میں XOR رکھنا ہوگا۔

## نمونہ 2: صارفین مقامی ٹوکن ادا کرتے ہیں {#pattern-2-users-pay-a-local-token}

اس کا استعمال کریں جب صارفین کو XOR نہیں رکھنا چاہئے، لیکن ڈیٹا اسپیس اب بھی ایک داخلی ایپ فیس، کریڈٹ اخراجات یا کوٹ ٹوکن چاہتا ہے.

اس پیٹرن میں، مقامی ٹوکن ایک درخواست کی ادائیگی ہے. یہ نیٹ ورک فیس اثاثہ نہیں ہے. سپانسر اب بھی نیٹ ورک فیس ادا کرتا ہے XOR.

مثال کے طور پر، نجی ڈیٹا اسپیس میں مقامی ٹوکن کا استعمال کریں:

```text
usage#billing.team
```

`usage#billing.team` کے ساتھ فنڈ صارفین کو ان بورڈنگ، رکنیت کی تجدید یا کوٹہ مختص کرنے کے دوران. پھر صارف ٹرانزیکشن کو ایٹمی بنائیں:

1. صارف سے اسپانسر کو مقامی ٹوکن منتقل کرنا۔
2. درخواست کردہ ایپ آپریشن انجام دیں۔
3. `fee_sponsor` میٹا ڈیٹا شامل کریں تاکہ اسپانسر XOR ادا کرے۔

ایک کم از کم CLI دھواں ٹیسٹ صرف مقامی ٹوکن کی منتقلی ہے جو XOR کے زیر اہتمام ہے:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

ایک حقیقی ایپ کے لئے، مقامی ٹوکن کی ادائیگی کو علیحدہ بہترین کوشش کی لین دین کے طور پر پیش نہ کریں. ادائیگی اور کاروباری ہدایات دونوں پر مشتمل ایک دستخط شدہ ٹرانزیکشن بنائیں، یا ایک معاہدے کا داخلہ نقطہ ظاہر کریں جو کاروباری آپریشن کو لاگو کرنے سے پہلے مقامی ٹوکر جمع کرتا ہے.

اپنی ایپ یا معاہدے میں تبادلوں کی پالیسی رکھیں:

- کس آپریشن کی لاگت کتنی مقامی ٹوکن یونٹس
- XOR ٹاپ اپ کو سپانسر کرنے کے لئے مقامی ٹوکن انفیلو نقشے کیسے
- اگر صارف کا بیلنس بہت کم ہو تو کیا ہوتا ہے؟
- جب سپانسر XOR بیلنس بہت کم ہو تو کیا ہوتا ہے؟

::: warning

"لوکل ٹوکن فیس" پیٹرن کے لئے `gas_asset_id` کا استعمال نہ کریں جب تک کہ آپ نہیں چاہتے کہ اسپانسر کو اس گیس اثاثے میں بھی چارج کیا جائے۔ موجودہ رن ٹائم میں ، `fee_sponsor` اسپانسر کو پیپ لائن-گیس اثاثہ ڈیبٹس کے لئے ادائیگی کرنے والا بھی بناتا ہے۔ مقامی ٹوکن صارف فیسوں کے لئے، ٹوکن کو صریح طور پر منتقلی یا معاہدے کے اصول کے ساتھ جمع کریں.

:::

## ناکام اسپانسرڈ ٹرانزیکشنز کو ڈیبگ کریں {#debug-failed-sponsored-transactions}

عام ردعمل کی وجوہات عام طور پر ایک لاپتہ ترتیب کے مرحلے کی طرف اشارہ کرتی ہیں:

|غلطی کا متن |کیا چیک کرنا ہے |
| --- | --- |
|`fee sponsorship is disabled` |`nexus.fees.sponsorship_enabled` اب بھی node پر `false` ہے. |
|`fee sponsor is not authorized` |صارف کے پاس اس اسپانسر کے لیے `CanUseFeeSponsor` نہیں ہے۔ |
|`fee asset ... is missing` |سپانسر کے پاس مقررہ XOR فیس اثاثہ نہیں ہے۔ |
|`fee balance ... is insufficient` |سپانسر کے XOR بیلنس میں اضافہ کریں. |
|`fee exceeds sponsor_max_fee` |`sponsor_max_fee` بڑھانا یا ٹرانزیکشن سائز / گیس کو کم کرنا۔ |
|`invalid nexus fee asset id` |فکسڈ `nexus.fees.fee_asset_id` یا XOR اثاثہ کا نام۔ |

جب ڈیبگ پیٹرن 2، دونوں بیلنس چیک کریں:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"

iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

## اسپانسر کو چلائیں {#operate-the-sponsor}

اسپانسر کو خزانہ اکاؤنٹ کے طور پر علاج کریں:

- ٹیسٹ نیٹ، اسٹیجنگ اور مین نیٹ کے لئے الگ الگ سپانسر چابیاں رکھیں
- سپانسر XOR بیلنس داخلہ کی منزل تک پہنچنے سے پہلے انتباہ
- ٹریفک کی خصوصیت کے بعد غیر صفر `sponsor_max_fee` کی حد مقرر کریں۔
- آپ کی درخواست یا گیٹ وے میں شرح کی حد سپانسرڈ لکھتا ہے
- `CanUseFeeSponsor` منسوخ کریں جب صارفین ڈیٹا اسپیس چھوڑ دیں۔
- صارف ٹرانزیکشن ہیشز، مقامی ٹوکن کی ادائیگیوں اور سپانسر XOR ڈیبٹس کو موازنہ کریں

ایک صارف کے لئے اسپانسر شپ منسوخ کریں:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission revoke --id "$USER"
```

## متعلقہ صفحات {#related-pages}

- [SORA Nexus ڈیٹا بیسز](/ur/get-started/sora-nexus-dataspaces.md) سے رابطہ قائم کریں۔
- [Iroha 3 کے ذریعے CLI](/ur/get-started/operate-iroha-via-cli.md) پر کام کریں
- [اثاثہ جات](/ur/blockchain/assets.md)
- [اجازت نامے](/ur/blockchain/permissions.md)
- [اجازت کے ٹوکن](/ur/reference/permissions.md)
