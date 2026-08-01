---
translation_locale: mn
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Женезийн өгүүлэл {#genesis-reference}

Одоогийн Iroha 3 ажлын урсгалд `genesis.json` манфист нь сүлжээг эхлүүлэх үед хэрэглэх анхны гүйлгээ, параметрүүдийг тодорхойлж байна.

Norito-ийн кодтой `.nrt` файл нь `kagami genesis sign` үйлдвэрлэсэн гарын үсэг зурсан артефакт юм.

## Үндсэн талбар {#main-fields}

Женезисийн манифест тодорхойлох боломжтой:

- `chain` сүлжээний тодруулгын хувьд
- `executor` сонголттой гүйцэтгэгч шинэчлэлийн байткод замыг
- `ivm_dir` нь IVM номын сангийн үйл ажиллагааг эхлүүлэх болон шинэчлэл хийхэд ашигладаг
- `consensus_mode` анхан шатны хэв маягт зарласан
- `transactions` нь параметр шинэчлэл, заавар, хөдөлгөөн үүсгэгчид болон топологийн дараалалтай
- `crypto` эхлүүлэх крипто урсгалын хувьд

`transactions` дотроо топологийн бүртгэлүүд нь өрсөлдөгчийн ID болон PoPs-ийн хамтдаа:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Үргэлж гаргах {#generate-a-manifest}

Kagami -ийг ашиглан загварыг бүтээх:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Олон нийтийн SORA Nexus өгөгдлийн орон зайд, `npos` бол хүлээгдсэн тохиролцооны хэв маяг юм. бусад Iroha 3 нэвтрүүлэгүүд нь зорилтын профилийн дагуу зөвшөөрөлтэй эсвэл NPoS-ийг ашиглаж болно.

## Бүртгэлд гарын үсэг зурна {#sign-the-manifest}

JSON-ийг зохицуулж, баталгаажуулсан дараа ашиглах боломжтой `.nrt` блок руу гарын үсэг зур:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` нь генезисийн олон нийтийн түлхүүрг манифестээс уншдаг бөгөөд нэвтрүүлэх боломжтой гарын үсэг зурсан блок үйлдвэрлэхэд зориулсан хувийн түлх, үр тариа, алгоритмыг ашиглаж байна.

## `irohad` тохируулалт {#configure-irohad}

Даемонг гарын үсэг зурсан Женезисийн блок руу чиглүүлж:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Үүнтэй холбоотой хэрэгсэл {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Женерарын хэрэгжилт, командлалтын дэлгэрэнгүй мэдээллийг [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md) хаягаар үзнэ үү.
