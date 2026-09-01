---
translation_locale: ka
translation_source: /cookbook/native-escrow.md
translation_source_hash: 576e03924f19b63681cdfafa641b996672e35a992478fc9eaf5b83f0e7baa6da
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ნაციონალური აქტივების დაფარვა {#native-asset-escrow}

## შედეგები {#outcome}

შეარჩიეთ ბაზრის ესქროს და მიზანშეწონილი აქტივების ჩაკეტვა, განახორციელეთ მიმდინარე ტიპირებული სიცოცხლის ციკლი Rust ან Python-ით, დაუკავშირდით თითოეულ ჩაკეტვას რეალურად დაფიქსირებულ დანარჩენ თანხას და შეადგინეთ ადგილობრივი Kotodama ესქროს ზედაპირი JavaScript დან.

## წინაპირობები {#prerequisites}

- ნომერული აქტივის განსაზღვრა და გამხსნელი/გაყიდველი, რომელსაც აქვს საკმარისი რაოდენობა.
- დაფინანსებული ერთგასაღებიანი I105 კლიენტები ყოველი მხარისთვის, რომელიც ნაბიჯს აგზავნის. გამოიყენეთ ავტორიტეტის მიერ გადახდილი მოქმედი `fee_payment` განზრახვა, რომლის საკომისიო აქტივი Taira-ს გამცემის მიმდინარე პასუხს ემთხვევა; დოკუმენტაციიდან აქტივის ID არ ჩასვათ.
- ამჟამინდელი Rust ან Python SDK პროტოკოლიდან Iroha პროტოკოლის დასკვნით `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- JavaScript კომპილერის მაგალითისთვის, Node.js 24 პლუს ნაშენები ადგილობრივ განვითარების გარემოში `@iroha/iroha-js` პაკეტი და მისი მშობლიური `iroha_js_host`; დაიცავით [JavaScript SDK წყარო ნაგებობის კონფიგურაცია](/ka/guide/tutorials/javascript.md#build-from-source). ბრაუზერის ნაგებობები უნდა უზრუნველყოს `compilerUrl` ნაცვლად ადგილობრივი მასპინძლის დატვირთვის.
- Taira უნდა აღიაროს აქტივების გადაცემა და საფინანსო ინსტრუქცია. აქტივების მფლობელებს შეუძლიათ გამოიყენონ ჩვეულებრივი სიცოცხლის ციკლი, როდესაც მათი აქტივების პოლიტიკა ამის საშუალებას იძლევა; დავისთვის საჭიროა გლობალური `CanResolveEscrowDispute` ნებართვა. გამოიყენეთ წარმოქმნილი ლოკალური ქსელი, როდესაც საჭირო საჯარო ბლოკჩეინის ქსელის ავტორიზაციის პრინციპი არ არსებობს.

მარკეტპლეისი ესქრო მოდელები გამყიდველი, მყიდველი, ქსელის გარეთ გადახდა და გათავისუფლება. ჯენერიკული საკეტები დასახელება მიმართულება და ვარიანტურად განსხვავებული გათავისუფლების ავტორიზაციის პრინციპი; ისინი მხარს უჭერენ ნაწილობრივ ამოღებას, გაუქმებასა და ვადის გასვლისას.

## ნაბიჯები {#steps}

### 1. შეავსეთ საბაზრო საფინანსო დავალიანება Rust {#_1-complete-a-marketplace-escrow-with-rust}

ეს ფუნქცია იღებს რეალურ ტიპირებულ ID-ს და კლიენტებს. ის გახსნის 40 ერთეულს, საშუალებას აძლევს მყიდველს მიიღოს და დააფიქსიროს ქსელის გარეთ გადახდის, შემდეგ გამყიდველს უშვებს მზრუნველობას. თითოეული წარდგენა ასახელებს ავტორიზაციის საფასურის გადამხდელს: `FeePaymentIntent`.

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

სათავსო ანგარიშს მართავს ბლოკჩეინის რეესტრი. აქტივების ტრანსფერის ჩვეულებრივი ტოკენის მინიჭება არ ხდის აქტიურ სათავსოს გათავისუფლებას საფინანსო გადამხდელების გარეთ.

### 2. გახსენით და ნაწილობრივ ამოიღეთ გენერული საკეტი Python {#_2-open-and-partially-draw-a-generic-lock-with-python}

გათავისუფლების ნებართვის მდივანი გამოკითხავს ხელმოწერილი მშობლიური ჩანაწერს, სანამ ამოიღებს. ზუსტი `remaining_amount` გაცემა უზრუნველყოფს ოპტიმისტურ თანამედროვეობას: მოძველებული პარალელური თხოვნა უარყიდება იმის მაგივრად, რომ ორჯერ დააბრუნოს შენახვა.

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

`DrawdownAssetLock::new` იღებს სამ ღირებულებას; `CancelAssetLock::new` იღებს ორს. მოსალოდნელი დარჩენილი თანხის გამორიცხვა აღწერს ძველ, უსაფრთხო ტექნიკურ მოწოდების ფორმას.

### 3. შეადგინეთ Kotodama დაფარვის ზედაპირი JavaScript {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript არ საჭიროებს გამოიგონოს არატიპიზებული მშობლიური ინსტრუქციები. ამჟამინდელი კომპილერი ხსნის ბლოკჩეინის რეესტრი ესქრო ჩაშენებული Kotodama; განთავსება და ტექნიკური გამოძახებები შემდეგ მოჰყვება [შეიქმნას და განახორციელოს ჭკვიანი კონტრაქტი](./smart-contracts.md)

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

ბაზრის ესქროსთვის, შეკითხვა `FindAssetEscrowById` და ორივე მხარის აქტივების შენახვა გათავისუფლების შემდეგ. ჩანაწერი უნდა იყოს `Released`, სახელწოდება მიღებული მყიდველი, და არ აჩვენოს დარჩენილი მფლობელობა. ზემოთ Python საკეტისთვის, შეინახეთ დაბრუნებული ID და გაიმეორეთ ხელმოწერილი გამოძიება:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

ასევე შეისწავლეთ დანიშნულების აქტივების შენახვა და დაადასტურეთ, რომ ეს ოთხი ერთეულით გაიზარდა. ტრანზაქციული ქვითრი ეშროვის ჩანაწერისა და მიმართულების პოსტ-სახელმწიფოს გარეშე არასრული შემოწმებაა.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `Not permitted` გახსნის დროს, როგორც წესი, ნიშნავს, რომ ავტორიზაციის მფლობელმა არ შეიძლება გადასცეს შერჩეული აქტივი დაცვაში. დავების გადაწყვეტას აქვს ცალკე გლობალური კარიბჭე `CanResolveEscrowDispute`.
- `expected remaining amount` უარყოფა არის ოპტიმიზმის კონფლიქტი-კონკურენცია. შეამოწმეთ რეკორდი, გადაწყვიტეთ იყო თუ არა განზრახული სხვა ამოღება / გაუქმება და ხელი მოაწერეთ ახალ ინსტრუქციას მხოლოდ იმ შემთხვევაში, თუ ახალი მდგომარეობა მისაღებია.
- მხოლოდ კონფიგურირებული განთავისუფლების ავტორიზაციის ხელმძღვანელმა შეიძლება მოიპოვოს საიმედო საკეტი. დანიშნულების ადგილი ვერ გაათავისუფლებს მას მხოლოდ იმიტომ, რომ ის მიიღებს თანხებს.
- ბაზარზე გათავისუფლება ძალაშია მხოლოდ მიღებისა და გადახდის გამოგზავნის შემდეგ; გაუქმება შეზღუდულია ადრეული სიცოცხლის ციკლის მდგომარეობებით.
- ვადის გასვლა რეესტრის ავტორიტეტულ დროს იყენებს. ლოკალური სისტემური საათის ტაიმაუტი არ ჩათვალოთ იმის მტკიცებულებად, რომ `ExpireAssetLock` წარმატებით შესრულდება.
- საფასურის გადაუხდელობა ეკუთვნის იმ მხარეს, რომელმაც წარუდგინა ეს ცხოვრების ციკლის ნაბიჯი. ფონდის მყიდველი, გამყიდველი/გამომხსნელი და გათავისუფლების ნებართვის პირი დამოუკიდებლად Taira.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [ორიენტირებული საფინანსო ინსტრუქციის მოდელი, ჩაკეტილი წყარო კოდის რევიზიით](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [ადგილობრივი ესქრო ინტეგრაციის ტესტები დამაგრებული საწყისი კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python საფინანსო კლიენტის მეთოდები ჩაკეტილი წყარო კოდის გადახედვისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama ადგილობრივი საფინანსო ანაზღაურების ნიმუში ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [ნაციონალური აქტივების საფინანსო დაფარვა](/ka/blockchain/escrow.md)
- [ფუნქციური აქტივები](./fungible-assets.md)
- [ნებართვები და როლები](./permissions-and-roles.md)
