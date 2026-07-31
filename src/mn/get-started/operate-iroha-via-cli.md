---
translation_locale: mn
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Хөдөлмөр Iroha 3 дамжуулан CLI {#operate-iroha-3-via-cli}

Хөдөлмөрийн `iroha` бинар нь команд шугамтай үйлчлүүлэгч Iroha 3. Хэрэглэглэхийн тулд
томоохон бүртгэл, гүйлгээ өргөн мэдүүлэх, операторын эцсийн цэгүүдийг шалгах.

## 1.Төрийн шаардлага {#_1-prerequisites}

Хамгийн түрүүнд орон нутгийн сүлжээг эхлүүлэх:

- [Нэвтрүүлэг Iroha 3](./launch-iroha.md)

Доорх жишээ нь локал сүлжээний клиент үүсгэсэн конфигурацийг
үүссэн [Нэвтрүүлэг Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. үндсэн CLI Тоглолт {#_2-basic-cli-setup}

Хамгийн өндөр түвшний тусламж үзүүл:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

Хөдөлмөрийн CLI дараах дээд түвшний командлалтын бүлэгт хуваагддаг:

- `account` бүртгэлийн чиглэлийн товч зам
- `tx` гүйлгээний түвшинд туслах
- `ledger` бүртгэлтэд уншиж, бичдэг
- `ops` ажилчийн оношилгооны хувьд
- `app` хэрэглээнд API туслах
- `contract` гэрээний хэрэгжилт болон дуудлага
- `tools` Диагностик болон хөгжүүлэгчдийн хэрэгслийн хувьд
- `taira` . Taira болон Nexus- чиглэсэн ажлын урсгал

Хөдөлмөрийн `ledger` бүлэг нь мөн доменд зориулсан транзакцийн туслагчдыг багтааж байна:
`ledger transaction`.

Хэрэглээ `--output-format text` Хүний уншдаг үйлдвэрийн хүчин чадал, `--machine`
хатуу автоматжуулалтын хэв маяг.

## 3. Олон нийтийн өмнө үзээрэй Taira Тэсний сүлжээ {#_3-try-the-public-taira-testnet}

Чи зөвхөн уншихад л оролдож болно. Taira орон нутгийн хамтын ажиллагааг явуулах,
Энэ захирамж нь олон нийтийн хэрэглэгддэг Torii JSON замын хөдөлгөөн, туршилтын сүлжээг зарцуулахгүй
XOR.

Хяналт шалгах Taira Эрүүл мэнд:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Олон нийтийн доменийг жагсаалт `universal` мэдээллийн орон зай:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Ашигт малтмалын тодорхойлолт болон тэдгээрийн өнөөгийн хангамжийг жагсаалт:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Хэрэв та одоогийн `iroha` бинар, гүйлгээ Taira диагностикийн туслах:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Бүтээгдэхүүн `taira.client.toml` Зөвхөн гарын үсэг зурсан командыг шалгахад бэлэн байх үед л.
Та үзээрэй. [Сэргэлт SORA Nexus Мэдээллийн газар](/mn/get-started/sora-nexus-dataspaces.md)
Config, faucet, Canary урсгалын хувьд.
Taira Эдгээрийн санхүүжилт

Ямар ч төлбөрийн төлөө Taira CLI Жишээ нь, цахилгаан замын туслах
[Тестнэт аваарай XOR цаашид Taira](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
Үүнд `taira_faucet_claim.py`, Дараа нь эрэлт тестнэт XOR Нэгдүгээрт:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Тэмцээний цогцолбоор эсвэл эрэлт замаар шилжих тохиолдолд `502`, Чамайг дахин туршиж үзээрэй
олон нийтийн тестний сүлжээний хүртээмжтэй холбоотой асуудал биш, дансны түлхүүр сэргээх сигнал.

Хөлбөрийн үлдэгдэл илэрсэнээс хойш төлбөрийн активын метадэтгэлийг хавсралтаар бичнэ:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Эдгээрийн үндсэн команд {#_4-basic-ledger-commands}

Бүх доменийг жагсаалт:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Гадаад доменийг бий болгох нь декларатив псевдопланер ашигладаг `ledger
domain` команд нь байхгүй `register` Гамшгүүргүй тайлан гарга.
`AliasSetupPlanRequestV1` зориулалт `docs.universal` таны SDK эсвэл
бортын үйлчилгээ, дараа нь төлөвлөн хэрэгжүүлнэ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Зохион санаа нь мэдээллийн орон зай ID, хуулийн өмчийн сан, орлогын хугацаа,
Цаг хугацааны хяналт шалгагч нь цахилгаан станцын тоног төхөөрөмжийг баталгаажуулж
атомын `EnsureAlias` Хяналтын үнэлгээг өөрөөс нь гардуулж болохгүй
Хүлжээ.

Энгийн Пинг гүйлгээг хүргүүлнэ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Сүүлийн блок уншина уу эсвэл блокийн үйл явдлыг бүртгэнэ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Үйлчлөгчийн командлал {#_5-operator-commands}

Эдийн засгийн байдал:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

Үргэлтний хойчлал:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

Хөдөлмөр, цуглуулга, RBC хямрал, VRF Урьдчилсан зураг:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

Захиргааны нэгдсэн тохиролцооны параметрүүд:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. Дараа нь хаана явах вэ? {#_6-where-to-go-next}

- [SDK сургалтууд](/mn/guide/tutorials/)
- [Torii төгсгөл](/mn/reference/torii-endpoints.md)
- [Хөдөлмөр эрхлэгч Iroha бинар](/mn/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

Эх сурвалжийн санхүүжилтээс Markdown-ийн бүрэн тусламж үзэл баримтыг сэргээхийн тулд:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
