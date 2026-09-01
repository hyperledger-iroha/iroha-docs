---
translation_locale: mn
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Зөвшөөрөл болон үүрэг {#permissions-and-roles}

## Үр дүн {#outcome}

Нэг дансанд тодорхой дансны метадатыг шинэчлэх эрх олгодог дүр үүсгэж, үүнийг төлөөлөгчид хуваарилж, төлөөлөгдсөн бичих эрхийг баталгаажуулж, холбогдох төрөлжсөн Rust зааврыг харуулаарай.

## Өмнөх шаардлагууд {#prerequisites}

- Санхүүжилт авсан Taira клиент ба [Taira-д холбогдох](./connect-to-taira.md) -аас хураамжийн мета мэдээлэл.
- `TARGET_ACCOUNT` ба `DELEGATE_ACCOUNT` нь ганц протоколын стандарт I105 дансны ID-д тохируулагдсан.
- Баталгаажуулах акаунт нь зорилтот зөвшөөрөл болон үүргүүдийг удирдах эрхтэй байх ёстой. Taira-д энэ нь зөвшөөрлөөр хязгаарлагдсан удирдлагын үйлдэл юм; `CanManageRoles` болон хүрээтэй зөвшөөрлийг олгоход шаардлагатай эрхийг олж ав, эсвэл үүсгэгдсэн локал сүлжээнд жорыг ажиллуул.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
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

Төрлийн өөрчлөлт хийх бүр CLI командыг төлбөр төлөгчийг тодорхой заадаг. Метадат файлууд нь туршилтын сүлжээний санхүүжилтийн үйлчилгээний хариултаас гарч ирсэн одоогийн Taira төлбөрийн хөрөнгийг агуулдаг.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Зориулсан дансанд хамаарах зөвшөөрлийг нэмнэ үү {#_2-add-a-permission-scoped-to-the-target-account}

Зөвшөөрлийн токенууд нь JSON төрлийн объектууд юм. Дансийг `payload` дотор I105 ID болгон хадгал; богино нэр нь энэ хатуу талбарт хүчинтэй биш юм.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Төлөөлөгчид үүргийг оноох {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
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
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Ижил загвар Rust үйлчлүүлэгчдэд хэрэглэх боломжтой. Энд `client` нь `registrar_account` болж гарын үсэг зурна, энэ нь CLI урсгалд байдаг шиг үүргийн анхны эзэмшигч болно. Бүх гурван дансны хувьсагчууд аль хэдийн `AccountId` утгыг задлан шинжилсэн байна:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all_blocking::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Баталгаажуулах {#verify}

Даалгаврын аль алиныг нь жагсаагаад, дараа нь төлөөлөгчийн бичсэн яг утгыг уншина уу:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

Зөвшөөрлийн жагсаалт нь `CanModifyAccountMetadata`-г `TARGET_ACCOUNT` хүрээнд агуулсан байх ёстой, төлөөлөгчийн үүргийн жагсаалт нь `ROLE_ID`-г агуулсан байх ёстой, мөн метадатаг уншихад `"delegated"` буцах ёстой.

## Алдааг олох болон засах {#troubleshooting}

- `Not permitted` бүртгүүлэх, засах эсвэл үүрэг олгох үед криптографийн гарын үсэг зурж буй этгээд нь шаардлагатай Taira эрх бүхий эрх мэдлийн үндэслэлгүй байна гэсэн үг. Хязгаарлагдмал токеныг глобал токеноор сольж болохгүй; зөвшөөрөгдсөн зөвшөөрлийг хүсэх эсвэл localnet-г ашигла.
- Пэйлоуд задлах алдаа нь ихэвчлэн `account` нь `payload`-ийн хажууд байрласан, I105 ID-ийн оронд нэгэн нэршил өгөгдсөн, эсвэл JSON утга хоёр удаа ишлэлд авсан гэсэн үг юм.
- Төлбөр татгалзах нь тухайн алхмыг илгээж буй криптографи гарын үүсгэгчид хамаарна. Менежерийг бие даан санхүүжүүлж, төлөөлөгчийг томилж, усны хангамжаас гаралтай төлбөрийн хөрөнгийн метадатыг хадгал.
- Амжилттай үүрэг олголт нь түүний токенууд дээр кодлогдсон хүрээг давж гарахгүй. Энэхүү үүрэг зөвхөн зөвшөөрлийн хэвлэсэн өглөмжид нэрлэгдсэн дансыг л өөрчлөх боломжтой.
- Цэвэрлэхдээ эхлээд `ledger account role revoke`, дараа нь `ledger role permission revoke`, эцэст нь `ledger role unregister`-г ажиллуулна; тус бүр нь тусдаа бичих үйлдэл бөгөөд `--fee-payer authority` болон төлбөрийн мета өгөгдөл агуулсан байх ёстой.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Тогтоосон эх кодын хувилбар дээр үүрэг нэгтгэх туршилтууд](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Зөвшөөрлийн интеграцын сорилуудыг түгжигдсэн эх кодуудын хувилбар дээр](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Бүртгэлтэй эх кодын тогтсон хувилбарт суулгасан зөвшөөрлийн өгөгдлийн загвар](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [Зөвшөөрөл болон үүрэг](/mn/blockchain/permissions.md)
- [Зөвшөөрлийн токены лавлах](/mn/reference/permissions.md)
- [Метадата](./metadata.md)
