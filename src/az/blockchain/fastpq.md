---
translation_locale: az
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ seçilmiş icra təsirləri üçün Iroha-ın STARK sübut yoludur. Bu, normal əməliyyat icrasını və ya konsensusu əvəz etmir. Əməliyyatlar hələ də adətən olduğu kimi ISI, IVM və Sumeragi üzərindən keçin; FastPQ deterministik icra şahidini istifadə edir və dəstəklənən təsirləri sübut paketlərinə çevirir.

Cari host inteqrasiyasının iki əsas yolu var:

- blok icrası zamanı qeydə alınan şəffaf rəqəmsal aktiv köçürmələri
- `fastpq_binding` sahəsi FastPQ bağlaması daşıyan SORA Nexus AXT sübut zərfləri

## Şahid Transferi Yolu {#transfer-witness-path}

Şəffaf ədədi köçürmələr, təlimat balansları dəyişdirdikdə strukturlaşdırılmış köçürmə transkripti yaradır. Transkript aşağıdakıları qeyd edir:

- mənbə hesabı, təyinat hesabı, aktiv təsviri və məbləğ
- köçürmədən əvvəl və sonra göndərən və alan balansları
- toplu kriptoqrafik xəş kimi istifadə olunan əməliyyat giriş nöqtəsi kriptoqrafik xəş
- tələb edən hesabdan götürülmüş icazə əsaslı kriptoqrafik xülasə dəyəri
- tək-delta transkriptlər üçün Poseidon kriptoqrafik xülasə dəyəri

Toplu köçürmələr bir neçə delta ilə bir transkript istifadə edir. Bu halda tək-delta Poseidon kriptoqrafik xülasə dəyəri yoxdur.

Blokun yekunlaşması zamanı, Iroha bu transkriptləri giriş nöqtəsinin kriptoqrafik xəşinə görə qruplaşdırır. İcra şahidi sonra həm orijinal transkript paketlərini, həm də sübutçu üçün hazırlanmış FastPQ keçid paketlərini daşıyır.

Hər bir köçürmə deltası iki keçid sətrinə çevrilir:

|Sətir|Açar forması|Əvvəlcədən dəyər|Göndərilmiş dəyər|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Göndərən debet| `asset/<asset-definition>/<source-account>`      |göndərən balansı əvvəl|göndərənin qalıq məbləği sonra|
|Qəbul edən kredit| `asset/<asset-definition>/<destination-account>` |qəbul edənin balansı əvvəl|qəbul edənin balansı sonra|

Rəqəmsal dəyərlər tam ədəd şahid vahidlərinə normallaşdırılır. Seçilmiş onluq miqyasında qeyri-mənfi `u64` kimi təmsil oluna bilmirsə, dəyər FastPQ partiyalaması üçün rədd edilir.

## İctimai Girişlər {#public-inputs}

Hər FastPQ keçid partiyası bloka və icra kontekstinə sübutu bağlayan ictimai girişləri daşıyır:

|Giriş|Mənası|
| ------------- | --------------------------------------------------------------- |
| `dsid` | Kiçik bayt əvvəl sırası ilə baytlara kodlanmış məlumat məkanı identifikatoru |
| `slot`        |Blok yaradılma vaxtı nanosaniyələrə çevrildi|
| `old_root`    |İcraya dair şahidlikdən götürülmüş əsas dövlət kökü|
| `new_root`    |İcraya dair şahidlikdən törəyən post-dövlət kökü|
| `perm_root`   |Poseidon kriptoqrafik öhdəlik dəyəri üzərində aktiv rol icazələri|
| `tx_set_hash` |sıralanmış əməliyyat və zaman-tetikləyici giriş nöqtəsi kriptoqrafik xəşləri üzərində kriptoqrafik xəş|

Host bu partiyalar üçün ilk buraxılışın yeganə parametr dəsti olan `fastpq-state-transition-stark-v1`-dən istifadə edir.

## Sübut protokolu {#proof-protocol}

Kanonik köçürmə artefaktları Goldilocks sahəsi üzərində 4-cü dərəcəli genişlənmə ilə maskalanmış DEEP sübutlarıdır. Onların dəqiq münasibəti, transkripti və sorğu həndəsəsi sabitlənmiş [FastPQ DEEP protokol müqaviləsində](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md) müəyyən edilir.

