---
translation_locale: zh-hant
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Python {#python}

其他 Python SDK 在上游工作空間中是 `iroha-python`. 第一個. Iroha 3 釋放目標 Torii 和 Norito 嵌入您的整合所使用的包裝版本或源修改,以便 SDK 和節點保持在相同的序列化格式修訂版本.

在 `https://taira.sora.org`下面的匿名閱讀示例是目標公眾 Taira. 路線可以僅可閱讀,但仍然需要使用法規帳戶簽名或精確網路運營商簽名;這些示例分別標記.突變的例子是交易模板,需要一個真正的 Taira 授權主體,私鑰,輸入費用支付意圖,足夠的測試網 XOR,以及目標路線在提交之前所需的身份驗證.

使用如下順序的例子:

|階段| 與公眾競爭 Taira?            |你需要什麼?|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|匿名讀取呼叫|是的.|Python 包加上網路接入 |
|帳戶或運營商認證的讀數|只有你自己承認的身份|正確的 Taira `NetworkId`和相應的帳戶或運營商金鑰 |
|地方簽名和指令建設者|在 `submit()`之前,沒有網路通話|你的原始擴充套件和金鑰材料|
|轉換交易和服務呼叫|只有你自己的資金帳戶|監管機構帳戶,私鑰,確切的 Taira `NetworkId`,輸入費用意圖,費用資產餘額和路線代幣|
|連線框架編碼器,加密和 GPU 助手|只有本地|GPU 助手也需要一個能夠使用 CUDA 的後端|

## 安裝 {#install}

包裝後設資料名稱是 `iroha-python`.不要假設一個未插入的 PyPI 安裝與現場 Taira 網路相匹配.安裝從相同的上游修改構建的輪或源檢查,您的整合目標:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

如果專案直接使用上游工作區，請先安裝 Python 相依套件並建置原生擴充功能，再執行使用 `Instruction`、`TransactionDraft`、簽署、密碼學、SoraFS 原生輔助程式、GPU 輔助程式或 Connect 框架編解碼器的範例。使用上游 `python/iroha_python/README.md` 中的建置命令，然後確認原生匯出可以載入：

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

如果`create_torii_client`進口但 `Instruction`或 `generate_ed25519_keypair`未成功,則純的 Python 包裝可用,但本地擴充套件不存在.

## 快速開始 {#quickstart}

開始使用公開,僅可閱讀的 Taira 端點:

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

在提交之前,請使用此設定用於突變模板. 取代您的部署中的每個位置持有者以 Taira 授權主體,私鑰,令牌和資產/帳戶 IDs.

`authority`是簽署交易的帳戶,並且`private_key`必須與此匹配. 交易繫結到 Taira 的精確創世來源 `NetworkId`;連結 UUID 是一個部署標籤,而不是交易身份.費用使用輸入的付款意圖和精確的現場報價,無論應用程式的後設資料如何.下面的帳戶和關鍵位持有者是故意無效的,因此它們不是偶然提交的.

下面的字母是當前固定 Taira 創世身份.一個測試網路重新設定可以改變它,所以從簽署的部署配置檔案中重新整理它,永遠不要從鏈上推斷它 UUID.

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

`Instruction.*`只呼叫構建指令有效載荷. `submit()`是 SDK 獲取現場收費報價,簽署準確報價的有效載荷,將其傳送到 Torii,並等待狀態.

## 費用和天然氣 {#fees-and-gas}

寫入交易需要具型別的 `FeePaymentIntent` 和有資金的費用資產餘額。在 Taira 上，公共水龍頭會提供測試網 XOR。Python SDK 會將固定的未簽署承載傳送給 Torii 以取得精確費用報價，驗證報價沒有取代付款方或承載，然後簽署報價中的意圖。不要將費用選擇放入交易中繼資料。

其他 `submit()` 上面的輔助員從一個被授權支付的意圖開始, `quote_and_sign()` 在簽署之前,請從現場報價中填寫這些:

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

在傳送寫入操作之前,請確保授權主體帳戶擁有足夠的費用資產. 精確的水龍頭和資產 ID 是網路特定的;這是 Taira 形狀:

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

faucet 會傳回用於餘額檢查的具體 `asset_id`。請驗證即時費用報價收取 `FEE_ASSET_DEFINITION`；交易不會透過中繼資料選擇此資產。

應用程式後設資料是可選的,並且沒有費用語義:

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

如果您忽略了費用意圖,接受對意外資產的報價,在報價後更改有效負載或使用未經資金支付的帳戶簽署,則不得提交交易.

## 無名 Taira 閱讀 {#anonymous-taira-reads}

這些通話使用 Taira 路線,其目錄界限允許匿名讀取:

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

`/v1/time/status` 和每個 `/v1/sumeragi/*` 操作員快照即使不變更狀態，也需要與目標網路完全相符的操作員簽章。匿名節點狀態承載資料使用 `request_json("GET", "/status")`；共識或節點本機時鐘診斷使用下方的操作員設定。Connect 工作階段狀態屬於單獨的協定路由，並需要該工作階段的管理權杖。

## 指令建構器 {#instruction-builders}

SDK 對最常見的指令家庭的打字構建器和尚未成為一流 Python 方法的變體的 JSON 逃跑口暴露.下面的摘錄是突變的交易模板,並且沒有在簽署帳戶的情況下提交給公眾 Taira.

當它們存在時,更喜歡打字輔助器:它們將 Python 值正常化並在不有效的形狀上早期失敗.只使用 `Instruction.from_json`當您需要一個尚未有 Python 輔助器的指示變體時.

|教學家庭|Python 表面|
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|登記| `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` 專用於創世/啟動鏈工具 |
|取消註冊|`unregister_trigger`;使用`Instruction.from_json`用於其他變體 |
|鑄造/銷毀|`mint_asset_numeric`, `burn_asset_numeric`,`mint_trigger_repetitions`, `burn_trigger_repetitions` |
|轉移| `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa`                                                              |
|轉移資料和控制| `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value`                                                                        |
|RWA 生命週期 | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa`                                                                                                         |
|ExecuteTrigger|`execute_trigger`|
|補充/定居延長| `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp`                                                                                                      |
|創業資產鎖定|`open_asset_lock`, `drawdown_asset_lock`,`cancel_asset_lock`, `expire_asset_lock`,加上客戶 `*_and_wait`的助手 |
|授予/撤銷, SetParameter,日誌,定製,升級以及不常見的註冊/非註冊變體 |`Instruction.from_json`或`TransactionBuilder.add_instruction_json`具有規範名稱的 `InstructionBox` JSON |

對於託管類條件付款,見 [產業資產保證](/zh-hant/blockchain/escrow.md#python-asset-locks). Python 目前對通用資產鎖定的一流助手曝光;市場和匿名託管助手不是一流 Python 方法還沒有.

### 設定域名,然後註冊帳戶和資產 {#set-up-domains-then-register-accounts-and-assets}

通常的域名建立透過宣告別名規劃器進行,因此 SNS 租合同,所有者功能,報價保護和域名狀態都被檢查在一起.透過您的 SDK 或安裝服務建立一個無秘密的`AliasSetupPlanRequestV1`意圖,然後使用`iroha app alias setup plan`和`iroha app alias setup apply`.不要從應用程式交易中提交`Instruction.register_domain`;該構建器仍然用於生成/啟動工具.

在域設定計劃提交後,註冊域所有物體.在像 Taira 這樣的共享網路上,使用分配給你的域名和帳戶名稱空間.

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

`mintable` 接受 `Infinitely`, `Once`, `Not`, 或 `Limited(n)` 已被資料模型接受的值. `scale` 對於無限制數值資產.

### 鑄造、銷毀和轉移資產 {#mint-burn-and-transfer-assets}

這些呼叫使用現有資產 ID. 首先註冊資產定義,然後構建具體的資產 ID 對於擁有資產的帳戶.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### 轉移所有權 {#transfer-ownership}

轉移所有權變化誰控制域名,資產定義,或 NFT.使用當前的所有者作為交易授權主體.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### 設定和刪除後設資料 {#set-and-remove-metadata}

基資料值必須是: JSON- 可連續化. `TransactionDraft`, 在 `TransactionConfig` 成為預設目標帳戶.

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

高階助理草案預設的目標是交易授權主體:

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

### 現實資產 {#real-world-assets}

RWA 助手使用 JSON-可連續化有效載荷來為特定資產的後設資料,來源和控制者政策. `register_rwa`不接受`id`或`owner`:執行階段產生`RwaId`,交易授權主體成為初始所有者.

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

在註冊交易提交後,使用 `FindRwas`, `/v1/rwas`,RWA 事件或設定的探索者路線來發現生成的 ID:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

隨後的操作使用生成的 `hash$domain` ID:

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

在現有分數上,全部轉讓可以改變 `owned_by`.部分轉移和合並會產生子女分數.

### 觸發器 {#triggers}

使用觸發註冊輔助器,當可執行的是另一個指令序列:

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

Torii 還暴露 REST 的助手用於觸發器庫存:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

引發庫存呼叫只能讀取或檢查引發記錄. 註冊,執行,重複變更和不註冊是突變操作.

### 申報和結算說明 {#repo-and-settlement-instructions}

代理商和雙邊結算助手將無需手工製造的 Norito 有效載荷新增特定領域的指令變體:

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

### JSON 逃跑口 {#json-escape-hatch}

當一個 Python 沒有輔助器,提供標準的資料模型 `InstructionBox` JSON 在 `Instruction.from_json`. 這就是推的路徑 `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, 對等節點/角色 NFT 在這些輔助器被鍵入之前,非觸發式未登記的變體.

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

保持輸入的草稿路徑在交易邊界:它保留了準確的 `NetworkId`,費用支付意圖,以及簽署前報價不變.直接使用 `TransactionBuilder`需要相同的值加上實時報價的明確驗證,因此它不是應用程式程式碼的快捷方式.

對於生成或不透明的指示,在儲存測試資料之前透過 JSON 進行往返:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## 交易工作流程 {#transaction-workflows}

使用 `TransactionDraft`用於在簽署之前構建多個指令的應用程式. 草稿允許您將交易級設定,如`ttl_ms`, `nonce`和後設資料放在一個地方,然後單次簽署:

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

出口檢查,審計或錢包轉移的確定性清單:

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

當目標通道要求時,在簽署前附上一個路徑隱私證明:

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

## 查詢 {#queries}

輸入查詢輔助器返回資料類,而不是原始的 JSON 字典.它們是最簡單的方式來開始,因為 SDK 解析頁面化和常見記錄領域:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

當 Torii endpoint 尚無型別化封裝器時，請使用通用請求輔助函式：

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

帳戶庫存輔助者需要一個由 SDK 是正常化器,使用規範. I105 帳戶 IDs 如果一個區塊探測器或原始端點返回一個 ID 這就是 SDK 拒絕,將其歸結為規範賬號 ID 在召喚這些援助者之前,

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## 事件 {#events}

串流輔助程式預設會解碼 JSON 承載資料。需要 SSE 事件名稱、ID、重試提示及原始承載資料時，請傳入 `with_metadata=True`。標準 `/v1/events/sse` feed 僅提供即時事件：它不會發出重播 IDs，也不保留重播記錄，因此這些輔助程式不提供遊標或續傳引數。重新連線會建立新的訂閱，可能產生缺口；需要完整帳本歷史時，請從已知高度使用 `/v1/blocks/stream`。這些範例會等待即時事件，因此請在串流已啟用且處於活動狀態的節點上執行。

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

## 鑰匙和地址 {#keys-and-addresses}

SDK 暴露在本地擴充套件中編譯的每個簽名演算法的本地簽字輔助器.這些輔助器不呼叫 Taira,但它們確實需要本地擴充:

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

使用 `supported_crypto_algorithms()` 查看目前的 wheel 套件支援哪些演算法。通用輔助函式使用規範演算法標籤；編譯時包含相應演算法後，它們可用於 Ed25519、secp256k1、ML-DSA、GOST、BLS 和 SM2：

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

### 中文 SM 加密 {#chinese-sm-cryptography}

Python SDK 將通用 SM2 輔助器和特定 SM2 的便利輔助器都曝光.使用節點能力廣告來選擇目標網路預期的 SM2 區分識別符號:

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

`crypto.sm.enabled`告訴您節點是否在當前的政策中接受 SM 家族演算法.同樣的廣告包括 SM 雜湊政策和加速狀態,這對於決定是否啟用 SM2 特定流程時有用:

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

將已驗證的 capability payload 視為已部署節點的權威依據。除非 `crypto.sm.enabled` 為 true 且公告的 signing policy 允許，否則不得提交 SM2 簽署的交易。

### GOST 和數量後關鍵 {#gost-and-post-quantum-keys}

在 GOST R 34.10-2012 引數組和 ML-DSA (`ml-dsa`) 後量子簽名中,使用通用加密字元號 API.同一個鍵對對處理簽名,驗證和多雜湊出口:

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

在節點的認證,輸入功能廣告中,門 GOST 和量子後流量:

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

如果節點未公佈您所需的演演算法，請只將該金鑰用於本機或離線工作流程。不要向該節點提交以該演演算法簽署的交易。在公開 Taira 檢查期間，GOST 和 ML-DSA 可作為上游 Python 函式庫中的 SDK 密碼學輔助工具使用，但節點並未公佈其可用於交易簽署。

## 設定知情客戶端建立 {#config-aware-client-creation}

使用 `resolve_torii_client_config` 當您的應用程式從檔案中讀取節點設定,但仍然需要環境或測試特定的過關:

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

## 卡蓋穆沙的準備 {#kagemusha-readiness}

其他 Python SDK 能查詢電流 JSON 準備路線透過其通用 Torii 要求助理:

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

Python 尚未提供具型別的 Kagemusha 儲值或贖回封存建構器。請使用具型別的 Swift 或 JVM 錢包建構規範 V4 封存，然後透過受支援的 Kagemusha Torii 用戶端提交並輪詢。

## 訂閱 {#subscriptions}

`iroha_python.ToriiClient`使用的共享 Torii 客戶端繼承了訂閱閱閱和草案構建器.每個突變都使用繫結請求正文的規範帳戶簽名予以准入,並返回未簽署的交易草案. Torii 從來沒有接受私鑰,也不為您提交草案.

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

給每一個準確的有效負載和簽字資訊到相應帳戶的本地錢包,驗證那裡所要求的操作,組裝簽署的交易,並透過正常的交易管道提交.Python SDK 驗證了簽署訊息是返回的有效載荷的規範雜湊,但錢包仍然負責在簽署前解碼和批准交易.

## 連線 {#connect}

建立和分析本地連線 URIs.一個連線身份將 SID 繫結到正確的 `NetworkId`,應用程式公鑰和 nonce：

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

僅在目標節點暴露Connect時註冊該精確預覽.會議建立返回了四個角色特定的載體代幣.每次會議狀態路徑需要管理代幣;總狀態是操作員路線.

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

透過狀態會議加密後的訊息:

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

## 管理,執行階段和管理面積 {#governance-runtime-and-admin-surfaces}

使用 [共享設定](#shared-setup)的授權主體和金鑰對,將每個輔助呼叫繫結到 Taira 的精確創世來源 `NetworkId`:

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

建立操作員閱讀的單獨客戶端.在執行時載入允許列出的操作員鍵,並將其繫結到 Taira 的確切 `NetworkId`;持有符號和 `x-api-token`不會取代此簽名:

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

執行階段升級路線是操作員認證的指令構建器.成功提出,啟用或取消響應回報 `tx_instructions`; 透過正常簽署的交易和管理路徑提交該捆綁. Python 方法 `propose_runtime_upgrade`, `activate_runtime_upgrade`, 和 `cancel_runtime_upgrade` 目前發出簡單的請求,而不是應用客戶的 `OperatorSigningContext`, 因此,這本教程並沒有將它們作為一個工作操作器流.

## 狀態,共識和網路電測 {#status-consensus-and-network-telemetry}

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

## SoraFS,UAID 和 Kaigi 的輔助人員 {#sorafs-uaid-and-kaigi-helpers}

當目標節點暴露相應的 Nexus/SORA 端點時,這些輔助器可用.將空清單視為有效的響應:公眾 Taira 可能會在沒有樣本表或 UAID 的資料的情況下啟用路線.

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

## Norito RPC 和 GPU 助手 {#norito-rpc-and-gpu-helpers}

使用 `NoritoRpcClient` 當你已經有了 Norito 位元組和需要呼叫二進位制 Torii 結尾點:該示例需要從前一個交易模板中籤署的封裝:

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

CUDA 輔助器在後端不提供時返回`None`,因此應用程式可以回到規模實現:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## 目前覆蓋範圍 {#current-coverage}

Python SDK 已經包括以下型別的助手:

- Torii 提交,狀態,查詢和管理流
- 為常見 ISI 和特定域的擴充套件型別指令構建器
- 交易草案,清單,簽署和簽署的交易封裝工作流程
- 現場事件流和具型別過濾器;提交的區塊流提供完整的歷史記錄
- 一般Kagemusha準備訪問和 Torii 訂閱輔助員;打字補充和贖回構建者不暴露
- 帳戶地址,全演算法簽字輔助器,多個雜湊回來旅行, SM2, GOST, ML-DSA, BLS 以及機金鑰處理
- 連線 URIs,會議,框架,加密輔助器和登錄檔管理員
- 當節點提供相應功能時，用於治理、執行階段升級、Sumeragi、節點管理、SoraFS、UAID 和 Kaigi 端點的封裝器

## 上游引用 {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

這些檔案是嵌入式工作空間修改中 Python 表面的真相來源.
