---
translation_locale: ja
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 96ca67b9bbf9d743de2f640e09487176f62a8a31052e4f1e15e15a771e985c48
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Taira と Minamoto で SORA Nexus 向けアプリケーションを開発する {#build-on-sora-3-taira-and-minamoto}

SORA Nexus は Iroha 3 を基盤としています。まず Taira でアプリケーションを開発・テストします。同じクライアント設定を Minamoto に移すのは、メインネット専用の鍵、手数料に使う実際の XOR、本番運用の承認がそろってからにしてください。

このガイドでは、SORA Nexus の 2 つの公開ネットワークに接続する Iroha クライアントの設定方法を説明します。

- Taira のテストネットは `https://taira.sora.org` にあります
- Minamoto メインネットは `https://minamoto.sora.org` にて

統合テスト、テストネット資金でのライトキャナリー、デプロイリハーサルには Taira を使用してください。製品準備が整ったメインネットの活動には Minamoto のみを使用してください。両方のネットワークは XOR で手数料を請求します。

- Taira は、パブリックテストネット資金提供サービスからテストネット XOR を使用します。
- Minamoto は実際の XOR を使用します。Minamoto のテストネット資金提供サービスはありません。

## ビルダーパス {#builder-path}

|ステップ| Taira テストネット| Minamoto メインネット |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|ネットワーク状態の読み取りを開始|キーなしのクエリ `/status`| 先にエンドポイントと TLS 証明書を確認する |
|データスペースを選択してください|アプリが独自の管理されたデータスペースを必要としない限り、パブリック`universal`を使用してください|メインネットの承認後にのみ同じデータスペースを使用してください|
| 手数料資産を取得 | 公開 Taira の faucet を使用 | 資金提供済みの Minamoto アカウントまたは承認済みのトレジャリー経路から XOR を受け取る |
| 書き込みをテスト | faucet で取得した testnet XOR を使用 | テスト用ツールを使わない。書き込みでは実際の XOR を消費する |
|促進する|リトライロジック、監視、および暗号署名処理を維持する|別々の鍵、資金、リリース管理を使用してください|

実際の流れは次のとおりです：

1. Taira を接続先としてクライアントを開発し、公開の `universal` データスペースを使います。
2. 暗号署名者を追加し、Taira テストネット資金提供サービスで資金を提供します。
3. 障害が退屈で観察可能になるまで、Taira に対してアプリのロジックを実行してください。
4. 別の Minamoto 暗号署名者を作成し、それに実際の XOR を資金として供給し、検証済みの操作のみをメインネットに移動してください。

## 料理本を続ける {#continue-with-the-cookbook}

このガイドを使用してネットワークを選択し、暗号署名者を設定し、手数料に資金を供給してください。その後、構築したいアプリケーションの動作に合ったレシピを続けてください:

|ゴール|レシピ|
| --- | --- |
| 確認 Taira クライアントを設定する | [Taira に接続する](/ja/cookbook/connect-to-taira.md) |
|最初に書き込みを行い、その結果を確認してください| [取引を提出して確認する](/ja/cookbook/submit-and-verify-transactions.md) |
|登録、発行、そして価値を移動する| [代替可能資産](/ja/cookbook/fungible-assets.md) |
|フィルタリングされたアプリケーション状態を読み取る| [ブロックチェーン台帳の状態を照会する](/ja/cookbook/query-ledger-state.md) |
|確定した変更に反応する| [ストリームイベント](/ja/cookbook/stream-events.md) |

このクックブックは各ワークフローの焦点を維持し、必要に応じてここに戻って Taira の資金や SORA Nexus のネットワークコンテキストにリンクします。

## 1. 設定しているものを理解する {#_1-understand-what-you-are-setting-up}

SORA Nexus では、データスペースカタログがデータスペースを定義します。レーンは、別のレーンカタログで定義されます。各レーンは一つのデータスペースを参照し、一つのデータスペースに複数のレーンを含めることができます。クライアントの `client.toml` を変更するだけでは、新しい公開データスペースは作成されません。クライアントの設定では、次の二つを行います。

1. クライアントを正しい Torii エンドポイントに向ける
2. 正規のアカウントに対応するネットワークコンテキストと署名鍵を選択する

`AccountId` は常に正規の識別子で、ドメインを含みません。`client.toml` にドメイン設定はなく、`[account].profile` が選択するのはネットワークの I105 接頭辞だけです。ドメインのコンテキストは、エイリアスとドメインが所有するオブジェクトに属します。多くのアプリケーションでは、公開の `universal` データスペースから始めてください。ドメインのコンテキストは、例えば次のような `domain.dataspace` 形式を使います。

```text
wonderland.universal
```

組織用の新しいデータスペースが必要な場合は、通常のクライアントアカウントから登録しようとせず、カタログとルーティングの提案を準備してください。後述の[新しいデータスペースを用意する](#_8-provision-a-new-dataspace)を参照してください。

## 2. 公開 Torii エンドポイントを確認する {#_2-check-the-public-torii-endpoint}

`curl` と `jq` を使って Taira テストネットの状態を確認します。鍵やローカルノードは不要です。

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

ノードが公開するデータスペースとレーンの情報を確認します。

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Minamoto を利用する前に、運用担当者にメインネットのエンドポイントを確認し、TLS 証明書がホスト名と一致することを確かめてください。

## Taira MCP エージェント用 {#taira-mcp-for-agents}

Taira は、エージェントソフトウェアランタイム向けに Torii ネイティブのモデルコンテキストプロトコル (MCP) ブリッジも公開します。エージェントがカスタム Torii クライアントを最初に構築せずに、ライブのテストネット読み取り、スクリプト化された診断、または厳密にレビューされた書き込みリハーサルを行う必要がある場合に使用してください。

|設定|価値|
| --- | --- |
| MCP エンドポイント | `https://taira.sora.org/v1/mcp` |
|ネットワークルート| `https://taira.sora.org` |
|意図された使用|Taira テストネットの読み取りとテストネット資金提供による書き込みリハーサル|
| 本番環境での対応 | メインネットの MCP エンドポイントとリリース管理が明示的に承認されるまで、この項目を Minamoto に向けないでください |

このブリッジは、ステートレスな JSON-RPC の `POST` リクエストだけを受け付けます。署名用の情報を追加する前に、探索用メタデータを確認してください。

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
```

エージェントソフトウェアランタイムで URL をユーザーローカルの MCP サーバーとして構成します。エージェント MCP の設定、API トークン、転送認証ヘッダー、`authority`、または `private_key` の値を、このドキュメントリポジトリやアプリケーションリポジトリにソース管理として保存しないでください。

Taira でうまく機能するエージェントプロンプトのルール：

- 呼び出す前に MCP サーバーのツールを確認してください；サーバーが`listChanged`を報告した場合は再確認してください。
- 生の`torii.*`ツールよりも、キュレーションされた`iroha.*`ツールを好んでください。
- 読み取り専用で開始：書き込みを提案する前に、ステータス、アカウント、資産、エイリアス、ブロック、ガバナンス状態、およびトランザクションステータスを確認してください。
- ライブテストネットの変更を行う前に、明示的な人間の指示を要求してください。事前署名済みのトランザクションデータコンテナには、`iroha.transactions.submit_and_wait` を使用して、エージェントが送信するだけでなく結果を待つようにしてください。
- エージェントの応答で、取引の暗号ハッシュ、最終ステータス、およびサーバーの検証エラーを要約してください。

### エージェントを使った開発ワークフロー {#development-workflow-with-agents}

Iroha クライアント、トランザクションビルダー、診断スクリプト、テストネット実行用マニュアルの開発支援としてエージェントを使用します。エージェントの認可プリンシパルは限定的に維持してください:コードを検査し、Taira の状態を読み取り、変更を提案し、ローカルテストを実行することはできますが、人間が正確な操作を承認するまではライブネットワークを変更してはいけません。

実用的なワークフローは次の通りです:

1. エージェントにコードを書く前に、関連するドキュメント、SDK コード、CLI コマンド、または MCP ツールスキーマを確認するよう依頼してください。
2. エージェントに、最小のクライアントパスを最初に書かせる：ステータス確認、アカウント検索、エイリアス解決、または残高確認。
3. トランザクション構築コードは、読み取り専用の リクエストが Taira に対して機能するようになった後にのみ追加してください。
4. ライブネットワークのテストはオプトインのままにしておきます。例えば `TAIRA_LIVE=1` の背後で、通常のユニットテストの実行ではテストネットの資金を消費したり、ネットワークの可用性に依存したりすることがないようにします。
5. エージェントがトランザクションを提出する前に、ネットワークリート、チェーン、認証のプリンシパルアカウント、指示の概要、手数料資産、および予想される状態の変化を報告するよう要求する。
6. 生成されたコードを、CI またはメインネットワークのワークフローに昇格させる前に、秘密情報の処理、リトライ動作、冪等性、拒否処理について確認してください。

開発のための便利な読み取り専用 MCP ツールには、アカウント資産の照会、エイリアスの解決、ブロック照会、トランザクション照会、トランザクションリスト、ソフトウェア処理ワークフローのステータス確認などがあります。署名済みのペイロードを送信する前に、これらを使用して信頼性を高めてください。

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### 代理店を通じた取引のワークフロー {#transaction-workflow-through-agents}

MCP ブリッジは署名済みの Iroha トランザクションを送信できますが、通常のトランザクションの要件を取り除くものではありません。トランザクションには依然として正しい認可主体、権限、手数料の資金、チェーンID、メタデータ、および署名が必要です。

生の Iroha 取引については、まず SDK または CLI で取引データコンテナを構築および署名し、その後エージェントには正規のものだけを渡してください署名済みトランザクションのバイトは`body_base64`としてエンコードされます。エージェントは`iroha.transactions.submit_and_wait`でデータコンテナを送信することも、`iroha.transactions.submit`で送信し`iroha.transactions.wait`でポーリングすることもできます。

秘密鍵をエージェントのプロンプトに貼り付けないでください。エージェントがトランザクションを作成する必要がある場合は、ユーザーのソフトウェア実行環境から秘密を読み込むローカルコードを指し示してください。環境、キーチェーン、ハードウェア暗号署名者、または無視されたテストネットの設定ファイル。エージェントはキー素材をMarkdown、テスト成果物、ログ、または最終化に書き込むべきではありません。

取引を提出する前に、エージェントに短い取引計画を作成させてください：

- `network`： Taira テストネットのルートとチェーンID
- `authority`：手数料に署名して支払うアカウント
- `instructions`: 登録、発行、破棄、譲渡、メタデータ、権限、または契約技術呼び出しの概要
- `fee asset`： Taira に請求される資産
- `preflight reads`: アカウント、資産残高、権限、エイリアス、またはブロックの確認はすでに実行済みです
- `expected result`: 確認後に表示されるべき状態
- `idempotency`: 同じリクエストが再試行された場合、何が起こりますか

提出後、エージェントを終了ステータスになるまで待機させ、次に読み取りクエリで状態変更を確認します。役立つ完了レポートには次の項目が含まれます。

- 取引暗号ハッシュ
- 端末のステータス、例えば `Committed`、`Applied`、`Rejected`、または `Expired`
- 利用可能な場合はブロックまたはエクスプローラーの詳細
- 検証読取結果
- 拒否メッセージと、失敗が権限、料金、検証、古い状態、または エンドポイントの可用性のいずれに見えるか

例の保護されたプロンプト：

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

署名付きデータコンテナがすでに用意されている場合:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP をパブリックテストネットのコントロールサーフェスとして扱います。Taira キー、テストネット XOR、テストネット資金提供サービスアカウント、およびカナリア暗号署名者は使い捨てであり、Minamoto キーおよび本番リリースワークフローとは分けておく必要があります。

## 今すぐ試せるおもちゃの例 {#toy-examples-you-can-try-now}

以下の例では、アカウントの鍵を使わずに Taira のデータを読み取ります。

Taira のすべてのレーンを、そのデータスペースと可視性とともに一覧表示します：

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | select(.visibility == "public")
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

ダッシュボード、ボット、またはデプロイメントチェック用に、非常に小さな Node.js ステータスプローブを作成する:

```bash
node --input-type=module <<'EOF'
const response = await fetch('https://taira.sora.org/status', {
  headers: { Accept: 'application/json' },
});
if (!response.ok) throw new Error(`Taira HTTP ${response.status}`);
const status = await response.json();
const publicLanes = status.teu_lane_commit
  .filter((lane) => lane.visibility === 'public')
  .map((lane) => `${lane.alias}@${lane.dataspace_alias}:${lane.block_height}`)
  .join(', ');
console.log(`Taira: ${status.blocks} blocks, ${status.queue_size} queued, public lanes ${publicLanes}`);
EOF
```

最初の小さな書き込み例には、Taira faucet への請求を使用します。これは testnet XOR を使用するため、Minamoto を決して参照させないでください。

## 3. Taira クライアント設定を作成する {#_3-create-a-taira-client-config}

まだキーペアを持っていない場合は、キーペアを生成してください：

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

`taira.client.toml`を作成する:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

最上位の `chain` は Taira の正確なトランザクションチェーン ID であり、`network_id` はすべての署名が結び付けられる正確なネットワーク識別子です。`network_id` と `network_id_file` は、どちらか一方だけを設定してください。`[account].profile = "taira"` は、これらとは独立して Taira の I105 チェーン識別値を選択します。チェーン ID はアカウントプロファイルを選択しません。

読み取り専用チェックを実行する:

```bash
iroha --config ./taira.client.toml ledger domain list --limit 5
```

書き込みテストの前に、公開 Taira の診断を実行してください。

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

手数料が発生する書き込みを行う前に、フォーセットから Taira アカウントに資金を供給してください。事前準備を伴うフォーセットの手順は、[Taira でテストネット XOR を取得する](#_4-get-testnet-xor-on-taira)に記載されています。

アカウントに資金が入った後は、任意の書き込みスモークテストとして、署名付きのログ命令を使えます。送信するすべてのトランザクションは手数料支払者を明示し、CLI は署名前に正確な手数料を見積もります。

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

このコマンドは確認を待ちます。Taira は公開テストネットなので、フォーセット自体が動作していても、キューの飽和によって ping が失敗する場合があります。`taira doctor` がキューの飽和を報告する場合や、ping が `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` を返す場合は、クライアント設定の誤りと判断する前に、しばらく待って再試行してください。

無人でスモークテストを行う場合は、回数を制限した再試行ループで ping を実行します。

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

もし`iroha taira doctor`がハードフェイルを示した場合、再試行を停止してください。キューの飽和や手数料による受け入れ拒否は一時的なパブリックテストネットの状況です；DNS、TLS、または`status = "fail"`の診断はそうではありません。

## SORA Nexus アカウントIDを生成する {#generate-a-sora-nexus-account-id}

SORA Nexus のアカウント ID は、アカウントの公開鍵と接続先ネットワークの接頭辞から導出される、正規の I105 アドレスです。同じ公開鍵でも Taira と Minamoto では異なる ID に符号化されます。本番環境の利用者は、Minamoto 用に別の鍵ペアを生成してください。

アカウントを管理する Ed25519 キーペアを生成するか、読み込んでください:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

公開鍵を Taira アカウントID に変換します:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

メインネットのプレフィックスを持つ Minamoto 公開鍵を変換する:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

SORA Nexus の API や CLI コマンドが正規のアカウント ID を要求する場合は、生成された ID を使ってください。例えば、残高クエリ、厳密なアカウントフィールド、エイリアスの結び付けが該当します。対応する秘密鍵をクライアント設定に保持し、`[account].profile = "taira"` または `[account].profile = "minamoto"` で同じ公開ネットワークを選択してください。

ID を生成するだけでは、それ自体で資金が入ったオンチェーンアカウントは作成されません。Taira では、テストネットの資金提供サービスがアカウントを作成してテストネット用の書き込みに資金を提供することができます。Minamoto では、承認されたメインネットのオンボーディングまたは財務フローを使用してください。

### キーの保存とバックアップ {#key-storage-and-backup}

アカウントIDと公開鍵は共有できます。対応する秘密鍵、パスフレーズ、シード、およびリカバリ資料は秘密として扱う必要があります。

SORA Nexus アカウントには、これらの方法を使用してください。

- 秘密鍵は、暗号化されたパスワードマネージャ、ハードウェア対応のキーストア、または専用の署名サービスに保管してください。プロトコルの最終化キーをソース管理に置いたり、本番用キーをシェル履歴、ログ、チャット、チケット、または暗号化されていないバックアップに残したりしないでください。
- 各ボールトまたは本番用暗号署名者ごとに、ユニークで高エントロピーのパスフレーズを使用してください。パスフレーズはパスワードマネージャーや分割管理プロセスで保管し、暗号化された秘密鍵と同じファイルやバックアップバンドルには保存しないでください。
- Taira キーと Minamoto キーは分けて保管してください。Taira キーは使い捨てのテストネット用として扱い、Minamoto キーは本番資金の承認主体として扱ってください。
- 暗号署名者を復元するために必要な秘密鍵、公開鍵、アカウントID、アカウントプロファイル、およびアカウント回復または管理に関するメモをバックアップしてください。ネットワークのコンテキストがない秘密鍵は、復元時に誤用されやすいです。
- 本番用暗号署名者のために、少なくとも1つの暗号化されたオフラインバックアップと1つの地理的に分離された暗号化バックアップを保持してください。バックアップに依存する前に、小さな読み取り専用操作で回復をテストしてください。
- 秘密鍵、パスフレーズ、バックアップメディア、または署名ホストが漏洩した可能性がある場合は、暗号署名者を回転させるか交換してください。

詳細については、[暗号鍵の保存](/ja/guide/security/storing-cryptographic-keys.md) および [パスワードのセキュリティ](/ja/guide/security/password-security.md) を参照してください。

## 4. Taira でテストネット XOR を入手する {#_4-get-testnet-xor-on-taira}

CLI の事前準備を伴うフォーセットの手順で、テストネット XOR を請求します。フォーセットは `taira.client.toml` で設定されたアカウントに資金を供給し、まだ存在しないアカウントは先に登録します。手順は次のとおりです。

1. 公開されているフォーセットのポリシーから、フォーセットの権限主体、手数料資産、金額を読み取ります。
2. 請求を準備します。CLI はプルーフ・オブ・ワークを解き、Torii が準備して署名する正確なトランザクションを検証し、送信せずに非公開のジャーナルディレクトリへ保存します。
3. 保存されたトランザクションを一度だけ送信します。
4. 手数料が発生する書き込みを送る前に、資産残高が表示されるのを待ちます。

ポリシーを読み取ります。

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

応答はこの形をしています：

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

このポリシーは未署名の探索用データです。自動処理では、応答を毎回無条件に信頼せず、期待する権限主体、資産定義、金額を固定してください。`prepare` は、指定した値と異なる準備済みトランザクションを拒否します。

請求を準備して送信します。

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` は非公開のジャーナルディレクトリを作成し、既存ディレクトリの置き換えを拒否します。そのため、請求ごとに新しいディレクトリを使ってください。フォーセットは公開テストネットのサービスです。`submit` が `Pending` を報告した場合、タイムアウトした場合、または `502` を受け取った場合は、別の請求を準備せず、同じ設定とジャーナルで `taira account faucet resume` を実行してください。プルーフ・オブ・ワークの基点が古いと `prepare` は失敗するため、その場合は新しいジャーナルディレクトリで再度準備します。

次に、自分の手数料を支払う取引を送信する前に、資金提供された資産の投票を行ってください:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

請求が適用されても資産がまだ表示されない場合は、書き込みを送る前に、しばらく待って読み取りを再試行してください。

テストネット資金提供サービスは、Taira のテストネット資金専用です。テストネット XOR、テストネット資金提供サービスのアカウント、または Taira のカナリー暗号署名者を Minamoto のフローで使用しないでください。

## 5. Minamoto クライアント設定を作成する {#_5-create-a-minamoto-client-config}

Minamoto を利用する前に、運用担当者にメインネットのエンドポイントを確認し、TLS 証明書がホスト名と一致することを確かめてください。

Minamoto には別のキーペアを使用してください。Taira のキーをメインネットで再利用しないでください。

`minamoto.client.toml`を作成する:

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

最上位の `chain` は現在の SORA Nexus メインネットのチェーン ID で、`network_id` は Minamoto の正確なネットワーク識別子です。最初の署名付き操作の前に、機能情報を返す経路から読み取ってください。`[account].profile = "minamoto"` が Minamoto の I105 チェーン識別値を選択します。エンドポイントのホスト名やチェーン ID が暗黙に選択することはありません。

Minamoto の公開鍵を、メインネット接頭辞付きの標準的な I105 アカウントIDに変換する:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

アカウントがメインネットのオンボーディングまたはガバナンスフローを通じてプロビジョニングされ、資金が投入されるまで、読み取り専用のチェックのみを実行してください：

```bash
iroha --config ./minamoto.client.toml ledger domain list --limit 5
```

Minamoto に対して、Taira のフォーセットやスモークテストのコマンドを実行しないでください。

## 6. Minamoto アカウントに XOR を入金する {#_6-fund-a-minamoto-account-with-xor}

Minamoto の手数料は生産された XOR で支払われ、Minamoto にはパブリックテストネットの資金提供サービスはありません。承認されたメインネットのオンボーディングまたは財務移転を通じて設定されたアカウントに資金を提供するか、既存の資金提供済み Minamoto アカウントから XOR を受け取ってください。

書き込みを送信する前に、読み取り専用のチェックで正規のアカウントIDと資金を確認してください。Minamoto XOR は本番資金として扱い、最初に Taira で同じ操作をリハーサルし、本番用のキーは別に保管し、メインネットのトランザクションをリセットできるとは考えないでください。

Taira XOR は Minamoto の手数料を支払うことができません。テストネットの残高およびテストネット資金提供サービスの請求は Minamoto に引き継がれません。

## 7. 既存のデータスペース内で作業する {#_7-work-inside-an-existing-dataspace}

データスペース内の台帳オブジェクトには、完全修飾ドメイン名を使ってください。例えば、公開データスペースのプロジェクト用ドメインには、次の形式を使います。

```text
apps.universal
```

アカウントに必要な権限が付与されたら、ドメイン用にシークレットなしの `AliasSetupPlanRequestV1` インテントを作成し、宣言型プランナーを使用してください。

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto について、別のメインネット意図および計画を生成して承認してください。計画はそれぞれのチェーン、認可主体、ライブステートアンカー、締め切りに結び付けられているため、Taira の計画を昇格させたり再実行したりすることはできません。

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

アカウントエイリアスにも、同じデータスペースの接尾辞を使います。

```text
alice@apps.universal
alice@universal
```

厳密なアカウントフィールドは依然として標準の I105 アカウントIDを使用します。エイリアスは、標準のアカウントIDに解決される人間が読みやすい結びつきとして扱ってください。

## 8. 新しいデータスペースを用意する {#_8-provision-a-new-dataspace}

新しいデータスペースの追加は、運用とガバナンスの変更です。公開 Torii エンドポイントは、設定済みのデータスペースへ通信を振り分けられますが、未知のデータスペースエイリアスは拒否します。

変更を準備する前に、現在のライブカタログをキャプチャしてください：

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

オペレーターアカウントの場合、実行レーンの技術マニフェストの姿勢も確認してください：

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

レーン ID、データスペース ID、バリデータ集合、耐障害性、マニフェスト、ルーティング規則、運用責任者がまとめてレビューされるまで、新しいエイリアスを本格運用に移さないでください。必要な権限を持つ通常のユーザーアカウントは、エイリアスプランナーを使って、既存のデータスペース内にドメインとその SNS リースを取得できますが、新しい公開データスペースを安全に追加することはできません。

プライベートまたは組織用のデータスペースについては、次を含むカタログ変更を準備してください。

- 一意なデータスペースエイリアスと数値の `id`
- 一致する実行レーンのエントリまたは既存の実行レーン割り当て
- データスペースの `fault_tolerance`
- そこに届くべき指示やアカウントの範囲のルーティングルール
- データスペースが UAID の機能権限を公開する場合は、スペースディレクトリのマニフェスト、または同等の展開証拠
- バリデーターのガバナンス承認、コンプライアンス、金融取引決済、およびモニタリング方針

レビュー可能な設定フラグメントは次のようになります:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments data space"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
instruction = "transfer::asset"
description = "Route asset transfers to the payments data space"
```

オペレーターの受け入れには、これらのゲートを含めるべきです。

- `iroha3d --sora --config <config.toml> --check-config` は解決されたノード構成を渡します
- 生成またはレビューされた技術マニフェストは、暗号ハッシュと署名とともにアーカイブされます
- いかなる Minamoto への昇格の前に、Taira でスモークテストが合格する
- 変更後の `/status` のカタログに、意図したレーンとデータスペースが表示されること
- `iroha app nexus lane-report --summary` は必要な技術マニフェストが欠落していることを報告しません

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Taira でのデプロイ、スモークテスト、監視、ガバナンスの証拠がそろってから、同じデータスペースを Minamoto に移行してください。

## 関連ページ {#related-pages}

- [Iroha 3 をインストールする](/ja/get-started/install-iroha.md)
- [CLI を介して Iroha 3 を操作する](/ja/get-started/operate-iroha-via-cli.md)
- [プライベートデータスペースの手数料を肩代わりする](/ja/get-started/private-dataspace-fee-sponsor.md)
- [Torii エンドポイント](/ja/reference/torii-endpoints.md)
- [ブロックチェーンのジェネシス参照](/ja/reference/genesis.md)
