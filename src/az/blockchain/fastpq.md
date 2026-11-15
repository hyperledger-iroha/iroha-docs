---
translation_locale: az
translation_source: /blockchain/fastpq.md
translation_source_hash: 98c258ab99bcc7d7d51b69ddd26e39b19ef4eb14d53001825f3737144d68f0e5
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ seçilmiş icra təsirləri üçün Iroha-nın STARK sübut yoludur. O, adi əməliyyat icrasını və ya konsensusu əvəz etmir. Əməliyyatlar əvvəlki kimi ISI, IVM və Sumeragi vasitəsilə icra olunur; FastPQ dəstəklənən təsirləri sonradan, blok icrasının qeydə aldığı mənbə qeydi əsasında sübut edir.

Cari host inteqrasiyasının iki əsas yolu var:

- qovşağın sübutçu zolağının sübut etdiyi, yekunlaşdırılmış blokların ədədi aktiv təsirləri
- `fastpq_binding` sahəsi FastPQ bağlaması daşıyan SORA Nexus AXT sübut zərfləri

## Köçürmə şahidi yolu {#transfer-witness-path}

Şəffaf ədədi köçürmələr, təlimat balansları dəyişdirdikdə strukturlaşdırılmış köçürmə transkripti yaradır. Transkript aşağıdakıları qeyd edir:

- mənbə hesabı, təyinat hesabı, aktiv təsviri və məbləğ
- köçürmədən əvvəl və sonra göndərən və alan balansları
- partiya xəşi kimi istifadə olunan əməliyyat giriş nöqtəsi xəşi
- təqdim edən hesabdan götürülmüş səlahiyyət xülasəsi
- tək-delta transkriptlər üçün Poseidon kriptoqrafik xülasə dəyəri
- göndərən və alan balansları üçün seyrək Merkle yeniləmə şahidləri

Toplu köçürmələr bir neçə delta ilə bir transkript istifadə edir. Bu halda tək-delta Poseidon kriptoqrafik xülasə dəyəri yoxdur.

Blok icrası transkriptləri onları yaradan icra çağırışına görə qruplaşdırır və blokun FastPQ mənbə qeydi ilə birlikdə saxlayır. AXT köçürmə bəyanatında hər köçürmə deltası iki keçid sətrinə çevrilir:

| Sətir | Açar | Əvvəlki dəyər | Sonrakı dəyər |
| --------------- | --------------------------------------------------------------------- | ----------------------- | ---------------------- |
| Göndərənin debeti | Aktiv təsviri və mənbə hesabı üçün `FastpqBalanceKeyV1` | göndərənin əvvəlki balansı | göndərənin sonrakı balansı |
| Alanın krediti | Aktiv təsviri və təyinat hesabı üçün `FastpqBalanceKeyV1` | alanın əvvəlki balansı | alanın sonrakı balansı |

Hər açar `FastpqBalanceKeyV1` strukturunun kanonik Norito çərçivəsidir və `transfer_balance_key` tərəfindən tipləşdirilmiş aktiv təsvirindən və domensiz hesabdan qurulur. Hesab ləqəbləri və göstərilmə formaları heç vaxt açar materialı kimi istifadə olunmur.

## İcra təsirləri {#execution-effects}

Sübutçu zolağı tam icra təsiri bəyanatlarını sübut edir. Hər bəyanat bir icra girişinin bütün miqdar təsirlərini icra ardıcıllığı ilə əhatə edir:

| Təsir | Yenilənən dəyərlər | Qayda |
| -------- | ------------------------------ | ------------------------------------------------------------------- |
| Köçürmə | mənbə və təyinat balansı | məbləğ eyni aktivin iki balansı arasında hərəkət edir |
| Emissiya | balans və ümumi həcm | hər ikisi eyni sıfırdan fərqli məbləğ qədər artır |
| Yandırma | balans və ümumi həcm | hər ikisi eyni məbləğ qədər azalır |
| Dövriyyədən çıxarma | ümumi həcm və həyat dövrü | ümumi həcm sıfır qalır və aktivin mövcudluğu birdən sıfıra dəyişir |

