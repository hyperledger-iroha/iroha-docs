---
translation_locale: uz
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` standart Iroha 3 tengdosh demonidir. Cargo paketi `irohad` nomi bilan nomlanadi, shuning uchun ilova hisobidan ikkilamchiga murojaat qiling:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Jamoat uchun Taira testnetda chiqarilgan rasmda `iroha3d_taira` ishlatiladi. O'sha CLI ni qabul qiladi. Shuningdek, u kanonik Taira zanjirini, tasdiqlovchi setni, saqlash sozlamalarini va ishga tushirish vaqtini imzolash kalitlarini qo'llaydi. Taira konfiguratsiyasini ishga tushirish vaqti ma'lumotlarini ochmasdan tasdiqlang:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Operator foydalanishdan oldin Taira kanonik profilini taqdim etishi kerak. Kiritilganvorada namuna sozlamalari mavjud. Operator har bir namuna moslamasini almashtirishi kerak. Taira ga nisbatan sinov o'tkazishda umumiy Nexus yoki ishlab chiqarish SoraFS parametrlaridan foydalanmang.

## `--config` {#arg-config}

- Fayl turi: fayl yoʻli
- Alias: `-c`

[ tenglamchi konfiguratsiyasiga yo'l ](/uz/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Fayl turi: fayl yoʻli

Konsensusni tasdiqlash uchun ishlatiladigan fakultativ genesis manifest JSON.

## `--check-config` {#arg-check-config}

Xalos qilingan konfiguratsiyani va mavjud genesis materialini tasdiqlang, so'ngra tarmoq socketlarini bog'lamasdan chiqing.

## Kagemusha malaka to'plamlari {#kagemusha-qualification-seals}

Ushbu fayl yo'li variantlari `--check-config` talab qiladi va kanonik muhrni yozishdan oldin to'liq Kagemusha kvalifikatsiyasini amalga oshiradi:

- `--write-kagemusha-catalog-qualification-seal <PATH>` katalogni tasdiqlaydi.
- `--write-kagemusha-validator-qualification-seal <PATH>` mahalliy tasdiqlash vositasini konfiguratsiya qilingan imzolangan reklama rezervassiyasi uchun kvalifikatsiyalaydi.

Ikkala muhr variantlari bir-biri bilan ziddiyatga uchraydi.

## `--trace-config` {#arg-trace-config}

- Tur: bayroq
- atrof-muhit: `TRACE_CONFIG`

Konfiguratsiya qatlamlari o'qib, tahlil qilinayotganda iz loglarini yoqing.

## `--config-blake3` {#arg-config-blake3}

- Tur: 64 raqamli hexadecimal BLAKE3 o'chirish
- Talablar: `--config`

Konfiguratsiya fayli bytlari taqdim etilgan digest bilan mos kelishini talab qiling. Integritetga bog'liq faylni tekislash kerak; u `extends` ni o'z ichiga olmaydi.

## `--terminal-colors` {#arg-terminal-colors}

- Tur: Boolean, `--terminal-colors=true` yoki `--terminal-colors=false` sifatida o'tkazilgan
- Andoza: terminal imkoniyatlarini aniqlash
- atrof-muhit: `TERMINAL_COLORS`

Kontrol ANSI rangli chiqindi.

## `--language` {#arg-language}

- Tovush turi: sim

Daemon xabarlari uchun ishlatiladigan tizim tilini bekor qiling.

## `--sora` {#arg-sora}

- Tur: bayroq
- atrof-muhit: `IROHA_SORA_PROFILE`

Sora Nexus profilini yoqing. Ushbu profilda SoraFS, SoraNet qo'lquv va ko'p yo'nalishdagi konsensus sozlanadi. Har doim Taira ishga tushiruvchini shu bayroq bilan chaqiring.

## FastPQ o'z kuchini yo'qotadi {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` va `--fastpq-poseidon-mode <MODE>` faqat `cpu` yoki `gpu` ni qabul qiladilar. Qolgan variantlar telemetriya yorliqlarini bekor qiladi:

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

## Ishlab chiqarilgan yordam {#generated-help}

Quyida keltirilgan to'liq chiqindi Iroha nishonlangan manba qo'mitidan hosil qilinadi.

<<< @/snippets/iroha3d-help.md
