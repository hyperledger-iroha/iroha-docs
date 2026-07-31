---
translation_locale: zh-hant
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 嵌入式 Kaigi 在一個 JavaScript 應用程式 {#embed-kaigi-in-a-javascript-app}

Kaigi 讓應用程式建立一個人對一的音頻/視訊會議,
生命周期在 Iroha. 您的浏览器仍處理媒體
WebRTC, 在此之前 Torii 這種情況 Kaigi 指示提供持久的會議
記錄,加密的訊息元數據,私人名單支持和使用事件.

這本教程顯示了
[Iroha 演示活動 JavaScript](https://github.com/soramitsu/iroha-demo-javascript)
應用程式:

- 呈現者創造 WebRTC 提供和答案
- 申請橋標示及提交 Kaigi 交易
- 簡約的邀請連結只包含呼叫 ID 邀請他們做秘密活動.
- 主持人觀察 Torii 在加密參與者答案中

這種例子使用 TypeScript 能在電子中運行,
或是有錢包延伸的網路應用程式.
在產品中使用不值得信賴的傳染碼之外的私密鍵.

## 必須的條件 {#prerequisites}

你需要:

- 其他 Kaigi- 有能力的 Torii 終點點
- 寄宿主和客人的帳號
- 透過安全的應用程式橋或錢包,
- 浏览器攝像機/麥克風權限
- Node.js 如果您使用 JavaScript 試用或原生
  `@iroha/iroha-js` 直接結束

請將示範在一個 Iroha 來源
預購時間:

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

請使用示範
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
來自兄弟姐妹 Iroha 該資料庫的源頭是 `file:` 依賴性解決了這些問題
如果原始結合變化,
`iroha/javascript/iroha_js`; 沒有清潔包裝目錄
需要使用的貨物工作空間 `npm run build:native`.

在開展現場會議之前, TAIRA, 檢查公眾 Torii 表面上,
演示取決於:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

這些命令證明了 TAIRA 還是活著, Kaigi 接線電測是
他們不提交 Kaigi 沒有任何可能的交易. `CreateKaigi` 或是
`JoinKaigi` 提供資金的測試需求 TAIRA 透過演示的帳戶和簽名
或是其他支錢包的橋梁.

## 建築 {#architecture}

請留下 Kaigi 集成分為三層:

| 層次 | 負責 |
| --- | --- |
| UI | 選擇帳戶,會議表格,邀請連結顯示,媒體控制 |
| WebRTC | `RTCPeerConnection`, 地方媒體,優惠及答案描述 |
| Iroha 橋 | 簽名, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, 訊號調查 |

應用程式橋梁可以是電子預載 API, 財布延伸或後端
該標籤應顯示一個小的表面 UI:

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

在演示應用程式中,
`@iroha/iroha-js`, 在當地簽名,加密 Kaigi 數據,以及 Torii 這樣的電話.

## 邀請助手 {#invite-helpers}

使用 Torii- 兼容的呼叫 IDs 在這個國家 `domain.dataspace:meeting` 這樣的演示
使用方式 `kaigi.universal:<call-name>` 關於會議.

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

## WebRTC 幫助者 {#webrtc-helpers}

接待者創造了一份優惠, `CreateKaigi`, 並保持了
客人將加密的訊息收回,
提供,創造一個答案, `JoinKaigi`.

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

請將流線連接到您的 UI 有一般的視頻元素:

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

## 主持人:建立會議連結 {#host-create-a-meeting-link}

接待者流量:

1. 打開相機和麥克風
2. 建立一個 Kaigi 訊號鍵對
3. 建立一個 WebRTC 提供
4. 提交 `CreateKaigi`
5. 分享一個簡約的邀請連結

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

顯示 `inviteLink` 在您的 UI. 該網站的使用者可以複製,
或將它轉換為應用程式路線,例如:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## 邀請者:參加會議 {#guest-join-a-meeting}

這裡的客人流量:

1. 解析邀請
2. 請收取加密呼叫的優惠 Torii
3. 建立一個 WebRTC 答案
4. 提交 `JoinKaigi` 有加密的答案元數據

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

如果會議是透明的,
在私人會議中, `walletIdentity` 除非使用者
沒有人能明顯地透露.

## 接待者:使用嘉賓的答案 {#host-apply-the-guest-answer}

接待者應該觀看 Kaigi 活動和民調
應用第一個有效的答案給主機的同行
聯繫.

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

儲存返回的訂閱 ID 所以你的 UI 能阻止觀察員,
接待者會關上電視機或離開.

## 結束會議 {#end-the-meeting}

結束從創建它的主機帳戶的呼叫:

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

## 民間方式的資金提供 {#private-mode-funding}

獨立 Kaigi 建立,加入和完成操作可能需要保護 XOR 關於
你的應用程式應該抓住這個錯誤,
在重新嘗試之前,

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

在演示中, UI 請使用者自閉屏幕,
創建或加入原始行動.

## 預覽 預覽 {#manual-fallback}

自動訊息取決於現實錢包, Kaigi- 有能力的 Torii 航線,以及
在私人模式下生成證據.
限制環境:

- 如果 `CreateKaigi` 如果未能,請顯示包含該活動的手動邀請.
- 如果 `JoinKaigi` 如果失敗,顯示原始答案包
- 讓主機貼上答案包, `setRemoteDescription`

手動倒退是用于預防問題 WebRTC, 但它並不提供
同樣的私人連鎖訊息保證, Kaigi 這樣的流量.

## 檢查名單 {#test-checklist}

檢測的單位, 笑橋口, UI 超過預期的數量
Kaigi 使用負荷:

- 主持人建立本地媒體, `createKaigiMeeting`
- 接待者顯示 `iroha://kaigi/join?call=...&secret=...` 邀請他們
- 客人分析邀請,電話 `getKaigiCall`, 並提交
  `joinKaigiMeeting`
- 接待民調或回覆訊號的鐘,並應用答案
- 在隱私模式時, 自動屏蔽提示 XOR 沒有
- 當無法提供直播訊息時,

請查看示範應用程式的全文參考測試套件 Kaigi 顯示和預載
橋測試:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

其他國家 UI 煙霧測試證明了 `/kaigi` 實際的媒體測試
還需要兩張資金的錢包加上兩個窗口或裝置,
簽名,攝影機,麥克風,以及 WebRTC 許可會因運行時間而變化.

如果您正在測試 TAIRA 及通話特定路線返回 `404`, 首先
確認主機錢包已成功提交 `CreateKaigi`. 接力健康
在任何特定的呼叫之前,

## 接下來的步 {#next-steps}

- 添加使用记录 `RecordKaigiUsage` 當您的應用程式可靠時
  會計會議時間
- 通過的記錄和監控接力 `/v1/kaigi/relays` 在使用接力時
  顯示.
- 表面 `KaigiRosterSummary`, `KaigiUsageSummary`, 及其他
  `KaigiRelayHealthUpdated` 在您的操作員儀表板上的事件.
