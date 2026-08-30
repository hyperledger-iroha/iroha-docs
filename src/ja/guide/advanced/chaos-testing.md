---
translation_locale: ja
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: 5ceee448217a42e4f8bbae9595486b79019e7a880dfd0f2c71bf580409d0e4b9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# イザナミと混沌のテスト {#chaos-testing-with-izanami}

Izanami は,上流 Iroha ワークスペースの混沌ネットオーケストラです. これは使い捨てローカル Iroha クスターを起動し,構成可能な作業負荷を提出し,選択したピースにエラーを注入しますので,オペレーターは制御された故障下でネットワークが継続的に進歩しているかどうかを確認できます.

Izanami を使用して,生産前耐性チェック,レグレーション再現,コンセンサスの調節を行います.それを生産ネットワークに指さないでください:このツールはピアリスタート,ストレージ wipes,一時的な信頼性の高いピアパーティション,およびローカル CPU またはディスク圧力を含む起動するピークを所有するように設計されています.

## 必須条件 {#prerequisites}

[Iroha ソースレポジトリ](https://github.com/hyperledger-iroha/iroha)から Izanami を実行する.

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

バイナリはネットワーク上のペアを作成し操作することを明示的に許可する必要があります. TUI 以外のすべての実行で `--allow-net` をパスするか, TUI で `allow_net` を有効にします.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

インタラクティブな実行構成:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami は,ユーザー設定ディレクトリの下にある TUI と CLI の設定を保持します.最初のリリースファイルには明示的な V1 レイアウトバイトがあります.プリリリースのまたはその他の未バージョンの設定は拒絶され,移行するのではなく再作成されるべきです.現在のプロフィールを再利用する前に表示された設定を確認します.

## ベースライン実行 {#baseline-run}

重度の欠陥を追加する前に,再現可能な1つのベースラインから始めましょう.

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

この実行は,クラスターが要求されたブロック目標に到達し,タイムアウト内に進捗を続け,オプションの p95 ブロック間隔の限界を下回る場合にのみ成功します.

コマンド,シード, Iroha コミット,ペアカウント,デフォルト・ペアのカウント,ワークロードプロファイル,ターゲット TPS,および遅延値をログで記録する.これらの値はなければ,他のオペレーターは同じ故障パターンを再生することはできません.

## 作業負荷プロフィール {#workload-profiles}

Izanamiには2つの作業量プロファイルがあります:

|プロフィール |使うよ|記号|
| -------- | -------------------------------------------------- | -------------------------------------- |
|`stable`|長期の浸泡走行と再現可能なパフォーマンスチェック|実行安全なレシピを好む|
|`chaos`|失敗経路のカバー|意図的に無効なレシピが含まれます|

安定したプロフィールを最初に使用します

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

ベースラインが既に理解されたときに混沌のプロフィールに切り替える.

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

契約部署のレシピは,明示的に許されない限り,安定した実行で無効化されます.

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

`--nexus` を実行する際に,上流作業空間から埋め込まれた SORA Nexus デフォルトを使用します.

## 欠陥制御 {#fault-controls}

`--faulty`がゼロより大きい場合は,少なくとも1つのエラーシナリオを有効にする必要があります.エラーはデフォルトで有効に切り替えられ,ボウリアンフラグは `=false` で無効化することができます.

|間違い|CLI 旗|運動していること|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|クラッシュと再起動|`--fault-enable-crash-restart`|ピアプロセスの損失と回復|
|ストレージを拭き,再起動する|`--fault-enable-wipe-storage`|失踪した地域から回復する|
|不正なトランザクションスパム|`--fault-enable-spam-invalid-transactions`|受け入れと拒否の経路|
|ネットワーク遅延|`--fault-enable-network-latency`|遅い噂と合意のメッセージ|
|ネットワークパーティション|`--fault-enable-network-partition`|信頼される仲間との一時的な隔離|
|CPU ストレス|`--fault-enable-cpu-stress`|ローカル検証とスケジュールプレッシャー |
|ディスクの飽和度|`--fault-enable-disk-saturation`|ローカルストレージ圧力|

ネットワークパーティションのみの実行:

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

`--fault-window-start` と `--fault-window-end` を使用して,注射された故障の前におよび後に制御した静止状態を保持します. これにより,起動騒音と故障の影響を区別することが容易になります.

## シナリオの形 {#scenario-shapes}

アウトストリーム Izanami カタログは CLI プロフィールに一般的なブロックチェーン通信障害形状をマップします.同じフラグでモデル化できます:

|シナリオ|典型的な形状|
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|標的型負荷|`--faulty 0`,高い `--tps`,1人の提出者,高い `--max-inflight` |
|暫定故障|クラッシュ/再起動を制限された故障ウィンドウ内でのみ有効にする|
|停止と回復|クラッシュ/再起動で大きな欠陥ペア集団を使用します |
|リーダーを孤立させる|ネットワークパーティションの故障のみで正確に1つの欠陥ペアを使用します. Izanami は Sumeragi のリーダーテレメトリに従います.|

同じ実行で同級数,作業負荷プロファイル,エラーウィンドウ,および TPS を変更した場合,結果を解釈することは困難です.

## 見るべきもの {#what-to-watch}

走行中に,性能検証に使用された同じ信号を注意してください.

- 走っているすべてのピアでブロックの高さの進歩
- 提出された,受け入れられた,拒否された,期限切れの取引
- 排列深さ,排列飽和度,エンドポイントのバックプレッシャー
- 閲覧変更,復元経路,欠落ブロック,および欠落するクオラム証明書
- 署名された RS16 の可用性バックログ,待機中のセッション,および合意トラフィック遅延
- CPU,メモリ,ディスク,同級端を実行しているホスト上のネットワークの飽和性

認証遅延分析のために,メインループデバッグログを有効にしてください.

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

各ブロックは `block validation timings` と `stateless_ms`, `execution_ms`,および `total_ms` を発射する.合意タイムを変更する前に,それらのタイミングをp95ブロック間隔,ビュー変化カウンター,並列圧と比較してください.

## 解釈結果 {#interpreting-results}

すべての選択されたピースがブロックをコミットし続け,バックログは制限なく成長せず,設定したウィンドウが終了した後,故障が新しい復元活動を引き起こすのを止めると実行を健康的に処理します.

実行を失敗とみなす:

- `--progress-timeout`より長いブロック進捗ステンド
- 同級の高さは異動し,再融合しない.
- p95 遅延度は `--latency-p95-threshold` を上回る
- 欠陥ウィンドウが閉じた後,ランの残りの時間には排列が増える.
- 拒否された取引は,選択した作業量によって説明されない.
- パイアリセット,ストレージ拭き,またはパーティション復元は手動の掃除を必要とする.

失敗後,同じ種子と欠陥タイプを 1 つ減らして再起動します. これにより,作業負荷とタイミングが再現可能になり,故障の表面は狭くなります.

## 関連ページ {#related-pages}

- [性能とメトリック](./metrics.md)
- [走る Iroha 純金属について](./running-iroha-on-bare-metal.md)
- [Torii エンドポイント](../../reference/torii-endpoints.md)
