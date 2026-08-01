---
translation_locale: am
translation_source: /cookbook/native-escrow.md
translation_source_hash: 0185b6a341ee90ed6cd52fb9f510549b20592468abe6627d3efa639c3b67d1fd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የአገር ውስጥ ንብረት ማስከበሪያ {#native-asset-escrow}

## ውጤቱ {#outcome}

ከገበያ ቦታ ኤስሮው እና ወደ መድረሻ የተገደበ የንብረት መቆለፊያ መካከል ይምረጡ ፣ የአሁኑን የታየውን የሕይወት ዑደት በ Rust ወይም Python ያካሂዱ ፣ እያንዳንዱን የመቆለፊያ ሙከራ በእውነቱ ከተመለከቱት ቀሪ መጠን ጋር ያያይዙ እና የተፈጥሮውን Kotodama ኤስሮ ገጽ ከ JavaScript ያጠናቅቁ ።

## ቅድመ ሁኔታዎች {#prerequisites}

- የቁጥር ሀብት ትርጉም እና በቂ መጠን ያለው የመክፈቻ / ሻጭ።
- አንድ እርምጃ ለሚያቀርብ ለእያንዳንዱ ወገን የገንዘብ ድጋፍ የተደረገበት, ነጠላ ቁልፍ I105 ደንበኞች። የክፍያ ንብረቱ ከወቅታዊው Taira faucet ምላሽ ጋር የሚስማማ በቀጥታ ባለስልጣን የተከፈለ `fee_payment` ዓላማ ይጠቀሙ; ከዝግጅት ውስጥ የንብረትን ID አያካትቱ.
- የአሁኑ Rust ወይም Python SDK ከ Iroha ተሳትፎ ማድረግ `bc7114ed1c7f265a156d2100ff09e851cc95702c`.
- ለ JavaScript የኮምፒተር ምሳሌ፣ Node.js 24 እና በአካባቢው የተገነባ `@iroha/iroha-js` ማሸጊያ እና ተወላጅ `iroha_js_host`; ይከተሉ [JavaScript SDK ምንጭ-ግንባታ ማዋቀር](/am/guide/tutorials/javascript.md#build-from-source). የአሳሽ ገንቢዎች ማቅረብ አለባቸው `compilerUrl` የአካባቢውን አስተናጋጅ ከመጫን ይልቅ።
- Taira የንብረት ማስተላለፍ እና የመጠባበቂያ መመሪያዎችን መቀበል አለበት ። የንብረት ባለቤቶች የተለመደውን የሕይወት ዑደት መጠቀም ይችላሉ የእነሱ የንብረት ፖሊሲ ሲፈቅድለት; አለመግባባት ለመፍታት ዓለም አቀፍ `CanResolveEscrowDispute` ፈቃድ ይጠይቃል. አስፈላጊው የህዝብ አውታረ መረብ ባለስልጣን በሌለበት ጊዜ የተፈጠረ አካባቢያዊ አውታረመረብ ይጠቀሙ።

የገበያ ቦታ ኤስሮው ሞዴሎች ሻጭ ፣ ገዢ ፣ ከሰንሰለት ውጭ ክፍያ እና ልቀት። አጠቃላይ መቆለፊያዎች መድረሻን እና አማራጭ የተለየ የመልቀቅ ባለሥልጣን ስም ይሰጣሉ ፤ እነሱ በከፊል ማውጣት ፣ መሰረዝ እና ጊዜ ማብቂያ ይደግፋሉ ።

## እርምጃዎች {#steps}

### በ Rust አማካኝነት የገበያ ማስከበሪያ ማሟላት። {#_1-complete-a-marketplace-escrow-with-rust}

ይህ ተግባር እውነተኛ የተጻፈ IDs እና ደንበኞችን ይቀበላል ። 40 አሃዶችን ይከፍታል ፣ ገዢው ከሰንሰለት ውጭ ክፍያውን እንዲቀበል እና ምልክት እንዲያደርግ ያስችለዋል ፣ ከዚያ ሻጩ ጥበቃውን እንዲለቀቅ ያስችለዋል። እያንዳንዱ ማቅረቢያ ባለሥልጣን ክፍያ የሚከፈልበትን ስም በ `FeePaymentIntent` በኩል ይጠራል።

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

የመጠባበቂያ ሂሳቡ በሪጀር የሚተዳደር ነው። የተለመደ የንብረት ማስተላለፊያ ቶከን መስጠት ከኤስሮው የሕይወት ዑደት ውጭ ንቁ መጠባበቂያ እንዲፈጠር አያደርግም.

### 2. በ Python አማካኝነት አጠቃላይ መቆለፊያውን ይክፈቱ እና በከፊል ይስቡ። {#_2-open-and-partially-draw-a-generic-lock-with-python}

የመልቀቂያ ባለሥልጣኑ ከመውሰዱ በፊት የተፈረመውን ተወላጅ መዝገብ ይጠይቃል። ትክክለኛውን `remaining_amount` ማለፍ አዎንታዊ ተመሳሳይነት ያስገኛል-የተረከበ ተጓዳኝ ጥያቄ ሁለት ጊዜ ጥበቃን ከማስከፈል ይልቅ ውድቅ ተደርጓል ።

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

Python SDK `expected_remaining_amount` ሲለቀቅ በራስ-ሰር መጠየቅ ይችላል ፣ ነገር ግን የተመለከተውን እሴት በማለፍ የተፈረመውን ኢኮኖሚያዊ ቅድመ ሁኔታ በመተግበሪያ ኮድ ውስጥ እንዲታይ ያደርጋል።

ለ Rust መቆለፊያ ፍሰቶች የአሁኑ ገንቢዎች ደግሞ የተመለከተውን መጠን ይጠይቃሉ-

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

`DrawdownAssetLock::new` ሦስት እሴቶች ይወስዳል; `CancelAssetLock::new` ሁለት ይወስዳል. የሚጠበቀው ቀሪ መጠን ማስወገድ አንድ ጥንታዊ, ደህንነቱ ያልተጠበቀ ጥሪ ቅርጸት ይገልጻል.

### የ Kotodama ኤስሮው ወለልን ከ JavaScript ያጠናቅቁ። {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript ያልተጻፈ ተወላጅ መመሪያዎችን ማመንጨት አያስፈልገውም. የአሁኑ አዘጋጅ የ መለያ ማስከበሪያ የተገነባውን ወደ Kotodama ያጋልጣል; ልውውጥ እና ጥሪዎች ከዚያ በኋላ ይከተላሉ [ስማርት ኮንትራት መገንባት እና ማሰማራት](./smart-contracts.md)።

ይህንን `native_escrow.ko` ብለው ያስቀምጡ:

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

የሚከተለውን `compile-native-escrow.mjs` አድርገው ያስቀምጡ እና ያንን ትክክለኛ ምንጭ ከ Node.js ለማጠናቀር ይጠቀሙበት:

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

በቅድመ ቅድመ ሁኔታዎች ውስጥ ከተገለጸው ምንጭ የተገነባው የፓኬጅ አካባቢ ይሂዱ:

```bash
node ./compile-native-escrow.mjs
```

## ያረጋግጡ {#verify}

ለገበያ ቦታ ማስከበሪያ ጥያቄ `FindAssetEscrowById` እና የሁለቱም ወገኖች ንብረቶች ከተለቀቁ በኋላ መያዝ አለባቸው። መዝገቡ `Released` መሆን አለበት ፣ ተቀባይነት ያለው ገዢ ስም ያቅርቡ ፣ እና ቀሪውን ጥበቃ አያሳዩም ። ከላይ ላለው Python መቆለፊያ ፣ የተመለሰውን ID ይያዙ እና የተፈረመውን መጠይቅ መድገም:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

እንዲሁም የመድረሻውን የንብረት አክሲዮን መጠየቅ እና በአራት ዩኒቶች መጨመሩን ያረጋግጡ ። ያለ ኤስሮው መዝገብ እና የመድረሻ ፖስት-ስታት ያለ የግብይት ደረሰኝ ያልተሟላ ማረጋገጫ ነው ።

## ችግሮችን መፍታት {#troubleshooting}

- `Not permitted` በመክፈት ጊዜ ባለሥልጣኑ የተመረጠውን ንብረት ወደ ክምችት ማስተላለፍ አይችልም ማለት ነው. አለመግባባቶችን መፍታት የተለያዩ ዓለም አቀፍ `CanResolveEscrowDispute` በር.
- `expected remaining amount` ውድቅ በአዎንታዊነት-የተመጣጣኝነት ግጭት ነው ። መዝገቡን እንደገና ይጠይቁ ፣ ሌላውን ማውጣት / መሰረዝ የታሰበ መሆኑን ይወስኑ እና አዲሱን መመሪያ የሚፈርሙት አዲሱ ሁኔታ ተቀባይነት ካለው ብቻ ነው።
- የተዋቀረው የመልቀቅ ባለሥልጣን ብቻ አስተማማኝ መቆለፊያ ማውጣት ይችላል። መድረሻው ገንዘብ ስለሚቀበል ብቻ ሊለቀው አይችልም።
- የገበያ ቦታ መለቀቅ የሚሰራው ተቀባይነት ካገኘና ክፍያ ከተላከ በኋላ ብቻ ነው፤ መሰረዙ ቀደም ባሉት የሕይወት ዑደት ሁኔታዎች ላይ ብቻ የተወሰነ ነው።
- ጊዜ ማብቂያ የተረጋገጠ መለያ ጊዜን ይጠቀማል። የአካባቢው የግድግዳ ሰዓት የጊዜ ገደብ `ExpireAssetLock` እንደሚያልፍ የሚያረጋግጥ ማስረጃ አድርገው አያዩት ።
- የክፍያ ውድቀት ያንን የሕይወት ዑደት እርምጃ የሚያቀርብ ወገን ነው። የገንዘብ ግዢ ፣ ሻጭ / መክፈቻ እና የመልቀቂያ ባለስልጣን በ Taira ላይ ገለልተኛ በሆነ መንገድ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [የተጣራ ግዴታ ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/isi/escrow.rs) ላይ የአገር ውስጥ የኤስኮር መመሪያ ሞዴል
- [የተጣራ ግዴታ ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/native_escrow.rs) ላይ የአገር ውስጥ የኤስሮ ውህደት ሙከራዎች
- [Python የተጣራ ግዴታ ላይ የዋስትና ደንበኛ ዘዴዎች](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama የተጣራ ግዴታ ላይ ተወላጅ ኤስኮር ናሙና](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [የአገሬው ተወላጅ ንብረት የዋስትና ማስከበሪያ ](/am/blockchain/escrow.md)
- [ተንቀሳቃሽ ሀብቶች](./fungible-assets.md)
- [ፍቃዶች እና ሚናዎች](./permissions-and-roles.md)
