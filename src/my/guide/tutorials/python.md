---
translation_locale: my
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

Python SDK ကို Upstream Workspace တွင် `iroha-python` ဖြစ်ပါသည်။ ပထမဦးဆုံး Iroha 3 release သည်လက်ရှိ Torii နှင့် Norito မျက်နှာပြင်များကိုရည်ရွယ်သည်။ ပက်ကတ်ဗားရှင်းသို့မဟုတ်သင်၏ပေါင်းစပ်မှုမှအသုံးပြုသော အရင်းအမြစ်ပြုပြင်မှုကိုပိတ်ထားခြင်းဖြင့် SDK နှင့် node တို့သည်အတူတူသောကြိုးပုံစံ ပြုပြင်မှုတွင်နေထိုင်စေရန်။

Taira ကို အများပြည်သူနဲ့ `https://taira.sora.org` နှိုင်းယှဉ်ပြီး အောက်ပါဖတ်လို့သာရတဲ့ နမူနာတွေကို စစ်ဆေးခဲ့ပါတယ်။ အပြောင်းအလဲဖြစ်နေတဲ့ နမူနာတွေက ငွေကြေးပရိုဂျက်ပုံစံတွေပါ၊ ၎င်းတို့ကို တင်ပြနိုင်ခင်မှာ တကယ့် Taira အာဏာပိုင်၊ ပုဂ္ဂလိက သော့၊ ဓာတ်ငွေ့ မီတာဒေတာတွေနဲ့ ပစ်မှတ်ထားလမ်းကြောင်းအတွက် လိုအပ်တဲ့ လုပ်ငန်းရှင် လက်မှတ်တွေ လိုအပ်ပါတယ်။

ဥပမာတွေကို ဒီအစီအစဉ်မှာ သုံးပါ။

|အဆင့် | အများပြည်သူနဲ့ ပြိုင်ဆိုင်ပါ။ Taira? |မင်းလိုအပ်တာ|
| --- | --- | --- |
|ဖတ်လို့သာရတဲ့ ဖောက်သည်ခေါ်ဆိုချက်များ |ဟုတ်ပါတယ်|Python Package plus network access ကို|
|ဒေသတွင်း လက်မှတ်ရေးထိုးခြင်းနှင့် ညွှန်ကြားမှု တည်ဆောက်သူများ |`submit()` အထိ ကွန်ရက် ဖုန်းခေါ်ဆိုမှု မရှိပါ။|Native extension နဲ့ သင့်ရဲ့ အဓိက ပစ္စည်းပါ။|
|ငွေလဲလှယ်ရေးလုပ်ငန်းများနှင့် ဝန်ဆောင်မှုခေါ်ဆိုမှုများ |သင့်ကိုယ်ပိုင် ငွေကြေးထောက်ပံ့တဲ့ အကောင့်နဲ့သာ|အာဏာပိုင်စာရင်း၊ ပုဂ္ဂလိက သော့၊ ကွင်းဆက် ID၊ အခွန်မီတာဒေတာ၊ အခွန်အရင်းအမြစ်လက်ကျန်နဲ့ လမ်းကြောင်းလက္ခဏာများ |
|Frame codec တွေ၊ crypto နဲ့ GPU အကူတွေကို ချိတ်ဆက်ပါ။ |ဒေသတွင်းပဲ|GPU အကူအညီပေးသူများအတွက်လည်း CUDA- အရည်အသွေးရှိတဲ့ backend လိုပါတယ်။ |

## တပ်ဆင်ခြင်း {#install}

Package metadata name is `iroha-python`. unpinned PyPI install ကို live Taira network ကိုက်ညီသည်မထင်ပါနဲ့။ သင်၏ပေါင်းစပ်မှုရည်မှန်းချက်များကို Upstream revision တစ်ခုတည်းမှတည်ဆောက်ထားသော wheel သို့မဟုတ် source checkout ကိုတပ်ဆင်ပါ။

```bash
python -m pip install /path/to/iroha_python-*.whl
```

သင့်စီမံကိန်းက Upstream အလုပ်ခွင်ကို တိုက်ရိုက်သုံးစွဲပါက Python မှီခိုမှုများကိုတပ်ဆင်ပြီး `Instruction`, `TransactionDraft`, လက်မှတ်ထိုးခြင်း, crypto, SoraFS ဒေသခံကူညီသူများ, GPU အကူအညီများ သို့မဟုတ် Connect frame codecs များကိုအသုံးပြုသောဥပမာများကိုမဖွင့်ခင် native extension ကိုတည်ဆောက်ပါ။ build command ကို upstream `python/iroha_python/README.md` မှသုံးပြီး native export load ကိုစစ်ဆေးပါ။

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

