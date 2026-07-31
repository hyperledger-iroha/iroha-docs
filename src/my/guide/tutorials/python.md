---
translation_locale: my
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

နိုင်ငံခြားရေး Python SDK အထက်ပိုင်း အလုပ်ခွင်မှာ `iroha-python`. ပထမဆုံး Iroha 3
ထုတ်လွှတ်မှု ရည်မှန်းချက်များ Torii နှင့် Norito မျက်နှာပြင်များ
(သို့) သင့်ရဲ့ ပေါင်းစပ်မှုမှာ အသုံးပြုတဲ့ အရင်းအမြစ် ပြင်ဆင်ခြင်း SDK node တွေကို ဆက်ထားပါ။
ကြိုးဖောက်ပုံစံတည်းဖြတ်ချက်

အောက်ပါ ဖတ်လို့သာရတဲ့ နမူနာတွေကို အများပြည်သူနဲ့ စစ်ဆေးခဲ့ပါတယ်။ Taira at ကို
`https://taira.sora.org`. အပြောင်းအလဲ ဥပမာများမှာ ငွေကြေးပရိုဂရမ်များဖြစ်ပါတယ်
တကယ့်ကိုလိုအပ်ပါတယ် Taira အာဏာပိုင်၊ ပုဂ္ဂလိက သော့၊ ဓာတ်ငွေ့ metadata နှင့် မည်သည့် operator
ရည်မှန်းချက်လမ်းကြောင်းက ပေးပို့နိုင်မည့် Tokens တွေကို တင်ပြပါ။

ဥပမာတွေကို ဒီအစီအစဉ်မှာ သုံးပါ။

| အဆင့် | အများပြည်သူနဲ့ ပြိုင်ပွဲဝင် Taira? | သင်လိုအပ်တာ |
| --- | --- | --- |
| ဖတ်ရန်သာ အသုံးပြုနိုင်သော ဖောက်သည်ခေါ်ဆိုမှုများ | ဟုတ်ပါတယ် | Python package plus network access ကို |
| ဒေသတွင်း လက်မှတ်ရေးထိုးခြင်းနှင့် ညွှန်ကြားမှု တည်ဆောက်သူများ | ကွန်ရက်ခေါ်ဆိုမှုမရှိဘူး `submit()` | Native extension နဲ့ သင့်ရဲ့ အဓိက ပစ္စည်း |
| ငွေလဲလှယ်မှုနှင့် ဝန်ဆောင်မှုခေါ်ဆိုမှုများ | သင့်ကိုယ်ပိုင် ငွေကြေးထောက်ပံ့တဲ့ အကောင့်နဲ့သာ | အာဏာပိုင်စာရင်း၊ ပုဂ္ဂလိက သော့၊ ကွင်းဆက် ID, အခွန် metadata, အခွန်လက်ဝယ်စာရင်းနှင့်လမ်းကြောင်း tokens |
| Frame codecs, crypto ကိုဆက်သွယ်ပြီး GPU အကူအညီပေးသူများ | ဒေသတွင်းပဲ | Native extension ကို GPU အကူအညီပေးသူတွေလည်း CUDA- backend လုပ်နိုင်တယ် |

## တပ်ဆင်ခြင်း {#install}

Package metadata အမည်က `iroha-python`. မတည်ငြိမ်ဘူးလို့ ယူဆမထားပါနဲ့ PyPI
Install ကို Live နဲ့ လိုက်ဖက်ပါတယ်။ Taira Network ကို install လုပ်ပါ။ wheel ဒါမှမဟုတ် source checkout ကို install လုပ်လိုက်ပါ။
သင့်ရဲ့ ပေါင်းစပ်ရေး ရည်မှန်းချက်တွေကို မြင့်တက်တဲ့ အဆင့်ကို ပြန်လည်သုံးသပ်ခြင်းကနေ တည်ဆောက်ထားတာပါ။

```bash
python -m pip install /path/to/iroha_python-*.whl
```

သင့်စီမံကိန်းက Upstream အလုပ်ခွင်ကို တိုက်ရိုက်သုံးတယ်ဆိုရင် Python
dependencies တွေကို run မလုပ်ခင် native extension ကို build လုပ်ပေးပါ
`Instruction`, `TransactionDraft`, လက်မှတ်ရေးထိုးခြင်း, crypto, SoraFS ဒေသခံ အကူအညီပေးသူတွေ၊ GPU
အကူအညီပေးသူ (သို့) Connect frame codec များကို အသုံးပြုပါ။ build command ကို upstream ကနေ
`python/iroha_python/README.md`, ထို့နောက် ဒေသတွင်းတင်ပို့မှု ဝန်ဆောင်မှုရှိသည်ကို စစ်ဆေးပါ။

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