Ümumi həcm heç vaxt balansdan aşağı düşmür. Hər açar `iroha:fastpq:execution-quantity-key:v1` domenindən, NUL baytından və `FastpqExecutionQuantityKeyV1` balans, ümumi həcm və ya həyat dövrü açarının Norito kodlamasından ibarətdir. Rol vermə, rol ləğvi və digər əməliyyatlar sübut edilmir.

İcra təsiri və AXT köçürmə bəyanatlarındakı dəyərlər aktivin onluq miqyasında dəqiq, mənfi olmayan tam ədəd vahidləridir (`FastpqQuantityUnits`), buna görə də `u64` ilə məhdudlaşmır. Bəyanatın qurulması miqyas uyğunsuzluğunu, mənfi fərqi və istənilən hesab və ya sıralama ziddiyyətini rədd edir; o, heç vaxt ictimai dəyəri düzəltmir.

## İctimai Girişlər {#public-inputs}

Hər FastPQ bəyanatı sübutu bloka və icra kontekstinə bağlayan ictimai girişləri daşıyır:

|Giriş|Mənası|
| ------------- | ------------------------------------------------------------------------------------ |
| `dsid` | Məlumat məkanı identifikatoru: little-endian sırası ilə onun `u64` dəyəri, ardınca səkkiz sıfır bayt |
| `slot` | Blokun yaradılma vaxtı nanosaniyələrlə, millisaniyə dəqiqliyi ilə |
| `old_root` | Bəyanatdan əvvəl toxunulan açarların seyrək Merkle ağacının kökü |
| `new_root` | Bəyanatdan sonra toxunulan açarların seyrək Merkle ağacının kökü |
| `perm_root` | İcranın aparıldığı vəziyyətin rol-icazə cədvəli üzrə öhdəlik |
| `tx_set_hash` | Blokun əməliyyatlarının ötürmə kodlamaları üzrə blok sırası ilə öhdəlik |

`old_root` və `new_root` yalnız bəyanatın toxunduğu açarları əhatə edir. Onlar davamlı saxlanılan dünya vəziyyətinin kökü deyil.

`perm_root` Iroha-nın `fastpq:v1:permission-table:blake2b-256` domeni, little-endian `u64` kimi qeydlərin sayı və sıralanmış qeydlər üzərində hesablanan 32 baytlıq `Hash` dəyəridir. Hər qeyd rol ID-sinin xəşindən, onun icazələrindən birinin xəşindən və həmin icazənin little-endian `u64` kimi epoxasından ibarətdir. Boş cədvəlin öhdəliyi 32 sıfır baytdır. Bu yalnız rol və icazə kontekstidir; o, hesab üzvlüyünü və ya avtorizasiyanı sübut etmir.

`tx_set_hash` Iroha-nın `iroha:axt:ordered-transaction-wire-set:v1` domeni, NUL baytı, əməliyyatların sayı və blok sırası ilə hər əməliyyat üçün onun ötürmə uzunluğu və tam ötürmə baytları üzərində hesablanan `Hash` dəyəridir. Say və uzunluqlar little-endian `u64` dəyərləridir. Əməliyyatlar sıralanmır və təkrarlardan təmizlənmir, imzalar isə ön şəkildə qalır.

Iroha-nın `Hash` funksiyası son baytının ən aşağı biti birə təyin edilmiş Blake2b-256 xəşidir. Bəyanat həmçinin sıralama xəşini, tam kanonik sətirlərini və mənbə faktlarını daşıyır; sübut onların hamısını bağlayır.

## Sübut protokolu {#proof-protocol}

Kanonik FastPQ artefaktları Goldilocks sahəsi üzərində 4-cü dərəcəli genişlənmə ilə maskalanmış DEEP sübutlarıdır. Onların dəqiq münasibəti, transkripti və sorğu həndəsəsi sabitlənmiş [FastPQ DEEP protokol müqaviləsində](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md) müəyyən edilir.

Çağıranlar adi və ya AXT bəyanatını və resurs limitlərini seçirlər. Onlar sxemləri, yoxlama açarlarını, sorğu saylarını və ya transkriptin daxili detallarını seçmirlər. Adi marşrut `offline_compact::prove_quantity_ordinary_artifact`, AXT marşrutu isə `offline_compact::prove_quantity_axt_artifact` funksiyasıdır; `prove_axt_bound_batch` onu bağlanmış partiyalar üçün sarmalayır. Şəffaf `Prover`, `Proof` və təkrar icra üçün `verify` API-si yalnız testlərdə və `dev-tools` yığımlarında mövcuddur.

