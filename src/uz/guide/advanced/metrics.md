---
translation_locale: uz
translation_source: /guide/advanced/metrics.md
translation_source_hash: 868481b9f7482e936d6c7013557c7ff5334c7bb93fabf74d6eb726e526fb4e43
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ishlab chiqarish va o'lchovlar {#performance-and-metrics}

Iroha Ish yuklamasiga, validator topologiyasiga, tarmoqga bog'liq
shartlari va konsensus sozlamalari. TPS Shuning uchun raqam faqat foydali
agar u belgilangan konfiguratsiyaga ega bo'lgan ma'lumotnoma bilan bog'langan bo'lsa.

Qobiliyatni rejalashtirish uchun ish samaradorligini operatsion konvert sifatida ko'rib chiqish:

- tarmoq so'ralgan tranzaksiya stavkalarini qabul qiladi
- maqsadli byudjet doirasida kechikish muddatini belgilash
- Transaksiya navbatlari cheklangan boʻlib qolmoqda
- konsensus ko'rinishning takrorlangan o'zgarishiga yoki tiklanish yo'nalishlariga bog'liq emas

Ushbu sahifadagi ma'lumotlardan foydalanib, dastur yuqori, o'rta yoki past bo'lganligini aniqlang
ma'lum nodlar soni, tarmoq kechikish darajasi va maqsad uchun ishlash holati
TPS.

## O'lchash kerak bo'lgan narsalar {#what-to-measure}

Operatorning yuzalari bilan boshlang Torii:

```bash
export TORII=http://127.0.0.1:8180

curl -s "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

Siz ham o'qish uchun ishlatiladigan modelni jamoatchilikka qarshi sinab ko'rishingiz mumkin Taira:

```bash
TAIRA=https://taira.sora.org

curl -fsS "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/status" \
  | jq '{healthy: .health.healthy, peers, samples_used, rtt_count: .rtt.count}'

curl -fsS "$TAIRA/metrics" \
  | grep -E '^(block_height|queue_size|sumeragi_tx_queue_depth|txs|view_changes)' \
  | head -n 20
