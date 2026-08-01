---
translation_locale: hy
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

Upstream աշխատանքային տարածքում Python SDK է `iroha-python`: Առաջին Iroha 3 թողարկումը ուղղված է ընթացիկ Torii եւ Norito մակերեւույթներին: Պին փաթեթի տարբերակը կամ աղբյուրի վերանայման, որը օգտագործվում է ձեր ինտեգրման համար, այնպես որ SDK եւ հանգույցը մնում են նույն կավառ ձեւաչափով վերանայման վրա:

Ստորեւ ներկայացված միայն ընթերցվող օրինակները ստուգվել են հանրային Taira հասցեով՝ `https://taira.sora.org`։ Մուտացիոն օրինակներն են գործարքի ձեւանմուշներ. դրանք պահանջում են իրական Taira իշխանություն, մասնավոր բանալին, գազի մետադատա եւ ցանկացած օպերատորի տոքեր, որոնք պահանջվում են նպատակային երթուղու կողմից, նախքան դրանք կարող են ուղարկվել:

Օգտագործեք օրինակները հետեւյալ կարգով.

|Դասարան |Հարձակվել հանրային Taira? |Այն, ինչ ձեզ անհրաժեշտ է|
| --- | --- | --- |
|Միայն ընթերցող հաճախորդների զանգեր |Այո։|Python փաթեթ եւ ցանցային մուտք |
|Տեղական ստորագրման եւ հրահանգների կառուցողներ |Ոչ մի ցանցային զանգ մինչեւ `submit()` |Բնական ընդլայնում եւ ձեր հիմնական նյութը |
|Մուտացիոն գործարքներ եւ ծառայությունների զանգեր |Միայն ձեր սեփական ֆինանսավորված հաշիվով|Հանձնաժողովի հաշիվը, մասնավոր բանալին, շղթան ID, վճարային մետադատները, վճարային ակտիվների հավասարակշռությունը եւ երթեւեկության տոքերները |
|Կապակցեք շրջանակային կոդեկներ, կրիպտո եւ GPU օգնականների |Միայն տեղական |Բնակչական ընդլայնում. GPU օգնականները նույնպես պետք է ունենան CUDA- ի կարողություն backend |

## Բեռնել {#install}

Փաթեթի մետադատային անվանումը `iroha-python` է: Մի ենթադրեք, որ չկորցված PyPI տեղադրումը համապատասխանում է կենդանի Taira ցանցին: Կառուցեք հեծանիվ կամ աղբյուրի ստուգման համակարգ, որը կառուցվել է նույն վերածննդային վերանայման միջոցով ՝ ձեր ինտեգրման նպատակները.

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Եթե ձեր նախագիծը ուղղակիորեն սպառում է վերածննդային աշխատանքային տարածքը, տեղադրեք Python կախվածությունները եւ կառուցեք բնական ընդլայնումը նախքան գործարկելը օրինակներ, որոնք օգտագործում են `Instruction`, `TransactionDraft`, ստորագրություն, կրիպտո, SoraFS բնական օգնականները, GPU օգնականները կամ Connect շրջանակային կոդեկները: Օգտագործեք build հրամանը վերեւից `python/iroha_python/README.md`, այնուհետեւ ստուգեք, որ տեղական արտահանման բեռը:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Եթե `create_torii_client` ներմուծումը ձախողվում է, բայց `Instruction` կամ `generate_ed25519_keypair` չի կատարվում, ապա մատչելի է մաքուր Python փաթեթը, սակայն ներքին ընդլայնումը չի:

## Արագ սկիզբ {#quickstart}

Սկսեք հանրային, միայն ընթերցման համար նախատեսված Taira վերջային կետերից.

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

## Համագործակցված կարգավորումը {#shared-setup}

Օգտագործեք այս կարգավորումը մուտացիոն ձեւանմուշների համար: Նախքան ուղարկելը փոխարինեք յուրաքանչյուր տեղապահը ձեր տեղադրումից Taira իշխանությամբ, մասնավոր բանալով, տոքերով եւ ակտիվ / հաշիվով IDs:

`authority` հաշիվն է, որը ստորագրում է գործարքը: `private_key`-ը պետք է համապատասխանի այդ հաշիվին, `CHAIN_ID`-ը՝ թիրախային ցանցին, եւ `TX_METADATA`-ը պետք է՝ ներառի ցանցի կողմից սպասվող վճարային դաշտերը: Ստորեւ բերված տեղակալները դիտավորյալ անվավեր են, ուստի դրանք չեն ներկայացվում պատահականությամբ:

