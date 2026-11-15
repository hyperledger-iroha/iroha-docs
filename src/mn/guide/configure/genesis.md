---
translation_locale: mn
translation_source: /guide/configure/genesis.md
translation_source_hash: 2a4a43b6ac873cc0c860631e307e52b047ba6a08691bf3e4c5872cc22c81a0bd
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta+reviewed-first-release-source-amendment
---
# блокчэйн уг эх {#genesis}

блокчэйн эхлэл анхны гинжийн төлвийг тодорхойлно. Засварлах боломжтой эх сурвалж нь JSON техникийн тунхаглал бөгөөд Iroha 3 зангилаа гарын үсэг зурсан Norito гүйлгээний файлыг хэрэглэдэг.

::: details Анхдагч genesis эх загвар (defaults/genesis.template.json)

<<< @/snippets/genesis.json

:::

## Файлууд {#files}

Үндсэн эх кодын сан `defaults/genesis.template.json` дээр анхдагч эх загвар өгдөг. Загвар нь дутуу бөгөөд `kagami genesis materialize` түүнийг манифест болгохоос нааш шалгах, гарын үсэг зурах эсвэл зангилаанд ашиглах боломжгүй. Kagami-гаар үүсгэсэн сүлжээнүүд өөрийн манифест болон гарын үсэгтэй гүйлгээг гаралтын хавтсанд бичнэ:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Тухайн хавтас дахь үүсгэсэн `README.md` нь сонгосон профайлд зориулсан яг ямар файлууд болон эхлүүлэх командуудыг бүртгэдэг.

## сүлжээний хамтрагчийн тохиргоо {#peer-configuration}

Зангилаанууд `config.toml`-ийн `[genesis]` хэсэгт гарын үсэгтэй эхлэл гүйлгээг зааж, хүлээгдэж буй хэшийг нь тусдаа файлд тогтооно:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

Сүлжээний бүх зангилаа гарын үсэгтэй эхлэл гүйлгээ болон эхлэл төлөвийн нийтийн түлхүүр дээр санал нийлэх ёстой. Шинээр эхлэх эсвэл дахин эхлэх аль ч эхлэлд хүлээгдэж буй хэш хэрэгтэй: `expected_hash_file` эсвэл шууд бичсэн `expected_hash`-ийн яг нэгийг нь тохируулна уу. `kagami genesis sign --expected-hash-out` файлыг бичнэ.

## Блокчэйн генезисийг гарын үсэг зурах {#signing-genesis}

Манифестыг гараар зассан бол зангилаануудыг эхлүүлэхээс өмнө шалгаж, гарын үсэг зурна:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` нь эзэндээ хамаарах горим-`0600` байх ёстой бөгөөд нэг протокол-стандартын хувийн түлхүүрийн олон хэш болон төгсгөлийн шинэ мөр агуулах нэг холбоостой энгийн файл байх ёстой. Kagami нь дүрс холбоосыг няцааж, командын мөрөнд цэвэр блокчэйн генезисын хувийн түлхүүрийг огт хүлээж авдаггүй.

Зөвшөөрөлтэй эсвэл NPoS горимын аль ч гарын үсэгтэй genesis нь баталгаажуулагч бүрт BLS эзэмшлийн нотолгоо (Proof-of-Possession) бүхий яг `3f + 1` баталгаажуулагчийн топологийг агуулах ёстой. Kagami-ийн `localnet generate`, `wizard` болон `sora-network generate` командууд эдгээр нарийн зүйлийг автоматаар зохицуулна.

## Блокчейн генезисийг дахин баталгаажуулах {#recommitting-genesis}

Шинэ сүлжээ өөрийн гарын үсэгтэй анхны блокоос эхэлнэ. Түр ашиглах локал сүлжээнд өөр анхны блок туршихын тулд зангилаануудыг зогсоож, тэдгээрийн үүсгэсэн төлөвийн хавтсыг устгаад, шинэ гарын үсэгтэй анхны блокоос эхлүүлнэ. Ажиллаж буй сүлжээ анхны блокийг солихыг шинэчлэлийн механизм болгон хэзээ ч ашиглаж болохгүй. Протоколын тодорхойлолтын өөрчлөлтөд засаглалаар удирдуулсан сонголтын шилжилт болон сонгосон тодорхойлолт, үүрэг хариуцлагад хамаарах шалгуурын баталгаажуулалт шаардлагатай.