```

Umumiy Taira signallarning nomlarini o'rganish uchun metrikalar foydali. Ulardan foydalanmang
o'zingizning ishga tushirishingiz uchun ishlab chiqarish quvvati raqamlari sifatida.

Oʻsha bir xil konsensus fotosuratlari CLI:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

Telemetriya ko'rinishi konfiguratsiya qilingan profilga bog'liq. `extended` qachon siz
ehtiyoj `/metrics`, va foydalanish `full` sinov jarayonida, shuningdek batafsil
Sumeragi operator yo'nalishlari.

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## Ishlab chiqarish bandlari {#performance-bands}

Ushbu bandlardan maqsadli o ' lchashda kuzatilgan harakatlanish uchun foydalaning `Y` TPS va kechikish
byudjet `L` Milisekundlar. Ish yukini issiqlikni o'z ichiga oladigan darajada davom ettiring,
barqaror holatda va kamida bir muddat kutilayotgan maksimal yuklanish.

| Band | Shartlar | Ma'nosi |
| --- | --- | --- |
| Yuqori | Qabul qilingan o'tish hajmi `Y`, p95 qo'shish latenciyasi past `0.8 * L`, navbatlar quvvatning 10% dan kam bo'lib qolmoqda va ko'rinishni o'zgartirish / tiklash hisoblagichlari tekis | Oʻrnatilgan joyda talab qilingan ish yukini oʻz ichiga oladi . |
| Oʻrtacha | Qabul qilingan o ' tkazish hajmi `Y`, p95 qo'shish latenciyasi past `L`, navbatlar quvvatning 50% dan pastda barqaror va ko'rinish o'zgarishlari kam uchraydi | O'rnatish ishlaydi, lekin portlash tolerantligi cheklangan. |
| past | Qabul qilingan uzatish darajasi past `Y`, p95 qo'shish kechiktiruv muddati o'tadi `L`, uchish paytida navbatlar ko'payadi yoki ko'rinish o'zgarishi / orqa bosim hisoblagichlari doimiy ravishda oshadi | Talab qilingan ish yuklari kamida bir bottleneckdan oshadi |

Kerakli qoida navbat yo'nalishidir. TPS majburiyatdan kattaroq TPS
va navbat o'sishda davom etadi, ishga tushirilish hatto qisqa namunalar bo'lsa ham ortiqcha
sog'lom ko'rinish.

## Nukllar soni va quorum {#node-count-and-quorum}

Ko'proq tasdiqlovchilar xato tolerantligini yaxshilaydi, ammo muvofiqlashtirishni, imzolashni oshiradi.
va tarmoqni yaratish xarajatlari. Sumeragi amalga oshirish:

- tasdiqlovchilar soni `n` xato budjetini keltirib chiqaradi `f = floor((n - 1) / 3)`
- uchun `n >= 4`, qo ' mita quorum `2f + 1`
- uchun `n <= 3`, majburiyat uchun barcha tasdiqlovchilar talab qilinadi
- kuzatuvchi tengdoshlar sinxron bloklarni, lekin ovoz bermaydi, taklif yoki yig'ish

| To'g'rilash vositalari | Yomon budjet | Qo'shma quorum | Qobiliyat notasi |
| --- | --- | --- | --- |
| 1 dan 3 gacha | 0 amaliy oflayn slack | barcha validatorlar | Ishlab chiqarish va kichik sinovlar uchun foydali; yo'q bo'lgan har qanday validator majburiyatlarni to'xtatishi mumkin |
| 4 | 1 | 3 | Bir xatoga chidamlilik uchun umumiy minimal |
| 7 | 2 | 5 | Kuchliroq, ko'proq ovoz berish va targ'ibot harakatlari bilan |
| 10 | 3 | 7 | Ko'paytirish xarajatlari ko'proq; tarmoq va kollektorni moslashtirish muhimroq |

"X nodlarini" baholashda ovoz berish tasdiqlovchilarni kuzatuvchilardan ajratib qo'yish.
kuzatuvchilar odatda validatorlarni qo'shishdan kamroq xarajat qiladilar, ammo kuzatuvchilar hali ham iste'mol qilishadi
G'iybatlarni bloklash, sinxronlashtirishni bloklash, disk va tarmoq bandwidti.

## Ish ko'rsatishga ta'sir qiladigan omillar {#factors-that-influence-performance}

### Ish yukining shakli {#workload-shape}

Xuddi shunday TPS har bir muomalaga qarab arzon yoki qimmat bo'lishi mumkin.
Yozuv:

- har bir muomalaga ko'rsatmalar soni
- imzolar soni va imzo algoritmlari
- Transaksiya byti o'lchami va kompressiya qilingan foydali yuk miqdori
- O'qish va yozish nisbati
- Metadotlar hajmi va aktiv operatsiyalari
- aqlli kontrakt, qo'zg'atuvchi va IVM ijro xarajatlari
- bir xil tengdoshlarga qarshi ishlaydigan soʻrov yuklanishi

Kichik transfer operatsiyalari kontraktlar va metadatalarga to'g'ri keladi
ish yuklari.

### Konsensus vaqti {#consensus-timing}

Sumeragi vaqt ta'minlanishi samarali Sumeragi parametrlari:

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- NPoS rejimi qo'llanilganda NPoS fazasi vaqtlari

Ularni quyidagilar bilan tekshirish:

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

Vaqtni kamaytirish maqsadlari faqat tarmoq, saqlash va
bajarilishi qatlamlari kuzatib borishi mumkin. O'zgarishlarni ko'rishdan so'ng, yo'q bo'lgan yukni olish yoki
bosim paydo bo'ladi, vaqtni pasaytirish odatda ishlashni yomonlashtiradi.

### Toʻplamchi Fanout {#collector-fanout}

Kolektor oʻrnatishlari ovozlarning qanchalik tez yigʻilishiga taʼsir qiladi:

- `sumeragi.collectors.k` balandlikka ko'ra ovozlarni yig'uvchilarning soni nazorat qilinadi
- `sumeragi.collectors.redundant_send_r` qo'shimcha ovoz berish bo'yicha nazorat
  mahalliy vaqt ajratish
- `sumeragi.collectors.parallel_topology_fanout` topologiyani qo'shadi
  to'plamchilar

Katta yoki kamroq ishonchli tarmoqlarda tortib olishning tezligi kamayishi mumkin.
bu ham trafikni oshiradi.
Ushbu qiymatlarni o'zgartirishdan oldin latensiya va qarshi bosim ma'lumotlari bilan telemetriya:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### Tarmoq shartlari {#network-conditions}

Konsensus natijalari quyidagilarga mos keladi:

- RTT tasdiqlovchilar o'rtasida
- g'alati va paket yo'qotish
- blokdagi foydali yuklar uchun bandwidth va RBC qismlar
- mintaqalar o'rtasidagi asimetrik aloqalar
- NAT, Firewall yoki tengdoshlar aloqasini kechiktiradigan relay xatti-harakati

Rejalash qoidasi sifatida, bir nechta
Validatorning qayta-qayta safarlari, ijro va diskni qo'llab-quvvatlash vaqti. RTT bo ' lmoqda
ko'rsatkichlar o'rnatilganda, maqsad real emas.

### Tartiblar va kirish cheklovlari {#queues-and-admission-limits}

Kiritish va navbat sozlamalari tengdoshlari qancha portlash bosimini oʻzlashtirishi mumkinligini belgilaydi:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- maximal imzolar, yo'l-yo'riqlar, baytlar va
  siqilgan bytlar
- p2p navbat cheklovlari va konsensus kirish cheklovlari

Yuqori navbat quvvati bir muncha vaqt davomida ortiqcha yukni yashira oladi, ammo u ko'paymaydi
Barqaror navbat sog'lomdir; o'sib borayotgan navbat orqaga tushadi.

### Dasturiy asbob-uskuna va saqlash {#hardware-and-storage}

Faqat rahbarni emas, har bir tasdiqlovchini o'lchash:

- CPU tasdiqlash, imzolarni tekshirish va ijro etish paytida to'ylash
- navbatlar, sur'atlar va faollardan olingan xotira bosimi RBC yig'ilishlar
- bloklarni saqlash va fotosuratlar uchun disk yozish latensi
- tarmoqning uzatish/olishi to'ldirilishi
- Ish yukini ishlatishda texnik jadvalning tezlashtirish parametrlari

Eng sekin ovoz berish tasdiqlovchisi tarmoqning quyruq kechiktirilishini aniqlashi mumkin.

## Prometeus belgilari {#prometheus-signals}

Metrik nomlari profil va xususiyatlar to'plamidan kelib chiqib farq qilishi mumkin. `/metrics` to ' g'risida
avval nodingizni, so'ngra mavjud seriyalar atrofida dashboardlar quring.

Oddiy signallarga quyidagilar kiradi:

| Signal | Prometheusning misollari | Nima ko'rish kerak |
| --- | --- | --- |
| Qabul qilingan uzatish | `sum(rate(txs{type="accepted"}[5m]))` | Maqsadga erishishi yoki undan oshishi kerak TPS barqaror holatda |
| Quvilish | `sum(rate(txs{type="rejected"}[5m]))` | Sinov rejasi bilan tushuntirilishi kerak |
| Kechiktirishni amalga oshirish | `histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` | P95/p99 ni latency byudjeti bilan taqqoslang |
| Chegara chuqurligi | `queue_size`, `sumeragi_tx_queue_depth` | Yuqori yuklanish paytida cheklangan joyda qolish kerak |
| Qatlamning toʻldirilishi | `sumeragi_tx_queue_saturated` | Qo'llab-quvvatlanadigan nol bo'lmagan o'rtacha yuklanish qiymati |
| Oʻzgarishlarni koʻrish | `view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` | O'sib borayotgan qiymatlar vaqtni, topologiyani, foydali yukni yoki tarmoq muammolarini ko'rsatadi |
| Yozib tashlangan xabarlar | `dropped_messages`, `sumeragi_consensus_message_handling_total` | Yuklanish paytida tushish odatda kechiktirish darajasini oshirib beradi |
| RBC bosim | `sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` | Faydalangan yukni qayta tiklash yoki saqlash uchun noldan tashqari bosim nuqtalari |
| Qo'shma quorum | `sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` | Hisoblangan imzolar zarur quorumga tezda yetishi kerak |

Agar metrika faqat `/v1/sumeragi/status`, toʻgʻrilash JSON koʻrsatkich
Prometheus maydonchasining o'sha-o'sha artefaktlari.

## Taxminiy ish oqimi {#estimation-workflow}

1. Ssenariyni aniqlang:
   - tasdiqlovchilar soni va kuzatuvchilar soni
   - konsensus usuli
   - maqsad TPS
   - p95 va p99 majburiyatlarni amalga oshirish bo'yicha budjetlar
   - Transaksiyalar aralashmasi
   - kutilayotgan tarmoq RTT, jitter va bandwidth
2. Ta'sirchan konfiguratsiyani yozib oling:

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. Ish yukini maqsadga yoʻnaltiring TPS.
4. Urug'ning boshida, o'rta va oxirida holat va ma'lumotlarni olish.
5. Ishni ishlash bandlari jadvali bilan tasniflash.
6. Agar band o'rta yoki past bo'lsa, bir vaqtning o'zida bitta omilni o'zgartiring va takrorlang.

## Koʻrsatkichlar toʻgʻrisidagi hisobotvorasi {#benchmark-report-template}

Ishlab chiqarish raqamlarini faqat ularni takrorlash uchun etarli kontekst bilan nashr etish:

- Iroha qo'shish, chiqarish va xususiyat bayroqlari
- tasdiqlovchi va kuzatuvchining soni
- konsensus usuli va Sumeragi parametrlar
- to'plamchi `k`, ortiqcha jo'natish `r`, va topologiyadan tashqari
- telemetriya profili
- asbob-uskunalar, saqlash va OS tafsilotlari
- tarmoq RTT, Jitter, yo'qotish va lentlar kengligi taxminlari
- Transaksiyalar aralashmasi va foydali yuk miqdori
- taklif qilingan TPS va yurish muddati
- qabul qilingan/tashkil etilgan TPS
- p50/p95/p99 qo'yilgan vaqtning kechiktirilishi
- navbatning chuqurligi va to'ldirilishi
- o'zgarishlarni ko'rish, yo'qolgan xabarlar; RBC bosim va yo'q bo'lgan yukni hisobga olish
- CPU, Xotira, disk va tarmoqdan foydalanuvchi

Ushbu tafsilotlarsiz, TPS raqam anekdot sifatida ko'rib chiqilishi kerak.

## Bogʻliq sahifalar {#related-pages}

- [Izanami bilan xaroba sinovlari](./chaos-testing.md)
- [Torii oxirgi nuqtalar](../../reference/torii-endpoints.md)
- [Operatsiya qilish Iroha 3 orqali CLI](../../get-started/operate-iroha-via-cli.md)
- [Tengdoshlar konfiguratsiyasi ma'lumotnomasi](../../reference/peer-config/params.md)