အများပြည်သူ ဖတ်နိုင်သော Taira အဆုံးမှတ်များဖြင့် စတင်ပါ-

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

အသွင်ပြောင်းတဲ့ Template တွေအတွက် ဒီ Setup ကိုသုံးပါ။ တင်မပေးခင် နေရာထိန်းထားသူတိုင်းကို Taira အာဏာ၊ ပုဂ္ဂလိက သော့၊ Token နဲ့ asset/account IDs ဖြင့် အစားထိုးလိုက်ပါ။

`authority` သည် ငွေပေးချေမှုကို လက်မှတ်ရေးထိုးသည့် အကောင့်ဖြစ်သည်။ `private_key` သည် ထိုစာရင်းနှင့် ကိုက်ညီရမည်၊ `CHAIN_ID` သည် ရည်မှန်းချက်ကွန်ရက် နှင့် ကိုက်ညီရမည်။ `TX_METADATA` တွင်ကွန်ရက်မှမျှော်လင့်ထားသော အခကြေးနယ်များ ပါဝင်ရမည်။ အောက်ပါနေရာပိုင်ရှင်များသည် ကြံစည်အငြင်းမဲ့ဖြစ်သည် ဖြစ်၍ မတော်တဆ တင်သွင်းခြင်းမရှိပါ။

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

`Instruction.*` သည် တည်ဆောက်မှု ညွှန်ကြားချက် သုံးစွဲသူများကိုသာ ခေါ်ဆိုသည်။ `submit()` သည် SDK သည် ငွေပေးချေမှုကို လက်မှတ်ထိုးပြီး Torii သို့ ပို့ပေးပြီး အခြေအနေကို စောင့်ဆိုင်းသည့်နေရာဖြစ်သည်။

## အခွန်များနှင့် ဓာတ်ငွေ့ {#fees-and-gas}

ငွေပေးချေမှုစာရင်းကို ရေးသားရန်အတွက် အခွန် metadata နှင့် ဘဏ္ဍာငွေပေးချေထားသောခွန်အရင်းအမြစ် balance ကိုလိုအပ်သည်။ Taira, အခွန်လက်ဝယ်ကို အများပြည်သူ ရေပိုက်မှ ငွေကြေးထောက်ပံ့ပြီး ငွေပေးချေမှု မီတာဒေတာမှာ ပါဝင်ရမယ်။ `gas_asset_id`. အပေါ် Minamoto, အခကြေးငွေကို အရှိန်နဲ့ ပေးဆပ်ရမယ်။ XOR ပြီးတော့ အရင်းအမြစ် ID အဲဒီကွန်ရက်ရဲ့ ညွှန်ကြားချက်ကနေ လာတာပါ။

Fees metadata တွေဟာ တစ်ဦးချင်း ညွှန်ကြားချက်တွေ မဟုတ်ဘဲ ငွေပေးချေမှုအတွက်ပါ။ `submit()` အကူအညီက ၎င်းတည်ဆောက်တဲ့ ငွေလဲလှယ်မှုတိုင်းမှာ `TX_METADATA` ကို ချိတ်ဆက်ပါတယ်။

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

စာပို့ခြင်းမတိုင်မီ အာဏာပိုင်စာရင်းတွင် အခွန်အရင်းအမြစ်များ လုံလောက်စွာရှိကြောင်း သေချာစေရန်။ တိကျသော faucet နှင့် အရင်းအမြစ် ID သည်ကွန်ရက်အတွက် သီးသန့်ဖြစ်သည်၊ ဤသည်မှာ Taira ပုံစံဖြစ်သည်။

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

ဘိလပ်မြေစစ်ဆေးမှုအတွက် အသုံးပြုရန် ကွန်ကရစ် `asset_id` ကို faucet က ပြန်ပို့ပေးသည်။ `gas_asset_id` metadata field တွင် fee asset definition ID ကိုအသုံးပြုသည်။

