---
translation_locale: ja
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 字典 <!-- omit in toc --> {#glossary}

Iroha に関連したすべてのエンティティの定義は,ここにあります.

- [同級者](#peer)
- [資産](#asset)
- [バイザントの故障耐容性 (BFT) ](#byzantine-fault-tolerance-bft)
- [Iroha 構成要素](#iroha-components)
  - [Sumeragi (皇帝)](#sumeragi-emperor)
  - [Torii (ゲート)](#torii-gate)
  - [Kura (倉庫)](#kura-warehouse)
  - [Kagami(教師と模範と/または鏡]](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [メークル樹 (ハッシュ樹) ](#merkle-tree-hash-tree)
  - [スマート契約](#smart-contracts)
  - [触発機](#triggers)
  - [バージョン](#versioning)
  - [ヒジリ (同等評価システム) ](#hijiri-peer-reputation-system)
- [Iroha モジュール](#iroha-modules)
- [Iroha 特別指示 (ISI) ](#iroha-special-instructions-isi)
  - [ユーティリティ Iroha 特殊指示](#utility-iroha-special-instructions)
  - [核心 Iroha 特別の指示](#core-iroha-special-instructions)
  - [ドメイン特有の Iroha 特殊指示](#domain-specific-iroha-special-instructions)
  - [カスタム Iroha 特殊指示](#custom-iroha-special-instruction)
- [Iroha 問い合わせ](#iroha-query)
- [ビュー変更](#view-change)
- [世界状態の見方 (WSV) ](#world-state-view-wsv)
- [リーダー](#leader)

## ブロックチェーンのレジャー {#blockchain-ledgers}

ブロックチェーンのレジャーとは,ブロックチェーン技術を用いて財務記録を保存するデジタル記録システムである.これらは価格やニュース,取引情報などの金融記録に使用された旧式の書籍にちなんで名付けられている.

中世時代には,レジャー・ブックが公開され,閲覧および正確性の検証が行われました.この考えは,保存されたデータの有効性を確認できるブロックチェーンベースのシステムに反映されています.

## 同級者 {#peer}

Iroha のペアとは,他の Iroha プロセスおよびクライアントアプリケーションが接続できる Iroha プロセスのインスタンスを意味します.単一のマシンでは複数の Iroha ペアをホストすることができます.Iroha ネットワークのブートストラップ段階での生成ブロックを実行するピアは,重要な例外を除いて,資源と能力に関して等しい.

他のブロックチェーンは,ノードや検証器と同じ概念を指す可能性があります.

ピアは宿主システム上のプロセスであり,また Docker コンテナとKubernetes ポッドに収められる.

## 資産 {#asset}

ブロックチェーンの文脈では,資産はブロックチェーン上の価値あるオブジェクトを表すものです.

資産に関する追加情報については [で](/ja/blockchain/assets.md).

### 浮動資産 {#fungible-assets}

これらの資産は,交換可能であるため,同じタイプの他の資産に容易に交換することができる.

例として,同じ通貨のすべての単位は価値で平等であり,商品を購入するために使用できます.通常,銀貨やコインの磨損を除いて,浮動資産は外観的に同一です.

### 変形性でない資産 {#non-fungible-assets}

変形性でない資産は,特殊な特徴と希少性のためにユニークで価値があり,その価値は他の資産と比較することはできません.

- 絵画の価値は芸術家,その描かれた時期,そして大衆の興味によって異なる.
- 同じ通りにある2軒の家は 維持レベルが違うかもしれません
- ジュエリーメーカーは通常,さまざまなデザインを提供します.

### 保存可能な資産 {#mintable-assets}

同じタイプの複数の資産が発行される場合,資産は製造可能である.

### 貯蔵できない資産 {#non-mintable-assets}

資産の初期額が1回指定され,変更されない場合,それは不可能なものとみなされます.

[Genesisブロック](/ja/guide/configure/genesis.md)は,この情報を Iroha 構成に設定する.

## BFT バイザントの故障耐容性 {#byzantine-fault-tolerance-bft}

Iroha は,ペア・トゥ・ペアネットワーク内の最大33%の悪意のあるアクターと機能する能力を有する.

## Iroha 部品 {#iroha-components}

Rust 機能を含むモジュール Iroha.

### Sumeragi (皇帝) {#sumeragi-emperor}

Iroha モジュールは,合意に責任を負う.

### Torii ゲート {#torii-gate}

[peer](#peer) の受信リクエスト処理論理を有するモジュールは,受信指示や HTTP 查询,および実行時間の設定更新を受信し,転送するために使用されます.

### Kura (倉庫) {#kura-warehouse}

継続的なブロックストレージ. Kura は,ディスク上の署名ブロック,ブロックハッシュ,高度インデックス,復元サイドカー,およびコミットロスターメタデータを保存します. [World State View](#world-state-view-wsv)は,ステート・スナップショットが利用できないときまたはローカルブロックストアの後ろで Kura のブロックから再構築されます.[Kura 貯蔵](/ja/blockchain/world.md#kura-storage)を参照してください.

### Kagami 教師と模範と/または鏡) {#kagami-teacher-and-exemplar-and-or-looking-glass}

一般に使用されるデータ生成器.暗号鍵ペア,ゲネスブロック,ドキュメントなどを生成できます.

### メークル樹 (ハッシュ樹) {#merkle-tree-hash-tree}

Iroha の現在の実装は二重木である.詳細については[ウィキペディア](https://en.wikipedia.org/wiki/Merkle_tree)を参照してください.

### スマート契約 {#smart-contracts}

スマート契約は,特定の条件が満たされたときに実行されるブロックチェーンベースのプログラムです. Iroha スマート契約は, [核 Iroha 特殊指示](#core-iroha-special-instructions).

### 触発機 {#triggers}

事件のタイプで, Iroha 特定のブロックコンビート,時間 (いくつかの注意事項を含む) などに関する特別な指示 [ここに](/ja/blockchain/triggers.md).

### バージョン {#versioning}

各リクエストは,属している API バージョンでラベル付けされている.これは, Iroha クライアント/ピアソフトウェアの異なるバイナリーバージョンの組み合わせが相互操作することを可能にするため,その一方で, Iroha ネットワークにおけるソフトウェアアップグレードを可能にします.

### ヒジリ (同等評判システム) {#hijiri-peer-reputation-system}

Iroha コミュニケーションの優先順位を設定できる [同級者](#peer) 良きトラック記録を持ち,悪意のある行為による損害を減らす [同級者](#peer).

## Iroha モジュール {#iroha-modules}

Iroha への第三者の拡張機能が,カスタム機能を提供する.

## Iroha 特殊指示 (ISI) {#iroha-special-instructions-isi}

Iroha を備えたスマートコントラクトのライブラリ.これらの契約は,取引または登録されたイベント聴衆を通じて呼び出すことができます.詳細は ISI [で](/ja/blockchain/instructions.md)

#### 便利性 Iroha 特殊指示 {#utility-iroha-special-instructions}

[isi](#iroha-special-instructions-isi)のこのセットには, `If`のような論理的指示, `Notify`のようなI/O関連および `Sequence`などの組成が含まれています.それらは主に [カスタム指示](#custom-iroha-special-instruction)として使用されます.

### 核心 Iroha 特殊指示 {#core-iroha-special-instructions}

[Iroha の部署ごとに提供される特別指示](#iroha-special-instructions-isi).これらの中には, [ドメイン特有の](#domain-specific-iroha-special-instructions)と [ユーティリティ指令](#utility-iroha-special-instructions)が含まれます.

### Iroha ドメイン特別の特別指示 {#domain-specific-iroha-special-instructions}

[World State View](#world-state-view-wsv)に安全かつ安全な方法で変更を行うために必要なツールを提供する.

### カスタム Iroha 特殊指示 {#custom-iroha-special-instruction}

指示は [Iroha モジュール](#iroha-modules), クライアントや第三者によって作られる. [核心説明書](#core-iroha-special-instructions). フォークリングと修正 Iroha ソースコードは推奨されない,特別指示が [同級者](#peer) 1 年間 Iroha 配備は故障として扱われるので, [同級者](#peer) 変更されたインスタンスを実行すると アクセスが撤回される.

## Iroha 問い合わせ {#iroha-query}

世界状態ビューを修正することなく読む要求. 查询については[ここで](/ja/blockchain/queries.md).

## 変更表示 {#view-change}

合意の試みが失敗した場合に行われるプロセス.これは通常,新しい [リーダー](#leader) の選出を伴う.

## 世界状態の見方 (WSV) {#world-state-view-wsv}

ブロックチェーンの現在の状態を内存で表現します WSV 含有する `World`, 約束されたブロックハッシュ,トランザクションインデックス,コンセンサストポロジー,クエリで使用される誘導インデックスは.更新されるのは約束されたブロックのみで, [Kura](#kura-warehouse). 見て下さい [世界 状態 の 見方](/ja/blockchain/world.md#world-state-view-wsv).

## リーダー {#leader}

イロハネットワークでは,ペアがランダムに選択され,次のブロックを形成する特別な特権を与えられる.この特権は, [ビザンチン故障タレランス](#byzantine-fault-tolerance-bft) を達成したネットワークで [ビュー変更](#view-change)を通じて取り消すことができる.
