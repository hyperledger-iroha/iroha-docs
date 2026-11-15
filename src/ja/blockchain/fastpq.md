---
translation_locale: ja
translation_source: /blockchain/fastpq.md
translation_source_hash: 98c258ab99bcc7d7d51b69ddd26e39b19ef4eb14d53001825f3737144d68f0e5
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ は、選択された実行効果に対する Iroha の STARK 証明パスです。通常のトランザクション実行やコンセンサスを置き換えるものではありません。トランザクションはこれまでどおり ISI、IVM、Sumeragi を通じて実行され、FastPQ はその後、ブロック実行が記録したソースレコードに基づいて、サポート対象の効果を証明します。

現在のホスト統合には、主に2つの方法があります：

- ノードのプロバー実行レーンが証明する、最終化されたブロックの数値資産効果
- `fastpq_binding` に FastPQ バインディングを含む、SORA Nexus の AXT 証明エンベロープ

## 転送ウィットネスパス {#transfer-witness-path}

透明な数値転送は、命令が残高を変更するときに、構造化された転送トランスクリプトを作成します。トランスクリプトには次の内容が記録されます：

- 送金元アカウント、送金先アカウント、資産の定義、そして金額
- 送信者と受信者の残高、送金前と送金後
- バッチ暗号ハッシュとして使用されるトランザクションエントリーポイント暗号ハッシュ
- 提出するアカウントから派生した認可プリンシパルの暗号学的ダイジェスト値
- 単一デルタのトランスクリプトに対する Poseidon ダイジェスト
- 送信者と受信者の残高に対するスパースメルクル更新ウィットネス

バッチ転送は、複数のデルタを含む1つのトランスクリプトを使用します。その場合、単一デルタのPoseidon暗号ダイジェスト値は存在しません。

ブロック実行は、トランスクリプトをそれを出力した実行呼び出しごとにグループ化し、ブロックの FastPQ ソースレコードとともに保持します。AXT 転送ステートメントでは、各転送デルタが 2 つの遷移行になります：

| 行 | キー | 更新前の値 | 更新後の値 |
| --------------- | --------------------------------------------------------------------- | ----------------------- | ---------------------- |
| 送信者の借方 | 資産定義と送信元アカウントに対する `FastpqBalanceKeyV1` | 送信者の変更前残高 | 送信者の変更後残高 |
| 受信者の貸方 | 資産定義と送信先アカウントに対する `FastpqBalanceKeyV1` | 受信者の変更前残高 | 受信者の変更後残高 |

各キーは `FastpqBalanceKeyV1` の正規 Norito フレームであり、`transfer_balance_key` が型付きの資産定義とドメインなしのアカウントから構築します。アカウントエイリアスや表示形式がキーの素材になることはありません。

## 実行効果 {#execution-effects}

プロバー実行レーンは、完全な実行効果ステートメントを証明します。各ステートメントは、1 つの実行エントリのすべての数量効果を実行順にカバーします：

| 効果 | 更新される値 | 規則 |
| -------- | ------------------------------ | ------------------------------------------------------------------- |
| 転送 | 送信元と送信先の残高 | 1 つの資産の 2 つの残高の間で金額が移動する |
| 発行 | 残高と供給量 | 両方が同じ非ゼロの量だけ増加する |
| 焼却 | 残高と供給量 | 両方が同じ量だけ減少する |
| 廃止 | 供給量とライフサイクル | 供給量はゼロのままで、資産の存在値が 1 から 0 に変わる |

供給量が残高を下回ることはありません。各キーは、ドメイン分離タグ `iroha:fastpq:execution-quantity-key:v1`、NUL バイト、および `FastpqExecutionQuantityKeyV1` の残高キー、供給量キー、またはライフサイクルキーの Norito エンコーディングで構成されます。ロールの付与、ロールの取り消し、その他の操作は証明されません。

実行効果ステートメントと AXT 転送ステートメントの値は、資産の小数スケールにおける厳密な非負整数単位（`FastpqQuantityUnits`）であるため、`u64` に制限されません。ステートメントの構築では、スケールの不一致、負の差分、および算術上または順序上のあらゆる不整合を拒否し、公開値を修復することは決してありません。

## 公開入力 {#public-inputs}

すべての FastPQ ステートメントには、証明をブロックと実行コンテキストに結び付ける公開入力が含まれます：

