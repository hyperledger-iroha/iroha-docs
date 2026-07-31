---
translation_locale: ja
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

上流作業空間における Python SDK は `iroha-python`.最初の Iroha 3 リリースは,現在の Torii と Norito の表面を対象としています.あなたの統合によって使用されるパッケージバージョンまたはソースリベジションをピンして,SDK とノードが同じワイヤフォーマットリベジメントに保持します.

`https://taira.sora.org`で公開された Taira のみの例をチェックした. 変異する例はトランザクション・テンプレートである:それらの提出前に実際の Taira 権限,プライベートキー,ガスメタデータ,およびターゲットルートによって要求されるすべてのオペレータートークンが必要.

この順序で例を挙げてください.

|ステージ|Taira 公衆に対する競争? |必要なもの|
| --- | --- | --- |
|読み込みのみの顧客通話|ええ|Python パッケージとネットワークアクセス |
|地方のサイン・インstruktionビルダー|`submit()`まで ネットワーク通話なし|ネイティブ拡張子とあなたのキー素材|
|移転取引とサービス通話|資金調達口座でのみ|機関口座,プライベートキー,チェーン ID,料金のメタデータ,料金の資産バランス,ルートトークン |
|フレームコーデック,暗号,および GPU ヘルパーを接続する |地域のみ|GPU 支援者はまた, CUDA 対応のバックエンドが必要です |

## インストール {#install}

パッケージのメタデータ名は `iroha-python` です. 固定されていない PyPI インストールがライブ Taira ネットワークと一致すると仮定しないでください.同じ上流修正から構築された車輪またはソースチェックアウトをインストールしてください.

```bash
python -m pip install /path/to/iroha_python-*.whl
```

`Instruction`, `TransactionDraft`,署名,暗号, SoraFS ネイティブヘルパー, GPU ヘルパー,または Connectフレームコデックを使用する例を実行する前に,あなたのプロジェクトが直接上流ワークスペースを消費している場合は, Python 依存機能をインストールし,ネイティブ拡張子を構築してください.`python/iroha_python/README.md`上流からのビルドコマンドを使用して,ネイティブ輸出負荷を確認します:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

`create_torii_client`輸入が失敗するが, `Instruction`または `generate_ed25519_keypair`は失敗した場合,純粋な Python パッケージが利用可能だが,本来の拡張は利用できない.

## スピードスタート {#quickstart}

公開,読み込みのみの Taira エンドポイントから始めます.

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

## 共有の設定 {#shared-setup}

この設定を使用して,変異するテンプレートを表示します. 送信する前に,あなたのデプロイメントからの Taira 権限,プライベートキー,トークン,および資産/アカウント IDs によってすべての場所保持者を置き換えます.

`authority`は,取引を署名する口座である. `private_key` はそのアカウントと一致し, `CHAIN_ID` はターゲットネットワークと一致しなければならない.そして `TX_METADATA` はネットワークが期待する料金のフィールドを含む必要があります.下記の場所保有者は故意に無効なので,偶然に提出されない.

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

`Instruction.*`は,構築指示用荷物のみに呼び出す. `submit()`は, SDK が取引を署名し,それを Torii に送信し,ステータスを待たす点である.

## 料金とガス {#fees-and-gas}

書き込み取引には料金のメタデータと資金調達料金の資産の余分が必要です. Taira, 料金資産は公共の faucet によって資金提供され,取引メタデータには含まれなければならない. `gas_asset_id`. オン Minamoto, 料金はリアルで支払われます XOR 資産 ID そのネットワークの構成から

料金メタデータは,個々の指示ではなく,取引に属します.上記の `submit()` アシスタントは,作成するすべてのトランザクションに `TX_METADATA` を添付します.

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

書き込みを送信する前に,当局口座に料金の資産が十分に所有されていることを確認してください.正確な faucetと資産 ID はネットワーク特有のもので,これは Taira の形状です.

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

ポンプはコンクリートを返します `asset_id` バランスのチェックに使う. `gas_asset_id` メタデータフィールドは,手数料資産定義を使用します. ID.

取引の作成時にマッピングを統合することで,アプリケーションメタデータを料金のメタデータから分離します:

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

費用のメタデータを省略したり,誤った料金資産を使用したり,資金提供されていないアカウントでサインした場合,実際のネットワークは命令の有用な負荷が有効である場合でも取引を拒絶する必要があります.

