---
translation_locale: uz
translation_source: /reference/torii-endpoints.md
translation_source_hash: 9bec41b1b419e252fdcff8328e7950a294bdad3ac40112a5a7f2ce451d19e9cb
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Torii Oxirgi nuqtalar {#torii-endpoints}

Torii - bu HTTP, SSE va WebSocket darvozalari bo'lgan Iroha 3. U zarbaxonaga qaraydigan APIs va operatorning oxirgi nuqtalariga ham xizmat qiladi.

Amaldagi protokol qoidalari quyidagilardir:

- kanonik ikkilamchi format Norito
- ko'plab oxirgi nuqtalar JSON ni ham qo'llab-quvvatlaydi, chunki siz `Accept: application/json`ni yuborasiz.
- Metriklar Prometheus formatida ko'rsatilgan

Format tafsilotlari, tarkib muzokaralari, layout bayroqlari, sxema hashlari va Norito RPC yo'l-yo'riq uchun [Norito ko'rsatkichini ko'ring ](/uz/reference/norito.md).

## O'zaro o'xshash maqsadlar {#common-endpoints}

|Keyingi nuqta |Format |Maqsad|
| --- | --- | --- |
|`POST /transaction` |Norito |Imzolangan bitimni taqdim etish |
|`POST /query` |Norito |Imzolangan soʻrovni yuborish |
|`GET /events` |WebSocket |Tadbirlar oqimlariga obuna boʻling |
|`GET /block/stream` |WebSocket |Joʻnatilgan bloklar oqimi |
|`GET /peers` |JSON |Torii tomonidan aniqlangan tengdoshlar ro'yxati |
|`GET /health` |JSON |Yengil hayot tarzi yakuniy nuqtasi |
|`GET /api_version` |JSON |Andoza API versiyasi |
|`GET /status` |JSON |Operatorlar uchun yuqori darajadagi holat xossalari |
|`GET /metrics` |Prometheus |Prometheus scraping oxirgi nuqtasi |
|`GET /schema` |JSON |Maʼlumotlar modeli sxemasining nod tomonidan xizmat koʻrsatiladigan fotosuratlari |
|`GET /openapi` yoki `GET /openapi.json` |JSON |Aktiv Torii HTTP yo'nalishlari uchun OpenAPI hujjati |
|`GET /v1/parameters` |JSON |Nukl parametrlari fotosuratlari |
|`GET /v1/node/capabilities` |JSON |Nukllar qobiliyati va ma'lumotlar modeli metadatalari |
|`GET /v1/api/versions` |JSON |Qo'llab-quvvatlanadigan Torii API versiyasi |
|`GET /v1/events/sse` |SSE |Koʻp yillik mijozlar uchun tadbirlar oqimi |
|`GET /v1/time/now` |JSON |Nodular devor soatini koʻrish |
|`GET /v1/time/status` |JSON |Vaqt sinxronlashtirish holati |

`/openapi` ishlaydigan nod uchun ishonchli oxirgi nuqtalar ro'yxati. To'g'ri yuza qurilish xususiyatlariga va ishga tushirish vaqti konfiguratsiyasiga bog'liq, shuning uchun yaratilgan mijozlar qo'lda nusxalashtirilgan yo'nalish ro'yxatidan ko'ra jonli OpenAPI hujjatini afzal ko'rishlari kerak. Ushbu jonli hujjatni yuklash, JSON yo'nalishlarini sinovdan o'tkazish, curl so'rovlarini nusxa olish va joriy sxemadan mijoz kodini yaratish uchun [Torii API konsolini ](/uz/reference/torii-api-console.md) qo'llang.

## Taira yo'nalishlarini sinab ko'ring {#try-live-taira-routes}

Umumiy Taira testnet dastur mijozlari faqat o'qish uchun ishlatadigan xuddi shu Torii JSON yuzasini ochadi. Ushbu buyruqlar uchun kalitlar talab qilinmaydi:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS "$TAIRA_ROOT/v1/node/capabilities" \
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

|Keyingi nuqta |Format |Maqsad|
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
|`GET /v1/sumeragi/phases` |JSON |Faza boʻyicha soʻnggi kechiktirish namunalari |
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
|`GET /v1/runtime/metrics` |JSON |Ishga tushish vaqti maʼlumotlari |
|`GET /v1/runtime/upgrades` |JSON |Ish vaqti yangilanish roʻyxati |
|`POST /v1/runtime/upgrades/propose` |JSON |Ish vaqti yangilanishini taklif qiling |
|`POST /v1/runtime/upgrades/activate/{id}` |JSON |Tartib qilingan ishga tushirish vaqti yangilanishini faollashtirish |
|`POST /v1/runtime/upgrades/cancel/{id}` |JSON |Tartib qilingan ishga tushirish vaqti yangilanishini bekor qilish |

## App va SORA yo'nalishidagi oilalar {#app-and-sora-route-families}

Torii dasturga mos xususiyatlar to'plami bilan qurilganda, u qidiruvchilar uchun qo'shimcha JSON oilalarini, SORA xizmatlarini, ko'prik oqimlarini, dalillarni va saqlashni ochib beradi. Ushbu oilalarning barchasi har bir tarmoq profilida yoqilmaydi.

|Yoʻnalish oilasi |Maqsad|
| --- | --- |
|`/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*` |JSON o'qishlar, so'rov yordamchilari, onboarding yordamchilari va portfel yoki egalar ko'rinishi |
|`/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*` |NFT, real dunyo aktivlari va maxfiy aktivlar ko'rinishi |
|`/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` |Ism, alias va identifikator rezolyutsiyasi |
|`/v1/explorer/*` |Explorerga yoʻnaltirilgan hisobvaraq, aktiv, blok, tranzaksiya, koʻrsatma, metrika va oqim koʻrinishlari |
|`/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*` |Transaksiya tarixi, quvurni tiklash yoki holati va ISO 20022 yordamchilar |
|`/v1/contracts/*` |Shartnoma kodi, ishga tushirish, paketlash, qo'ng'iroq qilish, ko'rish, voqea, faoliyat, ro'yxatga olish va davlat yo'nalishlari |
|`/v1/multisig/*`, `/v1/controls/*` |Multisig takliflari, ma'qullash va o'tkazib yuborishni nazorat qilishda yordamchilar |
|`/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*` |So'nggi muddat, holatni tasdiqlash, blokni tasdiqlash, dalillarni saqlash va dalillar so'rovini olish yo'nalishlari |
|`/v1/da/*` |Ma'lumotlar mavjudligi qabul qilinishi, manifestlar, dalil siyosati, majburiyatlar va aniq maqsadlar |
|`/v1/zk/*` |ZK ildizlar, dalillarni tekshirish, IVM dalillarini tasdiqlash, ovozlarni hisobga olish, tekshiruv kalitlari, dalillarni qayd etish va qo'shimchalar  |
|`/v1/gov/*`, `/v1/ministry/*` |Boshqaruv takliflari, ovoz berish notasi, kengashning davlati, himoyalangan nomlar maydonlari, kun tartibidagi takliflar, qonun qabul qilinishi va yakunlanishi |
|`/v1/nexus/*`, `/v1/sccp/*` |Nexus yo'nalish, ma'lumotlar maydoni va to'liq zanjirli sinov yordamchilari |
|`/v1/musubi/*` |Musubi paketlar reyestrini oʻqish va koʻrsatmalarni yaratish |
|`/v1/subscriptions/*` |Obunalik rejalari, obunalik hayot davri, foydalanish va yordamchilarni to'lash |
|`/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*` |SoraFS provayderni kashf etish, quvvatni tasdiqlash, pinning qilish, saqlash va ommaviy tarkibni xizmat ko'rsatish |
|`/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*` |SoraCloud xizmat hayoti davri, xususiy hisoblash/model oqimlari, ommaviy kashfiyot va uyushtirilgan ilovalarni yo'naltirish |
|`/v1/connect/*`, `/v1/vpn/*` |Iroha Qo'shish seanslari, WebSocket transport, VPN uchrashuvlar, profillar va rasmga ega bo'lish |
|`/v1/app-api/*`, `/v1/api/*`, `/v1/content/*` |App API bog'lanish va paket/CID tomonidan qo'llab-quvvatlanadigan tarkib yo'nalishi |
|`/v1/operator/*`, `/v1/mcp` |Operatorning tasdiqlanishi va mahalliy MCP JSON-RPC ko'priklari |
|`/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` |Offline tayyorlik, ombor shartnomalari, ma'lumotlar maydonining manifestlari va [RAM-LFE yordamchilar ](/uz/blockchain/ram-lfe.md#torii-routes)  |
|`/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*` |Hamkorlik, veb-qo'shish, push xabardorlik va jonli telemetri integratsiyalari |

## ISO 20022 ko'prik {#iso-20022-bridge}

Torii ISO 20022 ko'prini `/v1/iso20022/*` ostida qo'llaydi, agar dasturga qaraydigan API va ko'prikni ishga tushirish vaqti yoqilgan bo'lsa. Ko'prik niyat bilan: bu umumiy maqsadga mo'ljallangan ISO 20022 clearing gateway emas, balki tanlangan to'lov xabarlarini Iroha imzolangan o'tkazmalarga aylantirish va ularning katta qog'ozdagi holatini kuzatish uchun qo'llab-quvvatlanadigan kichik guruhdir.

### Torii ISO 20022 Yakuniy nuqtalar {#torii-iso-20022-endpoints}

|usuli va oxirgi nuqtasi |Maqsad|
| --- | --- |
|`POST /v1/iso20022/pacs008` |FI-to-FI mijoz kreditini o'tkazish va moslashtirilgan Iroha aktivni o'tkazish |
|`POST /v1/iso20022/pacs009` |FI dan FI ga PvP yoki qimmatli qog'ozlar bilan bog ' liq naqd pul mablag ' lari uchun ishlatilgan kredit o ' tkazmasini taqdim etish |
|`POST /v1/iso20022/pacs002` |To ' lov holati to ' g ' risidagi hisobotni taqdim etish |
|`POST /v1/iso20022/pacs004` |Toʻlov deklaratsiyasini taqdim etish |
|`POST /v1/iso20022/camt056` |Toʻlovni bekor qilish toʻgʻrisida ariza berish |
|`POST /v1/iso20022/sese023` |Qimmatli qogʻozlar bilan hisob-kitob qilish boʻyicha koʻrsatma taqdim etish |
|`POST /v1/iso20022/sese024` |Qimmatli qogʻozlar boʻyicha hisob-kitobning holati xabarini taqdim etish |
|`POST /v1/iso20022/sese025` |Qimmatli qog ' ozlar bo ' yicha hisob-kitobni tasdiqlashni taqdim etish |
|`POST /v1/iso20022/colr012` |O ' rnini bosish xabarini yuboring |
|`GET /v1/iso20022/messages/{msg_id}` |Bir xabar uchun kanonik koʻprik yozuvini oʻqing .|
|`GET /v1/iso20022/audit/messages` |O ' rnatilgan xabarlarni o ' rganing .|
|`GET /v1/iso20022/messages/{msg_id}/pacs002` |Joriy to'lov holatini `pacs.002` XML deb qaytarish. |
|`GET /v1/iso20022/messages/{msg_id}/pacs004` |Joriy to'lov deklaratsiyasini `pacs.004` XML sifatida qaytaring. |
|`GET /v1/iso20022/messages/{msg_id}/camt029` |Joriy bekor qilish rezolyutsiyasini `camt.029` XML deb berish. |
|`GET /v1/iso20022/messages/{msg_id}/sese024` |Joriy hisob-kitob holatini `sese.024` XML deb berish. |
|`GET /v1/iso20022/messages/{msg_id}/sese025` |Joriy hisob-kitob tasdiqnomasi `sese.025` XML sifatida berilsin. |

`pacs.008` taqdimotlarida xabar ID, banklararo hisob-kitob miqdori, valyuta, hisob-kitob sanasi, qarzdor va kreditor IBANs hamda qarzdor bilan kreditor BICs bo'lishi kerak. Referent ma'lumotlar sozlanganda, ko'prik ishlab chiqarilgan tranzaksiya quvurga kirishdan oldin BIC, IBAN va ISO 4217 valyutalar o'tish joylarini tekshiradi.

`pacs.009` taqdimotlarida biznes xabarini ID, xabarning ta'rifini ID, yaratish vaqti, banklararo hisob-kitob miqdori, valyuta, hisob-kitob sanasi ko'rsatilishi kerak. topshiriq beruvchi va topshiriq beruvchi vakil BICs, qarzdor va kreditor IBANs. Agar xabarda `Purp` mavjud bo'lsa, ko'prik hozirda faqat qimmatli qog'ozlar uchun moliyalashtirishni qabul qiladi: `Purp=SECU`.

O ' zbekiston Respublikasining `pacs.008` va `pacs.009` ko'rsatkichlar qabul qilinadi XML ISO ko'prik sinovlarida qo'llaniladigan konvertlar yoki tekis maydon shakli. `SplmtryData` maydonlar maqsadni belgilashlari mumkin Iroha katta hisob raqami, manba va maqsadli hisob raqamlari IDs yoki manzillar va aktivlarni aniqlash ID. Javob: `202 Accepted` bilan `message_id`, `transaction_hash`, `status`, `pacs002_code`, va hal qilingan katta ma'lumotlar/hisob-kitob/mashnat kontekstini ko'rsatish.

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
- `JoinKaigi` va `LeaveKaigi`: qo'ng'iroqlar ro'yxatini yangilash. Xususiy rejimda ishtirokchilar ishtirokchi hisob raqamlarini IDs to'g'ridan-to'g'ri ochib berishning o'rniga majburiyatlar, bekor qilish belgilari va ro'yxatni tasdiqlashdan foydalanadilar.
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

Iroha manbai omboridan [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) bilan demo-ni ishlating. Demo pinlari SDK dan `file:../iroha/javascript/iroha_js` gacha bo'ladi, shuning uchun ikkala checkout ushbu singil layotida saqlang:

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

Qo'riqlanadigan sinov uchun demo Kaigi qobiliyatiga ega Torii oxirgi nuqtaga ko'rsatilgan:

1. SORA/Kaigi dasturiy ta'minotni ko'tarib turadigan APIs nishonchasi bilan Iroha nodni ishga tushiring yoki kerakli Kaigi yuzalarini ochib beradigan ommaviy oxirgi nuqtadan foydalaning.
2. `/health` bilan asosiy yetib olishni tekshiring, so'ngra jonli yo'nalish yuzasini `/openapi` yoki `/openapi.json` bilan tekshiring. Ba'zi joylashtirishlarda `/v1/health` ham aniqlanadi, ammo `/health` - bu ko'chma hayot tarzini tekshirishdir.
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

1. Uy egalari oynasida Kaigi oching, uchrashuvni boshlashni tanlang, mavzuni o'rnating va Xususiy taklif yoki shaffof taklifni tanlang.
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

Yakuniy nuqtalarning ko‘rinishi tugunning `telemetry.profile` sozlamasiga bog‘liq. Joriy konfiguratsiya beshta profil darajasini taqdim etadi:

|Profil |`/status` |`/metrics` |Ishlab chiquvchilar yoʻllari |
| --- | --- | --- | --- |
|`disabled` |yoʻq |yoʻq |yoʻq |
|`operator` |ha |yoʻq |yoʻq |
|`extended` |ha |ha |yoʻq |
|`developer` |ha |yoʻq |ha |
|`full` |ha |ha |ha |

## CLI Qisqa yo'nalishlar {#cli-shortcuts}

`iroha` CLI allaqachon ushbu oxirgi nuqtalarning ko'pini o'z ichiga oladi:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## Yuqori yo'nalishdagi referentlar {#upstream-references}

- [README API va kuzatuvchanlik ko'rib chiqishi](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 ko'priklarni amalga oshirish](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [Ishlab chiqarish va o'lchovlar](/uz/guide/advanced/metrics.md)
