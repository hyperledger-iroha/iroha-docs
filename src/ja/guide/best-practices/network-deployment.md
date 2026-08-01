---
translation_locale: ja
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 312f9cb3c6fd937b3e7c30ea27d1876ea7901cfa79eced352611db99bbca4a70
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ネットワーク展開 {#network-deployment}

Iroha ネットワークを協調されたシステムとして扱う.ネットワークがブロックを起動し続けられる前に,検証者は起源,トポロジー,信頼性のある同類,コンセンサス関連構成について合意する必要があります.

## 環境分離 {#environment-separation}

- 地域開発,共有テストネット,ステージ化,生産のために別々の設定パネルを保持する.
- すべての使い捨て環境のための新しい鍵を生成する.生産中にローカルネットまたは Taira キー素材を再利用しないでください.
- ピア・コンフィギュレーション クライアント コンフィギュレーティング シグネス ジェネシー スクリプト 部署メモを バージョンリリースアーティファクトとして一緒に保存します.
- プライベートキーをリポジトリやデプロイメントテンプレートの外に保存します.

[ネットワーク部署のキー](/ja/guide/configure/keys-for-network-deployment.md)を参照してください.

## 創世記 と トポロジー {#genesis-and-topology}

- すべての検証者は同じ署名された創始取引,信頼性の高いピアセット,トポロジー,およびプロフィールが要求するときに認証者の所有権証明を使用してください.
- 少なくとも4つの検証器を使用して バイザンティアの欠陥耐性最小の部署を行う.
- 観測者は投票したり,提案したり,収集したりしませんが,それでもストレージ,ブロックシンクロング,ネットワーク帯域幅を消費します.
- 単同編集ではなく,基因,実行者,トポロジーの変化を調整された移行として扱います.

[Genesis](/ja/reference/genesis.md), [Peer Management](/ja/guide/configure/peer-management.md),および [パフォーマンスとメトリクス](/ja/guide/advanced/metrics.md#node-count-and-quorum).

## Torii とネットワークアクセス {#torii-and-network-access}

- Torii をホストまたはプライベートネットワークの外に暴露された場合,リバースプロキシやファイアウォールの後ろに置きます.
- TLS を終了し,部署に必要な時に基本認証,速度制限,要求サイズ制御を端に適用します.
- 環境に必要なエンドポイントのみを公表する.オペレーターとテレメトリの経路は,公開読みに利用可能な経路よりもより制限されるべきです.
- 同僚が遠隔トラフィックを直接受け入れるべきでない場合,聴衆のアドレスをホスト-ローカルインターフェースに結合します.

[Torii エンドポイント](/ja/reference/torii-endpoints.md)および [仮想プライベートネットワーク](/ja/guide/security/vpn.md)を参照してください.

## 合意と能力 {#consensus-and-capacity}

- コンセンサスタイマーを調節する前に展開を測定します.ネットワーク,ストレージ,実行層が追いついている間にのみ遅延を減らすことができます.
- 順番の方向を観察するだけでなく 速度の短いサンプルだけではありません 順番が安定した負荷中に増加すると ネットワークは過積載します
- 基準値ごとに有効な Sumeragi パラメータ,テレメトリプロフィール,検証者数,ネットワーク RTT,作業負荷の形状,ハードウェア詳細を記録する.
- レイテンシー,トラフィック,バックプレッシャーシグナルを比較した後のみ コレクターファノウットを増加します.

[パフォーマンスと指標](/ja/guide/advanced/metrics.md)を参照してください.

## Bare-Metalとプロセス管理 {#bare-metal-and-process-management}

- 各同類の `config.toml`,プライベートキー,ストレージディレクトリ,ポートを別々に保管する.
- systemd のようなプロセスマネージャーを使用し,明示的に再起動,ログリング,リソースポリシーを使用します.
- テストトポロジーを管理されたホストに翻訳する際に,生成した README を保存し, Kagami のローカルネットバンドルからコマンドを開始します.

[Bare Metal](/ja/guide/advanced/running-iroha-on-bare-metal.md)で動作する Iroha を参照してください.