(သို့) `create_torii_client` တင်သွင်းမှု `Instruction` ဒါမှမဟုတ်
`generate_ed25519_keypair` ကျရှုံးသွားတယ်၊ သန့်ရှင်းတဲ့ Python ပါကစ္စတန်မှာ
ဒေသခံ extension ကတော့ မဟုတ်ဘူး။

## အမြန်စတင်ခြင်း {#quickstart}

အများပြည်သူနဲ့ စလိုက်ပါ၊ ဖတ်ဖို့ပဲ Taira အဆုံးသတ်မှတ်ချက်များ

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

အပြောင်းအလဲရှိတဲ့ Template တွေအတွက် ဒီ settings ကိုသုံးပါ။ placeholder တစ်ခုစီကို
Taira အာဏာ၊ ပုဂ္ဂလိက သော့၊ လက်မှတ်နဲ့ အရင်းအမြစ်/စာရင်း IDs ခင်ဗျားရဲ့ တပ်ချမှုကနေ
တင်ပြမပေးခင်

`authority` ငွေပေးချေမှုကို လက်မှတ်ထိုးတဲ့ အကောင့်ပါ။ `private_key` ကိုက်ညီမှု ရှိရပါမယ်။
အဲဒီစာရင်းကို `CHAIN_ID` ရည်မှန်းချက်ကွန်ရက်နဲ့ ကိုက်ညီဖို့လိုပြီး `TX_METADATA` အသေအချာ
အွန်လိုင်းက မျှော်မှန်းထားတဲ့ အခကြေးနယ်ပယ်တွေကို ထည့်သွင်းပါ။ အောက်ပါနေရာပိုင်ရှင်တွေကတော့
ကြံစည်ပြီး မတည်ငြိမ်ဖြစ်လို့ မတော်တဆ တင်ပြတာမဟုတ်ဘူး။

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

`Instruction.*` အော်တိုက ညွှန်ကြားချက် အသုံးဝင်ပစ္စည်းတွေ တည်ဆောက်ဖို့ပဲ ခေါ်ပါတယ်။ `submit()` အဲဒါက
နေရာမှာ SDK ငွေပေးချေမှုကို လက်မှတ်ထိုးပြီး Torii, နောက်ပြီး စောင့်နေတာက
အခြေအနေ။

## အခွန်များနှင့် ဓာတ်ငွေ့ {#fees-and-gas}

စာရေးခြင်းလုပ်ငန်းများအတွက် အခွန် metadata နှင့် ငွေကြေးထောက်ပံ့ခွန်အရင်းအမြစ် balance ကိုလိုအပ်သည်။ Taira,
ငွေကြေးစရိတ်အက်ဆစ်ကို အများပြည်သူက ဘဏ္ဍာငွေပေးချေထားပြီး ငွေလဲလှယ်မှု metadata တွေဟာ
ပါဝင်ပါ `gas_asset_id`. အပေါ် Minamoto, အခကြေးကို အရှိန်နဲ့ ပေးဆပ်ရမယ်။ XOR ပြီးတော့ အရင်းအမြစ်
ID အဲဒီကွန်ရက်ရဲ့ ဖွဲ့စည်းပုံကနေ လာတာပါ။

အခွန် metadata ကိုပုဂ္ဂိုလ်ရေးညွှန်ကြားချက်များမဟုတ်ဘဲ ငွေပေးချေမှုအပေါ်ပါ
`submit()` အထောက်အပံ့ပေးသူ `TX_METADATA` တည်ဆောက်တဲ့ ငွေချေးမှုတိုင်းအတွက်-

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

စာမပို့ခင် အာဏာပိုင်စာရင်းမှာ အခွန်အလုံအလောက်ရှိတာကို သေချာအောင်လုပ်ပါ။
ပိုက်နဲ့ ပိုက်အတိအကျပါ။ ID ကွန်ယက်ဆိုင်ရာ သီးသန့်ဖြစ်ပါတယ် Taira
ပုံသဏ္ဍာန်

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

ရေနွေးကြိုးက ဘိလပ်မြေကို ပြန်ပေးတယ်။ `asset_id` ငွေကြေးပမာဏကို စစ်ဆေးဖို့ သုံးပါတယ်။
`gas_asset_id` metadata field က fee asset ကို အသုံးပြုတယ်။ ID.

မြေပုံတင်ခြင်းများကို ပေါင်းစပ်ခြင်းဖြင့် လျှောက်ထားမှု metadata များကို အခွန် metadataများမှ သီးခြားထားပါ။
ငွေပေးချေမှု တည်ဆောက်တဲ့အခါ:

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

