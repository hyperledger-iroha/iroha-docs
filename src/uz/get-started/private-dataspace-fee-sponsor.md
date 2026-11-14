---
translation_locale: uz
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 2ca4fc00709839879fe9cb7ea5e5f697505e5e25d4e5a6cd0bd18d406f6e2846
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Xususiy ma’lumotlar makoni komissiyalariga homiylik qiling {#sponsor-fees-for-a-private-data-space}

SORA Nexus komissiya homiysi dasturi xususiy ma’lumotlar makoniga yo‘naltirilgan mos tranzaksiyalarning global bajarish komissiyalarini to‘lay oladi. Foydalanuvchi baribir to‘liq tranzaksiyani imzolaydi. Uning tiplangan `FeePaymentIntent` maydoni aniq homiy dasturi va o‘zgarmas reviziyasini, kerak bo‘lganda gas chegarasini hamda eng yuqori undiriladigan to‘lovlarni tanlaydi.

Ma’lumotlar makoni katalog yozuvi mustaqil imzolangan ildizni yaratmaydi. Mustaqil ma’lumotlar makoni ildizining o‘z commit qilingan komissiya valyutasi va siyosati bor; ochiq homiy omborlari uning xususiy ildiz komissiyalariga vakolat bera olmaydi. Homiylikni loyihalashdan oldin bajarish ildizini belgilang.

## 1. Commit qilingan komissiya siyosatini belgilang {#_1-establish-the-committed-fee-policy}

Imzolangan genezis `RootFeePolicy`ni saqlovchi bitta `root_fees_v1` maxsus parametrini yaratadi. U komissiya valyutasi, komissiya manzili, homiy saqlash hisobi, talab istisnolari va stavkalarni bog‘laydi. Har bir odatiy blok va komissiya hisobi o‘zi olgan, zanjirda qayd etilgan siyosatdan foydalanadi. Stavkalar, komissiya manzili va talab istisnolariga kiritilgan vakolatli o‘zgarishlar keyingi blokdan qo‘llanadi; komissiya valyutasi va homiy saqlash hisobi birinchi blokdan keyin o‘zgarishi mumkin emas.

Global bajarishda nativ komissiya imzolangan tarmoqning aniq XOR valyutasini yoqadi. Bu valyutani homiy dasturining ombori ta’minlaydi. Tugun sozlamalari va tranzaksiya metadatasi to‘lovchini tanlamaydi va homiylikni faollashtirmaydi.

Tarmoqning kanonik valyuta va hisob identifikatorlaridan foydalaning. Taxallus yechimi commit qilingan valyuta, saqlash yoki komissiya manzili identifikatorlarini boshqa tomonga yo‘naltirmasligi kerak.

## 2. Homiy dasturini yarating va moliyalashtiring {#_2-create-and-fund-a-sponsor-program}

Dastur ID si `<canonical-sponsor-account>/<program-name>` shaklida bo‘ladi. Uni joriy SDK va ma’lumotlar modeli taqdim etgan tiplangan ko‘rsatmalar bilan yarating:

| Ko‘rsatma | Maqsad |
| --- | --- |
| `CreateFeeSponsorProgram` | Majburiy to‘lov oluvchi hisobi bilan tayyorlangan dastur yaratish. |
| `StageFeeSponsorProgramRevision` | Moslik, amallar va byudjetning bitta o‘zgarmas siyosatini belgilash. |
| `EnrollFeeSponsorBeneficiary` | Mos benefitsiarni zanjirda qayd etish. |
| `FundFeeSponsorProgram` | Aktivlarni saqlashga o‘tkazish va aniq dastur omboriga kiritish. |
| `ActivateFeeSponsorProgramRevision` | Tayyorlangan reviziyaning eng erta faollashish balandligini rejalash. |

Dastur boshqaruviga homiy yoki aniq vakolat berilgan menejer ruxsat beradi. Mablag‘ yechish homiyning o‘zini talab qiladi va dastur to‘xtatilgan yoki yopilayotgan paytda mablag‘ni faqat dasturda qayd etilgan to‘lov oluvchi hisobiga qaytaradi.

Har bir reviziya quyidagilarni belgilaydi:

- aniq ro‘yxatdan o‘tish yoki ro‘yxatdan o‘tish bilan birga marshrutning ruxsat etilgan standart mosligi;
- aniq nativ ko‘rsatma wire ID lari yoki kontrakt manzillari, kod xeshlari va kirish nuqtalari bo‘yicha ruxsat va taqiq qoidalari;
- har bir aktiv uchun tranzaksiya, blok, dastur epochi va benefitsiar epochi chegaralari;
- zaxiraning quyi chegarasi va deterministik epoch uzunligi.

Taqiq qoidasi ruxsat qoidasidan ustun. Ma’lumotlar makonining `fee_sponsor_program_id` maydoni faqat faol reviziya ruxsat etsa marshrutning standart mosligini beradi; tranzaksiya baribir aniq dastur va reviziyasini ko‘rsatishi kerak. Oldingi reviziyaning hali ochiq ajratmalari muddati tugaguncha faollashish kechiktirilishi mumkin.

Homiy ombori aktivlari `Global` balans siyosatidan foydalanishi kerak. Faqat homiyning oddiy hisobini moliyalashtirish ajratilgan dastur omborini moliyalashtirmaydi; bir dastur boshqa dastur balansini sarflay olmaydi.

## 3. Aniq tranzaksiya komissiyasini hisoblatib, imzolang va yuboring {#_3-quote-sign-and-submit-the-exact-transaction}

SDK integratsiyasi quyidagi bosqichlarni bajaradi:

1. Vakolat, bajariladigan mazmun, vaqt belgilari, nonce, metadata, homiy dasturining aniq reviziyasi va zarur gas chegarasi bilan imzolanmagan `TransactionPayload` yarating. Maksimal yechimlar dastlab bo‘sh bo‘lishi mumkin.
2. `{"payload": <payload>}` bilan `POST /v1/fees/quote` so‘rovini hisob orqali imzolang. So‘rov imzolovchisi tranzaksiya vakolati bo‘lishi kerak.
3. Kuzatilgan balandlik, yechilgan ma’lumotlar makoni marshruti, komissiya qismlari, mablag‘ yechish manbasi va homiy sig‘imini tekshiring. Javob tanlangan to‘lovchi, reviziya va gas chegarasini saqlashini tasdiqlang.
4. Faqat `payload.fee_payment`ni tavsiya qilingan niyat bilan almashtiring, so‘ng ayni foydali yukni imzolang va yuboring.
5. Tranzaksiyani holat belgilagan `Applied` yakuniyligigacha kuzating va haqiqiy homiy dasturi, reviziya hamda yechimni o‘z ichiga olgan kvitansiyasini saqlang.

Komissiya hisobi reyestrni kuzatadi; sig‘imni band qilmaydi. Navbat qabuli moslikni qayta tekshiradi va imzolangan maksimumlarni zaxiralaydi. Homiy rad etsa, tranzaksiya rad etiladi va foydalanuvchidan haq olishga o‘tilmaydi.

CLI ayni komissiya manbasini ochiq ko‘rsatadi. Masalan, dastur aynan shu aktiv o‘tkazmasiga ruxsat bergach va hisob mos bo‘lgach:

```bash
iroha --config ./user.client.toml \
  --fee-payer sponsor \
  --fee-program '<SPONSOR_CANONICAL_I105>/team-payments' \
  --fee-program-revision 1 \
  ledger asset transfer \
  --definition '<ASSET_DEFINITION_BASE58>' \
  --account '<USER_CANONICAL_I105>' \
  --to '<RECIPIENT_CANONICAL_I105>' \
  --quantity 1
```

Tarmog‘ingizning faol reviziyasi va aniq identifikatorlaridan foydalaning. Foydalanuvchi sozlamasida faqat shu foydalanuvchining imzolovchisi bor; mos homiylik tranzaksiyasini yuborish uchun homiyning maxfiy kaliti kerak emas.

## 4. Foydalanuvchi ilova komissiyasini to‘lashini belgilang {#_4-decide-whether-the-user-pays-an-application-fee}

Homiy global komissiyalarni qoplashi, ilova esa foydalanuvchidan hech narsa olmasligi mumkin. Ilova mahalliy token yig‘sa, bu o‘tkazma yoki kontrakt qoidasini foydalanuvchi imzolagan bajariladigan mazmunda aniq yozing. Har bir amalni homiy reviziyasi siyosatiga kiriting va butun foydali yuk komissiyasi hisobini tekshiring. Tarmoq komissiyasi niyatidan ilova tokeni o‘tkazilishini taxmin qilmang.

## Rad etilishni aniqlang {#diagnose-a-refusal}

Tugun qaytargan barqaror komissiya kodi va tuzatish tafsilotlaridan foydalaning:

| Kod | Tekshiriladigan narsa |
| --- | --- |
| `program_not_found` | Dasturning aniq kanonik identifikatori. |
| `revision_not_active`, `program_not_active` | Reviziya faollashishi va dastur hayotiy davri. |
| `beneficiary_not_eligible` | Ro‘yxatdan o‘tish yoki marshrutning ruxsat etilgan standart mosligi. |
| `operation_not_allowed`, `operation_denied` | Har bir aniq imzolangan amal va taqiq qoidasi. |
| `invalid_gas_limit`, `signed_limit_exceeded` | Yangi komissiya hisobiga nisbatan gas chegarasi va imzolangan maksimumlar. |
| `vault_insufficient` | Shu dasturning aniq valyuta omboridagi moliyalashtirilgan balans. |
| Byudjet tugashi kodlari | Tranzaksiya, blok, dastur epochi va benefitsiar epochi sig‘imi. |

Natijasi noaniq yuborishni tekshirganda asl tranzaksiya xeshi va komissiya rad etilishi tafsilotlarini saqlang. O‘rniga yangi tranzaksiya yaratishdan oldin holatini tasdiqlang.

## Belgilangan manbalar {#pinned-sources}

- [Komissiya siyosati, dastur hayotiy davri va hisoblash protokoli](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/nexus_fee_model.md)
- [Homiy dasturining tiplangan ko‘rsatmalari](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/isi/nexus.rs)
- [CLI komissiya manbasi flaglari va aktiv o‘tkazmasi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)
- [Ma’lumotlar makonini sozlash](/uz/get-started/sora-nexus-dataspaces.md)
