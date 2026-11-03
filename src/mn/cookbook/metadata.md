---
translation_locale: mn
translation_source: /cookbook/metadata.md
translation_source_hash: 88298912f083d79a9fdfe5e8d0a89d49acb97d814d3871db0c874cb40db5342b
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Метадата {#metadata}

## Үр дүн {#outcome}

Taira дээрх метадатыг уншиж, төлбөрөө тодорхой заасан гүйлгээгээр дансны нэг метадатын утгыг тохируулж, баталгаажуулаад, утгыг дахин устгана. Та блокчэйн дэвтрийн объектын метадатыг гүйлгээний метадатаас тусад нь байлгана.

## Өмнөх шаардлага {#prerequisites}

- `curl`, `jq`, Python 3.11 эсвэл дараа хувилбар, мөн одоогийн `iroha` CLI.
- [Taira-д холбогдох](./connect-to-taira.md) хэсгээс авсан, санхүүжүүлсэн `taira.client.toml`.
- зорилтот дансны метадатад эрх олгох гол. Жишээ нь тохируулсан эрх олгох голийг өөрөө чиглүүлдэг; өөр данс нь яг зөв зөвшөөрлийг шаарддаг.

## Алхамууд {#steps}

### 1. Криптографийн гарын үсэггүйгээр метадатаг унших {#_1-read-metadata-without-a-signer}

Мета өгөгдөл нь `Name`-аас JSON утгад холбосон шалгагдсан зураглал. Хоосон зураглал ба шүүлтүүрийн хоосон гаралт хүчинтэй.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[]
    | select((.metadata // {} | length) > 0)
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

Стандарт оролтоос уншсан JSON нь дансны `cookbook_profile` утга болно. `--metadata <file>`-аар хавсаргадаг гүйлгээний метадата нь гүйлгээний өгөгдлийн сав дээрх тусдаа зураглал бөгөөд төлбөрийг хэзээ ч сонгодоггүй: үүнийг `--fee-payer` болон CLI-ийн яг төлбөрийн үнийн санал гүйцэтгэдэг бөгөөд `gas_asset_id`, `gas_limit` эсвэл `fee_sponsor` түлхүүр агуулсан гүйлгээний метадатыг клиент хүлээн авахаас татгалздаг.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI нь гарын үсэг зурахаас өмнө яг төлбөрийг Taira-ийн төлбөрийн хөрөнгөөр тооцоолж, үнийн санал гаргаад, дараа нь гүйлгээг илгээж, буцахаасаа өмнө Applied эцсийн байдлыг хүлээдэг.

::: warning Өөрт олгосон зөвшөөрлийн хязгаар

Объект бүрийг хэн өөрчилж болохыг идэвхтэй гүйцэтгэгч шийддэг. Өөр дансыг шинэчлэхэд ихэвчлэн `CanModifyAccountMetadata` шаардлагатай; домэйн, хөрөнгийн тодорхойлолт, NFTs болон триггерүүд тус бүр өөрийн зорилтот объектод зориулсан метадатын зөвшөөрөлтэй. Хэрэв Taira шаардлагатай эрх мэдлийг олгоогүй бол ижил дансны командуудыг `./localnet/client.toml`-оор ажиллуулж, үүсгэсэн localnet-ийн эрх бүхий дансны каноник I105 ID-г орлуулна. Локал төлбөр төлөгчийг тодорхой сонгосон хэвээр үлдээ.

:::

### 4. Түлхүүрийг ав {#_4-remove-the-key}

Эхлээд эцэслэгдсэн утгыг уншиж, дараа нь тусдаа устгах гүйлгээг илгээнэ үү.

```bash
iroha --config ./taira.client.toml --machine account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python програмуудын хувьд таарах төрөлжүүлсэн барилгачид нь `Instruction.set_account_key_value` ба `Instruction.remove_account_key_value` юм; тэдгээрийг гүйлгээний метадата болон [Python сургалт](/mn/guide/tutorials/python.md#shared-setup)-оос авсан хүлээх туслахтай хамт илгээгээрэй.

## Баталгаажуулах {#verify}

Тогтоосон гүйлгээний дараа, `meta get` нь `version: 1`-той объект буцаах ёстой. Устгасны дараа шууд хайлт нь дахин утга буцаах ёсгүй:

```bash
iroha --config ./taira.client.toml --machine account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine account meta get \
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

- [Тодорхойлсон эх кодын хувилбарт мета өгөгдлийн лавлагааны нэгдсэн туршилтууд](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/queries/metadata.rs)
- [Python SDK батлагдсан эх кодын хувилбар дээрх гүйлгээний бүтээгчид](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/README.md)
- [Метадата](/mn/blockchain/metadata.md)
- [Мета өгөгдөл ба блокчэйн бүртгэл хадгалах сонголтууд](/mn/guide/configure/metadata-and-store-assets.md)
- [Зааврын лавлагаа](/mn/reference/instructions.md)
- [Өөрт нь зөвшөөрөл олгосон тэмдэглэгээ](/mn/reference/permissions.md)