|入力|意味|
| ------------- | ------------------------------------------------------------------------------------ |
| `dsid` | データスペース識別子：その `u64` 値をリトルエンディアン順で並べ、続けて 8 個のゼロバイト |
| `slot` | ブロック作成時刻（ナノ秒単位、ミリ秒精度） |
| `old_root` | 操作対象キーのスパースメルクル木における、ステートメント適用前のルート |
| `new_root` | 操作対象キーのスパースメルクル木における、ステートメント適用後のルート |
| `perm_root` | 実行中の状態におけるロール権限テーブルへのコミットメント |
| `tx_set_hash` | ブロック内トランザクションのワイヤ形式をブロック順に並べたものへのコミットメント |

`old_root` と `new_root` は、ステートメントが操作するキーのみを対象とします。これらは永続化されたワールドステートのルートではありません。

`perm_root` は、ドメイン分離タグ `fastpq:v1:permission-table:blake2b-256`、リトルエンディアンの `u64` で表したエントリ数、およびソート済みのエントリを入力とする、Iroha の 32 バイトの `Hash` です。各エントリは、ロール ID のハッシュ、そのロールが持つ権限の 1 つのハッシュ、およびその権限のエポックをリトルエンディアンの `u64` で表したもので構成されます。テーブルが空の場合、コミットメントは 32 個のゼロバイトになります。これはロールと権限のコンテキストにすぎず、アカウントのメンバーシップや認可を証明するものではありません。

`tx_set_hash` は、ドメイン分離タグ `iroha:axt:ordered-transaction-wire-set:v1`、NUL バイト、トランザクション数、およびブロック順に並べた各トランザクションのワイヤ長と完全なワイヤバイト列を入力とする、Iroha の `Hash` です。トランザクション数と各長さはリトルエンディアンの `u64` 値です。トランザクションはソートも重複排除もされず、署名はプリイメージに含まれたままです。

Iroha の `Hash` は、最終バイトの最下位ビットを 1 に設定した Blake2b-256 です。ステートメントには、順序付けハッシュと、完全な正規行およびソース事実も含まれ、証明はこれらすべてを結び付けます。

## 証明プロトコル {#proof-protocol}

正規の FastPQ アーティファクトは、次数 4 の拡大を持つ Goldilocks 体上のマスク付き DEEP 証明です。その厳密な関係、トランスクリプト、クエリの幾何構成は、固定版の [FastPQ DEEP プロトコル契約](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md) で定義されています。

呼び出し側が選択するのは、通常ステートメントか AXT ステートメントか、およびリソース制限です。回路、検証鍵、クエリ数、トランスクリプトの内部構造は選択しません。通常ルートは `offline_compact::prove_quantity_ordinary_artifact` で、AXT ルートは `offline_compact::prove_quantity_axt_artifact` です。後者は、バインド済みバッチ向けに `prove_axt_bound_batch` がラップしています。透明な `Prover`、`Proof`、およびリプレイ用 `verify` の API は、テストと `dev-tools` ビルドにのみ存在します。

## 証明が検証する内容 {#what-the-proof-checks}

非公開の処理を行う前に、プロデューサーは公開ステートメントを準備します。アカウント、金額、値、出現回数、安定したキー順序、キー割り当てを確認し、公開事実が食い違うステートメントは拒否します。その後、封印された関係が、セグメントごとに 1 つの効果または転送の出現について、2 つの完全な 32 レベルのスパースメルクル更新を証明します。デフォルトの制限では、1 つのアーティファクトあたり最大 2 セグメントまで許可されます。

各トレースは 65,536 行です。プロデューサーは 301 個の非公開列をコミットし、検証器は 41 個の公開列を独自に再構築します。新たな暗号学的エントロピーによって、トレース列、商多項式、および独立にコミットされた合成多項式がマスクされます。商の除算は割り切れなければなりません。プロデューサーは、アーティファクトを返す前に自らそれを検証します。

公開ステートメントの値は秘匿されません。ある操作がワイヤ形式に存在しても、それが受け入れられるわけではありません。対応する関係が定義されているのは上記の効果のみであり、AXT ステートメントはウィットネス付きの転送のみを受け入れます。

## プロバー実行レーン {#prover-lane}