## Sübut nəyi yoxlayır {#what-the-proof-checks}

Hər hansı məxfi işdən əvvəl istehsalçı ictimai bəyanatı hazırlayır. O, hesabları, məbləğləri, dəyərləri, hadisə saylarını, sabit açar sırasını və açarların ayrılmasını yoxlayır və ictimai faktları bir-birinə uyğun gəlməyən bəyanatı rədd edir. Sonra möhürlənmiş münasibət hər seqmentdə bir təsir və ya köçürmə hadisəsinin iki tam 32 səviyyəli seyrək Merkle yeniləməsini sübut edir. Standart limitlər hər artefaktda ən çoxu iki seqmentə icazə verir.

Hər iz 65,536 sətirdən ibarətdir. İstehsalçı 301 məxfi sütunu öhdəliyə götürür, yoxlayıcı isə 41 ictimai sütunu müstəqil şəkildə yenidən qurur. Təzə kriptoqrafik entropiya iz sütunlarını, qisməti və müstəqil şəkildə öhdəliyə götürülmüş kompozisiya çoxhədlisini maskalayır. Qismətə bölmə qalıqsız olmalıdır. İstehsalçı öz artefaktını qaytarmazdan əvvəl onu özü yoxlayır.

İctimai bəyanat dəyərləri gizlədilmir. Əməliyyatın ötürmə formatında mövcud olması onun qəbul edilməsi demək deyil: münasibətlər yalnız yuxarıda sadalanan təsirlər üçün mövcuddur və AXT bəyanatları yalnız şahidi olan köçürmələri qəbul edir.

## Sübutçu zolağı {#prover-lane}

Kura `init_mode = "fast"` ilə başlamırsa, `iroha3d` qovşağın işə salınması zamanı, Torii təqdimatları qəbul etməyə başlamazdan əvvəl bir FastPQ sübutçu işçisini işə salır. İşçi öz arxa ucunu fonda inisializasiya edir, buna görə inisializasiya uğursuz olsa belə işəsalma davam edir; bu halda zolaq deaktiv qalır.

İşçi qovşağın yekunlaşdırılmış vəziyyətini və Kura yaddaşını dövri olaraq sorğulayır. Hər yekunlaşdırılmış blok üçün o, autentifikasiya olunmuş mənbəni əldə edir (mənbə saxlanılmayıbsa, yerli icranı təkrar oynadır) və blokun tam bəyanatlarını adi marşrutla bir-bir sübut edir. Yenidən başladıldıqdan sonra o, autentifikasiya olunmuş prefiksi sabitlənmiş imzalı genezisdən yenidən qurur. Hər artefaktı Kura-nın məhdud FastPQ anbarında saxlayır. Saxlanılan artefakt yalnız elandır: növbəti bloka keçməzdən əvvəl istehsalçı mənbəni autentifikasiya edir və artefaktı yenidən yoxlayır.

Sübut istehsalı qovşağın daxilində lokal aparılır. O, əməliyyat qəbulu və ya konsensus qapısı deyil: icra, blokun təsdiqlənməsi və yekunluq sübutu gözləmir. Təkrarlana bilən uğursuzluq işi sonrakı cəhdə saxlayır və hər prosesdə bir istehsalçı işləyir.

## Yoxlama {#verification}

Yoxlayıcı artefaktı öz autentifikasiya olunmuş bəyanatından çıxardığı gözləntilərlə tutuşdurur; bu gözləntilər heç vaxt yoxlanılan artefaktın özündən götürülmür. Yoxlama hər seqmenti məhdudiyyətlər daxilində bir dəfə dekodlaşdırır, AIR-i domendən kənar nöqtədə bir dəfə qiymətləndirir, hər açılmış sətri, qismət yarpağını və FRI lifini, eləcə də tam FRI terminalını öhdəliyə götürülmüş köklərə qarşı autentifikasiya edir və ən çoxu 385 qatlama yoxlaması aparır. O, heç bir məxfi şahid, iz və ya tam aşağı dərəcəli genişlənmə qurmur.

