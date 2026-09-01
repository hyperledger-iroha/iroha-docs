---
translation_locale: az
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# İcazələr və Rollar {#permissions-and-roles}

## Nəticə {#outcome}

Bir hesabın metadatasını yeniləmək icazəsi verən bir rol yaradın, onu nümayəndəyə təyin edin, təyin olunan yazını sübut edin və müvafiq typed Rust təlimatları göstərin.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- Maliyyələşdirilmiş Taira müştəri və [Taira-ə qoşul](./connect-to-taira.md) məlumatlarından ödəniş metadatası.
- `TARGET_ACCOUNT` və `DELEGATE_ACCOUNT` tək protokol-standart I105 hesab ID-lərinə təyin edildi.
- İmzalama hesabına hədəf icazə və rolları idarə etmək icazəsi verilməlidir. Taira-də bu icazəyə məhdudlaşdırılmış inzibati əməliyyatdır; `CanManageRoles`-ı və mənzilli icazəni vermək üçün lazım olan avtorizasiya prinsipini əldə edin, yoxsa reçeti yaradılmış yerli şəbəkədə işə salın.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
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

Hər bir dövlət dəyişdirən CLI əmri ödənişi edən şəxsi açıq şəkildə adlandırır. Metaməlumat faylı testnet maliyyələşdirmə xidməti cavabından əldə edilən cari Taira ödəniş aktivini ehtiva edir.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Hədəf hesabına yönəlmiş icazə əlavə edin {#_2-add-a-permission-scoped-to-the-target-account}

İcazə tokenləri JSON tipli obyektlərdir. Hesabı `payload` daxilində I105 ID kimi saxlayın; bu ciddi sahədə ləqəb etibarlı deyil.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Vəzifəni nümayəndəyə təyin edin {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
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
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Eyni model Rust müştəriləri üçün mövcuddur. Burada `client` `registrar_account` kimi imzalayır, bu da rolun ilkin sahibləri olur, elə CLI axınında olduğu kimi. Üç hesab dəyişəni artıq `AccountId` dəyərləri kimi ayrılmışdır:

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

## Yoxla {#verify}

Tapşırığın hər iki tərəfini siyahıya al, sonra nümayəndənin yazdığı dəqiq dəyəri oxu:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

İcazə siyahısı `CanModifyAccountMetadata`-ı `TARGET_ACCOUNT` sahəsinə aid olmalıdır, nümayəndənin rol siyahısı `ROLE_ID`-i əhatə etməlidir və metada oxuma `"delegated"`-ü qaytarmalıdır.

## Problemlərin aradan qaldırılması {#troubleshooting}

- `Not permitted` qeydiyyat, redaktə və ya rol təyin edərkən kriptoqrafik imzalayan tələb olunan Taira avtorizasiya prinsipinə malik deyil. Scoped tokeni qlobal tokenlə əvəz etməyin; dəqiq icazəni tələb edin və ya localnet-dən istifadə edin.
- Yük bölməsi təhlil xətası adətən o deməkdir ki, `account` `payload`-in yanında yerləşdirilib, I105 ID əvəzinə ləqəb verilib və ya JSON dəyəri iki dəfə sitat daxilində yazılıb.
- Bir ödəniş rədd edilməyi həmin addımı təqdim edən kriptoqrafik imzalayana aiddir. Meneceri və nümayəndəni müstəqil olaraq maliyyələşdirin və kran-damğalı ödəniş aktivinin metadatasını saxlayın.
- Uğurlu bir rol verilməsi, onun tokenlərində kodlanmış sahəni ləğv etmir. Bu rol yalnız icazə məlumatında göstərilən hesabı dəyişdirə bilər.
- Təmizləmək üçün əvvəlcə `ledger account role revoke`, sonra `ledger role permission revoke` və nəhayət `ledger role unregister` işlədin; hər biri ayrıca yazıdır və `--fee-payer authority` və ödəniş metadatasını daxil etməlidir.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Sabitlənmiş mənbə kodu revisiyasında rol inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [İcazə inteqrasiya testləri pinlənmiş mənbə kodu reviziyasında](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Sabitlənmiş mənbə kodu versiyasında daxili icazə məlumat modeli](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [İcazələr və rollar](/az/blockchain/permissions.md)
- [İcazə tokeni istinadı](/az/reference/permissions.md)
- [Metaməlumat](./metadata.md)
