---
translation_locale: zh-hans
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: e55c7aebc89c39edb8e7077db2414a6d432aafb05aff8df04c248fce444d7dea
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 嵌入式 Kaigi 在一个 JavaScript 应用程序 {#embed-kaigi-in-a-javascript-app}

Kaigi 允许应用程序创建一个对一个的音频/视频会议,支持钱包
它们的生命周期通过 Iroha. 浏览器仍然处理媒体
WebRTC, 在 Torii 在 Kaigi 指示提供持久会议
记录,加密信号传输元数据,私人名单支持和使用事件.

这本教程显示了
[Iroha 演示 JavaScript](https://github.com/soramitsu/iroha-demo-javascript)
应用程序:

- 转载器创造 WebRTC 报价和答案
- 申请桥标签和提交 Kaigi 交易
- 简单的邀请链接只载有呼叫 ID 秘密地邀请他们.
- 主持人看着 Torii 对于加密参与者的答案

这些例子使用 TypeScript 它们可以运行在电子中,
一个安全后端的浏览器,或者一个拥有钱包扩展的网页应用程序.
在生产中,不值得信赖的染码之外的私钥.

## 预先条件 {#prerequisites}

你需要:

- 一个 Kaigi- 有能力 Torii 终点
- 东方的账户和客人的账户
- 通过安全应用程序桥梁或钱包访问每个帐户的签名密钥
- 浏览器摄像头/麦克风权限
- Node.js 如果您正在使用 JavaScript 演示或原生
  `@iroha/iroha-js` 直接绑定

为了获得完整的工作参考, Iroha 来源
现金:

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

使用示范
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
从兄弟姐妹 Iroha 它的源存储库. `file:` 依赖性解决了
如果本地绑定变化,
`iroha/javascript/iroha_js`; 清洁包装目录不包含
需要的货物工作空间 `npm run build:native`.

之前,在 TAIRA, 检查公众 Torii 表面
演示取决于:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/v1/kaigi/relays"
curl -fsS "$TAIRA/v1/kaigi/relays/health"
```

这些命令证实 TAIRA 是活着的. Kaigi 继电器遥测是
它们没有提交 Kaigi 一个真正的交易 `CreateKaigi` 或
`JoinKaigi` 资助的测试需求 TAIRA 通过演示的账户和签名
桥或其他支钱包的桥.

## 建筑 {#architecture}

保持 Kaigi 集成分为三层:

| 层 | 责任 |
| --- | --- |
| UI | 选项,会议表格,邀请链接显示,媒体控制 |
| WebRTC | `RTCPeerConnection`, 地方媒体,报价及答案描述 |
| Iroha 桥梁 | 签字, `CreateKaigi`, `JoinKaigi`, `EndKaigi`, 信号投票 |

应用程序桥梁可以是电子预装 API, 一个钱包扩展器,或一个后端
它应该暴露一个小的表面 UI:

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

在演示应用中,这些桥梁方法是通过
`@iroha/iroha-js`, 地方签名,加密 Kaigi 转载数据 Torii 电话.

## 邀请助手 {#invite-helpers}

使用 Torii- 兼容的电话 IDs 在 `domain.dataspace:meeting` 演示
使用 `kaigi.universal:<call-name>` 对于生成的会议.

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

主持人创建了一个报价, `CreateKaigi`, 并且保持了
客人将加密的信息传递给客人.
提供,创建一个答案, `JoinKaigi`.

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

连接流到你的 UI 有普通视频元素:

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

## 主持人:创建一个会议链接 {#host-create-a-meeting-link}

主机流量:

1. 开放式相机和麦克风
2. 创建一个 Kaigi 信号键对
3. 创建一个 WebRTC 报价
4. 提交 `CreateKaigi`
5. 分享一个紧的邀请链接

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

表演 `inviteLink` 在你的 UI. 用户可以复制,在另一个钱包中打开.
或将其转换为应用程序路线,如:

```ts
export function inviteRoute(inviteLink: string): string {
  const invite = parseInviteLink(inviteLink);
  return `/kaigi?call=${encodeURIComponent(invite.callId)}&secret=${encodeURIComponent(
    invite.inviteSecretBase64Url,
  )}`;
}
```

## 嘉宾:参加一次会议 {#guest-join-a-meeting}

客人流量:

1. 分析邀请
2. 获取加密通话的报价 Torii
3. 创建一个 WebRTC 答案
4. 提交 `JoinKaigi` 有加密答案元数据

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

如果会议是透明的,您可以在
对于私人会议,请保持 `walletIdentity` 除非用户设置
他选择明确地透露.

## 主持人:用客人的回答 {#host-apply-the-guest-answer}

在创建现场会议后,主持人应该观看 Kaigi 活动和民意调查
应用第一个有效的答案到主机的同行
连接.

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

存储返回订阅 ID 所以你的 UI 监视者可以在
宿主挂了电话,或者离开了.

## 会议结束 {#end-the-meeting}

结束来自创建该帐户的呼叫:

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

## 私人方式融资 {#private-mode-funding}

个人 Kaigi 创建,合并和终结操作可能需要屏蔽 XOR 对于
你的应用程序应该发现这个错误,
在重新尝试之前,自卫行动.

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

在演示中, UI 要求用户自卫,然后再尝试
创建或加入行动.

## 手动回归 {#manual-fallback}

自动信号依赖于现场钱包, Kaigi- 有能力 Torii 航线和
在私人模式下生成证据.
限制环境:

- 如果 `CreateKaigi` 如果不成功,请显示包含该报价的手动邀请
- 如果 `JoinKaigi` 失败,显示原始答案包
- 让主机粘贴答案包,然后打电话 `setRemoteDescription`

手动倒退是用于调试 WebRTC, 但它并未提供
与直播网络相同的私人连锁信号保证 Kaigi 流量.

## 测试检查列表 {#test-checklist}

对于单元测试,请嘲笑桥梁,并确认您的 UI 超过预期
Kaigi 有效载荷:

- 主持人创建本地媒体并提交 `createKaigiMeeting`
- 主机显示一个 `iroha://kaigi/join?call=...&secret=...` 邀请
- 客人分析邀请,电话 `getKaigiCall`, 提交
  `joinKaigiMeeting`
- 接待民意调查或答案信号的钟表,并应用答案
- 隐私模式提示,在屏蔽时进行自我屏蔽 XOR 失踪
- 当没有现场信号时出现手动倒车

对于一个完整的参考测试套件,请参阅演示应用程序 Kaigi 视图和预装
桥梁测试:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
```

其他 UI 烟雾测试证明 `/kaigi` 一个真正的媒体测试
还需要两个资金的钱包加上两个窗户或设备,因为交易
签字,摄像头,麦克风和 WebRTC 根据运行时间的权限不同.

如果您正在测试 TAIRA 和通话特定路线返回 `404`, 首先
确认主机钱包成功提交 `CreateKaigi`. 继电器健康
在任何特定的呼叫发生之前,终端点可供使用.

## 下一步 {#next-steps}

- 添加使用记录 `RecordKaigiUsage` 当您的应用程序可靠时
  会议时间会计.
- 通过登记和监控继电器 `/v1/kaigi/relays` 在使用继电器时
  它们的表现.
- 表面 `KaigiRosterSummary`, `KaigiUsageSummary`, 并且
  `KaigiRelayHealthUpdated` 在操作员仪表板中的事件.
