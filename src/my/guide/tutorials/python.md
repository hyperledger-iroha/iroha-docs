---
translation_locale: my
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

Python SDK ကို Upstream Workspace တွင် `iroha-python` ဖြစ်ပါသည်။ ပထမဦးဆုံး Iroha 3 ထုတ်ပြန်ချက်သည် လက်ရှိ Torii နှင့် Norito မျက်နှာပြင်များကို ရည်မှန်းထားသည်။ သင့်ပေါင်းစပ်မှုတွင်အသုံးပြုသော package version သို့မဟုတ် source revision ကို pin လုပ်ပါက SDK နှင့် node တို့သည် seriallization format revision တစ်ခုတည်းတွင်နေထိုင်စေရန်။

ရည်မှန်းချက် အများပြည်သူ အောက်က အမည်မသိ ဖတ်ပြမှု နမူနာများ Taira at ကို `https://taira.sora.org`. လမ်းကြောင်းတစ်ခုဟာ ဖတ်လို့သာ ရနိုင်ပြီး တစ်မူထူးတဲ့ ပရိုတိုကုတ်စံညွှန်းစာရင်း လက်မှတ် (သို့) အတိအကျကွန်ရက်စီမံခန့်ခွဲသူလက်မှတ်ကို လိုအပ်နေဆဲပါ။ အပြောင်းအလဲဥပမာများသည် ငွေကြေးပရိုဂရမ်ပုံစံများဖြစ်ပြီး အစစ် Taira ခွင့်ပြုချက် အရင်းအမြစ်၊ ပုဂ္ဂလိက သော့၊ ငွေပေးချေမှု ရည်ရွယ်ချက်ကို ရိုက်ထည့်ထားတယ်၊ လုံလောက်တဲ့ စမ်းသပ်ရေး ကွန်ရက် XOR, ခရီးသွားလမ်းကြောင်းအတွက် လိုအပ်တဲ့ အတည်ပြုချက်တွေကို တင်ပြနိုင်ဖို့ပါ။

ဥပမာတွေကို ဒီအစီအစဉ်မှာ သုံးပါ-

|အဆင့် |Taira လူထုကို ဆန့်ကျင်ဖို့ ပြိုင်လား။ |သင်လိုအပ်တာတွေကို|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|အမည်မဲ့ စာဖတ်ဖုန်းတွေကို ဖတ်ပါ။|ဟုတ်ပါတယ်|Python Package plus network access ကို|
|အကောင့် (သို့) လုပ်ငန်းရှင်က စစ်ဆေးတဲ့ စာဖတ်ခြင်း |သင့်ကိုယ်ပိုင် အသိအမှတ်ပြုထားတဲ့ ကိုယ်ပိုင်လက္ခဏာနဲ့သာ|အတိအကျ Taira `NetworkId` နှင့် သက်ဆိုင်သောစာရင်း (သို့) operator key ကို |
|ဒေသတွင်း လက်မှတ်ရေးထိုးခြင်းနှင့် ညွှန်ကြားမှု တည်ဆောက်သူများ |`submit()` အထိကွန်ရက်ခေါ်ဆိုမှုမရှိဘူး။|Native extension နဲ့ သင့်ရဲ့ အဓိက ပစ္စည်းပါ။|
|ငွေလဲလှယ်မှုနှင့် ဝန်ဆောင်မှုခေါ်ဆိုချက်များ |သင့်ကိုယ်ပိုင် ငွေကြေးထောက်ပံ့တဲ့ အကောင့်နဲ့သာပါ။|ခွင့်ပြုချက် အရင်းအမြစ်စာရင်း၊ ပုဂ္ဂလိက သော့၊ တိကျသော Taira `NetworkId`, ရိုက်နှိပ်ထားသည့် အခွန် ရည်ရွယ်ချက်၊ အခွန်လက်ဝယ်စုဆောင်းမှုနှင့် လမ်းညွှန်လက္ခဏာများ |
|Frame codec တွေ၊ crypto နဲ့ GPU အကူတွေကို ချိတ်ဆက်ပါ။ |ဒေသတွင်းပဲ|GPU အကူအညီပေးသူများအတွက်လည်း CUDA- အရည်အသွေးရှိတဲ့ backend လိုပါတယ်။ |

## တပ်ဆင်ခြင်း {#install}

Package metadata နာမည်က `iroha-python` ပါ။ မတည်ငြိမ်ဘူးလို့ မယူဆပါနဲ့။ PyPI Install ကို Live နဲ့ လိုက်ဖက်ပါတယ်။ Taira ကွန်ရက်။ ဘီး (သို့) အရင်းအမြစ်ကုဒ်အလုပ်လုပ်မှုမူကွဲကိုသင်၏ပေါင်းစပ်ရေးရည်မှန်းချက်များကို Upstream revision တစ်ခုတည်းမှတည်ဆောက်ထားသည်:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

သင့်စီမံကိန်းက Upstream အလုပ်ခွင်ကို တိုက်ရိုက်သုံးစွဲတယ်ဆိုရင် Python dependencies တွေကို run မလုပ်ခင်မှာ native extension ကို build လုပ်ပေးပါ။ `Instruction`, `TransactionDraft`, လက်မှတ်ထိုးခြင်း၊ crypto, SoraFS ဒေသခံ အကူအညီပေးသူတွေ၊ GPU build command ကို Upstream ကေနသံုးပါ။ `python/iroha_python/README.md`, အဲဒီနောက်မှာ ဒေသတွင်းတင်ပို့မှုအတွက် ဝန်ဆောင်မှုရှိတာကို စစ်ဆေးပါ။

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

အကယ်၍ `create_torii_client` တင်သွင်းမှု `Instruction` ဒါမှမဟုတ် `generate_ed25519_keypair` ရှုံးနိမ့်သွားတယ်၊ သန့်ရှင်းတဲ့ Python Package ကတော့ ရနိုင်ပေမဲ့ native extension ကတော့ မရဘူး။