ငွေပေးချေမှု တည်ဆောက်ရာတွင် မြေပုံများကို ပေါင်းစပ်ခြင်းဖြင့် လျှောက်လွှာ metadata များကို fee metadataများမှ သီးခြားထားပါ။

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

အကယ်၍ သင်ဟာ အခွန် metadata ကို ချန်ထားပါက၊ မှားယွင်းတဲ့ အခွန်အရင်းအမြစ်ကို သုံးပါက (သို့) ငွေမထောက်ပံ့တဲ့ အကောင့်တစ်ခုနဲ့ လက်မှတ်ထိုးပါက လက်တွေ့ကွန်ရက်ဟာ ညွှန်ကြားချက် အသုံးဝင်မှု ဝန်ဆောင်မှုက အခြားနည်းဖြင့် သက်ရောက်နေတောင်မှ ငွေပေးချေမှုကို ငြင်းပယ်သင့်ပါတယ်။

## Taira - စစ်ဆေးထားတဲ့ စာဖတ်ခြင်းသာ ခေါ်ဆိုမှု {#taira-checked-read-only-calls}

Taira အများပြည်သူအပေါ် ဒီခေါ်ဆိုချက်တွေကို အောင်မြင်စွာ ပြန်လည်ဖြေကြားခဲ့တယ်။

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

လမ်းကြောင်းများ `/v1/status`, အများပြည်သူအချင်းချင်းစာရင်း၊ Sumeragi RBC နမူနာယူခြင်း၊ node admin snapshots များနှင့် Connect app registry administration တို့ကို Taira စစ်ဆေးမှုအတွင်းမှာ သုံးပါ။ `request_json("GET", "/status")` အများပြည်သူ node status သုံးစွဲမှုအတွက် Taira.

## သင်ကြားချက် ဆောက်လုပ်သူများ {#instruction-builders}

နိုင်ငံတကာ SDK အများဆုံးညွှန်ကြားမှုမိသားစုများအတွက် typed ဆောက်လုပ်သူများကိုဖေါ်ထုတ်ပေးပြီး JSON ပထမတန်းအစားမဟုတ်တဲ့ ဗားရှင်းတွေအတွက် ထွက်ပြေးပေါက် Python အောက်ပါ snippets များသည် mutating transaction templates များဖြစ်ပြီး အများပြည်သူအား တင်ပြခြင်း မရှိသေးပါ။ Taira လက်မှတ်ရေးထိုးတဲ့ အကောင့်မရှိဘူး။

Python တန်ဖိုးများကို ပုံမှန်ပြုပြင်ပြီး မတည်ငြိမ်သောပုံစံများတွင် အစောပိုင်းတွင် ကျရှုံးစေသည်။ `Instruction.from_json` ကိုသင်သည် Python အကူမပါသေးသည့် ညွှန်ကြားချက်ကွဲပြားမှုတစ်ခုလိုအပ်သောအခါသာအသုံးပြုပါ။

