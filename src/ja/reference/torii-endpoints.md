---
translation_locale: ja
translation_source: /reference/torii-endpoints.md
translation_source_hash: f04e5e78329996d70926c4fd5dc034d41605d0a82fffd6460f67b252269480d9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Torii API エンドポイント {#torii-endpoints}

Torii は Iroha 3 の HTTP、SSE、WebSocket ゲートウェイです。台帳向け APIs とオペレーター向けエンドポイントの両方を提供します。

現在のプロトコルの規則は次の通りです：

- 標準の二進形式は Norito です
- 多くの API エンドポイントは、`Accept: application/json` を送信するときに JSON もサポートします
- メトリクスは Prometheus 形式で公開されます

形式の詳細、コンテンツ交渉、レイアウトフラグ、スキーマの暗号ハッシュ、および Norito RPC のガイダンスについては、[Norito 参照](/ja/reference/norito.md) を参照してください。

## 一般的な API エンドポイント {#common-endpoints}

| API エンドポイント                         |フォーマット|目的|
| -------------------------------- | -------------- | ---------------------------------------------------------------- |
| `POST /v1/pipeline/transactions` | Norito         |署名済みのトランザクションを送信する|
|`POST /v1/query`| Norito         |署名済みの問い合わせを提出する|
| `GET /v1/events/ws`              | WebSocket      |イベントストリームを購読する|
| `GET /v1/events/sse`             | SSE            |SSE のイベントストリームを購読する|
| `GET /v1/blocks/stream`          | WebSocket      |確定ブロックをストリームする|
| `GET /v1/peers`                  | JSON           |Torii によって公開されたネットワークピアリスト|
| `GET /livez`                     |テキスト|プロセスのみの生存性；プロトコルの準備が整っていることを意味するわけではありません|
| `GET /readyz`                    | JSON           |必須のオフライン現金チェックを含む、ノードの準備完了|
| `GET /health`                    | JSON           |同じオフラインキャッシュ不変条件を持つレディネスプローブ|
|`GET /v1/api/version`|テキスト|現在のブロックヘッダーバージョン|
| `GET /status`                    | Norito または JSON |高レベルの診断ステータス；リクエスト JSON を明示的に|
| `GET /metrics`                   |プロメテウス|Prometheus スクレイプ API エンドポイント|
|`GET /v1/schema`| JSON           |有効にすると、ノードによって提供されるデータモデルスキーマのデータスナップショット|
| `GET /openapi.json`              | JSON           | OpenAPI アクティブな Torii HTTP ルートのドキュメント|
| `GET /v1/parameters`             |JSON|ノードパラメータデータスナップショット|
| `GET /v1/node/capabilities`      | JSON           |ノードの機能とデータモデルのメタデータ|
|`GET /v1/time/now`| JSON           |ノードローカルシステムクロックデータスナップショット|
| `GET /v1/time/status`            | JSON           |時間同期ステータス|

SSE リクエストの場合、ネイティブストリームと型付きフォールバックを宣伝してください：

```http
Accept: text/event-stream, application/json
```

Torii は最初にリクエストレイヤーで JSON または Norito の表現を交渉し、その後ネイティブの `text/event-stream` レスポンスを検証します。そのため `text/event-stream` のみを送信すると `406` で拒否されます。[ストリームイベントのレシピ](/ja/cookbook/stream-events.md) は完全なヘッダーを使用します。

`/openapi.json`はスキーマで表されるルートの生成された契約であり、完全な運用プローブの在庫ではありません。現在の文書には`/livez`および`/readyz`が省略されており、その`/health`の説明はレディネスハンドラーに遅れることがあります。ライブドキュメントからルートクライアントを生成しますが、稼働中のノードとピン留めされたハンドラに対して直接ライブネスとレディネスを検証します。正確なサーフェスはまだビルドに依存します機能およびソフトウェアの実行時構成。[Torii API コンソール](/ja/reference/torii-api-console.md) を使用してそのライブドキュメントを読み込み、JSON ルートをテストし、curl リクエストをコピーし、現在のスキーマからクライアントコードを生成します。

カタログ対応の OpenAPI 操作には、すべて`x-iroha-route-auth`オブジェクトが含まれています。カタログ対応の MCP ツールは、`_meta["iroha/routeAuth"]`と同じ契約を公開します。両方のプロジェクションには、`schemaVersion`、`stableRouteId`、`authentication`、および`admission`が含まれています。バージョン `1` を正確な契約として扱うこと：認証または承認ラベルの解釈方法を推測するのではなく、サポートされていない `schemaVersion` を拒否する。ルートメタデータはリクエストの境界を記述するものであり、その境界で必要な認証情報の代わりにはならない。

## ライブ Taira ルートを試す {#try-live-taira-routes}

パブリック Taira テストネットは、アプリケーションクライアントが読み取り専用の探索に使用するのと同じ Torii JSON の表面を公開します。これらのコマンドはキーを必要としません:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS -H 'Accept: application/json' \
  "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

現在のワールド状態に対してリソースの読み取りを試してください:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

パブリックテストネットのルートが`502`を返す場合、タイムアウトする場合、またはキューが飽和していると報告する場合は、クライアントコードのデバッグを行う前に、それを API のエンドポイント可用性の問題として扱い、後で再試行してください。

## コンセンサスとソフトウェアランタイム API エンドポイント {#consensus-and-runtime-endpoints}

以下のすべての Sumeragi ルートでは、オペレーターの署名が必要です。ステータス、診断、ストリーム、リーダー、キー、QC、およびパラメータルートも、テレメトリ対応ビルドが必要です。

| API エンドポイント                                  |フォーマット|目的|
| ----------------------------------------- | -------------- | ------------------------------------------------------- |
| `GET /v1/sumeragi/status`                 | Norito または JSON |権威あるリデューサー所有のコンセンサス状態|
|`GET /v1/sumeragi/diagnostics`| JSON           |非権威的なソフトウェア処理ワークフロー、キュー、および実行レーンの診断|
| `GET /v1/sumeragi/status/sse`             |SSE|継続的な権威による合意状況のストリーム|
| `GET /v1/sumeragi/leader`                 | JSON           |現在のリーダー情報|
| `GET /v1/sumeragi/qc`                     | Norito または JSON |最高かつロックされた過半数証明データスナップショット|
| `GET /v1/sumeragi/consensus-keys`         | JSON           |アクティブコンセンサスキー|
| `GET /v1/sumeragi/bls-keys`               | JSON           |アクティブ BLS コンセンサスキー|
| `GET /v1/sumeragi/params`                 |JSON|現在のオンチェーン Sumeragi パラメータ|
| `GET /v1/sumeragi/evidence`               | JSON           |証拠記録（必要に応じてクエリ文字列でフィルタリング可能）|
| `GET /v1/sumeragi/evidence/count`         | JSON           |証拠記録件数|
| `GET /v1/runtime/abi/active`              |JSON|アクティブソフトウェアランタイム ABI ディスクリプタ|
| `GET /v1/runtime/abi/hash`                |JSON|アクティブソフトウェアランタイム ABI 暗号ハッシュ|
| `GET /v1/runtime/metrics`                 | JSON           |ソフトウェア実行時メトリクスデータのスナップショット|
| `GET /v1/runtime/upgrades`                | JSON           |ソフトウェア実行時アップグレードリスト|
|`POST /v1/runtime/upgrades/propose`| JSON           |ソフトウェアランタイムのアップグレードを提案する|
| `POST /v1/runtime/upgrades/activate/{id}` | JSON           |提案されたソフトウェアランタイムのアップグレードを有効にする|
| `POST /v1/runtime/upgrades/cancel/{id}`   | JSON           |提案されたソフトウェアランタイムのアップグレードをキャンセルする|

## アプリと SORA ルートファミリー {#app-and-sora-route-families}

Torii がアプリ向けの機能セットで構築されると、エクスプローラー、SORA サービス、ブリッジフロー、証明、およびストレージのための追加の JSON ファミリーが公開されます。これらのファミリーはすべてのネットワークプロファイルで有効になっているわけではありません。

`/openapi.json` は生成されたアプリ-API カタログに登録されたルートを説明します。これは、含まれるエントリについては権威がありますが、マウントされたすべてのルートについてではありません。そのプロセスによって。特に、公共のローカル SoraFS CID およびよく知られたルートは、その生成されたドキュメントの外部に配置されており、直接プローブする必要があります。

|ルートファミリー|目的|
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*`                         | JSON リーダー、クエリヘルパー、オンボーディングヘルパー、ポートフォリオまたは保有者ビュー|
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*`                          | NFT、実世界資産、および機密資産のビュー|
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` |名前、別名、識別子の解決|
| `/v1/explorer/*`                                                          |エクスプローラー指向のアカウント、資産、ブロック、トランザクション、命令、指標、ストリームビュー|
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*`                  |取引履歴、ソフトウェア処理ワークフローの回復または状態、および ISO 20022 ヘルパー|
| `/v1/contracts/*` |コントラクトコード、デプロイ、バンドル、コール、ビュー、イベント、アクティビティ、ロールアップ、ステートルート|
| `/v1/multisig/*`, `/v1/controls/*`                                        |マルチシグ提案、承認、および送金制御ヘルパー|
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*`                            |最終性、状態証明、ブロック証明、証明保持、および証明クエリルート|
|`/v1/da/*`|データ可用性の取り込み、技術マニフェスト、証明ポリシー、暗号コミットメント値、およびピン意図|
| `/v1/zk/*`                                                                | ZK ルーツ、証明検証、IVM 証明、投票集計、検証キー、証明記録、添付ファイル|
| `/v1/gov/*`, `/v1/ministry/*`                                             |ガバナンス提案、投票用紙、理事会の状態、保護された名前空間、議題提案、制定、最終化|
| `/v1/nexus/*`, `/v1/sccp/*`                                               | Nexus 実行レーン、データスペース、およびクロスチェーン証明ヘルパー|
| `/v1/musubi/*`                                                            |Musubi パッケージレジストリの読み取りとインストラクションビルダー|
| `/v1/subscriptions/*`                                                     |サブスクリプションプラン、サブスクリプションのライフサイクル、使用状況、課金ヘルパー|
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*`                      | SoraFS プロバイダの発見、容量証明、ピン留め、ストレージ取得、そして公開コンテンツの提供                          |
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*`                | SoraCloud サービスライフサイクル、プライベートコンピュート/モデルフロー、パブリックディスカバリー、ホストされたアプリルーティング|
| `/v1/connect/*`, `/v1/vpn/*`                                              |Iroha セッションを接続, WebSocket トランスポート, VPN セッション、プロファイル、およびプロトコル結果レコード|
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*`                             |アプリ API のバインディングとバンドル/CID に基づくコンテンツルーティング|
| `/v1/operator/*`, `/v1/mcp`                                               |オペレーター認証およびネイティブ MCP JSON-RPC ブリッジ|
| `/v1/offline/*`、`/v1/repo/*`、`/v1/space-directory/*`、`/v1/ram-lfe/*` |オフライン準備、リポジトリ契約、データスペース技術マニフェスト、および[RAM-LFE ヘルパー](/ja/blockchain/ram-lfe.md#torii-routes)|
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*`        |コラボレーション、ウェブフック、プッシュ通知、ライブテレメトリー統合|

## アカウント認証、可視性、エクスプローラーカーソル {#account-authentication-visibility-and-explorer-cursors}

### アプリアカウント要求プロトコル {#app-account-request-protocol}

アプリ向けルートは、認証ヘッダーをまったく使わない場合、1つの直接単一キー証明、または1つのマルチシグ証人を受け入れます。すべての認証ヘッダーは、最大で1回だけ表示される必要があります。

直接証明のために、4つのヘッダーをすべて一緒に送ってください：

- `X-Iroha-Account`：正確な標準小文字の`0x`アカウントアドレスの16進数、または有効な標準 ASCII アカウントのエイリアス。I105 テキストは HTTP フィールドの値として安全ではありません。そのアカウントには標準の16進表記を使用してください。
- `X-Iroha-Signature`: 厳格なパディング付きBase64署名ペイロード。
- `X-Iroha-Timestamp-Ms`：設定されたスキューウィンドウ内の、標準的な符号なし10進数のミリ秒単位Unixタイムスタンプ。
- `X-Iroha-Nonce`：リプレイウィンドウ内で一意の、1から256の印刷可能な ASCII バイト（`0x21`から`0x7e`まで）。

登録されたシングルキーコントローラーは、これらの正確なバイトに署名します：

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

標準的なクエリ構築は、生のクエリを `application/x-www-form-urlencoded`（`+` はスペースを意味します）として解析し、そのペアをパーセントデコードし、`(key, value)` によってソートし、再びフォームエンコードします。このプロトコルは、最大64組のデコード済みペアと64個の生クエリテキスト KiB を認めます。送信されたままの本文バイトを暗号化ハッシュして下さい。固定32バイトのネットワークIDと大文字のメソッドの間に区切りを挿入しないでください。

V1 検証者は、解析する前に、メソッドトークンを32バイトに、パーセントエンコードされたリクエストパスを64 KiB に、直接アカウントIDを36 KiB に制限します。アカウントのエイリアスには、3つの名前セグメントとそれらの区切り記号というより厳しい構造上の制限があります。制限を超えると、署名の検証やソースサイズの割り当ての前に認証が失敗します。

マルチシグコントローラーは、代わりに `X-Iroha-Witness` を厳密にパディングされた Base64 標準形式の Norito として送信し、`X-Iroha-Signature`、`X-Iroha-Timestamp-Ms`、および `X-Iroha-Nonce` を省略する必要があります。`X-Iroha-Account` はこの形式では任意です。存在する場合、それは証人 `subject_account` と等しくなければなりません。`CanonicalRequestWitnessV1`には、`schema_version`、`subject_account`、`timestamp_ms`、`nonce`、本文の暗号化ダイジェスト値を通じた正確なネットワーク要求バイトの Iroha `Hash`（新鮮さフィールドを含まない）、および最大で64個のメンバー署名が含まれます。各メンバーは、その同じペイロードの署名配列を除いた正準 Norito エンコーディングに署名します。検証されたメンバーは、アカウントの現在のマルチシグポリシーを満たす必要があります。エンコードされた証人は1 MiB に制限されます。

認証ヘッダーを一切提供しない場合は、匿名アクセスが選択されます。部分的、混合、重複、不正、期限切れ、またはリプレイされた証明を提供すると認証に失敗し、決して匿名表示にフォールバックしません。

### オペレーター要求プロトコル {#operator-request-protocol}

オペレーター認証済みとしてマークされたルートには、4つすべてのシングルトンヘッダーが必要です:

- `x-iroha-operator-public-key`：正規の Iroha マルチハッシュ公開鍵。
- `x-iroha-operator-timestamp-ms`: ミリ秒単位の標準的な符号なし10進Unixタイムスタンプ。
- `x-iroha-operator-nonce`: リプレイウィンドウ内でそのキーに対して一意の、1から256の印字可能な ASCII バイト。
- `x-iroha-operator-signature`: 厳格なパディング付きBase64署名ペイロード。

ヘッダーの値には前後の空白を含めてはいけません。演算子キーは以下の通りです:

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

パス、クエリ、ボディ、タイムスタンプ、および暗号的ノンス値のルールは、アプリプロトコルで使用されるのと同じ標準的なルールです。キーは`[torii.operator_signatures]`によっても承認される必要があります：`allowed_public_keys`にリストするか、ノードキーを使用する際に`allow_node_key`を明示的に有効にしてください。リプレイキャッシュの飽和は `503 Service Unavailable` で閉鎖に失敗しました。

正確なリクエスト署名は常に必須です。`[torii.operator_auth].enabled = true` の場合、各通常のオペレータールートも有効な `x-iroha-operator-session` を必要とします。`require_mtls = true` の場合、追加で信頼されたイングレスからの `x-forwarded-client-cert` が必要です。どちらの要素もリクエスト署名に代わるものではありません。

WebAuthn 登録およびログインには、これら4つの JSON API エンドポイントを使用します:

|方法および API エンドポイント|目的|
| --------------------------------------------- | ---------------------------------------- |
| `POST /v1/operator/auth/registration/options` | WebAuthn 資格登録を開始する|
| `POST /v1/operator/auth/registration/verify` |資格情報を確認して保存する|
| `POST /v1/operator/auth/login/options`        | WebAuthn 認証を開始|
| `POST /v1/operator/auth/login/verify`         |主張を確認し、セッションを発行してください|

`torii.operator_auth.tokens` を専用のブートストラップ値で構成します。クレデンシャルが存在する前に、最初の登録を開始するために `x-iroha-operator-token` として 1 つ送信します。そのトークンは通常のオペレーター経路を認可することはなく、リスナー `x-api-token` の値はこのフローで再利用されることはありません。資格情報が存在する場合、別の資格情報を登録するには認証済みセッションが必要です。ログイン確認は、すべての新しい正確なネットワークオペレーター要求署名と一緒に送信するためのセッショントークンを返します。資格情報は `<torii.data_dir>/operator_auth/operator_webauthn.json` の下で保持されます。

ISO 20022 のルートは、2つの独立したチェックを適用します。リクエストはまずこのオペレーターの許可リストおよび署名プロトコルを通過する必要があります；その後、ISO ハンドラーは、以下に記載された正確な参加者または監査役割を持つ同じキーを必要とします。

### ブロックチェーン台帳の可視性とエクスプローラーカーソル {#ledger-visibility-and-explorer-cursors}

アプリ向けのブロックチェーン台帳の読み取りは、上記のオプションのアプリアカウント境界を使用します。署名されていないリクエストは、公開として構成されたデータスペースのみを受け取ります。有効な署名付きリクエスト呼び出し元の現在の UAID にバインドされたデータスペースを追加します。それぞれの制限されたデータスペースは正確な`CanReadRestrictedDataspace { dataspace }`権限で名前が付けられるか、アカウントが`CanReadAllLedgerData`を持っている場合はすべてのルートになります。

呼び出し元の認可プリンシパルに一致するルートを使用してください：

|方法および API エンドポイント|認証と可視性|
| ------------------------------------- | --------------------------------------------------------------- |
|`POST /v1/transactions/visible/query`|正規のアカウント署名; 呼び出し元の可視性を適用する|
|`POST /v1/transactions/query`|オペレーター要求署名；グローバルオペレーターの表示を許可|
| `GET /v1/triggers/completed`          |オペレーター要求署名; ノードローカルの完了レコードを読み取る|

同じ可視性オブジェクトは、アカウント、ドメイン、アセット定義、アセット、NFT、RWA、ホルダー、Explorerの読み取りをフィルタします。不在のオブジェクトと呼び出し元の可視ルート外にあるオブジェクトは、意図的に区別がつかないようにされています。最終化された取引および指示履歴は、取引のために記録されたすべての経路金融転送部分が表示される場合にのみ表示されます。混合データスペース取引はしたがって、参加者の一人でも財務転送部分が呼び出し元の範囲外にある場合は隠されます。ルーティングコンテキストが欠落している、古くなっている、または不正な場合は、グローバルリーダーのみが確認できます。

六つの世界対応のExplorerコレクションは、不透明な標準的base64urlキーセットカーソルを使用します。デフォルトのページ制限は25で、最大は100であり、1ページで最大512の候補キーを検査します。各カーソルは、そのコレクション、フィルター、標準的な最後のキー、および呼び出し元の可視ルートセットの暗号ダイジェスト値に結び付けられているため、別のクエリで再利用したり、呼び出し元の可視性が変化した後に再生することはできません。

ブロック、トランザクション、最新トランザクション、インストラクション、および最新インストラクションの履歴カーソルは、最終確定済みデータのスナップショットの高さとブロックの暗号化ハッシュも固定します。レスポンスは `pagination.limit`、`pagination.snapshot_height`、`pagination.snapshot_hash`、`pagination.next_cursor`、および `pagination.has_more` を公開します。別のルートやフィルターセットのカーソル、変更された可視性の暗号ダイジェスト値、またはノードがもはや検証できないデータスナップショットはクローズドして失敗します。ブロッキングワーカーが実行されている間、履歴スキャンは Torii のクエリ許可内に留まります。

エクスプローラー WebSocket のストリームは、フィルタリングされたサマリーを出力し、ブロックチェーン台帳の権限が変更されると可視性を再計算します。ネイティブの `GET /v1/blocks/stream` ルートは異なります:それは完全な署名付きブロックを送出し、ハンドシェイク中に `CanReadAllLedgerData` を要求し、その後その許可が取り消された場合には閉じます。データスペース対応のエクスプローラーにはネイティブストリームを使用しないでください。

## ISO 20022 ブリッジ {#iso-20022-bridge}

Torii は、アプリ向けの API とブリッジソフトウェアランタイムが有効になっている時に、`/v1/iso20022/*` の下で ISO 20022 ブリッジを公開します。ブリッジは意図的に次の範囲に限定されています:これは汎用の ISO 20022クリアリングゲートウェイではなく、選択された支払いメッセージを署名付き Iroha 転送に変換し、それらのブロックチェーン台帳の状態を追跡するためにサポートされているサブセットです。

提出を受け入れる前に、耐久性のあるローカル`torii.iso_bridge.store_dir`を構成してください。構成フィールドは、ノードが読み取り専用または診断用途で起動できるようにするためのみ任意です。すべての認証済みの ISO 提出にはディレクトリが必要であり、永続性がない場合やリプレイ・トゥームストーンまたはリッチレコードの書き込みに失敗した場合は、再試行可能な `503 Service Unavailable` を返します。

### Torii ISO 20022 API エンドポイント {#torii-iso-20022-endpoints}

|方法および API エンドポイント|目的|
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `POST /v1/iso20022/pacs008`                  |FI から FI への顧客クレジット振替を提出し、対応する Iroha 資産振替を作成してください|
| `POST /v1/iso20022/pacs009`                  |PvP または有価証券関連の資金調達に使用される FI から FI へのクレジット振替を提出してください|
| `POST /v1/iso20022/pacs002`                  |取引相手所有の支払状況報告書を提出してください；金融取引の清算には最終取引の証拠が必要です|
| `POST /v1/iso20022/pacs004`                  |取引先所有の支払い返却を提出する|
| `POST /v1/iso20022/camt056`                  |発行者所有の支払いキャンセルリクエストを提出する|
| `POST /v1/iso20022/sese023`                  |有価証券の金融取引決済指示を提出する|
| `POST /v1/iso20022/sese024`                  |カウンターパーティー所有の有価証券金融取引決済状況メッセージを提出する|
| `POST /v1/iso20022/sese025`                  |相手方保有有価証券の金融取引決済確認を提出する|
| `POST /v1/iso20022/colr012`                  |担保の代替メッセージを送信する|
|`GET /v1/iso20022/messages/{msg_id}`|1つのメッセージに関する標準的なブリッジ記録を読み取る|
|`GET /v1/iso20022/audit/messages`|改ざん防止メッセージ監査技術マニフェストを読む|
| `GET /v1/iso20022/messages/{msg_id}/pacs002` |現在の支払い状況を `pacs.002` XML として表示する|
| `GET /v1/iso20022/messages/{msg_id}/pacs004` |現在の支払い返却を `pacs.004` XML としてレンダリングする|
| `GET /v1/iso20022/messages/{msg_id}/camt029` |現在のキャンセル解決策を `camt.029` XML としてレンダリングする|
| `GET /v1/iso20022/messages/{msg_id}/sese024` |現在の金融取引清算状況を `sese.024` XML として表示する|
| `GET /v1/iso20022/messages/{msg_id}/sese025` |現在の金融取引清算確認を `sese.025` XML として表示してください|

`pacs.008` の提出には、メッセージID、銀行間の金融取引決済金額、通貨、金融取引決済日、債務者および債権者 IBANs、および債務者および債権者 BICs を提供する必要があります。参照データが設定されている場合、ブリッジは、生成された取引がソフトウェアの処理ワークフローに入る前に、BIC、IBAN、および ISO の4217通貨クロスウォークも確認します。

`pacs.009` の送信では、ビジネスメッセージ ID、メッセージ定義 ID、作成時刻、銀行間決済額、通貨、決済日、指図側機関と被指図側機関の BICs、債務者と債権者の IBANs を指定する必要があります。メッセージに `Purp` が含まれる場合、現在ブリッジが受け付けるのは証券目的の資金提供、つまり `Purp=SECU` だけです。

`pacs.008`および`pacs.009`の送信 API エンドポイントは、XML ISO データコンテナまたはブリッジテストで使用されるフラットフィールド形式を受け入れます。オプションの `SplmtryData` フィールドは、対象の Iroha ブロックチェーン台帳、送信元および受信先のアカウントIDまたはアドレス、資産定義IDを固定することができます。レスポンスは `202 Accepted` であり、`message_id`、`transaction_hash`、`status`、`pacs002_code`、および解決された台帳/アカウント/資産のコンテキストが含まれます。

### 参加者の認可とライフサイクル管理 {#participant-authorization-and-lifecycle-ownership}

有効になっているすべてのブリッジには参加者カタログがあります。各参加者エントリには、ユニークな参加者ID、1つ以上のオペレーター公開鍵、1つ以上の金融識別子、許可されたプロファイルセット、および`originator`、`counterparty`のいずれか、または両方の役割があります。オペレーターキーと金融識別子は、複数の参加者に属することはできません。`audit_admin_keys` を別々に設定してください。監査管理キーは、参加者の変更キーでもあることはできません。

すべての ISO ルートには、新しいオペレーターの署名が必要です。初回の`pacs.008`、`pacs.009`、`sese.023`、または`colr.012`の提出の場合、認証されたオペレーターは、アプリケーションヘッダー`From`の金融身元で特定された参加者に属している必要があります。`To` のアイデンティティは、`counterparty` の役割を持つ設定された参加者に解決される必要があり、選択されたプロファイルは両当事者に許可されている必要があります。耐久性のある入場記録は、発信者、相手方、入場参加者およびオペレーターキー、元のプロファイルおよび埋め込み署名ポリシーを記録します。

ライフサイクル認可は、呼び出し元が選択した値ではなく、その不変の記録から派生します。

|ライフサイクルメッセージ|必要な参加者|
| ---------------------------------------------- | -------------------------------------------------- |
| `pacs.002`, `pacs.004`, `sese.024`, `sese.025` | 元の相手方と `counterparty` 役割 |
| `camt.056`                                     | 元の発信者と一緒に `originator` 役割     |

オリジナルのプロファイルおよび署名ポリシーはライフサイクル全体にわたって固定されているため、呼び出し元は更新のためにより弱いプロファイルを選択することはできません。`pacs.002` コードは次のものを表します金融取引の決済（`ACSC`、`ACCP`、`SETT`、または`SETTLED`）は、Torii が取引証拠を確定したときにのみ元の記録を決済済みに変更します。

いずれの元の当事者も、自分のメッセージ記録および生成された送信箱文書を読むことができます。監査 API エンドポイントは、認証された参加者が発信者または相手方であるレコードのみを返します。別途構成された監査管理者は、グローバルな読み取り専用の監査ビューを受け取り、メッセージを送信したり変更したりすることはできません。未知の参加者や無関係なメッセージ識別子は開示されません。

### 耐久性のあるリプレイIDおよび署名済みアウトボックス文書 {#durable-replay-identity-and-signed-outbox-documents}

リプレイ耐久削除マーカーは厳格な受付境界です。Torii は、読み取れない、サイズが大きすぎる、破損している、名前が間違っている、競合している、または明示的に互換性のない耐久削除マーカーに対して起動を中止します。また、明示的に互換性のないスキーマバージョンを持つリッチレコード、現在の構成に存在しない参加者、プロファイル、または署名ポリシー、あるいは欠落しているか不一致のライブ耐久削除マーカーに対しても中止します。

その他の豊富な記録の損傷は異なる方法で処理されます: 読めないファイルやサイズが大きすぎるファイル、無効な JSON、無効な現在のスキーマの記録、正規化されていないファイル名、そして再生IDの競合はログに記録されるか、スキップされます。読み取れないか無効な現在のバージョンの監査インデックスは、保持された記録から再生成されます。明示的に互換性のない監査インデックスのバージョンのみが起動を中止します。起動ログを監視し、すべての破損したリッチレコードファイルがノードのサービス提供を妨げると仮定するのではなく、再生成された監査技術マニフェストを照合してください。

各保持されたリッチレコードは、変更不可能な参加者プロビナンスを保持します。別の耐久性のある削除マーカーは、リッチレコードの詳細が整理された後でも、メッセージID、ペイロードの暗号ハッシュ、ビジネスメッセージID、および完全な重複排除のための UETR を保持します。TTL

Torii はライフサイクルメッセージに署名または処理する前にリプレイアドミッションを保持します。未期限切れのリプレイ識別子を決して削除しません。設定された容量が 保護された記録または未期限のリプレイIDによって完全に占有されている場合、送信はライフサイクルや会計状態を変更することなく再試行可能な `503 Service Unavailable` を受け取ります。

生成されたすべての `pacs.002`、`pacs.004`、`camt.029`、`sese.024`、または `sese.025` ドキュメントは、これらのレスポンスヘッダーとともに `application/xml` として返されます:

|ヘッダー|意味|
| ------------------------------ | ----------------------------------------------------- |
| `X-Iroha-Iso-Signature-Domain` |常に `iroha.iso20022.outbound.v2`|
| `X-Iroha-Iso-Signer`           |設定されたブリッジ暗号署名者の正規公開鍵|
| `X-Iroha-Iso-Signature`        |ドメイン分離された XML バイトに対する Base64 署名|

署名を UTF-8 バイトシーケンス `iroha.iso20022.outbound.v2`、1つのゼロバイト、および正確なレスポンスボディに対して検証してください。検証前に XML を再フォーマットしたり正規化したりしないでください。

### 追加のパーサーおよびマッピングサポート {#additional-parser-and-mapping-support}

IVM ISO ヘルパーは、データコンテナの検証、金融取引決済のマッピング、または下流の照合のために、次のメッセージファミリーも検証および具現化します。それらには独立した Torii ルートはありません。

|家族にメッセージ|現在のサポート|
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
|`head.001`|ビジネスアプリケーションヘッダーの検証、ISO データコンテナ用、`BizMsgIdr`、`MsgDefIdr`、作成時間、およびオプションの送信者/受信者 BIC フィールドを含む|
| `pacs.007`, `pacs.028`, `pacs.029` |支払いの取り消し、ステータスの照会、調査の解決/ステータス解析|
| `pain.001`, `pain.002`             |顧客の支払い開始および支払い状況レポートの検証|
| `camt.052`, `camt.053`, `camt.054` |口座報告書、明細書、および通知の検証|

## Kaigi セッション {#kaigi-sessions}

Kaigi は、SORA Nexus 上で有料のリアルタイムオーディオ/ビデオルームを提供します。アプリケーションがすべての会議状態をオフチェーンに保持する代わりに、ブロックチェーン台帳によるセッション作成、参加者リストの変更、リレー技術マニフェスト、暗号化通信、および使用計測を必要とする場合に使用してください。

ブロックチェーン台帳のライフサイクルとの相互作用は次の通りです：

- `CreateKaigi`：ドメインの下で通話を作成し、そのポリシー、スケジュール、メタデータ、およびオプションのリレーテクニカルマニフェストを保存します。
- `JoinKaigi`：通話名簿を更新してください。`zk-roster-v1`モードでは、公開通話ビューは参加者のアカウントIDの代わりに暗号化コミットメント値とヌリファイアのカウントを表示します。
- `LeaveKaigi`：透明な通話から参加者を削除します。プライベートモードでの退場は、初回リリースのプロトコルではオフチェーンです。
- `RecordKaigiUsage`: メーター付期間とトランザクション実行コストの合計を追加します。
- `EndKaigi`: セッションを終了し、最終のタイムスタンプを記録する。

Torii は、次のアプリ向けの読み取りを公開します:

|ルート|認証|目的|
| ----------------------------------- | --------------------------------------- | ------------------------------------------ |
|`/v1/kaigi/calls/{call_id}`|公開|現在の通話記録|
| `/v1/kaigi/calls/{call_id}/signals` |標準的な正確なネットワークアカウントのリクエスト|ページ分割された最終化済みのシグナルメタデータ|
| `/v1/kaigi/calls/{call_id}/events`  |標準的な正確なネットワークアカウントのリクエスト|コールライフサイクルストリーム|
| `/v1/kaigi/relays`                  |許可リストに載っているオペレーターのリクエスト|リレーの要約|
| `/v1/kaigi/relays/{relay_id}`       |許可リストに載っているオペレーターのリクエスト|1つのリレーの登録および健康の詳細|
| `/v1/kaigi/relays/health`           |許可リストに載っているオペレーターのリクエスト|リレーの総合状態|
| `/v1/kaigi/relays/events`           |標準的な正確なネットワークアカウントのリクエスト|リレー登録および健康イベントストリーム|

アプリ API を有効にする必要があります。リレーの概要とヘルスルートは読み取り専用であってもオペレーターの操作画面です；署名されていない `curl` リクエストは有効な可用性プローブではありません。セッション状態は、`KaigiRosterSummary`、`KaigiRelayManifestUpdated`、`KaigiRelayHealthUpdated`、`KaigiUsageSummary` などの Kaigi ドメインイベントを通じても反映されます。

### CLI スモークテスト {#cli-smoke-test}

接続する前に UI がある場合、Torii API エンドポイントが Kaigi トランザクションを受け入れるか確認したいときは、`iroha app kaigi` CLI から始めてください。クイックスタートコマンドは、設定された API エンドポイントに対してルームを作成し、その通話識別子と参加メタデータを表示します:

```bash
iroha app kaigi quickstart \
  --domain kaigi.universal \
  --summary-out kaigi-summary.json
```

スクリプト化されたフローの場合、ルームのライフサイクルを明示的に管理してください:

```bash
iroha app kaigi create \
  --domain kaigi.universal \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha app kaigi join \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi leave \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi record-usage \
  --domain kaigi.universal \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha app kaigi end --domain kaigi.universal --call-name daily
```

ビューアチケットなしでリレーが公開する可能性のある部屋には`--room-policy public`を使用し、出口でビューア認証が必要な場合は`--room-policy authenticated`を使用します。`--privacy-mode zk-roster-v1`は、次の場合にのみ使用してください。ネットワークには Kaigi の名簿と使用検証キーが設定されている必要があります。そうでない場合、決定的検証中に参加、離脱、およびプライベート使用記録が失敗します。

### JavaScript 統合 {#javascript-integration}

現在の [Iroha JavaScript デモ](https://github.com/soramitsu/iroha-demo-javascript) 透明で認証された1対1のミーティングプロファイルを実装します。プロトコルの内容を公開しません `zk-roster-v1` プルーフフロー。そのレンダラーは作成します WebRTC 提供と応答、一方で特権付きブリッジはローカルを使用する [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) 見積もりにチェックアウトし、署名して、提出し、最終結果を待つ Kaigi 取引。

正確なルート認証、招待フォーマット、ブリッジ境界、現在のデモテストコマンドについては、[JavaScript アプリに Kaigi を埋め込む](/ja/guide/tutorials/kaigi.md) を参照してください。

## 状況と指標 {#status-and-metrics}

ステータスおよびメトリクス API エンドポイントは、ダッシュボードに最初に接続するものです:

- `/status` はトップレベルのネットワークピア、ブロック、キュー、およびコンセンサスのフィールドを公開します
- `/metrics` は Prometheus のカウンター、ゲージ、ヒストグラムを公開します

Nexus 対応ノードでは、ステータス出力には実行レーンおよびデータ空間対応セクションも含まれます。`nexus.enabled = false`の場合、これらのセクションは省略されます。

## JSON 対 Norito {#json-vs-norito}

いくつかのオペレーター API のエンドポイントは、デフォルトで Norito を返します。API エンドポイントが JSON をサポートしている場合、送信してください:

```http
Accept: application/json
```

これは特に次の場合に役立ちます:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`

API エンドポイントが型付き Norito を直接受け入れるまたは返す場合、コンテンツタイプまたは推奨される `Accept` 値として `application/x-norito` を使用します。輸送の詳細については [Norito](/ja/reference/norito.md#torii-and-norito-rpc) を参照してください。

## テレメトリープロファイル {#telemetry-profiles}

API エンドポイントの可視性は、ノードの `telemetry.profile` 設定によって決まります。現在の構成では、5つのプロファイルレベルが公開されています：

|プロフィール| `/status` | `/metrics` |開発者ルート|
| ----------- | --------- | ---------- | ---------------- |
| `disabled` |いいえ|いいえ|いいえ|
|`operator`|はい|いいえ|いいえ|
| `extended` |はい|はい|いいえ|
| `developer` |はい|いいえ|はい|
|`full`|はい|はい|はい|

## CLI ショートカット {#cli-shortcuts}

この `iroha` CLI はすでにこれらの多くの API エンドポイントをラップしています:

```bash
export IROHA_OPERATOR_KEY_FILE=/run/secrets/iroha/operator.key

iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  ops sumeragi params
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi evidence count
```

## 上流参照 {#upstream-references}

- [README API とオブザーバビリティの概要](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO 20022ブリッジ実装](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [パフォーマンスと指標](/ja/guide/advanced/metrics.md)
