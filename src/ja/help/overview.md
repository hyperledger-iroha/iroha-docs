---
translation_locale: ja
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# トラブルシューティング {#troubleshooting}

このセクションは、Iroha を使用中に問題が発生した場合に役立つことを目的としています。何か問題が発生した場合は、まず [鍵を確認する](#check-the-keys) を行ってください。それでも解決しない場合は、各ステージのトラブルシューティング手順を確認してください。

- [インストールの問題](./installation-issues.md)
- [設定の問題](./configuration-issues.md)
- [展開の問題](./deployment-issues.md)
- [統合の問題](./integration-issues.md)

もしあなたが経験している問題がここに記載されていない場合は、[テレグラム](https://t.me/hyperledgeriroha) を通じてお問い合わせください。

## 鍵を確認してください {#check-the-keys}

ほとんどの問題は、キーが一致していないことが原因で発生します。これが理由で、私たちはこのルールに従うことをお勧めします：何か問題が起きた場合は、まずキーを確認してください。

簡単な説明はこちらです：ネットワークピアのキーが一致しない場合に発生するエラーメッセージを区別することはできません 信頼できるネットワークピアの配列内のキーと照合すると、ネットワークピアの公開鍵が公開されてしまうためです。 したがって、もし Helm チャートや環境変数を通じてキーが定義された Kubernetes デプロイメントを持っている場合、構成された内容を比較してください [`public_key`](/ja/reference/peer-config/params.md#param-public-key), [`private_key`](/ja/reference/peer-config/params.md#param-private-key), そして [`trusted_peers`](/ja/reference/peer-config/params.md#param-trusted-peers) より高次の障害を調査する前に、値を確認すること。

迷ったら、[新しい鍵のペアを生成する](/ja/guide/security/generating-cryptographic-keys.md)。
