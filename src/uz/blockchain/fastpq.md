---
translation_locale: uz
translation_source: /blockchain/fastpq.md
translation_source_hash: 98c258ab99bcc7d7d51b69ddd26e39b19ef4eb14d53001825f3737144d68f0e5
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ — tanlangan bajarish ta’sirlari uchun Iroha-ning STARK isbot yo‘li. U odatiy tranzaksiya bajarilishi yoki konsensusning o‘rnini bosmaydi. Tranzaksiyalar avvalgidek ISI, IVM va Sumeragi orqali bajariladi; FastPQ qo‘llab-quvvatlanadigan ta’sirlarni keyinroq, blok bajarilishi qayd etgan manba yozuvi asosida isbotlaydi.

Joriy mezbon integratsiyasida ikkita asosiy yo‘l bor:

- tugunning isbotlovchi yo‘lagi isbotlaydigan, yakunlangan bloklarning raqamli aktiv ta’sirlari;
- `fastpq_binding` qiymati FastPQ bog‘lanishini olib yuradigan SORA Nexus AXT isbot konvertlari

## O‘tkazma guvohi yo‘li {#transfer-witness-path}

Ochiq raqamli o‘tkazmalar ko‘rsatma balanslarni o‘zgartirganda tuzilgan o‘tkazma transkriptini yaratadi. Transkript quyidagilarni qayd etadi:

- manba hisobi, manzil hisobi, aktiv ta’rifi va miqdor;
- o‘tkazmadan oldingi va keyingi jo‘natuvchi hamda oluvchi balanslari;
- paket xeshi sifatida ishlatiladigan tranzaksiya kirish nuqtasi xeshi;
- yuboruvchi hisobdan hosil qilingan vakolat dayjesti;
- bitta delta transkriptlari uchun Poseidon dayjesti
- jo‘natuvchi va oluvchi balanslari uchun siyrak Merkle yangilanish guvohlari

Paketli o‘tkazmalar bir nechta deltali bitta transkriptdan foydalanadi. Bunday holatda bitta delta uchun Poseidon dayjesti bo‘lmaydi.

Blok bajarilishi transkriptlarni ularni chiqargan bajarish chaqiruvi bo‘yicha guruhlaydi va blokning FastPQ manba yozuvi bilan birga saqlaydi. AXT o‘tkazma bayonotida har bir o‘tkazma deltasi ikkita o‘tish satriga aylanadi:

| Satr | Kalit | Oldingi qiymat | Keyingi qiymat |
| --------------- | --------------------------------------------------------------------- | ----------------------- | ---------------------- |
| Jo‘natuvchi debeti | Aktiv ta’rifi va manba hisobi uchun `FastpqBalanceKeyV1` | jo‘natuvchining oldingi balansi | jo‘natuvchining keyingi balansi |
| Oluvchi krediti | Aktiv ta’rifi va manzil hisobi uchun `FastpqBalanceKeyV1` | oluvchining oldingi balansi | oluvchining keyingi balansi |

Har bir kalit `FastpqBalanceKeyV1` tuzilmasining kanonik Norito freymidir; uni `transfer_balance_key` tiplangan aktiv ta’rifi va domensiz hisobdan quradi. Hisob taxalluslari va ko‘rsatish shakllari hech qachon kalit materiali bo‘lmaydi.

## Bajarish ta’sirlari {#execution-effects}

Isbotlovchi yo‘lagi to‘liq bajarish ta’siri bayonotlarini isbotlaydi. Har bir bayonot bitta bajarish yozuvining barcha miqdor ta’sirlarini bajarilish tartibida qamrab oladi:

