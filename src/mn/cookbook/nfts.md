---
translation_locale: mn
translation_source: /cookbook/nfts.md
translation_source_hash: f34043c1940b556439c23de7decc5e79f198f52eca8517dd8a9a5892d997e211
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## Үр дүн {#outcome}

Хяналт шалгах Taira NFT бичиж, дараа нь бүртгүүлэх, шинэчлэх, шилжүүлэн суулгах, NFT ажлын урсгал нь бүрэн чадвартай `name$domain.dataspace` NFT ID болон санхүүгийн I105 эзэмшигч IDs.

## Урьдчилсан шаардлага {#prerequisites}

- `curl`, `jq`, Python 3.11 болон дараагийн тоног төхөөрөмж `iroha` CLI.
- Зөвхөн уншдаг Taira хангамж.
- Үүнээс үүссэн орон нутгийн сүлжээ [Нэвтрүүлэг Iroha](/mn/get-started/launch-iroha.md), хамтран `./localnet/client.toml` болон Torii цаашид `http://127.0.0.1:8080`.

## Хадгалт {#steps}

### 1. Нийтийн Taira цуглуулгыг хяналт шалгана {#_1-inspect-the-public-taira-collection}

Халуун хуудас нь амжилттай уншдаг: энэ нь хүсэлт гаргасан хуудсанд харагдашгүй NFTs байхгүй гэсэн үг.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs нь тооны тэнцвэр биш өвөрмөц бүртгэл юм. Тэдэнд ID, нэг эзэмшигч болон компакт `content` метадэтгэрийн газрын зураг байдаг.

### 2. Орон нутгийн эзэмшигч IDs бэлтгэнэ {#_2-prepare-local-owner-ids}

Зохиоллын жишээ нь `wonderland.universal` доменийг ашигладаг. Хувийн түлхүүрээ илрүүлэхгүйгээр тохируулсан эрх мэдлийг гаргаж, дараа нь шилжүүлэн суулгах чиглэлээр өөр бүртгэлтэй дансыг сонгоно.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

`$` хуваагч нь NFT бичгийн хэлбэрт хамаарна. Тодорхой `wonderland.universal` домен болон мэдээллийн орчны хавсралтыг хадгалах.

### 3. NFT-ийг эхлүүлэх агуулгатайгаар бүртгүүлнэ. {#_3-register-the-nft-with-initial-content}