`iroha3d` は、Kura が `init_mode = "fast"` で起動する場合を除き、ノードの起動中、Torii が送信を受け付ける前に FastPQ プロバーワーカーを 1 つ起動します。ワーカーはバックエンドをバックグラウンドで初期化するため、初期化に失敗しても起動は続行されます。その場合、実行レーンは無効のままになります。

ワーカーは、ノードの最終化された状態と Kura ストレージをポーリングします。最終化された各ブロックについて認証済みのソースを取得し（ソースが保存されていない場合はネイティブ実行をリプレイします）、ブロックの完全なステートメントを通常ルートで 1 つずつ証明します。再起動後は、固定された署名済みジェネシスから認証済みプレフィックスを再構築します。各アーティファクトは、Kura の上限付き FastPQ ストアに保存されます。保存されたアーティファクトは提示にすぎません。次に進む前に、プロデューサーはソースを認証し、アーティファクトを再度検証します。

証明の生成はノードローカルです。トランザクションの受け入れやコンセンサスのゲートではなく、実行、コミット、ファイナリティは証明を待ちません。再試行可能な失敗が起きた場合、その作業は後の試行に持ち越され、プロデューサーはプロセスごとに 1 つだけ実行されます。

## 検証 {#verification}

検証器は、検査対象のアーティファクトからではなく、必ず自身の認証済みステートメントから導出した期待値に照らしてアーティファクトを検査します。検証では、上限を課したうえで各セグメントを 1 回だけデコードし、領域外の点で AIR を 1 回評価し、オープンされたすべての行、商の葉、FRI ファイバー、および FRI 終端全体をコミット済みのルートに照らして認証し、最大 385 回の折りたたみチェックを実行します。非公開のウィットネス、トレース、完全な低次拡張は一切構築しません。

検証の成功は、呼び出し側の期待との整合性を立証するものです。実行権限、ソースのファイナリティ、リプレイの受け入れ、AXT の支出認可は一切付与しません。

`offline_compact::VerificationLimits` のデフォルト制限（通常ルートでも使用されます）：

|制限|デフォルト|
| ------------------------------- | ------------: |
| アーティファクトあたりのセグメント数 | 2 |
| アーティファクトのワイヤバイト数 | 1 MiB |
| 子証明フレーム | 500,084 バイト |
| 全セグメント合計のステートメントバイト数 | 512 KiB |
| セグメントあたりのクエリ数 | 77 |
| 全セグメント合計のクエリ数 | 154 |

ノードの実行レーンでは、さらにアーティファクトのワイヤバイト数を `zk.fastpq.proof_sidecar_max_bytes` と Kura の FastPQ オブジェクト上限で制限します。デコード前の時点で、AXT 証明ブロブは最大 2 MiB、それに埋め込まれた FastPQ ペイロードは最大 1 MiB までです。

## SORA Nexus の AXT 証明エンベロープ {#sora-nexus-axt-proof-envelopes}

SORA Nexus の AXT 証明エンベロープには `AxtFastpqBinding` を埋め込めます。AXT エンベロープのブロック検証、IVM ホストによる AXT エンベロープのチェック、および `RegisterVerifiedFeeSponsorVaultAllocation` は、エンベロープの `fastpq_binding` を必須とし、それを期待されるクレームと照合したうえで、エンベロープとそこに埋め込まれた証明に対して FastPQ 検証器を呼び出します。バインディングが欠けている場合や検証に失敗した場合、その操作は拒否されます。

検証器が受け入れるのは、ウィットネス付きの転送クレームである `tx_predicate` と `value_conservation` のみです。`authorization` と `compliance` のクレーム種別は、転送関係を持たず、効果を不透明なまま運ぶだけのものであり、検証で拒否されます。ブロック検証でもリモート支出を含むエンベロープは拒否され、IVM ホストはスタンドアロンの `AXT_VERIFY_DS_PROOF` の受け入れを拒否します。どちらも、最終化されたソースルート、トランザクションセット、発行者の認可を認証できるようになるまで利用できません。

### AXT バインディング {#axt-binding}

SORA Nexus の AXT エンベロープでは、証明と検証の前に `AxtFastpqBinding` を正規化します：