| Ta’sir | Yangilanadigan qiymatlar | Qoida |
| -------- | ------------------------------ | ------------------------------------------------------------------- |
| O‘tkazma | manba va manzil balansi | miqdor bitta aktivning ikki balansi o‘rtasida ko‘chadi |
| Chiqarish | balans va umumiy hajm | ikkalasi ham bir xil noldan farqli miqdorga oshadi |
| Yoqish | balans va umumiy hajm | ikkalasi ham bir xil miqdorga kamayadi |
| Muomaladan chiqarish | umumiy hajm va hayot sikli | umumiy hajm nol bo‘lib qoladi va aktivning mavjudligi birdan nolga o‘zgaradi |

Umumiy hajm hech qachon balansdan pastga tushmaydi. Har bir kalit `iroha:fastpq:execution-quantity-key:v1` domeni, NUL bayti va `FastpqExecutionQuantityKeyV1` balans, umumiy hajm yoki hayot sikli kalitining Norito kodlanishidan iborat. Rol berish, rolni bekor qilish va boshqa amallar isbotlanmaydi.

Bajarish ta’siri va AXT o‘tkazma bayonotlaridagi qiymatlar aktivning o‘nlik masshtabidagi aniq, manfiy bo‘lmagan butun birliklardir (`FastpqQuantityUnits`), shuning uchun ular `u64` bilan cheklanmaydi. Bayonotni qurish masshtab nomuvofiqligini, manfiy farqni va har qanday arifmetik yoki tartib ziddiyatini rad etadi; u hech qachon ochiq qiymatni tuzatmaydi.

## Ochiq kirishlar {#public-inputs}

Har bir FastPQ bayonoti isbotni blok va bajarish kontekstiga bog‘laydigan ochiq kirishlarni olib yuradi:

|Kirish |Ma’nosi |
| ------------- | ------------------------------------------------------------------------------------ |
| `dsid` | Ma’lumotlar makoni identifikatori: uning little-endian tartibidagi `u64` qiymati, so‘ngra sakkizta nol bayt |
| `slot` | Blok yaratilish vaqti nanosekundlarda, millisekund aniqligida |
| `old_root` | Bayonotdan oldingi, ta’sir qilingan kalitlar siyrak Merkle daraxtining ildizi |
| `new_root` | Bayonotdan keyingi, ta’sir qilingan kalitlar siyrak Merkle daraxtining ildizi |
| `perm_root` | Bajaruvchi holatning rol-ruxsat jadvaliga majburiyat |
| `tx_set_hash` | Blokdagi tranzaksiyalarning uzatish kodlanishlariga blok tartibida majburiyat |

`old_root` va `new_root` faqat bayonot ta’sir qiladigan kalitlarni qamrab oladi. Ular saqlanadigan dunyo holati ildizi emas.

`perm_root` — Iroha-ning `fastpq:v1:permission-table:blake2b-256` domeni, little-endian `u64` ko‘rinishidagi yozuvlar soni va saralangan yozuvlar ustidan hisoblangan 32 baytli `Hash` qiymati. Har bir yozuv rol ID xeshi, uning ruxsatlaridan birining xeshi va o‘sha ruxsatning little-endian `u64` ko‘rinishidagi epoxasidan iborat. Bo‘sh jadvalning majburiyati — 32 ta nol bayt. Bu faqat rol va ruxsat konteksti; u hisob a’zoligini yoki avtorizatsiyani isbotlamaydi.

`tx_set_hash` — Iroha-ning `iroha:axt:ordered-transaction-wire-set:v1` domeni, NUL bayti, tranzaksiyalar soni va blok tartibida har bir tranzaksiya uchun uning uzatish uzunligi hamda to‘liq uzatish baytlari ustidan hisoblangan `Hash` qiymati. Son va uzunliklar little-endian `u64` qiymatlaridir. Tranzaksiyalar saralanmaydi va takrorlardan tozalanmaydi, imzolar esa proobrazda qoladi.

Iroha-ning `Hash` funksiyasi — oxirgi baytining eng past biti birga o‘rnatilgan Blake2b-256. Bayonot shuningdek tartiblash xeshini hamda o‘zining to‘liq kanonik satrlari va manba faktlarini olib yuradi; isbot ularning barchasini bog‘laydi.

