---
translation_locale: ja
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kaigi を JavaScript アプリに埋め込む {#embed-kaigi-in-a-javascript-app}

Kaigi は,アプリケーションが Iroha を通じて生命周期を記録する,ウォレットバック付きの1対1オーディオ/ビデオミーティングを作成できるようにします.ブラウザは依然として WebRTC でメディアを管理しますが, Torii と Kaigi の指示では,持続的なミーティング記録,暗号化されたシグナルメタデータを提供します.プライベートリストのサポートと使用イベント.

このチュートリアルでは, [Iroha デモ JavaScript](https://github.com/soramitsu/iroha-demo-javascript) アプリが使用する最小の統合パターンを示します:

- レンダーは WebRTC のオファーと回答を作成します
- Kaigi トランザクションを提出する申請橋のサイン
- コンパクトな招待リンクには ID の呼び出しのみがあり,秘密の招待状が含まれます.
- ホストは Torii で暗号化された参加者の答えを監視する.

例は TypeScript を使用し,安全なバックエンドを持つブラウザ,または財布拡張機能のあるウェブアプリで実行できるように書かれています.

## 必須条件 {#prerequisites}

必要なのは:

- Kaigi 対応の Torii エンドポイント
- ホストの口座とゲストの口座
- 安全なアプリブリッジまたは財布を通じて各アカウントのサインキーにアクセスできます
- ブラウザカメラ/マイクフォンの許可
- Node.js 20+ を使っている場合 JavaScript デモまたはネイティブ `@iroha/iroha-js` 直接結合する

完全な作業参照のために, Iroha ソースチェックアウトの横にデモをクローンする:

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

Iroha ソースリポジトリから[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) でデモを使用します.その `file:` 依存性は直接チェックアウトを解決します.ネイティブバインディングが変更された場合,それを `iroha/javascript/iroha_js` に再構築してください.クリーンパッケージディレクトリは `npm run build:native` が必要とする貨物作業空間を含まない.

TAIRA でライブミーティングを行う前に,デモが依存する公共の表層 Torii を確認してください.

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

これらのコマンドは, TAIRA がライブであり,Kaigi リレーテレメトリが利用可能であることを確認します.彼らは Kaigi トランザクションを提出しません.実際の `CreateKaigi` または `JoinKaigi` テストは,資金提供された TAIRA アカウントとデモの橋または他の財布裏付けの橋を通って署名する必要があります.

## 建築 {#architecture}

Kaigi 統合を3層に分割する.

|層|責任|
| --- | --- |
|UI|アカウント選択,会議フォーム,招待リンク表示,メディア制御 |
|WebRTC|`RTCPeerConnection`,地方メディア,オファーの説明と回答 |
|Iroha 橋|署名, `CreateKaigi`, `JoinKaigi`, `EndKaigi`,信号投票 |

アプリブリッジは電子のプレロードになる API, ポートフォリオ拡張子,またはバックエンド端. UI:

```ts
type KaigiMeetingPrivacy = "private" | "transparent";
type KaigiPeerIdentityReveal = "Hidden" | "RevealAfterJoin";

type KaigiSignalKeyPair = {
  publicKeyBase64Url: string;
  privateKeyBase64Url: string;
};

type KaigiDescription = {
  type: "offer" | "answer";
  sdp: string;
};

type KaigiMeeting = {
  callId: string;
  meetingCode: string;
  title?: string;
  hostAccountId?: string;
  hostDisplayName?: string;
  hostParticipantId?: string;
  hostKaigiPublicKeyBase64Url: string;
  scheduledStartMs: number;
  expiresAtMs: number;
  live: boolean;
  ended: boolean;
  privacyMode: KaigiMeetingPrivacy;
  peerIdentityReveal: KaigiPeerIdentityReveal;
  rosterRootHex: string;
  offerDescription: { type: "offer"; sdp: string };
};

type KaigiSignal = {
  entrypointHash: string;
  callId: string;
  participantId: string;
  participantName: string;
  createdAtMs: number;
  answerDescription: { type: "answer"; sdp: string };
};

type KaigiBridge = {
  generateKaigiSignalKeyPair(): KaigiSignalKeyPair;

  createKaigiMeeting(input: {
    toriiUrl: string;
    chainId: string;
    hostAccountId: string;
    callId: string;
    title?: string;
    scheduledStartMs: number;
    meetingCode: string;
    inviteSecretBase64Url: string;
    hostDisplayName: string;
    hostParticipantId: string;
    hostKaigiPublicKeyBase64Url: string;
    offerDescription: { type: "offer"; sdp: string };
    privacyMode: KaigiMeetingPrivacy;
    peerIdentityReveal: KaigiPeerIdentityReveal;
  }): Promise<{ hash: string }>;

  getKaigiCall(input: {
    toriiUrl: string;
    callId: string;
    inviteSecretBase64Url: string;
  }): Promise<KaigiMeeting>;

  joinKaigiMeeting(input: {
    toriiUrl: string;
    chainId: string;
    participantAccountId: string;
    callId: string;
    hostAccountId?: string;
    hostKaigiPublicKeyBase64Url: string;
    participantId: string;
    participantName: string;
    walletIdentity?: string;
    roomId: string;
    privacyMode: KaigiMeetingPrivacy;
    rosterRootHex: string;
    answerDescription: { type: "answer"; sdp: string };
  }): Promise<{ hash: string }>;

  pollKaigiMeetingSignals(input: {
    toriiUrl: string;
    accountId: string;
    callId: string;
    hostKaigiKeys: KaigiSignalKeyPair;
    afterTimestampMs?: number;
  }): Promise<KaigiSignal[]>;

  watchKaigiCallEvents(
    input: { toriiUrl: string; callId: string },
    onEvent: (event: { kind: string; callId: string }) => void | Promise<void>,
  ): Promise<string>;

  endKaigiMeeting(input: {
    toriiUrl: string;
    chainId: string;
    hostAccountId: string;
    callId: string;
    endedAtMs?: number;
  }): Promise<{ hash: string }>;
};
```

デモアプリでは,これらの橋渡し方法が `@iroha/iroha-js`,ローカルサイン,暗号化された Kaigi メタデータ,および Torii コールで実装されています.

## 援助 者 を 招く {#invite-helpers}

使用 Torii- 互換性電話 IDs について `domain.dataspace:meeting` デモでは `kaigi.universal:<call-name>` 発生した会議について

```ts
const KAIGI_WINDOW_MS = 24 * 60 * 60 * 1000;

const base64Url = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

export function createInviteSecret(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

export function createMeetingCode(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return base64Url(bytes).toLowerCase();
}

export function buildKaigiCallId(domain: string, meetingCode: string): string {
  const qualifiedDomain = domain.includes(".") ? domain : `${domain}.universal`;
  const safeCode = meetingCode
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${qualifiedDomain}:kaigi-${safeCode || "meeting"}`;
}

export function buildInviteLink(input: {
  callId: string;
  inviteSecretBase64Url: string;
}): string {
  const call = encodeURIComponent(input.callId);
  const secret = encodeURIComponent(input.inviteSecretBase64Url);
  return `iroha://kaigi/join?call=${call}&secret=${secret}`;
}

export function parseInviteLink(link: string): {
  callId: string;
  inviteSecretBase64Url: string;
} {
  const url = new URL(link);
  const callId = url.searchParams.get("call")?.trim();
  const inviteSecretBase64Url = url.searchParams.get("secret")?.trim();
  if (!callId || !inviteSecretBase64Url) {
    throw new Error("Kaigi invite link is missing call or secret.");
  }
  return { callId, inviteSecretBase64Url };
}
```

## WebRTC 支援者 {#webrtc-helpers}

ホストは申し出を作成し, `CreateKaigi` で保存し,ゲストの答えを適用できるようにウィンドウを開いておく.お客様は暗号化された申し出を取り出し,回答を作成し,その返信を `JoinKaigi` で投稿します.

```ts
const rtcConfig: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export async function openLocalMedia(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 24, max: 30 },
    },
  });
}

