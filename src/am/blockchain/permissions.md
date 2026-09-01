---
translation_locale: am
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ፈቃዶች {#permissions}

መለያዎች በብሎክቼይን ላይ ለተለያዩ ድርጊቶች የፍቃድ ቶከኖች ያስፈልጋቸዋል፣ ለምሳሌ ንብረቶችን ለማውጣት ወይም ለማጥፋት።

ለተጠቃሚዎች ከተሰጡ ፈቃዶች አንፃር በህዝብ እና በግል blockchain መካከል ልዩነት አለ። በይፋዊ blockchain ውስጥ፣ አብዛኛዎቹ መለያዎች ተመሳሳይ የፍቃድ ስብስብ አላቸው። በግል ብሎክቼይን ውስጥ፣ አብዛኛዎቹ መለያዎች ተገቢውን ፍቃድ በግልፅ ካልተሰጣቸው በስተቀር ከተሰጣቸው ፈቃድ ውጭ ምንም ማድረግ አይችሉም ተብሎ ይታሰባል።

አንድን ተግባር ለመፈጸም ፈቃድ መኖሩ መለያው ተዛማጅ `Permission` አለው ማለት ነው። ፈቃዶች በቀጥታ ወይም የፈቃዶችን ስብስብ በሚያቀፍ [`Role`](#permission-groups-roles) በኩል ሊሰጡ ይችላሉ። ፈቃዶች በ `Grant` መመሪያ ይሰጣሉ። ፈቃዶችና ሚናዎች የማብቂያ ጊዜ የላቸውም፤ በ `Revoke` መመሪያ ያስወግዷቸው።

## የፍቃድ ቶከኖች {#permission-tokens}

የፍቃድ ቶከኖች በነቃ አስፈፃሚው የተገለጹ የተተየቡ ነገሮች ናቸው። አንዳንድ ቶከኖች እንደ `CanManagePeers` ያሉ ዓለም አቀፋዊ ናቸው፣ እና ሌሎች እንደ መለያ፣ ንብረት፣ የንብረት ፍቺ፣ ጎራ፣ NFT፣ ሚና ወይም ቀስቅሴ ላሉ የተወሰነ የብሎክቼይን መዝገብ ነገር የተያዙ ናቸው።

ለተለያዩ የፍቃድ ቶከኖች ጥቅም ላይ የዋሉ መለኪያዎች አንዳንድ ምሳሌዎች እነሆ -

- ለአንድ የተወሰነ መለያ ሜታዳታን ለመቀየር ፍቃድ የሚሰጥ ቶከን `account` መስክን ይይዛል -

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- ለአንድ የተወሰነ የንብረት ፍቺ ንብረቶችን ለማስተላለፍ ፍቃድ የሚሰጥ ቶከን `asset_definition` መስክን ይይዛል -

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- እንደ `CanManagePeers` ያለ ዓለም አቀፍ ቶከን ምንም መስኮች የሉትም -

  ```json
  {}
  ```

### አስቀድመው የተዋቀሩ የፍቃድ ምልክቶች {#pre-configured-permission-tokens}

አስቀድመው የተዋቀሩ የፍቃድ ቶከኖችን ዝርዝር በ[ማጣቀሻ](/am/reference/permissions) ምዕራፍ ውስጥ ማግኘት ይችላሉ።

## የፈቃድ ቡድኖች (ሚናዎች) {#permission-groups-roles}

የፈቃዶች ስብስብ **ሚና** ይባላል። እንደ ፈቃድ ቶከኖች ሁሉ ሚናዎች በ `Grant` መመሪያ ሊሰጡ እና በ `Revoke` መመሪያ ሊነሱ ይችላሉ።

ለመለያ ሚና ከመስጠቱ በፊት ሚናው መጀመሪያ መመዝገብ አለበት።

ብዙ መለያዎች ተመሳሳይ የፍቃድ ስብስብ ሲፈልጉ ሚናዎች ጠቃሚ ናቸው። ሚናውን አንድ ጊዜ ያስመዝግቡ፣ ፈቃዶችን ለሚናው ይመድቡ እና ከዚያ ሚናውን ለግለሰብ መለያዎች ይመድቡ ወይም ያስወግዱት።

### አዲስ ሚና ይመዝገቡ {#register-a-new-role}

በ Mouse መለያ ውስጥ ወደ [ሜታዳታ](/am/blockchain/metadata.md) ሌላ መለያ እንዲደርስ የሚፈቅድ አዲስ ሚና እንመዘግባለን -

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### ሚና ይስጡ {#grant-a-role}

ሚናው ከተመዘገበ በኋላ Mouse ለ Alice ሊሰጥ ይችላል -

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## የፈቃድ አረጋጋጮች {#permission-validators}

ፈቃዶች ያሉት አስፈላጊው የፈቃድ ቶከን ያላቸው መለያዎች ብቻ የተጠበቀ ተግባር እንዲፈጽሙ ነው። ነባሪው አስፈጻሚ መመሪያዎች፣ መጠይቆች እና ኤክስፕሬሽኖች ሲፈጸሙ ፈቃዶችን ይፈትሻል።

ነባሪው አረጋጋጭ ወለል በብሎክቼይን መዝገብ አካባቢ ተከፋፍሏል -

- የአውታረ መረብ አቻ አስተዳደር
- ጎራዎች እና መለያዎች
- NFTs እና የ ‹SEO› እና የ ‹SEO› ን
- ቀስቅሴዎች
- ሚናዎች እና ፈቃዶች
- አስፈፃሚ/የአሂድ ጊዜ፣ ማረጋገጫዎች፣ ድልድዮች እና SORA/Nexus ሞጁሎች

ትክክለኛው የቶከን ዝርዝር በ [የፍቃድ ቶከኖች ማጣቀሻ](/am/reference/permissions.md) ውስጥ በምንጭ የተደገፈ ነው።

### የሶፍትዌር ማስፈጸሚያ አካባቢ አረጋጋጮች {#runtime-validators}

የፍቃድ ፍተሻዎች የሚተገበሩት በነቃ አስፈፃሚው ነው። ነባሪው አስፈፃሚው አብሮገነብ የፍቃድ አረጋጋጮችን እና የቶከን ፍቺዎችን ያቀርባል፣ እና አውታረ መረብ የሚጠቀመውን አስፈፃሚ በማሻሻል ፖሊሲን ሊለውጥ ይችላል።

አረጋጋጮች የማረጋገጫ ውሳኔ ይመልሳሉ። አረጋጋጭ ቀዶ ጥገናን ሊፈቅድ፣ በምክንያት ሊክደው ወይም ክዋኔው ከአረጋጋጩ ወሰን ውጭ ከሆነ ሊዘለለው ይችላል። የተመረጠው ዳኛ መመሪያው፣ ጥያቄው ወይም አገላለጹ መቀጠል ይችል እንደሆነ ለመወሰን እነዚያን ፍርዶች ያጣምራል።

## የሚደገፉ መጠይቆች {#supported-queries}

የፍቃድ ምልክቶች እና ሚናዎች ሊጠየቁ ይችላሉ።

ለሚናዎች መጠይቆች -

- [`FindRoles`](/am/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/am/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/am/reference/queries.md#accounts-and-permissions)

የፍቃድ ቶከኖች መጠይቆች -

- [`FindPermissionsByAccountId`](/am/reference/queries.md#accounts-and-permissions)