အကယ်၍ အခကြေး metadata ကိုလွဲချော်ပါက, မှားယွင်းသောခကြေးအက်ဆစ်ကိုသုံးပါ, သို့မဟုတ်ငွေမထောက်ပံ့တဲ့
အကောင့်, တကယ့်ကွန်ရက်သည် ညွှန်ကြားချက်
အသုံးဝင်တဲ့ ဝန်ထုပ်က အခြားနည်းနဲ့ သက်ရောက်ပါတယ်။

## Taira- စစ်ဆေးထားတဲ့ စာဖတ်ရုံပဲ ဖုန်းခေါ်ဆိုမှု {#taira-checked-read-only-calls}

ဒီဖုန်းခေါ်ဆိုမှုတွေဟာ အများပြည်သူကို အောင်မြင်စွာ ပြန်လည်တိုက်ခိုက်ခဲ့တယ်။ Taira:

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

လမ်းကြောင်းများ `/v1/status`, အများပြည်သူ တူညီမှုအရင်းအမြစ်စာရင်း၊ Sumeragi RBC နမူနာယူခြင်း၊ node
admin snapshots တွေနဲ့ Connect app registry administration တွေကို အများပြည်သူကြားမှာ မထုတ်ပြန်ခဲ့ပါဘူး။
ရယူနိုင်သည် Taira စစ်ဆေးမှုအတွင်းမှာ သုံးပါ။ `request_json("GET", "/status")` အတွက်
အများသုံး node status သုံးစွဲမှု Taira.

## ညွှန်ကြားချက် ဆောက်လုပ်သူများ {#instruction-builders}

နိုင်ငံခြားရေး SDK အများဆုံးညွှန်ကြားမှုမိသားစုများအတွက် typed ဆောက်လုပ်သူများကိုဖေါ်ထုတ်ပေးသည်
JSON ပထမတန်းအစားမဟုတ်တဲ့ ဗားရှင်းတွေအတွက် လွတ်မြောက်ရေးအပေါက် Python နည်းစနစ်တွေ ရှိသေးတယ်
အောက်ပါ snippets များသည် mutating transaction templates များဖြစ်ပြီး
အများပြည်သူထံ တင်ပြထားသည် Taira လက်မှတ်ထိုးတဲ့ အကောင့်မရှိဘူး။

Typed helpers တွေကို ကြိုက်တယ် သူတို့ရှိတဲ့အခါမှာ ပုံမှန်ဖြစ်အောင်လုပ်တယ် Python တန်ဖိုးများနှင့် ကျရှုံးမှု
မမှန်ကန်တဲ့ ပုံစံတွေကို အစောပိုင်းမှာ သုံးပါ။ `Instruction.from_json` သင့်အတွက် လိုအပ်တဲ့ အချိန်မှာသာ
ညွှန်ကြားချက် အမျိုးအစားမှာ Python အကူအညီပေးသူပါ။

