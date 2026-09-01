---
translation_locale: mn
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Гүйлгээг илгээж шалгах {#submit-and-verify-transactions}

## Үр дүн {#outcome}

Taira гүйлгээг урьдчилан шалгаж, яг өртөгийн тооцоог хүлээн авч, гарын үсэг зураад илгээ, дууссан эцсийн байдлыг хүлээж, криптографын хэшээр эцсийн гүйлгээг баталгаажуул.

## Өмнөх шаардлагууд {#prerequisites}

- Санхүүжүүлсэн `taira.client.toml`, `taira.tx-metadata.json`, ба `TAIRA_ACCOUNT_ID` нь [Taira-д холбогдох](./connect-to-taira.md)-аар бүтээгдсэн.
- Одоогийн `iroha` CLI ба `jq`.
- Нэг удаагийн Taira криптограф гарын үсэг. Түүний түлхүүрийг болон эдгээр бичих командыг Minamoto дахин ашиглаж болохгүй.

## Алхамууд {#steps}

### 1. API төгсгөл цэг, зөвшөөрлийн гол элемент, төлбөрийн үлдэгдлийг урьдчилан шалгах {#_1-preflight-the-endpoint-authority-and-fee-balance}

Эхлээд дарааллын цэгийн хугацааны өгөгдлийн үзэлтийг уншина, дараа нь эрх олгох үндсэн хэрэглэгчийн хураамжийн үлдэгдэл харагдаж байгааг нотлоно. Холболтын жор бүтээсэн метадатаас Base58 хөрөнгийн тодорхойлолтын ID-г уншина.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Хэрэв данс эсвэл төлбөрийн үлдэгдэл байхгүй бол зогсооно. Үндэслэл эрхийг төлөх боломжгүй үед хүчинтэй заавар төлбөрийн баталгааг гүйцлээж чадахгүй.

### 2. Эхлээд иш татаж, гарын үсэг зураад, нэг удаа илгээнэ {#_2-quote-sign-and-submit-once}

CLI нь төлбөрийн үнийн тооцооны төлөө яг тохирсон гарын үсэггүй өгөгдлийг илгээж, хүлээн зөвшөөрөгдсөн төлбөрийн санааг гүйлгээнд холбож, гарын үсэг зуравчлан илгэнэ. JSON горим нь гүйлгээний криптографын хэш, гарын үсэгтэй гүйлгээ, хүлээн зөвшөөрөгдсөн үнийн дүнг хамтад нь буцаана.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

Энэ жоронд `--no-wait` ашиглах ёсгүй. Тушаал амжилттай протоколын үр дүнгийн бичлэг хийхийн өмнө баталгаажуулалтыг хүлээнэ.

### 3. Терминалийн програмын боловсруулалтын урсгалын төлөвийг хүлээнэ үү {#_3-wait-for-terminal-pipeline-state}

Амжилтыг HTTP хүлээн авах эсвэл ээлжинд орох байдлаас таамаглахын оронд бичсэн статус туслахыг ашигла. `--wait` ашиглахад аюулгүй чиглүүлэлтийн хүрээ автоматаар сонгогдож, анхны зориулалт нь Applied finality болно.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` ба `Expired` нь эцсийн алдаа бөгөөд дахин оролдож болно гэдэг амжилттай төлөв биш юм. Гүйлгээг өөрчлөх эсвэл дахин байгуулахын өмнө тэдгээрийн шалтгааныг тэмдэглэ.

### 4. Хадгалагдсан гүйлгээг уншина уу {#_4-read-the-stored-transaction}

програм хангамжийн боловсруулах урсгалын төлөв боловсруулах дууссан эсэхийг хариулах. Гүйлгээний лавлагаа нь хүлээн авсан гүйлгээ ижил криптографын хэш дор хадгалагдсан эсэхийг баталгаажуулдаг.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Explorer нь зөвхөн унших хоёр дахь ажиглалтын гадаргуу бөгөөд боловсруулалтын урсгалын эцэслэлтээс богино хугацаагаар хоцорч болно.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Төлөвийг өөрчилдөг зааварчилгааны хувьд өөрчлөгдсөн объектруу хандах асуултаар дуусгана. [Метадата](./metadata.md), [Ширээний хөрөнгө](./fungible-assets.md), ба [NFTs](./nfts.md) жорууд эдгээр төлөвийн дараах уншлагуудыг агуулсан.

## Баталгаажуулах {#verify}

Бүх гурван бүртгэл нэг криптографын хэшээр тохирч байгаа эсэхийг шалгаад, эксплорерийг хүлээгдэж буй төлөвийг дахин мэдээлэхгүй байгаа эсэхийг шалгаарай:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Илгээх протоколын үр дүнгийн бүртгэл болон эцсийн төлөвийг туршилтын нотолгоо болгон хадгал. Тэд гарын үсгийн түлхүүр биш, олон нийтийн гүйлгээний материалыг агуулдаг.

## Алдааг арилгах {#troubleshooting}

- HTTP `202` эсвэл дараалалд орсон төлөв нь зөвхөн хүлээн авсныг баталдаг. Өргөдлөө явуулсан, Татгалзсан, Хүчинтэй хугацаа дууссан, эсвэл заагдсан хугацаа дуусах хүртэл бичигдсэн төлөвийг шалгаж үргэлжлүүлээрэй.
- Хэрэв оруулсан мэдүүлэг криптографын хэшийг буцаасны дараа хугацаа хэтэрвэл, өөр нэг гүйлгээ хийхээс өмнө тэр криптографын хэшийг лавлана уу. Нүдгүй дахин илгээх нь шинэ иш татсан ба гарын үсэг зурсан өгөгдлийг үүсгэнэ.
- Төлбөрийн үнийн санал гарын үсэг зурхаас өмнө татгалзаж болно. `--fee-payer authority`, `gas_asset_id`, баталгаажуулах эрх бүхий хүний баланс болон сүлжээний гинжний ID-г шалгана уу.
- `Rejected` нь ихэвчлэн зааварчилгааны баталгаажуулалт, зөвшөөрөл, шимтгэл эсвэл хуучирсан төлөвийг илтгэнэ. Энэ нь амжилтгүй гүйцэтгэлийн эцсийн нотлох баримт бөгөөд тээврийн дахин оролдоогоор дахин ангилагдаж болохгүй.
- Хүрээлэгч `404` Apply хийгдсэн даруйд индексжих саатал үүсч болзошгүй. Уншигдахыг дахин оролдоно уу; гүйлгээг дахин илгээгээрэй.
- Хэрэв давуу эрхтэй заавар үүсгэсэн локалнет дээр ажиллахад Taira үүнийг хүлээн авдаггүй бол яг таг Taira зөвшөөрөл эсвэл удирдлагын нэрийн орон тоонд хуваарилалтыг авна уу. Локал үр дүн нийтэд нээлттэй блокчэйн сүлжээний эрх олгох гол эрхийг олгохгүй.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Гүйлгээ илгээх ба тавигдсан эх кодын засварт төлбөрийн үнийн санал оруулах](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Гүйлгээ баталгаажуулалтын хэрэгжилт ба туршилтуудыг тогтсон эх кодын хувилбарт](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [Гүйлгээ](/mn/blockchain/transactions.md)
- [CLI гарын авлага](/mn/get-started/operate-iroha-via-cli.md)
- [Torii API төгсгөлүүд](/mn/reference/torii-endpoints.md)
