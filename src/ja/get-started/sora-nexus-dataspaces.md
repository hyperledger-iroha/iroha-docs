---
translation_locale: ja
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# SORA 3 を基にして: Taira と Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 は、Iroha 3 と SORA Nexus に基づいて構築されたアプリ向けの公開デプロイトラックです。まず Taira でビルドとリハーサルを行い、その後に個別のメインネットキー、手数料用の実際の XOR、および本番承認がある場合にのみ、同じクライアント形状を Minamoto に移動してください。

このチュートリアルでは、パブリック SORA 3ネットワーク用の Iroha クライアントの設定方法を示します。

- Taira のテストネットは `https://taira.sora.org` にあります
- Minamoto メインネットは `https://minamoto.sora.org` にて

統合テスト、テストネット資金でのライトキャナリー、デプロイリハーサルには Taira を使用してください。製品準備が整ったメインネットの活動には Minamoto のみを使用してください。両方のネットワークは XOR で手数料を請求します。

- Taira は、パブリックテストネット資金提供サービスからテストネット XOR を使用します。
- Minamoto は実際の XOR を使用します。Minamoto のテストネット資金提供サービスはありません。

## ビルダーパス {#builder-path}

|ステップ| Taira テストネット| Minamoto メインネット |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|ネットワーク状態の読み取りを開始|キーなしのクエリ `/status`|キーなしのクエリ `/status`|
|データスペースを選択してください|アプリが管理された実行レーンを必要としない限り、パブリック`universal`を使用してください|メインネットの承認後にのみ同じデータスペースを使用してください|
| 手数料資産を取得 | 公開 Taira の faucet を使用 | 資金提供済みの Minamoto アカウントまたは承認済みのトレジャリー経路から XOR を受け取る |
| 書き込みをテスト | faucet で取得した testnet XOR を使用 | テスト用ツールを使わない。書き込みでは実際の XOR を消費する |
|促進する|リトライロジック、監視、および暗号署名処理を維持する|別々の鍵、資金、リリース管理を使用してください|

実際の流れは次のとおりです：

1. クライアントを Taira に対して構築し、パブリック `universal` データスペースを使用してください。
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

「SORA Nexus」では、データスペースはネットワーク実行レーンおよびルーティングカタログの一部です。クライアントは`client.toml`を変更するだけで新しいパブリックデータスペースを作成することはありません。クライアント設定は次の2つのことを行います:

1. クライアントを正しい Torii API エンドポイントに向ける
2. 正規アカウントのためのドメインとデータスペースのルーティングコンテキストを選択する

`AccountId`は常に標準でドメインなしです。`client.toml`内の`[account].domain`の値はルーティングおよびエイリアスのコンテキストを提供しますが、アカウントの識別情報の一部にはなりません。ほとんどのアプリケーションでは、公開の`universal`データスペースから開始してください。ドメインコンテキストは`domain.dataspace`形式を使用します。たとえば:

```text
wonderland.universal
```

