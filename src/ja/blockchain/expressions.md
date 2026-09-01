---
translation_locale: ja
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 式、条件文、論理 {#expressions-conditionals-logic}

すべての [Iroha 命令操作](./instructions.md) は式上で動作します。各式には `EvaluatesTo` があり、これは命令実行に使用されます。アカウント名を指定することもできますが直接、いくつかの数学的または文字列操作を通じてアカウントIDを指定することもできます。また、アカウントがブロックチェーンに登録されているかどうかを確認することもできます。

`EvaluatesTo<bool>` を実装する表現を使用することで、条件付きロジックを設定し、オンチェーンでより高度な操作を実行することができます。たとえば、特定のアカウントが登録されている場合にのみ `Mint` 命令を提出することができます。

これをクエリと組み合わせることができることを思い出してください。そのため、ブロックチェーンをプログラムしていくつかの素晴らしいことを行うことができます。これが私たちがスマートコントラクトと呼ぶものであり、ブロックチェーン技術の高度な使用の定義的な特徴です。
