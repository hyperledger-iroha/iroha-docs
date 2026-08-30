---
translation_locale: kk
translation_source: /cookbook/native-escrow.md
translation_source_hash: aa8e079684879bdcda2b4439e9c12742d4ab477e6f560f7c326a59b6be5bf666
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Жергiлiктi активтердi басқару {#native-asset-escrow}

## Нәтижесі {#outcome}

Базардағы кепілдендіру мен мақсатқа байланысты активті бекітудің арасында таңдаңыз, ағымдағы түрлендірілген өмірлік циклін Rust немесе Python арқылы орындаңыз, әрбір кепілдендіруді қайтадан байқаған қалған сомаға байлаңыз және түпкілікті Kotodama кепілдендіру беттерін JavaScript бойынша жинақтаңыз.

## Алдын ала талаптар {#prerequisites}

- Сандық активтің анықтамасы және жеткілікті мөлшерге ие болған ашушы/сатушы.
- Қаржыландырылған, бір кілт I105 әрбір тарапқа клиенттер үшін қадам тапсырады. Тікелей билік төленген `fee_payment` мақсат, оның алым активтері ағымдағы Taira кранның реакциясы; активті енгізуге болмайды ID құжаттамадан алынған.
- Ағымдағы Rust немесе Python SDK бойынша Iroha міндеттеу `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- Бұл үшін JavaScript компилятор үлгісі, Node.js 24 және жергілікті тұрғыдан жасалған `@iroha/iroha-js` таңба және оның түпнұсқасы `iroha_js_host`; орындалсын [JavaScript SDK ресурс-құрылысын орнату](/kk/guide/tutorials/javascript.md#build-from-source). Браузердің құрылымы қамтамасыз етуі тиіс `compilerUrl` жергілікті қоректенушіге жүктеудің орнына.
- Taira активтерді аудару және кепілдік беру нұсқауларын мойындауы тиіс. Актив иелері өздерінің актив саясаты мүмкіндік берген кезде әдеттегі өмір циклын пайдалана алады; дауларды шешу үшін жалпы `CanResolveEscrowDispute` рұқсатын қажет етеді. Қажетті қоғамдық желі билігі болмаған жағдайда құрылған жергілікті желілерді қолдана алады.

Базардағы депозиттік модельдер сатушы, сатып алушы, тізбектен тыс төлем және босату. Жалпы қақпақтар мақсатты және ерікті түрде бөлек босату билігін атайды; олар ішінара алуды, күшін жоюды және мерзімі өткенді қолдайды.

## Қадамдар {#steps}

### 1. Rust арқылы нарықтағы кепілдікті толтыру. {#_1-complete-a-marketplace-escrow-with-rust}

Бұл функция нақты IDs және клиенттерді алады. Ол 40 бірлікті ашады, сатып алушыға тізбектен тыс төлемді қабылдауға және белгілеуге мүмкіндік береді, содан кейін сатушыға қорғаншылықты босатуға мүмкіндік береді. Әр тапсырыстың атауы билік ақысын төлеушіге `FeePaymentIntent` арқылы беріледі.

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

Қапшылық шоты бухгалтерлік кітапшамен басқарылады. Әдеттегі активтерді аудару токенін беру активті қапшылықтың өмір циклінен тыс пайдаланылуы мүмкін емес.

### 2. Python арқылы жалпы құлыпты ашып, ішінара түсіріңіз. {#_2-open-and-partially-draw-a-generic-lock-with-python}

Ашық ету органы қол қойылған түпнұсқалық жазбаны алудан бұрын сұрап алады. дәл `remaining_amount` тапсыру оңтайлы бір мезгілді қамтамасыз етеді: күтімсіз параллельді сұрау салуды екі рет қорға алудың орнына бас тартады.

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

Python SDK `expected_remaining_amount` алынып тасталған кезде автоматты түрде сұрау салуға болады, бірақ байқалған мәнді тапсыру қол қойылған экономикалық алдын ала шартты өтінім кодында көрініспен көрсетеді.

Rust бұғаттау ағыны үшін ток конструкторлары сондай-ақ байқалған мөлшерді талап етеді:

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

`DrawdownAssetLock::new` үш мәнді алады; `CancelAssetLock::new` екіін алады. Күтілетін қалған соманы алып тастау ескі, қауіпсіз емес шақыру нысанын сипаттайды.

### 3. Kotodama кепілдік беті JavaScript-ден құрастырылсын {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript-ге түрленбеген жергілікті нұсқауларды ойлап табудың қажеті жоқ. Қазіргі компилятор бухгалтерлік кітапшаның салыстырмалы әшекейлерін Kotodama-ге шығарады; орналасу және шақыру, содан кейін [Ақылды келісімшартты құру және орналастыру](./smart-contracts.md).

Осыны `native_escrow.ko` деп сақтау:

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

Келесі `compile-native-escrow.mjs` ретінде сақтаңыз және оны Node.js дереккөзінен дәл осы деректі жинақтау үшін қолданыңыз:

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

Бастапқыда құрылған пакет ортасынан орындаңыз:

```bash
node ./compile-native-escrow.mjs
```

## Тексеру {#verify}

Базардағы кепілге алу үшін `FindAssetEscrowById` және екі тараптың активтерін босатудан кейін сұраңыз. Тізілім `Released` болуы керек, қабылдаушы сатып алушының есімі көрсетілсін және қалған күтімсіз болу керек. Жоғарыда көрсетілген Python кілтісі үшін қайтарылған ID сақталып, қол қойылған сұрауды қайталаңыз:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Сондай-ақ, мақсаттағы активтерді сұраңыз және олардың 4 бірлікке өскенін растаңыз. Кеспелілік тіркелгісі және бағыт-жөнері жоқ транзакция квитанциясы толық емес тексеру болып табылады.

## Қиындықтарды шешу {#troubleshooting}

- `Not permitted` ашу, әдетте, уәкілетті орган таңдалған активті қорға бере алмайды дегенді білдіреді. Бәсекелестік мәселелерді шешу бойынша бөлек әлемдік `CanResolveEscrowDispute` қақпасы.
- `expected remaining amount` бас тарту - бұл оңтайлылық пен бәсекелестік қақтығысы. Жазбаларды қайтадан сұраңыз, басқа алу / күшін жоюды шешіңіз және жаңа нұсқауға қол қойыңыз тек егер жаңа жағдай қабылдайтын болса.
- Тек конфигурацияланған босату билігі сенімді қақпақты тарта алады. Жеткізуші оны тек қаржыны алатындықтан ғана босата алмайды.
- Базардағы босату тек қабылдау және төлемді жібергеннен кейін ғана жарамды; күшін жою бұрынғы өмір циклі мемлекеттеріне ғана шектеледі.
- Уақыт өтелу кезінде авторитетті кітапша уақытын пайдаланады. `ExpireAssetLock` өтетінін дәлелдейтін жергілікті қабырға сағаты уақытымен қарамаңыз.
- Төлемақының төлемеуі осы өмірлік цикл кезеңін ұсынған тарапқа тиесілі. Қорды сатып алушы, сатушы/ашық етуші және Taira арқылы тәуелсіз босату билігі.

## Бастапқы және осыған байланысты құжаттар {#source-and-related-docs}

- [Тіркелген міндеттемелер бойынша жергілікті кепілдік беру нұсқаулық моделі](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Тіркелген міндеттемеде тумақшылдықты интеграциялау сынақтары](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python фикцияланған міндеттемедегі кепіл клиентінің әдістері](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama түпкiлiктi кепілгерлiгiнiң үлгiсi бекiтiлген commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Жергiлiктi активтердiң депозитi](/kk/blockchain/escrow.md)
- [Қатты активтер](./fungible-assets.md)
- [Рұқсаттар және рөлдер](./permissions-and-roles.md)
