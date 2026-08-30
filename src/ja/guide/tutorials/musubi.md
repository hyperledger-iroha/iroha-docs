---
translation_locale: ja
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama パッケージ {#musubi-kotodama-packages}

Musubi は, Kotodama ソースパケットの初リリースパッケージマネージャです. チェーン上の正確な依存度グラフを解決し, SoraFS を認証します. ソースアーカイブ,選択されたワークスペースをコンパイルしテストし,カノニカルな CAR アーカイブを作成し, Iroha を通じて不変のリリースを発表します.

必要な場合 Musubi を使用する.

- 再利用可能な Kotodama 機能ライブラリを公開する
- `Musubi.lock`で正確な移行グラフを記入する.
- 確定した SoraFS アーカイブコミットメントから依存源を再構築する
- 1つのパッケージまたは複数のパッケージのワークスペースを構築し,テストする
- オンラインレジストリを通じてパッケージを検査,公開,抽出,メンテナンス,またはアライス

## パッケージ名 {#package-names}

Canonical パッケージセレクターは:

```text
namespace/package
```

正確なリリース識別子はバージョンを追加します:

```text
namespace/package@version
```

名前空間の前にはリード `@` が存在しない.名前空間は, `universal` などのデータスペースのルーツまたは `dex.universal` などのドメインに適したデータスペースである.パッケージが請求される前に,その構造的な名前空間を安定したホームデータスペースに結合する.

## マニフェストとロックファイル {#manifest-and-lockfile}

パッケージは,閉ざされた最初のリリースを使用する `Musubi.toml` マニフェストは宣言しなければならない. `manifest-version = 1`, Kotodama 発行 `"1"`, そして IVM ABI バージョン `1`; 代替的な表記がないか ABI モード

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

依存は正確なバージョン,ケアまたはティルド要件, `1.*`などのワイルドカード,および `>=1.0.0,<2.0.0`のような逗号分離比較セットを使用することができます.依存表の鍵は親-ローカルインポートアライスであり, `package`は常に法典的なレジストリ選択機です.

`Musubi.lock` は,グラフを精確な起源由来の `NetworkId` と最終的なレジストリスナップショットに結合します. 選択されたワークスペースルーツと不変リリースノードが記録されます.リリース,ソース,インターフェース,アーカイブ, ABI および正確な依存限界のコミットメントを含む.解析されたグラフが要求する場合,並行バージョンは許可されています.

## 設定する Taira SoraFS 引き寄せ {#configure-taira-sorafs-fetching}

Taira は,このワークフローの公開テストネットです. チェックインチェーンとネットワークアイデンティティを持つ Taira クライアント設定から始め,以下のプロバイダー特定認証取得バインドを追加します.口座署名資料とプロバイダーオペレーター鍵は,所有者のみの実行時間のファイルに留まなければならない.

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

Taira の承認されたプロバイダを公開テストネットルーツから発見する:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

プロバイダーカタログは,プロバイダーのアイデンティティと広告のエンドポイントを提供します.選択したプロバイダからマッチングオペレーターの権限を取得します.ランタイムはそのキーを使用して制限されたストリームトークンを要求します;トークンは CLI 議論もロックファイルのコンテンツもではありません.

A を使用しないでください. Taira 検証器ピン URL のように `url`. チェックインした検証機は, SoraFS 収納が無効になった `https://taira-validator-{1,2,3,4}.sora.org` エンドポイントはピン登録を受け付け,アーカイブ読み方は選択された承認されたプロバイダの HTTPS 起源について

## 地元のワークフロー {#local-workflow}

アウトストリーム Iroha ワークスペースのルーツから,パッケージディレクトリを作成または入力し,Cargoを通じて Musubi を実行します.

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

`fetch` は最終的なレジストリグラフを解決し,許可された場合,更新する `Musubi.lock` を完了し,認証された SoraFS の場所から変更できないローカルキャッシュを埋めます. `check`, `build`, `test`,および `package` は独自の作業前に同じグラフとキャッシュチェックを実行します.

`--locked` を使用してロックファイルの変更を拒絶します.レジストリインデックスとすべての必要なアーカイブが既にキャッシュされている場合にのみ, `--offline` を使用します. `--frozen` はこれらの2つの制限を組み合わせます.オフラインキャッシュは失敗します. Musubi は未解決のロックファイルを書きません.

依存関係源は, `math::add()`などの資格のある呼び出しを決定的な内部 Kotodama 名前に書き換えることでリンクされます.輸出されていない関数への依存関係呼び出しは拒否されます.輸入されたライブラリでは関数を暴露します.ローカル `[[contract]]`と`[[test]]`のターゲットはまだ明示的なパッケージ目標であり続けます.

## キャッシュチェックと修理 {#cache-verification-and-repair}

公開キャッシュコマンドは,不変でレジストリにコミットされたアーカイブで動作します:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair`隔離は信頼される子孫を腐敗させ,最終的な提供者証拠が許可するときに正確なアーカイブを再確認します. Musubi は生きた不空の切割変異を拒絶します. 分類された候補者を検査するために `--dry-run` を使用します.

## 包装及び出版 {#packaging-and-publishing}

アーカイブを書く前にクリーン・ポジティブファイルセットをチェックし,その後カノニカルパッケージを作成します:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` 書く `target/package/<namespace>-<name>-<version>.car`. 労働組合 CAR カノニカルパッケージマニフェスト,セマンティックリリースマニフェス,正確な検証ロック,ソースツリー,インターフェースダイジェストを結びつける.そして SoraFS ファイルへのコミットメント. `pack`, `--car-out`, `--sorafs-manifest-out`, または `--source-plan-out` 命令は最初のリリースで CLI.

公開は署名された,再開可能なネットワークワークフローである.選択した `client.toml` には生成 `[musubi.publication]` 結合とアカウントおよび Taira ネットワーク構成が含まれなければならない. パッケージはちょうど1 つの作業空間メンバーを含みます:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

使用 `--detach` 作業日記と種子入りの境界が耐久である後に戻る. `publish --resume <operation-id> --config client.toml`. 狭い方 `--recover <operation-id>` パースのみは 欠落した不変なサイドカーを 再現します `--dry-run` または一般的な公開アップロードバック;実行 `package --list` そして `package` 地元の先発飛行のために

## 登録に関する質問とライフサイクル {#registry-queries-and-lifecycle}

同様の Taira クライアント設定で最終的なレジスタを検索し,検査する.

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

Yanking は,既存の正確なロックが再現可能である間に,新しい解像度から不変なリリースを排除します.先は現在の yank 修正を読み,その後比較と設定の突然変異を送信します:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

`unyank` を同じパッケージ,バージョン,そして新読修改で使用してその状態を逆転します. パッケージ所有およびメンテナントの役割は公開, yank,メタデータを制御するグローバル・アライズは独自の価格登録,リターゲットの履歴,比較とセットの修正を持っています. パッケージ所有権のショートカットではありません.

## Iroha 表面 {#iroha-surfaces}

Musubi は,最初のリリース V1 の指示と查询を使用します.

|表面|目的|
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1`|安定したホームデータスペースに名前空間を結びつけます|
|`RegisterMusubiArchiveV1`|変更できない認証されたソースアーカイブコミットメントを登録する. |
|`AddMusubiArchiveLocationV1`|証明された SoraFS アーカイブ場所を追加または更新する. |
|`PublishMusubiReleaseV1`|パッケージを請求または更新し,1つの変更できないリリースを公開する. |
|`SetMusubiReleaseYankV1`|完全放出状態を比較して設定します.|
|`InviteMusubiPackageMaintainerV1`|パッケージ・ロールの誘導流を開始します. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |管理されたグローバル・アライアスを登録またはリターゲットします.|
|`AssertMusubiReleaseDigestV1`|正確な不変の放出消化を確認する|
|`FindMusubiExactPackageV1`|詳細なパッケージと修正をご覧ください.|
|`FindMusubiExactReleaseV1`|正確なリリース・スナップショットを 読んでください|
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |決定または最終的なリリース候補者をリストする.|
|`FindMusubiArchiveLocationsV1`|提供者がサポートしている最終的なアーカイブ場所を読む. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |現在の仮名標的やその不変の歴史を 読んでください.|

Torii アップルルートファミリーを暴露する `/v1/musubi/`. MCP ツールが電流を使用する `iroha.musubi.queries.` そして `iroha.musubi.instructions.*` 名前です [Torii エンドポイント](/ja/reference/torii-endpoints.md) そして [查询参照](/ja/reference/queries.md) 広範囲に API 地図
