---
translation_locale: ka
translation_source: /cookbook/native-escrow.md
translation_source_hash: aa8e079684879bdcda2b4439e9c12742d4ab477e6f560f7c326a59b6be5bf666
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ნაციონალური აქტივების დაფარვა {#native-asset-escrow}

## შედეგები {#outcome}

შეარჩიეთ ბაზრის საფარდლო და მიზანშეწონილი აქტივების საკეტი, განახორციელეთ მიმდინარე ტიპირებული სიცოცხლის ციკლი Rust ან Python-ით, დაუკავშირდით თითოეულ საკეტს დარჩენილ თანხას, რომელსაც ფაქტობრივად აკვირდებოდით და შეადგინეთ ადგილობრივი Kotodama საფარდის ზედაპირი JavaScript.

## წინაპირობები {#prerequisites}

- ნომერული აქტივის განსაზღვრა და გამხსნელი/გაყიდველი, რომელსაც აქვს საკმარისი რაოდენობა.
- დაფინანსებული, ერთმნიშვნელოვანი I105 კლიენტები თითოეული მხარისთვის, რომელიც წარადგენს ნაბიჯს. გამოიყენეთ პირდაპირი ხელისუფლების მიერ გადახდილი `fee_payment` განზრახვა, რომლის საფასური აქტივი შეესაბამება მიმდინარე Taira საბანკო რეაგირებას; არ ჩასვათ აქტივი ID დოკუმენტაციიდან .
- ამჟამინდელი Rust ან Python SDK მოცულობა Iroha ვალდებულებისგან `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- JavaScript კომპილერის მაგალითისთვის, Node.js 24 პლუს ადგილობრივად შექმნილი `@iroha/iroha-js` პაკეტი და მისი მშობლიური `iroha_js_host`; დაიცავით [JavaScript SDK წყარო ნაგებობის პარამეტრები ](/ka/guide/tutorials/javascript.md#build-from-source). ბრაუზერის ნაგებობები უნდა უზრუნველყოს `compilerUrl` ნაცვლად ადგილობრივი მასპინძლის დატვირთვისა.
- Taira უნდა აღიაროს აქტივების გადაცემის და საფინანსო ინსტრუქციები. აქტივების მფლობელებს შეუძლიათ გამოიყენონ ჩვეულებრივი სიცოცხლის ციკლი, როდესაც მათი აქტივების პოლიტიკა ამის საშუალებას იძლევა; დავების მოგვარებისთვის საჭიროა გლობალური `CanResolveEscrowDispute` ნებართვა. გამოიყენეთ გენერირებული ადგილობრივი ქსელი, როდესაც არ არის საჭირო საზოგადოებრივი ქსელის ორგანო.

Marketplace escrow მოდელები გამყიდველი, მყიდველი, off-chain გადახდა და გათავისუფლება. ჯენერიკური საკეტები დასახელება მიმართულება და ვარიანტურად განსხვავებული გათავისუფლების ორგანო; ისინი მხარს უჭერენ ნაწილობრივ ამოღებას, გაუქმებასა და ვადაგასამართლებას.

## ნაბიჯები {#steps}

### 1. შეავსეთ საბაზრო საფინანსო დავალიანება Rust {#_1-complete-a-marketplace-escrow-with-rust}

ეს ფუნქცია იღებს რეალური ტიპირებული IDs აიღებს 40 ერთეულს, საშუალებას აძლევს მყიდველს მიიღოს და დააფიქსიროს გადახდა ქსელის გარეთ. შემდეგ გამყიდველს აძლევს უფლება გაათავისუფლოს მზრუნველობა. თითოეული წარდგენა ასახელებს ავტორიტეტის საფასურის გადამხდელს `FeePaymentIntent`.

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

მფლობელობის ანგარიში მართულია მთავარ წიგნში. ნორმალური აქტივების გადარიცხვის ტოქენის მინიჭება არ ხდის აქტიურ მფლობელს გარეთ გატარებადი ცხოვრების ციკლის გარეშე.

### 2. გახსენით და ნაწილობრივ ამოიღეთ გენერული საკეტი Python {#_2-open-and-partially-draw-a-generic-lock-with-python}

გათავისუფლების ორგანოს მიერ ხელმოწერილი ადგილობრივი ჩანაწერის გამოკითხვა მოხდება, სანამ ამოიღებენ. ზუსტი `remaining_amount` გადაცემა უზრუნველყოფს ოპტიმისტურ თანამედროვეობას: მოძველებული პარალელური თხოვნა უარყოფილია იმის ნაცვლად, რომ ორჯერ დააბრუნდეს მზრუნველობა.

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

Python SDK-ს შეუძლია ავტომატურად გამოკითხოს, როდესაც `expected_remaining_amount` გამორიცხულია, მაგრამ დაკვირვებული ღირებულების გადატანა ხელს უწყობს ხელმოწერილი ეკონომიკური წინაპირობის ხილვას განაცხადის კოდში

Rust ჩაკეტვის ნაკადებისათვის, მიმდინარე კონსტრუქტორები ასევე ითხოვენ დაკვირვებულ რაოდენობას:

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

`DrawdownAssetLock::new` იღებს სამ ღირებულებას; `CancelAssetLock::new` იღებს ორს. მოსალოდნელი დარჩენილი თანხის გამორიცხვა აღწერს უფრო ძველ, უსაფრთხო ზარის ფორმას.

### 3. შეადგინეთ Kotodama დაფარვის ზედაპირი JavaScript {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript არ საჭიროებს გამოიგონოს untyped მშობლიური ინსტრუქციები. ამჟამინდელი კომპილერი ხსნის ლიდერის escrow ჩაშენებული Kotodama; განთავსება და ზარები შემდეგ მოჰყვა [Build and deploy a smart contract](./smart-contracts.md) .

შეინახეთ ეს როგორც `native_escrow.ko`:

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

შემდეგნაირად შეინახეთ `compile-native-escrow.mjs` და გამოიყენეთ მისი გამოყენებით, რათა ზუსტი წყარო Node.js-დან შეადგინოთ:

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

განახორციელეთ იგი წყაროზე შექმნილი პაკეტის გარემოში, რომელიც აღწერილია წინაპირობებში:

```bash
node ./compile-native-escrow.mjs
```

## შემოწმება {#verify}

ბაზრის საფარდოდ, გამოკითხვა `FindAssetEscrowById` და ორივე მხარის აქტივების შენახვა გათავისუფლების შემდეგ. ჩანაწერი უნდა იყოს `Released`, სახელწოდება მიმღები მყიდველი, და არ აჩვენოს დარჩენილი დაცვის. ზემოთ Python საკეტისთვის, შეინახეთ დაბრუნებული ID და გაიმეორეთ ხელმოწერილი გამოკითხვა:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

ასევე შეისწავლეთ მიზნის აქტივების შენახვა და დაადასტურეთ, რომ ეს ოთხი ერთეულით გაიზარდა. ტრანზაქციის მიღება საფინანსო ანგარიშის გარეშე და მიზნების შემდგომ მდგომარეობა არასრულფასოვანი შემოწმებაა.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `Not permitted` გახსნის დროს, როგორც წესი, ნიშნავს, რომ ორგანოს არ შეუძლია გადასცეს შერჩეული აქტივი მფლობელობაში. დავების გადაწყვეტას აქვს ცალკე გლობალური კარიერა `CanResolveEscrowDispute`.
- `expected remaining amount` უარყოფა არის ოპტიმიზმის კონფლიქტი-კონკურენცია. შეამოწმეთ რეკორდი, გადაწყვიტეთ იყო თუ არა განზრახული სხვა ამოღება / გაუქმება და ხელი მოაწერეთ ახალ ინსტრუქციას მხოლოდ იმ შემთხვევაში, თუ ახალი მდგომარეობა მისაღებია.
- მხოლოდ კონფიგურირებულმა გათავისუფლების ორგანომ შეიძლება გამოიწვიოს საიმედო საკეტი. დანიშნულების ადგილი არ შეიძლება გაათავისუფლოს მას მხოლოდ იმიტომ, რომ ის მიიღებს თანხებს.
- ბაზარზე გათავისუფლება ძალაშია მხოლოდ მიღებისა და გადახდის გამოგზავნის შემდეგ; გაუქმება შეზღუდულია ადრეული სიცოცხლის ციკლის მდგომარეობებით.
- ვადის ამოწურვისას გამოიყენება ავტორიტეტული წიგნის დრო. არ განიხილოთ ადგილობრივი კედლის საათის ვადა, როგორც მტკიცებულება იმისა, რომ `ExpireAssetLock` გაივლის.
- საფასურის გადაუხდელობა ეკუთვნის იმ მხარეს, რომელიც წარუდგენს ამ ცხოვრების ციკლის ნაბიჯს. ფონდის მყიდველი, გამყიდველი/გამხსნელი და განთავისუფლების ორგანო დამოუკიდებლად Taira.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [ნაციონალური საფინანსო ინსტრუქციის მოდელი დაწესებულ კომიტეტზე](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Native escrow integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python საფინანსო კლიენტის მეთოდები ჩაკეტილი ვალდებულების განსაზღვრისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama ნაციონალური საფინანსო ანაზღაურების ნიმუში ჩაკეტილი ვალდებულების](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [ეროვნული აქტივების საფინანსო დავალიანება](/ka/blockchain/escrow.md)
- [ფუნქციური აქტივები](./fungible-assets.md)
- [ნებართვები და როლები](./permissions-and-roles.md)
