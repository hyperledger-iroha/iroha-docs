---
translation_locale: mn
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ашиглал {#assets}

Iroha хөрөнгийг нь санхүүгийн тэнцвэр юм. Бүх конкрет тэнцвэр нь `AssetDefinition` -д чиглүүлж, тодорхойлолт нь тухайн хөрөнгийг хэрхэн нэрлэх, тэмдэглэх, дэлгэх, хуваарилах талаар тайлбарладаг байна.

## Ашийн тодорхойлолт {#asset-definition}

`AssetDefinition` нь:

- `id`: санхүүгийн хөрөнгийн тодорхойлолтын хаяг
- `name`: хүн уншдаг үзэсгэлэнгийн нэр
- `description`: Хүний уншдаг сонголттой дүрслэл
- `alias`: `<name>#<domain>.<dataspace>` эсвэл `<name>#<dataspace>` хэлбэрээр сонголттой нууц үсэг
- `spec`: санхүүгийн тохирдол, тэнцвэрт хүчин чадал
- `mintable`: хяналт тавих байдлын бодлого
- `logo`: сонголттой `SoraFS` URI
- `metadata`: сонголттой түлхүүрний үнэлгээний метадэтгэлэг
- `balance_scope_policy`: үлдэгдэл нь дэлхийн хэмжээний эсвэл мэдээллийн орон тооны хувьд хязгаарлагдмал эсэх
- `owned_by`: тодорхойлолтыг бүртгэсэн эсвэл эзэмшиж буй сан
- `total_quantity`: нийт гаргасан хэмжээ
- `confidential_policy`: хамгаалалттай хөрөнгийн үйл ажиллагааны бодлого

Ашигт малтмалын тодорхойлолт IDs нь хуулийн бус хаяг юм. Тодруулгыг домен, нэрээс бүтээсэн үед Iroha энэ доменийн / нэрний төслийг [UX болон хайлтын хувьд хадгалж болно, гэхдээ хуулийн бичгийн хэлбэр бол үүсгэсэн хаяг юм .

## Ашигт малтмалын баланс {#asset-balance}

`Asset` нь:

- `id`: хөрөнгийн тодорхойлолт, эзэмшигчдийн тооцоо, сонгодог үлдэгдлийн хүрээг нэгтгэсэн `AssetId`
- `value`: `Numeric` үлдэгдэл

Ашигт малтмалын тодорхойлолтыг `payments.universal` гэх мэт өгөгдлийн орон зайд шалгарсан доменийн хүрээнд төлөвлүүлэх боломжтой.

## Хөдөлмөр хийх боломжтой {#mintability}

Ашигт малтмалын тодорхойлолт нь эдгээр mintability хэлбэрүүдийг дэмждэг:

|Дээрх хэв маяг|Энэ нь юу вэ?|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |Эластикийн хангамж. Ашигт малтмалыг давтамжлах, шатаах боломжтой. |
|`Once` |Нөхөр хангамжийн тэмдэгт нь нэг удаа сольж, дараа нь шатаах боломжтой.|
|`Not` |Төгсөлгүй хангамжийн бэлэг тэмдэг нь шатааж болно, гэхдээ дахин олдохгүй. |
|`Limited(n)` |Хэдэн тооны нэмэлт үйлдвэрийн тулд мод хийх зөвшөөрөлтэй. |

Хэрэглээ `Infinitely` хэвийн эластик хөрөнгийн хувьд, `Once` эсвэл `Limited(n)` тогтмол хангамжтай болон хязгаарлагдмал хангамжийн хөрөнгийг ашиглахгүй `Not` хөрөнгийн хангамж нь аль хэдийн тогтоогдсонгүй бол эхлүүлэх бодлого.

## Тэтгэлгийн хүрээ {#balance-scope}

`balance_scope_policy` нь тэнцвэрт хэсгийг хэрхэн хянахыг удирддаг:

- `Global`: нэг бүртгэл болон хөрөнгийн тодорхойлолтоор тэнцвэрт хавсралт
- `DataspaceRestricted`: хадгаламж нь мэдээллийн орчны хүрээнд хуваагдана

Мэдээллийн орон тооны хязгаарлагдмал үлдэгдэл нь хэд хэдэн Nexus мэдээллийн газарт ижил хөрөнгийн тодорхойлолтыг ашигладаг бол ашигтай боловч үлдэгдэл тусгайлан хэвээр байх ёстой.

## Taira дээр туршиж үзээрэй. {#try-it-on-taira}

Эдгээр зөвхөн уншдаг дуудлага нь Taira олон нийтийн тест сүлжээний бодит хөрөнгийн тодорхойлолтыг харуулж байна:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Одоогийн Taira XOR төлбөрийн хөрөнгийг тодорхойлох:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Мета өгөгдөлтэй тодорхойлолт хайж үзнэ үү:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Бүх гурван жишээ нь уншдаг. Taira дээр хөрөнгийг буулгах, шатаах эсвэл шилжүүлэхэд, [д хамгаалалттай урсгалыг ашиглаж, SORA Nexus мэдээллийн газарт холбогдоно](/mn/get-started/sora-nexus-dataspaces.md) .

Төлбөрийн төлбөр Taira хөрөнгийн жишээ нь, гарын үсэгт хэрэглэгчээс [Тестнет аваарай XOR цаашид Taira](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) тухайн `taira_faucet_claim.py`, цаашид хамгийн түрүүнд цөмөрний хөрөнгийг шаардаж, транзакцын газын хөрөнгийн хувьд ашиглана:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Дараа нь `ledger asset mint`, `ledger asset burn` болон `ledger asset transfer` команд дээр `--metadata ./taira.tx-metadata.json`-ийг багтааарай.

## Суурь бичиг {#instructions}

Ашигт малтмалыг Iroha тусгай зааварчилгаагаар бүртгэж, тэмдэглэж, шатааж, шилжүүлэх боломжтой:

- [`Register` болон `Unregister`](/mn/blockchain/instructions.md#un-register)
- [`Mint` болон `Burn`](/mn/blockchain/instructions.md#mint-burn)
- [`Transfer`](/mn/blockchain/instructions.md#transfer)
- [`SetKeyValue` болон `RemoveKeyValue`](/mn/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Дараахь мэдээллийг үзнэ үү:

- [CLI удирдамж](/mn/get-started/operate-iroha-via-cli.md)
- [Rust сургалт](/mn/guide/tutorials/rust.md)
- [Python сургалт](/mn/guide/tutorials/python.md)
- [JavaScript/TypeScript зааварчилгаа](/mn/guide/tutorials/javascript.md)
- [Мэдээллийн загвар](/mn/blockchain/data-model.md)
- [NFTs](/mn/blockchain/nfts.md)