|သင်ကြားမှု မိသားစု |Python မျက်နှာပြင်|
| --- | --- |
|မှတ်ပုံတင် | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` genesis/bootstrap tooling အတွက်သာ သတ်မှတ်ထားပါသည်။ |
|မှတ်ပုံတင်ခြင်း မပြုလုပ်ပါ။|`unregister_trigger`; အခြားဗားရှင်းများအတွက် `Instruction.from_json` ကို အသုံးပြုပါ။ |
|Mint/Burn |`mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`၊ `burn_trigger_repetitions` |
|လွှဲပြောင်းခြင်း| `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|မီတာဒေတာများနှင့် ထိန်းချုပ်မှုများ | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
|RWA သက်တမ်း စက်ဝန်း| `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
|ExecuteTrigger |`execute_trigger` |
|Repo/ settlement extension များ|`repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|Native asset lock တွေ| `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, နောက်ပြီး ဖောက်သည် `*_and_wait` အကူအညီပေးသူများ |
|Grant/Revocate, SetParameter, Log, Custom, Upgrade နဲ့ ပုံမှန်မဟုတ်တဲ့ Register/Unregister အမျိုးအစားတွေ | `Instruction.from_json` ဒါမှမဟုတ် `TransactionBuilder.add_instruction_json` Canonical နဲ့ `InstructionBox` JSON |

အာမခံပုံစံအခြေခံငွေပေးချေမှုအတွက် ကြည့်ပါ။ [Native Asset Escrow](/my/blockchain/escrow.md#python-asset-locks). Python လက်ရှိတွင် ပထမတန်းစား အကူအညီပေးသူများကို ယေဘုယျအရင်းအမြစ်ပိတ်ခြင်းများအတွက် ဖွင့်လှစ်ထားသည်; စျေးကွက်နှင့် အမည်မသိ escrow အကူအညီ ပေးသူများသည် ပထမတန်းစားမဟုတ်ပါ။ Python နည်းစနစ်တွေ ရှိသေးတယ်

### ဒိုမီနန်းတွေ ဖန်တီးပြီး အကောင့်တွေနဲ့ အရင်းအမြစ်တွေကို မှတ်ပုံတင်ပါ။ {#set-up-domains-then-register-accounts-and-assets}

သာမန်ဒိုမင်ဖန်တီးမှုသည်ကြေညာချက် alias စီမံခန့်ခွဲသူမှတစ်ဆင့်ဖြစ်သည်၊ ထို့ကြောင့် SNS ငှားရမ်းစာချုပ်, ပိုင်ရှင်စွမ်းဆောင်ရည်များ, အဆိုပြုချက်ကာကွယ်ရေးနှင့်ဒိုမိုင်းအခြေအနေကို အတူတကွစစ်ဆေးသည်။ သင့်ရဲ့ SDK သို့မဟုတ် Onboarding ဝန်ဆောင်မှုနှင့်အတူ လျှို့ဝှက်မဲ့ `AliasSetupPlanRequestV1` ရည်ရွယ်ချက်ကိုဖန်တီးပြီးနောက် `iroha app alias setup plan` နှင့် `iroha app alias setup apply` ကိုအသုံးပြုပါ။ `Instruction.register_domain` ကို application transaction တစ်ခုမှ မတင်ပါနဲ့၊ အဲဒီ builder က genesis/bootstrap tooling အတွက်ပဲ ကျန်နေပါသေးတယ်။

Domain setup plan က commit လုပ်ပြီးနောက် domain ပိုင်ဆိုင်တဲ့ အရာဝတ္ထုတွေကို မှတ်ပုံတင်ပါ။ Taira လို မျှဝေထားတဲ့ ကွန်ယက်မှာ သင့်အား သတ်မှတ်ထားတဲ့ domain နဲ့ account namespace ကို အသုံးပြုပါ။

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

### ငွေကြေးပစ္စည်းများ၊ မီးရှို့ခြင်း၊ လွှဲပြောင်းခြင်း {#mint-burn-and-transfer-assets}

ဒီဖုန်းခေါ်ဆိုမှုတွေမှာ ရှိနေတဲ့ အရင်းအမြစ်ကို သုံးပါတယ်။ ID. အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုမှုကို ပထမဆုံး မှတ်ပုံတင်ပါ၊ ပြီးရင် ကွန်ကရစ်အရင်းအမြစ် တည်ဆောက်ပါ။ ID အရင်းအမြစ်ပိုင်ဆိုင်တဲ့ အကောင့်အတွက်ပါ။

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### လွှဲပြောင်းပိုင်ဆိုင်မှု {#transfer-ownership}

ပိုင်ဆိုင်မှုလွှဲပြောင်းခြင်း domain ကိုထိန်းချုပ်သူ၊ အရင်းအမြစ်သတ်မှတ်ချက် (သို့) NFT ပြောင်းလဲပါ။ လက်ရှိပိုင်ရှင်ကို ငွေပေးချေမှုအာဏာအဖြစ် အသုံးပြုပါ။

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Metadata ကို Set နှင့် Remove လုပ်ပါ {#set-and-remove-metadata}

metadata values တွေဟာ JSON- serializable ဖြစ်ဖို့လိုပါတယ်။ `TransactionDraft` ကိုသုံးတဲ့အခါ `TransactionConfig` ထဲက authority က default target account ဖြစ်လာတယ်။

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

အဆင့်မြင့် အကူအညီပေးရေး မူကြမ်းက ငွေလဲလှယ်မှု အာဏာပိုင်ကို အလိုအလျောက် ပစ်မှတ်ထားတယ်။

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### လက်တွေ့ကမ္ဘာဆိုင်ရာ အရင်းအမြစ်များ {#real-world-assets}

RWA အကူအညီပေးသူများသည် အရင်းအမြစ်ဆိုင်ရာ metadata၊ provenance နှင့် controller policy များအတွက် JSON-serializable payloads ကိုအသုံးပြုကြသည်။ `register_rwa` သည် `id` သို့မဟုတ် `owner` ကိုလက်မခံပါ။ runtime က `RwaId` ကိုဖန်တီးပြီး ငွေလွှဲပြောင်းမှုအာဏာပိုင်သည် မူလပိုင်ရှင်ဖြစ်လာသည်။

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

မှတ်ပုံတင် ငွေပေးချေမှု ကတိပြုပြီးနောက် အသုံးပြုခြင်း `FindRwas`, `/v1/rwas`, တစ် RWA ဖြစ်ရပ် (သို့) ရှာဖွေရေးလမ်းကြောင်းကိုထုတ်လုပ်ထားသော ID:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

နောက်ဆက်တွဲလုပ်ငန်းစဉ်များတွင် ထုတ်လုပ်သော `hash$domain` ID ကို အသုံးပြုပါ-

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

### ပြန်လည်ထူထောင်ရေးနှင့် ငွေပေးချေမှု ညွှန်ကြားချက်များ {#repo-and-settlement-instructions}

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

(က) Python အကူအညီမပေးသေးဘူး၊ ကန်နီကလစ် ဒေတာပုံစံကို ပေးသွင်းပါ။ `InstructionBox` JSON သို့ `Instruction.from_json` (သို့) တိုက်ရိုက် `TransactionBuilder.add_instruction_json`. ဒါက အကြံပြုတဲ့ လမ်းကြောင်းပါ။ `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, peer/role/NFT မှတ်ပုံတင်ခြင်းနှင့် non-trigger unregister variant တွေကို ဒီအကူအညီတွေကို ရိုက်မသွင်းခင်အထိ။

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

