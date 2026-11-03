---
translation_locale: mn
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Ширээний хөрөнгө {#fungible-assets}

## Үр дүн {#outcome}

Ажиллаж буй Taira сүлжээний хөрөнгийн тодорхойлолтуудыг шалгаж, үүсгэсэн локал сүлжээнд гаргах, шилжүүлэх, устгах болон үлдэгдэл баталгаажуулах урсгалыг бүрэн гүйцэтгэнэ. Энэ жор нь угтваргүй каноник Base58 хөрөнгийн тодорхойлолтын ID, домэйнгүй I105 дансны ID болон тодорхой заасан төлбөрийн төлөлтийг ашигладаг.

## Өмнөх шаардлага {#prerequisites}

- `curl`, `jq`, Python 3.11 эсвэл түүнээс шинэ хувилбар, Node.js 24, мөн одоогийн `iroha` болон `kagami` CLIs.
- Зөвхөн унших Taira хандалт.
- Бичих алхмуудад: [Iroha-г эхлүүлэх](/mn/get-started/launch-iroha.md) хэсэгт үзүүлсэн шиг `kagami localnet generate --peers 4 --out-dir ./localnet` командад `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa`-г нэмж үүсгэсэн локал сүлжээ. Энэ нь `./localnet/client.toml` болон `http://127.0.0.1:8080` дээрх Torii-г хангана.

## Алхамууд {#steps}

### 1. Taira тодорхойлолтуудыг криптограф гарын үсэггүйгээр шалгах {#_1-inspect-taira-definitions-without-a-signer}

Хөрөнгийн тодорхойлолтод тунгалаг бус Base58 ID, дэлгэцийн нэр, гаргалтын бодлого, тоон хуваарь, сонголттой alias, эзэмшигч, сонголттой харьяалах домэйн эсвэл өгөгдлийн орон зай, үлдэгдлийн бодлого болон нийт тоо хэмжээ орно. Бодит үлдэгдэлд мөн түүний эзэмшигч данс болон сонголттой өгөгдлийн орон зайн хамрах хүрээ багтана.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

`node taira-assets.mjs` ашиглан JavaScript маягтыг ажиллуулна уу. Олон нийтийн хөрөнгийн ID нь зөвлөмжгүй Base58 утгууд байдаг; `cookbook_credit#wonderland.universal` гэх мэт уншигдахуйц утга нь эдгээр ID-уудын нэг рүү холбогддог овог нэр юм.

### 2. Орон нутгийн эрх олгох гол болон очих газрыг бэлтгэ {#_2-prepare-the-local-authority-and-destination}

Үүсгэсэн тохиргоон дахь нийтийн түлхүүрээс локал эрх бүхий дансыг гаргаж аваад, дараа нь шинэ хүлээн авагч дансанд түлхүүрийн хос үүсгэж, түүнийг бүртгэнэ. Ямар ч хувийн түлхүүр хэвлэгдэхгүй.

```bash
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. Клиентийн эзэмшдэг тоон тодорхойлолтыг ашиглах {#_3-use-a-client-owned-numeric-definition}

Genesis-ээс гадуур тодорхойлолтыг гарын үсэг зурагчийн эзэмшдэг харьяалах `--domain` домэйн дор бүртгэдэг бөгөөд үүсгэсэн localnet-ийн клиент ямар ч домэйн эзэмшдэггүй. `--asset-definition-id`-тэй үүсгэсэн localnet-д энэ тодорхойлолт аль хэдийн бий: genesis үүнийг хязгаарлагдаагүй хуваарьтайгаар бүртгэж, клиентийг түүний эзэмшигч болгож, клиентэд 1,000,000,000 нэгж гаргасан.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Тэр ID-г Taira дээр дахин бүү ашигла. Нийтийн сүлжээнд бүртгэхэд шинэ каноник ID, таны дансны эзэмшдэг харьяалах домэйн (`ledger asset definition register`-д `--domain` болгон дамжуулна), аливаа alias-д зориулсан `CanManageAssetDefinitionAlias` эрхийн олголт болон төлбөрийн санхүүжилт шаардлагатай.

### 4. гаргах, шилжүүлэх, устгах {#_4-mint-transfer-and-burn}

Бүх бичих тушаалууд зөвшөөрөл олгогч үндсэн хэрэглэгчийг төлбөрийн хүнээр илэрхийлэн сонгодог. CLI нь гарын үсэг зурахаасаа өмнөх яг гүйлгээг иш татдаг ба анхдагчаар хүлээгддэг.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

Устгасны дараа эх үүсвэрийн үлдэгдэл `1000000064.50`, очих газрын үлдэгдэл `25.50`, нийт тоо хэмжээ `1000000090.00` гэж хүлээж байна.

::: warning Өөрт олгосон эрхийн хязгаар

Taira дээр бичих үйлдэл бүрт `--fee-payer authority`-г ашигла; CLI нь гарын үсэг зурахаас өмнө яг төлбөрийг Taira-ийн төлбөрийн хөрөнгөөр тооцоолж, үнийн санал гаргадаг. Бүртгэхэд тодорхойлолтын `--domain` домэйныг эзэмшсэн байх шаардлагатай бөгөөд alias-д мөн `CanManageAssetDefinitionAlias` хэрэгтэй. Гаргалт хийхэд тодорхойлолтыг эзэмшсэн, эсвэл `CanMintAssetWithDefinition` эсвэл `CanMintAssetToAccount` эрхтэй байх шаардлагатай; шилжүүлэх болон устгахад эх үүсвэрийн үлдэгдэл дээрх эрх мэдэл шаардлагатай. Faucet-ээр санхүүжүүлсэн данс автоматаар гаргагч болдоггүй.

:::

## Баталгаажуулах {#verify}

Хоёр бодит үлдэгдлийг уншаад, дараа нь тодорхойлолтыг уншина. Эдгээр дараах-төлөвийн асуулга нь зөвхөн илгээсэн протоколын үр дүнгийн бичлэг бус, амжилтын жинхэнэ шалгуур юм.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Програмын баталгаанууд тоон утгыг хоёртын хөвөгч цэгийн утга биш, тогтмол цэгийн аргаар харьцуулах ёстой бөгөөд дансаас гадна тодорхойлолтын ID-г баталгаажуулах ёстой.

## Алдааг олох болон засах {#troubleshooting}

- `#` агуулсан ID нь протоколын стандарт хөрөнгийн тодорхойлолтын ID биш, харин alias эсвэл бодит үлдэгдлийн утга байна. `--definition`-д зөвхөн Base58 утгыг, эсвэл `--definition-alias`-д холбосон alias-ийг дамжуулна.
- `Scale` алдаа нь тоо хэмжээ тухайн тодорхойлолтын зөвшөөрснөөс олон аравтын орны бутархайтай гэсэн үг.
- `Mintability` татгалзах нь `Once`, `Not` эсвэл `Limited(n)` бодлогын хэрэглэх эрх дууссан эсвэл гаргахыг хориглосон гэсэн үг юм. Түүхийг дахин бичиж болохгүй; тодорхойлолт асуултаар буцаасан бодлогыг ашиглах хэрэгтэй.
- Алхам 2 нь хүлээн авагч дансыг тодорхой бүртгэдэг тул дансыг хүлээн зөвшөөрөх горим `ExplicitOnly` байсан ч шилжүүлэг ажиллана. Ижил төстэй нэртэй CLI хамгаалалт нь данс эсвэл үлдэгдэл бүртгэдэггүй; өөр заавар нэмэхийн оронд үйлдлийг зогсоодог.
- Төлбөрийн татгалзал нь зааврын ердийн амжилтаас өмнө тохиолддог. Төлөгчийг сонгож, CLI-ийн төлбөрийн үнийн санал дахь төлбөрийн хөрөнгө болон дээд хэмжээг шалгаад, тэр үлдэгдлийг баталгаажуул.
- Ижил localnet дээр дахин ажиллуулахад өмнөх үлдэгдлүүдээс эхэлдэг бөгөөд `kagami keys` нь аль хэдийн байгаа `./cookbook-recipient`-ийг хүлээн авахаас татгалздаг. Шинээр үүсгэсэн localnet-ийг ажиллуулж, тэр хавтсыг устга, эсвэл үнэмлэхүй утгын оронд үлдэгдлийн өөрчлөлтийг харьцуул. Base58 ID-ийн оронд буруу бүтэцтэй санамсаргүй мөрийг хэзээ ч бүү орлуул.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Төлөвлөсөн эх кодын хувилбарт активын амьдралын мөчлөгийн нэгдсэн туршилтууд](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust Asset барилгын жишээнүүд тогтоосон эх кодын хувилбар дээр](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [Хөрөнгө](/mn/blockchain/assets.md)
- [Заавар](/mn/blockchain/instructions.md)
- [Өөрт нь зөвшөөрөл олгосон тэмдэглэгээ](/mn/reference/permissions.md)
- [JavaScript ба TypeScript](/mn/guide/tutorials/javascript.md)
