---
translation_locale: mn
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Доменүүд {#domains}

Домен нь `World` -д бүртгэгдсэн нэр орон нутгийн нэр юм. Одоогийн Iroha 3 мэдээллийн загварын домен нь эх өгөгдлийн орон нутгаар шалгардаг тул каноникийн тодруулгыг:

```text
domain.dataspace
```

Тухайлбал, `payments.universal` нь `payments` доменийг `universal` мэдээллийн орон зайны дотор нэрлэдэг байна.

## Структура {#structure}

бүртгэгдсэн `Domain` нь:

- `id`: өгөгдлийн орон тооны эрх бүхий `DomainId`
- `logo`: доменийн логогийн хувьд сонголттой `SoraFS` URI
- `metadata`: сонголттой түлхүүрний үнэлгээний метадэтгэлэг
- `owned_by`: доменийн эзэмшигч, ихэвчлэн түүнийг бүртгэсэн данс

Тус доменийг материализ хийхэд ашигласан bootstrap ашиг ачаалл нь `NewDomain`. Энэ нь ... `id`, сонголттой `logo`, болон анхны `metadata`. Хөдөлмөрийн цаг нь дүүрэн байна `owned_by` Энэ хэрэглээний ачааллыг энгийн үйлчлүүлэгчид шууд хүргэхгүй байна.

## Бүртгэл {#registration}

Байнгын доменийг бий болгох нь декларатив алиаст тохируулалтын урсгалыг ашигладаг. Энэ нь SNS түрээсийн гэрээ, эзэмшигчдийн чадвар, дуудлага хамгаалагч, доменийн шугамг нэг атомын `EnsureAlias` гүйлгээд хадгалж байдаг. `Register::Domain` бол эх үүсвэр / буутстрап гаралтай хэвээр үлддэг бөгөөд `ledger domain` команд нь ямар нэгэн `register` дэд командгүй.

SDK эсвэл борлуулалтын үйлчилгээгээр нууцгүй `AliasSetupPlanRequestV1` зориулалтыг бий болгох, дараа нь CLI-ийн төлөвлөгөөг амьд байдалтай харьцуулахад оруулж, яг энэ төлөвлөгөөг өргөн мэдүүлэх:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Зохиоллын зорилго нь `payments.universal`, түүний тооны өгөгдлийн орон зай, I105-ийн сонин эзэмшигч, лизингийн худалдан авалтын хугацаа, одоогийн бодлого / төлбөрийн үнийн саналыг хамгаалагчдыг тодорхойлдог. төлөвлөлтийн төгсгөлийн цэг нь `POST /v1/aliases/setup/plan`; түүний буцаасан төлөвлөгөө нь зангил, эрх мэдэл, улс орон болон эцсийн хугацаагаар хамааралтай. Доменийг арилгахад [`Unregister`](/mn/blockchain/instructions.md#un-register) ашигладаг.

Доменийг бий болгох эсвэл арилгах нь идэвхтэй гүйлгээний цаг хугацааны баталгаажуулагчаар доменийн удирдлагын зохистой зөвшөөрлийг шаарддаг. Тус доменийг өөрчлөх эрх мэдэлтэй бол [`SetKeyValue` болон `RemoveKeyValue`](/mn/blockchain/instructions.md#setkeyvalue-removekeyvalue) доменийг шинэчлэх боломжтой.

## Taira дээр туршиж үзээрэй. {#try-it-on-taira}

Нийтийн Taira тестний сүлжээнд одоогийн байдлаар харагдаж буй доменүүдийг жагсаалт:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Олон нийтийн замын жагсаалтыг өгөгдлийн орон зайны нууц үсэгт буулгах:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Хэрэглэгчийн домен бий эсэхийг шалгахын тулд эхний тушаалыг ашигла. Мэдээллийн орон зай нь нийтийн, хязгаарлалттай эсвэл гол замаар хойших эсэхийг баталгаажуулахын тулд замын жагсаалтыг хэрэглэж болно.

Доменийн тохируулалт нь төлбөр төлөх бичлэг юм. Taira дээр туршиж үзэхээс өмнө, [-аас крангийн туслахг хадгалахдаа Testnet XOR-ийг Taira](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-д `taira_faucet_claim.py` гэж олох, олон нийтийн кран ашаар гарын үсэг зурагчдаа санхүүжүүлэх, мөнгөн төлбөрийн метабараа хавсрал:

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

Урьдчилсан туршилтын сүлжээний гүйлгээ дээр өвөрмөц доменын нэрийг зориулан төлөвлөгөө байгуулж, Taira -ийн одоогийн бодлого болон төлбөрийн хөрөнгийн үнийн саналыг ашиглах. Localnet эсвэл Minamoto -ийн хувьд үйлдвэрлэсэн төлөвлөгөөг дахин хэрэглэхгүй.

## Өөр нэгжүүдтэй харилцах харилцаа {#relationship-to-other-entities}

Доменын бүлэгт томоохон бүртгэлийн объектүүд байдаг бөгөөд доменийн хэмжээнд өгөгдлийн нэр орон зай бүрдүүлнэ. Соёлын тодорхойлолт нь доменийн шалгаруулалттай идентификаторуудыг ашигладаг, асуултууд доменүүдийг жагсаалж эсвэл олж болно Тодруулбал тухайн доменд хүрээтэй объектууд байдаг. Хууль бүртгэл нь одоогийн мэдээллийн загварын доменгүй боловч данс эзэмшиж, тодорхойлолт нь доменийн дор амьдардаг хөрөнгийг хадгалах боломжтой юм.

Дараахь мэдээллийг үзнэ үү:

- [Дэлхийн](/mn/blockchain/world.md)
- [Байгууллага](/mn/blockchain/assets.md)
- [Metadata](/mn/blockchain/metadata.md)
- [Тодруулгын дүрэмүүд](/mn/reference/naming.md)