## Isbot protokoli {#proof-protocol}

Kanonik FastPQ artefaktlari 4-darajali kengaytmaga ega Goldilocks maydoni ustidagi niqoblangan DEEP isbotlaridir. Ularning aniq munosabati, transkripti va so‘rov geometriyasi qayd etilgan versiyadagi [FastPQ DEEP protokol shartnomasi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md) hujjatida belgilangan.

Chaqiruvchilar oddiy yoki AXT bayonotini va resurs chegaralarini tanlaydi. Ular sxemalarni, tekshirish kalitlarini, so‘rovlar sonini yoki transkriptning ichki tafsilotlarini tanlamaydi. Oddiy marshrut — `offline_compact::prove_quantity_ordinary_artifact`; AXT marshruti — `offline_compact::prove_quantity_axt_artifact`, uni `prove_axt_bound_batch` bog‘langan paketlar uchun o‘rab oladi. Shaffof `Prover`, `Proof` va takroriy ijro uchun `verify` API faqat testlarda va `dev-tools` yig‘malarida mavjud.

## Isbot nimalarni tekshiradi {#what-the-proof-checks}

Har qanday maxfiy ishdan oldin ishlab chiqaruvchi ochiq bayonotni tayyorlaydi. U hisoblarni, miqdorlarni, qiymatlarni, holatlar sonini, barqaror kalit tartibini va kalitlarning ajratilishini tekshiradi hamda ochiq faktlari bir-biriga mos kelmaydigan bayonotni rad etadi. So‘ngra muhrlangan munosabat har bir segmentda bitta ta’sir yoki bitta o‘tkazma holatining ikkita to‘liq 32 darajali siyrak Merkle yangilanishini isbotlaydi. Standart chegaralar bitta artefaktda ko‘pi bilan ikkita segmentga ruxsat beradi.

Har bir izda 65,536 satr bor. Ishlab chiqaruvchi 301 ta maxfiy ustunga majburiyat beradi, tekshiruvchi esa 41 ta ochiq ustunni mustaqil ravishda qayta quradi. Yangi kriptografik entropiya iz ustunlarini, bo‘linmani va alohida majburiyat berilgan kompozitsiya ko‘phadini niqoblaydi. Bo‘linmani olish uchun bo‘lish qoldiqsiz bo‘lishi shart. Ishlab chiqaruvchi o‘z artefaktini qaytarishdan oldin uni o‘zi tekshiradi.

Ochiq bayonot qiymatlari yashirilmaydi. Amalning uzatish formatida mavjudligi uni qabul qilish uchun asos emas: munosabatlar faqat yuqorida sanab o‘tilgan ta’sirlar uchun mavjud, AXT bayonotlari esa faqat guvohlangan o‘tkazmalarni qabul qiladi.

## Isbotlovchi yo‘lagi {#prover-lane}

Kura `init_mode = "fast"` bilan ishga tushmasa, `iroha3d` tugun ishga tushayotganda, Torii yuborishlarni qabul qila boshlashidan oldin bitta FastPQ isbotlovchi ishchi jarayonini ishga tushiradi. Ishchi jarayon o‘z ichki tizimini fonda initsializatsiya qiladi, shuning uchun initsializatsiya muvaffaqiyatsiz bo‘lsa ham ishga tushish davom etadi; bunda yo‘lak o‘chiq qoladi.

Ishchi jarayon tugunning yakunlangan holatini va Kura omborini davriy ravishda so‘rab turadi. Har bir yakunlangan blok uchun u autentifikatsiyalangan manbani oladi (manba saqlanmagan bo‘lsa, mahalliy bajarishni qayta ijro etadi) va blokning to‘liq bayonotlarini oddiy marshrut orqali birma-bir isbotlaydi. Qayta ishga tushirilgandan so‘ng u autentifikatsiyalangan prefiksni qayd etilgan imzolangan genezisdan qayta quradi. Har bir artefaktni Kura-ning cheklangan FastPQ omborida saqlaydi. Saqlangan artefakt faqat e’londir: keyingi blokka o‘tishdan oldin ishlab chiqaruvchi manbani autentifikatsiya qiladi va artefaktni yana tekshiradi.

