---
translation_locale: mn
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3-г CLI-аар ажиллуулна {#operate-iroha-3-via-cli}

`iroha` хоёртын файл нь Iroha 3 зориулсан командын мөрийн клиент юм. Үүнийг блокчэйн бүртгэлийн төлвийг лавлах, гүйлгээ илгээх, операторын API төгсгөлүүдийг шалгахад ашиглана уу.

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

- `account` данс төвтэй товчлолуудад зориулсан
- `tx` гүйлгээний түвшний туслахуудын төлөө
- `ledger` блокчэйн дэвтэр дээр унших болон бичихэд зориулсан
- `ops` операторын оношлогоонд
- `app` апп API туслахуудын хувьд
- `contract` гэрээ байрлуулах ба техникийн дуудах үйлдлүүдэд
- `tools` оношлогоо болон хөгжүүлэгчийн хэрэгслүүдэд
- `taira` нь Taira ба Nexus-т чиглэсэн ажлын урсгалын хувьд

`ledger` бүлэг нь мөн `ledger transaction` гэсэн домайн тусгай гүйлгээний туслахуудыг агуулдаг.

Хүний уншиж болох операторын гарцыг ашиглахад `--output-format text`, хатуу автоматжуулалтын горимд `--machine` ашиглана уу.

## 3. Олон нийтийн Taira туршилтын сүлжээг туршиж үзнэ үү {#_3-try-the-public-taira-testnet}

Дотоод зангилаа ажиллуулах эсвэл гарын үсэг зурагч үүсгэхээсээ өмнө Taira дээр зөвхөн унших шалгалт хийж болно. Эдгээр команд нийтийн Torii JSON маршрут ашиглах бөгөөд testnet XOR зарцуулахгүй.

Төлөвлөгөө Taira-ийн статусыг шалгах:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` өгөгдлийн сан дахь нийтийн домэйнуудыг жагсаа:

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

`taira.client.toml`-ийг зөвхөн гарын үсэглэсэн командуудыг туршихад бэлэн болсон үедээ үүсгээрэй. Тохиргоо, тестнэт санхүүжүүлэх үйлчилгээ, канарийн урсгалыг үзэхийн тулд [SORA Nexus Датаспэйс-үүдтэй холбогдоно уу](/mn/get-started/sora-nexus-dataspaces.md)-ийг хараарай. Данс тестнэт санхүүжүүлэх үйлчилгээний хураамжийн хөрөнгөөр хангагдаагүй байхад Taira-д бичих командуудыг ажиллуулж болохгүй.

Төлбөр төлдөг аливаа Taira CLI жишээний хувьд, [Тестнет XOR-ийг Taira-оос авна уу](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-аас тестнетийн санхүүжилтийн үйлчилгээний туслахыг `taira_faucet_claim.py` болгон хадгалж, түрүүнд тестнет XOR-ийг авна уу:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Хэрэв тестнет санхүүжилтийн үйлчилгээний таавар эсвэл шаардлагын зам `502` буцаавал хүлээж, дахин оролдоно уу. Энэ нь олон нийтийн тестнетийн боломжийн асуудал бөгөөд дансны түлхүүрүүдийг дахин үүсгэх дохио биш юм.

Тэнцвэр харагдсаны дараа төлбөрийн хөрөнгийн мета өгөгдлийг бичлэгүүдэд хавсаргана:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Үндсэн блокчэйнийн бүртгэлийн тушаалууд {#_4-basic-ledger-commands}

Бүх домейнуудыг жагсаа:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Энгийн домайны үүсгэх нь тунхагласан алиасыг төлөвлөгчийг ашигладаг; `ledger domain` командыг `register` дэд командгүй байдаг. `docs.universal`-д зориулсан нууцгүй `AliasSetupPlanRequestV1` зорилгыг өөрийн SDK эсвэл нэвтрүүлэх үйлчилгээтэйгээр бэлдээд, дараа нь төлөвлөн хэрэгжүүлнэ үү:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Зорилгын програм нь өгөгдлийн сангийн ID, нэг протокол-стандарт эзэмшигчийн данс, түрээслэх хугацаа, одоогийн төлбөр-үнэн зөвлөлт хамгаалагчийг тогтоодог. Төлөвлөгч амьд төлөвийг шалгаж, үүсгэх нарийн атом `EnsureAlias` төлөвлөгөөг буцаадаг. Бусад сүлжээнээс хамгаалагч утгыг гараар хуулж болохгүй.

Энгийн пинг шилжүүлэг илгээнэ үү:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Сүүлд нэмэгдсэн блокыг уншина уу эсвэл блокын үйл явдлуудыг захиална уу:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Операторын командууд {#_5-operator-commands}

Нийтлэг операторын командуудад зөвшөөрөгдсөн програмын гүйцэтгэх орчны түлхүүр хэрэгтэй. Үүнийг `client.toml`-д оруулахгүй байлгаж, зөвхөн эзэмшигчид зориулсан файлыг тодорхой зааж өгөөрэй:

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

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

Хамгийн өндөр ба түгжигдсэн консенсусын кворумын гэрчилгээ:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
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
- [Torii API төгсгөлийн цэгүүд](/mn/reference/torii-endpoints.md)
- [Iroha хоёртын файлуудтай ажиллаж байна](/mn/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

Эх кодын ажлын хуулбараас Markdown тусламжийн бүрэн агшин зургийг дахин үүсгэхдээ дараах командыг ажиллуулна:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
