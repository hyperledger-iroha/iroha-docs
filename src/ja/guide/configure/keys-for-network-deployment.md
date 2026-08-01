---
translation_locale: ja
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ネットワーク部署の鍵 {#keys-for-network-deployment}

各ネットワークにはクライアント,同級者,ジェネシス署名,およびNPoSまたは Nexus プロフィールについては, BLS 認証人アイデンティティの異なるキー素材が必要です.

## 鍵 が 使われる場所 {#where-keys-are-used}

- クライアントのサインキーは `client.toml` で, `[account]` の下に保管されます.
- ピア・アイデンティティキーは,それぞれのピア `config.toml` に `public_key` と `private_key` として保管されます.
- ピア・ディスカバリーは `trusted_peers` で各ピアの公開鍵を使用します.
- BLS 認証器 NPoS プロフィールに対する所有権証明は, `trusted_peers_pop` に保管されます.
- ジェネシスサインは,マニフェストの署名時に同級構成で `[genesis].public_key` と一致するプライベートキーを使用します.

ローカルまたはテストデプロイメントでは, Kagami がこれらのすべてのファイルを一緒に生成させてください.

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

既存のネットワークまたはプロフィールでは,ガイドフローを使用します:

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## 単一のキーペアを生成する {#generate-individual-key-pairs}

`kagami keys` を独立鍵材に使用する:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

BLS 認証材料には,所有権証明書を含む.

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--seed` を再生可能な開発装置にのみ使用する.生産部署のために,新しい鍵を生成し,リポジトリの外でプライベート鍵を保存する.

## 同級 者 の 一致 {#peer-consistency}

すべての検証者は同じ生成トランザクション,トポロジー,信頼性のあるピアパブリックキー,および認証器 PoPs に一致する必要があります.単一の欠落または不一致したピアキーがネットワークの起動または合意に達するのを妨げる可能性があります.

バイザンティアの欠陥耐性最小の部署のために,少なくとも4つのピアを使用してください.各ピアには独自のプライベートキーが必要ですが,すべてのピア構成は同じ信頼性の高いピアセットを必要とします.

## 顧客口座 {#client-accounts}

`client.toml` のクライアントアカウントは,既にチェーン上で存在している必要があります.これはゲネスマニストまたは後のトランザクションで登録することができます.長年のアプリケーションアカウントとしてゲネス署名アイデンティティを使用することを避けましょう;ジェネシス・ラウンドでのみ適用され,生産顧客は独自のアカウントと役割を使用する必要があります.
