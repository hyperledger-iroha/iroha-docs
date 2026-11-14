---
translation_locale: ja
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ は、選択された実行効果に対する Iroha の STARK 証明パスです。これは通常のトランザクション実行やコンセンサスを置き換えるものではありません。トランザクションは依然として通常どおり ISI、IVM、および Sumeragi を実行してください；FastPQ は決定論的実行証人を消費し、サポートされている効果を証明バッチに変換します。

現在のホスト統合には、主に2つの方法があります：

- ブロック実行中に記録された透明な数値資産の移転
- `fastpq_binding` に FastPQ バインディングを含む、SORA Nexus の AXT 証明エンベロープ

## 証人移送経路 {#transfer-witness-path}

透過的な数値の転送は、指示が残高を変動させるときに構造化された転送記録を作成します。この記録には以下が記録されます:

- 送金元アカウント、送金先アカウント、資産の定義、そして金額
- 送信者と受信者の残高、送金前と送金後
- バッチ暗号ハッシュとして使用されるトランザクションエントリーポイント暗号ハッシュ
- 提出するアカウントから派生した認可プリンシパルの暗号学的ダイジェスト値
- 単一デルタ転写のためのポセイドン暗号ダイジェスト値

バッチ転送は、複数のデルタを含む1つのトランスクリプトを使用します。その場合、単一デルタのPoseidon暗号ダイジェスト値は存在しません。

ブロックの確定時に、Iroha はこれらのトランスクリプトをエントリポイントの暗号ハッシュごとにグループ化します。その後、実行の証人は、元のトランスクリプトバンドルと、証明者用に準備された FastPQ トランジションバッチの両方を保持します。

各転送デルタは2つの遷移行になります:

|行|鍵の形|事前設定値| ポストバリュー |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|送信者デビット| `asset/<asset-definition>/<source-account>`      |送信者の残高（前）|送信者の残高あと|
|受取人の信用| `asset/<asset-definition>/<destination-account>` |受信者の残高前|受信者の残高後|

数値は整数の証人単位に正規化されます。選択された小数スケールで非負の `u64` として表現できない場合、FastPQ バッチ処理のためにその値は拒否されます。

## 公開入力 {#public-inputs}

すべての FastPQ トランジションバッチには、証明をブロックおよび実行コンテキストに結びつける公開入力が含まれています:

|入力|意味|
| ------------- | --------------------------------------------------------------- |
| `dsid` | リトルエンディアンのバイト列で符号化したデータスペース識別子 |
| `slot`        |ブロック作成時間をナノ秒に変換|
| `old_root`    |実行証明から派生した親状態ルート|
| `new_root`    |実行証明から導出された後状態ルート|
| `perm_root`   |アクティブな役割の権限に対するポセイドン暗号コミットメント値|
| `tx_set_hash` |ソートされたトランザクションおよび時間トリガーエントリーポイントの暗号ハッシュに対する暗号ハッシュ|

ホストは、これらのバッチに、最初のリリースで唯一のパラメータセットである `fastpq-state-transition-stark-v1` を使用します。

## 証明プロトコル {#proof-protocol}

正規の転送アーティファクトは、次数 4 の拡大を持つ Goldilocks 体上のマスク付き DEEP 証明です。その厳密な関係、トランスクリプト、クエリの幾何構成は、固定版の [FastPQ DEEP プロトコル契約](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md) で定義されています。

## 証明者が確認するもの {#what-the-prover-checks}

トレースを構築する前に、FastPQ プルーファーはバッチ順序を遷移キー、操作ランク、および挿入順で正規化します。転送行もトランスクリプトのメタデータを必要とします。転送行はあるが転送トランスクリプトがないバッチは無効です。

単位移行の成績証明書について、証明側の確認項目は以下の通りです:

- 送信者の残高はアンダーフローしてはいけません
- `sender_after` は `sender_before - amount` と等しくなければなりません
- `receiver_after` は `receiver_before + amount` と等しくなければなりません
- トランスクリプトは、バッチ内のすべての転送行を網羅する必要があります
- 単一デルタのポセイドン暗号ダイジェスト値が存在する場合、それは記録のプレイメージと一致しなければなりません
- 提供されたスパースメルクル証明はバージョン1としてデコードされなければならない；欠落しているパスは決定論的な合成証明で補完される

トレースには、転送、発行、破棄、役割付与、役割剥奪、メタデータ設定、権限検索行のためのセレクタ列が含まれています。数値操作行も符号付きデルタ、資産ごとの累積デルタ、および供給カウンターを持っています。

## プロバー実行レーン {#prover-lane}

`iroha3d` は、証明バックエンドを初期化できる場合、起動時に FastPQ 証明者実行レーンを開始します。実行レーンは、上限付きキューを持つバックグラウンドタスクです。ブロックが実行ウィットネスを生成した後、コンセンサスの確定経路は、ブロックの暗号ハッシュ、高さ、ビュー、およびウィットネスを含むプロバージョブを提出します。

実行レーンが稼働していない場合やキューが満杯の場合、ジョブはスキップされ、通常のブロック処理が続行されます。これは、バックグラウンドのプルーフ実行レーンがトランザクションの受け入れやコンセンサスゲートではないことを意味します。それは、すでに実行された状態に対するプルーフ生成パスです。

