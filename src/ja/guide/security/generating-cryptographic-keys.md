---
translation_locale: ja
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 暗号鍵を生成する {#generating-cryptographic-keys}

Iroha 3 のクライアント,ピア,および検証キーの材料を生成するために`kagami keys` を使用する.

## 基本的使用 {#basic-usage}

Iroha ソースのチェックアウトから:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON アウトपुटは通常, TOML または自動化にコピーするのが最も簡単です.

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

命令は公開鍵と開示されたプライベート鍵を印刷する.私钥を秘密資料として扱う;生成された生産鍵を委ねない.

## アルゴリズム {#algorithms}

一般的なアルゴリズムは:

- `ed25519` クライアントアカウント,ストリーミングアイデンティティ,およびほとんどの開発ネットワーク.
- `secp256k1` セック256K1口座の身分が必要なら
- `bls_normal`は,ビルドで BLS サポートが可能になったときの検証器コンセンサスキーです.

あなたのビルドがサポートする正確なアルゴリズムをチェックします:

```bash
cargo run --bin kagami -- keys --help
```

## 決定論的な発展の鍵 {#deterministic-development-keys}

複製可能な固定装置については,種を:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

種は私密材料で 地元の開発や試験にのみ使用します

## BLS 持ち主の証明書 {#bls-proofs-of-possession}

NPoS および Nexus 検証者プロフィールには, BLS 認証キーおよび PoPs が要求される.

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

労働組合 JSON 含まれている `pop_hex` 当時は `--pop` 生成されたトポロジーまたは `trusted_peers_pop` プロフィールで要求されるエントリー.

## 出力フォーマット {#output-formats}

ターミナル検査のためのデフォルト出力,自動化のために `--json`,および別のスクリプトに直線指向値が必要な場合, `--compact` を使用します.

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

完全に生成された Kagami の支援:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
