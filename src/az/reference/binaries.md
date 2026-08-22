---
translation_locale: az
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# ilə işləyir Iroha Binaries {#working-with-iroha-binaries}

The Iroha 3 operatorun iş axını üç əsas binar ətrafında fırlanır:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) həmyaşıd demonu idarə etmək üçün
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) üçün CLI və operator əmrləri
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) açarlar, genezis, lokal şəbəkələr və profillər üçün

## Mənbədən qurun {#build-from-source}

Yuxarı iş sahəsinin kökündən:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Buraxılış ikili faylları daha sonra mövcuddur `target/release/`.

Komanda səthini yoxlamaq üçün:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Birbaşa Repozitoriyadan Çalışın {#run-directly-from-the-repository}

Qlobal olaraq bir şey quraşdırmaq istəmirsinizsə, istifadə edin `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Şəkil {#docker-image}

Yuxarı iş sahəsi istifadə edir `kagami localnet` və `kagami docker` yaratmaq
Docker Compose yoxlanılmış kodla uyğun gələn fayllar.The `hyperledger/iroha:dev`
şəkil həmin yaradılan fayllarla istifadə edilə bilər.

çalıştırın CLI bir konteynerdə:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Qaç Kagami bir konteynerdə:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Həmyaşıdların işə salınması üçün əvvəlcə bir localnet yaradın və əvvəlcə fayl yaratın:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Hansı Binardan istifadə etməliyəm? {#which-binary-should-i-use}

- istifadə edin `irohad` həmyaşıdları işə başlayanda və ya işləyəndə.
- istifadə edin `iroha` kitaba sorğu vermək, əməliyyatlar təqdim etmək və ya operatorun son nöqtələrini yoxlamaq lazım olduqda.
- istifadə edin `kagami` açarlara, genezis manifestlərinə, profil paketlərinə və ya yerli şəbəkə aktivlərinə ehtiyacınız olduqda.

## Kagemusha Buraxılış Nəşri və Yayımı {#kagemusha-release-publication-and-rollout}

Kagemuşa V4 nəşr və aktivləşdirmə ayrı-ayrı qorunan sərhədləri keçir:

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` edir
  yalnız macOS, yalnız kök nəşriyyatı.O, bərkidilmişləri təsdiqləyir Kagami ikili və
  Tam on altı namizəd namizədi, olmayanları nəşr edir
  `promotion-record-v4.norito` dəyişdirilmədən və yalnız uğur barədə məlumat verir
  Tam on yeddi fayldan sonra sərbəst buraxılmasını təsdiqləyir.
- `iroha offline kagemusha rollout-v4 create-expectations` imzalandığını yoxlayır
  rezervasiya, dörd sifarişli validator ixtisas möhürü, dəqiq
  artıq icazə verilmiş əməliyyat teli və daha əvvəl etibarlı yekunlaşdırılmış lövbər
  imzalanmış gözləntiləri əvəz etmədən dərc etmək.
- `iroha offline kagemusha rollout-v4 submit` aydın tələb edir
  `--write-authorized` razılıq.Dəqiqliyi davamlı şəkildə qeyd edir və yenidən yoxlayır
  şəbəkə yazmadan və ya yenidən cəhd etməzdən əvvəl gözləntilər.An `Applied` status deyil
  kifayətdir: əmr həm də yerinə yetirilən bloku, sonluq varisini yoxlayır
  zəncir və tam icazə daşıyan əməliyyat tel.
- `iroha offline kagemusha rollout-v4 finalize-receipt` eyni sübuta bağlanmış
  dəlili yalnız dəqiq təqdimetmə jurnalı yenidən yoxlandıqdan sonra toplayır, onu
  müstəqil qəbz emitenti ilə imzalayır və kanonik qəbzi əvəz etmədən dərc edir.

Yoxlanılan Kagemuşa istehsalına hazırlıq iş axını yalnız yoxlama üçündür.
O, təsdiqlənmiş naşiri çağırmır, təsdiqləyicinin ixtisasını dərc etmir
möhürləyin, aktivləşdirmə təqdim edin və ya yekun qəbz yaradın.Uğurlu iş axını
run buna görə də nə təşviqi, nə də canlı yayımı sübut etmir.

Bu əmrlər canlı sübutları əvəz etmir, yerli primitivdir.A
istehsalın yayılması real fiziki Tətbiq Attestasiyası olmadan bloklanmış olaraq qalır
namizəd artefaktları, bütün dörd qorunan host möhürü, iş vaxtı idarəçiliyi və
girişlərin imzalanması, canlı dörd təsdiqləyici təqdim və yekun sübutlar və
kanonik effektiv konfiqurasiya proyeksiyası.Şəxsi açarları saxlayın,
autentifikasiya materialı və qorunanda tanıtım üçün xüsusi identifikatorlar
iş vaxtının saxlanması;onları mənbə tərəfindən idarə olunan sənədlərə köçürməyin və ya
operator biletləri.
