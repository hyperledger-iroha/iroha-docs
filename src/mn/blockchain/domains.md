---
translation_locale: mn
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Доменүүд {#domains}

Доменүүд нь `World`. Одоогийн байдлаар Iroha
3 өгөгдлийн загвар домен нь эх өгөгдэл орон зайн
тодорхойлогч нь:

```text
domain.dataspace
```

Жишээ нь: `payments.universal` нэрүүд `payments` доменийн дотор
`universal` Мэдээллийн орон зай.

## Структура {#structure}

Бүртгэлтэй `Domain` дараах зүйлсийг агуулж байна:

- `id`: Мэдээллийн орон тооны эрх бүхий `DomainId`
- `logo`: сонголттой `SoraFS` URI доменийн лого
- `metadata`: нэн чухал ач холбогдолтой метабарууд
- `owned_by`: доменийн эзэмшигч данс, ерөнхийдөө
  бүртгүүлсэн

Тус доменийг материализ хийхэд ашигласан bootstrap нөөц нь `NewDomain`. Энэ нь
УИХ-ын гишүүн `id`, сонголттой `logo`, болон анхны `metadata`. Хөгжлийн цаг нь дүүрэн байна
`owned_by` Энэ хэрэглээний ачааллыг энгийн үйлчлүүлэгчид хүргүүлэхгүй
шууд.

## Бүртгэл {#registration}

Байнгын доменийг бий болгоход зарлалын нэрэмжит загварын урсгалыг ашигладаг.
SNS төвийг, эзэмшигчдийн чадвар, дуудлага хамгаалах, нэг атом дахь доменийн шугам
`EnsureAlias` гүйлгээ. `Register::Domain` Женезис/буутстрап хэвээр байна
цахилгаан замын `ledger domain` команд нь байхгүй `register` Дэд командлагч.

нууцгүй дэлгэцийг бүтээх `AliasSetupPlanRequestV1` санаачлан SDK эсвэл бордоод орох
үйлчилгээ, дараа нь CLI Амьдралтай харьцуулахад төлөвлөж, яг үүнийг хүргүүлнэ
төлөвлөгөө:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Үндсэн зорилго нь тодорхой `payments.universal`, санхүүгийн мэдээллийн орон зай, каноник
I105 эзэмшигч, лизингийн худалдан авалтын хугацаа, одоогийн бодлого / төлбөрийн үнийн саналыг хамгаалах.
Зохиолчдын төгсгөл нь `POST /v1/aliases/setup/plan`; эргэн ирүүлсэн төлөвлөгөө нь
Захиргаа, эрх мэдэл, улсын болон мөрийн хугацаатай.
[`Unregister`](/mn/blockchain/instructions.md#un-register).

Доменийг бий болгох эсвэл арилгах нь зохистой доменийн менежментийг шаарддаг
Active runtime validator-ийн дагуу зөвшөөрөлтэй. Доменийн метадэтгэлийг
[`SetKeyValue` болон `RemoveKeyValue`](/mn/blockchain/instructions.md#setkeyvalue-removekeyvalue)
эрх мэдэл тухайн доменийг өөрчлөх зөвшөөрөлтэй бол.

## Та үүнийг туршиж үзээрэй. Taira {#try-it-on-taira}

Нийтийн нээлттэй байгаа доменийг жагсаалт Taira туршилтын сүлжээ:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Олон нийтийн замын каталогиг мэдээллийн орон зайны нууц нэрээр хувилбарлан:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Хэрэглээний домен бий эсэхийг шалгахын тулд эхний команд ашигла.
Мэдээллийн орон зайг олон нийтэд хүргэж байгаа эсэхийг баталгаажуулахын тулд замын жагсаалт,
хязгаарлагдмал, эсвэл гол замын хойноо буурдаг.

Доменийг байлгах нь төлбөртэй бичлэг юм. Taira, хөөж
цахилгаан шугам
[Тестнэт аваарай XOR цаашид Taira](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
Үүнд `taira_faucet_claim.py`, гарын үсэг зурагч нь олон нийтийн галт тэрэгээр санхүүжүүлэх,
Нүүр хуудас:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Үргэлжсэн тестний зах зээлийн гүйлгээнд цорын ганц доменийн нэрний зорилго бий болгож,
Taira Одоогийн бодлого болон төлбөрийн хөрөнгийг үнэлгээний хяналт
орон нутгийн сүлжээ, эсвэл Minamoto.

## Бусад байгууллагуудтай харилцах харилцаа {#relationship-to-other-entities}

Доменийн тоног төхөөрөмж нь доменын хэмжээний мэдээллийн нэрсийн орон зайг бүрдүүлэхэд чиглэгдсэн.
Ашийн тодорхойлолтууд доменд шалгаруулсан тодруулгыг ашигладаг бөгөөд хайлтын жагсаалтыг хийх боломжтой
доменүүд эсвэл доменийн хүрээний объектүүдийг олох.
одоогийн мэдээллийн загварын доменгүй, гэхдээ бүртгэлүүд доменийг эзэмшиж, хадгалах боломжтой
Үндсэн дүрэм нь доменд ордог хөрөнгийг.

Дараахь мэдээллийг үзнэ үү:

- [Дэлхий](/mn/blockchain/world.md)
- [Ашигт малтмал](/mn/blockchain/assets.md)
- [Мэдээлэл](/mn/blockchain/metadata.md)
- [Тодруулгын дүрэм](/mn/reference/naming.md)
