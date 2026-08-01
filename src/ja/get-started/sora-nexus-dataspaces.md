---
translation_locale: ja
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 8cc510f79468efa58732b806c254155d4d7225c0876272bd8126ea07e8607888
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SORA 3 に基づいて構築する: Taira と Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3は, Iroha 3 と SORA Nexus で構築されたアプリ面の公開展開トラックです. まず Taira で構築して練習し,その後同じクライアント形を Minamoto に移動するだけで,異なるメインネットキーがあり,料金は実際の XOR と生産承認がある場合にのみです.

このチュートリアルでは,公共の SORA 3つのネットワークのための Iroha クライアントを設定する方法を示します.

- Taira テストネットは, `https://taira.sora.org`
- Minamoto メインネットは `https://minamoto.sora.org`

Taira を統合テスト, faucet 資金による書き込みカナリー,および展開練習に使用する. Minamoto を生産準備のメインネット活動のみで使用する.両方のネットワークは XOR で手数料を請求します:

- Taira は,公共のポンプからテストネット XOR を使用します.
- Minamoto リアルを使用 XOR. 存在しません Minamoto ポンプ

## 建設者 の 道 {#builder-path}

|ステップ|Taira テストネット|Minamoto メインネット|
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|ネットワーク状態を読み始めます |鍵のない問い合わせ `/status`|鍵のない問い合わせ `/status`|
|データベースを選択する|`universal` を公開して,アプリに管理されたレーンが必要ない限り使用します |メインネットの承認後のみ同じデータスペースを使用します |
|料金の資産を手に入れる|公共の Taira faucet を使用する|資金調達された Minamoto 口座または承認された財務金流から XOR を取得する|
|テストは書いています|XOR faucet-financed test を使用する|テストツールを使用しないでください. 書き込みは実際の支出 XOR |
|促進する|ロジック,モニタリング,サイン処理を繰り返す|切り離されたキー,資金調達,リリース制御を使用する|

実践的な流れは:

1. Taira に対してクライアントを構築し,公共の `universal` データスペースを使用する.
2. 署名者を追加して Taira faucetで資金提供します.
3. Taira に対して アプリの論理を練習する. 失敗が退屈で観察できるまで.
4. 別々の Minamoto 署名を作成し,実際の XOR で資金提供し,同じ証明されたオペレーションのみをメインネットに移動します.

## 料理 本 を 読み続ける {#continue-with-the-cookbook}

このガイドを使用して,ネットワークを選択し,サインを設定し,手数料を支払ってください.次に,作成したいアプリケーションの行動に一致するレシピで続きます:

|目標|レシピ|
| --- | --- |
|Taira をチェックし,クライアントを設定する| [Taira](/ja/cookbook/connect-to-taira.md) に接続する|
|最初の書き込みを送って結果を確認する| [取引を提出し確認する](/ja/cookbook/submit-and-verify-transactions.md) |
|登録,硬貨,移動価値| [浮動資産](/ja/cookbook/fungible-assets.md) |
|フィルタリングされたアプリケーション状態を読み取る| [クエリ レジャーステート](/ja/cookbook/query-ledger-state.md) |
|約束された変化に反応する| [ストリームイベント](/ja/cookbook/stream-events.md) |

Taira の資金や SORA Nexus のネットワーク・コンテキストが必要な時,コックブックは各ワークフローを集中してここにリンクします.

## 1. 自分 が 設定 し て いる こと を 理解 する {#_1-understand-what-you-are-setting-up}

SORA Nexus では,データスペースはネットワークレーンとルーティングカタログの一部です.クライアントは,単に `client.toml` を変更することによって新しい公共データ空間を作成しません. クライアント設定は2つのことをします.

1. 顧客を右の端点 Torii に指す
2. ドメインとデータスペースのルーティングコンテキストをキャノニカルアカウントに選択します

