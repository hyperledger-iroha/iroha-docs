---
translation_locale: uz
translation_source: /get-started/atomic-private-settlement.md
translation_source_hash: 18b5e9c80bfa5542b996548fd07603a311099f76a4443cf143cd959991f80dc3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Atomik xususiy ma'lumotlar maydoni boʻylab oʻzgartirishni ishga tushiring {#run-atomic-private-cross-dataspace-settlement}

`AtomicPrivateSettlementV1` 2 dan 255 gacha bo'lgan har bir konfidensial kelishuv bosqichini muvofiqlashtiradi. SORA Nexus ma'lumotlar maydonlari va bitta global davlat tranzaksiyasidagi har bir qadamni yakunlaydi. Ruxsat etilgan, muddati o'tgan yoki abort qilingan to'plamda hech qanday oyoq qo'llanmaydi. AMX DvP/PvP alohida protokol yo'li bo'lib qoladi.

::: warning Bo'shatish holati Ushbu xususiyat boshqariladi, andoza ravishda o'chirib qo'yiladi.
Va hali ishlab chiqarish uchun mo'ljallangan emas. Uni haqiqiy CBDC qiymatga qo'shmang, agar nashr etilgan funktsional, maxfiylik, xato, ishlash, qayta tiklanishi mumkin bo'lgan qurilish, mustaqil kriptografik ko'rib chiqish va artefaktlar nashri darvozalari to'g'ri chiqarilishi uchun o'tmaguncha:::::

## Protokol nimani yashirmoqda {#what-the-protocol-hides}

Har bir to'g'ridan-to'g'ri ikki kirish va uch chiqishdan iborat xususiy nota dalillaridan foydalanadi. Komiteni tasdiqlovchilar dalilni va shaffof holat o'tishini tekshiradilar; ular oddiy matn partiyalarini, aktivlarni, miqdorni, notani yoki biznes natijalarini olmaydilar. Vakolatli mahalliy auditor to'ldirilgan audit kapsulalarini chifrlaydi, ushbu tarkibni tekshiradi va maqsad bo'yicha alohida ruxsatnomaga imzo oladi.

Umumiy tashuvchi va rasmga ko'ra, bila turib:

- tarmoq va paket identifikatorlari
- ishtirokchi ma'lumotlar maydonining yo'nalishlari va ishtirokchilar soni
- Vaqt va muddati tugaydigan balandliklar
- barqaror shaffof bo'lmagan to'plam identifikatorlari, ildizlar, bekor qiluvchilar, majburiyatlar va qat'iy kodli matn slotslari
- Qo'mita organlari va to'g'ri 3-dan 4-ta mavjudlik, tayyorlov va majburiyat sertifikatlari
- Sponsor, ommaviy tarmoq to'lovlari va terminal holati

Bu tarkib maxfiyligi, trafik oqimi anonimligi emas. Vaqt, ishtirokchilar soni, ma'lumotlar maydonining identifikatsiyasi va barqaror to'plam faoliyati ommaviy bo'lib qolmoqda. Faqat bitta CBDC ga ega bo'lgan ma'lumot maydonida ma'lumotni yo'ldan ajratish mumkin, garchi hech qanday tom ma'nodagi aktiv identifikatori nashr etilmagan bo'lsa ham.

## Ishlab chiqarish talablari {#deployment-requirements}

Operatorlar aktivlashdan oldin quyidagilarning barchasini bajarishlari kerak:

1. Har bir ishtirokchi ma'lumotlar maydonida aniq to'rtta tasdiqlovchi, alohida BLS konsensus kalitlari va egalik guvohnomasi bilan;
2. majburiy Sumeragi DA/RBC har bir balandlik uchun qo'llanilgan
3. har bir ma'lumotlar maydonida boshqarish bilan bog'liq maxfiy hisob-kitoblar bazasi va dastlabki ildiz
4. faol V1 xususiy yozuv qobiliyati va alohida to'lovni tasdiqlovchi profil
5. Hech bo'lmaganda bitta tartibga solinadigan mahalliy `PrivateSettlementAuditPolicyV1`, shu jumladan alohida auditor imzosi va hibrid shafrlash kalitlari, asosiy davr, balandlik amal qilish muddati va ruxsat etish darajasi;
6. konfiguratsiya qilingan saqlash davri uchun etarli miqdorda xususiy yon mashinalar saqlanishi
7. yakuniy davlat tashuvchisini taqdim etish imkoniyatiga ega bo'lgan neytral sponsor hisob raqami

