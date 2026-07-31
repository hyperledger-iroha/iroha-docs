---
translation_locale: ja
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# リアル・ワールド アセット {#real-world-assets}

リアルワールド・アセット (RWAs) は,チェーン上で所有または制御が追跡されるオフチェーンの資産モデルである. Iroha では, RWA は生成された識別子,オーナーアカウント,数量,ビジネスメタデータ,起源,およびオプションライフサイクルコントロールを持つ登録レジスタンスです.

RWAs は,数値資産の余剰とは異なる.

- 数値資産は,口座で保有する浮動余分である
- NFT は,単一の所有者による連鎖上の記録である.
- RWA は,ビジネスメタデータ,数量,保有物,凍結,償還状態,出産,およびコントローラポリシーを搭載できるパットである.

RWAs を使えば,レジスタは単にフンギブルなバランスではなく,特定のチェーン外のロットを表示する必要がある.

## RWA ロット {#rwa-lot}

RWA ラットは以下のものを含む.

- `id`:生成された法定識別子 RWA は, `<hash>$<domain>`として表示されます.
- `owned_by`:現時点でパトルを保有する口座
- `quantity`: 配合で表される残存量
- `spec`:数値仕様,例えば10度スケール
- `primary_reference`:主要連鎖外領収書,証明書,請求書,または登録参照
- `status`:オプションの事業状況テキスト
- `metadata`:ビジネス・コンテキストとインデックスに使用されるコンパクトのフィールド JSON
- `parents`:この配合を抽出するために使用されたソース・ロット
- `controls`:コントローラ口座,コントローラの役割,および有効なコントローラ操作
- `is_frozen`と `held_quantity`:実行時間によって執行されるライフサイクル状態

WSV の外に大きな法律文書,検査報告,監査バンドルを保存し,その後 URI, SoraFS 経路,または明示的な参照を RWA メタデータに挿入します.

## 識別子 {#identifiers}

`RegisterRwa` は,呼び出し者によって選択された `id` を受け入れず, `owner` フィールドを認めない.トランザクション当局は初期 `owned_by` アカウントとなり,実行時間は目標ドメインで `RwaId` を生成する.

RWA ID のテキスト形式は,次のとおりです.

```text
<generated-hash>$<domain>
```

例えば:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

`RwaEvent::Created`,`FindRwas`, `/v1/rwas`,または取引のコミットメント後に設定された探査者経路から生成された `RwaId` を発見する際に,アプリケーションはその事業識別子を `primary_reference` または `metadata` に保管すべきである.

## ライフサイクル {#lifecycle}

一般的な RWA ワークフローは,以下のとおりです.

