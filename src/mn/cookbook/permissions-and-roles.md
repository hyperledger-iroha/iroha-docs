---
translation_locale: mn
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 734437b8530ad0efb9ddd83b24cb90c30dc29843a03753babd8dca5e86a3f91d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Тусгай зөвшөөрөл, үүрэг {#permissions-and-roles}

## Үр дүн {#outcome}

Нэг дансны тухайн дансны метадэтгэлийг шинэчлэх зөвшөөрөл олгодог үүргийг бий болгож, түүнийг төлөөлөгчэд томилох, төлөөлөгчийн бичиг баримтыг баталгаажуулах, холбогдох Rust товчлолтын заавар үзүүлнэ.

## Урьдчилсан шаардлага {#prerequisites}

- Taira нь санхүүжүүлсэн үйлчлүүлэгч, төлбөрийн метабараа [ээс Taira-д холбох ](./connect-to-taira.md).
- `TARGET_ACCOUNT` болон `DELEGATE_ACCOUNT` Canonical гэж заасан I105 бүртгэл IDs.
- Taira дээр энэ нь зөвшөөрөлтэй захиргааны үйл ажиллагаа юм; `CanManageRoles` болон хүрээний зөвшөөрлийг олгох шаардлагатай эрх баригч байгууллагыг олж авах, эсвэл рецептыг үүсгэсэн орон нутгийн сүлжээгээр ажиллуулах.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Төслийг баталгаажуулахдаа төлөөлөгчийн хувьд хоёр дахь клиент конфигурацийг ашигла:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Хадгалт {#steps}

### 1. Бус үүрэг бүртгүүлэх {#_1-register-an-empty-role}

Төрийн өөрчлөлтийн CLI команд нь төлбөрийг төлөгчөөр тодорхой нэрлэдэг. Метадангийн файл нь одоогийн Taira төлбөрийн ханшийг эзэлдэг бөгөөд энэ нь крантын хариугаас үүдэлтэй байдаг.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Тодорхой зөвшөөрлийг зорилтот дансанд нэмнэ. {#_2-add-a-permission-scoped-to-the-target-account}

зөвшөөрлийн токенүүд нь JSON объектуудыг бичиж байдаг. `payload` доторх дансыг I105 ID гэж хадгалах; энэ хатуу талбайд аливаа нууц нэр хүчингүй юм.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Тус үүргийг төлөөлөгчэд хүлээлгэн өгөх {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Ажлын байр болон тэдгээрийн тэтгэлэг нь дуусдаггүй бөгөөд цаашид ашиглалтын хэрэгцээ шаардлагагүй бол тодорхой хүчингүй болгох.

### 4. Тусгай зөвшөөрлийг хэрэгжүүлнэ {#_4-exercise-the-delegated-permission}

JSON хэмжээнүүд нь стандарт өгөгдлийн дагуу уншиж болно .

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Тухайн загвар нь Rust Хэрэглэгчид. `client` тэмдэгүүд `registrar_account`, Энэ нь тухайн үүргийн анхны эзэн болж, CLI Бүх гурван тооцооны өөрчлөлтүүдийг аль хэдийн шинжилгээ хийсэн байна `AccountId` үнэ цэнэ:

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

## Бүртгэнэ {#verify}

Дараа нь төлөөлөгчийн бичсэн үнэ цэнийг уншина уу:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

Тус зөвшөөрлийн жагсаалтад `CanModifyAccountMetadata` нь `TARGET_ACCOUNT` хэмээх хүрээтэй байх ёстой, төлөөлөгчийн үүргийн жагсаалтанд `ROLE_ID` байх ёстой, уншсан метадэтгэл нь `"delegated"` -ийг буцааж өгөх ёстой.

## Ашигтвортой байдлыг шийдвэрлэх {#troubleshooting}

- `Not permitted` нь үүргийг бүртгүүлэх, зохицуулах эсвэл хуваарилах үед гарын үсэг зурагчдаа шаардагдах Taira эрх мэдэл байхгүй гэсэн үг юм. Токеныг цогц хүрээнд орлуулахгүй; үнэн зөв ханшилт хүсээрэй эсвэл lokalnet ашиглах
- Хөдөлмөрийн ачааны шинжилгээний алдаа нь `account` -ийг `payload` -ийн дэргэд байрлуулж, I105 ID -ийн оронд нэр хүндийг өгсөн эсвэл JSON -ийн үнэнийг хоёр удаа дурдсан гэсэн үг юм.
- Төсвийн татгалз нь тухайн алхамг өргөн мэдүүлсэн гарын үсэг зурсан этгээдэд хамаарна. Захиргааны удирдлагыг санхүүжүүлж, бие даан үүрэг гүйцэтгэж, цөмөрээс үүдэлтэй төлбөрийн хөрөнгийн метабараа хадгалах.
- Үр дүнтэй үүрэг олгох нь түүний токенд кодлогдсон хүрээг давтахгүй. Энэхүү үүрэг зөвхөн зөвшөөрлийн ашиг ачаалалд нэрлэсэн дансыг өөрчилж болно.
- Угаахын тулд `ledger account role revoke`, дараа нь `ledger role permission revoke`, хамгийн сүүлд `ledger role unregister` үйлдээрэй; аль алинд нь тусдаа бичиж байгаа бөгөөд `--fee-payer authority` болон төлбөрийн метабараа багтаасан байх ёстой.

## Эх сурвалж, холбогдох баримт бичгүүд {#source-and-related-docs}

- [Хөдөлмөрийн интеграцын туршилт ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/roles.rs) байгуулсан үүрэг гүйцэтгэх
- [Эрхэм шинжилгээний нэгтгэлийн туршилтууд ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/permissions.rs) байлгасан үүрэг дээр
- [Үндэсний зөвшөөрлийн өгөгдлийн загвар нь pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/permission.rs)
- [Тусгай зөвшөөрөл, үүрэг ](/mn/blockchain/permissions.md)
- [Тусгай зөвшөөрлийн тэмдэгтийн сэнслэл](/mn/reference/permissions.md)
- [Metadata](./metadata.md)
