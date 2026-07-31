---
translation_locale: dz
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

ཡར་ཐུག་ལུ་ལཱ་འབད་སའི་ས་ཁོངས་ནང་ལུ་ Python SDK འདི་ `iroha-python`ཨིན། དང་པ་ར་ Iroha 3 པར་སྐྲུན་འབད་ནི་འདི་གིས་ ད་ལྟོའི་ Torii དང་ Norito ས་ཁུདཔ་ཚུ་ལུ་ དམིགས་གཏད་བསྐྱེད་དོ་ཡོདཔ་ཨིན། ཁྱོད་ཀྱིས་མཉམ་འབྲེལ་འབད་བའི་ཐོག་ལས་ལག་ལེན་འཐབ་མི་ ཕབ་ལེནཌ་གི་འགྱུར་སྒྲིག་ ཡང་ན་ གཞི་རྟེན་བསྐྱར་བཅོས་འདི་ ཨེབ་གཏང་འབད། དེ་བཟུམ་སྦེ་ SDK དང་ མཚམས་སྦྱོར་དེ་ ཀི་རིཌ་བཟོ་རིམ་བསྐྱར་བཅོས་ཅིག་ཁར་སྡོད་འོང་།

འོག་གི་དཔེ་ཆ་ཚུ་ ཀློག་རྐྱང་སྦེ་ བརྟག་ཞིབ་འབད་ཡོདཔ་ད་ མི་མང་གིས་ Taira འདི་ནང་ལུ་ `https://taira.sora.org`. བསྒྱུར་བཅོས་འབད་ནིའི་དཔེ་འདི་ ཕྱིར་ཚོང་གྱི་ ཐོ་བཀོད་ཚུ་ཨིན། འདི་གི་དོན་ལུ་ real Taira ཚད་འཛིན་དང་ སྒེར་གྱི་ལྡེ་མིག་ དེ་ལས་ ས་སྣུམ་མེ་ཊ་ཌའི་ཊཱག་ཚུ་ བཏབ་མ་ཚར་བའི་ཧེ་མར་ འགྲོ་འགྲུལ་ལམ་གྱི་དོན་ལུ་ དགོས་མཁོ་ཅན་གྱི་ ལག་ལེན་པ་གི་བརྡ་དོན་ཚུ་ཨིན།

དཔེ་འདི་ འ་ནི་རིམ་ནང་ལུ་ལག་ལེན་འཐབ་དགོ།

|རིམ་པ་ |མི་མང་གི་ Taira ལུ་ དོ་འགྲན་འབད་ནི་? |ཁྱོད་ལུ་དགོ་མི་ཚུ་|
| --- | --- | --- |
|ཀློག་ཐེངསམ་རྐྱངམ་ཅིག་ བརྒྱུད་འཕྲིན་འབད།|ཨིན་ལགས་ |Python སྦ་སྒོར་དང་ མཐུད་འབྲེལ་ཐོ་བཀོད་འབད་ |
|ས་གནས་ཀྱི་བརྡ་བཀོད་དང་བསླབ་བྱ་བཟོ་མི་ |`submit()`ཚུན་ཚོད་ འགྲུལ་འཕྲིན་བརྡ་སྤྲོད་འབད་ནི་མེད། |རང་ལུགས་ཀྱི་ཁྱབ་སྒྲགས་དང་ ཁྱོད་ཀྱི་གདམ་ཁ་ཅན་གྱི་རྫས་ |
|བསྒྱུར་བཅོས་ཀྱི་ཞལ་འདེབས་དང་ ཞབས་ཏོག་གི་ཅ་ལ་ཚུ་|ཁྱོད་རའི་རྩིས་ཁྲ་ནང་རྐྱངམ་ཅིག་ དངུལ་རྐྱང་རྐྱང་བཙུགས་ཏེ་ |ཁྲལ་འཛིན་སྐྱོང་གི་རྩིས་ཁྲ་, སྒེར་གྱི་ལྡེ་མིག་, ལྕགས་ཐག་ ID, དངུལ་ཕོགས་ཀྱི་བརྡ་དོན་, དངུལ་ཕོགས་གི་རྒྱུ་དངོས་ལྷག་ལུས་དང་ རྒྱང་ལམ་ཐིག་ཁྲ། |
|སྒྲིག་གཞི་ codecs མཐུད་སྦྲེལ་, crypto, དང་ GPU གྲོགས་རམ་ |ས་གནས་རྐྱངམ་གཅིག་ |རང་ལུགས་ཀྱི་ཁྱབ་སྒྲགས་; GPU གྲོགས་རམ་འབད་མི་ཚུ་ལུ་ཡང་ CUDA-ནུས་ཅན་ backend དགོཔ་ཨིན། |

## སེལ་འཐུ་འབད། {#install}

སྦ་སྒོའི་བརྡ་དོན་གྱི་མིང་འདི་ `iroha-python`ཨིན། ཁྱོད་ཀྱིས་མ་བཙུགས་པའི་ PyPI གཞི་བཙུགས་འབད་མི་དེ་ Taira ཕྲང་ལམ་ངོ་མ་ལུ་ འོས་འབབ་ཡོདཔ་སྦེ་མ་བཟོ། ཁྱོད་ཀྱི་མཐུན་རྐྱེན་གི་དམིགས་གཏད་ཚུ་གོང་འཕེལ་འགྱུར་བཅོས་ནང་ལས་བཟོ་ཡོད་པའི་ འཁོར་ལོ་ཡང་ན་འབྱུང་ཁུངས་ལག་ལེན་སྒྲིག་གཞི་བཙུགས་འབད།:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

ཁྱོད་ཀྱིས་ ལས་འགུལ་འདི་ ཡར་ཐུག་ལུ་ལཱ་འབད་སའི་ས་སྒོ་ཚུ་ ཐད་ཀར་དུ་ལག་ལེན་འཐབ་པ་ཅིན་ Python འབྲེལ་བ་གཞི་བཙུགས་འབད་ཞིནམ་ལས་ native extension བཟོ་ནི་དེ་ ལག་ལེན་འཐབ་པའི་ཧེ་མར་ `Instruction`, `TransactionDraft`, signing, crypto, SoraFS native helpers, GPU helpers, ཡང་ན་ Connect framework codecs ལག་ལེན་འཐབ་མི་དཔེ་སྟོན་ཚུ་ལག་ལེན་འཐབ་དགོ། ཡར་ཐུག་ལུ་ `python/iroha_python/README.md` ལས་བཟོ་གོང་གི་བཀའ་རྒྱ་ལག་ལེན་འཐབ་ཞིནམ་ལས་ རང་བཞིན་གྱི་ཕྱིར་ཚོང་འཐབ་ནིའི་འགན་ཁུར་དེ་ བརྟག་དཔྱད་འབད་:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

