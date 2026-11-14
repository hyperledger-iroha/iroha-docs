---
translation_locale: uz
translation_source: /reference/iroha3d-cli.md
translation_source_hash: 846370e45fe0e0d605016d6722b1d50c39981f954c7d9040b87fc385eb12ac68
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` — standart Iroha 3 tugunining fon xizmati. Cargo paketi `irohad` deb nomlangan, shuning uchun bajariluvchi faylni manba ish nusxasidan quyidagicha chaqiring:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Ochiq Taira sinov tarmog‘i uchun reliz tasviri `iroha3d_taira`dan foydalanadi. U xuddi shu CLI ni qabul qiladi, ammo qo‘shimcha ravishda kanonik Taira zanjiri, tasdiqlovchi, saqlash va bajarish vaqtida imzolovchi profilini majburiy qiladi. Bajarish vaqtidagi maxfiy kirish ma’lumotlarini ochmasdan Taira sozlamasini quyidagicha tekshiring:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Kanonik Taira profilining operator haqiqiy qiymatlarni qo‘ygan shaklidan foydalaning; repozitoriydagi shablonda hali o‘rnatish o‘rinbosarlari bor. Taira bilan sinovda uni umumiy SORA Nexus yoki ishlab chiqarish muhiti SoraFS sozlamalari bilan almashtirmang.

## `--config` {#arg-config}

- Turi: fayl yo'li
- Taxallus: `-c`

[tarmoq tengdosh konfiguratsiyasi](/uz/reference/peer-config/index.md) ga yo‘l.

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Tur: fayl yo‘li

Majburiy bo‘lmagan blokcheyn genesi manifesti JSON konsensusni tasdiqlash uchun ishlatiladi.

## `--check-config` {#arg-check-config}

Hal qilingan konfiguratsiyani va mavjud blokcheyn genesis materialini tekshiring, so‘ng tarmoq soketlariga bog‘lamasdan chiqib keting.

## `--json` {#arg-json}

- **Turi:** flag
- **Talab qiladi:** `--check-config`

`Ready` yoki `Pending` qatori o‘rniga shu build va sozlamaning moslik qiymatlarini bitta Norito JSON obyekti sifatida chop etadi.

## `--check-storage` {#arg-check-storage}

- **Turi:** flag
- **Zid keladi:** `--check-config`

To‘xtatilgan tugunning Kura ombori va eng yangi suratini shu build dekoderlari bilan faqat o‘qish rejimida tekshiradi, natijani bitta Norito JSON obyekti sifatida chop etadi va xatoda noldan farqli kod bilan tugaydi. Tekshiruv Kura ombori ildizi qulfini oladi, shu bois ishlayotgan tugunga tegishli omborni rad etadi. U omborni hech qachon o‘zgartirmaydi va faqat bajarish vaqtiga tegishli sirlarni ochmaydi.

## `--check-replay` {#arg-check-replay}

- **Turi:** flag
- **Zid keladi:** `--check-config`, `--check-storage`

To‘xtatilgan tugun omborining nusxasini shu dasturiy yig‘ilma bilan qayta bajaradi va natijani bitta Norito JSON obyekti sifatida chop etadi. Buyruq bloklarni vaqtinchalik katalogga ko‘chiradi, u yerda eng yangi suratni tiklaydi yoki imzolangan genesisni qayta bajaradi, so‘ng keyingi barcha bloklarni qayta bajaradi. Biror blok o‘z sertifikatlangan natijasini takrorlamasa yoki kerakli blok tanasi yo‘q bo‘lsa, u noldan farqli kod bilan tugaydi; omborga hech qachon yozmaydi va faqat bajarish vaqtiga tegishli sirlarni ochmaydi.

## `--require-genesis-inrou-deployment-authority` {#arg-require-genesis-inrou-deployment-authority}

- **Turi:** hisob ID si
- **Talab qiladi:** `--check-config`

Oflayn tekshiruvda ayni imzolangan genesis bajarilgach shu ro‘yxatdan o‘tgan hisob SoraCloud joylashtirish vakolatini saqlashini talab qiladi.

## `--sumeragi-assert-fresh-key` {#arg-sumeragi-assert-fresh-key}

- **Turi:** flag

Faqat shu yuklashda tugunning konsensus kalitlari bu zanjir uchun hech qachon imzolamaganini tasdiqlaydi. Sumeragi har bir kalit uchun xavfsizlik yozuvini saqlaydi; yozuvsiz, uning yo‘qolmaganiga isbot bo‘lmaguncha hech narsani imzolamaydi. Bu flagni yangi kalitning birinchi ishga tushishida bir marta bering va ma’lumot yo‘qolganidan keyin hech qachon bermang.

## `--trace-config` {#arg-trace-config}

- Tur: bayroq
- Atrof-muhit: `TRACE_CONFIG`

Konfiguratsiya qatlamlari o‘qilgan va tahlil qilinganida izlash jurnalini yoqing.

## `--config-blake3` {#arg-config-blake3}

- Tur: 64-raqamli olti o'nlik BLAKE3 kriptografik hazm qiymati
- Talab qiladi: `--config`

Konfiguratsiya fayli baytlarining taqdim etilgan kriptografik xulosaga mos kelishini talab qiling. Butunlik bilan bog‘langan fayl tekislanishi kerak; u `extends` ni o‘z ichiga ololmaydi.

## `--terminal-colors` {#arg-terminal-colors}

- Tur: Boolean, `--terminal-colors=true` yoki `--terminal-colors=false` sifatida uzatiladi
- Standart: terminal imkoniyatlarini aniqlash
- Atrof-muhit: `TERMINAL_COLORS`

ANSI rangli chiqishni nazorat qiling.

## `--language` {#arg-language}

- Turi: matn

Daemon xabarlari uchun ishlatiladigan tizim tilini ustun qilib qo'ying.

## `--sora` {#arg-sora}

- Tur: bayroq
- Atrof-muhit: `IROHA_SORA_PROFILE`

SoraFS, SoraNet qo‘l siqish protokoli va ko‘p yo‘lakli konsensus ishlatadigan SORA Nexus profilini yoqadi. Taira ishga tushirgichi doim shu flag bilan chaqiriladi.

## FastPQ ustunlik qiladi {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` va `--fastpq-poseidon-mode <MODE>` faqat `cpu` yoki `gpu` ni qabul qiladi. Qolgan variantlar telemetriya yorliqlarini bekor qiladi:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

Masalan:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## Yaratilgan yordam {#generated-help}

Yuqoridagi parametrlar xulosasi belgilangan Iroha commitidagi `iroha3d` argument ta’riflariga mos. Ish nusxangizning aniq yordamini ko‘rish uchun bajaring:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
