---
translation_locale: uz
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Uchratish Iroha 3 {#launch-iroha-3}

Ushbu sahifa joriy mahalliy tarmoq oqimi orqali oʻtadi Iroha 3 qo ' llab
O'z navbatida, ushbu ko'rsatkichlar to'g'risidagi ma'lumotlarni o'rnatish kerak bo'ladi.

## 1. Mahalliy ko'p tengdoshlar tarmog'ini yaratish {#_1-generate-a-local-multi-peer-network}

Toʻrtta tengli lokal tarmoqni joriydan hosil qilish Kagami kod:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Ishlab chiqarish direktoriyasida tenglashtirilgan tengdoshlar konfiguratsiyasi mavjud, `genesis.json`,
`genesis.signed.nrt`, `client.toml`, va yordamchilarning nusxalari.

Mahalliy tutun sinovlari uchun ishlab chiqarilgan tengdoshlarni to'g'ridan-to'g'ri boshlash:

```bash
./localnet/start.sh
```

Konteynerlashtirilgan ishga tushirish uchun bir xil lokalnet direktoriyasidan Compose hosil qiling:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

Andoza hosil qilingan toʻplam quyidagilarni aks ettiradi:

- tengdoshlar P2P portlar `1337` to `1340`
- Torii HTTP portlar `8080` to `8083`
- tayyor mijoz konfiguratsiyasi `./localnet/client.toml`

## 2. Tarmoqni ishga tushirishni tekshiring {#_2-verify-that-the-network-is-up}

Birinchi tenglamada holat oxirgi nuqtani tekshiring:

```bash
curl http://127.0.0.1:8080/status
```

Dastlabki sog'liqni saqlash tekshiruvlarida quyidagilar ham ishlatiladi:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Siz darhol CLI paketli mijoz konfiguratsiyasida:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Profil {#_3-nexus-profile}

Repozitoriya shuningdek , SORA Nexus-ma'lumotlar ro'yxati
`defaults/nexus/`.

O'z tengdoshlari bilan yurish Nexus profil:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

Foydalanish `defaults/nexus/client.toml` uchun CLI ushbu profilga kirish.

## 4. Mahalliy tarmoqni to'xtatish {#_4-stop-the-local-network}

Yerli ishlab chiqarilgan lokal tarmoq uchun:

```bash
./localnet/stop.sh
```

Ishlab chiqarilgan Compose to'plam uchun:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

Tarmoq ishga tushgandan so'ng,
[Operatsiya qilish Iroha 3 orqali CLI](/uz/get-started/operate-iroha-via-cli.md).
