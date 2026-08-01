---
translation_locale: mn
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Хувийн өгөгдлийн орон зайны төлбөр {#sponsor-fees-for-a-private-dataspace}

Үнийн төлбөрийн дэмжлэг нь хэрэглэгчдэд XOR хадгалахгүйгээр хувийн мэдээллийн орон зай дахь гүйлгээг өргөн мэдүүлэх боломжийг олгодог. Хэрэглэгч аливаа гүйлгээнд гарын үсэг зурдаг. Транзакцын метадэт өгөгдөл нь ивээн тэтгэгчдийн дансанд төвлөрч, гүйлтийн хугацаа нь ивэн тэтгэгчийн XOR үлдэгдлийг сүлжээний төлбөрийг төлөхөд зарах болно.

Интеграц нь гурван хөдөлгөөнт хэсгээс бүрдэнэ:

1. цэг нь төлбөрийн тэтгэврийг зөвшөөрдөг
2. Тус санхүүжүүлэгч бүртгэлтэй, XOR
3. Хэрэглэгчийн хувьд `CanUseFeeSponsor` нь тус төлөөлөгчтэй

Үүний дараа, дэмжлэг үзүүлсэн хэрэглэгчдийн аливаа гүйлгээ зөвхөн энэ метабараа шаарддаг:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Энэ хуудас нь хоёр нийтлэг загварыг харуулж байна:

- Нээлттэй хэрэглэгчид XOR төлдөг бөгөөд хэрэглэгчид юу ч төлөхгүй байна.
- Орон нутгийн токейн төлбөр: хэрэглэгчийн төлбөр нь XOR ээр дамжуулагчдаа апп-токейн төлбөрийн төлбөр бөгөөд дамжуулагч нь сүлжээний төлбөрийг төлдөг.

Taira эсвэл хувийн туршилтын сүлжээг эхлээд ашигла. Шинэ хувийн өгөгдлийн талбай нь оператор болон удирдлагын өөрчлөлт; энэ нь үйлчлүүлэгчдийн конфигурацын дагуу үүсдэггүй юм.

## Жишээлбэл үнэт зүйлс {#example-values}

Дараах команд нь дараах байр эзэмшигчүүдийг ашигладаг:

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

Танай нэвтрүүлэгт ижил дансны үйл ажиллагаа явуулж буй дансны нууц нэрүүд байхгүй бол I105 санхүүгийн IDs дансыг ашиглаарай.

## 1. Мэдээллийн орон зай бэлтгэнэ {#_1-prepare-the-dataspace}

[-д тодорхойлсон хувийн өгөгдлийн орон тооны каталог, чиглэлийн ажлыг эхлүүлнэ. SORA Nexus өгөгдлийг холбоно](/mn/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). Операторын өмнө байрлах хэсэг нь иймэрхүү харагдаж байна:

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

Хэрэглэгчийн гүйлгээ рүү шилжүүлэхийн өмнө:

- `/status` дугаарт хувийн замыг илрүүлнэ.
- Хэрэглэгчийн данс танай хувийн борлуулалтын урсгалаар хүлээн авна
- төлөөлөгч бүртгэлтэй
- XOR төлбөрийн актив болон төлбөрийн хяналтын сан нь сүлжээнд хүчинтэй байна

## 2. Мэдээллийн орон зай дахь хөрөнгийг бүртгүүлэх {#_2-register-assets-in-the-dataspace}

Хэрэглэгчид хувийн өгөгдлийн талбайд хадгалах хөрөнгийн тодорхойлолтыг та програм хангамжийн логик руу шилжүүлэхээс өмнө бүртгүүлнэ. Орон нутгийн тэмдэгтийн төлбөрийн загварын хувьд сургалтын хэрэглээ `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Хамгийн түрүүнд хөрөнгийн нэрний орон зайг эзэмшдэг домен, SNS лизинг байгуулж, санхүүгийн `team` мэдээллийн оргил ID, хуулиар батлагдсан эзэмшигч, лизингийн хугацаа, өнөөгийн саналыг хамгаалахын зэрэглэлтэй `$BILLING_DOMAIN`-ийн нууцгүй `AliasSetupPlanRequestV1` зориулалтыг бий болгох:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Дараа нь хөрөнгийн тодорхойлолтыг бүртгүүлнэ. `--id` нь сүлжээний түвшний хөрөнгийн тодорхойлолт ID юм. Хөгжүүлэгчид болон эцсийн хэрэглэгчид мэдээллийн орчны код дээр ашиглах ёстой:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

Тэмцээний үеэр орон нутгийн токенг хэрэглэгчдэд шилжүүлэх:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Хэрэглэгчийн тэнцвэрт байдлыг шалгах:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Мэдээллийн орон зай дахь хэрэгслийн хөрөнгийн хувьд ижил загварыг ашиглах. Токент нэг хөрөнгийн тодорхойлолт бүртгүүлж, тус бүрдээ мэдээллийн орон нутгийн нууц нэрийг өгөх бөгөөд SDK кодын оронд хатуу кодтой каноникийн хөрөнгөний тодорхойлолт IDs-ийг дурдсан байна.

## 3. Хэрэглэгчийн нууц нэрийг бүртгүүлнэ. {#_3-register-user-aliases}

Санхүүжилт нь одоо ч мөн адил байдаг I105 бүртгэл IDs. Хэрэглэгчдэд зориулсан нэрүүд нь дансны нууц нэр бөгөөд нууц нэрүүд нь тийм эмзэггүй ханш байх ёстой `alice@team` эсвэл `alice@members.team`. Утасны нөмөр, цахим хаягийг нууц нэрээр бүү ашигла. Эдгээр нь дараагийн хэсэгт хувийн тодруулгын урсгалд оршино.

Алиас-ын тохируулалт нь доменийн тохируулалтай ижил зарлигийн төлөвлөгөөг ашигладаг. SDK эсвэл тавигдах үйлчилгээг нууцгүй `AliasSetupPlanRequestV1` тухайн бүртгэлд оролцох зорилго `$USER`, үндсэн үүргийг сонгож, санхүүгийн өгөгдлийн орон зайг шилжүүлнэ ID, Дараа нь нэг атомын гүйлгээ хийхээр төлөвлөж, хэрэглэж болно:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Хэрэв хэрэглэгчид XOR төлөхгүй бол зохион байгуулалтыг бүтээж, өргөн мэдүүлэхийн тулд зөвшөөрөгдсөн тэтгэврийн үйлчилгээг ашиглаарай гүйлгээ. Гаалийн худалдан авалт болон үүрэг гүйцэтгэх аливаа хуулийг тусгаар тогтносон өргөдөлний гүйлгээгээр хуваалцахгүй байх.

Үндсэн хуулийн заалтыг байлгасны дараа CLI дээр шалгаарай:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Шинэ дансыг бий болгохын тулд бүтээн байгуулалтын үйлчилгээг `NewAccount` Тэмцэгтэй `uaid` болон шаардлагатай бол анхны `label`. Энгийн `ledger account register --id` Захиргааны захирамж нь зөвхөн санхүүгийн мэдээллийг бүртгэдэг. ID.

## 4. FHE-ийн нэрийн өмнөөс Телефон, Эмэйл бичнэ. {#_4-register-phone-and-email-privately-with-fhe}

Утасны дугаар, цахим хаяг нь олон нийтийн нууц нэр биш хувийн тодруулгын мэдүүлэг гэж ашигла. FHE -ийн дэмжлэгтэй урсгал бодитой тодорхойлогчдыг дансны нууц нэр, гүйлгээний метадэтгэл болон дэлхийн байдлаас зайлуулах:

1. оператор [RAM-LFE/FHE хөтөлбөрийн бодлого](/mn/blockchain/ram-lfe.md) нь утсаар болон цахимаар бүртгүүлнэ.
2. Үйл ажиллагаа эрхлэгч `phone#team` болон `email#team` зэрэг идэвхтэй тодруулгын бодлогыг бүртгэж байна.
3. хөрөнгийн мөнгөний цахилгаан болон утсыг орон нутгаар хэвийн болгодог.
4. халамж нь шифрлэгдсэн үнэлгээг шийдэгчд хүргүүлнэ
5. шийдэл нь `IdentifierResolutionReceipt`
6. Хэрэглэгчийн хүлээн зөвшөөрөлтэй хамт `ClaimIdentifier` хүргүүлнэ
7. зах зээл нь ил тод тодорхойлогч болон хүлээн зөвшөөрөгчийн хэшийг хадгалдаг, түүхий утгийн эсвэл цахим шуудангийн үнэ цэнийг биш

Үйлчлөгч талын бодлогын тохируулалт нь SDK эсвэл үйлчилгээний ажил юм. Арьсны тодорхойлогчийн төрөлд зориулан дараах зааваржуулалтын хосууд бий болгож, хүргүүлнэ:

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

Э-мэйл хийхэд дахин давтаарай:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Онбордын үеэр буцаан эсвэл хяналтын хэсэг нь орон нутгийн хувьд хэвийн байх ёстой:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

8. алхам дээр санхүүжүүлэгч метадэтгэлийн файлыг бий болгосны дараа тухайн метадэтгэлтэй хамт хэрэглэгчийн гарын үсэг зурсан шаардлагын заавар өгөх:

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

Одоогийн CLI нь эдгээр тодруулгын чиглэлд зориулсан түрүүлсэн командуудыг илрүүлэхгүй. SDK -ийн дагуу цувралчилсан `InstructionBox` хэмжээнүүдийг бий болгож, тэдгээрийг `ledger transaction stdin` -ээр дамжуулан хүргүүлнэ:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Энэ хяналтын заалтыг борлуулалтын үйлчилгээний газарт хадгалах:

- Эдгээрийн нууц нэр нь зөвхөн хүн уншдаг гараа
- нөөц телефоны болон элс суудлын үнэ цэнэ нь аливаа нууц нэр, метадэтгэлэг, тэмдэглэл, гүйлгээний хэрэглээний ачаалалд хэзээ ч гарч ирэхгүй
- Сангийн `uaid` нь хувийн тодруулгыг шаардсан өмнө байдаг.
- түлхүүжилт нь `policy_id`, `opaque_id`, `uaid`, `account_id` болон хугацаа дуусах
- шийдвэрлэх түлхүүр болон нууцлагдсан хөтөлбөрийн үүрэг гүйцэтгэгчдийг удирдлага нь хянах

## 5. Нод дээр спонсорлох боломжийг олгох {#_5-enable-sponsorship-on-the-node}

Төлбөрийн тэтгэмжлэл нь түймэр / гүйлгээний цагийн бодлого юм. Nexus төлбөрийн конфигурац дээр үүнийг ашиглах боломжтой:

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

`fee_asset_id` нь сүлжээний төлбөрийн актив юм. SORA Nexus -ийн хувьд энэ бол XOR. Таны сүлжээ илрүүлсэн идэвхтэй XOR буюу XOR хөрөнгийн тодорхойлолтыг ашиглаарай ID .

`sponsor_max_fee = "0"` нь тухайн гүйлгээний төлөө төлөөлөгчийн дээд хэмжээ байхгүй гэсэн үг. Үйлдвэрлэлийн хувьд өгөгдлийн орон тооны гүйлгэнийхээ хэвийн хэмжээ, газын хувилбарыг мэддэг бол нуруугүй дээд хэмжээг байгуулж үзээрэй.

Энэ конфигурацыг хэвийн операторын үйл явцад дахин эхлүүлж эсвэл өргөн барьж болно.

## 6. Тэтгэврийг бий болгох, санхүүжүүлэх {#_6-create-and-fund-the-sponsor}

Шаардлагатай бол спонсор цөмлөгийн хосууд бий болгох:

```bash
kagami keys --algorithm ed25519 --json
```

Олон нийтийн түлхэгийг сүлжээний бүртгэлийн хэлбэрт шилжүүлнэ:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Тэтгэврийн төлбөрийг хувийн борлуулалтын урсгалаар бүртгүүлнэ:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Төлөөлөгчд XOR ашиглан санхүүжилт олгох, хариуцлагын данс эсвэл бусад санхүүжүүлсэн данс:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Үүнд Taira эмчилгээнд, цахилгаан хэрэглэгчээс ангижрах [Тестнет аваарай XOR цаашид Taira](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) тухайн `taira_faucet_claim.py`, дараа нь тэтгэгчд санхүүжилтийн шилжүүлэн суулгахын оронд олон нийтийн гарын үсэгээр санхүүжүүлэх:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Төлөөлөгчийн XOR үлдэгдлийг шалгаарай:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Хэрэглэгчийн төлөөлөгчтэй харилцах боломжийг олгох {#_7-grant-a-user-access-to-the-sponsor}

Спонсор нь тухайн хэрэглэгчийн төлөө төлбөр тооцох зөвшөөрлийг олгох ёстой. Тус санхүүжилт нь хэрэглэгчид ямар ч сайн дурын төлөөлөгчдийн дансыг нэрлэхээс сэргийлдэг.

Энэ нь төлөөлөгч дансны хувьд, эсвэл гүйлгээний цагийн бодлогын дагуу зөвшөөрөлтэй үйл ажиллагааны дансаар ашиглах болно:

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

Онбордын үйлчилгээний хувьд энэ нь бүртгэлийн хангамжийн хэвийн алхам болж, бүртгэнэ:

- хэрэглэгчийн данс
- ивээн тэтгэврийн сан
- өгөгдлийн орон зай эсвэл хэрэглээ
- зөвшөөрөл олгох билет эсвэл удирдлагын шийдвэр

Хэрэглэгчийн тэтгэлгийг шалгахын тулд:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Тэтгэврийн төлөөлөгчдийн метабараа холбоно {#_8-attach-sponsor-metadata}

Дахин ашиглах метабарааны файл бий болгох:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Энэхүү метадэтгэлийг хүргэж ирүүлсэн бүх бичиг баримтууд нь ивээн тэтгэгчээс төлдөг:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs-ийн хувьд гарын үсэг зурсан гүйлгээний метадэтгэрийн ижил объектыг нэгтгэнэ. Хэрэглэгч хэрэглэгчийн түлхүүрээр гүйлгээнийг гарын үсгийн. Спонсор нь хэрэглэгчийн аливаа гүйлгээрийг гарын үгээр гарын ү үсэг зурахгүй, учир нь өмнөх `CanUseFeeSponsor` олголт нь зөвшөөрөл юм.

## 1 дүгээр загвар: Хэрэглэгчид төлбөргүй төлдөг {#pattern-1-users-pay-no-fees}

Хэрэглээний хэрэглэгчид эсвэл оператор нь бүх сүлжээний төлбөрийг хүлээн авахдаа үүнийг ашигла.

Хөгжлийн хяналтын жагсаалт:

1. Хэрэглэгчийн хэвийн гүйлгээний ачаалал өөрчлөгдөхгүй байх.
2. Хөдөлмөрийн метабараа `fee_sponsor` гэж нэмнэ.
3. Хэрэглэгчийн нэрээр гарын үсэг зур.
4. Хувийн өгөгдлийн орон зайд дамжуулан хүргүүлнэ.

Хэрэглэгчийн дансанд XOR үлдэгдэл шаардлагагүй. Төлөөлөгч данс нь конфигурируулсан Nexus төлбөрийг хангахын тулд хангалттай XOR хадгалах ёстой.

## 2 дугаар загвар: Хэрэглэгчид орон нутгийн токен төлдөг {#pattern-2-users-pay-a-local-token}

Хэрэглэгчид XOR хадгалахгүй бол үүнийг ашигла, гэхдээ өгөгдлийн орон зай нь дотоод хэрэгслийн төлбөр, зээлийн зардал эсвэл квотын токен шаарддаг байна.

Энэхүү загварын дагуу орон нутгийн токен нь өргөдөлний төлбөр юм. Энэ нь сүлжээний төлбөрийн актив биш юм. Спонсор нь XOR хэмжээнд сүлжээны төлбөрийг төлдөг байна.

Жишээ нь, хувийн өгөгдлийн талбайд орон нутгийн токен ашиглах:

```text
usage#billing.team
```

`usage#billing.team` -ийн санхүүжилтийн хэрэглэгчид хөлөг онбордын үеэр, төлбөрийн шинэчлэл эсвэл квотын хуваарилалтаар. Дараа нь хэрэглэгчийн гүйлгээг атомын болгоно:

1. орон нутгийн токенүүдийг хэрэглэгчийн төлөөлөгчэд шилжүүлнэ
2. хүсэлт гаргасан апп үйлдлийг гүйцэтгэх
3. `fee_sponsor` метрийн өгөгдлийг багтааж, дэмжлэг үзэгч XOR төлөх болно

Хамгийн бага CLI дулааны шинжилгээ нь зөвхөн XOR-ийн дэмжлэгтэйгээр орон нутгийн токен дамжуулалт:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Үнэн хэрэгслийн хувьд орон нутгийн токен төлбөрийг бие даасан хамгийн сайн хүчин чармайлттай гүйлгээ болгон ирүүлэхгүй. Хөдөлмөрийн заавар болон төлбөр хоёулаа агуулсан нэг гарын үсэг зурсан гүйлгээг бүтээн байгуулаарай, эсвэл бизнес үйлдлийг хэрэгжүүлэхээс өмнө орон нутгийн тэмдэгтийг цуглуулдаг гэрээний орох цэгчийг илрүүлээрэй.

Хувьцааны бодлогыг аппликейшн эсвэл гэрээгээр хадгал:

- ямар үйл ажиллагаа нь хэдэн орон нутгийн токен нэгж зарцуулдаг вэ
- XOR нэмэлт үр дүнг санхүүжүүлэх орон нутгийн токен урсгал газрын зураг
- хэрэглэгчийн тэнцвэр хэт бага бол яах вэ?
- XOR тэтгэгчдийн тэнцвэр хэт бага бол яах вэ

::: warning

Хэрэглэхгүй `gas_asset_id` "Орон нутгийн токоны төлбөрийн" загварын хувьд, та энэ газын активт мөн төлбөр авахыг хүсэхгүй бол. `fee_sponsor` төмөр замын газ-ашигт малтмалын хөрөнгийн хадгаламжийн төлөгчээр нь тусгай зөвшөөрөлтэй. Орон нутгийн токен хэрэглэгчийн төлбөрийн хувьд тухайн токенд шилжүүлэн суулгах эсвэл гэрээний дүрмийн дагуу тодорхой хэмжээгээр цуглуулна.

:::

## Гавьяат төлбөргүй гүйлгээний хэсгээс сэргийлэх {#debug-failed-sponsored-transactions}

Ихэнх татгалзсан шалтгаанууд нь ихэнхдээ нэг засварын алхам дутагдаад байгааг харуулж байна:

|Халуун текст |Ямар зүйлийг шалгах вэ?|
| --- | --- |
|`fee sponsorship is disabled` |`nexus.fees.sponsorship_enabled` нь одоо ч `false` цэг дээр байна. |
|`fee sponsor is not authorized` |Хэрэглэгчийн хувьд `CanUseFeeSponsor` гэж байхгүй. |
|`fee asset ... is missing` |Төлөөлөгч нь XOR төлбөрийн хөрөнгийг хадгалахгүй. |
|`fee balance ... is insufficient` | Тэтгэврийн төлөөлөгчдийн XOR тэнцвэртэй. |
|`fee exceeds sponsor_max_fee` |`sponsor_max_fee` нэмэгдүүлнэ, эсвэл гүйлгээний хэмжээ / газг бууруулна. |
|`invalid nexus fee asset id` |`nexus.fees.fee_asset_id` эсвэл XOR хөрөнгийн нууц нэр. |

2-р загварыг засварлахдаа хоёр тэнцвэрт байдлыг шалгаарай:

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

## Санхүүжүүлэгчийн үйл ажиллагааг {#operate-the-sponsor}

Тэтгэврийг санхүүгийн бүртгэлтэй харьцуулах:

- туршилтын сүлжээн, үе шат болон гол сүлжээнд тусгай төлөөлөгчийн цөмөө хадгалах.
- XOR тэтгэврийн үлдэгдэл нь хүлээн авах түвшинд хүрэхээс өмнө сэрэмжлүүлэг
- Замын хөдөлгөөнийг тодорхойлсны дараа `sponsor_max_fee` хязгаарлалтыг тогтоох
- төлбөрийн хязгаарт хамгаалсан бичиг баримтууд таны өргөдөлд эсвэл гаригт
- `CanUseFeeSponsor` нь хэрэглэгчид өгөгдлийн орон зайг орхихдоо цуцлах.
- Хэрэглэгчийн транзакцын хэшүүд, орон нутгийн токенээр төлбөр тооцоо, XOR тэтгэврийн төлбөрийг тохируулна.

Хэрэглэгчийн тэтгэмжлэл цуцлах:

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

## Үүнтэй холбоотой хуудсууд {#related-pages}

- [SORA Nexus Мэдээллийн газарт](/mn/get-started/sora-nexus-dataspaces.md) холбогдсон байна
- [Iroha 3 замаар үйл ажиллагаа явуулж байна CLI](/mn/get-started/operate-iroha-via-cli.md)
- [Байгууллага](/mn/blockchain/assets.md)
- [Тусгай зөвшөөрөл](/mn/blockchain/permissions.md)
- [Тусгай зөвшөөрлийн токенүүд](/mn/reference/permissions.md)
