---
translation_locale: uz
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ibtido ma'lumotnomasi {#genesis-reference}

Hozirgi vaqtda Iroha 3 ish jarayoni, a `genesis.json` manifest birinchisini tavsiflaydi
tarmoq ishga tushganda qo'llaniladigan tranzaktsiyalar va parametrlar.

Tengdoshlarga tarqatilgan imzolangan artefakt a Norito-kodlangan `.nrt` fayl
tomonidan ishlab chiqarilgan `kagami genesis sign`.

## Asosiy maydonlar {#main-fields}

Genezis manifestini aniqlash mumkin:

- `chain` zanjir identifikatori uchun
- `executor` ixtiyoriy bajaruvchini yangilash bayt-kod yo'li uchun
- `ivm_dir` uchun IVM triggerlar va yangilanishlar tomonidan ishlatiladigan kutubxonalar
- `consensus_mode` manifest tomonidan e'lon qilingan dastlabki rejim uchun
- `transactions` buyurtma qilingan parametr yangilanishlari, ko'rsatmalar, triggerlar va topologiya uchun
- `crypto` dastlabki kripto surati uchun

Ichida `transactions`, topologiya yozuvlari juftlik identifikatorlari va PoPs birgalikda:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Manifest yaratish {#generate-a-manifest}

Foydalanish Kagami shablonni yaratish uchun:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Jamoat uchun SORA Nexus ma'lumotlar maydoni, `npos` kutilgan konsensus rejimi hisoblanadi.
Boshqa Iroha 3 joylashtirishlar maqsadga qarab ruxsat etilgan yoki NPoS dan foydalanishi mumkin
profil.

## Manifestga imzo cheking {#sign-the-manifest}

Tahrirlash va tasdiqlashdan keyin JSON, uni joylashtiriladigan qurilmaga imzolang `.nrt` blok:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` manifestdan genezis ochiq kalitini o'qiydi va foydalanadi
ishlab chiqarish uchun egasiga tegishli, bitta havolali oddiy fayldan shaxsiy kalit
joylashtiriladigan imzolangan blok.Faylda bitta kanonik shaxsiy kalit bo'lishi kerak
multihash, undan keyin yangi qator; Kagami ramziy havolalarni va boshqa rejimlarni rad etadi
dan `0600`. Xom shaxsiy kalitlar buyruq satrida qabul qilinmaydi.Natija
tengdoshlari o'zlarining konfiguratsiyasiga murojaat qilishlari kerak bo'lgan fayldir.

## Sozlang `iroha3d` {#configure-iroha3d}

Demonni imzolangan genezis blokiga qarating:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Tegishli vositalar {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Generatorni amalga oshirish va buyruq tafsilotlari uchun qarang
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
