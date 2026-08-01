---
translation_locale: uz
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ishga tushirish Iroha 3 {#launch-iroha-3}

Ushbu sahifa Iroha 3 uchun joriy mahalliy tarmoq oqimi bo'ylab o'tadi, chunki u yuqori tomorqa ombordan andoza ish maydonlari aktivlaridan foydalanadi.

## 1. Mahalliy ko'p tengdoshlar tarmog'ini yaratish {#_1-generate-a-local-multi-peer-network}

Joriy Kagami kodidan to'rt kishilik lokalnetni yaratish:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Ishlab chiqarish direktoriyasida moslashtirilgan tengdosh konfiguratsiyalari `genesis.json`, `genesis.signed.nrt`, `client.toml` va yordamchi skriptlar mavjud.

Mahalliy tutun testini o'tkazish uchun hosil qilingan tengdoshlarni to'g'ridan-to'g'ri boshlash

```bash
./localnet/start.sh
```

Konteynerizatsiya qilingan ishga tushirish uchun bir xil lokalnet direktoriyasidan Compose hosil qiling:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

Andoza hosil qilingan toʻplam quyidagilarni aniqlaydi:

- P2P portlari `1337` dan `1340` gacha
- Torii HTTP portlari `8080` dan `8083`gacha
- `./localnet/client.toml` nomidagi tayyor mijoz konfiguratsiyasi

## 2. Tarmoqni ishga tushirishni tekshirib ko'ring {#_2-verify-that-the-network-is-up}

Birinchi tenglamada holat oxirgi nuqtani tekshiring:

```bash
curl http://127.0.0.1:8080/status
```

Dastlabki tibbiy tekshiruvlarda quyidagilar ham qo'llaniladi:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Siz darhol CLI ni to'plangan mijoz konfiguratsiyasiga ko'rsatishingiz mumkin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus profil {#_3-nexus-profile}

Repozitoriyada SORA Nexus-ga yo'naltirilgan konfig profilini ham `defaults/nexus/` raqamiga yuborish mumkin.

Nexus profilini o'z ichiga olgan mahalliy tenglamani ishlatish uchun:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

Ushbu profilga CLI kirish uchun `defaults/nexus/client.toml` dan foydalaning.

## 4. Mahalliy tarmoqni to'xtatish {#_4-stop-the-local-network}

Yerli ishlab chiqarilgan lokal tarmoq uchun:

```bash
./localnet/stop.sh
```

Ishlab chiqarilgan kompozit to'plam uchun:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

Tarmoq ishlayotganidan so'ng, [da davom eting Iroha 3 orqali CLI](/uz/get-started/operate-iroha-via-cli.md) orqali ishlating.
