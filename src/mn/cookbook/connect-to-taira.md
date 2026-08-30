---
translation_locale: mn
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 263e058a0877e1a3c48b6514b127bc56022e3d244284e0b72881743a4aee0f58
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Taira-д холбох {#connect-to-taira}

## Үр дүн {#outcome}

Taira нь хүрэлцэх боломжтой гэдгийг баталгаажуулах, орон нутгийн үйлчлүүлэгчдийн конфигурацын ID санхүүжилтээс Canonical I105 дансыг олж авах, гарын үсэг зурагчдаа testnet XOR ашиглан санхүүжүүлэх, нэг төлбөрийн дуудлагатай Canary гүйлгээг өргөн мэдүүлэх. Энэ рецепт хэзээ ч Minamoto-д бичиг илгээдэггүй.

## Урьдчилсан шаардлага {#prerequisites}

- `curl`, `jq`, Python 3.11 болон дараагийн, одоогийн `iroha` болон `kagami` хосууд.
- А `taira.client.toml` бүтээгдсэн Taira зангил, төгсгөлийн цэг, бүртгэлийн хувилбар, шинжилгээний сүлжээний зориулалттай түлхүүр [A-г бий болгох Taira Хэрэглэгчийн тасалбар](/mn/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) файлыг эх үүсвэрийн хяналтаас хол байлгаарай.
- Хөдөлмөрийн бэлэн `taira_faucet_claim.py` нь [Get Testnet XOR-ээс Taira](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) дээр хадгалагдаж байгаа бөгөөд энэ нь үйлчлүүлэгчдийн конфигурацийн дэргэд хадгалдаг.

## Хадгалт {#steps}

### 1. Амьдрал, бэлэн байдлыг тусгаарлах {#_1-separate-liveness-from-readiness}

`/livez` нь энгийн тексттэй үйл явцын амьжиргааны зонд юм. `/status`, `/health` болон `/readyz` буцаах JSON. Үйл ажиллагаа явуулж буй түймэр шаардлагатай дэд систем хаагдсаны дараа бэлэн байдлын зондээс хууль ёсны байдлаар `503` буцааж болно.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez` нь зөвхөн үйл явцыг хариулах эсэхээ шийдэхийн тулд ашиглана. Замын хөдөлгөөнийг нэвтрүүлэхэд `/readyz` -ийг хэрэглэж, `503`-ийг хориотой гэж үзэхээс өмнө JSON -ийн блокерын мэдээллийг хянах болно.

### 2. Олон нийтийн оношилгоо хийх {#_2-run-the-public-diagnostics}

Энэхүү шалгалт нь зөвхөн уншихад зориулагдсан бөгөөд гарын үсэг зурагчны конфигуралыг борлуулахгүй:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Эмч нь DNS, TLS, сүлжээ эсвэл төгсгөлийн нүктейн алдааг мэдээлсэн тохиолдолд бичгээ үргэлжлүүлэхгүй байх. Олон нийтийн шуурхай нь дамжин өнгөрдөг; хязгаарлагдмал бодлогын дагуу хүлээх, дахин туршиж үзэх хэрэгтэй.

### 3. Taira бүртгэл ID-ийг нууц хэвлэхгүйгээр гаргана. {#_3-derive-the-taira-account-id-without-printing-a-secret}

Зөвхөн конфигурацын олон нийтийн түлхэгийг уншина уу, дараа нь Taira I105 профилийн дагуу кодлуулна. `[account].domain` үнэ цэнэ маршрутизарын хүрээнд өгдөг; энэ нь ID дансны нэг хэсэг биш юм.

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

Энэ нь доменгүй I105 каноникийн хаяг юм. `wallet@payments.universal` гэх мэт нэрүүд нууц үсэг бөгөөд тэдгээрийг хатуу бүртгэлийн талбайд ашиглахаас өмнө шийдэх ёстой.

### 4. Одоогийн Taira төлбөрийн хөрөнгө шаард {#_4-claim-the-current-taira-fee-asset}

Нүүрний хариу нь төлбөрийн хөрөнгийн тодорхойлолтын үнэн эх үүсвэр юм. Буцаж ирсэн Base58 ID -ийг өөр сүлжээ эсвэл хуучин түвшинээс ID-г нунтаглах оронд хадгалж үлдээрэй.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Хамгийн ихдээ нэг минутын турш тэнцвэрийг шалгаарай. Төсвийн санхүүжилтийн гүйлгээ харагдахаас өмнө `202 Accepted` шилжүүлэн өгөх боломжтой.

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

`gas_asset_id` нь гүйлгээний метадэтгэл юм. `--fee-payer authority`-ийн тодорхой сонгон шалгаруулалт гарын үсэгт байгуулсан бөгөөд CLI нь гарын үсгийн өмнө тохирсон төлбөрийн санал авдаг байна.

## Бүртгэнэ {#verify}

JSON квитанг хадгалж, хэрэглэгдэх эцсийн хугацааг хүлээх. `--no-wait`-ийг гаргах нь анхны өргөн мэдүүлгийг баталгаажуулах хүртэл хүлээхэд хүргэдэг; тодорхой байдлын уншсан нь түлхүүрний эцсийн байдлыг батлах болно.

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

Эцсийн захирамж нь гүйлгээний үндсэн `Applied` терминалын байдалд хүрсний дараа л амжилттай байдаг. Хэс хэшиг туршилтын баримтад хадгалах; хувийн түлхүүр эсвэл бүхэл бүтэн үйлчлүүлэгчийн конфигуратыг хэзээ ч хадгалахгүй.

## Ашигтвортой байдлын асуудал {#troubleshooting}

- `/livez` эргэлт `406` хүсэлт гаргасан тохиолдолд JSON Учир нь энэ төгсгөл нь `text/plain`. Элчүүлнэ `Accept: text/plain` Дээр нь харагдаж байна.
- `/health` эсвэл `/readyz` нь `/livez` болон `/status` ажиллаж байгаа үед ч машин уншигч блокерээр `503`-ийг буцааж болно. Энэ блокерийг байлгах эсвэл хүлээх; сэргээгдэх түлхүүд түймрийн бэлэн байдлыг өөрчлөхгүй.
- Нүүр хуудас `502`, цаг хугацааны хорио, эсвэл хөдөлмөрийн батлан баталгаажуулалт нь төрийн үйлчилгээний алдаа юм. Шинэ цогцолборыг аваад дараа дахин туршиж үзээрэй
- Нүүр хуудас I105 Prefix алдаа нь олон нийтийн түлхүүр буруу хувилбартай кодлогдсон гэсэн үг юм. `iroha tools address convert --profile taira`.
- Төлбөрийн цээрийг татгалзах нь ерөнхийдөө эрх мэдлийг санхүүжүүлээгүй, төлбөрийн хөрөнгийн метадэт өгөгдөл хуучирсан эсвэл тодорхой төлбөрийн төлөөлөгч байхгүй гэсэн үг юм.
- Энэ канар нь амжилттай болсноос хойш бүртгэл, монтаж, эсвэл нэр дэвшилтэт газрын менежментийг үгүйсгэх боломжтой. Эдгээр үйл ажиллагаанууд нь хориотой хугацааны тусгай зөвшөөрлийг шаарддаг; тэдгээрийг туршиж үзэх Taira хангамжийг олгоогүй тохиолдолд үүсгэсэн орон нутгийн сүлжээ.

## Эх сурвалж, холбогдох баримт бичгүүд {#source-and-related-docs}

- [Taira CLI Хөгжлийн хяналт-шинжилгээний систем](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [Нөхөн төлбөрийн сонгон шалгаруулалт, CLI өргөн мэдүүлэх эх үүсвэрийн тухай ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira бүртгэл, крангийн удирдамж](/mn/get-started/sora-nexus-dataspaces.md)
- [Хэрэглэгчийн конфигурац](/mn/guide/configure/client-configuration.md)
- [Арилжаа](/mn/blockchain/transactions.md)
