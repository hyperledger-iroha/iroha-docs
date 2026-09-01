---
translation_locale: am
translation_source: /cookbook/native-escrow.md
translation_source_hash: 576e03924f19b63681cdfafa641b996672e35a992478fc9eaf5b83f0e7baa6da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ቤተኛ ንብረት Escrow {#native-asset-escrow}

## ውጤት {#outcome}

በገበያ ቦታ ማስያዣ እና ከመድረሻ ጋር በተያያዘ የንብረት መቆለፊያ መካከል ይምረጡ፣ የአሁኑን የተተየበውን የህይወት ኡደት በ Rust ወይም Python ያስፈጽሙ፣ እያንዳንዱን የመቆለፊያ ድጋሚ ሙከራ በትክክል ከተመለከቱት ቀሪ መጠን ጋር ያያይዙ እና ቤተኛ Kotodama የማስያዣ ወለልን ከ JavaScript ያጠናቅሩ።

## ቅድመ ሁኔታዎች {#prerequisites}

- የቁጥር ንብረት ፍቺ እና በቂ መጠን ያለው መክፈቻ/ሻጭ።
- አንድ እርምጃ ለሚያቀርብ እያንዳንዱ አካል በገንዘብ የተደገፈ፣ ነጠላ-ቁልፍ I105 ደንበኞች። የክፍያ ንብረቱ ከአሁኑ Taira የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ምላሽ ጋር የሚዛመድ በግብይት ፊርማ መለያ `fee_payment` ዓላማ የሚከፈል ቀጥታ ስርጭት ይጠቀሙ። የንብረት መታወቂያ ከሰነድ ውስጥ አያስገቡ።
- የአሁኑ Rust ወይም Python SDK ከ Iroha ፕሮቶኮል ማጠናቀቂያ `0010c5a70039eac101a4846499ba9ceaf43eb65c`።
- ለ JavaScript አቀናባሪ ምሳሌ፣ Node.js 24 እና አብሮ የተሰራ ጥቅል በአካባቢው ልማት አካባቢ `@iroha/iroha-js` እና ቤተኛ `iroha_js_host`; [JavaScript SDK ምንጭ-ግንባታ ማዋቀር](/am/guide/tutorials/javascript.md#build-from-source) የሚለውን ይከተሉ። የአሳሽ ግንባታዎች ቤተኛ አስተናጋጁን ከመጫን ይልቅ `compilerUrl` ማቅረብ አለባቸው።
- Taira የንብረት ዝውውሩን እና የማስያዣ መመሪያዎችን ማጽደቅ አለበት። የንብረት ባለቤቶች የንብረት ፖሊሲያቸው በሚፈቅድበት ጊዜ መደበኛውን የሕይወት ዑደት መከተል ይችላሉ; . መፍታት ሀ ክርክር ዓለም አቀፋዊ `CanResolveEscrowDispute` ፈቃድ ያስፈልገዋል። አስፈላጊው የህዝብ blockchain አውታረ መረብ ፈቃድ ባለቤት በማይኖርበት ጊዜ የመነጨ የአካባቢ አውታረ መረብ ይጠቀሙ።

የገበያ ቦታ ማስያዣ ሞዴሎች ሻጩን፣ ገዢውን፣ ከሰንሰለት ውጪ ክፍያን እና መለቀቅን ያካትታሉ። አጠቃላይ መቆለፊያዎች መድረሻን እና እንደ አማራጭ የተለየ የመልቀቂያ የፈቃድ ባለቤትን ይገልጻሉ። ከፊል መውደቅን፣ መሰረዝን እና ጊዜን ማለፍ ይፈቅዳሉ።

## እርምጃዎች {#steps}

### 1. የገበያ ቦታን በ Rust ያጠናቅቁ {#_1-complete-a-marketplace-escrow-with-rust}

ይህ ተግባር እውነተኛ የተተየቡ መታወቂያዎችን እና ደንበኞችን ይቀበላል። 40 ክፍሎችን ይከፍታል፣ ገዢው ከሰንሰለት ውጪ ክፍያን እንዲቀበል እና ምልክት እንዲያደርግ ያስችለዋል፣ ከዚያም ሻጩ የጥበቃ መብትን እንዲለቅ ያስችለዋል። እያንዳንዱ ግቤት የፈቃድ ዋና ክፍያ ከፋይን በ`FeePaymentIntent` በኩል ይሰይማል።

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

የጥበቃ መለያው የሚተዳደረው በብሎክቼይን መዝገብ ነው። መደበኛ የንብረት ማስተላለፍ ቶከን መስጠት ንቁ ጥበቃን ከ escrow የሕይወት ዑደት ውጭ እንዲፈስ አያደርገውም።

### 2. ከ Python ጋር አጠቃላይ መቆለፊያን ይክፈቱ እና በከፊል ይሳሉ {#_2-open-and-partially-draw-a-generic-lock-with-python}

የመልቀቂያ የፈቃድ ባለቤት ከመውረድ በፊት የተፈረመውን ቤተኛ መዝገብ ይፈትሻል። ያንን ትክክለኛ `remaining_amount` ማቅረብ ብሩህ ተስፋ ያለው ተመሳሳይነት ያስችላል የቆየ ትይዩ ጥያቄ ሁለት ጊዜ ከመክፈል ይልቅ ውድቅ ይደረጋል።

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

Python SDK `expected_remaining_amount` ሲቀር በራስ-ሰር መጠየቅ ይችላል፣ ነገር ግን የታየውን እሴት ማለፍ የተፈረመውን ኢኮኖሚያዊ ቅድመ ሁኔታ በመተግበሪያ ኮድ ውስጥ እንዲታይ ያደርገዋል።

ለ Rust የመቆለፊያ ፍሰቶች፣ የአሁኑ ገንቢዎች እንዲሁ የሚታየውን መጠን ይፈልጋሉ -

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

`DrawdownAssetLock::new` ሶስት እሴቶችን ይወስዳል; `CancelAssetLock::new` ሁለት ይወስዳል። የሚጠበቀውን የቀረውን መጠን መተው የቆየ፣ ደህንነቱ ያልተጠበቀ የቴክኒክ ጥሪ ቅርፅን ይገልጻል።

### 3. የ Kotodama የ escrow ወለልን ከ JavaScript ያጠናቅቁ {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript ያልተተየቡ ቤተኛ መመሪያዎችን መፈልሰፍ አያስፈልገውም።. የአሁኑ አቀናባሪ አብሮገነብ የብሎክቼይን መዝገብ escrow አብሮገነብ ለ Kotodama ያጋልጣል። ማሰማራት እና ቴክኒካል ጥሪዎች ከዚያ [ብልጥ ውል ይገንቡ እና ያሰማሩ](./smart-contracts.md) ይከተሉ።

ይህንን እንደ `native_escrow.ko` ያስቀምጡ

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

የሚከተለውን እንደ `compile-native-escrow.mjs` ያስቀምጡ እና ያንን ትክክለኛ ምንጭ ከ Node.js ለማጠናቀር ይጠቀሙበት።

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

በቅድመ ሁኔታዎች ውስጥ ከተገለጸው ምንጭ ከተሰራው የጥቅል አካባቢ ያሂዱት -

```bash
node ./compile-native-escrow.mjs
```

## አረጋግጥ {#verify}

ለገበያ ቦታ ማስያዣ፣ ጥያቄ `FindAssetEscrowById` እና ከተለቀቀ በኋላ የሁለቱም ወገኖች የንብረት ይዞታዎች። መዝገቡ `Released` መሆን አለበት፣ ተቀባዩን ገዢ ይሰይሙ እና ምንም ቀሪ ጥበቃ አያሳይም። ከላይ ላለው Python መቆለፊያ፣ የተመለሰውን መታወቂያ ይያዙ እና የተፈረመውን ጥያቄ ይድገሙት -

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

እንዲሁም የመድረሻውን ንብረት ይዞታ ይጠይቁ እና በአራት ክፍሎች መጨመሩን ያረጋግጡ። የግብይት ደረሰኝ ያለ escrow መዝገብ እና መድረሻ ድህረ-ሁኔታ ያልተሟላ ማረጋገጫ ነው።

## መላ ፍለጋ {#troubleshooting}

- `Not permitted` ሲከፈት ብዙውን ጊዜ የፈቃድ ርዕሰ መምህሩ የተመረጠውን ንብረት ወደ እስር ቤት ማስተላለፍ አይችልም ማለት ነው።. የክርክር አፈታት የተለየ ዓለም አቀፍ `CanResolveEscrowDispute` በር አለው።.
- `expected remaining amount` አለመቀበል ብሩህ ተስፋ ያለው የጋራ ግጭት ነው።. መዝገቡን እንደገና ይጠይቁ፣ ሌላኛው መውረድ/መሰረዝ የታሰበ መሆኑን ይወስኑ እና አዲስ መመሪያ ይፈርሙ አዲሱ ሁኔታ ተቀባይነት ካለው ብቻ ነው።.
- የታመነ መቆለፊያ መሳል የሚችለው የተዋቀረው የመልቀቂያ ፈቃድ ባለቤት ብቻ ነው። መድረሻው ገንዘቡን ስለሚቀበል ብቻ ሊለቀቀው አይችልም።
- የገበያ ቦታ መለቀቅ የሚሰራው ከተቀበለ እና ክፍያ ከተላከ በኋላ ብቻ ነው። መሰረዙ በቀደሙት የህይወት ኡደት ግዛቶች ብቻ የተገደበ ነው።
- ጊዜው የሚያበቃው ስልጣን ያለው የብሎክቼይን መዝገብ ጊዜን ይጠቀማል። የአካባቢ ስርዓት ሰዓት ማብቂያውን `ExpireAssetLock` እንደሚያልፍ እንደ ማረጋገጫ አድርገው አይቁጠሩት።
- የክፍያ አለመሳካት ያንን የህይወት ኡደት ደረጃ የሚያቀርበው አካል ነው። ገዢን፣ ሻጭን/መክፈቻን ፈንድ ያድርጉ እና የፈቃድ ባለቤትን በተናጥል በ Taira ላይ ይልቀቁ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [ቤተኛ escrow መመሪያ ሞዴል በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ ቤተኛ escrow ውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python በተሰካው የምንጭ-ኮድ ክለሳ ላይ የማስያዣ ደንበኛ ዘዴዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama ቤተኛ escrow ናሙና በተሰካው የምንጭ-ኮድ ክለሳ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [ቤተኛ የንብረት escrow](/am/blockchain/escrow.md)
- [ፈንገስ ሊሆኑ የሚችሉ ንብረቶች](./fungible-assets.md)
- [ፈቃዶች እና ሚናዎች](./permissions-and-roles.md)