Auditor, shuningdek, tasdiqlovchi vositasini ishlatishi mumkin, ammo alohida konsensus, auditor imzolash va auditor shifrlash kalitlaridan foydalanishi kerak. Regulyatsiyaviy saqlanish davri uchun cheklangan kodlash kalitlarini ushlab turing yoki ularni o'chirishdan oldin test kapsulasini qayta to'plash va boshqarish.

To'rt ta'kidlovchi hokimiyat davlatga asoslangan, mijoz tomonidan taqdim etilmaydi. Manifestning `authority_context_height` har bir ta'kidlovchisi to'g'ri tartibdagi yo'nalish / ma'lumotlar maydonining ro'yxatini va faol yo'nalishni hal qiladi konsensus holati, aniqlangan balandlikni moslashtirishni talab qiladi va to'rtta BLS kalitlari va egalik guvohnomasini tasdiqlaydi. Yuklab olish, tayyorlash va yakuniy qabul qilish barcha bir xil tarixiy vakolatdan foydalanadi.

## Kiritishni sozlash {#configure-admission}

Barcha ishlab chiqarish xatti-harakatlari nod konfiguratsiyasidan kelib chiqadi. muhit o'zgaruvchilari ushbu yo'lni faollashtirolmaydilar. Jo'natilgan andoza `enabled = false`; xususiyatni o'chirib qo'yish uchun joylashtirishga mos konfiguratsiya talab qilinmaydi.

Boshqaruvchanlik kerakli imkoniyatni ro'yxatdan o'tkazgandan so'ng va to'g'ri ogohlantirilgan holda faollashtirish balandligini tanlaganidan so'ng, har bir tegishli nodni mos ravishda konfiguratsiya qiling:

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

Misol uchun etkazib berilgan V1 chegaralaridan foydalanib, ishlashi mumkin bo'lgan tavsiya emas. Operativ chegaralarni tanlashdan oldin mo'ljallangan asbob-uskunalar. Uch bosqich vaqtlari `max_expiry_blocks` ichida o'rnatiladi va yon mashinalarini saqlab qolish hech bo'lmaganda o'sha muddati tugaydigan oyna bo'lishi kerak.

`max_capsule_bytes` butun `PrivateSettlementAuditCapsuleV1`ning kanonik Norito kodlashini cheklaydi: AAD, nonce, shifr matni, vektorlar o'rnatish, auditor identifikatsiyalari va har bir qadoqlangan-DEK satr. Bu faqat shifr matniga doir chegara emas. Har bir konfiguratsiyalangan to'ldirish sinflari kamida `default_min_auditor_approvals` auditorlar uchun konservativ butun kapsula qadoqqa mos bo'lishi kerak. Torii shuningdek, yangi qabul qilingan siyosatni rad etadi, uning `min_approvals` bu tartibga solinadigan qavatdan past bo'lgan va to'liq kanonik kodlanishi juda katta bo'lgan har qanday haqiqiy kapsulani rad qiladi.

`max_carrier_bytes` faqat sertifikatlangan paket emas, balki sponsor tomonidan imzolangan to'liq kanonik operatsiyani cheklaydi. Hisobotga ro'yxatdan o'tgan yo'l-yo'riqlarni belgilash, operatsiya hokimiyati va metadatalar, to'lov niyatlari va imzosi kiradi. Oddiy tarmoq operatsiyalarining cheklovlari hali ham mustaqil yuqori chegara sifatida amal qiladi.

Aktivatsiya o'chirilmaydi, agar boshqaruv qobiliyati faol bo'lmasa, uning holati va aktivlash balandliklari xabardorlik muddatini qondirmasa, yig'ilgan dalil profillari V1 bilan mos kelmasa va zanjirdagi to'plam va audit yozuvlari joriy bo'lsa. Konfiguratsiya bayrog'ini qo'llash yolg'iz etarli emas.

## Toʻlash ish oqimi {#settlement-workflow}

