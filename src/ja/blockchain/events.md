---
translation_locale: ja
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# イベント {#events}

型付きイベント通知は、ブロックチェーン内で特定のことが起こったときに発行されます。例えば、新しいアカウントが作成されたときやブロックが確定されたときなどです。イベントにはさまざまな種類があります。

- ソフトウェアの処理ワークフローイベント
- データイベント
- 時間ベースのイベント通知
- 実行イベントをトリガーする

## ソフトウェア処理ワークフローイベント {#pipeline-events}

ソフトウェア処理ワークフローイベントは、トランザクションがブロック内で送信、実行、または確定されたときに発行されます。ソフトウェア処理ワークフローイベントには、イベントを引き起こしたエンティティの種類（トランザクションまたはブロック）、その暗号化ハッシュ、およびステータスが含まれます。ステータスは、`Validating`（検証中）、`Rejected`、または`Committed`のいずれかです。エンティティが拒否された場合、拒否の理由が提供されます。

### Taira でこのワークフローを実行してください {#try-it-on-taira}

パブリックソフトウェア処理ワークフローのイベントストリームがマウントされていることを確認してください:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

ストリームを開いたままにせずに確認できるデータスナップショットについては、最近のエクスプローラーのトランザクションを読み取ってください:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

ライブイベントが必要なときは、ターミナルで SSE ルートを開いてください:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

ストリームが開いている間にトランザクションが送信されない場合でも、ルートが正常であれば、コマンドは静かなままでいられます。

## データイベント {#data-events}

データイベントは、ネットワークピア、ドメイン、アカウント、資産、資産定義、NFTs、トリガーなど、ブロックチェーン台帳データに関連する変更があったときに発生します。役割、オンチェーンの設定、実行者の状態、証明、機密資産、ブリッジ、または SORA/Nexus 固有のオブジェクト。これらの種類のイベントは[データイベントフィルター](./filters.md#data-event-filters)で使用されます。

## 時間ベースのイベント通知 {#time-events}

時間ベースのイベント通知は、ワールドステートビューが [時間トリガー](./triggers.md#time-triggers) を処理する準備ができたときに発行されます。

## トリガー実行イベント {#trigger-execution-events}

トリガー実行イベントは、～の時に発生します [`ExecuteTrigger`](./instructions.md#executetrigger) 指示は実行されます。トリガー完了イベントは、トリガーアクションが終了した後に発行されます。
