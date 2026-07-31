---
translation_locale: zh-hant
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

其他國家 Python SDK 在上游工作空間中是 `iroha-python`. 首先, Iroha 3
發放目標目前的 Torii 及其他 Norito 封裝版本的插件
或是您的集成所使用的源改版, SDK 結節保持在
這樣的電郵形式修改.

以下只能閱讀的例子與公眾比較 Taira 在
`https://taira.sora.org`. 交易模板是突變的例子:
需要真正的 Taira 權威,私密鍵,氣體元數據以及任何運營商
目標路線需要的令牌,

使用以下順序的例子:

| 階段 | 面對公眾的情況 Taira? | 你需要的 |
| --- | --- | --- |
| 只有閱讀客戶通話 | 沒有任何問題. | Python 包裝加上網路接入 |
| 局部簽名和指令制造商 | 沒有網路通話, `submit()` | 您的基本材料和原生擴展 |
| 轉換交易和服務呼叫 | 只有您自己的資金. | 管理局帳戶,私密鍵,連鎖 ID, 收費元數據,收費資產餘額和路線代幣 |
| 聯繫框架代克,加密碼和 GPU 助手 | 只有本地 | 在本地延伸; GPU 助手也需要一個 CUDA- 有能力的後端 |

## 裝置 {#install}

包裝元數據名稱是 `iroha-python`. 請不要假設沒有支的 PyPI
安裝與直播相匹配 Taira 裝置一個車輪或源支票,
您的集成目標是:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

如果您的項目直接使用上游工作空間, Python
在執行使用例之前建立本地擴展
`Instruction`, `TransactionDraft`, 簽名,加密, SoraFS 來自原住民的援助者, GPU
使用 build 這個命令從上流
`python/iroha_python/README.md`, 檢查本土出口負荷是否:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

如果 `create_torii_client` 但沒有進口 `Instruction` 或是
`generate_ed25519_keypair` 沒有錯, Python 這項方案可供使用,
沒有原住民延伸.

## 快速開始 {#quickstart}

開始使用公共,只能閱讀 Taira 目的地:

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

## 分享的設定 {#shared-setup}

使用這個設定進行突變模板.
Taira 權威,私钥,令牌和資產/帳戶 IDs 您的部署
在提交之前.

`authority` 是簽署交易的帳戶. `private_key` 必須符合
這個帳號, `CHAIN_ID` 必須與目標網絡相匹配, `TX_METADATA` 必須
網頁所預期的收費欄位.
沒有故意無效,因此他們不是偶然提出的.

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

`Instruction.*` 只有建立指令的有效負荷. `submit()` 這是
在哪裡? SDK 簽署交易, Torii, 在等待一個
國家的地位.

## 收費和天然氣 {#fees-and-gas}

寫交易需要收費元數據和資金的收費資產餘額. Taira,
收費資產由公共管道提供資金,交易元數據必須
包含 `gas_asset_id`. 在此, Minamoto, 收費是以實現金支付的 XOR 以及該資產
ID 該系統的配置是如何建立的.

收費的數據是該交易所屬的, 而不是單個指示.
`submit()` 接上的助手 `TX_METADATA` 在每個交易中:

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

在發送信件之前, 確保該權威帳戶擁有足夠的費用
該產品的精確水和產品. ID 網路特異性; Taira
形狀:

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

把混凝土回來了. `asset_id` 還是使用在平衡檢查中.
`gas_asset_id` 基數字段使用收費資產定義 ID.

透過將地圖集結合, 將應用程式元數據與收費元數據分開
在建立交易時:

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

如果您忽略了收費元數據, 使用錯誤的收費資產,
實際網路應拒絕交易,
其他有效的負荷.

## Taira- 只有閱讀通話 {#taira-checked-read-only-calls}

這些呼籲成功反對公眾 Taira:

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

路線如: `/v1/status`, 公眾同行清單, Sumeragi RBC 採樣,結
管理者快照和Connect應用程式登錄管理並沒有公開
提供在 Taira 在檢查過程中使用 `request_json("GET", "/status")` 關於
公共結束狀態的有效負荷 Taira.

## 施工指令 {#instruction-builders}

其他國家 SDK 顯示了最常見的教學家庭的類型,
JSON 不是第一級的變體的逃跑口 Python 還沒有使用任何方法.
以下部分是變異的交易模板,
提交給公眾 Taira 沒有簽名帳戶.

在現實情況下, 喜歡打字助手:他們正常化 Python 數值與失敗
沒有使用的形狀. `Instruction.from_json` 只有當你需要
沒有指令變體 Python 沒有任何幫助.

