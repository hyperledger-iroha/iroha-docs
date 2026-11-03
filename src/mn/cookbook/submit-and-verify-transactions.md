---
translation_locale: mn
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: de608ef52ad3a999c0e253e6683e454f8f66f399a690dce4c2185c79d02334cd
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Гүйлгээг илгээж шалгах {#submit-and-verify-transactions}

## Үр дүн {#outcome}

Taira гүйлгээг урьдчилан шалгаж, яг өртөгийн тооцоог хүлээн авч, гарын үсэг зураад илгээ, дууссан эцсийн байдлыг хүлээж, криптографын хэшээр эцсийн гүйлгээг баталгаажуул.

## Өмнөх шаардлагууд {#prerequisites}

- [Taira-д холбогдох](./connect-to-taira.md) жорын үүсгэсэн, санхүүжүүлсэн `taira.client.toml`, `taira-faucet-policy.json` болон `TAIRA_ACCOUNT_ID`. Бичих үйлдлүүд `--fee-payer authority`-г ашигладаг; CLI нь гарын үсэг зурахаас өмнө яг төлбөрийг Taira-ийн төлбөрийн хөрөнгөөр тооцоолж, үнийн санал гаргадаг.
- Одоогийн `iroha` CLI ба `jq`.
- Нэг удаагийн Taira криптограф гарын үсэг. Түүний түлхүүрийг болон эдгээр бичих командыг Minamoto дахин ашиглаж болохгүй.

## Алхамууд {#steps}

### 1. API төгсгөл цэг, зөвшөөрлийн гол элемент, төлбөрийн үлдэгдлийг урьдчилан шалгах {#_1-preflight-the-endpoint-authority-and-fee-balance}

Эхлээд дарааллын агшин зуурын төлөвийг уншаад, дараа нь эрх бүхий дансны төлбөрийн үлдэгдэл харагдаж байгааг нотол. Base58 хөрөнгийн тодорхойлолтын ID-г холболтын жорын хадгалсан faucet-ийн бодлогоос унш.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet-policy.json)"

iroha --config ./taira.client.toml account get \
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
  tx ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

Энэ жоронд `--no-wait` ашиглах ёсгүй. Тушаал амжилттай протоколын үр дүнгийн бичлэг хийхийн өмнө баталгаажуулалтыг хүлээнэ.

### 3. Терминалийн програмын боловсруулалтын урсгалын төлөвийг хүлээнэ үү {#_3-wait-for-terminal-pipeline-state}

HTTP хүлээн авалт эсвэл дараалалд орсноос амжилтыг таамаглахын оронд төрөлжсөн статусын туслах функцийг ашигла. `--wait`-тэй үед CLI яг глобал статусыг давтан шалгаж, зөвхөн төлөвөөс тодорхойлогдсон `Applied` эцсийн байдал дээр амжилттай болно.

```bash
iroha --config ./taira.client.toml \
  --machine \
  tx status \
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
  tx get --hash "$TAIRA_TX_HASH" \
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

Гурван бичлэг бүгд ижил хэш дээр тохирч байгаа болон эксплорер `Rejected` биш `Committed` гэж мэдээлж байгааг шалга:

```bash
jq -e --arg hash "$TAIRA_TX_HASH" \
  '.hash == $hash and .terminal_kind == "Applied"' taira-final-status.json

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '(.hash | ascii_downcase | ltrimstr("hash:") | split("#")[0]) == $hash
      and .status == "Committed"'
```

Илгээх протоколын үр дүнгийн бүртгэл болон эцсийн төлөвийг туршилтын нотолгоо болгон хадгал. Тэд гарын үсгийн түлхүүр биш, олон нийтийн гүйлгээний материалыг агуулдаг.

## Алдааг арилгах {#troubleshooting}

- HTTP `202` эсвэл дараалалд орсон төлөв нь зөвхөн хүлээн авсныг баталдаг. Өргөдлөө явуулсан, Татгалзсан, Хүчинтэй хугацаа дууссан, эсвэл заагдсан хугацаа дуусах хүртэл бичигдсэн төлөвийг шалгаж үргэлжлүүлээрэй.
- Хэрэв оруулсан мэдүүлэг криптографын хэшийг буцаасны дараа хугацаа хэтэрвэл, өөр нэг гүйлгээ хийхээс өмнө тэр криптографын хэшийг лавлана уу. Нүдгүй дахин илгээх нь шинэ иш татсан ба гарын үсэг зурсан өгөгдлийг үүсгэнэ.
- Төлбөрийн үнийн санал гарын үсэг зурахаас өмнө татгалзагдаж болно. `--fee-payer authority`, эрх бүхий дансны үлдэгдэл, тохируулсан `chain` болон `network_id`-г шалгаж, `--metadata` нь `gas_asset_id` зэрэг төлбөрийн түлхүүр агуулаагүй эсэхийг шалга.
- `Rejected` нь ихэвчлэн зааварчилгааны баталгаажуулалт, зөвшөөрөл, шимтгэл эсвэл хуучирсан төлөвийг илтгэнэ. Энэ нь амжилтгүй гүйцэтгэлийн эцсийн нотлох баримт бөгөөд тээврийн дахин оролдоогоор дахин ангилагдаж болохгүй.
- Хүрээлэгч `404` Apply хийгдсэн даруйд индексжих саатал үүсч болзошгүй. Уншигдахыг дахин оролдоно уу; гүйлгээг дахин илгээгээрэй.
- Хэрэв давуу эрхтэй заавар үүсгэсэн локалнет дээр ажиллахад Taira үүнийг хүлээн авдаггүй бол яг таг Taira зөвшөөрөл эсвэл удирдлагын нэрийн орон тоонд хуваарилалтыг авна уу. Локал үр дүн нийтэд нээлттэй блокчэйн сүлжээний эрх олгох гол эрхийг олгохгүй.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Гүйлгээ илгээх ба тавигдсан эх кодын засварт төлбөрийн үнийн санал оруулах](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Гүйлгээ баталгаажуулалтын хэрэгжилт ба туршилтуудыг тогтсон эх кодын хувилбарт](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/client.rs)
- [Гүйлгээ](/mn/blockchain/transactions.md)
- [CLI гарын авлага](/mn/get-started/operate-iroha-via-cli.md)
- [Torii API төгсгөлүүд](/mn/reference/torii-endpoints.md)
