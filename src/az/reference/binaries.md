---
translation_locale: az
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Binarylərlə işləmək {#working-with-iroha-binaries}

Iroha 3 operatorun iş axını dörd əsas ikili ilə əhatə olunur:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) bir peer daemon idarə etmək üçün
- `iroha3d_taira` canoniki Taira təsdiqləyici fırlatıcısı üçün
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) üçün CLI və operator əmrləri
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) açarlar, mənşə, lokal şəbəkələr və profillər üçün

## Mənbədən qurun {#build-from-source}

İş sahəsinin yuxarı axınından kök:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Bundan sonra buraxılış ikililəri `target/release/` olaraq mövcuddur.

Komandanın səthini yoxlamaq üçün:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Depozitardan birbaşa işə salın {#run-directly-from-the-repository}

Qlobal bir şey quraşdırmaq istəmirsinizsə, `cargo run` istifadə edin:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker şəkil {#docker-image}

Upstream iş məkanı `kagami localnet` və `kagami docker` istifadə edərək yoxlanılan kodla uyğun olan Docker Compose faylları istehsal edir. `hyperledger/iroha:dev` görüntüsü istehsal edilmiş fayllar ilə birlikdə istifadə edilə bilər.

CLI bir konteynerdə işlət:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Kagami konteynerdə işlətmək:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Tərəfdaş başlanğıc üçün localnet yaratın və əvvəlcə kompost fayl:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## Hansı Binary istifadə etməliyəm? {#which-binary-should-i-use}

- İctimai Taira təsdiqləyici buraxılışından kənarda həmyaşıdları başlatarkən və ya işlətdiyiniz zaman `iroha3d` istifadə edin.
- `iroha3d_taira --sora` yalnız kanonik Taira təsdiqləyici tətbiqi üçün istifadə edin; bu, Taira-nin zəncirini, saxlanmasını və iş vaxtı imzalanıcısı profilinə təsir göstərir.
- Əməliyyatları təqdim etmək və ya operatorun son nöqtələrini yoxlamaq üçün `iroha` istifadə edin.
- `kagami` açar, mənşə manifestləri, profil paketləri və ya localnet aktivlərinə ehtiyac duyduğunuzda istifadə edin.
