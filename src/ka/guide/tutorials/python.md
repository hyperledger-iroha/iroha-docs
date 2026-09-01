---
translation_locale: ka
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

აღმავალი სამუშაო სივრცეში Python SDK არის `iroha-python`. პირველი Iroha 3 გამოშვება მიზნად ისახავს მიმდინარე Torii და Norito ზედაპირებს. დააჭირეთ პაკეტის ვერსია ან წყარო რევიზიონი, რომელიც გამოიყენება თქვენი ინტეგრაციის მიერ, რათა SDK და კვანძი დარჩნენ იმავე სერიალიზაციის ფორმატის რევიზიონზე .

ანონიმური წაკითხვის მაგალითები ქვემოთ მიზნობრივი საჯარო Taira მისამართზე `https://taira.sora.org`. მარშრუტი შეიძლება იყოს მხოლოდ წაკითხვა და მაინც მოითხოვს კანონიკური ანგარიშის ხელმოწერა ან ზუსტი ქსელის ოპერატორის ხელმოწერა; ეს მაგალითები ცალკე აღნიშნულია. მუტაციური მაგალითებია ტრანზაქციის შაბლონები და საჭიროა რეალური Taira ავტორიზაციის პრინციპი, კერძო გასაღები, გადასახადის გადახდის განზრახვა, საკმარისი ტესტნეტი XOR და მიზნობრივი მარშრუტის მიერ მოთხოვნილი აuthentication სანამ ისინი შეიძლება წარდგენილი იყოს.

გამოიყენეთ მაგალითები ამ რიგში:

|ეტაპი | დაპირისპირება საზოგადოებასთან Taira?            |რა გჭირთ?|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|ანონიმური კითხვის ზარები.|დიახ.|Python პაკეტი და ქსელის წვდომა |
|ანგარიშის ან ოპერატორის მიერ დამოწმებული წაკითხვა |მხოლოდ თქვენი საკუთარი აღიარებული იდენტობის შემთხვევაში.|ზუსტი Taira `NetworkId` და შესაბამისი ანგარიშის ან ოპერატორის გასაღები |
|ადგილობრივი ხელმოწერისა და ინსტრუქციის მშენებლები |არანაირი ქსელური ზარი სანამ `submit()` |ნეიტური გაგრძელება და თქვენი მთავარი მასალა |
|მუტაციის ოპერაციები და მომსახურების ზარები |მხოლოდ თქვენს მიერ დაფინანსებულ ანგარიშზე.|ავტორიზაციის ძირითადი ანგარიში, კერძო გასაღები, ზუსტი Taira `NetworkId`, ტიპირებული საფასურის განზრახვა, საფასური აქტივების ბალანსი და მარშრუტის ტოკენები |
|გაერთიანეთ ჩარჩო კოდექები, კრიპტო და GPU დამხმარეები |მხოლოდ ადგილობრივი |მშობლიური გაფართოება; GPU დამხმარეებს ასევე სჭირდებათ CUDA-სუნებლიანი ბეკენდი |

## დამონტაჟება {#install}

პაკეტის მეტამონაცემების სახელწოდება არის `iroha-python`. არ ჩათვალოთ, რომ არაფუნქციონირებული PyPI ინსტალაცია შეესაბამება ცოცხალ Taira ქსელს. დააყენეთ ბორბლის ან წყარო კოდის სამუშაო ასლი, რომელიც აშენდა იმავე ზემოაღნიშნული რევიზიისგან თქვენი ინტეგრაციის მიზნები:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

თუ თქვენი პროექტი უშუალოდ მოიხმარს სამუშაო სივრცეს, დააინსტალირეთ Python დამოკიდებულებები და შექმენით ადგილობრივი გაფართოება, სანამ ჩატარებთ მაგალითებს, რომლებიც იყენებენ `Instruction`, `TransactionDraft`, ხელმოწერა, კრიპტო, SoraFS მშობლიური დამხმარეები, GPU დამხმარეები ან Connect ჩარჩო კოდეკები. გამოიყენეთ აღმასრულებელი ბრძანება `python/iroha_python/README.md`, შემდეგ შეამოწმეთ, რომ ადგილობრივი ექსპორტი ატვირთება:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

თუ `create_torii_client` იმპორტი არ შეესაბამება `Instruction` ან `generate_ed25519_keypair`, ხელმისაწვდომია სუფთა Python პაკეტი, მაგრამ ადგილობრივი გაფართოება - არა.

## სწრაფი დასაწყისი {#quickstart}

დაიწყეთ საჯარო, მხოლოდ წაკითხვისთვის საჭირო Taira API საბოლოო წერტილებთან:

```python
from iroha_python import (
    create_torii_client,
)

client = create_torii_client("https://taira.sora.org")

# Public reads do not need an authority or private key.
status = client.request_json("GET", "/status", expected_status=(200,))
accounts = client.list_accounts_typed(limit=5)

print(status["build"]["version"])
for account in accounts.items:
    print(account.id)
```

## საერთო განლაგება {#shared-setup}

გამოიყენეთ ეს პარამეტრი მუტირებადი შაბლონებისთვის. შეცვალეთ თითოეული ადგილმდებარეობა Taira ავტორიზაციის პრინციპით, კერძო გასაღებით, ჯეკონით და აქტივის / ანგარიშის ID-ებით თქვენი განთავსების წინ.

`authority` არის ანგარიში, რომელიც ხელს აწერს ტრანზაქციას და `private_key` უნდა შეესაბამებოდეს მას. ტრანზაკციები უკავშირდება Taira-ის ზუსტ გენეზისიდან გამომდინარე `NetworkId`; ჯაჭვი UUID არის განთავსების ეტიკეტი, არა ტრანზუქციის იდენტობა . საფასურები იყენებს ტიპირებულ გადახდის განზრახვას და ზუსტ საფასურის შეფასებას, დამოუკიდებლად განაცხადის მეტამონაცემებისა. ქვემოთ მოცემული ანგარიში და საკვანძო ადგილის მფლობელები მიზანმიმართულად არასწორია, ამიტომ ისინი შემთხვევით არ წარმოდგენილია.

ქვემოთ მოცემული ლექსიკონი არის მიმდინარე ჩაკეტილი Taira ბლოკჩეინის გენეზის იდენტობა. ტესტნეტის განახლება შეიძლება შეცვალოს იგი, ასე რომ განაახლეთ ის ხელმოწერილი განთავსების პროფილისგან და არასოდეს გამოიყოს მას ჯაჭვიდან UUID.

```python
from iroha_python import (
    Ed25519KeyPair,
    Instruction,
    LocalSigningContext,
    NetworkId,
    ToriiClient,
    ToriiCanonicalRequestAuth,
    TransactionConfig,
    TransactionDraft,
    authority_fee_payment,
)

TORII_URL = "https://taira.sora.org"
TAIRA_NETWORK_ID = NetworkId.parse(
    "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
)
AUTH_TOKEN = None

# Replace these placeholders with the real signing keys for your accounts.
alice_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<alice-private-key-hex>"))
bob_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<bob-private-key-hex>"))

# The authority string must identify the same account as the private key.
alice = "<alice-account-id>"
bob = "<bob-account-id>"

canonical_auth = ToriiCanonicalRequestAuth(
    network_id=TAIRA_NETWORK_ID.literal,
    account_id=alice,
    signer=alice_pair.sign,
)

ROSE_DEFINITION = "rose#wonderland"
ROSE_ASSET = "<rose-asset-id>"
BADGE_NFT = "badge$wonderland"

APP_METADATA = {"source": "python-docs"}
# Torii replaces the empty maxima with an exact, validated live fee quote before
# anything is signed. The payer remains the transaction authority.
BASE_FEE_PAYMENT = authority_fee_payment(charge_limits=[])

client = ToriiClient(
    TORII_URL,
    local_signing_context=LocalSigningContext(TAIRA_NETWORK_ID),
    canonical_request_auth=canonical_auth,
    auth_token=AUTH_TOKEN,
)


def submit(*instructions):
    draft = TransactionDraft(
        TransactionConfig(
            network_id=TAIRA_NETWORK_ID,
            authority=alice,
            fee_payment=BASE_FEE_PAYMENT,
            metadata=APP_METADATA,
        )
    )
    draft.extend_instructions(instructions)

    # Freeze one payload, obtain its exact fee limits, and sign that same payload.
    envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
    status = client.submit_transaction_envelope_and_wait(envelope)
    return envelope, fee_quote, status
```

