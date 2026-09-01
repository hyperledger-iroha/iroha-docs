---
translation_locale: az
translation_source: /cookbook/native-escrow.md
translation_source_hash: 576e03924f19b63681cdfafa641b996672e35a992478fc9eaf5b83f0e7baa6da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Yerli Aktiv Əmanət {#native-asset-escrow}

## Nəticə {#outcome}

Bazar yarmarkası mühafizəsi ilə təyinat yönümlü aktiv kilidi arasında seçim edin, hazırkı yazılmış həyat dövrünü Rust və ya Python ilə icra edin, hər kilid təkrarını əslində müşahidə etdiyiniz qalan məbləğə bağlayın və yerli Kotodama mühafizə səthini JavaScript-dən yığın.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- Rəqəmsal aktivin tərifi və kifayət qədər miqdara sahib olan açan/satan.
- Hər bir addım təqdim edən tərəf üçün maliyyələşdirilmiş, tək açarlı I105 müştərilər. Cari Taira testnet maliyyələşdirmə xidməti cavabına uyğun ödəniş aktivinə malik əməliyyat imzalama hesabı `fee_payment` niyyəti ilə canlı istifadə edin; sənədləşmədən aktiv ID daxil etməyin.
- Hazırkı Rust və ya Python SDK Iroha protokolunun yekunlaşdırılmasından `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- JavaScript kompilyator nümunəsi üçün, Node.js 24 və yerli inkişaf mühitində qurulmuş `@iroha/iroha-js` paketi və onun yerli `iroha_js_host`; [JavaScript SDK mənbə-yaradılışı quraşdırması](/az/guide/tutorials/javascript.md#build-from-source) izləyin. Brauzer quruluşları yerli hostu yükləmək əvəzinə `compilerUrl` təqdim etməlidir.
- Taira aktivin köçürülməsini və vasitəçilik təlimatlarını təsdiqləməlidir. Aktiv sahibləri aktiv siyasətləri icazə verdikdə adi həyat dövründən istifadə edə bilərlər; bir mübahisə qlobal `CanResolveEscrowDispute` icazəsini tələb edir. Lazımi ictimai blokçeyn şəbəkəsi icazəsi əsas prinsipi olmadıqda yaradılmış yerli şəbəkədən istifadə edin.

Bazar yeri vasitəçilik modelləri satıcı, alıcı, çənkdən kənar ödəniş və sərbəst buraxmanı əhatə edir. Ümumi kilidlər bir təyinatı göstərir və istəyə bağlı olaraq fərqli bir sərbəst buraxma icazəsi prinsipi təyin edir; onlar qismən çıxarış, ləğv və müddətin bitməsini dəstəkləyir.

## Addımlar {#steps}

### 1. Rust ilə bazar yeri əmanətini tamamlayın {#_1-complete-a-marketplace-escrow-with-rust}

Bu funksiya real tipli ID-ləri və müştəriləri qəbul edir. 40 vahid açır, alıcının qəbul etməsinə və off-chain ödənişi işarələməsinə imkan verir, sonra satıcının saxlanmanı buraxmasına imkan verir. Hər təqdimat avtorizasiya əsasının ödənişçisini `FeePaymentIntent` vasitəsilə göstərir.

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

Əmanət hesabı blokçeyn dəftəri tərəfindən idarə olunur. Adi aktiv-transfer tokeni vermək, aktiv əmanətin eskro həyat dövrü xaricində boşaldıla biləcəyi mənasına gəlmir.

### 2. Ümumi bir kilidi Python ilə açın və qismən çəkin {#_2-open-and-partially-draw-a-generic-lock-with-python}

Buraxılış icazəsi prinsipi çəkilməzdən əvvəl imzalanmış yerli qeydi sorğulayır. Dəqiq `remaining_amount`-in göndərilməsi nikbin qarşılıqlı fəaliyyət təmin edir: köhnəlmiş paralel sorğu mühafizəni iki dəfə çıxmaq əvəzinə rədd edilir.

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

Python SDK `expected_remaining_amount` atlandıqda avtomatik olaraq sorğu verə bilər, lakin müşahidə olunan dəyəri göndərmək tətbiq kodunda imzalanmış iqtisadi şərti görünən edir.

Rust kilid axınları üçün, mövcud konstrukturlar da müşahidə olunan miqdarı tələb edir:

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

`DrawdownAssetLock::new` üç dəyər qəbul edir; `CancelAssetLock::new` iki dəyər qəbul edir. Gözlənilən qalan miqdarı buraxmaq köhnə, təhlükəsiz olmayan texniki çağırış formasını təsvir edir.

### 3. JavaScript üzərindən Kotodama əmanət səthini tərtib edin {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript tipi olmayan yerli təlimatlar ixtira etməyə ehtiyac yoxdur. Mövcud kompayler Kotodama-ə blokçeyn dəftər çölündəki escrow daxili funksiyalarını açır; yerləşdirmə və texniki çağırışlar sonra [Ağıllı müqavilə yaradın və yerləşdirin](./smart-contracts.md)-ə uyğun həyata keçirilir.

Bunu `native_escrow.ko` kimi yadda saxlayın:

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

Aşağıdakı məlumatı `compile-native-escrow.mjs` kimi yadda saxlayın və onu Node.js-dən həmin dəqiq mənbəni tərtib etmək üçün istifadə edin:

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

Tələb olunan ön şərtlərdə təsvir edilmiş mənbədən qurulmuş paket mühitindən işlədin:

```bash
node ./compile-native-escrow.mjs
```

## Yoxla {#verify}

Bazar yerdə mübadilə üçün, `FindAssetEscrowById` sorğusunu və buraxıldıqdan sonra hər iki tərəfin aktiv holdingsini sorğulayın. Qeyd `Released` olmalıdır, qəbul edən alıcının adını göstərin və heç bir qalan saxlanma olmamalıdır. Yuxarıdakı Python kilidi üçün, geri qaytarılan ID-ni saxlayın və imzalı sorğunu təkrarlayın:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Həmçinin, təyinat yerinin aktiv saxlamasını sorğulayın və dörd vahid artırıldığını təsdiqləyin. Escrow qeydi və təyinat sonrası vəziyyəti olmayan bir əməliyyat protokol nəticəsi qeydi natamam yoxlamadır.

## Problemlərin aradan qaldırılması {#troubleshooting}

- `Not permitted` açıq olarkən adətən o deməkdir ki, səlahiyyət sahibinin seçilmiş aktivləri saxlanmağa köçürə bilməməsidir. Mübahisələrin həlli üçün ayrıca qlobal `CanResolveEscrowDispute` qapısı mövcuddur.
- `expected remaining amount` rədd etmə optimist-sinxronizasiya qarşıdurmasıdır. Yazını yenidən sorğulayın, digər çıxarma/ləğvin nəzərdə tutulub-tutulmadığını müəyyən edin və yalnız yeni vəziyyət qəbulediləndirsə yeni təlimatı imzalayın.
- Yalnız konfiqurasiya olunmuş buraxılış icazəsi prinsipi etibarlı kilidi aça bilər. Məqsəd onun pul alacağına görə onu buraxa bilməz.
- Marketplace buraxılışı yalnız qəbul və ödəmə-göndərilmiş vəziyyətdən sonra etibarlıdır; ləğv əvvəlki həyat dövrü vəziyyətləri ilə məhdudlaşdırılır.
- Bitmə səlahiyyətli blokçeyn jurnal vaxtından istifadə edir. Yerli sistem saatının vaxt aşımını `ExpireAssetLock`-ın keçəcəyinə dair dəlil kimi qəbul etməyin.
- Ödənişin uğursuzluğu həmin həyat dövrü addımını təqdim edən tərəfə aiddir. Vəsait alıcısı, satıcı/açıcı və buraxılış səlahiyyəti sahibi müstəqil olaraq Taira-da.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Sabitlənmiş mənbə kodu versiyasında yerli eskro təlimat modeli](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Sabitlənmiş mənbə kodu versiyasında yerli eskro inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python pinlənmiş mənbə kodu reviziyasında escrow müştəri metodları](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama pinlənmiş mənbə kodu reviziyasında yerli əmanət nümunəsi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Yerli aktiv depoziti](/az/blockchain/escrow.md)
- [Mübadilə edilə bilən aktivlər](./fungible-assets.md)
- [İcazələr və rollar](./permissions-and-roles.md)
