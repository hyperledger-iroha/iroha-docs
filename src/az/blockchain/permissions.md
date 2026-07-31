---
translation_locale: az
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# icazələr {#permissions}

Hesablar bir blok kateqoriyasında müxtəlif hərəkətlər üçün icazə tokenlarına ehtiyac duyurlar, məsələn, aktivləri mint və ya yandırmaq.

İstifadəçilərə verilən icazələr baxımından ictimai və özəl blok zinciri arasında fərq var. Ictimai blok zincirdə əksər hesablarda eyni icazələr var. Xüsusi bir blok zincirində əksər hesablar müvafiq icazə verilmədiyi təqdirdə, onlara verilmiş səlahiyyətdən kənarda heç nə edə bilməyəcəklər.

Bir şey etmək üçün icazə almaq hesabın müvafiq `Permission` olduğunu göstərir. İzinlər bir sıra icazələri qruplaşdıran bir [`Role`](#permission-groups-roles) vasitəsilə və ya birbaşa verilə bilər. İzinlərin verilməsi `Grant` təlimatı ilə edilir. İzinlər və rollar sona çatmır; `Revoke` təlimatı ilə çıxarın.

## İzin simvolları {#permission-tokens}

İzin tokenləri aktiv icraçı tərəfindən müəyyən edilmiş tiplənmiş obyektlərdir. Bəzi tokenlar qlobaldır, məsələn `CanManagePeers`, digərləri isə bir hesab, aktiv, aktiv tərifi, domen, NFT, rol və ya tetikçi kimi xüsusi bir nəşr obyekti üçün məhdudlaşdırılır.

Burada müxtəlif icazə simvolları üçün istifadə olunan parametrlərin bir neçə nümunəsi var:

- Müəyyən bir hesab üçün meta məlumatları dəyişdirməyə icazə verən bir token `account` sahəsini daşıyır:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- Müəyyən bir aktiv tərifinə görə aktivlərin köçürülməsinə icazə verən bir token `asset_definition` sahəsini daşıyır:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- `CanManagePeers` kimi qlobal bir simvolda heç bir sahə yoxdur:

  ```json
  {}
  ```

### Əvvəlcədən konfiqurasiya edilmiş icazə nömrələri {#pre-configured-permission-tokens}

[Reference](/az/reference/permissions) bölməsində əvvəlcədən konfiqurasiya edilmiş icazə tokenlərinin siyahısını tapa bilərsiniz.

## Müvəffəqiyyət qrupları (rollen) {#permission-groups-roles}

İzinlərin bir dəstinə rol deyilir. İzin nömrələrinə bənzər olaraq, `Grant` təlimatı istifadə edərək və `Revoke` təlimatını istifadə edərək rolllər verilə bilər.

Hesablara rol verilmədən əvvəl rolun ilk növbədə qeydiyyatdan keçirilməsi lazımdır.

Bir neçə hesabın eyni icazə dəstini alması lazım olduqda rollar faydalıdır. Rolu bir dəfə qeyd edin, rolu icazə verin və sonra fərdi hesablar üçün rolu versin və ya ləğv edin.

### Yeni rolu qeyd edin. {#register-a-new-role}

Yeni bir rol qeyd edək ki, veriləndə Mouse hesabındakı [metadata ](/az/blockchain/metadata.md) başqa bir hesabın girişinə imkan verəcək:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### Bir rolu ver {#grant-a-role}

Rolu qeydiyyatdan keçdikdən sonra Mouse onu Alice-yə verə bilər:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## İzin təsdiqləyiciləri {#permission-validators}

İzinlər mövcuddur ki, yalnız tələb olunan icazə nişanı olan hesablar qorunmuş bir hərəkət edə bilər. Varsayılan icraçı təlimat, sorğu və ifadə icrası zamanı icazələri yoxlayır.

Standart təsdiqləyici səthləri kitab sahəsi üzrə qruplaşdırılır:

- Tərəflər arasında idarəetmə
- domenlər və hesablar
- aktivlər, NFTs, və əmanətlər
- başlatıcılar
- rolu və icazələri
- icraçı / iş vaxtı, sübutlar, köprülər və SORA/Nexus modulları

[Permission Tokens istinadında ](/az/reference/permissions.md) mənbə ilə təsdiqlənən dəqiq token siyahısı.

### İndirmə vaxtı təsdiqləyiciləri {#runtime-validators}

İzin yoxlamaları aktiv icraçı tərəfindən həyata keçirilir. Varsayılan icraçı daxili icazə təsdiqçilərini və nişan təriflərini təmin edir və bir şəbəkə istifadə etdiyi icraçını yeniləyərək siyasəti dəyişə bilər.

Validatorlar təsdiqləmə hökmünü qaytarırlar. Validator bir əməliyyatı icazə verə bilər, səbəbi ilə rədd edə bilər və ya əməliyyat həmin validatorun əhatə dairəsindən kənarda qalsa onu atlaya bilər. Seçilmiş hakim bu hökmləri birləşdirərək təlimatın, sorğunun və ya ifadənin davam etməsinə qərar verə bilər.

## Dəstəklənmiş suallar {#supported-queries}

Ruxs və icazə simvolları sorula bilər.

Rollar üçün sorğular:

- [`FindRoles`](/az/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/az/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/az/reference/queries.md#accounts-and-permissions)

icazə simvolları üçün sorğular:

- [`FindPermissionsByAccountId`](/az/reference/queries.md#accounts-and-permissions)
