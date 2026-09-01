---
translation_locale: uz
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# blokcheyn genesis manbasi {#genesis-reference}

Joriy Iroha 3 ish jarayonida, `genesis.json` manifest tarmoq ishga tushganda qo'llaniladigan birinchi tranzaksiyalar va parametrlarni tavsiflaydi.

Tarmoq hamkasblariga tarqatilgan imzolangan artefakt `kagami genesis sign` tomonidan ishlab chiqarilgan Norito-kodlangan `.nrt` fayl hisoblanadi.

## Asosiy Sohalar {#main-fields}

Blokcheyn genesis manifesti quyidagilarni belgilashi mumkin:

- `chain` zanjir identifikatori uchun
- `executor` majburiy bo‘lmagan ijrochi yangilash baytkodi yo‘li uchun
- IVM kutubxonalar uchun `ivm_dir`, triggerlar va yangilanishlar tomonidan ishlatiladi
- `consensus_mode` manifestda e'lon qilingan boshlang'ich rejim uchun
- `transactions` buyurtma qilingan parametr yangilanishlari, ko'rsatmalar, triggerlar va topologiya uchun
- `crypto` dastlabki kripto vaqt nuqtasi ma'lumotlari ko‘rinishi uchun

`transactions` ichidagi topologiya yozuvlari tugun identifikatorlarini PoPs bilan juftlaydi:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Manifest yarating {#generate-a-manifest}

Kagami dan shablon yaratish uchun foydalaning:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Jamoat SORA Nexus ma’lumotlar makoni uchun, `npos` kutilayotgan konsensus rejimidir. Boshqa Iroha 3 joylashtirishlar maqsadli profilga qarab ruxsatli yoki NPoS dan foydalanishi mumkin.

## Manifestni imzolash {#sign-the-manifest}

JSON ni tahrirlash va tekshirishdan so‘ng, uni joylashtiriladigan `.nrt` blokiga imzolang:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` manifestdan blokcheynning boshlang‘ich publik kalitini o‘qiydi va foydalanuvchi egasida bo‘lgan, bitta havolali oddiy fayldagi private kalitni ishlatib, ishga tushiriladigan imzolangan blokni yaratadi. Fayl bitta kanonikga mos maxfiy kalitli multihashni o‘z ichiga olishi va keyin yangi qator bilan tugashi shart; Kagami ramziy havolalarni va `0600` dan boshqa rejimlarni rad etadi. Xom maxfiy kalitlar buyruq satrida qabul qilinmaydi. Natija — tarmoq hamkasblari o‘z konfiguratsiyasidan murojaat qilishi kerak bo‘lgan fayl.

## `iroha3d` ni sozlash {#configure-iroha3d}

Daimonni imzolangan blokcheynning boshlang‘ich blokiga yo‘naltiring:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Bog‘liq Vositalar {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Generatorni amalga oshirish va buyruq tafsilotlari uchun [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md) ga qarang.
