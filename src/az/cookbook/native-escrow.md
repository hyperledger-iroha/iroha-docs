---
translation_locale: az
translation_source: /cookbook/native-escrow.md
translation_source_hash: aa8e079684879bdcda2b4439e9c12742d4ab477e6f560f7c326a59b6be5bf666
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Dövlət vəsaitinin kreditləşdirilməsi {#native-asset-escrow}

## Nəticə {#outcome}

Marketplace escrow və destination-bound asset lock arasında seçim edin, Rust və ya Python ilə mövcud tiplənmiş həyat dövrünü icra edin, hər bir qapanı yenidən müşahidə etdiyiniz qalan məbləğə bağlayın və yerli Kotodama escrow səthini JavaScript -dən tərtib edin.

## Əvvəlki şərtlər {#prerequisites}

- Rəqəmli aktiv tərifi və kifayət qədər miqdarda sahib olan açıcı/satıcı.
- Maliyyələşdirilmiş, tək açarlı I105 Hər bir tərəf üçün müştərilər. `fee_payment` maliyyələşdirmə vəsaitinin mövcud Taira faucet cavabı; aktiv daxil etməyin ID sənədlərdən alınır.
- Rust və ya Python SDK axınları Iroha səlahiyyətindən `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- İcra Hakimiyyəti JavaScript kompilyer nümunəsi, Node.js 24 ədəd əlavə olaraq yerli qurulmuş `@iroha/iroha-js` paket və onun mənşəli `iroha_js_host`; izləmək [JavaScript SDK mənbə quruluşunun quraşdırılması](/az/guide/tutorials/javascript.md#build-from-source). Browser qurğuları təmin etməlidir `compilerUrl` Yerli ev sahibi yükləmək əvəzinə.
- Taira aktivlərin ötürülməsi və əmanət verilməsinə dair göstərişləri qəbul etməlidir. Əmlak sahibləri normal həyat dövründən istifadə edə bilərlər, əgər onların əmlak siyasəti buna imkan verirsə; mübahisənin həlli üçün qlobal `CanResolveEscrowDispute` icazəsi tələb olunur. Lazım olan ictimai şəbəkə orqanının olmaması halında yaradılmış yerli şəbəkəni istifadə edin.

Marketplace escrow modelləri satıcı, alıcı, zəncirdən kənar ödəniş və buraxılış. Ümumi kilidlər bir məqsədi və seçim yolu ilə ayrı bir buraxılış səlahiyyətini təyin edir; qismən çəkilmə, ləğv və müddətin bitməsini dəstəkləyirlər.

## Dərslər {#steps}

### 1. Rust vasitəsilə bazar əmanətini tamamlayın {#_1-complete-a-marketplace-escrow-with-rust}

Bu funksiya real IDs və müştəriləri alır. O, 40 vahidi açır, alıcıya zəncirdən kənar ödənişi qəbul etməyə və qeyd etməyə imkan verir, sonra satıcının saxlama hüququnu azad etməyə imkan verir. Hər təqdimat `FeePaymentIntent` vasitəsilə səlahiyyət haqqı ödənən şəxsə ad verir.

```rust
use eyre::{Result, ensure};
use iroha::{
    client::Client,
    data_model::{
        isi::escrow::{
            AcceptAssetEscrow, MarkEscrowPaymentSent, OpenAssetEscrow,
            ReleaseAssetEscrow,
        },
        prelude::*,
        transaction::FeePaymentIntent,
    },
};
use iroha_crypto::Hash;

fn complete_marketplace_escrow(
    seller: &Client,
    buyer: &Client,
    escrow_id: EscrowId,
    asset_definition: AssetDefinitionId,
) -> Result<AssetEscrowRecord> {
    let fee = FeePaymentIntent::authority(Vec::new(), None);

    seller.submit_blocking(
        OpenAssetEscrow::with_evidence_hashes(
            escrow_id,
            asset_definition,
            Quantity::from(40_u64),
            vec![Hash::new("cookbook-fiat-invoice")],
        ),
        fee.clone(),
    )?;
    buyer.submit_blocking(AcceptAssetEscrow::new(escrow_id), fee.clone())?;
    buyer.submit_blocking(MarkEscrowPaymentSent::new(escrow_id), fee.clone())?;
    seller.submit_blocking(ReleaseAssetEscrow::new(escrow_id), fee)?;

    let record = seller.query_single(FindAssetEscrowById::new(escrow_id))?;
    ensure!(record.status == AssetEscrowStatus::Released);
    Ok(record)
}
```

Qoruyucu hesabı nəşriyyatda idarə olunur. Normal bir aktiv köçürmə nişanının verilməsi aktiv qoruyucuları əmtəənin həyat dövründən kənarda boşaltmağa imkan vermir.

### 2. Python ilə ümumi kilid açın və qismən çəkin. {#_2-open-and-partially-draw-a-generic-lock-with-python}

İstifadə orqanı imzalanmış yerli qeydiyyatdan çıxarılmadan əvvəl soruşur. Bu dəqiq `remaining_amount` ötürülməsi optimist bir bərabərlik təmin edir: iki dəfə saxlama haqqını ödəmək əvəzinə köhnəlmiş paralel müraciət rədd edilir.

```python
import secrets
import time
from decimal import Decimal


def escrow_status(record):
    status = record["status"]
    if isinstance(status, dict):
        return status.get("status", status.get("kind"))
    return str(status)


def open_and_draw_lock(
    *,
    client,
    chain_id,
    opener,
    opener_private_key,
    release_authority,
    release_private_key,
    destination,
    asset_definition_id,
    fee_payment,
):
    escrow_id = f"cookbook_lock_{secrets.token_hex(12)}"

    client.open_asset_lock_and_wait(
        chain_id=chain_id,
        authority=opener,
        private_key=opener_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        asset_definition_id=asset_definition_id,
        destination=destination,
        amount="10",
        release_authority=release_authority,
        expires_at_ms=int(time.time() * 1000) + 3_600_000,
        wait=True,
    )

    before = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        private_key=release_private_key,
    )
    client.drawdown_asset_lock_and_wait(
        chain_id=chain_id,
        authority=release_authority,
        private_key=release_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        amount="4",
        expected_remaining_amount=before["remaining_amount"],
        wait=True,
    )
    after = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        private_key=release_private_key,
    )

    assert escrow_status(before) == "Locked"
    assert Decimal(str(before["remaining_amount"])) == Decimal("10")
    assert escrow_status(after) == "Locked"
    assert Decimal(str(after["remaining_amount"])) == Decimal("6")
    return escrow_id, after