ထုတ်ပေးတဲ့ (သို့) မရှင်းလင်းတဲ့ ညွှန်ကြားချက်များအတွက် ပြင်ဆင်ပစ္စည်းများကို သိုလှောင်မထားမီ JSON မှတစ်ဆင့် ပြန်သွားရန်:

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

စစ်ဆေးခြင်း၊ စာရင်းစစ်ဆေးခြင်း သို့မဟုတ် ငွေကြေးဝယ်လွှာပေးပို့မှုအတွက် သတ်မှတ်ချက်ထုတ်ပြန်ချက်များ:

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

လက်မှတ်မထိုးခင် လမ်းကြောင်းအတွင်းက ကိုယ်ရေးကိုယ်တာ လုံခြုံမှု အတည်ပြုချက်ကို ချိတ်ဆက်ပေးပါ

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

Typed query helpers သည် raw JSON အဘိဓာန်အစား dataclasses ကိုပြန်လည်ပို့ပေးသည်။ ၎င်းတို့သည်စတင်ရန်အလွယ်ဆုံးနည်းဖြစ်သည်။ အကြောင်းက SDK သည်သင်အတွက် pagination နှင့် common record field များကိုစစ်ဆေးလို့ပါ။

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Torii အပြီးသတ်မှတ်ချက်တစ်ခုမှာ ရိုက်နှိပ်ထားတဲ့ ပုံးမပါသေးတဲ့အခါ အထွေထွေတောင်းဆိုမှု အကူအညီတွေကို အသုံးပြုပါ။

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

Account inventory အကူအညီပေးသူများအတွက် Account ID ကို SDK ဒါက normalizer ပါ။ Canonical ကိုသုံးပါ။ I105 အကောင့် IDs (သို့) on-chain aliases များ; block explorer သို့မဟုတ် raw endpoint တစ်ခုက ပြန်ပို့ရင် ID အဲဒီ SDK ငြင်းပယ်တယ်ဆိုတာက Canonical account တစ်ခုကို ဖြေရှင်းဖို့ပါ။ ID ဒီကူညီပေးသူတွေကို မခေါ်ခင်မှာ-

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## ဖြစ်ရပ်များ {#events}

Streaming helpers က JSON payload တွေကို အလိုအလျောက် decode လုပ်ပေးတယ်။ SSE event name, id, retry hint နဲ့ raw payload လိုတဲ့အခါ pass `with_metadata=True` ကိုနှိပ်ပါ။ နောက်ဆုံး event ID ကို ထိန်းသိမ်းဖို့ `EventCursor` နဲ့ streams တွေကိုတွဲပါ။ ဒီဥပမာတွေဟာ တိုက်ရိုက်ဖြစ်ရပ်တွေ စောင့်နေတော့ သက်ဆိုင်ရာ ဖြစ်ရပ်စီးကြောင်းကို ဖွင့်ပြီး တက်ကြွတဲ့ node တစ်ခုနဲ့ ပြေးပါ။

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

