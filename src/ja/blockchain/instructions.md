---
translation_locale: ja
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 特別指示 {#iroha-special-instructions}

話題になったとき [どのようにして Iroha 運営する](/ja/blockchain/iroha-explained), 我々は言った Iroha 特別指示は 世界を変えられる唯一の方法このチュートリアルの言語指針をご覧になった方はあなたは既にいくつかの指示を見たことがある. `Register<Account>` そして `Mint<Numeric>`.

Iroha 特別指示の完全なリストは以下のとおりです.

|指示|記述|
| --------------------------------------------------------- | ------------------------------------------------ |
| [登録/非登録](#un-register) |ID をブロックチェーンの新しいエンティティに与えます. |
| [ミント/バーン](#mint-burn) |ミント/バーン数値資産またはトリガー重複. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |ブロックチェーンのオブジェクトメタデータを更新します.|
| [SetParameter](#setparameter) |鎖幅のパラメータを設定する.|
| [補助金/撤回](#grant-revoke)|許可や役割を与えるか削除する|
| [転送](#transfer) |譲渡所有権または資産価値. |
| [](#native-escrow-and-asset-locks) ローカル・キャストと資産ロック|番号資産をプロトコル保管にロックする|
| [ExecuteTrigger](#executetrigger) |触発機を実行する|
| [記録/カスタム/アップグレード](#other-instructions) |実行時間の行動を記録し,拡張したりアップグレードする.|

Iroha 特殊指示の概要から始めましょう. どのオブジェクトを各命令に呼び出すことができるのか,どのオブジェクトに対してどのような指示が利用可能か.

## 概要 {#summary}

各指示には,この指示を実行できるオブジェクトのリストがあります.例えば,転送バリエーションは所有可能なレジャーオブジェクトと数値資産をカバーし,ミントリングは数値資産およびトリガー繰り返しをカバーする.

ある 指示 に は,目的 地 が 指定 さ れる こと が 必要 です.例えば,資産 を 移転 する なら,どの アカウント に 移転 し て いる か を いつ も 指定 し なけれ ば なり ませ ん.一方,何かを 登録 する 場合,必要な もの は,その 物体 だけ で あり ます.

|指示|対象|目的地|
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |普通のドメイン,データスペース・アライアス,アカウント・アライアの設定|                      |
| [登録/非登録](#un-register) |口座,資産定義, NFTs,役割,トリガー,同類;ドメイン削除 |                      |
| [ミント/バーン](#mint-burn) |数値資産,トリガー重複 |口座やトリガー|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |[メタデータ](./metadata.md)を持つオブジェクト:ドメイン,アカウント,資産定義, NFTs, RWAs,トリガー |                      |
| [SetParameter](#setparameter) |チェーンパラメータ|                      |
| [補助金/撤回](#grant-revoke)| [役割,許可トークン ](/ja/blockchain/permissions.md) |口座や役割|
| [転送](#transfer) |域名,資産定義,数値資産, NFTs|口座|
| [](#native-escrow-and-asset-locks) ローカル・キャストと資産ロック|数値資産のエスクロー,資産ロック,匿名のエスクローコミットメント |購入者,目的地,または紛争の分断|
| [ExecuteTrigger](#executetrigger) |触発機|                      |
| [記録/カスタム/アップグレード](#other-instructions) |ログ,実行者専用用荷物,執行者アップグレード |                      |

また ISI に関する別の見方もあります.

|ターゲット|指示|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|口座|登録/無登録口座,受信資産,更新されたアカウントメタデータ,授与/撤回許可および役割|
|域名|ドメインの設定,ドメインを登録しないこと,ドメイン所有権を譲渡し,ドメインメタデータを更新する.|
|資産の定義|登録/削除の定義,譲渡所有権,更新されたメタデータ |
|資産|ミント/バーン数量,転送数量 |
|エスクロー |発送された支払いを開く,受け入れる,マークする,解放する,キャンセルする,紛争を解決する,撤回する,またはネイティブ保管記録の期限切れ|
|NFT|登録/無登録 NFTs,譲渡所有権,更新されたメタデータ |
|RWA|配分を登録する,転送量,保持/解放,凍結/解凍,交換,合併,メタデータ更新および制御 |
|トリガー|レジスタ/アンレジスタ,ミント/バーントリガー繰り返す,実行トリガー,更新トリガーメタデータ |
|世界 |登録/削除する 同級者および役割,パラメータを設定し,実行者をアップグレードする|

## CLI 例 {#cli-examples}

このページの例では,上流 Iroha ワークスペースからコマンドをデフォルトローカル クライアント設定に対して実行していると仮定します.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

`iroha` バイナリをインストールした場合は,代わりに `iroha --config ./defaults/client.toml` を使用します.下の位置保持者をネットワークからの値に置き換えます:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

公衆を狙うとき Taira テストネット,使用する Taira 料金支払いの例を実行する前に, faucet helper を [テストネットを入手 XOR について Taira](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) のように `taira_faucet_claim.py`, その後,請求テストネット XOR ポンプから:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

faucet資金の資産が表示された後,必要なガス資産メタデータを添付してトランザクションを書き込む.

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias`は,ドメインとそれらの SNS リースを作成するための通常の最初のリリース経路である.それは正確なデータスペース,所有者,リース期限,引用保護を宣言的に結合し,必要なすべての状態を原子的に作成または修復します.認証された `POST /v1/aliases/setup/plan` エンドポイントまたは対応する CLI ワークフローを使用します.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

意図とプランは秘密なしですが,ステップサインを適用し,設定されたアカウントで通常のトランザクションを送信します.プランはそのチェーン,権限,ライブステートアンカー,および期限に縛られています.他のネットワークでは二度と使用しないでください.

## (Un) 登録 {#un-register}

登録および非登録は,ブロックチェーン上の新しいエンティティに ID を与えるための指示です.

`Registrable` と `Identifiable` の両方とも登録できますが, `Identifiable` のすべては `Registrable` でありません. ほとんどのものは直接登録されていますが,一部の場合ブロックチェーンで表示されるデータはかなり多くあります.セキュリティとパフォーマンスの理由から,我々はそのようなデータ構造 (例えば `NewAccount`) のためのビルダーを使用し,ピア登録には専用の所有権証明の指示があります.

アカウント,資産定義, NFTs,ペア,役割,トリガーを登録することができます.ドメイン設定は `EnsureAlias` を使用します.原料の `Register::Domain` 役に立たない負荷はゲネス/ブートストラップに予約されています. 同級登録は `RegisterPeerWithPop` を使用し,同級鍵の保有証明書を持っています.[の命名条約](/ja/reference/naming.md) をチェックして,エンティティ名に課された制限について知ることができます.

RWA 配分は,専用の `RegisterRwa` 指示で作成されます.現在のコードでは `UnregisterRwa` の指示を明らかにしていません.表示された量を取り出すために, `RedeemRwa` を使用します.

::: 情報

[ゲネスブロック](/ja/guide/configure/genesis.md)を `genesis.json` に設定する方法を決定すると (特に,許可トークンの登録を含むか否かは別として),アカウントの登録プロセスは非常に異なることを注意してください.一般的には次のようにまとめることができます:

- 公開のブロックチェーンでは 誰でもアカウントを登録できるはずです
- プライベートブロックチェーンでは,アカウントを登録するためのユニークなプロセスがある可能性があります.典型的なプライベートブロックチェーンの場合,つまりアカウントの登録のための独自のプロセスのないブロックチェーンは,別のアカウントを登録するにはアカウントが必要です.

[と公共のブロックチェーンの](/ja/guide/configure/modes.md)を比較すると,これらの違いについて詳細に説明します.

:::

::: 情報

同級者を登録することは,ネットワークに設定された信頼性のある同級者の一部ではなかった同級者を追加する唯一の方法です.

:::

ブロックチェーンのオブジェクトを登録するプロセスを案内するために,言語特有のガイドの1つを参照してください.

|言語|ガイド|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI|ドメインを設定し,アカウントと資産を登録するために [Iroha CLI](/ja/get-started/operate-iroha-via-cli.md) を使用する. |
|Rust|[Rust チュートリアル](/ja/guide/tutorials/rust.md) を使用する.|
|Kotlin/Java |[Kotlin/Javaチュートリアル](/ja/guide/tutorials/kotlin-java.md)を使用する. |
|Python|[Python チュートリアル](/ja/guide/tutorials/python.md) を使用する.|
|JavaScript/TypeScript |[JavaScript/TypeScript のチュートリアル](/ja/guide/tutorials/javascript.md)を使用します. |

通常のドメイン設定を計画して適用し,もはや不要になったとき,ドメインを登録解除します.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

登録および非登録口座:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

登録および非登録資産定義:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

登録と削除 NFTs. NFT 登録はその内容を読む JSON 標準入力から:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

登録・非登録の役割:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

IVM バイトコードをコンパイルするか,シリアライズされた指示リストを要する.この例では, `Log` の指示を CLI で構築し,トリガー登録にパイプします.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

BLS キーを生成し, PoP を `kagami` で作成する.

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## ミント/バーン {#mint-burn}

ミントリングと燃焼は数値資産を指し,制限された重複数で触発するものである.一部の資産は非明タブルであると宣言され,登録後に一度のみ鋳造できるという意味です.

資産は,最初に資産を登録した口座に刻まれます.資産量は負ではないので,決して資産の `$-1.0` を持てたり,負額を燃やしたりしてコインを得ることはできません.

ブロックチェーンの資産を採掘する過程を案内するために 言語専用のガイドの一覧を参照してください

- [CLI](/ja/get-started/operate-iroha-via-cli.md)
- [Rust](/ja/guide/tutorials/rust.md)
- [Kotlin/Java](/ja/guide/tutorials/kotlin-java.md)
- [Python](/ja/guide/tutorials/python.md)
- [JavaScript/TypeScript](/ja/guide/tutorials/javascript.md)

以下は資産の燃焼例です

- [CLI](/ja/get-started/operate-iroha-via-cli.md)
- [Rust](/ja/guide/tutorials/rust.md)

ミントおよびバーン数値資産:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

ミントと燃焼誘発重複:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## 移転 {#transfer}

移転は,口座間の所有権または価値を移動する. 一般的な移転変数は,ドメイン,資産定義,数値資産を含む.そして NFTs. RWA 量移動は,専用 `TransferRwa` そして `ForceTransferRwa` 指示は, [リアル・ワールド アセット](/ja/blockchain/rwas.md).

このために,会計は [資産の移転許可](/ja/reference/permissions.md). 資産の移転方法に関する例を参照してください [CLI](/ja/get-started/operate-iroha-via-cli.md) または [Rust](/ja/guide/tutorials/rust.md).

数値資産の転送:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

移転ドメイン,資産定義,および所有権 NFT:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## 国産 エスローと資産ロック {#native-escrow-and-asset-locks}

Native escrow instruction は,レジャー管理のプロトコル保管に数値資産をロックする.市場式決済,通用資産ロック,および匿名のシールドエスコフローに使用されます.

市場のエスクローの利用 `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, そして `ResolveEscrowDispute`. 一般的な資産ロックの使用 `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, そして `ExpireAssetLock`. アノニマス・エスクローは市場ライフサイクルを反映しています `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, そして `ResolveAnonymousEscrowDispute`.

これらの ISIs には現在一流の CLI コマンドはありません. タイプされた SDK ビルダーまたはシリアライズされた指示ペイロードを使用し,ライフサイクルの詳細,許可,查询,イベント,および Rust 例については [ネイティブアセットエスクロー ](/ja/blockchain/escrow.md) を参照してください.

## 補助金/撤回 {#grant-revoke}

口座 [許可と役割](permissions.md) に対して,授与および撤回指示が使用されます.

`Grant`は,ユーザーに単一の許可または一連の権限 ("ロール") を永久的に授与するために使用されます.与えられた役割と許可は, `Revoke` 指示を通じてのみ削除することができます.したがって,これらの指示は慎重に使用する必要があります.

口座での役割を与え,取り消す:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

許可令状は,標準入力から許可オブジェクトを読み取ります.

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

役割の許可を与え,取り消す:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

この指示では,オブジェクト [メタデータ](/ja/blockchain/metadata.md) を更新します. メタデータ入力を挿入または置き換えるために `SetKeyValue` を使用し,それを削除するには `RemoveKeyValue` を使用します.

メタデータ `set` コマンドは,標準入力から JSON の値を読み取ります:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

口座,資産定義, NFTs, RWAs,およびトリガーについては同じパターンが利用できます.

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter`は,アクティブデータモデルと実行者によって暴露されたチェーン全体のパラメータを変更する.

標準入力で単一のパラメータ JSON オブジェクトを通過してパラメーターを設定する:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

この指示は, [トリガー](./triggers.md)を実行するために使用されます.

労働組合 CLI トリガーを登録し,直接トリガー実行イベントのサブスクリーニングを行うことができます. `execute trigger` マニュアルを提出する `ExecuteTrigger` 指示は,シリアル化生成 `InstructionBox` と SDK または実行ツールと,結果の通過 JSON 配列を通って `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## その他の指示 {#other-instructions}

Iroha は,実行時間および実行器統合に関する下層の指示も公開している.

- `Log`:実行中にログ入力を発行する
- `CustomInstruction`:執行機関に特化した JSON 役に立たない荷物を運ぶ
- `Upgrade`:実行者アップグレードを起動する

`Log`の指示をピンヘルパーに提出する.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

順序化された `InstructionBox` としてカスタム実行器指示を提出する.用荷の形は実行器特有のので,対応した SDK または実行器ツールを使用して命令を生成します:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

IVM バイトコードファイルから実行プログラムをアップグレードする.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