```

Python SDK `expected_remaining_amount` buraxıldıqda avtomatik olaraq sorğu edə bilər, lakin müşahidə edilmiş dəyərdən keçmək imzalanmış iqtisadi şərti tətbiq kodunda görünməyə imkan verir.

Rust bağlanma axınları üçün hazırkı konstruktorlar eyni zamanda müşahidə olunan miqdarı tələb edirlər:

```rust
let before = opener.query_single(FindAssetEscrowById::new(lock_id))?;
release_authority.submit_blocking(
    DrawdownAssetLock::new(
        lock_id,
        Quantity::from(4_u64),
        before.remaining_amount,
    ),
    FeePaymentIntent::authority(Vec::new(), None),
)?;

let current = opener.query_single(FindAssetEscrowById::new(lock_id))?;
opener.submit_blocking(
    CancelAssetLock::new(lock_id, current.remaining_amount),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

`DrawdownAssetLock::new` üç dəyər alır; `CancelAssetLock::new` iki. Gözlənilən qalan məbləği buraxmaq daha qədim, təhlükəsiz olmayan zəng formasını təsvir edir.

### 3. Kotodama əmanət səthini JavaScript-dən tərtib edin. {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript tiplənməmiş yerli təlimatları icad etməyə ehtiyac yoxdur. Hal-hazırda kompilyer əsas kitabın əmanətnaməsini daxildir Kotodama; yerləşdirmə və çağırışlar sonra izləyir [Ağıllı müqavilə qurun və yerləşdirin](./smart-contracts.md) .

Bunu `native_escrow.ko` kimi saxlayın:

```kotodama
seiyaku NativeEscrowAitai {
    error enum EscrowError {
        NonPositiveAmount = 1,
    }

    kotoage fn open_offer(
        Name offer,
        AssetDefinitionId asset_definition,
        quantity amount
    ) authorize("Admin") {
        require(amount > 0, EscrowError::NonPositiveAmount);
        ledger::escrow::open_offer(
            offer: offer,
            asset_definition: asset_definition,
            amount: amount,
        );
    }
}
```

Aşağıdakıları `compile-native-escrow.mjs` kimi saxlayın və onu Node.js-dən bu dəqiq mənbəyi tərtib etmək üçün istifadə edin:

```js
import { readFile } from 'node:fs/promises'
import { compileKotodamaProgram } from '@iroha/iroha-js/kotodama-compiler'

const source = await readFile('./native_escrow.ko', 'utf8')

const result = await compileKotodamaProgram(source, {
  sourceName: 'native_escrow.ko',
})
if (!result.ok) {
  throw new Error(JSON.stringify(result.diagnostics, null, 2))
}
console.log({
  codeHashHex: result.output.codeHashHex,
  entrypoints: result.output.manifest.entrypoints.map(({ name }) => name),
})
```

Əvvəlki şərtlərdə təsvir olunan mənbə qurulmuş paket mühitindən çalışdırın:

```bash
node ./compile-native-escrow.mjs
```

## Tətbiq edin {#verify}

Marketplace escrow üçün, sorğu `FindAssetEscrowById` və hər iki tərəfin sərmayə saxlamaları buraxıldıqdan sonra. qeydlər `Released` olmalıdır, qəbul edən alıcının adını göstərin və qalan saxlanma olmadığını göstərin. Yuxarıdakı Python kilidi üçün geri qaytarılan ID tutun və imzalanan sorğunu təkrarlayın:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Həmçinin istiqamətin aktiv saxlamalarını soruşun və onun dörd birliyə artdığını təsdiqləyin. Əməliyyat rəsmiləri və hədəf post-dövləti olmayan bir əməliyyat qəbulu tam yoxlanılma deyil.

## Problemlərin həlli {#troubleshooting}

- `Not permitted` Açılış ümumiyyətlə o deməkdir ki, səlahiyyətli şəxs seçilmiş aktivin saxlanılmasına icazə vermir. Münaqişələrin həlli ilə bağlı ayrı qlobal `CanResolveEscrowDispute` Qapı.
- `expected remaining amount` rədd optimist-tərəfdaşlıq münaqişəsidir. Hesabatı yenidən soruşun, digər geri çəkilmə / ləğv edilməsi nəzərdə tutulub-olmadığını qərar verin və yalnız yeni vəziyyət qəbuledirsə, yeni bir göstərici imzalayın.
- Yalnız konfiqurasiya edilmiş buraxılış səlahiyyəti etibarlı bir kilidi çəkə bilər. Məqsəd onu yalnız pul alacağı üçün buraxmaq olmaz.
- Bazarda buraxılış yalnız qəbul və ödəniş göndərilmədən sonra etibarlıdır; ləğv daha əvvəlki həyat dövrü dövlətləri ilə məhdudlaşdırılır.
- İfadə müddəti etibarlı kitab vaxtı istifadə edir. Yerli divar saatı vaxtının `ExpireAssetLock` keçəcəyini sübut etmək üçün qəbul etməyin.
- Ödənişdən imtina edən tərəf həmin həyat dövrü addımını təqdim etməlidir. Fondun alıcısı, satıcı/açışı və sərbəst buraxma səlahiyyəti Taira.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Yüklənmiş komitdə yerli escrow təlimat modeli ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Qeydiyyatdan keçirilən məbləğdə yerli depozit inteqrasiya sınaqları](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python əmanət müştəri metodları bağlanmış həcmdə](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama bağlanmış məbləğdəki yerli əmanət nümunəsi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Yerli aktivlərin vəsiqəsi ](/az/blockchain/escrow.md)
- [Fungible assets](./fungible-assets.md)
- [icazələr və rollar ](./permissions-and-roles.md)
