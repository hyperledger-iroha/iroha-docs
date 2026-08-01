---
translation_locale: az
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Binarylərlə işləmək {#working-with-iroha-binaries}

Iroha 3 operatorun iş axını üç əsas ikili ilə əhatə olunur:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) bir peer daemon idarə etmək üçün
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) üçün CLI və operator əmrləri
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) açarlar, mənşə, lokal şəbəkələr və profillər üçün

## Mənbədən qurun {#build-from-source}

İş sahəsinin yuxarı axınından kök:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Bundan sonra buraxılış ikililəri `target/release/` olaraq mövcuddur.

Komandanın səthini yoxlamaq üçün:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Depozitardan birbaşa işə salın {#run-directly-from-the-repository}

Qlobal bir şey quraşdırmaq istəmirsinizsə, `cargo run` istifadə edin:

```bash
cargo run --bin irohad -- --help
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
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Hansı Binary istifadə etməliyəm? {#which-binary-should-i-use}

- Tərəfdaşlarınızı başlatarkən və ya işlətdiyiniz zaman `irohad` istifadə edin.
- Əməliyyatları təqdim etmək və ya operatorun son nöqtələrini yoxlamaq üçün `iroha` istifadə edin.
- `kagami` açar, mənşə manifestləri, profil paketləri və ya localnet aktivlərinə ehtiyac duyduğunuzda istifadə edin.
