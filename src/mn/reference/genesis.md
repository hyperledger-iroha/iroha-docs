---
translation_locale: mn
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Эхлэлд бичсэн {#genesis-reference}

Одоогийн байдлаар Iroha 3 ажлын урсгал, `genesis.json` manifest нь анхны
сүлжээг эхлүүлэх үед хэрэглэх гүйлгээ, параметр.

Хэдэн үеийнхэнд тараасан гарын үсэг зурсан артефакт нь Norito- кодлогдсон `.nrt` файл
үйлдвэрлэсэн `kagami genesis sign`.

## Үндсэн талбар {#main-fields}

Женезисийн манифест нь:

- `chain` зангилын тодруулагч
- `executor` сонголттой гүйцэтгэгч шинэчлэл байткодын замыг
- `ivm_dir` . IVM түлхүүр болон шинэчлэлүүдээр ашиглагддаг номын сан
- `consensus_mode` гарын тэмдэгтээр зарласан эхлүүлэх хэлбэр
- `transactions` Параметр шинэчлэл, заавар, триггер болон топологийн дараалал
- `crypto` эхлүүлэх крипто урсгалын хувьд

Дотооддоо `transactions`, Топологийн бүртгэлүүд, PoPs хамтдаа:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Үргэлж гаргах {#generate-a-manifest}

Хэрэглээ Kagami загварыг үүсгэхэд:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Олон нийтэд зориулсан SORA Nexus өгөгдлийн орон зай, `npos` бол хүлээсэн санал нэгдлийн хэв маяг юм.
Бусад Iroha 3 Хөдөлмөрийн хэрэгслийг ашиглах боломжтой
Профиль.

## "Монифест"-д гарын үсэг зурна {#sign-the-manifest}

УИХ-ын гишүүн Б. JSON, нэвтрүүлэх боломжтой `.nrt` Блок:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` нэвтрүүлэгт нийтлэг ач холбогдол бүхий гениз уншдаг
нэвтрүүлэг хийх боломжтой гарын үсэг зурсан хувийн ач холбогдол, үр тариалан, алгоритм
Үр дүн нь өрсөлдөгчдийн конфигураасаа дурдсан файл юм.

## Тодруул `irohad` {#configure-irohad}

Дэммонг гарын үсэг зурсан Женезисийн блок руу чиглүүлэх:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Холбогдсон хэрэгсэл {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Generator-ын хэрэгжилт болон командын дэлгэрэнгүй мэдээллийг
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