```python
from iroha_python import (
    Ed25519KeyPair,
    Instruction,
    TransactionConfig,
    TransactionDraft,
    create_torii_client,
)

TORII_URL = "https://taira.sora.org"
CHAIN_ID = "fc56984b-2be7-431d-840e-21514d1883f0"
AUTH_TOKEN = None

# Replace these placeholders with the real signing keys for your accounts.
alice_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<alice-private-key-hex>"))
bob_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<bob-private-key-hex>"))

# The authority string must identify the same account as the private key.
alice = "<alice-account-id>"
bob = "<bob-account-id>"

ROSE_DEFINITION = "rose#wonderland"
ROSE_ASSET = "<rose-asset-id>"
BADGE_NFT = "badge$wonderland"

TX_METADATA = {
    # Public Taira fee asset. Use the configured XOR asset on your network.
    "gas_asset_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
}

client = create_torii_client(TORII_URL, auth_token=AUTH_TOKEN)


def submit(*instructions):
    # This is the network boundary: build, sign, submit, and wait for status.
    return client.build_and_submit_transaction(
        chain_id=CHAIN_ID,
        authority=alice,
        private_key=alice_pair.private_key,
        instructions=list(instructions),
        metadata=TX_METADATA,
        wait=True,
    )
```

`Instruction.*` կանչում է միայն կառուցման հրահանգների օգտակար բեռնվածքները: `submit()` այն կետն է, որտեղ SDK-ը ստորագրում է գործարքը, ուղարկում է այն Torii-ին եւ սպասում է կարգավիճակին:

## Հաշվարկներ եւ գազ {#fees-and-gas}

Գրիր գործարքները պահանջում են վճարային մետադատա եւ ֆինանսավորվող վճարային ակտիվի հավասարակշռություն: Taira-ին, վճարային ակտիվը ֆինանսավորվում է հանրային գազանի կողմից, եւ գործարքի մեթադատաները պետք է ներառեն `gas_asset_id`։ Minamoto- ում, վճարները վճարվում են իրական XOR-ով, եւ ակտիվը ID գալիս է այդ ցանցի կազմաձեւման միջոցով:

Վճարման մետադատները պատկանում են գործարքին, այլ ոչ թե առանձին հրահանգներին: Վերոնշյալ `submit()` օգնականը կցում է `TX_METADATA` յուրաքանչյուր գործարքի վրա, որը այն կառուցում է՝

```python
TX_METADATA = {
    # Taira expects the fee asset definition in transaction metadata.
    "gas_asset_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
}

envelope, status = client.build_and_submit_transaction(
    chain_id=CHAIN_ID,
    authority=alice,
    private_key=alice_pair.private_key,
    # Fee metadata is attached to the transaction, not the instruction.
    instructions=[
        Instruction.set_account_key_value(
            alice,
            "python_fee_example",
            "ready",
        )
    ],
    metadata=TX_METADATA,
    wait=True,
)
```

Նախքան գրառումներ ուղարկելը, համոզվեք, որ իշխանության հաշիվը պատկանում է վճարային ակտիվի բավարար քանակին: Ճշգրիտ գետնե եւ ակտիվ ID ցանցային հատուկ են. սա Taira ձեւն է.

```python
FEE_ASSET_DEFINITION = "6TEAJqbb8oEPmLncoNiMRbLEK6tw"
# The faucet returns the concrete account asset ID to check here.
FEE_ASSET_ID = "<fee-asset-id-from-faucet-response>"
TX_METADATA = {"gas_asset_id": FEE_ASSET_DEFINITION}

# Fail before submitting if the signer cannot pay gas.
fee_assets = client.list_account_assets_typed(
    alice,
    limit=10,
    asset_id=FEE_ASSET_ID,
)
if not fee_assets.items:
    raise RuntimeError("fund the authority account with the Taira fee asset first")
```

Հոսքը վերադարձնում է բետոնային `asset_id`, որը պետք է օգտագործվի հավասարակշռության ստուգման համար: `gas_asset_id` մետադատա դաշտում օգտագործվում է վճարային ակտիվի սահմանումը ID.

Պահպանեք դիմման մետադատները վճարային մետադատայից առանձին ՝ միավորելով քարտեզագրությունները, երբ ստեղծում եք գործարք.

```python
APP_METADATA = {"source": "python-docs"}
# Merge app metadata with required fee metadata before building the draft.
metadata = {**TX_METADATA, **APP_METADATA}

draft = TransactionDraft(
    TransactionConfig(
        chain_id=CHAIN_ID,
        authority=alice,
        metadata=metadata,
    )
)
```

Եթե դուք բաց թողնում եք վճարային մետադատները, օգտագործում եք սխալ վճարային ակտիվը կամ ստորագրում եք առանց ֆինանսավորման հաշիվով, իսկական ցանցը պետք է մերժի գործարքը, նույնիսկ եթե հրահանգների օգտակար բեռնվածությունը այլ կերպ վավեր է:

## Taira-Վերահսկված միայն ընթերցման համար զանգեր {#taira-checked-read-only-calls}

Այս զանգերը հաջողությամբ վերադարձվել են Taira հանրության դեմ.

