---
translation_locale: ja
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 最高 の 実践 {#best-practices}

このセクションは Iroha アプリケーションとネットワークのための生産指針を収集します. これは,実行する機能ではなく,あなたが取る必要がある決定によって組織されます.

共有されたテストネットリハーサル,生産開始,または主要クライアントリリース前にチェックリストとして使用します.

## カテゴリー {#categories}

|カテゴリー|集中する|
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [応用開発](./application-development.md) |クライアントの設定,トランザクション提出,リテージ,イベント,クエリ,エージェント支援開発 |
| [データモデリング](./data-modeling.md) |ドメイン,アカウント,資産, NFTs,メタデータ,オフチェーンデータ,命名条約 |
| [ネットワーク展開](./network-deployment.md) |創世記,トポロジー,ピアキー, Torii 曝露,合意設定,環境分離 |
| [運行](./operations.md)|観測能力,ランブック,バックアップ,変更管理,容量チェック,インシデント処理|
| [安全とアクセス](./security-and-access.md) |秘密処理,許可,技術会計,ネットワークアクセス,監査経路|
| [放出準備](./release-readiness.md)|ローカルネット Taira, Minamoto,互換性のチェック,ライブネットワークの保護措置,ロールバック計画 |

## 横切断規則 {#cross-cutting-rules}

- ローカル開発,共有テストネット,および生産構成を別にしておく.
- ゲネシス,ピアトポロジー,エグゼクターポリシー,およびキー素材を制御されたデプロイメントアーティファクトとして扱う
- 耐久性レジスタントのモデルを意図的に記述する. 大型,プライベートまたは高処理データにメタデータをダンプグラウンドとして使用しないでください.
- 拒否,期限切れ,再試し,遅延状態を処理できる idempotent のワークフローを通じてトランザクションを送信します.
- 狭い許可,専用技術アカウント,および明示的な運用ランブックが管理者アクセスより優先される.
- まず使い捨てローカルネットワークでの行動を証明し,その後メインネットの操作前に Taira または他の共有テストネットで練習する.

## 関連参照 {#related-references}

- [構成と管理](/ja/guide/configure/overview.md)
- [安全性](/ja/guide/security/)
- [性能とメトリック](/ja/guide/advanced/metrics.md)
- [互換性マトリックス](/ja/reference/compatibility-matrix.md)
- [Torii エンドポイント](/ja/reference/torii-endpoints.md)
- [許可トークン](/ja/reference/permissions.md)
