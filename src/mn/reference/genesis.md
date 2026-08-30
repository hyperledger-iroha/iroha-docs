---
translation_locale: mn
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Эхлэл ишлэл {#genesis-reference}

Одоогийн байдлаар Iroha 3 ажлын урсгал, a `genesis.json` манифест нь эхнийхийг тайлбарладаг
сүлжээг эхлүүлэх үед хэрэгжих гүйлгээ болон параметрүүд.

Үе тэнгийнхэндээ тараасан гарын үсэгтэй олдвор нь а Norito-кодлогдсон `.nrt` файл
үйлдвэрлэсэн `kagami genesis sign`.

## Үндсэн талбарууд {#main-fields}

Генезисийн манифест нь дараахь зүйлийг тодорхойлж болно.

- `chain` гинжин танигчийн хувьд
- `executor` нэмэлт гүйцэтгэгч шинэчлэх байт кодын замын хувьд
- `ivm_dir` төлөө IVM өдөөгч болон шинэчлэлтүүдийн ашигладаг номын сангууд
- `consensus_mode` манифестээр сурталчилсан анхны горимын хувьд
- `transactions` захиалгат параметрийн шинэчлэлт, зааварчилгаа, триггер, топологийн хувьд
- `crypto` анхны крипто агшин зургийн хувьд

Дотор `transactions`, топологийн оруулгууд хос ids болон PoPs хамтдаа:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Манифест үүсгэх {#generate-a-manifest}

Ашиглах Kagami загвар үүсгэхийн тулд:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Олон нийтийн төлөө SORA Nexus өгөгдлийн орон зай, `npos` хүлээгдэж буй зөвшилцлийн горим юм.
Бусад Iroha 3 байршуулалт нь зорилтот байдлаас хамааран зөвшөөрөгдсөн эсвэл NPoS ашиглаж болно
профайл.

## Манифестт гарын үсэг зурна уу {#sign-the-manifest}

Засаж, баталгаажуулсны дараа JSON, байршуулах боломжтой болгон гарын үсэг зурна уу `.nrt` блок:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` манифестээс генезийн нийтийн түлхүүрийг уншиж, ашигладаг
үүсгэхийн тулд эзэмшигчийн эзэмшдэг, нэг холбоостой ердийн файлын хувийн түлхүүр
байрлуулж болох гарын үсэгтэй блок.Файл нь нэг канон хувийн түлхүүр агуулсан байх ёстой
multihash дараа нь шинэ мөр; Kagami бэлгэдлийн холбоосууд болон бусад горимуудаас татгалздаг
-аас `0600`. Түүхий хувийн түлхүүрүүдийг тушаалын мөрөнд хүлээн авахгүй.Үр дүн
нь үе тэнгийнхэн нь тохиргооноос нь лавлах ёстой файл юм.

## Тохируулах `iroha3d` {#configure-iroha3d}

Гарын үсэг зурсан генезисын блок дээр демоныг чиглүүл:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Холбогдох хэрэгслүүд {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Генераторын хэрэгжилт болон тушаалын дэлгэрэнгүй мэдээллийг үзнэ үү
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
