---
translation_locale: ja
translation_source: /help/configuration-issues.md
translation_source_hash: b62b106e985933d90dab1258d3b991674dd75d14322f2326148164b0fbee0f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 設定問題解決 {#troubleshooting-configuration-issues}

このセクションでは Iroha 3 コンフィギュレーションのトラブルシューティング・ヒントを提供しています. 気をつけろ [鍵をチェックした](./overview.md#check-the-keys) 第"に,これは最も一般的な問題源であるため, Iroha.

あなたが経験している問題はここで説明されていない場合は, [テレグラム](https://t.me/hyperledgeriroha)で連絡してください.

## Docker Compose セットアップ上の時代遅れの生成 {#outdated-genesis-on-a-docker-compose-setup}

Iroha の Docker Compose バージョンを使用している場合,同等コンテナの1つが `Failed to deserialize raw genesis block` エラーで失敗する問題が発生する可能性があります.これは通常,同等,署名された生成トランザクション,および生成された構成が異なる Iroha 修正またはプロファイルによって生成されたことを意味します

この手順で失敗を確認します.

1. 現在のコンテナをチェックするには `docker ps` を使用します.生成されたプロフィールによって,通常は `hyperledger/iroha:dev` コンテナが表示されます.デフォルトの Docker Compose プロフィールは4つのピアコンテナを含んでいますが,生成した `docker-compose.yml` は異なる可能性があります.

2. ログをチェックし, `Failed to deserialize raw genesis block` エラーを探します. デイモンモードで `docker compose up -d` で Iroha を起動した場合は, `docker compose logs` コマンドを使用してください.

このような問題をトラブルシューティングする方法は, Iroha の使用に依存します.これは基本的なデモであり,ペアデータを保存する必要がない場合は, Kagami で一致するローカルネットまたは Docker Compose バンドルを再生してください.

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

その後,古いコンテナ状態を削除し,再生された `genesis.signed.nrt`, peer `config.toml`,および `client.toml` ファイルから再起動します.

Iroha インスタンスのデータを復元する必要がある場合は,次の手順を実行してください.

1. 最初の (失敗した) ピアからのデータをコピーする第2の Iroha パイーを接続します.
2. 新しいピースが最初のピースとデータを同期するまで待つ.
3. 新しい仲間を活躍させてください.
4. 調整された移行の一環としてのみ,最初のピアの生成と構成ファイルを更新します.

::: info

ライブネットワーク上のゲネスを置き換えるための一般的な自動書き直し経路はありません.これを調整された移行とみなしてください:古い状態を維持し,互換性のあるペアを提示し,オペレーターが移住計画について合意した後のみ検証者を新しい構成に移動します.

:::

## プライベート・パブリックキーのマルチハッシュフォーマット {#multihash-format-of-private-and-public-keys}

[クライアントの設定](/ja/guide/configure/client-configuration.md)を見ると,その鍵は [マルチハッシュフォーマット](https://github.com/multiformats/multihash)で表示されていることに気づく.

マルチハッシュを使用したことがない場合は,右側がキーバイト (バイトあたり2つのシンボル) の六位式表示ではなく, ASCII (または UTF-8) としてコードされているバイトであると仮定するのは自然なことです`public_key`と`private_key`の両方において文字列字母で `from_hex` を呼び出します.

文字列字母に `PrivateKey::try_from_str` を呼び出すと,正しいキーのみが得られるという仮定も自然です. だから鍵内のビットの数が間違っていれば,例えば32バイト対64はエラーメッセージになります.

この2つの仮定は誤りです 残念ながらエラーメッセージは 特定の種類の失敗を解除するのに役立っていません

修理方法: `hex_literal` を使用する.これはまた 醜い文字列を 明らかに6桁の数字の 小さなテーブルに変えるでしょう

::: warning

`try_from_str` の実装でさえ,特定の文字列が有効な `PrivateKey` であるかどうかを確認できず,そうでない場合は警告します.

文字列に無効な符号が含まれている場合など,いくつかの明らかなエラーを検出します.しかし,私たちは多くのキーフォーマットをサポートすることを目指しているため,それ以外のことはほとんどできません.指定されたアカウントの鍵が正しいプライベートキーであるかどうかを判断することもできません.指示を送信しない限り.

:::

このような微妙なミスを回避できます 例えば文字列文字から直接デセリアル化したり,意味のある場所に新しいキーペアを生成することで.
