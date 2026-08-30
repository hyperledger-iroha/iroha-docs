---
translation_locale: am
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 7ee18275d25837da53f533f5e9205906ccaa71b48afd9b11ffad79b599da7f21
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ፈቃድ እና ሚና {#permissions-and-roles}

## ውጤቱ {#outcome}

በአንድ የተወሰነ መለያ ላይ ሜታዳታዎችን ለማዘመን ለአንድ መለያ ፈቃድ የሚሰጥ ሚና ይፍጠሩ ፣ ለተቀባዩ ያድርጉት ፣ የተመደበውን ጽሑፍ ያረጋግጡ እና ተጓዳኝ የ Rust መመሪያዎችን ያሳዩ ።

## ቅድመ ሁኔታዎች {#prerequisites}

- በገንዘብ የተደገፈ Taira ደንበኛ እና የክፍያ ሜታዳታ ከ [ወደ Taira](./connect-to-taira.md) ያገናኙ።
- `TARGET_ACCOUNT` እና `DELEGATE_ACCOUNT` ወደ ካኖኒካል ተዘጋጅቷል I105 ሂሳብ IDs.
- በ Taira ላይ ይህ የተፈቀደለት የአስተዳደራዊ ክወና ነው; የተፈቀደውን ፈቃድ ለመስጠት የሚያስፈልገውን `CanManageRoles` እና ባለሥልጣን ያግኙ, ወይም በምግብ አዘገጃጀት በአካባቢያዊ አውታረመረብ ላይ ይሰራሉ.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

ጽሁፉን በሚያረጋግጡበት ጊዜ ለወኪሉ ሁለተኛ የደንበኛ ውቅር ይጠቀሙ:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## እርምጃዎች {#steps}

### 1. ባዶ ሚና መመዝገብ {#_1-register-an-empty-role}

እያንዳንዱ ሁኔታ የሚቀይር CLI ትዕዛዝ የክፍያ ሰጪውን በግልጽ ይጠራል። ሜታዳታ ፋይሉ ከቧንቧው ምላሽ የተገኘውን የአሁኑን Taira ክፍያ ንብረትን ይ containsል።

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. ለዒላማው መለያ የተወሰነ ፍቃድ ይጨምሩ {#_2-add-a-permission-scoped-to-the-target-account}

የፈቃድ ኮንኖች JSON ዕቃዎች የተጻፉ ናቸው. ሂሳቡን በ `payload` ውስጥ እንደ I105 ID ይያዙ; በዚህ ጥብቅ መስክ ውስጥ ቅጽል ስም አይሰራም.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. ተልዕኮውን ለወኪሉ ይመድቡ {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

ሚናዎቻቸው እና የእነሱ ድጎማዎች አያለፉም; መዳረሻው ከአሁን በኋላ አስፈላጊ በሚሆንበት ጊዜ በግልጽ ይሰርዙት.

### 4. የተሰጠውን ፈቃድ መጠቀም {#_4-exercise-the-delegated-permission}

JSON እሴቶች ከተለመደው ማስገቢያ አንብበዋል.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

ተመሳሳይ ሞዴል ለ Rust ደንበኞች ይገኛል። እዚህ ላይ `client` እንደ `registrar_account` ይለያል ፣ ይህም በ CLI ፍሰት ውስጥ እንደሚያደርገው ሁሉ የክለቡ የመጀመሪያ ባለቤት ይሆናል ። ሦስቱም የመለያ ተለዋዋጮች ቀድሞውኑ የተመረመሩ ናቸው `AccountId` እሴቶች:

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

## ያረጋግጡ {#verify}

የተሰጠህን ኃላፊነት በሁለቱም በኩል ጻፍ፤ ከዚያም ተልዕኮው የጻፈውን ትክክለኛ እሴት አንብብ።

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

ፍቃድ ዝርዝር ውስጥ ሊኖር ይገባል `CanModifyAccountMetadata` ተደራሽነት `TARGET_ACCOUNT`, የውክልና ኃላፊነቱ የተሰጠው ዝርዝር የያዘ መሆን አለበት። `ROLE_ID`, እና የተነበቡት ሜታዳታዎች መመለስ አለባቸው `"delegated"`.

## ችግሮችን መፍታት {#troubleshooting}

- `Not permitted` በመመዝገብ ፣ በማርትዕ ወይም ሚናውን በሚመደብበት ጊዜ ፊርማው የሚፈለገውን Taira ስልጣን የለውም ማለት ነው ። የተቀመጠውን ቶከን በአለም አቀፍ አይተኩ ፤ ትክክለኛውን ድጎማ ይጠይቁ ወይም localnet ይጠቀሙ።
- የዋጋ ጭነት ትንታኔ ስህተት አብዛኛውን ጊዜ ማለት `account` ከ `payload` አጠገብ ተቀምጧል ፣ በምትኩ አንድ I105 ID የሚል ስያሜ ተሰጥቷል ፣ ወይም JSON ዋጋ ሁለት ጊዜ ተጠቅሷል ።
- የክፍያ ውድቀት ያንን እርምጃ የሚያቀርበው ፊርማ ፈራሚው ነው ። አስተዳዳሪውን የገንዘብ ድጋፍ ያድርጉ እና በነፃነት ያስተላልፉ እንዲሁም ከቧንቧው የተገኘውን የክፍያው ንብረት ሜታዳታ ይያዙ።
- በተሳካ ሁኔታ የተሰጠ ሚና በቶኬኖቹ ውስጥ የተመዘገበውን አጠቃቀም አይተላለፍም። ይህ ሚና በመፈቃድ ጭነት ውስጥ የተጠቀሰው አካውንት ብቻ ሊለውጥ ይችላል ።
- ለማጽዳት `ledger account role revoke`, ከዚያም `ledger role permission revoke`, እና በመጨረሻም `ledger role unregister` ይሂዱ; እያንዳንዱ የተለየ መጻፍ ነው እና `--fee-payer authority` እና ክፍያ ሜታዳታ ማካተት አለበት.

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በፒን የተደረገባቸው ተልእኮዎች ላይ የሙያ ውህደት ሙከራዎች ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [የፈቃድ ውህደት ሙከራዎች በተጣበቀው ተልእኮ ላይ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [የተገጠመለት የመፍቀድ ውሂብ ሞዴል በተሰቀለ ኮሚት ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [ፍቃዶች እና ሚናዎች](/am/blockchain/permissions.md)
- [የፍቃድ ምልክት ማጣቀሻ ](/am/reference/permissions.md)
- [ሜታ መረጃዎች](./metadata.md)
