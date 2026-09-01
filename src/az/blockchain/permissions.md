---
translation_locale: az
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# İcazələr {#permissions}

Hesablar blokçeyn üzərində müxtəlif əməliyyatlar üçün icazə tokenlərinə ehtiyac duyur, məsələn, aktivləri buraxmaq və ya məhv etmək üçün.

İstifadəçilərə verilən icazələr baxımından ictimai və özəl blokçeyn arasında fərq var. İctimai blokçeyndə, əksər hesablar eyni icazə dəstinə malikdir. Özəl blokçeyndə, əksər hesabların onlara verilmiş səlahiyyət prinsipi xaricində heç nə edə bilməyəcəyi güman edilir, ancaq müvafiq icazə açıq şəkildə verildikdə istisna təşkil olunur.

Bir şeyi etmək icazəsinə sahib olmaq deməkdir ki, hesabın müvafiq icazəsi var `Permission`. İcazələr birbaşa və ya vasitəsilə verilə bilər [`Role`](#permission-groups-roles), icazələr dəsti qruplaşdırır. İcazələr verilir `Grant` təlimat. İcazələr və rollar bitmir; onları ilə silin `Revoke` təlimat.

## İcazə Jetonları {#permission-tokens}

İcazə tokenləri aktiv icraçı tərəfindən müəyyən edilmiş tiplənmiş obyektlərdir. Bəzi tokenlər qlobaldır, məsələn `CanManagePeers`, digərləri isə müəyyən bir blokçeyn dəftəri obyektinə aid olur, məsələn hesab, aktiv, aktiv tərifi, domen, NFT, rol və ya tetikleyici.

Budur müxtəlif icazə tokenləri üçün istifadə olunan parametrlərin bəzi nümunələri:

- Müəyyən bir hesab üçün metadata dəyişdirmək icazəsi verən token aşağıdakı `account` sahəsini daşıyır:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- Müəyyən bir aktiv tərifi üçün aktivlərin köçürülməsinə icazə verən token `asset_definition` sahəsini daşıyır:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- `CanManagePeers` kimi qlobal tokenin heç bir sahəsi yoxdur:

  ```json
  {}
  ```

### Əvvəlcədən Təyin Olunmuş İcazə Tokenləri {#pre-configured-permission-tokens}

Siz əvvəlcədən konfiqurasiya edilmiş icazə tokenlərinin siyahısını [İstinad](/az/reference/permissions) fəsildə tapa bilərsiniz.

## İcazə Qrupları (Rollar) {#permission-groups-roles}

İcazələr dəstinə rol deyilir. İcazə tokenlərinə bənzər şəkildə, rollar `Grant` təlimatından istifadə edərək verilə bilər və `Revoke` təlimatı ilə geri götürülə bilər.

Hesaba rol verilməzdən əvvəl, rol əvvəlcə qeydiyyatdan keçirilməlidir.

Rollar bir neçə hesabın eyni icazə dəstini alması lazım olduğunda faydalıdır. Rol bir dəfə qeydiyyatdan keçirin, rola icazələr verin, sonra isə fərdi hesablar üçün rolu verin və ya ləğv edin.

### Yeni rol qeydiyyatdan keçirin {#register-a-new-role}

Gəlin, verildiyi zaman başqa bir hesabın Mouse-in hesabındakı [metaməlumat](/az/blockchain/metadata.md)-a giriş imkanı verəcək yeni bir rol qeydiyyatdan keçirək:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### Rolu ver {#grant-a-role}

Rol qeydiyyatdan keçirildikdən sonra, Mouse onu Alice-ə verə bilər:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## İcazə Yoxlayıcıları {#permission-validators}

İcazələr yalnız tələb olunan icazə tokeninə malik olan hesabların qorunan əməliyyatı yerinə yetirməsinə imkan vermək üçün mövcuddur. Varsayılan icraçı təlimat, sorğu və ifadə icrası zamanı icazələri yoxlayır.

Əsas doğrulayıcı səthi blokçeyn dəftər sahəsinə görə qruplaşdırılır:

- şəbəkə tərəfdaşının idarə edilməsi
- domenlər və hesablar
- aktivlər, NFTs və depozitlər
- tetikləyicilər
- rol və icazələr
- icraçi/vaxt mühiti, sübutlar, körpülər və SORA/Nexus modulları

Dəqiq token siyahısı [İcazə Tokenləri istinadı](/az/reference/permissions.md)-da mənbə tərəfindən dəstəklənir.

### proqram icra mühiti Təsdiqləyicilər {#runtime-validators}

İcazə yoxlamaları aktiv icraçı tərəfindən həyata keçirilir. Varsayılan icraçı daxili icazə yoxlayıcıları və token təriflərini təmin edir, və şəbəkə istifadə etdiyi icraçını yeniləməklə siyasəti dəyişə bilər.

Təsdiqləyicilər təsdiq hökmü verirlər. Bir təsdiqləyici əməliyyatın icazəsini verə, səbəblə rədd edə, yaxud əməliyyat onun səlahiyyət sahəsinin xaricindədirsə onu ötürə bilər. Seçilmiş hakim bu hökmərin birləşməsini təmin edərək təlimatın, sorğunun və ya ifadənin davam edib-etməyəcəyinə qərar verir.

## Dəstəklənən Sorğular {#supported-queries}

İcazə tokenləri və rollar sorğulanıla bilər.

Rollar üçün sorğular:

- [`FindRoles`](/az/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/az/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/az/reference/queries.md#accounts-and-permissions)

İcazə tokenləri üçün sorğular:

- [`FindPermissionsByAccountId`](/az/reference/queries.md#accounts-and-permissions)
