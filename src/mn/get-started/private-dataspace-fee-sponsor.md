---
translation_locale: mn
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Хувийн өгөгдлийн орчны төлбөр {#sponsor-fees-for-a-private-dataspace}

Үнийн төлбөрийн дэмжлэг нь хэрэглэгчдэд хувийн өгөгдлийн орон зайн гүйлгээг
аж ахуйн нэгж XOR. Хэрэглэгчид аливаа гүйлгээг гарын үсэг зурж байна.
төлөөлөгчийн бүртгэлд оноо, гүйлгээний хугацаа нь төлөөлөгч XOR тэнцвэр
Сүлжээний төлбөрийн төлөө.

Интеграц нь гурван хөдөлгөөнт хэсгээс бүрдэнэ:

1. цэг нь төлбөрийн тэтгэврийг зөвшөөрдөг
2. тэтгэврийн төлбөрийг хадгалах XOR
3. хэрэглэгчийн хувьд `CanUseFeeSponsor` тухайн спонсорын хувьд

Үүний дараа, төлөөлөгч хэрэглэгчийн аливаа гүйлгээ зөвхөн энэ метабараа шаарддаг:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Энэ хуудас нь хоёр нийтлэг загварыг харуулж байна:

- **Ашигт хэрэглэгч бичдэг**: ивээн тэтгэгч төлдөг XOR Хэрэглэгч юу ч төлөхгүй.
- **Орон нутгийн токоны төлбөр**: хэрэглэгчид тэтгэврийн төлбөрийг програм хангамжийн токенээр олгодог бөгөөд
  спонсор нь сүлжээг XOR.

Хэрэглээ Taira Шинэ хувийн мэдээллийн орон зай нь
оператор болон удирдлагын өөрчлөлт; энэ нь үйлчлүүлэгчдийн конфигурацыгаар үүсдэггүй.

## Жишээлбэл үнэ цэнэ {#example-values}

Дараах команд нь дараах байр сууриа эзэмшигчүүдийг ашигладаг:

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

Canonical ашиглах I105 бүртгэл IDs Хэрэв та ажиллагаанд идэвхтэй бүртгэл байхгүй бол
ижил тооцоод зориулсан нууц нэр.

## 1. Мэдээллийн орон зай бэлтгэнэ {#_1-prepare-the-dataspace}

Үүнд тодорхойлсон хувийн мэдээллийн орон тооны каталог, чиглэлийн ажил
[Сэргэлт SORA Nexus Мэдээллийн газар](/mn/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace).
Үйлчлөгч рүү чиглэсэн хэсэг иймэрхүү харагдаж байна:

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

Хэрэглэгчийн гүйлгээ рүү шилжүүлэхээс өмнө:

- хувийн замыг түймэрт харагдана `/status` хариу
- Хэрэглэгчийн данс танай хувийн борлуулалтын урсгалаар хүлээн авна
- төлөөлөгчийн данс бий
- УИХ-ын гишүүн XOR төлбөрийн актив, төлбөрийн хяналтын сан нь сүлжээнд хүчинтэй байна

## 2. Мэдээллийн орон зай дахь хөрөнгийг бүртгүүлэх {#_2-register-assets-in-the-dataspace}

Хэрэглэгчид хувийн хэвшлийн дотор хадгалах хөрөнгийн тодорхойлолтыг бүртгүүлэх
Хэрэглэлийн логик руу дамжуулахаас өмнө
сургалтын хэрэглээ `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Эхлээд доменийг байлгаж, SNS хөрөнгийн нэр дэвшилтэрийн орон зай эзэмшдэг орлонгоц.
нууцгүй `AliasSetupPlanRequestV1` зориулалт `$BILLING_DOMAIN`, тэр дундаа
санхүүгийн `team` өгөгдлийн орон зай ID, хуулийн дагуу эзэмшдэг, гэрээний хугацаа, одоогийн санал
хамгаалагч:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Дараа нь хөрөнгийн тодорхойлолтыг бүртгэнэ. `--id` нь сүлжээний түвшин
хөрөнгийн тодорхойлолт ID. Хөгжүүлэгчид болон эцсийн хэрэглэгчид
Мэдээллийн орон тооны код:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

Тэмцээний үеэр орон нутгийн токенг хэрэглэгчдэд дамжуулах:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Хэрэглэгчийн тэнцвэрийг шалга:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Мэдээллийн орон зай дахь хэрэгслийн хөрөнгөд ижил загварыг ашиглах.
Токен бүрт хөрөнгийн тодорхойлолт, тус бүрдээ мэдээллийн орон зайг нэрлэж,
Нүүр хуудас SDK Хөрөг кодтой бус санхүүгийн хөрөнгийн тодорхойлолт IDs.

## 3. Хэрэглэгчийн нууц нэрийг бүртгүүлэх {#_3-register-user-aliases}

Хэлэлцүүлэг нь ч мөн адил I105 бүртгэл IDs. Хэрэглэгчийн нэр нь данс
нэр томъёо, нэр томьёо нь тийм ч эмзэг биш гараа байх ёстой: `alice@team` эсвэл
`alice@members.team`. Телефон нөмөр, цахим хаягийг нууц нэрээр бүү ашигла.
Эдгээр нь дараагийн хэсэгт хувийн идентификатор урсгалд ордог.

Алиас-ын тохируулалт нь доменийн тохируулгатай ижил зарлигийн төлөвлөгөөг ашигладаг. SDK эсвэл
тагнуулын үйлчилгээ нууцгүй `AliasSetupPlanRequestV1` ямар зорилготой
Санхүүжилтийн бүртгэлийн зорилт `$USER`, үндсэн үүргийг сонгож, санхүүгийн
өгөгдлийн орон зай ID, Энэ нь одоогийн лизингийн үнийн саналыг хадгалах.
нэг атомын гүйлгээ:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Хэрэглэгчийн төлбөргүй бол XOR, зөвшөөрөлтэй төлөөлөгчийн мэдлэгтэй борлуулалтыг ашиглах
Барилгын бүтээн байгуулалтын үйл ажиллагааг зохион байгуулж, хүргэх үйлчилгээ.
Хувьцаа авах болон бие даасан хэрэглээний бүтээн байгуулалтад холбогддог нэр томъёо.

Үндсэн хуулийн заалтыг байлгасны дараа CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Шинэ дансыг бий болгохын тулд
`NewAccount` Тэмцэгтэй `uaid` шаардлагатай бол эхлүүлэх `label`. Хөдөлмөрийн
энгийн `ledger account register --id` Захиргааны захирамж нь зөвхөн дүрмийн
бүртгэл ID.

## 4. Телефон, элс суудлыг нууцлан бүртгүүлэх FHE {#_4-register-phone-and-email-privately-with-fhe}

Олон нийтийн нөөцийг бус, хувийн тодруулгын мэдүүлэг болгон утгийн дугаар болон цахим хаяг ашиглах
Хэдэн нэртэй. FHE-дэтгэмжлэгдсэн урсгал бодитой тодорхойлогчдыг дансны нууц нэрнээс зайлшгүй хамгаалах,
гүйлгээний метадэтгэл, дэлхийн байдал:

1. үйл ажиллагаа явуулдаг ажилтан
   [RAM-LFE/FHE хөтөлбөрийн бодлого](/mn/blockchain/ram-lfe.md) утасны болон цахим шуудан
2. Үйл ажиллагаа эрхлэгч идэвхтэй тодруулгын бодлогыг бүртгүүлнэ: `phone#team` болон
   `email#team`
3. хөрөнгийн мөнгөний цахилгаан болон утсыг орон нутгаар хэвийн болгодог
4. хөрөнгийн сан шифрлэгдсэн үнэлгээг шийдвэрлэгчд хүргүүлнэ
5. шийдэл нь `IdentifierResolutionReceipt`
6. хэрэглэгчид ирүүлнэ `ClaimIdentifier` хүлээн авах
7. зах зээл нь үл ил тод тодорхойлогч, хүлээн авахын хэш хадгаламжтай бөгөөд түүхий эдийн гар утас биш
   цахим захиалгын үнэ цэнэ

Үйл ажиллагаа эрхлэгчдийн бодлогын тогтолцоо SDK эсвэл үйлчилгээний ажил.
тус бүрийн тодруулгын төрөлд зориулсан эдгээр заалын хосууд:

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

Э-мэйл дээр үүнийг дахин давтаарай:

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

8 алхам дээр санхүүжүүлэгч метадэтгэлийн файл бий болсноос хойш хэрэглэгчийн гарын үсэг зурсан
тухайн метадэтгэлийг ашиглан шаардлагын заавар:

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

Одоогийн CLI эдгээр дүрэмд зориулсан команд бичдэггүй
Урьдчилсан заавар `InstructionBox` Хөдөлмөрийн SDK болон
тэдгээрийг дамжуулан `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Энэ хамгаалалтын заалтыг борлуулалтын үйлчилгээний газарт хадгалах:

- Эдгээрийн нууц нэр нь зөвхөн хүн уншдаг гарцыг
- нөөц телефоны болон элс суудлын үнэ цэнэ хэзээ ч нууцал, метадэтгэл, тэмдэглэлүүд, эсвэл
  бүтээн байгуулалтын ашигтай ачаалал
- данс нь `uaid` хувийн тодорхойлогчдыг шаардсан өмнө
- түлхүүгийн байлдаан `policy_id`, `opaque_id`, `uaid`, `account_id`, болон хугацаа дуусах
- шийдвэрлэх түлхүүр болон нууцлан хөтөлбөрийн үүрэг гүйцэтгэгчдийг удирдлага нь хянах

## 5. Тэмцэд төлөөлөгчийн үйл ажиллагааг хангах {#_5-enable-sponsorship-on-the-node}

Тэмцээний тэтгэлэг нь түймэр / гүйлгээний цагийн бодлого юм. Nexus төлбөрийн тохируулалт:

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

`fee_asset_id` - зах зээлийн төлбөрийн хөрөнгө. SORA Nexus Энэ бол XOR. Хөдөлмөрийн
идэвхтэй XOR нэрэмжит ёс сурталчилгаа XOR хөрөнгийн тодорхойлолт ID Таны сүлжээгээр илрүүлсэн.

`sponsor_max_fee = "0"` гүйлгээний нэг заалтын төлөөлөгчийн дээд хэмжээ байхгүй гэсэн үг.
үйлдвэрлэлийн хэмжээ, газын хувилбарыг мэдэхэд 0-ийн түвшинд хүрэхгүй
Таны мэдээллийн орчны гүйлгээний.

Энэ конфигурацийг хэвийн операторуудын үйл явцын дагуу дахин эхлүүлж, ашиглаж болно.

## 6. Тэтгэврийг бий болгож, санхүүжүүлнэ {#_6-create-and-fund-the-sponsor}

Хэрэгтэйгээр спонсор цөмний хосууд бий болгох:

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

Төлөөлөгчэд XOR Санхүүжилт, нөөц тооцоо эсвэл бусад санхүүжүүлсэн
бүртгэл:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Үүнд Taira Урьдчилгааны ажилтан
[Тестнэт аваарай XOR цаашид Taira](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
Үүнд `taira_faucet_claim.py`, дараа нь ивээн тэтгэгчд олон нийтийн галт тэрэгээр санхүүжүүлнэ
Сангийн шилжүүлэн суулгахаас өөр:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Зохиолчийн газрыг шалгаарай XOR тэнцвэр:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Хэрэглэгчийн төлөөлөгчтэй харилцах боломжийг олгох {#_7-grant-a-user-access-to-the-sponsor}

Тус тэтгэгч нь тухайн хэрэглэгчийн төлбөрийг татан авах зөвшөөрөл олгох ёстой.
Хэрэглэгчийн нэр дэвшилтэт төлөөлөгчдийн дансыг тодруулдаггүй.

Энэ нь төлөөлөгчийн дансанд эсвэл таны зөвшөөрөлтэй үйл ажиллагааны дансанд
Хөдөлмөрийн цагийн бодлого:

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

Тэмцээний үйлчилгээний хувьд энэ нь бүртгэлийн хангамжийн хэвийн алхам бөгөөд тэмдэглэл:

- хэрэглэгчийн данс
- төлөөлөгчийн данс
- мэдээллийн орон тоо эсвэл хэрэглээ
- зөвшөөрлийн билет эсвэл удирдлагын шийдвэр

Хэрэглэгчийн тэтгэлгийг шалгах:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Тэтгэврийн төлөөлөгчийн метабараа холбох {#_8-attach-sponsor-metadata}

Дахин ашиглах метабарааны файлыг бий болгох:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Энэхүү метадэтгэлийг хүлээн авч өгүүлсэн бүх бичгийг төлөгчээс татдаг:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

Үүнд SDKs, гарын үсэг зурсан транзакцын метадэтгэлийг ижил төстэй
Хэрэглэгч хэрэглэгчийн түлхүүрээр гүйлгээний гарын үсэг зурдаг.
хэрэглэгчийн аливаа гүйлгээг гарын үсэг зурдаггүй `CanUseFeeSponsor`
Төлбөр олгох нь зөвшөөрөл юм.

## 1 дүгээр загвар: Хэрэглэгчид үнэ төлбөргүй {#pattern-1-users-pay-no-fees}

Хэрэглээний хэрэглэгчид эсвэл оператор нь бүх сүлжээний төлбөрөө хүлээн авахдаа үүнийг ашиглах.

Хөгжлийн хяналтын жагсаалт:

1. Хэрэглэгчийн хэвийн гүйлгээний ачаалал өөрчлөгдөхгүй байх.
2. Транзакцын метадъолдыг нэмнэ `fee_sponsor`.
3. Хэрэглэгчээр гарын үсэг зур.
4. Хувийн мэдээллийн орчны замаар хүргүүлнэ.

Хэрэглэгчийн данс XOR Санхүүжилт олгогчдын бүртгэл
хангалттай XOR тохируулсан Nexus Тэмцээ.

## 2-р загвар: Хэрэглэгчид орон нутгийн токен төлдөг {#pattern-2-users-pay-a-local-token}

Хэрэглэгчид тээвэрлэхгүй үед үүнийг ашигла XOR, Гэхдээ өгөгдлийн орон зай нь аливаа
Дотоод хэрэгслийн төлбөр, зээлийн зардал эсвэл квотын токен.

Энэ загварын хувьд орон нутгийн токен нь хэрэглэлийн төлбөр юм.
Сүлжээний төлбөрийн хөрөнгө. XOR.

Жишээлбэл, хувийн мэдээллийн орон зай дахь орон нутгийн токен ашиглах:

```text
usage#billing.team
```

Сангийн хэрэглэгчид `usage#billing.team` бортын үеэр, төлбөрийн шинэчлэл,
Дараа нь хэрэглэгчийн гүйлгээг атомтой болгоно:

1. орон нутгийн токенүүдийг хэрэглэгчээс спонсорт шилжүүлнэ
2. хүсэлт гаргасан апп үйлдлийг гүйцэтгэх
3. хамруулах `fee_sponsor` Metadata нь төлөгч төлөх XOR

Хамгийн бага CLI Төмөр шинжилгээ нь зөвхөн орон нутгийн токен дамжуулалт XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Үнэн хэрэгслийн хувьд орон нутгийн токоны төлбөрийг тусгайлан ирүүлэхгүй
хамгийн сайн хүчин чармайлттай гүйлгээ.
төлбөрийн болон бизнесийн заавар олгох, эсвэл гэрээний нэвтрүүлгийн тоног төхөөрөмжийг илрүүлэх
бизнес үйлдлийг хэрэгжүүлэхээс өмнө орон нутгийн токен цуглуулдаг.

Хувьцааны бодлогыг апп эсвэл гэрээгээр хадгалах:

- ямар үйл ажиллагаа нь хэдэн орон нутгийн токен нэгж зарцуулдаг вэ
- орон нутгийн токен урсгалын газрын зураг хэрхэн дэмжих вэ XOR Өндөрөгч
- хэрэглэгчийн тэнцвэр хэт бага бол яах вэ?
- төлөөлөгч XOR тэнцвэр нь хэт бага

::: warning

Хэрэглээгүй `gas_asset_id` "Орон нутгийн токоны төлбөр" загварын хувьд
Энэ газын хөрөнгөд мөн төлбөр тооцох.
`fee_sponsor` төмөр замын газын конфигурацын төлөгчөөр нь тусгай зөвшөөрөл олгодог
орон нутгийн токоны хэрэглэгчийн төлбөрийн хувьд токоныг тодорхой
хөрөнгийн болон гэрээний дүрэм.

:::

## Хөдөлмөрийн санхүүжилтийн алдааг сэргээх {#debug-failed-sponsored-transactions}

Дашрамд тооцогддог шалтгаан нь ихэнхдээ нэг хөөцөлдөх алхам хохирол учруулдаг:

| Хатаг бичлэг | Ямар зүйлийг шалгах вэ? |
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` Одоо ч гэсэн `false` Үргэлж дээр. |
| `fee sponsor is not authorized` | Хэрэглэгчид `CanUseFeeSponsor` Энэ спонсорын төлөө. |
| `fee asset ... is missing` | Төлөөлөгч нь конфигурируулсан XOR төлбөрийн хөрөнгө. |
| `fee balance ... is insufficient` | Тэтгэврийн захирагч XOR тэнцвэр. |
| `fee exceeds sponsor_max_fee` | Үргэлж `sponsor_max_fee` эсвэл гүйлгээний хэмжээ / газг бууруулах. |
| `invalid nexus fee asset id` | Урьдчилгаа `nexus.fees.fee_asset_id` эсвэл XOR Ашигт малтмалын нэр. |

2 загварыг алдаа гаргахдаа хоёр тэнцвэрийг шалгаарай:

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

## Тэтгэврийг ажиллуулах {#operate-the-sponsor}

Тэтгэврийг санхүүгийн дансанд тооцох:

- туршилтын сүлжээн, наадам зохион байгуулах болон гол сүлжээнд тусгаар тогтнолоо
- төлөөлөгчийн өмнө мэдэгдэл XOR тэнцвэр нь элсэх түвшинд хүрдэг
- 0-аас өөр `sponsor_max_fee` Замын хөдөлгөөнийг тодорхойлсон дараа
- төлбөрийн хязгаарт хамгаалсан бичлэг таны хүсэлт эсвэл галт тэрэгт
- цуцлах `CanUseFeeSponsor` хэрэглэгчид өгөгдлийн орон зайг орхих үед
- хэрэглэгчийн транзакцын хэшүүд, орон нутгийн токенээр төлбөр тооцоо, спонсор хийх XOR
  төлбөр тооцоо

Хэрэглэгчийн тэтгэврийг цуцлах:

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

- [Сэргэлт SORA Nexus Мэдээллийн газар](/mn/get-started/sora-nexus-dataspaces.md)
- [Хөдөлмөр Iroha 3 дамжуулан CLI](/mn/get-started/operate-iroha-via-cli.md)
- [Ашигт малтмал](/mn/blockchain/assets.md)
- [Тусгай зөвшөөрөл](/mn/blockchain/permissions.md)
- [Тусгай зөвшөөрлийн токенүүд](/mn/reference/permissions.md)
