---
translation_locale: ja
translation_source: /index.md
translation_source_hash: 3b2ad4ee285a821b56c9cf6fd3f4a8431f1cfa478e88082b45788765d68ed833
translation_status: machine-validated
translation_engine: nllb-200-ct2

layout: home

hero:
  name: Hyperledger Iroha 3
  text: "文書化"
  tagline: "SORA Nexus, SDKs,およびオペレーターのワークフローのための決定的なブロックチェーンプラットフォーム"
  image:
    src: /icon.svg
    alt: "Hyperledger Iroha 3 ロゴ"
  #actions:
  #- theme: alt
  #  text: View on GitHub
  #  link: https://github.com/hyperledger-iroha/iroha

nexusPortal:
  eyebrow: SORA Nexus
  title: "Iroha 3 / SORA Nexus に基づく"
  details: "Taira テストネットで開始し,現在のトランザクションフローを学び,生産準備のアプリケーションを構築するために集中されたレシピを使用します."
  primaryAction:
    text: "Taira で開始する"
    link: /ja/get-started/sora-nexus-dataspaces
  secondaryAction:
    text: "料理本を閲覧する"
    link: /ja/cookbook/
  recipes:
    title: "人気なレシピ"
    items:
      - title: "取引を提出し確認する"
        link: /ja/cookbook/submit-and-verify-transactions
      - title: "変形可能な資産を移動する"
        link: /ja/cookbook/fungible-assets
      - title: "查询本簿状態"
        link: /ja/cookbook/query-ledger-state
      - title: "ストリームイベント"
        link: /ja/cookbook/stream-events

features:
  - icon:
      dark: /start.svg
      light: /start-light.svg
    title: "始めよう"
    details: "現在のワークスペースを構築し,ローカルネットワークを起動して, Iroha 3 CLI を使用を開始します"
    link: /ja/get-started/
  - icon:
      dark: /build.svg
      light: /build-light.svg
    title: "ガイド"
    details: "SDKs,ベストプラクティス,構成,セキュリティ,およびオペレーターのワークフローを検索する"
    link: /ja/guide/
  - icon:
      dark: /explained.svg
      light: /explained-light.svg
    title: "建築"
    details: "理解する Torii, Sumeragi, Norito, IVM, そして Nexus データ空間モデル"
    link: /ja/blockchain/iroha-explained
  - icon:
      dark: /reference.svg
      light: /reference-light.svg
    title: "参照"
    details: "現在のバイナリー,ジェネシス, Torii および互換性参照ページを参照してください"
    link: /ja/reference/
footer: true
---

<hr style="margin-top: 3rem;">
<p style="font-weight: 200; font-size: 0.875rem;">Hyperledger Iroha の一部である <a href="https://www.lfdecentralizedtrust.org/projects/tag/ledger-technology" target="_blank">LF Decentralized Trust</a>. 詳しくは <a href="https://iroha.tech/" target="_blank">iroha.tech</a>.</p>
