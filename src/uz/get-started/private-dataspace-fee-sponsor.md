---
translation_locale: uz
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Shaxsiy ma’lumotlar makoni uchun homiy to'lovlari {#sponsor-fees-for-a-private-dataspace}

To‘lov homiyligi foydalanuvchilarga XOR ushlab turmasdan maxfiy ma’lumotlar makoni tranzaksiyalarini yuborishga imkon beradi. Foydalanuvchi hali ham tranzaksiyani imzolaydi. Tranzaksiya metama’lumotlari homiy hisobini ko‘rsatadi va dasturiy ijro muhiti tarmoq to‘lovi uchun homiyning XOR balansini yechib oladi.

Integratsiyada uchta harakatlanuvchi qism mavjud:

1. tugun to‘lov homiyligini qo‘llab-quvvatlaydi
2. homiy hisob mavjud va XOR ga ega
3. har bir foydalanuvchida ushbu homiy uchun `CanUseFeeSponsor` mavjud

Shundan so‘ng, har bir homiylik qilingan foydalanuvchi tranzaksiyasi uchun faqat ushbu metadata kerak bo‘ladi:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Ushbu sahifa ikkita umumiy naqshni ko'rsatadi:

- Bepul foydalanuvchi yozadi: homiy XOR tolaydi va foydalanuvchi hech narsa tolamaydi.
- Mahalliy token to'lovlari: foydalanuvchi ilova tokenida homiyga to'laydi, va homiy tarmoqqa XOR orqali to'laydi.

Avvalo Taira yoki xususiy test tarmog‘idan foydalaning. Yangi xususiy ma’lumotlar makoni operator va boshqaruv o‘zgarishidir; uni mijoz sozlamalari yaratmaydi.

## Misol qiymatlar {#example-values}

Quyidagi buyruqlar ushbu o‘rinbosarlar foydalanadi:

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

Agar sizning joylashtirishingizda bir xil hisoblar uchun faol hisob aliaslari bo‘lmasa, kanonik I105 hisob identifikatorlaridan foydalaning.

## 1. Ma’lumotlar makonini tayyorlash {#_1-prepare-the-dataspace}

Xususiy ma’lumotlar makoni katalogi va [SORA Nexus Dataspaces ga ulaning](/uz/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace) da tasvirlangan yo'naltirish ishidan boshlang. Operatorga mo'ljallangan bo'lak quyidagicha ko'rinadi:

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

- maxfiy ijro yo‘lagi `/status` tugun javobida paydo bo‘ladi
- foydalanuvchi hisoblari sizning shaxsiy onboarding jarayoningiz orqali qabul qilinadi
- homiy hisobi mavjud
- XOR to‘lov aktivlari va to‘lov manbasi hisoblari tarmoqda amal qiladi

## 2. Aktivlarni Dataspace'da ro'yxatga olish {#_2-register-assets-in-the-dataspace}

Foydalanuvchilar xususiy ma'lumot maydonida ushlab turadigan aktiv ta'riflarini ularni ilova mantiqiga ulashdan oldin ro‘yxatdan o‘tkazing. Mahalliy token to‘lov modeli uchun darslik `usage#billing.team` dan foydalangan:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Avvalo domenni va aktivlar nomlar makoniga egalik qiluvchi SNS ijarani sozlang. `$BILLING_DOMAIN` uchun maxfiyatsiz `AliasSetupPlanRequestV1` niyatini yarating, shu jumladan raqamli `team` ma’lumotlar makoni IDsi, kanonik egasi, ijara muddati va joriy narx qo'riqchisini:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Keyin aktiv ta'rifini ro'yxatdan o'tkazing. Kanonik `--id` tarmoq darajasidagi aktiv ta'rifi ID'si hisoblanadi. Aliasing — bu ishlab chiquvchilar va yakuniy foydalanuvchilar dataspace kodida ishlatishi kerak bo'lgan narsa:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

foydalanuvchini ro‘yxatdan o‘tkazish vaqtida mahalliy tokenni chiqarish yoki foydalanuvchiga o'tkazish:

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

Dataspace ichidagi ilova aktivlari uchun bir xil naqshni ishlating. Har bir token uchun bitta aktiv ta'rifini ro'yxatdan o'tkazing, har biriga dataspace aliasini bering va SDK kodidan bitta protokol-standart aktiv ta'rifi IDlarini bevosita kodlash o'rniga aliasga murojaat qiling.

## 3. Foydalanuvchi Taxalluslarini Ro‘yxatga Olish {#_3-register-user-aliases}