Isbot ishlab chiqarish tugun ichida mahalliy bajariladi. U tranzaksiyani qabul qilish yoki konsensus darvozasi emas: bajarish, blokni qayd etish va yakuniylik isbotni kutmaydi. Qayta urinish mumkin bo‘lgan xato ishni keyingi urinishga qoldiradi va har bir jarayonda bitta ishlab chiqaruvchi ishlaydi.

## Tekshirish {#verification}

Tekshiruvchi artefaktni o‘zining autentifikatsiyalangan bayonotidan chiqargan kutilgan qiymatlar bilan solishtiradi; bu qiymatlar hech qachon tekshirilayotgan artefaktning o‘zidan olinmaydi. Tekshiruv har bir segmentni chegaralar doirasida bir marta dekodlaydi, AIR ni domendan tashqari nuqtada bir marta baholaydi, har bir ochilgan satrni, bo‘linma bargini va FRI tolasini, shuningdek to‘liq FRI terminalini majburiyat berilgan ildizlarga nisbatan autentifikatsiya qiladi va ko‘pi bilan 385 ta buklash tekshiruvini bajaradi. U hech qanday maxfiy guvoh, iz yoki to‘liq past darajali kengaytmani qurmaydi.

Muvaffaqiyatli tekshiruv chaqiruvchining kutilgan qiymatlari bilan muvofiqlikni tasdiqlaydi. U hech qanday bajarish vakolati, manba yakuniyligi, takroriy ijroga ruxsat yoki AXT sarflash avtorizatsiyasini bermaydi.

Oddiy marshrut ham foydalanadigan `offline_compact::VerificationLimits` dagi standart chegaralar:

|Chegara |Standart qiymat |
| ------------------------------- | ------------: |
| Bitta artefaktdagi segmentlar | 2 |
| Artefaktning uzatish baytlari | 1 MiB |
| Ichki isbot freymi | 500,084 bayt |
| Barcha segmentlar bo‘yicha bayonot baytlari | 512 KiB |
| Bitta segmentdagi so‘rovlar | 77 |
| Barcha segmentlar bo‘yicha so‘rovlar | 154 |

Tugun yo‘lagi artefaktning uzatish baytlarini qo‘shimcha ravishda `zk.fastpq.proof_sidecar_max_bytes` qiymati va Kura-ning FastPQ obyekt chegarasi bilan cheklaydi. Dekodlashdan oldin AXT isbot blobi ko‘pi bilan 2 MiB, uning ichidagi FastPQ foydali yuki esa ko‘pi bilan 1 MiB bo‘lishi mumkin.

## SORA Nexus AXT isbot konvertlari {#sora-nexus-axt-proof-envelopes}

SORA Nexus AXT isbot konvertlariga `AxtFastpqBinding`ni joylashtirish mumkin. AXT konvertlarini blok darajasida tekshirish, IVM mezbonining AXT konvert tekshiruvlari va `RegisterVerifiedFeeSponsorVaultAllocation` konvertning `fastpq_binding` qiymatini talab qiladi, uni kutilgan da’vo bilan solishtiradi hamda konvert va uning ichidagi isbot uchun FastPQ tekshiruvchisini chaqiradi. Bog‘lanish bo‘lmasa yoki tekshiruv muvaffaqiyatsiz tugasa, amal rad etiladi.

