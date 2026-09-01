---
translation_locale: ja
translation_source: /help/deployment-issues.md
translation_source_hash: c220e127bc8081c9b457dfd67101aa44fb80d79c461cc7a7eda99584d74a8f19
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 展開の問題のトラブルシューティング {#troubleshooting-deployment-issues}

このセクションでは、Iroha 3 の導入に関するトラブルシューティングのヒントを提供します。ここに記載されていない問題が発生した場合は、[テレグラム](https://t.me/hyperledgeriroha) を通じてお問い合わせください。

## 生成されたアーティファクトから始める {#start-with-generated-artifacts}

ローカルおよびテストのデプロイでは、手書きのネットワークピアファイルの代わりに、Kagami によって生成されたアーティファクトを使用してください。

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

生成されたディレクトリには、ネットワークピアの設定、ブロックチェーンのジェネシス資料、起動スクリプト、そして Iroha 3 ビルドライン用の README が含まれています。

## ネットワークピアが起動しません {#peer-does-not-start}

まずこれらの項目を確認してください:

- `iroha3d --config <path>` はネットワークピア自身の TOML ファイルを指しています。
- ネットワークピア設定の `public_key` と `private_key` は同じ鍵ペアに属しています。
- `genesis.public_key` は、ブロックチェーンのジェネシス取引に署名するために使用された鍵と一致します。
- バリデータネットワークのピアIDは BLS-Normalキーを使用し、`trusted_peers_pop`にはローカルキーおよび信頼されたネットワークピアの所有証明エントリが含まれています。
- Torii と P2P のポートは、他のプロセスによってすでにバインドされていないこと。
- Kura ストアディレクトリは同じチェーンに属しており、別のネットワークプロファイルからコピーされたものではありません。

デーモンが複数の TOML レイヤーを読み取るときは、設定トレースを使用してください:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker と作成 {#docker-and-compose}

現在の Kagami ローカルネット出力から Compose を生成し、コマンドライン引数と設定ファイルがチェックアウトされたコードと一致するようにしてください:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

もし Compose デプロイメントが開始してから停止した場合、デーモンのログを次の点について確認してください:

- 不一致 `chain`
- 異なるブロックチェーンのジェネシストランザクションまたは技術マニフェストを使用しているネットワークピアの1つ
- コンテナネットワーク内でのみ機能する広告された P2P アドレス
- ブロックチェーンのジェネシスを再生成した後のローカルボリュームの再利用

新しいブロックチェーンのジェネシスをテストする場合、スタックを再起動する前に古い Kura ボリュームを削除してください。古いブロックストレージを新しいブロックチェーンのジェネシスと一緒に保持すると、リプレイが失敗します。

## クバネティス {#kubernetes}

Kubernetesの場合、各バリデーターをステートフルなインフラとして扱います:

- 各ネットワークピアに安定した識別キーと安定した永続ボリュームを与える
- クラスター内から他のネットワークピアが解決できる P2P アドレスを公開する
- ロールアウトの不変設定として、構成とブロックチェーンのジェネシスファイルをマウントする
- ブロックチェーンのジェネシスやトポロジーの変更は、設定マップの自動更新としてではなく、意図的に展開する

もしポッドが繰り返し再起動する場合、ポッド内でレンダリングされた設定と期待される設定を比較してください [`peer.template.toml`](/ja/reference/peer-config/index.md#template) そしてネットワークピアが古いものを再生しているかどうかを確認します Kura データ。

## ソラのプロフィール {#sora-profile}

プライベートまたはローカルの Iroha 3 デプロイメントで Nexus、SoraFS、またはマルチレーンフローを使用する場合は、Sora プロファイルを有効にして標準デーモンを起動する必要があります:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

同じネットワーク内のバリデーター間で、同じプロファイルを一貫して使用してください。

公開 Taira バリデーターは専用ランチャーを使用し、これにより Taira の正確なチェーン、ロスター、無効化された埋め込み-SoraFS ストレージ、およびランタイム署名者プロファイルが強制されます。起動する前にレンダリングされた Taira 設定を検証してください:

```bash
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

公開を開始しないでください Taira ジェネリックを持つバリデーター `iroha3d`; 見る [`iroha3d` CLI 参照](/ja/reference/iroha3d-cli.md) 強制されたプロファイルのために。
