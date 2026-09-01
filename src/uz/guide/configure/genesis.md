---
translation_locale: uz
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# blokcheyn janesis {#genesis}

blockchain genesis boshlang'ich zanjir holatini belgilaydi. Tahrir qilinadigan manba JSON manifest bo'lib, va Iroha 3 tugun imzolangan Norito tranzaksiya faylini ishlatadi.

::: details Standart blokcheyn boshlang‘ich manifesti

<<< @/snippets/genesis.json

:::

## Fayllar {#files}

Uptream repository `defaults/genesis.json` da standart manifest yuboradi. Kagami tomonidan yaratilgan tarmoqlar o'z manifesti va imzolangan tranzaksiyasini chiqish katalogiga yozadi:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Ushbu katalogda yaratilgan `README.md` tanlangan profil uchun aniq fayllar va ishga tushirish buyruqlarini yozadi.

## tarmoq tengdoshini sozlash {#peer-configuration}

tarmoq tengdoshlar `config.toml` bo‘limidagi `[genesis]` qismida imzolangan blokcheyn boshlang‘ich tranzaksiyasiga ishora qiladi:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Tarmoqdagi barcha tarmoq tengdoshlar imzolangan blokcheyn asosiy tranzaksiyasi va blokcheyn asosiy ochiq kaliti bo‘yicha kelishib olishlari kerak.

## Blokcheynning dastlabki imzolanishi {#signing-genesis}

Manifestni qo‘lda tahrirlasangiz, tugunlarni ishga tushirishdan oldin uni tekshiring va imzolang:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` egasi tomonidan ushlab turiladigan moda-`0600`, bitta protokol-standart xususiy kalitli multihash va yakuniy yangi qatorni o‘z ichiga olgan bitta ulanadigan oddiy fayl bo‘lishi kerak. Kagami ramziy havolalarni rad etadi va buyruq satrida xom blokcheyn boshlang‘ich xususiy kalitni hech qachon qabul qilmaydi.

NPoS yoki Nexus profillari uchun, yaratilgan profil tomonidan talab qilinadigan to‘plam va BLS Ega-Bo‘lish-Dalillari (Proofs-of-Possession) ni qo‘shing. Kagami `localnet`, `wizard` va profil yaratish buyruqlari bu tafsilotlarni avtomatik ravishda boshqaradi.

## Blokcheyn asosini qayta tasdiqlash {#recommitting-genesis}

Tugun boshlang‘ich holatni faqat saqlovi bo‘sh bo‘lsa qabul qiladi. Yangi boshlang‘ich holatni vaqtinchalik mahalliy tarmoqda sinash uchun tugunlarni to‘xtating, yaratilgan holat kataloglarini o‘chiring va yangi imzolangan boshlang‘ich holatdan ishga tushiring. Har bir tasdiqlovchi ayni ko‘chishni muvofiqlashtirmaguncha ishlayotgan tarmoqning boshlang‘ich holatini almashtirmang.