```python
client = create_torii_client("https://taira.sora.org")

# Use raw requests for endpoints that do not need a typed wrapper.
status = client.request_json("GET", "/status", expected_status=(200,))
parameters = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Typed helpers parse pagination and records into dataclasses.
accounts = client.list_accounts_typed(limit=1)
domains = client.list_domains_typed(limit=1)
definitions = client.query_asset_definitions_typed(limit=1)

# These calls inspect live node subsystems without mutating state.
time_now = client.get_time_now_typed()
time_status = client.get_time_status_typed()
sumeragi = client.get_sumeragi_status_typed()
connect = client.get_connect_status_typed()

print(status["build"]["version"])
print(parameters["sumeragi"]["block_time_ms"])
print(accounts.total, domains.total, definitions.total)
print(time_now.now_ms, len(time_status.samples), sumeragi.leader_index)
print(connect.enabled, connect.sessions_active)
```

Փորձարկման ընթացքում երթուղիներ, ինչպիսիք են `/v1/status`, հանրային զուգընկերների ինվենտարիա, Sumeragi RBC նմուշագրում, բջիջի ադմինիստրատորի ակնհայտ լուսանկարներ եւ Connect հավելվածի գրանցամատյաների կառավարումը հրապարակայնորեն հասանելի չէին Taira: Օգտագործեք `request_json("GET", "/status")` ՝ հանրային բջիակի կարգավիճակի օգտակար ծանրաբեռնման համար Taira:

## Ուսուցում շինարարների {#instruction-builders}

SDK-ը բացահայտում է ամենատարածված հրահանգների ընտանիքների համար տիպավորված շինարարները եւ JSON փախուստի խցիկը տարբերակների համար, որոնք դեռեւս առաջին դասի Python մեթոդներ չեն: Հետեւյալ հատվածները փոխակերպվող գործարքային ձեւանմուշներ են եւ չեն ներկայացվել հանրությանը Taira ՝ առանց ստորագրման հաշիվ.

Նախընտրում են մուտքագրված օգնականներ, երբ դրանք գոյություն ունեն. նրանք կարգավորում են Python արժեքները եւ վաղ ձախողվում են անվավեր ձեւերի վրա: Օգտագործեք `Instruction.from_json` միայն այն ժամանակ, երբ ձեզ անհրաժեշտ է հրահանգների տարբերակ, որը դեռ չունի Python օգնական։

|Ուսումնական ընտանիք |Python մակերեսը |
| --- | --- |
|Գրանցվեք| `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` պահվում է genesis/bootstrap գործիքների համար |
|Գրանցվելը չեղարկել|`unregister_trigger`; օգտագործեք `Instruction.from_json` այլ տարբերակների համար |
|Mint/Burn |`mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
|Փոխանցում|`transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|Մետադատա եւ վերահսկողություն |`set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
|RWA կյանքի ցիկլ |`merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
|ExecuteTrigger |`execute_trigger` |
|Վերահաստատման/հասարակության ընդլայնումներ |`repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|Բնական ակտիվների կողպեքներ |`open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, գումարած հաճախորդի օգնականների `*_and_wait` |
|Grant/Revoque, SetParameter, Log, Custom, Upgrade եւ ավելի քիչ տարածված գրանցման / չեղարկման տարբերակները |`Instruction.from_json` կամ `TransactionBuilder.add_instruction_json` քանոնիկ `InstructionBox` JSON |

