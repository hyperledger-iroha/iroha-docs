---
translation_locale: ja
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# トリガー {#triggers}

トリガーはイベントフィルターを実行可能なアクションに結び付けます。イベントがトリガーのフィルターに一致すると、Iroha はブロック実行の一部としてトリガーアクションを評価します。

## 構造 {#structure}

登録された`Trigger`には以下が含まれます:

- `id`：`TriggerId`が`Name`をカプセル化している
- `action`：実行可能ファイル、認可主体、フィルター、繰り返しポリシー、リトライポリシー、およびメタデータ

アクションには以下が含まれます:

- `executable`： `Instructions`、`ContractCall`、`Ivm`、または `IvmProved`
- `repeats`： `Indefinitely` または `Exactly(n)`
- `authority`：実行可能ファイルを呼び出すアカウント
- `filter`：1つの`EventFilterBox`
- `retry_policy`：スケジュールされた時間トリガーのオプションの再試行動作
- `metadata`：任意のトリガーのメタデータ

## イベントフィルター {#event-filters}

トリガー条件は、サブスクリプションと同じイベントフィルターモデルを使用します。トップレベルのイベントフィルターは次の条件と一致する場合があります:

- ソフトウェアの処理ワークフローイベント
- データイベント
- 時間ベースのイベント通知
- 実行イベントをトリガーする
- 完了イベントをトリガーする

ワークフローに合った最も狭いフィルターを優先してください。広いフィルターは診断には役立ちますが、ブロックの実行中の作業量を増やします。

現在のフィルターファミリーについては、[フィルター](/ja/blockchain/filters.md) を参照してください。

## 時間トリガー {#time-triggers}

時間トリガーは時間イベントフィルターを使用します。ワールドステートビューが一致する時間条件に達すると、Iroha はトリガー認可プリンシパルの下でトリガーアクションを実行します。時間トリガーは、以下に説明する再試行ポリシーを使用できるトリガーの種類です。

## 繰り返し {#repetition}

`Repeats::Indefinitely` は、登録解除されるまでトリガーをアクティブに保ちます。

`Repeats::Exactly(n)` は、トリガーを固定回数だけ発生させることを可能にします。カウントが使い果たされた場合、同じ動作が再度必要な場合は、新しいトリガーを登録してください。

## 認可主体と権限 {#authority-and-permissions}

トリガー承認のプリンシパルは、実行可能ファイルを呼び出すために使用されるアカウントです。長期間有効なトリガーには専用の技術アカウントを使用し、必要な権限が明確であり、オペレーターの個人アカウントとは分離されるようにしてください。

認可主体は、実行可能な命令または契約の技術的呼び出しに必要な権限を持つ必要があります。トリガーを登録するアカウントも、アクティブなソフトウェアランタイムバリデータの下でトリガーを登録する権限が必要です。

## 再試行ポリシー {#retry-policy}

時間トリガーは、再試行ポリシーにオプトインすることができます。再試行ポリシーでは以下を設定します:

- `max_retries`：最初の発射が失敗した後、何回の再試行が許可されていますか
- `retry_after_ms`：再試行が可能になる前に Iroha がどれくらい待つか

リトライ予算が使い果たされると、トリガーは登録解除されます。

## クエリ {#queries}

現在のトリガークエリを使用してトリガーの状態を確認してください：

- [`FindTriggers`](/ja/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/ja/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/ja/reference/queries.md#triggers-contracts-transactions-and-blocks)

参照：

- [イベントトリガーの例](/ja/blockchain/trigger-examples.md)
- [イベント](/ja/blockchain/events.md)
- [指示](/ja/blockchain/instructions.md)
- [権限](/ja/blockchain/permissions.md)
