---
translation_locale: az
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: 5ceee448217a42e4f8bbae9595486b79019e7a880dfd0f2c71bf580409d0e4b9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Izanami ilə Xaos Testi {#chaos-testing-with-izanami}

Izanami yuxarı axın Iroha iş sahəsində chaosnet təşkilatçısıdır. O, birdəfəlik yerli Iroha klasterini işə salır, tənzimlənə bilən iş yükünü təqdim edir və şəbəkənin seçilmiş iştirakçılarına səhvlər daxil edir ki, operatorlar şəbəkənin nəzarət olunan uğursuzluq altında irəliləməyə davam edib-etmədiyini yoxlaya bilsinlər.

Ön istehsal davamlılıq yoxlamaları, reqressiya təkrarı və konsensus tənzimləmələri üçün Izanami istifadə edin. Onu istehsal şəbəkəsinə yönəltməyin: alət bunun üçün nəzərdə tutulmayıb şəbəkə həmkarlarını əldə etmək, buna şəbəkə həmkarlarının yenidən başlaması, yaddaşın silinməsi, müvəqqəti etibarlı həmkar parçaları və yerli CPU və ya disk təzyiqi daxildir.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

Izanami-ni bu sənədlər deposundan yox, [Iroha mənbə anbarı](https://github.com/hyperledger-iroha/iroha)-dan işə salın:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

İkilik fayla şəbəkəyə qoşulmuş şəbəkə iştirakçılarını yaratmaq və idarə etmək üçün açıq şəkildə icazə verilməlidir. Hər bir qeyri-TUI icra üçün `--allow-net` keçirin və ya TUI içində `allow_net` aktiv edin.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

İnteraktiv iş konfiqurasiyası üçün:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami istifadəçi konfiqurasiya qovluğunda TUI və CLI parametrlərini saxlayır. İlk buraxılış faylında bir açıq-aşkar V1 düzülüş baytı var; buraxılışdan əvvəlki və ya versiyası olmayan parametrlər rədd edilir və miqrasiya edilmək yerinə yenidən yaradılmalıdır. Mövcud profildən yenidən istifadə etməzdən əvvəl göstərilən parametrləri nəzərdən keçirin.

## Əsas Sınaq {#baseline-run}

Şiddətli xətalar əlavə etməzdən əvvəl bir təkrar istehsal olunan baza ilə başlayın:

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

Bu iş yalnız klaster tələb olunan blok hədəfinə çatdıqda, zaman aşımı müddəti ərzində irəliləyişi davam etdirdikdə və isteğe bağlı p95 blok intervalları həddinin altında qaldıqda uğur qazanır.

Əmr, toxum, Iroha protokolunun yekunlaşdırılması, şəbəkə tərəfdaşlarının sayı, səhv tərəfdaşların sayı, iş yükü profili, hədəf TPS və gecikmə həddini qeydlərlə birlikdə qeyd edin. Bu dəyərlər olmadan digər operator eyni nasazlıq nümunəsini yenidən oynaya bilməz.

## İş Yükü Profilləri {#workload-profiles}

Izanaminin iki iş yükü profili var:

|Profil|Onu istifadə et|Qeydlər|
| -------- | -------------------------------------------------- | -------------------------------------- |
| `stable` |Uzun davamlı qaçışlar və təkrarlanan performans yoxlamaları|İcraya təhlükəsiz reseptləri üstün tutur|
| `chaos` |Uğursuzluq-yolu əhatəsi|Şüurlu olaraq yanlış reseptləri ehtiva edir|

Əvvəl sabit profildən istifadə edin:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

Əsas vəziyyət artıq başa düşüldükdə xaos profilinə keçin:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

Müqavilə yerləşdirmə üsulları, açıq şəkildə icazə verilmədiyi təqdirdə stabil işlərdə deaktivdir:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

Yuxarıdakı iş sahəsindən daxil edilmiş SORA Nexus defoltları istifadə etməli olduqda `--nexus` istifadə edin.

## Qüsur Nəzarətləri {#fault-controls}

`--faulty` sıfırdan böyük olduqda, ən azı bir səhv ssenarisi aktiv olmalıdır. Səhv keçidləri standart olaraq aktivdir və boolean bayraqları `=false` ilə deaktiv edilə bilər.

|Qüsur| CLI bayraq                                   |Nəyi məşq etdirir|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|Qəzaya uğramaq və yenidən başlamaq| `--fault-enable-crash-restart`             |şəbəkə həmkar prosesi itkisi və bərpası|
|Yaddaşı sil və yenidən başlad| `--fault-enable-wipe-storage`              |Yerli vəziyyətin itirilməsindən bərpa|
|Yalnış əməliyyat spamı| `--fault-enable-spam-invalid-transactions` |Qəbul və rədd olunma yolları|
|Şəbəkə gecikməsi| `--fault-enable-network-latency`           |Yavaş şayiə və gecikmiş razılıq mesajları|
|Şəbəkə bölünməsi| `--fault-enable-network-partition`         |Müvəqqəti etibarlı əlaqə təcridi|
| CPU stress| `--fault-enable-cpu-stress`                |Yerli təsdiq və planlaşdırma təzyiqi|
|Diskin doymasını| `--fault-enable-disk-saturation`           |Yerli yaddaş təzyiqi|

Yalnız şəbəkə bölünməsi üçün işləmə:

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

`--fault-window-start` və `--fault-window-end`-dən istifadə edərək inyeksiya edilmiş nasazlıqdan əvvəl və sonra nəzarət olunan sabit vəziyyət dövrünü saxlayın. Bu, işə salma səs-küyünü səhvin təsirindən ayırmağı asanlaşdırır.

## Ssenari Formaları {#scenario-shapes}

Yuxarı axın Izanami kataloqu ümumi blokçeyn kommunikasiya uğursuzluğu şəkillərini CLI profilləri ilə xəritələşdirir. Onları eyni bayraqlarla modelləşdirə bilərsiniz:

|Ssenari|Tipik forma|
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|Hədəflənmiş yük| `--faulty 0`, yüksək `--tps`, bir təqdimatçı, yüksək `--max-inflight`|
|Müvəqqəti uğursuzluq|Yalnız məhdud bir səhv pəncərəsi daxilində qəza/yenidən başlatmanı aktiv edin|
|Dayanma və bərpa|Çöküş/yenidən başlatma ilə böyük bir səhv-tərəfli əhali istifadə edin|
|Liderin təcrid olunması|Dəqiq olaraq yalnız şəbəkə-parçalanma xətası olan bir nasaz şəbəkə tərəfdaşından istifadə edin; Izanami Sumeragi lider telemetriyasını izləyir|

Hər dəfə bir dəyişəni sabit saxlayın. Əgər şəbəkə tərəfdaşlarının sayını, iş yükü profilini, səhv pəncərəsini və TPS-ı eyni işləmədə dəyişdirsəniz, nəticəni şərh etmək çətin olur.

## Nəyə baxmalı {#what-to-watch}

Qaçış zamanı performansın yoxlanılması üçün istifadə olunan eyni siqnallara baxın:

- hər işləyən şəbəkə həmkarında blok-hündürlüyü irəliləyişi
- təqdim edilmiş, qəbul edilmiş, rədd edilmiş və vaxtı bitmiş əməliyyatlar
- növbə dərinliyi, növbə doyumu və API son nöqtə geri təzyiqi
- dəyişiklikləri, bərpa yollarını, əskik blokları və əskik kvorum sertifikatlarını gör
- imzalanmış RS16 mövcudluq geriləməsi, gözləyən sessiyalar və gecikmiş konsensus trafiki
- CPU, yaddaş, disk və şəbəkə doyma vəziyyəti şəbəkə həmkarlarını işlədən hostda

Təsdiqləmə-latensiya analizi üçün əsas dövrün diaqnostika jurnallarını aktiv edin:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

Hər blok `block validation timings` ilə birlikdə `stateless_ms`, `execution_ms` və `total_ms` göndərməlidir. Konsensus taymerlərini dəyişdirmədən əvvəl bu vaxtları p95 blok intervalları, görünüş dəyişikliyi sayğacları və növbə təzyiqi ilə müqayisə edin.

## Nəticələrin şərhi {#interpreting-results}

Bir çalışmanı sağlam hesab edin, əgər seçilmiş bütün şəbəkə həmkarları blokları yekunlaşdırmağa davam edirlərsə, yığılıb qalan iş sonsuz böyümürsə və nasazlıqlar konfiqurasiya edilmiş pəncərə bitdikdən sonra yeni bərpa fəaliyyətinə səbəb olmursa.

Bir qaçışı uğursuzluq hesab edin, əgər:

- blokun irəliləməsi `--progress-timeout`-dən daha uzun müddət dayanır
- şəbəkə həmkarlarının hündürlükləri fərqlənir və yenidən birləşmir
- p95 gecikmə `--latency-p95-threshold`-i keçir
- səhv pəncərəsi bağlandıqdan sonra növbələr qalan iş müddəti üçün artır
- rədd edilmiş və ya vaxtı bitmiş əməliyyatlar seçilmiş iş yükü ilə izah edilmir
- şəbəkə həmkarının yenidən başladılması, yaddaşın silinməsi və ya bölmənin bərpası əl ilə təmizləmə tələb edir

Uğursuzluqdan sonra eyni toxum ilə və bir az daha az səhv növü ilə təkrar işlədin. Bu, iş yükünü və vaxtlamanı təkrar istehsal edilə bilən saxlayarkən uğursuzluq səthini daraldır.

## Əlaqəli Səhifələr {#related-pages}

- [Performans və Ölçülər](./metrics.md)
- [Sırf Metalda Iroha işlətmək](./running-iroha-on-bare-metal.md)
- [Torii API son nöqtələr](../../reference/torii-endpoints.md)
