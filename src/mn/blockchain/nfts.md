---
translation_locale: mn
translation_source: /blockchain/nfts.md
translation_source_hash: 335eacd30c5964659baeeae8ac937805f1d4d786dd42a36e5164bbe75ef7e360
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Нүүр хуудас Iroha NFT нэг эзэмшигчтэй цорын ганц бүртгэлийн объект юм. NFTs бүртгэл өөрийнх нь тодорхойлолт, метадэт мэдээлэл, амьдралын мөрийн үйл явц, эзэмшлийн шилжүүлэн суулгах семантикатай байх хэрэгтэй боловч тооны тэнцвэртэй байх хэрэггүй.

Үүнээс ялгаатай нь [хөрөнгө](/mn/blockchain/assets.md), нэг NFT Тодорхой байдал, хөөцөлдөх чадвар эсвэл нэг бүртгэлийн хэмжээгүй байна. NFT нэг бүртгэлтэй объект гэж байдаг бөгөөд өмчлөх хөрөнгийг тухайн объект дээр шууд ажиглаж байна.

## Структура {#structure}

бүртгэгдсэн `Nft` нь:

- `id`: `NftId`
- `content`: NFT-ийн талаарх метадэр
- `owned_by`: NFT сангийн эзэмшигч

Үндсэн хуулийн `content` талбар нь `Metadata` Мап. Энэ нь компакт байх: дүрслэлийн талбайг хадгалах, тогтвортой сүлжээнүүд, хэшүүд, URIs, эсвэл SoraFS томоохон баримт бичиг, хэвлэл мэдээллийн хэрэгсэл эсвэл өндөр үр дүнтэй аппликейшнүүдээс гадаад зах зээлд хадгалж, зөвхөн шалгаруулж болно NFT.

## Taira дээр туршиж үзээрэй. {#try-it-on-taira}

Нийтийн Taira шинжилгээний сүлжээ нь одоогийн байдлаар NFT бүртгэлтэй эсэхийг шалгана уу:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

NFT замын тухай OpenAPI баримт бичгийг үзнэ үү:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Төлөөгүй `items` олон нийтийн туршилтын сүлжээнд хүчин чадалгүй хариу юм. NFTs одоогийн хуудас дээр, энэ биш NFT Дашрамд хүрэхгүй байна.

## NFT IDs {#nft-ids}

`NftId` нь дараах бичгийн хэлбэрээр ашигладаг:

```text
name$domain
name$domain.dataspace
```

Жишээ нь: `badge$docs.universal` тодорхойлдог `badge` NFT УИХ-ын `docs.universal` Мэдээллийн орон зай орхигдсаны дараа одоогийн шалгалтын систем нь `universal` өгөгдлийн орон зай, тиймээс `badge$docs` шийдвэрлэнэ `badge$docs.universal`.

Үндсэн нэрүүдийг ашиглах NFT IDs. Үндсэн хуулийн ID Энэ нь заавар, хайл, зөвшөөрөл, үйл явдлын филтр, хэрэглэлийн сүлжээнд ашиглагддаг объектний тодорхойлолт юм.

## Амьдралын мөчлөл {#lifecycle}

NFT амьдралын мөрийн үйл ажиллагааны хэрэглээ Iroha Арьс заавар:

