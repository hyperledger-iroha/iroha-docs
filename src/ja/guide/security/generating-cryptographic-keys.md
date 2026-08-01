---
translation_locale: ja
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: ccbb076ef3e2ba45d074ad3394ac354d0c2233cdd4286c5fa7a77f0d1c413988
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 暗号鍵を生成する {#generating-cryptographic-keys}

Iroha 3 のクライアント、ピア、バリデーターの鍵素材を生成するには、`kagami keys` を使用します。

## 基本的使用 {#basic-usage}

Iroha ソースのチェックアウトから:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

通常は、JSON 出力を TOML や自動化処理にコピーするのが最も簡単です。

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

コマンドは公開鍵と露出した秘密鍵を表示します。秘密鍵は機密情報として扱い、生成した本番鍵をリポジトリにコミットしないでください。

対応している Unix プラットフォームで安全にローカルエクスポートする場合や鍵管理環境へ引き渡す場合は、秘密鍵を表示する代わりに、所有者だけがアクセスできる空のディレクトリへ新しい鍵ペアを書き込みます。

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

親ディレクトリは既に存在している必要があります。対象ディレクトリは、新規であるか現在のユーザーが既に所有しているもので、モードが `0700`、シンボリックリンクを含まず、空でなければなりません。`kagami` は `public.key` と `private.key` をモード `0600` で書き込み、秘密鍵を表示しません。`--pop` を指定すると、`pop.hex` も書き込みます。

Kagami が所有者だけにアクセスを許可するファイルシステム規則を適用できないプラットフォームでは、`--out-dir` は安全側で失敗します。秘密鍵ファイルは暗号化されていないエクスポートであり、ハードウェアで保護された、またはエクスポート不能な本番用署名者ではありません。承認済みの鍵管理環境にインポートし、デプロイ手順に従ってエクスポートしたファイルを削除してください。

## アルゴリズム {#algorithms}

一般的なアルゴリズムは:

- `ed25519` 顧客アカウントとストリーミングアイデンティティ
- `secp256k1` クライアントアカウントに secp256k1のアイデンティティが必要とする場合.
- `bls_normal` は,ビルドで BLS サポートが可能になった場合,各ノードまたはピアコンセンサス アイデンティティ.

あなたのビルドがサポートする正確なアルゴリズムをチェックします:

```bash
cargo run --bin kagami -- keys --help
```

## 決定論的な開発用鍵 {#deterministic-development-keys}

再現可能なフィクスチャには、32 バイトのシードを 64 個の 16 進文字でエンコードして渡します。任意の `0x` プレフィックスも使用できます。

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --json
```

シードは秘密鍵素材です。決定論的なシードは、ローカル開発とテストだけに使用してください。OS の乱数から本番鍵を生成する場合は、`--seed-hex` を省略します。

## BLS 合意の鍵と所有権証明書 {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 のノードとピアのコンセンサス ID は BLS-normal 鍵を使用します。BLS-normal 鍵と所有証明（PoP）を生成するには、次を実行します。

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` は `bls_normal` でのみ有効です。JSON 出力には `pop_hex` が含まれます。署名済みジェネシスでは、投票する各バリデーターに一致する PoP が必要です。ピア設定では、空でない `trusted_peers_pop` マップがバリデーターのサブセットを選択し、その空でないマップに含まれない信頼済みピアはオブザーバーになります。マップが空の場合は、BLS-normal 鍵を持つすべての信頼済みピアがブートストラップ候補集合に入り、投票するバリデーターの PoPs は引き続き署名済みジェネシスから提供されます。

## 出力フォーマット {#output-formats}

ターミナル検査のためのデフォルト出力,自動化のために `--json`,および別のスクリプトに直線指向値が必要な場合, `--compact` を使用します.

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

完全に生成された Kagami の支援:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
