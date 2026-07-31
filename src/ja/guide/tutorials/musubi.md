---
translation_locale: ja
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama パッケージ {#musubi-kotodama-packages}

Musubi は Kotodama ソースパッケージのパケットマネージャーである.開発者に対して,構成可能な Kotodama 機能を共有するための Cargo のようなワークフローを提供し,グローバル・ファースト・カム・ネームテーブルではなく, SORA と Iroha 名前空間にパッケージアイデンティティを結びつけておく.

必要な場合 Musubi を使用する.

- 再利用可能な Kotodama ソースライブラリを公開する
- `Musubi.lock`で正確な移行源依存点
- 検証された SoraFS アーカイブコミットメントから依存源を再構築する
- パッケージネームスペースを同じネームスペースの dapp 契約名前のと接続する
- チェーン内レジストリを通じてパッケージを検査,公開,抽出,または偽名

## パッケージ名 {#package-names}

カノニカルパッケージIDの使用:

```text
namespace/package
```

正確なリリース参照の使用:

```text
namespace/package@version
```

名前空間の前には先頭 `@` がありません. `@` 分離符はバージョンサフイックスに留められています.

名前空間セグメントは, Kotodama dapp契約のニックネームで使用されるサフィックスに一致する:

|パッケージID |関連契約形|
| ------------------------- | ---------------------------- |
|`universal/math`|`router::universal`|
|`dex.universal/swap-core`|`router::dex.universal`|

名前空間には `<dataspace>` または `<domain>.<dataspace>` の形式があります.パッケージに dapp リンクがある場合, Musubi はすべてのリンクされた契約のニックネームがパケットと同じ名前空間サフィキスを使用していることを確認します.

## 明らかに {#manifest}

包装は `Musubi.toml` で始まる.

```toml
[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"

[exports]
functions = ["quote"]

[dapp]
namespace = "dex.universal"
contracts = ["router::dex.universal"]
```

依存は正確なバージョン,ケア要件,ティルド要求, `1.*`などのワイルドカードまたは `>=1.0.0,<2.0.0`のような比較リストを使用することができる.

`Musubi.lock`は,オンチェーンレジストリから選択したトランシティブグラフを記録する.各ロックされたノードは,そのカノンिकलパッケージ ref,選択された要件, SoraFS マネスティック・ダイジェスト,ソースアーカイブハッシュ,バイトカウント,ファイルカウント,輸出関数,決定的ソースアーカイブのプラン,および依存性アライスを保存します.ロックファイルに入れる前に 略称が解決されます.

## 地元のワークフロー {#local-workflow}

上向きの Iroha ワークスペースルーツから, Musubi を Cargo で実行します:

```bash
cargo run -p musubi -- init --namespace dex.universal --name swap-core --dapp
cargo run -p musubi -- add std.universal/math --version '^1.0.0' --alias math
cargo run -p musubi -- install --config client.toml
cargo run -p musubi -- build src/lib.ko --manifest-out target/lib.contract.json
cargo run -p musubi -- pack \
  --car-out source.car \
  --sorafs-manifest-out manifest.norito \
  --source-plan-out source-plan.norito
```

`install --offline` を使用して,ノードを問わずに正確なバージョン依存度のために未解決のロックファイルを書きます. CI で `install --locked` を使用して,古いロックファイルを拒否します.

`build`は, `math::add()` などの呼び出しを決定的な内部 Kotodama 関数名に書き換えることでキャッシュされた依存源をリンクします. 依存が輸出していない関数への呼び出しを拒絶します.Musubi v1 ライブラリは機能のみである:状態宣言,トリガー,コトバブロック,コンスタンタまたは他の非機能契約項目を含む依存源が拒否されます.

## 源を入手するアーカイブ {#fetching-source-archives}

Musubi は,キャッシュのサブコマンドで解決する際にまたは後に欠落した依存源を取得することができます:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

SoraFS ゲートウェイプロバイダの仕様を1つまたは複数の場合を使用する.

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

プロバイダー・ペイロードファイルとゲートウェイプロバイダーは,一つのフリッチオペレーションで相互に除外されます.複数のロックされたパケットが欠けている場合は, `package=<dependency-alias>`, `package=<namespace/package@version>`,`package=<namespace/package>`または `manifest=<64-hex SoraFS manifest digest>`というゲートウェイプロバイダを対象とします.

ゲートウェイ `base-url` そして `privacy-url` 値を使用しなければならない `https://` ローカルテストゲートウェイは使用できます `http://localhost`, `http://127.0.0.1`, または `http://[::1]` とのみ `--gateway-allow-insecure-localhost`. ストリームトークンはランタイム認証で, `Musubi.lock`.

## 出版 {#publishing}

`pack` は,決定的な BLAKE3-256 ソースアーカイブハッシュと源バイトとファイルカウントを計算する. `--car-out`, `--sorafs-manifest-out`,または `--source-plan-out` が供給されたとき,また決定的な SoraFS CAR の有用な負荷, SoraFS マネスティックを作成します.そして Musubi のソースアーカイブプランは,同じソースファイルセットから.

公開前に乾燥したランを使用します:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

無駄で `--dry-run`, `publish` の下にデフォルトアーティファクトを書き込みます `.musubi/dist/<namespace>/<name>/<version>/`, 選択的にマニフェストとペイルロードをアップロードする Torii やってるんだ SoraFS ストレージピン端点 `--upload`, 生成されたデータを記録する SoraFS ピンと提出する `PublishMusubiRelease` 設定された Iroha 顧客です

公開されたリリースには,以下の内容が含まれなければならない.

- 無駄な法典的なソースアーカイブ
- 決定的なソースアーカイブプラン
- 輸出された少なくとも1つの Kotodama 関数
- 引っ張られた放出を選択しない依存記録
- パッケージ名空間に一致する契約のニックネームがある場合,dappリンク

## 登録に関する質問とライフサイクル {#registry-queries-and-lifecycle}

登録を検索し,検査する

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Yanking は新しい解像度からリリースを隠しますが,既存のロックファイルの再生が可能です.

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi は `namespace/package` をカノニカルなパッケージ名とすることで,グローバル・ネームクォッティングを回避します.名前空間への公開は,その Kotodama dapp 名前空間に使用された同じ所有者または授權モデルによって許可されなければならない.キュレーティングされたグローバルショートアライズはパッケージ所有権とは別である. `SetMusubiShortAlias` は `CanSetMusubiShortAlias` の許可を必要とし,ターゲットパケットには既に少なくとも1つのアクティブリリースが必要です.

## Iroha 表面 {#iroha-surfaces}

Musubi は,最初のクラス Iroha の指示と問い合わせを使用します.

|表面|目的|
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease`|変更できないパッケージを公開する.|
|`YankMusubiRelease`|既存のリリースを引っ張られたようにマークします.|
|`SetMusubiShortAlias`|パッケージID に キュレーションされたグローバル・ショートアライスを結びつけます.|
|`AssertMusubiReleaseExists`|具体的なパッケージバージョンが必要である.|
|`FindMusubiReleaseByRef`|包装の正確な参照でリリースを入手してください.|
|`FindMusubiPackageVersions`|パッケージIDのバージョンをリストする. |
|`FindMusubiPackageReleases`|パッケージIDのリリース概要をリストする. |
|`SearchMusubiPackages`|名前空間とテキストによってパッケージの概要を検索する. |
|`FindMusubiShortAliasByName`|キュレーティングされた短名を解決する|

Torii 明らかにする Musubi HTTP 経路ファミリー `/v1/musubi/`. 代理人向け MCP 道具は, `iroha.musubi.` 偽名です [Torii エンドポイント](/ja/reference/torii-endpoints.md) そして [查询参照](/ja/reference/queries.md) 広範囲に API 地図