| သင်ကြားမှု မိသားစု | Python မျက်နှာပြင် |
| --- | --- |
| မှတ်ပုံတင် | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` genesis/bootstrap tooling အတွက်သာ သတ်မှတ်ထားတယ်။ |
| မှတ်ပုံတင်ခြင်းမရှိ | `unregister_trigger`; အသုံးပြုမှု `Instruction.from_json` အခြားပုံစံများအတွက် |
| သံပုရာသီး / မီးရှို့ခြင်း | `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
| လွှဲပြောင်းခြင်း | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
| မီတာဒေတာနဲ့ ထိန်းချုပ်မှု | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
| RWA သက်တမ်း စက်ဝန်း | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
| ExecuteTrigger | `execute_trigger` |
| Repo/ settlement extension များ | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
| Native asset lock များ | `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, ဝန်ထမ်းနဲ့အတူ `*_and_wait` အကူအညီပေးသူများ |
| Grant/Revoke ကို SetParameter, Log၊ Custom, Upgrade နဲ့ Register/Unregister အနည်းဆုံး တွေ့ကြုံရတဲ့ variant တွေ | `Instruction.from_json` ဒါမှမဟုတ် `TransactionBuilder.add_instruction_json` ကနောနိဗာန်နဲ့ `InstructionBox` JSON |

အီလက်ထရောနစ်နိုင်ငံများမှ ငွေကြေးထောက်ပံ့မှု
[Native Asset Escrow](/my/blockchain/escrow.md#python-asset-locks). Python
လက်ရှိတွင် ပထမတန်းစား အကူအညီပေးသူများအတွက် အထွေထွေအရင်းအမြစ်ပိတ်ရက်များ; စျေးကွက်နှင့်
အမည်မသိ escrow အကူအညီပေးသူတွေဟာ ပထမတန်းစား မဟုတ်ဘူး။ Python နည်းစနစ်တွေ ရှိသေးတယ်

### ဒိုမင်များ ဖန်တီးပြီး နောက်တွင် အကောင့်များနှင့် ပိုင်ဆိုင်မှုများကို မှတ်ပုံတင်ပါ {#set-up-domains-then-register-accounts-and-assets}

သာမန်ဒိုမင်ဖန်တီးမှုက ကြေညာရေး alias စီမံကိန်းမှတစ်ဆင့်ဖြစ်သည် SNS
ငှားရမ်းမှု၊ ပိုင်ရှင်စွမ်းဆောင်ရည်တွေ၊ quote guard နဲ့ domain status တွေကို အတူတကွ စစ်ဆေးပါတယ်။
လျှို့ဝှက်ချက်မဲ့ ဖန်တီးပါ။ `AliasSetupPlanRequestV1` သင့်ရဲ့ ရည်ရွယ်ချက် SDK ဒါမှမဟုတ်
ဘုတ်တင် ဝန်ဆောင်မှုကို သုံးပြီး `iroha app alias setup plan` နှင့်
`iroha app alias setup apply`. မတင်ပါနဲ့။ `Instruction.register_domain`
Application Transaction တစ်ခုမှ ဖြစ်ပေါ်လာပြီး အဲဒီ Builder က genesis/bootstrap အတွက် ကျန်နေသေးတယ်
ကိရိယာတွေ လုပ်ပေးတယ်။

Domain setup plan က commit လုပ်ပြီးနောက် domain ပိုင်ဆိုင်တဲ့ အရာဝတ္ထုတွေကို မှတ်ပုံတင်ပါ။
ကွန်ရက်များ Taira, သင့်အတွက် သတ်မှတ်ထားတဲ့ domain နဲ့ account namespace ကို သုံးပါ။

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

`mintable` လက်ခံ `Infinitely`, `Once`, `Not`, ဒါမှမဟုတ် `Limited(n)` လက်ခံထားတဲ့ တန်ဖိုးများ
ဒေတာပုံစံကို ချန်ထားပါ။ `scale` ကန့်သတ်ချက်မရှိတဲ့ ကိန်းဂဏန်းအရင်းအမြစ်အတွက်ပါ။

### ငွေကြေး၊ မီးရှို့ခြင်းနှင့် လွှဲပြောင်းမှု {#mint-burn-and-transfer-assets}

ဒီဖုန်းခေါ်ဆိုမှုတွေမှာ ရှိနေတဲ့ အရင်းအမြစ်ကို သုံးပါတယ်။ ID. အရင်းအမြစ် သတ်မှတ်ချက်ကို ပထမဆုံး မှတ်ပုံတင်ပြီးနောက်
ကွန်ကရစ် အရင်းအမြစ် တည်ဆောက်ခြင်း ID အရင်းအမြစ်ပိုင်ဆိုင်သူအတွက်

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### လွှဲပြောင်းပိုင်ဆိုင်မှု {#transfer-ownership}

ပိုင်ဆိုင်မှု လွှဲပြောင်းခြင်း ဒိုမင်ကို ထိန်းချုပ်သူ၊ အရင်းအမြစ် သတ်မှတ်ချက် သို့မဟုတ် NFT.
လက်ရှိပိုင်ရှင်ကို ငွေပေးချေမှု အာဏာအဖြစ် သုံးပါ။

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Metadata ကို Set နှင့် Remove လုပ်ပါ {#set-and-remove-metadata}

Metadata တန်ဖိုးများသည် JSON- serialisable. `TransactionDraft`, ကော်မတီ
အာဏာရှိသူ `TransactionConfig` ကြံစည်ထားတဲ့ ရည်မှန်းချက်စာရင်း ဖြစ်လာတယ်။

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

အဆင့်မြင့် အကူအညီပေးရေး မူကြမ်းက ငွေလဲလှယ်မှု အာဏာပိုင်ကို အလိုအလျောက် ရည်မှန်းထားသည်

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### လက်တွေ့ကမ္ဘာဆိုင်ရာ အရင်းအမြစ်များ {#real-world-assets}

RWA အကူအညီပေးသူများ အသုံးပြု JSON- အရင်းအမြစ်ဆိုင်ရာ metadata အတွက် serialisable payloads များ၊
မူလနေရာ၊ ထိန်းချုပ်သူ မူဝါဒ။ `register_rwa` လက်မခံဘူး `id` ဒါမှမဟုတ်
`owner`: Runtime က `RwaId`, ငွေပေးချေမှု အာဏာပိုင်
မူလပိုင်ရှင် ဖြစ်လာတယ်။

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

မှတ်ပုံတင်လုပ်ငန်းက တာဝန်ယူပြီးနောက် အသုံးပြုခြင်း `FindRwas`, `/v1/rwas`, တစ် RWA
ဖြစ်ရပ် (သို့) ရှာဖွေရေးလမ်းကြောင်းကို ဖန်တီးထားသော ID:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

နောက်ဆက်တွဲလုပ်ငန်းစဉ်များတွင် ထုတ်လုပ်သော `hash$domain` ID:

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

ငွေလွှဲပြောင်းမှု အပြည့်အဝ ပြောင်းလဲနိုင်ပါတယ် `owned_by` လက်ရှိစခန်းတွင် အပိုင်းဆိုင်ရာ လွှဲပြောင်းမှုနှင့်
ပေါင်းစပ်မှုတွေက မွေးဖွားတဲ့ ကလေးတွေ ဖန်တီးတယ်။

### နှိုးဆော်မှု {#triggers}

အကောင်အထည်ဖော်နိုင်သည်မှာ အခြားညွှန်ကြားချက်တစ်ခုဖြစ်ပါက trigger မှတ်ပုံတင်ကူညီသူများကိုအသုံးပြုပါ။
အစဉ်:

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

Torii ဒါ့အပြင် REST trigger inventory အတွက် အကူအညီများ:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Trigger inventory calls တွေကို ဖတ်ကြည့်ဖို့ ဒါမှမဟုတ် trigger record တွေကို စစ်ဆေးဖို့ပဲ
အကောင်အထည်ဖော်ခြင်း၊ ထပ်ခါထပ်ခါ ပြောင်းလဲခြင်းနဲ့ မှတ်ပုံတင်မပြုခြင်းဟာ အပြောင်းအလဲဖြစ်နေတဲ့ လုပ်ဆောင်ချက်တွေပါ။

### ပြန်လည်ထူထောင်ရေးနှင့် ဖြေရှင်းရေး ညွှန်ကြားချက်များ {#repo-and-settlement-instructions}

Repo နှင့် နှစ်နိုင်ငံချင်း အခြေချရေး အကူအညီပေးသူများက နယ်ပယ်ဆိုင်ရာ ညွှန်ကြားချက်များကို ဖြည့်စွက်
လက်နဲ့လုပ်တဲ့ ပုံစံမျိုး Norito အသုံးဝင်သော ဝန်ဆောင်မှုများ:

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

(က) Python အကူအညီမပေးသေးဘူးဆိုပါစို့၊ ကန်နီကလစ် ဒေတာပုံစံကို ပေးပါ။
`InstructionBox` JSON သို့ `Instruction.from_json` (သို့) တိုက်ရိုက်
`TransactionBuilder.add_instruction_json`. ဒါက အကြံပြုတဲ့ လမ်းကြောင်းပါ။
`Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, peer/role NFT
မှတ်ပုံတင်ခြင်းနှင့် trigger မဖြစ်မနေသော unregister variant များကို
ရိုက်နှိပ်ထားတယ်။

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

