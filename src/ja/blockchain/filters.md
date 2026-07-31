---
translation_locale: ja
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# フィルター {#filters}

狭いイベントストリームとトリガー条件をフィルターします.現在のトップレベルのイベントフィルターは `EventFilterBox` で,これらのイベントファミリーに一致できます:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

`DataEventFilter::Any` のような広いフィルターは診断に役立つが,すべてのイベントはトリガーまたはサブスクリプションのマッチング費用を支払うようにします.

## データのイベントフィルター {#data-event-filters}

`DataEventFilter`は,本簿データイベントと一致する.現在のバリエーションには以下が含まれます:

|変数|イベントファミリー|
| --- | --- |
|`Any`|すべてのデータイベント|
|`Peer`|同僚のライフサイクルイベント|
|`Domain`|ドメインライフサイクルとメタデータイベント |
|`Account`|アカウントライフサイクル,メタデータ,アライアス,アイデンティティイベント |
|`Asset`|資産のバランスとメタデータイベント|
|`AssetDefinition`|資産定義ライフサイクル,ポリシー,メタデータイベント |
|`Nft`|NFT ライフサイクルとメタデータ事件|
|`Rwa`|リアル・ワールド アセットライフサイクル イベント|
|`Trigger`|トリガーライフサイクルとメタデータイベント |
|`Role`|役割ライフサイクルイベント|
|`Configuration`|チェーン上の設定イベント|
|`Executor`|実行時間執行器 イベント|
|`Proof`|証拠検証ライフサイクルイベント|
|`Confidential`|機密資産イベント|
|`VerifyingKey`|チェックキーレジストイベント|
|`RuntimeUpgrade`|実行時間のアップグレードイベント|
|`Soradns`|ディレクトリガバナンスイベントを解決する|
|`Sorafs`|SoraFS ゲートウェイのコンプライアンスイベント|
|`SpaceDirectory`|スペースディレクトリ 生命周期イベントを明示する|
|`Escrow`|透明性のあるネイティブ・アセットエスクローライフサイクルイベント|
|`Offline`|オフラインの決済イベント|
|`Oracle`|オラクルのフィードイベント |
|`Social`|ウイルス的なインセンティブイベント|
|`Bridge`|橋のイベント|
|`Governance`|管理機能が有効になった場合のガバナンスイベント |

混凝土フィルターもオプションで ID 例えば,アセットフィルタは1つの資産または1種類の資産イベントに一致する可能性があります.引き金を引くフィルターが引き金を引ける ID 引き金を引くイベントセットです

## パイプラインフィルター {#pipeline-filters}

パイプラインフィルタは,ブロック,トランザクション,マージング,目撃事件などの処理イベントに対応します.運用サブスクリプション,ブロック処理ダッシュボード,およびレジャーデータオブジェクトではなくパイプライン状態に反応するトリガーに使用します.

## トリガーフィルター {#trigger-filters}

トイガーは,その状態を `EventFilterBox` として保存する. トイガーアクションは,また:

- 実行可能
- 繰り返す政策
- 機関口座
- 任意のタイムトリガー再試行方針
- メタデータ

トリガー権限は実行可能で要求される許可を持つ必要があります. 長寿命のトリガーのために専用の技術的なアカウントを好みます.

## 問い合わせフィルター {#query-filters}

查询フィルタはイベントフィルターから分離されます.Iterableクエリでは,プレディケートとセレクターのサポートを露出できます. SDK からの查询特有のタイプされたフィルターを使用して,フィルター入力が查询出力型に一致します.

参照:

- [事件](/ja/blockchain/events.md)
- [Native Asset Escrow ](/ja/blockchain/escrow.md#queries-and-events)
- [触発機](/ja/blockchain/triggers.md)
- [問い合わせ](/ja/blockchain/queries.md)
- [問い合わせの参照](/ja/reference/queries.md)
