---
translation_locale: mn
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Taira-т холбогдоно уу {#connect-to-taira}

## Үр дүн {#outcome}

Taira-д хандаж болох эсэхийг баталгаажуулж, локал клиент тохиргооноос ганц протокол-стандарт I105 дансны ID-г гаргаж, криптографын гарын үсэг зурагчийг тестнет XOR-аар санхүүжүүлж, нэг төлбөрийн үнийн санал бүхий канарей гүйлгээг илгээ. Энэхүү жор нь Minamoto-д бичих үйлдлийг огт илгээдэггүй.

## Өмнөх шаардлага {#prerequisites}

- `curl`, `jq`, Python 3.11 эсвэл шинэчилсэн хувилбар, мөн одоогийн `iroha` ба `kagami` бинар файлууд.
- Taira гинж, яг `network_id`, API төгсгөл цэг, дансны профайл болон зориулалтын тестнет түлхүүртэйгээр үүсгэсэн `taira.client.toml`. [Taira клиентийн тохиргоо үүсгэх](/mn/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) зааврыг дагаж, файлыг эх кодын хяналтын системээс гадуур хадгал.
- Faucet-ийн журналд зориулсан, бичих боломжтой ажлын хавтас: `iroha taira account faucet prepare` нь `./taira-faucet`-ийг хувийн хандалттайгаар үүсгэдэг бөгөөд аль хэдийн байгаа хавтсыг солихоос татгалздаг.

## Алхамууд {#steps}

### 1. Амьдралтай байдлыг бэлэн байдлаас салгаж үзэх {#_1-separate-liveness-from-readiness}

`/livez`, `/health` болон `/readyz` нь энгийн текстээр хариулдаг шалгагчид; `/status` нь JSON буцаадаг. Ажиллаж буй зангилаа консенсусын хүлээн авалт эсвэл шаардлагатай өөр дэд систем боломжгүй үед `/readyz`-ээс `503`-ыг зүй ёсоор буцааж болно.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez`-ийг зөвхөн процесс хариу өгч байгаа эсэхийг шийдэхэд ашигла. Траффик хүлээн авах эсэхийг `/readyz`-ээр шийд. Түүний `503` нь саадын дэлгэрэнгүй мэдээлэлгүй `service_unavailable` алдааны хариу бүтэц тул тасалдал гэж үзэхээсээ өмнө доорх оношилгоог ажиллуул.

### 2. Нийтийн оношилгоог ажиллуулна уу {#_2-run-the-public-diagnostics}

Энэ шалгалт зөвхөн унших зориулалттай бөгөөд криптографийн гарын үсэг зурж буй тохиргоог ачаалдаггүй:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Эмч хатуу DNS, TLS гинж, эсвэл API эцсийн цэгийн алдаа мэдээлэх үед бичиж үргэлжлүүлээгүй байх. Дүүрсэн олон нийтийн ээлж түр зуурын шинжтэй; хүлээгээд хязгаарлагдмал бодлоготойгоор дахин оролд.

### 3. Нууцыг хэвлэхгүйгээр Taira дансны ID-г гаргана уу {#_3-derive-the-taira-account-id-without-printing-a-secret}

Тохиргооноос зөвхөн нийтийн түлхүүрийг уншаад, дараа нь Taira I105 профайлаар кодчил. Дансны ID домэйн агуулдаггүй; `[account].profile` нь зөвхөн түүний сүлжээний угтварыг сонгодог.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

Гаралт нь домайнгүй нэг протоколын стандарт I105 хаяг юм. `wallet@payments.universal` гэх мэт нэрс нь овог нэрлэсэн нэр бөгөөд хатуу дансны талбарт ашиглагдахаас өмнө шийдэгдэх ёстой.

### 4. Одоогийн Taira төлбөрийн хөрөнгийг шаардъя {#_4-claim-the-current-taira-fee-asset}

Faucet-ийн бодлого одоогийн төлбөрийн хөрөнгийн тодорхойлолтыг заадаг. Өөр сүлжээ эсвэл хуучин ажиллуулалтаас ID хуулахын оронд түүний Base58 ID-г хадгал. Бодлого нь гарын үсэггүй илрүүлэлтийн өгөгдөл тул автоматжуулалт хариу бүрт итгэхийн оронд хүлээж буй гаргагч, хөрөнгийн тодорхойлолт болон дүнгээ тогтоож бэхлэх ёстой.

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` нь ажлын нотолгооны (proof of work) даалгаврыг шийдэж, гарын үсэг зурсан гүйлгээг яг хэвээр нь хадгалдаг; `submit` нь түүнийг нэг удаа илгээж, хэрэгжсэний дараа буцдаг. Хэрэв `submit` нь `Pending` гэж мэдээлэх эсвэл хугацаа нь хэтэрвэл өөр нэхэмжлэл бэлтгэхийн оронд ижил тохиргоо болон журналаар `taira account faucet resume`-г ажиллуул. Дараа нь үлдэгдлийг хамгийн ихдээ нэг минутын турш давтан шалга.

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

Taira-д хийх бичих үйлдэл бүрт `--fee-payer authority`-г ашигла. Энэ сонголт гарын үсэгт холбогддог бөгөөд CLI нь гарын үсэг зурахаас өмнө яг төлбөрийг Taira-ийн төлбөрийн хөрөнгөөр тооцоолж, үнийн санал гаргадаг.

## Баталгаажуулах {#verify}

Лог зааврыг илгээж, JSON протоколын үр дүнгийн бичлэгийг хадгалаад, Applied эцсийн байдлыг хүлээнэ үү. Мөн `--no-wait`-г орхих нь анхны илгээлтийг баталгаажуулалтыг хүлээхэд хүргэдэг; тодорхой статус уншиж үзэх нь эцсийн програм хангамжийн боловсруулалтын ажлын урсгалын төлөвийг нотолдог.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

Сүүлийн команд нь яг глобал статус төлөвөөс тодорхойлогдсон `Applied` эцсийн байдлыг мэдээлсний дараа л амжилттай болно. Хэшийг туршилтын нотолгоонд хадгал; хувийн түлхүүр эсвэл клиентийн бүрэн тохиргоог үүнтэй хамт хэзээ ч бүү хадгал.

## Алдааг олох болон засах {#troubleshooting}

- `/livez`, `/health` болон `/readyz` нь зөвхөн JSON хүссэн үед `406` буцаадаг, учир нь тэдгээр `text/plain`-ээр хариулдаг. Дээр үзүүлсэн `Accept` толгойнуудыг илгээ.
- `/livez` болон `/status` ажиллаж байхад ч `/readyz` нь `service_unavailable` алдааны хариу бүтэцтэй `503` буцааж болно. Бэлэн болохыг хүлээ эсвэл `iroha taira doctor`-ийг ажиллуул; түлхүүрүүдийг дахин үүсгэх нь зангилааны бэлэн байдлыг өөрчлөхгүй.
- `submit`-ийн үеэр гарсан faucet-ийн `502` эсвэл хугацаа хэтрэлт нь нэхэмжлэлийн үр дүнг тодорхойгүй үлдээдэг: өөр нэхэмжлэл бэлтгэхийн оронд ижил тохиргоо болон журналаар `taira account faucet resume`-г ажиллуул. Хуучирсан ажлын нотолгооны (proof-of-work) зангуу `prepare`-ийг амжилтгүй болгодог; шинэ журналын хавтсанд дахин бэлтгэ.
- A I105 урд талын алдаа нь олон нийтийн түлхүүрийг буруу профилд кодлосон гэсэн үг юм. `iroha tools address convert --profile taira`-ыг дахин ажиллуулна уу.
- Төлбөрийн үнийн саналын татгалзал нь ихэвчлэн эрх бүхий данс санхүүжээгүй, эсвэл тохируулсан `network_id` нь Taira-ийнх биш гэсэн үг. `--fee-payer` дутуу байх, эсвэл `--metadata` дотор `gas_asset_id` зэрэг төлбөрийн түлхүүр байх нь үнийн саналаас өмнө локалаар амжилтгүй болдог.
- Бүртгэл, гаргалт, эсвэл нэрийн сангийн удирдлагыг энэ канарын амжилттай болсон ч дахин татгалзаж болно. Эдгээр үйлдлүүд нь тусдаа програмын гүйцэтгэх орчны зөвшөөрлийг шаарддаг; Taira эрх олгогдоогүй үед үүсгэсэн дотоод сүлжээг дээр тэдгээрийг дасгал хийж турш.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- Тогтоосон commit дахь [Taira CLI-ийн оношилгоо болон канарын эх код](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) болон [faucet-ийн командууд](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs)
- [Тодорхой төлбөрийн сонголт ба CLI илгээх эх сурвалжийг хатгасан эх кодын хувилбараас](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Taira данс болон туршилтын сүлжээний санхүүжилтийн үйлчилгээний гарын авлага](/mn/get-started/sora-nexus-dataspaces.md)
- [Клиент тохиргоо](/mn/guide/configure/client-configuration.md)
- [Гүйлгээ](/mn/blockchain/transactions.md)
