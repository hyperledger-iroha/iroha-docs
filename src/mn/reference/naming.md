---
translation_locale: mn
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Нэрлэх Ёс Зүй {#naming-conventions}

Та данс, домэйн, эсвэл хөрөнгийг нэрлэхдээ Iroha-д ашиглагддаг дараах дүрмийг санах хэрэгтэй:

1. Тодорхой төрлийн бүтэцэд зориулан ашиглагддаг зарим тодоорх хуваагч тэмдэглэгээ байдаг:

   - `@` дансны нэрийн оронд болон тодорхойлсон данс/нийтлэл түлхүүрийн хэлбэрүүдэд зориулагдсан
   - `#` бол хөрөнгийн тодорхойлолтын орлон нэрүүд ба хөрөнгийн үлдэгдлийн тоон утгуудын хувьд зориулагдсан
   - `::` гэрээний хөших нэрэнд зориулсан
   - `.` нь домайн болон мэдээллийн орон зайн эрхийн баталгаанд зориулагдсан
   - `$` нь `name$domain.dataspace` зэрэг NFT таних тэмдгүүдэд зориулагдсан

2. Нэр хоосон биш, Unicode NFC хэлбэртэй, хамгийн ихдээ 255 UTF-8 байт урттай бөгөөд хоосон зай, удирдлагын болон хоёр чиглэлийн удирдлагын тэмдэгтгүй байх ёстой.

## Энэ урсгалыг Taira-д ажиллуулна уу {#try-it-on-taira}

Олон нийтийн хөрөнгийн овгийг нэг протоколын стандарт хөрөнгийн тодорхойлолт ID болгон шийдээрэй:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Үүнийг хөрөнгийн тодорхойлолтын жагсаалттай харьцуулна уу:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#` тэмдэгт нь хөрөнгийн нэрийн хаяг болон домэйн контекстийг салгаж өгдөг. Хэрэв та санаатайгаар хөрөнгийн нэрийн хаяг эсвэл хөрөнгийн үлдэгдлийг бичиж байгаа бол бусад энгийн нэрэнд бүү ашигла.
