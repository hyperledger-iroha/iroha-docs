---
translation_locale: mn
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Эхлэл {#genesis}

Женезис нь эхлүүлэх зангилын орчинг тодорхойлж байна. JSON ил тод,
болон Iroha 3 түймэр нь гарын үсэг Norito гүйлгээний файл.

::: details Үндсэн хуулийн генезисийн тэмдэг

<<< @/snippets/genesis.json

:::

## Файлууд {#files}

Үндэсний эргэлтийн хадгаламж нь `defaults/genesis.json`.
Kagami- үүсгэсэн сүлжээ нь өөрийн гэсэн манифст болон гарын үсэг зурсан гүйлгээг
гарааны жагсаалтыг:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Өргөдсөн `README.md` Энэ захиалгаар тод файлуудыг бүртгэж ,
сонгогдсон профилийн команд.

## Эрдэмтэд өрсөлдөх {#peer-configuration}

Хөдөлмөрийн салбарт гарын үсэг зурсан генезис гүйлгээг `[genesis]` бүлэг
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Хүлжээний бүх хамтын ажиллагааны гишүүд гарын үсэг зурсан генезисийн гүйлгээ,
Женезис олон нийтийн гол.

## Эхлэлд тэмдэглэсэн {#signing-genesis}

Хэрэв та манифстийг гарын үсэгээр зохицуулаад байгаа бол хамтын ажиллагааг эхлүүлэхээс өмнө үүнийг баталгаажуулж, гарын үсгийнх:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

НПОС эсвэл Nexus Profiles, топологи болон BLS Хуультай байдлын гэрчилгээ
үүсгэсэн профилээс шаарддаг. Kagami `localnet`, `wizard`, болон хувилбар
Тухайн мэдээллийг генерацийн команд нь автоматгаар шийдвэрлэнэ.

## Женезийг дахин эхлүүлнэ {#recommitting-genesis}

Шинэ генезийг шинээр шалгахын тулд
нэг удаа хэрэглэх локаль сүлжээ, дутагдлыг зогсоож, үүсгэсэн төрийн захиалгыг арилгаж,
Шинэ гарын үсэг зурсан генезисээс эхлэх.
холбооны системийн үйл ажиллагааг явуулж байгаа бол бүх баталгаажуулагч ижил шилжилтийг зохицуулдаггүй.