`Instruction.*` მხოლოდ კონსტრუქციის ინსტრუქციების დატვირთვებს უწოდებს. `submit()` არის ის მომენტი, როდესაც SDK იღებს ცოცხალი საფასურის ფასის შეფასებას, ხელს აწერს ზუსტად მითითებულ სასარგებლო დატვირთვას, გამოგზავნის მას Torii და ელოდება სტატუსს.

## საფასურები და ტრანზაქციის განხორციელების ღირებულება {#fees-and-gas}

წერილობითი ტრანზაქციები საჭიროებენ `FeePaymentIntent` დაფინანსებული საფასურის აქტივების ბალანსს. Taira-ზე, საჯარო ტესტნეტის ფინანსირების მომსახურების ფონდები სატესტო ქსელი XOR. Python SDK გამოგზავნის ფიქსირებულ ხელმოწერილი სასარგებლო დატვირთვა Torii საფასურის ზუსტი ფასის შეფასებისთვის, ადასტურებს, რომ შეთავაზება გადამხდელს ან დატვირთვას არ შეცვლია და ხელს უწერს მითითებულ განზრახვას. საფასურის შერჩევა ტრანზაქციის მეტატალებში არ ჩასვათ.

ზემოაღნიშნული `submit()` დამხმარე იწყება ტრანზაქციის ხელმოწერის მიზნით გადახდილი ანგარიშით, რომლის საფასურის ლიმიტებიც განზრახ ცარიელია. `quote_and_sign()` ასრულებს მათ პირდაპირი ციტირებისგან ხელმოწერამდე:

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=authority_fee_payment(charge_limits=[]),
        metadata={"source": "python-fee-example"},
    )
)
draft.add_instruction(
    Instruction.set_account_key_value(
        alice,
        "python_fee_example",
        "ready",
    )
)
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
status = client.submit_transaction_envelope_and_wait(envelope)

for limit in fee_quote["intent"]["value"]["charge_limits"]:
    print(limit["asset_definition_id"], limit["max_amount"])
```

სანამ გაგზავნით წერილებს, დარწმუნდით, რომ ავტორიზაციის ძირითადი ანგარიში ფლობს საკმარის რაოდენობით საფასურის აქტივს. ზუსტი ტესტური მონეტების გამცემი და აქტივების ID არის ქსელის სპეციფიკური; ეს არის Taira ფორმა:

```python
FEE_ASSET_DEFINITION = "6TEAJqbb8oEPmLncoNiMRbLEK6tw"
# The faucet returns the concrete account asset ID to check here.
FEE_ASSET_ID = "<fee-asset-id-from-faucet-response>"

# Fail before submitting if the signer cannot pay gas.
fee_assets = client.list_account_assets_typed(
    alice,
    limit=10,
    asset_id=FEE_ASSET_ID,
)
if not fee_assets.items:
    raise RuntimeError("fund the authority account with the Taira fee asset first")
```

ტესტური მონეტების გამცემი ბრუნავს ბეტონის `asset_id`, რომელიც გამოიყენება ბალანსის შემოწმებისთვის. შეამოწმეთ, რომ ცოცხალი კოტირება მოითხოვს `FEE_ASSET_DEFINITION`; ტრანზაქცია ამ აქტივს მეტამონაცემებით არ ასახელებს.

აპლიკაციის მეტამონაცემები ვარიანტია და არ აქვს საფასური სემანტიკის:

```python
APP_METADATA = {"source": "python-docs"}

draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)
```

თუ გადახდის განზრახვას არ შეასრულებთ, მოულოდნელი აქტივის კოტირებას მიიღებთ, კოტირების შემდეგ დატვირთვის შეცვლას აპირებთ ან ფინანსური უზრუნველყოფის გარეშე ანგარიშზე გაფორმდებით, ტრანზაქცია არ უნდა წარედგინოთ.

## ანონიმური Taira კითხულობს {#anonymous-taira-reads}

ამ ზარებში გამოიყენება Taira მარშრუტები, რომელთა კატალოგის საზღვარი იძლევა ანონიმურ წაკითხვას:

```python
client = create_torii_client("https://taira.sora.org")

# Use raw requests for endpoints that do not need a typed wrapper.
status = client.request_json("GET", "/status", expected_status=(200,))
parameters = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Typed helpers parse pagination and records into dataclasses.
accounts = client.list_accounts_typed(limit=1)
domains = client.list_domains_typed(limit=1)
definitions = client.list_asset_definitions_typed(limit=1)

# These calls inspect live node subsystems without mutating state.
time_now = client.get_time_now()

