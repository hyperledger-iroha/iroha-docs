---
translation_locale: ja
translation_source: /blockchain/rwas.md
translation_source_hash: 8d64a9a17c93f60306c279e8656e6edde8ce5dd024e742218bfb9572b7438bb0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 実物資産 {#real-world-assets}

実世界の資産（RWAs）は、その所有権または管理がオンチェーンで追跡されるオフチェーン資産をモデル化します。Iroha では、RWA は、生成された識別子、所有者アカウント、数量、ビジネスメタデータ、出所、そして任意のライフサイクル制御を持つ登録されたブロックチェーン台帳ロットです。

RWAs は数値の資産残高とは異なります:

- 数値資産とは、アカウントが保有する代替可能な残高です
- 「NFT」は、1人の所有者を持つユニークなオンチェーン記録です
- 一つの RWA ビジネスメタデータ、数量、保有、凍結、償還状態、出所、および管理方針を運ぶことができる多くのものです

ブロックチェーンの台帳が単なる代替可能な残高だけでなく、特定のオフチェーンのロットを表す必要がある場合は、RWAs を使用してください。

## RWA ロット {#rwa-lot}

1つの RWA ロットには以下が含まれます:

- `id`：生成された標準的な RWA 識別子で、`<hash>$<domain>`として表示されます
- `owned_by`：現在その区画を所有しているアカウント
- `quantity`：ロットによって表される未処理数量
- `spec`：数量の指定、例えば小数のスケール
- `primary_reference`：主なオフチェーンプロトコル結果記録、証明書、請求書、または登録参照
- `status`：オプションの事業状況テキスト
- `metadata`：ビジネスコンテキストおよびインデックス作成に使用されるコンパクトな JSON フィールド
- `parents`：このロットを導出するために使用された元のロット
- `controls`: コントローラーアカウント、コントローラーロール、有効なコントローラー操作
- `is_frozen` と `held_quantity`：ソフトウェアランタイムによって強制されるライフサイクル状態

オンチェーンのペイロードをコンパクトに保ちます。大きな法的文書、検査報告書、および監査バンドルは WSV の外に保存し、暗号学的ダイジェスト値、URI、SoraFS パス、または技術的マニフェスト参照を RWA メタデータに入れます。

## 識別子 {#identifiers}

`RegisterRwa` は要求元クライアントが選択した `id` を受け入れず、`owner` フィールドも受け入れません。トランザクション認証の主体は初期の `owned_by` アカウントとなり、ソフトウェアの実行時にターゲットドメインで `RwaId` が生成されます。

RWA IDの文字形式は次の通りです:

```text
<generated-hash>$<domain>
```

例えば：

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

アプリケーションは、自社の識別子を `primary_reference` または `metadata` に保存し、その後、`RwaEvent::Created`、`FindRwas`、`/v1/rwas`、またはトランザクション完了後に設定されたエクスプローラルートから生成された `RwaId` を検出する必要があります。

## ライフサイクル {#lifecycle}

一般的な RWA ワークフローには次のものがあります:

|操作|実装された動作|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              |ドメイン内に生成IDロットを作成します。取引承認の主体は `owned_by` になります。|
| `TransferRwa`                              |数量を別のアカウントに移動します。全額の転送は `owned_by` を変更できます。部分的な転送は、生成されたIDを持つ別の子ロットを作成します。|
| `HoldRwa`                                  |予約数量。設定済みのコントローラーと`hold_enabled`が必要です。|
| `ReleaseRwa`                               |保持されている数量を削除します。設定されたコントローラーと`hold_enabled`が必要です。|
|`FreezeRwa`                                |通常の所有者操作をブロックします。構成されたコントローラーと`freeze_enabled`が必要です。|
| `UnfreezeRwa`                              |通常のオーナー操作を再有効化します。構成済みのコントローラーと`freeze_enabled`が必要です。|
|`RedeemRwa`                                |流通量から数量を恒久的に差し引くこと。所有者または管理者は、`redeem_enabled` が真であるときにこれを提出できます。|
|`MergeRwas`                                |同じドメインと仕様を持つ親ロットの数量を組み合わせ、生成された子ロットにまとめる。|
| `ForceTransferRwa`                         |コントローラーフローを通じて数量を移動します。構成されたコントローラーと`force_transfer_enabled`が必要です。|
| `SetRwaControls`                           |ロット管理ポリシーを置き換えます。所有者または管理者が必要です。|
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |ロットのメタデータを更新します。所有者またはコントローラーが必要です；凍結されたロットはコントローラーが必要です。|

現在のコードには`UnregisterRwa`の指示はありません。表された数量が納品、消費、決済、またはその他の方法で流通から除かれたときに、`RedeemRwa`でオフチェーンのロットを廃止してください。

## メタデータとコントロール {#metadata-and-controls}

メタデータを使用して、アプリケーションがロットを識別および検証するのに役立つ簡潔な情報を提供します:

- 資産クラス、発行者、保管機関、または登録リファレンス
- 倉庫、金庫、ISIN、請求書、または証明書の識別子
- 証明書および法的文書のためのコンテンツ暗号ハッシュ
- SoraFS より大きな証拠バンドルのためのパスまたは技術マニフェスト参照
- オフチェーンサービスによって使用される成熟度、法域、またはコンプライアンスタグ

実装された `RwaControlPolicy` には次のフィールドがあります:

```json
{
  "controller_accounts": [],
  "controller_roles": [],
  "freeze_enabled": true,
  "hold_enabled": true,
  "force_transfer_enabled": false,
  "redeem_enabled": true
}
```

コントローラーのアカウントと役割は、対応するブールフラグによって有効になっている操作のみを実行できます。現在のコントロールペイロードには、コントローラーの識別情報と操作フラグが含まれています。転送の許可リストとネストされた `transfers` ルールは、このペイロードの外にあります。

## クエリ、イベント、および APIs {#queries-events-and-apis}

使う [`FindRwas`](/ja/reference/queries.md#assets-nfts-and-rwas) 登録済みを一覧表示する RWA たくさん。ライブ更新が必要なアプリケーションは購読することができます [`Rwa` データイベント](/ja/blockchain/filters.md#data-event-filters) 作成済み、所有者変更済み、分割済み、統合済み、償還済み、凍結済み、解除済み、 保持、解放、力の転送、制御の変更、およびメタデータのイベント。

Torii チェーンステートルートなどを公開する `/v1/rwas` そして `/v1/rwas/query`, プラス探索ルートなど `/v1/explorer/rwas` そして `/v1/explorer/rwas/{rwa_id}` そのルートファミリーが有効になっているとき。生成されたクライアントはライブを優先するべきです [`/openapi.json`](/ja/reference/torii-endpoints.md#common-endpoints) ノードによって公開される正確な応答の形状のためのドキュメント。

### Taira でこのワークフローを実行してください {#try-it-on-taira}

現在、公開されている Taira に RWA ロットが登録されているか確認してください：

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

ライブの Taira OpenAPI ドキュメントによって公開されている RWA ルートを一覧表示してください:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

公開ロットがまだ登録されていない場合、空の `items` 出力が予想されます。登録、譲渡、保留、凍結、および償還は署名された取引です。

## 試してみて {#try-it}

以下の例では、[共通設定](/ja/guide/tutorials/python.md#shared-setup) の Python SDK サーフェスを使用しています。トランザクションを送信する前に、アカウントID、秘密鍵、および生成されたロットIDを自分のネットワークの値に置き換えてください。

### RWA API ルートを発見する {#discover-rwa-api-routes}

この読み取り専用の例は、実行中の Torii ノードに、どのアプリ向け RWA ルートが有効になっているかを尋ねます:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi.json", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

リストが空の場合でも、ノードは他の Torii APIs を通じて RWA の命令やクエリをサポートする可能性がありますが、オプションの JSON ルートファミリーは公開していません。

### 倉庫プロトコル結果記録を登録する {#register-a-warehouse-receipt}

1つのビジネスアクションが1つの署名済みトランザクションになる場合は、ドラフトを使用してください。ビジネスプロトコルの結果記録番号は`primary_reference`に入力します；ブロックチェーン台帳IDはトランザクションが確定した後に生成されます。

```python
from iroha_python import TransactionConfig, TransactionDraft

config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    metadata={**TX_METADATA, "source": "rwa-docs"},
)

draft = TransactionDraft(config)
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "inspection_report": "sorafs://reports/copper-001.json",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

取引が完了した後、生成された RWA ID を一覧表示します。チェーンステートルートは正規の ID を公開します。ID を `primary_reference` やメタデータに戻して照合する必要がある場合は、イベントやエクスプローラーの詳細ルートを使用してください。

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

エクスプローラー対応ノードは、より詳細なプロジェクションも返すことができます:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### 一時保留付きで転送 {#transfer-with-a-temporary-hold}

チェーンによって返された生成された RWA IDを使用してください。この例では`alice`がオーナーであり、`hold_enabled`とともにコントローラーとしても設定されていると仮定しています。

```python
warehouse_lot_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.transfer_rwa(warehouse_lot_id, quantity="10", destination=bob)
draft.hold_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

オフチェーンプロセスが成功した後、`ReleaseRwa` を提出してください:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### コントロールと監査メタデータを追加 {#add-controls-and-audit-metadata}

コントロールとメタデータは別です。コントロールはコントローラーポリシーに使用し、メタデータはアプリケーションや監査人が表示する必要のある事実に使用します:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.set_rwa_controls(
    warehouse_lot_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)
draft.set_rwa_key_value(warehouse_lot_id, "auditor", "alice")
draft.set_rwa_key_value(
    warehouse_lot_id,
    "proof_hash",
    "sha256:2b1c7a4e...",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 数量を引き換えるまたは廃止する {#redeem-or-retire-quantity}

代表されるオフチェーン資産が配送、消費、廃止、またはその他の方法で流通から除外された後、`RedeemRwa`を提出してください。これにより、提出された数量がロットから恒久的に差し引かれます。ロットは`redeem_enabled`を持っている必要があります。暗号署名者は所有者または管理者でなければなりません。

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### コンプライアンス審査中に凍結 {#freeze-during-compliance-review}

オフチェーンのレビューが通常のオーナー操作をブロックする必要がある場合は、`FreezeRwa` を提出してください。暗号署名者はコントローラーでなければなりません。ロットには `freeze_enabled` が必要です。

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.freeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {
        "status": "frozen",
        "reason": "custodian inventory check",
        "case_id": "OPS-2026-0042",
    },
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

レビューが通過した後に `UnfreezeRwa` を提出してください:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.unfreeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {"status": "cleared", "case_id": "OPS-2026-0042"},
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 売掛金 {#invoice-receivable}

請求書番号を`primary_reference`およびメタデータに保存することで、請求書を RWA ロットとして表現します。登録後、生成されたIDを転送および償還に使用します。

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.register_rwa(
    {
        "domain": "receivables.universal",
        "quantity": "50000",
        "spec": {"scale": 2},
        "primary_reference": "INV-2026-0007",
        "status": "issued",
        "metadata": {
            "asset_class": "invoice",
            "currency": "USD",
            "debtor": "example-buyer",
            "due_date": "2026-06-30",
            "document_hash": "sha256:4df4c8...",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": False,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

売掛金が資金化されるか支払われる場合、生成された請求書ロットIDを使用してください:

```python
invoice_lot_id = (
    "fedcba9876543210fedcba9876543210"
    "fedcba9876543210fedcba9876543210$receivables.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.transfer_rwa(invoice_lot_id, quantity="50000", destination=bob)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

オフチェーンの金融取引清算後に、表示された金額を引き換える:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### カーボンクレジットの償却 {#carbon-credit-retirement}

請求されたカーボンクレジットを流通から除外するために `RedeemRwa` を提出してください。オフチェーン証明書または登録証明をメタデータに保存してください：

```python
carbon_lot_id = (
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$carbon.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(carbon_lot_id, quantity="250")
draft.set_rwa_key_value(
    carbon_lot_id,
    "retirement_certificate",
    "sorafs://certificates/carbon-credit-2026-001-retired.json",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 2つのロットを統合する {#merge-two-lots}

オフチェーンのポジションが2つ統合されるときにロットを統合します。親は同じドメインにあり、同じ数量仕様を使用している必要があります。ソフトウェアの実行時に子ロットIDが生成されます。

```python
warehouse_lot_id_2 = (
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.merge_rwas(
    {
        "parents": [
            {"rwa": warehouse_lot_id, "quantity": "40"},
            {"rwa": warehouse_lot_id_2, "quantity": "60"},
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "merge_reason": "same custodian and quality grade",
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

完全な Python トランザクションの例については、[実物資産](/ja/guide/tutorials/python.md#real-world-assets)を参照してください。

## 関連ドキュメント {#related-docs}

- [資産](/ja/blockchain/assets.md)
- [メタデータ](/ja/blockchain/metadata.md)
- [Iroha 命令操作](/ja/blockchain/instructions.md)
- [クエリ](/ja/reference/queries.md#assets-nfts-and-rwas)
- [Torii API エンドポイント](/ja/reference/torii-endpoints.md#app-and-sora-route-families)
