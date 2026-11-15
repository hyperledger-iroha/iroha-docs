---
translation_locale: mn
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Домэйнууд {#domains}

Домэйн нь `World` дотор бүртгэсэн нэртэй нэрийн орон зай юм. Одоогийн Iroha 3 өгөгдлийн загварт домэйныг харьяалах өгөгдлийн орон зайтай нь хамт тодорхойлдог тул каноник танигч нь:

```text
domain.dataspace
```

Жишээлбэл, `payments.universal` нь `universal` өгөгдлийн орон зай дахь `payments` домэйныг нэрлэнэ.

## Бүтэц {#structure}

Бүртгэлтэй `Domain` нь дараах зүйлийг агуулна:

- `id`: өгөгдлийн орон зайгаар бүрэн тодорхойлсон `DomainId`
- `logo`: домайн логоны хувьд сонголтоор `SoraFS` URI
- `metadata`: дурын түлхүүр-утга metadata
- `owned_by`: домэйнийг эзэмшдэг данс, ихэвчлэн үүнийг бүртгэсэн данс

Салбар үүсгэхэд ашигласан bootstrap ачаа нь `NewDomain` юм. Үүнд `id`, сонголтын `logo`, ба анхны `metadata` агуулагдана. Програмын гүйцэтгэх орчин `owned_by`-г эрх олгогчийн үндсэнээс бөглөж өгдөг. Энгийн хэрэглэгчид энэ ачааг шууд илгээдэггүй.

## Бүртгэл {#registration}

Энгийн домайн үүсгэх нь тунхагласан alias тохиргооны урсгалыг ашигладаг. Энэ нь SNS түрээс, эзэмшигчийн чадварууд, төлбөр-үнэ баталгаажуулах хамгаалалт, домайн мөрийг нэг атомын `EnsureAlias` гүйлгээнд хадгална. `Register::Domain` нь үүсгэн байгуулах/эхлэх нүүр тал хэвээр байна, мөн `ledger domain` тушаал нь `register` дэд тушаалгүй байна.

Нууцгүй `AliasSetupPlanRequestV1` зорилгыг SDK эсвэл нэвтрэх үйлчилгээтэй үүсгэж, дараа нь CLI-д үүнийг амьд төлөвт төлөвлүүлж, яг тэр төлөвлөгөөг илгээ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

Зорилго нь `payments.universal`, түүний тоон өгөгдлийн орон зай, каноник I105 эзэмшигч, түрээс авах хугацаа болон одоогийн бодлого/төлбөрийн үнийн саналын шалгах нөхцөлийг тодорхойлно. Төлөвлөгчийн төгсгөлийн цэг нь `POST /v1/aliases/setup/plan`; буцаасан төлөвлөгөө сүлжээ, эрх бүхий этгээд, төлөв болон эцсийн хугацаатай холбогдоно. Домэйн устгахад [`Unregister`](/mn/blockchain/instructions.md#un-register)-ийг хэвээр ашиглана.

Домэйнийг үүсгэх эсвэл устгах нь холбогдох домэйн удирдлагын зөвшөөрлийг шаардана. идэвхтэй програм хангамжийн гүйцэтгэлийн орчны баталгаажуулагч. Домэйн мета өгөгдлийг шинэчилж болно [`SetKeyValue` болон `RemoveKeyValue`](/mn/blockchain/instructions.md#setkeyvalue-removekeyvalue) зөвшөөрлийн үндэслэл нь тухайн домайныг өөрчлөх эрхтэй байх үед.

## Энэ урсгалыг Taira-д ажиллуулна уу {#try-it-on-taira}

Одоогоор олон нийтэд үзэгдэх Taira тест сүлжээнд байгаа домэйнуудыг жагсаана уу:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Нийтэд нээлттэй эгнээний каталогийг өгөгдлийн орон зайн өөр нэрүүдтэй харгалзуулна:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Хэрэглээ домэйн байгаа эсэхийг шалгах шаардлагатай бол эхний командыг ашиглана. Өгөгдлийн орон зайтай холбоотой эгнээнүүдийг, үүнд эгнээ бүрийн нийтэд нээлттэй эсвэл хязгаарлагдсан харагдах байдал, үндсэн эгнээтэй харьцуулсан синхрончлолын төлөвийг шалгахдаа эгнээний каталогийг ашиглана.

Домэйн тохируулах нь шимтгэлтэй бичих үйлдэл юм. Taira дээр туршихын өмнө [Taira дээр туршилтын XOR авах](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) хэсгийн урьдчилан бэлтгэдэг хөрөнгө авах урсгалаар гарын үсэг зурах дансыг санхүүжүүлж, дараа нь шимтгэл төлөгчийг илэрхий заан төлөвлөгөөг хэрэгжүүлнэ. CLI гарын үсэг зурахаас өмнө яг шимтгэлийг тооцож харуулна:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Давтагдсан тестнетийн гүйлтэнд зориулж өвөрмөц домэйн нэрийн төлөвлөгөөг бий болгож, Taira-ын одоогийн бодлого болон төлбөрийн активын төлбөрийн үнэлгээний баталгааг ашигла. Орон нутгийн сүлжээ эсвэл Minamoto-д зориулан гаргасан төлөвлөгөөг дахин ашиглаж болохгүй.

## Бусад нэгжүүдтэй харилцаа {#relationship-to-other-entities}

Домэйнүүд блокчэйн бүртгэлийн объектуудыг группчилж, домэйнд хамаарах өгөгдлийн нэрийн орон зайг өгдөг. Хөрөнгийн тодорхойлолтууд домэйн-эрүүл баталгаатай танигчуудыг ашигладаг бөгөөд асуулгууд домэйнүүдийг жагсааж болно эсвэл доменд хамаарах объектуудыг олно. Бүртгэлүүд өөрөө өнөөдрийн өгөгдлийн загвар дээр доментай биш боловч бүртгэлүүд домен эзэмшиж, доменд тодорхойлолттой активуудыг хадгалах боломжтой.

Мөн үзэх:

- [Дэлхий](/mn/blockchain/world.md)
- [Хөрөнгө](/mn/blockchain/assets.md)
- [Метадата](/mn/blockchain/metadata.md)
- [Нэрлэх дүрэм](/mn/reference/naming.md)
