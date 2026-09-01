---
translation_locale: uz
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ishga tushurish Iroha 3 {#launch-iroha-3}

Ushbu sahifa Iroha 3 uchun joriy mahalliy tarmoq oqimini yuqori darajadagi repozitoriyadan olingan standart ish maydoni aktivlaridan foydalanib tushuntirib beradi.

## 1. Ko‘p tugunli mahalliy tarmoq yaratish {#_1-generate-a-local-multi-peer-network}

Joriy Kagami kodidan to‘rt tugunli localnet hosil qiling:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Chiqarish papkasi mos keluvchi tarmoq hamkasbi konfiguratsiyalarini, `genesis.json`, `genesis.signed.nrt`, `client.toml`, va yordamchi skriptlarni o'z ichiga oladi.

Mahalliy mahalliy foydalanish testi uchun, yaratilgan tarmoq ishtirokchilarini to‘g‘ridan-to‘g‘ri ishga tushiring:

```bash
./localnet/start.sh
```

Konteynerlashtirilgan ish uchun, xuddi shu localnet papkasidan Compose yarating:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

Standart yaratilgan stek quyidagilarni ko‘rsatadi:

- tarmoq tengdosh P2P portlar `1337` dan `1340` gacha
- Torii HTTP portlarni `8080` dan `8083` gacha
- `./localnet/client.toml` manzilda tayyor mijoz konfiguratsiyasi

## 2. Tarmoqning ishlashini tekshiring {#_2-verify-that-the-network-is-up}

Birinchi tarmoq hamkasbida API endpoint holatini tekshiring:

```bash
curl http://127.0.0.1:8080/status
```

Standart sog‘liqni tekshirishlar shuningdek quyidagilarni ishlatadi:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Siz darhol CLI ni biriktirilgan mijoz konfiguratsiyasiga yo'naltirishingiz mumkin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Profil {#_3-nexus-profile}

Ombor shuningdek `defaults/nexus/` ostida SORA Nexus-ga yo'naltirilgan konfiguratsiya profilini yuboradi.

Nexus profil bilan mahalliy tarmoq ishtirokchisini ishga tushirish uchun:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

Ushbu profilga kirish uchun `defaults/nexus/client.toml` dan CLI foydalaning.

## 4. Mahalliy Tarmoqni To'xtatish {#_4-stop-the-local-network}

Mahalliy ishlab chiqarilgan localnet uchun:

```bash
./localnet/stop.sh
```

Yaratilgan Compose steki uchun:

```bash
docker compose -f ./docker-compose.yml down
```

Tarmoq ishga tushgach, [Iroha 3 ni CLI orqali boshqaring](/uz/get-started/operate-iroha-via-cli.md) bilan davom eting.