Uğurlu yoxlama çağıranın gözləntiləri ilə uyğunluğu təsdiqləyir. O, heç bir icra səlahiyyəti, mənbə yekunluğu, təkrar icra qəbulu və ya AXT xərcləmə avtorizasiyası vermir.

Adi marşrutun da istifadə etdiyi `offline_compact::VerificationLimits` standart limitləri:

|Hədd|Standart|
| ------------------------------- | ------------: |
| Artefakt başına seqmentlər | 2 |
| Artefaktın ötürmə baytları | 1 MiB |
| Alt sübut çərçivəsi | 500,084 bayt |
| Bütün seqmentlər üzrə bəyanat baytları | 512 KiB |
| Seqment başına sorğular | 77 |
| Bütün seqmentlər üzrə sorğular | 154 |

Qovşaq zolağı artefaktın ötürmə baytlarını əlavə olaraq `zk.fastpq.proof_sidecar_max_bytes` və Kura-nın FastPQ obyekt limiti ilə məhdudlaşdırır. Dekodlaşdırmadan əvvəl AXT sübut blobu ən çoxu 2 MiB, onun daxilindəki FastPQ yükü isə ən çoxu 1 MiB ola bilər.

## SORA Nexus AXT sübut zərfləri {#sora-nexus-axt-proof-envelopes}

SORA Nexus AXT sübut zərfləri `AxtFastpqBinding` daxil edə bilər. AXT zərflərinin blok validasiyası, IVM hostunun AXT zərf yoxlamaları və `RegisterVerifiedFeeSponsorVaultAllocation` zərfin `fastpq_binding` sahəsini tələb edir, onu gözlənilən iddia ilə tutuşdurur və zərf ilə onun daxilindəki sübut üzərində FastPQ yoxlayıcısını çağırır. Bağlamanın olmaması və ya uğursuz yoxlama əməliyyatın rədd edilməsinə səbəb olur.

Yoxlayıcı yalnız şahidi olan köçürmə iddialarını, yəni `tx_predicate` və `value_conservation` iddialarını qəbul edir. `authorization` və `compliance` iddia növləri köçürmə münasibəti olmayan qeyri-şəffaf təsir daşıyıcılarıdır və yoxlama onları rədd edir. Blok validasiyası həmçinin uzaq xərcləmələr daşıyan zərfləri rədd edir, IVM hostu isə müstəqil `AXT_VERIFY_DS_PROOF` qəbulunu rədd edir. Yekunlaşdırılmış mənbə kökləri, əməliyyat dəsti və emitent avtorizasiyası autentifikasiya oluna bilənə qədər hər ikisi əlçatmaz qalır.

### AXT bağlaması {#axt-binding}

SORA Nexus AXT zərfləri üçün `AxtFastpqBinding` sübutdan və yoxlamadan əvvəl kanonik formaya salınır:

- `parameter`, `source_dataspace`, `source_receipt_id` və `verified_effect_type` kənar boşluqlardan təmizlənir və boş olmamalıdır
- `source_tx_commitment`, `claim_digest`, `witness_commitment` və `policy_commitment` kiçik hərflərə çevrilir və 32 baytın onaltılıq kodlaması olmalıdır
- `verifier_id` dəyəri `fastpq`, `verifier_version` dəyəri isə `v1` olmalıdır
- `claim_type` kənar boşluqlardan təmizlənir, kiçik hərflərə çevrilir və yuxarıdakı dörd iddia növündən birini göstərməlidir
- `target_dsids` boş olmamalı və ciddi artan sırada olmalıdır
- `remote_spend_intent_commitments` ciddi artan sırada və ilk buraxılış limiti daxilində olmalıdır

Yoxlama dəqiq kanonik formanı tələb edir; o, çağıranın əvəzinə bağlamanı normallaşdırmır.

Bağlama blok icrasının artıq qeydə aldığı partiyaya qoşulur; o, keçidlər yaratmır. Partiya ən azı bir vəziyyət keçidi ehtiva etməli və bağlamanın parametr dəstini (`fastpq-state-transition-stark-v1`) göstərməlidir. Onun `entry_hash` metaməlumatı `source_tx_commitment` dəyərinə bərabər olmalı, ictimai `dsid` dəyəri isə bağlamanın `source_dsid` dəyərini kodlamalıdır. Köçürmə iddiası ən azı bir köçürmə transkripti daşımalı və hər transkriptin partiya xəşi `source_tx_commitment` dəyərinə bərabər olmalıdır.

