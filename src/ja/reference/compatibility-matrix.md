---
translation_locale: ja
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 互換性マトリックス {#compatibility-matrix}

互換性マトリックスはクロスを示しています SDK 現在のシナリオカバレッジ Iroha 3 ドキュメントが設定されました。デフォルトでは、ページは固定されたものから生成されたバンドルデータのスナップショットを読み込みます [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) 改訂。

その行列は次のように構成されています:

- 最初の列の物語
- SDKs 残りの列全体に
- 覆われたデータ、失敗したデータ、欠損データのステータスシンボル

更新ワークフローによって検証された結果のみが、カバー済みまたは失敗として報告されます。固定されたリビジョンの証拠がないシナリオは、別のソースリビジョンから結果を引き継ぐのではなく、データなしとして表示されます。

<CompatibilityMatrixTable />

::: info
`VITE_COMPAT_MATRIX_URL` は、同梱のスナップショットを互換性のある稼働中のバックエンドで上書きする場合にのみ設定します。この変数がなければ、ページは `src/public/compat-matrix.json` を読み込みます。
:::