print(status["build"]["version"])
print(parameters["sumeragi"]["block_cadence_ms"])
print(accounts.total, domains.total, definitions.total)
print(time_now.now_ms)
```

`/v1/time/status` და ყველა `/v1/sumeragi/*` ოპერატორის წერტილის დროში მონაცემების ნახვა საჭიროებს ზუსტ ქსელის ოპერატორის ხელმოწერას, მიუხედავად იმისა, რომ ისინი არ მუტაციის მდგომარეობა. გამოიყენეთ `request_json("GET", "/status")` ანონიმური კვანძისთვის სტატუსი სასარგებლო დატვირთვა და ოპერატორის პარამეტრი ქვემოთ კონსენსუსის ან ნოდ-ლოკალური საათის დიაგნოსტიკისთვის. Connect სესიის სტატუსი არის ცალკე პროტოკოლის მარშრუტი და საჭიროებს იმ სესიის მართვის ტოქენი.

## ინსტრუქციის მშენებლები {#instruction-builders}

SDK გამოხატავს ტიპირებულ მშენებლებს ყველაზე გავრცელებული ინსტრუქციის ოჯახებისთვის და JSON გაქცევების კარიბჭეს ვარიანტებისთვის, რომლებიც ჯერ კიდევ არ არიან პირველი კლასის Python მეთოდები. შემდეგი ნაწყვეტები მუტაციური ტრანზაქციული შაბლონებია და საჯარო Taira-ს ხელმოწერის გარეშე არ წარუდგინეს.

სასურველია ჩაწერილი დამხმარეები, როდესაც ისინი არსებობენ: ისინი ნორმალიზებენ Python მნიშვნელობებს და არასწორ ფორმებზე ადრეულ პერიოდში ჩავარდებიან. გამოიყენეთ `Instruction.from_json` მხოლოდ მაშინ, როდესაც საჭიროა ინსტრუქციის ვარიანტი, რომელსაც ჯერ არ აქვს Python დამხმარე.

|ინსტრუქციის ოჯახი |Python ზედაპირი |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|რეგისტრაცია | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` განკუთვნილია გენეზისი/საწყისი გამართვა ინსტრუმენტებისთვის. |
|დარეგისტრირება |`unregister_trigger`; გამოყენება `Instruction.from_json` სხვა ვარიანტებისთვის |
|Mint/Burn |`mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
|გადაცემა | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa`                                                              |
|მეტამონაცემები და კონტროლი | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value`                                                                        |
|RWA სიცოცხლის ციკლი | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa`                                                                                                         |
|ExecuteTrigger |`execute_trigger` |
| რეპოს/ანგარიშსწორების გაფართოებები | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|ადგილობრივი აქტივების ჩაკეტვა |`open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock` და დამხმარე კლიენტები `*_and_wait` |
|მინიჭება/გაუქმება, SetParameter, ჟურნალი, მორგებული, განახლება და რეგისტრაციისა თუ რეგისტრაციის გაუქმების ნაკლებად გავრცელებული ვარიანტები |`Instruction.from_json` ან `TransactionBuilder.add_instruction_json` კანონიკური `InstructionBox` JSON-ით |

საფინანსო სტილის პირობითი გადახდებისათვის იხილეთ [ნაციონალური აქტივების დაფარვა](/ka/blockchain/escrow.md#python-asset-locks). Python ამჟამად გამოავლინებს პირველხარისხის დამხმარე პირებს გენერული აქტივების ჩაკეტვისთვის; ბაზარზე და ანონიმურ საფინანსო დახმარებებზე არ არის პირველი ხარისხის. Python მეთოდები ჯერ არ არის.

### შეიქმნას დომენები, შემდეგ რეგისტრაცია ანგარიშები და აქტივები {#set-up-domains-then-register-accounts-and-assets}

ჩვეულებრივი დომენის შექმნა გადის დეკლარაციური ალიასების დაგეგმვის მეშვეობით, ასე რომ SNS იჯარის ხელშეკრულება, მფლობელის შესაძლებლობები, საფასურის ფასის დამადასტურებელი დაცვა და დომენის მდგომარეობა ერთად შემოწმებულია. შეიქმნას ალიასი-უფასო `AliasSetupPlanRequestV1` განზრახვა თქვენი SDK ან ჩართვა სერვისი, შემდეგ გამოიყენოთ `iroha app alias setup plan` და `iroha app alias setup apply`. არ წარადგინოს `Instruction.register_domain` განაცხადის ტრანზაქციადან; რომ მშენებელი რჩება გენეზისი / საწყისი გამართვა ინსტრუმენტების.

დომენის დაყენების გეგმის დასრულების შემდეგ, რეგისტრირეთ დომენის საკუთრებაში არსებული ობიექტები. საერთო ქსელში, როგორიცაა Taira, გამოიყენეთ თქვენთვის მინიჭებული დომენი და ანგარიშის სახელების სივრცე.

```python
# The domain and its SNS lease already exist before this transaction.
submit(
    Instruction.register_account(alice, {"display_name": "Alice"}),
    Instruction.register_account(bob, {"display_name": "Bob"}),
    Instruction.register_asset_definition_numeric(
        ROSE_DEFINITION,
        owner=alice,
        scale=2,
        mintable="Infinitely",
        confidential_policy="TransparentOnly",
        metadata={"symbol": "ROS"},
    ),
)
```

`mintable` მიიღებს `Infinitely`, `Once`, `Not`, ან `Limited(n)` მონაცემთა მოდელის მიერ მიღებული მნიშვნელობები. გამორიცხეთ `scale` შეუზღუდავი ციფრული აქტივისთვის.

### გაცემა, განადგურება და აქტივების გადაცემა {#mint-burn-and-transfer-assets}

ეს ზარები იყენებს არსებულ აქტივის ID- ს. პირველ რიგში დაარეგისტრირეთ აქტივის განსაზღვრა, შემდეგ კი შეიქმნას კონკრეტული აქტივის ID ანგარიშისთვის, რომელიც ფლობს აქტივს.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### გადაცემის მფლობელობა {#transfer-ownership}

მფლობელობის გადაცემა ცვლილება ვინ აკონტროლებს დომენს, აქტივების განსაზღვრა ან NFT. გამოიყენეთ მიმდინარე მფლობელი როგორც ტრანზაქციის ავტორიზაციის პრინციპული.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### მოწყობა და ამოღება მეტამონაცემები {#set-and-remove-metadata}

მეტამონაცემები ღირებულებები უნდა იყოს JSON-სერიალიზებადი. როდესაც თქვენ გამოიყენოთ `TransactionDraft`, ავტორიზაციის პრინციპული `TransactionConfig` ხდება გათვალისწინებული სამიზნე ანგარიში.

```python
# Values are encoded as JSON metadata under the target account.
submit(
    Instruction.set_account_key_value(
        alice,
        "profile",
        {"display_name": "Alice", "tier": "operator"},
    )
)

# Removing the key deletes the metadata entry from the account.
submit(Instruction.remove_account_key_value(alice, "profile"))
```

მაღალი დონის პროექტის დამხმარე მიმართავს ტრანზაქციის ავტორიზაციის პრინციპს ჩვეულებრივ:

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### რეალური აქტივები {#real-world-assets}

RWA დამხმარეები იყენებენ JSON-სერიალიზებადი დატვირთვებს აქტივების სპეციფიკური მეტამონაცემების, წარმომავლობის და კონტროლერის პოლიტიკისათვის. `register_rwa` არ იღებს `id` ან `owner`: შესრულების გარემოში წარმოიქმნება `RwaId`, ხოლო ტრანზაქციის ავტორიზაციის პრინციპი ხდება პირველადი მფლობელი.

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)

# Register the lot in a domain. Store business identifiers in primary_reference
# or metadata, then query the generated RWA ID after the transaction commits.
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "commodity": "copper",
            "warehouse": "DXB-01",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": True,
            "redeem_enabled": True,
        },
    }
)
```

რეგისტრაციის ტრანზაქციის დასრულების შემდეგ, გამოიყენეთ `FindRwas`, `/v1/rwas`, RWA მოვლენა ან გამომძიებლის მარშრუტი, რომელიც განსაზღვრულია გენერირებული ID-ის აღმოჩენის მიზნით:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

მომდევნო ოპერაციებში გამოიყენება წარმოქმნილი `hash$domain` ID:

```python
registered_rwa_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)

# Transfer, hold, release, freeze, and redeem model the lot lifecycle.
draft.transfer_rwa(
    registered_rwa_id,
    quantity="10",
    destination=bob,
)
draft.hold_rwa(registered_rwa_id, quantity="5")
draft.release_rwa(registered_rwa_id, quantity="5")
draft.freeze_rwa(registered_rwa_id)
draft.unfreeze_rwa(registered_rwa_id)
draft.redeem_rwa(registered_rwa_id, quantity="1")

# RWA metadata and controls are separate from account metadata.
draft.set_rwa_key_value(registered_rwa_id, "auditor", "alice")
draft.remove_rwa_key_value(registered_rwa_id, "auditor")
draft.set_rwa_controls(
    registered_rwa_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)

# Merge consumes quantities from parent lots with the same domain and spec. The
# child lot gets a generated ID.
draft.merge_rwas(
    {
        "parents": [
            {"rwa": registered_rwa_id, "quantity": "40"},
            {
                "rwa": "fedcba9876543210fedcba9876543210"
                "fedcba9876543210fedcba9876543210$commodities.universal",
                "quantity": "60",
            },
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {"merge_reason": "same custodian and quality grade"},
    }
)

# Force transfer requires a configured controller and force_transfer_enabled.
draft.force_transfer_rwa(
    registered_rwa_id,
    quantity="1",
    destination=bob,
)
```

სრული გადარიცხვები შეიძლება შეიცვალოს `owned_by` არსებულ პარტიაში. ნაწილობრივი გადარიცხვა და გაერთიანება ქმნის წარმოქმნილ შვილობილ პარტებს.

### მატარებლები {#triggers}

გამოიყენეთ ტრიგერი რეგისტრაციის დამხმარეები, როდესაც შესრულებადი არის სხვა ინსტრუქციის რიგითი:

```python
# The trigger executable is just another instruction payload.
reward = Instruction.mint_asset_numeric(ROSE_ASSET, "1")

# Time triggers run on a schedule once registered.
register_hourly = Instruction.register_time_trigger(
    "hourly_reward",
    alice,
    [reward],
    start_ms=1_800_000_000_000,
    period_ms=3_600_000,
    repeats=24,
    metadata={"purpose": "docs"},
)
submit(register_hourly)

# Precommit triggers run during the transaction pipeline.
register_precommit = Instruction.register_precommit_trigger(
    "precommit_reward",
    alice,
    [reward],
    repeats=10,
    metadata={"purpose": "pipeline test"},
)
submit(register_precommit)

# Trigger execution and repetition changes are also transactions.
submit(Instruction.execute_trigger("hourly_reward", args={"reason": "manual"}))
submit(Instruction.mint_trigger_repetitions("hourly_reward", 5))
submit(Instruction.burn_trigger_repetitions("hourly_reward", 1))
submit(Instruction.unregister_trigger("hourly_reward"))
```

Torii ასევე ამჟღავნებს REST დამხმარეებს საგამოწვევო ინვენტარისთვის:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

ტრიგერის ინვენტარის ზარები მხოლოდ კითხულობს ან ამოწმებს ტრიგერების ჩანაწერებს. რეგისტრაცია, შესრულება, განმეორებითი ცვლილებები და არარეგისტრირება მუტაციური ოპერაციებია.

### ანგარიშსწორების ინსტრუქციები {#repo-and-settlement-instructions}

რეპოსა და ორმხრივი ანგარიშსწორების დამხმარეები დომენისთვის სპეციფიკურ ინსტრუქციის ვარიანტებს Norito-ს სასარგებლო დატვირთვების ხელით აგების გარეშე ამატებენ:

```python
from iroha_python import (
    RepoCashLeg,
    RepoCollateralLeg,
    RepoGovernance,
    SettlementAtomicity,
    SettlementExecutionOrder,
    SettlementLeg,
    SettlementPlan,
)

config = TransactionConfig(
    network_id=TAIRA_NETWORK_ID,
    authority=alice,
    fee_payment=BASE_FEE_PAYMENT,
    # Keep repo and settlement examples bounded by a short TTL.
    ttl_ms=120_000,
    metadata=APP_METADATA,
)
draft = TransactionDraft(config)

# Each repo leg describes one side of the financing agreement.
cash = RepoCashLeg(asset_definition_id="usd#wonderland", quantity="1000")
collateral = RepoCollateralLeg(
    asset_definition_id="bond#wonderland",
    quantity="1050",
    metadata={"isin": "ABC123"},
)
governance = RepoGovernance(haircut_bps=1500, margin_frequency_secs=86_400)

# Domain-specific draft methods append the corresponding instructions.
draft.repo_initiate(
    agreement_id="daily_repo",
    initiator=alice,
    counterparty=bob,
    cash_leg=cash,
    collateral_leg=collateral,
    rate_bps=250,
    maturity_timestamp_ms=1_704_000_000_000,
    governance=governance,
)
draft.repo_margin_call("daily_repo")
# Unwind uses the immutable counterparties, legs, and maturity stored on-chain.
draft.repo_unwind("daily_repo")

# DVP/PVP settlement plans encode ordering and atomicity for both legs.
delivery = SettlementLeg(
    asset_definition_id="bond#wonderland",
    quantity="10",
    from_account=alice,
    to_account=bob,
    metadata={"isin": "ABC123"},
)
payment = SettlementLeg(
    asset_definition_id="usd#wonderland",
    quantity="1000",
    from_account=bob,
    to_account=alice,
)
plan = SettlementPlan(
    order=SettlementExecutionOrder.PAYMENT_THEN_DELIVERY,
    atomicity=SettlementAtomicity.ALL_OR_NOTHING,
)

draft.settlement_dvp(
    settlement_id="trade_dvp",
    delivery_leg=delivery,
    payment_leg=payment,
    plan=plan,
    metadata={"desk": "rates"},
)
draft.settlement_pvp(
    settlement_id="trade_pvp",
    primary_leg=payment,
    counter_leg=delivery,
)

envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
client.submit_transaction_envelope_and_wait(envelope)
```

### JSON-ის სარეზერვო გზა {#json-escape-hatch}

როდესაც Python-ის დამხმარე ფუნქცია ხელმისაწვდომი არ არის, კანონიკური მონაცემთა მოდელის `InstructionBox` JSON გადასცით `Instruction.from_json`-ს. სანამ შესაბამისი დამხმარეები ტიპიზებული გახდება, ეს რეკომენდებული გზაა `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, კვანძის, როლისა და NFT-ის რეგისტრაციისთვის და რეგისტრაციის გაუქმების არატრიგერული ვარიანტებისთვის.

```python
from iroha_python import Instruction

# Copy this payload from Rust/CLI tooling or from a pinned data-model schema.
instruction_box_json = """
{
  "<InstructionVariant>": {
    "...": "..."
  }
}
"""

instruction = Instruction.from_json(instruction_box_json)
submit(instruction)
```

შეინახეთ ტიპირებული პროექტის გზა გარიგების საზღვარზე: იგი ინარჩუნებს ზუსტ `NetworkId`, გადასახადის გადახდის განზრახვას და საფასურის შეფასების გაფორმებამდე ინვარიანტს. პირდაპირი `TransactionBuilder` გამოყენება მოითხოვს იმავე ღირებულებებს, პლუს პირდაპირი საფასურის შეფასების მკაფიო დამტკიცებას, ასე რომ ეს არ არის შესავალი განაცხადის კოდისთვის.

წარმოქმნილი ან გაუმჭვირვალე ინსტრუქციებისათვის, ტესტის არტეფაქტების შენახვის წინ JSON-ში გადაადგილება და დაბრუნება:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## ოპერაციების სამუშაო პროცესები {#transaction-workflows}

გამოიყენეთ `TransactionDraft` აპლიკაციებში, რომლებიც ხელმოწერამდე ქმნიან მრავალ ინსტრუქციას. პროექტი საშუალებას გაძლევთ შეინახოთ ტრანზაქციის დონეზე პარამეტრები, როგორიცაა `ttl_ms`, `nonce` და მეტადატები ერთ ადგილას, შემდეგ ხელმოწერა ერთხელ:

```python
config = TransactionConfig(
    network_id=TAIRA_NETWORK_ID,
    authority=alice,
    fee_payment=BASE_FEE_PAYMENT,
    # TTL and nonce are transaction-level properties shared by all instructions.
    ttl_ms=120_000,
    nonce=1,
    metadata=APP_METADATA,
)

draft = TransactionDraft(config)
# Draft methods append instructions but do not submit anything yet. Domain
# setup is a separate alias-planner flow and has already committed here.
draft.register_account(bob, metadata={"role": "user"})
draft.register_asset_definition(
    ROSE_DEFINITION,
    owning_domain=None,
    balance_scope_policy="Global",
    name="Rose",
    scale=2,
    mintable="Infinitely",
)
draft.mint_asset_quantity(ROSE_ASSET, "100")
draft.transfer_asset_quantity(ROSE_ASSET, "25", bob)

# Quoting freezes the draft, validates exact fee limits, and signs that payload.
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
receipt = client.submit_transaction_envelope(envelope)
status = client.wait_for_transaction_status(envelope.hash_hex(), timeout=30)
print(receipt, status)
```

ექსპორტი დეტერმინისტური ტექნიკური მანიფესტის განხილვის, აუდიტის ან საფულეების გადაცემისათვის:

```python
import json
from pathlib import Path

# Manifests are review artifacts; they are not submitted by themselves.
manifest = draft.to_manifest_dict(include_creation_time=True)
print(json.dumps(manifest, indent=2))

Path("transaction_manifest.json").write_text(
    draft.to_manifest_json(indent=2, include_creation_time=True),
    encoding="utf-8",
)
```

თუ სამიზნე ზოლი კონფიდენციალურობის მტკიცებულებას მოითხოვს, ის ხელმოწერამდე დაურთეთ:

```python
# Attach the proof before signing so it is covered by the transaction hash.
draft.add_lane_privacy_merkle_proof(
    commitment_id=7,
    leaf=bytes.fromhex("aa" * 32),
    leaf_index=3,
    audit_path=[bytes.fromhex("bb" * 32), bytes.fromhex("cc" * 32)],
    proof_backend="halo2/ipa",
    proof_bytes=b"...proof bytes...",
    verifying_key_name="lane_privacy_vk",
)
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
```

## კითხვები {#queries}

ტიპირებული მოთხოვნის დამხმარეები ბრუნდებიან მონაცემთა კლასებს ნედლი JSON ლექსიკონების მაგივრად. ისინი ყველაზე მარტივი გზაა დასაწყებად, რადგან SDK პარსირებს გვერდოვნება და საერთო ჩანაწერის ველები თქვენთვის:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

გამოიყენეთ ზოგადი მოთხოვნის დამხმარეები, როდესაც Torii API საბოლოო წერტილში ჯერ არ არის დატაიპებული პროგრამული უზრუნველყოფის ადაპტერი:

```python
from urllib.request import Request, urlopen

# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Prometheus exposition is served at `/metrics` when telemetry is `extended`
# or `full`; it is text, not a `/v1` JSON resource.
request = Request(f"{TORII_URL}/metrics", headers={"Accept": "text/plain"})
with urlopen(request, timeout=5) as response:
    metrics = response.read().decode("utf-8")
```

ანგარიშის ინვენტარის დამხმარე პირებს სჭირდებათ SDK ნორმალიზატორის მიერ მიღებული ანგარიშის იდენტიფიკატორი. გამოიყენეთ კანონიკური I105 ანგარიშის ID-ები ან ჯაჭვზე არსებული ალიასები; თუ ბლოკის ექსპლუატორი ან ნედლი API-ის საბოლოო წერტილი იბრუნებს ID- ს, რომელიც SDK უარყოფს, გადაწყვიტეთ იგი კანონიკური ანგარიშის ID- ში, სანამ ამ დამხმარეებს დაურეკავთ:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## მოვლენები {#events}

სტრიმინგის დამხმარეები დეკოდირებენ JSON დატვირთვებს დეფოლუტურად. გადადით `with_metadata=True` როდესაც გჭირდებათ SSE მოვლენის სახელი, იდენტიფიკაცია, განმეორებითი მცდელობა და ნედლი სასარგებლო დატვირთვა. კანონიკური `/v1/events/sse` შეღავათი არის მხოლოდ პირდაპირი: იგი არ გამოდის რეპლეი ID და არ ინახავს რეპლეის ლოგს, ასე რომ ეს დამხმარეები არ გამოყოფენ კურსერს ან განაგრძობენ არგუმენტებს. ხელმეორედ დაკავშირება იწყებს ახალ აბონენტს და შეიძლება ჰქონდეს სივრცე; გამოიყენეთ `/v1/blocks/stream` ცნობილი სიმაღლიდან, როდესაც საჭიროა სრული ბლოკჩეინის რეესტრის ისტორია. ეს მაგალითები ელოდებიან ცოცხალ მოვლენებს, ასე რომ გაუშვით ისინი კვანძზე, სადაც ნაკადი არის ჩართული და აქტიური.

```python
from iroha_python import DataEventFilter, SseStreamError

# Narrow the stream to proof events with the expected backend and proof hash.
proof_filter = DataEventFilter.proof(
    backend="halo2/ipa",
    proof_hash_hex="deadbeef" * 8,
)

try:
    for event in client.stream_events(filter=proof_filter, with_metadata=True):
        print(event.id, event.event, event.data)
        break
except SseStreamError as error:
    print(error.code, error.dropped_messages, error.replay_available)

for event in client.stream_trigger_events(trigger_id="hourly_reward"):
    print(event)
    break

for tx_event in client.stream_pipeline_transactions(status="Queued"):
    print(tx_event)
    break
```

## გასაღები და მისამართები {#keys-and-addresses}

SDK გამოყოფს ადგილობრივ ხელმოწერის დამხმარეებს თითოეული ხელმოწერების ალგორითმისთვის, რომელიც შედგენილია მშობლიურ გაფართოებაში. ეს დამხმარეები არ ურეკებიან Taira, მაგრამ მათ საჭიროებენ მშობლიურ გავრცელებას:

```python
from iroha_python import (
    ED25519_ALGORITHM,
    derive_confidential_keyset_from_hex,
    derive_keypair_from_seed,
    hash_blake2b_32,
    verify,
)
from iroha_python.address import AccountAddress

# Key derivation and signing are local; no network call is made here.
ed_pair = derive_keypair_from_seed(b"alice", ED25519_ALGORITHM)
signature = ed_pair.sign(b"payload")
assert verify(ED25519_ALGORITHM, ed_pair.public_key, b"payload", signature)

# Canonical AccountId/I105 identity is derived only from the controller key.
# This constructor currently requires `domain`; canonical identity ignores it
# and AccountAddress.from_account emits a domainless address.
address = AccountAddress.from_account(domain="wonderland", public_key=ed_pair.public_key)
print(address.canonical_hex())
print(address.to_i105(0x02F1))

# Confidential key helpers derive local viewing/spending material.
confidential = derive_confidential_keyset_from_hex("01" * 32)
print(confidential.as_hex())
print(hash_blake2b_32(b"payload").hex())
```

გამოიყენეთ `supported_crypto_algorithms()` იმისათვის, რომ ნახოთ, თუ რა უჭერს თქვენს ბორბალს მხარს. ზოგადი დამხმარეები იყენებენ კანონიკური ალგორითმის ეტიკეტებს და მუშაობენ Ed25519, secp256k1, ML-DSA, GOST, BLS და SM2, როდესაც ეს ალგორიტმები შედგენილია:

```python
from iroha_python import (
    CryptoKeyPair,
    derive_keypair_from_seed,
    load_keypair,
    parse_private_key_multihash,
    parse_public_key_multihash,
    private_key_multihash,
    public_key_multihash,
    sign,
    supported_crypto_algorithms,
    verify,
)

message = b"iroha multi-algorithm signing"

# Iterate the algorithms compiled into the installed native extension.
for algorithm in supported_crypto_algorithms():
    keypair = derive_keypair_from_seed(f"docs:{algorithm}".encode(), algorithm)
    signature = keypair.sign(message)

    # Both the object method and the generic helper verify the same signature.
    assert keypair.verify(message, signature)
    assert verify(algorithm, keypair.public_key, message, signature)

    # Loading a private key should reconstruct the same public key.
    loaded = load_keypair(keypair.private_key, algorithm)
    assert loaded.public_key == keypair.public_key
    assert sign(algorithm, loaded.private_key, message) != b""

    # Prefixed multihashes carry the algorithm label with the key bytes.
    public_multihash = public_key_multihash(
        algorithm,
        keypair.public_key,
        prefixed=True,
    )
    private_multihash = private_key_multihash(
        algorithm,
        keypair.private_key,
        prefixed=True,
    )

    public_algorithm, public_key = parse_public_key_multihash(public_multihash)
    private_algorithm, private_key = parse_private_key_multihash(private_multihash)
    restored = CryptoKeyPair.from_private_key_multihash(private_multihash)

    # Round-trip checks catch mismatched algorithm labels or key encodings.
    assert public_algorithm == algorithm
    assert public_key == keypair.public_key
    assert private_algorithm == algorithm
    assert private_key == keypair.private_key
    assert restored == keypair
```

### ჩინური SM კრიპტოგრაფია {#chinese-sm-cryptography}

Python SDK გამოყოფს როგორც ზოგად SM2 დამხმარე, ასევე SM2-ის სპეციფიკური კომფორტის დამხმარე. გამოიყენეთ კვანძის შესაძლებლობების რეკლამა, რომ შეარჩიოთ SM2 განასხვავებელი იდენტიფიკატორი, რომელიც ელოდება სამიზნე ქსელს:

```python
from iroha_python import (
    SM2_ALGORITHM,
    SM2_DEFAULT_DISTINGUISHED_ID,
    derive_keypair_from_seed,
    derive_sm2_keypair_from_seed,
    sign,
    sign_sm2,
    verify,
    verify_sm2,
)

capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)
sm = capabilities.crypto.sm if capabilities.crypto else None
# Use the node's default SM2 distinguishing ID when the node advertises one.
distid = sm.sm2_distid_default if sm else SM2_DEFAULT_DISTINGUISHED_ID

# The SM2-specific helper accepts the distinguishing ID explicitly.
pair = derive_sm2_keypair_from_seed(bytes.fromhex("11" * 32), distid=distid)
message = b"iroha-sm2-example"
signature = pair.sign(message)

assert pair.verify(message, signature)
assert verify_sm2(pair.public_key, message, signature, distid=distid)
assert sign_sm2(pair.private_key, message, distid=distid) != b""

# The generic API works when you only need the canonical `sm2` label.
generic_pair = derive_keypair_from_seed(bytes.fromhex("22" * 32), SM2_ALGORITHM)
generic_signature = sign(SM2_ALGORITHM, generic_pair.private_key, message)
assert verify(SM2_ALGORITHM, generic_pair.public_key, message, generic_signature)

print(pair.public_key_sec1_hex)
print(pair.public_key_multihash)
```

`crypto.sm.enabled` გეტყვით, იღებს თუ არა კვანძი SM- ოჯახური ალგორითმები ამჟამინდელი პოლიტიკაში. იგივე რეკლამა მოიცავს SM კრიპტოგრაფიული ჰეშის პოლიტიკა და აჩქარების სტატუსი, რომელიც სასარგებლოა გადაწყვეტილების მიღებისას თუ არა ჩართვა SM2- კონკრეტული ნაკადები:

```python
capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)

# `enabled` is the submit-time policy flag, not just local SDK support.
if capabilities.crypto and capabilities.crypto.sm.enabled:
    sm = capabilities.crypto.sm
    print(sm.default_hash)
    print(sm.allowed_signing)
    print(sm.acceleration.policy)
else:
    print("SM crypto is not enabled by this node")
```

მოახდინეთ დამადასტურებული შესაძლებლობების დატვირთვის განთავსება როგორც ავტორიტეტული განთავსებული კვანძისთვის. არ წარადგინოთ SM2-ზე ხელმოწერილი ტრანზაქცია, თუ `crypto.sm.enabled` არ არის ჭეშმარიტი და რეკლამირებული ხელმოწერის პოლიტიკა ამას აღიარებს

### GOST და პოსტკვანტური გასაღები {#gost-and-post-quantum-keys}

გამოიყენეთ ზოგადი კრიპტო API GOST R 34.10-2012 პარამეტრების ნაკრებისა და ML-DSA (`ml-dsa`) პოსტ-კვანტური ხელმოწერებისათვის. იგივე საკვანძო წყვილის ობიექტი მართავს ხელმოწერას, შემოწმებასა და მრავალფუნქციურ ექსპორტს:

```python
from iroha_python import (
    GOST_3410_2012_256_PARAMSET_A_ALGORITHM,
    GOST_3410_2012_256_PARAMSET_B_ALGORITHM,
    GOST_3410_2012_256_PARAMSET_C_ALGORITHM,
    GOST_3410_2012_512_PARAMSET_A_ALGORITHM,
    GOST_3410_2012_512_PARAMSET_B_ALGORITHM,
    ML_DSA_ALGORITHM,
    derive_keypair_from_seed,
    verify,
)
from iroha_python.address import AccountAddress

CHAIN_DISCRIMINANT = 0x02F1
message = b"iroha gost and post-quantum example"

# Crypto helpers use canonical labels; account addresses use compact aliases.
# Every `domain=` argument below is ignored when the canonical AccountId/I105
# address is encoded.
GOST_ADDRESS_ALIASES = {
    GOST_3410_2012_256_PARAMSET_A_ALGORITHM: "gost-256-a",
    GOST_3410_2012_256_PARAMSET_B_ALGORITHM: "gost-256-b",
    GOST_3410_2012_256_PARAMSET_C_ALGORITHM: "gost-256-c",
    GOST_3410_2012_512_PARAMSET_A_ALGORITHM: "gost-512-a",
    GOST_3410_2012_512_PARAMSET_B_ALGORITHM: "gost-512-b",
}

# Derive and verify one local keypair for every GOST parameter set.
for crypto_algorithm, address_algorithm in GOST_ADDRESS_ALIASES.items():
    keypair = derive_keypair_from_seed(
        f"docs:{crypto_algorithm}".encode(),
        crypto_algorithm,
    )
    signature = keypair.sign(message)

    assert verify(crypto_algorithm, keypair.public_key, message, signature)

    address = AccountAddress.from_account(
        domain="wonderland",
        public_key=keypair.public_key,
        # Account addresses use compact curve aliases for GOST parameter sets.
        algorithm=address_algorithm,
    )
    print(crypto_algorithm)
    print(address.canonical_hex())
    print(address.to_i105(CHAIN_DISCRIMINANT))
    print(keypair.prefixed_public_key_multihash)

# ML-DSA follows the same generic signing and address flow.
mldsa_keypair = derive_keypair_from_seed(b"docs:ml-dsa", ML_DSA_ALGORITHM)
mldsa_signature = mldsa_keypair.sign(message)
assert verify(ML_DSA_ALGORITHM, mldsa_keypair.public_key, message, mldsa_signature)
post_quantum_address = AccountAddress.from_account(
    domain="wonderland",
    public_key=mldsa_keypair.public_key,
    algorithm="ml-dsa",
)
print(post_quantum_address.canonical_hex())
print(post_quantum_address.to_i105(CHAIN_DISCRIMINANT))
print(mldsa_keypair.prefixed_public_key_multihash)
```

კარიბჭე GOST და პოსტ-კვანტური ნაკადები ბმულის ავთენტირებული, ტიპირებული შესაძლებლობების რეკლამაზე:

```python
capabilities = client.get_node_capabilities_typed(
    canonical_auth=canonical_auth,
)
sm = capabilities.crypto.sm if capabilities.crypto else None
# Nodes advertise the signing algorithms they will accept for transactions.
allowed = set(sm.allowed_signing if sm else ())

GOST_ALGORITHMS = {
    "gost3410-2012-256-paramset-a",
    "gost3410-2012-256-paramset-b",
    "gost3410-2012-256-paramset-c",
    "gost3410-2012-512-paramset-a",
    "gost3410-2012-512-paramset-b",
}

# Local support is not enough; submit only when the node advertises support.
supports_gost = bool(allowed & GOST_ALGORITHMS)
supports_post_quantum = "ml-dsa" in allowed
supports_sm2 = "sm2" in allowed and bool(sm and sm.enabled)

print(supports_gost, supports_post_quantum, supports_sm2)
```

თუ კვანძი არ რეკლამირებს საჭირო ალგორითმს, გამოიყენეთ გასაღები მხოლოდ ადგილობრივი ან ოფლაინ სამუშაო პროცესებისთვის. ამ ალგორიტმით ხელმოწერილი ტრანზაქციების წარდგენა ამ კვანძში არ მოხდეს. საჯარო Taira შემოწმების დროს, GOST და ML-DSA ხელმისაწვდომი იყო როგორც SDK კრიპტოგრაფიული დამხმარეები წინსვლის ბიბლიოთეკაში Python, მაგრამ ბმული არ აცხადებდა მათ ტრანზაქციის ხელმოწერის მიზნით.

## კონფიგურაციული მომხმარებლის შექმნა {#config-aware-client-creation}

გამოიყენეთ `resolve_torii_client_config`, როდესაც აპლიკაცია ბმულის პარამეტრებს ფაილიდან კითხულობს, მაგრამ მაინც საჭიროებს გარემოს ან ტესტის სპეციფიკურ გადანაწილებებს:

```python
import json
from iroha_python import create_torii_client, resolve_torii_client_config

with open("iroha_config.json", "r", encoding="utf-8") as handle:
    raw_config = json.load(handle)

# Override only the fields that vary by environment.
resolved = resolve_torii_client_config(
    config=raw_config,
    overrides={"timeout_ms": 2_000, "max_retries": 5},
)

# Pass the resolved config into the same client constructor used elsewhere.
client = create_torii_client(
    raw_config.get("torii", {}).get("address", TORII_URL),
    resolved_config=resolved,
)
```

## კაგემუშას მზადყოფნა {#kagemusha-readiness}

Python SDK შეუძლია შეისწავლოს მიმდინარე JSON მზადყოფნის მარშრუტი თავისი გენერული Torii მოთხოვნის დამხმარე საშუალებით:

```python
ASSET_DEFINITION_ID = "<canonical_asset_definition_id>"

readiness = client.request_json(
    "GET",
    "/v1/offline/readiness",
    params={"asset_definition_id": ASSET_DEFINITION_ID},
    headers={"Accept": "application/json"},
    expected_status=(200,),
)
print(readiness["ready"])
print(readiness["blockers"])
```

Python არ გამოავლინებს ტიპირებული Kagemusha დამატების ან გადახდის არქივის შემქმნელებს. გამოიყენეთ Swift ან JVM საფულე, რათა შექმნათ კანონიკური V4 არქივი, შემდეგ წარადგინეთ და გამოკითხეთ ისინი მხარდაჭერილი Kagemusha Torii კლიენტის საშუალებით.

## აბონენტები {#subscriptions}

`iroha_python.ToriiClient` მიერ გამოყენებული საერთო Torii კლიენტისგან მიიღება აბონენტთა წაკითხვა და პროექტების მშენებლობა. თითოეული მუტაცია მიღებულია სხეულის კანონიკური ანგარიშის ხელმოწერა და უხელმოწერილი ტრანზაქციის პროექტის დაბრუნება. Torii არასდროს იღებს კერძო გასაღების და არ წარადგენს პროექტს თქვენთვის.

```python
# The plan defines billing cadence, retry policy, and usage pricing.
usage_plan = {
    "provider": alice,
    "billing": {
        "cadence": {
            "kind": "monthly_calendar",
            "detail": {"anchor_day": 1, "anchor_time_ms": 0},
        },
        "bill_for": {"period": "previous_period", "value": None},
        "retry_backoff_ms": 86_400_000,
        "max_failures": 3,
        "grace_ms": 604_800_000,
    },
    "pricing": {
        "kind": "usage",
        "detail": {
            "unit_price": "0.024",
            "unit_key": "compute_ms",
            "asset_definition": "usd#wonderland",
        },
    },
}

# The provider authorizes preparation of a plan-registration draft.
plan_draft = client.create_subscription_plan(
    authority=alice,
    plan_id="compute#wonderland",
    plan=usage_plan,
    canonical_auth=canonical_auth,
)

bob_canonical_auth = ToriiCanonicalRequestAuth(
    network_id=TAIRA_NETWORK_ID.literal,
    account_id=bob,
    signer=bob_pair.sign,
)

# The subscriber authorizes preparation of a subscription-creation draft.
subscription_draft = client.create_subscription(
    authority=bob,
    subscription_id="sub-001",
    plan_id="compute#wonderland",
    canonical_auth=bob_canonical_auth,
)

# Usage and charge-now operations also return unsigned transaction drafts.
usage_draft = client.record_subscription_usage(
    "sub-001",
    authority=alice,
    unit_key="compute_ms",
    delta="3600000",
    canonical_auth=canonical_auth,
)
charge_draft = client.charge_subscription_now(
    "sub-001",
    authority=alice,
    canonical_auth=canonical_auth,
)

for draft in (plan_draft, subscription_draft, usage_draft, charge_draft):
    assert draft.submitted is False
    print(draft.transaction_payload_b64, draft.signing_message_b64)
```

მიეცით თითოეული ზუსტი დატვირთვისა და ხელმოწერის შეტყობინება შესაბამის ანგარიშის ადგილობრივ საფულეზე, შემოწმეთ იქ მოთხოვნილი ოპერაცია, შეადგინეთ ხელმოწერილი ტრანზაქცია და წარუდგინეთ იგი ჩვეულებრივი ტრანზაკციის დამუშავების კონვეიერის საშუალებით. Python SDK ადასტურებს, რომ ხელმოწერის შეტყობინება არის დაბრუნებული დატვირთვის კანონიკური კრიპტოგრაფიული ჰეში, მაგრამ საფულე კვლავ პასუხისმგებელია ტრანზაქციის დეკოდირებისა და ხელმოწერამდე დამტკიცებისათვის.

## გაერთიანება {#connect}

შექმენით და შეისწავლეთ Connect URIs ადგილობრივად. Connect- ის იდენტობა აკავშირებს SID ზუსტად `NetworkId`, აპლიკაციის საჯარო გასაღები და კრიპტოგრაფიული ნონსი მნიშვნელობას:

```python
from iroha_python.connect import create_connect_session_preview, parse_connect_uri

# Generate consistent SID, key, nonce, and URI values as one bundle.
preview = create_connect_session_preview(
    network_id=TAIRA_NETWORK_ID,
    node="taira.sora.org",
)
parsed = parse_connect_uri(preview.wallet_uri)

assert parsed.sid == preview.sid_base64url
assert parsed.network_id.literal == TAIRA_NETWORK_ID.literal
assert parsed.app_public_key == preview.app_key_pair.public_key
```

რეგისტრირება ზუსტი წინასწარი ნახვა მხოლოდ მაშინ, როდესაც სამიზნე კვანძი გამოყოფს Connect. სესიის შექმნა უბრუნებს ოთხი როლი-სპეციფიკური მატარებელი ტოქენები. ყოველ სესიის სტატუსის მარშრუტი მოითხოვს მართვის ტოქენი; შეკრებილი სტატუსი არის ოპერატორის მარშრუტი.

```python
from iroha_python import (
    ConnectControlClose,
    ConnectControlOpen,
    ConnectDirection,
    ConnectFrame,
    ConnectPermissions,
    bootstrap_connect_preview_session,
    decode_connect_frame,
    encode_connect_frame,
)

bootstrap = bootstrap_connect_preview_session(
    client,
    network_id=TAIRA_NETWORK_ID,
    node="taira.sora.org",
)
info = bootstrap.session
tokens = bootstrap.tokens
assert info is not None and tokens is not None

session_status = client.request_json(
    "GET",
    "/v1/connect/status",
    params={"sid": info.sid},
    headers={"Authorization": f"Bearer {tokens.management}"},
    expected_status=(200,),
)
print(info.app_uri, session_status)

# Control frames negotiate permissions before encrypted messages are sent.
frame = ConnectFrame(
    sid=bootstrap.preview.sid_bytes,
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=1,
    control=ConnectControlOpen(
        app_public_key=bootstrap.preview.app_key_pair.public_key,
        network_id=TAIRA_NETWORK_ID,
        permissions=ConnectPermissions(methods=["SIGN_REQUEST_TX"], events=[]),
    ),
)
payload = encode_connect_frame(frame)
assert decode_connect_frame(payload) == frame

# Closing the control channel is explicit and also travels as a frame.
close_frame = ConnectFrame(
    sid=bootstrap.preview.sid_bytes,
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=2,
    control=ConnectControlClose(
        role="App", code=4100, reason="finished", retryable=False
    ),
)
close_payload = encode_connect_frame(close_frame)
```

დაშიფრეთ შეტყობინებები დამტკიცების შემდეგ სტატისტირებული სესიით:

```python
from iroha_python import (
    ConnectDirection,
    ConnectSession,
    ConnectSessionKeys,
    ConnectSignRequestRawPayload,
)

# Derive symmetric session keys from both parties' keys and the session ID.
keys = ConnectSessionKeys.derive(
    local_private_key=bytes.fromhex("11" * 32),
    peer_public_key=bytes.fromhex("22" * 32),
    sid=bytes.fromhex("33" * 32),
)
session = ConnectSession(
    sid=bytes.fromhex("33" * 32),
    keys=keys,
)
# Encrypt application payloads after the session is approved.
encrypted = session.encrypt_app_to_wallet(
    ConnectSignRequestRawPayload(domain_tag="SIGN", payload=b"hash")
)
state = session.snapshot_state().to_dict()
print(encrypted.sequence, state)
```

## მმართველობა, შესრულების გარემო და ადმინის ზედაპირები {#governance-runtime-and-admin-surfaces}

მმართველობის წაკითხვა არის ანგარიშის ავთენტიფიცირება. [საერთო განლაგება](#shared-setup)-დან ავტორიზაციის ძირითადი და საკვანძო წყვილი გამოყენებით, თითოეული დამხმარე ზარი დაუკავშირდით Taira-ს ზუსტ გენეზისგან გამომდინარე `NetworkId`:

```python
# Governance reads return either current settings or typed not-found wrappers.
protected = client.get_protected_namespaces(canonical_auth=canonical_auth)
referendum = client.get_governance_referendum_typed(
    "ref-1", canonical_auth=canonical_auth
)
tally = client.get_governance_tally_typed("ref-1", canonical_auth=canonical_auth)
locks = client.get_governance_locks_typed("ref-1", canonical_auth=canonical_auth)
unlock_stats = client.get_governance_unlock_stats_typed(
    canonical_auth=canonical_auth
)

print(protected, referendum.found)
print(tally.approve, list(locks.locks), unlock_stats.expired_locks_now)

# Account-authenticated runtime reads use the same canonical request proof.
abi = client.get_runtime_abi_active_typed(canonical_auth=canonical_auth)
# The ABI hash itself is a public read.
abi_hash = client.get_runtime_abi_hash_typed()
runtime_metrics = client.get_runtime_metrics_typed(canonical_auth=canonical_auth)
capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)

print(abi, abi_hash, runtime_metrics)
print(capabilities.abi_version)
```

შეიქმნას ცალკე კლიენტი ოპერატორის წაკითხვისთვის. დატვირთეთ ნებადართული ჩამოთვლილი ოპერატორების გასაღები შესრულების გარემოში და დაუკავშირდით მას Taira ზუსტად `NetworkId`; მფლობელის ნიშნები და `x-api-token` არ შეცვლის ამ ხელმოწერას:

```python
import os

from iroha_python import Ed25519KeyPair, NetworkId, OperatorSigningContext

operator_pair = Ed25519KeyPair.from_private_key(
    bytes.fromhex(os.environ["IROHA_OPERATOR_PRIVATE_KEY_HEX"])
)
operator_client = create_torii_client(
    TORII_URL,
    operator_signing_context=OperatorSigningContext(
        TAIRA_NETWORK_ID,
        operator_pair,
    ),
)
```

განახლების მარშრუტები ოპერატორის მიერ ავტორიზებული ინსტრუქციების შემქმნელია. წარმატებული წინადადება, გააქტიურება ან გაუქმება პასუხის დაბრუნება `tx_instructions`; ეს არ ახორციელებს განახლებას. წარუდგინეთ ეს ბუნდელი ჩვეულებრივი ხელმოწერილი ტრანზაქციის და მმართველობის გზაზე. ამჟამად ჩასმული Python მეთოდები `propose_runtime_upgrade`, `activate_runtime_upgrade` და `cancel_runtime_upgrade` კლიენტის `OperatorSigningContext` გამოყენების ნაცვლად უბრალო მოთხოვნებს აძლევენ. ამიტომ ეს სახელმძღვანელო მათ სამუშაო ოპერატორის ნაკადად არ წარმოადგენს.

## სტატუსი, კონსენსუსი და ქსელის ტელემეტრია {#status-consensus-and-network-telemetry}

```python
# `/status` is the public node snapshot endpoint on Taira.
status = client.request_json("GET", "/status", expected_status=(200,))
print(status["blocks"], status["txs_approved"])

# Sumeragi and time-status endpoints use the operator client configured above.
sumeragi = operator_client.get_sumeragi_status_typed()
diagnostics = operator_client.get_sumeragi_diagnostics_typed()
print(sumeragi.last_committed_height, diagnostics.tx_queue_saturated)

time_now = client.get_time_now()
time_status = operator_client.get_time_status()
for sample in time_status.samples:
    print(sample.peer, sample.last_offset_ms, sample.last_rtt_ms)
print(time_now.now_ms)

# Connect aggregate status is operator-authenticated. Individual sessions use
# `/v1/connect/status?sid=...` with their management bearer token instead.
connect_status = operator_client.get_connect_status_typed()
if connect_status is not None:
    print(connect_status.enabled, connect_status.sessions_active)
```

## SoraFS, UAID და Kaigi დამხმარეები {#sorafs-uaid-and-kaigi-helpers}

ეს დამხმარეები ხელმისაწვდომია მაშინ, როდესაც სამიზნე კვანძში გამოჩნდება შესაბამისი Nexus/SORA API საბოლოო წერტილები. ცარიელი სიები განიხილეთ როგორც ვალიდური პასუხი: საჯარო Taira-ს შეიძლება ჰქონდეს მარშრუტი ჩართული ნიმუშის ტექნიკური მანიფესტის ან UAID მონაცემების გარეშე.

```python
# SoraFS status queries are reads scoped by manifest and status.
por_status = client.get_sorafs_por_status(manifest_hex="ab" * 32, status="verified")
print(len(por_status))

# UAID helpers inspect wallet/data-space bindings for one identifier.
uaid = "aabb" * 16
bindings = client.get_uaid_bindings_typed(uaid)
manifests = client.list_space_directory_manifests_typed(
    uaid,
    dataspace=11,
    status="active",
)
print(len(bindings.dataspaces), len(manifests.manifests))

# Kaigi relay health is an operator snapshot, even though it is read-only.
health = operator_client.get_kaigi_relays_health_typed()
print(health.healthy_total, health.failovers_total)
```

## Norito RPC და GPU დამხმარეები {#norito-rpc-and-gpu-helpers}

გამოიყენეთ `NoritoRpcClient` მაშინ, როდესაც თქვენ უკვე გაქვთ Norito ბაიტები და უნდა გამოიძახოთ ბინარული Torii API საბოლოო წერტილი. მაგალითისთვის საჭიროა წინა ტრანზაქციის შაბლონიდან ხელმოწერილი მონაცემთა კონტეინერი:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call(
        "/v1/pipeline/transactions",
        envelope.signed_transaction_versioned,
    )
    print(len(response_bytes))
```

CUDA დამხმარეები დაბრუნებენ `None`, როდესაც ბეკენდი არ არის ხელმისაწვდომი, ასე რომ აპლიკაციები შეიძლება დაბრუნდეს სკალარული დანერგვის:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## ამჟამინდელი მოცულობა {#current-coverage}

Python SDK უკვე შეიცავს დამხმარე პირებს:

- Torii წარდგენა, სტატუსი, მოთხოვნა და ადმინისტრირების ნაკადები
- საერთო ISI და დომენის სპეციფიკური გაფართოებების ტიპირებული ინსტრუქციის შემქმნელები
- გარიგების პროექტები, ტექნიკური მანიფესტები, ხელმოწერა და ხელმოწერილი გარიგებების მონაცემების კონტეინერის სამუშაო პროცესები
- ცოცხალი მოვლენების ნაკადები და ტიპირებული ფილტრები; საბოლოო ბლოკის ნაკადები უზრუნველყოფენ სრულ ისტორიას
- გენერული Kagemusha მზადყოფნის წვდომა და Torii აბონენტების დამხმარეები; ტაიპირებული დამატება და გამოსასყიდი მშენებლები არ არიან გამოცხადებულნი
- ანგარიშის მისამართი, ყველა ალგორითმის ხელმოწერის დამხმარეები, მრავალფუნქციური ბრუნვა-ბრუნვა, SM2, GOST, ML-DSA და BLS და კონფიდენციალური გასაღების მართვა
- გაერთიანება URIs, სესიები, ჩარჩოები, დაშიფვრის დამხმარეები და რეესტრი ადმინისტრატორი.
- მმართველობა, შესრულების გარემოს განახლება, Sumeragi, კვანძი-admin, SoraFS, UAID და Kaigi API საბოლოო წერტილების პროგრამული ადაპტერები, სადაც კვანძი ამ მახასიათებლებს ასახავს.

## წინსავალი რეფერენციები {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

ეს ფაილები არის სიმართლის წყარო Python ზედაპირში დამაგრებული სამუშაო სივრცე რევიზიის.
