---
translation_locale: mn
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

## Үр дүн {#outcome}

Taira NFT төлөвийг шалгаж, дараа нь үүсгэсэн локал сүлжээнд өвөрмөц NFT бүртгэж, шинэчилж, шилжүүлж, асуухаар ажиллана. Ажлын урсгал нь бүрэн тодорхойлогдсон `name$domain.dataspace` NFT ID болон нэг протоколын стандарт I105 эзэмшигчийн ID-уудыг ашиглана.

## Өмнөх шаардлага {#prerequisites}

- `curl`, `jq`, Python 3.11 эсвэл дараа хувилбар, мөн одоогийн `iroha` CLI.
- Зөвхөн унших Taira хандалт.
- Бичихэд, [Эхлүүлэх Iroha](/mn/get-started/launch-iroha.md)-оос үүссэн локал сүлжээ, `http://127.0.0.1:8080`-д `./localnet/client.toml` ба Torii-той.

## Алхамууд {#steps}

### 1. Нийтийн Taira цуглуулгыг шалгах {#_1-inspect-the-public-taira-collection}

Хоосон хуудас бол амжилттай уншсан гэсэн үг юм: энэ нь хүссэн хуудаст ямар ч ил харагдах NFTs байхгүй гэсэн үг юм.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs нь давтагдашгүй бүртгэлүүд бөгөөд тоон үлдэгдэл биш юм. Эдгээр нь ID, нэг эзэмшигч, мөн нягтралтай `content` мета өгөгдлийн газрын зурагтай байна.

### 2. Орон нутгийн эзэмшигчдийн иргэний үнэмлэхийг бэлтгэ {#_2-prepare-local-owner-ids}

Энэ бичсэн жишээ нь бүртгэгдсэн `wonderland.universal` домэйнийг ашигладаг. Түүний хувийн түлхүүрийг ил гаргахгүйгээр тохируулагдсан зөвшөөрлийн эрхийг тодорхойлж, дараа нь шилжүүлгийн зориулалтаар өөр бүртгэлтэй дансыг сонго.

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

`$` салгагч нь NFT текст хэлбэрт хамаарна. Бүхэл `wonderland.universal` домайн ба өгөгдлийн орон зайлсан_suffix-ийг хадгал.

### 3. NFT-ийг анхны агуулгатайгаар бүртгэх {#_3-register-the-nft-with-initial-content}

CLI стандарт орноос анхны JSON объектыг уншдаг. Одоогийн эрхийн үндэс нь эзэмшигч болдог.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Агуулгын газрын зураг шинэчлэх {#_4-update-the-content-map}

Мета өгөгдлийн утгууд нь JSON байна. Түлхүүрийг тохируулах нь тухайн нэг бичлэгийг нэмэх эсвэл орлуулах бөгөөд бүх NFT бүртгэлийг орлохгүй.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Эзэмшлийг шилжүүлэх {#_5-transfer-ownership}

Нэг протокол-стандарт I105 дансны ID-уудыг хоёуланг нь ханга. Хэрэглэгдэхийн өмнө нэршлийг `--from` эсвэл `--to` болгон шийдвэрлэх ёстой.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Өөрт олгосон зөвшөөрлийн хязгаар

Он Taira-нд, бүр бичихэд мөн `--metadata ./taira.tx-metadata.json` ба тодорхой төлбөр төлөгч шаардлагатай. Бүртгэл, шилжүүлэг, устгал, болон мета өгөгдлийн шинэчлэлтийг идэвхтэй програмын гүйцэтгэлээр шалгаж байдаг орчин (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft`, ба `CanModifyNftMetadata` нь эхний зөвшөөрлийн давхраанд). Аппликейшндээ тодорхойлсон домайн ашиглах эсвэл энэ алхамын зааврыг localnet дээр хадгалаарай.

:::

Гэрээ эзэмшдэг ажлын урсгалын хувьд, Kotodama төрөлжсөн NFT хост функцийн дуудлагуудыг ил болгож байна. Доорх нь IVM барьсан баримт бичгийн тестээр угсарч, ажиллуулсан яг амьдралын мөчлөгийн тестийн жишээ юм:

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

Хоёр тогтмол I105 утгууд нь upstream туршилтын бүтээлүүд бөгөөд тестийн ажилллагч нь гүйцэтгэлээс өмнө чиглэлийг бүртгэдэг. Эдгээр нь CLI алхамын туршилт дахь `CURRENT_OWNER` болон `NEW_OWNER` биш юм. Программын гэрээний хувьд, түүний бодит ганц протокол-стандарт дансуудыг нийлүүлээд, дараа нь бүрдүүлж, туршиж, байрлуулж, [Өөрөө гүйцэтгэгдэх гэрээнүүд](./smart-contracts.md) дээрээс дуудах хэрэгтэй. Шинжилгээгүй байткодыг Taira руу илгээгээрэй биш, мөн гэрээний гүйцэтгэл нь програмын гүйцэтгэлийн орчны зөвшөөрлийг дамжсаар байгааг санаарай.

## Баталгаажуулах {#verify}

Шууд NFT-ийг уншиж, түүний эзэн нь солигдсон ч агуулга нь холбогдсон хэвээр байгааг батал:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Хэрэв CLI бичлэгийг гаралтын өгөгдлийн саванд ороож байвал, JSON-ийг нэг удаа шалгаж, агуулсан NFT объектоор баталгаажааг хэрэглэнэ. Эрх мэдлийн тогтмол үүрэг нь `id`, `owned_by`, ба `content` юм.

## Алдааг олох болон засах {#troubleshooting}

- `name$domain` зарим парсеруудад их хэмжээний өгөгдлийн сан руу үндсэн тохиргоогоор шилжиж болно, гэхдээ жор болон програмын ID нь тодорхой `name$domain.dataspace` хэлбэрийг ашиглах ёстой.
- Ижил NFT ID-г дахин бүртгэхийг татгалзав. Шинэ localnet ашиглаарай эсвэл өөрчлөлтгүй шинэ ID-г тусдаа бичлэгийн хувьд сонгоорой.
- Метадата оруулах мэдээлэл стандарт оруулганд хүчинтэй байх ёстой JSON. Давхар таслалын тэмдэггүй JSON шэл хэлбэрийн мөр нь метадата утга биш юм.
- Одоогийн эзэмшигчээс өөр данс гаргасан шилжүүлэг нь яг тодорхой зөвшөөрөл шаарддаг; `--from`-ыг өөрчлсөн ч криптограф гарын үсэг өөрчлөгдөхгүй.
- Шилжүүлсний дараа анхны клиент NFT-ыг өөрчлөх эсвэл бүртгэлээс устгахыг зөвшөөрөхгүй байж магадгүй. Шинэ эзэмшигчийн криптографийн гарын үсэг зурдаг эсвэл эрхтэй хянагчийг ашиглана уу.
- Taira хоосон NFT цуглуулгыг буцааж болно. `items: []`-ийг NFT зааварчилгаа байхгүй гэдгийн нотолгоо гэж битгий үзээрэй.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [NFT тогтсон эх кодын хувилбарт интеграцийн туршилтууд](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT эх кодын тогтоогдсон хувилбарт хост-техникийн дуудлагын туршилтууд](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Тодорхой Kotodama NFT амьдралын мөчлөгийн туршилтын зүйлд тогтсон эх кодын хувилбар дээр](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/mn/blockchain/nfts.md)
- [Метадата](/mn/blockchain/metadata.md)
- [Заавар](/mn/blockchain/instructions.md)
- [Өөрт нь зөвшөөрөл олгосон тэмдэглэгээ](/mn/reference/permissions.md)