`supported_crypto_algorithms()` ကိုသုံးပြီး သင့်ဘီးကဘာကိုထောက်ပံ့တယ်ဆိုတာကြည့်ပါ။ ယေဘုယျကူညီသူတွေက ကန်နီကန်အယ်လ်ဂိုရစ်သမ် တံဆိပ်တွေကိုသုံးပြီး Ed25519, secp256k1, ML-DSA, GOST, BLS နဲ့ SM2 တို့အတွက်အလုပ်လုပ်တယ်။ ဒီအယ်လ်ဂျော်ရီသမ်တွေကိုစုစည်းတဲ့အခါမှာ:

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

### တရုတ် SM လျှို့ဝှက်ရေး {#chinese-sm-cryptography}

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

`crypto.sm.enabled` node က လက်ခံလားဆိုတာ ပြောပြတယ်။ SM- မိသားစုအယ်လ်ဂိုရစ်သမ်များ၏ လက်ရှိ မူဝါဒ။ SM hash မူဝါဒနဲ့ အရှိန်မြှင့်မှုအခြေအနေကို ရွေးချယ်တဲ့အခါ အသုံးဝင်တဲ့ SM2- သီးသန့်စီးဆင်းမှု

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

အများပြည်သူ Taira သည် စစ်ဆေးမှုအတွင်း SM အရည်အသွေးကြော်ငြာကို ဖော်ပြခဲ့သော်လည်း SM လက်မှတ်ရေးထိုးခြင်းသည် ထိုနေရာတွင် ပိတ်ထားခဲ့သည်။ ၎င်း၏ ကြော်ငြာလက်မှတ်ရေးထိုးသည့် အယ်လ်ဂိုရစ်သမ်များမှာ `ed25519`, `secp256k1` နှင့် `bls_normal` ဖြစ်သည်။ ထို့ကြောင့် SM2 လက်မှတ်ထိုးထားသော ငွေပေးချေမှုများကို စွမ်းဆောင်ရည်အကျိုးစီးပွား ပြောင်းလဲခြင်းမှလွဲ၍ ထိုတပ်ဆင်မှုကို မတင်ပြပါ။

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

Gate GOST နှင့် node ၏ ကြော်ငြာထားသော လက်မှတ်ရေးထိုးခြင်း အယ်လ်ဂိုရီသမ်များပေါ်တွင် post-quantum စီးဆင်းမှုများ။ ရှေ့ဆက်လိုက်လျောညီထွေသော အယ်လ်ဂျိုရစ်သမ်အမည်များအတွက် raw capability payload ကိုသုံးပါ:

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

Python သည် Kagemusha ထပ်မံဖြည့်စွက်ခြင်း (သို့) ပြန်လည်သိမ်းဆည်းမှုအခမ်းအနား တည်ဆောက်သူများကို ဖော်ပြမပေးပါ။ ကန်နီကလစ်များ V4 ကိုတည်ဆောက်ရန် Swift သို့မဟုတ် JVM Wallet ကိုသုံးပြီး အားပေးတဲ့ Kagemusha Torii ဝယ်ယူသူမှတစ်ဆင့်ပို့၍ စစ်တမ်းကောက်ယူပါ။

## စာရင်းသွင်းခြင်း {#subscriptions}

Subscription helpers သည် `iroha_python.ToriiClient` အသုံးပြုသော မျှဝေထားသော Torii ဖောက်သည်မှ အမွေခံရသည့် ဝန်ဆောင်မှုခေါ်ဆိုမှုများကိုပြောင်းလဲစေသည်။ သင်ရည်မှန်းထားသောကွန်ရက်တွင်တည်ရှိသည့် IDs နှင့် အရင်းအမြစ်များကိုအသုံးပြုပါ။

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

## ချိတ်ဆက်ခြင်း {#connect}

Connect URIs ကို တည်ဆောက်ပြီး စစ်ဆေးပြီး Taira က ဖော်ပြတဲ့ အများပြည်သူ Connect အခြေအနေကို ဖတ်ပါ။

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

