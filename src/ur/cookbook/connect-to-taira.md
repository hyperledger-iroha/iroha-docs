---
translation_locale: ur
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 263e058a0877e1a3c48b6514b127bc56022e3d244284e0b72881743a4aee0f58
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Taira سے رابطہ کریں {#connect-to-taira}

## نتیجہ {#outcome}

اس بات کی تصدیق کریں کہ Taira قابل رسائی ہے، مقامی کلائنٹ ترتیب سے کینیکل I105 اکاؤنٹ ID حاصل کریں، ٹیسٹ نیٹ XOR کے ساتھ دستخط کنندہ کو فنڈ دیں، اور ایک فیس کوٹیڈ کینری ٹرانزیکشن پیش کریں۔ یہ نسخہ کبھی بھی Minamoto پر لکھنا نہیں بھیجتا ہے۔

## لازمی شرائط {#prerequisites}

- `curl` ، `jq`، Python 3.11 یا بعد میں، اور موجودہ `iroha` اور `kagami` بائنری.
- Taira سلسلہ، اختتامی نقطہ، اکاؤنٹ پروفائل اور ایک مخصوص ٹیسٹ نیٹ کلید کے ساتھ تخلیق کردہ `taira.client.toml`۔ [ کی پیروی کریں۔ Taira کلائنٹ ترتیب](/ur/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) بنائیں اور فائل کو ماخذ کنٹرول سے باہر رکھیں.
- [Get Testnet XOR سے Taira](/ur/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) پر چلانے کے لئے تیار `taira_faucet_claim.py` ، کلائنٹ ترتیب کے ساتھ محفوظ کیا گیا ہے۔

## قدم {#steps}

### 1۔ تیاری سے زندگی کو الگ کرنا {#_1-separate-liveness-from-readiness}

`/livez` ایک سادہ متن کے عمل کی زندگی استحکام زونڈ ہے۔ `/status`، `/health`، اور `/readyz` واپسی JSON. ایک چلنے والے نوڈ قانونی طور پر تیاری زونڈز سے `503` واپس کر سکتا ہے جب مطلوبہ ذیلی نظام کو مسدود کیا جاتا ہے۔

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

صرف اس بات کا فیصلہ کرنے کے لئے `/livez` استعمال کریں کہ آیا عمل جواب دیتا ہے۔ ٹریفک میں داخل ہونے کے لیے `/readyz` کا استعمال کریں اور `503` کو معاوضہ قرار دینے سے پہلے اس کے JSON بلاکٹر کی تفصیلات چیک کریں۔

### 2۔ عوامی تشخیص کی کارروائی {#_2-run-the-public-diagnostics}

یہ چیک صرف پڑھنے کے لئے ہے اور دستخط کنفیگریشن کو لوڈ نہیں کرتا:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

جب ڈاکٹر سخت DNS ، TLS، سلسلہ، یا اختتام پوائنٹ کی خرابی کی اطلاع دیتا ہے تو لکھنا جاری نہ رکھیں. ایک بھرپور عوامی قطار عارضی ہے؛ انتظار کریں اور محدود پالیسی کے ساتھ دوبارہ کوشش کریں۔

### 3۔ Taira اکاؤنٹ ID بغیر کسی راز کی چھپی ہوئی {#_3-derive-the-taira-account-id-without-printing-a-secret}

صرف ترتیب سے عوامی کلید کو پڑھیں ، پھر اسے Taira I105 پروفائل کے ساتھ انکوڈ کریں۔ `[account].domain` قدر روٹنگ کا تناظر فراہم کرتی ہے۔ یہ اکاؤنٹ ID کا حصہ نہیں ہے.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

آؤٹ پٹ ایک ڈومین لیس کینونیکل I105 ایڈریس ہے۔ `wallet@payments.universal` جیسے نام مستعار ہیں اور سخت اکاؤنٹ فیلڈز میں استعمال ہونے سے پہلے ان کا حل کرنا ضروری ہے۔

### موجودہ Taira فیس اثاثہ کا دعویٰ کرنا۔ {#_4-claim-the-current-taira-fee-asset}

نل کا جواب فیس اثاثہ کی تعریف کے لئے سچائی کا ذریعہ ہے۔ کسی دوسرے نیٹ ورک یا پرانے رن سے ID کو کاپی کرنے کے بجائے واپس آنے والے بیس 58 ID کو رکھیں.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

زیادہ سے زیادہ ایک منٹ کے لئے بیلنس کا سروے کریں۔ فنڈنگ ٹرانزیکشن دیکھنے میں آنے سے پہلے نل `202 Accepted` واپس کر سکتا ہے۔

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

`gas_asset_id` ٹرانزیکشن میٹا ڈیٹا ہے۔ صریح `--fee-payer authority` انتخاب دستخط پر پابند ہے ، اور CLI اس کی دستخط کرنے سے پہلے ایک عین مطابق فیس کا حوالہ حاصل کرتا ہے۔

## تصدیق کریں {#verify}

لاگ ان کی ہدایات جمع کروائیں ، JSON رسید کو برقرار رکھیں ، اور لاگو ہونے والی فائنلٹی کا انتظار کریں۔ `--no-wait` جاری کرنے سے ابتدائی جمع کروانے کی تصدیق کے منتظر بھی ہوتا ہے۔ صریح حیثیت پڑھنے سے پائپ لائن کی حتمی حالت ثابت ہوتی ہے۔

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

آخری کمانڈ صرف اس وقت کامیاب ہوتی ہے جب ٹرانزیکشن ڈیفالٹ `Applied` ٹرمینل ریاست تک پہنچ جاتا ہے۔ ٹیسٹ کے ثبوت میں ہیش رکھیں؛ کبھی بھی نجی کلید یا کلائنٹ کی مکمل ترتیب کو اس کے ساتھ ذخیرہ نہ کریں۔

## خرابی کا سراغ لگانا {#troubleshooting}

- `/livez` واپس کرتا ہے `406` جب پوچھا جاتا ہے کہ JSON کیونکہ یہ اختتامی نقطہ `text/plain` ہے۔ اوپر دکھایا گیا ہے کے طور پر `Accept: text/plain` بھیجیں.
- `/health` یا `/readyz` `503` کو مشین پڑھنے کے قابل بلاکر کے ساتھ واپس کر سکتے ہیں یہاں تک کہ جب `/livez` اور `/status` کام کرتے ہیں۔ اس بلاکر کی مرمت کریں یا انتظار کریں۔ بازیافت کرنے والی چابیاں نوڈ کی تیاری کو تبدیل نہیں کریں گی۔
- ایک نل `502`، ٹائم آؤٹ، یا پرانی کام کا ثبوت لنگر عوامی خدمت کی ناکامی ہے. ایک نیا پہیلی لانا اور بعد میں دوبارہ کوشش کریں.
- I105 پریفیکس کی خرابی کا مطلب ہے کہ عوامی کلید کو غلط پروفائل کے ساتھ کوڈ کیا گیا تھا۔ دوبارہ چلائیں `iroha tools address convert --profile taira`۔
- فیس کی کوٹ کو مسترد کرنے کا مطلب عام طور پر یہ ہوتا ہے کہ اتھارٹی کو فنڈ نہیں دیا گیا تھا، فیس اثاثے کے میٹا ڈیٹا متروک ہیں، یا کوئی واضح فیس ادا کرنے والا منتخب نہیں کیا گیا تھا.
- اس کینری کے کامیاب ہونے کے بعد بھی رجسٹریشن ، مائننگ ، یا ناموں کی جگہ کا انتظام مسترد کیا جاسکتا ہے۔ ان کارروائیوں کو الگ سے رن ٹائم اجازتیں درکار ہوتی ہیں۔ جب Taira تک رسائی نہیں دی گئی ہے تو پیدا کردہ مقامی نیٹ ورک پر ان کا تجربہ کریں۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [Taira CLI تشخیص اور پنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs) پر کینری ذریعہ۔
- [واضح طور پر فیس کا انتخاب اور مقررہ کمیٹ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs) میں جمع کرانے کا ذریعہ CLI
- [Taira اکاؤنٹ اور نل گائیڈ](/ur/get-started/sora-nexus-dataspaces.md)
- [کلائنٹ کی ترتیب](/ur/guide/configure/client-configuration.md)
- [لین دین](/ur/blockchain/transactions.md)