## Taira - チェックされた読み込みのみの電話 {#taira-checked-read-only-calls}

Taira に対して,これらの呼び出しは成功に返回された.

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

`/v1/status`,パブリック・ピア・インベクトリー, Sumeragi RBC サンプリング,ノード管理者のスナップショット,およびConnectアプリレジストリ管理などの経路は,チェック中に Taira で公開されていなかった. Taira の公共ノードステータスの役に立たない負荷のために `request_json("GET", "/status")`を使用する.

## 施工 の 指示 {#instruction-builders}

労働組合 SDK 最も一般的な指示ファミリーのためのタイプビルダーを暴露し, JSON ファーストクラスでないバリエーションのための脱出口 Python 次のスニッペットはトランザクションテンプレートを変異させ,公開されていない. Taira 署名口座がない

Python 値は正常化され,無効な形に早く失敗する.まだ Python ヘルパーを持たない指示変数が必要な場合にのみ, `Instruction.from_json` を使用します.

|指導家族|Python 表面|
| --- | --- |
|登録する| `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` ゲネス/ブートストラップツールの使用に限定されています. |
|登録を中止する|`unregister_trigger`;他のバリエーションでは`Instruction.from_json`を使用する |
|ミント/バーン |`mint_asset_numeric`, `burn_asset_numeric`,`mint_trigger_repetitions`, `burn_trigger_repetitions` |
|移転| `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|メタデータと制御 | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
|RWA ライフサイクル| `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
|ExecuteTrigger|`execute_trigger`|
|リポ・セッティングの延長 | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|国産資産のロック| `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, プラスクライアント `*_and_wait` 援助者 |
|補助金/撤回, SetParameter,ログ,カスタム,アップグレード,およびより少ないレジストリ/非レジストリ バリアント| `Instruction.from_json` または `TransactionBuilder.add_instruction_json` カノニカルで `InstructionBox` JSON |

エスクロー様式の条件決済については, [ネイティブアセットエスクロー](/ja/blockchain/escrow.md#python-asset-locks)を参照してください. Python は現在一般的な資産ロックのためのファーストクラスヘルパーを暴露しています.市場および匿名のエスクローヘルパーはまだファーストクラスの方法ではありません Python.

### ドメインを設定し,口座と資産を登録する {#set-up-domains-then-register-accounts-and-assets}

通常のドメイン作成は, SNS レンタル契約,所有者機能,引用保護およびドメイン状態が一緒にチェックされるように宣言されたアライスプランナーを通過します.あなたの SDK またはオンボードサービスで秘密のない `AliasSetupPlanRequestV1` 意図を作成し,その後 `iroha app alias setup plan` と `iroha app alias setup apply` を使用します.アプリケーショントランザクションから `Instruction.register_domain` を提出しないでください.そのコンストラクタはゲネス/ブートストラップツールのために残ります.

ドメイン設定プランがコミットした後,ドメイン所有のオブジェクトを登録します. Taira などの共有ネットワークでは,割り当てられたドメインとアカウント名空を使用します.

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

`mintable` 受け入れます `Infinitely`, `Once`, `Not`, または `Limited(n)` データモデルで受け入れられた値です `scale` 制限のない数値資産について

### ミント,バーン,および移転資産 {#mint-burn-and-transfer-assets}

これらの呼び出しは既存の資産 ID を使用します.最初に資産定義を登録し,その後に資産を所有する口座のために具体的な資産 ID を構築します.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### 譲渡所有権 {#transfer-ownership}

ドメイン,資産の定義,または NFT を制御する変更.現在の所有者を取引当局として使用します.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### メタデータ を 設定 し,削除 する {#set-and-remove-metadata}

メタデータ値は JSON - シリアライズ可能である必要があります. `TransactionDraft` を使用すると, `TransactionConfig` の権限はデフォルトターゲットアカウントになります.

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

高レベルの助手草案は,デフォルトでトランザクション機関を対象とする.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### リアル・ワールド アセット {#real-world-assets}

RWA ヘルパーは,資産特別のメタデータ,起源およびコントローラーポリシーのために JSON - シリアライズ可能な役に立たない負荷を使用します. `register_rwa` は`id`または `owner` を受け入れません:実行時間は`RwaId`を生成し,取引機関が最初の所有者になります.

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

登録取引がコミットした後,生成された ID を発見するために `FindRwas`, `/v1/rwas`, RWA イベント,または設定した探査者ルートを使用して:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

次の操作では,生成された `hash$domain` ID を使用します.

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

完全な移転は,既存の分数で `owned_by` を変化させることができる.部分的な移転と合併により,生成された子分数が生まれる.

### 触発機 {#triggers}

実行可能が別の命令配列である場合,トリガー登録ヘルパーを使用します:

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

Torii は,トリガー・インベントリのために REST ヘルパーも暴露する.

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

トリガー・インベクトリー呼び出しは,トリガー記録のみを読み取ったりチェックしたりする.登録,実行,重複変更,および非登録は変異操作である.

### レポと決済の指示 {#repo-and-settlement-instructions}

Repoと二国間和解支援者は,手工作業の Norito 役に立たないドメイン特有の指示バリエーションを添付する.

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

### JSON エスケープハッチ {#json-escape-hatch}

A について Python ヘルパーはまだ利用できていません. カノニカルデータモデルを入力してください. `InstructionBox` JSON に `Instruction.from_json` または直接 `TransactionBuilder.add_instruction_json`. これが推奨された道です `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, 同級者/役割 NFT これらのヘルパーが入力されるまで,非トリガー・アンリジスタバリエーションを登録します.

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

