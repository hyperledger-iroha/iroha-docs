---
translation_locale: am
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# ፈቃዶች እና ሚናዎች {#permissions-and-roles}

## ውጤት {#outcome}

በአንድ የተወሰነ መለያ ላይ ሜታዳታን ለማዘመን፣ ለተወካይ ለመመደብ፣ ውክልና የተሰጠውን የመጻፍ ክዋኔ ለማረጋገጥ እና ተዛማጅ የተተየበውን Rust መመሪያዎችን ለማሳየት አንድ መለያ ፍቃድ የሚሰጥ ሚና ይፍጠሩ።

## ቅድመ ሁኔታዎች {#prerequisites}

- በገንዘብ የተደገፈ Taira ደንበኛ ከ[ከ Taira ጋር ይገናኙ](./connect-to-taira.md)።
- `TARGET_ACCOUNT` እና `DELEGATE_ACCOUNT` ወደ ነጠላ ፕሮቶኮል-መደበኛ I105 መለያ መታወቂያዎች ተቀናብሯል።
- የፊርማ መለያው `CanManageRoles` መያዝ አለበት እና ወሰን ያለውን ፈቃድ በውክልና መስጠት መቻል አለበት፦ ይህ መለያ ራሱ `TARGET_ACCOUNT` ነው ወይም ለዚያ መለያ `CanModifyAccountMetadata` አስቀድሞ ይዟል። በ Taira ላይ ይህ በፍቃድ የተዘጋ አስተዳደራዊ ተግባር ነው። የመነጨ localnet ደንበኛ `CanManageRoles` አይይዝም፣ ስለዚህ የተግባር መመሪያው ጀነሲሱ ይህን ፈቃድ የሚሰጥ አውታረ መረብ ያስፈልገዋል።

```bash
CONFIG=./taira.client.toml
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

እያንዳንዱ ሁኔታ የሚቀይር CLI ትዕዛዝ ክፍያ ከፋዩን በግልፅ ይሰይማል። CLI ከመፈረሙ በፊት ትክክለኛውን ክፍያ በ Taira የክፍያ ንብረት የሚገልጽ የክፍያ ዋጋ ግምት ያቀርባል።

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. ወደ ዒላማው መለያ ወሰን ያለው ፈቃድ ያክሉ {#_2-add-a-permission-scoped-to-the-target-account}

የፍቃድ ምልክቶች JSON ነገሮች የተተየቡ ናቸው። መለያውን በ `payload` ውስጥ እንደ I105 መታወቂያ ያስቀምጡት; በዚህ ጥብቅ መስክ ውስጥ ተለዋጭ ስም የሚሰራ አይደለም።

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. ሚናውን ለተወካዩ ይመድቡ {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
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
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

ተመሳሳይ ሞዴል ለ Rust ደንበኞች ይገኛል። እዚህ `client` እንደ `registrar_account` የሚፈርም `iroha::blocking::Client` ነው፤ `registrar_account` ልክ በ CLI ፍሰት ውስጥ እንደሚደረገው የሚናው የመጀመሪያ ባለቤት ይሆናል። ሦስቱም የመለያ ተለዋዋጮች አስቀድመው የተተነተኑ `AccountId` እሴቶች ናቸው፦

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

## አረጋግጥ {#verify}

የሚና የፈቃድ ስጦታዎችን የሚያካትቱትን የተወካዩን በሥራ ላይ ያሉ ፈቃዶች ያንብቡ፣ ከዚያም በተወካዩ የተጻፈውን ትክክለኛ እሴት ያንብቡ፦

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

የተወካዩ በሥራ ላይ ያሉ ፈቃዶች በ`TARGET_ACCOUNT` ወሰን የተገደበ `CanModifyAccountMetadata` መያዝ አለባቸው፣ እና የተነበበው ሜታዳታ `"delegated"` መመለስ አለበት። Torii በተፈረሙ መጠይቆች የሚቀርቡ የሚና ዝርዝር ጥያቄዎችን ውድቅ ያደርጋል፣ ስለዚህ የምደባው ማረጋገጫ በሥራ ላይ ያሉ ፈቃዶች ዝርዝር ነው።

## መላ ፍለጋ {#troubleshooting}

- ሚናውን በሚመዘግቡበት፣ በሚያርትዑበት ወይም በሚመድቡበት ጊዜ የሚመጣ `Not permitted` ምስጠራ ፈራሚው የሚፈለገው የ Taira ስልጣን ይጎድለዋል ማለት ነው። ወሰን ያለውን ቶከን በአለምአቀፍ ቶከን አይተኩ፤ ትክክለኛውን የፈቃድ ስጦታ ይጠይቁ።
- ጭነት የመተንተን ስህተት ብዙውን ጊዜ `account` ከ`payload` ጎን ተቀምጧል፣ ከ I105 መታወቂያ ይልቅ ተለዋጭ ስም ቀርቧል፣ ወይም የ JSON እሴቱ ሁለት ጊዜ ተጠቅሷል።
- የክፍያ አለመቀበል የዚያን እርምጃ የሚያቀርበው ምስጠራ ፈራሚ ጉዳይ ነው። አስተዳዳሪውን እና ተወካዩን እያንዳንዱ የክፍያ ዋጋ ግምት በሚሰይመው የክፍያ ንብረት በተናጥል በገንዘብ ይደግፉ።
- የተሳካ ሚና ስጦታ በቶከኖቹ ውስጥ የተቀመጠውን ወሰን አይሽረውም። ይህ ሚና በፍቃድ ጭነት ውስጥ የተሰየመውን መለያ ብቻ ማሻሻል ይችላል።
- ለማጽዳት `account role revoke`፣ ከዚያ `ledger role permission revoke`፣ እና በመጨረሻም `ledger role unregister`ን ያሂዱ። እያንዳንዳቸው የተለየ የመጻፍ ክዋኔ ናቸው እና `--fee-payer authority` ማካተት አለባቸው።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የሚና ውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የፍቃድ ውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [አብሮ የተሰራ የፍቃድ ውሂብ ሞዴል በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [ፈቃዶች እና ሚናዎች](/am/blockchain/permissions.md)
- [የፍቃድ ቶከን ማጣቀሻ](/am/reference/permissions.md)
- [ሜዳዳታ](./metadata.md)
