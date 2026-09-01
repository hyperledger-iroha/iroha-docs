---
translation_locale: ja
translation_source: /help/configuration-issues.md
translation_source_hash: 4b96a4f740203aace2e8c091ed89156146ba117e23eff1d08f3bbb01de92f24a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 設定問題のトラブルシューティング {#troubleshooting-configuration-issues}

このセクションでは、Iroha 3 の設定に関するトラブルシューティングのヒントを提供します。まず [鍵を確認した](./overview.md#check-the-keys) を確認してください。これは Iroha における問題の最も一般的な原因です。

もしあなたが経験している問題がここに記載されていない場合は、[テレグラム](https://t.me/hyperledgeriroha) を通じてお問い合わせください。

## Docker Compose 設定での古いブロックチェーンジェネシス {#outdated-genesis-on-a-docker-compose-setup}

Iroha の Docker Compose バージョンを使用しているときに、ネットワークピアコンテナの1つが`Failed to deserialize raw genesis block`エラーで失敗する問題に遭遇する可能性があります。これは通常、ネットワークピア、署名されたブロックチェーンのジェネシストランザクション、および生成された構成が、異なる Iroha のリビジョンまたはプロファイルによって作成されたことを意味します。

これらの手順で故障を確認してください:

1. `docker ps` を使用して現在のコンテナを確認してください。生成されたプロファイルに応じて、通常は `hyperledger/iroha:dev` のコンテナが表示されます。デフォルトの Docker Compose プロファイルには 4 つのネットワークピアコンテナが含まれていますが、生成された `docker-compose.yml` は異なる場合があります。

2. ログを確認して、`Failed to deserialize raw genesis block` エラーを探してください。`docker compose up -d` を使ってデーモンモードで Iroha を起動した場合は、`docker compose logs` コマンドを使用してください。

このような問題をトラブルシューティングする方法は、Iroha の使用に依存します。これは基本的なデモであり、ネットワークピアのデータを保持する必要がない場合、Kagami を使用して、対応する localnet または Docker Compose バンドルを再生成してください：

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

次に、古いコンテナの状態を削除し、再生成された`genesis.signed.nrt`、ネットワークピア`config.toml`のファイル、および`client.toml`から再起動します。

もし Iroha インスタンスのデータを復元する必要がある場合は、次の手順を行ってください:

1. 最初の（故障した）ネットワークピアからデータをコピーする、2番目の Iroha ネットワークピアを接続します。
2. 新しいネットワークピアが最初のネットワークピアとデータを同期するのを待ってください。
3. 新しいネットワークピアをアクティブにしたままにしてください。
4. 調整された移行の一環として、最初のネットワークピアのブロックチェーンのジェネシスおよび設定ファイルのみを更新します。

::: info

ライブネットワーク上でブロックチェーンのジェネシスを置き換えるための一般的な自動書き換えパスはありません。これは協調的な移行として扱ってください：古い状態を保持し、互換性のあるネットワークピアを立ち上げ、オペレーターが移行計画に合意した後にのみバリデーターを新しい構成に移動します。

:::

## 秘密鍵と公開鍵のマルチハッシュ形式 {#multihash-format-of-private-and-public-keys}

もし[クライアント設定](/ja/guide/configure/client-configuration.md)を見れば、そこのキーが[マルチハッシュ形式](https://github.com/multiformats/multihash)で与えられていることに気付くでしょう。

もしこれまでマルチハッシュを扱ったことがなければ、右辺がキーのバイトの16進表現（二つの記号ごとに）ではないと考えるのは自然なことですバイトではなく、ASCII（または UTF-8）としてエンコードされたバイトであり、`public_key`と`private_key`の両方のインスタンス化において文字列リテラルに対して`from_hex`を呼び出します。

文字列リテラルに対して `PrivateKey::try_from_str` を呼び出すと、正しいキーだけが得られると考えるのも自然です。したがって、例えばキーのビット数を間違えて取得した場合、例えば32バイトと64バイトでは、エラーメッセージが表示されることになります。

これらの両方の前提は間違っています。残念ながら、エラーメッセージはこの特定の種類の失敗のデバッグには役に立ちません。

修正方法： `hex_literal` を使用します。これにより、見苦しい文字列も明らかに16進数の小さな表に変わります。

::: warning

たとえ`try_from_str`の実装であっても、与えられた文字列が有効な`PrivateKey`であるかどうかを検証し、無効であれば警告することはできません。

それはいくつかの明らかなエラー、例えば文字列に無効な記号が含まれている場合を検出します。しかし、私たちは多くのキー形式をサポートすることを目指しているため、それ以上のことはあまりできません。また、指示を送信しない限り、そのキーが指定されたアカウントの正しい秘密鍵であるかどうかも判断できません。

:::

このような微妙なミスは、例えば文字列リテラルから直接デシリアライズしたり、適切な場所で新しいキー・ペアを生成したりすることで回避できます。
