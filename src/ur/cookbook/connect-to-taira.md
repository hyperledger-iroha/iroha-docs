---
translation_locale: ur
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Taira سے رابطہ کریں {#connect-to-taira}

## نتیجہ {#outcome}

تصدیق کریں کہ Taira قابل رسائی ہے، مقامی client configuration سے canonical I105 account ID اخذ کریں، signer کو testnet XOR سے فنڈ کریں، اور fee-quoted canary transaction جمع کریں۔ یہ recipe کبھی Minamoto پر write نہیں بھیجتی۔

## لازمی شرائط {#prerequisites}

- `curl` ، `jq`، Python 3.11 یا بعد میں، اور موجودہ `iroha` اور `kagami` بائنری.
- Taira سلسلہ، عین `network_id`، اختتامی نقطہ، اکاؤنٹ پروفائل اور ایک مخصوص ٹیسٹ نیٹ کلید کے ساتھ تخلیق کردہ `taira.client.toml`۔ [ایک Taira کلائنٹ ترتیب بنائیں](/ur/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) پر عمل کریں اور فائل کو ماخذ کنٹرول سے باہر رکھیں۔
- فوسیٹ جرنل کے لیے ایک قابل تحریر ورکنگ ڈائریکٹری: `iroha taira account faucet prepare` نجی طور پر `./taira-faucet` بناتا ہے اور کسی موجودہ ڈائریکٹری کو تبدیل کرنے سے انکار کرتا ہے۔

## قدم {#steps}

### 1۔ تیاری سے زندگی کو الگ کرنا {#_1-separate-liveness-from-readiness}

`/livez`، `/health` اور `/readyz` سادہ متن والے پروب ہیں؛ `/status` JSON واپس کرتا ہے۔ ایک چلتا ہوا نوڈ جائز طور پر `/readyz` سے `503` واپس کر سکتا ہے جب اتفاق رائے میں داخلہ یا کوئی اور مطلوبہ ذیلی نظام دستیاب نہ ہو۔

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

صرف اس بات کا فیصلہ کرنے کے لئے `/livez` استعمال کریں کہ آیا عمل جواب دیتا ہے۔ ٹریفک کے داخلے کے لیے `/readyz` کا استعمال کریں۔ اس کا `503` ایک `service_unavailable` خرابی لفافہ ہے جس میں رکاوٹ کی کوئی تفصیلات نہیں ہوتیں، اس لیے اسے بندش سمجھنے سے پہلے نیچے دی گئی تشخیص چلائیں۔

### 2۔ عوامی تشخیص کی کارروائی {#_2-run-the-public-diagnostics}

یہ چیک صرف پڑھنے کے لئے ہے اور دستخط کنفیگریشن کو لوڈ نہیں کرتا:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

جب ڈاکٹر سخت DNS ، TLS، سلسلہ، یا اختتام پوائنٹ کی خرابی کی اطلاع دیتا ہے تو لکھنا جاری نہ رکھیں. ایک بھرپور عوامی قطار عارضی ہے؛ انتظار کریں اور محدود پالیسی کے ساتھ دوبارہ کوشش کریں۔

### 3۔ Taira اکاؤنٹ ID بغیر کسی راز کی چھپی ہوئی {#_3-derive-the-taira-account-id-without-printing-a-secret}

صرف ترتیب سے عوامی کلید کو پڑھیں، پھر اسے Taira I105 پروفائل کے ساتھ انکوڈ کریں۔ اکاؤنٹ ID میں کوئی ڈومین نہیں ہوتا؛ `[account].profile` صرف اس کا نیٹ ورک سابقہ منتخب کرتا ہے۔

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

فوسیٹ پالیسی موجودہ فیس اثاثہ تعریف کا نام بتاتی ہے۔ کسی دوسرے نیٹ ورک یا پرانے رن سے ID کاپی کرنے کے بجائے اس کا Base58 ID رکھیں۔ پالیسی غیر دستخط شدہ دریافتی ڈیٹا ہے، اس لیے آٹومیشن کو ہر جواب پر بھروسہ کرنے کے بجائے متوقع جاری کنندہ، اثاثہ تعریف اور مقدار کو مقرر کرنا چاہیے۔

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` کام کا ثبوت حل کرتا ہے اور عین دستخط شدہ ٹرانزیکشن محفوظ کرتا ہے؛ `submit` اسے ایک بار بھیجتا ہے اور اس کے لاگو ہونے کے بعد واپس آتا ہے۔ اگر `submit` `Pending` رپورٹ کرے یا اس کا وقت ختم ہو جائے تو ایک اور دعویٰ تیار کرنے کے بجائے اسی ترتیب اور جرنل کے ساتھ `taira account faucet resume` چلائیں۔ پھر زیادہ سے زیادہ ایک منٹ کے لئے بیلنس کا سروے کریں۔

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

ہر Taira تحریر کے لیے `--fee-payer authority` استعمال کریں۔ یہ انتخاب دستخط سے بندھا ہوا ہے، اور CLI دستخط سے پہلے Taira کے فیس اثاثے میں عین فیس کی کوٹیشن دیتا ہے۔

## تصدیق کریں {#verify}

لاگ ان کی ہدایات جمع کروائیں ، JSON رسید کو برقرار رکھیں ، اور لاگو ہونے والی فائنلٹی کا انتظار کریں۔ `--no-wait` جاری کرنے سے ابتدائی جمع کروانے کی تصدیق کے منتظر بھی ہوتا ہے۔ صریح حیثیت پڑھنے سے پائپ لائن کی حتمی حالت ثابت ہوتی ہے۔

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

آخری کمانڈ صرف اس وقت کامیاب ہوتی ہے جب عین عالمی حیثیت حالت سے طے شدہ `Applied` حتمیت رپورٹ کرے۔ ٹیسٹ کے ثبوت میں ہیش رکھیں؛ کبھی بھی نجی کلید یا کلائنٹ کی مکمل ترتیب کو اس کے ساتھ ذخیرہ نہ کریں۔

## خرابی کا سراغ لگانا {#troubleshooting}

- `/livez`، `/health` اور `/readyz` صرف JSON مانگنے پر `406` واپس کرتے ہیں کیونکہ وہ `text/plain` میں جواب دیتے ہیں۔ اوپر دکھائے گئے `Accept` ہیڈرز بھیجیں۔
- `/readyz` `service_unavailable` خرابی لفافے کے ساتھ `503` واپس کر سکتا ہے، یہاں تک کہ جب `/livez` اور `/status` کام کر رہے ہوں۔ تیاری کا انتظار کریں یا `iroha taira doctor` چلائیں؛ چابیاں دوبارہ بنانے سے نوڈ کی تیاری تبدیل نہیں ہوگی۔
- `submit` کے دوران فوسیٹ کا `502` یا ٹائم آؤٹ دعوے کا نتیجہ نامعلوم چھوڑ دیتا ہے: ایک اور دعویٰ تیار کرنے کے بجائے اسی ترتیب اور جرنل کے ساتھ `taira account faucet resume` چلائیں۔ کام کے ثبوت کا پرانا اینکر `prepare` کو ناکام کر دیتا ہے؛ نئی جرنل ڈائریکٹری میں دوبارہ تیار کریں۔
- I105 پریفیکس کی خرابی کا مطلب ہے کہ عوامی کلید کو غلط پروفائل کے ساتھ کوڈ کیا گیا تھا۔ دوبارہ چلائیں `iroha tools address convert --profile taira`۔
- فیس کوٹیشن کے مسترد ہونے کا مطلب عام طور پر یہ ہوتا ہے کہ اتھارٹی کو فنڈ نہیں دیا گیا یا ترتیب شدہ `network_id` Taira کا نہیں ہے۔ غائب `--fee-payer`، یا `--metadata` میں `gas_asset_id` جیسی فیس کلید، کوٹیشن سے پہلے ہی مقامی طور پر ناکام ہو جاتی ہے۔
- اس کینری کے کامیاب ہونے کے بعد بھی رجسٹریشن ، مائننگ ، یا ناموں کی جگہ کا انتظام مسترد کیا جاسکتا ہے۔ ان کارروائیوں کو الگ سے رن ٹائم اجازتیں درکار ہوتی ہیں۔ جب Taira تک رسائی نہیں دی گئی ہے تو پیدا کردہ مقامی نیٹ ورک پر ان کا تجربہ کریں۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- مقررہ commit پر [Taira CLI تشخیص اور کینری ماخذ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) اور [فوسیٹ کمانڈز](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs)
- [واضح طور پر فیس کا انتخاب اور مقررہ کمیٹ ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs) میں جمع کرانے کا ذریعہ CLI
- [Taira اکاؤنٹ اور فوسیٹ گائیڈ](/ur/get-started/sora-nexus-dataspaces.md)
- [کلائنٹ کی ترتیب](/ur/guide/configure/client-configuration.md)
- [لین دین](/ur/blockchain/transactions.md)