`AccountId` それは常に法定であり 領域のないものです `[account].domain` 値 `client.toml` ルーティングとエイリアスコンテキストを提供し,アカウントのアイデンティティの一部にはなれない.大抵のアプリケーションでは,公衆から始めます `universal` データスペース.ドメインのコンテキストを使用する `domain.dataspace` 形式など:

```text
wonderland.universal
```

新しい組織データスペースが必要な場合は,通常のクライアントアカウントから登録しようとするのではなくカタログとルーティング提案を準備してください. [New Datapace](#_8-provision-a-new-dataspace)の提供については下記を参照してください.

## 2. 公衆 Torii 終点を確認する {#_2-check-the-public-torii-endpoint}

シグナーを設定する前に,ターゲットエンドポイントがライブであることを確認します.

Taira について:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Minamoto について:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

ノードが暴露したデータスペースとレーンビューをチェックする:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

メインネットでは `https://minamoto.sora.org/status` と同じコマンドを使用します.

## 代理人 Taira MCP {#taira-mcp-for-agents}

Taira はまた,エージェントの実行時間のために Torii-ネイティブモデルコンテキスト プロトコル (MCP) ブリッジを暴露します.エージェントが最初にカスタム Torii クライアントを構築せずにライブテストネット読み込み,スクリプト診断,または厳密にレビューされた書き込みレハーサルを必要とするときに使用します.

|設定|価値|
| --- | --- |
|MCP エンドポイント|`https://taira.sora.org/v1/mcp`|
|ネットワークルーツ|`https://taira.sora.org`|
|意図された用途|Taira テストネットの読書と faucet資金による書き込み練習|
|生産等価|この項目を Minamoto に指さないで,メインネット MCP エンドポイントと放出制御が明示的に承認された場合を除く. |

署名材料を追加する前に,橋のメタデータをチェックする:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

URL をエージェント実行時にユーザローカル MCP サーバーとして設定する.このドキュメント repoまたはアプリケーション repoにエージェント MCP コンフィギュレーション, API トークン,転送された著作者ヘッダー, `authority` または `private_key` の値をコミットしないでください.

Taira でうまく動作するエージェントプロンプトルール:

- MCP サーバーからのツールを見つけ,それらを呼び出す前に;サーバが報告する場合は再発見 `listChanged`.
- キュレーションされた `iroha.`ツールは,原材料の `torii.` ツールを好む.
- アカウント,資産,ニセ字,ブロック,ガバナンス状態,トランザクションの状態を提案する前にチェックします.
- 生体テストネット変異前に,人間の明示的な指示を要求する.事前署名されたトランザクション封筒の場合, `iroha.transactions.submit_and_wait` を使用して,エージェントはただ提出するのではなく結果を待つようにします.
- エージェント応答でトランザクションハッシュ,最終ステータス,サーバー検証エラーをまとめます.

### 代理人との開発作業 {#development-workflow-with-agents}

Iroha クライアント,トランザクションビルダー,診断スクリプト,テストネットランブックの開発支援者としてエージェントを使用します.エージェントの権限を狭く保つ:Taira 状態を読み,変更を提案し,ローカルテストを実行できますが 人間が正確な操作を承認するまで ライブネットワークを変異させることはできません.

実践的なワークフローは:

1. SDK コード, CLI コマンド,または MCP ツール・スケーマを入力する前に,関連ドックスを検査するようエージェントに依頼します.
2. まず最小のクライアント経路を 代理人に書き込むようにしてください. 状態チェック,アカウント検索,別名解析,またはバランス検索.
3. トランザクション・ビルディングコードを Taira に対して読み込みのみの呼び出しが動作した後で追加する.
4. `TAIRA_LIVE=1`の後ろで,例えばライブネットワークテストのオプトインを保持するので,通常のユニットテスト実行ではテストネット資金が決して費やされず,ネットワーク利用量に依存しない.
5. 取引を提出する前に,ネットワークルート,チェーン,権限アカウント,指示概要,料金の資産,および予想される状態変化を報告するようエージェントに要求する.
6. CI またはメインネットワークフローにプロモーションする前に,秘密操作,再試行動,無効性および拒否処理のための生成されたコードをレビューする.

MCP 開発のための有用な読み込みのみツールには,アカウント資産検索,アライアス解像度,ブロック検索,トランザクション検索,取引リスト,パイプライン状態チェックが含まれます.署名した役に立たない荷物を送信する前に信頼を築くためにそれらを使用します.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### 代理人によるトランザクションワークフロー {#transaction-workflow-through-agents}

MCP ブリッジは署名された Iroha トランザクションを提出できるが,通常のトランザクション要件を除去しない.取引には依然として正しい権限,許可,料金の資金提供,チェーン ID,メタデータ,署名が必要です.

原作 Iroha 取引については,まず SDK または CLI でトランザクション包装を組み立てて署名し,その後,代理人に定例のみを与えます `body_base64`と暗号化された署名された取引バイト.エージェントは,封筒を`iroha.transactions.submit_and_wait`で提出するか,または `iroha.transactions.submit`で提出し,アンケートも `iroha.transactions.wait`で提出することができます.

エージェントのプロンプトにプライベートキーを貼ってはいけません.エージェントがトランザクションを作成する必要がある場合,ユーザの実行時間の秘密をロードするローカルコードに指示してください.環境,キーチェイン,ハードウェアシグナー,または無視されたテストネット設定ファイル.エージェントは決してマークダウン,フィクチュア,ログ,またはコンミットに鍵を書き込むべきではありません.

取引を提出する前に,エージェントに短い取引プランを作成してください.

- `network`: Taira テストネットのルーツとチェーン ID
- `authority`:署名し,手数料を支払う口座
- `instructions`:レジスタ,ミント,バーン,転送,メタデータ,許可,または契約呼び出しのまとめ
- `fee asset`: Taira で請求される資産
- `preflight reads`:既に実施された口座,資産バランス,許可,別名またはブロックチェック
- `expected result`: 確認後,見える状態
- `idempotency`:同じ要求が再検討されたらどうなるか

送信後,エージェントに端末状態を待機させ,読み取りクエリでステートの変更を確認します.有用な完了レポートには:

- 取引ハッシュ
- `Committed`,`Applied`, `Rejected`,または `Expired`などの端末状態.
- ブロックや探査機の詳細が利用可能である場合
- 検証読書の結果
- 拒否メッセージと失敗は許可,料金,認証,ステッド状態またはエンドポイントの利用可能性に似ているかどうか.

保護された速報の例:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

署名された封筒が既に作成された場合:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP を公共のテストネット制御表面として扱う. Taira キー,テストネット XOR, faucetアカウント,およびカナリーサインは使い捨てであり, Minamoto キーと生産リリースワークフローから分離する必要があります.

## 今 で 試す こと が できる おもちゃ の 例 {#toy-examples-you-can-try-now}

これらの例は,注記しない限り読み込みのみです. 鍵を生成する前に動作し,公共ネットワークの両方に安全です.

Taira テストネットと Minamoto メインネットの健康を比較する.

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Taira に暴露された公共データスペースの行列をリストする:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Minamoto に関する同じコマンドを実行して,メインネットビューが必要とする場合:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

ダッシュボード,ボット,またはデプロイメントチェックのための小さな Node.js 状態探査機を作成する:

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

最初の書き方玩具は Taira faucet claim でなければならない. testnet XOR を使用し,決して Minamoto に指向してはならない.

## 3. Taira クライアント設定を作成する {#_3-create-a-taira-client-config}

キーペアを生成する

```bash
kagami keys --algorithm ed25519 --json
```

`taira.client.toml` を作成する:

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

最上位レベル `chain` 正確な Taira 取引チェーン ID. 労働組合 `[account].profile = "taira"` 設定が独立して選択する Taira I105 鎖の差別剤. ID 口座プロフィールを選択しない.

読み込みのみのチェックを実行する:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Taira の公開診断を書き込みテストの前に実行する.

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Taira アカウントは,手数料の支払いの書き込みを実行する前に faucet 経由で資金提供します. faucet の直接的な流れは [Get Testnet XOR で Taira](#_4-get-testnet-xor-on-taira)です.

Taira カナリアは, faucet claimが受け入れられ,アカウントが資金提供された後,オプションの書き込み煙テストとなります.

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

`--write-config`が提供されたとき,カナリは署名したピンを送信し,確認を待て,実行時のサイン設定を書きます. Taira は公開テストネットです.排列の飽和性によって, faucet が機能している場合でも署名されたping が失敗する可能性があります.もし `taira doctor` が飽和した排列を報告するか,カナリーが `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` を返信した場合,クライアント設定エラーとして処理する前に待て再試してください.

監視されていない煙の試験では,カナリーを制限された再試行ループに包み込む.

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

`iroha taira doctor`が重篤な失敗を示している場合は再テストを停止します. 排列の飽和度と料金受付拒否は公共テストネットでの一時的な条件です; DNS, TLS,または `status = "fail"`診断はありません.

## SORA Nexus アカウント ID を作成する {#generate-a-sora-nexus-account-id}

A SORA Nexus 口座 ID は,法典的な I105 アドレスはアカウントパブリックキーとターゲットネットワークプレフィックスから得られる. `[account].domain` クライアントの値 TOML. 同じ公開鍵が異なるコードに IDs について Taira そして Minamoto, 生産利用者は別々のキーペアを Minamoto.

アカウントを制御する Ed25519 キーパーの生成またはロード:

```bash
kagami keys --algorithm ed25519 --json
```

公钥を Taira 口座 ID に変換する:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Minamoto 公共鍵をメインネットプレフィックスで変換する:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

取得したアカウントを使用する ID どちらにしても Nexus API または CLI 命令は聖典的な説明を求めます ID, 例えば, Taira ポンプ `account_id`, バランスの取材,厳格なアカウントフィールド,または別名結合. 匹配を保持するクライアント設定のプライベートキーで,同じ公共ネットワークを `[account].profile = "taira"` または `[account].profile = "minamoto"`.

ID を生成するだけでは,連鎖で資金提供されたアカウントを作成することはありません. Taira では, faucetがテストネットの書き込みのための口座を作成して資金を調達できます. Minamoto では,承認されたメインネットオンボードまたは財務流を使用します.

### 鍵の保管とバックアップ {#key-storage-and-backup}

ID アカウントと公開鍵は共有できる.一致するプライベートキー,パスワード,種子,復元資料は秘密扱いされなければならない.

SORA Nexus 口座について,これらの慣行を使用する.

- 暗号化されたパスワード管理器,ハードウェアサポートされたキーストア,または専用のサインサービスにプライベートキーを保存する.ソースコントロールに鍵を委ねたり,シェル履歴,ログ,チャット,チケット,または暗号化されていないバックアップに生産キーを残さないこと.
- キーフットやプロダクションシグナーごとにユニークな高エントロピーのパスワードを使用します.パスワード管理器または分割保管プロセスでパスワードを保存する暗号化されたプライベートキーと同じファイルやバックアップバンドにはない.
- Taira と Minamoto の鍵を別々に保持する. Taira の鍵は使い捨てテストネット材料として, Minamoto の鍵は生産資金管理機関として扱う.
- 署名者を復元するために必要な個人鍵,公開鍵,アカウントプロフィール ID,およびすべてのアカウント復旧または保管メモをバックアップします.ネットワークコンテキストのないプライベート鍵は復元中に悪用することが容易です.
- プロダクションシグナーには少なくとも1つの暗号化されたオフラインバックアップと地理的に別々の暗号化されたバックアップを保持します.バックアップに依存する前に,読み込みのみの小さな操作で復元をテストします.
- プライベートキー,パスワードフレーズ,バックアップメディア,または署名ホストが暴露された場合,サインを回すか交換する.

詳細については, [ 暗号鍵の保存](/ja/guide/security/storing-cryptographic-keys.md)と [ パスワードセキュリティ](/ja/guide/security/password-security.md)を参照してください.

## 4. テストネット XOR を Taira に取得する. {#_4-get-testnet-xor-on-taira}

公共の水槽を直接使用する

1. 署名者を生成またはロードし,その法典的な Taira アカウント ID を計算する.
2. ポンプのパズルを持ってきて
3. `difficulty_bits`が `0`より大きい場合,パズルを解決する.
4. ポンプの申請を提出する
5. 請求書を送信する前に,口座または資産の余分が表示されるのを待つ.

公開鍵を Taira I105 口座 ID faucetによって予想される:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

パズルを 持ってきて

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

ポンプは公共のテストネットサービスです.パズルまたはクレームエンドポイントが `502`,タイムアウト,または他のゲートウェイレベルのエラーを返信した場合,鍵やクライアント設定を変更する前に待って再試してください.

反応はこんな感じです

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

`difficulty_bits`が `0`である場合,ただ単に ID の口座を提出する:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

`difficulty_bits`が `0`より大きい場合は,パズルを解き,アンカー高度とノンスを含みます.

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

パズルのアルゴリズムは:

1. 課題を SHA-256 として構築する.
   - `iroha:accounts:faucet:pow:v2` のバイト
   - UTF-8 の口座 ID
   - `anchor_height` のような大きなエンディアン `u64`
   - `anchor_block_hash_hex`をバイトとして解読する
   - `challenge_salt_hex` をバイトとして解読する.
2. `u64` ノンチェスを試して Big-endian 8バイト値としてコードする.
3. 各ノンスでスクリプトを実行する:
   - パスワード: 8バイトのノンス
   - 塩: 32バイトの挑戦
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - 輸出長さ: 32バイト
4. 勝利するノンセは,少なくとも `difficulty_bits` がゼロビットに先行した最初の消化です.

ポンプ応答には,資金調達資産とキュー取引ハッシュが含まれます.

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

回答は現在 HTTP `202 Accepted` で返信されている.その `asset_definition_id` は,公用 faucet によって資金提供される現在の Taira 料金資産である. ID の例をコピーする代わりに応答から導き出す. faucet が返信したときに要求を受け入れた `tx_hash_hex` と `status: "QUEUED"`.

資金提供された資産を調査する前に 自分の手数料の支払いをします

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

もし faucet 請求が受け入れられたが,アカウントまたは資産はまだ表示されない場合,取引は依然として公開テストネットのキュー処理の後にある.送信書き前に読み取りを待て,再試します.

実行準備ができている直接のチェック API のために,これを `taira_faucet_claim.py`として保存し, Taira I105 の口座 ID を渡す.

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

ポンプは Taira テストネットは使用しないでください. XOR, faucet 口座,または Taira カナリーサイン Minamoto 流れる

## 5. Minamoto クライアント設定を作成する {#_5-create-a-minamoto-client-config}

Minamoto に対して別々のキーペアを使用する. メインネットのために Taira キーを再利用しないでください.

`minamoto.client.toml` を作成する:

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

最上位レベル `chain` は電流である Nexus メインネットチェーン ID. `[account].profile = "minamoto"` 選択する Minamoto I105 チェーン識別子;エンドポイントのホスト名とチェーン ID 暗黙に選択しないでください.

変換する Minamoto 公的な鍵をその聖典に I105 口座 ID メインネット前記:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

メインネットオンボードまたはガバナンスフローを通じてアカウントが配置され,資金提供されるまで,読み方チェックのみを実行します.

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Taira faucet または write-canary ヘルパーを, Minamoto に対して動かさないこと.

## 6. XOR で Minamoto 口座を資金提供する {#_6-fund-a-minamoto-account-with-xor}

Minamoto 手数料は,生産 XOR で支払われ,Minamoto には公共の faucetがありません.承認されたメインネットオンボードまたは財務金転送を通じて構成されたアカウントを資金提供するか,既存の資金調達した Minamoto 口座から XOR を受け取る.

ID のカノニカル・アカウントと資金は,書き込みを提出する前に読み取りのみのチェックで確認してください. Minamoto XOR を生産資金として扱ってください:最初に Taira で同じ操作を練習し,別々の生産キーを保持し,メインネット取引がリセット可能であると仮定しないでください.

Taira XOR は Minamoto 手数料を支払えない.テストネットの余分と faucetの請求は, Minamoto に転送されない.

## 7. 既存のデータ領域内での作業 {#_7-work-inside-an-existing-dataspace}

データベース内にある本簿オブジェクトに完全に資格のあるドメイン名を使用します.例えば,公開データ領域のプロジェクトドメインは:

```text
apps.universal
```

アカウントが必須の許可を取得した後,ドメインのための秘密のない意図 `AliasSetupPlanRequestV1` を作成し,宣言プランナーを使用します:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto については,別々のメインネットの意図と計画を生成し承認する.プランは,そのチェーン,権限,ライブステートアンカー,および期限に縛られているため, Taira プランを推進したり再演出することもできない:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

アカウント・アリスは同じデータスペースサフィックスを使用します:

```text
alice@apps.universal
alice@universal
```

厳格なアカウントフィールドは依然としてカノニカルを使用します I105 口座 IDs. 人に読める結合として異名詞を扱う. IDs.

## 8. 新しい データ スペース を 提供 する {#_8-provision-a-new-dataspace}

新しいデータ領域は,オペレーターとガバナンス変更である.公共の Torii エンドポイントは,構成されたデータ領域へのトラフィックをルーティングできるが,未知のデータ領域のニックネームを拒絶する.

変更を準備する前に,現在のライブカタログをキャプチャする:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

運行者のアカウントについては,レーンマニストの姿勢も確認してください.

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

レーン ID,データスペース ID,検証器セット,故障許容性,マニフェスト,ルーティング規則,および運用所有者が一緒にレビューされていない限り,新しい仮名をプロモートしないでください.必要な権限を持つ通常のユーザーアカウントは,既存のデータスペース内にドメインを取得し, SNS のレンタルをアライスプランナーを通じて行うことができる.新しい公共データ空間を安全に追加することはできません.

プライベートまたは組織的なデータスペースについては,以下のようなカタログ変更を準備してください.

- 単一のデータスペース・アライスと数値 `id`
- 適合するレーン入口または既存のレーン割り当て
- `fault_tolerance` データスペース
- そこに着陸すべき指示やアカウントの範囲のためのルーティング規則
- UAID 機能が暴露された場合,スペースディレクトリマニストまたは同等の展開証明書
- バリダーター,コンプライアンス,決済およびモニタリング政策のためのガバナンスの承認

確認可能なコンフィギュレーションフラグメントはこんな感じです

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

オペレーターの受け入れには以下のゲートが含まれます.

- `irohad --sora --config <config.toml> --trace-config` は解決されたノード構成を転送します
- 生成されたまたはレビューされたマニフェストはハッシュと署名でアーカイブされます
- 煙のテストが合格 Taira その前に Minamoto 昇進
- 変更後のカタログ `/status` では,意図されたレーンとデータスペースが表示されます.
- `iroha app nexus lane-report --summary`は,欠けている必要の明示書を報告していない.

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

同じデータ空間を Minamoto に促進するのは, Taira の展開,煙のテスト,モニタリング,およびガバナンスの証拠が完了した後のみです.

## 関連ページ {#related-pages}

- [Iroha 3](/ja/get-started/install-iroha.md)をインストールする
- [動作する Iroha 3 経由 CLI](/ja/get-started/operate-iroha-via-cli.md)
- [プライベートデータスペースのスポンサー料金](/ja/get-started/private-dataspace-fee-sponsor.md)
- [Torii エンドポイント](/ja/reference/torii-endpoints.md)
- [創世記参照](/ja/reference/genesis.md)
