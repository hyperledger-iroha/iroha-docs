---
translation_locale: zh-hant
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 互換性矩陣 {#compatibility-matrix}

顯示相容性矩陣顯示 SDK 目前的情景覆蓋
Iroha 3 按預設,頁面將生成的捆綁快照加載
從被住的中 [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha)
修改.

該矩陣由:

- **故事** 在第一個列中
- **SDKs** 在剩下的欄位上
- **狀態符號** 已覆蓋,未完成和缺失的數據

只有更新工作流程驗證的結果才會被報到,
沒有證據顯示的情況如下:
沒有資料,而不是傳承另一種源改圖的結果.

<CompatibilityMatrixTable />

::: info
裝置 `VITE_COMPAT_MATRIX_URL` 只是用一張
沒有這個變量,頁面會負載
`src/public/compat-matrix.json`.
:::
