---
translation_locale: uz
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Maxsus ma'lumotlar maydonchasi uchun sponsorlik to'lovlari {#sponsor-fees-for-a-private-dataspace}

To'lov sponsorligi foydalanuvchilarga XOR saqlamasdan xususiy ma'lumotlar maydonidagi bitimlarni taqdim etishga imkon beradi. Foydalanuvchi amalni hali ham imzolaydi. Transaksiya metadatalari sponsor hisobvarag'iga ko'rsatilgan, ish vaqti esa tarmoq to'lovi uchun sponsorning XOR balansini debit qiladi.

Integratsiya uchta harakatlanuvchi qismdan iborat:

1. nod to'lovlarni sponsorlashtirishga ruxsat beradi
2. sponsor hisobvarag'i mavjud va XOR
3. har bir foydalanuvchi uchun ushbu sponsor uchun `CanUseFeeSponsor`

Shundan so'ng, har bir qo'llab-quvvatlanadigan foydalanuvchi tranzaksiyasiga faqat ushbu metadatalar kerak:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Ushbu sahifada ikkita keng tarqalgan namuna koʻrsatilgan:

- Bepul foydalanuvchi yozadi: homiy XOR to'laydi va foydalanuvchi hech narsa to'lamaz.
- Mahalliy tokenlar to'lovlari: foydalanuvchi sponsorga dastur tokenida, sponsor esa tarmoq uchun XOR da pul to'laydi.

Avval Taira yoki xususiy test tarmog'idan foydalaning. Yangi xususiy ma'lumotlar maydonasi operator va boshqaruv o'zgarishidir; u mijoz konfiguratsiyasi bilan yaratilmaydi.

## Misol qiymatlari {#example-values}

Quyida keltirilgan buyruqlarda quyidagi joylarga ega boʻlganlar ishlatiladi:

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

Kanonik I105 hisobidan IDs foydalaning, agar sizning ishga tushirishingizda o'sha hisoblar uchun faol hisob aliaslari bo'lmasa.

## 1. Ma'lumotlar maydonini tayyorlang {#_1-prepare-the-dataspace}

[da tasvirlangan xususiy ma'lumotlar maydonining katalogidan va yo'naltirish ishlaridan boshlang SORA Nexus Ma'lumotlar Maydonlariga ulanish ](/uz/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). Operatorga qaraydigan fragment quyidagicha ko'rinadi:

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

Foydalanuvchi tranzaksiyalariga o'tishdan oldin quyidagilarni tekshiring:

- Xususiy yo'nalish `/status` javob nodida ko'rinadi.
- foydalanuvchi hisobvaraqlari sizning xususiy onboarding oqimi orqali qabul qilinadi
- sponsor hisobvarag'i mavjud
- XOR to'lov aktivlari va to'lovlar hisob raqami tarmoqda haqiqiy bo'ladi;

## 2. Ma'lumotlar maydonida aktivlarni ro'yxatga olish {#_2-register-assets-in-the-dataspace}

Foydalanuvchilar xususiy ma'lumotlar maydonida saqlaydigan aktivlar ta'rifini dastur mantiqlariga o'tkazishdan oldin ro'yxatga oling. Mahalliy token to'lovlari namunasi uchun qo'llanma `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Avval aktiv nomlar maydonining egasi bo'lgan domen va SNS ijara shartnomasini o'rnating. `$BILLING_DOMAIN` uchun sirsiz `AliasSetupPlanRequestV1` niyatni yaratish, shu jumladan raqamli `team` ma'lumotlar maydonini ID, kanonik mulkdor, ijara muddati va joriy kotirovka himoyachini:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

So'ngra aktivning ta'rifini qayd eting. Kanonik `--id` tarmoq darajasidagi aktiv ta'rifidir ID. Ushbu alias ishlab chiquvchilar va oxirgi foydalanuvchilar ma'lumotlar maydonida koddan foydalanishlari kerak:

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

Foydalanuvchining balansini tekshiring:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Ma'lumotlar maydonida ilova aktivlari uchun xuddi shu namunadan foydalaning. Token bo'yicha bir aktiv ta'rifini qayd qiling, har biriga ma'lumotlar Maydonining aliasi berilsin va qattiq kodlangan kanonik aktiv ta'minoti IDs o'rniga SDK kodidagi aliasiga murojaat qiling.

## 3. Foydalanuvchi aliaslarini ro'yxatga olish {#_3-register-user-aliases}

Hisobvaraqlar hali ham kanonik I105 hisobvarag'i IDs hisoblanadi. Foydalanuvchi nomi hisobvaraq aliaslari bo'lib, aliaslar `alice@team` yoki `alice@members.team` kabi xotirjam bo'lmasligi kerak. Telefon raqamlari yoki elektron pochta manzillarini alias sifatida ishlatmang. Ular keyingi bo'limda xususiy identifikator oqimiga kiradi.

Alias o'rnatish domen o'rnatishi bilan bir xil deklaratsiyaviy rejalashtiruvchini ishlatadi. SDK yoki onboarding xizmati `AliasSetupPlanRequestV1` niyatini yaratsin, uning hisob-alias kirish maqsadlari `$USER` bo'lib, asosiy rolni tanlaydi, raqamli ma'lumotlar maydonini ID pin qiladi va joriy ijara narxini himoya qiladi. Keyin uni bitta atom muomalasi sifatida rejalashtirish va qo'llash:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Agar foydalanuvchi XOR to'lamasligi kerak bo'lsa, o'rnatish operatsiyasini tuzish va taqdim etish uchun tasdiqlangan sponsor xabardor bo'lgan onboarding xizmatidan foydalaning. Ijara shartnomasini sotib olish va mas'uliyatli aliaslarni mustaqil arizalar orqali amalga oshirishga ajratmang.

CLI nomini bog'laganidan so'ng, uni tekshirish:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Yangi hisob yaratish uchun `NewAccount` ni barqaror `uaid` va, agar kerak bo'lsa, boshlang'ich `label` bilan yaratadigan onboarding xizmatini afzal ko'ring. Sodda `ledger account register --id` buyruq faqat kanonik hisobni ID qayd etadi.

## 4. Telefon va elektron pochta xabarlarini FHE bilan shaxsiy ravishda ro'yxatdan o'tkazing {#_4-register-phone-and-email-privately-with-fhe}

Telefon raqamlari va elektron pochta manzillaridan FHE tomonidan qo'llab-quvvatlanadigan oqim hisobning aliaslari, bitim metadatalari va jahon holatidan xom identifikatorlarni saqlaydi:

1. operator telefon va elektron pochta uchun [RAM-LFE/FHE dastur siyosatini ](/uz/blockchain/ram-lfe.md) ro'yxatga oladi.
2. operator `phone#team` va `email#team` kabi faol identifikator siyosatini ro'yxatga oladi.
3. pulka telefon yoki elektron pochta xabarini mahalliy ravishda normallashtiradi
4. qopchiq shifrlangan qiymatni hal qiluvchiga yuboradi .
5. Yechimchi `IdentifierResolutionReceipt` ni qaytaradi
6. foydalanuvchi risola bilan birga `ClaimIdentifier` taqdim etadi.
7. zanjir ko'rinmas identifikatorni va rasm hashini saqlaydi, ammo xom telefon yoki elektron pochta qiymatini saqlamaydi

Operator tomonidan qo'llaniladigan siyosat SDK yoki xizmat vazifasi hisoblanadi. Har bir identifikator turi uchun ushbu ko'rsatma juftlarini yaratish va taqdim etish:

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

Sponsorning metadata fayli 8-qadamda yaratilgandan so'ng, ushbu metadatalar bilan foydalanuvchi imzolagan talabnoma yo'l-yo'riqlarini taqdim eting:

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

Joriy CLI ushbu identifikatsiya yo'l-yo'riqlari uchun bosilgan buyruqlarni oshkor qilmaydi. SDK bilan seriyalangan `InstructionBox` qiymatlarini hosil qiling va ularni `ledger transaction stdin` orqali yuboring:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Ushbu qo'riqchilarni portlash xizmatiga joylashtiring:

- Hisobvaraqning aliaslari faqat inson tomonidan o'qish mumkin bo'lgan uskunalardir
- xom telefon va elektron pochta qiymatlari hech qachon aliases, metadatalar, loglar yoki operatsiya yuklarida ko'rinmaydi
- hisobda xususiy identifikatorlarni talab qilishdan oldin `uaid` raqami mavjud
- tushumlar `policy_id`, `opaque_id`, `uaid`, `account_id` bilan bog'lanadi va muddati tugaydi.
- resolver kalitlari va yashirin dastur majburiyatlari boshqaruv tomonidan nazorat qilinadi .

## 5. Nuklda Sponsoringni qo'llash {#_5-enable-sponsorship-on-the-node}

To'lovni qo'llab-quvvatlash - bu nod / ish vaqti siyosati. Nexus to'lov konfiguratsiyasida uni qo'llash:

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

`fee_asset_id` - tarmoq to'lovlari aktividir. SORA Nexus bu XOR. Aktivdan foydalanish XOR alias yoki kanonik XOR aktivlarning tavsifi ID to'plamingiz tomonidan aniqlangan.

`sponsor_max_fee = "0"` degani, har bir tranzaksiya uchun sponsor cheklovlari mavjud emas. Mahsulot uchun ma'lumotlar maydonidagi operatsiyalarning normal hajmi va gaz profilini bilganingizdan so'ng nol bo'lmagan cheklovni o'rnating.

Ushbu konfiguratsiyani o'zingizning odatdagi operator jarayoningiz orqali qayta ishga tushiring yoki ko'chiring.

## 6. Sponsorni yaratish va mablag' bilan ta'minlash {#_6-create-and-fund-the-sponsor}

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

Sponsor hisob qaydnomasini shaxsiy onlayn o'tish oqimi orqali ro'yxatdan o'tkazing:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Sponsorni XOR bilan xazinadan, talabnoma hisobvarag'idan yoki boshqa moliyalashtirilgan hisobvaraqdan mablag' ajrating:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

uchun Taira repetitsiyalar, kasana yordamchisi qutqarish [Testnetni olish XOR bilan Taira](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) koʻrsatilgan `taira_faucet_claim.py`, keyin sponsorni xazinani o'tkazishning o'rniga davlat kranidan mablag' bilan ta'minlash:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Sponsorning XOR balansini tekshirish:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Foydalanuvchiga Sponsorga kirish huquqini berish {#_7-grant-a-user-access-to-the-sponsor}

Sponsor har bir foydalanuvchiga haq to'lash uchun ruxsat berishlari kerak. Grant foydalanuvchilarga o'zboshimchalik bilan sponsor hisoblarini nomlashdan to'sqinlik qiladi.

Buni sponsor hisob qaydnomasi sifatida yoki ish vaqti siyosatingiz tomonidan ruxsat etilgan operatsion hisob qaydnomasi sifatida ishga tushiring:

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

- foydalanuvchi hisobi
- sponsor hisobvarag'i
- ma'lumotlar maydonlari yoki dasturlari
- tasdiqlangan chipta yoki boshqaruv qarori

Foydalanuvchining grantlarini tekshirish uchun:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Sponsorning Metadatalarini qo'shing {#_8-attach-sponsor-metadata}

Qayta ishlatilishi mumkin boʻlgan metadata faylini yaratish:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Ushbu metadatalar bilan taqdim etilgan har qanday yozish sponsordan:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs uchun imzolangan tranzaksiya ob'ektiga bir xil transaksiya metadatalarini ilova qiling. Foydalanuvchi tranzaksiyani foydalanuvchining kaliti bilan imzolaydi. Sponsor har bir foydalanuvchi tranzasyasini imzolamaydi, chunki avvalgi `CanUseFeeSponsor` grant ruxsatnoma hisoblanadi.

## 1-rasm: Foydalanuvchilar to'lovlarni to'lashmaydi {#pattern-1-users-pay-no-fees}

Ilova yoki operator barcha tarmoq to'lovlarini qabul qilganda ushbu usuldan foydalaning.

Ishlab chiquvchilar ro'yxati:

1. Foydalanuvchining normal operatsiya yukini o'zgartirmasdan saqlang.
2. `fee_sponsor` bilan tranzaksiya metadatalarini qo'shing.
3. Foydalanuvchi sifatida imzo oling.
4. Xususiy ma'lumotlar maydonining yo'nalishi orqali yuboring.

Foydalanuvchi hisobvarag'i XOR balansini talab qilmaydi. Sponsor hisobvaragi XOR konfiguratsiya qilingan Nexus to'lovlarini qoplash uchun etarli miqdorda saqlashi kerak.

## 2-rasm: foydalanuvchilar mahalliy belgini to'lashadi {#pattern-2-users-pay-a-local-token}

Foydalanuvchilar XOR ustida bo'lmasligi kerak bo'lganda buni ishlating, ammo ma'lumotlar maydoni hali ham ichki dastur to'lovini, kredit xarajatlarini yoki kvot tokenini xohlaydi.

Ushbu modelda mahalliy token ariza to'lovidir. u tarmoq to'lovi aktiv emas. Sponsor hali ham XOR da tarmoq to'lovini to'laydi.

Masalan, xususiy ma'lumotlar maydonida mahalliy tokendan foydalaning:

```text
usage#billing.team
```

`usage#billing.team` bilan mablag' ajratish foydalanuvchilari onboarding, abonnementni yangilash yoki kvotani taqsimlash paytida. Keyin foydalanuvchi tranzaksiyasini atomlashtiring:

1. foydalanuvchidan sponsorga mahalliy tokenlarni o'tkazish
2. talab qilingan dasturni bajarish
3. `fee_sponsor` metadatalarni o'z ichiga oladi, shuning uchun sponsor XOR ni to'laydi.

Kamroq CLI tutun sinovlari faqat XOR tomonidan qo'llab-quvvatlanadigan mahalliy token o'tkazishdir:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Haqiqiy dastur uchun mahalliy token to'lovini alohida eng yaxshi sa'y-harakat tranzaksiyasi sifatida taqdim etmang. To'lov va biznes ko'rsatmalarini o'z ichiga olgan bitta imzolangan tranzaksiyani yaratish yoki biznes operatsiyasini qo'llashdan oldin mahalliy tokenni yig'adigan shartnoma kirish punktini kashf etish.

Oʻzingizning ilova yoki shartnomangizda konversiya siyosatini saqlash:

- qaysi operatsiya qancha mahalliy token birliklarini sarflaydi
- XOR to'ldirishlarni qo'llab-quvvatlash uchun mahalliy tokenlar inflow xaritalari qanday
- foydalanuvchilarning muvozanati juda past bo'lganda nima sodir bo'ladi
- sponsorning XOR balanslari juda past bo'lganda nima sodir bo'ladi

::: ogohlantirish

`gas_asset_id` ni "local-token fee" modeli uchun ishlatmang, agar siz ushbu gaz aktivida ham sponsordan to'lov olinishini xohlamasangiz. Hozirgi ishga tushirish davrida `fee_sponsor` shuningdek, qo'llab-quvvatlovchini konfiguratsiya qilingan quvur-gaz aktivlari debitlari uchun to'lovchi qiladi. Mahalliy tokenlar foydalanuvchisi to'lovlari uchun tokenni o'tkazish yoki shartnoma qoidasi bilan aniq yig'ib oling.

:::

## Muvaffaqiyatlarning muvaffaqiyatsiz tugashini oʻzgartirish {#debug-failed-sponsored-transactions}

Ko'pincha rad etish sabablari odatda bitta yo'qolgan o'rnatish bosqichini ko'rsatadi:

|Xato matni |Nimalarni tekshirib koʻrish kerak|
| --- | --- |
|`fee sponsorship is disabled` |`nexus.fees.sponsorship_enabled` hali ham `false` bo'g'inida. |
|`fee sponsor is not authorized` |Foydalanuvchi uchun `CanUseFeeSponsor` ushbu ko'rsatkich mavjud emas. |
|`fee asset ... is missing` |Sponsor XOR to'lov aktivini saqlamaydi. |
|`fee balance ... is insufficient` |Sponsorning XOR balansini to'ldir. |
|`fee exceeds sponsor_max_fee` |`sponsor_max_fee` ko'paytirish yoki bitimning hajmi/gazini kamaytirish. |
|`invalid nexus fee asset id` |`nexus.fees.fee_asset_id` yoki XOR aktiv aliasini o'zgartirish. |

2 modelni xatoga yo'l qo'yishda ikkala balansni tekshirib ko'ring:

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

- testnet, staging va mainnet uchun alohida sponsor kalitlarini saqlang.
- qo'llab-quvvatlovchi XOR balansining qabul darajasiga yetib kelishidan oldin ogohlantirish
- yo'l-yo'riq belgilab qo'yilganidan so'ng `sponsor_max_fee` cheklovini o'rnatish
- talabnoma yoki darvoza vositasida tarif cheklovlari qoʻllab-quvvatlangan yozish
- foydalanuvchilar ma'lumotlar maydonidan chiqqanida `CanUseFeeSponsor` ni bekor qilish;
- foydalanuvchi tranzaksiya hashlarini, mahalliy tokenlar bilan to'lovlarni va sponsorlarning XOR debitlarini uyg'otish

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

- [SORA Nexus ma'lumotlar maydonlari](/uz/get-started/sora-nexus-dataspaces.md) bilan bog'lanish
- [Iroha 3 orqali CLI](/uz/get-started/operate-iroha-via-cli.md) orqali harakatlaning
- [Aktivlar](/uz/blockchain/assets.md)
- [Ruxsatnomalar](/uz/blockchain/permissions.md)
- [Ruxsat belgisi ](/uz/reference/permissions.md)
