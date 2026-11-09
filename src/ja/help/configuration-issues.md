---
translation_locale: ja
translation_source: /help/configuration-issues.md
translation_source_hash: 9d153d9cb8ce0341b35ba5a7e3823198e58464768e2a9a92ff8a5723f85e9351
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 設定問題のトラブルシューティング {#troubleshooting-configuration-issues}

このセクションでは、Iroha 3 の設定に関するトラブルシューティングのヒントを提供します。まず [鍵を確認した](./overview.md#check-the-keys) を確認してください。これは Iroha における問題の最も一般的な原因です。

もしあなたが経験している問題がここに記載されていない場合は、[テレグラム](https://t.me/hyperledgeriroha) を通じてお問い合わせください。

## Docker Compose 設定での古いブロックチェーンジェネシス {#outdated-genesis-on-a-docker-compose-setup}

Iroha の Docker Compose バージョンを使用しているときに、ネットワークピアコンテナの1つが`Failed to deserialize raw genesis block`エラーで失敗する問題に遭遇する可能性があります。これは通常、ネットワークピア、署名されたブロックチェーンのジェネシストランザクション、および生成された構成が、異なる Iroha のリビジョンまたはプロファイルによって作成されたことを意味します。

キットのディレクトリで `python3 poc.py logs` を実行すると、バリデータのログを確認できます。 同じリビジョンのバイナリをビルドして Docker で 4 台のバリデータを起動する手順は、[Iroha 3 を起動](/ja/get-started/launch-iroha.md) を参照してください。

同じネットワークを再起動するには、`python3 poc.py down`、`python3 poc.py up` の順に実行します。`state/` は 4 つの Docker ボリュームと一緒に保管してください。

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
