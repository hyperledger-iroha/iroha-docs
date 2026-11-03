---
translation_locale: az
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# İcazələr və Rollar {#permissions-and-roles}

## Nəticə {#outcome}

Bir hesabın metadatasını yeniləmək icazəsi verən bir rol yaradın, onu nümayəndəyə təyin edin, təyin olunan yazını sübut edin və müvafiq typed Rust təlimatları göstərin.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- [Taira-ya qoşulun](./connect-to-taira.md) səhifəsindən maliyyələşdirilmiş Taira müştərisi.
- `TARGET_ACCOUNT` və `DELEGATE_ACCOUNT` tək protokol-standart I105 hesab ID-lərinə təyin edildi.
- İmzalayan hesabın `CanManageRoles` icazəsi olmalı və o, əhatəsi məhdud icazəni həvalə edə bilməlidir: ya `TARGET_ACCOUNT` hesabının özüdür, ya da həmin hesab üçün artıq `CanModifyAccountMetadata` icazəsinə malikdir. Taira-da bu, icazə ilə qorunan inzibati əməliyyatdır. Yaradılmış lokal şəbəkənin müştərisində `CanManageRoles` yoxdur, buna görə resept genezisi bu icazəni verən şəbəkə tələb edir.

```bash
CONFIG=./taira.client.toml
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Yazmağı sübut edərkən nümayəndə üçün ikinci müştəri konfiqurasiyasından istifadə edin:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Addımlar {#steps}

### 1. Boş bir rol qeydiyyatdan keçirin {#_1-register-an-empty-role}

Vəziyyəti dəyişən hər CLI əmri ödəyicini açıq şəkildə göstərir. CLI imzalamadan əvvəl dəqiq haqqı Taira-nın ödəniş aktivində hesablayıb göstərir.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. Hədəf hesabına yönəlmiş icazə əlavə edin {#_2-add-a-permission-scoped-to-the-target-account}

İcazə tokenləri JSON tipli obyektlərdir. Hesabı `payload` daxilində I105 ID kimi saxlayın; bu ciddi sahədə ləqəb etibarlı deyil.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Vəzifəni nümayəndəyə təyin edin {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Rollar və onların icazələri müddəti bitmir. Erişim artıq lazım olmadıqda onları açıq şəkildə geri götürün.

### 4. Tapşırılmış icazəni həyata keçirin {#_4-exercise-the-delegated-permission}

Yazma əməliyyatı üçün nümayəndənin kriptoqrafik imzalayıcısından və ödəniş balansından istifadə edin. JSON dəyərləri standart girişdən oxunur.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Eyni model Rust müştəriləri üçün də mövcuddur. Burada `client` `registrar_account` kimi imzalayan `iroha::blocking::Client` obyektidir; CLI axınında olduğu kimi, bu hesab rolun ilkin sahibi olur. Üç hesab dəyişəninin hamısı artıq təhlil edilmiş `AccountId` dəyərləridir:

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

## Yoxla {#verify}

Nümayəndənin rollar vasitəsilə verilmiş icazələr də daxil olmaqla qüvvədə olan icazələrini oxuyun, sonra nümayəndənin yazdığı dəqiq dəyəri oxuyun:

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

Nümayəndənin qüvvədə olan icazələri `TARGET_ACCOUNT` ilə məhdudlaşdırılmış `CanModifyAccountMetadata` icazəsini ehtiva etməli, metadata oxunuşu isə `"delegated"` qaytarmalıdır. Torii imzalı sorğular vasitəsilə rol siyahılarını vermir, buna görə təyinatın yoxlanması qüvvədə olan icazələrin siyahısı ilə aparılır.

## Problemlərin aradan qaldırılması {#troubleshooting}

- Rolu qeydiyyatdan keçirərkən, redaktə edərkən və ya təyin edərkən `Not permitted` imzalayanın Taira-da tələb olunan səlahiyyətə malik olmadığını bildirir. Əhatəsi məhdud tokeni qlobal token ilə əvəz etməyin; dəqiq icazənin verilməsini tələb edin.
- Yük bölməsi təhlil xətası adətən o deməkdir ki, `account` `payload`-in yanında yerləşdirilib, I105 ID əvəzinə ləqəb verilib və ya JSON dəyəri iki dəfə sitat daxilində yazılıb.
- Ödənişin rədd edilməsi həmin addımı təqdim edən imzalayana aiddir. Meneceri və nümayəndəni hər ödəniş qiyməti təxminində göstərilən ödəniş aktivində ayrı-ayrılıqda maliyyələşdirin.
- Uğurlu bir rol verilməsi, onun tokenlərində kodlanmış sahəni ləğv etmir. Bu rol yalnız icazə məlumatında göstərilən hesabı dəyişdirə bilər.
- Təmizləmək üçün `account role revoke`, sonra `ledger role permission revoke` və nəhayət `ledger role unregister` işə salın; hər biri ayrıca yazma əməliyyatıdır və `--fee-payer authority` ehtiva etməlidir.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Sabitlənmiş mənbə kodu revisiyasında rol inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [İcazə inteqrasiya testləri pinlənmiş mənbə kodu reviziyasında](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [Sabitlənmiş mənbə kodu versiyasında daxili icazə məlumat modeli](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [İcazələr və rollar](/az/blockchain/permissions.md)
- [İcazə tokeni istinadı](/az/reference/permissions.md)
- [Metaməlumat](./metadata.md)
