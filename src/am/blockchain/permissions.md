---
translation_locale: am
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ፍቃዶች {#permissions}

መለያዎች በብሎክቼይን ላይ ለተለያዩ እርምጃዎች ፈቃድ ምልክቶች ያስፈልጋቸዋል ፣ ለምሳሌ ።
ንብረቶችን ለማፍረስ ወይም ለማቃጠል ።

በሕዝብ እና በግል blockchain መካከል ያለው ልዩነት
በአደባባይ ባሉ የብሎክቼይኖች ውስጥ አብዛኛዎቹ መለያዎች
በአንድ የግል ብሎክቼይን ውስጥ አብዛኛዎቹ መለያዎች
ከተሰጣቸው ሥልጣን ውጭ ምንም ነገር ማድረግ እንደማይችሉ ተደርገው
ተገቢው ፈቃድ በግልጽ ካልተሰጠ በስተቀር።

አንድን ነገር ለማድረግ ፈቃድ መኖሩ ማለት ሂሳቡ
ተመጣጣኝ `Permission`. ፈቃድ በቀጥታ ወይም በ
[`Role`](#permission-groups-roles), ይህም የተወሰኑ ፍቃዶችን ያጠቃልላል።
ፍቃዶች በ `Grant` ሥልጠና፣ ፈቃድ እና ሚና
አይሽሩ; ከ ጋር እነሱን ማስወገድ `Revoke` መመሪያ።

## የመፍቀድ ምልክት {#permission-tokens}

የመፍቀድ ምልክቶች በንቃት አስፈፃሚው የተገለጹ የታይፕ ዕቃዎች ናቸው ።
ቶኪኖች ዓለም አቀፍ ናቸው ፣ ለምሳሌ `CanManagePeers`, እና ሌሎችም ወደ
እንደ መለያ፣ ንብረት፣ የንብረት ትርጉም፣ ጎራ ያሉ የተወሰኑ የመረጃ ቋት ዕቃዎች
NFT, ሚና ወይም አስነሳሽነት።

ለተለያዩ የመፈቃደሪያ ምልክቶች ጥቅም ላይ የዋሉ አንዳንድ ምሳሌዎች እዚህ አሉ

- ለተወሰነ መለያ ሜታዳታ ለመቀየር ፈቃድ የሚሰጥ ምልክት
  ይሸከማል `account` መስክ:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- ለተወሰነ ንብረት ንብረቶችን ለማስተላለፍ ፈቃድ የሚሰጥ ምልክት
  ፍቺው አንድ `asset_definition` መስክ:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- እንደ ዓለም አቀፍ ምልክት `CanManagePeers` ምንም መስኮች የሉትም

  ```json
  {}
  ```

### ቅድመ-የተዋቀሩ የመፈቀደላቸው ኮዶች {#pre-configured-permission-tokens}

በቅድመ-የተዋቀሩ የመፈቀደላቸው ምልክቶች ዝርዝር ውስጥ ማግኘት ይችላሉ [ማጣቀሻ](/am/reference/permissions) ምዕራፍ።

## ፈቃድ ያላቸው ቡድኖች (አስተያየቶች) {#permission-groups-roles}

የተፈቀደለት ስብስብ **ሚና**. ለፍቃድ ምልክቶችም እንዲሁ፣
ሚናዎችን በመጠቀም መስጠት ይቻላል `Grant` መመሪያ እና በመጠቀም ተሻሽሏል
`Revoke` መመሪያ።

ለሂሳብ ሚና ከመሰጠቱ በፊት ሚናው በመጀመሪያ መመዝገብ አለበት።

በርካታ አካውንቶች ተመሳሳይ ፈቃድ ሲቀበሉ ሚናዎች ጠቃሚ ናቸው
አንድ ጊዜ ሚናውን መመዝገብ፣ ለሥራው ፈቃድ መስጠት፣ ከዚያም ወይም
ለግለሰባዊ ሂሳቦች የሚሰጠው ሚና እንዲቋረጥ ማድረግ።

### አዲስ ሚና መመዝገብ {#register-a-new-role}

እስቲ አዲስ ሚና እንመዝገብ፣ ከተሰጠ በኋላ ሌላ ሂሳብ ይፈቅዳል
ወደ [ሜታዳታ](/am/blockchain/metadata.md) በሙስ ዘገባ:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### ሚና ስጥ {#grant-a-role}

ሚናው ከተመዘገበ በኋላ፣ አይጥ ለአሊስ መስጠት ይችላል፡-

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## የፈቃድ ማረጋገጫዎች {#permission-validators}

ፍቃዶች አሉ ስለዚህ ብቻ የተፈለገውን ፈቃድ ምልክት ጋር መለያዎች
የተጠበቀ እርምጃ ሊፈጽም ይችላል። ነባሪው አስፈፃሚ ፍቃዶችን ይፈትሻል
መመሪያ፣ ጥያቄ እና መግለጫ አፈፃፀም በሚካሄድበት ጊዜ።

ነባሪ የማረጋገጫ ወለል በ መለያ ቦታ የተከፋፈለ ነው:

- የእኩዮች አስተዳደር
- ጎራዎች እና ሂሳቦች
- ንብረቶች፣ NFTs, እና ዋስትናዎች
- ተነሳሽነት
- ሚና እና ፍቃድ
- አስፈፃሚ/የስራ ሰዓት፣ ማስረጃዎች፣ ድልድዮች እና SORA/Nexus ሞጁሎች

ትክክለኛው የምልክት ዝርዝር በ
[የፈቃድ ቶከኖች ማጣቀሻ](/am/reference/permissions.md).

### የስራ ሰዓት ማረጋገጫዎች {#runtime-validators}

ፍቃድ ቁጥጥር በሥራ ላይ የሚውለው አስፈጻሚ ይፈጸማል።
አስፈፃሚው የተካተቱትን የመፍቀድ ማረጋገጫዎች እና የቲኮን ትርጓሜዎችን ያቀርባል ፣
እና አንድ አውታረ መረብ የሚጠቀምበትን አስፈፃሚ በማሻሻል ፖሊሲውን ሊለውጥ ይችላል።

ማረጋገጫዎች አንድ **የማረጋገጫ ፍርድ**. አንድ ማረጋገጫ
ክወና, ምክንያት ጋር ይክዱታል, ወይም ክወና ውጭ ከሆነ skip
የተመረጠው ዳኛ እነዚህን ፍርዶች
መመሪያውን፣ ጥያቄውን ወይም አገላለጹን መቀጠል ይቻል እንደሆነ ይወስናል።

## የተደገፉ ጥያቄዎች {#supported-queries}

የመፈቃደሪያ ምልክቶች እና ሚናዎች መጠየቅ ይችላሉ.

ለድርሻ ጥያቄዎች:

- [`FindRoles`](/am/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/am/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/am/reference/queries.md#accounts-and-permissions)

ለፍቃድ ምልክቶች መጠይቆች

- [`FindPermissionsByAccountId`](/am/reference/queries.md#accounts-and-permissions)
