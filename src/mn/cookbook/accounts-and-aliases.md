---
translation_locale: mn
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 429535e5bb4ad1d3110f29a5b3896c0d3ce39264dbd357fa932fcc2a5f48d0f1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Нягтлан бодох бүртгэл, нууц нэр {#accounts-and-aliases}

## Үр дүн {#outcome}

Доменгүй I105 санхүүгийн IDs болон `treasury@payments.universal` гэх мэт хүн уншиж болох бие даасан холбогдсон нууцаар аюулгүй ажиллана. Та Taira санхүүгийн хяналт шалгаж, өөрийн хуулийн ID санхүүгийг гаргаж, чиглэлийн хүрээг тодорхойлолттай нь харамсалгүйгээр нууцаар шийдвэрлэх болно.

## Урьдчилсан шаардлага {#prerequisites}

- `curl`, `jq`, Python 3.11 болон дараагийн тоног төхөөрөмж `iroha` CLI.
- [аас `taira.client.toml` Хувь сангаа хяналтлахдаа Taira](./connect-to-taira.md)-д холбогдож болно.
- Taira кран эсвэл сүлжээний хяналтын борлуулалтын замаар бүртгэгдсэн дансны санхүүжилт нь тусгайлан бүртгэгдэхээс өмнө амжилттай байх болно гэж хүлээх.

## Хадгалт {#steps}

### 1. Taira-ийн санхүүгийн нягтлан бодох бүртгэлийг шалгаарай {#_1-inspect-canonical-accounts-on-taira}

Нийтийн нягтлан бодох бүртгэлийн жагсаалтад үргэлж I105 IDs гэж дуудаж байна. Анхан шатны нууц нэр нь сонголттой бөгөөд тусгаарлан мэдээлдэг.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

ID нь `.id`-ээс хатуу бүртгэлийн талбайд хүчинтэй. Домен нэмэгдүүлдэггүй. `.primary_alias`-ийн нууц үсэг нь хэрэглэгчдэд чиглэсэн хайлтын түлхүүр бөгөөд өөр нэг хуулиар батлагдсан шинж тэмдэг биш юм.

### 2. Таны Taira I105 ID-ийг олж авч, хэвийн болгох. {#_2-derive-and-normalize-your-taira-i105-id}

Зөвхөн орон нутгийн конфигурацыоноос олон нийтийн түлхэгийг уншина уу. ижил олон нийтийг нь олон нийтиний сүлжээний өөр өөр хувилбаруудад янз бүрийн кодлогддог тул `taira` -ийг тодорхой сонгох.

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

Нормаль үнэлгээ нь `TAIRA_ACCOUNT_ID` -тай ижил байх ёстой. TOML файлын `[account].domain` тохируулалт бол `wonderland.universal` байж болно, гэхдээ энэ үнэ цэнэ зөвхөн замын хөдөлгөөн болон алиасын хүрээнд нөлөөлнө.

### 3. Санхүүжилт болон түүний хөрөнгөг уншина уу {#_3-read-the-account-and-its-assets}

Тодруулсны дараа шууд асууж, хязгаарлагдсан активын хуудсыг жагсаарай. URL - замаар ашиглахаас өмнө I105 үнэ цэнийг кодлуулж байна.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4. Санхүүжилтэд холбогдсон нууц нэрийг хайж үзнэ үү? {#_4-look-up-aliases-bound-to-the-account}

Эргэс шийдвэрлэгч нь нэг тод санхүүгийн бүртгэл ID хүлээн зөвшөөрдөг. Олон нийтийн мэдээллийн хүрээний шугамыг хүсэлтийн гарын үсэг зурах толгойгүйгээр уншиж болно; хязгаарлалттай мэдээллийн хүрээлэнд зөвшөөрөл бүхий гарын үсгийн хүсэлт шаардлагатай.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` нь хүчин төгөлдөр байна: бүртгэлэнд аливаа нууц үсэг хэрэглэх шаардлагагүй. Зэвсэглэлтэй байх үед тухайн бүртгэлийн бүрэн баталгаатай нууц үсийг тодорхойлж, буцаасан бүртгэлд ID харьцуулаарай:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning Тусгай зөвшөөрлийн хязгаар

Taira кран нь бараачдын бүртгэлээ хангах боломжтой боловч энэ нь ерөнхий нягтлан бодох бүртгэлийн эрх мэдлийг олгохгүй байна. Өөр нэг дансыг бүртгэхэд `CanRegisterAccount` нь идэвхтэй баталгаажуулагч дээр байдаг. Хээлийн нууц нэр нь мөн SNS идэвхтэй лизингийн гэрээ, зохистой нууц нэрний зөвшөөрөл шаарддаг. Урьдчилсан борлуулалтын / alias төлөвлөлтийн систем ашиглаж, эсвэл үүсгэсэн орон нутгийн сүлжээний эсрэг бүртгэлийг туршиж үзээрэй.

:::

Орон нутгийн сүлжээнд баталгаатай гарын үсэг зурагч бэлтгэх алхам шинэ Canonical `NEW_ACCOUNT_ID` экспортыг хийсний дараа бүртгэлийн давхар нь:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Үүнд хамааралтай хувийн түлхэгийг баримт бичиг болон хэрэгслийн сангаас гадна бий болгох, хадгалах. ID хяналтын тоног төхөөрөмжийг хаясан бүртгэх нь ашиглах боломжгүй дансыг үүсгэдэг.

## Бүртгэнэ {#verify}

"Config public key", I105 кодируулж, холбох нэр томъёо бүгд нэг санхүүгийн бүртгэл ID дээр нийцсэн гэдгийг баталгаажуулах:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

Хөдөлмөрийн санхүүжилт IDs. Canonical-ийг ашиглах IDs Хууль бичиг, зөвшөөрөл болон гүйлгээний чиглэлд зориулсан . нэвтрүүлэгний хязгаарт нууц нэртэй. ID үйл ажиллагааны тулд ашигласан.

## Ашигтвортой байдлын асуудал {#troubleshooting}

- Пассинг эсвэл префикс алдаа нь ихэнхдээ өөр сүлжээний профилийн хаягийг кодлосон гэсэн үг юм. `--profile taira` -ээр хэвийн болгож, зөрчлийг үгүйсгэнэ.
- `202` гулгалтын дараах `404` тооцоо нь үржихүйн хохирол байж болно. Хэтгэлгээ илгээхийн өмнө дансны болон санхүүжүүлсэн хөрөнгийг шалгаарай.
- `total: 0` нь эргэн шилжих шийдвэрлэгчээс харагдаж буй аливаа нууц үсэг байгуулсангүй гэсэн үг; энэ бол дансны хайлын алдаа биш юм.
- `401` эсвэл `403` нь нууц товчлолтын замаар хязгаарлалттай өгөгдлийн орон зай эсвэл хангалтгүй үнэн зөв шийдвэрлэх зөвшөөрлийг харуулж байна.
- Уншиж болох `name@domain.dataspace` үнэ цэнийг хаана ч хүлээн зөвшөөрөхгүй байна. Каноникийн I105 ID нь шаардагдана.
- Хэрэв орон нутгийн дансны бүртгэл амжилттай болж, Taira үүнийг татгалзаж байгаа бол ялгаа нь зөвшөөрөл юм. `CanRegisterAccount` аваарай; баталгаажуулахыг орхихын тулд ID дансыг өөрчлөх хэрэггүй.

## Эх сурвалж, холбогдох баримт бичгүүд {#source-and-related-docs}

- [Canonical account address implementation at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [Санхүүжилт болон нууц нэр Torii-ийн шинжилгээний товчлолт ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)-д
- [Санхүүжилт](/mn/blockchain/accounts.md)
- [Мэдээллийн загварын нууц нэрүүд](/mn/blockchain/data-model.md#aliases)
- [Нэр дэвшигчдийн конвенц](/mn/reference/naming.md)
- [Тусгай зөвшөөрлийн токенүүд](/mn/reference/permissions.md)
