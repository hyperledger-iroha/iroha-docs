---
translation_locale: uz
translation_source: /reference/torii-endpoints.md
translation_source_hash: f04e5e78329996d70926c4fd5dc034d41605d0a82fffd6460f67b252269480d9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Torii Oxirgi nuqtalar {#torii-endpoints}

Torii - bu HTTP, SSE va WebSocket darvozalari bo'lgan Iroha 3. U zarbaxonaga qaraydigan APIs va operatorning oxirgi nuqtalariga ham xizmat qiladi.

Amaldagi protokol qoidalari quyidagilardir:

- kanonik ikkilamchi format Norito
- ko'plab oxirgi nuqtalar JSON ni ham qo'llab-quvvatlaydi, chunki siz `Accept: application/json`ni yuborasiz.
- Metriklar Prometheus formatida ko'rsatilgan

Format tafsilotlari, tarkib muzokaralari, layout bayroqlari, sxema hashlari va Norito RPC yo'l-yo'riq uchun [Norito ko'rsatkichini ko'ring ](/uz/reference/norito.md).

## O'zaro o'xshash maqsadlar {#common-endpoints}

|Keyingi nuqta |Format | Maqsad                                                          |
| -------------------------------- | -------------- | ---------------------------------------------------------------- |
|`POST /v1/pipeline/transactions` |Norito |Imzolangan bitimni taqdim etish |
|`POST /v1/query` |Norito |Imzolangan soʻrovni yuborish |
|`GET /v1/events/ws` |WebSocket |Tadbirlar oqimiga obuna boʻling |
|`GET /v1/events/sse` |SSE |SSE o'tkaziladigan voqealar oqimlariga obuna bo'ling. |
|`GET /v1/blocks/stream` |WebSocket |Joʻnatilgan bloklar oqimi |
|`GET /v1/peers` |JSON |Torii tomonidan aniqlangan tugunlar ro'yxati |
|`GET /livez` |Matn |Faqatgina jarayonlar bilan ishlash; bu protokolga tayyorlikni anglatmaydi |
|`GET /readyz` |JSON |To'liq nod tayyorligi, shu jumladan majburiy oflayn naqd pul tekshiruvlari |
|`GET /health` |JSON |Tayyorlik sondasi xuddi shu oflayn naqdsiz invariant bilan |
|`GET /v1/api/version` |Matn |Joriy blok sarlavhasi versiyasi |
|`GET /status` |Norito yoki JSON |Yuqori darajadagi diagnostika holati; JSON soʻrovini aniqlab oling |
|`GET /metrics` |Prometheus |Prometheus scraping oxirgi nuqtasi |
|`GET /v1/schema` |JSON |Maʼlumotlar modeli sxemasi snapshotlari |
|`GET /openapi.json` |JSON |Aktiv Torii HTTP yo'nalishlari uchun OpenAPI hujjati |
|`GET /v1/parameters` |JSON |Nukl parametrlari snapshotlari |
|`GET /v1/node/capabilities` |JSON |Nukllar qobiliyati va ma'lumotlar modeli metadatalari |
|`GET /v1/time/now` |JSON |Nodular tizim soatini koʻrish |
|`GET /v1/time/status` |JSON |Vaqt sinxronizatsiyasi holati |

SSE so'rovi uchun mahalliy oqimni qo'shib, o'rnatilgan orqaga qaytarish:

```http
Accept: text/event-stream, application/json
```

Torii avval so'rov qatlamida JSON yoki Norito ifodalarini muzokara qiladi, so'ngra mahalliy `text/event-stream` javobini tasdiqlaydi. Shuning uchun faqat `text/event-stream` yuborish `406` bilan rad etiladi; [ oqim tadbirlari retseptasi ](/uz/cookbook/stream-events.md) to'liq boshliqdan foydalanadi.

`/openapi.json` sxemada tasvirlangan yo'nalishlar uchun ishlab chiqilgan shartnoma, to'liq operatsion-sonda inventar emas. Hozirgi hujjatda `/livez` va `/readyz` bo'shashtirilmoqda va uning `/health` tavsifi tayyorlik ko'rsatuvchidan ortda qolishi mumkin. Yo'nalish klientlarini jonli hujjatdan yarating, lekin faollik va tayyorlikni to'g'ridan-to'g'ri ishlamoqchi nodga va qo'lga kiritilgan boshqaruvchilariga qarshi tasdiqlang. To'g'rimi yuzasi hali ham qurilish xususiyatlari va ish vaqti konfiguratsiyasidan bog'liq. O'sha jonli hujjatni yuklash, JSON yo'nalishlarini sinovdan o'tkazish, curl so'rovlarini nusxa olish va joriy sxemadan mijoz kodini yaratish uchun [Torii API konsolini ](/uz/reference/torii-api-console.md) ishlating.

Har bir katalog qo'llab-quvvatlangan OpenAPI operatsiyasi `x-iroha-route-auth` ob'ektini o'z ichiga oladi. Katalog qo'llab -quvvatlanadigan MCP vositalari `_meta["iroha/routeAuth"]` bilan bir xil kontraktni aks ettiradi. Ikkala proyektsiya ham `schemaVersion`, `stableRouteId`, `authentication` va `admission` ni olib boradi. `1` versiyasini to'g'ri shartnoma sifatida ko'rib chiqing: tasdiqlanmagan `schemaVersion` ni rad eting, balki uning autentifikatsiya yoki qabul etiketalarini qanday talqin qilish kerakligini tasavvur qiling. Yo'nalish metadatalari so'rov chegaraini tasvirlaydi; u ushbu chegara tomonidan talab etiladigan ma'lumotlarni almashtirmaydi.

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

Quyidagi Sumeragi yo'nalishlarining har biri operatorning so'rov imzosini talab qiladi. Status, tashxislar, oqim, rahbar, kalit, QC va parametr yo'nalishlari ham telemetriyani qo'llab-quvvatlovchi qurilishni talab qiladi.

|Keyingi nuqta |Format | Maqsad                                                 |
| ----------------------------------------- | -------------- | ------------------------------------------------------- |
|`GET /v1/sumeragi/status` |Norito yoki JSON |Avtolatli reduktor egalikidagi konsensus holati |
|`GET /v1/sumeragi/diagnostics` |JSON |Sotuv, navbat va yo'nalish diagnostikasi uchun ruxsat berilmagan |
|`GET /v1/sumeragi/status/sse` |SSE |Tinchlik bilan ishonchli konsensus holati oqimi |
|`GET /v1/sumeragi/leader` |JSON |Hozirgi rahbar maʼlumotlari |
|`GET /v1/sumeragi/qc` |Norito yoki JSON |Eng yuqori va qulflangan quorum sertifikatlari snapshotlari |
|`GET /v1/sumeragi/consensus-keys` |JSON |Aktiv konsensus kalitlari |
|`GET /v1/sumeragi/bls-keys` |JSON |Aktiv BLS konsensus kalitlari |
|`GET /v1/sumeragi/params` |JSON |Zilziladagi joriy parametrlar Sumeragi |
|`GET /v1/sumeragi/evidence` |JSON |Ko'rsatkichlar ro'yxati, tanlov asosida so'rov satrlari bilan filtrlangan |
|`GET /v1/sumeragi/evidence/count` |JSON |Koʻrsatkichlar soni |
|`GET /v1/runtime/abi/active` |JSON |Aktiv ishga tushirish vaqti ABI tavsifchisi |
|`GET /v1/runtime/abi/hash` |JSON |Aktiv ishga tushirish vaqti ABI hash |
|`GET /v1/runtime/metrics` |JSON |Ishga tushish vaqti maʼlumotlari |
|`GET /v1/runtime/upgrades` |JSON |Ish vaqti yangilanish roʻyxati |
|`POST /v1/runtime/upgrades/propose` |JSON |Ish vaqti yangilanishini taklif qiling |
|`POST /v1/runtime/upgrades/activate/{id}` |JSON |Tartib qilingan ishga tushirish vaqti yangilanishini faollashtirish |
|`POST /v1/runtime/upgrades/cancel/{id}` |JSON |Tartib qilingan ish vaqti yangilanishini bekor qilish |

## App va SORA yo'nalishidagi oilalar {#app-and-sora-route-families}

Torii dasturga mos xususiyatlar to'plami bilan qurilganda, u qidiruvchilar uchun qo'shimcha JSON oilalarini, SORA xizmatlarini, ko'prik oqimlarini, dalillarni va saqlashni ochib beradi. Ushbu oilalarning barchasi har bir tarmoq profilida yoqilmaydi.

`/openapi.json` ishlab chiqilgan app-API katalogida ro'yxatdan o'tgan yo'nalishlarni tasvirlaydi; u tarkibida mavjud bo'lgan yo'nalishlar uchun vakolatli, balki har bir yo'nalishga mo'ljallangan emas Xususan, ommaviy mahalliy SoraFS CID va yaxshi ma'lum yo'nalishlar ushbu ishlab chiqarilgan hujjatning tashqarisida o'rnatilgan va to'g'ridan-to'g'ri tekshirilishi kerak.

|Yoʻnalish oilasi | Maqsad                                                                                                                   |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|`/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*` |JSON o'qishlar, so'rov yordamchilari, onboarding yordamchilari va portfel yoki egalar ko'rinishi |
|`/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*` |NFT, real dunyo aktivlari va maxfiy aktivlar ko'rinishi |
|`/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` |Ism, alias va identifikator rezolyutsiyasi |
|`/v1/explorer/*` |Explorerga yoʻnaltirilgan hisobvaraq, aktiv, blok, tranzaksiya, koʻrsatma, metrika va oqim koʻrinishlari |
|`/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*` |Transaksiya tarixi, konveyerni tiklash yoki holati va ISO 20022 yordamchilar |
|`/v1/contracts/*` |Shartnoma kodi, ishga tushirish, paketlash, qo'ng'iroq qilish, ko'rish, voqea, faoliyat, ro'yxatga olish va holat yo'nalishlari |
|`/v1/multisig/*`, `/v1/controls/*` |Multisig takliflari, ma'qullash va o'tkazib yuborishni nazorat qilishda yordamchilar |
|`/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*` |So'nggi muddat, holatni tasdiqlash, blokni tasdiqlash, dalillarni saqlash va dalillar so'rovini olish yo'nalishlari |
|`/v1/da/*` |Ma'lumotlar mavjudligi qabul qilinishi, manifestlar, dalil siyosati, majburiyatlar va aniq maqsadlar |
|`/v1/zk/*` |ZK ildizlar, dalillarni tekshirish, IVM dalillarini tasdiqlash, ovozlarni hisobga olish, tekshiruv kalitlari, dalillarni qayd etish va qo'shimchalar  |
|`/v1/gov/*`, `/v1/ministry/*` |Boshqaruv takliflari, ovoz berish notasi, kengash holati, himoyalangan nomlar maydonlari, kun tartibidagi takliflar, qonun qabul qilinishi va yakunlanishi |
|`/v1/nexus/*`, `/v1/sccp/*` |Nexus yo'nalish, ma’lumotlar makoni va to'liq zanjirli sinov yordamchilari |
|`/v1/musubi/*` |Musubi paketlar reyestrini oʻqish va koʻrsatmalarni yaratish |
|`/v1/subscriptions/*` |Obunalik rejalari, obunalik hayot davri, foydalanish va yordamchilarni to'lash |
|`/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*` |SoraFS provayderni kashf etish, quvvatni tasdiqlash, pinning qilish, saqlash va ommaviy tarkibni xizmat ko'rsatish |
|`/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*` |SoraCloud xizmat hayoti davri, xususiy hisoblash/model oqimlari, ommaviy kashfiyot va uyushtirilgan ilovalarni yo'naltirish |
|`/v1/connect/*`, `/v1/vpn/*` |Iroha Qo'shish seanslari, WebSocket transport, VPN uchrashuvlar, profillar va rasmga ega bo'lish |
|`/v1/app-api/*`, `/v1/api/*`, `/v1/content/*` |App API bog'lanish va paket/CID tomonidan qo'llab-quvvatlanadigan tarkib yo'nalishi |
|`/v1/operator/*`, `/v1/mcp` |Operatorning tasdiqlanishi va mahalliy MCP JSON-RPC ko'priklari |
|`/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` |Offline tayyorlik, ombor shartnomalari, ma’lumotlar makonining manifestlari va [RAM-LFE yordamchilar ](/uz/blockchain/ram-lfe.md#torii-routes)  |
|`/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*` |Hamkorlik, veb-qo'shish, push xabardorlik va jonli telemetri integratsiyalari |

## Hisobvaraqlarni tasdiqlash, ko‘rinishi va Explorer kursorlari {#account-authentication-visibility-and-explorer-cursors}

### Dastur hisobini soʻrash protokoli {#app-account-request-protocol}

Ilovaga yo‘naltirilgan marshrutlar uch variantdan birini qabul qiladi: autentifikatsiya sarlavhalarisiz so‘rov, bitta to‘g‘ridan-to‘g‘ri bir kalitli dalil yoki bitta multisig guvoh. Har bir autentifikatsiya sarlavhasi ko‘pi bilan bir marta kelishi kerak.

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

Yo'l, so'rov, jism, vaqt belgisi va nonce qoidalari ilova protokoli tomonidan ishlatiladigan bir xil kanonik qoidalardir. `[torii.operator_signatures]` kalitini ham qabul qilishi kerak: uni `allowed_public_keys` da ro'yxatdan o'tkazing yoki tugma kalitidan foydalanganida `allow_node_key` ni aniq faollashtiring. Replay-cache saturatsiyasi `503 Service Unavailable` bilan yopilmaydi.

To'g'ri so'rov imzosi har doim majburiy. `[torii.operator_auth].enabled = true`da har bir odatdagi operator yo'li ham haqiqiy `x-iroha-operator-session` talab qiladi; `require_mtls = true`da u qo'shimcha ravishda ishonchli kirishdan `x-forwarded-client-cert` talab qiladi. Ikkala omil ham so'rovni almashtirmaydi.

WebAuthn ro'yxatdan o'tish va kirish uchun ushbu to'rtta JSON oxirgi nuqtalardan foydalaning:

|usuli va oxirgi nuqtasi | Maqsad                                  |
| --------------------------------------------- | ---------------------------------------- |
|`POST /v1/operator/auth/registration/options` |WebAuthn ma'lumotlar ro'yxatidan o'tish boshlanadi |
|`POST /v1/operator/auth/registration/verify` |Sertifikatlarni tekshirish va saqlab qolish |
|`POST /v1/operator/auth/login/options` |WebAuthn autentifikatsiyasini boshlash |
|`POST /v1/operator/auth/login/verify` |Talabni tasdiqlash va sessiya oʻtkazish |

`torii.operator_auth.tokens` ni maxsus bootstrap qiymatlari bilan konfiguratsiya qiling. Har qanday ma'lumotnoma mavjud bo'lishdan oldin, birinchi ro'yxatdan o'tishni boshlash uchun `x-iroha-operator-token` sifatida yuboring. Ushbu token hech qachon odatdagi operator yo'lini ruxsat bermaydi va tinglovchi `x-api-token` qiymatlari bu oqim uchun hech qachon qayta ishlatilmaydi. Bir marta ma'lumotnoma mavjud bo'lganidan so'ng, boshqa ma'lumotnomani ro'yxatdan o'tkazish uchun autentifikatsiya qilingan seans talab etiladi. Login tasdiqlash sesiya belgisini har bir yangi aniq tarmoq operatori iltimos imzosi bilan birga yuboradi. Ma'lumotnomalar `<torii.data_dir>/operator_auth/operator_webauthn.json` ostida saqlanib qoladi.

ISO 20022 yo'nalishlari ikki mustaqil tekshiruvni amalga oshiradi. Talab dastlab ushbu operator ruxsatnomalari va imzo protokolini o'tkazishi kerak; ISO boshqaruvchisi keyinchalik quyida tasvirlangan aniq ishtirokchi yoki auditorlik rolini egallashi uchun bir xil kalitni talab qiladi.

### Reyestrning ko‘rinishi va Explorer kursorlari {#ledger-visibility-and-explorer-cursors}

App-facing reyestr read-lari yuqoridagi optional application-account boundary-dan foydalanadi. Unsigned request faqat public deb configured qilingan data space-larni oladi. Valid signed request caller-ning joriy UAID-si bilan bog'langan data space-larni, aniq `CanReadRestrictedDataspace { dataspace }` permission-i bilan nomlangan har bir restricted data space-ni yoki account-da `CanReadAllLedgerData` bo'lsa barcha route-larni qo'shadi.

Chaqiruvchining vakolatlariga mos keladigan yo'ldan foydalaning:

|usuli va oxirgi nuqtasi |Tasdiqlash va koʻrinishlilik |
| ------------------------------------- | --------------------------------------------------------------- |
|`POST /v1/transactions/visible/query` |Kanonik hisob raqami imzosi; chaqiruvchining ko'rinishini ta'minlaydi |
|`POST /v1/transactions/query` |Operatorning imzosi talab qilinadi; global operator koʻrinishiga ruxsat beradi |
|`GET /v1/triggers/completed` |Operator imzo soʻraydi; nod-lokal toʻliqlash yozuvlarini oʻqiydi |

Bir xil ko'rinish obʼektlari hisob, domen, aktiv-maʼrifi, aktiv, NFT, RWA, egasi va Explorerni oʻqiydi. Yoʻqolgan obyekt va chaqiruvchining ko'rinadigan yo'llaridan tashqarida bo'lgan object niyat bilan ajratib bo'lmaydi. Tasdiqlangan tranzaksiya va ko'rsatmalar tarixi faqat tranzaksiya uchun qayd etilgan har bir yo'nalish bosqichini ko'rishganda ko'rsatiladi . shu sababli, hatto bitta ishtirokchi bosqich qo'ng'iroq qiluvchining qamrovidan tashqarida bo'lganda yashirilgan; yo'qolgan, eskirgan yoki noto'g'ri ko'rsatilgan yo'naltirish konteksti faqat global o'quvchi uchun ko'rinadi.

Olti butun dunyo tomonidan qo'llab-quvvatlanadigan Explorer kolleksiyalarida shaffof bo'lmagan kanonik base64url tugmachalar kursorlari ishlatiladi. Standart sahifa chegarasi 25, maksimal 100 va bitta sahifa eng ko'pida 512 nomzod tugmachasini tekshiradi. Har bir kursor o'zining to'plami, filtrlari, kanonik oxirgi kalit va chaqiruvchining ko'rinadigan yo'l-qoidasi bilan bog'liq, shuning uchun uni boshqa so'rovda yoki chaqiruvchining ko'rinishi o'zgarganidan keyin takrorlash mumkin emas.

Blok, operatsiya, so'nggi tranzaksiya, ko'rsatma va so'ngki ko'rsatmalar tarix kursorlari qo'shimcha ravishda tasdiqlangan snapshot balandligi va blok hashini belgilaydi. Javoblar `pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor` va `pagination.has_more` ni aniqlaydi. Boshqa yo'nalish yoki filtrlar to'plami uchun kursor, o'zgartirilgan ko'rinish aniqlanishi yoki nod endi tasdiqlay olmaydigan darhol surat yopiladi. Torii blokiruvchi ishchi ishlayotganda tarixni skanerlash so'rovlarni qabul qilish ruxsatnomasida qoladi.

Eksplorator WebSocket oqimlar filtrlangan qisqartmalarni chiqaradi va ko'rinishni qayta hisoblashda katta ma'lumotlar huquqlarini o'zgartirish. `GET /v1/blocks/stream` yo'nalish boshqacha: u to'liq imzolangan bloklarni chiqaradi, talab qiladi `CanReadAllLedgerData` qo'l urish paytida, agar ruxsatnoma keyinchalik bekor qilinsa, yopiladi. Ma’lumotlar makonini ko'rib chiqayotgan kashfiyotchi uchun mahalliy oqishni ishlatmang.

## ISO 20022 ko'prik {#iso-20022-bridge}

Torii ISO 20022 ko'prini `/v1/iso20022/*` ostida qo'llaydi, agar dasturga qaraydigan API va ko'prikni ishga tushirish vaqti yoqilgan bo'lsa. Ko'prik niyat bilan: bu umumiy maqsadga mo'ljallangan ISO 20022 clearing gateway emas, balki tanlangan to'lov xabarlarini Iroha imzolangan o'tkazmalarga aylantirish va ularning katta qog'ozdagi holatini kuzatish uchun qo'llab-quvvatlanadigan kichik guruhdir.

So'rovlarni qabul qilishdan oldin uzoq muddatli lokal `torii.iso_bridge.store_dir` ni konfiguratsiya qiling. Konfiguratsiya maydoni faqat o'qish yoki tashxis uchun ishlatilishi mumkin bo'lgan nodni ishga tushirish imkoniyatiga ega: har bir autentifikatsiya qilingan ISO taqdimot direktoriyani talab qiladi va persistensiya yo'q bo'lganda yoki takrorlash takroriy yuborishni bloklash belgisi yoki boylik bilan yozilgan yozish muvaffaqiyatsiz tugasa, qayta tiklanishi mumkin bo'lgan `503 Service Unavailable` qaytaradi.

### Torii ISO 20022 Yakuniy nuqtalar {#torii-iso-20022-endpoints}

|usuli va oxirgi nuqtasi | Maqsad                                                                                            |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
|`POST /v1/iso20022/pacs008` |FI-to-FI mijoz kreditini o'tkazish va moslashtirilgan Iroha aktivni o'tkazish |
|`POST /v1/iso20022/pacs009` |FI dan FI ga PvP yoki qimmatli qog'ozlar bilan bog ' liq naqd pul mablag ' lari uchun ishlatilgan kredit o ' tkazmasini taqdim etish |
|`POST /v1/iso20022/pacs002` |Qarzdorga tegishli toʻlov holatini koʻrsatishni taqdim etish; hisob-kitob qilish uchun commit qilingan tranzaksiya dalillari kerak |
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

`pacs.008` taqdimotlarida xabar ID, banklararo hisob-kitob miqdori, valyuta, hisob-kitob sanasi, qarzdor va kreditor IBANs hamda qarzdor bilan kreditor BICs bo'lishi kerak. Referent ma'lumotlar sozlanganda, ko'prik ishlab chiqarilgan tranzaksiya konveyerga kirishdan oldin BIC, IBAN va ISO 4217 valyutalar o'tish joylarini tekshiradi.

`pacs.009` taqdimotlarida biznes xabarini ID, xabarning ta'rifini ID, yaratilish vaqti, banklararo hisob-kitob miqdori, valyuta, hisob-kitob sanasi ko'rsatilishi kerak. topshiriq beruvchi va topshiriq beruvchi vakil BICs, qarzdor va kreditor IBANs. Agar xabarda `Purp` mavjud bo'lsa, ko'prik hozirda faqat qimmatli qog'ozlar uchun moliyalashtirishni qabul qiladi: `Purp=SECU`.

`pacs.008` va `pacs.009` yuborish endpoint-lari XML ISO konvertlarini yoki ko'prik testlarida ishlatiladigan tekis maydon formatini qabul qiladi. Ixtiyoriy `SplmtryData` maydonlari maqsad Iroha reyestrini, manba va maqsad hisob IDs yoki manzillarini hamda aktiv ta'rifi ID-sini belgilashi mumkin. Javob `message_id`, `transaction_hash`, `status`, `pacs002_code` va aniqlangan reyestr/hisob/aktiv konteksti bilan `202 Accepted` bo'ladi.

### Ishtirokchilarning ruxsatnomasi va hayot davri egaligi {#participant-authorization-and-lifecycle-ownership}

Har bir qo'llab-quvvatlangan ko'prik ishtirokchi katalogini o'z ichiga oladi. Har bir ishtirokchi kirishida noyob ishtirokchi ID, bitta yoki bir nechta operatorning ommaviy kalitlari, bir yoki bir nechta moliyaviy identifikatorlar, ruxsat etilgan profil to'plami va `originator`, `counterparty` yoki ikkala roli mavjud. Operator kalitlari va moliyaviy identifikatorlar birdan ko'proq ishtirokchiga tegishli bo'lishi mumkin emas. `audit_admin_keys`-ni alohida konfiguratsiya qiling; auditorlik boshqaruvchisi kalitini ham ishtirokchi mutatsiya kaliti bo'lishi shart emas.

Hammasi ISO yo'nalishlarda operatorning yangi imzosi talab etiladi. `pacs.008`, `pacs.009`, `sese.023`, yoki `colr.012` taqdim etish, tasdiqlangan operator talabnoma boshliqida belgilangan ishtirokchiga tegishli bo'lishi kerak `From` moliyaviy identifikatsiya. `To` o'ziga xosligi konfiguratsiya qilingan ishtirokchi bilan aniqlanishi kerak `counterparty` Roli, va tanlangan profil har ikki tomon uchun ruxsat etiladi. ishtirokchi va operator kalitini qabul qilish hamda asl profil va o'rnatilgan imzo siyosati.

Hayot davri to'g'risidagi ruxsatnoma chaqiruvchi tomonidan tanlangan qiymatlardan ko'ra ushbu o'zgaruvchan rekorddan kelib chiqadi:

|Hayot davri xabarlari |Talab qilingan ishtirokchi |
| ---------------------------------------------- | -------------------------------------------------- |
|`pacs.002`, `pacs.004`, `sese.024`, `sese.025` |`counterparty` rolini o'z ichiga olgan asl nusxasi |
|`camt.056` |`originator` vazifasini egallagan asl nusxasi |

Asl profil va imzo siyosati butun davrda saqlanib qoladi hayot davri, shuning uchun qo'ng'iroq qiluvchi yangilanish uchun zaifroq profilni tanlash mumkin emas. A `pacs.002` hisob-kitobni ifodalaydigan kod (`ACSC`, `ACCP`, `SETT`, yoki `SETTLED`) asl yozuvni faqatgina Torii to'lovni tasdiqlagan.

Asosiy tomonlarning har biri o'z xabar yozuvini va yaratilgan outbox hujjatlarini o'qishi mumkin. Audit oxirgi nuqtasi faqat tasdiqlangan ishtirokchi muallif yoki qarzdor bo'lgan hujjatlarni qaytarib beradi. Ayrim ravishda konfiguratsiya qilingan auditorlik boshqaruvchisi global faqat o'qiladigan audit ko'rinishini oladi va xabarlarni yuborish yoki o'zgartirish mumkin emas.

### Qayta oʻynashning mustahkamligi va imzolangan chipta hujjatlari {#durable-replay-identity-and-signed-outbox-documents}

Torii o'qib bo'lmaydigan, katta bo'lgan, noto'g'ri shakllangan, xato nomlangan, ziddiyatli yoki ochiqchasiga mos kelmaydigan takroriy yuborishni bloklash belgisini ishga tushirishni bekor qiladi. Shuningdek, u ochiqchasiga mos kelmaydigan sxema versiyasiga ega bo'lgan boy rekord uchun abort qiladi, hozirgi konfiguratsiyadan mavjud bo'lmagan ishtirokchi, profil yoki imzo siyosati yoki yo'qolgan yoki mos kelmagan jonli takroriy yuborishni bloklash belgisi.

Boshqa boylikdagi rekordlarga zarar yetkazilishi boshqacha tarzda hal etiladi: o'qilmaydigan yoki katta fayllar, haqiqiy bo'lmagan JSON, haqiqiy bo'lmaydigan joriy sxemasi rekordlari, kanonik bo'lmagan fayl nomlari va ziddiyatli takrorlash identifikatsiyalari qayd qilinadi yoki qoldiriladi. O'qib bo'lmaydigan yoki haqiqiy bo'lmagan joriy versiya auditorlik indeksini saqlangan yozuvlardan qayta tiklanadi; faqat ochiqchasiga mos kelmaydigan auditorlik indeksining versiyasi ishga tushirishni bekor qiladi. Boshlang'ich protokollarni kuzatib boring va qayta tiklangan audit manifestini har bir buzilgan boylikdagi fayl nodning xizmat ko'rsatishiga to'sqinlik qilishiga yo'l qo'ymang.

Har bir saqlangan boy yozuv ishtirokchining o'zgaruvchan kelib chiqishini saqlaydi. alohida chidamli takroriy yuborishni bloklash belgisi xabarni ID, foydali yuk hashini, biznes xabarini ID va UETR to'liq deduplikatsiya qilish uchun saqlaydi TTL hatto boy yozuvlarning tafsilotlari kesilganidan keyin ham.

Torii lifecycle xabarini imzolash yoki qayta ishlashdan oldin takroriy qabul qilish davom etadi. U hech qachon muddati tugab bo'lmagan takroriy identifikatsiyalarni chiqarmaydi. Agar konfiguratsiyalangan quvvat to'liq himoyalangan yozuvlar yoki muddati tugamagan takrorlash identifikatsiyalari bilan egallab olingan bo'lsa, taqdimotlarni hayot davri yoki buxgalteriya holati o'zgartirmasdan qayta tiklanishi mumkin `503 Service Unavailable` oladi.

Har bir hosil boʻlgan `pacs.002`, `pacs.004`, `camt.029`, `sese.024`, yoki `sese.025` hujjatni quyidagicha qaytarish `application/xml` javoblarning quyidagi boshliqlari bilan:

|Sarlavha |Maʼnosi |
| ------------------------------ | ----------------------------------------------------- |
|`X-Iroha-Iso-Signature-Domain` |Doimo `iroha.iso20022.outbound.v2` |
|`X-Iroha-Iso-Signer` |Konfiguratsiya qilingan koʻprik imzochisi uchun kanonik ommaviy kalit |
|`X-Iroha-Iso-Signature` |Domen bo ' yicha ajratilgan XML bytlar ustida Base64 imzosi |

Imzoni `iroha.iso20022.outbound.v2` UTF-8 bayt ketma-ketligi, bitta nol bayt va aynan javob tanasi ustidan tekshiring. Tekshirishdan oldin XML-ni qayta formatlamang yoki normallashtirmang.

### Qo‘shimcha tahlilchi va xaritalash yordami {#additional-parser-and-mapping-support}

IVM ISO yordamchisi quyidagi xabarlarni ham tekshiradi va materiallashtiradi. Ular uchun tasdiqlash, hisob-kitob xaritalash yoki keyingi oqim bo'yicha maxsus Torii yo'nalishlari yo'q.

|Xabarlar oilasi |Joriy qoʻllab-quvvatlash |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
|`head.001` | Ishlab chiqarish uchun arizalar boshliqini tasdiqlash ISO zarflar, shu jumladan: `BizMsgIdr`, `MsgDefIdr`, yaratilish vaqti va ixtiyoriy jo'natgich / qabul qiluvchi BIC maydonlar |
|`pacs.007`, `pacs.028`, `pacs.029` |To'lovni qaytarish, status so'rovi va tekshiruvni hal qilish/statusni tahlil qilish |
|`pain.001`, `pain.002` |Mijozning toʻlovni boshlash va toʻlov holati hisobotini tasdiqlash |
|`camt.052`, `camt.053`, `camt.054` |Hisobot hisoboti, ma'lumotlar va bildirishlarni tasdiqlash |

## Kaigi Uchrashuvlar {#kaigi-sessions}

Kaigi SORA Nexus-da pulli real-time audio/video room-larni taqdim etadi. Application barcha conference state-ni off-chain saqlash o'rniga reyestr-backed session creation, roster change, relay manifest, encrypted signaling va usage metering talab qilganda undan foydalaning.

Ruxsatnomaga qarab hayot davri quyidagicha:

- `CreateKaigi`: domen ostida qo'ng'iroqni yaratish va uning siyosati, jadvali, metadatalari va ixtiyoriy relay manifestini saqlash.
- `JoinKaigi`: qo'ng'iroqlar ro'yxatini yangilash. `zk-roster-v1` rejimida ishtirokchi hisob raqami IDs o'rniga, ommaviy qo'ngʻiroq ko'rinishida majburiyat va bekor qiluvchi raqamlar aniqlanadi.
- `LeaveKaigi`: ishtirokchini shaffof qo'ng'iroqdan olib tashlash. Xususiy rejimda chiqish birinchi chiqarilgan protokolda zanjirdan tashqari hisoblanadi.
- `RecordKaigiUsage`: o'lchash muddati va gaz to'plamlarini qo'shish.
- `EndKaigi`: majlisni yakunlab, oxirgi vaqt belgilarini yozib oling.

Torii quyidagi ilovaga ko'ra o'qishni ochadi:

|Yo ' nalish |Tasdiqlash | Maqsad                                    |
| ----------------------------------- | --------------------------------------- | ------------------------------------------ |
|`/v1/kaigi/calls/{call_id}` |ommaviy |joriy qoʻngʻiroq yozuvi |
|`/v1/kaigi/calls/{call_id}/signals` |Kanonik toʻgʻri tarmoq hisobini talab qilish |sahifalar bilan bogʻlangan signallash metadatalari |
|`/v1/kaigi/calls/{call_id}/events` |Kanonik toʻgʻri tarmoq hisobini talab qilish |hayot davri oqimini chaqiring |
|`/v1/kaigi/relays` |ro ' yxatga olingan operatorning iltimosi |relay qisqartmasi |
|`/v1/kaigi/relays/{relay_id}` |ro ' yxatga olingan operatorning iltimosi |bir relayning ro'yxatdan o'tishi va sog'liqni saqlash tafsilotlari |
|`/v1/kaigi/relays/health` |ro ' yxatga olingan operatorning iltimosi |agregat relay sogʻligʻi |
|`/v1/kaigi/relays/events` |Kanonik toʻgʻri tarmoq hisobini talab qilish |Relay roʻyxatdan oʻtish va sogʻliqni saqlash tadbirlari oqimi |

Ilova API yoqilgan bo‘lishi kerak. Relay xulosasi va sog‘liq yo‘nalishlari faqat o‘qish uchun bo‘lsa ham operator yuzalaridir; imzolanmagan `curl` so‘rovi mavjudlikni tekshirish uchun yaroqli probe emas. Sessiya holati `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated` va `KaigiUsageSummary` kabi Kaigi domen hodisalarida ham aks etadi.

### CLI Tut sinovlari {#cli-smoke-test}

Boshlaning `iroha app kaigi` CLI agar siz tekshirishni istasangiz Torii oxirgi nuqta qabul qiladi Kaigi birlashtirishdan oldin amalga oshirilgan UI. Tez ishga tushirish qo'mondoni konfiguratsiya qilingan tugma nuqtaga qarshi xona yaratadi va uning qo'ng'iroq identifikatorini bosib chiqaradi va metadatalarni birlashtiradi:

```bash
iroha app kaigi quickstart \
  --domain kaigi.universal \
  --summary-out kaigi-summary.json
```

Skriptli oqimlar uchun xonaning hayot davrini aniq boshqarish:

```bash
iroha app kaigi create \
  --domain kaigi.universal \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha app kaigi join \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi leave \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi record-usage \
  --domain kaigi.universal \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha app kaigi end --domain kaigi.universal --call-name daily
```

Foydalanish `--room-policy public` relaylar tomoshabinlar uchun chiptalarsiz ko'rsatilishi mumkin bo'lgan xonalar uchun yoki `--room-policy authenticated` Chiqishlar tomoshabinni tasdiqlashi kerak bo'lganda. `--privacy-mode zk-roster-v1` faqat tarmoqning Kaigi ro'yxat va foydalanishni tekshirish kalitlari konfiguratsiya qilingan; boshqacha tarzda qo'shiqlar, varaqlar; va shaxsiy foydalanish yozuvlari deterministik tekshiruvda muvaffaqiyatsiz tugadi.

### JavaScript Integratsiya {#javascript-integration}

Joriy [Iroha JavaScript namoyishi](https://github.com/soramitsu/iroha-demo-javascript) shaffof, tasdiqlangan bir-bir uchrashuv profilini amalga oshiradi. Bu protokolning `zk-roster-v1` dalil oqimini oshkor qilmaydi. Uning rendereri WebRTC takliflari va javoblarini yaratadi, imtiyozli ko'prik esa mahalliy [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) checkoutdan foydalanib, sozlash, imzolash, taqdim etish va yakunlangan Kaigi bitimlarni kutish uchun foydalanadi. .

Koʻring [Oʻrnatilgan Kaigi a JavaScript Ilova](/uz/guide/tutorials/kaigi.md) to'g'ri yo'nalish tasdiqlanishi, taklif shakli, ko'prik chegaralari va joriy demo sinov buyruqlari uchun.

## Holat va metrikalar {#status-and-metrics}

Status va oʻlchovlar oxirgi nuqtalari dastlabki ish stoli boʻladi:

- `/status` yuqori darajadagi tugunlar, bloklar, navbat va konsensus maydonlarini ochadi
- `/metrics` Prometheus hisoblagichlari, o'lchovchilari va histogrammalarini aniqlaydi.

Nexus qo'llab-quvvatlangan nodlarda holat chiqishi yo'l va ma’lumotlar makonidan xabardor bo'lgan qismlarni ham o'z ichiga oladi. `nexus.enabled = false`da ushbu qismlar qoldiriladi.

## JSON va Norito {#json-vs-norito}

Bir nechta operator oxirgi nuqtalari qaytadi Norito Dastlabki sifatida. JSON, joʻnatish:

```http
Accept: application/json
```

Bu ayniqsa quyidagilar uchun foydali:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`

Oxirgi nuqta Norito tilida to'g'ridan-to'g'ri qabul qilganda yoki qaytarib berganda, `application/x-norito` ni tarkib turi yoki `Accept` ustun qiymat sifatida ishlating. Transport tafsilotlari uchun [Norito](/uz/reference/norito.md#torii-and-norito-rpc) ko'ring.

## Telemetriya profillari {#telemetry-profiles}

Oxirgi nuqta ko'rinishi nodning `telemetry.profile` sozlamalariga bog'liq. Joriy konfiguratsiya besh profil darajasini aniqlaydi:

|Profil |`/status` |`/metrics` |Ishlab chiquvchilar yoʻllari |
| ----------- | --------- | ---------- | ---------------- |
|`disabled` |yoʻq |yoʻq |yoʻq |
|`operator` |Ha , shunday .|yoʻq |yoʻq |
|`extended` |Ha , shunday .|Ha , shunday .|yoʻq |
|`developer` |Ha , shunday .|yoʻq |Ha , shunday .|
|`full` |Ha , shunday .|Ha , shunday .|Ha , shunday .|

## CLI Qisqa yo'nalishlar {#cli-shortcuts}

`iroha` CLI allaqachon ushbu oxirgi nuqtalarning ko'pini o'z ichiga oladi:

```bash
export IROHA_OPERATOR_KEY_FILE=/run/secrets/iroha/operator.key

iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  ops sumeragi params
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi evidence count
```

## Yuqori yo'nalishdagi referentlar {#upstream-references}

- [README API va kuzatuvchanlik ko'rib chiqishi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO 20022 ko'priklarni amalga oshirish](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [Ishlab chiqarish va o'lchovlar](/uz/guide/advanced/metrics.md)
