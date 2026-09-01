---
translation_locale: ja
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kaigi を JavaScript アプリに埋め込む {#embed-kaigi-in-a-javascript-app}

Kaigi は Iroha 上で会議のライフサイクルを記録し、ブラウザは WebRTC を通じてオーディオとビデオを伝送します。ブロックチェーン台帳は通話、参加者リストの変更、暗号化されたシグナリングメタデータ、および最終ステータスを保存します。メディア中継ではありません。

このチュートリアルは現在の [Iroha JavaScript デモ](https://github.com/soramitsu/iroha-demo-javascript) に従っています。デモは最初のリリースアプリケーションプロファイルを1つ実装しています：

- 一人のホストと一人のゲスト
- `transparent` Kaigi プライバシーモード
- `authenticated` 部屋の規則
- `RevealAfterJoin` ネットワークピアの識別行動
- 通話メタデータ内の暗号化されたオファーと、最終化されたトランザクションメタデータ内の暗号化されたアンサー

Kaigi プロトコルは `zk-roster-v1` も定義していますが、現在のデモではその証明フローを生成または送信しません。ブリッジが現在の完全な証明契約を実装していない限り、プライベートモードのコントロールを表示しないでください。

## 前提条件 {#prerequisites}

必要です：

- Node.js 20以降および Rust ツールチェーン
- a Kaigi 対応の Torii API エンドポイント
- 資金提供されたホストとゲストのアカウントを分ける
- 特権ウォレットまたはアプリケーションブリッジ内の各アカウントの署名キー
- 両方のブラウザコンテキストでのカメラとマイクの許可

デモは、兄弟依存関係 `file:../iroha/javascript/iroha_js` を介して `@iroha/iroha-js` を使用します。デモをインストールする前に、Iroha のソースチェックアウトから SDK をビルドしてください：

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

清潔な SDK パッケージには必要なCargoワークスペースが含まれていません `npm run build:native`, だからそれを再構築する Iroha ソースコード作業コピー後 SDK 変更。文書化された SDK ソースは固定されています [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## API エンドポイントを確認してください {#check-the-endpoint}

パブリック Taira テストネットについて、まず Torii の到達可能性を確認してください:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

これらのリクエストは、Torii とその広告されている API ドキュメントにアクセスできることしか証明しません。特定の Kaigi コールが存在することや、あなたのウォレットがトランザクションを送信できることを証明するものではありません。

署名されていない `curl` リクエストで `/v1/kaigi/relays`、`/v1/kaigi/relays/{relay_id}`、または `/v1/kaigi/relays/health` をプローブしないでください。これらの3つのルートには、許可リストに入ったオペレーターの署名が必要です。リレーイベントストリームには、標準的な正確ネットワークアカウントの署名が必要です。

デモでは、設定を開き、Torii URL を入力し、API エンドポイントの検出によりチェーン UUID、正確な `NetworkId`、およびネットワークプレフィックスを読み込ませます。書き込みブリッジは、選択された API エンドポイントにすべての3つの値をバインドする必要があります。UUID チェーンや接頭辞から`NetworkId`を構築してはいけません。

## ルートと認証モデル {#route-and-authentication-model}

Kaigi の書き込みは、通常の手数料見積もり済み・署名済みトランザクションに含まれる命令です。`POST /v1/pipeline/transactions` を通じて送信し、最終化されたブロックの証拠を待ってください。

アプリケーションの読み取りは次のとおりです:

|ルート|認証|
| ----------------------------------- | --------------------------------------- |
|`/v1/kaigi/calls/{call_id}`|パブリック|
| `/v1/kaigi/calls/{call_id}/signals` |標準的な正確なネットワークアカウントのリクエスト|
| `/v1/kaigi/calls/{call_id}/events` |標準的な正確なネットワークアカウントのリクエスト|

JavaScript SDK は、これらを `getKaigiCall` および `listKaigiCallSignals` として公開します。シグナルリストは正確なカーソルページネーションを使用します。返されたカーソルを変更せずに再利用してください。オフセットやタイムスタンプのみの継続に置き換えないでください。

## レンダラーの外でサインを続ける {#keep-signing-outside-the-renderer}

積分を三つの境界に分ける:

|境界|責任|
| ----------------- | -------------------------------------------------------------------- |
|レンダラー|会議フォーム、招待リンク、メディアコントロール、WebRTC オファーとアンサー|
|特権ブリッジ|キーアクセス、料金見積もり、指示作成、署名、最終完了待ち|
|Torii|通話記録、確定信号読み取り、取引提出|

レンダラー向けブリッジは、API エンドポイントの識別を明示的に受け入れ、プライベートキーの情報は境界内に保持する必要があります。現在のデモの表面は、この縮小された契約に相当します：

```ts
type ConnectionIdentity = {
  toriiUrl: string
  chainId: string
  networkId: string
  networkPrefix: number
}

type KaigiSignalKeyPair = {
  publicKeyBase64Url: string
  privateKeyBase64Url: string
}

type KaigiMeeting = {
  callId: string
  meetingCode: string
  hostAccountId?: string
  hostKaigiPublicKeyBase64Url: string
  scheduledStartMs: number
  expiresAtMs: number
  createdAtMs: number
  live: boolean
  ended: boolean
  privacyMode: 'transparent'
  peerIdentityReveal: 'RevealAfterJoin'
  offerDescription: { type: 'offer'; sdp: string }
}

type KaigiSignalPage = {
  items: Array<{
    entrypointHash: string
    callId: string
    participantId: string
    participantName: string
    createdAtMs: number
    answerDescription: { type: 'answer'; sdp: string }
  }>
  nextCursor?: string
}

type KaigiBridge = {
  generateKaigiSignalKeyPair(): KaigiSignalKeyPair

  createKaigiMeeting(
    input: ConnectionIdentity & {
      hostAccountId: string
      callId: string
      title?: string
      scheduledStartMs: number
      meetingCode: string
      inviteSecretBase64Url: string
      hostDisplayName: string
      hostParticipantId: string
      hostKaigiPublicKeyBase64Url: string
      offerDescription: { type: 'offer'; sdp: string }
    },
  ): Promise<{ hash: string }>

  getKaigiCall(input: {
    toriiUrl: string
    callId: string
    inviteSecretBase64Url: string
  }): Promise<KaigiMeeting>

  joinKaigiMeeting(
    input: ConnectionIdentity & {
      participantAccountId: string
      callId: string
      inviteSecretBase64Url: string
      participantId: string
      participantName: string
      answerDescription: { type: 'answer'; sdp: string }
    },
  ): Promise<{ hash: string }>

  pollKaigiMeetingSignals(input: {
    toriiUrl: string
    networkId: string
    networkPrefix: number
    accountId: string
    callId: string
    hostKaigiKeys: KaigiSignalKeyPair
    limit?: number
    cursor?: string
  }): Promise<KaigiSignalPage>

  endKaigiMeeting(
    input: ConnectionIdentity & {
      hostAccountId: string
      callId: string
      endedAtMs?: number
    },
  ): Promise<{ hash: string }>
}
```

実際のデモ結果には、最終化されたブロックの証拠と、提示された手数料見積もりも含まれます。トランザクションハッシュだけを成功の証拠として扱わないでください。

## 招待契約 {#invite-contract}

正確に `domain.dataspace:meeting` 形式の通話IDを使用してください。デモでは `kaigi.universal` の下で通話を生成し、32文字のパディングなし base64url でエンコードされた 24 バイトの暗号学的にランダムな招待シークレットを使用します。

標準的な招待には、正確に1つの`call`パラメータと1つの`secret`パラメータが含まれます:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

アプリ内フォールバックは`#/kaigi`のまったく同じクエリです。重複、未知、空、パディングされた、または正規化されていないパラメータは拒否してください。デモでは、ミーティングの有効期限を`scheduledStartMs`の24時間後に設定します。

招待用の秘密は、ホストのオファーメタデータを復号します。これはベアラーシークレットです：ログに記録したり、分析に使用したり、ブロックチェーン台帳のメタデータに保存したりしないでください。ホストの別の X25519 鍵ペアはゲストの応答信号を復号し、ホストセッションにローカルに保持する必要があります。

## 会議のライフサイクル {#meeting-lifecycle}

### ホスト {#host}

1. 選択したウォレットの識別情報が、API エンドポイントのチェーン UUID、正確な `NetworkId`、およびプレフィックスと一致していることを確認してください。
2. ローカルメディアを開き、`RTCPeerConnection`を作成します。
3. SDP オファーを作成し、ICE の収集が完了するのを待ちます。
4. 招待秘密とホスト Kaigi シグナル鍵ペアを生成する。
5. 招待の秘密でオファーを暗号化してください。
6. 料金見積もりを取得し、`CreateKaigi` を含む取引に透明で認証されたモードで署名してください。
7. 招待をライブとして表示する前に、確定されたブロックの証拠を待ってください。

ホストセッションを開いたままにしておきます。ホストアカウントの標準的なリクエスト署名で信号経路をポーリングし、最初の有効な応答をホスト信号キーで復号して、`setRemoteDescription` に適用します。さらにページが利用可能な場合は、`nextCursor` をそのまま進めます。

### ゲスト {#guest}

1. 正確な招待を解析して検証する。
2. 公開通話記録を取得し、招待の秘密でそのオファーを復号してください。
3. 終了した、期限切れの、ライブではない、または透明でないミーティングを拒否する。
4. ローカルメディアを開き、オファーを適用し、SDP の回答を作成し、ICE の収集を完了します。
5. ホストの Kaigi 公開鍵で回答を暗号化してください。
6. `JoinKaigi` と標準の回答メタデータを含む取引に署名し、手数料の見積もりを取得してください。
7. ゲストを参加済みとして表示する前に、確定ブロックの証拠を待ってください。

### 終わり {#end}

ホストのみが `EndKaigi` を提出できます。ネットワークピア接続とメディアトラックを閉じ、署名済みの指示を提出し、最終確定を待ってください。透明な参加者は`LeaveKaigi`を使用することができます。`zk-roster-v1`の出発は、初回リリースのプロトコルではオフチェーンで行われ、ネイティブ命令はプライバシー離脱のアーティファクトを拒否します。

## マニュアル WebRTC フォールバック {#manual-webrtc-fallback}

デモは、ローカル開発のための高度なシグナリング経路を保持しています。ブロックチェーン台帳による自動シグナリングが利用できない場合に、ホストとゲストが生の WebRTC オファーおよびアンサーパケットをコピーできるようにします。

これを別のモードとして扱ってください。これは Kaigi レコードを作成、参加、終了せず、取引の確定性を提供せず、オンチェーンのフローと同等であると提示してはいけません。

## 統合をテストする {#test-the-integration}

現在フォーカスされているデモスイートを実行する:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

テストは、現在の透過プロファイル、厳密な招待解析、暗号化されたシグナリング、ローカルセッションの永続性、および手動フォールバックをカバーしています。実際のメディアテストには、依然として二つの資金があるウォレットと二つのウィンドウまたはデバイスが必要です。モックされた WebRTC とレンダラーのテストでは、カメラ、マイク、NAT のトラバーサル、カノニカルリクエストの認証、またはライブトランザクションの最終性は証明されません。

完全な API エンドポイントマトリックスと CLI ライフサイクルについては、[Torii API エンドポイント: Kaigi セッション](/ja/reference/torii-endpoints.md#kaigi-sessions) を参照してください。
