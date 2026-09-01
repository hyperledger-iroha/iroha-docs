---
translation_locale: ru
translation_source: /cookbook/native-escrow.md
translation_source_hash: 576e03924f19b63681cdfafa641b996672e35a992478fc9eaf5b83f0e7baa6da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Эскроу для родных активов {#native-asset-escrow}

## Результат {#outcome}

Выберите между условным депозитом на рынке и блокировкой актива для назначения, выполните текущий набор операций жизненного цикла с Rust или Python, привяжите каждую повторную попытку блокировки к оставшейся сумме, которую вы фактически наблюдали, и скомпилируйте нативную поверхность условного депозита Kotodama из JavaScript.

## Предварительные требования {#prerequisites}

- Определение числового актива и инициатор/продавец, который владеет достаточным количеством.
- Финансируемые клиенты с одним ключом I105 для каждой стороны, которая отправляет шаг. Используйте живой аккаунт, оплачиваемый за подписание транзакций `fee_payment`, намерение, чей актив для комиссии соответствует текущему ответу службы финансирования тестнета Taira; не вставляйте идентификатор актива из документации.
- Текущая Rust или Python SDK от Iroha завершения протокола `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- Для примера компилятора JavaScript, Node.js 24 плюс встроенный в локальную среду разработки пакет `@iroha/iroha-js` и его родной `iroha_js_host`; следуйте [JavaScript SDK настройка source-build](/ru/guide/tutorials/javascript.md#build-from-source). Сборки для браузера должны предоставлять `compilerUrl` вместо загрузки родного хоста.
- Taira должен подтвердить передачу активов и инструкции по эскроу. Владельцы активов могут использовать обычный жизненный цикл, когда их политика активов это позволяет; решение Спор требует глобального разрешения `CanResolveEscrowDispute`. Используйте сгенерированную локальную сеть, когда отсутствует необходимый субъект авторизации публичной блокчейн-сети.

Модели условного депонирования на рынке включают продавца, покупателя, внецепочную оплату и выпуск. Общие блокировки указывают назначение и, при желании, отдельное лицо, уполномоченное на выпуск; они поддерживают частичное снятие, отмену и истечение срока.

## Шаги {#steps}

### 1. Завершите условное депонирование на рынке с Rust {#_1-complete-a-marketplace-escrow-with-rust}

Эта функция принимает настоящие типизированные идентификаторы и клиентов. Она открывает 40 единиц, позволяет покупателю принять и отметить оплату вне цепочки, затем позволяет продавцу освободить опекунство. Каждая подача назначает главного плательщика комиссии через `FeePaymentIntent`.

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

Счет хранения управляется распределенным реестром блокчейна. Предоставление обычного токена передачи активов не делает активное хранение снимаемым за пределами жизненного цикла эскроу.

### 2. Откройте и частично нарисуйте общий замок с Python {#_2-open-and-partially-draw-a-generic-lock-with-python}

Главный управляющий разрешением на выпуск запрашивает подписанную исходную запись перед снятием средств. Передача именно этого `remaining_amount` обеспечивает оптимистичную конкуренцию: устаревший параллельный запрос отклоняется вместо того, чтобы дважды списывать средства из опеки.

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

Python SDK может выполнять автоматический запрос, когда `expected_remaining_amount` опущен, но передача наблюдаемого значения делает подписанное экономическое предварительное условие видимым в коде приложения.

Для потоков блокировки Rust текущие конструкторы также требуют наблюдаемое количество:

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

`DrawdownAssetLock::new` принимает три значения; `CancelAssetLock::new` принимает два. Пропуск ожидаемой оставшейся суммы описывает старую, небезопасную форму технического вызова.

### 3. Скомпилируйте эскроу-поверхность Kotodama из JavaScript {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript не нужно изобретать немаркированные нативные инструкции. Текущий компилятор предоставляет Kotodama встроенные функции распределенного реестра блокчейн-эскроу; развертывание и технические вызовы затем следуют за [Создать и развернуть смарт-контракт](./smart-contracts.md).

Сохраните это как `native_escrow.ko`:

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

Сохраните следующее как `compile-native-escrow.mjs` и используйте это для компиляции точно этого исходного кода из Node.js:

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

Запустите это из среды пакета, собранного из исходников, как описано в разделе «Требования»:

```bash
node ./compile-native-escrow.mjs
```

## Проверить {#verify}

Для эскроу на рынке запросите `FindAssetEscrowById` и активы обеих сторон после освобождения. Запись должна быть `Released`, укажите принимающего покупателя и показать отсутствие остаточного хранения. Для вышеуказанной блокировки Python сохраните возвращённый идентификатор и повторите подписанный запрос:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Также запросите данные о владении активами у получателя и подтвердите, что оно увеличилось на четыре единицы. Запись о результате протокола транзакции без записи эскроу и постсостояния получателя является неполной проверкой.

## Устранение неполадок {#troubleshooting}

- `Not permitted` при открытии обычно означает, что полномочный представитель не может передать выбранный актив на хранение. Разрешение споров имеет отдельный глобальный `CanResolveEscrowDispute` шлюз.
- `expected remaining amount` отклонение является конфликтом оптимистической конкуренции. Повторно запросите запись, определите, было ли другое списание/отменение намеренным, и подпишите новую инструкцию только в том случае, если новое состояние приемлемо.
- Только настроенный основной субъект авторизации выпуска может снять доверенный замок. Пункт назначения не может его освободить только потому, что он получит средства.
- Выпуск на маркетплейсе действителен только после состояния «принято и оплата отправлена»; отмена ограничена более ранними стадиями жизненного цикла.
- Истечение срока использует авторитетное распределенное регистровое время блокчейна. Не рассматривайте истечение времени локальных системных часов как доказательство того, что `ExpireAssetLock` пройдет.
- Ошибка оплаты принадлежит стороне, подавшей этот этап жизненного цикла. Покупатель фонда, продавец/инициатор и лицо, уполномоченное на выпуск, независимо друг от друга на Taira.

## Исходные и связанные документы {#source-and-related-docs}

- [Модель инструкции условного депонирования на закреплённой версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Интеграционные тесты нативного эскроу на закрепленной ревизии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python методы клиента эскроу на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama образец нативного эскроу на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Эскроу нативного актива](/ru/blockchain/escrow.md)
- [Взаимозаменяемые активы](./fungible-assets.md)
- [Разрешения и роли](./permissions-and-roles.md)