Sonra bağlama prosesi partiyaya sübuta bağlı metaməlumat yazır: kanonik bağlamanı, onun dörd xülasəsini, `source_receipt_id`, `target_dsids`, `verified_effect_type` dəyərlərini, boş olmayan `corridor` dəyərini, sıfırdan fərqli manifest kökünü, istəyə bağlı DA öhdəliyini, istəyə bağlı sıfırdan fərqli öhdəliyə götürülmüş məbləği və bitmə slotunu (sıfır müddətin bitmədiyini bildirir). Sonda o, bağlama və möhürsüz partiya üzərində möhür əlavə edir:

$$
\operatorname{seal} =
\operatorname{Hash}(
\texttt{fastpq:axt:batch-seal:v1}\|
E(\operatorname{binding})\|
E(\operatorname{batch})
)
$$

Burada $E$ kanonik Norito kodlamasıdır. Bağlamadan sonra partiyanı, bağlamanı və ya sübuta bağlı hər hansı dəyəri dəyişmək yoxlamanın uğursuz olmasına səbəb olur. Yoxlayıcı həmçinin zərfin məlumat məkanını, manifest kökünü, DA öhdəliyini, öhdəliyə götürülmüş məbləğini və bitmə müddətini sübuta bağlı dəyərlərlə müqayisə edir.

Yoxlanılmış zərf sübut edilmiş `old_root`, `new_root` və `tx_set_hash` dəyərlərini, həmçinin bəyanat xülasəsini bildirir. Xülasə zərfin little-endian `u64` kimi məlumat məkanını, onun manifest kökünü, mövcud olduqda DA öhdəliyini, bağlamanı və bəyanatı əhatə edir:

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

