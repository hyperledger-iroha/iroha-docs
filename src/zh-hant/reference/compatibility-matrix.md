---
translation_locale: zh-hant
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 相容性矩陣 {#compatibility-matrix}

相容性矩陣顯示了當前 Iroha 3 文件集的跨 SDK 場景覆蓋.預設情況下,該頁面將從注入的 [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha)修訂中生成的捆綁快照載入.

矩陣由以下組成:

- 首列的故事
- SDKs 在剩餘列中
- 覆蓋,失敗和缺失資料的狀態符號

只有透過更新工作流進行驗證的結果被報道為覆蓋或失敗.沒有證據的場景顯示為缺失資料,而不是繼承來自另一個源修改結果.

<CompatibilityMatrixTable />

::: info
設定 `VITE_COMPAT_MATRIX_URL` 僅用於覆蓋捆綁的快照,使用相容的現場後端.如果沒有該變數,頁面將載入`src/public/compat-matrix.json`.
:::
