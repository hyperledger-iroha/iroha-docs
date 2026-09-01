---
translation_locale: kk
translation_source: /cookbook/native-escrow.md
translation_source_hash: 576e03924f19b63681cdfafa641b996672e35a992478fc9eaf5b83f0e7baa6da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Туынды активтерді сенімхатта сақтау {#native-asset-escrow}

## Нәтиже {#outcome}

Нарықтық сенімгерлік шот пен тағайындалған активті құлыптау арасынан таңдаңыз, ағымдағы терілген өмірлік циклді Rust немесе Python арқылы орындаңыз, әр құлыптау әрекетін сіз шын мәнінде байқап отырған қалған сомаға байлаңыз, және JavaScript ішінен жергілікті Kotodama сенімгерлік шот беттерін жинаңыз.

## Алдын ала шарттар {#prerequisites}

- Сандық актив анықтамасы және жеткілікті мөлшерде иелік ететін ашушы/сатушы.
- Әр қадам ұсынатын әрбір тарап үшін қаржыландырылған, бір кілтті I105 клиенттер. Қолма-қол төлем жасалған транзакцияны қол қойылған есептік жазба `fee_payment` ниетін пайдаланыңыз, оның төлем активі ағымдағы Taira тесттік желіге қаржыландыру қызметінің жауабымен сәйкес келеді; құжаттамадан активтің идентификаторын қоспаңыз.
- Ағымдағы Rust немесе Python SDK Iroha протоколын аяқтау `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- JavaScript компилятор мысалы үшін, Node.js 24 плюс жергілікті даму ортасында жасалған `@iroha/iroha-js` пакеті және оның түпнұсқа `iroha_js_host`; [JavaScript SDK source-build орнату](/kk/guide/tutorials/javascript.md#build-from-source) орындаңыз. Браузерлік құрастырулар түпнұсқа хостты жүктеу орнына `compilerUrl` қамтамасыз етуі керек.
- Taira активтерді ауыстыру және сақтандыру нұсқауларын қабылдауы керек. Актив иелері актив саясаты рұқсат берген жағдайда қарапайым өмірлік циклді пайдалана алады; шешу Дауларға жаһандық `CanResolveEscrowDispute` рұқсат қажет. Қажетті қоғамдық блокчейн желісінің уәкілетті субъект болмаған жағдайда өнделген жергілікті желіні пайдаланыңыз.

Нарық алаңының эскроу модельдері сатушыны, сатып алушыны, тізбеден тыс төлемді және босатуды қамтиды. Жалпы құлыптар мақсатты атайды және қажет болса бөлек босату авторизациясының негізгі тұлғасын көрсетеді; олар ішінара төлем алу, болдырмау және мерзімінің аяқталуын қолдайды.

## Қадамдар {#steps}

### 1. Rust арқылы нарықтағы кепіл процессін аяқтаңыз {#_1-complete-a-marketplace-escrow-with-rust}

Бұл функция нақты терілген идентификаторлар мен клиенттерді қабылдайды. Ол 40 бірлікті ашады, сатып алушыға off-chain төлемді қабылдауға және белгілеуге мүмкіндік береді, содан кейін сатушыға кепілдік пеншесін босатуға мүмкіндік береді. Әрбір жіберу `FeePaymentIntent` арқылы авторизация уәкілетті субъектал шығындарын төлейтінін көрсетеді.

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

Қамқоршылық шотты блокчейн тізілімі басқарады. Қарапайым активтерді беру токенін беру активті қамқоршылықтың өмірлік циклінен тыс шығаруға мүмкіндік бермейді.

### 2. Ашып, Python көмегімен жалпы құлыпты ішінара сызыңыз {#_2-open-and-partially-draw-a-generic-lock-with-python}

Шығару рұқсатын беретін басты тұлға қаражатты шығару алдында қол қойылған түпнұсқа жазбаны сұрайды. Сол дәл `remaining_amount` нөмірін беру оптимистік қатарлылықты қамтамасыз етеді: ескірген параллель сұрау екі рет сақтау есебінен ұсталу орнына қабылданбайды.

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

Python SDK `expected_remaining_amount` көрсетілмеген кезде автоматты түрде сұрау жасай алады, бірақ бақыланған мәнді беру қолданба кодында қол қойылған экономикалық шартты көрінетін етеді.

Rust құлып ағындары үшін, қазіргі конструкторлар сондай-ақ бақылаған мөлшерді талап етеді:

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

`DrawdownAssetLock::new` үш мәнді қабылдайды; `CancelAssetLock::new` екі мәнді қабылдайды. Күтілетін қалған соманы жіберу ескі, қауіпсіз емес техникалық шақыру формасын сипаттайды.

### 3. JavaScript-ден Kotodama эскроу бетін жинақтаңыз {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript типтелмеген жергілікті нұсқауларды ойлап табудың қажеті жоқ. Ағымдағы компилятор блокчейн тіркелгіш депозит кірістірмелерін Kotodama-ге көрсетеді; орналастыру және техникалық шақырулар кейін [Ақылды келісімді құрыңыз және орналастырыңыз](./smart-contracts.md)-ге сәйкес жүргізіледі.

Оны `native_escrow.ko` ретінде сақтаңыз:

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

Оны `compile-native-escrow.mjs` ретінде сақтаңыз және оны Node.js ішіндегі дәл сол көзді жинау үшін пайдаланыңыз:

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

Оны алдын ала талаптарда сипатталған бастапқы көзден құрастырылған пакет ортасынан іске қосыңыз:

```bash
node ./compile-native-escrow.mjs
```

## Растау {#verify}

Нарықтағы эскроу үшін, шығарылғаннан кейін `FindAssetEscrowById` және екі тараптың активтерін тексеріңіз. Жазба `Released` болуы керек, сатып алушының атын көрсетіңіз және ешқандай қалдық күзет жоқ екенін көрсетіңіз. Жоғарыдағы Python құлып үшін қайтарылған ID-ді сақтап, қол қойылған сұрауды қайталаңыз:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Сонымен қатар, тағайындалған мекен-жайдың активтерін тексеріп, оның төрт бірлікке өскенін растаңыз. Эскроу жазбасы мен тағайындалған мекен-жайдың соңғы күйі жоқ транзакция протоколының нәтижесі жазбасы толық тексеру болып табылмайды.

## Ақауларды жою {#troubleshooting}

- `Not permitted` ашу кезінде әдетте авторизациялау субъектісі таңдалған активті сақтау орнына ауыстыра алмайтынын білдіреді. Дауларды шешудің бөлек жаһандық `CanResolveEscrowDispute` қақпасы бар.
- `expected remaining amount` бас тарту - бұл оптимистік сәйкестік қақтығысы. Жазбаны қайта сұраңыз, басқа төлем/жабу әрекеті ниет етілгенін анықтаңыз, және жаңа күй қолайлы болған жағдайда ғана жаңа нұсқаулыққа қол қойыңыз.
- Тек конфигурацияланған шығарылымды авторизациялау негізгі тұлғасы ғана сенім тігілген құлыпты аша алады. Мақсат тек қана қаражат алатыны үшін оны босата алмайды.
- Нарық алаңының шығарылымы тек қабылдау және төлем жіберілген күйінен кейін ғана заңды болып табылады; болдырмау бұрынғы өмірлік циклдің күйлерімен шектеледі.
- Жарамдылық беделді блокчейн тізілім уақытына негізделеді. Жергілікті жүйе сағатының уақыт аяқталуын `ExpireAssetLock` өтеді деп дәлел ретінде қарастырмаңыз.
- Төлемнің сәтсіз болуы осы өмірлік цикл қадамын ұсынатын тарапқа тиесілі. Қор сатып алушы, сатушы/ашушы және босату авторизациясы уәкілетті субъект Taira дербес өзгереді.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Тұрақты бастапқы код нұсқасындағы жергілікті эскроу нұсқаулығы моделі](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Тұрақты бастапқы код нұсқасындағы жергілікті эскроу интеграциялық тесттері](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python бекітілген бастапқы код ревизиясындағы эскроу клиентінің әдістері](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama байтекселдірілген эскроу үлгісі бекітілген бастапқы код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Табиғи актив депозиті](/kk/blockchain/escrow.md)
- [Ауыстырылатын мүлік](./fungible-assets.md)
- [Рұқсаттар мен рөлдер](./permissions-and-roles.md)
