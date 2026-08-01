---
translation_locale: zh-hant
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 在 JavaScript 應用中嵌入 Kaigi {#embed-kaigi-in-a-javascript-app}

Kaigi 允許應用程序創建一個人對一個的音頻/視頻會議,其生命週期通過 Iroha. 瀏覽器仍然處理媒體 WebRTC, 在 Torii 和 Kaigi 指示提供持久的會議記錄,加密信號傳輸元數據,私人名單支持和使用事件.

本教程顯示了 [Iroha Demo JavaScript](https://github.com/soramitsu/iroha-demo-javascript)應用程序所使用的最小集成模式:

- 轉載者創建 WebRTC 的報價和答案
- 申請橋標籤和提交 Kaigi 交易
- 簡單的邀請鏈接只包含調用 ID 和祕密的邀請.
- 主機觀察 Torii 進行加密參與者的答案

這些示例使用 TypeScript 並被編寫以使它們可以運行在Electron,一個安全後端的瀏覽器或一個帶錢包擴展的網頁應用程序中.

## 預先條件 {#prerequisites}

你需要:

- 一個具有 Kaigi 能力的 Torii 終端點
- 寄宿人的賬戶和客人的帳戶
- 通過安全應用程序橋樑或錢包獲取每個帳戶的簽名密鑰
- 瀏覽器攝像頭/麥克風權限
- Node.js 20+ 如果您直接使用 JavaScript 示範或本地`@iroha/iroha-js`綁定

爲了獲得完整的工作參考,在 Iroha 來源檢查旁邊克隆示範:

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

使用演示 [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) 從兄弟姐妹 Iroha 它的源存儲庫. `file:` 如果本土的綁定變化,重建它根據 `iroha/javascript/iroha_js`; 清潔包裝目錄不包含需要的貨物工作空間 `npm run build:native`.

在在 TAIRA 上進行現場會議之前,請檢查演示程序依賴於的公共 Torii 表面:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

這些命令驗證 TAIRA 是現場的,並且 Kaigi 繼電遠程測量可用.它們不提交 Kaigi 交易.一個真正的`CreateKaigi`或`JoinKaigi`測試需要資助 TAIRA 賬戶和通過演示橋或其他錢包支的橋簽名.

## 建築 {#architecture}

保持 Kaigi 集成分爲三個層:

|層|責任|
| --- | --- |
|UI|邀請鏈接顯示,媒體控制方式|
|WebRTC|`RTCPeerConnection`,當地媒體,報價和答案描述 |
|Iroha 橋|簽名, `CreateKaigi`, `JoinKaigi`, `EndKaigi`,信號投票 |

應用程序橋樑可以是電子預裝 API,錢包擴展或後端終點. 它應該暴露在一個小的表面上 UI:

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

在演示應用中,這些橋樑方法是通過 `@iroha/iroha-js`,本地簽名,加密 Kaigi 元數據和 Torii 通話實現的.

## 邀請助手 {#invite-helpers}

使用 Torii- 兼容的電話 IDs 在 `domain.dataspace:meeting` 在演示中使用 `kaigi.universal:<call-name>` 對於產生會議.

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

## WebRTC 助手 {#webrtc-helpers}

主持人創建了一個報價,通過 `CreateKaigi`存儲它,並保持窗口開放,以便它可以應用客人的答案. 客人獲取加密的報價,創建一個答案,併發出答案的帖子與 `JoinKaigi`.

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

通過普通的視頻元素將流連接到您的 UI:

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

## 主持人: 創建一個會議鏈接 {#host-create-a-meeting-link}

宿主流量:

1. 開放式攝像機和麥克風
2. 創建一個 Kaigi 信號鍵對
3. 創建一個 WebRTC 的報價
4. 提交 `CreateKaigi`
5. 分享一個緊的邀請鏈接

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

在您的 UI 中顯示`inviteLink`.用戶可以複製它,在另一個錢包中打開它,或者將其轉換爲應用程序路線,如:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## 嘉賓:參加一次會議 {#guest-join-a-meeting}

客人的流量:

1. 分析邀請
2. 從 Torii 獲取加密通話報價.
3. 創建一個 WebRTC 答案
4. 提交 `JoinKaigi` 與加密答案元數據

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

如果會議是透明的,您可以在加入請求中包括一個錢包顯示字符串. `walletIdentity` 除非使用者明確選擇披露.

## 主持人:用客人的答案 {#host-apply-the-guest-answer}

在創建現場會議後,主機應該觀看 Kaigi 事件並查詢加密答案信號.將第一個有效的答案應用於主機的同行連接.

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

存儲返回訂閱 ID 以便您的 UI 可以在主機關上或導航離開時停止觀看器.

## 會議結束 {#end-the-meeting}

結束來自創建它的主機帳戶的呼叫:

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

## 私人模式的資金 {#private-mode-funding}

專用 Kaigi 創建,加入和終結操作可能需要屏蔽的 XOR 用於私人入口點費用.您的應用程序應該發現這個錯誤,並在重新嘗試之前提供自我屏蔽行動.

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

在演示中, UI 提示用戶自我屏蔽,然後重新嘗試創建或加入原始操作.

## 手動迴歸 {#manual-fallback}

自動信號取決於現場錢包, Kaigi - 能力的 Torii 路線,以及私人模式中的證明生成.

- 如果 `CreateKaigi` 失敗,請顯示包含該報價的手動邀請.
- 如果 `JoinKaigi` 失敗,請顯示原始答案包
- 讓主機粘貼答案包,然後撥打 `setRemoteDescription`

手動反彈對調試 WebRTC 有用,但它不提供與直播 Kaigi 流程相同的私人鏈上信號保證.

## 測試檢查列表 {#test-checklist}

在單元測試中,請模仿橋樑並確認您的 UI 超越預期的 Kaigi 有用負載:

- 主機創建本地媒體,並提交 `createKaigiMeeting`
- 接待者顯示`iroha://kaigi/join?call=...&secret=...`邀請
- 客人分析邀請,打電話 `getKaigiCall`,並提交 `joinKaigiMeeting`
- 舉辦民意調查或對答案信號的鐘表,並應用答案
- 缺失屏蔽時自閉保護的私人模式提示 XOR
- 當沒有現場信號時,出現手動倒車

對於一個完整的參考測試套件,請參見示範應用程序的 Kaigi 視圖和預裝橋樑測試:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

UI 煙霧測試驗證了`/kaigi`路線的效果.真正的媒體測試仍然需要兩個資助錢包加上兩個窗戶或設備,因爲交易簽名,攝像頭,麥克風和 WebRTC 權限因運行時間而不同.

如果您正在對 TAIRA 進行測試,並且呼叫特定的路線返回 `404`,首先確認主機錢包成功提交 `CreateKaigi`.在任何特定呼叫之前,繼電器健康終端點可獲得.

## 下一步 {#next-steps}

- 如果您的應用程序有可靠的會計會議時間,請使用 `RecordKaigiUsage` 添加用戶記錄.
- 通過 `/v1/kaigi/relays`記錄和監測繼電器,使用繼電器表格.
- 在操作員儀表板中的表面 `KaigiRosterSummary`, `KaigiUsageSummary`和 `KaigiRelayHealthUpdated`事件.
