---
translation_locale: mn
translation_source: /reference/genesis.md
translation_source_hash: 340921f59a6f8788f559190d520f046ea2473d65154f57a1c54212840c027bc0
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# блокчэйн үүсгэж эхлэх лавлагаа {#genesis-reference}

Одоогийн Iroha 3 ажлын урсгалд, `genesis.json` техникийн тайлан нь сүлжээ эхлэхэд анх хэрэглэгдэх гүйлгээ болон параметрүүдийг тодорхойлдог.

Суудалтай гарын үсэг бүхий объектийг сүлжээний хамтрагчдад тараах нь `kagami genesis sign`-ийн гаргасан Norito кодчилолтой `.nrt` файл юм.

## Гол салбарууд {#main-fields}

Блокчэйн үүсгэлийн техникийн баримт бичиг дараах зүйлийг тодорхойлж болно:

- `chain` гинжийн таних тэмдгийн хувьд
- манифест дэх дансны бичлэгийг кодлох I105 сүлжээний угтварт `chain_discriminant`
- `executor` сонголтоор гүйцэтгэгчийг шинэчлэх баайт код замын хувьд
- `ivm_dir` нь тригер ба шинэчлэлтүүдэд ашиглагддаг IVM сангууд
- `consensus_mode` техникийн тайлбарласан анхны горимд зориулагдсан
- `transactions` захиалгат параметрийн шинэчлэл, заавар, триггер болон топологийн хувьд
- гарын үсэгтэй Sumeragi өндөр бүрийн нөхцөлийн параметрт `sumeragi_context`
- сүлжээний зөвшөөрөх, `allowed_algorithms`-д жагсаасан яг гарын үсэг болон хянагчийн алгоритмуудад `crypto_admission_policy`

`transactions` дотор топологи оруулгууд сүлжээний хамилагчийн ID болон PoPs-ийг хослуулдаг:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Техникийн тунхаглал үүсгэх {#generate-a-manifest}

Kagami ашиглан загвар үүсгэнэ. Зөвшөөрөх алгоритм бүрд `--allowed-signing`-ийг өсөх каноник дарааллаар давтана; Kagami орхисон алгоритмыг өөрөө нэмэхгүй:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 > genesis.json
```

Нийтэд нээлттэй SORA Nexus өгөгдлийн орон зайд хүлээгдэж буй зөвшилцлийн горим нь `npos`. Бусад Iroha 3 байршуулалт зорилтот профайлаас хамааран зөвшөөрөлтэй горим эсвэл NPoS ашиглаж болно.

## Техникийн үзүүлэнг гарын үсэг зурах {#sign-the-manifest}

Засварлаж баталгаажуулсны дараа JSON, энэ нь суулгахад бэлэн болохын тулд гарын үсэг зурах `.nrt` түгжих:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` техник manifest-аас блокчейн genesis нийтийн түлхүүрийг уншиж, эзэмшигчийн эзэмшдэг, нэг холбоостой энгийн файл дахь хувийн түлхүүрийг ашиглан тараах боломжтой гарын үсэгтэй блокыг үүсгэдэг. Файлд нэг л протокол-стандарт хувийн түлхүүрийн олон хүчин хэлбэрийн хэш агуулагдсан байх ёстой бөгөөд үүний дараагаар шинэ мөр орно; Kagami бэлгэдлийн холбоос болон `0600`-ээс өөр горимуудыг татгалздаг. Түүхий хувийн түлхүүрүүдийг тушаалын шугам дээр хүлээж авахгүй. Үр дүн нь сүлжээний хамтрагчид өөрсдийн тохиргооноос иш татаж ашиглах ёстой файл болно.

## `iroha3d`-г тохируулах {#configure-iroha3d}

Үйлчилгээний процесст гарын үсэгтэй эхлэл блок болон хүлээгдэж буй хэшийг нь тогтоосон файлыг заана. `kagami genesis sign --expected-hash-out` тэр файлыг бичих бөгөөд зангилаа анхны болон дахин эхлүүлэхэд үүнийг шаарддаг:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## Холбогдсон хэрэгслүүд {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

Генераторыг хэрэгжүүлэх ба командын дэлгэрэнгүй мэдээллийг [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md)-аас харна уу.
