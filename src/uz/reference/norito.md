---
translation_locale: uz
translation_source: /reference/norito.md
translation_source_hash: b3b7c03bc0df3f7fa3df7e44b0ec8d755d615f9edca66bbcfe5613c33c8afbfe
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---
# Norito {#norito}

Norito bo ' lmoqda Iroha Kanonik seriallashtirish qatlamidir. Bu tugunlar, SDKs, CLI asboblar, Torii, Kura, va ishlab chiqarilgan artefaktlar to'g'ri bir xil foydali yuk bo'yicha kelishib olishlari kerak.

Foydalanish Norito ma'lumotlar konsensus, imzolash, hashing, chidamlilik yoki o'zaro-SDK Interoperabilitet. Foydalanish JSON oxirgi nuqta operatorlar, dashboardlar yoki tezkor debugging uchun inson tomonidan o'qilishi mumkin bo'lgan proyeksiyani ochiqchasiga taqdim etganda.

## Norito qaerda paydo bo'ladi {#where-norito-appears}

|Yer yuzi |Norito qanday qilib ishlatiladi |
| --- | --- |
|Transaksiyalar va soʻrovlar |Torii orqali yuborilgan imzolangan tranzaksiyalar va so'rovlar faydali yuklari Norito deb kodiflanadi. |
|Ibtido |`kagami genesis sign` boshlang'ichda yuklangan tugunlari bilan imzolangan `.nrt` blokini hosil qiladi. |
|Torii yozgan javoblar |`Accept: application/x-norito`dan foydalanib, ikkilamchi javoblarni yozishni qo'llab-quvvatlaydigan oxirgi nuqtalar. |
|SDKs | Rust, Python, JavaScript, Kotlin/Java, Swift, va Android mijozlar foydalanadi Norito qo'lda yig'ilgan baytlar o'rniga quruvchilar yoki bog'lovchilar. |
|Kura saqlash |Blok fayzli yuklar, tiklash yordamchi yozuvlari, ro'yxatlar va commit belgilari Norito ramkalashtirilgan ma'lumotlar sifatida saqlanadi. |
|Manifestolar |Nexus, ma'lumotlar mavjudligi, SoraFS, oqim va ilovalarga ko'zlangan manifestlar manzili imzolangan yoki hash bo'lishi kerak bo'lganda Norito dan foydalanadi. |
|Yoyish |Norito Streamingda Norito manifestlari, segment sarlavhalari, boshqaruv ramkalari va muvofiqlik sinov ma’lumotlaridan foydalanadi. |

Norito aqlli shartnoma tili emas, balki bitimlar, kontrakt qo'ng'iroqlari, manifestlar va API faydali yuklarni olib boradigan deterministik qadoq va kodek hisoblanadi.

## Foydali yukning modeli {#payload-model}

Tarmoq orqali uzatiladigan yoki diskda saqlanadigan har bir Norito payload header bilan ramkalanadi, undan keyin kodlangan payload baytlari keladi. Headersiz yoki bare payloadlar ichki hashing, benchmarklar va natijani uzatishdan oldin darhol header ichiga o‘raydigan yordamchi APIs uchun saqlanadi.

|Sarlavha maydoni |Oʻlcham |Maqsad|
| --- | ---: | --- |
|Sihr .|4 byt |ASCII `NRT0`, Norito bo'lmagan ma'lumotlarni oldindan rad etish uchun ishlatiladi. |
|Majordor |1 byte |Katta versiyani formatlash. Joriy payloadlar `0`dan foydalanadi. |
|Kam yoshli |1 byte |v1 uchun dekodlash ko'rsatmasi. Joriy qiymat `0x00`; joylashuvni bayroqlar tavsiflaydi. |
|Shema hash |16 bayt |O'ylanmagan yuklarni rad etish uchun typlangan dekoderlar tomonidan ishlatiladigan tur identifikatsiyasi. |
|Kompressiya |1 byte |`0 = None`, `1 = Zstd` Noma'lum qiymatlar rad etiladi. |
|Faydali yukning uzunligi |8 byte |Kichik-endyan `u64` sifatida siqilmagan foydali yuk uzunligi. |
|CRC64 |8 byte |CRC64-XZ siqilmagan foydali yukning cheklangan summasi. |
|Bayroqlar |1 byte |Kompakt uzunliklar, to'plangan jadvallar va to'plamlangan structs uchun layout bayroqlari. |

