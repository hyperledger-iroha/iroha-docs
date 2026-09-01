---
translation_locale: ja
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: f3d08a8e7fe7569ef783b93bccdc900ca74b85179a749b48b96c32028c749233
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 暗号鍵の生成 {#generating-cryptographic-keys}

`kagami keys` を使用して Iroha 3 のクライアント、ネットワークピア、バリデータの鍵素材を生成します。

## 基本的な使い方 {#basic-usage}

Iroha ソースコード作業用コピーから：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

親ディレクトリは既に存在している必要があります。ターゲットは新規であるか、既に現在のユーザーが所有している必要があり、モード`0700`で、シンボリックリンクがなく、空でなければなりません。`kagami`は`public.key`および`private.key`をモード`0600`で書き込み、キー情報は出力しません。`--pop`を使用すると、`pop.hex`も書き込みます。

`--out-dir` は、Kagami がこれらのオーナー専用のファイルシステムルールを強制できないプラットフォームでは閉じた状態になります。プライベートキーのファイルは暗号化されていないエクスポートであり、ではありません ハードウェアまたは輸出不可能な生産用暗号署名器。それを承認された保管境界にインポートし、展開手順に従って輸出を削除してください。

## アルゴリズム {#algorithms}

一般的なアルゴリズムは次の通りです:

- `ed25519` はクライアントアカウントおよびストリーミングID用です。
- `secp256k1` クライアントアカウントが secp256k1 アイデンティティを必要とする場合。
- `bls_normal` は、すべてのノードまたはネットワークピアのコンセンサスIDに対して適用されます。

使用しているビルドでサポートされている正確なアルゴリズムを次のコマンドで確認してください:

```bash
cargo run --bin kagami -- keys --help
```

## 決定論的開発キー {#deterministic-development-keys}

再現可能なテスト成果物のために、64桁の16進数でエンコードされた32バイトのシードを渡してください。オプションで `0x` プレフィックスも使用可能です:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --out-dir ./fixture-client-key
```

シードは秘密鍵の材料です。決定的なシードはローカル開発やテストのみに使用してください。`--seed-hex` を省略すると、オペレーティングシステムの乱数から本番用の鍵を生成できます。

## BLS コンセンサスキーと所持証明 {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 ノードおよびネットワークピアのコンセンサスIDは BLS-標準キーを使用します。次を使って BLS-標準キーおよび所有証明 (PoP) を生成してください:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` は `bls_normal` と組み合わせた場合だけ有効で、保管ディレクトリに `pop.hex` を追加します。署名済みジェネシスでは、投票する各バリデーターに対応する PoP が必要です。ピア設定で空でない `trusted_peers_pop` マップを指定すると、バリデーターの部分集合が選ばれます。そのマップに含まれない信頼済みピアはオブザーバーです。マップが空の場合は、すべての BLS-Normal 信頼済みピアがブートストラップ候補集合に入り、投票者の PoPs は引き続き署名済みジェネシスから提供されます。

## 拘禁出力 {#custody-output}

`kagami keys` は `--out-dir` を必要とし、プライベートキーの内容を標準出力に書き込むことは決してありません。生成されたディレクトリから `public.key`、`private.key`、およびオプションの `pop.hex` を読み取ります。各ファイルには 1 つの正規化された値が改行付きで含まれており、ファイルベースの自動化を明示的に行いやすくしています:

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

完全に生成された Kagami のヘルプについては:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