## Doğrulayıcının Yoxladığı Nədir {#what-the-prover-checks}

İz izlərini qurmazdan əvvəl, FastPQ sübutçusu partiya sırasını keçid açarı, əməliyyat sırasi və yerləşdirmə sırasına görə kanonikləşdirir. Transfer sıraları həmçinin transkript metadata tələb edir. Transfer sıraları olan, lakin transfer transkriptləri olmayan bir partiya etibarsızdır.

Transfer transkriptləri üçün, sübut verən tərəfin yoxlamaları bunlardır:

- göndərənin balansı mənfi olmamalıdır
- `sender_after` `sender_before - amount`-ə bərabər olmalıdır
- `receiver_after` `receiver_before + amount`-ə bərabər olmalıdır
- transkript partiyadakı hər bir köçürmə sətrini əhatə etməlidir
- tək-delta Poseidon kriptoqrafik xülasə dəyəri mövcud olduqda, transkript ön şəklinə uyğun olmalıdır
- təqdim edilmiş sparse-Merkle sübutları versiya 1 kimi deşifrə edilməlidir; əskik yollar determinist sintetik sübutlarla doldurulur

İz seçici sütunları ilə transfer, çıxarış, məhv etmə, rol vermə, rol ləğv etmə, metadata təyin etmə və icazə yoxlama sətirlərini ehtiva edir. Rəqəmsal əməliyyat sətirləri həmçinin işarəli dəyişikliklər, aktiv üzrə davam edən dəyişikliklər və təchizat sayğaclarını da daşıyır.

## Təsdiq yürütmə zolağı {#prover-lane}

`iroha3d` provayder arxa ucunu başlada bilsə, başlanğıcda FastPQ dəlil yürütmə xəttini işə salır. İcra xətti məhdud növbəsi olan fon tapşırığıdır. Bir blok icra şahidi yaratdıqdan sonra, konsensus bitirmə yolu blokun kriptoqrafik xəşini, hündürlüyünü, baxışını və şahidini ehtiva edən bir provasiyonu təqdim edir.

Əgər icra zolağı işləmirsə və ya növbə doludursa, iş keçilir və normal blok işlənməsi davam edir. Bu o deməkdir ki, fon provayderinin icra zolağı əməliyyat qəbul etmə və ya konsensus qapısı deyil. Bu, artıq icra olunmuş vəziyyət üzərində sübut istehsal edən bir yoldur.

İcra zolağı belə bir sübutçunu qurur:

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Hər iki parametrin defolt dəyəri `cpu` olaraq təyin edilib. `gpu`-i seçmək açıq şəkildə qapalı-fail tələbi deməkdir: əgər GPU dəstəyi kompilyasiya olunmayıbsa və ya tələb olunan GPU backend preflight uğursuz olur, prover icra xətti deaktiv qalır. İlk buraxılışın heç bir `auto` dəyəri yoxdur və tələb olunan GPU rejimindən CPU rejiminə geri dönmür.

## Təsdiqləmə {#verification}

FastPQ sübut təsdiqi tək protokol-standart toplu kriptoqrafik öhdəlik dəyərini bərpa edir və ictimai transkripti yenidən işlədir. Yoxlayıcı protokolu yoxlayır versiya, parametr dəsti versiyası, təkrar oynatma məhdudiyyətləri, iz kriptoqrafik öhdəlik dəyəri, açıq məlumatlar, seçilmiş Merkle açılışları, AIR açılışları və FRI sorğu zənciri.

Standart cavab limitlərinə daxildir:

|Hədd|Varsayılan|
| ------------------ | ------: |
|Keçid sətirləri|     256 |
|Toplu yük ölçüsü|256 KiB|
| FRI qatlar         |      16 |
|Sorğu açılışları|     128 |

## SORA Nexus AXT sübut zərfləri {#sora-nexus-axt-proof-envelopes}

SORA Nexus AXT sübut zərfləri `AxtFastpqBinding` daxil edə bilər. AXT zərflərinin blok validasiyası, IVM hostunun AXT zərf yoxlamaları və `RegisterVerifiedFeeSponsorVaultAllocation` zərfin `fastpq_binding` sahəsini tələb edir, onu gözlənilən iddia ilə tutuşdurur və zərf ilə onun daxilindəki sübut üzərində FastPQ yoxlayıcısını çağırır. Bağlamanın olmaması və ya uğursuz yoxlama əməliyyatın rədd edilməsinə səbəb olur.

