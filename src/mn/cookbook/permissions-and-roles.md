---
translation_locale: mn
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Зөвшөөрөл болон үүрэг {#permissions-and-roles}

## Үр дүн {#outcome}

Нэг дансанд тодорхой дансны метадатыг шинэчлэх эрх олгодог дүр үүсгэж, үүнийг төлөөлөгчид хуваарилж, төлөөлөгдсөн бичих эрхийг баталгаажуулж, холбогдох төрөлжсөн Rust зааврыг харуулаарай.

## Өмнөх шаардлагууд {#prerequisites}

- [Taira-д холбогдох](./connect-to-taira.md) хэсгээс авсан, санхүүжүүлсэн Taira клиент.
- `TARGET_ACCOUNT` ба `DELEGATE_ACCOUNT` нь ганц протоколын стандарт I105 дансны ID-д тохируулагдсан.
- Гарын үсэг зурж буй данс `CanManageRoles`-ийг эзэмшсэн байх ёстой бөгөөд хүрээтэй зөвшөөрлийг шилжүүлэн олгох чадвартай байх ёстой: тэр нь `TARGET_ACCOUNT` өөрөө, эсвэл тухайн дансны хувьд `CanModifyAccountMetadata`-г аль хэдийн эзэмшдэг. Taira дээр энэ нь зөвшөөрлөөр хязгаарлагдсан удирдлагын үйлдэл юм. Үүсгэсэн localnet-ийн клиент `CanManageRoles`-гүй тул жорд genesis нь үүнийг олгодог сүлжээ хэрэгтэй.

```bash
CONFIG=./taira.client.toml
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Бичихийг батлах үед төлөөлөгчийн хувьд хоёр дахь клиент тохиргоог ашигла.

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Алхамууд {#steps}

### 1. Хоосон үүрэг бүртгэх {#_1-register-an-empty-role}

Төлөв өөрчилдөг CLI команд бүр төлбөр төлөгчийг тодорхой заадаг. CLI нь гарын үсэг зурахаас өмнө яг төлбөрийг Taira-ийн төлбөрийн хөрөнгөөр тооцоолж, үнийн санал гаргадаг.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. Зориулсан дансанд хамаарах зөвшөөрлийг нэмнэ үү {#_2-add-a-permission-scoped-to-the-target-account}

Зөвшөөрлийн токенууд нь JSON төрлийн объектууд юм. Дансийг `payload` дотор I105 ID болгон хадгал; богино нэр нь энэ хатуу талбарт хүчинтэй биш юм.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Төлөөлөгчид үүргийг оноох {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Төлөвүүд ба тэдгээрийн олголт дуусахгүй. Хандалт шаардлагагүй болсон үед тэдгээрийг илтгээр устгана уу.

### 4. Шаардлагатай эрхийн дагуу дасгал хийх {#_4-exercise-the-delegated-permission}

Бичихэд төлөөлөгчийн криптограф гарын үсэг болон хураамжийн үлдэгдлийг ашигла. JSON утгуудыг стандарт оролтоос уншина.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Ижил загварыг Rust клиентүүд ашиглах боломжтой. Энд `client` нь `registrar_account`-ийн нэрээр гарын үсэг зурдаг `iroha::blocking::Client` бөгөөд CLI урсгалд байдаг шиг тэр данс үүргийн анхны эзэмшигч болно. Дансны гурван хувьсагч бүгд аль хэдийн задлан шинжилсэн `AccountId` утгууд юм:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Баталгаажуулах {#verify}

Үүргээр олгосон эрхүүдийг багтаасан, төлөөлөгчийн үйлчилж буй зөвшөөрлүүдийг уншаад, дараа нь төлөөлөгчийн бичсэн яг утгыг унш:

```bash
iroha --config "$CONFIG" --machine account permission list \
  --id "$DELEGATE_ACCOUNT" --all \
  | jq -e --arg account "$TARGET_ACCOUNT" \
    '.items | any(.name == "CanModifyAccountMetadata"
      and .payload.account == $account)'

iroha --config "$CONFIG" account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

Төлөөлөгчийн үйлчилж буй зөвшөөрлүүд `TARGET_ACCOUNT` хүрээтэй `CanModifyAccountMetadata`-г агуулсан байх ёстой бөгөөд метадатын уншилт `"delegated"`-г буцаах ёстой. Torii гарын үсэгтэй асуулгаар үүргийн жагсаалт гаргахаас татгалздаг тул үйлчилж буй зөвшөөрлийн жагсаалт нь оноолтын шалгалт болно.

## Алдааг олох болон засах {#troubleshooting}

- Үүргийг бүртгэх, засах эсвэл оноох үед гарсан `Not permitted` нь гарын үсэг зурагчид шаардлагатай Taira эрх мэдэл байхгүй гэсэн үг. Хүрээтэй токеныг глобал токеноор бүү соль; яг тухайн эрхийн олголтыг хүс.
- Пэйлоуд задлах алдаа нь ихэвчлэн `account` нь `payload`-ийн хажууд байрласан, I105 ID-ийн оронд нэгэн нэршил өгөгдсөн, эсвэл JSON утга хоёр удаа ишлэлд авсан гэсэн үг юм.
- Төлбөрийн татгалзал нь тухайн алхмыг илгээж буй гарын үсэг зурагчид хамаарна. Менежер болон төлөөлөгчийг төлбөрийн үнийн санал бүрт нэрлэгдсэн төлбөрийн хөрөнгөөр тус тусад нь санхүүжүүл.
- Амжилттай үүрэг олголт нь түүний токенууд дээр кодлогдсон хүрээг давж гарахгүй. Энэхүү үүрэг зөвхөн зөвшөөрлийн хэвлэсэн өглөмжид нэрлэгдсэн дансыг л өөрчлөх боломжтой.
- Цэвэрлэхийн тулд эхлээд `account role revoke`, дараа нь `ledger role permission revoke`, эцэст нь `ledger role unregister`-г ажиллуул; тус бүр нь тусдаа бичих үйлдэл бөгөөд `--fee-payer authority`-г агуулсан байх ёстой.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Тогтоосон эх кодын хувилбар дээр үүрэг нэгтгэх туршилтууд](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [Зөвшөөрлийн интеграцын сорилуудыг түгжигдсэн эх кодуудын хувилбар дээр](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [Бүртгэлтэй эх кодын тогтсон хувилбарт суулгасан зөвшөөрлийн өгөгдлийн загвар](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [Зөвшөөрөл болон үүрэг](/mn/blockchain/permissions.md)
- [Зөвшөөрлийн токены лавлах](/mn/reference/permissions.md)
- [Метадата](./metadata.md)