生成されたまたは不透明な指示については,固定装置を保管する前に JSON を往復して行ける.

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## トランザクション ワークフロー {#transaction-workflows}

署名する前に複数の指示を作成するアプリケーションでは `TransactionDraft` を使用します. ドラフトは, `ttl_ms`, `nonce`,およびメタデータなどのトランザクションレベルの設定を1つの場所に保持し,一度にサインすることができます.

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

審査,監査,または財布配送のための決定表を輸出する.

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

標的にされた車道に要求される場合,サインする前にレーンのプライバシー証明を添付する.

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

## 質問 {#queries}

タイプしたクエリヘルパーは,原始 JSON 辞書ではなくデータクラスを返します. SDK はページ化と共通の記録フィールドを解析するため,開始する最も簡単な方法です:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Torii エンドポイントにはまだタイピングされた包装がない場合,一般的な要求ヘルパーを使用します.

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

アカウント・インベントリー支援者は, SDK 標準化剤で,法典的な I105 口座 IDs ブロック探索者または原始エンドポイントが返信した場合, ID その SDK 拒否する場合は,それを法典的な説明に解決します ID 援助者を呼び出す前に,

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## 出来事 {#events}

ストリーミングヘルパーはデフォルトで JSON パイロードを解読します. SSE イベント名,ID,リトライヒント,および原料パイロードが必要なときに `with_metadata=True` をパスします. 最新 イベント ID を維持するために,`EventCursor` とのストリームをペアします.これらの例はライブイベントを待っているので,対応するイベントストリームが有効でアクティブになっているノードに対して実行します.

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

## 鍵と住所 {#keys-and-addresses}

SDK は,ネイティブ拡張子にコンパイルされたすべての署名アルゴリズムのローカルサインヘルパーを暴露します.これらのヘルパーは Taira に電話しませんが,ネイティブ延長が必要です:

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

`supported_crypto_algorithms()` を使用して,あなたの車輪がサポートしているものを確認してください. 一般的なヘルパーはカノニカルアルゴリズムラベルを使用し,これらのアルゴリズムのコンパイルを Ed25519, secp256k1, ML-DSA, GOST, BLS,および SM2 で実行します.

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

### 中国語 SM 暗号化 {#chinese-sm-cryptography}

Python SDK は,一般的な SM2 ヘルパーと SM2 特定の便利性ヘルパーの両方を暴露します.ノード機能広告を使用してターゲットネットワークが期待する SM2 識別子を選択してください:

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

`crypto.sm.enabled` は,ノードが現在のポリシーで SM ファミリーアルゴリズムを受け入れているかどうかを教えてくれます.同じ広告には, SM ハッシュポリシーと加速状態が含まれます.これは SM2 特定のフローを有効にするかどうかを決定するのに役立ちます:

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

公開 Taira はチェック中に SM 機能広告を暴露したが,そこに SM 署名が無効になった.その広告されたサインアルゴリズムは `ed25519`, `secp256k1`,および `bls_normal`であった.SM2 に署名した取引を,能力の役に立たない負荷が変化しない限り,その部署に提出してはならない.

### GOST および数値後の鍵 {#gost-and-post-quantum-keys}

