---
translation_locale: mn
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: bing-translator-llm
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
- `balance_scope_policy`: үлдэгдэл нь дэлхийн хэмжээнд эсвэл өгөгдлийн орон зайгаар хязгаарлагдах эсэх
- `owned_by`: бүртгэл үүсгэсэн эсвэл тодорхойлолтыг эзэмшдэг данс
- `total_quantity`: нийт нийтлэгдсэн хэмжээ
- `confidential_policy`: хамгаалалттай хөрөнгийн үйл ажиллагааны бодлого

Хөрөнгийн тодорхойлолтын ID нь нэг протоколын хэвшмэл тунгалаг бус хаяг юм. Тодорхойлолт нь домайн ба нэрээс бүрдсэн үед, Iroha нь тэр домайн/нэрийн проекцыг UX болон асуултанд хадгалж чадах боловч, нэг протоколын хэвшмэл текст хэлбэр нь үүсгэсэн хаяг болно.

## Өмчийн үлдэгдэл {#asset-balance}

Нэг `Asset` агуулна:

- `id`: хөрөнгийн тодорхойлолт, эзэмшигчийн данс болон сонголттой үлдэгдлийн хамрах хүрээг нэгтгэсэн `AssetId`
- `value`: нэг `Numeric` баланс

Эзэмшигчийн данс нь ганц протокол-стандарттай бөгөөд домэйнгүй байна. Хөрөнгийн тодорхойлолтыг өгөгдлийн орон зайд тохирсон домэйн дор төсөөлж болно, жишээ нь `payments.universal`.

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
- `DataspaceRestricted`: үлдэгдлийг өгөгдлийн орон зайгаар хэсэглэнэ

Өгөгдөл зай хязгаарлагдсан тэнцлүүд нь нэгэн ижил хөрөнгийн тодорхойлолтыг хэд хэдэн Nexus өгөгдөл зайд ашигласан тохиолдолд хэрэгтэй боловч тэнцлүүд тусгаарлагдсан хэвээр байх ёстой.

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

Бүх гурван жишээ нь унших үйлдэл юм. Taira-д хөрөнгийг гаргах, устгах, шилжүүлэхийн тулд туршилтын сүлжээгээр санхүүжүүлсэн данс болон [SORA Nexus өгөгдлийн сангуудтай холбогдох](/mn/get-started/sora-nexus-dataspaces.md)-д хамгаалалттай урсгалыг ашигла.

Taira дээр төлбөртэй хөрөнгийн жишээг ажиллуулахдаа [Taira-аас testnet XOR авах](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) хэсгийн faucet туслахыг `taira_faucet_claim.py` нэрээр хадгалж, faucet хөрөнгийг эхлээд аваад гүйлгээний gas хөрөнгө болгон ашиглана:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Дараа нь `ledger asset mint`, `ledger asset burn`, болон `ledger asset transfer` командуудад `--metadata ./taira.tx-metadata.json`-г оруулаарай.

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
