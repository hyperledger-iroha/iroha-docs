---
layout: home

hero:
  name: Hyperledger Iroha 3
  text: Documentation
  tagline:
    Deterministic blockchain platform for SORA Nexus, SDKs, and operator
    workflows
  image:
    src: /icon.svg
    alt: Hyperledger Iroha 3 logo
  #actions:
  #- theme: alt
  #  text: View on GitHub
  #  link: https://github.com/hyperledger-iroha/iroha

nexusPortal:
  eyebrow: SORA Nexus
  title: Build on Iroha 3 / SORA Nexus
  details:
    Start on the Taira testnet, learn the current transaction flow, and use
    focused recipes to build production-ready applications.
  primaryAction:
    text: Start on Taira
    link: /get-started/sora-nexus-dataspaces
  secondaryAction:
    text: Browse cookbook
    link: /cookbook/
  recipes:
    title: Popular recipes
    items:
      - title: Submit and verify a transaction
        link: /cookbook/submit-and-verify-transactions
      - title: Move fungible assets
        link: /cookbook/fungible-assets
      - title: Query ledger state
        link: /cookbook/query-ledger-state
      - title: Stream events
        link: /cookbook/stream-events

features:
  - icon:
      dark: /start.svg
      light: /start-light.svg
    title: Get Started
    details:
      Build the current workspace, launch a local network, and start using
      the Iroha 3 CLI
    link: /get-started/
  - icon:
      dark: /build.svg
      light: /build-light.svg
    title: Guide
    details:
      Find SDKs, best practices, configuration, security, and operator
      workflows
    link: /guide/
  - icon:
      dark: /explained.svg
      light: /explained-light.svg
    title: Architecture
    details:
      Understand Torii, Sumeragi, Norito, IVM, and the Nexus data-space
      model
    link: /blockchain/iroha-explained
  - icon:
      dark: /reference.svg
      light: /reference-light.svg
    title: Reference
    details:
      Consult the current binary, genesis, Torii, and compatibility
      reference pages
    link: /reference/
footer: true
---

<hr style="margin-top: 3rem;">
<p style="font-weight: 200; font-size: 0.875rem;">Hyperledger Iroha is part of <a href="https://www.lfdecentralizedtrust.org/projects/tag/ledger-technology" target="_blank">LF Decentralized Trust</a>. Learn more at <a href="https://iroha.tech/" target="_blank">iroha.tech</a>.</p>
