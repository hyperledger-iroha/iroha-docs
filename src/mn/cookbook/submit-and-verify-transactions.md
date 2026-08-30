---
translation_locale: mn
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 01907ea433e711cb0b1aa327d46c44744aad0a7571a65430dddd7a8aed3df373
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Арилжааны төлбөрийг илгээж шалгах {#submit-and-verify-transactions}

## Үр дүн {#outcome}

Taira гүйлгээг урьдчилан зохион байгуулж, тохирсон төлбөрийн саналыг хүлээн зөвшөөрч, гарын үсэг зурж, өргөн мэдүүлж, хэрэглээний эцсийн хугацааг хүлээгээд, үүрэг гүйцэтгэсэн гүйлгэнийг хэшээр шалгаж байна.

## Урьдчилсан шаардлага {#prerequisites}

- Санхүүжүүлсэн `taira.client.toml`, `taira.tx-metadata.json`, болон `TAIRA_ACCOUNT_ID` үйлдвэрлэсэн [Нэвтрүүлэг Taira](./connect-to-taira.md).
- Одоогийн `iroha` CLI болон `jq`.
- Нэг удаа хэрэглэх Taira гарын үсэг зурагч. Minamoto дээр түүний мөрийг болон эдгээр захиалгыг дахин ашиглахгүй байх.

## Хадгалт {#steps}

### 1. Хөгжлийн бодлого, эрх мэдэл, төлбөрийн тэнцвэрт байдлыг урьдчилан сэргийлэх {#_1-preflight-the-endpoint-authority-and-fee-balance}

Эхлээд хувилбарыг уншина уу, дараа нь байгууллагын төлбөрийн тэнцвэр харагдаж байгааг баталгаажуулна уу. Байгууллагын рецептээс үүсгэсэн метадатаас Base58 активын тодорхойлолтыг ID уншина уу.

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

Санхүүжилт, төлбөрийн үлдэгдэл байхгүй бол зогсоо. Эрх мэдүүлэг нь төлбөрөө төлөхгүй бол төлбөрийг хүлээн авах боломжгүй.

### 2. Нэг удаа дуудлага, гарын үсэг зурж, хүргүүлнэ {#_2-quote-sign-and-submit-once}

CLI нь төлбөрийн санал авахын тулд яг гарын үсэг зурдаггүй ашиг ачааллыг илгээж, хүлээн зөвшөөрөгдсөн төлбөрийн санааг гүйлгээнд холбож, гарын үсгийн дагуу ирүүлнэ. JSON хэлбэр нь гүйлгээний хэш, гарын үсгүүцсэн гүйлгээ, хүлээн авсан өрсөлдөөнийг хамтдаа эргүүлэнэ.

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

Энэ рецепт дээр `--no-wait` -ийг бүү ашигла. Тус команд амжилттай хүлээн авахын өмнө баталгааг хүлээх болно.

### 3. Төмөр замын бүтээн байгуулалтын төлөв байдлыг хүлээх. {#_3-wait-for-terminal-pipeline-state}

HTTP хүлээн зөвшөөрөгдсөн эсвэл шуурхайны элснээс амжилтыг дүгнэхийн оронд түрүүлсэн байдлын туслалцааг ашигла. `--wait` -ийн тусламжтайгаар аюулгүй чиглэлийн цар хүрээ автомат сонгогддог бөгөөд урьдчилан сэргийлэх зорилт нь хэрэглэгдэх эцсийн байдал юм.

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

`Rejected` болон `Expired` нь эцсийн алдаа, сэргээгдэх амжилтын мэдүүлэг биш юм. Транзакцын өөрчлөлт эсвэл нөхөн бүтээн байгуулалтыг хийхээс өмнө тэдгээрийн шалтгааныг бичнэ.

### 4. хадгалагдсан гүйлгээг уншина уу {#_4-read-the-stored-transaction}

Хөдөлгөө дууссан эсэх нь түлхүүрний байдлын хариу юм. Транзакцын асуултаар хүлээн зөвшөөрөгдсөн транзакциныг ижил хэшийн дор хадгалагдаж байгааг баталгаажуулна.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Эрдэнэт судлаач нь хоёр дахь, зөвхөн уншдаг ажиглалтын талбай бөгөөд энэ нь галт тэрэгний төгсгөлд бага зэрэг хоцрох боломжтой юм.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Үндэсний өөрчлөлтийн заавар авахын тулд өөрчлөгдсөн объектын асуултыг дуусгах. [Metadata](./metadata.md), [Fungible assets](./fungible-assets.md), [NFTs](./nfts.md) рецептүүд нь дараах хэвлэлийн уншлыг багтаасан байна.

## Бүртгэнэ {#verify}

Гурван бүртгэл нь ижил хэшээр тохиролцсон эсэхийг шалгаж, хайгуулагчаас хүлээлттэй нөхцөл байдлын талаар мэдээлэхгүй байна уу:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Нэвтрүүлгийн хүлээн зөвшөөрөл болон эцсийн байдлаа шалгалтын гэрчилгээ болгон хадгалах. Тэдэнд гарын үсэг зурах түлхүүр биш, олон нийтийн гүйлгээний материал байдаг.

## Ашигтвортой байдлыг шийдвэрлэх {#troubleshooting}

- HTTP `202` эсвэл шуурхай жагсаалт нь зөвхөн хүлээн зөвшөөрөгдлийг харуулж байна. Тэмцээсэн байдлын санал асуулгыг хэрэглэгдэх, үгүйсгэх, дуусах эсвэл хугацааны хязгаарлалттай хүртэл үргэлжлүүлэн явуулна.
- Хэрэв хэшиг буцаасны дараа дамжуулах хугацаа дууссан бол дахиад нэг бүтээн байгуулалтыг хийхээс өмнө тухайн хэшийг асууж үзээрэй.
- Хөдөлмөрийн төлбөрийг гарын үсэг зурахаас өмнө татгалзаж болно. `--fee-payer authority`, `gas_asset_id`, байгууллагын үлдэгдэл, сүлжээний зангилаа ID шалгаарай.
- `Rejected` нь зарчмын баталгаажуулах, зөвшөөрөл олгох, төлбөр тооцоо хийх ёсгүй байдлыг илэрхийлдэг. Энэ нь амжилтгүй биелэлтийн батламж бөгөөд тээврийн дахин оролдлого гэж ангилагдахгүй байх ёстой юм.
- Applied-ийн дараа шууд хайгуулагч `404` нь индексжуулах хямралтай байж болно. Уншихыг дахин туршиж үзээрэй; гүйлгээг дахин өргөн мэдүүлэхгүй.
- Хэрэв тусгай зөвшөөрөлтэй захирамж үүсгэсэн локал сүлжээ дээр ажилладаг боловч Taira үүнийг татгалзсан бол яг Taira зөвшөөрлийг авах эсвэл зохицуулсан нэр орон зайн хуваарилалтыг аваарай.

## Эх сурвалж, холбогдох баримт бичгүүд {#source-and-related-docs}

- [Транзакцын өргөн мэдүүлэг, төлбөрийн цөөн тооны хэрэгжилт ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs) байгуулсан үүрэг гүйцэтгэх
- [Транзакцын баталгаажуулалтын шинжилгээ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs) байгуулсан үүрэг гүйцэтгэл дээр
- [Арилжаа](/mn/blockchain/transactions.md)
- [CLI удирдамж](/mn/get-started/operate-iroha-via-cli.md)
- [Torii эцсийн цэгүүд](/mn/reference/torii-endpoints.md)