Mijoz dalillar va shifrlangan kapsulalarni mahalliy ravishda quradi. maxfiy shohidlar mahalliy hamyon yoki mahalliy ishchilarda qolishlari kerak; ularni arizalar jurnallariga, Python ob'ektlarga, HTTP so'rovlarga yoki uzoq muddatli koordinatsiya yozuvlariga seriallashtirmang.

Kapsula va har bir auditor uchun DEK qadoqlash bilan tasdiqlangan ma'lumotlarga aniq davlat qo'mitasi va `authority_context_height` to'g'risidagi ma'lumotlar, shuningdek tarmoq kiradi. yo'nalish/tushkunlik, to'plam, oyoq, siyosat, asosiy davr va aniq matn majburiyatlari.

Har bir kanonik oyog'i uchun koordinator keyinchalik quyidagi tartibni bajaradi:

1. Vaqtinchalik shifrlangan materialni to'rtta tasdiqlovchiga yuklab oling va kanonik aniq 3 -dan 4 ta mavjudlik sertifikatini oling.
2. Ruxsat berilgan auditor uning kapsulasini olib kelib, uzib qo'yishi kerak bo'lgan ma'lumotlarni qayta hisoblash, mahalliy siyosatni qo'llash va ruxsatnoma berish.
3. Talab To'rtta tasdiqlovchilardan ovozlarni tayyorlang. Har bir tasdiqlovchi ovoz berishdan oldin deltani mustaqil ravishda tekshiradi va barqaror bosqichga ko'taradi. Har bir bosqichda javob beruvchida kanonik 3-of-4 Tayyorlash sertifikatini saqlab qoling.
4. Har bir oyoq Tayyorlik sertifikatiga ega bo'lganidan so'ng, o'zgartirilmaydigan to'liq Tayyorlik bariyerini quring. Kanonik 3-of-4 Komit sertifikatlarini talab qiling va saqlang. Koordinator qayta ishga tushsa, ishtirokchi tugunlardan ularning mahalliy doimiy saqlangan Prepare va Commit sertifikatlarini so‘rang. Xuddi shu kvorumga teng kanonik sertifikatni tanlang va davom etishdan oldin uni qayta tarqating; sertifikatni autentifikatsiya qilinmagan mahalliy keshdan hech qachon qayta tuzmang.
5. Manifest sponsor belgisini oling va aniq bir global tashuvchini taqdim eting. Tashuvchi bitta `FinalizeAtomicPrivateSettlementV1` ko'rsatma va to'liq sertifikatlangan paketni o'z ichiga oladi. Koordinator va WSV parvozdan oldin ro'yxatga olingan ko'rsatmalar ramkalarini ham o'lchash uchun to'liq qutiladigan topshiriqlarni o'lchov qiladi. Torii va asosiy bir martalik tashuvchi majburiyati `max_carrier_bytes` sponsor tomonidan imzolangan aniq kanonik tranzaksiya ustidan, shu jumladan vakolat, metadatalar, to'lov niyati va imzo. Torii tashuvchini o'z vakolatlari kontekstidan oldin, muddati tugagandan keyin yoki belgilangan muddatdan keyingi oxirgi kirish balandligida yoki undan keyin rad etadi.
6. Jahon yakunigacha ommaviy to'plamning holati va qabul qilinishini so'rang. Mahalliy yon mashinalar davlatini o'zgaruvchan bo'lmagan global terminal rekordini yaratib bermaguncha vaqtinchalik holat deb hisoblang.

O ' zbekiston Respublikasining Rust mijoz ushbu oqimni oʻz ichiga olgan usullar orqali namoyish etadi `certify_and_upload_private_settlement_legs_v1`, `prepare_private_settlement_bundle_v1`, `commit_private_settlement_bundle_v1`, va `submit_private_settlement_bundle_v1`. Qayta ishga tushirishga bardoshli muvofiqlashtirish `recover_or_prepare_private_settlement_bundle_v1` va `recover_or_commit_private_settlement_bundle_v1` dan foydalanadi. Qo'mita va auditorlik davolanishlari aniq roli haqida ma'lumotlarni talab qiladi; ular odatdagi hisobni imzolagan shaxsdan foydalanmaydi.

## Auditorlik siyosatini xavfsiz ravishda aylantirish {#rotate-an-auditor-policy-safely}