Sarlavha 40 bytdan iborat. Dekoderlar o'rnatilgan qiymatni rekonstruksiya qilishdan oldin sehr, versiya, qo'llab-quvvatlanadigan bayroq maskasi, foydali yuk uzunligi, checksum va sxema hashini tasdiqlaydi.

## Lay-out bayroqlari {#layout-flags}

Norito so'nggi sarlavha bytida layout tanlovlarini saqlaydi. Dastlabki v1 yordamchilari `COMPACT_LEN` (`0x02`) kompakt qiymat bo'yicha uzunlik prefikslari uchun emit qiladilar. So'rovchilar `flags = 0x00` bilan kodlashganda aniq belgilangan kenglik uzunligi prefiksilari o'qilishi mumkin.

|Bayroq |Hex |Status |Taʼsir|
| --- | ---: | --- | --- |
|`PACKED_SEQ` |`0x01` |Qoʻllab - quvvatlash |O'zgaruvchan o'lchamli to'plamlarni offset jadvali va yonma-yon ma'lumotlar bloklari bilan kodlaydi. |
|`COMPACT_LEN` |`0x02` |Dastlabki |Har bir qiymat uzunligi prefikslari uchun kanonik belgisiz varintlardan foydalanadi. |
|`PACKED_STRUCT` |`0x04` |Qoʻllab - quvvatlash |Kodlash natijasida hosil bo'lgan structslar to'plamlangan maydon yuklari sifatida. |
|`VARINT_OFFSETS` |`0x08` |Qoʻriqlangan |V1-da rad etilgan; paklangan sekvensiya kompensatsiyalari qat'iy kenglik `u64`. |
|`COMPACT_SEQ_LEN` |`0x10` |Qoʻriqlangan |V1-da rad etilgan; yuqori darajadagi ketma-ketlik uzunligi sarlavhalari qat'iy kenglik `u64`. |
|`FIELD_BITSET` |`0x20` |talablar bilan qoʻllab-quvvatlanadi |To'plangan struektlar uchun bit setini qo'shadi, shuning uchun faqat aniq o'lchamlarga muhtoj bo'lgan maydonlarda o'lchov prefikslari mavjud. `PACKED_STRUCT` va `COMPACT_LEN` talab qiladi. |

Bayroqlar aniqdir. Dekoderlar joylashishni foydali yukning shaklidan, kichik versiyadan yoki heuristikalardan xulosa qilmaydi. Noma'lum yoki haqiqiy bo'lmagan kombinatsiyalar rad etiladi, shuning uchun barcha tugunlar foydali yukni bir xil tarzda talqin qilishadi.

## Kodlash qoidalari {#encoding-rules}

Norito Iroha ma'lumotlar modelida ko'rsatilgan umumiy ma'lumot shakllari uchun deterministik layoutlardan foydalanadi:

- Xatcho'plar `[len][utf8-bytes]`; `len` qo'llanilgan bo'lsa, `COMPACT_LEN` dan keyin ketadi.
- `COMPACT_LEN` o'rnatilgan bo'lsa, har bir qiymat uzunligi ixcham varintdan foydalanadi.
- `COMPACT_LEN` mavjud bo'lmasa, har bir qiymat uzunligi 8 baytli little-endian `u64` bo'ladi.
- Joriy uzunlik sarlavhalari v1-da 8 baytli kichik endian `u64` o'rnatilgan.
- `Vec<u8>` bir bayt uchun bitta uzunlik o'rniga `[len_u64][raw-bytes]` sifatida kodlanadi.
- Paketlangan ketma-ketlarda `(len + 1)` monoton `u64` offsetlardan foydalanib, u bilan birga qatlamli elementning foydali yuklari ham uchraydi.
- Xaritalar `u64` belgisi bilan kirish raqamlarini kodlaydi va deterministik kalit tartibidan foydalanadi. `HashMap` yozuvlari kodlashdan oldin kalit bo'yicha tartibga solinadi; `BTreeMap` uning tabiiy tartibini ishlatadi.
- `BigInt` `u32` byet uzunligi va 512 bitli cap bilan kichik endin ikki-to'ldiruvchi byetlardan foydalanadi.
- `Numeric` `(mantissa, scale)` sifatida kodiflanadi, unda mantissa to'liq son qiymatini saqlaydi va o'lchamda qisman raqamlar soni saqlanadi.

Ushbu qoidalar imzo va hash uchun muhimdir. Ikkita SDKs bir xil mantiqiy operatsiyani yaratgan holda bir xil kanonik bytlarni ishlab chiqarishi kerak.

