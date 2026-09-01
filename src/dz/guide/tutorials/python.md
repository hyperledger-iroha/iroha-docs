---
translation_locale: dz
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: human-reviewed
---
# Python {#python}

ཡར་ཐུག་ལུ་ལཱ་འབད་སའི་ས་ཁོངས་ནང་ལུ་ Python SDK འདི་ `iroha-python`ཨིན། དང་པ་ར་ Iroha 3 པར་སྐྲུན་འབད་ནི་འདི་གིས་ ད་ལྟོའི་ Torii དང་ Norito ས་ཁུདཔ་ཚུ་ལུ་ དམིགས་གཏད་བསྐྱེད་དོ་ཡོདཔ་ཨིན། ཁྱོད་ཀྱིས་མཉམ་འབྲེལ་འབད་བའི་ཐོག་ལས་ལག་ལེན་འཐབ་མི་ ཕབ་ལེནཌ་གི་འགྱུར་སྒྲིག་ ཡང་ན་ གཞི་རྟེན་བསྐྱར་བཅོས་འདི་ ཨེབ་གཏང་འབད། དེ་བཟུམ་སྦེ་ SDK དང་ མཚམས་སྦྱོར་དེ་ ཀི་རིཌ་བཟོ་རིམ་བསྐྱར་བཅོས་ཅིག་ཁར་སྡོད་འོང་།

གནད་དོན་ངོ་མ་འདི་ Taira ཌའི་ལོག་གི་ཁ་ཐུག་ལས་ `https://taira.sora.org` ལུ་ཨིན། རུ་ཊི་དེ་ལྷག་ཐངས་རྐྱངམ་ཅིག་འབད་ཚུགས་ནི་ཨིནམ་མ་ཚད་ འདི་ཡང་ ཀན་ནོ་ཀཱན་གྱི་རྩིས་ཐོ་དང་ ཡང་ཅིན་ ཡོངས་འབྲེལ་འཛིན་སྐྱོང་པ་ཚུ་གི་མིང་རྟགས་ཚུ་ དགོས་མཁོ་ཅན་ཨིན། དཔེ་ཆ་དེ་ཚུ་སོ་སོར་སྦེ་བཀོད་ཡོདཔ་ཨིན། བསྒྱུར་བཅོས་འབད་ནིའི་དཔེ་གཞི་འདི་ ཕྱིར་ཚོང་གི་ ཐོ་བཀོད་དང་འབྲེལ་བའི་ གནད་དོན་ཚུ་ཨིན། འདི་གི་དོན་ལུ་ ཁྱད་ལྡན་ Taira དབང་ཚད་, སྒེར་གྱི་ལྡེ་མིག་, རྩིས་ཐོ་སྤྲོད་ནི་གི་དམིགས་གཏད་, གྲུབ་འབྲས་བརྟག་དཔྱད་ (བརྟག་དཔྱད་དྲ་རྒྱ) ལེ་ཤ་ XOR དེ་ལས་ དམིགས་གཏད་ལམ་གྱིས་ དགོས་མཁོ་ཅན་གྱི་ བདེན་ཁུངས་དེ་ བཏང་དགོཔ་ཨིན།

དཔེ་མཚོན་ཚུ་གོ་རིམ་འདི་ནང་ལག་ལེན་འཐབ།

|རིམ་པ་ |Taira མི་མང་གི་རྒྱབ་འགལ་ནང་འགྲན་བསྡུར་རྐྱབ་ནི་? |ཁྱོད་ལུ་དགོ་མི་འདི་|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|རྣམ་རྟོག་ཅན་ཚུ་གིས་ ཀློག་ཐེངསམ་ཨིན།|ཨིན་ལགས་ |Python ཆ་ཚན་དང་ མཐུད་འབྲེལ་ཐོ་བཀོད་འབད་ |
|རྩིས་ཐོ་དང་ ལག་ལེན་པ་གིས་ བདེན་ཁུངས་བསྐྱེལ་ཐངས་ཚུ་ |ཁྱོད་རང་གི་ངོ་རྟགས་ངོ་མ་ལུ་ཆ་བཞག་པ་ཅིན་རྐྱངམ་གཅིག་ཨིན།|འདི་བཟུམ་སྦེ་ Taira `NetworkId`དང་འབྲེལ་བའི་རྩིས་ཐོ་ཡང་ན་ ལས་འཛིན་གྱི་ལྡེ་མིག་ཚུ་ |
|ས་གནས་ཀྱི་བརྡ་བཀོད་དང་བསླབ་བྱ་བཟོ་མི་ |`submit()`ཚུན་ཚོད་ འགྲུལ་འཕྲིན་ཁ་ཐོ་བཀོད་འབད་ནི་མེད། |ནང་སྐྱེས རྒྱ་བསྐྱེད དང་ ཁྱོད་ཀྱི་གཙོ་ཅན་རྫས་ |
|བསྒྱུར་བཅོས་ཀྱི་ཞལ་འདེབས་དང་ ཞབས་ཏོག་གི་ཅ་ལ་ཚུ་|ཁྱོད་རང་གི་རྩིས་ཐོ་ནང་ལས་རྐྱངམ་ཅིག་ དངུལ་བཏོན་ཚུགས།|ཁྲལ་འཛིན་སྐྱོང་གི་རྩིས་ཐོ་, སྒེར་གྱི་ལྡེ་མིག་, ངོ་མ་ Taira `NetworkId`, ཐོ་བཀོད་ཅན་གྱི་གླ་ཆ་ཀྱི་དམིགས་གཏད་, གླ་འཐུས་དངུལ་ཀྲམ་ལྷག་ལུས་དང་ རྒྱང་བསྒྲགས་ལམ་རྟགས་ཚུ་ |
|སྒྲིག་གཞི་ ཨང་སྒྱུར་ཚུ མཐུད་སྦྲེལ་, གསང་བཟོ, དང་ GPU གྲོགས་རམ་ |ས་གནས་རྐྱངམ་གཅིག་ |ནང་སྐྱེས རྒྱ་བསྐྱེད; GPU གྲོགས་རམ་འབད་མི་ཚུ་ལུ་ཡང་ CUDA-ནུས་ཅན་ རྒྱབ་རིམ དགོཔ་ཨིན། |

## སེལ་འཐུ་འབད། {#install}

སྦ་སྒོའི་བརྡ་དོན་གྱི་མིང་འདི་ `iroha-python`ཨིན། ཁྱོད་ཀྱིས་མ་བཙུགས་པའི་ PyPI གཞི་བཙུགས་འབད་མི་དེ་ Taira ཕྲང་ལམ་ངོ་མ་ལུ་ འོས་འབབ་ཡོདཔ་སྦེ་མ་བཟོ། ཁྱོད་ཀྱི་མཐུན་རྐྱེན་གི་དམིགས་གཏད་ཚུ་གོང་འཕེལ་འགྱུར་བཅོས་ནང་ལས་བཟོ་ཡོད་པའི་ འཁོར་ལོ་ཡང་ན་འབྱུང་ཁུངས་ལག་ལེན་སྒྲིག་གཞི་བཙུགས་འབད།:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

ཁྱོད་ཀྱིས་ ལས་འགུལ་འདི་ ཡར་ཐུག་ལུ་ལཱ་འབད་སའི་ས་སྒོ་ཚུ་ ཐད་ཀར་དུ་ལག་ལེན་འཐབ་པ་ཅིན་ Python འབྲེལ་བ་གཞི་བཙུགས་འབད་ཞིནམ་ལས་ ཡུལ༌མི༌ དར་ཁྱབ་ བཟོ་ནི་དེ་ ལག་ལེན་འཐབ་པའི་ཧེ་མར་ `Instruction`, `TransactionDraft`, མིང་རྟགས, གསང་བཟོ, SoraFS ཡུལ༌མི༌ རོགས་པ་ཚུ, GPU རོགས་པ་ཚུ, ཡང་ན་ མཐུད་སྦྲེལ བཀོད་ཁྲམ་ ཨང་སྒྱུར་ཆས ལག་ལེན་འཐབ་མི་དཔེ་སྟོན་ཚུ་ལག་ལེན་འཐབ་དགོ། ཡར་ཐུག་ལུ་ `python/iroha_python/README.md` ལས་བཟོ་གོང་གི་བཀའ་རྒྱ་ལག་ལེན་འཐབ་ཞིནམ་ལས་ ཡུལ༌མི༌ ཕྱིར་འདྲེན ཚུ་འཇུག་ཐངས་འདི་ བརྟག་དཔྱད་འབད་:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