ထုတ်ပေးထားတဲ့ (သို့) မရှင်းလင်းတဲ့ ညွှန်ကြားချက်အတွက် အပြန်အလှန် ခရီးစဉ် JSON သိုလှောင်မတင်ခင်
တပ်ဆင်ချက်များ:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## ငွေပေးချေမှု လုပ်ငန်းခွင်များ {#transaction-workflows}

အသုံးပြုခြင်း `TransactionDraft` များပြားလှတဲ့ ညွှန်ကြားချက်တွေကို တည်ဆောက်တဲ့ အက်ပ်တွေအတွက်
လက်မှတ်ရေးထိုးခြင်း။ Draft တစ်ခုမှာ Transaction Level Settings တွေကို `ttl_ms`,
`nonce`, metadata ကို တစ်နေရာတည်းမှာ တင်ပြီး လက်မှတ်ထိုးလိုက်ပါ။

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

စာရင်းစစ်ဆေးခြင်း၊ စစ်ဆေးခြင်း သို့မဟုတ် ငွေကြေးဝယ်လွှာပေးပို့ခြင်းအတွက် သတ်မှတ်ချက်ထုတ်ပြန်ချက်:

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

လက်မှတ်မထိုးခင် လမ်းကြောင်းအတွင်းက ကိုယ်ရေးကိုယ်တာ လုံခြုံမှု သက်သေခံချက်ကို ချိတ်ဆက်ပေးပါ

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

## မေးခွန်းများ {#queries}