## Shema hashlari {#schema-hashes}

Norito fayl yuklari boshliqda 16 baytli sxema hashini o'z ichiga oladi. Andoza hash to'liq malakali tur nomidan kelib chiqadi. Struktural sxema hashingni qo'lga kiritadigan qurilmalar hashni kanonik sxemadan olib keladi.

Tiplangan dekoderlar sxema mos kelmaydiganligini rad etadi. Bu mijozlarni noto'g'ri turdagi haqiqiy Norito ramkani to'satdan dekodlashdan himoya qiladi va SDK sinov ma’lumotlari to‘plami nod ma'lumotlar modelidan aylanib ketganda odatdagidek xato usuli hisoblanadi.

## Kompressiya va tezlashtirish {#compression-and-acceleration}

Norito mantiqiy foydali yukni o'zgartirmasdan aniq va adaptiv siqishni qo'llab-quvvatlaydi:

|Xususiyat |Maqsad|
| --- | --- |
|`to_bytes` |Sarlavhani, undan keyin siqilmagan payloadni kodlaydi.|
|`to_compressed_bytes` |Zstd bilan kodlash va boshliqda siqish tagini yozib olish. |
|`to_bytes_auto` |Kompressiya arziydigan yoki yo'qligini aniqlash uchun deterministik heuristikani qo'llash. |
|CRC64 tezlashtirish |Har joyda portativ CRC64-XZ dan foydalanadi, mavjud bo'lganda x86_64 yoki aarch64 da PMULL CLMUL. |
|GPU CRC64 va siqish |Opsional Metal yoki CUDA yordamchilari katta yuklarni tezlashtirishlari mumkin, so'ngra CPU yo'nalishlariga qaytishlari mumkin. |

Hardver tezlashtirish hech qachon dekodlangan tarkibni o'zgartirmaydi. CRC va JSON tezlashtiruvchilar portativ chiqish bit-bitga mos bo'lishi kerak. Zstd ramka baytlari CPU va GPU kodlovchilar orasida farq qilishi mumkin, ammo dekodlangan foydali yuk va Norito sarlavha metadatalari tasdiqlash uchun aniqlanadi.

## JSON Qo'llab-quvvatlash {#json-support}

Norito Norito turi tizimidan chiqib ketmasdan JSON kerak bo'lgan yakuniy nuqtalar va asbob-uskunalar uchun mahalliy JSON to'plamini o'z ichiga oladi.

|JSON xususiyati |Foydalanish holati |
| --- | --- |
|`norito::json::{to_json, from_json}` |Deterministik JSON kodlash/dekodlash. |
|Goʻzal va yozuvchi yordamchilari |CLI chiqishi, sinov ma’lumotlari va streaming `std::io` integratsiyasi. |
|DOM qiymatlari |Norito ning JSON qiymat modeli orqali dasturiy ta'minot manipulyatsiyasi. |
|Tez yozilgan JSON |Issiq DTO yo'nalishlari uchun tarkibiy lentga asoslangan dekodlash/kodlash. |
|Null nusxa oʻquvchi |Agar iloji bo'lsa, kirishdan simlarni qarz oladigan belgini skanerlash. |
|1-bosqich tezlatgichlari |AVX2, NEON, Metall yoki CUDA tarkibiy indeksatsiyalar skalar o'tish bilan. |

Iroha kodi `norito::json` yordamchilarini API tizilgan fayzli yuklar uchun afzal ko'rsatishi kerak. Ishlab chiqarish yo'nalishlariga oddiy `serde_json` qo'shish SDKs va Torii ekstraktorlari tomonidan kutilayotgan sxema va maydonda ishlash xatti-harakatidan chetlanish xavfi tug'diradi.

## Ishlab chiqarish qo'llab-quvvatlash {#derive-support}

Rust ma'lumotlar turlari odatda qo'l kodidan ko'ra chizilgan makroslardan foydalanadi. Chizilgan qatlam Norito ikkilik kodeklarni, sxemalar va JSON yordamchilarini ishlab chiqarishi mumkin.

Jismoniy maydon atributlari quyidagilardir:

