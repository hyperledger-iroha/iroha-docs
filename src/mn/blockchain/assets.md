---
translation_locale: mn
translation_source: /blockchain/assets.md
translation_source_hash: 4d0a3f54a0c70d08d11160b9ec66d6538aa2c49c7771a13e4a070b61a9cb3e4b
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Хөрөнгө {#assets}

Iroha хөрөнгө нь дансанд хадгалагдсан тоон тэнцэл юм. Боломжит бүх тэнцэл нь `AssetDefinition`-ийг заадаг бөгөөд тодорхойлолт нь тухайн хөрөнгийг хэрхэн нэрлэх, гаргах, харуулах, хуваахыг тодорхойлдог.

## Хөрөнгийн тодорхойлолт {#asset-definition}

Нэг `AssetDefinition` нь агуулдаг:

- `id`: нэг протокол-стандарт хөрөнгийн тодорхойлолтын хаяг
- `name`: хүний ​​урьдчилан унших боломжтой дэлгэцийн нэр
- `description`: сонголтоор хүний уншиж болох тайлбар
- `alias`: `<name>#<domain>.<dataspace>` эсвэл `<name>#<dataspace>` хэлбэрээр сонголттой овог нэр
- `spec`: үлдэгдлийн тоон нарийвчлал ба хязгаарууд
- `mintable`: хөрөнгийн гаргалтын бодлогын бодлого
- `logo`: сонголттой `SoraFS` URI
- `metadata`: дурын түлхүүр-утга metadata
- `balance_scope_policy`: үлдэгдэл глобал эсвэл өгөгдлийн орон зайгаар хязгаарлагдсан эсэх
- `owned_by`: бүртгэл үүсгэсэн эсвэл тодорхойлолтыг эзэмшдэг данс
- `total_quantity`: нийт нийтлэгдсэн хэмжээ
- `confidential_policy`: хамгаалалттай хөрөнгийн үйл ажиллагааны бодлого

Хөрөнгийн тодорхойлолтын ID нь нэг протоколын хэвшмэл тунгалаг бус хаяг юм. Тодорхойлолт нь домайн ба нэрээс бүрдсэн үед, Iroha нь тэр домайн/нэрийн проекцыг UX болон асуултанд хадгалж чадах боловч, нэг протоколын хэвшмэл текст хэлбэр нь үүсгэсэн хаяг болно.

## Өмчийн үлдэгдэл {#asset-balance}

Нэг `Asset` агуулна:

- `id`: хөрөнгийн тодорхойлолт, эзэмшигчийн данс болон сонголттой үлдэгдлийн хамрах хүрээг нэгтгэсэн `AssetId`
- `value`: нэг `Numeric` баланс

Эзэмшигч данс нь каноник бөгөөд домэйн агуулахгүй. Хөрөнгийн тодорхойлолтыг өгөгдлийн орон зайгаар бүрэн тодорхойлсон домэйн дор тусгаж болно, жишээлбэл `payments.universal`.

## Эд хөрөнгө гаргах бодлого {#mintability}

Хөрөнгийн тодорхойлолт нь эдгээр хөрөнгө гаргах бодлогын горимыг дэмждэг:

| Горим |Өгүүлэмж|
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` |Уян хангалт. Өмчийг дахин дахин гаргаж, устгаж болно.|
| `Once`       |Тогтмол нийлүүлэлтийн токен. Үүнийг нэг удаа гаргаж, дараа нь устгаж болно.|
| `Not`        |Дахиж гаргах боломжгүй, устгаж болох тогтмол нийлүүлэлттэй токен.|
| `Limited(n)` |Энэхүү бодлого нь шинэ хөрөнгийн нэгжийг нэмэлт үйл ажиллагаанд хязгаарлагдмал тоогоор гаргаж болохыг зөвшөөрдөг.|

Энгийн уян хөрөнгийн хувьд `Infinitely`-ыг ашиглана уу, харин тогтмол нийлүүлэлт эсвэл хязгаарлагдмал нийлүүлэлттэй хөрөнгийн хувьд `Once` эсвэл `Limited(n)`-ыг ашиглана уу. Хөрөнгийн нийлүүлэлт аль хэдийн тогтоогдоогүй бол `Not`-ыг анхны бодлого болгон ашиглаж болохгүй.

## Эд хөрөнгийн үлдэгдлийн хүрээ {#balance-scope}

`balance_scope_policy` нь үлдэгдлүүд хэрхэн хуваагдахыг хянадаг:

- `Global`: данс ба хөрөнгийн тодорхойлолт бүрт нэг үлдэгдлийн хуваалт
- `DataspaceRestricted`: үлдэгдлийг өгөгдлийн орон зайн нөхцөлөөр тусгаарлана

Нэг хөрөнгийн тодорхойлолтыг хэд хэдэн SORA Nexus өгөгдлийн орон зайд ашиглах боловч үлдэгдлийг нь тусад нь хадгалах шаардлагатай үед өгөгдлийн орон зайгаар хязгаарласан үлдэгдэл хэрэгтэй.

## Энэ урсгалыг Taira-д ажиллуулна уу {#try-it-on-taira}

Эдгээр зөвхөн уншигдах API хүсэлтүүд олон нийтийн Taira тестнет дээрх бодит хөрөнгийн тодорхойлолтуудыг харуулна:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Одоогийн Taira XOR төлбөрийн хөрөнгийн тодорхойлолтыг олно уу:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Мета мэдээлэл агуулсан тодорхойлолтыг хайна уу:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Гурван жишээ бүгд унших үйлдэл юм. Taira дээр хөрөнгө шинээр гаргах, шатаах эсвэл шилжүүлэхдээ туршилтын хөрөнгө олгох үйлчилгээгээр санхүүжүүлсэн данс болон [SORA Nexus өгөгдлийн орон зайд холбогдох](/mn/get-started/sora-nexus-dataspaces.md) хэсгийн хамгаалалтын шалгалттай урсгалыг ашиглана уу.

Taira дээр шимтгэлтэй хөрөнгийн жишээ ажиллуулахын өмнө [Taira дээр туршилтын XOR авах](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) хэсгийн урьдчилан бэлтгэдэг хөрөнгө авах урсгалаар гарын үсэг зурах дансыг санхүүжүүлнэ. Дараа нь `ledger asset mint`, `ledger asset burn`, `ledger asset transfer` командуудад `--fee-payer authority` дамжуулна; CLI гарын үсэг зурахаас өмнө яг шимтгэлийг Taira-гийн шимтгэлийн хөрөнгөөр тооцож харуулна:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "<ASSET_DEFINITION_BASE58>" \
  --account "<TAIRA_I105_ACCOUNT_ID>" \
  --to "<RECIPIENT_I105_ACCOUNT_ID>" \
  --quantity 1
```

## Заавар {#instructions}

Хөрөнгийг бүртгэж, гаргаж, устгаж, шилжүүлэх боломжтой Iroha зааврын үйлдлүүдээр:

- [`Register` болон `Unregister`](/mn/blockchain/instructions.md#un-register)
- [`Mint` болон `Burn`](/mn/blockchain/instructions.md#mint-burn)
- [`Transfer`](/mn/blockchain/instructions.md#transfer)
- [`SetKeyValue` болон `RemoveKeyValue`](/mn/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Мөн үзэх:

- [CLI гарын авлага](/mn/get-started/operate-iroha-via-cli.md)
- [Rust сургалт](/mn/guide/tutorials/rust.md)
- [Python сургалт](/mn/guide/tutorials/python.md)
- [JavaScript/TypeScript хичээл](/mn/guide/tutorials/javascript.md)
- [Өгөгдлийн загвар](/mn/blockchain/data-model.md)
- [NFTs](/mn/blockchain/nfts.md)
