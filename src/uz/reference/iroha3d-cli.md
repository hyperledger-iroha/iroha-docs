---
translation_locale: uz
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` standart Iroha 3 tarmoq peer dæmonidir. Cargo paketi `irohad` deb nomlangan, shuning uchun binarni manba-kod ishlash nusxasidan quyidagicha chaqiring:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Jamoat Taira testnet uchun, chiqarilgan tasvir `iroha3d_taira` ni ishlatadi. U bir xil CLI ni qabul qiladi, lekin qo'shimcha ravishda kanonikni ham majburlaydi Taira zanjir, validator, saqlash va ish vaqti imzolovchi profili. Dasturiy bajarish muhitining litsenziyalari ochilmasdan Taira konfiguratsiyasini quyidagicha tekshiring:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Bitta protokol-standart Taira profiling operator tomonidan taqdim etilgan shaklini ishlating; tekshirilgan shablon hali ham joylashtirish joylarini o‘z ichiga oladi. Taira ga nisbatan sinov o‘tkazishda umumiy Nexus yoki ishlab chiqarish SoraFS sozlamalarini almashtirmang.

## `--config` {#arg-config}

- Turi: fayl yo'li
- Taxallus: `-c`

[tarmoq tengdosh konfiguratsiyasi](/uz/reference/peer-config/index.md) ga yo‘l.

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Tur: fayl yo‘li

Majburiy bo‘lmagan blokcheyn genesi manifesti JSON konsensusni tasdiqlash uchun ishlatiladi.

## `--check-config` {#arg-check-config}

Hal qilingan konfiguratsiyani va mavjud blokcheyn genesis materialini tekshiring, so‘ng tarmoq soketlariga bog‘lamasdan chiqib keting.

## Kagemusha malaka muhrlari {#kagemusha-qualification-seals}

Ushbu fayl-yo‘l parametrlariga `--check-config` talab qilinadi va bitta protokol-standart muhri yozishdan oldin to‘liq Kagemusha malakasidan o‘tishni talab qiladi:

- `--write-kagemusha-catalog-qualification-seal <PATH>` katalogni tasdiqlaydi.
- `--write-kagemusha-validator-qualification-seal <PATH>` mahalliy validatorni sozlangan imzolangan targ‘ibot rezervatsiyasiga qarshi tasdiqlaydi.

Ikkala muhr variantlari bir-biriga zid keladi.

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

Sora Nexus profilini yoqing, bu SoraFS tomonidan ishlatiladi, SoraNet qo‘l siqish va ko‘p yo‘lakli konsensus. Taira ishga tushirgichi har doim ushbu bayroq bilan chaqiriladi.

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

Yuqoridagi parametrlar xulosasi joriy `iroha3d` argument ta'riflariga nisbatan tekshirilgan. Tekshirilgan holda yaratilgan yordam nuqtai nazari ma'lumotlar ko'rinishi, uning kelib chiqishi holati kutish rejimida bo'lgani sababli, ataylab ko‘rsatilmaydi. Checkoutingiz uchun aniq yordamni ko‘rish uchun quyidagini bajaring:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
