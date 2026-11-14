---
translation_locale: uz
translation_source: /reference/genesis.md
translation_source_hash: 340921f59a6f8788f559190d520f046ea2473d65154f57a1c54212840c027bc0
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# blokcheyn genesis manbasi {#genesis-reference}

Joriy Iroha 3 ish jarayonida, `genesis.json` manifest tarmoq ishga tushganda qo'llaniladigan birinchi tranzaksiyalar va parametrlarni tavsiflaydi.

Tarmoq hamkasblariga tarqatilgan imzolangan artefakt `kagami genesis sign` tomonidan ishlab chiqarilgan Norito-kodlangan `.nrt` fayl hisoblanadi.

## Asosiy Sohalar {#main-fields}

Blokcheyn genesis manifesti quyidagilarni belgilashi mumkin:

- `chain` zanjir identifikatori uchun
- manifestdagi hisob literallarini kodlaydigan I105 tarmoq prefiksi uchun `chain_discriminant`
- `executor` majburiy bo‘lmagan ijrochi yangilash baytkodi yo‘li uchun
- IVM kutubxonalar uchun `ivm_dir`, triggerlar va yangilanishlar tomonidan ishlatiladi
- `consensus_mode` manifestda e'lon qilingan boshlang'ich rejim uchun
- `transactions` buyurtma qilingan parametr yangilanishlari, ko'rsatmalar, triggerlar va topologiya uchun
- imzolangan Sumeragi balandlik konteksti parametrlari uchun `sumeragi_context`
- zanjir qabul qiladigan, `allowed_algorithms`da sanalgan aniq imzolash va boshqaruvchi algoritmlar uchun `crypto_admission_policy`

`transactions` ichidagi topologiya yozuvlari tugun identifikatorlarini PoPs bilan juftlaydi:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Manifest yarating {#generate-a-manifest}

Shablonni Kagami bilan yarating. Qabul qilinadigan har bir algoritm uchun kanonik o‘sish tartibida `--allowed-signing`ni takrorlang; Kagami tushirib qoldirilgan algoritmlarni to‘ldirmaydi:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 > genesis.json
```

Ochiq SORA Nexus ma’lumotlar makoni uchun kutilgan konsensus rejimi `npos`. Boshqa Iroha 3 o‘rnatmalari maqsad profiliga qarab ruxsatli rejim yoki NPoSdan foydalanishi mumkin.

## Manifestni imzolash {#sign-the-manifest}

JSON ni tahrirlash va tekshirishdan so‘ng, uni joylashtiriladigan `.nrt` blokiga imzolang:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` manifestdan blokcheynning boshlang‘ich publik kalitini o‘qiydi va foydalanuvchi egasida bo‘lgan, bitta havolali oddiy fayldagi private kalitni ishlatib, ishga tushiriladigan imzolangan blokni yaratadi. Fayl bitta kanonikga mos maxfiy kalitli multihashni o‘z ichiga olishi va keyin yangi qator bilan tugashi shart; Kagami ramziy havolalarni va `0600` dan boshqa rejimlarni rad etadi. Xom maxfiy kalitlar buyruq satrida qabul qilinmaydi. Natija — tarmoq hamkasblari o‘z konfiguratsiyasidan murojaat qilishi kerak bo‘lgan fayl.

## `iroha3d` ni sozlash {#configure-iroha3d}

Demonga imzolangan genesis blokini va uning kutilgan xeshini belgilovchi faylni ko‘rsating. `kagami genesis sign --expected-hash-out` shu faylni yozadi, tugun uni dastlabki va qayta ishga tushirishda talab qiladi:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## Bog‘liq Vositalar {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

Generatorni amalga oshirish va buyruq tafsilotlari uchun [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md) ga qarang.
