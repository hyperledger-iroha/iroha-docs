---
translation_locale: mn
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` нь стандарт Iroha 3 дундаж даемон юм. Cargo багц нь `irohad` гэж нэрлэгддэг тул эх үүсвэрийн шалгаруулалтаас двойны дуудлагыг:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Олон нийтийн Taira туршилтын сүлжээний хувьд нэвтрүүлгийн зураг нь `iroha3d_taira` ашигладаг. Энэ нь ижил CLI хүлээн зөвшөөрдөг. Энэ нь мөн Taira цуврал, баталгаажуулагч багц, хадгаламжийн тохиролцоо, гүйлгээний хугацааны гарын үсэг зурах түлхүүдийг дагаж мөрдөж байна. Taira конфигурацыг ашиглах цаг хугацааны итгэлийг нээхгүйгээр баталгаажуулах:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Үйлчлүүлэгч нь ашиглахаас өмнө Taira санхүүгийн хувилбарыг илэрхийлэх ёстой. Тавигдсан загвар нь үлгэр жишээ тохируулалттай. Үйлчлөгч нь тухайн үлгэр жишээний тохируулалтыг өөрчилж өгөх ёстой. Taira-ийн эсрэг шинжилгээ хийхэд нийтлэг Nexus эсвэл үйлдвэрлэлийн SoraFS тохируулгыг хэрэглэхгүй байх.

## `--config` {#arg-config}

- Үргэлт: файлын зам
- Нэрлэг: `-c`

[ ижил төстэй конфигурацынд ](/mn/reference/peer-config/index.md) хүрэх зам.

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Үргэлт: файлын зам

Үндсэн ойлголтыг баталгаажуулахын тулд хэрэглэгддэг сонголттой генезисын манифст JSON.

## `--check-config` {#arg-check-config}

Ажиллагдсан конфигурацыг болон ашиглах боломжтой генез материалыг баталгаажуулж, дараа нь сүлжээний сокетыг холбохгүйгээр гарах болно.

## Kagemusha шалгаруулах мөр {#kagemusha-qualification-seals}

Эдгээр файлын замыг сонгох сонголтууд нь `--check-config` шаарддаг бөгөөд Кагемушагийн бүрэн шалгаруулалтыг хуулийн мөртлөө бичэхийн өмнө гүйцэтгэдэг:

- `--write-kagemusha-catalog-qualification-seal <PATH>` нь жагсаалтыг шалгаруулдаг.
- `--write-kagemusha-validator-qualification-seal <PATH>` нь орон нутгийн баталгаажуулагчаар тохируулсан гарын үсэг зурсан сурталчилгааны захиалгыг хангадаг байна.

Хоёр мөрийн сонголт хоорондоо зөрчилдөж байна.

## `--trace-config` {#arg-trace-config}

- Үргэлт: далбаа
- Байгаль орчин: `TRACE_CONFIG`

Конфигурацийн чулууг уншиж, шинжилгээ хийж байх хугацаандаа нөөц тэмдэглэлийг идэвхжүүлэх.

## `--config-blake3` {#arg-config-blake3}

- Үргэлт: 64 тоот шэксэдэцимал BLAKE3 хоолой
- Нөөц: `--config`

Нөхөрлөлийн файлын байт нь нийлүүлсэн дигестэй тохирохыг шаардаарай. Үнэн байдалтай холбогдсон файлыг тайзлах ёстой; энэ нь `extends` -ийг агуулах боломжгүй.

## `--terminal-colors` {#arg-terminal-colors}

- Үргэлт: `--terminal-colors=true` эсвэл `--terminal-colors=false` хэлбэрээр шилжүүлсэн Булейн
- Дашрамд: терминалын чадварыг илрүүлэх
- Байгаль орчин: `TERMINAL_COLORS`

Хяналтын ANSI өнгөтэй гадаргуу.

## `--language` {#arg-language}

- Үргэлж:

Даемон мессежүүдэд ашигладаг системийн хэлийг татан буулгаарай.

## `--sora` {#arg-sora}

- Үргэлт: далбаа
- Байгаль орчин: `IROHA_SORA_PROFILE`

Sora Nexus профилийг идэвхжүүлээрэй. Энэ хувилбар нь SoraFS, SoraNet гарын үсэг хээлт, олон шугамтай санал нэгдлийг тохируулдаг. Та үргэлж Taira шуурхайг энэ зургийн дагуу дуудлаарай.

## FastPQ гарын үсэг {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` болон `--fastpq-poseidon-mode <MODE>` нь зөвхөн `cpu` эсвэл `gpu`-ийг хүлээн зөвшөөрдөг.

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

Жишээ нь:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## Үргэлжүүлсэн тусламж {#generated-help}

Доорх бүрэн өгөгдлийг Iroha эх үүсвэрийн байгуулсан хэсгээс гаргаж байна.

<<< @/snippets/iroha3d-help.md