export function createPeer(localStream: MediaStream): RTCPeerConnection {
  const peer = new RTCPeerConnection(rtcConfig);
  for (const track of localStream.getTracks()) {
    peer.addTrack(track, localStream);
  }
  return peer;
}

async function waitForIceGathering(peer: RTCPeerConnection): Promise<void> {
  if (peer.iceGatheringState === "complete") {
    return;
  }
  await new Promise<void>((resolve) => {
    const done = () => {
      if (peer.iceGatheringState === "complete") {
        peer.removeEventListener("icegatheringstatechange", done);
        resolve();
      }
    };
    peer.addEventListener("icegatheringstatechange", done);
  });
}

export async function createOfferDescription(
  peer: RTCPeerConnection,
): Promise<{ type: "offer"; sdp: string }> {
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  await waitForIceGathering(peer);
  const local = peer.localDescription;
  if (!local?.sdp || local.type !== "offer") {
    throw new Error("WebRTC offer was not created.");
  }
  return { type: "offer", sdp: local.sdp };
}

export async function createAnswerDescription(
  peer: RTCPeerConnection,
  offer: { type: "offer"; sdp: string },
): Promise<{ type: "answer"; sdp: string }> {
  await peer.setRemoteDescription(offer);
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  await waitForIceGathering(peer);
  const local = peer.localDescription;
  if (!local?.sdp || local.type !== "answer") {
    throw new Error("WebRTC answer was not created.");
  }
  return { type: "answer", sdp: local.sdp };
}
```

ストリームを通常のビデオ要素で UI に添付する.

```ts
export function attachKaigiMedia(input: {
  peer: RTCPeerConnection;
  localStream: MediaStream;
  localVideo: HTMLVideoElement;
  remoteVideo: HTMLVideoElement;
}): void {
  input.localVideo.srcObject = input.localStream;

  const remoteStream = new MediaStream();
  input.remoteVideo.srcObject = remoteStream;

  input.peer.addEventListener("track", (event) => {
    if (event.streams[0]) {
      input.remoteVideo.srcObject = event.streams[0];
      return;
    }
    remoteStream.addTrack(event.track);
  });
}
```

## 開催者: 会見のリンクを作成する {#host-create-a-meeting-link}

宿主流:

1. オープンカメラとマイク
2. Kaigi 信号キーペアを作成する
3. WebRTC の申し出を作成する
4. 提出する `CreateKaigi`
5. コンパクトな招待リンクを共有する

```ts
type AccountContext = {
  accountId: string;
  displayName: string;
};

