---
translation_locale: mn
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ашигт малтмал {#assets}

Хөдөлмөр Iroha хөрөнгийн санхүүжилт бол бүртгэлтэй санхүүгийн тэнцвэр юм.
тэнцвэрт байдал `AssetDefinition`, Энэ тодорхойлолт нь хэрхэн
тухайн хөрөнгийг нэрлэж, тэмдэглэх, дэлгэж, хувааж болно.

## Ашигт малтмалын тодорхойлолт {#asset-definition}

Хөдөлмөр `AssetDefinition` дараах зүйлсийг агуулж байна:

- `id`: санхүүгийн хөрөнгийн тодорхойлолтын хаяг
- `name`: хүн уншиж болох дэлгэцийн нэр
- `description`: Хүний уншиж болох сонголттой дүрслэл
- `alias`: сонголттой нууц үсэг `<name>#<domain>.<dataspace>` эсвэл
  `<name>#<dataspace>` хэлбэр
- `spec`: Сангийн тод байдал, тэнцвэрт хүчин чадал
- `mintable`: хяналтын байдал бодлого
- `logo`: сонголттой `SoraFS` URI
- `metadata`: нэн чухал ач холбогдолтой метабарууд
- `balance_scope_policy`: тэнцвэр нь дэлхийн хэмжээний эсэхээ,
  мэдээллийн орон тооны хязгаарлалттай
- `owned_by`: тодорхойлолтыг бүртгэсэн эсвэл эзэмшиж буй данс
- `total_quantity`: нийт гаргасан хэмжээ
- `confidential_policy`: хамгаалалттай хөрөнгийн үйл ажиллагааны бодлого

Ашигт малтмалын тодорхойлох IDs тодорхойлолт нь
Домен, нэрээс бүтээн байгуулалт Iroha энэ домен/ нэрээ хадгалах боломжтой
төслийн UX болон асуултууд, гэхдээ Canonical текст хэлбэр нь үүссэн
хаяг.

## Ашигт малтмалын баланс {#asset-balance}

Хөдөлмөр `Asset` дараах зүйлсийг агуулж байна:

- `id`: нэг `AssetId`, хөрөнгийн тодорхойлолт, эзэмшигчдийн сүлжээ,
  болон сонгон шалгаруулах тэнцвэр
- `value`: а `Numeric` тэнцвэр

Ашигт малтмалын тухай тодорхойлтыг
Жишээ нь, өгөгдлийн орон зайд шалгагдсан доменийн хүрээнд зураг төслийг
`payments.universal`.

## Хөдөлмөр хийх боломжтой {#mintability}

Ашигт малтмалын тодорхойлолт нь эдгээр mintability режисийг дэмжиж байна:

| Хэлэлцүүлэг         | Үр дүн                                                           |
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` | Нөөц нь давтамжтай, шатааж болно.    |
| `Once`       | Нөхцөл хангамжийн тэмдэгт нь нэг удаа хувирч, дараа нь шатааж болно.        |
| `Not`        | Төгсөлгүй хангамжийн тэмдэгт нь шатааж болно, гэхдээ дахин олборлохгүй.       |
| `Limited(n)` | Хэдэн тооны нэмэлт үйлдвэрийн тулд цагаан буурч ашиглах зөвшөөрөгддөг. |

Хэрэглээ `Infinitely` хэвийн эластик хөрөнгийн хувьд, `Once` эсвэл `Limited(n)` .
Нөөцтэй болон хязгаарлалттай хангамжийн хөрөнгө. `Not` эхлүүлэх
хөрөнгийн хангамж нь аль хэдийн тогтоогдсонгүй бол бодлого.

## Тэтгэлгийн цар хүрээ {#balance-scope}

Хөдөлмөрийн `balance_scope_policy` тэнцвэрт хэсгийг хэрхэн хяналт тавих:

- `Global`: бүртгэл болон хөрөнгийн тодорхойлолтын нэг үлдэгдэл
- `DataspaceRestricted`: дансны орчны хүрээнд тэнцвэрт хэсгийг хувааж байна

Мэдээллийн орон тооны хязгаарлагдмал үлдэгдэл нь ижил хөрөнгийн тодорхойлолтыг
олон төрлийн хэрэглээ Nexus Мэдээллийн талбай, гэхдээ тэнцвэр нь тусгаарлагдмал байх ёстой.

## Та үүнийг туршиж үзээрэй. Taira {#try-it-on-taira}

Эдгээр зөвхөн уншдаг дуудлага нь олон нийтийн талаарх бодит хөрөнгийн тодорхойлолт Taira туршилтын сүлжээ:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Одоогийн чиглэлийг олох Taira XOR төлбөрийн хөрөнгийн тодорхойлолт:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Metadata бүхий тодорхойлолт хайж үзнэ үү:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Гурван ч жишээ нь уншдаг. Taira, а ашиглах
цахилгаан хэрэгслийн санхүүжилт, хамгаалалттай урсгал
[Сэргэлт SORA Nexus Мэдээллийн газар](/mn/get-started/sora-nexus-dataspaces.md).

Төлбөрийн төлбөр Taira баялаг жишээ нь, крангийн туслах
[Тестнэт аваарай XOR цаашид Taira](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
Үүнд `taira_faucet_claim.py`, Дараа нь гарын үүлдлийн хөрөнгөг хамгийн түрүүнд эргүүлэн авах,
гүйлгээний газын актив:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Дараа нь `--metadata ./taira.tx-metadata.json` цаашид `ledger asset mint`,
`ledger asset burn`, болон `ledger asset transfer` Захиалга.

## Сургалтууд {#instructions}

Багацааг бүртгэж, тавилгаж, шатааж, шилжүүлэн суулгах боломжтой Iroha
Тодруулбал:

- [`Register` болон `Unregister`](/mn/blockchain/instructions.md#un-register)
- [`Mint` болон `Burn`](/mn/blockchain/instructions.md#mint-burn)
- [`Transfer`](/mn/blockchain/instructions.md#transfer)
- [`SetKeyValue` болон `RemoveKeyValue`](/mn/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Дараахь мэдээллийг үзнэ үү:

- [CLI удирдамж](/mn/get-started/operate-iroha-via-cli.md)
- [Rust сургалт](/mn/guide/tutorials/rust.md)
- [Python сургалт](/mn/guide/tutorials/python.md)
- [JavaScript/TypeScript сургалт](/mn/guide/tutorials/javascript.md)
- [Мэдээллийн загвар](/mn/blockchain/data-model.md)
- [NFTs](/mn/blockchain/nfts.md)
