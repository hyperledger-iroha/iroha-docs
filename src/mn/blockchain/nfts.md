---
translation_locale: mn
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# NFTs {#nfts}

Iroha NFT нь нэг эзэмшигчтэй цогц томоохон бүртгэлийн объект юм. Захираг өөрийнх нь тодорхойлолт, метадэт мэдээлэл, амьдралын мөрийн үйл явдлууд, эзэмшлийн шилжүүлэн суулгах семантика хэрэгтэй бол NFTs-ийг ашиглаарай, гэхдээ тооны тэнцвэр шаардлагагүй байдаг.

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

Хоосон `items` массив нь нийтийн тестнетийн хүчинтэй хариу юм. Энэ нь
одоогийн хуудсанд NFTs байхгүй гэсэн үг; NFT заавруудыг ашиглах боломжгүй
гэсэн үг биш.

## NFT IDs {#nft-ids}

`NftId` нь дараах бичгийн хэлбэрээр ашигладаг:

```text
name$domain
name$domain.dataspace
```

Тухайлбал, `badge$docs.universal` нь `badge` NFT доменийн `docs.universal` доменийг тодорхойлдог. Хэрэв өгөгдлийн орон зай орхигдсаны дараа одоогийн шалгуурч `universal` өгөгдлийг ашигладаг тул `badge$docs` нь `badge$docs.universal` гэж тогтоно.

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
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Өргөдсөн локаль сүлжээ нь `wonderland.universal` болон түүний SNS түрээсийн гэрээг байгуулж байна. Өөр доменийг ашиглахын тулд эхлээд `app alias setup plan` болон `app alias setup apply` ажлын урсгалыг [Domains](/mn/blockchain/domains.md#registration)-д тодорхойлсон .

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

NFT-ийг сонгох ёсоор шилжүүлнэ. `ledger nft get` -ыг ашиглан одоогийн эзэн `owned_by`-ээс уншихын тулд ашиглаж, `ledger account list all` -ийг ашиглан ID -ийн чиглэлийн дансыг олохын тулд ашиглаж болно.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Зааврыг туршиж дууссаны дараа жишээ NFT-г устгана уу. Хэрэв та үүнийг
шилжүүлсэн бол буцааж шилжүүлэх эсвэл одоогийн эзэмшигчийн дансны
тохиргоог ашиглан бүртгэлээс хасах командыг илгээнэ үү.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Судалгаа, үйл явдал {#queries-and-events}

[`FindNfts`](/mn/reference/queries.md#assets-nfts-and-rwas)-ийг ашиглан NFTs болон [`FindNftsByAccountId`](/mn/reference/queries.md#assets-nfts-and-rwas)-г ашиглан NFTs-ийн жагсаалтыг нэг дансанд хамаарна.

NFT бүртгэл, арилгах, шилжүүлэх, метадэтгэрийн шинэчлэл нь NFT мэдээллийн үйл явдлыг гаргадаг. `Nft` мэдээллийн үйл ажиллагааны филтр ашиглаж, номын сангийн өөрчлөлтийг бүртгэхэд эсвэл NFT амьдралын мөрийн үйл явдлын эсрэг хариу үйлдэл үзүүлдэг үйл ажиллагааг үүсгүүлж байна.

## Тусгай зөвшөөрөл {#permissions}

Үүнд NFT -ийн хувьд тодорхой тэмдэгүүд байдаг:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Зөвшөөрлийн шалгалтыг идэвхтэй runtime баталгаажуулагч хэрэгжүүлдэг тул
сүлжээ executor-оо шинэчлэх замаар зөвшөөрлийн бодлогоо өөрчилж болно.
Одоогийн үндсэн токенуудын жагсаалтыг [Зөвшөөрлийн токенууд](/mn/reference/permissions.md)-аас үзнэ үү.

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
