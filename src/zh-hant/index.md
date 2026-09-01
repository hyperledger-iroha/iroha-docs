---
translation_locale: zh-hant
translation_source: /index.md
translation_source_hash: 3b2ad4ee285a821b56c9cf6fd3f4a8431f1cfa478e88082b45788765d68ed833
translation_status: machine-validated
translation_engine: nllb-200-ct2

layout: home

hero:
  name: Hyperledger Iroha 3
  text: "說明文件"
  tagline: "面向 SORA Nexus、SDKs 與營運方工作流程的確定性區塊鏈平台"
  image:
    src: /icon.svg
    alt: "Hyperledger Iroha 3 標誌"
  #actions:
  #- theme: alt
  #  text: View on GitHub
  #  link: https://github.com/hyperledger-iroha/iroha

nexusPortal:
  eyebrow: SORA Nexus
  title: "以 Iroha 3 / SORA Nexus 建置"
  details: "從 Taira 測試網路開始，了解目前的交易流程，並透過聚焦的操作手冊建置可投入正式環境的應用程式。"
  primaryAction:
    text: "開始使用 Taira"
    link: /zh-hant/get-started/sora-nexus-dataspaces
  secondaryAction:
    text: "瀏覽操作手冊"
    link: /zh-hant/cookbook/
  recipes:
    title: "熱門操作指南"
    items:
      - title: "提交和驗證交易"
        link: /zh-hant/cookbook/submit-and-verify-transactions
      - title: "移轉同質化資產"
        link: /zh-hant/cookbook/fungible-assets
      - title: "查詢帳本狀態"
        link: /zh-hant/cookbook/query-ledger-state
      - title: "串流事件"
        link: /zh-hant/cookbook/stream-events

features:
  - icon:
      dark: /start.svg
      light: /start-light.svg
    title: "快速開始"
    details: "建置目前的工作區、啟動本機網路，並開始使用 Iroha 3 CLI"
    link: /zh-hant/get-started/
  - icon:
      dark: /build.svg
      light: /build-light.svg
    title: "指南"
    details: "查閱 SDKs、最佳實務、設定、安全性和營運方工作流程"
    link: /zh-hant/guide/
  - icon:
      dark: /explained.svg
      light: /explained-light.svg
    title: "架構"
    details: "了解 Torii、Sumeragi、Norito、IVM 與 Nexus 的資料空間模型"
    link: /zh-hant/blockchain/iroha-explained
  - icon:
      dark: /reference.svg
      light: /reference-light.svg
    title: "參考"
    details: "查看目前的二進位檔、創世設定、Torii 與相容性參考頁面"
    link: /zh-hant/reference/
footer: true
---

<hr style="margin-top: 3rem;">
<p style="font-weight: 200; font-size: 0.875rem;">Hyperledger Iroha 是 <a href="https://www.lfdecentralizedtrust.org/projects/tag/ledger-technology" target="_blank">LF Decentralized Trust</a> 的一部分。更多資訊請造訪 <a href="https://iroha.tech/" target="_blank">iroha.tech</a>。</p>
