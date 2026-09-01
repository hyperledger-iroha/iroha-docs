---
translation_locale: mn
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Хувийн өгөгдлийн сангийн ивээн тэтгэгчийн төлбөр {#sponsor-fees-for-a-private-dataspace}

Төлбөрийн ивээн тэтгэл нь хэрэглэгчдэд XOR барьцаалахгүйгээр хувийн өгөгдлийн сангийн гүйлгээ хийх боломжийг олгодог. Хэрэглэгч гүйлгээг одоогийн байдлаар гарын үсэг зурсаар байна. Гүйлгээний метадата ивээн тэтгэгчийн дансны хаягийг заадаг бөгөөд програм хангамжийн гүйцэтгэх орчин сүлжээний төлбөрт зориулж ивээн тэтгэгчийн XOR балансыг хасдаг.

Нэгтгэх явцад гурван хөдөлгөөнт хэсэг байдаг:

1. тус зангилаа төлбөрийн ивээн тэтгэгчийг зөвшөөрдөг
2. спонсорийн данс байгаа бөгөөд үүнд XOR байна
3. тэр хэрэглэгч бүрт тэр ивээн тэтгэгчийн хувьд `CanUseFeeSponsor` байна

Үүний дараа, ивээн тэтгэсэн хэрэглэгчийн бүх гүйлгэээнд зөвхөн энэ метадатаг л хэрэгтэй болно:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Энэ хуудас нь хоёр нийтлэг загварыг харуулж байна:

- Үнэгүй хэрэглэгч бичвэл: ивээн тэтгэгч XOR-ыг төлнө, хэрэглэгч юу ч төлөхгүй.
- Орон нутгийн токенийн тэтгэмж: хэрэглэгч аппын токеноор ивээн тэтгэгчдэд төлдөг бөгөөд ивээн тэтгэгч сүлжээнд XOR төлдөг.

Эхлээд Taira эсвэл хувийн туршилтын сүлжээг ашигла. Шинэ хувийн өгөгдлийн талбар нь оператор ба засаглалын өөрчлөлт бөгөөд клиент тохиргоо руу үүсдэггүй.

## Жишээ утгууд {#example-values}

Доорх командууд эдгээр орлуулагчийг ашиглана:

```bash
export DATASPACE="team"
export USER="<USER_ACCOUNT_I105>"
export SPONSOR="<SPONSOR_ACCOUNT_I105>"
export TREASURY="<TREASURY_ACCOUNT_I105>"
export XOR_ASSET="xor#universal"
export BILLING_DOMAIN="billing.team"
export LOCAL_FEE_ASSET="usage#billing.team"
export LOCAL_FEE_ASSET_ID="<LOCAL_FEE_ASSET_DEFINITION_BASE58>"
export USER_ALIAS="alice@team"
export PHONE_POLICY="phone#team"
export EMAIL_POLICY="email#team"
export POLICY_OWNER="<IDENTIFIER_POLICY_OWNER_ACCOUNT_I105>"
```

Нэг протокол-стандарт I105 дансны ID-г ашигла, хэрэв таны суурилуулалт нь эдгээр дансуудын идэвхитэй дансны нэрийн өөр хувилбаруудтай биш бол.

## 1. Мэдээллийн санг бэлдэнэ {#_1-prepare-the-dataspace}

Эхлэхдээ хувийн өгөгдлийн сангийн каталог болон [SORA Nexus Датаспэйс-үүдтэй холбогдох](/mn/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace) дээр дүрсэлсэн чиглүүлэх ажлаас эхэлнэ. Операторын харах хэсэг нь ийм хэв маягтай болно:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "team-private"
description = "Private team lane"
dataspace = "team"
visibility = "private"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "team"
id = 42
description = "Private team dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "team"
[nexus.routing_policy.rules.matcher]
account_prefix = "team."
description = "Route team domains to the private dataspace"
```

Хэрэглэгчийн гүйлгээ рүү шилжихээсээ өмнө дараах зүйлийг шалгаарай:

- хувийн гүйцэтгэлийн сувгийн үзүүлэлт `/status` зангилааны хариунд гарч байна
- хэрэглэгчийн дансуудыг таны хувийн нэвтрүүлэлтийн урсгалаар хүлээн авч байна
- спонсорын данс байна
- XOR төлбөрийн хөрөнгө болон төлбөрийн нөөцийн данс нь сүлжээнд хүчинтэй байна

## 2. Мэдээллийн орон зайд хөрөнгүүдийг бүртгэх {#_2-register-assets-in-the-dataspace}

Хэрэглэгчид хувийн өгөгдлийн сан дотор эзэмших хөрөнгийн тодорхойлолтыг програмын логик руу холбохоосоо өмнө бүртгээрэй. Орон нутгийн токены төлбөрийн загварын хувьд сургалтын жишээнд `usage#billing.team` ашигласан:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Эхлээд домэйн болон эд хөрөнгийн namespace-ийг эзэмшдэг SNS түрээсийг тохируул. `$BILLING_DOMAIN` дээр зориулсан нууцгүй `AliasSetupPlanRequestV1` зорилгыг үүсгэхдээ тоон `team` датасын ID, нэг протокол стандарт эзэмшигч, түрээсний хугацаа, одоогийн үнийн хамгаалалтыг оруул:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Дараа нь хөрөнгийн тодорхойлолтыг бүртгэ. Нэг протоколын стандарт `--id` нь сүлжээний түвшний хөрөнгийн тодорхойлолтын ID юм. Алиас нь хөгжүүлэгчид болон эцсийн хэрэглэгчид dataspace кодонд ашиглах ёстой зүйл юм:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

хэрэглэгчийг бүртгэх явцад орон нутгийн токеныг гаргах эсвэл шилжүүлэх:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Хэрэглэгчийн үлдэгдлийг шалгаарай:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Дата орон зай дахь програмын хөрөнгийн хувьд ижил загварыг ашиглана уу. Токен бүрийн нэг хөрөнгийн тодорхойлолтыг бүртгэж, тус бүрт нь дата орон зай дахь овог нэр олгоод, нэг протоколын стандарт хөрөнгийн тодорхойлолтын ID-г хатуу кодлохын оронд SDK кодоос овог нэрийг дурдаарай.

## 3. Хэрэглэгчийн нэрийн оронд ашиглагдах нэрийг бүртгүүлэх {#_3-register-user-aliases}

Данснууд одоо ч гэсэн нэг протоколын стандарт I105 дансны ID-ууд хэвээр байна. Хэрэглэгчийн харах нэрс нь дансны орлуулга нэрс бөгөөд орлуулга нэрс нь нууц биш гарчигууд байх ёстой. жишээлбэл `alice@team` эсвэл `alice@members.team`. Утасны дугаар эсвэл и-мэйл хаягийг орлуулга болгон бүү ашигла. Тэд дараагийн хэсэгт хувийн танигч урсгалд хамаарна.

Alias тохиргоо нь domain тохиргоотой ижил тунхаглалын төлөвлөгчийг ашигладаг. SDK эсвэл onboarding үйлчилгээ нь нууцгүй `AliasSetupPlanRequestV1` зорилгыг үүсгэж, түүний дансны alias оруулга нь чиглэдэг болгоно `$USER`, үндсэн үүргийг сонгож, тоон датa сангийн ID-г нааж, одоогийн түрээсийн төлбөр-үнэлгээ шалгах хамгаалалтыг авч явна. Дараа нь үүнийг нэг атомын гүйлгээн дээр төлөвлөж хэрэгжүүлнэ:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Хэрэв хэрэглэгч XOR-ыг төлөх ёсгүй бол, батлагдсан ивээн тэтгэгчийг мэддэг нэвтрүүлэх үйлчилгээг ашиглан суулгах гүйлгээг бүрдүүлж илгээнэ үү. Түрээсийн худалдан авалт болон нэрийн холбоог бие даасан програмын гүйлгээнд хуваарилж болохгүй.

Жинхэнэ нэрийг холбосны дараа үүнийг CLI дээрээс шалгана уу:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Шинэ акаунт үүсгэхдээ тогтвортой `uaid` бүхий `NewAccount` бүтээдэг бөгөөд шаардлагатай бол анхны `label` ашигладаг onboard үйлчилгээийг сонгоорой. Энгийн `ledger account register --id` команд нь зөвхөн нэг протокол стандартад нийцсэн акаунт ID-г бүртгэнэ.

## 4. FHE-т утас болон имэйл хаягаа хувийн байдлаар бүртгүүлэх {#_4-register-phone-and-email-privately-with-fhe}

Утасны дугаар болон имэйл хаягийг олон нийтэд үзүүлэх нэр биш, хувийн тодорхойлогч хэлбэрээр ашигла. FHE-д суурилсан урсгал нь дансны нэр, гүйлгээний мета өгөгдөл, дэлхийн төлөвд анхны тодорхойлогчийг оруулахгүй байлгана:

1. оператор утас болон и-мэйлд зориулж [RAM-LFE/FHE хөтөлбөрийн бодлого](/mn/blockchain/ram-lfe.md) бүртгэдэг
2. аппликатор идэвхтэй танигч бодлогыг бүртгэнэ, жишээ нь `phone#team` ба `email#team`
3. цүнх нь утас эсвэл имэйлийг локал байдлаар хэвийн болгодог
4. хэтэвч нь шифрлэгдсэн утгыг шийдэгч рүү илгээдэг
5. шийдвэрлэгч `IdentifierResolutionReceipt`-ыг буцаана
6. хэрэглэгч протоколын үр дүнгийн бичлэгтэй `ClaimIdentifier`-г илгээдэг
7. сүлжээ нь утас эсвэл имэйлийн түүхий утгыг бус, далд танигч болон баримтын хэшийг хадгална

Үйлдлийн талын бодлогын тохиргоо нь SDK эсвэл үйлчилгээний ажил юм. Төрөл бүрийн танигч бүрийн хувьд эдгээр зааврын хослолыг бүтээж өгнө үү:

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "$POLICY_OWNER",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "$PHONE_POLICY",
  owner = "$POLICY_OWNER",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "$PHONE_POLICY")