Maxfiylik boshqaruvi tomonidan ruxsat etilgan `RotatePrivateSettlementPoolPolicyV1` ko'rsatmalaridan foydalaning. U to'g'ri joriy boshqaruvni o'z ichiga olishi, bir xil yo'nalishni, puli va aktivlarni bog'lash majburiyatini saqlashi, boshqaruvni qayta ko'rib chiqishni bir marta ilgari surishi, qat'iy ravishda yangi asosiy davrdan foydalanish va turli siyosat / boshqaruv dasturlaridan foydalanish kerak; va aylanishni o'z ichiga olgan blokda faollashtiring. hovuz chegaralari, ildizlar, bekor qiluvchilar, chiqindilar, takrorlash to'plamlari va yakuniy qabulnomalar saqlanib qoladi. O'sha yo'nalish / hovuzni harakatlanish balandligida uchratadigan rasmga kiritmang; ko'rsatma ushbu chegaralarni rad qiladi.

Umumiy fond proyeksiyasi to'liq o'zgartirilgan siyosat-taftish liniyasini saqlab qolmoqda. Rotatsiya qilishdan oldin yakunlangan risola shu sababli qayta ishga tushirilgandan keyin ham amalda qoladi va ushbu aniq risolani takrorlash yaroqsiz qoladi. Ta'minlanmagan ishlarga ruxsat berilmaydi: faollashtirish chegarasini kesib o'tgan har qanday eski siyosat to'plami global holat o'zgarishlaridan oldin yopilmaydi. O'rnatilgan kapsulalarni ochish uchun zarur bo'lgan barcha eski kodlash kalitlarini saqlang yoki uni yo'q qilishdan oldin boshqariladigan va sinovdan o'tkazilgan kapsulani qayta tiklang.

## Torii yo'l oilasi {#torii-route-family}

Ushbu yo'nalishlarda kanonik Norito so'rov va javob ob'ektlari ishlatiladi. Tasdiqlangan va cheklangan javoblar xususiy `no-store` kecha xatti-harakatidan foydalanadi.

|Operatsiya |usuli va yoʻli |Boshliq |
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
|Oyoq yuklash |`POST /v1/nexus/private-settlements/legs` |kanonik hisobning imzosi |
|Foydalanish hissasi |`POST /v1/nexus/private-settlements/legs/availability-shares` |kanonik hisobning imzosi |
|ovoz berishga tayyorlaning |`POST /v1/nexus/private-settlements/phases/prepare-votes` |kanonik hisobning imzosi |
|Ovoz berish majburiyati |`POST /v1/nexus/private-settlements/phases/commit-votes` |kanonik hisobning imzosi |
|O'simlik fasasi QC |`POST /v1/nexus/private-settlements/phases/certificates` |kanonik hisobning imzosi |
| Bosqich QCs-ni qayta tiklash | `GET /v1/nexus/private-settlements/legs/{payload_digest}/phase-certificates` | koʻrsatilgan sponsor |
|Oyoq holati |`GET /v1/nexus/private-settlements/legs/{payload_digest}/status` |kanonik hisobning imzosi |
|Qoʻmita hujjati|`GET /v1/nexus/private-settlements/legs/{payload_digest}/committee-proof` |toʻgʻri roʻyxatni tasdiqlash|
|Audit kapsulasi |`GET /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule` |Boshqaruvchi auditor |
|Auditorning roziligi |`POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-approvals` |Boshqaruvchi auditor |
|Toʻplamni taqdim etish |`POST /v1/nexus/private-settlements/bundles` |koʻrsatilgan sponsor |
|Toʻplam holati |`GET /v1/nexus/private-settlements/bundles/{bundle_id}` |ommaviy |
|Qabul qilish yoki bekor qilish|`GET /v1/nexus/private-settlements/bundles/{bundle_id}/receipt` |ommaviy |

Umumiy status va rasmga APIs faqat hujjatlashtirilgan ommaviy maydonlarni ko'rsatadi. Xususan, odatdagi to'g'ri holatda tasdiqlangan raqamlar yoki tartibga solinadigan auditorlik darajasi oshkor etilmaydi. Cheklangan o'qishlar qasddan yo'qolgan, ruxsatsiz va saqlab qolish muddati tugagan materiallar bir xil mavjud bo'lmagan javob sinfida.

