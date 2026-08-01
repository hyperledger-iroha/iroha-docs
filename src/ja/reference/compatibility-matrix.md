---
translation_locale: ja
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 互換性マトリックス {#compatibility-matrix}

互換性マトリックスでは,現在の Iroha 3 ドックセットのクロス SDK シナリオカバーが表示されます.デフォルトとして,ページはピンされた [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha)修正から生成されたバンドルインスタントショットをロードします.

このマトリックスには以下のものが含まれる.

- 最初のコラムの物語
- SDKs 残りの列にわたって
- 覆われた,失敗した,欠落したデータのステータスシンボル

リフレッシュワークフローで確認された結果のみがカバーまたは失敗として報告されます. 固定修正の証拠のないシナリオは,別のソース修正からの結果を継承するよりも欠けているデータとして表示されます.

<CompatibilityMatrixTable />

::: info
`VITE_COMPAT_MATRIX_URL` を設定して,並べられたスナップショットを互換性のあるライブバックエンドで覆うだけ.この変数なしでは,ページがロードされる `src/public/compat-matrix.json`.
:::