Tekshiruvchi faqat guvohlangan o‘tkazma da’volarini, ya’ni `tx_predicate` va `value_conservation` da’volarini qabul qiladi. `authorization` va `compliance` da’vo turlari o‘tkazma munosabatiga ega bo‘lmagan, shaffof bo‘lmagan ta’sir konteynerlaridir va tekshiruv ularni rad etadi. Blok validatsiyasi shuningdek masofaviy sarflarni olib yuruvchi konvertlarni rad etadi, IVM mezboni esa mustaqil `AXT_VERIFY_DS_PROOF` qabulini rad etadi. Yakunlangan manba ildizlari, tranzaksiyalar to‘plami va emitent avtorizatsiyasini autentifikatsiya qilish mumkin bo‘lmaguncha ikkalasi ham mavjud emas.

### AXT bog‘lanishi {#axt-binding}

SORA Nexus AXT konvertlari uchun `AxtFastpqBinding` isbotlash va tekshirishdan oldin kanoniklashtiriladi:

- `parameter`, `source_dataspace`, `source_receipt_id` va `verified_effect_type` chetdagi bo‘shliqlardan tozalanadi va bo‘sh bo‘lmasligi kerak
- `source_tx_commitment`, `claim_digest`, `witness_commitment` va `policy_commitment` kichik harflarga o‘tkaziladi va 32 baytning o‘n oltilik kodlanishi bo‘lishi kerak
- `verifier_id` qiymati `fastpq`, `verifier_version` qiymati esa `v1` bo‘lishi kerak
- `claim_type` chetdagi bo‘shliqlardan tozalanadi, kichik harflarga o‘tkaziladi va yuqoridagi to‘rtta da’vo turidan birini ko‘rsatishi kerak
- `target_dsids` bo‘sh bo‘lmasligi va qat’iy o‘sish tartibida bo‘lishi kerak
- `remote_spend_intent_commitments` qat’iy o‘sish tartibida va birinchi reliz chegarasida bo‘lishi kerak

Tekshiruv aniq kanonik shaklni talab qiladi; u chaqiruvchi nomidan bog‘lanishni normallashtirmaydi.

Bog‘lanish blok bajarilishi allaqachon qayd etgan paketga biriktiriladi; u o‘tishlarni yaratmaydi. Paketda kamida bitta holat o‘tishi bo‘lishi va unda bog‘lanishning parametrlar majmuasi (`fastpq-state-transition-stark-v1`) ko‘rsatilishi kerak. Uning `entry_hash` metama’lumoti `source_tx_commitment` ga teng bo‘lishi, ochiq `dsid` qiymati esa bog‘lanishning `source_dsid` qiymatini kodlashi kerak. O‘tkazma da’vosi kamida bitta o‘tkazma transkriptini olib yurishi va har bir transkriptning paket xeshi `source_tx_commitment` ga teng bo‘lishi kerak.

So‘ngra bog‘lash jarayoni paketga isbotga bog‘langan metama’lumotlarni yozadi: kanonik bog‘lanish, uning to‘rtta dayjesti, `source_receipt_id`, `target_dsids`, `verified_effect_type`, bo‘sh bo‘lmagan `corridor`, noldan farqli manifest ildizi, ixtiyoriy DA majburiyati, ixtiyoriy noldan farqli majburiyat berilgan miqdor va muddat tugash sloti (nol muddat cheklanmaganini bildiradi). Oxirida u bog‘lanish va muhrsiz paket ustidan muhr qo‘shadi:

$$
\operatorname{seal} =
\operatorname{Hash}(
\texttt{fastpq:axt:batch-seal:v1}\|
E(\operatorname{binding})\|
E(\operatorname{batch})
)
$$

Bu yerda $E$ — kanonik Norito kodlanishi. Bog‘lashdan keyin paketni, bog‘lanishni yoki isbotga bog‘langan har qanday qiymatni o‘zgartirish tekshiruvning muvaffaqiyatsiz bo‘lishiga olib keladi. Tekshiruvchi shuningdek konvertning ma’lumotlar makonini, manifest ildizini, DA majburiyatini, majburiyat berilgan miqdorini va muddat tugashini isbotga bog‘langan qiymatlar bilan solishtiradi.