གལ་སྲིད་ `create_torii_client` ནང་འདྲེན་འབད་རུང་ `Instruction` ཡང་ན་ `generate_ed25519_keypair` འདི་མ་གྲུབ་པ་ཅིན་ ཕབ་ལེནམ་གཙང་མའི་ Python ཨིན། དེ་འབདཝ་ད་ རང་བཞིན་གྱི་རྒྱ་བསྐྱེད་འདི་མེད་འོང་།

## Quickstart {#quickstart}

མི་མང་གི་ལྷག་ཐིག་རྐྱངམ་གཅིག་ Taira མཇུག་མཐའན་མཇུག་གི་སྒོ་ཚུ་ནང་ལས་འགོ་བཙུགས་ནི།

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

## མཉམ་འབྲེལ་མཐུན་རྐྱེན་ {#shared-setup}

བསྒྱུར་བཅོས་འབད་ཐངས་ཚུ་གི་དོན་ལུ་ འ་ནི་ གཞི་སྒྲིག་འདི་ལག་ལེན་འཐབ་ སྦྲེལ་མཐུད་འབད་ཐངས་འདི་མ་བཙུགས་པའི་ཧེ་མར་ ས་གནས་འཛིན་པ་རེ་ལུ་ Taira དབང་འཛིན་, སྒེར་གྱི་ལྡེ་མིག་, ཐོ་ཀིན་དང་ རྒྱུ་དངོས་/རྩིས་ཁྲ་ IDs སྦེ་བགོ་བཀྲམ་འབད་དགོ།

`authority` འདི་ཚོང་འབྲེལ་གུ་ མཚན་རྟགས་བཀོད་མི་རྩིས་ཨིན། `private_key` དེ་རྩིས་དང་འདྲན་འདྲ་བཟོ་དགོཔ་ཨིན་པ། `CHAIN_ID` གིས་ དམིགས་གཏད་གི་དྲ་ལམ་དང་འདྲན་འདྲན་འདྲ་འབད་དགོཔ་ཨིན། དེ་ལས་ `TX_METADATA` གིས་ ལས་འཛིན་གྱིས་རེ་བ་བསྐྱེད་མི་འཐུས་གྱི་ས་ཁོངས་ཚུ་རྩིས་དགོ། འོག་གི་ས་ཆ་འཆང་མི་ཚུ་གིས་ ཐབས་ཤེས་མེད་པར་ ཆ་མེད་གཏང་དོ་ཡོདཔ་ལས་ རྐྱེན་ངན་ཐོག་ལས་ བཏང་མི་ཚུགས།

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

`Instruction.*` གིས་ བཟོ་སྐྲུན་གྱི་བསླབ་བྱ་གི་ ཁེ་ཕན་གྱི་ཅ་ལ་ཚུ་རྐྱངམ་གཅིག་འབོ་ཨིན། `submit()` འདི་ SDK གིས་ ཚོང་འབྲེལ་གུ་ མཚན་རྟགས་བཀོད་ཞིནམ་ལས་ Torii ལུ་བཏང་སྟེ་ གནས་སྟངས་ཅིག་གི་དོན་ལུ་སྒུག་སྡོད་སའི་གནས་སྐབས་ཨིན།

## ཁྲལ་དང་ གློག་སྣུམ་གྱི་འཐུས་ {#fees-and-gas}

ཚོང་འབྲེལ་ཡིག་འབྲུ་ལུ་འཐུས་ཀྱི་བརྡ་དོན་དང་ དངུལ་རྐྱང་གི་རྩིས་ཁྲ་ཚུ་ དགོཔ་ཨིན། Taira ལུ་, དངུལ་རྐྱང་གྱི་རྩིས་ཁྲ་དེ་ མི་མང་གི་ཐབ་ཁུག་ལས་མ་དངུལ་ཨིནམ་ད་ ཕྱིར་ཚོང་གི་བརྡ་དོན་ནང་ `gas_asset_id` བཅའ་མར་གཏོགས་དགོཔ་ཨིན།Minamoto ལུ་, དངུལ་ཕོགས་འདི་ real XOR དང་རྒྱུ་དངོས་ ID ལས་འབྱུང་དོ་ཡོདཔ་ཨིན། འདི་བཟུམ་གྱི་དྲ་ལམ་གི་སྒྲིག་གཞི་ལས་ཨིན།

ཟད་འགྲོ་བཏང་མི་ ཌེ་ཊའི་ཊཱག་དེ་ རིམ་རྐྱང་གི་བཀོད་རྒྱ་ལས་མེན་རུང་ བསྡུ་ལེན་གྱི་དོན་ལུ་ཨིན། གོང་ལུ་ `submit()` རྒྱབ་སྐྱོར་འདི་གིས་ `TX_METADATA` སྒྲིག་འཇུག་བྱས་ཚད། ཐེངས་ 1 ལས་ཉུང་བ། ཐོན་རིམ་ 5.7.1 ནང་དུ་ཚོད་ལྟ་བྱས་ཟིན། ལོ 6 སྔོན་ལ་གསར་བཅོས་བྱས།

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

འབྲི་ཤོག་ཚུ་བཏང་བའི་ཧེ་མར་ གཞུང་གི་རྩིས་ཁྲ་ལུ་འཐུས་དངུལ་གྱི་ རྒྱུ་དངོས་དག་པ་ཅིག་ཡོད་མི་འདི་ བརྟག་ཞིབ་འབད་གི། ཐབ་ཤིང་དང་རྒྱུ་དངོས་ ID འདི་ཐད་ཀར་དུ་ ཁྱད་ཅན་ཨིན། འ་ནི་འདི་ Taira བཟོ་བཀོད་ཨིན།

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

འབུབ་འདི་གིས་ བཀྲིས་ཏོང་ཏོ་ལོག་གཏངམ་ཨིན། `asset_id` བརྒྱ་ཆ་བསྡོམས་བརྟག་དཔྱད་འབད་ནིའི་དོན་ལུ་ ལག་ལེན་འཐབ་ནི་ཨིན། `gas_asset_id` metadata field གིས་ fee asset definition འདི་ལག་ལེན་འཐབ་ཨིན། ID.

ལག་ལེན་གྱི་ metadata འདི་འཐུས་ཀྱི་ metadata ལས་སོ་སོར་སྦེ་ བཞག་ནི་ཨིནམ་ད་ ཁྱོད་ཀྱིས་ཚོང་འབྲེལ་བཟོ་སྐབས་ mappings ཚུ་སྤེལ་ཐོག་ལས་:

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