- `parameter`、`source_dataspace`、`source_receipt_id`、`verified_effect_type` は前後の空白が除去され、空であってはなりません
- `source_tx_commitment`、`claim_digest`、`witness_commitment`、`policy_commitment` は小文字に変換され、32 バイトの 16 進エンコーディングでなければなりません
- `verifier_id` は `fastpq`、`verifier_version` は `v1` でなければなりません
- `claim_type` は前後の空白が除去されて小文字に変換され、上記 4 種類のクレーム種別のいずれかを指定しなければなりません
- `target_dsids` は空であってはならず、厳密な昇順でなければなりません
- `remote_spend_intent_commitments` は厳密な昇順であり、かつ最初のリリースの上限内でなければなりません

検証では厳密な正規形式が求められます。呼び出し側に代わってバインディングを正規化することはありません。

バインディングは、ブロック実行がすでに記録したバッチに付加されるものであり、遷移を作成するものではありません。バッチには少なくとも 1 つの状態遷移が含まれ、バインディングのパラメータセット `fastpq-state-transition-stark-v1` が指定されていなければなりません。その `entry_hash` メタデータは `source_tx_commitment` と等しく、公開 `dsid` はバインディングの `source_dsid` をエンコードしたものでなければなりません。転送クレームには少なくとも 1 つの転送トランスクリプトが含まれ、すべてのトランスクリプトのバッチハッシュが `source_tx_commitment` と等しくなければなりません。

次にバインディング処理は、証明に結び付けられたメタデータをバッチに書き込みます。その内容は、正規バインディング、その 4 つのダイジェスト、`source_receipt_id`、`target_dsids`、`verified_effect_type`、空でない `corridor`、ゼロでないマニフェストルート、任意の DA コミットメント、任意のゼロでないコミット済み金額、および有効期限スロット（ゼロは有効期限なしを意味します）です。最後に、バインディングと、シールを除いたバッチに対するシールを追加します：

$$
\operatorname{seal} =
\operatorname{Hash}(
\texttt{fastpq:axt:batch-seal:v1}\|
E(\operatorname{binding})\|
E(\operatorname{batch})
)
$$

ここで $E$ は正規の Norito エンコーディングです。バインディング後にバッチ、バインディング、または証明に結び付けられた値を変更すると、検証は失敗します。検証器はさらに、エンベロープのデータスペース、マニフェストルート、DA コミットメント、コミット済み金額、有効期限を、証明に結び付けられた値と比較します。

検証済みのエンベロープは、証明された `old_root`、`new_root`、`tx_set_hash` と、ステートメントダイジェストを報告します。このダイジェストは、リトルエンディアンの `u64` で表したエンベロープのデータスペース、そのマニフェストルート、DA コミットメント（存在する場合）、バインディング、およびステートメントを対象とします：

$$
\operatorname{statement\_digest} =
\operatorname{Hash}(
\texttt{fastpq:axt:statement:v1}\|
\operatorname{le64}(\operatorname{dsid})\|
\operatorname{manifest\_root}\|
\operatorname{da\_commitment}\|
E(\operatorname{binding})\|
E(\operatorname{statement})
)
$$

AXT バッチマニフェストのダイジェストは、正規バインディングの Norito エンコーディングに対する SHA-256 です：

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## パラメータセット {#parameter-sets}

最初のリリースには、パラメータセットがちょうど 1 つ、`fastpq-state-transition-stark-v1` だけあります。バッチと AXT バインディングはこれを指定し、AXT の証明処理はそれ以外の名前をすべて拒否します。DEEP プロトコル契約は、リリースされたアーティファクトの幾何構成を次のように定めています：

| 項目 | 値 |
| -------------------------- | ----------------------------------------------------- |
| 体 | Goldilocks `p = 2^64 - 2^32 + 1`、拡大 `u^4 - 7` |
| トレース行数 | 65,536 |
| 評価行数 | 8,388,608（ブローアップ 128） |
| FRI 折りたたみアリティ | `[16, 16, 8, 8, 4]` |
| クエリ | 77 個の異なる位置 |
| グラインディング | なし |
| コミットメントとトランスクリプト | SHA3-256 と SHAKE256 |

本番運用向けの適格性認定は得られていません。この構成に対する健全性、秘匿性、Fiat-Shamir に関する独立したレビューは未完了であり、固定版の [本番運用準備状況の記録](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_production_readiness.md) は、作業量で正規化したセキュリティの主張を一切行っていません。

