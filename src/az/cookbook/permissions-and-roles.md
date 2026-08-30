---
translation_locale: az
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 7ee18275d25837da53f533f5e9205906ccaa71b48afd9b11ffad79b599da7f21
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# İzinlər və rollar {#permissions-and-roles}

## Nəticə {#outcome}

Bir hesab üçün meta məlumatları yeniləməyə icazə verən bir rol yaratın, onu bir nümayəndəyə təyin edin, təyin edilmiş yazıyı sübut edin və müvafiq Rust tapılmış təlimatları göstərin.

## Əvvəlki şərtlər {#prerequisites}

- Taira maliyyələşdirilən müştəri və ödəniş metadataları [Nəqliyyat vasitəsilə Taira ](./connect-to-taira.md) ilə əlaqə saxlayın.
- `TARGET_ACCOUNT` və `DELEGATE_ACCOUNT` kanonik olaraq müəyyən edilmişdir. I105 hesab IDs.
- İmzalanma hesabına hədəf icazələrini və rollarını idarə etməyə icazə verilməlidir. Taira-də bu, icazə qapalı bir inzibati əməliyyatdır; `CanManageRoles` və məhdudlaşdırılmış icazə vermək üçün lazım olan orqanı əldə edin və ya resepti istehsal olunan yerli şəbəkədə icra edin.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Yazı sübut edərkən nümayəndə üçün ikinci müştəri konfigurasiyasından istifadə edin:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Dərslər {#steps}

### 1. Boş rol qeyd edin. {#_1-register-an-empty-role}

Hər bir dövlət dəyişən CLI əmri ödəniş ödəyicisini açıq şəkildə adlandırır. Metadata faylında kran cavabından əldə edilmiş mövcud Taira ödəniş aktivləri var.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Hədəf hesabına müəyyən edilmiş icazə əlavə edin. {#_2-add-a-permission-scoped-to-the-target-account}

İzin simvolları JSON obyektləri ilə yazılır. Hesabı `payload` daxilində I105 ID olaraq saxlayın; bu sərt sahədə bir alias etibarlı deyil.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Rolu nümayəndəyə təyin edin. {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Rollar və onların təqaüdləri bitmir, artıq giriş lazım olmadıqda onları açıq şəkildə ləğv etmək lazımdır.

### 4. Deleqasiya edilmiş icazədən istifadə edin {#_4-exercise-the-delegated-permission}

JSON dəyərləri standart girişdən oxunur.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Eyni model Rust Müştərilər. `client` əlamətləri `registrar_account`, Bu, rolun ilk sahibi olur. CLI Hər üç hesab dəyişənləri artıq təhlil edilmişdir `AccountId` Qiymətlər:

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

## Tətbiq edin {#verify}

İşin hər iki tərəfini qeyd edin və sonra nümayəndə tərəfindən yazılan dəqiq qiyməti oxuyun:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

İzinlərin siyahısında `CanModifyAccountMetadata` ilə `TARGET_ACCOUNT` məzmunlu olmalıdır, nümayəndənin rol siyahısında `ROLE_ID` olmalıdır və oxunan metadatalar `"delegated"` qaytarılmalıdır.

## Problemlərin həlli {#troubleshooting}

- `Not permitted` rolu qeydiyyatdan keçirərkən, redaktə edərkən və ya təyin edərkən imzalananın tələb olunan Taira səlahiyyətinin olmaması deməkdir. Məqsədli tokenı qlobal birinə əvəz etməyin; dəqiq hədiyyə istəyin və ya localnetdən istifadə edin.
- Fəaliyyət yükü analizində bir səhv ümumiyyətlə `account` `payload`-nin yanında yerləşdirildiyini, I105 ID əvəzinə bir alias verildiyini və ya JSON dəyərinin iki dəfə qeyd edildiyini göstərir.
- Bir ödənişin rədd edilməsi bu addımı təqdim edən imzalanan şəxsə məxsusdur. Müdiri maliyyələşdirir və müstəqil olaraq səlahiyyətlərini icra edir və faucetdən alınan ödəniş aktivinin metadatalarını saxlayır.
- Müvəffəqiyyətli bir rol verilməsi tokenlarında kodlanmış məkanı əldən götürmür.Bu rol yalnız icazə yükündə adı çəkilən hesabı dəyişdirə bilər.
- Təmizləmək üçün `ledger account role revoke`, sonra `ledger role permission revoke` və nəhayət `ledger role unregister` çalışdırın; hər biri ayrı bir yazıdır və `--fee-payer authority` və ödəniş metadataları olmalıdır.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Qeydiyyatlı komitdə rol inteqrasiyası sınaqları](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Qeydiyyatlı komitdə icazə inteqrasiya sınaqları](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Bağlanmış commit-də quraşdırılmış icazə veri modeli](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [icazələr və rollar ](/az/blockchain/permissions.md)
- [İzinləmə nömrəsinə istinad](/az/reference/permissions.md)
- [Metadata](./metadata.md)
