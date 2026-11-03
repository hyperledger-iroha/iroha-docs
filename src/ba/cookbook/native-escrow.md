---
translation_locale: ba
translation_source: /cookbook/native-escrow.md
translation_source_hash: d399284a2baec507e4c979c762d6e216d8c3fbc5b4b4fe221b6bbb0049ee9fd9
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Протоколға индерелгән актив эскроуы {#native-asset-escrow}

## Һөҙөмтә {#outcome}

Баҙар эскроуы менән тәғәйен урынға бәйле актив йоҙағы араһында һайлағыҙ, ағымдағы типланған тормош циклын Rust йәки Python менән үтәгеҙ, һәр ҡабатлауҙы үҙегеҙ күҙәткән ҡалған суммаға бәйләгеҙ һәм JavaScript аша протоколға индерелгән Kotodama эскроу интерфейсын компиляциялағыҙ.

## Шарттар {#prerequisites}

- Санлы активтар билдәләмәһе һәм етерлек күләмдә булған асыусы/сатыусы.
- Аҙым тапшырған һәр яҡ өсөн финансланған, бер асҡыслы I105 клиенттары. Түләү активы ағымдағы Taira faucet сәйәсәте баҫтырған актив менән тап килгән, вәкәләтле иҫәп түләгән ағымдағы `fee_payment` ниәтен ҡулланығыҙ; документациянан актив ID-һын индермәгеҙ.
- Хәҙерге Rust йәки Python SDK Iroha commit `c8c872461e92f04325c350cdd952f4276e96f9dc`.
- өсөн JavaScript компилятор миҫалы, Node.js 24 плюс урындағы төҙөлгән `@iroha/iroha-js` пакеты һәм уның сығышы `iroha_js_host`; күҙәтеү [JavaScript SDK сығанаҡ төҙөлөшөн көйләү](/ba/guide/tutorials/javascript.md#build-from-source). Браузер төҙөү тәьмин ителергә тейеш `compilerUrl` урындағы хужаны йөкләү урынына.
- Taira активтар күсереү һәм һаҡланыу инструкцияларын ҡабул итергә тейеш. Аҡса хужалары ғәҙәттәгесә йәшәү циклын ҡуллана ала, әгәр уларҙың актив сәйәсәте рөхсәт итһә; бәхәстәрҙе хәл итеү өсөн глобаль `CanResolveEscrowDispute` рөхсәтен талап итә.

Баҙарҙа эскроу моделдәрен һатыусы, һатып алыусы, селтәрҙән тыш түләү һәм сығарыу. Дөйөм бикләүҙәр тәғәйенләнешен һәм мөмкинселек буйынса айырым сығарыу хоҡуғын атай; улар өлөшләтә түләтеүҙе, бөтөрөүҙе һәм ваҡытын тамамлауҙы тәьмин итә.

## Аҙымдар {#steps}

### 1. Rust менән баҙарҙа һаҡланған аҡсаны тултырығыҙ {#_1-complete-a-marketplace-escrow-with-rust}

Был функция ысын типтағы IDs һәм клиенттарҙы ала. Ул 40 берәмекте аса, һатып алыусыға сылбырҙан тыш түләүҙе ҡабул итергә һәм билдәләргә мөмкинлек бирә, һуңынан һатыусыға һаҡлыҡты азат итергә мөмкинлек бирә. Һәр тапшырыу хоҡуҡ түләүсе исемен `FeePaymentIntent` аша атай.

```rust
use eyre::{Result, ensure};
use iroha::{
    blocking::Client,
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

    seller.submit(
        OpenAssetEscrow::with_evidence_hashes(
            escrow_id,
            asset_definition,
            Quantity::from(40_u64),
            vec![Hash::new("cookbook-fiat-invoice")],
        ),
        fee.clone(),
    )?;
    buyer.submit(AcceptAssetEscrow::new(escrow_id), fee.clone())?;
    buyer.submit(MarkEscrowPaymentSent::new(escrow_id), fee.clone())?;
    seller.submit(ReleaseAssetEscrow::new(escrow_id), fee)?;

    let record = seller
        .client()
        .query_single(FindAssetEscrowById::new(escrow_id))?;
    ensure!(record.status == AssetEscrowStatus::Released);
    Ok(record)
}
```

Һаҡлыҡ иҫәбенә иҫәп-хисап менән идара ителә. Ғәҙәттәгесә активтарҙы күсереү өсөн токен биреү актив һаҡлыҡты гарантиялы тормош циклынан тыш файҙаланыуға мөмкин итмәй.

### 2. Python менән дөйөм бикләүҙе асығыҙ һәм өлөшләтә төшөрөгөҙ. {#_2-open-and-partially-draw-a-generic-lock-with-python}

Азат итеү вәкәләте булған иҫәп өлөшләтә төшөрөр алдынан ҡул ҡуйылған протокол яҙмаһын һорап ала. Нәҡ шул `remaining_amount` ҡиммәтен биреү оптимистик конкуренция контролен тәьмин итә: иҫкергән параллель һорау һаҡлауҙағы активтарҙы ике тапҡыр сисеү урынына кире ҡағыла. `client` — `local_signing_context=LocalSigningContext(network_id)` һәм селтәрҙең `chain_discriminant` ҡиммәте менән булдырылған `ToriiClient`; транзакция ярҙамсылары селтәр идентификацияһын шул контексттан ала, ә ҡул ҡуйылған һорауҙар уны `network_id` итеп ала.

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
    opener,
    opener_private_key,
    release_authority,
    release_private_key,
    destination,
    asset_definition_id,
    fee_payment,
):
    escrow_id = f"cookbook_lock_{secrets.token_hex(12)}"
    network_id = client.local_signing_context.network_id

    client.open_asset_lock_and_wait(
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
        network_id=network_id,
        private_key=release_private_key,
    )
    client.drawdown_asset_lock_and_wait(
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
        network_id=network_id,
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
let before = opener
    .client()
    .query_single(FindAssetEscrowById::new(lock_id))?;
release_authority.submit(
    DrawdownAssetLock::new(
        lock_id,
        Quantity::from(4_u64),
        before.remaining_amount,
    ),
    FeePaymentIntent::authority(Vec::new(), None),
)?;

let current = opener
    .client()
    .query_single(FindAssetEscrowById::new(lock_id))?;
opener.submit(
    CancelAssetLock::new(lock_id, current.remaining_amount),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

`DrawdownAssetLock::new` бикләүҙе, сумманы һәм күҙәтелгән ҡалған сумманы ала; `CancelAssetLock::new` бикләүҙе һәм күҙәтелгән ҡалған сумманы ала. Әгәр ҡалған сумма алдан үҙгәргән булһа, реестр был инструкцияларҙың теләһә ҡайһыһын кире ҡаға.

### 3. Kotodama иҫәбенә JavaScript иҫәбен алыу. {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript-ҡа протоколға индерелгән типһыҙ инструкциялар уйлап сығарырға кәрәкмәй. Хәҙерге компилятор реестрҙың эскроу өсөн эсенә ҡоролған функцияларын Kotodama-ға аса; артабан урынлаштырыу [Аҡыллы килешеү төҙөү һәм урынлаштырыу](./smart-contracts.md) битендәгесә бара. `open_offer` инеү нөктәһе `authorize(Admin)` булып тора, шуға күрә башҡарыусы (executor) уны саҡырыусынан урынлаштырылған адрес һәм `permission: "Admin"` өсөн `CanUseContractPermission` рөхсәте булыуын талап итә.

`native_escrow.ko` тип һаҡлағыҙ:

```kotodama
seiyaku NativeEscrowAitai {
    permission Admin;
    error enum EscrowError {
        NonPositiveAmount = 1,
    }

    kotoage fn open_offer(
        Name offer,
        AssetDefinitionId asset_definition,
        quantity amount
    ) authorize(Admin) {
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

Баҙар escrow-һы өсөн release-тан һуң `FindAssetEscrowById` һәм ике яҡтың да asset holdings-тарын query итегеҙ. Яҙма `Released` хәлдә булырға, ҡабул иткән һатып алыусыны атарға һәм custody ҡалмағанын күрһәтергә тейеш. Өҫтәге Python lock өсөн ҡайтарылған ID-ны һаҡлап, signed query-ҙы ҡабатлағыҙ:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    network_id=client.local_signing_context.network_id,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Шулай уҡ киләсәктең активтарын һорау һәм уның дүрт берәмеккә артҡанын раҫлау. Транзакция квитанцияһы иҫәбеһеҙ һәм тәғәйенләнешенән һуң билдәләнмәгән, тулы булмаған тикшереү булып тора.

## Проблемаларҙы хәл итеү {#troubleshooting}

- `Not permitted` асылған ваҡытта, ғәҙәттә, орган һайланған активты һаҡ аҫтына ала алмай тигәнде аңлата. Яуызлыҡтарҙы хәл итеүгә айырым глобаль `CanResolveEscrowDispute` Ҡапҡа.
- `asset lock remaining amount changed since the drawdown was prepared` (йәки `...since the cancellation was prepared`) хатаһы — оптимистик конкуренция конфликты. Яҙманы ҡабат һорап алығыҙ, икенсе өлөшләтә төшөрөү/юҡҡа сығарыу ниәтләнгәнме икәнен хәл итегеҙ һәм яңы торош ҡабул ителерлек булғанда ғына яңы инструкцияға ҡул ҡуйығыҙ.
- Бары тик конфигурацияланған иреккә сығарыу органы ғына ышаныслы бик төшөрә ала. Юлға сығыу урыны аҡсаны аласаҡ өсөн генә уны иреккә сығара алмай.
- Баҙарҙа сығарыу ҡабул итеү һәм түләү ебәреү дәүләтенән һуң ғына ғәмәлдә була; ғәмәлдән сығарыу тәүге йәшәү циклы дәүләттәренә генә сикләнә.
- Иҫәпкә алыу ваҡыты иҫәбенә ҡулланыу. `ExpireAssetLock` үтәсәгенә дәлил итеп урындағы система сәғәтеенең ваҡытын ҡарамағыҙ.
- Аҡсаны түләмәй ҡалһа, был ғүмер циклы этабын тапшырған яҡҡа ҡарай. Фонд һатып алыусыһы, һатыусы/асыҡлаусы һәм иреккә сығарыу власы үҙ аллы Taira.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Ҡатырылған commit-та протокол эскроуының инструкция моделе](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/isi/escrow.rs)
- [Ҡатырылған commit-та протокол эскроуының интеграция һынауҙары](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/native_escrow.rs)
- [Python конфиденциаль клиенттарҙың билдәләнгән commit буйынса алымдары](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/src/iroha_python/client.py)
- [Kotodama фиктив commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/native_escrow.ko) буйынса урындағы депозит өлгөһө
- [Протоколға индерелгән актив эскроуы](/ba/blockchain/escrow.md)
- [Функциональ активтар](./fungible-assets.md)
- [Рөхсәт һәм ролдәр](./permissions-and-roles.md)
