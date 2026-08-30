---
translation_locale: ru
translation_source: /cookbook/native-escrow.md
translation_source_hash: aa8e079684879bdcda2b4439e9c12742d4ab477e6f560f7c326a59b6be5bf666
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Сберегательная задолженность за собственные активы {#native-asset-escrow}

## Результат {#outcome}

Выберите между конфискацией рынка и блокировкой активов, связанных с назначением, выполните текущий типовый жизненный цикл Rust или Python, свяжите каждую повторную попытку блокировки с оставшейся суммой, которую вы фактически наблюдали, и составите нативную поверхность конфискации Kotodama из JavaScript.

## Предварительные условия {#prerequisites}

- Цифровое определение активов и открыватель/продавец, владеющий достаточным количеством.
- Финансируемые, одноключевые клиенты I105 для каждой стороны, которая подает шаг. Используйте намерение `fee_payment`, которое оплачивается властями в режиме прямого времени и чьи платежные активы совпадают с текущим ответом на трубку Taira; не вставляйте актив ID из документации.
- Текущий Rust или Python SDK от Iroha обязательство `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- Для JavaScript пример компилятора, Node.js 24 плюс локально построенный `@iroha/iroha-js` упаковка и ее происхождение `iroha_js_host`; Следуйте [JavaScript SDK установка сборной источника](/ru/guide/tutorials/javascript.md#build-from-source). Создание браузера должно обеспечивать `compilerUrl` вместо того, чтобы загружать родного хозяина.
- Taira должен принимать инструкции по передаче активов и поручительству. Владельцы активов могут использовать обычный жизненный цикл, если это позволяет их политика в отношении активов; для разрешения споров требуется глобальное разрешение `CanResolveEscrowDispute`. Используйте генерируемую локальную сеть, когда отсутствует необходимый орган государственной сети.

Продавец, покупатель, платеж вне цепи и выпуск. Генерические замки называют место назначения и, возможно, отдельный орган выпуска; они поддерживают частичное снятие, отмену и истечение срока действия.

## Шаги {#steps}

### 1. Заполните депозит на рынке с помощью Rust {#_1-complete-a-marketplace-escrow-with-rust}

Эта функция получает реальные типовые IDs и клиенты. Она открывает 40 единиц, позволяет покупателю принимать и маркировать платежи вне цепи, а затем позволяет продавцу освободить опекунство. Каждое представление называет плательщика пошлины через `FeePaymentIntent`.

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

Придание нормального токена для передачи активов не делает активную конфиденциальность доступной за пределами жизненного цикла поручительства.

### 2. Открыть и частично нарисовать общий замк Python. {#_2-open-and-partially-draw-a-generic-lock-with-python}

Власть по освобождению запрашивает подписанный коренный протокол перед снятием. Предоставление точного `remaining_amount` обеспечивает оптимистичное совпадение: устаревший параллельный запрос отклоняется вместо того, чтобы дважды дебировать хранение.

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

Python SDK может автоматически запрашивать, когда `expected_remaining_amount` выпущен, но передача наблюдаемого значения делает подписанное экономическое предварительное условие видимым в коде заявления.

Для потоков блокировки Rust текущие конструкторы также требуют наблюдаемого количества:

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

`DrawdownAssetLock::new` принимает три значения; `CancelAssetLock::new` - два. Выключение ожидаемой остаточной суммы описывает более старую, небезопасную форму звонка.

### 3. Составление поверхности поручительства Kotodama из JavaScript {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript не нуждается в изобретении нетиповых коренных инструкций. Нынешний компилятор раскрывает встроенный в бухгалтерский регистр депозит на Kotodama; развертывание и вызовы последуют за [Создать и развертывать смарт-контракт](./smart-contracts.md).

Сохранить это как `native_escrow.ko`:

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

Сохранить следующее в качестве `compile-native-escrow.mjs` и использовать его для составления этого источника из Node.js:

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

Запустить его из исходной среды упаковки, описанной в предварительных условиях:

```bash
node ./compile-native-escrow.mjs
```

## Проверка {#verify}

Для депозита на рынке, запись `FindAssetEscrowById` и актива обеих сторон после выпуска. Запись должна быть `Released`, назвать принимающего покупателя и не показывать оставшегося хранилища. Для замка Python выше, сохранить возвращенный ID и повторить подписанное запрос:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Спросите также состояние активов пункта назначения и подтвердите, что оно увеличилось на четыре единицы. Квитанция сделок без записи о поручительстве и последующего уведомления о назначении является неполным подтверждением.

## Устранение неполадок {#troubleshooting}

- `Not permitted` в то время как открытие обычно означает, что орган не может передать выбранный актив на хранение. Решение споров имеет отдельный глобальный `CanResolveEscrowDispute` Ворота.
- `expected remaining amount` отказ - это конфликт оптимизма и конкуренции. Возобновить запись, решить, был ли намечен другой вывод/отмена, и подписать новое указание только в том случае, если новое состояние приемлемо.
- Только настраиваемый орган выпуска может нарисовать доверенный замок. Направление не может выпустить его просто потому, что он получит средства.
- Выпуск на рынке действителен только после получения и отправки платежа; отмена ограничивается более ранними состояниями жизненного цикла.
- По истечении срока действия используется авторитетный реестр времени. Не обращайтесь с местным временным сроком на стенные часы в качестве доказательства того, что `ExpireAssetLock` пройдет.
- Невыполнение сборов принадлежит стороне, подавшей этот шаг жизненного цикла. Покупатель, продавец/открывающий фонд и освобождающий орган независимо от: Taira.

## Источник и связанные с ним документы {#source-and-related-docs}

- [Нативная модель инструкций по поручительству на финированном обязательстве](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Тесты интеграции нативных депозитов при закрепленном обязательстве](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python методы кредиторского клиента при закрепленном обязательстве](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama образец коренных депозитов на финированном обязательстве](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Конфиденциальный депозит на активы ](/ru/blockchain/escrow.md)
- [Функциональные активы](./fungible-assets.md)
- [Разрешения и роли](./permissions-and-roles.md)
