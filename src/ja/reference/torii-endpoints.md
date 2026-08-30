---
translation_locale: ja
translation_source: /reference/torii-endpoints.md
translation_source_hash: 995701cfca9594b88a0da73a5b582c75c5962449a9ccf150e65738d3656d4f02
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii エンドポイント {#torii-endpoints}

Torii は HTTP, SSE, そして WebSocket ゲートウェイ Iroha 3. 2つのレジスタンスに向き合っている APIs 操作者のエンドポイント

現行のプロトコルの規則は:

- カノニカルバイナリー形式は Norito
- 多くのエンドポイントもサポートしています JSON 送ると `Accept: application/json`
- メトリックはPrometheus形式で表示されます.

フォーマット詳細,コンテンツ交渉,レイアウトフラッグ,スキーマハッシュ,および Norito RPC ガイドについては, [Norito 参照](/ja/reference/norito.md)を参照してください.

## 共通点 {#common-endpoints}

|終点|フォーマット|目的|
| ------------------------------------- | -------------- | ---------------------------------------------------------------- |
|`POST /v1/pipeline/transactions`|Norito|署名された取引を提出する|
|`POST /v1/query`|Norito|署名した問い合わせを提出する|
|`GET /v1/events/ws`|WebSocket|イベントストリームを登録する |
|`GET /v1/events/sse`|SSE|SSE 以上のイベントストリームを登録する|
|`GET /v1/blocks/stream`|WebSocket|ストリームコミットブロック|
|`GET /v1/peers`|JSON|Torii によって暴露された同級者リスト|
|`GET /livez`|テキスト|プロセスのみの活性を示し,プロトコル準備を暗示しない.|
|`GET /readyz`|JSON|強制的なオフライン現金チェックを含むノードの完全な準備性|
|`GET /health`|JSON|同様のオフラインキャッシュインバリアントの準備探査機|
|`GET /v1/api/version`|テキスト|現在のブロックヘッダバージョン |
|`GET /status`|Norito または JSON |高レベルの診断状態; 明確に要求する JSON |
|`GET /metrics`|プロメテウス |プロメテウスのスクラップエンドポイント |
|`GET /v1/schema`|JSON|接続されたときにノードが提供するデータモデルスケーマスナップショット|
|`GET /openapi` または `GET /openapi.json` |JSON|OpenAPI 文書は,アクティブの Torii HTTP ルートについてです |
|`GET /v1/parameters`|JSON|ノードパラメータのスナップショット|
|`GET /v1/node/capabilities`|JSON|ノード能力とデータモデルメタデータ|
|`GET /v1/time/now`|JSON|ノード壁時計のインシュート|
|`GET /v1/time/status`|JSON|時間同期状態 |

SSE 要求の場合,ネイティブストリームと入力されたフォールバックを広告する.

```http
Accept: text/event-stream, application/json
```

Torii は最初に,要求層で JSON または Norito の表現を交渉し,その後ネイティブ `text/event-stream` 応答を検証する.したがって,ただ `text/event-stream` を送信することは `406` で拒否される. [ ストリームイベントレシピ](/ja/cookbook/stream-events.md) では完全なヘッダーを使用します.

`/openapi`は,スケーマで表現されているルートのための主要な生成された契約であり,完全な運用探査物資ではありません.現在の文書では `/livez` と `/readyz` が省略され,その `/health` の記述は準備管理器に遅れている可能性があります.ライブドキュメントからルートクライアントを生成しますが,実行ノードとピンされたハンドラーに対して直接活性性と準備性を検証します.正確な表面はまだビルド機能やランタイム構成に依存します.[Torii API コンソール](/ja/reference/torii-api-console.md) を使用して,そのライブドキュメントをロードし, JSON ルートをテストし, curl リクエストをコピーし,現在のスキーマからクライアントコードを作成します.

## Taira 経路を試す {#try-live-taira-routes}

公衆 Taira テストネットが同じものを暴露する Torii JSON アプリケーション クライアントが読み込みのみの探索のために使用する表面.これらのコマンドにはキーが必要ではありません:

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

現在の世界状態と比べると,

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

パブリックテストネットルートが `502` を返信し,タイムアウトまたは飽和したキューを報告した場合,エンドポイントの可用性の問題として取り扱って,クライアントコードをデバッグする前に後で再試してください.

## 合意と実行時間の終点 {#consensus-and-runtime-endpoints}

|終点|フォーマット|目的|
| --- | --- | --- |
|`GET /v1/sumeragi/commit-certificates`|JSON|最近のコミット証明書概要 |
|`GET /v1/sumeragi/validator-sets`|JSON|認証器設定履歴 |
|`GET /v1/sumeragi/validator-sets/{height}`|JSON|検証器がブロック高度に設定される|
|`GET /v1/sumeragi/status`|Norito または JSON |詳細なコンセンサスの現状の瞬間写真|
|`GET /v1/sumeragi/status/sse`|SSE|継続的なコンセンサス状態の流れ|
|`GET /v1/sumeragi/leader`|JSON|現在のリーダー情報 |
|`GET /v1/sumeragi/qc`|Norito または JSON |最新のクォーラム証明書要約|
|`GET /v1/sumeragi/checkpoints`|JSON|合意チェックポイントの概要|
|`GET /v1/sumeragi/consensus-keys`|JSON|アクティブコンセンサスキー |
|`GET /v1/sumeragi/bls_keys`|JSON|アクティブ BLS コンセンサスキー |
|`GET /v1/sumeragi/phases`|JSON|最新の段階間遅延サンプル|
|`GET /v1/sumeragi/rbc`|JSON|RBC セッションと吞吐量測定値|
|`GET /v1/sumeragi/rbc/sessions`|JSON|アクティブ RBC セッションスナップショット |
|`GET /v1/sumeragi/pacemaker`|JSON|ペースメーカーの状態|
|`GET /v1/sumeragi/params`|JSON|チェーン上の現在のパラメータ Sumeragi |
|`GET /v1/sumeragi/collectors`|JSON|決定的なコレクタープランのスナップショット|
|`GET /v1/sumeragi/key-lifecycle`|JSON|コンセンサスキーライフサイクルの状態 |
|`GET /v1/sumeragi/telemetry`|JSON|コンセンサステレメトリ スナップショット|
|`GET /v1/sumeragi/evidence`|JSON|証拠記録,選択的にクエリ文字列でフィルタリングされる|
|`GET /v1/sumeragi/evidence/count`|JSON|証拠の記録数|
|`POST /v1/sumeragi/evidence/submit`|JSON|合意の証拠を提出する|
|`GET /v1/sumeragi/commit_qc/{hash}`|Norito または JSON |ブロックハッシュに QC の記録をコミットする|
|`GET /v1/runtime/abi/active`|JSON|アクティブランタイム ABI ディスクリプター |
|`GET /v1/runtime/abi/hash`|JSON|アクティブランタイム ABI ハッシュ |
|`GET /v1/runtime/metrics`|JSON|ランタイムメトリックの瞬間写真|
|`GET /v1/runtime/upgrades`|JSON|実行時間のアップグレードリスト|
|`POST /v1/runtime/upgrades/propose`|JSON|実行時間のアップグレードを提案する|
|`POST /v1/runtime/upgrades/activate/{id}`|JSON|実行時間のアップグレードを起動する|
|`POST /v1/runtime/upgrades/cancel/{id}`|JSON|実行時間のアップグレードをキャンセルする|

## Appと SORA ルートファミリー {#app-and-sora-route-families}

Torii がアプリ面の機能セットで構築された場合,探検器のための追加の JSON ファミリー, SORA サービス,橋流,証明およびストレージを暴露します.これらのファミリーはすべてすべてのネットワークプロフィールで有効ではありません.

`/openapi`は,生成された app-API カタログに登録されている経路を記述し,その入りのエントリについては権威あるが,設置されたすべての経路にはない. 特に,公共のローカル SoraFS CID とよく知られているルートが生成された文書の外に設置され,直接調査されなければならない.

|経路ファミリー|目的|
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|`/v1/accounts/`, `/v1/domains/`, `/v1/assets/*` |JSON 読書,查询助手,オンボード助手,ポートフォリオまたは保持者のビュー |
|`/v1/nfts/`, `/v1/rwas/`, `/v1/confidential/*` |NFT,実世界の資産,そして機密的な資産の見方|
|`/v1/aliases/`, `/v1/assets/aliases/`,`/v1/sns/`, `/v1/identifiers/` |名前,ニックネーム,識別子解析度|
|`/v1/explorer/*`|エクスプローラー向けアカウント,資産,ブロック,トランザクション,指示,メトリック,ストリームビュー |
|`/v1/transactions/`, `/v1/pipeline/`, `/v1/iso20022/*` |取引履歴,パイプラインの復旧または状態,および ISO 20022助手|
|`/v1/contracts/*`|契約コード,デプロイ,バンドル,コール,ビュー,イベント,アクティビティ,ロールアップ,ステートルート |
|`/v1/multisig/`, `/v1/controls/` |マルチシグの提案,承認,および転送制御支援者 |
|`/v1/bridge/`, `/v1/ledger/`, `/v1/proofs/*` |確定性,ステート証明,ブロック証明,証拠保存,および証拠查詢経路|
|`/v1/da/*`|データの利用量,マニフェスト,証明方針,コミットメント,ピン意図|
|`/v1/zk/*`|ZK ルーツ,証明検証, IVM 証明,投票計測,確認鍵,証拠記録,添付書 |
|`/v1/gov/`, `/v1/ministry/` |統治提案,投票票,理事会国家,保護された名前の空間,議題提案,制定と最終化|
|`/v1/nexus/`, `/v1/sccp/` |Nexus レーン,データスペース,そしてクロスチェーンの防護支援者|
|`/v1/musubi/*`|Musubi パッケージレジスタの読み書きと指示作成者 |
|`/v1/subscriptions/*`|サブスクリプションプラン,サブスクリプションライフサイクルの利用と補助料の請求 |
|`/v1/sorafs/`, `/sorafs/`, `/.well-known/sorafs/*` |SoraFS プロバイダー発見,能力証明,ピニング,収納取出し,公共コンテンツ配信 |
|`/v1/soracloud/`, `/v1/soradns/`,`/soradns/`, `/api/` |SoraCloud サービスライフサイクル,プライベートコンピューティング/モデルフロー,公開発見,ホストされたアプリルーティング|
|`/v1/connect/`, `/v1/vpn/` | Iroha 接続セッション WebSocket 輸送 VPN セッション,プロフィール,領収                                         |
|`/v1/app-api/`, `/v1/api/`, `/v1/content/*` |App API 結合とバンドル/CID サポートされたコンテンツルーティング|
|`/v1/operator/*`, `/v1/mcp` |オペレーターの認証とネイティブ MCP JSON-RPC ブリッジ|
|`/v1/offline/`, `/v1/repo/`,`/v1/space-directory/`, `/v1/ram-lfe/` |オフラインの準備,リポジトリ契約,データスペースマニフェスト,および [RAM-LFE 支援者](/ja/blockchain/ram-lfe.md#torii-routes) |
|`/v1/kaigi/`, `/v1/webhooks/`,`/v1/notify/`, `/v1/telemetry/` |協働,Webhook,プッシュ通知,およびライブテレメトリ統合|

## アカウント認証,可視化,探検器カーソル {#account-authentication-visibility-and-explorer-cursors}

### アップアカウント要求プロトコル {#app-account-request-protocol}

アプリ面のルートでは認証ヘッダは認められず,直接単鍵証明書またはマルチシグ証書が受け入れられます.すべての認証ヘッダーは最大で一度に表示する必要があります.

直接の証明のために,四つのヘッダを一緒に送ってください.

- `X-Iroha-Account`: 正確な法典的な小文字 `0x` 口座アドレスのヘックスまたはアクティブ・カノンिकल ASCII アカウント・アライス I105 テキストは安全ではない HTTP フィールド値は,そのアカウントでカノニカル・ヘックススペリングを使用します.
- `X-Iroha-Signature`: 厳格なパッドベース64署名用荷.
- `X-Iroha-Timestamp-Ms`:設定された偏差ウィンドウ内のミリ秒で,定番未署名した Unix 年代記号.
- `X-Iroha-Nonce`:プリント可能な ASCII バイト (`0x21` から `0x7e`) 1~256,リプレイウィンドウの中でユニーク.

登録された単鍵コントローラーはこのバイトをサインします:

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

Canonical query 構成は,原始のクエリを解析する `application/x-www-form-urlencoded` (`+` パーセンテージはペアを解読し,それらを配列する `(key, value)`, プロトコルでは最大 64 つの解読されたペアと 64 の解読が認められています. KiB ハッシュボディのバイトは送信されたとおりです.固定32バイトネットワークの間に分離器を挿入しないでください. ID そして大文字の方法

V1 検証機は,解析前にメソッドトークンを32バイット,パーセント暗号化されたリクエスト経路を 64 KiB と直接アカウントアイデンティティを 36 KiB に制限する.アカウント・アライアスは,3つの名前セグメントとそれらの分離者の構造上の制限を強くします. 境界を超えると署名検証またはソースサイズ割り当ての前に認証が失敗します.

マルチシグコントローラが送信する必要があります `X-Iroha-Witness` 厳格なパッドベース64法典として Norito 省略する `X-Iroha-Signature`, `X-Iroha-Timestamp-Ms`, そして `X-Iroha-Nonce`. `X-Iroha-Account` この形式で選択的であり,現時点で証言者と同等である必要があります. `subject_account`. 労働組合 `CanonicalRequestWitnessV1` 含んでいる `schema_version`, `subject_account`, `timestamp_ms`, `nonce`, について Iroha `Hash` 特定のネットワークの要求バイトは体消化を通して,しかし無フレッシュさフィールドは,最大64人のメンバーの署名です. Norito 署名配列なしで同じ有用な負荷をコードする暗号化された証人は 1 と制限されます MiB.

認証ヘッダが提供されない場合,匿名アクセスが選択されます. 部分的,混合,繰り返される,誤った,時代遅れまたは再生された証拠を提示すると,認証は失敗します;それは決して匿名可視化に戻ることはありません.

### 事業者の要求プロトコル {#operator-request-protocol}

オペレーター認証でマークされたルートには,すべての4つのシングルヘッダーが必要です.

- `x-iroha-operator-public-key`:カノニカル Iroha マルチハッシュ公钥.
- `x-iroha-operator-timestamp-ms`:ミリ秒でキャノニカル未署名の Unix 年代記号.
- `x-iroha-operator-nonce`: 1~256つのプリント可能な ASCII バイト,リプレイウィンドウ内のそのキーに特有の.
- `x-iroha-operator-signature`: 厳格なパッドベース64署名用荷.

ヘッダー値は,周囲のホワイトスペースを含まないこと.オペレーターキーサイン:

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

パート,クエリ,ボディ,タイムスタンプ,ノンスルールは,アプリプロトコルで使用される同じ規則です.鍵は `[torii.operator_signatures]` でも入力する必要があります: `allowed_public_keys` にリストするか,ノードキーを使用するときに明示的に `allow_node_key` を有効にします.リプレイキャッシュが飽和すると, Torii は `503 Service Unavailable` で要求を拒否する.オプションの WebAuthn または mTLS オペレーターの認証は追加の要因であり,この正確な要請署名を決して置き換えることはありません.

ISO 20022ルートには,独立した2つのチェックが適用されます.要求は最初にこのオペレーター許可リストと署名プロトコルを通過する必要があります.その後, ISO 管理者は,以下の正確な参加者または監査役割を占めるために同じ鍵を要求します.

### レジャー可視化と探検器カーソル {#ledger-visibility-and-explorer-cursors}

アプリ面のレジーの読み方は,上記のオプションアプリアカウント境界を使用します.署名されていないリクエストは公開に設定されたデータスペックのみを受信します.有効な署名されたリクエストが追加されます.呼び出し者の現在の UAID に結合されたデータ領域,正確な `CanReadRestrictedDataspace { dataspace }` 許可で指定された制限されたデータ領域それぞれ,またはアカウントに `CanReadAllLedgerData`がある場合のすべてのルート.

同様の可視性オブジェクトは,アカウント,ドメイン,アセット定義,アセット, NFT, RWA,ホルダー,およびエクスプローラーを読みます.欠けているオブジェクトと呼び手の可視な経路の外にあるオブジェクトは意図的に区別できない.トランザクションに記録されたすべての経路段が可視である場合にのみ,コミットされたトランザクションと指示履歴が表示されます.したがって,参加者の1つの足が呼び手の範囲外にある場合でも隠されます. 欠落した,時代遅れまたは誤ったルーティングコンテキストはグローバルな読者にしか見えません.

世界でサポートされている6つのExplorerコレクションは,不透明な定規の base64urlキーセットカーサーを使用しています.デフォルトページ制限は 25,最大値は 100,1ページでは最大512の候補鍵を検査します.それぞれのカーソルは,そのコレクション,フィルター,カノニカル最後のキー,そして呼び手の可視なルートセットダイジェストに結びついているので,別のクエリまたは呼び手の可视性の変更後に再生することはできません.

ブロック,トランザクション,最新の取引,指示,および最新指示履歴カーサーは,追加的に約束されたスナップショット高度とブロックハッシュをピッチします.応答では `pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor`,および `pagination.has_more`が暴露されます.Torii は別のルートまたはフィルターセット,変更された可視性消化,またはノードがもはや検証できないスナップショットをカーソルを拒否します.ブロック作業員が実行している間に,履歴スキャンは Torii のクエリ-アドミッション許可の中に残ります.

エクスプローラー WebSocket ストリームはフィルタ化された概要を発信し,レジャー権限が変更されるにつれて可視性を再計算する.ネイティブ `GET /v1/blocks/stream` ルートは異なる:完全な送信をします `CanReadAllLedgerData` を手握り中に要求し,その許可が後に撤回された場合を閉じる.データスペースの探検器のためにネイティブストリームを使用しないでください.

## ISO 20022橋 {#iso-20022-bridge}

Torii は,APP向きの API とブリッジ実行時間が有効である場合, ISO 20022橋を `/v1/iso20022/*`の下に置く. 橋は故意に対象となる:これは一般目的の ISO 20022 クリアングゲートウェイではなく,選択された支払メッセージを署名した Iroha 転送に変換し,そのレジスタンス状態を追跡するためのサポートされているサブセットです.

送信を許可する前に,持続的なローカル `torii.iso_bridge.store_dir` を設定します.構成フィールドは選択的であり,ノードが読み書きのみまたは診断用で起動できます:すべての認証された ISO 送信はディレクトリを必要とし, persistence が欠けているときまたは重複墓石や Rich-Record の書き込みが失敗した場合,リトリーブル`503 Service Unavailable` を返します.

### Torii ISO 20022 終了点 {#torii-iso-20022-endpoints}

|メソッドとエンドポイント|目的|
| --- | --- |
|`POST /v1/iso20022/pacs008`|FI から FI までの顧客信用譲渡を提出し,対応する Iroha 資産譲渡を構成します |
|`POST /v1/iso20022/pacs009`|FI から FI へ, PvP または証券関連キャッシュ資金に使用されたクレジット転送を提出する |
|`POST /v1/iso20022/pacs002`|取引相手の支払い状況報告を提出する決済需要 約束された取引の証拠|
|`POST /v1/iso20022/pacs004`|返済申告書を提出する|
|`POST /v1/iso20022/camt056`|発信者の所有の支払いのキャンセル要請を提出する|
|`POST /v1/iso20022/sese023`|証券決済の指示を提出する|
|`POST /v1/iso20022/sese024`|契約者の所有の証券決済状況に関するメッセージを送信する |
|`POST /v1/iso20022/sese025`|契約者の所有の証券決済確認を提出する |
|`POST /v1/iso20022/colr012`|担保置換のメッセージを送信する|
|`GET /v1/iso20022/messages/{msg_id}`|"つのメッセージのために 橋の記録を読む|
|`GET /v1/iso20022/audit/messages`|誤ったメッセージの監査マニストを読んでください|
|`GET /v1/iso20022/messages/{msg_id}/pacs002`|現在の支払状を `pacs.002` XML と返信する.|
|`GET /v1/iso20022/messages/{msg_id}/pacs004`|`pacs.004` XML として現行決済申報を提出する.|
|`GET /v1/iso20022/messages/{msg_id}/camt029`|現行のキャンセル解像度を `camt.029` XML に返します.|
|`GET /v1/iso20022/messages/{msg_id}/sese024`|現在の決済状態を `sese.024` XML と返信する.|
|`GET /v1/iso20022/messages/{msg_id}/sese025`|現行の決済確認を `sese.025` XML と返信する.|

`pacs.008` 提出はメッセージを提供しなければならない ID, 銀行間決済金額,通貨,決済日期,債務者と債権者 IBANs, 債務者と債権者 BICs. 参照データが設定された場合,ブリッジはまた BIC, IBAN, そして ISO 製造された取引がパイプラインに入る前に 4217つの通貨交差点があります.

`pacs.009`の提出には,ビジネスメッセージ ID,メッセージ定義 ID,作成時間,銀行間決済金額,通貨,決済日期が含まれます.指示する代理人 BICs,債務者および債権者 IBANs.メッセージに `Purp`が含まれている場合,橋は現在証券目的の資金のみを受け入れます: `Purp=SECU`.

`pacs.008`および `pacs.009`の送信エンドポイントは, XML ISO 封筒または橋試験で使用されるフラットフィールドフォーマットを受け入れます.オプションの `SplmtryData` フィールドは,ターゲット Iroha 本簿に固定することができます.ソース・ターゲットアカウント IDs またはアドレス,および資産定義 ID.回答は `202 Accepted` で `message_id`, `transaction_hash`, `status`, `pacs002_code` と解決された本簿/口座/資産文脈である.

### 参加者の承認とライフサイクル所有権 {#participant-authorization-and-lifecycle-ownership}

各橋には 参加者のカタログがあります. 各参加者エントリには,ユニークな参加者 ID,オペレーターの公钥または複数の鍵,金融識別子の1つまたは複数があります.許可されたプロフィールセット,および `originator`, `counterparty`,または両方の役割. オペレーターキーと金融識別子は1人以上の参加者に属してはならない. `audit_admin_keys`を別々に設定する.監査管理鍵は,参加者変異鍵でもあり得ません.

全員 ISO 航路には新しいオペレーターの署名が必要. `pacs.008`, `pacs.009`, `sese.023`, または `colr.012` 提出,認証されたオペレーターは,アプリケーションヘッドで識別された参加者に属しなければならない. `From` 財政的アイデンティティ `To` 構成された参加者にアイデンティティが解決しなければならない `counterparty` 継続的な入学記録は,原始人,相手方,参加者とオペレーターキー,およびオリジナルのプロフィールと埋め込み署名ポリシーを承認する.

ライフサイクルの認証は,呼び出し者によって選択された値ではなく,その不変な記録から得られます.

|ライフサイクルメッセージ|必要な参加者|
| ---------------------------------------------- | -------------------------------------------------- |
|`pacs.002`, `pacs.004`,`sese.024`, `sese.025` |`counterparty`の役割を持つ元の相手方 |
|`camt.056`|`originator`の役割を担う原作者 |

オリジナルのプロフィールと署名方針は,全体に固定されているアップデートには,より弱いプロフィールを選択することはできません. `pacs.002` 決済を表示するコード (`ACSC`, `ACCP`, `SETT`, または `SETTLED`) は,元の記録を決済に変更するのは Torii 取引の証拠を約束した.

オリジナルの当事者は,そのメッセージ記録と生成されたアウトボックス文書を読み取ることができます. 監査エンドポイントは,認証された参加者が原始者または相手方であるレコードのみが返されます.別々に構成された監査管理者は,全世界の読み込みのみの監査視点を受信し,メッセージを送信または変更することはできません.未知参加者や関連のないメッセージ識別子は公開されません.

### 耐久性リプレイ アイデンティティと署名されたアウトボックスドキュメント {#durable-replay-identity-and-signed-outbox-documents}

Torii は読み取れない,大きすぎる,歪んだ,誤って命名された,矛盾する,または明示的に互換性のない墓石の起動を停止します.また,明示的に互換性のないスキーマバージョン,現在の構成から欠けている参加者,プロフィール,署名ポリシー,または欠落したまたは不一致するライブ墓石の豊富なレコードのために中絶します.

他のリッチ・レコードのダメージは異なる方法で処理されます:読み取れないまたは大きすぎるファイル,無効な JSON,無効な現在のスケーム記録,非正規的なファイルの名前,および矛盾するリプレイアイデンティティをログアップするかスキップします.保存された記録から読み取れないまたは無効な現在のバージョンの監査指標が再生される.ただ単に明示的に互換性のない監査指標バージョンだけが起動を中止する.起動ログをモニタリングして 再現された監査マニストを調整する代わりに,すべての破損したリッチレコードファイルがノードがサービスするのを妨げると仮定します.

各保存された富裕な記録は 参加者の起源を保持しています. 別々の耐久的な墓石はメッセージを保持します ID, バイトロードハッシュ,ビジネスメッセージ ID, そして UETR 完全な減倍のために TTL 富裕な記録の詳細が切断された後でも

Torii はライフサイクルのメッセージを署名または処理する前に再再生入口を維持します. 未期限の再プレイアイデンティティを決して排除しません. 設定容量が設定されている場合完全に保護された記録または未期限のリプレイアイデンティティに占められている場合,送信は生命周期や会計状態を変異させずに復元可能な `503 Service Unavailable` を受信します.

創られたもの `pacs.002`, `pacs.004`, `camt.029`, `sese.024`, または `sese.025` ドキュメントは返品として `application/xml` これらの応答ヘッダーで:

|タイトル|意味|
| ------------------------------ | ----------------------------------------------------- |
|`X-Iroha-Iso-Signature-Domain`|いつでも `iroha.iso20022.outbound.v2`|
|`X-Iroha-Iso-Signer`|設定されたブリッジサインの Canonical public key|
|`X-Iroha-Iso-Signature`|域分別された XML バイト上のBase64署名|

UTF-8 バイト配列 `iroha.iso20022.outbound.v2`,1 0 バイト,そして正確な応答ボディの署名を確認する.検証前に XML を再フォーマットまたは正常化しないでください.

### パーサーとマッピングのサポート {#additional-parser-and-mapping-support}

IVM ISO ヘルパーはまた,封筒認証,決済マッピング,または下流和解のために以下のメッセージファミリーを検証し,実現します.それらは独立した Torii ルートを持っていません.

|メッセージファミリー|現在の支援 |
| --- | --- |
|`head.001`| ビジネスアプリケーションヘッダの検証 ISO 封筒を含む `BizMsgIdr`, `MsgDefIdr`, 作成時間,およびオプションの送信者/受信者 BIC フィールド |
|`pacs.007`, `pacs.028`, `pacs.029` |支払いの逆転,ステータス要求,調査解析/ステータス解析|
|`pain.001`, `pain.002` |顧客による支払い開始と支払状況報告の検証 |
|`camt.052`, `camt.053`, `camt.054` |口座報告,申告および通知の検証|

## Kaigi セッション {#kaigi-sessions}

Kaigi は SORA Nexus で有料でリアルタイムのオーディオ/ビデオルームを提供します.アプリケーションがレジャーサポートされたセッション作成,リスト変更,リレーマニフェスト,暗号化されたシグネリング,および使用計測を必要とする場合は,すべての会議状態をオフチェーンにしておく代わりに使用してください.

本書面の生命周期は:

- `CreateKaigi`:ドメインの下での呼び出しを作成し,そのポリシー,スケジュール,メタデータ,およびオプションリレーマニストを保存します.
- `JoinKaigi`と `LeaveKaigi`:呼び出しリストを更新する.プライベートモードでは,参加者が直接参加者のアカウント IDs を暴露するのではなく,コミットメント,無効化,およびレスタの証明を使用します.
- `RecordKaigiUsage`:計測期間とガス総額を追加する.
- `EndKaigi`:セッションを終了し,最終的なタイムスタンプを記録します.

Torii リレーテレメトリを暴露する `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, そして `/v1/kaigi/relays/events` アップが API テレメトリ機能が有効です Kaigi ドメインイベントなど `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated`, そして `KaigiUsageSummary`.

### CLI 煙の検査 {#cli-smoke-test}

始めましょう `iroha kaigi` CLI 確認したい場合 Torii エンドポイントは, Kaigi 接続前の取引 UI. 速 start コマンドは,アクティブに対して一時的な部屋を作成します. Torii エンドポイントと呼び出し識別子を含む要約をプリントし,コマンドに参加する. SoraNet スロールヒント:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

スクリプトフローの場合,部屋のライフサイクルを明示的に管理します:

```bash
iroha kaigi create \
  --domain streaming \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha kaigi join --domain streaming --call-name daily --participant <i105-account-id>
iroha kaigi leave --domain streaming --call-name daily --participant <i105-account-id>

iroha kaigi record-usage \
  --domain streaming \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha kaigi end --domain streaming --call-name daily
```

`--room-policy public` を視聴者チケットなしでリレーが暴露できる部屋,または `--room-policy authenticated` の出口で視聴者の認証が必要とする場合で使用します. 放送後のみ `--privacy-mode zk-roster-v1` を使用してください.ネットワークには Kaigi のリストと使用確認キーが設定されている.そうでない場合,決定的な検証中に接続,葉やプライベート利用記録が失敗する.

### JavaScript デモでテスト {#testing-with-the-javascript-demo}

活用する [soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) エレクトロンとVue アプリケーションで,直接通信する Torii 地方の `@iroha/iroha-js` 拘束力があり, `/kaigi` ブラウザネイティブの1対1メディアへのルート

Iroha ソースリポジトリから[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js)とのデモを使用します. デモピンは SDK から `file:../iroha/javascript/iroha_js` まで,この兄弟レイアウトで両方のチェックアウトを保持してください:

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

使用 Node.js 20またはそれ以上の新しいもの Rust ツールチェーンののでネイティブ `iroha_js_host` モジュールは構築することができます. SDK 兄弟の内 Iroha ソースを変更した後にチェックアウトする. クリーンパッケージのレイアウトには, `npm run build:native`.

制御試験では,デモを Kaigi - 対応する Torii エンドポイントに指す.

1. SORA/Kaigi アプリに向き合う APIs を有効にして Iroha ノードを起動するか,必要な Kaigi 表面を暴露する公開エンドポイントを使用します.
2. `/health`で基本的なアクセス可能性を確認し,その後 `/openapi`または `/openapi.json`で直路表面をチェックする.一部の部署では `/v1/health`も暴露されるが, `/health`はポータブルライフリティのチェックである.
3. TAIRA では,ライブミーティングを試す前に,リレーテレメトリ路線を確認する.

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

これらのチェックは, Torii および Kaigi リレーテレメトリがアクセス可能であることを証明する.彼らは会議を作成しない; `CreateKaigi`と `JoinKaigi`には依然として資金調達財布と署名された取引の提出が必要です.
4. デモを開け,設定に移動し,セット Torii URL, そして,アプリが鎖を読み込むように ID 端点からネットワークプレフィックス.
5. デモで2つのローカルウォレットを作成または復元します. 別々のアプリウィンドウ,プロフィール,またはマシンを使用してホストとゲストが別々のウォレット状態を持つようにします.

Kaigi UI をテストするには:

1. ホストウィンドウで Kaigi を開き,会議開始を選択し,タイトルを設定し,Private invite または Transparent invite を選択します.
2. カメラとマイクをオンにすると WebRTC にローカルメディアがある.
3. 会議リンクを作成する を選択します. ライブウォレットで `CreateKaigi` が送信され,アプリでは `iroha://kaigi/join?call=...&secret=...` の招待状と `#/kaigi?...` のバックパスが表示されます.
4. ゲストの窓を開いて招待状をゲストと共有してください.
5. ゲストウィンドウで,招待状を開くか参加ミーティングに貼り付けて,ローカルメディアをオンにし,参加ミーティングを選択します. ライブウォレットでは Torii から暗号化されたホストオファーを取得し,暗号化された回答メタデータとともに `JoinKaigi` を送信します.
6. ホストは Kaigi 呼び出し信号をストリーミングまたはアンケートすることによって,最初の答えを自動的に適用する必要があります.両方のウィンドウには接続されたメディアと更新された接続詳細が表示されます.
7. ホストからセッションを終了するか,同じ呼び出し ID に関する CLI `iroha kaigi end` コマンドを使用してください.

プライベート Kaigi は,私的なエントリーポイント料金を支払うために保護された XOR の必要性があります. デモが私的な Kaigi が保護された XOR の必要性を報告している場合は,アプリ内自保護のプロンプトを使用し,作成または加入アクションを再試してください.証拠生成,個人資金提供,またはライブシグネリングが利用できない場合,デモは透明/手動流に戻ることができます.その場合は,先端シグネレーションを開いて,原稿のオファーや回答パケットをコピーし,他のウィンドウにペストします.

デモレポの自動チェックについては,次の手順を実行します.

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

集中したVitest スイートは Kaigi ミーティングリンク作成,コンパクトインビート読み込み,プライベートクリエイト/ジョイント/エンドブリッジ通話,セルフシールドプロンプト,マニュアルフォールバック,回答アンケートを含む. UI 煙のテストにはデスクトップおよびモバイルサイズビューポートでの `/kaigi`ルートが含まれています.2つの財布間のライブメディアは,ブラウザカメラ/マイクフォン権限とピア・メディアストリームが環境特有のため,まだ手動の2窓テストが必要である.

サンプル統合コードについては, [Embed Kaigi in a JavaScript App](/ja/guide/tutorials/kaigi.md) を参照してください.

## 状況と指標 {#status-and-metrics}

ステータスとメトリックのエンドポイントはダッシュボードに最初に接続されます

- `/status`はトップレベルのピア,ブロック,キュー,コンセンサスフィールドを暴露します
- `/metrics`はプロメテウスカウンター,計量器,およびヒストグラムを暴露します

Nexus が有効なノードでは,ステータス出力にはレーンとデータスペース意識のセクションも含まれます. `nexus.enabled = false`の場合,これらのセクションは省略されます.

## JSON 対 Norito {#json-vs-norito}

複数のオペレーターエンドポイントはデフォルトで Norito を返信します.エンドポイントが JSON をサポートする場合は,送信してください:

```http
Accept: application/json
```

これは特に:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

エンドポイントが入力を受け取り,返却するときに Norito 直接,使用 `application/x-norito` コンテンツタイプまたは優先順位として `Accept` 価値について [Norito](/ja/reference/norito.md#torii-and-norito-rpc) 輸送の詳細については

## テレメトリプロフィール {#telemetry-profiles}

エンドポイントの可視性は,ノードの `telemetry.profile` 設定に依存する.現在の構成では,5 つのプロフィールレベルを暴露します:

|プロフィール |`/status`|`/metrics`|開発者経路|
| --- | --- | --- | --- |
|`disabled`|いいえ|いいえ|いいえ|
|`operator`|ええ|いいえ|いいえ|
|`extended`|ええ|ええ|いいえ|
|`developer`|ええ|いいえ|ええ|
|`full`|ええ|ええ|ええ|

## CLI ショートカット {#cli-shortcuts}

`iroha` CLI は既にこれらのエンドポイントの多くを包んでいる.

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## 上流参照 {#upstream-references}

- [README API および観測可能性の概要](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO 20022 橋の実施](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [性能と指標](/ja/guide/advanced/metrics.md)
