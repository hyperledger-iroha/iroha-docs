---
translation_locale: mn
translation_source: /cookbook/metadata.md
translation_source_hash: 238595124cd0a1b71900020d650fb208f844e051d2db4427801fe6405ff591c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Мэдээлэл мэдээлэл {#metadata}

## Үр дүн {#outcome}

Metadata-ыг уншина уу Taira, нэг дансны метадэтгэрийн үнэ цэнийг тогтоож шалгах цалин төлөх транзакцын явдлын дагуу дахин үнэ цэнийг татан буулгах. Та транзакцын төлбөрийн метабараасаа томоохон объектын метабараа тусгаарлан хадгална.

## Урьдчилсан шаардлага {#prerequisites}

- `curl`, `jq`, Python 3.11 болон дараагийн тоног төхөөрөмж `iroha` CLI.
- [ээс санхүүжүүлсэн `taira.client.toml` болон `taira.tx-metadata.json` нь Taira-д холбогдсон ](./connect-to-taira.md).
- Зохион бүртгэлийн метадэтгэрийн эрх мэдэл. Жишээ нь, тохируулсан эрх мэдлийг зорилтот болгодог; өөр нэг бүртгэлэд тодорхой зөвшөөрөл шаарддаг.

## Хадгалт {#steps}

### 1. Метэдэтыг гарын үсэг зурагчгүйгээр уншина уу {#_1-read-metadata-without-a-signer}

Metadata нь `Name`-аас JSON-д шалгарсан газрын зураг юм.

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

Жижиг дүрслэх болон индексирүүлэх талбайд метабараа ашиглах. Томоохон ачааллыг номын сангаас гаргаад URI эсвэл SoraFS сүлжээг хадгалахын оронд.

### 2. Зорилгоны тооцоог гаргах {#_2-derive-the-target-account}

Зөвхөн Taira конфигурацын олон нийтийн түлхэгийг уншина уу, үүнийг I105 доменгүй каноникийн хэлбэр рүү шилжүүлээрэй.

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

### 3. нэг JSON үнэ цэнийг байлгана {#_3-set-one-json-value}

JSON нь стандарт өгөгдээс уншсанаар дансны `cookbook_profile` үнэ цэнэ болно. Үүнтэй харьцуулахад, `--metadata ./taira.tx-metadata.json` нь гүйлгээний хүрээнд төлбөрийн талбайг холбодог.

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

CLI нь төлбөр, гарын үсэг зурах, өргөн мэдүүлэх, хүлээх гэсэн хэсгээр дурддаг. Дараагийн үйлдэл энэ үнэ цэнэээс хамааралтай бол `--no-wait` нэмэхгүй.

::: warning Тусгай зөвшөөрлийн хязгаар

Аливаа объектыг шинэчлэх нь `CanModifyAccountMetadata`; домен, хөрөнгийн тодорхойлолт, NFTs болон үүсгэгчд өөрийн гэсэн зорилтот тодорхой метабарааны зөвшөөрөлтэй байдаг. Хэрэв Taira нь шаардлагыг хангасан эрх мэдлийг олгоогүй бол `./localnet/client.toml`-тай ижил тооцооны захиалгыг гүйцэтгэж, үүсгэсэн локаль сүлжээний байгууллагын каноникийн I105 ID -ийг солиод, Taira төлбөрийн метадангийн файлыг устгаарай.

:::

### 4. Тэмцээг гаргах {#_4-remove-the-key}

Эхлээд үүрэг гүйцэтгэсэн үнэлгээг уншина уу, дараа нь тусгай татаж авах гүйлгээг өргөн мэдүүлнэ үү.

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

Python өргөдөлний хувьд тохиромжтой хэвлэлийн бүтээн байгуулагч нь `Instruction.set_account_key_value` болон `Instruction.remove_account_key_value`; тэдгээрийг транзакцын метадэтгэлтэй хамт [Python сургалтын хувилбараас хүлээх туслахтайгаар ирүүлнэ](/mn/guide/tutorials/python.md#shared-setup).

## Бүртгэнэ {#verify}

Нээлттэй бүтээн байгуулалтын дараа `meta get` нь объектыг `version: 1` -тай буцааж өгөх ёстой. Уулгах дараа шууд хайлт нь үнэ цэнийг цаашид буцаахгүй:

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

Тус тусгай бүртгэлийн уншсан нь дутагдаж буй метадэтгэрийн түлхэгийг сүлжээ эсвэл дансны алдаанаас ангижруулдаг. Үйлдвэрлэлийн код нь JSON хэмээх бүхэл бүтэн үнэ цэнийг тохируулан шалгах ёстой.

## Ашигтвортой байдлын асуудал {#troubleshooting}

- Стандарт нэвтрүүлэг нь нэг хүчинтэй JSON үнэ цэнэтэй байх ёстой. Хадгалд JSON дуудлага хэрэгтэй; объектууд болон массивүүд сайн хэлбэрлэгдсэн байх ёстой.
- Metadata түлхүүр нь `Name` үнэ цэнэтэй бөгөөд шинжилгээ хийсний дараа тохиолдлын мэдрэмжтэй байдаг. Схемийн өөрчлөлтийн бүрт хувилбартай түлхүүдийг бий болгохын оронд тогтвортой түлшний үгс хадгалуулъя.
- `--metadata` бол гүйлгээний метабараа; энэ нь номын сангийн объектын метабараа тогтоодоггүй. Эдгээрийг гүйцэтгэхэд тухайн байгууллагын `meta set` дэд команд ашиглана.
- Эртний уншлын дараа амжилттай өргөн мэдүүлэг гаргах нь тархалтын хохирлыг үүсгэж болно. Хэрэглээний эцсийн хугацааг хүлээгээд, дахин өргөн мэдүүлэхээс өмнө асуултыг дахин туршиж үзээрэй.
- Тус зөвшөөрлийн татгалз нь зорилтот объект болон эрх мэдлийн хязгаарыг тодорхойлдог. Орон нутгаар эргэлт хийх эсвэл тоног төхөөрөмжийг хүсэлт гаргах; нэвтрэх хяналтыг салахын тулд хувийн хэрэгслийн өгөгдлийг олон нийтийн метадета талбайд оруулахгүй байх.
- Хувийн түлхүүр, хувийн тодорхойлолт, нэвтрэх токен, эсвэл том баримтыг метадэтгээр хэзээ ч хадгалахгүй.

## Эх сурвалж, холбогдох баримт бичгүүд {#source-and-related-docs}

- [Metadata хайлтын интеграцийн туршилтууд pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs) дээр
- [Python SDK гүйлгээний бүтээн байгуулагчид тасралтгүй үүрэг гүйцэтгэгчдэд ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Metadata](/mn/blockchain/metadata.md)
- [Metadata болон томоохон бүртгэлийн хадгаламжийн сонголт](/mn/guide/configure/metadata-and-store-assets.md)
- [Судалгааны сэнслэл](/mn/reference/instructions.md)
- [Тусгай зөвшөөрлийн токенүүд](/mn/reference/permissions.md)
