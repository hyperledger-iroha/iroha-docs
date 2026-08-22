---
translation_locale: ja
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# との作業 Iroha バイナリ {#working-with-iroha-binaries}

の Iroha 3 オペレーターのワークフローは、次の 3 つの主要なバイナリを中心に展開します。

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) ピアデーモンを実行するため
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) のために CLI およびオペレータコマンド
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) キー、ジェネシス、ローカルネット、プロファイル用

## ソースからビルドする {#build-from-source}

上流のワークスペース ルートから:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

リリースバイナリは次の場所で入手できます。 `target/release/`.

コマンド サーフェスを検査するには:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## リポジトリから直接実行 {#run-directly-from-the-repository}

グローバルに何もインストールしたくない場合は、次を使用します。 `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker 画像 {#docker-image}

上流のワークスペースでは、 `kagami localnet` そして `kagami docker` 生成する
Docker Compose チェックアウトされたコードに一致するファイル。の `hyperledger/iroha:dev`
画像は生成されたファイルで使用できます。

を実行します。 CLI コンテナ内:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

走る Kagami コンテナ内:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

ピアを起動するには、最初にローカルネットと Compose ファイルを生成します。

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## どのバイナリを使用すればよいですか? {#which-binary-should-i-use}

- 使用 `irohad` ピアを起動または操作するとき。
- 使用 `iroha` 台帳のクエリ、トランザクションの送信、またはオペレーターのエンドポイントの検査が必要な場合。
- 使用 `kagami` キー、ジェネシスマニフェスト、プロファイルバンドル、またはローカルネットアセットが必要な場合。

## 影武者リリースの公開と展開 {#kagemusha-release-publication-and-rollout}

影武者 V4 公開とアクティベーションは、別々の保護された境界を越えます。

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` です
  macOS 専用、root 専用パブリッシャー。ピン留めされたものを認証します Kagami バイナリと
  正確な 16 ファイルの候補は、欠落しているものを公開します
  `promotion-record-v4.norito` 置換なしで、成功のみを報告します
  正確な 17 ファイルのプロモートされたリリースが検証された後。
- `iroha offline kagemusha rollout-v4 create-expectations` 署名されたものを検証します
  予約、注文されたバリデータ資格シール 4 枚、正確な
  すでに承認されているトランザクション ワイヤと、その前に信頼できる最終的なアンカー
  署名された期待値を置き換えずに公開すること。
- `iroha offline kagemusha rollout-v4 submit` 明示的な必要がある
  `--write-authorized` 同意。永続的に記録し、正確な情報を再検証します。
  ネットワーク書き込みまたは再試行前の期待値。アン `Applied` ステータスはそうではありません
  十分です: このコマンドは、コミットされたブロック、ファイナリティ サクセサーも検証します。
  チェーン、および承認を伴う完全なトランザクション ワイヤー。
- `iroha offline kagemusha rollout-v4 finalize-receipt` は、厳密な送信ジャーナルが
  再検証された後にのみ同じ証明アンカー付き証拠を収集し、独立したレシート発行者で
  署名して、正規のレシートを置換せずに公開します。

チェックインされた影武者本番準備ワークフローは検証のみです。
認証されたパブリッシャー、パブリッシュバリデーター資格を呼び出しません。
シールを貼ったり、アクティベーションを送信したり、ファイナリティ受領書を作成したりできます。成功したワークフロー
したがって、run はプロモーションや実際の展開を証明するものではありません。

これらのコマンドはローカルのプリミティブであり、生きた証拠に代わるものではありません。あ
実際の物理的なアプリの認証がなければ、実稼働ロールアウトはブロックされたままになります。
候補アーティファクト、保護された 4 つのホスト シールすべて、ランタイム ガバナンス、
署名入力、ライブ 4 検証者の提出とファイナリティ証拠、および
正規の有効構成投影。秘密鍵を保管し、
認証マテリアル、および保護されたプロモーション固有の識別子
ランタイム保管。これらをソース管理されたドキュメントにコピーしないでください。
オペレーターチケット。
