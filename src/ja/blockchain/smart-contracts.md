---
translation_locale: ja
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 7c35c609442df65328fa619b6673be76f801cfc2abc28afd853d7fe61e439e9c
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 賢明な契約 {#smart-contracts}

Iroha 取引は, `Executable` の役に立たない負荷を実行する.現在のデータモデルでは:

- `Executable::Instructions`: Iroha 特別指示の順序付けされたセット
- `Executable::ContractCall`: 展開された契約インスタンスの副参照呼び出し
- `Executable::Ivm`: Iroha VM バイトコード
- `Executable::IvmProved`: Iroha VM バイトコードで,事前に計算された指示の重複と証明義務がある

Kotodama は Iroha の高水準スマートコントラクト言語です。`.ko` ソースファイルは決定論的な IVM バイトコードにコンパイルされ、通常はデプロイ用の `.to` アーティファクトとして保存されます。Kotodama の対象は IVM のみです。RISC-V や WebAssembly は対象ではありません。

最初のリリースでサポートされるのは ABI バージョン 1 のみです。syscall と pointer-ABI のポリシーはコントラクトの受け入れ時および実行時に無条件で適用され、実行時互換性を切り替える設定はありません。

## 賢明 な 契約 を いつ 使う か {#when-to-use-smart-contracts}

取引を直接表現できる場合,通常の指示を使用する.

- 登録または非登録物件
- ミント,バーン,または転送資産
- 更新されたメタデータ
- 許可を授与または撤回する
- トイガーを実行する
- チェーン上のパラメータを設定する

スマートコントラクトを使用すると,トランザクションがパケットされた論理を必要とし,静的な指示シーケンスとして表現するのが難しい場合,またはデプロイされた契約インスタンスを参照で呼び出す必要があるとき.

## IVM 実行可能 {#ivm-executables}

`Executable::Ivm`には原始の IVM バイトコードがあります.ノードは,そのバイトコードをチェーンに設定された実行時間制限内に実行します.バイトコードが小さく決定的に保持されます.契約はトランザクション実行の一部であり,したがって合意に影響を与える.

`Executable::IvmProved`は,防弾を運ぶ流れのために設計されている.

- IVM バイトコード
- 決定的な指示の重複
- 実行イベントのコミットメント
- ガス政策へのコミットメント

証明は,実行されたバイトコードにオーバーレイを結びつけます.パイプラインポリシーによって,検証者は追加の安全チェックとして証明を実行を確認し再演出することができます.

## 配備された契約電話 {#deployed-contract-calls}

`Executable::ContractCall` はアドレスでデプロイされた契約インスタンスを呼び出す.契約コードが別々に登録され,取引はバイトコードを毎回運ぶ代わりに参照で呼び出すべきである場合,これを使用します.

## 運用ガイドライン {#operational-guidance}

- 契約を決定的に保つ.契約行動は,ローカルウォールクロック時間,ホストファイルシステム状態,ネットワーク通話,または他のピアローカル入力に依存してはならない.
- バイトコードが大きいので,トランザクションのサイズとブロック拡散コストは増加します.
- 簡単なレジャー変更のために入力された指示を好みます. 監査が容易で実行は安くです.
- 契約のアップグレードと登録許可をリスクの高い運用制御とみなす.

参照:

- [指示](/ja/blockchain/instructions.md)
- [触発機](/ja/blockchain/triggers.md)
- [許可](/ja/blockchain/permissions.md)
- [データのモデルスケーマ](/ja/reference/data-model-schema.md)