## Muvaffaqiyatsizlik va tiklanish {#failure-and-recovery}

Yo'q bo'lgan yoki eskirgan auditorning ma'lumotlari, uchta nafardan kam tasdiqlovchi ovoz, noto'g'ri ildiz yoki davrlar, ikkilamchi bekor qiluvchi hujjatlar, o'rniga olingan dalillar yoki kapsullar, kanonik bo'lmagan to'lov tartibi, muddati tugagan paketlar va mos kelmagan kompensatsiya shartlari global mutatsiyadan oldin barchasi muvaffaqiyatsizlikka tushadi. Komit sertifikatlari hech qachon xususiy davlatni o'zgartirmaydi.

Validatorlar ularni tan olishdan oldin yon mashinalar, tasodifdagi deltalar va bosqich sertifikatlarini sinxronlashtiradi. Qayta ishga tushirilganda ular kanonik mustahkam yozuvlardan rezervatsiyalarni qayta tiklaydilar, so'ngra o'zgaruvchan bo'lmagan global kvititlarni, abort belgilarini yoki muddati tugagani bilan uyg'unlashadi. Ko'zlab boriladigan yarashtiruvchi shuningdek, sinxronlik bilan kuzatilgan vakolatli balandlikda terminalni saqlab qolish uchun kesishni amalga oshiradi, hatto yarashtirish uchun terminal nomzod yo'q bo'lsa ham. Faqatgina ishonchli global terminal qaydnomasi bosqichma-bosqich qulflarni chiqaradi. Xuddi shunday yakuniy rasmni takrorlash imkonsiz bo'ladi; ziddiyatli takrorlash deterministik ravishda muvaffaqiyatsizlikka uchradi.

Qutqaruv identifikatsiyasi to'liq yo'nalishni o'z ichiga oladi. Havo boshlarida `(route, pool_id, epoch, root)`, bekor qiluvchilarda `(route, pool_id, nullifier)` va chiqindilarda `(route, pool_id, commitment)` ishlatiladi. Boshqa yo'nalishda teng shaffof qiymatlar mustaqil; qaytadan ishga tushirishda aniq yo'nalishdagi to'qnashuv qulflangan qoladi.

Operativ ogohlantirishlarda faqat shaffof bo'lmagan to'plam, yo'nalish, bosqich, o'chirish, balandlik va sabab darajasi maydonlari ishlatilishi kerak. Hech qachon loglar, hodisalar, metrika etiketlari yoki izlanish muddatlarida chiptalarni, hisob yoki aktiv identifikatorlarini, miqdorlarni, xotiralarni, ko'rish ma'lumotlarini, dalil guvohlarini yoki tahlilchi yuklarini joylashtirmang.

## Real qiymatdan oldin malaka {#qualification-before-real-value}

Siz ishga tushirishni rejalashtirgan to'g'ri qurilish va konfiguratsiya uchun arxivda quyidagilarni o'z ichiga olgan dalillar mavjud:

- qarshilik to'g'risidagi dalillar, kapsula, siyosat, kalit aylanishi, qaytarish va takrorlash holatlari
- 2, 3, 4, 8 va 16 ma'lumotlar bazasi uchun haqiqiy to'rt ta'minlovchi jarayonlar, shu jumladan validator va koordinatorni qayta ishga tushirish, 5%, 10% va 20% autentifikatsiya qilingan xabar yo'qotishi, bosqich partitsiyalari, tiklash va saqlanish chegaralari bilan bog'liq xatolar
- Torii, P2P, bloklar, Kura bo'ylab kanari va differensial sovuqlarni tahlil qilish, tezkor ko'rinishlar, so'rovlar, hodisalar, loglar va telemetriya
- Haqiqiy tarmoq ishtirokchilarining soniga nisbatan kamida besh issiqlik va o'ttiz o'lchovli to'plamlar, p50, p95, p99, ishonch intervallari, resurslar, trafik, dalil va rasmga ega bo'lgan hajmlar va nazorat sifatida shaffof AMX
- Xizmat maydonida qat'iy sinovlar, lint va format tekshiruvlari, tartibsiz urug'lar, sug'orish, qayta tiklanishi mumkin bo'lgan qurilmalar, SBOMs, va imzolangan artefak hashlari
- har ikki rasmiy qatlam: 3/255 oyoq bilan hisob-kitob simmetriyasi tekshiruvi va to'rtta validator bo'yicha aniq komissiya indeksasi N=2 validatorga qaratilgan va to'liq cheklangan xato, qog'ozdagi asosiy xato N=3, N=4 toza va N=3 muddati tugagan / qayta o'ynash konfiguratsiyalari, xatolar byudjetlari qo'mitasiga mustaqil ravishda
- ko'rsatkich munosabatini mustaqil ravishda ko'rib chiqish, g'alati slot tanlovchilari, aktiv va kapsula bog'lanishlar, to'lov munosabatlari, kriptografiya va ko'p ma'lumotlar maydonining davlat usuli

