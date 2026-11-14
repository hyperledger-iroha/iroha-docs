---
translation_locale: uz
translation_source: /guide/configure/genesis.md
translation_source_hash: 2a4a43b6ac873cc0c860631e307e52b047ba6a08691bf3e4c5872cc22c81a0bd
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta+reviewed-first-release-source-amendment
---
# blokcheyn janesis {#genesis}

blockchain genesis boshlang'ich zanjir holatini belgilaydi. Tahrir qilinadigan manba JSON manifest bo'lib, va Iroha 3 tugun imzolangan Norito tranzaksiya faylini ishlatadi.

::: details Standart genezis manba shabloni (defaults/genesis.template.json)

<<< @/snippets/genesis.json

:::

## Fayllar {#files}

Asosiy repozitoriy `defaults/genesis.template.json`da standart manba shablonini yetkazadi. Shablon to‘liq emas: `kagami genesis materialize` uni manifestga aylantirmaguncha uni tekshirish, imzolash yoki tugunda ishlatish mumkin emas. Kagami yaratgan tarmoqlar o‘z manifesti va imzolangan tranzaksiyasini chiqish katalogiga yozadi:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Ushbu katalogda yaratilgan `README.md` tanlangan profil uchun aniq fayllar va ishga tushirish buyruqlarini yozadi.

## tarmoq tengdoshini sozlash {#peer-configuration}

Tengdoshlar `config.toml`ning `[genesis]` bo‘limida imzolangan genesis tranzaksiyasiga ishora qiladi va uning kutilgan xeshini alohida faylda belgilaydi:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

Tarmoqdagi barcha tengdoshlar imzolangan genezis tranzaksiyasi va genezis ochiq kaliti bo‘yicha kelishishi kerak. Har bir ishga tushirish — birinchi marta bo‘ladimi yoki qayta ishga tushirishmi — kutilgan xeshni talab qiladi: `expected_hash_file` yoki konfiguratsiyaga bevosita yozilgan `expected_hash` dan aynan bittasini sozlang. Faylni `kagami genesis sign --expected-hash-out` yozadi.

## Blokcheynning dastlabki imzolanishi {#signing-genesis}

Manifestni qo‘lda tahrirlasangiz, tugunlarni ishga tushirishdan oldin uni tekshiring va imzolang:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` egasi tomonidan ushlab turiladigan moda-`0600`, bitta protokol-standart xususiy kalitli multihash va yakuniy yangi qatorni o‘z ichiga olgan bitta ulanadigan oddiy fayl bo‘lishi kerak. Kagami ramziy havolalarni rad etadi va buyruq satrida xom blokcheyn boshlang‘ich xususiy kalitni hech qachon qabul qilmaydi.

Ruxsatli yoki NPoS bo‘lishidan qat’i nazar, har bir imzolangan genezis har bir validator uchun BLS egalik isboti bilan aniq `3f + 1` validator topologiyasini o‘z ichiga olishi shart. Kagami ning `localnet generate`, `wizard` va `sora-network generate` buyruqlari bu tafsilotlarni avtomatik boshqaradi.

## Blokcheyn asosini qayta tasdiqlash {#recommitting-genesis}

Yangi tarmoq o‘zining imzolangan genezisidan boshlanadi. Vaqtinchalik mahalliy tarmoqda boshqa genezisni sinash uchun tugunlarni to‘xtating, ularning yaratilgan holat katalogini o‘chiring va yangi imzolangan genezisdan ishga tushiring. Ishlayotgan tarmoqda yangilash usuli sifatida genezisni hech qachon almashtirmaslik kerak. Protokol ta’riflarini o‘zgartirish uchun boshqaruv qoidalariga muvofiq tanlov o‘tishlari hamda tanlangan ta’riflar va majburiyatlarning yaroqliligini tekshirish talab etiladi.
