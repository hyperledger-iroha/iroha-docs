---
translation_locale: uz
translation_source: /get-started/atomic-private-settlement.md
translation_source_hash: d4c2c1a4e29e0352ac20be5320f79a2686527d55a19d65a6154aedcd63fa447e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Atomik Shaxsiy Cross-Dataspace moliyaviy tranzaksiya hisob-kitobini amalga oshiring {#run-atomic-private-cross-dataspace-settlement}

`AtomicPrivateSettlementV1` har bir 2 dan 255 gacha bo‘lgan SORA Nexus ma’lumotlar makonidagi maxfiy moliyaviy o‘tkazma qismini muvofiqlashtiradi va har bir moliyaviy o‘tkazma qismini yagona global holatda yakunlaydi tranzaksiya. Rad etilgan, muddati o'tgan yoki bekor qilingan paket moliyaviy o'tkazma qismidan foydalanmaydi. Shaffof Native AMX DvP/PvP alohida protokol yo'li sifatida qoladi.

::: warning Chiqarish holati
Ushbu xususiyat boshqariladi, standart bo‘yicha o‘chirib qo‘yilgan va hali ishlab chiqarishga tayyor emas. E’lon qilingan funksionallik mavjud bo‘lguncha uni haqiqiy CBDC qiymat uchun yoqmang, maxfiylik, xato, ishlash, qayta ishlab chiqariladigan qurilish, mustaqil kriptografik ko‘rib chiqish va artefakt nashr etish qoidalari aynan shu reliz uchun barchasi muvaffaqiyatli o‘tgan.
:::

## Protokol nimani yashiradi {#what-the-protocol-hides}

Har bir moliyaviy o'tkazma qismi ikki kirishli, uch chiqishli maxfiy yozuv isboti bilan ishlaydi. Kengash tasdiqlovchilari isbotni va noaniq holat o'tishini tekshiradilar; ular ochiq matn partiyalarini, aktivni, miqdorni, eslatmani yoki biznes natijasini olmaydilar. Avtorize qilingan mahalliy auditor quvurlangan audit kapsulasini shifrdan chiqaradi, uning mazmunini tekshiradi va maqsadga ajratilgan tasdiqni imzolaydi. Standart siyosat boshqariladigan auditorlar to‘plamidan bitta tasdiqni qabul qiladi.

Ommaviy konteyner tranzaksiyasi va protokol natijalari yozuvi ataylab quyidagilarni oshkor qiladi:

- tarmoq va paket identifikatorlari
- ishtirokchi ma’lumotlar makoni yo‘llari va ishtirokchi soni
- vaqt va muddati balandliklari
- barqaror yashirin pul identifikatorlari, ildizlar, nullifikatorlar, majburiyatlar va o‘zgarmas shifrmatn slotlari
- qo'mita vakolat prinsiplari va aniq 3-dan 4 mavjudlik, tayyorlash va protokolni yakunlash sertifikatlari
- sponsor, ochiq tarmoq to'lovi va terminal holati

Bu kontent maxfiyligi, trafik oqimi anonimligi emas. Vaqt, ishtirokchilar soni, dataspace identifikatori va barqaror havza faoliyati ommaviy bo'lib qoladi. Faqat bitta CBDC ni joylashtirgan dataspace ham, hech qanday haqiqiy aktiv identifikatori e'lon qilinmasa ham, aktivni marshrutdan aniqlash mumkin bo'lishi mumkin.

## Joylashtirish talableri {#deployment-requirements}

Faollashtirishdan oldin, operatorlarga quyidagilarning barchasi kerak:

1. har bir ishtirokchi ma’lumotlar makoni uchun alohida BLS konsensus kalitlari va egalik dalillariga ega aynan to‘rtta tasdiqlovchi
2. har bir balandlik uchun majburiy Sumeragi DA/RBC yoqilgan
3. har bir ma'lumot maydonida boshqariladigan maxfiy moliyaviy tranzaksiya yechimi protokoli guruhi va dastlabki ildiz
4. faol V1 shaxsiy eslatma imkoniyati va alohida moliyaviy tranzaksiya yakunlash dalili profili
5. hech bo‘lmaganda bitta boshqariladigan mahalliy `PrivateSettlementAuditPolicyV1`, jumladan alohida auditor imzolash va gibrid shifrlash kalitlari, kalit davri, balandlik haqiqiyligi va tasdiqlash mezoni
6. sozlangan saqlash muddati uchun yetarli shaxsiy yordamchi yozuvlar saqlash
7. yakuniy jamoat konteyner tranzaksiyasini yubora oladigan neytral homiy hisobida

Auditor validatorni ham boshqarishi mumkin, ammo konsensus, auditor imzosi va auditor shifrlashi uchun alohida kalitlardan foydalanishi kerak. Foydalanishdan chiqarilgan deshifrlash kalitlarini me’yoriy saqlash muddati davomida saqlang yoki ularni chiqarishdan oldin kapsulalarni qayta o‘rash jarayonini boshqaring va sinang.

To‘rtta tasdiqlovchi vakolat hisobi davlat tomonidan mustahkamlangan, mijoz tomonidan ta’minlanmaydi. Manifestning `authority_context_height` nuqtasida har bir tasdiqlovchi aniq tartiblangan yo‘l/ma’lumotlar makoni ro‘yxati va faol ijro yo‘li inkarnatsiyasini konsensus holatidan hal qiladi, hal qilingan balandlik mos kelishini talab qiladi, va to'rtta BLS kalitlari va egalik dalillarini tekshiradi. Yuklash, tayyorlash va yakuniy protokol natijalarini yozib olish barchasi shu tarixiy ruxsat olish printsipidan foydalanadi.

## Qabulni sozlash {#configure-admission}

Barcha ishlab chiqarish xatti-harakatlari tugun konfiguratsiyasidan kelib chiqadi. Muhit o'zgaruvchilari bu yo'lni faollayolmaydi. Yetkazib berilgan standart `enabled = false`; funksiyani o‘chirib qo‘yish maxsus hisob-kitob konfiguratsiyasini talab qilmaydi.

Boshqaruv zarur imkoniyatni ro‘yxatga olgach va yetarlicha ogohlantirish bilan faollashtirish balandligini tanlagach, har bir tegishli tugunni izchil sozlang:

```toml
[nexus.atomic_private_settlement]
enabled = true
activation_height = 500000
minimum_activation_notice_blocks = 7200
proof_profile_version = 1
max_participants = 255
max_expiry_blocks = 7200
audit_timeout_blocks = 1200
prepare_timeout_blocks = 1200
commit_timeout_blocks = 1200
capsule_padding_classes_bytes = [4096, 16384, 65536, 262144]
max_proof_bytes = 8388608
max_capsule_bytes = 1048576
max_carrier_bytes = 4194304
sidecar_retention_blocks = 1000000
sidecar_max_records = 256
sidecar_max_total_bytes = 3221225472
default_min_auditor_approvals = 1
permitted_policy_versions = [1]
```

Misolda jo‘natilgan V1 cheklovlari ishlatilgan, bu esa ish faoliyati bo‘yicha tavsiya emas. Saqlash, isbot, kapsula, konteyner tranzaksiya va kechikish ma’lumotlar konteynerlarini o‘lchang Amaliy chegaralarni tanlashdan oldin mo‘ljallangan apparatni hisobga oling. Uch fazali vaqt tugashlari `max_expiry_blocks` ichida bo‘lishi kerak, va qo‘shimcha yozuvlarni saqlash vaqti kamida shu yakunlanish oynasi bilan bir xil bo‘lishi kerak.

`max_capsule_bytes` butun `PrivateSettlementAuditCapsuleV1`ning kanonik Norito kodlashini cheklaydi: AAD, kriptografik nonce qiymati, shifrlangan matn, vektor ramkalash, auditor identifikatorlari va har bir o'ralgan-DEK satr. Bu faqat shifrlangan matnga oid cheklov emas. Har bir sozlangan padding sinfi kamida `default_min_auditor_approvals` auditorlar uchun konservativ butun kapsula ma’lumot konteyneriga mos kelishi kerak. Torii shuningdek, yangi ... ni rad etadi qabul qilingan siyosat, uning `min_approvals` boshqariladigan minimal darajadan past bo‘lsa, va har qanday haqiqiy kapsulani rad etadi, agar uning to‘liq kanonik kodlash juda katta bo‘lsa.

`max_carrier_bytes` faqat sertifikatlangan paketni emas, balki to‘liq kanonik homiy imzolangan tranzaksiyani cheklaydi. Hisobga olingan son ro‘yxatga olingan ko‘rsatmani o‘z ichiga oladi freyming, tranzaksiya tasdiqlash asosiy elementi va metadata, to'lov niyati va imzo. Oddiy tarmoq tranzaksiya cheklovlari mustaqil yuqori chegarasi sifatida hanuz amal qilmoqda.

Faollashtirish faqat boshqarilayotgan imkoniyat faol bo‘lmaganda muvaffaqiyatsiz bo‘ladi, uning holati va faollashtirish balandliklari ogohlantirish davriga javob beradi, yig‘ilgan isbot profili V1 ga mos keladi va zanjirdagi protokol ma’lumotlari guruhi hamda audit yozuvlari yangilangan bo‘ladi. Faoliyat bayrog‘ini yoqish o‘zi yetarli emas.

## moliyaviy tranzaksiya to'lovini yakunlash ish oqimi {#settlement-workflow}

Mijoz isbotlar va shifrlangan kapsulalarni mahalliy ravishda yaratadi. Maxfiy guvohlar mahalliy hamyonda yoki mahalliy ishchida qolishi kerak; ularni ilova jurnallariga, Python ob’ektlarga, HTTP so‘rovlarga yoki barqaror muvofiqlashtirish yozuvlariga seriyalashtirmang.

Kapsula va har bir auditor uchun DEK o‘ramining autentifikatsiyalangan ma’lumotlari aniq holatga biriktirilgan qo‘mita dayjesti va `authority_context_height` qiymatini, shuningdek tarmoq, yo‘nalish/inkarnatsiya, to‘plam, bosqich, siyosat, kalit davri va ochiq matn majburiyatini o‘z ichiga oladi. O‘ralgan kalitni boshqa tarkibga yoki vakolatning boshqa tarixiy kontekstiga ko‘chirib bo‘lmaydi.

Har bir alohida protokol-standart moliyaviy o'tkazma qismi uchun, kordinator keyin ushbu ketma-ketlikni bajaradi:

1. Vaqtinchalik shifrlangan materialni barcha to'rtta validatorga yuklang va kanonikga mos aniq 3-dan-4 mavjudlik sertifikatini oling.
2. Vakolatli auditorni yuboring va uning kapsulasini olib, shifrlashni ochsin, ommaviy bog‘lamalarni qayta hisoblasin, mahalliy siyosatni qo‘llasin va tasdiqni topshirsin.
3. To‘rtta tasdiqlovchidan tayyorlash ovozini so‘rang. Har bir tasdiqlovchi ovoz berishdan oldin deltani mustaqil tekshiradi va barqaror saqlaydi. Har bir tayyorlagan javob beruvchida kanonik 3-of-4 Tayyorlash sertifikatini saqlang.
4. Har bir moliyaviy o'tkazma qismi Prepare sertifikatiga ega bo'lgandan so'ng, o'zgarmas to'liq Prepare to'sig'ini yarating. Bitta protokol-standart 3-of-4 protokol yakunlash sertifikatlarini so'rang va saqlang. Agar koordinatchi qayta ishga tushsa, ishtirokchi tugunlardan ularning mahalliy barqaror Prepare va konsensus yakunlash sertifikatlarini so‘rang, bitta protokol-standartiga mos keluvchi kvorum-sinedir sertifikatni tanlang va davom etishdan oldin uni yana tarqating; hech qachon sertifikatni autentifikatsiya qilinmagan mahalliy keshdan qayta tuzmang.
5. Manifest homiysi tomonidan bitta global konteyner tranzaksiyasini imzolab taqdim eting. Konteyner tranzaksiyasi bitta `FinalizeAtomicPrivateSettlementV1` ko‘rsatmasini va aniq to‘liq sertifikatlangan paketni o‘z ichiga oladi. Koordinator va WSV oldin uchish chorasi ro‘yxatdan o‘tgan ko‘rsatmalar tuzilishini o‘z ichiga olgan to‘liq tur-erased yakuniylashtirish ko‘rsatmasini o‘lchaydi. Torii va asosiy bir martalik konteyner tranzaksiya bog‘lamasi aniq kanonik homiy tomonidan imzolangan tranzaksiya ustidan `max_carrier_bytes` ni amalga oshiradi, shu jumladan vakolat hisobi, metadata, to‘lov niyati va imzo. Torii konteyner tranzaksiyasini uning vakolat hisobi konteksti oldidan, oxirgi kirish balandligidan keyin yoki yakuniy muddati orqali yetishi mumkin bo‘lgan paytdan keyin, yoki boshqariladigan muddatdan oshib ketganda rad etadi.
6. Jamoaviy paket holati va protokol natijasi yozuvini global yakuniylikka yetguncha so‘rang. Mahalliy yordamchi yozuv holatini u o‘sha o‘zgarmas global yakuniy yozuv bilan moslashguncha vaqtinchalik deb hisoblang.

Rust mijoz ushbu oqimni `certify_and_upload_private_settlement_legs_v1`, `prepare_private_settlement_bundle_v1`, `commit_private_settlement_bundle_v1` va `submit_private_settlement_bundle_v1` kabi usullar orqali namoyish etadi. Qayta ishga tushirishga chidamli muvofiqlashtirish `recover_or_prepare_private_settlement_bundle_v1` va `recover_or_commit_private_settlement_bundle_v1` dan foydalanadi. Qo‘mita va auditorning texnik chaqiriqlari aniq rol kredisentalarini talab qiladi; ular oddiy hisobning kriptografik imzosini qayta ishlatmaydi.

## Auditor siyosatini xavfsiz aylantiring {#rotate-an-auditor-policy-safely}

Maxfiylik boshqaruvi ruxsat bergan `RotatePrivateSettlementPoolPolicyV1` ko‘rsatmasidan foydalaning. U joriy boshqaruv dayjestini aynan ko‘rsatishi, ayni yo‘nalish, protokol guruhi va aktivni bog‘lash majburiyatini saqlashi, boshqaruv tahririni bittaga oshirishi, albatta yangiroq kalit davri hamda boshqa siyosat va boshqaruv dayjestlaridan foydalanishi va aylantirishni o‘z ichiga olgan blokda faollashishi kerak. Protokol guruhi chegarasi, ildizlar, nullifikatorlar, natijalar, takroriy ijro to‘plamlari va yakunlangan kvitansiyalar saqlanadi. Aylantirish faollashadigan blok balandligida ayni yo‘nalish yoki protokol guruhiga tegishli kvitansiyani kiritmang; ko‘rsatma bu chegarani rad etadi.

Jamoat protokoli ma'lumotlari guruhi prognozi to'liq bekor qilingan siyosat-tahrir qatorini saqlaydi. Shuning uchun, aylanishdan oldin yakunlangan protokol natijalari yozuvi qayta ishga tushirilgandan keyin ham amal qiladi, va aynan shu protokol natijalari yozuvini qayta ijro etish idempotent bo'lib qoladi. Avlod tugallanmagan ishni ruxsat bermaydi: faollashtirish chegarasini kesib o'tadigan har qanday eski siyosat to'plami global holat o'zgarmasdan oldin yopiq bo'lib qoladi. Saqlangan kapsulalarni ochish uchun kerak bo'lgan barcha eski shifrlash kalitlarini saqlang yoki uni yo'q qilishdan oldin boshqariladigan va sinovdan o'tgan kapsula qayta o'ramini tugating.

## Torii marshrut oilasi {#torii-route-family}

Bu marshrutlar bitta protokol-standart Norito so‘rov va javob obyektlaridan foydalanadi. Autentifikatsiyalangan va cheklangan javoblar maxfiy `no-store` keshlash xatti-harakatidan foydalanadi.

|Operatsiya|Usul va yo'l|Direktor|
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
|Moliyaviy o'tkazmalar qismini yuklash| `POST /v1/nexus/private-settlements/legs`                                  |kanonik hisob imzosi|
|Mavjudlik ulushi| `POST /v1/nexus/private-settlements/legs/availability-shares`              |kanonik hisob imzosi|
|Votaga tayyorlaning| `POST /v1/nexus/private-settlements/phases/prepare-votes`                  |kanonik hisob imzosi|
|yakuniy bosqich ovozi| `POST /v1/nexus/private-settlements/phases/commit-votes`                   |kanonik hisob imzosi|
|Uzluksiz faza QC| `POST /v1/nexus/private-settlements/phases/certificates`                   |kanonik hisob imzosi|
|Qayta tiklash bosqichi QCs| `GET /v1/nexus/private-settlements/legs/{payload_digest}/phase-certificates` |manifest homiy|
|moliyaviy o'tkazma qismi holati| `GET /v1/nexus/private-settlements/legs/{payload_digest}/status`           |kanonik hisob imzosi|
|Qo‘mita isboti| `GET /v1/nexus/private-settlements/legs/{payload_digest}/committee-proof`  |aniq ro'yxat tekshirgichi|
|Audit kapsula| `GET /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule`    |nazorat qilinadigan auditor|
|Auditorning tasdiqlashi| `POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-approvals` |nazorat qilinadigan auditor|
|Yakunlash/to'xtatish| `POST /v1/nexus/private-settlements/bundles`                               |manifest homiy|
|Paket holati| `GET /v1/nexus/private-settlements/bundles/{bundle_id}`                    |jamoat|
|protokol natijasi yozuvi yoki bekor qilish| `GET /v1/nexus/private-settlements/bundles/{bundle_id}/receipt`            |jamoat|

Jamoat holati va protokol natijalari yozuvi APIs faqat hujjatlashtirilgan jamoat maydonlarini ochib beradi. Xususan, oddiy moliyaviy o'tkazmalar qismi holati tasdiqlash sonlarini yoki boshqariladigan auditor chegarasini oshkor qilmaydi. Cheklangan o‘qishlar, yo‘qolgan, ruxsatsiz va saqlash muddati tugagan materiallarni xuddi shu mavjud bo‘lmagan javob sinfiga qasddan birlashtiradi. Jo‘natish yo‘li aniq bitta to‘g‘ridan-to‘g‘ri homiy tomonidan imzolanilgan yakunlash yoki bekor qilish ko‘rsatmasini qabul qiladi. Uning `202` javobi faqat paket IDsi, kuzatilgan qabul balandligi va konteyner tranzaksiyasi kriptografik xashini o'z ichiga oladi; u navbatdagi bekor qilish allaqachon yakunlanganligini da'vo qilmaydi. SDKs ikkala identifikatorning ham kanonikli tekshiruv summasiga ega Norito `Hash` JSON literal bo‘lishini va balandlikning aniq belgisiz 64-bitli butun son bo‘lishini talab qiladi; yo‘q, qo‘shimcha, noto‘g‘ri yozilgan, kanonikiga mos bo‘lmagan, tekshiruv yig‘indisi noto‘g‘ri, manfiy, manfiy-nol, kasr yoki ortiqcha maydonlar yopiq tarzda xato beradi. Avtorizatsiyalangan terminal holati uchun paket holati yoki protokol natijalari yozuvidan foydalaning. Holat kodi ham aniq: bu konteyner tranzaksiya-qabul qilish yo'li `202` talab qiladi, holbuki har bir boshqa xususiy kelishuv V1 muvaffaqiyatli javob `200` talab qiladi. Mijozlar alternativ muvaffaqiyatli `2xx` kodlarini shartnoma sirpanishi sifatida rad etadilar, mijoz xatoliklari orqali kutilmagan javob tanasini aks ettirmasdan. Ular faqat server rad javob kodini ochib beradi u `[A-Za-z0-9_.:-]{1,128}` bilan mos kelganda va javob parseri/tekshirish sabablarini bekor qilib, tana mazmuni yoki hujumchi tanlagan JSON maydon nomlarining sababni biladigan loglar orqali qayta paydo bo‘lishining oldini oladi.

## Muvaffaqiyatsizlik va tiklanish {#failure-and-recovery}

Auditor tasdiqlari yo‘q yoki eskirgan bo‘lsa, tasdiqlovchi ovozlari uchtadan kam bo‘lsa, ildizlar yoxud davrlar noto‘g‘ri, nullifierlar takrorlangan, isbotlar yoki kapsulalar almashtirilgan, bosqich tartibi noaniq, to‘plam muddati tugagan yoki kompensatsiya shartlari mos kelmasa, jarayon global o‘zgarishdan oldin to‘xtaydi. Faqat kelishuvni yakunlash sertifikatlari xususiy holatni hech qachon o‘zgartirmaydi.

Validatorlar yordamchi yozuvlar, tayyorlangan o‘zgarishlar va bosqich sertifikatlarini tasdiqlashdan oldin fsync qiladi. Qayta ishga tushganda ular kanonik bardoshli yozuvlardan rezervatsiyalarni qayta tiklaydi, so‘ngra o‘zgarmas global protokol natija yozuvlari, bekor qilish belgilar yoki muddati o‘tgan yozuvlarni uyg‘unlashtiradi. Nazorat qilinadigan muvofiqlashtiruvchi, muvofiqlashtiriladigan terminal nomzodi bo'lmasa ham, sinxron ravishda kuzatilgan vakolatli balandlikda terminalni saqlashni qisqartirishni amalga oshiradi. va u kesish xatosida yopiladi. Faqat vakolatli global terminal yozuvi sahnalashtirilgan qulflarni chiqaradi. Xuddi shu yakunlangan protokol natijasi yozuvini qayta ijro etish idempotent hisoblanadi; qarama-qarshi qayta ijro deterministic tarzda muvaffaqiyatsiz bo‘ladi.

Bandlik identifikatori to‘liq yo‘nalishni o‘z ichiga oladi. Protokol ma’lumotlar guruhi boshliqlari `(route, pool_id, epoch, root)` dan foydalanadi, nullifikatorlar `(route, pool_id, nullifier)` dan foydalanadi, va chiqishlar `(route, pool_id, commitment)` dan foydalanadi. Boshqa yo‘nalishda teng shaffof bo‘lmagan qiymatlar mustaqildir; aniq yo‘nalish to‘qnashuvi qayta ishga tushirishda qulflangan holda qoladi.

Operatsion ogohlantirishlar faqat shaffof bo'lmagan paket, marshrut, faza, kriptografik xulosalar qiymati, balandlik va sabab-sinf maydonlaridan foydalanishi kerak. Hech qachon loglarda, voqealarda, metrikalar yorliqlarida yoki izlash bo‘limlarida shifrlangan kapsulalarni, hisob yoki aktiv identifikatorlarini, miqdorlarni, eslatmalarni, ko‘rish ma’lumotlarini, guvoh dalillarini yoki parser yukini joylashtirmang.

## Haqiqiy qiymatdan oldin malaka {#qualification-before-real-value}

Siz joylashtirmoqchi bo‘lgan aniq qurilish va sozlamalar uchun, quyidagilarni qamrab olgan dalillarni arxivlang:

- raqobatbardosh isbot, kapsula, siyosat, kalit aylantirish, qaytarib to‘lash va qayta ijro etish holatlari
- 2, 3, 4, 8 va 16 ma’lumot makoni uchun haqiqiy to‘rtta tasdiqlovchili jarayonlar; tasdiqlovchi va muvofiqlashtiruvchi qayta ishga tushishlari, autentifikatsiyalangan 5%, 10% va 20% xabar yo‘qotilishi, bosqich bo‘linishi, tiklash va barqarorlik chegarasi xatolarini qamrab oladi
- kanarey va differensial oqim tahlili Torii, P2P bloklari, Kura, vaqt nuqtasidagi ma’lumot ko‘rinishlari, so‘rovlar, voqealar, jurnallar va telemetriya bo‘ylab
- haqiqiy tarmoq ishtirokchisi soniga kamida beshta issiqroq mashq va o‘n o‘n o‘n o‘lchangan yig‘ma, p50, p95, p99, ishonch intervallari, resurslar, trafig, dalil va protokol natijalari yozuvlari hajmlari bilan va nazorat sifatida shaffof AMX
- qatʼiy ish joyi testlari, lint va format tekshiruvlari, tasodifiy urugʻlar, soak, takrorlanadigan yigʻilishlar, SBOMs, va imzoli artefakt kriptografik xeshlar
- ikkala rasmiy qatlam: 3/255 bosqich soni simmetriyasi tekshiruvlari hamda aniq to‘rt validatorli, qo‘mita bo‘yicha indekslangan N=2 validatorga yo‘naltirilgan va to‘liq chegaralangan xato, maqoladagi asosiy N=3 xato, N=4 xatosiz hamda N=3 muddat tugashi/qayta ijro konfiguratsiyalari; xato byudjetlari har bir qo‘mita uchun mustaqil
- isbot munosabati, sun’iy-bo‘sh joy tanlagichlari, aktiv va kapsula bog‘lanishlari, qaytarib to‘lash munosabati, kriptografiya va kross-datavoya holat mashinasi mustaqil ko‘rib chiqilishi

Xom va tozalangan dalillarni, tahdid modelini, protokol argumentini, cheklovlarni, manba-kodining o‘zgartirish identifikatorlarini, apparat tavsifini va audit hisobotlarini chop eting o‘zgarmas DOI-asoslangan artefakt. Faqat ombor testlari xususiyatni ishlab chiqarishga mo‘ljallangan CBDC moliyaviy tranzaksiya hisob-kitob tizimiga aylantirmaydi.

Oxirgi toza Iroha chekautdan, chiqish manba inventarini yarating va uni ushbu chekautdan tashqaridagi oldindan mavjud bo‘lgan paket ildiziga muhrlang:

```sh
python3 scripts/private_settlement_source_evidence.py \
  --repository-root . \
  --bundle-root /absolute/path/to/release-bundle
```

Ishlab chiqaruvchi sahnalashtirilgan, sahnalashtirilmagan, izsiz yoki birlashtirilmagan fayllarda va yozib olish davomida har qanday manba o‘zgarishida ishlamay qoladi. U xom manba-kod versiyasi obyekti, kanonik Git daraxti inventari, aniq ikkilamchi yo‘l ro‘yxati, deterministik manba muhrini va `Cargo.lock` saqlaydi; yakuniy reliz manifestida uning JSON natijasidagi har bir artefakt deklaratsiyasini o‘z ichiga oladi. Bu yakuniy DOI-bundle tekshiruvchisini yoki har qanday tashqi reliz eshigini bekor qilmaydi.

Manba muhrini ko'chma va yopiq bo'lib ishlaydi: ishlab chiqaruvchi va yakuniy tekshiruvchi barcha arxivlangan symlink grafini yakuniy hal qiladi, shunda ildizda ko'rinadigan, lekin boshqa link orqali chiqadigan, tsikl, `.git` o‘tish yoki Windows uslubidagi nishon bo‘lgan linklar yaratilishidan oldin rad etiladi. Tuzilgan manba va darvoza hisobotlari faqat kriptografik xulosa qiymati va uzunligi chiqarish manifestiga mos keladigan cheklangan barqaror fayllardan tahlil qilinadi, va har bir manba yuklanishi turi aniq bir marta uchrashishi kerak.

Har bir xom xato yugurishi va kechikish namunasi to‘liq chiqarilgan manba-kodining tahririni, bitta tuzilgan pinli apparat tavsifining SHA-256 va uning aniq ishtirokchi-soni konfiguratsiyasining SHA-256 ni bog‘lashi kerak. Arxivga kiriting bitta protokol-standart konfiguratsiya manifesti, N=2,3,4,8,16 ni qamrab oladi; har bir yozuv saqlangan konfiguratsiya baytlariga ishora qilishi va har bir ma’lumot makonida aniq to‘rtta validatorni, 3-of-4 quorumini va majburiy imzolangan RS16 DA/RBC ni ta’kidlashi kerak. Nashr tekshiruvchisi boshqa qurilish, apparat profili yoki tarmoq konfiguratsiyasida yaratilgan qisqacha ma'lumotlarni rad etadi. Har bir yakka yo'qotish, faza kesilishi va uzluksiz-buzilish qatori shuningdek SHA-256-cheklangan ichida global qayta ishlatilmaydigan aniq JSONL yozuv havolalarini nomlashi kerak tasdiqlangan-boshqaruvchi va atomlilik-qayd etish artefaktlari. Reliz tasdiqlovchisi ushbu kriptografik xulosalarni hal qiladi va satrlarning ish identifikatori, sinov indeksi va parametrlar, boshqaruvchi tasdiqlashi yoki tiklash natijasi, uzluksiz tekshirish soniga mos kelishini talab qiladi, va nol qisman ko‘rinish va sarflanish kuzatuvlari. Keyinchalik chiqarilgan p95/p99 taqqoslashlar ham apparati, konfiguratsiyalari yoki o‘lchov talablarining nomzodnikidan farq qiluvchi imzolangan asosni rad etadi. Yakuni tekshiruvchi barcha xabar qilingan foizli ko'rsatkichlarni, MADs va saqlangan xom namunalar asosida deterministik ishonch intervallarini qayta yaratadi, ajratilgan benchmark xulosasiga ishonish o'rniga. Shuningdek, u kanari manifestni qayta yuklaydi va har bir arxivlangan maxfiylik yuzasini mustaqil ravishda qayta skanerlashni amalga oshiradi, shuning uchun hisobot fayl kriptografik yakunlarini qayta bog'lagandan keyin joylashtirilgan sirli hujumni bostira olmaydi. Har bir faqat sirli ishga tushirish uning egasiga qarashli filtrlarsiz loopback pcap, xom tcpdump stderr va nol yo‘qotish statistikasi, bitta protokol-standart port manifesti, siqilgan cheklangan manba arxivi va barcha hamkasblar atomiklik kuzatuvlarini saqlab qolishi kerak. So‘nggi tekshiruvchi nashr qilingan qisqacha ma’lumotlarga ishonish o‘rniga, arxivlangan baytlardan portga bog‘langan paket bo‘linmasi, manba prognozlari va bazaviydan terminal atomarlik tekshiruvlarini qayta bajaradi.

Arxivda shuningdek, har bir zaruriy maxfiylik yuzasi uchun aniq chap va o‘ng fayl yo‘llari, turlari, bayt uzunliklari va SHA-256 kriptografik xashlarini bog‘laydigan kanonik juftlashtirilgan trafik hisoblash va differensial-juft manifestlar bo‘lishi kerak. E'lon qilingan ildizlari aniq juftlangan arxiv inventarizatsiyasini o'z ichiga olishi kerak. Tekshirish vositasi oddiy sirtlar uchun butun fayl o'lchamlari va JSON jamoat shakllarining tengligini talab qiladi. Entropiya tashuvchi xom loopback yozuvi va siqilgan cheklangan manbali arxiv aniq hajm istisnolaridir; u buning o‘rniga paket aloqasi turini va har bir paket uzunliklarini, cheklangan manbali identifikatorlarni va belgilangan shakldagi qator uzunliklarini solishtiradi. Har bir Torii so‘rov/javob, ommaviy/cheklangan P2P paket, blok, so‘rov, voqea, jurnal va telemetriya trafik hisoblagichi ham mos kelishi kerak. Paket shaklidagi o‘zgarish, bir xil o‘lchamdagi strukturaviy oqim, noto‘g‘ri kelib chiqishi da’vosi, yoki juftlanmagan fayl oqim hisobotini va uning kriptografik xeshlarini qayta yozish orqali yashirilishi mumkin emas.