Quruq va tozalashtirilgan dalillarni, tahdid modeli, protokol argumenti, cheklovlar, commit ID, asbob-uskuna tavsifi va audit hisobotlarini o'zgartirilmaydigan DOI tomonidan qo'llab-quvvatlanadigan artefaktda nashr etish. Repository testlari yolg'iz xususiyatni ishlab chiqarish uchun malakali CBDC hisob-kitob tizimiga aylantirmaydi.

Har bir xom xato o'tkazilishi va kechikish namunasida to'liq chiqarib yuborish commit, SHA-256 bitta tarkibiy biriktirilgan asbob-uskuna tavsifi va SHA-256 uning aniq ishtirokchilar soni konfiguratsiyasi bog'lanishi kerak. N = 2,3,4,8,16 ga ega bo'lgan bitta kanonik konfiguratsiya manifestini arxivlash; har bir kirish saqlangan konfiguratsiya bytlariga murojaat qilib, ma'lumotlar maydonida to'rtta tasdiqlovchi, 3 dan 4 ta quorum va majburiy imzolangan RS16 DA/RBC ni tasdiqlashi kerak. Bo'shatish tekshiruvchisi turli xil qurilma, apparat profili yoki tarmoq konfiguratsiyasi asosida ishlab chiqarilgan qisqartmalarni rad etadi. Har bir alohida yo'qotish, bosqich kesish va chidamlilik-krashi qatorida global darajada qayta ishlatilmaydigan aniq JSONL rekord ma'lumotlarini ham SHA-256 bilan bog'liq bo'lishi kerak. autentifikatsiyalangan nazoratchi va atomlik tutish artefaktlari. Bo'shatish tekshiruvchisi ushbu o'tkazuvlarni hal qiladi va satrlar ishga tushirish identifikatsiyasi, sinov ko'rsatkichi va parametrlariga, boshqaruvchining tan olinishi yoki tiklanish natijasiga mos kelishini talab qiladi, doimiy tekshirish sonini, Keyinchalik chiqarilgan p95/p99 taqqoslashlar ham candidatdan hardware, konfiguratsiya yoki o'lchov talablari farq qiladigan imzolangan boshlang'ich liniyani rad qiladi. Oxirgi tekshiruvchi MADs hisoblangan barcha percentillarni va deterministik ishonch intervallarini arxivga olingan xom namunalardan ajratilgan ma'lumotlar to'plamiga ishonishning o'rniga tiklaydi. Shunga o'xshab, u kanary manifestini qayta yuklaydi va har bir arxivlangan maxfiylik yuzasini mustaqil ravishda ko'rib chiqadi, shuning uchun hisobot faylni qayta bog'laganidan so'ng qo'yilgan sirli hujumni bosib chiqarolmaydi. Arxiv shuningdek, har bir zarur maxfiylik yuzi uchun to'g'ri chap va o'ng fayl yo'nalishlari, turlari, bayt uzunliklari va SHA-256 distektlarini bog'laydigan kanonik differensial juftlik manifestini ham o'z ichiga olishi kerak. Oxirgi tekshiruvchi mustaqil ravishda teng o'lchamlarni talab qiladi va JSON ommaviy shakllarini qayta hisoblaydi, shuning uchun o'sha o'lchovdagi tarkibiy sotuv yoki juft bo'lmagan differensial faylini sotuv to'g'risidagi hisobotni qayta yozish orqali yashirish mumkin emas.
