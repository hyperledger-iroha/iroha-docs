---
translation_locale: ja
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# コードスニッペット {#code-snippets}

生成されたスニッペットは,それらを作成した Iroha の修正からコード,構成,およびスケーマに結合した例を保持します.

## リフレッシング Iroha アーティファクト {#refreshing-iroha-artifacts}

Iroha から派生したスニッペットは,通常のサイトビルドでネットワークアクセスや兄弟レポジトリを必要としないようにチェックされます.それらを明示的に更新します:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

チェックインした [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) ワークフローは,クリーンソースのチェックアウトを `provenance/iroha.json`, 再生する `/src/snippets` そして Torii OpenAPI スナップショット,更新情報 SHA-256 ハッシュ. コンテンツと起源の変更を一緒にレビューする. 通常依存性インストールおよび VitePress 組み込みは変形可能なブランチを集めずにチェックインしたファイルを消費します.

## スニッペットを含む {#including-snippets}

[VitePress コードスニペット構文](https://vitepress.dev/guide/markdown#import-code-snippets) を使用して生成されたまたはローカルソースを含む:

```md
<<< @/snippets/client.template.toml
```

指定されたコード領域は,その地域名を添加することで追加することができる.

```md
<<< @/example_code/lorem.rs#ipsum
```

手書きの例を小さくしてください.公開インターフェース,構成テンプレート,生成されたスケーマ,コマンド出力のために更新したソースアーテファクトを好みます.
