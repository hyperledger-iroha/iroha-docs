---
translation_locale: uz
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Xususiy ma'lumotlar maydonchasi uchun sponsorlik to'lovlari {#sponsor-fees-for-a-private-dataspace}

Toʻlovlar boʻyicha sponsorlik foydalanuvchilarga xususiy maʼlumotlar maydonidagi bitimlarni taqdim etish imkonini beradi .
xo'jalik XOR. Foydalanuvchi hali ham amalni imzolaydi.
Sponsorning hisob raqamiga punktlar, va ish vaqti sponsorning XOR muvozanat
tarmoq haqi uchun.

Integratsiya uchta harakatlanuvchi qismdan iborat:

1. nod to'lovlarni sponsorlashtirishga ruxsat beradi
2. sponsor hisob raqami mavjud va mavjud XOR
3. har bir foydalanuvchi `CanUseFeeSponsor` ushbu sponsor uchun

Shundan so'ng, har bir sponsorlashtirilgan foydalanuvchi operatsiyasiga faqat ushbu metadata kerak:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Ushbu sahifada ikkita odatiy shakl koʻrsatilgan:

- **Bepul foydalanuvchi yozadi**: sponsor to ' laydi XOR va foydalanuvchi hech narsa to'lamaydi.
- **Mahalliy tokenlar uchun to'lovlar**: foydalanuvchi sponsorga dastur tokenini to'laydi va
  sponsor tarmoqga XOR.

Foydalanish Taira Yangi xususiy ma'lumotlar maydonchasi
operator va boshqaruv o'zgarishi; u mijoz konfiguratsiyasiga ko'ra yaratilmaydi.

## Misol qiymatlari {#example-values}

Quyidagi buyruqlarda quyidagi joylarni oʻz ichiga oladi:

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

Kanonikadan foydalanish I105 hisob IDs agar sizning joylashtiruvingizda faol hisob mavjud boʻlmasa
bir xil hisob raqamlari uchun aliaslar.

## 1. Ma'lumotlar maydonini tayyorlash {#_1-prepare-the-dataspace}

Shaxsiy ma'lumotlar maydonining katalog va yo ' nalish ishlaridan boshlang
[Bogʻlanish SORA Nexus Ma'lumotlar maydonlari](/uz/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace).
Operatorga qaraydigan bir qism quyidagicha koʻrinadi:

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

Foydalanuvchi tranzaksiyalariga o'tishdan oldin:

- Xususiy yo'nalish nodda paydo bo ' ladi `/status` javob
- foydalanuvchi hisobvaraqlari sizning xususiy onboarding oqimingiz orqali qabul qilinadi
- sponsor hisob raqami mavjud
- ko'rsatilgan XOR to'lov aktivlari va to'lovni o'chirish hisobvarag'i tarmoqda haqiqiy

## 2. Ma'lumotlar maydonida aktivlarni ro'yxatga olish {#_2-register-assets-in-the-dataspace}

Foydalanuvchilar tomonidan xususiy sektorda saqlanadigan aktivlar ta'rifini qayd etish
ma'lumotlar maydonini ilovalar mantiqiga ulashdan oldin.
o'quv qo'llanmasi `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Avval domenni oʻrnating va SNS aktiv nomlar maydonining egalari bo'lgan ijara shartnomasi.
sirsiz `AliasSetupPlanRequestV1` maqsad uchun `$BILLING_DOMAIN`, shu jumladan
raqamli `team` ma'lumotlar maydoni ID, Kanonik mulkdor, ijara muddati va joriy narx
qoʻriqchi:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

So'ngra aktivni belgilashni qayd et. Kanonik `--id` tarmoq darajasi
aktivlar ta'rifi ID. Bu alias ishlab chiquvchilar va oxirgi foydalanuvchilar uchun foydalanish kerak
ma'lumotlar maydonining kodi:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

Onboarding paytida mahalliy tokenni foydalanuvchiga almashtirish yoki o'tkazish:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Foydalanuvchining balansini tekshirish:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Ma'lumotlar maydonidagi dastur aktivlari uchun xuddi shu namunadan foydalaning.
har bir token uchun aktivni belgilash, har biri ma'lumotlar maydoni alias berish va
 SDK qattiq kodlash oʻrniga kodlangan kanonik aktivni aniqlash IDs.

## 3. Foydalanuvchi aliaslarini ro'yxatga olish {#_3-register-user-aliases}

Hisobotlar hali ham kanonik I105 hisob IDs. Foydalanuvchi nomi hisob
aliases va aliases kabi nohisli qo'llari bo'lishi kerak `alice@team` yoki
`alice@members.team`. Telefon raqamlari va elektron pochta manzillaridan nomsiz foydalanish.
Bular keyingi bo'limdagi xususiy identifikator oqimiga tegishli.

Alias-ni o'rnatish domen sohasi bilan bir xil deklaratsiyaviy rejalashtiruvchidan foydalanadi. SDK yoki
Onboarding xizmati sirsiz yaratish `AliasSetupPlanRequestV1` kimning niyati
Hisob-kitoblar uchun kirish maqsadlari `$USER`, boshlang'ich rolni tanlaydi, raqamli
ma'lumotlar maydoni ID, va joriy ijara narxini himoya qiladi. So'ngra uni rejalashtirish va qo'llash
bitta atom muomalasi sifatida:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Agar foydalanuvchi to'lamasa XOR, tashabbuskorning ma'lumotlari bilan tasdiqlangan onboardingdan foydalanish
o'rnatish tranzaksiyasini tuzish va taqdim etish uchun xizmat ko'rsatish. ijara shartnomasini bo'linma
O'z-o'zidan mustaqil arizalar bilan bog'liq bo'lgan xarid va alias.

Alias bog'langanidan so'ng uni CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Yangi hisobni yaratish uchun o'rnatish xizmatini afzal ko'ring
`NewAccount` o'rtoq `uaid` va zarur bo'lsa, dastlabki `label`. O ' zbekiston Respublikasi
oddiy `ledger account register --id` buyruq faqat kanoniklarni qayd etadi
hisob ID.

## 4. Telefon va elektron pochta xabarlarini shaxsiy ravishda FHE {#_4-register-phone-and-email-privately-with-fhe}

Telefon raqamlari va elektron pochta manzillaridan foydalaning, bular ommaviy emas.
nomlar. FHE-tashkilangan oqim hisobning nomi bilan bog'liq bo'lmagan xom identifikatorlarni saqlaydi,
Transaksiya metadatalari va jahon holati:

1. operator a ro'yxatga oladi
   [RAM-LFE/FHE dastur siyosati](/uz/blockchain/ram-lfe.md) telefon va elektron pochta uchun
2. operator aktiv identifikator siyosatini ro'yxatdan o'tkazadi: `phone#team` va
   `email#team`
3. pulka telefon yoki elektron pochta xabarlarini mahalliy ravishda normallashtiradi
4. qopchiq shifrlangan qiymatni hal qiluvchiga yuboradi
5. oʻzgaruvchi bir `IdentifierResolutionReceipt`
6. foydalanuvchi taqdim etadi `ClaimIdentifier` rasvo bilan
7. zanjir ko'chmas identifikatorni va rasm hashini saqlaydi, xom telefonni yoki
   elektron pochta xatlari qiymati

Operator tomonidagi siyosatning tuzilishi SDK yoki xizmat topshirig'i.
har bir identifikator turi uchun ushbu ko'rsatma juftliklari:

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

Email uchun takrorlang:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Onboarding paytida portfel yoki backend lokal ravishda normallashishi kerak:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

8 bosqichda sponsor metadata fayli yaratilgandan so'ng, foydalanuvchi tomonidan imzolangan
ushbu metadatalar bilan talabnoma yo'l-yo'riqlari:

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

Joriy CLI ushbu identifikatsiya uchun bosilgan buyruqlarni oshkor etmaydi
ko'rsatmalar. `InstructionBox` qiymatlari bilan SDK va
ularni o'tkazish `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Ushbu qo'riqchilarni bordering xizmatida saqlang:

- Hisobvaraqning aliaslari faqat inson tomonidan o'qib bo'ladigan qo'llanmalar
- xom telefon va elektron pochta qiymatlari hech qachon aliases, metadatalar, jurnallarda yoki
  Transaksiya faydali yuklari
- hisobda `uaid` xususiy identifikatorlarni talab qilishdan oldin
- tushumlar bogʻliq `policy_id`, `opaque_id`, `uaid`, `account_id`, va muddati tugaydi
- resolver kalitlari va yashirin dastur majburiyatlari boshqaruv tomonidan boshqariladi

## 5. Nuklda Sponsorlikni qo'llash {#_5-enable-sponsorship-on-the-node}

To'lovni qo'llab-quvvatlash - bu nod/runtime siyosati. Nexus to'lovlar konfiguriyasi:

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

`fee_asset_id` tarmoq to'lovlari aktividir. SORA Nexus bu XOR. Foydalanish
faol XOR alias yoki kanonik XOR aktivlar ta'rifi ID to'plamingiz tomonidan aniqlangan.

`sponsor_max_fee = "0"` Transaksiya bo'yicha sponsorning cheklangan miqdori yo'qligini anglatadi.
ishlab chiqarish, normal o'lcham va gaz profilini bilganingizdan so'ng nol bo'lmagan cheklovni belgilash
ma'lumotlar maydonidagi operatsiyalaringizdan.

Ushbu konfiguratsiyani o'zingizning odatdagi operator jarayoningiz orqali qayta ishga tushiring.

## 6. Sponsorni yaratish va unga mablag' ajratish {#_6-create-and-fund-the-sponsor}

Agar kerak bo'lsa, sponsor kalitlari juftligini yaratish:

```bash
kagami keys --algorithm ed25519 --json
```

Ochiq kalitni tarmoqingiz uchun hisob shakliga aylantiring:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Sponsorlik hisobini shaxsiy onlayn o'tkazish orqali ro'yxatdan o'tkazing:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Sponsorni moliyalashtirish XOR xazinadan, talabnoma hisobidan yoki boshqa moliyalashtirilgan
hisob raqami:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

uchun Taira repetitsiyalar, kasana yordamchisi qutqarish
[Testnetni olish XOR to ' g'risida Taira](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
sifatida `taira_faucet_claim.py`, keyin sponsorni ommaviy kran orqali moliyalashtiradi
xazinani o'tkazishning o'rniga:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Sponsorni tekshirib ko'ring. XOR muvozanat:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Foydalanuvchiga Sponsorga kirish huquqini berish {#_7-grant-a-user-access-to-the-sponsor}

Sponsor har bir foydalanuvchidan to'lovlarni olish uchun ruxsat berishi kerak.
foydalanuvchilarga o'zboshimchalik bilan sponsorlik hisoblarini nomlashdan to'sqinlik qiladi.

Buni sponsor hisob raqami sifatida yoki sizning
Ish vaqti siyosati:

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

Onboarding xizmatlari uchun buni oddiy hisob-kitobni ta'minlash bosqichini tashkil etish va yozuv:

- foydalanuvchi hisob raqami
- homiy hisob raqami
- ma'lumotlar maydonlari yoki dasturlari
- tasdiqlash varaqasi yoki boshqaruv qarori

Foydalanuvchining grantlarini tekshirish uchun:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Sponsorning metadatalarini qo'shing {#_8-attach-sponsor-metadata}

Koʻp marta ishlatiladigan metadata faylini yaratish:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Ushbu metadata bilan taqdim etilgan har qanday yozish sponsordan:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

uchun SDKs, imzolangan ma'lumotlar ob'ektiga bir xil bitim metadatalarini qo'shish
Transaksiya. Foydalanuvchi tranzaksiyani foydalanuvchining kaliti bilan imzolaydi. Sponsor
har bir foydalanuvchi tranzaksiyasini imzolamaydi , chunki oldingi `CanUseFeeSponsor`
grant - bu ruxsatnoma.

## Birinchi nusxasi: foydalanuvchilar to'lovlarni to'lashmaydi {#pattern-1-users-pay-no-fees}

Ilova yoki operator barcha tarmoq to'lovlarini qabul qilganida ushbu usuldan foydalaning.

Ishlab chiquvchilar ro'yxati:

1. Foydalanuvchining odatiy operatsiya yukini o'zgartirmasdan saqlang.
2. Transaksiya metadatalarini qoʻshish `fee_sponsor`.
3. Foydalanuvchi sifatida imzo oling.
4. Xususiy ma'lumotlar maydonining yo'nalishi orqali yuboring.

Foydalanuvchi hisob raqami XOR balans. Sponsor hisob raqami saqlanishi kerak
yetarli XOR konfiguratsiyani qoplash uchun Nexus to'lovlar.

## 2- model: foydalanuvchilar mahalliy belgini to'laydilar {#pattern-2-users-pay-a-local-token}

Foydalanuvchilar ushlab turmasligi kerak boʻlganda XOR, lekin ma'lumotlar maydoni hali ham
ichki dastur haqi, kredit xarajatlari yoki kvota tokenlari.

Ushbu modelda mahalliy token dastur to'lovidir.
tarmoq to'lovlari aktiv. XOR.

Masalan, xususiy ma'lumotlar maydonida mahalliy tokendan foydalaning:

```text
usage#billing.team
```

Fond foydalanuvchilari `usage#billing.team` Onboarding paytida, obunalarni yangilash;
Keyin foydalanuvchi tranzaksiyasini atomlashtiring:

1. foydalanuvchidan sponsorga mahalliy tokenlarni o'tkazish
2. talab qilingan dasturni bajarish
3. kiritiladi `fee_sponsor` metadata , shunda sponsor pul to'laydi XOR

Kamdan-kam CLI tutun sinovlari faqat mahalliy token oʻtkazish tomonidan qoʻllab-quvvatlanadi XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Haqiqiy dastur uchun mahalliy token to'lovini alohida sifatida taqdim etmang
eng yaxshi urinish tranzaksiyasini yaratish.
to'lov va biznes yo'l-yo'riqlarini berish yoki shartnoma kirish punktini oshkor qilish
biznes operatsiyasini qo'llashdan oldin mahalliy tokenni to'playdi.

Oʻzingizning ilova yoki shartnomangizda konversiya siyosatini saqlang:

- qaysi operatsiya qancha mahalliy token birliklari xarajat
- qanday mahalliy token inflow xaritasi sponsorlash uchun XOR to'ldirish
- foydalanuvchi muvozanati juda past bo'lganda nima sodir bo'ladi
- sponsor bo'lganda nima yuz beradi XOR muvozanat juda past

::: warning

Foydalanish `gas_asset_id` "Milliy token to'lovlari" namunasi uchun, agar siz xohlamasangiz
ko'rsatkichlarni o'z ichiga oladigan gaz aktivida ham sponsordan to'lov olinadi.
`fee_sponsor` shuningdek, konsorterni konfiguratsiya qilingan gaz quvurlari uchun to'lovchi qiladi
mahalliy token foydalanuvchi to'lovlari uchun tokenni aniq ravishda
o'tkazish yoki shartnoma qoidasi.

:::

## Muvaffaqiyatga erishilmagan koʻrsatkichlarni tugallash {#debug-failed-sponsored-transactions}

Ko'pincha rad etish sabablari odatda bitta yo'qolgan o'rnatish bosqichini ko'rsatadi:

| Xato matni | Nimalarni tekshirish kerak |
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` hali ham `false` to'plamda. |
| `fee sponsor is not authorized` | Foydalanuvchi `CanUseFeeSponsor` bu sponsor uchun. |
| `fee asset ... is missing` | Sponsor konfiguratsiya qilingan XOR haq aktivlari. |
| `fee balance ... is insufficient` | Sponsorning to'ldirish XOR muvozanat. |
| `fee exceeds sponsor_max_fee` | Oʻsish `sponsor_max_fee` yoki muomala hajmi/gazini kamaytirish. |
| `invalid nexus fee asset id` | Tuzatish `nexus.fees.fee_asset_id` yoki XOR Asset aliaslari. |

2. O'zgarishlarni to'g'rilashda har ikki balansni tekshirib ko'ring:

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

## Sponsorni ishga tushiring {#operate-the-sponsor}

Sponsorni xazina hisobvarag'i sifatida ko'rib chiqish:

- testnet, staging va mainnet uchun alohida sponsor kalitlarini saqlang
- sponsor oldida ogohlantirish XOR muvozanat kirish darajasiga yetadi
- nol boʻlmagan belgilash `sponsor_max_fee` trafik belgilab berilganidan so'ng cap
- talabnoma yoki darvoza orqali qoʻllaniladigan roʻyxat
- bekor qilish `CanUseFeeSponsor` foydalanuvchilar ma'lumotlar maydonidan chiqib ketganda
- foydalanuvchilar uchun hashlarni, mahalliy token to'lovlarini va sponsorlarni uyg'otish XOR
  debitlar

Foydalanuvchi uchun sponsorlikni bekor qilish:

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

## Bogʻliq sahifalar {#related-pages}

- [Bogʻlanish SORA Nexus Ma'lumotlar maydonlari](/uz/get-started/sora-nexus-dataspaces.md)
- [Operatsiya qilish Iroha 3 orqali CLI](/uz/get-started/operate-iroha-via-cli.md)
- [Aktivlar](/uz/blockchain/assets.md)
- [Ruxsatnomalar](/uz/blockchain/permissions.md)
- [Ruxsat to'plamlari](/uz/reference/permissions.md)