type KaigiContext = {
  bridge: KaigiBridge;
  toriiUrl: string;
  chainId: string;
};

export async function hostKaigiMeeting(input: {
  context: KaigiContext;
  account: AccountContext;
  title?: string;
  privacyMode?: KaigiMeetingPrivacy;
}): Promise<{
  callId: string;
  inviteLink: string;
  peer: RTCPeerConnection;
  localStream: MediaStream;
  hostKaigiKeys: KaigiSignalKeyPair;
  createdAtMs: number;
}> {
  const { bridge, toriiUrl, chainId } = input.context;
  const privacyMode = input.privacyMode ?? "private";
  const scheduledStartMs = Date.now();
  const meetingCode = createMeetingCode();
  const callId = buildKaigiCallId("kaigi", meetingCode);
  const inviteSecretBase64Url = createInviteSecret();
  const hostKaigiKeys = bridge.generateKaigiSignalKeyPair();

  const localStream = await openLocalMedia();
  const peer = createPeer(localStream);
  const offerDescription = await createOfferDescription(peer);

  await bridge.createKaigiMeeting({
    toriiUrl,
    chainId,
    hostAccountId: input.account.accountId,
    callId,
    title: input.title,
    scheduledStartMs,
    meetingCode,
    inviteSecretBase64Url,
    hostDisplayName: input.account.displayName,
    hostParticipantId: "host",
    hostKaigiPublicKeyBase64Url: hostKaigiKeys.publicKeyBase64Url,
    offerDescription,
    privacyMode,
    peerIdentityReveal: "Hidden",
  });

  return {
    callId,
    inviteLink: buildInviteLink({ callId, inviteSecretBase64Url }),
    peer,
    localStream,
    hostKaigiKeys,
    createdAtMs: scheduledStartMs,
  };
}
```

`inviteLink` をあなたの UI に表示します.ユーザはそれをコピーしたり,別の財布に開けるか,またはアプリ経路に変換することができます:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## ゲスト: 会場 に 出席 する {#guest-join-a-meeting}

ゲストの流れ:

1. 招待状を解析する
2. Torii から暗号化された呼び出しの申し出を取得する
3. WebRTC の答えを作成する
4. `JoinKaigi` を暗号化された回答メタデータで提出する

```ts
export async function joinKaigiMeetingFromInvite(input: {
  context: KaigiContext;
  account: AccountContext;
  inviteLink: string;
}): Promise<{
  callId: string;
  peer: RTCPeerConnection;
  localStream: MediaStream;
}> {
  const { bridge, toriiUrl, chainId } = input.context;
  const { callId, inviteSecretBase64Url } = parseInviteLink(input.inviteLink);

  const meeting = await bridge.getKaigiCall({
    toriiUrl,
    callId,
    inviteSecretBase64Url,
  });

  if (meeting.ended) {
    throw new Error("This Kaigi meeting has already ended.");
  }
  if (Date.now() > meeting.expiresAtMs) {
    throw new Error("This Kaigi invite has expired.");
  }

  const localStream = await openLocalMedia();
  const peer = createPeer(localStream);
  const answerDescription = await createAnswerDescription(
    peer,
    meeting.offerDescription,
  );

  await bridge.joinKaigiMeeting({
    toriiUrl,
    chainId,
    participantAccountId: input.account.accountId,
    callId: meeting.callId,
    hostAccountId: meeting.hostAccountId,
    hostKaigiPublicKeyBase64Url: meeting.hostKaigiPublicKeyBase64Url,
    participantId: "guest",
    participantName: input.account.displayName,
    roomId: meeting.callId,
    privacyMode: meeting.privacyMode,
    rosterRootHex: meeting.rosterRootHex,
    answerDescription,
  });

  return { callId: meeting.callId, peer, localStream };
}
```

会議が透明である場合は,加入リクエストに財布表示文字列を追加できます.ユーザが明示的にそれを明らかにすることを選択しない限り,プライベート会議では `walletIdentity` を無セットにしておく.

## 主人公: ゲスト の 答え を 用いる {#host-apply-the-guest-answer}

ライブミーティングを作成した後,ホストは Kaigi イベントを視聴し,暗号化された応答信号に関するアンケートを行います.最初の有効な答えをホストのピア接続に適用します.

```ts
export async function watchForKaigiAnswer(input: {
  context: KaigiContext;
  hostAccountId: string;
  callId: string;
  hostKaigiKeys: KaigiSignalKeyPair;
  createdAtMs: number;
  peer: RTCPeerConnection;
  onParticipant?: (signal: KaigiSignal) => void;
}): Promise<string | null> {
  const { bridge, toriiUrl } = input.context;
  const seenSignals = new Set<string>();
  let lastSignalAtMs = input.createdAtMs;

  const checkSignals = async (): Promise<boolean> => {
    const signals = await bridge.pollKaigiMeetingSignals({
      toriiUrl,
      accountId: input.hostAccountId,
      callId: input.callId,
      hostKaigiKeys: input.hostKaigiKeys,
      afterTimestampMs: lastSignalAtMs,
    });

    const next = signals.find(
      (signal) => !seenSignals.has(signal.entrypointHash),
    );
    if (!next) {
      return false;
    }

    seenSignals.add(next.entrypointHash);
    lastSignalAtMs = Math.max(lastSignalAtMs, next.createdAtMs);
    await input.peer.setRemoteDescription(next.answerDescription);
    input.onParticipant?.(next);
    return true;
  };

  if (await checkSignals()) {
    return null;
  }

  return bridge.watchKaigiCallEvents(
    { toriiUrl, callId: input.callId },
    async (event) => {
      if (event.kind !== "ended") {
        await checkSignals();
      }
    },
  );
}
```

返済されたサブスクリプション ID を保存して,ホストが停電または移動するときにあなたの UI は監視器を止めることができます.

## 集会 の 終わり {#end-the-meeting}

呼び出しを作成したホストアカウントから終了します

```ts
export async function endKaigi(input: {
  context: KaigiContext;
  hostAccountId: string;
  callId: string;
  peer?: RTCPeerConnection;
  localStream?: MediaStream;
}): Promise<void> {
  input.peer?.close();
  input.localStream?.getTracks().forEach((track) => track.stop());

  await input.context.bridge.endKaigiMeeting({
    toriiUrl: input.context.toriiUrl,
    chainId: input.context.chainId,
    hostAccountId: input.hostAccountId,
    callId: input.callId,
    endedAtMs: Date.now(),
  });
}
```

## 民間形態の資金提供 {#private-mode-funding}

プライベート Kaigi の作成,加入,終了操作は,プライベート エントリーポイント料にシールド XOR を要求する可能性があります.アプリはそのエラーを検出し,再試する前に自閉保護アクションを提供する必要があります.

```ts
type PrivateKaigiFundingBridge = KaigiBridge & {
  getPrivateKaigiConfidentialXorState(input: {
    toriiUrl: string;
    accountId: string;
  }): Promise<{
    shieldedBalance: string | null;
    transparentBalance: string;
    canSelfShield: boolean;
    message?: string;
  }>;

  selfShieldPrivateKaigiXor(input: {
    toriiUrl: string;
    chainId: string;
    accountId: string;
    amount: string;
  }): Promise<{ hash: string }>;
};

