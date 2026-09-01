---
translation_locale: ja
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 命令操作 {#iroha-special-instructions}

[Iroha がどのように操作されるか](/ja/blockchain/iroha-explained)について話したとき、Iroha の命令操作が世界の状態を変更する唯一の方法だと言いました。では、どのような命令が私たちはどのような操作を持っていますか？もしこのチュートリアルの言語別ガイドを読んだことがあるなら、すでにいくつかの命令を見たことがあるでしょう：`Register<Account>`と`Mint<Numeric>`。

こちらが Iroha の指示操作の完全なリストです：

|指示|説明|
| --------------------------------------------------------- | ------------------------------------------------ |
| [登録/登録解除](#un-register)                       |ブロックチェーン上の新しいエンティティにIDを付与する。|
| [Mint/Burn](#mint-burn) |数値資産をミント／バーンする、または繰り返しをトリガーする。|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |ブロックチェーンオブジェクトのメタデータを更新する。|
| [SetParameter](#setparameter)                             |チェーン全体のパラメーターを設定します。|
| [Grant/Revoke](#grant-revoke)                             |権限や役割を付与または削除します。|
| [転送](#transfer)                                     |所有権または資産価値を移転する。|
| [ネイティブエスクローおよび資産ロック](#native-escrow-and-asset-locks) |数値資産をプロトコルの管理下でロックする。|
| [アトミックなプライベート金融取引決済](#atomic-private-settlement)   |機密プロトコルデータグループとアトミックバンドルを管理する。|
|[ExecuteTrigger](#executetrigger)|トリガーを実行します。|
| [Log/Custom/Upgrade](#other-instructions)                 |ソフトウェアの実行時の動作を記録、拡張、またはアップグレードする。|

まず、Iroha 指示操作の概要から始めましょう。それぞれの指示がどのオブジェクトに対して呼び出せるか、そして各オブジェクトに使用可能な指示は何かを説明します。

## 要約 {#summary}

各指示について、その指示を実行できるオブジェクトのリストがあります。例えば、転送のバリアントは所有可能なブロックチェーン台帳オブジェクトおよび数値資産をカバーし、発行は数値資産およびトリガーの繰り返しをカバーします。

いくつかの指示では、目的地を指定する必要があります。例えば、資産を転送する場合、常にどのアカウントに転送するのかを指定する必要があります。一方で、何かを登録する場合には、登録したい対象物だけが必要です。

|指示|オブジェクト|目的地|
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               |通常のドメイン、データスペースエイリアス、およびアカウントエイリアスの設定|                      |
|[登録/登録解除](#un-register)|アカウント、資産定義、NFTs、役割、トリガー、ネットワークピア；ドメイン削除|                      |
|[Mint/Burn](#mint-burn)|数値資産、繰り返しを引き起こす|アカウントまたはトリガー|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | [メタデータ](./metadata.md)：ドメイン、アカウント、資産定義、NFTs、RWAs、トリガー を持つオブジェクト|                      |
| [SetParameter](#setparameter)                             |チェーンパラメータ|                      |
| [Grant/Revoke](#grant-revoke)                             | [役割、許可トークン](/ja/blockchain/permissions.md)                                                  |アカウントまたは役割|
| [転送](#transfer)                                     |ドメイン、資産定義、数値資産、NFTs|アカウント|
| [ネイティブエスクローと資産ロック](#native-escrow-and-asset-locks) |数値資産エスクロー、資産ロック、匿名エスクロー暗号コミットメント値|購入者、目的地、または紛争の分割|
| [アトミックなプライベート金融取引決済](#atomic-private-settlement)   |ルートスコープの機密プロトコルデータグループ、ポリシーのローテーション、最終化されたバンドル、および中止マーカー|                      |
|[ExecuteTrigger](#executetrigger)|トリガー|                      |
| [Log/Custom/Upgrade](#other-instructions)                 |ログ、エグゼキュータ固有のペイロード、エグゼキュータのアップグレード|                      |

ブロックチェーン台帳オブジェクトに関して、ISI を見る別の方法もあります:

|ターゲット|指示|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|アカウント|アカウントの登録/登録解除、資産の受け取り、アカウントメタデータの更新、権限や役割の付与/剥奪|
|ドメイン|ドメインの設定を確認する、ドメインの登録を解除する、ドメインの所有権を移管する、ドメインのメタデータを更新する|
|資産の定義|定義の登録/登録解除、所有権の移転、メタデータの更新|
|資産|数値の発行/焼却、数値の転送|
|エスクロー|オープン、承認、支払い送信をマーク、リリース、キャンセル、紛争、解決、引き出し、またはネイティブカストディ記録の期限切れ|
|NFT|登録/登録解除 NFTs、所有権の譲渡、メタデータの更新|
| RWA              |ロットを登録する、数量を移動する、保留/解除、凍結/解除、償還、結合、メタデータと制御を更新する|
|トリガー|登録/登録解除、ミント/バーン トリガーの繰り返し、トリガーを実行、トリガーのメタデータを更新|
|世界|ネットワークピアおよび役割の登録/登録解除、パラメータの設定、エグゼキュータのアップグレード|

## CLI 例 {#cli-examples}

このページの例は、上流の Iroha ワークスペースからコマンドを実行して、デフォルトのローカルクライアント設定に対して操作していることを前提としています。

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

もし`iroha`バイナリをインストールした場合は、代わりに`iroha --config ./defaults/client.toml`を使用してください。以下のプレースホルダーをネットワークの値に置き換えてください:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

パブリック Taira テストネットをターゲットにする場合は、Taira クライアント構成を使用してください。手数料支払いの例を実行する前に、[Taira でテストネット XOR を入手する](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)からテストネット資金提供サービスヘルパーを`taira_faucet_claim.py`として保存し、その後テストネット資金提供サービスからテストネット XOR を請求してください。

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

テストネットで資金提供された資産が表示されたら、書き込みトランザクションに必要なトランザクション実行コスト資産のメタデータを添付してください:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` は、ドメインとそれらの SNS リースを作成するための通常の最初のリリースパスです。これは、正確なデータスペース、所有者、リース期間を宣言的にバインドします。および手数料価格の検証ガードを行い、その後、必要なすべての状態を原子レベルで作成または修復します。認証された `POST /v1/aliases/setup/plan` API エンドポイントまたは対応する CLI ワークフローを使用してください：

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

意図と計画は秘密なしですが、適用ステップは署名を行い、設定されたアカウントで通常のトランザクションを送信します。計画はそのチェーン、認可プリンシパル、ライブステートアンカー、締め切りに紐付けられており、別のネットワークで再利用してはいけません。

## (登録／登録解除) {#un-register}

登録と登録解除は、ブロックチェーン上の新しいエンティティにIDを与えるために使われる指示です。

登録できるすべてのものは`Registrable`でもあり`Identifiable`でもありますが、`Identifiable`であるすべてのものが`Registrable`であるわけではありません。ほとんどのものは直接登録されますが、場合によってはブロックチェーン上の表現の方がはるかに多くのデータを持っています。セキュリティとパフォーマンス上の理由から、そのようなデータ構造（例：`NewAccount`）にはビルダーを使用し、ネットワークピアの登録には専用の所持証明命令があります。原則として、登録可能なものはすべて登録解除も可能ですが、それが絶対的なルールというわけではありません。

アカウント、資産定義、NFTs、ネットワークピア、役割、トリガーを登録できます。ドメイン設定には`EnsureAlias`を使用します；生の`Register::Domain`ペイロードは予約されていますgenesis/bootstrap。ネットワークピアの登録には `RegisterPeerWithPop` が使用され、これはネットワークピアキーの所有権証明を含んでいます。エンティティ名に適用される制限については、私たちの [命名規則](/ja/reference/naming.md) を確認してください。

RWA ロットは専用の `RegisterRwa` 命令を通じて作成されます。現在のコードは `UnregisterRwa` 命令を公開していません；表現された数量を廃止するには `RedeemRwa` を使用してください。

::: info

注意してください、`genesis.json`で[ブロックチェーンのジェネシスブロック](/ja/guide/configure/genesis.md)をどのように設定するか（特に、権限トークンの登録を含めるかどうか）によって、アカウントを登録するプロセスは大きく異なる場合があります。一般的に、次のようにまとめることができます:

- パブリックブロックチェーンでは、誰でもアカウントを登録できるべきです。
- プライベートブロックチェーンでは、アカウントを登録するための独自のプロセスがある場合があります。一般的なプライベートブロックチェーン、つまりアカウントを登録するための特別なプロセスがないブロックチェーンでは、別のアカウントを登録するためにアカウントが必要です。

私たちはこれらの違いについて、私たちが[プライベートブロックチェーンとパブリックブロックチェーンを比較する](/ja/guide/configure/modes.md)する際に非常に詳しく議論します。

:::

::: info

ネットワークピアを登録することは、元の信頼されたネットワークピアセットの一部でなかったネットワークピアをネットワークに追加する現在唯一の方法です。

:::

ブロックチェーンオブジェクトを登録するには、言語別のガイドを使用してください:

|言語|ガイド|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   |ドメインを設定し、アカウントや資産を登録するには、[Iroha CLI](/ja/get-started/operate-iroha-via-cli.md) を使用してください。|
| Rust                  | [Rust チュートリアル](/ja/guide/tutorials/rust.md) を使用してください。|
| Kotlin/Java           | [Kotlin/Java](/ja/guide/tutorials/kotlin-java.md) を使用してください。 |
| Python                | [Python チュートリアル](/ja/guide/tutorials/python.md) を使用してください。|
| JavaScript/TypeScript | [JavaScript/TypeScript](/ja/guide/tutorials/javascript.md) を使用してください。|

通常のドメイン設定を計画して適用し、不要になったらドメインの登録を解除します:

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

アカウントの登録と登録解除:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

アセット定義を登録および登録解除する:

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

登録と登録解除 NFTs. NFT 登録がその内容を読み取る JSON 標準入力から：

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

役割を登録および登録解除する:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

トリガーを登録および登録解除します。トリガーの登録には、コンパイル済みの IVM バイトコードまたはシリアライズされた命令リストが必要です。この例では、CLI を使用して `Log` 命令を作成し、それをトリガー登録に渡します:

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

ネットワークピアを登録および登録解除します。BLS キーと PoP を `kagami` と一緒に、まだ持っていない場合は生成してください:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## ミント／バーン {#mint-burn}

発行と破棄は、数値資産や限定された回数でのトリガーを指すことがあります。いくつかの資産は非発行可能として宣言することができ、これは登録後に一度だけ発行できることを意味します。

資産は特定のアカウントに発行され、通常は最初に資産を登録したアカウントです。資産の数量は非負であるため、資産を`$-1.0`持つことも、負の量を破棄して発行を得ることもできません。

言語別ガイドを使用してブロックチェーン資産を発行する:

- [CLI](/ja/get-started/operate-iroha-via-cli.md)
- [Rust](/ja/guide/tutorials/rust.md)
- [Kotlin/Java](/ja/guide/tutorials/kotlin-java.md)
- [Python](/ja/guide/tutorials/python.md)
- [JavaScript/TypeScript](/ja/guide/tutorials/javascript.md)

資産を破壊する例は以下の通りです:

- [CLI](/ja/get-started/operate-iroha-via-cli.md)
- [Rust](/ja/guide/tutorials/rust.md)

数値資産を発行して破棄する:

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

トリガーの繰り返しを発行して破壊する：

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## 転送 {#transfer}

転送はアカウント間で所有権または価値を移動させます。汎用の転送バリエーションは、ドメイン、資産定義、数値資産、および NFTs をカバーします。RWA の数量移動は、[実物資産](/ja/blockchain/rwas.md)で説明されている専用の`TransferRwa`および`ForceTransferRwa`命令を使用します。

これを行うには、アカウントに[資産移転の許可](/ja/reference/permissions.md)が付与されている必要があります。[CLI](/ja/get-started/operate-iroha-via-cli.md)または[Rust](/ja/guide/tutorials/rust.md)を使って資産を移動する方法の例を参照してください。

数値資産を転送する:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

ドメイン、資産定義、および NFT の所有権を移転する:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## ネイティブエスクローと資産ロック {#native-escrow-and-asset-locks}

ネイティブエスクローの指示は、ブロックチェーン台帳プロトコルによって管理されるカストディで数値資産をロックします。これらは、マーケットプレイス形式の金融取引の清算、一般的な資産のロック、および匿名のシールドエスクローフローに使用されます。

マーケットプレイスのエスクローは `OpenAssetEscrow`、`AcceptAssetEscrow`、`MarkEscrowPaymentSent`、`ReleaseAssetEscrow`、`CancelAssetEscrow`、`OpenEscrowDispute`、および `ResolveEscrowDispute` を使用します。一般的な資産ロックは `OpenAssetLock`、`DrawdownAssetLock` を使用します。 `CancelAssetLock` と `ExpireAssetLock`。匿名エスクローは、市場のライフサイクルを `OpenAnonymousAssetEscrow`、`AcceptAnonymousAssetEscrow`、`MarkAnonymousEscrowPaymentSent`、`ReleaseAnonymousAssetEscrow`、`CancelAnonymousAssetEscrow`、`OpenAnonymousEscrowDispute`、および `ResolveAnonymousEscrowDispute` と共に反映します。

これらの ISIs は現在、第一級の CLI コマンドを持っていません。型付き SDK ビルダーやシリアライズされた命令ペイロードを使用し、ライフサイクルの詳細、権限、クエリ、イベント、Rust の例については [ネイティブ資産エスクロー](/ja/blockchain/escrow.md) を参照してください。

## アトミックなプライベート金融取引決済 {#atomic-private-settlement}

管理された原子プライベート決済指示ファミリーは、透明なネイティブ AMX とは別です。`ActivatePrivateSettlementPoolV1`は、編集されたガバナンス投影と標準原点の暗号コミットメント値から、ルートスコープの機密プロトコルデータグループを1つ確立します。 `FinalizeAtomicPrivateSettlementV1` は一つの完全な委員会認証バンドルを原子的に適用する一方、`AbortAtomicPrivateSettlementV1` はスポンサーが承認した公開端末マーカーのみを公開します。

`RotatePrivateSettlementPoolPolicyV1` はプライバシーガバナンスに制限されています。正確な現在のガバナンス暗号ダイジェスト値を必要とし、ルート、プロトコルデータグループ、資産結合暗号コミットメント値、状態フロンティア、リプレイセット、および最終化されたプロトコル結果記録を保持します。公的な改訂を1つ進め、新しい監査人キーのエポックを使用します。このローテーションはその包含高さで有効になり、同じルート/プールに対するプロトコル結果の記録とその高さを共有することはできません。公開リビジョンの系統は、回転再開前に確定されたプロトコル結果の記録を保持し、有効で正確なリプレイを冪等にし、進行中の旧ポリシーバンドルは失敗時に閉じます。オペレーターは、保存されたカプセルのための古い復号鍵を保持するか、破棄する前にカプセルの再暗号化を管理しテストする必要があります。

このパスはデフォルトで無効になっており、本番環境向けには認定されていません。構成、認可プリンシパル、監査、復旧、およびリリース要件については [アトミックなプライベートクロスデータスペースの金融取引決済を実行する](/ja/get-started/atomic-private-settlement) を参照してください。

## 付与/取り消し {#grant-revoke}

付与および取り消しの指示は、アカウント[権限と役割](permissions.md)に使用されます。

`Grant`は、ユーザーに単一の権限または権限のグループ（「ロール」）を永久に付与するために使用されます。付与されたロールおよび権限は、`Revoke`命令によってのみ削除できます。したがって、これらの命令は慎重に使用する必要があります。

アカウントに対してロールを付与および取り消す:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

権限トークンを付与および取り消す。権限コマンドは標準入力から権限オブジェクトを読み取ります:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

ロールに対して権限を付与および取り消す:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

これらの指示はオブジェクト[メタデータ](/ja/blockchain/metadata.md)を更新します。`SetKeyValue`を使用してメタデータのエントリを挿入または置き換え、`RemoveKeyValue`を使用して削除します。

メタデータ `set` コマンドは標準入力から JSON の値を読み取ります:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

同じパターンは、アカウント、資産定義、NFTs、RWAs、およびトリガーに対して利用可能です:

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

`SetParameter` は、アクティブなデータモデルと実行環境によって公開されたチェーン全体のパラメータを変更します。

標準入力で単一のパラメータ JSON オブジェクトを渡すことでパラメータを設定します:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

この指示は [トリガー](./triggers.md) を実行するために使用されます。

CLI はトリガーを登録し、トリガー実行イベントに直接サブスクライブすることができます。タイプ付きの `execute trigger` コマンドは提供されないため、送信するにはマニュアル `ExecuteTrigger` 指示、SDK または実行ツールを使ってシリアライズされた `InstructionBox` を生成し、生成された JSON 配列を `ledger transaction stdin` に通してください:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## その他の指示 {#other-instructions}

Iroha は、ソフトウェア実行時および実行環境統合のための低レベルの命令も公開します:

- `Log`: 実行中にログエントリを出力する
- `CustomInstruction`：実行者固有の JSON ペイロードを運ぶ
- `Upgrade`：実行者アップグレードを有効にする

pingヘルパーを使って`Log`の指示を送信してください:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

シリアライズされた `InstructionBox` としてカスタム実行者の指示を送信します。ペイロードの形状は実行者固有であるため、対応する SDK または実行者用ツールを使用して指示を生成してください。

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

コンパイル済みの IVM バイトコードファイルから実行ファイルをアップグレードします:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
