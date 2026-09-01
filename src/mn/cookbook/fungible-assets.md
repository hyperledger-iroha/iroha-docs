---
translation_locale: mn
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ширээний хөрөнгө {#fungible-assets}

## Үр дүн {#outcome}

Амьд Taira хөрөнгийн тодорхойлолтуудыг шалгаж, бүртгэл хийж, олгох, шилжүүлэх, устгах, болон үүсгэсэн дотоод сүлжээнд баланс баталгаажуулалтын урсгалыг гүйцэтгэнэ. Энэ жор нь нэг протоколын стандарт бус эхлэх тэмдэггүй Base58 хөрөнгө- тодорхойлолтын ID, домайнтай тохирсон элжээ, домайнгүй I105 дансны ID болон тодорхой үйлчилгээний төлбөрийг ашигладаг.

## Өмнөх шаардлага {#prerequisites}

- `curl`, `jq`, Python 3.11 эсвэл түүнээс хойш, Node.js 24, болон одоогийн `iroha` CLI.
- Зөвхөн унших Taira хандалт.
- Бичих алхам дарааллын хувьд [Эхлүүлэх Iroha](/mn/get-started/launch-iroha.md)-оос үүсгэсэн локаль сүлжээ, `http://127.0.0.1:8080`-д `./localnet/client.toml` ба Torii-ийг ашигласан.

## Алхамууд {#steps}

### 1. Taira тодорхойлолтуудыг криптограф гарын үсэггүйгээр шалгах {#_1-inspect-taira-definitions-without-a-signer}

Хөрөнгийн тодорхойлолтод тунгалаг бус Base58 ID, дэлгэцийн нэр, гаргалтын бодлого, тоон хуваарь, сонголттой alias, эзэмшигч болон нийт нийлүүлэлт орно. Бодит үлдэгдэлд эзэмшигчийн данс болон сонголттой өгөгдлийн орон зайн хамрах хүрээ мөн багтана.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
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

Үүсгэсэн тохиргооноос нийтийн түлхүүрийг ашиглан орон нутгийн эрх олгох эрхэм дүрмийг гаргаж, хүлээн авагчаар өөр бүртгэлтэй дансыг сонго. Хувийн түлхүүр хэвлэгддэггүй.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
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

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. Тоон тодорхойлолт бүртгэх {#_3-register-a-numeric-definition}

Энэ зөвхөн орон нутгийн ID нь хүчинтэй урьдчилсанлгүй Base58 хөрөнгийн тодорхойлолтын хаяг юм. Олон нийтэд ойлгомжтой `domain.dataspace` проекцийг энэ алиас өгдөг. Хэмжээ `2` нь хоёр бутархайн тооны орцыг зөвшөөрдөг; `--mint-once`-г орхих нь анхдагч `Infinitely` дүрмийг хадгалдаг.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

Тэр ID-г Taira-д дахин ашиглаарай гэж бүү хий. Нийтийн блокчэйн сүлжээний бүртгэл нь шинэ нэг протоколын стандартын ID, таны програмд олгогдсон домэйн/нэр, шимтгэлд зориулсан санхүүжилт, болон програм хангамжийг хэрэгжүүлэх орчны хөрөнгийн бүртгэлийн зөвшөөрлийг шаарддаг.

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

Устгасны дараа эх үүсвэрийн үлдэгдэл `64.50`, очих газрын үлдэгдэл `25.50`, нийт тоо хэмжээ `90.00` гэж хүлээж байна.

::: warning Өөрт олгосон эрхийн хязгаар

Taira-д угаалгын холбогдсон `taira.tx-metadata.json`-г холбож, бичих бүрт `--fee-payer authority`-ийг ашиглана. Бүртгэл хийх, олгоход идэвхтэй баталгаажуулагчийн зөвшөөрөл шаардлагатай; шилжүүлэх, устгахад эх үүсвэрийн үлдэгдэлийн эрх мэдэл шаардлагатай. Туршилтын сүлжээний санхүүжүүлсэн акаунт автоматаар олгогч биш юм.

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
- Алхам 2 нь санаатайгаар бүртгэлтэй зорьсон дансыг сонгодог. Хөрөнгийг хүлээн авахын тулд `ExplicitOnly` бол зорьсон үлдэгдлийг зөвшөөрөгдсөн хэлбэрээр хангана Шилжүүлэг хийхээс өмнө урсгалыг хянаарай. Ижил нэртэй CLI хамгаалагч нь данс эсвэл үлдэгдлийг бүртгэдэггүй; шинэ заавар нэмэхийн оронд зогсоодог.
- Төлбөрийг татгалзах нь энгийн зааврын амжилт эхлэхээс өмнө тохиолддог. Төлөгчийг сонго, сүлжээний төлбөрийн хөрөнгийн метадатыг ашигла, баланс нь зөв эсэхийг шалга.
- Хэрэв тогтмол локал тодорхойлолт өмнөх ажилласаар бий болсон бол шинэ үүсгэсэн локалнетыг ажиллуул эсвэл түүний одоогийн төлөвтэй үргэлжлүүл. Base58 ID-г буруу бүтэцтэй санамсаргүй мөрөөр орлуулахгүй.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Төлөвлөсөн эх кодын хувилбарт активын амьдралын мөчлөгийн нэгдсэн туршилтууд](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust Asset барилгын жишээнүүд тогтоосон эх кодын хувилбар дээр](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Хөрөнгө](/mn/blockchain/assets.md)
- [Заавар](/mn/blockchain/instructions.md)
- [Өөрт нь зөвшөөрөл олгосон тэмдэглэгээ](/mn/reference/permissions.md)
- [JavaScript ба TypeScript](/mn/guide/tutorials/javascript.md)
