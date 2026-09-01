---
translation_locale: mn
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# блокчэйн үүсгэж эхлэх лавлагаа {#genesis-reference}

Одоогийн Iroha 3 ажлын урсгалд, `genesis.json` техникийн тайлан нь сүлжээ эхлэхэд анх хэрэглэгдэх гүйлгээ болон параметрүүдийг тодорхойлдог.

Суудалтай гарын үсэг бүхий объектийг сүлжээний хамтрагчдад тараах нь `kagami genesis sign`-ийн гаргасан Norito кодчилолтой `.nrt` файл юм.

## Гол салбарууд {#main-fields}

Блокчэйн үүсгэлийн техникийн баримт бичиг дараах зүйлийг тодорхойлж болно:

- `chain` гинжийн таних тэмдгийн хувьд
- `executor` сонголтоор гүйцэтгэгчийг шинэчлэх баайт код замын хувьд
- `ivm_dir` нь тригер ба шинэчлэлтүүдэд ашиглагддаг IVM сангууд
- `consensus_mode` техникийн тайлбарласан анхны горимд зориулагдсан
- `transactions` захиалгат параметрийн шинэчлэл, заавар, триггер болон топологийн хувьд
- `crypto` анхны крипто цаг хугацааны төлөв байдалтай мэдээллийн харагдацад

`transactions` дотор топологи оруулгууд сүлжээний хамилагчийн ID болон PoPs-ийг хослуулдаг:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Техникийн тунхаглал үүсгэх {#generate-a-manifest}

Загварыг үүсгэхийн тулд Kagami ашигла:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Нийтийн SORA Nexus датaспэйсийн хувьд, `npos` нь хүлээгдэж буй зөвшлөлттэй горим юм. Бусад Iroha 3 байрлуулалтууд нь зорьсон профайлд нийцүүлэн зөвшөөрөлтэй эсвэл NPoS-г ашиглаж болно.

## Техникийн үзүүлэнг гарын үсэг зурах {#sign-the-manifest}

Засварлаж баталгаажуулсны дараа JSON, энэ нь суулгахад бэлэн болохын тулд гарын үсэг зурах `.nrt` түгжих:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` техник manifest-аас блокчейн genesis нийтийн түлхүүрийг уншиж, эзэмшигчийн эзэмшдэг, нэг холбоостой энгийн файл дахь хувийн түлхүүрийг ашиглан тараах боломжтой гарын үсэгтэй блокыг үүсгэдэг. Файлд нэг л протокол-стандарт хувийн түлхүүрийн олон хүчин хэлбэрийн хэш агуулагдсан байх ёстой бөгөөд үүний дараагаар шинэ мөр орно; Kagami бэлгэдлийн холбоос болон `0600`-ээс өөр горимуудыг татгалздаг. Түүхий хувийн түлхүүрүүдийг тушаалын шугам дээр хүлээж авахгүй. Үр дүн нь сүлжээний хамтрагчид өөрсдийн тохиргооноос иш татаж ашиглах ёстой файл болно.

## `iroha3d`-г тохируулах {#configure-iroha3d}

Демонг гарын үсэгтэй блокчэйн үүсгэлийн блок руу чиглүүл:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Холбогдсон хэрэгслүүд {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Генераторыг хэрэгжүүлэх ба командын дэлгэрэнгүй мэдээллийг [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md)-аас харна уу.