Հաշվարկային ձեւով պայմանավորված վճարումների համար տես [Native Asset Escrow](/hy/blockchain/escrow.md#python-asset-locks). Python ներկայումս բացահայտում է առաջին դասի օգնականներ գեներիկ ակտիվների փակման համար. շուկայական եւ անանուն երաշխիքային օգնականները դեռեւս չեն առաջին դասի Python մեթոդներ:

### Ստեղծեք դոմեյններ, ապա գրանցեք հաշիվներ եւ ակտիվներ {#set-up-domains-then-register-accounts-and-assets}

Սովորական տիրույթի ստեղծումը անցնում է հայտարարական alias պլանավորիչի միջոցով, այնպես որ SNS վարձակալության պայմանագիրը, սեփականատերերի հնարավորությունները, գծագրային պահպանումը եւ տիրույթի վիճակը միասին ստուգվում են: Ստեղծեք գաղտնի ազատ `AliasSetupPlanRequestV1` մտադրություն ձեր SDK կամ ներբորդման ծառայությամբ, այնուհետեւ օգտագործեք `iroha app alias setup plan` եւ `iroha app alias setup apply`. Մի ներկայացրեք `Instruction.register_domain` հավելվածի գործարքից, այն կառուցողը մնում է genesis/bootstrap գործիքների համար:

Դոմենի ստեղծման պլանը պարտավորվելուց հետո գրանցեք դոմենի սեփականության օբյեկտներ: Համագործակցված ցանցում, ինչպիսիք են Taira, օգտագործեք ձեզ տրված դոմենի եւ հաշիվի անվան տարածք:

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

`mintable` ընդունում է `Infinitely`, `Once`, `Not`, կամ `Limited(n)` տվյալների մոդելի կողմից ընդունված արժեքները: `scale` սահմանափակված թվային ակտիվի համար:

### Մինետի, այրելու եւ փոխանցման ակտիվներ {#mint-burn-and-transfer-assets}

Այս զանգերը օգտագործում են գոյություն ունեցող ակտիվ ID: Նախ գրանցեք ակտիվի սահմանումը, ապա կառուցեք կոնկրետ ակտիվը ID այն հաշիվի համար, որը սեփականատեր է ակտիվի:

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Տրանսֆերային սեփականություն {#transfer-ownership}

Տիրապետության փոխանցում փոփոխություն, ով վերահսկում է տիրույթը, ակտիվի սահմանումը կամ NFT. Օգտագործեք ներկայիս սեփականատերը որպես գործարքի իշխանությունը:

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Ստեղծել եւ հեռացնել մետադատա {#set-and-remove-metadata}

Մետադատային արժեքները պետք է լինեն JSON-սերիալացվող: Երբ դուք օգտագործում եք `TransactionDraft`, `TransactionConfig`-ի իշխանությունը դառնում է կանխատեսված նպատակային հաշիվը:

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

Բարձր մակարդակի նախագծային օգնականն ի սկզբանե ուղղված է գործարքի իշխանությանը.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### Իրական աշխարհի ակտիվներ {#real-world-assets}

RWA օգնականները օգտագործում են JSON- ի շարականացվող օգտակար բեռներ ակտիվի հատուկ մետադատների, ծագման եւ վերահսկիչի քաղաքականության համար: `register_rwa` չի ընդունում `id` կամ `owner`: Runtime- ը ստեղծում է `RwaId`, եւ գործարքի իշխանությունը դառնում է սկզբնական սեփականատեր:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
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

Գրանցման գործարքի պարտավորություններից հետո օգտագործեք `FindRwas`, `/v1/rwas`, RWA իրադարձություն կամ ստեղծված ID որոնիչի երթուղին՝ հայտնաբերելու համար:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Հետագա գործողություններում օգտագործվում է ստեղծված `hash$domain` ID:

```python
registered_rwa_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
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

Ամբողջական փոխանցումները կարող են փոփոխվել `owned_by` առկա խմբաքանակի վրա: Կուսակցական փոխանցումներ եւ միավորումներ ստեղծում են ծնված երեխաների խմբաքանակներ:

### Գործարկիչներ {#triggers}

Օգտագործել trigger գրանցման օգնականները, երբ գործադրելի է այլ հրահանգների հաջորդականություն:

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

Torii նաեւ բաց է թողնում REST օգնականները սթրիկատորային ինվենտարի համար.

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Գործադրիչների ցուցակային զանգերը միայն կարդում են կամ ստուգում են գործադրիչի ձայնագրությունները: գրանցումը, կատարումը, կրկնվող փոփոխությունները եւ չմուտացումը մուտացիոն գործողություններ են:

### Հաշվարկի եւ կարգավորման հրահանգներ {#repo-and-settlement-instructions}

Repo- ի եւ երկկողմ կարգավորման օգնականները լրացնում են դոմեյնային հատուկ հրահանգների տարբերակներ առանց ձեռքով պատրաստված Norito օգտակար բեռերի.

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
    chain_id=CHAIN_ID,
    authority=alice,
    # Keep repo and settlement examples bounded by a short TTL.
    ttl_ms=120_000,
    metadata=TX_METADATA,
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
draft.repo_unwind(
    agreement_id="daily_repo",
    initiator=alice,
    counterparty=bob,
    cash_leg=cash,
    collateral_leg=collateral,
    settlement_timestamp_ms=1_704_086_400_000,
)

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

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### JSON Escape Hatch {#json-escape-hatch}

Երբ Python օգնական դեռեւս հասանելի չէ, պարունակում է կանոնական տվյալների մոդել `InstructionBox` JSON մեջ `Instruction.from_json` կամ ուղղակիորեն `TransactionBuilder.add_instruction_json`. Սա խորհուրդ է տրվում `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, զուգընկեր / դեր /NFT գրանցում, եւ ոչ-թրիգերային չներկայացնող տարբերակները մինչեւ այդ օգնականները մուտքագրված են:

```python
from iroha_python import Instruction, TransactionBuilder

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

# Use TransactionBuilder when you need lower-level control than TransactionDraft.
builder = TransactionBuilder(CHAIN_ID, alice)
builder.set_metadata(TX_METADATA)
builder.add_instruction_json(instruction_box_json)
envelope = builder.sign(alice_pair.private_key)
client.submit_transaction_envelope_and_wait(envelope)
```

Ստեղծված կամ ոչ թափանցիկ հրահանգների համար, նախքան սարքավորումների պահեստավորմանը JSON անցնել եւ վերադառնալ:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Գործարքների աշխատանքային հոսքերը {#transaction-workflows}

Օգտագործեք `TransactionDraft` ծրագրերի համար, որոնք ստորագրելուց առաջ կառուցում են բազմաթիվ հրահանգներ: Նախագիծը թույլ է տալիս պահել գործարքի մակարդակի կարգավորումները, ինչպիսիք են `ttl_ms`, `nonce` եւ մետադատները մեկ տեղում, ապա մի անգամ ստորագրել.

```python
config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    # TTL and nonce are transaction-level properties shared by all instructions.
    ttl_ms=120_000,
    nonce=1,
    metadata={**TX_METADATA, "source": "python-docs"},
)

draft = TransactionDraft(config)
# Draft methods append instructions but do not submit anything yet. Domain
# setup is a separate alias-planner flow and has already committed here.
draft.register_account(bob, metadata={"role": "user"})
draft.register_asset_definition_numeric(
    ROSE_DEFINITION,
    owner=alice,
    scale=2,
    mintable="Infinitely",
)
draft.mint_asset_numeric(ROSE_ASSET, "100")
draft.transfer_asset_numeric(ROSE_ASSET, "25", destination=bob)

# Signing freezes the draft into an envelope ready for Torii.
envelope = draft.sign_with_keypair(alice_pair)
receipt = client.submit_transaction_envelope(envelope)
status = client.wait_for_transaction_status(envelope.hash_hex(), timeout=30)
print(receipt, status)
```

Արտահանել ստուգման, աուդիտների կամ դրամապանակի փոխանցման համար որոշողական մանիֆես:

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

Նախքան ստորագրումը միացրեք երթուղու գաղտնիության ապացույցը, երբ նպատակային երթուղին պահանջում է դա.

```python
# Attach the proof before signing so it is covered by the transaction hash.
draft.add_lane_privacy_merkle_proof(
    commitment_id=7,
    leaf=bytes.fromhex("aa" * 32),
    leaf_index=3,
    audit_path=[bytes.fromhex("bb" * 32), None, bytes.fromhex("cc" * 32)],
    proof_backend="halo2/ipa",
    proof_bytes=b"...proof bytes...",
    verifying_key_bytes=b"...verifying key bytes...",
)
envelope = draft.sign_with_keypair(alice_pair)
```

## Հարցեր {#queries}

Տիպված հարցման օգնականները վերադարձնում են տվյալների դասերը, այլ ոչ թե خام JSON բառարաններ: Նրանք ամենահեշտ միջոցն են սկսելու համար, քանի որ SDK-ը պարզում է էջավորումը եւ սովորական գրառումների դաշտերը ձեզ համար.

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Օգտագործեք ընդհանուր խնդրանքային օգնականները, եթե Torii վերջային կետում դեռեւս չկա տիպված փաթեթ:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

Հաշվեի առանձնակատարները պահանջում են հաշիվի նույնականացողը, որը ընդունվում է SDK նորմալացնողի կողմից: Օգտագործեք կանոնիկ I105 հաշիվը IDs կամ շղթայի վրա գտնվող կեղծանունները; եթե բլոկային հետազոտող կամ կաթնային վերջնական կետը վերադարձնում է ID, որը SDK-ը մերժում է, այն լուծեք քանոնիկ հաշվին ID ՝ նախքան այս օգնականներին զանգահարելը.

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Միջոցառումներ {#events}

Streaming- ի օգնականները JSON օգտակար բեռնվածքները կոդավորում են որպես նախապայման: Անցրեք `with_metadata=True` երբ ձեզ անհրաժեշտ է SSE իրադարձության անունը, ID- ը, կրկին փորձեք հուշում եւ خام օգտակար բեռը: Զույգվեք `EventCursor` -ի հետ ՝ պահպանելու վերջին իրադարձության ID- ն։ Այս օրինակները սպասում են կենդանի իրադարձությունների, այնպես որ գործադրեք դրանք բջիջի դեմ, որտեղ համապատասխան իրադարձությունների հոսքը ակտիվ է եւ ակտիվ:

```python
from iroha_python import DataEventFilter, EventCursor

# Narrow the stream to proof events with the expected backend and proof hash.
proof_filter = DataEventFilter.proof(
    backend="halo2/ipa",
    proof_hash_hex="deadbeef" * 8,
)

# Persist the latest SSE id so a reconnect can resume from the same point.
cursor = EventCursor()
for event in client.stream_events(
    filter=proof_filter,
    cursor=cursor,
    resume=True,
    with_metadata=True,
):
    print(event.id, event.event, event.data)
    break

for event in client.stream_trigger_events(trigger_id="hourly_reward", resume=True):
    print(event)
    break

for tx_event in client.stream_pipeline_transactions(status="Queued"):
    print(tx_event)
    break
```

## Գլխավորներ եւ հասցեներ {#keys-and-addresses}

SDK-ը բացահայտում է տեղական ստորագրման օգնականները յուրաքանչյուր ստորագրության ալգորիթմի համար, որը կազմված է բնիկ ընդլայնման մեջ: Այս օգնականները չեն զանգահարում Taira, բայց նրանք պահանջում են բնիկ ընդարձակումը:

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

Օգտագործեք `supported_crypto_algorithms()` ՝ տեսնելու համար, թե ինչն է աջակցում ձեր հեծանիվը: Գլխավոր օգնականները օգտագործում են կանոնիկ ալգորիթմային տիտղոսներ եւ աշխատում են Ed25519, secp256k1, ML-DSA, GOST, BLS եւ SM2 համար, երբ այդ ալգորիտմները կազմվում են հետեւյալ կերպ.

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

### Չիներեն SM Գաղտնիություն {#chinese-sm-cryptography}

Python SDK-ը բացահայտում է ինչպես ընդհանուր SM2 օգնականները, այնպես էլ SM2- ի հատուկ հարմարավետության օգնականները: Օգտագործեք հանգույցի հնարավորությունների գովազդը ՝ ընտրելու համար նպատակային ցանցի կողմից սպասվող SM2 տարբերակման նույնականացողը.

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

capabilities = client.get_node_capabilities_typed()
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

`crypto.sm.enabled` ցույց է տալիս, թե արդյոք հանգույցը ընդունում է SM ընտանիքի ալգորիթմները իր ընթացիկ քաղաքականության մեջ: Նույն գովազդը ներառում է SM շիշային քաղաքականությունը եւ արագացման կարգավիճակը, որը օգտակար է որոշելու համար, թե արդյոք պետք է ակտիվացնել SM2-հատուկ հոսքեր.

```python
capabilities = client.get_node_capabilities_typed()

# `enabled` is the submit-time policy flag, not just local SDK support.
if capabilities.crypto and capabilities.crypto.sm.enabled:
    sm = capabilities.crypto.sm
    print(sm.default_hash)
    print(sm.allowed_signing)
    print(sm.acceleration.policy)
else:
    print("SM crypto is not enabled by this node")
```

Հասարակական Taira-ը ստուգման ընթացքում բացահայտեց SM հնարավորության գովազդը, բայց այնտեղ SM ստորագրումը անջատվեց: Գովազդված ստորագրման ալգորիթմները եղել են `ed25519`, `secp256k1` եւ `bls_normal`: այնպես որ SM2 ստորագրված գործարքները չներկայացրեք այդ տեղակայման համար, եթե հնարավորության օգտակար բեռը չի փոխվում:

### GOST եւ հետքվանտային բանալիները {#gost-and-post-quantum-keys}

Օգտագործեք ընդհանուր կրիպտո API համար GOST R 34.10-2012 պարամետրերի հավաքածուներ եւ ML-DSA (`ml-dsa`) քվանտային ստորագրությունները: Նույն կոճակի զույգի օբյեկտը զբաղվում է ստորագրման, ստուգման եւ բազմակողմանի արտահանման հետ.

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

Gate GOST եւ post-quantum հոսանքները գոտի գովազդային ստորագրման ալգորիթմների վրա: Օգտագործեք կաթվածային հնարավորության օգտակար բեռը առաջընթաց համատեղելի ալգորիտմի անվանումների համար.

```python
capabilities = client.request_json(
    "GET",
    "/v1/node/capabilities",
    expected_status=(200,),
)
crypto = capabilities.get("crypto", {})
sm = crypto.get("sm", {})
# Nodes advertise the signing algorithms they will accept for transactions.
allowed = set(sm.get("allowed_signing", []))

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
supports_sm2 = "sm2" in allowed and bool(sm.get("enabled", False))

print(supports_gost, supports_post_quantum, supports_sm2)
```

Եթե մի հանգույց չի գովազդում ձեզ անհրաժեշտ ալգորիթմը, օգտագործեք բանալին միայն տեղական կամ օֆլեյն աշխատանքային հոսքերի համար: Մի ուղարկեք այդ ալգորիտմի հետ ստորագրված գործարքները այդ հանգույցի վրա: Հասարակական Taira ստուգման ընթացքում GOST եւ ML-DSA հասանելի էին որպես SDK կրիպտո օգնականներ վերեւում գտնվող Python գրադարանում, բայց բջիջի կողմից չեն հայտարարվել գործարքի ստորագրման համար։

## Ստեղծված հաճախորդների ստեղծում {#config-aware-client-creation}

Օգտագործեք `resolve_torii_client_config` այն դեպքում, երբ ձեր հավելվածը ֆայլից կարդում է բջիջների կարգավորումները, բայց դեռեւս կարիք ունի բնապահպանության կամ փորձարկման հատուկ վերլուծությունների:

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

## Կագեմուսա պատրաստակամություն {#kagemusha-readiness}

Python SDK կարող է ներկայիս JSON պատրաստության երթուղին հարցնել իր ընդհանուր Torii խնդրանքային օգնականի միջոցով.

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

Python չի բացահայտում Kagemusha- ի տիպավորված լրացում կամ փրկման արխիվների ստեղծողները: Օգտագործեք Swift կամ JVM գրպանումը, որպեսզի կառուցեք քանոնիկ V4 արխիվները, ապա ներկայացրեք եւ հարցաքննեք դրանք աջակցվող Kagemusha Torii հաճախորդի միջոցով:

## Աբոնամուտներ {#subscriptions}

Հաշվառության օգնականները մուտացիոն ծառայությունների զանգերն են, որոնք ժառանգվել են Torii բաժնետոմսային հաճախորդից, որը օգտագործվում է `iroha_python.ToriiClient`: Օգտագործեք IDs եւ այն ակտիվները, որոնք գոյություն ունեն ձեր թիրախավորած ցանցում.

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

# The provider signs plan creation.
client.create_subscription_plan(
    authority=alice,
    private_key=alice_pair.private_key_hex,
    plan_id="compute#wonderland",
    plan=usage_plan,
)

# The subscriber signs subscription creation.
client.create_subscription(
    authority=bob,
    private_key=bob_pair.private_key_hex,
    subscription_id="sub-001",
    plan_id="compute#wonderland",
)

# Usage is recorded by the provider and then charged on demand.
client.record_subscription_usage(
    "sub-001",
    authority=alice,
    private_key=alice_pair.private_key_hex,
    unit_key="compute_ms",
    delta="3600000",
)
client.charge_subscription_now(
    "sub-001",
    authority=alice,
    private_key=alice_pair.private_key_hex,
)
```

## Կապակցեք {#connect}

Կառուցել եւ վերլուծել Connect URIs, եւ կարդալ հանրային Connect կարգավիճակը, որը բացահայտվել է Taira:

```python
from iroha_python.connect import ConnectUri, build_connect_uri, parse_connect_uri

# Connect URIs are what an app hands to a wallet to start a session.
uri = build_connect_uri(
    ConnectUri(
        sid="base64url-session-id",
        chain_id=CHAIN_ID,
        node="taira.sora.org",
    )
)
parsed = parse_connect_uri(uri)
# Status tells you whether the node currently exposes Connect.
status = client.get_connect_status_typed()

assert parsed.chain_id == CHAIN_ID
print(status.enabled, status.sessions_active)
```

Ռեմի կոդեկները, նստաշրջանի բանալիների արտահանումը եւ նստաշրջանի ստեղծումը պահանջում են տեղական ընդլայնումը եւ Connect նստաշրջանի երթուղին:

```python
from iroha_python import (
    ConnectControlClose,
    ConnectControlOpen,
    ConnectDirection,
    ConnectFrame,
    ConnectPermissions,
    decode_connect_frame,
    encode_connect_frame,
    generate_connect_keypair,
)

# The app keypair is separate from the account key used for transactions.
connect_pair = generate_connect_keypair()
info = client.create_connect_session_info(
    {"role": "app", "sid": connect_pair.public_key.hex()}
)
print(info.app_uri, info.wallet_token, info.expires_at)

# Control frames negotiate permissions before encrypted messages are sent.
frame = ConnectFrame(
    sid=bytes.fromhex("01" * 32),
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=1,
    control=ConnectControlOpen(
        app_public_key=connect_pair.public_key,
        chain_id=CHAIN_ID,
        permissions=ConnectPermissions(methods=["SIGN_REQUEST_TX"], events=[]),
    ),
)
payload = encode_connect_frame(frame)
assert decode_connect_frame(payload) == frame

# Closing the control channel is explicit and carries a reason code.
client.send_connect_control_frame(
    "base64url-session-id",
    ConnectControlClose(role="App", code=4100, reason="finished", retryable=False),
)
```

Գլխավորագրեք հաստատումից հետո հաղորդագրությունները վիճակային նստաշրջանի միջոցով.

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

## Կառավարման, վազման ժամանակի եւ կառավարման մակերեսների {#governance-runtime-and-admin-surfaces}

Այս միայն ընթերցվող զանգերը հաջողությամբ վերադարձվել են հանրային Taira դեմ.

```python
client = create_torii_client("https://taira.sora.org")

# Governance reads return either current settings or typed not-found wrappers.
protected = client.get_protected_namespaces()
referendum = client.get_governance_referendum_typed("ref-1")
tally = client.get_governance_tally_typed("ref-1")
locks = client.get_governance_locks_typed("ref-1")
unlock_stats = client.get_governance_unlock_stats_typed()

print(protected, referendum.found)
print(tally.approve, list(locks.locks), unlock_stats.expired_locks_now)

# Runtime reads expose the active ABI and any pending upgrade records.
abi = client.get_runtime_abi_active_typed()
abi_hash = client.get_runtime_abi_hash_typed()
runtime_metrics = client.get_runtime_metrics_typed()
upgrades = client.list_runtime_upgrades_typed()
capabilities = client.get_node_capabilities_typed()

print(abi, abi_hash, runtime_metrics)
print(upgrades.total, capabilities.abi_version)
```

Runtime թարմացման օգնականները ընդունում են վազման ժամանակի թարմացման կողմից օգտագործվող manifest ձեւը API: Նրանք օպերատորների գործողություններ են, այնպես որ դրանք օգտագործում եք միայն այն հանգույցի դեմ, որտեղ ձեր հաշիվն ու տոքերն թույլատրված են.

```python
admin = create_torii_client(
    TORII_URL,
    auth_token="admin-token",
api_token="torii-token",
)

# Propose creates the upgrade instructions; activation/cancel are operator actions.
upgrade = admin.propose_runtime_upgrade(
    {
        "name": "Refresh runtime provenance",
        "description": "Schedules a no-ABI-change runtime rollout.",
        "abi_version": 1,
        "abi_hash": "00" * 32,
        "added_syscalls": [],
        "added_pointer_types": [],
        "start_height": 1_500_000,
        "end_height": 1_500_256,
    }
)
print(upgrade["tx_instructions"])

admin.activate_runtime_upgrade("deadbeef" * 4)
admin.cancel_runtime_upgrade("feedface" * 4)
```

## Պաշտոն, համաձայնություն եւ ցանցի հեռաչափություն {#status-consensus-and-network-telemetry}

```python
# `/status` is the public node snapshot endpoint on Taira.
status = client.request_json("GET", "/status", expected_status=(200,))
print(status["blocks"], status["txs_approved"])

# Sumeragi and time endpoints expose consensus and clock diagnostics.
sumeragi = client.get_sumeragi_status_typed()
print(sumeragi.highest_qc.height, sumeragi.tx_queue.saturated)

time_now = client.get_time_now_typed()
time_status = client.get_time_status_typed()
for sample in time_status.samples:
    print(sample.peer, sample.last_offset_ms, sample.last_rtt_ms)
print(time_now.now_ms)
```

## SoraFS, UAID եւ Kaigi Օգնողները {#sorafs-uaid-and-kaigi-helpers}

Այս օգնականները հասանելի են, երբ թիրախային հանգույցը բացահայտում է համապատասխան Nexus/SORA վերջակետերը: Բարեւ դատարկ ցուցակները որպես վավեր արձագանք. հանրային Taira կարող է ունենալ երթուղին առանց տվյալների հանրաճանաչի մանիֆեսի կամ UAID համար:

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

# Kaigi health summarizes relay availability when the route is enabled.
health = client.get_kaigi_relays_health_typed()
print(health.healthy_total, health.failovers_total)
```

## Norito RPC եւ GPU Օգնողներ {#norito-rpc-and-gpu-helpers}

Օգտագործեք `NoritoRpcClient` այն ժամանակ, երբ դուք արդեն ունեք Norito բայթներ եւ պետք է զանգահարեք երկկողմ Torii վերջային կետ: Օրինակն պահանջում է նախորդ գործարքի ձեւանմուշից ստորագրված փաթեթ:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

CUDA օգնականները վերադարձնում են `None`, երբ backend- ը հասանելի չէ, այնպես որ ծրագրերը կարող են վերադառնալ սկանալային իրականացման:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Ներկայիս ծավալը {#current-coverage}

Python SDK-ը արդեն ներառում է հետեւյալ օգնականների համար.

- Torii ներկայացում, վիճակագրություն, հարցումներ եւ կառավարման հոսքեր
- սովորական ISI եւ դոմեյնային հատուկ ընդլայնումների համար տիպված հրահանգների ստեղծող սարքեր
- գործարքի նախագծերը, մանիֆեսները, ստորագրումը եւ ստորագրված գործարքային փաթեթների աշխատանքային հոսքը
- հոսող իրադարձություններ, ֆիլտրեր եւ վերսկսելի դասիչներ
- Գլխավոր Kagemusha պատրաստության մուտք եւ Torii բաժանորդագրության օգնականներ: Տիպված լրացման եւ փրկարարների կառուցապատողները չեն բացահայտվում:
- հաշիվի հասցե, բոլոր ալգորիթմների ստորագրման օգնականներ, բազմազան շփումներ՝ SM2, GOST, ML-DSA եւ BLS, ինչպես նաեւ գաղտնի բանալիների կառավարում
- Կապակցեք URIs, նստաշրջաններ, շրջանակներ, կոդավորման օգնականներ եւ գրանցման կառավարիչ
- կառավարման, վազման ժամանակի թարմացման, Sumeragi, node-admin, SoraFS, UAID եւ Kaigi վերջնական կետերի փաթեթները, որտեղ հանգույցը բացահայտում է այդ հատկանիշները:

## Վերածննդային հղումներ {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Այդ ֆայլերը ճշմարտության աղբյուր են Python մակերեսի համար փակված աշխատատեղի վերանայման մեջ:
