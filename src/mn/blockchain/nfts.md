---
translation_locale: mn
translation_source: /blockchain/nfts.md
translation_source_hash: 216f59f1cebd73001dab75dcf235306082fb1c0759437f65ce34ec9e1ed51d4f
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review+reviewed-delta
---
# NFTs {#nfts}

Iroha NFT нь нэг эзэмшигчтэй, давтагдашгүй бүртгэлийн объект юм. Бичлэгт өөрийн ID, metadata, амьдралын мөчлөгийн үйл явдал болон өмчлөл шилжүүлэх семантик хэрэгтэй боловч тоон үлдэгдэл хэрэггүй үед NFTs ашиглана.

Санхүүгийн [ хөрөнгийн ](/mn/blockchain/assets.md) ялгаатай нь, NFT нь тод байдал, mintability, эсвэл нэг бүртгэлийн хэмжээг байхгүй. NFT нь нэг бүртгэлтэй объект болгон байдаг бөгөөд өмчлөгчийг шууд тухайн объект дээр ажиглаж байна.

## Структура {#structure}

бүртгэгдсэн `Nft` нь:

- `id`: `NftId`
- `content`: NFT-ийн талаарх метадэр
- `owned_by`: NFT сангийн эзэмшигч

`content` талбай нь `Metadata` газрын зураг юм. Тодруулъя: тодорхойлох талбайг, тогтвортой сүлжээнүүд, хэшиг, URIs эсвэл SoraFS замыг хадгалах. Их баримт бичиг, хэвлэл мэдээллийн хэрэгсэл эсвэл өндөр үр дүнтэй аппликейшнүүдийн байр суурийг гадуур хадгалах, зөвхөн шалгах сүлжээнд NFT хадгалах

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

Хоосон `items` массив нь нийтийн тестнетийн хүчинтэй хариу юм. Энэ нь одоогийн хуудсанд NFTs байхгүй гэсэн үг; NFT заавруудыг ашиглах боломжгүй гэсэн үг биш.

## NFT IDs {#nft-ids}

`NftId` нь дараах бичгийн хэлбэрээр ашигладаг:

```text
name$domain
name$domain.dataspace
```

Жишээлбэл, `badge$docs.universal` нь `docs.universal` домэйн дахь `badge` NFT-г тодорхойлно. Өгөгдлийн орон зайг орхивол одоогийн задлагч `universal` өгөгдлийн орон зайг ашигладаг тул `badge$docs` нь `badge$docs.universal` болж тайлагдана.

NFT IDs-ийн хувьд тогтвортой нэр ашиглах. ID нь заавар, хайлт, зөвшөөрөл, үйл явдлын филтр, хэрэглэлийн сүлжээнд ашиглагддаг объектын тодорхойлолт юм.

## Амьдралын мөчлөл {#lifecycle}

NFT амьдралын мөрийн үйл ажиллагааны хэрэглээ Iroha Арьс заавар:

- [`Register`](/mn/blockchain/instructions.md#un-register) нь анхны `content` хамт NFT үүсгэнэ.
- [`Unregister`](/mn/blockchain/instructions.md#un-register) нь NFT-ийг устгадаг.
- [`Transfer`](/mn/blockchain/instructions.md#transfer) өөрчлөлт `owned_by`.
- [`SetKeyValue` болон `RemoveKeyValue`](/mn/blockchain/instructions.md#setkeyvalue-removekeyvalue) шинэчилсэн NFT метад мэдээлэл.

## Орон нутгийнхоо хувьд туршиж үзээрэй {#try-it-locally}

Эдгээр жишээ нь та орон нутгийн сүлжээг эхлүүлсэн бөгөөд [CLI заавар ](/mn/get-started/operate-iroha-via-cli.md)-ээс үүсгэсэн үйлчлүүлэгчний конфигурацийг эзэмшдэг гэж үздэг:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN='<OWNED_DOMAIN>.universal'
export NFT_ID="badge_intro\$$NFT_DOMAIN"
```

Үүсгэсэн дотоод сүлжээ үйлчлүүлэгчдээ хэрэглээний домэйн бүртгэдэггүй. `NFT_DOMAIN`-г гарын үсэг зурах дансны эзэмшдэг эсвэл тухайн данс `CanRegisterNft` эрхтэй домэйнд тохируулна. Домэйн үүсгэхийн тулд [Домэйн](/mn/blockchain/domains.md#registration) хэсгийн мэдэгдлийн `app alias setup plan` болон `app alias setup apply` урсгалыг ашиглана.

NFT нэвтрүүлэгт бүртгүүлэхэд стандарт өгөгдлийн эхлүүлсэн утгыг JSON уншдаг:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft register --id "$NFT_ID"
```

NFT -ийг шууд шалгаж, дараа нь бүх NFTs-г бүрэн бүртгэлтэй жагсаалж үзээрэй:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list --all
```

Metadata товчийг нэмж, NFT дугаарыг дахин уншина уу:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Мета өгөгдөлний түлхэгийг зайлуул:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Хүсвэл NFT-г шилжүүлнэ. Одоогийн эзэмшигчийг `owned_by`-оос уншихдаа `ledger nft get`, хүлээн авах дансны ID-г олохдоо `account list --all` ашиглана.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  account list --all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Зааврыг туршиж дууссаны дараа жишээ NFT-г устгана уу. Хэрэв та үүнийг шилжүүлсэн бол буцааж шилжүүлэх эсвэл одоогийн эзэмшигчийн дансны тохиргоог ашиглан бүртгэлээс хасах командыг илгээнэ үү.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft unregister --id "$NFT_ID"
```

## Асуулга, үйл явдал {#queries-and-events}

[`FindNfts`](/mn/reference/queries.md#assets-nfts-and-rwas)-ийг ашиглан NFTs болон [`FindNftsByAccountId`](/mn/reference/queries.md#assets-nfts-and-rwas)-г ашиглан NFTs-ийн жагсаалтыг нэг дансанд хамаарна.

NFT бүртгэх, устгах, шилжүүлэх болон metadata шинэчлэхэд NFT data event гарна. Бүртгэлийн өөрчлөлтийг захиалах эсвэл NFT-ийн lifecycle event-д хариу үйлдэл үзүүлэх trigger үүсгэхдээ `Nft` data event filter-ийг ашиглана.

## Тусгай зөвшөөрөл {#permissions}

Үүнд NFT -ийн хувьд тодорхой тэмдэгүүд байдаг:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Зөвшөөрлийн шалгалтыг идэвхтэй гүйцэтгэх орчны баталгаажуулагч хэрэгжүүлдэг тул сүлжээ executor-оо шинэчлэх замаар зөвшөөрлийн бодлогоо өөрчилж болно. Одоогийн үндсэн токенуудын жагсаалтыг [Зөвшөөрлийн токенууд](/mn/reference/permissions.md)-аас үзнэ үү.

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
- [Зааврууд](/mn/blockchain/instructions.md)
- [Асуулга](/mn/blockchain/queries.md)
