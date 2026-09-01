---
translation_locale: ja
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Python {#python}

上流ワークスペースの Python SDK は`iroha-python`です。最初の Iroha 3 リリースは現在の Torii および Norito サーフェスを対象としています。統合で使用するパッケージバージョンまたはソースリビジョンを固定して、SDK とノードが同じシリアル化フォーマットリビジョンのままであるようにしてください。

以下の匿名読み取り例は、`https://taira.sora.org` の公開 Taira を対象とします。読み取り専用のルートでも、正規のアカウント署名または対象ネットワークの正確なオペレーター署名が必要な場合があり、その例は個別に示します。状態を変更する例はトランザクションのテンプレートです。送信するには、実在する Taira の権限主体、秘密鍵、型付きの手数料支払い意図、十分な testnet XOR、および対象ルートが要求する認証が必要です。

この順番で例を使ってください:

|ステージ|公共に対して Taira に立候補する？|必要なもの|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|非通知着信|はい| Python パッケージプラスネットワークアクセス|
|アカウントまたはオペレーター認証済みの読み取り|自分で認めたアイデンティティだけで|正確な Taira `NetworkId` および対応するアカウントまたはオペレーターキー|
|ローカル署名および命令ビルダー| `submit()` までネットワークコールはありません|ネイティブ拡張とあなたの鍵素材|
|トランザクションとサービス呼び出しの変更|自分で資金を入れたアカウントのみで|認可の主要アカウント、秘密鍵、正確な Taira `NetworkId`、入力済みの手数料意図、手数料資産残高、およびルートトークン|
|フレームコーデック、暗号、そして GPU ヘルパーを接続する|ローカルのみ|ネイティブ拡張；GPU ヘルパーも CUDA 対応のバックエンドが必要です|

## インストール {#install}

パッケージのメタデータ名は `iroha-python` です。固定されていない PyPI のインストールがライブの Taira ネットワークと一致するとは想定しないでください。統合が対象とする同じ上流リビジョンからビルドされたホイールまたはソースコードの作業コピーをインストールしてください:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

プロジェクトが上流のワークスペースを直接利用する場合は、Python の依存関係をインストールし、`Instruction`、`TransactionDraft` を使用する例を実行する前にネイティブ拡張機能をビルドしてください。署名、暗号、SoraFS ネイティブヘルパー、GPU ヘルパー、または Connect フレームコーデック。アップストリーム `python/iroha_python/README.md` からビルドコマンドを使用し、ネイティブエクスポートがロードされることを確認してください:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

もし `create_torii_client` のインポートが成功しても、`Instruction` または `generate_ed25519_keypair` が失敗した場合、純粋な Python パッケージは利用可能ですが、ネイティブ拡張は利用できません。

## クイックスタート {#quickstart}

パブリックで読み取り専用の Taira API エンドポイントから始めます:

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

## 共通設定 {#shared-setup}

この設定は変異テンプレートに使用してください。提出する前に、すべてのプレースホルダーをあなたのデプロイメントからの Taira 認証プリンシパル、秘密鍵、トークン、および資産/アカウントIDに置き換えてください。

`authority` はトランザクションに署名するアカウントであり、`private_key` はそれと一致する必要があります。トランザクションは Taira の正確なジェネシス由来 `NetworkId` に結びつきます。チェーン UUID はデプロイラベルであり、トランザクションIDではありません。手数料は、アプリケーションのメタデータとは独立して、タイプ化された支払い意図と正確なライブ見積もりを使用します。以下のアカウントおよびキーのプレースホルダーは意図的に無効であり、誤って送信されないようにしています。

以下のリテラルは、現在固定されている Taira ブロックチェーンのジェネシスIDです。テストネットのリセットによって変更される可能性があるため、署名済みデプロイメントプロファイルから更新し、チェーンから推測しないでください UUID。

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

`Instruction.*` は構築命令のペイロードのみを呼び出します。`submit()` は、SDK がライブの手数料見積もりを取得し、正確に見積もられたペイロードに署名し、それを Torii に送信してステータスを待つポイントです。

## 手数料および取引実行コスト {#fees-and-gas}

書き込みトランザクションには、型付きの`FeePaymentIntent`と資金がある手数料資産残高が必要です。Taira では、パブリックテストネットの資金提供サービスがテストネット XOR に資金を提供します。Python SDK は固定の署名されていないものを送信します正確な手数料見積もりのために Torii にペイロードを送信し、見積もりが支払人やペイロードを変更していないことを検証し、見積もり意図に署名します。手数料の選択は取引メタデータに入れないでください。

上記の`submit()`ヘルパーは、手数料制限が意図的に空の、取引署名アカウントによって支払われる意図から始まります。`quote_and_sign()`は署名前にライブ見積もりからそれらを埋めます:

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

書き込みを送信する前に、認可プリンシパルアカウントが手数料資産を十分に所有していることを確認してください。正確なテストネット資金提供サービスと資産IDはネットワーク固有です。これは Taira の形です。

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

テストネットの資金提供サービスは、残高確認に使用する具体的な`asset_id`を返します。ライブ見積もりが`FEE_ASSET_DEFINITION`を請求することを確認してください。取引はメタデータを通じてその資産を選択しません。

アプリケーションメタデータはオプションであり、料金の意味はありません：

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

手数料の意図を省略したり、予期しない資産の見積もりを受け入れたり、見積もり後にペイロードを変更したり、資金のないアカウントで署名した場合、取引は送信してはいけません。

## 匿名 Taira が読む {#anonymous-taira-reads}

これらの呼び出しは、カタログ境界が匿名読み取りを許可する Taira ルートを使用します:

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

`/v1/time/status` およびすべての `/v1/sumeragi/*` オペレーターのデータスナップショットは、状態を変更しないにもかかわらず、正確なネットワークオペレーターの署名が必要です。匿名ノードの状態には `request_json("GET", "/status")` を使用してください。コンセンサスまたはノードローカルクロック診断のためのペイロードとオペレーター設定は以下の通りです。接続セッションのステータスは別のプロトコルルートであり、そのセッションの管理トークンが必要です。

## 指示ビルダー {#instruction-builders}

SDK は、最も一般的な命令ファミリー向けの型付きビルダーと、まだ第一級の Python メソッドではないバリアント向けの JSON エスケープハッチを公開します。以下のスニペットはミューテートするトランザクションテンプレートであり、署名付きアカウントなしで公開 Taira に提出されたものではありません。

存在する場合は型付きのヘルパーを優先してください：それらは Python の値を正規化し、無効な形状の場合には早期に失敗します。`Instruction.from_json`は、まだ Python ヘルパーがない命令バリアントが必要な場合にのみ使用してください。

|指導家族| Python 表面|
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|登録|`register_account`、`register_asset_definition_numeric`、`register_rwa`、`register_time_trigger`、`register_precommit_trigger`；`register_domain` はジェネシス／ブートストラップツール用に予約されています|
|登録解除| `unregister_trigger`; 他のバリアントには `Instruction.from_json` を使用してください|
|生成/焼却| `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions`|
|転送| `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|メタデータとコントロール| `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
| RWA ライフサイクル| `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa`|
| ExecuteTrigger | `execute_trigger` |
|リポ／決済延長| `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp`|
|ネイティブ資産ロック| `open_asset_lock`、`drawdown_asset_lock`、`cancel_asset_lock`、`expire_asset_lock`、およびクライアント`*_and_wait`のヘルパー|
|付与/取り消し、SetParameter、ログ、カスタム、アップグレード、およびあまり一般的でない登録/登録解除のバリアント| `Instruction.from_json` または `TransactionBuilder.add_instruction_json`、正規の `InstructionBox` JSON|

エスクロー形式の条件付き支払いについては、[ネイティブ資産エスクロー](/ja/blockchain/escrow.md#python-asset-locks) を参照してください。Python は現在、汎用資産ロックのための一流のヘルパーを公開していますが、マーケットプレイスおよび匿名エスクローのヘルパーはまだ一流の Python メソッドではありません。

### ドメインを設定し、その後アカウントと資産を登録する {#set-up-domains-then-register-accounts-and-assets}

通常のドメイン作成は宣言型エイリアスプランナーを経由するため、SNS のリース、所有者の権限、料金価格の検証ガード、およびドメイン状態が一緒にチェックされます。あなたの SDK またはオンボーディングサービスでシークレットなしの`AliasSetupPlanRequestV1`インテントを作成し、次に`iroha app alias setup plan`と`iroha app alias setup apply`を使用してください。`Instruction.register_domain`をアプリケーショントランザクションから送信しないでください。そのビルダーはジェネシス/ブートストラップツール用に残ります。

ドメイン設定計画が確定した後、ドメイン所有のオブジェクトを登録してください。Taira のような共有ネットワーク上では、あなたに割り当てられたドメインおよびアカウントの名前空間を使用してください。

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

`mintable` は、データモデルで受け入れられる `Infinitely`、`Once`、`Not`、または `Limited(n)` の値を受け入れます。制約のない数値資産の場合は `scale` を省略してください。

### 資産を発行、破壊、および譲渡する {#mint-burn-and-transfer-assets}

これらの呼び出しは既存の資産IDを使用します。まず資産定義を登録し、その後、資産を所有するアカウントの具体的な資産IDを作成してください。

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### 所有権を移転する {#transfer-ownership}

所有権の移転は、ドメイン、資産の定義、または NFT を誰が管理するかを変更します。取引の承認主体には現在の所有者を使用してください。

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### メタデータの設定と削除 {#set-and-remove-metadata}

メタデータの値は JSON でシリアライズ可能である必要があります。`TransactionDraft`を使用すると、`TransactionConfig`の認可プリンシパルがデフォルトのターゲットアカウントになります。

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

高レベルのドラフトヘルパーは、デフォルトで取引承認の主体をターゲットにします。

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

### 実物資産 {#real-world-assets}

RWA ヘルパーは、資産固有のメタデータ、出所、コントローラーポリシーのために JSON-シリアライズ可能なペイロードを使用します。`register_rwa` は `id` または `owner` を受け入れません：ソフトウェアランタイムが `RwaId` を生成し、トランザクション承認プリンシパルが初期所有者となります。

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

登録取引が完了した後、生成されたIDを確認するには、`FindRwas`、`/v1/rwas`、RWA イベント、またはエクスプローラーのルートを使用してください。

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

後続の操作では、生成された `hash$domain` ID を使用します:

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

完全な移動は既存のロットの`owned_by`を変更できます。部分的な移動と結合は生成された子ロットを作成します。

### トリガー {#triggers}

実行ファイルが別の命令シーケンスである場合は、トリガー登録ヘルパーを使用してください:

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

Torii はトリガーインベントリ用の REST ヘルパーも公開します。

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

トリガーの在庫呼び出しは、トリガー記録を読み取るか検査するだけです。登録、実行、繰り返しの変更、および登録解除は変更操作です。

### レポおよび金融取引決済の指示 {#repo-and-settlement-instructions}

リポジトリおよび二国間決済ヘルパーは、手作業で作成した Norito ペイロードを使わずに、ドメイン固有の指示バリエーションを追加します。

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

### JSON 脱出口 {#json-escape-hatch}

Python ヘルパーがない場合は、正規のデータモデル `InstructionBox` JSON を `Instruction.from_json` に渡します。`Grant`、`Revoke`、`SetParameter`、`Log`、`Custom`、`Upgrade`、ピア／ロール／NFT の登録、およびトリガー以外の登録解除については、それぞれの型付きヘルパーが用意されるまで、この方法を推奨します。

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

トランザクション境界で入力されたドラフトパスを保持してください：これは正確な`NetworkId`、手数料支払いの意図、および署名前の見積もり不変条件を保持します。直接の`TransactionBuilder`使用には同じ値に加えて、ライブの見積もりの明示的な検証が必要なため、アプリケーションコードのショートカットとしては利用できません。

生成された指示や不透明な指示については、テスト成果物を保存する前に JSON を経由してください:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## 取引ワークフロー {#transaction-workflows}

署名前に複数の命令を構築するアプリケーションには`TransactionDraft`を使用してください。ドラフトを使うことで、`ttl_ms`、`nonce`、およびメタデータなどのトランザクションレベルの設定を一箇所にまとめ、その後一度だけ署名することができます:

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

レビュー、監査、またはウォレット引き渡しのために決定論的な技術マニフェストをエクスポートする:

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

対象の実行レーンがそれを必要とする場合、署名前に実行レーンのプライバシー証明を添付してください:

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

## クエリ {#queries}

入力されたクエリヘルパーは生の JSON 辞書ではなくデータクラスを返します。これらは最も簡単に始められる方法で、SDK がページネーションや一般的なレコードフィールドを解析してくれます:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

型付きソフトウェアアダプターがまだ存在しない Torii API エンドポイントの場合は、汎用リクエストヘルパーを使用してください:

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

アカウントインベントリヘルパーには、SDK のノーマライザーが受け入れるアカウント識別子が必要です。正規の I105 アカウントIDまたはオンチェーンのエイリアスを使用してください；ブロックエクスプローラーや生の API エンドポイントが SDK に拒否されるIDを返す場合、これらのヘルパーを呼び出す前に、それを正規のアカウントIDに解決してください:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## イベント {#events}

ストリーミングヘルパーはデフォルトで JSON ペイロードをデコードします。`with_metadata=True` を渡すと、SSE イベント名、ID、再試行ヒント、および生のペイロードが必要な場合に対応します。標準の `/v1/events/sse` フィードはライブ専用であり、リプレイIDを発行せず、リプレイログも保持しないため、これらのヘルパーはカーソルや再開引数を提供しません。再接続は新しいサブスクリプションを開始し、ギャップが発生する可能性があります。ブロックチェーン台帳の完全な履歴が必要な場合は、既知の高さから`/v1/blocks/stream`を使用してください。これらの例はライブイベントを待機するため、ストリームが有効でアクティブなノードで実行してください。

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

## キーとアドレス {#keys-and-addresses}

その SDK ネイティブ拡張にコンパイルされたすべての署名アルゴリズムのためのローカル署名ヘルパーを公開します。これらのヘルパーは呼び出しを行いません Taira, しかし、それらはネイティブ拡張を必要とします：

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

`supported_crypto_algorithms()`を使用して、あなたのホイールが何をサポートしているかを確認してください。汎用ヘルパーは標準的なアルゴリズムラベルを使用し、Ed25519、secp256k1、ML-DSA、GOST、BLS、および SM2 がコンパイルされている場合に機能します。

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

### 中国 SM 暗号学 {#chinese-sm-cryptography}

Python SDK は、汎用の SM2 ヘルパーと SM2 専用の便利なヘルパーの両方を公開します。ターゲットネットワークが期待する SM2 を区別する識別子を選択するには、ノードの機能広告を使用してください:

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

`crypto.sm.enabled` は、ノードが現在のポリシーで SM ファミリーのアルゴリズムを受け入れるかどうかを示します。同じアドバートには SM 暗号ハッシュポリシーとアクセラレーションの状態も含まれており、SM2 固有のフローを有効にするかどうかを決める際に便利です。

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

認証された機能ペイロードは、展開されたノードに対して権威あるものとして扱います。`crypto.sm.enabled` が true であり、広告された署名ポリシーがそれを認めていない限り、SM2 で署名されたトランザクションを送信しないでください。

### GOST とポスト量子鍵 {#gost-and-post-quantum-keys}

ジェネリック暗号 API を GOST R 34.10-2012 パラメータセットおよび ML-DSA (`ml-dsa`) ポスト量子署名に使用します。同じ鍵ペアオブジェクトが署名、検証、およびマルチハッシュのエクスポートを処理します：

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

ノードの認証済み、型付き能力広告におけるゲート GOST とポスト量子フロー：

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

ノードが必要なアルゴリズムを広告していない場合、そのキーはローカルまたはオフラインのワークフローにのみ使用してください。そのアルゴリズムで署名されたトランザクションをそのノードに送信しないでください。公開 Taira チェックの間、GOST と ML-DSA は上流の Python ライブラリで SDK 暗号補助として利用可能でしたが、トランザクション署名のためにノードによって宣伝されていませんでした。

## 設定対応クライアント作成 {#config-aware-client-creation}

アプリケーションがファイルからノード設定を読み取るが、それでも環境またはテスト固有のオーバーライドが必要な場合は、`resolve_torii_client_config` を使用してください:

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

## 影武者の準備 {#kagemusha-readiness}

Python SDK は、汎用の Torii リクエストヘルパーを通じて、現在の JSON の準備状況ルートを問い合わせることができます:

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

Python は型付きの影武者のチャージや償還アーカイブビルダーを公開していません。型付きの Swift または JVM ウォレットを使用して、標準の V4 アーカイブを構築し、その後、サポートされている影武者の Torii クライアントを通じて送信およびポーリングしてください。

## サブスクリプション {#subscriptions}

サブスクリプションの読み取りおよびドラフトビルダーは、`iroha_python.ToriiClient` によって使用される共有の Torii クライアントから継承されます。すべてのミューテーションはボディ結合された標準的なアカウント署名とともに受理され、署名されていないトランザクションドラフトを返します。Torii は決して秘密鍵を受け取らず、ドラフトを代わりに送信することはありません。

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

各正確なペイロードと署名メッセージを対応するアカウントのローカルウォレットに渡し、そこで要求された操作を確認し、署名済みトランザクションを組み立て、通常のトランザクションソフトウェア処理ワークフローを通じて提出します。 Python SDK は、署名メッセージが返されたペイロードの標準的な暗号ハッシュであることを検証しますが、ウォレットは署名前にトランザクションのデコードと承認の責任を負い続けます。

## 接続 {#connect}

Connect URIs をローカルで構築して解析します。Connect ID は SID を正確な `NetworkId`、アプリ公開鍵、および暗号化ノンス値に結び付けます:

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

ターゲットノードが Connect を公開している場合にのみ、その正確なプレビューを登録します。セッション作成は、役割ごとの 4 つのベアラートークンを返します。セッションごとのステータスルートには管理トークンが必要です；集約ステータスはオペレーター用ルートです。

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

承認後のメッセージをステートフルセッションで暗号化する:

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

## ガバナンス、ソフトウェアランタイム、管理サーフェス {#governance-runtime-and-admin-surfaces}

ガバナンスの読み取りはアカウント認証済みです。[共通設定](#shared-setup)の認可プリンシパルと鍵ペアを使用して、各ヘルパー呼び出しを Taira の正確なジェネシス由来の`NetworkId`にバインドします:

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

オペレーター読み取り用の別のクライアントを作成します。ソフトウェア実行時に許可リストにあるオペレーターキーをロードし、それを Taira の正確な`NetworkId`にバインドします。ベアラートークンと`x-api-token`はこの署名を置き換えません：

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

ランタイムアップグレードルートは、オペレーター認証済みの指示ビルダーです。提案、アクティブ化、またはキャンセルの応答が成功すると `tx_instructions` が返されますが、アップグレードは実行されません。そのバンドルは、通常の署名済みトランザクションおよびガバナンスの経路を通して提出してください。固定された Python メソッド`propose_runtime_upgrade`、`activate_runtime_upgrade`、および`cancel_runtime_upgrade`は現在、クライアントの`OperatorSigningContext`を適用するのではなく、通常のリクエストを発行するため、このチュートリアルではそれらを動作するオペレーターフローとして示していません。

## ステータス、コンセンサス、およびネットワークテレメトリ {#status-consensus-and-network-telemetry}

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

## SoraFS、UAID、および Kaigi ヘルパー {#sorafs-uaid-and-kaigi-helpers}

これらのヘルパーは、ターゲットノードが対応する Nexus/SORA API エンドポイントを公開している場合に利用可能です。空のリストを有効な応答として扱ってください: public Taira は、サンプル技術マニフェストまたは UAID のデータなしでルートが有効になっている可能性があります。

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

## Norito、RPC、および GPU ヘルパー {#norito-rpc-and-gpu-helpers}

Norito バイトをすでに持っていて、バイナリ Torii API エンドポイントを呼び出す必要がある場合は、`NoritoRpcClient` を使用してください。この例では、前のトランザクションテンプレートからの署名済みデータコンテナが必要です。

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

CUDA ヘルパーは、バックエンドが利用できない場合に `None` を返すため、アプリケーションはスカラー実装にフォールバックできます:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## 現在のカバレッジ {#current-coverage}

Python SDK には、すでに次のためのヘルパーが含まれています:

- Torii 提出、ステータス、問い合わせ、管理フロー
- 一般的な ISI およびドメイン固有の拡張のための型付き命令ビルダー
- 取引ドラフト、技術マニフェスト、署名、および署名済み取引データコンテナのワークフロー
- ライブイベントストリームと入力されたフィルター；確定済みブロックストリームは完全な履歴を提供します
- 一般的な影武者の準備アクセスおよび Torii 購読ヘルパー；型付きのチャージおよび償還ビルダーは公開されていません
- アカウントアドレス、全アルゴリズム署名ヘルパー、マルチハッシュラウンドトリップ、SM2、GOST、ML-DSA、BLS、および機密キーの取り扱い
- URIs、セッション、フレーム、暗号化ヘルパー、およびレジストリ管理者を接続する
- ノードが対応する場合の、ガバナンス、ランタイム更新、Sumeragi、ノード管理、SoraFS、UAID、Kaigi 各エンドポイントのラッパー

## 上流参照 {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

これらのファイルは、固定されたワークスペースのリビジョンにおける Python サーフェスの真実の源です。