## အမြန်စတင်ခြင်း {#quickstart}

အများပြည်သူ ဖတ်နိုင်သော Taira API အကန့်အသတ်မှတ်ချက်များဖြင့် စတင်ပါ။

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

## မျှဝေထားသော Setup {#shared-setup}

အသွင်ပြောင်းတဲ့ Template တွေအတွက် ဒီ Setup ကိုသုံးပါ။ တင်မပေးခင် နေရာထိန်းထားသူတိုင်းကို Taira ခွင့်ပြုချက် အရင်းအမြစ်၊ ပုဂ္ဂလိက သော့၊ Token နဲ့ ပိုင်ဆိုင်မှု/စာရင်း ID များနဲ့ အစားထိုးလိုက်ပါ။

`authority` သည် ငွေပေးချေမှုကို လက်မှတ်ရေးထိုးသည့်စာရင်းဖြစ်ပြီး `private_key` သည် ၎င်းနှင့် ကိုက်ညီရမည်ဖြစ်သည်။ ငွေကြေးမှုသည် Taira ၏ တိကျသော ဇစ်မြစ်မှ ရယူထားသော `NetworkId` သို့ ချိတ်ဆက်ခြင်းရှိသည်။ လိုင်း UUID သည် ငွေကြေးဆောင်ရွက်မှု တံဆိပ်တစ်ခုဖြစ်သည်၊ ငွေကြေးပူးပေါင်းဆောင်ရွက်မှု အမည်မဟုတ်ပါ။ အခွန်များတွင် လျှောက်ထားမှု metadata နှင့်အဆက်အသွယ်မရှိဘဲ ရိုက်နှိပ်ထားသော ငွေပေးချေမှုရည်ရွယ်ချက်နှင့် တိကျသော တိုက်ရိုက် quote ကိုအသုံးပြုသည်။ အောက်ပါစာရင်းနှင့် အဓိကနေရာပိုင်ရှင်များသည် ရည်ရွယ်ချက်အရ မတည်ငြိမ်ဖြစ်သည်၊ ထို့ကြောင့် ကျပန်းတင်သွင်းခြင်းမဟုတ်ပါ။

စာလုံးသားအောက်မှာက လက်ရှိ pinned Taira blockchain genesis identity ပါ။ testnet reset တစ်ခုက ဒါကိုပြောင်းလဲနိုင်တယ်။ ဒီတော့ လက်မှတ်ထိုးထားတဲ့ deployment profile ကနေ update လုပ်ပြီး UUID ချိတ်ဆက်မှုကနေ ဘယ်တော့မှ မဆုံးဖြတ်ပါ။

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

`Instruction.*` သည် တည်ဆောက်မှု ညွှန်ကြားချက် အသုံးဝင်ဝန်ဆောင်မှုများကိုသာ ခေါ်ဆိုသည်။ `submit()` သည် SDK သည်လက်ရှိစရိတ်ဈေးနှုန်းခန့်မှန်းချက်ကိုရယူခြင်း၊ စာရင်းသွင်းထားသော အတိအကျအသုံးဝင်ဝန်ဆောင်မှုကို လက်မှတ်ထိုးခြင်း၊ Torii သို့ပို့ပေးခြင်းနှင့် အခြေအနေကို စောင့်မျှော်ခြင်းဖြစ်သည်။

## အခွန်များနှင့် ငွေပေးချေမှု အကုန်အကျများ {#fees-and-gas}

စာရေးခြင်းလုပ်ငန်းများအတွက် `FeePaymentIntent` နှင့် ငွေကြေးထောက်ပံ့မှု အခွန်လက်ကျန်လိုအပ်သည်။ Taira တွင် အများပြည်သူ testnet ထောက်ပံ့မှုဝန်ဆောင်မှုငွေကြေး testnet XOR ကိုပို့ပေးသည်။ Python SDK သည် လက်မှတ်မထိုးထားသော တည်ငြိမ်စာရင်းကို ပို့ပေးသည် Torii သို့ အသုံးဝင် ကုန်ကျစရိတ်ကို တိကျတဲ့ စျေးနှုန်းခန့်မှန်းချက်တစ်ခုအတွက် တင်သွင်းပေးခြင်းသည် ပေးသူ သို့မဟုတ် အသုံးဝင်ကုန်ကျစရိတ်အား အစားထိုးမှုမရှိကြောင်း အတည်ပြုပြီး အဆိုပါ ရည်ရွယ်ချက်ကို လက်မှတ်ထိုးသည်။ ငွေကြေးရွေးချယ်မှုကို ငွေလဲလှယ်မှု မီတာဒေတာထဲ မထည့်ပါ။

အထက်ပါ `submit()` အကူသည် ငွေပေးချေမှု လက်မှတ်ရေးထိုးသူက ပေးဆပ်ထားသော အကောင့်ရည်ရွယ်ချက်နှင့်စတင်ပြီး လစာသတ်မှတ်ချက်တွေဟာ ရည်ရွယ်ချက်အရအလွတ်ရှိသည်။ `quote_and_sign()` ကလက်မှတ်မထိုးခင် တိုက်ရိုက် quote မှဖြည့်သည်:

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

စာသားပို့မပေးခင် ခွင့်ပြုချက်အဓိကစာရင်းမှာ အခွန်အရင်းအမြစ် လုံလောက်စွာရှိကြောင်း သေချာစေပါ။ တိကျတဲ့ testnet ဘဏ္ဍာရေး ၀ န်ဆောင်မှုနှင့် အရင်းအမြစ် ID သည်ကွန်ရက်အတွက် သီးသန့်ဖြစ်သည်၊ ဒါက Taira ပုံစံပါ။

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