གལ་སྲིད་ ཁྱོད་ཀྱིས་འཐུས་ཀྱི་བརྡ་དོན་ཚུ་ བརྗོད་མ་བཏུབ་པ་ཅིན་ ཟད་འགྲོ་གི་རྒྱུ་དངོས་མ་བདེཝ་སྦེ་ ལག་ལེན་འཐབ་སྟེ་ ཡང་ན་ དངུལ་འབྲེལ་མ་དངུལ་པའི་རྩིས་ཁྲ་དང་གཅིག་ཁར་ ཐོ་བཀོད་འབད་བ་ཅིན་ ཕྲང་ལམ་གྱི་དྲ་རྒྱ་ཅིག་གིས་ གནད་དོན་འདི་ ཆ་མེད་གཏང་དགོཔ་ཨིན་རུང་ ལམ་སྟོན་གྱི་ཁེ་ཕན་དེ་ ཆ་མེད་སོང་ཡོདཔ་ཨིན།

## Taira-བརྟག་ཞིབ་འབད་མི་ ཀློག་རྐྱང་ བརྒྱུད་འཕྲིན་ཚུ་ {#taira-checked-read-only-calls}

འ་ནི་ཁ་འབུབ་འདི་ མི་མང་ལུ་ Taira ཕྱིར་འཐེན་འབད་ཡོདཔ་ཨིན།

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

རྒྱང་ལམ་ཚུ་ དཔེར་ན་ `/v1/status`, སྤྱིར་བཏང་གི་གྲོགས་རམ་གྱི་ཐོ་ཡིག་ཚུ་ Sumeragi RBC བརྟག་ཞིབ་འབད་ཐབས། node admins snapshots དང་ Connect app ཐོ་བཀོད་ཡིག་ཚང་འཛིན་སྐྱོང་ཚུ་ publicly not available on Taira བརྟག་དཔྱད་འབད་བའི་སྐབས་ལུ་ ལག་ལེན་འཐབ་དགོ། `request_json("GET", "/status")` public node status གི་ཁེ་ཕན་གྱི་དོན་ལུ་ Taira.

## རིག་རྩལ་བཟོ་སྐྲུན་འབད་མི་ {#instruction-builders}

SDK གིས་ སྤྱིར་བཏང་གི་བརྡ་སྟོན་གྱི་བཟའ་ཚན་ཚུ་གི་དོན་ལུ་ ཐོ་བཀོད་ཅན་གྱི་བཟོ་སྐྲུན་འབད་མི་ཚུ་དང་ JSON གི་ཐར་ཐུབས་ཀྱི་སྒོ་ར་སྒོ་འདི་ ཧེ་མ་ལས་རིམ་འགོ་དང་པ་ Python ཟེར་མི་ཐབས་ལམ་ཚུ་མེན་པའི་དོན་ལུ་བཏོན་ཡོདཔ་ཨིན། འ་ནི་ཤོག་ལེབ་ཚུ་ བསྒྱུར་བཅོས་འབད་མི་ བྱ་སྟབས་མ་བདེཝ་ཚུ་ཨིནམ་ལས་ ངོས་ལེན་རྩིས་མེད་སྦེ་ མི་མང་ལུ་ Taira ལུ་བཙུགས་མི་ཨིན།

ཐོ་བཀོད་ཅན་གྱི་བརྡ་སྟོན་འདི་ ལག་ལེན་འཐབ་ནི་དེ་ ལེགས་ཤོམ་ཨིན། Python ཚད་གཞི་ཚུ་ རང་བཞིན་གནས་གོང་བཟོ་སྟེ་ཡོད་མི་ཚུ་དང་ མ་བདེན་པའི་རྣམ་གཞག་ཚུ་ ཧེ་མ་ལས་མ་གྲུབ་པར་འགྱོ་དོ་ཡོདཔ་ཨིན། ཁྱོད་ཀྱིས་ `Instruction.from_json` འདི་ལག་ལེན་འབད་དགོཔ་ད་རྐྱངམ་གཅིག་ ཁྱོད་ཀྱིས་ བརྡ་སྟོན་གྱི་རྣམ་འགྱུར་ཅིག་ དགོས་མཁོ་ཡོདཔ་ཨིན་རུང་ ད་ལྟོ་ཡང་ Python རྒྱབ་སྐྱོར་མེད་པ་ཅིན་ ལག་ལེན་འཐབ་ཚུགས།

|སློབ་སྟོན་གྱི་བཟའ་ཚང་ |Python ས་ཁོངས།|
| --- | --- |
|ཐོ་བཀོད་འབད་ | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` genesis/bootstrap toolingགི་དོན་ལུ་བཞག་ཡོདཔ་ཨིན། |
|ཐོ་བཀོད་མ་རྐྱབས་ |`unregister_trigger` ལག་ལེན་འཐབ་ནི་ `Instruction.from_json` ལས་སྣ་གཞན་ཚུ་གི་དོན་ལུ་ |
|Mint/Burn |`mint_asset_numeric`,`burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
|བསྒྱུར་བཅོས་ |`transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|metadata དང་ controls |`set_account_key_value`, `remove_account_key_value`,`set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
|RWA ཚེ་སྲོག་འཁོར་ |`merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
|ExecuteTrigger |`execute_trigger` |
|གནས་སྤོ་/གནས་སྤོ་ཚུ་ རྒྱ་སྐྱེད་འབད་ནི།|`repo_initiate`, `repo_unwind`,`repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|རང་བཞིན་གྱི་ རྒྱུ་དངོས་གི་ལྡེ་མིག་ཚུ་ |`open_asset_lock`, `drawdown_asset_lock`,`cancel_asset_lock`, `expire_asset_lock` དེ་ལས་རྒྱབ་སྐྱོར་འབད་མི་མགྲོན་པ་ `*_and_wait` |
|Grant/Revocate, SetParameter, Log, Custom, Upgrade དེ་ལས་ ཐོ་བཀོད་འབད་མ་བཏུབ་པའི་ འདྲ་བཤུས་ཚུ་ |`Instruction.from_json` ཡང་ན་ `TransactionBuilder.add_instruction_json` དང་གཅིག་ཁར་ ཀ་ནོ་ནི་ཀཱན་གྱི་ `InstructionBox` JSON |

