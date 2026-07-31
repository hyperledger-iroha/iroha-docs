---
translation_locale: ja
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 出来事 {#events}

イベントはブロックチェーンの内部で特定のことが起こるとき,例えば新しいアカウントが作成され,ブロックがコミットされるときに送信されます.様々な種類のイベントがあります:

- パイプライン事件
- データイベント
- 時間の出来事
- 実行イベントを誘発する

## パイプライン事件 {#pipeline-events}

パイプラインイベントは,取引がブロックに提出,実行またはコミットされたときに送信されます.パイプラインイベントには以下の情報が含まれます:事件 (トランザクションまたはブロック) を引き起こしたエンティティの種類,そのハッシュおよび状態.ステータスは `Validating` (有効化進行中), `Rejected`,または `Committed`である可能性があります.

### Taira で試してみてください {#try-it-on-taira}

公開パイプラインイベントストリームが設置されていることを確認する:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

ストリームを開けずに確認できるインスタントショットについては 最近の Explorer トランザクションをご覧ください.

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

ターミナルで SSE ルートを開いて,ライブイベントが必要な場合:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

流れが開いている間に取引が提出されない場合,路線が健全であるにもかかわらず命令は静かになることができます.

## データ イベント {#data-events}

データ イベントは,ペア,ドメイン,アカウント,資産,資産定義, NFTs,トリガー,ロール,オンチェーン構成,実行状態,証明,機密資産,ブリッジ,または SORA/Nexus-特定のオブジェクトなどのレジャーデータに関連した変更があるとき発行されます.[データイベントフィルター](./filters.md#data-event-filters)ではこれらのタイプのイベントが使用されます.

## 時間 の 出来事 {#time-events}

時事イベントは,世界状態の視界が [時間のトリガー](./triggers.md#time-triggers)を扱う準備ができるときに発射されます.

## トリガー実行イベント {#trigger-execution-events}

トリガー実行イベントは, [`ExecuteTrigger`](./instructions.md#executetrigger)指示が実行されたときに送信されます.トリガー完了イベントは,トリガーアクションが終了した後で送信されます.