testnet ငွေကြေးထောက်ပံ့မှု ဝန်ဆောင်မှုသည် ဘိလပ်မြေ `asset_id` ကို balance check အတွက်အသုံးပြုရန်ပြန်ပေးသည်။ တိုက်ရိုက် quote ကစရိတ်များ `FEE_ASSET_DEFINITION` ရှိသည်ကိုစစ်ဆေးပါ; ငွေလွှဲပြောင်းမှုတွင် metadata မှတစ်ဆင့် အရင်းအမြစ်ကိုရွေးချယ်ခြင်းမရှိ။

Application metadata ကတော့ ရွေးချယ်စရာဖြစ်ပြီး အခွန်မရှိတဲ့ semantics ကိုပါ သုံးပါတယ်။

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

ငွေကြေးကောက်ခံမှု ရည်ရွယ်ချက်ကို လျစ်လျူရှုပါက၊ မမျှော်လင့်တဲ့ အရင်းအမြစ်အတွက် အဆိုပြုချက်ကို လက်ခံပါက၊ အဆိုပြုပြီးနောက် အသုံးဝင်ဝန်ဆောင်မှုကို ပြောင်းလဲပါက (သို့) ဘဏ္ဍာငွေမရှိသော အကောင့်ဖြင့် လက်မှတ်ရေးထိုးပါက ငွေပေးချေမှုကို တင်ပြခြင်း မရှိရပါ။

## အမည်မသိ Taira ဖတ်နေသည် {#anonymous-taira-reads}

ဒီဖုန်းခေါ်ဆိုမှုတွေမှာ Taira လမ်းကြောင်းတွေသုံးပြီး ကက်သလစ်နယ်နိမိတ်မှာ အမည်မသိ စာဖတ်ခွင့်ပြုပါတယ်။

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

`/v1/time/status` နှင့် `/v1/sumeragi/*` operator point-in-time data view တစ်ခုချင်းစီသည် အသေးစိတ်ကွန်ရက် operator လက်မှတ်ကိုလိုအပ်သော်လည်း ၎င်းတို့အနေအထားမပြောင်းလဲပါ။ အမည်မသိ node အတွက် `request_json("GET", "/status")` ကိုအသုံးပြုပါ။ Connect session status သည် သီးခြားပရိုတိုကောလမ်းကြောင်းတစ်ခုဖြစ်ပြီး ထိုအစည်းအဝေး၏ စီမံခန့်ခွဲမှုလက်မှတ်ကိုလိုအပ်သည်။

## သင်ကြားချက် ဆောက်လုပ်သူများ {#instruction-builders}

နိုင်ငံတကာ SDK အများဆုံးညွှန်ကြားမှုမိသားစုများအတွက် typed ဆောက်လုပ်သူများကိုဖေါ်ထုတ်ပေးပြီး JSON ပထမတန်းအစားမဟုတ်တဲ့ ဗားရှင်းတွေအတွက် ထွက်ပြေးပေါက် Python အောက်ပါ snippets များသည် mutating transaction templates များဖြစ်ပြီး အများပြည်သူအား တင်ပြခြင်း မရှိသေးပါ။ Taira လက်မှတ်ရေးထိုးတဲ့ အကောင့်မရှိဘူး။

Python တန်ဖိုးများကို ပုံမှန်ပြုပြင်ပြီး မတည်ငြိမ်သောပုံစံများတွင် အစောပိုင်းတွင် ကျရှုံးစေသည်။ `Instruction.from_json` ကိုသင်သည် Python အကူမပါသေးသည့် ညွှန်ကြားချက်ကွဲပြားမှုတစ်ခုလိုအပ်သောအခါသာအသုံးပြုပါ။

|သင်ကြားမှု မိသားစု |Python မျက်နှာပြင်|
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|မှတ်ပုံတင် | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` genesis/bootstrap tooling အတွက်သာ သတ်မှတ်ထားပါသည်။ |
|မှတ်ပုံတင်ခြင်း မပြုလုပ်ပါ။|`unregister_trigger`; အခြားဗားရှင်းများအတွက် `Instruction.from_json` ကို အသုံးပြုပါ။ |
|Mint/Burn |`mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`၊ `burn_trigger_repetitions` |
|လွှဲပြောင်းခြင်း| `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa`                                                              |
|မီတာဒေတာများနှင့် ထိန်းချုပ်မှုများ |`set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
|RWA သက်တမ်း စက်ဝန်း| `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa`                                                                                                         |
|ExecuteTrigger |`execute_trigger` |
|ပြန်လည်ထူထောင်ရေး/နေထိုင်မှုတိုးချဲ့ခြင်း |`repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|Native asset lock တွေ| `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, နောက်ပြီး ဖောက်သည် `*_and_wait` အကူအညီပေးသူများ                                                                        |
|Grant/Revocate, SetParameter, Log, Custom, Upgrade နဲ့ ပုံမှန်မဟုတ်တဲ့ Register/Unregister ဗားရှင်းတွေ | `Instruction.from_json` ဒါမှမဟုတ် `TransactionBuilder.add_instruction_json` တစ်ခုတည်းသော ပရိုတိုကောလံနဲ့ `InstructionBox` JSON                                                                                   |