```

Үүнийг имэйлээр давтана уу, дараахтай:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Бүртгэл үүсгэх үед түрийвч эсвэл арын системд орон нутгийн хэмжээнд хэвийн болгох хэрэгтэй:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

8-р алхамд ивээн тэтгэгчийн мета өгөгдлийн файлыг үүсгэсний дараа, тэр мета өгөгдөлтэй хэрэглэгчийн гарын үсэг зурсан нэхэмжлэх зааврыг илгээнэ үү:

```text
ClaimIdentifier(
  account = "$USER",
  receipt = IdentifierResolutionReceipt {
    payload: {
      policy_id: "$PHONE_POLICY",
      opaque_id: "<OPAQUE_ACCOUNT_ID>",
      uaid: "<USER_UAID>",
      account_id: "$USER",
      ...
    },
    attestation: "<RESOLVER_SIGNATURE_OR_PROOF>"
  }
)
```

Одоогийн CLI эдгээр таних заавруудад зориулсан төрөлжүүлсэн командуудыг ил гаргахгүй байна. SDK ашиглан дараалсан `InstructionBox` утгуудыг үүсгээд `ledger transaction stdin` дамжуулан илгээгээрэй:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Эдгээр хамгаалалтын хашлагыг шинэ ажилтны үйлчилгээний үед баримтал.

- нэвтрэх дансны нэрийн оронд хэрэглэгддэг нь зөвхөн хүн уншиж болох хаягууд юм
- тэжээсэн утасны болон имэйлийн утгууд нэршил, мета өгөгдөл, бүртгэл, эсвэл гүйлгээний өгөгдөлд огт гардаггүй
- тэнхимд хувийн танигч утгуудыг шаардахнаас өмнө тэнхмийн өмнө `uaid` байна
- протоколын үр дүнгийн бүртгэлүүд `policy_id`, `opaque_id`, `uaid`, `account_id`-тэй холбох, мөн хугацаа дуусах
- шийдвэрлэх түлхүүрүүд болон нууц програмын криптографийн амлалтын утгуудыг удирдлага хянадаг

## 5. Node дээр ивээн тэтгэх боломжийг идэвхжүүлнэ үү {#_5-enable-sponsorship-on-the-node}

Төлбөрийн ивээн тэтгэх нь нод/гаралтын бодлого юм. Үүнийг Nexus төлбөрийн тохиргоонд идэвхжүүлнэ үү:

```toml
[nexus.fees]
fee_asset_id = "xor#universal"
fee_sink_account_id = "<FEE_SINK_ACCOUNT_I105_OR_ALIAS>"
base_fee = "0"
per_byte_fee = "0"
per_instruction_fee = "0.001"
per_gas_unit_fee = "0.00005"
sponsorship_enabled = true
sponsor_max_fee = "0"
```

`fee_asset_id` нь сүлжээний шимтгэлийн хөрөнгө юм. SORA Nexus-ын хувьд энэ нь XOR юм. Идэвхтэй XOR овог нэр эсвэл таны сүлжээний дамжуулсан нэг протокол-стандарт XOR хөрөнгийн тодорхойлолтын ID-г ашиглаарай.

`sponsor_max_fee = "0"` нь гүйлгээ бүрт дэмжигчийн хязгаар байхгүй гэсэн утгатай. Үйлдвэрлэлд хэвийн хэмжээ болон таны dataspace гүйлгээг гүйцэтгэх зардлын профайлыг мэдсний дараа тэгээс ялгаатай хязгаарыг тогтооно уу.

Энэ тохиргоог дахин ачаалуулах эсвэл энгийн операторын процессоор дамжуулан хэрэгжүүлээрэй.

## 6. Спонсорыг бий болгож санхүүжүүлнэ үү {#_6-create-and-fund-the-sponsor}

Хэрэв шаардлагатай бол ивээн тэтгэгчийн түлхүүрийн хос үүсгээрэй:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

Нийтийн түлхүүрийг таны сүлжээний дансны форматаар хөрвүүлнэ үү:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Өөрийн хувийн бүртгэлийн урсгалаар ивээн тэтгэгчийн дансыг бүртгэнэ үү:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Тэтгэлэгийг санхүүжүүлэгчид сангаас, нэхэмжлэх дансаас, эсвэл өөр санхүүжүүлсэн дансаас XOR-ийг санхүүжүүл:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Taira дээр давтан туршихдаа [Taira-аас testnet XOR авах](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) хэсгийн faucet туслахыг `taira_faucet_claim.py` нэрээр хадгалж, treasury шилжүүлгийн оронд нийтийн faucet-аар sponsor-ыг санхүүжүүлнэ:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Спонсорын XOR үлдэгдлийг шалгана уу:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Хэрэглэгчид Спонсорт хандах эрх олгох {#_7-grant-a-user-access-to-the-sponsor}

Дэмжигч тус бүрт хэрэглэгч бүрт хураамжийг төлөх зөвшөөрөл олгох ёстой. Энэ зөвшөөрөл нь хэрэглэгчдийг дурын дэмжигчийн дансуудыг нэрлэхээс урьдчилан сэргийлдэг.

Үүнийг ивээн тэтгэгчийн дансаар эсвэл таны програм хангамжийн гүйцэтгэх орчны бодлогоор зөвшөөрөгдсөн ажиллаж буй дансаар ажиллуулна уу:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission grant --id "$USER"
```