GOST R 34.10-2012 パラメータセットおよび ML-DSA (`ml-dsa`) 量子後の署名のために一般的な暗号 API を使用します.同じキーペアオブジェクトはサイン,検証,マルチハッシュ輸出を処理します:

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

ゲート GOST とノードの広告されたサインアルゴリズムでのポスト量子流量.前向きに互換性のあるアルゴリズムの名前には原始能力の役に立たない負荷を使用する:

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

ノードが必要なアルゴリズムを広告していない場合,鍵はローカルまたはオフラインワークフローのみに使用してください.そのノードにこのアルゴリズムで署名したトランザクションを送信しないでください.Taira の公開チェック中に, GOST と ML-DSA は上流 Python ライブラリに SDK 暗号助手として利用可能であったが,取引署名のためにノードによって宣伝されていなかった.

## 設定意識のクライアント作成 {#config-aware-client-creation}

`resolve_torii_client_config` を使用すると,アプリケーションはファイルからノード設定を読み取りますが,依然として環境またはテスト特有のオーバーリッドが必要です.

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

## カゲムシャ の 準備 {#kagemusha-readiness}

Python SDK は,通用 Torii リクエストヘルパーを通じて現在の JSON 準備路線を查询することができる.

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

Python は,Kagemusha のタップアップやリデンプション アーカイブビルダーを露出しません. カノニカル V4 アーカイブを構築するために,タップされた Swift または JVM 財布を使用し,サポートされている Kagemusha Torii クライアントで提出およびアンケートします.

## サブスクリプション {#subscriptions}

サブスクリプションヘルパーは, `iroha_python.ToriiClient` が使用する共有された Torii クライアントから受け継いだサービス呼び出しを変異します. ターゲットにしたネットワークに存在する IDs と資産を使用してください.

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

## 接続する {#connect}

URIs を構築して解析し, Taira によって公開された公共の接続状態を読み取る.

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

フレームコデック,セッションキー誘導,およびセッション作成にはネイティブ拡張子と Connect セッションルートが有効化する必要があります.

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

承認後メッセージをステートセッションで暗号化する:

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

## 管理,実行時間,および管理面 {#governance-runtime-and-admin-surfaces}

Taira に対して,これらの読み込みのみの呼び出しが成功的に返回された.

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

ランタイムアップグレードのヘルパーは,ランタイムアップデート API で使用されるマニフェスト形状を受け入れます.これらはオペレーターアクションなので,アカウントとトークンが許可されているノードに対してのみ使用します.

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

## ステータス,コンセンサス,およびネットワークテレメトリ {#status-consensus-and-network-telemetry}

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

## SoraFS,UAID,および Kaigi 支援者 {#sorafs-uaid-and-kaigi-helpers}

対象ノードが対応する Nexus/SORA エンドポイントを暴露するとき,これらのヘルパーが利用可能である.空きリストを有効な応答として扱う:公開 Taira はサンプルマニストまたは UAID のデータなしにルートが有効になっている可能性があります.

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

## Norito RPC と GPU 支援者 {#norito-rpc-and-gpu-helpers}

使用 `NoritoRpcClient` あなたがすでに持っているとき Norito バイトとバイナリーを呼び出す必要がある Torii エンドポイント.この例では,以前のトランザクションテンプレートから署名された封筒が必要です:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

CUDA 支援者は,バックエンドが利用できないときに `None` を返却するので,アプリケーションはスケラー実装に戻ることができる.

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## 現在 の 対象 {#current-coverage}

Python SDK には既に以下の支援者が含まれている.

- Torii 提出,状態,查询,管理流
- 一般的な ISI およびドメイン特有の拡張子のためのタイピング・インストラクションビルダー
- トランザクション・エベロープのワークフルーズ
- ストリーミングイベント,フィルター,再開可能なカーサー
- 一般的な Kagemusha 準備アクセスおよび Torii サブスクリプションヘルパー;入力された補充と償還の構築者は暴露されません
- アカウントアドレス,全アルゴリズム署名支援者,マルチハッシュ回帰, SM2, GOST, ML-DSA, BLS,および機密鍵処理
- 接続 URIs,セッション,フレーム,暗号化ヘルパー,およびレジストリ管理者
- 管理,ランタイムアップグレード, Sumeragi,ノード-admin, SoraFS,UAID,および Kaigi エンドポイントの包装がノードはこれらの特徴を暴露する

## 上流参照 {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

これらのファイルは,固定されたワークスペース修正における Python 表面の真実源である.
