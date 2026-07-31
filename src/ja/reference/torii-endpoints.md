---
translation_locale: ja
translation_source: /reference/torii-endpoints.md
translation_source_hash: 6ee65d409642c79bea0f2c4ff0d8cd59b0ec0a29e115225045786d0816e8a6a7
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
| --- | --- | --- |
|`POST /transaction`|Norito|署名された取引を提出する|
|`POST /query`|Norito|署名した問い合わせを提出する|
|`GET /events`|WebSocket|イベントストリームを登録する |
|`GET /block/stream`|WebSocket|ストリームコミットブロック|
|`GET /peers`|JSON|Torii によって暴露された同級者リスト|
|`GET /health`|JSON|軽量寿命の終点|
|`GET /api_version`|JSON|既定バージョン API |
|`GET /status`|JSON|事業者の高いレベルの状況概要 |
|`GET /metrics`|プロメテウス |プロメテウススラップエンドポイント|
|`GET /schema`|JSON|ノードが提供するデータモデルスケーマスナップショット|
|`GET /openapi` または `GET /openapi.json` |JSON|OpenAPI 文書は,アクティブの Torii HTTP ルートについてです |
|`GET /v1/parameters`|JSON|ノードパラメータのスナップショット|
|`GET /v1/node/capabilities`|JSON|ノード能力とデータモデルメタデータ|
|`GET /v1/api/versions`|JSON|サポートされた Torii API バージョン|
|`GET /v1/events/sse`|SSE|長期間の顧客のためのイベントストリーム|
|`GET /v1/time/now`|JSON|ノード壁時計のインシュート|
|`GET /v1/time/status`|JSON|時間同期状態 |

`/openapi` は実行ノードの権威あるエンドポイントリストである.正確な表面はビルド機能と実行時間の設定に依存しているため,生成されたクライアントは手書きコピーされたルートリストよりもライブ OpenAPI 文書を好むべきである.[Torii API コンソール](/ja/reference/torii-api-console.md) を使用して,そのライブドキュメントをロードし, JSON ルートをテストし, curl リクエストをコピーし,現在のスキーマからクライアントコードを生成します.

## Taira 経路を試す {#try-live-taira-routes}

公衆 Taira テストネットが同じものを暴露する Torii JSON アプリケーション クライアントが読み込みのみの探索のために使用する表面.これらのコマンドにはキーが必要ではありません:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS "$TAIRA_ROOT/v1/node/capabilities" \
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

