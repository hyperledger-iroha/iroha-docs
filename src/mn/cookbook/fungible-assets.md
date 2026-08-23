---
translation_locale: mn
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 6b50c995afaf9f46df6fdaab31add40b106cfa12fdaa31dabbb74448486f87f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Хөдөлмөрийн санхүүжилт {#fungible-assets}

## Үр дүн {#outcome}

Амьдрал Taira хөрөнгийн тодорхойлогыг хяналт шалгаж, үүсгэн бүтээсэн орон нутгийн сүлжээний бүртгэл, mint, шилжүүлэн суулгах, шатахууруулах, тэнцвэр шинжилгээний урсгалыг гүйцэтгэнэ рецепт нь Canonical unprefixed Base58 asset-definition IDs, domain-qualified aliases, domainless I105 account IDs болон тодорхой төлбөрийн төлбөртэй.

## Урьдчилсан шаардлага {#prerequisites}

- `curl`, `jq`, Python 3.11 болон түүнээс хойш, Node.js 24, одоогийн `iroha` CLI.
- Зөвхөн уншдаг Taira хангамж.
- Сэтгэлийг бичэхийн тулд орон нутгийн сүлжээ үүсгэсэн [Нэвтрүүлэг Iroha](/mn/get-started/launch-iroha.md), хамтран `./localnet/client.toml` болон Torii цаашид `http://127.0.0.1:8080`.

## Хадгалт {#steps}

### 1. Taira тодорхойлолтыг гарын үсэг зурагчгүйгээр шалгана. {#_1-inspect-taira-definitions-without-a-signer}

Ашигт малтмалын тодорхойлолт нь ил тод Base58 ID, дэлгэцийн нэртэй, Урьдчилгааны бодлого, тооны хэмжээн, сонголттой нууц үсэг, эзэмшигч, нийт хэмжээ. Тодруулсан тэнцвэр нь мөн түүний эзэмшигчдийн бүртгэл болон сонголттой мэдээллийн орон тооны хүрээг багтааж байна.

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

JavaScript хэлбэрийг `node taira-assets.mjs`ээр гүйцэтгэнэ. Олон нийтийн актив IDs нь Bare Base58 хэмжээнүүд; `cookbook_credit#wonderland.universal` гэх мэт уншигдах үнэ цэнэ бол тэдгээрийн нэг IDs гэж нэрлэгдэх цогцолбор юм.

### 2. Орон нутгийн засаг захиргаа, нутаг дэвсгэрийн төвд бэлтгэх {#_2-prepare-the-local-authority-and-destination}

Орон нутгийн захиргааг үүсгэсэн конфигурацийн олон нийтийн түлхнээс гаргаж, хүлээн авагч болгон бүртгэлтэй бусад дансыг сонгоно. Хувийн түлхүүр хэвлэгдэхгүй байна.

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

### 3. Сангийн тодорхойлолтыг бүртгүүлэх {#_3-register-a-numeric-definition}

Зөвхөн орон нутгийн ID нь Base58 хөрөнгийн тодорхойлолтын тохиромжтой нөөцгүй хаяг юм. Үндсэн нэр нь хүний уншдаг `domain.dataspace` төслийг хангаж өгдөг. Сэлжээ `2` нь хоёр халуун цифртай боломжийг олгодог; `--mint-once` -ийг орхих нь урьдчилсан `Infinitely` бодлогыг хадгалж байна.

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

ID-ийг Taira дээр дахин ашиглама. Нийтийн сүлжээний бүртгэл нь шинэ каноникийн ID, таны өргөдөлд зориулсан домен/алтын нэр, төлбөрийн санхүүжилт, гүйлгээний хугацааны хөрөнгийн бүртгэлийн зөвшөөрлийг шаарддаг.

### 4. Мунт, шилжүүлэн суулгах, шатаах {#_4-mint-transfer-and-burn}

CLI нь гарын үсэг зурахаасаа өмнө тухайн гүйлгээг дурдаж, урьдчилан сэргийлэх хугацааны дагуу хүлээх болно.

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

Төгснээс хойш эх үүсвэрийн тэнцвэртэй байдлыг хүлээх хэрэгтэй `64.50`, Зохиоллын тэнцвэр `25.50`, ба нийт тоо хэмжээ `90.00`.

::: warning Тусгай зөвшөөрлийн хязгаар

Үргэлж Taira, цөмөрээс үүдэлтэй түлхэгийг холбоно `taira.tx-metadata.json` болон ашиглах `--fee-payer authority` Бүх зүйл бичигддэг. Бүртгэл, хуримтлах нь идэвхтэй баталгаажуулагчдын зөвшөөрлийг шаарддаг; шилжүүлэн суулгах болон шатаах нь эх үүсвэрийн тэнцвэрт эрх мэдэл шаарддаг. Энэ нь ... Тэмцээний санхүүжилттэй данс нь автоматжуулалтын нэгж биш юм.

:::

## Бүртгэнэ {#verify}

Тодорхой тэнцвэр, дараа нь тодорхойлолтыг уншина уу. Эдгээр төрийн дараах асуултууд нь амжилтын шалгалт, мэдүүлгийн хүлээн зөвшөөрөл өөрөө тийм биш юм.

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

Хэрэглээний мэдэгдэл нь санхүүгийн үнэ цэнийг байнгын цолтой арван тоогоор харьцуулах, хоёр дахь шилжин цолтой цолтой биш бөгөөд тодорхойлолт ID болон тооцоог баталгаажуулах хэрэгтэй.

## Ашигтвортой байдлын асуудал {#troubleshooting}

- ID нь `#` -ийг агуулсан алиас эсвэл бетон тэнцвэрний утга агуулга бөгөөд санхүүгийн хөрөнгийн тодорхойлолт биш ID юм. Bare Base58-ийн үнэ цэнийг `--definition` -тэй ашиглах, эсвэл `--definition-alias` -тэй холбогдсон алиасыг өнгөрүүлэх
- `Scale` алдаа нь тодорхойлолт зөвшөөрсөнөөс илүү олон хувьтай тооны хэмжээтэй гэсэн үг юм.
- `Mintability` татгалз нь `Once`, `Not` эсвэл `Limited(n)` бодлогын хэрэгцээг дуусгасан эсвэл зөвшөөрөөгүй гэсэн үг юм. түүхийг дахин бичиж болохгүй; тодорхойлолтын асуултаар буцаасан бодлогыг ашигла.
- Хоёр дахь алхам нь бүртгэлтэй төлөөлөгчийн дансны сонголт. Хэрэв хөрөнгийн хүлээн авах нь `ExplicitOnly` бол шилжүүлэн суулгахаас өмнө зөвшөөрөлтэй урсгалаар зориулсан зорилтот үлдэгдлийг хангах. Үүнтэй ижил төстэй CLI хяналтын байгууллага нь данс, үлдэгдэл бүртгэхгүй бөгөөд өөр нэгэн заавар нэмэхээс илүү түлшүүрдэг.
- Төлбөрийн татгалз нь хэвийн сургалтын амжилтад хүрэхээс өмнө явагдана. төлөгч сонгож, сүлжээний төлбөрийн активын метадэтгэлийг ашиглаж, үлдэгдэлээ шалгах.
- Хэрэв байнгын орон нутгийн тодорхойлолтыг өмнөх гүйлгээээс аль хэдийн бий болгосон бол шинээр үүсгэсэн орон нутгийн сүлжээг эхлүүлээрэй эсвэл одоо байгаа байдлаа үргэлжлүүлээрэй. Base58 ID -ийн оронд алдаатай санамжлалт шугам хэзээ ч орлуулах хэрэггүй.

## Эх сурвалж, холбогдох баримт бичгүүд {#source-and-related-docs}

- [Ашигт малтмалын амьдралын мөрийн интеграцийн шинжилгээ ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/asset.rs) байгуулсан зээлийн
- [Rust хөрөнгийн бүтээн байгуулалтын үлгэр жишээ нь байгуулсан үүрэг гүйцэтгэгч](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/examples/tutorial.rs)
- [Байгууллага](/mn/blockchain/assets.md)
- [Сургалтууд](/mn/blockchain/instructions.md)
- [Тусгай зөвшөөрлийн токенүүд](/mn/reference/permissions.md)
- [JavaScript болон TypeScript](/mn/guide/tutorials/javascript.md)