གལ་སྲིད་ `create_torii_client` ནང་འདྲེན་འབད་རུང་ `Instruction` ཡང་ན་ `generate_ed25519_keypair` འདི་མ་གྲུབ་པ་ཅིན་ ཕབ་ལེནམ་གཙང་མའི་ Python ཨིན། དེ་འབདཝ་ད་ ནང་སྐྱེས རྒྱ་བསྐྱེད འདི་མེད་འོང་།

## མགྱོགས་མྱུར་འགོ་འཛུགས། {#quickstart}

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

བསྒྱུར་བཅོས་འབད་ཐངས་ཚུ་གི་དོན་ལུ་ འ་ནི་ གཞི་སྒྲིག་འདི་ལག་ལེན་འཐབ་ སྦྲེལ་མཐུད་འབད་ཐངས་འདི་མ་བཙུགས་པའི་ཧེ་མར་ ས་གནས་འཛིན་པ་རེ་ལུ་ Taira དབང་འཛིན་, སྒེར་གྱི་ལྡེ་མིག་, ཐོ་ཀིན་དང་ རྒྱུ་དངོས་/རྩིས་ཐོ་ IDs སྦེ་བགོ་བཀྲམ་འབད་དགོ།

`authority` ཚོང་འབྲེལ་གྱི་མིང་རྟགས་བཀོད་མི་རྩིས་དེ་ཨིན། `private_key` འདི་དང་བསྟུན་འབད་དགོཔ་ཨིན། འབྲེལ་བ་འཐབ་ནི་ཚུ་ Taira ཡོངས་འབྲེལ་འབྱུང་ཁུངས་ལས་ འབྱུང་ཡོདཔ་ཨིན། `NetworkId`; ལྕགས་ཐག་ UUID ཐོ་བཀོད་གི་མིང་ཐོ་འདི་ ལག་ལེན་གྱི་ངོ་རྟགས་མེན་ དངུལ་སྤྲོད་ཀྱི་དམིགས་ཡུལ་དང་ ཕྲང་བའི་གནས་གོང་ཚུ་ལག་ལེན་འཐབ་ཨིན། རྩིས་ཐོ་དང་ལྡནམ་སྦེ་ གནས་སྡུད་འཛིན་བཟུང་ འོག་གི་ཤོག་ལེབ་ཚུ་ དམིགས་བསལ་དུ་ ཆ་མེད་བཏང་ཡོདཔ་ལས་ དེ་ཚུ་ རྐྱེན་ངན་གྱི་ཐོག་ལས་ བཏང་མི་ཨིན།

འོག་གི་ཡི་གུ་འདི་ ད་ལྟོའི་ལྡེ་མིག་ Taira ཇི་ནེསི་སི་གི་ངོ་རྟགས་ཨིན། བརྟག་དཔྱད་སླར་སྒྲིག་འདི་གིས་ འདི་ལུ་བསྒྱུར་བཅོས་འབད་ཚུགས། འདི་འབདཝ་ལས་ ཐོ་བཀོད་ཅན་གྱི་ལག་ལེན་འཐབ་ནིའི་ཡིག་གཟུགས་ནང་ལས་ གསར་བསྐྲུན་འབད། དེ་ལས་ UUID ལྕགས་ཐག་ལས་གཏན་འབེབས་མ་འབད་བར་བཞག་དགོ།

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

`Instruction.*` གིས་བཟོ་ནིའི་བསླབ་བྱ་གི་ནང་དོན་གནད་སྡུད་གྱི་ཅ་ལ་ཚུ་རྐྱངམ་གཅིག་འབོ་ཨིན། `submit()` འདི་ SDK གིས་ ཕྲང་བའི་གླ་སྤྲོད་ལེན་འབད་ཞིནམ་ལས་ ཐོ་བཀོད་ཅན་གྱི་ནང་དོན་གནད་སྡུད་ཀྱི་ཅ་ལ་གུ་ མཚན་རྟགས་བཙུགས་ཏེ་ Torii ལུ་བཏང་ཞིནམ་ལས་ གནས་སྟངས་ཅིག་གི་དོན་ལུ་བསྒུག་བཞགཔ་ཨིན།

## ཁྲལ་དང་ གློག་སྣུམ་གྱི་འཐུས་ {#fees-and-gas}

ཡིག་འབྲུ་གི་ཞལ་འདེབས་འདི་ `FeePaymentIntent` དང་ དངུལ་ཕོགས་སྤྲོད་མི་ཁྲལ་གྱི་ རྒྱུ་དངོས་ལྷག་ལུས་ཅིག་ དགོཔ་ཨིན། Taira ལུ་, མི་མང་བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་དངུལ་བརྟག་དཔྱད་ དྲ་རྒྱ XOR ཨིན། Python SDK གིས་གཏན་འཁེལ་འབད་མ་ཚུགས་པའི་བརྡ་འཕྲིན་ཚུ་གཏང་འོང་། ཟད་འགྲོ་བཏང་མི་ཁྲལ་གྱི་ཐོ་ཡིག་འདི་ Torii ལུ་བཙུགས་ཞིནམ་ལས་ ཏི་རུ་སྤྲོད་མི་ ཡང་ན་ ཏི་རུ་འབག་མི་ཁྲལ་དེ་ བསྒྱུར་བཅོས་འབད་མ་ཚུགསཔ་སྦེ་ ངོས་འཛིན་འབད་ཞིནམ་ལས་ ཐོ་བཀོད་འབད་ཡོད་པའི་དམིགས་དོན་ལུ་ མཚན་རྟགས་རྐྱབས་ཨིན། དངུལ་རྩིས་ཀྱི་གདམ་ཁ་དེ་ ཕྱིར་ཚོང་གི་ གནད་སྡུད་ཚུ་ནང་མ་བཙུགས་པར་བཞག་དགོ།

གོང་འཁོད་ཀྱི་ `submit()` གྲོགས་རམ་འདི་ དབང་ཚད་སྤྲོད་ཡོད་པའི་ དམིགས་ཡུལ་དང་གཅིག་ཁར་འགོ་བཙུགསཔ་ཨིན་ དེ་གི་གླ་ཆ་ཚད་གཞི་ཚུ་ བསམ་ཞིབ་འབད་དེ་སྟོངམ་ཨིན། `quote_and_sign()` གིས་ མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་ ཐད་རི་བ་རི་ ཚིག་བརྗོད་ལས་ བཀངམ་ཨིན།

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

འབྲི་ཤོག་ཚུ་བཏང་བའི་ཧེ་མར་ དབང་འཛིན་གྱི་རྩིས་ཐོ་ལུ་ འཐུས་དངུལ་གྱི་རྒྱུ་དངོས་ལྡང་ངེས་ཡོད་མི་འདི་ བརྟག་ཞིབ་འབད། བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་དང་རྒྱུ་དངོས་ ID འདི་འབྲེལ་མཐུད་རེ་རེར་ཁྱད་པར་ཡོདཔ་ཨིན། འ་ནི་འདི་ Taira བཟོ་བཀོད་ཨིན།

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

བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་འདི་གིས་ ལྷག་ལུས་ཞིབ་དཔྱད་ཀྱི་དོན་ལུ་ལག་ལེན་འཐབ་ནི་ལུ་ ངེས་གཏན་ `asset_id` སླར་ལོག་འབདཝ་ཨིན། དངོས་ཡོད་ཚིག་བརྗོད་ཀྱི་གླ་ཆ་ `FEE_ASSET_DEFINITION` བདེན་དཔྱད་འབད། བརྗེ་སོར་འདི་གིས་ མེ་ཊ་ཌེ་ཊ་བརྒྱུད་དེ་ རྒྱུ་དངོས་དེ་སེལ་འཐུ་མི་འབད།

གློག་རིམ་མེ་ཊ་ཌེ་ཊ་འདི་གདམ་ཁ་ཅན་ཨིནམ་དང་ འཐུས་ཡིག་བརྡ་མེདཔ་ཨིན།

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

ཁྱོད་ཀྱིས་ འཐུས་ཀྱི་ དམིགས་ཡུལ་འདི་ བཏོན་བཏང་པ་ཅིན་ རེ་བ་མེད་པའི་རྒྱུ་དངོས་ཅིག་གི་དོན་ལུ་ ཚིག་བརྗོད་ཅིག་ ངོས་ལེན་འབད་བ་ཅིན་ ཚིག་བརྗོད་བཀོད་པའི་ཤུལ་ལས་ དངུལ་ཕོགས་འདི་ བསྒྱུར་བཅོས་འབད་བ་ཅིན་ ཡང་ན་ མ་དངུལ་མེད་པའི་རྩིས་ཐོ་ཅིག་དང་གཅིག་ཁར་ མཚན་རྟགས་བཀོད་པ་ཅིན་ ཚོང་འབྲེལ་འདི་ བཙུགས་མི་ཆོག།

## མིང་མ་ཤེསཔ་ Taira ཀློག་ཐེངས། {#anonymous-taira-reads}

བརྒྱུད་འཕྲིན་འདི་ཚུ་གིས་ Taira ཕྲང་ལམ་ཚུ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ད་ ཡིག་སྡེབ་ཀྱི་མཐའ་མཚམས་ལུ་ མིང་མ་ཤེསཔ་སྦེ་ ཀློག་ཐེངསམ་ཨིན།

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

`/v1/time/status` དང་ `/v1/sumeragi/*` བཀོལ་སྤྱོད་པའི་དུས་ཚོད་ཀྱི་གནད་སྡུད་མཐོང་སྣང་རེ་རེ་ལུ་ གནས་སྟངས་འགྱུར་བཅོས་མ་འབད་རུང་ ཡོངས་འབྲེལ་བཀོལ་སྤྱོད་པའི་མིང་རྟགས་ངེས་བདེན་དགོཔ་ཨིན། མིང་མེད་མཛུབ་གནོན་གནས་རིམ་ནང་དོན་གནད་སྡུད་དང་ མོས་མཐུན་ཡང་ན་མཛུབ་གནོན་-ཉེ་གནས་ཆུ་ཚོད་བརྟག་དཔྱད་ཀྱི་དོན་ལུ་ འོག་གི་བཀོལ་སྤྱོད་གཞི་སྒྲིག་གི་དོན་ལུ་ `request_json("GET", "/status")` ལག་ལེན་འཐབ། མཐུད་ལཱ་ཡུན་གནས་ཚད་འདི་ མཐུན་འབྲེལ་ལམ་ལུགས་སོ་སོ་ཅིག་ཨིནམ་དང་ ལཱ་ཡུན་དེ་གི་འཛིན་སྐྱོང་བརྡ་མཚོན་དགོཔ་ཨིན།

## རིག་རྩལ་བཟོ་སྐྲུན་འབད་མི་ {#instruction-builders}

SDK གིས་ སྤྱིར་བཏང་གི་བརྡ་སྟོན་གྱི་བཟའ་ཚན་ཚུ་གི་དོན་ལུ་ ཐོ་བཀོད་ཅན་གྱི་བཟོ་སྐྲུན་འབད་མི་ཚུ་དང་ JSON གི་ཐར་ཐུབས་ཀྱི་སྒོ་ར་སྒོ་འདི་ ཧེ་མ་ལས་རིམ་འགོ་དང་པ་ Python ཟེར་མི་ཐབས་ལམ་ཚུ་མེན་པའི་དོན་ལུ་བཏོན་ཡོདཔ་ཨིན། འ་ནི་ཤོག་ལེབ་ཚུ་ བསྒྱུར་བཅོས་འབད་མི་ བྱ་སྟབས་མ་བདེཝ་ཚུ་ཨིནམ་ལས་ ངོས་ལེན་རྩིས་མེད་སྦེ་ མི་མང་ལུ་ Taira ལུ་བཙུགས་མི་ཨིན།

ཐོ་བཀོད་ཅན་གྱི་བརྡ་སྟོན་འདི་ ལག་ལེན་འཐབ་ནི་དེ་ ལེགས་ཤོམ་ཨིན། Python ཚད་གཞི་ཚུ་ རང་བཞིན་གནས་གོང་བཟོ་སྟེ་ཡོད་མི་ཚུ་དང་ མ་བདེན་པའི་རྣམ་གཞག་ཚུ་ ཧེ་མ་ལས་མ་གྲུབ་པར་འགྱོ་དོ་ཡོདཔ་ཨིན། ཁྱོད་ཀྱིས་ `Instruction.from_json` འདི་ལག་ལེན་འབད་དགོཔ་ད་རྐྱངམ་གཅིག་ ཁྱོད་ཀྱིས་ བརྡ་སྟོན་གྱི་རྣམ་འགྱུར་ཅིག་ དགོས་མཁོ་ཡོདཔ་ཨིན་རུང་ ད་ལྟོ་ཡང་ Python རྒྱབ་སྐྱོར་མེད་པ་ཅིན་ ལག་ལེན་འཐབ་ཚུགས།

|སློབ་སྟོན་གྱི་བཟའ་ཚང་ |Python ས་ཁོངས།|
| | ------------------------------------------------------------------------------------------- ------------------------------------------------------------------------------ |
| ཐོ་བཀོད་འབད། | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` འདི་ རིགས་མཚན་/བུཊི་སི་ཊརཔ་ལག་ཆས་ཚུ་གི་དོན་ལུ་ བཀག་བཞག་ཡོདཔ་ཨིན། |
| ཐོ་བཀོད་འབད་མ་བཏུབ། | `unregister_trigger`; དབྱེ་བ་གཞན་ཚུ་གི་དོན་ལུ་ `Instruction.from_json` ལག་ལེན་འཐབ། |
| མིན་ཊི་/བརན་ | `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
|བསྒྱུར་བཅོས་ |`transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
| མེ་ཊ་ཌེ་ཊ་དང་ཚད་འཛིན་ཚུ་ | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
| RWA མི་ཚེ་འཁོར་རིམ། | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
|ExecuteTrigger |`execute_trigger` |
|གནས་སྤོ་/གནས་སྤོ་ཚུ་ རྒྱ་སྐྱེད་འབད་ནི།|`repo_initiate`, `repo_unwind`,`repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|ནང་སྐྱེས རྒྱུ་དངོས་བཀག་སྡོམ་ཚུ་ |`open_asset_lock`, `drawdown_asset_lock`,`cancel_asset_lock`, `expire_asset_lock` དེ་ལས་རྒྱབ་སྐྱོར་འབད་མི་མགྲོན་པ་ `*_and_wait` |
|གནང་བ་སྤྲོད/ཕྱིར་བསྡུ, SetParameter, དྲན་ཐོ, རང་སྒྲིག, རིམ་སྤར དེ་ལས་ ཐོ་བཀོད་འབད་མ་བཏུབ་པའི་ འདྲ་བཤུས་ཚུ་ |`Instruction.from_json` ཡང་ན་ `TransactionBuilder.add_instruction_json` དང་གཅིག་ཁར་ ཚད་ལྡན་གྱི་ `InstructionBox` JSON |