Typed query helpers တွေက raw အစား dataclasses ကိုပြန်ပို့ပေးတယ် JSON အဘိဓာန်တွေ
စဖို့အလွယ်ဆုံးနည်းက SDK parses pagination နှင့်အများဆုံး
သင်အတွက် မှတ်တမ်းတင်တဲ့ ကွင်းများ:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

General request helpers ကို အသုံးပြုပါ။ Torii endpoint မှာ type မလုပ်သေးဘူး
ပုံး:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

Account inventory အကူအညီများအတွက် Account ID ကို SDK ဒါက
normalizer ကို အသုံးပြုပါ။ I105 အကောင့် IDs ဒါမှမဟုတ် သံကြိုးပေါ်မှာ အမည်မဖော်လိုပါက
explorer (သို့) raw endpoint ကိုပြန်ပေးသည် ID ဒီ SDK ပယ်ချလိုက်ရင်
တရားဝင်စာရင်း ID ဒီကူညီသူတွေကို မခေါ်ခင်မှာ၊

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## ဖြစ်ရပ်များ {#events}

Streaming အကူများ decode JSON အလိုအလျောက် အသုံးဝင်တဲ့ ဝန်ဆောင်မှုပါ။ Pass `with_metadata=True`
လိုအပ်တဲ့အခါမှာ SSE ဖြစ်ရပ်အမည်၊ ID၊ ထပ်မံစမ်းသပ်မှု ညွှန်ကြားချက်နဲ့ raw payload ကို။
နှင့်အတူ `EventCursor` နောက်ဆုံးဖြစ်ရပ် ID ကို persist လုပ်ဖို့
event တွေကို run လုပ်ပေးပါ
လုပ်နိုင်ပြီး တက်ကြွပါတယ်။

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

## သော့များနှင့်လိပ်စာများ {#keys-and-addresses}

နိုင်ငံခြားရေး SDK compile လုပ်ထားတဲ့ လက်မှတ်အယ်လ်ဂိုရစ်သမ်တိုင်းအတွက် ဒေသတွင်းလက်မှတ်ရေးထိုးကူညီသူတွေကို ဖော်ပြပေးတယ်။
ဒီကူညီသူတွေဟာ Taira, ဒါပေမဲ့ သူတို့လိုအပ်တာက
ဒေသတွင်း တိုးချဲ့မှု

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

အသုံးပြုခြင်း `supported_crypto_algorithms()` ခင်ဗျားရဲ့ ဘီးက ဘာကို ထောက်ခံနေလဲဆိုတာ ကြည့်ဖို့ပါ။
အထွေထွေကူညီသူတွေက Canonical algorithm labels ကိုသုံးပြီး Ed25519 အတွက် အလုပ်လုပ်တယ်။
secp256k1 ML-DSA, GOST, BLS, နှင့် SM2 အဲဒီအယ်လ်ဂိုရစ်သမ်တွေကို:

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

### တရုတ် SM ပိုးမွှား {#chinese-sm-cryptography}

နိုင်ငံခြားရေး Python SDK အထွေထွေဆေး နှစ်ခုစလုံးကို ဖော်ပြပေးတယ်။ SM2 အကူအညီပေးသူများနှင့် SM2- အထူးအဆင်ပြေမှု
အကူအညီပေးသူများ။ node အရည်အသွေး ကြော်ငြာကို အသုံးပြုပြီး SM2 ခြားနားခြင်း
ရည်မှန်းချက်ကွန်ရက်မှ မျှော်လင့်ထားသော မှတ်သားစရာ:

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

`crypto.sm.enabled` node က လက်ခံလားဆိုတာ ပြောပြတယ်။ SM- မိသားစု အယ်လ်ဂိုရစ်သမ်များ
ဒီကြော်ငြာထဲမှာ SM hash မူဝါဒနဲ့ အရှိန်မြှင့်တင်မှု
အဆင့်သတ်မှတ်ချက်များ SM2- သီးသန့်စီးဆင်းမှု

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

အများပြည်သူ Taira ထုတ်ဖော်ပြောဆို SM စစ်ဆေးမှုအတွင်း အရည်အသွေး ကြော်ငြာ၊ ဒါပေမဲ့ SM လက်မှတ်ထိုးခြင်း
အဲဒီမှာ မစွမ်းဆောင်နိုင်ခဲ့ပါဘူး။ `ed25519`,
`secp256k1`, နှင့် `bls_normal`, ဒီတော့ လက်မလျှော့ပါနဲ့။ SM2- လက်မှတ်ရေးထိုးထားသော ငွေကြေးလုပ်ငန်းများ
စွမ်းဆောင်ရည် အသုံးဝင်မှု ဝန်ထုပ် ပြောင်းလဲခြင်းမှလွဲ၍ တပ်ဆင်ခြင်း။

