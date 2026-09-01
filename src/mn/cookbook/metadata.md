---
translation_locale: mn
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Метадата {#metadata}

## Үр дүн {#outcome}

Taira-ын метадатаг уншиж, нэг дансны метадатын утгыг тодорхой төлбөртэй гүйлгээ хийлгэж тохируулж, баталгаажуулж, дахин устгана. Та блокчэйн дэвтэрийн объектийн метадатыг гүйлгээний төлбөрийн метадататай тусгаарласан хэвээр хадгална.

## Өмнөх шаардлага {#prerequisites}

- `curl`, `jq`, Python 3.11 эсвэл дараа хувилбар, мөн одоогийн `iroha` CLI.
- Санхүүжилт авсан `taira.client.toml` ба `taira.tx-metadata.json` нь [Taira-д холбогдох](./connect-to-taira.md)-оос.
- зорилтот дансны метадатад эрх олгох гол. Жишээ нь тохируулсан эрх олгох голийг өөрөө чиглүүлдэг; өөр данс нь яг зөв зөвшөөрлийг шаарддаг.

## Алхамууд {#steps}

### 1. Криптографийн гарын үсэггүйгээр метадатаг унших {#_1-read-metadata-without-a-signer}

Мета өгөгдөл нь `Name`-аас JSON утгад холбосон шалгагдсан зураглал. Хоосон зураглал ба шүүлтүүрийн хоосон гаралт хүчинтэй.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

Мета өгөгдлийг жижиг тайлбар эсвэл индексийн талбарт ашиглана. Том ачааллыг бүртгэлээс гадуур байрлуулж, оронд нь хураангуй, URI эсвэл SoraFS лавлагаа хадгална.

### 2. Зорилтот дансыг гаргана уу {#_2-derive-the-target-account}

Taira тохиргооноос зөвхөн олон нийтийн түлхүүрийг уншиж, үүнийг ганц протокол стандартын домэйнгүй I105 хэлбэрлүү хөрвүүлнэ.

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
```

### 3. Нэг JSON утга тавь {#_3-set-one-json-value}

Стандарт орноос уншигдсан JSON нь дансны `cookbook_profile` утга болдог. Харин `--metadata ./taira.tx-metadata.json` нь гүйлгээний өгөгдлийн саванд шимтгэлийн талбаруудыг хавсаргана. Эдгээр хоёр газрын зураг нь өөр зорилго, зориулалттай.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI төлбөрийг иш татаж, гарын үсэг зураад, илгээж, анхдагчаар хүлээнэ. Дараагийн үйлдэл энэ утгаас хамаарах үед `--no-wait`-ыг битгий нэмээрэй.

::: warning Өөрт олгосон зөвшөөрлийн хязгаар

Идэвхтэй баталгаажуулагч нь ямар объектийг хэн өөрчилж болохыг шийддэг. Өөр дансыг шинэчлэхэд ихэвчлэн `CanModifyAccountMetadata` шаардлагатай; домэйнууд, хөрөнгийн тодорхойлолтууд, NFTs, болон триггерүүд нь өөрийн гэсэн зорилтот тодорхой метадата эрхтэй байдаг. Хэрэв Taira шаардлагатай зөвшөөрлийн эрхийг олгоогүй бол, нэг ижил дансны командыг `./localnet/client.toml` ашиглан ажиллуулж, үүсгэсэн localnet зөвшөөрлийн эрхийн нэг протокол-стандарт I105 ID-г орлуулж, Taira төлбөрийн мета өгөгдлийн файлыг орхино уу. Тодорхой орон нутгийн төлбөр төлөгчийг сонгохыг хадгалаарай.

:::

### 4. Түлхүүрийг ав {#_4-remove-the-key}

Эхлээд эцэслэгдсэн утгыг уншиж, дараа нь тусдаа устгах гүйлгээг илгээнэ үү.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python програмуудын хувьд таарах төрөлжүүлсэн барилгачид нь `Instruction.set_account_key_value` ба `Instruction.remove_account_key_value` юм; тэдгээрийг гүйлгээний метадата болон [Python сургалт](/mn/guide/tutorials/python.md#shared-setup)-оос авсан хүлээх туслахтай хамт илгээгээрэй.

## Баталгаажуулах {#verify}

Тогтоосон гүйлгээний дараа, `meta get` нь `version: 1`-той объект буцаах ёстой. Устгасны дараа шууд хайлт нь дахин утга буцаах ёсгүй:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

Тусдаа дансны уншлага нь сүлжээ эсвэл дансны алдаанаас алга болсон мета өгөгдлийн түлхүүрийг ялгадаг. Үйлдвэрлэлийн код нь үүнийг тохируулахын дараа бүх JSON утгыг мөн шалгах ёстой.

## Алдааг олох болон засах {#troubleshooting}

- Стандарт оруулалт нь нэг хүчин төгөлдөр JSON утга агуулах ёстой. Мөрүүд нь JSON иш татвартай байх ёстой; объект болон массивууд нь зөв бүтэцтэй байх ёстой.
- Метадата түлхүүрүүд нь `Name` утгатай бөгөөд задлан шинжлэсний дараа том жижиг үсэг ялгаатай байдаг. Бүх схемийн өөрчлөлтөд зориулан хувилбарын түлхүүр үүсгэхийн оронд тогтвортой түлхүүрийн үгсийн санг хадгалаарай.
- `--metadata` нь гүйлгээний мета өгөгдөл бөгөөд блокчэйн бүртгэлийн объектын мета өгөгдлийг тогтоодоггүй. Дараагийнхыг хийхэд тухайн объектыг `meta set` дэд командыг ашиглана уу.
- Амжилттай илгээснийг хуучин уншлага дагалдвал дамжих хугацааны саатал болно. Хэрэглэсэн эцсийн байдлыг хүлээгээд, дахин илгээхээсээ өмнө асуултыг дахин туршаарай.
- Зөвшөөрлийг татгалзах нь зорилтот объект болон эрх өгөх голын хязгаарийг тодорхойлдог. Орон нутгийн түвшинд давтлага хийж эсвэл яг тодорхой токеныг хүснэ үү; нууц програмын өгөгдлийг нийтийн мета өгөгдлийн талбарт шилжүүлэхгүй байх нь хандалтын хяналтыг саатуулахгүй байх үүднээс.
- Хувийн түлхүүр, түүхий хувийн таних тэмдэг, нэвтрэх токен эсвэл томоохон баримт бичгийг метадатад хадгалахгүй байх.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Тодорхойлсон эх кодын хувилбарт мета өгөгдлийн лавлагааны нэгдсэн туршилтууд](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK батлагдсан эх кодын хувилбар дээрх гүйлгээний бүтээгчид](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Метадата](/mn/blockchain/metadata.md)
- [Мета өгөгдөл ба блокчэйн бүртгэл хадгалах сонголтууд](/mn/guide/configure/metadata-and-store-assets.md)
- [Зааврын лавлагаа](/mn/reference/instructions.md)
- [Өөрт нь зөвшөөрөл олгосон тэмдэглэгээ](/mn/reference/permissions.md)