ཆ་ཚན་གྱི་རྣམ་ཐངས་ཀྱི་ གནས་སྟངས་ཅན་གྱི་སྤྲོད་ལེན་ཚུ་གི་དོན་ལུ་ [རང་སའི་རྒྱུ་དངོས་བཅོལ་ཉར](/dz/blockchain/escrow.md#python-asset-locks) ལུ་གཟིགས་དགོ། Python གིས་ ད་རེས་ནངས་པར་ ཨང་དང་པ་གི་རོགས་རམ་འབད་མི་ཚུ་ལུ་ སྤྱིར་བཏང་ནོར་རྫས་བཀག་སྡོམ་འབད་ནི་གི་ གོ་སྐབས་བྱིན་དོ་ཡོདཔ་ཨིན། ཚོང་ལམ་དང་མིང་མ་ཤེསཔ་གི་སྦ་སྒོའི་རོགས་རམ་འབད་མི་ཚུ་ ད་ལྟོ་ཡང་ ཨང་དང་པ་ཨིན་མི་ ཐབས་ལམ་ཚུ་ Python ཨིན་མས།

### མངའ་ཁོངས གཞི་བཙུགས་འབད་ དེ་ལས་རྩིས་ཐོ་དང་ རྒྱུ་དངོས་ཚུ་ ཐོ་བཀོད་འབདཝ་ཨིན། {#set-up-domains-then-register-accounts-and-assets}

སྤྱིར་བཏང་ མངའ་ཁོངས བཟོ་སྐྲུན་འདི་ གསལ་བསྒྲགས་ཅན མིང་གཞན འཆར་བཀོད་པ གྱི་ཐོག་ལས་འགྱོ་དོ་ འདི་གིས་འབད་ SNS ཁང་གླ་དང་ ཇོ་བདག་གི་ལྕོགས་གྲུབ་ ཚད་འཛིན་སྲུང་སྐྱོབ་ དེ་ལས་ ས་ཁོངས་ཀྱི་གནས་སྟངས་ཚུ་ གཅིག་ཁར་བརྟག་དཔྱད་འབད་ཡོདཔ་ཨིན། གསང་བའི་ཐོག་ལས་ `AliasSetupPlanRequestV1` ཁྱོད་ཀྱི་འཆར་གཞི་ SDK ཡང་ན་ འཛུལ་ཞུགས་ཞབས་ཏོག་དང་ཕྱདཔ་ད་ལག་ལེན་འཐབ་ `iroha app alias setup plan` དང་ `iroha app alias setup apply`. བཏང་མི་དགོ་ `Instruction.register_domain` ལས་འགུལ་གྱི་ལག་ལེན་ལས་ཨིན། འདི་བཟོ་མི་དེ་ འགོ་ཐོག/འགོ་སྒྲིག ལག་ཆས གི་དོན་ལུ་ར་ བཞག་ཡོདཔ་ཨིན།

ཌོ་མེན གཞི་བཙུགས་འཆར་གཞི་དེ་ བརྩོན་ཤུགས་བསྐྱེད་པའི་ཤུལ་ལས་, ཌོ་མེནགྱི་དབང་འོག་གི་དངོས་རྫས་ཚུ་ ཐོ་བཀོད་འབད། Taira བཟུམ་ཅིག་སྦེ་བགོ་བཤའ་རྐྱབ་མི་དྲ་ལམ་ནང་ལུ་ ཁྱོད་ཀྱིས་ཐོབ་ཡོད་པའི་ ཌོ་མེན་དང་་རྩིས་མིང་སྟོང་འདི་ལག་ལེན་འཐབ་དགོ།

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

`mintable` གིས་ གནད་སྡུད་དཔེ་ཚད་ཀྱིས་ངོས་ལེན་འབད་མི་ `Infinitely`, `Once`, `Not`, ཡང་ན་ `Limited(n)` གནས་གོང་ཚུ་ངོས་ལེན་འབདཝ་ཨིན། བཀག་ཆ་མེད་པའི་ཨང་གྲངས་རྒྱུ་དངོས་ཅིག་གི་དོན་ལུ་ `scale` བཏོན་གཏང་།

### བཟོ་སྐྲུན་འབད་ནིའི་ རྒྱུ་དངོས་དང་ ཅ་ཆས་ཚུ་ {#mint-burn-and-transfer-assets}

འབོད་བརྡ་འདི་ཚུ་གིས་ ད་ལྟོ་ཡོད་པའི་རྒྱུ་དངོས་ཨའི་ཌི་ཅིག་ལག་ལེན་འཐབ་ཨིན། དང་པ་ རྒྱུ་དངོས་ངེས་ཚིག་འདི་ཐོ་བཀོད་འབད་ཞིནམ་ལས་ རྒྱུ་དངོས་འདི་གི་བདག་དབང་འབད་མི་རྩིས་ཐོ་གི་དོན་ལུ་ ངེས་གཏན་རྒྱུ་དངོས་ཨའི་ཌི་འདི་བཟོ་བསྐྲུན་འབད།

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

མེ་ཊ་ཌེ་ཊ་གནས་གོང་ཚུ་ JSON-རིམ་སྒྲིག་འབད་བཏུབ་དགོ། ཁྱོད་ཀྱིས་ `TransactionDraft` ལག་ལེན་འཐབ་པའི་སྐབས་ `TransactionConfig` ནང་གི་གནང་བ་གཙོ་བོ་འདི་ སྔོན་སྒྲིག་དམིགས་གཏད་རྩིས་ཐོ་ལུ་འགྱུརཝ་ཨིན།

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

མཐོ་རིམ་ཟིན་བྲིས་གྲོགས་རམ་པ་གིས་ སྔོན་སྒྲིག་གིས་ བརྗེ་སོར་དབང་འཛིན་ལུ་དམིགས་གཏད་འབདཝ་ཨིན།

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

### གནས་སྟངས་ངོ་མ་གི་ རྒྱུ་དངོས་ཚུ་ {#real-world-assets}

RWA གྲོགས་རམ་འབད་མི་ཚུ་གིས་ རྒྱུ་དངོས་དམིགས་བསལ་གྱི་མེ་ཊ་ཌེ་ཊ་དང་ འབྱུང་ཁུངས་ དེ་ལས་ ཚད་འཛིན་སྲིད་བྱུས་ཚུ་གི་དོན་ལུ་ JSON རིམ་སྒྲིག་རུང་བ ནང་དོན་གནད་སྡུད་ཚུ ལག་ལེན་འཐབ་ཨིན། `register_rwa` གིས་ `id` ཡང་ན་ `owner` ངོས་ལེན་མི་འབད་: རན་ཊའིམ་གྱིས་ `RwaId` བཟོ་བཏོན་འབདཝ་ཨིནམ་དང་ བརྗེ་སོར་དབང་འཛིན་འདི་ འགོ་ཐོག་ཇོ་བདག་ལུ་འགྱུརཝ་ཨིན།

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

ཐོ་བཀོད་ཚོང་འབྲེལ་ཁས་བླངས་འབད་བའི་ཤུལ་ལས་ `FindRwas`, `/v1/rwas`, RWA བྱུང་ལས་ ཡང་ན་ འཚོལ་ཞིབ་འགྲུལ་ལམ་གཞི་སྒྲིག་འབད་དེ་ བཟོ་བཏོན་འབད་ཡོད་པའི་ཨའི་ཌི་འདི་འཚོལ་ཞིབ་འབད་ནི་ལུ་ལག་ལེན་འཐབ།

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

ཤུལ་མམ་གྱི་བཀོལ་སྤྱོད་ཚུ་གིས་ བཟོ་བཏོན་འབད་ཡོད་པའི་ `hash$domain` ID ལག་ལེན་འཐབ་ཨིན།

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

སྤོ་བཤུད་ཆ་ཚང་གིས་ ད་ལྟོ་ཡོད་པའི་ས་ཁོངས་ནང་ `owned_by` བསྒྱུར་བཅོས་འབད་ཚུགས། ཆ་ཤས་སྤོ་བཤུད་དང་མཉམ་བསྡོམས་ཚུ་གིས་ བཟོ་བཏོན་འབད་ཡོད་པའི་ཨ་ལོའི་ལོཊི་ཚུ་གསར་བསྐྲུན་འབདཝ་ཨིན།

### ཐིག་ཁྲམ་ཚུ་ {#triggers}

ལག་ལེན་འཐབ་བཏུབ་མི་འདི་ བཀོད་རྒྱ་གོ་རིམ་གཞན་ཅིག་ཨིན་པའི་སྐབས་ ཊི་གར་ཐོ་བཀོད་གྲོགས་རམ་འབད་མི་ཚུ་ལག་ལེན་འཐབ།

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

Torii གིས་ རྐྱེན་སློང་ཐོ་གཞུང་གི་དོན་ལུ་ REST རོགས་ལས་རིམ་ཡང་གསལ་སྟོན་འབདཝ་ཨིན།

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

སྐུལ་རྟེན ཐོ་གཞུང ལས་རིམ་འབོད་ཚུ འབད། ཐིག་ཁྲམ་ཚུ་ལྷག་སྟེ་བལྟ་ནི་དང་ བརྟག་དཔྱད་འབད་ནི་རྐྱངམ་གཅིག་ཨིན། ཐོ་བཀོད་འབད་ནི་དང་ བཏོན་གཏང་ནི་ དེ་ལས་ ལོག་བསྒྱུར་བཅོས་འབད་ནི་དང་ ཐོ་བཀོད་ཀྱི་མ་སྤེལ་ནི་ཚུ་ བྱ་རིམ་འགྱུར་ལྡོག་ཅན་ཅིག་ཨིན།

### སྐྱིན་འགྲུལ་བསྐྱོད་དང་ ཟད་འགྲོ་བཏང་ནིའི་བསླབ་བྱ་ཚུ་ {#repo-and-settlement-instructions}

མཛོདདང་ གཉིས་ཕྱོགས རྩིས་རྒྱག རོགས་ལས་རིམ་ཚུ གིས་ ལག་ལེན་ཐོག་ལས་བཟོ་མི་ Norito ནང་དོན་གནད་སྡུད་ཚུ ཚུ་མེད་པར་ མངའ་ཁོངས་དམིགས་བསལ བཀོད་རྒྱ འགྱུར་རྣམ མཐུད་སྦྲེལ་འབདཝ་ཨིན།

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

### JSON གི་འཕྲལ་ཐོན་ལམ་ {#json-escape-hatch}

ག་དེམ་ཅིག་སྦེ་ a Python གྲོགས་རམ་འབད་མི་མེད་, སྟོན་ཐངས་ཡིག་རྒྱུན་གྱི་ གནད་སྡུད་དཔེ་ཚད `InstructionBox` JSON ནང་འཁོད་ལུ་ `Instruction.from_json`. འདི་གི་དོན་ལུ་ གྲོས་ཐག་ཆོད་པའི་ལམ་འདི་ཨིན། `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, མཐུད་མཚམས་/འགན་ཁུར་/NFT ཐོ་བཀོད་དང་ མེན་པ-སྐུལ་རྟེན ཕྱིར་ཐོ་བཀོད་འབད་མ་བཏུབ་པའི་འགྱུར་ཁྱད་ཚུ་ འདི་གི་དོན་ལུ་ རྒྱབ་སྐྱོར་ཚུ་ ཨེབ་གཏང་མ་འབད་ཚུན་ཚོད་ཨིན།

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

ཡིག་དཔར་རྐྱབས་ཡོད་པའི་ཟིན་བྲིས་འགྲུལ་ལམ་འདི་ བརྗེ་སོར་མཚམས་ལུ་བཞག: དེ་གིས་ `NetworkId` དང་ འཐུས་སྤྲོད་དགོ་པའི་དམིགས་ཡུལ་ དེ་ལས་ མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་ འགྱུར་མེད་ཀྱི་ཚིག་བརྗོད་ཚུ་ ངེས་བདེན་སྦེ་ ཉམས་སྲུང་འབདཝ་ཨིན། ཐད་ཀར་ `TransactionBuilder` ལག་ལེན་འཐབ་ནི་ལུ་ གནས་གོང་ཅོག་འཐདཔ་ཚུ་དང་ ཐད་རི་བ་རི་ཚིག་བརྗོད་ཅིག་གི་ གསལ་ཏོག་ཏོ་བདེན་དཔྱད་དགོཔ་ལས་ འདི་གློག་རིམ་ཨང་རྟགས་ཀྱི་དོན་ལུ་ མགྱོགས་ཐབས་ཅིག་མེན།

བཟོ་བཏོན་འབད་ཡོདཔ་ཡང་ན་ གསལ་ཏོག་ཏོ་མེད་པའི་བཀོད་རྒྱ་ཚུ་གི་དོན་ལུ་ སྒྲིག་ཆས་ཚུ་གསོག་འཇོག་མ་འབད་བའི་ཧེ་མ་ JSON བརྒྱུད་དེ་ སྐོར་རྒྱབ་འབད།

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## ཚོང་འབྲེལ་གྱི་ལཱ་ལམ་ལུགས་ཚུ་ {#transaction-workflows}

མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་ བཀོད་རྒྱ་སྣ་ཚོགས་བཟོ་བསྐྲུན་འབད་མི་གློག་རིམ་ཚུ་གི་དོན་ལུ་ `TransactionDraft` ལག་ལེན་འཐབ། ཟིན་བྲིས་ཅིག་གིས་ ཁྱོད་ལུ་ `ttl_ms`, `nonce`, དང་ མེ་ཊ་ཌེ་ཊ་བཟུམ་གྱི་ བརྗེ་སོར་གནས་རིམ་སྒྲིག་སྟངས་ཚུ་ ས་གནས་གཅིག་ནང་བཞག་བཅུགཔ་ཨིན་ དེ་ལས་ ཚར་གཅིག་མིང་རྟགས་བཀོད།

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

བསྐྱར་ཞིབ་དང་རྩིས་ཞིབ་ ཡང་ན་ དངུལ་ཁུག་སྤྲོད་ནིའི་དོན་ལུ་ གཏན་འབེབས་ཅན་གྱི་གསལ་བསྒྲགས་ཅིག་ཕྱིར་འདྲེན་འབད།

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

དམིགས་གཏད་ལམ་ལུ་དགོཔ་ད་ མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་ ལམ་གྱི་སྒེར་གསང་བདེན་ཁུངས་ཅིག་མཉམ་སྦྲགས་འབད།

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

## དྲི་བཀོད་ཚུ་ {#queries}

ཐོ་བཀོད་ཅན་གྱི་དྲི་བཀོད་གྲོགས་རམ་ཚུ་གིས་ JSON ཚིག་མཛོད་མ་བཟོ་བའི་ཚབ་ལུ་ ཌེ་ཊ་སློབ་རིམ་ཚུ་སླར་ལོག་འབདཝ་ཨིན། ཁོང་འགོ་འདྲེན་འཐབ་ནིའི་ཐབས་ལམ་འཇམ་ཤོས་ཅིག་ཨིནམ་ད་ SDK གིས་ ཁྱོད་ཀྱི་དོན་ལུ་ ཤོག་ལེབ་དང་ཡིག་སྡེབ་ཀྱི་ས་ཁོངས་ཚུ་ བརྟག་ཞིབ་འབདཝ་ཨིན།

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Torii མཐའ་མཚམས ལུ་ དབྱེ་བ་ཅན ཕྱི་སྐོགས མེད་པ་ཅིན་ སྤྱིར་བཏང་ཞུ་ཡིག་རོགས་རམ་ཚུ་ལག་ལེན་འཐབ།

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

རྩིས་ཐོའི་ཐོ་གཞུང་ལས་རོགས་ཚུ་ལུ་ SDK གི་སྤྱིར་བཏང་བཟོ་བྱེད་ཀྱིས་ངོས་ལེན་འབད་མི་རྩིས་ཐོའི་ངོས་འཛིན་དགོ། ཚད་ལྡན་ I105 རྩིས་ཐོ་ ID ཡང་ན་ རྒྱུན་ཐག་གུ་ཡོད་པའི་མིང་གཞན་ལག་ལེན་འཐབ། སྡེབ་ཚན་འཚོལ་ཞིབ་ལས་རིམ་ཡང་ན་ API མཐའ་མཚམས་ངོ་མ་གིས་ SDK གིས་ཆ་མེད་གཏང་མི་ ID ཅིག་ལོག་བྱིན་པ་ཅིན་ ལས་རོགས་འདི་ཚུ་མ་འབོ་པའི་ཧེ་མར་ ཚད་ལྡན་རྩིས་ཐོ་ ID ལུ་སེལ།

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## འབྱུང་རྐྱེན་ཚུ་ {#events}

གློག་ཐག་ར་བ་ལུ་ རྒྱབ་སྐྱོར་འབད་མི་ཚུ་ རྩ་སྒྲིག་འབདཝ་ཨིན། JSON ནང་དོན་གནད་སྡུད་གྱི་ཁེ་རྒུད་ཚུ་ སྔོན་སྒྲིག་འབདཝ་ཨིན། མཐར༌འཁྱོལ༌ `with_metadata=True` ཁྱོད་ཀྱིས་ དགོས་མཁོ་ཡོདཔ་ད་ SSE འབྱུང་རྐྱེན་གྱི་མིང་དང་ ངོས་འཛིན་ དེ་ལས་ བརྟག་དཔྱད་བསྐྱར་འབད་ནིའི་བརྡ་སྟོན་ དེ་ལས་ གྲུབ་འབྲས་ཚུ་ `/v1/events/sse` བཀྲམ་སྟོན་ནི་དེ་ ཕྲང་ལམ་རྐྱངམ་གཅིག་ཨིན། འདི་ཡང་ ལོག་བཏང་མི་ཚུགས། IDs འདི་འབདཝ་ལས་ རྒྱབ་སྐྱོར་ཚུ་གིས་ ཀེར་སོརཌ་དང་ བསྐྱར་གསོ་མ་འབད་བར་ བཞག་ཚུགས། གྲོས་བསྡུར་འབདཝ་ཨིན། སླར་ལོག་མཐུད་དེ་ཅིག་གིས་ ཐོ་བཀོད་གསརཔ་འགོ་བཙུགས་ཏེ་ གྱོང་ལྡོག་འབྱུང་ཚུགས་ཨིན། `/v1/blocks/stream` ཡོངས་གྲགས་ཅན་གྱི་མཐོ་ཚད་ལས་ ཡོངས་ཁྱབ་གི་ཐོ་ཡིག་ལོ་རྒྱུས་འདི་ དགོཔ་ཨིན། འ་ནི་དཔེ་རྙིཊ་ཚུ་ འབྱུང་རྐྱེན་ངོ་མ་གི་དོན་ལུ་སྒུག་སྡོད་དོ་ཡོདཔ་ཨིན། འདི་འབདཝ་ལས་ རྒྱུན་འདི་ འགོ་བཙུགས་ཏེ་ བྱ་སྤྱོད་འབད་སའི་ཨེབ་ཐག་ཅིག་ལུ་ བཏོན་གཏང་དགོ།

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

## ཁ་བྱང་དང་ཁ་བྱང་ཚུ་ {#keys-and-addresses}

SDK གིས་ ནང་སྐྱེས རྒྱ་བསྐྱེད ནང་ སྒྱུར་བཟོ འབད་མི་ མིང་རྟགས རྩིས་ཐབས རེ་རེའི་དོན་ལུ་ ས་གནས མིང་རྟགས་འགོད་ནི རོགས་ལས་རིམ ཚུ་སྟོནམ་ཨིན། རོགས་ལས་རིམ འདི་ཚུ་གིས་ Taira ལུ་འབོ་མི་བཏང་རུང་ ནང་སྐྱེས རྒྱ་བསྐྱེད དགོཔ་ཨིན།

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

ཁྱོད་ཀྱི་འཁོར་ལོ་འདི་གིས་ ག་ཅི་ལུ་རྒྱབ་སྐྱོར་འབདཝ་ཨིན་ན་ `supported_crypto_algorithms()` ལག་ལེན་འཐབ། སྤྱིར་བཏང་གྲོགས་རམ་འབད་མི་ཚུ་གིས་ ཚད་ལྡན་ཨཱལ་གོ་རི་དམ་ཁ་ཡིག་ཚུ་ལག་ལེན་འཐབ་སྟེ་ Ed25519, secp256k1, ML-DSA, GOST, BLS, དང་ SM2 ཚུ་གི་དོན་ལུ་ལཱ་འབདཝ་ཨིན།

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

`crypto.sm.enabled` གིས་ མཐུད་མཚམས གིས་ SM བཟའ་ཚང་གི་གློག་རིག་ཚུ་ ངོས་ལེན་འབད་ཡོདཔ་ཨིན་ན་མེན་ཟེར་ གསལ་སྟོན་འབདཝ་ཨིན། འདི་དང་འདྲན་འདྲ་བའི་གསལ་བསྒྲགས་འདི་ནང་ SM བསྡུས་རྟགས སྲིད་བྱུས་དང་ མགྱོགས་སྒྲིལ་གནས་སྟངས་ཡང་ཡོདཔ་ཨིན། འདི་གིས་ SM2 དམིགས་བསལ བྱ་རིམ འབད་ནི་ཨིན་ན་མིན་འདུག་གམ་མེད་ཐག་གཅོད་སྐབས་ཕན་ཐོགས་ཅན་ཨིན།

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

བཀྲམ་སྤེལ་འབད་ཡོད་པའི་མཐུད་མཚམས་དོན་ལུ་ བདེན་བཤད་འབད་ཡོད་པའི་ལྕོགས་གྲུབ་ཀྱི་ ནང་དོན་གནད་སྡུད་འདི་ དབང་ཚད་ཅན་སྦེ་ བརྩི་འཇོག་འབད། `crypto.sm.enabled` འདི་བདེན་པ་དང་ ཁྱབ་བསྒྲགས་འབད་ཡོད་པའི་མིང་རྟགས་བཀོད་ནི་གི་སྲིད་བྱུས་འདི་གིས་ ངོས་ལེན་མ་འབད་ཚུན་ཚོད་ SM2-མཚན་རྟགས་བཀོད་ཡོད་པའི་ཚོང་འབྲེལ་འདི་ མ་བཙུགས།

### GOST དང་ ཀི་བཱེན་ཌའི་ལོག་ལྡེ་མིག་ཚུ་ {#gost-and-post-quantum-keys}

GOST R 34.10-2012 ཚད་བཟུང ཆ་ཚན དང་ ML-DSA (`ml-dsa`) གི་ ཀོའན་ཊམ་ཤུལ་གྱི རྟགས་གི་དོན་ལུ་ གསང་བཟོ API སྤྱིར་བཏང་ལག་ལེན་འཐབ། ལྡེ་མིག-ཆ དངོས་པོ གཅིག་གིས་རྟགས་བཀོད་ བརྟག་ཞིབ་དང་ multihash ཕྱིར་འདྲེན ཚུ་འབདཝ་ཨིན།

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

གཱེཊ་ GOST དང་ མཐུད་མཚམས་ཀྱི་བདེན་དཔང་འབད་ཡོད་པའི་ ཡིག་དཔར་རྐྱབ་ཡོད་པའི་ ལྕོགས་གྲུབ་ཁྱབ་བསྒྲགས་གུ་ པོསཊ་ཀོན་ཊམ་རྒྱུན་འབབ་ཚུ།

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

གལ་སྲིད་ མཐུད་མཚམས་ཅིག་གིས་ ཁྱོད་ལུ་དགོ་པའི་ཨཱལ་གོ་རི་དམ་འདི་ཁྱབ་བསྒྲགས་མ་འབད་བ་ཅིན་ ལྡེ་མིག་འདི་ ཉེ་གནས་ཡང་ན་ ཨོཕ་ལ་ཡིན་ལཱ་གི་རྒྱུན་རིམ་ཚུ་གི་དོན་ལུ་རྐྱངམ་ཅིག་ལག་ལེན་འཐབ། མཐུད་མཚམས་དེ་ལུ་ཨཱལ་གོ་རི་དམ་དེ་དང་གཅིག་ཁར་མིང་རྟགས་བཀོད་ཡོད་པའི་ཚོང་འབྲེལ་ཚུ་མ་བཙུགས། མི་མང་ Taira ཞིབ་དཔྱད་ཀྱི་སྐབས་ GOST དང་ ML-DSA ཡར་འཕར་ Python དཔེ་མཛོད་ནང་ SDK ཀིརིཔ་ཊོ་གྲོགས་རམ་པ་སྦེ་ཐོབ་ཚུགས་རུང་ ཚོང་འབྲེལ་མིང་རྟགས་བཀོད་ནིའི་དོན་ལུ་ མཐུད་མཚམས་ཀྱིས་ ཁྱབ་བསྒྲགས་མ་འབད་བས།

## རིམ་སྒྲིག་ཤེས་པའི་མགྲོན་པོ་བཟོ་ནི་ {#config-aware-client-creation}

ཁྱོད་ཀྱི་ལག་ལེན་མཉེན་ཆས་ཀྱིས་ ཡིག་སྣོད་ཅིག་ལས་ མཐུད་མཚམས་སྒྲིག་གཞི་ཚུ་ལྷག་རུང་ མཐའ་འཁོར་ཡང་ན་ བརྟག་དཔྱད་ལ་དམིགས་བསལ་གྱི་ཚབ་བཙུགས་གནས་གོང་དགོ་པའི་སྐབས་ `resolve_torii_client_config` ལག་ལེན་འཐབ།

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

Python SDK གིས་ ད་ལྟོའི་ JSON གྲ་སྒྲིག་ལམ་ལུགས་འདི་ དེ་གི་སྤྱིར་བཏང་ Torii ཞུ་བ་གྲོགས་རམ་པ་བརྒྱུད་དེ་ འདྲི་དཔྱད་འབད་ཚུགས།

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

མཁོ་མངགས ལྷག དང་ ཟིན་བྲིས་ཚུ བཟོ་བྱེད འདི་ Torii ཞབས་ཏོག་ལེན་མི གིས་ལག་ལེན་འཐབ་མི་ བརྗེ་སོར་འབད་ཡོདཔ `iroha_python.ToriiClient` ལས་བགོ་བཤའ་རྐྱབ་ཡོདཔ་ཨིན། བཟོ་བཀོད་བསྒྱུར་བཅོས་ཆ་མཉམ་འདི་ ནང་དོན བཅིངས ཚད་ལྡན རྩིས་ཐོ མིང་རྟགས དང་གཅིག་ཁར་ འཛུལ་ཆོག ཡིན། དེ་ལས་ མཚན་རྟགས་མེད ཚོང་འབྲེལ ཟིན་བྲིས སླར་ལོག་འབདཝ་ཨིན། Torii གིས་ནམ་ཡང་ སྒེར༌ ལྡེ་མིག མེདཔ་བཟོཝ་མ་ཚད་ ཁྱོད་ཀྱིས་ ཟིན་བྲིས བཏང་མ་ཚུགས།

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

གནས་སྡུད་དང་མཚན་རྟགས་བརྡ་འཕྲིན་ཏག་ཏག་རེ་རེ་ འབྲེལ་ཡོད་རྩིས་ཐོའི་ས་གནས་ཀྱི་དངུལ་ཁུག་ལུ་བྱིན། དེ་ནང་ཞུ་བའི་བཀོལ་སྤྱོད་བདེན་དཔྱད་འབད་ མཚན་རྟགས་ཅན་གྱི་ཚོང་འབྲེལ་བསྡུ་སྒྲིག་འབད་ དེ་ལས་ སྤྱིར་བཏང་ཚོང་འབྲེལ་རྒྱུན་རིམ་བརྒྱུད་དེ་ཕུལ། Python SDK གིས་ མཚན་རྟགས་བརྡ་འཕྲིན་འདི་ ལོག་ཐོབ་པའི་གནས་སྡུད་ཀྱི་ཚད་ལྡན་ཧེཤ་ཨིནམ་བདེན་དཔྱད་འབད་རུང་ དངུལ་ཁུག་ལུ་ མཚན་རྟགས་མ་བཀོད་པའི་ཧེ་མར་ ཚོང་འབྲེལ་གསང་བཤད་དང་ངོས་ལེན་འབད་ནིའི་འགན་ཁུར་ཡོད།

## འབྲེལ་མཐུད་འབད་ {#connect}

ཉེ་གནས་ལུ་མཐུད་ URIs བཟོ་བསྐྲུན་དང་དབྱེ་དཔྱད་འབད། མཐུད་ལམ་ངོ་རྟགས་ཅིག་གིས་ SID འདི་ ངེས་བདེན་ `NetworkId` དང་ གློག་རིམ་མི་མང་ལྡེ་མིག་ དེ་ལས་ གསང་ཡིག་ནོནསི་གནས་གོང་ལུ་ བསྡམ་བཞགཔ་ཨིན།

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

དམིགས་གཏད་མཛུབ་གནོན་འདི་གིས་ མཐུད་ལམ་འདི་ གསལ་སྟོན་འབད་བའི་སྐབས་རྐྱངམ་ཅིག་ སྔོན་ལྟ་ངེས་བདེན་དེ་ ཐོ་བཀོད་འབད། ལཱ་ཡུན་གསར་བསྐྲུན་འདི་གིས་ འགན་ཁུར་དམིགས་བསལ་འབག་མི་ཊོ་ཀེན་བཞི་སླར་ལོག་འབདཝ་ཨིན། ལཱ་ཡུན་རེ་རེ་གི་གནས་ཚད་འགྲུལ་ལམ་ལུ་ འཛིན་སྐྱོང་བརྡ་མཚོན་དགོཔ་ཨིན། བསྡོམས་ཚད གནས་ཚད འདི་ བཀོལ་སྤྱོད་པའི་འགྲུལ་ལམ་ཅིག་ཨིན།

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

ཆ་འཇོག་འབད་བའི་ཤུལ་ལས་ འཕྲིན་དོན་ཚུ་ གནས་སྟངས་ཅན་གྱི་ལཱ་ཡུན་དང་གཅིག་ཁར་ གསང་བཟོ་འབད།

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

སྲིད་སྐྱོང་ཐོ་བཀོད་ཚུ་རྩིས་ཐོ་གིས་བདེན་འཛིན་འབད་ཡོདཔ་ཨིན། [མཉམ་འབྲེལ་མཐུན་རྐྱེན་](#shared-setup) ལས་དབང་ཤུགས་དང་ལྡནམ་ལག་ལེན་འཐབ་སྟེ་ གྲོགས་རམ་ཨེབ་གཏང་མི་རེ་ལུ་ Taira གི་ ཡོངས་འབྲེལ་འབྱུང་ཁུངས། `NetworkId` ལུ་བསྡམས་:

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

ལས་འཛིན་གྱི་བཀླགས་ཐོ་བཀོད་གི་དོན་ལུ་ ཁྱད་པར་ཅན་ལག་ལེན་པ་ཅིག་བཟོ། རྒྱུན་འགྲུལ་འབད་བའི་དུས་ཚོད་ལུ་ ཆོག་ཐོར་བཀོད་ཡོད བཀོལ་སྤྱོད་པ ལྡེ་མིག འདི་ཨེབ་གཏང་འབད་ཞིནམ་ལས་ Taira གི་བདེན་པའི་ `NetworkId` ལུ་བཅིངས་འབད། ལག་ལེན་པ་གི་རྟགས་མཚན་དང་ `x-api-token` གིས་ འ་ནི་ཡིག་འབྲུ་འདི་ཚབ་མ་བཙུགས་:

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

དུས་ཡུན་ཡར་དྲག་གཏང་ནིའི་ལམ་ཚུ་ ལག་ལེན་པ་གིས་ བདེན་ཁུངས་བཀོད་མི་ བརྡ་སྟོན་བཟོ་སྐྲུན་འབད་མི་ཚུ་ཨིན། གྲུབ་འབྲས་ཅན་ཅིག་གིས་ གྲོས་འདེབས་ལོག་གཏང་། སླར་ལོག་འབད་ནི་དང་ ཡང་ན་ ཆ་མེད་གཏང་ནི་ `tx_instructions`; འདི་ཡང་ ད་ལྟོའི་གནས་གོང་འདི་ བསྒྱུར་བཅོས་འབད་མ་ཚུགསཔ་ཨིན། ཟུར་ཤོག་འདི་ རང་བཞིན་གྱི་བཀོད་སྒྲིག་གི་ཐོག་ལས་དང་ གཞུང་སྐྱོང་ལམ་བརྒྱུད་དེ་གཏང་དགོ། Python ཐབས་ལམ་ཚུ་ `propose_runtime_upgrade`, `activate_runtime_upgrade`, དང་ `cancel_runtime_upgrade` ད་ལྟོའི་བར་ན་ཡང་ མགྲིན་ཚབ་ཀྱི་ཞུ་ཡིག་ཚུ་ལག་ལེན་གྱི་ཚབ་ལུ་ རང་བཞིན་གྱི་ཞུ་ཡིག་ཚུ་སྤྲོད་ནི་ཨིན་མས། `OperatorSigningContext`, འདི་འབདཝ་ལས་ འ་ནི་ལྷབ་སྦྱང་འདི་ ལཱ་འབད་ཐངས་ཀྱི་ལག་ལེན་པ་ཅིག་སྦེ་སྟོན་མི་ཚུགས།

## གནས་གོང་དང་ གྲོས་འཆམ་ དེ་ལས་ འགྲུལ་འཕྲིན་འཕྲུལ་ཆས་ཚུ་ {#status-consensus-and-network-telemetry}

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

# Kaigi relay health is an operator snapshot, even though it is read-only.
health = operator_client.get_kaigi_relays_health_typed()
print(health.healthy_total, health.failovers_total)
```

## Norito RPC དང་ GPU གྲོགས་རམ་འབད་མི་ {#norito-rpc-and-gpu-helpers}

ཁྱོད་ཀྱིས་ `NoritoRpcClient` ལག་ལེན་འཐབ་པའི་སྐབས་ ཁྱོད་ཀྱིས་ Norito བའི་ཊི་ཚུ་ཡོད་པའི་ཁར་ ཌའི་ལོག་གི་མཐའ་མཚམས་ (API མཐའ་མཚམས) Torii ལུ་འབོ་དགོཔ་ཨིན། དཔེ་འདི་ སྔོན་བྱོན་གྱི་ཅ་ཆས་བཟོ་རྣམ་ནང་ལས་ ཐོ་བཀོད་འབད་ཡོད་པའི་ཁེབས་ཅིག་ དགོཔ་ཨིན་མས།

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

CUDA གྲོགས་རམ་འབད་མི་ཚུ་གིས་ རྒྱབ་གཞི་འདི་འཐོབ་མ་ཚུགས་པའི་སྐབས་ `None` སླར་ལོག་འབདཝ་ལས་ གློག་རིམ་ཚུ་ ཨིསི་ཀེ་ལར་ལག་ལེན་འཐབ་མི་ཚུ་ལུ་ ལོག་འགྱོ་ཚུགས།

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## ད་ལྟོའི་ཁྱབ་ཚད་ {#current-coverage}

Python SDK གིས་ ད་ལྟོའི་བར་ན་ཡང་ རྒྱབ་སྐྱོར་འབད་མི་ཚུ་ཡང་ ཡོདཔ་ཨིན།

- Torii བཏང་ཐོ་བཀོད་, གནས་གོང་, དྲི་བཀོད་དང་ འཛིན་སྐྱོང་ཐོ་བཀོད།
- ISI དང་ ཌོ་མ་ནེསི་རྐྱང་གི་ཁྱབ་སྒྲགས་ཚུ་གི་དོན་ལུ་ བརྡ་བཀོད་བཀོད་བཟོ་སྐྲུན་འབད་མི་ཚུ་
- ཚོང་འབྲེལ་ཟིན་བྲིས་དང་ གསལ་བསྒྲགས་ མིང་རྟགས་བཀོད་མི་ དེ་ལས་ མིང་རྟགས་བཀོད་ཡོད་པའི་ཚོང་འབྲེལ་ཡིག་ཤུབས་ཀྱི་ ལཱ་གི་རྒྱུན་རིམ་ཚུ་
- ཐད་གཏོང་བྱུང་རིམ་གྱི་རྒྱུན་ལམ་དང་ཡིག་དཔར་རྐྱབས་ཡོད་པའི་ཚགས་མ་ཚུ། ཁས་བླངས་འབད་ཡོད་པའི་སྡེབ་ཚན་རྒྱུན་ལམ་ཚུ་གིས་ བྱུང་རབས་ཆ་ཚང་བྱིནམ་ཨིན།
- སྤྱིར་བཏང་ Kagemusha གྲ་སྒྲིག་འཛུལ་སྤྱོད་དང་ Torii མཁོ་སྒྲུབ་རོགས་སྐྱོར། ཡིག་དཔར་རྐྱབ་ཡོད་པའི་ མཐོ་ཚད་དང་ བསྐྱར་ལེན་བཟོ་བསྐྲུན་པ་ཚུ་ ཕྱི་ཁར་མ་བཏོན་པས།
- རྩིས་ཐོ་གི་ཁ་བྱང་། ཨལ་ག་རི་ཏེམ་ཡོངས་འབྲེལ་གྱི་བརྡ་དོན་འབྲི་སའི་ལས་བྱེདཔ་ཚུ། མང་ཤོས་ཀྱི་ཧེཤ་དང་ ཕར་དང་ཚུར་ འགྲོ་འགྲུལ་འབད་ SM2, GOST, ML-DSA, BLS དེ་ལས་ གསང་བའི་ལྡེ་མིག་ལག་ལེན་འཐབ་ཐབས།
- URIs མཐུད་སྦྲེལ་འབད་ཐབས། གྲོས་བསྡུར་ཚུ་, ཐེམ་ཕེརམསི་, ཨེབ་གཏང་ནིའི་རོགས་དང་ ཐོ་བཀོད་འཛིན་སྐྱོང་པ་
- མཐུད་མཚམས གིས་ཁྱད་ཆོས་དེ་ཚུ་བྱིན་པའི་སྐབས་ གཞུང་སྐྱོང, ལག་བསྟར་མཉེན་ཆས རིམ་སྤར, Sumeragi, མཐུད་མཚམས བདག་སྐྱོང་, SoraFS, UAID དང་ Kaigi API མཐའ་མཚམས ཚུ་གི་ གློག་རིག་མཉེན་ཆས མཐུད་ཆས ཚུ

## གཙོ་རིམ་གོང་མའི་ཁ་བྱང་ཚུ་ {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

འ་ནི་ཡིག་སྣོད་ཚུ་ སྒྲིག་འཇུག་གི་གནས་སྟངས་ནང་ Python གྱི་མཐར་ཐུག་ལུ་ བདེན་ཁུངས་ཀྱི་འབྱུང་ཁུངས་ཨིན།
