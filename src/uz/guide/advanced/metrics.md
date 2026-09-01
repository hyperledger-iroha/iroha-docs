---
translation_locale: uz
translation_source: /guide/advanced/metrics.md
translation_source_hash: fc62efbb6100308bb7a929e18c9c8b6860372abd6d0009616ea63d7c77b6b1eb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ijro etish va o‘lchovlar {#performance-and-metrics}

Iroha unumdorligi ish yukiga, tasdiqlovchilar topologiyasiga, tarmoq sharoitlari va konsensus sozlamalariga bog‘liq. Shu sabab bir TPS raqami faqat ma’lum konfiguratsiyadagi mezon sinovi bilan birga berilganda foydali.

Sig‘imni rejalashtirish uchun, ish faoliyatini operatsion ma'lumot konteyneri sifatida ko‘ring:

- tarmoq so‘ralgan tranzaksiya tezligini qabul qiladi
- protokolni yakunlash kechikishi maqsad qilingan byudjet ichida qoladi
- tranzaksiya navlari cheklangan holda qoladi
- konsensus takroriy ko‘rinish o‘zgarishlari yoki tiklanish yo‘llariga tayanmaydi

Ushbu sahifadan foydalanib, berilgan tugun soni, tarmoq kechikish chegarasi va maqsad TPS uchun tarqatish yuqori, o‘rta yoki past ishlash holatida ekanligini baholashingiz mumkin.

## Nimani o'lchash {#what-to-measure}

Jamoat tugunining nuqtai nazari vaqt ma'lumotlari ko'rinishidan va Prometheus skreplashidan boshlang, so'ng operatordan autentifikatsiyalangan konsensus holati uchun CLI dan foydalaning. Operator kaliti maqsad tugun tomonidan ruxsat berilishi kerak va faqat dasturiy ta'minot ishga tushirish muhitida yuklanadi:

```bash
export TORII=http://127.0.0.1:8180
export OPERATOR_KEY_FILE=./secrets/operator.key

curl -s -H 'Accept: application/json' "$TORII/status" | jq .
curl -s "$TORII/metrics" > metrics.prom

iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi status
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi qc
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

Jamoat Taira anonim tugun snapshots shaklini o‘rganishda foydalidir. Uning operator diagnostikasi Taira operator kalitisiz ataylab mavjud emas:

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/now" \
  | jq '{now_ms, offset_ms}'
```

Ommaviy testnet kuzatuvlarini o'z joylashtirishingiz uchun ishlab chiqarish quvvati raqamlari sifatida ishlatmang.

Telemetriya ko‘rinishi sozlangan profilga bog‘liq. `operator` holat va diagnostika snapshot’larini yoqadi. `extended` esa `/metrics` va qimmatga tushadigan o‘lchovlarni qo‘shadi, bir vaqtlar `developer` lider, QC, parametrlar va dalillar kabi ishlab chiquvchi vaqt nuqtasi ma’lumot ko‘rinishlarini qo‘shadi, lekin `/metrics` ni yoqmaydi. Bir ishlov berishda ikkala to‘plam kerak bo‘lganda `full` dan foydalaning. `telemetry_profile` yagona birinchi chiqarilgan telemetriya kalitidir.

```toml
telemetry_profile = "full"
```

## Ishlash Guruhlari {#performance-bands}

Ushbu tasmalardan maqsadli uzatish tezligi `Y` TPS va kechikish byudjeti `L` millisekundlarda kuzatiladigan ishni bajarish uchun foydalaning. Ish yukini yetarlicha uzoq davom ettiring, shunda qizdirish, barqaror holat va kutilayotgan maksimal yuk davrining kamida bitta davri o'z ichiga olsin.

|Band|Shartlar|Ma'no|
| --- | --- | --- |
|Baland|Qabul qilingan o'tkazuvchanlik `Y` darajasida yoki undan yuqorida, p95 protokolni yakunlash kechikishi `0.8 * L` darajasidan past, navbatlar sig‘imning 10% dan pastda, va ko‘rinish-o‘zgartirish/qayta tiklash hisoblagichlari bir tekis|Joylashtirish so'ralgan ish yukini qabul qilish imkoniyatiga ega|
|Oʻrta|Qabul qilingan o‘tkazish qobiliyati `Y` ga yaqin, p95 protokol yakunlanish kechikishi `L` dan past, navbatlar sig‘imning 50% dan pastida barqaror, va ko‘rinish o‘zgarishlari kam uchraydi|Joylashtirish ishlaydi, lekin cheklangan portlash chidamliligi mavjud|
|Past|Qabul qilingan o'tkazish quvvati `Y`dan past, p95 protokol yakunlash kechikishi `L`dan oshadi, navbatlar ish davomida o'sadi yoki ko'rinish-o'zgarishi/ortiqcha bosim hisoblagichlari doimiy ravishda oshadi|So‘ralgan ish yuklamasi hech bo‘lmaganda bitta tıg‘iz nuqtadan oshib ketadi|

Asosiy qoida - navbat yo'nalishi. Agar yuborilgan TPS yakunlangan TPS dan katta bo'lsa va navbat o'sishda davom etsa, qisqa namunalar sog'lom ko'rinsa ham, joylashtirish ortiqcha yuklangan bo'ladi.

## Tugunlar soni va kvorum {#node-count-and-quorum}

Ko‘proq tasdiqlovchilar nosozliklarga chidamliligini oshiradi, lekin muvofiqlashtirish, imzo va tarmoq taqsimoti xarajatlarini oshiradi. Birinchi chiqarilgan Sumeragi protokoli quyidagilarni talab qiladi:

- aniq `n = 3f + 1` saylov qo‘mitasi
- `4 <= n <= 31`, shuning uchun yaroqli o'lchamlar 4, 7, 10 va hokazo
- `2f + 1` konsensus yakunlash kuorumi
- kuzatuvchi tarmoq tengdoshlar bloklarni sinxronlaydi, lekin ovoz bermaydi, taklif qilmaydi yoki yig‘maydi

|Tekshiruvchilar|Xato byudjeti|konsensus yakunlanishi uchun kvorum|Sig‘im eslatmasi|
| --- | --- | --- | --- |
| 4 | 1 | 3 |Bir xatoga chidamlilik uchun umumiy minimum|
| 7 | 2 | 5 |Ko‘proq bardoshli, ko‘proq ovoz va tarqatish trafigi bilan|
| 10 | 3 | 7 |Yuqariroq muvofiqlashtirish xarajati; tarmoq va kirish sozlamalari ko‘proq muhim|
| 31 | 10 | 21 |Maksimal birinchi chiqarish qo‘mitasi; mezonlarni muvofiqlashtirish va imzo xarajatlarini diqqat bilan|

blokcheyn genesi avlod va ishga tushirish tekshiruvi mos kelmaydigan qo'mita o'lchamlarini rad etadi; chiqarilishi qabul qila olmaydigan topologiyani o'lchamang.

“X tugunlarini” baholashda, ovoz beruvchi validatorlarni kuzatuvchilardan ajrating. Kuzatuvchilarni qo‘shish odatda validatorlarni qo‘shishdan kamroq xarajatlidir, lekin kuzatuvchilar hali ham bloklar gossipi, bloklar sinxronizatsiyasi, disk va tarmoq kengligi iste'mol qiladi.

## Ish faoliyatiga ta'sir qiluvchi omillar {#factors-that-influence-performance}

### Ish hajmi shakli {#workload-shape}

Bir xil TPS har bir tranzaksiya nima qilayotganiga qarab arzon yoki qimmat bo‘lishi mumkin. Qayd:

- har bir tranzaksiya uchun ko'rsatmalar soni
- imzo soni va imzolash algoritmlari
- tranzaksiya bayt o‘lchami va siqilmagan yuk hajmi
- o‘qish/yazish nisbati
- metama'lumot hajmi va aktiv operatsiyalari
- aqlli shartnoma, trig‘er, va IVM ijro xarajatlari
- so‘rov yuklamasi bir xil tarmoq hamkasblari qarshi ishlamoqda

Kichik pul o'tkazmalari shartnoma-ko'p yoki metadata-ko'p ish yuklamalarining vakili emas.

### Konsensus Kadansi {#consensus-cadence}

Samarali Sumeragi parametr vaqt nuqtasidagi maʼlumotlar ko‘rinishi imzolangan o‘zgarmas blok kadensiyasi va soat siljishi chegarasini o‘z ichiga oladi:

- `block_cadence_ms`
- `max_clock_drift_ms`

Ularni quyidagilar bilan tekshiring:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

`block_cadence_ms` imzolangan blokcheyn genesis orqali tuzatilgan va ishga tushirilganda muzlatiladi; bu jonli sozlash tugmasi emas. Turli imzolangan blokcheyn genesis kirishlari bilan tarmoqlarni faqat alohida benchmark ssenariylari sifatida solishtiring. Biror ko‘rinishdagi o‘zgarishlar, yetishmayotgan yukni olish yoki ortiqcha bosim paydo bo‘lganda, qisqaroq takt odatda barqaror o'tkazuvchanlikni oshirishdan ko‘ra haddan tashqari yukni ko‘proq ko‘rsatadi.

### Nomzod va Kirish Chegaralari {#candidate-and-ingress-bounds}

Tugundagi Sumeragi chegaralari tasdiqlovchi qancha nomzod va tiklash ishini saqlay olishini belgilaydi:

- `sumeragi.block.max_transactions`
- `sumeragi.block.max_payload_bytes`
- `sumeragi.block.proposal_queue_scan_multiplier`
- `sumeragi.queues.commands`
- `sumeragi.queues.bodies` va `sumeragi.queues.body_bytes`
- `sumeragi.queues.body_source_bytes`, `sumeragi.queues.chunks`, va `sumeragi.queues.ready_bodies`

Juda kichik chegaralar navbat yoki foydali yukni tiklash bosimini keltiradi; haddan tashqari katta chegaralar esa saqlanadigan xotira va yovuz tugun foydalanishi mumkin bo‘lgan ish hajmini oshiradi. Bir chegarani o‘zgartirishdan oldin diagnostika oniy nusxasini jarayon xotirasi, xabarlarni qayta ishlash va yo‘q tana metrikalari bilan solishtiring:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
```

### Tarmoq Shartlari {#network-conditions}

Konsensus ishlashi quyidagilarga sezgir:

- RTT validatorlar orasida
- tebranish va paket yo‘qolishi
- blokk yuklamalari va imzolangan RS16 bo‘laklar uchun tarmoqli kengligi
- mintaqalar orasidagi asimmetrik bog'lanishlar
- NAT, tarmoq sheriklari ulanishini kechiktiradigan firewall yoki ulash xatti-harakati

Rejalashda kechikish byudjetini bir necha tasdiqlovchi qatnovi, bajarish va diskka yozish vaqtini qoplaydigan darajada belgilang. p95 tarmoq RTT allaqachon istalgan p95 yakunlash kechikishiga yaqin bo‘lsa, maqsad amaliy emas.

### Navbatlar va kirish cheklovlari {#queues-and-admission-limits}

Qabul qilish va navbat sozlamalari tarmoq hamkasbi qancha portlash bosimini yutishi mumkinligini belgilaydi:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.max_retained_bytes`
- `queue.transaction_time_to_live_ms`
- blockchain boshlang‘ich tranzaksiya cheklovlari, masalan, maksimal imzolar, ko‘rsatmalar, baytlar va siqilmagan baytlar
- p2p navbati chegaralari va konsensus kirish cheklovlari

Yuoqri navbat sig‘imi ortiqcha yukni biroz vaqt yashirishi mumkin, lekin u barqaror o‘tish quvvatini oshirmaydi. Barqaror navbat sog‘lom; o‘sib borayotgan navbat esa orqaga qolishdir.

### Uskuna va Saqlash {#hardware-and-storage}

Faqat rahbarni emas, har bir validatordni o'lchang:

- CPU tekshirish, imzo tasdiqlash va bajarish vaqtida to‘yinganlik
- navbatlardan keladigan xotira bosimi, vaqt nuqtasidagi maʼlumotlarni koʻrish va yukni tiklash tamponlari
- blokli saqlash va vaqt nuqtasi bo‘yicha ma’lumotlarni ko‘rish uchun disk yozish kechikishi
- tarmoq uzatish/qabul qilish to‘yinish
- ish yuklamasi tomonidan ishlatilganda ixtiyoriy apparat tezlatish sozlamalari

Eng sekin ovoz beruvchi tekshiruvchi tarmoqning oxirgi kechikishini belgilashi mumkin.

## Prometey Signallari {#prometheus-signals}

Metriya nomlari tekshirilgan telemetriya katalogidan keladi. Seriyalar mavjudligi va namunalarni olish hali ham qurilish xususiyatlari va `telemetry_profile` ga bog‘liq, shuning uchun dashboard qurishdan oldin maqsad tugunida `/metrics` ni tekshiring.

Eng keng tarqalgan signalar quyidagilarni o'z ichiga oladi:

|Signal|Prometey misollari|Nimani tomosha qilish|
| --- | --- | --- |
|Qabul qilingan o'tkazuvchanlik| `sum(rate(txs{type="accepted"}[5m]))` |Barqaror holatda maqsad TPS ga yetishi yoki oshishi kerak|
|Rad etishlar| `sum(rate(txs{type="rejected"}[5m]))` |Test rejasi bilan tushuntirilishi kerak|
|protokolni yakunlash kechikishi| `histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |p95/p99 ni kechikish byudjeti bilan solishtiring|
|Navbat chuqurligi| `queue_size`, `sumeragi_tx_queue_depth` |Eng yuqori yuklama paytida chegaralangan bo‘lishi kerak|
|Navbat to‘lishi| `sumeragi_tx_queue_saturated` |Uzluksiz noldan farqli qiymatlar ortiqcha yuklamani anglatadi|
|Oʻzgarishlarni koʻrish| `view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` |O‘sib borayotgan qiymatlar vaqti, topologiyasi, yuklamasi yoki tarmoq muammosini ko‘rsatadi|
|Tushirilgan xabarlar| `dropped_messages`, `sumeragi_consensus_message_handling_total` |Yuk yuklash paytida tushishlar odatda kechikish cho'qqilarini tushuntiradi|
|Yuk va DA tiklash| `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total`, `sumeragi_da_gate_satisfied_total` |Doimiy talablar, yoshning oshishi yoki takroriy DA eshiklar tanani yoki bo'lakni olish bilan bog'liq muammolarni ko'rsatadi|
|konsensus yakunlanishi kvorumi| `sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |Sanalgan imzolar kerakli kvorumga tezda yetishi kerak|

Agar metrik faqat `/v1/sumeragi/status` da mavjud bo'lsa, JSON vaqt nuqtasi ma'lumotlar ko'rinishini Prometheus skrepi bilan bir xil ishlash artefaktlarida saqlang.

## Baholash Ish Jarayoni {#estimation-workflow}

1. Vaziyatni aniqlang:
   - validatorlar soni va kuzatuvchilar soni
   - kelishuv rejimi
   - maqsad TPS
   - p95 va p99 protokolini yakunlash-kechikish byudjetlari
   - tranzaksiya aralashmasi
   - kutilayotgan tarmoq RTT, tebranish va kenglik
2. Samarali konfiguratsiyani yozib oling:

   ```bash
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi status \
     > artifacts/sumeragi-status.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi diagnostics \
     > artifacts/sumeragi-diagnostics.json
   ```

3. Ish yukini maqsadli TPS da ishga tushiring.
4. Ishga kirishish, o'rtasi va tugashida holat va metrikalarni qayd eting.
5. Ishlash diapazonlari jadvali bilan yugurishni tasniflang.
6. Agar guruh Oʻrta yoki Past boʻlsa, har safar bir omilni oʻzgartiring va takrorlang.

## Benchmark Hisobot Shabloni {#benchmark-report-template}

Ishlash ko‘rsatkichlarini faqat ularni qayta tiklash uchun yetarli kontekst bilan e’lon qiling:

- Iroha protokolni yakunlash, chiqarish va funksiyalar bayroqlari
- tasdiqlovchi va kuzatuvchi sonlari
- konsensus rejimi, imzolangan blok kadenasi va DA tartibi
- aniq `3f + 1` qo‘mita, kvorum va kuzatuvchi ro‘yxati
- `sumeragi.block`, `sumeragi.queues`, `sumeragi.limits`, tarmoq-kirish, va tranzaksiya-navbati chegaralari
- telemetriya profili
- apparat ta'minoti, saqlash va OS tafsilotlari
- tarmoq RTT, tebranish, yo‘qotish va keng polosali taxminlar
- tranzaksiya aralashmasi va yuk hajmlari
- taklif qilindi TPS va ishlash davomiyligi
- qabul qilingan/rad etilgan TPS
- p50/p95/p99 protokolni yakunlash kechikishi
- navbat chuqurligi va to'yinganlik
- o‘zgarishlarni ko‘rish, tushib qolgan xabarlar, yetishmayotgan bloklarni olish va DA-shlyuz hisoblagichlari
- har bir tasdiqlovchi bo‘yicha CPU, xotira, disk va tarmoqdan foydalanish

Bu tafsilotlarsiz, TPS raqami hikoya sifatida qabul qilinishi kerak.

## Tegishli sahifalar {#related-pages}

- [Izanami bilan Chaqiriq Sinovi](./chaos-testing.md)
- [Torii API oxir nuqtalar](../../reference/torii-endpoints.md)
- [Iroha 3 ni CLI orqali boshqaring](../../get-started/operate-iroha-via-cli.md)
- [tarmoq tengdosh konfiguratsiyasi ma'lumotnomasi](../../reference/peer-config/params.md)
