---
translation_locale: az
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: 5ceee448217a42e4f8bbae9595486b79019e7a880dfd0f2c71bf580409d0e4b9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Izanami ilə Kaos sınaqları {#chaos-testing-with-izanami}

Izanami Iroha iş məkanında kaos şəbəkəsi orkestratorudur. Birbaşa istifadə edilə bilən yerli Iroha klasteri başlatır, konfigurassiya olunan bir iş yükü təqdim edir və operatorların şəbəkənin nəzarət olunmuş uğursuzluq altında irəliləyişini davam etdirdiyini yoxlaya bilməsi üçün seçilmiş həmyaşıllılara səhvlər enjeksiyaya verir.

Izanami-ni istehsaldan əvvəl dayanıqlılıq yoxlamaları, regressiya reproduksiyası və konsensus tənzimlənməsi üçün istifadə edin. Onu bir istehsal şəbəkəsinə yönəltməyin: vasitə başladığı həmyaşıllılara sahib olmaq üçün nəzərdə tutulmuşdur, o cümlədən həmyaşılsız bərpa, saxlama silsilələri, müvəqqəti etibarlı həmyaşıl partisiyaları və yerli CPU və ya disk təzyiqi.

## Əvvəlki şərtlər {#prerequisites}

Izanami-ni [Iroha mənbə anbarından ](https://github.com/hyperledger-iroha/iroha) yox, bu sənəd anbarından çalışdırın:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

Binary şəbəkəlik həmyaşıdları yaratmaq və idarə etmək üçün açıq şəkildə icazə verilməlidir. TUI olmayan hər bir icra üçün `--allow-net` keçin və ya TUI-də `allow_net` aktivləşdirin

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

İnteraktiv çalışdırma konfigurasiyası üçün:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami TUI və CLI parametrlərini istifadəçi konfiqurasiyası dizaynı altında saxlayır. Birinci buraxılış dosyasında bir açıq V1 düzəliş byti var; əvvəlcədən yayımlanmış və ya başqa cür versiyalaşdırılmamış parametrlər rədd edilir və köçürülmədən yenidən yaradılmalıdır. Mövcud profildən yenidən istifadə etməzdən əvvəl göstərilən parametrləri nəzərdən keçirin.

## Bazanın icra olunması {#baseline-run}

Ciddi səhvləri əlavə etməzdən əvvəl bir təkrarlana bilən əsas xəttlə başlayın:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --target-blocks 100 \
  --progress-interval 15s \
  --progress-timeout 120s \
  --latency-p95-threshold 2s \
  --tps 15 \
  --max-inflight 32 \
  --submitters 1 \
  --seed 42
```

Bu qaçış yalnız klasterin tələb olunan blok hədəfinə çatması, vaxt məhdudluğu ərzində irəliləyiş əldə etməsi və seçmə p95 blok aralığı həddindən aşağı qalması təqdirində uğurlu olur.

Komanda, toxum, Iroha commit, peer count, faulty-peer count, workload profile, target TPS və latency həddini qeyd edin. Bu dəyərlər olmadan başqa operator eyni uğursuzluq nümunəsini oynata bilməz.

## İş yükü profilləri {#workload-profiles}

Izanami iki iş yükü profilinə malikdir:

|Profil |Bunu istifadə edin.|Qeydlər|
| -------- | -------------------------------------------------- | -------------------------------------- |
|`stable` |Uzun sürən nəmləndirmə və təkrarlana bilən performans yoxlamaları |İcra etmək üçün təhlükəsiz reseptləri üstün tutur |
|`chaos` |Səhv yolunun əhatə olunması |Məqsədsiz reseptləri ehtiva edir |

Əvvəlcə sabit profildən istifadə edin:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

Əsas xətt artıq başa düşüldükdən sonra haos profiləsinə keç:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

Müqavilələrin tətbiqi reseptləri açıq şəkildə icazə verilmədiyi təqdirdə sabit işləmələrdə söndürülür:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

Yükləmədə yuxarı axın iş məkanından yerləşdirilmiş SORA Nexus standartları istifadə edilməlidirsə, `--nexus` istifadə edin.

## Səhvlərin nəzarəti {#fault-controls}

Nə vaxt? `--faulty` sıfırdan böyükdürsə, ən azı bir səhv ssenariyası aktivləşdirilməlidir. Default toggles default enable, və boolean bayraqları deaktiv edilə bilər ilə `=false`.

|Səhv .|CLI bayraq|Nə işləyir?|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|Qəsd və yenidən başlanğıc |`--fault-enable-crash-restart` |Tərəfdaş prosesi itkisi və bərpa |
|Yükləməni silin və yenidən başlat |`--fault-enable-wipe-storage` |Yoxsul yerli dövlətdən bərpa olunması |
|Ədalətsiz əməliyyat spamı |`--fault-enable-spam-invalid-transactions` |Qəbul və rədd yolları |
|Şəbəkə gecikməsi |`--fault-enable-network-latency` |Yavaş dedikodular və gecikmiş razılaşma mesajları.|
|Şəbəkə partisiyası |`--fault-enable-network-partition` |Müvəqqəti etibarlı həmyaşıdların təcrid edilməsi |
|CPU stres |`--fault-enable-cpu-stress` |Yerli təsdiq və planlaşdırma təzyiqi |
|Disk doymuşluğu |`--fault-enable-disk-saturation` |Yerli saxlama təzyiqi |

Yalnız şəbəkə partisiyası ilə işləyən üçün:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --fault-window-start 60s \
  --fault-window-end 180s \
  --tps 15 \
  --submitters 1 \
  --max-inflight 32 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --seed 42
```

`--fault-window-start` və `--fault-window-end` tətbiq edilmədən əvvəl və sonra idarə olunan sabit vəziyyət dövrünü saxlamaq üçün istifadə edin. Bu, başlanğıc səs-küyünün səhvin təsiri ilə fərqlənməsini asanlaşdırır.

## Ssenarilərin formaları {#scenario-shapes}

Yuxarıdakı Izanami kataloqu CLI profillərinə ümumi blockchain ünsiyyət çatışmazlığı formalarını xəritə edir. Onları eyni bayraqlarla modelləşdirə bilərsiniz:

|Ssenaryo |Tipik forma |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|Məqsədli yük|`--faulty 0`, yüksək `--tps`, bir təqdimatçı, yüksək `--max-inflight` |
|Keçmiş uğursuzluq |Yalnız sərhədli bir səhv pəncərəsi daxilində qəzaya / yenidən başlama imkanı |
|Qalanma və bərpa |Qəza / yenidən başlama ilə böyük bir səhv yaşıllı populyasiyasından istifadə edin |
|Liderlərin təcrid edilməsi |Təkcə şəbəkə bölüşməsindəki səhvlə tam bir qüsurlu həmyaşıd istifadə edin; Izanami Sumeragi lider telemetriyasını izləyir .|

Bir dəfədə bir dəyişən sabit saxlayın. Əgər həmkarların sayını, iş yükü profilini, səhv pəncərəsini və TPS eyni vaxtda dəyişdirirsinizsə, nəticəni şərh etmək çətindir.

## Nəyə baxmaq lazımdır? {#what-to-watch}

Döyüş zamanı performans təsdiq üçün istifadə olunan eyni siqnallara diqqət yetirin:

- Hər cərrahiyyədə blok hündürlüyündə irəliləyiş
- təqdim olunmuş, qəbul edilmiş, rədd edilmiş və vaxtla başa çatmış əməliyyatlar;
- Səyahət dərinliyi, səyahət doymuşluğu və son nöqtələrin geri basıncı
- baxış dəyişiklikləri, bərpa yolları, çatışmayan bloklar və çatışmayan quorum sertifikatları
- İmzalanmış RS16 mövcudluq arxa cəhəti, gözlənilir mövzusu və gecikmiş konsensus trafikləri
- CPU, yaddaş, disk və həmyaşıdları idarə edən hostda şəbəkə doymuşluğu

Validasiya gecikməsinin təhlili üçün əsas döngədəki debug qeydlərini aktivləşdirin:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

Hər blok `block validation timings` ilə `stateless_ms`, `execution_ms` və `total_ms` emit etməlidir. Bu vaxtları konsensus zamanlayıcılarını dəyişdirmədən əvvəl p95 blok aralığı, görünüş dəyişikliyi hesablamaları və növbə təzyiqi ilə müqayisə edin.

## Nəticələrin təfsiri {#interpreting-results}

Seçilmiş bütün həmyaşıdların blokları yerinə yetirməsini davam etdirdikləri zaman bir qaçışa sağlam yanaşın, arxa yüklər bağlanmadan böyümür və qurulmuş pəncərə başa çatdıqdan sonra səhvlər yeni bərpa fəaliyyətinə səbəb olmur.

Döyüşü uğursuzluq kimi qəbul edin:

- `--progress-timeout`dən uzun blok irəliləyiş stallları.
- Rəfiqələrin hündürlüyü fərqlənir və yenidən birləşmir
- p95 gecikmə müddəti `--latency-p95-threshold`-dən çoxdur
- Çətinlik pəncərəsinin bağlandıqdan sonra növbələr yarışın qalan hissəsi üçün böyüyür.
- rədd edilən və ya vaxtla başa çatmış əməliyyatlar seçilmiş iş yükü ilə izah olunmur.
- Peer restart, saxlama silinməsi və ya bölmə bərpası əl təmizlənməsini tələb edir.

Bir uğursuzluqdan sonra eyni toxum və bir az səhv növü ilə yenidən çalışın. Bu, iş yükünü və vaxtını təkrarlayır və uğursuzluğun səthini daraldır.

## Əlaqəli səhifələr {#related-pages}

- [Performance and Metrics](./metrics.md)
- [Iroha Bare Metal](./running-iroha-on-bare-metal.md) üzərində işləyir
- [Torii son nöqtələri](../../reference/torii-endpoints.md)