実行レーンは次の要素でプルーフ作成者を構築します:

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

両方の設定はデフォルトで`cpu`になっています。`gpu`を選択することは明示的なフェイルクローズ要求です: もし GPU のサポートがコンパイルされていない場合、または要求された GPU バックエンドがプリフライトに失敗すると、証明者の実行レーンは無効のままになります。最初のリリースには `auto` の値がなく、要求された GPU モードから CPU にフォールバックしません。

## 確認 {#verification}

FastPQ 証明検証は、標準的なバッチ暗号コミットメント値を再構築し、公開トランスクリプトを再生します。検証者はプロトコルのバージョンを確認します。パラメータセットのバージョン、リプレイ制限、暗号化コミットメント値の追跡、公開入力、サンプリングされたメルクルオープニング、AIR オープニング、および FRI クエリチェーン。

デフォルトのリプレイ制限には以下が含まれます:

|制限|デフォルト|
| ------------------ | ------: |
|遷移行|     256 |
|バッチペイロードサイズ|256 KiB|
| FRI レイヤー|      16 |
|求人情報の照会|     128 |

## SORA Nexus の AXT 証明エンベロープ {#sora-nexus-axt-proof-envelopes}

SORA Nexus の AXT 証明エンベロープには `AxtFastpqBinding` を埋め込めます。AXT エンベロープのブロック検証、IVM ホストによる AXT エンベロープのチェック、および `RegisterVerifiedFeeSponsorVaultAllocation` は、エンベロープの `fastpq_binding` を必須とし、それを期待されるクレームと照合したうえで、エンベロープとそこに埋め込まれた証明に対して FastPQ 検証器を呼び出します。バインディングが欠けている場合や検証に失敗した場合、その操作は拒否されます。

### AXT バインディング数学 {#axt-binding-math}

SORA Nexus の AXT エンベロープでは、証明のリプレイ前に `AxtFastpqBinding` を正規化します。`parameter`、`verifier_id`、`verifier_version` の値が空の場合は拒否されます。検証器 ID は `fastpq`、バージョンは `v1` でなければならず、保守対象の AXT フローは `fastpq-state-transition-stark-v1` を使用します。クレーム種別は前後の空白を除去し、小文字に変換します。

AXT FastPQ の公開入力は決定論的なバイト暗号ハッシュです：

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

AXT トランジションキーは次の通りです:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` クレームはロール付与の行を挿入します:

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

さらに、認可ポリシーを結び付けるメタデータ行を含みます。`compliance` クレームでは、ポリシー用と対象データスペース用の二つのメタデータ行を挿入します。

〜のために `tx_predicate` そして `value_conservation`, 結合に正のソースが含まれている場合、明示的な効果量が使用されます 宛先の金額。そうでなければ、コードは制限付きの決定的な金額を導き出します:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

次に、同じ伝達方程式が使用されます：

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

合成送信者および受信者アカウントIDは、キーシードから生成されます：

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

転送バッチの暗号ハッシュは次の通りです:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT バッチ技術マニフェストの暗号ダイジェスト値は、標準結合の Norito エンコーディング上で SHA-256 です。

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## パラメータセット {#parameter-sets}

最初のリリースには、正規のパラメータセットがちょうど 1 つ、`fastpq-state-transition-stark-v1` だけあります。これは、次数 4 の拡大（`X^4 - 7`）を持つ Goldilocks 体上で 128 ビットのセキュリティを目標とし、トレースサイズ `2^16`、LDE サイズ `2^19`、FRI のアリティ 2、ブローアップ係数 8、最大 17 回のリダクション、136 個のクエリを使用します。

## 構成 {#configuration}

FastPQ の設定は `zk.fastpq` の下にネストされています。

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false
```

同じ実行およびテレメトリラベルは、`iroha3d` から上書きすることができます。

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

環境変数は、構成フィールドでもサポートされています。FastPQ 固有の変数には以下が含まれます:

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`

## 指標 {#metrics}

テレメトリが有効な場合、FastPQ はバックエンドの選択と Metal ランタイムの動作に関するメトリクスをエクスポートします。

|メートリック|意味|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |バックエンドおよびデバイスラベルによって要求および解決された実行モード|
| `fastpq_poseidon_pipeline_total` |要求され、解決されたポセイドンソフトウェア処理ワークフローパス|
| `fastpq_metal_queue_depth`        |メタルキューの制限、最大インフライト数、ディスパッチカウント、サンプリングウィンドウ|
| `fastpq_metal_queue_ratio`        |メタルキューのビジーおよびオーバーラップ比率|
| `fastpq_zero_fill_duration_ms`    |Metal の実行におけるホストのゼロフィル期間|
| `fastpq_zero_fill_bandwidth_gbps` |導出ゼロフィルバンド幅|

一般的なパフォーマンスのトリアージには、[パフォーマンスと指標](/ja/guide/advanced/metrics.md) に記載されているコンセンサスおよびキューの信号と一緒にこれらを使用してください。

## 関連参考 {#related-reference}

- [データモデルスキーマ](/ja/reference/data-model-schema.md) ノード権威型データスナップショット用
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ オプション](/ja/reference/iroha3d-cli.md#fastpq-overrides)
