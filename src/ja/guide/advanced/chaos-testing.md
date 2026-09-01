---
translation_locale: ja
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: 5ceee448217a42e4f8bbae9595486b79019e7a880dfd0f2c71bf580409d0e4b9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# イザナミによるカオステスト {#chaos-testing-with-izanami}

イザナミは、上流の Iroha ワークスペースにおけるカオスネットオーケストレーターです。使い捨てのローカル Iroha クラスターを起動し、設定可能なワークロードを送信し、選択されたネットワークピアに障害を注入することで、オペレーターは制御された障害下でネットワークが進行し続けるかどうかを確認できます。

事前制作の回復力チェック、回帰再現、およびコンセンサス調整にはIzanamiを使用してください。本番ネットワークを対象にしないでください：このツールは設計されていますネットワークピアの起動時、ネットワークピアの再起動、ストレージの消去、一時的な信頼ピアの分割、ローカル CPU やディスクの圧力などを含め、ネットワークピアを所有すること。

## 前提条件 {#prerequisites}

Izanamiはこのドキュメントリポジトリではなく、[Iroha ソースリポジトリ](https://github.com/hyperledger-iroha/iroha)から実行してください。

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

バイナリは、ネットワーク化されたピアの作成および操作を明示的に許可される必要があります。非 TUI 実行ごとに`--allow-net`を渡すか、TUI で`allow_net`を有効にしてください。

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

対話式実行構成の場合:

```bash
cargo run -p izanami -- --tui --allow-net
```

イザナミは、ユーザー設定ディレクトリの下で TUI および CLI の設定を保持します。最初のリリースファイルには1つの明示的な V1 レイアウトバイトが含まれています。プレリリースまたはその他のバージョン指定のない設定は拒否され、移行するのではなく再作成する必要があります。現在のプロファイルを再利用する前に、表示されている設定を確認してください。

## ベースラインラン {#baseline-run}

深刻な障害を追加する前に、まず再現可能なベースラインから始めてください:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --target-blocks 100 \
  --progress-interval 15s \
  --progress-timeout 120s \
  --latency-p95-threshold 2s \
  --tps 15 \
  --max-inflight 32 \
  --submitters 1 \
  --seed 42
```

この実行は、クラスタが要求されたブロックターゲットに到達し、タイムアウト内で進行を続け、オプションのp95ブロック間隔の閾値を下回る場合にのみ成功します。

コマンド、シード、Iroha プロトコルの最終化、ネットワークピア数、故障ピア数、ワークロードプロファイル、ターゲット TPS、レイテンシ閾値をログとともに記録します。これらの値がなければ、他のオペレーターは同じ故障パターンを再現できません。

## ワークロードプロファイル {#workload-profiles}

イザナミには二つの作業負荷プロファイルがあります：

|プロフィール|それを使用してください|メモ|
| -------- | -------------------------------------------------- | -------------------------------------- |
| `stable` |長時間のソークランと再現可能な性能チェック|実行安全なレシピを好む|
| `chaos`  |失敗パスのカバレッジ|意図的に無効なレシピを含む|

最初に安定したプロファイルを使用してください:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

ベースラインがすでに理解されている場合は、カオスプロファイルに切り替える:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

契約デプロイのレシピは、明示的に許可されない限り、安定版の実行では無効になっています：

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

実行が上流ワークスペースから埋め込まれた SORA Nexus デフォルトを使用するべき場合は、`--nexus` を使用してください。

## 故障制御 {#fault-controls}

`--faulty` がゼロより大きい場合、少なくとも1つの故障シナリオを有効にする必要があります。故障トグルはデフォルトで有効になっており、ブールフラグは `=false` を使用して無効にすることができます。

|故障| CLI フラグ |それが運動するもの|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|クラッシュして再起動| `--fault-enable-crash-restart`             |ネットワークピアプロセスの損失と回復|
|ストレージを消去して再起動| `--fault-enable-wipe-storage`              |ローカル状態の欠落からの回復|
|無効な取引スパム| `--fault-enable-spam-invalid-transactions` |入学および拒否パス|
|ネットワーク遅延| `--fault-enable-network-latency`           |遅いゴシップと遅延した合意メッセージ|
|ネットワーク分割| `--fault-enable-network-partition`         |一時的な信頼ピア隔離|
| CPU ストレス               | `--fault-enable-cpu-stress`                |ローカルでの検証とスケジュールの圧力|
|ディスク飽和| `--fault-enable-disk-saturation`           |ローカルストレージの圧力|

ネットワーク分割のみの実行の場合:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --fault-window-start 60s \
  --fault-window-end 180s \
  --tps 15 \
  --submitters 1 \
  --max-inflight 32 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --seed 42
```

注入された故障の前後で制御された定常状態の期間を維持するために、`--fault-window-start` と `--fault-window-end` を使用します。これにより、起動時のノイズと故障の影響を区別しやすくなります。

## シナリオの形 {#scenario-shapes}

上流のイザナミカタログは、一般的なブロックチェーン通信障害パターンを CLI プロファイルにマッピングします。同じフラグでそれらをモデル化することができます:

|シナリオ|典型的な形|
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|目標負荷| `--faulty 0`、高 `--tps`、1 人の提出者、高 `--max-inflight`|
|一時的な障害|クラッシュ/再起動は、境界のあるフォールトウィンドウ内でのみ有効にする|
|停止と回復|クラッシュ/再起動する大規模な故障ピア群を使用してください|
|リーダーの孤立|ネットワーク分割の障害のみを持つ不良ネットワークピアを正確に1つ使用する; イザナミは Sumeragi リーダーのテレメトリに従う|

一度に一つの変数だけを固定してください。ネットワークピア数、ワークロードプロファイル、障害ウィンドウ、および TPS を同じ実行で変更すると、結果の解釈が難しくなります。

## 何を見るか {#what-to-watch}

実行中に、パフォーマンス検証に使用される同じ信号を監視してください：

- 稼働中のすべてのネットワークピアにおけるブロック高の進行状況
- 提出済み、承認済み、却下済み、タイムアウトした取引
- キューの深さ、キューの飽和、および API エンドポイントのバックプレッシャー
- ビューの変更、リカバリパス、欠落ブロック、および欠落クォーラム証明
- 署名済み RS16 の可用性バックログ、保留中のセッション、および遅延したコンセンサストラフィック
- CPU、ネットワークピアを実行しているホストでのメモリ、ディスク、およびネットワークの飽和

検証レイテンシ分析のために、メインループのデバッグログを有効にします:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

各ブロックは `stateless_ms`、`execution_ms`、および `total_ms` と共に `block validation timings` を出力する必要があります。コンセンサスのタイマーを変更する前に、それらのタイミングを p95 ブロック間隔、ビュー変更カウンター、およびキュー圧力と比較してください。

## 結果の解釈 {#interpreting-results}

すべての選択されたネットワークピアがブロックの確定を続け、バックログが無限に増加せず、構成されたウィンドウが終了した後に障害が新しい回復活動を引き起こさなくなる場合、処理を正常と見なします。

次の場合にランを失敗として扱う:

- ブロックの進行が `--progress-timeout` より長く停止する
- ネットワークのピアの高さが分岐し、再び収束しない
- p95 の遅延が `--latency-p95-threshold` を超えています
- フォルトウィンドウが閉じた後、ランの残りの間、キューは増加する
- 拒否された取引やタイムアウトした取引は、選択したワークロードでは説明されません
- ネットワークピアの再起動、ストレージの消去、またはパーティションの回復には手動でのクリーンアップが必要です

失敗した場合は、同じシードで再実行し、故障の種類を1つ減らします。これにより、作業量とタイミングを再現可能に保ちながら、故障範囲を絞ることができます。

## 関連ページ {#related-pages}

- [パフォーマンスと指標](./metrics.md)
- [ベアメタル上で Iroha を実行する](./running-iroha-on-bare-metal.md)
- [Torii API エンドポイント](../../reference/torii-endpoints.md)
