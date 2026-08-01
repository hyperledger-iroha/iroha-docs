---
translation_locale: ja
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 部署の問題解決 {#troubleshooting-deployment-issues}

このセクションでは, Iroha 3 のデプロイメントのトラブルシューティングヒントを提供しています.あなたが経験している問題はここで説明されていない場合は, [テレグラム](https://t.me/hyperledgeriroha) を介して連絡してください.

## 製造された文物から始めましょう {#start-with-generated-artifacts}

Kagami によって生成されたアーテファクトを手書きのペアファイルではなく,ローカルおよびテストデプロイメントのために好みます.

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

生成されたディレクトリには,ピアコンフィギュア,ゲネス資料,スタートスクリプト,および Iroha 3 ビルドラインのための README が含まれています.

## ピアは始まらない {#peer-does-not-start}

まずこれらの項目をチェックします

- `irohad --config <path>`は,同級者の自身のファイル TOML のポイントである.
- ピア設定の `public_key` と `private_key` は,同じキーペアに属します.
- `genesis.public_key` は創始取引に署名するために使用された鍵と一致します.
- validator peer identities は BLS-Normal keys を使用し, `trusted_peers_pop` にはローカルキーと信頼できる peers の所有権証明のエントリが含まれています.
- Torii と P2P のポートは,もう別のプロセスで拘束されていない.
- Kura ストアディレクトリは同じチェーンに属しており,他のネットワークプロファイルからコピーされていない.

TOML 層以上を読み出すとき,設定追跡を使用する.

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker およびコンポーズ {#docker-and-compose}

生成 現在の Kagami localnet アウトプットから複製し,コマンドラインのアーグメントと構成ファイルがチェックアウトコードに一致するようにします:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

構成部署が開始され,その後停止した場合,デモンログをチェックしてください.

- 合わない `chain`
- 異なる生成トランザクションまたはマニフェストを使用する同級者
- 広告された P2P アドレスが,コンテナネットワーク内でのみ動作する
- 発生再生後,ローカル・ボリューム再利用

新しいゲネスをテストする際,スタックを再起動する前に古い Kura ボリュームを削除します.新しいゲネスで古いブロックのストレージを維持すると再プレイが失敗します.

## クーバーネットス {#kubernetes}

Kubernetesでは,各検証器をステートフルインフラとして扱う.

- 各同類に安定したアイデンティティキーと安定した持続的なボリュームを与える
- P2P アドレスを開示し,他の同類がクラスター内から解決することができる.
- マウントコンフィギュレーションとジェネシスファイルは,ロールアウトのための不変なコンフィギューメントとして
- すべての生成またはトポロジー変更を故意に展開し,自動的に構成地図更新としてではなく

ポッドが繰り返し再起動した場合,ポッド内のレンダリング設定と予想される [`peer.template.toml`](/ja/reference/peer-config/index.md#template)を比較し,ピアが古い Kura データを再生しているかどうかを確認します.

## ソラプロフィール {#sora-profile}

Nexus,SoraFS または多レーンフローを使用する Iroha 3 部署は,Soraプロフィールが有効にされているデモンを起動する必要があります:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

同じネットワークの検証者間で一貫して同じプロフィールを使用します.