| 教學家庭 | Python 表面 |
| --- | --- |
| 註冊 | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` 專用於創始/開啟帶工具 |
| 沒有註冊 | `unregister_trigger`; 使用 `Instruction.from_json` 其他變體 |
| 薄荷/燃燒 | `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
| 轉移 | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
| 數據與控制 | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
| RWA 生命周期 | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
| ExecuteTrigger | `execute_trigger` |
| 還原/定居的延伸 | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
| 國產資的鎖定 | `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, 再加上客戶 `*_and_wait` 助手 |
| 授予/撤回, SetParameter, 記錄,定制,升級以及不太常見的注冊/非註冊變體 | `Instruction.from_json` 或是 `TransactionBuilder.add_instruction_json` 沒有法典 `InstructionBox` JSON |

對於保證方式的條件付款,
[預借本地資產](/zh-hant/blockchain/escrow.md#python-asset-locks). Python
目前對通用資產鎖定的第一級輔助者,
匿名的保證助理不是一流的 Python 還沒有使用任何方法.

### 建立域名,然後註冊帳戶和資產 {#set-up-domains-then-register-accounts-and-assets}

這種情況下, SNS
租賃,所有者能力,報價保護和域狀態都被檢查在一起.
建立一個沒有秘密的網站. `AliasSetupPlanRequestV1` 您的目的 SDK 或是
接著使用 `iroha app alias setup plan` 及其他
`iroha app alias setup apply`. 沒有提交 `Instruction.register_domain`
在應用程序交易中,該建立者仍然為genesis/bootstrap
提供工具.

在域名設定計劃承諾後,
網路,例如: Taira, 使用為您分配的域名和帳戶命名空間.

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

`mintable` 接受 `Infinitely`, `Once`, `Not`, 或是 `Limited(n)` 接受的價值
通過數據模型. `scale` 沒有限制的數值資產.

### 金,燃燒和轉移資產 {#mint-burn-and-transfer-assets}

這些呼叫使用現有的資產 ID. 首先註冊資產定義,
建造混凝土資產 ID 對於擁有該資產的帳戶.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### 轉移所有權 {#transfer-ownership}

所有權轉移, 變更誰控制域名,資產定義或 NFT.
請使用目前的所有者作為交易權威.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### 設定和移除元數據 {#set-and-remove-metadata}

數據值必須是: JSON- 可連續化. `TransactionDraft`, 這項政策
國家的權力 `TransactionConfig` 成為預設目標帳戶.

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

高級助理草案預期為交易機構:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### 實際財產 {#real-world-assets}

RWA 助手使用 JSON-可連續化資產特定元數據的有效負載,
該組織的經理和管理者. `register_rwa` 沒有接受 `id` 或是
`owner`: 運行時間產生了 `RwaId`, 和交易權威
成為最初的所有者.

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

在註冊交易結束後, `FindRwas`, `/v1/rwas`, 其他國家 RWA
或是探險家的路徑, ID:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

接下來的操作使用生成的 `hash$domain` ID:

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

全額轉讓可能會改變 `owned_by` 在現有物種上.
合并會產生許多孩子.

### 引發器 {#triggers}

使用啟動登錄助手, 如果可執行是另一個指令
序列:

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

Torii 也會顯示 REST 引發器庫存的輔助器:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

只有閱讀或檢查引發記錄.
執行,重複的變更和不註冊是突變操作.

### 預購和清算指令 {#repo-and-settlement-instructions}

補充專區指令
沒有手工加工的變體 Norito 使用負荷:

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

### JSON 逃離的 {#json-escape-hatch}

在一個情況下 Python 沒有補救器,提供法典數據模型
`InstructionBox` JSON 在 `Instruction.from_json` 或直接進入
`TransactionBuilder.add_instruction_json`. 這是推薦的路徑.
`Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, 同級人/角色 NFT
在這些助手的情況下,
這種方式,

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

透過傳輸系統進行回路通行 JSON 在儲存之前
裝置:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## 交易工作流程 {#transaction-workflows}

使用 `TransactionDraft` 適用於使用多個指令的應用程式,
簽名. 草案可以讓你保持交易水平的設定, `ttl_ms`,
`nonce`, 在一個地方,然後簽字一次:

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

輸出檢查,審核或財布交付的決定性表格:

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

在標籤行程要求時,在簽署前附上一個行徑隱私證明:

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

## 詢問問題 {#queries}

輸入查詢助手將數據班返回,而不是原始 JSON 他們的字典.
該組織的計畫是最簡單的方式, SDK 解析頁面和常見
您的記錄欄位:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

請使用一般要求輔助器, Torii 終點尚未有打字
包裝:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

帳戶庫存助手需要由銀行接受的帳戶識別碼 SDK 沒有任何問題
使用法規. I105 帳號 IDs 或是連鎖名稱;如果有封鎖
探索者或原始終點返回 ID 這種情況 SDK 拒絕,將它解決成一個
經典紀錄 ID 在呼召這些助手之前:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## 事件 {#events}

播放助手解碼 JSON 預設的使用負荷. `with_metadata=True`
當你需要 SSE 活動名稱,身份證,重試提示和原始有效載荷.
在 `EventCursor` 這些例子等待直播
執行與相關事件流相對的節點,
已啟動和活跃.

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

## 關鍵和地址 {#keys-and-addresses}

