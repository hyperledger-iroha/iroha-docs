---
translation_locale: am
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ፍቃዶች {#permissions}

ሂሳቦች በብሎክቼን ላይ ለተለያዩ እርምጃዎች ፈቃድ ምልክቶች ያስፈልጋቸዋል ፣ ለምሳሌ ንብረቶችን ለማፍረስ ወይም ለማቃጠል ።

ለተጠቃሚዎች ከተሰጠው ፈቃድ ጋር በተያያዘ በሕዝብ እና በግል ብሎክቼይን መካከል ልዩነት አለ ። በአደባባይ ብሎክቼን ውስጥ አብዛኛዎቹ መለያዎች ተመሳሳይ ፍቃዶች አሏቸው ። በግል ብሎክቼን ውስጥ ፣ አብዛኛዎቹ መለያዎች ተገቢውን ፈቃድ ካልተሰጣቸው በስተቀር ለእነሱ ከተሰጠው ስልጣን ውጭ ምንም ነገር ማድረግ አይችሉም ተብሎ ይጠበቃል ።

አንድን ነገር ለማድረግ ፈቃድ መኖሩ ማለት ሂሳቡ የሚዛመደው `Permission` አለው ማለት ነው ። ፍቃዶች በቀጥታ ወይም በ [ `Role`](#permission-groups-roles) በኩል ሊሰጡ ይችላሉ ፣ ይህም የተወሰኑ ፍቃዶችን ያጠቃልላል። ፍቃዶች በ `Grant` መመሪያ ይሰጣሉ። ፍቃዶች እና ሚናዎች አያለፉም; በ `Revoke` መመሪያ ይምረጡ.

## የፈቃድ ምልክቶች {#permission-tokens}

ፍቃድ ቶክኖች በንቃት አስፈፃሚው የተገለጹ የታይፕ ዕቃዎች ናቸው። አንዳንድ ቶክኖች እንደ `CanManagePeers` ያሉ ዓለም አቀፍ ናቸው ፣ እና ሌሎች ደግሞ እንደ መለያ ፣ ንብረት ፣ የአክሲዮን ትርጉም ፣ ጎራ ፣ NFT ፣ ሚና ወይም ማስነሳት ላሉ ለተወሰነ የመጽሐፍ ቁሳቁስ ዕቃዎች ተወስደዋል ።

ለተለያዩ የፍቃድ ምልክቶች ጥቅም ላይ የዋሉ አንዳንድ ምሳሌዎች እዚህ አሉ-

- ለአንድ የተወሰነ መለያ ሜታዳታ ለመቀየር ፈቃድ የሚሰጥ ምልክት `account` መስክ ይዟል:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- ለአንድ የተወሰነ የንብረት ትርጉም ንብረቶችን ለማስተላለፍ ፈቃድ የሚሰጥ ምልክት `asset_definition` መስክ ይይዛል:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- እንደ `CanManagePeers` ያለ ዓለም አቀፍ ምልክት ምንም መስኮች የሉትም:

  ```json
  {}
  ```

### ቅድመ-የተዋቀሩ የመፈቀደላቸው ኮዶች {#pre-configured-permission-tokens}

በ [Reference](/am/reference/permissions) ምዕራፍ ውስጥ ቅድመ-የተዋቀሩ የፍቃድ ምልክቶችን ዝርዝር ማግኘት ይችላሉ ።

## የተፈቀደላቸው ቡድኖች (የሚጫወቱት ሚና) {#permission-groups-roles}

አንድ ስብስብ ፍቃዶች ሚና ይባላል. እንደ ፍቃድ ቶከኖች ሁሉ, ሚናዎች በ `Grant` መመሪያ በመጠቀም ሊሰጡ ይችላሉ እና በ `Revoke` መመሪያ በመጠቀም ሊቀነሱ ይችላሉ።

ለሂሳብ ሚና ከመሰጠቱ በፊት በመጀመሪያ ሚናው መመዝገብ አለበት።

በርካታ አካውንቶች ተመሳሳይ ፍቃድ ሲቀበሉ ሚናዎች ጠቃሚ ናቸው ። አንድ ጊዜ ሚናውን ያስመዝግቡ ፣ ለተግባር ፈቃዶችን ይስጡ እና ከዚያ ለግለሰቦች አካውንቶች ሚናውን ይሰጣሉ ወይም ይሰርዛሉ።

### አዲስ ሚና መመዝገብ {#register-a-new-role}

እስቲ አንድ አዲስ ሚና እንመዝገብ ይህም ከተሰጠ በኋላ ሌላ የሂሳብ መዳረሻን ይፈቅዳል [በሙስ መለያ ውስጥ ያለው ሜታዳታ](/am/blockchain/metadata.md):

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### ሚናህን ስጥ {#grant-a-role}

ሚናው ከተመዘገበ በኋላ፣ አይጥ ለአሊስ መስጠት ይችላል፦

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## የፈቃድ ማረጋገጫዎች {#permission-validators}

ፍቃዶች አሉ ስለሆነም የተጠበቀ እርምጃ ሊፈጽሙ የሚችሉት የተፈለገውን የፍቃድ ምልክት ያላቸው መለያዎች ብቻ ናቸው ። ነባሪው አስፈፃሚ መመሪያ ፣ ጥያቄ እና መግለጫ አፈፃፀም ወቅት ፍቃዶችን ያረጋግጣል ።

ነባሪ የማረጋገጫ ወለል በሪጀር አካባቢ የተከፋፈለ ነው:

- የእኩዮች አስተዳደር
- ጎራዎች እና መለያዎች
- NFTs እና ዋስትናዎች
- ማነቃቂያዎች
- ሚና እና ፍቃድ
- አስፈፃሚ/የስራ ሰዓት፣ ማስረጃዎች፣ ድልድዮች እና SORA/Nexus ሞጁሎች።

ትክክለኛ የቲኮኖች ዝርዝር በ [Permission Tokens ማጣቀሻ ](/am/reference/permissions.md) ውስጥ ምንጭ የተደገፈ ነው.

### የስራ ሰዓት ማረጋገጫ መሳሪያዎች {#runtime-validators}

የፈቃድ ፍተሻዎች በንቃት አስፈፃሚው ይተገበራሉ። ነባሪው አስፈጻሚ አብሮገነብ የፈቃድ ማረጋገጫዎችን እና የቲኮን ትርጓሜዎችን ይሰጣል ፣ እናም አውታረ መረብ የሚጠቀመውን አስፈፃም በማሻሻል ፖሊሲውን ሊለውጥ ይችላል።

ማረጋገጫ ሰጪዎች የማረጋገጫ ፍርድን ይመልሳሉ። አንድ ማረጋገጫ ሠሪ አንድን ክወና ሊፈቅድለት፣ ምክንያቱን በመግለጽ ሊክደው ወይም ከዚያ ማረጋገጫ አቅጣጫ ውጭ ከሆነ ሊያመልጠው ይችላል። የተመረጠው ዳኛ መመሪያውን ፣ ጥያቄውን ወይም መግለጫውን መቀጠል ይችል እንደሆነ ለመወሰን እነዚህን ውሳኔዎች ያጣምራል ።

## የተደገፉ ጥያቄዎች {#supported-queries}

የፈቃድ ምልክቶች እና ሚናዎች መጠየቅ ይችላሉ.

ለድርሻ ጥያቄዎች:

- [`FindRoles`](/am/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/am/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/am/reference/queries.md#accounts-and-permissions)

ለፍቃድ ምልክቶች መጠይቆች:

- [`FindPermissionsByAccountId`](/am/reference/queries.md#accounts-and-permissions)
