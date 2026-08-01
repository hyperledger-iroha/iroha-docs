---
translation_locale: mn
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: ab8f3bf6d2259dc1ea649273e695429a992108b936475b263fe9d1fae59e8766
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Үйл ажиллагаа явуулах Iroha 3 дамжуулан CLI {#operate-iroha-3-via-cli}

`iroha` бинар нь Iroha 3-ийн команд шугамтай үйлчлүүлэгч юм. Үүнийг томоохон бүртгэлийн байдлын талаар асуухад, гүйлгээг өргөн мэдүүлэхэд болон операторын төгсгөл хэсгийг шалгахад ашиглана.

## 1.Өргөдлийн шаардлага {#_1-prerequisites}

Хамгийн түрүүнд орон нутгийн сүлжээг эхлүүлээрэй:

- [Iroha 3](./launch-iroha.md)

Дараах жишээ нь [Launch Iroha 3](./launch-iroha.md)-д бий болсон локаль сүлжээээс үүссэн үйлчлүүлэгчний конфигурацийг баталгаажуулж байна:

```bash
./localnet/client.toml
```

## 2. үндсэн CLI тохируулалт {#_2-basic-cli-setup}

Хамгийн өндөр түвшний тусламж үзээрэй:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI нь дараах дээд түвшний командлалтын бүлэгүүдэд зохион байгуулагдана:

- `account` бүртгэлийн чиглэлийн товчооны хувьд
- `tx` гүйлгээний түвшинд туслах
- `ledger` номонд бичиж унших
- `ops` үйлдвэрийн хэрэгслийн оношилгооны хувьд
- `app` нь API хэрэглэгчдэд зориулсан
- `contract` гэрээний хэрэгжилт, дуудлага
- `tools` шинжилгээний болон хөгжүүлэгчдийн нэвтрүүлэгт зориулсан
- Taira болон Nexus чиглэсэн ажлын урсгалд зориулсан `taira`

`ledger` бүлэг нь `ledger transaction` гэх мэт доменийн тухайн гүйлгээний туслагчдыг бүрдүүлж байна.

Хүний уншдаг үйлдвэрийн үр дүнг `--output-format text` болон `--machine`-ийг автоматжуулалтын хатуу хэлбэрээр ашиглана.

## 3. Олон нийтийн Taira шалгалтын сүлжээг үзээрэй {#_3-try-the-public-taira-testnet}

Чи зөвхөн уншихыг хичээгээрэй. Taira орон нутгийн хамтын ажиллагааг явуулах эсвэл гарын үсэг зурагч бий болгохын өмнө шалгах. Эдгээр команд нь олон нийтийн Torii JSON замыг ашиглаж, тестнэт зарцуулахгүй XOR.

Taira -ийн байдлыг шалгах:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` өгөгдлийн орон зай дахь олон нийтийн доменийг жагсаалт:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Ашигт малтмалын тодорхойлолт болон тэдгээрийн одоогийн хангамжийг жагсаалт:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Хэрэв та одоогийн `iroha` бинар нь байгаа бол Taira оношилгооны туслах ажиллуул:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

`taira.client.toml` -ийг зөвхөн гарын үсэг зурсан тушаалуудыг шинжилгээ хийхэд бэлэн байх үед л бүтээх. Тэмцэл, кран, канарий урсгалын хувьд [-д холбогдсон SORA Nexus мэдээллийн санг](/mn/get-started/sora-nexus-dataspaces.md) үзнэ үү. Тэсвийг кран төлбөрийн хөрөнгөөр санхүүжүүлэхгүй бол Taira -ийн эсрэг бичиж буй тушаалууудыг ажиллуулахгүй байх.

Ямар ч төлбөрийн төлөө Taira CLI Жишээ нь, крангийн туслах [Тестнет аваарай XOR цаашид Taira](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) тухайн `taira_faucet_claim.py`, цаашлаад шалгалтын сүлжээ XOR Нэгдүгээрт:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Тэмцээний цогцолбоор эсвэл нэхэмжлэлийн замаар `502` ирвэл хүлээх, дахин туршиж үзээрэй. Энэ нь олон нийтийн тест сүлжээний хүртээмжтэй холбоотой асуудал бөгөөд дансны түлхэгийг сэргээхийн сигнал биш юм.

Хөлбөрийн үлдэгдэл илэрсэн дараа төлбөрийн хөрөнгийн метадэтгэлийг хавсралтаар:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Тодруултын үндсэн команд {#_4-basic-ledger-commands}

Бүх доменийн жагсаалт:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Байнгын доменийг бий болгох нь декларатив псевдопланер ашигладаг; `ledger domain` команд нь байхгүй `register` Гүйцэтгэх захиргаа, нууцгүй `AliasSetupPlanRequestV1` зориулалт `docs.universal` таны SDK эсвэл борлуулалтын үйлчилгээ, дараа нь төлөвлөж, хэрэгжүүлнэ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Үндсэн зорилго нь ID өгөгдлийн орон зай, хуулиар заасан эзэмшигч бүртгэл, лизингийн хугацаа, өнөөгийн саналыг хамгаалах . төлөвлөлдөгч амьд байдлыг баталгаажуулдаг бөгөөд өргөн мэдүүлэх тохирсон атомын `EnsureAlias` төлөвлөгөөг буцааж өгдөг. Өөр сүлжээээс хамгаалалтын үнэлгээний гарын нунтаг гаргахгүй.

Энгийн Пинг гүйлгээг хүргүүлнэ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Сүүлийн блок уншина уу эсвэл блокийн үйл явдлыг бүртгэнэ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Үйлчлөгчний командлал {#_5-operator-commands}

Эдийн засгийн байдал:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

Үргэлтийн хугацааны хүйцэл:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

RBC хямрал, цуглуулгач, VRF хямралын зураг:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

Захиргааны нэгдсэн тохиролцооны параметрүүд:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. Дараа нь хаана явах вэ? {#_6-where-to-go-next}

- [SDK сургалтууд](/mn/guide/tutorials/)
- [Torii эцсийн цэгүүд](/mn/reference/torii-endpoints.md)
- [Iroha двойны системүүдтэй ажиллах](/mn/reference/binaries.md)
- [CLI README ](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

Эх сурвалжийн санхүүжилтээс Markdown-ийн бүхэл бүтэн туслалцааны сүүлдээ сэргээхийн тулд:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