|Atribut |Taʼsir|
| --- | --- |
|`#[norito(rename = "other")]` |Shema va JSON moslashuvchanligi uchun barqaror seriyalangan nomdan foydalanadi. |
|`#[norito(skip)]` |Encoder maydonni tashlab ketadi. Decoder uning `Default` qiymatini beradi. |
|`#[norito(default)]` |`Default` kodlangan fayzli yukda maydon yo'q bo'lganda ishlatiladi. |
|`#[norito(skip_serializing_if = "...")]` |Predikat to'g'ri kelganda JSON maydonlarini chiqarib tashlaydi, ayni paytda deterministik dekodlash andozalarini saqlab qoladi. |

Derivlar shuningdek, iloji boricha kodlangan uzunlik va to'g'ri uzunlik hisob-kitoblarini namoyish etadi. Kodlovchilar bu g'amxo'rliklarni rezervlash va qo'shimcha nusxalardan qochish uchun ushbu g'ayratlardan foydalanadilar.

## Qo'shmaxonalar {#crate-feature-families}

Iroha yoki SDK bog'lanishlarini manbadan qurishda, Norito xususiyatlari yordamchi va tezlatgichlarni tanlashadi:

|Karakteristiklar oilasi |Bu nimaga imkon beradi ?|
| --- | --- |
|`derive` |Ikkilamchi, sxema va JSON chiziqlari uchun qayta eksport qilingan protsessual makroslar. |
|`compression` |Zstd sarlavhalar uchun qo'llab-quvvatlash. |
|`packed-seq` |Offset jadvallaridan foydalanib toʻplangan kolleksiya layoutlari. |
|`packed-struct` |To'plamlangan turlari ishlab chiqarilgan tuzilma layoutlari. |
|`compact-len` |Varint uzunligi uchun prefikslar. |
|`columnar` |Norito ustun bloklari, o'zgaruvchan AoS/NCB satr kodeklari va skan qilish uchun og'ir yo'nalishlar uchun qarz olingan ko'rinishlar; andoza `node-codec` xususiyatlar to'plamida. |
|`strict-safe` |Foydalanishi mumkin bo'lgan yo'llardagi panikalarni tarkibiy xatolarga aylantiradi. |
|`simd-accel` |CPU tezlashtirish, agar mavjud bo'lsa, deterministik qaytish bilan. |
|`json` |Asosiy JSON parser, yozuvchi, DOM, bosilgan chizig'lar va tezkor yo'nalishlar. |
|`json-std-io` |O'quvchi va yozuvchi yordamchilari JSON to'plamida qatlamli. |
|`metal-stage1`, `cuda-stage1` |O'rinli GPU JSON tarkibiy indeks orqa ko'rsatkichlari. |
|`metal-stage2` |JSON tuzilish lentasi uchun metal metadatalarni tasniflash; |
|`metal-crc64`, `cuda-crc64` |Katta yuklar uchun GPU CRC64 yordamchilar; |
|`gpu-compression` |Katta yuklar uchun metal yoki CUDA Zstd tezlashtirish. |
|`stage1-validate` |Tezlashtirilgan JSON tarkibiy indekslarni skalar ishlab chiqarishga nisbatan taqqoslovchi debug-validatsiya. |

SDKs va nashr profillari o'rtasida xususiyatlarning mavjudligi farq qilishi mumkin. Uyning formatini mahalliy qurilish bayroqlari emas, balki sarlavha va sxema boshqaradi.

## Torii va Norito RPC {#torii-and-norito-rpc}

Torii ko'rsatkichlar JSON ko'plab operator yo'nalishlari uchun, lekin ikkilamchi yo'nalishlardan foydalanilgan Norito. Toʻgʻri yozib olingan oqim uchun ommaviy axborot vositalari turi Norito HTTP jismlar `application/x-norito`.

Keyingi nuqta Norito belgisi bilan qabul qilingan yoki qaytarilganda ushbu sarlavhalarni ishlating:

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

Agar oxirgi nuqta ikkala ta'rifni ham qo'llab-quvvatlasa, mijozlar aniq preferentlar ro'yxatini yuborishlari mumkin:

```http
Accept: application/x-norito, application/json
```

Dekodlash muvaffaqiyatsizliklari Torii xatosi sifatida paydo bo'ladi va telemetriya yordamida hisoblanadi. Oddiy sabablarga haqiqiy emas sehr, qo'llab-quvvatlanmagan versiya, qo'llanilmaydigan xususiyatlar bayrog'i, tekshiruvlar soni mos kelmasligi, noto'g'ri shakllangan UTF-8, haqiqiy emas enum tag va sxema mos kelmasligi kiradi.

