---
translation_locale: az
translation_source: /reference/binaries.md
translation_source_hash: 3d1cddb466092770376bcb150963d5df29a6ebc5cf6e670baa3a5c277082fdab
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha İkilik Fayllarla İş {#working-with-iroha-binaries}

Iroha 3 operator iş axını dörd əsas binar ətrafında fırlanır:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) şəbəkə həmkar demonu işlətmək üçün
- `iroha3d_taira` tək protokol-standart Taira təsdiqedicisi başlatıcısı üçün
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) üçün CLI və operator əmrləri
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) açarlar, blokçeyn başlanğıcı, yerli şəbəkələr və profillər

## Mənbədən qur {#build-from-source}

Yuxarı axın iş sahəsinin kökündən:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Buraxılış binarları sonra `target/release/` ünvanında mövcuddur.

Əmr səthini yoxlamaq üçün:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Yalnız Repozitoriyadan İcra Et {#run-directly-from-the-repository}

Əgər heç nəyi qlobal şəkildə qurmaq istəmirsinizsə, `cargo run` istifadə edin:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Şəkil {#docker-image}

Yuxarı axın iş sahəsi `kagami localnet` və `kagami docker`-dən istifadə edərək yoxlanmış kod ilə uyğun gələn Docker Compose faylları yaradır. `hyperledger/iroha:dev` şəkli həmin yaradılmış fayllarla istifadə oluna bilər.

Konteynerdə CLI-i işə salın:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Bir konteynerdə Kagami-i işə salın:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Şəbəkə həmkarını işə salmaq üçün əvvəlcə bir localnet və Compose faylı yaradın:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## Hansı ikili fayldan istifadə etməliyəm? {#which-binary-should-i-use}

- İctimai Taira doğrulayıcı buraxılışı xaricində şəbəkə tərəfdaşlarını işə salarkən və ya idarə edərkən `iroha3d`-dən istifadə edin.
- `iroha3d_taira --sora` yalnız tək bir protokol-standart Taira doğrulayıcı yerləşdirilməsi üçün istifadə edin; bu Taira-in zəncirini, yaddaşını və icraçi imzaçısının profilini tətbiq edir.
- `iroha`-dən blokçeyn dəftərini sorğulamaq, əməliyyatları təqdim etmək və ya operator API uç nöqtələrini yoxlamaq lazım olduqda istifadə edin.
- Açarlar, blokçeyn genesis texniki manifestləri, profil paketləri və ya localnet aktivlərinə ehtiyacınız olduqda `kagami`-dən istifadə edin.
