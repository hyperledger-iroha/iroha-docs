---
translation_locale: mn
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` нь стандарт Iroha 3 сүлжээний хөрийн daemon юм. Cargo багцыг `irohad` гэж нэрлэсэн тул эх кодын ажлын хуулбараас бинар файлыг дараах байдлаар дуудах хэрэгтэй:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Олон нийтийн Taira тест сүлжээний хувьд, гаргасан дүрс нь `iroha3d_taira`-ийг ашиглаж байна. Энэ нь адилхан CLI-ийг хүлээн авдаг боловч нэмэлтээр нэг протоколын стандарт хэрэгжүүлдэг Taira гинж, баталгаажуулагч, хадгалах хэсэг, ба гүйцэтгэлийн гарын үсэг профайл. Програмын гүйцэтгэлийн орчны нууц үгийг нээхгүйгээр Taira тохиргоог баталгаажуулна:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Нэг протокол стандартын Taira профайлын оператороор боловсруулсан хувилбарыг ашиглана уу; бүртгэгдсэн загвар нь одоо ч байрлуулах маягтуудыг агуулж байна. Taira-д турших үед ерөнхий Nexus эсвэл үйлдвэрлэлийн SoraFS тохиргоог орлуулж болохгүй.

## `--config` {#arg-config}

- Төрөл: файл зам
- Дэвшүүлсэн нэр: `-c`

[сүлжээний хамтрагчийн тохиргоо](/mn/reference/peer-config/index.md)-рүү зам.

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Төрөл: файлын зам

Консенсус баталгаажуулалтанд ашиглагддаг сонголттой блокчейн үүсгэн байгуулах техникийн баримт бичиг JSON

## `--check-config` {#arg-check-config}

Шийдэгдсэн тохиргоо болон боломжтой блокчэйн genesis материалыг баталгаажуулж, дараа нь сүлжээний сокетуудтай холбохгүйгээр гарах.

## Кагэмуша эрхийн тамга {#kagemusha-qualification-seals}

Эдгээр файл замын сонголтууд нь `--check-config`-г шаарддаг бөгөөд нэг протокол стандартын тамга бичихийн өмнө бүрэн Kagemusha шалгалт явуулдаг:

- `--write-kagemusha-catalog-qualification-seal <PATH>` нь каталогийг баталгаажуулдаг.
- `--write-kagemusha-validator-qualification-seal <PATH>` тохируулагдсан гарын үсэгтэй сурталчилгааны захиалгатай нийцүүлэн орон нутгийн баталгаажуулагчийг шалгадаг.

Эдгээр хоёр битүүмжлэх сонголт хоорондоо зөрчилдөж байна.

## `--trace-config` {#arg-trace-config}

- Төрөл: туг
- Орчин: `TRACE_CONFIG`

Тохиргооны давхаргуудыг уншиж, задлах үед мөрийн бүртгэлүүдийг идэвхжүүлнэ үү.

## `--config-blake3` {#arg-config-blake3}

- Төрөл: 64 оронтой арван зургаа системийн BLAKE3 криптографын дижест утга
- Шаардлагатай: `--config`

Тохиргооны файлын байтуудыг өгөгдсөн криптографийн дижест утгатай нийцэхийг шаарддаг. Интегритэтэд хамааралтай файл нь жигд хэлбэртэй байх ёстой; үүнд `extends` агуулагдаж болохгүй.

## `--terminal-colors` {#arg-terminal-colors}

- Төрөл: Бүлэг утга (Boolean), `--terminal-colors=true` эсвэл `--terminal-colors=false` хэлбэрээр дамжуулна
- Үндсэн: терминалын чадвар илрүүлэх
- Орчин: `TERMINAL_COLORS`

Хяналт ANSI-өнгөтэй гаралт.

## `--language` {#arg-language}

- Төрөл: мөр

Даемон мессежийн хувьд ашиглагдах системийн хэлний тохиргоог давхарлах.

## `--sora` {#arg-sora}

- Төрөл: туг
- Орчин: `IROHA_SORA_PROFILE`

Сора Nexus профайлыг SoraFS хэрэглэгчийн ашиглахад, SoraNet гарын дасан тохиролцоо, олон эгнээний зөвшилцлийг идэвхжүүлнэ. Taira эхлүүлэгч үргэлж энэ тугтайгаар дуудагддаг.

## FastPQ давуу эрхүүд {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` ба `--fastpq-poseidon-mode <MODE>` зөвхөн `cpu` эсвэл `gpu`-ийг хүлээн авна. Үлдсэн сонголтууд нь телеметрийн шошгыг давсан болно:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

Жишээлбэл:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## Үүсгэсэн тусламж {#generated-help}

Дээрх сонголтын товчтой хэсгийг одоогийн `iroha3d` аргументийн тодорхойлолттой харьцуулан баталгаажуулсан. Баталгаажсан үед үүсгэсэн туслах хугацааны өгөгдлийн дүрслэлийг үүсгэх нь санаатайгаар хийгдээгүй байна. Таны шалгасан туслахыг нарийн үзэхийн тулд дараах командыг ажиллуулна уу:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