Tekshirilgan konvert o‘zining isbotlangan `old_root`, `new_root` va `tx_set_hash` qiymatlarini hamda bayonot dayjestini qaytaradi. Dayjest konvertning little-endian `u64` ko‘rinishidagi ma’lumotlar makonini, uning manifest ildizini, mavjud bo‘lsa DA majburiyatini, bog‘lanishni va bayonotni qamrab oladi:

$$
\operatorname{statement\_digest} =
\operatorname{Hash}(
\texttt{fastpq:axt:statement:v1}\|
\operatorname{le64}(\operatorname{dsid})\|
\operatorname{manifest\_root}\|
\operatorname{da\_commitment}\|
E(\operatorname{binding})\|
E(\operatorname{statement})
)
$$

AXT paketi manifesti dayjesti kanonik bog‘lanishning Norito kodlanishi ustidagi SHA-256 dayjestidir:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Parametrlar majmualari {#parameter-sets}

Birinchi relizda aynan bitta parametrlar majmuasi mavjud: `fastpq-state-transition-stark-v1`. Paketlar va AXT bog‘lanishlari uni ko‘rsatadi, AXT isbotlash esa boshqa har qanday nomni rad etadi. DEEP protokol shartnomasi chiqarilgan artefakt geometriyasini belgilaydi:

| Element | Qiymat |
| -------------------------- | ----------------------------------------------------- |
| Maydon | Goldilocks `p = 2^64 - 2^32 + 1`, kengaytma `u^4 - 7` |
| Iz satrlari | 65,536 |
| Baholash satrlari | 8,388,608 (kengaytirish koeffitsiyenti 128) |
| FRI buklash tarmoqlanish darajalari | `[16, 16, 8, 8, 4]` |
| So‘rovlar | 77 ta turli pozitsiya |
| Maydalash (grinding) | yo‘q |
| Majburiyatlar va transkript | SHA3-256 va SHAKE256 |

Ishlab chiqarish uchun malaka tasdig‘i hozircha mavjud emas. Ushbu konstruksiyaning to‘g‘riligi, yashirish xususiyati va Fiat-Shamir o‘zgartirishi bo‘yicha mustaqil tekshiruvlar hali yakunlanmagan, qayd etilgan [ishlab chiqarishga tayyorlik yozuvi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_production_readiness.md) esa ish hajmiga ko‘ra normallashtirilgan hech qanday xavfsizlik da’vosini ilgari surmaydi.

## Sozlash {#configuration}

FastPQ sozlamasi `zk.fastpq` ostida joylashadi.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"
proof_sidecar_queue_cap = 1024
proof_sidecar_max_retries = 16

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false

[zk.fastpq.producer]
poll_interval_ms = 1000
step_timeout_ms = 30000
max_native_steps = 16
max_source_entries = 65536
max_source_statements = 16384
```

Ikkala rejim ham faqat `cpu` yoki `gpu` qiymatini qabul qiladi va standart qiymati `cpu`. Ulardan birortasini `gpu` ga o‘rnatish isbot xeshlash uchun qurilmani talab qiladi: macOS-da Metal, boshqa tizimlarda CUDA. GPU qo‘llab-quvvatlashi kompilyatsiya qilinmagan yoki qurilma dastlabki tekshiruvdan o‘tmasa, isbotlovchi yo‘lagi o‘chiq qoladi; u hech qachon CPU-ga qaytmaydi. Qurilma Merkle barglari va quyi darajadagi ota tugunlarni ommaviy xeshlashni bajaradi; transkript, tartiblangan yuqori daraxt va iz arifmetikasi CPU-da qoladi. `poseidon_mode = "gpu"` bo‘lganda, alohida dastlabki tekshiruv muvaffaqiyatli o‘tsa, tugun transkriptning Poseidon dayjestlarini ham GPU-da paketlab hisoblaydi; aks holda ularni CPU-da hisoblaydi.

`proof_sidecar_max_bytes` tugun saqlaydigan va tekshiradigan kodlangan artefakt hajmini cheklaydi va standart bo‘yicha isbotlovchining eng katta isbot freymiga teng. `producer` jadvali har bir isbotlash urinishini cheklaydi: uning so‘rab turish oralig‘ini, vaqt byudjetini, mahalliy qayta ijro qadamlarini (1 dan 64 gacha), shuningdek xotira ajratilishidan oldin qabul qilinadigan manba yozuvlari va bayonotlarni. `metal_queue_fanout` 1 dan 4 gacha qiymat qabul qiladi.

Rejim va telemetriya yorlig‘i sozlamalarini `iroha3d` orqali ham qayta belgilash mumkin:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

`iroha3d` sozlama faylini o‘qiyotganda muhit o‘zgaruvchilarini e’tiborsiz qoldiradi, shuning uchun bu qiymatlarni TOML-da yoki yuqoridagi parametrlar orqali o‘rnating.

## Metriklar {#metrics}

Telemetriya yoqilganda FastPQ ichki tizim tanlovi, isbotlarni saqlash va Metal bajarish muhiti xatti-harakatiga oid ko‘rsatkichlarni eksport qiladi:

|Ko‘rsatkich |Ma’nosi |
| ----------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |Ichki tizim va qurilma yorliqlari bo‘yicha so‘ralgan hamda aniqlangan bajarish rejimi |
|`fastpq_poseidon_pipeline_total` |So‘ralgan va aniqlangan Poseidon konveyeri yo‘li |
| `fastpq_gpu_disable_total` | Tezlatgich, sabab va qurilma yorliqlari bo‘yicha GPU tezlatgichini o‘chirish hodisalari |
| `fastpq_gpu_parity_failure_total` | Tezlatgich, sabab va qurilma yorliqlari bo‘yicha tanlab olingan GPU moslik xatolari |
| `fastpq_proof_sidecar_queue_depth` | Navbatda turgan FastPQ isbot ilovasini biriktirishlar |
| `fastpq_proof_sidecar_events_total` | Hodisa turi bo‘yicha isbot ilovasini saqlash hodisalari |
|`fastpq_metal_queue_depth` |Metal navbati chegarasi, bir paytdagi ishlarning eng katta soni, yuborishlar soni va tanlash oynasi |
|`fastpq_metal_queue_ratio` |Metal navbatining bandlik va ustma-ustlik nisbatlari |
|`fastpq_zero_fill_duration_ms` |Metal bajarishlari uchun mezbonda nol bilan to‘ldirish davomiyligi |
|`fastpq_zero_fill_bandwidth_gbps` |Hosil qilingan nol bilan to‘ldirish o‘tkazuvchanligi |

Rejim, GPU, Metal navbati va nol bilan to‘ldirish ko‘rsatkichlari `extended` yoki `full` telemetriya profilini talab qiladi va Kura `init_mode = "fast"` bilan ishga tushganda eksport qilinmaydi. Metal navbati va nol bilan to‘ldirish ko‘rsatkichlari shuningdek macOS-da `fastpq-gpu` yig‘masini talab qiladi.

Umumiy unumdorlik muammolarini aniqlashda bu ko‘rsatkichlarni [Unumdorlik va ko‘rsatkichlar](/uz/guide/advanced/metrics.md) bo‘limidagi konsensus hamda navbat signallari bilan birga ishlating.

## Tegishli ma’lumotnomalar {#related-reference}

- tugun vakolatli turlarining oniy tasviri uchun [Ma’lumotlar modeli sxemasi](/uz/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `FastpqPublicTransferStatementV1`
- `FastpqBalanceKeyV1`
- `FastpqExecutionQuantityKeyV1`
- `TransferTranscript`
- `AxtFastpqBinding`
- `AxtProofEnvelope`
- [`iroha3d` FastPQ parametrlari](/uz/reference/iroha3d-cli.md#fastpq-overrides)
