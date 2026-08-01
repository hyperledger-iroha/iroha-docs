---
translation_locale: ja
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 表現,条件,論理 {#expressions-conditionals-logic}

すべての [Iroha 特殊指示](./instructions.md) は表現で動作します.各式には命令実行に使用される `EvaluatesTo` があります.アカウント名を直接指定することができますが,いくつかの数学または文字列操作を通じてアカウント ID を指定することもできます.ブロックチェーンのアカウントも登録されているか確認できます

`EvaluatesTo<bool>` を実装する表現を使用して,条件論理を設定し,チェーン上でより洗練された操作を実行できます.例えば,特定のアカウントが登録されている場合にのみ, `Mint` の指示を送信することができます.

これをクエリと組み合わせることで ブロックチェーンは驚くべきことをできるようプログラムできます これはスマートコントラクトと呼ばれるもので ブロックチェーン技術の高度な利用の特徴です
