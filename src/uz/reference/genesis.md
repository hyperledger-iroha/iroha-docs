---
translation_locale: uz
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ibtido haqidagi hikoya {#genesis-reference}

Joriy Iroha 3 ish oqimida `genesis.json` manifestda tarmoq ishga tushganda qo'llaniladigan birinchi operatsiyalar va parametrlar tasvirlangan.

Tengdoshlarga tarqatilgan imzolangan artefakt Norito kodlangan `.nrt` fayli bo'lib, `kagami genesis sign` tomonidan ishlab chiqarilgan.

## Asosiy maydonlar {#main-fields}

Genesis manifestini quyidagilar belgilab qo'yish mumkin:

- `chain` zanjir identifikatori uchun
- `executor` ixtiyoriy ijrochi yangilash bytecode yo'li uchun
- `ivm_dir` uchun IVM kutubxonalari triggerlar va yangilanishlar tomonidan ishlatiladi
- `consensus_mode` manifestda e'lon qilingan dastlabki rejim uchun
- `transactions` tartibdagi parametrlarni yangilash, ko'rsatmalar, triggerlar va topologiya uchun;
- `crypto` dastlabki kripto fotosurat uchun

`transactions` ichida topologiya yozuvlari tengli identifikatorlar va PoPs bilan birgalikda:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Manifest yarating {#generate-a-manifest}

Shablonni yaratish uchun Kagami dan foydalaning:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Umumiy SORA Nexus ma'lumotlar maydonida, `npos` kutilayotgan konsensus rejasi hisoblanadi. Boshqa Iroha 3 ishga tushirishlarda maqsadli profilga qarab ruxsat berilgan yoki NPoS foydalanish mumkin.

## Manifestni imzolash {#sign-the-manifest}

JSON ni tahrirlash va tasdiqlashdan so'ng, uni ishga tushirib bo'ladigan `.nrt` blokga imzolang:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` manifestdan genesis ommaviy kalitini o'qiydi va qo'llanilishi mumkin bo'lgan imzolangan blokni yaratish uchun taqdim etilgan xususiy kalit, urug' va algoritmdan foydalanadi. Natijada tengdoshlar o'z konfigidan murojaat qilishi kerak bo'lgan fayl paydo bo'ladi.

## `irohad` sozlash {#configure-irohad}

Demonni imzolangan genesis blokini koʻrsat:

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

Generatorni amalga oshirish va buyruq tafsilotlari uchun [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md)-ga qarang.