CLI нь анхны JSON объектыг стандарт өгөгдөөд уншдаг. Одоогийн эрх баригч эзэмшигч болно.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Зохиоллын газрын зургийг шинэчлэх {#_4-update-the-content-map}

Metadata-ын үнэ цэнэ нь JSON. Тагварын нэгийг оруулж, эсвэл тухайн нэг өгүүллийг солих; энэ нь бүх NFT бүртгэлийг солихгүй байна.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Хувьцааг шилжүүлэн суулгах {#_5-transfer-ownership}

Хоёр ч Canonical хангамж I105 бүртгэл IDs. Үндсэн хуулийн заалтыг ашиглахаас өмнө шийдвэрлэх ёстой `--from` эсвэл `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Тусгай зөвшөөрлийн хязгаар

Taira дээр бүх бичлэгт мөн `--metadata ./taira.tx-metadata.json` болон тодорхой төлбөрийн төлөгч хэрэгтэй. бүртгэл, шилжүүлэн суулгах, арилгах, метадэтгэлийг шинэчлэх нь идэвхтэй гүйлгээний цагаар шалгагдана. (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft`, болон `CanModifyNftMetadata` гэсэн үндсэн зөвшөөрлийн гадаргуудалд).

:::

Гэрээний эзэмшлийн ажлын урсгалын хувьд Kotodama нь NFT хостийн дуудлагаг хэвлүүлж байна. Дараах зүйл бол IVM баримт бичгийн шинжилгээгээр цуглуулсан, гүйцэтгэсэн амьдралын мөчлөгний тод тогтоол:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

Хоёр тогтсон I105 үнэ нь урсгалын өмнө шинжилгээний тоног төхөөрөмж юм; эргэлт гүйцэтгэхээс өмнө зориулалтын газрыг бүртгэнэ. Тэд `CURRENT_OWNER` болон `NEW_OWNER` нь CLI замын хөдөлгөөнөөс биш байна. Хэрэглэлийн гэрээний хувьд, түүний бодит санхүүгийн тооцоог хангаж, дараа нь [ ухаалаг гэрээүүдээр дамжуулан цуглуулж, шинжилгээ хийж, ашиглаж, дуудлаарай](./smart-contracts.md). Хяналт шалгагдаагүй байт кодыг Taira-д өргөн мэдүүлэхгүй байх бөгөөд гэрээний гүйцэтгэл цаашид ч гүйлтийн хугацааны зөвшөөрлийг өнгөрүүлдэг гэдгийг сана.

## Бүртгэнэ {#verify}

NFT -ийг шууд уншиж, түүний эзэмшигч нь өөрчлөгдөж байсан бол агуулга нь хэвээр үлдсэн гэдгийг баталгаажуулна:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Хэрэв CLI баримтыг гаргах хуудастай хамруулбал, JSON нэг удаа, тухайн мэдэгдлийг NFT Тодорхой зүйл. Эрхэмжит инвариантууд нь: `id`, `owned_by`, болон `content`.

## Ашигтвортой байдлын асуудал {#troubleshooting}

- `name$domain` нь зарим parsers-д бүх нийтийн өгөгдлийн орон зайд тохиромжтой байж болно, гэхдээ хоолны ном болон хэрэгсэл IDs нь тодорхой `name$domain.dataspace` хэлбэрийг ашиглах ёстой.
- Үүнтэй ижил NFT ID-ийн давтамд бүртгэлийг татгалзаж байна. Шинэ локаль сүлжээ ашиглах эсвэл тодорхой бүртгэлийн тулд тогтвортой шинэ ID сонгох
- Metadata өгөгдөл нь стандарт өгөгдөл дээр JSON хүчин төгөлдөр байх ёстой. JSON-ийн дуудлагагүй шилжин шугам нь метадэтгийн үнэ цэнэ биш юм.
- Одоогийн эзэмшигчээс бусад дансны гарын үсэг зурсан шилжүүлэн суулгах нь тодорхой зөвшөөрлийг шаарддаг; `--from` -ийг өөрчлөх нь гарын үсгийнчийг өөрчлөхгүй.
- Хөдөлмөрийг шилжүүлсний дараа анхны үйлчлүүлэгчид NFT -ийг өөрчлөх эсвэл бүртгүүлэхээс татгалзах боломжгүй болно. Шинэ эзэмшигчдийн гарын үсэг зурагч эсвэл зөвшөөрөлтэй хяналтын ажилтан ашиглах.
- Taira нь хоосон NFT цуглуулгыг буцааж өгөх боломжтой. `items: []` нь NFT зааваргүй байдгийг баталгаажуулах баримт гэж бүү хэл.

## Эх сурвалж, холбогдох баримт бичгүүд {#source-and-related-docs}

- [NFT нэгтгэл шинжилгээний үзэл баримтлал](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/nft.rs)
- [Kotodama NFT хост-сэлгээний туршилтыг тавигдсан үүрэг гүйцэтгэгч ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Тухайн Kotodama NFT амьдралын мөчлөгний тохируулгыг тавигдсан commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/docs/examples/12_nft_flow.ko) дээр
- [NFTs](/mn/blockchain/nfts.md)
- [Metadata](/mn/blockchain/metadata.md)
- [Сургалтууд](/mn/blockchain/instructions.md)
- [Тусгай зөвшөөрлийн токенүүд](/mn/reference/permissions.md)
