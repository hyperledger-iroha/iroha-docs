---
translation_locale: uz
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ — tanlangan bajarish ta’sirlari uchun Iroha-ning STARK isbot yo‘li. U odatiy tranzaksiya bajarilishi yoki konsensusning o‘rnini bosmaydi. Tranzaksiyalar avvalgidek ISI, IVM va Sumeragi orqali bajariladi; FastPQ deterministik bajarish guvohini qabul qilib, qo‘llab-quvvatlanadigan ta’sirlarni isbot paketlariga aylantiradi.

Joriy mezbon integratsiyasida ikkita asosiy yo‘l bor:

- blok bajarilishida qayd etilgan oshkora raqamli aktiv o‘tkazmalari;
- `fastpq_binding` qiymati FastPQ bog‘lanishini olib yuradigan SORA Nexus AXT isbot konvertlari

## O‘tkazma guvohi yo‘li {#transfer-witness-path}

Ochiq raqamli o‘tkazmalar ko‘rsatma balanslarni o‘zgartirganda tuzilgan o‘tkazma transkriptini yaratadi. Transkript quyidagilarni qayd etadi:

- manba hisobi, manzil hisobi, aktiv ta’rifi va miqdor;
- o‘tkazmadan oldingi va keyingi jo‘natuvchi hamda oluvchi balanslari;
- paket xeshi sifatida ishlatiladigan tranzaksiya kirish nuqtasi xeshi;
- yuboruvchi hisobdan hosil qilingan vakolat dayjesti;
- bitta delta transkriptlari uchun Poseidon dayjesti

Paketli o‘tkazmalar bir nechta deltali bitta transkriptdan foydalanadi. Bunday holatda bitta delta uchun Poseidon dayjesti bo‘lmaydi.

Blokni yakunlashda Iroha bu transkriptlarni kirish nuqtasi xeshi bo‘yicha guruhlaydi. Bajarish guvohi dastlabki transkript paketlari bilan birga isbotlovchi uchun tayyorlangan FastPQ o‘tish paketlarini ham olib yuradi.

Har bir o‘tkazma deltasi ikkita o‘tish satriga aylanadi:

|Satr |Kalit shakli |Oldingi qiymat |Keyingi qiymat |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Jo‘natuvchi debeti |`asset/<asset-definition>/<source-account>` |jo‘natuvchining oldingi balansi |jo‘natuvchining keyingi balansi |
|Oluvchi krediti |`asset/<asset-definition>/<destination-account>` |oluvchining oldingi balansi |oluvchining keyingi balansi |

Raqamli qiymatlar butun sonli guvoh birliklariga me’yorlashtiriladi. Tanlangan o‘nlik aniqlikda qiymatni manfiy bo‘lmagan `u64` sifatida ifodalab bo‘lmasa, u FastPQ paketiga kiritilmaydi.

## Ochiq kirishlar {#public-inputs}

Har bir FastPQ o‘tish paketi isbotni blok va bajarish kontekstiga bog‘laydigan ochiq kirishlarni olib yuradi:

|Kirish |Ma’nosi |
| ------------- | --------------------------------------------------------------- |
| `dsid` | Little-endian baytlarda kodlangan ma’lumotlar makoni identifikatori |
|`slot` |Nanosekundlarga aylantirilgan blok yaratilish vaqti |
|`old_root` |Bajarish guvohidan hosil qilingan ota holat ildizi |
|`new_root` |Bajarish guvohidan hosil qilingan keyingi holat ildizi |
|`perm_root` |Faol rol ruxsatlari ustidagi Poseidon majburiyati |
|`tx_set_hash` |Tartiblangan tranzaksiya va vaqt qo‘zg‘atuvchisi kirish nuqtasi xeshlari ustidagi xesh |

Mezbon bu paketlar uchun birinchi relizdagi yagona parametrlar majmuasi — `fastpq-state-transition-stark-v1` dan foydalanadi.

## Isbot protokoli {#proof-protocol}

Kanonik o‘tkazma artefaktlari 4-darajali kengaytmaga ega Goldilocks maydoni ustidagi niqoblangan DEEP isbotlaridir. Ularning aniq munosabati, transkripti va so‘rov geometriyasi qayd etilgan versiyadagi [FastPQ DEEP protokol shartnomasi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md) hujjatida belgilangan.

## Isbotlovchi nimalarni tekshiradi {#what-the-prover-checks}