- [`Register`](/mn/blockchain/instructions.md#un-register) үүсгэдэг NFT эхлүүлэх `content`.
- [`Unregister`](/mn/blockchain/instructions.md#un-register) нь NFT-ийг устгадаг.
- [`Transfer`](/mn/blockchain/instructions.md#transfer) өөрчлөлт `owned_by`.
- [`SetKeyValue` болон `RemoveKeyValue`](/mn/blockchain/instructions.md#setkeyvalue-removekeyvalue) шинэчлэл NFT Мэдээлэл мэдээлэл.

## Орон нутгийнхоо хувьд туршиж үзээрэй {#try-it-locally}

Эдгээр жишээ нь та орон нутгийн сүлжээг эхлүүлсэн бөгөөд [CLI заавар ](/mn/get-started/operate-iroha-via-cli.md)-ээс үүсгэсэн үйлчлүүлэгчний конфигурацийг эзэмшдэг гэж үздэг:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Урьдчилсан локаль сүлжээг аль хэдийнээ `wonderland.universal` болон түүний SNS өөр доменийг ашиглахын тулд эхлээд декларатив `app alias setup plan` болон `app alias setup apply` ажлын урсгал [Доменүүд](/mn/blockchain/domains.md#registration).

NFT нэвтрүүлэгт бүртгүүлэхэд стандарт өгөгдлийн эхлүүлсэн утгыг JSON уншдаг:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

NFT -ийг шууд шалгаж, дараа нь бүх NFTs-г бүрэн бүртгэлтэй жагсаалж үзээрэй:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Metadata товчийг нэмж, NFT дугаарыг дахин уншина уу:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Мета өгөгдөлний түлхэгийг зайлуул:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Үндсэн хуулийн заалтыг NFT. Хэрэглээ `ledger nft get` Одоогийн эзэнээс `owned_by`, болон ашиглах `ledger account list all` Зохиолтын дансыг олох ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Та дууссандаа цэвэрлэх. NFT, Энэ команд нь одоогийн эзэн бүртгэлийн конфигурацыг ашиглаж, эсвэл NFT Хамгийн түрүүнд эргэж ирнэ.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Судалгаа, үйл явдал {#queries-and-events}

Хэрэглээ [`FindNfts`](/mn/reference/queries.md#assets-nfts-and-rwas) жагсаалтад NFTs болон [`FindNftsByAccountId`](/mn/reference/queries.md#assets-nfts-and-rwas) жагсаалтад NFTs Сангийн эзэмшигч.

NFT бүртгэл, устгах, шилжүүлэн суулгах, метадэт мэдээллийн шинэчлэл гаргана. NFT Мэдээллийн үйл явдлууд. `Nft` мэдээллийн үйл явдлын филтр нь томоохон бүртгэлийн өөрчлөлттэй харилцах эсвэл NFT Амьдралын мөрийн үйл явдлууд.

## Тусгай зөвшөөрөл {#permissions}

Үүнд NFT -ийн хувьд тодорхой тэмдэгүүд байдаг:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Зөвшөөрлийн шалгалтыг идэвхтэй гүйлтийн хугацааны баталгаажуулагчаар хэрэгжүүлдэг тул сүлжээ нь гүйцэтгэгчийг шинэчлэх замаар зөвшөөрлийг өөрчилж болно. [Тусгай зөвшөөрлийн тэмдэгүүд](/mn/reference/permissions.md) одоогийн гарын үсэг тэмдэгтийн жагсаалтад.

## NFTs-ийг сонгох {#choosing-nfts}

Тухайн бүртгэлд NFT нэвтрүүлэг, эзэмшлийн ач холбогдолтой:

- Гэрчилгээ, тэмдэг, тусгай зөвшөөрөл, гэрчилгээ
- гишүүнчлэл болон нэвтрэх бүртгэл
- Хууль бүртгэлтэй эсвэл бүртгэлийн өмчит хүсэлт гаргах бүртгэл
- Хэвлэл мэдээллийн хэрэгсэл, баримт бичиг эсвэл манфистүүдээс гадуур байдаг

Хөдөлмөрийн үлдэгдлийн хувьд тооны актив ашиглаж, [ метрийн өгөгдлийг ](/mn/blockchain/metadata.md) ашиглах нь тухайн томоохон бүртгэлийн оршин тогтносон объектын цогц онцлог юм.

Дараахь мэдээллийг үзнэ үү:

- [Байгууллага](/mn/blockchain/assets.md)
- [Metadata](/mn/blockchain/metadata.md)
- [Сургалтууд](/mn/blockchain/instructions.md)
- [Судалгаа](/mn/blockchain/queries.md)