## 構成 {#configuration}

FastPQ の設定は `zk.fastpq` の下にネストされています。

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"
proof_sidecar_queue_cap = 1024
proof_sidecar_max_retries = 16

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

[zk.fastpq.producer]
poll_interval_ms = 1000
step_timeout_ms = 30000
max_native_steps = 16
max_source_entries = 65536
max_source_statements = 16384
```

どちらのモードも `cpu` または `gpu` のみを受け付け、デフォルトは `cpu` です。いずれかを `gpu` に設定すると、証明のハッシュ計算にデバイスが必須になります（macOS では Metal、それ以外では CUDA）。GPU サポートがコンパイルに含まれていない場合や、デバイスがプリフライトに失敗した場合、プロバー実行レーンは無効のままになり、CPU にフォールバックすることはありません。デバイスはメルクルの葉と下位の親ノードの一括ハッシュ計算を実行し、トランスクリプト、順序付き上位ツリー、トレース演算は CPU 上に残ります。`poseidon_mode = "gpu"` の場合、別のプリフライトに合格すると、ノードはトランスクリプトの Poseidon ダイジェストも GPU 上でバッチ処理し、合格しなければ CPU 上で計算します。

`proof_sidecar_max_bytes` は、ノードが永続化して検証するエンコード済みアーティファクトの上限を定め、デフォルトはプロバーの最大証明フレームです。`producer` テーブルは、各証明試行のポーリング間隔、時間予算、ネイティブリプレイのステップ数（1〜64）、および割り当て前に受け入れるソースエントリとステートメントを制限します。`metal_queue_fanout` には 1〜4 を指定できます。

モードとテレメトリラベルの設定は、`iroha3d` から上書きすることもできます：

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

`iroha3d` は設定ファイルを読み込む際に環境変数を無視するため、これらの値は TOML で設定するか、上記のオプションで指定してください。

## 指標 {#metrics}

テレメトリが有効な場合、FastPQ はバックエンドの選択、証明の永続化、Metal ランタイムの動作に関するメトリクスをエクスポートします：

|メトリクス|意味|
| ----------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |バックエンドおよびデバイスラベル別の、要求および解決された実行モード|
| `fastpq_poseidon_pipeline_total` |要求および解決された Poseidon パイプラインパス|
| `fastpq_gpu_disable_total` | アクセラレータ、理由、デバイスラベル別の GPU アクセラレータ無効化イベント |
| `fastpq_gpu_parity_failure_total` | アクセラレータ、理由、デバイスラベル別の、サンプリングされた GPU パリティ不一致 |
| `fastpq_proof_sidecar_queue_depth` | キューに入っている FastPQ 証明補助レコードの添付 |
| `fastpq_proof_sidecar_events_total` | イベント別の証明補助レコード永続化イベント |
| `fastpq_metal_queue_depth`        |Metal キューの制限、最大インフライト数、ディスパッチカウント、サンプリングウィンドウ|
| `fastpq_metal_queue_ratio`        |Metal キューのビジーおよびオーバーラップ比率|
| `fastpq_zero_fill_duration_ms`    |Metal の実行におけるホストのゼロフィル期間|
| `fastpq_zero_fill_bandwidth_gbps` |導出ゼロフィルバンド幅|

モード、GPU、Metal キュー、ゼロフィルの各メトリクスには `extended` または `full` のテレメトリプロファイルが必要で、Kura が `init_mode = "fast"` で起動した場合はエクスポートされません。Metal キューとゼロフィルのメトリクスには、さらに macOS 上の `fastpq-gpu` ビルドが必要です。

一般的なパフォーマンスのトリアージには、[パフォーマンスと指標](/ja/guide/advanced/metrics.md) に記載されているコンセンサスおよびキューの信号と一緒にこれらを使用してください。

## 関連参考 {#related-reference}

- [データモデルスキーマ](/ja/reference/data-model-schema.md)（ノードを正とする型スナップショット）
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `FastpqPublicTransferStatementV1`
- `FastpqBalanceKeyV1`
- `FastpqExecutionQuantityKeyV1`
- `TransferTranscript`
- `AxtFastpqBinding`
- `AxtProofEnvelope`
- [`iroha3d` FastPQ オプション](/ja/reference/iroha3d-cli.md#fastpq-overrides)