|経路ファミリー|目的|
| --- | --- |
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
|`/v1/connect/`, `/v1/vpn/` | Iroha 接続セッション WebSocket 輸送 VPN セッション,プロフィール,領収 |
|`/v1/app-api/`, `/v1/api/`, `/v1/content/*` |App API 結合とバンドル/CID サポートされたコンテンツルーティング|
|`/v1/operator/*`, `/v1/mcp` |オペレーターの認証とネイティブ MCP JSON-RPC ブリッジ|
|`/v1/offline/`, `/v1/repo/`,`/v1/space-directory/`, `/v1/ram-lfe/` |オフラインの準備,リポジトリ契約,データスペースマニフェスト,および [RAM-LFE 支援者](/ja/blockchain/ram-lfe.md#torii-routes) |
|`/v1/kaigi/`, `/v1/webhooks/`,`/v1/notify/`, `/v1/telemetry/` |協働,Webhook,プッシュ通知,およびライブテレメトリ統合|

## ISO 20022橋 {#iso-20022-bridge}

Torii は,APP向きの API とブリッジ実行時間が有効である場合, ISO 20022橋を `/v1/iso20022/*`の下に置く. 橋は故意に対象となる:これは一般目的の ISO 20022 クリアングゲートウェイではなく,選択された支払メッセージを署名した Iroha 転送に変換し,そのレジスタンス状態を追跡するためのサポートされているサブセットです.

### Torii ISO 20022 終了点 {#torii-iso-20022-endpoints}

|メソッドとエンドポイント|目的|
| --- | --- |
|`POST /v1/iso20022/pacs008`|FI から FI までの顧客信用譲渡を提出し,対応する Iroha 資産譲渡を構築します |
|`POST /v1/iso20022/pacs009`|FI から FI へ, PvP または証券関連キャッシュ資金に使用されたクレジット転送を提出する |
|`POST /v1/iso20022/pacs002`|支払状の報告を提出する|
|`POST /v1/iso20022/pacs004`|決済申報を提出する|
|`POST /v1/iso20022/camt056`|支払いをキャンセルする請求を提出します|
|`POST /v1/iso20022/sese023`|証券決済指示を提出する |
|`POST /v1/iso20022/sese024`|証券決済状況のメッセージを送信する|
|`POST /v1/iso20022/sese025`|証券決済の確認を提出する|
|`POST /v1/iso20022/colr012`|担保置換のメッセージを送信する|
|`GET /v1/iso20022/messages/{msg_id}`|"つのメッセージのために 橋の記録を読む|
|`GET /v1/iso20022/audit/messages`|偽造性のあるメッセージの監査マニストを読んでください|
|`GET /v1/iso20022/messages/{msg_id}/pacs002`|現在の支払状を `pacs.002` XML と返信する.|
|`GET /v1/iso20022/messages/{msg_id}/pacs004`|`pacs.004` XML として現行決済申報を提出する.|
|`GET /v1/iso20022/messages/{msg_id}/camt029`|現行のキャンセル解像度を `camt.029` XML に返します.|
|`GET /v1/iso20022/messages/{msg_id}/sese024`|現在の決済状態を `sese.024` XML と返信する.|
|`GET /v1/iso20022/messages/{msg_id}/sese025`|現行の決済確認を `sese.025` XML と返信する.|

`pacs.008` 提出はメッセージを提供しなければならない ID, 銀行間決済金額,通貨,決済日期,債務者と債権者 IBANs, 債務者と債権者 BICs. 参照データが設定された場合,ブリッジはまた BIC, IBAN, そして ISO 製造された取引がパイプラインに入る前に 4217つの通貨交差点があります.

`pacs.009`の提出には,ビジネスメッセージ ID,メッセージ定義 ID,作成時間,銀行間決済金額,通貨,決済日期,指示および指示された代理人 BICs,および債務者と債権者 IBANs が記載されなければならない.メッセージには `Purp`が含まれている場合,ブリッジは現在証券目的のための資金のみを受け入れます: `Purp=SECU`.

労働組合 `pacs.008` そして `pacs.009` 提出のエンドポイントは受け入れます XML ISO ブリッジ試験で使用された封筒または平面フィールド形式.オプション `SplmtryData` フィールドは標的を固定することができます Iroha 本書,ソースとターゲット口座 IDs またはアドレス,および資産定義 ID. 答えは `202 Accepted` と `message_id`, `transaction_hash`, `status`, `pacs002_code`, 解決された本帳/口座/資産の文脈.

### パーサーとマッピングのサポート {#additional-parser-and-mapping-support}

IVM ISO ヘルパーはまた,封筒認証,決済マッピング,または下流和解のために以下のメッセージファミリーを検証し,実現します.それらは独立した Torii ルートを持っていません.

|メッセージファミリー|現在の支援 |
| --- | --- |
|`head.001`| ビジネスアプリケーションヘッダの検証 ISO 封筒を含む `BizMsgIdr`, `MsgDefIdr`, 作成時間,およびオプションの送信者/受信者 BIC フィールド |
|`pacs.007`, `pacs.028`, `pacs.029` |支払いの逆転,ステータス要求,調査解析/ステータス解析|
|`pain.001`, `pain.002` |顧客による支払い開始と支払状況報告の検証 |
|`camt.052`, `camt.053`, `camt.054` |口座報告,説明書,通知の検証|

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

`--room-policy public` を視聴者チケットなしでリレーが露出できる部屋,または `--room-policy authenticated` の出口で視聴者の認証が必要とする場合で使用する.ネットワークに Kaigi リストと使用確認キーが設定された後のみ, `--privacy-mode zk-roster-v1` を使用する.決定的検証中に結合,葉やプライベート利用記録が失敗する.

### JavaScript デモでテスト {#testing-with-the-javascript-demo}

活用する [soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) エレクトロンとVue アプリケーションで,直接通信する Torii 地方の `@iroha/iroha-js` 拘束力があり, `/kaigi` ブラウザネイティブの1対1メディアへのルート

Iroha ソースリポジトリから[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)とのデモを使用します. デモピンは SDK から `file:../iroha/javascript/iroha_js` まで,この兄弟レイアウトで両方のチェックアウトを保持してください:

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

エンドポイントの可視性は,テレメトリ設定に依存する.上流文書では,5つのプロフィールレベルを記述します:

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

- [README API および観測可能性の概要](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 橋の実施](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [性能とメトリック](/ja/guide/advanced/metrics.md)
