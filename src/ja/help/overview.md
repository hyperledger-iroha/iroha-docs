---
translation_locale: ja
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 問題を解く {#troubleshooting}

このセクションは, Iroha で作業する際に問題が発生した場合に役立ちます.何か問題が起きた場合,まず [ のキー](#check-the-keys) を確認してください.それが役に立たない場合は,各段階のトラブルシューティング指示を確認してください.

- [設置問題](./installation-issues.md)
- [構成問題](./configuration-issues.md)
- [部署問題](./deployment-issues.md)
- [統合問題](./integration-issues.md)

あなたが経験している問題はここで説明されていない場合は, [テレグラム](https://t.me/hyperledgeriroha)で連絡してください.

## 鍵をチェック {#check-the-keys}

ほとんどの 問題 は 匹敵 し ない 鍵 の 結果 に なり ます.それゆえ,この 規則 を 遵守 する こと が お勧め さ れ て い ます.何か が 間違っ たら,先 で 鍵 を チェック する.

素早く説明します. 同僚の鍵が信頼性の高い同級者の鍵と一致しないときに発生するエラーメッセージを区別することは不可能です なぜなら,同類の公開鍵が暴露されるからですしたがって,環境変数によって定義されたキーを持つヘルムチャートまたはKubernetesデプロイメントがある場合は,より高いレベルでの故障を調査する前に設定した [`public_key`](/ja/reference/peer-config/params.md#param-public-key),[`private_key`](/ja/reference/peer-config/params.md#param-private-key),および [`trusted_peers`](/ja/reference/peer-config/params.md#param-trusted-peers)の値を比較してください.

疑いの場合は, [ が新しいキーペア](/ja/guide/security/generating-cryptographic-keys.md) を生成する.
