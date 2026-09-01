---
translation_locale: ja
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Musubi Kotodama パッケージ {#musubi-kotodama-packages}

Musubi は Kotodama ソースパッケージの初回リリース用パッケージマネージャーです。これは正確なオンチェーン依存関係グラフを解決し、SoraFS を認証します。ソースをアーカイブし、選択したワークスペースをコンパイルしてテストし、標準的な CAR アーカイブを作成し、Iroha を通じて不変のリリースを公開します。

次のような場合に Musubi を使用してください:

- 再利用可能な Kotodama 関数ライブラリを公開する
- `Musubi.lock`に正確な有向グラフを固定する
- 最終化された SoraFS アーカイブ暗号コミットメント値から依存元を再構築する
- 1つのパッケージまたは複数パッケージのワークスペースを構築してテストする
- オンチェーンレジストリを通じてパッケージを検査、公開、削除、維持、またはエイリアスする

## パッケージ名 {#package-names}

標準パッケージセレクターは使用します:

```text
namespace/package
```

正確なリリース識別子にバージョンを追加する：

```text
namespace/package@version
```

名前空間の前に先行する `@` はありません。名前空間は、`universal` のようなデータスペースのルートか、`dex.universal` のようなドメインが指定されたデータスペースのいずれかです。ブロックチェーン台帳は、パッケージが請求される前に、その構造上の名前空間を1つの安定したホームデータスペースに結びつけます。

## 技術的マニフェストとロックファイル {#manifest-and-lockfile}

パッケージは閉鎖された初回リリース `Musubi.toml` スキーマを使用します。技術マニフェストは `manifest-version = 1`、Kotodama 版 `"1"`、および IVM ABI バージョン `1` を宣言する必要があります。代替の技術マニフェストや ABI モードはありません。

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

依存関係は、正確なバージョン、キャレットまたはチルダの要件、`1.*` のようなワイルドカード、`>=1.0.0,<2.0.0` のようなカンマ区切りの比較子セットを使用できます。依存関係テーブルのキーは親ローカルのインポートエイリアスです。`package` は常に正規のレジストリセレクターです。

`Musubi.lock` はグラフを正確なジェネシス由来の `NetworkId` と最終化されたレジストリスナップショットにバインドします。選択されたワークスペースルートと不変のリリースノードを記録します。リリース、ソース、インターフェース、アーカイブ、ABI、および正確な依存エッジ暗号コミットメント値を含む。解決されたグラフがそれらを必要とする場合、並列バージョンが許可されます。

## Taira SoraFS を取得するように設定 {#configure-taira-sorafs-fetching}

Taira これはこのワークフローのパブリックテストネットです。から始めてください Taira チェックインされたチェーンおよび現在固定されたジェネシス派生ネットワーク識別子を使用したクライアント構成、 次に、プロバイダー固有の認証済みフェッチバインディングを下に追加します。A Taira リセットは〜を変えることができる `NetworkId`; 安定したチェーンから推測するのではなく、署名済みのデプロイメントプロファイルからそれを更新する UUID. アカウント署名用の資料およびプロバイダ運用者キーは、オーナー専用のソフトウェア実行ファイルに保持されなければなりません。

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

パブリックテストネットのルートから Taira の認定プロバイダーを確認してください:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

プロバイダカタログはプロバイダの識別情報と公開された API エンドポイントを提供します。選択したプロバイダから一致するオペレーター認証を取得してください。ソフトウェアランタイムはそのキーを使用して制限付きストリームトークンを要求します。トークンは CLI 引数でもロックファイルの内容でもありません。

Taira バリデータピン URL を `url` として使用しないでください。チェックインされたバリデータには埋め込み SoraFS ストレージが無効になっています。それらの `https://taira-validator-{1,2,3,4}.sora.org` API エンドポイントはピン登録を受け入れますが、アーカイブの読み取りは選択された承認プロバイダの HTTPS オリジンを使用します。

## ローカルワークフロー {#local-workflow}

上流の Iroha ワークスペースのルートから、パッケージディレクトリを作成するか移動し、Cargo を使って Musubi を実行します:

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch` は最終的なレジストリグラフを解決し、許可されている場合に `Musubi.lock` を更新し、認証された SoraFS の場所から変更不可能なローカルキャッシュを埋めます。`check`、`build`、`test`、および `package` は、それぞれの作業を行う前に同じグラフとキャッシュのチェックを実行します。

`--locked`を使用して、ロックファイルの変更を拒否します。`--offline`は、レジストリインデックスとすべての必要なアーカイブがすでにキャッシュされている場合にのみ使用してください。`--frozen`はこれら二つの制約を組み合わせます。オフラインキャッシュでミスが発生すると失敗します。Musubi は、未解決のロックファイルを書き込むことは決してありません。

依存元は、`math::add()` のような修飾された技術的呼び出しを決定論的な内部 Kotodama 名に書き換えることによってリンクされます。依存技術未エクスポート関数への呼び出しは拒否されます。インポートされたライブラリは関数を公開します。ローカルの `[[contract]]` および `[[test]]` ターゲットは明示的なパッケージターゲットのままです。

## キャッシュの検証と修復 {#cache-verification-and-repair}

パブリックキャッシュコマンドは、レジストリに公開された不変のアーカイブ上で動作します。

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` は信頼された子孫を隔離して破損させ、確定プロバイダーの証拠が許すときに正確なアーカイブを再取得します。プルーニングは、ライブの空でないミューテーションに対して意図的にフェイルクローズです。`--dry-run` を使用して機密候補を検査してください。

## パッケージ化と公開 {#packaging-and-publishing}

アーカイブを書く前にクリーンなポジティブファイルセットを検査し、その後、標準パッケージを作成します:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` は `target/package/<namespace>-<name>-<version>.car` を書きます。CAR は標準パッケージ技術マニフェスト、セマンティックリリース技術マニフェスト、正確な検証ロック、ソースツリーにバインドします。インターフェースの暗号学的ダイジェスト値、および SoraFS アーカイブ暗号学的コミットメント値。初回リリースの CLI には、個別の`pack`、`--car-out`、`--sorafs-manifest-out`、または`--source-plan-out`コマンドはありません。

公開は署名済みで再開可能なネットワークワークフローです。選択された `client.toml` には、必要な `[musubi.publication]` バインディングおよびアカウントと Taira ネットワーク構成が含まれている必要があります。ワークスペースメンバーを正確に1つパッケージしてください:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

操作ジャーナルとシード侵入境界が耐久性があることを確認するために `--detach` を使用してください。耐久性のある操作を `publish --resume <operation-id> --config client.toml` で続行します。より狭い `--recover <operation-id>` パスは再構築のみを行います未使用のプリイングレスジャーナル用の変更不可の補助記録が不足しています。公開 `--dry-run` や一般公開のアップロード代替はありません。ローカルプレフライトのために `package --list` と `package` を実行してください。

## レジストリクエリとライフサイクル {#registry-queries-and-lifecycle}

同じ Taira クライアント構成で、最終的なレジストリを検索して確認してください：

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

ヤンキングは、新しい解決策から不変のリリースを除外しますが、既存の正確なロックは再現可能なままです。まず現在のヤンクリビジョンを読み取り、その後、比較・設定ミューテーションを送信します。

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

同じパッケージ、バージョン、そして新たに読み込まれたリビジョンで `unyank` を使用してその状態を逆にします。パッケージの所有権とメンテナの役割が、公開、取り下げ、メタデータを制御します、およびアーカイブ場所の権限。グローバルエイリアスには独自の価格付き登録、リターゲット履歴、比較・設定リビジョンがあり、パッケージ所有権のショートカットではありません。

## Iroha 表面 {#iroha-surfaces}

Musubi は初回リリースの V1 の指示とクエリを使用します:

|表面|目的|
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `RegisterMusubiNamespaceBindingV1`                   |ネームスペースをその安定したホームデータスペースにバインドします。|
| `RegisterMusubiArchiveV1`                            |変更不可能な認証済みソースアーカイブ暗号化コミットメント値を登録する。|
|`AddMusubiArchiveLocationV1`|実績のある SoraFS アーカイブの場所を追加または更新する。|
| `PublishMusubiReleaseV1`                             |パッケージを請求または更新し、1つの不変のリリースを公開する。|
| `SetMusubiReleaseYankV1`                             |正確なリリースの引き抜かれた状態を比較して設定する。|
|`InviteMusubiPackageMaintainerV1`|明示的なパッケージの役割招待フローを開始します。|
| `RegisterMusubiAliasV1` / `RetargetMusubiAliasV1`    |管理されたグローバルエイリアスを登録または再ターゲットします。|
|`AssertMusubiReleaseDigestV1`|正確で不変のリリース暗号ダイジェスト値を主張してください。|
|`FindMusubiExactPackageV1`|正確なパッケージとその改訂版を1つ読む。|
| `FindMusubiExactReleaseV1`                           |正確なリリーススナップショットを1つ読み取る。|
| `FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |解決するか、最終リリース候補を一覧表示する。|
| `FindMusubiArchiveLocationsV1`                       |確定したプロバイダ支援のアーカイブ場所を読み取ります。|
| `FindMusubiAliasV1` / `FindMusubiAliasHistoryV1`     |現在のエイリアスのターゲットまたはその不変の履歴を読み取ります。|

Torii は `/v1/musubi/*` の下でアプリルートファミリーを公開します。MCP ツールは現在の `iroha.musubi.queries.*` および `iroha.musubi.instructions.*` の名前を使用します。[Torii API エンドポイント](/ja/reference/torii-endpoints.md) および [問い合わせ参照](/ja/reference/queries.md) を参照して、より広範な API マップをご覧ください。
