---
translation_locale: uz
translation_source: /get-started/atomic-private-settlement.md
translation_source_hash: 22acbd9fdc8f9882f47f1a3d75d408f07b156c1e0240294b9d8a2f6a79195f51
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Ma’lumotlar makonlari orasida atomik maxfiy hisob-kitobni bajaring {#run-atomic-private-cross-dataspace-settlement}

`AtomicPrivateSettlementV1` 2 dan 255 tagacha SORA Nexus ma’lumotlar makonining har birida bittadan maxfiy hisob-kitob qismini muvofiqlashtiradi va barcha qismlarni global holatning bitta tranzaksiyasida yakuniy qiladi. Rad etilgan, muddati tugagan yoki bekor qilingan to‘plamning hech bir qismi qo‘llanmaydi. Shaffof Native AMX DvP/PvP alohida protokol yo‘li bo‘lib qoladi.

::: warning Chiqarish holati
Ushbu xususiyat boshqariladi, standart bo‘yicha o‘chirib qo‘yilgan va hali ishlab chiqarishga tayyor emas. E’lon qilingan funksionallik mavjud bo‘lguncha uni haqiqiy CBDC qiymat uchun yoqmang, maxfiylik, xato, ishlash, qayta ishlab chiqariladigan qurilish, mustaqil kriptografik ko‘rib chiqish va artefakt nashr etish qoidalari aynan shu reliz uchun barchasi muvaffaqiyatli o‘tgan.
:::

## Protokol nimani yashiradi {#what-the-protocol-hides}

Har bir moliyaviy o'tkazma qismi ikki kirishli, uch chiqishli maxfiy yozuv isboti bilan ishlaydi. Kengash tasdiqlovchilari isbotni va noaniq holat o'tishini tekshiradilar; ular ochiq matn partiyalarini, aktivni, miqdorni, eslatmani yoki biznes natijasini olmaydilar. Avtorize qilingan mahalliy auditor quvurlangan audit kapsulasini shifrdan chiqaradi, uning mazmunini tekshiradi va maqsadga ajratilgan tasdiqni imzolaydi. Standart siyosat boshqariladigan auditorlar to‘plamidan bitta tasdiqni qabul qiladi.

Ommaviy konteyner tranzaksiyasi va protokol natijalari yozuvi ataylab quyidagilarni oshkor qiladi:

- tarmoq va paket identifikatorlari
- ishtirokchi ma’lumotlar makonlari marshrutlari va ishtirokchilar soni
- vaqt va muddati balandliklari
- barqaror yashirin pul identifikatorlari, ildizlar, nullifikatorlar, majburiyatlar va o‘zgarmas shifrmatn slotlari
- qo'mita vakolat prinsiplari va aniq 3-dan 4 mavjudlik, tayyorlash va protokolni yakunlash sertifikatlari
- sponsor, ochiq tarmoq to'lovi va terminal holati

Bu trafik oqimining anonimligi emas, mazmun maxfiyligidir. Vaqtlar, ishtirokchilar soni, ma’lumotlar makoni identifikatori va barqaror havza faolligi ochiq qoladi. Faqat bitta CBDC valyutasini joylashtirgan ma’lumotlar makonida aktivning aniq identifikatori e’lon qilinmasa ham marshrutdan aktivni aniqlash mumkin bo‘lishi mumkin.

## Joylashtirish talableri {#deployment-requirements}

Faollashtirishdan oldin, operatorlarga quyidagilarning barchasi kerak:

1. Har bir ishtirokchi ma’lumotlar makoni uchun turli BLS konsensus kalitlari va egalik isbotlariga ega aniq to‘rtta validator
2. har bir balandlik uchun majburiy Sumeragi DA/RBC yoqilgan
3. har bir ma’lumotlar makonida governance boshqaradigan maxfiy hisob-kitob havzasi va boshlang‘ich ildiz
4. faol V1 shaxsiy eslatma imkoniyati va alohida moliyaviy tranzaksiya yakunlash dalili profili
5. hech bo‘lmaganda bitta boshqariladigan mahalliy `PrivateSettlementAuditPolicyV1`, jumladan alohida auditor imzolash va gibrid shifrlash kalitlari, kalit davri, balandlik haqiqiyligi va tasdiqlash mezoni
6. sozlangan saqlash muddati uchun yetarli shaxsiy yordamchi yozuvlar saqlash
7. yakuniy jamoat konteyner tranzaksiyasini yubora oladigan neytral homiy hisobida

Auditor validatorni ham boshqarishi mumkin, ammo konsensus, auditor imzosi va auditor shifrlashi uchun alohida kalitlardan foydalanishi kerak. Foydalanishdan chiqarilgan deshifrlash kalitlarini me’yoriy saqlash muddati davomida saqlang yoki ularni chiqarishdan oldin kapsulalarni qayta o‘rash jarayonini boshqaring va sinang.

To‘rtta validator vakolati holatda mahkamlangan, mijoz tomonidan berilmaydi. Manifestning `authority_context_height` balandligida har bir validator konsensus holatidan yo‘lak/ma’lumotlar makonining aniq tartibli tarkibi va faol yo‘lak avlodini yechadi, yechilgan balandlik mosligini talab qiladi va to‘rtta BLS kaliti hamda egalik isbotlarini tekshiradi. Yuklash, Prepare va yakuniy kvitansiya qabuli ayni tarixiy vakolatdan foydalanadi.

## Yon yozuvlarni saqlashni sozlang {#configure-sidecar-custody}

Commit qilingan maxfiylik siyosati faollashtirish, isbot profillari, ishtirokchilar chegaralari, amal muddati va auditor talablarini belgilaydi. Qabul muvaffaqiyatli bo‘lishidan oldin governance boshqaradigan imkoniyat hamda on-chain havza va audit yozuvlari faol bo‘lishi kerak.

Tugun sozlamasi faqat shifrlangan yon yozuvlar omborining mahalliy sig‘imini boshqaradi:

```toml
[nexus.atomic_private_settlement]
sidecar_max_records = 256
sidecar_max_total_bytes = 3221225472
```

Bular yetkazib berilgan saqlash chegaralaridir. Mahalliy sig‘imni tanlashdan oldin mo‘ljallangan apparatda saqlangan yozuvlar va kanonik baytlarni o‘lchang. Faqat sig‘im hisob-kitobni faollashtirmaydi yoki uning commit qilingan yaroqlilik siyosatini o‘zgartirmaydi.

Kapsulaning commit qilingan chegarasi `PrivateSettlementAuditCapsuleV1`ning to‘liq kanonik Norito kodlanishini o‘lchaydi: AAD, nonce, shifrlangan matn, vektor freymlari, auditor identifikatorlari va har bir o‘ralgan DEK qatori. Tashuvchi tranzaksiyaning commit qilingan chegarasi ko‘rsatma freymlari, vakolat, metadata, komissiya niyati va imzoni o‘z ichiga olgan, homiy imzolagan to‘liq tranzaksiyani o‘lchaydi. Tarmoqning odatiy tranzaksiya chegaralari ham qo‘llanadi.

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
| Audit kapsulasi | `POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule` | governance tayinlagan auditor |
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
- 2, 3, 4, 8 va 16 ma’lumotlar makoni uchun haqiqiy to‘rt validator jarayonlari, jumladan validator va koordinator qayta ishga tushishi, autentifikatsiyalangan 5%, 10% va 20% xabar yo‘qolishi, bosqichdagi bo‘linishlar, tiklash va saqlash chegaralaridagi uzilishlar
- kanarey va differensial oqim tahlili Torii, P2P bloklari, Kura, vaqt nuqtasidagi ma’lumot ko‘rinishlari, so‘rovlar, voqealar, jurnallar va telemetriya bo‘ylab
- haqiqiy tarmoq ishtirokchisi soniga kamida beshta issiqroq mashq va o‘n o‘n o‘n o‘lchangan yig‘ma, p50, p95, p99, ishonch intervallari, resurslar, trafig, dalil va protokol natijalari yozuvlari hajmlari bilan va nazorat sifatida shaffof AMX
- qatʼiy ish joyi testlari, lint va format tekshiruvlari, tasodifiy urugʻlar, soak, takrorlanadigan yigʻilishlar, SBOMs, va imzoli artefakt kriptografik xeshlar
- ikkala rasmiy qatlam: 3/255 bosqich soni simmetriyasi tekshiruvlari hamda aniq to‘rt validatorli, qo‘mita bo‘yicha indekslangan N=2 validatorga yo‘naltirilgan va to‘liq chegaralangan xato, maqoladagi asosiy N=3 xato, N=4 xatosiz hamda N=3 muddat tugashi/qayta ijro konfiguratsiyalari; xato byudjetlari har bir qo‘mita uchun mustaqil
- isbot munosabati, soxta slot selektorlari, aktiv va kapsula bog‘lanishlari, qaytarim munosabati, kriptografiya va makonlararo holat mashinasining mustaqil ko‘rigi

Xom va tozalangan dalillarni, tahdid modelini, protokol argumentini, cheklovlarni, manba-kodining o‘zgartirish identifikatorlarini, apparat tavsifini va audit hisobotlarini chop eting o‘zgarmas DOI-asoslangan artefakt. Faqat ombor testlari xususiyatni ishlab chiqarishga mo‘ljallangan CBDC moliyaviy tranzaksiya hisob-kitob tizimiga aylantirmaydi.

Oxirgi toza Iroha chekautdan, chiqish manba inventarini yarating va uni ushbu chekautdan tashqaridagi oldindan mavjud bo‘lgan paket ildiziga muhrlang:

```sh
python3 scripts/private_settlement_source_evidence.py \
  --repository-root . \
  --bundle-root /absolute/path/to/release-bundle
```

Ishlab chiqaruvchi sahnalashtirilgan, sahnalashtirilmagan, izsiz yoki birlashtirilmagan fayllarda va yozib olish davomida har qanday manba o‘zgarishida ishlamay qoladi. U xom manba-kod versiyasi obyekti, kanonik Git daraxti inventari, aniq ikkilamchi yo‘l ro‘yxati, deterministik manba muhrini va `Cargo.lock` saqlaydi; yakuniy reliz manifestida uning JSON natijasidagi har bir artefakt deklaratsiyasini o‘z ichiga oladi. Bu yakuniy DOI-bundle tekshiruvchisini yoki har qanday tashqi reliz eshigini bekor qilmaydi.

Manba muhrini ko'chma va yopiq bo'lib ishlaydi: ishlab chiqaruvchi va yakuniy tekshiruvchi barcha arxivlangan symlink grafini yakuniy hal qiladi, shunda ildizda ko'rinadigan, lekin boshqa link orqali chiqadigan, tsikl, `.git` o‘tish yoki Windows uslubidagi nishon bo‘lgan linklar yaratilishidan oldin rad etiladi. Tuzilgan manba va darvoza hisobotlari faqat kriptografik xulosa qiymati va uzunligi chiqarish manifestiga mos keladigan cheklangan barqaror fayllardan tahlil qilinadi, va har bir manba yuklanishi turi aniq bir marta uchrashishi kerak.

Har bir xom xato sinovi va kechikish namunasi relizning to‘liq commitiga, mahkamlangan apparatning bitta tuzilgan tavsifi SHA-256 qiymatiga va ishtirokchilar sonining aniq sozlamasi SHA-256 qiymatiga bog‘lanishi kerak. N=2,3,4,8,16ni qamrab oluvchi bitta kanonik sozlama manifestini arxivlang; har bir yozuv saqlangan sozlama baytlariga havola qilishi va har bir ma’lumotlar makonida aniq to‘rtta validator, 3-of-4 kvorumi va majburiy imzolangan RS16 DA/RBC ishlatilishini tasdiqlashi kerak. Reliz tekshiruvchisi boshqa dasturiy yig‘ilma, apparat profili yoki tarmoq sozlamasida olingan xulosalarni rad etadi. Har bir yo‘qotish, bosqich uzilishi va saqlashdagi uzilish qatori qo‘shimcha ravishda SHA-256 bilan bog‘langan autentifikatsiyalangan kontroller va atomiklik yozuvi artefaktlari ichidagi aniq JSONL yozuvlariga global qayta ishlatib bo‘lmaydigan havolalarni ko‘rsatishi kerak. Reliz tekshiruvchisi bu digestlarni yechadi va qatorlar sinov identifikatori, tajriba indeksi va parametrlari, kontroller tasdig‘i yoki tiklash natijasi, uzluksiz tekshiruvlar soni hamda qisman ko‘rinish va sarflash imkonining nol kuzatuvlariga mos bo‘lishini talab qiladi. Keyingi relizlarning p95/p99 solishtirishlari ham apparat, sozlama yoki o‘lchash talablari nomzoddan farqli imzolangan bazaviy natijani rad etadi. Yakuniy tekshiruvchi alohida benchmark xulosasiga ishonish o‘rniga arxivlangan xom namunalardan barcha hisobotdagi percentillar, MADs va deterministik ishonch oraliqlarini qayta hisoblaydi. U canary manifestini ham qayta yuklaydi va har bir arxivlangan maxfiylik sirtini mustaqil skanerlaydi, shunda hisobot fayl digestlarini qayta bog‘lagach joylashtirilgan sir aniqlanganini yashira olmaydi. Har bir faqat sirli sinov egagagina ochiq filtrlanmagan loopback pcap, xom tcpdump stderr va nol yo‘qotish statistikasi, kanonik port manifesti, qadoqlangan cheklangan manba arxivi hamda barcha tengdoshlarning atomiklik kuzatuvlarini saqlashi kerak. Yakuniy tekshiruvchi e’lon qilingan xulosalarga ishonmay, shu arxiv baytlaridan portga bog‘langan paket ajratish, manba proyeksiyalari va boshlang‘ichdan oxirgi holatgacha atomiklik tekshiruvlarini qayta bajaradi.

Arxivda shuningdek, har bir zaruriy maxfiylik yuzasi uchun aniq chap va o‘ng fayl yo‘llari, turlari, bayt uzunliklari va SHA-256 kriptografik xashlarini bog‘laydigan kanonik juftlashtirilgan trafik hisoblash va differensial-juft manifestlar bo‘lishi kerak. E'lon qilingan ildizlari aniq juftlangan arxiv inventarizatsiyasini o'z ichiga olishi kerak. Tekshirish vositasi oddiy sirtlar uchun butun fayl o'lchamlari va JSON jamoat shakllarining tengligini talab qiladi. Entropiya tashuvchi xom loopback yozuvi va siqilgan cheklangan manbali arxiv aniq hajm istisnolaridir; u buning o‘rniga paket aloqasi turini va har bir paket uzunliklarini, cheklangan manbali identifikatorlarni va belgilangan shakldagi qator uzunliklarini solishtiradi. Har bir Torii so‘rov/javob, ommaviy/cheklangan P2P paket, blok, so‘rov, voqea, jurnal va telemetriya trafik hisoblagichi ham mos kelishi kerak. Paket shaklidagi o‘zgarish, bir xil o‘lchamdagi strukturaviy oqim, noto‘g‘ri kelib chiqishi da’vosi, yoki juftlanmagan fayl oqim hisobotini va uning kriptografik xeshlarini qayta yozish orqali yashirilishi mumkin emas.