Hisoblar hanuz kanonik I105 hisob raqamlari hisoblanadi. Foydalanuvchi ko'rishi mumkin bo'lgan nomlar hisob aliaslari bo'lib, aliaslar no-sensitiv vositalar bo'lishi kerak. masalan `alice@team` yoki `alice@members.team`. Telefon raqamlari yoki elektron pochta manzillarini kirishma sifatida ishlatmang. Ular keyingi bo‘limdagi maxfiy identifikator oqimiga tegishli.

Alias sozlamalari domen sozlamalari bilan bir xil deklarativ rejalashtirgichdan foydalanadi. SDK yoki onboarding xizmatiga hisob-alias yozuvi quyidagiga qaratilgan sir-siz `AliasSetupPlanRequestV1` ni yaratishga ruxsat bering `$USER` asosiy rolni tanlaydi, raqamli ma’lumotlar makoni ID sini bog‘laydi va joriy ijara to‘lov-narx tekshiruvi qo‘riqchisini olib yuradi. Keyin uni bitta atomik tranzaksiya sifatida rejalashtiring va qo‘llang:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Agar foydalanuvchi XOR ni to'lamasligi kerak bo'lsa, tasdiqlangan homiylikni hisobga olgan onboarding xizmatidan foydalanib, sozlash operatsiyasini tuzing va yuboring. Ijara olish va alias bog'lashni mustaqil ilova operatsiyalariga ajratmang.

Alias bog‘langandan so‘ng, uni CLI orqali tasdiqlang:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Yangi hisob yaratish uchun barqaror `uaid` bilan `NewAccount`ni yaratuvchi va zarur bo‘lsa boshlang‘ich `label`ni taqdim etadigan onboard xizmatini afzal ko‘ring. Oddiy `ledger account register --id` komandasi faqat bitta protokol-standart hisob ID sini ro‘yxatdan o‘tkazadi.

## 4. FHE bilan telefon va elektron pochtani shaxsiy tarzda ro‘yxatdan o‘tkazing {#_4-register-phone-and-email-privately-with-fhe}

Telefon raqamlari va elektron pochta manzillaridan jamoatchilik taxalluslari emas, shaxsiy identifikator da'volari sifatida foydalaning. FHE qo‘llab-quvvatlangan oqim hisob aliaslarida, tranzaksiya metadatalarida va global holatda xom identifikatorlarni ushlab turmaydi:

1. operator telefon va elektron pochta uchun [RAM-LFE/FHE dastur siyosati](/uz/blockchain/ram-lfe.md) ni ro‘yxatdan o‘tkazadi
2. operator `phone#team` va `email#team` kabi faol identifikator siyosatlarini ro‘yxatdan o‘tkazadi
3. hamyon telefon yoki elektron pochtani mahalliy darajada normallashtiradi
4. hamyon shifrlangan qiymatni yechuvchi qurilmaga yuboradi
5. yechimchi `IdentifierResolutionReceipt` ni qaytaradi
6. foydalanuvchi protokol natijasi yozuvi bilan `ClaimIdentifier` ni yuboradi
7. zanjir shaffof bo‘lmagan identifikator va protokol natijasi yozuvining kriptografik xashini saqlaydi, xom telefon yoki email qiymatini emas

Operator tomonidagi siyosat sozlamasi SDK yoki xizmat vazifasidir. Har bir identifikator turi uchun ushbu ko‘rsatma juftliklarini tuzing va yuboring:

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

Buni elektron pochta uchun takrorlang:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Onboarding jarayonida, hamyon yoki backend mahalliy ravishda normallashtirishi kerak:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

8-qadamda homiy metadata fayli yaratilgandan so‘ng, ushbu metadatalar bilan foydalanuvchi imzolagan da’vo ko‘rsatmasini yuboring:

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

Joriy CLI ushbu identitet ko‘rsatmalari uchun typed komandalarni taqdim etmaydi. SDK bilan serializatsiyalangan `InstructionBox` qiymatlarini yarating va ularni `ledger transaction stdin` orqali yuboring:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Ushbu qoʻriqlash chizmalarini onboarding xizmatida saqlang:

- hisob-aliaslar faqat odam o‘qiy oladigan handlelardir
- xom telefon va elektron pochta qiymatlari hech qachon aliaslarda, metadata, loglarda yoki tranzaksiya yuklamalarida ko‘rinmaydi
- hisob `uaid` ga ega, shundan oldin u shaxsiy identifikatorlarni talab qiladi
- protokol natijasi yozuvlari bog'langan `policy_id`, `opaque_id`, `uaid`, `account_id` va muddati tugash
- resolver tugmalari va yashirin dastur kriptografik majburiyat qiymatlari boshqaruv tomonidan nazorat qilinadi

## 5. Nodda Homiylikni yoqing {#_5-enable-sponsorship-on-the-node}