### GOST ပြီးတော့ Post-Quantum Key တွေ {#gost-and-post-quantum-keys}

ယေဘုယျ crypto ကိုသုံးပါ။ API အတွက် GOST R 34.10-2012 ပမာဏစုများနှင့် ML-DSA
(`ml-dsa`) post quantum လက်မှတ်။ တူညီသော key-pair object ကိုလက်မှတ်ကိုင်တွယ်,
စစ်ဆေးမှုနှင့် ရှေးဟောင်းထုတ်ကုန်များ

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

တံခါး GOST ပြီးတော့ node ရဲ့ ကြော်ငြာထားတဲ့ လက်မှတ်ရေးထိုးတဲ့ အယ်လ်ဂိုရစ်သမ်တွေမှာ post-quantum flow တွေပါ။
ရှေ့ဆက်လိုက်ဖက်တဲ့ အယ်လ်ဂိုရစ်သမ်အမည်များအတွက် raw capability payload ကိုအသုံးပြုပါ။

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

Node တစ်ခုက လိုအပ်တဲ့ algorithm ကို ကြော်ငြာမပေးဘူးဆိုရင် Local Key အတွက်သာ အသုံးပြုပါ။
ဒီအယ်လ်ဂိုရစ်သမ်နဲ့ လက်မှတ်ရေးထိုးထားတဲ့ ငွေကြေးကို
အဲဒီ node ကို Taira စစ်ဆေးပါ။ GOST နှင့် ML-DSA အသုံးပြုနိုင်ခဲ့သည်မှာ SDK
အထက်စီးကြောင်းက crypto အကူအညီပေးသူများ Python စာြကည့်တိုက်မှ မကြော်ငြာခဲ့ဘဲ
Transaction လက်မှတ်ရေးထိုးဖို့ node

## Config-Aware Client ဖန်တီးခြင်း {#config-aware-client-creation}

အသုံးပြုခြင်း `resolve_torii_client_config` သင့်အက်ပ်လီကေးရှင်းက node setting ကိုဖတ်တဲ့အခါ
ဖိုင်တစ်ခုမှထွက်ရှိသော်လည်း ပတ်ဝန်းကျင် သို့မဟုတ် စမ်းသပ်မှုဆိုင်ရာ overrides လိုအပ်နေသည်

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

နိုင်ငံခြားရေး Python SDK current ကို query လုပ်နိုင်ပါတယ် JSON အသင့်ရှိမှု လမ်းကြောင်းကို ၎င်းရဲ့ အထွေထွေ
Torii အကူအညီတောင်းခံသူ:

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

Python Kagemusha ကို ထိပ်သွင်းပြီး ပြန်လည်ဖြည့်ဆည်းထားတဲ့ Archiv Builders တွေကို မဖေါ်ပြပါဘူး။
ရိုက်နှိပ်ထားသော စာလုံးကို အသုံးပြုပါ။ Swift ဒါမှမဟုတ် JVM ကန်နီကလစ်ကို တည်ဆောက်ဖို့ ငွေကြေးအိတ် V4 အဲဒီနောက်မှာ
ထောက်ပံ့တဲ့ Kagemusha တစ်ခုကနေ သူတို့ကို တင်ပြပြီး မဲပေးပါ။ Torii ဖောက်သည်။

## စာရင်းသွင်းခြင်း {#subscriptions}

Subscription Helpers တွေဟာ Shared ကနေ အမွေခံရတဲ့ ဝန်ဆောင်မှုခေါ်ဆိုမှုတွေကို ပြောင်းပစ်နေကြပါတယ်။ Torii
သုံးစွဲသူ `iroha_python.ToriiClient`. အသုံးပြုခြင်း IDs ငွေလဲလှယ်နှုန်းသမိုင်း
ကိုယ်ရည်မှန်းတဲ့ ကွန်ရက်ပါ။

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

## ဆက်သွယ်ခြင်း {#connect}

ဆောက်လုပ်ခြင်းနှင့် စာရင်းစစ်ခြင်း Connect URIs, ပြီးတော့ Public Connect status ကို ဖတ်ကြည့်ပါ။
Taira:

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

Frame codecs တွေ၊ session key ကို ထုတ်ယူခြင်းနဲ့ session creation တွေအတွက် native
extension နဲ့ Connect session route ကို enable လုပ်ထားပါတယ်

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

## အုပ်ချုပ်ရေး၊ Runtime နှင့် Admin Surfaces {#governance-runtime-and-admin-surfaces}

ဒီဖတ်လို့သာရတဲ့ ဖုန်းခေါ်ဆိုမှုတွေဟာ အများပြည်သူအတွက် အောင်မြင်စွာ ပြန်လည်ဖြေရှင်းပေးခဲ့တယ်။ Taira:

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

