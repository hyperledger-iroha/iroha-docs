---
translation_locale: mn
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Taira-т холбогдоно уу {#connect-to-taira}

## Үр дүн {#outcome}

Taira-д хандаж болох эсэхийг баталгаажуулж, локал клиент тохиргооноос ганц протокол-стандарт I105 дансны ID-г гаргаж, криптографын гарын үсэг зурагчийг тестнет XOR-аар санхүүжүүлж, нэг төлбөрийн үнийн санал бүхий канарей гүйлгээг илгээ. Энэхүү жор нь Minamoto-д бичих үйлдлийг огт илгээдэггүй.

## Өмнөх шаардлага {#prerequisites}

- `curl`, `jq`, Python 3.11 эсвэл шинэчилсэн хувилбар, мөн одоогийн `iroha` ба `kagami` бинар файлууд.
- A `taira.client.toml` нь Taira гинж, API төгсгөл цэг, дансны профайл, болон зориулалтын тестнет түлхүүртэйгээр бүтээгдсэн. [Taira Клиент тохиргоог үүсгэх](/mn/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config)-ийг дагаж, файлыг эх үүсвэрийн хяналтаас гараас хадгална уу.
- [Тестнет XOR-ийг Taira-оос авна уу](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-аас бэлэн ажиллах `taira_faucet_claim.py`, клиент тохиргооны хажууд хадгалагдсан.

## Алхамууд {#steps}

### 1. Амьдралтай байдлыг бэлэн байдлаас салгаж үзэх {#_1-separate-liveness-from-readiness}

`/livez` нь энгийн текст хэлбэрийн процесс амьдралын байдлын шалгагч юм. `/status`, `/health`, ба `/readyz` нь JSON-ыг буцаана. Ажиллаж буй нодууд шаардлагатай дэд систем бөглөрсөн үед readiness шалгагчуудаас `503`-ыг хууль ёсоор буцааж болно.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Зөвхөн `/livez`-г ашиглан процесс хариу өгч байгаа эсэхийг шийдэж ашигла. `/readyz`-ийг тээврийн нэвтрүүлэгт ашиглаж, `503`-г тасралт гэж үзэхээс өмнө түүний JSON хаагчийн дэлгэрэнгүй мэдээллийг шалга.

### 2. Нийтийн оношилгоог ажиллуулна уу {#_2-run-the-public-diagnostics}

Энэ шалгалт зөвхөн унших зориулалттай бөгөөд криптографийн гарын үсэг зурж буй тохиргоог ачаалдаггүй:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Эмч хатуу DNS, TLS гинж, эсвэл API эцсийн цэгийн алдаа мэдээлэх үед бичиж үргэлжлүүлээгүй байх. Дүүрсэн олон нийтийн ээлж түр зуурын шинжтэй; хүлээгээд хязгаарлагдмал бодлоготойгоор дахин оролд.

### 3. Нууцыг хэвлэхгүйгээр Taira дансны ID-г гаргана уу {#_3-derive-the-taira-account-id-without-printing-a-secret}

Зөвхөн тохиргооноос олон нийтийн түлхүүрийг уншиж, дараа нь Taira I105 профайл ашиглан кодлоорой. `[account].domain` утга нь дамжуулалтын контекстыг хангадаг; энэ нь дансны ID-ийн хэсэг биш юм.

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

Гаралт нь домайнгүй нэг протоколын стандарт I105 хаяг юм. `wallet@payments.universal` гэх мэт нэрс нь овог нэрлэсэн нэр бөгөөд хатуу дансны талбарт ашиглагдахаас өмнө шийдэгдэх ёстой.

### 4. Одоогийн Taira төлбөрийн хөрөнгийг шаардъя {#_4-claim-the-current-taira-fee-asset}

Тестнетийн санхүүжилтийн үйлчилгээний хариу нь төлбөрийн активын тодорхойлолтын жинхэнэ эх сурвалж юм. Өөр сүлжээнээс эсвэл хуучин гүйцэтгэлээс ID хуулбарлахын оронд буцаагдсан Base58 ID-г хадгал.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Үлдэгдлийг нэг минут хүртэл давтан шалгана. Санхүүжилтийн гүйлгээ харагдахаас өмнө faucet `202 Accepted` буцааж болно.

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

`gas_asset_id` нь гүйлгээний мета өгөгдөл юм. Ил тод `--fee-payer authority` сонголт нь гарын үсэгтэй холбогдсон байдаг бөгөөд CLI гарын үсэг зурахаас өмнө нарийн төлбөрийн дүнгийн таамаглал авч чадна.

## Баталгаажуулах {#verify}

Лог зааврыг илгээж, JSON протоколын үр дүнгийн бичлэгийг хадгалаад, Applied эцсийн байдлыг хүлээнэ үү. Мөн `--no-wait`-г орхих нь анхны илгээлтийг баталгаажуулалтыг хүлээхэд хүргэдэг; тодорхой статус уншиж үзэх нь эцсийн програм хангамжийн боловсруулалтын ажлын урсгалын төлөвийг нотолдог.

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

Эцсийн команд амжилттай болно зөвхөн гүйлгээ нь анхны `Applied` терминалын төлөвт хүрсний дараа. Туршилтын нотлох баримтанд криптографийн хэшийг хадгал; хувийн түлхүүр эсвэл бүхэл бүтэн клиент тохиргоог үүнтэй хамт хадгалахгүй.

## Алдааг олох болон засах {#troubleshooting}

- `/livez` нь JSON гэж асуусан үед `406`-г буцаадаг, учир нь тэр API төгсгөл нь `text/plain` байдаг. Дээрх шиг `Accept: text/plain`-г илгээнэ үү.
- `/health` эсвэл `/readyz` нь `/livez` ба `/status` ажиллаж байгаа ч машин уншигдах боломжтой саадаар `503` буцааж магадгүй. Тэр саадыг засах эсвэл хүлээнэ үү; түлхүүрийг дахин үүсгэх нь зангилааны бэлэн байдалд нөлөөлөхгүй.
- Faucet-ийн `502`, хугацаа хэтрэлт эсвэл хуучирсан proof-of-work тулгуур нь нийтийн үйлчилгээний алдаа юм. Шинэ таавар авч, дараа дахин оролдоно уу.
- A I105 урд талын алдаа нь олон нийтийн түлхүүрийг буруу профилд кодлосон гэсэн үг юм. `iroha tools address convert --profile taira`-ыг дахин ажиллуулна уу.
- Төлбөрийн үнийн санал татгалзах нь ихэвчлэн зөвшөөрлийн эрхийг санхүүжүүлээгүй, төлбөрийн хөрөнгийн метадата хуучирсан, эсвэл тодорхой төлбөр төлөгчийг сонгоогүй гэсэн утгатай.
- Бүртгэл, гаргалт, эсвэл нэрийн сангийн удирдлагыг энэ канарын амжилттай болсон ч дахин татгалзаж болно. Эдгээр үйлдлүүд нь тусдаа програмын гүйцэтгэх орчны зөвшөөрлийг шаарддаг; Taira эрх олгогдоогүй үед үүсгэсэн дотоод сүлжээг дээр тэдгээрийг дасгал хийж турш.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Taira CLI оношилгоо ба канар эх сурвалж нь түгжсэн эх кодын шинэчлэлд байна](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [Тодорхой төлбөрийн сонголт ба CLI илгээх эх сурвалжийг хатгасан эх кодын хувилбараас](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira данс болон туршилтын сүлжээний санхүүжилтийн үйлчилгээний гарын авлага](/mn/get-started/sora-nexus-dataspaces.md)
- [Клиент тохиргоо](/mn/guide/configure/client-configuration.md)
- [Гүйлгээ](/mn/blockchain/transactions.md)
