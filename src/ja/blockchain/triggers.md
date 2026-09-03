---
translation_locale: ja
translation_source: /blockchain/triggers.md
translation_source_hash: 726e2998ec1439138ef94d3a702049731ce2432f5c52a723ed0c92593de41c1e
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

### データトリガーの範囲と容量 {#data-trigger-scope-and-capacity}

通常のデータトリガーが,そのフィルターを触発当局所有する特定の対象に結びつける必要があります.アカウントフィルターは,その正確な口座を指定する必要があります.資産,資産定義,ドメイン, NFT, RWA,`Any`,無関係マッチャー,外国語主体,システムまたはガバナンスイベントファミリーは通常のアカウントスコープされたトリガーではありません.

`CanRegisterGlobalDataTrigger`は議会のみが与えることができる. 補助金は1つの正確なアカウントに直接保存され,同じ正確なトリガー権限を指定し,その経由で取り消すことができる同じ議会のライフサイクル. 役割によって継承されず,別の機関に触発符を登録するアカウントで `CanRegisterTrigger` を放棄しない.

コンセンサスでは,ある権威に対して最大64のデータトリガーと世界中で4,096のデータトリガーを認めています.正確な対象とイベントファミリーインデックスは,定例識別順で候補者を選択します.1 つの発端トランザクションは,カスケードを含む最大 256 個のデータトリガー発射を引き起こす可能性があります.すべてのインデックスされたフィルターチェック,発射,ネイティブ指示,および VM 命令は同じブロックガス予算を消費します.

トリガー実行は,マッチングイベントを発射したトランザクションで原子的である.許可されたトリガーが失敗した場合,発射または実行深度制限を超えた場合,またはガスを排出すると, Iroha はトリガー効果と発生するトランザクションの両方を後回します.

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
