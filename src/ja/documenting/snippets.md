---
translation_locale: ja
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# コードスニペット {#code-snippets}

生成されたスニペットは、それらを生成した Iroha リビジョンのコード、設定、およびスキーマに例を結びつけたままにします。

## リフレッシュ中 Iroha アーティファクト {#refreshing-iroha-artifacts}

Iroha 派生したスニペットはチェックインされるため、通常のサイトビルドではネットワークアクセスや兄弟リポジトリを必要としません。 それらを明示的に更新してください:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

チェックインされた`etc/refresh-iroha.ts`ワークフローは、クリーンなソースチェックアウトを`provenance/iroha.json`と照合し、`/src/snippets`および Torii OpenAPI のデータスナップショットを再生成します。および SHA-256 暗号ハッシュを更新します。コンテンツと出所の変更を一緒に確認してください。通常の依存関係のインストールと VitePress ビルドは、可変ブランチを取得せずにチェックインされたファイルを使用します。

## スニペットを含む {#including-snippets}

生成されたソースまたはローカルソースを含めるには、[VitePress コードスニペットの構文](https://vitepress.dev/guide/markdown#import-code-snippets) を使用してください:

```md
<<< @/snippets/client.template.toml
```

名前付きコード領域は、その領域名を追加することで含めることができます:

```md
<<< @/example_code/lorem.rs#ipsum
```

手書きの例は小さく保ちます。公開インターフェース、設定テンプレート、生成されたスキーマ、およびコマンド出力には、更新されたソースアーティファクトを優先します。