### AXT Tətbiq olunan Riyaziyyat {#axt-binding-math}

SORA Nexus AXT zərflərində sübut yenidən icra edilməzdən əvvəl `AxtFastpqBinding` kanonik formaya salınır. Boş `parameter`, `verifier_id` və ya `verifier_version` dəyərləri rədd edilir; yoxlayıcı ID-si `fastpq`, versiya isə `v1` olmalıdır, dəstəklənən AXT axınları isə `fastpq-state-transition-stark-v1` istifadə edir. İddia növünün kənar boşluqları silinir və hərfləri kiçik hərfə çevrilir.

AXT FastPQ ictimai girişləri deterministik bayt kriptoqrafik xəşlərdir:

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

AXT keçid düymələri bunlardır:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` iddiası rol-vermə sətrini əlavə edir:

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

və səlahiyyətləndirmə siyasətini bağlayan bir metaməlumat sətri. `compliance` iddiası iki metaməlumat sətri əlavə edir: biri siyasət, digəri hədəf məlumat məkanları üçün.

`tx_predicate` və `value_conservation` üçün, bağlama müsbət mənbə və ya təyinat məbləği ehtiva edərkən açıq təsir məbləği istifadə olunur. Əks halda, kod məhdudlaşdırılmış deterministik məbləği çıxarır:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Sonra eyni ötürmə tənlikləri istifadə olunur:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Sintetik göndərən və qəbul edən hesab identifikatorları açar toxumlarından yaradılır:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Köçürmə partiyası kriptoqrafik xəşi belədir:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT seriyası texniki manifestin kriptoqrafik xülasə dəyəri SHA-256-dir, tək protokol-standart bağlamanın Norito kodlaması üzrə:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Parametr dəstləri {#parameter-sets}

İlk buraxılışda tam olaraq bir kanonik parametr dəsti var: `fastpq-state-transition-stark-v1`. O, 4-cü dərəcəli genişlənməyə (`X^4 - 7`) malik Goldilocks sahəsi üzərində 128 bitlik təhlükəsizliyi hədəfləyir və `2^16` iz ölçüsü, `2^19` LDE ölçüsü, 2 FRI ariteti, 8 genişlənmə əmsalı, ən çoxu 17 reduksiya və 136 sorğu istifadə edir.

## Konfiqurasiya {#configuration}

FastPQ konfiqurasiyası `zk.fastpq` altında yerləşdirilib.

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

Eyni icra və telemetriya etiketi `iroha3d` tərəfindən dəyişdirilə bilər:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Konfiqurasiya sahələri üçün ətraf mühit dəyişənləri də dəstəklənir. FastPQ-xüsusi dəyişənlər bunlardır:

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

## Metriklər {#metrics}

Telemetriya aktiv olduqda, FastPQ backend seçimi və Metal proqram təminatı icra mühiti davranışı üçün ölçüləri ixrac edir:

|Metrik|Mənası|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Arxa plan və cihaz etiketləri tərəfindən tələb olunan və həll edilmiş icra rejimi|
| `fastpq_poseidon_pipeline_total` |Tələb olunan və həll olunan Poseidon proqram təminatı emal iş prosesi yolu|
| `fastpq_metal_queue_depth`        |Metal növbə limiti, maksimum uçuşda olan say, göndəriş sayı və nümunə götürmə pəncərəsi|
| `fastpq_metal_queue_ratio`        |Metal növbəsi məşğul və örtüşmə nisbətləri|
| `fastpq_zero_fill_duration_ms`    |Metal işləri üçün ev sahibi sıfır-doldurma müddəti|
| `fastpq_zero_fill_bandwidth_gbps` |Törədilmiş sıfır-doldurulmuş bant genişliyi|

Ümumi performans triajı üçün bunları [Performans və Ölçülər](/az/guide/advanced/metrics.md)-da göstərilən konsensus və növbə siqnalları ilə istifadə edin.

## Əlaqəli İstinad {#related-reference}

- [Məlumat Modeli SXeması](/az/reference/data-model-schema.md) node-səlahiyyətli tipli nöqtə-vaxt məlumat baxışı üçün
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ seçimlər](/az/reference/iroha3d-cli.md#fastpq-overrides)
