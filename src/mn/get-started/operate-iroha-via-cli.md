---
translation_locale: mn
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 5fb7abd4e152ece715a8337e8ef8e75330f634d2a1b26e0c5bd8308f1f3793a9
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Iroha 3-г CLI-аар ажиллуулна {#operate-iroha-3-via-cli}

`iroha` гүйцэтгэх файл нь Iroha 3-ын командын мөрийн үйлчлүүлэгч юм. Бүртгэлийн төлөвийг асуух, гүйлгээ илгээх болон операторын төгсгөлийн цэгийг шалгахад ашиглана.

## 1. Урьдач нөхцөл {#_1-prerequisites}

Эхлээд локал сүлжээг эхлүүлнэ үү:

- [Эхлүүлэх Iroha 3](./launch-iroha.md)

Доорхи жишээнүүд нь [Эхлүүлэх Iroha 3](./launch-iroha.md)-д бүтээгдсэн localnet-аас үүсгэсэн клиент тохиргоог таамаглаж байна:

```bash
./localnet/client.toml
```

## 2. Суурь CLI тохиргоо {#_2-basic-cli-setup}

Дээд түвшний тусламжийг харуулах:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI нь эдгээр дээд түвшний командуудын бүлгүүдэд зохион байгуулагдсан:

- данс унших болон өөрчлөхөд `account`
- нийтлэг шүүлтүүр, хуудаслалттай блок хөтчийн урсгалд `explorer`
- гүйлгээний төлөв болон гүйлгээний туслахуудад `tx`
- `ledger` блокчэйн дэвтэр дээр унших болон бичихэд зориулсан
- өдөөгч унших, бичих болон гүйцэтгэхэд `trigger`
- `ops` операторын оношлогоонд
- `app` апп API туслахуудын хувьд
- гэрээ дуудах, харах болон дотоодод алдаа шинжлэхэд `contract`; байрлуулахдаа `kagami contract deploy` эсвэл `musubi deploy` ашиглана
- `tools` оношлогоо болон хөгжүүлэгчийн хэрэгслүүдэд
- өгөгдлийн орон зайн тодорхойлолтыг төлөвлөх, хэрэгжүүлэх, шалгахад `dataspace`
- Taira оношилгоо болон дансыг анх бэлтгэхэд `taira`
- офлайн кодлогч, тайлан болон оношилгоонд `offline`
- Soracloud хэрэглээний платформын туслахуудад `soracloud`
- SORA Cross-Chain Protocol уншилт, шилжүүлэг болон нотолгоонд `sccp`

Гүйлгээ илгээдэг команд бүр `--fee-payer authority` зэрэг илэрхий шимтгэл төлөгч шаарддаг; CLI гарын үсэг зурахаас өмнө яг шимтгэлийг тооцож харуулна.

Хүний уншиж болох операторын гарцыг ашиглахад `--output-format text`, хатуу автоматжуулалтын горимд `--machine` ашиглана уу.

## 3. Олон нийтийн Taira туршилтын сүлжээг туршиж үзнэ үү {#_3-try-the-public-taira-testnet}

Дотоод зангилаа ажиллуулах эсвэл гарын үсэг зурагч үүсгэхээсээ өмнө Taira дээр зөвхөн унших шалгалт хийж болно. Эдгээр команд нийтийн Torii JSON маршрут ашиглах бөгөөд testnet XOR зарцуулахгүй.

Төлөвлөгөө Taira-ийн статусыг шалгах:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` өгөгдлийн орон зай дахь нийтэд нээлттэй домэйнуудыг жагсаана:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Өмчийн хэдэн тодорхойлолт ба тэдгээрийн одоогийн нийлүүлэлтийг жагсаа:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Хэрэв танд одоогийн `iroha` бинар байгаа бол Taira оношлогооны туслахыг ажиллуулна уу:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Гарын үсэгтэй команд туршихад бэлэн болсон үед л `taira.client.toml` үүсгэнэ. Тохиргоо, туршилтын хөрөнгө авах болон анхан шатны ажиллагааны сорилыг [SORA Nexus өгөгдлийн орон зайд холбогдох](/mn/get-started/sora-nexus-dataspaces.md) хэсгээс үзнэ үү. Данс туршилтын хөрөнгө олгох үйлчилгээний шимтгэлийн хөрөнгөөр санхүүжихээс өмнө Taira дээр бичих команд бүү ажиллуул.

Шимтгэлтэй Taira CLI жишээ бүрийн өмнө [Taira дээр туршилтын XOR авах](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) хэсгийн урьдчилан бэлтгэдэг хөрөнгө авах урсгалаар гарын үсэг зурах дансыг санхүүжүүлээд, үлдэгдлийг шалгана:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Туршилтын хөрөнгө олгох маршрут `502` буцаавал хүлээж, дахин оролдоно. Энэ нь нийтэд нээлттэй туршилтын сүлжээний хүртээмжийн асуудал болохоос дансны түлхүүрийг дахин үүсгэх дохио биш.

Үлдэгдэл харагдсаны дараа бичих үйлдлийг `--fee-payer authority`-тай илгээнэ. CLI гарын үсэг зурахаас өмнө яг шимтгэлийг Taira-гийн шимтгэлийн хөрөнгөөр тооцож харуулна:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. Үндсэн блокчэйнийн бүртгэлийн тушаалууд {#_4-basic-ledger-commands}

Бүх домейнуудыг жагсаа:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

Энгийн домайны үүсгэх нь тунхагласан алиасыг төлөвлөгчийг ашигладаг; `ledger domain` командыг `register` дэд командгүй байдаг. `docs.universal`-д зориулсан нууцгүй `AliasSetupPlanRequestV1` зорилгыг өөрийн SDK эсвэл нэвтрүүлэх үйлчилгээтэйгээр бэлдээд, дараа нь төлөвлөн хэрэгжүүлнэ үү:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Зорилго нь өгөгдлийн орон зайн ID, каноник эзэмшигч данс, түрээсийн хугацаа болон одоогийн үнийн саналын шалгах нөхцөлийг тогтооно. Төлөвлөгч ажиллаж буй төлөвийг шалгаж, илгээх яг атомик `EnsureAlias` төлөвлөгөөг буцаана. Шалгах нөхцөлийн утгуудыг өөр сүлжээнээс гараар бүү хуул.

Энгийн пинг шилжүүлэг илгээнэ үү:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

Сүүлд нэмэгдсэн блокыг уншина уу эсвэл блокын үйл явдлуудыг захиална уу:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Операторын командууд {#_5-operator-commands}

Зөвшилцлийн операторын командууд зөвшөөрлийн жагсаалтад орсон гүйцэтгэлийн түлхүүр шаарддаг. Үүнийг `client.toml`-д бүү хадгал; зөвхөн эзэмшигч нэвтрэх файлыг абсолют замаар дамжуулна:

```bash
: "${OPERATOR_KEY_FILE:=$PWD/secrets/operator.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

Эрх мэдэлгүй ээлж, програм хангамжийн боловсруулалтын урсгал, сонгууль, ба гүйцэтгэлийн эгнээний оношлогоо:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

Батлагдсан зөвшилцлийн эгнээнүүд болон энэ зангилааны ажиллагааны нэгжийн төлөв:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

Сүлжээ дэх зөвшилцлийн параметрууд:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. Дараагийн хаашаа явах вэ {#_6-where-to-go-next}

- [SDK сургалт хичээлүүд](/mn/guide/tutorials/)
- [Torii төгсгөлийн цэгүүд](/mn/reference/torii-endpoints.md)
- [Iroha хоёртын файлуудтай ажиллаж байна](/mn/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

Эх кодын хуулбараас бүтэн Markdown тусламжийн агшин дүрс хэвлэхийн тулд:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