སྦ་སྒོར་གྱི་རྣམ་ཐངས་ཀྱི་ གནས་སྟངས་ཅན་གྱི་སྤྲོད་ལེན་ཚུ་གི་དོན་ལུ་ [Native Asset Escrow](/dz/blockchain/escrow.md#python-asset-locks) ལུ་གཟིགས་དགོ། Python གིས་ ད་རེས་ནངས་པར་ ཨང་དང་པ་གི་རོགས་རམ་འབད་མི་ཚུ་ལུ་ སྤྱིར་བཏང་ནོར་རྫས་བཀག་སྡོམ་འབད་ནི་གི་ གོ་སྐབས་བྱིན་དོ་ཡོདཔ་ཨིན། ཚོང་ལམ་དང་མིང་མ་ཤེསཔ་གི་སྦ་སྒོའི་རོགས་རམ་འབད་མི་ཚུ་ ད་ལྟོ་ཡང་ ཨང་དང་པ་ཨིན་མི་ ཐབས་ལམ་ཚུ་ Python ཨིན་མས།

### Domain གཞི་བཙུགས་འབད་ དེ་ལས་རྩིས་ཁྲ་དང་ རྒྱུ་དངོས་ཚུ་ ཐོ་བཀོད་འབདཝ་ཨིན། {#set-up-domains-then-register-accounts-and-assets}

སྤྱིར་བཏང་ domain བཟོ་སྐྲུན་འདི་ declarative alias planner གྱི་ཐོག་ལས་འགྱོ་དོ་ འདི་གིས་འབད་ SNS ཁང་གླ་དང་ ཇོ་བདག་གི་ལྕོགས་གྲུབ་ ཚད་འཛིན་སྲུང་སྐྱོབ་ དེ་ལས་ ས་ཁོངས་ཀྱི་གནས་སྟངས་ཚུ་ གཅིག་ཁར་བརྟག་དཔྱད་འབད་ཡོདཔ་ཨིན། གསང་བའི་ཐོག་ལས་ `AliasSetupPlanRequestV1` ཁྱོད་ཀྱི་འཆར་གཞི་ SDK ཡང་ན་ འཛུལ་ཞུགས་ཞབས་ཏོག་དང་ཕྱདཔ་ད་ལག་ལེན་འཐབ་ `iroha app alias setup plan` དང་ `iroha app alias setup apply`. བཏང་མི་དགོ་ `Instruction.register_domain` ལས་འགུལ་གྱི་ལག་ལེན་ལས་ཨིན། འདི་བཟོ་མི་དེ་ genesis/bootstrap tooling གི་དོན་ལུ་ར་ བཞག་ཡོདཔ་ཨིན།

ཌོ་मेन གཞི་བཙུགས་འཆར་གཞི་དེ་ བརྩོན་ཤུགས་བསྐྱེད་པའི་ཤུལ་ལས་, ཌོ་เมནགྱི་དབང་འོག་གི་དངོས་རྫས་ཚུ་ ཐོ་བཀོད་འབད། Taira བཟུམ་ཅིག་སྦེ་བགོ་བཤའ་རྐྱབ་མི་དྲ་ལམ་ནང་ལུ་ ཁྱོད་ཀྱིས་ཐོབ་ཡོད་པའི་ ཌོ་મેནདང་རྩིས་མིང་སྟོང་འདི་ལག་ལེན་འཐབ་དགོ།

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

`mintable` གིས་ `Infinitely`, `Once`, `Not` ཡང་ན་ `Limited(n)` ཚད་གཞི་ཚུ་ཆ་བཞག་ཡོདཔ་ད་ གནད་སྡུད་དཔེ་རིམ་གྱིས་ ཆ་འཇོག་འབད་ཡོདཔ་ཨིན། ཨང་གྲངས་ཀྱི་བཅའ་ཁྲིམས་མེད་པའི་ རྒྱུ་དངོས་གི་དོན་ལུ་ `scale` བཏོན་གཏང་།

### བཟོ་སྐྲུན་འབད་ནིའི་ རྒྱུ་དངོས་དང་ ཅ་ཆས་ཚུ་ {#mint-burn-and-transfer-assets}

འ་ནི་ཅ་ལ་ཚུ་གིས་ ཧེ་མ་ལས་ཡོད་པའི་ རྒྱུ་དངོས་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན། ID. སྔོན་དུ་ རྒྱུ་དངོས་གི་འགྲེལ་བཤད་བཀོད་དེ་ ཐོ་བཀོད་འབད་ཞིནམ་ལས་ འབྲེལ་ཡོད་རྒྱུ་དངོས་བཟོ་ནི། ID རྒྱུ་དངོས་གི་བདག་འཛིན་འཐབ་མི་རྩིས་ཁྲ་གི་དོན་ལུ་ཨིན།

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### བསྒྱུར་བཅོས་ཀྱི་དབང་ཆ་ {#transfer-ownership}

ལག་ལེན་གྱི་དབང་འཛིན་དེ་ ཌོ་མེན་, རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ ཡང་ན་ NFT ལུ་བསྒྱུར་བཅོས་འབད་ཡོདཔ་ཨིན། ད་ལྟོའི་བདག་འཛིན་འདི་ ཚོང་འབྲེལ་གྱི་དབང་འཛིན་སྦེ་ལག་ལེན་འཐབ་དགོ།

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### མེ་ཊ་ཌའི་ཊ་ཚུ་ གཞི་བཙུགས་དང་བཏོན་གཏང་། {#set-and-remove-metadata}

metadata གནས་གོང་འདི་ JSON - serialisable འབད་ནི་ཨིན། ཁྱོད་ཀྱིས་ `TransactionDraft` ལག་ལེན་འཐབ་པའི་སྐབས་ལུ་ `TransactionConfig` ནང་གི་དབང་འཛིན་དེ་ དམིགས་གཏད་རྩིས་ངོ་མ་ལུ་འགྱུར་འོང་།

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

གནས་ཚད་མཐོ་ཤོས་ཀྱི་ གྲོགས་རམ་གྱི་འཆར་གཞི་འདི་ ཌེ་པཱོལ་ཐོག་ལས་ ཚོང་འབྲེལ་དབང་འཛིན་ལུ་ དམིགས་གཏད་བསྐྱེད་དོ་ཡོདཔ་ཨིན།

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### གནས་སྟངས་ངོ་མ་གི་ རྒྱུ་དངོས་ཚུ་ {#real-world-assets}

RWA གྲོགས་རམ་མི་ཚུ་གིས་ རྒྱུ་དངོས་གི་དམིགས་བསལ་གྱི་ metadata, provenance དང་ controller སྲིད་བྱུས་གི་དོན་ལུ་ JSON-serializable payloads ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན། `register_rwa` གིས་ `id` ཡང་ན་ `owner` མ་ལེན་: runtimeགིས་ `RwaId` ཐོན་སྐྱེད་འབད་ཡོདཔ་ད་ ཕྱིར་ཚོང་འཐབ་ནིའི་དབང་འཛིན་དེ་ འགོ་ཐོག་གི་བདག་འཛིན་པ་ལུ་འགྱུར་ནུག

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

ཐོ་བཀོད་གྱི་ཞལ་འདེབས་བཀོད་པའི་ཤུལ་ལས་ `FindRwas`, `/v1/rwas`, RWA བྱུང་རྐྱེན་ཚུ་དང་ ཡང་ན་ ཐོན་སྐྱེད་འབད་མི་ ID འཚོལ་ཞིབ་འབད་ནིའི་ལམ་སྟོན་ཚུ་ལག་ལེན་འཐབ་དགོ།

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

མཐའན་མཇུག་གི་ལཱ་ཚུ་ནང་ལུ་ ཐོན་སྐྱེད་འབད་མི་དེ་ `hash$domain` ID:

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

ཡོངས་ཁྱབ་གནས་སྤེལ་དེ་ `owned_by`ལུ་འགྱུར་བཅོས་འབད་ཚུགས་ཡོདཔ་ཨིན། གནས་སྤེལ་དང་ མཉམ་འབྲེལ་གྱི་ཆ་ཤས་ཚུ་གིས་ ཨ་ལོ་གི་གནས་སྤེལ་ཚུ་འབྱུང་འོང་།

### ཐིག་ཁྲམ་ཚུ་ {#triggers}

འགོ་བཙུགས་ཐོ་བཀོད་གྲོགས་རམ་ཚུ་ ལག་ལེན་འཐབ་ནི་ད་ལྟོའི་ལག་ལེན་འདི་ བརྡ་བཀོད་གི་རིམ་པ་གཞན་ཨིན།

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

Torii འདི་ཡང་ REST ཕྱིར་འབུད་ཀྱི་ཐོ་ཡིག་གི་དོན་ལུ་ རྒྱབ་སྐྱོར་འབད་མི་ཚུ་ལུ་ གསལ་སྟོན་འབདཝ་ཨིན།

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

trigger inventory calls འབད། ཐིག་ཁྲམ་ཚུ་ལྷག་སྟེ་བལྟ་ནི་དང་ བརྟག་དཔྱད་འབད་ནི་རྐྱངམ་གཅིག་ཨིན། ཐོ་བཀོད་འབད་ནི་དང་ བཏོན་གཏང་ནི་ དེ་ལས་ ལོག་བསྒྱུར་བཅོས་འབད་ནི་དང་ ཐོ་བཀོད་ཀྱི་མ་སྤེལ་ནི་ཚུ་ བྱ་རིམ་འགྱུར་ལྡོག་ཅན་ཅིག་ཨིན།

### སྐྱིན་འགྲུལ་བསྐྱོད་དང་ ཟད་འགྲོ་བཏང་ནིའི་བསླབ་བྱ་ཚུ་ {#repo-and-settlement-instructions}

Repoདང་ bilateral settlement helpers གིས་ ལག་ལེན་ཐོག་ལས་བཟོ་མི་ Norito payloads ཚུ་མེད་པར་ domain-specific instruction variants མཐུད་སྦྲེལ་འབདཝ་ཨིན།

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

ག་དེམ་ཅིག་སྦེ་ a Python གྲོགས་རམ་འབད་མི་འདི་ ད་ལྟོ་མ་ཐོན་པར་ཡོདཔ་ལས་ སྟོན་ཐངས་ཀྱི་ བརྡ་དོན་དཔེ་ཚུགས། `InstructionBox` JSON ནང་འཁོད་ལུ་ `Instruction.from_json` ཡང་ན་ ཐད་ཀར་དུ་ `TransactionBuilder.add_instruction_json`. འདི་གི་དོན་ལུ་ གྲོས་ཐག་ཆོད་པའི་ལམ་འདི་ཨིན། `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, འདྲན་འདྲ་/འགན་ཁུར་/NFT ཐོ་བཀོད་དང་ non-trigger ཕྱིར་ཐོ་བཀོད་འབད་མ་བཏུབ་པའི་འགྱུར་ཁྱད་ཚུ་ འདི་གི་དོན་ལུ་ རྒྱབ་སྐྱོར་ཚུ་ ཨེབ་གཏང་མ་འབད་ཚུན་ཚོད་ཨིན།

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

གློག་ཐག་ར་བ་ཚུ་ བསྡུ་བསྒྱོམ་འབད་ནིའི་ལམ་སྟོན་ ཡང་ན་ གསལ་ཏོག་ཏོ་མེད་པའི་ལམ་སྟོན་ཚུ་གི་དོན་ལུ་ མཐུད་སྦྲགས་མ་བཞག་པའི་ཧེ་མར་ JSON ནང་ལས་ཕར་དང་ཚུར་འགྱོ་ནི་:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## ཚོང་འབྲེལ་གྱི་ལཱ་ལམ་ལུགས་ཚུ་ {#transaction-workflows}

ལག་ལེན་འཐབ་ནི་ `TransactionDraft` ལག་ལེན་ནང་ལུ་བཀོད་རྒྱ་མང་རབས་ཅིག་བཟོ་བཀོད་འབད་ཞིནམ་ལས་ ཐོ་བཀོད་མ་འབད་བའི་ཧེ་མར་ འབྲི་ཤོག་ཅིག་གིས་ ཁྱོད་ཀྱིས་ གནད་དོན་གྱི་གནས་ཚད་གི་སྒྲིག་གཞི་ཚུ་ དཔེར་ན་ `ttl_ms`, `nonce`, དང་ metadata གནས་གཅིག་ནང་བཙུགས་ཞིནམ་ལས་ ཐོ་བཀོད་ཚར་གཅིག་འབད་:

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

བསྐྱར་ཞིབ་འབད་ནི་དང་ བསྐྱར་ཞིབ་འབད་ནིའི་དོན་ལུ་ ཡང་ན་དངུལ་ཁུག་སྤྲོད་ནི་གི་དོན་ལུ་ དོ་འགྲན་ཅན་གྱི་ཡིག་གུ་ཅིག་ཕྱིར་བཏོན་:

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

ཐོ་བཀོད་མ་ཚར་བའི་ཧེ་མར་ ཕྲང་ལམ་གྱི་གསང་སྤྱོད་བརྟག་དཔྱད་ཚུ་ བསྡུ་སྒྲིག་འབད་དགོཔ་ཨིན།

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

## དྲི་བཀོད་ཚུ་ {#queries}

ཐོ་བཀོད་ཅན་གྱི་དྲི་བཀོད་གྲོགས་རམ་ཚུ་གིས་ JSON ཚིག་མཛོད་མ་བཟོ་བའི་ཚབ་ལུ་ ཌེ་ཊ་སློབ་རིམ་ཚུ་སླར་ལོག་འབདཝ་ཨིན། ཁོང་འགོ་འདྲེན་འཐབ་ནིའི་ཐབས་ལམ་འཇམ་ཤོས་ཅིག་ཨིནམ་ད་ SDK གིས་ ཁྱོད་ཀྱི་དོན་ལུ་ ཤོག་ལེབ་དང་ཡིག་སྡེབ་ཀྱི་ས་ཁོངས་ཚུ་ བརྟག་ཞིབ་འབདཝ་ཨིན།

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

ཁྱོད་ཀྱིས་ Torii ཚད་མཇུག་གི་ཐིག་ཁྲམ་ནང་ ཐོ་བཀོད་འབད་མི་སྒྲོམ་མེད་པ་ཅིན་ སྤྱིར་བཏང་ཞུ་ཡིག་ལག་ལེན་ཚུ་ ལག་ལེན་འཐབ་དགོ།

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

Account inventory assistants གིས་ SDK གི་ normaliserགིས་ ངོས་འཛིན་འབད་ཡོད་པའི་ account ID དགོཔ་ཨིན། canonical I105 account IDs ཡང་ན་ chain-on aliases ལག་ལེན་འཐབ་། གལ་སྲིད་ block explorer ཡང་ན་ raw endpoint གིས་ ID འདི་ལོག་གཏངམ་ད་ SDK འདི་མ་བཏུབ་པ་ཅིན་ གྲོས་བསྟུན་འབད་ཞིནམ་ལས་ ཌོག་ཊར་ཚུ་འབོ་པའི་ཧེ་མ་ canonical account ID ལུ་ བཏོན་གཏང་དགོ།

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## འབྱུང་རྐྱེན་ཚུ་ {#events}

JSON རྒྱུན་འགྲུལ་འཐབ་མི་ལས་རོགས་འདི་གིས་ ཕན་ཐོགས་ཅན་གྱི་ཅ་ལ་ཚུ་ རྩ་སྒྲིག་འབད་བཏུབ་ཨིན། ཁྱོད་ཀྱིས་ SSE ལས་རིམ་གི་མིང་དང་ ID དགོཔ་ད་ `with_metadata=True` བཏོན་གཏང་། སླར་ཡང་བརྟག་དཔྱད་རྐྱབས། དེ་ལས་ གྲུབ་འབྲས་ཀྱི་ཅ་ལ་ཨེབ་གཏང་འབད། ད་ལྟོའི་དུས་སྟོན་གྱི་ ID བཞག་ནིའི་དོན་ལུ་ `EventCursor` དང་གཅིག་ཁར་ རྒྱུན་འགྲུལ་འབད་ཚུགས། འདི་བཟུམ་གྱི་དཔེ་སྟོན་ཚུ་ ཐད་ཀར་དུ་བྱུང་རྐྱེན་ཚུ་གི་དོན་ལུ་ སྒུག་སྡོད་དོ་ཡོདཔ་ལས་ དེ་ཚུ་ འོས་འབབ་ཅན་གྱི་བྱུང་རྐྱེན་རྒྱུན་འགྲུལ་འཐབ་ཚུགས་ཏེ་ བྱ་བ་སྤྱོད་ཚུགསཔ་བཟོ་ཡོད་པའི་ཨེབ་གཏང་འབད་དགོ།

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

## ཁ་བྱང་དང་ཁ་བྱང་ཚུ་ {#keys-and-addresses}

SDK གིས་ native extension ནང་བཀོད་ཡོད་པའི་ signature algorithm གི་དོན་ལུ་ ས་གནས་ཀྱི་ signing assistants གསལ་སྟོན་འབདཝ་ཨིན། འ་ནི་ assistants ཚུ་གིས་ Taira ལུ་འབོ་མི་མེད་རུང་ they do require the native extension:

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

ཁྱོད་ཀྱིས་ `supported_crypto_algorithms()` ལག་ལེན་འཐབ་སྟེ་ཁྱོད་ཀྱི་འཁོར་ལོའི་ རྒྱབ་སྐྱོར་འབད་མི་འདི་མཐོང་ཚུགས། སྤྱིར་བཏང་གྲོགས་རམ་འདི་ ཀ་ནོ་ནི་ཀཱན་གྱི་ ཨལ་གེ་རི་ཏིམ་གི་མིང་ཐོ་ཚུ་ལག་ལེན་འཐབ་སྟེ་ Ed25519, secp256k1, ML-DSA, GOST, BLS དེ་ལས་ SM2 གི་དོན་ལུ་ལཱ་འབདཝ་ཨིན།

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

### རྒྱ་ཡིག SM ཨེབ་གཏང་ཐིག་ {#chinese-sm-cryptography}

Python SDK གིས་ སྤྱིར་བཏང་གི་ SM2 གྲོགས་རམ་འབད་མི་དང་ SM2 དམིགས་བསལ་གྱི་ ཕན་ཐོགས་ཅན་གྱི་ གྲོགས་རམ་མི་གཉིས་ཆ་ར་ལུ་ གསལ་སྟོན་འབདཝ་ཨིན། མཚམས་འཇོག་འབད་ནིའི་ནུས་ཤུགས་གསལ་སྒྲགས་འདི་ ལག་ལེན་འཐབ་སྟེ་ དམིགས་གཏད་ཐིག་ལེ་གིས་རེ་བ་བསྐྱེད་མི་ SM2 ཁྱད་པར་ཅན་ངོ་རྟགས་འཚོལ་ནིའི་དོན་ལུ་:

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

`crypto.sm.enabled` གིས་ node གིས་ SM བཟའ་ཚང་གི་གློག་རིག་ཚུ་ ངོས་ལེན་འབད་ཡོདཔ་ཨིན་ན་མེན་ཟེར་ གསལ་སྟོན་འབདཝ་ཨིན། འདི་དང་འདྲན་འདྲ་བའི་གསལ་བསྒྲགས་འདི་ནང་ SM hash སྲིད་བྱུས་དང་ མགྱོགས་སྒྲིལ་གནས་སྟངས་ཡང་ཡོདཔ་ཨིན། འདི་གིས་ SM2-specific flows འབད་ནི་ཨིན་ན་མིན་འདུག་གམ་མེད་ཐག་གཅོད་སྐབས་ཕན་ཐོགས་ཅན་ཨིན།

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

མི་མང་ Taira གིས་བརྟག་དཔྱད་འབད་བའི་སྐབས་ལུ་ SM གི་ལྕོགས་གྲུབ་ཀྱི་གསལ་བསྒྲགས་འདི་བཏོན་ཡོདཔ་ཨིན་རུང་ SM གི་རྟགས་བཀོད་དེ་ འདི་ནང་ལུ་ བཀག་ཆ་འབད་ཡོདཔ་ཨིན། ཁོ་གི་བརྡ་སྟོན་ཅན་གྱི་རྟགས་བཀོད་ཨལ་གོར་ཆིམ་འདི་ `ed25519`, `secp256k1`དང་ `bls_normal`ཨིན་མས། འདི་འབདཝ་ལས་ SM2 གིས་ཡི་གུ་བཀོད་མི་ཞལ་འདེབས་ཚུ་ བསྒྱུར་བཅོས་འབད་མ་ཚུགསཔ་ལས་ ལག་ལེན་གྱི་འགན་ཁུར་དེ་ བསྒྱུར་བཅོས་མ་འབད་བར་ བཞག་དགོ།

### GOST དང་ ཀི་བཱེན་ཌའི་ལོག་ལྡེ་མིག་ཚུ་ {#gost-and-post-quantum-keys}

GOST R 34.10-2012 ཚད་འཇལ་ཐངས་དང་ ML-DSA (`ml-dsa`) གི་རྒྱབ་ལས་ ཀི་བཱའིན་ཊ་གི་རྟགས་མཚན་ཚུ་གི་དོན་ལུ་ སྤྱིར་བཏང་ཀིཔཀྲོ་ API ལག་ལེན་འཐབ་ཨིན། Key-pair འདི་བཟུམ་སྦེ་ Signing, Verification, and Multihash Export འདི་ཡང་ལག་ལེན་འབདཝ་ཨིན།

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

Gate GOST དང་ post-quantum flows འདི་ node གི་བརྡ་སྤྲོད་འབད་ཡོད་པའི་ signing algorithms ནང་ལུ་ཨིན། སྔོན་སྒྲིག་འབད་བཏུབ་པའི་ algorithm མིང་གི་དོན་ལུ་ raw capability payload ལག་ལེན་འཐབ་:

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

གལ་སྲིད་ node ཅིག་གིས་ ཁྱོད་ལུ་དགོ་པའི་ algorithm གསལ་བསྒྲགས་མ་འབད་བ་ཅིན་ keyའདི་ local ཡང་ན་ offline workflows གི་དོན་ལུ་རྐྱངམ་གཅིག་ལག་ལེན་འཐབ་དགོ། འདི་གི་དོན་ལུ་ algorithm གིས་ཡིག་གུ་བཀོད་མི་ transactions འདི་ node ལུ་མ་གཏང་། མི་མང་གི་ Taira ཚོད་བལྟ་འབད་བའི་སྐབས་ལུ་ GOST དང་ ML-DSA འདི་ SDK ཀི་རིཊ་གྲོགས་རམ་སྦེ་ ཡར་ཐུག་ལུ་ཡོད་པའི་ Python དཔེ་མཛོད་ནང་ལུ་བཙུགསཔ་ཡོད་རུང་ ཚོང་འབྲེལ་གྱི་རྟགས་བཀོད་འབད་ནིའི་དོན་ལུ་ མཚམས་འཇོག་འབད་མ་ཚུགསཔ་ཨིན་མས།

## Config-Aware Client བཟོ་སྐྲུན་འབདཝ་ཨིན། {#config-aware-client-creation}

ཁྱོད་ཀྱིས་ `resolve_torii_client_config` ལག་ལེན་འཐབ་དོ་ཡོདཔ་ད་ ཁྱོད་ཀྱི་ལག་ལེན་གྱིས་ཡིག་སྣོད་ནང་ལས་ མཚམས་འཇོག་འབད་ཐངས་ཚུ་ ཀློག་སྟེ་ཡོད་རུང་ གནས་སྟངས་དང་ བརྟག་དཔྱད་ལུ་ འབྲེལ་བ་ཡོད་པའི་ ཨེབ་ར་ཌི་ཚུ་ still དགོཔ་ཨིན།

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

## Kagemusha གྲ་སྒྲིག་འབད་ནི་ {#kagemusha-readiness}

Python SDK གིས་ current JSON གྲ་སྒྲིག་གི་ལམ་བརྒྱུད་དེ་ its generic Torii request helper གྱི་ཐོག་ལས་འདྲི་དཔྱད་འབད་ཚུགས།

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

Python གིས་ Kagemusha ཡིག་སྣོད་ལོག་བཏབ་ ཡང་ན་གློག་འཁྱོལ་ཡིག་སྣོད་བཟོ་སྐྲུན་འབད་མི་ཚུ་ལུ་ གསལ་སྟོན་མ་འབད་བས། ཁྱོད་ཀྱིས་ Swift ཡང་ན་ JVM བརྒྱུད་འཕྲིན་ལག་ལེན་འཐབ་སྟེ་ ཀ་ནོ་ནིཀསི་ V4 ཡིག་སྣོད་ཚུ་བཟོ་ཞིནམ་ལས་ རྒྱབ་སྐྱོར་འབད་མི་ Kagemusha Torii ཌེ་བི་ཡཱན་བརྒྱུད་དེ་ དབྱེ་ཞིབ་གཏང་ཚུགས།

## ཐོ་བཀོད་ཚུ་ {#subscriptions}

subscription helpers འདི་ `iroha_python.ToriiClient` གིས་ལག་ལེན་འཐབ་མི་ shared Torii clientལས་ཐོབ་པའི་ ཞབས་ཏོག་གི་ཅ་ལ་ཚུ་འགྱུར་བཅོས་འབདཝ་ཨིན། ཁྱོད་ཀྱིས་དམིགས་གཏད་འབད་མིའི་ཁ་ཐུག་ལུ་ཡོད་པའི་ IDs དང་ assets ལག་ལེན་འཐབ་ཨིན།

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

## འབྲེལ་མཐུད་འབད་ {#connect}

Connect URIs བཟོ་ནི་དང་ བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ Taira གིས་ གསལ་སྟོན་འབད་མི་ མི་མང་གི་ Connect གནས་སྟངས་དེ་ ཀློག་དགོ།

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

Frame codecs དང་ session key འབྱུང་ཁུངས་དང་ session creation འདི་ལུ་ native extension དང་ Connect session route enable དགོཔ་ཨིན།

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

ངོས་ལེན་འབད་བའི་ཤུལ་ལུ་ བརྡ་འཕྲིན་ཚུ་ གནས་སྐབས་ཀྱི་བརྡ་དོན་དང་གཅིག་ཁར་ ཨེབ་གཏང་འབད།

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

## སྲིད་སྐྱོང་, དུས་རྒྱུན་དང་ འཛིན་སྐྱོང་ས་ཁོངས་ཚུ་ {#governance-runtime-and-admin-surfaces}

འ་ནི་ ཀློག་རྐྱང་གི་ཅ་ལ་ཚུ་ མི་མང་ལུ་ Taira ལུ་ལོག་གཏངམ་ད་ གྲུབ་འབྲས་ཐོན་ཡོདཔ་ཨིན།

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

Runtime ཡར་དྲག་གཏང་ནི་གི་ རྒྱབ་སྐྱོར་ཚུ་གིས་ runtime upgrade API གིས་ལག་ལེན་འཐབ་མི་ manifest form ཚུ་ཆ་འཛིན་འབད་དོ་ཡོདཔ་ཨིན། འདི་གི་དོན་ལུ་ operator actions འདི་འབདཝ་ལས་ཁྱོད་ཀྱི་རྩིས་ཁྲ་དང་ tokens ཆ་འཇོག་གྲུབ་ཡོད་པའི་ node གི་ཐད་ལུ་རྐྱངམ་གཅིག་ ལག་ལེན་འཐབ་ཨིན།

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

## གནས་གོང་དང་ གྲོས་འཆམ་ དེ་ལས་ འགྲུལ་འཕྲིན་འཕྲུལ་ཆས་ཚུ་ {#status-consensus-and-network-telemetry}

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

## SoraFS, UAID དང་ Kaigi གྲོགས་རམ་འབད་མི་ {#sorafs-uaid-and-kaigi-helpers}

གྲོགས་རམ་འདི་ དམིགས་གཏད་གྱི་ཨེབ་ཐག་འདི་གིས་ Nexus/SORA ཚད་མཇུག་གི་སྒོ་ཚུ་བཏོན་པའི་སྐབས་ལུ་ ལག་ལེན་འཐབ་ཚུགསཔ་ཨིན། ཐོ་བཀོད་མེད་པའི་ཐོ་ཡིག་འདི་ ཆ་གནས་ཅན་གྱི་ལན་ཅིག་སྦེ་བརྩི་དགོ། མི་མང་གིས་ Taira གིས་ ལམ་དེ་ བརྟག་ཞིབ་ལག་ཁྱེར་ ཡང་ན་ UAID གི་དོན་ལས་ བརྡ་བཀོད་མེད་པར་བཟོ་བཅོས་འབད་འོང་།

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

## Norito RPC དང་ GPU གྲོགས་རམ་འབད་མི་ {#norito-rpc-and-gpu-helpers}

ཁྱོད་ཀྱིས་ `NoritoRpcClient` ལག་ལེན་འཐབ་པའི་སྐབས་ ཁྱོད་ཀྱིས་ Norito བའི་ཊི་ཚུ་ཡོད་པའི་ཁར་ ཌའི་ལོག་གི་མཐའ་མཚམས་ (endpoint) Torii ལུ་འབོ་དགོཔ་ཨིན། དཔེ་འདི་ སྔོན་བྱོན་གྱི་ཅ་ཆས་བཟོ་རྣམ་ནང་ལས་ ཐོ་བཀོད་འབད་ཡོད་པའི་ཁེབས་ཅིག་ དགོཔ་ཨིན་མས།

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

CUDA གྲོགས་རམ་མི་ཚུ་གིས་ backend མ་ཐོབ་པའི་སྐབས་ལུ་ `None` སླར་ལོག་འབདཝ་ཨིན། འདི་འབདཝ་ལས་ applications ཚུ་ scalar implementations ལུ་ལོག་འགྱོ་ཚུགས།:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## ད་ལྟོའི་ཁེ་ཕན་ {#current-coverage}

Python SDK གིས་ ད་ལྟོའི་བར་ན་ཡང་ རྒྱབ་སྐྱོར་འབད་མི་ཚུ་ཡང་ ཡོདཔ་ཨིན།

- Torii བཏང་ཐོ་བཀོད་, གནས་གོང་, དྲི་བཀོད་དང་ འཛིན་སྐྱོང་ཐོ་བཀོད།
- ISI དང་ ཌོ་མ་ནེསི་རྐྱང་གི་ཁྱབ་སྒྲགས་ཚུ་གི་དོན་ལུ་ བརྡ་བཀོད་བཀོད་བཟོ་སྐྲུན་འབད་མི་ཚུ་
- ཚོང་འབྲེལ་གྱི་འཆར་གཞི་ཚུ་དང་ འཛིན་སྐྱོང་ཡིག་ཆ། ཐོ་བཀོད་དང་མིང་ཐོ་བཀོད་འབད་མི་ ཚོང་འབྲེལ་གི་ཁེབས་ཀྱི་ ལཱ་འབད་ཐངས་
- གློག་ཐག་ར་བ་གི་བྱུང་རྐྱེན་དང་ ཕི་ལཱཊར་ཚུ་ དེ་ལས་ ལོག་སྤྱོད་འབད་ཚུགས་པའི་ ཀུར་སོར་ཚུ་
- སྤྱིར་བཏང་ Kagemusha གྲ་སྒྲིག་འབད་ནིའི་གོ་སྐབས་དང་ Torii subscription assistants; typeed top-up and redemption builders are not exposed.
- རྩིས་ཁྲ་གི་ཁ་བྱང་། ཨལ་ག་རི་ཏེམ་ཡོངས་འབྲེལ་གྱི་བརྡ་དོན་འབྲི་སའི་ལས་བྱེདཔ་ཚུ། མང་ཤོས་ཀྱི་ཧེཤ་དང་ ཕར་དང་ཚུར་ འགྲོ་འགྲུལ་འབད་ SM2, GOST, ML-DSA, BLS དེ་ལས་ གསང་བའི་ལྡེ་མིག་ལག་ལེན་འཐབ་ཐབས།
- URIs མཐུད་སྦྲེལ་འབད་ཐབས། གྲོས་བསྡུར་ཚུ་, ཐེམ་ཕེརམསི་, ཨེབ་གཏང་ནིའི་རོགས་དང་ ཐོ་བཀོད་འཛིན་སྐྱོང་པ་
- གཞུང་སྐྱོང་, runtime upgrade, Sumeragi, node-admin, SoraFS, UAID,དང་ Kaigi ཚད་མཇུག་གི་སྒོ་སྒྲིག་ཚུ་ནང་ལུ་ node གིས་ཁྱད་ཆོས་འདི་གསལ་སྟོན་འབད་ཡོདཔ་ཨིན།

## གཙོ་རིམ་གོང་མའི་ཁ་བྱང་ཚུ་ {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

འ་ནི་ཡིག་སྣོད་ཚུ་ སྒྲིག་འཇུག་གི་གནས་སྟངས་ནང་ Python གྱི་མཐར་ཐུག་ལུ་ བདེན་ཁུངས་ཀྱི་འབྱུང་ཁུངས་ཨིན།
