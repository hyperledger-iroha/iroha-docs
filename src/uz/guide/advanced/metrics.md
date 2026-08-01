---
translation_locale: uz
translation_source: /guide/advanced/metrics.md
translation_source_hash: 5772bf7175b693fbbed54b59304859a33c2e19fef0c402141b6f4ad4cfd6714f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ishlab chiqarish va metrikalar {#performance-and-metrics}

Iroha Ish yukuni, validator topologiyasi, tarmoq sharoitlari va konsensus sozlamalariga bog'liq bo'ladi. TPS Shuning uchun raqam faqat o'rnatilgan konfiguratsiyaga ega bo'lgan referent ko'rsatkichlari bilan bog'liq bo'lsa, foydalidir.

Qobiliyatni rejalashtirish uchun ish samaradorligini operatsion konvert sifatida ko'rib chiqish:

- tarmoq so'ralgan tranzaksiya stavkalarini qabul qiladi
- maqsadli byudjet doirasida kechikish vaqtini belgilash
- Transaksiya navbatlari cheklangan bo'lib qoladi
- konsensus ko'rinishning takrorlangan o'zgarishiga yoki tiklanish yo'llariga bog'liq emas.

Ushbu sahifani qo'llash ma'lum nodlar soni, tarmoq kechikish darajasi va maqsad TPS uchun ishga tushirish yuqori, o'rta yoki past ishlash holatida bo'lganligini baholash uchun ishlating. .

## O'lchash uchun nimalar kerak {#what-to-measure}

Torii tomonidan aniqlangan operator yuzalari bilan boshlang:

```bash
export TORII=http://127.0.0.1:8180

curl -s -H 'Accept: application/json' "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

Siz faqat o'qish uslubini ommaviy Taira bilan sinab ko'rishingiz mumkin:

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/status" \
  | jq '{healthy: .health.healthy, peers, samples_used, rtt_count: .rtt.count}'

curl -fsS "$TAIRA/metrics" \
  | grep -E '^(block_height|queue_size|sumeragi_tx_queue_depth|txs|view_changes)' \
  | head -n 20
```

Signallarning nomlarini o'rganish uchun ommaviy Taira metrikalari foydali. Ulardan o'zingizning ishga tushirishingiz uchun ishlab chiqarish quvvati raqamlari sifatida foydalanmang.

CLI orqali ham xuddi shunday konsensus fotosuratlari mavjud:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

Telemetriya ko'rinishi konfiguratsiya qilingan profilga bog'liq. `/metrics` kerak bo'lganda `extended` dan foydalaning, shuningdek, batafsil operator yo'nalishlari Sumeragi zarur bo'lganida sinovlarda `full`dan foydalaning.

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## Ishlab chiqarish bandlari {#performance-bands}

Ushbu bandlardan maqsadli o'tkazib yuborishda `Y` TPS va kechikish budjeti `L` milisekundlarda kuzatilgan ish uchun foydalaning. Ish yukini issiqlikni, barqaror holatni va hech bo'lmaganda bir davrda kutilayotgan maksimal yukni o'z ichiga olishi uchun etarlicha uzoq vaqt davomida yuriting.

|Band |Sharoitlar |Maʼnosi |
| --- | --- | --- |
|Yuqori .|Qabul qilingan o'tish hajmi `Y` yoki undan yuqori bo'lsa, p95 commit latency `0.8 * L` dan past bo'ladi, navbatlar quvvatning 10% dan kam bo'lib qoladi va ko'rinishni o'zgartirish / tiklash hisoblagichlari tekis hisoblanadi |Xizmatda talab qilingan ish yukini oʻtkazish uchun joy bor |
|O ' rtacha |Qabul qilingan o'tkazib berish hajmi `Y` ga yaqin, p95 qo'shish kechikishi `L` dan past, navbatlar quvvatning 50% dan past bo'ladi va ko'rinishda o'zgarishlar kam uchraydi. |O'rnatish ishlaydi, lekin portlash tolerantligi cheklangan |
|Kam |Qabul qilingan o'tish hajmi `Y` dan past, p95 commit latency `L` dan oshadi, harakat davomida navbatlar ko'payadi yoki ko'rinishni o'zgartirish / orqa bosim hisoblagichlari doimiy ravishda ko'paydi |Talab qilingan ish yuklari kamida bir bottleneckdan oshadi |

Kerakli qoida navbat yo'nalishidir. Agar taqdim etilgan TPS belgilangan TPS dan kattaroq bo'lsa va navbat o'sishda davom etsa, qisqa namunalar sog'lom ko'rinsa ham, joylashtirish ortiqcha yuklangan bo'ladi.

## Nodular soni va quorum {#node-count-and-quorum}

Ko'proq validatorlar xato toleransini yaxshilaydi, ammo koordinatsiya, imzo va tarmoqni yaratish xarajatlarini oshiradi. Sumeragi amalga oshirish:

- validatorning soni `n` xato budjeti `f = floor((n - 1) / 3)` ni keltirib chiqaradi.
- `n >= 4` uchun qo'shimcha quorum `2f + 1` hisoblanadi.
- `n <= 3` uchun barcha validatorlar majburiyatni bajarish uchun talab qilinadi.
- kuzatuvchi tengdoshlari sinxronizatsiya bloklari, lekin ovoz bermaydilar, taklif yoki yig'ish

|Tasdiqlovchilar |Budjetda xato |Quorumni belgilash |Qobiliyat notasi |
| --- | --- | --- | --- |
|1 dan 3 gacha |0 amaliy offline slack |barcha validatorlar |Ishlab chiqarish va kichik sinovlar uchun foydali; har qanday yo'qolgan tasdiqlovchi majburiyatlarni to'xtatishi mumkin |
| 4 | 1 | 3 |Bir xatoga chidamlilik uchun umumiy minimal |
| 7 | 2 | 5 |Kuchliroq, ko'proq ovoz berish va targ'ibot trafiklari bilan |
| 10 | 3 | 7 |Koʻpaytirish xarajatlari koʻproq; tarmoq va toʻplamni moslashtirish muhimdir |

"X nodlarini" baholashda ovoz berish validatorlarini kuzatuvchilardan ajratib qo'ying. kuzatuvchilarni qo'shish odatda validatorlar qo'shishdan kamroq xarajat qiladi, ammo kuzatuvchilar hali ham blok g'azabini, blok sinxronizatsiyasini, diskni va tarmoq mintaqa kengligini iste'mol qiladilar.

## Ish ko'rsatkichlariga ta'sir qiladigan omillar {#factors-that-influence-performance}

### Ish yukining shakli {#workload-shape}

Bir xil TPS har bir muomala nimaga bog'liq bo'lishi mumkin arzon yoki qimmat.

- har bir tranzaksiya uchun ko'rsatmalar soni
- imzolar soni va imzolar algoritmlari
- Transaksiya byti o'lchami va kompressiya qilingan foydali yuk hajmi
- O'qish va yozish nisbati
- Metadata o'lchamlari va aktivlar faoliyati
- Aqlli shartnoma, qo'zg'atuvchi va IVM ijro xarajatlari
- bir xil tengdoshlarga qarshi ishlaydigan soʻrov yuklanishi

Kichik transfer operatsiyalari shartnomaviy yoki metadata bilan bog'liq bo'lgan ish yuklarining o'rniga emas.

### Konsensusning vaqti {#consensus-timing}

Sumeragi vaqtini Sumeragi amaldagi parametrlari boshqaradi:

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- NPoS rejimi qo'lga kiritilganda NPoS fazasi timeouts

Ularni quyidagilar bilan tekshirish:

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

Vaqtni kamaytirish maqsadlari faqat tarmoq, saqlash va ijro qatlamlari kuzatib borishi mumkin bo'lganda kechiktirishni yaxshilaydi. O'zgarishlarni ko'rishdan so'ng, yo'qolgan payloadni olish yoki qarshi bosim paydo bo'lsa, vaqtni kamaytirish odatda ishlashni yomonlashtiradi.

### To'plamchi Fanout {#collector-fanout}

Kolektor oʻrnatishlari ovozlarni qoʻllab-quvvatlashning tezligiga taʼsir qiladi:

- `sumeragi.collectors.k` balandlikka ko'ra ovozlarni yig'uvchilarning sonini nazorat qiladi
- `sumeragi.collectors.redundant_send_r` mahalliy vaqtdan keyin qo'shimcha ovoz berish uchun nazorat qiladi
- `sumeragi.collectors.parallel_topology_fanout` topologiyani to'plamlar bilan birga qo'shadi.

Fanoutni ko'paytirish katta yoki kamroq ishonchli tarmoqlarda quyruq kechiktirishni kamaytirishi mumkin, ammo bu ham trafikni oshiradi. Ushbu qiymatlarni o'zgartirishdan oldin yig'ilgan mavjudlik va kollektor telemetriyasini latency va backpressure metrikalari bilan taqqoslang:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### Tarmoqning shartlari {#network-conditions}

Konsensus natijalari quyidagilarga mos keladi:

- RTT validatorlar o'rtasida
- Jitter va paket yo'qotish
- blok yuklari va RBC bo'laklar uchun bandwidth
- hududlar o'rtasidagi asimetrik aloqalar
- NAT, tengdoshlar aloqasini kechiktiradigan firewall yoki relay xatti-harakati.

Rejalash qoidasi sifatida, latensiyaning budjetini bir nechta validatorning qayta-qayta safarlarini va ijro va disk qo'shish vaqtini qamrab olish uchun etarlicha yuqori qilib qo'ying. Agar p95 tarmog'i RTT allaqachon istagan p95 qo'shilish latensiga yaqin bo'lsa, maqsad real emas.

### Tartiblar va kirish cheklovlari {#queues-and-admission-limits}

Kiritish va navbat sozlamalari tengdoshlari qancha portlash bosimini oʻzlashtirishi mumkinligini belgilaydi:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- max. imzolar, yo'l-yo'riqlar, baytlar va siqilgan baytlar kabi genesis operatsiya cheklovlari
- p2p navbatlar cheklovlari va konsensus kirish cheklovlari

Yuqori navbat quvvati ortiqcha yukni bir muncha vaqt yashira oladi, ammo bu barqaror ishlab chiqarishni oshirmaydi. Barqaror navbat sog'lomdir; o'sib borayotgan navbat orqaga tushadi.

### Xardver va saqlash {#hardware-and-storage}

Faqat rahbarni emas, har bir tasdiqlovchini o'lchash:

- CPU tasdiqlash, imzolarni tekshirish va ijro etish paytida to'ldirilganligi
- navbatlar, fotosuratlar va faol RBC seanslardan olingan xotira bosimi
- bloklarni saqlash va fotosuratlar uchun disk yozish kechikishi
- tarmoqning uzatish / qabul qilish to'ldirilishi
- ish og'irligi tomonidan ishlatilayotganda texnik jadvalning tezlashtirish sozlamalari

Eng sekin ovoz berish tasdiqlovchisi tarmoqning quyruq uzlukini aniqlashi mumkin.

## Prometheus belgilari {#prometheus-signals}

Metrik nomlari profil va xususiyatlar to'plamidan kelib chiqib farq qilishi mumkin. Avval nodingizdagi `/metrics` ni tekshirib ko'ring, so'ngra mavjud seriyalar atrofida ish stolilarni quring.

Oddiy signallarga quyidagilar kiradi:

|Signal |Prometheusning misollari |Nima koʻrish kerak ?|
| --- | --- | --- |
|Qabul qilingan oʻsish hajmi |`sum(rate(txs{type="accepted"}[5m]))` |O ' rnatilgan holatda TPS maqsadga erishish yoki undan oshishi kerak |
|Quvilish |`sum(rate(txs{type="rejected"}[5m]))` |Sinov rejasi bilan tushuntirilishi kerak |
|Kechikish vaqtini belgilash |`histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |P95/p99-ni latency byudjeti bilan taqqoslang |
|Chegara chuqurligi |`queue_size`, `sumeragi_tx_queue_depth` |Yukning yuqori boʻlishi uchun cheklangan joyda qolish kerak .|
|Qatlamning toʻldirilishi |`sumeragi_tx_queue_saturated` |To ' xtatilgan nol bo ' lmagan qiymatning o ' rtacha ortiqcha yuklanishi |
|Oʻzgarishlarni koʻrish |`view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` |O'sib borayotgan qiymatlar vaqtni, topologiyani, foydali yukni yoki tarmoq muammolarini ko'rsatadi |
|Yoʻqolgan xabarlar |`dropped_messages`, `sumeragi_consensus_message_handling_total` |Yuklanish paytida tushish odatda kechiktirilganlik darajasini oshirib yuboradi .|
|RBC bosim |`sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` |Faydalangan yukni qayta tiklash yoki saqlash boʻshqoyi uchun noldan ortiq bosim nuqtalari |
|Quorumni belgilash |`sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |Hisoblangan imzolar talab qilingan quorumga tezda yetishi kerak .|

Agar metrika faqat `/v1/sumeragi/status` da mavjud bo'lsa, Prometheus scraping bilan bir xil o'tkazib yuborilgan artefaktlarda JSON rasmga ega bo'ling.

## Taxminiy ish oqimi {#estimation-workflow}

1. Ssenariyni aniqlang:
   - tasdiqlovchilar soni va kuzatuvchilar soni
   - konsensus usuli
   - maqsad TPS
   - p95 va p99 bandlik bilan bog'liq byudjetlar
   - operatsiyalar aralashmasi
   - kutilayotgan tarmoq RTT, jitter va lentli kenglik
2. Ta'sirchan konfiguratsiyani yozib oling:

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. Ish yukini maqsadga TPS qo'yish.
4. Urug'ning boshida, o'rta va oxirida holat va ma'lumotlarni yozib oling.
5. Ish ko'rsatkichlari jadvalini qo'llash bilan harakatni sinflashtiring.
6. Agar to'plam o'rta yoki past bo'lsa, bir vaqtning o'zida bitta omilni o'zgartiring va takrorlang.

## Benchmark hisobotlar namunalari {#benchmark-report-template}

Ishlab chiqarish raqamlarini faqat ularni takrorlash uchun etarlicha kontekst bilan nashr etish:

- Iroha qo'shish, chiqarish va xususiyat bayroqlari
- tasdiqlovchi va kuzatuvchining soni
- konsensus rejasi va Sumeragi parametrlari
- to'plam `k`, ortiqcha jo'natish `r` va topologiyadan tashqari
- telemetriya profili
- uskunalar, saqlash va OS ma'lumotlari
- tarmoq RTT, jitter, yo'qotish va lentlar kengligi taxminlari
- Transaksiya aralashmasi va foydali yuk hajmi
- taklif qilingan TPS va o'tkaziladigan muddat
- qabul qilingan/ rad etilgan TPS
- p50/p95/p99 qo'shma kechikish vaqti
- navbatning chuqurligi va to'ldirilishi
- ko'rish o'zgarishlari, tushirilgan xabarlar, RBC bosim va yo'q bo'lgan yukni hisobga oluvchi vositalar
- CPU, har bir sertifikatlovchi uchun xotira, disk va tarmoqdan foydalanish

Ushbu tafsilotlar mavjud bo'lmasa, TPS raqami anekdot sifatida ko'rib chiqilishi kerak.

## Bogʻliq sahifalar {#related-pages}

- [Izanami bilan xaos sinovlari](./chaos-testing.md)
- [Torii oxirgi nuqtalari](../../reference/torii-endpoints.md)
- [Iroha 3 orqali CLI](../../get-started/operate-iroha-via-cli.md) orqali harakatlaning
- [Tengdoshlar konfiguratsiyasi ma'lumotnomasi](../../reference/peer-config/params.md)