FastPQ isbotlovchisi izni yaratishdan avval paket tartibini o‘tish kaliti, amal darajasi va kiritish tartibi bo‘yicha kanonlashtiradi. O‘tkazma satrlari transkript metama’lumotini ham talab qiladi. O‘tkazma satrlari bor, ammo o‘tkazma transkriptlari yo‘q paket yaroqsiz.

O‘tkazma transkriptlari uchun isbotlovchi quyidagilarni tekshiradi:

- jo‘natuvchining balansi manfiy qiymatga tushmasligi kerak
- `sender_after` qiymati `sender_before - amount` ga teng bo‘lishi kerak;
- `receiver_after` qiymati `receiver_before + amount` ga teng bo‘lishi kerak;
- transkript paketdagi har bir o‘tkazma satrini qamrab olishi kerak;
- bitta delta uchun Poseidon dayjesti mavjud bo‘lsa, u transkript proobraziga mos kelishi kerak;
- berilgan siyrak Merkle isbotlari 1-versiya sifatida dekodlanishi kerak; yetishmaydigan yo‘llar deterministik sintetik isbotlar bilan to‘ldiriladi.

Iz o‘tkazma, chiqarish, yoqish, rol berish, rolni bekor qilish, metama’lumot sozlash va ruxsat qidirish satrlari uchun selektor ustunlariga ega. Raqamli amal satrlari ishorali deltalar, har bir aktiv bo‘yicha jamlanib boradigan deltalar va taklif hisoblagichlarini ham olib yuradi.

## Isbotlovchi yo‘lagi {#prover-lane}

Isbotlovchi ichki tizimini tayyorlash mumkin bo‘lsa, `iroha3d` ishga tushishda FastPQ isbotlovchi yo‘lagini boshlaydi. Yo‘lak — chegaralangan navbatga ega fon vazifasi. Blok bajarish guvohini hosil qilgach, yakunlash yo‘li blok xeshi, balandligi, ko‘rinishi va guvohni o‘z ichiga olgan isbotlash vazifasini yuboradi.

Yo‘lak ishlamayotgan yoki navbat to‘la bo‘lsa, vazifa tashlab ketiladi va odatiy blokni qayta ishlash davom etadi. Demak, fondagi isbotlovchi yo‘lagi tranzaksiyani qabul qilish yoki konsensus darvozasi emas; u allaqachon bajarilgan holat uchun isbot yaratish yo‘lidir.

Yo‘lak isbotlovchini quyidagilar bilan yaratadi:

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Har ikki sozlamaning standart qiymati `cpu`. `gpu` ni tanlash — xavfsiz rad etiladigan aniq talab: GPU qo‘llab-quvvatlashi yig‘ilmagan yoki so‘ralgan GPU ichki tizimining dastlabki tekshiruvi muvaffaqiyatsiz bo‘lsa, isbotlovchi yo‘lagi o‘chiq qoladi. Birinchi relizda `auto` qiymati yo‘q va so‘ralgan GPU rejimidan CPU-ga zaxira qaytish amalga oshirilmaydi.

## Tekshirish {#verification}

FastPQ isbotini tekshirish kanonik paket majburiyatini qayta yaratadi va ochiq transkriptni takrorlaydi. Tekshiruvchi protokol versiyasi, parametrlar majmuasi versiyasi, takrorlash chegaralari, iz majburiyati, ochiq kirishlar, tanlangan Merkle ochilishlari, AIR ochilishlari va FRI so‘rovi zanjirini tekshiradi.

Standart takrorlash chegaralari quyidagilarni o‘z ichiga oladi:

|Chegara |Standart qiymat |
| ------------------ | ------: |
|Oʻtish qatorlari |     256 |
|Paket foydali yuki o‘lchami |256 KiB |
|FRI qatlamlari |      16 |
|So‘rov ochilishlari |     128 |

## SORA Nexus AXT isbot konvertlari {#sora-nexus-axt-proof-envelopes}

SORA Nexus AXT isbot konvertlariga `AxtFastpqBinding`ni joylashtirish mumkin. AXT konvertlarini blok darajasida tekshirish, IVM mezbonining AXT konvert tekshiruvlari va `RegisterVerifiedFeeSponsorVaultAllocation` konvertning `fastpq_binding` qiymatini talab qiladi, uni kutilgan da’vo bilan solishtiradi hamda konvert va uning ichidagi isbot uchun FastPQ tekshiruvchisini chaqiradi. Bog‘lanish bo‘lmasa yoki tekshiruv muvaffaqiyatsiz tugasa, amal rad etiladi.