Frame codecs များ၊ Session key ကိုထုတ်ယူခြင်းနှင့် Session creation တို့သည် native extension နှင့် Connect session route ကို enable လုပ်ရန်လိုအပ်ပါသည်။

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

## အုပ်ချုပ်မှု၊ Runtime နှင့် Admin Surfaces {#governance-runtime-and-admin-surfaces}

Taira အများပြည်သူကို ပြန်လည်ခေါ်ဆိုမှုများကို အောင်မြင်စွာပြန်လည်ဖြေရှင်းခဲ့သည်

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

Runtime upgrade အကူအညီများသည် runtime upgrade API တွင်အသုံးပြုသော manifest ပုံစံကိုလက်ခံသည်။ ၎င်းတို့သည် operator လုပ်ဆောင်ချက်များဖြစ်သည်၊ ထို့ကြောင့်သင်၏အကောင့်နှင့် token ကိုခွင့်ပြုထားသည့် node တစ်ခုအပေါ်သာ အသုံးပြုပါ။

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

## SoraFS၊ UAID နှင့် Kaigi အကူအညီပေးသူများ {#sorafs-uaid-and-kaigi-helpers}

Nexus/SORA အဆုံးသတ်မှတ်ချက်တွေကို ရည်မှန်းထားတဲ့ node က ဖော်ပြတဲ့အခါ ဒီကူညီသူတွေဟာ ရနိုင်တာပါ။ အလွတ်စာရင်းတွေကို သက်ဝင်တဲ့ တုံ့ပြန်မှုတစ်ခုအဖြစ် සලකා බලන්න: အများပြည်သူ Taira မှာ နမူနာထုတ်ပြန်ချက် (သို့) UAID အတွက် ဒေတာမရှိဘဲ လမ်းကြောင်းဖွင့်ထားနိုင်တယ်။

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

အသုံးပြုခြင်း `NoritoRpcClient` သင့်မှာ ရှိပြီးသား Norito bytes နှင့် binary ကိုခေါ်ရန်လိုအပ်သည် Torii Endpoint: ဥပမာမှာ အရင် Transaction Template တစ်ခုမှ လက်မှတ်ထိုးထားတဲ့ envelope ကို လိုအပ်ပါတယ်။

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
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
- ငွေပေးချေမှု မူကြမ်းများ၊ ထုတ်ပြန်ချက်များ၊ လက်မှတ်ရေးထိုးခြင်းနှင့် လက်မှတ်ရေးဆွဲထားသော ငွေပေးချေးမှု အဝှေ့အလွှာ အလုပ်ဖြစ်စဉ်များ
- streaming ဖြစ်ရပ်များ၊ filter များနှင့် resumable cursors များ
- အထွေထွေ Kagemusha အသင့်ရှိမှု access နှင့် Torii subscription assistants များ၊ ထိပ်သွင်းထားတဲ့ top-up နှင့် redeem build တွေကို မဖွင့်လှစ်ပါ။
- အကောင့်လိပ်စာ၊ အယ်လ်ဂိုရစ်သမ်အားလုံးရဲ့ လက်မှတ်ရေးထိုးမှု အကူအညီများ၊ SM2, GOST, ML-DSA, BLS နှင့် လျှို့ဝှက်သော့ကိုင်တွယ်ခြင်းအတွက် multi-hash round trip များ
- URIs ကို ချိတ်ဆက်ခြင်း၊ အစည်းအဝေးများ၊ ဖေ့ခ်များ၊ ကုဒ်ရေးခြင်း အကူအညီများနှင့် မှတ်ပုံတင် အုပ်ချုပ်သူ
- အုပ်ချုပ်မှု, runtime upgrade, Sumeragi, node-admin, SoraFS, UAID နှင့် Kaigi အဆုံးသတ်မှတ်ချက် wrappers များတွင် node သည်ဤလက္ခဏာများကိုဖေါ်ပြထားသည်။

## အထက်ပိုင်းဆိုင်ရာ ရည်ညွှန်းချက်များ {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

အဲဒီဖိုင်တွေဟာ ပိတ်ထားတဲ့ အလုပ်ခွင် ပြင်ဆင်မှုမှာရှိတဲ့ Python မျက်နှာပြင်အတွက် အမှန်တရားရဲ့ အရင်းအမြစ်ပါ။