အာမခံပုံစံအခြေခံငွေပေးချေမှုအတွက် ကြည့်ပါ။ [Native Asset Escrow](/my/blockchain/escrow.md#python-asset-locks). Python လက်ရှိတွင် ပထမတန်းစား အကူအညီပေးသူများကို ယေဘုယျအရင်းအမြစ်ပိတ်ခြင်းများအတွက် ဖွင့်လှစ်ထားသည်; စျေးကွက်နှင့် အမည်မသိ escrow အကူအညီ ပေးသူများသည် ပထမတန်းစားမဟုတ်ပါ။ Python နည်းစနစ်တွေ ရှိသေးတယ်

### ဒိုမီနန်းတွေ ဖန်တီးပြီး အကောင့်တွေနဲ့ အရင်းအမြစ်တွေကို မှတ်ပုံတင်ပါ။ {#set-up-domains-then-register-accounts-and-assets}

သာမန်ဒိုမင်ဖန်တီးမှုသည် ကြေညာချက် alias စီမံကိန်းမှတစ်ဆင့်သွားသည် SNS ငှားရမ်းစာချုပ်၊ ပိုင်ရှင်စွမ်းဆောင်ရည်များ၊ အခွန်-စျေးအတည်ပြုစောင့်ရှောက်ရေးနှင့်ဒိုမိုင်းအခြေအနေကို အတူတကွစစ်ဆေးခြင်း။ SDK သို့မဟုတ် Onboarding ဝန်ဆောင်မှုဖြင့် လျှို့ဝှက်ချက်မဲ့ `AliasSetupPlanRequestV1` ရည်ရွယ်ချက်ကိုဖန်တီးပြီးနောက် `iroha app alias setup plan` နှင့် `iroha app alias setup apply` ကိုအသုံးပြုပါ။ လျှောက်လွှာလုပ်ငန်းစဉ်တစ်ခုမှ `Instruction.register_domain` ကိုမတင်ပါနဲ့။ ဒီတည်ဆောက်သူသည် genesis / bootstrap tooling အတွက်ကျန်ရစ်သည်။

Domain setup plan ပြီးဆုံးပြီးနောက် domain ပိုင်ဆိုင်တဲ့ အရာဝတ္ထုတွေကို မှတ်ပုံတင်ပါ။ Taira လို မျှဝေထားတဲ့ ကွန်ယက်မှာ သင့်အတွက် သတ်မှတ်ထားတဲ့ ဒိုမင်နဲ့ အကောင့် နာမည်နေရာကို သုံးပါ။

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

`mintable` လက်ခံသည် `Infinitely`, `Once`, `Not`, ဒါမှမဟုတ် `Limited(n)` ဒေတာမော်ဒယ်က လက်ခံတဲ့ တန်ဖိုးများ `scale` ကန့်သတ်ချက်မရှိတဲ့ ကိန်းဂဏန်းအရင်းအမြစ်အတွက်ပါ။

### အရင်းအမြစ်များကို ထုတ်ပေးခြင်း၊ ဖျက်ဆီးခြင်းနှင့် လွှဲပြောင်းခြင်း {#mint-burn-and-transfer-assets}

ဒီဖုန်းခေါ်ဆိုမှုတွေမှာ လက်ရှိလက်ဝယ် ID ကိုသုံးပါတယ်။ အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကို ပထမဆုံး မှတ်ပုံတင်ပြီး အဲဒီနောက်မှာ လက်ဝယ်ပိုင်ဆိုင်တဲ့ အကောင့်အတွက် တိကျတဲ့ လက်ဝယ် ID တည်ဆောက်ပါ။

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### လွှဲပြောင်းပိုင်ဆိုင်မှု {#transfer-ownership}

ပိုင်ဆိုင်မှုလွှဲပြောင်းခြင်းသည် ဒိုမင်ကိုထိန်းချုပ်သူ၊ အရင်းအမြစ်သတ်မှတ်ချက် (သို့မဟုတ်) NFT ကိုပြောင်းလဲစေသည်။ လက်ရှိပိုင်ရှင်ကို ငွေပေးချေခွင့်လိုင်စင်အဖြစ် အသုံးပြုပါ။

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Metadata ကို Set နှင့် Remove လုပ်ပါ {#set-and-remove-metadata}

metadata values တွေဟာ JSON- serializable ဖြစ်ဖို့လိုပါတယ်။ `TransactionDraft` ကိုသုံးတဲ့အခါမှာ `TransactionConfig` ထဲက authorization principal က default target account ဖြစ်လာတယ်။

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

အဆင့်မြင့် အကူအညီပေးရေး မူကြမ်းက ငွေလဲလှယ်ခွင့်ပြုမှု အရေအတွက်ကို အလိုအလျောက် ပစ်မှတ်ထားတယ်။

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

### လက်တွေ့ကမ္ဘာဆိုင်ရာ အရင်းအမြစ်များ {#real-world-assets}

RWA အကူအညီပေးသူများသည် asset-specific metadata၊ provenance နှင့် controller policy များအတွက် JSON - serializable payloads ကိုအသုံးပြုသည်။ `register_rwa` သည် `id` သို့မဟုတ် `owner` ကိုလက်မခံပါ။ ဆော့ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင်က `RwaId` ကို ဖန်တီးပြီး ငွေပေးချေခွင့်ပြုချက် အရင်းအမြစ်ဟာ မူလပိုင်ရှင် ဖြစ်လာတယ်။

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

`FindRwas`, `/v1/rwas`, RWA အဖြစ်အပျက် (သို့) ဖန်တီးထားတဲ့ ID ကိုရှာဖွေဖို့ သတ်မှတ်ထားသော Explorer လမ်းကြောင်းကို အသုံးပြုပါ။

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

နောက်ဆက်တွဲလုပ်ငန်းများတွင် `hash$domain` ID ကို အသုံးပြုပါ-

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

အပြည့်အဝ လွှဲပြောင်းခြင်းသည် တည်ရှိသည့် ပွဲစဉ်တွင် `owned_by` ကို ပြောင်းလဲနိုင်သည်။ တစ်စိတ်တစ်ပိုင်းလွှဲပြောင်းခြင်းနှင့် ပေါင်းစပ်မှုများသည် ကလေးပွဲများကို ဖန်တီးနိုင်သည်။

### နှိုးစက်များ {#triggers}

အကောင်အထည်ဖော်နိုင်သည်မှာ အခြားညွှန်ကြားချက် အစဉ်တစ်ခုဖြစ်ပါက trigger မှတ်ပုံတင်ကူညီသူများကို အသုံးပြုပါ။

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

Torii သည် trigger inventory အတွက် REST အကူအညီများကိုလည်း ဖေါ်ထုတ်ပေးသည်။

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Trigger inventory calls တွေက trigger record တွေကို ဖတ်ဖို့ (သို့) စစ်ဆေးဖို့ပဲဖြစ်ပါတယ်။ မှတ်ပုံတင်ခြင်း၊ လုပ်ဆောင်ခြင်း၊ ထပ်မံပြောင်းလဲခြင်းနဲ့ မမှတ်ပုံတင်ခြင်းတို့ဟာ အပြောင်းအလဲဖြစ်နေတဲ့ လုပ်ငန်းတွေပါ။

### Repo နှင့် ငွေရေးကြေးဖလှယ်မှု ဖြေရှင်းနည်းညွှန်ကြားချက်များ {#repo-and-settlement-instructions}

Repo နှင့် နှစ်ဖက်ဖြေရှင်းရေး အကူအညီပေးသူများသည် လက်လုပ်လုပ် Norito အသုံးဝင်ဝန်ဆောင်မှုများမပါဘဲ ဒေသအလိုက် သီးခြားညွှန်ကြားချက် ဗားယန်းများကိုထည့်သွင်းခြင်း:

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

### JSON Escape Hatch {#json-escape-hatch}

(က) Python အကူအညီမရဘူးဆိုပါတော့ Single Protocol Standard Data Model ကို feed လုပ်ပေးပါ။ `InstructionBox` JSON သို့ `Instruction.from_json`. ဒါက အကြံပြုတဲ့ လမ်းကြောင်းပါ။ `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, peer/role/NFT မှတ်ပုံတင်ခြင်းနှင့် non-trigger unregister variant တွေကို ဒီအကူအညီတွေကို ရိုက်မသွင်းခင်အထိ။

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

လက်မှတ်ထိုးခြင်းမတိုင်မီ စာရင်းပေးသွင်းမှု မပြောင်းလဲနိုင်သည့် တိကျသော `NetworkId`၊ အခွန်ပေးချေမှုရည်ရွယ်ချက်နှင့်စာရင်းကို ထိန်းသိမ်းထားသည်။ တိုက်ရိုက် `TransactionBuilder` အသုံးပြုရန်အတွက် တူညီသောတန်ဖိုးများအပြင် တိုက်ရိုက်စာရင်းပေးသွင်းမှုကို ရှင်းလင်းစွာလက်ခံရန် လိုအပ်သည်၊ ထို့ကြောင့် လျှောက်လွှာကုဒ်အတွက် ဖြတ်လမ်းမဟုတ်ပါ။

စမ်းသပ်မှုလက်ရာများကို သိုလှောင်ရန်မတိုင်မီ JSON မှတစ်ဆင့် ပြန်လည်သွားလာခြင်း သို့မဟုတ် မထင်ရှားသော ညွှန်ကြားချက်များအတွက်:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## ငွေပေးချေမှု လုပ်ငန်းခွင်များ {#transaction-workflows}

`TransactionDraft` ကို လက်မှတ်မထိုးခင် ညွှန်ကြားချက်များစွာကို တည်ဆောက်တဲ့ အက်ပ်များအတွက် အသုံးပြုပါ။ မူကြမ်းတစ်ခုမှာ `ttl_ms`၊ `nonce` နှင့် metadata တို့လို ငွေပေးချေမှုအဆင့် သတ်မှတ်ချက်များကို တစ်နေရာတည်းတွင် ထားရှိနိုင်ပြီး နောက်တစ်ကြိမ် လက်မှတ်ထိုးပါ:

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

စစ်ဆေးခြင်း၊ စာရင်းစစ်ဆေးခြင်း သို့မဟုတ် ငွေကြေးဝယ်လွှာပေးပို့မှုအတွက် သတ်မှတ်ချက်ဆိုင်ရာ နည်းပညာထုတ်ပြန်ချက်ကို တင်ပို့ပါ

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

အကောင်အထည်ဖော်ရေးလမ်းကြောင်းက တောင်းဆိုတဲ့အခါ လက်မှတ်ထိုးမတိုင်ခင် အကောင်အ ထည်ဖော်ရေး လမ်းကြောင်းရဲ့ ပိုင်ဆိုင်မှု သက်သေခံကို ချိတ်ဆက်ပါ။

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

## မေးခွန်းများ {#queries}

Typed query helpers သည် raw JSON အဘိဓာန်အစား dataclasses ကိုပြန်လည်ပို့ပေးသည်။ ၎င်းတို့သည်စတင်ရန်အလွယ်ဆုံးနည်းဖြစ်သည်။ အကြောင်းက SDK သည်သင်အတွက် pagination နှင့် common record field များကိုစစ်ဆေးလို့ပါ။

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Torii API အပြီးသတ်မှတ်ချက်မှာ software adapter ကို ရိုက်နှိပ်မထားသေးတဲ့အခါ generic request helpers ကိုသုံးပါ။

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

Account inventory assistants များအတွက် SDK ၏ normalizer ကလက်ခံထားသော account ID ကိုလိုအပ်သည်။ Single protocol-standard I105 account ID များ သို့မဟုတ် on-chain alias များကိုအသုံးပြုပါ။ Block explorer (သို့) raw API endpoint တစ်ခုက SDK က ပယ်ချလိုက်တဲ့ ID ကိုပြန်ပို့ရင် ဒီကူညီသူတွေကို ဖုန်းမခေါ်ခင်မှာ single protocol-standard account ID အဖြစ်ဖြေရှင်းပါ။

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## ဖြစ်ရပ်များ {#events}

Streaming helpers က JSON payload တွေကို အလိုအလျောက် decode လုပ်ပေးပါတယ်။ SSE event name, id, retry hint နဲ့ raw payload လိုတဲ့အခါ pass `with_metadata=True` ကို Pass လုပ်ပါ။ Single protocol-standard `/v1/events/sse` feed ဟာ live only ပါ။ ပြန်လည်ဖြန့်ဝေခြင်း ID ကိုမထုတ်ပေးဘဲ ပြန်လည်ဖြန့်ဝေခြင်း မှတ်တမ်းကို မသိမ်းဆည်းတော့တာမို့လို့ ဒီကူညီသူတွေဟာ ညွှန်ပြချက် (သို့) ငြင်းခုံမှုကို ပြန်လည်စတင်ခြင်းမရှိပါဘူး။ ပြန်လည်ဆက်သွယ်မှုတစ်ခုက ၀ ယ်ယူစာရင်းအသစ်တစ်ခုကို စတင်ပြီး ကွာဟချက်ရှိနိုင်သည်။ `/v1/blocks/stream` ကိုအသိအမှတ်ပြုထားတဲ့ အမြင့်ကနေ blockchain ledger သမိုင်းတစ်ခုလုံးကိုလိုအပ်တဲ့အခါ အသုံးပြုပါ။ ဒီဥပမာတွေဟာ တိုက်ရိုက်ဖြစ်ရပ်တွေ စောင့်နေတော့ စီးကြောင်းဖွင့်ပြီး တက်ကြွတဲ့ node တစ်ခုနဲ့ ပြသပါ။

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

## သော့များနှင့်လိပ်စာများ {#keys-and-addresses}

SDK သည် native extension တွင်စုစည်းထားသော လက်မှတ်အယ်လ်ဂိုရီသမ်တစ်ခုစီအတွက် ဒေသတွင်းလက်မှတ်ထိုးကူညီသူများကိုဖေါ်ပြသည်။ ဤကူညီသူများသည် Taira ကိုခေါ်ဆိုခြင်းမရှိသော်လည်း native extension ကိုလိုအပ်သည်။

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

`supported_crypto_algorithms()` ကိုသုံးပြီး သင့်ဘီးကဘာကိုထောက်ပံ့တယ်ဆိုတာကြည့်ပါ။ အထွေထွေကူညီသူတွေဟာ Single Protocol Standard Algorithm labels တွေကိုသုံးပြီး Ed25519, secp256k1, ML-DSA, GOST, BLS နဲ့ SM2 တို့အတွက်အလုပ်လုပ်တယ်။

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

### တရုတ် SM လျှို့ဝှက်ချက် {#chinese-sm-cryptography}

နိုင်ငံတကာ Python SDK အထွေထွေဆေး နှစ်ခုစလုံးကို ဖော်ပြပေးတယ်။ SM2 အကူအညီပေးသူများနှင့် SM2- သီးသန့် သက်တောင့်သက်သာ အကူအညီများ။ node အရည်အချင်း ကြော်ငြာကိုသုံးပြီး SM2 ရည်မှန်းချက်ကွန်ရက်မှ မျှော်လင့်ထားသော ခွဲခြားသတ်မှတ်ချက်:

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

`crypto.sm.enabled` သည် node သည် SM-မိသားစုအယ်လ်ဂိုရစ်သမ်များကို လက်ရှိမူဝါဒတွင်လက်ခံသည်ဆိုသည်ကိုပြောပြသည်။ အလားတူကြော်ငြာတွင် SM cryptographic hash မူဝါဒနှင့် အရှိန်မြှင့်တင်မှုအခြေအနေပါ ၀ င်ပြီး SM2- သီးခြားစီးဆင်းမှုကိုဖွင့်ရန် ဆုံးဖြတ်ရာတွင် အသုံးဝင်သည်:

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

အသုံးချထားသော နိုဒ်အတွက် အထောက်အထားဖြင့် အတည်ပြုထားသည့် စွမ်းဆောင်ရည်ပေးလွှာကို အတည်ပြုရမည့် အခြေခံအချက်အလက်အဖြစ် မှတ်ယူပါ။ `crypto.sm.enabled` သည် true ဖြစ်ပြီး ကြေညာထားသော လက်မှတ်ရေးထိုးမူဝါဒက ခွင့်ပြုမှသာ SM2 ဖြင့် လက်မှတ်ရေးထိုးထားသော ငွေလွှဲမှုကို တင်သွင်းပါ။

### GOST နှင့် Post-Quantum Key များ {#gost-and-post-quantum-keys}

ယေဘုယျ crypto ကိုသုံးပါ။ API အတွက် GOST R 34.10-2012 ပါရီမီတာ အစုများနှင့် ML-DSA (`ml-dsa`) post-quantum လက်မှတ်။ တူညီသော key-pair object ကလက်မှတ်ရေးထိုးခြင်း၊ စစ်ဆေးခြင်းနှင့် multi-hash တင်ပို့မှုကိုကိုင်တွယ်သည်။

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

Gate GOST နှင့် node ၏ authenticated, typed capability ကြော်ငြာတွင် post-quantum flows များကို:

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

node တစ်ခုက သင့်လိုအပ်တဲ့ algorithm ကို ကြော်ငြာမပေးဘူးဆိုရင် key ကို ဒေသတွင်း (သို့) offline workflows အတွက်သာ အသုံးပြုပါ။ အဲဒီ algorithm နဲ့ လက်မှတ်ထိုးထားတဲ့ transaction တွေကို node ထဲမှာ မပို့ပါနဲ့။ အများပြည်သူ Taira စစ်ဆေးမှုအတွင်း GOST နှင့် ML-DSA တို့သည် SDK အထက်စီးကြောင်း Python စာကြည့်တိုက်တွင် crypto helpers အဖြစ်ရရှိနိုင်သော်လည်း ငွေပေးချေမှု လက်မှတ်ရေးထိုးရန် node က ကြော်ငြာခြင်းမရှိခဲ့ပါ။

## Config-Aware Client ကိုဖန်တီးခြင်း {#config-aware-client-creation}

`resolve_torii_client_config` ကို အသုံးပြုပါ အကယ်၍ သင့်အက်ပလီကေးရှင်းသည် file တစ်ခုမှ node setting များကို ဖတ်နေသော်လည်း ပတ်ဝန်းကျင် (သို့) စမ်းသပ်မှုဆိုင်ရာ overrides လိုအပ်နေပါက၊

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

## Kagemusha ပြင်ဆင်မှု {#kagemusha-readiness}

နိုင်ငံတကာ Python SDK current ကို query လုပ်နိုင်ပါတယ် JSON အသင့်ရှိမှု လမ်းကြောင်းကို ၎င်းရဲ့ ယေဘုယျ Torii အကူအညီတောင်းခံသူ

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

Python သည် Kagemusha ထပ်မံဖြည့်စွက်ခြင်း (သို့) ပြန်လည်သိမ်းဆည်းမှုအခမ်းအနား တည်ဆောက်သူများကို မဖော်ထုတ်ပါ။ Single Protocol-Standard V4 အာကာသများတည်ဆောက်ရန် JVM သို့မဟုတ် Swift ကိုရိုက်ကူးထားသော ငွေကြေးအိတ်ကိုအသုံးပြုပြီးနောက်ထောက်ပံ့သည့် Kagemusha Torii ဝယ်သူမှတစ်ဆင့်တင်ပို့၍ စစ်တမ်းကောက်ယူပါ။

## စာရင်းသွင်းခြင်း {#subscriptions}

`iroha_python.ToriiClient` ကသုံးတဲ့ မျှဝေထားတဲ့ Torii ဖောက်သည်ကနေ စာရင်းစာဖတ်ခြင်းနဲ့ မူကြမ်းဆောက်လုပ်သူတွေကို အမွေခံရတယ်။ အပြောင်းအလဲတိုင်းကို ခန္ဓာကိုယ်က ချည်နှောင်ထားတဲ့ တစ်ခုတည်းနဲ့ လက်ခံပါတယ်။ Torii ဟာ ပုဂ္ဂလိက သော့ကို ဘယ်တော့မှ လက်မခံဘူး၊ ခင်ဗျားအတွက် မူကြမ်း မတင်ဘူး။

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

မှန်ကန်တဲ့ အသုံးဝင် ဝန်ဆောင်မှုတစ်ခုစီနဲ့ လက်မှတ်ထိုးခြင်း သတင်းစကားတွေကို သက်ဆိုင်ရာ အကောင့်ရဲ့ ဒေသတွင်း ငွေကြေးအိတ်ကို ပေးပါ၊ အဲဒီမှာ တောင်းဆိုထားတဲ့ လုပ်ဆောင်ချက်ကို စစ်ဆေး၊ လက်မှတ်ထိုးထားတဲ့ ငွေပေးချေမှုကို စုစည်းပြီး ပုံမှန် ငွေလဲလှယ်ရေး ဆော့ဖ်ဝဲ စီမံခန့်ခွဲမှု အလုပ်ဖြစ်စဉ်ကနေ ပို့ပါ။ Python SDK သည် လက်မှတ်ရေးထိုးခြင်း သတင်းစကားသည် ပြန်လည်ပို့သော အသုံးဝင်ဝန်ဆောင်မှု၏ တစ်ခုတည်းသော ပရိုတိုကောလံစံညွှန်း cryptographic hash ဖြစ်သည်ကို အတည်ပြုသော်လည်း လက်မှတ်ရေးမတင်မီ ငွေကြေးအိတ်သည် ငွေပေးချေမှုကို ဖြေဆိုရန်နှင့် ခွင့်ပြုရန် တာဝန်ရှိဆဲဖြစ်သည်။

## ချိတ်ဆက်ခြင်း {#connect}

ဒေသတွင်းတွင် Connect URIs ကိုတည်ဆောက်ပြီးစစ်ဆေးပါ။ Connect လက္ခဏာတစ်ခုသည် SID ကိုတိကျသော `NetworkId`, app အများသုံးသော့နှင့် cryptographic nonce တန်ဖိုးသို့ ချည်နှောင်သည်။

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

အဆိုပါတိကျသော ကြိုတင်ကြည့်ရှုမှုကို ရည်မှန်းချက် node က Connect ကိုဖေါ်ပြသောအခါသာ မှတ်ပုံတင်ပါ။ Session creation သည် role-specific bearer tokens လေးခုကိုပြန်လည်ပို့ပေးသည်။ session တစ်ခုစီအခြေအနေလမ်းကြောင်းသည် စီမံခန့်ခွဲမှု token ကိုလိုအပ်သည်။ aggregate status သည် operator လမ်းကြောင်းတစ်ခုဖြစ်သည်။

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

အတည်ပြုပြီးနောက် စာတိုများကို stateful session ဖြင့် encrypt လုပ်ပါ။

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

## အုပ်ချုပ်ရေး၊ ဆော့ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင်နှင့် Admin Surfaces {#governance-runtime-and-admin-surfaces}

[မျှဝေထားသော Setup](#shared-setup) မှ ခွင့်ပြုချက် မူရင်းနှင့် သော့စုံကို အသုံးပြု၍ အကူအညီခေါ်ဆိုမှုတစ်ခုစီကို Taira ၏ တိကျသော ပင်မဗီဇမှ ရယူထားသော `NetworkId` သို့ ချိတ်ဆက်ပါ။

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

operator read များအတွက် သီးခြား client ကိုဖန်တီးပါ။ allow-listed operator key ကို software execution environment မှာ load လုပ်ပြီး Taira ရဲ့ exact `NetworkId` နဲ့ ချိတ်ဆက်လိုက်ပါ။ bearer tokens တွေနဲ့ `x-api-token` တို့က ဒီလက်မှတ်ကို အစားထိုးမပေးပါနဲ့။

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

Runtime upgrade လမ်းကြောင်းတွေဟာ operator authenticated instruction building တွေပါ။ အောင်မြင်စွာ အဆိုပြုခြင်း၊ တက်ကြွခြင်း သို့မဟုတ် ဖျက်သိမ်းခြင်း တုံ့ပြန်မှုပြန်ကြားချက် `tx_instructions`; ဒါက upgrade ကို မတည်ထောင်ဘူး။ ပုံမှန် လက်မှတ်ထိုးထားတဲ့ ငွေချေးမှုနဲ့ အုပ်ချုပ်ရေးလမ်းကြောင်းကနေ ဒီပုံးကို တင်ပါ။ Python နည်းစနစ်များ `propose_runtime_upgrade`, `activate_runtime_upgrade`, နှင့် `cancel_runtime_upgrade` လက်ရှိတွင် ဖောက်သည်၏ တောင်းဆိုချက်များကို အသုံးချခြင်းအစား ရှင်းလင်းသော တောင်းဆိုချက်များ ထုတ်ပေးရန် `OperatorSigningContext`, ဒီတော့ ဒီသင်ခန်းစာက သူတို့ကို အလုပ်လုပ်သူ စီးဆင်းမှုအဖြစ် မတင်ပြဘူး။

## အခြေအနေ၊ သဘောတူညီချက်နှင့် ကွန်ရက် တယ်လီမီထရီ {#status-consensus-and-network-telemetry}

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

## SoraFS၊ UAID နှင့် Kaigi အကူအညီပေးသူများ {#sorafs-uaid-and-kaigi-helpers}

Nexus/SORA API အဆုံးသတ်မှတ်ချက်တွေကို ရည်မှန်းထားတဲ့ node က ဖော်ပြတဲ့အခါ ဒီကူညီသူတွေဟာ ရနိုင်တာပါ။ ပစ်လွတ်စာရင်းတွေကို သက်ဝင်တဲ့ တုံ့ပြန်မှုတစ်ခုအဖြစ် ဆက်ဆံပါ။ အများပြည်သူ Taira မှာ နမူနာနည်းပညာထုတ်ပြန်ချက် (သို့) UAID အတွက် ဒေတာမရှိဘဲ လမ်းကြောင်းဖွင့်ထားနိုင်ပါတယ်။

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

## Norito RPC နှင့် GPU အကူအညီပေးသူများ {#norito-rpc-and-gpu-helpers}

Norito bytes ရှိပြီးသားမှာ `NoritoRpcClient` ကိုအသုံးပြုပြီး ဘိုင်နရီ Torii API အဆုံးမှတ်ကိုခေါ်ရန်လိုအပ်ပါက အသုံးပြုပါ။ ဥပမာတွင် ယခင် ငွေပေးချေမှုပုံစံမှ လက်မှတ်ထိုးထားသော ဒေတာအိုးတစ်ခု လိုအပ်သည်။

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

CUDA အကူတွေက backend မရှိတဲ့အခါ `None` ကိုပြန်ပို့တော့ applications တွေက scalar implementations တွေကို ပြန်ရောက်လာနိုင်ပါတယ်

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## လက်ရှိအကာအကွယ် {#current-coverage}

Python SDK တွင် အောက်ပါအတွက် အကူအညီများ ပါဝင်ပြီးသား:

- Torii တင်ပြမှု၊ အခြေအနေ၊ မေးမြန်းမှုနှင့် စီမံခန့်ခွဲရေး စီးဆင်းမှုများ
- Common ISI နှင့် domain-specific extension များအတွက် typed instruction constructors များ
- Transaction drafts, technical manifests, signing and signed transaction data container workflows များ၊ လက်မှတ်ရေးထိုးခြင်းနှင့် လက်မှတ်ရေးဆွဲထားသော ငွေပေးချေမှု အချက်အလက်များ
- တိုက်ရိုက်ဖြစ်ရပ်စီးကြောင်းများနှင့် ရိုက်နှိပ်သော filter များ; နောက်ဆုံးသတ်မှတ်ထားသော block စီးကြောင်းများသည်အပြည့်အဝသမိုင်းကိုပေးသည်။
- အထွေထွေ Kagemusha အသင့်ရှိမှု access နှင့် Torii subscription assistants များ၊ ထိပ်သွင်းထားတဲ့ top-up နှင့် redeem build တွေကို မဖွင့်လှစ်ပါ။
- အကောင့်လိပ်စာ၊ အယ်လ်ဂိုရစ်သမ်အားလုံးရဲ့ လက်မှတ်ရေးထိုးမှု အကူအညီများ၊ SM2, GOST, ML-DSA, BLS နှင့် လျှို့ဝှက်သော့ကိုင်တွယ်ခြင်းအတွက် multi-hash round trip များ
- URIs ကို ချိတ်ဆက်ခြင်း၊ အစည်းအဝေးများ၊ ဖေ့ခ်များ၊ ကုဒ်ရေးခြင်း အကူအညီများနှင့် မှတ်ပုံတင် အုပ်ချုပ်သူ
- စီမံခန့်ခွဲမှု, ဆော့ဝဲ အကောင်အထည်ဖော်ရေး ပတ်ဝန်းကျင် အဆင့်မြှင့်တင်ခြင်း, Sumeragi, node-admin, SoraFS, UAID နှင့် Kaigi API အဆုံးသတ်မှတ်ချက် ဆော့ဝယ်အက်ဒါပတာများတွင် node သည်ဤလက္ခဏာများကိုဖေါ်ပြသည်။

## အထက်ပိုင်းဆိုင်ရာ ရည်ညွှန်းချက်များ {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

အဲဒီဖိုင်တွေဟာ ပိတ်ထားတဲ့ အလုပ်ခွင် ပြင်ဆင်မှုမှာရှိတဲ့ Python မျက်နှာပြင်အတွက် အမှန်တရားရဲ့ အရင်းအမြစ်ပါ။
