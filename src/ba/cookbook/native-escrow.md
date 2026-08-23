---
translation_locale: ba
translation_source: /cookbook/native-escrow.md
translation_source_hash: 0185b6a341ee90ed6cd52fb9f510549b20592468abe6627d3efa639c3b67d1fd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Туған активтар иҫәбенә кредит {#native-asset-escrow}

## Һөҙөмтә {#outcome}

Баҙарҙа депозит һәм маҡсатҡа бәйле актив бикләү араһында һайлау, ғәмәлдәге типланған ғүмере циклын башҡарыу менән Rust йәки Python, бәйләп, һәр йоҙаҡ ҡабаттан һеҙ ысынлап та күҙәткән ҡалған суммаға, һәм тыуған Kotodama Һаҡлыҡтың өҫкө йөҙө JavaScript.

## Шарттар {#prerequisites}

- Санлы активтар билдәләмәһе һәм етерлек күләмдә булған асыусы/сатыусы.
- Берҙән-бер асҡыс менән финансланған I105 клиенттар өсөн һәр партияһы баҫҡыс тапшыра. ҡулланыу туранан-тура власть түләүле `fee_payment` маҡсат, уның түләү активы ағымдағы Taira кранға яуап биреү; активты ҡуймағыҙ ID документтарҙан.
- Хәҙерге Rust йәки Python SDK Iroha йөкләмәһе `bc7114ed1c7f265a156d2100ff09e851cc95702c`.
- өсөн JavaScript компилятор миҫалы, Node.js 24 плюс урындағы төҙөлгән `@iroha/iroha-js` пакеты һәм уның сығышы `iroha_js_host`; күҙәтеү [JavaScript SDK сығанаҡ төҙөлөшөн көйләү](/ba/guide/tutorials/javascript.md#build-from-source). Браузер төҙөү тәьмин ителергә тейеш `compilerUrl` урындағы хужаны йөкләү урынына.
- Taira активтар күсереү һәм һаҡланыу инструкцияларын ҡабул итергә тейеш. Аҡса хужалары ғәҙәттәгесә йәшәү циклын ҡуллана ала, әгәр уларҙың актив сәйәсәте рөхсәт итһә; бәхәстәрҙе хәл итеү өсөн глобаль `CanResolveEscrowDispute` рөхсәтен талап итә.

Баҙарҙа эскроу моделдәрен һатыусы, һатып алыусы, селтәрҙән тыш түләү һәм сығарыу. Дөйөм бикләүҙәр тәғәйенләнешен һәм мөмкинселек буйынса айырым сығарыу хоҡуғын атай; улар өлөшләтә түләтеүҙе, бөтөрөүҙе һәм ваҡытын тамамлауҙы тәьмин итә.

## Аҙымдар {#steps}

### 1. Rust менән баҙарҙа һаҡланған аҡсаны тултырығыҙ {#_1-complete-a-marketplace-escrow-with-rust}

Был функция ысын типтағы IDs һәм клиенттарҙы ала. Ул 40 берәмекте аса, һатып алыусыға сылбырҙан тыш түләүҙе ҡабул итергә һәм билдәләргә мөмкинлек бирә, һуңынан һатыусыға һаҡлыҡты азат итергә мөмкинлек бирә. Һәр тапшырыу хоҡуҡ түләүсе исемен `FeePaymentIntent` аша атай.

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

Һаҡлыҡ иҫәбенә иҫәп-хисап менән идара ителә. Ғәҙәттәгесә активтарҙы күсереү өсөн токен биреү актив һаҡлыҡты гарантиялы тормош циклынан тыш файҙаланыуға мөмкин итмәй.

### 2. Python менән дөйөм бикләүҙе асығыҙ һәм өлөшләтә төшөрөгөҙ. {#_2-open-and-partially-draw-a-generic-lock-with-python}

Азат итеү власы ҡул ҡуйылған туғандаш яҙманан яҙылыу алдынан һорау ала. был теүәл `remaining_amount` тапшырыу оптимистик бер үк ваҡытталыҡ бирә: һаҡлыҡты ике тапҡыр дебютлау урынына, иҫкергән параллель ғариза кире ҡағыла.

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

Python SDK автоматик һорау бирә ала, әгәр `expected_remaining_amount` ҡалдырылһа, әммә күҙәтелгән ҡиммәтте тапшырыу ҡул ҡуйылған иҡтисади алдан билдәләүҙе ҡушымта кодында күренеп тора.

Rust бикләү ағымы өсөн, ағымдағы конструкторҙар шулай уҡ күҙәтелгән күләмде талап итә:

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

`DrawdownAssetLock::new` өс баһа ала; `CancelAssetLock::new` ике. көтөлгән ҡалған сумманы ситләтеү иҫке, хәүефһеҙ булмаған шылтыратыу формаһын һүрәтләй.

### 3. Kotodama иҫәбенә JavaScript иҫәбен алыу. {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript тибы булмаған урындағы күрһәтмәләрҙе уйлап табырға кәрәкмәй. Хәҙерге компилятор иҫәп-хисап ҡаҙнаһы эскровының Kotodama составында төҙөлгәнен аса; урынлаштырыу һәм саҡырыуҙар һуңынан [Аҡыллы килешеү төҙөү һәм урынлаштырыу](./smart-contracts.md).

`native_escrow.ko` тип һаҡлағыҙ:

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

Түбәндәгеләрҙе `compile-native-escrow.mjs` тип һаҡлағыҙ һәм был мәғлүмәтте Node.js сығанағынан туплау өсөн ҡулланығыҙ:

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

Кәрәкле шарттарҙа һүрәтләнгән сығанаҡ-төҙөлгән пакет мөхитенән уны эшләтеп ебәреү:

```bash
node ./compile-native-escrow.mjs
```

## Тикшереү {#verify}

Баҙарҙа һаҡланған аҡса өсөн һорау `FindAssetEscrowById` һәм ике яҡтың да активтарын сығарылғандан һуң тотоу. `Released`, Ҡабул итеүсе һатып алыусы исемен атағыҙ, һәм ҡалмаған һаҡсылыҡ күрһәтегеҙ. Python өҫтәмә бикләү, кире ҡайтарылған ID һәм ҡул ҡуйылған һорауҙы ҡабатла:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Шулай уҡ киләсәктең активтарын һорау һәм уның дүрт берәмеккә артҡанын раҫлау. Транзакция квитанцияһы иҫәбеһеҙ һәм тәғәйенләнешенән һуң билдәләнмәгән, тулы булмаған тикшереү булып тора.

## Проблемаларҙы хәл итеү {#troubleshooting}

- `Not permitted` асылған ваҡытта, ғәҙәттә, орган һайланған активты һаҡ аҫтына ала алмай тигәнде аңлата. Яуызлыҡтарҙы хәл итеүгә айырым глобаль `CanResolveEscrowDispute` Ҡапҡа.
- `expected remaining amount` кире ҡағыу оптимистик-конкуренция конфликты булып тора. рекорды ҡабаттан һорағыҙ, башҡа түләтеү / бөтөрөү ҡаралғанмы икәнен хәл итегеҙ һәм яңы күрһәтмәгә ҡул ҡуйығыҙ, тик әгәр яңы дәүләт ҡабул ителә икән.
- Бары тик конфигурацияланған иреккә сығарыу органы ғына ышаныслы бик төшөрә ала. Юлға сығыу урыны аҡсаны аласаҡ өсөн генә уны иреккә сығара алмай.
- Баҙарҙа сығарыу ҡабул итеү һәм түләү ебәреү дәүләтенән һуң ғына ғәмәлдә була; ғәмәлдән сығарыу тәүге йәшәү циклы дәүләттәренә генә сикләнә.
- Иҫәпкә алыу ваҡыты иҫәбенә ҡулланыу. `ExpireAssetLock` үтәсәгенә дәлил итеп урындағы стена сәғәтенең ваҡытын ҡарамағыҙ.
- Аҡсаны түләмәй ҡалһа, был ғүмер циклы этабын тапшырған яҡҡа ҡарай. Фонд һатып алыусыһы, һатыусы/асыҡлаусы һәм иреккә сығарыу власы үҙ аллы Taira.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Туған эскроу инструкцияһы моделе ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/isi/escrow.rs)
- [Туған эскроу интеграцияһы һынауҙары ҡуйылған йөкләмә буйынса](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/native_escrow.rs)
- [Python конфиденциаль клиенттарҙың билдәләнгән йөкләмә буйынса алымдары](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama фиктив commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/native_escrow.ko) буйынса урындағы депозит өлгөһө
- [Тыуған милке менән һаҡланған активтар](/ba/blockchain/escrow.md)
- [Функциональ активтар](./fungible-assets.md)
- [Рөхсәт һәм ролдәр](./permissions-and-roles.md)