Runtime upgrade လုပ်သူတွေက runtime upgrade မှာ အသုံးပြုတဲ့ manifest shape ကို လက်ခံကြတယ်။
API. ဒါတွေက operator လုပ်ဆောင်ချက်တွေပါ။ ဒီတော့ node တစ်ခုကိုပဲ သုံးပါ။
account နှင့် token များအား ခွင့်ပြုထားသည်-

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

## အခြေအနေ၊ သဘောတူညီချက်နှင့် ကွန်ရက် တယ်လီမီထရီ {#status-consensus-and-network-telemetry}

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

## SoraFS, UAID, နှင့် Kaigi အကူအညီပေးသူများ {#sorafs-uaid-and-kaigi-helpers}

ဒီအကူအညီတွေဟာ ရည်မှန်းချက် node က သင့်တော်တဲ့
Nexus/SORA Endpoints: အလွတ်စာရင်းတွေကို valid response အဖြစ်သုံးပါ။ Taira မေလ
နမူနာထုတ်ပြန်ချက်အတွက် အချက်အလက်တွေမရှိဘဲ လမ်းကြောင်းဖွင့်ထားပြီးသား ဖြစ်စေ၊ UAID.

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

## Norito RPC နှင့် GPU အကူအညီပေးသူများ {#norito-rpc-and-gpu-helpers}

အသုံးပြုခြင်း `NoritoRpcClient` သင်ဟာ Norito bytes နဲ့ call လုပ်ဖို့လိုတယ်
ဘိုင်နရီ Torii ဥပမာမှာ အရင်က လက်မှတ်ထိုးထားတဲ့ စာအိတ်တစ်ခု လိုအပ်ပါတယ်။
ငွေပေးချေမှု ပုံစံ:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

CUDA အကူအညီပေးသူတွေ ပြန်လာ `None` backend မရှိတဲ့အခါမှာ applications တွေကို
scalar implementation တွေကို ပြန်သွားနိုင်ပါတယ်

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## လက်ရှိအကာအကွယ် {#current-coverage}

နိုင်ငံခြားရေး Python SDK အကူအညီပေးသူများကိုပါ ၀ င်ထားသည်-

- Torii တင်သွင်းမှု, အခြေအနေ, မေးမြန်းချက်များနှင့် admin စီးဆင်းမှုများ
- အထွေထွေအတွက် Typed ညွှန်ကြားချက် ဆောက်လုပ်ရေး ISI နယ်ပယ်ဆိုင်ရာ ဖြန့်ချိချက်များ
- ငွေကြေးရေးဆွဲမှု မူကြမ်းများ၊ လက်မှတ်ထိုးခြင်းနှင့် လက်မှတ်ထိုးထားသော ငွေကြေးဆိုင်ရာ စာချုပ်အဖုံး
  အလုပ်ခွင်များ
- streaming ဖြစ်ရပ်တွေ၊ filter တွေနဲ့ resumable cursors တွေ
- Kagemusha အသင့်ရှိခွင့်နဲ့ Torii စာရင်းပေးသူများ; ရိုက်ထည့်ထားသည်
  ထပ်မံဖြည့်စွက်ခြင်းနှင့် ပြန်လည်ဝယ်ယူမှုလုပ်သားများအား ထိတွေ့မှုမရှိပါ။
- အကောင့်လိပ်စာ၊ အယ်လ်ဂိုရစ်သမ်အားလုံး လက်မှတ်ရေးထိုးတဲ့ အကူအညီတွေ၊ multi-hash round trip တွေ၊ SM2,
  GOST, ML-DSA, BLS, လျှို့ဝှက်သော့ကိုင်တွယ်ခြင်း
- ဆက်သွယ်ခြင်း URIs, အစည်းအဝေးများ၊ ဘောင်များ၊ ကုဒ်ရေးခြင်း အကူအညီများနှင့် မှတ်ပုံတင် အုပ်ချုပ်သူ
- အုပ်ချုပ်ရေး၊ ပြေးဆွဲချိန်တိုးတက်မှု၊ Sumeragi, node-admin ကို SoraFS, UAID, နှင့် Kaigi
  node က ဒီ features တွေကို ဖော်ပြတဲ့ endpoint wrappers

## မြင့်တက်သော ရည်ညွှန်းချက်များ {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

ဒီဖိုင်တွေဟာ အမှန်တရားရဲ့ အရင်းအမြစ်ပါ။ Python ပိတ်ထားတဲ့ မျက်နှာပြင်
အလုပ်ခွင်ကို ပြန်လည်ပြင်ဆင်ခြင်း။