### AXT bog‘lanishi matematikasi {#axt-binding-math}

SORA Nexus AXT konvertlari uchun `AxtFastpqBinding` isbot qayta bajarilishidan oldin kanoniklashtiriladi. Bo‘sh `parameter`, `verifier_id` yoki `verifier_version` qiymatlari rad etiladi; tekshiruvchi identifikatori `fastpq`, versiyasi esa `v1` bo‘lishi shart, qo‘llab-quvvatlanadigan AXT jarayonlari esa `fastpq-state-transition-stark-v1` dan foydalanadi. Da’vo turi atrofidagi bo‘shliqlar olib tashlanib, kichik harflarga o‘tkaziladi.

AXT FastPQ ochiq kirishlari deterministik bayt xeshlaridir:

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

AXT o‘tish kalitlari quyidagicha:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` da’vosi rol berish satrini kiritadi:

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

va vakolat siyosatini bog‘lovchi metadata qatori. `compliance` da’vosi ikkita metadata qatorini kiritadi: biri siyosat, ikkinchisi maqsad ma’lumotlar makonlari uchun.

`tx_predicate` va `value_conservation` uchun bog‘lanish musbat manba yoki manzil miqdorini o‘z ichiga olsa, aniq ta’sir miqdori ishlatiladi. Aks holda kod chegaralangan deterministik miqdorni hosil qiladi:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Keyin ayni o‘tkazma tenglamalari qo‘llaniladi:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Sintetik jo‘natuvchi va oluvchi hisob identifikatorlari kalit urug‘laridan hosil qilinadi:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

O‘tkazma paketi xeshi quyidagicha:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT paketi manifesti dayjesti kanonik bog‘lanishning Norito kodlanishi ustidagi SHA-256 dayjestidir:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Parametrlar majmualari {#parameter-sets}

Birinchi relizda aynan bitta kanonik parametrlar majmuasi mavjud — `fastpq-state-transition-stark-v1`. U 4-darajali kengaytmaga (`X^4 - 7`) ega Goldilocks maydoni ustida 128 bitli xavfsizlikni ko‘zlaydi va quyidagilardan foydalanadi: iz hajmi `2^16`, LDE hajmi `2^19`, FRI tarmoqlanish darajasi 2, kengaytirish koeffitsiyenti 8, ko‘pi bilan 17 ta reduksiya va 136 ta so‘rov.

## Sozlash {#configuration}

FastPQ sozlamasi `zk.fastpq` ostida joylashadi.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

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
```

Ayni bajarish va telemetriya yorliqlarini `iroha3d` orqali qayta belgilash mumkin:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Sozlama maydonlari uchun muhit o‘zgaruvchilari ham qo‘llab-quvvatlanadi. FastPQ-ga xos o‘zgaruvchilar quyidagilarni o‘z ichiga oladi:

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`

## Metriklar {#metrics}

Telemetriya yoqilganda FastPQ ichki tizim tanlovi va Metal bajarish muhiti xatti-harakatiga oid ko‘rsatkichlarni eksport qiladi:

|Ko‘rsatkich |Ma’nosi |
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |Ichki tizim va qurilma yorliqlari bo‘yicha so‘ralgan hamda aniqlangan bajarish rejimi |
|`fastpq_poseidon_pipeline_total` |So‘ralgan va aniqlangan Poseidon konveyeri yo‘li |
|`fastpq_metal_queue_depth` |Metal navbati chegarasi, bir paytdagi ishlarning eng katta soni, yuborishlar soni va tanlash oynasi |
|`fastpq_metal_queue_ratio` |Metal navbatining bandlik va ustma-ustlik nisbatlari |
|`fastpq_zero_fill_duration_ms` |Metal bajarishlari uchun mezbonda nol bilan to‘ldirish davomiyligi |
|`fastpq_zero_fill_bandwidth_gbps` |Hosil qilingan nol bilan to‘ldirish o‘tkazuvchanligi |

Umumiy unumdorlik muammolarini aniqlashda bu ko‘rsatkichlarni [Unumdorlik va ko‘rsatkichlar](/uz/guide/advanced/metrics.md) bo‘limidagi konsensus hamda navbat signallari bilan birga ishlating.

## Tegishli ma’lumotnomalar {#related-reference}

- tugun vakolatli turlarining oniy tasviri uchun [Ma’lumotlar modeli sxemasi](/uz/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ parametrlari](/uz/reference/iroha3d-cli.md#fastpq-overrides)