export async function selfShieldForPrivateKaigi(input: {
  context: Omit<KaigiContext, "bridge"> & {
    bridge: PrivateKaigiFundingBridge;
  };
  accountId: string;
  amount: string;
}): Promise<void> {
  const { bridge, toriiUrl, chainId } = input.context;
  const state = await bridge.getPrivateKaigiConfidentialXorState({
    toriiUrl,
    accountId: input.accountId,
  });

  if (!state.canSelfShield) {
    throw new Error(
      state.message || "This account cannot self-shield XOR for private Kaigi.",
    );
  }

  await bridge.selfShieldPrivateKaigiXor({
    toriiUrl,
    chainId,
    accountId: input.accountId,
    amount: input.amount,
  });
}
```

デモでは, UI はユーザーに自己保護を提示し,元の作成または加入アクションを再試します.

## マニュアル・フォールバック {#manual-fallback}

自動シグネリングは,ライブウォレット, Kaigi - 対応する Torii ルート,およびプライベートモードで証明生成に依存します.開発と制限された環境のために手動のバックアップを保持してください.

- `CreateKaigi` が失敗した場合,オファーを含む手動招待状を表示します
- `JoinKaigi` が失敗した場合,原始回答パケットを表示する
- ホストが応答パケットを貼って `setRemoteDescription` に電話する.

WebRTC をデバッグするのに手動のバックアップが有用であるが,ライブ Kaigi ストリームと同じプライベートオンチェーン信号保証を提供していない.

## テストチェックリスト {#test-checklist}

ユニット試験では,ブリッジを模倣し,あなたの UI が予想される Kaigi 役に立たない負荷を通過することを確認してください.

- ホストはローカルメディアを作成し, `createKaigiMeeting` を提出します
- ホストは `iroha://kaigi/join?call=...&secret=...` の招待状を表示します
- ゲストは招待状を分析し, `getKaigiCall` に電話して, `joinKaigiMeeting` を提出します.
- 回答信号のホストアンケートや時計で答えを適用する
- 保護された場合 XOR の自動遮蔽のためのプライベートモード提示は欠けている.
- ライブシグナルが利用できないときに,手動のバックアップが表示されます.

完全な参照テストセットについては,デモアプリの Kaigi ビューとプレロードブリッジ試験を参照してください.

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

UI 煙のテストは, `/kaigi`経路が有効であることを確認する.実際のメディアテストには,2つの資金調達財布と2つの窓またはデバイスが必要です.トランザクション署名,カメラ,マイク,および WebRTC 権限は実行時間によって異なります.

テストを行う場合 TAIRA 呼び出しの特定のルート返却 `404`, まず,ホストウォレットが成功して送信されたことを確認します. `CreateKaigi`. リレー健康エンドポイントは,特定の呼び出しが行われる前に利用可能である.

## 次 の ステップ {#next-steps}

- `RecordKaigiUsage` で使用記録を追加すると,あなたのアプリは信頼性の高いセッション期間を計算します.
- `/v1/kaigi/relays`でリレーを登録し,モニターする.
- 操作者のダッシュボードの表面 `KaigiRosterSummary`, `KaigiUsageSummary`,および `KaigiRelayHealthUpdated` イベント
