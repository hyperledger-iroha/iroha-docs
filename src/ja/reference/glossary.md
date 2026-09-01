---
translation_locale: ja
translation_source: /reference/glossary.md
translation_source_hash: ab484310e7e0b0662c1d4bb133e7ae337c71b09b5fdc8e678581234d74ee9b29
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 用語集 <!-- omit in toc --> {#glossary}

ここでは、すべての Iroha 関連のエンティティの定義を見つけることができます。

- [ネットワークピア](#peer)
- [資産](#asset)
- [ビザンチン障害耐性（BFT）](#byzantine-fault-tolerance-bft)
- [Iroha コンポーネント](#iroha-components)
  - [Sumeragi（天皇）](#sumeragi-emperor)
  - [Torii（ゲート）](#torii-gate)
  - [Kura（倉庫）](#kura-warehouse)
  - [Kagami(教師と模範および/または鏡)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [マークルツリー（暗号ハッシュツリー）](#merkle-tree-hash-tree)
  - [スマートコントラクト](#smart-contracts)
  - [トリガー](#triggers)
  - [バージョン管理](#versioning)
  - [聖（ネットワークピア評価システム）](#hijiri-peer-reputation-system)
- [Iroha モジュール](#iroha-modules)
- [Iroha 命令操作 (ISI)](#iroha-special-instructions-isi)
  - [ユーティリティ Iroha 操作手順](#utility-iroha-special-instructions)
  - [コア Iroha 命令操作](#core-iroha-special-instructions)
  - [ドメイン固有の Iroha 命令操作](#domain-specific-iroha-special-instructions)
  - [カスタム Iroha 特別指示](#custom-iroha-special-instruction)
- [Iroha クエリ](#iroha-query)
- [ビューの変更](#view-change)
- [世界状態ビュー（WSV）](#world-state-view-wsv)
- [リーダー](#leader)

## ブロックチェーン台帳 {#blockchain-ledgers}

ブロックチェーン台帳は、財務記録を保持するためにブロックチェーン技術を使用するデジタル記録管理システムです。これらは、価格、ニュース、取引情報などの財務記録に使用されていた昔ながらの帳簿にちなんで名付けられました。

中世の時代には、ブロックチェーンの元帳は公開されており、一般の人々が閲覧して正確性を確認することができました。この考え方は、保存されたデータの有効性を確認できるブロックチェーンベースのシステムに反映されています。

## ネットワークピア {#peer}

Iroha のネットワークピアとは、他の Iroha プロセスおよびクライアントアプリケーションが接続できる Iroha プロセスインスタンスを意味します。単一のマシンは複数の Iroha ネットワークピアをホストすることができます。ネットワークのピアは、そのリソースと能力に関しては平等ですが、重要な例外があります：Iroha ネットワークのブートストラップ段階では、ネットワークのピアのうちの一つだけがブロックチェーンのジェネシスブロックを実行します。

他のブロックチェーンでは、同じ概念をノードやバリデーターと呼ぶことがあります。

ネットワークピアは、そのホストシステム上のプロセスであることがあります。また、Docker コンテナや Kubernetes ポッドに含まれることもあります。

## 資産 {#asset}

ブロックチェーンの文脈において、資産とはブロックチェーン上で価値のある対象を表現したものです。

資産に関する追加情報は[ここ](/ja/blockchain/assets.md)で入手可能です。

### 代替可能な資産 {#fungible-assets}

これらの資産は、交換可能であるため、同じ種類の他の資産と簡単に交換することができます。

例として、同じ通貨のすべての単位は価値が等しく、商品を購入するために使用することができます。一般的に、代替可能な資産は、紙幣や硬貨の摩耗を除けば、外見上同一です。

### 非代替性資産 {#non-fungible-assets}

非代替性資産は、その特定の特徴と希少性により独自で価値があり、その価値は他の資産と比較することはできません。

- 絵画の価値は、画家、描かれた時期、そしてその絵に対する人々の関心によって変わることがあります。
- 同じ通りにある二軒の家でも、維持管理のレベルは異なる場合があります。
- 宝飾品メーカーは通常、さまざまなデザインの範囲を提供しています。

### 鋳造可能な資産 {#mintable-assets}

資産は、同じ種類のものをさらに発行できる場合、発行可能です。

### 非鋳造資産 {#non-mintable-assets}

資産の初期量が一度指定されて変更されない場合、それは非発行可能と見なされます。

[ブロックチェーンのジェネシスブロック](/ja/guide/configure/genesis.md) は、この情報を Iroha の設定に設定します。

## ビザンチン障害耐性（BFT） {#byzantine-fault-tolerance-bft}

ネットワーク内に一定割合の悪意ある参加者が含まれていても適切に機能できる特性。Iroha は、そのピアツーピアネットワーク内で最大33%の悪意ある参加者がいても機能することができる。

## Iroha コンポーネント {#iroha-components}

Rust は Iroha の機能を含むモジュールです。

### Sumeragi（天皇） {#sumeragi-emperor}

コンセンサスを担当する Iroha モジュール。

### Torii（ゲート） {#torii-gate}

[ネットワークピア](#peer)のための着信リクエスト処理ロジックを持つモジュールです。これは、着信指示および HTTP クエリを受信、受理、ルーティングするため、および実行時の設定更新を行うために使用されます。

### Kura（倉庫） {#kura-warehouse}

永続ブロックストレージ。Kura は署名付きブロック、ブロック暗号ハッシュ、高さインデックス、回復補助レコード、およびブロック確定を保存しますディスク上のロスターメタデータ。[ワールド・ステート・ビュー](#world-state-view-wsv)は、ステートデータのスナップショットが利用できない場合やローカルブロックストアより遅れている場合に、Kura ブロックから再構築されます。[Kura ストレージ](/ja/blockchain/world.md#kura-storage)を参照してください。

### Kagami(教師および模範および/または鏡) {#kagami-teacher-and-exemplar-and-or-looking-glass}

一般的に使用されるデータのジェネレーターです。暗号鍵ペア、ブロックチェーンのジェネシスブロック、ドキュメントなどを生成できます。

### マークルツリー（暗号ハッシュツリー） {#merkle-tree-hash-tree}

各ブロック高での状態を検証および確認するために使用されるデータ構造。Iroha の現在の実装は二分木です。詳細については[ウィキペディア](https://en.wikipedia.org/wiki/Merkle_tree)を参照してください。

### スマートコントラクト {#smart-contracts}

スマートコントラクトは、特定の条件が満たされたときに実行されるブロックチェーンベースのプログラムです。Iroha では、スマートコントラクトは[コア Iroha 命令操作](#core-iroha-special-instructions)を使用して実装されています。

### トリガー {#triggers}

特定のブロックの完了時や時間（いくつかの注意点あり）などに Iroha 特別命令を呼び出すことを可能にするイベントタイプ。トリガーの詳細は [ここ](/ja/blockchain/triggers.md) を参照してください。

### バージョン管理 {#versioning}

各リクエストには、それが属する API バージョンのラベルが付けられています。これにより、Iroha クライアント/ピアソフトウェアの異なるバイナリバージョンの組み合わせが相互運用できるようになり、結果として Iroha ネットワークでのソフトウェアアップグレードが可能になります。

### 聖（ネットワークピア評価システム） {#hijiri-peer-reputation-system}

Iroha の評価システム。これは、実績のある[ネットワークピア](#peer)とのコミュニケーションを優先し、悪意のある[ネットワークピア](#peer)によって引き起こされる被害を減らすことを可能にします。

## Iroha モジュール {#iroha-modules}

Iroha に対するカスタム機能を提供するサードパーティの拡張機能。

## Iroha 命令操作 (ISI) {#iroha-special-instructions-isi}

Iroha に付属するスマートコントラクトのライブラリ。これらはトランザクションまたは登録済みのイベントリスナー経由で呼び出すことができます。ISI [ここ](/ja/blockchain/instructions.md) についての詳細。

#### ユーティリティ Iroha 操作手順 {#utility-iroha-special-instructions}

この[イシ](#iroha-special-instructions-isi)のセットには、`If`のような論理的指示、`Notify`のような入出力関連、`Sequence`のような構成があります。それらは主に[カスタム指示](#custom-iroha-special-instruction)として使用されます。

### コア Iroha 命令操作 {#core-iroha-special-instructions}

[特別な指示](#iroha-special-instructions-isi) はすべての Iroha 配備に付属しています。これにはいくつかの [ドメイン特化](#domain-specific-iroha-special-instructions) および [ユーティリティの指示](#utility-iroha-special-instructions) が含まれます。

### ドメイン固有の Iroha 命令操作 {#domain-specific-iroha-special-instructions}

ドメイン固有の活動に関連する指示：資産、アカウント、ドメイン、ネットワークピア管理など。これらは、[ワールド・ステート・ビュー](#world-state-view-wsv) に対して安全かつ確実に変更を加えるために必要なツールを提供します。

### カスタム Iroha 特別指示 {#custom-iroha-special-instruction}

[Iroha モジュール](#iroha-modules)で提供された指示、クライアントまたは第三者によるもの。これらは[コア指示](#core-iroha-special-instructions)を使用してのみ構築できます。Iroha のソースコードをフォークして変更することは推奨されません。指示操作が Iroha の展開において[ネットワークピア](#peer)によって合意されていない場合、それは障害として扱われるため、修正版のインスタンスを実行している[ネットワークピア](#peer)のアクセスは取り消されます。

## Iroha クエリ {#iroha-query}

世界状態ビューを変更せずに読み取る要求。[ここ](/ja/blockchain/queries.md)のクエリについての詳細。

## ビューの変更 {#view-change}

合意の試みが失敗した場合に行われるプロセス。通常、これには新しい[リーダー](#leader)の選出が伴います。

## 世界状態ビュー（WSV） {#world-state-view-wsv}

現在のブロックチェーンの状態のインメモリ表現。WSV には`World`、確定済みブロックの暗号ハッシュ、トランザクションのインデックスが含まれます。コンセンサストポロジー、およびクエリで使用される派生インデックス。これは確定済みブロックを通じてのみ更新され、[Kura](#kura-warehouse) から再構築することができます。[ワールド・ステート・ビュー](/ja/blockchain/world.md#world-state-view-wsv) を参照してください。

## リーダー {#leader}

中で Iroha ネットワークでは、ネットワークのピアがランダムに選ばれ、特別な特権が与えられます 次のブロックを形成すること。この特権は、達成するネットワークでは取り消される可能性があります [ビザンチン障害耐性](#byzantine-fault-tolerance-bft) 経由 [ビューの変更](#view-change).