Шинэ ажиллах үйлчилгээний бүртгэлд, үүнийг энгийн данс нээх алхам болгож, тэмдэглэ:

- хэрэглэгчийн акаунт
- спонсорын данс
-  өгөгдлийн орон зай эсвэл програм
- баталгаажуулах тасалбар эсвэл засаглалын шийдвэр

Хэрэглэгчийн олгосон эрхийг шалгах:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Нөхөж оруулсан ивээн тэтгэгчийн мета өгөгдлийг хавсаргах {#_8-attach-sponsor-metadata}

Дахин ашиглаж болох мета өгөгдлийн файлыг үүсгээрэй:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Энэ метадата бүхий ямар ч бичлэгийг илгээсэн нь ивээн тэтгэгчээс төлөгдөнө:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs хувьд гарын үсэгтэй гүйлгээнд ижил гүйлгээний мета мэдээллийн объектийг хавсаргана. Хэрэглэгч гүйлгээг өөрийн түлхүүрээр гарын үсэг зурах болно. Дэмжигч нь бүх хэрэглэгчийн гүйлгээнд гарын үсэг зурдаггүй бөгөөд өмнөх `CanUseFeeSponsor` олголт нь зөвшөөрөл болж өгдөг.

## Хээ 1: Хэрэглэгчид ямар ч төлбөр төлдөггүй {#pattern-1-users-pay-no-fees}

Програм эсвэл оператор бүх сүлжээний шимтгэлийг өөртөө авах үед үүнийг ашигла.

Хөгжүүлэгчийн шалгах жагсаалт:

1. Хэрэглэгчийн хэвийн гүйлгээний өгөгдлийг өөрчлөлгүй хадгалах.
2. `fee_sponsor`-тэй гүйлгээний метадатыг нэмнэ үү.
3. Хэрэглэгчийн хувиар гарын үсэг зурах.
4. Хувийн өгөгдлийн сангийн маршрутаар илгээх.

Хэрэглэгчийн дансанд XOR үлдэгдэл шаардлагагүй. Хөрөнгө оруулагч данс нь тохируулагдсан Nexus төлбөрийг нөхөхийн тулд хангалттай XOR байлгах ёстой.

## Хээ 2: Хэрэглэгчид Орон нутгийн Токенээр Төлдөг {#pattern-2-users-pay-a-local-token}

Хэрэглэгчид XOR-ийг барьж болохгүй үед үүнийг ашигла, гэхдээ өгөгдлийн талбай дотоод аппликейшн төлбөр, кредит зарцуулалт, эсвэл квотын токен хүсч байна.

Энэ загварт орон нутгийн токен нь хэрэглээний төлбөр юм. Энэ нь сүлжээний төлбөрийн хөрөнгө биш юм. Спонсор нь сүлжээний төлбөрийг XOR дээрээ төлөх хэвээр байна.

Жишээлбэл, хувийн өгөгдлийн зайд орон нутгийн токеныг ашигла:

```text
usage#billing.team
```

Хэрэглэгчдийг онбордингоор ороход, захиалгын хугацааг шинэчлэхэд, эсвэл квотыг хуваарилах үед `usage#billing.team` мөнгөөр хангана. Дараа нь хэрэглэгчийн гүйлгээг атомчлалтай болгоно:

1. хэрэглэгчээс ивээн тэтгэгч рүү орон нутгийн токенуудыг шилжүүлэх
2. асуусан аппликейшний үйлдлийг гүйцэтгэх
3. `fee_sponsor` метадатыг орлуулаарай, ингэснээр тэтгээгч XOR -ийг төлнө

Хамгийн бага CLI утааны тест нь зөвхөн XOR-аас ивээн тэтгэсэн локал токен шилжүүлэг болно:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Жинхэнэ апп-д зориулж, локал токений төлбөрийг тусдаа хамгийн сайн хүчин чармайлтын гүйлгээгээр илгээх хэрэггүй. Төлбөр болон бизнесийн зааврыг агуулсан нэг гарын үсэгтэй гүйлгээг үүсгэх эсвэл бизнесийн үйлдлийг хэрэгжүүлэхээс өмнө локал токенийг цуглуулдаг гэрээний орох цэгийг ил гаргах хэрэгтэй.

Өөрийн апп эсвэл гэрээнд хөрвүүлэлтийн бодлогыг хадгална уу:

- ямар үйлдэл хэдэн орон нутгийн токен нэгж зарцуулдаг вэ
- орон нутгийн токений урсгал хэрхэн ивээн тэтгэгч XOR нэмж төлөхөд холбогддог талаар зураглал
- хэрэглэгчийн үлдэгдэл хэт бага байвал юу болох вэ
- хэрэв ивээн тэтгэгч XOR-ийн үлдэгдэл хэт бага бол юу болох вэ

::: warning

Орон нутгийн токены төлбөрийн загварт `gas_asset_id`-ыг битгий ашиглаарай, хэрэв та спонсорыг тухайн гүйлгээний гүйцэтгэлийн өртгийн хөрөнгөөр давхар төлөгдөхийг хүсэхгүй бол. Одоогийн програм хангамжийн гүйцэтгэлд орчин, `fee_sponsor` мөн тохируулагдсан хоолой-газрын активийн зээлийн төлбөрийг ивээн тэтгэгчлэгчээр төлүүлдэг. Орон нутгийн токены хэрэглэгчийн төлбөрийн хувьд, токеныг дамжуулалт эсвэл гэрээний дүрмийн дагуу ил тод цуглуулна уу.

:::

## Дебаг Нь Амжилтгүй Санхүүжүүлсэн Гүйлгээ {#debug-failed-sponsored-transactions}

Ерөнхий татгалзах шалтгаанууд ихэвчлэн нэг алга болсон тохиргооны алхмыг заадаг:

|Алдааны текст|Шалгах зүйл|
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` нь одоо ч зангилаан дээр `false` байна. |
| `fee sponsor is not authorized` |Хэрэглэгчдэд энэ ивээн тэтгэгчийн хувьд `CanUseFeeSponsor` байхгүй байна.|
| `fee asset ... is missing` |Спонсор тохируулах XOR төлбөрийн хөрөнгийг эзэмшдэггүй.|
| `fee balance ... is insufficient` |Нөхөрлөгчийн XOR үлдэгдлийг нөхөж өгнө үү.|
| `fee exceeds sponsor_max_fee` |Гүйлгээний хэмжээ/хийн төлбөрийг нэмэгдүүлэх `sponsor_max_fee` эсвэл бууруулах.|
| `invalid nexus fee asset id` |`nexus.fees.fee_asset_id` эсвэл XOR хөрөнгийн богино нэрийг засах.|

Хоёр дахь хэв маягийг оношлохдоо хоёр үлдэгдлийг хоёуланг нь шалгана:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"

iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

## Спонсорыг ажиллуулна {#operate-the-sponsor}

Спонсорыг сангийн данс гэж үз.

- тестнет, стейжинг ба мейннетийн тусгай ивээн тэтгэгчийн түлхүүрүүдийг тусад нь хадгалаарай
- спонсор XOR-ийн үлдэгдэл элсэлтийн доод хэмжээнд хүрэхээс өмнө анхааруулга өгөх
- замын хөдөлгөөнийг тодорхойлсны дараа тунгалаг тэг биш `sponsor_max_fee` дээд хязгаарыг тогтооно
- таны програм эсвэл гарцаар бичлэг хийх хурдыг хязгаарлах
- хэрэглэгчид датаны орон зайг орхисон үед `CanUseFeeSponsor`-ийг цуцлах
- хангаж авах хэрэглэгчийн гүйлгээний криптографийн хэшүүд, орон нутгийн токен төлбөрүүд, болон ивээн тэтгэгч XOR дебитүүд

Хэрэглэгчийн ивээн тэтгэх эрхийг цуцлах:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission revoke --id "$USER"
```

## Холбогдсон хуудаснууд {#related-pages}

- [SORA Nexus өгөгдлийн сангуудтай холбогдох](/mn/get-started/sora-nexus-dataspaces.md)
- [Iroha 3 -г CLI ашиглан ажиллуулна](/mn/get-started/operate-iroha-via-cli.md)
- [Хөрөнгө](/mn/blockchain/assets.md)
- [Зөвшөөрөл](/mn/blockchain/permissions.md)
- [Өөрт нь зөвшөөрөл өгөх тэмдэг](/mn/reference/permissions.md)
