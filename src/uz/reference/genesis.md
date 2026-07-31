---
translation_locale: uz
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ibtido haqidagi hikoya {#genesis-reference}

Hozirgi vaqtda Iroha 3 ish oqimi, a `genesis.json` manifest birinchi
Tarmoqni ishga tushirish paytida qo'llaniladigan operatsiyalar va parametrlar.

Tengdoshlarga tarqatilgan imzolangan artefakt Norito-kodlangan `.nrt` fayl
ishlab chiqarilgan `kagami genesis sign`.

## Asosiy maydonlar {#main-fields}

Genesis manifesti quyidagilarni belgilashi mumkin:

- `chain` zanjir identifikatori uchun
- `executor` koʻrsatkichni oʻzgartirish uchun
- `ivm_dir` uchun IVM triggerlar va yangilanishlar tomonidan ishlatiladigan kutubxonalar
- `consensus_mode` manifestida e'lon qilingan boshlang'ich rejim uchun
- `transactions` tartiblangan parametrlarni yangilash, ko'rsatmalar, triggerlar va topologiya uchun
- `crypto` dastlabki kripto fotosurat uchun

Ichkarida `transactions`, topologiya yozuvlari juftlik tenglama identifikatorlari va PoPs birgalikda:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Manifest yarating {#generate-a-manifest}

Foydalanish Kagami Moddiyani yaratish uchun:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Jamoat uchun SORA Nexus ma'lumotlar maydoni, `npos` bu kutilayotgan konsensus rejasi.
Boshqalar Iroha 3 joylashtirishlar maqsadga qarab ruxsat berilgan yoki NPoSdan foydalanishlari mumkin
profil.

## Manifestoga imzo qo'ying {#sign-the-manifest}

tahrirlash va tasdiqlashdan keyin JSON, uni ishga tushirish mumkin bo ' lgan `.nrt` blok:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` manifestdan genesis ommaviy kalitini o'qiydi va foydalanadi
ishga tushirilishi mumkin bo'lgan imzolangan kalit, urug' va algoritmi taqdim etilgan
Natijada tengdoshlar o'z konfigidan murojaat qilishlari kerak bo'lgan fayl paydo bo'ladi.

## Konfiguratsiya `irohad` {#configure-irohad}

Demonni imzolangan genesis blokini koʻrsating:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Bogʻliq vositalar {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Generatorni amalga oshirish va buyruq tafsilotlari uchun
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