Norito RPC transport transport konfiguratsiyasi orqali tanlanadi. Operator dashboardlari so'rovning kechiktirilishi, xatolar, faol aloqalar, javob bytlari va `torii_norito_decode_failures_total` harakatini JSON trafikidan alohida kuzatishlari kerak.

## Norito Dasturlash {#norito-streaming}

Norito Streaming ommaviy axborot vositalari va real vaqt transport yuzalariga ham xuddi shunday deterministik yondashuvni joriy etadi.

|Streamlash xususiyati |Maqsad|
| --- | --- |
|Manifestolar |Segment majburiyatlarini, maxfiylik yo'nalishlarini, imkoniyatlarni, kodek profilini, shifrlash paketini va tarkib kalitining metadatalarini bildiring. |
|Segment boshliqlari |Segment raqami, davomiyligi, qismlar soni, vaqt o'tkazish, entropiya rejimi, audio qisqartma va Merkle ildizlari. |
|Kattalikdagi majburiyatlar |Ko'rguvchilar va relaylar xizmat ko'rsatishdan yoki kodlashdan oldin faydali yuk qismlarini manifestga qarab tekshirishlari mumkin. |
|Boshqaruv kadrlari |Manifest e'lonlar, fikr-mulohazalar, asosiy yangilanishlar va imkoniyatlar muzokaralarini olib borish. |
|HPKE asosiy yangilanishlar |Transport sirlarini muzokaralar bo'yicha almashtirish va monoton ravishda ko'payib boruvchi hisob raqamlari yordamida aylantiring.|
|Mulohazakorlik muzokaralari |Qo'llab-quvvatlanadigan xususiyat bitlari, datagram cheklovlari, takrorlash ketma-ketligi va maxfiylik talablarini kesishtiradi. |
|FEC va fikr bildirish |Yo'qotish real vaqt yo'nalishlari uchun deterministik qabul qiluvchi hisobotlari va parity qarorlaridan foydalanadi. |
|muvofiqlik vektorlari |Tillararo sinov ma’lumotlari SDKs bir xil manifestlar, segmentlar va entropiya oqimlarini dekodlashini isbotlaydi. |

Streamingga oid kodeklar va entropiya profillari asosiy Norito transaksiya/so'rov formatidan ajralib turadi, ammo ularning manifestlari va nazorat ma'lumotlaridan hali ham Norito foydalaniladi, shuning uchun yo'naltirish, hisob-kitob qilish, takrorlash va audit dalillarini qayta tiklash mumkin.

## Operativ yo'l-yo'riq {#operational-guidance}

- SDK qurilmalari va hosil bo'lgan bog'lanishlarni qo'lda tayyorlangan Norito bytlarga qaraganda afzal ko'rish.
- Shema mos kelmasligini o'tkinchi tarmoq muvaffaqiyatsizligi sifatida emas, balki versiya yoki sinov ma’lumotlari muammosi sifatida ko'rib chiqish.
- `.nrt`, `.norito` va manifest artefaktlarini ularni yaratgan reliz yoki hodisa to'plamida arxivlang.
- Imzolangan, hashlangan yoki doimiy saqlangan ma'lumot uchun Norito formatini haqiqat manbai sifatida saqlang. Dashboardlar va qo'lda tekshirish uchun JSON proyeksiyalaridan foydalaning.
- Yangi Torii oxirgi nuqtani qo'shganingizda, u JSON, Norito yoki ikkalasi ham qabul qilinishini hujjatlashtiring va `/openapi.json` da qo'llab-quvvatlanadigan tarkib turlarini ko'rsating.
- Tezlatgichni yoqishdan oldin scalar natijaga nisbatan parity sinovlarini o'tkazing. Tezlatgich ishlamay qolsa, deterministik scalar fallbackdan foydalaning. Payload semantikasi o'zgarmasligi kerak.

## Bogʻliq sahifalar {#related-pages}

- [Torii oxirgi nuqtalari](/uz/reference/torii-endpoints.md)
- [Ibtido ko'rsatkichi](/uz/reference/genesis.md)
- [Ma'lumotlar modeli sxemasi](/uz/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK](/uz/guide/tutorials/javascript.md)
- [Python SDK](/uz/guide/tutorials/python.md)
- [Swift va iOS SDK](/uz/guide/tutorials/swift.md)

## Yuqoridagi ma'lumotlar {#upstream-references}

- [Norito formatining moslamalari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/norito.md)
- [Norito crate README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/norito/README.md)