|作戦|実行された行動|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa`|ドメインで生成された ID パットを作成し,取引権限は `owned_by` になります. |
|`TransferRwa`|額を別のアカウントに移動する.完全な転送は `owned_by` を変更できます.部分的な移転により生成された子配分が作成されます.|
|`HoldRwa`|備蓄量.設定されたコントローラーと `hold_enabled`が必要です. |
|`ReleaseRwa`|設定されたコントローラーと `hold_enabled` を必要とする.|
|`FreezeRwa`|設定されたコントローラーと `freeze_enabled` を必要とする. |
|`UnfreezeRwa`|設定されたコントローラーと `freeze_enabled` を必要とする.|
|`RedeemRwa`|持ち主またはコントローラと `redeem_enabled` を要求する.|
|`MergeRwas`|同じドメインとスペックを持つ親 Lotの量を組み合わせ,生成した子供 Lotにします. |
|`ForceTransferRwa`|制御器の流れを介して量移動する.設定された制御器と `force_transfer_enabled` を要求します. |
|`SetRwaControls`|パートコントロールのポリシーを交換する オーナーやコントローラが必要です|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |パートメタデータを更新する. オーナーやコントローラを必要とする. 凍結されたパットにはコントローラーが必要です. |

現行のコードには `UnregisterRwa` の指示はありません.表示された量は配送,消費,決済または他の方法で流通から取り除かれたとき,鎖外のパットを `RedeemRwa` で撤回します.

## メタデータと制御 {#metadata-and-controls}

コンパクトな事実のためにメタデータを使用し,アプリケーションがパットを特定して検証するのを助けます:

- 資産クラス,発行者,保管人,または登録参照
- 倉庫,保管庫, ISIN,請求書または証明書の識別子
- 証明書および法文書の内容ハッシュ
- SoraFS より大きな証拠パネルのための経路またはマニュメント参照
- オフチェーンサービスで使用される期限,管轄権,またはコンプライアンスタグ

実施された `RwaControlPolicy` には,以下のフィールドがあります.

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

コントローラーアカウントと役割は,対応するボウリアンフラグで有効化されたコントローラ操作のみを実行することが許される.現在の制御パイルロードは許可リスト転送ポリシーではないし,嵌まった `transfers` 規則を含まない.

## APIs に関する質問,イベント {#queries-events-and-apis}

使用 [`FindRwas`](/ja/reference/queries.md#assets-nfts-and-rwas) 登録されたリストへ RWA ライブアップデートが必要なアプリケーションは, [`Rwa` データイベント](/ja/blockchain/filters.md#data-event-filters) 作成,所有者変更,分割,合併,引き換え,凍結,解凍,保持,解放,強制移転,制御変更そしてメタデータイベント.

Torii は,そのルートファミリーが有効である場合, `/v1/rwas` と `/v1/rwas/query` のようなチェーン状態の経路をさらし, `/v1/explorer/rwas` と`/v1/explorer/rwas/{rwa_id}` などの探査者経路をさらにさらす.生成されたクライアントはノードによって暴露される正確な応答形よりも,ライブ [`/openapi`](/ja/reference/torii-endpoints.md#common-endpoints) 文書を好むべきである.

### Taira で試してみてください {#try-it-on-taira}

公開 Taira が現在 RWA 配分を登録しているかどうかを確認する:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

ライブ Taira OpenAPI ドキュメントで暴露されている RWA ルートをリストする.

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

公開物件はまだ登録されていない場合,空き出力 `items` が予想されます.登録,移転,保持,凍結および償還は署名された取引です.

## やってみよう {#try-it}

以下の例では, Python [共有セットアップ](/ja/guide/tutorials/python.md#shared-setup) の SDK 表面を使用します.トランザクションを提出する前に,アカウント IDs,プライベートキー,および生成されたロット IDs を自分のネットワークからの値で置き換えます.

### RWA API 経路を発見する {#discover-rwa-api-routes}

この読み込みのみの例では,実行中の Torii ノードに,アプリ向きの RWA ルートが有効になっていることを要求します.

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

リストが空いている場合,ノードは依然として他の Torii APIs で RWA の指示と查询をサポートするが,選択的な JSON ルートファミリーを暴露していない.

### 倉庫領収書を登録する {#register-a-warehouse-receipt}

ビジネス・アクションが1つの署名されたトランザクションになる場合,草案を使用します.事業領収書の番号は `primary_reference`;取引がコミットした後にレジスタ ID が生成されます.

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

トランザクションのコミット後に,生成されたリスト RWA IDs. 鎖状態の経路は,聖典を暴露する IDs; イベントや探検器の詳細路線を使用します ID 戻る `primary_reference` またはメタデータ:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

エクスプローラーが有効なノードは,より豊かな予測も返せる:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### 暫定 の 留守 を 持っ て 移転 する {#transfer-with-a-temporary-hold}

生成された RWA ID この例では, `alice` 管理者であり,また制御器として構成されている `hold_enabled`.

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

チェーン外プロセスが完了すると,握手を放す.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 制御と監査メタデータを追加する {#add-controls-and-audit-metadata}

コントロールとメタデータは別です. 管理者ポリシーにコントロールを使用し,アプリケーションまたは監査者が表示する必要がある事実にメタデータを使用します:

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

### 償還または退職金量 {#redeem-or-retire-quantity}

代償額は,代表されたチェーン外資産が交付,消費,退役または他の方法で流通から取り除かれた場合である.  lote は `redeem_enabled` でなければならないし,署名者は所有者またはコントローラである必要があります.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 遵守審査中に凍結する {#freeze-during-compliance-review}

鎖外審査で通常の所有者の操作をブロックしなければならない場合,多くを凍結します.署名者はコントローラーであり,lottは `freeze_enabled` を持つ必要があります.

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

審査が終わると解凍します

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

### 請求書 {#invoice-receivable}

請求書を RWA のラットとして表現し,請求書の番号を `primary_reference` と メタデータに保存する.登録後,転送および償還のために生成された ID を使用します.

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

領収が資金調達または支払われる場合,生成された請求書 ID を使用する.

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

チェーン外の決済後に表示された金額を償う:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 炭素クレジット 退職金 {#carbon-credit-retirement}

メタデータでは,オフチェーンの証明書またはレジストリ証明書を指しています:

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

### 二つを融合する {#merge-two-lots}

2つのオフチェーンのポジションが統合されたとき,ロットを合併する.両親は同じ領域にあり,同じ量スペックを使用しなければならない.実行時間は子供ロット ID を生成します.

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

Python 取引の完全な例については, [Real-World Assets](/ja/guide/tutorials/python.md#real-world-assets)を参照してください.

## 関連文書 {#related-docs}

- [資産](/ja/blockchain/assets.md)
- [メタデータ](/ja/blockchain/metadata.md)
- [Iroha 特別指示](/ja/blockchain/instructions.md)
- [問い合わせ](/ja/reference/queries.md#assets-nfts-and-rwas)
- [Torii エンドポイント](/ja/reference/torii-endpoints.md#app-and-sora-route-families)
