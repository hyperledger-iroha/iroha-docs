---
translation_locale: uz
translation_source: /reference/torii-endpoints.md
translation_source_hash: 6ee65d409642c79bea0f2c4ff0d8cd59b0ec0a29e115225045786d0816e8a6a7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii Keyingi nuqtalar {#torii-endpoints}

Torii bu HTTP, SSE, va WebSocket uchun darvoza Iroha 3. Bu ikkala narsaga ham xizmat qiladi .
kitobga qaraydigan APIs va operator oxirgi nuqtalari.

Amaldagi protokol qoidalari quyidagilar:

- kanonik ikkilamchi format **Norito**
- ko'plab oxirgi nuqtalar ham qo'llab-quvvatlash JSON jo'natganda `Accept: application/json`
- Metriklar Prometheus formatida ko'rsatilgan

Format tafsilotlari, tarkib muzokaralari, layout bayroqlari, sxema hashlari va
Norito RPC yo'l-yo'riq, qarang [Norito ma'lumot](/uz/reference/norito.md).

## O'zaro umumiy maqsadlar {#common-endpoints}

| Keyingi nuqta | Formatlash | Maqsad |
| --- | --- | --- |
| `POST /transaction` | Norito | Imzolangan bitimni taqdim etish |
| `POST /query` | Norito | Imzolangan soʻrovni joʻnatish |
| `GET /events` | WebSocket | Tadbirlar oqimlariga obuna boʻling |
| `GET /block/stream` | WebSocket | Oʻtkazib yuborilgan bloklar |
| `GET /peers` | JSON | O'z navbatida, Torii |
| `GET /health` | JSON | Yengil hayotning oxirgi punkti |
| `GET /api_version` | JSON | Oldindan ko'rsatilgan API versiyasi |
| `GET /status` | JSON | Operatorlar uchun yuqori darajadagi holat qisqartmasi |
| `GET /metrics` | Prometeus | Prometheus scrape oxirgi nuqtasi |
| `GET /schema` | JSON | Dastur modeli sxemalarining nod tomonidan xizmat koʻrsatiladigan fotosuratlari |
| `GET /openapi` yoki `GET /openapi.json` | JSON | OpenAPI aktiv uchun hujjat Torii HTTP yo'nalishlar |
| `GET /v1/parameters` | JSON | Nukl parametrlari fotosuratlari |
| `GET /v1/node/capabilities` | JSON | G'ildirak qobiliyati va ma'lumotlar modeli metadatalari |
| `GET /v1/api/versions` | JSON | Qo'llab-quvvatlash Torii API versiyalar |
| `GET /v1/events/sse` | SSE | Koʻp yillik mijozlar uchun tadbirlar oqimi |
| `GET /v1/time/now` | JSON | Bogʻlamning devorli soat fotosurati |
| `GET /v1/time/status` | JSON | Vaqt sinxronlashtirish holati |

`/openapi` - bu ishlaydigan nod uchun ishonchli oxirgi nuqta ro'yxati.
yuzasi qurilish xususiyatlari va ishga tushirish vaqti konfiguratsiyasiga bog'liq, shunday hosil
mijozlar jonli OpenAPI yo'nalish ro'yxatining qo'lda nusxasi bo'lgan hujjatidan.
Foydalanish [Torii API konsol](/uz/reference/torii-api-console.md) jonli yuklash uchun
Hujjat, sinov JSON yo'nalishlar, nusxa curl talablar, va mijoz kodini ishlab chiqarish
joriy sxema.

## Hayotda harakat qiling Taira Yo'nalishlar {#try-live-taira-routes}

Jamoat Taira sinov tarmog'i xuddi shu Torii JSON qo'llanmani yuzaga chiqarish
mijozlar faqat o'qish uchun foydalanadi. Ushbu buyruqlar kalitlarni talab qilmaydi:

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

Hozirgi dunyo holatiga qaraganda , ilohiy manbalarni sinab koʻring:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Agar jamoat testnet yo'nalishi qaytsa `502`, ko'rsatkichlarini o'zgartirish
navbat, uni oxirgi nuqtaning mavjudligi muammosi sifatida ko'rib chiqish va keyinroq oldin qayta urinib ko'ring
mijoz kodingizni debug qilish.

## Konsens va ish vaqti yakuniy nuqtalari {#consensus-and-runtime-endpoints}

| Keyingi nuqta | Formatlash | Maqsad |
| --- | --- | --- |
| `GET /v1/sumeragi/commit-certificates` | JSON | So'nggi majburiyat sertifikatlari qisqartmalari |
| `GET /v1/sumeragi/validator-sets` | JSON | Tasdiqlovchi oʻrnatilgan tarix |
| `GET /v1/sumeragi/validator-sets/{height}` | JSON | Blok balandligida oʻrnatilgan tasdiqlovchi |
| `GET /v1/sumeragi/status` | Norito yoki JSON | Konsensusning batafsil holati fotosurati |
| `GET /v1/sumeragi/status/sse` | SSE | Tinch konsensus holati oqimi |
| `GET /v1/sumeragi/leader` | JSON | Joriy rahbar ma'lumotlari |
| `GET /v1/sumeragi/qc` | Norito yoki JSON | So'nggi quorum-sertifikatining qisqacha ma'lumotlari |
| `GET /v1/sumeragi/checkpoints` | JSON | Konsensus nazorat punktlari to'liqligi |
| `GET /v1/sumeragi/consensus-keys` | JSON | Aktiv konsensus kalitlari |
| `GET /v1/sumeragi/bls_keys` | JSON | Aktiv BLS konsensus kalitlari |
| `GET /v1/sumeragi/phases` | JSON | So ' nggi bosqich bo ' yicha latency namunasini olish |
| `GET /v1/sumeragi/rbc` | JSON | RBC Sessiya va o'tkazib berish ma'lumotlari |
| `GET /v1/sumeragi/rbc/sessions` | JSON | Aktiv RBC Oʻtkaziladigan fotosurat |
| `GET /v1/sumeragi/pacemaker` | JSON | Pacemakerning holati |
| `GET /v1/sumeragi/params` | JSON | Toʻgʻrilik zanjirida Sumeragi parametrlar |
| `GET /v1/sumeragi/collectors` | JSON | Deterministik kollektor rejasi fotosuratlari |
| `GET /v1/sumeragi/key-lifecycle` | JSON | Konsensus kalit hayot davri holati |
| `GET /v1/sumeragi/telemetry` | JSON | Konsensus telemetriyasining darrov koʻrinishi |
| `GET /v1/sumeragi/evidence` | JSON | Ko'rsatkichlar ro'yxati, tanlash bo'yicha so'rov satrlari bilan filtrlangan |
| `GET /v1/sumeragi/evidence/count` | JSON | Ko'rsatkichlar soni |
| `POST /v1/sumeragi/evidence/submit` | JSON | Konsensusga asoslangan dalillarni taqdim etish |
| `GET /v1/sumeragi/commit_qc/{hash}` | Norito yoki JSON | Oʻzingizning majburiyatingiz QC blok hash uchun rekord |
| `GET /v1/runtime/abi/active` | JSON | Aktiv ishga tushirish vaqti ABI deskriptor |
| `GET /v1/runtime/abi/hash` | JSON | Aktiv ishga tushirish vaqti ABI hash |
| `GET /v1/runtime/metrics` | JSON | Ish vaqti maʼlumotlari fotosuratlari |
| `GET /v1/runtime/upgrades` | JSON | Ish vaqti yangilanish roʻyxati |
| `POST /v1/runtime/upgrades/propose` | JSON | Ish vaqti yangilanishini taklif qiling |
| `POST /v1/runtime/upgrades/activate/{id}` | JSON | Ish vaqti yangilanishini faollashtirish |
| `POST /v1/runtime/upgrades/cancel/{id}` | JSON | Ish vaqti yangilanishini bekor qilish |

## App va SORA Yo'nalish oilalari {#app-and-sora-route-families}

Qachon Torii qo'llanmalarga moslashadigan xususiyatlar to'plami bilan qurilgan bo'lib, u qo'shimcha JSON
kashfiyotchilar oilalari, SORA xizmatlar, ko'prik oqimlari, ishlov berish va saqlash.
har bir tarmoq profilida barcha oilalar yoqilmaydi.

| Yo'nalish oilasi | Maqsad |
| --- | --- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*` | JSON o'qish, so'rov yordamchilari, onboarding yordamchilari va portfel yoki egalar ko'rinishi |
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*` | NFT, real dunyodagi aktivlar va maxfiy aktiv ko'rinishlari |
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` | Nom, alias va identifikatorni aniqlash |
| `/v1/explorer/*` | Explorer-ga yo'naltirilgan hisob, aktiv, blok, bitim, ko'rsatma, metrik va oqim ko'rinishlari |
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*` | Transaksiya tarixi, quvurni tiklash yoki holati va ISO 20022 yordamchilar |
| `/v1/contracts/*` | Shartnoma kodlari, joylashtirish, paketlash, qo'ng'iroq qilish, ko'rish, voqea, faoliyat, ro'yxat va davlat yo'nalishlari |
| `/v1/multisig/*`, `/v1/controls/*` | Ko'p sigma takliflari, tasdiqlash va o'tkazish-kontrol yordamchilari |
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*` | Yakuniylik, holatni tasdiqlash, blokni tasdiqlash, dalillarni saqlash va dalillar so'rovini olish yo'nalishlari |
| `/v1/da/*` | Ma'lumotlar mavjudligi, manifestlar, dalil siyosati, majburiyatlar va aniq maqsadlar |
| `/v1/zk/*` | ZK ildizlar, dalillarni tasdiqlash; IVM isbotlash, ovozlarni hisoblab chiqish, tekshirish kalitlari, isbot hujjatlari va ilovalar |
| `/v1/gov/*`, `/v1/ministry/*` | Boshqaruv takliflari, ovoz berish notasi, kengashning davlati, himoyalangan nomlar maydonlari, kun tartibining takliflari, qonun qabul qilinishi va yakunlanishi |
| `/v1/nexus/*`, `/v1/sccp/*` | Nexus yo'nalish, ma'lumotlar maydoni va zaryadli sinov yordamchilari |
| `/v1/musubi/*` | Musubi paketlar reyestrini oʻqish va koʻrsatmalarni yaratish |
| `/v1/subscriptions/*` | Abonentlik rejalari, abonnement hayot davri, foydalanish va yordamchilarni to'lash |
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*` | SoraFS provayderni kashf etish, quvvatni tasdiqlash, pinning qilish, saqlash va ommaviy tarkibni xizmat ko'rsatish |
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*` | SoraCloud Xizmatning hayot davri, xususiy hisoblash/model oqimlari, jamoatchilikni kashf etish va uyushtirilgan dasturlarni yo'naltirish |
| `/v1/connect/*`, `/v1/vpn/*` | Iroha O'tirishlarni ulash, WebSocket transport, VPN Uchrashuvlar, profillar va rasmlar |
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*` | Ilova API bog'lanish va to'plam/CID-tashkilangan tarkib yo'nalishi |
| `/v1/operator/*`, `/v1/mcp` | Operatorning haqiqiyligi va natij MCP JSON-RPC koʻprik |
| `/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` | Offline tayyorlik, depozit shartnomalari, ma'lumotlar maydonining manifestlari va [RAM-LFE yordamchilar](/uz/blockchain/ram-lfe.md#torii-routes) |
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*` | Hamkorlik, veb-qo'shish, push xabardor qilish va jonli telemetriya integratsiyalari |

## ISO 20022 ko'prik {#iso-20022-bridge}

Torii koʻrsatkichlarini ISO 20022 ko'prik ostida `/v1/iso20022/*` ilovaga qaraganda
API va ko'prik ish vaqti qo'llanilgan.
umumiy maqsadga mo'ljallanmagan ISO 20022 clearing gateway, lekin qo'llab-quvvatlanadigan subset
tanlangan to'lov xabarlarini imzolanganlarga aylantirish Iroha o'tkazib berish va kuzatish uchun
ularning hisob daftarining holati.

### Torii ISO 20022 Yakuniy nuqta {#torii-iso-20022-endpoints}

| usuli va yakuniy nuqtasi | Maqsad |
| --- | --- |
| `POST /v1/iso20022/pacs008` | O ' zbekiston Respublikasi FI-To-FI mijoz kredit transferi va moslashtirishni yaratish Iroha aktivlarni o'tkazish |
| `POST /v1/iso20022/pacs009` | O ' zbekiston Respublikasi FI-To-FI kredit o'tkazish uchun ishlatiladi PvP yoki qimmatli qog'ozlar bilan bog'liq naqd pul mablag'lari |
| `POST /v1/iso20022/pacs002` | Toʻlov holati toʻgʻrisidagi hisobotni taqdim etish |
| `POST /v1/iso20022/pacs004` | Toʻlov deklaratsiyasini taqdim etish |
| `POST /v1/iso20022/camt056` | To'lovni bekor qilish uchun ariza berish |
| `POST /v1/iso20022/sese023` | Qimmatli qog'ozlar bilan hisob-kitob qilish bo'yicha ko'rsatma taqdim etish |
| `POST /v1/iso20022/sese024` | Qimmatli qogʻozlar hisob-kitobining holati xabarini taqdim etish |
| `POST /v1/iso20022/sese025` | Qimmatli qog'ozlar bo'yicha hisob-kitobni tasdiqlashni taqdim etish |
| `POST /v1/iso20022/colr012` | Qarz almashtirish xabarini yuborish |
| `GET /v1/iso20022/messages/{msg_id}` | Bir xabar uchun kanonik koʻprik yozuvini oʻqing |
| `GET /v1/iso20022/audit/messages` | O ' rganish uchun aniq xabarlar tekshiruvi mannifini o 'qing |
| `GET /v1/iso20022/messages/{msg_id}/pacs002` | Joriy to ' lov holatini `pacs.002` XML |
| `GET /v1/iso20022/messages/{msg_id}/pacs004` | Joriy to ' lovni qaytarish `pacs.004` XML |
| `GET /v1/iso20022/messages/{msg_id}/camt029` | Joriy bekor qilish rezolyutsiyasini `camt.029` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese024` | Joriy hisob-kitob holatini `sese.024` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese025` | Joriy hisob-kitob tasdiqnomasi `sese.025` XML |

`pacs.008` taqdimotlar xabarni yetkazishi kerak ID, banklararo hisob-kitob
miqdor, valyuta, hisob-kitob sanasi, qarzdor va kreditor IBANs, va qarzdor va
kreditor BICs. Referent ma'lumotlar sozlanganda, ko'prik shuningdek
BIC, IBAN, va ISO 4217 hosil bo'lgan operatsiya oldin valyuta o'tish
quvurga kiradi.

`pacs.009` taqdimotlar biznes xabarini berishi kerak ID, xabarning ta'rifi
ID, yaratish vaqti, banklararo hisob-kitob miqdori, valyuta, hisob-kitob sanasi;
ko'rsatma beruvchi va ko'rsatmalar berilgan vakil BICs, va qarzdor va kreditor IBANs. Agar
xabarga kiradi `Purp`, ko'prik hozirda qimmatli qog'ozlar uchun moliyalashtirishni qabul qiladi
faqat: `Purp=SECU`.

O ' zbekiston Respublikasi `pacs.008` va `pacs.009` taqdim etishning oxirgi nuqtalari qabul qilinadi XML ISO zarflar yoki
ko'prik sinovlarida qo'llaniladigan tekis maydon shakli. `SplmtryData` maydonlar
maqsadni o'rnatishi mumkin Iroha katta hisob raqami, manba va maqsadli hisob raqamlari IDs yoki manzillar,
va aktivni aniqlash ID. Javob: `202 Accepted` bilan `message_id`,
`transaction_hash`, `status`, `pacs002_code`, va hal qilingan
Katta hisob/hisob-kitob/mashnat kontekstini ko'rsatish.

### Qo'shimcha Parser va xaritalash qo'llab-quvvatlash {#additional-parser-and-mapping-support}

O ' zbekiston Respublikasi IVM ISO yordamchi quyidagi xabarni ham tasdiqlaydi va amalga oshiradi
qadoqlarni tasdiqlash, joylashtirish xaritalash yoki oqshomdan pastga o'tish uchun oilalar
Ular o'z-o'zlari bilan Torii yo'nalishlar.

| Xabarlar oilasi | Joriy qo'llab-quvvatlash |
| --- | --- |
| `head.001` | Ishlab chiqarish uchun arizalar boshliqini tasdiqlash ISO qadoqxonalar, shu jumladan `BizMsgIdr`, `MsgDefIdr`, yaratilish vaqti va ixtiyoriy jo'natgich/oluvchi BIC maydonlar |
| `pacs.007`, `pacs.028`, `pacs.029` | To'lovni bekor qilish, status so'rovi va tekshirishni hal etish/statusni tahlil qilish |
| `pain.001`, `pain.002` | Mijozning to'lovni boshlash va to'lov holati hisobotini tasdiqlash |
| `camt.052`, `camt.053`, `camt.054` | Hisobot, hisobot va bildirishlarni tasdiqlash |

## Kaigi Uchrashuvlar {#kaigi-sessions}

Kaigi to'lovli, real vaqt audio/video xonalarini taqdim etadi SORA Nexus. Uni qachon ishlating
ilovalar uchun katta hisobda qo'llab-quvvatlanadigan seans yaratish, ro'yxat o'zgartirishlari, relay kerak
manifestlar, shifrlangan signallash va foydalanish o'lchash
davlat tomonidan o'tkazilgan konferentsiyalar.

Katta kitobga koʻzlangan hayot davri:

- `CreateKaigi`: domen ostida qo'ng'iroqni yaratish va uning siyosatini saqlash,
  jadval, metadotlar va tanlovli relay manifest.
- `JoinKaigi` va `LeaveKaigi`: qo'ng'iroqlar ro'yxatini yangilash.
  ishtirokchilar o'rniga majburiyatlarni, bekor qiluvchilarni va ro'yxatni tasdiqlovchi hujjatlarni ishlatadilar
  ishtirokchi hisob raqami IDs to'g'ridan-to'g'ri.
- `RecordKaigiUsage`: o'lchash muddati va gaz to'plamlarini qo'shish.
- `EndKaigi`: seansni yakunlab, oxirgi vaqt belgilarini yozib oling.

Torii relay telemetriyasini koʻrsatadi `/v1/kaigi/relays`,
`/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, va
`/v1/kaigi/relays/events` ilova qachon API va telemetriya xususiyatlari qo'llanilgan.
Uchrashuv holati Kaigi domen hodisalari
`KaigiRosterSummary`, `KaigiRelayManifestUpdated`,
`KaigiRelayHealthUpdated`, va `KaigiUsageSummary`.

### CLI Tovuq sinovlari {#cli-smoke-test}

Boshlaning `iroha kaigi` CLI agar siz a Torii yakuniy nuqta
qabul qiladi Kaigi aloqa o'rnatishdan oldin amalga oshirilgan UI. Tez ishga tushirish buyruqi
faollarga qarshi vaqtinchalik xona yaratadi Torii yakuniy nuqta va qisqartma chop etadi
qo'ng'iroq identifikatori bilan, buyruqqa qo'shiling va SoraNet koʻchma ishora:

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

Foydalanish `--room-policy public` relaylar tomoshabinsiz ko'rsatilishi mumkin bo'lgan xonalar uchun
chiptalar yoki `--room-policy authenticated` chiqishlar tomoshabinni talab qilishi kerak bo'lganda
haqiqiyligini tasdiqlash. `--privacy-mode zk-roster-v1` faqat tarmoq
ko'rsatilgan Kaigi ro'yxat va foydalanishni tasdiqlash kalitlari konfiguratsiya qilingan; boshqacha tarzda qo'shiqlar, varaqlar,
va xususiy foydalanish yozuvlari deterministik tekshirish davomida muvaffaqiyatsiz tugadi.

### Sinovlar JavaScript Demo {#testing-with-the-javascript-demo}

Foydalanish
[soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript)
Desktop demo uchun oxir-oqibat pulport sinov. Demo elektron va Vue
to'g'ridan-to'g'ri murojaat qiladigan ilova Torii mahalliy `@iroha/iroha-js`
bog'liq va a `/kaigi` brauzer natijasiga ega bo'lgan bir-bir media uchun yo'l.

Demo bilan foydalanish
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
bilan Iroha Manba repository. demo pinlar SDK orqali
`file:../iroha/javascript/iroha_js`, Shunday qilib , ikkala kassatani ham shu singilga qoʻying .
dizayn:

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

Foydalanish Node.js 20 yoki undan yangi va Rust asbob-uskunalar zanjirida natijador `iroha_js_host`
Modul qurishi mumkin. SDK opa-singillarda Iroha o ' zgartirilganidan so'ng checkout
manbai; toza paketning joylashuvi Cargo ish maydonini o'z ichiga olmaydi
zarur bo ' lgan `npm run build:native`.

Kontrolli sinov uchun demo-ni Kaigi- qobiliyatli Torii yakuniy nuqta:

1. Oʻrnatish Iroha toʻplam bilan SORA/Kaigi ilovaga qaraydigan APIs qo'llab-quvvatlangan yoki
   ommaviy oxirgi nuqta bo'lib, Kaigi Sizga kerak bo'lgan yuzalar.
2. Boshlang'ichligi tekshiruvi `/health`, soʻngra jonli yoʻnalish yuzasini tekshirish
   bilan `/openapi` yoki `/openapi.json`. Ba'zi joylashtirishlar ham oshkor qiladi
   `/v1/health`, lekin `/health` bu portativ hayot ta'minoti tekshiruvi.
3. uchun TAIRA, jonli uchrashuvni sinab ko'rishdan oldin relay telemetriya yo'nalishlarini tekshirish:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

   Ushbu tekshiruvlar Torii va Kaigi Telemetriyaning ta'minlanishi mumkin.
   yig'ilish tuzmaslik; `CreateKaigi` va `JoinKaigi` hali ham mablag ' bilan ta'minlanishi kerak
   pulparchalar va imzolangan tranzaksiyalarni taqdim etish.
4. Demoni oching, ket **Sozlamalar**, qoʻyish Torii URL, va dasturni yuklash
   zanjir ID va oxirgi nuqtadan tarmoq prefiksi.
5. Demo-da ikkita mahalliy hamyon yarating yoki tiklang.
   profillar yoki mashinalar, shuning uchun uy egasi va mehmon alohida hamyoz holatiga ega.

O ' zbekiston Respublikasining Kaigi UI:

1. Uy egasi oynasida ochiq **Kaigi**, tanlang **Uchrashuvni boshlash**, nom qo'yish;
   va tanlash **Xususiy taklif** yoki **Ochiq taklif**.
2. Tanlang **Kamera va mikrofonni yoqing** Shunday qilib WebRTC mahalliy ommaviy axborot vositalariga ega.
3. Tanlang **Uchrashuvlar uchun bogʻ yaratish**. Toʻgʻridan-toʻgʻri toʻliq pul `CreateKaigi`; ko'rsatilgan
   ilova keyin koʻrsatilgan `iroha://kaigi/join?call=...&secret=...` taklif va a
   `#/kaigi?...` Qaytish yo'li.
4. Uy egasi oynasini ochiq saqlang va taklifni mehmon bilan bo'lishing.
5. Mehmonlar oynasida taklifni oching yoki uni o'chiring **Uchrashuvga qoʻshiling**, burish
   mahalliy ommaviy axborot vositalarida va tanlang **Uchrashuvga qoʻshiling**. Toʻgʻri pulparastlik
   kodlangan xost taklifidan Torii va taqdim etadi `JoinKaigi` kodlangan
   Metadatalarga javob bering.
6. Uy egasi birinchi javobni avtomatik ravishda oqish yoki ovoz berish orqali qoʻllaishi kerak Kaigi
   Qo'ng'iroq signallari. Ikkala darcha ham bog'langan media va yangilangan
   aloqa tafsilotlari.
7. Sessiyani uy egasi tomonidan tugatish yoki CLI `iroha kaigi end` buyruq uchun
   bir xil qo'ng'iroq ID.

Xususiy Kaigi talablar himoyalangan XOR xususiy kirish punktining to'lovini to'lash uchun.
demo hisobotlari xususiy Kaigi talablar himoyalangan XOR, ilova ichida foydalanish
o'z-o'zini himoya qilish va yaratish yoki qo'shish harakatni qayta urinib ko'ring. Agar dalil ishlab chiqarish,
xususiy moliyalashtirish yoki jonli signallash mavjud emas, demo
shaffof/qo'l o'tkazgich. **Yuqori signallashtirish**, nusxa olish
xom taklif yoki javob paketi, va boshqa oynada qo'yish.

Demo repo-da avtomatik tekshiruvlar uchun quyidagilarni ishga tushiring:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

Fokuslangan Vitest suitelari qoplami Kaigi uchrashuvlar uchun bog'lanish yaratish, kompakt taklif
yuklash, xususiy yaratish / qo'shilish / yakuniy ko'prik chaqirishlari, o'z-o'zini himoya qilish iltimoslari, qo'llanma
va so'rovlarga javob berish. UI tutun tekshiruvi `/kaigi` yo'nalish
ish stoli va mobil hajmdagi ko'rish portlarida.
brauzerda kamera/mikrofon ruxsatlari uchun qo'llanma ikki derazali sinov kerak
va tengdosh media oqimlari atrof-muhitga mos.

Namuna integratsiyasi kodi uchun ko'ring
[Oʻrnatilgan Kaigi a JavaScript Ilova](/uz/guide/tutorials/kaigi.md).

## Davlat holati va ma'lumotlari {#status-and-metrics}

Status va ma'lumotlarning oxirgi nuqtalari dastlabki ish stoliga o'tkaziladi:

- `/status` yuqori darajadagi tengdoshlar, bloklar, navbat va konsensus maydonlarini aniqlaydi
- `/metrics` Prometheus hisoblagichlari, o'lchovchilari va histogrammalarini aniqlaydi

O ' z ichiga Nexus-mo'ljallangan nodlar, holat chiqish ham yo'nalish va ma'lumotlar maydoni xabardor
bo'limlar. `nexus.enabled = false`, ushbu bo'limlar chiqarib tashlanadi.

## JSON o ' zgarish Norito {#json-vs-norito}

Bir nechta operator oxirgi nuqtalari qaytadi Norito Dastlabki sifatida.
JSON, yuborish:

```http
Accept: application/json
```

Bu ayniqsa quyidagilar uchun foydali:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

To'plamni qabul qilish yoki qaytarish Norito to'g'ridan-to'g'ri foydalanish
`application/x-norito` tarkib turi yoki tanlangan `Accept` qiymati.
[Norito](/uz/reference/norito.md#torii-and-norito-rpc) transport tafsilotlari uchun.

## Telemetriya profillari {#telemetry-profiles}

Terminalning ko'rinishi telemetriya sozlamalariga bog'liq.
beshta profil darajasi:

| Profil | `/status` | `/metrics` | Ishlab chiquvchilar yo'nalishlari |
| --- | --- | --- | --- |
| `disabled` | yo'q | yo'q | yo'q |
| `operator` | Ha , shunday | yo'q | yo'q |
| `extended` | Ha , shunday | Ha , shunday | yo'q |
| `developer` | Ha , shunday | yo'q | Ha , shunday |
| `full` | Ha , shunday | Ha , shunday | Ha , shunday |

## CLI Qisqacha yo'llar {#cli-shortcuts}

O ' zbekiston Respublikasi `iroha` CLI allaqachon ushbu oxirgi nuqtalarning koʻpini oʻrab oladi:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## Yuqoridagi ma'lumotlar {#upstream-references}

- [README API va kuzatuvchanlik ko'rinishi](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 ko'priklarni amalga oshirish](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [Ishlab chiqarish va o'lchovlar](/uz/guide/advanced/metrics.md)
