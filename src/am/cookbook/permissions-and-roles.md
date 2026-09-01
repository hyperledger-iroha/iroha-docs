---
translation_locale: am
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ፈቃዶች እና ሚናዎች {#permissions-and-roles}

## ውጤት {#outcome}

በአንድ የተወሰነ መለያ ላይ ሜታዳታን ለማዘመን፣ ለተወካይ ለመመደብ፣ ውክልና የተሰጠውን የመጻፍ ክዋኔ ለማረጋገጥ እና ተዛማጅ የተተየበውን Rust መመሪያዎችን ለማሳየት አንድ መለያ ፍቃድ የሚሰጥ ሚና ይፍጠሩ።

## ቅድመ ሁኔታዎች {#prerequisites}

- በገንዘብ የተደገፈ Taira ደንበኛ እና ክፍያ ሜታዳታ ከ[ከ Taira ጋር ይገናኙ](./connect-to-taira.md)።
- `TARGET_ACCOUNT` እና `DELEGATE_ACCOUNT` ወደ ነጠላ ፕሮቶኮል-መደበኛ I105 መለያ መታወቂያዎች ተቀናብሯል።
- የፊርማ መለያው የታለመውን ፈቃድ እና ሚናዎች እንዲያስተዳድር መፍቀድ አለበት። በ Taira ላይ ይህ በፍቃድ የተዘጋ አስተዳደራዊ ተግባር ነው; . `CanManageRoles` ያግኙ እና የፍቃድ ርእሰ መምህሩን ወሰን ለመስጠት ወይም የተግባር መመሪያውን በተፈጠረ የአካባቢ አውታረመረብ ላይ ያሂዱ።

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

የመጻፍ ክዋኔውን ሲያረጋግጡ ለውክልና ተቀባዩ ሁለተኛ የደንበኛ ውቅር ይጠቀሙ፦

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## እርምጃዎች {#steps}

### 1. ባዶ ሚና ይመዝገቡ {#_1-register-an-empty-role}

እያንዳንዱ ሁኔታ የሚቀይር CLI ትዕዛዝ ክፍያ ከፋዩን በግልፅ ይሰይማል። የሜታዳታ ፋይሉ ከቴስትኔት የገንዘብ ድጋፍ አገልግሎት ምላሽ የተገኘውን የአሁኑን Taira ክፍያ ንብረት ይዟል።

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. ወደ ዒላማው መለያ ወሰን ያለው ፈቃድ ያክሉ {#_2-add-a-permission-scoped-to-the-target-account}

የፍቃድ ምልክቶች JSON ነገሮች የተተየቡ ናቸው። መለያውን በ `payload` ውስጥ እንደ I105 መታወቂያ ያስቀምጡት; በዚህ ጥብቅ መስክ ውስጥ ተለዋጭ ስም የሚሰራ አይደለም።

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. ሚናውን ለተወካዩ ይመድቡ {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

ሚናዎች እና በእነሱ የተሰጡ ፈቃዶች ጊዜያቸው አያልፍም። መዳረሻው ሳያስፈልግ ሲቀር በግልጽ ይሰርዟቸው።

### 4. የተወከለውን ፈቃድ ይጠቀሙ {#_4-exercise-the-delegated-permission}

ለመጻፍ የውክልና ምስጠራ ፈራሚ እና የክፍያ ቀሪ ሂሳብ ይጠቀሙ። JSON እሴቶች ከመደበኛ ግቤት ይነበባሉ።.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

ተመሳሳይ ሞዴል ለ Rust ደንበኞች ይገኛል። እዚህ `client` እንደ `registrar_account` ይፈርማል፣ እሱም ልክ በ CLI ፍሰት ውስጥ እንደሚደረገው የሚናው የመጀመሪያ ባለቤት ይሆናል። ሦስቱም የመለያ ተለዋዋጮች አስቀድመው የተተነተኑ ናቸው `AccountId` እሴቶች -

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

## አረጋግጥ {#verify}

የምደባውን ሁለቱንም ወገኖች ይዘርዝሩ እና በተወካዩ የተጻፈውን ትክክለኛ እሴት ያንብቡ -

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

የፍቃድ ዝርዝሩ `CanModifyAccountMetadata` ወደ `TARGET_ACCOUNT` ወሰን መያዝ አለበት፣ የውክልና ሚና ዝርዝር `ROLE_ID` መያዝ አለበት፣ እና የተነበበው ሜታዳታ `"delegated"` መመለስ አለበት።

## መላ ፍለጋ {#troubleshooting}

- `Not permitted` ሚናውን ሲመዘገብ፣ ሲያርትዑ ወይም ሲመድቡ ማለት ምስጠራ ፈራሚው የሚፈለገው Taira ፍቃድ ዋና ይጎድለዋል ማለት ነው። ወሰን ያለውን ቶከን በአለምአቀፍ አይተኩ; ትክክለኛውን ስጦታ ይጠይቁ ወይም localnet ይጠቀሙ
- ጭነት የመተንተን ስህተት ብዙውን ጊዜ `account` ከ`payload` ጎን ተቀምጧል፣ ከ I105 መታወቂያ ይልቅ ተለዋጭ ስም ቀርቧል፣ ወይም የ JSON እሴቱ ሁለት ጊዜ ተጠቅሷል።
- የክፍያ አለመቀበል ያንን እርምጃ የሚያቀርበው የምስጠራ ፈራሚ ነው። ለአስተዳዳሪው የገንዘብ ድጋፍ ይስጡ እና በተናጥል ውክልና ይስጡ እና ከቴስትኔት ገንዘብ ድጋፍ አገልግሎቱ የተገኘውን የክፍያ ንብረት ሜታዳታ ያቆዩ።
- የተሳካ ሚና ስጦታ በቶከኖቹ ውስጥ የተቀመጠውን ወሰን አይሽረውም። ይህ ሚና በፍቃድ ጭነት ውስጥ የተሰየመውን መለያ ብቻ ማሻሻል ይችላል።
- ለማጽዳት `ledger account role revoke`፣ ከዚያ `ledger role permission revoke`፣ እና በመጨረሻም `ledger role unregister`ን ያሂዱ። እያንዳንዳቸው የተለየ የመጻፍ ክዋኔ ናቸው እና `--fee-payer authority` እና የክፍያ ሜታዳታን ማካተት አለባቸው።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የሚና ውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የፍቃድ ውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [አብሮ የተሰራ የፍቃድ ውሂብ ሞዴል በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [ፈቃዶች እና ሚናዎች](/am/blockchain/permissions.md)
- [የፍቃድ ቶከን ማጣቀሻ](/am/reference/permissions.md)
- [ሜዳዳታ](./metadata.md)