To‘lov homiyligi tugun va bajarish muhiti siyosatidir. Uni Nexus to‘lov sozlamalarida yoqing:

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

`fee_asset_id` tarmoq to‘lovi aktividir. SORA Nexus uchun bu XOR. Tarmog‘ingiz tomonidan taqdim etilgan faol XOR alias yoki yakka protokol-standart XOR aktiv ta’rif ID’sidan foydalaning.

`sponsor_max_fee = "0"` har bir tranzaksiya bo‘yicha homiylik chegarasi yo‘qligini anglatadi. Ishlab chiqarishda, ma’lumotlar bo‘shlig‘idagi tranzaksiyalaringizning o‘rtacha hajmi va tranzaksiya bajarish xarajatlari profili haqida bilganingizdan so‘ng, nol bo‘lmagan chegarani belgilang.

Ushbu konfiguratsiyani normal operator jarayoningiz orqali qayta ishga tushiring yoki o'tkazing.

## 6. Homiyni Yaratish va Mablag‘ Bilan Ta’minlash {#_6-create-and-fund-the-sponsor}

Agar kerak bo'lsa, homiy kalit juftligini hosil qiling:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

Ommaviy kalitni tarmog‘ingiz uchun hisob formatiga o‘tkazing:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Sponsoring hisobini shaxsiy ro‘yxatdan o‘tish jarayoningiz orqali ro‘yxatdan o‘tkazing:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Homiyni g‘azna, da’vo hisobi yoki mablag‘li boshqa hisobdagi XOR bilan moliyalashtiring:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Taira repetitsiyalari uchun, sinov tarmog‘i kranining yordamchisidan [Testnet XOR-ni Taira-da oling](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)ni `taira_faucet_claim.py` sifatida saqlang, so‘ng homiyni byudjetdan o‘tkazish o‘rniga jamoat sinov tarmog‘i krani bilan moliyalashtiring:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Homiyning XOR balansini tekshiring:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Foydalanuvchiga homiyga kirish huquqini bering {#_7-grant-a-user-access-to-the-sponsor}

Sponsor har bir foydalanuvchiga ularga to‘lovlarni undirish uchun ruxsat berishi kerak. Ushbu ruxsat foydalanuvchilarning o‘z xohishiga ko‘ra sponsor hisoblarini belgilashining oldini oladi.

Buni homiy hisobidan yoki dastur ijro muhit siyosatingiz tomonidan ruxsat berilgan operatsion hisobdan ishga tushiring:

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

Xizmatlarga kirish uchun, buni oddiy hisob yaratish bosqichi qiling va yozib qo'ying:

- foydalanuvchi hisob
- homiy hisob qaydnomasi
- ma’lumotlar makoni yoki dastur
- tasdiqlash chiptasi yoki boshqaruv qarori

Foydalanuvchining ruxsatlarini tekshirish uchun:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Homiy Metama'lumotlarini qo'shish {#_8-attach-sponsor-metadata}

Qayta ishlatiladigan metadata faylini yarating:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Ushbu metadata bilan taqdim etilgan har qanday yozuv homiyga hisoblanadi:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs uchun, imzolangan tranzaksiyaga bir xil tranzaksiya metadata obyektini qo‘shing. Foydalanuvchi tranzaksiyani foydalanuvchining kaliti bilan imzolaydi. Homiy har bir foydalanuvchi tranzaksiyasini imzolamaydi, chunki avvalgi `CanUseFeeSponsor` grant avtentifikatsiya hisoblanadi.

## Shakl 1: Foydalanuvchilar Hech Qanday To'lov Olamaydilar {#pattern-1-users-pay-no-fees}

Ilovani yoki operatorni barcha tarmoq to‘lovlarini qoplaganda buni ishlating.

Dasturchi tekshiruv ro'yxati:

1. Foydalanuvchining odatiy tranzaksiya ma'lumotlarini o'zgartirmang.
2. `fee_sponsor` bilan tranzaksiya metama'lumotlarini qo‘shing.
3. Foydalanuvchi sifatida imzo qo'ying.
4. Shaxsiy ma’lumotlar makoni orqali yuboring.

Foydalanuvchi hisobida XOR balansi bo‘lishi shart emas. Homiy hisobida belgilangan Nexus to‘lovlarni qoplash uchun yetarli XOR bo‘lishi kerak.

## Namuna 2: Foydalanuvchilar Mahalliy Token Uchun To'laydi {#pattern-2-users-pay-a-local-token}

Foydalanuvchilar XOR ni ushlab turmasligi kerak bo'lgan hollarda, lekin dataspace ichki ilova to‘lovi, kredit sarfi yoki kvota tokenini talab qilganda buni ishlating.

Ushbu naqshda mahalliy token ilova to‘lovi hisoblanadi. Bu tarmoq to‘lovi aktiv emas. Homiy hali ham tarmoq to‘lovini XOR da to‘laydi.

Masalan, maxfiy ma’lumotlar makonida mahalliy tokenni ishlating:

```text
usage#billing.team
```

Foydalanuvchilarga onboarding, obuna yangilanishi yoki kvota ajratish vaqtida `usage#billing.team` bilan mablag‘ ta’minlang. Keyin foydalanuvchi tranzaksiyasini atomik qiling:

1. foydalanuvchidan homiyga mahalliy tokenlarni uzatish
2. so'ralgan ilova operatsiyasini bajarish
3. `fee_sponsor` metama'lumotlarni qo‘shing, shunda homiy XOR to‘laydi

Minimal CLI tutun testi shunchaki XOR tomonidan homiylik qilinadigan lokal-token uzatishdir:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Haqiqiy ilova uchun, mahalliy-token to‘lovini alohida imkon qadar amalga oshiriladigan tranzaksiya sifatida yubormang. To‘lov va biznes ko‘rsatmasini o‘z ichiga olgan bitta imzolangan tranzaksiyani yarating yoki biznes operatsiyasini qo‘llashdan oldin mahalliy tokenni to‘playdigan shartnoma kirish nuqtasini taqdim eting.

Ilovangizda yoki shartnomangizda konvertatsiya siyosatini saqlang:

- qaysi operatsiya qancha mahalliy token birliklarini talab qiladi
- mahalliy token oqimi homiy XOR to‘ldirishlariga qanday xarita qilinadi
- foydalanuvchi balansi juda past bo‘lganda nima bo‘ladi
- homiy XOR balansi juda past bo'lganda nima bo'ladi

::: warning

Homiydan shu gaz aktivida ham haq olishni istamasangiz, “mahalliy token to‘lovi” andozasi uchun `gas_asset_id` dan foydalanmang. Joriy bajarish muhitida `fee_sponsor` sozlangan konveyer gaz aktivi yechimlari uchun ham homiyni to‘lovchi qiladi. Mahalliy tokenlardagi foydalanuvchi to‘lovlarini o‘tkazish amali yoki shartnoma qoidasi orqali aniq undiring.

:::

## Sponsorlashgan Tranzaksiyalarni Nosozligini Tuzatish Muvaffaqiyatsiz Bo'ldi {#debug-failed-sponsored-transactions}

Odatdagi rad etish sabablar odatda bitta yetishmayotgan sozlash bosqichiga ishora qiladi:

|Xato matni|Nimani tekshirish|
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` hali ham tugunda `false`. |
| `fee sponsor is not authorized` |Foydalanuvchida bu homiy uchun `CanUseFeeSponsor` mavjud emas.|
| `fee asset ... is missing` |Homiy sozlangan XOR to'lov aktiviga ega emas.|
| `fee balance ... is insufficient` |Homiyning XOR balansini to‘ldiring.|
| `fee exceeds sponsor_max_fee` |Tranzaksiya hajmini/gazni oshiring `sponsor_max_fee` yoki kamaytiring.|
| `invalid nexus fee asset id` |`nexus.fees.fee_asset_id` yoki XOR aktiv aliasini tuzating.|

2-shablonni tuzatishda, har ikkala balansni tekshiring:

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

## Homiyni boshqaring {#operate-the-sponsor}

Sponsorni xazina hisobvaragʻi sifatida ko‘ring:

- testnet, staging va mainnet uchun alohida homiy kalitlarini saqlang
- sponsor XOR balansi qabul qilish minimal chegarasiga yetishidan oldin ogohlantirish
- trafik tasniflangandan so‘ng nolga teng bo‘lmagan `sponsor_max_fee` chegarani o‘rnatish
- ilovangizda yoki eshikda homiylik qilinadigan yozuvlarni tezlik chegarasini belgilash
- foydalanuvchilar dataspace'dan chiqqanda `CanUseFeeSponsor` ni bekor qilmoq
- foydalanuvchi tranzaksiyalari kriptografik xeshlarini, mahalliy-token to‘lovlarini va homiy XOR debetlarini uyg‘unlashtirish

Foydalanuvchi uchun homiylikni bekor qilish:

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

## Tegishli sahifalar {#related-pages}

- [SORA Nexus Dataspaces ga ulaning](/uz/get-started/sora-nexus-dataspaces.md)
- [Iroha 3 ni CLI orqali boshqaring](/uz/get-started/operate-iroha-via-cli.md)
- [Aktivlar](/uz/blockchain/assets.md)
- [Ruxsatlar](/uz/blockchain/permissions.md)
- [Ruxsat tokenlari](/uz/reference/permissions.md)
