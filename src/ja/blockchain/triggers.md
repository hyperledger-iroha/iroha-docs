---
translation_locale: ja
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 触発機 {#triggers}

トリガーはイベントフィルタを実行可能なアクションに結合します. イベントがトリガーのフィルターと一致すると, Iroha はブロック実行の一環としてトリガーの行動を評価します.

## 構造 {#structure}

登録された `Trigger` には:

- `id`: a `TriggerId` 包装する `Name`
- `action`:実行可能,権限,フィルター,繰り返す方針,再試策,メタデータ

行動には以下が含まれます:

- `executable`: `Instructions`,`ContractCall`, `Ivm`,または `IvmProved`
- `repeats`: `Indefinitely`または`Exactly(n)`
- `authority`: 実行可能なものを呼び出すアカウント
- `filter`: a `EventFilterBox`
- `retry_policy`:予定時間触発機のオプション再試行動作
- `metadata`:任意の触発メタデータ

## イベントフィルター {#event-filters}

トリガー条件は,サブスクリプションと同じイベントフィルターモデルを使用します.トップレベルのイベントフィルタは:

- パイプライン事件
- データイベント
- 時間の出来事
- 実行イベントを誘発する
- 引き起こす完了イベント

ワークフローに一致する最も狭いフィルターを好みます. 広いフィルターは診断のために有用ですが,ブロック実行中に作業を増やします.

[フィルター](/ja/blockchain/filters.md)については,現在のフィルタファミリーを参照.

## 時間 の 引き起こす {#time-triggers}

タイムトリガーは時間イベントフィルタを使用します.世界状態ビューが一致する時間条件に達すると, Iroha はトリガー権限の下でのトリガーアクションを実行します.時間トリガーは以下のリトライポリシーを使用できるトリガータイプです.

## 繰り返す {#repetition}

`Repeats::Indefinitely` は,登録されていないまで触発機を活性化させます.

`Repeats::Exactly(n)` は,トリガーが固定された数回発射することを可能にします. カウントが尽きると,同じ動作を再び必要とする場合は新しいトリガーを登録してください.

## 権限と許可 {#authority-and-permissions}

触発権限は実行可能なものを呼び出すために使用されるアカウントです.長持ちの触発器のために専用技術的なアカウントを使用します そのため必要な許可は,操作者の個人アカウントから明示的に分離されます.

当局は実行可能な指示または契約呼び出しで要求される許可を必要とします.トリガーを登録するアカウントはまた,アクティブランタイム検証器の下でトリガーを登録するための許可が必要です.

## 復試方針 {#retry-policy}

タイムトリガーは再試のポリシーに選択できます. 再試の方針は:

- `max_retries`:最初の失敗した発射後,再試行が許容される数
- `retry_after_ms`: いつまで Iroha 再試される前に待機する

再び試す予算が尽きると トイガーが登録されない.

## 質問 {#queries}

現在のトリガークエリを使用してトリガー状態を確認します:

- [`FindTriggers`](/ja/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/ja/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/ja/reference/queries.md#triggers-contracts-transactions-and-blocks)

参照:

- [事件トリガー例](/ja/blockchain/trigger-examples.md)
- [事件](/ja/blockchain/events.md)
- [指示](/ja/blockchain/instructions.md)
- [許可](/ja/blockchain/permissions.md)