新しい組織のデータスペースが必要な場合は、通常のクライアントアカウントから登録しようとするのではなく、カタログとルーティング提案を準備してください。以下の [新しいデータスペースをプロビジョニングする](#_8-provision-a-new-dataspace) を参照してください。

## 2. 公開 Torii API エンドポイントを確認する {#_2-check-the-public-torii-endpoint}

暗号署名者を設定する前に、対象の API エンドポイントが稼働していることを確認してください。

〜のために Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Minamoto の場合：

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

ノードによって公開されるデータスペースと実行レーンのビューを確認してください:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

メインネットの場合は、同じコマンドを `https://minamoto.sora.org/status` と一緒に使用してください。

## Taira MCP エージェント用 {#taira-mcp-for-agents}

Taira は、エージェントソフトウェアランタイム向けに Torii ネイティブのモデルコンテキストプロトコル (MCP) ブリッジも公開します。エージェントがカスタム Torii クライアントを最初に構築せずに、ライブのテストネット読み取り、スクリプト化された診断、または厳密にレビューされた書き込みリハーサルを行う必要がある場合に使用してください。

|設定|価値|
| --- | --- |
| MCP API エンドポイント | `https://taira.sora.org/v1/mcp` |
|ネットワークルート| `https://taira.sora.org` |
|意図された使用|Taira テストネットの読み取りとテストネット資金提供による書き込みリハーサル|
|生産相当|メインネットの MCP API エンドポイントおよびリリース制御が明示的に承認されない限り、このエントリを Minamoto に向けないでください|

署名素材を追加する前に、ブリッジのメタデータを確認してください：

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
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
3. トランザクション構築コードは、読み取り専用の API リクエストが Taira に対して機能するようになった後にのみ追加してください。
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
- 拒否メッセージと、失敗が権限、料金、検証、古い状態、または API エンドポイントの可用性のいずれに見えるか

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

これらの例は、注記がない限り読み取り専用です。キーを生成する前でも動作し、公開ネットワークに対して実行しても安全です。

Taira テストネットと Minamoto メインネットのヘルスを比較：

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Taira によって公開されているパブリックデータスペース実行レーンを一覧表示してください:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

メインネットのビューが必要な場合は、同じコマンドを Minamoto に対して実行してください。

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

ダッシュボード、ボット、またはデプロイメントチェック用に、非常に小さな Node.js ステータスプローブを作成する:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
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
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

最上位の`chain`は、正確な Taira トランザクションチェーンIDです。`[account].profile = "taira"`の設定は、独立して Taira I105 チェーン識別子を選択します。チェーンIDはアカウントプロファイルを選択しません。

読み取り専用チェックを実行する:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

書き込みテストの前に、公開 Taira の診断を実行してください。

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

手数料がかかる書き込みを実行する前に、テストネットの資金提供サービスを通じて Taira アカウントに資金を供給してください。直接のテストネット資金提供サービスのフローは[Taira でテストネット XOR を入手する](#_4-get-testnet-xor-on-taira)にあります。

テストネット資金提供サービスの請求が承認され、アカウントに資金が提供された後、Taira カナリアはオプションの書き込みスモークテストとなります:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

カナリアは署名付きのピンを提出し、確認を待ち、`--write-config` が提供されたときにソフトウェア実行時の暗号署名者設定を書き込みます。Taira はパブリックテストネットです。したがって、キューの飽和により、テストネット資金提供サービス自体が動作していても、署名付きピンが失敗する可能性があります。`taira doctor` がキューの飽和を報告する場合や、カナリアが `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` を返す場合は、それをクライアント構成エラーとして扱う前に、待機して再試行してください。

無人のスモークテストでは、カナリアを制限付きリトライループで囲みます:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

もし`iroha taira doctor`がハードフェイルを示した場合、再試行を停止してください。キューの飽和や手数料による受け入れ拒否は一時的なパブリックテストネットの状況です；DNS、TLS、または`status = "fail"`の診断はそうではありません。

## SORA Nexus アカウントIDを生成する {#generate-a-sora-nexus-account-id}

SORA Nexus アカウントIDは、アカウントの公開鍵と対象ネットワークの接頭辞から派生した標準的な I105 アドレスです。それは `[account].domain` の値ではありません。クライアント TOML。Taira と Minamoto では同じ公開鍵が異なるIDにエンコードされ、本番ユーザーは Minamoto 用に別のキー ペアを生成する必要があります。

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

生成されたアカウントIDを、Nexus、API、または CLI のコマンドが正規のアカウントIDを求める場合に使用してください。例えば、Taira テストネット資金提供サービス `account_id` の場合です。残高照会、厳格なアカウントフィールド、またはエイリアスのバインディング。`[account].profile = "taira"` または `[account].profile = "minamoto"` で同じパブリックネットワークを選択し、クライアント設定に一致する秘密鍵を保持してください。

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

パブリックテストネットの資金提供サービスを直接利用してください。手順は以下の通りです：

1. 暗号署名者を生成またはロードし、その正準の Taira アカウントIDを計算します。
2. 現在のテストネット資金提供サービスのパズルを取得してください。
3. `difficulty_bits`が`0`より大きい場合は、パズルを解いてください。
4. テストネット資金提供サービスの請求を提出してください。
5. 手数料がかかる書き込みを送信する前に、アカウントまたは資産の残高が表示されるのを待ってください。

公開鍵をテストネット資金提供サービスが要求する Taira I105 アカウントID に変換してください:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

パズルを取ってください：

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

テストネット資金提供サービスは公開テストネットサービスです。パズルまたはクレーム API エンドポイントが `502`、タイムアウト、または他のゲートウェイレベルのエラーを返す場合、キーやクライアント設定を変更する前に、待って再試行してください。

応答はこの形をしています：

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

`difficulty_bits` が `0` のとき、アカウントIDのみを提出してください:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

`difficulty_bits` が `0` より大きい場合、パズルを解き、アンカーの高さと暗号化ナンスの値を含めます:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }' \
  | tee ./taira-faucet-response.json \
  | jq .
```

パズルのアルゴリズムは次の通りです:

1. チャレンジを SHA-256 の上に構築する:
   - `iroha:accounts:faucet:pow:v2`のバイト
   - UTF-8 アカウントID
   - `anchor_height` をビッグエンディアンとして `u64`
   - `anchor_block_hash_hex` をバイトとしてデコードしました
   - 存在する場合、`challenge_salt_hex` はバイトとしてデコードされます
2. ビッグエンディアンの8バイト値としてエンコードされた`u64`暗号化ノンス値を試してください。
3. 各暗号化ノンス値について、次の設定でscryptを実行します：
   - パスワード：8バイトの暗号用ナンス値
   - ソルト：32バイトのチャレンジ
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - 出力長さ：32バイト
4. 勝利する暗号ナンス値は、少なくとも`difficulty_bits`個の先頭ゼロビットを持つ最初の暗号ダイジェスト値です。

テストネット資金提供サービスの応答には、提供された資産とキューに入れられたトランザクションの暗号ハッシュが含まれます:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "<TAIRA_FEE_ASSET_DEFINITION_ID>",
  "asset_id": "...",
  "amount": "<FUNDED_AMOUNT>",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

レスポンスは現在、HTTP `202 Accepted` と共に返されます。その `asset_definition_id` は、パブリックテストネット資金提供サービスによって資金提供された現在の Taira 手数料資産です；例のIDをコピーするのではなく、レスポンスからそれを導き出してください。テストネットの資金提供サービスは、`tx_hash_hex`および`status: "QUEUED"`を返すとリクエストを受け入れます。

次に、自分の手数料を支払う取引を送信する前に、資金提供された資産の投票を行ってください:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

もしテストネットの資金提供サービスの申請が承認されたが、アカウントや資産がまだ表示されない場合、トランザクションはまだ公開テストネットのキュープロセスの後ろにあります。書き込みを送信する前に、待ってから読み取りを再試行してください。

すぐに実行できる直接の API チェックのために、これを`taira_faucet_claim.py`として保存し、Taira I105 アカウントIDを渡してください:

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

puzzle_request = urllib.request.Request(
    f"{root}/v1/accounts/faucet/puzzle",
    headers={"Accept": "application/json"},
)

with urllib.request.urlopen(puzzle_request) as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"Accept": "application/json", "content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

テストネット資金提供サービスは、Taira のテストネット資金専用です。テストネット XOR、テストネット資金提供サービスのアカウント、または Taira のカナリー暗号署名者を Minamoto のフローで使用しないでください。

## 5. Minamoto クライアント設定を作成する {#_5-create-a-minamoto-client-config}

Minamoto には別のキーペアを使用してください。Taira のキーをメインネットで再利用しないでください。

`minamoto.client.toml`を作成する:

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

最上位の`chain`は現在の Nexus メインネットチェーンIDです。`[account].profile = "minamoto"`は Minamoto I105 チェーン識別子を選択します。API エンドポイントのホスト名とチェーンIDは暗黙的にそれを選択しません。

Minamoto の公開鍵を、メインネット接頭辞付きの標準的な I105 アカウントIDに変換する:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

アカウントがメインネットのオンボーディングまたはガバナンスフローを通じてプロビジョニングされ、資金が投入されるまで、読み取り専用のチェックのみを実行してください：

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Minamoto に対して Taira テストネット資金提供サービスやライターカナリアヘルパーを実行しないでください。

## 6. Minamoto アカウントに XOR を入金する {#_6-fund-a-minamoto-account-with-xor}

Minamoto の手数料は生産された XOR で支払われ、Minamoto にはパブリックテストネットの資金提供サービスはありません。承認されたメインネットのオンボーディングまたは財務移転を通じて設定されたアカウントに資金を提供するか、既存の資金提供済み Minamoto アカウントから XOR を受け取ってください。

書き込みを送信する前に、読み取り専用のチェックで正規のアカウントIDと資金を確認してください。Minamoto XOR は本番資金として扱い、最初に Taira で同じ操作をリハーサルし、本番用のキーは別に保管し、メインネットのトランザクションをリセットできるとは考えないでください。

Taira XOR は Minamoto の手数料を支払うことができません。テストネットの残高およびテストネット資金提供サービスの請求は Minamoto に引き継がれません。

## 7. 既存のデータスペース内で作業する {#_7-work-inside-an-existing-dataspace}

データスペース内に存在するブロックチェーン台帳オブジェクトには、完全修飾ドメイン名を使用してください。例えば、パブリックデータスペースのプロジェクトドメインは次のように使用する必要があります:

```text
apps.universal
```

アカウントに必要な権限が付与されたら、ドメイン用にシークレットなしの `AliasSetupPlanRequestV1` インテントを作成し、宣言型プランナーを使用してください。

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto について、別のメインネット意図および計画を生成して承認してください。計画はそれぞれのチェーン、認可主体、ライブステートアンカー、締め切りに結び付けられているため、Taira の計画を昇格させたり再実行したりすることはできません。

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

アカウント別名は同じデータスペースの接尾辞を使用します:

```text
alice@apps.universal
alice@universal
```

厳密なアカウントフィールドは依然として標準の I105 アカウントIDを使用します。エイリアスは、標準のアカウントIDに解決される人間が読みやすい結びつきとして扱ってください。

## 8. 新しいデータスペースを提供する {#_8-provision-a-new-dataspace}

新しいデータスペースはオペレーターおよびガバナンスの変更です。パブリック Torii API エンドポイントはトラフィックを設定されたデータスペースにルーティングできますが、未知のデータスペースエイリアスは拒否します。

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

実行レーンID、データスペースID、バリデータセット、耐障害性、技術マニフェスト、ルーティングルール、および運用オーナーが一緒に確認されていない限り、新しいエイリアスを促進しないでください。必要な権限を持つ通常のユーザーアカウントは、エイリアスプランナーを通じて既存のデータスペース内でドメインとその SNS リースを取得できますが、新しいパブリックデータスペースを安全に追加することはできません。

個人用または組織用のデータスペースの場合、次の内容でカタログ変更を準備してください:

- ユニークなデータスペースのエイリアスと数値 `id`
- 一致する実行レーンのエントリまたは既存の実行レーン割り当て
- データスペース `fault_tolerance`
- そこに届くべき指示やアカウントの範囲のルーティングルール
- データスペースが UAID 機能を公開する場合の、宇宙ディレクトリの技術マニフェストまたは同等の展開証拠
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
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

オペレーターの受け入れには、これらのゲートを含めるべきです。

- `iroha3d --sora --config <config.toml> --trace-config` は解決されたノード構成を渡します
- 生成またはレビューされた技術マニフェストは、暗号ハッシュと署名とともにアーカイブされます
- いかなる Minamoto への昇格の前に、Taira でスモークテストが合格する
- 変更後の `/status` カタログは、意図された実行レーンとデータスペースを示しています
- `iroha app nexus lane-report --summary` は必要な技術マニフェストが欠落していることを報告しません

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Taira のデプロイメント、スモークテスト、モニタリング、およびガバナンスの証拠が完了した後にのみ、同じデータスペースを Minamoto に昇格させてください。

## 関連ページ {#related-pages}

- [Iroha 3 をインストールする](/ja/get-started/install-iroha.md)
- [CLI を介して Iroha 3 を操作する](/ja/get-started/operate-iroha-via-cli.md)
- [プライベートデータスペースのスポンサー料](/ja/get-started/private-dataspace-fee-sponsor.md)
- [Torii API エンドポイント](/ja/reference/torii-endpoints.md)
- [ブロックチェーンのジェネシス参照](/ja/reference/genesis.md)
