---
translation_locale: mn
translation_source: /reference/genesis.md
translation_source_hash: dda17468f39573a1fcf43474351bd01c4fea38e8b603fd4d8b21780b273c8649
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
- `wire_protocol_version` анхны хувилбарын зөвшилцлийн сүлжээн дамжуулалтын протоколын хувилбарын хувьд
- `consensus_fingerprint` зөвшилцлийн параметрүүдийн сонголттой, төрөлжсөн хурууны хээний хувьд; JSON манифестууд үүнийг тодорхой заадаг
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
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

Нийтэд нээлттэй SORA Nexus өгөгдлийн орон зайд хүлээгдэж буй зөвшилцлийн горим нь `npos`. Бусад Iroha 3 байршуулалт зорилтот профайлаас хамааран зөвшөөрөлтэй горим эсвэл NPoS ашиглаж болно.

## Техникийн үзүүлэнг гарын үсэг зурах {#sign-the-manifest}

Засварлаж баталгаажуулсны дараа JSON, энэ нь суулгахад бэлэн болохын тулд гарын үсэг зурах `.nrt` түгжих:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

`kagami genesis sign` нь эзэмшигчийн хадгалдаг, ганц холбоостой энгийн файл доторх хувийн түлхүүрээс genesis-ийн түлхүүрийн хосыг гаргаж аваад, байршуулах боломжтой гарын үсэгтэй блокийг үүсгэнэ. Энэ нь нийтлэгдсэн genesis-ийн нийтийн түлхүүртэй таарахыг шаардахын тулд `--expected-public-key`-ийг дамжуулна уу. Файл нь нэг каноник хувийн түлхүүрийн multihash болон түүний дараах шинэ мөрийг агуулах ёстой; Kagami нь симбол холбоос болон `0600`-аас өөр горимуудыг татгалзана. Түүхий хувийн түлхүүрийг командын мөрөөр хүлээн авахгүй. Үр дүн нь зангилаанууд өөрсдийн тохиргоонд заах ёстой файл юм.

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