AXT partiya manifestinin xülasəsi kanonik bağlamanın Norito kodlaması üzərində hesablanan SHA-256 dəyəridir:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Parametr dəstləri {#parameter-sets}

İlk buraxılışda tam olaraq bir parametr dəsti var: `fastpq-state-transition-stark-v1`. Partiyalar və AXT bağlamaları onu göstərir, AXT sübut prosesi isə hər hansı digər adı rədd edir. DEEP protokol müqaviləsi buraxılmış artefakt həndəsəsini təsbit edir:

| Element | Dəyər |
| -------------------------- | ----------------------------------------------------- |
| Sahə | Goldilocks `p = 2^64 - 2^32 + 1`, genişlənmə `u^4 - 7` |
| İz sətirləri | 65,536 |
| Qiymətləndirmə sətirləri | 8,388,608 (genişlənmə əmsalı 128) |
| FRI qatlama aritetləri | `[16, 16, 8, 8, 4]` |
| Sorğular | 77 fərqli mövqe |
| Üyütmə (grinding) | yoxdur |
| Öhdəliklər və transkript | SHA3-256 və SHAKE256 |

İstehsal mühiti üçün kvalifikasiya mövcud deyil. Bu konstruksiyanın düzgünlüyü, gizlətmə xüsusiyyəti və Fiat-Shamir çevrilməsi üzrə müstəqil yoxlamalar hələ aparılmayıb və sabitlənmiş [istehsala hazırlıq qeydi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_production_readiness.md) iş həcminə görə normallaşdırılmış heç bir təhlükəsizlik iddiası irəli sürmür.

## Konfiqurasiya {#configuration}

FastPQ konfiqurasiyası `zk.fastpq` altında yerləşdirilib.

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

Hər iki rejim yalnız `cpu` və ya `gpu` dəyərini qəbul edir və standart dəyər `cpu`-dur. Onlardan hər hansı birini `gpu` olaraq təyin etmək sübut xəşləməsi üçün cihaz tələb edir: macOS-da Metal, digər platformalarda CUDA. GPU dəstəyi kompilyasiya edilməyibsə və ya cihaz ilkin yoxlamadan keçmirsə, sübutçu zolağı deaktiv qalır; o, heç vaxt CPU-ya geri qayıtmır. Cihaz Merkle yarpaqlarının və aşağı səviyyəli valideyn düyünlərinin kütləvi xəşləməsini icra edir; transkript, sıralanmış yuxarı ağac və iz arifmetikası CPU-da qalır. `poseidon_mode = "gpu"` olduqda, ayrıca ilkin yoxlama uğurla keçərsə, qovşaq transkriptin Poseidon xülasələrini də GPU-da paketlərlə hesablayır; əks halda onları CPU-da hesablayır.

`proof_sidecar_max_bytes` qovşağın saxladığı və yoxladığı kodlanmış artefaktın ölçüsünü məhdudlaşdırır və standart olaraq sübutçunun maksimum sübut çərçivəsinə bərabərdir. `producer` cədvəli hər sübut cəhdini məhdudlaşdırır: onun sorğulama intervalını, vaxt büdcəsini, yerli təkrar icra addımlarını (1-dən 64-ə qədər), habelə yaddaş ayrılmasından əvvəl qəbul edilən mənbə girişlərini və bəyanatları. `metal_queue_fanout` 1-dən 4-ə qədər dəyər qəbul edir.

Rejim və telemetriya etiketi parametrləri `iroha3d` vasitəsilə də yenidən təyin edilə bilər:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

`iroha3d` konfiqurasiya faylını oxuyarkən mühit dəyişənlərini nəzərə almır, ona görə də bu dəyərləri TOML-da və ya yuxarıdakı seçimlərlə təyin edin.

## Metriklər {#metrics}

Telemetriya aktiv olduqda FastPQ arxa uc seçimi, sübutların saxlanması və Metal icra mühitinin davranışı üçün metriklər ixrac edir:

|Metrik|Mənası|
| ----------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Arxa uc və cihaz etiketləri üzrə tələb olunan və müəyyən edilmiş icra rejimi|
| `fastpq_poseidon_pipeline_total` |Tələb olunan və müəyyən edilmiş Poseidon konveyeri yolu|
| `fastpq_gpu_disable_total` | Sürətləndirici, səbəb və cihaz etiketləri üzrə GPU sürətləndiricisinin deaktiv edilməsi hadisələri |
| `fastpq_gpu_parity_failure_total` | Sürətləndirici, səbəb və cihaz etiketləri üzrə nümunə kimi götürülmüş GPU uyğunluq xətaları |
| `fastpq_proof_sidecar_queue_depth` | Növbədə gözləyən FastPQ sübut əlavəsi qoşmaları |
| `fastpq_proof_sidecar_events_total` | Hadisə növü üzrə sübut əlavəsinin saxlanması hadisələri |
| `fastpq_metal_queue_depth`        |Metal növbə limiti, eyni vaxtda icrada olan işlərin maksimum sayı, göndəriş sayı və nümunə götürmə pəncərəsi|
| `fastpq_metal_queue_ratio`        |Metal növbəsi məşğul və örtüşmə nisbətləri|
| `fastpq_zero_fill_duration_ms`    |Metal işləri üçün hostda sıfır-doldurma müddəti|
| `fastpq_zero_fill_bandwidth_gbps` |Törəmə sıfır-doldurma bant genişliyi|

Rejim, GPU, Metal növbəsi və sıfır-doldurma metrikləri `extended` və ya `full` telemetriya profilini tələb edir və Kura `init_mode = "fast"` ilə başladıqda ixrac edilmir. Metal növbəsi və sıfır-doldurma metrikləri həmçinin macOS-da `fastpq-gpu` yığımını tələb edir.

Ümumi performans triajı üçün bunları [Performans və Ölçülər](/az/guide/advanced/metrics.md)-da göstərilən konsensus və növbə siqnalları ilə istifadə edin.

## Əlaqəli İstinad {#related-reference}

- qovşağın səlahiyyətli mənbə olduğu tiplərin anlıq görüntüsü üçün [Məlumat Modeli Sxeması](/az/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `FastpqPublicTransferStatementV1`
- `FastpqBalanceKeyV1`
- `FastpqExecutionQuantityKeyV1`
- `TransferTranscript`
- `AxtFastpqBinding`
- `AxtProofEnvelope`
- [`iroha3d` FastPQ seçimlər](/az/reference/iroha3d-cli.md#fastpq-overrides)
