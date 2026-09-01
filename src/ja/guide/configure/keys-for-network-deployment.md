---
translation_locale: ja
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ネットワーク展開のための鍵 {#keys-for-network-deployment}

すべてのネットワークは、クライアント、ネットワークピア、ブロックチェーンのジェネシス署名、そしてNPoSまたは Nexus プロファイルの場合は BLS バリデータの識別情報のために、異なる鍵素材を必要とします。

## キーが使用される場所 {#where-keys-are-used}

- クライアントの署名鍵は `[account]` の下の `client.toml` に保存されます。
- ネットワークピアの識別キーは、各ネットワークピア `config.toml` に `public_key` および `private_key` として保存されます。
- ネットワークピアの検出は、各ネットワークピアの公開鍵を`trusted_peers`で使用します。
- BLS バリデーターの保有証明は、NPoS プロファイルのために `trusted_peers_pop` に保存されます。
- ブロックチェーンのジェネシス署名は、ネットワークピアの設定にある`[genesis].public_key`と、テクニカルマニフェストを署名する際の対応する秘密鍵を使用します。

ローカルまたはテスト環境へのデプロイの場合、Kagami にこれらすべてのファイルを一緒に生成させてください:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

既存のネットワークまたはプロファイルの場合は、ガイド付きフローを使用してください。

```bash
cargo run --bin kagami -- wizard
```

## 個別の鍵ペアを生成する {#generate-individual-key-pairs}

独立した鍵素材には `kagami keys` を使用してください:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

BLS バリデータの資料には、所有証明を含めてください:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

再現可能な開発用フィクスチャのために、`--seed-hex` は正確に32バイトの16進数シークレットと一緒にのみ使用してください。本番環境に展開する場合は、省略して Kagami にオペレーティングシステムの乱数を使用させ、その後、暗号化されていない秘密鍵のエクスポートを承認された管理境界に移動してください。そのコマンドはプライベートキーを決して表示しません。

## ネットワークピアの整合性 {#peer-consistency}

すべてのバリデーターは、同じブロックチェーンのジェネシス取引、トポロジー、信頼されたネットワークピアの公開鍵、およびバリデーター PoPs に合意する必要があります。ネットワークピアの鍵が1つでも欠落していたり不一致であったりすると、ネットワークの起動やコンセンサスの達成ができなくなる可能性があります。

最小のビザンチン障害耐性(BFT)デプロイメントの場合、少なくとも4つのネットワークピアを使用してください。各ネットワークピアはそれぞれの秘密鍵を持つ必要がありますが、すべてのネットワークピアの構成には同じ信頼されたネットワークピアセットが必要です。

## クライアントアカウント {#client-accounts}

`client.toml`のクライアントアカウントは、すでにブロックチェーン上に存在している必要があります。これは、ブロックチェーンのジェネシス技術マニフェストによって、または後のトランザクションによって登録することができます。ブロックチェーンのジェネシス署名アイデンティティを長期間使用するアプリケーションアカウントとして使用しないでください。ブロックチェーンのジェネシス特権はジェネシスラウンドの間のみ適用され、運用クライアントは自分自身のアカウントと役割を使用する必要があります。
