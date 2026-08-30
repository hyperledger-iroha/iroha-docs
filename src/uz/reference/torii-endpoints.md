---
translation_locale: uz
translation_source: /reference/torii-endpoints.md
translation_source_hash: 995701cfca9594b88a0da73a5b582c75c5962449a9ccf150e65738d3656d4f02
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii Oxirgi nuqtalar {#torii-endpoints}

Torii bo ' lmoqda HTTP, SSE, va WebSocket uchun darvoza Iroha 3. U ikkalaga ham xizmat qiladi . APIs va operator oxirgi nuqtalari.

Amaldagi protokol qoidalari quyidagilardir:

- kanonik ikkilamchi format Norito
- ko'plab oxirgi nuqtalar JSON ni ham qo'llab-quvvatlaydi, chunki siz `Accept: application/json`ni yuborasiz.
- Metriklar Prometheus formatida ko'rsatilgan

Format tafsilotlari, tarkib muzokaralari, layout bayroqlari, sxema hashlari va Norito RPC yo'l-yo'riq uchun [Norito ko'rsatkichini ko'ring ](/uz/reference/norito.md).

## O'zaro o'xshash maqsadlar {#common-endpoints}

|Keyingi nuqta |Format | Maqsad                                                          |
| ------------------------------------- | -------------- | ---------------------------------------------------------------- |
|`POST /v1/pipeline/transactions` |Norito |Imzolangan bitimni taqdim etish |
|`POST /v1/query` |Norito |Imzolangan soʻrovni yuborish |
|`GET /v1/events/ws` |WebSocket |Tadbirlar oqimiga obuna boʻling |
|`GET /v1/events/sse` |SSE |SSE o'tkaziladigan voqealar oqimlariga obuna bo'ling. |
|`GET /v1/blocks/stream` |WebSocket |Joʻnatilgan bloklar oqimi |
|`GET /v1/peers` |JSON |Torii tomonidan aniqlangan tengdoshlar ro'yxati |
|`GET /livez` |Matn |Faqatgina jarayonlar bilan ishlash; bu protokolga tayyorlikni anglatmaydi |
|`GET /readyz` |JSON |To'liq nod tayyorligi, shu jumladan majburiy oflayn naqd pul tekshiruvlari |
|`GET /health` |JSON |Tayyorlik sondasi xuddi shu oflayn naqdsiz invariant bilan |
|`GET /v1/api/version` |Matn |Joriy blok sarlavhasi versiyasi |
|`GET /status` |Norito yoki JSON |Yuqori darajadagi diagnostika holati; JSON soʻrovini aniqlab oling |
|`GET /metrics` |Prometheus |Prometheus scraping oxirgi nuqtasi |
|`GET /v1/schema` |JSON |Maʼlumotlar modeli sxemasi xatchoʻpchalari |
|`GET /openapi` yoki `GET /openapi.json` |JSON |Aktiv Torii HTTP yo'nalishlari uchun OpenAPI hujjat |
|`GET /v1/parameters` |JSON |Nukl parametrlari rasmga olish |
|`GET /v1/node/capabilities` |JSON |Nukllar qobiliyati va ma'lumotlar modeli metadatalari |
|`GET /v1/time/now` |JSON |Nodular devor soatini koʻrish |
|`GET /v1/time/status` |JSON |Vaqt sinxronlashtirish holati |

SSE so'rovi uchun mahalliy oqimni qo'shib, o'rnatilgan orqaga qaytarish:

```http
Accept: text/event-stream, application/json
```

Torii avval so'rov qatlamida JSON yoki Norito ifodalarini muzokara qiladi, so'ngra mahalliy `text/event-stream` javobini tasdiqlaydi. Shuning uchun faqat `text/event-stream` yuborish `406` bilan rad etiladi; [ oqim tadbirlari retseptasi ](/uz/cookbook/stream-events.md) to'liq boshliqdan foydalanadi.

`/openapi` sxemada aks ettirilgan yo'nalishlar uchun asosiy ishlab chiqilgan shartnoma bo'lib, to'liq operatsion-sonda inventar emas. Joriy hujjatda `/livez` va `/readyz` qoldiriladi va uning `/health` tavsifi tayyorlik ko'rsatuvchisida orqaga borishi mumkin. Yo'nalish klientlarini jonli hujjatdan yarating, lekin faollik va tayyorlikni to'g'ridan-to'g'ri ishlamoqchi nodga va qo'lga kiritilgan boshqaruvchilariga qarshi tasdiqlang. To'g'rimi yuzasi hali ham qurilish xususiyatlari va ish vaqti konfiguratsiyasidan bog'liq. O'sha jonli hujjatni yuklash, JSON yo'nalishlarini sinovdan o'tkazish, curl so'rovlarini nusxa olish va joriy sxemadan mijoz kodini yaratish uchun [Torii API konsolini ](/uz/reference/torii-api-console.md) ishlating.

## Taira yo'nalishlarini sinab ko'ring {#try-live-taira-routes}

Umumiy Taira testnet dastur mijozlari faqat o'qish uchun ishlatadigan xuddi shu Torii JSON yuzasini ochadi. Ushbu buyruqlar uchun kalitlar talab qilinmaydi:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS -H 'Accept: application/json' \
  "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

Hozirgi jahon holatiga qaraganda manzilni sinab koʻring:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Agar ommaviy testnet yo'nalishi `502` ni qaytarsa, vaqt o'tib ketsa yoki to'yilgan navbat haqida xabar bersa, uni oxirgi nuqtalar mavjudligi muammosi sifatida ko'rib chiqing va keyinchalik mijoz kodingizni debug qilishdan oldin qayta urinib ko'ring.

## Qoʻshma fikrlar va ish vaqti yakuniy nuqtalari {#consensus-and-runtime-endpoints}

|Keyingi nuqta |Format | Maqsad |
| --- | --- | --- |
|`GET /v1/sumeragi/commit-certificates` |JSON |So ' nggi majburiyat sertifikatlari qisqartmalari |
|`GET /v1/sumeragi/validator-sets` |JSON |Toʻgʻrilash vositasi tarixini koʻrsatish |
|`GET /v1/sumeragi/validator-sets/{height}` |JSON |Validator blok balandligida oʻrnatilgan |
|`GET /v1/sumeragi/status` |Norito yoki JSON |Konsensusning batafsil holati fotosurati |
|`GET /v1/sumeragi/status/sse` |SSE |Tinchlik bilan kelishib olish holati oqimi |
|`GET /v1/sumeragi/leader` |JSON |Hozirgi rahbar maʼlumotlari |
|`GET /v1/sumeragi/qc` |Norito yoki JSON |So ' nggi quorum-sertifikatining qisqartmasi |
|`GET /v1/sumeragi/checkpoints` |JSON |Konsensus tekshiruv punktlarining qisqacha ma ' lumotlari |
|`GET /v1/sumeragi/consensus-keys` |JSON |Aktiv konsensus kalitlari |
|`GET /v1/sumeragi/bls_keys` |JSON |Aktiv BLS konsensus kalitlari |
|`GET /v1/sumeragi/phases` |JSON |Faza boʻyicha soʻnggi latency namunasini koʻrsatish |
|`GET /v1/sumeragi/rbc` |JSON |RBC o'tirish va uzatish ma'lumotlari |
|`GET /v1/sumeragi/rbc/sessions` |JSON |Aktiv RBC o'tkaziladigan fotosurat |
|`GET /v1/sumeragi/pacemaker` |JSON |Pacemakerning holati |
|`GET /v1/sumeragi/params` |JSON |Zilziladagi joriy parametrlar Sumeragi |
|`GET /v1/sumeragi/collectors` |JSON |Deterministik kollektor rejasi fotosuratlari |
|`GET /v1/sumeragi/key-lifecycle` |JSON |Konsensus kalit hayotiy davrining holati |
|`GET /v1/sumeragi/telemetry` |JSON |Konsens telemetriyasini koʻrish |
|`GET /v1/sumeragi/evidence` |JSON |Ko'rsatkichlar ro'yxati, tanlov asosida so'rov satrlari bilan filtrlangan |
|`GET /v1/sumeragi/evidence/count` |JSON |Koʻrsatkichlar soni |
|`POST /v1/sumeragi/evidence/submit` |JSON |Konsensusga asoslangan dalillarni taqdim etish |
|`GET /v1/sumeragi/commit_qc/{hash}` |Norito yoki JSON |Blok hash uchun QC rekordni oʻrnating |
|`GET /v1/runtime/abi/active` |JSON |Aktiv ishga tushirish vaqti ABI tavsifchisi |
|`GET /v1/runtime/abi/hash` |JSON |Aktiv ishga tushirish vaqti ABI hash |
|`GET /v1/runtime/metrics` |JSON |Ish vaqti maʼlumotlarini koʻrish |
|`GET /v1/runtime/upgrades` |JSON |Ish vaqti yangilanish roʻyxati |
|`POST /v1/runtime/upgrades/propose` |JSON |Ish vaqti yangilanishini taklif qiling |
|`POST /v1/runtime/upgrades/activate/{id}` |JSON |Tartib qilingan ishga tushirish vaqti yangilanishini faollashtirish |
|`POST /v1/runtime/upgrades/cancel/{id}` |JSON |Tartib qilingan ishga tushirish vaqti yangilanishini bekor qilish |

## App va SORA yo'nalishidagi oilalar {#app-and-sora-route-families}

Torii dasturga mos xususiyatlar to'plami bilan qurilganda, u qidiruvchilar uchun qo'shimcha JSON oilalarini, SORA xizmatlarini, ko'prik oqimlarini, dalillarni va saqlashni ochib beradi. Ushbu oilalarning barchasi har bir tarmoq profilida yoqilmaydi.

`/openapi` ishlab chiqilgan app-API katalogida ro'yxatdan o'tgan yo'nalishlarni tasvirlaydi; u tarkibida mavjud bo'lgan yo'nalishlar uchun vakolatli, balki har bir yo'nalishga mo'ljallangan emas Xususan, ommaviy mahalliy SoraFS CID va yaxshi ma'lum yo'nalishlar ushbu ishlab chiqarilgan hujjatning tashqarisida o'rnatilgan va to'g'ridan-to'g'ri tekshirilishi kerak.

|Yoʻnalish oilasi | Maqsad                                                                                                                   |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|`/v1/accounts/`, `/v1/domains/`, `/v1/assets/*` |JSON o'qishlar, so'rov yordamchilari, onboarding yordamchilari va portfel yoki egalar ko'rinishi |
|`/v1/nfts/`, `/v1/rwas/`, `/v1/confidential/*` |NFT, real dunyo aktivlari va maxfiy aktivlar ko'rinishi |
|`/v1/aliases/`, `/v1/assets/aliases/`, `/v1/sns/`, `/v1/identifiers/` |Ism, alias va identifikator rezolyutsiyasi |
|`/v1/explorer/*` |Explorerga yoʻnaltirilgan hisobvaraq, aktiv, blok, tranzaksiya, koʻrsatma, metrika va oqim koʻrinishlari |
|`/v1/transactions/`, `/v1/pipeline/`, `/v1/iso20022/*` |Transaksiya tarixi, quvurni tiklash yoki holati va ISO 20022 yordamchilar |
|`/v1/contracts/*` |Shartnoma kodi, ishga tushirish, paketlash, qo'ng'iroq qilish, ko'rish, voqea, faoliyat, ro'yxatga olish va davlat yo'nalishlari |
|`/v1/multisig/`, `/v1/controls/` |Multisig takliflari, ma'qullash va o'tkazib yuborishni nazorat qilishda yordamchilar |
|`/v1/bridge/`, `/v1/ledger/`, `/v1/proofs/*` |So'nggi muddat, holatni tasdiqlash, blokni tasdiqlash, dalillarni saqlash va dalillar so'rovini olish yo'nalishlari |
|`/v1/da/*` |Ma'lumotlar mavjudligi qabul qilinishi, manifestlar, dalil siyosati, majburiyatlar va aniq maqsadlar |
|`/v1/zk/*` |ZK ildizlar, dalillarni tekshirish, IVM dalillarini tasdiqlash, ovozlarni hisobga olish, tekshiruv kalitlari, dalillarni qayd etish va qo'shimchalar  |
|`/v1/gov/`, `/v1/ministry/` |Boshqaruv takliflari, ovoz berish notasi, kengashning davlati, himoyalangan nomlar maydonlari, kun tartibidagi takliflar, qonun qabul qilinishi va yakunlanishi |
|`/v1/nexus/`, `/v1/sccp/` |Nexus yo'nalish, ma'lumotlar maydoni va to'liq zanjirli sinov yordamchilari |
|`/v1/musubi/*` |Musubi paketlar reyestrini oʻqish va koʻrsatmalarni yaratish |
|`/v1/subscriptions/*` |Obunalik rejalari, obunalik hayot davri, foydalanish va yordamchilarni to'lash |
|`/v1/sorafs/`, `/sorafs/`, `/.well-known/sorafs/*` |SoraFS provayderni kashf etish, quvvatni tasdiqlash, pinning qilish, saqlash va ommaviy tarkibni xizmat ko'rsatish |
|`/v1/soracloud/`, `/v1/soradns/`, `/soradns/`, `/api/` |SoraCloud xizmat hayoti davri, xususiy hisoblash/model oqimlari, ommaviy kashfiyot va uyushtirilgan ilovalarni yo'naltirish |
|`/v1/connect/`, `/v1/vpn/` |Iroha Qo'shish seanslari, WebSocket transport, VPN uchrashuvlar, profillar va rasmga ega bo'lish |
|`/v1/app-api/`, `/v1/api/`, `/v1/content/*` |App API bog'lanish va paket/CID tomonidan qo'llab-quvvatlanadigan tarkib yo'nalishi |
|`/v1/operator/*`, `/v1/mcp` |Operatorning tasdiqlanishi va mahalliy MCP JSON-RPC ko'priklari |
|`/v1/offline/`, `/v1/repo/`, `/v1/space-directory/`, `/v1/ram-lfe/` |Offline tayyorlik, ombor shartnomalari, ma'lumotlar maydonining manifestlari va [RAM-LFE yordamchilar ](/uz/blockchain/ram-lfe.md#torii-routes)  |
|`/v1/kaigi/`, `/v1/webhooks/`, `/v1/notify/`, `/v1/telemetry/` |Hamkorlik, veb-qo'shish, push xabardorlik va jonli telemetri integratsiyalari |

## Hisobvaraqlarni tasdiqlash, ko'rinishi va Explorer cursorlari {#account-authentication-visibility-and-explorer-cursors}

### Ilova hisobini soʻrash protokollari {#app-account-request-protocol}

Ilovalarga mos yo'nalishlarda autentifikatsiya boshliqlari, bitta to'g'ridan-to'g'ri bir xil kalitli dalil yoki bitta ko'p nishonli guvohlar qabul qilinmaydi.

To'g'ridan-to'g'ri isbot olish uchun to'rtta boshliqni birga yuboring:

- `X-Iroha-Account`: aniq kanonik kichik harfli `0x` hisob manzili hex yoki faol kanonik ASCII hisob aliasi. I105 matni HTTP maydon qiymati sifatida xavfsiz emas; ushbu hisob uchun kanonik hex sozlashdan foydalaning.
- `X-Iroha-Signature`: qat'iy padded-base64 imzo fayzli yuk.
- `X-Iroha-Timestamp-Ms`: konfiguratsiya qilingan o'zgaruvchanlik oynasida milisecondlar bo'lgan kanonik imzalanmagan o'nlik Unix vaqt belgisi.
- `X-Iroha-Nonce`: 1 dan 256 gacha bosilishi mumkin bo'lgan ASCII bytlar (`0x21` dan `0x7e`gacha), takrorlash oynasida yagona.

Ro'yxatdan o ' tkazilgan bitta kalit boshqaruvchisi ushbu baytlarni imzolaydi:

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

Canonical so'rov konstruksiyasi xom so'rovni `application/x-www-form-urlencoded` (`+` o'rtacha  sifatida tahlil qiladi space), foiz - uning juftlarini dekodlaydi, ularni `(key, value)` bilan sinflashtiradi va form-kodlashni qayta amalga oshiradi. Protokolda eng ko'p 64 ta dekodlangan juftlik va 64 ta KiB xom so'rov matnlari mavjud. Jismoniy baytlar to'g'ri o'tkazilgan bo'ladi. O'rnatilgan 32-baytli tarmoq ID va katta yo'l o'rtasidagi ajratgich qo'shmang.

V1 tekshiruvchisi shuningdek usul belgisini 32 bytga, foizli kodlangan so'rov yo'lini 64 KiB ga cheklaydi. va to'g'ridan-to'g'ri hisob qaydnomasi 36 KiB raqamiga ega bo'lgan. Hisobvaraq aliaslari uchta nom segmentlari va ularning ajratib qo'yuvchilaridan iborat qattiqroq tarkibiy chegaraga ega. Qoidani o'tkazib yuborish imzolarni tekshirishdan yoki manba hajmini taqsimlashdan oldin haqiqiyligini tasdiqlamaydi.

Multisig boshqaruvchisi o'rniga `X-Iroha-Witness` ni qat'iy padded-base64 kanonik Norito sifatida jo'natishi va `X-Iroha-Signature`, `X-Iroha-Timestamp-Ms` va `X-Iroha-Nonce` dan chetda qoldirishlari kerak. `X-Iroha-Account` bu shaklda ixtiyoriy; mavjud bo'lganda u guvohning `subject_account` ga teng bo'lishi kerak. `CanonicalRequestWitnessV1` tarkibida `schema_version`, `subject_account`, `timestamp_ms`, `nonce`, aniq tarmoq so'rovi byetlarining Iroha `Hash` bahtlari mavjud, lekin yangilik maydonlari yo'q va maksimal 64 a'zo imzolar. Har bir a'zo o'sha yukning kanonik Norito kodlashini imzolar qatoridan tashqari imzolaydi. Tahqiqlangan a'zolar hisobning amaldagi multisig siyosatini qondirishlari kerak. Kodlangan guvoh 1 MiB ga cheklanadi.

To'g'rilik sarlavhalarini taqdim etmaslik anonim kirishni tanlaydi. Har qanday qisman, qarama-qarshi, takrorlangan, noto'g'ridan bo'lgan, eskirgan yoki qayta o'ynagan dalillarni taqdim etish to'g'risida tasdiqlanish muvaffaqiyatsiz tugadi; u hech qachon anonim ko'rinishga qaytmaydi.

### Operatorning talab protokoli {#operator-request-protocol}

Operator tomonidan tasdiqlangan sifatida belgilangan yo'nalishlar uchun to'rtta singleton boshliqlari kerak:

- `x-iroha-operator-public-key`: kanonik Iroha ko'p martalik ochiq kalit.
- `x-iroha-operator-timestamp-ms`: kanonik imzolanmagan o'nlik Unix vaqt belgilari millisekundlarda.
- `x-iroha-operator-nonce`: 1 dan 256 gacha bosilishi mumkin bo'lgan ASCII bytlar, takrorlash oynasida o'sha kalit uchun yagona.
- `x-iroha-operator-signature`: qat'iy padded-base64 imzo fayzli yuk.

Sarlavha qiymatlari atrofdagi oq maydonni o'z ichiga olmaydi. Operator kalit belgilari:

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

Yo'l, so'rov, jism, vaqt belgisi va nonce qoidalari ilova protokoli tomonidan ishlatiladigan bir xil kanonik qoidalardir. Shunga o'xshab, kalitni `[torii.operator_signatures]`: roʻyxatga oling `allowed_public_keys`, yoki ochiqchasiga ruxsat berish `allow_node_key` nod kalitidan foydalanganda. Qayta o'ynash kechasi to'yilganda, Torii iltimosni rad etadi `503 Service Unavailable`. O'z navbatida WebAuthn yoki mTLS operatorini tasdiqlash qo'shimcha omil bo'lib, hech qachon ushbu aniq iltimos imzosi o'rniga olinmaydi.

ISO 20022 yo'nalishlari ikki mustaqil tekshiruvni amalga oshiradi. Talab dastlab ushbu operator ruxsatnomalari va imzo protokolini o'tkazishi kerak; ISO boshqaruvchisi keyinchalik quyida tasvirlangan aniq ishtirokchi yoki auditorlik rolini egallashi uchun bir xil kalitni talab qiladi.

### Ledgerning koʻrinishi va Explorer cursorlari {#ledger-visibility-and-explorer-cursors}

Ilovalarga ko'ra katta kitobni o'qish uchun yuqoridagi tanlovli ilova hisobining chegaralaridan foydalaning. Imzolangan so'rov faqat ommaviy sifatida konfiguratsiyalangan ma'lumotlar maydonlarini oladi. Amaldagi imzolangan soʻrov qo'shiladi So'rovchining joriy UAID bilan bog'langan ma'lumotlar maydonlari, har bir cheklangan ma'lumot maydonining aniq `CanReadRestrictedDataspace { dataspace }` ruxsatnomasi bilan nomlanishi yoki hisobda `CanReadAllLedgerData` bo'lgan barcha yo'nalishlar.

Bir xil ko'rinish obʼektlari hisob, domen, aktiv-maʼrifi, aktiv, NFT, RWA, egasi va Explorerni oʻqiydi. Yoʻqolgan obyekt va chaqiruvchining ko'rinadigan yo'llaridan tashqarida bo'lgan object niyat bilan ajratib bo'lmaydi. Amalga oshirilgan tranzaksiya va ko'rsatmalar tarixi faqat tranzaksiya uchun qayd etilgan har bir yo'nalish bosqichini ko'rishganda ko'rsatiladi . shu sababli, hatto bitta ishtirokchi oyoq qo'ng'iroq qiluvchining qamrovidan tashqarida bo'lganda yashirilgan; yo'qolgan, eskirgan yoki noto'g'ri ko'rsatilgan yo'naltirish konteksti faqat global o'quvchi uchun ko'rinadi.

Olti butun dunyo tomonidan qo'llab-quvvatlanadigan Explorer kolleksiyalarida shaffof bo'lmagan kanonik base64url tugmachalar kursorlari ishlatiladi. Standart sahifa chegarasi 25, maksimal 100 va bitta sahifa eng ko'pida 512 nomzod tugmachasini tekshiradi. Har bir kursor o'zining to'plami, filtrlari, kanonik oxirgi kalit va chaqiruvchining ko'rinadigan yo'l-qoidasi bilan bog'liq, shuning uchun uni boshqa so'rovda yoki chaqiruvchining ko'rinishi o'zgarganidan keyin takrorlash mumkin emas.

Blok, operatsiya, so'nggi tranzaksiya, ko'rsatma va so'ngki ko'rsatmalar tarix kursorlari qo'shimcha ravishda o'rnatilgan fotosurat balandligi va blok hashini belgilaydi. Javoblar `pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor` va `pagination.has_more` ni aniqlaydi. Torii boshqa yo'nalish yoki filtr setini, o'zgartirilgan ko'rinishni o'chirishni yoki nod endi tasdiqlay olmaydigan fotosuratni kursorni rad etadi. blokirovka qiluvchi ishchi ishlayotganda tarixni skanerlash Torii so'rov qabul qilish ruxsatnomasida qoladi.

Eksplorator WebSocket oqimlar filtrlangan qisqartmalarni chiqaradi va ko'rinishni qayta hisoblashda katta ma'lumotlar huquqlarini o'zgartirish. `GET /v1/blocks/stream` yo'nalish boshqacha: u to'liq imzolangan bloklarni chiqaradi, talab qiladi `CanReadAllLedgerData` qo'l urish paytida, agar ruxsatnoma keyinchalik bekor qilinsa, yopiladi. Ma'lumotlar maydonini ko'rib chiqayotgan kashfiyotchi uchun mahalliy oqishni ishlatmang.

## ISO 20022 ko'prik {#iso-20022-bridge}

Torii ISO 20022 ko'prini `/v1/iso20022/*` ostida qo'llaydi, agar dasturga qaraydigan API va ko'prikni ishga tushirish vaqti yoqilgan bo'lsa. Ko'prik niyat bilan: bu umumiy maqsadga mo'ljallangan ISO 20022 clearing gateway emas, balki tanlangan to'lov xabarlarini Iroha imzolangan o'tkazmalarga aylantirish va ularning katta qog'ozdagi holatini kuzatish uchun qo'llab-quvvatlanadigan kichik guruhdir.

So'rovlarni qabul qilishdan oldin uzoq muddatli lokal `torii.iso_bridge.store_dir` ni konfiguratsiya qiling. Konfiguratsiya maydoni faqat o'qish yoki tashxis uchun ishlatilishi mumkin bo'lgan nodni ishga tushirish imkoniyatiga ega: har bir autentifikatsiya qilingan ISO taqdimot direktoriyani talab qiladi va qat'iylik yo'q bo'lganda yoki takrorlash qabr tomi yoki boylik bilan yozilgan yozish muvaffaqiyatsiz tugasa, qayta tiklanishi mumkin bo'lgan `503 Service Unavailable` qaytaradi.

### Torii ISO 20022 Yakuniy nuqtalar {#torii-iso-20022-endpoints}

|usuli va oxirgi nuqtasi | Maqsad |
| --- | --- |
|`POST /v1/iso20022/pacs008` |FI-to-FI mijoz kreditini o'tkazish va moslashtirilgan Iroha aktivni o'tkazish |
|`POST /v1/iso20022/pacs009` |FI dan FI ga PvP yoki qimmatli qog'ozlar bilan bog ' liq naqd pul mablag ' lari uchun ishlatilgan kredit o ' tkazmasini taqdim etish |
|`POST /v1/iso20022/pacs002` |Qarzdorga tegishli toʻlov holatini koʻrsatishni taqdim etish; hisob-kitob qilish uchun majburiyatli tranzaksiya maʼlumotlari kerak |
|`POST /v1/iso20022/pacs004` |Qarzdorga tegishli to ' lov deklaratsiyasini taqdim etish |
|`POST /v1/iso20022/camt056` |To ' lovni bekor qilish uchun tashabbuskorga tegishli talabnoma taqdim etish |
|`POST /v1/iso20022/sese023` |Qimmatli qogʻozlar bilan hisob-kitob qilish boʻyicha koʻrsatma taqdim etish |
|`POST /v1/iso20022/sese024` |Qarzdorning egalikidagi qimmatli qog ' ozlar bo ' yicha hisob-kitob holati xabarini taqdim etish |
|`POST /v1/iso20022/sese025` |Qarzdorning egalikidagi qimmatli qog ' ozlar bo ' yicha hisob-kitobining tasdiqlanishini taqdim etish |
|`POST /v1/iso20022/colr012` |Qimmatli qogʻozlarni almashtirish xabarini yuboring |
|`GET /v1/iso20022/messages/{msg_id}` |Bir xabar uchun kanonik koʻprik yozuvini oʻqing .|
|`GET /v1/iso20022/audit/messages` |O ' rnatilgan xabarlarni o ' rganing .|
|`GET /v1/iso20022/messages/{msg_id}/pacs002` |Joriy to'lov holatini `pacs.002` XML deb qaytarish. |
|`GET /v1/iso20022/messages/{msg_id}/pacs004` |Joriy to'lov deklaratsiyasini `pacs.004` XML sifatida qaytaring. |
|`GET /v1/iso20022/messages/{msg_id}/camt029` |Joriy bekor qilish rezolyutsiyasini `camt.029` XML deb berish. |
|`GET /v1/iso20022/messages/{msg_id}/sese024` |Joriy hisob-kitob holatini `sese.024` XML deb berish. |
|`GET /v1/iso20022/messages/{msg_id}/sese025` |Joriy hisob-kitob tasdiqnomasi `sese.025` XML sifatida berilsin. |

`pacs.008` taqdimotlarida xabar ID, banklararo hisob-kitob miqdori, valyuta, hisob-kitob sanasi, qarzdor va kreditor IBANs hamda qarzdor bilan kreditor BICs ko'rsatilishi kerak. Referent ma'lumotlar sozlanganda, ko'prik ishlab chiqarilgan tranzaksiya quvurga kirishdan oldin BIC, IBAN va ISO 4217 valyutalar o'tish joylarini tekshiradi.

`pacs.009` taqdimotlarida biznes xabarini ID, xabarning ta'rifini ID, yaratish vaqti, banklararo hisob-kitob miqdori, valyuta, hisob-kitob sanasi ko'rsatilishi kerak. topshiriq beruvchi va topshiriq beruvchi vakil BICs, qarzdor va kreditor IBANs. Agar xabarda `Purp` mavjud bo'lsa, ko'prik hozirda faqat qimmatli qog'ozlar uchun moliyalashtirishni qabul qiladi: `Purp=SECU`.

O ' zbekiston Respublikasining `pacs.008` va `pacs.009` ko'rsatkichlar qabul qilinadi XML ISO ko'prik sinovlarida qo'llaniladigan konvertlar yoki tekis maydon shakli. `SplmtryData` maydonlar maqsadni belgilashlari mumkin Iroha katta hisob raqami, manba va maqsadli hisob raqamlari IDs yoki manzillar va aktivlarni aniqlash ID. Javob: `202 Accepted` bilan `message_id`, `transaction_hash`, `status`, `pacs002_code`, va hal qilingan katta ma'lumotlar/hisob-kitob/mashnat kontekstini ko'rsatish.

### Ishtirokchilarning ruxsatnomasi va hayot davri egaligi {#participant-authorization-and-lifecycle-ownership}

Har bir qo'llab-quvvatlangan ko'prik ishtirokchi katalogini o'z ichiga oladi. Har bir ishtirokchi kirishida noyob ishtirokchi ID, bitta yoki bir nechta operatorning ommaviy kalitlari, bir yoki bir nechta moliyaviy identifikatorlar, ruxsat etilgan profil to'plami va `originator`, `counterparty` yoki ikkala roli mavjud. Operator kalitlari va moliyaviy identifikatorlar birdan ko'proq ishtirokchiga tegishli bo'lishi mumkin emas. `audit_admin_keys`-ni alohida konfiguratsiya qiling; auditorlik boshqaruvchisi kalitini ham ishtirokchi mutatsiya kaliti bo'lishi shart emas.

Hammasi ISO yo'nalishlarda operatorning yangi imzosi talab etiladi. `pacs.008`, `pacs.009`, `sese.023`, yoki `colr.012` taqdim etish, tasdiqlangan operator talabnoma boshliqida belgilangan ishtirokchiga tegishli bo'lishi kerak `From` moliyaviy identifikatsiya. `To` o'ziga xosligi konfiguratsiya qilingan ishtirokchi bilan aniqlanishi kerak `counterparty` Roli, va tanlangan profil har ikki tomon uchun ruxsat etiladi. ishtirokchi va operator kalitini qabul qilish hamda asl profil va o'rnatilgan imzo siyosati.

Hayot davri to'g'risidagi ruxsatnoma chaqiruvchi tomonidan tanlangan qiymatlardan ko'ra ushbu o'zgaruvchan rekorddan kelib chiqadi:

|Hayot davri xabarlari |Kerakli ishtirokchi |
| ---------------------------------------------- | -------------------------------------------------- |
|`pacs.002`, `pacs.004`, `sese.024`, `sese.025` |`counterparty` rolini o'z ichiga olgan asl nusxasi |
|`camt.056` |`originator` vazifasini egallagan asl nusxasi |

Asl profil va imzo siyosati butun davrda saqlanib qoladi hayot davri, shuning uchun qo'ng'iroq qiluvchi yangilanish uchun zaifroq profilni tanlash mumkin emas. A `pacs.002` hisob-kitobni ifodalaydigan kod (`ACSC`, `ACCP`, `SETT`, yoki `SETTLED`) asl yozuvni faqatgina Torii to'lovni tasdiqlagan.

Asosiy tomonlarning har biri o'z xabar yozuvini va yaratilgan outbox hujjatlarini o'qishi mumkin. Audit oxirgi nuqtasi faqat tasdiqlangan ishtirokchi muallif yoki qarzdor bo'lgan hujjatlarni qaytarib beradi. Ayrim ravishda konfiguratsiya qilingan auditorlik boshqaruvchisi global faqat o'qiladigan audit ko'rinishini oladi va xabarlarni yuborish yoki o'zgartirish mumkin emas.

### Qayta oʻynashning mustahkamligi va imzolangan chipta hujjatlari {#durable-replay-identity-and-signed-outbox-documents}

Torii o'qib bo'lmaydigan, katta bo'lgan, noto'g'ri shakllangan, xato nomlangan, ziddiyatli yoki ochiqchasiga mos kelmaydigan qabr toshini ishga tushirishni bekor qiladi. Shuningdek, u ochiqchasiga mos kelmaydigan sxema versiyasiga ega bo'lgan boy rekord uchun abort qiladi, hozirgi konfiguratsiyadan mavjud bo'lmagan ishtirokchi, profil yoki imzo siyosati yoki yo'qolgan yoki mos kelmagan jonli qabr tomi.

Boshqa boylikdagi rekordlarga zarar yetkazilishi boshqacha tarzda hal etiladi: o'qilmaydigan yoki katta fayllar, haqiqiy bo'lmagan JSON, haqiqiy bo'lmaydigan joriy sxemasi rekordlari, kanonik bo'lmagan fayl nomlari va ziddiyatli takrorlash identifikatsiyalari qayd qilinadi yoki qoldiriladi. O'qib bo'lmaydigan yoki haqiqiy bo'lmagan joriy versiya auditorlik indeksini saqlangan yozuvlardan qayta tiklanadi; faqat ochiqchasiga mos kelmaydigan auditorlik indeksining versiyasi ishga tushirishni bekor qiladi. Boshlang'ich protokollarni kuzatib boring va qayta tiklangan audit manifestini har bir buzilgan boylikdagi fayl nodning xizmat ko'rsatishiga to'sqinlik qilishiga yo'l qo'ymang.

Har bir saqlangan boy yozuv ishtirokchining o'zgaruvchan kelib chiqishini saqlaydi. alohida chidamli qabriston xabarni ID, foydali yuk hashini, biznes xabarini ID va UETR to'liq deduplikatsiya qilish uchun saqlaydi TTL hatto boy yozuvlarning tafsilotlari kesilganidan keyin ham.

Torii lifecycle xabarini imzolash yoki qayta ishlashdan oldin takroriy qabul qilish davom etadi. U hech qachon muddati tugab bo'lmagan takroriy identifikatsiyalarni chiqarmaydi. Agar konfiguratsiyalangan quvvat to'liq himoyalangan yozuvlar yoki muddati tugamagan takrorlash identifikatsiyalari bilan egallab olingan bo'lsa, taqdimotlarni hayot davri yoki buxgalteriya holati o'zgartirmasdan qayta tiklanishi mumkin `503 Service Unavailable` oladi.

Har bir hosil boʻlgan `pacs.002`, `pacs.004`, `camt.029`, `sese.024`, yoki `sese.025` hujjatni quyidagicha qaytarish `application/xml` javoblarning quyidagi boshliqlari bilan:

|Sarlavha |Maʼnosi |
| ------------------------------ | ----------------------------------------------------- |
|`X-Iroha-Iso-Signature-Domain` |Doimo `iroha.iso20022.outbound.v2` |
|`X-Iroha-Iso-Signer` |Konfiguratsiya qilingan koʻprik imzochisi uchun kanonik ommaviy kalit |
|`X-Iroha-Iso-Signature` |Domen bo ' yicha ajratilgan XML bytlar ustida Base64 imzosi |

imzolarni tekshirish UTF-8 Bayt sekvensiyasi `iroha.iso20022.outbound.v2`, bir nol byte, va aniq javob tanasi. XML tekshiruvdan oldin.

### Qo'shimcha Parser va xaritalash qo'llab-quvvatlash {#additional-parser-and-mapping-support}

O ' zbekiston Respublikasining IVM ISO yordamchi , shuningdek , quyidagi xabarlarni tasdiqlaydi va materiallashtiradi . tasdiqlash, hisob-kitoblarni xaritalash yoki oqimdan keyingi kelishuvlarga ega emaslar. Torii yo'nalishlar.

|Xabarlar oilasi |Joriy qoʻllab-quvvatlash |
| --- | --- |
|`head.001` | Ishlab chiqarish uchun arizalar boshliqini tasdiqlash ISO zarflar, shu jumladan: `BizMsgIdr`, `MsgDefIdr`, yaratilish vaqti va ixtiyoriy jo'natgich / qabul qiluvchi BIC maydonlar |
|`pacs.007`, `pacs.028`, `pacs.029` |To'lovni qaytarish, status so'rovi va tekshiruvni hal qilish/statusni tahlil qilish |
|`pain.001`, `pain.002` |Mijozning toʻlovni boshlash va toʻlov holati hisobotini tasdiqlash |
|`camt.052`, `camt.053`, `camt.054` |Hisobot hisoboti, ma'lumotlar va bildirishlarni tasdiqlash |

## Kaigi Uchrashuvlar {#kaigi-sessions}

Kaigi pulli, real vaqtda audio / video xonalarini SORA Nexus da taqdim etadi. Ilovalar kitobga asoslangan seanslarni yaratish, ro'yxatni o'zgartirish, relay manifestlari, shifrlangan signallash va foydalanish o'lchovini saqlashning o'rniga barcha konferentsiya holatini zanjirdan tashlab qo'yish kerak bo'lganida foydalaning.

Ruxsatnomaga qarab hayot davri quyidagicha:

- `CreateKaigi`: domen ostida qo'ng'iroqni yaratish va uning siyosati, jadvali, metadatalari va ixtiyoriy relay manifestini saqlash.
- `JoinKaigi` va `LeaveKaigi`: qo'ng'iroq ro'yxatini yangilash. Xususiy rejimda ishtirokchilar ishtirokchi hisob raqami IDs ni to'g'ridan-to'g'ri ochib bermasdan, majburiyatlar, bekor qilish belgilari va ro'yxatni tasdiqlovchi hujjatlardan foydalanadilar.
- `RecordKaigiUsage`: o'lchash muddati va gaz to'plamlarini qo'shish.
- `EndKaigi`: majlisni yakunlab, oxirgi vaqt belgilarini yozib oling.

Torii relay telemetriyasini koʻrsatadi `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, va `/v1/kaigi/relays/events` ilova qachon API va telemetriya xususiyatlari qo'llanilgan. Kaigi domen hodisalari: `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated`, va `KaigiUsageSummary`.

### CLI Tut sinovlari {#cli-smoke-test}

Boshlaning `iroha kaigi` CLI agar siz tekshirishni istasangiz Torii oxirgi nuqta qabul qiladi Kaigi birlashtirishdan oldin amalga oshirilgan UI. Tez ishga tushirish buyruqi faolga qarshi vaqtincha xona yaratadi . Torii oxirgi nuqta va qo'ng'iroq identifikatori, qo'shish buyruq bilan qisqartma bosib chiqaradi va SoraNet koʻkrakning taʼkidlashi:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

Skriptli oqimlar uchun xonaning hayot davrini aniq boshqarish:

```bash
iroha kaigi create \
  --domain streaming \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha kaigi join --domain streaming --call-name daily --participant <i105-account-id>
iroha kaigi leave --domain streaming --call-name daily --participant <i105-account-id>

iroha kaigi record-usage \
  --domain streaming \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha kaigi end --domain streaming --call-name daily
```

Foydalanish `--room-policy public` relaylar tomoshabinlar uchun chiptalarsiz ko'rsatilishi mumkin bo'lgan xonalar uchun yoki `--room-policy authenticated` Chiqishlar tomoshabinni tasdiqlashi kerak bo'lganda. `--privacy-mode zk-roster-v1` faqat tarmoqning Kaigi ro'yxat va foydalanishni tekshirish kalitlari konfiguratsiya qilingan; boshqacha tarzda qo'shiqlar, varaqlar; va shaxsiy foydalanish yozuvlari deterministik tekshiruvda muvaffaqiyatsiz tugadi.

### JavaScript demo bilan sinov o'tkazish {#testing-with-the-javascript-demo}

[soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) dasturiy ta'minotdan foydalanib, oxir-oqibat portfelni sinab ko'ring. Demo elektron va Vue dasturidir, u mahalliy `@iroha/iroha-js` bog'lash orqali to'g'ridan-to'g'ri Torii bilan gaplashadi va brauzerda tug'ilgan bir-bir media uchun `/kaigi` yo'nalishini o'z ichiga oladi.

Iroha manbai omboridan [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) bilan demo-ni ishlating. Demo pinlari SDK dan `file:../iroha/javascript/iroha_js` gacha bo'ladi, shuning uchun ikkala checkout ushbu singil layotida saqlang:

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

Node.js 20 yoki undan yangi va Rust asbob-uskunalar zanjiridan foydalanib, mahalliy `iroha_js_host` moduli qurilishi mumkin. SDK ning manbasini o'zgartirganidan so'ng qarindoshlari Iroha kassasida qayta tiklang; toza paket layoutida `npm run build:native` uchun zarur bo'lgan yuk ish maydonlari mavjud emas.

Qo'riqlanadigan sinov uchun demo Kaigi qobiliyatiga ega bo'lgan Torii oxirgi nuqtaga ko'rsatilgan:

1. SORA/Kaigi dasturiy ta'minotni ko'tarib turadigan APIs nishonchasi bilan Iroha nodni ishga tushiring yoki kerakli Kaigi yuzalarini ochib beradigan ommaviy oxirgi nuqtadan foydalaning.
2. Boshlang'ichligini tekshiring `/health`, so'ngra jonli yo'nalish yuzasini tekshiring: `/openapi` yoki `/openapi.json`. Ba'zi ishga tushirishlar ham `/v1/health`, lekin `/health` bu o'ynaydigan hayot tarzini tekshirishdir.
3. TAIRA uchun jonli uchrashuvdan oldin relay telemetriya yo'nalishlarini tekshirib ko'ring:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

Ushbu tekshirishlar Torii va Kaigi relay telemetriyasiga erishish mumkinligini isbotlaydi. Ular uchrashuvni yaratmaydi; `CreateKaigi` va `JoinKaigi` hali ham mablag' bilan ta'minlangan qopchiqlarga va imzolangan tranzaksiyalarni taqdim etish kerak.
4. Demo-ni oching, sozlamalarga boring, Torii URL ni o'rnating va ilova ID zanjirini va tarmoq prefiksini oxirgi nuqtadan yuklasin.
5. Demo-da ikkita mahalliy hamyon yarating yoki tiklang. Uy egasi va mehmon alohida hamyon holatiga ega bo'lishi uchun alohida dastur oynasidan, profillaridan yoki mashinalardan foydalaning.

Kaigi UI ni sinash uchun:

1. Uy egalari oynasida Kaigi oching, uchrashuvni boshlashni tanlang, mavzuni o'rnating va xususiy taklif yoki shaffof taklifni tanlang.
2. Kamera va mikrofonni yoqishni tanlang, shunda WebRTC mahalliy mediaga ega bo'ladi.
3. O'tirish bog'ini yaratishni tanlang. To'g'ridan-to'g'ri pulka `CreateKaigi` taqdim etadi; ilova keyinchalik `iroha://kaigi/join?call=...&secret=...` taklifini va `#/kaigi?...` qaytish yo'lini ko'rsatadi.
4. Uy egasi oynasini ochib qo'ying va taklifni mehmon bilan bo'ling.
5. Mehmonlar oynasida taklifni oching yoki uni Qo'shilish yig'ilishiga qo'ying, mahalliy ommaviy axborot vositalarini yoqing va Qo'shilish yig'ilishini tanlang. To'g'ridan-to'g'ri bog'cha Torii dan shifrlangan mehmon taklifini olib keladi va `JoinKaigi` ni shifrlangan javob metadatalari bilan taqdim etadi.
6. Uy egasi birinchi javobni avtomatik ravishda Kaigi qo'ng'iroq signallarini uzatish yoki ovoz berish orqali qo'llashi kerak. Ikkala darcha ham bog'langan media va yangilangan aloqa ma'lumotlarini ko'rsatishi kerak.
7. Sessiyani uyushtiruvchidan tugating yoki xuddi shu qo'ng'iroq uchun CLI `iroha kaigi end` buyruqidan foydalaning ID.

Xususiy Kaigi talablar himoyalangan XOR xususiy kirish punktining to'lovini to'lash uchun. agar demo Kaigi talablar himoyalangan XOR, ilova ichida o'z-o'zini himoya qilish qo'llanmasini ishlating va yaratish yoki qo'shilish harakatini yana sinab ko'ring. Agar dalillarni yaratish, xususiy mablag' bilan ta'minlash yoki jonli signalizatsiya mavjud bo'lmasa, demo shaffof / qo'llanma oqimiga qaytishi mumkin. Bunday holda, Advanced signalni oching, xom taklif yoki javob paketini nusxa oling va uni boshqa darchaga qo'ying.

Demo repo-da avtomatik tekshiruvlar uchun quyidagilarni bosing:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

Tanlangan Vitest suitelari Kaigi uchrashuv bog'larini yaratish, kompakt takliflarni yuklash, xususiy yaratish / qo'shilish / tugash ko'prik qo'ng'iroqlari, o'z-o'zini himoya qilish iltimoslari, qo'ldan to'sqinlik qilish va javoblar so'rovini qamrab oladi. UI tutun testi ish stoli va mobil hajmdagi ko'rish portlarida `/kaigi` yo'lini o'z ichiga oladi. Ikki qopchiq o'rtasidagi jonli ommaviy axborot vositalari hali ham ikki darchali qo'llanma sinovga muhtoj, chunki brauzer kamera/mikrofon huquqlari va tengdoshlari media oqimlari atrof muhitga mos.

Namuna integratsiya kodini ko'rish uchun [Mashnatda Kaigi qo'shilgan JavaScript App](/uz/guide/tutorials/kaigi.md).

## Davlat holati va ma'lumotlari {#status-and-metrics}

Status va oʻlchovlar oxirgi nuqtalari dastlabki ish stoli boʻladi:

- `/status` yuqori darajadagi tengdoshlar, bloklar, navbat va konsensus maydonlarini ochadi
- `/metrics` Prometheus hisoblagichlari, o'lchovchilari va histogrammalarini aniqlaydi.

Nexus qo'llab-quvvatlangan nodlarda holat chiqishi yo'l va ma'lumotlar maydonidan xabardor bo'lgan qismlarni ham o'z ichiga oladi. `nexus.enabled = false`da ushbu qismlar qoldiriladi.

## JSON vs. Norito {#json-vs-norito}

Bir nechta operator oxirgi nuqtalari qaytadi Norito Dastlabki sifatida. JSON, joʻnatish:

```http
Accept: application/json
```

Bu ayniqsa quyidagilar uchun foydali:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

Oxirgi nuqta Norito tilida to'g'ridan-to'g'ri qabul qilganda yoki qaytarib berganda, `application/x-norito` ni tarkib turi yoki `Accept` ustun qiymat sifatida ishlating. Transport tafsilotlari uchun [Norito](/uz/reference/norito.md#torii-and-norito-rpc) ko'ring.

## Telemetriya profillari {#telemetry-profiles}

Oxirgi nuqta ko'rinishi nodning `telemetry.profile` sozlamalariga bog'liq. Hozirgi konfiguratsiya beshta profil darajasiga ega:

|Profil |`/status` |`/metrics` |Ishlab chiquvchilar yoʻllari |
| --- | --- | --- | --- |
|`disabled` |yoʻq |yoʻq |yoʻq |
|`operator` |Ha , shunday .|yoʻq |yoʻq |
|`extended` |Ha , shunday .|Ha , shunday .|yoʻq |
|`developer` |Ha , shunday .|yoʻq |Ha , shunday .|
|`full` |Ha , shunday .|Ha , shunday .|Ha , shunday .|

## CLI Qisqa yo'nalishlar {#cli-shortcuts}

`iroha` CLI allaqachon ushbu oxirgi nuqtalarning ko'pini o'z ichiga oladi:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## Yuqori yo'nalishdagi referentlar {#upstream-references}

- [README API va kuzatuvchanlik ko'rib chiqishi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO 20022 ko'priklarni amalga oshirish](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [Ishlab chiqarish va o'lchovlar](/uz/guide/advanced/metrics.md)
