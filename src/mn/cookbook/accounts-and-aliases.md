---
translation_locale: mn
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Данс болон Нэрүүд {#accounts-and-aliases}

## Үр дүн {#outcome}

Богино нэргүй нэг протоколын стандарт I105 дансны ID-тай аюулгүй ажиллаж, `treasury@payments.universal` гэх мэт тусдаа холбогдсон хүний уншихад ээлтэй нэрсийг ашиглана. Та Taira дансуудыг шалгаж, өөрийн нэг протоколын стандарт ID-г гаргаж, маршрутчиллын нөхцөл байдал болон танигдахыг андууруулахгүйгээр нэрсийг шийдвэрлэнэ.

## Өмнөх шаардлагууд {#prerequisites}

- `curl`, `jq`, Python 3.11 эсвэл дараа хувилбар, мөн одоогийн `iroha` CLI.
- Өөрийн акаунтыг шалгаж байх үед [Taira-д холбогдох](./connect-to-taira.md)-аас `taira.client.toml` гарсан.
- Данс нь данс тусгай унших үйлдэл амжилттай болохоос өмнө Taira тестнет санхүүжүүлэлтийн үйлчилгээ эсвэл сүлжээний удирдлагатай нэвтрэх замаар бүртгэгдсэн байна.

## Алхамууд {#steps}

### 1. Taira дээр нэг протокол-стандарт дансуудыг шалгах {#_1-inspect-canonical-accounts-on-taira}

Нийтийн дансны жагсаалт үргэлж нэг протоколын стандарт I105 ID-г буцаадаг. Гол овогтой нэр нь сонголттой бөгөөд тусад нь тайлагнадаг.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

`.id`-аас авсан ID нь хатуу дансны талбарт хүчинтэй. Үүнд домайн нэмбэж болохгүй. `.primary_alias`-аас авсан нэр буюу alias нь хэрэглэгчдэд зориулсан хайлтын түлхүүр бөгөөд өөр нэг протокол стандартын танигч биш.

### 2. Таны Taira I105 ID-г гаргаж, хэвийн хэмжээнд оруулна уу {#_2-derive-and-normalize-your-taira-i105-id}

Орон нутгийн тохиргооноос зөвхөн нийтийн түлхүүрийг уншина уу. Нийтийн нэг түлхүүрийг янз бүрийн олон нийтийн блокчэйн сүлжээний профайлд өөрөөр кодлодог тул `taira`-ыг тодорхой зааж сонгоно уу.

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

Энэ хэвийн утга нь `TAIRA_ACCOUNT_ID` -той ижил байх ёстой. TOML файлын `[account].domain` тохиргоо нь `wonderland.universal` байж болно, гэхдээ энэ утга нь зөвхөн чиглүүлэлт болон давхар нэрийн контекстэд нөлөөлдөг.

### 3. Данс болон түүний хөрөнгийг унш {#_3-read-the-account-and-its-assets}

Данс бүртгэгдсэний дараа түүнийг шууд асууж, хязгаарлагдмал хөрөнгийн хуудсыг жагсаана уу. URL-г I105 утгыг замд ашиглахын өмнө кодлоорой.

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

### 4. Дансанд холбогдсон өөр нэрсийг харах {#_4-look-up-aliases-bound-to-the-account}

Эсрэг шийдвэрлэгч нь нэг яг нэг протокол-стандарт дансны ID-г хүлээн авдаг. Нийтийн өгөгдлийн сангийн мөрүүдийг хүсэлт гарын үсгийн толгойгүйгээр уншиж болно; хязгаарлагдмал өгөгдлийн сангуудад зөвшөөрсөн гарын үсэг бүхий хүсэлт шаардлагатай.

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

`total: 0` хүчин төгөлдөр: данс нь тусгай нэр (alias) шаардлагагүй. Холболт байгаа тохиолдолд түүний яг бүрэн эрх олгогдсон alias-ийг тодруулж, буцаагдсан дансны ID-тай харьцуулна:

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

::: warning Өөрт олгосон зөвшөөрлийн хязгаар

Taira тестнетийн санхүүжилтийн үйлчилгээ нь өөрийн нэхэмжлэгч дансыг хангаж болно, гэхдээ энэ нь ерөнхий данс бүртгэл хийх буюу нэрийн удирдлагын эрх олгохгүй. Өөр данс бүртгэхэд идэвхтэй баталгаажуулагчийн дор `CanRegisterAccount` шаардлагатай. Дансны хаягууд ерөнхийдөө идэвхтэй SNS түрээс ба тохирох хаягийн зөвшөөрлийг шаарддаг. Засаглалттай нэвтрүүлэх/хаяг төлөвлөгчийг ашиглах эсвэл үүсгэсэн локал сүлжээнд бүртгэлийг давтаж хийх.

:::

Орон нутгийн сүлжээнд, нэг удаагийн аюулгүй криптографийн гарын үсгийн түлхүүрийг хангах алхам шинэ нэг протоколын стандарт `NEW_ACCOUNT_ID`-ыг экспортолсны дараа бүртгэлийн интерфейс нь:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Тохирох хувийн түлхүүрийг баримт бичиг эсвэл програмын сангаас гадуур үүсгэж хадгална уу. Хянагч түлхүүр нь хаягдсан ID-г бүртгүүлэх нь ашиглаж болохгүй дансыг үүсгэнэ.

## Баталгаажуулах {#verify}

Тохиргооны олон нийтийн түлхүүр, I105 кодчилол, мөн овог нэрийг холболт бүгд нэг протоколын стандарт дансны ID дээр нийлж байгааг нотлоно уу:

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

Нэг протокол стандарттай дансны ID-г хадгалах. Гарын үсэг, эрх, гүйлгээний зааварчилгаанд нэг протокол стандарттай ID-г ашиглах. Програмын захад алиасыг тодорхойлох. Үйлдэлд ашигласан нэг протокол стандарттай дансны ID-г хадгалах.

## Алдааг олох болон засах {#troubleshooting}

- Парс эсвэл префиксийн алдаа нь ихэвчлэн хаяг өөр сүлжээний профайлд зориулж кодлогдсон гэсэн үг юм. `--profile taira`-оор нормчлох ба нийцэхгүйг татгалз.
- Faucet `202` буцаасны дараа данс `404` харагдах нь тархалтын саатал байж болно. Бичих үйлдэл илгээхээс өмнө данс эсвэл санхүүжүүлсэн хөрөнгийг давтан шалгана.
- `total: 0` буцах шийдэгчээс гэсэн нь ямар ч харагдах хаяг холбогдоогүй гэсэн утгатай; энэ нь дансны хайлтын алдаа биш юм.
- `401` эсвэл `403` нэрийн маршрут нь хязгаарлагдмал өгөгдлийн орон зай эсвэл хангалтгүй нарийвчилсан шийдвэрлэх эрхийг зааж байна. Уртын өргөн хайлтыг нөөц арга болгон хэрэглэхгүй байх.
- Уншигдахуйц `name@domain.dataspace` утгыг ганц протокол стандартын I105 ID шаардагдах бүх газарт хүлээн авч болохгүй. Эхлээд үүнийг шийд.
- Хэрэв орон нутгийн дансны бүртгэл амжилттай боловч Taira үүнийг татгалзвал, ялгаа нь зөвшөөрөл болно. `CanRegisterAccount`-г аваарай; баталгаажуулалтыг тойрохын тулд дансны ID-г бүү солиорой.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [хавсаргасан эх кодын шинэчлэлт дээрх ганц протокол-стандарт дансны хаягийн хэрэгжилт](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [Данс болон овог Torii нь бэхэлсэн эх кодны хувилбарт туршигдсан](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Данс](/mn/blockchain/accounts.md)
- [Өгөгдлийн загварын хос нэрс](/mn/blockchain/data-model.md#aliases)
- [Нэрлэх заншил](/mn/reference/naming.md)
- [Өөрт нь зөвшөөрөл олгосон тэмдэглэгээ](/mn/reference/permissions.md)