其他國家 SDK 顯示每個編輯的簽名算法中本地簽名助手
這些助手並不呼籲 Taira, 但他們需要
在本地延伸:

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

使用 `supported_crypto_algorithms()` 看到你的車輪支持什麼.
經典輔助者使用法定算法標籤,並為Ed25519工作,
沒有任何問題, ML-DSA, GOST, BLS, 及其他 SM2 當這些算法被編成到:

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

### 中國語 SM 密碼化 {#chinese-sm-cryptography}

其他國家 Python SDK 顯示了兩種通用 SM2 助手和 SM2- 特殊的便利性
請使用節點能力廣告來選擇 SM2 區分
目標網所預期的識別符:

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

`crypto.sm.enabled` 告訴您結是否接受 SM- 家庭算法在
這項廣告也包括: SM 哈希政策和加速
該網站是否能提供其他資訊, SM2- 特定的流量:

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

公眾 Taira 顯示了 SM 在檢查過程中, SM 簽名
該公司的廣告簽名算法 `ed25519`,
`secp256k1`, 及其他 `bls_normal`, 所以不要屈服. SM2- 簽署的交易
除非能力有效載荷改變,

### GOST 及數量後關鍵 {#gost-and-post-quantum-keys}

使用一般的加密碼 API 關於 GOST R 34.10-2012 的參數組和 ML-DSA
(`ml-dsa`) 數量後簽名.同一對鍵對象處理簽名,
核實和多頭出口:

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

門口 GOST 在這個節點的廣告簽名算法上,
使用原始能力的有效載荷,以前方兼容算法命名:

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

如果一個節點不廣告您需要的算法,
請不要將使用該算法簽名的交易提交給
在公眾活動中, Taira 這樣做, GOST 及其他 ML-DSA 提供於 SDK
在上流的加密助手 Python 沒有被廣告
交易簽名的節點.

## 設定知性客戶創建 {#config-aware-client-creation}

使用 `resolve_torii_client_config` 當您的應用程式閱讀節點設定時
從檔案中,但仍需要環境或測試特定的重覆功能:

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

## 卡蓋穆沙準備 {#kagemusha-readiness}

其他國家 Python SDK 可以查詢目前的情況 JSON 通過其通用品的準備路線
Torii 要求助理:

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

Python 沒有顯示加盖木沙補充或收購檔案組件.
使用打字 Swift 或是 JVM 建立聖經的錢包 V4 這樣的檔案,
透過支持的 Kagemusha, Torii 這位客戶.

## 預訂時間 {#subscriptions}

註冊助手是從共享的服務通話中傳承的突變 Torii
經客戶使用的 `iroha_python.ToriiClient`. 使用 IDs 及現存的資產,
該網站是您的目標.

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

## 聯繫 {#connect}

建立和解析聯繫 URIs, 並閱讀公眾聯繫狀態
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

需要使用本土的程式碼.
延伸和啟用的 Connect會議路線:

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

通過後的訊息加密,

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

## 管理,運行時間和管理面 {#governance-runtime-and-admin-surfaces}

這些只能閱讀的通話成功反對公眾. Taira:

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

執行時間升級助手接受了執行時間升级使用的顯示形狀
API. 只有對於您的節點使用,
帳戶和令牌授權:

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

## 狀態,共識和網絡電測 {#status-consensus-and-network-telemetry}

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

## SoraFS, UAID, 及其他 Kaigi 幫助者 {#sorafs-uaid-and-kaigi-helpers}

這些輔助器在目標節點暴露相應的
Nexus/SORA 處理空白列表作為有效的答案:公開 Taira 年 月 日
沒有採樣表的數據的路線已啟用, UAID.

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

## Norito RPC 及其他 GPU 幫助者 {#norito-rpc-and-gpu-helpers}

使用 `NoritoRpcClient` 當你已經有 Norito 需要打電話,
二元式 Torii 這樣的例子需要從以前的封筒簽名,
交易模板:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

CUDA 幫助者回來 `None` 沒有後端,因此應用程式
還可以回到規模實施:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## 目前的覆蓋 {#current-coverage}

其他國家 Python SDK 已包括以下類型的助手:

- Torii 提交,狀態,查詢和管理流程
- 用於一般的編碼器 ISI 及特定域名的擴展
- 交易草案,明示書,簽名和簽名的交易包裹
  工作流程
- 流動事件,過濾器和可重啟的導覽器
- 提供一般的 Kagemusha 准备性及 Torii 註冊助手;打字
  補充和償還的建造者不暴露
- 這項計畫的目標是: SM2,
  GOST, ML-DSA, BLS, 及密钥使用方式
- 聯繫 URIs, 編碼系統的使用方式,
- 管理,運行時間升級, Sumeragi, 沒有任何問題, SoraFS, UAID, 及其他 Kaigi
  結束點的包裹,其中結暴露這些特征

## 上游參考資料 {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

這些檔案是對 Python 在上的表面
工作空間的修改.
